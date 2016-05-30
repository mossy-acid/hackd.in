'use strict';

var basePullAll = require('./_basePullAll');

/**
 * This method is like `_.pull` except that it accepts an array of values to remove.
 *
 * **Note:** Unlike `_.difference`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 *
 * _.pullAll(array, ['a', 'c']);
 * console.log(array);
 * // => ['b', 'b']
 */
function pullAll(array, values) {
  return array && array.length && values && values.length ? basePullAll(array, values) : array;
}

module.exports = pullAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3B1bGxBbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFkOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JKLFNBQVMsT0FBVCxDQUFpQixLQUFqQixFQUF3QixNQUF4QixFQUFnQztBQUM5QixTQUFPLEtBQUMsSUFBUyxNQUFNLE1BQU4sSUFBZ0IsTUFBekIsSUFBbUMsT0FBTyxNQUFQLEdBQ3ZDLFlBQVksS0FBWixFQUFtQixNQUFuQixDQURHLEdBRUgsS0FGRyxDQUR1QjtDQUFoQzs7QUFNQSxPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoicHVsbEFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlUHVsbEFsbCA9IHJlcXVpcmUoJy4vX2Jhc2VQdWxsQWxsJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5wdWxsYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGFuIGFycmF5IG9mIHZhbHVlcyB0byByZW1vdmUuXG4gKlxuICogKipOb3RlOioqIFVubGlrZSBgXy5kaWZmZXJlbmNlYCwgdGhpcyBtZXRob2QgbXV0YXRlcyBgYXJyYXlgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXkgPSBbJ2EnLCAnYicsICdjJywgJ2EnLCAnYicsICdjJ107XG4gKlxuICogXy5wdWxsQWxsKGFycmF5LCBbJ2EnLCAnYyddKTtcbiAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAqIC8vID0+IFsnYicsICdiJ11cbiAqL1xuZnVuY3Rpb24gcHVsbEFsbChhcnJheSwgdmFsdWVzKSB7XG4gIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoICYmIHZhbHVlcyAmJiB2YWx1ZXMubGVuZ3RoKVxuICAgID8gYmFzZVB1bGxBbGwoYXJyYXksIHZhbHVlcylcbiAgICA6IGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHB1bGxBbGw7XG4iXX0=