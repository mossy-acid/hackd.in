'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = !Buffer ? stubFalse : function (value) {
  return value instanceof Buffer;
};

module.exports = isBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzQnVmZmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJLE9BQU8sUUFBUSxTQUFSLENBQVg7SUFDSSxZQUFZLFFBQVEsYUFBUixDQURoQjs7O0FBSUEsSUFBSSxjQUFjLFFBQU8sT0FBUCx5Q0FBTyxPQUFQLE1BQWtCLFFBQWxCLElBQThCLE9BQWhEOzs7QUFHQSxJQUFJLGFBQWEsZUFBZSxRQUFPLE1BQVAseUNBQU8sTUFBUCxNQUFpQixRQUFoQyxJQUE0QyxNQUE3RDs7O0FBR0EsSUFBSSxnQkFBZ0IsY0FBYyxXQUFXLE9BQVgsS0FBdUIsV0FBekQ7OztBQUdBLElBQUksU0FBUyxnQkFBZ0IsS0FBSyxNQUFyQixHQUE4QixTQUEzQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxJQUFJLFdBQVcsQ0FBQyxNQUFELEdBQVUsU0FBVixHQUFzQixVQUFTLEtBQVQsRUFBZ0I7QUFDbkQsU0FBTyxpQkFBaUIsTUFBeEI7QUFDRCxDQUZEOztBQUlBLE9BQU8sT0FBUCxHQUFpQixRQUFqQiIsImZpbGUiOiJpc0J1ZmZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gIUJ1ZmZlciA/IHN0dWJGYWxzZSA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEJ1ZmZlcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaXNCdWZmZXI7XG4iXX0=