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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRlZExhc3RJbmRleE9mLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxrQkFBa0IsUUFBUSxvQkFBUixDQUFsQjtJQUNBLEtBQUssUUFBUSxNQUFSLENBQUw7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCSixTQUFTLGlCQUFULENBQTJCLEtBQTNCLEVBQWtDLEtBQWxDLEVBQXlDO0FBQ3ZDLE1BQUksU0FBUyxRQUFRLE1BQU0sTUFBTixHQUFlLENBQXZCLENBRDBCO0FBRXZDLE1BQUksTUFBSixFQUFZO0FBQ1YsUUFBSSxRQUFRLGdCQUFnQixLQUFoQixFQUF1QixLQUF2QixFQUE4QixJQUE5QixJQUFzQyxDQUF0QyxDQURGO0FBRVYsUUFBSSxHQUFHLE1BQU0sS0FBTixDQUFILEVBQWlCLEtBQWpCLENBQUosRUFBNkI7QUFDM0IsYUFBTyxLQUFQLENBRDJCO0tBQTdCO0dBRkY7QUFNQSxTQUFPLENBQUMsQ0FBRCxDQVJnQztDQUF6Qzs7QUFXQSxPQUFPLE9BQVAsR0FBaUIsaUJBQWpCIiwiZmlsZSI6InNvcnRlZExhc3RJbmRleE9mLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VTb3J0ZWRJbmRleCA9IHJlcXVpcmUoJy4vX2Jhc2VTb3J0ZWRJbmRleCcpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ubGFzdEluZGV4T2ZgIGV4Y2VwdCB0aGF0IGl0IHBlcmZvcm1zIGEgYmluYXJ5XG4gKiBzZWFyY2ggb24gYSBzb3J0ZWQgYGFycmF5YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzZWFyY2guXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5zb3J0ZWRMYXN0SW5kZXhPZihbNCwgNSwgNSwgNSwgNl0sIDUpO1xuICogLy8gPT4gM1xuICovXG5mdW5jdGlvbiBzb3J0ZWRMYXN0SW5kZXhPZihhcnJheSwgdmFsdWUpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgaWYgKGxlbmd0aCkge1xuICAgIHZhciBpbmRleCA9IGJhc2VTb3J0ZWRJbmRleChhcnJheSwgdmFsdWUsIHRydWUpIC0gMTtcbiAgICBpZiAoZXEoYXJyYXlbaW5kZXhdLCB2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNvcnRlZExhc3RJbmRleE9mO1xuIl19