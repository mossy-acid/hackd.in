'use strict';

var baseNth = require('./_baseNth'),
    rest = require('./rest'),
    toInteger = require('./toInteger');

/**
 * Creates a function that gets the argument at index `n`. If `n` is negative,
 * the nth argument from the end is returned.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {number} [n=0] The index of the argument to return.
 * @returns {Function} Returns the new pass-thru function.
 * @example
 *
 * var func = _.nthArg(1);
 * func('a', 'b', 'c', 'd');
 * // => 'b'
 *
 * var func = _.nthArg(-2);
 * func('a', 'b', 'c', 'd');
 * // => 'c'
 */
function nthArg(n) {
  n = toInteger(n);
  return rest(function (args) {
    return baseNth(args, n);
  });
}

module.exports = nthArg;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL250aEFyZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksVUFBVSxRQUFRLFlBQVIsQ0FBVjtJQUNBLE9BQU8sUUFBUSxRQUFSLENBQVA7SUFDQSxZQUFZLFFBQVEsYUFBUixDQUFaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JKLFNBQVMsTUFBVCxDQUFnQixDQUFoQixFQUFtQjtBQUNqQixNQUFJLFVBQVUsQ0FBVixDQUFKLENBRGlCO0FBRWpCLFNBQU8sS0FBSyxVQUFTLElBQVQsRUFBZTtBQUN6QixXQUFPLFFBQVEsSUFBUixFQUFjLENBQWQsQ0FBUCxDQUR5QjtHQUFmLENBQVosQ0FGaUI7Q0FBbkI7O0FBT0EsT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6Im50aEFyZy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlTnRoID0gcmVxdWlyZSgnLi9fYmFzZU50aCcpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGdldHMgdGhlIGFyZ3VtZW50IGF0IGluZGV4IGBuYC4gSWYgYG5gIGlzIG5lZ2F0aXZlLFxuICogdGhlIG50aCBhcmd1bWVudCBmcm9tIHRoZSBlbmQgaXMgcmV0dXJuZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7bnVtYmVyfSBbbj0wXSBUaGUgaW5kZXggb2YgdGhlIGFyZ3VtZW50IHRvIHJldHVybi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHBhc3MtdGhydSBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGZ1bmMgPSBfLm50aEFyZygxKTtcbiAqIGZ1bmMoJ2EnLCAnYicsICdjJywgJ2QnKTtcbiAqIC8vID0+ICdiJ1xuICpcbiAqIHZhciBmdW5jID0gXy5udGhBcmcoLTIpO1xuICogZnVuYygnYScsICdiJywgJ2MnLCAnZCcpO1xuICogLy8gPT4gJ2MnXG4gKi9cbmZ1bmN0aW9uIG50aEFyZyhuKSB7XG4gIG4gPSB0b0ludGVnZXIobik7XG4gIHJldHVybiByZXN0KGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICByZXR1cm4gYmFzZU50aChhcmdzLCBuKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbnRoQXJnO1xuIl19