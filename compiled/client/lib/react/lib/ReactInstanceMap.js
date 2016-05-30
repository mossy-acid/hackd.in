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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0SW5zdGFuY2VNYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7Ozs7Ozs7Ozs7QUFVQSxJQUFJLG1CQUFtQjs7Ozs7OztBQU9yQixVQUFRLGdCQUFVLEdBQVYsRUFBZTtBQUNyQixRQUFJLHNCQUFKLEdBQTZCLFNBQTdCO0FBQ0QsR0FUb0I7O0FBV3JCLE9BQUssYUFBVSxHQUFWLEVBQWU7QUFDbEIsV0FBTyxJQUFJLHNCQUFYO0FBQ0QsR0Fib0I7O0FBZXJCLE9BQUssYUFBVSxHQUFWLEVBQWU7QUFDbEIsV0FBTyxJQUFJLHNCQUFKLEtBQStCLFNBQXRDO0FBQ0QsR0FqQm9COztBQW1CckIsT0FBSyxhQUFVLEdBQVYsRUFBZSxLQUFmLEVBQXNCO0FBQ3pCLFFBQUksc0JBQUosR0FBNkIsS0FBN0I7QUFDRDs7QUFyQm9CLENBQXZCOztBQXlCQSxPQUFPLE9BQVAsR0FBaUIsZ0JBQWpCIiwiZmlsZSI6IlJlYWN0SW5zdGFuY2VNYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RJbnN0YW5jZU1hcFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBgUmVhY3RJbnN0YW5jZU1hcGAgbWFpbnRhaW5zIGEgbWFwcGluZyBmcm9tIGEgcHVibGljIGZhY2luZyBzdGF0ZWZ1bFxuICogaW5zdGFuY2UgKGtleSkgYW5kIHRoZSBpbnRlcm5hbCByZXByZXNlbnRhdGlvbiAodmFsdWUpLiBUaGlzIGFsbG93cyBwdWJsaWNcbiAqIG1ldGhvZHMgdG8gYWNjZXB0IHRoZSB1c2VyIGZhY2luZyBpbnN0YW5jZSBhcyBhbiBhcmd1bWVudCBhbmQgbWFwIHRoZW0gYmFja1xuICogdG8gaW50ZXJuYWwgbWV0aG9kcy5cbiAqL1xuXG4vLyBUT0RPOiBSZXBsYWNlIHRoaXMgd2l0aCBFUzY6IHZhciBSZWFjdEluc3RhbmNlTWFwID0gbmV3IE1hcCgpO1xudmFyIFJlYWN0SW5zdGFuY2VNYXAgPSB7XG5cbiAgLyoqXG4gICAqIFRoaXMgQVBJIHNob3VsZCBiZSBjYWxsZWQgYGRlbGV0ZWAgYnV0IHdlJ2QgaGF2ZSB0byBtYWtlIHN1cmUgdG8gYWx3YXlzXG4gICAqIHRyYW5zZm9ybSB0aGVzZSB0byBzdHJpbmdzIGZvciBJRSBzdXBwb3J0LiBXaGVuIHRoaXMgdHJhbnNmb3JtIGlzIGZ1bGx5XG4gICAqIHN1cHBvcnRlZCB3ZSBjYW4gcmVuYW1lIGl0LlxuICAgKi9cbiAgcmVtb3ZlOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAga2V5Ll9yZWFjdEludGVybmFsSW5zdGFuY2UgPSB1bmRlZmluZWQ7XG4gIH0sXG5cbiAgZ2V0OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGtleS5fcmVhY3RJbnRlcm5hbEluc3RhbmNlO1xuICB9LFxuXG4gIGhhczogZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBrZXkuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZSAhPT0gdW5kZWZpbmVkO1xuICB9LFxuXG4gIHNldDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICBrZXkuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZSA9IHZhbHVlO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RJbnN0YW5jZU1hcDsiXX0=