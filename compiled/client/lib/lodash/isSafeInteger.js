'use strict';

var isInteger = require('./isInteger');

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
 * double precision number which isn't the result of a rounded unsafe integer.
 *
 * **Note:** This method is based on
 * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a safe integer,
 *  else `false`.
 * @example
 *
 * _.isSafeInteger(3);
 * // => true
 *
 * _.isSafeInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isSafeInteger(Infinity);
 * // => false
 *
 * _.isSafeInteger('3');
 * // => false
 */
function isSafeInteger(value) {
  return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
}

module.exports = isSafeInteger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzU2FmZUludGVnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxhQUFSLENBQVo7OztBQUdKLElBQUksbUJBQW1CLGdCQUFuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOEJKLFNBQVMsYUFBVCxDQUF1QixLQUF2QixFQUE4QjtBQUM1QixTQUFPLFVBQVUsS0FBVixLQUFvQixTQUFTLENBQUMsZ0JBQUQsSUFBcUIsU0FBUyxnQkFBVCxDQUQ3QjtDQUE5Qjs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsYUFBakIiLCJmaWxlIjoiaXNTYWZlSW50ZWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpc0ludGVnZXIgPSByZXF1aXJlKCcuL2lzSW50ZWdlcicpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHNhZmUgaW50ZWdlci4gQW4gaW50ZWdlciBpcyBzYWZlIGlmIGl0J3MgYW4gSUVFRS03NTRcbiAqIGRvdWJsZSBwcmVjaXNpb24gbnVtYmVyIHdoaWNoIGlzbid0IHRoZSByZXN1bHQgb2YgYSByb3VuZGVkIHVuc2FmZSBpbnRlZ2VyLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBiYXNlZCBvblxuICogW2BOdW1iZXIuaXNTYWZlSW50ZWdlcmBdKGh0dHBzOi8vbWRuLmlvL051bWJlci9pc1NhZmVJbnRlZ2VyKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHNhZmUgaW50ZWdlcixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTYWZlSW50ZWdlcigzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU2FmZUludGVnZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNTYWZlSW50ZWdlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNTYWZlSW50ZWdlcignMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTYWZlSW50ZWdlcih2YWx1ZSkge1xuICByZXR1cm4gaXNJbnRlZ2VyKHZhbHVlKSAmJiB2YWx1ZSA+PSAtTUFYX1NBRkVfSU5URUdFUiAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU2FmZUludGVnZXI7XG4iXX0=