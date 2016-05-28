'use strict';

var baseClone = require('./_baseClone'),
    baseIteratee = require('./_baseIteratee');

/**
 * Creates a function that invokes `func` with the arguments of the created
 * function. If `func` is a property name, the created function returns the
 * property value for a given element. If `func` is an array or object, the
 * created function returns `true` for elements that contain the equivalent
 * source properties, otherwise it returns `false`.
 *
 * @static
 * @since 4.0.0
 * @memberOf _
 * @category Util
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @returns {Function} Returns the callback.
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
 * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, _.iteratee(['user', 'fred']));
 * // => [{ 'user': 'fred', 'age': 40 }]
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, _.iteratee('user'));
 * // => ['barney', 'fred']
 *
 * // Create custom iteratee shorthands.
 * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
 *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
 *     return func.test(string);
 *   };
 * });
 *
 * _.filter(['abc', 'def'], /ef/);
 * // => ['def']
 */
function iteratee(func) {
  return baseIteratee(typeof func == 'function' ? func : baseClone(func, true));
}

module.exports = iteratee;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2l0ZXJhdGVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsZUFBZSxRQUFRLGlCQUFSLENBQWY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNENKLFNBQVMsUUFBVCxDQUFrQixJQUFsQixFQUF3QjtBQUN0QixTQUFPLGFBQWEsT0FBTyxJQUFQLElBQWUsVUFBZixHQUE0QixJQUE1QixHQUFtQyxVQUFVLElBQVYsRUFBZ0IsSUFBaEIsQ0FBbkMsQ0FBcEIsQ0FEc0I7Q0FBeEI7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6Iml0ZXJhdGVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VDbG9uZSA9IHJlcXVpcmUoJy4vX2Jhc2VDbG9uZScpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggdGhlIGFyZ3VtZW50cyBvZiB0aGUgY3JlYXRlZFxuICogZnVuY3Rpb24uIElmIGBmdW5jYCBpcyBhIHByb3BlcnR5IG5hbWUsIHRoZSBjcmVhdGVkIGZ1bmN0aW9uIHJldHVybnMgdGhlXG4gKiBwcm9wZXJ0eSB2YWx1ZSBmb3IgYSBnaXZlbiBlbGVtZW50LiBJZiBgZnVuY2AgaXMgYW4gYXJyYXkgb3Igb2JqZWN0LCB0aGVcbiAqIGNyZWF0ZWQgZnVuY3Rpb24gcmV0dXJucyBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgY29udGFpbiB0aGUgZXF1aXZhbGVudFxuICogc291cmNlIHByb3BlcnRpZXMsIG90aGVyd2lzZSBpdCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDQuMC4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gW2Z1bmM9Xy5pZGVudGl0eV0gVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBjYWxsYmFjay5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY2FsbGJhY2suXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH0sXG4gKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfVxuICogXTtcbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maWx0ZXIodXNlcnMsIF8uaXRlcmF0ZWUoeyAndXNlcic6ICdiYXJuZXknLCAnYWN0aXZlJzogdHJ1ZSB9KSk7XG4gKiAvLyA9PiBbeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH1dXG4gKlxuICogLy8gVGhlIGBfLm1hdGNoZXNQcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maWx0ZXIodXNlcnMsIF8uaXRlcmF0ZWUoWyd1c2VyJywgJ2ZyZWQnXSkpO1xuICogLy8gPT4gW3sgJ3VzZXInOiAnZnJlZCcsICdhZ2UnOiA0MCB9XVxuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5tYXAodXNlcnMsIF8uaXRlcmF0ZWUoJ3VzZXInKSk7XG4gKiAvLyA9PiBbJ2Jhcm5leScsICdmcmVkJ11cbiAqXG4gKiAvLyBDcmVhdGUgY3VzdG9tIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKiBfLml0ZXJhdGVlID0gXy53cmFwKF8uaXRlcmF0ZWUsIGZ1bmN0aW9uKGl0ZXJhdGVlLCBmdW5jKSB7XG4gKiAgIHJldHVybiAhXy5pc1JlZ0V4cChmdW5jKSA/IGl0ZXJhdGVlKGZ1bmMpIDogZnVuY3Rpb24oc3RyaW5nKSB7XG4gKiAgICAgcmV0dXJuIGZ1bmMudGVzdChzdHJpbmcpO1xuICogICB9O1xuICogfSk7XG4gKlxuICogXy5maWx0ZXIoWydhYmMnLCAnZGVmJ10sIC9lZi8pO1xuICogLy8gPT4gWydkZWYnXVxuICovXG5mdW5jdGlvbiBpdGVyYXRlZShmdW5jKSB7XG4gIHJldHVybiBiYXNlSXRlcmF0ZWUodHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJyA/IGZ1bmMgOiBiYXNlQ2xvbmUoZnVuYywgdHJ1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGl0ZXJhdGVlO1xuIl19