'use strict';

var arrayMap = require('./_arrayMap'),
    createOver = require('./_createOver');

/**
 * Creates a function that invokes `iteratees` with the arguments it receives
 * and returns their results.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
 *  [iteratees=[_.identity]] The iteratees to invoke.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var func = _.over([Math.max, Math.min]);
 *
 * func(1, 2, 3, 4);
 * // => [4, 1]
 */
var over = createOver(arrayMap);

module.exports = over;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL292ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxhQUFSLENBQVg7SUFDQSxhQUFhLFFBQVEsZUFBUixDQUFiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CSixJQUFJLE9BQU8sV0FBVyxRQUFYLENBQVA7O0FBRUosT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6Im92ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGNyZWF0ZU92ZXIgPSByZXF1aXJlKCcuL19jcmVhdGVPdmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgaXRlcmF0ZWVzYCB3aXRoIHRoZSBhcmd1bWVudHMgaXQgcmVjZWl2ZXNcbiAqIGFuZCByZXR1cm5zIHRoZWlyIHJlc3VsdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Li4uKEFycmF5fEFycmF5W118RnVuY3Rpb258RnVuY3Rpb25bXXxPYmplY3R8T2JqZWN0W118c3RyaW5nfHN0cmluZ1tdKX1cbiAqICBbaXRlcmF0ZWVzPVtfLmlkZW50aXR5XV0gVGhlIGl0ZXJhdGVlcyB0byBpbnZva2UuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGZ1bmMgPSBfLm92ZXIoW01hdGgubWF4LCBNYXRoLm1pbl0pO1xuICpcbiAqIGZ1bmMoMSwgMiwgMywgNCk7XG4gKiAvLyA9PiBbNCwgMV1cbiAqL1xudmFyIG92ZXIgPSBjcmVhdGVPdmVyKGFycmF5TWFwKTtcblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyO1xuIl19