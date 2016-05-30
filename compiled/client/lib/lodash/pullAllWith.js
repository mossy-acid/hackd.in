'use strict';

var basePullAll = require('./_basePullAll');

/**
 * This method is like `_.pullAll` except that it accepts `comparator` which
 * is invoked to compare elements of `array` to `values`. The comparator is
 * invoked with two arguments: (arrVal, othVal).
 *
 * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.6.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
 *
 * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
 * console.log(array);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
 */
function pullAllWith(array, values, comparator) {
  return array && array.length && values && values.length ? basePullAll(array, values, undefined, comparator) : array;
}

module.exports = pullAllWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3B1bGxBbGxXaXRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsU0FBUyxXQUFULENBQXFCLEtBQXJCLEVBQTRCLE1BQTVCLEVBQW9DLFVBQXBDLEVBQWdEO0FBQzlDLFNBQVEsU0FBUyxNQUFNLE1BQWYsSUFBeUIsTUFBekIsSUFBbUMsT0FBTyxNQUEzQyxHQUNILFlBQVksS0FBWixFQUFtQixNQUFuQixFQUEyQixTQUEzQixFQUFzQyxVQUF0QyxDQURHLEdBRUgsS0FGSjtBQUdEOztBQUVELE9BQU8sT0FBUCxHQUFpQixXQUFqQiIsImZpbGUiOiJwdWxsQWxsV2l0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlUHVsbEFsbCA9IHJlcXVpcmUoJy4vX2Jhc2VQdWxsQWxsJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5wdWxsQWxsYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGBjb21wYXJhdG9yYCB3aGljaFxuICogaXMgaW52b2tlZCB0byBjb21wYXJlIGVsZW1lbnRzIG9mIGBhcnJheWAgdG8gYHZhbHVlc2AuIFRoZSBjb21wYXJhdG9yIGlzXG4gKiBpbnZva2VkIHdpdGggdHdvIGFyZ3VtZW50czogKGFyclZhbCwgb3RoVmFsKS5cbiAqXG4gKiAqKk5vdGU6KiogVW5saWtlIGBfLmRpZmZlcmVuY2VXaXRoYCwgdGhpcyBtZXRob2QgbXV0YXRlcyBgYXJyYXlgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC42LjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIHJlbW92ZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJhdG9yXSBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheSA9IFt7ICd4JzogMSwgJ3knOiAyIH0sIHsgJ3gnOiAzLCAneSc6IDQgfSwgeyAneCc6IDUsICd5JzogNiB9XTtcbiAqXG4gKiBfLnB1bGxBbGxXaXRoKGFycmF5LCBbeyAneCc6IDMsICd5JzogNCB9XSwgXy5pc0VxdWFsKTtcbiAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAqIC8vID0+IFt7ICd4JzogMSwgJ3knOiAyIH0sIHsgJ3gnOiA1LCAneSc6IDYgfV1cbiAqL1xuZnVuY3Rpb24gcHVsbEFsbFdpdGgoYXJyYXksIHZhbHVlcywgY29tcGFyYXRvcikge1xuICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aCAmJiB2YWx1ZXMgJiYgdmFsdWVzLmxlbmd0aClcbiAgICA/IGJhc2VQdWxsQWxsKGFycmF5LCB2YWx1ZXMsIHVuZGVmaW5lZCwgY29tcGFyYXRvcilcbiAgICA6IGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHB1bGxBbGxXaXRoO1xuIl19