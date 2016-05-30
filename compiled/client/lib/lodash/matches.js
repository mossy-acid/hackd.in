'use strict';

var baseClone = require('./_baseClone'),
    baseMatches = require('./_baseMatches');

/**
 * Creates a function that performs a partial deep comparison between a given
 * object and `source`, returning `true` if the given object has equivalent
 * property values, else `false`. The created function is equivalent to
 * `_.isMatch` with a `source` partially applied.
 *
 * **Note:** This method supports comparing the same values as `_.isEqual`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, _.matches({ 'age': 40, 'active': false }));
 * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
 */
function matches(source) {
  return baseMatches(baseClone(source, true));
}

module.exports = matches;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL21hdGNoZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxjQUFSLENBQVo7SUFDQSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkosU0FBUyxPQUFULENBQWlCLE1BQWpCLEVBQXlCO0FBQ3ZCLFNBQU8sWUFBWSxVQUFVLE1BQVYsRUFBa0IsSUFBbEIsQ0FBWixDQUFQLENBRHVCO0NBQXpCOztBQUlBLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJtYXRjaGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VDbG9uZSA9IHJlcXVpcmUoJy4vX2Jhc2VDbG9uZScpLFxuICAgIGJhc2VNYXRjaGVzID0gcmVxdWlyZSgnLi9fYmFzZU1hdGNoZXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBwZXJmb3JtcyBhIHBhcnRpYWwgZGVlcCBjb21wYXJpc29uIGJldHdlZW4gYSBnaXZlblxuICogb2JqZWN0IGFuZCBgc291cmNlYCwgcmV0dXJuaW5nIGB0cnVlYCBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGhhcyBlcXVpdmFsZW50XG4gKiBwcm9wZXJ0eSB2YWx1ZXMsIGVsc2UgYGZhbHNlYC4gVGhlIGNyZWF0ZWQgZnVuY3Rpb24gaXMgZXF1aXZhbGVudCB0b1xuICogYF8uaXNNYXRjaGAgd2l0aCBhIGBzb3VyY2VgIHBhcnRpYWxseSBhcHBsaWVkLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBzdXBwb3J0cyBjb21wYXJpbmcgdGhlIHNhbWUgdmFsdWVzIGFzIGBfLmlzRXF1YWxgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IHRydWUgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWdlJzogNDAsICdhY3RpdmUnOiBmYWxzZSB9XG4gKiBdO1xuICpcbiAqIF8uZmlsdGVyKHVzZXJzLCBfLm1hdGNoZXMoeyAnYWdlJzogNDAsICdhY3RpdmUnOiBmYWxzZSB9KSk7XG4gKiAvLyA9PiBbeyAndXNlcic6ICdmcmVkJywgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfV1cbiAqL1xuZnVuY3Rpb24gbWF0Y2hlcyhzb3VyY2UpIHtcbiAgcmV0dXJuIGJhc2VNYXRjaGVzKGJhc2VDbG9uZShzb3VyY2UsIHRydWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaGVzO1xuIl19