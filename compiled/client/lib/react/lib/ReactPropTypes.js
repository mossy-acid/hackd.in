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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0UHJvcFR5cGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBV0E7Ozs7QUFFQSxJQUFJLGVBQWUsUUFBUSxnQkFBUixDQUFuQjtBQUNBLElBQUksNkJBQTZCLFFBQVEsOEJBQVIsQ0FBakM7O0FBRUEsSUFBSSxnQkFBZ0IsUUFBUSx3QkFBUixDQUFwQjtBQUNBLElBQUksZ0JBQWdCLFFBQVEsaUJBQVIsQ0FBcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpREEsSUFBSSxZQUFZLGVBQWhCOztBQUVBLElBQUksaUJBQWlCO0FBQ25CLFNBQU8sMkJBQTJCLE9BQTNCLENBRFk7QUFFbkIsUUFBTSwyQkFBMkIsU0FBM0IsQ0FGYTtBQUduQixRQUFNLDJCQUEyQixVQUEzQixDQUhhO0FBSW5CLFVBQVEsMkJBQTJCLFFBQTNCLENBSlc7QUFLbkIsVUFBUSwyQkFBMkIsUUFBM0IsQ0FMVztBQU1uQixVQUFRLDJCQUEyQixRQUEzQixDQU5XOztBQVFuQixPQUFLLHNCQVJjO0FBU25CLFdBQVMsd0JBVFU7QUFVbkIsV0FBUywwQkFWVTtBQVduQixjQUFZLHlCQVhPO0FBWW5CLFFBQU0sbUJBWmE7QUFhbkIsWUFBVSx5QkFiUztBQWNuQixTQUFPLHFCQWRZO0FBZW5CLGFBQVcsc0JBZlE7QUFnQm5CLFNBQU87QUFoQlksQ0FBckI7O0FBbUJBLFNBQVMsMEJBQVQsQ0FBb0MsUUFBcEMsRUFBOEM7QUFDNUMsV0FBUyxTQUFULENBQW1CLFVBQW5CLEVBQStCLEtBQS9CLEVBQXNDLFFBQXRDLEVBQWdELGFBQWhELEVBQStELFFBQS9ELEVBQXlFLFlBQXpFLEVBQXVGO0FBQ3JGLG9CQUFnQixpQkFBaUIsU0FBakM7QUFDQSxtQkFBZSxnQkFBZ0IsUUFBL0I7QUFDQSxRQUFJLE1BQU0sUUFBTixLQUFtQixJQUF2QixFQUE2QjtB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QUFJLEtBQUosRUFBVztBQUNULGtCQUFJLENBQUMsT0FBTyxNQUFNLENBQU4sQ0FBUCxDQUFMLEVBQXVCO0FBQ3JCLHVCQUFPLEtBQVA7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQUNGLE9BcEJELE1Bb0JPO0FBQ0wsZUFBTyxLQUFQO0FBQ0Q7O0FBRUQsYUFBTyxJQUFQO0FBQ0Y7QUFDRSxhQUFPLEtBQVA7QUExQ0o7QUE0Q0Q7OztBQUdELFNBQVMsV0FBVCxDQUFxQixTQUFyQixFQUFnQztBQUM5QixNQUFJLGtCQUFrQixTQUFsQix5Q0FBa0IsU0FBbEIsQ0FBSjtBQUNBLE1BQUksTUFBTSxPQUFOLENBQWMsU0FBZCxDQUFKLEVBQThCO0FBQzVCLFdBQU8sT0FBUDtBQUNEO0FBQ0QsTUFBSSxxQkFBcUIsTUFBekIsRUFBaUM7Ozs7QUFJL0IsV0FBTyxRQUFQO0FBQ0Q7QUFDRCxTQUFPLFFBQVA7QUFDRDs7OztBQUlELFNBQVMsY0FBVCxDQUF3QixTQUF4QixFQUFtQztBQUNqQyxNQUFJLFdBQVcsWUFBWSxTQUFaLENBQWY7QUFDQSxNQUFJLGFBQWEsUUFBakIsRUFBMkI7QUFDekIsUUFBSSxxQkFBcUIsSUFBekIsRUFBK0I7QUFDN0IsYUFBTyxNQUFQO0FBQ0QsS0FGRCxNQUVPLElBQUkscUJBQXFCLE1BQXpCLEVBQWlDO0FBQ3RDLGFBQU8sUUFBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLFFBQVA7QUFDRDs7O0FBR0QsU0FBUyxZQUFULENBQXNCLFNBQXRCLEVBQWlDO0FBQy9CLE1BQUksQ0FBQyxVQUFVLFdBQVgsSUFBMEIsQ0FBQyxVQUFVLFdBQVYsQ0FBc0IsSUFBckQsRUFBMkQ7QUFDekQsV0FBTyxlQUFQO0FBQ0Q7QUFDRCxTQUFPLFVBQVUsV0FBVixDQUFzQixJQUE3QjtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixjQUFqQiIsImZpbGUiOiJSZWFjdFByb3BUeXBlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdFByb3BUeXBlc1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0RWxlbWVudCA9IHJlcXVpcmUoJy4vUmVhY3RFbGVtZW50Jyk7XG52YXIgUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXMgPSByZXF1aXJlKCcuL1JlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzJyk7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGdldEl0ZXJhdG9yRm4gPSByZXF1aXJlKCcuL2dldEl0ZXJhdG9yRm4nKTtcblxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIG1ldGhvZHMgdGhhdCBhbGxvdyBkZWNsYXJhdGlvbiBhbmQgdmFsaWRhdGlvbiBvZiBwcm9wcyB0aGF0IGFyZVxuICogc3VwcGxpZWQgdG8gUmVhY3QgY29tcG9uZW50cy4gRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiAgIHZhciBQcm9wcyA9IHJlcXVpcmUoJ1JlYWN0UHJvcFR5cGVzJyk7XG4gKiAgIHZhciBNeUFydGljbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gKiAgICAgcHJvcFR5cGVzOiB7XG4gKiAgICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgcHJvcCBuYW1lZCBcImRlc2NyaXB0aW9uXCIuXG4gKiAgICAgICBkZXNjcmlwdGlvbjogUHJvcHMuc3RyaW5nLFxuICpcbiAqICAgICAgIC8vIEEgcmVxdWlyZWQgZW51bSBwcm9wIG5hbWVkIFwiY2F0ZWdvcnlcIi5cbiAqICAgICAgIGNhdGVnb3J5OiBQcm9wcy5vbmVPZihbJ05ld3MnLCdQaG90b3MnXSkuaXNSZXF1aXJlZCxcbiAqXG4gKiAgICAgICAvLyBBIHByb3AgbmFtZWQgXCJkaWFsb2dcIiB0aGF0IHJlcXVpcmVzIGFuIGluc3RhbmNlIG9mIERpYWxvZy5cbiAqICAgICAgIGRpYWxvZzogUHJvcHMuaW5zdGFuY2VPZihEaWFsb2cpLmlzUmVxdWlyZWRcbiAqICAgICB9LFxuICogICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7IC4uLiB9XG4gKiAgIH0pO1xuICpcbiAqIEEgbW9yZSBmb3JtYWwgc3BlY2lmaWNhdGlvbiBvZiBob3cgdGhlc2UgbWV0aG9kcyBhcmUgdXNlZDpcbiAqXG4gKiAgIHR5cGUgOj0gYXJyYXl8Ym9vbHxmdW5jfG9iamVjdHxudW1iZXJ8c3RyaW5nfG9uZU9mKFsuLi5dKXxpbnN0YW5jZU9mKC4uLilcbiAqICAgZGVjbCA6PSBSZWFjdFByb3BUeXBlcy57dHlwZX0oLmlzUmVxdWlyZWQpP1xuICpcbiAqIEVhY2ggYW5kIGV2ZXJ5IGRlY2xhcmF0aW9uIHByb2R1Y2VzIGEgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBzaWduYXR1cmUuIFRoaXNcbiAqIGFsbG93cyB0aGUgY3JlYXRpb24gb2YgY3VzdG9tIHZhbGlkYXRpb24gZnVuY3Rpb25zLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgdmFyIE15TGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAqICAgIHByb3BUeXBlczoge1xuICogICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgb3IgVVJJIHByb3AgbmFtZWQgXCJocmVmXCIuXG4gKiAgICAgIGhyZWY6IGZ1bmN0aW9uKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICogICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gKiAgICAgICAgaWYgKHByb3BWYWx1ZSAhPSBudWxsICYmIHR5cGVvZiBwcm9wVmFsdWUgIT09ICdzdHJpbmcnICYmXG4gKiAgICAgICAgICAgICEocHJvcFZhbHVlIGluc3RhbmNlb2YgVVJJKSkge1xuICogICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcbiAqICAgICAgICAgICAgJ0V4cGVjdGVkIGEgc3RyaW5nIG9yIGFuIFVSSSBmb3IgJyArIHByb3BOYW1lICsgJyBpbiAnICtcbiAqICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICogICAgICAgICAgKTtcbiAqICAgICAgICB9XG4gKiAgICAgIH1cbiAqICAgIH0sXG4gKiAgICByZW5kZXI6IGZ1bmN0aW9uKCkgey4uLn1cbiAqICB9KTtcbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuXG52YXIgQU5PTllNT1VTID0gJzw8YW5vbnltb3VzPj4nO1xuXG52YXIgUmVhY3RQcm9wVHlwZXMgPSB7XG4gIGFycmF5OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYXJyYXknKSxcbiAgYm9vbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Jvb2xlYW4nKSxcbiAgZnVuYzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Z1bmN0aW9uJyksXG4gIG51bWJlcjogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ251bWJlcicpLFxuICBvYmplY3Q6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdvYmplY3QnKSxcbiAgc3RyaW5nOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3RyaW5nJyksXG5cbiAgYW55OiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpLFxuICBhcnJheU9mOiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIsXG4gIGVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpLFxuICBpbnN0YW5jZU9mOiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyLFxuICBub2RlOiBjcmVhdGVOb2RlQ2hlY2tlcigpLFxuICBvYmplY3RPZjogY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcixcbiAgb25lT2Y6IGNyZWF0ZUVudW1UeXBlQ2hlY2tlcixcbiAgb25lT2ZUeXBlOiBjcmVhdGVVbmlvblR5cGVDaGVja2VyLFxuICBzaGFwZTogY3JlYXRlU2hhcGVUeXBlQ2hlY2tlclxufTtcblxuZnVuY3Rpb24gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpIHtcbiAgZnVuY3Rpb24gY2hlY2tUeXBlKGlzUmVxdWlyZWQsIHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lIHx8IEFOT05ZTU9VUztcbiAgICBwcm9wRnVsbE5hbWUgPSBwcm9wRnVsbE5hbWUgfHwgcHJvcE5hbWU7XG4gICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgICAgaWYgKGlzUmVxdWlyZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignUmVxdWlyZWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCB3YXMgbm90IHNwZWNpZmllZCBpbiAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGNoYWluZWRDaGVja1R5cGUgPSBjaGVja1R5cGUuYmluZChudWxsLCBmYWxzZSk7XG4gIGNoYWluZWRDaGVja1R5cGUuaXNSZXF1aXJlZCA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIHRydWUpO1xuXG4gIHJldHVybiBjaGFpbmVkQ2hlY2tUeXBlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihleHBlY3RlZFR5cGUpIHtcbiAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgIGlmIChwcm9wVHlwZSAhPT0gZXhwZWN0ZWRUeXBlKSB7XG4gICAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgICAgLy8gYHByb3BWYWx1ZWAgYmVpbmcgaW5zdGFuY2Ugb2YsIHNheSwgZGF0ZS9yZWdleHAsIHBhc3MgdGhlICdvYmplY3QnXG4gICAgICAvLyBjaGVjaywgYnV0IHdlIGNhbiBvZmZlciBhIG1vcmUgcHJlY2lzZSBlcnJvciBtZXNzYWdlIGhlcmUgcmF0aGVyIHRoYW5cbiAgICAgIC8vICdvZiB0eXBlIGBvYmplY3RgJy5cbiAgICAgIHZhciBwcmVjaXNlVHlwZSA9IGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSk7XG5cbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJlY2lzZVR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2AnICsgZXhwZWN0ZWRUeXBlICsgJ2AuJykpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpIHtcbiAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnMobnVsbCkpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbk5hbWUgKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIGFycmF5LicpKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wVmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwgaSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICdbJyArIGkgKyAnXScpO1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSB7XG4gIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIGlmICghUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KHByb3BzW3Byb3BOYW1lXSkpIHtcbiAgICAgIHZhciBsb2NhdGlvbk5hbWUgPSBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lc1tsb2NhdGlvbl07XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbk5hbWUgKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgc2luZ2xlIFJlYWN0RWxlbWVudC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIoZXhwZWN0ZWRDbGFzcykge1xuICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICBpZiAoIShwcm9wc1twcm9wTmFtZV0gaW5zdGFuY2VvZiBleHBlY3RlZENsYXNzKSkge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHZhciBleHBlY3RlZENsYXNzTmFtZSA9IGV4cGVjdGVkQ2xhc3MubmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICB2YXIgYWN0dWFsQ2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lKHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbk5hbWUgKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIGFjdHVhbENsYXNzTmFtZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnaW5zdGFuY2Ugb2YgYCcgKyBleHBlY3RlZENsYXNzTmFtZSArICdgLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRW51bVR5cGVDaGVja2VyKGV4cGVjdGVkVmFsdWVzKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShleHBlY3RlZFZhbHVlcykpIHtcbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZiwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJyk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhwZWN0ZWRWYWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChwcm9wVmFsdWUgPT09IGV4cGVjdGVkVmFsdWVzW2ldKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsb2NhdGlvbk5hbWUgPSBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lc1tsb2NhdGlvbl07XG4gICAgdmFyIHZhbHVlc1N0cmluZyA9IEpTT04uc3RyaW5naWZ5KGV4cGVjdGVkVmFsdWVzKTtcbiAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbk5hbWUgKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdmFsdWUgYCcgKyBwcm9wVmFsdWUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgb25lIG9mICcgKyB2YWx1ZXNTdHJpbmcgKyAnLicpKTtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBvYmplY3QuJykpO1xuICAgIH1cbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcFZhbHVlKSB7XG4gICAgICBpZiAocHJvcFZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXkpO1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVVbmlvblR5cGVDaGVja2VyKGFycmF5T2ZUeXBlQ2hlY2tlcnMpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5T2ZUeXBlQ2hlY2tlcnMpKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgaWYgKGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsb2NhdGlvbk5hbWUgPSBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lc1tsb2NhdGlvbl07XG4gICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLicpKTtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVOb2RlQ2hlY2tlcigpIHtcbiAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgaWYgKCFpc05vZGUocHJvcHNbcHJvcE5hbWVdKSkge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBSZWFjdE5vZGUuJykpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyKHNoYXBlVHlwZXMpIHtcbiAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHZhciBsb2NhdGlvbk5hbWUgPSBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lc1tsb2NhdGlvbl07XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbk5hbWUgKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBgJyArIHByb3BUeXBlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGBvYmplY3RgLicpKTtcbiAgICB9XG4gICAgZm9yICh2YXIga2V5IGluIHNoYXBlVHlwZXMpIHtcbiAgICAgIHZhciBjaGVja2VyID0gc2hhcGVUeXBlc1trZXldO1xuICAgICAgaWYgKCFjaGVja2VyKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSk7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBpc05vZGUocHJvcFZhbHVlKSB7XG4gIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgIGNhc2UgJ251bWJlcic6XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gIXByb3BWYWx1ZTtcbiAgICBjYXNlICdvYmplY3QnOlxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICB9XG4gICAgICBpZiAocHJvcFZhbHVlID09PSBudWxsIHx8IFJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4ocHJvcFZhbHVlKTtcbiAgICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChwcm9wVmFsdWUpO1xuICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IHByb3BWYWx1ZS5lbnRyaWVzKSB7XG4gICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgaWYgKCFpc05vZGUoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJdGVyYXRvciB3aWxsIHByb3ZpZGUgZW50cnkgW2ssdl0gdHVwbGVzIHJhdGhlciB0aGFuIHZhbHVlcy5cbiAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgIGlmICghaXNOb2RlKGVudHJ5WzFdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIEVxdWl2YWxlbnQgb2YgYHR5cGVvZmAgYnV0IHdpdGggc3BlY2lhbCBoYW5kbGluZyBmb3IgYXJyYXkgYW5kIHJlZ2V4cC5cbmZ1bmN0aW9uIGdldFByb3BUeXBlKHByb3BWYWx1ZSkge1xuICB2YXIgcHJvcFR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlO1xuICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgcmV0dXJuICdhcnJheSc7XG4gIH1cbiAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIC8vIE9sZCB3ZWJraXRzIChhdCBsZWFzdCB1bnRpbCBBbmRyb2lkIDQuMCkgcmV0dXJuICdmdW5jdGlvbicgcmF0aGVyIHRoYW5cbiAgICAvLyAnb2JqZWN0JyBmb3IgdHlwZW9mIGEgUmVnRXhwLiBXZSdsbCBub3JtYWxpemUgdGhpcyBoZXJlIHNvIHRoYXQgL2JsYS9cbiAgICAvLyBwYXNzZXMgUHJvcFR5cGVzLm9iamVjdC5cbiAgICByZXR1cm4gJ29iamVjdCc7XG4gIH1cbiAgcmV0dXJuIHByb3BUeXBlO1xufVxuXG4vLyBUaGlzIGhhbmRsZXMgbW9yZSB0eXBlcyB0aGFuIGBnZXRQcm9wVHlwZWAuIE9ubHkgdXNlZCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4vLyBTZWUgYGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyYC5cbmZ1bmN0aW9uIGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSkge1xuICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICBpZiAocHJvcFR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHJldHVybiAnZGF0ZSc7XG4gICAgfSBlbHNlIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIHJldHVybiAncmVnZXhwJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByb3BUeXBlO1xufVxuXG4vLyBSZXR1cm5zIGNsYXNzIG5hbWUgb2YgdGhlIG9iamVjdCwgaWYgYW55LlxuZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHByb3BWYWx1ZSkge1xuICBpZiAoIXByb3BWYWx1ZS5jb25zdHJ1Y3RvciB8fCAhcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWUpIHtcbiAgICByZXR1cm4gJzw8YW5vbnltb3VzPj4nO1xuICB9XG4gIHJldHVybiBwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFByb3BUeXBlczsiXX0=