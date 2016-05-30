'use strict';

var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var errorTag = '[object Error]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an error object,
 *  else `false`.
 * @example
 *
 * _.isError(new Error);
 * // => true
 *
 * _.isError(Error);
 * // => false
 */
function isError(value) {
  if (!isObjectLike(value)) {
    return false;
  }
  return objectToString.call(value) == errorTag || typeof value.message == 'string' && typeof value.name == 'string';
}

module.exports = isError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzRXJyb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGVBQWUsUUFBUSxnQkFBUixDQUFuQjs7O0FBR0EsSUFBSSxXQUFXLGdCQUFmOzs7QUFHQSxJQUFJLGNBQWMsT0FBTyxTQUF6Qjs7Ozs7OztBQU9BLElBQUksaUJBQWlCLFlBQVksUUFBakM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQSxTQUFTLE9BQVQsQ0FBaUIsS0FBakIsRUFBd0I7QUFDdEIsTUFBSSxDQUFDLGFBQWEsS0FBYixDQUFMLEVBQTBCO0FBQ3hCLFdBQU8sS0FBUDtBQUNEO0FBQ0QsU0FBUSxlQUFlLElBQWYsQ0FBb0IsS0FBcEIsS0FBOEIsUUFBL0IsSUFDSixPQUFPLE1BQU0sT0FBYixJQUF3QixRQUF4QixJQUFvQyxPQUFPLE1BQU0sSUFBYixJQUFxQixRQUQ1RDtBQUVEOztBQUVELE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJpc0Vycm9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFuIGBFcnJvcmAsIGBFdmFsRXJyb3JgLCBgUmFuZ2VFcnJvcmAsIGBSZWZlcmVuY2VFcnJvcmAsXG4gKiBgU3ludGF4RXJyb3JgLCBgVHlwZUVycm9yYCwgb3IgYFVSSUVycm9yYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gZXJyb3Igb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Vycm9yKG5ldyBFcnJvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Vycm9yKEVycm9yKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRXJyb3IodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdExpa2UodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiAob2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZXJyb3JUYWcpIHx8XG4gICAgKHR5cGVvZiB2YWx1ZS5tZXNzYWdlID09ICdzdHJpbmcnICYmIHR5cGVvZiB2YWx1ZS5uYW1lID09ICdzdHJpbmcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Vycm9yO1xuIl19