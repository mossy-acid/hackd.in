'use strict';

var baseSortedIndexBy = require('./_baseSortedIndexBy'),
    identity = require('./identity'),
    isSymbol = require('./isSymbol');

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295,
    HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

/**
 * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
 * performs a binary search of `array` to determine the index at which `value`
 * should be inserted into `array` in order to maintain its sort order.
 *
 * @private
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {boolean} [retHighest] Specify returning the highest qualified index.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 */
function baseSortedIndex(array, value, retHighest) {
  var low = 0,
      high = array ? array.length : low;

  if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
    while (low < high) {
      var mid = low + high >>> 1,
          computed = array[mid];

      if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return high;
  }
  return baseSortedIndexBy(array, value, identity, retHighest);
}

module.exports = baseSortedIndex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlU29ydGVkSW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLG9CQUFvQixRQUFRLHNCQUFSLENBQXBCO0lBQ0EsV0FBVyxRQUFRLFlBQVIsQ0FBWDtJQUNBLFdBQVcsUUFBUSxZQUFSLENBQVg7OztBQUdKLElBQUksbUJBQW1CLFVBQW5CO0lBQ0Esd0JBQXdCLHFCQUFxQixDQUFyQjs7Ozs7Ozs7Ozs7Ozs7QUFjNUIsU0FBUyxlQUFULENBQXlCLEtBQXpCLEVBQWdDLEtBQWhDLEVBQXVDLFVBQXZDLEVBQW1EO0FBQ2pELE1BQUksTUFBTSxDQUFOO01BQ0EsT0FBTyxRQUFRLE1BQU0sTUFBTixHQUFlLEdBQXZCLENBRnNDOztBQUlqRCxNQUFJLE9BQU8sS0FBUCxJQUFnQixRQUFoQixJQUE0QixVQUFVLEtBQVYsSUFBbUIsUUFBUSxxQkFBUixFQUErQjtBQUNoRixXQUFPLE1BQU0sSUFBTixFQUFZO0FBQ2pCLFVBQUksTUFBTSxHQUFDLEdBQU0sSUFBTixLQUFnQixDQUFqQjtVQUNOLFdBQVcsTUFBTSxHQUFOLENBQVgsQ0FGYTs7QUFJakIsVUFBSSxhQUFhLElBQWIsSUFBcUIsQ0FBQyxTQUFTLFFBQVQsQ0FBRCxLQUNwQixhQUFjLFlBQVksS0FBWixHQUFzQixXQUFXLEtBQVgsQ0FEckMsRUFDeUQ7QUFDM0QsY0FBTSxNQUFNLENBQU4sQ0FEcUQ7T0FEN0QsTUFHTztBQUNMLGVBQU8sR0FBUCxDQURLO09BSFA7S0FKRjtBQVdBLFdBQU8sSUFBUCxDQVpnRjtHQUFsRjtBQWNBLFNBQU8sa0JBQWtCLEtBQWxCLEVBQXlCLEtBQXpCLEVBQWdDLFFBQWhDLEVBQTBDLFVBQTFDLENBQVAsQ0FsQmlEO0NBQW5EOztBQXFCQSxPQUFPLE9BQVAsR0FBaUIsZUFBakIiLCJmaWxlIjoiX2Jhc2VTb3J0ZWRJbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlU29ydGVkSW5kZXhCeSA9IHJlcXVpcmUoJy4vX2Jhc2VTb3J0ZWRJbmRleEJ5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHRoZSBtYXhpbXVtIGxlbmd0aCBhbmQgaW5kZXggb2YgYW4gYXJyYXkuICovXG52YXIgTUFYX0FSUkFZX0xFTkdUSCA9IDQyOTQ5NjcyOTUsXG4gICAgSEFMRl9NQVhfQVJSQVlfTEVOR1RIID0gTUFYX0FSUkFZX0xFTkdUSCA+Pj4gMTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zb3J0ZWRJbmRleGAgYW5kIGBfLnNvcnRlZExhc3RJbmRleGAgd2hpY2hcbiAqIHBlcmZvcm1zIGEgYmluYXJ5IHNlYXJjaCBvZiBgYXJyYXlgIHRvIGRldGVybWluZSB0aGUgaW5kZXggYXQgd2hpY2ggYHZhbHVlYFxuICogc2hvdWxkIGJlIGluc2VydGVkIGludG8gYGFycmF5YCBpbiBvcmRlciB0byBtYWludGFpbiBpdHMgc29ydCBvcmRlci5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIHNvcnRlZCBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gZXZhbHVhdGUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtyZXRIaWdoZXN0XSBTcGVjaWZ5IHJldHVybmluZyB0aGUgaGlnaGVzdCBxdWFsaWZpZWQgaW5kZXguXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBhdCB3aGljaCBgdmFsdWVgIHNob3VsZCBiZSBpbnNlcnRlZFxuICogIGludG8gYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYmFzZVNvcnRlZEluZGV4KGFycmF5LCB2YWx1ZSwgcmV0SGlnaGVzdCkge1xuICB2YXIgbG93ID0gMCxcbiAgICAgIGhpZ2ggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IGxvdztcblxuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID09PSB2YWx1ZSAmJiBoaWdoIDw9IEhBTEZfTUFYX0FSUkFZX0xFTkdUSCkge1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+PiAxLFxuICAgICAgICAgIGNvbXB1dGVkID0gYXJyYXlbbWlkXTtcblxuICAgICAgaWYgKGNvbXB1dGVkICE9PSBudWxsICYmICFpc1N5bWJvbChjb21wdXRlZCkgJiZcbiAgICAgICAgICAocmV0SGlnaGVzdCA/IChjb21wdXRlZCA8PSB2YWx1ZSkgOiAoY29tcHV0ZWQgPCB2YWx1ZSkpKSB7XG4gICAgICAgIGxvdyA9IG1pZCArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoaWdoID0gbWlkO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGlnaDtcbiAgfVxuICByZXR1cm4gYmFzZVNvcnRlZEluZGV4QnkoYXJyYXksIHZhbHVlLCBpZGVudGl0eSwgcmV0SGlnaGVzdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNvcnRlZEluZGV4O1xuIl19