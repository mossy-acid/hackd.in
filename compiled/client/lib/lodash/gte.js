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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2d0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksNEJBQTRCLFFBQVEsOEJBQVIsQ0FBNUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkosSUFBSSxNQUFNLDBCQUEwQixVQUFTLEtBQVQsRUFBZ0IsS0FBaEIsRUFBdUI7QUFDekQsU0FBTyxTQUFTLEtBQVQsQ0FEa0Q7Q0FBdkIsQ0FBaEM7O0FBSUosT0FBTyxPQUFQLEdBQWlCLEdBQWpCIiwiZmlsZSI6Imd0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9uID0gcmVxdWlyZSgnLi9fY3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbicpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byBgb3RoZXJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy45LjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0b1xuICogIGBvdGhlcmAsIGVsc2UgYGZhbHNlYC5cbiAqIEBzZWUgXy5sdGVcbiAqIEBleGFtcGxlXG4gKlxuICogXy5ndGUoMywgMSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5ndGUoMywgMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5ndGUoMSwgMyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgZ3RlID0gY3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbihmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID49IG90aGVyO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ3RlO1xuIl19