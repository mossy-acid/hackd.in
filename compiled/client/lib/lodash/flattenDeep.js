'use strict';

var baseFlatten = require('./_baseFlatten');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Recursively flattens `array`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flattenDeep([1, [2, [3, [4]], 5]]);
 * // => [1, 2, 3, 4, 5]
 */
function flattenDeep(array) {
  var length = array ? array.length : 0;
  return length ? baseFlatten(array, INFINITY) : [];
}

module.exports = flattenDeep;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZsYXR0ZW5EZWVwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7OztBQUdBLElBQUksV0FBVyxJQUFJLENBQW5COzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLFNBQVMsV0FBVCxDQUFxQixLQUFyQixFQUE0QjtBQUMxQixNQUFJLFNBQVMsUUFBUSxNQUFNLE1BQWQsR0FBdUIsQ0FBcEM7QUFDQSxTQUFPLFNBQVMsWUFBWSxLQUFaLEVBQW1CLFFBQW5CLENBQVQsR0FBd0MsRUFBL0M7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoiZmxhdHRlbkRlZXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUZsYXR0ZW4gPSByZXF1aXJlKCcuL19iYXNlRmxhdHRlbicpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IGZsYXR0ZW5zIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5mbGF0dGVuRGVlcChbMSwgWzIsIFszLCBbNF1dLCA1XV0pO1xuICogLy8gPT4gWzEsIDIsIDMsIDQsIDVdXG4gKi9cbmZ1bmN0aW9uIGZsYXR0ZW5EZWVwKGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gIHJldHVybiBsZW5ndGggPyBiYXNlRmxhdHRlbihhcnJheSwgSU5GSU5JVFkpIDogW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmxhdHRlbkRlZXA7XG4iXX0=