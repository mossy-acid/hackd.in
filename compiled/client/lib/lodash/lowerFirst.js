'use strict';

var createCaseFirst = require('./_createCaseFirst');

/**
 * Converts the first character of `string` to lower case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.lowerFirst('Fred');
 * // => 'fred'
 *
 * _.lowerFirst('FRED');
 * // => 'fRED'
 */
var lowerFirst = createCaseFirst('toLowerCase');

module.exports = lowerFirst;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2xvd2VyRmlyc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGtCQUFrQixRQUFRLG9CQUFSLENBQWxCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJKLElBQUksYUFBYSxnQkFBZ0IsYUFBaEIsQ0FBYjs7QUFFSixPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoibG93ZXJGaXJzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVDYXNlRmlyc3QgPSByZXF1aXJlKCcuL19jcmVhdGVDYXNlRmlyc3QnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyB0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIGBzdHJpbmdgIHRvIGxvd2VyIGNhc2UuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ubG93ZXJGaXJzdCgnRnJlZCcpO1xuICogLy8gPT4gJ2ZyZWQnXG4gKlxuICogXy5sb3dlckZpcnN0KCdGUkVEJyk7XG4gKiAvLyA9PiAnZlJFRCdcbiAqL1xudmFyIGxvd2VyRmlyc3QgPSBjcmVhdGVDYXNlRmlyc3QoJ3RvTG93ZXJDYXNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbG93ZXJGaXJzdDtcbiJdfQ==