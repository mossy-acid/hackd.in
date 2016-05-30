'use strict';

var baseSortedIndex = require('./_baseSortedIndex'),
    eq = require('./eq');

/**
 * This method is like `_.lastIndexOf` except that it performs a binary
 * search on a sorted `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
 * // => 3
 */
function sortedLastIndexOf(array, value) {
  var length = array ? array.length : 0;
  if (length) {
    var index = baseSortedIndex(array, value, true) - 1;
    if (eq(array[index], value)) {
      return index;
    }
  }
  return -1;
}

module.exports = sortedLastIndexOf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRlZExhc3RJbmRleE9mLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxrQkFBa0IsUUFBUSxvQkFBUixDQUF0QjtJQUNJLEtBQUssUUFBUSxNQUFSLENBRFQ7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxTQUFTLGlCQUFULENBQTJCLEtBQTNCLEVBQWtDLEtBQWxDLEVBQXlDO0FBQ3ZDLE1BQUksU0FBUyxRQUFRLE1BQU0sTUFBZCxHQUF1QixDQUFwQztBQUNBLE1BQUksTUFBSixFQUFZO0FBQ1YsUUFBSSxRQUFRLGdCQUFnQixLQUFoQixFQUF1QixLQUF2QixFQUE4QixJQUE5QixJQUFzQyxDQUFsRDtBQUNBLFFBQUksR0FBRyxNQUFNLEtBQU4sQ0FBSCxFQUFpQixLQUFqQixDQUFKLEVBQTZCO0FBQzNCLGFBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLENBQUMsQ0FBUjtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixpQkFBakIiLCJmaWxlIjoic29ydGVkTGFzdEluZGV4T2YuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVNvcnRlZEluZGV4ID0gcmVxdWlyZSgnLi9fYmFzZVNvcnRlZEluZGV4JyksXG4gICAgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5sYXN0SW5kZXhPZmAgZXhjZXB0IHRoYXQgaXQgcGVyZm9ybXMgYSBiaW5hcnlcbiAqIHNlYXJjaCBvbiBhIHNvcnRlZCBgYXJyYXlgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnNvcnRlZExhc3RJbmRleE9mKFs0LCA1LCA1LCA1LCA2XSwgNSk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIHNvcnRlZExhc3RJbmRleE9mKGFycmF5LCB2YWx1ZSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICBpZiAobGVuZ3RoKSB7XG4gICAgdmFyIGluZGV4ID0gYmFzZVNvcnRlZEluZGV4KGFycmF5LCB2YWx1ZSwgdHJ1ZSkgLSAxO1xuICAgIGlmIChlcShhcnJheVtpbmRleF0sIHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc29ydGVkTGFzdEluZGV4T2Y7XG4iXX0=