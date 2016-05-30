'use strict';

var baseToString = require('./_baseToString'),
    castSlice = require('./_castSlice'),
    charsEndIndex = require('./_charsEndIndex'),
    stringToArray = require('./_stringToArray'),
    toString = require('./toString');

/** Used to match leading and trailing whitespace. */
var reTrimEnd = /\s+$/;

/**
 * Removes trailing whitespace or specified characters from `string`.
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
 * _.trimEnd('  abc  ');
 * // => '  abc'
 *
 * _.trimEnd('-_-abc-_-', '_-');
 * // => '-_-abc'
 */
function trimEnd(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrimEnd, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  var strSymbols = stringToArray(string),
      end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

  return castSlice(strSymbols, 0, end).join('');
}

module.exports = trimEnd;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RyaW1FbmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGVBQWUsUUFBUSxpQkFBUixDQUFuQjtJQUNJLFlBQVksUUFBUSxjQUFSLENBRGhCO0lBRUksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FGcEI7SUFHSSxnQkFBZ0IsUUFBUSxrQkFBUixDQUhwQjtJQUlJLFdBQVcsUUFBUSxZQUFSLENBSmY7OztBQU9BLElBQUksWUFBWSxNQUFoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBLFNBQVMsT0FBVCxDQUFpQixNQUFqQixFQUF5QixLQUF6QixFQUFnQyxLQUFoQyxFQUF1QztBQUNyQyxXQUFTLFNBQVMsTUFBVCxDQUFUO0FBQ0EsTUFBSSxXQUFXLFNBQVMsVUFBVSxTQUE5QixDQUFKLEVBQThDO0FBQzVDLFdBQU8sT0FBTyxPQUFQLENBQWUsU0FBZixFQUEwQixFQUExQixDQUFQO0FBQ0Q7QUFDRCxNQUFJLENBQUMsTUFBRCxJQUFXLEVBQUUsUUFBUSxhQUFhLEtBQWIsQ0FBVixDQUFmLEVBQStDO0FBQzdDLFdBQU8sTUFBUDtBQUNEO0FBQ0QsTUFBSSxhQUFhLGNBQWMsTUFBZCxDQUFqQjtNQUNJLE1BQU0sY0FBYyxVQUFkLEVBQTBCLGNBQWMsS0FBZCxDQUExQixJQUFrRCxDQUQ1RDs7QUFHQSxTQUFPLFVBQVUsVUFBVixFQUFzQixDQUF0QixFQUF5QixHQUF6QixFQUE4QixJQUE5QixDQUFtQyxFQUFuQyxDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6InRyaW1FbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVRvU3RyaW5nID0gcmVxdWlyZSgnLi9fYmFzZVRvU3RyaW5nJyksXG4gICAgY2FzdFNsaWNlID0gcmVxdWlyZSgnLi9fY2FzdFNsaWNlJyksXG4gICAgY2hhcnNFbmRJbmRleCA9IHJlcXVpcmUoJy4vX2NoYXJzRW5kSW5kZXgnKSxcbiAgICBzdHJpbmdUb0FycmF5ID0gcmVxdWlyZSgnLi9fc3RyaW5nVG9BcnJheScpLFxuICAgIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbUVuZCA9IC9cXHMrJC87XG5cbi8qKlxuICogUmVtb3ZlcyB0cmFpbGluZyB3aGl0ZXNwYWNlIG9yIHNwZWNpZmllZCBjaGFyYWN0ZXJzIGZyb20gYHN0cmluZ2AuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gdHJpbS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY2hhcnM9d2hpdGVzcGFjZV0gVGhlIGNoYXJhY3RlcnMgdG8gdHJpbS5cbiAqIEBwYXJhbS0ge09iamVjdH0gW2d1YXJkXSBFbmFibGVzIHVzZSBhcyBhbiBpdGVyYXRlZSBmb3IgbWV0aG9kcyBsaWtlIGBfLm1hcGAuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSB0cmltbWVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50cmltRW5kKCcgIGFiYyAgJyk7XG4gKiAvLyA9PiAnICBhYmMnXG4gKlxuICogXy50cmltRW5kKCctXy1hYmMtXy0nLCAnXy0nKTtcbiAqIC8vID0+ICctXy1hYmMnXG4gKi9cbmZ1bmN0aW9uIHRyaW1FbmQoc3RyaW5nLCBjaGFycywgZ3VhcmQpIHtcbiAgc3RyaW5nID0gdG9TdHJpbmcoc3RyaW5nKTtcbiAgaWYgKHN0cmluZyAmJiAoZ3VhcmQgfHwgY2hhcnMgPT09IHVuZGVmaW5lZCkpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UocmVUcmltRW5kLCAnJyk7XG4gIH1cbiAgaWYgKCFzdHJpbmcgfHwgIShjaGFycyA9IGJhc2VUb1N0cmluZyhjaGFycykpKSB7XG4gICAgcmV0dXJuIHN0cmluZztcbiAgfVxuICB2YXIgc3RyU3ltYm9scyA9IHN0cmluZ1RvQXJyYXkoc3RyaW5nKSxcbiAgICAgIGVuZCA9IGNoYXJzRW5kSW5kZXgoc3RyU3ltYm9scywgc3RyaW5nVG9BcnJheShjaGFycykpICsgMTtcblxuICByZXR1cm4gY2FzdFNsaWNlKHN0clN5bWJvbHMsIDAsIGVuZCkuam9pbignJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJpbUVuZDtcbiJdfQ==