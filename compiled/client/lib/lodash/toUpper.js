'use strict';

var toString = require('./toString');

/**
 * Converts `string`, as a whole, to upper case just like
 * [String#toUpperCase](https://mdn.io/toUpperCase).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the upper cased string.
 * @example
 *
 * _.toUpper('--foo-bar--');
 * // => '--FOO-BAR--'
 *
 * _.toUpper('fooBar');
 * // => 'FOOBAR'
 *
 * _.toUpper('__foo_bar__');
 * // => '__FOO_BAR__'
 */
function toUpper(value) {
  return toString(value).toUpperCase();
}

module.exports = toUpper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RvVXBwZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQWY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJBLFNBQVMsT0FBVCxDQUFpQixLQUFqQixFQUF3QjtBQUN0QixTQUFPLFNBQVMsS0FBVCxFQUFnQixXQUFoQixFQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6InRvVXBwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKlxuICogQ29udmVydHMgYHN0cmluZ2AsIGFzIGEgd2hvbGUsIHRvIHVwcGVyIGNhc2UganVzdCBsaWtlXG4gKiBbU3RyaW5nI3RvVXBwZXJDYXNlXShodHRwczovL21kbi5pby90b1VwcGVyQ2FzZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVwcGVyIGNhc2VkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b1VwcGVyKCctLWZvby1iYXItLScpO1xuICogLy8gPT4gJy0tRk9PLUJBUi0tJ1xuICpcbiAqIF8udG9VcHBlcignZm9vQmFyJyk7XG4gKiAvLyA9PiAnRk9PQkFSJ1xuICpcbiAqIF8udG9VcHBlcignX19mb29fYmFyX18nKTtcbiAqIC8vID0+ICdfX0ZPT19CQVJfXydcbiAqL1xuZnVuY3Rpb24gdG9VcHBlcih2YWx1ZSkge1xuICByZXR1cm4gdG9TdHJpbmcodmFsdWUpLnRvVXBwZXJDYXNlKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9VcHBlcjtcbiJdfQ==