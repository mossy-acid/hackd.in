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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2RlcHJlY2F0ZWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLFNBQVMsUUFBUSxpQkFBUixDQUFUO0FBQ0osSUFBSSxVQUFVLFFBQVEsa0JBQVIsQ0FBVjs7Ozs7Ozs7Ozs7OztBQWFKLFNBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QixTQUE1QixFQUF1QyxVQUF2QyxFQUFtRCxHQUFuRCxFQUF3RCxFQUF4RCxFQUE0RDtBQUMxRCxNQUFJLFNBQVMsS0FBVCxDQURzRDtBQUUxRCxNQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsRUFBdUM7QUFDekMsUUFBSSxRQUFRLFNBQVIsS0FBUSxHQUFZO0FBQ3RCLGNBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsUUFBUSxNQUFSOzs7O0FBSXhDLGdFQUEwRCxXQUExRCxHQUF3RSxVQUF4RSxFQUFvRixNQUo1QyxFQUlvRCxTQUpwRCxFQUkrRCxNQUovRCxFQUl1RSxVQUp2RSxDQUF4QyxHQUk2SCxTQUo3SCxDQURzQjtBQU10QixlQUFTLElBQVQsQ0FOc0I7QUFPdEIsYUFBTyxHQUFHLEtBQUgsQ0FBUyxHQUFULEVBQWMsU0FBZCxDQUFQLENBUHNCO0tBQVo7OztBQUQ2QixXQVlsQyxPQUFPLEtBQVAsRUFBYyxFQUFkLENBQVAsQ0FaeUM7R0FBM0M7O0FBZUEsU0FBTyxFQUFQLENBakIwRDtDQUE1RDs7QUFvQkEsT0FBTyxPQUFQLEdBQWlCLFVBQWpCIiwiZmlsZSI6ImRlcHJlY2F0ZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgZGVwcmVjYXRlZFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4vT2JqZWN0LmFzc2lnbicpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbi8qKlxuICogVGhpcyB3aWxsIGxvZyBhIHNpbmdsZSBkZXByZWNhdGlvbiBub3RpY2UgcGVyIGZ1bmN0aW9uIGFuZCBmb3J3YXJkIHRoZSBjYWxsXG4gKiBvbiB0byB0aGUgbmV3IEFQSS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZm5OYW1lIFRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvblxuICogQHBhcmFtIHtzdHJpbmd9IG5ld01vZHVsZSBUaGUgbW9kdWxlIHRoYXQgZm4gd2lsbCBleGlzdCBpblxuICogQHBhcmFtIHtzdHJpbmd9IG5ld1BhY2thZ2UgVGhlIG1vZHVsZSB0aGF0IGZuIHdpbGwgZXhpc3QgaW5cbiAqIEBwYXJhbSB7Kn0gY3R4IFRoZSBjb250ZXh0IHRoaXMgZm9yd2FyZGVkIGNhbGwgc2hvdWxkIHJ1biBpblxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGZvcndhcmQgb24gdG9cbiAqIEByZXR1cm4ge2Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gdGhhdCB3aWxsIHdhcm4gb25jZSBhbmQgdGhlbiBjYWxsIGZuXG4gKi9cbmZ1bmN0aW9uIGRlcHJlY2F0ZWQoZm5OYW1lLCBuZXdNb2R1bGUsIG5ld1BhY2thZ2UsIGN0eCwgZm4pIHtcbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHZhciBuZXdGbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKHdhcm5lZCxcbiAgICAgIC8vIFJlcXVpcmUgZXhhbXBsZXMgaW4gdGhpcyBzdHJpbmcgbXVzdCBiZSBzcGxpdCB0byBwcmV2ZW50IFJlYWN0J3NcbiAgICAgIC8vIGJ1aWxkIHRvb2xzIGZyb20gbWlzdGFraW5nIHRoZW0gZm9yIHJlYWwgcmVxdWlyZXMuXG4gICAgICAvLyBPdGhlcndpc2UgdGhlIGJ1aWxkIHRvb2xzIHdpbGwgYXR0ZW1wdCB0byBidWlsZCBhICclcycgbW9kdWxlLlxuICAgICAgJ1JlYWN0LiVzIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgJXMuJXMgZnJvbSByZXF1aXJlJyArICcoXFwnJXNcXCcpICcgKyAnaW5zdGVhZC4nLCBmbk5hbWUsIG5ld01vZHVsZSwgZm5OYW1lLCBuZXdQYWNrYWdlKSA6IHVuZGVmaW5lZDtcbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgICByZXR1cm4gZm4uYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgLy8gV2UgbmVlZCB0byBtYWtlIHN1cmUgYWxsIHByb3BlcnRpZXMgb2YgdGhlIG9yaWdpbmFsIGZuIGFyZSBjb3BpZWQgb3Zlci5cbiAgICAvLyBJbiBwYXJ0aWN1bGFyLCB0aGlzIGlzIG5lZWRlZCB0byBzdXBwb3J0IFByb3BUeXBlc1xuICAgIHJldHVybiBhc3NpZ24obmV3Rm4sIGZuKTtcbiAgfVxuXG4gIHJldHVybiBmbjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXByZWNhdGVkOyJdfQ==