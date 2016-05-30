/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DOMPropertyOperations
 * @typechecks static-only
 */

'use strict';

var DOMProperty = require('./DOMProperty');
var ReactPerf = require('./ReactPerf');

var quoteAttributeValueForBrowser = require('./quoteAttributeValueForBrowser');
var warning = require('fbjs/lib/warning');

// Simplified subset
var VALID_ATTRIBUTE_NAME_REGEX = /^[a-zA-Z_][\w\.\-]*$/;
var illegalAttributeNameCache = {};
var validatedAttributeNameCache = {};

function isAttributeNameSafe(attributeName) {
  if (validatedAttributeNameCache.hasOwnProperty(attributeName)) {
    return true;
  }
  if (illegalAttributeNameCache.hasOwnProperty(attributeName)) {
    return false;
  }
  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
    validatedAttributeNameCache[attributeName] = true;
    return true;
  }
  illegalAttributeNameCache[attributeName] = true;
  process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid attribute name: `%s`', attributeName) : undefined;
  return false;
}

function shouldIgnoreValue(propertyInfo, value) {
  return value == null || propertyInfo.hasBooleanValue && !value || propertyInfo.hasNumericValue && isNaN(value) || propertyInfo.hasPositiveNumericValue && value < 1 || propertyInfo.hasOverloadedBooleanValue && value === false;
}

if (process.env.NODE_ENV !== 'production') {
  var reactProps = {
    children: true,
    dangerouslySetInnerHTML: true,
    key: true,
    ref: true
  };
  var warnedProperties = {};

  var warnUnknownProperty = function warnUnknownProperty(name) {
    if (reactProps.hasOwnProperty(name) && reactProps[name] || warnedProperties.hasOwnProperty(name) && warnedProperties[name]) {
      return;
    }

    warnedProperties[name] = true;
    var lowerCasedName = name.toLowerCase();

    // data-* attributes should be lowercase; suggest the lowercase version
    var standardName = DOMProperty.isCustomAttribute(lowerCasedName) ? lowerCasedName : DOMProperty.getPossibleStandardName.hasOwnProperty(lowerCasedName) ? DOMProperty.getPossibleStandardName[lowerCasedName] : null;

    // For now, only warn when we have a suggested correction. This prevents
    // logging too much when using transferPropsTo.
    process.env.NODE_ENV !== 'production' ? warning(standardName == null, 'Unknown DOM property %s. Did you mean %s?', name, standardName) : undefined;
  };
}

/**
 * Operations for dealing with DOM properties.
 */
var DOMPropertyOperations = {

  /**
   * Creates markup for the ID property.
   *
   * @param {string} id Unescaped ID.
   * @return {string} Markup string.
   */
  createMarkupForID: function createMarkupForID(id) {
    return DOMProperty.ID_ATTRIBUTE_NAME + '=' + quoteAttributeValueForBrowser(id);
  },

  setAttributeForID: function setAttributeForID(node, id) {
    node.setAttribute(DOMProperty.ID_ATTRIBUTE_NAME, id);
  },

  /**
   * Creates markup for a property.
   *
   * @param {string} name
   * @param {*} value
   * @return {?string} Markup string, or null if the property was invalid.
   */
  createMarkupForProperty: function createMarkupForProperty(name, value) {
    var propertyInfo = DOMProperty.properties.hasOwnProperty(name) ? DOMProperty.properties[name] : null;
    if (propertyInfo) {
      if (shouldIgnoreValue(propertyInfo, value)) {
        return '';
      }
      var attributeName = propertyInfo.attributeName;
      if (propertyInfo.hasBooleanValue || propertyInfo.hasOverloadedBooleanValue && value === true) {
        return attributeName + '=""';
      }
      return attributeName + '=' + quoteAttributeValueForBrowser(value);
    } else if (DOMProperty.isCustomAttribute(name)) {
      if (value == null) {
        return '';
      }
      return name + '=' + quoteAttributeValueForBrowser(value);
    } else if (process.env.NODE_ENV !== 'production') {
      warnUnknownProperty(name);
    }
    return null;
  },

  /**
   * Creates markup for a custom property.
   *
   * @param {string} name
   * @param {*} value
   * @return {string} Markup string, or empty string if the property was invalid.
   */
  createMarkupForCustomAttribute: function createMarkupForCustomAttribute(name, value) {
    if (!isAttributeNameSafe(name) || value == null) {
      return '';
    }
    return name + '=' + quoteAttributeValueForBrowser(value);
  },

  /**
   * Sets the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   * @param {*} value
   */
  setValueForProperty: function setValueForProperty(node, name, value) {
    var propertyInfo = DOMProperty.properties.hasOwnProperty(name) ? DOMProperty.properties[name] : null;
    if (propertyInfo) {
      var mutationMethod = propertyInfo.mutationMethod;
      if (mutationMethod) {
        mutationMethod(node, value);
      } else if (shouldIgnoreValue(propertyInfo, value)) {
        this.deleteValueForProperty(node, name);
      } else if (propertyInfo.mustUseAttribute) {
        var attributeName = propertyInfo.attributeName;
        var namespace = propertyInfo.attributeNamespace;
        // `setAttribute` with objects becomes only `[object]` in IE8/9,
        // ('' + value) makes it output the correct toString()-value.
        if (namespace) {
          node.setAttributeNS(namespace, attributeName, '' + value);
        } else if (propertyInfo.hasBooleanValue || propertyInfo.hasOverloadedBooleanValue && value === true) {
          node.setAttribute(attributeName, '');
        } else {
          node.setAttribute(attributeName, '' + value);
        }
      } else {
        var propName = propertyInfo.propertyName;
        // Must explicitly cast values for HAS_SIDE_EFFECTS-properties to the
        // property type before comparing; only `value` does and is string.
        if (!propertyInfo.hasSideEffects || '' + node[propName] !== '' + value) {
          // Contrary to `setAttribute`, object properties are properly
          // `toString`ed by IE8/9.
          node[propName] = value;
        }
      }
    } else if (DOMProperty.isCustomAttribute(name)) {
      DOMPropertyOperations.setValueForAttribute(node, name, value);
    } else if (process.env.NODE_ENV !== 'production') {
      warnUnknownProperty(name);
    }
  },

  setValueForAttribute: function setValueForAttribute(node, name, value) {
    if (!isAttributeNameSafe(name)) {
      return;
    }
    if (value == null) {
      node.removeAttribute(name);
    } else {
      node.setAttribute(name, '' + value);
    }
  },

  /**
   * Deletes the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   */
  deleteValueForProperty: function deleteValueForProperty(node, name) {
    var propertyInfo = DOMProperty.properties.hasOwnProperty(name) ? DOMProperty.properties[name] : null;
    if (propertyInfo) {
      var mutationMethod = propertyInfo.mutationMethod;
      if (mutationMethod) {
        mutationMethod(node, undefined);
      } else if (propertyInfo.mustUseAttribute) {
        node.removeAttribute(propertyInfo.attributeName);
      } else {
        var propName = propertyInfo.propertyName;
        var defaultValue = DOMProperty.getDefaultValueForProperty(node.nodeName, propName);
        if (!propertyInfo.hasSideEffects || '' + node[propName] !== defaultValue) {
          node[propName] = defaultValue;
        }
      }
    } else if (DOMProperty.isCustomAttribute(name)) {
      node.removeAttribute(name);
    } else if (process.env.NODE_ENV !== 'production') {
      warnUnknownProperty(name);
    }
  }

};

ReactPerf.measureMethods(DOMPropertyOperations, 'DOMPropertyOperations', {
  setValueForProperty: 'setValueForProperty',
  setValueForAttribute: 'setValueForAttribute',
  deleteValueForProperty: 'deleteValueForProperty'
});

module.exports = DOMPropertyOperations;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0RPTVByb3BlcnR5T3BlcmF0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLGNBQWMsUUFBUSxlQUFSLENBQWxCO0FBQ0EsSUFBSSxZQUFZLFFBQVEsYUFBUixDQUFoQjs7QUFFQSxJQUFJLGdDQUFnQyxRQUFRLGlDQUFSLENBQXBDO0FBQ0EsSUFBSSxVQUFVLFFBQVEsa0JBQVIsQ0FBZDs7O0FBR0EsSUFBSSw2QkFBNkIsc0JBQWpDO0FBQ0EsSUFBSSw0QkFBNEIsRUFBaEM7QUFDQSxJQUFJLDhCQUE4QixFQUFsQzs7QUFFQSxTQUFTLG1CQUFULENBQTZCLGFBQTdCLEVBQTRDO0FBQzFDLE1BQUksNEJBQTRCLGNBQTVCLENBQTJDLGFBQTNDLENBQUosRUFBK0Q7QUFDN0QsV0FBTyxJQUFQO0FBQ0Q7QUFDRCxNQUFJLDBCQUEwQixjQUExQixDQUF5QyxhQUF6QyxDQUFKLEVBQTZEO0FBQzNELFdBQU8sS0FBUDtBQUNEO0FBQ0QsTUFBSSwyQkFBMkIsSUFBM0IsQ0FBZ0MsYUFBaEMsQ0FBSixFQUFvRDtBQUNsRCxnQ0FBNEIsYUFBNUIsSUFBNkMsSUFBN0M7QUFDQSxXQUFPLElBQVA7QUFDRDtBQUNELDRCQUEwQixhQUExQixJQUEyQyxJQUEzQztBQUNBLFVBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsUUFBUSxLQUFSLEVBQWUsOEJBQWYsRUFBK0MsYUFBL0MsQ0FBeEMsR0FBd0csU0FBeEc7QUFDQSxTQUFPLEtBQVA7QUFDRDs7QUFFRCxTQUFTLGlCQUFULENBQTJCLFlBQTNCLEVBQXlDLEtBQXpDLEVBQWdEO0FBQzlDLFNBQU8sU0FBUyxJQUFULElBQWlCLGFBQWEsZUFBYixJQUFnQyxDQUFDLEtBQWxELElBQTJELGFBQWEsZUFBYixJQUFnQyxNQUFNLEtBQU4sQ0FBM0YsSUFBMkcsYUFBYSx1QkFBYixJQUF3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LFlBQWpCO0FBQ0Q7QUFDRjtBQUNGLEtBYkQsTUFhTyxJQUFJLFlBQVksaUJBQVosQ0FBOEIsSUFBOUIsQ0FBSixFQUF5QztBQUM5QyxXQUFLLGVBQUwsQ0FBcUIsSUFBckI7QUFDRCxLQUZNLE1BRUEsSUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQTdCLEVBQTJDO0FBQ2hELDBCQUFvQixJQUFwQjtBQUNEO0FBQ0Y7O0FBNUl5QixDQUE1Qjs7QUFnSkEsVUFBVSxjQUFWLENBQXlCLHFCQUF6QixFQUFnRCx1QkFBaEQsRUFBeUU7QUFDdkUsdUJBQXFCLHFCQURrRDtBQUV2RSx3QkFBc0Isc0JBRmlEO0FBR3ZFLDBCQUF3QjtBQUgrQyxDQUF6RTs7QUFNQSxPQUFPLE9BQVAsR0FBaUIscUJBQWpCIiwiZmlsZSI6IkRPTVByb3BlcnR5T3BlcmF0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBET01Qcm9wZXJ0eU9wZXJhdGlvbnNcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRE9NUHJvcGVydHkgPSByZXF1aXJlKCcuL0RPTVByb3BlcnR5Jyk7XG52YXIgUmVhY3RQZXJmID0gcmVxdWlyZSgnLi9SZWFjdFBlcmYnKTtcblxudmFyIHF1b3RlQXR0cmlidXRlVmFsdWVGb3JCcm93c2VyID0gcmVxdWlyZSgnLi9xdW90ZUF0dHJpYnV0ZVZhbHVlRm9yQnJvd3NlcicpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbi8vIFNpbXBsaWZpZWQgc3Vic2V0XG52YXIgVkFMSURfQVRUUklCVVRFX05BTUVfUkVHRVggPSAvXlthLXpBLVpfXVtcXHdcXC5cXC1dKiQvO1xudmFyIGlsbGVnYWxBdHRyaWJ1dGVOYW1lQ2FjaGUgPSB7fTtcbnZhciB2YWxpZGF0ZWRBdHRyaWJ1dGVOYW1lQ2FjaGUgPSB7fTtcblxuZnVuY3Rpb24gaXNBdHRyaWJ1dGVOYW1lU2FmZShhdHRyaWJ1dGVOYW1lKSB7XG4gIGlmICh2YWxpZGF0ZWRBdHRyaWJ1dGVOYW1lQ2FjaGUuaGFzT3duUHJvcGVydHkoYXR0cmlidXRlTmFtZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoaWxsZWdhbEF0dHJpYnV0ZU5hbWVDYWNoZS5oYXNPd25Qcm9wZXJ0eShhdHRyaWJ1dGVOYW1lKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoVkFMSURfQVRUUklCVVRFX05BTUVfUkVHRVgudGVzdChhdHRyaWJ1dGVOYW1lKSkge1xuICAgIHZhbGlkYXRlZEF0dHJpYnV0ZU5hbWVDYWNoZVthdHRyaWJ1dGVOYW1lXSA9IHRydWU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWxsZWdhbEF0dHJpYnV0ZU5hbWVDYWNoZVthdHRyaWJ1dGVOYW1lXSA9IHRydWU7XG4gIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnSW52YWxpZCBhdHRyaWJ1dGUgbmFtZTogYCVzYCcsIGF0dHJpYnV0ZU5hbWUpIDogdW5kZWZpbmVkO1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHNob3VsZElnbm9yZVZhbHVlKHByb3BlcnR5SW5mbywgdmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgfHwgcHJvcGVydHlJbmZvLmhhc0Jvb2xlYW5WYWx1ZSAmJiAhdmFsdWUgfHwgcHJvcGVydHlJbmZvLmhhc051bWVyaWNWYWx1ZSAmJiBpc05hTih2YWx1ZSkgfHwgcHJvcGVydHlJbmZvLmhhc1Bvc2l0aXZlTnVtZXJpY1ZhbHVlICYmIHZhbHVlIDwgMSB8fCBwcm9wZXJ0eUluZm8uaGFzT3ZlcmxvYWRlZEJvb2xlYW5WYWx1ZSAmJiB2YWx1ZSA9PT0gZmFsc2U7XG59XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciByZWFjdFByb3BzID0ge1xuICAgIGNoaWxkcmVuOiB0cnVlLFxuICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB0cnVlLFxuICAgIGtleTogdHJ1ZSxcbiAgICByZWY6IHRydWVcbiAgfTtcbiAgdmFyIHdhcm5lZFByb3BlcnRpZXMgPSB7fTtcblxuICB2YXIgd2FyblVua25vd25Qcm9wZXJ0eSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgaWYgKHJlYWN0UHJvcHMuaGFzT3duUHJvcGVydHkobmFtZSkgJiYgcmVhY3RQcm9wc1tuYW1lXSB8fCB3YXJuZWRQcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KG5hbWUpICYmIHdhcm5lZFByb3BlcnRpZXNbbmFtZV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB3YXJuZWRQcm9wZXJ0aWVzW25hbWVdID0gdHJ1ZTtcbiAgICB2YXIgbG93ZXJDYXNlZE5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBkYXRhLSogYXR0cmlidXRlcyBzaG91bGQgYmUgbG93ZXJjYXNlOyBzdWdnZXN0IHRoZSBsb3dlcmNhc2UgdmVyc2lvblxuICAgIHZhciBzdGFuZGFyZE5hbWUgPSBET01Qcm9wZXJ0eS5pc0N1c3RvbUF0dHJpYnV0ZShsb3dlckNhc2VkTmFtZSkgPyBsb3dlckNhc2VkTmFtZSA6IERPTVByb3BlcnR5LmdldFBvc3NpYmxlU3RhbmRhcmROYW1lLmhhc093blByb3BlcnR5KGxvd2VyQ2FzZWROYW1lKSA/IERPTVByb3BlcnR5LmdldFBvc3NpYmxlU3RhbmRhcmROYW1lW2xvd2VyQ2FzZWROYW1lXSA6IG51bGw7XG5cbiAgICAvLyBGb3Igbm93LCBvbmx5IHdhcm4gd2hlbiB3ZSBoYXZlIGEgc3VnZ2VzdGVkIGNvcnJlY3Rpb24uIFRoaXMgcHJldmVudHNcbiAgICAvLyBsb2dnaW5nIHRvbyBtdWNoIHdoZW4gdXNpbmcgdHJhbnNmZXJQcm9wc1RvLlxuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKHN0YW5kYXJkTmFtZSA9PSBudWxsLCAnVW5rbm93biBET00gcHJvcGVydHkgJXMuIERpZCB5b3UgbWVhbiAlcz8nLCBuYW1lLCBzdGFuZGFyZE5hbWUpIDogdW5kZWZpbmVkO1xuICB9O1xufVxuXG4vKipcbiAqIE9wZXJhdGlvbnMgZm9yIGRlYWxpbmcgd2l0aCBET00gcHJvcGVydGllcy5cbiAqL1xudmFyIERPTVByb3BlcnR5T3BlcmF0aW9ucyA9IHtcblxuICAvKipcbiAgICogQ3JlYXRlcyBtYXJrdXAgZm9yIHRoZSBJRCBwcm9wZXJ0eS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFVuZXNjYXBlZCBJRC5cbiAgICogQHJldHVybiB7c3RyaW5nfSBNYXJrdXAgc3RyaW5nLlxuICAgKi9cbiAgY3JlYXRlTWFya3VwRm9ySUQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHJldHVybiBET01Qcm9wZXJ0eS5JRF9BVFRSSUJVVEVfTkFNRSArICc9JyArIHF1b3RlQXR0cmlidXRlVmFsdWVGb3JCcm93c2VyKGlkKTtcbiAgfSxcblxuICBzZXRBdHRyaWJ1dGVGb3JJRDogZnVuY3Rpb24gKG5vZGUsIGlkKSB7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoRE9NUHJvcGVydHkuSURfQVRUUklCVVRFX05BTUUsIGlkKTtcbiAgfSxcblxuICAvKipcbiAgICogQ3JlYXRlcyBtYXJrdXAgZm9yIGEgcHJvcGVydHkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7P3N0cmluZ30gTWFya3VwIHN0cmluZywgb3IgbnVsbCBpZiB0aGUgcHJvcGVydHkgd2FzIGludmFsaWQuXG4gICAqL1xuICBjcmVhdGVNYXJrdXBGb3JQcm9wZXJ0eTogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIHByb3BlcnR5SW5mbyA9IERPTVByb3BlcnR5LnByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBET01Qcm9wZXJ0eS5wcm9wZXJ0aWVzW25hbWVdIDogbnVsbDtcbiAgICBpZiAocHJvcGVydHlJbmZvKSB7XG4gICAgICBpZiAoc2hvdWxkSWdub3JlVmFsdWUocHJvcGVydHlJbmZvLCB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgICAgdmFyIGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eUluZm8uYXR0cmlidXRlTmFtZTtcbiAgICAgIGlmIChwcm9wZXJ0eUluZm8uaGFzQm9vbGVhblZhbHVlIHx8IHByb3BlcnR5SW5mby5oYXNPdmVybG9hZGVkQm9vbGVhblZhbHVlICYmIHZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVOYW1lICsgJz1cIlwiJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBhdHRyaWJ1dGVOYW1lICsgJz0nICsgcXVvdGVBdHRyaWJ1dGVWYWx1ZUZvckJyb3dzZXIodmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoRE9NUHJvcGVydHkuaXNDdXN0b21BdHRyaWJ1dGUobmFtZSkpIHtcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBuYW1lICsgJz0nICsgcXVvdGVBdHRyaWJ1dGVWYWx1ZUZvckJyb3dzZXIodmFsdWUpO1xuICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgd2FyblVua25vd25Qcm9wZXJ0eShuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgbWFya3VwIGZvciBhIGN1c3RvbSBwcm9wZXJ0eS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IE1hcmt1cCBzdHJpbmcsIG9yIGVtcHR5IHN0cmluZyBpZiB0aGUgcHJvcGVydHkgd2FzIGludmFsaWQuXG4gICAqL1xuICBjcmVhdGVNYXJrdXBGb3JDdXN0b21BdHRyaWJ1dGU6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIGlmICghaXNBdHRyaWJ1dGVOYW1lU2FmZShuYW1lKSB8fCB2YWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBuYW1lICsgJz0nICsgcXVvdGVBdHRyaWJ1dGVWYWx1ZUZvckJyb3dzZXIodmFsdWUpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBmb3IgYSBwcm9wZXJ0eSBvbiBhIG5vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gbm9kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqL1xuICBzZXRWYWx1ZUZvclByb3BlcnR5OiBmdW5jdGlvbiAobm9kZSwgbmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgcHJvcGVydHlJbmZvID0gRE9NUHJvcGVydHkucHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA/IERPTVByb3BlcnR5LnByb3BlcnRpZXNbbmFtZV0gOiBudWxsO1xuICAgIGlmIChwcm9wZXJ0eUluZm8pIHtcbiAgICAgIHZhciBtdXRhdGlvbk1ldGhvZCA9IHByb3BlcnR5SW5mby5tdXRhdGlvbk1ldGhvZDtcbiAgICAgIGlmIChtdXRhdGlvbk1ldGhvZCkge1xuICAgICAgICBtdXRhdGlvbk1ldGhvZChub2RlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHNob3VsZElnbm9yZVZhbHVlKHByb3BlcnR5SW5mbywgdmFsdWUpKSB7XG4gICAgICAgIHRoaXMuZGVsZXRlVmFsdWVGb3JQcm9wZXJ0eShub2RlLCBuYW1lKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvcGVydHlJbmZvLm11c3RVc2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU5hbWUgPSBwcm9wZXJ0eUluZm8uYXR0cmlidXRlTmFtZTtcbiAgICAgICAgdmFyIG5hbWVzcGFjZSA9IHByb3BlcnR5SW5mby5hdHRyaWJ1dGVOYW1lc3BhY2U7XG4gICAgICAgIC8vIGBzZXRBdHRyaWJ1dGVgIHdpdGggb2JqZWN0cyBiZWNvbWVzIG9ubHkgYFtvYmplY3RdYCBpbiBJRTgvOSxcbiAgICAgICAgLy8gKCcnICsgdmFsdWUpIG1ha2VzIGl0IG91dHB1dCB0aGUgY29ycmVjdCB0b1N0cmluZygpLXZhbHVlLlxuICAgICAgICBpZiAobmFtZXNwYWNlKSB7XG4gICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGVOUyhuYW1lc3BhY2UsIGF0dHJpYnV0ZU5hbWUsICcnICsgdmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKHByb3BlcnR5SW5mby5oYXNCb29sZWFuVmFsdWUgfHwgcHJvcGVydHlJbmZvLmhhc092ZXJsb2FkZWRCb29sZWFuVmFsdWUgJiYgdmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgJycgKyB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBwcm9wTmFtZSA9IHByb3BlcnR5SW5mby5wcm9wZXJ0eU5hbWU7XG4gICAgICAgIC8vIE11c3QgZXhwbGljaXRseSBjYXN0IHZhbHVlcyBmb3IgSEFTX1NJREVfRUZGRUNUUy1wcm9wZXJ0aWVzIHRvIHRoZVxuICAgICAgICAvLyBwcm9wZXJ0eSB0eXBlIGJlZm9yZSBjb21wYXJpbmc7IG9ubHkgYHZhbHVlYCBkb2VzIGFuZCBpcyBzdHJpbmcuXG4gICAgICAgIGlmICghcHJvcGVydHlJbmZvLmhhc1NpZGVFZmZlY3RzIHx8ICcnICsgbm9kZVtwcm9wTmFtZV0gIT09ICcnICsgdmFsdWUpIHtcbiAgICAgICAgICAvLyBDb250cmFyeSB0byBgc2V0QXR0cmlidXRlYCwgb2JqZWN0IHByb3BlcnRpZXMgYXJlIHByb3Blcmx5XG4gICAgICAgICAgLy8gYHRvU3RyaW5nYGVkIGJ5IElFOC85LlxuICAgICAgICAgIG5vZGVbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKERPTVByb3BlcnR5LmlzQ3VzdG9tQXR0cmlidXRlKG5hbWUpKSB7XG4gICAgICBET01Qcm9wZXJ0eU9wZXJhdGlvbnMuc2V0VmFsdWVGb3JBdHRyaWJ1dGUobm9kZSwgbmFtZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgd2FyblVua25vd25Qcm9wZXJ0eShuYW1lKTtcbiAgICB9XG4gIH0sXG5cbiAgc2V0VmFsdWVGb3JBdHRyaWJ1dGU6IGZ1bmN0aW9uIChub2RlLCBuYW1lLCB2YWx1ZSkge1xuICAgIGlmICghaXNBdHRyaWJ1dGVOYW1lU2FmZShuYW1lKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUuc2V0QXR0cmlidXRlKG5hbWUsICcnICsgdmFsdWUpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlcyB0aGUgdmFsdWUgZm9yIGEgcHJvcGVydHkgb24gYSBub2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IG5vZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICovXG4gIGRlbGV0ZVZhbHVlRm9yUHJvcGVydHk6IGZ1bmN0aW9uIChub2RlLCBuYW1lKSB7XG4gICAgdmFyIHByb3BlcnR5SW5mbyA9IERPTVByb3BlcnR5LnByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBET01Qcm9wZXJ0eS5wcm9wZXJ0aWVzW25hbWVdIDogbnVsbDtcbiAgICBpZiAocHJvcGVydHlJbmZvKSB7XG4gICAgICB2YXIgbXV0YXRpb25NZXRob2QgPSBwcm9wZXJ0eUluZm8ubXV0YXRpb25NZXRob2Q7XG4gICAgICBpZiAobXV0YXRpb25NZXRob2QpIHtcbiAgICAgICAgbXV0YXRpb25NZXRob2Qobm9kZSwgdW5kZWZpbmVkKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvcGVydHlJbmZvLm11c3RVc2VBdHRyaWJ1dGUpIHtcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUocHJvcGVydHlJbmZvLmF0dHJpYnV0ZU5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHByb3BOYW1lID0gcHJvcGVydHlJbmZvLnByb3BlcnR5TmFtZTtcbiAgICAgICAgdmFyIGRlZmF1bHRWYWx1ZSA9IERPTVByb3BlcnR5LmdldERlZmF1bHRWYWx1ZUZvclByb3BlcnR5KG5vZGUubm9kZU5hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgaWYgKCFwcm9wZXJ0eUluZm8uaGFzU2lkZUVmZmVjdHMgfHwgJycgKyBub2RlW3Byb3BOYW1lXSAhPT0gZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgICAgbm9kZVtwcm9wTmFtZV0gPSBkZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKERPTVByb3BlcnR5LmlzQ3VzdG9tQXR0cmlidXRlKG5hbWUpKSB7XG4gICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHdhcm5Vbmtub3duUHJvcGVydHkobmFtZSk7XG4gICAgfVxuICB9XG5cbn07XG5cblJlYWN0UGVyZi5tZWFzdXJlTWV0aG9kcyhET01Qcm9wZXJ0eU9wZXJhdGlvbnMsICdET01Qcm9wZXJ0eU9wZXJhdGlvbnMnLCB7XG4gIHNldFZhbHVlRm9yUHJvcGVydHk6ICdzZXRWYWx1ZUZvclByb3BlcnR5JyxcbiAgc2V0VmFsdWVGb3JBdHRyaWJ1dGU6ICdzZXRWYWx1ZUZvckF0dHJpYnV0ZScsXG4gIGRlbGV0ZVZhbHVlRm9yUHJvcGVydHk6ICdkZWxldGVWYWx1ZUZvclByb3BlcnR5J1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRE9NUHJvcGVydHlPcGVyYXRpb25zOyJdfQ==