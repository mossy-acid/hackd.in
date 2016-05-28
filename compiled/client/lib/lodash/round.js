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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3JvdW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkosSUFBSSxRQUFRLFlBQVksT0FBWixDQUFSOztBQUVKLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJyb3VuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVSb3VuZCA9IHJlcXVpcmUoJy4vX2NyZWF0ZVJvdW5kJyk7XG5cbi8qKlxuICogQ29tcHV0ZXMgYG51bWJlcmAgcm91bmRlZCB0byBgcHJlY2lzaW9uYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMTAuMFxuICogQGNhdGVnb3J5IE1hdGhcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgVGhlIG51bWJlciB0byByb3VuZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbcHJlY2lzaW9uPTBdIFRoZSBwcmVjaXNpb24gdG8gcm91bmQgdG8uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSByb3VuZGVkIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5yb3VuZCg0LjAwNik7XG4gKiAvLyA9PiA0XG4gKlxuICogXy5yb3VuZCg0LjAwNiwgMik7XG4gKiAvLyA9PiA0LjAxXG4gKlxuICogXy5yb3VuZCg0MDYwLCAtMik7XG4gKiAvLyA9PiA0MTAwXG4gKi9cbnZhciByb3VuZCA9IGNyZWF0ZVJvdW5kKCdyb3VuZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvdW5kO1xuIl19