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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL190b1NvdXJjZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxJQUFJLGVBQWUsU0FBUyxTQUFULENBQW1CLFFBQXRDOzs7Ozs7Ozs7QUFTQSxTQUFTLFFBQVQsQ0FBa0IsSUFBbEIsRUFBd0I7QUFDdEIsTUFBSSxRQUFRLElBQVosRUFBa0I7QUFDaEIsUUFBSTtBQUNGLGFBQU8sYUFBYSxJQUFiLENBQWtCLElBQWxCLENBQVA7QUFDRCxLQUZELENBRUUsT0FBTyxDQUFQLEVBQVUsQ0FBRTtBQUNkLFFBQUk7QUFDRixhQUFRLE9BQU8sRUFBZjtBQUNELEtBRkQsQ0FFRSxPQUFPLENBQVAsRUFBVSxDQUFFO0FBQ2Y7QUFDRCxTQUFPLEVBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiX3RvU291cmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU291cmNlO1xuIl19