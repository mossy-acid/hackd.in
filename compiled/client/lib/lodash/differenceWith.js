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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2RpZmZlcmVuY2VXaXRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxpQkFBaUIsUUFBUSxtQkFBUixDQUFqQjtJQUNBLGNBQWMsUUFBUSxnQkFBUixDQUFkO0lBQ0Esb0JBQW9CLFFBQVEscUJBQVIsQ0FBcEI7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkosSUFBSSxpQkFBaUIsS0FBSyxVQUFTLEtBQVQsRUFBZ0IsTUFBaEIsRUFBd0I7QUFDaEQsTUFBSSxhQUFhLEtBQUssTUFBTCxDQUFiLENBRDRDO0FBRWhELE1BQUksa0JBQWtCLFVBQWxCLENBQUosRUFBbUM7QUFDakMsaUJBQWEsU0FBYixDQURpQztHQUFuQztBQUdBLFNBQU8sa0JBQWtCLEtBQWxCLElBQ0gsZUFBZSxLQUFmLEVBQXNCLFlBQVksTUFBWixFQUFvQixDQUFwQixFQUF1QixpQkFBdkIsRUFBMEMsSUFBMUMsQ0FBdEIsRUFBdUUsU0FBdkUsRUFBa0YsVUFBbEYsQ0FERyxHQUVILEVBRkcsQ0FMeUM7Q0FBeEIsQ0FBdEI7O0FBVUosT0FBTyxPQUFQLEdBQWlCLGNBQWpCIiwiZmlsZSI6ImRpZmZlcmVuY2VXaXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VEaWZmZXJlbmNlID0gcmVxdWlyZSgnLi9fYmFzZURpZmZlcmVuY2UnKSxcbiAgICBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgaXNBcnJheUxpa2VPYmplY3QgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlT2JqZWN0JyksXG4gICAgbGFzdCA9IHJlcXVpcmUoJy4vbGFzdCcpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmRpZmZlcmVuY2VgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYGNvbXBhcmF0b3JgXG4gKiB3aGljaCBpcyBpbnZva2VkIHRvIGNvbXBhcmUgZWxlbWVudHMgb2YgYGFycmF5YCB0byBgdmFsdWVzYC4gUmVzdWx0IHZhbHVlc1xuICogYXJlIGNob3NlbiBmcm9tIHRoZSBmaXJzdCBhcnJheS4gVGhlIGNvbXBhcmF0b3IgaXMgaW52b2tlZCB3aXRoIHR3byBhcmd1bWVudHM6XG4gKiAoYXJyVmFsLCBvdGhWYWwpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0gey4uLkFycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGV4Y2x1ZGUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyYXRvcl0gVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGZpbHRlcmVkIHZhbHVlcy5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBbeyAneCc6IDEsICd5JzogMiB9LCB7ICd4JzogMiwgJ3knOiAxIH1dO1xuICpcbiAqIF8uZGlmZmVyZW5jZVdpdGgob2JqZWN0cywgW3sgJ3gnOiAxLCAneSc6IDIgfV0sIF8uaXNFcXVhbCk7XG4gKiAvLyA9PiBbeyAneCc6IDIsICd5JzogMSB9XVxuICovXG52YXIgZGlmZmVyZW5jZVdpdGggPSByZXN0KGZ1bmN0aW9uKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGNvbXBhcmF0b3IgPSBsYXN0KHZhbHVlcyk7XG4gIGlmIChpc0FycmF5TGlrZU9iamVjdChjb21wYXJhdG9yKSkge1xuICAgIGNvbXBhcmF0b3IgPSB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIGlzQXJyYXlMaWtlT2JqZWN0KGFycmF5KVxuICAgID8gYmFzZURpZmZlcmVuY2UoYXJyYXksIGJhc2VGbGF0dGVuKHZhbHVlcywgMSwgaXNBcnJheUxpa2VPYmplY3QsIHRydWUpLCB1bmRlZmluZWQsIGNvbXBhcmF0b3IpXG4gICAgOiBbXTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRpZmZlcmVuY2VXaXRoO1xuIl19