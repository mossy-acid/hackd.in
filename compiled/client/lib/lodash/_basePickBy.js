'use strict';

var getAllKeysIn = require('./_getAllKeysIn');

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, predicate) {
  var index = -1,
      props = getAllKeysIn(object),
      length = props.length,
      result = {};

  while (++index < length) {
    var key = props[index],
        value = object[key];

    if (predicate(value, key)) {
      result[key] = value;
    }
  }
  return result;
}

module.exports = basePickBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlUGlja0J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxlQUFlLFFBQVEsaUJBQVIsQ0FBZjs7Ozs7Ozs7OztBQVVKLFNBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QixTQUE1QixFQUF1QztBQUNyQyxNQUFJLFFBQVEsQ0FBQyxDQUFEO01BQ1IsUUFBUSxhQUFhLE1BQWIsQ0FBUjtNQUNBLFNBQVMsTUFBTSxNQUFOO01BQ1QsU0FBUyxFQUFULENBSmlDOztBQU1yQyxTQUFPLEVBQUUsS0FBRixHQUFVLE1BQVYsRUFBa0I7QUFDdkIsUUFBSSxNQUFNLE1BQU0sS0FBTixDQUFOO1FBQ0EsUUFBUSxPQUFPLEdBQVAsQ0FBUixDQUZtQjs7QUFJdkIsUUFBSSxVQUFVLEtBQVYsRUFBaUIsR0FBakIsQ0FBSixFQUEyQjtBQUN6QixhQUFPLEdBQVAsSUFBYyxLQUFkLENBRHlCO0tBQTNCO0dBSkY7QUFRQSxTQUFPLE1BQVAsQ0FkcUM7Q0FBdkM7O0FBaUJBLE9BQU8sT0FBUCxHQUFpQixVQUFqQiIsImZpbGUiOiJfYmFzZVBpY2tCeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBnZXRBbGxLZXlzSW4gPSByZXF1aXJlKCcuL19nZXRBbGxLZXlzSW4nKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiAgYF8ucGlja0J5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIHByb3BlcnR5LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gYmFzZVBpY2tCeShvYmplY3QsIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHByb3BzID0gZ2V0QWxsS2V5c0luKG9iamVjdCksXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICByZXN1bHQgPSB7fTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF0sXG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV07XG5cbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBrZXkpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQaWNrQnk7XG4iXX0=