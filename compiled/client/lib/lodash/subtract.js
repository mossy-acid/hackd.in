'use strict';

var createMathOperation = require('./_createMathOperation');

/**
 * Subtract two numbers.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {number} minuend The first number in a subtraction.
 * @param {number} subtrahend The second number in a subtraction.
 * @returns {number} Returns the difference.
 * @example
 *
 * _.subtract(6, 4);
 * // => 2
 */
var subtract = createMathOperation(function (minuend, subtrahend) {
  return minuend - subtrahend;
});

module.exports = subtract;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3N1YnRyYWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxzQkFBc0IsUUFBUSx3QkFBUixDQUExQjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsSUFBSSxXQUFXLG9CQUFvQixVQUFTLE9BQVQsRUFBa0IsVUFBbEIsRUFBOEI7QUFDL0QsU0FBTyxVQUFVLFVBQWpCO0FBQ0QsQ0FGYyxDQUFmOztBQUlBLE9BQU8sT0FBUCxHQUFpQixRQUFqQiIsImZpbGUiOiJzdWJ0cmFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVNYXRoT3BlcmF0aW9uID0gcmVxdWlyZSgnLi9fY3JlYXRlTWF0aE9wZXJhdGlvbicpO1xuXG4vKipcbiAqIFN1YnRyYWN0IHR3byBudW1iZXJzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBNYXRoXG4gKiBAcGFyYW0ge251bWJlcn0gbWludWVuZCBUaGUgZmlyc3QgbnVtYmVyIGluIGEgc3VidHJhY3Rpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gc3VidHJhaGVuZCBUaGUgc2Vjb25kIG51bWJlciBpbiBhIHN1YnRyYWN0aW9uLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgZGlmZmVyZW5jZS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5zdWJ0cmFjdCg2LCA0KTtcbiAqIC8vID0+IDJcbiAqL1xudmFyIHN1YnRyYWN0ID0gY3JlYXRlTWF0aE9wZXJhdGlvbihmdW5jdGlvbihtaW51ZW5kLCBzdWJ0cmFoZW5kKSB7XG4gIHJldHVybiBtaW51ZW5kIC0gc3VidHJhaGVuZDtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN1YnRyYWN0O1xuIl19