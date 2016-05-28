"use strict";

/**
 * This method is like `_.tap` except that it returns the result of `interceptor`.
 * The purpose of this method is to "pass thru" values replacing intermediate
 * results in a method chain sequence.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Seq
 * @param {*} value The value to provide to `interceptor`.
 * @param {Function} interceptor The function to invoke.
 * @returns {*} Returns the result of `interceptor`.
 * @example
 *
 * _('  abc  ')
 *  .chain()
 *  .trim()
 *  .thru(function(value) {
 *    return [value];
 *  })
 *  .value();
 * // => ['abc']
 */
function thru(value, interceptor) {
  return interceptor(value);
}

module.exports = thru;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RocnUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCQSxTQUFTLElBQVQsQ0FBYyxLQUFkLEVBQXFCLFdBQXJCLEVBQWtDO0FBQ2hDLFNBQU8sWUFBWSxLQUFaLENBQVAsQ0FEZ0M7Q0FBbEM7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6InRocnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8udGFwYCBleGNlcHQgdGhhdCBpdCByZXR1cm5zIHRoZSByZXN1bHQgb2YgYGludGVyY2VwdG9yYC5cbiAqIFRoZSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwicGFzcyB0aHJ1XCIgdmFsdWVzIHJlcGxhY2luZyBpbnRlcm1lZGlhdGVcbiAqIHJlc3VsdHMgaW4gYSBtZXRob2QgY2hhaW4gc2VxdWVuY2UuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IFNlcVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvdmlkZSB0byBgaW50ZXJjZXB0b3JgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaW50ZXJjZXB0b3IgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGludGVyY2VwdG9yYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXygnICBhYmMgICcpXG4gKiAgLmNoYWluKClcbiAqICAudHJpbSgpXG4gKiAgLnRocnUoZnVuY3Rpb24odmFsdWUpIHtcbiAqICAgIHJldHVybiBbdmFsdWVdO1xuICogIH0pXG4gKiAgLnZhbHVlKCk7XG4gKiAvLyA9PiBbJ2FiYyddXG4gKi9cbmZ1bmN0aW9uIHRocnUodmFsdWUsIGludGVyY2VwdG9yKSB7XG4gIHJldHVybiBpbnRlcmNlcHRvcih2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGhydTtcbiJdfQ==