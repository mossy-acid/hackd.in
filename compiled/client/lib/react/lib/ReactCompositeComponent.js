/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactCompositeComponent
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var ReactComponentEnvironment = require('./ReactComponentEnvironment');
var ReactCurrentOwner = require('./ReactCurrentOwner');
var ReactElement = require('./ReactElement');
var ReactInstanceMap = require('./ReactInstanceMap');
var ReactPerf = require('./ReactPerf');
var ReactPropTypeLocations = require('./ReactPropTypeLocations');
var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactReconciler = require('./ReactReconciler');
var ReactUpdateQueue = require('./ReactUpdateQueue');

var assign = require('./Object.assign');
var emptyObject = require('fbjs/lib/emptyObject');
var invariant = require('fbjs/lib/invariant');
var shouldUpdateReactComponent = require('./shouldUpdateReactComponent');
var warning = require('fbjs/lib/warning');

function getDeclarationErrorAddendum(component) {
  var owner = component._currentElement._owner || null;
  if (owner) {
    var name = owner.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

function StatelessComponent(Component) {}
StatelessComponent.prototype.render = function () {
  var Component = ReactInstanceMap.get(this)._currentElement.type;
  return Component(this.props, this.context, this.updater);
};

/**
 * ------------------ The Life-Cycle of a Composite Component ------------------
 *
 * - constructor: Initialization of state. The instance is now retained.
 *   - componentWillMount
 *   - render
 *   - [children's constructors]
 *     - [children's componentWillMount and render]
 *     - [children's componentDidMount]
 *     - componentDidMount
 *
 *       Update Phases:
 *       - componentWillReceiveProps (only called if parent updated)
 *       - shouldComponentUpdate
 *         - componentWillUpdate
 *           - render
 *           - [children's constructors or receive props phases]
 *         - componentDidUpdate
 *
 *     - componentWillUnmount
 *     - [children's componentWillUnmount]
 *   - [children destroyed]
 * - (destroyed): The instance is now blank, released by React and ready for GC.
 *
 * -----------------------------------------------------------------------------
 */

/**
 * An incrementing ID assigned to each component when it is mounted. This is
 * used to enforce the order in which `ReactUpdates` updates dirty components.
 *
 * @private
 */
var nextMountID = 1;

/**
 * @lends {ReactCompositeComponent.prototype}
 */
var ReactCompositeComponentMixin = {

  /**
   * Base constructor for all composite component.
   *
   * @param {ReactElement} element
   * @final
   * @internal
   */
  construct: function construct(element) {
    this._currentElement = element;
    this._rootNodeID = null;
    this._instance = null;

    // See ReactUpdateQueue
    this._pendingElement = null;
    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;

    this._renderedComponent = null;

    this._context = null;
    this._mountOrder = 0;
    this._topLevelWrapper = null;

    // See ReactUpdates and ReactUpdateQueue.
    this._pendingCallbacks = null;
  },

  /**
   * Initializes the component, renders markup, and registers event listeners.
   *
   * @param {string} rootID DOM ID of the root node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @return {?string} Rendered markup to be inserted into the DOM.
   * @final
   * @internal
   */
  mountComponent: function mountComponent(rootID, transaction, context) {
    this._context = context;
    this._mountOrder = nextMountID++;
    this._rootNodeID = rootID;

    var publicProps = this._processProps(this._currentElement.props);
    var publicContext = this._processContext(context);

    var Component = this._currentElement.type;

    // Initialize the public class
    var inst;
    var renderedElement;

    // This is a way to detect if Component is a stateless arrow function
    // component, which is not newable. It might not be 100% reliable but is
    // something we can do until we start detecting that Component extends
    // React.Component. We already assume that typeof Component === 'function'.
    var canInstantiate = 'prototype' in Component;

    if (canInstantiate) {
      if (process.env.NODE_ENV !== 'production') {
        ReactCurrentOwner.current = this;
        try {
          inst = new Component(publicProps, publicContext, ReactUpdateQueue);
        } finally {
          ReactCurrentOwner.current = null;
        }
      } else {
        inst = new Component(publicProps, publicContext, ReactUpdateQueue);
      }
    }

    if (!canInstantiate || inst === null || inst === false || ReactElement.isValidElement(inst)) {
      renderedElement = inst;
      inst = new StatelessComponent(Component);
    }

    if (process.env.NODE_ENV !== 'production') {
      // This will throw later in _renderValidatedComponent, but add an early
      // warning now to help debugging
      if (inst.render == null) {
        process.env.NODE_ENV !== 'production' ? warning(false, '%s(...): No `render` method found on the returned component ' + 'instance: you may have forgotten to define `render`, returned ' + 'null/false from a stateless component, or tried to render an ' + 'element whose type is a function that isn\'t a React component.', Component.displayName || Component.name || 'Component') : undefined;
      } else {
        // We support ES6 inheriting from React.Component, the module pattern,
        // and stateless components, but not ES6 classes that don't extend
        process.env.NODE_ENV !== 'production' ? warning(Component.prototype && Component.prototype.isReactComponent || !canInstantiate || !(inst instanceof Component), '%s(...): React component classes must extend React.Component.', Component.displayName || Component.name || 'Component') : undefined;
      }
    }

    // These should be set up in the constructor, but as a convenience for
    // simpler class abstractions, we set them up after the fact.
    inst.props = publicProps;
    inst.context = publicContext;
    inst.refs = emptyObject;
    inst.updater = ReactUpdateQueue;

    this._instance = inst;

    // Store a reference from the instance back to the internal representation
    ReactInstanceMap.set(inst, this);

    if (process.env.NODE_ENV !== 'production') {
      // Since plain JS classes are defined without any special initialization
      // logic, we can not catch common errors early. Therefore, we have to
      // catch them here, at initialization time, instead.
      process.env.NODE_ENV !== 'production' ? warning(!inst.getInitialState || inst.getInitialState.isReactClassApproved, 'getInitialState was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Did you mean to define a state property instead?', this.getName() || 'a component') : undefined;
      process.env.NODE_ENV !== 'production' ? warning(!inst.getDefaultProps || inst.getDefaultProps.isReactClassApproved, 'getDefaultProps was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Use a static property to define defaultProps instead.', this.getName() || 'a component') : undefined;
      process.env.NODE_ENV !== 'production' ? warning(!inst.propTypes, 'propTypes was defined as an instance property on %s. Use a static ' + 'property to define propTypes instead.', this.getName() || 'a component') : undefined;
      process.env.NODE_ENV !== 'production' ? warning(!inst.contextTypes, 'contextTypes was defined as an instance property on %s. Use a ' + 'static property to define contextTypes instead.', this.getName() || 'a component') : undefined;
      process.env.NODE_ENV !== 'production' ? warning(typeof inst.componentShouldUpdate !== 'function', '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', this.getName() || 'A component') : undefined;
      process.env.NODE_ENV !== 'production' ? warning(typeof inst.componentDidUnmount !== 'function', '%s has a method called ' + 'componentDidUnmount(). But there is no such lifecycle method. ' + 'Did you mean componentWillUnmount()?', this.getName() || 'A component') : undefined;
      process.env.NODE_ENV !== 'production' ? warning(typeof inst.componentWillRecieveProps !== 'function', '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', this.getName() || 'A component') : undefined;
    }

    var initialState = inst.state;
    if (initialState === undefined) {
      inst.state = initialState = null;
    }
    !((typeof initialState === 'undefined' ? 'undefined' : _typeof(initialState)) === 'object' && !Array.isArray(initialState)) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.state: must be set to an object or null', this.getName() || 'ReactCompositeComponent') : invariant(false) : undefined;

    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;

    if (inst.componentWillMount) {
      inst.componentWillMount();
      // When mounting, calls to `setState` by `componentWillMount` will set
      // `this._pendingStateQueue` without triggering a re-render.
      if (this._pendingStateQueue) {
        inst.state = this._processPendingState(inst.props, inst.context);
      }
    }

    // If not a stateless component, we now render
    if (renderedElement === undefined) {
      renderedElement = this._renderValidatedComponent();
    }

    this._renderedComponent = this._instantiateReactComponent(renderedElement);

    var markup = ReactReconciler.mountComponent(this._renderedComponent, rootID, transaction, this._processChildContext(context));
    if (inst.componentDidMount) {
      transaction.getReactMountReady().enqueue(inst.componentDidMount, inst);
    }

    return markup;
  },

  /**
   * Releases any resources allocated by `mountComponent`.
   *
   * @final
   * @internal
   */
  unmountComponent: function unmountComponent() {
    var inst = this._instance;

    if (inst.componentWillUnmount) {
      inst.componentWillUnmount();
    }

    ReactReconciler.unmountComponent(this._renderedComponent);
    this._renderedComponent = null;
    this._instance = null;

    // Reset pending fields
    // Even if this component is scheduled for another update in ReactUpdates,
    // it would still be ignored because these fields are reset.
    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;
    this._pendingCallbacks = null;
    this._pendingElement = null;

    // These fields do not really need to be reset since this object is no
    // longer accessible.
    this._context = null;
    this._rootNodeID = null;
    this._topLevelWrapper = null;

    // Delete the reference from the instance to this internal representation
    // which allow the internals to be properly cleaned up even if the user
    // leaks a reference to the public instance.
    ReactInstanceMap.remove(inst);

    // Some existing components rely on inst.props even after they've been
    // destroyed (in event handlers).
    // TODO: inst.props = null;
    // TODO: inst.state = null;
    // TODO: inst.context = null;
  },

  /**
   * Filters the context object to only contain keys specified in
   * `contextTypes`
   *
   * @param {object} context
   * @return {?object}
   * @private
   */
  _maskContext: function _maskContext(context) {
    var maskedContext = null;
    var Component = this._currentElement.type;
    var contextTypes = Component.contextTypes;
    if (!contextTypes) {
      return emptyObject;
    }
    maskedContext = {};
    for (var contextName in contextTypes) {
      maskedContext[contextName] = context[contextName];
    }
    return maskedContext;
  },

  /**
   * Filters the context object to only contain keys specified in
   * `contextTypes`, and asserts that they are valid.
   *
   * @param {object} context
   * @return {?object}
   * @private
   */
  _processContext: function _processContext(context) {
    var maskedContext = this._maskContext(context);
    if (process.env.NODE_ENV !== 'production') {
      var Component = this._currentElement.type;
      if (Component.contextTypes) {
        this._checkPropTypes(Component.contextTypes, maskedContext, ReactPropTypeLocations.context);
      }
    }
    return maskedContext;
  },

  /**
   * @param {object} currentContext
   * @return {object}
   * @private
   */
  _processChildContext: function _processChildContext(currentContext) {
    var Component = this._currentElement.type;
    var inst = this._instance;
    var childContext = inst.getChildContext && inst.getChildContext();
    if (childContext) {
      !(_typeof(Component.childContextTypes) === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.getChildContext(): childContextTypes must be defined in order to ' + 'use getChildContext().', this.getName() || 'ReactCompositeComponent') : invariant(false) : undefined;
      if (process.env.NODE_ENV !== 'production') {
        this._checkPropTypes(Component.childContextTypes, childContext, ReactPropTypeLocations.childContext);
      }
      for (var name in childContext) {
        !(name in Component.childContextTypes) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.getChildContext(): key "%s" is not defined in childContextTypes.', this.getName() || 'ReactCompositeComponent', name) : invariant(false) : undefined;
      }
      return assign({}, currentContext, childContext);
    }
    return currentContext;
  },

  /**
   * Processes props by setting default values for unspecified props and
   * asserting that the props are valid. Does not mutate its argument; returns
   * a new props object with defaults merged in.
   *
   * @param {object} newProps
   * @return {object}
   * @private
   */
  _processProps: function _processProps(newProps) {
    if (process.env.NODE_ENV !== 'production') {
      var Component = this._currentElement.type;
      if (Component.propTypes) {
        this._checkPropTypes(Component.propTypes, newProps, ReactPropTypeLocations.prop);
      }
    }
    return newProps;
  },

  /**
   * Assert that the props are valid
   *
   * @param {object} propTypes Map of prop name to a ReactPropType
   * @param {object} props
   * @param {string} location e.g. "prop", "context", "child context"
   * @private
   */
  _checkPropTypes: function _checkPropTypes(propTypes, props, location) {
    // TODO: Stop validating prop types here and only use the element
    // validation.
    var componentName = this.getName();
    for (var propName in propTypes) {
      if (propTypes.hasOwnProperty(propName)) {
        var error;
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          !(typeof propTypes[propName] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually ' + 'from React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], propName) : invariant(false) : undefined;
          error = propTypes[propName](props, propName, componentName, location);
        } catch (ex) {
          error = ex;
        }
        if (error instanceof Error) {
          // We may want to extend this logic for similar errors in
          // top-level render calls, so I'm abstracting it away into
          // a function to minimize refactoring in the future
          var addendum = getDeclarationErrorAddendum(this);

          if (location === ReactPropTypeLocations.prop) {
            // Preface gives us something to blacklist in warning module
            process.env.NODE_ENV !== 'production' ? warning(false, 'Failed Composite propType: %s%s', error.message, addendum) : undefined;
          } else {
            process.env.NODE_ENV !== 'production' ? warning(false, 'Failed Context Types: %s%s', error.message, addendum) : undefined;
          }
        }
      }
    }
  },

  receiveComponent: function receiveComponent(nextElement, transaction, nextContext) {
    var prevElement = this._currentElement;
    var prevContext = this._context;

    this._pendingElement = null;

    this.updateComponent(transaction, prevElement, nextElement, prevContext, nextContext);
  },

  /**
   * If any of `_pendingElement`, `_pendingStateQueue`, or `_pendingForceUpdate`
   * is set, update the component.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  performUpdateIfNecessary: function performUpdateIfNecessary(transaction) {
    if (this._pendingElement != null) {
      ReactReconciler.receiveComponent(this, this._pendingElement || this._currentElement, transaction, this._context);
    }

    if (this._pendingStateQueue !== null || this._pendingForceUpdate) {
      this.updateComponent(transaction, this._currentElement, this._currentElement, this._context, this._context);
    }
  },

  /**
   * Perform an update to a mounted component. The componentWillReceiveProps and
   * shouldComponentUpdate methods are called, then (assuming the update isn't
   * skipped) the remaining update lifecycle methods are called and the DOM
   * representation is updated.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {ReactElement} prevParentElement
   * @param {ReactElement} nextParentElement
   * @internal
   * @overridable
   */
  updateComponent: function updateComponent(transaction, prevParentElement, nextParentElement, prevUnmaskedContext, nextUnmaskedContext) {
    var inst = this._instance;

    var nextContext = this._context === nextUnmaskedContext ? inst.context : this._processContext(nextUnmaskedContext);
    var nextProps;

    // Distinguish between a props update versus a simple state update
    if (prevParentElement === nextParentElement) {
      // Skip checking prop types again -- we don't read inst.props to avoid
      // warning for DOM component props in this upgrade
      nextProps = nextParentElement.props;
    } else {
      nextProps = this._processProps(nextParentElement.props);
      // An update here will schedule an update but immediately set
      // _pendingStateQueue which will ensure that any state updates gets
      // immediately reconciled instead of waiting for the next batch.

      if (inst.componentWillReceiveProps) {
        inst.componentWillReceiveProps(nextProps, nextContext);
      }
    }

    var nextState = this._processPendingState(nextProps, nextContext);

    var shouldUpdate = this._pendingForceUpdate || !inst.shouldComponentUpdate || inst.shouldComponentUpdate(nextProps, nextState, nextContext);

    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(typeof shouldUpdate !== 'undefined', '%s.shouldComponentUpdate(): Returned undefined instead of a ' + 'boolean value. Make sure to return true or false.', this.getName() || 'ReactCompositeComponent') : undefined;
    }

    if (shouldUpdate) {
      this._pendingForceUpdate = false;
      // Will set `this.props`, `this.state` and `this.context`.
      this._performComponentUpdate(nextParentElement, nextProps, nextState, nextContext, transaction, nextUnmaskedContext);
    } else {
      // If it's determined that a component should not update, we still want
      // to set props and state but we shortcut the rest of the update.
      this._currentElement = nextParentElement;
      this._context = nextUnmaskedContext;
      inst.props = nextProps;
      inst.state = nextState;
      inst.context = nextContext;
    }
  },

  _processPendingState: function _processPendingState(props, context) {
    var inst = this._instance;
    var queue = this._pendingStateQueue;
    var replace = this._pendingReplaceState;
    this._pendingReplaceState = false;
    this._pendingStateQueue = null;

    if (!queue) {
      return inst.state;
    }

    if (replace && queue.length === 1) {
      return queue[0];
    }

    var nextState = assign({}, replace ? queue[0] : inst.state);
    for (var i = replace ? 1 : 0; i < queue.length; i++) {
      var partial = queue[i];
      assign(nextState, typeof partial === 'function' ? partial.call(inst, nextState, props, context) : partial);
    }

    return nextState;
  },

  /**
   * Merges new props and state, notifies delegate methods of update and
   * performs update.
   *
   * @param {ReactElement} nextElement Next element
   * @param {object} nextProps Next public object to set as properties.
   * @param {?object} nextState Next object to set as state.
   * @param {?object} nextContext Next public object to set as context.
   * @param {ReactReconcileTransaction} transaction
   * @param {?object} unmaskedContext
   * @private
   */
  _performComponentUpdate: function _performComponentUpdate(nextElement, nextProps, nextState, nextContext, transaction, unmaskedContext) {
    var inst = this._instance;

    var hasComponentDidUpdate = Boolean(inst.componentDidUpdate);
    var prevProps;
    var prevState;
    var prevContext;
    if (hasComponentDidUpdate) {
      prevProps = inst.props;
      prevState = inst.state;
      prevContext = inst.context;
    }

    if (inst.componentWillUpdate) {
      inst.componentWillUpdate(nextProps, nextState, nextContext);
    }

    this._currentElement = nextElement;
    this._context = unmaskedContext;
    inst.props = nextProps;
    inst.state = nextState;
    inst.context = nextContext;

    this._updateRenderedComponent(transaction, unmaskedContext);

    if (hasComponentDidUpdate) {
      transaction.getReactMountReady().enqueue(inst.componentDidUpdate.bind(inst, prevProps, prevState, prevContext), inst);
    }
  },

  /**
   * Call the component's `render` method and update the DOM accordingly.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  _updateRenderedComponent: function _updateRenderedComponent(transaction, context) {
    var prevComponentInstance = this._renderedComponent;
    var prevRenderedElement = prevComponentInstance._currentElement;
    var nextRenderedElement = this._renderValidatedComponent();
    if (shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
      ReactReconciler.receiveComponent(prevComponentInstance, nextRenderedElement, transaction, this._processChildContext(context));
    } else {
      // These two IDs are actually the same! But nothing should rely on that.
      var thisID = this._rootNodeID;
      var prevComponentID = prevComponentInstance._rootNodeID;
      ReactReconciler.unmountComponent(prevComponentInstance);

      this._renderedComponent = this._instantiateReactComponent(nextRenderedElement);
      var nextMarkup = ReactReconciler.mountComponent(this._renderedComponent, thisID, transaction, this._processChildContext(context));
      this._replaceNodeWithMarkupByID(prevComponentID, nextMarkup);
    }
  },

  /**
   * @protected
   */
  _replaceNodeWithMarkupByID: function _replaceNodeWithMarkupByID(prevComponentID, nextMarkup) {
    ReactComponentEnvironment.replaceNodeWithMarkupByID(prevComponentID, nextMarkup);
  },

  /**
   * @protected
   */
  _renderValidatedComponentWithoutOwnerOrContext: function _renderValidatedComponentWithoutOwnerOrContext() {
    var inst = this._instance;
    var renderedComponent = inst.render();
    if (process.env.NODE_ENV !== 'production') {
      // We allow auto-mocks to proceed as if they're returning null.
      if (typeof renderedComponent === 'undefined' && inst.render._isMockFunction) {
        // This is probably bad practice. Consider warning here and
        // deprecating this convenience.
        renderedComponent = null;
      }
    }

    return renderedComponent;
  },

  /**
   * @private
   */
  _renderValidatedComponent: function _renderValidatedComponent() {
    var renderedComponent;
    ReactCurrentOwner.current = this;
    try {
      renderedComponent = this._renderValidatedComponentWithoutOwnerOrContext();
    } finally {
      ReactCurrentOwner.current = null;
    }
    !(
    // TODO: An `isValidNode` function would probably be more appropriate
    renderedComponent === null || renderedComponent === false || ReactElement.isValidElement(renderedComponent)) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.render(): A valid ReactComponent must be returned. You may have ' + 'returned undefined, an array or some other invalid object.', this.getName() || 'ReactCompositeComponent') : invariant(false) : undefined;
    return renderedComponent;
  },

  /**
   * Lazily allocates the refs object and stores `component` as `ref`.
   *
   * @param {string} ref Reference name.
   * @param {component} component Component to store as `ref`.
   * @final
   * @private
   */
  attachRef: function attachRef(ref, component) {
    var inst = this.getPublicInstance();
    !(inst != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Stateless function components cannot have refs.') : invariant(false) : undefined;
    var publicComponentInstance = component.getPublicInstance();
    if (process.env.NODE_ENV !== 'production') {
      var componentName = component && component.getName ? component.getName() : 'a component';
      process.env.NODE_ENV !== 'production' ? warning(publicComponentInstance != null, 'Stateless function components cannot be given refs ' + '(See ref "%s" in %s created by %s). ' + 'Attempts to access this ref will fail.', ref, componentName, this.getName()) : undefined;
    }
    var refs = inst.refs === emptyObject ? inst.refs = {} : inst.refs;
    refs[ref] = publicComponentInstance;
  },

  /**
   * Detaches a reference name.
   *
   * @param {string} ref Name to dereference.
   * @final
   * @private
   */
  detachRef: function detachRef(ref) {
    var refs = this.getPublicInstance().refs;
    delete refs[ref];
  },

  /**
   * Get a text description of the component that can be used to identify it
   * in error messages.
   * @return {string} The name or null.
   * @internal
   */
  getName: function getName() {
    var type = this._currentElement.type;
    var constructor = this._instance && this._instance.constructor;
    return type.displayName || constructor && constructor.displayName || type.name || constructor && constructor.name || null;
  },

  /**
   * Get the publicly accessible representation of this component - i.e. what
   * is exposed by refs and returned by render. Can be null for stateless
   * components.
   *
   * @return {ReactComponent} the public component instance.
   * @internal
   */
  getPublicInstance: function getPublicInstance() {
    var inst = this._instance;
    if (inst instanceof StatelessComponent) {
      return null;
    }
    return inst;
  },

  // Stub
  _instantiateReactComponent: null

};

ReactPerf.measureMethods(ReactCompositeComponentMixin, 'ReactCompositeComponent', {
  mountComponent: 'mountComponent',
  updateComponent: 'updateComponent',
  _renderValidatedComponent: '_renderValidatedComponent'
});

var ReactCompositeComponent = {

  Mixin: ReactCompositeComponentMixin

};

module.exports = ReactCompositeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0Q29tcG9zaXRlQ29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7Ozs7QUFFQSxJQUFJLDRCQUE0QixRQUFRLDZCQUFSLENBQWhDO0FBQ0EsSUFBSSxvQkFBb0IsUUFBUSxxQkFBUixDQUF4QjtBQUNBLElBQUksZUFBZSxRQUFRLGdCQUFSLENBQW5CO0FBQ0EsSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUF2QjtBQUNBLElBQUksWUFBWSxRQUFRLGFBQVIsQ0FBaEI7QUFDQSxJQUFJLHlCQUF5QixRQUFRLDBCQUFSLENBQTdCO0FBQ0EsSUFBSSw2QkFBNkIsUUFBUSw4QkFBUixDQUFqQztBQUNBLElBQUksa0JBQWtCLFFBQVEsbUJBQVIsQ0FBdEI7QUFDQSxJQUFJLG1CQUFtQixRQUFRLG9CQUFSLENBQXZCOztBQUVBLElBQUksU0FBUyxRQUFRLGlCQUFSLENBQWI7QUFDQSxJQUFJLGNBQWMsUUFBUSxzQkFBUixDQUFsQjtBQUNBLElBQUksWUFBWSxRQUFRLG9CQUFSLENBQWhCO0FBQ0EsSUFBSSw2QkFBNkIsUUFBUSw4QkFBUixDQUFqQztBQUNBLElBQUksVUFBVSxRQUFRLGtCQUFSLENBQWQ7O0FBRUEsU0FBUywyQkFBVCxDQUFxQyxTQUFyQyxFQUFnRDtBQUM5QyxNQUFJLFFBQVEsVUFBVSxlQUFWLENBQTBCLE1BQTFCLElBQW9DLElBQWhEO0FBQ0EsTUFBSSxLQUFKLEVBQVc7QUFDVCxRQUFJLE9BQU8sTUFBTSxPQUFOLEVBQVg7QUFDQSxRQUFJLElBQUosRUFBVTtBQUNSLGFBQU8sa0NBQWtDLElBQWxDLEdBQXlDLElBQWhEO0FBQ0Q7QUFDRjtBQUNELFNBQU8sRUFBUDtBQUNEOztBQUVELFNBQVMsa0JBQVQsQ0FBNEIsU0FBNUIsRUFBdUMsQ0FBRTtBQUN6QyxtQkFBbUIsU0FBbkIsQ0FBNkIsTUFBN0IsR0FBc0MsWUFBWTtBQUNo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SSxnQkFBZ0Isa0JBQXBCLEVBQXdDO0FBQ3RDLGFBQU8sSUFBUDtBQUNEO0FBQ0QsV0FBTyxJQUFQO0FBQ0QsR0E5a0JnQzs7O0FBaWxCakMsOEJBQTRCOztBQWpsQkssQ0FBbkM7O0FBcWxCQSxVQUFVLGNBQVYsQ0FBeUIsNEJBQXpCLEVBQXVELHlCQUF2RCxFQUFrRjtBQUNoRixrQkFBZ0IsZ0JBRGdFO0FBRWhGLG1CQUFpQixpQkFGK0Q7QUFHaEYsNkJBQTJCO0FBSHFELENBQWxGOztBQU1BLElBQUksMEJBQTBCOztBQUU1QixTQUFPOztBQUZxQixDQUE5Qjs7QUFNQSxPQUFPLE9BQVAsR0FBaUIsdUJBQWpCIiwiZmlsZSI6IlJlYWN0Q29tcG9zaXRlQ29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0Q29tcG9zaXRlQ29tcG9uZW50XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RDb21wb25lbnRFbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vUmVhY3RDb21wb25lbnRFbnZpcm9ubWVudCcpO1xudmFyIFJlYWN0Q3VycmVudE93bmVyID0gcmVxdWlyZSgnLi9SZWFjdEN1cnJlbnRPd25lcicpO1xudmFyIFJlYWN0RWxlbWVudCA9IHJlcXVpcmUoJy4vUmVhY3RFbGVtZW50Jyk7XG52YXIgUmVhY3RJbnN0YW5jZU1hcCA9IHJlcXVpcmUoJy4vUmVhY3RJbnN0YW5jZU1hcCcpO1xudmFyIFJlYWN0UGVyZiA9IHJlcXVpcmUoJy4vUmVhY3RQZXJmJyk7XG52YXIgUmVhY3RQcm9wVHlwZUxvY2F0aW9ucyA9IHJlcXVpcmUoJy4vUmVhY3RQcm9wVHlwZUxvY2F0aW9ucycpO1xudmFyIFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzID0gcmVxdWlyZSgnLi9SZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcycpO1xudmFyIFJlYWN0UmVjb25jaWxlciA9IHJlcXVpcmUoJy4vUmVhY3RSZWNvbmNpbGVyJyk7XG52YXIgUmVhY3RVcGRhdGVRdWV1ZSA9IHJlcXVpcmUoJy4vUmVhY3RVcGRhdGVRdWV1ZScpO1xuXG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9PYmplY3QuYXNzaWduJyk7XG52YXIgZW1wdHlPYmplY3QgPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eU9iamVjdCcpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHNob3VsZFVwZGF0ZVJlYWN0Q29tcG9uZW50ID0gcmVxdWlyZSgnLi9zaG91bGRVcGRhdGVSZWFjdENvbXBvbmVudCcpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbmZ1bmN0aW9uIGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bShjb21wb25lbnQpIHtcbiAgdmFyIG93bmVyID0gY29tcG9uZW50Ll9jdXJyZW50RWxlbWVudC5fb3duZXIgfHwgbnVsbDtcbiAgaWYgKG93bmVyKSB7XG4gICAgdmFyIG5hbWUgPSBvd25lci5nZXROYW1lKCk7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHJldHVybiAnIENoZWNrIHRoZSByZW5kZXIgbWV0aG9kIG9mIGAnICsgbmFtZSArICdgLic7XG4gICAgfVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gU3RhdGVsZXNzQ29tcG9uZW50KENvbXBvbmVudCkge31cblN0YXRlbGVzc0NvbXBvbmVudC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgQ29tcG9uZW50ID0gUmVhY3RJbnN0YW5jZU1hcC5nZXQodGhpcykuX2N1cnJlbnRFbGVtZW50LnR5cGU7XG4gIHJldHVybiBDb21wb25lbnQodGhpcy5wcm9wcywgdGhpcy5jb250ZXh0LCB0aGlzLnVwZGF0ZXIpO1xufTtcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0gVGhlIExpZmUtQ3ljbGUgb2YgYSBDb21wb3NpdGUgQ29tcG9uZW50IC0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIC0gY29uc3RydWN0b3I6IEluaXRpYWxpemF0aW9uIG9mIHN0YXRlLiBUaGUgaW5zdGFuY2UgaXMgbm93IHJldGFpbmVkLlxuICogICAtIGNvbXBvbmVudFdpbGxNb3VudFxuICogICAtIHJlbmRlclxuICogICAtIFtjaGlsZHJlbidzIGNvbnN0cnVjdG9yc11cbiAqICAgICAtIFtjaGlsZHJlbidzIGNvbXBvbmVudFdpbGxNb3VudCBhbmQgcmVuZGVyXVxuICogICAgIC0gW2NoaWxkcmVuJ3MgY29tcG9uZW50RGlkTW91bnRdXG4gKiAgICAgLSBjb21wb25lbnREaWRNb3VudFxuICpcbiAqICAgICAgIFVwZGF0ZSBQaGFzZXM6XG4gKiAgICAgICAtIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG9ubHkgY2FsbGVkIGlmIHBhcmVudCB1cGRhdGVkKVxuICogICAgICAgLSBzaG91bGRDb21wb25lbnRVcGRhdGVcbiAqICAgICAgICAgLSBjb21wb25lbnRXaWxsVXBkYXRlXG4gKiAgICAgICAgICAgLSByZW5kZXJcbiAqICAgICAgICAgICAtIFtjaGlsZHJlbidzIGNvbnN0cnVjdG9ycyBvciByZWNlaXZlIHByb3BzIHBoYXNlc11cbiAqICAgICAgICAgLSBjb21wb25lbnREaWRVcGRhdGVcbiAqXG4gKiAgICAgLSBjb21wb25lbnRXaWxsVW5tb3VudFxuICogICAgIC0gW2NoaWxkcmVuJ3MgY29tcG9uZW50V2lsbFVubW91bnRdXG4gKiAgIC0gW2NoaWxkcmVuIGRlc3Ryb3llZF1cbiAqIC0gKGRlc3Ryb3llZCk6IFRoZSBpbnN0YW5jZSBpcyBub3cgYmxhbmssIHJlbGVhc2VkIGJ5IFJlYWN0IGFuZCByZWFkeSBmb3IgR0MuXG4gKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIEFuIGluY3JlbWVudGluZyBJRCBhc3NpZ25lZCB0byBlYWNoIGNvbXBvbmVudCB3aGVuIGl0IGlzIG1vdW50ZWQuIFRoaXMgaXNcbiAqIHVzZWQgdG8gZW5mb3JjZSB0aGUgb3JkZXIgaW4gd2hpY2ggYFJlYWN0VXBkYXRlc2AgdXBkYXRlcyBkaXJ0eSBjb21wb25lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbnZhciBuZXh0TW91bnRJRCA9IDE7XG5cbi8qKlxuICogQGxlbmRzIHtSZWFjdENvbXBvc2l0ZUNvbXBvbmVudC5wcm90b3R5cGV9XG4gKi9cbnZhciBSZWFjdENvbXBvc2l0ZUNvbXBvbmVudE1peGluID0ge1xuXG4gIC8qKlxuICAgKiBCYXNlIGNvbnN0cnVjdG9yIGZvciBhbGwgY29tcG9zaXRlIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnRcbiAgICogQGZpbmFsXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgY29uc3RydWN0OiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHRoaXMuX2N1cnJlbnRFbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLl9yb290Tm9kZUlEID0gbnVsbDtcbiAgICB0aGlzLl9pbnN0YW5jZSA9IG51bGw7XG5cbiAgICAvLyBTZWUgUmVhY3RVcGRhdGVRdWV1ZVxuICAgIHRoaXMuX3BlbmRpbmdFbGVtZW50ID0gbnVsbDtcbiAgICB0aGlzLl9wZW5kaW5nU3RhdGVRdWV1ZSA9IG51bGw7XG4gICAgdGhpcy5fcGVuZGluZ1JlcGxhY2VTdGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuX3BlbmRpbmdGb3JjZVVwZGF0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5fcmVuZGVyZWRDb21wb25lbnQgPSBudWxsO1xuXG4gICAgdGhpcy5fY29udGV4dCA9IG51bGw7XG4gICAgdGhpcy5fbW91bnRPcmRlciA9IDA7XG4gICAgdGhpcy5fdG9wTGV2ZWxXcmFwcGVyID0gbnVsbDtcblxuICAgIC8vIFNlZSBSZWFjdFVwZGF0ZXMgYW5kIFJlYWN0VXBkYXRlUXVldWUuXG4gICAgdGhpcy5fcGVuZGluZ0NhbGxiYWNrcyA9IG51bGw7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBjb21wb25lbnQsIHJlbmRlcnMgbWFya3VwLCBhbmQgcmVnaXN0ZXJzIGV2ZW50IGxpc3RlbmVycy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJvb3RJRCBET00gSUQgb2YgdGhlIHJvb3Qgbm9kZS5cbiAgICogQHBhcmFtIHtSZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9ufFJlYWN0U2VydmVyUmVuZGVyaW5nVHJhbnNhY3Rpb259IHRyYW5zYWN0aW9uXG4gICAqIEByZXR1cm4gez9zdHJpbmd9IFJlbmRlcmVkIG1hcmt1cCB0byBiZSBpbnNlcnRlZCBpbnRvIHRoZSBET00uXG4gICAqIEBmaW5hbFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIG1vdW50Q29tcG9uZW50OiBmdW5jdGlvbiAocm9vdElELCB0cmFuc2FjdGlvbiwgY29udGV4dCkge1xuICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuX21vdW50T3JkZXIgPSBuZXh0TW91bnRJRCsrO1xuICAgIHRoaXMuX3Jvb3ROb2RlSUQgPSByb290SUQ7XG5cbiAgICB2YXIgcHVibGljUHJvcHMgPSB0aGlzLl9wcm9jZXNzUHJvcHModGhpcy5fY3VycmVudEVsZW1lbnQucHJvcHMpO1xuICAgIHZhciBwdWJsaWNDb250ZXh0ID0gdGhpcy5fcHJvY2Vzc0NvbnRleHQoY29udGV4dCk7XG5cbiAgICB2YXIgQ29tcG9uZW50ID0gdGhpcy5fY3VycmVudEVsZW1lbnQudHlwZTtcblxuICAgIC8vIEluaXRpYWxpemUgdGhlIHB1YmxpYyBjbGFzc1xuICAgIHZhciBpbnN0O1xuICAgIHZhciByZW5kZXJlZEVsZW1lbnQ7XG5cbiAgICAvLyBUaGlzIGlzIGEgd2F5IHRvIGRldGVjdCBpZiBDb21wb25lbnQgaXMgYSBzdGF0ZWxlc3MgYXJyb3cgZnVuY3Rpb25cbiAgICAvLyBjb21wb25lbnQsIHdoaWNoIGlzIG5vdCBuZXdhYmxlLiBJdCBtaWdodCBub3QgYmUgMTAwJSByZWxpYWJsZSBidXQgaXNcbiAgICAvLyBzb21ldGhpbmcgd2UgY2FuIGRvIHVudGlsIHdlIHN0YXJ0IGRldGVjdGluZyB0aGF0IENvbXBvbmVudCBleHRlbmRzXG4gICAgLy8gUmVhY3QuQ29tcG9uZW50LiBXZSBhbHJlYWR5IGFzc3VtZSB0aGF0IHR5cGVvZiBDb21wb25lbnQgPT09ICdmdW5jdGlvbicuXG4gICAgdmFyIGNhbkluc3RhbnRpYXRlID0gKCdwcm90b3R5cGUnIGluIENvbXBvbmVudCk7XG5cbiAgICBpZiAoY2FuSW5zdGFudGlhdGUpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQgPSB0aGlzO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGluc3QgPSBuZXcgQ29tcG9uZW50KHB1YmxpY1Byb3BzLCBwdWJsaWNDb250ZXh0LCBSZWFjdFVwZGF0ZVF1ZXVlKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdCA9IG5ldyBDb21wb25lbnQocHVibGljUHJvcHMsIHB1YmxpY0NvbnRleHQsIFJlYWN0VXBkYXRlUXVldWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghY2FuSW5zdGFudGlhdGUgfHwgaW5zdCA9PT0gbnVsbCB8fCBpbnN0ID09PSBmYWxzZSB8fCBSZWFjdEVsZW1lbnQuaXNWYWxpZEVsZW1lbnQoaW5zdCkpIHtcbiAgICAgIHJlbmRlcmVkRWxlbWVudCA9IGluc3Q7XG4gICAgICBpbnN0ID0gbmV3IFN0YXRlbGVzc0NvbXBvbmVudChDb21wb25lbnQpO1xuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgbGF0ZXIgaW4gX3JlbmRlclZhbGlkYXRlZENvbXBvbmVudCwgYnV0IGFkZCBhbiBlYXJseVxuICAgICAgLy8gd2FybmluZyBub3cgdG8gaGVscCBkZWJ1Z2dpbmdcbiAgICAgIGlmIChpbnN0LnJlbmRlciA9PSBudWxsKSB7XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnJXMoLi4uKTogTm8gYHJlbmRlcmAgbWV0aG9kIGZvdW5kIG9uIHRoZSByZXR1cm5lZCBjb21wb25lbnQgJyArICdpbnN0YW5jZTogeW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBkZWZpbmUgYHJlbmRlcmAsIHJldHVybmVkICcgKyAnbnVsbC9mYWxzZSBmcm9tIGEgc3RhdGVsZXNzIGNvbXBvbmVudCwgb3IgdHJpZWQgdG8gcmVuZGVyIGFuICcgKyAnZWxlbWVudCB3aG9zZSB0eXBlIGlzIGEgZnVuY3Rpb24gdGhhdCBpc25cXCd0IGEgUmVhY3QgY29tcG9uZW50LicsIENvbXBvbmVudC5kaXNwbGF5TmFtZSB8fCBDb21wb25lbnQubmFtZSB8fCAnQ29tcG9uZW50JykgOiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBXZSBzdXBwb3J0IEVTNiBpbmhlcml0aW5nIGZyb20gUmVhY3QuQ29tcG9uZW50LCB0aGUgbW9kdWxlIHBhdHRlcm4sXG4gICAgICAgIC8vIGFuZCBzdGF0ZWxlc3MgY29tcG9uZW50cywgYnV0IG5vdCBFUzYgY2xhc3NlcyB0aGF0IGRvbid0IGV4dGVuZFxuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhDb21wb25lbnQucHJvdG90eXBlICYmIENvbXBvbmVudC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudCB8fCAhY2FuSW5zdGFudGlhdGUgfHwgIShpbnN0IGluc3RhbmNlb2YgQ29tcG9uZW50KSwgJyVzKC4uLik6IFJlYWN0IGNvbXBvbmVudCBjbGFzc2VzIG11c3QgZXh0ZW5kIFJlYWN0LkNvbXBvbmVudC4nLCBDb21wb25lbnQuZGlzcGxheU5hbWUgfHwgQ29tcG9uZW50Lm5hbWUgfHwgJ0NvbXBvbmVudCcpIDogdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZXNlIHNob3VsZCBiZSBzZXQgdXAgaW4gdGhlIGNvbnN0cnVjdG9yLCBidXQgYXMgYSBjb252ZW5pZW5jZSBmb3JcbiAgICAvLyBzaW1wbGVyIGNsYXNzIGFic3RyYWN0aW9ucywgd2Ugc2V0IHRoZW0gdXAgYWZ0ZXIgdGhlIGZhY3QuXG4gICAgaW5zdC5wcm9wcyA9IHB1YmxpY1Byb3BzO1xuICAgIGluc3QuY29udGV4dCA9IHB1YmxpY0NvbnRleHQ7XG4gICAgaW5zdC5yZWZzID0gZW1wdHlPYmplY3Q7XG4gICAgaW5zdC51cGRhdGVyID0gUmVhY3RVcGRhdGVRdWV1ZTtcblxuICAgIHRoaXMuX2luc3RhbmNlID0gaW5zdDtcblxuICAgIC8vIFN0b3JlIGEgcmVmZXJlbmNlIGZyb20gdGhlIGluc3RhbmNlIGJhY2sgdG8gdGhlIGludGVybmFsIHJlcHJlc2VudGF0aW9uXG4gICAgUmVhY3RJbnN0YW5jZU1hcC5zZXQoaW5zdCwgdGhpcyk7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLy8gU2luY2UgcGxhaW4gSlMgY2xhc3NlcyBhcmUgZGVmaW5lZCB3aXRob3V0IGFueSBzcGVjaWFsIGluaXRpYWxpemF0aW9uXG4gICAgICAvLyBsb2dpYywgd2UgY2FuIG5vdCBjYXRjaCBjb21tb24gZXJyb3JzIGVhcmx5LiBUaGVyZWZvcmUsIHdlIGhhdmUgdG9cbiAgICAgIC8vIGNhdGNoIHRoZW0gaGVyZSwgYXQgaW5pdGlhbGl6YXRpb24gdGltZSwgaW5zdGVhZC5cbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKCFpbnN0LmdldEluaXRpYWxTdGF0ZSB8fCBpbnN0LmdldEluaXRpYWxTdGF0ZS5pc1JlYWN0Q2xhc3NBcHByb3ZlZCwgJ2dldEluaXRpYWxTdGF0ZSB3YXMgZGVmaW5lZCBvbiAlcywgYSBwbGFpbiBKYXZhU2NyaXB0IGNsYXNzLiAnICsgJ1RoaXMgaXMgb25seSBzdXBwb3J0ZWQgZm9yIGNsYXNzZXMgY3JlYXRlZCB1c2luZyBSZWFjdC5jcmVhdGVDbGFzcy4gJyArICdEaWQgeW91IG1lYW4gdG8gZGVmaW5lIGEgc3RhdGUgcHJvcGVydHkgaW5zdGVhZD8nLCB0aGlzLmdldE5hbWUoKSB8fCAnYSBjb21wb25lbnQnKSA6IHVuZGVmaW5lZDtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKCFpbnN0LmdldERlZmF1bHRQcm9wcyB8fCBpbnN0LmdldERlZmF1bHRQcm9wcy5pc1JlYWN0Q2xhc3NBcHByb3ZlZCwgJ2dldERlZmF1bHRQcm9wcyB3YXMgZGVmaW5lZCBvbiAlcywgYSBwbGFpbiBKYXZhU2NyaXB0IGNsYXNzLiAnICsgJ1RoaXMgaXMgb25seSBzdXBwb3J0ZWQgZm9yIGNsYXNzZXMgY3JlYXRlZCB1c2luZyBSZWFjdC5jcmVhdGVDbGFzcy4gJyArICdVc2UgYSBzdGF0aWMgcHJvcGVydHkgdG8gZGVmaW5lIGRlZmF1bHRQcm9wcyBpbnN0ZWFkLicsIHRoaXMuZ2V0TmFtZSgpIHx8ICdhIGNvbXBvbmVudCcpIDogdW5kZWZpbmVkO1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoIWluc3QucHJvcFR5cGVzLCAncHJvcFR5cGVzIHdhcyBkZWZpbmVkIGFzIGFuIGluc3RhbmNlIHByb3BlcnR5IG9uICVzLiBVc2UgYSBzdGF0aWMgJyArICdwcm9wZXJ0eSB0byBkZWZpbmUgcHJvcFR5cGVzIGluc3RlYWQuJywgdGhpcy5nZXROYW1lKCkgfHwgJ2EgY29tcG9uZW50JykgOiB1bmRlZmluZWQ7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyghaW5zdC5jb250ZXh0VHlwZXMsICdjb250ZXh0VHlwZXMgd2FzIGRlZmluZWQgYXMgYW4gaW5zdGFuY2UgcHJvcGVydHkgb24gJXMuIFVzZSBhICcgKyAnc3RhdGljIHByb3BlcnR5IHRvIGRlZmluZSBjb250ZXh0VHlwZXMgaW5zdGVhZC4nLCB0aGlzLmdldE5hbWUoKSB8fCAnYSBjb21wb25lbnQnKSA6IHVuZGVmaW5lZDtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKHR5cGVvZiBpbnN0LmNvbXBvbmVudFNob3VsZFVwZGF0ZSAhPT0gJ2Z1bmN0aW9uJywgJyVzIGhhcyBhIG1ldGhvZCBjYWxsZWQgJyArICdjb21wb25lbnRTaG91bGRVcGRhdGUoKS4gRGlkIHlvdSBtZWFuIHNob3VsZENvbXBvbmVudFVwZGF0ZSgpPyAnICsgJ1RoZSBuYW1lIGlzIHBocmFzZWQgYXMgYSBxdWVzdGlvbiBiZWNhdXNlIHRoZSBmdW5jdGlvbiBpcyAnICsgJ2V4cGVjdGVkIHRvIHJldHVybiBhIHZhbHVlLicsIHRoaXMuZ2V0TmFtZSgpIHx8ICdBIGNvbXBvbmVudCcpIDogdW5kZWZpbmVkO1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcodHlwZW9mIGluc3QuY29tcG9uZW50RGlkVW5tb3VudCAhPT0gJ2Z1bmN0aW9uJywgJyVzIGhhcyBhIG1ldGhvZCBjYWxsZWQgJyArICdjb21wb25lbnREaWRVbm1vdW50KCkuIEJ1dCB0aGVyZSBpcyBubyBzdWNoIGxpZmVjeWNsZSBtZXRob2QuICcgKyAnRGlkIHlvdSBtZWFuIGNvbXBvbmVudFdpbGxVbm1vdW50KCk/JywgdGhpcy5nZXROYW1lKCkgfHwgJ0EgY29tcG9uZW50JykgOiB1bmRlZmluZWQ7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyh0eXBlb2YgaW5zdC5jb21wb25lbnRXaWxsUmVjaWV2ZVByb3BzICE9PSAnZnVuY3Rpb24nLCAnJXMgaGFzIGEgbWV0aG9kIGNhbGxlZCAnICsgJ2NvbXBvbmVudFdpbGxSZWNpZXZlUHJvcHMoKS4gRGlkIHlvdSBtZWFuIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKT8nLCB0aGlzLmdldE5hbWUoKSB8fCAnQSBjb21wb25lbnQnKSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgaW5pdGlhbFN0YXRlID0gaW5zdC5zdGF0ZTtcbiAgICBpZiAoaW5pdGlhbFN0YXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGluc3Quc3RhdGUgPSBpbml0aWFsU3RhdGUgPSBudWxsO1xuICAgIH1cbiAgICAhKHR5cGVvZiBpbml0aWFsU3RhdGUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGluaXRpYWxTdGF0ZSkpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJyVzLnN0YXRlOiBtdXN0IGJlIHNldCB0byBhbiBvYmplY3Qgb3IgbnVsbCcsIHRoaXMuZ2V0TmFtZSgpIHx8ICdSZWFjdENvbXBvc2l0ZUNvbXBvbmVudCcpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuX3BlbmRpbmdTdGF0ZVF1ZXVlID0gbnVsbDtcbiAgICB0aGlzLl9wZW5kaW5nUmVwbGFjZVN0YXRlID0gZmFsc2U7XG4gICAgdGhpcy5fcGVuZGluZ0ZvcmNlVXBkYXRlID0gZmFsc2U7XG5cbiAgICBpZiAoaW5zdC5jb21wb25lbnRXaWxsTW91bnQpIHtcbiAgICAgIGluc3QuY29tcG9uZW50V2lsbE1vdW50KCk7XG4gICAgICAvLyBXaGVuIG1vdW50aW5nLCBjYWxscyB0byBgc2V0U3RhdGVgIGJ5IGBjb21wb25lbnRXaWxsTW91bnRgIHdpbGwgc2V0XG4gICAgICAvLyBgdGhpcy5fcGVuZGluZ1N0YXRlUXVldWVgIHdpdGhvdXQgdHJpZ2dlcmluZyBhIHJlLXJlbmRlci5cbiAgICAgIGlmICh0aGlzLl9wZW5kaW5nU3RhdGVRdWV1ZSkge1xuICAgICAgICBpbnN0LnN0YXRlID0gdGhpcy5fcHJvY2Vzc1BlbmRpbmdTdGF0ZShpbnN0LnByb3BzLCBpbnN0LmNvbnRleHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIG5vdCBhIHN0YXRlbGVzcyBjb21wb25lbnQsIHdlIG5vdyByZW5kZXJcbiAgICBpZiAocmVuZGVyZWRFbGVtZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlbmRlcmVkRWxlbWVudCA9IHRoaXMuX3JlbmRlclZhbGlkYXRlZENvbXBvbmVudCgpO1xuICAgIH1cblxuICAgIHRoaXMuX3JlbmRlcmVkQ29tcG9uZW50ID0gdGhpcy5faW5zdGFudGlhdGVSZWFjdENvbXBvbmVudChyZW5kZXJlZEVsZW1lbnQpO1xuXG4gICAgdmFyIG1hcmt1cCA9IFJlYWN0UmVjb25jaWxlci5tb3VudENvbXBvbmVudCh0aGlzLl9yZW5kZXJlZENvbXBvbmVudCwgcm9vdElELCB0cmFuc2FjdGlvbiwgdGhpcy5fcHJvY2Vzc0NoaWxkQ29udGV4dChjb250ZXh0KSk7XG4gICAgaWYgKGluc3QuY29tcG9uZW50RGlkTW91bnQpIHtcbiAgICAgIHRyYW5zYWN0aW9uLmdldFJlYWN0TW91bnRSZWFkeSgpLmVucXVldWUoaW5zdC5jb21wb25lbnREaWRNb3VudCwgaW5zdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcmt1cDtcbiAgfSxcblxuICAvKipcbiAgICogUmVsZWFzZXMgYW55IHJlc291cmNlcyBhbGxvY2F0ZWQgYnkgYG1vdW50Q29tcG9uZW50YC5cbiAgICpcbiAgICogQGZpbmFsXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgdW5tb3VudENvbXBvbmVudDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpbnN0ID0gdGhpcy5faW5zdGFuY2U7XG5cbiAgICBpZiAoaW5zdC5jb21wb25lbnRXaWxsVW5tb3VudCkge1xuICAgICAgaW5zdC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuICAgIH1cblxuICAgIFJlYWN0UmVjb25jaWxlci51bm1vdW50Q29tcG9uZW50KHRoaXMuX3JlbmRlcmVkQ29tcG9uZW50KTtcbiAgICB0aGlzLl9yZW5kZXJlZENvbXBvbmVudCA9IG51bGw7XG4gICAgdGhpcy5faW5zdGFuY2UgPSBudWxsO1xuXG4gICAgLy8gUmVzZXQgcGVuZGluZyBmaWVsZHNcbiAgICAvLyBFdmVuIGlmIHRoaXMgY29tcG9uZW50IGlzIHNjaGVkdWxlZCBmb3IgYW5vdGhlciB1cGRhdGUgaW4gUmVhY3RVcGRhdGVzLFxuICAgIC8vIGl0IHdvdWxkIHN0aWxsIGJlIGlnbm9yZWQgYmVjYXVzZSB0aGVzZSBmaWVsZHMgYXJlIHJlc2V0LlxuICAgIHRoaXMuX3BlbmRpbmdTdGF0ZVF1ZXVlID0gbnVsbDtcbiAgICB0aGlzLl9wZW5kaW5nUmVwbGFjZVN0YXRlID0gZmFsc2U7XG4gICAgdGhpcy5fcGVuZGluZ0ZvcmNlVXBkYXRlID0gZmFsc2U7XG4gICAgdGhpcy5fcGVuZGluZ0NhbGxiYWNrcyA9IG51bGw7XG4gICAgdGhpcy5fcGVuZGluZ0VsZW1lbnQgPSBudWxsO1xuXG4gICAgLy8gVGhlc2UgZmllbGRzIGRvIG5vdCByZWFsbHkgbmVlZCB0byBiZSByZXNldCBzaW5jZSB0aGlzIG9iamVjdCBpcyBub1xuICAgIC8vIGxvbmdlciBhY2Nlc3NpYmxlLlxuICAgIHRoaXMuX2NvbnRleHQgPSBudWxsO1xuICAgIHRoaXMuX3Jvb3ROb2RlSUQgPSBudWxsO1xuICAgIHRoaXMuX3RvcExldmVsV3JhcHBlciA9IG51bGw7XG5cbiAgICAvLyBEZWxldGUgdGhlIHJlZmVyZW5jZSBmcm9tIHRoZSBpbnN0YW5jZSB0byB0aGlzIGludGVybmFsIHJlcHJlc2VudGF0aW9uXG4gICAgLy8gd2hpY2ggYWxsb3cgdGhlIGludGVybmFscyB0byBiZSBwcm9wZXJseSBjbGVhbmVkIHVwIGV2ZW4gaWYgdGhlIHVzZXJcbiAgICAvLyBsZWFrcyBhIHJlZmVyZW5jZSB0byB0aGUgcHVibGljIGluc3RhbmNlLlxuICAgIFJlYWN0SW5zdGFuY2VNYXAucmVtb3ZlKGluc3QpO1xuXG4gICAgLy8gU29tZSBleGlzdGluZyBjb21wb25lbnRzIHJlbHkgb24gaW5zdC5wcm9wcyBldmVuIGFmdGVyIHRoZXkndmUgYmVlblxuICAgIC8vIGRlc3Ryb3llZCAoaW4gZXZlbnQgaGFuZGxlcnMpLlxuICAgIC8vIFRPRE86IGluc3QucHJvcHMgPSBudWxsO1xuICAgIC8vIFRPRE86IGluc3Quc3RhdGUgPSBudWxsO1xuICAgIC8vIFRPRE86IGluc3QuY29udGV4dCA9IG51bGw7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZpbHRlcnMgdGhlIGNvbnRleHQgb2JqZWN0IHRvIG9ubHkgY29udGFpbiBrZXlzIHNwZWNpZmllZCBpblxuICAgKiBgY29udGV4dFR5cGVzYFxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dFxuICAgKiBAcmV0dXJuIHs/b2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX21hc2tDb250ZXh0OiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIHZhciBtYXNrZWRDb250ZXh0ID0gbnVsbDtcbiAgICB2YXIgQ29tcG9uZW50ID0gdGhpcy5fY3VycmVudEVsZW1lbnQudHlwZTtcbiAgICB2YXIgY29udGV4dFR5cGVzID0gQ29tcG9uZW50LmNvbnRleHRUeXBlcztcbiAgICBpZiAoIWNvbnRleHRUeXBlcykge1xuICAgICAgcmV0dXJuIGVtcHR5T2JqZWN0O1xuICAgIH1cbiAgICBtYXNrZWRDb250ZXh0ID0ge307XG4gICAgZm9yICh2YXIgY29udGV4dE5hbWUgaW4gY29udGV4dFR5cGVzKSB7XG4gICAgICBtYXNrZWRDb250ZXh0W2NvbnRleHROYW1lXSA9IGNvbnRleHRbY29udGV4dE5hbWVdO1xuICAgIH1cbiAgICByZXR1cm4gbWFza2VkQ29udGV4dDtcbiAgfSxcblxuICAvKipcbiAgICogRmlsdGVycyB0aGUgY29udGV4dCBvYmplY3QgdG8gb25seSBjb250YWluIGtleXMgc3BlY2lmaWVkIGluXG4gICAqIGBjb250ZXh0VHlwZXNgLCBhbmQgYXNzZXJ0cyB0aGF0IHRoZXkgYXJlIHZhbGlkLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dFxuICAgKiBAcmV0dXJuIHs/b2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3Byb2Nlc3NDb250ZXh0OiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIHZhciBtYXNrZWRDb250ZXh0ID0gdGhpcy5fbWFza0NvbnRleHQoY29udGV4dCk7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhciBDb21wb25lbnQgPSB0aGlzLl9jdXJyZW50RWxlbWVudC50eXBlO1xuICAgICAgaWYgKENvbXBvbmVudC5jb250ZXh0VHlwZXMpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tQcm9wVHlwZXMoQ29tcG9uZW50LmNvbnRleHRUeXBlcywgbWFza2VkQ29udGV4dCwgUmVhY3RQcm9wVHlwZUxvY2F0aW9ucy5jb250ZXh0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hc2tlZENvbnRleHQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjdXJyZW50Q29udGV4dFxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcHJvY2Vzc0NoaWxkQ29udGV4dDogZnVuY3Rpb24gKGN1cnJlbnRDb250ZXh0KSB7XG4gICAgdmFyIENvbXBvbmVudCA9IHRoaXMuX2N1cnJlbnRFbGVtZW50LnR5cGU7XG4gICAgdmFyIGluc3QgPSB0aGlzLl9pbnN0YW5jZTtcbiAgICB2YXIgY2hpbGRDb250ZXh0ID0gaW5zdC5nZXRDaGlsZENvbnRleHQgJiYgaW5zdC5nZXRDaGlsZENvbnRleHQoKTtcbiAgICBpZiAoY2hpbGRDb250ZXh0KSB7XG4gICAgICAhKHR5cGVvZiBDb21wb25lbnQuY2hpbGRDb250ZXh0VHlwZXMgPT09ICdvYmplY3QnKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICclcy5nZXRDaGlsZENvbnRleHQoKTogY2hpbGRDb250ZXh0VHlwZXMgbXVzdCBiZSBkZWZpbmVkIGluIG9yZGVyIHRvICcgKyAndXNlIGdldENoaWxkQ29udGV4dCgpLicsIHRoaXMuZ2V0TmFtZSgpIHx8ICdSZWFjdENvbXBvc2l0ZUNvbXBvbmVudCcpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIHRoaXMuX2NoZWNrUHJvcFR5cGVzKENvbXBvbmVudC5jaGlsZENvbnRleHRUeXBlcywgY2hpbGRDb250ZXh0LCBSZWFjdFByb3BUeXBlTG9jYXRpb25zLmNoaWxkQ29udGV4dCk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBuYW1lIGluIGNoaWxkQ29udGV4dCkge1xuICAgICAgICAhKG5hbWUgaW4gQ29tcG9uZW50LmNoaWxkQ29udGV4dFR5cGVzKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICclcy5nZXRDaGlsZENvbnRleHQoKToga2V5IFwiJXNcIiBpcyBub3QgZGVmaW5lZCBpbiBjaGlsZENvbnRleHRUeXBlcy4nLCB0aGlzLmdldE5hbWUoKSB8fCAnUmVhY3RDb21wb3NpdGVDb21wb25lbnQnLCBuYW1lKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gYXNzaWduKHt9LCBjdXJyZW50Q29udGV4dCwgY2hpbGRDb250ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIGN1cnJlbnRDb250ZXh0O1xuICB9LFxuXG4gIC8qKlxuICAgKiBQcm9jZXNzZXMgcHJvcHMgYnkgc2V0dGluZyBkZWZhdWx0IHZhbHVlcyBmb3IgdW5zcGVjaWZpZWQgcHJvcHMgYW5kXG4gICAqIGFzc2VydGluZyB0aGF0IHRoZSBwcm9wcyBhcmUgdmFsaWQuIERvZXMgbm90IG11dGF0ZSBpdHMgYXJndW1lbnQ7IHJldHVybnNcbiAgICogYSBuZXcgcHJvcHMgb2JqZWN0IHdpdGggZGVmYXVsdHMgbWVyZ2VkIGluLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gbmV3UHJvcHNcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3Byb2Nlc3NQcm9wczogZnVuY3Rpb24gKG5ld1Byb3BzKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhciBDb21wb25lbnQgPSB0aGlzLl9jdXJyZW50RWxlbWVudC50eXBlO1xuICAgICAgaWYgKENvbXBvbmVudC5wcm9wVHlwZXMpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tQcm9wVHlwZXMoQ29tcG9uZW50LnByb3BUeXBlcywgbmV3UHJvcHMsIFJlYWN0UHJvcFR5cGVMb2NhdGlvbnMucHJvcCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdQcm9wcztcbiAgfSxcblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgdGhlIHByb3BzIGFyZSB2YWxpZFxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcFR5cGVzIE1hcCBvZiBwcm9wIG5hbWUgdG8gYSBSZWFjdFByb3BUeXBlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gZS5nLiBcInByb3BcIiwgXCJjb250ZXh0XCIsIFwiY2hpbGQgY29udGV4dFwiXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2hlY2tQcm9wVHlwZXM6IGZ1bmN0aW9uIChwcm9wVHlwZXMsIHByb3BzLCBsb2NhdGlvbikge1xuICAgIC8vIFRPRE86IFN0b3AgdmFsaWRhdGluZyBwcm9wIHR5cGVzIGhlcmUgYW5kIG9ubHkgdXNlIHRoZSBlbGVtZW50XG4gICAgLy8gdmFsaWRhdGlvbi5cbiAgICB2YXIgY29tcG9uZW50TmFtZSA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgIGZvciAodmFyIHByb3BOYW1lIGluIHByb3BUeXBlcykge1xuICAgICAgaWYgKHByb3BUeXBlcy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgaW50ZW50aW9uYWxseSBhbiBpbnZhcmlhbnQgdGhhdCBnZXRzIGNhdWdodC4gSXQncyB0aGUgc2FtZVxuICAgICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgICAhKHR5cGVvZiBwcm9wVHlwZXNbcHJvcE5hbWVdID09PSAnZnVuY3Rpb24nKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICclczogJXMgdHlwZSBgJXNgIGlzIGludmFsaWQ7IGl0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSAnICsgJ2Zyb20gUmVhY3QuUHJvcFR5cGVzLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dLCBwcm9wTmFtZSkgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgICAgICAgIGVycm9yID0gcHJvcFR5cGVzW3Byb3BOYW1lXShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uKTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgLy8gV2UgbWF5IHdhbnQgdG8gZXh0ZW5kIHRoaXMgbG9naWMgZm9yIHNpbWlsYXIgZXJyb3JzIGluXG4gICAgICAgICAgLy8gdG9wLWxldmVsIHJlbmRlciBjYWxscywgc28gSSdtIGFic3RyYWN0aW5nIGl0IGF3YXkgaW50b1xuICAgICAgICAgIC8vIGEgZnVuY3Rpb24gdG8gbWluaW1pemUgcmVmYWN0b3JpbmcgaW4gdGhlIGZ1dHVyZVxuICAgICAgICAgIHZhciBhZGRlbmR1bSA9IGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSh0aGlzKTtcblxuICAgICAgICAgIGlmIChsb2NhdGlvbiA9PT0gUmVhY3RQcm9wVHlwZUxvY2F0aW9ucy5wcm9wKSB7XG4gICAgICAgICAgICAvLyBQcmVmYWNlIGdpdmVzIHVzIHNvbWV0aGluZyB0byBibGFja2xpc3QgaW4gd2FybmluZyBtb2R1bGVcbiAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnRmFpbGVkIENvbXBvc2l0ZSBwcm9wVHlwZTogJXMlcycsIGVycm9yLm1lc3NhZ2UsIGFkZGVuZHVtKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdGYWlsZWQgQ29udGV4dCBUeXBlczogJXMlcycsIGVycm9yLm1lc3NhZ2UsIGFkZGVuZHVtKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgcmVjZWl2ZUNvbXBvbmVudDogZnVuY3Rpb24gKG5leHRFbGVtZW50LCB0cmFuc2FjdGlvbiwgbmV4dENvbnRleHQpIHtcbiAgICB2YXIgcHJldkVsZW1lbnQgPSB0aGlzLl9jdXJyZW50RWxlbWVudDtcbiAgICB2YXIgcHJldkNvbnRleHQgPSB0aGlzLl9jb250ZXh0O1xuXG4gICAgdGhpcy5fcGVuZGluZ0VsZW1lbnQgPSBudWxsO1xuXG4gICAgdGhpcy51cGRhdGVDb21wb25lbnQodHJhbnNhY3Rpb24sIHByZXZFbGVtZW50LCBuZXh0RWxlbWVudCwgcHJldkNvbnRleHQsIG5leHRDb250ZXh0KTtcbiAgfSxcblxuICAvKipcbiAgICogSWYgYW55IG9mIGBfcGVuZGluZ0VsZW1lbnRgLCBgX3BlbmRpbmdTdGF0ZVF1ZXVlYCwgb3IgYF9wZW5kaW5nRm9yY2VVcGRhdGVgXG4gICAqIGlzIHNldCwgdXBkYXRlIHRoZSBjb21wb25lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RSZWNvbmNpbGVUcmFuc2FjdGlvbn0gdHJhbnNhY3Rpb25cbiAgICogQGludGVybmFsXG4gICAqL1xuICBwZXJmb3JtVXBkYXRlSWZOZWNlc3Nhcnk6IGZ1bmN0aW9uICh0cmFuc2FjdGlvbikge1xuICAgIGlmICh0aGlzLl9wZW5kaW5nRWxlbWVudCAhPSBudWxsKSB7XG4gICAgICBSZWFjdFJlY29uY2lsZXIucmVjZWl2ZUNvbXBvbmVudCh0aGlzLCB0aGlzLl9wZW5kaW5nRWxlbWVudCB8fCB0aGlzLl9jdXJyZW50RWxlbWVudCwgdHJhbnNhY3Rpb24sIHRoaXMuX2NvbnRleHQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wZW5kaW5nU3RhdGVRdWV1ZSAhPT0gbnVsbCB8fCB0aGlzLl9wZW5kaW5nRm9yY2VVcGRhdGUpIHtcbiAgICAgIHRoaXMudXBkYXRlQ29tcG9uZW50KHRyYW5zYWN0aW9uLCB0aGlzLl9jdXJyZW50RWxlbWVudCwgdGhpcy5fY3VycmVudEVsZW1lbnQsIHRoaXMuX2NvbnRleHQsIHRoaXMuX2NvbnRleHQpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUGVyZm9ybSBhbiB1cGRhdGUgdG8gYSBtb3VudGVkIGNvbXBvbmVudC4gVGhlIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgYW5kXG4gICAqIHNob3VsZENvbXBvbmVudFVwZGF0ZSBtZXRob2RzIGFyZSBjYWxsZWQsIHRoZW4gKGFzc3VtaW5nIHRoZSB1cGRhdGUgaXNuJ3RcbiAgICogc2tpcHBlZCkgdGhlIHJlbWFpbmluZyB1cGRhdGUgbGlmZWN5Y2xlIG1ldGhvZHMgYXJlIGNhbGxlZCBhbmQgdGhlIERPTVxuICAgKiByZXByZXNlbnRhdGlvbiBpcyB1cGRhdGVkLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCB0aGlzIGltcGxlbWVudHMgUmVhY3QncyByZW5kZXJpbmcgYW5kIHJlY29uY2lsaWF0aW9uIGFsZ29yaXRobS5cbiAgICogU29waGlzdGljYXRlZCBjbGllbnRzIG1heSB3aXNoIHRvIG92ZXJyaWRlIHRoaXMuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RSZWNvbmNpbGVUcmFuc2FjdGlvbn0gdHJhbnNhY3Rpb25cbiAgICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IHByZXZQYXJlbnRFbGVtZW50XG4gICAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBuZXh0UGFyZW50RWxlbWVudFxuICAgKiBAaW50ZXJuYWxcbiAgICogQG92ZXJyaWRhYmxlXG4gICAqL1xuICB1cGRhdGVDb21wb25lbnQ6IGZ1bmN0aW9uICh0cmFuc2FjdGlvbiwgcHJldlBhcmVudEVsZW1lbnQsIG5leHRQYXJlbnRFbGVtZW50LCBwcmV2VW5tYXNrZWRDb250ZXh0LCBuZXh0VW5tYXNrZWRDb250ZXh0KSB7XG4gICAgdmFyIGluc3QgPSB0aGlzLl9pbnN0YW5jZTtcblxuICAgIHZhciBuZXh0Q29udGV4dCA9IHRoaXMuX2NvbnRleHQgPT09IG5leHRVbm1hc2tlZENvbnRleHQgPyBpbnN0LmNvbnRleHQgOiB0aGlzLl9wcm9jZXNzQ29udGV4dChuZXh0VW5tYXNrZWRDb250ZXh0KTtcbiAgICB2YXIgbmV4dFByb3BzO1xuXG4gICAgLy8gRGlzdGluZ3Vpc2ggYmV0d2VlbiBhIHByb3BzIHVwZGF0ZSB2ZXJzdXMgYSBzaW1wbGUgc3RhdGUgdXBkYXRlXG4gICAgaWYgKHByZXZQYXJlbnRFbGVtZW50ID09PSBuZXh0UGFyZW50RWxlbWVudCkge1xuICAgICAgLy8gU2tpcCBjaGVja2luZyBwcm9wIHR5cGVzIGFnYWluIC0tIHdlIGRvbid0IHJlYWQgaW5zdC5wcm9wcyB0byBhdm9pZFxuICAgICAgLy8gd2FybmluZyBmb3IgRE9NIGNvbXBvbmVudCBwcm9wcyBpbiB0aGlzIHVwZ3JhZGVcbiAgICAgIG5leHRQcm9wcyA9IG5leHRQYXJlbnRFbGVtZW50LnByb3BzO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0UHJvcHMgPSB0aGlzLl9wcm9jZXNzUHJvcHMobmV4dFBhcmVudEVsZW1lbnQucHJvcHMpO1xuICAgICAgLy8gQW4gdXBkYXRlIGhlcmUgd2lsbCBzY2hlZHVsZSBhbiB1cGRhdGUgYnV0IGltbWVkaWF0ZWx5IHNldFxuICAgICAgLy8gX3BlbmRpbmdTdGF0ZVF1ZXVlIHdoaWNoIHdpbGwgZW5zdXJlIHRoYXQgYW55IHN0YXRlIHVwZGF0ZXMgZ2V0c1xuICAgICAgLy8gaW1tZWRpYXRlbHkgcmVjb25jaWxlZCBpbnN0ZWFkIG9mIHdhaXRpbmcgZm9yIHRoZSBuZXh0IGJhdGNoLlxuXG4gICAgICBpZiAoaW5zdC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKSB7XG4gICAgICAgIGluc3QuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMsIG5leHRDb250ZXh0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbmV4dFN0YXRlID0gdGhpcy5fcHJvY2Vzc1BlbmRpbmdTdGF0ZShuZXh0UHJvcHMsIG5leHRDb250ZXh0KTtcblxuICAgIHZhciBzaG91bGRVcGRhdGUgPSB0aGlzLl9wZW5kaW5nRm9yY2VVcGRhdGUgfHwgIWluc3Quc2hvdWxkQ29tcG9uZW50VXBkYXRlIHx8IGluc3Quc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlLCBuZXh0Q29udGV4dCk7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcodHlwZW9mIHNob3VsZFVwZGF0ZSAhPT0gJ3VuZGVmaW5lZCcsICclcy5zaG91bGRDb21wb25lbnRVcGRhdGUoKTogUmV0dXJuZWQgdW5kZWZpbmVkIGluc3RlYWQgb2YgYSAnICsgJ2Jvb2xlYW4gdmFsdWUuIE1ha2Ugc3VyZSB0byByZXR1cm4gdHJ1ZSBvciBmYWxzZS4nLCB0aGlzLmdldE5hbWUoKSB8fCAnUmVhY3RDb21wb3NpdGVDb21wb25lbnQnKSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoc2hvdWxkVXBkYXRlKSB7XG4gICAgICB0aGlzLl9wZW5kaW5nRm9yY2VVcGRhdGUgPSBmYWxzZTtcbiAgICAgIC8vIFdpbGwgc2V0IGB0aGlzLnByb3BzYCwgYHRoaXMuc3RhdGVgIGFuZCBgdGhpcy5jb250ZXh0YC5cbiAgICAgIHRoaXMuX3BlcmZvcm1Db21wb25lbnRVcGRhdGUobmV4dFBhcmVudEVsZW1lbnQsIG5leHRQcm9wcywgbmV4dFN0YXRlLCBuZXh0Q29udGV4dCwgdHJhbnNhY3Rpb24sIG5leHRVbm1hc2tlZENvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBpdCdzIGRldGVybWluZWQgdGhhdCBhIGNvbXBvbmVudCBzaG91bGQgbm90IHVwZGF0ZSwgd2Ugc3RpbGwgd2FudFxuICAgICAgLy8gdG8gc2V0IHByb3BzIGFuZCBzdGF0ZSBidXQgd2Ugc2hvcnRjdXQgdGhlIHJlc3Qgb2YgdGhlIHVwZGF0ZS5cbiAgICAgIHRoaXMuX2N1cnJlbnRFbGVtZW50ID0gbmV4dFBhcmVudEVsZW1lbnQ7XG4gICAgICB0aGlzLl9jb250ZXh0ID0gbmV4dFVubWFza2VkQ29udGV4dDtcbiAgICAgIGluc3QucHJvcHMgPSBuZXh0UHJvcHM7XG4gICAgICBpbnN0LnN0YXRlID0gbmV4dFN0YXRlO1xuICAgICAgaW5zdC5jb250ZXh0ID0gbmV4dENvbnRleHQ7XG4gICAgfVxuICB9LFxuXG4gIF9wcm9jZXNzUGVuZGluZ1N0YXRlOiBmdW5jdGlvbiAocHJvcHMsIGNvbnRleHQpIHtcbiAgICB2YXIgaW5zdCA9IHRoaXMuX2luc3RhbmNlO1xuICAgIHZhciBxdWV1ZSA9IHRoaXMuX3BlbmRpbmdTdGF0ZVF1ZXVlO1xuICAgIHZhciByZXBsYWNlID0gdGhpcy5fcGVuZGluZ1JlcGxhY2VTdGF0ZTtcbiAgICB0aGlzLl9wZW5kaW5nUmVwbGFjZVN0YXRlID0gZmFsc2U7XG4gICAgdGhpcy5fcGVuZGluZ1N0YXRlUXVldWUgPSBudWxsO1xuXG4gICAgaWYgKCFxdWV1ZSkge1xuICAgICAgcmV0dXJuIGluc3Quc3RhdGU7XG4gICAgfVxuXG4gICAgaWYgKHJlcGxhY2UgJiYgcXVldWUubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gcXVldWVbMF07XG4gICAgfVxuXG4gICAgdmFyIG5leHRTdGF0ZSA9IGFzc2lnbih7fSwgcmVwbGFjZSA/IHF1ZXVlWzBdIDogaW5zdC5zdGF0ZSk7XG4gICAgZm9yICh2YXIgaSA9IHJlcGxhY2UgPyAxIDogMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcGFydGlhbCA9IHF1ZXVlW2ldO1xuICAgICAgYXNzaWduKG5leHRTdGF0ZSwgdHlwZW9mIHBhcnRpYWwgPT09ICdmdW5jdGlvbicgPyBwYXJ0aWFsLmNhbGwoaW5zdCwgbmV4dFN0YXRlLCBwcm9wcywgY29udGV4dCkgOiBwYXJ0aWFsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dFN0YXRlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBNZXJnZXMgbmV3IHByb3BzIGFuZCBzdGF0ZSwgbm90aWZpZXMgZGVsZWdhdGUgbWV0aG9kcyBvZiB1cGRhdGUgYW5kXG4gICAqIHBlcmZvcm1zIHVwZGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IG5leHRFbGVtZW50IE5leHQgZWxlbWVudFxuICAgKiBAcGFyYW0ge29iamVjdH0gbmV4dFByb3BzIE5leHQgcHVibGljIG9iamVjdCB0byBzZXQgYXMgcHJvcGVydGllcy5cbiAgICogQHBhcmFtIHs/b2JqZWN0fSBuZXh0U3RhdGUgTmV4dCBvYmplY3QgdG8gc2V0IGFzIHN0YXRlLlxuICAgKiBAcGFyYW0gez9vYmplY3R9IG5leHRDb250ZXh0IE5leHQgcHVibGljIG9iamVjdCB0byBzZXQgYXMgY29udGV4dC5cbiAgICogQHBhcmFtIHtSZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9ufSB0cmFuc2FjdGlvblxuICAgKiBAcGFyYW0gez9vYmplY3R9IHVubWFza2VkQ29udGV4dFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3BlcmZvcm1Db21wb25lbnRVcGRhdGU6IGZ1bmN0aW9uIChuZXh0RWxlbWVudCwgbmV4dFByb3BzLCBuZXh0U3RhdGUsIG5leHRDb250ZXh0LCB0cmFuc2FjdGlvbiwgdW5tYXNrZWRDb250ZXh0KSB7XG4gICAgdmFyIGluc3QgPSB0aGlzLl9pbnN0YW5jZTtcblxuICAgIHZhciBoYXNDb21wb25lbnREaWRVcGRhdGUgPSBCb29sZWFuKGluc3QuY29tcG9uZW50RGlkVXBkYXRlKTtcbiAgICB2YXIgcHJldlByb3BzO1xuICAgIHZhciBwcmV2U3RhdGU7XG4gICAgdmFyIHByZXZDb250ZXh0O1xuICAgIGlmIChoYXNDb21wb25lbnREaWRVcGRhdGUpIHtcbiAgICAgIHByZXZQcm9wcyA9IGluc3QucHJvcHM7XG4gICAgICBwcmV2U3RhdGUgPSBpbnN0LnN0YXRlO1xuICAgICAgcHJldkNvbnRleHQgPSBpbnN0LmNvbnRleHQ7XG4gICAgfVxuXG4gICAgaWYgKGluc3QuY29tcG9uZW50V2lsbFVwZGF0ZSkge1xuICAgICAgaW5zdC5jb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlLCBuZXh0Q29udGV4dCk7XG4gICAgfVxuXG4gICAgdGhpcy5fY3VycmVudEVsZW1lbnQgPSBuZXh0RWxlbWVudDtcbiAgICB0aGlzLl9jb250ZXh0ID0gdW5tYXNrZWRDb250ZXh0O1xuICAgIGluc3QucHJvcHMgPSBuZXh0UHJvcHM7XG4gICAgaW5zdC5zdGF0ZSA9IG5leHRTdGF0ZTtcbiAgICBpbnN0LmNvbnRleHQgPSBuZXh0Q29udGV4dDtcblxuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmVkQ29tcG9uZW50KHRyYW5zYWN0aW9uLCB1bm1hc2tlZENvbnRleHQpO1xuXG4gICAgaWYgKGhhc0NvbXBvbmVudERpZFVwZGF0ZSkge1xuICAgICAgdHJhbnNhY3Rpb24uZ2V0UmVhY3RNb3VudFJlYWR5KCkuZW5xdWV1ZShpbnN0LmNvbXBvbmVudERpZFVwZGF0ZS5iaW5kKGluc3QsIHByZXZQcm9wcywgcHJldlN0YXRlLCBwcmV2Q29udGV4dCksIGluc3QpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ2FsbCB0aGUgY29tcG9uZW50J3MgYHJlbmRlcmAgbWV0aG9kIGFuZCB1cGRhdGUgdGhlIERPTSBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9ufSB0cmFuc2FjdGlvblxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF91cGRhdGVSZW5kZXJlZENvbXBvbmVudDogZnVuY3Rpb24gKHRyYW5zYWN0aW9uLCBjb250ZXh0KSB7XG4gICAgdmFyIHByZXZDb21wb25lbnRJbnN0YW5jZSA9IHRoaXMuX3JlbmRlcmVkQ29tcG9uZW50O1xuICAgIHZhciBwcmV2UmVuZGVyZWRFbGVtZW50ID0gcHJldkNvbXBvbmVudEluc3RhbmNlLl9jdXJyZW50RWxlbWVudDtcbiAgICB2YXIgbmV4dFJlbmRlcmVkRWxlbWVudCA9IHRoaXMuX3JlbmRlclZhbGlkYXRlZENvbXBvbmVudCgpO1xuICAgIGlmIChzaG91bGRVcGRhdGVSZWFjdENvbXBvbmVudChwcmV2UmVuZGVyZWRFbGVtZW50LCBuZXh0UmVuZGVyZWRFbGVtZW50KSkge1xuICAgICAgUmVhY3RSZWNvbmNpbGVyLnJlY2VpdmVDb21wb25lbnQocHJldkNvbXBvbmVudEluc3RhbmNlLCBuZXh0UmVuZGVyZWRFbGVtZW50LCB0cmFuc2FjdGlvbiwgdGhpcy5fcHJvY2Vzc0NoaWxkQ29udGV4dChjb250ZXh0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZXNlIHR3byBJRHMgYXJlIGFjdHVhbGx5IHRoZSBzYW1lISBCdXQgbm90aGluZyBzaG91bGQgcmVseSBvbiB0aGF0LlxuICAgICAgdmFyIHRoaXNJRCA9IHRoaXMuX3Jvb3ROb2RlSUQ7XG4gICAgICB2YXIgcHJldkNvbXBvbmVudElEID0gcHJldkNvbXBvbmVudEluc3RhbmNlLl9yb290Tm9kZUlEO1xuICAgICAgUmVhY3RSZWNvbmNpbGVyLnVubW91bnRDb21wb25lbnQocHJldkNvbXBvbmVudEluc3RhbmNlKTtcblxuICAgICAgdGhpcy5fcmVuZGVyZWRDb21wb25lbnQgPSB0aGlzLl9pbnN0YW50aWF0ZVJlYWN0Q29tcG9uZW50KG5leHRSZW5kZXJlZEVsZW1lbnQpO1xuICAgICAgdmFyIG5leHRNYXJrdXAgPSBSZWFjdFJlY29uY2lsZXIubW91bnRDb21wb25lbnQodGhpcy5fcmVuZGVyZWRDb21wb25lbnQsIHRoaXNJRCwgdHJhbnNhY3Rpb24sIHRoaXMuX3Byb2Nlc3NDaGlsZENvbnRleHQoY29udGV4dCkpO1xuICAgICAgdGhpcy5fcmVwbGFjZU5vZGVXaXRoTWFya3VwQnlJRChwcmV2Q29tcG9uZW50SUQsIG5leHRNYXJrdXApO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHByb3RlY3RlZFxuICAgKi9cbiAgX3JlcGxhY2VOb2RlV2l0aE1hcmt1cEJ5SUQ6IGZ1bmN0aW9uIChwcmV2Q29tcG9uZW50SUQsIG5leHRNYXJrdXApIHtcbiAgICBSZWFjdENvbXBvbmVudEVudmlyb25tZW50LnJlcGxhY2VOb2RlV2l0aE1hcmt1cEJ5SUQocHJldkNvbXBvbmVudElELCBuZXh0TWFya3VwKTtcbiAgfSxcblxuICAvKipcbiAgICogQHByb3RlY3RlZFxuICAgKi9cbiAgX3JlbmRlclZhbGlkYXRlZENvbXBvbmVudFdpdGhvdXRPd25lck9yQ29udGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpbnN0ID0gdGhpcy5faW5zdGFuY2U7XG4gICAgdmFyIHJlbmRlcmVkQ29tcG9uZW50ID0gaW5zdC5yZW5kZXIoKTtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLy8gV2UgYWxsb3cgYXV0by1tb2NrcyB0byBwcm9jZWVkIGFzIGlmIHRoZXkncmUgcmV0dXJuaW5nIG51bGwuXG4gICAgICBpZiAodHlwZW9mIHJlbmRlcmVkQ29tcG9uZW50ID09PSAndW5kZWZpbmVkJyAmJiBpbnN0LnJlbmRlci5faXNNb2NrRnVuY3Rpb24pIHtcbiAgICAgICAgLy8gVGhpcyBpcyBwcm9iYWJseSBiYWQgcHJhY3RpY2UuIENvbnNpZGVyIHdhcm5pbmcgaGVyZSBhbmRcbiAgICAgICAgLy8gZGVwcmVjYXRpbmcgdGhpcyBjb252ZW5pZW5jZS5cbiAgICAgICAgcmVuZGVyZWRDb21wb25lbnQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZW5kZXJlZENvbXBvbmVudDtcbiAgfSxcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9yZW5kZXJWYWxpZGF0ZWRDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVuZGVyZWRDb21wb25lbnQ7XG4gICAgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCA9IHRoaXM7XG4gICAgdHJ5IHtcbiAgICAgIHJlbmRlcmVkQ29tcG9uZW50ID0gdGhpcy5fcmVuZGVyVmFsaWRhdGVkQ29tcG9uZW50V2l0aG91dE93bmVyT3JDb250ZXh0KCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQgPSBudWxsO1xuICAgIH1cbiAgICAhKFxuICAgIC8vIFRPRE86IEFuIGBpc1ZhbGlkTm9kZWAgZnVuY3Rpb24gd291bGQgcHJvYmFibHkgYmUgbW9yZSBhcHByb3ByaWF0ZVxuICAgIHJlbmRlcmVkQ29tcG9uZW50ID09PSBudWxsIHx8IHJlbmRlcmVkQ29tcG9uZW50ID09PSBmYWxzZSB8fCBSZWFjdEVsZW1lbnQuaXNWYWxpZEVsZW1lbnQocmVuZGVyZWRDb21wb25lbnQpKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICclcy5yZW5kZXIoKTogQSB2YWxpZCBSZWFjdENvbXBvbmVudCBtdXN0IGJlIHJldHVybmVkLiBZb3UgbWF5IGhhdmUgJyArICdyZXR1cm5lZCB1bmRlZmluZWQsIGFuIGFycmF5IG9yIHNvbWUgb3RoZXIgaW52YWxpZCBvYmplY3QuJywgdGhpcy5nZXROYW1lKCkgfHwgJ1JlYWN0Q29tcG9zaXRlQ29tcG9uZW50JykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiByZW5kZXJlZENvbXBvbmVudDtcbiAgfSxcblxuICAvKipcbiAgICogTGF6aWx5IGFsbG9jYXRlcyB0aGUgcmVmcyBvYmplY3QgYW5kIHN0b3JlcyBgY29tcG9uZW50YCBhcyBgcmVmYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlZiBSZWZlcmVuY2UgbmFtZS5cbiAgICogQHBhcmFtIHtjb21wb25lbnR9IGNvbXBvbmVudCBDb21wb25lbnQgdG8gc3RvcmUgYXMgYHJlZmAuXG4gICAqIEBmaW5hbFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXR0YWNoUmVmOiBmdW5jdGlvbiAocmVmLCBjb21wb25lbnQpIHtcbiAgICB2YXIgaW5zdCA9IHRoaXMuZ2V0UHVibGljSW5zdGFuY2UoKTtcbiAgICAhKGluc3QgIT0gbnVsbCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnU3RhdGVsZXNzIGZ1bmN0aW9uIGNvbXBvbmVudHMgY2Fubm90IGhhdmUgcmVmcy4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgdmFyIHB1YmxpY0NvbXBvbmVudEluc3RhbmNlID0gY29tcG9uZW50LmdldFB1YmxpY0luc3RhbmNlKCk7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhciBjb21wb25lbnROYW1lID0gY29tcG9uZW50ICYmIGNvbXBvbmVudC5nZXROYW1lID8gY29tcG9uZW50LmdldE5hbWUoKSA6ICdhIGNvbXBvbmVudCc7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhwdWJsaWNDb21wb25lbnRJbnN0YW5jZSAhPSBudWxsLCAnU3RhdGVsZXNzIGZ1bmN0aW9uIGNvbXBvbmVudHMgY2Fubm90IGJlIGdpdmVuIHJlZnMgJyArICcoU2VlIHJlZiBcIiVzXCIgaW4gJXMgY3JlYXRlZCBieSAlcykuICcgKyAnQXR0ZW1wdHMgdG8gYWNjZXNzIHRoaXMgcmVmIHdpbGwgZmFpbC4nLCByZWYsIGNvbXBvbmVudE5hbWUsIHRoaXMuZ2V0TmFtZSgpKSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdmFyIHJlZnMgPSBpbnN0LnJlZnMgPT09IGVtcHR5T2JqZWN0ID8gaW5zdC5yZWZzID0ge30gOiBpbnN0LnJlZnM7XG4gICAgcmVmc1tyZWZdID0gcHVibGljQ29tcG9uZW50SW5zdGFuY2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIERldGFjaGVzIGEgcmVmZXJlbmNlIG5hbWUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWYgTmFtZSB0byBkZXJlZmVyZW5jZS5cbiAgICogQGZpbmFsXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZXRhY2hSZWY6IGZ1bmN0aW9uIChyZWYpIHtcbiAgICB2YXIgcmVmcyA9IHRoaXMuZ2V0UHVibGljSW5zdGFuY2UoKS5yZWZzO1xuICAgIGRlbGV0ZSByZWZzW3JlZl07XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBhIHRleHQgZGVzY3JpcHRpb24gb2YgdGhlIGNvbXBvbmVudCB0aGF0IGNhbiBiZSB1c2VkIHRvIGlkZW50aWZ5IGl0XG4gICAqIGluIGVycm9yIG1lc3NhZ2VzLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBuYW1lIG9yIG51bGwuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZ2V0TmFtZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0eXBlID0gdGhpcy5fY3VycmVudEVsZW1lbnQudHlwZTtcbiAgICB2YXIgY29uc3RydWN0b3IgPSB0aGlzLl9pbnN0YW5jZSAmJiB0aGlzLl9pbnN0YW5jZS5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gdHlwZS5kaXNwbGF5TmFtZSB8fCBjb25zdHJ1Y3RvciAmJiBjb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgY29uc3RydWN0b3IgJiYgY29uc3RydWN0b3IubmFtZSB8fCBudWxsO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHB1YmxpY2x5IGFjY2Vzc2libGUgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBjb21wb25lbnQgLSBpLmUuIHdoYXRcbiAgICogaXMgZXhwb3NlZCBieSByZWZzIGFuZCByZXR1cm5lZCBieSByZW5kZXIuIENhbiBiZSBudWxsIGZvciBzdGF0ZWxlc3NcbiAgICogY29tcG9uZW50cy5cbiAgICpcbiAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnR9IHRoZSBwdWJsaWMgY29tcG9uZW50IGluc3RhbmNlLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGdldFB1YmxpY0luc3RhbmNlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGluc3QgPSB0aGlzLl9pbnN0YW5jZTtcbiAgICBpZiAoaW5zdCBpbnN0YW5jZW9mIFN0YXRlbGVzc0NvbXBvbmVudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBpbnN0O1xuICB9LFxuXG4gIC8vIFN0dWJcbiAgX2luc3RhbnRpYXRlUmVhY3RDb21wb25lbnQ6IG51bGxcblxufTtcblxuUmVhY3RQZXJmLm1lYXN1cmVNZXRob2RzKFJlYWN0Q29tcG9zaXRlQ29tcG9uZW50TWl4aW4sICdSZWFjdENvbXBvc2l0ZUNvbXBvbmVudCcsIHtcbiAgbW91bnRDb21wb25lbnQ6ICdtb3VudENvbXBvbmVudCcsXG4gIHVwZGF0ZUNvbXBvbmVudDogJ3VwZGF0ZUNvbXBvbmVudCcsXG4gIF9yZW5kZXJWYWxpZGF0ZWRDb21wb25lbnQ6ICdfcmVuZGVyVmFsaWRhdGVkQ29tcG9uZW50J1xufSk7XG5cbnZhciBSZWFjdENvbXBvc2l0ZUNvbXBvbmVudCA9IHtcblxuICBNaXhpbjogUmVhY3RDb21wb3NpdGVDb21wb25lbnRNaXhpblxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0Q29tcG9zaXRlQ29tcG9uZW50OyJdfQ==