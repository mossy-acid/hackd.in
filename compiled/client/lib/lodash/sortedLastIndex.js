'use strict';

var baseSortedIndex = require('./_baseSortedIndex');

/**
 * This method is like `_.sortedIndex` except that it returns the highest
 * index at which `value` should be inserted into `array` in order to
 * maintain its sort order.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
 * // => 4
 */
function sortedLastIndex(array, value) {
  return baseSortedIndex(array, value, true);
}

module.exports = sortedLastIndex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRlZExhc3RJbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksa0JBQWtCLFFBQVEsb0JBQVIsQ0FBdEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLFNBQVMsZUFBVCxDQUF5QixLQUF6QixFQUFnQyxLQUFoQyxFQUF1QztBQUNyQyxTQUFPLGdCQUFnQixLQUFoQixFQUF1QixLQUF2QixFQUE4QixJQUE5QixDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLGVBQWpCIiwiZmlsZSI6InNvcnRlZExhc3RJbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlU29ydGVkSW5kZXggPSByZXF1aXJlKCcuL19iYXNlU29ydGVkSW5kZXgnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnNvcnRlZEluZGV4YCBleGNlcHQgdGhhdCBpdCByZXR1cm5zIHRoZSBoaWdoZXN0XG4gKiBpbmRleCBhdCB3aGljaCBgdmFsdWVgIHNob3VsZCBiZSBpbnNlcnRlZCBpbnRvIGBhcnJheWAgaW4gb3JkZXIgdG9cbiAqIG1haW50YWluIGl0cyBzb3J0IG9yZGVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIHNvcnRlZCBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gZXZhbHVhdGUuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBhdCB3aGljaCBgdmFsdWVgIHNob3VsZCBiZSBpbnNlcnRlZFxuICogIGludG8gYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5zb3J0ZWRMYXN0SW5kZXgoWzQsIDUsIDUsIDUsIDZdLCA1KTtcbiAqIC8vID0+IDRcbiAqL1xuZnVuY3Rpb24gc29ydGVkTGFzdEluZGV4KGFycmF5LCB2YWx1ZSkge1xuICByZXR1cm4gYmFzZVNvcnRlZEluZGV4KGFycmF5LCB2YWx1ZSwgdHJ1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc29ydGVkTGFzdEluZGV4O1xuIl19