'use strict';

var indexOfNaN = require('./_indexOfNaN'),
    toInteger = require('./toInteger');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * This method is like `_.indexOf` except that it iterates over elements of
 * `array` from right to left.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=array.length-1] The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.lastIndexOf([1, 2, 1, 2], 2);
 * // => 3
 *
 * // Search from the `fromIndex`.
 * _.lastIndexOf([1, 2, 1, 2], 2, 2);
 * // => 1
 */
function lastIndexOf(array, value, fromIndex) {
  var length = array ? array.length : 0;
  if (!length) {
    return -1;
  }
  var index = length;
  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index = (index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1)) + 1;
  }
  if (value !== value) {
    return indexOfNaN(array, index - 1, true);
  }
  while (index--) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = lastIndexOf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2xhc3RJbmRleE9mLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxhQUFhLFFBQVEsZUFBUixDQUFiO0lBQ0EsWUFBWSxRQUFRLGFBQVIsQ0FBWjs7O0FBR0osSUFBSSxZQUFZLEtBQUssR0FBTDtJQUNaLFlBQVksS0FBSyxHQUFMOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCaEIsU0FBUyxXQUFULENBQXFCLEtBQXJCLEVBQTRCLEtBQTVCLEVBQW1DLFNBQW5DLEVBQThDO0FBQzVDLE1BQUksU0FBUyxRQUFRLE1BQU0sTUFBTixHQUFlLENBQXZCLENBRCtCO0FBRTVDLE1BQUksQ0FBQyxNQUFELEVBQVM7QUFDWCxXQUFPLENBQUMsQ0FBRCxDQURJO0dBQWI7QUFHQSxNQUFJLFFBQVEsTUFBUixDQUx3QztBQU01QyxNQUFJLGNBQWMsU0FBZCxFQUF5QjtBQUMzQixZQUFRLFVBQVUsU0FBVixDQUFSLENBRDJCO0FBRTNCLFlBQVEsQ0FDTixRQUFRLENBQVIsR0FDSSxVQUFVLFNBQVMsS0FBVCxFQUFnQixDQUExQixDQURKLEdBRUksVUFBVSxLQUFWLEVBQWlCLFNBQVMsQ0FBVCxDQUZyQixDQURNLEdBSUosQ0FKSSxDQUZtQjtHQUE3QjtBQVFBLE1BQUksVUFBVSxLQUFWLEVBQWlCO0FBQ25CLFdBQU8sV0FBVyxLQUFYLEVBQWtCLFFBQVEsQ0FBUixFQUFXLElBQTdCLENBQVAsQ0FEbUI7R0FBckI7QUFHQSxTQUFPLE9BQVAsRUFBZ0I7QUFDZCxRQUFJLE1BQU0sS0FBTixNQUFpQixLQUFqQixFQUF3QjtBQUMxQixhQUFPLEtBQVAsQ0FEMEI7S0FBNUI7R0FERjtBQUtBLFNBQU8sQ0FBQyxDQUFELENBdEJxQztDQUE5Qzs7QUF5QkEsT0FBTyxPQUFQLEdBQWlCLFdBQWpCIiwiZmlsZSI6Imxhc3RJbmRleE9mLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGluZGV4T2ZOYU4gPSByZXF1aXJlKCcuL19pbmRleE9mTmFOJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uaW5kZXhPZmAgZXhjZXB0IHRoYXQgaXQgaXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZlxuICogYGFycmF5YCBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZnJvbUluZGV4PWFycmF5Lmxlbmd0aC0xXSBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmxhc3RJbmRleE9mKFsxLCAyLCAxLCAyXSwgMik7XG4gKiAvLyA9PiAzXG4gKlxuICogLy8gU2VhcmNoIGZyb20gdGhlIGBmcm9tSW5kZXhgLlxuICogXy5sYXN0SW5kZXhPZihbMSwgMiwgMSwgMl0sIDIsIDIpO1xuICogLy8gPT4gMVxuICovXG5mdW5jdGlvbiBsYXN0SW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICBpZiAoIWxlbmd0aCkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICB2YXIgaW5kZXggPSBsZW5ndGg7XG4gIGlmIChmcm9tSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgIGluZGV4ID0gdG9JbnRlZ2VyKGZyb21JbmRleCk7XG4gICAgaW5kZXggPSAoXG4gICAgICBpbmRleCA8IDBcbiAgICAgICAgPyBuYXRpdmVNYXgobGVuZ3RoICsgaW5kZXgsIDApXG4gICAgICAgIDogbmF0aXZlTWluKGluZGV4LCBsZW5ndGggLSAxKVxuICAgICkgKyAxO1xuICB9XG4gIGlmICh2YWx1ZSAhPT0gdmFsdWUpIHtcbiAgICByZXR1cm4gaW5kZXhPZk5hTihhcnJheSwgaW5kZXggLSAxLCB0cnVlKTtcbiAgfVxuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsYXN0SW5kZXhPZjtcbiJdfQ==