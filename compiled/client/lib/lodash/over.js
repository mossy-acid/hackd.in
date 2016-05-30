'use strict';

var arrayMap = require('./_arrayMap'),
    createOver = require('./_createOver');

/**
 * Creates a function that invokes `iteratees` with the arguments it receives
 * and returns their results.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
 *  [iteratees=[_.identity]] The iteratees to invoke.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var func = _.over([Math.max, Math.min]);
 *
 * func(1, 2, 3, 4);
 * // => [4, 1]
 */
var over = createOver(arrayMap);

module.exports = over;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL292ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxhQUFSLENBQWY7SUFDSSxhQUFhLFFBQVEsZUFBUixDQURqQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkEsSUFBSSxPQUFPLFdBQVcsUUFBWCxDQUFYOztBQUVBLE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJvdmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBjcmVhdGVPdmVyID0gcmVxdWlyZSgnLi9fY3JlYXRlT3ZlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGl0ZXJhdGVlc2Agd2l0aCB0aGUgYXJndW1lbnRzIGl0IHJlY2VpdmVzXG4gKiBhbmQgcmV0dXJucyB0aGVpciByZXN1bHRzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0gey4uLihBcnJheXxBcnJheVtdfEZ1bmN0aW9ufEZ1bmN0aW9uW118T2JqZWN0fE9iamVjdFtdfHN0cmluZ3xzdHJpbmdbXSl9XG4gKiAgW2l0ZXJhdGVlcz1bXy5pZGVudGl0eV1dIFRoZSBpdGVyYXRlZXMgdG8gaW52b2tlLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBmdW5jID0gXy5vdmVyKFtNYXRoLm1heCwgTWF0aC5taW5dKTtcbiAqXG4gKiBmdW5jKDEsIDIsIDMsIDQpO1xuICogLy8gPT4gWzQsIDFdXG4gKi9cbnZhciBvdmVyID0gY3JlYXRlT3ZlcihhcnJheU1hcCk7XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlcjtcbiJdfQ==