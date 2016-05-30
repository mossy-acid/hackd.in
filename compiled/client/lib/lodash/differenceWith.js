'use strict';

var baseDifference = require('./_baseDifference'),
    baseFlatten = require('./_baseFlatten'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    last = require('./last'),
    rest = require('./rest');

/**
 * This method is like `_.difference` except that it accepts `comparator`
 * which is invoked to compare elements of `array` to `values`. Result values
 * are chosen from the first array. The comparator is invoked with two arguments:
 * (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 *
 * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
 * // => [{ 'x': 2, 'y': 1 }]
 */
var differenceWith = rest(function (array, values) {
  var comparator = last(values);
  if (isArrayLikeObject(comparator)) {
    comparator = undefined;
  }
  return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator) : [];
});

module.exports = differenceWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2RpZmZlcmVuY2VXaXRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxpQkFBaUIsUUFBUSxtQkFBUixDQUFyQjtJQUNJLGNBQWMsUUFBUSxnQkFBUixDQURsQjtJQUVJLG9CQUFvQixRQUFRLHFCQUFSLENBRnhCO0lBR0ksT0FBTyxRQUFRLFFBQVIsQ0FIWDtJQUlJLE9BQU8sUUFBUSxRQUFSLENBSlg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBLElBQUksaUJBQWlCLEtBQUssVUFBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCO0FBQ2hELE1BQUksYUFBYSxLQUFLLE1BQUwsQ0FBakI7QUFDQSxNQUFJLGtCQUFrQixVQUFsQixDQUFKLEVBQW1DO0FBQ2pDLGlCQUFhLFNBQWI7QUFDRDtBQUNELFNBQU8sa0JBQWtCLEtBQWxCLElBQ0gsZUFBZSxLQUFmLEVBQXNCLFlBQVksTUFBWixFQUFvQixDQUFwQixFQUF1QixpQkFBdkIsRUFBMEMsSUFBMUMsQ0FBdEIsRUFBdUUsU0FBdkUsRUFBa0YsVUFBbEYsQ0FERyxHQUVILEVBRko7QUFHRCxDQVJvQixDQUFyQjs7QUFVQSxPQUFPLE9BQVAsR0FBaUIsY0FBakIiLCJmaWxlIjoiZGlmZmVyZW5jZVdpdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZURpZmZlcmVuY2UgPSByZXF1aXJlKCcuL19iYXNlRGlmZmVyZW5jZScpLFxuICAgIGJhc2VGbGF0dGVuID0gcmVxdWlyZSgnLi9fYmFzZUZsYXR0ZW4nKSxcbiAgICBpc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2VPYmplY3QnKSxcbiAgICBsYXN0ID0gcmVxdWlyZSgnLi9sYXN0JyksXG4gICAgcmVzdCA9IHJlcXVpcmUoJy4vcmVzdCcpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZGlmZmVyZW5jZWAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgY29tcGFyYXRvcmBcbiAqIHdoaWNoIGlzIGludm9rZWQgdG8gY29tcGFyZSBlbGVtZW50cyBvZiBgYXJyYXlgIHRvIGB2YWx1ZXNgLiBSZXN1bHQgdmFsdWVzXG4gKiBhcmUgY2hvc2VuIGZyb20gdGhlIGZpcnN0IGFycmF5LiBUaGUgY29tcGFyYXRvciBpcyBpbnZva2VkIHdpdGggdHdvIGFyZ3VtZW50czpcbiAqIChhcnJWYWwsIG90aFZhbCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Li4uQXJyYXl9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gZXhjbHVkZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJhdG9yXSBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgZmlsdGVyZWQgdmFsdWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IFt7ICd4JzogMSwgJ3knOiAyIH0sIHsgJ3gnOiAyLCAneSc6IDEgfV07XG4gKlxuICogXy5kaWZmZXJlbmNlV2l0aChvYmplY3RzLCBbeyAneCc6IDEsICd5JzogMiB9XSwgXy5pc0VxdWFsKTtcbiAqIC8vID0+IFt7ICd4JzogMiwgJ3knOiAxIH1dXG4gKi9cbnZhciBkaWZmZXJlbmNlV2l0aCA9IHJlc3QoZnVuY3Rpb24oYXJyYXksIHZhbHVlcykge1xuICB2YXIgY29tcGFyYXRvciA9IGxhc3QodmFsdWVzKTtcbiAgaWYgKGlzQXJyYXlMaWtlT2JqZWN0KGNvbXBhcmF0b3IpKSB7XG4gICAgY29tcGFyYXRvciA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gaXNBcnJheUxpa2VPYmplY3QoYXJyYXkpXG4gICAgPyBiYXNlRGlmZmVyZW5jZShhcnJheSwgYmFzZUZsYXR0ZW4odmFsdWVzLCAxLCBpc0FycmF5TGlrZU9iamVjdCwgdHJ1ZSksIHVuZGVmaW5lZCwgY29tcGFyYXRvcilcbiAgICA6IFtdO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGlmZmVyZW5jZVdpdGg7XG4iXX0=