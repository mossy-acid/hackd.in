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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NlaWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFsQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkEsSUFBSSxPQUFPLFlBQVksTUFBWixDQUFYOztBQUVBLE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJjZWlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZVJvdW5kID0gcmVxdWlyZSgnLi9fY3JlYXRlUm91bmQnKTtcblxuLyoqXG4gKiBDb21wdXRlcyBgbnVtYmVyYCByb3VuZGVkIHVwIHRvIGBwcmVjaXNpb25gLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4xMC4wXG4gKiBAY2F0ZWdvcnkgTWF0aFxuICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciBUaGUgbnVtYmVyIHRvIHJvdW5kIHVwLlxuICogQHBhcmFtIHtudW1iZXJ9IFtwcmVjaXNpb249MF0gVGhlIHByZWNpc2lvbiB0byByb3VuZCB1cCB0by5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHJvdW5kZWQgdXAgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmNlaWwoNC4wMDYpO1xuICogLy8gPT4gNVxuICpcbiAqIF8uY2VpbCg2LjAwNCwgMik7XG4gKiAvLyA9PiA2LjAxXG4gKlxuICogXy5jZWlsKDYwNDAsIC0yKTtcbiAqIC8vID0+IDYxMDBcbiAqL1xudmFyIGNlaWwgPSBjcmVhdGVSb3VuZCgnY2VpbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNlaWw7XG4iXX0=