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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3N0YXJ0Q2FzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksbUJBQW1CLFFBQVEscUJBQVIsQ0FBbkI7SUFDQSxhQUFhLFFBQVEsY0FBUixDQUFiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCSixJQUFJLFlBQVksaUJBQWlCLFVBQVMsTUFBVCxFQUFpQixJQUFqQixFQUF1QixLQUF2QixFQUE4QjtBQUM3RCxTQUFPLFVBQVUsUUFBUSxHQUFSLEdBQWMsRUFBZCxDQUFWLEdBQThCLFdBQVcsSUFBWCxDQUE5QixDQURzRDtDQUE5QixDQUE3Qjs7QUFJSixPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoic3RhcnRDYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZUNvbXBvdW5kZXIgPSByZXF1aXJlKCcuL19jcmVhdGVDb21wb3VuZGVyJyksXG4gICAgdXBwZXJGaXJzdCA9IHJlcXVpcmUoJy4vdXBwZXJGaXJzdCcpO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvXG4gKiBbc3RhcnQgY2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGV0dGVyX2Nhc2UjU3R5bGlzdGljX29yX3NwZWNpYWxpc2VkX3VzYWdlKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMS4wXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RhcnQgY2FzZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnN0YXJ0Q2FzZSgnLS1mb28tYmFyLS0nKTtcbiAqIC8vID0+ICdGb28gQmFyJ1xuICpcbiAqIF8uc3RhcnRDYXNlKCdmb29CYXInKTtcbiAqIC8vID0+ICdGb28gQmFyJ1xuICpcbiAqIF8uc3RhcnRDYXNlKCdfX0ZPT19CQVJfXycpO1xuICogLy8gPT4gJ0ZPTyBCQVInXG4gKi9cbnZhciBzdGFydENhc2UgPSBjcmVhdGVDb21wb3VuZGVyKGZ1bmN0aW9uKHJlc3VsdCwgd29yZCwgaW5kZXgpIHtcbiAgcmV0dXJuIHJlc3VsdCArIChpbmRleCA/ICcgJyA6ICcnKSArIHVwcGVyRmlyc3Qod29yZCk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdGFydENhc2U7XG4iXX0=