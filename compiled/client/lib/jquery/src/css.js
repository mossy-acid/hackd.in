"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(["./core", "./var/pnum", "./core/access", "./css/var/rmargin", "./var/document", "./var/rcssNum", "./css/var/rnumnonpx", "./css/var/cssExpand", "./css/var/isHidden", "./css/var/getStyles", "./css/var/swap", "./css/curCSS", "./css/adjustCSS", "./css/defaultDisplay", "./css/addGetHookIf", "./css/support", "./data/var/dataPriv", "./core/init", "./core/ready", "./selector" // contains
], function (jQuery, pnum, access, rmargin, document, rcssNum, rnumnonpx, cssExpand, isHidden, getStyles, swap, curCSS, adjustCSS, defaultDisplay, addGetHookIf, support, dataPriv) {

	var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	    cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},
	    cssPrefixes = ["Webkit", "O", "Moz", "ms"],
	    emptyStyle = document.createElement("div").style;

	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName(name) {

		// Shortcut for names that are not vendor prefixed
		if (name in emptyStyle) {
			return name;
		}

		// Check for vendor prefixed names
		var capName = name[0].toUpperCase() + name.slice(1),
		    i = cssPrefixes.length;

		while (i--) {
			name = cssPrefixes[i] + capName;
			if (name in emptyStyle) {
				return name;
			}
		}
	}

	function setPositiveNumber(elem, value, subtract) {

		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec(value);
		return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value;
	}

	function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
		var i = extra === (isBorderBox ? "border" : "content") ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,
		    val = 0;

		for (; i < 4; i += 2) {

			// Both box models exclude margin, so add it if we want it
			if (extra === "margin") {
				val += jQuery.css(elem, extra + cssExpand[i], true, styles);
			}

			if (isBorderBox) {

				// border-box includes padding, so remove it if we want content
				if (extra === "content") {
					val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
				}

				// At this point, extra isn't border nor margin, so remove border
				if (extra !== "margin") {
					val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			} else {

				// At this point, extra isn't content, so add padding
				val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

				// At this point, extra isn't content nor padding, so add border
				if (extra !== "padding") {
					val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			}
		}

		return val;
	}

	function getWidthOrHeight(elem, name, extra) {

		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
		    val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		    styles = getStyles(elem),
		    isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";

		// Some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if (val <= 0 || val == null) {

			// Fall back to computed then uncomputed css if necessary
			val = curCSS(elem, name, styles);
			if (val < 0 || val == null) {
				val = elem.style[name];
			}

			// Computed unit is not pixels. Stop here and return.
			if (rnumnonpx.test(val)) {
				return val;
			}

			// Check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);

			// Normalize "", auto, and prepare for extra
			val = parseFloat(val) || 0;
		}

		// Use the active box-sizing model to add/subtract irrelevant styles
		return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
	}

	function showHide(elements, show) {
		var display,
		    elem,
		    hidden,
		    values = [],
		    index = 0,
		    length = elements.length;

		for (; index < length; index++) {
			elem = elements[index];
			if (!elem.style) {
				continue;
			}

			values[index] = dataPriv.get(elem, "olddisplay");
			display = elem.style.display;
			if (show) {

				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if (!values[index] && display === "none") {
					elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if (elem.style.display === "" && isHidden(elem)) {
					values[index] = dataPriv.access(elem, "olddisplay", defaultDisplay(elem.nodeName));
				}
			} else {
				hidden = isHidden(elem);

				if (display !== "none" || !hidden) {
					dataPriv.set(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
				}
			}
		}

		// Set the display of most of the elements in a second loop
		// to avoid the constant reflow
		for (index = 0; index < length; index++) {
			elem = elements[index];
			if (!elem.style) {
				continue;
			}
			if (!show || elem.style.display === "none" || elem.style.display === "") {
				elem.style.display = show ? values[index] || "" : "none";
			}
		}

		return elements;
	}

	jQuery.extend({

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function get(elem, computed) {
					if (computed) {

						// We should always get a number back from opacity
						var ret = curCSS(elem, "opacity");
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},

		// Get and set the style property on a DOM Node
		style: function style(elem, name, value, extra) {

			// Don't set styles on text and comment nodes
			if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
				return;
			}

			// Make sure that we're working with the right name
			var ret,
			    type,
			    hooks,
			    origName = jQuery.camelCase(name),
			    style = elem.style;

			name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(origName) || origName);

			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			// Check if we're setting a value
			if (value !== undefined) {
				type = typeof value === "undefined" ? "undefined" : _typeof(value);

				// Convert "+=" or "-=" to relative numbers (#7345)
				if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
					value = adjustCSS(elem, name, ret);

					// Fixes bug #9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set (#7116)
				if (value == null || value !== value) {
					return;
				}

				// If a number was passed in, add the unit (except for certain CSS properties)
				if (type === "number") {
					value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
				}

				// Support: IE9-11+
				// background-* props affect original clone's values
				if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
					style[name] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {

					style[name] = value;
				}
			} else {

				// If a hook was provided get the non-computed value from there
				if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {

					return ret;
				}

				// Otherwise just get the value from the style object
				return style[name];
			}
		},

		css: function css(elem, name, extra, styles) {
			var val,
			    num,
			    hooks,
			    origName = jQuery.camelCase(name);

			// Make sure that we're working with the right name
			name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(origName) || origName);

			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			// If a hook was provided get the computed value from there
			if (hooks && "get" in hooks) {
				val = hooks.get(elem, true, extra);
			}

			// Otherwise, if a way to get the computed value exists, use that
			if (val === undefined) {
				val = curCSS(elem, name, styles);
			}

			// Convert "normal" to computed value
			if (val === "normal" && name in cssNormalTransform) {
				val = cssNormalTransform[name];
			}

			// Make numeric if forced or a qualifier was provided and val looks numeric
			if (extra === "" || extra) {
				num = parseFloat(val);
				return extra === true || isFinite(num) ? num || 0 : val;
			}
			return val;
		}
	});

	jQuery.each(["height", "width"], function (i, name) {
		jQuery.cssHooks[name] = {
			get: function get(elem, computed, extra) {
				if (computed) {

					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test(jQuery.css(elem, "display")) && elem.offsetWidth === 0 ? swap(elem, cssShow, function () {
						return getWidthOrHeight(elem, name, extra);
					}) : getWidthOrHeight(elem, name, extra);
				}
			},

			set: function set(elem, value, extra) {
				var matches,
				    styles = extra && getStyles(elem),
				    subtract = extra && augmentWidthOrHeight(elem, name, extra, jQuery.css(elem, "boxSizing", false, styles) === "border-box", styles);

				// Convert to pixels if value adjustment is needed
				if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {

					elem.style[name] = value;
					value = jQuery.css(elem, name);
				}

				return setPositiveNumber(elem, value, subtract);
			}
		};
	});

	jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function (elem, computed) {
		if (computed) {
			return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function () {
				return elem.getBoundingClientRect().left;
			})) + "px";
		}
	});

	// Support: Android 2.3
	jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function (elem, computed) {
		if (computed) {
			return swap(elem, { "display": "inline-block" }, curCSS, [elem, "marginRight"]);
		}
	});

	// These hooks are used by animate to expand properties
	jQuery.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function (prefix, suffix) {
		jQuery.cssHooks[prefix + suffix] = {
			expand: function expand(value) {
				var i = 0,
				    expanded = {},


				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [value];

				for (; i < 4; i++) {
					expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
				}

				return expanded;
			}
		};

		if (!rmargin.test(prefix)) {
			jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
		}
	});

	jQuery.fn.extend({
		css: function css(name, value) {
			return access(this, function (elem, name, value) {
				var styles,
				    len,
				    map = {},
				    i = 0;

				if (jQuery.isArray(name)) {
					styles = getStyles(elem);
					len = name.length;

					for (; i < len; i++) {
						map[name[i]] = jQuery.css(elem, name[i], false, styles);
					}

					return map;
				}

				return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
			}, name, value, arguments.length > 1);
		},
		show: function show() {
			return showHide(this, true);
		},
		hide: function hide() {
			return showHide(this);
		},
		toggle: function toggle(state) {
			if (typeof state === "boolean") {
				return state ? this.show() : this.hide();
			}

			return this.each(function () {
				if (isHidden(this)) {
					jQuery(this).show();
				} else {
					jQuery(this).hide();
				}
			});
		}
	});

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9jc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQVEsQ0FDUCxRQURPLEVBRVAsWUFGTyxFQUdQLGVBSE8sRUFJUCxtQkFKTyxFQUtQLGdCQUxPLEVBTVAsZUFOTyxFQU9QLHFCQVBPLEVBUVAscUJBUk8sRUFTUCxvQkFUTyxFQVVQLHFCQVZPLEVBV1AsZ0JBWE8sRUFZUCxjQVpPLEVBYVAsaUJBYk8sRUFjUCxzQkFkTyxFQWVQLG9CQWZPLEVBZ0JQLGVBaEJPLEVBaUJQLHFCQWpCTyxFQW1CUCxhQW5CTyxFQW9CUCxjQXBCTyxFQXFCUDtBQXJCTyxDQUFSLEVBc0JHLFVBQVUsTUFBVixFQUFrQixJQUFsQixFQUF3QixNQUF4QixFQUFnQyxPQUFoQyxFQUF5QyxRQUF6QyxFQUFtRCxPQUFuRCxFQUE0RCxTQUE1RCxFQUF1RSxTQUF2RSxFQUFrRixRQUFsRixFQUNGLFNBREUsRUFDUyxJQURULEVBQ2UsTUFEZixFQUN1QixTQUR2QixFQUNrQyxjQURsQyxFQUNrRCxZQURsRCxFQUNnRSxPQURoRSxFQUN5RSxRQUR6RSxFQUNvRjs7QUFFdkY7Ozs7O0FBS0MsZ0JBQWUsMkJBQWY7S0FFQSxVQUFVLEVBQUUsVUFBVSxVQUFWLEVBQXNCLFlBQVksUUFBWixFQUFzQixTQUFTLE9BQVQsRUFBeEQ7S0FDQSxxQkFBcUI7QUFDcEIsaUJBQWUsR0FBZjtBQUNBLGNBQVksS0FBWjtFQUZEO0tBS0EsY0FBYyxDQUFFLFFBQUYsRUFBWSxHQUFaLEVBQWlCLEtBQWpCLEVBQXdCLElBQXhCLENBQWQ7S0FDQSxhQUFhLFNBQVMsYUFBVCxDQUF3QixLQUF4QixFQUFnQyxLQUFoQzs7O0FBaEJ5RSxVQW1COUUsY0FBVCxDQUF5QixJQUF6QixFQUFnQzs7O0FBRy9CLE1BQUssUUFBUSxVQUFSLEVBQXFCO0FBQ3pCLFVBQU8sSUFBUCxDQUR5QjtHQUExQjs7O0FBSCtCLE1BUTNCLFVBQVUsS0FB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QWhCLENBQVAsQ0FEZ0I7R0FBWDtBQUdOLFFBQU0sZ0JBQVc7QUFDaEIsVUFBTyxTQUFVLElBQVYsQ0FBUCxDQURnQjtHQUFYO0FBR04sVUFBUSxnQkFBVSxLQUFWLEVBQWtCO0FBQ3pCLE9BQUssT0FBTyxLQUFQLEtBQWlCLFNBQWpCLEVBQTZCO0FBQ2pDLFdBQU8sUUFBUSxLQUFLLElBQUwsRUFBUixHQUFzQixLQUFLLElBQUwsRUFBdEIsQ0FEMEI7SUFBbEM7O0FBSUEsVUFBTyxLQUFLLElBQUwsQ0FBVyxZQUFXO0FBQzVCLFFBQUssU0FBVSxJQUFWLENBQUwsRUFBd0I7QUFDdkIsWUFBUSxJQUFSLEVBQWUsSUFBZixHQUR1QjtLQUF4QixNQUVPO0FBQ04sWUFBUSxJQUFSLEVBQWUsSUFBZixHQURNO0tBRlA7SUFEaUIsQ0FBbEIsQ0FMeUI7R0FBbEI7RUE3QlQsRUFqYnVGOztBQTZkdkYsUUFBTyxNQUFQLENBN2R1RjtDQURwRixDQXRCSCIsImZpbGUiOiJjc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuL2NvcmVcIixcblx0XCIuL3Zhci9wbnVtXCIsXG5cdFwiLi9jb3JlL2FjY2Vzc1wiLFxuXHRcIi4vY3NzL3Zhci9ybWFyZ2luXCIsXG5cdFwiLi92YXIvZG9jdW1lbnRcIixcblx0XCIuL3Zhci9yY3NzTnVtXCIsXG5cdFwiLi9jc3MvdmFyL3JudW1ub25weFwiLFxuXHRcIi4vY3NzL3Zhci9jc3NFeHBhbmRcIixcblx0XCIuL2Nzcy92YXIvaXNIaWRkZW5cIixcblx0XCIuL2Nzcy92YXIvZ2V0U3R5bGVzXCIsXG5cdFwiLi9jc3MvdmFyL3N3YXBcIixcblx0XCIuL2Nzcy9jdXJDU1NcIixcblx0XCIuL2Nzcy9hZGp1c3RDU1NcIixcblx0XCIuL2Nzcy9kZWZhdWx0RGlzcGxheVwiLFxuXHRcIi4vY3NzL2FkZEdldEhvb2tJZlwiLFxuXHRcIi4vY3NzL3N1cHBvcnRcIixcblx0XCIuL2RhdGEvdmFyL2RhdGFQcml2XCIsXG5cblx0XCIuL2NvcmUvaW5pdFwiLFxuXHRcIi4vY29yZS9yZWFkeVwiLFxuXHRcIi4vc2VsZWN0b3JcIiAvLyBjb250YWluc1xuXSwgZnVuY3Rpb24oIGpRdWVyeSwgcG51bSwgYWNjZXNzLCBybWFyZ2luLCBkb2N1bWVudCwgcmNzc051bSwgcm51bW5vbnB4LCBjc3NFeHBhbmQsIGlzSGlkZGVuLFxuXHRnZXRTdHlsZXMsIHN3YXAsIGN1ckNTUywgYWRqdXN0Q1NTLCBkZWZhdWx0RGlzcGxheSwgYWRkR2V0SG9va0lmLCBzdXBwb3J0LCBkYXRhUHJpdiApIHtcblxudmFyXG5cblx0Ly8gU3dhcHBhYmxlIGlmIGRpc3BsYXkgaXMgbm9uZSBvciBzdGFydHMgd2l0aCB0YWJsZVxuXHQvLyBleGNlcHQgXCJ0YWJsZVwiLCBcInRhYmxlLWNlbGxcIiwgb3IgXCJ0YWJsZS1jYXB0aW9uXCJcblx0Ly8gU2VlIGhlcmUgZm9yIGRpc3BsYXkgdmFsdWVzOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL0NTUy9kaXNwbGF5XG5cdHJkaXNwbGF5c3dhcCA9IC9eKG5vbmV8dGFibGUoPyEtY1tlYV0pLispLyxcblxuXHRjc3NTaG93ID0geyBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCB2aXNpYmlsaXR5OiBcImhpZGRlblwiLCBkaXNwbGF5OiBcImJsb2NrXCIgfSxcblx0Y3NzTm9ybWFsVHJhbnNmb3JtID0ge1xuXHRcdGxldHRlclNwYWNpbmc6IFwiMFwiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiNDAwXCJcblx0fSxcblxuXHRjc3NQcmVmaXhlcyA9IFsgXCJXZWJraXRcIiwgXCJPXCIsIFwiTW96XCIsIFwibXNcIiBdLFxuXHRlbXB0eVN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApLnN0eWxlO1xuXG4vLyBSZXR1cm4gYSBjc3MgcHJvcGVydHkgbWFwcGVkIHRvIGEgcG90ZW50aWFsbHkgdmVuZG9yIHByZWZpeGVkIHByb3BlcnR5XG5mdW5jdGlvbiB2ZW5kb3JQcm9wTmFtZSggbmFtZSApIHtcblxuXHQvLyBTaG9ydGN1dCBmb3IgbmFtZXMgdGhhdCBhcmUgbm90IHZlbmRvciBwcmVmaXhlZFxuXHRpZiAoIG5hbWUgaW4gZW1wdHlTdHlsZSApIHtcblx0XHRyZXR1cm4gbmFtZTtcblx0fVxuXG5cdC8vIENoZWNrIGZvciB2ZW5kb3IgcHJlZml4ZWQgbmFtZXNcblx0dmFyIGNhcE5hbWUgPSBuYW1lWyAwIF0udG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoIDEgKSxcblx0XHRpID0gY3NzUHJlZml4ZXMubGVuZ3RoO1xuXG5cdHdoaWxlICggaS0tICkge1xuXHRcdG5hbWUgPSBjc3NQcmVmaXhlc1sgaSBdICsgY2FwTmFtZTtcblx0XHRpZiAoIG5hbWUgaW4gZW1wdHlTdHlsZSApIHtcblx0XHRcdHJldHVybiBuYW1lO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBzZXRQb3NpdGl2ZU51bWJlciggZWxlbSwgdmFsdWUsIHN1YnRyYWN0ICkge1xuXG5cdC8vIEFueSByZWxhdGl2ZSAoKy8tKSB2YWx1ZXMgaGF2ZSBhbHJlYWR5IGJlZW5cblx0Ly8gbm9ybWFsaXplZCBhdCB0aGlzIHBvaW50XG5cdHZhciBtYXRjaGVzID0gcmNzc051bS5leGVjKCB2YWx1ZSApO1xuXHRyZXR1cm4gbWF0Y2hlcyA/XG5cblx0XHQvLyBHdWFyZCBhZ2FpbnN0IHVuZGVmaW5lZCBcInN1YnRyYWN0XCIsIGUuZy4sIHdoZW4gdXNlZCBhcyBpbiBjc3NIb29rc1xuXHRcdE1hdGgubWF4KCAwLCBtYXRjaGVzWyAyIF0gLSAoIHN1YnRyYWN0IHx8IDAgKSApICsgKCBtYXRjaGVzWyAzIF0gfHwgXCJweFwiICkgOlxuXHRcdHZhbHVlO1xufVxuXG5mdW5jdGlvbiBhdWdtZW50V2lkdGhPckhlaWdodCggZWxlbSwgbmFtZSwgZXh0cmEsIGlzQm9yZGVyQm94LCBzdHlsZXMgKSB7XG5cdHZhciBpID0gZXh0cmEgPT09ICggaXNCb3JkZXJCb3ggPyBcImJvcmRlclwiIDogXCJjb250ZW50XCIgKSA/XG5cblx0XHQvLyBJZiB3ZSBhbHJlYWR5IGhhdmUgdGhlIHJpZ2h0IG1lYXN1cmVtZW50LCBhdm9pZCBhdWdtZW50YXRpb25cblx0XHQ0IDpcblxuXHRcdC8vIE90aGVyd2lzZSBpbml0aWFsaXplIGZvciBob3Jpem9udGFsIG9yIHZlcnRpY2FsIHByb3BlcnRpZXNcblx0XHRuYW1lID09PSBcIndpZHRoXCIgPyAxIDogMCxcblxuXHRcdHZhbCA9IDA7XG5cblx0Zm9yICggOyBpIDwgNDsgaSArPSAyICkge1xuXG5cdFx0Ly8gQm90aCBib3ggbW9kZWxzIGV4Y2x1ZGUgbWFyZ2luLCBzbyBhZGQgaXQgaWYgd2Ugd2FudCBpdFxuXHRcdGlmICggZXh0cmEgPT09IFwibWFyZ2luXCIgKSB7XG5cdFx0XHR2YWwgKz0galF1ZXJ5LmNzcyggZWxlbSwgZXh0cmEgKyBjc3NFeHBhbmRbIGkgXSwgdHJ1ZSwgc3R5bGVzICk7XG5cdFx0fVxuXG5cdFx0aWYgKCBpc0JvcmRlckJveCApIHtcblxuXHRcdFx0Ly8gYm9yZGVyLWJveCBpbmNsdWRlcyBwYWRkaW5nLCBzbyByZW1vdmUgaXQgaWYgd2Ugd2FudCBjb250ZW50XG5cdFx0XHRpZiAoIGV4dHJhID09PSBcImNvbnRlbnRcIiApIHtcblx0XHRcdFx0dmFsIC09IGpRdWVyeS5jc3MoIGVsZW0sIFwicGFkZGluZ1wiICsgY3NzRXhwYW5kWyBpIF0sIHRydWUsIHN0eWxlcyApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBdCB0aGlzIHBvaW50LCBleHRyYSBpc24ndCBib3JkZXIgbm9yIG1hcmdpbiwgc28gcmVtb3ZlIGJvcmRlclxuXHRcdFx0aWYgKCBleHRyYSAhPT0gXCJtYXJnaW5cIiApIHtcblx0XHRcdFx0dmFsIC09IGpRdWVyeS5jc3MoIGVsZW0sIFwiYm9yZGVyXCIgKyBjc3NFeHBhbmRbIGkgXSArIFwiV2lkdGhcIiwgdHJ1ZSwgc3R5bGVzICk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gQXQgdGhpcyBwb2ludCwgZXh0cmEgaXNuJ3QgY29udGVudCwgc28gYWRkIHBhZGRpbmdcblx0XHRcdHZhbCArPSBqUXVlcnkuY3NzKCBlbGVtLCBcInBhZGRpbmdcIiArIGNzc0V4cGFuZFsgaSBdLCB0cnVlLCBzdHlsZXMgKTtcblxuXHRcdFx0Ly8gQXQgdGhpcyBwb2ludCwgZXh0cmEgaXNuJ3QgY29udGVudCBub3IgcGFkZGluZywgc28gYWRkIGJvcmRlclxuXHRcdFx0aWYgKCBleHRyYSAhPT0gXCJwYWRkaW5nXCIgKSB7XG5cdFx0XHRcdHZhbCArPSBqUXVlcnkuY3NzKCBlbGVtLCBcImJvcmRlclwiICsgY3NzRXhwYW5kWyBpIF0gKyBcIldpZHRoXCIsIHRydWUsIHN0eWxlcyApO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB2YWw7XG59XG5cbmZ1bmN0aW9uIGdldFdpZHRoT3JIZWlnaHQoIGVsZW0sIG5hbWUsIGV4dHJhICkge1xuXG5cdC8vIFN0YXJ0IHdpdGggb2Zmc2V0IHByb3BlcnR5LCB3aGljaCBpcyBlcXVpdmFsZW50IHRvIHRoZSBib3JkZXItYm94IHZhbHVlXG5cdHZhciB2YWx1ZUlzQm9yZGVyQm94ID0gdHJ1ZSxcblx0XHR2YWwgPSBuYW1lID09PSBcIndpZHRoXCIgPyBlbGVtLm9mZnNldFdpZHRoIDogZWxlbS5vZmZzZXRIZWlnaHQsXG5cdFx0c3R5bGVzID0gZ2V0U3R5bGVzKCBlbGVtICksXG5cdFx0aXNCb3JkZXJCb3ggPSBqUXVlcnkuY3NzKCBlbGVtLCBcImJveFNpemluZ1wiLCBmYWxzZSwgc3R5bGVzICkgPT09IFwiYm9yZGVyLWJveFwiO1xuXG5cdC8vIFNvbWUgbm9uLWh0bWwgZWxlbWVudHMgcmV0dXJuIHVuZGVmaW5lZCBmb3Igb2Zmc2V0V2lkdGgsIHNvIGNoZWNrIGZvciBudWxsL3VuZGVmaW5lZFxuXHQvLyBzdmcgLSBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02NDkyODVcblx0Ly8gTWF0aE1MIC0gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NDkxNjY4XG5cdGlmICggdmFsIDw9IDAgfHwgdmFsID09IG51bGwgKSB7XG5cblx0XHQvLyBGYWxsIGJhY2sgdG8gY29tcHV0ZWQgdGhlbiB1bmNvbXB1dGVkIGNzcyBpZiBuZWNlc3Nhcnlcblx0XHR2YWwgPSBjdXJDU1MoIGVsZW0sIG5hbWUsIHN0eWxlcyApO1xuXHRcdGlmICggdmFsIDwgMCB8fCB2YWwgPT0gbnVsbCApIHtcblx0XHRcdHZhbCA9IGVsZW0uc3R5bGVbIG5hbWUgXTtcblx0XHR9XG5cblx0XHQvLyBDb21wdXRlZCB1bml0IGlzIG5vdCBwaXhlbHMuIFN0b3AgaGVyZSBhbmQgcmV0dXJuLlxuXHRcdGlmICggcm51bW5vbnB4LnRlc3QoIHZhbCApICkge1xuXHRcdFx0cmV0dXJuIHZhbDtcblx0XHR9XG5cblx0XHQvLyBDaGVjayBmb3Igc3R5bGUgaW4gY2FzZSBhIGJyb3dzZXIgd2hpY2ggcmV0dXJucyB1bnJlbGlhYmxlIHZhbHVlc1xuXHRcdC8vIGZvciBnZXRDb21wdXRlZFN0eWxlIHNpbGVudGx5IGZhbGxzIGJhY2sgdG8gdGhlIHJlbGlhYmxlIGVsZW0uc3R5bGVcblx0XHR2YWx1ZUlzQm9yZGVyQm94ID0gaXNCb3JkZXJCb3ggJiZcblx0XHRcdCggc3VwcG9ydC5ib3hTaXppbmdSZWxpYWJsZSgpIHx8IHZhbCA9PT0gZWxlbS5zdHlsZVsgbmFtZSBdICk7XG5cblx0XHQvLyBOb3JtYWxpemUgXCJcIiwgYXV0bywgYW5kIHByZXBhcmUgZm9yIGV4dHJhXG5cdFx0dmFsID0gcGFyc2VGbG9hdCggdmFsICkgfHwgMDtcblx0fVxuXG5cdC8vIFVzZSB0aGUgYWN0aXZlIGJveC1zaXppbmcgbW9kZWwgdG8gYWRkL3N1YnRyYWN0IGlycmVsZXZhbnQgc3R5bGVzXG5cdHJldHVybiAoIHZhbCArXG5cdFx0YXVnbWVudFdpZHRoT3JIZWlnaHQoXG5cdFx0XHRlbGVtLFxuXHRcdFx0bmFtZSxcblx0XHRcdGV4dHJhIHx8ICggaXNCb3JkZXJCb3ggPyBcImJvcmRlclwiIDogXCJjb250ZW50XCIgKSxcblx0XHRcdHZhbHVlSXNCb3JkZXJCb3gsXG5cdFx0XHRzdHlsZXNcblx0XHQpXG5cdCkgKyBcInB4XCI7XG59XG5cbmZ1bmN0aW9uIHNob3dIaWRlKCBlbGVtZW50cywgc2hvdyApIHtcblx0dmFyIGRpc3BsYXksIGVsZW0sIGhpZGRlbixcblx0XHR2YWx1ZXMgPSBbXSxcblx0XHRpbmRleCA9IDAsXG5cdFx0bGVuZ3RoID0gZWxlbWVudHMubGVuZ3RoO1xuXG5cdGZvciAoIDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KysgKSB7XG5cdFx0ZWxlbSA9IGVsZW1lbnRzWyBpbmRleCBdO1xuXHRcdGlmICggIWVsZW0uc3R5bGUgKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHR2YWx1ZXNbIGluZGV4IF0gPSBkYXRhUHJpdi5nZXQoIGVsZW0sIFwib2xkZGlzcGxheVwiICk7XG5cdFx0ZGlzcGxheSA9IGVsZW0uc3R5bGUuZGlzcGxheTtcblx0XHRpZiAoIHNob3cgKSB7XG5cblx0XHRcdC8vIFJlc2V0IHRoZSBpbmxpbmUgZGlzcGxheSBvZiB0aGlzIGVsZW1lbnQgdG8gbGVhcm4gaWYgaXQgaXNcblx0XHRcdC8vIGJlaW5nIGhpZGRlbiBieSBjYXNjYWRlZCBydWxlcyBvciBub3Rcblx0XHRcdGlmICggIXZhbHVlc1sgaW5kZXggXSAmJiBkaXNwbGF5ID09PSBcIm5vbmVcIiApIHtcblx0XHRcdFx0ZWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU2V0IGVsZW1lbnRzIHdoaWNoIGhhdmUgYmVlbiBvdmVycmlkZGVuIHdpdGggZGlzcGxheTogbm9uZVxuXHRcdFx0Ly8gaW4gYSBzdHlsZXNoZWV0IHRvIHdoYXRldmVyIHRoZSBkZWZhdWx0IGJyb3dzZXIgc3R5bGUgaXNcblx0XHRcdC8vIGZvciBzdWNoIGFuIGVsZW1lbnRcblx0XHRcdGlmICggZWxlbS5zdHlsZS5kaXNwbGF5ID09PSBcIlwiICYmIGlzSGlkZGVuKCBlbGVtICkgKSB7XG5cdFx0XHRcdHZhbHVlc1sgaW5kZXggXSA9IGRhdGFQcml2LmFjY2Vzcyhcblx0XHRcdFx0XHRlbGVtLFxuXHRcdFx0XHRcdFwib2xkZGlzcGxheVwiLFxuXHRcdFx0XHRcdGRlZmF1bHREaXNwbGF5KCBlbGVtLm5vZGVOYW1lIClcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aGlkZGVuID0gaXNIaWRkZW4oIGVsZW0gKTtcblxuXHRcdFx0aWYgKCBkaXNwbGF5ICE9PSBcIm5vbmVcIiB8fCAhaGlkZGVuICkge1xuXHRcdFx0XHRkYXRhUHJpdi5zZXQoXG5cdFx0XHRcdFx0ZWxlbSxcblx0XHRcdFx0XHRcIm9sZGRpc3BsYXlcIixcblx0XHRcdFx0XHRoaWRkZW4gPyBkaXNwbGF5IDogalF1ZXJ5LmNzcyggZWxlbSwgXCJkaXNwbGF5XCIgKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFNldCB0aGUgZGlzcGxheSBvZiBtb3N0IG9mIHRoZSBlbGVtZW50cyBpbiBhIHNlY29uZCBsb29wXG5cdC8vIHRvIGF2b2lkIHRoZSBjb25zdGFudCByZWZsb3dcblx0Zm9yICggaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKyApIHtcblx0XHRlbGVtID0gZWxlbWVudHNbIGluZGV4IF07XG5cdFx0aWYgKCAhZWxlbS5zdHlsZSApIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRpZiAoICFzaG93IHx8IGVsZW0uc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIgfHwgZWxlbS5zdHlsZS5kaXNwbGF5ID09PSBcIlwiICkge1xuXHRcdFx0ZWxlbS5zdHlsZS5kaXNwbGF5ID0gc2hvdyA/IHZhbHVlc1sgaW5kZXggXSB8fCBcIlwiIDogXCJub25lXCI7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGVsZW1lbnRzO1xufVxuXG5qUXVlcnkuZXh0ZW5kKCB7XG5cblx0Ly8gQWRkIGluIHN0eWxlIHByb3BlcnR5IGhvb2tzIGZvciBvdmVycmlkaW5nIHRoZSBkZWZhdWx0XG5cdC8vIGJlaGF2aW9yIG9mIGdldHRpbmcgYW5kIHNldHRpbmcgYSBzdHlsZSBwcm9wZXJ0eVxuXHRjc3NIb29rczoge1xuXHRcdG9wYWNpdHk6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oIGVsZW0sIGNvbXB1dGVkICkge1xuXHRcdFx0XHRpZiAoIGNvbXB1dGVkICkge1xuXG5cdFx0XHRcdFx0Ly8gV2Ugc2hvdWxkIGFsd2F5cyBnZXQgYSBudW1iZXIgYmFjayBmcm9tIG9wYWNpdHlcblx0XHRcdFx0XHR2YXIgcmV0ID0gY3VyQ1NTKCBlbGVtLCBcIm9wYWNpdHlcIiApO1xuXHRcdFx0XHRcdHJldHVybiByZXQgPT09IFwiXCIgPyBcIjFcIiA6IHJldDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvLyBEb24ndCBhdXRvbWF0aWNhbGx5IGFkZCBcInB4XCIgdG8gdGhlc2UgcG9zc2libHktdW5pdGxlc3MgcHJvcGVydGllc1xuXHRjc3NOdW1iZXI6IHtcblx0XHRcImFuaW1hdGlvbkl0ZXJhdGlvbkNvdW50XCI6IHRydWUsXG5cdFx0XCJjb2x1bW5Db3VudFwiOiB0cnVlLFxuXHRcdFwiZmlsbE9wYWNpdHlcIjogdHJ1ZSxcblx0XHRcImZsZXhHcm93XCI6IHRydWUsXG5cdFx0XCJmbGV4U2hyaW5rXCI6IHRydWUsXG5cdFx0XCJmb250V2VpZ2h0XCI6IHRydWUsXG5cdFx0XCJsaW5lSGVpZ2h0XCI6IHRydWUsXG5cdFx0XCJvcGFjaXR5XCI6IHRydWUsXG5cdFx0XCJvcmRlclwiOiB0cnVlLFxuXHRcdFwib3JwaGFuc1wiOiB0cnVlLFxuXHRcdFwid2lkb3dzXCI6IHRydWUsXG5cdFx0XCJ6SW5kZXhcIjogdHJ1ZSxcblx0XHRcInpvb21cIjogdHJ1ZVxuXHR9LFxuXG5cdC8vIEFkZCBpbiBwcm9wZXJ0aWVzIHdob3NlIG5hbWVzIHlvdSB3aXNoIHRvIGZpeCBiZWZvcmVcblx0Ly8gc2V0dGluZyBvciBnZXR0aW5nIHRoZSB2YWx1ZVxuXHRjc3NQcm9wczoge1xuXHRcdFwiZmxvYXRcIjogXCJjc3NGbG9hdFwiXG5cdH0sXG5cblx0Ly8gR2V0IGFuZCBzZXQgdGhlIHN0eWxlIHByb3BlcnR5IG9uIGEgRE9NIE5vZGVcblx0c3R5bGU6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCB2YWx1ZSwgZXh0cmEgKSB7XG5cblx0XHQvLyBEb24ndCBzZXQgc3R5bGVzIG9uIHRleHQgYW5kIGNvbW1lbnQgbm9kZXNcblx0XHRpZiAoICFlbGVtIHx8IGVsZW0ubm9kZVR5cGUgPT09IDMgfHwgZWxlbS5ub2RlVHlwZSA9PT0gOCB8fCAhZWxlbS5zdHlsZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCB3ZSdyZSB3b3JraW5nIHdpdGggdGhlIHJpZ2h0IG5hbWVcblx0XHR2YXIgcmV0LCB0eXBlLCBob29rcyxcblx0XHRcdG9yaWdOYW1lID0galF1ZXJ5LmNhbWVsQ2FzZSggbmFtZSApLFxuXHRcdFx0c3R5bGUgPSBlbGVtLnN0eWxlO1xuXG5cdFx0bmFtZSA9IGpRdWVyeS5jc3NQcm9wc1sgb3JpZ05hbWUgXSB8fFxuXHRcdFx0KCBqUXVlcnkuY3NzUHJvcHNbIG9yaWdOYW1lIF0gPSB2ZW5kb3JQcm9wTmFtZSggb3JpZ05hbWUgKSB8fCBvcmlnTmFtZSApO1xuXG5cdFx0Ly8gR2V0cyBob29rIGZvciB0aGUgcHJlZml4ZWQgdmVyc2lvbiwgdGhlbiB1bnByZWZpeGVkIHZlcnNpb25cblx0XHRob29rcyA9IGpRdWVyeS5jc3NIb29rc1sgbmFtZSBdIHx8IGpRdWVyeS5jc3NIb29rc1sgb3JpZ05hbWUgXTtcblxuXHRcdC8vIENoZWNrIGlmIHdlJ3JlIHNldHRpbmcgYSB2YWx1ZVxuXHRcdGlmICggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHR5cGUgPSB0eXBlb2YgdmFsdWU7XG5cblx0XHRcdC8vIENvbnZlcnQgXCIrPVwiIG9yIFwiLT1cIiB0byByZWxhdGl2ZSBudW1iZXJzICgjNzM0NSlcblx0XHRcdGlmICggdHlwZSA9PT0gXCJzdHJpbmdcIiAmJiAoIHJldCA9IHJjc3NOdW0uZXhlYyggdmFsdWUgKSApICYmIHJldFsgMSBdICkge1xuXHRcdFx0XHR2YWx1ZSA9IGFkanVzdENTUyggZWxlbSwgbmFtZSwgcmV0ICk7XG5cblx0XHRcdFx0Ly8gRml4ZXMgYnVnICM5MjM3XG5cdFx0XHRcdHR5cGUgPSBcIm51bWJlclwiO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCBudWxsIGFuZCBOYU4gdmFsdWVzIGFyZW4ndCBzZXQgKCM3MTE2KVxuXHRcdFx0aWYgKCB2YWx1ZSA9PSBudWxsIHx8IHZhbHVlICE9PSB2YWx1ZSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiBhIG51bWJlciB3YXMgcGFzc2VkIGluLCBhZGQgdGhlIHVuaXQgKGV4Y2VwdCBmb3IgY2VydGFpbiBDU1MgcHJvcGVydGllcylcblx0XHRcdGlmICggdHlwZSA9PT0gXCJudW1iZXJcIiApIHtcblx0XHRcdFx0dmFsdWUgKz0gcmV0ICYmIHJldFsgMyBdIHx8ICggalF1ZXJ5LmNzc051bWJlclsgb3JpZ05hbWUgXSA/IFwiXCIgOiBcInB4XCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU5LTExK1xuXHRcdFx0Ly8gYmFja2dyb3VuZC0qIHByb3BzIGFmZmVjdCBvcmlnaW5hbCBjbG9uZSdzIHZhbHVlc1xuXHRcdFx0aWYgKCAhc3VwcG9ydC5jbGVhckNsb25lU3R5bGUgJiYgdmFsdWUgPT09IFwiXCIgJiYgbmFtZS5pbmRleE9mKCBcImJhY2tncm91bmRcIiApID09PSAwICkge1xuXHRcdFx0XHRzdHlsZVsgbmFtZSBdID0gXCJpbmhlcml0XCI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIGEgaG9vayB3YXMgcHJvdmlkZWQsIHVzZSB0aGF0IHZhbHVlLCBvdGhlcndpc2UganVzdCBzZXQgdGhlIHNwZWNpZmllZCB2YWx1ZVxuXHRcdFx0aWYgKCAhaG9va3MgfHwgISggXCJzZXRcIiBpbiBob29rcyApIHx8XG5cdFx0XHRcdCggdmFsdWUgPSBob29rcy5zZXQoIGVsZW0sIHZhbHVlLCBleHRyYSApICkgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHRzdHlsZVsgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBJZiBhIGhvb2sgd2FzIHByb3ZpZGVkIGdldCB0aGUgbm9uLWNvbXB1dGVkIHZhbHVlIGZyb20gdGhlcmVcblx0XHRcdGlmICggaG9va3MgJiYgXCJnZXRcIiBpbiBob29rcyAmJlxuXHRcdFx0XHQoIHJldCA9IGhvb2tzLmdldCggZWxlbSwgZmFsc2UsIGV4dHJhICkgKSAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE90aGVyd2lzZSBqdXN0IGdldCB0aGUgdmFsdWUgZnJvbSB0aGUgc3R5bGUgb2JqZWN0XG5cdFx0XHRyZXR1cm4gc3R5bGVbIG5hbWUgXTtcblx0XHR9XG5cdH0sXG5cblx0Y3NzOiBmdW5jdGlvbiggZWxlbSwgbmFtZSwgZXh0cmEsIHN0eWxlcyApIHtcblx0XHR2YXIgdmFsLCBudW0sIGhvb2tzLFxuXHRcdFx0b3JpZ05hbWUgPSBqUXVlcnkuY2FtZWxDYXNlKCBuYW1lICk7XG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCB3ZSdyZSB3b3JraW5nIHdpdGggdGhlIHJpZ2h0IG5hbWVcblx0XHRuYW1lID0galF1ZXJ5LmNzc1Byb3BzWyBvcmlnTmFtZSBdIHx8XG5cdFx0XHQoIGpRdWVyeS5jc3NQcm9wc1sgb3JpZ05hbWUgXSA9IHZlbmRvclByb3BOYW1lKCBvcmlnTmFtZSApIHx8IG9yaWdOYW1lICk7XG5cblx0XHQvLyBUcnkgcHJlZml4ZWQgbmFtZSBmb2xsb3dlZCBieSB0aGUgdW5wcmVmaXhlZCBuYW1lXG5cdFx0aG9va3MgPSBqUXVlcnkuY3NzSG9va3NbIG5hbWUgXSB8fCBqUXVlcnkuY3NzSG9va3NbIG9yaWdOYW1lIF07XG5cblx0XHQvLyBJZiBhIGhvb2sgd2FzIHByb3ZpZGVkIGdldCB0aGUgY29tcHV0ZWQgdmFsdWUgZnJvbSB0aGVyZVxuXHRcdGlmICggaG9va3MgJiYgXCJnZXRcIiBpbiBob29rcyApIHtcblx0XHRcdHZhbCA9IGhvb2tzLmdldCggZWxlbSwgdHJ1ZSwgZXh0cmEgKTtcblx0XHR9XG5cblx0XHQvLyBPdGhlcndpc2UsIGlmIGEgd2F5IHRvIGdldCB0aGUgY29tcHV0ZWQgdmFsdWUgZXhpc3RzLCB1c2UgdGhhdFxuXHRcdGlmICggdmFsID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHR2YWwgPSBjdXJDU1MoIGVsZW0sIG5hbWUsIHN0eWxlcyApO1xuXHRcdH1cblxuXHRcdC8vIENvbnZlcnQgXCJub3JtYWxcIiB0byBjb21wdXRlZCB2YWx1ZVxuXHRcdGlmICggdmFsID09PSBcIm5vcm1hbFwiICYmIG5hbWUgaW4gY3NzTm9ybWFsVHJhbnNmb3JtICkge1xuXHRcdFx0dmFsID0gY3NzTm9ybWFsVHJhbnNmb3JtWyBuYW1lIF07XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBudW1lcmljIGlmIGZvcmNlZCBvciBhIHF1YWxpZmllciB3YXMgcHJvdmlkZWQgYW5kIHZhbCBsb29rcyBudW1lcmljXG5cdFx0aWYgKCBleHRyYSA9PT0gXCJcIiB8fCBleHRyYSApIHtcblx0XHRcdG51bSA9IHBhcnNlRmxvYXQoIHZhbCApO1xuXHRcdFx0cmV0dXJuIGV4dHJhID09PSB0cnVlIHx8IGlzRmluaXRlKCBudW0gKSA/IG51bSB8fCAwIDogdmFsO1xuXHRcdH1cblx0XHRyZXR1cm4gdmFsO1xuXHR9XG59ICk7XG5cbmpRdWVyeS5lYWNoKCBbIFwiaGVpZ2h0XCIsIFwid2lkdGhcIiBdLCBmdW5jdGlvbiggaSwgbmFtZSApIHtcblx0alF1ZXJ5LmNzc0hvb2tzWyBuYW1lIF0gPSB7XG5cdFx0Z2V0OiBmdW5jdGlvbiggZWxlbSwgY29tcHV0ZWQsIGV4dHJhICkge1xuXHRcdFx0aWYgKCBjb21wdXRlZCApIHtcblxuXHRcdFx0XHQvLyBDZXJ0YWluIGVsZW1lbnRzIGNhbiBoYXZlIGRpbWVuc2lvbiBpbmZvIGlmIHdlIGludmlzaWJseSBzaG93IHRoZW1cblx0XHRcdFx0Ly8gYnV0IGl0IG11c3QgaGF2ZSBhIGN1cnJlbnQgZGlzcGxheSBzdHlsZSB0aGF0IHdvdWxkIGJlbmVmaXRcblx0XHRcdFx0cmV0dXJuIHJkaXNwbGF5c3dhcC50ZXN0KCBqUXVlcnkuY3NzKCBlbGVtLCBcImRpc3BsYXlcIiApICkgJiZcblx0XHRcdFx0XHRlbGVtLm9mZnNldFdpZHRoID09PSAwID9cblx0XHRcdFx0XHRcdHN3YXAoIGVsZW0sIGNzc1Nob3csIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZ2V0V2lkdGhPckhlaWdodCggZWxlbSwgbmFtZSwgZXh0cmEgKTtcblx0XHRcdFx0XHRcdH0gKSA6XG5cdFx0XHRcdFx0XHRnZXRXaWR0aE9ySGVpZ2h0KCBlbGVtLCBuYW1lLCBleHRyYSApO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRzZXQ6IGZ1bmN0aW9uKCBlbGVtLCB2YWx1ZSwgZXh0cmEgKSB7XG5cdFx0XHR2YXIgbWF0Y2hlcyxcblx0XHRcdFx0c3R5bGVzID0gZXh0cmEgJiYgZ2V0U3R5bGVzKCBlbGVtICksXG5cdFx0XHRcdHN1YnRyYWN0ID0gZXh0cmEgJiYgYXVnbWVudFdpZHRoT3JIZWlnaHQoXG5cdFx0XHRcdFx0ZWxlbSxcblx0XHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRcdGV4dHJhLFxuXHRcdFx0XHRcdGpRdWVyeS5jc3MoIGVsZW0sIFwiYm94U2l6aW5nXCIsIGZhbHNlLCBzdHlsZXMgKSA9PT0gXCJib3JkZXItYm94XCIsXG5cdFx0XHRcdFx0c3R5bGVzXG5cdFx0XHRcdCk7XG5cblx0XHRcdC8vIENvbnZlcnQgdG8gcGl4ZWxzIGlmIHZhbHVlIGFkanVzdG1lbnQgaXMgbmVlZGVkXG5cdFx0XHRpZiAoIHN1YnRyYWN0ICYmICggbWF0Y2hlcyA9IHJjc3NOdW0uZXhlYyggdmFsdWUgKSApICYmXG5cdFx0XHRcdCggbWF0Y2hlc1sgMyBdIHx8IFwicHhcIiApICE9PSBcInB4XCIgKSB7XG5cblx0XHRcdFx0ZWxlbS5zdHlsZVsgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHRcdHZhbHVlID0galF1ZXJ5LmNzcyggZWxlbSwgbmFtZSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gc2V0UG9zaXRpdmVOdW1iZXIoIGVsZW0sIHZhbHVlLCBzdWJ0cmFjdCApO1xuXHRcdH1cblx0fTtcbn0gKTtcblxualF1ZXJ5LmNzc0hvb2tzLm1hcmdpbkxlZnQgPSBhZGRHZXRIb29rSWYoIHN1cHBvcnQucmVsaWFibGVNYXJnaW5MZWZ0LFxuXHRmdW5jdGlvbiggZWxlbSwgY29tcHV0ZWQgKSB7XG5cdFx0aWYgKCBjb21wdXRlZCApIHtcblx0XHRcdHJldHVybiAoIHBhcnNlRmxvYXQoIGN1ckNTUyggZWxlbSwgXCJtYXJnaW5MZWZ0XCIgKSApIHx8XG5cdFx0XHRcdGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtXG5cdFx0XHRcdFx0c3dhcCggZWxlbSwgeyBtYXJnaW5MZWZ0OiAwIH0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcblx0XHRcdFx0XHR9IClcblx0XHRcdFx0KSArIFwicHhcIjtcblx0XHR9XG5cdH1cbik7XG5cbi8vIFN1cHBvcnQ6IEFuZHJvaWQgMi4zXG5qUXVlcnkuY3NzSG9va3MubWFyZ2luUmlnaHQgPSBhZGRHZXRIb29rSWYoIHN1cHBvcnQucmVsaWFibGVNYXJnaW5SaWdodCxcblx0ZnVuY3Rpb24oIGVsZW0sIGNvbXB1dGVkICkge1xuXHRcdGlmICggY29tcHV0ZWQgKSB7XG5cdFx0XHRyZXR1cm4gc3dhcCggZWxlbSwgeyBcImRpc3BsYXlcIjogXCJpbmxpbmUtYmxvY2tcIiB9LFxuXHRcdFx0XHRjdXJDU1MsIFsgZWxlbSwgXCJtYXJnaW5SaWdodFwiIF0gKTtcblx0XHR9XG5cdH1cbik7XG5cbi8vIFRoZXNlIGhvb2tzIGFyZSB1c2VkIGJ5IGFuaW1hdGUgdG8gZXhwYW5kIHByb3BlcnRpZXNcbmpRdWVyeS5lYWNoKCB7XG5cdG1hcmdpbjogXCJcIixcblx0cGFkZGluZzogXCJcIixcblx0Ym9yZGVyOiBcIldpZHRoXCJcbn0sIGZ1bmN0aW9uKCBwcmVmaXgsIHN1ZmZpeCApIHtcblx0alF1ZXJ5LmNzc0hvb2tzWyBwcmVmaXggKyBzdWZmaXggXSA9IHtcblx0XHRleHBhbmQ6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHRcdHZhciBpID0gMCxcblx0XHRcdFx0ZXhwYW5kZWQgPSB7fSxcblxuXHRcdFx0XHQvLyBBc3N1bWVzIGEgc2luZ2xlIG51bWJlciBpZiBub3QgYSBzdHJpbmdcblx0XHRcdFx0cGFydHMgPSB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgPyB2YWx1ZS5zcGxpdCggXCIgXCIgKSA6IFsgdmFsdWUgXTtcblxuXHRcdFx0Zm9yICggOyBpIDwgNDsgaSsrICkge1xuXHRcdFx0XHRleHBhbmRlZFsgcHJlZml4ICsgY3NzRXhwYW5kWyBpIF0gKyBzdWZmaXggXSA9XG5cdFx0XHRcdFx0cGFydHNbIGkgXSB8fCBwYXJ0c1sgaSAtIDIgXSB8fCBwYXJ0c1sgMCBdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZXhwYW5kZWQ7XG5cdFx0fVxuXHR9O1xuXG5cdGlmICggIXJtYXJnaW4udGVzdCggcHJlZml4ICkgKSB7XG5cdFx0alF1ZXJ5LmNzc0hvb2tzWyBwcmVmaXggKyBzdWZmaXggXS5zZXQgPSBzZXRQb3NpdGl2ZU51bWJlcjtcblx0fVxufSApO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKCB7XG5cdGNzczogZnVuY3Rpb24oIG5hbWUsIHZhbHVlICkge1xuXHRcdHJldHVybiBhY2Nlc3MoIHRoaXMsIGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCB2YWx1ZSApIHtcblx0XHRcdHZhciBzdHlsZXMsIGxlbixcblx0XHRcdFx0bWFwID0ge30sXG5cdFx0XHRcdGkgPSAwO1xuXG5cdFx0XHRpZiAoIGpRdWVyeS5pc0FycmF5KCBuYW1lICkgKSB7XG5cdFx0XHRcdHN0eWxlcyA9IGdldFN0eWxlcyggZWxlbSApO1xuXHRcdFx0XHRsZW4gPSBuYW1lLmxlbmd0aDtcblxuXHRcdFx0XHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdFx0XHRtYXBbIG5hbWVbIGkgXSBdID0galF1ZXJ5LmNzcyggZWxlbSwgbmFtZVsgaSBdLCBmYWxzZSwgc3R5bGVzICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gbWFwO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCA/XG5cdFx0XHRcdGpRdWVyeS5zdHlsZSggZWxlbSwgbmFtZSwgdmFsdWUgKSA6XG5cdFx0XHRcdGpRdWVyeS5jc3MoIGVsZW0sIG5hbWUgKTtcblx0XHR9LCBuYW1lLCB2YWx1ZSwgYXJndW1lbnRzLmxlbmd0aCA+IDEgKTtcblx0fSxcblx0c2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHNob3dIaWRlKCB0aGlzLCB0cnVlICk7XG5cdH0sXG5cdGhpZGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzaG93SGlkZSggdGhpcyApO1xuXHR9LFxuXHR0b2dnbGU6IGZ1bmN0aW9uKCBzdGF0ZSApIHtcblx0XHRpZiAoIHR5cGVvZiBzdGF0ZSA9PT0gXCJib29sZWFuXCIgKSB7XG5cdFx0XHRyZXR1cm4gc3RhdGUgPyB0aGlzLnNob3coKSA6IHRoaXMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCBpc0hpZGRlbiggdGhpcyApICkge1xuXHRcdFx0XHRqUXVlcnkoIHRoaXMgKS5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRqUXVlcnkoIHRoaXMgKS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG59ICk7XG5cbnJldHVybiBqUXVlcnk7XG59ICk7XG4iXX0=