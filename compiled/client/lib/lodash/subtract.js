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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3N1YnRyYWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxzQkFBc0IsUUFBUSx3QkFBUixDQUF0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkosSUFBSSxXQUFXLG9CQUFvQixVQUFTLE9BQVQsRUFBa0IsVUFBbEIsRUFBOEI7QUFDL0QsU0FBTyxVQUFVLFVBQVYsQ0FEd0Q7Q0FBOUIsQ0FBL0I7O0FBSUosT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6InN1YnRyYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZU1hdGhPcGVyYXRpb24gPSByZXF1aXJlKCcuL19jcmVhdGVNYXRoT3BlcmF0aW9uJyk7XG5cbi8qKlxuICogU3VidHJhY3QgdHdvIG51bWJlcnMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IE1hdGhcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW51ZW5kIFRoZSBmaXJzdCBudW1iZXIgaW4gYSBzdWJ0cmFjdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzdWJ0cmFoZW5kIFRoZSBzZWNvbmQgbnVtYmVyIGluIGEgc3VidHJhY3Rpb24uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBkaWZmZXJlbmNlLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnN1YnRyYWN0KDYsIDQpO1xuICogLy8gPT4gMlxuICovXG52YXIgc3VidHJhY3QgPSBjcmVhdGVNYXRoT3BlcmF0aW9uKGZ1bmN0aW9uKG1pbnVlbmQsIHN1YnRyYWhlbmQpIHtcbiAgcmV0dXJuIG1pbnVlbmQgLSBzdWJ0cmFoZW5kO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3VidHJhY3Q7XG4iXX0=