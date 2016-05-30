"use strict";

/**
 * This method invokes `interceptor` and returns `value`. The interceptor
 * is invoked with one argument; (value). The purpose of this method is to
 * "tap into" a method chain sequence in order to modify intermediate results.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Seq
 * @param {*} value The value to provide to `interceptor`.
 * @param {Function} interceptor The function to invoke.
 * @returns {*} Returns `value`.
 * @example
 *
 * _([1, 2, 3])
 *  .tap(function(array) {
 *    // Mutate input array.
 *    array.pop();
 *  })
 *  .reverse()
 *  .value();
 * // => [2, 1]
 */
function tap(value, interceptor) {
  interceptor(value);
  return value;
}

module.exports = tap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RhcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJBLFNBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0IsV0FBcEIsRUFBaUM7QUFDL0IsY0FBWSxLQUFaO0FBQ0EsU0FBTyxLQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLEdBQWpCIiwiZmlsZSI6InRhcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhpcyBtZXRob2QgaW52b2tlcyBgaW50ZXJjZXB0b3JgIGFuZCByZXR1cm5zIGB2YWx1ZWAuIFRoZSBpbnRlcmNlcHRvclxuICogaXMgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDsgKHZhbHVlKS4gVGhlIHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG9cbiAqIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiBzZXF1ZW5jZSBpbiBvcmRlciB0byBtb2RpZnkgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IFNlcVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvdmlkZSB0byBgaW50ZXJjZXB0b3JgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaW50ZXJjZXB0b3IgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8oWzEsIDIsIDNdKVxuICogIC50YXAoZnVuY3Rpb24oYXJyYXkpIHtcbiAqICAgIC8vIE11dGF0ZSBpbnB1dCBhcnJheS5cbiAqICAgIGFycmF5LnBvcCgpO1xuICogIH0pXG4gKiAgLnJldmVyc2UoKVxuICogIC52YWx1ZSgpO1xuICogLy8gPT4gWzIsIDFdXG4gKi9cbmZ1bmN0aW9uIHRhcCh2YWx1ZSwgaW50ZXJjZXB0b3IpIHtcbiAgaW50ZXJjZXB0b3IodmFsdWUpO1xuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGFwO1xuIl19