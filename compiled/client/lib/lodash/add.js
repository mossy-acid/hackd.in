'use strict';

var createMathOperation = require('./_createMathOperation');

/**
 * Adds two numbers.
 *
 * @static
 * @memberOf _
 * @since 3.4.0
 * @category Math
 * @param {number} augend The first number in an addition.
 * @param {number} addend The second number in an addition.
 * @returns {number} Returns the total.
 * @example
 *
 * _.add(6, 4);
 * // => 10
 */
var add = createMathOperation(function (augend, addend) {
  return augend + addend;
});

module.exports = add;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2FkZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksc0JBQXNCLFFBQVEsd0JBQVIsQ0FBMUI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLElBQUksTUFBTSxvQkFBb0IsVUFBUyxNQUFULEVBQWlCLE1BQWpCLEVBQXlCO0FBQ3JELFNBQU8sU0FBUyxNQUFoQjtBQUNELENBRlMsQ0FBVjs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsR0FBakIiLCJmaWxlIjoiYWRkLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZU1hdGhPcGVyYXRpb24gPSByZXF1aXJlKCcuL19jcmVhdGVNYXRoT3BlcmF0aW9uJyk7XG5cbi8qKlxuICogQWRkcyB0d28gbnVtYmVycy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuNC4wXG4gKiBAY2F0ZWdvcnkgTWF0aFxuICogQHBhcmFtIHtudW1iZXJ9IGF1Z2VuZCBUaGUgZmlyc3QgbnVtYmVyIGluIGFuIGFkZGl0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IGFkZGVuZCBUaGUgc2Vjb25kIG51bWJlciBpbiBhbiBhZGRpdGlvbi5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRvdGFsLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmFkZCg2LCA0KTtcbiAqIC8vID0+IDEwXG4gKi9cbnZhciBhZGQgPSBjcmVhdGVNYXRoT3BlcmF0aW9uKGZ1bmN0aW9uKGF1Z2VuZCwgYWRkZW5kKSB7XG4gIHJldHVybiBhdWdlbmQgKyBhZGRlbmQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBhZGQ7XG4iXX0=