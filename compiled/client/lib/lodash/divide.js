'use strict';

var createMathOperation = require('./_createMathOperation');

/**
 * Divide two numbers.
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Math
 * @param {number} dividend The first number in a division.
 * @param {number} divisor The second number in a division.
 * @returns {number} Returns the quotient.
 * @example
 *
 * _.divide(6, 4);
 * // => 1.5
 */
var divide = createMathOperation(function (dividend, divisor) {
  return dividend / divisor;
});

module.exports = divide;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2RpdmlkZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksc0JBQXNCLFFBQVEsd0JBQVIsQ0FBMUI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLElBQUksU0FBUyxvQkFBb0IsVUFBUyxRQUFULEVBQW1CLE9BQW5CLEVBQTRCO0FBQzNELFNBQU8sV0FBVyxPQUFsQjtBQUNELENBRlksQ0FBYjs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsTUFBakIiLCJmaWxlIjoiZGl2aWRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZU1hdGhPcGVyYXRpb24gPSByZXF1aXJlKCcuL19jcmVhdGVNYXRoT3BlcmF0aW9uJyk7XG5cbi8qKlxuICogRGl2aWRlIHR3byBudW1iZXJzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC43LjBcbiAqIEBjYXRlZ29yeSBNYXRoXG4gKiBAcGFyYW0ge251bWJlcn0gZGl2aWRlbmQgVGhlIGZpcnN0IG51bWJlciBpbiBhIGRpdmlzaW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IGRpdmlzb3IgVGhlIHNlY29uZCBudW1iZXIgaW4gYSBkaXZpc2lvbi5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHF1b3RpZW50LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRpdmlkZSg2LCA0KTtcbiAqIC8vID0+IDEuNVxuICovXG52YXIgZGl2aWRlID0gY3JlYXRlTWF0aE9wZXJhdGlvbihmdW5jdGlvbihkaXZpZGVuZCwgZGl2aXNvcikge1xuICByZXR1cm4gZGl2aWRlbmQgLyBkaXZpc29yO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGl2aWRlO1xuIl19