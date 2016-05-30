/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule deprecated
 */

'use strict';

var assign = require('./Object.assign');
var warning = require('fbjs/lib/warning');

/**
 * This will log a single deprecation notice per function and forward the call
 * on to the new API.
 *
 * @param {string} fnName The name of the function
 * @param {string} newModule The module that fn will exist in
 * @param {string} newPackage The module that fn will exist in
 * @param {*} ctx The context this forwarded call should run in
 * @param {function} fn The function to forward on to
 * @return {function} The function that will warn once and then call fn
 */
function deprecated(fnName, newModule, newPackage, ctx, fn) {
  var warned = false;
  if (process.env.NODE_ENV !== 'production') {
    var newFn = function newFn() {
      process.env.NODE_ENV !== 'production' ? warning(warned,
      // Require examples in this string must be split to prevent React's
      // build tools from mistaking them for real requires.
      // Otherwise the build tools will attempt to build a '%s' module.
      'React.%s is deprecated. Please use %s.%s from require' + '(\'%s\') ' + 'instead.', fnName, newModule, fnName, newPackage) : undefined;
      warned = true;
      return fn.apply(ctx, arguments);
    };
    // We need to make sure all properties of the original fn are copied over.
    // In particular, this is needed to support PropTypes
    return assign(newFn, fn);
  }

  return fn;
}

module.exports = deprecated;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2RlcHJlY2F0ZWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLFNBQVMsUUFBUSxpQkFBUixDQUFiO0FBQ0EsSUFBSSxVQUFVLFFBQVEsa0JBQVIsQ0FBZDs7Ozs7Ozs7Ozs7OztBQWFBLFNBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QixTQUE1QixFQUF1QyxVQUF2QyxFQUFtRCxHQUFuRCxFQUF3RCxFQUF4RCxFQUE0RDtBQUMxRCxNQUFJLFNBQVMsS0FBYjtBQUNBLE1BQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUEyQztBQUN6QyxRQUFJLFFBQVEsU0FBUixLQUFRLEdBQVk7QUFDdEIsY0FBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxRQUFRLE1BQVI7Ozs7QUFJeEMsZ0VBQTBELFdBQTFELEdBQXdFLFVBSmhDLEVBSTRDLE1BSjVDLEVBSW9ELFNBSnBELEVBSStELE1BSi9ELEVBSXVFLFVBSnZFLENBQXhDLEdBSTZILFNBSjdIO0FBS0EsZUFBUyxJQUFUO0FBQ0EsYUFBTyxHQUFHLEtBQUgsQ0FBUyxHQUFULEVBQWMsU0FBZCxDQUFQO0FBQ0QsS0FSRDs7O0FBV0EsV0FBTyxPQUFPLEtBQVAsRUFBYyxFQUFkLENBQVA7QUFDRDs7QUFFRCxTQUFPLEVBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoiZGVwcmVjYXRlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBkZXByZWNhdGVkXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9PYmplY3QuYXNzaWduJyk7XG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcblxuLyoqXG4gKiBUaGlzIHdpbGwgbG9nIGEgc2luZ2xlIGRlcHJlY2F0aW9uIG5vdGljZSBwZXIgZnVuY3Rpb24gYW5kIGZvcndhcmQgdGhlIGNhbGxcbiAqIG9uIHRvIHRoZSBuZXcgQVBJLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmbk5hbWUgVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gbmV3TW9kdWxlIFRoZSBtb2R1bGUgdGhhdCBmbiB3aWxsIGV4aXN0IGluXG4gKiBAcGFyYW0ge3N0cmluZ30gbmV3UGFja2FnZSBUaGUgbW9kdWxlIHRoYXQgZm4gd2lsbCBleGlzdCBpblxuICogQHBhcmFtIHsqfSBjdHggVGhlIGNvbnRleHQgdGhpcyBmb3J3YXJkZWQgY2FsbCBzaG91bGQgcnVuIGluXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gZm9yd2FyZCBvbiB0b1xuICogQHJldHVybiB7ZnVuY3Rpb259IFRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgd2FybiBvbmNlIGFuZCB0aGVuIGNhbGwgZm5cbiAqL1xuZnVuY3Rpb24gZGVwcmVjYXRlZChmbk5hbWUsIG5ld01vZHVsZSwgbmV3UGFja2FnZSwgY3R4LCBmbikge1xuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgdmFyIG5ld0ZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcod2FybmVkLFxuICAgICAgLy8gUmVxdWlyZSBleGFtcGxlcyBpbiB0aGlzIHN0cmluZyBtdXN0IGJlIHNwbGl0IHRvIHByZXZlbnQgUmVhY3Qnc1xuICAgICAgLy8gYnVpbGQgdG9vbHMgZnJvbSBtaXN0YWtpbmcgdGhlbSBmb3IgcmVhbCByZXF1aXJlcy5cbiAgICAgIC8vIE90aGVyd2lzZSB0aGUgYnVpbGQgdG9vbHMgd2lsbCBhdHRlbXB0IHRvIGJ1aWxkIGEgJyVzJyBtb2R1bGUuXG4gICAgICAnUmVhY3QuJXMgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSAlcy4lcyBmcm9tIHJlcXVpcmUnICsgJyhcXCclc1xcJykgJyArICdpbnN0ZWFkLicsIGZuTmFtZSwgbmV3TW9kdWxlLCBmbk5hbWUsIG5ld1BhY2thZ2UpIDogdW5kZWZpbmVkO1xuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiBmbi5hcHBseShjdHgsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICAvLyBXZSBuZWVkIHRvIG1ha2Ugc3VyZSBhbGwgcHJvcGVydGllcyBvZiB0aGUgb3JpZ2luYWwgZm4gYXJlIGNvcGllZCBvdmVyLlxuICAgIC8vIEluIHBhcnRpY3VsYXIsIHRoaXMgaXMgbmVlZGVkIHRvIHN1cHBvcnQgUHJvcFR5cGVzXG4gICAgcmV0dXJuIGFzc2lnbihuZXdGbiwgZm4pO1xuICB9XG5cbiAgcmV0dXJuIGZuO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlcHJlY2F0ZWQ7Il19