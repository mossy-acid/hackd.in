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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZsYXR0ZW5EZXB0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxRQUFRLGdCQUFSLENBQWQ7SUFDQSxZQUFZLFFBQVEsYUFBUixDQUFaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JKLFNBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QixLQUE3QixFQUFvQztBQUNsQyxNQUFJLFNBQVMsUUFBUSxNQUFNLE1BQU4sR0FBZSxDQUF2QixDQURxQjtBQUVsQyxNQUFJLENBQUMsTUFBRCxFQUFTO0FBQ1gsV0FBTyxFQUFQLENBRFc7R0FBYjtBQUdBLFVBQVEsVUFBVSxTQUFWLEdBQXNCLENBQXRCLEdBQTBCLFVBQVUsS0FBVixDQUExQixDQUwwQjtBQU1sQyxTQUFPLFlBQVksS0FBWixFQUFtQixLQUFuQixDQUFQLENBTmtDO0NBQXBDOztBQVNBLE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJmbGF0dGVuRGVwdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUZsYXR0ZW4gPSByZXF1aXJlKCcuL19iYXNlRmxhdHRlbicpLFxuICAgIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyk7XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgZmxhdHRlbiBgYXJyYXlgIHVwIHRvIGBkZXB0aGAgdGltZXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjQuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGVwdGg9MV0gVGhlIG1heGltdW0gcmVjdXJzaW9uIGRlcHRoLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmxhdHRlbmVkIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXkgPSBbMSwgWzIsIFszLCBbNF1dLCA1XV07XG4gKlxuICogXy5mbGF0dGVuRGVwdGgoYXJyYXksIDEpO1xuICogLy8gPT4gWzEsIDIsIFszLCBbNF1dLCA1XVxuICpcbiAqIF8uZmxhdHRlbkRlcHRoKGFycmF5LCAyKTtcbiAqIC8vID0+IFsxLCAyLCAzLCBbNF0sIDVdXG4gKi9cbmZ1bmN0aW9uIGZsYXR0ZW5EZXB0aChhcnJheSwgZGVwdGgpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgZGVwdGggPSBkZXB0aCA9PT0gdW5kZWZpbmVkID8gMSA6IHRvSW50ZWdlcihkZXB0aCk7XG4gIHJldHVybiBiYXNlRmxhdHRlbihhcnJheSwgZGVwdGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXR0ZW5EZXB0aDtcbiJdfQ==