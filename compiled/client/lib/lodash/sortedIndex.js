'use strict';

var baseSortedIndex = require('./_baseSortedIndex');

/**
 * Uses a binary search to determine the lowest index at which `value`
 * should be inserted into `array` in order to maintain its sort order.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * _.sortedIndex([30, 50], 40);
 * // => 1
 */
function sortedIndex(array, value) {
  return baseSortedIndex(array, value);
}

module.exports = sortedIndex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRlZEluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxrQkFBa0IsUUFBUSxvQkFBUixDQUF0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxTQUFTLFdBQVQsQ0FBcUIsS0FBckIsRUFBNEIsS0FBNUIsRUFBbUM7QUFDakMsU0FBTyxnQkFBZ0IsS0FBaEIsRUFBdUIsS0FBdkIsQ0FBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixXQUFqQiIsImZpbGUiOiJzb3J0ZWRJbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlU29ydGVkSW5kZXggPSByZXF1aXJlKCcuL19iYXNlU29ydGVkSW5kZXgnKTtcblxuLyoqXG4gKiBVc2VzIGEgYmluYXJ5IHNlYXJjaCB0byBkZXRlcm1pbmUgdGhlIGxvd2VzdCBpbmRleCBhdCB3aGljaCBgdmFsdWVgXG4gKiBzaG91bGQgYmUgaW5zZXJ0ZWQgaW50byBgYXJyYXlgIGluIG9yZGVyIHRvIG1haW50YWluIGl0cyBzb3J0IG9yZGVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIHNvcnRlZCBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gZXZhbHVhdGUuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBhdCB3aGljaCBgdmFsdWVgIHNob3VsZCBiZSBpbnNlcnRlZFxuICogIGludG8gYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5zb3J0ZWRJbmRleChbMzAsIDUwXSwgNDApO1xuICogLy8gPT4gMVxuICovXG5mdW5jdGlvbiBzb3J0ZWRJbmRleChhcnJheSwgdmFsdWUpIHtcbiAgcmV0dXJuIGJhc2VTb3J0ZWRJbmRleChhcnJheSwgdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNvcnRlZEluZGV4O1xuIl19