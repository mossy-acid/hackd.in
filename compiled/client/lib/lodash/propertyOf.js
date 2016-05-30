'use strict';

var baseGet = require('./_baseGet');

/**
 * The opposite of `_.property`; this method creates a function that returns
 * the value at a given path of `object`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var array = [0, 1, 2],
 *     object = { 'a': array, 'b': array, 'c': array };
 *
 * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
 * // => [2, 0]
 *
 * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
 * // => [2, 0]
 */
function propertyOf(object) {
  return function (path) {
    return object == null ? undefined : baseGet(object, path);
  };
}

module.exports = propertyOf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3Byb3BlcnR5T2YuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsUUFBUSxZQUFSLENBQWQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJBLFNBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QjtBQUMxQixTQUFPLFVBQVMsSUFBVCxFQUFlO0FBQ3BCLFdBQU8sVUFBVSxJQUFWLEdBQWlCLFNBQWpCLEdBQTZCLFFBQVEsTUFBUixFQUFnQixJQUFoQixDQUFwQztBQUNELEdBRkQ7QUFHRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoicHJvcGVydHlPZi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlR2V0ID0gcmVxdWlyZSgnLi9fYmFzZUdldCcpO1xuXG4vKipcbiAqIFRoZSBvcHBvc2l0ZSBvZiBgXy5wcm9wZXJ0eWA7IHRoaXMgbWV0aG9kIGNyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnNcbiAqIHRoZSB2YWx1ZSBhdCBhIGdpdmVuIHBhdGggb2YgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXkgPSBbMCwgMSwgMl0sXG4gKiAgICAgb2JqZWN0ID0geyAnYSc6IGFycmF5LCAnYic6IGFycmF5LCAnYyc6IGFycmF5IH07XG4gKlxuICogXy5tYXAoWydhWzJdJywgJ2NbMF0nXSwgXy5wcm9wZXJ0eU9mKG9iamVjdCkpO1xuICogLy8gPT4gWzIsIDBdXG4gKlxuICogXy5tYXAoW1snYScsICcyJ10sIFsnYycsICcwJ11dLCBfLnByb3BlcnR5T2Yob2JqZWN0KSk7XG4gKiAvLyA9PiBbMiwgMF1cbiAqL1xuZnVuY3Rpb24gcHJvcGVydHlPZihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHBhdGgpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBiYXNlR2V0KG9iamVjdCwgcGF0aCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJvcGVydHlPZjtcbiJdfQ==