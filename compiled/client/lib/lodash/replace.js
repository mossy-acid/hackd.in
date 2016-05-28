'use strict';

var toString = require('./toString');

/** Used for built-in method references. */
var stringProto = String.prototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeReplace = stringProto.replace;

/**
 * Replaces matches for `pattern` in `string` with `replacement`.
 *
 * **Note:** This method is based on
 * [`String#replace`](https://mdn.io/String/replace).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to modify.
 * @param {RegExp|string} pattern The pattern to replace.
 * @param {Function|string} replacement The match replacement.
 * @returns {string} Returns the modified string.
 * @example
 *
 * _.replace('Hi Fred', 'Fred', 'Barney');
 * // => 'Hi Barney'
 */
function replace() {
  var args = arguments,
      string = toString(args[0]);

  return args.length < 3 ? string : nativeReplace.call(string, args[1], args[2]);
}

module.exports = replace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3JlcGxhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQVg7OztBQUdKLElBQUksY0FBYyxPQUFPLFNBQVA7OztBQUdsQixJQUFJLGdCQUFnQixZQUFZLE9BQVo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCcEIsU0FBUyxPQUFULEdBQW1CO0FBQ2pCLE1BQUksT0FBTyxTQUFQO01BQ0EsU0FBUyxTQUFTLEtBQUssQ0FBTCxDQUFULENBQVQsQ0FGYTs7QUFJakIsU0FBTyxLQUFLLE1BQUwsR0FBYyxDQUFkLEdBQWtCLE1BQWxCLEdBQTJCLGNBQWMsSUFBZCxDQUFtQixNQUFuQixFQUEyQixLQUFLLENBQUwsQ0FBM0IsRUFBb0MsS0FBSyxDQUFMLENBQXBDLENBQTNCLENBSlU7Q0FBbkI7O0FBT0EsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6InJlcGxhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBzdHJpbmdQcm90byA9IFN0cmluZy5wcm90b3R5cGU7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVSZXBsYWNlID0gc3RyaW5nUHJvdG8ucmVwbGFjZTtcblxuLyoqXG4gKiBSZXBsYWNlcyBtYXRjaGVzIGZvciBgcGF0dGVybmAgaW4gYHN0cmluZ2Agd2l0aCBgcmVwbGFjZW1lbnRgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBiYXNlZCBvblxuICogW2BTdHJpbmcjcmVwbGFjZWBdKGh0dHBzOi8vbWRuLmlvL1N0cmluZy9yZXBsYWNlKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge1JlZ0V4cHxzdHJpbmd9IHBhdHRlcm4gVGhlIHBhdHRlcm4gdG8gcmVwbGFjZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSByZXBsYWNlbWVudCBUaGUgbWF0Y2ggcmVwbGFjZW1lbnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBtb2RpZmllZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ucmVwbGFjZSgnSGkgRnJlZCcsICdGcmVkJywgJ0Jhcm5leScpO1xuICogLy8gPT4gJ0hpIEJhcm5leSdcbiAqL1xuZnVuY3Rpb24gcmVwbGFjZSgpIHtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICBzdHJpbmcgPSB0b1N0cmluZyhhcmdzWzBdKTtcblxuICByZXR1cm4gYXJncy5sZW5ndGggPCAzID8gc3RyaW5nIDogbmF0aXZlUmVwbGFjZS5jYWxsKHN0cmluZywgYXJnc1sxXSwgYXJnc1syXSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVwbGFjZTtcbiJdfQ==