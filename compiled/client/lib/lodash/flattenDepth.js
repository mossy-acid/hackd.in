'use strict';

var baseFlatten = require('./_baseFlatten'),
    toInteger = require('./toInteger');

/**
 * Recursively flatten `array` up to `depth` times.
 *
 * @static
 * @memberOf _
 * @since 4.4.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @param {number} [depth=1] The maximum recursion depth.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * var array = [1, [2, [3, [4]], 5]];
 *
 * _.flattenDepth(array, 1);
 * // => [1, 2, [3, [4]], 5]
 *
 * _.flattenDepth(array, 2);
 * // => [1, 2, 3, [4], 5]
 */
function flattenDepth(array, depth) {
  var length = array ? array.length : 0;
  if (!length) {
    return [];
  }
  depth = depth === undefined ? 1 : toInteger(depth);
  return baseFlatten(array, depth);
}

module.exports = flattenDepth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZsYXR0ZW5EZXB0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxRQUFRLGdCQUFSLENBQWxCO0lBQ0ksWUFBWSxRQUFRLGFBQVIsQ0FEaEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkEsU0FBUyxZQUFULENBQXNCLEtBQXRCLEVBQTZCLEtBQTdCLEVBQW9DO0FBQ2xDLE1BQUksU0FBUyxRQUFRLE1BQU0sTUFBZCxHQUF1QixDQUFwQztBQUNBLE1BQUksQ0FBQyxNQUFMLEVBQWE7QUFDWCxXQUFPLEVBQVA7QUFDRDtBQUNELFVBQVEsVUFBVSxTQUFWLEdBQXNCLENBQXRCLEdBQTBCLFVBQVUsS0FBVixDQUFsQztBQUNBLFNBQU8sWUFBWSxLQUFaLEVBQW1CLEtBQW5CLENBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsWUFBakIiLCJmaWxlIjoiZmxhdHRlbkRlcHRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VGbGF0dGVuID0gcmVxdWlyZSgnLi9fYmFzZUZsYXR0ZW4nKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IGZsYXR0ZW4gYGFycmF5YCB1cCB0byBgZGVwdGhgIHRpbWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC40LjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGZsYXR0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gW2RlcHRoPTFdIFRoZSBtYXhpbXVtIHJlY3Vyc2lvbiBkZXB0aC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5ID0gWzEsIFsyLCBbMywgWzRdXSwgNV1dO1xuICpcbiAqIF8uZmxhdHRlbkRlcHRoKGFycmF5LCAxKTtcbiAqIC8vID0+IFsxLCAyLCBbMywgWzRdXSwgNV1cbiAqXG4gKiBfLmZsYXR0ZW5EZXB0aChhcnJheSwgMik7XG4gKiAvLyA9PiBbMSwgMiwgMywgWzRdLCA1XVxuICovXG5mdW5jdGlvbiBmbGF0dGVuRGVwdGgoYXJyYXksIGRlcHRoKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGRlcHRoID0gZGVwdGggPT09IHVuZGVmaW5lZCA/IDEgOiB0b0ludGVnZXIoZGVwdGgpO1xuICByZXR1cm4gYmFzZUZsYXR0ZW4oYXJyYXksIGRlcHRoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmbGF0dGVuRGVwdGg7XG4iXX0=