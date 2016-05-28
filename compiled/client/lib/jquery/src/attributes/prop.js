"use strict";

define(["../core", "../core/access", "./support", "../selector"], function (jQuery, access, support) {

	var rfocusable = /^(?:input|select|textarea|button)$/i,
	    rclickable = /^(?:a|area)$/i;

	jQuery.fn.extend({
		prop: function prop(name, value) {
			return access(this, jQuery.prop, name, value, arguments.length > 1);
		},

		removeProp: function removeProp(name) {
			return this.each(function () {
				delete this[jQuery.propFix[name] || name];
			});
		}
	});

	jQuery.extend({
		prop: function prop(elem, name, value) {
			var ret,
			    hooks,
			    nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {

				// Fix name and attach hooks
				name = jQuery.propFix[name] || name;
				hooks = jQuery.propHooks[name];
			}

			if (value !== undefined) {
				if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;
				}

				return elem[name] = value;
			}

			if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
				return ret;
			}

			return elem[name];
		},

		propHooks: {
			tabIndex: {
				get: function get(elem) {

					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr(elem, "tabindex");

					return tabindex ? parseInt(tabindex, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : -1;
				}
			}
		},

		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	});

	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	if (!support.optSelected) {
		jQuery.propHooks.selected = {
			get: function get(elem) {
				var parent = elem.parentNode;
				if (parent && parent.parentNode) {
					parent.parentNode.selectedIndex;
				}
				return null;
			},
			set: function set(elem) {
				var parent = elem.parentNode;
				if (parent) {
					parent.selectedIndex;

					if (parent.parentNode) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}

	jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
		jQuery.propFix[this.toLowerCase()] = this;
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9hdHRyaWJ1dGVzL3Byb3AuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1AsU0FETyxFQUVQLGdCQUZPLEVBR1AsV0FITyxFQUlQLGFBSk8sQ0FBUixFQUtHLFVBQVUsTUFBVixFQUFrQixNQUFsQixFQUEwQixPQUExQixFQUFvQzs7QUFFdkMsS0FBSSxhQUFhLHFDQUFiO0tBQ0gsYUFBYSxlQUFiLENBSHNDOztBQUt2QyxRQUFPLEVBQVAsQ0FBVSxNQUFWLENBQWtCO0FBQ2pCLFFBQU0sY0FBVSxJQUFWLEVBQWdCLEtBQWhCLEVBQXdCO0FBQzdCLFVBQU8sT0FBUSxJQUFSLEVBQWMsT0FBTyxJQUFQLEVBQWEsSUFBM0IsRUFBaUMsS0FBakMsRUFBd0MsVUFBVSxNQUFWLEdBQW1CLENBQW5CLENBQS9DLENBRDZCO0dBQXhCOztBQUlOLGNBQVksb0JBQVUsSUFBVixFQUFpQjtBQUM1QixVQUFPLEtBQUssSUFBTCxDQUFXLFlBQVc7QUFDNUIsV0FBTyxLQUFNLE9BQU8sT0FBUCxDQUFnQixJQUFoQixLQUEwQixJQUExQixDQUFiLENBRDRCO0lBQVgsQ0FBbEIsQ0FENEI7R0FBakI7RUFMYixFQUx1Qzs7QUFpQnZDLFFBQU8sTUFBUCxDQUFlO0FBQ2QsUUFBTSxjQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0IsS0FBdEIsRUFBOEI7QUFDbkMsT0FBSSxHQUFKO09BQVMsS0FBVDtPQUNDLFFBQVEsS0FBSyxRQUFMOzs7QUFGMEIsT0FLOUIsVUFBVSxDQUFWLElBQWUsVUFBVSxDQUFWLElBQWUsVUFBVSxDQUFWLEVBQWM7QUFDaEQsV0FEZ0Q7SUFBakQ7O0FBSUEsT0FBSyxVQUFVLENBQVYsSUFBZSxDQUFDLE9BQU8sUUFBUCxDQUFpQixJQUFqQixDQUFELEVBQTJCOzs7QUFHOUMsV0FBTyxPQUFPLE9BQVAsQ0FBZ0IsSUFBaEIsS0FBMEIsSUFBMUIsQ0FIdUM7QUFJOUMsWUFBUSxPQUFPLFNBQVAsQ0FBa0IsSUFBbEIsQ0FBUixDQUo4QztJQUEvQzs7QUFPQSxPQUFLLFVBQVUsU0FBVixFQUFzQjtBQUMxQixRQUFLLFNBQVMsU0FBUyxLQUFULElBQ2IsQ0FBRSxNQUFNLE1BQU0sR0FBTixDQUFXLElBQVgsRUFBaUIsS0FBakIsRUFBd0IsSUFBeEIsQ0FBTixDQUFGLEtBQTZDLFNBQTdDLEVBQXlEO0FBQ3pELFlBQU8sR0FBUCxDQUR5RDtLQUQxRDs7QUFLQSxXQUFTLEtBQU0sSUFBTixJQUFlLEtBQWYsQ0FOaUI7SUFBM0I7O0FBU0EsT0FBSyxTQUFTLFNBQVMsS0FBVCxJQUFrQixDQUFFLE1BQU0sTUFBTSxHQUFOLENBQVcsSUFBWCxFQUFpQixJQUFqQixDQUFOLENBQUYsS0FBc0MsSUFBdEMsRUFBNkM7QUFDNUUsV0FBTyxHQUFQLENBRDRFO0lBQTdFOztBQUlBLFVBQU8sS0FBTSxJQUFOLENBQVAsQ0E3Qm1DO0dBQTlCOztBQWdDTixhQUFXO0FBQ1YsYUFBVTtBQUNULFNBQUssYUFBVSxJQUFWLEVBQWlCOzs7Ozs7QUFNckIsU0FBSSxXQUFXLE9BQU8sSUFBUCxDQUFZLElBQVosQ0FBa0IsSUFBbEIsRUFBd0IsVUFBeEIsQ0FBWCxDQU5pQjs7QUFRckIsWUFBTyxXQUNOLFNBQVUsUUFBVixFQUFvQixFQUFwQixDQURNLEdBRU4sV0FBVyxJQUFYLENBQWlCLEtBQUssUUFBTCxDQUFqQixJQUNDLFdBQVcsSUFBWCxDQUFpQixLQUFLLFFBQUwsQ0FBakIsSUFBb0MsS0FBSyxJQUFMLEdBQ25DLENBRkYsR0FHRSxDQUFDLENBQUQsQ0Fia0I7S0FBakI7SUFETjtHQUREOztBQW9CQSxXQUFTO0FBQ1IsVUFBTyxTQUFQO0FBQ0EsWUFBUyxXQUFUO0dBRkQ7RUFyREQ7Ozs7Ozs7O0FBakJ1QyxLQWtGbEMsQ0FBQyxRQUFRLFdBQVIsRUFBc0I7QUFDM0IsU0FBTyxTQUFQLENBQWlCLFFBQWpCLEdBQTRCO0FBQzNCLFFBQUssYUFBVSxJQUFWLEVBQWlCO0FBQ3JCLFFBQUksU0FBUyxLQUFLLFVBQUwsQ0FEUTtBQUVyQixRQUFLLFVBQVUsT0FBTyxVQUFQLEVBQW9CO0FBQ2xDLFlBQU8sVUFBUCxDQUFrQixhQUFsQixDQURrQztLQUFuQztBQUdBLFdBQU8sSUFBUCxDQUxxQjtJQUFqQjtBQU9MLFFBQUssYUFBVSxJQUFWLEVBQWlCO0FBQ3JCLFFBQUksU0FBUyxLQUFLLFVBQUwsQ0FEUTtBQUVyQixRQUFLLE1BQUwsRUFBYztBQUNiLFlBQU8sYUFBUCxDQURhOztBQUdiLFNBQUssT0FBTyxVQUFQLEVBQW9CO0FBQ3hCLGFBQU8sVUFBUCxDQUFrQixhQUFsQixDQUR3QjtNQUF6QjtLQUhEO0lBRkk7R0FSTixDQUQyQjtFQUE1Qjs7QUFzQkEsUUFBTyxJQUFQLENBQWEsQ0FDWixVQURZLEVBRVosVUFGWSxFQUdaLFdBSFksRUFJWixhQUpZLEVBS1osYUFMWSxFQU1aLFNBTlksRUFPWixTQVBZLEVBUVosUUFSWSxFQVNaLGFBVFksRUFVWixpQkFWWSxDQUFiLEVBV0csWUFBVztBQUNiLFNBQU8sT0FBUCxDQUFnQixLQUFLLFdBQUwsRUFBaEIsSUFBdUMsSUFBdkMsQ0FEYTtFQUFYLENBWEgsQ0F4R3VDO0NBQXBDLENBTEgiLCJmaWxlIjoicHJvcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4uL2NvcmVcIixcblx0XCIuLi9jb3JlL2FjY2Vzc1wiLFxuXHRcIi4vc3VwcG9ydFwiLFxuXHRcIi4uL3NlbGVjdG9yXCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIGFjY2Vzcywgc3VwcG9ydCApIHtcblxudmFyIHJmb2N1c2FibGUgPSAvXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxidXR0b24pJC9pLFxuXHRyY2xpY2thYmxlID0gL14oPzphfGFyZWEpJC9pO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKCB7XG5cdHByb3A6IGZ1bmN0aW9uKCBuYW1lLCB2YWx1ZSApIHtcblx0XHRyZXR1cm4gYWNjZXNzKCB0aGlzLCBqUXVlcnkucHJvcCwgbmFtZSwgdmFsdWUsIGFyZ3VtZW50cy5sZW5ndGggPiAxICk7XG5cdH0sXG5cblx0cmVtb3ZlUHJvcDogZnVuY3Rpb24oIG5hbWUgKSB7XG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRkZWxldGUgdGhpc1sgalF1ZXJ5LnByb3BGaXhbIG5hbWUgXSB8fCBuYW1lIF07XG5cdFx0fSApO1xuXHR9XG59ICk7XG5cbmpRdWVyeS5leHRlbmQoIHtcblx0cHJvcDogZnVuY3Rpb24oIGVsZW0sIG5hbWUsIHZhbHVlICkge1xuXHRcdHZhciByZXQsIGhvb2tzLFxuXHRcdFx0blR5cGUgPSBlbGVtLm5vZGVUeXBlO1xuXG5cdFx0Ly8gRG9uJ3QgZ2V0L3NldCBwcm9wZXJ0aWVzIG9uIHRleHQsIGNvbW1lbnQgYW5kIGF0dHJpYnV0ZSBub2Rlc1xuXHRcdGlmICggblR5cGUgPT09IDMgfHwgblR5cGUgPT09IDggfHwgblR5cGUgPT09IDIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCBuVHlwZSAhPT0gMSB8fCAhalF1ZXJ5LmlzWE1MRG9jKCBlbGVtICkgKSB7XG5cblx0XHRcdC8vIEZpeCBuYW1lIGFuZCBhdHRhY2ggaG9va3Ncblx0XHRcdG5hbWUgPSBqUXVlcnkucHJvcEZpeFsgbmFtZSBdIHx8IG5hbWU7XG5cdFx0XHRob29rcyA9IGpRdWVyeS5wcm9wSG9va3NbIG5hbWUgXTtcblx0XHR9XG5cblx0XHRpZiAoIHZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRpZiAoIGhvb2tzICYmIFwic2V0XCIgaW4gaG9va3MgJiZcblx0XHRcdFx0KCByZXQgPSBob29rcy5zZXQoIGVsZW0sIHZhbHVlLCBuYW1lICkgKSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gKCBlbGVtWyBuYW1lIF0gPSB2YWx1ZSApO1xuXHRcdH1cblxuXHRcdGlmICggaG9va3MgJiYgXCJnZXRcIiBpbiBob29rcyAmJiAoIHJldCA9IGhvb2tzLmdldCggZWxlbSwgbmFtZSApICkgIT09IG51bGwgKSB7XG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH1cblxuXHRcdHJldHVybiBlbGVtWyBuYW1lIF07XG5cdH0sXG5cblx0cHJvcEhvb2tzOiB7XG5cdFx0dGFiSW5kZXg6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHRcdFx0Ly8gZWxlbS50YWJJbmRleCBkb2Vzbid0IGFsd2F5cyByZXR1cm4gdGhlXG5cdFx0XHRcdC8vIGNvcnJlY3QgdmFsdWUgd2hlbiBpdCBoYXNuJ3QgYmVlbiBleHBsaWNpdGx5IHNldFxuXHRcdFx0XHQvLyBodHRwOi8vZmx1aWRwcm9qZWN0Lm9yZy9ibG9nLzIwMDgvMDEvMDkvZ2V0dGluZy1zZXR0aW5nLWFuZC1yZW1vdmluZy10YWJpbmRleC12YWx1ZXMtd2l0aC1qYXZhc2NyaXB0L1xuXHRcdFx0XHQvLyBVc2UgcHJvcGVyIGF0dHJpYnV0ZSByZXRyaWV2YWwoIzEyMDcyKVxuXHRcdFx0XHR2YXIgdGFiaW5kZXggPSBqUXVlcnkuZmluZC5hdHRyKCBlbGVtLCBcInRhYmluZGV4XCIgKTtcblxuXHRcdFx0XHRyZXR1cm4gdGFiaW5kZXggP1xuXHRcdFx0XHRcdHBhcnNlSW50KCB0YWJpbmRleCwgMTAgKSA6XG5cdFx0XHRcdFx0cmZvY3VzYWJsZS50ZXN0KCBlbGVtLm5vZGVOYW1lICkgfHxcblx0XHRcdFx0XHRcdHJjbGlja2FibGUudGVzdCggZWxlbS5ub2RlTmFtZSApICYmIGVsZW0uaHJlZiA/XG5cdFx0XHRcdFx0XHRcdDAgOlxuXHRcdFx0XHRcdFx0XHQtMTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0cHJvcEZpeDoge1xuXHRcdFwiZm9yXCI6IFwiaHRtbEZvclwiLFxuXHRcdFwiY2xhc3NcIjogXCJjbGFzc05hbWVcIlxuXHR9XG59ICk7XG5cbi8vIFN1cHBvcnQ6IElFIDw9MTEgb25seVxuLy8gQWNjZXNzaW5nIHRoZSBzZWxlY3RlZEluZGV4IHByb3BlcnR5XG4vLyBmb3JjZXMgdGhlIGJyb3dzZXIgdG8gcmVzcGVjdCBzZXR0aW5nIHNlbGVjdGVkXG4vLyBvbiB0aGUgb3B0aW9uXG4vLyBUaGUgZ2V0dGVyIGVuc3VyZXMgYSBkZWZhdWx0IG9wdGlvbiBpcyBzZWxlY3RlZFxuLy8gd2hlbiBpbiBhbiBvcHRncm91cFxuaWYgKCAhc3VwcG9ydC5vcHRTZWxlY3RlZCApIHtcblx0alF1ZXJ5LnByb3BIb29rcy5zZWxlY3RlZCA9IHtcblx0XHRnZXQ6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIHBhcmVudCA9IGVsZW0ucGFyZW50Tm9kZTtcblx0XHRcdGlmICggcGFyZW50ICYmIHBhcmVudC5wYXJlbnROb2RlICkge1xuXHRcdFx0XHRwYXJlbnQucGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIHBhcmVudCA9IGVsZW0ucGFyZW50Tm9kZTtcblx0XHRcdGlmICggcGFyZW50ICkge1xuXHRcdFx0XHRwYXJlbnQuc2VsZWN0ZWRJbmRleDtcblxuXHRcdFx0XHRpZiAoIHBhcmVudC5wYXJlbnROb2RlICkge1xuXHRcdFx0XHRcdHBhcmVudC5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5cbmpRdWVyeS5lYWNoKCBbXG5cdFwidGFiSW5kZXhcIixcblx0XCJyZWFkT25seVwiLFxuXHRcIm1heExlbmd0aFwiLFxuXHRcImNlbGxTcGFjaW5nXCIsXG5cdFwiY2VsbFBhZGRpbmdcIixcblx0XCJyb3dTcGFuXCIsXG5cdFwiY29sU3BhblwiLFxuXHRcInVzZU1hcFwiLFxuXHRcImZyYW1lQm9yZGVyXCIsXG5cdFwiY29udGVudEVkaXRhYmxlXCJcbl0sIGZ1bmN0aW9uKCkge1xuXHRqUXVlcnkucHJvcEZpeFsgdGhpcy50b0xvd2VyQ2FzZSgpIF0gPSB0aGlzO1xufSApO1xuXG59ICk7XG4iXX0=