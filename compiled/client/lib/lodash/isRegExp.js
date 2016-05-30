'use strict';

var isObject = require('./isObject');

/** `Object#toString` result references. */
var regexpTag = '[object RegExp]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `RegExp` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isRegExp(/abc/);
 * // => true
 *
 * _.isRegExp('/abc/');
 * // => false
 */
function isRegExp(value) {
  return isObject(value) && objectToString.call(value) == regexpTag;
}

module.exports = isRegExp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzUmVnRXhwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLFFBQVEsWUFBUixDQUFmOzs7QUFHQSxJQUFJLFlBQVksaUJBQWhCOzs7QUFHQSxJQUFJLGNBQWMsT0FBTyxTQUF6Qjs7Ozs7OztBQU9BLElBQUksaUJBQWlCLFlBQVksUUFBakM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUF5QjtBQUN2QixTQUFPLFNBQVMsS0FBVCxLQUFtQixlQUFlLElBQWYsQ0FBb0IsS0FBcEIsS0FBOEIsU0FBeEQ7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiaXNSZWdFeHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBSZWdFeHBgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNSZWdFeHAoL2FiYy8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNSZWdFeHAoJy9hYmMvJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1JlZ0V4cCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHJlZ2V4cFRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1JlZ0V4cDtcbiJdfQ==