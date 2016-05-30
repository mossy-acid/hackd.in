"use strict";

/**
 * This method is like `_.tap` except that it returns the result of `interceptor`.
 * The purpose of this method is to "pass thru" values replacing intermediate
 * results in a method chain sequence.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Seq
 * @param {*} value The value to provide to `interceptor`.
 * @param {Function} interceptor The function to invoke.
 * @returns {*} Returns the result of `interceptor`.
 * @example
 *
 * _('  abc  ')
 *  .chain()
 *  .trim()
 *  .thru(function(value) {
 *    return [value];
 *  })
 *  .value();
 * // => ['abc']
 */
function thru(value, interceptor) {
  return interceptor(value);
}

module.exports = thru;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RocnUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCQSxTQUFTLElBQVQsQ0FBYyxLQUFkLEVBQXFCLFdBQXJCLEVBQWtDO0FBQ2hDLFNBQU8sWUFBWSxLQUFaLENBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsSUFBakIiLCJmaWxlIjoidGhydS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy50YXBgIGV4Y2VwdCB0aGF0IGl0IHJldHVybnMgdGhlIHJlc3VsdCBvZiBgaW50ZXJjZXB0b3JgLlxuICogVGhlIHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJwYXNzIHRocnVcIiB2YWx1ZXMgcmVwbGFjaW5nIGludGVybWVkaWF0ZVxuICogcmVzdWx0cyBpbiBhIG1ldGhvZCBjaGFpbiBzZXF1ZW5jZS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgU2VxXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm92aWRlIHRvIGBpbnRlcmNlcHRvcmAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpbnRlcmNlcHRvciBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgaW50ZXJjZXB0b3JgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfKCcgIGFiYyAgJylcbiAqICAuY2hhaW4oKVxuICogIC50cmltKClcbiAqICAudGhydShmdW5jdGlvbih2YWx1ZSkge1xuICogICAgcmV0dXJuIFt2YWx1ZV07XG4gKiAgfSlcbiAqICAudmFsdWUoKTtcbiAqIC8vID0+IFsnYWJjJ11cbiAqL1xuZnVuY3Rpb24gdGhydSh2YWx1ZSwgaW50ZXJjZXB0b3IpIHtcbiAgcmV0dXJuIGludGVyY2VwdG9yKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0aHJ1O1xuIl19