'use strict';

var baseClamp = require('./_baseClamp'),
    toInteger = require('./toInteger');

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Converts `value` to a safe integer. A safe integer can be compared and
 * represented correctly.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toSafeInteger(3.2);
 * // => 3
 *
 * _.toSafeInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toSafeInteger(Infinity);
 * // => 9007199254740991
 *
 * _.toSafeInteger('3.2');
 * // => 3
 */
function toSafeInteger(value) {
  return baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
}

module.exports = toSafeInteger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RvU2FmZUludGVnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxjQUFSLENBQWhCO0lBQ0ksWUFBWSxRQUFRLGFBQVIsQ0FEaEI7OztBQUlBLElBQUksbUJBQW1CLGdCQUF2Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsU0FBUyxhQUFULENBQXVCLEtBQXZCLEVBQThCO0FBQzVCLFNBQU8sVUFBVSxVQUFVLEtBQVYsQ0FBVixFQUE0QixDQUFDLGdCQUE3QixFQUErQyxnQkFBL0MsQ0FBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixhQUFqQiIsImZpbGUiOiJ0b1NhZmVJbnRlZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VDbGFtcCA9IHJlcXVpcmUoJy4vX2Jhc2VDbGFtcCcpLFxuICAgIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzYWZlIGludGVnZXIuIEEgc2FmZSBpbnRlZ2VyIGNhbiBiZSBjb21wYXJlZCBhbmRcbiAqIHJlcHJlc2VudGVkIGNvcnJlY3RseS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvU2FmZUludGVnZXIoMy4yKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLnRvU2FmZUludGVnZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiAwXG4gKlxuICogXy50b1NhZmVJbnRlZ2VyKEluZmluaXR5KTtcbiAqIC8vID0+IDkwMDcxOTkyNTQ3NDA5OTFcbiAqXG4gKiBfLnRvU2FmZUludGVnZXIoJzMuMicpO1xuICogLy8gPT4gM1xuICovXG5mdW5jdGlvbiB0b1NhZmVJbnRlZ2VyKHZhbHVlKSB7XG4gIHJldHVybiBiYXNlQ2xhbXAodG9JbnRlZ2VyKHZhbHVlKSwgLU1BWF9TQUZFX0lOVEVHRVIsIE1BWF9TQUZFX0lOVEVHRVIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU2FmZUludGVnZXI7XG4iXX0=