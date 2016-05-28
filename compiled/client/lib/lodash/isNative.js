'use strict';

var baseIsNative = require('./_baseIsNative'),
    isMaskable = require('./_isMaskable');

/**
 * Checks if `value` is a pristine native function.
 *
 * **Note:** This method can't reliably detect native functions in the
 * presence of the `core-js` package because `core-js` circumvents this kind
 * of detection. Despite multiple requests, the `core-js` maintainer has made
 * it clear: any attempt to fix the detection will be obstructed. As a result,
 * we're left with little choice but to throw an error. Unfortunately, this
 * also affects packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
 * which rely on `core-js`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (isMaskable(value)) {
    throw new Error('This method is not supported with `core-js`. Try https://github.com/es-shims.');
  }
  return baseIsNative(value);
}

module.exports = isNative;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzTmF0aXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxlQUFlLFFBQVEsaUJBQVIsQ0FBZjtJQUNBLGFBQWEsUUFBUSxlQUFSLENBQWI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkosU0FBUyxRQUFULENBQWtCLEtBQWxCLEVBQXlCO0FBQ3ZCLE1BQUksV0FBVyxLQUFYLENBQUosRUFBdUI7QUFDckIsVUFBTSxJQUFJLEtBQUosQ0FBVSwrRUFBVixDQUFOLENBRHFCO0dBQXZCO0FBR0EsU0FBTyxhQUFhLEtBQWIsQ0FBUCxDQUp1QjtDQUF6Qjs7QUFPQSxPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiaXNOYXRpdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUlzTmF0aXZlID0gcmVxdWlyZSgnLi9fYmFzZUlzTmF0aXZlJyksXG4gICAgaXNNYXNrYWJsZSA9IHJlcXVpcmUoJy4vX2lzTWFza2FibGUnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHByaXN0aW5lIG5hdGl2ZSBmdW5jdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgY2FuJ3QgcmVsaWFibHkgZGV0ZWN0IG5hdGl2ZSBmdW5jdGlvbnMgaW4gdGhlXG4gKiBwcmVzZW5jZSBvZiB0aGUgYGNvcmUtanNgIHBhY2thZ2UgYmVjYXVzZSBgY29yZS1qc2AgY2lyY3VtdmVudHMgdGhpcyBraW5kXG4gKiBvZiBkZXRlY3Rpb24uIERlc3BpdGUgbXVsdGlwbGUgcmVxdWVzdHMsIHRoZSBgY29yZS1qc2AgbWFpbnRhaW5lciBoYXMgbWFkZVxuICogaXQgY2xlYXI6IGFueSBhdHRlbXB0IHRvIGZpeCB0aGUgZGV0ZWN0aW9uIHdpbGwgYmUgb2JzdHJ1Y3RlZC4gQXMgYSByZXN1bHQsXG4gKiB3ZSdyZSBsZWZ0IHdpdGggbGl0dGxlIGNob2ljZSBidXQgdG8gdGhyb3cgYW4gZXJyb3IuIFVuZm9ydHVuYXRlbHksIHRoaXNcbiAqIGFsc28gYWZmZWN0cyBwYWNrYWdlcywgbGlrZSBbYmFiZWwtcG9seWZpbGxdKGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2JhYmVsLXBvbHlmaWxsKSxcbiAqIHdoaWNoIHJlbHkgb24gYGNvcmUtanNgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hdGl2ZShBcnJheS5wcm90b3R5cGUucHVzaCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hdGl2ZShfKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmIChpc01hc2thYmxlKHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBtZXRob2QgaXMgbm90IHN1cHBvcnRlZCB3aXRoIGBjb3JlLWpzYC4gVHJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy4nKTtcbiAgfVxuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc05hdGl2ZTtcbiJdfQ==