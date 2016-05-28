'use strict';

var baseClone = require('./_baseClone'),
    baseConforms = require('./_baseConforms');

/**
 * Creates a function that invokes the predicate properties of `source` with
 * the corresponding property values of a given object, returning `true` if
 * all predicates return truthy, else `false`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {Object} source The object of property predicates to conform to.
 * @returns {Function} Returns the new spec function.
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 }
 * ];
 *
 * _.filter(users, _.conforms({ 'age': function(n) { return n > 38; } }));
 * // => [{ 'user': 'fred', 'age': 40 }]
 */
function conforms(source) {
  return baseConforms(baseClone(source, true));
}

module.exports = conforms;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NvbmZvcm1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsZUFBZSxRQUFRLGlCQUFSLENBQWY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJKLFNBQVMsUUFBVCxDQUFrQixNQUFsQixFQUEwQjtBQUN4QixTQUFPLGFBQWEsVUFBVSxNQUFWLEVBQWtCLElBQWxCLENBQWIsQ0FBUCxDQUR3QjtDQUExQjs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiY29uZm9ybXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUNsb25lID0gcmVxdWlyZSgnLi9fYmFzZUNsb25lJyksXG4gICAgYmFzZUNvbmZvcm1zID0gcmVxdWlyZSgnLi9fYmFzZUNvbmZvcm1zJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyB0aGUgcHJlZGljYXRlIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgd2l0aFxuICogdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgdmFsdWVzIG9mIGEgZ2l2ZW4gb2JqZWN0LCByZXR1cm5pbmcgYHRydWVgIGlmXG4gKiBhbGwgcHJlZGljYXRlcyByZXR1cm4gdHJ1dGh5LCBlbHNlIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBwcm9wZXJ0eSBwcmVkaWNhdGVzIHRvIGNvbmZvcm0gdG8uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzcGVjIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSBbXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH1cbiAqIF07XG4gKlxuICogXy5maWx0ZXIodXNlcnMsIF8uY29uZm9ybXMoeyAnYWdlJzogZnVuY3Rpb24obikgeyByZXR1cm4gbiA+IDM4OyB9IH0pKTtcbiAqIC8vID0+IFt7ICd1c2VyJzogJ2ZyZWQnLCAnYWdlJzogNDAgfV1cbiAqL1xuZnVuY3Rpb24gY29uZm9ybXMoc291cmNlKSB7XG4gIHJldHVybiBiYXNlQ29uZm9ybXMoYmFzZUNsb25lKHNvdXJjZSwgdHJ1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZvcm1zO1xuIl19