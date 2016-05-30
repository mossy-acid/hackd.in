'use strict';

var baseForRight = require('./_baseForRight'),
    baseIteratee = require('./_baseIteratee'),
    keysIn = require('./keysIn');

/**
 * This method is like `_.forIn` except that it iterates over properties of
 * `object` in the opposite order.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forInRight(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
 */
function forInRight(object, iteratee) {
    return object == null ? object : baseForRight(object, baseIteratee(iteratee, 3), keysIn);
}

module.exports = forInRight;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZvckluUmlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGVBQWUsUUFBUSxpQkFBUixDQUFuQjtJQUNJLGVBQWUsUUFBUSxpQkFBUixDQURuQjtJQUVJLFNBQVMsUUFBUSxVQUFSLENBRmI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4QkEsU0FBUyxVQUFULENBQW9CLE1BQXBCLEVBQTRCLFFBQTVCLEVBQXNDO0FBQ3BDLFdBQU8sVUFBVSxJQUFWLEdBQ0gsTUFERyxHQUVILGFBQWEsTUFBYixFQUFxQixhQUFhLFFBQWIsRUFBdUIsQ0FBdkIsQ0FBckIsRUFBZ0QsTUFBaEQsQ0FGSjtBQUdEOztBQUVELE9BQU8sT0FBUCxHQUFpQixVQUFqQiIsImZpbGUiOiJmb3JJblJpZ2h0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VGb3JSaWdodCA9IHJlcXVpcmUoJy4vX2Jhc2VGb3JSaWdodCcpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5mb3JJbmAgZXhjZXB0IHRoYXQgaXQgaXRlcmF0ZXMgb3ZlciBwcm9wZXJ0aWVzIG9mXG4gKiBgb2JqZWN0YCBpbiB0aGUgb3Bwb3NpdGUgb3JkZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBzZWUgXy5mb3JJblxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmZvckluUmlnaHQobmV3IEZvbywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICogICBjb25zb2xlLmxvZyhrZXkpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzICdjJywgJ2InLCB0aGVuICdhJyBhc3N1bWluZyBgXy5mb3JJbmAgbG9ncyAnYScsICdiJywgdGhlbiAnYycuXG4gKi9cbmZ1bmN0aW9uIGZvckluUmlnaHQob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGxcbiAgICA/IG9iamVjdFxuICAgIDogYmFzZUZvclJpZ2h0KG9iamVjdCwgYmFzZUl0ZXJhdGVlKGl0ZXJhdGVlLCAzKSwga2V5c0luKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmb3JJblJpZ2h0O1xuIl19