'use strict';

var isNumber = require('./isNumber');

/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is based on
 * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
 * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
 * `undefined` and other non-number values.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some
  // ActiveX objects in IE.
  return isNumber(value) && value != +value;
}

module.exports = isNaN;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzTmFOLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLFFBQVEsWUFBUixDQUFYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4QkosU0FBUyxLQUFULENBQWUsS0FBZixFQUFzQjs7OztBQUlwQixTQUFPLFNBQVMsS0FBVCxLQUFtQixTQUFTLENBQUMsS0FBRCxDQUpmO0NBQXRCOztBQU9BLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJpc05hTi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpc051bWJlciA9IHJlcXVpcmUoJy4vaXNOdW1iZXInKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBgTmFOYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb25cbiAqIFtgTnVtYmVyLmlzTmFOYF0oaHR0cHM6Ly9tZG4uaW8vTnVtYmVyL2lzTmFOKSBhbmQgaXMgbm90IHRoZSBzYW1lIGFzXG4gKiBnbG9iYWwgW2Bpc05hTmBdKGh0dHBzOi8vbWRuLmlvL2lzTmFOKSB3aGljaCByZXR1cm5zIGB0cnVlYCBmb3JcbiAqIGB1bmRlZmluZWRgIGFuZCBvdGhlciBub24tbnVtYmVyIHZhbHVlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBgTmFOYCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTmFOKE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hTihuZXcgTnVtYmVyKE5hTikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIGlzTmFOKHVuZGVmaW5lZCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hTih1bmRlZmluZWQpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYU4odmFsdWUpIHtcbiAgLy8gQW4gYE5hTmAgcHJpbWl0aXZlIGlzIHRoZSBvbmx5IHZhbHVlIHRoYXQgaXMgbm90IGVxdWFsIHRvIGl0c2VsZi5cbiAgLy8gUGVyZm9ybSB0aGUgYHRvU3RyaW5nVGFnYCBjaGVjayBmaXJzdCB0byBhdm9pZCBlcnJvcnMgd2l0aCBzb21lXG4gIC8vIEFjdGl2ZVggb2JqZWN0cyBpbiBJRS5cbiAgcmV0dXJuIGlzTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSAhPSArdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOYU47XG4iXX0=