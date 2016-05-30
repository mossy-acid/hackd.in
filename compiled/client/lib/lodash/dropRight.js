'use strict';

var baseSlice = require('./_baseSlice'),
    toInteger = require('./toInteger');

/**
 * Creates a slice of `array` with `n` elements dropped from the end.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to drop.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.dropRight([1, 2, 3]);
 * // => [1, 2]
 *
 * _.dropRight([1, 2, 3], 2);
 * // => [1]
 *
 * _.dropRight([1, 2, 3], 5);
 * // => []
 *
 * _.dropRight([1, 2, 3], 0);
 * // => [1, 2, 3]
 */
function dropRight(array, n, guard) {
  var length = array ? array.length : 0;
  if (!length) {
    return [];
  }
  n = guard || n === undefined ? 1 : toInteger(n);
  n = length - n;
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

module.exports = dropRight;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Ryb3BSaWdodC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxRQUFRLGNBQVIsQ0FBaEI7SUFDSSxZQUFZLFFBQVEsYUFBUixDQURoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBLFNBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixDQUExQixFQUE2QixLQUE3QixFQUFvQztBQUNsQyxNQUFJLFNBQVMsUUFBUSxNQUFNLE1BQWQsR0FBdUIsQ0FBcEM7QUFDQSxNQUFJLENBQUMsTUFBTCxFQUFhO0FBQ1gsV0FBTyxFQUFQO0FBQ0Q7QUFDRCxNQUFLLFNBQVMsTUFBTSxTQUFoQixHQUE2QixDQUE3QixHQUFpQyxVQUFVLENBQVYsQ0FBckM7QUFDQSxNQUFJLFNBQVMsQ0FBYjtBQUNBLFNBQU8sVUFBVSxLQUFWLEVBQWlCLENBQWpCLEVBQW9CLElBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFoQyxDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6ImRyb3BSaWdodC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlU2xpY2UgPSByZXF1aXJlKCcuL19iYXNlU2xpY2UnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzbGljZSBvZiBgYXJyYXlgIHdpdGggYG5gIGVsZW1lbnRzIGRyb3BwZWQgZnJvbSB0aGUgZW5kLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtudW1iZXJ9IFtuPTFdIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gZHJvcC5cbiAqIEBwYXJhbS0ge09iamVjdH0gW2d1YXJkXSBFbmFibGVzIHVzZSBhcyBhbiBpdGVyYXRlZSBmb3IgbWV0aG9kcyBsaWtlIGBfLm1hcGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHNsaWNlIG9mIGBhcnJheWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZHJvcFJpZ2h0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiBfLmRyb3BSaWdodChbMSwgMiwgM10sIDIpO1xuICogLy8gPT4gWzFdXG4gKlxuICogXy5kcm9wUmlnaHQoWzEsIDIsIDNdLCA1KTtcbiAqIC8vID0+IFtdXG4gKlxuICogXy5kcm9wUmlnaHQoWzEsIDIsIDNdLCAwKTtcbiAqIC8vID0+IFsxLCAyLCAzXVxuICovXG5mdW5jdGlvbiBkcm9wUmlnaHQoYXJyYXksIG4sIGd1YXJkKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIG4gPSAoZ3VhcmQgfHwgbiA9PT0gdW5kZWZpbmVkKSA/IDEgOiB0b0ludGVnZXIobik7XG4gIG4gPSBsZW5ndGggLSBuO1xuICByZXR1cm4gYmFzZVNsaWNlKGFycmF5LCAwLCBuIDwgMCA/IDAgOiBuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkcm9wUmlnaHQ7XG4iXX0=