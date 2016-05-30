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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RvVXBwZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQVg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJKLFNBQVMsT0FBVCxDQUFpQixLQUFqQixFQUF3QjtBQUN0QixTQUFPLFNBQVMsS0FBVCxFQUFnQixXQUFoQixFQUFQLENBRHNCO0NBQXhCOztBQUlBLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJ0b1VwcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgLCBhcyBhIHdob2xlLCB0byB1cHBlciBjYXNlIGp1c3QgbGlrZVxuICogW1N0cmluZyN0b1VwcGVyQ2FzZV0oaHR0cHM6Ly9tZG4uaW8vdG9VcHBlckNhc2UpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSB1cHBlciBjYXNlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9VcHBlcignLS1mb28tYmFyLS0nKTtcbiAqIC8vID0+ICctLUZPTy1CQVItLSdcbiAqXG4gKiBfLnRvVXBwZXIoJ2Zvb0JhcicpO1xuICogLy8gPT4gJ0ZPT0JBUidcbiAqXG4gKiBfLnRvVXBwZXIoJ19fZm9vX2Jhcl9fJyk7XG4gKiAvLyA9PiAnX19GT09fQkFSX18nXG4gKi9cbmZ1bmN0aW9uIHRvVXBwZXIodmFsdWUpIHtcbiAgcmV0dXJuIHRvU3RyaW5nKHZhbHVlKS50b1VwcGVyQ2FzZSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvVXBwZXI7XG4iXX0=