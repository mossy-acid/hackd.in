'use strict';

var baseSortedIndex = require('./_baseSortedIndex'),
    eq = require('./eq');

/**
 * This method is like `_.indexOf` except that it performs a binary
 * search on a sorted `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
 * // => 1
 */
function sortedIndexOf(array, value) {
  var length = array ? array.length : 0;
  if (length) {
    var index = baseSortedIndex(array, value);
    if (index < length && eq(array[index], value)) {
      return index;
    }
  }
  return -1;
}

module.exports = sortedIndexOf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRlZEluZGV4T2YuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGtCQUFrQixRQUFRLG9CQUFSLENBQWxCO0lBQ0EsS0FBSyxRQUFRLE1BQVIsQ0FBTDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JKLFNBQVMsYUFBVCxDQUF1QixLQUF2QixFQUE4QixLQUE5QixFQUFxQztBQUNuQyxNQUFJLFNBQVMsUUFBUSxNQUFNLE1BQU4sR0FBZSxDQUF2QixDQURzQjtBQUVuQyxNQUFJLE1BQUosRUFBWTtBQUNWLFFBQUksUUFBUSxnQkFBZ0IsS0FBaEIsRUFBdUIsS0FBdkIsQ0FBUixDQURNO0FBRVYsUUFBSSxRQUFRLE1BQVIsSUFBa0IsR0FBRyxNQUFNLEtBQU4sQ0FBSCxFQUFpQixLQUFqQixDQUFsQixFQUEyQztBQUM3QyxhQUFPLEtBQVAsQ0FENkM7S0FBL0M7R0FGRjtBQU1BLFNBQU8sQ0FBQyxDQUFELENBUjRCO0NBQXJDOztBQVdBLE9BQU8sT0FBUCxHQUFpQixhQUFqQiIsImZpbGUiOiJzb3J0ZWRJbmRleE9mLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VTb3J0ZWRJbmRleCA9IHJlcXVpcmUoJy4vX2Jhc2VTb3J0ZWRJbmRleCcpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uaW5kZXhPZmAgZXhjZXB0IHRoYXQgaXQgcGVyZm9ybXMgYSBiaW5hcnlcbiAqIHNlYXJjaCBvbiBhIHNvcnRlZCBgYXJyYXlgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnNvcnRlZEluZGV4T2YoWzQsIDUsIDUsIDUsIDZdLCA1KTtcbiAqIC8vID0+IDFcbiAqL1xuZnVuY3Rpb24gc29ydGVkSW5kZXhPZihhcnJheSwgdmFsdWUpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgaWYgKGxlbmd0aCkge1xuICAgIHZhciBpbmRleCA9IGJhc2VTb3J0ZWRJbmRleChhcnJheSwgdmFsdWUpO1xuICAgIGlmIChpbmRleCA8IGxlbmd0aCAmJiBlcShhcnJheVtpbmRleF0sIHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc29ydGVkSW5kZXhPZjtcbiJdfQ==