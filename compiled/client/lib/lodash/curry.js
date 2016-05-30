'use strict';

var createWrapper = require('./_createWrapper');

/** Used to compose bitmasks for wrapper metadata. */
var CURRY_FLAG = 8;

/**
 * Creates a function that accepts arguments of `func` and either invokes
 * `func` returning its result, if at least `arity` number of arguments have
 * been provided, or returns a function that accepts the remaining `func`
 * arguments, and so on. The arity of `func` may be specified if `func.length`
 * is not sufficient.
 *
 * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for provided arguments.
 *
 * **Note:** This method doesn't set the "length" property of curried functions.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Function
 * @param {Function} func The function to curry.
 * @param {number} [arity=func.length] The arity of `func`.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the new curried function.
 * @example
 *
 * var abc = function(a, b, c) {
 *   return [a, b, c];
 * };
 *
 * var curried = _.curry(abc);
 *
 * curried(1)(2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2, 3);
 * // => [1, 2, 3]
 *
 * // Curried with placeholders.
 * curried(1)(_, 3)(2);
 * // => [1, 2, 3]
 */
function curry(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrapper(func, CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curry.placeholder;
  return result;
}

// Assign default placeholders.
curry.placeholder = {};

module.exports = curry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2N1cnJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxnQkFBZ0IsUUFBUSxrQkFBUixDQUFwQjs7O0FBR0EsSUFBSSxhQUFhLENBQWpCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkNBLFNBQVMsS0FBVCxDQUFlLElBQWYsRUFBcUIsS0FBckIsRUFBNEIsS0FBNUIsRUFBbUM7QUFDakMsVUFBUSxRQUFRLFNBQVIsR0FBb0IsS0FBNUI7QUFDQSxNQUFJLFNBQVMsY0FBYyxJQUFkLEVBQW9CLFVBQXBCLEVBQWdDLFNBQWhDLEVBQTJDLFNBQTNDLEVBQXNELFNBQXRELEVBQWlFLFNBQWpFLEVBQTRFLFNBQTVFLEVBQXVGLEtBQXZGLENBQWI7QUFDQSxTQUFPLFdBQVAsR0FBcUIsTUFBTSxXQUEzQjtBQUNBLFNBQU8sTUFBUDtBQUNEOzs7QUFHRCxNQUFNLFdBQU4sR0FBb0IsRUFBcEI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLEtBQWpCIiwiZmlsZSI6ImN1cnJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZVdyYXBwZXIgPSByZXF1aXJlKCcuL19jcmVhdGVXcmFwcGVyJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHdyYXBwZXIgbWV0YWRhdGEuICovXG52YXIgQ1VSUllfRkxBRyA9IDg7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBhcmd1bWVudHMgb2YgYGZ1bmNgIGFuZCBlaXRoZXIgaW52b2tlc1xuICogYGZ1bmNgIHJldHVybmluZyBpdHMgcmVzdWx0LCBpZiBhdCBsZWFzdCBgYXJpdHlgIG51bWJlciBvZiBhcmd1bWVudHMgaGF2ZVxuICogYmVlbiBwcm92aWRlZCwgb3IgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyB0aGUgcmVtYWluaW5nIGBmdW5jYFxuICogYXJndW1lbnRzLCBhbmQgc28gb24uIFRoZSBhcml0eSBvZiBgZnVuY2AgbWF5IGJlIHNwZWNpZmllZCBpZiBgZnVuYy5sZW5ndGhgXG4gKiBpcyBub3Qgc3VmZmljaWVudC5cbiAqXG4gKiBUaGUgYF8uY3VycnkucGxhY2Vob2xkZXJgIHZhbHVlLCB3aGljaCBkZWZhdWx0cyB0byBgX2AgaW4gbW9ub2xpdGhpYyBidWlsZHMsXG4gKiBtYXkgYmUgdXNlZCBhcyBhIHBsYWNlaG9sZGVyIGZvciBwcm92aWRlZCBhcmd1bWVudHMuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGRvZXNuJ3Qgc2V0IHRoZSBcImxlbmd0aFwiIHByb3BlcnR5IG9mIGN1cnJpZWQgZnVuY3Rpb25zLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi4wLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyaXR5PWZ1bmMubGVuZ3RoXSBUaGUgYXJpdHkgb2YgYGZ1bmNgLlxuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGN1cnJpZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhYmMgPSBmdW5jdGlvbihhLCBiLCBjKSB7XG4gKiAgIHJldHVybiBbYSwgYiwgY107XG4gKiB9O1xuICpcbiAqIHZhciBjdXJyaWVkID0gXy5jdXJyeShhYmMpO1xuICpcbiAqIGN1cnJpZWQoMSkoMikoMyk7XG4gKiAvLyA9PiBbMSwgMiwgM11cbiAqXG4gKiBjdXJyaWVkKDEsIDIpKDMpO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKlxuICogY3VycmllZCgxLCAyLCAzKTtcbiAqIC8vID0+IFsxLCAyLCAzXVxuICpcbiAqIC8vIEN1cnJpZWQgd2l0aCBwbGFjZWhvbGRlcnMuXG4gKiBjdXJyaWVkKDEpKF8sIDMpKDIpO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKi9cbmZ1bmN0aW9uIGN1cnJ5KGZ1bmMsIGFyaXR5LCBndWFyZCkge1xuICBhcml0eSA9IGd1YXJkID8gdW5kZWZpbmVkIDogYXJpdHk7XG4gIHZhciByZXN1bHQgPSBjcmVhdGVXcmFwcGVyKGZ1bmMsIENVUlJZX0ZMQUcsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBhcml0eSk7XG4gIHJlc3VsdC5wbGFjZWhvbGRlciA9IGN1cnJ5LnBsYWNlaG9sZGVyO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBBc3NpZ24gZGVmYXVsdCBwbGFjZWhvbGRlcnMuXG5jdXJyeS5wbGFjZWhvbGRlciA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGN1cnJ5O1xuIl19