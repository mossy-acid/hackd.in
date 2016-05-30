'use strict';

var baseToString = require('./_baseToString'),
    castSlice = require('./_castSlice'),
    charsEndIndex = require('./_charsEndIndex'),
    charsStartIndex = require('./_charsStartIndex'),
    stringToArray = require('./_stringToArray'),
    toString = require('./toString');

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/**
 * Removes leading and trailing whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trim('  abc  ');
 * // => 'abc'
 *
 * _.trim('-_-abc-_-', '_-');
 * // => 'abc'
 *
 * _.map(['  foo  ', '  bar  '], _.trim);
 * // => ['foo', 'bar']
 */
function trim(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrim, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  var strSymbols = stringToArray(string),
      chrSymbols = stringToArray(chars),
      start = charsStartIndex(strSymbols, chrSymbols),
      end = charsEndIndex(strSymbols, chrSymbols) + 1;

  return castSlice(strSymbols, start, end).join('');
}

module.exports = trim;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RyaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGVBQWUsUUFBUSxpQkFBUixDQUFuQjtJQUNJLFlBQVksUUFBUSxjQUFSLENBRGhCO0lBRUksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FGcEI7SUFHSSxrQkFBa0IsUUFBUSxvQkFBUixDQUh0QjtJQUlJLGdCQUFnQixRQUFRLGtCQUFSLENBSnBCO0lBS0ksV0FBVyxRQUFRLFlBQVIsQ0FMZjs7O0FBUUEsSUFBSSxTQUFTLFlBQWI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxTQUFTLElBQVQsQ0FBYyxNQUFkLEVBQXNCLEtBQXRCLEVBQTZCLEtBQTdCLEVBQW9DO0FBQ2xDLFdBQVMsU0FBUyxNQUFULENBQVQ7QUFDQSxNQUFJLFdBQVcsU0FBUyxVQUFVLFNBQTlCLENBQUosRUFBOEM7QUFDNUMsV0FBTyxPQUFPLE9BQVAsQ0FBZSxNQUFmLEVBQXVCLEVBQXZCLENBQVA7QUFDRDtBQUNELE1BQUksQ0FBQyxNQUFELElBQVcsRUFBRSxRQUFRLGFBQWEsS0FBYixDQUFWLENBQWYsRUFBK0M7QUFDN0MsV0FBTyxNQUFQO0FBQ0Q7QUFDRCxNQUFJLGFBQWEsY0FBYyxNQUFkLENBQWpCO01BQ0ksYUFBYSxjQUFjLEtBQWQsQ0FEakI7TUFFSSxRQUFRLGdCQUFnQixVQUFoQixFQUE0QixVQUE1QixDQUZaO01BR0ksTUFBTSxjQUFjLFVBQWQsRUFBMEIsVUFBMUIsSUFBd0MsQ0FIbEQ7O0FBS0EsU0FBTyxVQUFVLFVBQVYsRUFBc0IsS0FBdEIsRUFBNkIsR0FBN0IsRUFBa0MsSUFBbEMsQ0FBdUMsRUFBdkMsQ0FBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJ0cmltLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VUb1N0cmluZyA9IHJlcXVpcmUoJy4vX2Jhc2VUb1N0cmluZycpLFxuICAgIGNhc3RTbGljZSA9IHJlcXVpcmUoJy4vX2Nhc3RTbGljZScpLFxuICAgIGNoYXJzRW5kSW5kZXggPSByZXF1aXJlKCcuL19jaGFyc0VuZEluZGV4JyksXG4gICAgY2hhcnNTdGFydEluZGV4ID0gcmVxdWlyZSgnLi9fY2hhcnNTdGFydEluZGV4JyksXG4gICAgc3RyaW5nVG9BcnJheSA9IHJlcXVpcmUoJy4vX3N0cmluZ1RvQXJyYXknKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqXG4gKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2Ugb3Igc3BlY2lmaWVkIGNoYXJhY3RlcnMgZnJvbSBgc3RyaW5nYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byB0cmltLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjaGFycz13aGl0ZXNwYWNlXSBUaGUgY2hhcmFjdGVycyB0byB0cmltLlxuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHRyaW1tZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRyaW0oJyAgYWJjICAnKTtcbiAqIC8vID0+ICdhYmMnXG4gKlxuICogXy50cmltKCctXy1hYmMtXy0nLCAnXy0nKTtcbiAqIC8vID0+ICdhYmMnXG4gKlxuICogXy5tYXAoWycgIGZvbyAgJywgJyAgYmFyICAnXSwgXy50cmltKTtcbiAqIC8vID0+IFsnZm9vJywgJ2JhciddXG4gKi9cbmZ1bmN0aW9uIHRyaW0oc3RyaW5nLCBjaGFycywgZ3VhcmQpIHtcbiAgc3RyaW5nID0gdG9TdHJpbmcoc3RyaW5nKTtcbiAgaWYgKHN0cmluZyAmJiAoZ3VhcmQgfHwgY2hhcnMgPT09IHVuZGVmaW5lZCkpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIH1cbiAgaWYgKCFzdHJpbmcgfHwgIShjaGFycyA9IGJhc2VUb1N0cmluZyhjaGFycykpKSB7XG4gICAgcmV0dXJuIHN0cmluZztcbiAgfVxuICB2YXIgc3RyU3ltYm9scyA9IHN0cmluZ1RvQXJyYXkoc3RyaW5nKSxcbiAgICAgIGNoclN5bWJvbHMgPSBzdHJpbmdUb0FycmF5KGNoYXJzKSxcbiAgICAgIHN0YXJ0ID0gY2hhcnNTdGFydEluZGV4KHN0clN5bWJvbHMsIGNoclN5bWJvbHMpLFxuICAgICAgZW5kID0gY2hhcnNFbmRJbmRleChzdHJTeW1ib2xzLCBjaHJTeW1ib2xzKSArIDE7XG5cbiAgcmV0dXJuIGNhc3RTbGljZShzdHJTeW1ib2xzLCBzdGFydCwgZW5kKS5qb2luKCcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0cmltO1xuIl19