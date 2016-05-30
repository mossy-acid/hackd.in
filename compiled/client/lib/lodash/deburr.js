'use strict';

var deburrLetter = require('./_deburrLetter'),
    toString = require('./toString');

/** Used to match latin-1 supplementary letters (excluding mathematical operators). */
var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

/** Used to compose unicode character classes. */
var rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0';

/** Used to compose unicode capture groups. */
var rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']';

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo, 'g');

/**
 * Deburrs `string` by converting
 * [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * to basic latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
}

module.exports = deburr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2RlYnVyci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxRQUFRLGlCQUFSLENBQW5CO0lBQ0ksV0FBVyxRQUFRLFlBQVIsQ0FEZjs7O0FBSUEsSUFBSSxXQUFXLHlDQUFmOzs7QUFHQSxJQUFJLG9CQUFvQixnQ0FBeEI7SUFDSSxzQkFBc0IsaUJBRDFCOzs7QUFJQSxJQUFJLFVBQVUsTUFBTSxpQkFBTixHQUEwQixtQkFBMUIsR0FBZ0QsR0FBOUQ7Ozs7OztBQU1BLElBQUksY0FBYyxPQUFPLE9BQVAsRUFBZ0IsR0FBaEIsQ0FBbEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsU0FBUyxNQUFULENBQWdCLE1BQWhCLEVBQXdCO0FBQ3RCLFdBQVMsU0FBUyxNQUFULENBQVQ7QUFDQSxTQUFPLFVBQVUsT0FBTyxPQUFQLENBQWUsUUFBZixFQUF5QixZQUF6QixFQUF1QyxPQUF2QyxDQUErQyxXQUEvQyxFQUE0RCxFQUE1RCxDQUFqQjtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJkZWJ1cnIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZGVidXJyTGV0dGVyID0gcmVxdWlyZSgnLi9fZGVidXJyTGV0dGVyJyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxhdGluLTEgc3VwcGxlbWVudGFyeSBsZXR0ZXJzIChleGNsdWRpbmcgbWF0aGVtYXRpY2FsIG9wZXJhdG9ycykuICovXG52YXIgcmVMYXRpbjEgPSAvW1xceGMwLVxceGQ2XFx4ZDgtXFx4ZGVcXHhkZi1cXHhmNlxceGY4LVxceGZmXS9nO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIHVuaWNvZGUgY2hhcmFjdGVyIGNsYXNzZXMuICovXG52YXIgcnNDb21ib01hcmtzUmFuZ2UgPSAnXFxcXHUwMzAwLVxcXFx1MDM2ZlxcXFx1ZmUyMC1cXFxcdWZlMjMnLFxuICAgIHJzQ29tYm9TeW1ib2xzUmFuZ2UgPSAnXFxcXHUyMGQwLVxcXFx1MjBmMCc7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgdW5pY29kZSBjYXB0dXJlIGdyb3Vwcy4gKi9cbnZhciByc0NvbWJvID0gJ1snICsgcnNDb21ib01hcmtzUmFuZ2UgKyByc0NvbWJvU3ltYm9sc1JhbmdlICsgJ10nO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggW2NvbWJpbmluZyBkaWFjcml0aWNhbCBtYXJrc10oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29tYmluaW5nX0RpYWNyaXRpY2FsX01hcmtzKSBhbmRcbiAqIFtjb21iaW5pbmcgZGlhY3JpdGljYWwgbWFya3MgZm9yIHN5bWJvbHNdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvbWJpbmluZ19EaWFjcml0aWNhbF9NYXJrc19mb3JfU3ltYm9scykuXG4gKi9cbnZhciByZUNvbWJvTWFyayA9IFJlZ0V4cChyc0NvbWJvLCAnZycpO1xuXG4vKipcbiAqIERlYnVycnMgYHN0cmluZ2AgYnkgY29udmVydGluZ1xuICogW2xhdGluLTEgc3VwcGxlbWVudGFyeSBsZXR0ZXJzXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MYXRpbi0xX1N1cHBsZW1lbnRfKFVuaWNvZGVfYmxvY2spI0NoYXJhY3Rlcl90YWJsZSlcbiAqIHRvIGJhc2ljIGxhdGluIGxldHRlcnMgYW5kIHJlbW92aW5nXG4gKiBbY29tYmluaW5nIGRpYWNyaXRpY2FsIG1hcmtzXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db21iaW5pbmdfRGlhY3JpdGljYWxfTWFya3MpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIGRlYnVyci5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGRlYnVycmVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWJ1cnIoJ2TDqWrDoCB2dScpO1xuICogLy8gPT4gJ2RlamEgdnUnXG4gKi9cbmZ1bmN0aW9uIGRlYnVycihzdHJpbmcpIHtcbiAgc3RyaW5nID0gdG9TdHJpbmcoc3RyaW5nKTtcbiAgcmV0dXJuIHN0cmluZyAmJiBzdHJpbmcucmVwbGFjZShyZUxhdGluMSwgZGVidXJyTGV0dGVyKS5yZXBsYWNlKHJlQ29tYm9NYXJrLCAnJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVidXJyO1xuIl19