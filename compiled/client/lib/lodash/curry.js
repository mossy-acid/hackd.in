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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2N1cnJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxnQkFBZ0IsUUFBUSxrQkFBUixDQUFoQjs7O0FBR0osSUFBSSxhQUFhLENBQWI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQ0osU0FBUyxLQUFULENBQWUsSUFBZixFQUFxQixLQUFyQixFQUE0QixLQUE1QixFQUFtQztBQUNqQyxVQUFRLFFBQVEsU0FBUixHQUFvQixLQUFwQixDQUR5QjtBQUVqQyxNQUFJLFNBQVMsY0FBYyxJQUFkLEVBQW9CLFVBQXBCLEVBQWdDLFNBQWhDLEVBQTJDLFNBQTNDLEVBQXNELFNBQXRELEVBQWlFLFNBQWpFLEVBQTRFLFNBQTVFLEVBQXVGLEtBQXZGLENBQVQsQ0FGNkI7QUFHakMsU0FBTyxXQUFQLEdBQXFCLE1BQU0sV0FBTixDQUhZO0FBSWpDLFNBQU8sTUFBUCxDQUppQztDQUFuQzs7O0FBUUEsTUFBTSxXQUFOLEdBQW9CLEVBQXBCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJjdXJyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVXcmFwcGVyID0gcmVxdWlyZSgnLi9fY3JlYXRlV3JhcHBlcicpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB3cmFwcGVyIG1ldGFkYXRhLiAqL1xudmFyIENVUlJZX0ZMQUcgPSA4O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgYXJndW1lbnRzIG9mIGBmdW5jYCBhbmQgZWl0aGVyIGludm9rZXNcbiAqIGBmdW5jYCByZXR1cm5pbmcgaXRzIHJlc3VsdCwgaWYgYXQgbGVhc3QgYGFyaXR5YCBudW1iZXIgb2YgYXJndW1lbnRzIGhhdmVcbiAqIGJlZW4gcHJvdmlkZWQsIG9yIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgdGhlIHJlbWFpbmluZyBgZnVuY2BcbiAqIGFyZ3VtZW50cywgYW5kIHNvIG9uLiBUaGUgYXJpdHkgb2YgYGZ1bmNgIG1heSBiZSBzcGVjaWZpZWQgaWYgYGZ1bmMubGVuZ3RoYFxuICogaXMgbm90IHN1ZmZpY2llbnQuXG4gKlxuICogVGhlIGBfLmN1cnJ5LnBsYWNlaG9sZGVyYCB2YWx1ZSwgd2hpY2ggZGVmYXVsdHMgdG8gYF9gIGluIG1vbm9saXRoaWMgYnVpbGRzLFxuICogbWF5IGJlIHVzZWQgYXMgYSBwbGFjZWhvbGRlciBmb3IgcHJvdmlkZWQgYXJndW1lbnRzLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBkb2Vzbid0IHNldCB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSBvZiBjdXJyaWVkIGZ1bmN0aW9ucy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuMC4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHBhcmFtIHtudW1iZXJ9IFthcml0eT1mdW5jLmxlbmd0aF0gVGhlIGFyaXR5IG9mIGBmdW5jYC5cbiAqIEBwYXJhbS0ge09iamVjdH0gW2d1YXJkXSBFbmFibGVzIHVzZSBhcyBhbiBpdGVyYXRlZSBmb3IgbWV0aG9kcyBsaWtlIGBfLm1hcGAuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjdXJyaWVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYWJjID0gZnVuY3Rpb24oYSwgYiwgYykge1xuICogICByZXR1cm4gW2EsIGIsIGNdO1xuICogfTtcbiAqXG4gKiB2YXIgY3VycmllZCA9IF8uY3VycnkoYWJjKTtcbiAqXG4gKiBjdXJyaWVkKDEpKDIpKDMpO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKlxuICogY3VycmllZCgxLCAyKSgzKTtcbiAqIC8vID0+IFsxLCAyLCAzXVxuICpcbiAqIGN1cnJpZWQoMSwgMiwgMyk7XG4gKiAvLyA9PiBbMSwgMiwgM11cbiAqXG4gKiAvLyBDdXJyaWVkIHdpdGggcGxhY2Vob2xkZXJzLlxuICogY3VycmllZCgxKShfLCAzKSgyKTtcbiAqIC8vID0+IFsxLCAyLCAzXVxuICovXG5mdW5jdGlvbiBjdXJyeShmdW5jLCBhcml0eSwgZ3VhcmQpIHtcbiAgYXJpdHkgPSBndWFyZCA/IHVuZGVmaW5lZCA6IGFyaXR5O1xuICB2YXIgcmVzdWx0ID0gY3JlYXRlV3JhcHBlcihmdW5jLCBDVVJSWV9GTEFHLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgYXJpdHkpO1xuICByZXN1bHQucGxhY2Vob2xkZXIgPSBjdXJyeS5wbGFjZWhvbGRlcjtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gQXNzaWduIGRlZmF1bHQgcGxhY2Vob2xkZXJzLlxuY3VycnkucGxhY2Vob2xkZXIgPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBjdXJyeTtcbiJdfQ==