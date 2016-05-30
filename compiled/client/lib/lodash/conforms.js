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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NvbmZvcm1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFoQjtJQUNJLGVBQWUsUUFBUSxpQkFBUixDQURuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QkEsU0FBUyxRQUFULENBQWtCLE1BQWxCLEVBQTBCO0FBQ3hCLFNBQU8sYUFBYSxVQUFVLE1BQVYsRUFBa0IsSUFBbEIsQ0FBYixDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6ImNvbmZvcm1zLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VDbG9uZSA9IHJlcXVpcmUoJy4vX2Jhc2VDbG9uZScpLFxuICAgIGJhc2VDb25mb3JtcyA9IHJlcXVpcmUoJy4vX2Jhc2VDb25mb3JtcycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgdGhlIHByZWRpY2F0ZSBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHdpdGhcbiAqIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5IHZhbHVlcyBvZiBhIGdpdmVuIG9iamVjdCwgcmV0dXJuaW5nIGB0cnVlYCBpZlxuICogYWxsIHByZWRpY2F0ZXMgcmV0dXJuIHRydXRoeSwgZWxzZSBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgcHJlZGljYXRlcyB0byBjb25mb3JtIHRvLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9LFxuICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XG4gKiBdO1xuICpcbiAqIF8uZmlsdGVyKHVzZXJzLCBfLmNvbmZvcm1zKHsgJ2FnZSc6IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIG4gPiAzODsgfSB9KSk7XG4gKiAvLyA9PiBbeyAndXNlcic6ICdmcmVkJywgJ2FnZSc6IDQwIH1dXG4gKi9cbmZ1bmN0aW9uIGNvbmZvcm1zKHNvdXJjZSkge1xuICByZXR1cm4gYmFzZUNvbmZvcm1zKGJhc2VDbG9uZShzb3VyY2UsIHRydWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25mb3JtcztcbiJdfQ==