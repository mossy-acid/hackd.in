"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(["../core", "../var/rnotwhite", "../data/var/dataPriv", "../core/init"], function (jQuery, rnotwhite, dataPriv) {

	var rclass = /[\t\r\n\f]/g;

	function getClass(elem) {
		return elem.getAttribute && elem.getAttribute("class") || "";
	}

	jQuery.fn.extend({
		addClass: function addClass(value) {
			var classes,
			    elem,
			    cur,
			    curValue,
			    clazz,
			    j,
			    finalValue,
			    i = 0;

			if (jQuery.isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).addClass(value.call(this, j, getClass(this)));
				});
			}

			if (typeof value === "string" && value) {
				classes = value.match(rnotwhite) || [];

				while (elem = this[i++]) {
					curValue = getClass(elem);
					cur = elem.nodeType === 1 && (" " + curValue + " ").replace(rclass, " ");

					if (cur) {
						j = 0;
						while (clazz = classes[j++]) {
							if (cur.indexOf(" " + clazz + " ") < 0) {
								cur += clazz + " ";
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim(cur);
						if (curValue !== finalValue) {
							elem.setAttribute("class", finalValue);
						}
					}
				}
			}

			return this;
		},

		removeClass: function removeClass(value) {
			var classes,
			    elem,
			    cur,
			    curValue,
			    clazz,
			    j,
			    finalValue,
			    i = 0;

			if (jQuery.isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).removeClass(value.call(this, j, getClass(this)));
				});
			}

			if (!arguments.length) {
				return this.attr("class", "");
			}

			if (typeof value === "string" && value) {
				classes = value.match(rnotwhite) || [];

				while (elem = this[i++]) {
					curValue = getClass(elem);

					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 && (" " + curValue + " ").replace(rclass, " ");

					if (cur) {
						j = 0;
						while (clazz = classes[j++]) {

							// Remove *all* instances
							while (cur.indexOf(" " + clazz + " ") > -1) {
								cur = cur.replace(" " + clazz + " ", " ");
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim(cur);
						if (curValue !== finalValue) {
							elem.setAttribute("class", finalValue);
						}
					}
				}
			}

			return this;
		},

		toggleClass: function toggleClass(value, stateVal) {
			var type = typeof value === "undefined" ? "undefined" : _typeof(value);

			if (typeof stateVal === "boolean" && type === "string") {
				return stateVal ? this.addClass(value) : this.removeClass(value);
			}

			if (jQuery.isFunction(value)) {
				return this.each(function (i) {
					jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
				});
			}

			return this.each(function () {
				var className, i, self, classNames;

				if (type === "string") {

					// Toggle individual class names
					i = 0;
					self = jQuery(this);
					classNames = value.match(rnotwhite) || [];

					while (className = classNames[i++]) {

						// Check each className given, space separated list
						if (self.hasClass(className)) {
							self.removeClass(className);
						} else {
							self.addClass(className);
						}
					}

					// Toggle whole class name
				} else if (value === undefined || type === "boolean") {
						className = getClass(this);
						if (className) {

							// Store className if set
							dataPriv.set(this, "__className__", className);
						}

						// If the element has a class name or if we're passed `false`,
						// then remove the whole classname (if there was one, the above saved it).
						// Otherwise bring back whatever was previously saved (if anything),
						// falling back to the empty string if nothing was stored.
						if (this.setAttribute) {
							this.setAttribute("class", className || value === false ? "" : dataPriv.get(this, "__className__") || "");
						}
					}
			});
		},

		hasClass: function hasClass(selector) {
			var className,
			    elem,
			    i = 0;

			className = " " + selector + " ";
			while (elem = this[i++]) {
				if (elem.nodeType === 1 && (" " + getClass(elem) + " ").replace(rclass, " ").indexOf(className) > -1) {
					return true;
				}
			}

			return false;
		}
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9hdHRyaWJ1dGVzL2NsYXNzZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQVEsQ0FDUCxTQURPLEVBRVAsa0JBRk8sRUFHUCxzQkFITyxFQUlQLGNBSk8sQ0FBUixFQUtHLFVBQVUsTUFBVixFQUFrQixTQUFsQixFQUE2QixRQUE3QixFQUF3Qzs7QUFFM0MsS0FBSSxTQUFTLGFBQWI7O0FBRUEsVUFBUyxRQUFULENBQW1CLElBQW5CLEVBQTBCO0FBQ3pCLFNBQU8sS0FBSyxZQUFMLElBQXFCLEtBQUssWUFBTCxDQUFtQixPQUFuQixDQUFyQixJQUFxRCxFQUE1RDtBQUNBOztBQUVELFFBQU8sRUFBUCxDQUFVLE1BQVYsQ0FBa0I7QUFDakIsWUFBVSxrQkFBVSxLQUFWLEVBQWtCO0FBQzNCLE9BQUksT0FBSjtPQUFhLElBQWI7T0FBbUIsR0FBbkI7T0FBd0IsUUFBeEI7T0FBa0MsS0FBbEM7T0FBeUMsQ0FBekM7T0FBNEMsVUFBNUM7T0FDQyxJQUFJLENBREw7O0FBR0EsT0FBSyxPQUFPLFVBQVAsQ0FBbUIsS0FBbkIsQ0FBTCxFQUFrQztBQUNqQyxXQUFPLEtBQUssSUFBTCxDQUFXLFVBQVUsQ0FBVixFQUFjO0FBQy9CLFlBQVEsSUFBUixFQUFlLFFBQWYsQ0FBeUIsTUFBTSxJQUFOLENBQVksSUFBWixFQUFrQixDQUFsQixFQUFxQixTQUFVLElBQVYsQ0FBckIsQ0FBekI7QUFDQSxLQUZNLENBQVA7QUFHQTs7QUFFRCxPQUFLLE9BQU8sS0FBUCxLQUFpQixRQUFqQixJQUE2QixLQUFsQyxFQUEwQztBQUN6QyxjQUFVLE1BQU0sS0FBTixDQUFhLFNBQWIsS0FBNEIsRUFBdEM7O0FBRUEsV0FBVSxPQUFPLEtBQU0sR0FBTixDQUFqQixFQUFpQztBQUNoQyxnQkFBVyxTQUFVLElBQVYsQ0FBWDtBQUNBLFdBQU0sS0FBSyxRQUFMLEtBQWtCLENBQWxCLElBQ0ws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QWpCLEVBQWlDO0FBQ2hDLFFBQUssS0FBSyxRQUFMLEtBQWtCLENBQWxCLElBQ0osQ0FBRSxNQUFNLFNBQVUsSUFBVixDQUFOLEdBQXlCLEdBQTNCLEVBQWlDLE9BQWpDLENBQTBDLE1BQTFDLEVBQWtELEdBQWxELEVBQ0UsT0FERixDQUNXLFNBRFgsSUFDeUIsQ0FBQyxDQUYzQixFQUdFO0FBQ0QsWUFBTyxJQUFQO0FBQ0E7QUFDRDs7QUFFRCxVQUFPLEtBQVA7QUFDQTtBQWhLZ0IsRUFBbEI7QUFtS0MsQ0FoTEQiLCJmaWxlIjoiY2xhc3Nlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4uL2NvcmVcIixcblx0XCIuLi92YXIvcm5vdHdoaXRlXCIsXG5cdFwiLi4vZGF0YS92YXIvZGF0YVByaXZcIixcblx0XCIuLi9jb3JlL2luaXRcIlxuXSwgZnVuY3Rpb24oIGpRdWVyeSwgcm5vdHdoaXRlLCBkYXRhUHJpdiApIHtcblxudmFyIHJjbGFzcyA9IC9bXFx0XFxyXFxuXFxmXS9nO1xuXG5mdW5jdGlvbiBnZXRDbGFzcyggZWxlbSApIHtcblx0cmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlICYmIGVsZW0uZ2V0QXR0cmlidXRlKCBcImNsYXNzXCIgKSB8fCBcIlwiO1xufVxuXG5qUXVlcnkuZm4uZXh0ZW5kKCB7XG5cdGFkZENsYXNzOiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFyIGNsYXNzZXMsIGVsZW0sIGN1ciwgY3VyVmFsdWUsIGNsYXp6LCBqLCBmaW5hbFZhbHVlLFxuXHRcdFx0aSA9IDA7XG5cblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCB2YWx1ZSApICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oIGogKSB7XG5cdFx0XHRcdGpRdWVyeSggdGhpcyApLmFkZENsYXNzKCB2YWx1ZS5jYWxsKCB0aGlzLCBqLCBnZXRDbGFzcyggdGhpcyApICkgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZSApIHtcblx0XHRcdGNsYXNzZXMgPSB2YWx1ZS5tYXRjaCggcm5vdHdoaXRlICkgfHwgW107XG5cblx0XHRcdHdoaWxlICggKCBlbGVtID0gdGhpc1sgaSsrIF0gKSApIHtcblx0XHRcdFx0Y3VyVmFsdWUgPSBnZXRDbGFzcyggZWxlbSApO1xuXHRcdFx0XHRjdXIgPSBlbGVtLm5vZGVUeXBlID09PSAxICYmXG5cdFx0XHRcdFx0KCBcIiBcIiArIGN1clZhbHVlICsgXCIgXCIgKS5yZXBsYWNlKCByY2xhc3MsIFwiIFwiICk7XG5cblx0XHRcdFx0aWYgKCBjdXIgKSB7XG5cdFx0XHRcdFx0aiA9IDA7XG5cdFx0XHRcdFx0d2hpbGUgKCAoIGNsYXp6ID0gY2xhc3Nlc1sgaisrIF0gKSApIHtcblx0XHRcdFx0XHRcdGlmICggY3VyLmluZGV4T2YoIFwiIFwiICsgY2xhenogKyBcIiBcIiApIDwgMCApIHtcblx0XHRcdFx0XHRcdFx0Y3VyICs9IGNsYXp6ICsgXCIgXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gT25seSBhc3NpZ24gaWYgZGlmZmVyZW50IHRvIGF2b2lkIHVubmVlZGVkIHJlbmRlcmluZy5cblx0XHRcdFx0XHRmaW5hbFZhbHVlID0galF1ZXJ5LnRyaW0oIGN1ciApO1xuXHRcdFx0XHRcdGlmICggY3VyVmFsdWUgIT09IGZpbmFsVmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRlbGVtLnNldEF0dHJpYnV0ZSggXCJjbGFzc1wiLCBmaW5hbFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0cmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YXIgY2xhc3NlcywgZWxlbSwgY3VyLCBjdXJWYWx1ZSwgY2xhenosIGosIGZpbmFsVmFsdWUsXG5cdFx0XHRpID0gMDtcblxuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHZhbHVlICkgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbiggaiApIHtcblx0XHRcdFx0alF1ZXJ5KCB0aGlzICkucmVtb3ZlQ2xhc3MoIHZhbHVlLmNhbGwoIHRoaXMsIGosIGdldENsYXNzKCB0aGlzICkgKSApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGlmICggIWFyZ3VtZW50cy5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hdHRyKCBcImNsYXNzXCIsIFwiXCIgKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZSApIHtcblx0XHRcdGNsYXNzZXMgPSB2YWx1ZS5tYXRjaCggcm5vdHdoaXRlICkgfHwgW107XG5cblx0XHRcdHdoaWxlICggKCBlbGVtID0gdGhpc1sgaSsrIF0gKSApIHtcblx0XHRcdFx0Y3VyVmFsdWUgPSBnZXRDbGFzcyggZWxlbSApO1xuXG5cdFx0XHRcdC8vIFRoaXMgZXhwcmVzc2lvbiBpcyBoZXJlIGZvciBiZXR0ZXIgY29tcHJlc3NpYmlsaXR5IChzZWUgYWRkQ2xhc3MpXG5cdFx0XHRcdGN1ciA9IGVsZW0ubm9kZVR5cGUgPT09IDEgJiZcblx0XHRcdFx0XHQoIFwiIFwiICsgY3VyVmFsdWUgKyBcIiBcIiApLnJlcGxhY2UoIHJjbGFzcywgXCIgXCIgKTtcblxuXHRcdFx0XHRpZiAoIGN1ciApIHtcblx0XHRcdFx0XHRqID0gMDtcblx0XHRcdFx0XHR3aGlsZSAoICggY2xhenogPSBjbGFzc2VzWyBqKysgXSApICkge1xuXG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgKmFsbCogaW5zdGFuY2VzXG5cdFx0XHRcdFx0XHR3aGlsZSAoIGN1ci5pbmRleE9mKCBcIiBcIiArIGNsYXp6ICsgXCIgXCIgKSA+IC0xICkge1xuXHRcdFx0XHRcdFx0XHRjdXIgPSBjdXIucmVwbGFjZSggXCIgXCIgKyBjbGF6eiArIFwiIFwiLCBcIiBcIiApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIE9ubHkgYXNzaWduIGlmIGRpZmZlcmVudCB0byBhdm9pZCB1bm5lZWRlZCByZW5kZXJpbmcuXG5cdFx0XHRcdFx0ZmluYWxWYWx1ZSA9IGpRdWVyeS50cmltKCBjdXIgKTtcblx0XHRcdFx0XHRpZiAoIGN1clZhbHVlICE9PSBmaW5hbFZhbHVlICkge1xuXHRcdFx0XHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoIFwiY2xhc3NcIiwgZmluYWxWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHRvZ2dsZUNsYXNzOiBmdW5jdGlvbiggdmFsdWUsIHN0YXRlVmFsICkge1xuXHRcdHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuXG5cdFx0aWYgKCB0eXBlb2Ygc3RhdGVWYWwgPT09IFwiYm9vbGVhblwiICYmIHR5cGUgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRyZXR1cm4gc3RhdGVWYWwgPyB0aGlzLmFkZENsYXNzKCB2YWx1ZSApIDogdGhpcy5yZW1vdmVDbGFzcyggdmFsdWUgKTtcblx0XHR9XG5cblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCB2YWx1ZSApICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oIGkgKSB7XG5cdFx0XHRcdGpRdWVyeSggdGhpcyApLnRvZ2dsZUNsYXNzKFxuXHRcdFx0XHRcdHZhbHVlLmNhbGwoIHRoaXMsIGksIGdldENsYXNzKCB0aGlzICksIHN0YXRlVmFsICksXG5cdFx0XHRcdFx0c3RhdGVWYWxcblx0XHRcdFx0KTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBjbGFzc05hbWUsIGksIHNlbGYsIGNsYXNzTmFtZXM7XG5cblx0XHRcdGlmICggdHlwZSA9PT0gXCJzdHJpbmdcIiApIHtcblxuXHRcdFx0XHQvLyBUb2dnbGUgaW5kaXZpZHVhbCBjbGFzcyBuYW1lc1xuXHRcdFx0XHRpID0gMDtcblx0XHRcdFx0c2VsZiA9IGpRdWVyeSggdGhpcyApO1xuXHRcdFx0XHRjbGFzc05hbWVzID0gdmFsdWUubWF0Y2goIHJub3R3aGl0ZSApIHx8IFtdO1xuXG5cdFx0XHRcdHdoaWxlICggKCBjbGFzc05hbWUgPSBjbGFzc05hbWVzWyBpKysgXSApICkge1xuXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgZWFjaCBjbGFzc05hbWUgZ2l2ZW4sIHNwYWNlIHNlcGFyYXRlZCBsaXN0XG5cdFx0XHRcdFx0aWYgKCBzZWxmLmhhc0NsYXNzKCBjbGFzc05hbWUgKSApIHtcblx0XHRcdFx0XHRcdHNlbGYucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzZWxmLmFkZENsYXNzKCBjbGFzc05hbWUgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0Ly8gVG9nZ2xlIHdob2xlIGNsYXNzIG5hbWVcblx0XHRcdH0gZWxzZSBpZiAoIHZhbHVlID09PSB1bmRlZmluZWQgfHwgdHlwZSA9PT0gXCJib29sZWFuXCIgKSB7XG5cdFx0XHRcdGNsYXNzTmFtZSA9IGdldENsYXNzKCB0aGlzICk7XG5cdFx0XHRcdGlmICggY2xhc3NOYW1lICkge1xuXG5cdFx0XHRcdFx0Ly8gU3RvcmUgY2xhc3NOYW1lIGlmIHNldFxuXHRcdFx0XHRcdGRhdGFQcml2LnNldCggdGhpcywgXCJfX2NsYXNzTmFtZV9fXCIsIGNsYXNzTmFtZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSWYgdGhlIGVsZW1lbnQgaGFzIGEgY2xhc3MgbmFtZSBvciBpZiB3ZSdyZSBwYXNzZWQgYGZhbHNlYCxcblx0XHRcdFx0Ly8gdGhlbiByZW1vdmUgdGhlIHdob2xlIGNsYXNzbmFtZSAoaWYgdGhlcmUgd2FzIG9uZSwgdGhlIGFib3ZlIHNhdmVkIGl0KS5cblx0XHRcdFx0Ly8gT3RoZXJ3aXNlIGJyaW5nIGJhY2sgd2hhdGV2ZXIgd2FzIHByZXZpb3VzbHkgc2F2ZWQgKGlmIGFueXRoaW5nKSxcblx0XHRcdFx0Ly8gZmFsbGluZyBiYWNrIHRvIHRoZSBlbXB0eSBzdHJpbmcgaWYgbm90aGluZyB3YXMgc3RvcmVkLlxuXHRcdFx0XHRpZiAoIHRoaXMuc2V0QXR0cmlidXRlICkge1xuXHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCBcImNsYXNzXCIsXG5cdFx0XHRcdFx0XHRjbGFzc05hbWUgfHwgdmFsdWUgPT09IGZhbHNlID9cblx0XHRcdFx0XHRcdFwiXCIgOlxuXHRcdFx0XHRcdFx0ZGF0YVByaXYuZ2V0KCB0aGlzLCBcIl9fY2xhc3NOYW1lX19cIiApIHx8IFwiXCJcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9LFxuXG5cdGhhc0NsYXNzOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0dmFyIGNsYXNzTmFtZSwgZWxlbSxcblx0XHRcdGkgPSAwO1xuXG5cdFx0Y2xhc3NOYW1lID0gXCIgXCIgKyBzZWxlY3RvciArIFwiIFwiO1xuXHRcdHdoaWxlICggKCBlbGVtID0gdGhpc1sgaSsrIF0gKSApIHtcblx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSAmJlxuXHRcdFx0XHQoIFwiIFwiICsgZ2V0Q2xhc3MoIGVsZW0gKSArIFwiIFwiICkucmVwbGFjZSggcmNsYXNzLCBcIiBcIiApXG5cdFx0XHRcdFx0LmluZGV4T2YoIGNsYXNzTmFtZSApID4gLTFcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn0gKTtcblxufSApO1xuIl19