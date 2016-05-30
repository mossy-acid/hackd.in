'use strict';

var baseInvoke = require('./_baseInvoke'),
    rest = require('./rest');

/**
 * Invokes the method at `path` of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {...*} [args] The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
 *
 * _.invoke(object, 'a[0].b.c.slice', 1, 3);
 * // => [2, 3]
 */
var invoke = rest(baseInvoke);

module.exports = invoke;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ludm9rZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGVBQVIsQ0FBakI7SUFDSSxPQUFPLFFBQVEsUUFBUixDQURYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQSxJQUFJLFNBQVMsS0FBSyxVQUFMLENBQWI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6Imludm9rZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlSW52b2tlID0gcmVxdWlyZSgnLi9fYmFzZUludm9rZScpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyoqXG4gKiBJbnZva2VzIHRoZSBtZXRob2QgYXQgYHBhdGhgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBtZXRob2QgdG8gaW52b2tlLlxuICogQHBhcmFtIHsuLi4qfSBbYXJnc10gVGhlIGFyZ3VtZW50cyB0byBpbnZva2UgdGhlIG1ldGhvZCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgaW52b2tlZCBtZXRob2QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogW3sgJ2InOiB7ICdjJzogWzEsIDIsIDMsIDRdIH0gfV0gfTtcbiAqXG4gKiBfLmludm9rZShvYmplY3QsICdhWzBdLmIuYy5zbGljZScsIDEsIDMpO1xuICogLy8gPT4gWzIsIDNdXG4gKi9cbnZhciBpbnZva2UgPSByZXN0KGJhc2VJbnZva2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludm9rZTtcbiJdfQ==