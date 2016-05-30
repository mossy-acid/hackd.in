'use strict';

var createCompounder = require('./_createCompounder');

/**
 * Converts `string`, as space separated words, to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the upper cased string.
 * @example
 *
 * _.upperCase('--foo-bar');
 * // => 'FOO BAR'
 *
 * _.upperCase('fooBar');
 * // => 'FOO BAR'
 *
 * _.upperCase('__foo_bar__');
 * // => 'FOO BAR'
 */
var upperCase = createCompounder(function (result, word, index) {
  return result + (index ? ' ' : '') + word.toUpperCase();
});

module.exports = upperCase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VwcGVyQ2FzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksbUJBQW1CLFFBQVEscUJBQVIsQ0FBbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkosSUFBSSxZQUFZLGlCQUFpQixVQUFTLE1BQVQsRUFBaUIsSUFBakIsRUFBdUIsS0FBdkIsRUFBOEI7QUFDN0QsU0FBTyxVQUFVLFFBQVEsR0FBUixHQUFjLEVBQWQsQ0FBVixHQUE4QixLQUFLLFdBQUwsRUFBOUIsQ0FEc0Q7Q0FBOUIsQ0FBN0I7O0FBSUosT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6InVwcGVyQ2FzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVDb21wb3VuZGVyID0gcmVxdWlyZSgnLi9fY3JlYXRlQ29tcG91bmRlcicpO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgLCBhcyBzcGFjZSBzZXBhcmF0ZWQgd29yZHMsIHRvIHVwcGVyIGNhc2UuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVwcGVyIGNhc2VkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy51cHBlckNhc2UoJy0tZm9vLWJhcicpO1xuICogLy8gPT4gJ0ZPTyBCQVInXG4gKlxuICogXy51cHBlckNhc2UoJ2Zvb0JhcicpO1xuICogLy8gPT4gJ0ZPTyBCQVInXG4gKlxuICogXy51cHBlckNhc2UoJ19fZm9vX2Jhcl9fJyk7XG4gKiAvLyA9PiAnRk9PIEJBUidcbiAqL1xudmFyIHVwcGVyQ2FzZSA9IGNyZWF0ZUNvbXBvdW5kZXIoZnVuY3Rpb24ocmVzdWx0LCB3b3JkLCBpbmRleCkge1xuICByZXR1cm4gcmVzdWx0ICsgKGluZGV4ID8gJyAnIDogJycpICsgd29yZC50b1VwcGVyQ2FzZSgpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdXBwZXJDYXNlO1xuIl19