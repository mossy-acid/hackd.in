'use strict';

var toString = require('./toString');

/**
 * Converts `string`, as a whole, to lower case just like
 * [String#toLowerCase](https://mdn.io/toLowerCase).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the lower cased string.
 * @example
 *
 * _.toLower('--Foo-Bar--');
 * // => '--foo-bar--'
 *
 * _.toLower('fooBar');
 * // => 'foobar'
 *
 * _.toLower('__FOO_BAR__');
 * // => '__foo_bar__'
 */
function toLower(value) {
  return toString(value).toLowerCase();
}

module.exports = toLower;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RvTG93ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQWY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJBLFNBQVMsT0FBVCxDQUFpQixLQUFqQixFQUF3QjtBQUN0QixTQUFPLFNBQVMsS0FBVCxFQUFnQixXQUFoQixFQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6InRvTG93ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKlxuICogQ29udmVydHMgYHN0cmluZ2AsIGFzIGEgd2hvbGUsIHRvIGxvd2VyIGNhc2UganVzdCBsaWtlXG4gKiBbU3RyaW5nI3RvTG93ZXJDYXNlXShodHRwczovL21kbi5pby90b0xvd2VyQ2FzZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGxvd2VyIGNhc2VkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b0xvd2VyKCctLUZvby1CYXItLScpO1xuICogLy8gPT4gJy0tZm9vLWJhci0tJ1xuICpcbiAqIF8udG9Mb3dlcignZm9vQmFyJyk7XG4gKiAvLyA9PiAnZm9vYmFyJ1xuICpcbiAqIF8udG9Mb3dlcignX19GT09fQkFSX18nKTtcbiAqIC8vID0+ICdfX2Zvb19iYXJfXydcbiAqL1xuZnVuY3Rpb24gdG9Mb3dlcih2YWx1ZSkge1xuICByZXR1cm4gdG9TdHJpbmcodmFsdWUpLnRvTG93ZXJDYXNlKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9Mb3dlcjtcbiJdfQ==