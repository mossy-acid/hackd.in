/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CSSPropertyOperations
 * @typechecks static-only
 */

'use strict';

var CSSProperty = require('./CSSProperty');
var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');
var ReactPerf = require('./ReactPerf');

var camelizeStyleName = require('fbjs/lib/camelizeStyleName');
var dangerousStyleValue = require('./dangerousStyleValue');
var hyphenateStyleName = require('fbjs/lib/hyphenateStyleName');
var memoizeStringOnly = require('fbjs/lib/memoizeStringOnly');
var warning = require('fbjs/lib/warning');

var processStyleName = memoizeStringOnly(function (styleName) {
  return hyphenateStyleName(styleName);
});

var hasShorthandPropertyBug = false;
var styleFloatAccessor = 'cssFloat';
if (ExecutionEnvironment.canUseDOM) {
  var tempStyle = document.createElement('div').style;
  try {
    // IE8 throws "Invalid argument." if resetting shorthand style properties.
    tempStyle.font = '';
  } catch (e) {
    hasShorthandPropertyBug = true;
  }
  // IE8 only supports accessing cssFloat (standard) as styleFloat
  if (document.documentElement.style.cssFloat === undefined) {
    styleFloatAccessor = 'styleFloat';
  }
}

if (process.env.NODE_ENV !== 'production') {
  // 'msTransform' is correct, but the other prefixes should be capitalized
  var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;

  // style values shouldn't contain a semicolon
  var badStyleValueWithSemicolonPattern = /;\s*$/;

  var warnedStyleNames = {};
  var warnedStyleValues = {};

  var warnHyphenatedStyleName = function warnHyphenatedStyleName(name) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    process.env.NODE_ENV !== 'production' ? warning(false, 'Unsupported style property %s. Did you mean %s?', name, camelizeStyleName(name)) : undefined;
  };

  var warnBadVendoredStyleName = function warnBadVendoredStyleName(name) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    process.env.NODE_ENV !== 'production' ? warning(false, 'Unsupported vendor-prefixed style property %s. Did you mean %s?', name, name.charAt(0).toUpperCase() + name.slice(1)) : undefined;
  };

  var warnStyleValueWithSemicolon = function warnStyleValueWithSemicolon(name, value) {
    if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
      return;
    }

    warnedStyleValues[value] = true;
    process.env.NODE_ENV !== 'production' ? warning(false, 'Style property values shouldn\'t contain a semicolon. ' + 'Try "%s: %s" instead.', name, value.replace(badStyleValueWithSemicolonPattern, '')) : undefined;
  };

  /**
   * @param {string} name
   * @param {*} value
   */
  var warnValidStyle = function warnValidStyle(name, value) {
    if (name.indexOf('-') > -1) {
      warnHyphenatedStyleName(name);
    } else if (badVendoredStyleNamePattern.test(name)) {
      warnBadVendoredStyleName(name);
    } else if (badStyleValueWithSemicolonPattern.test(value)) {
      warnStyleValueWithSemicolon(name, value);
    }
  };
}

/**
 * Operations for dealing with CSS properties.
 */
var CSSPropertyOperations = {

  /**
   * Serializes a mapping of style properties for use as inline styles:
   *
   *   > createMarkupForStyles({width: '200px', height: 0})
   *   "width:200px;height:0;"
   *
   * Undefined values are ignored so that declarative programming is easier.
   * The result should be HTML-escaped before insertion into the DOM.
   *
   * @param {object} styles
   * @return {?string}
   */
  createMarkupForStyles: function createMarkupForStyles(styles) {
    var serialized = '';
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      var styleValue = styles[styleName];
      if (process.env.NODE_ENV !== 'production') {
        warnValidStyle(styleName, styleValue);
      }
      if (styleValue != null) {
        serialized += processStyleName(styleName) + ':';
        serialized += dangerousStyleValue(styleName, styleValue) + ';';
      }
    }
    return serialized || null;
  },

  /**
   * Sets the value for multiple styles on a node.  If a value is specified as
   * '' (empty string), the corresponding style property will be unset.
   *
   * @param {DOMElement} node
   * @param {object} styles
   */
  setValueForStyles: function setValueForStyles(node, styles) {
    var style = node.style;
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      if (process.env.NODE_ENV !== 'production') {
        warnValidStyle(styleName, styles[styleName]);
      }
      var styleValue = dangerousStyleValue(styleName, styles[styleName]);
      if (styleName === 'float') {
        styleName = styleFloatAccessor;
      }
      if (styleValue) {
        style[styleName] = styleValue;
      } else {
        var expansion = hasShorthandPropertyBug && CSSProperty.shorthandPropertyExpansions[styleName];
        if (expansion) {
          // Shorthand property that IE8 won't like unsetting, so unset each
          // component to placate it
          for (var individualStyleName in expansion) {
            style[individualStyleName] = '';
          }
        } else {
          style[styleName] = '';
        }
      }
    }
  }

};

ReactPerf.measureMethods(CSSPropertyOperations, 'CSSPropertyOperations', {
  setValueForStyles: 'setValueForStyles'
});

module.exports = CSSPropertyOperations;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0NTU1Byb3BlcnR5T3BlcmF0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLGNBQWMsUUFBUSxlQUFSLENBQWQ7QUFDSixJQUFJLHVCQUF1QixRQUFRLCtCQUFSLENBQXZCO0FBQ0osSUFBSSxZQUFZLFFBQVEsYUFBUixDQUFaOztBQUVKLElBQUksb0JBQW9CLFFBQVEsNEJBQVIsQ0FBcEI7QUFDSixJQUFJLHNCQUFzQixRQUFRLHVCQUFSLENBQXRCO0FBQ0osSUFBSSxxQkFBcUIsUUFBUSw2QkFBUixDQUFyQjtBQUNKLElBQUksb0JBQW9CLFFBQVEsNEJBQVIsQ0FBcEI7QUFDSixJQUFJLFVBQVUsUUFBUSxrQkFBUixDQUFWOztBQUVKLElBQUksbUJBQW1CLGtCQUFrQixVQUFVLFNBQVYsRUFBcUI7QUFDNUQsU0FBTyxtQkFBbUIsU0FBbkIsQ0FBUCxDQUQ0RDtDQUFyQixDQUFyQzs7QUFJSixJQUFJLDBCQUEwQixLQUExQjtBQUNKLElBQUkscUJBQXFCLFVBQXJCO0FBQ0osSUFBSSxxQkFBcUIsU0FBckIsRUFBZ0M7QUFDbEMsTUFBSSxZQUFZLFNBQVMsYUFBVCxDQUF1QixLQUF2QixFQUE4QixLQUE5QixDQURrQjtBQUVsQyxNQUFJOztBQUVGLGNBQVUsSUFBVixHQUFpQixFQUFqQixDQUZFO0dBQUosQ0FHRSxPQUFPLENBQVAsRUFBVTtBQUNWLDhCQUEwQixJQUExQixDQURVO0dBQVY7O0FBTGdDLE1BUzlCLFNBQVMsZUFBVCxDQUF5QixLQUF6QixDQUErQixRQUEvQixLQUE0QyxTQUE1QyxFQUF1RDtBQUN6RCx5QkFBcUIsWUFBckIsQ0FEeUQ7R0FBM0Q7Q0FURjs7QUFjQSxJQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsRUFBdUM7O0FBRXpDLE1BQUksOEJBQThCLHdCQUE5Qjs7O0FBRnFDLE1BS3JDLG9DQUFv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QWpCIiwiZmlsZSI6IkNTU1Byb3BlcnR5T3BlcmF0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBDU1NQcm9wZXJ0eU9wZXJhdGlvbnNcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ1NTUHJvcGVydHkgPSByZXF1aXJlKCcuL0NTU1Byb3BlcnR5Jyk7XG52YXIgRXhlY3V0aW9uRW52aXJvbm1lbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9FeGVjdXRpb25FbnZpcm9ubWVudCcpO1xudmFyIFJlYWN0UGVyZiA9IHJlcXVpcmUoJy4vUmVhY3RQZXJmJyk7XG5cbnZhciBjYW1lbGl6ZVN0eWxlTmFtZSA9IHJlcXVpcmUoJ2ZianMvbGliL2NhbWVsaXplU3R5bGVOYW1lJyk7XG52YXIgZGFuZ2Vyb3VzU3R5bGVWYWx1ZSA9IHJlcXVpcmUoJy4vZGFuZ2Vyb3VzU3R5bGVWYWx1ZScpO1xudmFyIGh5cGhlbmF0ZVN0eWxlTmFtZSA9IHJlcXVpcmUoJ2ZianMvbGliL2h5cGhlbmF0ZVN0eWxlTmFtZScpO1xudmFyIG1lbW9pemVTdHJpbmdPbmx5ID0gcmVxdWlyZSgnZmJqcy9saWIvbWVtb2l6ZVN0cmluZ09ubHknKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG52YXIgcHJvY2Vzc1N0eWxlTmFtZSA9IG1lbW9pemVTdHJpbmdPbmx5KGZ1bmN0aW9uIChzdHlsZU5hbWUpIHtcbiAgcmV0dXJuIGh5cGhlbmF0ZVN0eWxlTmFtZShzdHlsZU5hbWUpO1xufSk7XG5cbnZhciBoYXNTaG9ydGhhbmRQcm9wZXJ0eUJ1ZyA9IGZhbHNlO1xudmFyIHN0eWxlRmxvYXRBY2Nlc3NvciA9ICdjc3NGbG9hdCc7XG5pZiAoRXhlY3V0aW9uRW52aXJvbm1lbnQuY2FuVXNlRE9NKSB7XG4gIHZhciB0ZW1wU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKS5zdHlsZTtcbiAgdHJ5IHtcbiAgICAvLyBJRTggdGhyb3dzIFwiSW52YWxpZCBhcmd1bWVudC5cIiBpZiByZXNldHRpbmcgc2hvcnRoYW5kIHN0eWxlIHByb3BlcnRpZXMuXG4gICAgdGVtcFN0eWxlLmZvbnQgPSAnJztcbiAgfSBjYXRjaCAoZSkge1xuICAgIGhhc1Nob3J0aGFuZFByb3BlcnR5QnVnID0gdHJ1ZTtcbiAgfVxuICAvLyBJRTggb25seSBzdXBwb3J0cyBhY2Nlc3NpbmcgY3NzRmxvYXQgKHN0YW5kYXJkKSBhcyBzdHlsZUZsb2F0XG4gIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuY3NzRmxvYXQgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0eWxlRmxvYXRBY2Nlc3NvciA9ICdzdHlsZUZsb2F0JztcbiAgfVxufVxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAvLyAnbXNUcmFuc2Zvcm0nIGlzIGNvcnJlY3QsIGJ1dCB0aGUgb3RoZXIgcHJlZml4ZXMgc2hvdWxkIGJlIGNhcGl0YWxpemVkXG4gIHZhciBiYWRWZW5kb3JlZFN0eWxlTmFtZVBhdHRlcm4gPSAvXig/OndlYmtpdHxtb3p8bylbQS1aXS87XG5cbiAgLy8gc3R5bGUgdmFsdWVzIHNob3VsZG4ndCBjb250YWluIGEgc2VtaWNvbG9uXG4gIHZhciBiYWRTdHlsZVZhbHVlV2l0aFNlbWljb2xvblBhdHRlcm4gPSAvO1xccyokLztcblxuICB2YXIgd2FybmVkU3R5bGVOYW1lcyA9IHt9O1xuICB2YXIgd2FybmVkU3R5bGVWYWx1ZXMgPSB7fTtcblxuICB2YXIgd2Fybkh5cGhlbmF0ZWRTdHlsZU5hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmICh3YXJuZWRTdHlsZU5hbWVzLmhhc093blByb3BlcnR5KG5hbWUpICYmIHdhcm5lZFN0eWxlTmFtZXNbbmFtZV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB3YXJuZWRTdHlsZU5hbWVzW25hbWVdID0gdHJ1ZTtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ1Vuc3VwcG9ydGVkIHN0eWxlIHByb3BlcnR5ICVzLiBEaWQgeW91IG1lYW4gJXM/JywgbmFtZSwgY2FtZWxpemVTdHlsZU5hbWUobmFtZSkpIDogdW5kZWZpbmVkO1xuICB9O1xuXG4gIHZhciB3YXJuQmFkVmVuZG9yZWRTdHlsZU5hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmICh3YXJuZWRTdHlsZU5hbWVzLmhhc093blByb3BlcnR5KG5hbWUpICYmIHdhcm5lZFN0eWxlTmFtZXNbbmFtZV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB3YXJuZWRTdHlsZU5hbWVzW25hbWVdID0gdHJ1ZTtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ1Vuc3VwcG9ydGVkIHZlbmRvci1wcmVmaXhlZCBzdHlsZSBwcm9wZXJ0eSAlcy4gRGlkIHlvdSBtZWFuICVzPycsIG5hbWUsIG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpKSA6IHVuZGVmaW5lZDtcbiAgfTtcblxuICB2YXIgd2FyblN0eWxlVmFsdWVXaXRoU2VtaWNvbG9uID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKHdhcm5lZFN0eWxlVmFsdWVzLmhhc093blByb3BlcnR5KHZhbHVlKSAmJiB3YXJuZWRTdHlsZVZhbHVlc1t2YWx1ZV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB3YXJuZWRTdHlsZVZhbHVlc1t2YWx1ZV0gPSB0cnVlO1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnU3R5bGUgcHJvcGVydHkgdmFsdWVzIHNob3VsZG5cXCd0IGNvbnRhaW4gYSBzZW1pY29sb24uICcgKyAnVHJ5IFwiJXM6ICVzXCIgaW5zdGVhZC4nLCBuYW1lLCB2YWx1ZS5yZXBsYWNlKGJhZFN0eWxlVmFsdWVXaXRoU2VtaWNvbG9uUGF0dGVybiwgJycpKSA6IHVuZGVmaW5lZDtcbiAgfTtcblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKi9cbiAgdmFyIHdhcm5WYWxpZFN0eWxlID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKG5hbWUuaW5kZXhPZignLScpID4gLTEpIHtcbiAgICAgIHdhcm5IeXBoZW5hdGVkU3R5bGVOYW1lKG5hbWUpO1xuICAgIH0gZWxzZSBpZiAoYmFkVmVuZG9yZWRTdHlsZU5hbWVQYXR0ZXJuLnRlc3QobmFtZSkpIHtcbiAgICAgIHdhcm5CYWRWZW5kb3JlZFN0eWxlTmFtZShuYW1lKTtcbiAgICB9IGVsc2UgaWYgKGJhZFN0eWxlVmFsdWVXaXRoU2VtaWNvbG9uUGF0dGVybi50ZXN0KHZhbHVlKSkge1xuICAgICAgd2FyblN0eWxlVmFsdWVXaXRoU2VtaWNvbG9uKG5hbWUsIHZhbHVlKTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogT3BlcmF0aW9ucyBmb3IgZGVhbGluZyB3aXRoIENTUyBwcm9wZXJ0aWVzLlxuICovXG52YXIgQ1NTUHJvcGVydHlPcGVyYXRpb25zID0ge1xuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIGEgbWFwcGluZyBvZiBzdHlsZSBwcm9wZXJ0aWVzIGZvciB1c2UgYXMgaW5saW5lIHN0eWxlczpcbiAgICpcbiAgICogICA+IGNyZWF0ZU1hcmt1cEZvclN0eWxlcyh7d2lkdGg6ICcyMDBweCcsIGhlaWdodDogMH0pXG4gICAqICAgXCJ3aWR0aDoyMDBweDtoZWlnaHQ6MDtcIlxuICAgKlxuICAgKiBVbmRlZmluZWQgdmFsdWVzIGFyZSBpZ25vcmVkIHNvIHRoYXQgZGVjbGFyYXRpdmUgcHJvZ3JhbW1pbmcgaXMgZWFzaWVyLlxuICAgKiBUaGUgcmVzdWx0IHNob3VsZCBiZSBIVE1MLWVzY2FwZWQgYmVmb3JlIGluc2VydGlvbiBpbnRvIHRoZSBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzdHlsZXNcbiAgICogQHJldHVybiB7P3N0cmluZ31cbiAgICovXG4gIGNyZWF0ZU1hcmt1cEZvclN0eWxlczogZnVuY3Rpb24gKHN0eWxlcykge1xuICAgIHZhciBzZXJpYWxpemVkID0gJyc7XG4gICAgZm9yICh2YXIgc3R5bGVOYW1lIGluIHN0eWxlcykge1xuICAgICAgaWYgKCFzdHlsZXMuaGFzT3duUHJvcGVydHkoc3R5bGVOYW1lKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHZhciBzdHlsZVZhbHVlID0gc3R5bGVzW3N0eWxlTmFtZV07XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB3YXJuVmFsaWRTdHlsZShzdHlsZU5hbWUsIHN0eWxlVmFsdWUpO1xuICAgICAgfVxuICAgICAgaWYgKHN0eWxlVmFsdWUgIT0gbnVsbCkge1xuICAgICAgICBzZXJpYWxpemVkICs9IHByb2Nlc3NTdHlsZU5hbWUoc3R5bGVOYW1lKSArICc6JztcbiAgICAgICAgc2VyaWFsaXplZCArPSBkYW5nZXJvdXNTdHlsZVZhbHVlKHN0eWxlTmFtZSwgc3R5bGVWYWx1ZSkgKyAnOyc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZXJpYWxpemVkIHx8IG51bGw7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIGZvciBtdWx0aXBsZSBzdHlsZXMgb24gYSBub2RlLiAgSWYgYSB2YWx1ZSBpcyBzcGVjaWZpZWQgYXNcbiAgICogJycgKGVtcHR5IHN0cmluZyksIHRoZSBjb3JyZXNwb25kaW5nIHN0eWxlIHByb3BlcnR5IHdpbGwgYmUgdW5zZXQuXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gbm9kZVxuICAgKiBAcGFyYW0ge29iamVjdH0gc3R5bGVzXG4gICAqL1xuICBzZXRWYWx1ZUZvclN0eWxlczogZnVuY3Rpb24gKG5vZGUsIHN0eWxlcykge1xuICAgIHZhciBzdHlsZSA9IG5vZGUuc3R5bGU7XG4gICAgZm9yICh2YXIgc3R5bGVOYW1lIGluIHN0eWxlcykge1xuICAgICAgaWYgKCFzdHlsZXMuaGFzT3duUHJvcGVydHkoc3R5bGVOYW1lKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIHdhcm5WYWxpZFN0eWxlKHN0eWxlTmFtZSwgc3R5bGVzW3N0eWxlTmFtZV0pO1xuICAgICAgfVxuICAgICAgdmFyIHN0eWxlVmFsdWUgPSBkYW5nZXJvdXNTdHlsZVZhbHVlKHN0eWxlTmFtZSwgc3R5bGVzW3N0eWxlTmFtZV0pO1xuICAgICAgaWYgKHN0eWxlTmFtZSA9PT0gJ2Zsb2F0Jykge1xuICAgICAgICBzdHlsZU5hbWUgPSBzdHlsZUZsb2F0QWNjZXNzb3I7XG4gICAgICB9XG4gICAgICBpZiAoc3R5bGVWYWx1ZSkge1xuICAgICAgICBzdHlsZVtzdHlsZU5hbWVdID0gc3R5bGVWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBleHBhbnNpb24gPSBoYXNTaG9ydGhhbmRQcm9wZXJ0eUJ1ZyAmJiBDU1NQcm9wZXJ0eS5zaG9ydGhhbmRQcm9wZXJ0eUV4cGFuc2lvbnNbc3R5bGVOYW1lXTtcbiAgICAgICAgaWYgKGV4cGFuc2lvbikge1xuICAgICAgICAgIC8vIFNob3J0aGFuZCBwcm9wZXJ0eSB0aGF0IElFOCB3b24ndCBsaWtlIHVuc2V0dGluZywgc28gdW5zZXQgZWFjaFxuICAgICAgICAgIC8vIGNvbXBvbmVudCB0byBwbGFjYXRlIGl0XG4gICAgICAgICAgZm9yICh2YXIgaW5kaXZpZHVhbFN0eWxlTmFtZSBpbiBleHBhbnNpb24pIHtcbiAgICAgICAgICAgIHN0eWxlW2luZGl2aWR1YWxTdHlsZU5hbWVdID0gJyc7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0eWxlW3N0eWxlTmFtZV0gPSAnJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuXG5SZWFjdFBlcmYubWVhc3VyZU1ldGhvZHMoQ1NTUHJvcGVydHlPcGVyYXRpb25zLCAnQ1NTUHJvcGVydHlPcGVyYXRpb25zJywge1xuICBzZXRWYWx1ZUZvclN0eWxlczogJ3NldFZhbHVlRm9yU3R5bGVzJ1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ1NTUHJvcGVydHlPcGVyYXRpb25zOyJdfQ==