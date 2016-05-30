'use strict';

var baseSlice = require('./_baseSlice'),
    toInteger = require('./toInteger');

/**
 * Creates a slice of `array` with `n` elements dropped from the beginning.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to drop.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.drop([1, 2, 3]);
 * // => [2, 3]
 *
 * _.drop([1, 2, 3], 2);
 * // => [3]
 *
 * _.drop([1, 2, 3], 5);
 * // => []
 *
 * _.drop([1, 2, 3], 0);
 * // => [1, 2, 3]
 */
function drop(array, n, guard) {
  var length = array ? array.length : 0;
  if (!length) {
    return [];
  }
  n = guard || n === undefined ? 1 : toInteger(n);
  return baseSlice(array, n < 0 ? 0 : n, length);
}

module.exports = drop;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Ryb3AuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxjQUFSLENBQWhCO0lBQ0ksWUFBWSxRQUFRLGFBQVIsQ0FEaEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCQSxTQUFTLElBQVQsQ0FBYyxLQUFkLEVBQXFCLENBQXJCLEVBQXdCLEtBQXhCLEVBQStCO0FBQzdCLE1BQUksU0FBUyxRQUFRLE1BQU0sTUFBZCxHQUF1QixDQUFwQztBQUNBLE1BQUksQ0FBQyxNQUFMLEVBQWE7QUFDWCxXQUFPLEVBQVA7QUFDRDtBQUNELE1BQUssU0FBUyxNQUFNLFNBQWhCLEdBQTZCLENBQTdCLEdBQWlDLFVBQVUsQ0FBVixDQUFyQztBQUNBLFNBQU8sVUFBVSxLQUFWLEVBQWlCLElBQUksQ0FBSixHQUFRLENBQVIsR0FBWSxDQUE3QixFQUFnQyxNQUFoQyxDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6ImRyb3AuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVNsaWNlID0gcmVxdWlyZSgnLi9fYmFzZVNsaWNlJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2xpY2Ugb2YgYGFycmF5YCB3aXRoIGBuYCBlbGVtZW50cyBkcm9wcGVkIGZyb20gdGhlIGJlZ2lubmluZy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuNS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbj0xXSBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIGRyb3AuXG4gKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYW4gaXRlcmF0ZWUgZm9yIG1ldGhvZHMgbGlrZSBgXy5tYXBgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBzbGljZSBvZiBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRyb3AoWzEsIDIsIDNdKTtcbiAqIC8vID0+IFsyLCAzXVxuICpcbiAqIF8uZHJvcChbMSwgMiwgM10sIDIpO1xuICogLy8gPT4gWzNdXG4gKlxuICogXy5kcm9wKFsxLCAyLCAzXSwgNSk7XG4gKiAvLyA9PiBbXVxuICpcbiAqIF8uZHJvcChbMSwgMiwgM10sIDApO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKi9cbmZ1bmN0aW9uIGRyb3AoYXJyYXksIG4sIGd1YXJkKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIG4gPSAoZ3VhcmQgfHwgbiA9PT0gdW5kZWZpbmVkKSA/IDEgOiB0b0ludGVnZXIobik7XG4gIHJldHVybiBiYXNlU2xpY2UoYXJyYXksIG4gPCAwID8gMCA6IG4sIGxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZHJvcDtcbiJdfQ==