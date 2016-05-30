'use strict';

var baseIteratee = require('./_baseIteratee'),
    createInverter = require('./_createInverter');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * This method is like `_.invert` except that the inverted object is generated
 * from the results of running each element of `object` thru `iteratee`. The
 * corresponding inverted value of each inverted key is an array of keys
 * responsible for generating the inverted value. The iteratee is invoked
 * with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.1.0
 * @category Object
 * @param {Object} object The object to invert.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The iteratee invoked per element.
 * @returns {Object} Returns the new inverted object.
 * @example
 *
 * var object = { 'a': 1, 'b': 2, 'c': 1 };
 *
 * _.invertBy(object);
 * // => { '1': ['a', 'c'], '2': ['b'] }
 *
 * _.invertBy(object, function(value) {
 *   return 'group' + value;
 * });
 * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
 */
var invertBy = createInverter(function (result, value, key) {
  if (hasOwnProperty.call(result, value)) {
    result[value].push(key);
  } else {
    result[value] = [key];
  }
}, baseIteratee);

module.exports = invertBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ludmVydEJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxlQUFlLFFBQVEsaUJBQVIsQ0FBZjtJQUNBLGlCQUFpQixRQUFRLG1CQUFSLENBQWpCOzs7QUFHSixJQUFJLGNBQWMsT0FBTyxTQUFQOzs7QUFHbEIsSUFBSSxpQkFBaUIsWUFBWSxjQUFaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZCckIsSUFBSSxXQUFXLGVBQWUsVUFBUyxNQUFULEVBQWlCLEtBQWpCLEVBQXdCLEdBQXhCLEVBQTZCO0FBQ3pELE1BQUksZUFBZSxJQUFmLENBQW9CLE1BQXBCLEVBQTRCLEtBQTVCLENBQUosRUFBd0M7QUFDdEMsV0FBTyxLQUFQLEVBQWMsSUFBZCxDQUFtQixHQUFuQixFQURzQztHQUF4QyxNQUVPO0FBQ0wsV0FBTyxLQUFQLElBQWdCLENBQUMsR0FBRCxDQUFoQixDQURLO0dBRlA7Q0FENEIsRUFNM0IsWUFOWSxDQUFYOztBQVFKLE9BQU8sT0FBUCxHQUFpQixRQUFqQiIsImZpbGUiOiJpbnZlcnRCeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBjcmVhdGVJbnZlcnRlciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUludmVydGVyJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pbnZlcnRgIGV4Y2VwdCB0aGF0IHRoZSBpbnZlcnRlZCBvYmplY3QgaXMgZ2VuZXJhdGVkXG4gKiBmcm9tIHRoZSByZXN1bHRzIG9mIHJ1bm5pbmcgZWFjaCBlbGVtZW50IG9mIGBvYmplY3RgIHRocnUgYGl0ZXJhdGVlYC4gVGhlXG4gKiBjb3JyZXNwb25kaW5nIGludmVydGVkIHZhbHVlIG9mIGVhY2ggaW52ZXJ0ZWQga2V5IGlzIGFuIGFycmF5IG9mIGtleXNcbiAqIHJlc3BvbnNpYmxlIGZvciBnZW5lcmF0aW5nIHRoZSBpbnZlcnRlZCB2YWx1ZS4gVGhlIGl0ZXJhdGVlIGlzIGludm9rZWRcbiAqIHdpdGggb25lIGFyZ3VtZW50OiAodmFsdWUpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnZlcnQuXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtpdGVyYXRlZT1fLmlkZW50aXR5XVxuICogIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IGludmVydGVkIG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIsICdjJzogMSB9O1xuICpcbiAqIF8uaW52ZXJ0Qnkob2JqZWN0KTtcbiAqIC8vID0+IHsgJzEnOiBbJ2EnLCAnYyddLCAnMic6IFsnYiddIH1cbiAqXG4gKiBfLmludmVydEJ5KG9iamVjdCwgZnVuY3Rpb24odmFsdWUpIHtcbiAqICAgcmV0dXJuICdncm91cCcgKyB2YWx1ZTtcbiAqIH0pO1xuICogLy8gPT4geyAnZ3JvdXAxJzogWydhJywgJ2MnXSwgJ2dyb3VwMic6IFsnYiddIH1cbiAqL1xudmFyIGludmVydEJ5ID0gY3JlYXRlSW52ZXJ0ZXIoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdCwgdmFsdWUpKSB7XG4gICAgcmVzdWx0W3ZhbHVlXS5wdXNoKGtleSk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0W3ZhbHVlXSA9IFtrZXldO1xuICB9XG59LCBiYXNlSXRlcmF0ZWUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmVydEJ5O1xuIl19