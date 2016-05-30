/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactErrorUtils
 * @typechecks
 */

'use strict';

var caughtError = null;

/**
 * Call a function while guarding against errors that happens within it.
 *
 * @param {?String} name of the guard to use for logging or debugging
 * @param {Function} func The function to invoke
 * @param {*} a First argument
 * @param {*} b Second argument
 */
function invokeGuardedCallback(name, func, a, b) {
  try {
    return func(a, b);
  } catch (x) {
    if (caughtError === null) {
      caughtError = x;
    }
    return undefined;
  }
}

var ReactErrorUtils = {
  invokeGuardedCallback: invokeGuardedCallback,

  /**
   * Invoked by ReactTestUtils.Simulate so that any errors thrown by the event
   * handler are sure to be rethrown by rethrowCaughtError.
   */
  invokeGuardedCallbackWithCatch: invokeGuardedCallback,

  /**
   * During execution of guarded functions we will capture the first error which
   * we will rethrow to be handled by the top level error handler.
   */
  rethrowCaughtError: function rethrowCaughtError() {
    if (caughtError) {
      var error = caughtError;
      caughtError = null;
      throw error;
    }
  }
};

if (process.env.NODE_ENV !== 'production') {
  /**
   * To help development we can get better devtools integration by simulating a
   * real browser event.
   */
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof document !== 'undefined' && typeof document.createEvent === 'function') {
    var fakeNode = document.createElement('react');
    ReactErrorUtils.invokeGuardedCallback = function (name, func, a, b) {
      var boundFunc = func.bind(null, a, b);
      var evtType = 'react-' + name;
      fakeNode.addEventListener(evtType, boundFunc, false);
      var evt = document.createEvent('Event');
      evt.initEvent(evtType, false, false);
      fakeNode.dispatchEvent(evt);
      fakeNode.removeEventListener(evtType, boundFunc, false);
    };
  }
}

module.exports = ReactErrorUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RXJyb3JVdGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLGNBQWMsSUFBZDs7Ozs7Ozs7OztBQVVKLFNBQVMscUJBQVQsQ0FBK0IsSUFBL0IsRUFBcUMsSUFBckMsRUFBMkMsQ0FBM0MsRUFBOEMsQ0FBOUMsRUFBaUQ7QUFDL0MsTUFBSTtBQUNGLFdBQU8sS0FBSyxDQUFMLEVBQVEsQ0FBUixDQUFQLENBREU7R0FBSixDQUVFLE9BQU8sQ0FBUCxFQUFVO0FBQ1YsUUFBSSxnQkFBZ0IsSUFBaEIsRUFBc0I7QUFDeEIsb0JBQWMsQ0FBZCxDQUR3QjtLQUExQjtBQUdBLFdBQU8sU0FBUCxDQUpVO0dBQVY7Q0FISjs7QUFXQSxJQUFJLGtCQUFrQjtBQUNwQix5QkFBdUIscUJBQXZCOzs7Ozs7QUFNQSxrQ0FBZ0MscUJBQWhDOzs7Ozs7QUFNQSxzQkFBb0IsOEJBQVk7QUFDOUIsUUFBSSxXQUFKLEVBQWlCO0FBQ2YsVUFBSSxRQUFRLFdBQVIsQ0FEVztBQUVmLG9CQUFjLElBQWQsQ0FGZTtBQUdmLFlBQU0sS0FBTixDQUhlO0tBQWpCO0dBRGtCO0NBYmxCOztBQXNCSixJQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsRUFBdUM7Ozs7O0FBS3pDLE1BQUksT0FBTyxNQUFQLEtBQWtCLFdBQWxCLElBQWlDLE9BQU8sT0FBTyxhQUFQLEtBQXlCLFVBQWhDLElBQThDLE9BQU8sUUFBUCxLQUFvQixXQUFwQixJQUFtQyxPQUFPLFNBQVMsV0FBVCxLQUF5QixVQUFoQyxFQUE0QztBQUNoSyxRQUFJLFdBQVcsU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQVgsQ0FENEo7QUFFaEssb0JBQWdCLHFCQUFoQixHQUF3QyxVQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEI7QUFDbEUsVUFBSSxZQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBWixDQUQ4RDtBQUVsRSxVQUFJLFVBQVUsV0FBVyxJQUFYLENBRm9EO0FBR2xFLGVBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsU0FBbkMsRUFBOEMsS0FBOUMsRUFIa0U7QUFJbEUsVUFBSSxNQUFNLFNBQVMsV0FBVCxDQUFxQixPQUFyQixDQUFOLENBSjhEO0FBS2xFLFVBQUksU0FBSixDQUFjLE9BQWQsRUFBdUIsS0FBdkIsRUFBOEIsS0FBOUIsRUFMa0U7QUFNbEUsZUFBUyxhQUFULENBQXVCLEdBQXZCLEVBTmtFO0FBT2xFLGVBQVMsbUJBQVQsQ0FBNkIsT0FBN0IsRUFBc0MsU0FBdEMsRUFBaUQsS0FBakQsRUFQa0U7S0FBNUIsQ0FGd0g7R0FBbEs7Q0FMRjs7QUFtQkEsT0FBTyxPQUFQLEdBQWlCLGVBQWpCIiwiZmlsZSI6IlJlYWN0RXJyb3JVdGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdEVycm9yVXRpbHNcbiAqIEB0eXBlY2hlY2tzXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2F1Z2h0RXJyb3IgPSBudWxsO1xuXG4vKipcbiAqIENhbGwgYSBmdW5jdGlvbiB3aGlsZSBndWFyZGluZyBhZ2FpbnN0IGVycm9ycyB0aGF0IGhhcHBlbnMgd2l0aGluIGl0LlxuICpcbiAqIEBwYXJhbSB7P1N0cmluZ30gbmFtZSBvZiB0aGUgZ3VhcmQgdG8gdXNlIGZvciBsb2dnaW5nIG9yIGRlYnVnZ2luZ1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlXG4gKiBAcGFyYW0geyp9IGEgRmlyc3QgYXJndW1lbnRcbiAqIEBwYXJhbSB7Kn0gYiBTZWNvbmQgYXJndW1lbnRcbiAqL1xuZnVuY3Rpb24gaW52b2tlR3VhcmRlZENhbGxiYWNrKG5hbWUsIGZ1bmMsIGEsIGIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnVuYyhhLCBiKTtcbiAgfSBjYXRjaCAoeCkge1xuICAgIGlmIChjYXVnaHRFcnJvciA9PT0gbnVsbCkge1xuICAgICAgY2F1Z2h0RXJyb3IgPSB4O1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbnZhciBSZWFjdEVycm9yVXRpbHMgPSB7XG4gIGludm9rZUd1YXJkZWRDYWxsYmFjazogaW52b2tlR3VhcmRlZENhbGxiYWNrLFxuXG4gIC8qKlxuICAgKiBJbnZva2VkIGJ5IFJlYWN0VGVzdFV0aWxzLlNpbXVsYXRlIHNvIHRoYXQgYW55IGVycm9ycyB0aHJvd24gYnkgdGhlIGV2ZW50XG4gICAqIGhhbmRsZXIgYXJlIHN1cmUgdG8gYmUgcmV0aHJvd24gYnkgcmV0aHJvd0NhdWdodEVycm9yLlxuICAgKi9cbiAgaW52b2tlR3VhcmRlZENhbGxiYWNrV2l0aENhdGNoOiBpbnZva2VHdWFyZGVkQ2FsbGJhY2ssXG5cbiAgLyoqXG4gICAqIER1cmluZyBleGVjdXRpb24gb2YgZ3VhcmRlZCBmdW5jdGlvbnMgd2Ugd2lsbCBjYXB0dXJlIHRoZSBmaXJzdCBlcnJvciB3aGljaFxuICAgKiB3ZSB3aWxsIHJldGhyb3cgdG8gYmUgaGFuZGxlZCBieSB0aGUgdG9wIGxldmVsIGVycm9yIGhhbmRsZXIuXG4gICAqL1xuICByZXRocm93Q2F1Z2h0RXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY2F1Z2h0RXJyb3IpIHtcbiAgICAgIHZhciBlcnJvciA9IGNhdWdodEVycm9yO1xuICAgICAgY2F1Z2h0RXJyb3IgPSBudWxsO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG59O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAvKipcbiAgICogVG8gaGVscCBkZXZlbG9wbWVudCB3ZSBjYW4gZ2V0IGJldHRlciBkZXZ0b29scyBpbnRlZ3JhdGlvbiBieSBzaW11bGF0aW5nIGFcbiAgICogcmVhbCBicm93c2VyIGV2ZW50LlxuICAgKi9cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuZGlzcGF0Y2hFdmVudCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFdmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciBmYWtlTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3JlYWN0Jyk7XG4gICAgUmVhY3RFcnJvclV0aWxzLmludm9rZUd1YXJkZWRDYWxsYmFjayA9IGZ1bmN0aW9uIChuYW1lLCBmdW5jLCBhLCBiKSB7XG4gICAgICB2YXIgYm91bmRGdW5jID0gZnVuYy5iaW5kKG51bGwsIGEsIGIpO1xuICAgICAgdmFyIGV2dFR5cGUgPSAncmVhY3QtJyArIG5hbWU7XG4gICAgICBmYWtlTm9kZS5hZGRFdmVudExpc3RlbmVyKGV2dFR5cGUsIGJvdW5kRnVuYywgZmFsc2UpO1xuICAgICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgZXZ0LmluaXRFdmVudChldnRUeXBlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgZmFrZU5vZGUuZGlzcGF0Y2hFdmVudChldnQpO1xuICAgICAgZmFrZU5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldnRUeXBlLCBib3VuZEZ1bmMsIGZhbHNlKTtcbiAgICB9O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RFcnJvclV0aWxzOyJdfQ==