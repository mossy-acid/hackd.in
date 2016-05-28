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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZpbmRMYXN0S2V5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLGtCQUFrQixRQUFRLG9CQUFSLENBQWxCO0lBQ0EsZUFBZSxRQUFRLGlCQUFSLENBQWY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0NKLFNBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixTQUE3QixFQUF3QztBQUN0QyxTQUFPLFlBQVksTUFBWixFQUFvQixhQUFhLFNBQWIsRUFBd0IsQ0FBeEIsQ0FBcEIsRUFBZ0QsZUFBaEQsQ0FBUCxDQURzQztDQUF4Qzs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoiZmluZExhc3RLZXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUZpbmRLZXkgPSByZXF1aXJlKCcuL19iYXNlRmluZEtleScpLFxuICAgIGJhc2VGb3JPd25SaWdodCA9IHJlcXVpcmUoJy4vX2Jhc2VGb3JPd25SaWdodCcpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZmluZEtleWAgZXhjZXB0IHRoYXQgaXQgaXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZlxuICogYSBjb2xsZWN0aW9uIGluIHRoZSBvcHBvc2l0ZSBvcmRlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gc2VhcmNoLlxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbcHJlZGljYXRlPV8uaWRlbnRpdHldXG4gKiAgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtzdHJpbmd8dW5kZWZpbmVkfSBSZXR1cm5zIHRoZSBrZXkgb2YgdGhlIG1hdGNoZWQgZWxlbWVudCxcbiAqICBlbHNlIGB1bmRlZmluZWRgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSB7XG4gKiAgICdiYXJuZXknOiAgeyAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH0sXG4gKiAgICdmcmVkJzogICAgeyAnYWdlJzogNDAsICdhY3RpdmUnOiBmYWxzZSB9LFxuICogICAncGViYmxlcyc6IHsgJ2FnZSc6IDEsICAnYWN0aXZlJzogdHJ1ZSB9XG4gKiB9O1xuICpcbiAqIF8uZmluZExhc3RLZXkodXNlcnMsIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG8uYWdlIDwgNDA7IH0pO1xuICogLy8gPT4gcmV0dXJucyAncGViYmxlcycgYXNzdW1pbmcgYF8uZmluZEtleWAgcmV0dXJucyAnYmFybmV5J1xuICpcbiAqIC8vIFRoZSBgXy5tYXRjaGVzYCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbmRMYXN0S2V5KHVzZXJzLCB7ICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IHRydWUgfSk7XG4gKiAvLyA9PiAnYmFybmV5J1xuICpcbiAqIC8vIFRoZSBgXy5tYXRjaGVzUHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZExhc3RLZXkodXNlcnMsIFsnYWN0aXZlJywgZmFsc2VdKTtcbiAqIC8vID0+ICdmcmVkJ1xuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kTGFzdEtleSh1c2VycywgJ2FjdGl2ZScpO1xuICogLy8gPT4gJ3BlYmJsZXMnXG4gKi9cbmZ1bmN0aW9uIGZpbmRMYXN0S2V5KG9iamVjdCwgcHJlZGljYXRlKSB7XG4gIHJldHVybiBiYXNlRmluZEtleShvYmplY3QsIGJhc2VJdGVyYXRlZShwcmVkaWNhdGUsIDMpLCBiYXNlRm9yT3duUmlnaHQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRMYXN0S2V5O1xuIl19