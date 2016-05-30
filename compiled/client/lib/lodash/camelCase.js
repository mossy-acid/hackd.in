'use strict';

var capitalize = require('./capitalize'),
    createCompounder = require('./_createCompounder');

/**
 * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the camel cased string.
 * @example
 *
 * _.camelCase('Foo Bar');
 * // => 'fooBar'
 *
 * _.camelCase('--foo-bar--');
 * // => 'fooBar'
 *
 * _.camelCase('__FOO_BAR__');
 * // => 'fooBar'
 */
var camelCase = createCompounder(function (result, word, index) {
  word = word.toLowerCase();
  return result + (index ? capitalize(word) : word);
});

module.exports = camelCase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NhbWVsQ2FzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGNBQVIsQ0FBakI7SUFDSSxtQkFBbUIsUUFBUSxxQkFBUixDQUR2Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCQSxJQUFJLFlBQVksaUJBQWlCLFVBQVMsTUFBVCxFQUFpQixJQUFqQixFQUF1QixLQUF2QixFQUE4QjtBQUM3RCxTQUFPLEtBQUssV0FBTCxFQUFQO0FBQ0EsU0FBTyxVQUFVLFFBQVEsV0FBVyxJQUFYLENBQVIsR0FBMkIsSUFBckMsQ0FBUDtBQUNELENBSGUsQ0FBaEI7O0FBS0EsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6ImNhbWVsQ2FzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjYXBpdGFsaXplID0gcmVxdWlyZSgnLi9jYXBpdGFsaXplJyksXG4gICAgY3JlYXRlQ29tcG91bmRlciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUNvbXBvdW5kZXInKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgc3RyaW5nYCB0byBbY2FtZWwgY2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ2FtZWxDYXNlKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY2FtZWwgY2FzZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmNhbWVsQ2FzZSgnRm9vIEJhcicpO1xuICogLy8gPT4gJ2Zvb0JhcidcbiAqXG4gKiBfLmNhbWVsQ2FzZSgnLS1mb28tYmFyLS0nKTtcbiAqIC8vID0+ICdmb29CYXInXG4gKlxuICogXy5jYW1lbENhc2UoJ19fRk9PX0JBUl9fJyk7XG4gKiAvLyA9PiAnZm9vQmFyJ1xuICovXG52YXIgY2FtZWxDYXNlID0gY3JlYXRlQ29tcG91bmRlcihmdW5jdGlvbihyZXN1bHQsIHdvcmQsIGluZGV4KSB7XG4gIHdvcmQgPSB3b3JkLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiByZXN1bHQgKyAoaW5kZXggPyBjYXBpdGFsaXplKHdvcmQpIDogd29yZCk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYW1lbENhc2U7XG4iXX0=