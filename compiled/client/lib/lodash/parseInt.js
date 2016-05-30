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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3BhcnNlSW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxPQUFPLFFBQVEsU0FBUixDQUFYO0lBQ0ksV0FBVyxRQUFRLFlBQVIsQ0FEZjs7O0FBSUEsSUFBSSxTQUFTLFlBQWI7OztBQUdBLElBQUksaUJBQWlCLE1BQXJCOzs7QUFHQSxJQUFJLGlCQUFpQixLQUFLLFFBQTFCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxTQUFTLFFBQVQsQ0FBa0IsTUFBbEIsRUFBMEIsS0FBMUIsRUFBaUMsS0FBakMsRUFBd0M7OztBQUd0QyxNQUFJLFNBQVMsU0FBUyxJQUF0QixFQUE0QjtBQUMxQixZQUFRLENBQVI7QUFDRCxHQUZELE1BRU8sSUFBSSxLQUFKLEVBQVc7QUFDaEIsWUFBUSxDQUFDLEtBQVQ7QUFDRDtBQUNELFdBQVMsU0FBUyxNQUFULEVBQWlCLE9BQWpCLENBQXlCLE1BQXpCLEVBQWlDLEVBQWpDLENBQVQ7QUFDQSxTQUFPLGVBQWUsTUFBZixFQUF1QixVQUFVLGVBQWUsSUFBZixDQUFvQixNQUFwQixJQUE4QixFQUE5QixHQUFtQyxFQUE3QyxDQUF2QixDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6InBhcnNlSW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290JyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSGFzSGV4UHJlZml4ID0gL14weC9pO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlUGFyc2VJbnQgPSByb290LnBhcnNlSW50O1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvIGFuIGludGVnZXIgb2YgdGhlIHNwZWNpZmllZCByYWRpeC4gSWYgYHJhZGl4YCBpc1xuICogYHVuZGVmaW5lZGAgb3IgYDBgLCBhIGByYWRpeGAgb2YgYDEwYCBpcyB1c2VkIHVubGVzcyBgdmFsdWVgIGlzIGFcbiAqIGhleGFkZWNpbWFsLCBpbiB3aGljaCBjYXNlIGEgYHJhZGl4YCBvZiBgMTZgIGlzIHVzZWQuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGFsaWducyB3aXRoIHRoZVxuICogW0VTNSBpbXBsZW1lbnRhdGlvbl0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4MTUuMS4yLjIpIG9mIGBwYXJzZUludGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAxLjEuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcGFyYW0ge251bWJlcn0gW3JhZGl4PTEwXSBUaGUgcmFkaXggdG8gaW50ZXJwcmV0IGB2YWx1ZWAgYnkuXG4gKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYW4gaXRlcmF0ZWUgZm9yIG1ldGhvZHMgbGlrZSBgXy5tYXBgLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY29udmVydGVkIGludGVnZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ucGFyc2VJbnQoJzA4Jyk7XG4gKiAvLyA9PiA4XG4gKlxuICogXy5tYXAoWyc2JywgJzA4JywgJzEwJ10sIF8ucGFyc2VJbnQpO1xuICogLy8gPT4gWzYsIDgsIDEwXVxuICovXG5mdW5jdGlvbiBwYXJzZUludChzdHJpbmcsIHJhZGl4LCBndWFyZCkge1xuICAvLyBDaHJvbWUgZmFpbHMgdG8gdHJpbSBsZWFkaW5nIDxCT00+IHdoaXRlc3BhY2UgY2hhcmFjdGVycy5cbiAgLy8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMxMDkgZm9yIG1vcmUgZGV0YWlscy5cbiAgaWYgKGd1YXJkIHx8IHJhZGl4ID09IG51bGwpIHtcbiAgICByYWRpeCA9IDA7XG4gIH0gZWxzZSBpZiAocmFkaXgpIHtcbiAgICByYWRpeCA9ICtyYWRpeDtcbiAgfVxuICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHJldHVybiBuYXRpdmVQYXJzZUludChzdHJpbmcsIHJhZGl4IHx8IChyZUhhc0hleFByZWZpeC50ZXN0KHN0cmluZykgPyAxNiA6IDEwKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VJbnQ7XG4iXX0=