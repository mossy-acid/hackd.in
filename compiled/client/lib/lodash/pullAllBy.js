'use strict';

var baseIteratee = require('./_baseIteratee'),
    basePullAll = require('./_basePullAll');

/**
 * This method is like `_.pullAll` except that it accepts `iteratee` which is
 * invoked for each element of `array` and `values` to generate the criterion
 * by which they're compared. The iteratee is invoked with one argument: (value).
 *
 * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The iteratee invoked per element.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
 *
 * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
 * console.log(array);
 * // => [{ 'x': 2 }]
 */
function pullAllBy(array, values, iteratee) {
    return array && array.length && values && values.length ? basePullAll(array, values, baseIteratee(iteratee)) : array;
}

module.exports = pullAllBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3B1bGxBbGxCeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxRQUFRLGlCQUFSLENBQW5CO0lBQ0ksY0FBYyxRQUFRLGdCQUFSLENBRGxCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxTQUFTLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsTUFBMUIsRUFBa0MsUUFBbEMsRUFBNEM7QUFDMUMsV0FBUSxTQUFTLE1BQU0sTUFBZixJQUF5QixNQUF6QixJQUFtQyxPQUFPLE1BQTNDLEdBQ0gsWUFBWSxLQUFaLEVBQW1CLE1BQW5CLEVBQTJCLGFBQWEsUUFBYixDQUEzQixDQURHLEdBRUgsS0FGSjtBQUdEOztBQUVELE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJwdWxsQWxsQnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgYmFzZVB1bGxBbGwgPSByZXF1aXJlKCcuL19iYXNlUHVsbEFsbCcpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ucHVsbEFsbGAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgaXRlcmF0ZWVgIHdoaWNoIGlzXG4gKiBpbnZva2VkIGZvciBlYWNoIGVsZW1lbnQgb2YgYGFycmF5YCBhbmQgYHZhbHVlc2AgdG8gZ2VuZXJhdGUgdGhlIGNyaXRlcmlvblxuICogYnkgd2hpY2ggdGhleSdyZSBjb21wYXJlZC4gVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6ICh2YWx1ZSkuXG4gKlxuICogKipOb3RlOioqIFVubGlrZSBgXy5kaWZmZXJlbmNlQnlgLCB0aGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gcmVtb3ZlLlxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV1cbiAqICBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXkgPSBbeyAneCc6IDEgfSwgeyAneCc6IDIgfSwgeyAneCc6IDMgfSwgeyAneCc6IDEgfV07XG4gKlxuICogXy5wdWxsQWxsQnkoYXJyYXksIFt7ICd4JzogMSB9LCB7ICd4JzogMyB9XSwgJ3gnKTtcbiAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAqIC8vID0+IFt7ICd4JzogMiB9XVxuICovXG5mdW5jdGlvbiBwdWxsQWxsQnkoYXJyYXksIHZhbHVlcywgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGggJiYgdmFsdWVzICYmIHZhbHVlcy5sZW5ndGgpXG4gICAgPyBiYXNlUHVsbEFsbChhcnJheSwgdmFsdWVzLCBiYXNlSXRlcmF0ZWUoaXRlcmF0ZWUpKVxuICAgIDogYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHVsbEFsbEJ5O1xuIl19