'use strict';

var baseDifference = require('./_baseDifference'),
    baseFlatten = require('./_baseFlatten'),
    baseIteratee = require('./_baseIteratee'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    last = require('./last'),
    rest = require('./rest');

/**
 * This method is like `_.difference` except that it accepts `iteratee` which
 * is invoked for each element of `array` and `values` to generate the criterion
 * by which they're compared. Result values are chosen from the first array.
 * The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The iteratee invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
 * // => [{ 'x': 2 }]
 */
var differenceBy = rest(function (array, values) {
  var iteratee = last(values);
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), baseIteratee(iteratee)) : [];
});

module.exports = differenceBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2RpZmZlcmVuY2VCeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksaUJBQWlCLFFBQVEsbUJBQVIsQ0FBakI7SUFDQSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLGVBQWUsUUFBUSxpQkFBUixDQUFmO0lBQ0Esb0JBQW9CLFFBQVEscUJBQVIsQ0FBcEI7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkosSUFBSSxlQUFlLEtBQUssVUFBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCO0FBQzlDLE1BQUksV0FBVyxLQUFLLE1BQUwsQ0FBWCxDQUQwQztBQUU5QyxNQUFJLGtCQUFrQixRQUFsQixDQUFKLEVBQWlDO0FBQy9CLGVBQVcsU0FBWCxDQUQrQjtHQUFqQztBQUdBLFNBQU8sa0JBQWtCLEtBQWxCLElBQ0gsZUFBZSxLQUFmLEVBQXNCLFlBQVksTUFBWixFQUFvQixDQUFwQixFQUF1QixpQkFBdkIsRUFBMEMsSUFBMUMsQ0FBdEIsRUFBdUUsYUFBYSxRQUFiLENBQXZFLENBREcsR0FFSCxFQUZHLENBTHVDO0NBQXhCLENBQXBCOztBQVVKLE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJkaWZmZXJlbmNlQnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZURpZmZlcmVuY2UgPSByZXF1aXJlKCcuL19iYXNlRGlmZmVyZW5jZScpLFxuICAgIGJhc2VGbGF0dGVuID0gcmVxdWlyZSgnLi9fYmFzZUZsYXR0ZW4nKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBpc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2VPYmplY3QnKSxcbiAgICBsYXN0ID0gcmVxdWlyZSgnLi9sYXN0JyksXG4gICAgcmVzdCA9IHJlcXVpcmUoJy4vcmVzdCcpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZGlmZmVyZW5jZWAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgaXRlcmF0ZWVgIHdoaWNoXG4gKiBpcyBpbnZva2VkIGZvciBlYWNoIGVsZW1lbnQgb2YgYGFycmF5YCBhbmQgYHZhbHVlc2AgdG8gZ2VuZXJhdGUgdGhlIGNyaXRlcmlvblxuICogYnkgd2hpY2ggdGhleSdyZSBjb21wYXJlZC4gUmVzdWx0IHZhbHVlcyBhcmUgY2hvc2VuIGZyb20gdGhlIGZpcnN0IGFycmF5LlxuICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6ICh2YWx1ZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Li4uQXJyYXl9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gZXhjbHVkZS5cbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2l0ZXJhdGVlPV8uaWRlbnRpdHldXG4gKiAgVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBmaWx0ZXJlZCB2YWx1ZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGlmZmVyZW5jZUJ5KFsyLjEsIDEuMl0sIFsyLjMsIDMuNF0sIE1hdGguZmxvb3IpO1xuICogLy8gPT4gWzEuMl1cbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZGlmZmVyZW5jZUJ5KFt7ICd4JzogMiB9LCB7ICd4JzogMSB9XSwgW3sgJ3gnOiAxIH1dLCAneCcpO1xuICogLy8gPT4gW3sgJ3gnOiAyIH1dXG4gKi9cbnZhciBkaWZmZXJlbmNlQnkgPSByZXN0KGZ1bmN0aW9uKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGl0ZXJhdGVlID0gbGFzdCh2YWx1ZXMpO1xuICBpZiAoaXNBcnJheUxpa2VPYmplY3QoaXRlcmF0ZWUpKSB7XG4gICAgaXRlcmF0ZWUgPSB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIGlzQXJyYXlMaWtlT2JqZWN0KGFycmF5KVxuICAgID8gYmFzZURpZmZlcmVuY2UoYXJyYXksIGJhc2VGbGF0dGVuKHZhbHVlcywgMSwgaXNBcnJheUxpa2VPYmplY3QsIHRydWUpLCBiYXNlSXRlcmF0ZWUoaXRlcmF0ZWUpKVxuICAgIDogW107XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkaWZmZXJlbmNlQnk7XG4iXX0=