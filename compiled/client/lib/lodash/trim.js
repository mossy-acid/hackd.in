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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RyaW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGVBQWUsUUFBUSxpQkFBUixDQUFmO0lBQ0EsWUFBWSxRQUFRLGNBQVIsQ0FBWjtJQUNBLGdCQUFnQixRQUFRLGtCQUFSLENBQWhCO0lBQ0Esa0JBQWtCLFFBQVEsb0JBQVIsQ0FBbEI7SUFDQSxnQkFBZ0IsUUFBUSxrQkFBUixDQUFoQjtJQUNBLFdBQVcsUUFBUSxZQUFSLENBQVg7OztBQUdKLElBQUksU0FBUyxZQUFUOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QkosU0FBUyxJQUFULENBQWMsTUFBZCxFQUFzQixLQUF0QixFQUE2QixLQUE3QixFQUFvQztBQUNsQyxXQUFTLFNBQVMsTUFBVCxDQUFULENBRGtDO0FBRWxDLE1BQUksV0FBVyxTQUFTLFVBQVUsU0FBVixDQUFwQixFQUEwQztBQUM1QyxXQUFPLE9BQU8sT0FBUCxDQUFlLE1BQWYsRUFBdUIsRUFBdkIsQ0FBUCxDQUQ0QztHQUE5QztBQUdBLE1BQUksQ0FBQyxNQUFELElBQVcsRUFBRSxRQUFRLGFBQWEsS0FBYixDQUFSLENBQUYsRUFBZ0M7QUFDN0MsV0FBTyxNQUFQLENBRDZDO0dBQS9DO0FBR0EsTUFBSSxhQUFhLGNBQWMsTUFBZCxDQUFiO01BQ0EsYUFBYSxjQUFjLEtBQWQsQ0FBYjtNQUNBLFFBQVEsZ0JBQWdCLFVBQWhCLEVBQTRCLFVBQTVCLENBQVI7TUFDQSxNQUFNLGNBQWMsVUFBZCxFQUEwQixVQUExQixJQUF3QyxDQUF4QyxDQVh3Qjs7QUFhbEMsU0FBTyxVQUFVLFVBQVYsRUFBc0IsS0FBdEIsRUFBNkIsR0FBN0IsRUFBa0MsSUFBbEMsQ0FBdUMsRUFBdkMsQ0FBUCxDQWJrQztDQUFwQzs7QUFnQkEsT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6InRyaW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVRvU3RyaW5nID0gcmVxdWlyZSgnLi9fYmFzZVRvU3RyaW5nJyksXG4gICAgY2FzdFNsaWNlID0gcmVxdWlyZSgnLi9fY2FzdFNsaWNlJyksXG4gICAgY2hhcnNFbmRJbmRleCA9IHJlcXVpcmUoJy4vX2NoYXJzRW5kSW5kZXgnKSxcbiAgICBjaGFyc1N0YXJ0SW5kZXggPSByZXF1aXJlKCcuL19jaGFyc1N0YXJ0SW5kZXgnKSxcbiAgICBzdHJpbmdUb0FycmF5ID0gcmVxdWlyZSgnLi9fc3RyaW5nVG9BcnJheScpLFxuICAgIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKipcbiAqIFJlbW92ZXMgbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZSBvciBzcGVjaWZpZWQgY2hhcmFjdGVycyBmcm9tIGBzdHJpbmdgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIHRyaW0uXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NoYXJzPXdoaXRlc3BhY2VdIFRoZSBjaGFyYWN0ZXJzIHRvIHRyaW0uXG4gKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYW4gaXRlcmF0ZWUgZm9yIG1ldGhvZHMgbGlrZSBgXy5tYXBgLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdHJpbW1lZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udHJpbSgnICBhYmMgICcpO1xuICogLy8gPT4gJ2FiYydcbiAqXG4gKiBfLnRyaW0oJy1fLWFiYy1fLScsICdfLScpO1xuICogLy8gPT4gJ2FiYydcbiAqXG4gKiBfLm1hcChbJyAgZm9vICAnLCAnICBiYXIgICddLCBfLnRyaW0pO1xuICogLy8gPT4gWydmb28nLCAnYmFyJ11cbiAqL1xuZnVuY3Rpb24gdHJpbShzdHJpbmcsIGNoYXJzLCBndWFyZCkge1xuICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpO1xuICBpZiAoc3RyaW5nICYmIChndWFyZCB8fCBjaGFycyA9PT0gdW5kZWZpbmVkKSkge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgfVxuICBpZiAoIXN0cmluZyB8fCAhKGNoYXJzID0gYmFzZVRvU3RyaW5nKGNoYXJzKSkpIHtcbiAgICByZXR1cm4gc3RyaW5nO1xuICB9XG4gIHZhciBzdHJTeW1ib2xzID0gc3RyaW5nVG9BcnJheShzdHJpbmcpLFxuICAgICAgY2hyU3ltYm9scyA9IHN0cmluZ1RvQXJyYXkoY2hhcnMpLFxuICAgICAgc3RhcnQgPSBjaGFyc1N0YXJ0SW5kZXgoc3RyU3ltYm9scywgY2hyU3ltYm9scyksXG4gICAgICBlbmQgPSBjaGFyc0VuZEluZGV4KHN0clN5bWJvbHMsIGNoclN5bWJvbHMpICsgMTtcblxuICByZXR1cm4gY2FzdFNsaWNlKHN0clN5bWJvbHMsIHN0YXJ0LCBlbmQpLmpvaW4oJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRyaW07XG4iXX0=