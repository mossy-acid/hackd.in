'use strict';

var isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

module.exports = toKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL190b0tleS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxRQUFRLFlBQVIsQ0FBZjs7O0FBR0EsSUFBSSxXQUFXLElBQUksQ0FBbkI7Ozs7Ozs7OztBQVNBLFNBQVMsS0FBVCxDQUFlLEtBQWYsRUFBc0I7QUFDcEIsTUFBSSxPQUFPLEtBQVAsSUFBZ0IsUUFBaEIsSUFBNEIsU0FBUyxLQUFULENBQWhDLEVBQWlEO0FBQy9DLFdBQU8sS0FBUDtBQUNEO0FBQ0QsTUFBSSxTQUFVLFFBQVEsRUFBdEI7QUFDQSxTQUFRLFVBQVUsR0FBVixJQUFrQixJQUFJLEtBQUwsSUFBZSxDQUFDLFFBQWxDLEdBQThDLElBQTlDLEdBQXFELE1BQTVEO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLEtBQWpCIiwiZmlsZSI6Il90b0tleS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGtleSBpZiBpdCdzIG5vdCBhIHN0cmluZyBvciBzeW1ib2wuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7c3RyaW5nfHN5bWJvbH0gUmV0dXJucyB0aGUga2V5LlxuICovXG5mdW5jdGlvbiB0b0tleSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9LZXk7XG4iXX0=