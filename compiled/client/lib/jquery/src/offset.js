"use strict";

define(["./core", "./core/access", "./var/document", "./var/documentElement", "./css/var/rnumnonpx", "./css/curCSS", "./css/addGetHookIf", "./css/support", "./core/init", "./css", "./selector" // contains
], function (jQuery, access, document, documentElement, rnumnonpx, curCSS, addGetHookIf, support) {

	/**
  * Gets a window from an element
  */
	function getWindow(elem) {
		return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
	}

	jQuery.offset = {
		setOffset: function setOffset(elem, options, i) {
			var curPosition,
			    curLeft,
			    curCSSTop,
			    curTop,
			    curOffset,
			    curCSSLeft,
			    calculatePosition,
			    position = jQuery.css(elem, "position"),
			    curElem = jQuery(elem),
			    props = {};

			// Set position first, in-case top/left are set even on static elem
			if (position === "static") {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css(elem, "top");
			curCSSLeft = jQuery.css(elem, "left");
			calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;

			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if (calculatePosition) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
			} else {
				curTop = parseFloat(curCSSTop) || 0;
				curLeft = parseFloat(curCSSLeft) || 0;
			}

			if (jQuery.isFunction(options)) {

				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call(elem, i, jQuery.extend({}, curOffset));
			}

			if (options.top != null) {
				props.top = options.top - curOffset.top + curTop;
			}
			if (options.left != null) {
				props.left = options.left - curOffset.left + curLeft;
			}

			if ("using" in options) {
				options.using.call(elem, props);
			} else {
				curElem.css(props);
			}
		}
	};

	jQuery.fn.extend({
		offset: function offset(options) {
			if (arguments.length) {
				return options === undefined ? this : this.each(function (i) {
					jQuery.offset.setOffset(this, options, i);
				});
			}

			var docElem,
			    win,
			    elem = this[0],
			    box = { top: 0, left: 0 },
			    doc = elem && elem.ownerDocument;

			if (!doc) {
				return;
			}

			docElem = doc.documentElement;

			// Make sure it's not a disconnected DOM node
			if (!jQuery.contains(docElem, elem)) {
				return box;
			}

			box = elem.getBoundingClientRect();
			win = getWindow(doc);
			return {
				top: box.top + win.pageYOffset - docElem.clientTop,
				left: box.left + win.pageXOffset - docElem.clientLeft
			};
		},

		position: function position() {
			if (!this[0]) {
				return;
			}

			var offsetParent,
			    offset,
			    elem = this[0],
			    parentOffset = { top: 0, left: 0 };

			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if (jQuery.css(elem, "position") === "fixed") {

				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();
			} else {

				// Get *real* offsetParent
				offsetParent = this.offsetParent();

				// Get correct offsets
				offset = this.offset();
				if (!jQuery.nodeName(offsetParent[0], "html")) {
					parentOffset = offsetParent.offset();
				}

				// Add offsetParent borders
				parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true);
				parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true);
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
				left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
			};
		},

		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function offsetParent() {
			return this.map(function () {
				var offsetParent = this.offsetParent;

				while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || documentElement;
			});
		}
	});

	// Create scrollLeft and scrollTop methods
	jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (method, prop) {
		var top = "pageYOffset" === prop;

		jQuery.fn[method] = function (val) {
			return access(this, function (elem, method, val) {
				var win = getWindow(elem);

				if (val === undefined) {
					return win ? win[prop] : elem[method];
				}

				if (win) {
					win.scrollTo(!top ? val : win.pageXOffset, top ? val : win.pageYOffset);
				} else {
					elem[method] = val;
				}
			}, method, val, arguments.length);
		};
	});

	// Support: Safari<7-8+, Chrome<37-44+
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each(["top", "left"], function (i, prop) {
		jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function (elem, computed) {
			if (computed) {
				computed = curCSS(elem, prop);

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
			}
		});
	});

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9vZmZzZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1AsUUFETyxFQUVQLGVBRk8sRUFHUCxnQkFITyxFQUlQLHVCQUpPLEVBS1AscUJBTE8sRUFNUCxjQU5PLEVBT1Asb0JBUE8sRUFRUCxlQVJPLEVBVVAsYUFWTyxFQVdQLE9BWE8sRUFZUCxZO0FBWk8sQ0FBUixFQWFHLFVBQVUsTUFBVixFQUFrQixNQUFsQixFQUEwQixRQUExQixFQUFvQyxlQUFwQyxFQUFxRCxTQUFyRCxFQUFnRSxNQUFoRSxFQUF3RSxZQUF4RSxFQUFzRixPQUF0RixFQUFnRzs7Ozs7QUFLbkcsVUFBUyxTQUFULENBQW9CLElBQXBCLEVBQTJCO0FBQzFCLFNBQU8sT0FBTyxRQUFQLENBQWlCLElBQWpCLElBQTBCLElBQTFCLEdBQWlDLEtBQUssUUFBTCxLQUFrQixDQUFsQixJQUF1QixLQUFLLFdBQXBFO0FBQ0E7O0FBRUQsUUFBTyxNQUFQLEdBQWdCO0FBQ2YsYUFBVyxtQkFBVSxJQUFWLEVBQWdCLE9BQWhCLEVBQXlCLENBQXpCLEVBQTZCO0FBQ3ZDLE9BQUksV0FBSjtPQUFpQixPQUFqQjtPQUEwQixTQUExQjtPQUFxQyxNQUFyQztPQUE2QyxTQUE3QztPQUF3RCxVQUF4RDtPQUFvRSxpQkFBcEU7T0FDQyxXQUFXLE9BQU8sR0FBUCxDQUFZLElBQVosRUFBa0IsVUFBbEIsQ0FEWjtPQUVDLFVBQVUsT0FBUSxJQUFSLENBRlg7T0FHQyxRQUFRLEVBSFQ7OztBQU1BLE9BQUssYUFBYSxRQUFsQixFQUE2QjtBQUM1QixTQUFLLEtBQUwsQ0FBVyxRQUFYLEdBQXNCLFVBQXRCO0FBQ0E7O0FBRUQsZUFBWSxRQUFRLE1BQVIsRUFBWjtBQUNBLGVBQVksT0FBTyxHQUFQLENBQVksSUFBWixFQUFrQixLQUFsQixDQUFaO0FBQ0EsZ0JBQWEsT0FBTyxHQUFQLENBQVksSUFBWixFQUFrQixN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QU8sT0FBUSxJQUFSLEVBQWMsVUFBVSxJQUFWLEVBQWdCLE1BQWhCLEVBQXdCLEdBQXhCLEVBQThCO0FBQ2xELFFBQUksTUFBTSxVQUFXLElBQVgsQ0FBVjs7QUFFQSxRQUFLLFFBQVEsU0FBYixFQUF5QjtBQUN4QixZQUFPLE1BQU0sSUFBSyxJQUFMLENBQU4sR0FBb0IsS0FBTSxNQUFOLENBQTNCO0FBQ0E7O0FBRUQsUUFBSyxHQUFMLEVBQVc7QUFDVixTQUFJLFFBQUosQ0FDQyxDQUFDLEdBQUQsR0FBTyxHQUFQLEdBQWEsSUFBSSxXQURsQixFQUVDLE1BQU0sR0FBTixHQUFZLElBQUksV0FGakI7QUFLQSxLQU5ELE1BTU87QUFDTixVQUFNLE1BQU4sSUFBaUIsR0FBakI7QUFDQTtBQUNELElBaEJNLEVBZ0JKLE1BaEJJLEVBZ0JJLEdBaEJKLEVBZ0JTLFVBQVUsTUFoQm5CLENBQVA7QUFpQkEsR0FsQkQ7QUFtQkEsRUF0QkQ7Ozs7Ozs7O0FBOEJBLFFBQU8sSUFBUCxDQUFhLENBQUUsS0FBRixFQUFTLE1BQVQsQ0FBYixFQUFnQyxVQUFVLENBQVYsRUFBYSxJQUFiLEVBQW9CO0FBQ25ELFNBQU8sUUFBUCxDQUFpQixJQUFqQixJQUEwQixhQUFjLFFBQVEsYUFBdEIsRUFDekIsVUFBVSxJQUFWLEVBQWdCLFFBQWhCLEVBQTJCO0FBQzFCLE9BQUssUUFBTCxFQUFnQjtBQUNmLGVBQVcsT0FBUSxJQUFSLEVBQWMsSUFBZCxDQUFYOzs7QUFHQSxXQUFPLFVBQVUsSUFBVixDQUFnQixRQUFoQixJQUNOLE9BQVEsSUFBUixFQUFlLFFBQWYsR0FBMkIsSUFBM0IsSUFBb0MsSUFEOUIsR0FFTixRQUZEO0FBR0E7QUFDRCxHQVZ3QixDQUExQjtBQVlBLEVBYkQ7O0FBZUEsUUFBTyxNQUFQO0FBQ0MsQ0F6TkQiLCJmaWxlIjoib2Zmc2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBbXG5cdFwiLi9jb3JlXCIsXG5cdFwiLi9jb3JlL2FjY2Vzc1wiLFxuXHRcIi4vdmFyL2RvY3VtZW50XCIsXG5cdFwiLi92YXIvZG9jdW1lbnRFbGVtZW50XCIsXG5cdFwiLi9jc3MvdmFyL3JudW1ub25weFwiLFxuXHRcIi4vY3NzL2N1ckNTU1wiLFxuXHRcIi4vY3NzL2FkZEdldEhvb2tJZlwiLFxuXHRcIi4vY3NzL3N1cHBvcnRcIixcblxuXHRcIi4vY29yZS9pbml0XCIsXG5cdFwiLi9jc3NcIixcblx0XCIuL3NlbGVjdG9yXCIgLy8gY29udGFpbnNcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIGFjY2VzcywgZG9jdW1lbnQsIGRvY3VtZW50RWxlbWVudCwgcm51bW5vbnB4LCBjdXJDU1MsIGFkZEdldEhvb2tJZiwgc3VwcG9ydCApIHtcblxuLyoqXG4gKiBHZXRzIGEgd2luZG93IGZyb20gYW4gZWxlbWVudFxuICovXG5mdW5jdGlvbiBnZXRXaW5kb3coIGVsZW0gKSB7XG5cdHJldHVybiBqUXVlcnkuaXNXaW5kb3coIGVsZW0gKSA/IGVsZW0gOiBlbGVtLm5vZGVUeXBlID09PSA5ICYmIGVsZW0uZGVmYXVsdFZpZXc7XG59XG5cbmpRdWVyeS5vZmZzZXQgPSB7XG5cdHNldE9mZnNldDogZnVuY3Rpb24oIGVsZW0sIG9wdGlvbnMsIGkgKSB7XG5cdFx0dmFyIGN1clBvc2l0aW9uLCBjdXJMZWZ0LCBjdXJDU1NUb3AsIGN1clRvcCwgY3VyT2Zmc2V0LCBjdXJDU1NMZWZ0LCBjYWxjdWxhdGVQb3NpdGlvbixcblx0XHRcdHBvc2l0aW9uID0galF1ZXJ5LmNzcyggZWxlbSwgXCJwb3NpdGlvblwiICksXG5cdFx0XHRjdXJFbGVtID0galF1ZXJ5KCBlbGVtICksXG5cdFx0XHRwcm9wcyA9IHt9O1xuXG5cdFx0Ly8gU2V0IHBvc2l0aW9uIGZpcnN0LCBpbi1jYXNlIHRvcC9sZWZ0IGFyZSBzZXQgZXZlbiBvbiBzdGF0aWMgZWxlbVxuXHRcdGlmICggcG9zaXRpb24gPT09IFwic3RhdGljXCIgKSB7XG5cdFx0XHRlbGVtLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xuXHRcdH1cblxuXHRcdGN1ck9mZnNldCA9IGN1ckVsZW0ub2Zmc2V0KCk7XG5cdFx0Y3VyQ1NTVG9wID0galF1ZXJ5LmNzcyggZWxlbSwgXCJ0b3BcIiApO1xuXHRcdGN1ckNTU0xlZnQgPSBqUXVlcnkuY3NzKCBlbGVtLCBcImxlZnRcIiApO1xuXHRcdGNhbGN1bGF0ZVBvc2l0aW9uID0gKCBwb3NpdGlvbiA9PT0gXCJhYnNvbHV0ZVwiIHx8IHBvc2l0aW9uID09PSBcImZpeGVkXCIgKSAmJlxuXHRcdFx0KCBjdXJDU1NUb3AgKyBjdXJDU1NMZWZ0ICkuaW5kZXhPZiggXCJhdXRvXCIgKSA+IC0xO1xuXG5cdFx0Ly8gTmVlZCB0byBiZSBhYmxlIHRvIGNhbGN1bGF0ZSBwb3NpdGlvbiBpZiBlaXRoZXJcblx0XHQvLyB0b3Agb3IgbGVmdCBpcyBhdXRvIGFuZCBwb3NpdGlvbiBpcyBlaXRoZXIgYWJzb2x1dGUgb3IgZml4ZWRcblx0XHRpZiAoIGNhbGN1bGF0ZVBvc2l0aW9uICkge1xuXHRcdFx0Y3VyUG9zaXRpb24gPSBjdXJFbGVtLnBvc2l0aW9uKCk7XG5cdFx0XHRjdXJUb3AgPSBjdXJQb3NpdGlvbi50b3A7XG5cdFx0XHRjdXJMZWZ0ID0gY3VyUG9zaXRpb24ubGVmdDtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJUb3AgPSBwYXJzZUZsb2F0KCBjdXJDU1NUb3AgKSB8fCAwO1xuXHRcdFx0Y3VyTGVmdCA9IHBhcnNlRmxvYXQoIGN1ckNTU0xlZnQgKSB8fCAwO1xuXHRcdH1cblxuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIG9wdGlvbnMgKSApIHtcblxuXHRcdFx0Ly8gVXNlIGpRdWVyeS5leHRlbmQgaGVyZSB0byBhbGxvdyBtb2RpZmljYXRpb24gb2YgY29vcmRpbmF0ZXMgYXJndW1lbnQgKGdoLTE4NDgpXG5cdFx0XHRvcHRpb25zID0gb3B0aW9ucy5jYWxsKCBlbGVtLCBpLCBqUXVlcnkuZXh0ZW5kKCB7fSwgY3VyT2Zmc2V0ICkgKTtcblx0XHR9XG5cblx0XHRpZiAoIG9wdGlvbnMudG9wICE9IG51bGwgKSB7XG5cdFx0XHRwcm9wcy50b3AgPSAoIG9wdGlvbnMudG9wIC0gY3VyT2Zmc2V0LnRvcCApICsgY3VyVG9wO1xuXHRcdH1cblx0XHRpZiAoIG9wdGlvbnMubGVmdCAhPSBudWxsICkge1xuXHRcdFx0cHJvcHMubGVmdCA9ICggb3B0aW9ucy5sZWZ0IC0gY3VyT2Zmc2V0LmxlZnQgKSArIGN1ckxlZnQ7XG5cdFx0fVxuXG5cdFx0aWYgKCBcInVzaW5nXCIgaW4gb3B0aW9ucyApIHtcblx0XHRcdG9wdGlvbnMudXNpbmcuY2FsbCggZWxlbSwgcHJvcHMgKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJFbGVtLmNzcyggcHJvcHMgKTtcblx0XHR9XG5cdH1cbn07XG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblx0b2Zmc2V0OiBmdW5jdGlvbiggb3B0aW9ucyApIHtcblx0XHRpZiAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm4gb3B0aW9ucyA9PT0gdW5kZWZpbmVkID9cblx0XHRcdFx0dGhpcyA6XG5cdFx0XHRcdHRoaXMuZWFjaCggZnVuY3Rpb24oIGkgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5Lm9mZnNldC5zZXRPZmZzZXQoIHRoaXMsIG9wdGlvbnMsIGkgKTtcblx0XHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdHZhciBkb2NFbGVtLCB3aW4sXG5cdFx0XHRlbGVtID0gdGhpc1sgMCBdLFxuXHRcdFx0Ym94ID0geyB0b3A6IDAsIGxlZnQ6IDAgfSxcblx0XHRcdGRvYyA9IGVsZW0gJiYgZWxlbS5vd25lckRvY3VtZW50O1xuXG5cdFx0aWYgKCAhZG9jICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGRvY0VsZW0gPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuXG5cdFx0Ly8gTWFrZSBzdXJlIGl0J3Mgbm90IGEgZGlzY29ubmVjdGVkIERPTSBub2RlXG5cdFx0aWYgKCAhalF1ZXJ5LmNvbnRhaW5zKCBkb2NFbGVtLCBlbGVtICkgKSB7XG5cdFx0XHRyZXR1cm4gYm94O1xuXHRcdH1cblxuXHRcdGJveCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0d2luID0gZ2V0V2luZG93KCBkb2MgKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dG9wOiBib3gudG9wICsgd2luLnBhZ2VZT2Zmc2V0IC0gZG9jRWxlbS5jbGllbnRUb3AsXG5cdFx0XHRsZWZ0OiBib3gubGVmdCArIHdpbi5wYWdlWE9mZnNldCAtIGRvY0VsZW0uY2xpZW50TGVmdFxuXHRcdH07XG5cdH0sXG5cblx0cG9zaXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggIXRoaXNbIDAgXSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgb2Zmc2V0UGFyZW50LCBvZmZzZXQsXG5cdFx0XHRlbGVtID0gdGhpc1sgMCBdLFxuXHRcdFx0cGFyZW50T2Zmc2V0ID0geyB0b3A6IDAsIGxlZnQ6IDAgfTtcblxuXHRcdC8vIEZpeGVkIGVsZW1lbnRzIGFyZSBvZmZzZXQgZnJvbSB3aW5kb3cgKHBhcmVudE9mZnNldCA9IHt0b3A6MCwgbGVmdDogMH0sXG5cdFx0Ly8gYmVjYXVzZSBpdCBpcyBpdHMgb25seSBvZmZzZXQgcGFyZW50XG5cdFx0aWYgKCBqUXVlcnkuY3NzKCBlbGVtLCBcInBvc2l0aW9uXCIgKSA9PT0gXCJmaXhlZFwiICkge1xuXG5cdFx0XHQvLyBBc3N1bWUgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGlzIHRoZXJlIHdoZW4gY29tcHV0ZWQgcG9zaXRpb24gaXMgZml4ZWRcblx0XHRcdG9mZnNldCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBHZXQgKnJlYWwqIG9mZnNldFBhcmVudFxuXHRcdFx0b2Zmc2V0UGFyZW50ID0gdGhpcy5vZmZzZXRQYXJlbnQoKTtcblxuXHRcdFx0Ly8gR2V0IGNvcnJlY3Qgb2Zmc2V0c1xuXHRcdFx0b2Zmc2V0ID0gdGhpcy5vZmZzZXQoKTtcblx0XHRcdGlmICggIWpRdWVyeS5ub2RlTmFtZSggb2Zmc2V0UGFyZW50WyAwIF0sIFwiaHRtbFwiICkgKSB7XG5cdFx0XHRcdHBhcmVudE9mZnNldCA9IG9mZnNldFBhcmVudC5vZmZzZXQoKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWRkIG9mZnNldFBhcmVudCBib3JkZXJzXG5cdFx0XHRwYXJlbnRPZmZzZXQudG9wICs9IGpRdWVyeS5jc3MoIG9mZnNldFBhcmVudFsgMCBdLCBcImJvcmRlclRvcFdpZHRoXCIsIHRydWUgKTtcblx0XHRcdHBhcmVudE9mZnNldC5sZWZ0ICs9IGpRdWVyeS5jc3MoIG9mZnNldFBhcmVudFsgMCBdLCBcImJvcmRlckxlZnRXaWR0aFwiLCB0cnVlICk7XG5cdFx0fVxuXG5cdFx0Ly8gU3VidHJhY3QgcGFyZW50IG9mZnNldHMgYW5kIGVsZW1lbnQgbWFyZ2luc1xuXHRcdHJldHVybiB7XG5cdFx0XHR0b3A6IG9mZnNldC50b3AgLSBwYXJlbnRPZmZzZXQudG9wIC0galF1ZXJ5LmNzcyggZWxlbSwgXCJtYXJnaW5Ub3BcIiwgdHJ1ZSApLFxuXHRcdFx0bGVmdDogb2Zmc2V0LmxlZnQgLSBwYXJlbnRPZmZzZXQubGVmdCAtIGpRdWVyeS5jc3MoIGVsZW0sIFwibWFyZ2luTGVmdFwiLCB0cnVlIClcblx0XHR9O1xuXHR9LFxuXG5cdC8vIFRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIGRvY3VtZW50RWxlbWVudCBpbiB0aGUgZm9sbG93aW5nIGNhc2VzOlxuXHQvLyAxKSBGb3IgdGhlIGVsZW1lbnQgaW5zaWRlIHRoZSBpZnJhbWUgd2l0aG91dCBvZmZzZXRQYXJlbnQsIHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuXG5cdC8vICAgIGRvY3VtZW50RWxlbWVudCBvZiB0aGUgcGFyZW50IHdpbmRvd1xuXHQvLyAyKSBGb3IgdGhlIGhpZGRlbiBvciBkZXRhY2hlZCBlbGVtZW50XG5cdC8vIDMpIEZvciBib2R5IG9yIGh0bWwgZWxlbWVudCwgaS5lLiBpbiBjYXNlIG9mIHRoZSBodG1sIG5vZGUgLSBpdCB3aWxsIHJldHVybiBpdHNlbGZcblx0Ly9cblx0Ly8gYnV0IHRob3NlIGV4Y2VwdGlvbnMgd2VyZSBuZXZlciBwcmVzZW50ZWQgYXMgYSByZWFsIGxpZmUgdXNlLWNhc2VzXG5cdC8vIGFuZCBtaWdodCBiZSBjb25zaWRlcmVkIGFzIG1vcmUgcHJlZmVyYWJsZSByZXN1bHRzLlxuXHQvL1xuXHQvLyBUaGlzIGxvZ2ljLCBob3dldmVyLCBpcyBub3QgZ3VhcmFudGVlZCBhbmQgY2FuIGNoYW5nZSBhdCBhbnkgcG9pbnQgaW4gdGhlIGZ1dHVyZVxuXHRvZmZzZXRQYXJlbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgb2Zmc2V0UGFyZW50ID0gdGhpcy5vZmZzZXRQYXJlbnQ7XG5cblx0XHRcdHdoaWxlICggb2Zmc2V0UGFyZW50ICYmIGpRdWVyeS5jc3MoIG9mZnNldFBhcmVudCwgXCJwb3NpdGlvblwiICkgPT09IFwic3RhdGljXCIgKSB7XG5cdFx0XHRcdG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvZmZzZXRQYXJlbnQgfHwgZG9jdW1lbnRFbGVtZW50O1xuXHRcdH0gKTtcblx0fVxufSApO1xuXG4vLyBDcmVhdGUgc2Nyb2xsTGVmdCBhbmQgc2Nyb2xsVG9wIG1ldGhvZHNcbmpRdWVyeS5lYWNoKCB7IHNjcm9sbExlZnQ6IFwicGFnZVhPZmZzZXRcIiwgc2Nyb2xsVG9wOiBcInBhZ2VZT2Zmc2V0XCIgfSwgZnVuY3Rpb24oIG1ldGhvZCwgcHJvcCApIHtcblx0dmFyIHRvcCA9IFwicGFnZVlPZmZzZXRcIiA9PT0gcHJvcDtcblxuXHRqUXVlcnkuZm5bIG1ldGhvZCBdID0gZnVuY3Rpb24oIHZhbCApIHtcblx0XHRyZXR1cm4gYWNjZXNzKCB0aGlzLCBmdW5jdGlvbiggZWxlbSwgbWV0aG9kLCB2YWwgKSB7XG5cdFx0XHR2YXIgd2luID0gZ2V0V2luZG93KCBlbGVtICk7XG5cblx0XHRcdGlmICggdmFsID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdHJldHVybiB3aW4gPyB3aW5bIHByb3AgXSA6IGVsZW1bIG1ldGhvZCBdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHdpbiApIHtcblx0XHRcdFx0d2luLnNjcm9sbFRvKFxuXHRcdFx0XHRcdCF0b3AgPyB2YWwgOiB3aW4ucGFnZVhPZmZzZXQsXG5cdFx0XHRcdFx0dG9wID8gdmFsIDogd2luLnBhZ2VZT2Zmc2V0XG5cdFx0XHRcdCk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVsZW1bIG1ldGhvZCBdID0gdmFsO1xuXHRcdFx0fVxuXHRcdH0sIG1ldGhvZCwgdmFsLCBhcmd1bWVudHMubGVuZ3RoICk7XG5cdH07XG59ICk7XG5cbi8vIFN1cHBvcnQ6IFNhZmFyaTw3LTgrLCBDaHJvbWU8MzctNDQrXG4vLyBBZGQgdGhlIHRvcC9sZWZ0IGNzc0hvb2tzIHVzaW5nIGpRdWVyeS5mbi5wb3NpdGlvblxuLy8gV2Via2l0IGJ1ZzogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTI5MDg0XG4vLyBCbGluayBidWc6IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0yMjkyODBcbi8vIGdldENvbXB1dGVkU3R5bGUgcmV0dXJucyBwZXJjZW50IHdoZW4gc3BlY2lmaWVkIGZvciB0b3AvbGVmdC9ib3R0b20vcmlnaHQ7XG4vLyByYXRoZXIgdGhhbiBtYWtlIHRoZSBjc3MgbW9kdWxlIGRlcGVuZCBvbiB0aGUgb2Zmc2V0IG1vZHVsZSwganVzdCBjaGVjayBmb3IgaXQgaGVyZVxualF1ZXJ5LmVhY2goIFsgXCJ0b3BcIiwgXCJsZWZ0XCIgXSwgZnVuY3Rpb24oIGksIHByb3AgKSB7XG5cdGpRdWVyeS5jc3NIb29rc1sgcHJvcCBdID0gYWRkR2V0SG9va0lmKCBzdXBwb3J0LnBpeGVsUG9zaXRpb24sXG5cdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbXB1dGVkICkge1xuXHRcdFx0aWYgKCBjb21wdXRlZCApIHtcblx0XHRcdFx0Y29tcHV0ZWQgPSBjdXJDU1MoIGVsZW0sIHByb3AgKTtcblxuXHRcdFx0XHQvLyBJZiBjdXJDU1MgcmV0dXJucyBwZXJjZW50YWdlLCBmYWxsYmFjayB0byBvZmZzZXRcblx0XHRcdFx0cmV0dXJuIHJudW1ub25weC50ZXN0KCBjb21wdXRlZCApID9cblx0XHRcdFx0XHRqUXVlcnkoIGVsZW0gKS5wb3NpdGlvbigpWyBwcm9wIF0gKyBcInB4XCIgOlxuXHRcdFx0XHRcdGNvbXB1dGVkO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcbn0gKTtcblxucmV0dXJuIGpRdWVyeTtcbn0gKTtcbiJdfQ==