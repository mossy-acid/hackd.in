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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19tZXJnZURhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFsQjtJQUNJLG1CQUFtQixRQUFRLHFCQUFSLENBRHZCO0lBRUksaUJBQWlCLFFBQVEsbUJBQVIsQ0FGckI7OztBQUtBLElBQUksY0FBYyx3QkFBbEI7OztBQUdBLElBQUksWUFBWSxDQUFoQjtJQUNJLGdCQUFnQixDQURwQjtJQUVJLG1CQUFtQixDQUZ2QjtJQUdJLGFBQWEsQ0FIakI7SUFJSSxXQUFXLEdBSmY7SUFLSSxhQUFhLEdBTGpCOzs7QUFRQSxJQUFJLFlBQVksS0FBSyxHQUFyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLFNBQVMsU0FBVCxDQUFtQixJQUFuQixFQUF5QixNQUF6QixFQUFpQztBQUMvQixNQUFJLFVBQVUsS0FBSyxDQUFMLENBQWQ7TUFDSSxhQUFhLE9BQU8sQ0FBUCxDQURqQjtNQUVJLGFBQWEsVUFBVSxVQUYzQjtNQUdJLFdBQVcsY0FBYyxZQUFZLGFBQVosR0FBNEIsUUFBMUMsQ0FIZjs7QUFLQSxNQUFJLFVBQ0EsY0FBYyxRQUFmLElBQTZCLFdBQVcsVUFBekMsSUFDRSxjQUFjLFFBQWYsSUFBNkIsV0FBVyxVQUF4QyxJQUF3RCxLQUFLLENBQUwsRUFBUSxNQUFSLElBQWtCLE9BQU8sQ0FBUCxDQUQzRSxJQUVFLGVBQWUsV0FBVyxVQUExQixDQUFELElBQTRDLE9BQU8sQ0FBUCxFQUFVLE1BQVYsSUFBb0IsT0FBTyxDQUFQLENBQWhFLElBQStFLFdBQVcsVUFIN0Y7OztBQU1BLE1BQUksRUFBRSxZQUFZLE9BQWQsQ0FBSixFQUE0QjtBQUMxQixXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFJLGFBQWEsU0FBakIsRUFBNEI7QUFDMUIsU0FBSyxDQUFMLElBQVUsT0FBTyxDQUFQLENBQVY7O0FBRUEsa0JBQWMsVUFBVSxTQUFWLEdBQXNCLENBQXRCLEdBQTBCLGdCQUF4QztBQUNEOztBQUVELE1BQUksUUFBUSxPQUFPLENBQVAsQ0FBWjtBQUNBLE1BQUksS0FBSixFQUFXO0FBQ1QsUUFBSSxXQUFXLEtBQUssQ0FBTCxDQUFmO0FBQ0EsU0FBSyxDQUFMLElBQVUsV0FBVyxZQUFZLFFBQVosRUFBc0IsS0FBdEIsRUFBNkIsT0FBTyxDQUFQLENBQTdCLENBQVgsR0FBcUQsS0FBL0Q7QUFDQSxTQUFLLENBQUwsSUFBVSxXQUFXLGVBQWUsS0FBSyxDQUFMLENBQWYsRUFBd0IsV0FBeEIsQ0FBWCxHQUFrRCxPQUFPLENBQVAsQ0FBNUQ7QUFDRDs7QUFFRCxVQUFRLE9BQU8sQ0FBUCxDQUFSO0FBQ0EsTUFBSSxLQUFKLEVBQVc7QUFDVCxlQUFXLEtBQUssQ0FBTCxDQUFYO0FBQ0EsU0FBSyxDQUFMLElBQVUsV0FBVyxpQkFBaUIsUUFBakIsRUFBMkIsS0FBM0IsRUFBa0MsT0FBTyxDQUFQLENBQWxDLENBQVgsR0FBMEQsS0FBcEU7QUFDQSxTQUFLLENBQUwsSUFBVSxXQUFXLGVBQWUsS0FBSyxDQUFMLENBQWYsRUFBd0IsV0FBeEIsQ0FBWCxHQUFrRCxPQUFPLENBQVAsQ0FBNUQ7QUFDRDs7QUFFRCxVQUFRLE9BQU8sQ0FBUCxDQUFSO0FBQ0EsTUFBSSxLQUFKLEVBQVc7QUFDVCxTQUFLLENBQUwsSUFBVSxLQUFWO0FBQ0Q7O0FBRUQsTUFBSSxhQUFhLFFBQWpCLEVBQTJCO0FBQ3pCLFNBQUssQ0FBTCxJQUFVLEtBQUssQ0FBTCxLQUFXLElBQVgsR0FBa0IsT0FBTyxDQUFQLENBQWxCLEdBQThCLFVBQVUsS0FBSyxDQUFMLENBQVYsRUFBbUIsT0FBTyxDQUFQLENBQW5CLENBQXhDO0FBQ0Q7O0FBRUQsTUFBSSxLQUFLLENBQUwsS0FBVyxJQUFmLEVBQXFCO0FBQ25CLFNBQUssQ0FBTCxJQUFVLE9BQU8sQ0FBUCxDQUFWO0FBQ0Q7O0FBRUQsT0FBSyxDQUFMLElBQVUsT0FBTyxDQUFQLENBQVY7QUFDQSxPQUFLLENBQUwsSUFBVSxVQUFWOztBQUVBLFNBQU8sSUFBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJfbWVyZ2VEYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNvbXBvc2VBcmdzID0gcmVxdWlyZSgnLi9fY29tcG9zZUFyZ3MnKSxcbiAgICBjb21wb3NlQXJnc1JpZ2h0ID0gcmVxdWlyZSgnLi9fY29tcG9zZUFyZ3NSaWdodCcpLFxuICAgIHJlcGxhY2VIb2xkZXJzID0gcmVxdWlyZSgnLi9fcmVwbGFjZUhvbGRlcnMnKTtcblxuLyoqIFVzZWQgYXMgdGhlIGludGVybmFsIGFyZ3VtZW50IHBsYWNlaG9sZGVyLiAqL1xudmFyIFBMQUNFSE9MREVSID0gJ19fbG9kYXNoX3BsYWNlaG9sZGVyX18nO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB3cmFwcGVyIG1ldGFkYXRhLiAqL1xudmFyIEJJTkRfRkxBRyA9IDEsXG4gICAgQklORF9LRVlfRkxBRyA9IDIsXG4gICAgQ1VSUllfQk9VTkRfRkxBRyA9IDQsXG4gICAgQ1VSUllfRkxBRyA9IDgsXG4gICAgQVJZX0ZMQUcgPSAxMjgsXG4gICAgUkVBUkdfRkxBRyA9IDI1NjtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIE1lcmdlcyB0aGUgZnVuY3Rpb24gbWV0YWRhdGEgb2YgYHNvdXJjZWAgaW50byBgZGF0YWAuXG4gKlxuICogTWVyZ2luZyBtZXRhZGF0YSByZWR1Y2VzIHRoZSBudW1iZXIgb2Ygd3JhcHBlcnMgdXNlZCB0byBpbnZva2UgYSBmdW5jdGlvbi5cbiAqIFRoaXMgaXMgcG9zc2libGUgYmVjYXVzZSBtZXRob2RzIGxpa2UgYF8uYmluZGAsIGBfLmN1cnJ5YCwgYW5kIGBfLnBhcnRpYWxgXG4gKiBtYXkgYmUgYXBwbGllZCByZWdhcmRsZXNzIG9mIGV4ZWN1dGlvbiBvcmRlci4gTWV0aG9kcyBsaWtlIGBfLmFyeWAgYW5kXG4gKiBgXy5yZWFyZ2AgbW9kaWZ5IGZ1bmN0aW9uIGFyZ3VtZW50cywgbWFraW5nIHRoZSBvcmRlciBpbiB3aGljaCB0aGV5IGFyZVxuICogZXhlY3V0ZWQgaW1wb3J0YW50LCBwcmV2ZW50aW5nIHRoZSBtZXJnaW5nIG9mIG1ldGFkYXRhLiBIb3dldmVyLCB3ZSBtYWtlXG4gKiBhbiBleGNlcHRpb24gZm9yIGEgc2FmZSBjb21iaW5lZCBjYXNlIHdoZXJlIGN1cnJpZWQgZnVuY3Rpb25zIGhhdmUgYF8uYXJ5YFxuICogYW5kIG9yIGBfLnJlYXJnYCBhcHBsaWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBkYXRhIFRoZSBkZXN0aW5hdGlvbiBtZXRhZGF0YS5cbiAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgc291cmNlIG1ldGFkYXRhLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBkYXRhYC5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VEYXRhKGRhdGEsIHNvdXJjZSkge1xuICB2YXIgYml0bWFzayA9IGRhdGFbMV0sXG4gICAgICBzcmNCaXRtYXNrID0gc291cmNlWzFdLFxuICAgICAgbmV3Qml0bWFzayA9IGJpdG1hc2sgfCBzcmNCaXRtYXNrLFxuICAgICAgaXNDb21tb24gPSBuZXdCaXRtYXNrIDwgKEJJTkRfRkxBRyB8IEJJTkRfS0VZX0ZMQUcgfCBBUllfRkxBRyk7XG5cbiAgdmFyIGlzQ29tYm8gPVxuICAgICgoc3JjQml0bWFzayA9PSBBUllfRkxBRykgJiYgKGJpdG1hc2sgPT0gQ1VSUllfRkxBRykpIHx8XG4gICAgKChzcmNCaXRtYXNrID09IEFSWV9GTEFHKSAmJiAoYml0bWFzayA9PSBSRUFSR19GTEFHKSAmJiAoZGF0YVs3XS5sZW5ndGggPD0gc291cmNlWzhdKSkgfHxcbiAgICAoKHNyY0JpdG1hc2sgPT0gKEFSWV9GTEFHIHwgUkVBUkdfRkxBRykpICYmIChzb3VyY2VbN10ubGVuZ3RoIDw9IHNvdXJjZVs4XSkgJiYgKGJpdG1hc2sgPT0gQ1VSUllfRkxBRykpO1xuXG4gIC8vIEV4aXQgZWFybHkgaWYgbWV0YWRhdGEgY2FuJ3QgYmUgbWVyZ2VkLlxuICBpZiAoIShpc0NvbW1vbiB8fCBpc0NvbWJvKSkge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG4gIC8vIFVzZSBzb3VyY2UgYHRoaXNBcmdgIGlmIGF2YWlsYWJsZS5cbiAgaWYgKHNyY0JpdG1hc2sgJiBCSU5EX0ZMQUcpIHtcbiAgICBkYXRhWzJdID0gc291cmNlWzJdO1xuICAgIC8vIFNldCB3aGVuIGN1cnJ5aW5nIGEgYm91bmQgZnVuY3Rpb24uXG4gICAgbmV3Qml0bWFzayB8PSBiaXRtYXNrICYgQklORF9GTEFHID8gMCA6IENVUlJZX0JPVU5EX0ZMQUc7XG4gIH1cbiAgLy8gQ29tcG9zZSBwYXJ0aWFsIGFyZ3VtZW50cy5cbiAgdmFyIHZhbHVlID0gc291cmNlWzNdO1xuICBpZiAodmFsdWUpIHtcbiAgICB2YXIgcGFydGlhbHMgPSBkYXRhWzNdO1xuICAgIGRhdGFbM10gPSBwYXJ0aWFscyA/IGNvbXBvc2VBcmdzKHBhcnRpYWxzLCB2YWx1ZSwgc291cmNlWzRdKSA6IHZhbHVlO1xuICAgIGRhdGFbNF0gPSBwYXJ0aWFscyA/IHJlcGxhY2VIb2xkZXJzKGRhdGFbM10sIFBMQUNFSE9MREVSKSA6IHNvdXJjZVs0XTtcbiAgfVxuICAvLyBDb21wb3NlIHBhcnRpYWwgcmlnaHQgYXJndW1lbnRzLlxuICB2YWx1ZSA9IHNvdXJjZVs1XTtcbiAgaWYgKHZhbHVlKSB7XG4gICAgcGFydGlhbHMgPSBkYXRhWzVdO1xuICAgIGRhdGFbNV0gPSBwYXJ0aWFscyA/IGNvbXBvc2VBcmdzUmlnaHQocGFydGlhbHMsIHZhbHVlLCBzb3VyY2VbNl0pIDogdmFsdWU7XG4gICAgZGF0YVs2XSA9IHBhcnRpYWxzID8gcmVwbGFjZUhvbGRlcnMoZGF0YVs1XSwgUExBQ0VIT0xERVIpIDogc291cmNlWzZdO1xuICB9XG4gIC8vIFVzZSBzb3VyY2UgYGFyZ1Bvc2AgaWYgYXZhaWxhYmxlLlxuICB2YWx1ZSA9IHNvdXJjZVs3XTtcbiAgaWYgKHZhbHVlKSB7XG4gICAgZGF0YVs3XSA9IHZhbHVlO1xuICB9XG4gIC8vIFVzZSBzb3VyY2UgYGFyeWAgaWYgaXQncyBzbWFsbGVyLlxuICBpZiAoc3JjQml0bWFzayAmIEFSWV9GTEFHKSB7XG4gICAgZGF0YVs4XSA9IGRhdGFbOF0gPT0gbnVsbCA/IHNvdXJjZVs4XSA6IG5hdGl2ZU1pbihkYXRhWzhdLCBzb3VyY2VbOF0pO1xuICB9XG4gIC8vIFVzZSBzb3VyY2UgYGFyaXR5YCBpZiBvbmUgaXMgbm90IHByb3ZpZGVkLlxuICBpZiAoZGF0YVs5XSA9PSBudWxsKSB7XG4gICAgZGF0YVs5XSA9IHNvdXJjZVs5XTtcbiAgfVxuICAvLyBVc2Ugc291cmNlIGBmdW5jYCBhbmQgbWVyZ2UgYml0bWFza3MuXG4gIGRhdGFbMF0gPSBzb3VyY2VbMF07XG4gIGRhdGFbMV0gPSBuZXdCaXRtYXNrO1xuXG4gIHJldHVybiBkYXRhO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlRGF0YTtcbiJdfQ==