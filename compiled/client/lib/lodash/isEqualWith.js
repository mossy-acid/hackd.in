'use strict';

var baseIsEqual = require('./_baseIsEqual');

/**
 * This method is like `_.isEqual` except that it accepts `customizer` which
 * is invoked to compare values. If `customizer` returns `undefined`, comparisons
 * are handled by the method instead. The `customizer` is invoked with up to
 * six arguments: (objValue, othValue [, index|key, object, other, stack]).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if the values are equivalent,
 *  else `false`.
 * @example
 *
 * function isGreeting(value) {
 *   return /^h(?:i|ello)$/.test(value);
 * }
 *
 * function customizer(objValue, othValue) {
 *   if (isGreeting(objValue) && isGreeting(othValue)) {
 *     return true;
 *   }
 * }
 *
 * var array = ['hello', 'goodbye'];
 * var other = ['hi', 'goodbye'];
 *
 * _.isEqualWith(array, other, customizer);
 * // => true
 */
function isEqualWith(value, other, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  var result = customizer ? customizer(value, other) : undefined;
  return result === undefined ? baseIsEqual(value, other, customizer) : !!result;
}

module.exports = isEqualWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzRXF1YWxXaXRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQ0osU0FBUyxXQUFULENBQXFCLEtBQXJCLEVBQTRCLEtBQTVCLEVBQW1DLFVBQW5DLEVBQStDO0FBQzdDLGVBQWEsT0FBTyxVQUFQLElBQXFCLFVBQXJCLEdBQWtDLFVBQWxDLEdBQStDLFNBQS9DLENBRGdDO0FBRTdDLE1BQUksU0FBUyxhQUFhLFdBQVcsS0FBWCxFQUFrQixLQUFsQixDQUFiLEdBQXdDLFNBQXhDLENBRmdDO0FBRzdDLFNBQU8sV0FBVyxTQUFYLEdBQXVCLFlBQVksS0FBWixFQUFtQixLQUFuQixFQUEwQixVQUExQixDQUF2QixHQUErRCxDQUFDLENBQUMsTUFBRCxDQUgxQjtDQUEvQzs7QUFNQSxPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoiaXNFcXVhbFdpdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUlzRXF1YWwgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbCcpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uaXNFcXVhbGAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgY3VzdG9taXplcmAgd2hpY2hcbiAqIGlzIGludm9rZWQgdG8gY29tcGFyZSB2YWx1ZXMuIElmIGBjdXN0b21pemVyYCByZXR1cm5zIGB1bmRlZmluZWRgLCBjb21wYXJpc29uc1xuICogYXJlIGhhbmRsZWQgYnkgdGhlIG1ldGhvZCBpbnN0ZWFkLiBUaGUgYGN1c3RvbWl6ZXJgIGlzIGludm9rZWQgd2l0aCB1cCB0b1xuICogc2l4IGFyZ3VtZW50czogKG9ialZhbHVlLCBvdGhWYWx1ZSBbLCBpbmRleHxrZXksIG9iamVjdCwgb3RoZXIsIHN0YWNrXSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIGlzR3JlZXRpbmcodmFsdWUpIHtcbiAqICAgcmV0dXJuIC9eaCg/Oml8ZWxsbykkLy50ZXN0KHZhbHVlKTtcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBjdXN0b21pemVyKG9ialZhbHVlLCBvdGhWYWx1ZSkge1xuICogICBpZiAoaXNHcmVldGluZyhvYmpWYWx1ZSkgJiYgaXNHcmVldGluZyhvdGhWYWx1ZSkpIHtcbiAqICAgICByZXR1cm4gdHJ1ZTtcbiAqICAgfVxuICogfVxuICpcbiAqIHZhciBhcnJheSA9IFsnaGVsbG8nLCAnZ29vZGJ5ZSddO1xuICogdmFyIG90aGVyID0gWydoaScsICdnb29kYnllJ107XG4gKlxuICogXy5pc0VxdWFsV2l0aChhcnJheSwgb3RoZXIsIGN1c3RvbWl6ZXIpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpc0VxdWFsV2l0aCh2YWx1ZSwgb3RoZXIsIGN1c3RvbWl6ZXIpIHtcbiAgY3VzdG9taXplciA9IHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbicgPyBjdXN0b21pemVyIDogdW5kZWZpbmVkO1xuICB2YXIgcmVzdWx0ID0gY3VzdG9taXplciA/IGN1c3RvbWl6ZXIodmFsdWUsIG90aGVyKSA6IHVuZGVmaW5lZDtcbiAgcmV0dXJuIHJlc3VsdCA9PT0gdW5kZWZpbmVkID8gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyLCBjdXN0b21pemVyKSA6ICEhcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRXF1YWxXaXRoO1xuIl19