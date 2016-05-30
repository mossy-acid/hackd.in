'use strict';

var dropRight = require('./dropRight');

/**
 * Gets all but the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.initial([1, 2, 3]);
 * // => [1, 2]
 */
function initial(array) {
  return dropRight(array, 1);
}

module.exports = initial;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2luaXRpYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxhQUFSLENBQVo7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkosU0FBUyxPQUFULENBQWlCLEtBQWpCLEVBQXdCO0FBQ3RCLFNBQU8sVUFBVSxLQUFWLEVBQWlCLENBQWpCLENBQVAsQ0FEc0I7Q0FBeEI7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6ImluaXRpYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZHJvcFJpZ2h0ID0gcmVxdWlyZSgnLi9kcm9wUmlnaHQnKTtcblxuLyoqXG4gKiBHZXRzIGFsbCBidXQgdGhlIGxhc3QgZWxlbWVudCBvZiBgYXJyYXlgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBzbGljZSBvZiBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmluaXRpYWwoWzEsIDIsIDNdKTtcbiAqIC8vID0+IFsxLCAyXVxuICovXG5mdW5jdGlvbiBpbml0aWFsKGFycmF5KSB7XG4gIHJldHVybiBkcm9wUmlnaHQoYXJyYXksIDEpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRpYWw7XG4iXX0=