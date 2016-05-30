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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3B1bGxBbGxXaXRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCSixTQUFTLFdBQVQsQ0FBcUIsS0FBckIsRUFBNEIsTUFBNUIsRUFBb0MsVUFBcEMsRUFBZ0Q7QUFDOUMsU0FBTyxLQUFDLElBQVMsTUFBTSxNQUFOLElBQWdCLE1BQXpCLElBQW1DLE9BQU8sTUFBUCxHQUN2QyxZQUFZLEtBQVosRUFBbUIsTUFBbkIsRUFBMkIsU0FBM0IsRUFBc0MsVUFBdEMsQ0FERyxHQUVILEtBRkcsQ0FEdUM7Q0FBaEQ7O0FBTUEsT0FBTyxPQUFQLEdBQWlCLFdBQWpCIiwiZmlsZSI6InB1bGxBbGxXaXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VQdWxsQWxsID0gcmVxdWlyZSgnLi9fYmFzZVB1bGxBbGwnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnB1bGxBbGxgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYGNvbXBhcmF0b3JgIHdoaWNoXG4gKiBpcyBpbnZva2VkIHRvIGNvbXBhcmUgZWxlbWVudHMgb2YgYGFycmF5YCB0byBgdmFsdWVzYC4gVGhlIGNvbXBhcmF0b3IgaXNcbiAqIGludm9rZWQgd2l0aCB0d28gYXJndW1lbnRzOiAoYXJyVmFsLCBvdGhWYWwpLlxuICpcbiAqICoqTm90ZToqKiBVbmxpa2UgYF8uZGlmZmVyZW5jZVdpdGhgLCB0aGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjYuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmF0b3JdIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5ID0gW3sgJ3gnOiAxLCAneSc6IDIgfSwgeyAneCc6IDMsICd5JzogNCB9LCB7ICd4JzogNSwgJ3knOiA2IH1dO1xuICpcbiAqIF8ucHVsbEFsbFdpdGgoYXJyYXksIFt7ICd4JzogMywgJ3knOiA0IH1dLCBfLmlzRXF1YWwpO1xuICogY29uc29sZS5sb2coYXJyYXkpO1xuICogLy8gPT4gW3sgJ3gnOiAxLCAneSc6IDIgfSwgeyAneCc6IDUsICd5JzogNiB9XVxuICovXG5mdW5jdGlvbiBwdWxsQWxsV2l0aChhcnJheSwgdmFsdWVzLCBjb21wYXJhdG9yKSB7XG4gIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoICYmIHZhbHVlcyAmJiB2YWx1ZXMubGVuZ3RoKVxuICAgID8gYmFzZVB1bGxBbGwoYXJyYXksIHZhbHVlcywgdW5kZWZpbmVkLCBjb21wYXJhdG9yKVxuICAgIDogYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHVsbEFsbFdpdGg7XG4iXX0=