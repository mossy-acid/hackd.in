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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRlZExhc3RJbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksa0JBQWtCLFFBQVEsb0JBQVIsQ0FBbEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JKLFNBQVMsZUFBVCxDQUF5QixLQUF6QixFQUFnQyxLQUFoQyxFQUF1QztBQUNyQyxTQUFPLGdCQUFnQixLQUFoQixFQUF1QixLQUF2QixFQUE4QixJQUE5QixDQUFQLENBRHFDO0NBQXZDOztBQUlBLE9BQU8sT0FBUCxHQUFpQixlQUFqQiIsImZpbGUiOiJzb3J0ZWRMYXN0SW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVNvcnRlZEluZGV4ID0gcmVxdWlyZSgnLi9fYmFzZVNvcnRlZEluZGV4Jyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5zb3J0ZWRJbmRleGAgZXhjZXB0IHRoYXQgaXQgcmV0dXJucyB0aGUgaGlnaGVzdFxuICogaW5kZXggYXQgd2hpY2ggYHZhbHVlYCBzaG91bGQgYmUgaW5zZXJ0ZWQgaW50byBgYXJyYXlgIGluIG9yZGVyIHRvXG4gKiBtYWludGFpbiBpdHMgc29ydCBvcmRlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBzb3J0ZWQgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGV2YWx1YXRlLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggYXQgd2hpY2ggYHZhbHVlYCBzaG91bGQgYmUgaW5zZXJ0ZWRcbiAqICBpbnRvIGBhcnJheWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uc29ydGVkTGFzdEluZGV4KFs0LCA1LCA1LCA1LCA2XSwgNSk7XG4gKiAvLyA9PiA0XG4gKi9cbmZ1bmN0aW9uIHNvcnRlZExhc3RJbmRleChhcnJheSwgdmFsdWUpIHtcbiAgcmV0dXJuIGJhc2VTb3J0ZWRJbmRleChhcnJheSwgdmFsdWUsIHRydWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNvcnRlZExhc3RJbmRleDtcbiJdfQ==