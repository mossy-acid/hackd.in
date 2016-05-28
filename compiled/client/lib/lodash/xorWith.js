'use strict';

var arrayFilter = require('./_arrayFilter'),
    baseXor = require('./_baseXor'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    last = require('./last'),
    rest = require('./rest');

/**
 * This method is like `_.xor` except that it accepts `comparator` which is
 * invoked to compare elements of `arrays`. The comparator is invoked with
 * two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.xorWith(objects, others, _.isEqual);
 * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
 */
var xorWith = rest(function (arrays) {
  var comparator = last(arrays);
  if (isArrayLikeObject(comparator)) {
    comparator = undefined;
  }
  return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
});

module.exports = xorWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3hvcldpdGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFkO0lBQ0EsVUFBVSxRQUFRLFlBQVIsQ0FBVjtJQUNBLG9CQUFvQixRQUFRLHFCQUFSLENBQXBCO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDtJQUNBLE9BQU8sUUFBUSxRQUFSLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkosSUFBSSxVQUFVLEtBQUssVUFBUyxNQUFULEVBQWlCO0FBQ2xDLE1BQUksYUFBYSxLQUFLLE1BQUwsQ0FBYixDQUQ4QjtBQUVsQyxNQUFJLGtCQUFrQixVQUFsQixDQUFKLEVBQW1DO0FBQ2pDLGlCQUFhLFNBQWIsQ0FEaUM7R0FBbkM7QUFHQSxTQUFPLFFBQVEsWUFBWSxNQUFaLEVBQW9CLGlCQUFwQixDQUFSLEVBQWdELFNBQWhELEVBQTJELFVBQTNELENBQVAsQ0FMa0M7Q0FBakIsQ0FBZjs7QUFRSixPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoieG9yV2l0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcnJheUZpbHRlciA9IHJlcXVpcmUoJy4vX2FycmF5RmlsdGVyJyksXG4gICAgYmFzZVhvciA9IHJlcXVpcmUoJy4vX2Jhc2VYb3InKSxcbiAgICBpc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2VPYmplY3QnKSxcbiAgICBsYXN0ID0gcmVxdWlyZSgnLi9sYXN0JyksXG4gICAgcmVzdCA9IHJlcXVpcmUoJy4vcmVzdCcpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ueG9yYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGBjb21wYXJhdG9yYCB3aGljaCBpc1xuICogaW52b2tlZCB0byBjb21wYXJlIGVsZW1lbnRzIG9mIGBhcnJheXNgLiBUaGUgY29tcGFyYXRvciBpcyBpbnZva2VkIHdpdGhcbiAqIHR3byBhcmd1bWVudHM6IChhcnJWYWwsIG90aFZhbCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0gey4uLkFycmF5fSBbYXJyYXlzXSBUaGUgYXJyYXlzIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyYXRvcl0gVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGZpbHRlcmVkIHZhbHVlcy5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBbeyAneCc6IDEsICd5JzogMiB9LCB7ICd4JzogMiwgJ3knOiAxIH1dO1xuICogdmFyIG90aGVycyA9IFt7ICd4JzogMSwgJ3knOiAxIH0sIHsgJ3gnOiAxLCAneSc6IDIgfV07XG4gKlxuICogXy54b3JXaXRoKG9iamVjdHMsIG90aGVycywgXy5pc0VxdWFsKTtcbiAqIC8vID0+IFt7ICd4JzogMiwgJ3knOiAxIH0sIHsgJ3gnOiAxLCAneSc6IDEgfV1cbiAqL1xudmFyIHhvcldpdGggPSByZXN0KGZ1bmN0aW9uKGFycmF5cykge1xuICB2YXIgY29tcGFyYXRvciA9IGxhc3QoYXJyYXlzKTtcbiAgaWYgKGlzQXJyYXlMaWtlT2JqZWN0KGNvbXBhcmF0b3IpKSB7XG4gICAgY29tcGFyYXRvciA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gYmFzZVhvcihhcnJheUZpbHRlcihhcnJheXMsIGlzQXJyYXlMaWtlT2JqZWN0KSwgdW5kZWZpbmVkLCBjb21wYXJhdG9yKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHhvcldpdGg7XG4iXX0=