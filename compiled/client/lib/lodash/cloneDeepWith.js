'use strict';

var baseClone = require('./_baseClone');

/**
 * This method is like `_.cloneWith` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @param {Function} [customizer] The function to customize cloning.
 * @returns {*} Returns the deep cloned value.
 * @see _.cloneWith
 * @example
 *
 * function customizer(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(true);
 *   }
 * }
 *
 * var el = _.cloneDeepWith(document.body, customizer);
 *
 * console.log(el === document.body);
 * // => false
 * console.log(el.nodeName);
 * // => 'BODY'
 * console.log(el.childNodes.length);
 * // => 20
 */
function cloneDeepWith(value, customizer) {
  return baseClone(value, true, true, customizer);
}

module.exports = cloneDeepWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Nsb25lRGVlcFdpdGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxjQUFSLENBQVo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThCSixTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEIsVUFBOUIsRUFBMEM7QUFDeEMsU0FBTyxVQUFVLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsSUFBdkIsRUFBNkIsVUFBN0IsQ0FBUCxDQUR3QztDQUExQzs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsYUFBakIiLCJmaWxlIjoiY2xvbmVEZWVwV2l0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlQ2xvbmUgPSByZXF1aXJlKCcuL19iYXNlQ2xvbmUnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmNsb25lV2l0aGAgZXhjZXB0IHRoYXQgaXQgcmVjdXJzaXZlbHkgY2xvbmVzIGB2YWx1ZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJlY3Vyc2l2ZWx5IGNsb25lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBkZWVwIGNsb25lZCB2YWx1ZS5cbiAqIEBzZWUgXy5jbG9uZVdpdGhcbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gY3VzdG9taXplcih2YWx1ZSkge1xuICogICBpZiAoXy5pc0VsZW1lbnQodmFsdWUpKSB7XG4gKiAgICAgcmV0dXJuIHZhbHVlLmNsb25lTm9kZSh0cnVlKTtcbiAqICAgfVxuICogfVxuICpcbiAqIHZhciBlbCA9IF8uY2xvbmVEZWVwV2l0aChkb2N1bWVudC5ib2R5LCBjdXN0b21pemVyKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhlbCA9PT0gZG9jdW1lbnQuYm9keSk7XG4gKiAvLyA9PiBmYWxzZVxuICogY29uc29sZS5sb2coZWwubm9kZU5hbWUpO1xuICogLy8gPT4gJ0JPRFknXG4gKiBjb25zb2xlLmxvZyhlbC5jaGlsZE5vZGVzLmxlbmd0aCk7XG4gKiAvLyA9PiAyMFxuICovXG5mdW5jdGlvbiBjbG9uZURlZXBXaXRoKHZhbHVlLCBjdXN0b21pemVyKSB7XG4gIHJldHVybiBiYXNlQ2xvbmUodmFsdWUsIHRydWUsIHRydWUsIGN1c3RvbWl6ZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lRGVlcFdpdGg7XG4iXX0=