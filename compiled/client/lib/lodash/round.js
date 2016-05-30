'use strict';

var createRound = require('./_createRound');

/**
 * Computes `number` rounded to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round.
 * @param {number} [precision=0] The precision to round to.
 * @returns {number} Returns the rounded number.
 * @example
 *
 * _.round(4.006);
 * // => 4
 *
 * _.round(4.006, 2);
 * // => 4.01
 *
 * _.round(4060, -2);
 * // => 4100
 */
var round = createRound('round');

module.exports = round;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3JvdW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJBLElBQUksUUFBUSxZQUFZLE9BQVosQ0FBWjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsS0FBakIiLCJmaWxlIjoicm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3JlYXRlUm91bmQgPSByZXF1aXJlKCcuL19jcmVhdGVSb3VuZCcpO1xuXG4vKipcbiAqIENvbXB1dGVzIGBudW1iZXJgIHJvdW5kZWQgdG8gYHByZWNpc2lvbmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjEwLjBcbiAqIEBjYXRlZ29yeSBNYXRoXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIFRoZSBudW1iZXIgdG8gcm91bmQuXG4gKiBAcGFyYW0ge251bWJlcn0gW3ByZWNpc2lvbj0wXSBUaGUgcHJlY2lzaW9uIHRvIHJvdW5kIHRvLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgcm91bmRlZCBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ucm91bmQoNC4wMDYpO1xuICogLy8gPT4gNFxuICpcbiAqIF8ucm91bmQoNC4wMDYsIDIpO1xuICogLy8gPT4gNC4wMVxuICpcbiAqIF8ucm91bmQoNDA2MCwgLTIpO1xuICogLy8gPT4gNDEwMFxuICovXG52YXIgcm91bmQgPSBjcmVhdGVSb3VuZCgncm91bmQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb3VuZDtcbiJdfQ==