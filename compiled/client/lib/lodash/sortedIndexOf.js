'use strict';

var baseSortedIndex = require('./_baseSortedIndex'),
    eq = require('./eq');

/**
 * This method is like `_.indexOf` except that it performs a binary
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
 * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
 * // => 1
 */
function sortedIndexOf(array, value) {
  var length = array ? array.length : 0;
  if (length) {
    var index = baseSortedIndex(array, value);
    if (index < length && eq(array[index], value)) {
      return index;
    }
  }
  return -1;
}

module.exports = sortedIndexOf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRlZEluZGV4T2YuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGtCQUFrQixRQUFRLG9CQUFSLENBQXRCO0lBQ0ksS0FBSyxRQUFRLE1BQVIsQ0FEVDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLFNBQVMsYUFBVCxDQUF1QixLQUF2QixFQUE4QixLQUE5QixFQUFxQztBQUNuQyxNQUFJLFNBQVMsUUFBUSxNQUFNLE1BQWQsR0FBdUIsQ0FBcEM7QUFDQSxNQUFJLE1BQUosRUFBWTtBQUNWLFFBQUksUUFBUSxnQkFBZ0IsS0FBaEIsRUFBdUIsS0FBdkIsQ0FBWjtBQUNBLFFBQUksUUFBUSxNQUFSLElBQWtCLEdBQUcsTUFBTSxLQUFOLENBQUgsRUFBaUIsS0FBakIsQ0FBdEIsRUFBK0M7QUFDN0MsYUFBTyxLQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU8sQ0FBQyxDQUFSO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLGFBQWpCIiwiZmlsZSI6InNvcnRlZEluZGV4T2YuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVNvcnRlZEluZGV4ID0gcmVxdWlyZSgnLi9fYmFzZVNvcnRlZEluZGV4JyksXG4gICAgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pbmRleE9mYCBleGNlcHQgdGhhdCBpdCBwZXJmb3JtcyBhIGJpbmFyeVxuICogc2VhcmNoIG9uIGEgc29ydGVkIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uc29ydGVkSW5kZXhPZihbNCwgNSwgNSwgNSwgNl0sIDUpO1xuICogLy8gPT4gMVxuICovXG5mdW5jdGlvbiBzb3J0ZWRJbmRleE9mKGFycmF5LCB2YWx1ZSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICBpZiAobGVuZ3RoKSB7XG4gICAgdmFyIGluZGV4ID0gYmFzZVNvcnRlZEluZGV4KGFycmF5LCB2YWx1ZSk7XG4gICAgaWYgKGluZGV4IDwgbGVuZ3RoICYmIGVxKGFycmF5W2luZGV4XSwgdmFsdWUpKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzb3J0ZWRJbmRleE9mO1xuIl19