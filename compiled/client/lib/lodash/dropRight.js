'use strict';

var baseSlice = require('./_baseSlice'),
    toInteger = require('./toInteger');

/**
 * Creates a slice of `array` with `n` elements dropped from the end.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to drop.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.dropRight([1, 2, 3]);
 * // => [1, 2]
 *
 * _.dropRight([1, 2, 3], 2);
 * // => [1]
 *
 * _.dropRight([1, 2, 3], 5);
 * // => []
 *
 * _.dropRight([1, 2, 3], 0);
 * // => [1, 2, 3]
 */
function dropRight(array, n, guard) {
  var length = array ? array.length : 0;
  if (!length) {
    return [];
  }
  n = guard || n === undefined ? 1 : toInteger(n);
  n = length - n;
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

module.exports = dropRight;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Ryb3BSaWdodC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxRQUFRLGNBQVIsQ0FBWjtJQUNBLFlBQVksUUFBUSxhQUFSLENBQVo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCSixTQUFTLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsQ0FBMUIsRUFBNkIsS0FBN0IsRUFBb0M7QUFDbEMsTUFBSSxTQUFTLFFBQVEsTUFBTSxNQUFOLEdBQWUsQ0FBdkIsQ0FEcUI7QUFFbEMsTUFBSSxDQUFDLE1BQUQsRUFBUztBQUNYLFdBQU8sRUFBUCxDQURXO0dBQWI7QUFHQSxNQUFJLEtBQUMsSUFBUyxNQUFNLFNBQU4sR0FBbUIsQ0FBN0IsR0FBaUMsVUFBVSxDQUFWLENBQWpDLENBTDhCO0FBTWxDLE1BQUksU0FBUyxDQUFULENBTjhCO0FBT2xDLFNBQU8sVUFBVSxLQUFWLEVBQWlCLENBQWpCLEVBQW9CLElBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFaLENBQTNCLENBUGtDO0NBQXBDOztBQVVBLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJkcm9wUmlnaHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVNsaWNlID0gcmVxdWlyZSgnLi9fYmFzZVNsaWNlJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2xpY2Ugb2YgYGFycmF5YCB3aXRoIGBuYCBlbGVtZW50cyBkcm9wcGVkIGZyb20gdGhlIGVuZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbj0xXSBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIGRyb3AuXG4gKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYW4gaXRlcmF0ZWUgZm9yIG1ldGhvZHMgbGlrZSBgXy5tYXBgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBzbGljZSBvZiBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRyb3BSaWdodChbMSwgMiwgM10pO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogXy5kcm9wUmlnaHQoWzEsIDIsIDNdLCAyKTtcbiAqIC8vID0+IFsxXVxuICpcbiAqIF8uZHJvcFJpZ2h0KFsxLCAyLCAzXSwgNSk7XG4gKiAvLyA9PiBbXVxuICpcbiAqIF8uZHJvcFJpZ2h0KFsxLCAyLCAzXSwgMCk7XG4gKiAvLyA9PiBbMSwgMiwgM11cbiAqL1xuZnVuY3Rpb24gZHJvcFJpZ2h0KGFycmF5LCBuLCBndWFyZCkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICBpZiAoIWxlbmd0aCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBuID0gKGd1YXJkIHx8IG4gPT09IHVuZGVmaW5lZCkgPyAxIDogdG9JbnRlZ2VyKG4pO1xuICBuID0gbGVuZ3RoIC0gbjtcbiAgcmV0dXJuIGJhc2VTbGljZShhcnJheSwgMCwgbiA8IDAgPyAwIDogbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZHJvcFJpZ2h0O1xuIl19