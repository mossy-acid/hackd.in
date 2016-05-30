'use strict';

var drop = require('./drop');

/**
 * Gets all but the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.tail([1, 2, 3]);
 * // => [2, 3]
 */
function tail(array) {
  return drop(array, 1);
}

module.exports = tail;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RhaWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE9BQU8sUUFBUSxRQUFSLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkosU0FBUyxJQUFULENBQWMsS0FBZCxFQUFxQjtBQUNuQixTQUFPLEtBQUssS0FBTCxFQUFZLENBQVosQ0FBUCxDQURtQjtDQUFyQjs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsSUFBakIiLCJmaWxlIjoidGFpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBkcm9wID0gcmVxdWlyZSgnLi9kcm9wJyk7XG5cbi8qKlxuICogR2V0cyBhbGwgYnV0IHRoZSBmaXJzdCBlbGVtZW50IG9mIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHNsaWNlIG9mIGBhcnJheWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGFpbChbMSwgMiwgM10pO1xuICogLy8gPT4gWzIsIDNdXG4gKi9cbmZ1bmN0aW9uIHRhaWwoYXJyYXkpIHtcbiAgcmV0dXJuIGRyb3AoYXJyYXksIDEpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRhaWw7XG4iXX0=