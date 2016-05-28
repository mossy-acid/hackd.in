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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL211bHRpcGx5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxzQkFBc0IsUUFBUSx3QkFBUixDQUF0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkosSUFBSSxXQUFXLG9CQUFvQixVQUFTLFVBQVQsRUFBcUIsWUFBckIsRUFBbUM7QUFDcEUsU0FBTyxhQUFhLFlBQWIsQ0FENkQ7Q0FBbkMsQ0FBL0I7O0FBSUosT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6Im11bHRpcGx5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZU1hdGhPcGVyYXRpb24gPSByZXF1aXJlKCcuL19jcmVhdGVNYXRoT3BlcmF0aW9uJyk7XG5cbi8qKlxuICogTXVsdGlwbHkgdHdvIG51bWJlcnMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjcuMFxuICogQGNhdGVnb3J5IE1hdGhcbiAqIEBwYXJhbSB7bnVtYmVyfSBtdWx0aXBsaWVyIFRoZSBmaXJzdCBudW1iZXIgaW4gYSBtdWx0aXBsaWNhdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBtdWx0aXBsaWNhbmQgVGhlIHNlY29uZCBudW1iZXIgaW4gYSBtdWx0aXBsaWNhdGlvbi5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHByb2R1Y3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ubXVsdGlwbHkoNiwgNCk7XG4gKiAvLyA9PiAyNFxuICovXG52YXIgbXVsdGlwbHkgPSBjcmVhdGVNYXRoT3BlcmF0aW9uKGZ1bmN0aW9uKG11bHRpcGxpZXIsIG11bHRpcGxpY2FuZCkge1xuICByZXR1cm4gbXVsdGlwbGllciAqIG11bHRpcGxpY2FuZDtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG11bHRpcGx5O1xuIl19