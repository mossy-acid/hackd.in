/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactStateSetters
 */

'use strict';

var ReactStateSetters = {
  /**
   * Returns a function that calls the provided function, and uses the result
   * of that to set the component's state.
   *
   * @param {ReactCompositeComponent} component
   * @param {function} funcReturningState Returned callback uses this to
   *                                      determine how to update state.
   * @return {function} callback that when invoked uses funcReturningState to
   *                    determined the object literal to setState.
   */
  createStateSetter: function createStateSetter(component, funcReturningState) {
    return function (a, b, c, d, e, f) {
      var partialState = funcReturningState.call(component, a, b, c, d, e, f);
      if (partialState) {
        component.setState(partialState);
      }
    };
  },

  /**
   * Returns a single-argument callback that can be used to update a single
   * key in the component's state.
   *
   * Note: this is memoized function, which makes it inexpensive to call.
   *
   * @param {ReactCompositeComponent} component
   * @param {string} key The key in the state that you should update.
   * @return {function} callback of 1 argument which calls setState() with
   *                    the provided keyName and callback argument.
   */
  createStateKeySetter: function createStateKeySetter(component, key) {
    // Memoize the setters.
    var cache = component.__keySetters || (component.__keySetters = {});
    return cache[key] || (cache[key] = _createStateKeySetter(component, key));
  }
};

function _createStateKeySetter(component, key) {
  // Partial state is allocated outside of the function closure so it can be
  // reused with every call, avoiding memory allocation when this function
  // is called.
  var partialState = {};
  return function stateKeySetter(value) {
    partialState[key] = value;
    component.setState(partialState);
  };
}

ReactStateSetters.Mixin = {
  /**
   * Returns a function that calls the provided function, and uses the result
   * of that to set the component's state.
   *
   * For example, these statements are equivalent:
   *
   *   this.setState({x: 1});
   *   this.createStateSetter(function(xValue) {
   *     return {x: xValue};
   *   })(1);
   *
   * @param {function} funcReturningState Returned callback uses this to
   *                                      determine how to update state.
   * @return {function} callback that when invoked uses funcReturningState to
   *                    determined the object literal to setState.
   */
  createStateSetter: function createStateSetter(funcReturningState) {
    return ReactStateSetters.createStateSetter(this, funcReturningState);
  },

  /**
   * Returns a single-argument callback that can be used to update a single
   * key in the component's state.
   *
   * For example, these statements are equivalent:
   *
   *   this.setState({x: 1});
   *   this.createStateKeySetter('x')(1);
   *
   * Note: this is memoized function, which makes it inexpensive to call.
   *
   * @param {string} key The key in the state that you should update.
   * @return {function} callback of 1 argument which calls setState() with
   *                    the provided keyName and callback argument.
   */
  createStateKeySetter: function createStateKeySetter(key) {
    return ReactStateSetters.createStateKeySetter(this, key);
  }
};

module.exports = ReactStateSetters;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0U3RhdGVTZXR0ZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxvQkFBb0I7Ozs7Ozs7Ozs7O0FBV3RCLHFCQUFtQiwyQkFBVSxTQUFWLEVBQXFCLGtCQUFyQixFQUF5QztBQUMxRCxXQUFPLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEI7QUFDakMsVUFBSSxlQUFlLG1CQUFtQixJQUFuQixDQUF3QixTQUF4QixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5QyxDQUF6QyxFQUE0QyxDQUE1QyxFQUErQyxDQUEvQyxFQUFrRCxDQUFsRCxDQUFuQjtBQUNBLFVBQUksWUFBSixFQUFrQjtBQUNoQixrQkFBVSxRQUFWLENBQW1CLFlBQW5CO0FBQ0Q7QUFDRixLQUxEO0FBTUQsR0FsQnFCOzs7Ozs7Ozs7Ozs7O0FBK0J0Qix3QkFBc0IsOEJBQVUsU0FBVixFQUFxQixHQUFyQixFQUEwQjs7QUFFOUMsUUFBSSxRQUFRLFVBQVUsWUFBVixLQUEyQixVQUFVLFlBQVYsR0FBeUIsRUFBcEQsQ0FBWjtBQUNBLFdBQU8sTUFBTSxHQUFOLE1BQWUsTUFBTSxHQUFOLElBQWEsc0JBQXFCLFNBQXJCLEVBQWdDLEdBQWhDLENBQTVCLENBQVA7QUFDRDtBQW5DcUIsQ0FBeEI7O0FBc0NBLFNBQVMscUJBQVQsQ0FBOEIsU0FBOUIsRUFBeUMsR0FBekMsRUFBOEM7Ozs7QUFJNUMsTUFBSSxlQUFlLEVBQW5CO0FBQ0EsU0FBTyxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsRUFBK0I7QUFDcEMsaUJBQWEsR0FBYixJQUFvQixLQUFwQjtBQUNBLGNBQVUsUUFBVixDQUFtQixZQUFuQjtBQUNELEdBSEQ7QUFJRDs7QUFFRCxrQkFBa0IsS0FBbEIsR0FBMEI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJ4QixxQkFBbUIsMkJBQVUsa0JBQVYsRUFBOEI7QUFDL0MsV0FBTyxrQkFBa0IsaUJBQWxCLENBQW9DLElBQXBDLEVBQTBDLGtCQUExQyxDQUFQO0FBQ0QsR0FuQnVCOzs7Ozs7Ozs7Ozs7Ozs7OztBQW9DeEIsd0JBQXNCLDhCQUFVLEdBQVYsRUFBZTtBQUNuQyxXQUFPLGtCQUFrQixvQkFBbEIsQ0FBdUMsSUFBdkMsRUFBNkMsR0FBN0MsQ0FBUDtBQUNEO0FBdEN1QixDQUExQjs7QUF5Q0EsT0FBTyxPQUFQLEdBQWlCLGlCQUFqQiIsImZpbGUiOiJSZWFjdFN0YXRlU2V0dGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdFN0YXRlU2V0dGVyc1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0U3RhdGVTZXR0ZXJzID0ge1xuICAvKipcbiAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uLCBhbmQgdXNlcyB0aGUgcmVzdWx0XG4gICAqIG9mIHRoYXQgdG8gc2V0IHRoZSBjb21wb25lbnQncyBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENvbXBvc2l0ZUNvbXBvbmVudH0gY29tcG9uZW50XG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1bmNSZXR1cm5pbmdTdGF0ZSBSZXR1cm5lZCBjYWxsYmFjayB1c2VzIHRoaXMgdG9cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGVybWluZSBob3cgdG8gdXBkYXRlIHN0YXRlLlxuICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gY2FsbGJhY2sgdGhhdCB3aGVuIGludm9rZWQgdXNlcyBmdW5jUmV0dXJuaW5nU3RhdGUgdG9cbiAgICogICAgICAgICAgICAgICAgICAgIGRldGVybWluZWQgdGhlIG9iamVjdCBsaXRlcmFsIHRvIHNldFN0YXRlLlxuICAgKi9cbiAgY3JlYXRlU3RhdGVTZXR0ZXI6IGZ1bmN0aW9uIChjb21wb25lbnQsIGZ1bmNSZXR1cm5pbmdTdGF0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYywgZCwgZSwgZikge1xuICAgICAgdmFyIHBhcnRpYWxTdGF0ZSA9IGZ1bmNSZXR1cm5pbmdTdGF0ZS5jYWxsKGNvbXBvbmVudCwgYSwgYiwgYywgZCwgZSwgZik7XG4gICAgICBpZiAocGFydGlhbFN0YXRlKSB7XG4gICAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZShwYXJ0aWFsU3RhdGUpO1xuICAgICAgfVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzaW5nbGUtYXJndW1lbnQgY2FsbGJhY2sgdGhhdCBjYW4gYmUgdXNlZCB0byB1cGRhdGUgYSBzaW5nbGVcbiAgICoga2V5IGluIHRoZSBjb21wb25lbnQncyBzdGF0ZS5cbiAgICpcbiAgICogTm90ZTogdGhpcyBpcyBtZW1vaXplZCBmdW5jdGlvbiwgd2hpY2ggbWFrZXMgaXQgaW5leHBlbnNpdmUgdG8gY2FsbC5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENvbXBvc2l0ZUNvbXBvbmVudH0gY29tcG9uZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBpbiB0aGUgc3RhdGUgdGhhdCB5b3Ugc2hvdWxkIHVwZGF0ZS5cbiAgICogQHJldHVybiB7ZnVuY3Rpb259IGNhbGxiYWNrIG9mIDEgYXJndW1lbnQgd2hpY2ggY2FsbHMgc2V0U3RhdGUoKSB3aXRoXG4gICAqICAgICAgICAgICAgICAgICAgICB0aGUgcHJvdmlkZWQga2V5TmFtZSBhbmQgY2FsbGJhY2sgYXJndW1lbnQuXG4gICAqL1xuICBjcmVhdGVTdGF0ZUtleVNldHRlcjogZnVuY3Rpb24gKGNvbXBvbmVudCwga2V5KSB7XG4gICAgLy8gTWVtb2l6ZSB0aGUgc2V0dGVycy5cbiAgICB2YXIgY2FjaGUgPSBjb21wb25lbnQuX19rZXlTZXR0ZXJzIHx8IChjb21wb25lbnQuX19rZXlTZXR0ZXJzID0ge30pO1xuICAgIHJldHVybiBjYWNoZVtrZXldIHx8IChjYWNoZVtrZXldID0gY3JlYXRlU3RhdGVLZXlTZXR0ZXIoY29tcG9uZW50LCBrZXkpKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gY3JlYXRlU3RhdGVLZXlTZXR0ZXIoY29tcG9uZW50LCBrZXkpIHtcbiAgLy8gUGFydGlhbCBzdGF0ZSBpcyBhbGxvY2F0ZWQgb3V0c2lkZSBvZiB0aGUgZnVuY3Rpb24gY2xvc3VyZSBzbyBpdCBjYW4gYmVcbiAgLy8gcmV1c2VkIHdpdGggZXZlcnkgY2FsbCwgYXZvaWRpbmcgbWVtb3J5IGFsbG9jYXRpb24gd2hlbiB0aGlzIGZ1bmN0aW9uXG4gIC8vIGlzIGNhbGxlZC5cbiAgdmFyIHBhcnRpYWxTdGF0ZSA9IHt9O1xuICByZXR1cm4gZnVuY3Rpb24gc3RhdGVLZXlTZXR0ZXIodmFsdWUpIHtcbiAgICBwYXJ0aWFsU3RhdGVba2V5XSA9IHZhbHVlO1xuICAgIGNvbXBvbmVudC5zZXRTdGF0ZShwYXJ0aWFsU3RhdGUpO1xuICB9O1xufVxuXG5SZWFjdFN0YXRlU2V0dGVycy5NaXhpbiA9IHtcbiAgLyoqXG4gICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNhbGxzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiwgYW5kIHVzZXMgdGhlIHJlc3VsdFxuICAgKiBvZiB0aGF0IHRvIHNldCB0aGUgY29tcG9uZW50J3Mgc3RhdGUuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCB0aGVzZSBzdGF0ZW1lbnRzIGFyZSBlcXVpdmFsZW50OlxuICAgKlxuICAgKiAgIHRoaXMuc2V0U3RhdGUoe3g6IDF9KTtcbiAgICogICB0aGlzLmNyZWF0ZVN0YXRlU2V0dGVyKGZ1bmN0aW9uKHhWYWx1ZSkge1xuICAgKiAgICAgcmV0dXJuIHt4OiB4VmFsdWV9O1xuICAgKiAgIH0pKDEpO1xuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jUmV0dXJuaW5nU3RhdGUgUmV0dXJuZWQgY2FsbGJhY2sgdXNlcyB0aGlzIHRvXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRlcm1pbmUgaG93IHRvIHVwZGF0ZSBzdGF0ZS5cbiAgICogQHJldHVybiB7ZnVuY3Rpb259IGNhbGxiYWNrIHRoYXQgd2hlbiBpbnZva2VkIHVzZXMgZnVuY1JldHVybmluZ1N0YXRlIHRvXG4gICAqICAgICAgICAgICAgICAgICAgICBkZXRlcm1pbmVkIHRoZSBvYmplY3QgbGl0ZXJhbCB0byBzZXRTdGF0ZS5cbiAgICovXG4gIGNyZWF0ZVN0YXRlU2V0dGVyOiBmdW5jdGlvbiAoZnVuY1JldHVybmluZ1N0YXRlKSB7XG4gICAgcmV0dXJuIFJlYWN0U3RhdGVTZXR0ZXJzLmNyZWF0ZVN0YXRlU2V0dGVyKHRoaXMsIGZ1bmNSZXR1cm5pbmdTdGF0ZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzaW5nbGUtYXJndW1lbnQgY2FsbGJhY2sgdGhhdCBjYW4gYmUgdXNlZCB0byB1cGRhdGUgYSBzaW5nbGVcbiAgICoga2V5IGluIHRoZSBjb21wb25lbnQncyBzdGF0ZS5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHRoZXNlIHN0YXRlbWVudHMgYXJlIGVxdWl2YWxlbnQ6XG4gICAqXG4gICAqICAgdGhpcy5zZXRTdGF0ZSh7eDogMX0pO1xuICAgKiAgIHRoaXMuY3JlYXRlU3RhdGVLZXlTZXR0ZXIoJ3gnKSgxKTtcbiAgICpcbiAgICogTm90ZTogdGhpcyBpcyBtZW1vaXplZCBmdW5jdGlvbiwgd2hpY2ggbWFrZXMgaXQgaW5leHBlbnNpdmUgdG8gY2FsbC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IGluIHRoZSBzdGF0ZSB0aGF0IHlvdSBzaG91bGQgdXBkYXRlLlxuICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gY2FsbGJhY2sgb2YgMSBhcmd1bWVudCB3aGljaCBjYWxscyBzZXRTdGF0ZSgpIHdpdGhcbiAgICogICAgICAgICAgICAgICAgICAgIHRoZSBwcm92aWRlZCBrZXlOYW1lIGFuZCBjYWxsYmFjayBhcmd1bWVudC5cbiAgICovXG4gIGNyZWF0ZVN0YXRlS2V5U2V0dGVyOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIFJlYWN0U3RhdGVTZXR0ZXJzLmNyZWF0ZVN0YXRlS2V5U2V0dGVyKHRoaXMsIGtleSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RTdGF0ZVNldHRlcnM7Il19