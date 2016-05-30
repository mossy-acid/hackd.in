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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RvTGVuZ3RoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFoQjtJQUNJLFlBQVksUUFBUSxhQUFSLENBRGhCOzs7QUFJQSxJQUFJLG1CQUFtQixVQUF2Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2QkEsU0FBUyxRQUFULENBQWtCLEtBQWxCLEVBQXlCO0FBQ3ZCLFNBQU8sUUFBUSxVQUFVLFVBQVUsS0FBVixDQUFWLEVBQTRCLENBQTVCLEVBQStCLGdCQUEvQixDQUFSLEdBQTJELENBQWxFO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6InRvTGVuZ3RoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VDbGFtcCA9IHJlcXVpcmUoJy4vX2Jhc2VDbGFtcCcpLFxuICAgIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHRoZSBtYXhpbXVtIGxlbmd0aCBhbmQgaW5kZXggb2YgYW4gYXJyYXkuICovXG52YXIgTUFYX0FSUkFZX0xFTkdUSCA9IDQyOTQ5NjcyOTU7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBpbnRlZ2VyIHN1aXRhYmxlIGZvciB1c2UgYXMgdGhlIGxlbmd0aCBvZiBhblxuICogYXJyYXktbGlrZSBvYmplY3QuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY29udmVydGVkIGludGVnZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9MZW5ndGgoMy4yKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLnRvTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gMFxuICpcbiAqIF8udG9MZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gNDI5NDk2NzI5NVxuICpcbiAqIF8udG9MZW5ndGgoJzMuMicpO1xuICogLy8gPT4gM1xuICovXG5mdW5jdGlvbiB0b0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPyBiYXNlQ2xhbXAodG9JbnRlZ2VyKHZhbHVlKSwgMCwgTUFYX0FSUkFZX0xFTkdUSCkgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTGVuZ3RoO1xuIl19