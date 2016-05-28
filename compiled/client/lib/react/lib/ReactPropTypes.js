/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypes
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var ReactElement = require('./ReactElement');
var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');

var emptyFunction = require('fbjs/lib/emptyFunction');
var getIteratorFn = require('./getIteratorFn');

/**
 * Collection of methods that allow declaration and validation of props that are
 * supplied to React components. Example usage:
 *
 *   var Props = require('ReactPropTypes');
 *   var MyArticle = React.createClass({
 *     propTypes: {
 *       // An optional string prop named "description".
 *       description: Props.string,
 *
 *       // A required enum prop named "category".
 *       category: Props.oneOf(['News','Photos']).isRequired,
 *
 *       // A prop named "dialog" that requires an instance of Dialog.
 *       dialog: Props.instanceOf(Dialog).isRequired
 *     },
 *     render: function() { ... }
 *   });
 *
 * A more formal specification of how these methods are used:
 *
 *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
 *   decl := ReactPropTypes.{type}(.isRequired)?
 *
 * Each and every declaration produces a function with the same signature. This
 * allows the creation of custom validation functions. For example:
 *
 *  var MyLink = React.createClass({
 *    propTypes: {
 *      // An optional string or URI prop named "href".
 *      href: function(props, propName, componentName) {
 *        var propValue = props[propName];
 *        if (propValue != null && typeof propValue !== 'string' &&
 *            !(propValue instanceof URI)) {
 *          return new Error(
 *            'Expected a string or an URI for ' + propName + ' in ' +
 *            componentName
 *          );
 *        }
 *      }
 *    },
 *    render: function() {...}
 *  });
 *
 * @internal
 */

var ANONYMOUS = '<<anonymous>>';

var ReactPropTypes = {
  array: createPrimitiveTypeChecker('array'),
  bool: createPrimitiveTypeChecker('boolean'),
  func: createPrimitiveTypeChecker('function'),
  number: createPrimitiveTypeChecker('number'),
  object: createPrimitiveTypeChecker('object'),
  string: createPrimitiveTypeChecker('string'),

  any: createAnyTypeChecker(),
  arrayOf: createArrayOfTypeChecker,
  element: createElementTypeChecker(),
  instanceOf: createInstanceTypeChecker,
  node: createNodeChecker(),
  objectOf: createObjectOfTypeChecker,
  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker,
  shape: createShapeTypeChecker
};

function createChainableTypeChecker(validate) {
  function checkType(isRequired, props, propName, componentName, location, propFullName) {
    componentName = componentName || ANONYMOUS;
    propFullName = propFullName || propName;
    if (props[propName] == null) {
      var locationName = ReactPropTypeLocationNames[location];
      if (isRequired) {
        return new Error('Required ' + locationName + ' `' + propFullName + '` was not specified in ' + ('`' + componentName + '`.'));
      }
      return null;
    } else {
      return validate(props, propName, componentName, location, propFullName);
    }
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

function createPrimitiveTypeChecker(expectedType) {
  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== expectedType) {
      var locationName = ReactPropTypeLocationNames[location];
      // `propValue` being instance of, say, date/regexp, pass the 'object'
      // check, but we can offer a more precise error message here rather than
      // 'of type `object`'.
      var preciseType = getPreciseType(propValue);

      return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createAnyTypeChecker() {
  return createChainableTypeChecker(emptyFunction.thatReturns(null));
}

function createArrayOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    if (!Array.isArray(propValue)) {
      var locationName = ReactPropTypeLocationNames[location];
      var propType = getPropType(propValue);
      return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
    }
    for (var i = 0; i < propValue.length; i++) {
      var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']');
      if (error instanceof Error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createElementTypeChecker() {
  function validate(props, propName, componentName, location, propFullName) {
    if (!ReactElement.isValidElement(props[propName])) {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a single ReactElement.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createInstanceTypeChecker(expectedClass) {
  function validate(props, propName, componentName, location, propFullName) {
    if (!(props[propName] instanceof expectedClass)) {
      var locationName = ReactPropTypeLocationNames[location];
      var expectedClassName = expectedClass.name || ANONYMOUS;
      var actualClassName = getClassName(props[propName]);
      return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createEnumTypeChecker(expectedValues) {
  if (!Array.isArray(expectedValues)) {
    return createChainableTypeChecker(function () {
      return new Error('Invalid argument supplied to oneOf, expected an instance of array.');
    });
  }

  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    for (var i = 0; i < expectedValues.length; i++) {
      if (propValue === expectedValues[i]) {
        return null;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    var valuesString = JSON.stringify(expectedValues);
    return new Error('Invalid ' + locationName + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
  }
  return createChainableTypeChecker(validate);
}

function createObjectOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
    }
    for (var key in propValue) {
      if (propValue.hasOwnProperty(key)) {
        var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key);
        if (error instanceof Error) {
          return error;
        }
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createUnionTypeChecker(arrayOfTypeCheckers) {
  if (!Array.isArray(arrayOfTypeCheckers)) {
    return createChainableTypeChecker(function () {
      return new Error('Invalid argument supplied to oneOfType, expected an instance of array.');
    });
  }

  function validate(props, propName, componentName, location, propFullName) {
    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (checker(props, propName, componentName, location, propFullName) == null) {
        return null;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    return new Error('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
  }
  return createChainableTypeChecker(validate);
}

function createNodeChecker() {
  function validate(props, propName, componentName, location, propFullName) {
    if (!isNode(props[propName])) {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createShapeTypeChecker(shapeTypes) {
  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
    }
    for (var key in shapeTypes) {
      var checker = shapeTypes[key];
      if (!checker) {
        continue;
      }
      var error = checker(propValue, key, componentName, location, propFullName + '.' + key);
      if (error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function isNode(propValue) {
  switch (typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue)) {
    case 'number':
    case 'string':
    case 'undefined':
      return true;
    case 'boolean':
      return !propValue;
    case 'object':
      if (Array.isArray(propValue)) {
        return propValue.every(isNode);
      }
      if (propValue === null || ReactElement.isValidElement(propValue)) {
        return true;
      }

      var iteratorFn = getIteratorFn(propValue);
      if (iteratorFn) {
        var iterator = iteratorFn.call(propValue);
        var step;
        if (iteratorFn !== propValue.entries) {
          while (!(step = iterator.next()).done) {
            if (!isNode(step.value)) {
              return false;
            }
          }
        } else {
          // Iterator will provide entry [k,v] tuples rather than values.
          while (!(step = iterator.next()).done) {
            var entry = step.value;
            if (entry) {
              if (!isNode(entry[1])) {
                return false;
              }
            }
          }
        }
      } else {
        return false;
      }

      return true;
    default:
      return false;
  }
}

// Equivalent of `typeof` but with special handling for array and regexp.
function getPropType(propValue) {
  var propType = typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue);
  if (Array.isArray(propValue)) {
    return 'array';
  }
  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return 'object';
  }
  return propType;
}

// This handles more types than `getPropType`. Only used for error messages.
// See `createPrimitiveTypeChecker`.
function getPreciseType(propValue) {
  var propType = getPropType(propValue);
  if (propType === 'object') {
    if (propValue instanceof Date) {
      return 'date';
    } else if (propValue instanceof RegExp) {
      return 'regexp';
    }
  }
  return propType;
}

// Returns class name of the object, if any.
function getClassName(propValue) {
  if (!propValue.constructor || !propValue.constructor.name) {
    return '<<anonymous>>';
  }
  return propValue.constructor.name;
}

module.exports = ReactPropTypes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0UHJvcFR5cGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7Ozs7QUFFQSxJQUFJLGVBQWUsUUFBUSxnQkFBUixDQUFmO0FBQ0osSUFBSSw2QkFBNkIsUUFBUSw4QkFBUixDQUE3Qjs7QUFFSixJQUFJLGdCQUFnQixRQUFRLHdCQUFSLENBQWhCO0FBQ0osSUFBSSxnQkFBZ0IsUUFBUSxpQkFBUixDQUFoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlESixJQUFJLFlBQVksZUFBWjs7QUFFSixJQUFJLGlCQUFpQjtBQUNuQixTQUFPLDJCQUEyQixPQUEzQixDQUFQO0FBQ0EsUUFBTSwyQkFBMkIsU0FBM0IsQ0FBTjtBQUNBLFFBQU0sMkJBQTJCLFVBQTNCLENBQU47QUFDQSxVQUFRLDJCQUEyQixRQUEzQixDQUFSO0FBQ0EsVUFBUSwyQkFBMkIsUUFBM0IsQ0FBUjtBQUNBLFVBQVEsMkJBQTJCLFFBQTNCLENBQVI7O0FBRUEsT0FBSyxzQkFBTDtBQUNBLFdBQVMsd0JBQVQ7QUFDQSxXQUFTLDBCQUFUO0FBQ0EsY0FBWSx5QkFBWjtBQUNBLFFBQU0sbUJBQU47QUFDQSxZQUFVLHlCQUFWO0FBQ0EsU0FBTyxxQkFBUDtBQUNBLGFBQVcsc0JBQVg7QUFDQSxTQUFPLHNCQUFQO0NBaEJFOztBQW1CSixTQUFTLDBCQUFULENBQW9DLFFBQXBDLEVBQThDO0FBQzVDLFdBQVMsU0FBVCxDQUFtQixVQUFuQixFQUErQixLQUEvQixFQUFzQyxRQUF0QyxFQUFnRCxhQUFoRCxFQUErRCxRQUEvRCxFQUF5RSxZQUF6RSxFQUF1RjtBQUNyRixvQkFBZ0IsaUJBQWlCLFNBQWpCLENBRHFFO0FBRXJGLG1CQUFlLGdCQUFnQixRQUFoQixDQUZzRTtBQUdyRixRQUFJLE1BQU0sUUFBTixLQUFtQixJQUFuQixFQUF5QjtBQUMzQixV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QixNQUFyQixFQUE2Qjs7OztBQUkvQixXQUFPLFFBQVAsQ0FKK0I7R0FBakM7QUFNQSxTQUFPLFFBQVAsQ0FYOEI7Q0FBaEM7Ozs7QUFnQkEsU0FBUyxjQUFULENBQXdCLFNBQXhCLEVBQW1DO0FBQ2pDLE1BQUksV0FBVyxZQUFZLFNBQVosQ0FBWCxDQUQ2QjtBQUVqQyxNQUFJLGFBQWEsUUFBYixFQUF1QjtBQUN6QixRQUFJLHFCQUFxQixJQUFyQixFQUEyQjtBQUM3QixhQUFPLE1BQVAsQ0FENkI7S0FBL0IsTUFFTyxJQUFJLHFCQUFxQixNQUFyQixFQUE2QjtBQUN0QyxhQUFPLFFBQVAsQ0FEc0M7S0FBakM7R0FIVDtBQU9BLFNBQU8sUUFBUCxDQVRpQztDQUFuQzs7O0FBYUEsU0FBUyxZQUFULENBQXNCLFNBQXRCLEVBQWlDO0FBQy9CLE1BQUksQ0FBQyxVQUFVLFdBQVYsSUFBeUIsQ0FBQyxVQUFVLFdBQVYsQ0FBc0IsSUFBdEIsRUFBNEI7QUFDekQsV0FBTyxlQUFQLENBRHlEO0dBQTNEO0FBR0EsU0FBTyxVQUFVLFdBQVYsQ0FBc0IsSUFBdEIsQ0FKd0I7Q0FBakM7O0FBT0EsT0FBTyxPQUFQLEdBQWlCLGNBQWpCIiwiZmlsZSI6IlJlYWN0UHJvcFR5cGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0UHJvcFR5cGVzXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RFbGVtZW50ID0gcmVxdWlyZSgnLi9SZWFjdEVsZW1lbnQnKTtcbnZhciBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcyA9IHJlcXVpcmUoJy4vUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXMnKTtcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgZ2V0SXRlcmF0b3JGbiA9IHJlcXVpcmUoJy4vZ2V0SXRlcmF0b3JGbicpO1xuXG4vKipcbiAqIENvbGxlY3Rpb24gb2YgbWV0aG9kcyB0aGF0IGFsbG93IGRlY2xhcmF0aW9uIGFuZCB2YWxpZGF0aW9uIG9mIHByb3BzIHRoYXQgYXJlXG4gKiBzdXBwbGllZCB0byBSZWFjdCBjb21wb25lbnRzLiBFeGFtcGxlIHVzYWdlOlxuICpcbiAqICAgdmFyIFByb3BzID0gcmVxdWlyZSgnUmVhY3RQcm9wVHlwZXMnKTtcbiAqICAgdmFyIE15QXJ0aWNsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAqICAgICBwcm9wVHlwZXM6IHtcbiAqICAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBwcm9wIG5hbWVkIFwiZGVzY3JpcHRpb25cIi5cbiAqICAgICAgIGRlc2NyaXB0aW9uOiBQcm9wcy5zdHJpbmcsXG4gKlxuICogICAgICAgLy8gQSByZXF1aXJlZCBlbnVtIHByb3AgbmFtZWQgXCJjYXRlZ29yeVwiLlxuICogICAgICAgY2F0ZWdvcnk6IFByb3BzLm9uZU9mKFsnTmV3cycsJ1Bob3RvcyddKS5pc1JlcXVpcmVkLFxuICpcbiAqICAgICAgIC8vIEEgcHJvcCBuYW1lZCBcImRpYWxvZ1wiIHRoYXQgcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgRGlhbG9nLlxuICogICAgICAgZGlhbG9nOiBQcm9wcy5pbnN0YW5jZU9mKERpYWxvZykuaXNSZXF1aXJlZFxuICogICAgIH0sXG4gKiAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHsgLi4uIH1cbiAqICAgfSk7XG4gKlxuICogQSBtb3JlIGZvcm1hbCBzcGVjaWZpY2F0aW9uIG9mIGhvdyB0aGVzZSBtZXRob2RzIGFyZSB1c2VkOlxuICpcbiAqICAgdHlwZSA6PSBhcnJheXxib29sfGZ1bmN8b2JqZWN0fG51bWJlcnxzdHJpbmd8b25lT2YoWy4uLl0pfGluc3RhbmNlT2YoLi4uKVxuICogICBkZWNsIDo9IFJlYWN0UHJvcFR5cGVzLnt0eXBlfSguaXNSZXF1aXJlZCk/XG4gKlxuICogRWFjaCBhbmQgZXZlcnkgZGVjbGFyYXRpb24gcHJvZHVjZXMgYSBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lIHNpZ25hdHVyZS4gVGhpc1xuICogYWxsb3dzIHRoZSBjcmVhdGlvbiBvZiBjdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvbnMuIEZvciBleGFtcGxlOlxuICpcbiAqICB2YXIgTXlMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICogICAgcHJvcFR5cGVzOiB7XG4gKiAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBvciBVUkkgcHJvcCBuYW1lZCBcImhyZWZcIi5cbiAqICAgICAgaHJlZjogZnVuY3Rpb24ocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKSB7XG4gKiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAqICAgICAgICBpZiAocHJvcFZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHByb3BWYWx1ZSAhPT0gJ3N0cmluZycgJiZcbiAqICAgICAgICAgICAgIShwcm9wVmFsdWUgaW5zdGFuY2VvZiBVUkkpKSB7XG4gKiAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFxuICogICAgICAgICAgICAnRXhwZWN0ZWQgYSBzdHJpbmcgb3IgYW4gVVJJIGZvciAnICsgcHJvcE5hbWUgKyAnIGluICcgK1xuICogICAgICAgICAgICBjb21wb25lbnROYW1lXG4gKiAgICAgICAgICApO1xuICogICAgICAgIH1cbiAqICAgICAgfVxuICogICAgfSxcbiAqICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7Li4ufVxuICogIH0pO1xuICpcbiAqIEBpbnRlcm5hbFxuICovXG5cbnZhciBBTk9OWU1PVVMgPSAnPDxhbm9ueW1vdXM+Pic7XG5cbnZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgYXJyYXk6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdhcnJheScpLFxuICBib29sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYm9vbGVhbicpLFxuICBmdW5jOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignZnVuY3Rpb24nKSxcbiAgbnVtYmVyOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignbnVtYmVyJyksXG4gIG9iamVjdDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ29iamVjdCcpLFxuICBzdHJpbmc6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzdHJpbmcnKSxcblxuICBhbnk6IGNyZWF0ZUFueVR5cGVDaGVja2VyKCksXG4gIGFycmF5T2Y6IGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcixcbiAgZWxlbWVudDogY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCksXG4gIGluc3RhbmNlT2Y6IGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIsXG4gIG5vZGU6IGNyZWF0ZU5vZGVDaGVja2VyKCksXG4gIG9iamVjdE9mOiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyLFxuICBvbmVPZjogY3JlYXRlRW51bVR5cGVDaGVja2VyLFxuICBvbmVPZlR5cGU6IGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIsXG4gIHNoYXBlOiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICBmdW5jdGlvbiBjaGVja1R5cGUoaXNSZXF1aXJlZCwgcHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWUgfHwgQU5PTllNT1VTO1xuICAgIHByb3BGdWxsTmFtZSA9IHByb3BGdWxsTmFtZSB8fCBwcm9wTmFtZTtcbiAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09IG51bGwpIHtcbiAgICAgIHZhciBsb2NhdGlvbk5hbWUgPSBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lc1tsb2NhdGlvbl07XG4gICAgICBpZiAoaXNSZXF1aXJlZCkge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdSZXF1aXJlZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHdhcyBub3Qgc3BlY2lmaWVkIGluICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKTtcbiAgICB9XG4gIH1cblxuICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgY2hhaW5lZENoZWNrVHlwZS5pc1JlcXVpcmVkID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgdHJ1ZSk7XG5cbiAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKGV4cGVjdGVkVHlwZSkge1xuICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlICE9PSBleHBlY3RlZFR5cGUpIHtcbiAgICAgIHZhciBsb2NhdGlvbk5hbWUgPSBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lc1tsb2NhdGlvbl07XG4gICAgICAvLyBgcHJvcFZhbHVlYCBiZWluZyBpbnN0YW5jZSBvZiwgc2F5LCBkYXRlL3JlZ2V4cCwgcGFzcyB0aGUgJ29iamVjdCdcbiAgICAgIC8vIGNoZWNrLCBidXQgd2UgY2FuIG9mZmVyIGEgbW9yZSBwcmVjaXNlIGVycm9yIG1lc3NhZ2UgaGVyZSByYXRoZXIgdGhhblxuICAgICAgLy8gJ29mIHR5cGUgYG9iamVjdGAnLlxuICAgICAgdmFyIHByZWNpc2VUeXBlID0gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKTtcblxuICAgICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcmVjaXNlVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnYCcgKyBleHBlY3RlZFR5cGUgKyAnYC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUFueVR5cGVDaGVja2VyKCkge1xuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIoZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJucyhudWxsKSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gYXJyYXkuJykpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBpLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJ1snICsgaSArICddJyk7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpIHtcbiAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgaWYgKCFSZWFjdEVsZW1lbnQuaXNWYWxpZEVsZW1lbnQocHJvcHNbcHJvcE5hbWVdKSkge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50LicpKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcihleHBlY3RlZENsYXNzKSB7XG4gIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIGlmICghKHByb3BzW3Byb3BOYW1lXSBpbnN0YW5jZW9mIGV4cGVjdGVkQ2xhc3MpKSB7XG4gICAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgICAgdmFyIGV4cGVjdGVkQ2xhc3NOYW1lID0gZXhwZWN0ZWRDbGFzcy5uYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgIHZhciBhY3R1YWxDbGFzc05hbWUgPSBnZXRDbGFzc05hbWUocHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgYWN0dWFsQ2xhc3NOYW1lICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdpbnN0YW5jZSBvZiBgJyArIGV4cGVjdGVkQ2xhc3NOYW1lICsgJ2AuJykpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIoZXhwZWN0ZWRWYWx1ZXMpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGV4cGVjdGVkVmFsdWVzKSkge1xuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcihmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHBlY3RlZFZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gZXhwZWN0ZWRWYWx1ZXNbaV0pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICB2YXIgdmFsdWVzU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZXhwZWN0ZWRWYWx1ZXMpO1xuICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB2YWx1ZSBgJyArIHByb3BWYWx1ZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBvbmUgb2YgJyArIHZhbHVlc1N0cmluZyArICcuJykpO1xuICB9XG4gIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHZhciBsb2NhdGlvbk5hbWUgPSBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lc1tsb2NhdGlvbl07XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbk5hbWUgKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIG9iamVjdC4nKSk7XG4gICAgfVxuICAgIGZvciAodmFyIGtleSBpbiBwcm9wVmFsdWUpIHtcbiAgICAgIGlmIChwcm9wVmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSk7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIoYXJyYXlPZlR5cGVDaGVja2Vycykge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXlPZlR5cGVDaGVja2VycykpIHtcbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICBpZiAoY2hlY2tlcihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbk5hbWUgKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AuJykpO1xuICB9XG4gIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU5vZGVDaGVja2VyKCkge1xuICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICBpZiAoIWlzTm9kZShwcm9wc1twcm9wTmFtZV0pKSB7XG4gICAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIFJlYWN0Tm9kZS4nKSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgIH1cbiAgICBmb3IgKHZhciBrZXkgaW4gc2hhcGVUeXBlcykge1xuICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICBpZiAoIWNoZWNrZXIpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2YXIgZXJyb3IgPSBjaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5KTtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZShwcm9wVmFsdWUpIHtcbiAgc3dpdGNoICh0eXBlb2YgcHJvcFZhbHVlKSB7XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiAhcHJvcFZhbHVlO1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBwcm9wVmFsdWUuZXZlcnkoaXNOb2RlKTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9wVmFsdWUgPT09IG51bGwgfHwgUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihwcm9wVmFsdWUpO1xuICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKHByb3BWYWx1ZSk7XG4gICAgICAgIHZhciBzdGVwO1xuICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICBpZiAoIWlzTm9kZShzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEl0ZXJhdG9yIHdpbGwgcHJvdmlkZSBlbnRyeSBbayx2XSB0dXBsZXMgcmF0aGVyIHRoYW4gdmFsdWVzLlxuICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoZW50cnlbMV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLy8gRXF1aXZhbGVudCBvZiBgdHlwZW9mYCBidXQgd2l0aCBzcGVjaWFsIGhhbmRsaW5nIGZvciBhcnJheSBhbmQgcmVnZXhwLlxuZnVuY3Rpb24gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKSB7XG4gIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG4gIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICByZXR1cm4gJ2FycmF5JztcbiAgfVxuICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgLy8gT2xkIHdlYmtpdHMgKGF0IGxlYXN0IHVudGlsIEFuZHJvaWQgNC4wKSByZXR1cm4gJ2Z1bmN0aW9uJyByYXRoZXIgdGhhblxuICAgIC8vICdvYmplY3QnIGZvciB0eXBlb2YgYSBSZWdFeHAuIFdlJ2xsIG5vcm1hbGl6ZSB0aGlzIGhlcmUgc28gdGhhdCAvYmxhL1xuICAgIC8vIHBhc3NlcyBQcm9wVHlwZXMub2JqZWN0LlxuICAgIHJldHVybiAnb2JqZWN0JztcbiAgfVxuICByZXR1cm4gcHJvcFR5cGU7XG59XG5cbi8vIFRoaXMgaGFuZGxlcyBtb3JlIHR5cGVzIHRoYW4gYGdldFByb3BUeXBlYC4gT25seSB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbi8vIFNlZSBgY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXJgLlxuZnVuY3Rpb24gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKSB7XG4gIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gIGlmIChwcm9wVHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgcmV0dXJuICdkYXRlJztcbiAgICB9IGVsc2UgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgcmV0dXJuICdyZWdleHAnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcHJvcFR5cGU7XG59XG5cbi8vIFJldHVybnMgY2xhc3MgbmFtZSBvZiB0aGUgb2JqZWN0LCBpZiBhbnkuXG5mdW5jdGlvbiBnZXRDbGFzc05hbWUocHJvcFZhbHVlKSB7XG4gIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgIHJldHVybiAnPDxhbm9ueW1vdXM+Pic7XG4gIH1cbiAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzOyJdfQ==