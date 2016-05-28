'use strict';

var baseToString = require('./_baseToString'),
    castSlice = require('./_castSlice'),
    isObject = require('./isObject'),
    isRegExp = require('./isRegExp'),
    reHasComplexSymbol = require('./_reHasComplexSymbol'),
    stringSize = require('./_stringSize'),
    stringToArray = require('./_stringToArray'),
    toInteger = require('./toInteger'),
    toString = require('./toString');

/** Used as default options for `_.truncate`. */
var DEFAULT_TRUNC_LENGTH = 30,
    DEFAULT_TRUNC_OMISSION = '...';

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Truncates `string` if it's longer than the given maximum string length.
 * The last characters of the truncated string are replaced with the omission
 * string which defaults to "...".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to truncate.
 * @param {Object} [options={}] The options object.
 * @param {number} [options.length=30] The maximum string length.
 * @param {string} [options.omission='...'] The string to indicate text is omitted.
 * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
 * @returns {string} Returns the truncated string.
 * @example
 *
 * _.truncate('hi-diddly-ho there, neighborino');
 * // => 'hi-diddly-ho there, neighbo...'
 *
 * _.truncate('hi-diddly-ho there, neighborino', {
 *   'length': 24,
 *   'separator': ' '
 * });
 * // => 'hi-diddly-ho there,...'
 *
 * _.truncate('hi-diddly-ho there, neighborino', {
 *   'length': 24,
 *   'separator': /,? +/
 * });
 * // => 'hi-diddly-ho there...'
 *
 * _.truncate('hi-diddly-ho there, neighborino', {
 *   'omission': ' [...]'
 * });
 * // => 'hi-diddly-ho there, neig [...]'
 */
function truncate(string, options) {
  var length = DEFAULT_TRUNC_LENGTH,
      omission = DEFAULT_TRUNC_OMISSION;

  if (isObject(options)) {
    var separator = 'separator' in options ? options.separator : separator;
    length = 'length' in options ? toInteger(options.length) : length;
    omission = 'omission' in options ? baseToString(options.omission) : omission;
  }
  string = toString(string);

  var strLength = string.length;
  if (reHasComplexSymbol.test(string)) {
    var strSymbols = stringToArray(string);
    strLength = strSymbols.length;
  }
  if (length >= strLength) {
    return string;
  }
  var end = length - stringSize(omission);
  if (end < 1) {
    return omission;
  }
  var result = strSymbols ? castSlice(strSymbols, 0, end).join('') : string.slice(0, end);

  if (separator === undefined) {
    return result + omission;
  }
  if (strSymbols) {
    end += result.length - end;
  }
  if (isRegExp(separator)) {
    if (string.slice(end).search(separator)) {
      var match,
          substring = result;

      if (!separator.global) {
        separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
      }
      separator.lastIndex = 0;
      while (match = separator.exec(substring)) {
        var newEnd = match.index;
      }
      result = result.slice(0, newEnd === undefined ? end : newEnd);
    }
  } else if (string.indexOf(baseToString(separator), end) != end) {
    var index = result.lastIndexOf(separator);
    if (index > -1) {
      result = result.slice(0, index);
    }
  }
  return result + omission;
}

module.exports = truncate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RydW5jYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxlQUFlLFFBQVEsaUJBQVIsQ0FBZjtJQUNBLFlBQVksUUFBUSxjQUFSLENBQVo7SUFDQSxXQUFXLFFBQVEsWUFBUixDQUFYO0lBQ0EsV0FBVyxRQUFRLFlBQVIsQ0FBWDtJQUNBLHFCQUFxQixRQUFRLHVCQUFSLENBQXJCO0lBQ0EsYUFBYSxRQUFRLGVBQVIsQ0FBYjtJQUNBLGdCQUFnQixRQUFRLGtCQUFSLENBQWhCO0lBQ0EsWUFBWSxRQUFRLGFBQVIsQ0FBWjtJQUNBLFdBQVcsUUFBUSxZQUFSLENBQVg7OztBQUdKLElBQUksdUJBQXVCLEVBQXZCO0lBQ0EseUJBQXlCLEtBQXpCOzs7QUFHSixJQUFJLFVBQVUsTUFBVjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUNKLFNBQVMsUUFBVCxDQUFrQixNQUFsQixFQUEwQixPQUExQixFQUFtQztBQUNqQyxNQUFJLFNBQVMsb0JBQVQ7TUFDQSxXQUFXLHNCQUFYLENBRjZCOztBQUlqQyxNQUFJLFNBQVMsT0FBVCxDQUFKLEVBQXVCO0FBQ3JCLFFBQUksWUFBWSxlQUFlLE9BQWYsR0FBeUIsUUFBUSxTQUFSLEdBQW9CLFNBQTdDLENBREs7QUFFckIsYUFBUyxZQUFZLE9BQVosR0FBc0IsVUFBVSxRQUFRLE1BQVIsQ0FBaEMsR0FBa0QsTUFBbEQsQ0FGWTtBQUdyQixlQUFXLGNBQWMsT0FBZCxHQUF3QixhQUFhLFFBQVEsUUFBUixDQUFyQyxHQUF5RCxRQUF6RCxDQUhVO0dBQXZCO0FBS0EsV0FBUyxTQUFTLE1BQVQsQ0FBVCxDQVRpQzs7QUFXakMsTUFBSSxZQUFZLE9BQU8sTUFBUCxDQVhpQjtBQVlqQyxNQUFJLG1CQUFtQixJQUFuQixDQUF3QixNQUF4QixDQUFKLEVBQXFDO0FBQ25DLFFBQUksYUFBYSxjQUFjLE1BQWQsQ0FBYixDQUQrQjtBQUVuQyxnQkFBWSxXQUFXLE1BQVgsQ0FGdUI7R0FBckM7QUFJQSxNQUFJLFVBQVUsU0FBVixFQUFxQjtBQUN2QixXQUFPLE1BQVAsQ0FEdUI7R0FBekI7QUFHQSxNQUFJLE1BQU0sU0FBUyxXQUFXLFFBQVgsQ0FBVCxDQW5CdUI7QUFvQmpDLE1BQUksTUFBTSxDQUFOLEVBQVM7QUFDWCxXQUFPLFFBQVAsQ0FEVztHQUFiO0FBR0EsTUFBSSxTQUFTLGFBQ1QsVUFBVSxVQUFWLEVBQXNCLENBQXRCLEVBQXlCLEdBQXpCLEVBQThCLElBQTlCLENBQW1DLEVBQW5DLENBRFMsR0FFVCxPQUFPLEtBQVAsQ0FBYSxDQUFiLEVBQWdCLEdBQWhCLENBRlMsQ0F2Qm9COztBQTJCakMsTUFBSSxjQUFjLFNBQWQsRUFBeUI7QUFDM0IsV0FBTyxTQUFTLFFBQVQsQ0FEb0I7R0FBN0I7QUFHQSxNQUFJLFVBQUosRUFBZ0I7QUFDZCxXQUFRLE9BQU8sTUFBUCxHQUFnQixHQUFoQixDQURNO0dBQWhCO0FBR0EsTUFBSSxTQUFTLFNBQVQsQ0FBSixFQUF5QjtBQUN2QixRQUFJLE9BQU8sS0FBUCxDQUFhLEdBQWIsRUFBa0IsTUFBbEIsQ0FBeUIsU0FBekIsQ0FBSixFQUF5QztBQUN2QyxVQUFJLEtBQUo7VUFDSSxZQUFZLE1BQVosQ0FGbUM7O0FBSXZDLFVBQUksQ0FBQyxVQUFVLE1BQVYsRUFBa0I7QUFDckIsb0JBQVksT0FBTyxVQUFVLE1BQVYsRUFBa0IsU0FBUyxRQUFRLElBQVIsQ0FBYSxTQUFiLENBQVQsSUFBb0MsR0FBcEMsQ0FBckMsQ0FEcUI7T0FBdkI7QUFHQSxnQkFBVSxTQUFWLEdBQXNCLENBQXRCLENBUHVDO0FBUXZDLGFBQVEsUUFBUSxVQUFVLElBQVYsQ0FBZSxTQUFmLENBQVIsRUFBb0M7QUFDMUMsWUFBSSxTQUFTLE1BQU0sS0FBTixDQUQ2QjtPQUE1QztBQUdBLGVBQVMsT0FBTyxLQUFQLENBQWEsQ0FBYixFQUFnQixXQUFXLFNBQVgsR0FBdUIsR0FBdkIsR0FBNkIsTUFBN0IsQ0FBekIsQ0FYdUM7S0FBekM7R0FERixNQWNPLElBQUksT0FBTyxPQUFQLENBQWUsYUFBYSxTQUFiLENBQWYsRUFBd0MsR0FBeEMsS0FBZ0QsR0FBaEQsRUFBcUQ7QUFDOUQsUUFBSSxRQUFRLE9BQU8sV0FBUCxDQUFtQixTQUFuQixDQUFSLENBRDBEO0FBRTlELFFBQUksUUFBUSxDQUFDLENBQUQsRUFBSTtBQUNkLGVBQVMsT0FBTyxLQUFQLENBQWEsQ0FBYixFQUFnQixLQUFoQixDQUFULENBRGM7S0FBaEI7R0FGSztBQU1QLFNBQU8sU0FBUyxRQUFULENBckQwQjtDQUFuQzs7QUF3REEsT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6InRydW5jYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VUb1N0cmluZyA9IHJlcXVpcmUoJy4vX2Jhc2VUb1N0cmluZycpLFxuICAgIGNhc3RTbGljZSA9IHJlcXVpcmUoJy4vX2Nhc3RTbGljZScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzUmVnRXhwID0gcmVxdWlyZSgnLi9pc1JlZ0V4cCcpLFxuICAgIHJlSGFzQ29tcGxleFN5bWJvbCA9IHJlcXVpcmUoJy4vX3JlSGFzQ29tcGxleFN5bWJvbCcpLFxuICAgIHN0cmluZ1NpemUgPSByZXF1aXJlKCcuL19zdHJpbmdTaXplJyksXG4gICAgc3RyaW5nVG9BcnJheSA9IHJlcXVpcmUoJy4vX3N0cmluZ1RvQXJyYXknKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpLFxuICAgIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKiogVXNlZCBhcyBkZWZhdWx0IG9wdGlvbnMgZm9yIGBfLnRydW5jYXRlYC4gKi9cbnZhciBERUZBVUxUX1RSVU5DX0xFTkdUSCA9IDMwLFxuICAgIERFRkFVTFRfVFJVTkNfT01JU1NJT04gPSAnLi4uJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGAgZmxhZ3MgZnJvbSB0aGVpciBjb2VyY2VkIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVGbGFncyA9IC9cXHcqJC87XG5cbi8qKlxuICogVHJ1bmNhdGVzIGBzdHJpbmdgIGlmIGl0J3MgbG9uZ2VyIHRoYW4gdGhlIGdpdmVuIG1heGltdW0gc3RyaW5nIGxlbmd0aC5cbiAqIFRoZSBsYXN0IGNoYXJhY3RlcnMgb2YgdGhlIHRydW5jYXRlZCBzdHJpbmcgYXJlIHJlcGxhY2VkIHdpdGggdGhlIG9taXNzaW9uXG4gKiBzdHJpbmcgd2hpY2ggZGVmYXVsdHMgdG8gXCIuLi5cIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byB0cnVuY2F0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmxlbmd0aD0zMF0gVGhlIG1heGltdW0gc3RyaW5nIGxlbmd0aC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5vbWlzc2lvbj0nLi4uJ10gVGhlIHN0cmluZyB0byBpbmRpY2F0ZSB0ZXh0IGlzIG9taXR0ZWQuXG4gKiBAcGFyYW0ge1JlZ0V4cHxzdHJpbmd9IFtvcHRpb25zLnNlcGFyYXRvcl0gVGhlIHNlcGFyYXRvciBwYXR0ZXJuIHRvIHRydW5jYXRlIHRvLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdHJ1bmNhdGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50cnVuY2F0ZSgnaGktZGlkZGx5LWhvIHRoZXJlLCBuZWlnaGJvcmlubycpO1xuICogLy8gPT4gJ2hpLWRpZGRseS1obyB0aGVyZSwgbmVpZ2hiby4uLidcbiAqXG4gKiBfLnRydW5jYXRlKCdoaS1kaWRkbHktaG8gdGhlcmUsIG5laWdoYm9yaW5vJywge1xuICogICAnbGVuZ3RoJzogMjQsXG4gKiAgICdzZXBhcmF0b3InOiAnICdcbiAqIH0pO1xuICogLy8gPT4gJ2hpLWRpZGRseS1obyB0aGVyZSwuLi4nXG4gKlxuICogXy50cnVuY2F0ZSgnaGktZGlkZGx5LWhvIHRoZXJlLCBuZWlnaGJvcmlubycsIHtcbiAqICAgJ2xlbmd0aCc6IDI0LFxuICogICAnc2VwYXJhdG9yJzogLyw/ICsvXG4gKiB9KTtcbiAqIC8vID0+ICdoaS1kaWRkbHktaG8gdGhlcmUuLi4nXG4gKlxuICogXy50cnVuY2F0ZSgnaGktZGlkZGx5LWhvIHRoZXJlLCBuZWlnaGJvcmlubycsIHtcbiAqICAgJ29taXNzaW9uJzogJyBbLi4uXSdcbiAqIH0pO1xuICogLy8gPT4gJ2hpLWRpZGRseS1obyB0aGVyZSwgbmVpZyBbLi4uXSdcbiAqL1xuZnVuY3Rpb24gdHJ1bmNhdGUoc3RyaW5nLCBvcHRpb25zKSB7XG4gIHZhciBsZW5ndGggPSBERUZBVUxUX1RSVU5DX0xFTkdUSCxcbiAgICAgIG9taXNzaW9uID0gREVGQVVMVF9UUlVOQ19PTUlTU0lPTjtcblxuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICB2YXIgc2VwYXJhdG9yID0gJ3NlcGFyYXRvcicgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc2VwYXJhdG9yIDogc2VwYXJhdG9yO1xuICAgIGxlbmd0aCA9ICdsZW5ndGgnIGluIG9wdGlvbnMgPyB0b0ludGVnZXIob3B0aW9ucy5sZW5ndGgpIDogbGVuZ3RoO1xuICAgIG9taXNzaW9uID0gJ29taXNzaW9uJyBpbiBvcHRpb25zID8gYmFzZVRvU3RyaW5nKG9wdGlvbnMub21pc3Npb24pIDogb21pc3Npb247XG4gIH1cbiAgc3RyaW5nID0gdG9TdHJpbmcoc3RyaW5nKTtcblxuICB2YXIgc3RyTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgaWYgKHJlSGFzQ29tcGxleFN5bWJvbC50ZXN0KHN0cmluZykpIHtcbiAgICB2YXIgc3RyU3ltYm9scyA9IHN0cmluZ1RvQXJyYXkoc3RyaW5nKTtcbiAgICBzdHJMZW5ndGggPSBzdHJTeW1ib2xzLmxlbmd0aDtcbiAgfVxuICBpZiAobGVuZ3RoID49IHN0ckxlbmd0aCkge1xuICAgIHJldHVybiBzdHJpbmc7XG4gIH1cbiAgdmFyIGVuZCA9IGxlbmd0aCAtIHN0cmluZ1NpemUob21pc3Npb24pO1xuICBpZiAoZW5kIDwgMSkge1xuICAgIHJldHVybiBvbWlzc2lvbjtcbiAgfVxuICB2YXIgcmVzdWx0ID0gc3RyU3ltYm9sc1xuICAgID8gY2FzdFNsaWNlKHN0clN5bWJvbHMsIDAsIGVuZCkuam9pbignJylcbiAgICA6IHN0cmluZy5zbGljZSgwLCBlbmQpO1xuXG4gIGlmIChzZXBhcmF0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiByZXN1bHQgKyBvbWlzc2lvbjtcbiAgfVxuICBpZiAoc3RyU3ltYm9scykge1xuICAgIGVuZCArPSAocmVzdWx0Lmxlbmd0aCAtIGVuZCk7XG4gIH1cbiAgaWYgKGlzUmVnRXhwKHNlcGFyYXRvcikpIHtcbiAgICBpZiAoc3RyaW5nLnNsaWNlKGVuZCkuc2VhcmNoKHNlcGFyYXRvcikpIHtcbiAgICAgIHZhciBtYXRjaCxcbiAgICAgICAgICBzdWJzdHJpbmcgPSByZXN1bHQ7XG5cbiAgICAgIGlmICghc2VwYXJhdG9yLmdsb2JhbCkge1xuICAgICAgICBzZXBhcmF0b3IgPSBSZWdFeHAoc2VwYXJhdG9yLnNvdXJjZSwgdG9TdHJpbmcocmVGbGFncy5leGVjKHNlcGFyYXRvcikpICsgJ2cnKTtcbiAgICAgIH1cbiAgICAgIHNlcGFyYXRvci5sYXN0SW5kZXggPSAwO1xuICAgICAgd2hpbGUgKChtYXRjaCA9IHNlcGFyYXRvci5leGVjKHN1YnN0cmluZykpKSB7XG4gICAgICAgIHZhciBuZXdFbmQgPSBtYXRjaC5pbmRleDtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5zbGljZSgwLCBuZXdFbmQgPT09IHVuZGVmaW5lZCA/IGVuZCA6IG5ld0VuZCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHN0cmluZy5pbmRleE9mKGJhc2VUb1N0cmluZyhzZXBhcmF0b3IpLCBlbmQpICE9IGVuZCkge1xuICAgIHZhciBpbmRleCA9IHJlc3VsdC5sYXN0SW5kZXhPZihzZXBhcmF0b3IpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQuc2xpY2UoMCwgaW5kZXgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0ICsgb21pc3Npb247XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJ1bmNhdGU7XG4iXX0=