'use strict';

var baseInvoke = require('./_baseInvoke'),
    rest = require('./rest');

/**
 * Creates a function that invokes the method at `path` of a given object.
 * Any additional arguments are provided to the invoked method.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Util
 * @param {Array|string} path The path of the method to invoke.
 * @param {...*} [args] The arguments to invoke the method with.
 * @returns {Function} Returns the new invoker function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': _.constant(2) } },
 *   { 'a': { 'b': _.constant(1) } }
 * ];
 *
 * _.map(objects, _.method('a.b'));
 * // => [2, 1]
 *
 * _.map(objects, _.method(['a', 'b']));
 * // => [2, 1]
 */
var method = rest(function (path, args) {
  return function (object) {
    return baseInvoke(object, path, args);
  };
});

module.exports = method;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL21ldGhvZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGVBQVIsQ0FBYjtJQUNBLE9BQU8sUUFBUSxRQUFSLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJKLElBQUksU0FBUyxLQUFLLFVBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUI7QUFDckMsU0FBTyxVQUFTLE1BQVQsRUFBaUI7QUFDdEIsV0FBTyxXQUFXLE1BQVgsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FBUCxDQURzQjtHQUFqQixDQUQ4QjtDQUFyQixDQUFkOztBQU1KLE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJtZXRob2QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUludm9rZSA9IHJlcXVpcmUoJy4vX2Jhc2VJbnZva2UnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyB0aGUgbWV0aG9kIGF0IGBwYXRoYCBvZiBhIGdpdmVuIG9iamVjdC5cbiAqIEFueSBhZGRpdGlvbmFsIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQgdG8gdGhlIGludm9rZWQgbWV0aG9kLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy43LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgbWV0aG9kIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Li4uKn0gW2FyZ3NdIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIHRoZSBtZXRob2Qgd2l0aC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGludm9rZXIgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW1xuICogICB7ICdhJzogeyAnYic6IF8uY29uc3RhbnQoMikgfSB9LFxuICogICB7ICdhJzogeyAnYic6IF8uY29uc3RhbnQoMSkgfSB9XG4gKiBdO1xuICpcbiAqIF8ubWFwKG9iamVjdHMsIF8ubWV0aG9kKCdhLmInKSk7XG4gKiAvLyA9PiBbMiwgMV1cbiAqXG4gKiBfLm1hcChvYmplY3RzLCBfLm1ldGhvZChbJ2EnLCAnYiddKSk7XG4gKiAvLyA9PiBbMiwgMV1cbiAqL1xudmFyIG1ldGhvZCA9IHJlc3QoZnVuY3Rpb24ocGF0aCwgYXJncykge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIGJhc2VJbnZva2Uob2JqZWN0LCBwYXRoLCBhcmdzKTtcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1ldGhvZDtcbiJdfQ==