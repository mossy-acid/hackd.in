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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0NTU1Byb3BlcnR5T3BlcmF0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLGNBQWMsUUFBUSxlQUFSLENBQWxCO0FBQ0EsSUFBSSx1QkFBdUIsUUFBUSwrQkFBUixDQUEzQjtBQUNBLElBQUksWUFBWSxRQUFRLGFBQVIsQ0FBaEI7O0FBRUEsSUFBSSxvQkFBb0IsUUFBUSw0QkFBUixDQUF4QjtBQUNBLElBQUksc0JBQXNCLFFBQVEsdUJBQVIsQ0FBMUI7QUFDQSxJQUFJLHFCQUFxQixRQUFRLDZCQUFSLENBQXpCO0FBQ0EsSUFBSSxvQkFBb0IsUUFBUSw0QkFBUixDQUF4QjtBQUNBLElBQUksVUFBVSxRQUFRLGtCQUFSLENBQWQ7O0FBRUEsSUFBSSxtQkFBbUIsa0JBQWtCLFVBQVUsU0FBVixFQUFxQjtBQUM1RCxTQUFPLG1CQUFtQixTQUFuQixDQUFQO0FBQ0QsQ0FGc0IsQ0FBdkI7O0FBSUEsSUFBSSwwQkFBMEIsS0FBOUI7QUFDQSxJQUFJLHFCQUFxQixVQUF6QjtBQUNBLElBQUkscUJBQXFCLFNBQXpCLEVBQW9DO0FBQ2xDLE1BQUksWUFBWSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEIsS0FBOUM7QUFDQSxNQUFJOztBQUVGLGNBQVUsSUFBVixHQUFpQixFQUFqQjtBQUNELEdBSEQsQ0FHRSxPQUFPLENBQVAsRUFBVTtBQUNWLDhCQUEwQixJQUExQjtBQUNEOztBQUVELE1BQUksU0FBUyxlQUFULENBQXlCLEtBQXpCLENBQStCLFFBQS9CLEtBQTRDLFNBQWhELEVBQTJEO0FBQ3pELHlCQUFxQixZQUFyQjtBQUNEO0FBQ0Y7O0FBRUQsSUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQTdCLEVBQTJDOztBQUV6QyxNQUFJLDhCQUE4Qix3QkFBbEM7OztBQUdBLE1BQUksb0NBQW9DLE9BQXhDOztBQUVBLE1BQUks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UUFBSSxRQUFRLEtBQUssS0FBakI7QUFDQSxTQUFLLElBQUksU0FBVCxJQUFzQixNQUF0QixFQUE4QjtBQUM1QixVQUFJLENBQUMsT0FBTyxjQUFQLENBQXNCLFNBQXRCLENBQUwsRUFBdUM7QUFDckM7QUFDRDtBQUNELFVBQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUE3QixFQUEyQztBQUN6Qyx1QkFBZSxTQUFmLEVBQTBCLE9BQU8sU0FBUCxDQUExQjtBQUNEO0FBQ0QsVUFBSSxhQUFhLG9CQUFvQixTQUFwQixFQUErQixPQUFPLFNBQVAsQ0FBL0IsQ0FBakI7QUFDQSxVQUFJLGNBQWMsT0FBbEIsRUFBMkI7QUFDekIsb0JBQVksa0JBQVo7QUFDRDtBQUNELFVBQUksVUFBSixFQUFnQjtBQUNkLGNBQU0sU0FBTixJQUFtQixVQUFuQjtBQUNELE9BRkQsTUFFTztBQUNMLFlBQUksWUFBWSwyQkFBMkIsWUFBWSwyQkFBWixDQUF3QyxTQUF4QyxDQUEzQztBQUNBLFlBQUksU0FBSixFQUFlOzs7QUFHYixlQUFLLElBQUksbUJBQVQsSUFBZ0MsU0FBaEMsRUFBMkM7QUFDekMsa0JBQU0sbUJBQU4sSUFBNkIsRUFBN0I7QUFDRDtBQUNGLFNBTkQsTUFNTztBQUNMLGdCQUFNLFNBQU4sSUFBbUIsRUFBbkI7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7QUFuRXlCLENBQTVCOztBQXVFQSxVQUFVLGNBQVYsQ0FBeUIscUJBQXpCLEVBQWdELHVCQUFoRCxFQUF5RTtBQUN2RSxxQkFBbUI7QUFEb0QsQ0FBekU7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLHFCQUFqQiIsImZpbGUiOiJDU1NQcm9wZXJ0eU9wZXJhdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgQ1NTUHJvcGVydHlPcGVyYXRpb25zXG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIENTU1Byb3BlcnR5ID0gcmVxdWlyZSgnLi9DU1NQcm9wZXJ0eScpO1xudmFyIEV4ZWN1dGlvbkVudmlyb25tZW50ID0gcmVxdWlyZSgnZmJqcy9saWIvRXhlY3V0aW9uRW52aXJvbm1lbnQnKTtcbnZhciBSZWFjdFBlcmYgPSByZXF1aXJlKCcuL1JlYWN0UGVyZicpO1xuXG52YXIgY2FtZWxpemVTdHlsZU5hbWUgPSByZXF1aXJlKCdmYmpzL2xpYi9jYW1lbGl6ZVN0eWxlTmFtZScpO1xudmFyIGRhbmdlcm91c1N0eWxlVmFsdWUgPSByZXF1aXJlKCcuL2Rhbmdlcm91c1N0eWxlVmFsdWUnKTtcbnZhciBoeXBoZW5hdGVTdHlsZU5hbWUgPSByZXF1aXJlKCdmYmpzL2xpYi9oeXBoZW5hdGVTdHlsZU5hbWUnKTtcbnZhciBtZW1vaXplU3RyaW5nT25seSA9IHJlcXVpcmUoJ2ZianMvbGliL21lbW9pemVTdHJpbmdPbmx5Jyk7XG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcblxudmFyIHByb2Nlc3NTdHlsZU5hbWUgPSBtZW1vaXplU3RyaW5nT25seShmdW5jdGlvbiAoc3R5bGVOYW1lKSB7XG4gIHJldHVybiBoeXBoZW5hdGVTdHlsZU5hbWUoc3R5bGVOYW1lKTtcbn0pO1xuXG52YXIgaGFzU2hvcnRoYW5kUHJvcGVydHlCdWcgPSBmYWxzZTtcbnZhciBzdHlsZUZsb2F0QWNjZXNzb3IgPSAnY3NzRmxvYXQnO1xuaWYgKEV4ZWN1dGlvbkVudmlyb25tZW50LmNhblVzZURPTSkge1xuICB2YXIgdGVtcFN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jykuc3R5bGU7XG4gIHRyeSB7XG4gICAgLy8gSUU4IHRocm93cyBcIkludmFsaWQgYXJndW1lbnQuXCIgaWYgcmVzZXR0aW5nIHNob3J0aGFuZCBzdHlsZSBwcm9wZXJ0aWVzLlxuICAgIHRlbXBTdHlsZS5mb250ID0gJyc7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBoYXNTaG9ydGhhbmRQcm9wZXJ0eUJ1ZyA9IHRydWU7XG4gIH1cbiAgLy8gSUU4IG9ubHkgc3VwcG9ydHMgYWNjZXNzaW5nIGNzc0Zsb2F0IChzdGFuZGFyZCkgYXMgc3R5bGVGbG9hdFxuICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdHlsZUZsb2F0QWNjZXNzb3IgPSAnc3R5bGVGbG9hdCc7XG4gIH1cbn1cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgLy8gJ21zVHJhbnNmb3JtJyBpcyBjb3JyZWN0LCBidXQgdGhlIG90aGVyIHByZWZpeGVzIHNob3VsZCBiZSBjYXBpdGFsaXplZFxuICB2YXIgYmFkVmVuZG9yZWRTdHlsZU5hbWVQYXR0ZXJuID0gL14oPzp3ZWJraXR8bW96fG8pW0EtWl0vO1xuXG4gIC8vIHN0eWxlIHZhbHVlcyBzaG91bGRuJ3QgY29udGFpbiBhIHNlbWljb2xvblxuICB2YXIgYmFkU3R5bGVWYWx1ZVdpdGhTZW1pY29sb25QYXR0ZXJuID0gLztcXHMqJC87XG5cbiAgdmFyIHdhcm5lZFN0eWxlTmFtZXMgPSB7fTtcbiAgdmFyIHdhcm5lZFN0eWxlVmFsdWVzID0ge307XG5cbiAgdmFyIHdhcm5IeXBoZW5hdGVkU3R5bGVOYW1lID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAod2FybmVkU3R5bGVOYW1lcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSAmJiB3YXJuZWRTdHlsZU5hbWVzW25hbWVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgd2FybmVkU3R5bGVOYW1lc1tuYW1lXSA9IHRydWU7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdVbnN1cHBvcnRlZCBzdHlsZSBwcm9wZXJ0eSAlcy4gRGlkIHlvdSBtZWFuICVzPycsIG5hbWUsIGNhbWVsaXplU3R5bGVOYW1lKG5hbWUpKSA6IHVuZGVmaW5lZDtcbiAgfTtcblxuICB2YXIgd2FybkJhZFZlbmRvcmVkU3R5bGVOYW1lID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAod2FybmVkU3R5bGVOYW1lcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSAmJiB3YXJuZWRTdHlsZU5hbWVzW25hbWVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgd2FybmVkU3R5bGVOYW1lc1tuYW1lXSA9IHRydWU7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdVbnN1cHBvcnRlZCB2ZW5kb3ItcHJlZml4ZWQgc3R5bGUgcHJvcGVydHkgJXMuIERpZCB5b3UgbWVhbiAlcz8nLCBuYW1lLCBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKSkgOiB1bmRlZmluZWQ7XG4gIH07XG5cbiAgdmFyIHdhcm5TdHlsZVZhbHVlV2l0aFNlbWljb2xvbiA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIGlmICh3YXJuZWRTdHlsZVZhbHVlcy5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkgJiYgd2FybmVkU3R5bGVWYWx1ZXNbdmFsdWVdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgd2FybmVkU3R5bGVWYWx1ZXNbdmFsdWVdID0gdHJ1ZTtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ1N0eWxlIHByb3BlcnR5IHZhbHVlcyBzaG91bGRuXFwndCBjb250YWluIGEgc2VtaWNvbG9uLiAnICsgJ1RyeSBcIiVzOiAlc1wiIGluc3RlYWQuJywgbmFtZSwgdmFsdWUucmVwbGFjZShiYWRTdHlsZVZhbHVlV2l0aFNlbWljb2xvblBhdHRlcm4sICcnKSkgOiB1bmRlZmluZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG4gIHZhciB3YXJuVmFsaWRTdHlsZSA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIGlmIChuYW1lLmluZGV4T2YoJy0nKSA+IC0xKSB7XG4gICAgICB3YXJuSHlwaGVuYXRlZFN0eWxlTmFtZShuYW1lKTtcbiAgICB9IGVsc2UgaWYgKGJhZFZlbmRvcmVkU3R5bGVOYW1lUGF0dGVybi50ZXN0KG5hbWUpKSB7XG4gICAgICB3YXJuQmFkVmVuZG9yZWRTdHlsZU5hbWUobmFtZSk7XG4gICAgfSBlbHNlIGlmIChiYWRTdHlsZVZhbHVlV2l0aFNlbWljb2xvblBhdHRlcm4udGVzdCh2YWx1ZSkpIHtcbiAgICAgIHdhcm5TdHlsZVZhbHVlV2l0aFNlbWljb2xvbihuYW1lLCB2YWx1ZSk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIE9wZXJhdGlvbnMgZm9yIGRlYWxpbmcgd2l0aCBDU1MgcHJvcGVydGllcy5cbiAqL1xudmFyIENTU1Byb3BlcnR5T3BlcmF0aW9ucyA9IHtcblxuICAvKipcbiAgICogU2VyaWFsaXplcyBhIG1hcHBpbmcgb2Ygc3R5bGUgcHJvcGVydGllcyBmb3IgdXNlIGFzIGlubGluZSBzdHlsZXM6XG4gICAqXG4gICAqICAgPiBjcmVhdGVNYXJrdXBGb3JTdHlsZXMoe3dpZHRoOiAnMjAwcHgnLCBoZWlnaHQ6IDB9KVxuICAgKiAgIFwid2lkdGg6MjAwcHg7aGVpZ2h0OjA7XCJcbiAgICpcbiAgICogVW5kZWZpbmVkIHZhbHVlcyBhcmUgaWdub3JlZCBzbyB0aGF0IGRlY2xhcmF0aXZlIHByb2dyYW1taW5nIGlzIGVhc2llci5cbiAgICogVGhlIHJlc3VsdCBzaG91bGQgYmUgSFRNTC1lc2NhcGVkIGJlZm9yZSBpbnNlcnRpb24gaW50byB0aGUgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gc3R5bGVzXG4gICAqIEByZXR1cm4gez9zdHJpbmd9XG4gICAqL1xuICBjcmVhdGVNYXJrdXBGb3JTdHlsZXM6IGZ1bmN0aW9uIChzdHlsZXMpIHtcbiAgICB2YXIgc2VyaWFsaXplZCA9ICcnO1xuICAgIGZvciAodmFyIHN0eWxlTmFtZSBpbiBzdHlsZXMpIHtcbiAgICAgIGlmICghc3R5bGVzLmhhc093blByb3BlcnR5KHN0eWxlTmFtZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2YXIgc3R5bGVWYWx1ZSA9IHN0eWxlc1tzdHlsZU5hbWVdO1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgd2FyblZhbGlkU3R5bGUoc3R5bGVOYW1lLCBzdHlsZVZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHlsZVZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgc2VyaWFsaXplZCArPSBwcm9jZXNzU3R5bGVOYW1lKHN0eWxlTmFtZSkgKyAnOic7XG4gICAgICAgIHNlcmlhbGl6ZWQgKz0gZGFuZ2Vyb3VzU3R5bGVWYWx1ZShzdHlsZU5hbWUsIHN0eWxlVmFsdWUpICsgJzsnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2VyaWFsaXplZCB8fCBudWxsO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBmb3IgbXVsdGlwbGUgc3R5bGVzIG9uIGEgbm9kZS4gIElmIGEgdmFsdWUgaXMgc3BlY2lmaWVkIGFzXG4gICAqICcnIChlbXB0eSBzdHJpbmcpLCB0aGUgY29ycmVzcG9uZGluZyBzdHlsZSBwcm9wZXJ0eSB3aWxsIGJlIHVuc2V0LlxuICAgKlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IG5vZGVcbiAgICogQHBhcmFtIHtvYmplY3R9IHN0eWxlc1xuICAgKi9cbiAgc2V0VmFsdWVGb3JTdHlsZXM6IGZ1bmN0aW9uIChub2RlLCBzdHlsZXMpIHtcbiAgICB2YXIgc3R5bGUgPSBub2RlLnN0eWxlO1xuICAgIGZvciAodmFyIHN0eWxlTmFtZSBpbiBzdHlsZXMpIHtcbiAgICAgIGlmICghc3R5bGVzLmhhc093blByb3BlcnR5KHN0eWxlTmFtZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB3YXJuVmFsaWRTdHlsZShzdHlsZU5hbWUsIHN0eWxlc1tzdHlsZU5hbWVdKTtcbiAgICAgIH1cbiAgICAgIHZhciBzdHlsZVZhbHVlID0gZGFuZ2Vyb3VzU3R5bGVWYWx1ZShzdHlsZU5hbWUsIHN0eWxlc1tzdHlsZU5hbWVdKTtcbiAgICAgIGlmIChzdHlsZU5hbWUgPT09ICdmbG9hdCcpIHtcbiAgICAgICAgc3R5bGVOYW1lID0gc3R5bGVGbG9hdEFjY2Vzc29yO1xuICAgICAgfVxuICAgICAgaWYgKHN0eWxlVmFsdWUpIHtcbiAgICAgICAgc3R5bGVbc3R5bGVOYW1lXSA9IHN0eWxlVmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZXhwYW5zaW9uID0gaGFzU2hvcnRoYW5kUHJvcGVydHlCdWcgJiYgQ1NTUHJvcGVydHkuc2hvcnRoYW5kUHJvcGVydHlFeHBhbnNpb25zW3N0eWxlTmFtZV07XG4gICAgICAgIGlmIChleHBhbnNpb24pIHtcbiAgICAgICAgICAvLyBTaG9ydGhhbmQgcHJvcGVydHkgdGhhdCBJRTggd29uJ3QgbGlrZSB1bnNldHRpbmcsIHNvIHVuc2V0IGVhY2hcbiAgICAgICAgICAvLyBjb21wb25lbnQgdG8gcGxhY2F0ZSBpdFxuICAgICAgICAgIGZvciAodmFyIGluZGl2aWR1YWxTdHlsZU5hbWUgaW4gZXhwYW5zaW9uKSB7XG4gICAgICAgICAgICBzdHlsZVtpbmRpdmlkdWFsU3R5bGVOYW1lXSA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHlsZVtzdHlsZU5hbWVdID0gJyc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcblxuUmVhY3RQZXJmLm1lYXN1cmVNZXRob2RzKENTU1Byb3BlcnR5T3BlcmF0aW9ucywgJ0NTU1Byb3BlcnR5T3BlcmF0aW9ucycsIHtcbiAgc2V0VmFsdWVGb3JTdHlsZXM6ICdzZXRWYWx1ZUZvclN0eWxlcydcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENTU1Byb3BlcnR5T3BlcmF0aW9uczsiXX0=