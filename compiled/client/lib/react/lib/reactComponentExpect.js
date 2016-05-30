/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule reactComponentExpect
 * @nolint
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var ReactInstanceMap = require('./ReactInstanceMap');
var ReactTestUtils = require('./ReactTestUtils');

var assign = require('./Object.assign');
var invariant = require('fbjs/lib/invariant');

function reactComponentExpect(instance) {
  if (instance instanceof reactComponentExpectInternal) {
    return instance;
  }

  if (!(this instanceof reactComponentExpect)) {
    return new reactComponentExpect(instance);
  }

  expect(instance).not.toBeNull();
  expect(instance).not.toBeUndefined();

  !ReactTestUtils.isCompositeComponent(instance) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'reactComponentExpect(...): instance must be a composite component') : invariant(false) : undefined;
  var internalInstance = ReactInstanceMap.get(instance);

  expect(typeof internalInstance === 'undefined' ? 'undefined' : _typeof(internalInstance)).toBe('object');
  expect(_typeof(internalInstance.constructor)).toBe('function');
  expect(ReactTestUtils.isElement(internalInstance)).toBe(false);

  return new reactComponentExpectInternal(internalInstance);
}

function reactComponentExpectInternal(internalInstance) {
  this._instance = internalInstance;
}

assign(reactComponentExpectInternal.prototype, {
  // Getters -------------------------------------------------------------------

  /**
   * @instance: Retrieves the backing instance.
   */
  instance: function instance() {
    return this._instance.getPublicInstance();
  },

  /**
   * There are two types of components in the world.
   * - A component created via React.createClass() - Has a single child
   *   subComponent - the return value from the .render() function. This
   *   function @subComponent expects that this._instance is component created
   *   with React.createClass().
   * - A primitive DOM component - which has many renderedChildren, each of
   *   which may have a name that is unique with respect to its siblings. This
   *   method will fail if this._instance is a primitive component.
   *
   * TL;DR: An instance may have a subComponent (this._renderedComponent) or
   * renderedChildren, but never both. Neither will actually show up until you
   * render the component (simply instantiating is not enough).
   */
  expectRenderedChild: function expectRenderedChild() {
    this.toBeCompositeComponent();
    var child = this._instance._renderedComponent;
    // TODO: Hide ReactEmptyComponent instances here?
    return new reactComponentExpectInternal(child);
  },

  /**
   * The nth child of a DOMish component instance that is not falsy.
   */
  expectRenderedChildAt: function expectRenderedChildAt(childIndex) {
    // Currently only dom components have arrays of children, but that will
    // change soon.
    this.toBeDOMComponent();
    var renderedChildren = this._instance._renderedChildren || {};
    for (var name in renderedChildren) {
      if (!renderedChildren.hasOwnProperty(name)) {
        continue;
      }
      if (renderedChildren[name]) {
        if (renderedChildren[name]._mountIndex === childIndex) {
          return new reactComponentExpectInternal(renderedChildren[name]);
        }
      }
    }
    throw new Error('Child:' + childIndex + ' is not found');
  },

  toBeDOMComponentWithChildCount: function toBeDOMComponentWithChildCount(count) {
    this.toBeDOMComponent();
    var renderedChildren = this._instance._renderedChildren;
    expect(renderedChildren).toBeTruthy();
    expect(Object.keys(renderedChildren).length).toBe(count);
    return this;
  },

  toBeDOMComponentWithNoChildren: function toBeDOMComponentWithNoChildren() {
    this.toBeDOMComponent();
    expect(this._instance._renderedChildren).toBeFalsy();
    return this;
  },

  // Matchers ------------------------------------------------------------------

  toBeComponentOfType: function toBeComponentOfType(constructor) {
    expect(this._instance._currentElement.type === constructor).toBe(true);
    return this;
  },

  /**
   * A component that is created with React.createClass. Just duck typing
   * here.
   */
  toBeCompositeComponent: function toBeCompositeComponent() {
    expect(_typeof(this.instance()) === 'object' && typeof this.instance().render === 'function').toBe(true);
    return this;
  },

  toBeCompositeComponentWithType: function toBeCompositeComponentWithType(constructor) {
    this.toBeCompositeComponent();
    expect(this._instance._currentElement.type === constructor).toBe(true);
    return this;
  },

  toBeTextComponentWithValue: function toBeTextComponentWithValue(val) {
    var elementType = _typeof(this._instance._currentElement);
    expect(elementType === 'string' || elementType === 'number').toBe(true);
    expect(this._instance._stringText).toBe(val);
    return this;
  },

  toBeEmptyComponent: function toBeEmptyComponent() {
    var element = this._instance._currentElement;
    return element === null || element === false;
  },

  toBePresent: function toBePresent() {
    expect(this.instance()).toBeTruthy();
    return this;
  },

  /**
   * A terminal type of component representing some virtual dom node. Just duck
   * typing here.
   */
  toBeDOMComponent: function toBeDOMComponent() {
    expect(ReactTestUtils.isDOMComponent(this.instance())).toBe(true);
    return this;
  },

  /**
   * @deprecated
   * @see toBeComponentOfType
   */
  toBeDOMComponentWithTag: function toBeDOMComponentWithTag(tag) {
    this.toBeDOMComponent();
    expect(this.instance().tagName).toBe(tag.toUpperCase());
    return this;
  },

  /**
   * Check that internal state values are equal to a state of expected values.
   */
  scalarStateEqual: function scalarStateEqual(stateNameToExpectedValue) {
    expect(this.instance()).toBeTruthy();
    for (var stateName in stateNameToExpectedValue) {
      if (!stateNameToExpectedValue.hasOwnProperty(stateName)) {
        continue;
      }
      expect(this.instance().state[stateName]).toEqual(stateNameToExpectedValue[stateName]);
    }
    return this;
  },

  /**
   * Check a set of props are equal to a set of expected values - only works
   * with scalars.
   */
  scalarPropsEqual: function scalarPropsEqual(propNameToExpectedValue) {
    expect(this.instance()).toBeTruthy();
    for (var propName in propNameToExpectedValue) {
      if (!propNameToExpectedValue.hasOwnProperty(propName)) {
        continue;
      }
      expect(this.instance().props[propName]).toEqual(propNameToExpectedValue[propName]);
    }
    return this;
  },

  /**
   * Check a set of props are equal to a set of expected values - only works
   * with scalars.
   */
  scalarContextEqual: function scalarContextEqual(contextNameToExpectedValue) {
    expect(this.instance()).toBeTruthy();
    for (var contextName in contextNameToExpectedValue) {
      if (!contextNameToExpectedValue.hasOwnProperty(contextName)) {
        continue;
      }
      expect(this.instance().context[contextName]).toEqual(contextNameToExpectedValue[contextName]);
    }
    return this;
  }
});

module.exports = reactComponentExpect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL3JlYWN0Q29tcG9uZW50RXhwZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVlBOzs7O0FBRUEsSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUF2QjtBQUNBLElBQUksaUJBQWlCLFFBQVEsa0JBQVIsQ0FBckI7O0FBRUEsSUFBSSxTQUFTLFFBQVEsaUJBQVIsQ0FBYjtBQUNBLElBQUksWUFBWSxRQUFRLG9CQUFSLENBQWhCOztBQUVBLFNBQVMsb0JBQVQsQ0FBOEIsUUFBOUIsRUFBd0M7QUFDdEMsTUFBSSxvQkFBb0IsNEJBQXhCLEVBQXNEO0FBQ3BELFdBQU8sUUFBUDtBQUNEOztBQUVELE1BQUksRUFBRSxnQkFBZ0Isb0JBQWxCLENBQUosRUFBNkM7QUFDM0MsV0FBTyxJQUFJLG9CQUFKLENBQXlCLFFBQXpCLENBQVA7QUFDRDs7QUFFRCxTQUFPLFFBQVAsRUFBaUIsR0FBakIsQ0FBcUIsUUFBckI7QUFDQSxTQUFPLFFBQVAsRUFBaUIsR0FBakIsQ0FBcUIsYUFBckI7O0FBRUEsR0FBQyxlQUFlLG9CQUFmLENBQW9DLFFBQXBDLENBQUQsR0FBaUQsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIsbUVBQWpCLENBQXhDLEdBQWdJLFVBQVUsS0FBVixDQUFqTCxHQUFvTSxTQUFwTTtBQUNBLE1BQUksbUJBQW1CLGlCQUFpQixHQUFqQixDQUFxQixRQUFyQixDQUF2Qjs7QUFFQSxnQkFBYyxnQkFBZCx5Q0FBYyxnQkFBZCxHQUFnQyxJQUFoQyxDQUFxQyxRQUFyQztBQUNBLGlCQUFjLGlCQUFpQixXQUEvQixHQUE0QyxJQUE1QyxDQUFpRCxVQUFqRDtBQUNBLFNBQU8sZUFBZSxTQUFmLENBQXlCLGdCQUF6QixDQUFQLEVBQW1ELElBQW5ELENBQXdELEtBQXhEOztBQUVBLFNBQU8sSUFBSSw0QkFBSixDQUFpQyxnQkFBakMsQ0FBUDtBQUNEOztBQUVELFNBQVMsNEJBQVQsQ0FBc0MsZ0JBQXRDLEVBQXdEO0FBQ3RELE9BQUssU0FBTCxHQUFpQixnQkFBakI7QUFDRDs7QUFFRCxPQUFPLDZCQUE2QixTQUFwQyxFQUErQzs7Ozs7O0FBTTdDLFlBQVUsb0JBQVk7QUFDcEIsV0FBTyxLQUFLLFNBQUwsQ0FBZSxpQkFBZixFQUFQO0FBQ0QsR0FSNEM7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QjdDLHVCQUFxQiwrQkFBWTtBQUMvQixTQUFLLHNCQUFMO0FBQ0EsUUFBSSxRQUFRLEtBQUssU0FBTCxDQUFlLGtCQUEzQjs7QUFFQSxXQUFPLElBQUksNEJBQUosQ0FBaUMsS0FBakMsQ0FBUDtBQUNELEdBN0I0Qzs7Ozs7QUFrQzdDLHlCQUF1QiwrQkFBVSxVQUFWLEVBQXNCOzs7QUFHM0MsU0FBSyxnQkFBTDtBQUNBLFFBQUksbUJBQW1CLEtBQUssU0FBTCxDQUFlLGlCQUFmLElBQW9DLEVBQTNEO0FBQ0EsU0FBSyxJQUFJLElBQVQsSUFBaUIsZ0JBQWpCLEVBQW1DO0FBQ2pDLFVBQUksQ0FBQyxpQkFBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBTCxFQUE0QztBQUMxQztBQUNEO0FBQ0QsVUFBSSxpQkFBaUIsSUFBakIsQ0FBSixFQUE0QjtBQUMxQixZQUFJLGlCQUFpQixJQUFqQixFQUF1QixXQUF2QixLQUF1QyxVQUEzQyxFQUF1RDtBQUNyRCxpQkFBTyxJQUFJLDRCQUFKLENBQWlDLGlCQUFpQixJQUFqQixDQUFqQyxDQUFQO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsVUFBTSxJQUFJLEtBQUosQ0FBVSxXQUFXLFVBQVgsR0FBd0IsZUFBbEMsQ0FBTjtBQUNELEdBbEQ0Qzs7QUFvRDdDLGtDQUFnQyx3Q0FBVSxLQUFWLEVBQWlCO0FBQy9DLFNBQUssZ0JBQUw7QUFDQSxRQUFJLG1CQUFtQixLQUFLLFNBQUwsQ0FBZSxpQkFBdEM7QUFDQSxXQUFPLGdCQUFQLEVBQXlCLFVBQXpCO0FBQ0EsV0FBTyxPQUFPLElBQVAsQ0FBWSxnQkFBWixFQUE4QixNQUFyQyxFQUE2QyxJQUE3QyxDQUFrRCxLQUFsRDtBQUNBLFdBQU8sSUFBUDtBQUNELEdBMUQ0Qzs7QUE0RDdDLGtDQUFnQywwQ0FBWTtBQUMxQyxTQUFLLGdCQUFMO0FBQ0EsV0FBTyxLQUFLLFNBQUwsQ0FBZSxpQkFBdEIsRUFBeUMsU0FBekM7QUFDQSxXQUFPLElBQVA7QUFDRCxHQWhFNEM7Ozs7QUFvRTdDLHVCQUFxQiw2QkFBVSxXQUFWLEVBQXVCO0FBQzFDLFdBQU8sS0FBSyxTQUFMLENBQWUsZUFBZixDQUErQixJQUEvQixLQUF3QyxXQUEvQyxFQUE0RCxJQUE1RCxDQUFpRSxJQUFqRTtBQUNBLFdBQU8sSUFBUDtBQUNELEdBdkU0Qzs7Ozs7O0FBNkU3QywwQkFBd0Isa0NBQVk7QUFDbEMsV0FBTyxRQUFPLEtBQUssUUFBTCxFQUFQLE1BQTJCLFFBQTNCLElBQXVDLE9BQU8sS0FBSyxRQUFMLEdBQWdCLE1BQXZCLEtBQWtDLFVBQWhGLEVBQTRGLElBQTVGLENBQWlHLElBQWpHO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0FoRjRDOztBQWtGN0Msa0NBQWdDLHdDQUFVLFdBQVYsRUFBdUI7QUFDckQsU0FBSyxzQkFBTDtBQUNBLFdBQU8sS0FBSyxTQUFMLENBQWUsZUFBZixDQUErQixJQUEvQixLQUF3QyxXQUEvQyxFQUE0RCxJQUE1RCxDQUFpRSxJQUFqRTtBQUNBLFdBQU8sSUFBUDtBQUNELEdBdEY0Qzs7QUF3RjdDLDhCQUE0QixvQ0FBVSxHQUFWLEVBQWU7QUFDekMsUUFBSSxzQkFBcUIsS0FBSyxTQUFMLENBQWUsZUFBcEMsQ0FBSjtBQUNBLFdBQU8sZ0JBQWdCLFFBQWhCLElBQTRCLGdCQUFnQixRQUFuRCxFQUE2RCxJQUE3RCxDQUFrRSxJQUFsRTtBQUNBLFdBQU8sS0FBSyxTQUFMLENBQWUsV0FBdEIsRUFBbUMsSUFBbkMsQ0FBd0MsR0FBeEM7QUFDQSxXQUFPLElBQVA7QUFDRCxHQTdGNEM7O0FBK0Y3QyxzQkFBb0IsOEJBQVk7QUFDOUIsUUFBSSxVQUFVLEtBQUssU0FBTCxDQUFlLGVBQTdCO0FBQ0EsV0FBTyxZQUFZLElBQVosSUFBb0IsWUFBWSxLQUF2QztBQUNELEdBbEc0Qzs7QUFvRzdDLGVBQWEsdUJBQVk7QUFDdkIsV0FBTyxLQUFLLFFBQUwsRUFBUCxFQUF3QixVQUF4QjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBdkc0Qzs7Ozs7O0FBNkc3QyxvQkFBa0IsNEJBQVk7QUFDNUIsV0FBTyxlQUFlLGNBQWYsQ0FBOEIsS0FBSyxRQUFMLEVBQTlCLENBQVAsRUFBdUQsSUFBdkQsQ0FBNEQsSUFBNUQ7QUFDQSxXQUFPLElBQVA7QUFDRCxHQWhINEM7Ozs7OztBQXNIN0MsMkJBQXlCLGlDQUFVLEdBQVYsRUFBZTtBQUN0QyxTQUFLLGdCQUFMO0FBQ0EsV0FBTyxLQUFLLFFBQUwsR0FBZ0IsT0FBdkIsRUFBZ0MsSUFBaEMsQ0FBcUMsSUFBSSxXQUFKLEVBQXJDO0FBQ0EsV0FBTyxJQUFQO0FBQ0QsR0ExSDRDOzs7OztBQStIN0Msb0JBQWtCLDBCQUFVLHdCQUFWLEVBQW9DO0FBQ3BELFdBQU8sS0FBSyxRQUFMLEVBQVAsRUFBd0IsVUFBeEI7QUFDQSxTQUFLLElBQUksU0FBVCxJQUFzQix3QkFBdEIsRUFBZ0Q7QUFDOUMsVUFBSSxDQUFDLHlCQUF5QixjQUF6QixDQUF3QyxTQUF4QyxDQUFMLEVBQXlEO0FBQ3ZEO0FBQ0Q7QUFDRCxhQUFPLEtBQUssUUFBTCxHQUFnQixLQUFoQixDQUFzQixTQUF0QixDQUFQLEVBQXlDLE9BQXpDLENBQWlELHlCQUF5QixTQUF6QixDQUFqRDtBQUNEO0FBQ0QsV0FBTyxJQUFQO0FBQ0QsR0F4STRDOzs7Ozs7QUE4STdDLG9CQUFrQiwwQkFBVSx1QkFBVixFQUFtQztBQUNuRCxXQUFPLEtBQUssUUFBTCxFQUFQLEVBQXdCLFVBQXhCO0FBQ0EsU0FBSyxJQUFJLFFBQVQsSUFBcUIsdUJBQXJCLEVBQThDO0FBQzVDLFVBQUksQ0FBQyx3QkFBd0IsY0FBeEIsQ0FBdUMsUUFBdkMsQ0FBTCxFQUF1RDtBQUNyRDtBQUNEO0FBQ0QsYUFBTyxLQUFLLFFBQUwsR0FBZ0IsS0FBaEIsQ0FBc0IsUUFBdEIsQ0FBUCxFQUF3QyxPQUF4QyxDQUFnRCx3QkFBd0IsUUFBeEIsQ0FBaEQ7QUFDRDtBQUNELFdBQU8sSUFBUDtBQUNELEdBdko0Qzs7Ozs7O0FBNko3QyxzQkFBb0IsNEJBQVUsMEJBQVYsRUFBc0M7QUFDeEQsV0FBTyxLQUFLLFFBQUwsRUFBUCxFQUF3QixVQUF4QjtBQUNBLFNBQUssSUFBSSxXQUFULElBQXdCLDBCQUF4QixFQUFvRDtBQUNsRCxVQUFJLENBQUMsMkJBQTJCLGNBQTNCLENBQTBDLFdBQTFDLENBQUwsRUFBNkQ7QUFDM0Q7QUFDRDtBQUNELGFBQU8sS0FBSyxRQUFMLEdBQWdCLE9BQWhCLENBQXdCLFdBQXhCLENBQVAsRUFBNkMsT0FBN0MsQ0FBcUQsMkJBQTJCLFdBQTNCLENBQXJEO0FBQ0Q7QUFDRCxXQUFPLElBQVA7QUFDRDtBQXRLNEMsQ0FBL0M7O0FBeUtBLE9BQU8sT0FBUCxHQUFpQixvQkFBakIiLCJmaWxlIjoicmVhY3RDb21wb25lbnRFeHBlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgcmVhY3RDb21wb25lbnRFeHBlY3RcbiAqIEBub2xpbnRcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdEluc3RhbmNlTWFwID0gcmVxdWlyZSgnLi9SZWFjdEluc3RhbmNlTWFwJyk7XG52YXIgUmVhY3RUZXN0VXRpbHMgPSByZXF1aXJlKCcuL1JlYWN0VGVzdFV0aWxzJyk7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL09iamVjdC5hc3NpZ24nKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcblxuZnVuY3Rpb24gcmVhY3RDb21wb25lbnRFeHBlY3QoaW5zdGFuY2UpIHtcbiAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgcmVhY3RDb21wb25lbnRFeHBlY3RJbnRlcm5hbCkge1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiByZWFjdENvbXBvbmVudEV4cGVjdCkpIHtcbiAgICByZXR1cm4gbmV3IHJlYWN0Q29tcG9uZW50RXhwZWN0KGluc3RhbmNlKTtcbiAgfVxuXG4gIGV4cGVjdChpbnN0YW5jZSkubm90LnRvQmVOdWxsKCk7XG4gIGV4cGVjdChpbnN0YW5jZSkubm90LnRvQmVVbmRlZmluZWQoKTtcblxuICAhUmVhY3RUZXN0VXRpbHMuaXNDb21wb3NpdGVDb21wb25lbnQoaW5zdGFuY2UpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ3JlYWN0Q29tcG9uZW50RXhwZWN0KC4uLik6IGluc3RhbmNlIG11c3QgYmUgYSBjb21wb3NpdGUgY29tcG9uZW50JykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICB2YXIgaW50ZXJuYWxJbnN0YW5jZSA9IFJlYWN0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcblxuICBleHBlY3QodHlwZW9mIGludGVybmFsSW5zdGFuY2UpLnRvQmUoJ29iamVjdCcpO1xuICBleHBlY3QodHlwZW9mIGludGVybmFsSW5zdGFuY2UuY29uc3RydWN0b3IpLnRvQmUoJ2Z1bmN0aW9uJyk7XG4gIGV4cGVjdChSZWFjdFRlc3RVdGlscy5pc0VsZW1lbnQoaW50ZXJuYWxJbnN0YW5jZSkpLnRvQmUoZmFsc2UpO1xuXG4gIHJldHVybiBuZXcgcmVhY3RDb21wb25lbnRFeHBlY3RJbnRlcm5hbChpbnRlcm5hbEluc3RhbmNlKTtcbn1cblxuZnVuY3Rpb24gcmVhY3RDb21wb25lbnRFeHBlY3RJbnRlcm5hbChpbnRlcm5hbEluc3RhbmNlKSB7XG4gIHRoaXMuX2luc3RhbmNlID0gaW50ZXJuYWxJbnN0YW5jZTtcbn1cblxuYXNzaWduKHJlYWN0Q29tcG9uZW50RXhwZWN0SW50ZXJuYWwucHJvdG90eXBlLCB7XG4gIC8vIEdldHRlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBAaW5zdGFuY2U6IFJldHJpZXZlcyB0aGUgYmFja2luZyBpbnN0YW5jZS5cbiAgICovXG4gIGluc3RhbmNlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlLmdldFB1YmxpY0luc3RhbmNlKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoZXJlIGFyZSB0d28gdHlwZXMgb2YgY29tcG9uZW50cyBpbiB0aGUgd29ybGQuXG4gICAqIC0gQSBjb21wb25lbnQgY3JlYXRlZCB2aWEgUmVhY3QuY3JlYXRlQ2xhc3MoKSAtIEhhcyBhIHNpbmdsZSBjaGlsZFxuICAgKiAgIHN1YkNvbXBvbmVudCAtIHRoZSByZXR1cm4gdmFsdWUgZnJvbSB0aGUgLnJlbmRlcigpIGZ1bmN0aW9uLiBUaGlzXG4gICAqICAgZnVuY3Rpb24gQHN1YkNvbXBvbmVudCBleHBlY3RzIHRoYXQgdGhpcy5faW5zdGFuY2UgaXMgY29tcG9uZW50IGNyZWF0ZWRcbiAgICogICB3aXRoIFJlYWN0LmNyZWF0ZUNsYXNzKCkuXG4gICAqIC0gQSBwcmltaXRpdmUgRE9NIGNvbXBvbmVudCAtIHdoaWNoIGhhcyBtYW55IHJlbmRlcmVkQ2hpbGRyZW4sIGVhY2ggb2ZcbiAgICogICB3aGljaCBtYXkgaGF2ZSBhIG5hbWUgdGhhdCBpcyB1bmlxdWUgd2l0aCByZXNwZWN0IHRvIGl0cyBzaWJsaW5ncy4gVGhpc1xuICAgKiAgIG1ldGhvZCB3aWxsIGZhaWwgaWYgdGhpcy5faW5zdGFuY2UgaXMgYSBwcmltaXRpdmUgY29tcG9uZW50LlxuICAgKlxuICAgKiBUTDtEUjogQW4gaW5zdGFuY2UgbWF5IGhhdmUgYSBzdWJDb21wb25lbnQgKHRoaXMuX3JlbmRlcmVkQ29tcG9uZW50KSBvclxuICAgKiByZW5kZXJlZENoaWxkcmVuLCBidXQgbmV2ZXIgYm90aC4gTmVpdGhlciB3aWxsIGFjdHVhbGx5IHNob3cgdXAgdW50aWwgeW91XG4gICAqIHJlbmRlciB0aGUgY29tcG9uZW50IChzaW1wbHkgaW5zdGFudGlhdGluZyBpcyBub3QgZW5vdWdoKS5cbiAgICovXG4gIGV4cGVjdFJlbmRlcmVkQ2hpbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnRvQmVDb21wb3NpdGVDb21wb25lbnQoKTtcbiAgICB2YXIgY2hpbGQgPSB0aGlzLl9pbnN0YW5jZS5fcmVuZGVyZWRDb21wb25lbnQ7XG4gICAgLy8gVE9ETzogSGlkZSBSZWFjdEVtcHR5Q29tcG9uZW50IGluc3RhbmNlcyBoZXJlP1xuICAgIHJldHVybiBuZXcgcmVhY3RDb21wb25lbnRFeHBlY3RJbnRlcm5hbChjaGlsZCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoZSBudGggY2hpbGQgb2YgYSBET01pc2ggY29tcG9uZW50IGluc3RhbmNlIHRoYXQgaXMgbm90IGZhbHN5LlxuICAgKi9cbiAgZXhwZWN0UmVuZGVyZWRDaGlsZEF0OiBmdW5jdGlvbiAoY2hpbGRJbmRleCkge1xuICAgIC8vIEN1cnJlbnRseSBvbmx5IGRvbSBjb21wb25lbnRzIGhhdmUgYXJyYXlzIG9mIGNoaWxkcmVuLCBidXQgdGhhdCB3aWxsXG4gICAgLy8gY2hhbmdlIHNvb24uXG4gICAgdGhpcy50b0JlRE9NQ29tcG9uZW50KCk7XG4gICAgdmFyIHJlbmRlcmVkQ2hpbGRyZW4gPSB0aGlzLl9pbnN0YW5jZS5fcmVuZGVyZWRDaGlsZHJlbiB8fCB7fTtcbiAgICBmb3IgKHZhciBuYW1lIGluIHJlbmRlcmVkQ2hpbGRyZW4pIHtcbiAgICAgIGlmICghcmVuZGVyZWRDaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChyZW5kZXJlZENoaWxkcmVuW25hbWVdKSB7XG4gICAgICAgIGlmIChyZW5kZXJlZENoaWxkcmVuW25hbWVdLl9tb3VudEluZGV4ID09PSBjaGlsZEluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyByZWFjdENvbXBvbmVudEV4cGVjdEludGVybmFsKHJlbmRlcmVkQ2hpbGRyZW5bbmFtZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignQ2hpbGQ6JyArIGNoaWxkSW5kZXggKyAnIGlzIG5vdCBmb3VuZCcpO1xuICB9LFxuXG4gIHRvQmVET01Db21wb25lbnRXaXRoQ2hpbGRDb3VudDogZnVuY3Rpb24gKGNvdW50KSB7XG4gICAgdGhpcy50b0JlRE9NQ29tcG9uZW50KCk7XG4gICAgdmFyIHJlbmRlcmVkQ2hpbGRyZW4gPSB0aGlzLl9pbnN0YW5jZS5fcmVuZGVyZWRDaGlsZHJlbjtcbiAgICBleHBlY3QocmVuZGVyZWRDaGlsZHJlbikudG9CZVRydXRoeSgpO1xuICAgIGV4cGVjdChPYmplY3Qua2V5cyhyZW5kZXJlZENoaWxkcmVuKS5sZW5ndGgpLnRvQmUoY291bnQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHRvQmVET01Db21wb25lbnRXaXRoTm9DaGlsZHJlbjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudG9CZURPTUNvbXBvbmVudCgpO1xuICAgIGV4cGVjdCh0aGlzLl9pbnN0YW5jZS5fcmVuZGVyZWRDaGlsZHJlbikudG9CZUZhbHN5KCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLy8gTWF0Y2hlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdG9CZUNvbXBvbmVudE9mVHlwZTogZnVuY3Rpb24gKGNvbnN0cnVjdG9yKSB7XG4gICAgZXhwZWN0KHRoaXMuX2luc3RhbmNlLl9jdXJyZW50RWxlbWVudC50eXBlID09PSBjb25zdHJ1Y3RvcikudG9CZSh0cnVlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogQSBjb21wb25lbnQgdGhhdCBpcyBjcmVhdGVkIHdpdGggUmVhY3QuY3JlYXRlQ2xhc3MuIEp1c3QgZHVjayB0eXBpbmdcbiAgICogaGVyZS5cbiAgICovXG4gIHRvQmVDb21wb3NpdGVDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBleHBlY3QodHlwZW9mIHRoaXMuaW5zdGFuY2UoKSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHRoaXMuaW5zdGFuY2UoKS5yZW5kZXIgPT09ICdmdW5jdGlvbicpLnRvQmUodHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgdG9CZUNvbXBvc2l0ZUNvbXBvbmVudFdpdGhUeXBlOiBmdW5jdGlvbiAoY29uc3RydWN0b3IpIHtcbiAgICB0aGlzLnRvQmVDb21wb3NpdGVDb21wb25lbnQoKTtcbiAgICBleHBlY3QodGhpcy5faW5zdGFuY2UuX2N1cnJlbnRFbGVtZW50LnR5cGUgPT09IGNvbnN0cnVjdG9yKS50b0JlKHRydWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHRvQmVUZXh0Q29tcG9uZW50V2l0aFZhbHVlOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgdmFyIGVsZW1lbnRUeXBlID0gdHlwZW9mIHRoaXMuX2luc3RhbmNlLl9jdXJyZW50RWxlbWVudDtcbiAgICBleHBlY3QoZWxlbWVudFR5cGUgPT09ICdzdHJpbmcnIHx8IGVsZW1lbnRUeXBlID09PSAnbnVtYmVyJykudG9CZSh0cnVlKTtcbiAgICBleHBlY3QodGhpcy5faW5zdGFuY2UuX3N0cmluZ1RleHQpLnRvQmUodmFsKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICB0b0JlRW1wdHlDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2luc3RhbmNlLl9jdXJyZW50RWxlbWVudDtcbiAgICByZXR1cm4gZWxlbWVudCA9PT0gbnVsbCB8fCBlbGVtZW50ID09PSBmYWxzZTtcbiAgfSxcblxuICB0b0JlUHJlc2VudDogZnVuY3Rpb24gKCkge1xuICAgIGV4cGVjdCh0aGlzLmluc3RhbmNlKCkpLnRvQmVUcnV0aHkoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogQSB0ZXJtaW5hbCB0eXBlIG9mIGNvbXBvbmVudCByZXByZXNlbnRpbmcgc29tZSB2aXJ0dWFsIGRvbSBub2RlLiBKdXN0IGR1Y2tcbiAgICogdHlwaW5nIGhlcmUuXG4gICAqL1xuICB0b0JlRE9NQ29tcG9uZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgZXhwZWN0KFJlYWN0VGVzdFV0aWxzLmlzRE9NQ29tcG9uZW50KHRoaXMuaW5zdGFuY2UoKSkpLnRvQmUodHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqIEBzZWUgdG9CZUNvbXBvbmVudE9mVHlwZVxuICAgKi9cbiAgdG9CZURPTUNvbXBvbmVudFdpdGhUYWc6IGZ1bmN0aW9uICh0YWcpIHtcbiAgICB0aGlzLnRvQmVET01Db21wb25lbnQoKTtcbiAgICBleHBlY3QodGhpcy5pbnN0YW5jZSgpLnRhZ05hbWUpLnRvQmUodGFnLnRvVXBwZXJDYXNlKCkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayB0aGF0IGludGVybmFsIHN0YXRlIHZhbHVlcyBhcmUgZXF1YWwgdG8gYSBzdGF0ZSBvZiBleHBlY3RlZCB2YWx1ZXMuXG4gICAqL1xuICBzY2FsYXJTdGF0ZUVxdWFsOiBmdW5jdGlvbiAoc3RhdGVOYW1lVG9FeHBlY3RlZFZhbHVlKSB7XG4gICAgZXhwZWN0KHRoaXMuaW5zdGFuY2UoKSkudG9CZVRydXRoeSgpO1xuICAgIGZvciAodmFyIHN0YXRlTmFtZSBpbiBzdGF0ZU5hbWVUb0V4cGVjdGVkVmFsdWUpIHtcbiAgICAgIGlmICghc3RhdGVOYW1lVG9FeHBlY3RlZFZhbHVlLmhhc093blByb3BlcnR5KHN0YXRlTmFtZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBleHBlY3QodGhpcy5pbnN0YW5jZSgpLnN0YXRlW3N0YXRlTmFtZV0pLnRvRXF1YWwoc3RhdGVOYW1lVG9FeHBlY3RlZFZhbHVlW3N0YXRlTmFtZV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgYSBzZXQgb2YgcHJvcHMgYXJlIGVxdWFsIHRvIGEgc2V0IG9mIGV4cGVjdGVkIHZhbHVlcyAtIG9ubHkgd29ya3NcbiAgICogd2l0aCBzY2FsYXJzLlxuICAgKi9cbiAgc2NhbGFyUHJvcHNFcXVhbDogZnVuY3Rpb24gKHByb3BOYW1lVG9FeHBlY3RlZFZhbHVlKSB7XG4gICAgZXhwZWN0KHRoaXMuaW5zdGFuY2UoKSkudG9CZVRydXRoeSgpO1xuICAgIGZvciAodmFyIHByb3BOYW1lIGluIHByb3BOYW1lVG9FeHBlY3RlZFZhbHVlKSB7XG4gICAgICBpZiAoIXByb3BOYW1lVG9FeHBlY3RlZFZhbHVlLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGV4cGVjdCh0aGlzLmluc3RhbmNlKCkucHJvcHNbcHJvcE5hbWVdKS50b0VxdWFsKHByb3BOYW1lVG9FeHBlY3RlZFZhbHVlW3Byb3BOYW1lXSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBhIHNldCBvZiBwcm9wcyBhcmUgZXF1YWwgdG8gYSBzZXQgb2YgZXhwZWN0ZWQgdmFsdWVzIC0gb25seSB3b3Jrc1xuICAgKiB3aXRoIHNjYWxhcnMuXG4gICAqL1xuICBzY2FsYXJDb250ZXh0RXF1YWw6IGZ1bmN0aW9uIChjb250ZXh0TmFtZVRvRXhwZWN0ZWRWYWx1ZSkge1xuICAgIGV4cGVjdCh0aGlzLmluc3RhbmNlKCkpLnRvQmVUcnV0aHkoKTtcbiAgICBmb3IgKHZhciBjb250ZXh0TmFtZSBpbiBjb250ZXh0TmFtZVRvRXhwZWN0ZWRWYWx1ZSkge1xuICAgICAgaWYgKCFjb250ZXh0TmFtZVRvRXhwZWN0ZWRWYWx1ZS5oYXNPd25Qcm9wZXJ0eShjb250ZXh0TmFtZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBleHBlY3QodGhpcy5pbnN0YW5jZSgpLmNvbnRleHRbY29udGV4dE5hbWVdKS50b0VxdWFsKGNvbnRleHROYW1lVG9FeHBlY3RlZFZhbHVlW2NvbnRleHROYW1lXSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSByZWFjdENvbXBvbmVudEV4cGVjdDsiXX0=