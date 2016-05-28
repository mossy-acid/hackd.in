'use strict';

var baseIteratee = require('./_baseIteratee'),
    baseSortedUniq = require('./_baseSortedUniq');

/**
 * This method is like `_.uniqBy` except that it's designed and optimized
 * for sorted arrays.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
 * // => [1.1, 2.3]
 */
function sortedUniqBy(array, iteratee) {
    return array && array.length ? baseSortedUniq(array, baseIteratee(iteratee)) : [];
}

module.exports = sortedUniqBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRlZFVuaXFCeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxpQkFBaUIsUUFBUSxtQkFBUixDQUFqQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JKLFNBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QixRQUE3QixFQUF1QztBQUNyQyxXQUFPLEtBQUMsSUFBUyxNQUFNLE1BQU4sR0FDYixlQUFlLEtBQWYsRUFBc0IsYUFBYSxRQUFiLENBQXRCLENBREcsR0FFSCxFQUZHLENBRDhCO0NBQXZDOztBQU1BLE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJzb3J0ZWRVbmlxQnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgYmFzZVNvcnRlZFVuaXEgPSByZXF1aXJlKCcuL19iYXNlU29ydGVkVW5pcScpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8udW5pcUJ5YCBleGNlcHQgdGhhdCBpdCdzIGRlc2lnbmVkIGFuZCBvcHRpbWl6ZWRcbiAqIGZvciBzb3J0ZWQgYXJyYXlzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWVdIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZHVwbGljYXRlIGZyZWUgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uc29ydGVkVW5pcUJ5KFsxLjEsIDEuMiwgMi4zLCAyLjRdLCBNYXRoLmZsb29yKTtcbiAqIC8vID0+IFsxLjEsIDIuM11cbiAqL1xuZnVuY3Rpb24gc29ydGVkVW5pcUJ5KGFycmF5LCBpdGVyYXRlZSkge1xuICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aClcbiAgICA/IGJhc2VTb3J0ZWRVbmlxKGFycmF5LCBiYXNlSXRlcmF0ZWUoaXRlcmF0ZWUpKVxuICAgIDogW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc29ydGVkVW5pcUJ5O1xuIl19