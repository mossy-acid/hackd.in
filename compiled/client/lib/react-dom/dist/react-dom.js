"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * ReactDOM v0.14.8
 *
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
// Based off https://github.com/ForbesLindesay/umd/blob/master/template.js
;(function (f) {
  // CommonJS
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f(require('react'));

    // RequireJS
  } else if (typeof define === "function" && define.amd) {
      define(['react'], f);

      // <script>
    } else {
        var g;
        if (typeof window !== "undefined") {
          g = window;
        } else if (typeof global !== "undefined") {
          g = global;
        } else if (typeof self !== "undefined") {
          g = self;
        } else {
          // works providing we're not in "use strict";
          // needed for Java 8 Nashorn
          // see https://github.com/facebook/react/issues/3037
          g = this;
        }
        g.ReactDOM = f(g.React);
      }
})(function (React) {
  return React.__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QtZG9tL2Rpc3QvcmVhY3QtZG9tLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZQSxDQUFDLENBQUMsVUFBUyxDQUFULEVBQVk7O0FBRVosTUFBSSxRQUFPLE9BQVAseUNBQU8sT0FBUCxPQUFtQixRQUFuQixJQUErQixPQUFPLE1BQVAsS0FBa0IsV0FBckQsRUFBa0U7QUFDaEUsV0FBTyxPQUFQLEdBQWlCLEVBQUUsUUFBUSxPQUFSLENBQUYsQ0FBakI7OztBQUdELEdBSkQsTUFJTyxJQUFJLE9BQU8sTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPLEdBQTNDLEVBQWdEO0FBQ3JELGFBQU8sQ0FBQyxPQUFELENBQVAsRUFBa0IsQ0FBbEI7OztBQUdELEtBSk0sTUFJQTtBQUNMLFlBQUksQ0FBSjtBQUNBLFlBQUksT0FBTyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDLGNBQUksTUFBSjtBQUNELFNBRkQsTUFFTyxJQUFJLE9BQU8sTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUN4QyxjQUFJLE1BQUo7QUFDRCxTQUZNLE1BRUEsSUFBSSxPQUFPLElBQVAsS0FBZ0IsV0FBcEIsRUFBaUM7QUFDdEMsY0FBSSxJQUFKO0FBQ0QsU0FGTSxNQUVBOzs7O0FBSUwsY0FBSSxJQUFKO0FBQ0Q7QUFDRCxVQUFFLFFBQUYsR0FBYSxFQUFFLEVBQUUsS0FBSixDQUFiO0FBQ0Q7QUFFRixDQTNCQSxFQTJCRSxVQUFTLEtBQVQsRUFBZ0I7QUFDakIsU0FBTyxNQUFNLDRDQUFiO0FBQ0QsQ0E3QkEiLCJmaWxlIjoicmVhY3QtZG9tLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZWFjdERPTSB2MC4xNC44XG4gKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqL1xuLy8gQmFzZWQgb2ZmIGh0dHBzOi8vZ2l0aHViLmNvbS9Gb3JiZXNMaW5kZXNheS91bWQvYmxvYi9tYXN0ZXIvdGVtcGxhdGUuanNcbjsoZnVuY3Rpb24oZikge1xuICAvLyBDb21tb25KU1xuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZihyZXF1aXJlKCdyZWFjdCcpKTtcblxuICAvLyBSZXF1aXJlSlNcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ3JlYWN0J10sIGYpO1xuXG4gIC8vIDxzY3JpcHQ+XG4gIH0gZWxzZSB7XG4gICAgdmFyIGc7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGcgPSB3aW5kb3c7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBnID0gZ2xvYmFsO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGcgPSBzZWxmO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB3b3JrcyBwcm92aWRpbmcgd2UncmUgbm90IGluIFwidXNlIHN0cmljdFwiO1xuICAgICAgLy8gbmVlZGVkIGZvciBKYXZhIDggTmFzaG9yblxuICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMzAzN1xuICAgICAgZyA9IHRoaXM7XG4gICAgfVxuICAgIGcuUmVhY3RET00gPSBmKGcuUmVhY3QpO1xuICB9XG5cbn0pKGZ1bmN0aW9uKFJlYWN0KSB7XG4gIHJldHVybiBSZWFjdC5fX1NFQ1JFVF9ET01fRE9fTk9UX1VTRV9PUl9ZT1VfV0lMTF9CRV9GSVJFRDtcbn0pO1xuIl19