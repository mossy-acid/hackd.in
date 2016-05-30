/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactElement
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var ReactCurrentOwner = require('./ReactCurrentOwner');

var assign = require('./Object.assign');
var canDefineProperty = require('./canDefineProperty');

// The Symbol used to tag the ReactElement type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

/**
 * Base constructor for all React elements. This is only used to make this
 * work with a dynamic instanceof check. Nothing should live on this prototype.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @param {*} owner
 * @param {*} props
 * @internal
 */
var ReactElement = function ReactElement(type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  if (process.env.NODE_ENV !== 'production') {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    if (canDefineProperty) {
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      // self and source are DEV only properties.
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
    } else {
      element._store.validated = false;
      element._self = self;
      element._source = source;
    }
    Object.freeze(element.props);
    Object.freeze(element);
  }

  return element;
};

ReactElement.createElement = function (type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    ref = config.ref === undefined ? null : config.ref;
    key = config.key === undefined ? null : '' + config.key;
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (typeof props[propName] === 'undefined') {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
};

ReactElement.createFactory = function (type) {
  var factory = ReactElement.createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  // Legacy hook TODO: Warn if this is accessed
  factory.type = type;
  return factory;
};

ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
};

ReactElement.cloneAndReplaceProps = function (oldElement, newProps) {
  var newElement = ReactElement(oldElement.type, oldElement.key, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, newProps);

  if (process.env.NODE_ENV !== 'production') {
    // If the key on the original is valid, then the clone is valid
    newElement._store.validated = oldElement._store.validated;
  }

  return newElement;
};

ReactElement.cloneElement = function (element, config, children) {
  var propName;

  // Original props are copied
  var props = assign({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;
  // Self is preserved since the owner is preserved.
  var self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config != null) {
    if (config.ref !== undefined) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (config.key !== undefined) {
      key = '' + config.key;
    }
    // Remaining properties override existing props
    for (propName in config) {
      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
};

/**
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
ReactElement.isValidElement = function (object) {
  return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
};

module.exports = ReactElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVdBOzs7O0FBRUEsSUFBSSxvQkFBb0IsUUFBUSxxQkFBUixDQUFwQjs7QUFFSixJQUFJLFNBQVMsUUFBUSxpQkFBUixDQUFUO0FBQ0osSUFBSSxvQkFBb0IsUUFBUSxxQkFBUixDQUFwQjs7OztBQUlKLElBQUkscUJBQXFCLE9BQU8sTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPLEtBQVAsQ0FBaEMsSUFBaUQsT0FBTyxLQUFQLEVBQWMsZUFBZCxDQUFqRCxJQUFtRixNQUFuRjs7QUFFekIsSUFBSSxpQkFBaUI7QUFDbkIsT0FBSyxJQUFMO0FBQ0EsT0FBSyxJQUFMO0FBQ0EsVUFBUSxJQUFSO0FBQ0EsWUFBVSxJQUFWO0NBSkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJKLElBQUksZUFBZSxTQUFmLFlBQWUsQ0FBVSxJQUFWLEVBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLElBQTFCLEVBQWdDLE1BQWhDLEVBQXdDLEtBQXhDLEVBQStDLEtBQS9DLEVBQXNEO0FBQ3ZFLE1BQUksVUFBVTs7QUFFWixjQUFVLGtCQUFWOzs7QUFHQSxVQUFNLElBQU47QUFDQSxTQUFLLEdBQUw7QUFDQSxTQUFLLEdBQUw7QUFDQSxXQUFPLEtBQVA7OztBQUdBLFlBQVEsS0FBUjtHQVhFLENBRG1FOztBQWV2RSxNQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsRUFBdUM7Ozs7O0FBS3pDLFlBQVEsTUFBUixHQUFpQixFQUFqQjs7Ozs7O0FBTHlDLFFBV3JDLGlCQUFKLEVBQXVCO0FBQ3JCLGFBQU8sY0FBUCxDQUFzQixRQUFRLE1BQVIsRUFBZ0IsV0FBdEMsRUFBbUQ7QUFDakQsc0JBQWMsS0FBZDtBQUNBLG9CQUFZLEtBQVo7QUFDQSxrQkFBVSxJQUFWO0FBQ0EsZUFBTyxLQUFQO09BSkY7O0FB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QWMsR0FBM0IsRUFBZ0MsR0FBaEMsRUFBcUMsSUFBckMsRUFBMkMsTUFBM0MsRUFBbUQsS0FBbkQsRUFBMEQsS0FBMUQsQ0FBUCxDQWpEK0Q7Q0FBckM7Ozs7Ozs7QUF5RDVCLGFBQWEsY0FBYixHQUE4QixVQUFVLE1BQVYsRUFBa0I7QUFDOUMsU0FBTyxRQUFPLHVEQUFQLEtBQWtCLFFBQWxCLElBQThCLFdBQVcsSUFBWCxJQUFtQixPQUFPLFFBQVAsS0FBb0Isa0JBQXBCLENBRFY7Q0FBbEI7O0FBSTlCLE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJSZWFjdEVsZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RFbGVtZW50XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RDdXJyZW50T3duZXIgPSByZXF1aXJlKCcuL1JlYWN0Q3VycmVudE93bmVyJyk7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL09iamVjdC5hc3NpZ24nKTtcbnZhciBjYW5EZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vY2FuRGVmaW5lUHJvcGVydHknKTtcblxuLy8gVGhlIFN5bWJvbCB1c2VkIHRvIHRhZyB0aGUgUmVhY3RFbGVtZW50IHR5cGUuIElmIHRoZXJlIGlzIG5vIG5hdGl2ZSBTeW1ib2xcbi8vIG5vciBwb2x5ZmlsbCwgdGhlbiBhIHBsYWluIG51bWJlciBpcyB1c2VkIGZvciBwZXJmb3JtYW5jZS5cbnZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbFsnZm9yJ10gJiYgU3ltYm9sWydmb3InXSgncmVhY3QuZWxlbWVudCcpIHx8IDB4ZWFjNztcblxudmFyIFJFU0VSVkVEX1BST1BTID0ge1xuICBrZXk6IHRydWUsXG4gIHJlZjogdHJ1ZSxcbiAgX19zZWxmOiB0cnVlLFxuICBfX3NvdXJjZTogdHJ1ZVxufTtcblxuLyoqXG4gKiBCYXNlIGNvbnN0cnVjdG9yIGZvciBhbGwgUmVhY3QgZWxlbWVudHMuIFRoaXMgaXMgb25seSB1c2VkIHRvIG1ha2UgdGhpc1xuICogd29yayB3aXRoIGEgZHluYW1pYyBpbnN0YW5jZW9mIGNoZWNrLiBOb3RoaW5nIHNob3VsZCBsaXZlIG9uIHRoaXMgcHJvdG90eXBlLlxuICpcbiAqIEBwYXJhbSB7Kn0gdHlwZVxuICogQHBhcmFtIHsqfSBrZXlcbiAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gcmVmXG4gKiBAcGFyYW0geyp9IHNlbGYgQSAqdGVtcG9yYXJ5KiBoZWxwZXIgdG8gZGV0ZWN0IHBsYWNlcyB3aGVyZSBgdGhpc2AgaXNcbiAqIGRpZmZlcmVudCBmcm9tIHRoZSBgb3duZXJgIHdoZW4gUmVhY3QuY3JlYXRlRWxlbWVudCBpcyBjYWxsZWQsIHNvIHRoYXQgd2VcbiAqIGNhbiB3YXJuLiBXZSB3YW50IHRvIGdldCByaWQgb2Ygb3duZXIgYW5kIHJlcGxhY2Ugc3RyaW5nIGByZWZgcyB3aXRoIGFycm93XG4gKiBmdW5jdGlvbnMsIGFuZCBhcyBsb25nIGFzIGB0aGlzYCBhbmQgb3duZXIgYXJlIHRoZSBzYW1lLCB0aGVyZSB3aWxsIGJlIG5vXG4gKiBjaGFuZ2UgaW4gYmVoYXZpb3IuXG4gKiBAcGFyYW0geyp9IHNvdXJjZSBBbiBhbm5vdGF0aW9uIG9iamVjdCAoYWRkZWQgYnkgYSB0cmFuc3BpbGVyIG9yIG90aGVyd2lzZSlcbiAqIGluZGljYXRpbmcgZmlsZW5hbWUsIGxpbmUgbnVtYmVyLCBhbmQvb3Igb3RoZXIgaW5mb3JtYXRpb24uXG4gKiBAcGFyYW0geyp9IG93bmVyXG4gKiBAcGFyYW0geyp9IHByb3BzXG4gKiBAaW50ZXJuYWxcbiAqL1xudmFyIFJlYWN0RWxlbWVudCA9IGZ1bmN0aW9uICh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBvd25lciwgcHJvcHMpIHtcbiAgdmFyIGVsZW1lbnQgPSB7XG4gICAgLy8gVGhpcyB0YWcgYWxsb3cgdXMgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhpcyBhcyBhIFJlYWN0IEVsZW1lbnRcbiAgICAkJHR5cGVvZjogUkVBQ1RfRUxFTUVOVF9UWVBFLFxuXG4gICAgLy8gQnVpbHQtaW4gcHJvcGVydGllcyB0aGF0IGJlbG9uZyBvbiB0aGUgZWxlbWVudFxuICAgIHR5cGU6IHR5cGUsXG4gICAga2V5OiBrZXksXG4gICAgcmVmOiByZWYsXG4gICAgcHJvcHM6IHByb3BzLFxuXG4gICAgLy8gUmVjb3JkIHRoZSBjb21wb25lbnQgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoaXMgZWxlbWVudC5cbiAgICBfb3duZXI6IG93bmVyXG4gIH07XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAvLyBUaGUgdmFsaWRhdGlvbiBmbGFnIGlzIGN1cnJlbnRseSBtdXRhdGl2ZS4gV2UgcHV0IGl0IG9uXG4gICAgLy8gYW4gZXh0ZXJuYWwgYmFja2luZyBzdG9yZSBzbyB0aGF0IHdlIGNhbiBmcmVlemUgdGhlIHdob2xlIG9iamVjdC5cbiAgICAvLyBUaGlzIGNhbiBiZSByZXBsYWNlZCB3aXRoIGEgV2Vha01hcCBvbmNlIHRoZXkgYXJlIGltcGxlbWVudGVkIGluXG4gICAgLy8gY29tbW9ubHkgdXNlZCBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMuXG4gICAgZWxlbWVudC5fc3RvcmUgPSB7fTtcblxuICAgIC8vIFRvIG1ha2UgY29tcGFyaW5nIFJlYWN0RWxlbWVudHMgZWFzaWVyIGZvciB0ZXN0aW5nIHB1cnBvc2VzLCB3ZSBtYWtlXG4gICAgLy8gdGhlIHZhbGlkYXRpb24gZmxhZyBub24tZW51bWVyYWJsZSAod2hlcmUgcG9zc2libGUsIHdoaWNoIHNob3VsZFxuICAgIC8vIGluY2x1ZGUgZXZlcnkgZW52aXJvbm1lbnQgd2UgcnVuIHRlc3RzIGluKSwgc28gdGhlIHRlc3QgZnJhbWV3b3JrXG4gICAgLy8gaWdub3JlcyBpdC5cbiAgICBpZiAoY2FuRGVmaW5lUHJvcGVydHkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50Ll9zdG9yZSwgJ3ZhbGlkYXRlZCcsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgLy8gc2VsZiBhbmQgc291cmNlIGFyZSBERVYgb25seSBwcm9wZXJ0aWVzLlxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc2VsZicsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IHNlbGZcbiAgICAgIH0pO1xuICAgICAgLy8gVHdvIGVsZW1lbnRzIGNyZWF0ZWQgaW4gdHdvIGRpZmZlcmVudCBwbGFjZXMgc2hvdWxkIGJlIGNvbnNpZGVyZWRcbiAgICAgIC8vIGVxdWFsIGZvciB0ZXN0aW5nIHB1cnBvc2VzIGFuZCB0aGVyZWZvcmUgd2UgaGlkZSBpdCBmcm9tIGVudW1lcmF0aW9uLlxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc291cmNlJywge1xuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogc291cmNlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5fc3RvcmUudmFsaWRhdGVkID0gZmFsc2U7XG4gICAgICBlbGVtZW50Ll9zZWxmID0gc2VsZjtcbiAgICAgIGVsZW1lbnQuX3NvdXJjZSA9IHNvdXJjZTtcbiAgICB9XG4gICAgT2JqZWN0LmZyZWV6ZShlbGVtZW50LnByb3BzKTtcbiAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQpO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuXG5SZWFjdEVsZW1lbnQuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICh0eXBlLCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIHZhciBwcm9wTmFtZTtcblxuICAvLyBSZXNlcnZlZCBuYW1lcyBhcmUgZXh0cmFjdGVkXG4gIHZhciBwcm9wcyA9IHt9O1xuXG4gIHZhciBrZXkgPSBudWxsO1xuICB2YXIgcmVmID0gbnVsbDtcbiAgdmFyIHNlbGYgPSBudWxsO1xuICB2YXIgc291cmNlID0gbnVsbDtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICByZWYgPSBjb25maWcucmVmID09PSB1bmRlZmluZWQgPyBudWxsIDogY29uZmlnLnJlZjtcbiAgICBrZXkgPSBjb25maWcua2V5ID09PSB1bmRlZmluZWQgPyBudWxsIDogJycgKyBjb25maWcua2V5O1xuICAgIHNlbGYgPSBjb25maWcuX19zZWxmID09PSB1bmRlZmluZWQgPyBudWxsIDogY29uZmlnLl9fc2VsZjtcbiAgICBzb3VyY2UgPSBjb25maWcuX19zb3VyY2UgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWcuX19zb3VyY2U7XG4gICAgLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgYXJlIGFkZGVkIHRvIGEgbmV3IHByb3BzIG9iamVjdFxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoY29uZmlnLmhhc093blByb3BlcnR5KHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hpbGRyZW4gY2FuIGJlIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQsIGFuZCB0aG9zZSBhcmUgdHJhbnNmZXJyZWQgb250b1xuICAvLyB0aGUgbmV3bHkgYWxsb2NhdGVkIHByb3BzIG9iamVjdC5cbiAgdmFyIGNoaWxkcmVuTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG4gIGlmIChjaGlsZHJlbkxlbmd0aCA9PT0gMSkge1xuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAoY2hpbGRyZW5MZW5ndGggPiAxKSB7XG4gICAgdmFyIGNoaWxkQXJyYXkgPSBBcnJheShjaGlsZHJlbkxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZEFycmF5W2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICB9XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZEFycmF5O1xuICB9XG5cbiAgLy8gUmVzb2x2ZSBkZWZhdWx0IHByb3BzXG4gIGlmICh0eXBlICYmIHR5cGUuZGVmYXVsdFByb3BzKSB7XG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHR5cGUuZGVmYXVsdFByb3BzO1xuICAgIGZvciAocHJvcE5hbWUgaW4gZGVmYXVsdFByb3BzKSB7XG4gICAgICBpZiAodHlwZW9mIHByb3BzW3Byb3BOYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZGVmYXVsdFByb3BzW3Byb3BOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gUmVhY3RFbGVtZW50KHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQsIHByb3BzKTtcbn07XG5cblJlYWN0RWxlbWVudC5jcmVhdGVGYWN0b3J5ID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgdmFyIGZhY3RvcnkgPSBSZWFjdEVsZW1lbnQuY3JlYXRlRWxlbWVudC5iaW5kKG51bGwsIHR5cGUpO1xuICAvLyBFeHBvc2UgdGhlIHR5cGUgb24gdGhlIGZhY3RvcnkgYW5kIHRoZSBwcm90b3R5cGUgc28gdGhhdCBpdCBjYW4gYmVcbiAgLy8gZWFzaWx5IGFjY2Vzc2VkIG9uIGVsZW1lbnRzLiBFLmcuIGA8Rm9vIC8+LnR5cGUgPT09IEZvb2AuXG4gIC8vIFRoaXMgc2hvdWxkIG5vdCBiZSBuYW1lZCBgY29uc3RydWN0b3JgIHNpbmNlIHRoaXMgbWF5IG5vdCBiZSB0aGUgZnVuY3Rpb25cbiAgLy8gdGhhdCBjcmVhdGVkIHRoZSBlbGVtZW50LCBhbmQgaXQgbWF5IG5vdCBldmVuIGJlIGEgY29uc3RydWN0b3IuXG4gIC8vIExlZ2FjeSBob29rIFRPRE86IFdhcm4gaWYgdGhpcyBpcyBhY2Nlc3NlZFxuICBmYWN0b3J5LnR5cGUgPSB0eXBlO1xuICByZXR1cm4gZmFjdG9yeTtcbn07XG5cblJlYWN0RWxlbWVudC5jbG9uZUFuZFJlcGxhY2VLZXkgPSBmdW5jdGlvbiAob2xkRWxlbWVudCwgbmV3S2V5KSB7XG4gIHZhciBuZXdFbGVtZW50ID0gUmVhY3RFbGVtZW50KG9sZEVsZW1lbnQudHlwZSwgbmV3S2V5LCBvbGRFbGVtZW50LnJlZiwgb2xkRWxlbWVudC5fc2VsZiwgb2xkRWxlbWVudC5fc291cmNlLCBvbGRFbGVtZW50Ll9vd25lciwgb2xkRWxlbWVudC5wcm9wcyk7XG5cbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59O1xuXG5SZWFjdEVsZW1lbnQuY2xvbmVBbmRSZXBsYWNlUHJvcHMgPSBmdW5jdGlvbiAob2xkRWxlbWVudCwgbmV3UHJvcHMpIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSBSZWFjdEVsZW1lbnQob2xkRWxlbWVudC50eXBlLCBvbGRFbGVtZW50LmtleSwgb2xkRWxlbWVudC5yZWYsIG9sZEVsZW1lbnQuX3NlbGYsIG9sZEVsZW1lbnQuX3NvdXJjZSwgb2xkRWxlbWVudC5fb3duZXIsIG5ld1Byb3BzKTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIC8vIElmIHRoZSBrZXkgb24gdGhlIG9yaWdpbmFsIGlzIHZhbGlkLCB0aGVuIHRoZSBjbG9uZSBpcyB2YWxpZFxuICAgIG5ld0VsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCA9IG9sZEVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZDtcbiAgfVxuXG4gIHJldHVybiBuZXdFbGVtZW50O1xufTtcblxuUmVhY3RFbGVtZW50LmNsb25lRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIHZhciBwcm9wTmFtZTtcblxuICAvLyBPcmlnaW5hbCBwcm9wcyBhcmUgY29waWVkXG4gIHZhciBwcm9wcyA9IGFzc2lnbih7fSwgZWxlbWVudC5wcm9wcyk7XG5cbiAgLy8gUmVzZXJ2ZWQgbmFtZXMgYXJlIGV4dHJhY3RlZFxuICB2YXIga2V5ID0gZWxlbWVudC5rZXk7XG4gIHZhciByZWYgPSBlbGVtZW50LnJlZjtcbiAgLy8gU2VsZiBpcyBwcmVzZXJ2ZWQgc2luY2UgdGhlIG93bmVyIGlzIHByZXNlcnZlZC5cbiAgdmFyIHNlbGYgPSBlbGVtZW50Ll9zZWxmO1xuICAvLyBTb3VyY2UgaXMgcHJlc2VydmVkIHNpbmNlIGNsb25lRWxlbWVudCBpcyB1bmxpa2VseSB0byBiZSB0YXJnZXRlZCBieSBhXG4gIC8vIHRyYW5zcGlsZXIsIGFuZCB0aGUgb3JpZ2luYWwgc291cmNlIGlzIHByb2JhYmx5IGEgYmV0dGVyIGluZGljYXRvciBvZiB0aGVcbiAgLy8gdHJ1ZSBvd25lci5cbiAgdmFyIHNvdXJjZSA9IGVsZW1lbnQuX3NvdXJjZTtcblxuICAvLyBPd25lciB3aWxsIGJlIHByZXNlcnZlZCwgdW5sZXNzIHJlZiBpcyBvdmVycmlkZGVuXG4gIHZhciBvd25lciA9IGVsZW1lbnQuX293bmVyO1xuXG4gIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgIGlmIChjb25maWcucmVmICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIFNpbGVudGx5IHN0ZWFsIHRoZSByZWYgZnJvbSB0aGUgcGFyZW50LlxuICAgICAgcmVmID0gY29uZmlnLnJlZjtcbiAgICAgIG93bmVyID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudDtcbiAgICB9XG4gICAgaWYgKGNvbmZpZy5rZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH1cbiAgICAvLyBSZW1haW5pbmcgcHJvcGVydGllcyBvdmVycmlkZSBleGlzdGluZyBwcm9wc1xuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoY29uZmlnLmhhc093blByb3BlcnR5KHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hpbGRyZW4gY2FuIGJlIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQsIGFuZCB0aG9zZSBhcmUgdHJhbnNmZXJyZWQgb250b1xuICAvLyB0aGUgbmV3bHkgYWxsb2NhdGVkIHByb3BzIG9iamVjdC5cbiAgdmFyIGNoaWxkcmVuTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG4gIGlmIChjaGlsZHJlbkxlbmd0aCA9PT0gMSkge1xuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAoY2hpbGRyZW5MZW5ndGggPiAxKSB7XG4gICAgdmFyIGNoaWxkQXJyYXkgPSBBcnJheShjaGlsZHJlbkxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZEFycmF5W2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICB9XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZEFycmF5O1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0RWxlbWVudChlbGVtZW50LnR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIG93bmVyLCBwcm9wcyk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7P29iamVjdH0gb2JqZWN0XG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIGBvYmplY3RgIGlzIGEgdmFsaWQgY29tcG9uZW50LlxuICogQGZpbmFsXG4gKi9cblJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudCA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RFbGVtZW50OyJdfQ==