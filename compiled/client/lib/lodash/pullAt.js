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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3B1bGxBdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxRQUFRLGFBQVIsQ0FBWDtJQUNBLFNBQVMsUUFBUSxXQUFSLENBQVQ7SUFDQSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLGFBQWEsUUFBUSxlQUFSLENBQWI7SUFDQSxtQkFBbUIsUUFBUSxxQkFBUixDQUFuQjtJQUNBLFVBQVUsUUFBUSxZQUFSLENBQVY7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCSixJQUFJLFNBQVMsS0FBSyxVQUFTLEtBQVQsRUFBZ0IsT0FBaEIsRUFBeUI7QUFDekMsY0FBVSxZQUFZLE9BQVosRUFBcUIsQ0FBckIsQ0FBVixDQUR5Qzs7QUFHekMsUUFBSSxTQUFTLFFBQVEsTUFBTSxNQUFOLEdBQWUsQ0FBdkI7UUFDVCxTQUFTLE9BQU8sS0FBUCxFQUFjLE9BQWQsQ0FBVCxDQUpxQzs7QUFNekMsZUFBVyxLQUFYLEVBQWtCLFNBQVMsT0FBVCxFQUFrQixVQUFTLEtBQVQsRUFBZ0I7QUFDbEQsZUFBTyxRQUFRLEtBQVIsRUFBZSxNQUFmLElBQXlCLENBQUMsS0FBRCxHQUFTLEtBQWxDLENBRDJDO0tBQWhCLENBQWxCLENBRWYsSUFGZSxDQUVWLGdCQUZVLENBQWxCLEVBTnlDOztBQVV6QyxXQUFPLE1BQVAsQ0FWeUM7Q0FBekIsQ0FBZDs7QUFhSixPQUFPLE9BQVAsR0FBaUIsTUFBakIiLCJmaWxlIjoicHVsbEF0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlQXQgPSByZXF1aXJlKCcuL19iYXNlQXQnKSxcbiAgICBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgYmFzZVB1bGxBdCA9IHJlcXVpcmUoJy4vX2Jhc2VQdWxsQXQnKSxcbiAgICBjb21wYXJlQXNjZW5kaW5nID0gcmVxdWlyZSgnLi9fY29tcGFyZUFzY2VuZGluZycpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgcmVzdCA9IHJlcXVpcmUoJy4vcmVzdCcpO1xuXG4vKipcbiAqIFJlbW92ZXMgZWxlbWVudHMgZnJvbSBgYXJyYXlgIGNvcnJlc3BvbmRpbmcgdG8gYGluZGV4ZXNgIGFuZCByZXR1cm5zIGFuXG4gKiBhcnJheSBvZiByZW1vdmVkIGVsZW1lbnRzLlxuICpcbiAqICoqTm90ZToqKiBVbmxpa2UgYF8uYXRgLCB0aGlzIG1ldGhvZCBtdXRhdGVzIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHsuLi4obnVtYmVyfG51bWJlcltdKX0gW2luZGV4ZXNdIFRoZSBpbmRleGVzIG9mIGVsZW1lbnRzIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIHJlbW92ZWQgZWxlbWVudHMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheSA9IFsnYScsICdiJywgJ2MnLCAnZCddO1xuICogdmFyIHB1bGxlZCA9IF8ucHVsbEF0KGFycmF5LCBbMSwgM10pO1xuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAqIC8vID0+IFsnYScsICdjJ11cbiAqXG4gKiBjb25zb2xlLmxvZyhwdWxsZWQpO1xuICogLy8gPT4gWydiJywgJ2QnXVxuICovXG52YXIgcHVsbEF0ID0gcmVzdChmdW5jdGlvbihhcnJheSwgaW5kZXhlcykge1xuICBpbmRleGVzID0gYmFzZUZsYXR0ZW4oaW5kZXhlcywgMSk7XG5cbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMCxcbiAgICAgIHJlc3VsdCA9IGJhc2VBdChhcnJheSwgaW5kZXhlcyk7XG5cbiAgYmFzZVB1bGxBdChhcnJheSwgYXJyYXlNYXAoaW5kZXhlcywgZnVuY3Rpb24oaW5kZXgpIHtcbiAgICByZXR1cm4gaXNJbmRleChpbmRleCwgbGVuZ3RoKSA/ICtpbmRleCA6IGluZGV4O1xuICB9KS5zb3J0KGNvbXBhcmVBc2NlbmRpbmcpKTtcblxuICByZXR1cm4gcmVzdWx0O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gcHVsbEF0O1xuIl19