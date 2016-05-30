'use strict';

var baseFlatten = require('./_baseFlatten'),
    baseUniq = require('./_baseUniq'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    last = require('./last'),
    rest = require('./rest');

/**
 * This method is like `_.union` except that it accepts `comparator` which
 * is invoked to compare elements of `arrays`. The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.unionWith(objects, others, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
 */
var unionWith = rest(function (arrays) {
  var comparator = last(arrays);
  if (isArrayLikeObject(comparator)) {
    comparator = undefined;
  }
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
});

module.exports = unionWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VuaW9uV2l0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxRQUFRLGdCQUFSLENBQWQ7SUFDQSxXQUFXLFFBQVEsYUFBUixDQUFYO0lBQ0Esb0JBQW9CLFFBQVEscUJBQVIsQ0FBcEI7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCSixJQUFJLFlBQVksS0FBSyxVQUFTLE1BQVQsRUFBaUI7QUFDcEMsTUFBSSxhQUFhLEtBQUssTUFBTCxDQUFiLENBRGdDO0FBRXBDLE1BQUksa0JBQWtCLFVBQWxCLENBQUosRUFBbUM7QUFDakMsaUJBQWEsU0FBYixDQURpQztHQUFuQztBQUdBLFNBQU8sU0FBUyxZQUFZLE1BQVosRUFBb0IsQ0FBcEIsRUFBdUIsaUJBQXZCLEVBQTBDLElBQTFDLENBQVQsRUFBMEQsU0FBMUQsRUFBcUUsVUFBckUsQ0FBUCxDQUxvQztDQUFqQixDQUFqQjs7QUFRSixPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoidW5pb25XaXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VGbGF0dGVuID0gcmVxdWlyZSgnLi9fYmFzZUZsYXR0ZW4nKSxcbiAgICBiYXNlVW5pcSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmlxJyksXG4gICAgaXNBcnJheUxpa2VPYmplY3QgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlT2JqZWN0JyksXG4gICAgbGFzdCA9IHJlcXVpcmUoJy4vbGFzdCcpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnVuaW9uYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGBjb21wYXJhdG9yYCB3aGljaFxuICogaXMgaW52b2tlZCB0byBjb21wYXJlIGVsZW1lbnRzIG9mIGBhcnJheXNgLiBUaGUgY29tcGFyYXRvciBpcyBpbnZva2VkXG4gKiB3aXRoIHR3byBhcmd1bWVudHM6IChhcnJWYWwsIG90aFZhbCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0gey4uLkFycmF5fSBbYXJyYXlzXSBUaGUgYXJyYXlzIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyYXRvcl0gVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGNvbWJpbmVkIHZhbHVlcy5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBbeyAneCc6IDEsICd5JzogMiB9LCB7ICd4JzogMiwgJ3knOiAxIH1dO1xuICogdmFyIG90aGVycyA9IFt7ICd4JzogMSwgJ3knOiAxIH0sIHsgJ3gnOiAxLCAneSc6IDIgfV07XG4gKlxuICogXy51bmlvbldpdGgob2JqZWN0cywgb3RoZXJzLCBfLmlzRXF1YWwpO1xuICogLy8gPT4gW3sgJ3gnOiAxLCAneSc6IDIgfSwgeyAneCc6IDIsICd5JzogMSB9LCB7ICd4JzogMSwgJ3knOiAxIH1dXG4gKi9cbnZhciB1bmlvbldpdGggPSByZXN0KGZ1bmN0aW9uKGFycmF5cykge1xuICB2YXIgY29tcGFyYXRvciA9IGxhc3QoYXJyYXlzKTtcbiAgaWYgKGlzQXJyYXlMaWtlT2JqZWN0KGNvbXBhcmF0b3IpKSB7XG4gICAgY29tcGFyYXRvciA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gYmFzZVVuaXEoYmFzZUZsYXR0ZW4oYXJyYXlzLCAxLCBpc0FycmF5TGlrZU9iamVjdCwgdHJ1ZSksIHVuZGVmaW5lZCwgY29tcGFyYXRvcik7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB1bmlvbldpdGg7XG4iXX0=