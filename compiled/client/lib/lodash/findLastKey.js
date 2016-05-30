'use strict';

var baseFindKey = require('./_baseFindKey'),
    baseForOwnRight = require('./_baseForOwnRight'),
    baseIteratee = require('./_baseIteratee');

/**
 * This method is like `_.findKey` except that it iterates over elements of
 * a collection in the opposite order.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Object
 * @param {Object} object The object to search.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per iteration.
 * @returns {string|undefined} Returns the key of the matched element,
 *  else `undefined`.
 * @example
 *
 * var users = {
 *   'barney':  { 'age': 36, 'active': true },
 *   'fred':    { 'age': 40, 'active': false },
 *   'pebbles': { 'age': 1,  'active': true }
 * };
 *
 * _.findLastKey(users, function(o) { return o.age < 40; });
 * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.findLastKey(users, { 'age': 36, 'active': true });
 * // => 'barney'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findLastKey(users, ['active', false]);
 * // => 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.findLastKey(users, 'active');
 * // => 'pebbles'
 */
function findLastKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate, 3), baseForOwnRight);
}

module.exports = findLastKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZpbmRMYXN0S2V5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7SUFDSSxrQkFBa0IsUUFBUSxvQkFBUixDQUR0QjtJQUVJLGVBQWUsUUFBUSxpQkFBUixDQUZuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3Q0EsU0FBUyxXQUFULENBQXFCLE1BQXJCLEVBQTZCLFNBQTdCLEVBQXdDO0FBQ3RDLFNBQU8sWUFBWSxNQUFaLEVBQW9CLGFBQWEsU0FBYixFQUF3QixDQUF4QixDQUFwQixFQUFnRCxlQUFoRCxDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFdBQWpCIiwiZmlsZSI6ImZpbmRMYXN0S2V5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VGaW5kS2V5ID0gcmVxdWlyZSgnLi9fYmFzZUZpbmRLZXknKSxcbiAgICBiYXNlRm9yT3duUmlnaHQgPSByZXF1aXJlKCcuL19iYXNlRm9yT3duUmlnaHQnKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmZpbmRLZXlgIGV4Y2VwdCB0aGF0IGl0IGl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2ZcbiAqIGEgY29sbGVjdGlvbiBpbiB0aGUgb3Bwb3NpdGUgb3JkZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XVxuICogIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7c3RyaW5nfHVuZGVmaW5lZH0gUmV0dXJucyB0aGUga2V5IG9mIHRoZSBtYXRjaGVkIGVsZW1lbnQsXG4gKiAgZWxzZSBgdW5kZWZpbmVkYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0ge1xuICogICAnYmFybmV5JzogIHsgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9LFxuICogICAnZnJlZCc6ICAgIHsgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfSxcbiAqICAgJ3BlYmJsZXMnOiB7ICdhZ2UnOiAxLCAgJ2FjdGl2ZSc6IHRydWUgfVxuICogfTtcbiAqXG4gKiBfLmZpbmRMYXN0S2V5KHVzZXJzLCBmdW5jdGlvbihvKSB7IHJldHVybiBvLmFnZSA8IDQwOyB9KTtcbiAqIC8vID0+IHJldHVybnMgJ3BlYmJsZXMnIGFzc3VtaW5nIGBfLmZpbmRLZXlgIHJldHVybnMgJ2Jhcm5leSdcbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kTGFzdEtleSh1c2VycywgeyAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH0pO1xuICogLy8gPT4gJ2Jhcm5leSdcbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc1Byb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbmRMYXN0S2V5KHVzZXJzLCBbJ2FjdGl2ZScsIGZhbHNlXSk7XG4gKiAvLyA9PiAnZnJlZCdcbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZExhc3RLZXkodXNlcnMsICdhY3RpdmUnKTtcbiAqIC8vID0+ICdwZWJibGVzJ1xuICovXG5mdW5jdGlvbiBmaW5kTGFzdEtleShvYmplY3QsIHByZWRpY2F0ZSkge1xuICByZXR1cm4gYmFzZUZpbmRLZXkob2JqZWN0LCBiYXNlSXRlcmF0ZWUocHJlZGljYXRlLCAzKSwgYmFzZUZvck93blJpZ2h0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kTGFzdEtleTtcbiJdfQ==