'use strict';

var isObjectLike = require('./isObjectLike'),
    isPlainObject = require('./isPlainObject');

/**
 * Checks if `value` is likely a DOM element.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a DOM element,
 *  else `false`.
 * @example
 *
 * _.isElement(document.body);
 * // => true
 *
 * _.isElement('<body>');
 * // => false
 */
function isElement(value) {
  return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
}

module.exports = isElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzRWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxRQUFRLGdCQUFSLENBQW5CO0lBQ0ksZ0JBQWdCLFFBQVEsaUJBQVIsQ0FEcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBLFNBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQjtBQUN4QixTQUFPLENBQUMsQ0FBQyxLQUFGLElBQVcsTUFBTSxRQUFOLEtBQW1CLENBQTlCLElBQW1DLGFBQWEsS0FBYixDQUFuQyxJQUEwRCxDQUFDLGNBQWMsS0FBZCxDQUFsRTtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJpc0VsZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKSxcbiAgICBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnLi9pc1BsYWluT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgRE9NIGVsZW1lbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBET00gZWxlbWVudCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNFbGVtZW50KGRvY3VtZW50LmJvZHkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbGVtZW50KCc8Ym9keT4nKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRWxlbWVudCh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB2YWx1ZS5ub2RlVHlwZSA9PT0gMSAmJiBpc09iamVjdExpa2UodmFsdWUpICYmICFpc1BsYWluT2JqZWN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VsZW1lbnQ7XG4iXX0=