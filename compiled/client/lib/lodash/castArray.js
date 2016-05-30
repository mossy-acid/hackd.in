'use strict';

var isArray = require('./isArray');

/**
 * Casts `value` as an array if it's not one.
 *
 * @static
 * @memberOf _
 * @since 4.4.0
 * @category Lang
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast array.
 * @example
 *
 * _.castArray(1);
 * // => [1]
 *
 * _.castArray({ 'a': 1 });
 * // => [{ 'a': 1 }]
 *
 * _.castArray('abc');
 * // => ['abc']
 *
 * _.castArray(null);
 * // => [null]
 *
 * _.castArray(undefined);
 * // => [undefined]
 *
 * _.castArray();
 * // => []
 *
 * var array = [1, 2, 3];
 * console.log(_.castArray(array) === array);
 * // => true
 */
function castArray() {
  if (!arguments.length) {
    return [];
  }
  var value = arguments[0];
  return isArray(value) ? value : [value];
}

module.exports = castArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Nhc3RBcnJheS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksVUFBVSxRQUFRLFdBQVIsQ0FBVjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQ0osU0FBUyxTQUFULEdBQXFCO0FBQ25CLE1BQUksQ0FBQyxVQUFVLE1BQVYsRUFBa0I7QUFDckIsV0FBTyxFQUFQLENBRHFCO0dBQXZCO0FBR0EsTUFBSSxRQUFRLFVBQVUsQ0FBVixDQUFSLENBSmU7QUFLbkIsU0FBTyxRQUFRLEtBQVIsSUFBaUIsS0FBakIsR0FBeUIsQ0FBQyxLQUFELENBQXpCLENBTFk7Q0FBckI7O0FBUUEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6ImNhc3RBcnJheS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCBhcyBhbiBhcnJheSBpZiBpdCdzIG5vdCBvbmUuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjQuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGNhc3QgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uY2FzdEFycmF5KDEpO1xuICogLy8gPT4gWzFdXG4gKlxuICogXy5jYXN0QXJyYXkoeyAnYSc6IDEgfSk7XG4gKiAvLyA9PiBbeyAnYSc6IDEgfV1cbiAqXG4gKiBfLmNhc3RBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBbJ2FiYyddXG4gKlxuICogXy5jYXN0QXJyYXkobnVsbCk7XG4gKiAvLyA9PiBbbnVsbF1cbiAqXG4gKiBfLmNhc3RBcnJheSh1bmRlZmluZWQpO1xuICogLy8gPT4gW3VuZGVmaW5lZF1cbiAqXG4gKiBfLmNhc3RBcnJheSgpO1xuICogLy8gPT4gW11cbiAqXG4gKiB2YXIgYXJyYXkgPSBbMSwgMiwgM107XG4gKiBjb25zb2xlLmxvZyhfLmNhc3RBcnJheShhcnJheSkgPT09IGFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY2FzdEFycmF5KCkge1xuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzBdO1xuICByZXR1cm4gaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFt2YWx1ZV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdEFycmF5O1xuIl19