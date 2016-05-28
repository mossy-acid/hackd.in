'use strict';

var createCompounder = require('./_createCompounder');

/**
 * Converts `string` to
 * [snake case](https://en.wikipedia.org/wiki/Snake_case).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the snake cased string.
 * @example
 *
 * _.snakeCase('Foo Bar');
 * // => 'foo_bar'
 *
 * _.snakeCase('fooBar');
 * // => 'foo_bar'
 *
 * _.snakeCase('--FOO-BAR--');
 * // => 'foo_bar'
 */
var snakeCase = createCompounder(function (result, word, index) {
  return result + (index ? '_' : '') + word.toLowerCase();
});

module.exports = snakeCase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NuYWtlQ2FzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksbUJBQW1CLFFBQVEscUJBQVIsQ0FBbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJKLElBQUksWUFBWSxpQkFBaUIsVUFBUyxNQUFULEVBQWlCLElBQWpCLEVBQXVCLEtBQXZCLEVBQThCO0FBQzdELFNBQU8sVUFBVSxRQUFRLEdBQVIsR0FBYyxFQUFkLENBQVYsR0FBOEIsS0FBSyxXQUFMLEVBQTlCLENBRHNEO0NBQTlCLENBQTdCOztBQUlKLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJzbmFrZUNhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3JlYXRlQ29tcG91bmRlciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUNvbXBvdW5kZXInKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgc3RyaW5nYCB0b1xuICogW3NuYWtlIGNhc2VdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1NuYWtlX2Nhc2UpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzbmFrZSBjYXNlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uc25ha2VDYXNlKCdGb28gQmFyJyk7XG4gKiAvLyA9PiAnZm9vX2JhcidcbiAqXG4gKiBfLnNuYWtlQ2FzZSgnZm9vQmFyJyk7XG4gKiAvLyA9PiAnZm9vX2JhcidcbiAqXG4gKiBfLnNuYWtlQ2FzZSgnLS1GT08tQkFSLS0nKTtcbiAqIC8vID0+ICdmb29fYmFyJ1xuICovXG52YXIgc25ha2VDYXNlID0gY3JlYXRlQ29tcG91bmRlcihmdW5jdGlvbihyZXN1bHQsIHdvcmQsIGluZGV4KSB7XG4gIHJldHVybiByZXN1bHQgKyAoaW5kZXggPyAnXycgOiAnJykgKyB3b3JkLnRvTG93ZXJDYXNlKCk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzbmFrZUNhc2U7XG4iXX0=