'use strict';

var createRelationalOperation = require('./_createRelationalOperation');

/**
 * Checks if `value` is greater than or equal to `other`.
 *
 * @static
 * @memberOf _
 * @since 3.9.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is greater than or equal to
 *  `other`, else `false`.
 * @see _.lte
 * @example
 *
 * _.gte(3, 1);
 * // => true
 *
 * _.gte(3, 3);
 * // => true
 *
 * _.gte(1, 3);
 * // => false
 */
var gte = createRelationalOperation(function (value, other) {
  return value >= other;
});

module.exports = gte;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2d0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksNEJBQTRCLFFBQVEsOEJBQVIsQ0FBaEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsSUFBSSxNQUFNLDBCQUEwQixVQUFTLEtBQVQsRUFBZ0IsS0FBaEIsRUFBdUI7QUFDekQsU0FBTyxTQUFTLEtBQWhCO0FBQ0QsQ0FGUyxDQUFWOztBQUlBLE9BQU8sT0FBUCxHQUFpQixHQUFqQiIsImZpbGUiOiJndGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbiA9IHJlcXVpcmUoJy4vX2NyZWF0ZVJlbGF0aW9uYWxPcGVyYXRpb24nKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gYG90aGVyYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuOS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG9cbiAqICBgb3RoZXJgLCBlbHNlIGBmYWxzZWAuXG4gKiBAc2VlIF8ubHRlXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZ3RlKDMsIDEpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZ3RlKDMsIDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZ3RlKDEsIDMpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGd0ZSA9IGNyZWF0ZVJlbGF0aW9uYWxPcGVyYXRpb24oZnVuY3Rpb24odmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA+PSBvdGhlcjtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGd0ZTtcbiJdfQ==