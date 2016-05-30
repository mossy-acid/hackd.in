'use strict';

var baseMean = require('./_baseMean'),
    identity = require('./identity');

/**
 * Computes the mean of the values in `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {number} Returns the mean.
 * @example
 *
 * _.mean([4, 2, 8, 6]);
 * // => 5
 */
function mean(array) {
  return baseMean(array, identity);
}

module.exports = mean;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL21lYW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxhQUFSLENBQWY7SUFDSSxXQUFXLFFBQVEsWUFBUixDQURmOzs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLFNBQVMsSUFBVCxDQUFjLEtBQWQsRUFBcUI7QUFDbkIsU0FBTyxTQUFTLEtBQVQsRUFBZ0IsUUFBaEIsQ0FBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJtZWFuLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VNZWFuID0gcmVxdWlyZSgnLi9fYmFzZU1lYW4nKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgbWVhbiBvZiB0aGUgdmFsdWVzIGluIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IE1hdGhcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBtZWFuLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLm1lYW4oWzQsIDIsIDgsIDZdKTtcbiAqIC8vID0+IDVcbiAqL1xuZnVuY3Rpb24gbWVhbihhcnJheSkge1xuICByZXR1cm4gYmFzZU1lYW4oYXJyYXksIGlkZW50aXR5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZWFuO1xuIl19