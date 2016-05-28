'use strict';

var createRelationalOperation = require('./_createRelationalOperation');

/**
 * Checks if `value` is less than or equal to `other`.
 *
 * @static
 * @memberOf _
 * @since 3.9.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is less than or equal to
 *  `other`, else `false`.
 * @see _.gte
 * @example
 *
 * _.lte(1, 3);
 * // => true
 *
 * _.lte(3, 3);
 * // => true
 *
 * _.lte(3, 1);
 * // => false
 */
var lte = createRelationalOperation(function (value, other) {
  return value <= other;
});

module.exports = lte;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2x0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksNEJBQTRCLFFBQVEsOEJBQVIsQ0FBNUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkosSUFBSSxNQUFNLDBCQUEwQixVQUFTLEtBQVQsRUFBZ0IsS0FBaEIsRUFBdUI7QUFDekQsU0FBTyxTQUFTLEtBQVQsQ0FEa0Q7Q0FBdkIsQ0FBaEM7O0FBSUosT0FBTyxPQUFQLEdBQWlCLEdBQWpCIiwiZmlsZSI6Imx0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9uID0gcmVxdWlyZSgnLi9fY3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbicpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgb3RoZXJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy45LjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0b1xuICogIGBvdGhlcmAsIGVsc2UgYGZhbHNlYC5cbiAqIEBzZWUgXy5ndGVcbiAqIEBleGFtcGxlXG4gKlxuICogXy5sdGUoMSwgMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5sdGUoMywgMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5sdGUoMywgMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgbHRlID0gY3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbihmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlIDw9IG90aGVyO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbHRlO1xuIl19