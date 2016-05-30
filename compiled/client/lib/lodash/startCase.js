'use strict';

var createCompounder = require('./_createCompounder'),
    upperFirst = require('./upperFirst');

/**
 * Converts `string` to
 * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
 *
 * @static
 * @memberOf _
 * @since 3.1.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the start cased string.
 * @example
 *
 * _.startCase('--foo-bar--');
 * // => 'Foo Bar'
 *
 * _.startCase('fooBar');
 * // => 'Foo Bar'
 *
 * _.startCase('__FOO_BAR__');
 * // => 'FOO BAR'
 */
var startCase = createCompounder(function (result, word, index) {
  return result + (index ? ' ' : '') + upperFirst(word);
});

module.exports = startCase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3N0YXJ0Q2FzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksbUJBQW1CLFFBQVEscUJBQVIsQ0FBdkI7SUFDSSxhQUFhLFFBQVEsY0FBUixDQURqQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QkEsSUFBSSxZQUFZLGlCQUFpQixVQUFTLE1BQVQsRUFBaUIsSUFBakIsRUFBdUIsS0FBdkIsRUFBOEI7QUFDN0QsU0FBTyxVQUFVLFFBQVEsR0FBUixHQUFjLEVBQXhCLElBQThCLFdBQVcsSUFBWCxDQUFyQztBQUNELENBRmUsQ0FBaEI7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6InN0YXJ0Q2FzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVDb21wb3VuZGVyID0gcmVxdWlyZSgnLi9fY3JlYXRlQ29tcG91bmRlcicpLFxuICAgIHVwcGVyRmlyc3QgPSByZXF1aXJlKCcuL3VwcGVyRmlyc3QnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgc3RyaW5nYCB0b1xuICogW3N0YXJ0IGNhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xldHRlcl9jYXNlI1N0eWxpc3RpY19vcl9zcGVjaWFsaXNlZF91c2FnZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjEuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0YXJ0IGNhc2VkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5zdGFydENhc2UoJy0tZm9vLWJhci0tJyk7XG4gKiAvLyA9PiAnRm9vIEJhcidcbiAqXG4gKiBfLnN0YXJ0Q2FzZSgnZm9vQmFyJyk7XG4gKiAvLyA9PiAnRm9vIEJhcidcbiAqXG4gKiBfLnN0YXJ0Q2FzZSgnX19GT09fQkFSX18nKTtcbiAqIC8vID0+ICdGT08gQkFSJ1xuICovXG52YXIgc3RhcnRDYXNlID0gY3JlYXRlQ29tcG91bmRlcihmdW5jdGlvbihyZXN1bHQsIHdvcmQsIGluZGV4KSB7XG4gIHJldHVybiByZXN1bHQgKyAoaW5kZXggPyAnICcgOiAnJykgKyB1cHBlckZpcnN0KHdvcmQpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhcnRDYXNlO1xuIl19