"use strict";

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * The base implementation of `_.inRange` which doesn't coerce arguments to numbers.
 *
 * @private
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function baseInRange(number, start, end) {
  return number >= nativeMin(start, end) && number < nativeMax(start, end);
}

module.exports = baseInRange;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlSW5SYW5nZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxJQUFJLFlBQVksS0FBSyxHQUFMO0lBQ1osWUFBWSxLQUFLLEdBQUw7Ozs7Ozs7Ozs7O0FBV2hCLFNBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixLQUE3QixFQUFvQyxHQUFwQyxFQUF5QztBQUN2QyxTQUFPLFVBQVUsVUFBVSxLQUFWLEVBQWlCLEdBQWpCLENBQVYsSUFBbUMsU0FBUyxVQUFVLEtBQVYsRUFBaUIsR0FBakIsQ0FBVCxDQURIO0NBQXpDOztBQUlBLE9BQU8sT0FBUCxHQUFpQixXQUFqQiIsImZpbGUiOiJfYmFzZUluUmFuZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaW5SYW5nZWAgd2hpY2ggZG9lc24ndCBjb2VyY2UgYXJndW1lbnRzIHRvIG51bWJlcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgVGhlIG51bWJlciB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBUaGUgc3RhcnQgb2YgdGhlIHJhbmdlLlxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgZW5kIG9mIHRoZSByYW5nZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgbnVtYmVyYCBpcyBpbiB0aGUgcmFuZ2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUluUmFuZ2UobnVtYmVyLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBudW1iZXIgPj0gbmF0aXZlTWluKHN0YXJ0LCBlbmQpICYmIG51bWJlciA8IG5hdGl2ZU1heChzdGFydCwgZW5kKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSW5SYW5nZTtcbiJdfQ==