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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0U3RhdGVTZXR0ZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxvQkFBb0I7Ozs7Ozs7Ozs7O0FBV3RCLHFCQUFtQiwyQkFBVSxTQUFWLEVBQXFCLGtCQUFyQixFQUF5QztBQUMxRCxXQUFPLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEI7QUFDakMsVUFBSSxlQUFlLG1CQUFtQixJQUFuQixDQUF3QixTQUF4QixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5QyxDQUF6QyxFQUE0QyxDQUE1QyxFQUErQyxDQUEvQyxFQUFrRCxDQUFsRCxDQUFmLENBRDZCO0FBRWpDLFVBQUksWUFBSixFQUFrQjtBQUNoQixrQkFBVSxRQUFWLENBQW1CLFlBQW5CLEVBRGdCO09BQWxCO0tBRkssQ0FEbUQ7R0FBekM7Ozs7Ozs7Ozs7Ozs7QUFvQm5CLHdCQUFzQiw4QkFBVSxTQUFWLEVBQXFCLEdBQXJCLEVBQTBCOztBQUU5QyxRQUFJLFFBQVEsVUFBVSxZQUFWLEtBQTJCLFVBQVUsWUFBVixHQUF5QixFQUF6QixDQUEzQixDQUZrQztBQUc5QyxXQUFPLE1BQU0sR0FBTixNQUFlLE1BQU0sR0FBTixJQUFhLHNCQUFxQixTQUFyQixFQUFnQyxHQUFoQyxDQUFiLENBQWYsQ0FIdUM7R0FBMUI7Q0EvQnBCOztBQXNDSixTQUFTLHFCQUFULENBQThCLFNBQTlCLEVBQXlDLEdBQXpDLEVBQThDOzs7O0FBSTVDLE1BQUksZUFBZSxFQUFmLENBSndDO0FBSzVDLFNBQU8sU0FBUyxjQUFULENBQXdCLEtBQXhCLEVBQStCO0FBQ3BDLGlCQUFhLEdBQWIsSUFBb0IsS0FBcEIsQ0FEb0M7QUFFcEMsY0FBVSxRQUFWLENBQW1CLFlBQW5CLEVBRm9DO0dBQS9CLENBTHFDO0NBQTlDOztBQVdBLGtCQUFrQixLQUFsQixHQUEwQjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQnhCLHFCQUFtQiwyQkFBVSxrQkFBVixFQUE4QjtBQUMvQyxXQUFPLGtCQUFrQixpQkFBbEIsQ0FBb0MsSUFBcEMsRUFBMEMsa0JBQTFDLENBQVAsQ0FEK0M7R0FBOUI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJuQix3QkFBc0IsOEJBQVUsR0FBVixFQUFlO0FBQ25DLFdBQU8sa0JBQWtCLG9CQUFsQixDQUF1QyxJQUF2QyxFQUE2QyxHQUE3QyxDQUFQLENBRG1DO0dBQWY7Q0FwQ3hCOztBQXlDQSxPQUFPLE9BQVAsR0FBaUIsaUJBQWpCIiwiZmlsZSI6IlJlYWN0U3RhdGVTZXR0ZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0U3RhdGVTZXR0ZXJzXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RTdGF0ZVNldHRlcnMgPSB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24sIGFuZCB1c2VzIHRoZSByZXN1bHRcbiAgICogb2YgdGhhdCB0byBzZXQgdGhlIGNvbXBvbmVudCdzIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q29tcG9zaXRlQ29tcG9uZW50fSBjb21wb25lbnRcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuY1JldHVybmluZ1N0YXRlIFJldHVybmVkIGNhbGxiYWNrIHVzZXMgdGhpcyB0b1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0ZXJtaW5lIGhvdyB0byB1cGRhdGUgc3RhdGUuXG4gICAqIEByZXR1cm4ge2Z1bmN0aW9ufSBjYWxsYmFjayB0aGF0IHdoZW4gaW52b2tlZCB1c2VzIGZ1bmNSZXR1cm5pbmdTdGF0ZSB0b1xuICAgKiAgICAgICAgICAgICAgICAgICAgZGV0ZXJtaW5lZCB0aGUgb2JqZWN0IGxpdGVyYWwgdG8gc2V0U3RhdGUuXG4gICAqL1xuICBjcmVhdGVTdGF0ZVNldHRlcjogZnVuY3Rpb24gKGNvbXBvbmVudCwgZnVuY1JldHVybmluZ1N0YXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhLCBiLCBjLCBkLCBlLCBmKSB7XG4gICAgICB2YXIgcGFydGlhbFN0YXRlID0gZnVuY1JldHVybmluZ1N0YXRlLmNhbGwoY29tcG9uZW50LCBhLCBiLCBjLCBkLCBlLCBmKTtcbiAgICAgIGlmIChwYXJ0aWFsU3RhdGUpIHtcbiAgICAgICAgY29tcG9uZW50LnNldFN0YXRlKHBhcnRpYWxTdGF0ZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyBhIHNpbmdsZS1hcmd1bWVudCBjYWxsYmFjayB0aGF0IGNhbiBiZSB1c2VkIHRvIHVwZGF0ZSBhIHNpbmdsZVxuICAgKiBrZXkgaW4gdGhlIGNvbXBvbmVudCdzIHN0YXRlLlxuICAgKlxuICAgKiBOb3RlOiB0aGlzIGlzIG1lbW9pemVkIGZ1bmN0aW9uLCB3aGljaCBtYWtlcyBpdCBpbmV4cGVuc2l2ZSB0byBjYWxsLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q29tcG9zaXRlQ29tcG9uZW50fSBjb21wb25lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IGluIHRoZSBzdGF0ZSB0aGF0IHlvdSBzaG91bGQgdXBkYXRlLlxuICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gY2FsbGJhY2sgb2YgMSBhcmd1bWVudCB3aGljaCBjYWxscyBzZXRTdGF0ZSgpIHdpdGhcbiAgICogICAgICAgICAgICAgICAgICAgIHRoZSBwcm92aWRlZCBrZXlOYW1lIGFuZCBjYWxsYmFjayBhcmd1bWVudC5cbiAgICovXG4gIGNyZWF0ZVN0YXRlS2V5U2V0dGVyOiBmdW5jdGlvbiAoY29tcG9uZW50LCBrZXkpIHtcbiAgICAvLyBNZW1vaXplIHRoZSBzZXR0ZXJzLlxuICAgIHZhciBjYWNoZSA9IGNvbXBvbmVudC5fX2tleVNldHRlcnMgfHwgKGNvbXBvbmVudC5fX2tleVNldHRlcnMgPSB7fSk7XG4gICAgcmV0dXJuIGNhY2hlW2tleV0gfHwgKGNhY2hlW2tleV0gPSBjcmVhdGVTdGF0ZUtleVNldHRlcihjb21wb25lbnQsIGtleSkpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVTdGF0ZUtleVNldHRlcihjb21wb25lbnQsIGtleSkge1xuICAvLyBQYXJ0aWFsIHN0YXRlIGlzIGFsbG9jYXRlZCBvdXRzaWRlIG9mIHRoZSBmdW5jdGlvbiBjbG9zdXJlIHNvIGl0IGNhbiBiZVxuICAvLyByZXVzZWQgd2l0aCBldmVyeSBjYWxsLCBhdm9pZGluZyBtZW1vcnkgYWxsb2NhdGlvbiB3aGVuIHRoaXMgZnVuY3Rpb25cbiAgLy8gaXMgY2FsbGVkLlxuICB2YXIgcGFydGlhbFN0YXRlID0ge307XG4gIHJldHVybiBmdW5jdGlvbiBzdGF0ZUtleVNldHRlcih2YWx1ZSkge1xuICAgIHBhcnRpYWxTdGF0ZVtrZXldID0gdmFsdWU7XG4gICAgY29tcG9uZW50LnNldFN0YXRlKHBhcnRpYWxTdGF0ZSk7XG4gIH07XG59XG5cblJlYWN0U3RhdGVTZXR0ZXJzLk1peGluID0ge1xuICAvKipcbiAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uLCBhbmQgdXNlcyB0aGUgcmVzdWx0XG4gICAqIG9mIHRoYXQgdG8gc2V0IHRoZSBjb21wb25lbnQncyBzdGF0ZS5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHRoZXNlIHN0YXRlbWVudHMgYXJlIGVxdWl2YWxlbnQ6XG4gICAqXG4gICAqICAgdGhpcy5zZXRTdGF0ZSh7eDogMX0pO1xuICAgKiAgIHRoaXMuY3JlYXRlU3RhdGVTZXR0ZXIoZnVuY3Rpb24oeFZhbHVlKSB7XG4gICAqICAgICByZXR1cm4ge3g6IHhWYWx1ZX07XG4gICAqICAgfSkoMSk7XG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1bmNSZXR1cm5pbmdTdGF0ZSBSZXR1cm5lZCBjYWxsYmFjayB1c2VzIHRoaXMgdG9cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGVybWluZSBob3cgdG8gdXBkYXRlIHN0YXRlLlxuICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gY2FsbGJhY2sgdGhhdCB3aGVuIGludm9rZWQgdXNlcyBmdW5jUmV0dXJuaW5nU3RhdGUgdG9cbiAgICogICAgICAgICAgICAgICAgICAgIGRldGVybWluZWQgdGhlIG9iamVjdCBsaXRlcmFsIHRvIHNldFN0YXRlLlxuICAgKi9cbiAgY3JlYXRlU3RhdGVTZXR0ZXI6IGZ1bmN0aW9uIChmdW5jUmV0dXJuaW5nU3RhdGUpIHtcbiAgICByZXR1cm4gUmVhY3RTdGF0ZVNldHRlcnMuY3JlYXRlU3RhdGVTZXR0ZXIodGhpcywgZnVuY1JldHVybmluZ1N0YXRlKTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyBhIHNpbmdsZS1hcmd1bWVudCBjYWxsYmFjayB0aGF0IGNhbiBiZSB1c2VkIHRvIHVwZGF0ZSBhIHNpbmdsZVxuICAgKiBrZXkgaW4gdGhlIGNvbXBvbmVudCdzIHN0YXRlLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgdGhlc2Ugc3RhdGVtZW50cyBhcmUgZXF1aXZhbGVudDpcbiAgICpcbiAgICogICB0aGlzLnNldFN0YXRlKHt4OiAxfSk7XG4gICAqICAgdGhpcy5jcmVhdGVTdGF0ZUtleVNldHRlcigneCcpKDEpO1xuICAgKlxuICAgKiBOb3RlOiB0aGlzIGlzIG1lbW9pemVkIGZ1bmN0aW9uLCB3aGljaCBtYWtlcyBpdCBpbmV4cGVuc2l2ZSB0byBjYWxsLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgaW4gdGhlIHN0YXRlIHRoYXQgeW91IHNob3VsZCB1cGRhdGUuXG4gICAqIEByZXR1cm4ge2Z1bmN0aW9ufSBjYWxsYmFjayBvZiAxIGFyZ3VtZW50IHdoaWNoIGNhbGxzIHNldFN0YXRlKCkgd2l0aFxuICAgKiAgICAgICAgICAgICAgICAgICAgdGhlIHByb3ZpZGVkIGtleU5hbWUgYW5kIGNhbGxiYWNrIGFyZ3VtZW50LlxuICAgKi9cbiAgY3JlYXRlU3RhdGVLZXlTZXR0ZXI6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gUmVhY3RTdGF0ZVNldHRlcnMuY3JlYXRlU3RhdGVLZXlTZXR0ZXIodGhpcywga2V5KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFN0YXRlU2V0dGVyczsiXX0=