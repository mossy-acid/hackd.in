'use strict';

var baseToString = require('./_baseToString'),
    castSlice = require('./_castSlice'),
    isIterateeCall = require('./_isIterateeCall'),
    isRegExp = require('./isRegExp'),
    reHasComplexSymbol = require('./_reHasComplexSymbol'),
    stringToArray = require('./_stringToArray'),
    toString = require('./toString');

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/** Used for built-in method references. */
var stringProto = String.prototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeSplit = stringProto.split;

/**
 * Splits `string` by `separator`.
 *
 * **Note:** This method is based on
 * [`String#split`](https://mdn.io/String/split).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to split.
 * @param {RegExp|string} separator The separator pattern to split by.
 * @param {number} [limit] The length to truncate results to.
 * @returns {Array} Returns the string segments.
 * @example
 *
 * _.split('a-b-c', '-', 2);
 * // => ['a', 'b']
 */
function split(string, separator, limit) {
  if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
    separator = limit = undefined;
  }
  limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
  if (!limit) {
    return [];
  }
  string = toString(string);
  if (string && (typeof separator == 'string' || separator != null && !isRegExp(separator))) {
    separator = baseToString(separator);
    if (separator == '' && reHasComplexSymbol.test(string)) {
      return castSlice(stringToArray(string), 0, limit);
    }
  }
  return nativeSplit.call(string, separator, limit);
}

module.exports = split;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NwbGl0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxlQUFlLFFBQVEsaUJBQVIsQ0FBZjtJQUNBLFlBQVksUUFBUSxjQUFSLENBQVo7SUFDQSxpQkFBaUIsUUFBUSxtQkFBUixDQUFqQjtJQUNBLFdBQVcsUUFBUSxZQUFSLENBQVg7SUFDQSxxQkFBcUIsUUFBUSx1QkFBUixDQUFyQjtJQUNBLGdCQUFnQixRQUFRLGtCQUFSLENBQWhCO0lBQ0EsV0FBVyxRQUFRLFlBQVIsQ0FBWDs7O0FBR0osSUFBSSxtQkFBbUIsVUFBbkI7OztBQUdKLElBQUksY0FBYyxPQUFPLFNBQVA7OztBQUdsQixJQUFJLGNBQWMsWUFBWSxLQUFaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQmxCLFNBQVMsS0FBVCxDQUFlLE1BQWYsRUFBdUIsU0FBdkIsRUFBa0MsS0FBbEMsRUFBeUM7QUFDdkMsTUFBSSxTQUFTLE9BQU8sS0FBUCxJQUFnQixRQUFoQixJQUE0QixlQUFlLE1BQWYsRUFBdUIsU0FBdkIsRUFBa0MsS0FBbEMsQ0FBckMsRUFBK0U7QUFDakYsZ0JBQVksUUFBUSxTQUFSLENBRHFFO0dBQW5GO0FBR0EsVUFBUSxVQUFVLFNBQVYsR0FBc0IsZ0JBQXRCLEdBQXlDLFVBQVUsQ0FBVixDQUpWO0FBS3ZDLE1BQUksQ0FBQyxLQUFELEVBQVE7QUFDVixXQUFPLEVBQVAsQ0FEVTtHQUFaO0FBR0EsV0FBUyxTQUFTLE1BQVQsQ0FBVCxDQVJ1QztBQVN2QyxNQUFJLFdBQ0UsT0FBTyxTQUFQLElBQW9CLFFBQXBCLElBQ0MsYUFBYSxJQUFiLElBQXFCLENBQUMsU0FBUyxTQUFULENBQUQsQ0FGeEIsRUFHRztBQUNMLGdCQUFZLGFBQWEsU0FBYixDQUFaLENBREs7QUFFTCxRQUFJLGFBQWEsRUFBYixJQUFtQixtQkFBbUIsSUFBbkIsQ0FBd0IsTUFBeEIsQ0FBbkIsRUFBb0Q7QUFDdEQsYUFBTyxVQUFVLGNBQWMsTUFBZCxDQUFWLEVBQWlDLENBQWpDLEVBQW9DLEtBQXBDLENBQVAsQ0FEc0Q7S0FBeEQ7R0FMRjtBQVNBLFNBQU8sWUFBWSxJQUFaLENBQWlCLE1BQWpCLEVBQXlCLFNBQXpCLEVBQW9DLEtBQXBDLENBQVAsQ0FsQnVDO0NBQXpDOztBQXFCQSxPQUFPLE9BQVAsR0FBaUIsS0FBakIiLCJmaWxlIjoic3BsaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVRvU3RyaW5nID0gcmVxdWlyZSgnLi9fYmFzZVRvU3RyaW5nJyksXG4gICAgY2FzdFNsaWNlID0gcmVxdWlyZSgnLi9fY2FzdFNsaWNlJyksXG4gICAgaXNJdGVyYXRlZUNhbGwgPSByZXF1aXJlKCcuL19pc0l0ZXJhdGVlQ2FsbCcpLFxuICAgIGlzUmVnRXhwID0gcmVxdWlyZSgnLi9pc1JlZ0V4cCcpLFxuICAgIHJlSGFzQ29tcGxleFN5bWJvbCA9IHJlcXVpcmUoJy4vX3JlSGFzQ29tcGxleFN5bWJvbCcpLFxuICAgIHN0cmluZ1RvQXJyYXkgPSByZXF1aXJlKCcuL19zdHJpbmdUb0FycmF5JyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHRoZSBtYXhpbXVtIGxlbmd0aCBhbmQgaW5kZXggb2YgYW4gYXJyYXkuICovXG52YXIgTUFYX0FSUkFZX0xFTkdUSCA9IDQyOTQ5NjcyOTU7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBzdHJpbmdQcm90byA9IFN0cmluZy5wcm90b3R5cGU7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVTcGxpdCA9IHN0cmluZ1Byb3RvLnNwbGl0O1xuXG4vKipcbiAqIFNwbGl0cyBgc3RyaW5nYCBieSBgc2VwYXJhdG9yYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb25cbiAqIFtgU3RyaW5nI3NwbGl0YF0oaHR0cHM6Ly9tZG4uaW8vU3RyaW5nL3NwbGl0KS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBzcGxpdC5cbiAqIEBwYXJhbSB7UmVnRXhwfHN0cmluZ30gc2VwYXJhdG9yIFRoZSBzZXBhcmF0b3IgcGF0dGVybiB0byBzcGxpdCBieS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGltaXRdIFRoZSBsZW5ndGggdG8gdHJ1bmNhdGUgcmVzdWx0cyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc3RyaW5nIHNlZ21lbnRzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnNwbGl0KCdhLWItYycsICctJywgMik7XG4gKiAvLyA9PiBbJ2EnLCAnYiddXG4gKi9cbmZ1bmN0aW9uIHNwbGl0KHN0cmluZywgc2VwYXJhdG9yLCBsaW1pdCkge1xuICBpZiAobGltaXQgJiYgdHlwZW9mIGxpbWl0ICE9ICdudW1iZXInICYmIGlzSXRlcmF0ZWVDYWxsKHN0cmluZywgc2VwYXJhdG9yLCBsaW1pdCkpIHtcbiAgICBzZXBhcmF0b3IgPSBsaW1pdCA9IHVuZGVmaW5lZDtcbiAgfVxuICBsaW1pdCA9IGxpbWl0ID09PSB1bmRlZmluZWQgPyBNQVhfQVJSQVlfTEVOR1RIIDogbGltaXQgPj4+IDA7XG4gIGlmICghbGltaXQpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgc3RyaW5nID0gdG9TdHJpbmcoc3RyaW5nKTtcbiAgaWYgKHN0cmluZyAmJiAoXG4gICAgICAgIHR5cGVvZiBzZXBhcmF0b3IgPT0gJ3N0cmluZycgfHxcbiAgICAgICAgKHNlcGFyYXRvciAhPSBudWxsICYmICFpc1JlZ0V4cChzZXBhcmF0b3IpKVxuICAgICAgKSkge1xuICAgIHNlcGFyYXRvciA9IGJhc2VUb1N0cmluZyhzZXBhcmF0b3IpO1xuICAgIGlmIChzZXBhcmF0b3IgPT0gJycgJiYgcmVIYXNDb21wbGV4U3ltYm9sLnRlc3Qoc3RyaW5nKSkge1xuICAgICAgcmV0dXJuIGNhc3RTbGljZShzdHJpbmdUb0FycmF5KHN0cmluZyksIDAsIGxpbWl0KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5hdGl2ZVNwbGl0LmNhbGwoc3RyaW5nLCBzZXBhcmF0b3IsIGxpbWl0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzcGxpdDtcbiJdfQ==