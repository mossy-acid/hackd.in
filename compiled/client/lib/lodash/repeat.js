'use strict';

var baseRepeat = require('./_baseRepeat'),
    isIterateeCall = require('./_isIterateeCall'),
    toInteger = require('./toInteger'),
    toString = require('./toString');

/**
 * Repeats the given string `n` times.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to repeat.
 * @param {number} [n=1] The number of times to repeat the string.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the repeated string.
 * @example
 *
 * _.repeat('*', 3);
 * // => '***'
 *
 * _.repeat('abc', 2);
 * // => 'abcabc'
 *
 * _.repeat('abc', 0);
 * // => ''
 */
function repeat(string, n, guard) {
  if (guard ? isIterateeCall(string, n, guard) : n === undefined) {
    n = 1;
  } else {
    n = toInteger(n);
  }
  return baseRepeat(toString(string), n);
}

module.exports = repeat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3JlcGVhdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGVBQVIsQ0FBYjtJQUNBLGlCQUFpQixRQUFRLG1CQUFSLENBQWpCO0lBQ0EsWUFBWSxRQUFRLGFBQVIsQ0FBWjtJQUNBLFdBQVcsUUFBUSxZQUFSLENBQVg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCSixTQUFTLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0IsQ0FBeEIsRUFBMkIsS0FBM0IsRUFBa0M7QUFDaEMsTUFBSyxRQUFRLGVBQWUsTUFBZixFQUF1QixDQUF2QixFQUEwQixLQUExQixDQUFSLEdBQTJDLE1BQU0sU0FBTixFQUFrQjtBQUNoRSxRQUFJLENBQUosQ0FEZ0U7R0FBbEUsTUFFTztBQUNMLFFBQUksVUFBVSxDQUFWLENBQUosQ0FESztHQUZQO0FBS0EsU0FBTyxXQUFXLFNBQVMsTUFBVCxDQUFYLEVBQTZCLENBQTdCLENBQVAsQ0FOZ0M7Q0FBbEM7O0FBU0EsT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6InJlcGVhdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlUmVwZWF0ID0gcmVxdWlyZSgnLi9fYmFzZVJlcGVhdCcpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9faXNJdGVyYXRlZUNhbGwnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpLFxuICAgIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKipcbiAqIFJlcGVhdHMgdGhlIGdpdmVuIHN0cmluZyBgbmAgdGltZXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gcmVwZWF0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtuPTFdIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gcmVwZWF0IHRoZSBzdHJpbmcuXG4gKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYW4gaXRlcmF0ZWUgZm9yIG1ldGhvZHMgbGlrZSBgXy5tYXBgLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmVwZWF0ZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnJlcGVhdCgnKicsIDMpO1xuICogLy8gPT4gJyoqKidcbiAqXG4gKiBfLnJlcGVhdCgnYWJjJywgMik7XG4gKiAvLyA9PiAnYWJjYWJjJ1xuICpcbiAqIF8ucmVwZWF0KCdhYmMnLCAwKTtcbiAqIC8vID0+ICcnXG4gKi9cbmZ1bmN0aW9uIHJlcGVhdChzdHJpbmcsIG4sIGd1YXJkKSB7XG4gIGlmICgoZ3VhcmQgPyBpc0l0ZXJhdGVlQ2FsbChzdHJpbmcsIG4sIGd1YXJkKSA6IG4gPT09IHVuZGVmaW5lZCkpIHtcbiAgICBuID0gMTtcbiAgfSBlbHNlIHtcbiAgICBuID0gdG9JbnRlZ2VyKG4pO1xuICB9XG4gIHJldHVybiBiYXNlUmVwZWF0KHRvU3RyaW5nKHN0cmluZyksIG4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcGVhdDtcbiJdfQ==