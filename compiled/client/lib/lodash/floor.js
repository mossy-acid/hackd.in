'use strict';

var createRound = require('./_createRound');

/**
 * Computes `number` rounded down to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round down.
 * @param {number} [precision=0] The precision to round down to.
 * @returns {number} Returns the rounded down number.
 * @example
 *
 * _.floor(4.006);
 * // => 4
 *
 * _.floor(0.046, 2);
 * // => 0.04
 *
 * _.floor(4060, -2);
 * // => 4000
 */
var floor = createRound('floor');

module.exports = floor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Zsb29yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJBLElBQUksUUFBUSxZQUFZLE9BQVosQ0FBWjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsS0FBakIiLCJmaWxlIjoiZmxvb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3JlYXRlUm91bmQgPSByZXF1aXJlKCcuL19jcmVhdGVSb3VuZCcpO1xuXG4vKipcbiAqIENvbXB1dGVzIGBudW1iZXJgIHJvdW5kZWQgZG93biB0byBgcHJlY2lzaW9uYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMTAuMFxuICogQGNhdGVnb3J5IE1hdGhcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgVGhlIG51bWJlciB0byByb3VuZCBkb3duLlxuICogQHBhcmFtIHtudW1iZXJ9IFtwcmVjaXNpb249MF0gVGhlIHByZWNpc2lvbiB0byByb3VuZCBkb3duIHRvLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgcm91bmRlZCBkb3duIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5mbG9vcig0LjAwNik7XG4gKiAvLyA9PiA0XG4gKlxuICogXy5mbG9vcigwLjA0NiwgMik7XG4gKiAvLyA9PiAwLjA0XG4gKlxuICogXy5mbG9vcig0MDYwLCAtMik7XG4gKiAvLyA9PiA0MDAwXG4gKi9cbnZhciBmbG9vciA9IGNyZWF0ZVJvdW5kKCdmbG9vcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZsb29yO1xuIl19