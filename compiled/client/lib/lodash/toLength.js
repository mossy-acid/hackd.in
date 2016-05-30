'use strict';

var baseClamp = require('./_baseClamp'),
    toInteger = require('./toInteger');

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/**
 * Converts `value` to an integer suitable for use as the length of an
 * array-like object.
 *
 * **Note:** This method is based on
 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toLength(3.2);
 * // => 3
 *
 * _.toLength(Number.MIN_VALUE);
 * // => 0
 *
 * _.toLength(Infinity);
 * // => 4294967295
 *
 * _.toLength('3.2');
 * // => 3
 */
function toLength(value) {
  return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
}

module.exports = toLength;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RvTGVuZ3RoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsWUFBWSxRQUFRLGFBQVIsQ0FBWjs7O0FBR0osSUFBSSxtQkFBbUIsVUFBbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkJKLFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUF5QjtBQUN2QixTQUFPLFFBQVEsVUFBVSxVQUFVLEtBQVYsQ0FBVixFQUE0QixDQUE1QixFQUErQixnQkFBL0IsQ0FBUixHQUEyRCxDQUEzRCxDQURnQjtDQUF6Qjs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoidG9MZW5ndGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUNsYW1wID0gcmVxdWlyZSgnLi9fYmFzZUNsYW1wJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdGhlIG1heGltdW0gbGVuZ3RoIGFuZCBpbmRleCBvZiBhbiBhcnJheS4gKi9cbnZhciBNQVhfQVJSQVlfTEVOR1RIID0gNDI5NDk2NzI5NTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGFuIGludGVnZXIgc3VpdGFibGUgZm9yIHVzZSBhcyB0aGUgbGVuZ3RoIG9mIGFuXG4gKiBhcnJheS1saWtlIG9iamVjdC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgaW50ZWdlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b0xlbmd0aCgzLjIpO1xuICogLy8gPT4gM1xuICpcbiAqIF8udG9MZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiAwXG4gKlxuICogXy50b0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiA0Mjk0OTY3Mjk1XG4gKlxuICogXy50b0xlbmd0aCgnMy4yJyk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIHRvTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA/IGJhc2VDbGFtcCh0b0ludGVnZXIodmFsdWUpLCAwLCBNQVhfQVJSQVlfTEVOR1RIKSA6IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9MZW5ndGg7XG4iXX0=