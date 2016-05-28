'use strict';

var createRound = require('./_createRound');

/**
 * Computes `number` rounded up to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round up.
 * @param {number} [precision=0] The precision to round up to.
 * @returns {number} Returns the rounded up number.
 * @example
 *
 * _.ceil(4.006);
 * // => 5
 *
 * _.ceil(6.004, 2);
 * // => 6.01
 *
 * _.ceil(6040, -2);
 * // => 6100
 */
var ceil = createRound('ceil');

module.exports = ceil;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NlaWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFkOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCSixJQUFJLE9BQU8sWUFBWSxNQUFaLENBQVA7O0FBRUosT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6ImNlaWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3JlYXRlUm91bmQgPSByZXF1aXJlKCcuL19jcmVhdGVSb3VuZCcpO1xuXG4vKipcbiAqIENvbXB1dGVzIGBudW1iZXJgIHJvdW5kZWQgdXAgdG8gYHByZWNpc2lvbmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjEwLjBcbiAqIEBjYXRlZ29yeSBNYXRoXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIFRoZSBudW1iZXIgdG8gcm91bmQgdXAuXG4gKiBAcGFyYW0ge251bWJlcn0gW3ByZWNpc2lvbj0wXSBUaGUgcHJlY2lzaW9uIHRvIHJvdW5kIHVwIHRvLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgcm91bmRlZCB1cCBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uY2VpbCg0LjAwNik7XG4gKiAvLyA9PiA1XG4gKlxuICogXy5jZWlsKDYuMDA0LCAyKTtcbiAqIC8vID0+IDYuMDFcbiAqXG4gKiBfLmNlaWwoNjA0MCwgLTIpO1xuICogLy8gPT4gNjEwMFxuICovXG52YXIgY2VpbCA9IGNyZWF0ZVJvdW5kKCdjZWlsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2VpbDtcbiJdfQ==