'use strict';

var arrayFilter = require('./_arrayFilter'),
    baseIteratee = require('./_baseIteratee'),
    baseXor = require('./_baseXor'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    last = require('./last'),
    rest = require('./rest');

/**
 * This method is like `_.xor` except that it accepts `iteratee` which is
 * invoked for each element of each `arrays` to generate the criterion by
 * which by which they're compared. The iteratee is invoked with one argument:
 * (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The iteratee invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [1.2, 3.4]
 *
 * // The `_.property` iteratee shorthand.
 * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 2 }]
 */
var xorBy = rest(function (arrays) {
  var iteratee = last(arrays);
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return baseXor(arrayFilter(arrays, isArrayLikeObject), baseIteratee(iteratee));
});

module.exports = xorBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3hvckJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7SUFDSSxlQUFlLFFBQVEsaUJBQVIsQ0FEbkI7SUFFSSxVQUFVLFFBQVEsWUFBUixDQUZkO0lBR0ksb0JBQW9CLFFBQVEscUJBQVIsQ0FIeEI7SUFJSSxPQUFPLFFBQVEsUUFBUixDQUpYO0lBS0ksT0FBTyxRQUFRLFFBQVIsQ0FMWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThCQSxJQUFJLFFBQVEsS0FBSyxVQUFTLE1BQVQsRUFBaUI7QUFDaEMsTUFBSSxXQUFXLEtBQUssTUFBTCxDQUFmO0FBQ0EsTUFBSSxrQkFBa0IsUUFBbEIsQ0FBSixFQUFpQztBQUMvQixlQUFXLFNBQVg7QUFDRDtBQUNELFNBQU8sUUFBUSxZQUFZLE1BQVosRUFBb0IsaUJBQXBCLENBQVIsRUFBZ0QsYUFBYSxRQUFiLENBQWhELENBQVA7QUFDRCxDQU5XLENBQVo7O0FBUUEsT0FBTyxPQUFQLEdBQWlCLEtBQWpCIiwiZmlsZSI6InhvckJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFycmF5RmlsdGVyID0gcmVxdWlyZSgnLi9fYXJyYXlGaWx0ZXInKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBiYXNlWG9yID0gcmVxdWlyZSgnLi9fYmFzZVhvcicpLFxuICAgIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZU9iamVjdCcpLFxuICAgIGxhc3QgPSByZXF1aXJlKCcuL2xhc3QnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy54b3JgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYGl0ZXJhdGVlYCB3aGljaCBpc1xuICogaW52b2tlZCBmb3IgZWFjaCBlbGVtZW50IG9mIGVhY2ggYGFycmF5c2AgdG8gZ2VuZXJhdGUgdGhlIGNyaXRlcmlvbiBieVxuICogd2hpY2ggYnkgd2hpY2ggdGhleSdyZSBjb21wYXJlZC4gVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6XG4gKiAodmFsdWUpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHsuLi5BcnJheX0gW2FycmF5c10gVGhlIGFycmF5cyB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV1cbiAqICBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGZpbHRlcmVkIHZhbHVlcy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy54b3JCeShbMi4xLCAxLjJdLCBbMi4zLCAzLjRdLCBNYXRoLmZsb29yKTtcbiAqIC8vID0+IFsxLjIsIDMuNF1cbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8ueG9yQnkoW3sgJ3gnOiAxIH1dLCBbeyAneCc6IDIgfSwgeyAneCc6IDEgfV0sICd4Jyk7XG4gKiAvLyA9PiBbeyAneCc6IDIgfV1cbiAqL1xudmFyIHhvckJ5ID0gcmVzdChmdW5jdGlvbihhcnJheXMpIHtcbiAgdmFyIGl0ZXJhdGVlID0gbGFzdChhcnJheXMpO1xuICBpZiAoaXNBcnJheUxpa2VPYmplY3QoaXRlcmF0ZWUpKSB7XG4gICAgaXRlcmF0ZWUgPSB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIGJhc2VYb3IoYXJyYXlGaWx0ZXIoYXJyYXlzLCBpc0FycmF5TGlrZU9iamVjdCksIGJhc2VJdGVyYXRlZShpdGVyYXRlZSkpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0geG9yQnk7XG4iXX0=