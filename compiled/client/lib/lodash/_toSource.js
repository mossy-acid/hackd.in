'use strict';

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL190b1NvdXJjZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxJQUFJLGVBQWUsU0FBUyxTQUFULENBQW1CLFFBQW5COzs7Ozs7Ozs7QUFTbkIsU0FBUyxRQUFULENBQWtCLElBQWxCLEVBQXdCO0FBQ3RCLE1BQUksUUFBUSxJQUFSLEVBQWM7QUFDaEIsUUFBSTtBQUNGLGFBQU8sYUFBYSxJQUFiLENBQWtCLElBQWxCLENBQVAsQ0FERTtLQUFKLENBRUUsT0FBTyxDQUFQLEVBQVUsRUFBVjtBQUNGLFFBQUk7QUFDRixhQUFRLE9BQU8sRUFBUCxDQUROO0tBQUosQ0FFRSxPQUFPLENBQVAsRUFBVSxFQUFWO0dBTko7QUFRQSxTQUFPLEVBQVAsQ0FUc0I7Q0FBeEI7O0FBWUEsT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6Il90b1NvdXJjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1NvdXJjZTtcbiJdfQ==