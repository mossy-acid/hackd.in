/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPerf
 * @typechecks static-only
 */

'use strict';

/**
 * ReactPerf is a general AOP system designed to measure performance. This
 * module only has the hooks: see ReactDefaultPerf for the analysis tool.
 */

var ReactPerf = {
  /**
   * Boolean to enable/disable measurement. Set to false by default to prevent
   * accidental logging and perf loss.
   */
  enableMeasure: false,

  /**
   * Holds onto the measure function in use. By default, don't measure
   * anything, but we'll override this if we inject a measure function.
   */
  storedMeasure: _noMeasure,

  /**
   * @param {object} object
   * @param {string} objectName
   * @param {object<string>} methodNames
   */
  measureMethods: function measureMethods(object, objectName, methodNames) {
    if (process.env.NODE_ENV !== 'production') {
      for (var key in methodNames) {
        if (!methodNames.hasOwnProperty(key)) {
          continue;
        }
        object[key] = ReactPerf.measure(objectName, methodNames[key], object[key]);
      }
    }
  },

  /**
   * Use this to wrap methods you want to measure. Zero overhead in production.
   *
   * @param {string} objName
   * @param {string} fnName
   * @param {function} func
   * @return {function}
   */
  measure: function measure(objName, fnName, func) {
    if (process.env.NODE_ENV !== 'production') {
      var measuredFunc = null;
      var wrapper = function wrapper() {
        if (ReactPerf.enableMeasure) {
          if (!measuredFunc) {
            measuredFunc = ReactPerf.storedMeasure(objName, fnName, func);
          }
          return measuredFunc.apply(this, arguments);
        }
        return func.apply(this, arguments);
      };
      wrapper.displayName = objName + '_' + fnName;
      return wrapper;
    }
    return func;
  },

  injection: {
    /**
     * @param {function} measure
     */
    injectMeasure: function injectMeasure(measure) {
      ReactPerf.storedMeasure = measure;
    }
  }
};

/**
 * Simply passes through the measured function, without measuring it.
 *
 * @param {string} objName
 * @param {string} fnName
 * @param {function} func
 * @return {function}
 */
function _noMeasure(objName, fnName, func) {
  return func;
}

module.exports = ReactPerf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0UGVyZi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7Ozs7OztBQU1BLElBQUksWUFBWTs7Ozs7QUFLZCxpQkFBZSxLQUxEOzs7Ozs7QUFXZCxpQkFBZSxVQVhEOzs7Ozs7O0FBa0JkLGtCQUFnQix3QkFBVSxNQUFWLEVBQWtCLFVBQWxCLEVBQThCLFdBQTlCLEVBQTJDO0FBQ3pELFFBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUEyQztBQUN6QyxXQUFLLElBQUksR0FBVCxJQUFnQixXQUFoQixFQUE2QjtBQUMzQixZQUFJLENBQUMsWUFBWSxjQUFaLENBQTJCLEdBQTNCLENBQUwsRUFBc0M7QUFDcEM7QUFDRDtBQUNELGVBQU8sR0FBUCxJQUFjLFVBQVUsT0FBVixDQUFrQixVQUFsQixFQUE4QixZQUFZLEdBQVosQ0FBOUIsRUFBZ0QsT0FBTyxHQUFQLENBQWhELENBQWQ7QUFDRDtBQUNGO0FBQ0YsR0EzQmE7Ozs7Ozs7Ozs7QUFxQ2QsV0FBUyxpQkFBVSxPQUFWLEVBQW1CLE1BQW5CLEVBQTJCLElBQTNCLEVBQWlDO0FBQ3hDLFFBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUEyQztBQUN6QyxVQUFJLGVBQWUsSUFBbkI7QUFDQSxVQUFJLFVBQVUsU0FBVixPQUFVLEdBQVk7QUFDeEIsWUFBSSxVQUFVLGFBQWQsRUFBNkI7QUFDM0IsY0FBSSxDQUFDLFlBQUwsRUFBbUI7QUFDakIsMkJBQWUsVUFBVSxhQUFWLENBQXdCLE9BQXhCLEVBQWlDLE1BQWpDLEVBQXlDLElBQXpDLENBQWY7QUFDRDtBQUNELGlCQUFPLGFBQWEsS0FBYixDQUFtQixJQUFuQixFQUF5QixTQUF6QixDQUFQO0FBQ0Q7QUFDRCxlQUFPLEtBQUssS0FBTCxDQUFXLElBQVgsRUFBaUIsU0FBakIsQ0FBUDtBQUNELE9BUkQ7QUFTQSxjQUFRLFdBQVIsR0FBc0IsVUFBVSxHQUFWLEdBQWdCLE1BQXRDO0FBQ0EsYUFBTyxPQUFQO0FBQ0Q7QUFDRCxXQUFPLElBQVA7QUFDRCxHQXJEYTs7QUF1RGQsYUFBVzs7OztBQUlULG1CQUFlLHVCQUFVLE9BQVYsRUFBbUI7QUFDaEMsZ0JBQVUsYUFBVixHQUEwQixPQUExQjtBQUNEO0FBTlE7QUF2REcsQ0FBaEI7Ozs7Ozs7Ozs7QUF5RUEsU0FBUyxVQUFULENBQW9CLE9BQXBCLEVBQTZCLE1BQTdCLEVBQXFDLElBQXJDLEVBQTJDO0FBQ3pDLFNBQU8sSUFBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJSZWFjdFBlcmYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RQZXJmXG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBSZWFjdFBlcmYgaXMgYSBnZW5lcmFsIEFPUCBzeXN0ZW0gZGVzaWduZWQgdG8gbWVhc3VyZSBwZXJmb3JtYW5jZS4gVGhpc1xuICogbW9kdWxlIG9ubHkgaGFzIHRoZSBob29rczogc2VlIFJlYWN0RGVmYXVsdFBlcmYgZm9yIHRoZSBhbmFseXNpcyB0b29sLlxuICovXG52YXIgUmVhY3RQZXJmID0ge1xuICAvKipcbiAgICogQm9vbGVhbiB0byBlbmFibGUvZGlzYWJsZSBtZWFzdXJlbWVudC4gU2V0IHRvIGZhbHNlIGJ5IGRlZmF1bHQgdG8gcHJldmVudFxuICAgKiBhY2NpZGVudGFsIGxvZ2dpbmcgYW5kIHBlcmYgbG9zcy5cbiAgICovXG4gIGVuYWJsZU1lYXN1cmU6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBIb2xkcyBvbnRvIHRoZSBtZWFzdXJlIGZ1bmN0aW9uIGluIHVzZS4gQnkgZGVmYXVsdCwgZG9uJ3QgbWVhc3VyZVxuICAgKiBhbnl0aGluZywgYnV0IHdlJ2xsIG92ZXJyaWRlIHRoaXMgaWYgd2UgaW5qZWN0IGEgbWVhc3VyZSBmdW5jdGlvbi5cbiAgICovXG4gIHN0b3JlZE1lYXN1cmU6IF9ub01lYXN1cmUsXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9iamVjdE5hbWVcbiAgICogQHBhcmFtIHtvYmplY3Q8c3RyaW5nPn0gbWV0aG9kTmFtZXNcbiAgICovXG4gIG1lYXN1cmVNZXRob2RzOiBmdW5jdGlvbiAob2JqZWN0LCBvYmplY3ROYW1lLCBtZXRob2ROYW1lcykge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gbWV0aG9kTmFtZXMpIHtcbiAgICAgICAgaWYgKCFtZXRob2ROYW1lcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgb2JqZWN0W2tleV0gPSBSZWFjdFBlcmYubWVhc3VyZShvYmplY3ROYW1lLCBtZXRob2ROYW1lc1trZXldLCBvYmplY3Rba2V5XSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBVc2UgdGhpcyB0byB3cmFwIG1ldGhvZHMgeW91IHdhbnQgdG8gbWVhc3VyZS4gWmVybyBvdmVyaGVhZCBpbiBwcm9kdWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb2JqTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZm5OYW1lXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1bmNcbiAgICogQHJldHVybiB7ZnVuY3Rpb259XG4gICAqL1xuICBtZWFzdXJlOiBmdW5jdGlvbiAob2JqTmFtZSwgZm5OYW1lLCBmdW5jKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhciBtZWFzdXJlZEZ1bmMgPSBudWxsO1xuICAgICAgdmFyIHdyYXBwZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChSZWFjdFBlcmYuZW5hYmxlTWVhc3VyZSkge1xuICAgICAgICAgIGlmICghbWVhc3VyZWRGdW5jKSB7XG4gICAgICAgICAgICBtZWFzdXJlZEZ1bmMgPSBSZWFjdFBlcmYuc3RvcmVkTWVhc3VyZShvYmpOYW1lLCBmbk5hbWUsIGZ1bmMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbWVhc3VyZWRGdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICB3cmFwcGVyLmRpc3BsYXlOYW1lID0gb2JqTmFtZSArICdfJyArIGZuTmFtZTtcbiAgICAgIHJldHVybiB3cmFwcGVyO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYztcbiAgfSxcblxuICBpbmplY3Rpb246IHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBtZWFzdXJlXG4gICAgICovXG4gICAgaW5qZWN0TWVhc3VyZTogZnVuY3Rpb24gKG1lYXN1cmUpIHtcbiAgICAgIFJlYWN0UGVyZi5zdG9yZWRNZWFzdXJlID0gbWVhc3VyZTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogU2ltcGx5IHBhc3NlcyB0aHJvdWdoIHRoZSBtZWFzdXJlZCBmdW5jdGlvbiwgd2l0aG91dCBtZWFzdXJpbmcgaXQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG9iak5hbWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBmbk5hbWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1bmNcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBfbm9NZWFzdXJlKG9iak5hbWUsIGZuTmFtZSwgZnVuYykge1xuICByZXR1cm4gZnVuYztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFBlcmY7Il19