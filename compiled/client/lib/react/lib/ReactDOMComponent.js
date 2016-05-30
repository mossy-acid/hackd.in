/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMComponent
 * @typechecks static-only
 */

/* global hasOwnProperty:true */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var AutoFocusUtils = require('./AutoFocusUtils');
var CSSPropertyOperations = require('./CSSPropertyOperations');
var DOMProperty = require('./DOMProperty');
var DOMPropertyOperations = require('./DOMPropertyOperations');
var EventConstants = require('./EventConstants');
var ReactBrowserEventEmitter = require('./ReactBrowserEventEmitter');
var ReactComponentBrowserEnvironment = require('./ReactComponentBrowserEnvironment');
var ReactDOMButton = require('./ReactDOMButton');
var ReactDOMInput = require('./ReactDOMInput');
var ReactDOMOption = require('./ReactDOMOption');
var ReactDOMSelect = require('./ReactDOMSelect');
var ReactDOMTextarea = require('./ReactDOMTextarea');
var ReactMount = require('./ReactMount');
var ReactMultiChild = require('./ReactMultiChild');
var ReactPerf = require('./ReactPerf');
var ReactUpdateQueue = require('./ReactUpdateQueue');

var assign = require('./Object.assign');
var canDefineProperty = require('./canDefineProperty');
var escapeTextContentForBrowser = require('./escapeTextContentForBrowser');
var invariant = require('fbjs/lib/invariant');
var isEventSupported = require('./isEventSupported');
var keyOf = require('fbjs/lib/keyOf');
var setInnerHTML = require('./setInnerHTML');
var setTextContent = require('./setTextContent');
var shallowEqual = require('fbjs/lib/shallowEqual');
var validateDOMNesting = require('./validateDOMNesting');
var warning = require('fbjs/lib/warning');

var deleteListener = ReactBrowserEventEmitter.deleteListener;
var listenTo = ReactBrowserEventEmitter.listenTo;
var registrationNameModules = ReactBrowserEventEmitter.registrationNameModules;

// For quickly matching children type, to test if can be treated as content.
var CONTENT_TYPES = { 'string': true, 'number': true };

var CHILDREN = keyOf({ children: null });
var STYLE = keyOf({ style: null });
var HTML = keyOf({ __html: null });

var ELEMENT_NODE_TYPE = 1;

function getDeclarationErrorAddendum(internalInstance) {
  if (internalInstance) {
    var owner = internalInstance._currentElement._owner || null;
    if (owner) {
      var name = owner.getName();
      if (name) {
        return ' This DOM node was rendered by `' + name + '`.';
      }
    }
  }
  return '';
}

var legacyPropsDescriptor;
if (process.env.NODE_ENV !== 'production') {
  legacyPropsDescriptor = {
    props: {
      enumerable: false,
      get: function get() {
        var component = this._reactInternalComponent;
        process.env.NODE_ENV !== 'production' ? warning(false, 'ReactDOMComponent: Do not access .props of a DOM node; instead, ' + 'recreate the props as `render` did originally or read the DOM ' + 'properties/attributes directly from this node (e.g., ' + 'this.refs.box.className).%s', getDeclarationErrorAddendum(component)) : undefined;
        return component._currentElement.props;
      }
    }
  };
}

function legacyGetDOMNode() {
  if (process.env.NODE_ENV !== 'production') {
    var component = this._reactInternalComponent;
    process.env.NODE_ENV !== 'production' ? warning(false, 'ReactDOMComponent: Do not access .getDOMNode() of a DOM node; ' + 'instead, use the node directly.%s', getDeclarationErrorAddendum(component)) : undefined;
  }
  return this;
}

function legacyIsMounted() {
  var component = this._reactInternalComponent;
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== 'production' ? warning(false, 'ReactDOMComponent: Do not access .isMounted() of a DOM node.%s', getDeclarationErrorAddendum(component)) : undefined;
  }
  return !!component;
}

function legacySetStateEtc() {
  if (process.env.NODE_ENV !== 'production') {
    var component = this._reactInternalComponent;
    process.env.NODE_ENV !== 'production' ? warning(false, 'ReactDOMComponent: Do not access .setState(), .replaceState(), or ' + '.forceUpdate() of a DOM node. This is a no-op.%s', getDeclarationErrorAddendum(component)) : undefined;
  }
}

function legacySetProps(partialProps, callback) {
  var component = this._reactInternalComponent;
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== 'production' ? warning(false, 'ReactDOMComponent: Do not access .setProps() of a DOM node. ' + 'Instead, call ReactDOM.render again at the top level.%s', getDeclarationErrorAddendum(component)) : undefined;
  }
  if (!component) {
    return;
  }
  ReactUpdateQueue.enqueueSetPropsInternal(component, partialProps);
  if (callback) {
    ReactUpdateQueue.enqueueCallbackInternal(component, callback);
  }
}

function legacyReplaceProps(partialProps, callback) {
  var component = this._reactInternalComponent;
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== 'production' ? warning(false, 'ReactDOMComponent: Do not access .replaceProps() of a DOM node. ' + 'Instead, call ReactDOM.render again at the top level.%s', getDeclarationErrorAddendum(component)) : undefined;
  }
  if (!component) {
    return;
  }
  ReactUpdateQueue.enqueueReplacePropsInternal(component, partialProps);
  if (callback) {
    ReactUpdateQueue.enqueueCallbackInternal(component, callback);
  }
}

function friendlyStringify(obj) {
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
    if (Array.isArray(obj)) {
      return '[' + obj.map(friendlyStringify).join(', ') + ']';
    } else {
      var pairs = [];
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var keyEscaped = /^[a-z$_][\w$_]*$/i.test(key) ? key : JSON.stringify(key);
          pairs.push(keyEscaped + ': ' + friendlyStringify(obj[key]));
        }
      }
      return '{' + pairs.join(', ') + '}';
    }
  } else if (typeof obj === 'string') {
    return JSON.stringify(obj);
  } else if (typeof obj === 'function') {
    return '[function object]';
  }
  // Differs from JSON.stringify in that undefined becauses undefined and that
  // inf and nan don't become null
  return String(obj);
}

var styleMutationWarning = {};

function checkAndWarnForMutatedStyle(style1, style2, component) {
  if (style1 == null || style2 == null) {
    return;
  }
  if (shallowEqual(style1, style2)) {
    return;
  }

  var componentName = component._tag;
  var owner = component._currentElement._owner;
  var ownerName;
  if (owner) {
    ownerName = owner.getName();
  }

  var hash = ownerName + '|' + componentName;

  if (styleMutationWarning.hasOwnProperty(hash)) {
    return;
  }

  styleMutationWarning[hash] = true;

  process.env.NODE_ENV !== 'production' ? warning(false, '`%s` was passed a style object that has previously been mutated. ' + 'Mutating `style` is deprecated. Consider cloning it beforehand. Check ' + 'the `render` %s. Previous style: %s. Mutated style: %s.', componentName, owner ? 'of `' + ownerName + '`' : 'using <' + componentName + '>', friendlyStringify(style1), friendlyStringify(style2)) : undefined;
}

/**
 * @param {object} component
 * @param {?object} props
 */
function assertValidProps(component, props) {
  if (!props) {
    return;
  }
  // Note the use of `==` which checks for null or undefined.
  if (process.env.NODE_ENV !== 'production') {
    if (voidElementTags[component._tag]) {
      process.env.NODE_ENV !== 'production' ? warning(props.children == null && props.dangerouslySetInnerHTML == null, '%s is a void element tag and must not have `children` or ' + 'use `props.dangerouslySetInnerHTML`.%s', component._tag, component._currentElement._owner ? ' Check the render method of ' + component._currentElement._owner.getName() + '.' : '') : undefined;
    }
  }
  if (props.dangerouslySetInnerHTML != null) {
    !(props.children == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Can only set one of `children` or `props.dangerouslySetInnerHTML`.') : invariant(false) : undefined;
    !(_typeof(props.dangerouslySetInnerHTML) === 'object' && HTML in props.dangerouslySetInnerHTML) ? process.env.NODE_ENV !== 'production' ? invariant(false, '`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. ' + 'Please visit https://fb.me/react-invariant-dangerously-set-inner-html ' + 'for more information.') : invariant(false) : undefined;
  }
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== 'production' ? warning(props.innerHTML == null, 'Directly setting property `innerHTML` is not permitted. ' + 'For more information, lookup documentation on `dangerouslySetInnerHTML`.') : undefined;
    process.env.NODE_ENV !== 'production' ? warning(!props.contentEditable || props.children == null, 'A component is `contentEditable` and contains `children` managed by ' + 'React. It is now your responsibility to guarantee that none of ' + 'those nodes are unexpectedly modified or duplicated. This is ' + 'probably not intentional.') : undefined;
  }
  !(props.style == null || _typeof(props.style) === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'The `style` prop expects a mapping from style properties to values, ' + 'not a string. For example, style={{marginRight: spacing + \'em\'}} when ' + 'using JSX.%s', getDeclarationErrorAddendum(component)) : invariant(false) : undefined;
}

function enqueuePutListener(id, registrationName, listener, transaction) {
  if (process.env.NODE_ENV !== 'production') {
    // IE8 has no API for event capturing and the `onScroll` event doesn't
    // bubble.
    process.env.NODE_ENV !== 'production' ? warning(registrationName !== 'onScroll' || isEventSupported('scroll', true), 'This browser doesn\'t support the `onScroll` event') : undefined;
  }
  var container = ReactMount.findReactContainerForID(id);
  if (container) {
    var doc = container.nodeType === ELEMENT_NODE_TYPE ? container.ownerDocument : container;
    listenTo(registrationName, doc);
  }
  transaction.getReactMountReady().enqueue(putListener, {
    id: id,
    registrationName: registrationName,
    listener: listener
  });
}

function putListener() {
  var listenerToPut = this;
  ReactBrowserEventEmitter.putListener(listenerToPut.id, listenerToPut.registrationName, listenerToPut.listener);
}

// There are so many media events, it makes sense to just
// maintain a list rather than create a `trapBubbledEvent` for each
var mediaEvents = {
  topAbort: 'abort',
  topCanPlay: 'canplay',
  topCanPlayThrough: 'canplaythrough',
  topDurationChange: 'durationchange',
  topEmptied: 'emptied',
  topEncrypted: 'encrypted',
  topEnded: 'ended',
  topError: 'error',
  topLoadedData: 'loadeddata',
  topLoadedMetadata: 'loadedmetadata',
  topLoadStart: 'loadstart',
  topPause: 'pause',
  topPlay: 'play',
  topPlaying: 'playing',
  topProgress: 'progress',
  topRateChange: 'ratechange',
  topSeeked: 'seeked',
  topSeeking: 'seeking',
  topStalled: 'stalled',
  topSuspend: 'suspend',
  topTimeUpdate: 'timeupdate',
  topVolumeChange: 'volumechange',
  topWaiting: 'waiting'
};

function trapBubbledEventsLocal() {
  var inst = this;
  // If a component renders to null or if another component fatals and causes
  // the state of the tree to be corrupted, `node` here can be null.
  !inst._rootNodeID ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Must be mounted to trap events') : invariant(false) : undefined;
  var node = ReactMount.getNode(inst._rootNodeID);
  !node ? process.env.NODE_ENV !== 'production' ? invariant(false, 'trapBubbledEvent(...): Requires node to be rendered.') : invariant(false) : undefined;

  switch (inst._tag) {
    case 'iframe':
      inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent(EventConstants.topLevelTypes.topLoad, 'load', node)];
      break;
    case 'video':
    case 'audio':

      inst._wrapperState.listeners = [];
      // create listener for each media event
      for (var event in mediaEvents) {
        if (mediaEvents.hasOwnProperty(event)) {
          inst._wrapperState.listeners.push(ReactBrowserEventEmitter.trapBubbledEvent(EventConstants.topLevelTypes[event], mediaEvents[event], node));
        }
      }

      break;
    case 'img':
      inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent(EventConstants.topLevelTypes.topError, 'error', node), ReactBrowserEventEmitter.trapBubbledEvent(EventConstants.topLevelTypes.topLoad, 'load', node)];
      break;
    case 'form':
      inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent(EventConstants.topLevelTypes.topReset, 'reset', node), ReactBrowserEventEmitter.trapBubbledEvent(EventConstants.topLevelTypes.topSubmit, 'submit', node)];
      break;
  }
}

function mountReadyInputWrapper() {
  ReactDOMInput.mountReadyWrapper(this);
}

function postUpdateSelectWrapper() {
  ReactDOMSelect.postUpdateWrapper(this);
}

// For HTML, certain tags should omit their close tag. We keep a whitelist for
// those special cased tags.

var omittedCloseTags = {
  'area': true,
  'base': true,
  'br': true,
  'col': true,
  'embed': true,
  'hr': true,
  'img': true,
  'input': true,
  'keygen': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true
};

// NOTE: menuitem's close tag should be omitted, but that causes problems.
var newlineEatingTags = {
  'listing': true,
  'pre': true,
  'textarea': true
};

// For HTML, certain tags cannot have children. This has the same purpose as
// `omittedCloseTags` except that `menuitem` should still have its closing tag.

var voidElementTags = assign({
  'menuitem': true
}, omittedCloseTags);

// We accept any tag to be rendered but since this gets injected into arbitrary
// HTML, we want to make sure that it's a safe tag.
// http://www.w3.org/TR/REC-xml/#NT-Name

var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/; // Simplified subset
var validatedTagCache = {};
var hasOwnProperty = {}.hasOwnProperty;

function validateDangerousTag(tag) {
  if (!hasOwnProperty.call(validatedTagCache, tag)) {
    !VALID_TAG_REGEX.test(tag) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Invalid tag: %s', tag) : invariant(false) : undefined;
    validatedTagCache[tag] = true;
  }
}

function processChildContextDev(context, inst) {
  // Pass down our tag name to child components for validation purposes
  context = assign({}, context);
  var info = context[validateDOMNesting.ancestorInfoContextKey];
  context[validateDOMNesting.ancestorInfoContextKey] = validateDOMNesting.updatedAncestorInfo(info, inst._tag, inst);
  return context;
}

function isCustomComponent(tagName, props) {
  return tagName.indexOf('-') >= 0 || props.is != null;
}

/**
 * Creates a new React class that is idempotent and capable of containing other
 * React components. It accepts event listeners and DOM properties that are
 * valid according to `DOMProperty`.
 *
 *  - Event listeners: `onClick`, `onMouseDown`, etc.
 *  - DOM properties: `className`, `name`, `title`, etc.
 *
 * The `style` property functions differently from the DOM API. It accepts an
 * object mapping of style properties to values.
 *
 * @constructor ReactDOMComponent
 * @extends ReactMultiChild
 */
function ReactDOMComponent(tag) {
  validateDangerousTag(tag);
  this._tag = tag.toLowerCase();
  this._renderedChildren = null;
  this._previousStyle = null;
  this._previousStyleCopy = null;
  this._rootNodeID = null;
  this._wrapperState = null;
  this._topLevelWrapper = null;
  this._nodeWithLegacyProperties = null;
  if (process.env.NODE_ENV !== 'production') {
    this._unprocessedContextDev = null;
    this._processedContextDev = null;
  }
}

ReactDOMComponent.displayName = 'ReactDOMComponent';

ReactDOMComponent.Mixin = {

  construct: function construct(element) {
    this._currentElement = element;
  },

  /**
   * Generates root tag markup then recurses. This method has side effects and
   * is not idempotent.
   *
   * @internal
   * @param {string} rootID The root DOM ID for this node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {object} context
   * @return {string} The computed markup.
   */
  mountComponent: function mountComponent(rootID, transaction, context) {
    this._rootNodeID = rootID;

    var props = this._currentElement.props;

    switch (this._tag) {
      case 'iframe':
      case 'img':
      case 'form':
      case 'video':
      case 'audio':
        this._wrapperState = {
          listeners: null
        };
        transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
        break;
      case 'button':
        props = ReactDOMButton.getNativeProps(this, props, context);
        break;
      case 'input':
        ReactDOMInput.mountWrapper(this, props, context);
        props = ReactDOMInput.getNativeProps(this, props, context);
        break;
      case 'option':
        ReactDOMOption.mountWrapper(this, props, context);
        props = ReactDOMOption.getNativeProps(this, props, context);
        break;
      case 'select':
        ReactDOMSelect.mountWrapper(this, props, context);
        props = ReactDOMSelect.getNativeProps(this, props, context);
        context = ReactDOMSelect.processChildContext(this, props, context);
        break;
      case 'textarea':
        ReactDOMTextarea.mountWrapper(this, props, context);
        props = ReactDOMTextarea.getNativeProps(this, props, context);
        break;
    }

    assertValidProps(this, props);
    if (process.env.NODE_ENV !== 'production') {
      if (context[validateDOMNesting.ancestorInfoContextKey]) {
        validateDOMNesting(this._tag, this, context[validateDOMNesting.ancestorInfoContextKey]);
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      this._unprocessedContextDev = context;
      this._processedContextDev = processChildContextDev(context, this);
      context = this._processedContextDev;
    }

    var mountImage;
    if (transaction.useCreateElement) {
      var ownerDocument = context[ReactMount.ownerDocumentContextKey];
      var el = ownerDocument.createElement(this._currentElement.type);
      DOMPropertyOperations.setAttributeForID(el, this._rootNodeID);
      // Populate node cache
      ReactMount.getID(el);
      this._updateDOMProperties({}, props, transaction, el);
      this._createInitialChildren(transaction, props, context, el);
      mountImage = el;
    } else {
      var tagOpen = this._createOpenTagMarkupAndPutListeners(transaction, props);
      var tagContent = this._createContentMarkup(transaction, props, context);
      if (!tagContent && omittedCloseTags[this._tag]) {
        mountImage = tagOpen + '/>';
      } else {
        mountImage = tagOpen + '>' + tagContent + '</' + this._currentElement.type + '>';
      }
    }

    switch (this._tag) {
      case 'input':
        transaction.getReactMountReady().enqueue(mountReadyInputWrapper, this);
      // falls through
      case 'button':
      case 'select':
      case 'textarea':
        if (props.autoFocus) {
          transaction.getReactMountReady().enqueue(AutoFocusUtils.focusDOMComponent, this);
        }
        break;
    }

    return mountImage;
  },

  /**
   * Creates markup for the open tag and all attributes.
   *
   * This method has side effects because events get registered.
   *
   * Iterating over object properties is faster than iterating over arrays.
   * @see http://jsperf.com/obj-vs-arr-iteration
   *
   * @private
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {object} props
   * @return {string} Markup of opening tag.
   */
  _createOpenTagMarkupAndPutListeners: function _createOpenTagMarkupAndPutListeners(transaction, props) {
    var ret = '<' + this._currentElement.type;

    for (var propKey in props) {
      if (!props.hasOwnProperty(propKey)) {
        continue;
      }
      var propValue = props[propKey];
      if (propValue == null) {
        continue;
      }
      if (registrationNameModules.hasOwnProperty(propKey)) {
        if (propValue) {
          enqueuePutListener(this._rootNodeID, propKey, propValue, transaction);
        }
      } else {
        if (propKey === STYLE) {
          if (propValue) {
            if (process.env.NODE_ENV !== 'production') {
              // See `_updateDOMProperties`. style block
              this._previousStyle = propValue;
            }
            propValue = this._previousStyleCopy = assign({}, props.style);
          }
          propValue = CSSPropertyOperations.createMarkupForStyles(propValue);
        }
        var markup = null;
        if (this._tag != null && isCustomComponent(this._tag, props)) {
          if (propKey !== CHILDREN) {
            markup = DOMPropertyOperations.createMarkupForCustomAttribute(propKey, propValue);
          }
        } else {
          markup = DOMPropertyOperations.createMarkupForProperty(propKey, propValue);
        }
        if (markup) {
          ret += ' ' + markup;
        }
      }
    }

    // For static pages, no need to put React ID and checksum. Saves lots of
    // bytes.
    if (transaction.renderToStaticMarkup) {
      return ret;
    }

    var markupForID = DOMPropertyOperations.createMarkupForID(this._rootNodeID);
    return ret + ' ' + markupForID;
  },

  /**
   * Creates markup for the content between the tags.
   *
   * @private
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {object} props
   * @param {object} context
   * @return {string} Content markup.
   */
  _createContentMarkup: function _createContentMarkup(transaction, props, context) {
    var ret = '';

    // Intentional use of != to avoid catching zero/false.
    var innerHTML = props.dangerouslySetInnerHTML;
    if (innerHTML != null) {
      if (innerHTML.__html != null) {
        ret = innerHTML.__html;
      }
    } else {
      var contentToUse = CONTENT_TYPES[_typeof(props.children)] ? props.children : null;
      var childrenToUse = contentToUse != null ? null : props.children;
      if (contentToUse != null) {
        // TODO: Validate that text is allowed as a child of this node
        ret = escapeTextContentForBrowser(contentToUse);
      } else if (childrenToUse != null) {
        var mountImages = this.mountChildren(childrenToUse, transaction, context);
        ret = mountImages.join('');
      }
    }
    if (newlineEatingTags[this._tag] && ret.charAt(0) === '\n') {
      // text/html ignores the first character in these tags if it's a newline
      // Prefer to break application/xml over text/html (for now) by adding
      // a newline specifically to get eaten by the parser. (Alternately for
      // textareas, replacing "^\n" with "\r\n" doesn't get eaten, and the first
      // \r is normalized out by HTMLTextAreaElement#value.)
      // See: <http://www.w3.org/TR/html-polyglot/#newlines-in-textarea-and-pre>
      // See: <http://www.w3.org/TR/html5/syntax.html#element-restrictions>
      // See: <http://www.w3.org/TR/html5/syntax.html#newlines>
      // See: Parsing of "textarea" "listing" and "pre" elements
      //  from <http://www.w3.org/TR/html5/syntax.html#parsing-main-inbody>
      return '\n' + ret;
    } else {
      return ret;
    }
  },

  _createInitialChildren: function _createInitialChildren(transaction, props, context, el) {
    // Intentional use of != to avoid catching zero/false.
    var innerHTML = props.dangerouslySetInnerHTML;
    if (innerHTML != null) {
      if (innerHTML.__html != null) {
        setInnerHTML(el, innerHTML.__html);
      }
    } else {
      var contentToUse = CONTENT_TYPES[_typeof(props.children)] ? props.children : null;
      var childrenToUse = contentToUse != null ? null : props.children;
      if (contentToUse != null) {
        // TODO: Validate that text is allowed as a child of this node
        setTextContent(el, contentToUse);
      } else if (childrenToUse != null) {
        var mountImages = this.mountChildren(childrenToUse, transaction, context);
        for (var i = 0; i < mountImages.length; i++) {
          el.appendChild(mountImages[i]);
        }
      }
    }
  },

  /**
   * Receives a next element and updates the component.
   *
   * @internal
   * @param {ReactElement} nextElement
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {object} context
   */
  receiveComponent: function receiveComponent(nextElement, transaction, context) {
    var prevElement = this._currentElement;
    this._currentElement = nextElement;
    this.updateComponent(transaction, prevElement, nextElement, context);
  },

  /**
   * Updates a native DOM component after it has already been allocated and
   * attached to the DOM. Reconciles the root DOM node, then recurses.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {ReactElement} prevElement
   * @param {ReactElement} nextElement
   * @internal
   * @overridable
   */
  updateComponent: function updateComponent(transaction, prevElement, nextElement, context) {
    var lastProps = prevElement.props;
    var nextProps = this._currentElement.props;

    switch (this._tag) {
      case 'button':
        lastProps = ReactDOMButton.getNativeProps(this, lastProps);
        nextProps = ReactDOMButton.getNativeProps(this, nextProps);
        break;
      case 'input':
        ReactDOMInput.updateWrapper(this);
        lastProps = ReactDOMInput.getNativeProps(this, lastProps);
        nextProps = ReactDOMInput.getNativeProps(this, nextProps);
        break;
      case 'option':
        lastProps = ReactDOMOption.getNativeProps(this, lastProps);
        nextProps = ReactDOMOption.getNativeProps(this, nextProps);
        break;
      case 'select':
        lastProps = ReactDOMSelect.getNativeProps(this, lastProps);
        nextProps = ReactDOMSelect.getNativeProps(this, nextProps);
        break;
      case 'textarea':
        ReactDOMTextarea.updateWrapper(this);
        lastProps = ReactDOMTextarea.getNativeProps(this, lastProps);
        nextProps = ReactDOMTextarea.getNativeProps(this, nextProps);
        break;
    }

    if (process.env.NODE_ENV !== 'production') {
      // If the context is reference-equal to the old one, pass down the same
      // processed object so the update bailout in ReactReconciler behaves
      // correctly (and identically in dev and prod). See #5005.
      if (this._unprocessedContextDev !== context) {
        this._unprocessedContextDev = context;
        this._processedContextDev = processChildContextDev(context, this);
      }
      context = this._processedContextDev;
    }

    assertValidProps(this, nextProps);
    this._updateDOMProperties(lastProps, nextProps, transaction, null);
    this._updateDOMChildren(lastProps, nextProps, transaction, context);

    if (!canDefineProperty && this._nodeWithLegacyProperties) {
      this._nodeWithLegacyProperties.props = nextProps;
    }

    if (this._tag === 'select') {
      // <select> value update needs to occur after <option> children
      // reconciliation
      transaction.getReactMountReady().enqueue(postUpdateSelectWrapper, this);
    }
  },

  /**
   * Reconciles the properties by detecting differences in property values and
   * updating the DOM as necessary. This function is probably the single most
   * critical path for performance optimization.
   *
   * TODO: Benchmark whether checking for changed values in memory actually
   *       improves performance (especially statically positioned elements).
   * TODO: Benchmark the effects of putting this at the top since 99% of props
   *       do not change for a given reconciliation.
   * TODO: Benchmark areas that can be improved with caching.
   *
   * @private
   * @param {object} lastProps
   * @param {object} nextProps
   * @param {ReactReconcileTransaction} transaction
   * @param {?DOMElement} node
   */
  _updateDOMProperties: function _updateDOMProperties(lastProps, nextProps, transaction, node) {
    var propKey;
    var styleName;
    var styleUpdates;
    for (propKey in lastProps) {
      if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey)) {
        continue;
      }
      if (propKey === STYLE) {
        var lastStyle = this._previousStyleCopy;
        for (styleName in lastStyle) {
          if (lastStyle.hasOwnProperty(styleName)) {
            styleUpdates = styleUpdates || {};
            styleUpdates[styleName] = '';
          }
        }
        this._previousStyleCopy = null;
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        if (lastProps[propKey]) {
          // Only call deleteListener if there was a listener previously or
          // else willDeleteListener gets called when there wasn't actually a
          // listener (e.g., onClick={null})
          deleteListener(this._rootNodeID, propKey);
        }
      } else if (DOMProperty.properties[propKey] || DOMProperty.isCustomAttribute(propKey)) {
        if (!node) {
          node = ReactMount.getNode(this._rootNodeID);
        }
        DOMPropertyOperations.deleteValueForProperty(node, propKey);
      }
    }
    for (propKey in nextProps) {
      var nextProp = nextProps[propKey];
      var lastProp = propKey === STYLE ? this._previousStyleCopy : lastProps[propKey];
      if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp) {
        continue;
      }
      if (propKey === STYLE) {
        if (nextProp) {
          if (process.env.NODE_ENV !== 'production') {
            checkAndWarnForMutatedStyle(this._previousStyleCopy, this._previousStyle, this);
            this._previousStyle = nextProp;
          }
          nextProp = this._previousStyleCopy = assign({}, nextProp);
        } else {
          this._previousStyleCopy = null;
        }
        if (lastProp) {
          // Unset styles on `lastProp` but not on `nextProp`.
          for (styleName in lastProp) {
            if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = '';
            }
          }
          // Update styles that changed since `lastProp`.
          for (styleName in nextProp) {
            if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = nextProp[styleName];
            }
          }
        } else {
          // Relies on `updateStylesByID` not mutating `styleUpdates`.
          styleUpdates = nextProp;
        }
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        if (nextProp) {
          enqueuePutListener(this._rootNodeID, propKey, nextProp, transaction);
        } else if (lastProp) {
          deleteListener(this._rootNodeID, propKey);
        }
      } else if (isCustomComponent(this._tag, nextProps)) {
        if (!node) {
          node = ReactMount.getNode(this._rootNodeID);
        }
        if (propKey === CHILDREN) {
          nextProp = null;
        }
        DOMPropertyOperations.setValueForAttribute(node, propKey, nextProp);
      } else if (DOMProperty.properties[propKey] || DOMProperty.isCustomAttribute(propKey)) {
        if (!node) {
          node = ReactMount.getNode(this._rootNodeID);
        }
        // If we're updating to null or undefined, we should remove the property
        // from the DOM node instead of inadvertantly setting to a string. This
        // brings us in line with the same behavior we have on initial render.
        if (nextProp != null) {
          DOMPropertyOperations.setValueForProperty(node, propKey, nextProp);
        } else {
          DOMPropertyOperations.deleteValueForProperty(node, propKey);
        }
      }
    }
    if (styleUpdates) {
      if (!node) {
        node = ReactMount.getNode(this._rootNodeID);
      }
      CSSPropertyOperations.setValueForStyles(node, styleUpdates);
    }
  },

  /**
   * Reconciles the children with the various properties that affect the
   * children content.
   *
   * @param {object} lastProps
   * @param {object} nextProps
   * @param {ReactReconcileTransaction} transaction
   * @param {object} context
   */
  _updateDOMChildren: function _updateDOMChildren(lastProps, nextProps, transaction, context) {
    var lastContent = CONTENT_TYPES[_typeof(lastProps.children)] ? lastProps.children : null;
    var nextContent = CONTENT_TYPES[_typeof(nextProps.children)] ? nextProps.children : null;

    var lastHtml = lastProps.dangerouslySetInnerHTML && lastProps.dangerouslySetInnerHTML.__html;
    var nextHtml = nextProps.dangerouslySetInnerHTML && nextProps.dangerouslySetInnerHTML.__html;

    // Note the use of `!=` which checks for null or undefined.
    var lastChildren = lastContent != null ? null : lastProps.children;
    var nextChildren = nextContent != null ? null : nextProps.children;

    // If we're switching from children to content/html or vice versa, remove
    // the old content
    var lastHasContentOrHtml = lastContent != null || lastHtml != null;
    var nextHasContentOrHtml = nextContent != null || nextHtml != null;
    if (lastChildren != null && nextChildren == null) {
      this.updateChildren(null, transaction, context);
    } else if (lastHasContentOrHtml && !nextHasContentOrHtml) {
      this.updateTextContent('');
    }

    if (nextContent != null) {
      if (lastContent !== nextContent) {
        this.updateTextContent('' + nextContent);
      }
    } else if (nextHtml != null) {
      if (lastHtml !== nextHtml) {
        this.updateMarkup('' + nextHtml);
      }
    } else if (nextChildren != null) {
      this.updateChildren(nextChildren, transaction, context);
    }
  },

  /**
   * Destroys all event registrations for this instance. Does not remove from
   * the DOM. That must be done by the parent.
   *
   * @internal
   */
  unmountComponent: function unmountComponent() {
    switch (this._tag) {
      case 'iframe':
      case 'img':
      case 'form':
      case 'video':
      case 'audio':
        var listeners = this._wrapperState.listeners;
        if (listeners) {
          for (var i = 0; i < listeners.length; i++) {
            listeners[i].remove();
          }
        }
        break;
      case 'input':
        ReactDOMInput.unmountWrapper(this);
        break;
      case 'html':
      case 'head':
      case 'body':
        /**
         * Components like <html> <head> and <body> can't be removed or added
         * easily in a cross-browser way, however it's valuable to be able to
         * take advantage of React's reconciliation for styling and <title>
         * management. So we just document it and throw in dangerous cases.
         */
        !false ? process.env.NODE_ENV !== 'production' ? invariant(false, '<%s> tried to unmount. Because of cross-browser quirks it is ' + 'impossible to unmount some top-level components (eg <html>, ' + '<head>, and <body>) reliably and efficiently. To fix this, have a ' + 'single top-level component that never unmounts render these ' + 'elements.', this._tag) : invariant(false) : undefined;
        break;
    }

    this.unmountChildren();
    ReactBrowserEventEmitter.deleteAllListeners(this._rootNodeID);
    ReactComponentBrowserEnvironment.unmountIDFromEnvironment(this._rootNodeID);
    this._rootNodeID = null;
    this._wrapperState = null;
    if (this._nodeWithLegacyProperties) {
      var node = this._nodeWithLegacyProperties;
      node._reactInternalComponent = null;
      this._nodeWithLegacyProperties = null;
    }
  },

  getPublicInstance: function getPublicInstance() {
    if (!this._nodeWithLegacyProperties) {
      var node = ReactMount.getNode(this._rootNodeID);

      node._reactInternalComponent = this;
      node.getDOMNode = legacyGetDOMNode;
      node.isMounted = legacyIsMounted;
      node.setState = legacySetStateEtc;
      node.replaceState = legacySetStateEtc;
      node.forceUpdate = legacySetStateEtc;
      node.setProps = legacySetProps;
      node.replaceProps = legacyReplaceProps;

      if (process.env.NODE_ENV !== 'production') {
        if (canDefineProperty) {
          Object.defineProperties(node, legacyPropsDescriptor);
        } else {
          // updateComponent will update this property on subsequent renders
          node.props = this._currentElement.props;
        }
      } else {
        // updateComponent will update this property on subsequent renders
        node.props = this._currentElement.props;
      }

      this._nodeWithLegacyProperties = node;
    }
    return this._nodeWithLegacyProperties;
  }

};

ReactPerf.measureMethods(ReactDOMComponent, 'ReactDOMComponent', {
  mountComponent: 'mountComponent',
  updateComponent: 'updateComponent'
});

assign(ReactDOMComponent.prototype, ReactDOMComponent.Mixin, ReactMultiChild.Mixin);

module.exports = ReactDOMComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RE9NQ29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBY0E7Ozs7QUFFQSxJQUFJLGlCQUFpQixRQUFRLGtCQUFSLENBQWpCO0FBQ0osSUFBSSx3QkFBd0IsUUFBUSx5QkFBUixDQUF4QjtBQUNKLElBQUksY0FBYyxRQUFRLGVBQVIsQ0FBZDtBQUNKLElBQUksd0JBQXdCLFFBQVEseUJBQVIsQ0FBeEI7QUFDSixJQUFJLGlCQUFpQixRQUFRLGtCQUFSLENBQWpCO0FBQ0osSUFBSSwyQkFBMkIsUUFBUSw0QkFBUixDQUEzQjtBQUNKLElBQUksbUNBQW1DLFFBQVEsb0NBQVIsQ0FBbkM7QUFDSixJQUFJLGlCQUFpQixRQUFRLGtCQUFSLENBQWpCO0FBQ0osSUFBSSxnQkFBZ0IsUUFBUSxpQkFBUixDQUFoQjtBQUNKLElBQUksaUJBQWlCLFFBQVEsa0JBQVIsQ0FBakI7QUFDSixJQUFJLGlCQUFpQixRQUFRLGtCQUFSLENBQWpCO0FBQ0osSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUFuQjtBQUNKLElBQUksYUFBYSxRQUFRLGNBQVIsQ0FBYjtBQUNKLElBQUksa0JBQWtCLFFBQVEsbUJBQVIsQ0FBbEI7QUFDSixJQUFJLFlBQVksUUFBUSxhQUFSLENBQVo7QUFDSixJQUFJLG1CQUFtQixRQUFRLG9CQUFSLENBQW5COztBQUVKLElBQUksU0FBUyxRQUFRLGlCQUFSLENBQVQ7QUFDSixJQUFJLG9CQUFvQixRQUFRLHFCQUFSLENBQXBCO0FBQ0osSUFBSSw4QkFBOEIsUUFBUSwrQkFBUixDQUE5QjtBQUNKLElBQUksWUFBWSxRQUFRLG9CQUFSLENBQVo7QUFDSixJQUFJLG1CQUFtQixRQUFRLG9CQUFSLENBQW5CO0FBQ0osSUFBSSxRQUFRLFFBQVEsZ0JBQVIsQ0FBUjtBQUNKLElBQUksZUFBZSxRQUFRLGdCQUFSLENBQWY7QUFDSixJQUFJLGlCQUFp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QWlDLElBQWpDLENBeEJtQztLQUFyQztBQTBCQSxXQUFPLEtBQUsseUJBQUwsQ0EzQnNCO0dBQVo7O0NBM2dCckI7O0FBMmlCQSxVQUFVLGNBQVYsQ0FBeUIsaUJBQXpCLEVBQTRDLG1CQUE1QyxFQUFpRTtBQUMvRCxrQkFBZ0IsZ0JBQWhCO0FBQ0EsbUJBQWlCLGlCQUFqQjtDQUZGOztBQUtBLE9BQU8sa0JBQWtCLFNBQWxCLEVBQTZCLGtCQUFrQixLQUFsQixFQUF5QixnQkFBZ0IsS0FBaEIsQ0FBN0Q7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLGlCQUFqQiIsImZpbGUiOiJSZWFjdERPTUNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdERPTUNvbXBvbmVudFxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG4vKiBnbG9iYWwgaGFzT3duUHJvcGVydHk6dHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBBdXRvRm9jdXNVdGlscyA9IHJlcXVpcmUoJy4vQXV0b0ZvY3VzVXRpbHMnKTtcbnZhciBDU1NQcm9wZXJ0eU9wZXJhdGlvbnMgPSByZXF1aXJlKCcuL0NTU1Byb3BlcnR5T3BlcmF0aW9ucycpO1xudmFyIERPTVByb3BlcnR5ID0gcmVxdWlyZSgnLi9ET01Qcm9wZXJ0eScpO1xudmFyIERPTVByb3BlcnR5T3BlcmF0aW9ucyA9IHJlcXVpcmUoJy4vRE9NUHJvcGVydHlPcGVyYXRpb25zJyk7XG52YXIgRXZlbnRDb25zdGFudHMgPSByZXF1aXJlKCcuL0V2ZW50Q29uc3RhbnRzJyk7XG52YXIgUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9SZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXInKTtcbnZhciBSZWFjdENvbXBvbmVudEJyb3dzZXJFbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vUmVhY3RDb21wb25lbnRCcm93c2VyRW52aXJvbm1lbnQnKTtcbnZhciBSZWFjdERPTUJ1dHRvbiA9IHJlcXVpcmUoJy4vUmVhY3RET01CdXR0b24nKTtcbnZhciBSZWFjdERPTUlucHV0ID0gcmVxdWlyZSgnLi9SZWFjdERPTUlucHV0Jyk7XG52YXIgUmVhY3RET01PcHRpb24gPSByZXF1aXJlKCcuL1JlYWN0RE9NT3B0aW9uJyk7XG52YXIgUmVhY3RET01TZWxlY3QgPSByZXF1aXJlKCcuL1JlYWN0RE9NU2VsZWN0Jyk7XG52YXIgUmVhY3RET01UZXh0YXJlYSA9IHJlcXVpcmUoJy4vUmVhY3RET01UZXh0YXJlYScpO1xudmFyIFJlYWN0TW91bnQgPSByZXF1aXJlKCcuL1JlYWN0TW91bnQnKTtcbnZhciBSZWFjdE11bHRpQ2hpbGQgPSByZXF1aXJlKCcuL1JlYWN0TXVsdGlDaGlsZCcpO1xudmFyIFJlYWN0UGVyZiA9IHJlcXVpcmUoJy4vUmVhY3RQZXJmJyk7XG52YXIgUmVhY3RVcGRhdGVRdWV1ZSA9IHJlcXVpcmUoJy4vUmVhY3RVcGRhdGVRdWV1ZScpO1xuXG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi9PYmplY3QuYXNzaWduJyk7XG52YXIgY2FuRGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL2NhbkRlZmluZVByb3BlcnR5Jyk7XG52YXIgZXNjYXBlVGV4dENvbnRlbnRGb3JCcm93c2VyID0gcmVxdWlyZSgnLi9lc2NhcGVUZXh0Q29udGVudEZvckJyb3dzZXInKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciBpc0V2ZW50U3VwcG9ydGVkID0gcmVxdWlyZSgnLi9pc0V2ZW50U3VwcG9ydGVkJyk7XG52YXIga2V5T2YgPSByZXF1aXJlKCdmYmpzL2xpYi9rZXlPZicpO1xudmFyIHNldElubmVySFRNTCA9IHJlcXVpcmUoJy4vc2V0SW5uZXJIVE1MJyk7XG52YXIgc2V0VGV4dENvbnRlbnQgPSByZXF1aXJlKCcuL3NldFRleHRDb250ZW50Jyk7XG52YXIgc2hhbGxvd0VxdWFsID0gcmVxdWlyZSgnZmJqcy9saWIvc2hhbGxvd0VxdWFsJyk7XG52YXIgdmFsaWRhdGVET01OZXN0aW5nID0gcmVxdWlyZSgnLi92YWxpZGF0ZURPTU5lc3RpbmcnKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG52YXIgZGVsZXRlTGlzdGVuZXIgPSBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIuZGVsZXRlTGlzdGVuZXI7XG52YXIgbGlzdGVuVG8gPSBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIubGlzdGVuVG87XG52YXIgcmVnaXN0cmF0aW9uTmFtZU1vZHVsZXMgPSBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIucmVnaXN0cmF0aW9uTmFtZU1vZHVsZXM7XG5cbi8vIEZvciBxdWlja2x5IG1hdGNoaW5nIGNoaWxkcmVuIHR5cGUsIHRvIHRlc3QgaWYgY2FuIGJlIHRyZWF0ZWQgYXMgY29udGVudC5cbnZhciBDT05URU5UX1RZUEVTID0geyAnc3RyaW5nJzogdHJ1ZSwgJ251bWJlcic6IHRydWUgfTtcblxudmFyIENISUxEUkVOID0ga2V5T2YoeyBjaGlsZHJlbjogbnVsbCB9KTtcbnZhciBTVFlMRSA9IGtleU9mKHsgc3R5bGU6IG51bGwgfSk7XG52YXIgSFRNTCA9IGtleU9mKHsgX19odG1sOiBudWxsIH0pO1xuXG52YXIgRUxFTUVOVF9OT0RFX1RZUEUgPSAxO1xuXG5mdW5jdGlvbiBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oaW50ZXJuYWxJbnN0YW5jZSkge1xuICBpZiAoaW50ZXJuYWxJbnN0YW5jZSkge1xuICAgIHZhciBvd25lciA9IGludGVybmFsSW5zdGFuY2UuX2N1cnJlbnRFbGVtZW50Ll9vd25lciB8fCBudWxsO1xuICAgIGlmIChvd25lcikge1xuICAgICAgdmFyIG5hbWUgPSBvd25lci5nZXROYW1lKCk7XG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICByZXR1cm4gJyBUaGlzIERPTSBub2RlIHdhcyByZW5kZXJlZCBieSBgJyArIG5hbWUgKyAnYC4nO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbnZhciBsZWdhY3lQcm9wc0Rlc2NyaXB0b3I7XG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBsZWdhY3lQcm9wc0Rlc2NyaXB0b3IgPSB7XG4gICAgcHJvcHM6IHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLl9yZWFjdEludGVybmFsQ29tcG9uZW50O1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ1JlYWN0RE9NQ29tcG9uZW50OiBEbyBub3QgYWNjZXNzIC5wcm9wcyBvZiBhIERPTSBub2RlOyBpbnN0ZWFkLCAnICsgJ3JlY3JlYXRlIHRoZSBwcm9wcyBhcyBgcmVuZGVyYCBkaWQgb3JpZ2luYWxseSBvciByZWFkIHRoZSBET00gJyArICdwcm9wZXJ0aWVzL2F0dHJpYnV0ZXMgZGlyZWN0bHkgZnJvbSB0aGlzIG5vZGUgKGUuZy4sICcgKyAndGhpcy5yZWZzLmJveC5jbGFzc05hbWUpLiVzJywgZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKGNvbXBvbmVudCkpIDogdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gY29tcG9uZW50Ll9jdXJyZW50RWxlbWVudC5wcm9wcztcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxlZ2FjeUdldERPTU5vZGUoKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuX3JlYWN0SW50ZXJuYWxDb21wb25lbnQ7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdSZWFjdERPTUNvbXBvbmVudDogRG8gbm90IGFjY2VzcyAuZ2V0RE9NTm9kZSgpIG9mIGEgRE9NIG5vZGU7ICcgKyAnaW5zdGVhZCwgdXNlIHRoZSBub2RlIGRpcmVjdGx5LiVzJywgZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKGNvbXBvbmVudCkpIDogdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiBsZWdhY3lJc01vdW50ZWQoKSB7XG4gIHZhciBjb21wb25lbnQgPSB0aGlzLl9yZWFjdEludGVybmFsQ29tcG9uZW50O1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnUmVhY3RET01Db21wb25lbnQ6IERvIG5vdCBhY2Nlc3MgLmlzTW91bnRlZCgpIG9mIGEgRE9NIG5vZGUuJXMnLCBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oY29tcG9uZW50KSkgOiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuICEhY29tcG9uZW50O1xufVxuXG5mdW5jdGlvbiBsZWdhY3lTZXRTdGF0ZUV0YygpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5fcmVhY3RJbnRlcm5hbENvbXBvbmVudDtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ1JlYWN0RE9NQ29tcG9uZW50OiBEbyBub3QgYWNjZXNzIC5zZXRTdGF0ZSgpLCAucmVwbGFjZVN0YXRlKCksIG9yICcgKyAnLmZvcmNlVXBkYXRlKCkgb2YgYSBET00gbm9kZS4gVGhpcyBpcyBhIG5vLW9wLiVzJywgZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKGNvbXBvbmVudCkpIDogdW5kZWZpbmVkO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxlZ2FjeVNldFByb3BzKHBhcnRpYWxQcm9wcywgY2FsbGJhY2spIHtcbiAgdmFyIGNvbXBvbmVudCA9IHRoaXMuX3JlYWN0SW50ZXJuYWxDb21wb25lbnQ7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdSZWFjdERPTUNvbXBvbmVudDogRG8gbm90IGFjY2VzcyAuc2V0UHJvcHMoKSBvZiBhIERPTSBub2RlLiAnICsgJ0luc3RlYWQsIGNhbGwgUmVhY3RET00ucmVuZGVyIGFnYWluIGF0IHRoZSB0b3AgbGV2ZWwuJXMnLCBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oY29tcG9uZW50KSkgOiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKCFjb21wb25lbnQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgUmVhY3RVcGRhdGVRdWV1ZS5lbnF1ZXVlU2V0UHJvcHNJbnRlcm5hbChjb21wb25lbnQsIHBhcnRpYWxQcm9wcyk7XG4gIGlmIChjYWxsYmFjaykge1xuICAgIFJlYWN0VXBkYXRlUXVldWUuZW5xdWV1ZUNhbGxiYWNrSW50ZXJuYWwoY29tcG9uZW50LCBjYWxsYmFjayk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbGVnYWN5UmVwbGFjZVByb3BzKHBhcnRpYWxQcm9wcywgY2FsbGJhY2spIHtcbiAgdmFyIGNvbXBvbmVudCA9IHRoaXMuX3JlYWN0SW50ZXJuYWxDb21wb25lbnQ7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdSZWFjdERPTUNvbXBvbmVudDogRG8gbm90IGFjY2VzcyAucmVwbGFjZVByb3BzKCkgb2YgYSBET00gbm9kZS4gJyArICdJbnN0ZWFkLCBjYWxsIFJlYWN0RE9NLnJlbmRlciBhZ2FpbiBhdCB0aGUgdG9wIGxldmVsLiVzJywgZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKGNvbXBvbmVudCkpIDogdW5kZWZpbmVkO1xuICB9XG4gIGlmICghY29tcG9uZW50KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIFJlYWN0VXBkYXRlUXVldWUuZW5xdWV1ZVJlcGxhY2VQcm9wc0ludGVybmFsKGNvbXBvbmVudCwgcGFydGlhbFByb3BzKTtcbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgUmVhY3RVcGRhdGVRdWV1ZS5lbnF1ZXVlQ2FsbGJhY2tJbnRlcm5hbChjb21wb25lbnQsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmcmllbmRseVN0cmluZ2lmeShvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgcmV0dXJuICdbJyArIG9iai5tYXAoZnJpZW5kbHlTdHJpbmdpZnkpLmpvaW4oJywgJykgKyAnXSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBwYWlycyA9IFtdO1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICAgIHZhciBrZXlFc2NhcGVkID0gL15bYS16JF9dW1xcdyRfXSokL2kudGVzdChrZXkpID8ga2V5IDogSlNPTi5zdHJpbmdpZnkoa2V5KTtcbiAgICAgICAgICBwYWlycy5wdXNoKGtleUVzY2FwZWQgKyAnOiAnICsgZnJpZW5kbHlTdHJpbmdpZnkob2JqW2tleV0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuICd7JyArIHBhaXJzLmpvaW4oJywgJykgKyAnfSc7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiAnW2Z1bmN0aW9uIG9iamVjdF0nO1xuICB9XG4gIC8vIERpZmZlcnMgZnJvbSBKU09OLnN0cmluZ2lmeSBpbiB0aGF0IHVuZGVmaW5lZCBiZWNhdXNlcyB1bmRlZmluZWQgYW5kIHRoYXRcbiAgLy8gaW5mIGFuZCBuYW4gZG9uJ3QgYmVjb21lIG51bGxcbiAgcmV0dXJuIFN0cmluZyhvYmopO1xufVxuXG52YXIgc3R5bGVNdXRhdGlvbldhcm5pbmcgPSB7fTtcblxuZnVuY3Rpb24gY2hlY2tBbmRXYXJuRm9yTXV0YXRlZFN0eWxlKHN0eWxlMSwgc3R5bGUyLCBjb21wb25lbnQpIHtcbiAgaWYgKHN0eWxlMSA9PSBudWxsIHx8IHN0eWxlMiA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChzaGFsbG93RXF1YWwoc3R5bGUxLCBzdHlsZTIpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnQuX3RhZztcbiAgdmFyIG93bmVyID0gY29tcG9uZW50Ll9jdXJyZW50RWxlbWVudC5fb3duZXI7XG4gIHZhciBvd25lck5hbWU7XG4gIGlmIChvd25lcikge1xuICAgIG93bmVyTmFtZSA9IG93bmVyLmdldE5hbWUoKTtcbiAgfVxuXG4gIHZhciBoYXNoID0gb3duZXJOYW1lICsgJ3wnICsgY29tcG9uZW50TmFtZTtcblxuICBpZiAoc3R5bGVNdXRhdGlvbldhcm5pbmcuaGFzT3duUHJvcGVydHkoaGFzaCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdHlsZU11dGF0aW9uV2FybmluZ1toYXNoXSA9IHRydWU7XG5cbiAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdgJXNgIHdhcyBwYXNzZWQgYSBzdHlsZSBvYmplY3QgdGhhdCBoYXMgcHJldmlvdXNseSBiZWVuIG11dGF0ZWQuICcgKyAnTXV0YXRpbmcgYHN0eWxlYCBpcyBkZXByZWNhdGVkLiBDb25zaWRlciBjbG9uaW5nIGl0IGJlZm9yZWhhbmQuIENoZWNrICcgKyAndGhlIGByZW5kZXJgICVzLiBQcmV2aW91cyBzdHlsZTogJXMuIE11dGF0ZWQgc3R5bGU6ICVzLicsIGNvbXBvbmVudE5hbWUsIG93bmVyID8gJ29mIGAnICsgb3duZXJOYW1lICsgJ2AnIDogJ3VzaW5nIDwnICsgY29tcG9uZW50TmFtZSArICc+JywgZnJpZW5kbHlTdHJpbmdpZnkoc3R5bGUxKSwgZnJpZW5kbHlTdHJpbmdpZnkoc3R5bGUyKSkgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbXBvbmVudFxuICogQHBhcmFtIHs/b2JqZWN0fSBwcm9wc1xuICovXG5mdW5jdGlvbiBhc3NlcnRWYWxpZFByb3BzKGNvbXBvbmVudCwgcHJvcHMpIHtcbiAgaWYgKCFwcm9wcykge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBOb3RlIHRoZSB1c2Ugb2YgYD09YCB3aGljaCBjaGVja3MgZm9yIG51bGwgb3IgdW5kZWZpbmVkLlxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmICh2b2lkRWxlbWVudFRhZ3NbY29tcG9uZW50Ll90YWddKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhwcm9wcy5jaGlsZHJlbiA9PSBudWxsICYmIHByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MID09IG51bGwsICclcyBpcyBhIHZvaWQgZWxlbWVudCB0YWcgYW5kIG11c3Qgbm90IGhhdmUgYGNoaWxkcmVuYCBvciAnICsgJ3VzZSBgcHJvcHMuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxgLiVzJywgY29tcG9uZW50Ll90YWcsIGNvbXBvbmVudC5fY3VycmVudEVsZW1lbnQuX293bmVyID8gJyBDaGVjayB0aGUgcmVuZGVyIG1ldGhvZCBvZiAnICsgY29tcG9uZW50Ll9jdXJyZW50RWxlbWVudC5fb3duZXIuZ2V0TmFtZSgpICsgJy4nIDogJycpIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuICBpZiAocHJvcHMuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwgIT0gbnVsbCkge1xuICAgICEocHJvcHMuY2hpbGRyZW4gPT0gbnVsbCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnQ2FuIG9ubHkgc2V0IG9uZSBvZiBgY2hpbGRyZW5gIG9yIGBwcm9wcy5kYW5nZXJvdXNseVNldElubmVySFRNTGAuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgICEodHlwZW9mIHByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MID09PSAnb2JqZWN0JyAmJiBIVE1MIGluIHByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdgcHJvcHMuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxgIG11c3QgYmUgaW4gdGhlIGZvcm0gYHtfX2h0bWw6IC4uLn1gLiAnICsgJ1BsZWFzZSB2aXNpdCBodHRwczovL2ZiLm1lL3JlYWN0LWludmFyaWFudC1kYW5nZXJvdXNseS1zZXQtaW5uZXItaHRtbCAnICsgJ2ZvciBtb3JlIGluZm9ybWF0aW9uLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgfVxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKHByb3BzLmlubmVySFRNTCA9PSBudWxsLCAnRGlyZWN0bHkgc2V0dGluZyBwcm9wZXJ0eSBgaW5uZXJIVE1MYCBpcyBub3QgcGVybWl0dGVkLiAnICsgJ0ZvciBtb3JlIGluZm9ybWF0aW9uLCBsb29rdXAgZG9jdW1lbnRhdGlvbiBvbiBgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUxgLicpIDogdW5kZWZpbmVkO1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKCFwcm9wcy5jb250ZW50RWRpdGFibGUgfHwgcHJvcHMuY2hpbGRyZW4gPT0gbnVsbCwgJ0EgY29tcG9uZW50IGlzIGBjb250ZW50RWRpdGFibGVgIGFuZCBjb250YWlucyBgY2hpbGRyZW5gIG1hbmFnZWQgYnkgJyArICdSZWFjdC4gSXQgaXMgbm93IHlvdXIgcmVzcG9uc2liaWxpdHkgdG8gZ3VhcmFudGVlIHRoYXQgbm9uZSBvZiAnICsgJ3Rob3NlIG5vZGVzIGFyZSB1bmV4cGVjdGVkbHkgbW9kaWZpZWQgb3IgZHVwbGljYXRlZC4gVGhpcyBpcyAnICsgJ3Byb2JhYmx5IG5vdCBpbnRlbnRpb25hbC4nKSA6IHVuZGVmaW5lZDtcbiAgfVxuICAhKHByb3BzLnN0eWxlID09IG51bGwgfHwgdHlwZW9mIHByb3BzLnN0eWxlID09PSAnb2JqZWN0JykgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnVGhlIGBzdHlsZWAgcHJvcCBleHBlY3RzIGEgbWFwcGluZyBmcm9tIHN0eWxlIHByb3BlcnRpZXMgdG8gdmFsdWVzLCAnICsgJ25vdCBhIHN0cmluZy4gRm9yIGV4YW1wbGUsIHN0eWxlPXt7bWFyZ2luUmlnaHQ6IHNwYWNpbmcgKyBcXCdlbVxcJ319IHdoZW4gJyArICd1c2luZyBKU1guJXMnLCBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oY29tcG9uZW50KSkgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBlbnF1ZXVlUHV0TGlzdGVuZXIoaWQsIHJlZ2lzdHJhdGlvbk5hbWUsIGxpc3RlbmVyLCB0cmFuc2FjdGlvbikge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIC8vIElFOCBoYXMgbm8gQVBJIGZvciBldmVudCBjYXB0dXJpbmcgYW5kIHRoZSBgb25TY3JvbGxgIGV2ZW50IGRvZXNuJ3RcbiAgICAvLyBidWJibGUuXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcocmVnaXN0cmF0aW9uTmFtZSAhPT0gJ29uU2Nyb2xsJyB8fCBpc0V2ZW50U3VwcG9ydGVkKCdzY3JvbGwnLCB0cnVlKSwgJ1RoaXMgYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCB0aGUgYG9uU2Nyb2xsYCBldmVudCcpIDogdW5kZWZpbmVkO1xuICB9XG4gIHZhciBjb250YWluZXIgPSBSZWFjdE1vdW50LmZpbmRSZWFjdENvbnRhaW5lckZvcklEKGlkKTtcbiAgaWYgKGNvbnRhaW5lcikge1xuICAgIHZhciBkb2MgPSBjb250YWluZXIubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERV9UWVBFID8gY29udGFpbmVyLm93bmVyRG9jdW1lbnQgOiBjb250YWluZXI7XG4gICAgbGlzdGVuVG8ocmVnaXN0cmF0aW9uTmFtZSwgZG9jKTtcbiAgfVxuICB0cmFuc2FjdGlvbi5nZXRSZWFjdE1vdW50UmVhZHkoKS5lbnF1ZXVlKHB1dExpc3RlbmVyLCB7XG4gICAgaWQ6IGlkLFxuICAgIHJlZ2lzdHJhdGlvbk5hbWU6IHJlZ2lzdHJhdGlvbk5hbWUsXG4gICAgbGlzdGVuZXI6IGxpc3RlbmVyXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBwdXRMaXN0ZW5lcigpIHtcbiAgdmFyIGxpc3RlbmVyVG9QdXQgPSB0aGlzO1xuICBSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIucHV0TGlzdGVuZXIobGlzdGVuZXJUb1B1dC5pZCwgbGlzdGVuZXJUb1B1dC5yZWdpc3RyYXRpb25OYW1lLCBsaXN0ZW5lclRvUHV0Lmxpc3RlbmVyKTtcbn1cblxuLy8gVGhlcmUgYXJlIHNvIG1hbnkgbWVkaWEgZXZlbnRzLCBpdCBtYWtlcyBzZW5zZSB0byBqdXN0XG4vLyBtYWludGFpbiBhIGxpc3QgcmF0aGVyIHRoYW4gY3JlYXRlIGEgYHRyYXBCdWJibGVkRXZlbnRgIGZvciBlYWNoXG52YXIgbWVkaWFFdmVudHMgPSB7XG4gIHRvcEFib3J0OiAnYWJvcnQnLFxuICB0b3BDYW5QbGF5OiAnY2FucGxheScsXG4gIHRvcENhblBsYXlUaHJvdWdoOiAnY2FucGxheXRocm91Z2gnLFxuICB0b3BEdXJhdGlvbkNoYW5nZTogJ2R1cmF0aW9uY2hhbmdlJyxcbiAgdG9wRW1wdGllZDogJ2VtcHRpZWQnLFxuICB0b3BFbmNyeXB0ZWQ6ICdlbmNyeXB0ZWQnLFxuICB0b3BFbmRlZDogJ2VuZGVkJyxcbiAgdG9wRXJyb3I6ICdlcnJvcicsXG4gIHRvcExvYWRlZERhdGE6ICdsb2FkZWRkYXRhJyxcbiAgdG9wTG9hZGVkTWV0YWRhdGE6ICdsb2FkZWRtZXRhZGF0YScsXG4gIHRvcExvYWRTdGFydDogJ2xvYWRzdGFydCcsXG4gIHRvcFBhdXNlOiAncGF1c2UnLFxuICB0b3BQbGF5OiAncGxheScsXG4gIHRvcFBsYXlpbmc6ICdwbGF5aW5nJyxcbiAgdG9wUHJvZ3Jlc3M6ICdwcm9ncmVzcycsXG4gIHRvcFJhdGVDaGFuZ2U6ICdyYXRlY2hhbmdlJyxcbiAgdG9wU2Vla2VkOiAnc2Vla2VkJyxcbiAgdG9wU2Vla2luZzogJ3NlZWtpbmcnLFxuICB0b3BTdGFsbGVkOiAnc3RhbGxlZCcsXG4gIHRvcFN1c3BlbmQ6ICdzdXNwZW5kJyxcbiAgdG9wVGltZVVwZGF0ZTogJ3RpbWV1cGRhdGUnLFxuICB0b3BWb2x1bWVDaGFuZ2U6ICd2b2x1bWVjaGFuZ2UnLFxuICB0b3BXYWl0aW5nOiAnd2FpdGluZydcbn07XG5cbmZ1bmN0aW9uIHRyYXBCdWJibGVkRXZlbnRzTG9jYWwoKSB7XG4gIHZhciBpbnN0ID0gdGhpcztcbiAgLy8gSWYgYSBjb21wb25lbnQgcmVuZGVycyB0byBudWxsIG9yIGlmIGFub3RoZXIgY29tcG9uZW50IGZhdGFscyBhbmQgY2F1c2VzXG4gIC8vIHRoZSBzdGF0ZSBvZiB0aGUgdHJlZSB0byBiZSBjb3JydXB0ZWQsIGBub2RlYCBoZXJlIGNhbiBiZSBudWxsLlxuICAhaW5zdC5fcm9vdE5vZGVJRCA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdNdXN0IGJlIG1vdW50ZWQgdG8gdHJhcCBldmVudHMnKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gIHZhciBub2RlID0gUmVhY3RNb3VudC5nZXROb2RlKGluc3QuX3Jvb3ROb2RlSUQpO1xuICAhbm9kZSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICd0cmFwQnViYmxlZEV2ZW50KC4uLik6IFJlcXVpcmVzIG5vZGUgdG8gYmUgcmVuZGVyZWQuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuXG4gIHN3aXRjaCAoaW5zdC5fdGFnKSB7XG4gICAgY2FzZSAnaWZyYW1lJzpcbiAgICAgIGluc3QuX3dyYXBwZXJTdGF0ZS5saXN0ZW5lcnMgPSBbUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyLnRyYXBCdWJibGVkRXZlbnQoRXZlbnRDb25zdGFudHMudG9wTGV2ZWxUeXBlcy50b3BMb2FkLCAnbG9hZCcsIG5vZGUpXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3ZpZGVvJzpcbiAgICBjYXNlICdhdWRpbyc6XG5cbiAgICAgIGluc3QuX3dyYXBwZXJTdGF0ZS5saXN0ZW5lcnMgPSBbXTtcbiAgICAgIC8vIGNyZWF0ZSBsaXN0ZW5lciBmb3IgZWFjaCBtZWRpYSBldmVudFxuICAgICAgZm9yICh2YXIgZXZlbnQgaW4gbWVkaWFFdmVudHMpIHtcbiAgICAgICAgaWYgKG1lZGlhRXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50KSkge1xuICAgICAgICAgIGluc3QuX3dyYXBwZXJTdGF0ZS5saXN0ZW5lcnMucHVzaChSZWFjdEJyb3dzZXJFdmVudEVtaXR0ZXIudHJhcEJ1YmJsZWRFdmVudChFdmVudENvbnN0YW50cy50b3BMZXZlbFR5cGVzW2V2ZW50XSwgbWVkaWFFdmVudHNbZXZlbnRdLCBub2RlKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnaW1nJzpcbiAgICAgIGluc3QuX3dyYXBwZXJTdGF0ZS5saXN0ZW5lcnMgPSBbUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyLnRyYXBCdWJibGVkRXZlbnQoRXZlbnRDb25zdGFudHMudG9wTGV2ZWxUeXBlcy50b3BFcnJvciwgJ2Vycm9yJywgbm9kZSksIFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlci50cmFwQnViYmxlZEV2ZW50KEV2ZW50Q29uc3RhbnRzLnRvcExldmVsVHlwZXMudG9wTG9hZCwgJ2xvYWQnLCBub2RlKV07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdmb3JtJzpcbiAgICAgIGluc3QuX3dyYXBwZXJTdGF0ZS5saXN0ZW5lcnMgPSBbUmVhY3RCcm93c2VyRXZlbnRFbWl0dGVyLnRyYXBCdWJibGVkRXZlbnQoRXZlbnRDb25zdGFudHMudG9wTGV2ZWxUeXBlcy50b3BSZXNldCwgJ3Jlc2V0Jywgbm9kZSksIFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlci50cmFwQnViYmxlZEV2ZW50KEV2ZW50Q29uc3RhbnRzLnRvcExldmVsVHlwZXMudG9wU3VibWl0LCAnc3VibWl0Jywgbm9kZSldO1xuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuZnVuY3Rpb24gbW91bnRSZWFkeUlucHV0V3JhcHBlcigpIHtcbiAgUmVhY3RET01JbnB1dC5tb3VudFJlYWR5V3JhcHBlcih0aGlzKTtcbn1cblxuZnVuY3Rpb24gcG9zdFVwZGF0ZVNlbGVjdFdyYXBwZXIoKSB7XG4gIFJlYWN0RE9NU2VsZWN0LnBvc3RVcGRhdGVXcmFwcGVyKHRoaXMpO1xufVxuXG4vLyBGb3IgSFRNTCwgY2VydGFpbiB0YWdzIHNob3VsZCBvbWl0IHRoZWlyIGNsb3NlIHRhZy4gV2Uga2VlcCBhIHdoaXRlbGlzdCBmb3Jcbi8vIHRob3NlIHNwZWNpYWwgY2FzZWQgdGFncy5cblxudmFyIG9taXR0ZWRDbG9zZVRhZ3MgPSB7XG4gICdhcmVhJzogdHJ1ZSxcbiAgJ2Jhc2UnOiB0cnVlLFxuICAnYnInOiB0cnVlLFxuICAnY29sJzogdHJ1ZSxcbiAgJ2VtYmVkJzogdHJ1ZSxcbiAgJ2hyJzogdHJ1ZSxcbiAgJ2ltZyc6IHRydWUsXG4gICdpbnB1dCc6IHRydWUsXG4gICdrZXlnZW4nOiB0cnVlLFxuICAnbGluayc6IHRydWUsXG4gICdtZXRhJzogdHJ1ZSxcbiAgJ3BhcmFtJzogdHJ1ZSxcbiAgJ3NvdXJjZSc6IHRydWUsXG4gICd0cmFjayc6IHRydWUsXG4gICd3YnInOiB0cnVlXG59O1xuXG4vLyBOT1RFOiBtZW51aXRlbSdzIGNsb3NlIHRhZyBzaG91bGQgYmUgb21pdHRlZCwgYnV0IHRoYXQgY2F1c2VzIHByb2JsZW1zLlxudmFyIG5ld2xpbmVFYXRpbmdUYWdzID0ge1xuICAnbGlzdGluZyc6IHRydWUsXG4gICdwcmUnOiB0cnVlLFxuICAndGV4dGFyZWEnOiB0cnVlXG59O1xuXG4vLyBGb3IgSFRNTCwgY2VydGFpbiB0YWdzIGNhbm5vdCBoYXZlIGNoaWxkcmVuLiBUaGlzIGhhcyB0aGUgc2FtZSBwdXJwb3NlIGFzXG4vLyBgb21pdHRlZENsb3NlVGFnc2AgZXhjZXB0IHRoYXQgYG1lbnVpdGVtYCBzaG91bGQgc3RpbGwgaGF2ZSBpdHMgY2xvc2luZyB0YWcuXG5cbnZhciB2b2lkRWxlbWVudFRhZ3MgPSBhc3NpZ24oe1xuICAnbWVudWl0ZW0nOiB0cnVlXG59LCBvbWl0dGVkQ2xvc2VUYWdzKTtcblxuLy8gV2UgYWNjZXB0IGFueSB0YWcgdG8gYmUgcmVuZGVyZWQgYnV0IHNpbmNlIHRoaXMgZ2V0cyBpbmplY3RlZCBpbnRvIGFyYml0cmFyeVxuLy8gSFRNTCwgd2Ugd2FudCB0byBtYWtlIHN1cmUgdGhhdCBpdCdzIGEgc2FmZSB0YWcuXG4vLyBodHRwOi8vd3d3LnczLm9yZy9UUi9SRUMteG1sLyNOVC1OYW1lXG5cbnZhciBWQUxJRF9UQUdfUkVHRVggPSAvXlthLXpBLVpdW2EtekEtWjpfXFwuXFwtXFxkXSokLzsgLy8gU2ltcGxpZmllZCBzdWJzZXRcbnZhciB2YWxpZGF0ZWRUYWdDYWNoZSA9IHt9O1xudmFyIGhhc093blByb3BlcnR5ID0gKHt9KS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gdmFsaWRhdGVEYW5nZXJvdXNUYWcodGFnKSB7XG4gIGlmICghaGFzT3duUHJvcGVydHkuY2FsbCh2YWxpZGF0ZWRUYWdDYWNoZSwgdGFnKSkge1xuICAgICFWQUxJRF9UQUdfUkVHRVgudGVzdCh0YWcpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ0ludmFsaWQgdGFnOiAlcycsIHRhZykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIHZhbGlkYXRlZFRhZ0NhY2hlW3RhZ10gPSB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NDaGlsZENvbnRleHREZXYoY29udGV4dCwgaW5zdCkge1xuICAvLyBQYXNzIGRvd24gb3VyIHRhZyBuYW1lIHRvIGNoaWxkIGNvbXBvbmVudHMgZm9yIHZhbGlkYXRpb24gcHVycG9zZXNcbiAgY29udGV4dCA9IGFzc2lnbih7fSwgY29udGV4dCk7XG4gIHZhciBpbmZvID0gY29udGV4dFt2YWxpZGF0ZURPTU5lc3RpbmcuYW5jZXN0b3JJbmZvQ29udGV4dEtleV07XG4gIGNvbnRleHRbdmFsaWRhdGVET01OZXN0aW5nLmFuY2VzdG9ySW5mb0NvbnRleHRLZXldID0gdmFsaWRhdGVET01OZXN0aW5nLnVwZGF0ZWRBbmNlc3RvckluZm8oaW5mbywgaW5zdC5fdGFnLCBpbnN0KTtcbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmZ1bmN0aW9uIGlzQ3VzdG9tQ29tcG9uZW50KHRhZ05hbWUsIHByb3BzKSB7XG4gIHJldHVybiB0YWdOYW1lLmluZGV4T2YoJy0nKSA+PSAwIHx8IHByb3BzLmlzICE9IG51bGw7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBSZWFjdCBjbGFzcyB0aGF0IGlzIGlkZW1wb3RlbnQgYW5kIGNhcGFibGUgb2YgY29udGFpbmluZyBvdGhlclxuICogUmVhY3QgY29tcG9uZW50cy4gSXQgYWNjZXB0cyBldmVudCBsaXN0ZW5lcnMgYW5kIERPTSBwcm9wZXJ0aWVzIHRoYXQgYXJlXG4gKiB2YWxpZCBhY2NvcmRpbmcgdG8gYERPTVByb3BlcnR5YC5cbiAqXG4gKiAgLSBFdmVudCBsaXN0ZW5lcnM6IGBvbkNsaWNrYCwgYG9uTW91c2VEb3duYCwgZXRjLlxuICogIC0gRE9NIHByb3BlcnRpZXM6IGBjbGFzc05hbWVgLCBgbmFtZWAsIGB0aXRsZWAsIGV0Yy5cbiAqXG4gKiBUaGUgYHN0eWxlYCBwcm9wZXJ0eSBmdW5jdGlvbnMgZGlmZmVyZW50bHkgZnJvbSB0aGUgRE9NIEFQSS4gSXQgYWNjZXB0cyBhblxuICogb2JqZWN0IG1hcHBpbmcgb2Ygc3R5bGUgcHJvcGVydGllcyB0byB2YWx1ZXMuXG4gKlxuICogQGNvbnN0cnVjdG9yIFJlYWN0RE9NQ29tcG9uZW50XG4gKiBAZXh0ZW5kcyBSZWFjdE11bHRpQ2hpbGRcbiAqL1xuZnVuY3Rpb24gUmVhY3RET01Db21wb25lbnQodGFnKSB7XG4gIHZhbGlkYXRlRGFuZ2Vyb3VzVGFnKHRhZyk7XG4gIHRoaXMuX3RhZyA9IHRhZy50b0xvd2VyQ2FzZSgpO1xuICB0aGlzLl9yZW5kZXJlZENoaWxkcmVuID0gbnVsbDtcbiAgdGhpcy5fcHJldmlvdXNTdHlsZSA9IG51bGw7XG4gIHRoaXMuX3ByZXZpb3VzU3R5bGVDb3B5ID0gbnVsbDtcbiAgdGhpcy5fcm9vdE5vZGVJRCA9IG51bGw7XG4gIHRoaXMuX3dyYXBwZXJTdGF0ZSA9IG51bGw7XG4gIHRoaXMuX3RvcExldmVsV3JhcHBlciA9IG51bGw7XG4gIHRoaXMuX25vZGVXaXRoTGVnYWN5UHJvcGVydGllcyA9IG51bGw7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgdGhpcy5fdW5wcm9jZXNzZWRDb250ZXh0RGV2ID0gbnVsbDtcbiAgICB0aGlzLl9wcm9jZXNzZWRDb250ZXh0RGV2ID0gbnVsbDtcbiAgfVxufVxuXG5SZWFjdERPTUNvbXBvbmVudC5kaXNwbGF5TmFtZSA9ICdSZWFjdERPTUNvbXBvbmVudCc7XG5cblJlYWN0RE9NQ29tcG9uZW50Lk1peGluID0ge1xuXG4gIGNvbnN0cnVjdDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB0aGlzLl9jdXJyZW50RWxlbWVudCA9IGVsZW1lbnQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyByb290IHRhZyBtYXJrdXAgdGhlbiByZWN1cnNlcy4gVGhpcyBtZXRob2QgaGFzIHNpZGUgZWZmZWN0cyBhbmRcbiAgICogaXMgbm90IGlkZW1wb3RlbnQuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcm9vdElEIFRoZSByb290IERPTSBJRCBmb3IgdGhpcyBub2RlLlxuICAgKiBAcGFyYW0ge1JlYWN0UmVjb25jaWxlVHJhbnNhY3Rpb258UmVhY3RTZXJ2ZXJSZW5kZXJpbmdUcmFuc2FjdGlvbn0gdHJhbnNhY3Rpb25cbiAgICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHRcbiAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgY29tcHV0ZWQgbWFya3VwLlxuICAgKi9cbiAgbW91bnRDb21wb25lbnQ6IGZ1bmN0aW9uIChyb290SUQsIHRyYW5zYWN0aW9uLCBjb250ZXh0KSB7XG4gICAgdGhpcy5fcm9vdE5vZGVJRCA9IHJvb3RJRDtcblxuICAgIHZhciBwcm9wcyA9IHRoaXMuX2N1cnJlbnRFbGVtZW50LnByb3BzO1xuXG4gICAgc3dpdGNoICh0aGlzLl90YWcpIHtcbiAgICAgIGNhc2UgJ2lmcmFtZSc6XG4gICAgICBjYXNlICdpbWcnOlxuICAgICAgY2FzZSAnZm9ybSc6XG4gICAgICBjYXNlICd2aWRlbyc6XG4gICAgICBjYXNlICdhdWRpbyc6XG4gICAgICAgIHRoaXMuX3dyYXBwZXJTdGF0ZSA9IHtcbiAgICAgICAgICBsaXN0ZW5lcnM6IG51bGxcbiAgICAgICAgfTtcbiAgICAgICAgdHJhbnNhY3Rpb24uZ2V0UmVhY3RNb3VudFJlYWR5KCkuZW5xdWV1ZSh0cmFwQnViYmxlZEV2ZW50c0xvY2FsLCB0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdidXR0b24nOlxuICAgICAgICBwcm9wcyA9IFJlYWN0RE9NQnV0dG9uLmdldE5hdGl2ZVByb3BzKHRoaXMsIHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdpbnB1dCc6XG4gICAgICAgIFJlYWN0RE9NSW5wdXQubW91bnRXcmFwcGVyKHRoaXMsIHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgcHJvcHMgPSBSZWFjdERPTUlucHV0LmdldE5hdGl2ZVByb3BzKHRoaXMsIHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvcHRpb24nOlxuICAgICAgICBSZWFjdERPTU9wdGlvbi5tb3VudFdyYXBwZXIodGhpcywgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICBwcm9wcyA9IFJlYWN0RE9NT3B0aW9uLmdldE5hdGl2ZVByb3BzKHRoaXMsIHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICBSZWFjdERPTVNlbGVjdC5tb3VudFdyYXBwZXIodGhpcywgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICBwcm9wcyA9IFJlYWN0RE9NU2VsZWN0LmdldE5hdGl2ZVByb3BzKHRoaXMsIHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgY29udGV4dCA9IFJlYWN0RE9NU2VsZWN0LnByb2Nlc3NDaGlsZENvbnRleHQodGhpcywgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgICAgUmVhY3RET01UZXh0YXJlYS5tb3VudFdyYXBwZXIodGhpcywgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICBwcm9wcyA9IFJlYWN0RE9NVGV4dGFyZWEuZ2V0TmF0aXZlUHJvcHModGhpcywgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBhc3NlcnRWYWxpZFByb3BzKHRoaXMsIHByb3BzKTtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgaWYgKGNvbnRleHRbdmFsaWRhdGVET01OZXN0aW5nLmFuY2VzdG9ySW5mb0NvbnRleHRLZXldKSB7XG4gICAgICAgIHZhbGlkYXRlRE9NTmVzdGluZyh0aGlzLl90YWcsIHRoaXMsIGNvbnRleHRbdmFsaWRhdGVET01OZXN0aW5nLmFuY2VzdG9ySW5mb0NvbnRleHRLZXldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdGhpcy5fdW5wcm9jZXNzZWRDb250ZXh0RGV2ID0gY29udGV4dDtcbiAgICAgIHRoaXMuX3Byb2Nlc3NlZENvbnRleHREZXYgPSBwcm9jZXNzQ2hpbGRDb250ZXh0RGV2KGNvbnRleHQsIHRoaXMpO1xuICAgICAgY29udGV4dCA9IHRoaXMuX3Byb2Nlc3NlZENvbnRleHREZXY7XG4gICAgfVxuXG4gICAgdmFyIG1vdW50SW1hZ2U7XG4gICAgaWYgKHRyYW5zYWN0aW9uLnVzZUNyZWF0ZUVsZW1lbnQpIHtcbiAgICAgIHZhciBvd25lckRvY3VtZW50ID0gY29udGV4dFtSZWFjdE1vdW50Lm93bmVyRG9jdW1lbnRDb250ZXh0S2V5XTtcbiAgICAgIHZhciBlbCA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLl9jdXJyZW50RWxlbWVudC50eXBlKTtcbiAgICAgIERPTVByb3BlcnR5T3BlcmF0aW9ucy5zZXRBdHRyaWJ1dGVGb3JJRChlbCwgdGhpcy5fcm9vdE5vZGVJRCk7XG4gICAgICAvLyBQb3B1bGF0ZSBub2RlIGNhY2hlXG4gICAgICBSZWFjdE1vdW50LmdldElEKGVsKTtcbiAgICAgIHRoaXMuX3VwZGF0ZURPTVByb3BlcnRpZXMoe30sIHByb3BzLCB0cmFuc2FjdGlvbiwgZWwpO1xuICAgICAgdGhpcy5fY3JlYXRlSW5pdGlhbENoaWxkcmVuKHRyYW5zYWN0aW9uLCBwcm9wcywgY29udGV4dCwgZWwpO1xuICAgICAgbW91bnRJbWFnZSA9IGVsO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdGFnT3BlbiA9IHRoaXMuX2NyZWF0ZU9wZW5UYWdNYXJrdXBBbmRQdXRMaXN0ZW5lcnModHJhbnNhY3Rpb24sIHByb3BzKTtcbiAgICAgIHZhciB0YWdDb250ZW50ID0gdGhpcy5fY3JlYXRlQ29udGVudE1hcmt1cCh0cmFuc2FjdGlvbiwgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgaWYgKCF0YWdDb250ZW50ICYmIG9taXR0ZWRDbG9zZVRhZ3NbdGhpcy5fdGFnXSkge1xuICAgICAgICBtb3VudEltYWdlID0gdGFnT3BlbiArICcvPic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtb3VudEltYWdlID0gdGFnT3BlbiArICc+JyArIHRhZ0NvbnRlbnQgKyAnPC8nICsgdGhpcy5fY3VycmVudEVsZW1lbnQudHlwZSArICc+JztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRoaXMuX3RhZykge1xuICAgICAgY2FzZSAnaW5wdXQnOlxuICAgICAgICB0cmFuc2FjdGlvbi5nZXRSZWFjdE1vdW50UmVhZHkoKS5lbnF1ZXVlKG1vdW50UmVhZHlJbnB1dFdyYXBwZXIsIHRoaXMpO1xuICAgICAgLy8gZmFsbHMgdGhyb3VnaFxuICAgICAgY2FzZSAnYnV0dG9uJzpcbiAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICAgIGlmIChwcm9wcy5hdXRvRm9jdXMpIHtcbiAgICAgICAgICB0cmFuc2FjdGlvbi5nZXRSZWFjdE1vdW50UmVhZHkoKS5lbnF1ZXVlKEF1dG9Gb2N1c1V0aWxzLmZvY3VzRE9NQ29tcG9uZW50LCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gbW91bnRJbWFnZTtcbiAgfSxcblxuICAvKipcbiAgICogQ3JlYXRlcyBtYXJrdXAgZm9yIHRoZSBvcGVuIHRhZyBhbmQgYWxsIGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGhhcyBzaWRlIGVmZmVjdHMgYmVjYXVzZSBldmVudHMgZ2V0IHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEl0ZXJhdGluZyBvdmVyIG9iamVjdCBwcm9wZXJ0aWVzIGlzIGZhc3RlciB0aGFuIGl0ZXJhdGluZyBvdmVyIGFycmF5cy5cbiAgICogQHNlZSBodHRwOi8vanNwZXJmLmNvbS9vYmotdnMtYXJyLWl0ZXJhdGlvblxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1JlYWN0UmVjb25jaWxlVHJhbnNhY3Rpb258UmVhY3RTZXJ2ZXJSZW5kZXJpbmdUcmFuc2FjdGlvbn0gdHJhbnNhY3Rpb25cbiAgICogQHBhcmFtIHtvYmplY3R9IHByb3BzXG4gICAqIEByZXR1cm4ge3N0cmluZ30gTWFya3VwIG9mIG9wZW5pbmcgdGFnLlxuICAgKi9cbiAgX2NyZWF0ZU9wZW5UYWdNYXJrdXBBbmRQdXRMaXN0ZW5lcnM6IGZ1bmN0aW9uICh0cmFuc2FjdGlvbiwgcHJvcHMpIHtcbiAgICB2YXIgcmV0ID0gJzwnICsgdGhpcy5fY3VycmVudEVsZW1lbnQudHlwZTtcblxuICAgIGZvciAodmFyIHByb3BLZXkgaW4gcHJvcHMpIHtcbiAgICAgIGlmICghcHJvcHMuaGFzT3duUHJvcGVydHkocHJvcEtleSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcEtleV07XG4gICAgICBpZiAocHJvcFZhbHVlID09IG51bGwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAocmVnaXN0cmF0aW9uTmFtZU1vZHVsZXMuaGFzT3duUHJvcGVydHkocHJvcEtleSkpIHtcbiAgICAgICAgaWYgKHByb3BWYWx1ZSkge1xuICAgICAgICAgIGVucXVldWVQdXRMaXN0ZW5lcih0aGlzLl9yb290Tm9kZUlELCBwcm9wS2V5LCBwcm9wVmFsdWUsIHRyYW5zYWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHByb3BLZXkgPT09IFNUWUxFKSB7XG4gICAgICAgICAgaWYgKHByb3BWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgLy8gU2VlIGBfdXBkYXRlRE9NUHJvcGVydGllc2AuIHN0eWxlIGJsb2NrXG4gICAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzU3R5bGUgPSBwcm9wVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9wVmFsdWUgPSB0aGlzLl9wcmV2aW91c1N0eWxlQ29weSA9IGFzc2lnbih7fSwgcHJvcHMuc3R5bGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwcm9wVmFsdWUgPSBDU1NQcm9wZXJ0eU9wZXJhdGlvbnMuY3JlYXRlTWFya3VwRm9yU3R5bGVzKHByb3BWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1hcmt1cCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLl90YWcgIT0gbnVsbCAmJiBpc0N1c3RvbUNvbXBvbmVudCh0aGlzLl90YWcsIHByb3BzKSkge1xuICAgICAgICAgIGlmIChwcm9wS2V5ICE9PSBDSElMRFJFTikge1xuICAgICAgICAgICAgbWFya3VwID0gRE9NUHJvcGVydHlPcGVyYXRpb25zLmNyZWF0ZU1hcmt1cEZvckN1c3RvbUF0dHJpYnV0ZShwcm9wS2V5LCBwcm9wVmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXJrdXAgPSBET01Qcm9wZXJ0eU9wZXJhdGlvbnMuY3JlYXRlTWFya3VwRm9yUHJvcGVydHkocHJvcEtleSwgcHJvcFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWFya3VwKSB7XG4gICAgICAgICAgcmV0ICs9ICcgJyArIG1hcmt1cDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEZvciBzdGF0aWMgcGFnZXMsIG5vIG5lZWQgdG8gcHV0IFJlYWN0IElEIGFuZCBjaGVja3N1bS4gU2F2ZXMgbG90cyBvZlxuICAgIC8vIGJ5dGVzLlxuICAgIGlmICh0cmFuc2FjdGlvbi5yZW5kZXJUb1N0YXRpY01hcmt1cCkge1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICB2YXIgbWFya3VwRm9ySUQgPSBET01Qcm9wZXJ0eU9wZXJhdGlvbnMuY3JlYXRlTWFya3VwRm9ySUQodGhpcy5fcm9vdE5vZGVJRCk7XG4gICAgcmV0dXJuIHJldCArICcgJyArIG1hcmt1cEZvcklEO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIG1hcmt1cCBmb3IgdGhlIGNvbnRlbnQgYmV0d2VlbiB0aGUgdGFncy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtSZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9ufFJlYWN0U2VydmVyUmVuZGVyaW5nVHJhbnNhY3Rpb259IHRyYW5zYWN0aW9uXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wc1xuICAgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IENvbnRlbnQgbWFya3VwLlxuICAgKi9cbiAgX2NyZWF0ZUNvbnRlbnRNYXJrdXA6IGZ1bmN0aW9uICh0cmFuc2FjdGlvbiwgcHJvcHMsIGNvbnRleHQpIHtcbiAgICB2YXIgcmV0ID0gJyc7XG5cbiAgICAvLyBJbnRlbnRpb25hbCB1c2Ugb2YgIT0gdG8gYXZvaWQgY2F0Y2hpbmcgemVyby9mYWxzZS5cbiAgICB2YXIgaW5uZXJIVE1MID0gcHJvcHMuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw7XG4gICAgaWYgKGlubmVySFRNTCAhPSBudWxsKSB7XG4gICAgICBpZiAoaW5uZXJIVE1MLl9faHRtbCAhPSBudWxsKSB7XG4gICAgICAgIHJldCA9IGlubmVySFRNTC5fX2h0bWw7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBjb250ZW50VG9Vc2UgPSBDT05URU5UX1RZUEVTW3R5cGVvZiBwcm9wcy5jaGlsZHJlbl0gPyBwcm9wcy5jaGlsZHJlbiA6IG51bGw7XG4gICAgICB2YXIgY2hpbGRyZW5Ub1VzZSA9IGNvbnRlbnRUb1VzZSAhPSBudWxsID8gbnVsbCA6IHByb3BzLmNoaWxkcmVuO1xuICAgICAgaWYgKGNvbnRlbnRUb1VzZSAhPSBudWxsKSB7XG4gICAgICAgIC8vIFRPRE86IFZhbGlkYXRlIHRoYXQgdGV4dCBpcyBhbGxvd2VkIGFzIGEgY2hpbGQgb2YgdGhpcyBub2RlXG4gICAgICAgIHJldCA9IGVzY2FwZVRleHRDb250ZW50Rm9yQnJvd3Nlcihjb250ZW50VG9Vc2UpO1xuICAgICAgfSBlbHNlIGlmIChjaGlsZHJlblRvVXNlICE9IG51bGwpIHtcbiAgICAgICAgdmFyIG1vdW50SW1hZ2VzID0gdGhpcy5tb3VudENoaWxkcmVuKGNoaWxkcmVuVG9Vc2UsIHRyYW5zYWN0aW9uLCBjb250ZXh0KTtcbiAgICAgICAgcmV0ID0gbW91bnRJbWFnZXMuam9pbignJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuZXdsaW5lRWF0aW5nVGFnc1t0aGlzLl90YWddICYmIHJldC5jaGFyQXQoMCkgPT09ICdcXG4nKSB7XG4gICAgICAvLyB0ZXh0L2h0bWwgaWdub3JlcyB0aGUgZmlyc3QgY2hhcmFjdGVyIGluIHRoZXNlIHRhZ3MgaWYgaXQncyBhIG5ld2xpbmVcbiAgICAgIC8vIFByZWZlciB0byBicmVhayBhcHBsaWNhdGlvbi94bWwgb3ZlciB0ZXh0L2h0bWwgKGZvciBub3cpIGJ5IGFkZGluZ1xuICAgICAgLy8gYSBuZXdsaW5lIHNwZWNpZmljYWxseSB0byBnZXQgZWF0ZW4gYnkgdGhlIHBhcnNlci4gKEFsdGVybmF0ZWx5IGZvclxuICAgICAgLy8gdGV4dGFyZWFzLCByZXBsYWNpbmcgXCJeXFxuXCIgd2l0aCBcIlxcclxcblwiIGRvZXNuJ3QgZ2V0IGVhdGVuLCBhbmQgdGhlIGZpcnN0XG4gICAgICAvLyBcXHIgaXMgbm9ybWFsaXplZCBvdXQgYnkgSFRNTFRleHRBcmVhRWxlbWVudCN2YWx1ZS4pXG4gICAgICAvLyBTZWU6IDxodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sLXBvbHlnbG90LyNuZXdsaW5lcy1pbi10ZXh0YXJlYS1hbmQtcHJlPlxuICAgICAgLy8gU2VlOiA8aHR0cDovL3d3dy53My5vcmcvVFIvaHRtbDUvc3ludGF4Lmh0bWwjZWxlbWVudC1yZXN0cmljdGlvbnM+XG4gICAgICAvLyBTZWU6IDxodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9zeW50YXguaHRtbCNuZXdsaW5lcz5cbiAgICAgIC8vIFNlZTogUGFyc2luZyBvZiBcInRleHRhcmVhXCIgXCJsaXN0aW5nXCIgYW5kIFwicHJlXCIgZWxlbWVudHNcbiAgICAgIC8vICBmcm9tIDxodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9zeW50YXguaHRtbCNwYXJzaW5nLW1haW4taW5ib2R5PlxuICAgICAgcmV0dXJuICdcXG4nICsgcmV0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgfSxcblxuICBfY3JlYXRlSW5pdGlhbENoaWxkcmVuOiBmdW5jdGlvbiAodHJhbnNhY3Rpb24sIHByb3BzLCBjb250ZXh0LCBlbCkge1xuICAgIC8vIEludGVudGlvbmFsIHVzZSBvZiAhPSB0byBhdm9pZCBjYXRjaGluZyB6ZXJvL2ZhbHNlLlxuICAgIHZhciBpbm5lckhUTUwgPSBwcm9wcy5kYW5nZXJvdXNseVNldElubmVySFRNTDtcbiAgICBpZiAoaW5uZXJIVE1MICE9IG51bGwpIHtcbiAgICAgIGlmIChpbm5lckhUTUwuX19odG1sICE9IG51bGwpIHtcbiAgICAgICAgc2V0SW5uZXJIVE1MKGVsLCBpbm5lckhUTUwuX19odG1sKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNvbnRlbnRUb1VzZSA9IENPTlRFTlRfVFlQRVNbdHlwZW9mIHByb3BzLmNoaWxkcmVuXSA/IHByb3BzLmNoaWxkcmVuIDogbnVsbDtcbiAgICAgIHZhciBjaGlsZHJlblRvVXNlID0gY29udGVudFRvVXNlICE9IG51bGwgPyBudWxsIDogcHJvcHMuY2hpbGRyZW47XG4gICAgICBpZiAoY29udGVudFRvVXNlICE9IG51bGwpIHtcbiAgICAgICAgLy8gVE9ETzogVmFsaWRhdGUgdGhhdCB0ZXh0IGlzIGFsbG93ZWQgYXMgYSBjaGlsZCBvZiB0aGlzIG5vZGVcbiAgICAgICAgc2V0VGV4dENvbnRlbnQoZWwsIGNvbnRlbnRUb1VzZSk7XG4gICAgICB9IGVsc2UgaWYgKGNoaWxkcmVuVG9Vc2UgIT0gbnVsbCkge1xuICAgICAgICB2YXIgbW91bnRJbWFnZXMgPSB0aGlzLm1vdW50Q2hpbGRyZW4oY2hpbGRyZW5Ub1VzZSwgdHJhbnNhY3Rpb24sIGNvbnRleHQpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vdW50SW1hZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZWwuYXBwZW5kQ2hpbGQobW91bnRJbWFnZXNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZWNlaXZlcyBhIG5leHQgZWxlbWVudCBhbmQgdXBkYXRlcyB0aGUgY29tcG9uZW50LlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IG5leHRFbGVtZW50XG4gICAqIEBwYXJhbSB7UmVhY3RSZWNvbmNpbGVUcmFuc2FjdGlvbnxSZWFjdFNlcnZlclJlbmRlcmluZ1RyYW5zYWN0aW9ufSB0cmFuc2FjdGlvblxuICAgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dFxuICAgKi9cbiAgcmVjZWl2ZUNvbXBvbmVudDogZnVuY3Rpb24gKG5leHRFbGVtZW50LCB0cmFuc2FjdGlvbiwgY29udGV4dCkge1xuICAgIHZhciBwcmV2RWxlbWVudCA9IHRoaXMuX2N1cnJlbnRFbGVtZW50O1xuICAgIHRoaXMuX2N1cnJlbnRFbGVtZW50ID0gbmV4dEVsZW1lbnQ7XG4gICAgdGhpcy51cGRhdGVDb21wb25lbnQodHJhbnNhY3Rpb24sIHByZXZFbGVtZW50LCBuZXh0RWxlbWVudCwgY29udGV4dCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYSBuYXRpdmUgRE9NIGNvbXBvbmVudCBhZnRlciBpdCBoYXMgYWxyZWFkeSBiZWVuIGFsbG9jYXRlZCBhbmRcbiAgICogYXR0YWNoZWQgdG8gdGhlIERPTS4gUmVjb25jaWxlcyB0aGUgcm9vdCBET00gbm9kZSwgdGhlbiByZWN1cnNlcy5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9ufSB0cmFuc2FjdGlvblxuICAgKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gcHJldkVsZW1lbnRcbiAgICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IG5leHRFbGVtZW50XG4gICAqIEBpbnRlcm5hbFxuICAgKiBAb3ZlcnJpZGFibGVcbiAgICovXG4gIHVwZGF0ZUNvbXBvbmVudDogZnVuY3Rpb24gKHRyYW5zYWN0aW9uLCBwcmV2RWxlbWVudCwgbmV4dEVsZW1lbnQsIGNvbnRleHQpIHtcbiAgICB2YXIgbGFzdFByb3BzID0gcHJldkVsZW1lbnQucHJvcHM7XG4gICAgdmFyIG5leHRQcm9wcyA9IHRoaXMuX2N1cnJlbnRFbGVtZW50LnByb3BzO1xuXG4gICAgc3dpdGNoICh0aGlzLl90YWcpIHtcbiAgICAgIGNhc2UgJ2J1dHRvbic6XG4gICAgICAgIGxhc3RQcm9wcyA9IFJlYWN0RE9NQnV0dG9uLmdldE5hdGl2ZVByb3BzKHRoaXMsIGxhc3RQcm9wcyk7XG4gICAgICAgIG5leHRQcm9wcyA9IFJlYWN0RE9NQnV0dG9uLmdldE5hdGl2ZVByb3BzKHRoaXMsIG5leHRQcm9wcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaW5wdXQnOlxuICAgICAgICBSZWFjdERPTUlucHV0LnVwZGF0ZVdyYXBwZXIodGhpcyk7XG4gICAgICAgIGxhc3RQcm9wcyA9IFJlYWN0RE9NSW5wdXQuZ2V0TmF0aXZlUHJvcHModGhpcywgbGFzdFByb3BzKTtcbiAgICAgICAgbmV4dFByb3BzID0gUmVhY3RET01JbnB1dC5nZXROYXRpdmVQcm9wcyh0aGlzLCBuZXh0UHJvcHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29wdGlvbic6XG4gICAgICAgIGxhc3RQcm9wcyA9IFJlYWN0RE9NT3B0aW9uLmdldE5hdGl2ZVByb3BzKHRoaXMsIGxhc3RQcm9wcyk7XG4gICAgICAgIG5leHRQcm9wcyA9IFJlYWN0RE9NT3B0aW9uLmdldE5hdGl2ZVByb3BzKHRoaXMsIG5leHRQcm9wcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgbGFzdFByb3BzID0gUmVhY3RET01TZWxlY3QuZ2V0TmF0aXZlUHJvcHModGhpcywgbGFzdFByb3BzKTtcbiAgICAgICAgbmV4dFByb3BzID0gUmVhY3RET01TZWxlY3QuZ2V0TmF0aXZlUHJvcHModGhpcywgbmV4dFByb3BzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICAgIFJlYWN0RE9NVGV4dGFyZWEudXBkYXRlV3JhcHBlcih0aGlzKTtcbiAgICAgICAgbGFzdFByb3BzID0gUmVhY3RET01UZXh0YXJlYS5nZXROYXRpdmVQcm9wcyh0aGlzLCBsYXN0UHJvcHMpO1xuICAgICAgICBuZXh0UHJvcHMgPSBSZWFjdERPTVRleHRhcmVhLmdldE5hdGl2ZVByb3BzKHRoaXMsIG5leHRQcm9wcyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAvLyBJZiB0aGUgY29udGV4dCBpcyByZWZlcmVuY2UtZXF1YWwgdG8gdGhlIG9sZCBvbmUsIHBhc3MgZG93biB0aGUgc2FtZVxuICAgICAgLy8gcHJvY2Vzc2VkIG9iamVjdCBzbyB0aGUgdXBkYXRlIGJhaWxvdXQgaW4gUmVhY3RSZWNvbmNpbGVyIGJlaGF2ZXNcbiAgICAgIC8vIGNvcnJlY3RseSAoYW5kIGlkZW50aWNhbGx5IGluIGRldiBhbmQgcHJvZCkuIFNlZSAjNTAwNS5cbiAgICAgIGlmICh0aGlzLl91bnByb2Nlc3NlZENvbnRleHREZXYgIT09IGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5fdW5wcm9jZXNzZWRDb250ZXh0RGV2ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5fcHJvY2Vzc2VkQ29udGV4dERldiA9IHByb2Nlc3NDaGlsZENvbnRleHREZXYoY29udGV4dCwgdGhpcyk7XG4gICAgICB9XG4gICAgICBjb250ZXh0ID0gdGhpcy5fcHJvY2Vzc2VkQ29udGV4dERldjtcbiAgICB9XG5cbiAgICBhc3NlcnRWYWxpZFByb3BzKHRoaXMsIG5leHRQcm9wcyk7XG4gICAgdGhpcy5fdXBkYXRlRE9NUHJvcGVydGllcyhsYXN0UHJvcHMsIG5leHRQcm9wcywgdHJhbnNhY3Rpb24sIG51bGwpO1xuICAgIHRoaXMuX3VwZGF0ZURPTUNoaWxkcmVuKGxhc3RQcm9wcywgbmV4dFByb3BzLCB0cmFuc2FjdGlvbiwgY29udGV4dCk7XG5cbiAgICBpZiAoIWNhbkRlZmluZVByb3BlcnR5ICYmIHRoaXMuX25vZGVXaXRoTGVnYWN5UHJvcGVydGllcykge1xuICAgICAgdGhpcy5fbm9kZVdpdGhMZWdhY3lQcm9wZXJ0aWVzLnByb3BzID0gbmV4dFByb3BzO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl90YWcgPT09ICdzZWxlY3QnKSB7XG4gICAgICAvLyA8c2VsZWN0PiB2YWx1ZSB1cGRhdGUgbmVlZHMgdG8gb2NjdXIgYWZ0ZXIgPG9wdGlvbj4gY2hpbGRyZW5cbiAgICAgIC8vIHJlY29uY2lsaWF0aW9uXG4gICAgICB0cmFuc2FjdGlvbi5nZXRSZWFjdE1vdW50UmVhZHkoKS5lbnF1ZXVlKHBvc3RVcGRhdGVTZWxlY3RXcmFwcGVyLCB0aGlzKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlY29uY2lsZXMgdGhlIHByb3BlcnRpZXMgYnkgZGV0ZWN0aW5nIGRpZmZlcmVuY2VzIGluIHByb3BlcnR5IHZhbHVlcyBhbmRcbiAgICogdXBkYXRpbmcgdGhlIERPTSBhcyBuZWNlc3NhcnkuIFRoaXMgZnVuY3Rpb24gaXMgcHJvYmFibHkgdGhlIHNpbmdsZSBtb3N0XG4gICAqIGNyaXRpY2FsIHBhdGggZm9yIHBlcmZvcm1hbmNlIG9wdGltaXphdGlvbi5cbiAgICpcbiAgICogVE9ETzogQmVuY2htYXJrIHdoZXRoZXIgY2hlY2tpbmcgZm9yIGNoYW5nZWQgdmFsdWVzIGluIG1lbW9yeSBhY3R1YWxseVxuICAgKiAgICAgICBpbXByb3ZlcyBwZXJmb3JtYW5jZSAoZXNwZWNpYWxseSBzdGF0aWNhbGx5IHBvc2l0aW9uZWQgZWxlbWVudHMpLlxuICAgKiBUT0RPOiBCZW5jaG1hcmsgdGhlIGVmZmVjdHMgb2YgcHV0dGluZyB0aGlzIGF0IHRoZSB0b3Agc2luY2UgOTklIG9mIHByb3BzXG4gICAqICAgICAgIGRvIG5vdCBjaGFuZ2UgZm9yIGEgZ2l2ZW4gcmVjb25jaWxpYXRpb24uXG4gICAqIFRPRE86IEJlbmNobWFyayBhcmVhcyB0aGF0IGNhbiBiZSBpbXByb3ZlZCB3aXRoIGNhY2hpbmcuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBsYXN0UHJvcHNcbiAgICogQHBhcmFtIHtvYmplY3R9IG5leHRQcm9wc1xuICAgKiBAcGFyYW0ge1JlYWN0UmVjb25jaWxlVHJhbnNhY3Rpb259IHRyYW5zYWN0aW9uXG4gICAqIEBwYXJhbSB7P0RPTUVsZW1lbnR9IG5vZGVcbiAgICovXG4gIF91cGRhdGVET01Qcm9wZXJ0aWVzOiBmdW5jdGlvbiAobGFzdFByb3BzLCBuZXh0UHJvcHMsIHRyYW5zYWN0aW9uLCBub2RlKSB7XG4gICAgdmFyIHByb3BLZXk7XG4gICAgdmFyIHN0eWxlTmFtZTtcbiAgICB2YXIgc3R5bGVVcGRhdGVzO1xuICAgIGZvciAocHJvcEtleSBpbiBsYXN0UHJvcHMpIHtcbiAgICAgIGlmIChuZXh0UHJvcHMuaGFzT3duUHJvcGVydHkocHJvcEtleSkgfHwgIWxhc3RQcm9wcy5oYXNPd25Qcm9wZXJ0eShwcm9wS2V5KSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9wS2V5ID09PSBTVFlMRSkge1xuICAgICAgICB2YXIgbGFzdFN0eWxlID0gdGhpcy5fcHJldmlvdXNTdHlsZUNvcHk7XG4gICAgICAgIGZvciAoc3R5bGVOYW1lIGluIGxhc3RTdHlsZSkge1xuICAgICAgICAgIGlmIChsYXN0U3R5bGUuaGFzT3duUHJvcGVydHkoc3R5bGVOYW1lKSkge1xuICAgICAgICAgICAgc3R5bGVVcGRhdGVzID0gc3R5bGVVcGRhdGVzIHx8IHt9O1xuICAgICAgICAgICAgc3R5bGVVcGRhdGVzW3N0eWxlTmFtZV0gPSAnJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcHJldmlvdXNTdHlsZUNvcHkgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmIChyZWdpc3RyYXRpb25OYW1lTW9kdWxlcy5oYXNPd25Qcm9wZXJ0eShwcm9wS2V5KSkge1xuICAgICAgICBpZiAobGFzdFByb3BzW3Byb3BLZXldKSB7XG4gICAgICAgICAgLy8gT25seSBjYWxsIGRlbGV0ZUxpc3RlbmVyIGlmIHRoZXJlIHdhcyBhIGxpc3RlbmVyIHByZXZpb3VzbHkgb3JcbiAgICAgICAgICAvLyBlbHNlIHdpbGxEZWxldGVMaXN0ZW5lciBnZXRzIGNhbGxlZCB3aGVuIHRoZXJlIHdhc24ndCBhY3R1YWxseSBhXG4gICAgICAgICAgLy8gbGlzdGVuZXIgKGUuZy4sIG9uQ2xpY2s9e251bGx9KVxuICAgICAgICAgIGRlbGV0ZUxpc3RlbmVyKHRoaXMuX3Jvb3ROb2RlSUQsIHByb3BLZXkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKERPTVByb3BlcnR5LnByb3BlcnRpZXNbcHJvcEtleV0gfHwgRE9NUHJvcGVydHkuaXNDdXN0b21BdHRyaWJ1dGUocHJvcEtleSkpIHtcbiAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgbm9kZSA9IFJlYWN0TW91bnQuZ2V0Tm9kZSh0aGlzLl9yb290Tm9kZUlEKTtcbiAgICAgICAgfVxuICAgICAgICBET01Qcm9wZXJ0eU9wZXJhdGlvbnMuZGVsZXRlVmFsdWVGb3JQcm9wZXJ0eShub2RlLCBwcm9wS2V5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChwcm9wS2V5IGluIG5leHRQcm9wcykge1xuICAgICAgdmFyIG5leHRQcm9wID0gbmV4dFByb3BzW3Byb3BLZXldO1xuICAgICAgdmFyIGxhc3RQcm9wID0gcHJvcEtleSA9PT0gU1RZTEUgPyB0aGlzLl9wcmV2aW91c1N0eWxlQ29weSA6IGxhc3RQcm9wc1twcm9wS2V5XTtcbiAgICAgIGlmICghbmV4dFByb3BzLmhhc093blByb3BlcnR5KHByb3BLZXkpIHx8IG5leHRQcm9wID09PSBsYXN0UHJvcCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9wS2V5ID09PSBTVFlMRSkge1xuICAgICAgICBpZiAobmV4dFByb3ApIHtcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgY2hlY2tBbmRXYXJuRm9yTXV0YXRlZFN0eWxlKHRoaXMuX3ByZXZpb3VzU3R5bGVDb3B5LCB0aGlzLl9wcmV2aW91c1N0eWxlLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzU3R5bGUgPSBuZXh0UHJvcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV4dFByb3AgPSB0aGlzLl9wcmV2aW91c1N0eWxlQ29weSA9IGFzc2lnbih7fSwgbmV4dFByb3ApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ByZXZpb3VzU3R5bGVDb3B5ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGFzdFByb3ApIHtcbiAgICAgICAgICAvLyBVbnNldCBzdHlsZXMgb24gYGxhc3RQcm9wYCBidXQgbm90IG9uIGBuZXh0UHJvcGAuXG4gICAgICAgICAgZm9yIChzdHlsZU5hbWUgaW4gbGFzdFByb3ApIHtcbiAgICAgICAgICAgIGlmIChsYXN0UHJvcC5oYXNPd25Qcm9wZXJ0eShzdHlsZU5hbWUpICYmICghbmV4dFByb3AgfHwgIW5leHRQcm9wLmhhc093blByb3BlcnR5KHN0eWxlTmFtZSkpKSB7XG4gICAgICAgICAgICAgIHN0eWxlVXBkYXRlcyA9IHN0eWxlVXBkYXRlcyB8fCB7fTtcbiAgICAgICAgICAgICAgc3R5bGVVcGRhdGVzW3N0eWxlTmFtZV0gPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gVXBkYXRlIHN0eWxlcyB0aGF0IGNoYW5nZWQgc2luY2UgYGxhc3RQcm9wYC5cbiAgICAgICAgICBmb3IgKHN0eWxlTmFtZSBpbiBuZXh0UHJvcCkge1xuICAgICAgICAgICAgaWYgKG5leHRQcm9wLmhhc093blByb3BlcnR5KHN0eWxlTmFtZSkgJiYgbGFzdFByb3Bbc3R5bGVOYW1lXSAhPT0gbmV4dFByb3Bbc3R5bGVOYW1lXSkge1xuICAgICAgICAgICAgICBzdHlsZVVwZGF0ZXMgPSBzdHlsZVVwZGF0ZXMgfHwge307XG4gICAgICAgICAgICAgIHN0eWxlVXBkYXRlc1tzdHlsZU5hbWVdID0gbmV4dFByb3Bbc3R5bGVOYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gUmVsaWVzIG9uIGB1cGRhdGVTdHlsZXNCeUlEYCBub3QgbXV0YXRpbmcgYHN0eWxlVXBkYXRlc2AuXG4gICAgICAgICAgc3R5bGVVcGRhdGVzID0gbmV4dFByb3A7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocmVnaXN0cmF0aW9uTmFtZU1vZHVsZXMuaGFzT3duUHJvcGVydHkocHJvcEtleSkpIHtcbiAgICAgICAgaWYgKG5leHRQcm9wKSB7XG4gICAgICAgICAgZW5xdWV1ZVB1dExpc3RlbmVyKHRoaXMuX3Jvb3ROb2RlSUQsIHByb3BLZXksIG5leHRQcm9wLCB0cmFuc2FjdGlvbik7XG4gICAgICAgIH0gZWxzZSBpZiAobGFzdFByb3ApIHtcbiAgICAgICAgICBkZWxldGVMaXN0ZW5lcih0aGlzLl9yb290Tm9kZUlELCBwcm9wS2V5KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpc0N1c3RvbUNvbXBvbmVudCh0aGlzLl90YWcsIG5leHRQcm9wcykpIHtcbiAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgbm9kZSA9IFJlYWN0TW91bnQuZ2V0Tm9kZSh0aGlzLl9yb290Tm9kZUlEKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcEtleSA9PT0gQ0hJTERSRU4pIHtcbiAgICAgICAgICBuZXh0UHJvcCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgRE9NUHJvcGVydHlPcGVyYXRpb25zLnNldFZhbHVlRm9yQXR0cmlidXRlKG5vZGUsIHByb3BLZXksIG5leHRQcm9wKTtcbiAgICAgIH0gZWxzZSBpZiAoRE9NUHJvcGVydHkucHJvcGVydGllc1twcm9wS2V5XSB8fCBET01Qcm9wZXJ0eS5pc0N1c3RvbUF0dHJpYnV0ZShwcm9wS2V5KSkge1xuICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICBub2RlID0gUmVhY3RNb3VudC5nZXROb2RlKHRoaXMuX3Jvb3ROb2RlSUQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHdlJ3JlIHVwZGF0aW5nIHRvIG51bGwgb3IgdW5kZWZpbmVkLCB3ZSBzaG91bGQgcmVtb3ZlIHRoZSBwcm9wZXJ0eVxuICAgICAgICAvLyBmcm9tIHRoZSBET00gbm9kZSBpbnN0ZWFkIG9mIGluYWR2ZXJ0YW50bHkgc2V0dGluZyB0byBhIHN0cmluZy4gVGhpc1xuICAgICAgICAvLyBicmluZ3MgdXMgaW4gbGluZSB3aXRoIHRoZSBzYW1lIGJlaGF2aW9yIHdlIGhhdmUgb24gaW5pdGlhbCByZW5kZXIuXG4gICAgICAgIGlmIChuZXh0UHJvcCAhPSBudWxsKSB7XG4gICAgICAgICAgRE9NUHJvcGVydHlPcGVyYXRpb25zLnNldFZhbHVlRm9yUHJvcGVydHkobm9kZSwgcHJvcEtleSwgbmV4dFByb3ApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERPTVByb3BlcnR5T3BlcmF0aW9ucy5kZWxldGVWYWx1ZUZvclByb3BlcnR5KG5vZGUsIHByb3BLZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzdHlsZVVwZGF0ZXMpIHtcbiAgICAgIGlmICghbm9kZSkge1xuICAgICAgICBub2RlID0gUmVhY3RNb3VudC5nZXROb2RlKHRoaXMuX3Jvb3ROb2RlSUQpO1xuICAgICAgfVxuICAgICAgQ1NTUHJvcGVydHlPcGVyYXRpb25zLnNldFZhbHVlRm9yU3R5bGVzKG5vZGUsIHN0eWxlVXBkYXRlcyk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZWNvbmNpbGVzIHRoZSBjaGlsZHJlbiB3aXRoIHRoZSB2YXJpb3VzIHByb3BlcnRpZXMgdGhhdCBhZmZlY3QgdGhlXG4gICAqIGNoaWxkcmVuIGNvbnRlbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBsYXN0UHJvcHNcbiAgICogQHBhcmFtIHtvYmplY3R9IG5leHRQcm9wc1xuICAgKiBAcGFyYW0ge1JlYWN0UmVjb25jaWxlVHJhbnNhY3Rpb259IHRyYW5zYWN0aW9uXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjb250ZXh0XG4gICAqL1xuICBfdXBkYXRlRE9NQ2hpbGRyZW46IGZ1bmN0aW9uIChsYXN0UHJvcHMsIG5leHRQcm9wcywgdHJhbnNhY3Rpb24sIGNvbnRleHQpIHtcbiAgICB2YXIgbGFzdENvbnRlbnQgPSBDT05URU5UX1RZUEVTW3R5cGVvZiBsYXN0UHJvcHMuY2hpbGRyZW5dID8gbGFzdFByb3BzLmNoaWxkcmVuIDogbnVsbDtcbiAgICB2YXIgbmV4dENvbnRlbnQgPSBDT05URU5UX1RZUEVTW3R5cGVvZiBuZXh0UHJvcHMuY2hpbGRyZW5dID8gbmV4dFByb3BzLmNoaWxkcmVuIDogbnVsbDtcblxuICAgIHZhciBsYXN0SHRtbCA9IGxhc3RQcm9wcy5kYW5nZXJvdXNseVNldElubmVySFRNTCAmJiBsYXN0UHJvcHMuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwuX19odG1sO1xuICAgIHZhciBuZXh0SHRtbCA9IG5leHRQcm9wcy5kYW5nZXJvdXNseVNldElubmVySFRNTCAmJiBuZXh0UHJvcHMuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwuX19odG1sO1xuXG4gICAgLy8gTm90ZSB0aGUgdXNlIG9mIGAhPWAgd2hpY2ggY2hlY2tzIGZvciBudWxsIG9yIHVuZGVmaW5lZC5cbiAgICB2YXIgbGFzdENoaWxkcmVuID0gbGFzdENvbnRlbnQgIT0gbnVsbCA/IG51bGwgOiBsYXN0UHJvcHMuY2hpbGRyZW47XG4gICAgdmFyIG5leHRDaGlsZHJlbiA9IG5leHRDb250ZW50ICE9IG51bGwgPyBudWxsIDogbmV4dFByb3BzLmNoaWxkcmVuO1xuXG4gICAgLy8gSWYgd2UncmUgc3dpdGNoaW5nIGZyb20gY2hpbGRyZW4gdG8gY29udGVudC9odG1sIG9yIHZpY2UgdmVyc2EsIHJlbW92ZVxuICAgIC8vIHRoZSBvbGQgY29udGVudFxuICAgIHZhciBsYXN0SGFzQ29udGVudE9ySHRtbCA9IGxhc3RDb250ZW50ICE9IG51bGwgfHwgbGFzdEh0bWwgIT0gbnVsbDtcbiAgICB2YXIgbmV4dEhhc0NvbnRlbnRPckh0bWwgPSBuZXh0Q29udGVudCAhPSBudWxsIHx8IG5leHRIdG1sICE9IG51bGw7XG4gICAgaWYgKGxhc3RDaGlsZHJlbiAhPSBudWxsICYmIG5leHRDaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoaWxkcmVuKG51bGwsIHRyYW5zYWN0aW9uLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKGxhc3RIYXNDb250ZW50T3JIdG1sICYmICFuZXh0SGFzQ29udGVudE9ySHRtbCkge1xuICAgICAgdGhpcy51cGRhdGVUZXh0Q29udGVudCgnJyk7XG4gICAgfVxuXG4gICAgaWYgKG5leHRDb250ZW50ICE9IG51bGwpIHtcbiAgICAgIGlmIChsYXN0Q29udGVudCAhPT0gbmV4dENvbnRlbnQpIHtcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0Q29udGVudCgnJyArIG5leHRDb250ZW50KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5leHRIdG1sICE9IG51bGwpIHtcbiAgICAgIGlmIChsYXN0SHRtbCAhPT0gbmV4dEh0bWwpIHtcbiAgICAgICAgdGhpcy51cGRhdGVNYXJrdXAoJycgKyBuZXh0SHRtbCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChuZXh0Q2hpbGRyZW4gIT0gbnVsbCkge1xuICAgICAgdGhpcy51cGRhdGVDaGlsZHJlbihuZXh0Q2hpbGRyZW4sIHRyYW5zYWN0aW9uLCBjb250ZXh0KTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIGFsbCBldmVudCByZWdpc3RyYXRpb25zIGZvciB0aGlzIGluc3RhbmNlLiBEb2VzIG5vdCByZW1vdmUgZnJvbVxuICAgKiB0aGUgRE9NLiBUaGF0IG11c3QgYmUgZG9uZSBieSB0aGUgcGFyZW50LlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHVubW91bnRDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzd2l0Y2ggKHRoaXMuX3RhZykge1xuICAgICAgY2FzZSAnaWZyYW1lJzpcbiAgICAgIGNhc2UgJ2ltZyc6XG4gICAgICBjYXNlICdmb3JtJzpcbiAgICAgIGNhc2UgJ3ZpZGVvJzpcbiAgICAgIGNhc2UgJ2F1ZGlvJzpcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX3dyYXBwZXJTdGF0ZS5saXN0ZW5lcnM7XG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGlzdGVuZXJzW2ldLnJlbW92ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2lucHV0JzpcbiAgICAgICAgUmVhY3RET01JbnB1dC51bm1vdW50V3JhcHBlcih0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdodG1sJzpcbiAgICAgIGNhc2UgJ2hlYWQnOlxuICAgICAgY2FzZSAnYm9keSc6XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb21wb25lbnRzIGxpa2UgPGh0bWw+IDxoZWFkPiBhbmQgPGJvZHk+IGNhbid0IGJlIHJlbW92ZWQgb3IgYWRkZWRcbiAgICAgICAgICogZWFzaWx5IGluIGEgY3Jvc3MtYnJvd3NlciB3YXksIGhvd2V2ZXIgaXQncyB2YWx1YWJsZSB0byBiZSBhYmxlIHRvXG4gICAgICAgICAqIHRha2UgYWR2YW50YWdlIG9mIFJlYWN0J3MgcmVjb25jaWxpYXRpb24gZm9yIHN0eWxpbmcgYW5kIDx0aXRsZT5cbiAgICAgICAgICogbWFuYWdlbWVudC4gU28gd2UganVzdCBkb2N1bWVudCBpdCBhbmQgdGhyb3cgaW4gZGFuZ2Vyb3VzIGNhc2VzLlxuICAgICAgICAgKi9cbiAgICAgICAgIWZhbHNlID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJzwlcz4gdHJpZWQgdG8gdW5tb3VudC4gQmVjYXVzZSBvZiBjcm9zcy1icm93c2VyIHF1aXJrcyBpdCBpcyAnICsgJ2ltcG9zc2libGUgdG8gdW5tb3VudCBzb21lIHRvcC1sZXZlbCBjb21wb25lbnRzIChlZyA8aHRtbD4sICcgKyAnPGhlYWQ+LCBhbmQgPGJvZHk+KSByZWxpYWJseSBhbmQgZWZmaWNpZW50bHkuIFRvIGZpeCB0aGlzLCBoYXZlIGEgJyArICdzaW5nbGUgdG9wLWxldmVsIGNvbXBvbmVudCB0aGF0IG5ldmVyIHVubW91bnRzIHJlbmRlciB0aGVzZSAnICsgJ2VsZW1lbnRzLicsIHRoaXMuX3RhZykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLnVubW91bnRDaGlsZHJlbigpO1xuICAgIFJlYWN0QnJvd3NlckV2ZW50RW1pdHRlci5kZWxldGVBbGxMaXN0ZW5lcnModGhpcy5fcm9vdE5vZGVJRCk7XG4gICAgUmVhY3RDb21wb25lbnRCcm93c2VyRW52aXJvbm1lbnQudW5tb3VudElERnJvbUVudmlyb25tZW50KHRoaXMuX3Jvb3ROb2RlSUQpO1xuICAgIHRoaXMuX3Jvb3ROb2RlSUQgPSBudWxsO1xuICAgIHRoaXMuX3dyYXBwZXJTdGF0ZSA9IG51bGw7XG4gICAgaWYgKHRoaXMuX25vZGVXaXRoTGVnYWN5UHJvcGVydGllcykge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLl9ub2RlV2l0aExlZ2FjeVByb3BlcnRpZXM7XG4gICAgICBub2RlLl9yZWFjdEludGVybmFsQ29tcG9uZW50ID0gbnVsbDtcbiAgICAgIHRoaXMuX25vZGVXaXRoTGVnYWN5UHJvcGVydGllcyA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIGdldFB1YmxpY0luc3RhbmNlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9ub2RlV2l0aExlZ2FjeVByb3BlcnRpZXMpIHtcbiAgICAgIHZhciBub2RlID0gUmVhY3RNb3VudC5nZXROb2RlKHRoaXMuX3Jvb3ROb2RlSUQpO1xuXG4gICAgICBub2RlLl9yZWFjdEludGVybmFsQ29tcG9uZW50ID0gdGhpcztcbiAgICAgIG5vZGUuZ2V0RE9NTm9kZSA9IGxlZ2FjeUdldERPTU5vZGU7XG4gICAgICBub2RlLmlzTW91bnRlZCA9IGxlZ2FjeUlzTW91bnRlZDtcbiAgICAgIG5vZGUuc2V0U3RhdGUgPSBsZWdhY3lTZXRTdGF0ZUV0YztcbiAgICAgIG5vZGUucmVwbGFjZVN0YXRlID0gbGVnYWN5U2V0U3RhdGVFdGM7XG4gICAgICBub2RlLmZvcmNlVXBkYXRlID0gbGVnYWN5U2V0U3RhdGVFdGM7XG4gICAgICBub2RlLnNldFByb3BzID0gbGVnYWN5U2V0UHJvcHM7XG4gICAgICBub2RlLnJlcGxhY2VQcm9wcyA9IGxlZ2FjeVJlcGxhY2VQcm9wcztcblxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgaWYgKGNhbkRlZmluZVByb3BlcnR5KSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobm9kZSwgbGVnYWN5UHJvcHNEZXNjcmlwdG9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyB1cGRhdGVDb21wb25lbnQgd2lsbCB1cGRhdGUgdGhpcyBwcm9wZXJ0eSBvbiBzdWJzZXF1ZW50IHJlbmRlcnNcbiAgICAgICAgICBub2RlLnByb3BzID0gdGhpcy5fY3VycmVudEVsZW1lbnQucHJvcHM7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHVwZGF0ZUNvbXBvbmVudCB3aWxsIHVwZGF0ZSB0aGlzIHByb3BlcnR5IG9uIHN1YnNlcXVlbnQgcmVuZGVyc1xuICAgICAgICBub2RlLnByb3BzID0gdGhpcy5fY3VycmVudEVsZW1lbnQucHJvcHM7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX25vZGVXaXRoTGVnYWN5UHJvcGVydGllcyA9IG5vZGU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9ub2RlV2l0aExlZ2FjeVByb3BlcnRpZXM7XG4gIH1cblxufTtcblxuUmVhY3RQZXJmLm1lYXN1cmVNZXRob2RzKFJlYWN0RE9NQ29tcG9uZW50LCAnUmVhY3RET01Db21wb25lbnQnLCB7XG4gIG1vdW50Q29tcG9uZW50OiAnbW91bnRDb21wb25lbnQnLFxuICB1cGRhdGVDb21wb25lbnQ6ICd1cGRhdGVDb21wb25lbnQnXG59KTtcblxuYXNzaWduKFJlYWN0RE9NQ29tcG9uZW50LnByb3RvdHlwZSwgUmVhY3RET01Db21wb25lbnQuTWl4aW4sIFJlYWN0TXVsdGlDaGlsZC5NaXhpbik7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RET01Db21wb25lbnQ7Il19