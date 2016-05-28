'use strict';

var composeArgs = require('./_composeArgs'),
    composeArgsRight = require('./_composeArgsRight'),
    replaceHolders = require('./_replaceHolders');

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    ARY_FLAG = 128,
    REARG_FLAG = 256;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Merges the function metadata of `source` into `data`.
 *
 * Merging metadata reduces the number of wrappers used to invoke a function.
 * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
 * may be applied regardless of execution order. Methods like `_.ary` and
 * `_.rearg` modify function arguments, making the order in which they are
 * executed important, preventing the merging of metadata. However, we make
 * an exception for a safe combined case where curried functions have `_.ary`
 * and or `_.rearg` applied.
 *
 * @private
 * @param {Array} data The destination metadata.
 * @param {Array} source The source metadata.
 * @returns {Array} Returns `data`.
 */
function mergeData(data, source) {
  var bitmask = data[1],
      srcBitmask = source[1],
      newBitmask = bitmask | srcBitmask,
      isCommon = newBitmask < (BIND_FLAG | BIND_KEY_FLAG | ARY_FLAG);

  var isCombo = srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG || srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8] || srcBitmask == (ARY_FLAG | REARG_FLAG) && source[7].length <= source[8] && bitmask == CURRY_FLAG;

  // Exit early if metadata can't be merged.
  if (!(isCommon || isCombo)) {
    return data;
  }
  // Use source `thisArg` if available.
  if (srcBitmask & BIND_FLAG) {
    data[2] = source[2];
    // Set when currying a bound function.
    newBitmask |= bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG;
  }
  // Compose partial arguments.
  var value = source[3];
  if (value) {
    var partials = data[3];
    data[3] = partials ? composeArgs(partials, value, source[4]) : value;
    data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
  }
  // Compose partial right arguments.
  value = source[5];
  if (value) {
    partials = data[5];
    data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
    data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
  }
  // Use source `argPos` if available.
  value = source[7];
  if (value) {
    data[7] = value;
  }
  // Use source `ary` if it's smaller.
  if (srcBitmask & ARY_FLAG) {
    data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
  }
  // Use source `arity` if one is not provided.
  if (data[9] == null) {
    data[9] = source[9];
  }
  // Use source `func` and merge bitmasks.
  data[0] = source[0];
  data[1] = newBitmask;

  return data;
}

module.exports = mergeData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19tZXJnZURhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFkO0lBQ0EsbUJBQW1CLFFBQVEscUJBQVIsQ0FBbkI7SUFDQSxpQkFBaUIsUUFBUSxtQkFBUixDQUFqQjs7O0FBR0osSUFBSSxjQUFjLHdCQUFkOzs7QUFHSixJQUFJLFlBQVksQ0FBWjtJQUNBLGdCQUFnQixDQUFoQjtJQUNBLG1CQUFtQixDQUFuQjtJQUNBLGFBQWEsQ0FBYjtJQUNBLFdBQVcsR0FBWDtJQUNBLGFBQWEsR0FBYjs7O0FBR0osSUFBSSxZQUFZLEtBQUssR0FBTDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JoQixTQUFTLFNBQVQsQ0FBbUIsSUFBbkIsRUFBeUIsTUFBekIsRUFBaUM7QUFDL0IsTUFBSSxVQUFVLEtBQUssQ0FBTCxDQUFWO01BQ0EsYUFBYSxPQUFPLENBQVAsQ0FBYjtNQUNBLGFBQWEsVUFBVSxVQUFWO01BQ2IsV0FBVyxjQUFjLFlBQVksYUFBWixHQUE0QixRQUE1QixDQUFkLENBSmdCOztBQU0vQixNQUFJLFVBQ0YsVUFBRSxJQUFjLFFBQWQsSUFBNEIsV0FBVyxVQUFYLElBQzdCLFVBQUMsSUFBYyxRQUFkLElBQTRCLFdBQVcsVUFBWCxJQUEyQixLQUFLLENBQUwsRUFBUSxNQUFSLElBQWtCLE9BQU8sQ0FBUCxDQUFsQixJQUN4RCxVQUFDLEtBQWUsV0FBVyxVQUFYLENBQWYsSUFBMkMsT0FBTyxDQUFQLEVBQVUsTUFBVixJQUFvQixPQUFPLENBQVAsQ0FBcEIsSUFBbUMsV0FBVyxVQUFYOzs7QUFUbkQsTUFZM0IsRUFBRSxZQUFZLE9BQVosQ0FBRixFQUF3QjtBQUMxQixXQUFPLElBQVAsQ0FEMEI7R0FBNUI7O0FBWitCLE1BZ0IzQixhQUFhLFNBQWIsRUFBd0I7QUFDMUIsU0FBSyxDQUFMLElBQVUsT0FBTyxDQUFQLENBQVY7O0FBRDBCLGNBRzFCLElBQWMsVUFBVSxTQUFWLEdBQXNCLENBQXRCLEdBQTBCLGdCQUExQixDQUhZO0dBQTVCOztBQWhCK0IsTUFzQjNCLFFBQVEsT0FBTyxDQUFQLENBQVIsQ0F0QjJCO0FBdUIvQixNQUFJLEtBQUosRUFBVztBQUNULFFBQUksV0FBVyxLQUFLLENBQUwsQ0FBWCxDQURLO0FBRVQsU0FBSyxDQUFMLElBQVUsV0FBVyxZQUFZLFFBQVosRUFBc0IsS0FBdEIsRUFBNkIsT0FBTyxDQUFQLENBQTdCLENBQVgsR0FBcUQsS0FBckQsQ0FGRDtBQUdULFNBQUssQ0FBTCxJQUFVLFdBQVcsZUFBZSxLQUFLLENBQUwsQ0FBZixFQUF3QixXQUF4QixDQUFYLEdBQWtELE9BQU8sQ0FBUCxDQUFsRCxDQUhEO0dBQVg7O0FBdkIrQixPQTZCL0IsR0FBUSxPQUFPLENBQVAsQ0FBUixDQTdCK0I7QUE4Qi9CLE1BQUksS0FBSixFQUFXO0FBQ1QsZUFBVyxLQUFLLENBQUwsQ0FBWCxDQURTO0FBRVQsU0FBSyxDQUFMLElBQVUsV0FBVyxpQkFBaUIsUUFBakIsRUFBMkIsS0FBM0IsRUFBa0MsT0FBTyxDQUFQLENBQWxDLENBQVgsR0FBMEQsS0FBMUQsQ0FGRDtBQUdULFNBQUssQ0FBTCxJQUFVLFdBQVcsZUFBZSxLQUFLLENBQUwsQ0FBZixFQUF3QixXQUF4QixDQUFYLEdBQWtELE9BQU8sQ0FBUCxDQUFsRCxDQUhEO0dBQVg7O0FBOUIrQixPQW9DL0IsR0FBUSxPQUFPLENBQVAsQ0FBUixDQXBDK0I7QUFxQy9CLE1BQUksS0FBSixFQUFXO0FBQ1QsU0FBSyxDQUFMLElBQVUsS0FBVixDQURTO0dBQVg7O0FBckMrQixNQXlDM0IsYUFBYSxRQUFiLEVBQXVCO0FBQ3pCLFNBQUssQ0FBTCxJQUFVLEtBQUssQ0FBTCxLQUFXLElBQVgsR0FBa0IsT0FBTyxDQUFQLENBQWxCLEdBQThCLFVBQVUsS0FBSyxDQUFMLENBQVYsRUFBbUIsT0FBTyxDQUFQLENBQW5CLENBQTlCLENBRGU7R0FBM0I7O0FBekMrQixNQTZDM0IsS0FBSyxDQUFMLEtBQVcsSUFBWCxFQUFpQjtBQUNuQixTQUFLLENBQUwsSUFBVSxPQUFPLENBQVAsQ0FBVixDQURtQjtHQUFyQjs7QUE3QytCLE1BaUQvQixDQUFLLENBQUwsSUFBVSxPQUFPLENBQVAsQ0FBVixDQWpEK0I7QUFrRC9CLE9BQUssQ0FBTCxJQUFVLFVBQVYsQ0FsRCtCOztBQW9EL0IsU0FBTyxJQUFQLENBcEQrQjtDQUFqQzs7QUF1REEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6Il9tZXJnZURhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY29tcG9zZUFyZ3MgPSByZXF1aXJlKCcuL19jb21wb3NlQXJncycpLFxuICAgIGNvbXBvc2VBcmdzUmlnaHQgPSByZXF1aXJlKCcuL19jb21wb3NlQXJnc1JpZ2h0JyksXG4gICAgcmVwbGFjZUhvbGRlcnMgPSByZXF1aXJlKCcuL19yZXBsYWNlSG9sZGVycycpO1xuXG4vKiogVXNlZCBhcyB0aGUgaW50ZXJuYWwgYXJndW1lbnQgcGxhY2Vob2xkZXIuICovXG52YXIgUExBQ0VIT0xERVIgPSAnX19sb2Rhc2hfcGxhY2Vob2xkZXJfXyc7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHdyYXBwZXIgbWV0YWRhdGEuICovXG52YXIgQklORF9GTEFHID0gMSxcbiAgICBCSU5EX0tFWV9GTEFHID0gMixcbiAgICBDVVJSWV9CT1VORF9GTEFHID0gNCxcbiAgICBDVVJSWV9GTEFHID0gOCxcbiAgICBBUllfRkxBRyA9IDEyOCxcbiAgICBSRUFSR19GTEFHID0gMjU2O1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogTWVyZ2VzIHRoZSBmdW5jdGlvbiBtZXRhZGF0YSBvZiBgc291cmNlYCBpbnRvIGBkYXRhYC5cbiAqXG4gKiBNZXJnaW5nIG1ldGFkYXRhIHJlZHVjZXMgdGhlIG51bWJlciBvZiB3cmFwcGVycyB1c2VkIHRvIGludm9rZSBhIGZ1bmN0aW9uLlxuICogVGhpcyBpcyBwb3NzaWJsZSBiZWNhdXNlIG1ldGhvZHMgbGlrZSBgXy5iaW5kYCwgYF8uY3VycnlgLCBhbmQgYF8ucGFydGlhbGBcbiAqIG1heSBiZSBhcHBsaWVkIHJlZ2FyZGxlc3Mgb2YgZXhlY3V0aW9uIG9yZGVyLiBNZXRob2RzIGxpa2UgYF8uYXJ5YCBhbmRcbiAqIGBfLnJlYXJnYCBtb2RpZnkgZnVuY3Rpb24gYXJndW1lbnRzLCBtYWtpbmcgdGhlIG9yZGVyIGluIHdoaWNoIHRoZXkgYXJlXG4gKiBleGVjdXRlZCBpbXBvcnRhbnQsIHByZXZlbnRpbmcgdGhlIG1lcmdpbmcgb2YgbWV0YWRhdGEuIEhvd2V2ZXIsIHdlIG1ha2VcbiAqIGFuIGV4Y2VwdGlvbiBmb3IgYSBzYWZlIGNvbWJpbmVkIGNhc2Ugd2hlcmUgY3VycmllZCBmdW5jdGlvbnMgaGF2ZSBgXy5hcnlgXG4gKiBhbmQgb3IgYF8ucmVhcmdgIGFwcGxpZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgVGhlIGRlc3RpbmF0aW9uIG1ldGFkYXRhLlxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBzb3VyY2UgbWV0YWRhdGEuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGRhdGFgLlxuICovXG5mdW5jdGlvbiBtZXJnZURhdGEoZGF0YSwgc291cmNlKSB7XG4gIHZhciBiaXRtYXNrID0gZGF0YVsxXSxcbiAgICAgIHNyY0JpdG1hc2sgPSBzb3VyY2VbMV0sXG4gICAgICBuZXdCaXRtYXNrID0gYml0bWFzayB8IHNyY0JpdG1hc2ssXG4gICAgICBpc0NvbW1vbiA9IG5ld0JpdG1hc2sgPCAoQklORF9GTEFHIHwgQklORF9LRVlfRkxBRyB8IEFSWV9GTEFHKTtcblxuICB2YXIgaXNDb21ibyA9XG4gICAgKChzcmNCaXRtYXNrID09IEFSWV9GTEFHKSAmJiAoYml0bWFzayA9PSBDVVJSWV9GTEFHKSkgfHxcbiAgICAoKHNyY0JpdG1hc2sgPT0gQVJZX0ZMQUcpICYmIChiaXRtYXNrID09IFJFQVJHX0ZMQUcpICYmIChkYXRhWzddLmxlbmd0aCA8PSBzb3VyY2VbOF0pKSB8fFxuICAgICgoc3JjQml0bWFzayA9PSAoQVJZX0ZMQUcgfCBSRUFSR19GTEFHKSkgJiYgKHNvdXJjZVs3XS5sZW5ndGggPD0gc291cmNlWzhdKSAmJiAoYml0bWFzayA9PSBDVVJSWV9GTEFHKSk7XG5cbiAgLy8gRXhpdCBlYXJseSBpZiBtZXRhZGF0YSBjYW4ndCBiZSBtZXJnZWQuXG4gIGlmICghKGlzQ29tbW9uIHx8IGlzQ29tYm8pKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbiAgLy8gVXNlIHNvdXJjZSBgdGhpc0FyZ2AgaWYgYXZhaWxhYmxlLlxuICBpZiAoc3JjQml0bWFzayAmIEJJTkRfRkxBRykge1xuICAgIGRhdGFbMl0gPSBzb3VyY2VbMl07XG4gICAgLy8gU2V0IHdoZW4gY3VycnlpbmcgYSBib3VuZCBmdW5jdGlvbi5cbiAgICBuZXdCaXRtYXNrIHw9IGJpdG1hc2sgJiBCSU5EX0ZMQUcgPyAwIDogQ1VSUllfQk9VTkRfRkxBRztcbiAgfVxuICAvLyBDb21wb3NlIHBhcnRpYWwgYXJndW1lbnRzLlxuICB2YXIgdmFsdWUgPSBzb3VyY2VbM107XG4gIGlmICh2YWx1ZSkge1xuICAgIHZhciBwYXJ0aWFscyA9IGRhdGFbM107XG4gICAgZGF0YVszXSA9IHBhcnRpYWxzID8gY29tcG9zZUFyZ3MocGFydGlhbHMsIHZhbHVlLCBzb3VyY2VbNF0pIDogdmFsdWU7XG4gICAgZGF0YVs0XSA9IHBhcnRpYWxzID8gcmVwbGFjZUhvbGRlcnMoZGF0YVszXSwgUExBQ0VIT0xERVIpIDogc291cmNlWzRdO1xuICB9XG4gIC8vIENvbXBvc2UgcGFydGlhbCByaWdodCBhcmd1bWVudHMuXG4gIHZhbHVlID0gc291cmNlWzVdO1xuICBpZiAodmFsdWUpIHtcbiAgICBwYXJ0aWFscyA9IGRhdGFbNV07XG4gICAgZGF0YVs1XSA9IHBhcnRpYWxzID8gY29tcG9zZUFyZ3NSaWdodChwYXJ0aWFscywgdmFsdWUsIHNvdXJjZVs2XSkgOiB2YWx1ZTtcbiAgICBkYXRhWzZdID0gcGFydGlhbHMgPyByZXBsYWNlSG9sZGVycyhkYXRhWzVdLCBQTEFDRUhPTERFUikgOiBzb3VyY2VbNl07XG4gIH1cbiAgLy8gVXNlIHNvdXJjZSBgYXJnUG9zYCBpZiBhdmFpbGFibGUuXG4gIHZhbHVlID0gc291cmNlWzddO1xuICBpZiAodmFsdWUpIHtcbiAgICBkYXRhWzddID0gdmFsdWU7XG4gIH1cbiAgLy8gVXNlIHNvdXJjZSBgYXJ5YCBpZiBpdCdzIHNtYWxsZXIuXG4gIGlmIChzcmNCaXRtYXNrICYgQVJZX0ZMQUcpIHtcbiAgICBkYXRhWzhdID0gZGF0YVs4XSA9PSBudWxsID8gc291cmNlWzhdIDogbmF0aXZlTWluKGRhdGFbOF0sIHNvdXJjZVs4XSk7XG4gIH1cbiAgLy8gVXNlIHNvdXJjZSBgYXJpdHlgIGlmIG9uZSBpcyBub3QgcHJvdmlkZWQuXG4gIGlmIChkYXRhWzldID09IG51bGwpIHtcbiAgICBkYXRhWzldID0gc291cmNlWzldO1xuICB9XG4gIC8vIFVzZSBzb3VyY2UgYGZ1bmNgIGFuZCBtZXJnZSBiaXRtYXNrcy5cbiAgZGF0YVswXSA9IHNvdXJjZVswXTtcbiAgZGF0YVsxXSA9IG5ld0JpdG1hc2s7XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2VEYXRhO1xuIl19