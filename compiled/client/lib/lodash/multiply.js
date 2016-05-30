'use strict';

var createMathOperation = require('./_createMathOperation');

/**
 * Multiply two numbers.
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Math
 * @param {number} multiplier The first number in a multiplication.
 * @param {number} multiplicand The second number in a multiplication.
 * @returns {number} Returns the product.
 * @example
 *
 * _.multiply(6, 4);
 * // => 24
 */
var multiply = createMathOperation(function (multiplier, multiplicand) {
  return multiplier * multiplicand;
});

module.exports = multiply;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL211bHRpcGx5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxzQkFBc0IsUUFBUSx3QkFBUixDQUExQjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsSUFBSSxXQUFXLG9CQUFvQixVQUFTLFVBQVQsRUFBcUIsWUFBckIsRUFBbUM7QUFDcEUsU0FBTyxhQUFhLFlBQXBCO0FBQ0QsQ0FGYyxDQUFmOztBQUlBLE9BQU8sT0FBUCxHQUFpQixRQUFqQiIsImZpbGUiOiJtdWx0aXBseS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVNYXRoT3BlcmF0aW9uID0gcmVxdWlyZSgnLi9fY3JlYXRlTWF0aE9wZXJhdGlvbicpO1xuXG4vKipcbiAqIE11bHRpcGx5IHR3byBudW1iZXJzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC43LjBcbiAqIEBjYXRlZ29yeSBNYXRoXG4gKiBAcGFyYW0ge251bWJlcn0gbXVsdGlwbGllciBUaGUgZmlyc3QgbnVtYmVyIGluIGEgbXVsdGlwbGljYXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gbXVsdGlwbGljYW5kIFRoZSBzZWNvbmQgbnVtYmVyIGluIGEgbXVsdGlwbGljYXRpb24uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBwcm9kdWN0LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLm11bHRpcGx5KDYsIDQpO1xuICogLy8gPT4gMjRcbiAqL1xudmFyIG11bHRpcGx5ID0gY3JlYXRlTWF0aE9wZXJhdGlvbihmdW5jdGlvbihtdWx0aXBsaWVyLCBtdWx0aXBsaWNhbmQpIHtcbiAgcmV0dXJuIG11bHRpcGxpZXIgKiBtdWx0aXBsaWNhbmQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBtdWx0aXBseTtcbiJdfQ==