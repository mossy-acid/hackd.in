'use strict';

var toString = require('./toString'),
    unescapeHtmlChar = require('./_unescapeHtmlChar');

/** Used to match HTML entities and HTML characters. */
var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
    reHasEscapedHtml = RegExp(reEscapedHtml.source);

/**
 * The inverse of `_.escape`; this method converts the HTML entities
 * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to
 * their corresponding characters.
 *
 * **Note:** No other HTML entities are unescaped. To unescape additional
 * HTML entities use a third-party library like [_he_](https://mths.be/he).
 *
 * @static
 * @memberOf _
 * @since 0.6.0
 * @category String
 * @param {string} [string=''] The string to unescape.
 * @returns {string} Returns the unescaped string.
 * @example
 *
 * _.unescape('fred, barney, &amp; pebbles');
 * // => 'fred, barney, & pebbles'
 */
function unescape(string) {
    string = toString(string);
    return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
}

module.exports = unescape;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3VuZXNjYXBlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLFFBQVEsWUFBUixDQUFmO0lBQ0ksbUJBQW1CLFFBQVEscUJBQVIsQ0FEdkI7OztBQUlBLElBQUksZ0JBQWdCLCtCQUFwQjtJQUNJLG1CQUFtQixPQUFPLGNBQWMsTUFBckIsQ0FEdkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQSxTQUFTLFFBQVQsQ0FBa0IsTUFBbEIsRUFBMEI7QUFDeEIsYUFBUyxTQUFTLE1BQVQsQ0FBVDtBQUNBLFdBQVEsVUFBVSxpQkFBaUIsSUFBakIsQ0FBc0IsTUFBdEIsQ0FBWCxHQUNILE9BQU8sT0FBUCxDQUFlLGFBQWYsRUFBOEIsZ0JBQTlCLENBREcsR0FFSCxNQUZKO0FBR0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6InVuZXNjYXBlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpLFxuICAgIHVuZXNjYXBlSHRtbENoYXIgPSByZXF1aXJlKCcuL191bmVzY2FwZUh0bWxDaGFyJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIEhUTUwgZW50aXRpZXMgYW5kIEhUTUwgY2hhcmFjdGVycy4gKi9cbnZhciByZUVzY2FwZWRIdG1sID0gLyYoPzphbXB8bHR8Z3R8cXVvdHwjMzl8Izk2KTsvZyxcbiAgICByZUhhc0VzY2FwZWRIdG1sID0gUmVnRXhwKHJlRXNjYXBlZEh0bWwuc291cmNlKTtcblxuLyoqXG4gKiBUaGUgaW52ZXJzZSBvZiBgXy5lc2NhcGVgOyB0aGlzIG1ldGhvZCBjb252ZXJ0cyB0aGUgSFRNTCBlbnRpdGllc1xuICogYCZhbXA7YCwgYCZsdDtgLCBgJmd0O2AsIGAmcXVvdDtgLCBgJiMzOTtgLCBhbmQgYCYjOTY7YCBpbiBgc3RyaW5nYCB0b1xuICogdGhlaXIgY29ycmVzcG9uZGluZyBjaGFyYWN0ZXJzLlxuICpcbiAqICoqTm90ZToqKiBObyBvdGhlciBIVE1MIGVudGl0aWVzIGFyZSB1bmVzY2FwZWQuIFRvIHVuZXNjYXBlIGFkZGl0aW9uYWxcbiAqIEhUTUwgZW50aXRpZXMgdXNlIGEgdGhpcmQtcGFydHkgbGlicmFyeSBsaWtlIFtfaGVfXShodHRwczovL210aHMuYmUvaGUpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC42LjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIHVuZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdW5lc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy51bmVzY2FwZSgnZnJlZCwgYmFybmV5LCAmYW1wOyBwZWJibGVzJyk7XG4gKiAvLyA9PiAnZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnXG4gKi9cbmZ1bmN0aW9uIHVuZXNjYXBlKHN0cmluZykge1xuICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpO1xuICByZXR1cm4gKHN0cmluZyAmJiByZUhhc0VzY2FwZWRIdG1sLnRlc3Qoc3RyaW5nKSlcbiAgICA/IHN0cmluZy5yZXBsYWNlKHJlRXNjYXBlZEh0bWwsIHVuZXNjYXBlSHRtbENoYXIpXG4gICAgOiBzdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdW5lc2NhcGU7XG4iXX0=