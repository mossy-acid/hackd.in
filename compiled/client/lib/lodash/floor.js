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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2Zsb29yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkosSUFBSSxRQUFRLFlBQVksT0FBWixDQUFSOztBQUVKLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJmbG9vci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVSb3VuZCA9IHJlcXVpcmUoJy4vX2NyZWF0ZVJvdW5kJyk7XG5cbi8qKlxuICogQ29tcHV0ZXMgYG51bWJlcmAgcm91bmRlZCBkb3duIHRvIGBwcmVjaXNpb25gLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4xMC4wXG4gKiBAY2F0ZWdvcnkgTWF0aFxuICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciBUaGUgbnVtYmVyIHRvIHJvdW5kIGRvd24uXG4gKiBAcGFyYW0ge251bWJlcn0gW3ByZWNpc2lvbj0wXSBUaGUgcHJlY2lzaW9uIHRvIHJvdW5kIGRvd24gdG8uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSByb3VuZGVkIGRvd24gbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZsb29yKDQuMDA2KTtcbiAqIC8vID0+IDRcbiAqXG4gKiBfLmZsb29yKDAuMDQ2LCAyKTtcbiAqIC8vID0+IDAuMDRcbiAqXG4gKiBfLmZsb29yKDQwNjAsIC0yKTtcbiAqIC8vID0+IDQwMDBcbiAqL1xudmFyIGZsb29yID0gY3JlYXRlUm91bmQoJ2Zsb29yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZmxvb3I7XG4iXX0=