'use strict';

var root = require('./_root'),
    toString = require('./toString');

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect hexadecimal string values. */
var reHasHexPrefix = /^0x/i;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeParseInt = root.parseInt;

/**
 * Converts `string` to an integer of the specified radix. If `radix` is
 * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
 * hexadecimal, in which case a `radix` of `16` is used.
 *
 * **Note:** This method aligns with the
 * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category String
 * @param {string} string The string to convert.
 * @param {number} [radix=10] The radix to interpret `value` by.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.parseInt('08');
 * // => 8
 *
 * _.map(['6', '08', '10'], _.parseInt);
 * // => [6, 8, 10]
 */
function parseInt(string, radix, guard) {
  // Chrome fails to trim leading <BOM> whitespace characters.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=3109 for more details.
  if (guard || radix == null) {
    radix = 0;
  } else if (radix) {
    radix = +radix;
  }
  string = toString(string).replace(reTrim, '');
  return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
}

module.exports = parseInt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3BhcnNlSW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxPQUFPLFFBQVEsU0FBUixDQUFQO0lBQ0EsV0FBVyxRQUFRLFlBQVIsQ0FBWDs7O0FBR0osSUFBSSxTQUFTLFlBQVQ7OztBQUdKLElBQUksaUJBQWlCLE1BQWpCOzs7QUFHSixJQUFJLGlCQUFpQixLQUFLLFFBQUw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJyQixTQUFTLFFBQVQsQ0FBa0IsTUFBbEIsRUFBMEIsS0FBMUIsRUFBaUMsS0FBakMsRUFBd0M7OztBQUd0QyxNQUFJLFNBQVMsU0FBUyxJQUFULEVBQWU7QUFDMUIsWUFBUSxDQUFSLENBRDBCO0dBQTVCLE1BRU8sSUFBSSxLQUFKLEVBQVc7QUFDaEIsWUFBUSxDQUFDLEtBQUQsQ0FEUTtHQUFYO0FBR1AsV0FBUyxTQUFTLE1BQVQsRUFBaUIsT0FBakIsQ0FBeUIsTUFBekIsRUFBaUMsRUFBakMsQ0FBVCxDQVJzQztBQVN0QyxTQUFPLGVBQWUsTUFBZixFQUF1QixVQUFVLGVBQWUsSUFBZixDQUFvQixNQUFwQixJQUE4QixFQUE5QixHQUFtQyxFQUFuQyxDQUFWLENBQTlCLENBVHNDO0NBQXhDOztBQVlBLE9BQU8sT0FBUCxHQUFpQixRQUFqQiIsImZpbGUiOiJwYXJzZUludC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUhhc0hleFByZWZpeCA9IC9eMHgvaTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZVBhcnNlSW50ID0gcm9vdC5wYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgc3RyaW5nYCB0byBhbiBpbnRlZ2VyIG9mIHRoZSBzcGVjaWZpZWQgcmFkaXguIElmIGByYWRpeGAgaXNcbiAqIGB1bmRlZmluZWRgIG9yIGAwYCwgYSBgcmFkaXhgIG9mIGAxMGAgaXMgdXNlZCB1bmxlc3MgYHZhbHVlYCBpcyBhXG4gKiBoZXhhZGVjaW1hbCwgaW4gd2hpY2ggY2FzZSBhIGByYWRpeGAgb2YgYDE2YCBpcyB1c2VkLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBhbGlnbnMgd2l0aCB0aGVcbiAqIFtFUzUgaW1wbGVtZW50YXRpb25dKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjEuMi4yKSBvZiBgcGFyc2VJbnRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMS4xLjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtyYWRpeD0xMF0gVGhlIHJhZGl4IHRvIGludGVycHJldCBgdmFsdWVgIGJ5LlxuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnBhcnNlSW50KCcwOCcpO1xuICogLy8gPT4gOFxuICpcbiAqIF8ubWFwKFsnNicsICcwOCcsICcxMCddLCBfLnBhcnNlSW50KTtcbiAqIC8vID0+IFs2LCA4LCAxMF1cbiAqL1xuZnVuY3Rpb24gcGFyc2VJbnQoc3RyaW5nLCByYWRpeCwgZ3VhcmQpIHtcbiAgLy8gQ2hyb21lIGZhaWxzIHRvIHRyaW0gbGVhZGluZyA8Qk9NPiB3aGl0ZXNwYWNlIGNoYXJhY3RlcnMuXG4gIC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMTA5IGZvciBtb3JlIGRldGFpbHMuXG4gIGlmIChndWFyZCB8fCByYWRpeCA9PSBudWxsKSB7XG4gICAgcmFkaXggPSAwO1xuICB9IGVsc2UgaWYgKHJhZGl4KSB7XG4gICAgcmFkaXggPSArcmFkaXg7XG4gIH1cbiAgc3RyaW5nID0gdG9TdHJpbmcoc3RyaW5nKS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICByZXR1cm4gbmF0aXZlUGFyc2VJbnQoc3RyaW5nLCByYWRpeCB8fCAocmVIYXNIZXhQcmVmaXgudGVzdChzdHJpbmcpID8gMTYgOiAxMCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlSW50O1xuIl19