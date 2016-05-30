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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RydW5jYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxlQUFlLFFBQVEsaUJBQVIsQ0FBbkI7SUFDSSxZQUFZLFFBQVEsY0FBUixDQURoQjtJQUVJLFdBQVcsUUFBUSxZQUFSLENBRmY7SUFHSSxXQUFXLFFBQVEsWUFBUixDQUhmO0lBSUkscUJBQXFCLFFBQVEsdUJBQVIsQ0FKekI7SUFLSSxhQUFhLFFBQVEsZUFBUixDQUxqQjtJQU1JLGdCQUFnQixRQUFRLGtCQUFSLENBTnBCO0lBT0ksWUFBWSxRQUFRLGFBQVIsQ0FQaEI7SUFRSSxXQUFXLFFBQVEsWUFBUixDQVJmOzs7QUFXQSxJQUFJLHVCQUF1QixFQUEzQjtJQUNJLHlCQUF5QixLQUQ3Qjs7O0FBSUEsSUFBSSxVQUFVLE1BQWQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVDQSxTQUFTLFFBQVQsQ0FBa0IsTUFBbEIsRUFBMEIsT0FBMUIsRUFBbUM7QUFDakMsTUFBSSxTQUFTLG9CQUFiO01BQ0ksV0FBVyxzQkFEZjs7QUFHQSxNQUFJLFNBQVMsT0FBVCxDQUFKLEVBQXVCO0FBQ3JCLFFBQUksWUFBWSxlQUFlLE9BQWYsR0FBeUIsUUFBUSxTQUFqQyxHQUE2QyxTQUE3RDtBQUNBLGFBQVMsWUFBWSxPQUFaLEdBQXNCLFVBQVUsUUFBUSxNQUFsQixDQUF0QixHQUFrRCxNQUEzRDtBQUNBLGVBQVcsY0FBYyxPQUFkLEdBQXdCLGFBQWEsUUFBUSxRQUFyQixDQUF4QixHQUF5RCxRQUFwRTtBQUNEO0FBQ0QsV0FBUyxTQUFTLE1BQVQsQ0FBVDs7QUFFQSxNQUFJLFlBQVksT0FBTyxNQUF2QjtBQUNBLE1BQUksbUJBQW1CLElBQW5CLENBQXdCLE1BQXhCLENBQUosRUFBcUM7QUFDbkMsUUFBSSxhQUFhLGNBQWMsTUFBZCxDQUFqQjtBQUNBLGdCQUFZLFdBQVcsTUFBdkI7QUFDRDtBQUNELE1BQUksVUFBVSxTQUFkLEVBQXlCO0FBQ3ZCLFdBQU8sTUFBUDtBQUNEO0FBQ0QsTUFBSSxNQUFNLFNBQVMsV0FBVyxRQUFYLENBQW5CO0FBQ0EsTUFBSSxNQUFNLENBQVYsRUFBYTtBQUNYLFdBQU8sUUFBUDtBQUNEO0FBQ0QsTUFBSSxTQUFTLGFBQ1QsVUFBVSxVQUFWLEVBQXNCLENBQXRCLEVBQXlCLEdBQXpCLEVBQThCLElBQTlCLENBQW1DLEVBQW5DLENBRFMsR0FFVCxPQUFPLEtBQVAsQ0FBYSxDQUFiLEVBQWdCLEdBQWhCLENBRko7O0FBSUEsTUFBSSxjQUFjLFNBQWxCLEVBQTZCO0FBQzNCLFdBQU8sU0FBUyxRQUFoQjtBQUNEO0FBQ0QsTUFBSSxVQUFKLEVBQWdCO0FBQ2QsV0FBUSxPQUFPLE1BQVAsR0FBZ0IsR0FBeEI7QUFDRDtBQUNELE1BQUksU0FBUyxTQUFULENBQUosRUFBeUI7QUFDdkIsUUFBSSxPQUFPLEtBQVAsQ0FBYSxHQUFiLEVBQWtCLE1BQWxCLENBQXlCLFNBQXpCLENBQUosRUFBeUM7QUFDdkMsVUFBSSxLQUFKO1VBQ0ksWUFBWSxNQURoQjs7QUFHQSxVQUFJLENBQUMsVUFBVSxNQUFmLEVBQXVCO0FBQ3JCLG9CQUFZLE9BQU8sVUFBVSxNQUFqQixFQUF5QixTQUFTLFFBQVEsSUFBUixDQUFhLFNBQWIsQ0FBVCxJQUFvQyxHQUE3RCxDQUFaO0FBQ0Q7QUFDRCxnQkFBVSxTQUFWLEdBQXNCLENBQXRCO0FBQ0EsYUFBUSxRQUFRLFVBQVUsSUFBVixDQUFlLFNBQWYsQ0FBaEIsRUFBNEM7QUFDMUMsWUFBSSxTQUFTLE1BQU0sS0FBbkI7QUFDRDtBQUNELGVBQVMsT0FBTyxLQUFQLENBQWEsQ0FBYixFQUFnQixXQUFXLFNBQVgsR0FBdUIsR0FBdkIsR0FBNkIsTUFBN0MsQ0FBVDtBQUNEO0FBQ0YsR0FkRCxNQWNPLElBQUksT0FBTyxPQUFQLENBQWUsYUFBYSxTQUFiLENBQWYsRUFBd0MsR0FBeEMsS0FBZ0QsR0FBcEQsRUFBeUQ7QUFDOUQsUUFBSSxRQUFRLE9BQU8sV0FBUCxDQUFtQixTQUFuQixDQUFaO0FBQ0EsUUFBSSxRQUFRLENBQUMsQ0FBYixFQUFnQjtBQUNkLGVBQVMsT0FBTyxLQUFQLENBQWEsQ0FBYixFQUFnQixLQUFoQixDQUFUO0FBQ0Q7QUFDRjtBQUNELFNBQU8sU0FBUyxRQUFoQjtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixRQUFqQiIsImZpbGUiOiJ0cnVuY2F0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlVG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlVG9TdHJpbmcnKSxcbiAgICBjYXN0U2xpY2UgPSByZXF1aXJlKCcuL19jYXN0U2xpY2UnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1JlZ0V4cCA9IHJlcXVpcmUoJy4vaXNSZWdFeHAnKSxcbiAgICByZUhhc0NvbXBsZXhTeW1ib2wgPSByZXF1aXJlKCcuL19yZUhhc0NvbXBsZXhTeW1ib2wnKSxcbiAgICBzdHJpbmdTaXplID0gcmVxdWlyZSgnLi9fc3RyaW5nU2l6ZScpLFxuICAgIHN0cmluZ1RvQXJyYXkgPSByZXF1aXJlKCcuL19zdHJpbmdUb0FycmF5JyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqIFVzZWQgYXMgZGVmYXVsdCBvcHRpb25zIGZvciBgXy50cnVuY2F0ZWAuICovXG52YXIgREVGQVVMVF9UUlVOQ19MRU5HVEggPSAzMCxcbiAgICBERUZBVUxUX1RSVU5DX09NSVNTSU9OID0gJy4uLic7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgIGZsYWdzIGZyb20gdGhlaXIgY29lcmNlZCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlRmxhZ3MgPSAvXFx3KiQvO1xuXG4vKipcbiAqIFRydW5jYXRlcyBgc3RyaW5nYCBpZiBpdCdzIGxvbmdlciB0aGFuIHRoZSBnaXZlbiBtYXhpbXVtIHN0cmluZyBsZW5ndGguXG4gKiBUaGUgbGFzdCBjaGFyYWN0ZXJzIG9mIHRoZSB0cnVuY2F0ZWQgc3RyaW5nIGFyZSByZXBsYWNlZCB3aXRoIHRoZSBvbWlzc2lvblxuICogc3RyaW5nIHdoaWNoIGRlZmF1bHRzIHRvIFwiLi4uXCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gdHJ1bmNhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5sZW5ndGg9MzBdIFRoZSBtYXhpbXVtIHN0cmluZyBsZW5ndGguXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMub21pc3Npb249Jy4uLiddIFRoZSBzdHJpbmcgdG8gaW5kaWNhdGUgdGV4dCBpcyBvbWl0dGVkLlxuICogQHBhcmFtIHtSZWdFeHB8c3RyaW5nfSBbb3B0aW9ucy5zZXBhcmF0b3JdIFRoZSBzZXBhcmF0b3IgcGF0dGVybiB0byB0cnVuY2F0ZSB0by5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHRydW5jYXRlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udHJ1bmNhdGUoJ2hpLWRpZGRseS1obyB0aGVyZSwgbmVpZ2hib3Jpbm8nKTtcbiAqIC8vID0+ICdoaS1kaWRkbHktaG8gdGhlcmUsIG5laWdoYm8uLi4nXG4gKlxuICogXy50cnVuY2F0ZSgnaGktZGlkZGx5LWhvIHRoZXJlLCBuZWlnaGJvcmlubycsIHtcbiAqICAgJ2xlbmd0aCc6IDI0LFxuICogICAnc2VwYXJhdG9yJzogJyAnXG4gKiB9KTtcbiAqIC8vID0+ICdoaS1kaWRkbHktaG8gdGhlcmUsLi4uJ1xuICpcbiAqIF8udHJ1bmNhdGUoJ2hpLWRpZGRseS1obyB0aGVyZSwgbmVpZ2hib3Jpbm8nLCB7XG4gKiAgICdsZW5ndGgnOiAyNCxcbiAqICAgJ3NlcGFyYXRvcic6IC8sPyArL1xuICogfSk7XG4gKiAvLyA9PiAnaGktZGlkZGx5LWhvIHRoZXJlLi4uJ1xuICpcbiAqIF8udHJ1bmNhdGUoJ2hpLWRpZGRseS1obyB0aGVyZSwgbmVpZ2hib3Jpbm8nLCB7XG4gKiAgICdvbWlzc2lvbic6ICcgWy4uLl0nXG4gKiB9KTtcbiAqIC8vID0+ICdoaS1kaWRkbHktaG8gdGhlcmUsIG5laWcgWy4uLl0nXG4gKi9cbmZ1bmN0aW9uIHRydW5jYXRlKHN0cmluZywgb3B0aW9ucykge1xuICB2YXIgbGVuZ3RoID0gREVGQVVMVF9UUlVOQ19MRU5HVEgsXG4gICAgICBvbWlzc2lvbiA9IERFRkFVTFRfVFJVTkNfT01JU1NJT047XG5cbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgdmFyIHNlcGFyYXRvciA9ICdzZXBhcmF0b3InIGluIG9wdGlvbnMgPyBvcHRpb25zLnNlcGFyYXRvciA6IHNlcGFyYXRvcjtcbiAgICBsZW5ndGggPSAnbGVuZ3RoJyBpbiBvcHRpb25zID8gdG9JbnRlZ2VyKG9wdGlvbnMubGVuZ3RoKSA6IGxlbmd0aDtcbiAgICBvbWlzc2lvbiA9ICdvbWlzc2lvbicgaW4gb3B0aW9ucyA/IGJhc2VUb1N0cmluZyhvcHRpb25zLm9taXNzaW9uKSA6IG9taXNzaW9uO1xuICB9XG4gIHN0cmluZyA9IHRvU3RyaW5nKHN0cmluZyk7XG5cbiAgdmFyIHN0ckxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gIGlmIChyZUhhc0NvbXBsZXhTeW1ib2wudGVzdChzdHJpbmcpKSB7XG4gICAgdmFyIHN0clN5bWJvbHMgPSBzdHJpbmdUb0FycmF5KHN0cmluZyk7XG4gICAgc3RyTGVuZ3RoID0gc3RyU3ltYm9scy5sZW5ndGg7XG4gIH1cbiAgaWYgKGxlbmd0aCA+PSBzdHJMZW5ndGgpIHtcbiAgICByZXR1cm4gc3RyaW5nO1xuICB9XG4gIHZhciBlbmQgPSBsZW5ndGggLSBzdHJpbmdTaXplKG9taXNzaW9uKTtcbiAgaWYgKGVuZCA8IDEpIHtcbiAgICByZXR1cm4gb21pc3Npb247XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHN0clN5bWJvbHNcbiAgICA/IGNhc3RTbGljZShzdHJTeW1ib2xzLCAwLCBlbmQpLmpvaW4oJycpXG4gICAgOiBzdHJpbmcuc2xpY2UoMCwgZW5kKTtcblxuICBpZiAoc2VwYXJhdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcmVzdWx0ICsgb21pc3Npb247XG4gIH1cbiAgaWYgKHN0clN5bWJvbHMpIHtcbiAgICBlbmQgKz0gKHJlc3VsdC5sZW5ndGggLSBlbmQpO1xuICB9XG4gIGlmIChpc1JlZ0V4cChzZXBhcmF0b3IpKSB7XG4gICAgaWYgKHN0cmluZy5zbGljZShlbmQpLnNlYXJjaChzZXBhcmF0b3IpKSB7XG4gICAgICB2YXIgbWF0Y2gsXG4gICAgICAgICAgc3Vic3RyaW5nID0gcmVzdWx0O1xuXG4gICAgICBpZiAoIXNlcGFyYXRvci5nbG9iYWwpIHtcbiAgICAgICAgc2VwYXJhdG9yID0gUmVnRXhwKHNlcGFyYXRvci5zb3VyY2UsIHRvU3RyaW5nKHJlRmxhZ3MuZXhlYyhzZXBhcmF0b3IpKSArICdnJyk7XG4gICAgICB9XG4gICAgICBzZXBhcmF0b3IubGFzdEluZGV4ID0gMDtcbiAgICAgIHdoaWxlICgobWF0Y2ggPSBzZXBhcmF0b3IuZXhlYyhzdWJzdHJpbmcpKSkge1xuICAgICAgICB2YXIgbmV3RW5kID0gbWF0Y2guaW5kZXg7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSByZXN1bHQuc2xpY2UoMCwgbmV3RW5kID09PSB1bmRlZmluZWQgPyBlbmQgOiBuZXdFbmQpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChzdHJpbmcuaW5kZXhPZihiYXNlVG9TdHJpbmcoc2VwYXJhdG9yKSwgZW5kKSAhPSBlbmQpIHtcbiAgICB2YXIgaW5kZXggPSByZXN1bHQubGFzdEluZGV4T2Yoc2VwYXJhdG9yKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0LnNsaWNlKDAsIGluZGV4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdCArIG9taXNzaW9uO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRydW5jYXRlO1xuIl19