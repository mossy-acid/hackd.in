'use strict';

var createCompounder = require('./_createCompounder');

/**
 * Converts `string`, as space separated words, to lower case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the lower cased string.
 * @example
 *
 * _.lowerCase('--Foo-Bar--');
 * // => 'foo bar'
 *
 * _.lowerCase('fooBar');
 * // => 'foo bar'
 *
 * _.lowerCase('__FOO_BAR__');
 * // => 'foo bar'
 */
var lowerCase = createCompounder(function (result, word, index) {
  return result + (index ? ' ' : '') + word.toLowerCase();
});

module.exports = lowerCase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2xvd2VyQ2FzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksbUJBQW1CLFFBQVEscUJBQVIsQ0FBbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkosSUFBSSxZQUFZLGlCQUFpQixVQUFTLE1BQVQsRUFBaUIsSUFBakIsRUFBdUIsS0FBdkIsRUFBOEI7QUFDN0QsU0FBTyxVQUFVLFFBQVEsR0FBUixHQUFjLEVBQWQsQ0FBVixHQUE4QixLQUFLLFdBQUwsRUFBOUIsQ0FEc0Q7Q0FBOUIsQ0FBN0I7O0FBSUosT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6Imxvd2VyQ2FzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVDb21wb3VuZGVyID0gcmVxdWlyZSgnLi9fY3JlYXRlQ29tcG91bmRlcicpO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgLCBhcyBzcGFjZSBzZXBhcmF0ZWQgd29yZHMsIHRvIGxvd2VyIGNhc2UuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGxvd2VyIGNhc2VkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5sb3dlckNhc2UoJy0tRm9vLUJhci0tJyk7XG4gKiAvLyA9PiAnZm9vIGJhcidcbiAqXG4gKiBfLmxvd2VyQ2FzZSgnZm9vQmFyJyk7XG4gKiAvLyA9PiAnZm9vIGJhcidcbiAqXG4gKiBfLmxvd2VyQ2FzZSgnX19GT09fQkFSX18nKTtcbiAqIC8vID0+ICdmb28gYmFyJ1xuICovXG52YXIgbG93ZXJDYXNlID0gY3JlYXRlQ29tcG91bmRlcihmdW5jdGlvbihyZXN1bHQsIHdvcmQsIGluZGV4KSB7XG4gIHJldHVybiByZXN1bHQgKyAoaW5kZXggPyAnICcgOiAnJykgKyB3b3JkLnRvTG93ZXJDYXNlKCk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBsb3dlckNhc2U7XG4iXX0=