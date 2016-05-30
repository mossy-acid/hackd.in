/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactOwner
 */

'use strict';

var invariant = require('fbjs/lib/invariant');

/**
 * ReactOwners are capable of storing references to owned components.
 *
 * All components are capable of //being// referenced by owner components, but
 * only ReactOwner components are capable of //referencing// owned components.
 * The named reference is known as a "ref".
 *
 * Refs are available when mounted and updated during reconciliation.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return (
 *         <div onClick={this.handleClick}>
 *           <CustomComponent ref="custom" />
 *         </div>
 *       );
 *     },
 *     handleClick: function() {
 *       this.refs.custom.handleClick();
 *     },
 *     componentDidMount: function() {
 *       this.refs.custom.initialize();
 *     }
 *   });
 *
 * Refs should rarely be used. When refs are used, they should only be done to
 * control data that is not handled by React's data flow.
 *
 * @class ReactOwner
 */
var ReactOwner = {

  /**
   * @param {?object} object
   * @return {boolean} True if `object` is a valid owner.
   * @final
   */
  isValidOwner: function isValidOwner(object) {
    return !!(object && typeof object.attachRef === 'function' && typeof object.detachRef === 'function');
  },

  /**
   * Adds a component by ref to an owner component.
   *
   * @param {ReactComponent} component Component to reference.
   * @param {string} ref Name by which to refer to the component.
   * @param {ReactOwner} owner Component on which to record the ref.
   * @final
   * @internal
   */
  addComponentAsRefTo: function addComponentAsRefTo(component, ref, owner) {
    !ReactOwner.isValidOwner(owner) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'addComponentAsRefTo(...): Only a ReactOwner can have refs. You might ' + 'be adding a ref to a component that was not created inside a component\'s ' + '`render` method, or you have multiple copies of React loaded ' + '(details: https://fb.me/react-refs-must-have-owner).') : invariant(false) : undefined;
    owner.attachRef(ref, component);
  },

  /**
   * Removes a component by ref from an owner component.
   *
   * @param {ReactComponent} component Component to dereference.
   * @param {string} ref Name of the ref to remove.
   * @param {ReactOwner} owner Component on which the ref is recorded.
   * @final
   * @internal
   */
  removeComponentAsRefFrom: function removeComponentAsRefFrom(component, ref, owner) {
    !ReactOwner.isValidOwner(owner) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'removeComponentAsRefFrom(...): Only a ReactOwner can have refs. You might ' + 'be removing a ref to a component that was not created inside a component\'s ' + '`render` method, or you have multiple copies of React loaded ' + '(details: https://fb.me/react-refs-must-have-owner).') : invariant(false) : undefined;
    // Check that `component` is still the current ref because we do not want to
    // detach the ref if another component stole it.
    if (owner.getPublicInstance().refs[ref] === component.getPublicInstance()) {
      owner.detachRef(ref);
    }
  }

};

module.exports = ReactOwner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0T3duZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQ0EsSUFBSSxhQUFhOzs7Ozs7O0FBT2YsZ0JBQWMsc0JBQVUsTUFBVixFQUFrQjtBQUM5QixXQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sT0FBTyxTQUFkLEtBQTRCLFVBQXRDLElBQW9ELE9BQU8sT0FBTyxTQUFkLEtBQTRCLFVBQWxGLENBQVI7QUFDRCxHQVRjOzs7Ozs7Ozs7OztBQW9CZix1QkFBcUIsNkJBQVUsU0FBVixFQUFxQixHQUFyQixFQUEwQixLQUExQixFQUFpQztBQUNwRCxLQUFDLFdBQVcsWUFBWCxDQUF3QixLQUF4QixDQUFELEdBQWtDLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLDBFQUEwRSw0RUFBMUUsR0FBeUosK0RBQXpKLEdBQTJOLHNEQUE1TyxDQUF4QyxHQUE4VSxVQUFVLEtBQVYsQ0FBaFgsR0FBbVksU0FBblk7QUFDQSxVQUFNLFNBQU4sQ0FBZ0IsR0FBaEIsRUFBcUIsU0FBckI7QUFDRCxHQXZCYzs7Ozs7Ozs7Ozs7QUFrQ2YsNEJBQTBCLGtDQUFVLFNBQVYsRUFBcUIsR0FBckIsRUFBMEIsS0FBMUIsRUFBaUM7QUFDekQsS0FBQyxXQUFXLFlBQVgsQ0FBd0IsS0FBeEIsQ0FBRCxHQUFrQyxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFVBQVUsS0FBVixFQUFpQiwrRUFBK0UsOEVBQS9FLEdBQWdLLCtEQUFoSyxHQUFrTyxzREFBblAsQ0FBeEMsR0FBcVYsVUFBVSxLQUFWLENBQXZYLEdBQTBZLFNBQTFZOzs7QUFHQSxRQUFJLE1BQU0saUJBQU4sR0FBMEIsSUFBMUIsQ0FBK0IsR0FBL0IsTUFBd0MsVUFBVSxpQkFBVixFQUE1QyxFQUEyRTtBQUN6RSxZQUFNLFNBQU4sQ0FBZ0IsR0FBaEI7QUFDRDtBQUNGOztBQXpDYyxDQUFqQjs7QUE2Q0EsT0FBTyxPQUFQLEdBQWlCLFVBQWpCIiwiZmlsZSI6IlJlYWN0T3duZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RPd25lclxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuXG4vKipcbiAqIFJlYWN0T3duZXJzIGFyZSBjYXBhYmxlIG9mIHN0b3JpbmcgcmVmZXJlbmNlcyB0byBvd25lZCBjb21wb25lbnRzLlxuICpcbiAqIEFsbCBjb21wb25lbnRzIGFyZSBjYXBhYmxlIG9mIC8vYmVpbmcvLyByZWZlcmVuY2VkIGJ5IG93bmVyIGNvbXBvbmVudHMsIGJ1dFxuICogb25seSBSZWFjdE93bmVyIGNvbXBvbmVudHMgYXJlIGNhcGFibGUgb2YgLy9yZWZlcmVuY2luZy8vIG93bmVkIGNvbXBvbmVudHMuXG4gKiBUaGUgbmFtZWQgcmVmZXJlbmNlIGlzIGtub3duIGFzIGEgXCJyZWZcIi5cbiAqXG4gKiBSZWZzIGFyZSBhdmFpbGFibGUgd2hlbiBtb3VudGVkIGFuZCB1cGRhdGVkIGR1cmluZyByZWNvbmNpbGlhdGlvbi5cbiAqXG4gKiAgIHZhciBNeUNvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAqICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICogICAgICAgcmV0dXJuIChcbiAqICAgICAgICAgPGRpdiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cbiAqICAgICAgICAgICA8Q3VzdG9tQ29tcG9uZW50IHJlZj1cImN1c3RvbVwiIC8+XG4gKiAgICAgICAgIDwvZGl2PlxuICogICAgICAgKTtcbiAqICAgICB9LFxuICogICAgIGhhbmRsZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAqICAgICAgIHRoaXMucmVmcy5jdXN0b20uaGFuZGxlQ2xpY2soKTtcbiAqICAgICB9LFxuICogICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAqICAgICAgIHRoaXMucmVmcy5jdXN0b20uaW5pdGlhbGl6ZSgpO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogUmVmcyBzaG91bGQgcmFyZWx5IGJlIHVzZWQuIFdoZW4gcmVmcyBhcmUgdXNlZCwgdGhleSBzaG91bGQgb25seSBiZSBkb25lIHRvXG4gKiBjb250cm9sIGRhdGEgdGhhdCBpcyBub3QgaGFuZGxlZCBieSBSZWFjdCdzIGRhdGEgZmxvdy5cbiAqXG4gKiBAY2xhc3MgUmVhY3RPd25lclxuICovXG52YXIgUmVhY3RPd25lciA9IHtcblxuICAvKipcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBvYmplY3RcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBgb2JqZWN0YCBpcyBhIHZhbGlkIG93bmVyLlxuICAgKiBAZmluYWxcbiAgICovXG4gIGlzVmFsaWRPd25lcjogZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHJldHVybiAhIShvYmplY3QgJiYgdHlwZW9mIG9iamVjdC5hdHRhY2hSZWYgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iamVjdC5kZXRhY2hSZWYgPT09ICdmdW5jdGlvbicpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBZGRzIGEgY29tcG9uZW50IGJ5IHJlZiB0byBhbiBvd25lciBjb21wb25lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDb21wb25lbnR9IGNvbXBvbmVudCBDb21wb25lbnQgdG8gcmVmZXJlbmNlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVmIE5hbWUgYnkgd2hpY2ggdG8gcmVmZXIgdG8gdGhlIGNvbXBvbmVudC5cbiAgICogQHBhcmFtIHtSZWFjdE93bmVyfSBvd25lciBDb21wb25lbnQgb24gd2hpY2ggdG8gcmVjb3JkIHRoZSByZWYuXG4gICAqIEBmaW5hbFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGFkZENvbXBvbmVudEFzUmVmVG86IGZ1bmN0aW9uIChjb21wb25lbnQsIHJlZiwgb3duZXIpIHtcbiAgICAhUmVhY3RPd25lci5pc1ZhbGlkT3duZXIob3duZXIpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ2FkZENvbXBvbmVudEFzUmVmVG8oLi4uKTogT25seSBhIFJlYWN0T3duZXIgY2FuIGhhdmUgcmVmcy4gWW91IG1pZ2h0ICcgKyAnYmUgYWRkaW5nIGEgcmVmIHRvIGEgY29tcG9uZW50IHRoYXQgd2FzIG5vdCBjcmVhdGVkIGluc2lkZSBhIGNvbXBvbmVudFxcJ3MgJyArICdgcmVuZGVyYCBtZXRob2QsIG9yIHlvdSBoYXZlIG11bHRpcGxlIGNvcGllcyBvZiBSZWFjdCBsb2FkZWQgJyArICcoZGV0YWlsczogaHR0cHM6Ly9mYi5tZS9yZWFjdC1yZWZzLW11c3QtaGF2ZS1vd25lcikuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIG93bmVyLmF0dGFjaFJlZihyZWYsIGNvbXBvbmVudCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBjb21wb25lbnQgYnkgcmVmIGZyb20gYW4gb3duZXIgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q29tcG9uZW50fSBjb21wb25lbnQgQ29tcG9uZW50IHRvIGRlcmVmZXJlbmNlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVmIE5hbWUgb2YgdGhlIHJlZiB0byByZW1vdmUuXG4gICAqIEBwYXJhbSB7UmVhY3RPd25lcn0gb3duZXIgQ29tcG9uZW50IG9uIHdoaWNoIHRoZSByZWYgaXMgcmVjb3JkZWQuXG4gICAqIEBmaW5hbFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHJlbW92ZUNvbXBvbmVudEFzUmVmRnJvbTogZnVuY3Rpb24gKGNvbXBvbmVudCwgcmVmLCBvd25lcikge1xuICAgICFSZWFjdE93bmVyLmlzVmFsaWRPd25lcihvd25lcikgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAncmVtb3ZlQ29tcG9uZW50QXNSZWZGcm9tKC4uLik6IE9ubHkgYSBSZWFjdE93bmVyIGNhbiBoYXZlIHJlZnMuIFlvdSBtaWdodCAnICsgJ2JlIHJlbW92aW5nIGEgcmVmIHRvIGEgY29tcG9uZW50IHRoYXQgd2FzIG5vdCBjcmVhdGVkIGluc2lkZSBhIGNvbXBvbmVudFxcJ3MgJyArICdgcmVuZGVyYCBtZXRob2QsIG9yIHlvdSBoYXZlIG11bHRpcGxlIGNvcGllcyBvZiBSZWFjdCBsb2FkZWQgJyArICcoZGV0YWlsczogaHR0cHM6Ly9mYi5tZS9yZWFjdC1yZWZzLW11c3QtaGF2ZS1vd25lcikuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIC8vIENoZWNrIHRoYXQgYGNvbXBvbmVudGAgaXMgc3RpbGwgdGhlIGN1cnJlbnQgcmVmIGJlY2F1c2Ugd2UgZG8gbm90IHdhbnQgdG9cbiAgICAvLyBkZXRhY2ggdGhlIHJlZiBpZiBhbm90aGVyIGNvbXBvbmVudCBzdG9sZSBpdC5cbiAgICBpZiAob3duZXIuZ2V0UHVibGljSW5zdGFuY2UoKS5yZWZzW3JlZl0gPT09IGNvbXBvbmVudC5nZXRQdWJsaWNJbnN0YW5jZSgpKSB7XG4gICAgICBvd25lci5kZXRhY2hSZWYocmVmKTtcbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdE93bmVyOyJdfQ==