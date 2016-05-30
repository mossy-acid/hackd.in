'use strict';

var arrayMap = require('./_arrayMap'),
    baseAt = require('./_baseAt'),
    baseFlatten = require('./_baseFlatten'),
    basePullAt = require('./_basePullAt'),
    compareAscending = require('./_compareAscending'),
    isIndex = require('./_isIndex'),
    rest = require('./rest');

/**
 * Removes elements from `array` corresponding to `indexes` and returns an
 * array of removed elements.
 *
 * **Note:** Unlike `_.at`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {...(number|number[])} [indexes] The indexes of elements to remove.
 * @returns {Array} Returns the new array of removed elements.
 * @example
 *
 * var array = ['a', 'b', 'c', 'd'];
 * var pulled = _.pullAt(array, [1, 3]);
 *
 * console.log(array);
 * // => ['a', 'c']
 *
 * console.log(pulled);
 * // => ['b', 'd']
 */
var pullAt = rest(function (array, indexes) {
    indexes = baseFlatten(indexes, 1);

    var length = array ? array.length : 0,
        result = baseAt(array, indexes);

    basePullAt(array, arrayMap(indexes, function (index) {
        return isIndex(index, length) ? +index : index;
    }).sort(compareAscending));

    return result;
});

module.exports = pullAt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3B1bGxBdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxRQUFRLGFBQVIsQ0FBZjtJQUNJLFNBQVMsUUFBUSxXQUFSLENBRGI7SUFFSSxjQUFjLFFBQVEsZ0JBQVIsQ0FGbEI7SUFHSSxhQUFhLFFBQVEsZUFBUixDQUhqQjtJQUlJLG1CQUFtQixRQUFRLHFCQUFSLENBSnZCO0lBS0ksVUFBVSxRQUFRLFlBQVIsQ0FMZDtJQU1JLE9BQU8sUUFBUSxRQUFSLENBTlg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0NBLElBQUksU0FBUyxLQUFLLFVBQVMsS0FBVCxFQUFnQixPQUFoQixFQUF5QjtBQUN6QyxjQUFVLFlBQVksT0FBWixFQUFxQixDQUFyQixDQUFWOztBQUVBLFFBQUksU0FBUyxRQUFRLE1BQU0sTUFBZCxHQUF1QixDQUFwQztRQUNJLFNBQVMsT0FBTyxLQUFQLEVBQWMsT0FBZCxDQURiOztBQUdBLGVBQVcsS0FBWCxFQUFrQixTQUFTLE9BQVQsRUFBa0IsVUFBUyxLQUFULEVBQWdCO0FBQ2xELGVBQU8sUUFBUSxLQUFSLEVBQWUsTUFBZixJQUF5QixDQUFDLEtBQTFCLEdBQWtDLEtBQXpDO0FBQ0QsS0FGaUIsRUFFZixJQUZlLENBRVYsZ0JBRlUsQ0FBbEI7O0FBSUEsV0FBTyxNQUFQO0FBQ0QsQ0FYWSxDQUFiOztBQWFBLE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJwdWxsQXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGJhc2VBdCA9IHJlcXVpcmUoJy4vX2Jhc2VBdCcpLFxuICAgIGJhc2VGbGF0dGVuID0gcmVxdWlyZSgnLi9fYmFzZUZsYXR0ZW4nKSxcbiAgICBiYXNlUHVsbEF0ID0gcmVxdWlyZSgnLi9fYmFzZVB1bGxBdCcpLFxuICAgIGNvbXBhcmVBc2NlbmRpbmcgPSByZXF1aXJlKCcuL19jb21wYXJlQXNjZW5kaW5nJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qKlxuICogUmVtb3ZlcyBlbGVtZW50cyBmcm9tIGBhcnJheWAgY29ycmVzcG9uZGluZyB0byBgaW5kZXhlc2AgYW5kIHJldHVybnMgYW5cbiAqIGFycmF5IG9mIHJlbW92ZWQgZWxlbWVudHMuXG4gKlxuICogKipOb3RlOioqIFVubGlrZSBgXy5hdGAsIHRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0gey4uLihudW1iZXJ8bnVtYmVyW10pfSBbaW5kZXhlc10gVGhlIGluZGV4ZXMgb2YgZWxlbWVudHMgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgcmVtb3ZlZCBlbGVtZW50cy5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5ID0gWydhJywgJ2InLCAnYycsICdkJ107XG4gKiB2YXIgcHVsbGVkID0gXy5wdWxsQXQoYXJyYXksIFsxLCAzXSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyYXkpO1xuICogLy8gPT4gWydhJywgJ2MnXVxuICpcbiAqIGNvbnNvbGUubG9nKHB1bGxlZCk7XG4gKiAvLyA9PiBbJ2InLCAnZCddXG4gKi9cbnZhciBwdWxsQXQgPSByZXN0KGZ1bmN0aW9uKGFycmF5LCBpbmRleGVzKSB7XG4gIGluZGV4ZXMgPSBiYXNlRmxhdHRlbihpbmRleGVzLCAxKTtcblxuICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgcmVzdWx0ID0gYmFzZUF0KGFycmF5LCBpbmRleGVzKTtcblxuICBiYXNlUHVsbEF0KGFycmF5LCBhcnJheU1hcChpbmRleGVzLCBmdW5jdGlvbihpbmRleCkge1xuICAgIHJldHVybiBpc0luZGV4KGluZGV4LCBsZW5ndGgpID8gK2luZGV4IDogaW5kZXg7XG4gIH0pLnNvcnQoY29tcGFyZUFzY2VuZGluZykpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBwdWxsQXQ7XG4iXX0=