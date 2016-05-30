/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactMount
 */

'use strict';

var DOMProperty = require('./DOMProperty');
var ReactBrowserEventEmitter = require('./ReactBrowserEventEmitter');
var ReactCurrentOwner = require('./ReactCurrentOwner');
var ReactDOMFeatureFlags = require('./ReactDOMFeatureFlags');
var ReactElement = require('./ReactElement');
var ReactEmptyComponentRegistry = require('./ReactEmptyComponentRegistry');
var ReactInstanceHandles = require('./ReactInstanceHandles');
var ReactInstanceMap = require('./ReactInstanceMap');
var ReactMarkupChecksum = require('./ReactMarkupChecksum');
var ReactPerf = require('./ReactPerf');
var ReactReconciler = require('./ReactReconciler');
var ReactUpdateQueue = require('./ReactUpdateQueue');
var ReactUpdates = require('./ReactUpdates');

var assign = require('./Object.assign');
var emptyObject = require('fbjs/lib/emptyObject');
var containsNode = require('fbjs/lib/containsNode');
var instantiateReactComponent = require('./instantiateReactComponent');
var invariant = require('fbjs/lib/invariant');
var setInnerHTML = require('./setInnerHTML');
var shouldUpdateReactComponent = require('./shouldUpdateReactComponent');
var validateDOMNesting = require('./validateDOMNesting');
var warning = require('fbjs/lib/warning');

var ATTR_NAME = DOMProperty.ID_ATTRIBUTE_NAME;
var nodeCache = {};

var ELEMENT_NODE_TYPE = 1;
var DOC_NODE_TYPE = 9;
var DOCUMENT_FRAGMENT_NODE_TYPE = 11;

var ownerDocumentContextKey = '__ReactMount_ownerDocument$' + Math.random().toString(36).slice(2);

/** Mapping from reactRootID to React component instance. */
var instancesByReactRootID = {};

/** Mapping from reactRootID to `container` nodes. */
var containersByReactRootID = {};

if (process.env.NODE_ENV !== 'production') {
  /** __DEV__-only mapping from reactRootID to root elements. */
  var rootElementsByReactRootID = {};
}

// Used to store breadth-first search state in findComponentRoot.
var findComponentRootReusableArray = [];

/**
 * Finds the index of the first character
 * that's not common between the two given strings.
 *
 * @return {number} the index of the character where the strings diverge
 */
function firstDifferenceIndex(string1, string2) {
  var minLen = Math.min(string1.length, string2.length);
  for (var i = 0; i < minLen; i++) {
    if (string1.charAt(i) !== string2.charAt(i)) {
      return i;
    }
  }
  return string1.length === string2.length ? -1 : minLen;
}

/**
 * @param {DOMElement|DOMDocument} container DOM element that may contain
 * a React component
 * @return {?*} DOM element that may have the reactRoot ID, or null.
 */
function getReactRootElementInContainer(container) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOC_NODE_TYPE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}

/**
 * @param {DOMElement} container DOM element that may contain a React component.
 * @return {?string} A "reactRoot" ID, if a React component is rendered.
 */
function getReactRootID(container) {
  var rootElement = getReactRootElementInContainer(container);
  return rootElement && ReactMount.getID(rootElement);
}

/**
 * Accessing node[ATTR_NAME] or calling getAttribute(ATTR_NAME) on a form
 * element can return its control whose name or ID equals ATTR_NAME. All
 * DOM nodes support `getAttributeNode` but this can also get called on
 * other objects so just return '' if we're given something other than a
 * DOM node (such as window).
 *
 * @param {?DOMElement|DOMWindow|DOMDocument|DOMTextNode} node DOM node.
 * @return {string} ID of the supplied `domNode`.
 */
function getID(node) {
  var id = internalGetID(node);
  if (id) {
    if (nodeCache.hasOwnProperty(id)) {
      var cached = nodeCache[id];
      if (cached !== node) {
        !!isValid(cached, id) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactMount: Two valid but unequal nodes with the same `%s`: %s', ATTR_NAME, id) : invariant(false) : undefined;

        nodeCache[id] = node;
      }
    } else {
      nodeCache[id] = node;
    }
  }

  return id;
}

function internalGetID(node) {
  // If node is something like a window, document, or text node, none of
  // which support attributes or a .getAttribute method, gracefully return
  // the empty string, as if the attribute were missing.
  return node && node.getAttribute && node.getAttribute(ATTR_NAME) || '';
}

/**
 * Sets the React-specific ID of the given node.
 *
 * @param {DOMElement} node The DOM node whose ID will be set.
 * @param {string} id The value of the ID attribute.
 */
function setID(node, id) {
  var oldID = internalGetID(node);
  if (oldID !== id) {
    delete nodeCache[oldID];
  }
  node.setAttribute(ATTR_NAME, id);
  nodeCache[id] = node;
}

/**
 * Finds the node with the supplied React-generated DOM ID.
 *
 * @param {string} id A React-generated DOM ID.
 * @return {DOMElement} DOM node with the suppled `id`.
 * @internal
 */
function getNode(id) {
  if (!nodeCache.hasOwnProperty(id) || !isValid(nodeCache[id], id)) {
    nodeCache[id] = ReactMount.findReactNodeByID(id);
  }
  return nodeCache[id];
}

/**
 * Finds the node with the supplied public React instance.
 *
 * @param {*} instance A public React instance.
 * @return {?DOMElement} DOM node with the suppled `id`.
 * @internal
 */
function getNodeFromInstance(instance) {
  var id = ReactInstanceMap.get(instance)._rootNodeID;
  if (ReactEmptyComponentRegistry.isNullComponentID(id)) {
    return null;
  }
  if (!nodeCache.hasOwnProperty(id) || !isValid(nodeCache[id], id)) {
    nodeCache[id] = ReactMount.findReactNodeByID(id);
  }
  return nodeCache[id];
}

/**
 * A node is "valid" if it is contained by a currently mounted container.
 *
 * This means that the node does not have to be contained by a document in
 * order to be considered valid.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @param {string} id The expected ID of the node.
 * @return {boolean} Whether the node is contained by a mounted container.
 */
function isValid(node, id) {
  if (node) {
    !(internalGetID(node) === id) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactMount: Unexpected modification of `%s`', ATTR_NAME) : invariant(false) : undefined;

    var container = ReactMount.findReactContainerForID(id);
    if (container && containsNode(container, node)) {
      return true;
    }
  }

  return false;
}

/**
 * Causes the cache to forget about one React-specific ID.
 *
 * @param {string} id The ID to forget.
 */
function purgeID(id) {
  delete nodeCache[id];
}

var deepestNodeSoFar = null;
function findDeepestCachedAncestorImpl(ancestorID) {
  var ancestor = nodeCache[ancestorID];
  if (ancestor && isValid(ancestor, ancestorID)) {
    deepestNodeSoFar = ancestor;
  } else {
    // This node isn't populated in the cache, so presumably none of its
    // descendants are. Break out of the loop.
    return false;
  }
}

/**
 * Return the deepest cached node whose ID is a prefix of `targetID`.
 */
function findDeepestCachedAncestor(targetID) {
  deepestNodeSoFar = null;
  ReactInstanceHandles.traverseAncestors(targetID, findDeepestCachedAncestorImpl);

  var foundNode = deepestNodeSoFar;
  deepestNodeSoFar = null;
  return foundNode;
}

/**
 * Mounts this component and inserts it into the DOM.
 *
 * @param {ReactComponent} componentInstance The instance to mount.
 * @param {string} rootID DOM ID of the root node.
 * @param {DOMElement} container DOM element to mount into.
 * @param {ReactReconcileTransaction} transaction
 * @param {boolean} shouldReuseMarkup If true, do not insert markup
 */
function mountComponentIntoNode(componentInstance, rootID, container, transaction, shouldReuseMarkup, context) {
  if (ReactDOMFeatureFlags.useCreateElement) {
    context = assign({}, context);
    if (container.nodeType === DOC_NODE_TYPE) {
      context[ownerDocumentContextKey] = container;
    } else {
      context[ownerDocumentContextKey] = container.ownerDocument;
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    if (context === emptyObject) {
      context = {};
    }
    var tag = container.nodeName.toLowerCase();
    context[validateDOMNesting.ancestorInfoContextKey] = validateDOMNesting.updatedAncestorInfo(null, tag, null);
  }
  var markup = ReactReconciler.mountComponent(componentInstance, rootID, transaction, context);
  componentInstance._renderedComponent._topLevelWrapper = componentInstance;
  ReactMount._mountImageIntoNode(markup, container, shouldReuseMarkup, transaction);
}

/**
 * Batched mount.
 *
 * @param {ReactComponent} componentInstance The instance to mount.
 * @param {string} rootID DOM ID of the root node.
 * @param {DOMElement} container DOM element to mount into.
 * @param {boolean} shouldReuseMarkup If true, do not insert markup
 */
function batchedMountComponentIntoNode(componentInstance, rootID, container, shouldReuseMarkup, context) {
  var transaction = ReactUpdates.ReactReconcileTransaction.getPooled(
  /* forceHTML */shouldReuseMarkup);
  transaction.perform(mountComponentIntoNode, null, componentInstance, rootID, container, transaction, shouldReuseMarkup, context);
  ReactUpdates.ReactReconcileTransaction.release(transaction);
}

/**
 * Unmounts a component and removes it from the DOM.
 *
 * @param {ReactComponent} instance React component instance.
 * @param {DOMElement} container DOM element to unmount from.
 * @final
 * @internal
 * @see {ReactMount.unmountComponentAtNode}
 */
function unmountComponentFromNode(instance, container) {
  ReactReconciler.unmountComponent(instance);

  if (container.nodeType === DOC_NODE_TYPE) {
    container = container.documentElement;
  }

  // http://jsperf.com/emptying-a-node
  while (container.lastChild) {
    container.removeChild(container.lastChild);
  }
}

/**
 * True if the supplied DOM node has a direct React-rendered child that is
 * not a React root element. Useful for warning in `render`,
 * `unmountComponentAtNode`, etc.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @return {boolean} True if the DOM element contains a direct child that was
 * rendered by React but is not a root element.
 * @internal
 */
function hasNonRootReactChild(node) {
  var reactRootID = getReactRootID(node);
  return reactRootID ? reactRootID !== ReactInstanceHandles.getReactRootIDFromNodeID(reactRootID) : false;
}

/**
 * Returns the first (deepest) ancestor of a node which is rendered by this copy
 * of React.
 */
function findFirstReactDOMImpl(node) {
  // This node might be from another React instance, so we make sure not to
  // examine the node cache here
  for (; node && node.parentNode !== node; node = node.parentNode) {
    if (node.nodeType !== 1) {
      // Not a DOMElement, therefore not a React component
      continue;
    }
    var nodeID = internalGetID(node);
    if (!nodeID) {
      continue;
    }
    var reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(nodeID);

    // If containersByReactRootID contains the container we find by crawling up
    // the tree, we know that this instance of React rendered the node.
    // nb. isValid's strategy (with containsNode) does not work because render
    // trees may be nested and we don't want a false positive in that case.
    var current = node;
    var lastID;
    do {
      lastID = internalGetID(current);
      current = current.parentNode;
      if (current == null) {
        // The passed-in node has been detached from the container it was
        // originally rendered into.
        return null;
      }
    } while (lastID !== reactRootID);

    if (current === containersByReactRootID[reactRootID]) {
      return node;
    }
  }
  return null;
}

/**
 * Temporary (?) hack so that we can store all top-level pending updates on
 * composites instead of having to worry about different types of components
 * here.
 */
var TopLevelWrapper = function TopLevelWrapper() {};
TopLevelWrapper.prototype.isReactComponent = {};
if (process.env.NODE_ENV !== 'production') {
  TopLevelWrapper.displayName = 'TopLevelWrapper';
}
TopLevelWrapper.prototype.render = function () {
  // this.props is actually a ReactElement
  return this.props;
};

/**
 * Mounting is the process of initializing a React component by creating its
 * representative DOM elements and inserting them into a supplied `container`.
 * Any prior content inside `container` is destroyed in the process.
 *
 *   ReactMount.render(
 *     component,
 *     document.getElementById('container')
 *   );
 *
 *   <div id="container">                   <-- Supplied `container`.
 *     <div data-reactid=".3">              <-- Rendered reactRoot of React
 *       // ...                                 component.
 *     </div>
 *   </div>
 *
 * Inside of `container`, the first element rendered is the "reactRoot".
 */
var ReactMount = {

  TopLevelWrapper: TopLevelWrapper,

  /** Exposed for debugging purposes **/
  _instancesByReactRootID: instancesByReactRootID,

  /**
   * This is a hook provided to support rendering React components while
   * ensuring that the apparent scroll position of its `container` does not
   * change.
   *
   * @param {DOMElement} container The `container` being rendered into.
   * @param {function} renderCallback This must be called once to do the render.
   */
  scrollMonitor: function scrollMonitor(container, renderCallback) {
    renderCallback();
  },

  /**
   * Take a component that's already mounted into the DOM and replace its props
   * @param {ReactComponent} prevComponent component instance already in the DOM
   * @param {ReactElement} nextElement component instance to render
   * @param {DOMElement} container container to render into
   * @param {?function} callback function triggered on completion
   */
  _updateRootComponent: function _updateRootComponent(prevComponent, nextElement, container, callback) {
    ReactMount.scrollMonitor(container, function () {
      ReactUpdateQueue.enqueueElementInternal(prevComponent, nextElement);
      if (callback) {
        ReactUpdateQueue.enqueueCallbackInternal(prevComponent, callback);
      }
    });

    if (process.env.NODE_ENV !== 'production') {
      // Record the root element in case it later gets transplanted.
      rootElementsByReactRootID[getReactRootID(container)] = getReactRootElementInContainer(container);
    }

    return prevComponent;
  },

  /**
   * Register a component into the instance map and starts scroll value
   * monitoring
   * @param {ReactComponent} nextComponent component instance to render
   * @param {DOMElement} container container to render into
   * @return {string} reactRoot ID prefix
   */
  _registerComponent: function _registerComponent(nextComponent, container) {
    !(container && (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE || container.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE)) ? process.env.NODE_ENV !== 'production' ? invariant(false, '_registerComponent(...): Target container is not a DOM element.') : invariant(false) : undefined;

    ReactBrowserEventEmitter.ensureScrollValueMonitoring();

    var reactRootID = ReactMount.registerContainer(container);
    instancesByReactRootID[reactRootID] = nextComponent;
    return reactRootID;
  },

  /**
   * Render a new component into the DOM.
   * @param {ReactElement} nextElement element to render
   * @param {DOMElement} container container to render into
   * @param {boolean} shouldReuseMarkup if we should skip the markup insertion
   * @return {ReactComponent} nextComponent
   */
  _renderNewRootComponent: function _renderNewRootComponent(nextElement, container, shouldReuseMarkup, context) {
    // Various parts of our code (such as ReactCompositeComponent's
    // _renderValidatedComponent) assume that calls to render aren't nested;
    // verify that that's the case.
    process.env.NODE_ENV !== 'production' ? warning(ReactCurrentOwner.current == null, '_renderNewRootComponent(): Render methods should be a pure function ' + 'of props and state; triggering nested component updates from ' + 'render is not allowed. If necessary, trigger nested updates in ' + 'componentDidUpdate. Check the render method of %s.', ReactCurrentOwner.current && ReactCurrentOwner.current.getName() || 'ReactCompositeComponent') : undefined;

    var componentInstance = instantiateReactComponent(nextElement, null);
    var reactRootID = ReactMount._registerComponent(componentInstance, container);

    // The initial render is synchronous but any updates that happen during
    // rendering, in componentWillMount or componentDidMount, will be batched
    // according to the current batching strategy.

    ReactUpdates.batchedUpdates(batchedMountComponentIntoNode, componentInstance, reactRootID, container, shouldReuseMarkup, context);

    if (process.env.NODE_ENV !== 'production') {
      // Record the root element in case it later gets transplanted.
      rootElementsByReactRootID[reactRootID] = getReactRootElementInContainer(container);
    }

    return componentInstance;
  },

  /**
   * Renders a React component into the DOM in the supplied `container`.
   *
   * If the React component was previously rendered into `container`, this will
   * perform an update on it and only mutate the DOM as necessary to reflect the
   * latest React component.
   *
   * @param {ReactComponent} parentComponent The conceptual parent of this render tree.
   * @param {ReactElement} nextElement Component element to render.
   * @param {DOMElement} container DOM element to render into.
   * @param {?function} callback function triggered on completion
   * @return {ReactComponent} Component instance rendered in `container`.
   */
  renderSubtreeIntoContainer: function renderSubtreeIntoContainer(parentComponent, nextElement, container, callback) {
    !(parentComponent != null && parentComponent._reactInternalInstance != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'parentComponent must be a valid React Component') : invariant(false) : undefined;
    return ReactMount._renderSubtreeIntoContainer(parentComponent, nextElement, container, callback);
  },

  _renderSubtreeIntoContainer: function _renderSubtreeIntoContainer(parentComponent, nextElement, container, callback) {
    !ReactElement.isValidElement(nextElement) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactDOM.render(): Invalid component element.%s', typeof nextElement === 'string' ? ' Instead of passing an element string, make sure to instantiate ' + 'it by passing it to React.createElement.' : typeof nextElement === 'function' ? ' Instead of passing a component class, make sure to instantiate ' + 'it by passing it to React.createElement.' :
    // Check if it quacks like an element
    nextElement != null && nextElement.props !== undefined ? ' This may be caused by unintentionally loading two independent ' + 'copies of React.' : '') : invariant(false) : undefined;

    process.env.NODE_ENV !== 'production' ? warning(!container || !container.tagName || container.tagName.toUpperCase() !== 'BODY', 'render(): Rendering components directly into document.body is ' + 'discouraged, since its children are often manipulated by third-party ' + 'scripts and browser extensions. This may lead to subtle ' + 'reconciliation issues. Try rendering into a container element created ' + 'for your app.') : undefined;

    var nextWrappedElement = new ReactElement(TopLevelWrapper, null, null, null, null, null, nextElement);

    var prevComponent = instancesByReactRootID[getReactRootID(container)];

    if (prevComponent) {
      var prevWrappedElement = prevComponent._currentElement;
      var prevElement = prevWrappedElement.props;
      if (shouldUpdateReactComponent(prevElement, nextElement)) {
        var publicInst = prevComponent._renderedComponent.getPublicInstance();
        var updatedCallback = callback && function () {
          callback.call(publicInst);
        };
        ReactMount._updateRootComponent(prevComponent, nextWrappedElement, container, updatedCallback);
        return publicInst;
      } else {
        ReactMount.unmountComponentAtNode(container);
      }
    }

    var reactRootElement = getReactRootElementInContainer(container);
    var containerHasReactMarkup = reactRootElement && !!internalGetID(reactRootElement);
    var containerHasNonRootReactChild = hasNonRootReactChild(container);

    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(!containerHasNonRootReactChild, 'render(...): Replacing React-rendered children with a new root ' + 'component. If you intended to update the children of this node, ' + 'you should instead have the existing children update their state ' + 'and render the new components instead of calling ReactDOM.render.') : undefined;

      if (!containerHasReactMarkup || reactRootElement.nextSibling) {
        var rootElementSibling = reactRootElement;
        while (rootElementSibling) {
          if (internalGetID(rootElementSibling)) {
            process.env.NODE_ENV !== 'production' ? warning(false, 'render(): Target node has markup rendered by React, but there ' + 'are unrelated nodes as well. This is most commonly caused by ' + 'white-space inserted around server-rendered markup.') : undefined;
            break;
          }
          rootElementSibling = rootElementSibling.nextSibling;
        }
      }
    }

    var shouldReuseMarkup = containerHasReactMarkup && !prevComponent && !containerHasNonRootReactChild;
    var component = ReactMount._renderNewRootComponent(nextWrappedElement, container, shouldReuseMarkup, parentComponent != null ? parentComponent._reactInternalInstance._processChildContext(parentComponent._reactInternalInstance._context) : emptyObject)._renderedComponent.getPublicInstance();
    if (callback) {
      callback.call(component);
    }
    return component;
  },

  /**
   * Renders a React component into the DOM in the supplied `container`.
   *
   * If the React component was previously rendered into `container`, this will
   * perform an update on it and only mutate the DOM as necessary to reflect the
   * latest React component.
   *
   * @param {ReactElement} nextElement Component element to render.
   * @param {DOMElement} container DOM element to render into.
   * @param {?function} callback function triggered on completion
   * @return {ReactComponent} Component instance rendered in `container`.
   */
  render: function render(nextElement, container, callback) {
    return ReactMount._renderSubtreeIntoContainer(null, nextElement, container, callback);
  },

  /**
   * Registers a container node into which React components will be rendered.
   * This also creates the "reactRoot" ID that will be assigned to the element
   * rendered within.
   *
   * @param {DOMElement} container DOM element to register as a container.
   * @return {string} The "reactRoot" ID of elements rendered within.
   */
  registerContainer: function registerContainer(container) {
    var reactRootID = getReactRootID(container);
    if (reactRootID) {
      // If one exists, make sure it is a valid "reactRoot" ID.
      reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(reactRootID);
    }
    if (!reactRootID) {
      // No valid "reactRoot" ID found, create one.
      reactRootID = ReactInstanceHandles.createReactRootID();
    }
    containersByReactRootID[reactRootID] = container;
    return reactRootID;
  },

  /**
   * Unmounts and destroys the React component rendered in the `container`.
   *
   * @param {DOMElement} container DOM element containing a React component.
   * @return {boolean} True if a component was found in and unmounted from
   *                   `container`
   */
  unmountComponentAtNode: function unmountComponentAtNode(container) {
    // Various parts of our code (such as ReactCompositeComponent's
    // _renderValidatedComponent) assume that calls to render aren't nested;
    // verify that that's the case. (Strictly speaking, unmounting won't cause a
    // render but we still don't expect to be in a render call here.)
    process.env.NODE_ENV !== 'production' ? warning(ReactCurrentOwner.current == null, 'unmountComponentAtNode(): Render methods should be a pure function ' + 'of props and state; triggering nested component updates from render ' + 'is not allowed. If necessary, trigger nested updates in ' + 'componentDidUpdate. Check the render method of %s.', ReactCurrentOwner.current && ReactCurrentOwner.current.getName() || 'ReactCompositeComponent') : undefined;

    !(container && (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE || container.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'unmountComponentAtNode(...): Target container is not a DOM element.') : invariant(false) : undefined;

    var reactRootID = getReactRootID(container);
    var component = instancesByReactRootID[reactRootID];
    if (!component) {
      // Check if the node being unmounted was rendered by React, but isn't a
      // root node.
      var containerHasNonRootReactChild = hasNonRootReactChild(container);

      // Check if the container itself is a React root node.
      var containerID = internalGetID(container);
      var isContainerReactRoot = containerID && containerID === ReactInstanceHandles.getReactRootIDFromNodeID(containerID);

      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning(!containerHasNonRootReactChild, 'unmountComponentAtNode(): The node you\'re attempting to unmount ' + 'was rendered by React and is not a top-level container. %s', isContainerReactRoot ? 'You may have accidentally passed in a React root node instead ' + 'of its container.' : 'Instead, have the parent component update its state and ' + 'rerender in order to remove this component.') : undefined;
      }

      return false;
    }
    ReactUpdates.batchedUpdates(unmountComponentFromNode, component, container);
    delete instancesByReactRootID[reactRootID];
    delete containersByReactRootID[reactRootID];
    if (process.env.NODE_ENV !== 'production') {
      delete rootElementsByReactRootID[reactRootID];
    }
    return true;
  },

  /**
   * Finds the container DOM element that contains React component to which the
   * supplied DOM `id` belongs.
   *
   * @param {string} id The ID of an element rendered by a React component.
   * @return {?DOMElement} DOM element that contains the `id`.
   */
  findReactContainerForID: function findReactContainerForID(id) {
    var reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(id);
    var container = containersByReactRootID[reactRootID];

    if (process.env.NODE_ENV !== 'production') {
      var rootElement = rootElementsByReactRootID[reactRootID];
      if (rootElement && rootElement.parentNode !== container) {
        process.env.NODE_ENV !== 'production' ? warning(
        // Call internalGetID here because getID calls isValid which calls
        // findReactContainerForID (this function).
        internalGetID(rootElement) === reactRootID, 'ReactMount: Root element ID differed from reactRootID.') : undefined;
        var containerChild = container.firstChild;
        if (containerChild && reactRootID === internalGetID(containerChild)) {
          // If the container has a new child with the same ID as the old
          // root element, then rootElementsByReactRootID[reactRootID] is
          // just stale and needs to be updated. The case that deserves a
          // warning is when the container is empty.
          rootElementsByReactRootID[reactRootID] = containerChild;
        } else {
          process.env.NODE_ENV !== 'production' ? warning(false, 'ReactMount: Root element has been removed from its original ' + 'container. New container: %s', rootElement.parentNode) : undefined;
        }
      }
    }

    return container;
  },

  /**
   * Finds an element rendered by React with the supplied ID.
   *
   * @param {string} id ID of a DOM node in the React component.
   * @return {DOMElement} Root DOM node of the React component.
   */
  findReactNodeByID: function findReactNodeByID(id) {
    var reactRoot = ReactMount.findReactContainerForID(id);
    return ReactMount.findComponentRoot(reactRoot, id);
  },

  /**
   * Traverses up the ancestors of the supplied node to find a node that is a
   * DOM representation of a React component rendered by this copy of React.
   *
   * @param {*} node
   * @return {?DOMEventTarget}
   * @internal
   */
  getFirstReactDOM: function getFirstReactDOM(node) {
    return findFirstReactDOMImpl(node);
  },

  /**
   * Finds a node with the supplied `targetID` inside of the supplied
   * `ancestorNode`.  Exploits the ID naming scheme to perform the search
   * quickly.
   *
   * @param {DOMEventTarget} ancestorNode Search from this root.
   * @pararm {string} targetID ID of the DOM representation of the component.
   * @return {DOMEventTarget} DOM node with the supplied `targetID`.
   * @internal
   */
  findComponentRoot: function findComponentRoot(ancestorNode, targetID) {
    var firstChildren = findComponentRootReusableArray;
    var childIndex = 0;

    var deepestAncestor = findDeepestCachedAncestor(targetID) || ancestorNode;

    if (process.env.NODE_ENV !== 'production') {
      // This will throw on the next line; give an early warning
      process.env.NODE_ENV !== 'production' ? warning(deepestAncestor != null, 'React can\'t find the root component node for data-reactid value ' + '`%s`. If you\'re seeing this message, it probably means that ' + 'you\'ve loaded two copies of React on the page. At this time, only ' + 'a single copy of React can be loaded at a time.', targetID) : undefined;
    }

    firstChildren[0] = deepestAncestor.firstChild;
    firstChildren.length = 1;

    while (childIndex < firstChildren.length) {
      var child = firstChildren[childIndex++];
      var targetChild;

      while (child) {
        var childID = ReactMount.getID(child);
        if (childID) {
          // Even if we find the node we're looking for, we finish looping
          // through its siblings to ensure they're cached so that we don't have
          // to revisit this node again. Otherwise, we make n^2 calls to getID
          // when visiting the many children of a single node in order.

          if (targetID === childID) {
            targetChild = child;
          } else if (ReactInstanceHandles.isAncestorIDOf(childID, targetID)) {
            // If we find a child whose ID is an ancestor of the given ID,
            // then we can be sure that we only want to search the subtree
            // rooted at this child, so we can throw out the rest of the
            // search state.
            firstChildren.length = childIndex = 0;
            firstChildren.push(child.firstChild);
          }
        } else {
          // If this child had no ID, then there's a chance that it was
          // injected automatically by the browser, as when a `<table>`
          // element sprouts an extra `<tbody>` child as a side effect of
          // `.innerHTML` parsing. Optimistically continue down this
          // branch, but not before examining the other siblings.
          firstChildren.push(child.firstChild);
        }

        child = child.nextSibling;
      }

      if (targetChild) {
        // Emptying firstChildren/findComponentRootReusableArray is
        // not necessary for correctness, but it helps the GC reclaim
        // any nodes that were left at the end of the search.
        firstChildren.length = 0;

        return targetChild;
      }
    }

    firstChildren.length = 0;

    !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'findComponentRoot(..., %s): Unable to find element. This probably ' + 'means the DOM was unexpectedly mutated (e.g., by the browser), ' + 'usually due to forgetting a <tbody> when using tables, nesting tags ' + 'like <form>, <p>, or <a>, or using non-SVG elements in an <svg> ' + 'parent. ' + 'Try inspecting the child nodes of the element with React ID `%s`.', targetID, ReactMount.getID(ancestorNode)) : invariant(false) : undefined;
  },

  _mountImageIntoNode: function _mountImageIntoNode(markup, container, shouldReuseMarkup, transaction) {
    !(container && (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE || container.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mountComponentIntoNode(...): Target container is not valid.') : invariant(false) : undefined;

    if (shouldReuseMarkup) {
      var rootElement = getReactRootElementInContainer(container);
      if (ReactMarkupChecksum.canReuseMarkup(markup, rootElement)) {
        return;
      } else {
        var checksum = rootElement.getAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);
        rootElement.removeAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);

        var rootMarkup = rootElement.outerHTML;
        rootElement.setAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME, checksum);

        var normalizedMarkup = markup;
        if (process.env.NODE_ENV !== 'production') {
          // because rootMarkup is retrieved from the DOM, various normalizations
          // will have occurred which will not be present in `markup`. Here,
          // insert markup into a <div> or <iframe> depending on the container
          // type to perform the same normalizations before comparing.
          var normalizer;
          if (container.nodeType === ELEMENT_NODE_TYPE) {
            normalizer = document.createElement('div');
            normalizer.innerHTML = markup;
            normalizedMarkup = normalizer.innerHTML;
          } else {
            normalizer = document.createElement('iframe');
            document.body.appendChild(normalizer);
            normalizer.contentDocument.write(markup);
            normalizedMarkup = normalizer.contentDocument.documentElement.outerHTML;
            document.body.removeChild(normalizer);
          }
        }

        var diffIndex = firstDifferenceIndex(normalizedMarkup, rootMarkup);
        var difference = ' (client) ' + normalizedMarkup.substring(diffIndex - 20, diffIndex + 20) + '\n (server) ' + rootMarkup.substring(diffIndex - 20, diffIndex + 20);

        !(container.nodeType !== DOC_NODE_TYPE) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'You\'re trying to render a component to the document using ' + 'server rendering but the checksum was invalid. This usually ' + 'means you rendered a different component type or props on ' + 'the client from the one on the server, or your render() ' + 'methods are impure. React cannot handle this case due to ' + 'cross-browser quirks by rendering at the document root. You ' + 'should look for environment dependent code in your components ' + 'and ensure the props are the same client and server side:\n%s', difference) : invariant(false) : undefined;

        if (process.env.NODE_ENV !== 'production') {
          process.env.NODE_ENV !== 'production' ? warning(false, 'React attempted to reuse markup in a container but the ' + 'checksum was invalid. This generally means that you are ' + 'using server rendering and the markup generated on the ' + 'server was not what the client was expecting. React injected ' + 'new markup to compensate which works but you have lost many ' + 'of the benefits of server rendering. Instead, figure out ' + 'why the markup being generated is different on the client ' + 'or server:\n%s', difference) : undefined;
        }
      }
    }

    !(container.nodeType !== DOC_NODE_TYPE) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'You\'re trying to render a component to the document but ' + 'you didn\'t use server rendering. We can\'t do this ' + 'without using server rendering due to cross-browser quirks. ' + 'See ReactDOMServer.renderToString() for server rendering.') : invariant(false) : undefined;

    if (transaction.useCreateElement) {
      while (container.lastChild) {
        container.removeChild(container.lastChild);
      }
      container.appendChild(markup);
    } else {
      setInnerHTML(container, markup);
    }
  },

  ownerDocumentContextKey: ownerDocumentContextKey,

  /**
   * React ID utilities.
   */

  getReactRootID: getReactRootID,

  getID: getID,

  setID: setID,

  getNode: getNode,

  getNodeFromInstance: getNodeFromInstance,

  isValid: isValid,

  purgeID: purgeID
};

ReactPerf.measureMethods(ReactMount, 'ReactMount', {
  _renderNewRootComponent: '_renderNewRootComponent',
  _mountImageIntoNode: '_mountImageIntoNode'
});

module.exports = ReactMount;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0TW91bnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLGNBQWMsUUFBUSxlQUFSLENBQWxCO0FBQ0EsSUFBSSwyQkFBMkIsUUFBUSw0QkFBUixDQUEvQjtBQUNBLElBQUksb0JBQW9CLFFBQVEscUJBQVIsQ0FBeEI7QUFDQSxJQUFJLHVCQUF1QixRQUFRLHdCQUFSLENBQTNCO0FBQ0EsSUFBSSxlQUFlLFFBQVEsZ0JBQVIsQ0FBbkI7QUFDQSxJQUFJLDhCQUE4QixRQUFRLCtCQUFSLENBQWxDO0FBQ0EsSUFBSSx1QkFBdUIsUUFBUSx3QkFBUixDQUEzQjtBQUNBLElBQUksbUJBQW1CLFFBQVEsb0JBQVIsQ0FBdkI7QUFDQSxJQUFJLHNCQUFzQixRQUFRLHVCQUFSLENBQTFCO0FBQ0EsSUFBSSxZQUFZLFFBQVEsYUFBUixDQUFoQjtBQUNBLElBQUksa0JBQWtCLFFBQVEsbUJBQVIsQ0FBdEI7QUFDQSxJQUFJLG1CQUFtQixRQUFRLG9CQUFSLENBQXZCO0FBQ0EsSUFBSSxlQUFlLFFBQVEsZ0JBQVIsQ0FBbkI7O0FBRUEsSUFBSSxTQUFTLFFBQVEsaUJBQVIsQ0FBYjtBQUNBLElBQUksY0FBYyxRQUFRLHNCQUFSLENBQWxCO0FBQ0EsSUFBSSxlQUFlLFFBQVEsdUJBQVIsQ0FBbkI7QUFDQSxJQUFJLDRCQUE0QixRQUFRLDZCQUFSLENBQWhDO0FBQ0EsSUFBSSxZQUFZLFFBQVEsb0JBQVIsQ0FBaEI7QUFDQSxJQUFJLGVBQWUsUUFBUSxnQkFBUixDQUFuQjtBQUNBLElBQUksNkJBQTZCLFFBQVEsOEJBQVIsQ0FBakM7QUFDQSxJQUFJLHFCQUFxQixRQUFRLHNCQUFSLENBQXpCO0FBQ0EsSUFBSSxVQUFVLFFBQVEsa0JBQVIsQ0FBZDs7QUFFQSxJQUFJLFlBQVksWUFBWSxpQkFBNUI7QUFDQSxJQUFJLFlBQVksRUFBaEI7O0FBRUEsSUFB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QUF4QyxHQUE0Z0IsU0FBNWdCO0FBQ0Q7QUFDRjtBQUNGOztBQUVELE1BQUUsVUFBVSxRQUFWLEtBQXVCLGFBQXpCLElBQTBDLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLDhEQUE4RCxzREFBOUQsR0FBdUgsOERBQXZILEdBQXdMLDJEQUF6TSxDQUF4QyxHQUFnVCxVQUFVLEtBQVYsQ0FBMVYsR0FBNlcsU0FBN1c7O0FBRUEsUUFBSSxZQUFZLGdCQUFoQixFQUFrQztBQUNoQyxhQUFPLFVBQVUsU0FBakIsRUFBNEI7QUFDMUIsa0JBQVUsV0FBVixDQUFzQixVQUFVLFNBQWhDO0FBQ0Q7QUFDRCxnQkFBVSxXQUFWLENBQXNCLE1BQXRCO0FBQ0QsS0FMRCxNQUtPO0FBQ0wsbUJBQWEsU0FBYixFQUF3QixNQUF4QjtBQUNEO0FBQ0YsR0F6YWM7O0FBMmFmLDJCQUF5Qix1QkEzYVY7Ozs7OztBQWliZixrQkFBZ0IsY0FqYkQ7O0FBbWJmLFNBQU8sS0FuYlE7O0FBcWJmLFNBQU8sS0FyYlE7O0FBdWJmLFdBQVMsT0F2Yk07O0FBeWJmLHVCQUFxQixtQkF6Yk47O0FBMmJmLFdBQVMsT0EzYk07O0FBNmJmLFdBQVM7QUE3Yk0sQ0FBakI7O0FBZ2NBLFVBQVUsY0FBVixDQUF5QixVQUF6QixFQUFxQyxZQUFyQyxFQUFtRDtBQUNqRCwyQkFBeUIseUJBRHdCO0FBRWpELHVCQUFxQjtBQUY0QixDQUFuRDs7QUFLQSxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoiUmVhY3RNb3VudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdE1vdW50XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRE9NUHJvcGVydHkgPSByZXF1aXJlKCcuL0RPTVByb3BlcnR5Jyk7XG52YXIgUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9SZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXInKTtcbnZhciBSZWFjdEN1cnJlbnRPd25lciA9IHJlcXVpcmUoJy4vUmVhY3RDdXJyZW50T3duZXInKTtcbnZhciBSZWFjdERPTUZlYXR1cmVGbGFncyA9IHJlcXVpcmUoJy4vUmVhY3RET01GZWF0dXJlRmxhZ3MnKTtcbnZhciBSZWFjdEVsZW1lbnQgPSByZXF1aXJlKCcuL1JlYWN0RWxlbWVudCcpO1xudmFyIFJlYWN0RW1wdHlDb21wb25lbnRSZWdpc3RyeSA9IHJlcXVpcmUoJy4vUmVhY3RFbXB0eUNvbXBvbmVudFJlZ2lzdHJ5Jyk7XG52YXIgUmVhY3RJbnN0YW5jZUhhbmRsZXMgPSByZXF1aXJlKCcuL1JlYWN0SW5zdGFuY2VIYW5kbGVzJyk7XG52YXIgUmVhY3RJbnN0YW5jZU1hcCA9IHJlcXVpcmUoJy4vUmVhY3RJbnN0YW5jZU1hcCcpO1xudmFyIFJlYWN0TWFya3VwQ2hlY2tzdW0gPSByZXF1aXJlKCcuL1JlYWN0TWFya3VwQ2hlY2tzdW0nKTtcbnZhciBSZWFjdFBlcmYgPSByZXF1aXJlKCcuL1JlYWN0UGVyZicpO1xudmFyIFJlYWN0UmVjb25jaWxlciA9IHJlcXVpcmUoJy4vUmVhY3RSZWNvbmNpbGVyJyk7XG52YXIgUmVhY3RVcGRhdGVRdWV1ZSA9IHJlcXVpcmUoJy4vUmVhY3RVcGRhdGVRdWV1ZScpO1xudmFyIFJlYWN0VXBkYXRlcyA9IHJlcXVpcmUoJy4vUmVhY3RVcGRhdGVzJyk7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL09iamVjdC5hc3NpZ24nKTtcbnZhciBlbXB0eU9iamVjdCA9IHJlcXVpcmUoJ2ZianMvbGliL2VtcHR5T2JqZWN0Jyk7XG52YXIgY29udGFpbnNOb2RlID0gcmVxdWlyZSgnZmJqcy9saWIvY29udGFpbnNOb2RlJyk7XG52YXIgaW5zdGFudGlhdGVSZWFjdENvbXBvbmVudCA9IHJlcXVpcmUoJy4vaW5zdGFudGlhdGVSZWFjdENvbXBvbmVudCcpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHNldElubmVySFRNTCA9IHJlcXVpcmUoJy4vc2V0SW5uZXJIVE1MJyk7XG52YXIgc2hvdWxkVXBkYXRlUmVhY3RDb21wb25lbnQgPSByZXF1aXJlKCcuL3Nob3VsZFVwZGF0ZVJlYWN0Q29tcG9uZW50Jyk7XG52YXIgdmFsaWRhdGVET01OZXN0aW5nID0gcmVxdWlyZSgnLi92YWxpZGF0ZURPTU5lc3RpbmcnKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG52YXIgQVRUUl9OQU1FID0gRE9NUHJvcGVydHkuSURfQVRUUklCVVRFX05BTUU7XG52YXIgbm9kZUNhY2hlID0ge307XG5cbnZhciBFTEVNRU5UX05PREVfVFlQRSA9IDE7XG52YXIgRE9DX05PREVfVFlQRSA9IDk7XG52YXIgRE9DVU1FTlRfRlJBR01FTlRfTk9ERV9UWVBFID0gMTE7XG5cbnZhciBvd25lckRvY3VtZW50Q29udGV4dEtleSA9ICdfX1JlYWN0TW91bnRfb3duZXJEb2N1bWVudCQnICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMik7XG5cbi8qKiBNYXBwaW5nIGZyb20gcmVhY3RSb290SUQgdG8gUmVhY3QgY29tcG9uZW50IGluc3RhbmNlLiAqL1xudmFyIGluc3RhbmNlc0J5UmVhY3RSb290SUQgPSB7fTtcblxuLyoqIE1hcHBpbmcgZnJvbSByZWFjdFJvb3RJRCB0byBgY29udGFpbmVyYCBub2Rlcy4gKi9cbnZhciBjb250YWluZXJzQnlSZWFjdFJvb3RJRCA9IHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAvKiogX19ERVZfXy1vbmx5IG1hcHBpbmcgZnJvbSByZWFjdFJvb3RJRCB0byByb290IGVsZW1lbnRzLiAqL1xuICB2YXIgcm9vdEVsZW1lbnRzQnlSZWFjdFJvb3RJRCA9IHt9O1xufVxuXG4vLyBVc2VkIHRvIHN0b3JlIGJyZWFkdGgtZmlyc3Qgc2VhcmNoIHN0YXRlIGluIGZpbmRDb21wb25lbnRSb290LlxudmFyIGZpbmRDb21wb25lbnRSb290UmV1c2FibGVBcnJheSA9IFtdO1xuXG4vKipcbiAqIEZpbmRzIHRoZSBpbmRleCBvZiB0aGUgZmlyc3QgY2hhcmFjdGVyXG4gKiB0aGF0J3Mgbm90IGNvbW1vbiBiZXR3ZWVuIHRoZSB0d28gZ2l2ZW4gc3RyaW5ncy5cbiAqXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBpbmRleCBvZiB0aGUgY2hhcmFjdGVyIHdoZXJlIHRoZSBzdHJpbmdzIGRpdmVyZ2VcbiAqL1xuZnVuY3Rpb24gZmlyc3REaWZmZXJlbmNlSW5kZXgoc3RyaW5nMSwgc3RyaW5nMikge1xuICB2YXIgbWluTGVuID0gTWF0aC5taW4oc3RyaW5nMS5sZW5ndGgsIHN0cmluZzIubGVuZ3RoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtaW5MZW47IGkrKykge1xuICAgIGlmIChzdHJpbmcxLmNoYXJBdChpKSAhPT0gc3RyaW5nMi5jaGFyQXQoaSkpIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyaW5nMS5sZW5ndGggPT09IHN0cmluZzIubGVuZ3RoID8gLTEgOiBtaW5MZW47XG59XG5cbi8qKlxuICogQHBhcmFtIHtET01FbGVtZW50fERPTURvY3VtZW50fSBjb250YWluZXIgRE9NIGVsZW1lbnQgdGhhdCBtYXkgY29udGFpblxuICogYSBSZWFjdCBjb21wb25lbnRcbiAqIEByZXR1cm4gez8qfSBET00gZWxlbWVudCB0aGF0IG1heSBoYXZlIHRoZSByZWFjdFJvb3QgSUQsIG9yIG51bGwuXG4gKi9cbmZ1bmN0aW9uIGdldFJlYWN0Um9vdEVsZW1lbnRJbkNvbnRhaW5lcihjb250YWluZXIpIHtcbiAgaWYgKCFjb250YWluZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChjb250YWluZXIubm9kZVR5cGUgPT09IERPQ19OT0RFX1RZUEUpIHtcbiAgICByZXR1cm4gY29udGFpbmVyLmRvY3VtZW50RWxlbWVudDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29udGFpbmVyLmZpcnN0Q2hpbGQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGNvbnRhaW5lciBET00gZWxlbWVudCB0aGF0IG1heSBjb250YWluIGEgUmVhY3QgY29tcG9uZW50LlxuICogQHJldHVybiB7P3N0cmluZ30gQSBcInJlYWN0Um9vdFwiIElELCBpZiBhIFJlYWN0IGNvbXBvbmVudCBpcyByZW5kZXJlZC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmVhY3RSb290SUQoY29udGFpbmVyKSB7XG4gIHZhciByb290RWxlbWVudCA9IGdldFJlYWN0Um9vdEVsZW1lbnRJbkNvbnRhaW5lcihjb250YWluZXIpO1xuICByZXR1cm4gcm9vdEVsZW1lbnQgJiYgUmVhY3RNb3VudC5nZXRJRChyb290RWxlbWVudCk7XG59XG5cbi8qKlxuICogQWNjZXNzaW5nIG5vZGVbQVRUUl9OQU1FXSBvciBjYWxsaW5nIGdldEF0dHJpYnV0ZShBVFRSX05BTUUpIG9uIGEgZm9ybVxuICogZWxlbWVudCBjYW4gcmV0dXJuIGl0cyBjb250cm9sIHdob3NlIG5hbWUgb3IgSUQgZXF1YWxzIEFUVFJfTkFNRS4gQWxsXG4gKiBET00gbm9kZXMgc3VwcG9ydCBgZ2V0QXR0cmlidXRlTm9kZWAgYnV0IHRoaXMgY2FuIGFsc28gZ2V0IGNhbGxlZCBvblxuICogb3RoZXIgb2JqZWN0cyBzbyBqdXN0IHJldHVybiAnJyBpZiB3ZSdyZSBnaXZlbiBzb21ldGhpbmcgb3RoZXIgdGhhbiBhXG4gKiBET00gbm9kZSAoc3VjaCBhcyB3aW5kb3cpLlxuICpcbiAqIEBwYXJhbSB7P0RPTUVsZW1lbnR8RE9NV2luZG93fERPTURvY3VtZW50fERPTVRleHROb2RlfSBub2RlIERPTSBub2RlLlxuICogQHJldHVybiB7c3RyaW5nfSBJRCBvZiB0aGUgc3VwcGxpZWQgYGRvbU5vZGVgLlxuICovXG5mdW5jdGlvbiBnZXRJRChub2RlKSB7XG4gIHZhciBpZCA9IGludGVybmFsR2V0SUQobm9kZSk7XG4gIGlmIChpZCkge1xuICAgIGlmIChub2RlQ2FjaGUuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgICB2YXIgY2FjaGVkID0gbm9kZUNhY2hlW2lkXTtcbiAgICAgIGlmIChjYWNoZWQgIT09IG5vZGUpIHtcbiAgICAgICAgISFpc1ZhbGlkKGNhY2hlZCwgaWQpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1JlYWN0TW91bnQ6IFR3byB2YWxpZCBidXQgdW5lcXVhbCBub2RlcyB3aXRoIHRoZSBzYW1lIGAlc2A6ICVzJywgQVRUUl9OQU1FLCBpZCkgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIG5vZGVDYWNoZVtpZF0gPSBub2RlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBub2RlQ2FjaGVbaWRdID0gbm9kZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaWQ7XG59XG5cbmZ1bmN0aW9uIGludGVybmFsR2V0SUQobm9kZSkge1xuICAvLyBJZiBub2RlIGlzIHNvbWV0aGluZyBsaWtlIGEgd2luZG93LCBkb2N1bWVudCwgb3IgdGV4dCBub2RlLCBub25lIG9mXG4gIC8vIHdoaWNoIHN1cHBvcnQgYXR0cmlidXRlcyBvciBhIC5nZXRBdHRyaWJ1dGUgbWV0aG9kLCBncmFjZWZ1bGx5IHJldHVyblxuICAvLyB0aGUgZW1wdHkgc3RyaW5nLCBhcyBpZiB0aGUgYXR0cmlidXRlIHdlcmUgbWlzc2luZy5cbiAgcmV0dXJuIG5vZGUgJiYgbm9kZS5nZXRBdHRyaWJ1dGUgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoQVRUUl9OQU1FKSB8fCAnJztcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBSZWFjdC1zcGVjaWZpYyBJRCBvZiB0aGUgZ2l2ZW4gbm9kZS5cbiAqXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR9IG5vZGUgVGhlIERPTSBub2RlIHdob3NlIElEIHdpbGwgYmUgc2V0LlxuICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSB2YWx1ZSBvZiB0aGUgSUQgYXR0cmlidXRlLlxuICovXG5mdW5jdGlvbiBzZXRJRChub2RlLCBpZCkge1xuICB2YXIgb2xkSUQgPSBpbnRlcm5hbEdldElEKG5vZGUpO1xuICBpZiAob2xkSUQgIT09IGlkKSB7XG4gICAgZGVsZXRlIG5vZGVDYWNoZVtvbGRJRF07XG4gIH1cbiAgbm9kZS5zZXRBdHRyaWJ1dGUoQVRUUl9OQU1FLCBpZCk7XG4gIG5vZGVDYWNoZVtpZF0gPSBub2RlO1xufVxuXG4vKipcbiAqIEZpbmRzIHRoZSBub2RlIHdpdGggdGhlIHN1cHBsaWVkIFJlYWN0LWdlbmVyYXRlZCBET00gSUQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGlkIEEgUmVhY3QtZ2VuZXJhdGVkIERPTSBJRC5cbiAqIEByZXR1cm4ge0RPTUVsZW1lbnR9IERPTSBub2RlIHdpdGggdGhlIHN1cHBsZWQgYGlkYC5cbiAqIEBpbnRlcm5hbFxuICovXG5mdW5jdGlvbiBnZXROb2RlKGlkKSB7XG4gIGlmICghbm9kZUNhY2hlLmhhc093blByb3BlcnR5KGlkKSB8fCAhaXNWYWxpZChub2RlQ2FjaGVbaWRdLCBpZCkpIHtcbiAgICBub2RlQ2FjaGVbaWRdID0gUmVhY3RNb3VudC5maW5kUmVhY3ROb2RlQnlJRChpZCk7XG4gIH1cbiAgcmV0dXJuIG5vZGVDYWNoZVtpZF07XG59XG5cbi8qKlxuICogRmluZHMgdGhlIG5vZGUgd2l0aCB0aGUgc3VwcGxpZWQgcHVibGljIFJlYWN0IGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSB7Kn0gaW5zdGFuY2UgQSBwdWJsaWMgUmVhY3QgaW5zdGFuY2UuXG4gKiBAcmV0dXJuIHs/RE9NRWxlbWVudH0gRE9NIG5vZGUgd2l0aCB0aGUgc3VwcGxlZCBgaWRgLlxuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIGdldE5vZGVGcm9tSW5zdGFuY2UoaW5zdGFuY2UpIHtcbiAgdmFyIGlkID0gUmVhY3RJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpLl9yb290Tm9kZUlEO1xuICBpZiAoUmVhY3RFbXB0eUNvbXBvbmVudFJlZ2lzdHJ5LmlzTnVsbENvbXBvbmVudElEKGlkKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmICghbm9kZUNhY2hlLmhhc093blByb3BlcnR5KGlkKSB8fCAhaXNWYWxpZChub2RlQ2FjaGVbaWRdLCBpZCkpIHtcbiAgICBub2RlQ2FjaGVbaWRdID0gUmVhY3RNb3VudC5maW5kUmVhY3ROb2RlQnlJRChpZCk7XG4gIH1cbiAgcmV0dXJuIG5vZGVDYWNoZVtpZF07XG59XG5cbi8qKlxuICogQSBub2RlIGlzIFwidmFsaWRcIiBpZiBpdCBpcyBjb250YWluZWQgYnkgYSBjdXJyZW50bHkgbW91bnRlZCBjb250YWluZXIuXG4gKlxuICogVGhpcyBtZWFucyB0aGF0IHRoZSBub2RlIGRvZXMgbm90IGhhdmUgdG8gYmUgY29udGFpbmVkIGJ5IGEgZG9jdW1lbnQgaW5cbiAqIG9yZGVyIHRvIGJlIGNvbnNpZGVyZWQgdmFsaWQuXG4gKlxuICogQHBhcmFtIHs/RE9NRWxlbWVudH0gbm9kZSBUaGUgY2FuZGlkYXRlIERPTSBub2RlLlxuICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBleHBlY3RlZCBJRCBvZiB0aGUgbm9kZS5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgdGhlIG5vZGUgaXMgY29udGFpbmVkIGJ5IGEgbW91bnRlZCBjb250YWluZXIuXG4gKi9cbmZ1bmN0aW9uIGlzVmFsaWQobm9kZSwgaWQpIHtcbiAgaWYgKG5vZGUpIHtcbiAgICAhKGludGVybmFsR2V0SUQobm9kZSkgPT09IGlkKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdE1vdW50OiBVbmV4cGVjdGVkIG1vZGlmaWNhdGlvbiBvZiBgJXNgJywgQVRUUl9OQU1FKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG5cbiAgICB2YXIgY29udGFpbmVyID0gUmVhY3RNb3VudC5maW5kUmVhY3RDb250YWluZXJGb3JJRChpZCk7XG4gICAgaWYgKGNvbnRhaW5lciAmJiBjb250YWluc05vZGUoY29udGFpbmVyLCBub2RlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENhdXNlcyB0aGUgY2FjaGUgdG8gZm9yZ2V0IGFib3V0IG9uZSBSZWFjdC1zcGVjaWZpYyBJRC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIHRvIGZvcmdldC5cbiAqL1xuZnVuY3Rpb24gcHVyZ2VJRChpZCkge1xuICBkZWxldGUgbm9kZUNhY2hlW2lkXTtcbn1cblxudmFyIGRlZXBlc3ROb2RlU29GYXIgPSBudWxsO1xuZnVuY3Rpb24gZmluZERlZXBlc3RDYWNoZWRBbmNlc3RvckltcGwoYW5jZXN0b3JJRCkge1xuICB2YXIgYW5jZXN0b3IgPSBub2RlQ2FjaGVbYW5jZXN0b3JJRF07XG4gIGlmIChhbmNlc3RvciAmJiBpc1ZhbGlkKGFuY2VzdG9yLCBhbmNlc3RvcklEKSkge1xuICAgIGRlZXBlc3ROb2RlU29GYXIgPSBhbmNlc3RvcjtcbiAgfSBlbHNlIHtcbiAgICAvLyBUaGlzIG5vZGUgaXNuJ3QgcG9wdWxhdGVkIGluIHRoZSBjYWNoZSwgc28gcHJlc3VtYWJseSBub25lIG9mIGl0c1xuICAgIC8vIGRlc2NlbmRhbnRzIGFyZS4gQnJlYWsgb3V0IG9mIHRoZSBsb29wLlxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiB0aGUgZGVlcGVzdCBjYWNoZWQgbm9kZSB3aG9zZSBJRCBpcyBhIHByZWZpeCBvZiBgdGFyZ2V0SURgLlxuICovXG5mdW5jdGlvbiBmaW5kRGVlcGVzdENhY2hlZEFuY2VzdG9yKHRhcmdldElEKSB7XG4gIGRlZXBlc3ROb2RlU29GYXIgPSBudWxsO1xuICBSZWFjdEluc3RhbmNlSGFuZGxlcy50cmF2ZXJzZUFuY2VzdG9ycyh0YXJnZXRJRCwgZmluZERlZXBlc3RDYWNoZWRBbmNlc3RvckltcGwpO1xuXG4gIHZhciBmb3VuZE5vZGUgPSBkZWVwZXN0Tm9kZVNvRmFyO1xuICBkZWVwZXN0Tm9kZVNvRmFyID0gbnVsbDtcbiAgcmV0dXJuIGZvdW5kTm9kZTtcbn1cblxuLyoqXG4gKiBNb3VudHMgdGhpcyBjb21wb25lbnQgYW5kIGluc2VydHMgaXQgaW50byB0aGUgRE9NLlxuICpcbiAqIEBwYXJhbSB7UmVhY3RDb21wb25lbnR9IGNvbXBvbmVudEluc3RhbmNlIFRoZSBpbnN0YW5jZSB0byBtb3VudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSByb290SUQgRE9NIElEIG9mIHRoZSByb290IG5vZGUuXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGNvbnRhaW5lciBET00gZWxlbWVudCB0byBtb3VudCBpbnRvLlxuICogQHBhcmFtIHtSZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9ufSB0cmFuc2FjdGlvblxuICogQHBhcmFtIHtib29sZWFufSBzaG91bGRSZXVzZU1hcmt1cCBJZiB0cnVlLCBkbyBub3QgaW5zZXJ0IG1hcmt1cFxuICovXG5mdW5jdGlvbiBtb3VudENvbXBvbmVudEludG9Ob2RlKGNvbXBvbmVudEluc3RhbmNlLCByb290SUQsIGNvbnRhaW5lciwgdHJhbnNhY3Rpb24sIHNob3VsZFJldXNlTWFya3VwLCBjb250ZXh0KSB7XG4gIGlmIChSZWFjdERPTUZlYXR1cmVGbGFncy51c2VDcmVhdGVFbGVtZW50KSB7XG4gICAgY29udGV4dCA9IGFzc2lnbih7fSwgY29udGV4dCk7XG4gICAgaWYgKGNvbnRhaW5lci5ub2RlVHlwZSA9PT0gRE9DX05PREVfVFlQRSkge1xuICAgICAgY29udGV4dFtvd25lckRvY3VtZW50Q29udGV4dEtleV0gPSBjb250YWluZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRleHRbb3duZXJEb2N1bWVudENvbnRleHRLZXldID0gY29udGFpbmVyLm93bmVyRG9jdW1lbnQ7XG4gICAgfVxuICB9XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgaWYgKGNvbnRleHQgPT09IGVtcHR5T2JqZWN0KSB7XG4gICAgICBjb250ZXh0ID0ge307XG4gICAgfVxuICAgIHZhciB0YWcgPSBjb250YWluZXIubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBjb250ZXh0W3ZhbGlkYXRlRE9NTmVzdGluZy5hbmNlc3RvckluZm9Db250ZXh0S2V5XSA9IHZhbGlkYXRlRE9NTmVzdGluZy51cGRhdGVkQW5jZXN0b3JJbmZvKG51bGwsIHRhZywgbnVsbCk7XG4gIH1cbiAgdmFyIG1hcmt1cCA9IFJlYWN0UmVjb25jaWxlci5tb3VudENvbXBvbmVudChjb21wb25lbnRJbnN0YW5jZSwgcm9vdElELCB0cmFuc2FjdGlvbiwgY29udGV4dCk7XG4gIGNvbXBvbmVudEluc3RhbmNlLl9yZW5kZXJlZENvbXBvbmVudC5fdG9wTGV2ZWxXcmFwcGVyID0gY29tcG9uZW50SW5zdGFuY2U7XG4gIFJlYWN0TW91bnQuX21vdW50SW1hZ2VJbnRvTm9kZShtYXJrdXAsIGNvbnRhaW5lciwgc2hvdWxkUmV1c2VNYXJrdXAsIHRyYW5zYWN0aW9uKTtcbn1cblxuLyoqXG4gKiBCYXRjaGVkIG1vdW50LlxuICpcbiAqIEBwYXJhbSB7UmVhY3RDb21wb25lbnR9IGNvbXBvbmVudEluc3RhbmNlIFRoZSBpbnN0YW5jZSB0byBtb3VudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSByb290SUQgRE9NIElEIG9mIHRoZSByb290IG5vZGUuXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGNvbnRhaW5lciBET00gZWxlbWVudCB0byBtb3VudCBpbnRvLlxuICogQHBhcmFtIHtib29sZWFufSBzaG91bGRSZXVzZU1hcmt1cCBJZiB0cnVlLCBkbyBub3QgaW5zZXJ0IG1hcmt1cFxuICovXG5mdW5jdGlvbiBiYXRjaGVkTW91bnRDb21wb25lbnRJbnRvTm9kZShjb21wb25lbnRJbnN0YW5jZSwgcm9vdElELCBjb250YWluZXIsIHNob3VsZFJldXNlTWFya3VwLCBjb250ZXh0KSB7XG4gIHZhciB0cmFuc2FjdGlvbiA9IFJlYWN0VXBkYXRlcy5SZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9uLmdldFBvb2xlZChcbiAgLyogZm9yY2VIVE1MICovc2hvdWxkUmV1c2VNYXJrdXApO1xuICB0cmFuc2FjdGlvbi5wZXJmb3JtKG1vdW50Q29tcG9uZW50SW50b05vZGUsIG51bGwsIGNvbXBvbmVudEluc3RhbmNlLCByb290SUQsIGNvbnRhaW5lciwgdHJhbnNhY3Rpb24sIHNob3VsZFJldXNlTWFya3VwLCBjb250ZXh0KTtcbiAgUmVhY3RVcGRhdGVzLlJlYWN0UmVjb25jaWxlVHJhbnNhY3Rpb24ucmVsZWFzZSh0cmFuc2FjdGlvbik7XG59XG5cbi8qKlxuICogVW5tb3VudHMgYSBjb21wb25lbnQgYW5kIHJlbW92ZXMgaXQgZnJvbSB0aGUgRE9NLlxuICpcbiAqIEBwYXJhbSB7UmVhY3RDb21wb25lbnR9IGluc3RhbmNlIFJlYWN0IGNvbXBvbmVudCBpbnN0YW5jZS5cbiAqIEBwYXJhbSB7RE9NRWxlbWVudH0gY29udGFpbmVyIERPTSBlbGVtZW50IHRvIHVubW91bnQgZnJvbS5cbiAqIEBmaW5hbFxuICogQGludGVybmFsXG4gKiBAc2VlIHtSZWFjdE1vdW50LnVubW91bnRDb21wb25lbnRBdE5vZGV9XG4gKi9cbmZ1bmN0aW9uIHVubW91bnRDb21wb25lbnRGcm9tTm9kZShpbnN0YW5jZSwgY29udGFpbmVyKSB7XG4gIFJlYWN0UmVjb25jaWxlci51bm1vdW50Q29tcG9uZW50KGluc3RhbmNlKTtcblxuICBpZiAoY29udGFpbmVyLm5vZGVUeXBlID09PSBET0NfTk9ERV9UWVBFKSB7XG4gICAgY29udGFpbmVyID0gY29udGFpbmVyLmRvY3VtZW50RWxlbWVudDtcbiAgfVxuXG4gIC8vIGh0dHA6Ly9qc3BlcmYuY29tL2VtcHR5aW5nLWEtbm9kZVxuICB3aGlsZSAoY29udGFpbmVyLmxhc3RDaGlsZCkge1xuICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChjb250YWluZXIubGFzdENoaWxkKTtcbiAgfVxufVxuXG4vKipcbiAqIFRydWUgaWYgdGhlIHN1cHBsaWVkIERPTSBub2RlIGhhcyBhIGRpcmVjdCBSZWFjdC1yZW5kZXJlZCBjaGlsZCB0aGF0IGlzXG4gKiBub3QgYSBSZWFjdCByb290IGVsZW1lbnQuIFVzZWZ1bCBmb3Igd2FybmluZyBpbiBgcmVuZGVyYCxcbiAqIGB1bm1vdW50Q29tcG9uZW50QXROb2RlYCwgZXRjLlxuICpcbiAqIEBwYXJhbSB7P0RPTUVsZW1lbnR9IG5vZGUgVGhlIGNhbmRpZGF0ZSBET00gbm9kZS5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIERPTSBlbGVtZW50IGNvbnRhaW5zIGEgZGlyZWN0IGNoaWxkIHRoYXQgd2FzXG4gKiByZW5kZXJlZCBieSBSZWFjdCBidXQgaXMgbm90IGEgcm9vdCBlbGVtZW50LlxuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIGhhc05vblJvb3RSZWFjdENoaWxkKG5vZGUpIHtcbiAgdmFyIHJlYWN0Um9vdElEID0gZ2V0UmVhY3RSb290SUQobm9kZSk7XG4gIHJldHVybiByZWFjdFJvb3RJRCA/IHJlYWN0Um9vdElEICE9PSBSZWFjdEluc3RhbmNlSGFuZGxlcy5nZXRSZWFjdFJvb3RJREZyb21Ob2RlSUQocmVhY3RSb290SUQpIDogZmFsc2U7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmlyc3QgKGRlZXBlc3QpIGFuY2VzdG9yIG9mIGEgbm9kZSB3aGljaCBpcyByZW5kZXJlZCBieSB0aGlzIGNvcHlcbiAqIG9mIFJlYWN0LlxuICovXG5mdW5jdGlvbiBmaW5kRmlyc3RSZWFjdERPTUltcGwobm9kZSkge1xuICAvLyBUaGlzIG5vZGUgbWlnaHQgYmUgZnJvbSBhbm90aGVyIFJlYWN0IGluc3RhbmNlLCBzbyB3ZSBtYWtlIHN1cmUgbm90IHRvXG4gIC8vIGV4YW1pbmUgdGhlIG5vZGUgY2FjaGUgaGVyZVxuICBmb3IgKDsgbm9kZSAmJiBub2RlLnBhcmVudE5vZGUgIT09IG5vZGU7IG5vZGUgPSBub2RlLnBhcmVudE5vZGUpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gMSkge1xuICAgICAgLy8gTm90IGEgRE9NRWxlbWVudCwgdGhlcmVmb3JlIG5vdCBhIFJlYWN0IGNvbXBvbmVudFxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHZhciBub2RlSUQgPSBpbnRlcm5hbEdldElEKG5vZGUpO1xuICAgIGlmICghbm9kZUlEKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgdmFyIHJlYWN0Um9vdElEID0gUmVhY3RJbnN0YW5jZUhhbmRsZXMuZ2V0UmVhY3RSb290SURGcm9tTm9kZUlEKG5vZGVJRCk7XG5cbiAgICAvLyBJZiBjb250YWluZXJzQnlSZWFjdFJvb3RJRCBjb250YWlucyB0aGUgY29udGFpbmVyIHdlIGZpbmQgYnkgY3Jhd2xpbmcgdXBcbiAgICAvLyB0aGUgdHJlZSwgd2Uga25vdyB0aGF0IHRoaXMgaW5zdGFuY2Ugb2YgUmVhY3QgcmVuZGVyZWQgdGhlIG5vZGUuXG4gICAgLy8gbmIuIGlzVmFsaWQncyBzdHJhdGVneSAod2l0aCBjb250YWluc05vZGUpIGRvZXMgbm90IHdvcmsgYmVjYXVzZSByZW5kZXJcbiAgICAvLyB0cmVlcyBtYXkgYmUgbmVzdGVkIGFuZCB3ZSBkb24ndCB3YW50IGEgZmFsc2UgcG9zaXRpdmUgaW4gdGhhdCBjYXNlLlxuICAgIHZhciBjdXJyZW50ID0gbm9kZTtcbiAgICB2YXIgbGFzdElEO1xuICAgIGRvIHtcbiAgICAgIGxhc3RJRCA9IGludGVybmFsR2V0SUQoY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnROb2RlO1xuICAgICAgaWYgKGN1cnJlbnQgPT0gbnVsbCkge1xuICAgICAgICAvLyBUaGUgcGFzc2VkLWluIG5vZGUgaGFzIGJlZW4gZGV0YWNoZWQgZnJvbSB0aGUgY29udGFpbmVyIGl0IHdhc1xuICAgICAgICAvLyBvcmlnaW5hbGx5IHJlbmRlcmVkIGludG8uXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKGxhc3RJRCAhPT0gcmVhY3RSb290SUQpO1xuXG4gICAgaWYgKGN1cnJlbnQgPT09IGNvbnRhaW5lcnNCeVJlYWN0Um9vdElEW3JlYWN0Um9vdElEXSkge1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFRlbXBvcmFyeSAoPykgaGFjayBzbyB0aGF0IHdlIGNhbiBzdG9yZSBhbGwgdG9wLWxldmVsIHBlbmRpbmcgdXBkYXRlcyBvblxuICogY29tcG9zaXRlcyBpbnN0ZWFkIG9mIGhhdmluZyB0byB3b3JyeSBhYm91dCBkaWZmZXJlbnQgdHlwZXMgb2YgY29tcG9uZW50c1xuICogaGVyZS5cbiAqL1xudmFyIFRvcExldmVsV3JhcHBlciA9IGZ1bmN0aW9uICgpIHt9O1xuVG9wTGV2ZWxXcmFwcGVyLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50ID0ge307XG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBUb3BMZXZlbFdyYXBwZXIuZGlzcGxheU5hbWUgPSAnVG9wTGV2ZWxXcmFwcGVyJztcbn1cblRvcExldmVsV3JhcHBlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAvLyB0aGlzLnByb3BzIGlzIGFjdHVhbGx5IGEgUmVhY3RFbGVtZW50XG4gIHJldHVybiB0aGlzLnByb3BzO1xufTtcblxuLyoqXG4gKiBNb3VudGluZyBpcyB0aGUgcHJvY2VzcyBvZiBpbml0aWFsaXppbmcgYSBSZWFjdCBjb21wb25lbnQgYnkgY3JlYXRpbmcgaXRzXG4gKiByZXByZXNlbnRhdGl2ZSBET00gZWxlbWVudHMgYW5kIGluc2VydGluZyB0aGVtIGludG8gYSBzdXBwbGllZCBgY29udGFpbmVyYC5cbiAqIEFueSBwcmlvciBjb250ZW50IGluc2lkZSBgY29udGFpbmVyYCBpcyBkZXN0cm95ZWQgaW4gdGhlIHByb2Nlc3MuXG4gKlxuICogICBSZWFjdE1vdW50LnJlbmRlcihcbiAqICAgICBjb21wb25lbnQsXG4gKiAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpXG4gKiAgICk7XG4gKlxuICogICA8ZGl2IGlkPVwiY29udGFpbmVyXCI+ICAgICAgICAgICAgICAgICAgIDwtLSBTdXBwbGllZCBgY29udGFpbmVyYC5cbiAqICAgICA8ZGl2IGRhdGEtcmVhY3RpZD1cIi4zXCI+ICAgICAgICAgICAgICA8LS0gUmVuZGVyZWQgcmVhY3RSb290IG9mIFJlYWN0XG4gKiAgICAgICAvLyAuLi4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuXG4gKiAgICAgPC9kaXY+XG4gKiAgIDwvZGl2PlxuICpcbiAqIEluc2lkZSBvZiBgY29udGFpbmVyYCwgdGhlIGZpcnN0IGVsZW1lbnQgcmVuZGVyZWQgaXMgdGhlIFwicmVhY3RSb290XCIuXG4gKi9cbnZhciBSZWFjdE1vdW50ID0ge1xuXG4gIFRvcExldmVsV3JhcHBlcjogVG9wTGV2ZWxXcmFwcGVyLFxuXG4gIC8qKiBFeHBvc2VkIGZvciBkZWJ1Z2dpbmcgcHVycG9zZXMgKiovXG4gIF9pbnN0YW5jZXNCeVJlYWN0Um9vdElEOiBpbnN0YW5jZXNCeVJlYWN0Um9vdElELFxuXG4gIC8qKlxuICAgKiBUaGlzIGlzIGEgaG9vayBwcm92aWRlZCB0byBzdXBwb3J0IHJlbmRlcmluZyBSZWFjdCBjb21wb25lbnRzIHdoaWxlXG4gICAqIGVuc3VyaW5nIHRoYXQgdGhlIGFwcGFyZW50IHNjcm9sbCBwb3NpdGlvbiBvZiBpdHMgYGNvbnRhaW5lcmAgZG9lcyBub3RcbiAgICogY2hhbmdlLlxuICAgKlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGNvbnRhaW5lciBUaGUgYGNvbnRhaW5lcmAgYmVpbmcgcmVuZGVyZWQgaW50by5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gcmVuZGVyQ2FsbGJhY2sgVGhpcyBtdXN0IGJlIGNhbGxlZCBvbmNlIHRvIGRvIHRoZSByZW5kZXIuXG4gICAqL1xuICBzY3JvbGxNb25pdG9yOiBmdW5jdGlvbiAoY29udGFpbmVyLCByZW5kZXJDYWxsYmFjaykge1xuICAgIHJlbmRlckNhbGxiYWNrKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRha2UgYSBjb21wb25lbnQgdGhhdCdzIGFscmVhZHkgbW91bnRlZCBpbnRvIHRoZSBET00gYW5kIHJlcGxhY2UgaXRzIHByb3BzXG4gICAqIEBwYXJhbSB7UmVhY3RDb21wb25lbnR9IHByZXZDb21wb25lbnQgY29tcG9uZW50IGluc3RhbmNlIGFscmVhZHkgaW4gdGhlIERPTVxuICAgKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gbmV4dEVsZW1lbnQgY29tcG9uZW50IGluc3RhbmNlIHRvIHJlbmRlclxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGNvbnRhaW5lciBjb250YWluZXIgdG8gcmVuZGVyIGludG9cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIGZ1bmN0aW9uIHRyaWdnZXJlZCBvbiBjb21wbGV0aW9uXG4gICAqL1xuICBfdXBkYXRlUm9vdENvbXBvbmVudDogZnVuY3Rpb24gKHByZXZDb21wb25lbnQsIG5leHRFbGVtZW50LCBjb250YWluZXIsIGNhbGxiYWNrKSB7XG4gICAgUmVhY3RNb3VudC5zY3JvbGxNb25pdG9yKGNvbnRhaW5lciwgZnVuY3Rpb24gKCkge1xuICAgICAgUmVhY3RVcGRhdGVRdWV1ZS5lbnF1ZXVlRWxlbWVudEludGVybmFsKHByZXZDb21wb25lbnQsIG5leHRFbGVtZW50KTtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBSZWFjdFVwZGF0ZVF1ZXVlLmVucXVldWVDYWxsYmFja0ludGVybmFsKHByZXZDb21wb25lbnQsIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvLyBSZWNvcmQgdGhlIHJvb3QgZWxlbWVudCBpbiBjYXNlIGl0IGxhdGVyIGdldHMgdHJhbnNwbGFudGVkLlxuICAgICAgcm9vdEVsZW1lbnRzQnlSZWFjdFJvb3RJRFtnZXRSZWFjdFJvb3RJRChjb250YWluZXIpXSA9IGdldFJlYWN0Um9vdEVsZW1lbnRJbkNvbnRhaW5lcihjb250YWluZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBwcmV2Q29tcG9uZW50O1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGNvbXBvbmVudCBpbnRvIHRoZSBpbnN0YW5jZSBtYXAgYW5kIHN0YXJ0cyBzY3JvbGwgdmFsdWVcbiAgICogbW9uaXRvcmluZ1xuICAgKiBAcGFyYW0ge1JlYWN0Q29tcG9uZW50fSBuZXh0Q29tcG9uZW50IGNvbXBvbmVudCBpbnN0YW5jZSB0byByZW5kZXJcbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBjb250YWluZXIgY29udGFpbmVyIHRvIHJlbmRlciBpbnRvXG4gICAqIEByZXR1cm4ge3N0cmluZ30gcmVhY3RSb290IElEIHByZWZpeFxuICAgKi9cbiAgX3JlZ2lzdGVyQ29tcG9uZW50OiBmdW5jdGlvbiAobmV4dENvbXBvbmVudCwgY29udGFpbmVyKSB7XG4gICAgIShjb250YWluZXIgJiYgKGNvbnRhaW5lci5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFX1RZUEUgfHwgY29udGFpbmVyLm5vZGVUeXBlID09PSBET0NfTk9ERV9UWVBFIHx8IGNvbnRhaW5lci5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERV9UWVBFKSkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnX3JlZ2lzdGVyQ29tcG9uZW50KC4uLik6IFRhcmdldCBjb250YWluZXIgaXMgbm90IGEgRE9NIGVsZW1lbnQuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuXG4gICAgUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyLmVuc3VyZVNjcm9sbFZhbHVlTW9uaXRvcmluZygpO1xuXG4gICAgdmFyIHJlYWN0Um9vdElEID0gUmVhY3RNb3VudC5yZWdpc3RlckNvbnRhaW5lcihjb250YWluZXIpO1xuICAgIGluc3RhbmNlc0J5UmVhY3RSb290SURbcmVhY3RSb290SURdID0gbmV4dENvbXBvbmVudDtcbiAgICByZXR1cm4gcmVhY3RSb290SUQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbmRlciBhIG5ldyBjb21wb25lbnQgaW50byB0aGUgRE9NLlxuICAgKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gbmV4dEVsZW1lbnQgZWxlbWVudCB0byByZW5kZXJcbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBjb250YWluZXIgY29udGFpbmVyIHRvIHJlbmRlciBpbnRvXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2hvdWxkUmV1c2VNYXJrdXAgaWYgd2Ugc2hvdWxkIHNraXAgdGhlIG1hcmt1cCBpbnNlcnRpb25cbiAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnR9IG5leHRDb21wb25lbnRcbiAgICovXG4gIF9yZW5kZXJOZXdSb290Q29tcG9uZW50OiBmdW5jdGlvbiAobmV4dEVsZW1lbnQsIGNvbnRhaW5lciwgc2hvdWxkUmV1c2VNYXJrdXAsIGNvbnRleHQpIHtcbiAgICAvLyBWYXJpb3VzIHBhcnRzIG9mIG91ciBjb2RlIChzdWNoIGFzIFJlYWN0Q29tcG9zaXRlQ29tcG9uZW50J3NcbiAgICAvLyBfcmVuZGVyVmFsaWRhdGVkQ29tcG9uZW50KSBhc3N1bWUgdGhhdCBjYWxscyB0byByZW5kZXIgYXJlbid0IG5lc3RlZDtcbiAgICAvLyB2ZXJpZnkgdGhhdCB0aGF0J3MgdGhlIGNhc2UuXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCA9PSBudWxsLCAnX3JlbmRlck5ld1Jvb3RDb21wb25lbnQoKTogUmVuZGVyIG1ldGhvZHMgc2hvdWxkIGJlIGEgcHVyZSBmdW5jdGlvbiAnICsgJ29mIHByb3BzIGFuZCBzdGF0ZTsgdHJpZ2dlcmluZyBuZXN0ZWQgY29tcG9uZW50IHVwZGF0ZXMgZnJvbSAnICsgJ3JlbmRlciBpcyBub3QgYWxsb3dlZC4gSWYgbmVjZXNzYXJ5LCB0cmlnZ2VyIG5lc3RlZCB1cGRhdGVzIGluICcgKyAnY29tcG9uZW50RGlkVXBkYXRlLiBDaGVjayB0aGUgcmVuZGVyIG1ldGhvZCBvZiAlcy4nLCBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50ICYmIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQuZ2V0TmFtZSgpIHx8ICdSZWFjdENvbXBvc2l0ZUNvbXBvbmVudCcpIDogdW5kZWZpbmVkO1xuXG4gICAgdmFyIGNvbXBvbmVudEluc3RhbmNlID0gaW5zdGFudGlhdGVSZWFjdENvbXBvbmVudChuZXh0RWxlbWVudCwgbnVsbCk7XG4gICAgdmFyIHJlYWN0Um9vdElEID0gUmVhY3RNb3VudC5fcmVnaXN0ZXJDb21wb25lbnQoY29tcG9uZW50SW5zdGFuY2UsIGNvbnRhaW5lcik7XG5cbiAgICAvLyBUaGUgaW5pdGlhbCByZW5kZXIgaXMgc3luY2hyb25vdXMgYnV0IGFueSB1cGRhdGVzIHRoYXQgaGFwcGVuIGR1cmluZ1xuICAgIC8vIHJlbmRlcmluZywgaW4gY29tcG9uZW50V2lsbE1vdW50IG9yIGNvbXBvbmVudERpZE1vdW50LCB3aWxsIGJlIGJhdGNoZWRcbiAgICAvLyBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgYmF0Y2hpbmcgc3RyYXRlZ3kuXG5cbiAgICBSZWFjdFVwZGF0ZXMuYmF0Y2hlZFVwZGF0ZXMoYmF0Y2hlZE1vdW50Q29tcG9uZW50SW50b05vZGUsIGNvbXBvbmVudEluc3RhbmNlLCByZWFjdFJvb3RJRCwgY29udGFpbmVyLCBzaG91bGRSZXVzZU1hcmt1cCwgY29udGV4dCk7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLy8gUmVjb3JkIHRoZSByb290IGVsZW1lbnQgaW4gY2FzZSBpdCBsYXRlciBnZXRzIHRyYW5zcGxhbnRlZC5cbiAgICAgIHJvb3RFbGVtZW50c0J5UmVhY3RSb290SURbcmVhY3RSb290SURdID0gZ2V0UmVhY3RSb290RWxlbWVudEluQ29udGFpbmVyKGNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbXBvbmVudEluc3RhbmNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZW5kZXJzIGEgUmVhY3QgY29tcG9uZW50IGludG8gdGhlIERPTSBpbiB0aGUgc3VwcGxpZWQgYGNvbnRhaW5lcmAuXG4gICAqXG4gICAqIElmIHRoZSBSZWFjdCBjb21wb25lbnQgd2FzIHByZXZpb3VzbHkgcmVuZGVyZWQgaW50byBgY29udGFpbmVyYCwgdGhpcyB3aWxsXG4gICAqIHBlcmZvcm0gYW4gdXBkYXRlIG9uIGl0IGFuZCBvbmx5IG11dGF0ZSB0aGUgRE9NIGFzIG5lY2Vzc2FyeSB0byByZWZsZWN0IHRoZVxuICAgKiBsYXRlc3QgUmVhY3QgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q29tcG9uZW50fSBwYXJlbnRDb21wb25lbnQgVGhlIGNvbmNlcHR1YWwgcGFyZW50IG9mIHRoaXMgcmVuZGVyIHRyZWUuXG4gICAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBuZXh0RWxlbWVudCBDb21wb25lbnQgZWxlbWVudCB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gY29udGFpbmVyIERPTSBlbGVtZW50IHRvIHJlbmRlciBpbnRvLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgZnVuY3Rpb24gdHJpZ2dlcmVkIG9uIGNvbXBsZXRpb25cbiAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnR9IENvbXBvbmVudCBpbnN0YW5jZSByZW5kZXJlZCBpbiBgY29udGFpbmVyYC5cbiAgICovXG4gIHJlbmRlclN1YnRyZWVJbnRvQ29udGFpbmVyOiBmdW5jdGlvbiAocGFyZW50Q29tcG9uZW50LCBuZXh0RWxlbWVudCwgY29udGFpbmVyLCBjYWxsYmFjaykge1xuICAgICEocGFyZW50Q29tcG9uZW50ICE9IG51bGwgJiYgcGFyZW50Q29tcG9uZW50Ll9yZWFjdEludGVybmFsSW5zdGFuY2UgIT0gbnVsbCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAncGFyZW50Q29tcG9uZW50IG11c3QgYmUgYSB2YWxpZCBSZWFjdCBDb21wb25lbnQnKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIFJlYWN0TW91bnQuX3JlbmRlclN1YnRyZWVJbnRvQ29udGFpbmVyKHBhcmVudENvbXBvbmVudCwgbmV4dEVsZW1lbnQsIGNvbnRhaW5lciwgY2FsbGJhY2spO1xuICB9LFxuXG4gIF9yZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lcjogZnVuY3Rpb24gKHBhcmVudENvbXBvbmVudCwgbmV4dEVsZW1lbnQsIGNvbnRhaW5lciwgY2FsbGJhY2spIHtcbiAgICAhUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KG5leHRFbGVtZW50KSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdERPTS5yZW5kZXIoKTogSW52YWxpZCBjb21wb25lbnQgZWxlbWVudC4lcycsIHR5cGVvZiBuZXh0RWxlbWVudCA9PT0gJ3N0cmluZycgPyAnIEluc3RlYWQgb2YgcGFzc2luZyBhbiBlbGVtZW50IHN0cmluZywgbWFrZSBzdXJlIHRvIGluc3RhbnRpYXRlICcgKyAnaXQgYnkgcGFzc2luZyBpdCB0byBSZWFjdC5jcmVhdGVFbGVtZW50LicgOiB0eXBlb2YgbmV4dEVsZW1lbnQgPT09ICdmdW5jdGlvbicgPyAnIEluc3RlYWQgb2YgcGFzc2luZyBhIGNvbXBvbmVudCBjbGFzcywgbWFrZSBzdXJlIHRvIGluc3RhbnRpYXRlICcgKyAnaXQgYnkgcGFzc2luZyBpdCB0byBSZWFjdC5jcmVhdGVFbGVtZW50LicgOlxuICAgIC8vIENoZWNrIGlmIGl0IHF1YWNrcyBsaWtlIGFuIGVsZW1lbnRcbiAgICBuZXh0RWxlbWVudCAhPSBudWxsICYmIG5leHRFbGVtZW50LnByb3BzICE9PSB1bmRlZmluZWQgPyAnIFRoaXMgbWF5IGJlIGNhdXNlZCBieSB1bmludGVudGlvbmFsbHkgbG9hZGluZyB0d28gaW5kZXBlbmRlbnQgJyArICdjb3BpZXMgb2YgUmVhY3QuJyA6ICcnKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG5cbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyghY29udGFpbmVyIHx8ICFjb250YWluZXIudGFnTmFtZSB8fCBjb250YWluZXIudGFnTmFtZS50b1VwcGVyQ2FzZSgpICE9PSAnQk9EWScsICdyZW5kZXIoKTogUmVuZGVyaW5nIGNvbXBvbmVudHMgZGlyZWN0bHkgaW50byBkb2N1bWVudC5ib2R5IGlzICcgKyAnZGlzY291cmFnZWQsIHNpbmNlIGl0cyBjaGlsZHJlbiBhcmUgb2Z0ZW4gbWFuaXB1bGF0ZWQgYnkgdGhpcmQtcGFydHkgJyArICdzY3JpcHRzIGFuZCBicm93c2VyIGV4dGVuc2lvbnMuIFRoaXMgbWF5IGxlYWQgdG8gc3VidGxlICcgKyAncmVjb25jaWxpYXRpb24gaXNzdWVzLiBUcnkgcmVuZGVyaW5nIGludG8gYSBjb250YWluZXIgZWxlbWVudCBjcmVhdGVkICcgKyAnZm9yIHlvdXIgYXBwLicpIDogdW5kZWZpbmVkO1xuXG4gICAgdmFyIG5leHRXcmFwcGVkRWxlbWVudCA9IG5ldyBSZWFjdEVsZW1lbnQoVG9wTGV2ZWxXcmFwcGVyLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBuZXh0RWxlbWVudCk7XG5cbiAgICB2YXIgcHJldkNvbXBvbmVudCA9IGluc3RhbmNlc0J5UmVhY3RSb290SURbZ2V0UmVhY3RSb290SUQoY29udGFpbmVyKV07XG5cbiAgICBpZiAocHJldkNvbXBvbmVudCkge1xuICAgICAgdmFyIHByZXZXcmFwcGVkRWxlbWVudCA9IHByZXZDb21wb25lbnQuX2N1cnJlbnRFbGVtZW50O1xuICAgICAgdmFyIHByZXZFbGVtZW50ID0gcHJldldyYXBwZWRFbGVtZW50LnByb3BzO1xuICAgICAgaWYgKHNob3VsZFVwZGF0ZVJlYWN0Q29tcG9uZW50KHByZXZFbGVtZW50LCBuZXh0RWxlbWVudCkpIHtcbiAgICAgICAgdmFyIHB1YmxpY0luc3QgPSBwcmV2Q29tcG9uZW50Ll9yZW5kZXJlZENvbXBvbmVudC5nZXRQdWJsaWNJbnN0YW5jZSgpO1xuICAgICAgICB2YXIgdXBkYXRlZENhbGxiYWNrID0gY2FsbGJhY2sgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNhbGxiYWNrLmNhbGwocHVibGljSW5zdCk7XG4gICAgICAgIH07XG4gICAgICAgIFJlYWN0TW91bnQuX3VwZGF0ZVJvb3RDb21wb25lbnQocHJldkNvbXBvbmVudCwgbmV4dFdyYXBwZWRFbGVtZW50LCBjb250YWluZXIsIHVwZGF0ZWRDYWxsYmFjayk7XG4gICAgICAgIHJldHVybiBwdWJsaWNJbnN0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgUmVhY3RNb3VudC51bm1vdW50Q29tcG9uZW50QXROb2RlKGNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHJlYWN0Um9vdEVsZW1lbnQgPSBnZXRSZWFjdFJvb3RFbGVtZW50SW5Db250YWluZXIoY29udGFpbmVyKTtcbiAgICB2YXIgY29udGFpbmVySGFzUmVhY3RNYXJrdXAgPSByZWFjdFJvb3RFbGVtZW50ICYmICEhaW50ZXJuYWxHZXRJRChyZWFjdFJvb3RFbGVtZW50KTtcbiAgICB2YXIgY29udGFpbmVySGFzTm9uUm9vdFJlYWN0Q2hpbGQgPSBoYXNOb25Sb290UmVhY3RDaGlsZChjb250YWluZXIpO1xuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKCFjb250YWluZXJIYXNOb25Sb290UmVhY3RDaGlsZCwgJ3JlbmRlciguLi4pOiBSZXBsYWNpbmcgUmVhY3QtcmVuZGVyZWQgY2hpbGRyZW4gd2l0aCBhIG5ldyByb290ICcgKyAnY29tcG9uZW50LiBJZiB5b3UgaW50ZW5kZWQgdG8gdXBkYXRlIHRoZSBjaGlsZHJlbiBvZiB0aGlzIG5vZGUsICcgKyAneW91IHNob3VsZCBpbnN0ZWFkIGhhdmUgdGhlIGV4aXN0aW5nIGNoaWxkcmVuIHVwZGF0ZSB0aGVpciBzdGF0ZSAnICsgJ2FuZCByZW5kZXIgdGhlIG5ldyBjb21wb25lbnRzIGluc3RlYWQgb2YgY2FsbGluZyBSZWFjdERPTS5yZW5kZXIuJykgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICghY29udGFpbmVySGFzUmVhY3RNYXJrdXAgfHwgcmVhY3RSb290RWxlbWVudC5uZXh0U2libGluZykge1xuICAgICAgICB2YXIgcm9vdEVsZW1lbnRTaWJsaW5nID0gcmVhY3RSb290RWxlbWVudDtcbiAgICAgICAgd2hpbGUgKHJvb3RFbGVtZW50U2libGluZykge1xuICAgICAgICAgIGlmIChpbnRlcm5hbEdldElEKHJvb3RFbGVtZW50U2libGluZykpIHtcbiAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAncmVuZGVyKCk6IFRhcmdldCBub2RlIGhhcyBtYXJrdXAgcmVuZGVyZWQgYnkgUmVhY3QsIGJ1dCB0aGVyZSAnICsgJ2FyZSB1bnJlbGF0ZWQgbm9kZXMgYXMgd2VsbC4gVGhpcyBpcyBtb3N0IGNvbW1vbmx5IGNhdXNlZCBieSAnICsgJ3doaXRlLXNwYWNlIGluc2VydGVkIGFyb3VuZCBzZXJ2ZXItcmVuZGVyZWQgbWFya3VwLicpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJvb3RFbGVtZW50U2libGluZyA9IHJvb3RFbGVtZW50U2libGluZy5uZXh0U2libGluZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzaG91bGRSZXVzZU1hcmt1cCA9IGNvbnRhaW5lckhhc1JlYWN0TWFya3VwICYmICFwcmV2Q29tcG9uZW50ICYmICFjb250YWluZXJIYXNOb25Sb290UmVhY3RDaGlsZDtcbiAgICB2YXIgY29tcG9uZW50ID0gUmVhY3RNb3VudC5fcmVuZGVyTmV3Um9vdENvbXBvbmVudChuZXh0V3JhcHBlZEVsZW1lbnQsIGNvbnRhaW5lciwgc2hvdWxkUmV1c2VNYXJrdXAsIHBhcmVudENvbXBvbmVudCAhPSBudWxsID8gcGFyZW50Q29tcG9uZW50Ll9yZWFjdEludGVybmFsSW5zdGFuY2UuX3Byb2Nlc3NDaGlsZENvbnRleHQocGFyZW50Q29tcG9uZW50Ll9yZWFjdEludGVybmFsSW5zdGFuY2UuX2NvbnRleHQpIDogZW1wdHlPYmplY3QpLl9yZW5kZXJlZENvbXBvbmVudC5nZXRQdWJsaWNJbnN0YW5jZSgpO1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2suY2FsbChjb21wb25lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gY29tcG9uZW50O1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZW5kZXJzIGEgUmVhY3QgY29tcG9uZW50IGludG8gdGhlIERPTSBpbiB0aGUgc3VwcGxpZWQgYGNvbnRhaW5lcmAuXG4gICAqXG4gICAqIElmIHRoZSBSZWFjdCBjb21wb25lbnQgd2FzIHByZXZpb3VzbHkgcmVuZGVyZWQgaW50byBgY29udGFpbmVyYCwgdGhpcyB3aWxsXG4gICAqIHBlcmZvcm0gYW4gdXBkYXRlIG9uIGl0IGFuZCBvbmx5IG11dGF0ZSB0aGUgRE9NIGFzIG5lY2Vzc2FyeSB0byByZWZsZWN0IHRoZVxuICAgKiBsYXRlc3QgUmVhY3QgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gbmV4dEVsZW1lbnQgQ29tcG9uZW50IGVsZW1lbnQgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGNvbnRhaW5lciBET00gZWxlbWVudCB0byByZW5kZXIgaW50by5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIGZ1bmN0aW9uIHRyaWdnZXJlZCBvbiBjb21wbGV0aW9uXG4gICAqIEByZXR1cm4ge1JlYWN0Q29tcG9uZW50fSBDb21wb25lbnQgaW5zdGFuY2UgcmVuZGVyZWQgaW4gYGNvbnRhaW5lcmAuXG4gICAqL1xuICByZW5kZXI6IGZ1bmN0aW9uIChuZXh0RWxlbWVudCwgY29udGFpbmVyLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBSZWFjdE1vdW50Ll9yZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lcihudWxsLCBuZXh0RWxlbWVudCwgY29udGFpbmVyLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNvbnRhaW5lciBub2RlIGludG8gd2hpY2ggUmVhY3QgY29tcG9uZW50cyB3aWxsIGJlIHJlbmRlcmVkLlxuICAgKiBUaGlzIGFsc28gY3JlYXRlcyB0aGUgXCJyZWFjdFJvb3RcIiBJRCB0aGF0IHdpbGwgYmUgYXNzaWduZWQgdG8gdGhlIGVsZW1lbnRcbiAgICogcmVuZGVyZWQgd2l0aGluLlxuICAgKlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGNvbnRhaW5lciBET00gZWxlbWVudCB0byByZWdpc3RlciBhcyBhIGNvbnRhaW5lci5cbiAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgXCJyZWFjdFJvb3RcIiBJRCBvZiBlbGVtZW50cyByZW5kZXJlZCB3aXRoaW4uXG4gICAqL1xuICByZWdpc3RlckNvbnRhaW5lcjogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xuICAgIHZhciByZWFjdFJvb3RJRCA9IGdldFJlYWN0Um9vdElEKGNvbnRhaW5lcik7XG4gICAgaWYgKHJlYWN0Um9vdElEKSB7XG4gICAgICAvLyBJZiBvbmUgZXhpc3RzLCBtYWtlIHN1cmUgaXQgaXMgYSB2YWxpZCBcInJlYWN0Um9vdFwiIElELlxuICAgICAgcmVhY3RSb290SUQgPSBSZWFjdEluc3RhbmNlSGFuZGxlcy5nZXRSZWFjdFJvb3RJREZyb21Ob2RlSUQocmVhY3RSb290SUQpO1xuICAgIH1cbiAgICBpZiAoIXJlYWN0Um9vdElEKSB7XG4gICAgICAvLyBObyB2YWxpZCBcInJlYWN0Um9vdFwiIElEIGZvdW5kLCBjcmVhdGUgb25lLlxuICAgICAgcmVhY3RSb290SUQgPSBSZWFjdEluc3RhbmNlSGFuZGxlcy5jcmVhdGVSZWFjdFJvb3RJRCgpO1xuICAgIH1cbiAgICBjb250YWluZXJzQnlSZWFjdFJvb3RJRFtyZWFjdFJvb3RJRF0gPSBjb250YWluZXI7XG4gICAgcmV0dXJuIHJlYWN0Um9vdElEO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVbm1vdW50cyBhbmQgZGVzdHJveXMgdGhlIFJlYWN0IGNvbXBvbmVudCByZW5kZXJlZCBpbiB0aGUgYGNvbnRhaW5lcmAuXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gY29udGFpbmVyIERPTSBlbGVtZW50IGNvbnRhaW5pbmcgYSBSZWFjdCBjb21wb25lbnQuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgYSBjb21wb25lbnQgd2FzIGZvdW5kIGluIGFuZCB1bm1vdW50ZWQgZnJvbVxuICAgKiAgICAgICAgICAgICAgICAgICBgY29udGFpbmVyYFxuICAgKi9cbiAgdW5tb3VudENvbXBvbmVudEF0Tm9kZTogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xuICAgIC8vIFZhcmlvdXMgcGFydHMgb2Ygb3VyIGNvZGUgKHN1Y2ggYXMgUmVhY3RDb21wb3NpdGVDb21wb25lbnQnc1xuICAgIC8vIF9yZW5kZXJWYWxpZGF0ZWRDb21wb25lbnQpIGFzc3VtZSB0aGF0IGNhbGxzIHRvIHJlbmRlciBhcmVuJ3QgbmVzdGVkO1xuICAgIC8vIHZlcmlmeSB0aGF0IHRoYXQncyB0aGUgY2FzZS4gKFN0cmljdGx5IHNwZWFraW5nLCB1bm1vdW50aW5nIHdvbid0IGNhdXNlIGFcbiAgICAvLyByZW5kZXIgYnV0IHdlIHN0aWxsIGRvbid0IGV4cGVjdCB0byBiZSBpbiBhIHJlbmRlciBjYWxsIGhlcmUuKVxuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQgPT0gbnVsbCwgJ3VubW91bnRDb21wb25lbnRBdE5vZGUoKTogUmVuZGVyIG1ldGhvZHMgc2hvdWxkIGJlIGEgcHVyZSBmdW5jdGlvbiAnICsgJ29mIHByb3BzIGFuZCBzdGF0ZTsgdHJpZ2dlcmluZyBuZXN0ZWQgY29tcG9uZW50IHVwZGF0ZXMgZnJvbSByZW5kZXIgJyArICdpcyBub3QgYWxsb3dlZC4gSWYgbmVjZXNzYXJ5LCB0cmlnZ2VyIG5lc3RlZCB1cGRhdGVzIGluICcgKyAnY29tcG9uZW50RGlkVXBkYXRlLiBDaGVjayB0aGUgcmVuZGVyIG1ldGhvZCBvZiAlcy4nLCBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50ICYmIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQuZ2V0TmFtZSgpIHx8ICdSZWFjdENvbXBvc2l0ZUNvbXBvbmVudCcpIDogdW5kZWZpbmVkO1xuXG4gICAgIShjb250YWluZXIgJiYgKGNvbnRhaW5lci5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFX1RZUEUgfHwgY29udGFpbmVyLm5vZGVUeXBlID09PSBET0NfTk9ERV9UWVBFIHx8IGNvbnRhaW5lci5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERV9UWVBFKSkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAndW5tb3VudENvbXBvbmVudEF0Tm9kZSguLi4pOiBUYXJnZXQgY29udGFpbmVyIGlzIG5vdCBhIERPTSBlbGVtZW50LicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcblxuICAgIHZhciByZWFjdFJvb3RJRCA9IGdldFJlYWN0Um9vdElEKGNvbnRhaW5lcik7XG4gICAgdmFyIGNvbXBvbmVudCA9IGluc3RhbmNlc0J5UmVhY3RSb290SURbcmVhY3RSb290SURdO1xuICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgbm9kZSBiZWluZyB1bm1vdW50ZWQgd2FzIHJlbmRlcmVkIGJ5IFJlYWN0LCBidXQgaXNuJ3QgYVxuICAgICAgLy8gcm9vdCBub2RlLlxuICAgICAgdmFyIGNvbnRhaW5lckhhc05vblJvb3RSZWFjdENoaWxkID0gaGFzTm9uUm9vdFJlYWN0Q2hpbGQoY29udGFpbmVyKTtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNvbnRhaW5lciBpdHNlbGYgaXMgYSBSZWFjdCByb290IG5vZGUuXG4gICAgICB2YXIgY29udGFpbmVySUQgPSBpbnRlcm5hbEdldElEKGNvbnRhaW5lcik7XG4gICAgICB2YXIgaXNDb250YWluZXJSZWFjdFJvb3QgPSBjb250YWluZXJJRCAmJiBjb250YWluZXJJRCA9PT0gUmVhY3RJbnN0YW5jZUhhbmRsZXMuZ2V0UmVhY3RSb290SURGcm9tTm9kZUlEKGNvbnRhaW5lcklEKTtcblxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoIWNvbnRhaW5lckhhc05vblJvb3RSZWFjdENoaWxkLCAndW5tb3VudENvbXBvbmVudEF0Tm9kZSgpOiBUaGUgbm9kZSB5b3VcXCdyZSBhdHRlbXB0aW5nIHRvIHVubW91bnQgJyArICd3YXMgcmVuZGVyZWQgYnkgUmVhY3QgYW5kIGlzIG5vdCBhIHRvcC1sZXZlbCBjb250YWluZXIuICVzJywgaXNDb250YWluZXJSZWFjdFJvb3QgPyAnWW91IG1heSBoYXZlIGFjY2lkZW50YWxseSBwYXNzZWQgaW4gYSBSZWFjdCByb290IG5vZGUgaW5zdGVhZCAnICsgJ29mIGl0cyBjb250YWluZXIuJyA6ICdJbnN0ZWFkLCBoYXZlIHRoZSBwYXJlbnQgY29tcG9uZW50IHVwZGF0ZSBpdHMgc3RhdGUgYW5kICcgKyAncmVyZW5kZXIgaW4gb3JkZXIgdG8gcmVtb3ZlIHRoaXMgY29tcG9uZW50LicpIDogdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIFJlYWN0VXBkYXRlcy5iYXRjaGVkVXBkYXRlcyh1bm1vdW50Q29tcG9uZW50RnJvbU5vZGUsIGNvbXBvbmVudCwgY29udGFpbmVyKTtcbiAgICBkZWxldGUgaW5zdGFuY2VzQnlSZWFjdFJvb3RJRFtyZWFjdFJvb3RJRF07XG4gICAgZGVsZXRlIGNvbnRhaW5lcnNCeVJlYWN0Um9vdElEW3JlYWN0Um9vdElEXTtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgZGVsZXRlIHJvb3RFbGVtZW50c0J5UmVhY3RSb290SURbcmVhY3RSb290SURdO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICAvKipcbiAgICogRmluZHMgdGhlIGNvbnRhaW5lciBET00gZWxlbWVudCB0aGF0IGNvbnRhaW5zIFJlYWN0IGNvbXBvbmVudCB0byB3aGljaCB0aGVcbiAgICogc3VwcGxpZWQgRE9NIGBpZGAgYmVsb25ncy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBvZiBhbiBlbGVtZW50IHJlbmRlcmVkIGJ5IGEgUmVhY3QgY29tcG9uZW50LlxuICAgKiBAcmV0dXJuIHs/RE9NRWxlbWVudH0gRE9NIGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgYGlkYC5cbiAgICovXG4gIGZpbmRSZWFjdENvbnRhaW5lckZvcklEOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgcmVhY3RSb290SUQgPSBSZWFjdEluc3RhbmNlSGFuZGxlcy5nZXRSZWFjdFJvb3RJREZyb21Ob2RlSUQoaWQpO1xuICAgIHZhciBjb250YWluZXIgPSBjb250YWluZXJzQnlSZWFjdFJvb3RJRFtyZWFjdFJvb3RJRF07XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIHJvb3RFbGVtZW50ID0gcm9vdEVsZW1lbnRzQnlSZWFjdFJvb3RJRFtyZWFjdFJvb3RJRF07XG4gICAgICBpZiAocm9vdEVsZW1lbnQgJiYgcm9vdEVsZW1lbnQucGFyZW50Tm9kZSAhPT0gY29udGFpbmVyKSB7XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKFxuICAgICAgICAvLyBDYWxsIGludGVybmFsR2V0SUQgaGVyZSBiZWNhdXNlIGdldElEIGNhbGxzIGlzVmFsaWQgd2hpY2ggY2FsbHNcbiAgICAgICAgLy8gZmluZFJlYWN0Q29udGFpbmVyRm9ySUQgKHRoaXMgZnVuY3Rpb24pLlxuICAgICAgICBpbnRlcm5hbEdldElEKHJvb3RFbGVtZW50KSA9PT0gcmVhY3RSb290SUQsICdSZWFjdE1vdW50OiBSb290IGVsZW1lbnQgSUQgZGlmZmVyZWQgZnJvbSByZWFjdFJvb3RJRC4nKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIGNvbnRhaW5lckNoaWxkID0gY29udGFpbmVyLmZpcnN0Q2hpbGQ7XG4gICAgICAgIGlmIChjb250YWluZXJDaGlsZCAmJiByZWFjdFJvb3RJRCA9PT0gaW50ZXJuYWxHZXRJRChjb250YWluZXJDaGlsZCkpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgY29udGFpbmVyIGhhcyBhIG5ldyBjaGlsZCB3aXRoIHRoZSBzYW1lIElEIGFzIHRoZSBvbGRcbiAgICAgICAgICAvLyByb290IGVsZW1lbnQsIHRoZW4gcm9vdEVsZW1lbnRzQnlSZWFjdFJvb3RJRFtyZWFjdFJvb3RJRF0gaXNcbiAgICAgICAgICAvLyBqdXN0IHN0YWxlIGFuZCBuZWVkcyB0byBiZSB1cGRhdGVkLiBUaGUgY2FzZSB0aGF0IGRlc2VydmVzIGFcbiAgICAgICAgICAvLyB3YXJuaW5nIGlzIHdoZW4gdGhlIGNvbnRhaW5lciBpcyBlbXB0eS5cbiAgICAgICAgICByb290RWxlbWVudHNCeVJlYWN0Um9vdElEW3JlYWN0Um9vdElEXSA9IGNvbnRhaW5lckNoaWxkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnUmVhY3RNb3VudDogUm9vdCBlbGVtZW50IGhhcyBiZWVuIHJlbW92ZWQgZnJvbSBpdHMgb3JpZ2luYWwgJyArICdjb250YWluZXIuIE5ldyBjb250YWluZXI6ICVzJywgcm9vdEVsZW1lbnQucGFyZW50Tm9kZSkgOiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbiBlbGVtZW50IHJlbmRlcmVkIGJ5IFJlYWN0IHdpdGggdGhlIHN1cHBsaWVkIElELlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgSUQgb2YgYSBET00gbm9kZSBpbiB0aGUgUmVhY3QgY29tcG9uZW50LlxuICAgKiBAcmV0dXJuIHtET01FbGVtZW50fSBSb290IERPTSBub2RlIG9mIHRoZSBSZWFjdCBjb21wb25lbnQuXG4gICAqL1xuICBmaW5kUmVhY3ROb2RlQnlJRDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIHJlYWN0Um9vdCA9IFJlYWN0TW91bnQuZmluZFJlYWN0Q29udGFpbmVyRm9ySUQoaWQpO1xuICAgIHJldHVybiBSZWFjdE1vdW50LmZpbmRDb21wb25lbnRSb290KHJlYWN0Um9vdCwgaWQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUcmF2ZXJzZXMgdXAgdGhlIGFuY2VzdG9ycyBvZiB0aGUgc3VwcGxpZWQgbm9kZSB0byBmaW5kIGEgbm9kZSB0aGF0IGlzIGFcbiAgICogRE9NIHJlcHJlc2VudGF0aW9uIG9mIGEgUmVhY3QgY29tcG9uZW50IHJlbmRlcmVkIGJ5IHRoaXMgY29weSBvZiBSZWFjdC5cbiAgICpcbiAgICogQHBhcmFtIHsqfSBub2RlXG4gICAqIEByZXR1cm4gez9ET01FdmVudFRhcmdldH1cbiAgICogQGludGVybmFsXG4gICAqL1xuICBnZXRGaXJzdFJlYWN0RE9NOiBmdW5jdGlvbiAobm9kZSkge1xuICAgIHJldHVybiBmaW5kRmlyc3RSZWFjdERPTUltcGwobm9kZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZpbmRzIGEgbm9kZSB3aXRoIHRoZSBzdXBwbGllZCBgdGFyZ2V0SURgIGluc2lkZSBvZiB0aGUgc3VwcGxpZWRcbiAgICogYGFuY2VzdG9yTm9kZWAuICBFeHBsb2l0cyB0aGUgSUQgbmFtaW5nIHNjaGVtZSB0byBwZXJmb3JtIHRoZSBzZWFyY2hcbiAgICogcXVpY2tseS5cbiAgICpcbiAgICogQHBhcmFtIHtET01FdmVudFRhcmdldH0gYW5jZXN0b3JOb2RlIFNlYXJjaCBmcm9tIHRoaXMgcm9vdC5cbiAgICogQHBhcmFybSB7c3RyaW5nfSB0YXJnZXRJRCBJRCBvZiB0aGUgRE9NIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjb21wb25lbnQuXG4gICAqIEByZXR1cm4ge0RPTUV2ZW50VGFyZ2V0fSBET00gbm9kZSB3aXRoIHRoZSBzdXBwbGllZCBgdGFyZ2V0SURgLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGZpbmRDb21wb25lbnRSb290OiBmdW5jdGlvbiAoYW5jZXN0b3JOb2RlLCB0YXJnZXRJRCkge1xuICAgIHZhciBmaXJzdENoaWxkcmVuID0gZmluZENvbXBvbmVudFJvb3RSZXVzYWJsZUFycmF5O1xuICAgIHZhciBjaGlsZEluZGV4ID0gMDtcblxuICAgIHZhciBkZWVwZXN0QW5jZXN0b3IgPSBmaW5kRGVlcGVzdENhY2hlZEFuY2VzdG9yKHRhcmdldElEKSB8fCBhbmNlc3Rvck5vZGU7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLy8gVGhpcyB3aWxsIHRocm93IG9uIHRoZSBuZXh0IGxpbmU7IGdpdmUgYW4gZWFybHkgd2FybmluZ1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZGVlcGVzdEFuY2VzdG9yICE9IG51bGwsICdSZWFjdCBjYW5cXCd0IGZpbmQgdGhlIHJvb3QgY29tcG9uZW50IG5vZGUgZm9yIGRhdGEtcmVhY3RpZCB2YWx1ZSAnICsgJ2Alc2AuIElmIHlvdVxcJ3JlIHNlZWluZyB0aGlzIG1lc3NhZ2UsIGl0IHByb2JhYmx5IG1lYW5zIHRoYXQgJyArICd5b3VcXCd2ZSBsb2FkZWQgdHdvIGNvcGllcyBvZiBSZWFjdCBvbiB0aGUgcGFnZS4gQXQgdGhpcyB0aW1lLCBvbmx5ICcgKyAnYSBzaW5nbGUgY29weSBvZiBSZWFjdCBjYW4gYmUgbG9hZGVkIGF0IGEgdGltZS4nLCB0YXJnZXRJRCkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZmlyc3RDaGlsZHJlblswXSA9IGRlZXBlc3RBbmNlc3Rvci5maXJzdENoaWxkO1xuICAgIGZpcnN0Q2hpbGRyZW4ubGVuZ3RoID0gMTtcblxuICAgIHdoaWxlIChjaGlsZEluZGV4IDwgZmlyc3RDaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIHZhciBjaGlsZCA9IGZpcnN0Q2hpbGRyZW5bY2hpbGRJbmRleCsrXTtcbiAgICAgIHZhciB0YXJnZXRDaGlsZDtcblxuICAgICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICAgIHZhciBjaGlsZElEID0gUmVhY3RNb3VudC5nZXRJRChjaGlsZCk7XG4gICAgICAgIGlmIChjaGlsZElEKSB7XG4gICAgICAgICAgLy8gRXZlbiBpZiB3ZSBmaW5kIHRoZSBub2RlIHdlJ3JlIGxvb2tpbmcgZm9yLCB3ZSBmaW5pc2ggbG9vcGluZ1xuICAgICAgICAgIC8vIHRocm91Z2ggaXRzIHNpYmxpbmdzIHRvIGVuc3VyZSB0aGV5J3JlIGNhY2hlZCBzbyB0aGF0IHdlIGRvbid0IGhhdmVcbiAgICAgICAgICAvLyB0byByZXZpc2l0IHRoaXMgbm9kZSBhZ2Fpbi4gT3RoZXJ3aXNlLCB3ZSBtYWtlIG5eMiBjYWxscyB0byBnZXRJRFxuICAgICAgICAgIC8vIHdoZW4gdmlzaXRpbmcgdGhlIG1hbnkgY2hpbGRyZW4gb2YgYSBzaW5nbGUgbm9kZSBpbiBvcmRlci5cblxuICAgICAgICAgIGlmICh0YXJnZXRJRCA9PT0gY2hpbGRJRCkge1xuICAgICAgICAgICAgdGFyZ2V0Q2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9IGVsc2UgaWYgKFJlYWN0SW5zdGFuY2VIYW5kbGVzLmlzQW5jZXN0b3JJRE9mKGNoaWxkSUQsIHRhcmdldElEKSkge1xuICAgICAgICAgICAgLy8gSWYgd2UgZmluZCBhIGNoaWxkIHdob3NlIElEIGlzIGFuIGFuY2VzdG9yIG9mIHRoZSBnaXZlbiBJRCxcbiAgICAgICAgICAgIC8vIHRoZW4gd2UgY2FuIGJlIHN1cmUgdGhhdCB3ZSBvbmx5IHdhbnQgdG8gc2VhcmNoIHRoZSBzdWJ0cmVlXG4gICAgICAgICAgICAvLyByb290ZWQgYXQgdGhpcyBjaGlsZCwgc28gd2UgY2FuIHRocm93IG91dCB0aGUgcmVzdCBvZiB0aGVcbiAgICAgICAgICAgIC8vIHNlYXJjaCBzdGF0ZS5cbiAgICAgICAgICAgIGZpcnN0Q2hpbGRyZW4ubGVuZ3RoID0gY2hpbGRJbmRleCA9IDA7XG4gICAgICAgICAgICBmaXJzdENoaWxkcmVuLnB1c2goY2hpbGQuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElmIHRoaXMgY2hpbGQgaGFkIG5vIElELCB0aGVuIHRoZXJlJ3MgYSBjaGFuY2UgdGhhdCBpdCB3YXNcbiAgICAgICAgICAvLyBpbmplY3RlZCBhdXRvbWF0aWNhbGx5IGJ5IHRoZSBicm93c2VyLCBhcyB3aGVuIGEgYDx0YWJsZT5gXG4gICAgICAgICAgLy8gZWxlbWVudCBzcHJvdXRzIGFuIGV4dHJhIGA8dGJvZHk+YCBjaGlsZCBhcyBhIHNpZGUgZWZmZWN0IG9mXG4gICAgICAgICAgLy8gYC5pbm5lckhUTUxgIHBhcnNpbmcuIE9wdGltaXN0aWNhbGx5IGNvbnRpbnVlIGRvd24gdGhpc1xuICAgICAgICAgIC8vIGJyYW5jaCwgYnV0IG5vdCBiZWZvcmUgZXhhbWluaW5nIHRoZSBvdGhlciBzaWJsaW5ncy5cbiAgICAgICAgICBmaXJzdENoaWxkcmVuLnB1c2goY2hpbGQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgfVxuXG4gICAgICBpZiAodGFyZ2V0Q2hpbGQpIHtcbiAgICAgICAgLy8gRW1wdHlpbmcgZmlyc3RDaGlsZHJlbi9maW5kQ29tcG9uZW50Um9vdFJldXNhYmxlQXJyYXkgaXNcbiAgICAgICAgLy8gbm90IG5lY2Vzc2FyeSBmb3IgY29ycmVjdG5lc3MsIGJ1dCBpdCBoZWxwcyB0aGUgR0MgcmVjbGFpbVxuICAgICAgICAvLyBhbnkgbm9kZXMgdGhhdCB3ZXJlIGxlZnQgYXQgdGhlIGVuZCBvZiB0aGUgc2VhcmNoLlxuICAgICAgICBmaXJzdENoaWxkcmVuLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldENoaWxkO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZpcnN0Q2hpbGRyZW4ubGVuZ3RoID0gMDtcblxuICAgICFmYWxzZSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdmaW5kQ29tcG9uZW50Um9vdCguLi4sICVzKTogVW5hYmxlIHRvIGZpbmQgZWxlbWVudC4gVGhpcyBwcm9iYWJseSAnICsgJ21lYW5zIHRoZSBET00gd2FzIHVuZXhwZWN0ZWRseSBtdXRhdGVkIChlLmcuLCBieSB0aGUgYnJvd3NlciksICcgKyAndXN1YWxseSBkdWUgdG8gZm9yZ2V0dGluZyBhIDx0Ym9keT4gd2hlbiB1c2luZyB0YWJsZXMsIG5lc3RpbmcgdGFncyAnICsgJ2xpa2UgPGZvcm0+LCA8cD4sIG9yIDxhPiwgb3IgdXNpbmcgbm9uLVNWRyBlbGVtZW50cyBpbiBhbiA8c3ZnPiAnICsgJ3BhcmVudC4gJyArICdUcnkgaW5zcGVjdGluZyB0aGUgY2hpbGQgbm9kZXMgb2YgdGhlIGVsZW1lbnQgd2l0aCBSZWFjdCBJRCBgJXNgLicsIHRhcmdldElELCBSZWFjdE1vdW50LmdldElEKGFuY2VzdG9yTm9kZSkpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgfSxcblxuICBfbW91bnRJbWFnZUludG9Ob2RlOiBmdW5jdGlvbiAobWFya3VwLCBjb250YWluZXIsIHNob3VsZFJldXNlTWFya3VwLCB0cmFuc2FjdGlvbikge1xuICAgICEoY29udGFpbmVyICYmIChjb250YWluZXIubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERV9UWVBFIHx8IGNvbnRhaW5lci5ub2RlVHlwZSA9PT0gRE9DX05PREVfVFlQRSB8fCBjb250YWluZXIubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREVfVFlQRSkpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ21vdW50Q29tcG9uZW50SW50b05vZGUoLi4uKTogVGFyZ2V0IGNvbnRhaW5lciBpcyBub3QgdmFsaWQuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKHNob3VsZFJldXNlTWFya3VwKSB7XG4gICAgICB2YXIgcm9vdEVsZW1lbnQgPSBnZXRSZWFjdFJvb3RFbGVtZW50SW5Db250YWluZXIoY29udGFpbmVyKTtcbiAgICAgIGlmIChSZWFjdE1hcmt1cENoZWNrc3VtLmNhblJldXNlTWFya3VwKG1hcmt1cCwgcm9vdEVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjaGVja3N1bSA9IHJvb3RFbGVtZW50LmdldEF0dHJpYnV0ZShSZWFjdE1hcmt1cENoZWNrc3VtLkNIRUNLU1VNX0FUVFJfTkFNRSk7XG4gICAgICAgIHJvb3RFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShSZWFjdE1hcmt1cENoZWNrc3VtLkNIRUNLU1VNX0FUVFJfTkFNRSk7XG5cbiAgICAgICAgdmFyIHJvb3RNYXJrdXAgPSByb290RWxlbWVudC5vdXRlckhUTUw7XG4gICAgICAgIHJvb3RFbGVtZW50LnNldEF0dHJpYnV0ZShSZWFjdE1hcmt1cENoZWNrc3VtLkNIRUNLU1VNX0FUVFJfTkFNRSwgY2hlY2tzdW0pO1xuXG4gICAgICAgIHZhciBub3JtYWxpemVkTWFya3VwID0gbWFya3VwO1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIC8vIGJlY2F1c2Ugcm9vdE1hcmt1cCBpcyByZXRyaWV2ZWQgZnJvbSB0aGUgRE9NLCB2YXJpb3VzIG5vcm1hbGl6YXRpb25zXG4gICAgICAgICAgLy8gd2lsbCBoYXZlIG9jY3VycmVkIHdoaWNoIHdpbGwgbm90IGJlIHByZXNlbnQgaW4gYG1hcmt1cGAuIEhlcmUsXG4gICAgICAgICAgLy8gaW5zZXJ0IG1hcmt1cCBpbnRvIGEgPGRpdj4gb3IgPGlmcmFtZT4gZGVwZW5kaW5nIG9uIHRoZSBjb250YWluZXJcbiAgICAgICAgICAvLyB0eXBlIHRvIHBlcmZvcm0gdGhlIHNhbWUgbm9ybWFsaXphdGlvbnMgYmVmb3JlIGNvbXBhcmluZy5cbiAgICAgICAgICB2YXIgbm9ybWFsaXplcjtcbiAgICAgICAgICBpZiAoY29udGFpbmVyLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREVfVFlQRSkge1xuICAgICAgICAgICAgbm9ybWFsaXplciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbm9ybWFsaXplci5pbm5lckhUTUwgPSBtYXJrdXA7XG4gICAgICAgICAgICBub3JtYWxpemVkTWFya3VwID0gbm9ybWFsaXplci5pbm5lckhUTUw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vcm1hbGl6ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobm9ybWFsaXplcik7XG4gICAgICAgICAgICBub3JtYWxpemVyLmNvbnRlbnREb2N1bWVudC53cml0ZShtYXJrdXApO1xuICAgICAgICAgICAgbm9ybWFsaXplZE1hcmt1cCA9IG5vcm1hbGl6ZXIuY29udGVudERvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vdXRlckhUTUw7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKG5vcm1hbGl6ZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkaWZmSW5kZXggPSBmaXJzdERpZmZlcmVuY2VJbmRleChub3JtYWxpemVkTWFya3VwLCByb290TWFya3VwKTtcbiAgICAgICAgdmFyIGRpZmZlcmVuY2UgPSAnIChjbGllbnQpICcgKyBub3JtYWxpemVkTWFya3VwLnN1YnN0cmluZyhkaWZmSW5kZXggLSAyMCwgZGlmZkluZGV4ICsgMjApICsgJ1xcbiAoc2VydmVyKSAnICsgcm9vdE1hcmt1cC5zdWJzdHJpbmcoZGlmZkluZGV4IC0gMjAsIGRpZmZJbmRleCArIDIwKTtcblxuICAgICAgICAhKGNvbnRhaW5lci5ub2RlVHlwZSAhPT0gRE9DX05PREVfVFlQRSkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnWW91XFwncmUgdHJ5aW5nIHRvIHJlbmRlciBhIGNvbXBvbmVudCB0byB0aGUgZG9jdW1lbnQgdXNpbmcgJyArICdzZXJ2ZXIgcmVuZGVyaW5nIGJ1dCB0aGUgY2hlY2tzdW0gd2FzIGludmFsaWQuIFRoaXMgdXN1YWxseSAnICsgJ21lYW5zIHlvdSByZW5kZXJlZCBhIGRpZmZlcmVudCBjb21wb25lbnQgdHlwZSBvciBwcm9wcyBvbiAnICsgJ3RoZSBjbGllbnQgZnJvbSB0aGUgb25lIG9uIHRoZSBzZXJ2ZXIsIG9yIHlvdXIgcmVuZGVyKCkgJyArICdtZXRob2RzIGFyZSBpbXB1cmUuIFJlYWN0IGNhbm5vdCBoYW5kbGUgdGhpcyBjYXNlIGR1ZSB0byAnICsgJ2Nyb3NzLWJyb3dzZXIgcXVpcmtzIGJ5IHJlbmRlcmluZyBhdCB0aGUgZG9jdW1lbnQgcm9vdC4gWW91ICcgKyAnc2hvdWxkIGxvb2sgZm9yIGVudmlyb25tZW50IGRlcGVuZGVudCBjb2RlIGluIHlvdXIgY29tcG9uZW50cyAnICsgJ2FuZCBlbnN1cmUgdGhlIHByb3BzIGFyZSB0aGUgc2FtZSBjbGllbnQgYW5kIHNlcnZlciBzaWRlOlxcbiVzJywgZGlmZmVyZW5jZSkgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdSZWFjdCBhdHRlbXB0ZWQgdG8gcmV1c2UgbWFya3VwIGluIGEgY29udGFpbmVyIGJ1dCB0aGUgJyArICdjaGVja3N1bSB3YXMgaW52YWxpZC4gVGhpcyBnZW5lcmFsbHkgbWVhbnMgdGhhdCB5b3UgYXJlICcgKyAndXNpbmcgc2VydmVyIHJlbmRlcmluZyBhbmQgdGhlIG1hcmt1cCBnZW5lcmF0ZWQgb24gdGhlICcgKyAnc2VydmVyIHdhcyBub3Qgd2hhdCB0aGUgY2xpZW50IHdhcyBleHBlY3RpbmcuIFJlYWN0IGluamVjdGVkICcgKyAnbmV3IG1hcmt1cCB0byBjb21wZW5zYXRlIHdoaWNoIHdvcmtzIGJ1dCB5b3UgaGF2ZSBsb3N0IG1hbnkgJyArICdvZiB0aGUgYmVuZWZpdHMgb2Ygc2VydmVyIHJlbmRlcmluZy4gSW5zdGVhZCwgZmlndXJlIG91dCAnICsgJ3doeSB0aGUgbWFya3VwIGJlaW5nIGdlbmVyYXRlZCBpcyBkaWZmZXJlbnQgb24gdGhlIGNsaWVudCAnICsgJ29yIHNlcnZlcjpcXG4lcycsIGRpZmZlcmVuY2UpIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgIShjb250YWluZXIubm9kZVR5cGUgIT09IERPQ19OT0RFX1RZUEUpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1lvdVxcJ3JlIHRyeWluZyB0byByZW5kZXIgYSBjb21wb25lbnQgdG8gdGhlIGRvY3VtZW50IGJ1dCAnICsgJ3lvdSBkaWRuXFwndCB1c2Ugc2VydmVyIHJlbmRlcmluZy4gV2UgY2FuXFwndCBkbyB0aGlzICcgKyAnd2l0aG91dCB1c2luZyBzZXJ2ZXIgcmVuZGVyaW5nIGR1ZSB0byBjcm9zcy1icm93c2VyIHF1aXJrcy4gJyArICdTZWUgUmVhY3RET01TZXJ2ZXIucmVuZGVyVG9TdHJpbmcoKSBmb3Igc2VydmVyIHJlbmRlcmluZy4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAodHJhbnNhY3Rpb24udXNlQ3JlYXRlRWxlbWVudCkge1xuICAgICAgd2hpbGUgKGNvbnRhaW5lci5sYXN0Q2hpbGQpIHtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGNvbnRhaW5lci5sYXN0Q2hpbGQpO1xuICAgICAgfVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG1hcmt1cCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldElubmVySFRNTChjb250YWluZXIsIG1hcmt1cCk7XG4gICAgfVxuICB9LFxuXG4gIG93bmVyRG9jdW1lbnRDb250ZXh0S2V5OiBvd25lckRvY3VtZW50Q29udGV4dEtleSxcblxuICAvKipcbiAgICogUmVhY3QgSUQgdXRpbGl0aWVzLlxuICAgKi9cblxuICBnZXRSZWFjdFJvb3RJRDogZ2V0UmVhY3RSb290SUQsXG5cbiAgZ2V0SUQ6IGdldElELFxuXG4gIHNldElEOiBzZXRJRCxcblxuICBnZXROb2RlOiBnZXROb2RlLFxuXG4gIGdldE5vZGVGcm9tSW5zdGFuY2U6IGdldE5vZGVGcm9tSW5zdGFuY2UsXG5cbiAgaXNWYWxpZDogaXNWYWxpZCxcblxuICBwdXJnZUlEOiBwdXJnZUlEXG59O1xuXG5SZWFjdFBlcmYubWVhc3VyZU1ldGhvZHMoUmVhY3RNb3VudCwgJ1JlYWN0TW91bnQnLCB7XG4gIF9yZW5kZXJOZXdSb290Q29tcG9uZW50OiAnX3JlbmRlck5ld1Jvb3RDb21wb25lbnQnLFxuICBfbW91bnRJbWFnZUludG9Ob2RlOiAnX21vdW50SW1hZ2VJbnRvTm9kZSdcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0TW91bnQ7Il19