'use strict';

var drop = require('./drop');

/**
 * Gets all but the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.tail([1, 2, 3]);
 * // => [2, 3]
 */
function tail(array) {
  return drop(array, 1);
}

module.exports = tail;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RhaWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE9BQU8sUUFBUSxRQUFSLENBQVg7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsU0FBUyxJQUFULENBQWMsS0FBZCxFQUFxQjtBQUNuQixTQUFPLEtBQUssS0FBTCxFQUFZLENBQVosQ0FBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJ0YWlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGRyb3AgPSByZXF1aXJlKCcuL2Ryb3AnKTtcblxuLyoqXG4gKiBHZXRzIGFsbCBidXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYGFycmF5YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50YWlsKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBbMiwgM11cbiAqL1xuZnVuY3Rpb24gdGFpbChhcnJheSkge1xuICByZXR1cm4gZHJvcChhcnJheSwgMSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGFpbDtcbiJdfQ==