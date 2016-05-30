'use strict';

var baseFill = require('./_baseFill'),
    isIterateeCall = require('./_isIterateeCall');

/**
 * Fills elements of `array` with `value` from `start` up to, but not
 * including, `end`.
 *
 * **Note:** This method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 3.2.0
 * @category Array
 * @param {Array} array The array to fill.
 * @param {*} value The value to fill `array` with.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * _.fill(array, 'a');
 * console.log(array);
 * // => ['a', 'a', 'a']
 *
 * _.fill(Array(3), 2);
 * // => [2, 2, 2]
 *
 * _.fill([4, 6, 8, 10], '*', 1, 3);
 * // => [4, '*', '*', 10]
 */
function fill(array, value, start, end) {
  var length = array ? array.length : 0;
  if (!length) {
    return [];
  }
  if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
    start = 0;
    end = length;
  }
  return baseFill(array, value, start, end);
}

module.exports = fill;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZpbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxhQUFSLENBQWY7SUFDSSxpQkFBaUIsUUFBUSxtQkFBUixDQURyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdDQSxTQUFTLElBQVQsQ0FBYyxLQUFkLEVBQXFCLEtBQXJCLEVBQTRCLEtBQTVCLEVBQW1DLEdBQW5DLEVBQXdDO0FBQ3RDLE1BQUksU0FBUyxRQUFRLE1BQU0sTUFBZCxHQUF1QixDQUFwQztBQUNBLE1BQUksQ0FBQyxNQUFMLEVBQWE7QUFDWCxXQUFPLEVBQVA7QUFDRDtBQUNELE1BQUksU0FBUyxPQUFPLEtBQVAsSUFBZ0IsUUFBekIsSUFBcUMsZUFBZSxLQUFmLEVBQXNCLEtBQXRCLEVBQTZCLEtBQTdCLENBQXpDLEVBQThFO0FBQzVFLFlBQVEsQ0FBUjtBQUNBLFVBQU0sTUFBTjtBQUNEO0FBQ0QsU0FBTyxTQUFTLEtBQVQsRUFBZ0IsS0FBaEIsRUFBdUIsS0FBdkIsRUFBOEIsR0FBOUIsQ0FBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJmaWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VGaWxsID0gcmVxdWlyZSgnLi9fYmFzZUZpbGwnKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vX2lzSXRlcmF0ZWVDYWxsJyk7XG5cbi8qKlxuICogRmlsbHMgZWxlbWVudHMgb2YgYGFycmF5YCB3aXRoIGB2YWx1ZWAgZnJvbSBgc3RhcnRgIHVwIHRvLCBidXQgbm90XG4gKiBpbmNsdWRpbmcsIGBlbmRgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjIuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmlsbC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGZpbGwgYGFycmF5YCB3aXRoLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgcG9zaXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2VuZD1hcnJheS5sZW5ndGhdIFRoZSBlbmQgcG9zaXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5ID0gWzEsIDIsIDNdO1xuICpcbiAqIF8uZmlsbChhcnJheSwgJ2EnKTtcbiAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAqIC8vID0+IFsnYScsICdhJywgJ2EnXVxuICpcbiAqIF8uZmlsbChBcnJheSgzKSwgMik7XG4gKiAvLyA9PiBbMiwgMiwgMl1cbiAqXG4gKiBfLmZpbGwoWzQsIDYsIDgsIDEwXSwgJyonLCAxLCAzKTtcbiAqIC8vID0+IFs0LCAnKicsICcqJywgMTBdXG4gKi9cbmZ1bmN0aW9uIGZpbGwoYXJyYXksIHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmIChzdGFydCAmJiB0eXBlb2Ygc3RhcnQgIT0gJ251bWJlcicgJiYgaXNJdGVyYXRlZUNhbGwoYXJyYXksIHZhbHVlLCBzdGFydCkpIHtcbiAgICBzdGFydCA9IDA7XG4gICAgZW5kID0gbGVuZ3RoO1xuICB9XG4gIHJldHVybiBiYXNlRmlsbChhcnJheSwgdmFsdWUsIHN0YXJ0LCBlbmQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbGw7XG4iXX0=