/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactTestUtils
 */

'use strict';

var EventConstants = require('./EventConstants');
var EventPluginHub = require('./EventPluginHub');
var EventPropagators = require('./EventPropagators');
var React = require('./React');
var ReactDOM = require('./ReactDOM');
var ReactElement = require('./ReactElement');
var ReactBrowserEventEmitter = require('./ReactBrowserEventEmitter');
var ReactCompositeComponent = require('./ReactCompositeComponent');
var ReactInstanceHandles = require('./ReactInstanceHandles');
var ReactInstanceMap = require('./ReactInstanceMap');
var ReactMount = require('./ReactMount');
var ReactUpdates = require('./ReactUpdates');
var SyntheticEvent = require('./SyntheticEvent');

var assign = require('./Object.assign');
var emptyObject = require('fbjs/lib/emptyObject');
var findDOMNode = require('./findDOMNode');
var invariant = require('fbjs/lib/invariant');

var topLevelTypes = EventConstants.topLevelTypes;

function Event(suffix) {}

/**
 * @class ReactTestUtils
 */

function findAllInRenderedTreeInternal(inst, test) {
  if (!inst || !inst.getPublicInstance) {
    return [];
  }
  var publicInst = inst.getPublicInstance();
  var ret = test(publicInst) ? [publicInst] : [];
  var currentElement = inst._currentElement;
  if (ReactTestUtils.isDOMComponent(publicInst)) {
    var renderedChildren = inst._renderedChildren;
    var key;
    for (key in renderedChildren) {
      if (!renderedChildren.hasOwnProperty(key)) {
        continue;
      }
      ret = ret.concat(findAllInRenderedTreeInternal(renderedChildren[key], test));
    }
  } else if (ReactElement.isValidElement(currentElement) && typeof currentElement.type === 'function') {
    ret = ret.concat(findAllInRenderedTreeInternal(inst._renderedComponent, test));
  }
  return ret;
}

/**
 * Todo: Support the entire DOM.scry query syntax. For now, these simple
 * utilities will suffice for testing purposes.
 * @lends ReactTestUtils
 */
var ReactTestUtils = {
  renderIntoDocument: function renderIntoDocument(instance) {
    var div = document.createElement('div');
    // None of our tests actually require attaching the container to the
    // DOM, and doing so creates a mess that we rely on test isolation to
    // clean up, so we're going to stop honoring the name of this method
    // (and probably rename it eventually) if no problems arise.
    // document.documentElement.appendChild(div);
    return ReactDOM.render(instance, div);
  },

  isElement: function isElement(element) {
    return ReactElement.isValidElement(element);
  },

  isElementOfType: function isElementOfType(inst, convenienceConstructor) {
    return ReactElement.isValidElement(inst) && inst.type === convenienceConstructor;
  },

  isDOMComponent: function isDOMComponent(inst) {
    return !!(inst && inst.nodeType === 1 && inst.tagName);
  },

  isDOMComponentElement: function isDOMComponentElement(inst) {
    return !!(inst && ReactElement.isValidElement(inst) && !!inst.tagName);
  },

  isCompositeComponent: function isCompositeComponent(inst) {
    if (ReactTestUtils.isDOMComponent(inst)) {
      // Accessing inst.setState warns; just return false as that'll be what
      // this returns when we have DOM nodes as refs directly
      return false;
    }
    return inst != null && typeof inst.render === 'function' && typeof inst.setState === 'function';
  },

  isCompositeComponentWithType: function isCompositeComponentWithType(inst, type) {
    if (!ReactTestUtils.isCompositeComponent(inst)) {
      return false;
    }
    var internalInstance = ReactInstanceMap.get(inst);
    var constructor = internalInstance._currentElement.type;

    return constructor === type;
  },

  isCompositeComponentElement: function isCompositeComponentElement(inst) {
    if (!ReactElement.isValidElement(inst)) {
      return false;
    }
    // We check the prototype of the type that will get mounted, not the
    // instance itself. This is a future proof way of duck typing.
    var prototype = inst.type.prototype;
    return typeof prototype.render === 'function' && typeof prototype.setState === 'function';
  },

  isCompositeComponentElementWithType: function isCompositeComponentElementWithType(inst, type) {
    var internalInstance = ReactInstanceMap.get(inst);
    var constructor = internalInstance._currentElement.type;

    return !!(ReactTestUtils.isCompositeComponentElement(inst) && constructor === type);
  },

  getRenderedChildOfCompositeComponent: function getRenderedChildOfCompositeComponent(inst) {
    if (!ReactTestUtils.isCompositeComponent(inst)) {
      return null;
    }
    var internalInstance = ReactInstanceMap.get(inst);
    return internalInstance._renderedComponent.getPublicInstance();
  },

  findAllInRenderedTree: function findAllInRenderedTree(inst, test) {
    if (!inst) {
      return [];
    }
    !ReactTestUtils.isCompositeComponent(inst) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'findAllInRenderedTree(...): instance must be a composite component') : invariant(false) : undefined;
    return findAllInRenderedTreeInternal(ReactInstanceMap.get(inst), test);
  },

  /**
   * Finds all instance of components in the rendered tree that are DOM
   * components with the class name matching `className`.
   * @return {array} an array of all the matches.
   */
  scryRenderedDOMComponentsWithClass: function scryRenderedDOMComponentsWithClass(root, classNames) {
    if (!Array.isArray(classNames)) {
      classNames = classNames.split(/\s+/);
    }
    return ReactTestUtils.findAllInRenderedTree(root, function (inst) {
      if (ReactTestUtils.isDOMComponent(inst)) {
        var className = inst.className;
        if (typeof className !== 'string') {
          // SVG, probably.
          className = inst.getAttribute('class') || '';
        }
        var classList = className.split(/\s+/);
        return classNames.every(function (name) {
          return classList.indexOf(name) !== -1;
        });
      }
      return false;
    });
  },

  /**
   * Like scryRenderedDOMComponentsWithClass but expects there to be one result,
   * and returns that one result, or throws exception if there is any other
   * number of matches besides one.
   * @return {!ReactDOMComponent} The one match.
   */
  findRenderedDOMComponentWithClass: function findRenderedDOMComponentWithClass(root, className) {
    var all = ReactTestUtils.scryRenderedDOMComponentsWithClass(root, className);
    if (all.length !== 1) {
      throw new Error('Did not find exactly one match ' + '(found: ' + all.length + ') for class:' + className);
    }
    return all[0];
  },

  /**
   * Finds all instance of components in the rendered tree that are DOM
   * components with the tag name matching `tagName`.
   * @return {array} an array of all the matches.
   */
  scryRenderedDOMComponentsWithTag: function scryRenderedDOMComponentsWithTag(root, tagName) {
    return ReactTestUtils.findAllInRenderedTree(root, function (inst) {
      return ReactTestUtils.isDOMComponent(inst) && inst.tagName.toUpperCase() === tagName.toUpperCase();
    });
  },

  /**
   * Like scryRenderedDOMComponentsWithTag but expects there to be one result,
   * and returns that one result, or throws exception if there is any other
   * number of matches besides one.
   * @return {!ReactDOMComponent} The one match.
   */
  findRenderedDOMComponentWithTag: function findRenderedDOMComponentWithTag(root, tagName) {
    var all = ReactTestUtils.scryRenderedDOMComponentsWithTag(root, tagName);
    if (all.length !== 1) {
      throw new Error('Did not find exactly one match for tag:' + tagName);
    }
    return all[0];
  },

  /**
   * Finds all instances of components with type equal to `componentType`.
   * @return {array} an array of all the matches.
   */
  scryRenderedComponentsWithType: function scryRenderedComponentsWithType(root, componentType) {
    return ReactTestUtils.findAllInRenderedTree(root, function (inst) {
      return ReactTestUtils.isCompositeComponentWithType(inst, componentType);
    });
  },

  /**
   * Same as `scryRenderedComponentsWithType` but expects there to be one result
   * and returns that one result, or throws exception if there is any other
   * number of matches besides one.
   * @return {!ReactComponent} The one match.
   */
  findRenderedComponentWithType: function findRenderedComponentWithType(root, componentType) {
    var all = ReactTestUtils.scryRenderedComponentsWithType(root, componentType);
    if (all.length !== 1) {
      throw new Error('Did not find exactly one match for componentType:' + componentType + ' (found ' + all.length + ')');
    }
    return all[0];
  },

  /**
   * Pass a mocked component module to this method to augment it with
   * useful methods that allow it to be used as a dummy React component.
   * Instead of rendering as usual, the component will become a simple
   * <div> containing any provided children.
   *
   * @param {object} module the mock function object exported from a
   *                        module that defines the component to be mocked
   * @param {?string} mockTagName optional dummy root tag name to return
   *                              from render method (overrides
   *                              module.mockTagName if provided)
   * @return {object} the ReactTestUtils object (for chaining)
   */
  mockComponent: function mockComponent(module, mockTagName) {
    mockTagName = mockTagName || module.mockTagName || 'div';

    module.prototype.render.mockImplementation(function () {
      return React.createElement(mockTagName, null, this.props.children);
    });

    return this;
  },

  /**
   * Simulates a top level event being dispatched from a raw event that occurred
   * on an `Element` node.
   * @param {Object} topLevelType A type from `EventConstants.topLevelTypes`
   * @param {!Element} node The dom to simulate an event occurring on.
   * @param {?Event} fakeNativeEvent Fake native event to use in SyntheticEvent.
   */
  simulateNativeEventOnNode: function simulateNativeEventOnNode(topLevelType, node, fakeNativeEvent) {
    fakeNativeEvent.target = node;
    ReactBrowserEventEmitter.ReactEventListener.dispatchEvent(topLevelType, fakeNativeEvent);
  },

  /**
   * Simulates a top level event being dispatched from a raw event that occurred
   * on the `ReactDOMComponent` `comp`.
   * @param {Object} topLevelType A type from `EventConstants.topLevelTypes`.
   * @param {!ReactDOMComponent} comp
   * @param {?Event} fakeNativeEvent Fake native event to use in SyntheticEvent.
   */
  simulateNativeEventOnDOMComponent: function simulateNativeEventOnDOMComponent(topLevelType, comp, fakeNativeEvent) {
    ReactTestUtils.simulateNativeEventOnNode(topLevelType, findDOMNode(comp), fakeNativeEvent);
  },

  nativeTouchData: function nativeTouchData(x, y) {
    return {
      touches: [{ pageX: x, pageY: y }]
    };
  },

  createRenderer: function createRenderer() {
    return new ReactShallowRenderer();
  },

  Simulate: null,
  SimulateNative: {}
};

/**
 * @class ReactShallowRenderer
 */
var ReactShallowRenderer = function ReactShallowRenderer() {
  this._instance = null;
};

ReactShallowRenderer.prototype.getRenderOutput = function () {
  return this._instance && this._instance._renderedComponent && this._instance._renderedComponent._renderedOutput || null;
};

var NoopInternalComponent = function NoopInternalComponent(element) {
  this._renderedOutput = element;
  this._currentElement = element;
};

NoopInternalComponent.prototype = {

  mountComponent: function mountComponent() {},

  receiveComponent: function receiveComponent(element) {
    this._renderedOutput = element;
    this._currentElement = element;
  },

  unmountComponent: function unmountComponent() {},

  getPublicInstance: function getPublicInstance() {
    return null;
  }
};

var ShallowComponentWrapper = function ShallowComponentWrapper() {};
assign(ShallowComponentWrapper.prototype, ReactCompositeComponent.Mixin, {
  _instantiateReactComponent: function _instantiateReactComponent(element) {
    return new NoopInternalComponent(element);
  },
  _replaceNodeWithMarkupByID: function _replaceNodeWithMarkupByID() {},
  _renderValidatedComponent: ReactCompositeComponent.Mixin._renderValidatedComponentWithoutOwnerOrContext
});

ReactShallowRenderer.prototype.render = function (element, context) {
  !ReactElement.isValidElement(element) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactShallowRenderer render(): Invalid component element.%s', typeof element === 'function' ? ' Instead of passing a component class, make sure to instantiate ' + 'it by passing it to React.createElement.' : '') : invariant(false) : undefined;
  !(typeof element.type !== 'string') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactShallowRenderer render(): Shallow rendering works only with custom ' + 'components, not primitives (%s). Instead of calling `.render(el)` and ' + 'inspecting the rendered output, look at `el.props` directly instead.', element.type) : invariant(false) : undefined;

  if (!context) {
    context = emptyObject;
  }
  ReactUpdates.batchedUpdates(_batchedRender, this, element, context);
};

function _batchedRender(renderer, element, context) {
  var transaction = ReactUpdates.ReactReconcileTransaction.getPooled(false);
  renderer._render(element, transaction, context);
  ReactUpdates.ReactReconcileTransaction.release(transaction);
}

ReactShallowRenderer.prototype.unmount = function () {
  if (this._instance) {
    this._instance.unmountComponent();
  }
};

ReactShallowRenderer.prototype._render = function (element, transaction, context) {
  if (this._instance) {
    this._instance.receiveComponent(element, transaction, context);
  } else {
    var rootID = ReactInstanceHandles.createReactRootID();
    var instance = new ShallowComponentWrapper(element.type);
    instance.construct(element);

    instance.mountComponent(rootID, transaction, context);

    this._instance = instance;
  }
};

/**
 * Exports:
 *
 * - `ReactTestUtils.Simulate.click(Element/ReactDOMComponent)`
 * - `ReactTestUtils.Simulate.mouseMove(Element/ReactDOMComponent)`
 * - `ReactTestUtils.Simulate.change(Element/ReactDOMComponent)`
 * - ... (All keys from event plugin `eventTypes` objects)
 */
function makeSimulator(eventType) {
  return function (domComponentOrNode, eventData) {
    var node;
    if (ReactTestUtils.isDOMComponent(domComponentOrNode)) {
      node = findDOMNode(domComponentOrNode);
    } else if (domComponentOrNode.tagName) {
      node = domComponentOrNode;
    }

    var dispatchConfig = ReactBrowserEventEmitter.eventNameDispatchConfigs[eventType];

    var fakeNativeEvent = new Event();
    fakeNativeEvent.target = node;
    // We don't use SyntheticEvent.getPooled in order to not have to worry about
    // properly destroying any properties assigned from `eventData` upon release
    var event = new SyntheticEvent(dispatchConfig, ReactMount.getID(node), fakeNativeEvent, node);
    assign(event, eventData);

    if (dispatchConfig.phasedRegistrationNames) {
      EventPropagators.accumulateTwoPhaseDispatches(event);
    } else {
      EventPropagators.accumulateDirectDispatches(event);
    }

    ReactUpdates.batchedUpdates(function () {
      EventPluginHub.enqueueEvents(event);
      EventPluginHub.processEventQueue(true);
    });
  };
}

function buildSimulators() {
  ReactTestUtils.Simulate = {};

  var eventType;
  for (eventType in ReactBrowserEventEmitter.eventNameDispatchConfigs) {
    /**
     * @param {!Element|ReactDOMComponent} domComponentOrNode
     * @param {?object} eventData Fake event data to use in SyntheticEvent.
     */
    ReactTestUtils.Simulate[eventType] = makeSimulator(eventType);
  }
}

// Rebuild ReactTestUtils.Simulate whenever event plugins are injected
var oldInjectEventPluginOrder = EventPluginHub.injection.injectEventPluginOrder;
EventPluginHub.injection.injectEventPluginOrder = function () {
  oldInjectEventPluginOrder.apply(this, arguments);
  buildSimulators();
};
var oldInjectEventPlugins = EventPluginHub.injection.injectEventPluginsByName;
EventPluginHub.injection.injectEventPluginsByName = function () {
  oldInjectEventPlugins.apply(this, arguments);
  buildSimulators();
};

buildSimulators();

/**
 * Exports:
 *
 * - `ReactTestUtils.SimulateNative.click(Element/ReactDOMComponent)`
 * - `ReactTestUtils.SimulateNative.mouseMove(Element/ReactDOMComponent)`
 * - `ReactTestUtils.SimulateNative.mouseIn/ReactDOMComponent)`
 * - `ReactTestUtils.SimulateNative.mouseOut(Element/ReactDOMComponent)`
 * - ... (All keys from `EventConstants.topLevelTypes`)
 *
 * Note: Top level event types are a subset of the entire set of handler types
 * (which include a broader set of "synthetic" events). For example, onDragDone
 * is a synthetic event. Except when testing an event plugin or React's event
 * handling code specifically, you probably want to use ReactTestUtils.Simulate
 * to dispatch synthetic events.
 */

function makeNativeSimulator(eventType) {
  return function (domComponentOrNode, nativeEventData) {
    var fakeNativeEvent = new Event(eventType);
    assign(fakeNativeEvent, nativeEventData);
    if (ReactTestUtils.isDOMComponent(domComponentOrNode)) {
      ReactTestUtils.simulateNativeEventOnDOMComponent(eventType, domComponentOrNode, fakeNativeEvent);
    } else if (domComponentOrNode.tagName) {
      // Will allow on actual dom nodes.
      ReactTestUtils.simulateNativeEventOnNode(eventType, domComponentOrNode, fakeNativeEvent);
    }
  };
}

Object.keys(topLevelTypes).forEach(function (eventType) {
  // Event type is stored as 'topClick' - we transform that to 'click'
  var convenienceName = eventType.indexOf('top') === 0 ? eventType.charAt(3).toLowerCase() + eventType.substr(4) : eventType;
  /**
   * @param {!Element|ReactDOMComponent} domComponentOrNode
   * @param {?Event} nativeEventData Fake native event to use in SyntheticEvent.
   */
  ReactTestUtils.SimulateNative[convenienceName] = makeNativeSimulator(eventType);
});

module.exports = ReactTestUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0VGVzdFV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxpQkFBaUIsUUFBUSxrQkFBUixDQUFyQjtBQUNBLElBQUksaUJBQWlCLFFBQVEsa0JBQVIsQ0FBckI7QUFDQSxJQUFJLG1CQUFtQixRQUFRLG9CQUFSLENBQXZCO0FBQ0EsSUFBSSxRQUFRLFFBQVEsU0FBUixDQUFaO0FBQ0EsSUFBSSxXQUFXLFFBQVEsWUFBUixDQUFmO0FBQ0EsSUFBSSxlQUFlLFFBQVEsZ0JBQVIsQ0FBbkI7QUFDQSxJQUFJLDJCQUEyQixRQUFRLDRCQUFSLENBQS9CO0FBQ0EsSUFBSSwwQkFBMEIsUUFBUSwyQkFBUixDQUE5QjtBQUNBLElBQUksdUJBQXVCLFFBQVEsd0JBQVIsQ0FBM0I7QUFDQSxJQUFJLG1CQUFtQixRQUFRLG9CQUFSLENBQXZCO0FBQ0EsSUFBSSxhQUFhLFFBQVEsY0FBUixDQUFqQjtBQUNBLElBQUksZUFBZSxRQUFRLGdCQUFSLENBQW5CO0FBQ0EsSUFBSSxpQkFBaUIsUUFBUSxrQkFBUixDQUFyQjs7QUFFQSxJQUFJLFNBQVMsUUFBUSxpQkFBUixDQUFiO0FBQ0EsSUFBSSxjQUFjLFFBQVEsc0JBQVIsQ0FBbEI7QUFDQSxJQUFJLGNBQWMsUUFBUSxlQUFSLENBQWxCO0FBQ0EsSUFBSSxZQUFZLFFBQVEsb0JBQVIsQ0FBaEI7O0FBRUEsSUFBSSxnQkFBZ0IsZUFBZSxhQUFuQzs7QUFFQSxTQUFTLEtBQVQsQ0FBZSxNQUFmLEVBQXVCLENBQUU7Ozs7OztBQU16QixTQUFTLDZCQUFULENBQXVDLElBQXZDLEVBQTZDLElBQTdDLEVBQW1EO0FBQ2pELE1BQUksQ0FBQyxJQUFELElBQVMsQ0FBQyxLQUFLLGlCQUFuQixFQUFzQztBQUNwQyxXQUFPLEVBQVA7QUFDRDtBQUNELE1BQUksYUFBYSxLQUFLLGlCQUFMLEVBQWpCO0FBQ0Es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Q29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdFRlc3RVdGlsc1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEV2ZW50Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9FdmVudENvbnN0YW50cycpO1xudmFyIEV2ZW50UGx1Z2luSHViID0gcmVxdWlyZSgnLi9FdmVudFBsdWdpbkh1YicpO1xudmFyIEV2ZW50UHJvcGFnYXRvcnMgPSByZXF1aXJlKCcuL0V2ZW50UHJvcGFnYXRvcnMnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJy4vUmVhY3QnKTtcbnZhciBSZWFjdERPTSA9IHJlcXVpcmUoJy4vUmVhY3RET00nKTtcbnZhciBSZWFjdEVsZW1lbnQgPSByZXF1aXJlKCcuL1JlYWN0RWxlbWVudCcpO1xudmFyIFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4vUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyJyk7XG52YXIgUmVhY3RDb21wb3NpdGVDb21wb25lbnQgPSByZXF1aXJlKCcuL1JlYWN0Q29tcG9zaXRlQ29tcG9uZW50Jyk7XG52YXIgUmVhY3RJbnN0YW5jZUhhbmRsZXMgPSByZXF1aXJlKCcuL1JlYWN0SW5zdGFuY2VIYW5kbGVzJyk7XG52YXIgUmVhY3RJbnN0YW5jZU1hcCA9IHJlcXVpcmUoJy4vUmVhY3RJbnN0YW5jZU1hcCcpO1xudmFyIFJlYWN0TW91bnQgPSByZXF1aXJlKCcuL1JlYWN0TW91bnQnKTtcbnZhciBSZWFjdFVwZGF0ZXMgPSByZXF1aXJlKCcuL1JlYWN0VXBkYXRlcycpO1xudmFyIFN5bnRoZXRpY0V2ZW50ID0gcmVxdWlyZSgnLi9TeW50aGV0aWNFdmVudCcpO1xuXG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9PYmplY3QuYXNzaWduJyk7XG52YXIgZW1wdHlPYmplY3QgPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eU9iamVjdCcpO1xudmFyIGZpbmRET01Ob2RlID0gcmVxdWlyZSgnLi9maW5kRE9NTm9kZScpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuXG52YXIgdG9wTGV2ZWxUeXBlcyA9IEV2ZW50Q29uc3RhbnRzLnRvcExldmVsVHlwZXM7XG5cbmZ1bmN0aW9uIEV2ZW50KHN1ZmZpeCkge31cblxuLyoqXG4gKiBAY2xhc3MgUmVhY3RUZXN0VXRpbHNcbiAqL1xuXG5mdW5jdGlvbiBmaW5kQWxsSW5SZW5kZXJlZFRyZWVJbnRlcm5hbChpbnN0LCB0ZXN0KSB7XG4gIGlmICghaW5zdCB8fCAhaW5zdC5nZXRQdWJsaWNJbnN0YW5jZSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICB2YXIgcHVibGljSW5zdCA9IGluc3QuZ2V0UHVibGljSW5zdGFuY2UoKTtcbiAgdmFyIHJldCA9IHRlc3QocHVibGljSW5zdCkgPyBbcHVibGljSW5zdF0gOiBbXTtcbiAgdmFyIGN1cnJlbnRFbGVtZW50ID0gaW5zdC5fY3VycmVudEVsZW1lbnQ7XG4gIGlmIChSZWFjdFRlc3RVdGlscy5pc0RPTUNvbXBvbmVudChwdWJsaWNJbnN0KSkge1xuICAgIHZhciByZW5kZXJlZENoaWxkcmVuID0gaW5zdC5fcmVuZGVyZWRDaGlsZHJlbjtcbiAgICB2YXIga2V5O1xuICAgIGZvciAoa2V5IGluIHJlbmRlcmVkQ2hpbGRyZW4pIHtcbiAgICAgIGlmICghcmVuZGVyZWRDaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmV0ID0gcmV0LmNvbmNhdChmaW5kQWxsSW5SZW5kZXJlZFRyZWVJbnRlcm5hbChyZW5kZXJlZENoaWxkcmVuW2tleV0sIHRlc3QpKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KGN1cnJlbnRFbGVtZW50KSAmJiB0eXBlb2YgY3VycmVudEVsZW1lbnQudHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldCA9IHJldC5jb25jYXQoZmluZEFsbEluUmVuZGVyZWRUcmVlSW50ZXJuYWwoaW5zdC5fcmVuZGVyZWRDb21wb25lbnQsIHRlc3QpKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIFRvZG86IFN1cHBvcnQgdGhlIGVudGlyZSBET00uc2NyeSBxdWVyeSBzeW50YXguIEZvciBub3csIHRoZXNlIHNpbXBsZVxuICogdXRpbGl0aWVzIHdpbGwgc3VmZmljZSBmb3IgdGVzdGluZyBwdXJwb3Nlcy5cbiAqIEBsZW5kcyBSZWFjdFRlc3RVdGlsc1xuICovXG52YXIgUmVhY3RUZXN0VXRpbHMgPSB7XG4gIHJlbmRlckludG9Eb2N1bWVudDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIC8vIE5vbmUgb2Ygb3VyIHRlc3RzIGFjdHVhbGx5IHJlcXVpcmUgYXR0YWNoaW5nIHRoZSBjb250YWluZXIgdG8gdGhlXG4gICAgLy8gRE9NLCBhbmQgZG9pbmcgc28gY3JlYXRlcyBhIG1lc3MgdGhhdCB3ZSByZWx5IG9uIHRlc3QgaXNvbGF0aW9uIHRvXG4gICAgLy8gY2xlYW4gdXAsIHNvIHdlJ3JlIGdvaW5nIHRvIHN0b3AgaG9ub3JpbmcgdGhlIG5hbWUgb2YgdGhpcyBtZXRob2RcbiAgICAvLyAoYW5kIHByb2JhYmx5IHJlbmFtZSBpdCBldmVudHVhbGx5KSBpZiBubyBwcm9ibGVtcyBhcmlzZS5cbiAgICAvLyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICByZXR1cm4gUmVhY3RET00ucmVuZGVyKGluc3RhbmNlLCBkaXYpO1xuICB9LFxuXG4gIGlzRWxlbWVudDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KGVsZW1lbnQpO1xuICB9LFxuXG4gIGlzRWxlbWVudE9mVHlwZTogZnVuY3Rpb24gKGluc3QsIGNvbnZlbmllbmNlQ29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KGluc3QpICYmIGluc3QudHlwZSA9PT0gY29udmVuaWVuY2VDb25zdHJ1Y3RvcjtcbiAgfSxcblxuICBpc0RPTUNvbXBvbmVudDogZnVuY3Rpb24gKGluc3QpIHtcbiAgICByZXR1cm4gISEoaW5zdCAmJiBpbnN0Lm5vZGVUeXBlID09PSAxICYmIGluc3QudGFnTmFtZSk7XG4gIH0sXG5cbiAgaXNET01Db21wb25lbnRFbGVtZW50OiBmdW5jdGlvbiAoaW5zdCkge1xuICAgIHJldHVybiAhIShpbnN0ICYmIFJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudChpbnN0KSAmJiAhIWluc3QudGFnTmFtZSk7XG4gIH0sXG5cbiAgaXNDb21wb3NpdGVDb21wb25lbnQ6IGZ1bmN0aW9uIChpbnN0KSB7XG4gICAgaWYgKFJlYWN0VGVzdFV0aWxzLmlzRE9NQ29tcG9uZW50KGluc3QpKSB7XG4gICAgICAvLyBBY2Nlc3NpbmcgaW5zdC5zZXRTdGF0ZSB3YXJuczsganVzdCByZXR1cm4gZmFsc2UgYXMgdGhhdCdsbCBiZSB3aGF0XG4gICAgICAvLyB0aGlzIHJldHVybnMgd2hlbiB3ZSBoYXZlIERPTSBub2RlcyBhcyByZWZzIGRpcmVjdGx5XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBpbnN0ICE9IG51bGwgJiYgdHlwZW9mIGluc3QucmVuZGVyID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBpbnN0LnNldFN0YXRlID09PSAnZnVuY3Rpb24nO1xuICB9LFxuXG4gIGlzQ29tcG9zaXRlQ29tcG9uZW50V2l0aFR5cGU6IGZ1bmN0aW9uIChpbnN0LCB0eXBlKSB7XG4gICAgaWYgKCFSZWFjdFRlc3RVdGlscy5pc0NvbXBvc2l0ZUNvbXBvbmVudChpbnN0KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgaW50ZXJuYWxJbnN0YW5jZSA9IFJlYWN0SW5zdGFuY2VNYXAuZ2V0KGluc3QpO1xuICAgIHZhciBjb25zdHJ1Y3RvciA9IGludGVybmFsSW5zdGFuY2UuX2N1cnJlbnRFbGVtZW50LnR5cGU7XG5cbiAgICByZXR1cm4gY29uc3RydWN0b3IgPT09IHR5cGU7XG4gIH0sXG5cbiAgaXNDb21wb3NpdGVDb21wb25lbnRFbGVtZW50OiBmdW5jdGlvbiAoaW5zdCkge1xuICAgIGlmICghUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KGluc3QpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIFdlIGNoZWNrIHRoZSBwcm90b3R5cGUgb2YgdGhlIHR5cGUgdGhhdCB3aWxsIGdldCBtb3VudGVkLCBub3QgdGhlXG4gICAgLy8gaW5zdGFuY2UgaXRzZWxmLiBUaGlzIGlzIGEgZnV0dXJlIHByb29mIHdheSBvZiBkdWNrIHR5cGluZy5cbiAgICB2YXIgcHJvdG90eXBlID0gaW5zdC50eXBlLnByb3RvdHlwZTtcbiAgICByZXR1cm4gdHlwZW9mIHByb3RvdHlwZS5yZW5kZXIgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHByb3RvdHlwZS5zZXRTdGF0ZSA9PT0gJ2Z1bmN0aW9uJztcbiAgfSxcblxuICBpc0NvbXBvc2l0ZUNvbXBvbmVudEVsZW1lbnRXaXRoVHlwZTogZnVuY3Rpb24gKGluc3QsIHR5cGUpIHtcbiAgICB2YXIgaW50ZXJuYWxJbnN0YW5jZSA9IFJlYWN0SW5zdGFuY2VNYXAuZ2V0KGluc3QpO1xuICAgIHZhciBjb25zdHJ1Y3RvciA9IGludGVybmFsSW5zdGFuY2UuX2N1cnJlbnRFbGVtZW50LnR5cGU7XG5cbiAgICByZXR1cm4gISEoUmVhY3RUZXN0VXRpbHMuaXNDb21wb3NpdGVDb21wb25lbnRFbGVtZW50KGluc3QpICYmIGNvbnN0cnVjdG9yID09PSB0eXBlKTtcbiAgfSxcblxuICBnZXRSZW5kZXJlZENoaWxkT2ZDb21wb3NpdGVDb21wb25lbnQ6IGZ1bmN0aW9uIChpbnN0KSB7XG4gICAgaWYgKCFSZWFjdFRlc3RVdGlscy5pc0NvbXBvc2l0ZUNvbXBvbmVudChpbnN0KSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBpbnRlcm5hbEluc3RhbmNlID0gUmVhY3RJbnN0YW5jZU1hcC5nZXQoaW5zdCk7XG4gICAgcmV0dXJuIGludGVybmFsSW5zdGFuY2UuX3JlbmRlcmVkQ29tcG9uZW50LmdldFB1YmxpY0luc3RhbmNlKCk7XG4gIH0sXG5cbiAgZmluZEFsbEluUmVuZGVyZWRUcmVlOiBmdW5jdGlvbiAoaW5zdCwgdGVzdCkge1xuICAgIGlmICghaW5zdCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICAhUmVhY3RUZXN0VXRpbHMuaXNDb21wb3NpdGVDb21wb25lbnQoaW5zdCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnZmluZEFsbEluUmVuZGVyZWRUcmVlKC4uLik6IGluc3RhbmNlIG11c3QgYmUgYSBjb21wb3NpdGUgY29tcG9uZW50JykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiBmaW5kQWxsSW5SZW5kZXJlZFRyZWVJbnRlcm5hbChSZWFjdEluc3RhbmNlTWFwLmdldChpbnN0KSwgdGVzdCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZpbmRzIGFsbCBpbnN0YW5jZSBvZiBjb21wb25lbnRzIGluIHRoZSByZW5kZXJlZCB0cmVlIHRoYXQgYXJlIERPTVxuICAgKiBjb21wb25lbnRzIHdpdGggdGhlIGNsYXNzIG5hbWUgbWF0Y2hpbmcgYGNsYXNzTmFtZWAuXG4gICAqIEByZXR1cm4ge2FycmF5fSBhbiBhcnJheSBvZiBhbGwgdGhlIG1hdGNoZXMuXG4gICAqL1xuICBzY3J5UmVuZGVyZWRET01Db21wb25lbnRzV2l0aENsYXNzOiBmdW5jdGlvbiAocm9vdCwgY2xhc3NOYW1lcykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShjbGFzc05hbWVzKSkge1xuICAgICAgY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXMuc3BsaXQoL1xccysvKTtcbiAgICB9XG4gICAgcmV0dXJuIFJlYWN0VGVzdFV0aWxzLmZpbmRBbGxJblJlbmRlcmVkVHJlZShyb290LCBmdW5jdGlvbiAoaW5zdCkge1xuICAgICAgaWYgKFJlYWN0VGVzdFV0aWxzLmlzRE9NQ29tcG9uZW50KGluc3QpKSB7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSBpbnN0LmNsYXNzTmFtZTtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGFzc05hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgLy8gU1ZHLCBwcm9iYWJseS5cbiAgICAgICAgICBjbGFzc05hbWUgPSBpbnN0LmdldEF0dHJpYnV0ZSgnY2xhc3MnKSB8fCAnJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2xhc3NMaXN0ID0gY2xhc3NOYW1lLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIHJldHVybiBjbGFzc05hbWVzLmV2ZXJ5KGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGNsYXNzTGlzdC5pbmRleE9mKG5hbWUpICE9PSAtMTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpa2Ugc2NyeVJlbmRlcmVkRE9NQ29tcG9uZW50c1dpdGhDbGFzcyBidXQgZXhwZWN0cyB0aGVyZSB0byBiZSBvbmUgcmVzdWx0LFxuICAgKiBhbmQgcmV0dXJucyB0aGF0IG9uZSByZXN1bHQsIG9yIHRocm93cyBleGNlcHRpb24gaWYgdGhlcmUgaXMgYW55IG90aGVyXG4gICAqIG51bWJlciBvZiBtYXRjaGVzIGJlc2lkZXMgb25lLlxuICAgKiBAcmV0dXJuIHshUmVhY3RET01Db21wb25lbnR9IFRoZSBvbmUgbWF0Y2guXG4gICAqL1xuICBmaW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoQ2xhc3M6IGZ1bmN0aW9uIChyb290LCBjbGFzc05hbWUpIHtcbiAgICB2YXIgYWxsID0gUmVhY3RUZXN0VXRpbHMuc2NyeVJlbmRlcmVkRE9NQ29tcG9uZW50c1dpdGhDbGFzcyhyb290LCBjbGFzc05hbWUpO1xuICAgIGlmIChhbGwubGVuZ3RoICE9PSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RpZCBub3QgZmluZCBleGFjdGx5IG9uZSBtYXRjaCAnICsgJyhmb3VuZDogJyArIGFsbC5sZW5ndGggKyAnKSBmb3IgY2xhc3M6JyArIGNsYXNzTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBhbGxbMF07XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZpbmRzIGFsbCBpbnN0YW5jZSBvZiBjb21wb25lbnRzIGluIHRoZSByZW5kZXJlZCB0cmVlIHRoYXQgYXJlIERPTVxuICAgKiBjb21wb25lbnRzIHdpdGggdGhlIHRhZyBuYW1lIG1hdGNoaW5nIGB0YWdOYW1lYC5cbiAgICogQHJldHVybiB7YXJyYXl9IGFuIGFycmF5IG9mIGFsbCB0aGUgbWF0Y2hlcy5cbiAgICovXG4gIHNjcnlSZW5kZXJlZERPTUNvbXBvbmVudHNXaXRoVGFnOiBmdW5jdGlvbiAocm9vdCwgdGFnTmFtZSkge1xuICAgIHJldHVybiBSZWFjdFRlc3RVdGlscy5maW5kQWxsSW5SZW5kZXJlZFRyZWUocm9vdCwgZnVuY3Rpb24gKGluc3QpIHtcbiAgICAgIHJldHVybiBSZWFjdFRlc3RVdGlscy5pc0RPTUNvbXBvbmVudChpbnN0KSAmJiBpbnN0LnRhZ05hbWUudG9VcHBlckNhc2UoKSA9PT0gdGFnTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMaWtlIHNjcnlSZW5kZXJlZERPTUNvbXBvbmVudHNXaXRoVGFnIGJ1dCBleHBlY3RzIHRoZXJlIHRvIGJlIG9uZSByZXN1bHQsXG4gICAqIGFuZCByZXR1cm5zIHRoYXQgb25lIHJlc3VsdCwgb3IgdGhyb3dzIGV4Y2VwdGlvbiBpZiB0aGVyZSBpcyBhbnkgb3RoZXJcbiAgICogbnVtYmVyIG9mIG1hdGNoZXMgYmVzaWRlcyBvbmUuXG4gICAqIEByZXR1cm4geyFSZWFjdERPTUNvbXBvbmVudH0gVGhlIG9uZSBtYXRjaC5cbiAgICovXG4gIGZpbmRSZW5kZXJlZERPTUNvbXBvbmVudFdpdGhUYWc6IGZ1bmN0aW9uIChyb290LCB0YWdOYW1lKSB7XG4gICAgdmFyIGFsbCA9IFJlYWN0VGVzdFV0aWxzLnNjcnlSZW5kZXJlZERPTUNvbXBvbmVudHNXaXRoVGFnKHJvb3QsIHRhZ05hbWUpO1xuICAgIGlmIChhbGwubGVuZ3RoICE9PSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RpZCBub3QgZmluZCBleGFjdGx5IG9uZSBtYXRjaCBmb3IgdGFnOicgKyB0YWdOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGFsbFswXTtcbiAgfSxcblxuICAvKipcbiAgICogRmluZHMgYWxsIGluc3RhbmNlcyBvZiBjb21wb25lbnRzIHdpdGggdHlwZSBlcXVhbCB0byBgY29tcG9uZW50VHlwZWAuXG4gICAqIEByZXR1cm4ge2FycmF5fSBhbiBhcnJheSBvZiBhbGwgdGhlIG1hdGNoZXMuXG4gICAqL1xuICBzY3J5UmVuZGVyZWRDb21wb25lbnRzV2l0aFR5cGU6IGZ1bmN0aW9uIChyb290LCBjb21wb25lbnRUeXBlKSB7XG4gICAgcmV0dXJuIFJlYWN0VGVzdFV0aWxzLmZpbmRBbGxJblJlbmRlcmVkVHJlZShyb290LCBmdW5jdGlvbiAoaW5zdCkge1xuICAgICAgcmV0dXJuIFJlYWN0VGVzdFV0aWxzLmlzQ29tcG9zaXRlQ29tcG9uZW50V2l0aFR5cGUoaW5zdCwgY29tcG9uZW50VHlwZSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNhbWUgYXMgYHNjcnlSZW5kZXJlZENvbXBvbmVudHNXaXRoVHlwZWAgYnV0IGV4cGVjdHMgdGhlcmUgdG8gYmUgb25lIHJlc3VsdFxuICAgKiBhbmQgcmV0dXJucyB0aGF0IG9uZSByZXN1bHQsIG9yIHRocm93cyBleGNlcHRpb24gaWYgdGhlcmUgaXMgYW55IG90aGVyXG4gICAqIG51bWJlciBvZiBtYXRjaGVzIGJlc2lkZXMgb25lLlxuICAgKiBAcmV0dXJuIHshUmVhY3RDb21wb25lbnR9IFRoZSBvbmUgbWF0Y2guXG4gICAqL1xuICBmaW5kUmVuZGVyZWRDb21wb25lbnRXaXRoVHlwZTogZnVuY3Rpb24gKHJvb3QsIGNvbXBvbmVudFR5cGUpIHtcbiAgICB2YXIgYWxsID0gUmVhY3RUZXN0VXRpbHMuc2NyeVJlbmRlcmVkQ29tcG9uZW50c1dpdGhUeXBlKHJvb3QsIGNvbXBvbmVudFR5cGUpO1xuICAgIGlmIChhbGwubGVuZ3RoICE9PSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RpZCBub3QgZmluZCBleGFjdGx5IG9uZSBtYXRjaCBmb3IgY29tcG9uZW50VHlwZTonICsgY29tcG9uZW50VHlwZSArICcgKGZvdW5kICcgKyBhbGwubGVuZ3RoICsgJyknKTtcbiAgICB9XG4gICAgcmV0dXJuIGFsbFswXTtcbiAgfSxcblxuICAvKipcbiAgICogUGFzcyBhIG1vY2tlZCBjb21wb25lbnQgbW9kdWxlIHRvIHRoaXMgbWV0aG9kIHRvIGF1Z21lbnQgaXQgd2l0aFxuICAgKiB1c2VmdWwgbWV0aG9kcyB0aGF0IGFsbG93IGl0IHRvIGJlIHVzZWQgYXMgYSBkdW1teSBSZWFjdCBjb21wb25lbnQuXG4gICAqIEluc3RlYWQgb2YgcmVuZGVyaW5nIGFzIHVzdWFsLCB0aGUgY29tcG9uZW50IHdpbGwgYmVjb21lIGEgc2ltcGxlXG4gICAqIDxkaXY+IGNvbnRhaW5pbmcgYW55IHByb3ZpZGVkIGNoaWxkcmVuLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gbW9kdWxlIHRoZSBtb2NrIGZ1bmN0aW9uIG9iamVjdCBleHBvcnRlZCBmcm9tIGFcbiAgICogICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGUgdGhhdCBkZWZpbmVzIHRoZSBjb21wb25lbnQgdG8gYmUgbW9ja2VkXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gbW9ja1RhZ05hbWUgb3B0aW9uYWwgZHVtbXkgcm9vdCB0YWcgbmFtZSB0byByZXR1cm5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIHJlbmRlciBtZXRob2QgKG92ZXJyaWRlc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZS5tb2NrVGFnTmFtZSBpZiBwcm92aWRlZClcbiAgICogQHJldHVybiB7b2JqZWN0fSB0aGUgUmVhY3RUZXN0VXRpbHMgb2JqZWN0IChmb3IgY2hhaW5pbmcpXG4gICAqL1xuICBtb2NrQ29tcG9uZW50OiBmdW5jdGlvbiAobW9kdWxlLCBtb2NrVGFnTmFtZSkge1xuICAgIG1vY2tUYWdOYW1lID0gbW9ja1RhZ05hbWUgfHwgbW9kdWxlLm1vY2tUYWdOYW1lIHx8ICdkaXYnO1xuXG4gICAgbW9kdWxlLnByb3RvdHlwZS5yZW5kZXIubW9ja0ltcGxlbWVudGF0aW9uKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KG1vY2tUYWdOYW1lLCBudWxsLCB0aGlzLnByb3BzLmNoaWxkcmVuKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTaW11bGF0ZXMgYSB0b3AgbGV2ZWwgZXZlbnQgYmVpbmcgZGlzcGF0Y2hlZCBmcm9tIGEgcmF3IGV2ZW50IHRoYXQgb2NjdXJyZWRcbiAgICogb24gYW4gYEVsZW1lbnRgIG5vZGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0b3BMZXZlbFR5cGUgQSB0eXBlIGZyb20gYEV2ZW50Q29uc3RhbnRzLnRvcExldmVsVHlwZXNgXG4gICAqIEBwYXJhbSB7IUVsZW1lbnR9IG5vZGUgVGhlIGRvbSB0byBzaW11bGF0ZSBhbiBldmVudCBvY2N1cnJpbmcgb24uXG4gICAqIEBwYXJhbSB7P0V2ZW50fSBmYWtlTmF0aXZlRXZlbnQgRmFrZSBuYXRpdmUgZXZlbnQgdG8gdXNlIGluIFN5bnRoZXRpY0V2ZW50LlxuICAgKi9cbiAgc2ltdWxhdGVOYXRpdmVFdmVudE9uTm9kZTogZnVuY3Rpb24gKHRvcExldmVsVHlwZSwgbm9kZSwgZmFrZU5hdGl2ZUV2ZW50KSB7XG4gICAgZmFrZU5hdGl2ZUV2ZW50LnRhcmdldCA9IG5vZGU7XG4gICAgUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyLlJlYWN0RXZlbnRMaXN0ZW5lci5kaXNwYXRjaEV2ZW50KHRvcExldmVsVHlwZSwgZmFrZU5hdGl2ZUV2ZW50KTtcbiAgfSxcblxuICAvKipcbiAgICogU2ltdWxhdGVzIGEgdG9wIGxldmVsIGV2ZW50IGJlaW5nIGRpc3BhdGNoZWQgZnJvbSBhIHJhdyBldmVudCB0aGF0IG9jY3VycmVkXG4gICAqIG9uIHRoZSBgUmVhY3RET01Db21wb25lbnRgIGBjb21wYC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHRvcExldmVsVHlwZSBBIHR5cGUgZnJvbSBgRXZlbnRDb25zdGFudHMudG9wTGV2ZWxUeXBlc2AuXG4gICAqIEBwYXJhbSB7IVJlYWN0RE9NQ29tcG9uZW50fSBjb21wXG4gICAqIEBwYXJhbSB7P0V2ZW50fSBmYWtlTmF0aXZlRXZlbnQgRmFrZSBuYXRpdmUgZXZlbnQgdG8gdXNlIGluIFN5bnRoZXRpY0V2ZW50LlxuICAgKi9cbiAgc2ltdWxhdGVOYXRpdmVFdmVudE9uRE9NQ29tcG9uZW50OiBmdW5jdGlvbiAodG9wTGV2ZWxUeXBlLCBjb21wLCBmYWtlTmF0aXZlRXZlbnQpIHtcbiAgICBSZWFjdFRlc3RVdGlscy5zaW11bGF0ZU5hdGl2ZUV2ZW50T25Ob2RlKHRvcExldmVsVHlwZSwgZmluZERPTU5vZGUoY29tcCksIGZha2VOYXRpdmVFdmVudCk7XG4gIH0sXG5cbiAgbmF0aXZlVG91Y2hEYXRhOiBmdW5jdGlvbiAoeCwgeSkge1xuICAgIHJldHVybiB7XG4gICAgICB0b3VjaGVzOiBbeyBwYWdlWDogeCwgcGFnZVk6IHkgfV1cbiAgICB9O1xuICB9LFxuXG4gIGNyZWF0ZVJlbmRlcmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBSZWFjdFNoYWxsb3dSZW5kZXJlcigpO1xuICB9LFxuXG4gIFNpbXVsYXRlOiBudWxsLFxuICBTaW11bGF0ZU5hdGl2ZToge31cbn07XG5cbi8qKlxuICogQGNsYXNzIFJlYWN0U2hhbGxvd1JlbmRlcmVyXG4gKi9cbnZhciBSZWFjdFNoYWxsb3dSZW5kZXJlciA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5faW5zdGFuY2UgPSBudWxsO1xufTtcblxuUmVhY3RTaGFsbG93UmVuZGVyZXIucHJvdG90eXBlLmdldFJlbmRlck91dHB1dCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX2luc3RhbmNlICYmIHRoaXMuX2luc3RhbmNlLl9yZW5kZXJlZENvbXBvbmVudCAmJiB0aGlzLl9pbnN0YW5jZS5fcmVuZGVyZWRDb21wb25lbnQuX3JlbmRlcmVkT3V0cHV0IHx8IG51bGw7XG59O1xuXG52YXIgTm9vcEludGVybmFsQ29tcG9uZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgdGhpcy5fcmVuZGVyZWRPdXRwdXQgPSBlbGVtZW50O1xuICB0aGlzLl9jdXJyZW50RWxlbWVudCA9IGVsZW1lbnQ7XG59O1xuXG5Ob29wSW50ZXJuYWxDb21wb25lbnQucHJvdG90eXBlID0ge1xuXG4gIG1vdW50Q29tcG9uZW50OiBmdW5jdGlvbiAoKSB7fSxcblxuICByZWNlaXZlQ29tcG9uZW50OiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHRoaXMuX3JlbmRlcmVkT3V0cHV0ID0gZWxlbWVudDtcbiAgICB0aGlzLl9jdXJyZW50RWxlbWVudCA9IGVsZW1lbnQ7XG4gIH0sXG5cbiAgdW5tb3VudENvbXBvbmVudDogZnVuY3Rpb24gKCkge30sXG5cbiAgZ2V0UHVibGljSW5zdGFuY2U6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcblxudmFyIFNoYWxsb3dDb21wb25lbnRXcmFwcGVyID0gZnVuY3Rpb24gKCkge307XG5hc3NpZ24oU2hhbGxvd0NvbXBvbmVudFdyYXBwZXIucHJvdG90eXBlLCBSZWFjdENvbXBvc2l0ZUNvbXBvbmVudC5NaXhpbiwge1xuICBfaW5zdGFudGlhdGVSZWFjdENvbXBvbmVudDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gbmV3IE5vb3BJbnRlcm5hbENvbXBvbmVudChlbGVtZW50KTtcbiAgfSxcbiAgX3JlcGxhY2VOb2RlV2l0aE1hcmt1cEJ5SUQ6IGZ1bmN0aW9uICgpIHt9LFxuICBfcmVuZGVyVmFsaWRhdGVkQ29tcG9uZW50OiBSZWFjdENvbXBvc2l0ZUNvbXBvbmVudC5NaXhpbi5fcmVuZGVyVmFsaWRhdGVkQ29tcG9uZW50V2l0aG91dE93bmVyT3JDb250ZXh0XG59KTtcblxuUmVhY3RTaGFsbG93UmVuZGVyZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb250ZXh0KSB7XG4gICFSZWFjdEVsZW1lbnQuaXNWYWxpZEVsZW1lbnQoZWxlbWVudCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnUmVhY3RTaGFsbG93UmVuZGVyZXIgcmVuZGVyKCk6IEludmFsaWQgY29tcG9uZW50IGVsZW1lbnQuJXMnLCB0eXBlb2YgZWxlbWVudCA9PT0gJ2Z1bmN0aW9uJyA/ICcgSW5zdGVhZCBvZiBwYXNzaW5nIGEgY29tcG9uZW50IGNsYXNzLCBtYWtlIHN1cmUgdG8gaW5zdGFudGlhdGUgJyArICdpdCBieSBwYXNzaW5nIGl0IHRvIFJlYWN0LmNyZWF0ZUVsZW1lbnQuJyA6ICcnKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICEodHlwZW9mIGVsZW1lbnQudHlwZSAhPT0gJ3N0cmluZycpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1JlYWN0U2hhbGxvd1JlbmRlcmVyIHJlbmRlcigpOiBTaGFsbG93IHJlbmRlcmluZyB3b3JrcyBvbmx5IHdpdGggY3VzdG9tICcgKyAnY29tcG9uZW50cywgbm90IHByaW1pdGl2ZXMgKCVzKS4gSW5zdGVhZCBvZiBjYWxsaW5nIGAucmVuZGVyKGVsKWAgYW5kICcgKyAnaW5zcGVjdGluZyB0aGUgcmVuZGVyZWQgb3V0cHV0LCBsb29rIGF0IGBlbC5wcm9wc2AgZGlyZWN0bHkgaW5zdGVhZC4nLCBlbGVtZW50LnR5cGUpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcblxuICBpZiAoIWNvbnRleHQpIHtcbiAgICBjb250ZXh0ID0gZW1wdHlPYmplY3Q7XG4gIH1cbiAgUmVhY3RVcGRhdGVzLmJhdGNoZWRVcGRhdGVzKF9iYXRjaGVkUmVuZGVyLCB0aGlzLCBlbGVtZW50LCBjb250ZXh0KTtcbn07XG5cbmZ1bmN0aW9uIF9iYXRjaGVkUmVuZGVyKHJlbmRlcmVyLCBlbGVtZW50LCBjb250ZXh0KSB7XG4gIHZhciB0cmFuc2FjdGlvbiA9IFJlYWN0VXBkYXRlcy5SZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9uLmdldFBvb2xlZChmYWxzZSk7XG4gIHJlbmRlcmVyLl9yZW5kZXIoZWxlbWVudCwgdHJhbnNhY3Rpb24sIGNvbnRleHQpO1xuICBSZWFjdFVwZGF0ZXMuUmVhY3RSZWNvbmNpbGVUcmFuc2FjdGlvbi5yZWxlYXNlKHRyYW5zYWN0aW9uKTtcbn1cblxuUmVhY3RTaGFsbG93UmVuZGVyZXIucHJvdG90eXBlLnVubW91bnQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLl9pbnN0YW5jZSkge1xuICAgIHRoaXMuX2luc3RhbmNlLnVubW91bnRDb21wb25lbnQoKTtcbiAgfVxufTtcblxuUmVhY3RTaGFsbG93UmVuZGVyZXIucHJvdG90eXBlLl9yZW5kZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHJhbnNhY3Rpb24sIGNvbnRleHQpIHtcbiAgaWYgKHRoaXMuX2luc3RhbmNlKSB7XG4gICAgdGhpcy5faW5zdGFuY2UucmVjZWl2ZUNvbXBvbmVudChlbGVtZW50LCB0cmFuc2FjdGlvbiwgY29udGV4dCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHJvb3RJRCA9IFJlYWN0SW5zdGFuY2VIYW5kbGVzLmNyZWF0ZVJlYWN0Um9vdElEKCk7XG4gICAgdmFyIGluc3RhbmNlID0gbmV3IFNoYWxsb3dDb21wb25lbnRXcmFwcGVyKGVsZW1lbnQudHlwZSk7XG4gICAgaW5zdGFuY2UuY29uc3RydWN0KGVsZW1lbnQpO1xuXG4gICAgaW5zdGFuY2UubW91bnRDb21wb25lbnQocm9vdElELCB0cmFuc2FjdGlvbiwgY29udGV4dCk7XG5cbiAgICB0aGlzLl9pbnN0YW5jZSA9IGluc3RhbmNlO1xuICB9XG59O1xuXG4vKipcbiAqIEV4cG9ydHM6XG4gKlxuICogLSBgUmVhY3RUZXN0VXRpbHMuU2ltdWxhdGUuY2xpY2soRWxlbWVudC9SZWFjdERPTUNvbXBvbmVudClgXG4gKiAtIGBSZWFjdFRlc3RVdGlscy5TaW11bGF0ZS5tb3VzZU1vdmUoRWxlbWVudC9SZWFjdERPTUNvbXBvbmVudClgXG4gKiAtIGBSZWFjdFRlc3RVdGlscy5TaW11bGF0ZS5jaGFuZ2UoRWxlbWVudC9SZWFjdERPTUNvbXBvbmVudClgXG4gKiAtIC4uLiAoQWxsIGtleXMgZnJvbSBldmVudCBwbHVnaW4gYGV2ZW50VHlwZXNgIG9iamVjdHMpXG4gKi9cbmZ1bmN0aW9uIG1ha2VTaW11bGF0b3IoZXZlbnRUeXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZG9tQ29tcG9uZW50T3JOb2RlLCBldmVudERhdGEpIHtcbiAgICB2YXIgbm9kZTtcbiAgICBpZiAoUmVhY3RUZXN0VXRpbHMuaXNET01Db21wb25lbnQoZG9tQ29tcG9uZW50T3JOb2RlKSkge1xuICAgICAgbm9kZSA9IGZpbmRET01Ob2RlKGRvbUNvbXBvbmVudE9yTm9kZSk7XG4gICAgfSBlbHNlIGlmIChkb21Db21wb25lbnRPck5vZGUudGFnTmFtZSkge1xuICAgICAgbm9kZSA9IGRvbUNvbXBvbmVudE9yTm9kZTtcbiAgICB9XG5cbiAgICB2YXIgZGlzcGF0Y2hDb25maWcgPSBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIuZXZlbnROYW1lRGlzcGF0Y2hDb25maWdzW2V2ZW50VHlwZV07XG5cbiAgICB2YXIgZmFrZU5hdGl2ZUV2ZW50ID0gbmV3IEV2ZW50KCk7XG4gICAgZmFrZU5hdGl2ZUV2ZW50LnRhcmdldCA9IG5vZGU7XG4gICAgLy8gV2UgZG9uJ3QgdXNlIFN5bnRoZXRpY0V2ZW50LmdldFBvb2xlZCBpbiBvcmRlciB0byBub3QgaGF2ZSB0byB3b3JyeSBhYm91dFxuICAgIC8vIHByb3Blcmx5IGRlc3Ryb3lpbmcgYW55IHByb3BlcnRpZXMgYXNzaWduZWQgZnJvbSBgZXZlbnREYXRhYCB1cG9uIHJlbGVhc2VcbiAgICB2YXIgZXZlbnQgPSBuZXcgU3ludGhldGljRXZlbnQoZGlzcGF0Y2hDb25maWcsIFJlYWN0TW91bnQuZ2V0SUQobm9kZSksIGZha2VOYXRpdmVFdmVudCwgbm9kZSk7XG4gICAgYXNzaWduKGV2ZW50LCBldmVudERhdGEpO1xuXG4gICAgaWYgKGRpc3BhdGNoQ29uZmlnLnBoYXNlZFJlZ2lzdHJhdGlvbk5hbWVzKSB7XG4gICAgICBFdmVudFByb3BhZ2F0b3JzLmFjY3VtdWxhdGVUd29QaGFzZURpc3BhdGNoZXMoZXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBFdmVudFByb3BhZ2F0b3JzLmFjY3VtdWxhdGVEaXJlY3REaXNwYXRjaGVzKGV2ZW50KTtcbiAgICB9XG5cbiAgICBSZWFjdFVwZGF0ZXMuYmF0Y2hlZFVwZGF0ZXMoZnVuY3Rpb24gKCkge1xuICAgICAgRXZlbnRQbHVnaW5IdWIuZW5xdWV1ZUV2ZW50cyhldmVudCk7XG4gICAgICBFdmVudFBsdWdpbkh1Yi5wcm9jZXNzRXZlbnRRdWV1ZSh0cnVlKTtcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRTaW11bGF0b3JzKCkge1xuICBSZWFjdFRlc3RVdGlscy5TaW11bGF0ZSA9IHt9O1xuXG4gIHZhciBldmVudFR5cGU7XG4gIGZvciAoZXZlbnRUeXBlIGluIFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlci5ldmVudE5hbWVEaXNwYXRjaENvbmZpZ3MpIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0geyFFbGVtZW50fFJlYWN0RE9NQ29tcG9uZW50fSBkb21Db21wb25lbnRPck5vZGVcbiAgICAgKiBAcGFyYW0gez9vYmplY3R9IGV2ZW50RGF0YSBGYWtlIGV2ZW50IGRhdGEgdG8gdXNlIGluIFN5bnRoZXRpY0V2ZW50LlxuICAgICAqL1xuICAgIFJlYWN0VGVzdFV0aWxzLlNpbXVsYXRlW2V2ZW50VHlwZV0gPSBtYWtlU2ltdWxhdG9yKGV2ZW50VHlwZSk7XG4gIH1cbn1cblxuLy8gUmVidWlsZCBSZWFjdFRlc3RVdGlscy5TaW11bGF0ZSB3aGVuZXZlciBldmVudCBwbHVnaW5zIGFyZSBpbmplY3RlZFxudmFyIG9sZEluamVjdEV2ZW50UGx1Z2luT3JkZXIgPSBFdmVudFBsdWdpbkh1Yi5pbmplY3Rpb24uaW5qZWN0RXZlbnRQbHVnaW5PcmRlcjtcbkV2ZW50UGx1Z2luSHViLmluamVjdGlvbi5pbmplY3RFdmVudFBsdWdpbk9yZGVyID0gZnVuY3Rpb24gKCkge1xuICBvbGRJbmplY3RFdmVudFBsdWdpbk9yZGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIGJ1aWxkU2ltdWxhdG9ycygpO1xufTtcbnZhciBvbGRJbmplY3RFdmVudFBsdWdpbnMgPSBFdmVudFBsdWdpbkh1Yi5pbmplY3Rpb24uaW5qZWN0RXZlbnRQbHVnaW5zQnlOYW1lO1xuRXZlbnRQbHVnaW5IdWIuaW5qZWN0aW9uLmluamVjdEV2ZW50UGx1Z2luc0J5TmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgb2xkSW5qZWN0RXZlbnRQbHVnaW5zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIGJ1aWxkU2ltdWxhdG9ycygpO1xufTtcblxuYnVpbGRTaW11bGF0b3JzKCk7XG5cbi8qKlxuICogRXhwb3J0czpcbiAqXG4gKiAtIGBSZWFjdFRlc3RVdGlscy5TaW11bGF0ZU5hdGl2ZS5jbGljayhFbGVtZW50L1JlYWN0RE9NQ29tcG9uZW50KWBcbiAqIC0gYFJlYWN0VGVzdFV0aWxzLlNpbXVsYXRlTmF0aXZlLm1vdXNlTW92ZShFbGVtZW50L1JlYWN0RE9NQ29tcG9uZW50KWBcbiAqIC0gYFJlYWN0VGVzdFV0aWxzLlNpbXVsYXRlTmF0aXZlLm1vdXNlSW4vUmVhY3RET01Db21wb25lbnQpYFxuICogLSBgUmVhY3RUZXN0VXRpbHMuU2ltdWxhdGVOYXRpdmUubW91c2VPdXQoRWxlbWVudC9SZWFjdERPTUNvbXBvbmVudClgXG4gKiAtIC4uLiAoQWxsIGtleXMgZnJvbSBgRXZlbnRDb25zdGFudHMudG9wTGV2ZWxUeXBlc2ApXG4gKlxuICogTm90ZTogVG9wIGxldmVsIGV2ZW50IHR5cGVzIGFyZSBhIHN1YnNldCBvZiB0aGUgZW50aXJlIHNldCBvZiBoYW5kbGVyIHR5cGVzXG4gKiAod2hpY2ggaW5jbHVkZSBhIGJyb2FkZXIgc2V0IG9mIFwic3ludGhldGljXCIgZXZlbnRzKS4gRm9yIGV4YW1wbGUsIG9uRHJhZ0RvbmVcbiAqIGlzIGEgc3ludGhldGljIGV2ZW50LiBFeGNlcHQgd2hlbiB0ZXN0aW5nIGFuIGV2ZW50IHBsdWdpbiBvciBSZWFjdCdzIGV2ZW50XG4gKiBoYW5kbGluZyBjb2RlIHNwZWNpZmljYWxseSwgeW91IHByb2JhYmx5IHdhbnQgdG8gdXNlIFJlYWN0VGVzdFV0aWxzLlNpbXVsYXRlXG4gKiB0byBkaXNwYXRjaCBzeW50aGV0aWMgZXZlbnRzLlxuICovXG5cbmZ1bmN0aW9uIG1ha2VOYXRpdmVTaW11bGF0b3IoZXZlbnRUeXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZG9tQ29tcG9uZW50T3JOb2RlLCBuYXRpdmVFdmVudERhdGEpIHtcbiAgICB2YXIgZmFrZU5hdGl2ZUV2ZW50ID0gbmV3IEV2ZW50KGV2ZW50VHlwZSk7XG4gICAgYXNzaWduKGZha2VOYXRpdmVFdmVudCwgbmF0aXZlRXZlbnREYXRhKTtcbiAgICBpZiAoUmVhY3RUZXN0VXRpbHMuaXNET01Db21wb25lbnQoZG9tQ29tcG9uZW50T3JOb2RlKSkge1xuICAgICAgUmVhY3RUZXN0VXRpbHMuc2ltdWxhdGVOYXRpdmVFdmVudE9uRE9NQ29tcG9uZW50KGV2ZW50VHlwZSwgZG9tQ29tcG9uZW50T3JOb2RlLCBmYWtlTmF0aXZlRXZlbnQpO1xuICAgIH0gZWxzZSBpZiAoZG9tQ29tcG9uZW50T3JOb2RlLnRhZ05hbWUpIHtcbiAgICAgIC8vIFdpbGwgYWxsb3cgb24gYWN0dWFsIGRvbSBub2Rlcy5cbiAgICAgIFJlYWN0VGVzdFV0aWxzLnNpbXVsYXRlTmF0aXZlRXZlbnRPbk5vZGUoZXZlbnRUeXBlLCBkb21Db21wb25lbnRPck5vZGUsIGZha2VOYXRpdmVFdmVudCk7XG4gICAgfVxuICB9O1xufVxuXG5PYmplY3Qua2V5cyh0b3BMZXZlbFR5cGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudFR5cGUpIHtcbiAgLy8gRXZlbnQgdHlwZSBpcyBzdG9yZWQgYXMgJ3RvcENsaWNrJyAtIHdlIHRyYW5zZm9ybSB0aGF0IHRvICdjbGljaydcbiAgdmFyIGNvbnZlbmllbmNlTmFtZSA9IGV2ZW50VHlwZS5pbmRleE9mKCd0b3AnKSA9PT0gMCA/IGV2ZW50VHlwZS5jaGFyQXQoMykudG9Mb3dlckNhc2UoKSArIGV2ZW50VHlwZS5zdWJzdHIoNCkgOiBldmVudFR5cGU7XG4gIC8qKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fFJlYWN0RE9NQ29tcG9uZW50fSBkb21Db21wb25lbnRPck5vZGVcbiAgICogQHBhcmFtIHs/RXZlbnR9IG5hdGl2ZUV2ZW50RGF0YSBGYWtlIG5hdGl2ZSBldmVudCB0byB1c2UgaW4gU3ludGhldGljRXZlbnQuXG4gICAqL1xuICBSZWFjdFRlc3RVdGlscy5TaW11bGF0ZU5hdGl2ZVtjb252ZW5pZW5jZU5hbWVdID0gbWFrZU5hdGl2ZVNpbXVsYXRvcihldmVudFR5cGUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RUZXN0VXRpbHM7Il19