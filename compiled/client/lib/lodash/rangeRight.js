'use strict';

var createRange = require('./_createRange');

/**
 * This method is like `_.range` except that it populates values in
 * descending order.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the range of numbers.
 * @see _.inRange, _.range
 * @example
 *
 * _.rangeRight(4);
 * // => [3, 2, 1, 0]
 *
 * _.rangeRight(-4);
 * // => [-3, -2, -1, 0]
 *
 * _.rangeRight(1, 5);
 * // => [4, 3, 2, 1]
 *
 * _.rangeRight(0, 20, 5);
 * // => [15, 10, 5, 0]
 *
 * _.rangeRight(0, -4, -1);
 * // => [-3, -2, -1, 0]
 *
 * _.rangeRight(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.rangeRight(0);
 * // => []
 */
var rangeRight = createRange(true);

module.exports = rangeRight;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3JhbmdlUmlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFkOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNDSixJQUFJLGFBQWEsWUFBWSxJQUFaLENBQWI7O0FBRUosT0FBTyxPQUFQLEdBQWlCLFVBQWpCIiwiZmlsZSI6InJhbmdlUmlnaHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3JlYXRlUmFuZ2UgPSByZXF1aXJlKCcuL19jcmVhdGVSYW5nZScpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ucmFuZ2VgIGV4Y2VwdCB0aGF0IGl0IHBvcHVsYXRlcyB2YWx1ZXMgaW5cbiAqIGRlc2NlbmRpbmcgb3JkZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhlIGVuZCBvZiB0aGUgcmFuZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0ZXA9MV0gVGhlIHZhbHVlIHRvIGluY3JlbWVudCBvciBkZWNyZW1lbnQgYnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHJhbmdlIG9mIG51bWJlcnMuXG4gKiBAc2VlIF8uaW5SYW5nZSwgXy5yYW5nZVxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnJhbmdlUmlnaHQoNCk7XG4gKiAvLyA9PiBbMywgMiwgMSwgMF1cbiAqXG4gKiBfLnJhbmdlUmlnaHQoLTQpO1xuICogLy8gPT4gWy0zLCAtMiwgLTEsIDBdXG4gKlxuICogXy5yYW5nZVJpZ2h0KDEsIDUpO1xuICogLy8gPT4gWzQsIDMsIDIsIDFdXG4gKlxuICogXy5yYW5nZVJpZ2h0KDAsIDIwLCA1KTtcbiAqIC8vID0+IFsxNSwgMTAsIDUsIDBdXG4gKlxuICogXy5yYW5nZVJpZ2h0KDAsIC00LCAtMSk7XG4gKiAvLyA9PiBbLTMsIC0yLCAtMSwgMF1cbiAqXG4gKiBfLnJhbmdlUmlnaHQoMSwgNCwgMCk7XG4gKiAvLyA9PiBbMSwgMSwgMV1cbiAqXG4gKiBfLnJhbmdlUmlnaHQoMCk7XG4gKiAvLyA9PiBbXVxuICovXG52YXIgcmFuZ2VSaWdodCA9IGNyZWF0ZVJhbmdlKHRydWUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJhbmdlUmlnaHQ7XG4iXX0=