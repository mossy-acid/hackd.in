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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2RpZmZlcmVuY2VCeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksaUJBQWlCLFFBQVEsbUJBQVIsQ0FBckI7SUFDSSxjQUFjLFFBQVEsZ0JBQVIsQ0FEbEI7SUFFSSxlQUFlLFFBQVEsaUJBQVIsQ0FGbkI7SUFHSSxvQkFBb0IsUUFBUSxxQkFBUixDQUh4QjtJQUlJLE9BQU8sUUFBUSxRQUFSLENBSlg7SUFLSSxPQUFPLFFBQVEsUUFBUixDQUxYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQStCQSxJQUFJLGVBQWUsS0FBSyxVQUFTLEtBQVQsRUFBZ0IsTUFBaEIsRUFBd0I7QUFDOUMsTUFBSSxXQUFXLEtBQUssTUFBTCxDQUFmO0FBQ0EsTUFBSSxrQkFBa0IsUUFBbEIsQ0FBSixFQUFpQztBQUMvQixlQUFXLFNBQVg7QUFDRDtBQUNELFNBQU8sa0JBQWtCLEtBQWxCLElBQ0gsZUFBZSxLQUFmLEVBQXNCLFlBQVksTUFBWixFQUFvQixDQUFwQixFQUF1QixpQkFBdkIsRUFBMEMsSUFBMUMsQ0FBdEIsRUFBdUUsYUFBYSxRQUFiLENBQXZFLENBREcsR0FFSCxFQUZKO0FBR0QsQ0FSa0IsQ0FBbkI7O0FBVUEsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6ImRpZmZlcmVuY2VCeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlRGlmZmVyZW5jZSA9IHJlcXVpcmUoJy4vX2Jhc2VEaWZmZXJlbmNlJyksXG4gICAgYmFzZUZsYXR0ZW4gPSByZXF1aXJlKCcuL19iYXNlRmxhdHRlbicpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZU9iamVjdCcpLFxuICAgIGxhc3QgPSByZXF1aXJlKCcuL2xhc3QnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5kaWZmZXJlbmNlYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGBpdGVyYXRlZWAgd2hpY2hcbiAqIGlzIGludm9rZWQgZm9yIGVhY2ggZWxlbWVudCBvZiBgYXJyYXlgIGFuZCBgdmFsdWVzYCB0byBnZW5lcmF0ZSB0aGUgY3JpdGVyaW9uXG4gKiBieSB3aGljaCB0aGV5J3JlIGNvbXBhcmVkLiBSZXN1bHQgdmFsdWVzIGFyZSBjaG9zZW4gZnJvbSB0aGUgZmlyc3QgYXJyYXkuXG4gKiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDogKHZhbHVlKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsuLi5BcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBleGNsdWRlLlxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV1cbiAqICBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGZpbHRlcmVkIHZhbHVlcy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kaWZmZXJlbmNlQnkoWzIuMSwgMS4yXSwgWzIuMywgMy40XSwgTWF0aC5mbG9vcik7XG4gKiAvLyA9PiBbMS4yXVxuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5kaWZmZXJlbmNlQnkoW3sgJ3gnOiAyIH0sIHsgJ3gnOiAxIH1dLCBbeyAneCc6IDEgfV0sICd4Jyk7XG4gKiAvLyA9PiBbeyAneCc6IDIgfV1cbiAqL1xudmFyIGRpZmZlcmVuY2VCeSA9IHJlc3QoZnVuY3Rpb24oYXJyYXksIHZhbHVlcykge1xuICB2YXIgaXRlcmF0ZWUgPSBsYXN0KHZhbHVlcyk7XG4gIGlmIChpc0FycmF5TGlrZU9iamVjdChpdGVyYXRlZSkpIHtcbiAgICBpdGVyYXRlZSA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gaXNBcnJheUxpa2VPYmplY3QoYXJyYXkpXG4gICAgPyBiYXNlRGlmZmVyZW5jZShhcnJheSwgYmFzZUZsYXR0ZW4odmFsdWVzLCAxLCBpc0FycmF5TGlrZU9iamVjdCwgdHJ1ZSksIGJhc2VJdGVyYXRlZShpdGVyYXRlZSkpXG4gICAgOiBbXTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRpZmZlcmVuY2VCeTtcbiJdfQ==