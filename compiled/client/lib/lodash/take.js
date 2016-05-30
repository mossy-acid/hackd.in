'use strict';

var baseSlice = require('./_baseSlice'),
    toInteger = require('./toInteger');

/**
 * Creates a slice of `array` with `n` elements taken from the beginning.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to take.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.take([1, 2, 3]);
 * // => [1]
 *
 * _.take([1, 2, 3], 2);
 * // => [1, 2]
 *
 * _.take([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * _.take([1, 2, 3], 0);
 * // => []
 */
function take(array, n, guard) {
  if (!(array && array.length)) {
    return [];
  }
  n = guard || n === undefined ? 1 : toInteger(n);
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

module.exports = take;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3Rha2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxjQUFSLENBQWhCO0lBQ0ksWUFBWSxRQUFRLGFBQVIsQ0FEaEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCQSxTQUFTLElBQVQsQ0FBYyxLQUFkLEVBQXFCLENBQXJCLEVBQXdCLEtBQXhCLEVBQStCO0FBQzdCLE1BQUksRUFBRSxTQUFTLE1BQU0sTUFBakIsQ0FBSixFQUE4QjtBQUM1QixXQUFPLEVBQVA7QUFDRDtBQUNELE1BQUssU0FBUyxNQUFNLFNBQWhCLEdBQTZCLENBQTdCLEdBQWlDLFVBQVUsQ0FBVixDQUFyQztBQUNBLFNBQU8sVUFBVSxLQUFWLEVBQWlCLENBQWpCLEVBQW9CLElBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFoQyxDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6InRha2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVNsaWNlID0gcmVxdWlyZSgnLi9fYmFzZVNsaWNlJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2xpY2Ugb2YgYGFycmF5YCB3aXRoIGBuYCBlbGVtZW50cyB0YWtlbiBmcm9tIHRoZSBiZWdpbm5pbmcuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge251bWJlcn0gW249MV0gVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byB0YWtlLlxuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50YWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBbMV1cbiAqXG4gKiBfLnRha2UoWzEsIDIsIDNdLCAyKTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIF8udGFrZShbMSwgMiwgM10sIDUpO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKlxuICogXy50YWtlKFsxLCAyLCAzXSwgMCk7XG4gKiAvLyA9PiBbXVxuICovXG5mdW5jdGlvbiB0YWtlKGFycmF5LCBuLCBndWFyZCkge1xuICBpZiAoIShhcnJheSAmJiBhcnJheS5sZW5ndGgpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIG4gPSAoZ3VhcmQgfHwgbiA9PT0gdW5kZWZpbmVkKSA/IDEgOiB0b0ludGVnZXIobik7XG4gIHJldHVybiBiYXNlU2xpY2UoYXJyYXksIDAsIG4gPCAwID8gMCA6IG4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRha2U7XG4iXX0=