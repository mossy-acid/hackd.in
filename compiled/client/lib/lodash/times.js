'use strict';

var baseIteratee = require('./_baseIteratee'),
    baseTimes = require('./_baseTimes'),
    toInteger = require('./toInteger');

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Invokes the iteratee `n` times, returning an array of the results of
 * each invocation. The iteratee is invoked with one argument; (index).
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 * @example
 *
 * _.times(3, String);
 * // => ['0', '1', '2']
 *
 *  _.times(4, _.constant(0));
 * // => [0, 0, 0, 0]
 */
function times(n, iteratee) {
  n = toInteger(n);
  if (n < 1 || n > MAX_SAFE_INTEGER) {
    return [];
  }
  var index = MAX_ARRAY_LENGTH,
      length = nativeMin(n, MAX_ARRAY_LENGTH);

  iteratee = baseIteratee(iteratee);
  n -= MAX_ARRAY_LENGTH;

  var result = baseTimes(length, iteratee);
  while (++index < n) {
    iteratee(index);
  }
  return result;
}

module.exports = times;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RpbWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxlQUFlLFFBQVEsaUJBQVIsQ0FBZjtJQUNBLFlBQVksUUFBUSxjQUFSLENBQVo7SUFDQSxZQUFZLFFBQVEsYUFBUixDQUFaOzs7QUFHSixJQUFJLG1CQUFtQixnQkFBbkI7OztBQUdKLElBQUksbUJBQW1CLFVBQW5COzs7QUFHSixJQUFJLFlBQVksS0FBSyxHQUFMOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQmhCLFNBQVMsS0FBVCxDQUFlLENBQWYsRUFBa0IsUUFBbEIsRUFBNEI7QUFDMUIsTUFBSSxVQUFVLENBQVYsQ0FBSixDQUQwQjtBQUUxQixNQUFJLElBQUksQ0FBSixJQUFTLElBQUksZ0JBQUosRUFBc0I7QUFDakMsV0FBTyxFQUFQLENBRGlDO0dBQW5DO0FBR0EsTUFBSSxRQUFRLGdCQUFSO01BQ0EsU0FBUyxVQUFVLENBQVYsRUFBYSxnQkFBYixDQUFULENBTnNCOztBQVExQixhQUFXLGFBQWEsUUFBYixDQUFYLENBUjBCO0FBUzFCLE9BQUssZ0JBQUwsQ0FUMEI7O0FBVzFCLE1BQUksU0FBUyxVQUFVLE1BQVYsRUFBa0IsUUFBbEIsQ0FBVCxDQVhzQjtBQVkxQixTQUFPLEVBQUUsS0FBRixHQUFVLENBQVYsRUFBYTtBQUNsQixhQUFTLEtBQVQsRUFEa0I7R0FBcEI7QUFHQSxTQUFPLE1BQVAsQ0FmMEI7Q0FBNUI7O0FBa0JBLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJ0aW1lcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdGhlIG1heGltdW0gbGVuZ3RoIGFuZCBpbmRleCBvZiBhbiBhcnJheS4gKi9cbnZhciBNQVhfQVJSQVlfTEVOR1RIID0gNDI5NDk2NzI5NTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIEludm9rZXMgdGhlIGl0ZXJhdGVlIGBuYCB0aW1lcywgcmV0dXJuaW5nIGFuIGFycmF5IG9mIHRoZSByZXN1bHRzIG9mXG4gKiBlYWNoIGludm9jYXRpb24uIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OyAoaW5kZXgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMywgU3RyaW5nKTtcbiAqIC8vID0+IFsnMCcsICcxJywgJzInXVxuICpcbiAqICBfLnRpbWVzKDQsIF8uY29uc3RhbnQoMCkpO1xuICogLy8gPT4gWzAsIDAsIDAsIDBdXG4gKi9cbmZ1bmN0aW9uIHRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIG4gPSB0b0ludGVnZXIobik7XG4gIGlmIChuIDwgMSB8fCBuID4gTUFYX1NBRkVfSU5URUdFUikge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICB2YXIgaW5kZXggPSBNQVhfQVJSQVlfTEVOR1RILFxuICAgICAgbGVuZ3RoID0gbmF0aXZlTWluKG4sIE1BWF9BUlJBWV9MRU5HVEgpO1xuXG4gIGl0ZXJhdGVlID0gYmFzZUl0ZXJhdGVlKGl0ZXJhdGVlKTtcbiAgbiAtPSBNQVhfQVJSQVlfTEVOR1RIO1xuXG4gIHZhciByZXN1bHQgPSBiYXNlVGltZXMobGVuZ3RoLCBpdGVyYXRlZSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRpbWVzO1xuIl19