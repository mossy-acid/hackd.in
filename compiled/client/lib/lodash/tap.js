"use strict";

/**
 * This method invokes `interceptor` and returns `value`. The interceptor
 * is invoked with one argument; (value). The purpose of this method is to
 * "tap into" a method chain sequence in order to modify intermediate results.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Seq
 * @param {*} value The value to provide to `interceptor`.
 * @param {Function} interceptor The function to invoke.
 * @returns {*} Returns `value`.
 * @example
 *
 * _([1, 2, 3])
 *  .tap(function(array) {
 *    // Mutate input array.
 *    array.pop();
 *  })
 *  .reverse()
 *  .value();
 * // => [2, 1]
 */
function tap(value, interceptor) {
  interceptor(value);
  return value;
}

module.exports = tap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RhcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJBLFNBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0IsV0FBcEIsRUFBaUM7QUFDL0IsY0FBWSxLQUFaLEVBRCtCO0FBRS9CLFNBQU8sS0FBUCxDQUYrQjtDQUFqQzs7QUFLQSxPQUFPLE9BQVAsR0FBaUIsR0FBakIiLCJmaWxlIjoidGFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGlzIG1ldGhvZCBpbnZva2VzIGBpbnRlcmNlcHRvcmAgYW5kIHJldHVybnMgYHZhbHVlYC4gVGhlIGludGVyY2VwdG9yXG4gKiBpcyBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OyAodmFsdWUpLiBUaGUgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0b1xuICogXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluIHNlcXVlbmNlIGluIG9yZGVyIHRvIG1vZGlmeSBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgU2VxXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm92aWRlIHRvIGBpbnRlcmNlcHRvcmAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpbnRlcmNlcHRvciBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXyhbMSwgMiwgM10pXG4gKiAgLnRhcChmdW5jdGlvbihhcnJheSkge1xuICogICAgLy8gTXV0YXRlIGlucHV0IGFycmF5LlxuICogICAgYXJyYXkucG9wKCk7XG4gKiAgfSlcbiAqICAucmV2ZXJzZSgpXG4gKiAgLnZhbHVlKCk7XG4gKiAvLyA9PiBbMiwgMV1cbiAqL1xuZnVuY3Rpb24gdGFwKHZhbHVlLCBpbnRlcmNlcHRvcikge1xuICBpbnRlcmNlcHRvcih2YWx1ZSk7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0YXA7XG4iXX0=