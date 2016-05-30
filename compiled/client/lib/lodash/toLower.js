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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RvTG93ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQVg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJKLFNBQVMsT0FBVCxDQUFpQixLQUFqQixFQUF3QjtBQUN0QixTQUFPLFNBQVMsS0FBVCxFQUFnQixXQUFoQixFQUFQLENBRHNCO0NBQXhCOztBQUlBLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJ0b0xvd2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgLCBhcyBhIHdob2xlLCB0byBsb3dlciBjYXNlIGp1c3QgbGlrZVxuICogW1N0cmluZyN0b0xvd2VyQ2FzZV0oaHR0cHM6Ly9tZG4uaW8vdG9Mb3dlckNhc2UpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBsb3dlciBjYXNlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9Mb3dlcignLS1Gb28tQmFyLS0nKTtcbiAqIC8vID0+ICctLWZvby1iYXItLSdcbiAqXG4gKiBfLnRvTG93ZXIoJ2Zvb0JhcicpO1xuICogLy8gPT4gJ2Zvb2JhcidcbiAqXG4gKiBfLnRvTG93ZXIoJ19fRk9PX0JBUl9fJyk7XG4gKiAvLyA9PiAnX19mb29fYmFyX18nXG4gKi9cbmZ1bmN0aW9uIHRvTG93ZXIodmFsdWUpIHtcbiAgcmV0dXJuIHRvU3RyaW5nKHZhbHVlKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTG93ZXI7XG4iXX0=