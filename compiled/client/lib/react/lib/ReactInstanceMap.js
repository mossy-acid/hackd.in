/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInstanceMap
 */

'use strict';

/**
 * `ReactInstanceMap` maintains a mapping from a public facing stateful
 * instance (key) and the internal representation (value). This allows public
 * methods to accept the user facing instance as an argument and map them back
 * to internal methods.
 */

// TODO: Replace this with ES6: var ReactInstanceMap = new Map();

var ReactInstanceMap = {

  /**
   * This API should be called `delete` but we'd have to make sure to always
   * transform these to strings for IE support. When this transform is fully
   * supported we can rename it.
   */
  remove: function remove(key) {
    key._reactInternalInstance = undefined;
  },

  get: function get(key) {
    return key._reactInternalInstance;
  },

  has: function has(key) {
    return key._reactInternalInstance !== undefined;
  },

  set: function set(key, value) {
    key._reactInternalInstance = value;
  }

};

module.exports = ReactInstanceMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0SW5zdGFuY2VNYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7Ozs7Ozs7Ozs7QUFVQSxJQUFJLG1CQUFtQjs7Ozs7OztBQU9yQixVQUFRLGdCQUFVLEdBQVYsRUFBZTtBQUNyQixRQUFJLHNCQUFKLEdBQTZCLFNBQTdCLENBRHFCO0dBQWY7O0FBSVIsT0FBSyxhQUFVLEdBQVYsRUFBZTtBQUNsQixXQUFPLElBQUksc0JBQUosQ0FEVztHQUFmOztBQUlMLE9BQUssYUFBVSxHQUFWLEVBQWU7QUFDbEIsV0FBTyxJQUFJLHNCQUFKLEtBQStCLFNBQS9CLENBRFc7R0FBZjs7QUFJTCxPQUFLLGFBQVUsR0FBVixFQUFlLEtBQWYsRUFBc0I7QUFDekIsUUFBSSxzQkFBSixHQUE2QixLQUE3QixDQUR5QjtHQUF0Qjs7Q0FuQkg7O0FBeUJKLE9BQU8sT0FBUCxHQUFpQixnQkFBakIiLCJmaWxlIjoiUmVhY3RJbnN0YW5jZU1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdEluc3RhbmNlTWFwXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIGBSZWFjdEluc3RhbmNlTWFwYCBtYWludGFpbnMgYSBtYXBwaW5nIGZyb20gYSBwdWJsaWMgZmFjaW5nIHN0YXRlZnVsXG4gKiBpbnN0YW5jZSAoa2V5KSBhbmQgdGhlIGludGVybmFsIHJlcHJlc2VudGF0aW9uICh2YWx1ZSkuIFRoaXMgYWxsb3dzIHB1YmxpY1xuICogbWV0aG9kcyB0byBhY2NlcHQgdGhlIHVzZXIgZmFjaW5nIGluc3RhbmNlIGFzIGFuIGFyZ3VtZW50IGFuZCBtYXAgdGhlbSBiYWNrXG4gKiB0byBpbnRlcm5hbCBtZXRob2RzLlxuICovXG5cbi8vIFRPRE86IFJlcGxhY2UgdGhpcyB3aXRoIEVTNjogdmFyIFJlYWN0SW5zdGFuY2VNYXAgPSBuZXcgTWFwKCk7XG52YXIgUmVhY3RJbnN0YW5jZU1hcCA9IHtcblxuICAvKipcbiAgICogVGhpcyBBUEkgc2hvdWxkIGJlIGNhbGxlZCBgZGVsZXRlYCBidXQgd2UnZCBoYXZlIHRvIG1ha2Ugc3VyZSB0byBhbHdheXNcbiAgICogdHJhbnNmb3JtIHRoZXNlIHRvIHN0cmluZ3MgZm9yIElFIHN1cHBvcnQuIFdoZW4gdGhpcyB0cmFuc2Zvcm0gaXMgZnVsbHlcbiAgICogc3VwcG9ydGVkIHdlIGNhbiByZW5hbWUgaXQuXG4gICAqL1xuICByZW1vdmU6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBrZXkuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZSA9IHVuZGVmaW5lZDtcbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4ga2V5Ll9yZWFjdEludGVybmFsSW5zdGFuY2U7XG4gIH0sXG5cbiAgaGFzOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGtleS5fcmVhY3RJbnRlcm5hbEluc3RhbmNlICE9PSB1bmRlZmluZWQ7XG4gIH0sXG5cbiAgc2V0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIGtleS5fcmVhY3RJbnRlcm5hbEluc3RhbmNlID0gdmFsdWU7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdEluc3RhbmNlTWFwOyJdfQ==