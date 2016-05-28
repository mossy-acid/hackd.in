'use strict';

var createFlow = require('./_createFlow');

/**
 * Creates a function that returns the result of invoking the given functions
 * with the `this` binding of the created function, where each successive
 * invocation is supplied the return value of the previous.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {...(Function|Function[])} [funcs] Functions to invoke.
 * @returns {Function} Returns the new composite function.
 * @see _.flowRight
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var addSquare = _.flow([_.add, square]);
 * addSquare(1, 2);
 * // => 9
 */
var flow = createFlow();

module.exports = flow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Zsb3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsUUFBUSxlQUFSLENBQWI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCSixJQUFJLE9BQU8sWUFBUDs7QUFFSixPQUFPLE9BQVAsR0FBaUIsSUFBakIiLCJmaWxlIjoiZmxvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVGbG93ID0gcmVxdWlyZSgnLi9fY3JlYXRlRmxvdycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHJlc3VsdCBvZiBpbnZva2luZyB0aGUgZ2l2ZW4gZnVuY3Rpb25zXG4gKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgY3JlYXRlZCBmdW5jdGlvbiwgd2hlcmUgZWFjaCBzdWNjZXNzaXZlXG4gKiBpbnZvY2F0aW9uIGlzIHN1cHBsaWVkIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIHByZXZpb3VzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0gey4uLihGdW5jdGlvbnxGdW5jdGlvbltdKX0gW2Z1bmNzXSBGdW5jdGlvbnMgdG8gaW52b2tlLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29tcG9zaXRlIGZ1bmN0aW9uLlxuICogQHNlZSBfLmZsb3dSaWdodFxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBzcXVhcmUobikge1xuICogICByZXR1cm4gbiAqIG47XG4gKiB9XG4gKlxuICogdmFyIGFkZFNxdWFyZSA9IF8uZmxvdyhbXy5hZGQsIHNxdWFyZV0pO1xuICogYWRkU3F1YXJlKDEsIDIpO1xuICogLy8gPT4gOVxuICovXG52YXIgZmxvdyA9IGNyZWF0ZUZsb3coKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmbG93O1xuIl19