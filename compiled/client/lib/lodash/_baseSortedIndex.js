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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlU29ydGVkSW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLG9CQUFvQixRQUFRLHNCQUFSLENBQXhCO0lBQ0ksV0FBVyxRQUFRLFlBQVIsQ0FEZjtJQUVJLFdBQVcsUUFBUSxZQUFSLENBRmY7OztBQUtBLElBQUksbUJBQW1CLFVBQXZCO0lBQ0ksd0JBQXdCLHFCQUFxQixDQURqRDs7Ozs7Ozs7Ozs7Ozs7QUFlQSxTQUFTLGVBQVQsQ0FBeUIsS0FBekIsRUFBZ0MsS0FBaEMsRUFBdUMsVUFBdkMsRUFBbUQ7QUFDakQsTUFBSSxNQUFNLENBQVY7TUFDSSxPQUFPLFFBQVEsTUFBTSxNQUFkLEdBQXVCLEdBRGxDOztBQUdBLE1BQUksT0FBTyxLQUFQLElBQWdCLFFBQWhCLElBQTRCLFVBQVUsS0FBdEMsSUFBK0MsUUFBUSxxQkFBM0QsRUFBa0Y7QUFDaEYsV0FBTyxNQUFNLElBQWIsRUFBbUI7QUFDakIsVUFBSSxNQUFPLE1BQU0sSUFBUCxLQUFpQixDQUEzQjtVQUNJLFdBQVcsTUFBTSxHQUFOLENBRGY7O0FBR0EsVUFBSSxhQUFhLElBQWIsSUFBcUIsQ0FBQyxTQUFTLFFBQVQsQ0FBdEIsS0FDQyxhQUFjLFlBQVksS0FBMUIsR0FBb0MsV0FBVyxLQURoRCxDQUFKLEVBQzZEO0FBQzNELGNBQU0sTUFBTSxDQUFaO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsZUFBTyxHQUFQO0FBQ0Q7QUFDRjtBQUNELFdBQU8sSUFBUDtBQUNEO0FBQ0QsU0FBTyxrQkFBa0IsS0FBbEIsRUFBeUIsS0FBekIsRUFBZ0MsUUFBaEMsRUFBMEMsVUFBMUMsQ0FBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixlQUFqQiIsImZpbGUiOiJfYmFzZVNvcnRlZEluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VTb3J0ZWRJbmRleEJ5ID0gcmVxdWlyZSgnLi9fYmFzZVNvcnRlZEluZGV4QnknKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdGhlIG1heGltdW0gbGVuZ3RoIGFuZCBpbmRleCBvZiBhbiBhcnJheS4gKi9cbnZhciBNQVhfQVJSQVlfTEVOR1RIID0gNDI5NDk2NzI5NSxcbiAgICBIQUxGX01BWF9BUlJBWV9MRU5HVEggPSBNQVhfQVJSQVlfTEVOR1RIID4+PiAxO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnNvcnRlZEluZGV4YCBhbmQgYF8uc29ydGVkTGFzdEluZGV4YCB3aGljaFxuICogcGVyZm9ybXMgYSBiaW5hcnkgc2VhcmNoIG9mIGBhcnJheWAgdG8gZGV0ZXJtaW5lIHRoZSBpbmRleCBhdCB3aGljaCBgdmFsdWVgXG4gKiBzaG91bGQgYmUgaW5zZXJ0ZWQgaW50byBgYXJyYXlgIGluIG9yZGVyIHRvIG1haW50YWluIGl0cyBzb3J0IG9yZGVyLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgc29ydGVkIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBldmFsdWF0ZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3JldEhpZ2hlc3RdIFNwZWNpZnkgcmV0dXJuaW5nIHRoZSBoaWdoZXN0IHF1YWxpZmllZCBpbmRleC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IGF0IHdoaWNoIGB2YWx1ZWAgc2hvdWxkIGJlIGluc2VydGVkXG4gKiAgaW50byBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBiYXNlU29ydGVkSW5kZXgoYXJyYXksIHZhbHVlLCByZXRIaWdoZXN0KSB7XG4gIHZhciBsb3cgPSAwLFxuICAgICAgaGlnaCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogbG93O1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPT09IHZhbHVlICYmIGhpZ2ggPD0gSEFMRl9NQVhfQVJSQVlfTEVOR1RIKSB7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSAobG93ICsgaGlnaCkgPj4+IDEsXG4gICAgICAgICAgY29tcHV0ZWQgPSBhcnJheVttaWRdO1xuXG4gICAgICBpZiAoY29tcHV0ZWQgIT09IG51bGwgJiYgIWlzU3ltYm9sKGNvbXB1dGVkKSAmJlxuICAgICAgICAgIChyZXRIaWdoZXN0ID8gKGNvbXB1dGVkIDw9IHZhbHVlKSA6IChjb21wdXRlZCA8IHZhbHVlKSkpIHtcbiAgICAgICAgbG93ID0gbWlkICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhpZ2ggPSBtaWQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoaWdoO1xuICB9XG4gIHJldHVybiBiYXNlU29ydGVkSW5kZXhCeShhcnJheSwgdmFsdWUsIGlkZW50aXR5LCByZXRIaWdoZXN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU29ydGVkSW5kZXg7XG4iXX0=