'use strict';

var baseToString = require('./_baseToString'),
    castSlice = require('./_castSlice'),
    charsStartIndex = require('./_charsStartIndex'),
    stringToArray = require('./_stringToArray'),
    toString = require('./toString');

/** Used to match leading and trailing whitespace. */
var reTrimStart = /^\s+/;

/**
 * Removes leading whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trimStart('  abc  ');
 * // => 'abc  '
 *
 * _.trimStart('-_-abc-_-', '_-');
 * // => 'abc-_-'
 */
function trimStart(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrimStart, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  var strSymbols = stringToArray(string),
      start = charsStartIndex(strSymbols, stringToArray(chars));

  return castSlice(strSymbols, start).join('');
}

module.exports = trimStart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RyaW1TdGFydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0Esa0JBQWtCLFFBQVEsb0JBQVIsQ0FBbEI7SUFDQSxnQkFBZ0IsUUFBUSxrQkFBUixDQUFoQjtJQUNBLFdBQVcsUUFBUSxZQUFSLENBQVg7OztBQUdKLElBQUksY0FBYyxNQUFkOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkosU0FBUyxTQUFULENBQW1CLE1BQW5CLEVBQTJCLEtBQTNCLEVBQWtDLEtBQWxDLEVBQXlDO0FBQ3ZDLFdBQVMsU0FBUyxNQUFULENBQVQsQ0FEdUM7QUFFdkMsTUFBSSxXQUFXLFNBQVMsVUFBVSxTQUFWLENBQXBCLEVBQTBDO0FBQzVDLFdBQU8sT0FBTyxPQUFQLENBQWUsV0FBZixFQUE0QixFQUE1QixDQUFQLENBRDRDO0dBQTlDO0FBR0EsTUFBSSxDQUFDLE1BQUQsSUFBVyxFQUFFLFFBQVEsYUFBYSxLQUFiLENBQVIsQ0FBRixFQUFnQztBQUM3QyxXQUFPLE1BQVAsQ0FENkM7R0FBL0M7QUFHQSxNQUFJLGFBQWEsY0FBYyxNQUFkLENBQWI7TUFDQSxRQUFRLGdCQUFnQixVQUFoQixFQUE0QixjQUFjLEtBQWQsQ0FBNUIsQ0FBUixDQVRtQzs7QUFXdkMsU0FBTyxVQUFVLFVBQVYsRUFBc0IsS0FBdEIsRUFBNkIsSUFBN0IsQ0FBa0MsRUFBbEMsQ0FBUCxDQVh1QztDQUF6Qzs7QUFjQSxPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoidHJpbVN0YXJ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VUb1N0cmluZyA9IHJlcXVpcmUoJy4vX2Jhc2VUb1N0cmluZycpLFxuICAgIGNhc3RTbGljZSA9IHJlcXVpcmUoJy4vX2Nhc3RTbGljZScpLFxuICAgIGNoYXJzU3RhcnRJbmRleCA9IHJlcXVpcmUoJy4vX2NoYXJzU3RhcnRJbmRleCcpLFxuICAgIHN0cmluZ1RvQXJyYXkgPSByZXF1aXJlKCcuL19zdHJpbmdUb0FycmF5JyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltU3RhcnQgPSAvXlxccysvO1xuXG4vKipcbiAqIFJlbW92ZXMgbGVhZGluZyB3aGl0ZXNwYWNlIG9yIHNwZWNpZmllZCBjaGFyYWN0ZXJzIGZyb20gYHN0cmluZ2AuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gdHJpbS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY2hhcnM9d2hpdGVzcGFjZV0gVGhlIGNoYXJhY3RlcnMgdG8gdHJpbS5cbiAqIEBwYXJhbS0ge09iamVjdH0gW2d1YXJkXSBFbmFibGVzIHVzZSBhcyBhbiBpdGVyYXRlZSBmb3IgbWV0aG9kcyBsaWtlIGBfLm1hcGAuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSB0cmltbWVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50cmltU3RhcnQoJyAgYWJjICAnKTtcbiAqIC8vID0+ICdhYmMgICdcbiAqXG4gKiBfLnRyaW1TdGFydCgnLV8tYWJjLV8tJywgJ18tJyk7XG4gKiAvLyA9PiAnYWJjLV8tJ1xuICovXG5mdW5jdGlvbiB0cmltU3RhcnQoc3RyaW5nLCBjaGFycywgZ3VhcmQpIHtcbiAgc3RyaW5nID0gdG9TdHJpbmcoc3RyaW5nKTtcbiAgaWYgKHN0cmluZyAmJiAoZ3VhcmQgfHwgY2hhcnMgPT09IHVuZGVmaW5lZCkpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UocmVUcmltU3RhcnQsICcnKTtcbiAgfVxuICBpZiAoIXN0cmluZyB8fCAhKGNoYXJzID0gYmFzZVRvU3RyaW5nKGNoYXJzKSkpIHtcbiAgICByZXR1cm4gc3RyaW5nO1xuICB9XG4gIHZhciBzdHJTeW1ib2xzID0gc3RyaW5nVG9BcnJheShzdHJpbmcpLFxuICAgICAgc3RhcnQgPSBjaGFyc1N0YXJ0SW5kZXgoc3RyU3ltYm9scywgc3RyaW5nVG9BcnJheShjaGFycykpO1xuXG4gIHJldHVybiBjYXN0U2xpY2Uoc3RyU3ltYm9scywgc3RhcnQpLmpvaW4oJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRyaW1TdGFydDtcbiJdfQ==