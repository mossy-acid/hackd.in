'use strict';

var baseClone = require('./_baseClone');

/**
 * This method is like `_.clone` except that it accepts `customizer` which
 * is invoked to produce the cloned value. If `customizer` returns `undefined`,
 * cloning is handled by the method instead. The `customizer` is invoked with
 * up to four arguments; (value [, index|key, object, stack]).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to clone.
 * @param {Function} [customizer] The function to customize cloning.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeepWith
 * @example
 *
 * function customizer(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(false);
 *   }
 * }
 *
 * var el = _.cloneWith(document.body, customizer);
 *
 * console.log(el === document.body);
 * // => false
 * console.log(el.nodeName);
 * // => 'BODY'
 * console.log(el.childNodes.length);
 * // => 0
 */
function cloneWith(value, customizer) {
  return baseClone(value, false, true, customizer);
}

module.exports = cloneWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Nsb25lV2l0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxRQUFRLGNBQVIsQ0FBWjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUNKLFNBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixVQUExQixFQUFzQztBQUNwQyxTQUFPLFVBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QixJQUF4QixFQUE4QixVQUE5QixDQUFQLENBRG9DO0NBQXRDOztBQUlBLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJjbG9uZVdpdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUNsb25lID0gcmVxdWlyZSgnLi9fYmFzZUNsb25lJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5jbG9uZWAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgY3VzdG9taXplcmAgd2hpY2hcbiAqIGlzIGludm9rZWQgdG8gcHJvZHVjZSB0aGUgY2xvbmVkIHZhbHVlLiBJZiBgY3VzdG9taXplcmAgcmV0dXJucyBgdW5kZWZpbmVkYCxcbiAqIGNsb25pbmcgaXMgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBgY3VzdG9taXplcmAgaXMgaW52b2tlZCB3aXRoXG4gKiB1cCB0byBmb3VyIGFyZ3VtZW50czsgKHZhbHVlIFssIGluZGV4fGtleSwgb2JqZWN0LCBzdGFja10pLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNsb25pbmcuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICogQHNlZSBfLmNsb25lRGVlcFdpdGhcbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gY3VzdG9taXplcih2YWx1ZSkge1xuICogICBpZiAoXy5pc0VsZW1lbnQodmFsdWUpKSB7XG4gKiAgICAgcmV0dXJuIHZhbHVlLmNsb25lTm9kZShmYWxzZSk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiB2YXIgZWwgPSBfLmNsb25lV2l0aChkb2N1bWVudC5ib2R5LCBjdXN0b21pemVyKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhlbCA9PT0gZG9jdW1lbnQuYm9keSk7XG4gKiAvLyA9PiBmYWxzZVxuICogY29uc29sZS5sb2coZWwubm9kZU5hbWUpO1xuICogLy8gPT4gJ0JPRFknXG4gKiBjb25zb2xlLmxvZyhlbC5jaGlsZE5vZGVzLmxlbmd0aCk7XG4gKiAvLyA9PiAwXG4gKi9cbmZ1bmN0aW9uIGNsb25lV2l0aCh2YWx1ZSwgY3VzdG9taXplcikge1xuICByZXR1cm4gYmFzZUNsb25lKHZhbHVlLCBmYWxzZSwgdHJ1ZSwgY3VzdG9taXplcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVXaXRoO1xuIl19