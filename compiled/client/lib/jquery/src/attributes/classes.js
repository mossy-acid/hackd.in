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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9hdHRyaWJ1dGVzL2NsYXNzZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQVEsQ0FDUCxTQURPLEVBRVAsa0JBRk8sRUFHUCxzQkFITyxFQUlQLGNBSk8sQ0FBUixFQUtHLFVBQVUsTUFBVixFQUFrQixTQUFsQixFQUE2QixRQUE3QixFQUF3Qzs7QUFFM0MsS0FBSSxTQUFTLGFBQVQsQ0FGdUM7O0FBSTNDLFVBQVMsUUFBVCxDQUFtQixJQUFuQixFQUEwQjtBQUN6QixTQUFPLEtBQUssWUFBTCxJQUFxQixLQUFLLFlBQUwsQ0FBbUIsT0FBbkIsQ0FBckIsSUFBcUQsRUFBckQsQ0FEa0I7RUFBMUI7O0FBSUEsUUFBTyxFQUFQLENBQVUsTUFBVixDQUFrQjtBQUNqQixZQUFVLGtCQUFVLEtBQVYsRUFBa0I7QUFDM0IsT0FBSSxPQUFKO09BQWEsSUFBYjtPQUFtQixHQUFuQjtPQUF3QixRQUF4QjtPQUFrQyxLQUFsQztPQUF5QyxDQUF6QztPQUE0QyxVQUE1QztPQUNDLElBQUksQ0FBSixDQUYwQjs7QUFJM0IsT0FBSyxPQUFPLFVBQVAsQ0FBbUIsS0FBbkIsQ0FBTCxFQUFrQztBQUNqQyxXQUFPLEtBQUssSUFBTCxDQUFXLFVBQVUsQ0FBVixFQUFjO0FBQy9CLFlBQVEsSUFBUixFQUFlLFFBQWYsQ0FBeUIsTUFBTSxJQUFOLENBQVksSUFBWixFQUFrQixDQUFsQixFQUFxQixTQUFVLElBQVYsQ0FBckIsQ0FBekIsRUFEK0I7S0FBZCxDQUFsQixDQURpQztJQUFsQzs7QUFNQSxPQUFLLE9BQU8sS0FBUCxLQUFpQixRQUFqQixJQUE2QixLQUE3QixFQUFxQztBQUN6QyxjQUFVLE1BQU0sS0FBTixDQUFhLFNBQWIsS0FBNEIsRUFBNUIsQ0FEK0I7O0FBR3pDLFdBQVUsT0FBTyxLQUFNLEdBQU4sQ0FBUCxFQUF1QjtBQUNoQyxnQkFBVyxTQUFVLElBQVYsQ0FBWCxDQURn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LFNBQVMsR0FBVCxDQUFjLElBQWQsRUFBb0IsZUFBcEIsS0FBeUMsRUFBekMsQ0FIRCxDQUR3QjtPQUF6QjtNQVpNO0lBckJVLENBQWxCLENBaEJ3QztHQUE1Qjs7QUE0RGIsWUFBVSxrQkFBVSxRQUFWLEVBQXFCO0FBQzlCLE9BQUksU0FBSjtPQUFlLElBQWY7T0FDQyxJQUFJLENBQUosQ0FGNkI7O0FBSTlCLGVBQVksTUFBTSxRQUFOLEdBQWlCLEdBQWpCLENBSmtCO0FBSzlCLFVBQVUsT0FBTyxLQUFNLEdBQU4sQ0FBUCxFQUF1QjtBQUNoQyxRQUFLLEtBQUssUUFBTCxLQUFrQixDQUFsQixJQUNKLENBQUUsTUFBTSxTQUFVLElBQVYsQ0FBTixHQUF5QixHQUF6QixDQUFGLENBQWlDLE9BQWpDLENBQTBDLE1BQTFDLEVBQWtELEdBQWxELEVBQ0UsT0FERixDQUNXLFNBRFgsSUFDeUIsQ0FBQyxDQUFELEVBQ3hCO0FBQ0QsWUFBTyxJQUFQLENBREM7S0FIRjtJQUREOztBQVNBLFVBQU8sS0FBUCxDQWQ4QjtHQUFyQjtFQWpKWCxFQVIyQztDQUF4QyxDQUxIIiwiZmlsZSI6ImNsYXNzZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuLi9jb3JlXCIsXG5cdFwiLi4vdmFyL3Jub3R3aGl0ZVwiLFxuXHRcIi4uL2RhdGEvdmFyL2RhdGFQcml2XCIsXG5cdFwiLi4vY29yZS9pbml0XCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIHJub3R3aGl0ZSwgZGF0YVByaXYgKSB7XG5cbnZhciByY2xhc3MgPSAvW1xcdFxcclxcblxcZl0vZztcblxuZnVuY3Rpb24gZ2V0Q2xhc3MoIGVsZW0gKSB7XG5cdHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSAmJiBlbGVtLmdldEF0dHJpYnV0ZSggXCJjbGFzc1wiICkgfHwgXCJcIjtcbn1cblxualF1ZXJ5LmZuLmV4dGVuZCgge1xuXHRhZGRDbGFzczogZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdHZhciBjbGFzc2VzLCBlbGVtLCBjdXIsIGN1clZhbHVlLCBjbGF6eiwgaiwgZmluYWxWYWx1ZSxcblx0XHRcdGkgPSAwO1xuXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggdmFsdWUgKSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goIGZ1bmN0aW9uKCBqICkge1xuXHRcdFx0XHRqUXVlcnkoIHRoaXMgKS5hZGRDbGFzcyggdmFsdWUuY2FsbCggdGhpcywgaiwgZ2V0Q2xhc3MoIHRoaXMgKSApICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgdmFsdWUgKSB7XG5cdFx0XHRjbGFzc2VzID0gdmFsdWUubWF0Y2goIHJub3R3aGl0ZSApIHx8IFtdO1xuXG5cdFx0XHR3aGlsZSAoICggZWxlbSA9IHRoaXNbIGkrKyBdICkgKSB7XG5cdFx0XHRcdGN1clZhbHVlID0gZ2V0Q2xhc3MoIGVsZW0gKTtcblx0XHRcdFx0Y3VyID0gZWxlbS5ub2RlVHlwZSA9PT0gMSAmJlxuXHRcdFx0XHRcdCggXCIgXCIgKyBjdXJWYWx1ZSArIFwiIFwiICkucmVwbGFjZSggcmNsYXNzLCBcIiBcIiApO1xuXG5cdFx0XHRcdGlmICggY3VyICkge1xuXHRcdFx0XHRcdGogPSAwO1xuXHRcdFx0XHRcdHdoaWxlICggKCBjbGF6eiA9IGNsYXNzZXNbIGorKyBdICkgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGN1ci5pbmRleE9mKCBcIiBcIiArIGNsYXp6ICsgXCIgXCIgKSA8IDAgKSB7XG5cdFx0XHRcdFx0XHRcdGN1ciArPSBjbGF6eiArIFwiIFwiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIE9ubHkgYXNzaWduIGlmIGRpZmZlcmVudCB0byBhdm9pZCB1bm5lZWRlZCByZW5kZXJpbmcuXG5cdFx0XHRcdFx0ZmluYWxWYWx1ZSA9IGpRdWVyeS50cmltKCBjdXIgKTtcblx0XHRcdFx0XHRpZiAoIGN1clZhbHVlICE9PSBmaW5hbFZhbHVlICkge1xuXHRcdFx0XHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoIFwiY2xhc3NcIiwgZmluYWxWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHJlbW92ZUNsYXNzOiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFyIGNsYXNzZXMsIGVsZW0sIGN1ciwgY3VyVmFsdWUsIGNsYXp6LCBqLCBmaW5hbFZhbHVlLFxuXHRcdFx0aSA9IDA7XG5cblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCB2YWx1ZSApICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oIGogKSB7XG5cdFx0XHRcdGpRdWVyeSggdGhpcyApLnJlbW92ZUNsYXNzKCB2YWx1ZS5jYWxsKCB0aGlzLCBqLCBnZXRDbGFzcyggdGhpcyApICkgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpZiAoICFhcmd1bWVudHMubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYXR0ciggXCJjbGFzc1wiLCBcIlwiICk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgdmFsdWUgKSB7XG5cdFx0XHRjbGFzc2VzID0gdmFsdWUubWF0Y2goIHJub3R3aGl0ZSApIHx8IFtdO1xuXG5cdFx0XHR3aGlsZSAoICggZWxlbSA9IHRoaXNbIGkrKyBdICkgKSB7XG5cdFx0XHRcdGN1clZhbHVlID0gZ2V0Q2xhc3MoIGVsZW0gKTtcblxuXHRcdFx0XHQvLyBUaGlzIGV4cHJlc3Npb24gaXMgaGVyZSBmb3IgYmV0dGVyIGNvbXByZXNzaWJpbGl0eSAoc2VlIGFkZENsYXNzKVxuXHRcdFx0XHRjdXIgPSBlbGVtLm5vZGVUeXBlID09PSAxICYmXG5cdFx0XHRcdFx0KCBcIiBcIiArIGN1clZhbHVlICsgXCIgXCIgKS5yZXBsYWNlKCByY2xhc3MsIFwiIFwiICk7XG5cblx0XHRcdFx0aWYgKCBjdXIgKSB7XG5cdFx0XHRcdFx0aiA9IDA7XG5cdFx0XHRcdFx0d2hpbGUgKCAoIGNsYXp6ID0gY2xhc3Nlc1sgaisrIF0gKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlICphbGwqIGluc3RhbmNlc1xuXHRcdFx0XHRcdFx0d2hpbGUgKCBjdXIuaW5kZXhPZiggXCIgXCIgKyBjbGF6eiArIFwiIFwiICkgPiAtMSApIHtcblx0XHRcdFx0XHRcdFx0Y3VyID0gY3VyLnJlcGxhY2UoIFwiIFwiICsgY2xhenogKyBcIiBcIiwgXCIgXCIgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBPbmx5IGFzc2lnbiBpZiBkaWZmZXJlbnQgdG8gYXZvaWQgdW5uZWVkZWQgcmVuZGVyaW5nLlxuXHRcdFx0XHRcdGZpbmFsVmFsdWUgPSBqUXVlcnkudHJpbSggY3VyICk7XG5cdFx0XHRcdFx0aWYgKCBjdXJWYWx1ZSAhPT0gZmluYWxWYWx1ZSApIHtcblx0XHRcdFx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKCBcImNsYXNzXCIsIGZpbmFsVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR0b2dnbGVDbGFzczogZnVuY3Rpb24oIHZhbHVlLCBzdGF0ZVZhbCApIHtcblx0XHR2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcblxuXHRcdGlmICggdHlwZW9mIHN0YXRlVmFsID09PSBcImJvb2xlYW5cIiAmJiB0eXBlID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0cmV0dXJuIHN0YXRlVmFsID8gdGhpcy5hZGRDbGFzcyggdmFsdWUgKSA6IHRoaXMucmVtb3ZlQ2xhc3MoIHZhbHVlICk7XG5cdFx0fVxuXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggdmFsdWUgKSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goIGZ1bmN0aW9uKCBpICkge1xuXHRcdFx0XHRqUXVlcnkoIHRoaXMgKS50b2dnbGVDbGFzcyhcblx0XHRcdFx0XHR2YWx1ZS5jYWxsKCB0aGlzLCBpLCBnZXRDbGFzcyggdGhpcyApLCBzdGF0ZVZhbCApLFxuXHRcdFx0XHRcdHN0YXRlVmFsXG5cdFx0XHRcdCk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgY2xhc3NOYW1lLCBpLCBzZWxmLCBjbGFzc05hbWVzO1xuXG5cdFx0XHRpZiAoIHR5cGUgPT09IFwic3RyaW5nXCIgKSB7XG5cblx0XHRcdFx0Ly8gVG9nZ2xlIGluZGl2aWR1YWwgY2xhc3MgbmFtZXNcblx0XHRcdFx0aSA9IDA7XG5cdFx0XHRcdHNlbGYgPSBqUXVlcnkoIHRoaXMgKTtcblx0XHRcdFx0Y2xhc3NOYW1lcyA9IHZhbHVlLm1hdGNoKCBybm90d2hpdGUgKSB8fCBbXTtcblxuXHRcdFx0XHR3aGlsZSAoICggY2xhc3NOYW1lID0gY2xhc3NOYW1lc1sgaSsrIF0gKSApIHtcblxuXHRcdFx0XHRcdC8vIENoZWNrIGVhY2ggY2xhc3NOYW1lIGdpdmVuLCBzcGFjZSBzZXBhcmF0ZWQgbGlzdFxuXHRcdFx0XHRcdGlmICggc2VsZi5oYXNDbGFzcyggY2xhc3NOYW1lICkgKSB7XG5cdFx0XHRcdFx0XHRzZWxmLnJlbW92ZUNsYXNzKCBjbGFzc05hbWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VsZi5hZGRDbGFzcyggY2xhc3NOYW1lICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdC8vIFRvZ2dsZSB3aG9sZSBjbGFzcyBuYW1lXG5cdFx0XHR9IGVsc2UgaWYgKCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGUgPT09IFwiYm9vbGVhblwiICkge1xuXHRcdFx0XHRjbGFzc05hbWUgPSBnZXRDbGFzcyggdGhpcyApO1xuXHRcdFx0XHRpZiAoIGNsYXNzTmFtZSApIHtcblxuXHRcdFx0XHRcdC8vIFN0b3JlIGNsYXNzTmFtZSBpZiBzZXRcblx0XHRcdFx0XHRkYXRhUHJpdi5zZXQoIHRoaXMsIFwiX19jbGFzc05hbWVfX1wiLCBjbGFzc05hbWUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIElmIHRoZSBlbGVtZW50IGhhcyBhIGNsYXNzIG5hbWUgb3IgaWYgd2UncmUgcGFzc2VkIGBmYWxzZWAsXG5cdFx0XHRcdC8vIHRoZW4gcmVtb3ZlIHRoZSB3aG9sZSBjbGFzc25hbWUgKGlmIHRoZXJlIHdhcyBvbmUsIHRoZSBhYm92ZSBzYXZlZCBpdCkuXG5cdFx0XHRcdC8vIE90aGVyd2lzZSBicmluZyBiYWNrIHdoYXRldmVyIHdhcyBwcmV2aW91c2x5IHNhdmVkIChpZiBhbnl0aGluZyksXG5cdFx0XHRcdC8vIGZhbGxpbmcgYmFjayB0byB0aGUgZW1wdHkgc3RyaW5nIGlmIG5vdGhpbmcgd2FzIHN0b3JlZC5cblx0XHRcdFx0aWYgKCB0aGlzLnNldEF0dHJpYnV0ZSApIHtcblx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggXCJjbGFzc1wiLFxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lIHx8IHZhbHVlID09PSBmYWxzZSA/XG5cdFx0XHRcdFx0XHRcIlwiIDpcblx0XHRcdFx0XHRcdGRhdGFQcml2LmdldCggdGhpcywgXCJfX2NsYXNzTmFtZV9fXCIgKSB8fCBcIlwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSxcblxuXHRoYXNDbGFzczogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHZhciBjbGFzc05hbWUsIGVsZW0sXG5cdFx0XHRpID0gMDtcblxuXHRcdGNsYXNzTmFtZSA9IFwiIFwiICsgc2VsZWN0b3IgKyBcIiBcIjtcblx0XHR3aGlsZSAoICggZWxlbSA9IHRoaXNbIGkrKyBdICkgKSB7XG5cdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgJiZcblx0XHRcdFx0KCBcIiBcIiArIGdldENsYXNzKCBlbGVtICkgKyBcIiBcIiApLnJlcGxhY2UoIHJjbGFzcywgXCIgXCIgKVxuXHRcdFx0XHRcdC5pbmRleE9mKCBjbGFzc05hbWUgKSA+IC0xXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59ICk7XG5cbn0gKTtcbiJdfQ==