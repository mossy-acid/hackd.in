'use strict';

var createCtorWrapper = require('./_createCtorWrapper'),
    root = require('./_root');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1;

/**
 * Creates a function that wraps `func` to invoke it with the optional `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
 *  for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createBaseWrapper(func, bitmask, thisArg) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtorWrapper(func);

  function wrapper() {
    var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}

module.exports = createBaseWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVCYXNlV3JhcHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksb0JBQW9CLFFBQVEsc0JBQVIsQ0FBeEI7SUFDSSxPQUFPLFFBQVEsU0FBUixDQURYOzs7QUFJQSxJQUFJLFlBQVksQ0FBaEI7Ozs7Ozs7Ozs7Ozs7QUFhQSxTQUFTLGlCQUFULENBQTJCLElBQTNCLEVBQWlDLE9BQWpDLEVBQTBDLE9BQTFDLEVBQW1EO0FBQ2pELE1BQUksU0FBUyxVQUFVLFNBQXZCO01BQ0ksT0FBTyxrQkFBa0IsSUFBbEIsQ0FEWDs7QUFHQSxXQUFTLE9BQVQsR0FBbUI7QUFDakIsUUFBSSxLQUFNLFFBQVEsU0FBUyxJQUFqQixJQUF5QixnQkFBZ0IsT0FBMUMsR0FBcUQsSUFBckQsR0FBNEQsSUFBckU7QUFDQSxXQUFPLEdBQUcsS0FBSCxDQUFTLFNBQVMsT0FBVCxHQUFtQixJQUE1QixFQUFrQyxTQUFsQyxDQUFQO0FBQ0Q7QUFDRCxTQUFPLE9BQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsaUJBQWpCIiwiZmlsZSI6Il9jcmVhdGVCYXNlV3JhcHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVDdG9yV3JhcHBlciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUN0b3JXcmFwcGVyJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3Igd3JhcHBlciBtZXRhZGF0YS4gKi9cbnZhciBCSU5EX0ZMQUcgPSAxO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCB0byBpbnZva2UgaXQgd2l0aCB0aGUgb3B0aW9uYWwgYHRoaXNgXG4gKiBiaW5kaW5nIG9mIGB0aGlzQXJnYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIG9mIHdyYXBwZXIgZmxhZ3MuIFNlZSBgY3JlYXRlV3JhcHBlcmBcbiAqICBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHdyYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VXcmFwcGVyKGZ1bmMsIGJpdG1hc2ssIHRoaXNBcmcpIHtcbiAgdmFyIGlzQmluZCA9IGJpdG1hc2sgJiBCSU5EX0ZMQUcsXG4gICAgICBDdG9yID0gY3JlYXRlQ3RvcldyYXBwZXIoZnVuYyk7XG5cbiAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICB2YXIgZm4gPSAodGhpcyAmJiB0aGlzICE9PSByb290ICYmIHRoaXMgaW5zdGFuY2VvZiB3cmFwcGVyKSA/IEN0b3IgOiBmdW5jO1xuICAgIHJldHVybiBmbi5hcHBseShpc0JpbmQgPyB0aGlzQXJnIDogdGhpcywgYXJndW1lbnRzKTtcbiAgfVxuICByZXR1cm4gd3JhcHBlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlV3JhcHBlcjtcbiJdfQ==