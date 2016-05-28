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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2RpdmlkZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksc0JBQXNCLFFBQVEsd0JBQVIsQ0FBdEI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJKLElBQUksU0FBUyxvQkFBb0IsVUFBUyxRQUFULEVBQW1CLE9BQW5CLEVBQTRCO0FBQzNELFNBQU8sV0FBVyxPQUFYLENBRG9EO0NBQTVCLENBQTdCOztBQUlKLE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJkaXZpZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3JlYXRlTWF0aE9wZXJhdGlvbiA9IHJlcXVpcmUoJy4vX2NyZWF0ZU1hdGhPcGVyYXRpb24nKTtcblxuLyoqXG4gKiBEaXZpZGUgdHdvIG51bWJlcnMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjcuMFxuICogQGNhdGVnb3J5IE1hdGhcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXZpZGVuZCBUaGUgZmlyc3QgbnVtYmVyIGluIGEgZGl2aXNpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gZGl2aXNvciBUaGUgc2Vjb25kIG51bWJlciBpbiBhIGRpdmlzaW9uLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgcXVvdGllbnQuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGl2aWRlKDYsIDQpO1xuICogLy8gPT4gMS41XG4gKi9cbnZhciBkaXZpZGUgPSBjcmVhdGVNYXRoT3BlcmF0aW9uKGZ1bmN0aW9uKGRpdmlkZW5kLCBkaXZpc29yKSB7XG4gIHJldHVybiBkaXZpZGVuZCAvIGRpdmlzb3I7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkaXZpZGU7XG4iXX0=