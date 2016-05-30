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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3hvcldpdGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFsQjtJQUNJLFVBQVUsUUFBUSxZQUFSLENBRGQ7SUFFSSxvQkFBb0IsUUFBUSxxQkFBUixDQUZ4QjtJQUdJLE9BQU8sUUFBUSxRQUFSLENBSFg7SUFJSSxPQUFPLFFBQVEsUUFBUixDQUpYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQUksVUFBVSxLQUFLLFVBQVMsTUFBVCxFQUFpQjtBQUNsQyxNQUFJLGFBQWEsS0FBSyxNQUFMLENBQWpCO0FBQ0EsTUFBSSxrQkFBa0IsVUFBbEIsQ0FBSixFQUFtQztBQUNqQyxpQkFBYSxTQUFiO0FBQ0Q7QUFDRCxTQUFPLFFBQVEsWUFBWSxNQUFaLEVBQW9CLGlCQUFwQixDQUFSLEVBQWdELFNBQWhELEVBQTJELFVBQTNELENBQVA7QUFDRCxDQU5hLENBQWQ7O0FBUUEsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6InhvcldpdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXJyYXlGaWx0ZXIgPSByZXF1aXJlKCcuL19hcnJheUZpbHRlcicpLFxuICAgIGJhc2VYb3IgPSByZXF1aXJlKCcuL19iYXNlWG9yJyksXG4gICAgaXNBcnJheUxpa2VPYmplY3QgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlT2JqZWN0JyksXG4gICAgbGFzdCA9IHJlcXVpcmUoJy4vbGFzdCcpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnhvcmAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgY29tcGFyYXRvcmAgd2hpY2ggaXNcbiAqIGludm9rZWQgdG8gY29tcGFyZSBlbGVtZW50cyBvZiBgYXJyYXlzYC4gVGhlIGNvbXBhcmF0b3IgaXMgaW52b2tlZCB3aXRoXG4gKiB0d28gYXJndW1lbnRzOiAoYXJyVmFsLCBvdGhWYWwpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHsuLi5BcnJheX0gW2FycmF5c10gVGhlIGFycmF5cyB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmF0b3JdIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBmaWx0ZXJlZCB2YWx1ZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW3sgJ3gnOiAxLCAneSc6IDIgfSwgeyAneCc6IDIsICd5JzogMSB9XTtcbiAqIHZhciBvdGhlcnMgPSBbeyAneCc6IDEsICd5JzogMSB9LCB7ICd4JzogMSwgJ3knOiAyIH1dO1xuICpcbiAqIF8ueG9yV2l0aChvYmplY3RzLCBvdGhlcnMsIF8uaXNFcXVhbCk7XG4gKiAvLyA9PiBbeyAneCc6IDIsICd5JzogMSB9LCB7ICd4JzogMSwgJ3knOiAxIH1dXG4gKi9cbnZhciB4b3JXaXRoID0gcmVzdChmdW5jdGlvbihhcnJheXMpIHtcbiAgdmFyIGNvbXBhcmF0b3IgPSBsYXN0KGFycmF5cyk7XG4gIGlmIChpc0FycmF5TGlrZU9iamVjdChjb21wYXJhdG9yKSkge1xuICAgIGNvbXBhcmF0b3IgPSB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIGJhc2VYb3IoYXJyYXlGaWx0ZXIoYXJyYXlzLCBpc0FycmF5TGlrZU9iamVjdCksIHVuZGVmaW5lZCwgY29tcGFyYXRvcik7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB4b3JXaXRoO1xuIl19