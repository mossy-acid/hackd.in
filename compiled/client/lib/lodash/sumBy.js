'use strict';

var baseIteratee = require('./_baseIteratee'),
    baseSum = require('./_baseSum');

/**
 * This method is like `_.sum` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the value to be summed.
 * The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The iteratee invoked per element.
 * @returns {number} Returns the sum.
 * @example
 *
 * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
 *
 * _.sumBy(objects, function(o) { return o.n; });
 * // => 20
 *
 * // The `_.property` iteratee shorthand.
 * _.sumBy(objects, 'n');
 * // => 20
 */
function sumBy(array, iteratee) {
    return array && array.length ? baseSum(array, baseIteratee(iteratee)) : 0;
}

module.exports = sumBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3N1bUJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxlQUFlLFFBQVEsaUJBQVIsQ0FBbkI7SUFDSSxVQUFVLFFBQVEsWUFBUixDQURkOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxTQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCLFFBQXRCLEVBQWdDO0FBQzlCLFdBQVEsU0FBUyxNQUFNLE1BQWhCLEdBQ0gsUUFBUSxLQUFSLEVBQWUsYUFBYSxRQUFiLENBQWYsQ0FERyxHQUVILENBRko7QUFHRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsS0FBakIiLCJmaWxlIjoic3VtQnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgYmFzZVN1bSA9IHJlcXVpcmUoJy4vX2Jhc2VTdW0nKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnN1bWAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBgaXRlcmF0ZWVgIHdoaWNoIGlzXG4gKiBpbnZva2VkIGZvciBlYWNoIGVsZW1lbnQgaW4gYGFycmF5YCB0byBnZW5lcmF0ZSB0aGUgdmFsdWUgdG8gYmUgc3VtbWVkLlxuICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6ICh2YWx1ZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IE1hdGhcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtpdGVyYXRlZT1fLmlkZW50aXR5XVxuICogIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgc3VtLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IFt7ICduJzogNCB9LCB7ICduJzogMiB9LCB7ICduJzogOCB9LCB7ICduJzogNiB9XTtcbiAqXG4gKiBfLnN1bUJ5KG9iamVjdHMsIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG8ubjsgfSk7XG4gKiAvLyA9PiAyMFxuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5zdW1CeShvYmplY3RzLCAnbicpO1xuICogLy8gPT4gMjBcbiAqL1xuZnVuY3Rpb24gc3VtQnkoYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoKVxuICAgID8gYmFzZVN1bShhcnJheSwgYmFzZUl0ZXJhdGVlKGl0ZXJhdGVlKSlcbiAgICA6IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3VtQnk7XG4iXX0=