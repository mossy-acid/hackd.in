'use strict';

var baseFill = require('./_baseFill'),
    isIterateeCall = require('./_isIterateeCall');

/**
 * Fills elements of `array` with `value` from `start` up to, but not
 * including, `end`.
 *
 * **Note:** This method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 3.2.0
 * @category Array
 * @param {Array} array The array to fill.
 * @param {*} value The value to fill `array` with.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * _.fill(array, 'a');
 * console.log(array);
 * // => ['a', 'a', 'a']
 *
 * _.fill(Array(3), 2);
 * // => [2, 2, 2]
 *
 * _.fill([4, 6, 8, 10], '*', 1, 3);
 * // => [4, '*', '*', 10]
 */
function fill(array, value, start, end) {
  var length = array ? array.length : 0;
  if (!length) {
    return [];
  }
  if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
    start = 0;
    end = length;
  }
  return baseFill(array, value, start, end);
}

module.exports = fill;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZpbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxhQUFSLENBQVg7SUFDQSxpQkFBaUIsUUFBUSxtQkFBUixDQUFqQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQStCSixTQUFTLElBQVQsQ0FBYyxLQUFkLEVBQXFCLEtBQXJCLEVBQTRCLEtBQTVCLEVBQW1DLEdBQW5DLEVBQXdDO0FBQ3RDLE1BQUksU0FBUyxRQUFRLE1BQU0sTUFBTixHQUFlLENBQXZCLENBRHlCO0FBRXRDLE1BQUksQ0FBQyxNQUFELEVBQVM7QUFDWCxXQUFPLEVBQVAsQ0FEVztHQUFiO0FBR0EsTUFBSSxTQUFTLE9BQU8sS0FBUCxJQUFnQixRQUFoQixJQUE0QixlQUFlLEtBQWYsRUFBc0IsS0FBdEIsRUFBNkIsS0FBN0IsQ0FBckMsRUFBMEU7QUFDNUUsWUFBUSxDQUFSLENBRDRFO0FBRTVFLFVBQU0sTUFBTixDQUY0RTtHQUE5RTtBQUlBLFNBQU8sU0FBUyxLQUFULEVBQWdCLEtBQWhCLEVBQXVCLEtBQXZCLEVBQThCLEdBQTlCLENBQVAsQ0FUc0M7Q0FBeEM7O0FBWUEsT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6ImZpbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUZpbGwgPSByZXF1aXJlKCcuL19iYXNlRmlsbCcpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9faXNJdGVyYXRlZUNhbGwnKTtcblxuLyoqXG4gKiBGaWxscyBlbGVtZW50cyBvZiBgYXJyYXlgIHdpdGggYHZhbHVlYCBmcm9tIGBzdGFydGAgdXAgdG8sIGJ1dCBub3RcbiAqIGluY2x1ZGluZywgYGVuZGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMi4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmaWxsLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gZmlsbCBgYXJyYXlgIHdpdGguXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZW5kPWFycmF5Lmxlbmd0aF0gVGhlIGVuZCBwb3NpdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXkgPSBbMSwgMiwgM107XG4gKlxuICogXy5maWxsKGFycmF5LCAnYScpO1xuICogY29uc29sZS5sb2coYXJyYXkpO1xuICogLy8gPT4gWydhJywgJ2EnLCAnYSddXG4gKlxuICogXy5maWxsKEFycmF5KDMpLCAyKTtcbiAqIC8vID0+IFsyLCAyLCAyXVxuICpcbiAqIF8uZmlsbChbNCwgNiwgOCwgMTBdLCAnKicsIDEsIDMpO1xuICogLy8gPT4gWzQsICcqJywgJyonLCAxMF1cbiAqL1xuZnVuY3Rpb24gZmlsbChhcnJheSwgdmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgaWYgKHN0YXJ0ICYmIHR5cGVvZiBzdGFydCAhPSAnbnVtYmVyJyAmJiBpc0l0ZXJhdGVlQ2FsbChhcnJheSwgdmFsdWUsIHN0YXJ0KSkge1xuICAgIHN0YXJ0ID0gMDtcbiAgICBlbmQgPSBsZW5ndGg7XG4gIH1cbiAgcmV0dXJuIGJhc2VGaWxsKGFycmF5LCB2YWx1ZSwgc3RhcnQsIGVuZCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmlsbDtcbiJdfQ==