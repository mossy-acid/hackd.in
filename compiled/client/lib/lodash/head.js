"use strict";

/**
 * Gets the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias first
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the first element of `array`.
 * @example
 *
 * _.head([1, 2, 3]);
 * // => 1
 *
 * _.head([]);
 * // => undefined
 */
function head(array) {
  return array && array.length ? array[0] : undefined;
}

module.exports = head;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2hlYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsU0FBUyxJQUFULENBQWMsS0FBZCxFQUFxQjtBQUNuQixTQUFRLFNBQVMsTUFBTSxNQUFoQixHQUEwQixNQUFNLENBQU4sQ0FBMUIsR0FBcUMsU0FBNUM7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsSUFBakIiLCJmaWxlIjoiaGVhZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogR2V0cyB0aGUgZmlyc3QgZWxlbWVudCBvZiBgYXJyYXlgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBhbGlhcyBmaXJzdFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCBvZiBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmhlYWQoWzEsIDIsIDNdKTtcbiAqIC8vID0+IDFcbiAqXG4gKiBfLmhlYWQoW10pO1xuICogLy8gPT4gdW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIGhlYWQoYXJyYXkpIHtcbiAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGgpID8gYXJyYXlbMF0gOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGVhZDtcbiJdfQ==