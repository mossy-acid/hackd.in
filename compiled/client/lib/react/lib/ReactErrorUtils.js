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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RXJyb3JVdGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLGNBQWMsSUFBbEI7Ozs7Ozs7Ozs7QUFVQSxTQUFTLHFCQUFULENBQStCLElBQS9CLEVBQXFDLElBQXJDLEVBQTJDLENBQTNDLEVBQThDLENBQTlDLEVBQWlEO0FBQy9DLE1BQUk7QUFDRixXQUFPLEtBQUssQ0FBTCxFQUFRLENBQVIsQ0FBUDtBQUNELEdBRkQsQ0FFRSxPQUFPLENBQVAsRUFBVTtBQUNWLFFBQUksZ0JBQWdCLElBQXBCLEVBQTBCO0FBQ3hCLG9CQUFjLENBQWQ7QUFDRDtBQUNELFdBQU8sU0FBUDtBQUNEO0FBQ0Y7O0FBRUQsSUFBSSxrQkFBa0I7QUFDcEIseUJBQXVCLHFCQURIOzs7Ozs7QUFPcEIsa0NBQWdDLHFCQVBaOzs7Ozs7QUFhcEIsc0JBQW9CLDhCQUFZO0FBQzlCLFFBQUksV0FBSixFQUFpQjtBQUNmLFVBQUksUUFBUSxXQUFaO0FBQ0Esb0JBQWMsSUFBZDtBQUNBLFlBQU0sS0FBTjtBQUNEO0FBQ0Y7QUFuQm1CLENBQXRCOztBQXNCQSxJQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFBMkM7Ozs7O0FBS3pDLE1BQUksT0FBTyxNQUFQLEtBQWtCLFdBQWxCLElBQWlDLE9BQU8sT0FBTyxhQUFkLEtBQWdDLFVBQWpFLElBQStFLE9BQU8sUUFBUCxLQUFvQixXQUFuRyxJQUFrSCxPQUFPLFNBQVMsV0FBaEIsS0FBZ0MsVUFBdEosRUFBa0s7QUFDaEssUUFBSSxXQUFXLFNBQVMsYUFBVCxDQUF1QixPQUF2QixDQUFmO0FBQ0Esb0JBQWdCLHFCQUFoQixHQUF3QyxVQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEI7QUFDbEUsVUFBSSxZQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBaEI7QUFDQSxVQUFJLFVBQVUsV0FBVyxJQUF6QjtBQUNBLGVBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsU0FBbkMsRUFBOEMsS0FBOUM7QUFDQSxVQUFJLE1BQU0sU0FBUyxXQUFULENBQXFCLE9BQXJCLENBQVY7QUFDQSxVQUFJLFNBQUosQ0FBYyxPQUFkLEVBQXVCLEtBQXZCLEVBQThCLEtBQTlCO0FBQ0EsZUFBUyxhQUFULENBQXVCLEdBQXZCO0FBQ0EsZUFBUyxtQkFBVCxDQUE2QixPQUE3QixFQUFzQyxTQUF0QyxFQUFpRCxLQUFqRDtBQUNELEtBUkQ7QUFTRDtBQUNGOztBQUVELE9BQU8sT0FBUCxHQUFpQixlQUFqQiIsImZpbGUiOiJSZWFjdEVycm9yVXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RFcnJvclV0aWxzXG4gKiBAdHlwZWNoZWNrc1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGNhdWdodEVycm9yID0gbnVsbDtcblxuLyoqXG4gKiBDYWxsIGEgZnVuY3Rpb24gd2hpbGUgZ3VhcmRpbmcgYWdhaW5zdCBlcnJvcnMgdGhhdCBoYXBwZW5zIHdpdGhpbiBpdC5cbiAqXG4gKiBAcGFyYW0gez9TdHJpbmd9IG5hbWUgb2YgdGhlIGd1YXJkIHRvIHVzZSBmb3IgbG9nZ2luZyBvciBkZWJ1Z2dpbmdcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZVxuICogQHBhcmFtIHsqfSBhIEZpcnN0IGFyZ3VtZW50XG4gKiBAcGFyYW0geyp9IGIgU2Vjb25kIGFyZ3VtZW50XG4gKi9cbmZ1bmN0aW9uIGludm9rZUd1YXJkZWRDYWxsYmFjayhuYW1lLCBmdW5jLCBhLCBiKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZ1bmMoYSwgYik7XG4gIH0gY2F0Y2ggKHgpIHtcbiAgICBpZiAoY2F1Z2h0RXJyb3IgPT09IG51bGwpIHtcbiAgICAgIGNhdWdodEVycm9yID0geDtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG52YXIgUmVhY3RFcnJvclV0aWxzID0ge1xuICBpbnZva2VHdWFyZGVkQ2FsbGJhY2s6IGludm9rZUd1YXJkZWRDYWxsYmFjayxcblxuICAvKipcbiAgICogSW52b2tlZCBieSBSZWFjdFRlc3RVdGlscy5TaW11bGF0ZSBzbyB0aGF0IGFueSBlcnJvcnMgdGhyb3duIGJ5IHRoZSBldmVudFxuICAgKiBoYW5kbGVyIGFyZSBzdXJlIHRvIGJlIHJldGhyb3duIGJ5IHJldGhyb3dDYXVnaHRFcnJvci5cbiAgICovXG4gIGludm9rZUd1YXJkZWRDYWxsYmFja1dpdGhDYXRjaDogaW52b2tlR3VhcmRlZENhbGxiYWNrLFxuXG4gIC8qKlxuICAgKiBEdXJpbmcgZXhlY3V0aW9uIG9mIGd1YXJkZWQgZnVuY3Rpb25zIHdlIHdpbGwgY2FwdHVyZSB0aGUgZmlyc3QgZXJyb3Igd2hpY2hcbiAgICogd2Ugd2lsbCByZXRocm93IHRvIGJlIGhhbmRsZWQgYnkgdGhlIHRvcCBsZXZlbCBlcnJvciBoYW5kbGVyLlxuICAgKi9cbiAgcmV0aHJvd0NhdWdodEVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGNhdWdodEVycm9yKSB7XG4gICAgICB2YXIgZXJyb3IgPSBjYXVnaHRFcnJvcjtcbiAgICAgIGNhdWdodEVycm9yID0gbnVsbDtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgLyoqXG4gICAqIFRvIGhlbHAgZGV2ZWxvcG1lbnQgd2UgY2FuIGdldCBiZXR0ZXIgZGV2dG9vbHMgaW50ZWdyYXRpb24gYnkgc2ltdWxhdGluZyBhXG4gICAqIHJlYWwgYnJvd3NlciBldmVudC5cbiAgICovXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LmRpc3BhdGNoRXZlbnQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRXZlbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgZmFrZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdyZWFjdCcpO1xuICAgIFJlYWN0RXJyb3JVdGlscy5pbnZva2VHdWFyZGVkQ2FsbGJhY2sgPSBmdW5jdGlvbiAobmFtZSwgZnVuYywgYSwgYikge1xuICAgICAgdmFyIGJvdW5kRnVuYyA9IGZ1bmMuYmluZChudWxsLCBhLCBiKTtcbiAgICAgIHZhciBldnRUeXBlID0gJ3JlYWN0LScgKyBuYW1lO1xuICAgICAgZmFrZU5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldnRUeXBlLCBib3VuZEZ1bmMsIGZhbHNlKTtcbiAgICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgIGV2dC5pbml0RXZlbnQoZXZ0VHlwZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgIGZha2VOb2RlLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICAgIGZha2VOb2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0VHlwZSwgYm91bmRGdW5jLCBmYWxzZSk7XG4gICAgfTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0RXJyb3JVdGlsczsiXX0=