'use strict';

var baseSortedIndex = require('./_baseSortedIndex');

/**
 * Uses a binary search to determine the lowest index at which `value`
 * should be inserted into `array` in order to maintain its sort order.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * _.sortedIndex([30, 50], 40);
 * // => 1
 */
function sortedIndex(array, value) {
  return baseSortedIndex(array, value);
}

module.exports = sortedIndex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRlZEluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxrQkFBa0IsUUFBUSxvQkFBUixDQUFsQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CSixTQUFTLFdBQVQsQ0FBcUIsS0FBckIsRUFBNEIsS0FBNUIsRUFBbUM7QUFDakMsU0FBTyxnQkFBZ0IsS0FBaEIsRUFBdUIsS0FBdkIsQ0FBUCxDQURpQztDQUFuQzs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoic29ydGVkSW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVNvcnRlZEluZGV4ID0gcmVxdWlyZSgnLi9fYmFzZVNvcnRlZEluZGV4Jyk7XG5cbi8qKlxuICogVXNlcyBhIGJpbmFyeSBzZWFyY2ggdG8gZGV0ZXJtaW5lIHRoZSBsb3dlc3QgaW5kZXggYXQgd2hpY2ggYHZhbHVlYFxuICogc2hvdWxkIGJlIGluc2VydGVkIGludG8gYGFycmF5YCBpbiBvcmRlciB0byBtYWludGFpbiBpdHMgc29ydCBvcmRlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBzb3J0ZWQgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGV2YWx1YXRlLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggYXQgd2hpY2ggYHZhbHVlYCBzaG91bGQgYmUgaW5zZXJ0ZWRcbiAqICBpbnRvIGBhcnJheWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uc29ydGVkSW5kZXgoWzMwLCA1MF0sIDQwKTtcbiAqIC8vID0+IDFcbiAqL1xuZnVuY3Rpb24gc29ydGVkSW5kZXgoYXJyYXksIHZhbHVlKSB7XG4gIHJldHVybiBiYXNlU29ydGVkSW5kZXgoYXJyYXksIHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzb3J0ZWRJbmRleDtcbiJdfQ==