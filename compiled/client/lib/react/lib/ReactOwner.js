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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0T3duZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdDSixJQUFJLGFBQWE7Ozs7Ozs7QUFPZixnQkFBYyxzQkFBVSxNQUFWLEVBQWtCO0FBQzlCLFdBQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxPQUFPLFNBQVAsS0FBcUIsVUFBNUIsSUFBMEMsT0FBTyxPQUFPLFNBQVAsS0FBcUIsVUFBNUIsQ0FBdEQsQ0FEc0I7R0FBbEI7Ozs7Ozs7Ozs7O0FBYWQsdUJBQXFCLDZCQUFVLFNBQVYsRUFBcUIsR0FBckIsRUFBMEIsS0FBMUIsRUFBaUM7QUFDcEQsS0FBQyxXQUFXLFlBQVgsQ0FBd0IsS0FBeEIsQ0FBRCxHQUFrQyxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFVBQVUsS0FBVixFQUFpQiwwRUFBMEUsNEVBQTFFLEdBQXlKLCtEQUF6SixHQUEyTixzREFBM04sQ0FBekQsR0FBOFUsVUFBVSxLQUFWLENBQTlVLEdBQWlXLFNBQW5ZLENBRG9EO0FBRXBELFVBQU0sU0FBTixDQUFnQixHQUFoQixFQUFxQixTQUFyQixFQUZvRDtHQUFqQzs7Ozs7Ozs7Ozs7QUFjckIsNEJBQTBCLGtDQUFVLFNBQVYsRUFBcUIsR0FBckIsRUFBMEIsS0FBMUIsRUFBaUM7QUFDekQsS0FBQyxXQUFXLFlBQVgsQ0FBd0IsS0FBeEIsQ0FBRCxHQUFrQyxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFVBQVUsS0FBVixFQUFpQiwrRUFBK0UsOEVBQS9FLEdBQWdLLCtEQUFoSyxHQUFrTyxzREFBbE8sQ0FBekQsR0FBcVYsVUFBVSxLQUFWLENBQXJWLEdBQXdXLFNBQTFZOzs7QUFEeUQsUUFJckQsTUFBTSxpQkFBTixHQUEwQixJQUExQixDQUErQixHQUEvQixNQUF3QyxVQUFVLGlCQUFWLEVBQXhDLEVBQXVFO0FBQ3pFLFlBQU0sU0FBTixDQUFnQixHQUFoQixFQUR5RTtLQUEzRTtHQUp3Qjs7Q0FsQ3hCOztBQTZDSixPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoiUmVhY3RPd25lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdE93bmVyXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG5cbi8qKlxuICogUmVhY3RPd25lcnMgYXJlIGNhcGFibGUgb2Ygc3RvcmluZyByZWZlcmVuY2VzIHRvIG93bmVkIGNvbXBvbmVudHMuXG4gKlxuICogQWxsIGNvbXBvbmVudHMgYXJlIGNhcGFibGUgb2YgLy9iZWluZy8vIHJlZmVyZW5jZWQgYnkgb3duZXIgY29tcG9uZW50cywgYnV0XG4gKiBvbmx5IFJlYWN0T3duZXIgY29tcG9uZW50cyBhcmUgY2FwYWJsZSBvZiAvL3JlZmVyZW5jaW5nLy8gb3duZWQgY29tcG9uZW50cy5cbiAqIFRoZSBuYW1lZCByZWZlcmVuY2UgaXMga25vd24gYXMgYSBcInJlZlwiLlxuICpcbiAqIFJlZnMgYXJlIGF2YWlsYWJsZSB3aGVuIG1vdW50ZWQgYW5kIHVwZGF0ZWQgZHVyaW5nIHJlY29uY2lsaWF0aW9uLlxuICpcbiAqICAgdmFyIE15Q29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICogICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gKiAgICAgICByZXR1cm4gKFxuICogICAgICAgICA8ZGl2IG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICogICAgICAgICAgIDxDdXN0b21Db21wb25lbnQgcmVmPVwiY3VzdG9tXCIgLz5cbiAqICAgICAgICAgPC9kaXY+XG4gKiAgICAgICApO1xuICogICAgIH0sXG4gKiAgICAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICogICAgICAgdGhpcy5yZWZzLmN1c3RvbS5oYW5kbGVDbGljaygpO1xuICogICAgIH0sXG4gKiAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICogICAgICAgdGhpcy5yZWZzLmN1c3RvbS5pbml0aWFsaXplKCk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBSZWZzIHNob3VsZCByYXJlbHkgYmUgdXNlZC4gV2hlbiByZWZzIGFyZSB1c2VkLCB0aGV5IHNob3VsZCBvbmx5IGJlIGRvbmUgdG9cbiAqIGNvbnRyb2wgZGF0YSB0aGF0IGlzIG5vdCBoYW5kbGVkIGJ5IFJlYWN0J3MgZGF0YSBmbG93LlxuICpcbiAqIEBjbGFzcyBSZWFjdE93bmVyXG4gKi9cbnZhciBSZWFjdE93bmVyID0ge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gez9vYmplY3R9IG9iamVjdFxuICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIGBvYmplY3RgIGlzIGEgdmFsaWQgb3duZXIuXG4gICAqIEBmaW5hbFxuICAgKi9cbiAgaXNWYWxpZE93bmVyOiBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgcmV0dXJuICEhKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0LmF0dGFjaFJlZiA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqZWN0LmRldGFjaFJlZiA9PT0gJ2Z1bmN0aW9uJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZHMgYSBjb21wb25lbnQgYnkgcmVmIHRvIGFuIG93bmVyIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENvbXBvbmVudH0gY29tcG9uZW50IENvbXBvbmVudCB0byByZWZlcmVuY2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWYgTmFtZSBieSB3aGljaCB0byByZWZlciB0byB0aGUgY29tcG9uZW50LlxuICAgKiBAcGFyYW0ge1JlYWN0T3duZXJ9IG93bmVyIENvbXBvbmVudCBvbiB3aGljaCB0byByZWNvcmQgdGhlIHJlZi5cbiAgICogQGZpbmFsXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgYWRkQ29tcG9uZW50QXNSZWZUbzogZnVuY3Rpb24gKGNvbXBvbmVudCwgcmVmLCBvd25lcikge1xuICAgICFSZWFjdE93bmVyLmlzVmFsaWRPd25lcihvd25lcikgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnYWRkQ29tcG9uZW50QXNSZWZUbyguLi4pOiBPbmx5IGEgUmVhY3RPd25lciBjYW4gaGF2ZSByZWZzLiBZb3UgbWlnaHQgJyArICdiZSBhZGRpbmcgYSByZWYgdG8gYSBjb21wb25lbnQgdGhhdCB3YXMgbm90IGNyZWF0ZWQgaW5zaWRlIGEgY29tcG9uZW50XFwncyAnICsgJ2ByZW5kZXJgIG1ldGhvZCwgb3IgeW91IGhhdmUgbXVsdGlwbGUgY29waWVzIG9mIFJlYWN0IGxvYWRlZCAnICsgJyhkZXRhaWxzOiBodHRwczovL2ZiLm1lL3JlYWN0LXJlZnMtbXVzdC1oYXZlLW93bmVyKS4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgb3duZXIuYXR0YWNoUmVmKHJlZiwgY29tcG9uZW50KTtcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGNvbXBvbmVudCBieSByZWYgZnJvbSBhbiBvd25lciBjb21wb25lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDb21wb25lbnR9IGNvbXBvbmVudCBDb21wb25lbnQgdG8gZGVyZWZlcmVuY2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWYgTmFtZSBvZiB0aGUgcmVmIHRvIHJlbW92ZS5cbiAgICogQHBhcmFtIHtSZWFjdE93bmVyfSBvd25lciBDb21wb25lbnQgb24gd2hpY2ggdGhlIHJlZiBpcyByZWNvcmRlZC5cbiAgICogQGZpbmFsXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcmVtb3ZlQ29tcG9uZW50QXNSZWZGcm9tOiBmdW5jdGlvbiAoY29tcG9uZW50LCByZWYsIG93bmVyKSB7XG4gICAgIVJlYWN0T3duZXIuaXNWYWxpZE93bmVyKG93bmVyKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdyZW1vdmVDb21wb25lbnRBc1JlZkZyb20oLi4uKTogT25seSBhIFJlYWN0T3duZXIgY2FuIGhhdmUgcmVmcy4gWW91IG1pZ2h0ICcgKyAnYmUgcmVtb3ZpbmcgYSByZWYgdG8gYSBjb21wb25lbnQgdGhhdCB3YXMgbm90IGNyZWF0ZWQgaW5zaWRlIGEgY29tcG9uZW50XFwncyAnICsgJ2ByZW5kZXJgIG1ldGhvZCwgb3IgeW91IGhhdmUgbXVsdGlwbGUgY29waWVzIG9mIFJlYWN0IGxvYWRlZCAnICsgJyhkZXRhaWxzOiBodHRwczovL2ZiLm1lL3JlYWN0LXJlZnMtbXVzdC1oYXZlLW93bmVyKS4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgLy8gQ2hlY2sgdGhhdCBgY29tcG9uZW50YCBpcyBzdGlsbCB0aGUgY3VycmVudCByZWYgYmVjYXVzZSB3ZSBkbyBub3Qgd2FudCB0b1xuICAgIC8vIGRldGFjaCB0aGUgcmVmIGlmIGFub3RoZXIgY29tcG9uZW50IHN0b2xlIGl0LlxuICAgIGlmIChvd25lci5nZXRQdWJsaWNJbnN0YW5jZSgpLnJlZnNbcmVmXSA9PT0gY29tcG9uZW50LmdldFB1YmxpY0luc3RhbmNlKCkpIHtcbiAgICAgIG93bmVyLmRldGFjaFJlZihyZWYpO1xuICAgIH1cbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0T3duZXI7Il19