'use strict';

var baseNth = require('./_baseNth'),
    toInteger = require('./toInteger');

/**
 * Gets the element at index `n` of `array`. If `n` is negative, the nth
 * element from the end is returned.
 *
 * @static
 * @memberOf _
 * @since 4.11.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=0] The index of the element to return.
 * @returns {*} Returns the nth element of `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'd'];
 *
 * _.nth(array, 1);
 * // => 'b'
 *
 * _.nth(array, -2);
 * // => 'c';
 */
function nth(array, n) {
  return array && array.length ? baseNth(array, toInteger(n)) : undefined;
}

module.exports = nth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL250aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksVUFBVSxRQUFRLFlBQVIsQ0FBVjtJQUNBLFlBQVksUUFBUSxhQUFSLENBQVo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJKLFNBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0IsQ0FBcEIsRUFBdUI7QUFDckIsU0FBTyxLQUFDLElBQVMsTUFBTSxNQUFOLEdBQWdCLFFBQVEsS0FBUixFQUFlLFVBQVUsQ0FBVixDQUFmLENBQTFCLEdBQXlELFNBQXpELENBRGM7Q0FBdkI7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLEdBQWpCIiwiZmlsZSI6Im50aC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlTnRoID0gcmVxdWlyZSgnLi9fYmFzZU50aCcpLFxuICAgIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgZWxlbWVudCBhdCBpbmRleCBgbmAgb2YgYGFycmF5YC4gSWYgYG5gIGlzIG5lZ2F0aXZlLCB0aGUgbnRoXG4gKiBlbGVtZW50IGZyb20gdGhlIGVuZCBpcyByZXR1cm5lZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTEuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge251bWJlcn0gW249MF0gVGhlIGluZGV4IG9mIHRoZSBlbGVtZW50IHRvIHJldHVybi5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBudGggZWxlbWVudCBvZiBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXkgPSBbJ2EnLCAnYicsICdjJywgJ2QnXTtcbiAqXG4gKiBfLm50aChhcnJheSwgMSk7XG4gKiAvLyA9PiAnYidcbiAqXG4gKiBfLm50aChhcnJheSwgLTIpO1xuICogLy8gPT4gJ2MnO1xuICovXG5mdW5jdGlvbiBudGgoYXJyYXksIG4pIHtcbiAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGgpID8gYmFzZU50aChhcnJheSwgdG9JbnRlZ2VyKG4pKSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBudGg7XG4iXX0=