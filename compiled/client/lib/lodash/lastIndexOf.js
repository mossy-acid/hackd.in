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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2xhc3RJbmRleE9mLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxhQUFhLFFBQVEsZUFBUixDQUFqQjtJQUNJLFlBQVksUUFBUSxhQUFSLENBRGhCOzs7QUFJQSxJQUFJLFlBQVksS0FBSyxHQUFyQjtJQUNJLFlBQVksS0FBSyxHQURyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QkEsU0FBUyxXQUFULENBQXFCLEtBQXJCLEVBQTRCLEtBQTVCLEVBQW1DLFNBQW5DLEVBQThDO0FBQzVDLE1BQUksU0FBUyxRQUFRLE1BQU0sTUFBZCxHQUF1QixDQUFwQztBQUNBLE1BQUksQ0FBQyxNQUFMLEVBQWE7QUFDWCxXQUFPLENBQUMsQ0FBUjtBQUNEO0FBQ0QsTUFBSSxRQUFRLE1BQVo7QUFDQSxNQUFJLGNBQWMsU0FBbEIsRUFBNkI7QUFDM0IsWUFBUSxVQUFVLFNBQVYsQ0FBUjtBQUNBLFlBQVEsQ0FDTixRQUFRLENBQVIsR0FDSSxVQUFVLFNBQVMsS0FBbkIsRUFBMEIsQ0FBMUIsQ0FESixHQUVJLFVBQVUsS0FBVixFQUFpQixTQUFTLENBQTFCLENBSEUsSUFJSixDQUpKO0FBS0Q7QUFDRCxNQUFJLFVBQVUsS0FBZCxFQUFxQjtBQUNuQixXQUFPLFdBQVcsS0FBWCxFQUFrQixRQUFRLENBQTFCLEVBQTZCLElBQTdCLENBQVA7QUFDRDtBQUNELFNBQU8sT0FBUCxFQUFnQjtBQUNkLFFBQUksTUFBTSxLQUFOLE1BQWlCLEtBQXJCLEVBQTRCO0FBQzFCLGFBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLENBQUMsQ0FBUjtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixXQUFqQiIsImZpbGUiOiJsYXN0SW5kZXhPZi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpbmRleE9mTmFOID0gcmVxdWlyZSgnLi9faW5kZXhPZk5hTicpLFxuICAgIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmluZGV4T2ZgIGV4Y2VwdCB0aGF0IGl0IGl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2ZcbiAqIGBhcnJheWAgZnJvbSByaWdodCB0byBsZWZ0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gW2Zyb21JbmRleD1hcnJheS5sZW5ndGgtMV0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5sYXN0SW5kZXhPZihbMSwgMiwgMSwgMl0sIDIpO1xuICogLy8gPT4gM1xuICpcbiAqIC8vIFNlYXJjaCBmcm9tIHRoZSBgZnJvbUluZGV4YC5cbiAqIF8ubGFzdEluZGV4T2YoWzEsIDIsIDEsIDJdLCAyLCAyKTtcbiAqIC8vID0+IDFcbiAqL1xuZnVuY3Rpb24gbGFzdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgdmFyIGluZGV4ID0gbGVuZ3RoO1xuICBpZiAoZnJvbUluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICBpbmRleCA9IHRvSW50ZWdlcihmcm9tSW5kZXgpO1xuICAgIGluZGV4ID0gKFxuICAgICAgaW5kZXggPCAwXG4gICAgICAgID8gbmF0aXZlTWF4KGxlbmd0aCArIGluZGV4LCAwKVxuICAgICAgICA6IG5hdGl2ZU1pbihpbmRleCwgbGVuZ3RoIC0gMSlcbiAgICApICsgMTtcbiAgfVxuICBpZiAodmFsdWUgIT09IHZhbHVlKSB7XG4gICAgcmV0dXJuIGluZGV4T2ZOYU4oYXJyYXksIGluZGV4IC0gMSwgdHJ1ZSk7XG4gIH1cbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGFzdEluZGV4T2Y7XG4iXX0=