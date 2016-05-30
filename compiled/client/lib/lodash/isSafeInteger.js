'use strict';

var isInteger = require('./isInteger');

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
 * double precision number which isn't the result of a rounded unsafe integer.
 *
 * **Note:** This method is based on
 * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a safe integer,
 *  else `false`.
 * @example
 *
 * _.isSafeInteger(3);
 * // => true
 *
 * _.isSafeInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isSafeInteger(Infinity);
 * // => false
 *
 * _.isSafeInteger('3');
 * // => false
 */
function isSafeInteger(value) {
  return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
}

module.exports = isSafeInteger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzU2FmZUludGVnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxhQUFSLENBQWhCOzs7QUFHQSxJQUFJLG1CQUFtQixnQkFBdkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThCQSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEI7QUFDNUIsU0FBTyxVQUFVLEtBQVYsS0FBb0IsU0FBUyxDQUFDLGdCQUE5QixJQUFrRCxTQUFTLGdCQUFsRTtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixhQUFqQiIsImZpbGUiOiJpc1NhZmVJbnRlZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGlzSW50ZWdlciA9IHJlcXVpcmUoJy4vaXNJbnRlZ2VyJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgc2FmZSBpbnRlZ2VyLiBBbiBpbnRlZ2VyIGlzIHNhZmUgaWYgaXQncyBhbiBJRUVFLTc1NFxuICogZG91YmxlIHByZWNpc2lvbiBudW1iZXIgd2hpY2ggaXNuJ3QgdGhlIHJlc3VsdCBvZiBhIHJvdW5kZWQgdW5zYWZlIGludGVnZXIuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGJhc2VkIG9uXG4gKiBbYE51bWJlci5pc1NhZmVJbnRlZ2VyYF0oaHR0cHM6Ly9tZG4uaW8vTnVtYmVyL2lzU2FmZUludGVnZXIpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc2FmZSBpbnRlZ2VyLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1NhZmVJbnRlZ2VyKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTYWZlSW50ZWdlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1NhZmVJbnRlZ2VyKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1NhZmVJbnRlZ2VyKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1NhZmVJbnRlZ2VyKHZhbHVlKSB7XG4gIHJldHVybiBpc0ludGVnZXIodmFsdWUpICYmIHZhbHVlID49IC1NQVhfU0FGRV9JTlRFR0VSICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTYWZlSW50ZWdlcjtcbiJdfQ==