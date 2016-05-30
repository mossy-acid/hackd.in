"use strict";

define(["./core", "./core/init", "./manipulation", // clone
"./traversing" // parent, contents
], function (jQuery) {

	jQuery.fn.extend({
		wrapAll: function wrapAll(html) {
			var wrap;

			if (jQuery.isFunction(html)) {
				return this.each(function (i) {
					jQuery(this).wrapAll(html.call(this, i));
				});
			}

			if (this[0]) {

				// The elements to wrap the target around
				wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

				if (this[0].parentNode) {
					wrap.insertBefore(this[0]);
				}

				wrap.map(function () {
					var elem = this;

					while (elem.firstElementChild) {
						elem = elem.firstElementChild;
					}

					return elem;
				}).append(this);
			}

			return this;
		},

		wrapInner: function wrapInner(html) {
			if (jQuery.isFunction(html)) {
				return this.each(function (i) {
					jQuery(this).wrapInner(html.call(this, i));
				});
			}

			return this.each(function () {
				var self = jQuery(this),
				    contents = self.contents();

				if (contents.length) {
					contents.wrapAll(html);
				} else {
					self.append(html);
				}
			});
		},

		wrap: function wrap(html) {
			var isFunction = jQuery.isFunction(html);

			return this.each(function (i) {
				jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
			});
		},

		unwrap: function unwrap() {
			return this.parent().each(function () {
				if (!jQuery.nodeName(this, "body")) {
					jQuery(this).replaceWith(this.childNodes);
				}
			}).end();
		}
	});

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy93cmFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxDQUNQLFFBRE8sRUFFUCxhQUZPLEVBR1AsZ0JBSE8sRTtBQUlQLGM7QUFKTyxDQUFSLEVBS0csVUFBVSxNQUFWLEVBQW1COztBQUV0QixRQUFPLEVBQVAsQ0FBVSxNQUFWLENBQWtCO0FBQ2pCLFdBQVMsaUJBQVUsSUFBVixFQUFpQjtBQUN6QixPQUFJLElBQUo7O0FBRUEsT0FBSyxPQUFPLFVBQVAsQ0FBbUIsSUFBbkIsQ0FBTCxFQUFpQztBQUNoQyxXQUFPLEtBQUssSUFBTCxDQUFXLFVBQVUsQ0FBVixFQUFjO0FBQy9CLFlBQVEsSUFBUixFQUFlLE9BQWYsQ0FBd0IsS0FBSyxJQUFMLENBQVcsSUFBWCxFQUFpQixDQUFqQixDQUF4QjtBQUNBLEtBRk0sQ0FBUDtBQUdBOztBQUVELE9BQUssS0FBTSxDQUFOLENBQUwsRUFBaUI7OztBQUdoQixXQUFPLE9BQVEsSUFBUixFQUFjLEtBQU0sQ0FBTixFQUFVLGFBQXhCLEVBQXdDLEVBQXhDLENBQTRDLENBQTVDLEVBQWdELEtBQWhELENBQXVELElBQXZELENBQVA7O0FBRUEsUUFBSyxLQUFNLENBQU4sRUFBVSxVQUFmLEVBQTRCO0FBQzNCLFVBQUssWUFBTCxDQUFtQixLQUFNLENBQU4sQ0FBbkI7QUFDQTs7QUFFRCxTQUFLLEdBQUwsQ0FBVSxZQUFXO0FBQ3BCLFNBQUksT0FBTyxJQUFYOztBQUVBLFlBQVEsS0FBSyxpQkFBYixFQUFpQztBQUNoQyxhQUFPLEtBQUssaUJBQVo7QUFDQTs7QUFFRCxZQUFPLElBQVA7QUFDQSxLQVJELEVBUUksTUFSSixDQVFZLElBUlo7QUFTQTs7QUFFRCxVQUFPLElBQVA7QUFDQSxHQS9CZ0I7O0FBaUNqQixhQUFXLG1CQUFVLElBQVYsRUFBaUI7QUFDM0IsT0FBSyxPQUFPLFVBQVAsQ0FBbUIsSUFBbkIsQ0FBTCxFQUFpQztBQUNoQyxXQUFPLEtBQUssSUFBTCxDQUFXLFVBQVUsQ0FBVixFQUFjO0FBQy9CLFlBQVEsSUFBUixFQUFlLFNBQWYsQ0FBMEIsS0FBSyxJQUFMLENBQVcsSUFBWCxFQUFpQixDQUFqQixDQUExQjtBQUNBLEtBRk0sQ0FBUDtBQUdBOztBQUVELFVBQU8sS0FBSyxJQUFMLENBQVcsWUFBVztBQUM1QixRQUFJLE9BQU8sT0FBUSxJQUFSLENBQVg7UUFDQyxXQUFXLEtBQUssUUFBTCxFQURaOztBQUdBLFFBQUssU0FBUyxNQUFkLEVBQXVCO0FBQ3RCLGNBQVMsT0FBVCxDQUFrQixJQUFsQjtBQUVBLEtBSEQsTUFHTztBQUNOLFVBQUssTUFBTCxDQUFhLElBQWI7QUFDQTtBQUNELElBVk0sQ0FBUDtBQVdBLEdBbkRnQjs7QUFxRGpCLFFBQU0sY0FBVSxJQUFWLEVBQWlCO0FBQ3RCLE9BQUksYUFBYSxPQUFPLFVBQVAsQ0FBbUIsSUFBbkIsQ0FBakI7O0FBRUEsVUFBTyxLQUFLLElBQUwsQ0FBVyxVQUFVLENBQVYsRUFBYztBQUMvQixXQUFRLElBQVIsRUFBZSxPQUFmLENBQXdCLGFBQWEsS0FBSyxJQUFMLENBQVcsSUFBWCxFQUFpQixDQUFqQixDQUFiLEdBQW9DLElBQTVEO0FBQ0EsSUFGTSxDQUFQO0FBR0EsR0EzRGdCOztBQTZEakIsVUFBUSxrQkFBVztBQUNsQixVQUFPLEtBQUssTUFBTCxHQUFjLElBQWQsQ0FBb0IsWUFBVztBQUNyQyxRQUFLLENBQUMsT0FBTyxRQUFQLENBQWlCLElBQWpCLEVBQXVCLE1BQXZCLENBQU4sRUFBd0M7QUFDdkMsWUFBUSxJQUFSLEVBQWUsV0FBZixDQUE0QixLQUFLLFVBQWpDO0FBQ0E7QUFDRCxJQUpNLEVBSUgsR0FKRyxFQUFQO0FBS0E7QUFuRWdCLEVBQWxCOztBQXNFQSxRQUFPLE1BQVA7QUFDQyxDQTlFRCIsImZpbGUiOiJ3cmFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBbXG5cdFwiLi9jb3JlXCIsXG5cdFwiLi9jb3JlL2luaXRcIixcblx0XCIuL21hbmlwdWxhdGlvblwiLCAvLyBjbG9uZVxuXHRcIi4vdHJhdmVyc2luZ1wiIC8vIHBhcmVudCwgY29udGVudHNcbl0sIGZ1bmN0aW9uKCBqUXVlcnkgKSB7XG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblx0d3JhcEFsbDogZnVuY3Rpb24oIGh0bWwgKSB7XG5cdFx0dmFyIHdyYXA7XG5cblx0XHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBodG1sICkgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbiggaSApIHtcblx0XHRcdFx0alF1ZXJ5KCB0aGlzICkud3JhcEFsbCggaHRtbC5jYWxsKCB0aGlzLCBpICkgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpZiAoIHRoaXNbIDAgXSApIHtcblxuXHRcdFx0Ly8gVGhlIGVsZW1lbnRzIHRvIHdyYXAgdGhlIHRhcmdldCBhcm91bmRcblx0XHRcdHdyYXAgPSBqUXVlcnkoIGh0bWwsIHRoaXNbIDAgXS5vd25lckRvY3VtZW50ICkuZXEoIDAgKS5jbG9uZSggdHJ1ZSApO1xuXG5cdFx0XHRpZiAoIHRoaXNbIDAgXS5wYXJlbnROb2RlICkge1xuXHRcdFx0XHR3cmFwLmluc2VydEJlZm9yZSggdGhpc1sgMCBdICk7XG5cdFx0XHR9XG5cblx0XHRcdHdyYXAubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGVsZW0gPSB0aGlzO1xuXG5cdFx0XHRcdHdoaWxlICggZWxlbS5maXJzdEVsZW1lbnRDaGlsZCApIHtcblx0XHRcdFx0XHRlbGVtID0gZWxlbS5maXJzdEVsZW1lbnRDaGlsZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBlbGVtO1xuXHRcdFx0fSApLmFwcGVuZCggdGhpcyApO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHdyYXBJbm5lcjogZnVuY3Rpb24oIGh0bWwgKSB7XG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggaHRtbCApICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oIGkgKSB7XG5cdFx0XHRcdGpRdWVyeSggdGhpcyApLndyYXBJbm5lciggaHRtbC5jYWxsKCB0aGlzLCBpICkgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxmID0galF1ZXJ5KCB0aGlzICksXG5cdFx0XHRcdGNvbnRlbnRzID0gc2VsZi5jb250ZW50cygpO1xuXG5cdFx0XHRpZiAoIGNvbnRlbnRzLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGVudHMud3JhcEFsbCggaHRtbCApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWxmLmFwcGVuZCggaHRtbCApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSxcblxuXHR3cmFwOiBmdW5jdGlvbiggaHRtbCApIHtcblx0XHR2YXIgaXNGdW5jdGlvbiA9IGpRdWVyeS5pc0Z1bmN0aW9uKCBodG1sICk7XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbiggaSApIHtcblx0XHRcdGpRdWVyeSggdGhpcyApLndyYXBBbGwoIGlzRnVuY3Rpb24gPyBodG1sLmNhbGwoIHRoaXMsIGkgKSA6IGh0bWwgKTtcblx0XHR9ICk7XG5cdH0sXG5cblx0dW53cmFwOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5wYXJlbnQoKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggIWpRdWVyeS5ub2RlTmFtZSggdGhpcywgXCJib2R5XCIgKSApIHtcblx0XHRcdFx0alF1ZXJ5KCB0aGlzICkucmVwbGFjZVdpdGgoIHRoaXMuY2hpbGROb2RlcyApO1xuXHRcdFx0fVxuXHRcdH0gKS5lbmQoKTtcblx0fVxufSApO1xuXG5yZXR1cm4galF1ZXJ5O1xufSApO1xuIl19