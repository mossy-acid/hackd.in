'use strict';

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that negates the result of the predicate `func`. The
 * `func` predicate is invoked with the `this` binding and arguments of the
 * created function.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} predicate The predicate to negate.
 * @returns {Function} Returns the new negated function.
 * @example
 *
 * function isEven(n) {
 *   return n % 2 == 0;
 * }
 *
 * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
 * // => [1, 3, 5]
 */
function negate(predicate) {
  if (typeof predicate != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  return function () {
    return !predicate.apply(this, arguments);
  };
}

module.exports = negate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL25lZ2F0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxJQUFJLGtCQUFrQixxQkFBdEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkEsU0FBUyxNQUFULENBQWdCLFNBQWhCLEVBQTJCO0FBQ3pCLE1BQUksT0FBTyxTQUFQLElBQW9CLFVBQXhCLEVBQW9DO0FBQ2xDLFVBQU0sSUFBSSxTQUFKLENBQWMsZUFBZCxDQUFOO0FBQ0Q7QUFDRCxTQUFPLFlBQVc7QUFDaEIsV0FBTyxDQUFDLFVBQVUsS0FBVixDQUFnQixJQUFoQixFQUFzQixTQUF0QixDQUFSO0FBQ0QsR0FGRDtBQUdEOztBQUVELE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJuZWdhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBuZWdhdGVzIHRoZSByZXN1bHQgb2YgdGhlIHByZWRpY2F0ZSBgZnVuY2AuIFRoZVxuICogYGZ1bmNgIHByZWRpY2F0ZSBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIGFuZCBhcmd1bWVudHMgb2YgdGhlXG4gKiBjcmVhdGVkIGZ1bmN0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBwcmVkaWNhdGUgdG8gbmVnYXRlLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbmVnYXRlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gaXNFdmVuKG4pIHtcbiAqICAgcmV0dXJuIG4gJSAyID09IDA7XG4gKiB9XG4gKlxuICogXy5maWx0ZXIoWzEsIDIsIDMsIDQsIDUsIDZdLCBfLm5lZ2F0ZShpc0V2ZW4pKTtcbiAqIC8vID0+IFsxLCAzLCA1XVxuICovXG5mdW5jdGlvbiBuZWdhdGUocHJlZGljYXRlKSB7XG4gIGlmICh0eXBlb2YgcHJlZGljYXRlICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmVnYXRlO1xuIl19