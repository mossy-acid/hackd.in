"use strict";

define(["../core", "./support", "../core/init"], function (jQuery, support) {

	var rreturn = /\r/g,
	    rspaces = /[\x20\t\r\n\f]+/g;

	jQuery.fn.extend({
		val: function val(value) {
			var hooks,
			    ret,
			    isFunction,
			    elem = this[0];

			if (!arguments.length) {
				if (elem) {
					hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

					if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
						return ret;
					}

					ret = elem.value;

					return typeof ret === "string" ?

					// Handle most common string cases
					ret.replace(rreturn, "") :

					// Handle cases where value is null/undef or number
					ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction(value);

			return this.each(function (i) {
				var val;

				if (this.nodeType !== 1) {
					return;
				}

				if (isFunction) {
					val = value.call(this, i, jQuery(this).val());
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if (val == null) {
					val = "";
				} else if (typeof val === "number") {
					val += "";
				} else if (jQuery.isArray(val)) {
					val = jQuery.map(val, function (value) {
						return value == null ? "" : value + "";
					});
				}

				hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

				// If set returns undefined, fall back to normal setting
				if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
					this.value = val;
				}
			});
		}
	});

	jQuery.extend({
		valHooks: {
			option: {
				get: function get(elem) {

					var val = jQuery.find.attr(elem, "value");
					return val != null ? val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim(jQuery.text(elem)).replace(rspaces, " ");
				}
			},
			select: {
				get: function get(elem) {
					var value,
					    option,
					    options = elem.options,
					    index = elem.selectedIndex,
					    one = elem.type === "select-one" || index < 0,
					    values = one ? null : [],
					    max = one ? index + 1 : options.length,
					    i = index < 0 ? max : one ? index : 0;

					// Loop through all the selected options
					for (; i < max; i++) {
						option = options[i];

						// IE8-9 doesn't update selected after form reset (#2551)
						if ((option.selected || i === index) && (

						// Don't return options that are disabled or in a disabled optgroup
						support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if (one) {
								return value;
							}

							// Multi-Selects return an array
							values.push(value);
						}
					}

					return values;
				},

				set: function set(elem, value) {
					var optionSet,
					    option,
					    options = elem.options,
					    values = jQuery.makeArray(value),
					    i = options.length;

					while (i--) {
						option = options[i];
						if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
							optionSet = true;
						}
					}

					// Force browsers to behave consistently when non-matching value is set
					if (!optionSet) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	});

	// Radios and checkboxes getter/setter
	jQuery.each(["radio", "checkbox"], function () {
		jQuery.valHooks[this] = {
			set: function set(elem, value) {
				if (jQuery.isArray(value)) {
					return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
				}
			}
		};
		if (!support.checkOn) {
			jQuery.valHooks[this].get = function (elem) {
				return elem.getAttribute("value") === null ? "on" : elem.value;
			};
		}
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9hdHRyaWJ1dGVzL3ZhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQVEsQ0FDUCxTQURPLEVBRVAsV0FGTyxFQUdQLGNBSE8sQ0FBUixFQUlHLFVBQVUsTUFBVixFQUFrQixPQUFsQixFQUE0Qjs7QUFFL0IsS0FBSSxVQUFVLEtBQWQ7S0FDQyxVQUFVLGtCQURYOztBQUdBLFFBQU8sRUFBUCxDQUFVLE1BQVYsQ0FBa0I7QUFDakIsT0FBSyxhQUFVLEtBQVYsRUFBa0I7QUFDdEIsT0FBSSxLQUFKO09BQVcsR0FBWDtPQUFnQixVQUFoQjtPQUNDLE9BQU8sS0FBTSxDQUFOLENBRFI7O0FBR0EsT0FBSyxDQUFDLFVBQVUsTUFBaEIsRUFBeUI7QUFDeEIsUUFBSyxJQUFMLEVBQVk7QUFDWCxhQUFRLE9BQU8sUUFBUCxDQUFpQixLQUFLLElBQXRCLEtBQ1AsT0FBTyxRQUFQLENBQWlCLEtBQUssUUFBTCxDQUFjLFdBQWQsRUFBakIsQ0FERDs7QUFHQSxTQUFLLFNBQ0osU0FBUyxLQURMLElBRUosQ0FBRSxNQUFNLE1BQU0sR0FBTixDQUFXLElBQVgsRUFBaUIsT0FBakIsQ0FBUixNQUF5QyxTQUYxQyxFQUdFO0FBQ0QsYUFBTyxHQUFQO0FBQ0E7O0FBRUQsV0FBTSxLQUFLLEtBQVg7O0FBRUEsWUFBTyxPQUFPLEdBQVAsS0FBZSxRQUFmOzs7QUFHTixTQUFJLE9BQUosQ0FBYSxPQUFiLEVBQXNCLEVBQXRCLENBSE07OztBQU1OLFlBQU8sSUFBUCxHQUFjLEVBQWQsR0FBbUIsR0FOcEI7QUFPQTs7QUFFRDtBQUNBOztBQUVELGdCQUFhLE9BQU8sVUFBUCxDQUFtQixLQUFuQixDQUFiOztBQUVBLFVBQU8sS0FBSyxJQUFMLENBQVcsVUFBVSxDQUFWLEVBQWM7QUFDL0IsUUFBSSxHQUFKOztBQUVBLFFBQUssS0FBSyxRQUFMLEtBQWtCLENBQXZCLEVBQTJCO0FBQzFCO0FB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QUdDLElBQUksUUFBUSxNQUhiOztBQUtBLFlBQVEsR0FBUixFQUFjO0FBQ2IsZUFBUyxRQUFTLENBQVQsQ0FBVDtBQUNBLFVBQUssT0FBTyxRQUFQLEdBQ0osT0FBTyxPQUFQLENBQWdCLE9BQU8sUUFBUCxDQUFnQixNQUFoQixDQUF1QixHQUF2QixDQUE0QixNQUE1QixDQUFoQixFQUFzRCxNQUF0RCxJQUFpRSxDQUFDLENBRG5FLEVBRUU7QUFDRCxtQkFBWSxJQUFaO0FBQ0E7QUFDRDs7O0FBR0QsU0FBSyxDQUFDLFNBQU4sRUFBa0I7QUFDakIsV0FBSyxhQUFMLEdBQXFCLENBQUMsQ0FBdEI7QUFDQTtBQUNELFlBQU8sTUFBUDtBQUNBO0FBN0RNO0FBZkM7QUFESSxFQUFmOzs7QUFtRkEsUUFBTyxJQUFQLENBQWEsQ0FBRSxPQUFGLEVBQVcsVUFBWCxDQUFiLEVBQXNDLFlBQVc7QUFDaEQsU0FBTyxRQUFQLENBQWlCLElBQWpCLElBQTBCO0FBQ3pCLFFBQUssYUFBVSxJQUFWLEVBQWdCLEtBQWhCLEVBQXdCO0FBQzVCLFFBQUssT0FBTyxPQUFQLENBQWdCLEtBQWhCLENBQUwsRUFBK0I7QUFDOUIsWUFBUyxLQUFLLE9BQUwsR0FBZSxPQUFPLE9BQVAsQ0FBZ0IsT0FBUSxJQUFSLEVBQWUsR0FBZixFQUFoQixFQUFzQyxLQUF0QyxJQUFnRCxDQUFDLENBQXpFO0FBQ0E7QUFDRDtBQUx3QixHQUExQjtBQU9BLE1BQUssQ0FBQyxRQUFRLE9BQWQsRUFBd0I7QUFDdkIsVUFBTyxRQUFQLENBQWlCLElBQWpCLEVBQXdCLEdBQXhCLEdBQThCLFVBQVUsSUFBVixFQUFpQjtBQUM5QyxXQUFPLEtBQUssWUFBTCxDQUFtQixPQUFuQixNQUFpQyxJQUFqQyxHQUF3QyxJQUF4QyxHQUErQyxLQUFLLEtBQTNEO0FBQ0EsSUFGRDtBQUdBO0FBQ0QsRUFiRDtBQWVDLENBaExEIiwiZmlsZSI6InZhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4uL2NvcmVcIixcblx0XCIuL3N1cHBvcnRcIixcblx0XCIuLi9jb3JlL2luaXRcIlxuXSwgZnVuY3Rpb24oIGpRdWVyeSwgc3VwcG9ydCApIHtcblxudmFyIHJyZXR1cm4gPSAvXFxyL2csXG5cdHJzcGFjZXMgPSAvW1xceDIwXFx0XFxyXFxuXFxmXSsvZztcblxualF1ZXJ5LmZuLmV4dGVuZCgge1xuXHR2YWw6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YXIgaG9va3MsIHJldCwgaXNGdW5jdGlvbixcblx0XHRcdGVsZW0gPSB0aGlzWyAwIF07XG5cblx0XHRpZiAoICFhcmd1bWVudHMubGVuZ3RoICkge1xuXHRcdFx0aWYgKCBlbGVtICkge1xuXHRcdFx0XHRob29rcyA9IGpRdWVyeS52YWxIb29rc1sgZWxlbS50eXBlIF0gfHxcblx0XHRcdFx0XHRqUXVlcnkudmFsSG9va3NbIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSBdO1xuXG5cdFx0XHRcdGlmICggaG9va3MgJiZcblx0XHRcdFx0XHRcImdldFwiIGluIGhvb2tzICYmXG5cdFx0XHRcdFx0KCByZXQgPSBob29rcy5nZXQoIGVsZW0sIFwidmFsdWVcIiApICkgIT09IHVuZGVmaW5lZFxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0ID0gZWxlbS52YWx1ZTtcblxuXHRcdFx0XHRyZXR1cm4gdHlwZW9mIHJldCA9PT0gXCJzdHJpbmdcIiA/XG5cblx0XHRcdFx0XHQvLyBIYW5kbGUgbW9zdCBjb21tb24gc3RyaW5nIGNhc2VzXG5cdFx0XHRcdFx0cmV0LnJlcGxhY2UoIHJyZXR1cm4sIFwiXCIgKSA6XG5cblx0XHRcdFx0XHQvLyBIYW5kbGUgY2FzZXMgd2hlcmUgdmFsdWUgaXMgbnVsbC91bmRlZiBvciBudW1iZXJcblx0XHRcdFx0XHRyZXQgPT0gbnVsbCA/IFwiXCIgOiByZXQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpc0Z1bmN0aW9uID0galF1ZXJ5LmlzRnVuY3Rpb24oIHZhbHVlICk7XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbiggaSApIHtcblx0XHRcdHZhciB2YWw7XG5cblx0XHRcdGlmICggdGhpcy5ub2RlVHlwZSAhPT0gMSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGlzRnVuY3Rpb24gKSB7XG5cdFx0XHRcdHZhbCA9IHZhbHVlLmNhbGwoIHRoaXMsIGksIGpRdWVyeSggdGhpcyApLnZhbCgpICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YWwgPSB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVHJlYXQgbnVsbC91bmRlZmluZWQgYXMgXCJcIjsgY29udmVydCBudW1iZXJzIHRvIHN0cmluZ1xuXHRcdFx0aWYgKCB2YWwgPT0gbnVsbCApIHtcblx0XHRcdFx0dmFsID0gXCJcIjtcblxuXHRcdFx0fSBlbHNlIGlmICggdHlwZW9mIHZhbCA9PT0gXCJudW1iZXJcIiApIHtcblx0XHRcdFx0dmFsICs9IFwiXCI7XG5cblx0XHRcdH0gZWxzZSBpZiAoIGpRdWVyeS5pc0FycmF5KCB2YWwgKSApIHtcblx0XHRcdFx0dmFsID0galF1ZXJ5Lm1hcCggdmFsLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHZhbHVlID09IG51bGwgPyBcIlwiIDogdmFsdWUgKyBcIlwiO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cblx0XHRcdGhvb2tzID0galF1ZXJ5LnZhbEhvb2tzWyB0aGlzLnR5cGUgXSB8fCBqUXVlcnkudmFsSG9va3NbIHRoaXMubm9kZU5hbWUudG9Mb3dlckNhc2UoKSBdO1xuXG5cdFx0XHQvLyBJZiBzZXQgcmV0dXJucyB1bmRlZmluZWQsIGZhbGwgYmFjayB0byBub3JtYWwgc2V0dGluZ1xuXHRcdFx0aWYgKCAhaG9va3MgfHwgISggXCJzZXRcIiBpbiBob29rcyApIHx8IGhvb2tzLnNldCggdGhpcywgdmFsLCBcInZhbHVlXCIgKSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxufSApO1xuXG5qUXVlcnkuZXh0ZW5kKCB7XG5cdHZhbEhvb2tzOiB7XG5cdFx0b3B0aW9uOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0XHRcdHZhciB2YWwgPSBqUXVlcnkuZmluZC5hdHRyKCBlbGVtLCBcInZhbHVlXCIgKTtcblx0XHRcdFx0cmV0dXJuIHZhbCAhPSBudWxsID9cblx0XHRcdFx0XHR2YWwgOlxuXG5cdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUxMC0xMStcblx0XHRcdFx0XHQvLyBvcHRpb24udGV4dCB0aHJvd3MgZXhjZXB0aW9ucyAoIzE0Njg2LCAjMTQ4NTgpXG5cdFx0XHRcdFx0Ly8gU3RyaXAgYW5kIGNvbGxhcHNlIHdoaXRlc3BhY2Vcblx0XHRcdFx0XHQvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnLyNzdHJpcC1hbmQtY29sbGFwc2Utd2hpdGVzcGFjZVxuXHRcdFx0XHRcdGpRdWVyeS50cmltKCBqUXVlcnkudGV4dCggZWxlbSApICkucmVwbGFjZSggcnNwYWNlcywgXCIgXCIgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHNlbGVjdDoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0dmFyIHZhbHVlLCBvcHRpb24sXG5cdFx0XHRcdFx0b3B0aW9ucyA9IGVsZW0ub3B0aW9ucyxcblx0XHRcdFx0XHRpbmRleCA9IGVsZW0uc2VsZWN0ZWRJbmRleCxcblx0XHRcdFx0XHRvbmUgPSBlbGVtLnR5cGUgPT09IFwic2VsZWN0LW9uZVwiIHx8IGluZGV4IDwgMCxcblx0XHRcdFx0XHR2YWx1ZXMgPSBvbmUgPyBudWxsIDogW10sXG5cdFx0XHRcdFx0bWF4ID0gb25lID8gaW5kZXggKyAxIDogb3B0aW9ucy5sZW5ndGgsXG5cdFx0XHRcdFx0aSA9IGluZGV4IDwgMCA/XG5cdFx0XHRcdFx0XHRtYXggOlxuXHRcdFx0XHRcdFx0b25lID8gaW5kZXggOiAwO1xuXG5cdFx0XHRcdC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIHNlbGVjdGVkIG9wdGlvbnNcblx0XHRcdFx0Zm9yICggOyBpIDwgbWF4OyBpKysgKSB7XG5cdFx0XHRcdFx0b3B0aW9uID0gb3B0aW9uc1sgaSBdO1xuXG5cdFx0XHRcdFx0Ly8gSUU4LTkgZG9lc24ndCB1cGRhdGUgc2VsZWN0ZWQgYWZ0ZXIgZm9ybSByZXNldCAoIzI1NTEpXG5cdFx0XHRcdFx0aWYgKCAoIG9wdGlvbi5zZWxlY3RlZCB8fCBpID09PSBpbmRleCApICYmXG5cblx0XHRcdFx0XHRcdFx0Ly8gRG9uJ3QgcmV0dXJuIG9wdGlvbnMgdGhhdCBhcmUgZGlzYWJsZWQgb3IgaW4gYSBkaXNhYmxlZCBvcHRncm91cFxuXHRcdFx0XHRcdFx0XHQoIHN1cHBvcnQub3B0RGlzYWJsZWQgP1xuXHRcdFx0XHRcdFx0XHRcdCFvcHRpb24uZGlzYWJsZWQgOiBvcHRpb24uZ2V0QXR0cmlidXRlKCBcImRpc2FibGVkXCIgKSA9PT0gbnVsbCApICYmXG5cdFx0XHRcdFx0XHRcdCggIW9wdGlvbi5wYXJlbnROb2RlLmRpc2FibGVkIHx8XG5cdFx0XHRcdFx0XHRcdFx0IWpRdWVyeS5ub2RlTmFtZSggb3B0aW9uLnBhcmVudE5vZGUsIFwib3B0Z3JvdXBcIiApICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIEdldCB0aGUgc3BlY2lmaWMgdmFsdWUgZm9yIHRoZSBvcHRpb25cblx0XHRcdFx0XHRcdHZhbHVlID0galF1ZXJ5KCBvcHRpb24gKS52YWwoKTtcblxuXHRcdFx0XHRcdFx0Ly8gV2UgZG9uJ3QgbmVlZCBhbiBhcnJheSBmb3Igb25lIHNlbGVjdHNcblx0XHRcdFx0XHRcdGlmICggb25lICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIE11bHRpLVNlbGVjdHMgcmV0dXJuIGFuIGFycmF5XG5cdFx0XHRcdFx0XHR2YWx1ZXMucHVzaCggdmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdmFsdWVzO1xuXHRcdFx0fSxcblxuXHRcdFx0c2V0OiBmdW5jdGlvbiggZWxlbSwgdmFsdWUgKSB7XG5cdFx0XHRcdHZhciBvcHRpb25TZXQsIG9wdGlvbixcblx0XHRcdFx0XHRvcHRpb25zID0gZWxlbS5vcHRpb25zLFxuXHRcdFx0XHRcdHZhbHVlcyA9IGpRdWVyeS5tYWtlQXJyYXkoIHZhbHVlICksXG5cdFx0XHRcdFx0aSA9IG9wdGlvbnMubGVuZ3RoO1xuXG5cdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdG9wdGlvbiA9IG9wdGlvbnNbIGkgXTtcblx0XHRcdFx0XHRpZiAoIG9wdGlvbi5zZWxlY3RlZCA9XG5cdFx0XHRcdFx0XHRqUXVlcnkuaW5BcnJheSggalF1ZXJ5LnZhbEhvb2tzLm9wdGlvbi5nZXQoIG9wdGlvbiApLCB2YWx1ZXMgKSA+IC0xXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRvcHRpb25TZXQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEZvcmNlIGJyb3dzZXJzIHRvIGJlaGF2ZSBjb25zaXN0ZW50bHkgd2hlbiBub24tbWF0Y2hpbmcgdmFsdWUgaXMgc2V0XG5cdFx0XHRcdGlmICggIW9wdGlvblNldCApIHtcblx0XHRcdFx0XHRlbGVtLnNlbGVjdGVkSW5kZXggPSAtMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdmFsdWVzO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufSApO1xuXG4vLyBSYWRpb3MgYW5kIGNoZWNrYm94ZXMgZ2V0dGVyL3NldHRlclxualF1ZXJ5LmVhY2goIFsgXCJyYWRpb1wiLCBcImNoZWNrYm94XCIgXSwgZnVuY3Rpb24oKSB7XG5cdGpRdWVyeS52YWxIb29rc1sgdGhpcyBdID0ge1xuXHRcdHNldDogZnVuY3Rpb24oIGVsZW0sIHZhbHVlICkge1xuXHRcdFx0aWYgKCBqUXVlcnkuaXNBcnJheSggdmFsdWUgKSApIHtcblx0XHRcdFx0cmV0dXJuICggZWxlbS5jaGVja2VkID0galF1ZXJ5LmluQXJyYXkoIGpRdWVyeSggZWxlbSApLnZhbCgpLCB2YWx1ZSApID4gLTEgKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdGlmICggIXN1cHBvcnQuY2hlY2tPbiApIHtcblx0XHRqUXVlcnkudmFsSG9va3NbIHRoaXMgXS5nZXQgPSBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiICkgPT09IG51bGwgPyBcIm9uXCIgOiBlbGVtLnZhbHVlO1xuXHRcdH07XG5cdH1cbn0gKTtcblxufSApO1xuIl19