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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzRXF1YWxXaXRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUNBLFNBQVMsV0FBVCxDQUFxQixLQUFyQixFQUE0QixLQUE1QixFQUFtQyxVQUFuQyxFQUErQztBQUM3QyxlQUFhLE9BQU8sVUFBUCxJQUFxQixVQUFyQixHQUFrQyxVQUFsQyxHQUErQyxTQUE1RDtBQUNBLE1BQUksU0FBUyxhQUFhLFdBQVcsS0FBWCxFQUFrQixLQUFsQixDQUFiLEdBQXdDLFNBQXJEO0FBQ0EsU0FBTyxXQUFXLFNBQVgsR0FBdUIsWUFBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLFVBQTFCLENBQXZCLEdBQStELENBQUMsQ0FBQyxNQUF4RTtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixXQUFqQiIsImZpbGUiOiJpc0VxdWFsV2l0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlSXNFcXVhbCA9IHJlcXVpcmUoJy4vX2Jhc2VJc0VxdWFsJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pc0VxdWFsYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGBjdXN0b21pemVyYCB3aGljaFxuICogaXMgaW52b2tlZCB0byBjb21wYXJlIHZhbHVlcy4gSWYgYGN1c3RvbWl6ZXJgIHJldHVybnMgYHVuZGVmaW5lZGAsIGNvbXBhcmlzb25zXG4gKiBhcmUgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBgY3VzdG9taXplcmAgaXMgaW52b2tlZCB3aXRoIHVwIHRvXG4gKiBzaXggYXJndW1lbnRzOiAob2JqVmFsdWUsIG90aFZhbHVlIFssIGluZGV4fGtleSwgb2JqZWN0LCBvdGhlciwgc3RhY2tdKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gaXNHcmVldGluZyh2YWx1ZSkge1xuICogICByZXR1cm4gL15oKD86aXxlbGxvKSQvLnRlc3QodmFsdWUpO1xuICogfVxuICpcbiAqIGZ1bmN0aW9uIGN1c3RvbWl6ZXIob2JqVmFsdWUsIG90aFZhbHVlKSB7XG4gKiAgIGlmIChpc0dyZWV0aW5nKG9ialZhbHVlKSAmJiBpc0dyZWV0aW5nKG90aFZhbHVlKSkge1xuICogICAgIHJldHVybiB0cnVlO1xuICogICB9XG4gKiB9XG4gKlxuICogdmFyIGFycmF5ID0gWydoZWxsbycsICdnb29kYnllJ107XG4gKiB2YXIgb3RoZXIgPSBbJ2hpJywgJ2dvb2RieWUnXTtcbiAqXG4gKiBfLmlzRXF1YWxXaXRoKGFycmF5LCBvdGhlciwgY3VzdG9taXplcik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlzRXF1YWxXaXRoKHZhbHVlLCBvdGhlciwgY3VzdG9taXplcikge1xuICBjdXN0b21pemVyID0gdHlwZW9mIGN1c3RvbWl6ZXIgPT0gJ2Z1bmN0aW9uJyA/IGN1c3RvbWl6ZXIgOiB1bmRlZmluZWQ7XG4gIHZhciByZXN1bHQgPSBjdXN0b21pemVyID8gY3VzdG9taXplcih2YWx1ZSwgb3RoZXIpIDogdW5kZWZpbmVkO1xuICByZXR1cm4gcmVzdWx0ID09PSB1bmRlZmluZWQgPyBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIsIGN1c3RvbWl6ZXIpIDogISFyZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFcXVhbFdpdGg7XG4iXX0=