'use strict';

var baseInRange = require('./_baseInRange'),
    toNumber = require('./toNumber');

/**
 * Checks if `n` is between `start` and up to, but not including, `end`. If
 * `end` is not specified, it's set to `start` with `start` then set to `0`.
 * If `start` is greater than `end` the params are swapped to support
 * negative ranges.
 *
 * @static
 * @memberOf _
 * @since 3.3.0
 * @category Number
 * @param {number} number The number to check.
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 * @see _.range, _.rangeRight
 * @example
 *
 * _.inRange(3, 2, 4);
 * // => true
 *
 * _.inRange(4, 8);
 * // => true
 *
 * _.inRange(4, 2);
 * // => false
 *
 * _.inRange(2, 2);
 * // => false
 *
 * _.inRange(1.2, 2);
 * // => true
 *
 * _.inRange(5.2, 4);
 * // => false
 *
 * _.inRange(-3, -2, -6);
 * // => true
 */
function inRange(number, start, end) {
  start = toNumber(start) || 0;
  if (end === undefined) {
    end = start;
    start = 0;
  } else {
    end = toNumber(end) || 0;
  }
  number = toNumber(number);
  return baseInRange(number, start, end);
}

module.exports = inRange;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2luUmFuZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFkO0lBQ0EsV0FBVyxRQUFRLFlBQVIsQ0FBWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdDSixTQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUIsS0FBekIsRUFBZ0MsR0FBaEMsRUFBcUM7QUFDbkMsVUFBUSxTQUFTLEtBQVQsS0FBbUIsQ0FBbkIsQ0FEMkI7QUFFbkMsTUFBSSxRQUFRLFNBQVIsRUFBbUI7QUFDckIsVUFBTSxLQUFOLENBRHFCO0FBRXJCLFlBQVEsQ0FBUixDQUZxQjtHQUF2QixNQUdPO0FBQ0wsVUFBTSxTQUFTLEdBQVQsS0FBaUIsQ0FBakIsQ0FERDtHQUhQO0FBTUEsV0FBUyxTQUFTLE1BQVQsQ0FBVCxDQVJtQztBQVNuQyxTQUFPLFlBQVksTUFBWixFQUFvQixLQUFwQixFQUEyQixHQUEzQixDQUFQLENBVG1DO0NBQXJDOztBQVlBLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJpblJhbmdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VJblJhbmdlID0gcmVxdWlyZSgnLi9fYmFzZUluUmFuZ2UnKSxcbiAgICB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYG5gIGlzIGJldHdlZW4gYHN0YXJ0YCBhbmQgdXAgdG8sIGJ1dCBub3QgaW5jbHVkaW5nLCBgZW5kYC4gSWZcbiAqIGBlbmRgIGlzIG5vdCBzcGVjaWZpZWQsIGl0J3Mgc2V0IHRvIGBzdGFydGAgd2l0aCBgc3RhcnRgIHRoZW4gc2V0IHRvIGAwYC5cbiAqIElmIGBzdGFydGAgaXMgZ3JlYXRlciB0aGFuIGBlbmRgIHRoZSBwYXJhbXMgYXJlIHN3YXBwZWQgdG8gc3VwcG9ydFxuICogbmVnYXRpdmUgcmFuZ2VzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4zLjBcbiAqIEBjYXRlZ29yeSBOdW1iZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgVGhlIG51bWJlciB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhlIGVuZCBvZiB0aGUgcmFuZ2UuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYG51bWJlcmAgaXMgaW4gdGhlIHJhbmdlLCBlbHNlIGBmYWxzZWAuXG4gKiBAc2VlIF8ucmFuZ2UsIF8ucmFuZ2VSaWdodFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmluUmFuZ2UoMywgMiwgNCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pblJhbmdlKDQsIDgpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaW5SYW5nZSg0LCAyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pblJhbmdlKDIsIDIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmluUmFuZ2UoMS4yLCAyKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmluUmFuZ2UoNS4yLCA0KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pblJhbmdlKC0zLCAtMiwgLTYpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpblJhbmdlKG51bWJlciwgc3RhcnQsIGVuZCkge1xuICBzdGFydCA9IHRvTnVtYmVyKHN0YXJ0KSB8fCAwO1xuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSBzdGFydDtcbiAgICBzdGFydCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgZW5kID0gdG9OdW1iZXIoZW5kKSB8fCAwO1xuICB9XG4gIG51bWJlciA9IHRvTnVtYmVyKG51bWJlcik7XG4gIHJldHVybiBiYXNlSW5SYW5nZShudW1iZXIsIHN0YXJ0LCBlbmQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluUmFuZ2U7XG4iXX0=