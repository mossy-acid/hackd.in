'use strict';

var baseSortedUniq = require('./_baseSortedUniq');

/**
 * This method is like `_.uniq` except that it's designed and optimized
 * for sorted arrays.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.sortedUniq([1, 1, 2]);
 * // => [1, 2]
 */
function sortedUniq(array) {
  return array && array.length ? baseSortedUniq(array) : [];
}

module.exports = sortedUniq;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRlZFVuaXEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGlCQUFpQixRQUFRLG1CQUFSLENBQWpCOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCSixTQUFTLFVBQVQsQ0FBb0IsS0FBcEIsRUFBMkI7QUFDekIsU0FBTyxLQUFDLElBQVMsTUFBTSxNQUFOLEdBQ2IsZUFBZSxLQUFmLENBREcsR0FFSCxFQUZHLENBRGtCO0NBQTNCOztBQU1BLE9BQU8sT0FBUCxHQUFpQixVQUFqQiIsImZpbGUiOiJzb3J0ZWRVbmlxLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VTb3J0ZWRVbmlxID0gcmVxdWlyZSgnLi9fYmFzZVNvcnRlZFVuaXEnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnVuaXFgIGV4Y2VwdCB0aGF0IGl0J3MgZGVzaWduZWQgYW5kIG9wdGltaXplZFxuICogZm9yIHNvcnRlZCBhcnJheXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGR1cGxpY2F0ZSBmcmVlIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnNvcnRlZFVuaXEoWzEsIDEsIDJdKTtcbiAqIC8vID0+IFsxLCAyXVxuICovXG5mdW5jdGlvbiBzb3J0ZWRVbmlxKGFycmF5KSB7XG4gIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoKVxuICAgID8gYmFzZVNvcnRlZFVuaXEoYXJyYXkpXG4gICAgOiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzb3J0ZWRVbmlxO1xuIl19