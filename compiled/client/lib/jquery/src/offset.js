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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9vZmZzZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1AsUUFETyxFQUVQLGVBRk8sRUFHUCxnQkFITyxFQUlQLHVCQUpPLEVBS1AscUJBTE8sRUFNUCxjQU5PLEVBT1Asb0JBUE8sRUFRUCxlQVJPLEVBVVAsYUFWTyxFQVdQLE9BWE8sRUFZUDtBQVpPLENBQVIsRUFhRyxVQUFVLE1BQVYsRUFBa0IsTUFBbEIsRUFBMEIsUUFBMUIsRUFBb0MsZUFBcEMsRUFBcUQsU0FBckQsRUFBZ0UsTUFBaEUsRUFBd0UsWUFBeEUsRUFBc0YsT0FBdEYsRUFBZ0c7Ozs7O0FBS25HLFVBQVMsU0FBVCxDQUFvQixJQUFwQixFQUEyQjtBQUMxQixTQUFPLE9BQU8sUUFBUCxDQUFpQixJQUFqQixJQUEwQixJQUExQixHQUFpQyxLQUFLLFFBQUwsS0FBa0IsQ0FBbEIsSUFBdUIsS0FBSyxXQUFMLENBRHJDO0VBQTNCOztBQUlBLFFBQU8sTUFBUCxHQUFnQjtBQUNmLGFBQVcsbUJBQVUsSUFBVixFQUFnQixPQUFoQixFQUF5QixDQUF6QixFQUE2QjtBQUN2QyxPQUFJLFdBQUo7T0FBaUIsT0FBakI7T0FBMEIsU0FBMUI7T0FBcUMsTUFBckM7T0FBNkMsU0FBN0M7T0FBd0QsVUFBeEQ7T0FBb0UsaUJBQXBFO09BQ0MsV0FBVyxPQUFPLEdBQVAsQ0FBWSxJQUFaLEVBQWtCLFVBQWxCLENBQVg7T0FDQSxVQUFVLE9BQVEsSUFBUixDQUFWO09BQ0EsUUFBUSxFQUFSOzs7QUFKc0MsT0FPbEMsYUFBYSxRQUFiLEVBQXdCO0FBQzVCLFNBQUssS0FBTCxDQUFXLFFBQVgsR0FBc0IsVUFBdEIsQ0FENEI7SUFBN0I7O0FBSUEsZUFBWSxRQUFRLE1BQVIsRUFBWixDQVh1QztBQVl2QyxlQUFZLE9BQU8sR0FBUCxDQUFZLElBQVosRUFBa0IsS0FBbEIsQ0FBWixDQVp1QztBQWF2QyxnQkFBYSxPQUFP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QUFnQixRQUFoQixJQUNOLE9BQVEsSUFBUixFQUFlLFFBQWYsR0FBMkIsSUFBM0IsSUFBb0MsSUFBcEMsR0FDQSxRQUZNLENBSlE7SUFBaEI7R0FERCxDQURELENBRG1EO0VBQXBCLENBQWhDLENBNUxtRzs7QUEyTW5HLFFBQU8sTUFBUCxDQTNNbUc7Q0FBaEcsQ0FiSCIsImZpbGUiOiJvZmZzZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuL2NvcmVcIixcblx0XCIuL2NvcmUvYWNjZXNzXCIsXG5cdFwiLi92YXIvZG9jdW1lbnRcIixcblx0XCIuL3Zhci9kb2N1bWVudEVsZW1lbnRcIixcblx0XCIuL2Nzcy92YXIvcm51bW5vbnB4XCIsXG5cdFwiLi9jc3MvY3VyQ1NTXCIsXG5cdFwiLi9jc3MvYWRkR2V0SG9va0lmXCIsXG5cdFwiLi9jc3Mvc3VwcG9ydFwiLFxuXG5cdFwiLi9jb3JlL2luaXRcIixcblx0XCIuL2Nzc1wiLFxuXHRcIi4vc2VsZWN0b3JcIiAvLyBjb250YWluc1xuXSwgZnVuY3Rpb24oIGpRdWVyeSwgYWNjZXNzLCBkb2N1bWVudCwgZG9jdW1lbnRFbGVtZW50LCBybnVtbm9ucHgsIGN1ckNTUywgYWRkR2V0SG9va0lmLCBzdXBwb3J0ICkge1xuXG4vKipcbiAqIEdldHMgYSB3aW5kb3cgZnJvbSBhbiBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGdldFdpbmRvdyggZWxlbSApIHtcblx0cmV0dXJuIGpRdWVyeS5pc1dpbmRvdyggZWxlbSApID8gZWxlbSA6IGVsZW0ubm9kZVR5cGUgPT09IDkgJiYgZWxlbS5kZWZhdWx0Vmlldztcbn1cblxualF1ZXJ5Lm9mZnNldCA9IHtcblx0c2V0T2Zmc2V0OiBmdW5jdGlvbiggZWxlbSwgb3B0aW9ucywgaSApIHtcblx0XHR2YXIgY3VyUG9zaXRpb24sIGN1ckxlZnQsIGN1ckNTU1RvcCwgY3VyVG9wLCBjdXJPZmZzZXQsIGN1ckNTU0xlZnQsIGNhbGN1bGF0ZVBvc2l0aW9uLFxuXHRcdFx0cG9zaXRpb24gPSBqUXVlcnkuY3NzKCBlbGVtLCBcInBvc2l0aW9uXCIgKSxcblx0XHRcdGN1ckVsZW0gPSBqUXVlcnkoIGVsZW0gKSxcblx0XHRcdHByb3BzID0ge307XG5cblx0XHQvLyBTZXQgcG9zaXRpb24gZmlyc3QsIGluLWNhc2UgdG9wL2xlZnQgYXJlIHNldCBldmVuIG9uIHN0YXRpYyBlbGVtXG5cdFx0aWYgKCBwb3NpdGlvbiA9PT0gXCJzdGF0aWNcIiApIHtcblx0XHRcdGVsZW0uc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG5cdFx0fVxuXG5cdFx0Y3VyT2Zmc2V0ID0gY3VyRWxlbS5vZmZzZXQoKTtcblx0XHRjdXJDU1NUb3AgPSBqUXVlcnkuY3NzKCBlbGVtLCBcInRvcFwiICk7XG5cdFx0Y3VyQ1NTTGVmdCA9IGpRdWVyeS5jc3MoIGVsZW0sIFwibGVmdFwiICk7XG5cdFx0Y2FsY3VsYXRlUG9zaXRpb24gPSAoIHBvc2l0aW9uID09PSBcImFic29sdXRlXCIgfHwgcG9zaXRpb24gPT09IFwiZml4ZWRcIiApICYmXG5cdFx0XHQoIGN1ckNTU1RvcCArIGN1ckNTU0xlZnQgKS5pbmRleE9mKCBcImF1dG9cIiApID4gLTE7XG5cblx0XHQvLyBOZWVkIHRvIGJlIGFibGUgdG8gY2FsY3VsYXRlIHBvc2l0aW9uIGlmIGVpdGhlclxuXHRcdC8vIHRvcCBvciBsZWZ0IGlzIGF1dG8gYW5kIHBvc2l0aW9uIGlzIGVpdGhlciBhYnNvbHV0ZSBvciBmaXhlZFxuXHRcdGlmICggY2FsY3VsYXRlUG9zaXRpb24gKSB7XG5cdFx0XHRjdXJQb3NpdGlvbiA9IGN1ckVsZW0ucG9zaXRpb24oKTtcblx0XHRcdGN1clRvcCA9IGN1clBvc2l0aW9uLnRvcDtcblx0XHRcdGN1ckxlZnQgPSBjdXJQb3NpdGlvbi5sZWZ0O1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGN1clRvcCA9IHBhcnNlRmxvYXQoIGN1ckNTU1RvcCApIHx8IDA7XG5cdFx0XHRjdXJMZWZ0ID0gcGFyc2VGbG9hdCggY3VyQ1NTTGVmdCApIHx8IDA7XG5cdFx0fVxuXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggb3B0aW9ucyApICkge1xuXG5cdFx0XHQvLyBVc2UgalF1ZXJ5LmV4dGVuZCBoZXJlIHRvIGFsbG93IG1vZGlmaWNhdGlvbiBvZiBjb29yZGluYXRlcyBhcmd1bWVudCAoZ2gtMTg0OClcblx0XHRcdG9wdGlvbnMgPSBvcHRpb25zLmNhbGwoIGVsZW0sIGksIGpRdWVyeS5leHRlbmQoIHt9LCBjdXJPZmZzZXQgKSApO1xuXHRcdH1cblxuXHRcdGlmICggb3B0aW9ucy50b3AgIT0gbnVsbCApIHtcblx0XHRcdHByb3BzLnRvcCA9ICggb3B0aW9ucy50b3AgLSBjdXJPZmZzZXQudG9wICkgKyBjdXJUb3A7XG5cdFx0fVxuXHRcdGlmICggb3B0aW9ucy5sZWZ0ICE9IG51bGwgKSB7XG5cdFx0XHRwcm9wcy5sZWZ0ID0gKCBvcHRpb25zLmxlZnQgLSBjdXJPZmZzZXQubGVmdCApICsgY3VyTGVmdDtcblx0XHR9XG5cblx0XHRpZiAoIFwidXNpbmdcIiBpbiBvcHRpb25zICkge1xuXHRcdFx0b3B0aW9ucy51c2luZy5jYWxsKCBlbGVtLCBwcm9wcyApO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGN1ckVsZW0uY3NzKCBwcm9wcyApO1xuXHRcdH1cblx0fVxufTtcblxualF1ZXJ5LmZuLmV4dGVuZCgge1xuXHRvZmZzZXQ6IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuXHRcdGlmICggYXJndW1lbnRzLmxlbmd0aCApIHtcblx0XHRcdHJldHVybiBvcHRpb25zID09PSB1bmRlZmluZWQgP1xuXHRcdFx0XHR0aGlzIDpcblx0XHRcdFx0dGhpcy5lYWNoKCBmdW5jdGlvbiggaSApIHtcblx0XHRcdFx0XHRqUXVlcnkub2Zmc2V0LnNldE9mZnNldCggdGhpcywgb3B0aW9ucywgaSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0dmFyIGRvY0VsZW0sIHdpbixcblx0XHRcdGVsZW0gPSB0aGlzWyAwIF0sXG5cdFx0XHRib3ggPSB7IHRvcDogMCwgbGVmdDogMCB9LFxuXHRcdFx0ZG9jID0gZWxlbSAmJiBlbGVtLm93bmVyRG9jdW1lbnQ7XG5cblx0XHRpZiAoICFkb2MgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZG9jRWxlbSA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG5cblx0XHQvLyBNYWtlIHN1cmUgaXQncyBub3QgYSBkaXNjb25uZWN0ZWQgRE9NIG5vZGVcblx0XHRpZiAoICFqUXVlcnkuY29udGFpbnMoIGRvY0VsZW0sIGVsZW0gKSApIHtcblx0XHRcdHJldHVybiBib3g7XG5cdFx0fVxuXG5cdFx0Ym94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHR3aW4gPSBnZXRXaW5kb3coIGRvYyApO1xuXHRcdHJldHVybiB7XG5cdFx0XHR0b3A6IGJveC50b3AgKyB3aW4ucGFnZVlPZmZzZXQgLSBkb2NFbGVtLmNsaWVudFRvcCxcblx0XHRcdGxlZnQ6IGJveC5sZWZ0ICsgd2luLnBhZ2VYT2Zmc2V0IC0gZG9jRWxlbS5jbGllbnRMZWZ0XG5cdFx0fTtcblx0fSxcblxuXHRwb3NpdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCAhdGhpc1sgMCBdICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBvZmZzZXRQYXJlbnQsIG9mZnNldCxcblx0XHRcdGVsZW0gPSB0aGlzWyAwIF0sXG5cdFx0XHRwYXJlbnRPZmZzZXQgPSB7IHRvcDogMCwgbGVmdDogMCB9O1xuXG5cdFx0Ly8gRml4ZWQgZWxlbWVudHMgYXJlIG9mZnNldCBmcm9tIHdpbmRvdyAocGFyZW50T2Zmc2V0ID0ge3RvcDowLCBsZWZ0OiAwfSxcblx0XHQvLyBiZWNhdXNlIGl0IGlzIGl0cyBvbmx5IG9mZnNldCBwYXJlbnRcblx0XHRpZiAoIGpRdWVyeS5jc3MoIGVsZW0sIFwicG9zaXRpb25cIiApID09PSBcImZpeGVkXCIgKSB7XG5cblx0XHRcdC8vIEFzc3VtZSBnZXRCb3VuZGluZ0NsaWVudFJlY3QgaXMgdGhlcmUgd2hlbiBjb21wdXRlZCBwb3NpdGlvbiBpcyBmaXhlZFxuXHRcdFx0b2Zmc2V0ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIEdldCAqcmVhbCogb2Zmc2V0UGFyZW50XG5cdFx0XHRvZmZzZXRQYXJlbnQgPSB0aGlzLm9mZnNldFBhcmVudCgpO1xuXG5cdFx0XHQvLyBHZXQgY29ycmVjdCBvZmZzZXRzXG5cdFx0XHRvZmZzZXQgPSB0aGlzLm9mZnNldCgpO1xuXHRcdFx0aWYgKCAhalF1ZXJ5Lm5vZGVOYW1lKCBvZmZzZXRQYXJlbnRbIDAgXSwgXCJodG1sXCIgKSApIHtcblx0XHRcdFx0cGFyZW50T2Zmc2V0ID0gb2Zmc2V0UGFyZW50Lm9mZnNldCgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgb2Zmc2V0UGFyZW50IGJvcmRlcnNcblx0XHRcdHBhcmVudE9mZnNldC50b3AgKz0galF1ZXJ5LmNzcyggb2Zmc2V0UGFyZW50WyAwIF0sIFwiYm9yZGVyVG9wV2lkdGhcIiwgdHJ1ZSApO1xuXHRcdFx0cGFyZW50T2Zmc2V0LmxlZnQgKz0galF1ZXJ5LmNzcyggb2Zmc2V0UGFyZW50WyAwIF0sIFwiYm9yZGVyTGVmdFdpZHRoXCIsIHRydWUgKTtcblx0XHR9XG5cblx0XHQvLyBTdWJ0cmFjdCBwYXJlbnQgb2Zmc2V0cyBhbmQgZWxlbWVudCBtYXJnaW5zXG5cdFx0cmV0dXJuIHtcblx0XHRcdHRvcDogb2Zmc2V0LnRvcCAtIHBhcmVudE9mZnNldC50b3AgLSBqUXVlcnkuY3NzKCBlbGVtLCBcIm1hcmdpblRvcFwiLCB0cnVlICksXG5cdFx0XHRsZWZ0OiBvZmZzZXQubGVmdCAtIHBhcmVudE9mZnNldC5sZWZ0IC0galF1ZXJ5LmNzcyggZWxlbSwgXCJtYXJnaW5MZWZ0XCIsIHRydWUgKVxuXHRcdH07XG5cdH0sXG5cblx0Ly8gVGhpcyBtZXRob2Qgd2lsbCByZXR1cm4gZG9jdW1lbnRFbGVtZW50IGluIHRoZSBmb2xsb3dpbmcgY2FzZXM6XG5cdC8vIDEpIEZvciB0aGUgZWxlbWVudCBpbnNpZGUgdGhlIGlmcmFtZSB3aXRob3V0IG9mZnNldFBhcmVudCwgdGhpcyBtZXRob2Qgd2lsbCByZXR1cm5cblx0Ly8gICAgZG9jdW1lbnRFbGVtZW50IG9mIHRoZSBwYXJlbnQgd2luZG93XG5cdC8vIDIpIEZvciB0aGUgaGlkZGVuIG9yIGRldGFjaGVkIGVsZW1lbnRcblx0Ly8gMykgRm9yIGJvZHkgb3IgaHRtbCBlbGVtZW50LCBpLmUuIGluIGNhc2Ugb2YgdGhlIGh0bWwgbm9kZSAtIGl0IHdpbGwgcmV0dXJuIGl0c2VsZlxuXHQvL1xuXHQvLyBidXQgdGhvc2UgZXhjZXB0aW9ucyB3ZXJlIG5ldmVyIHByZXNlbnRlZCBhcyBhIHJlYWwgbGlmZSB1c2UtY2FzZXNcblx0Ly8gYW5kIG1pZ2h0IGJlIGNvbnNpZGVyZWQgYXMgbW9yZSBwcmVmZXJhYmxlIHJlc3VsdHMuXG5cdC8vXG5cdC8vIFRoaXMgbG9naWMsIGhvd2V2ZXIsIGlzIG5vdCBndWFyYW50ZWVkIGFuZCBjYW4gY2hhbmdlIGF0IGFueSBwb2ludCBpbiB0aGUgZnV0dXJlXG5cdG9mZnNldFBhcmVudDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBvZmZzZXRQYXJlbnQgPSB0aGlzLm9mZnNldFBhcmVudDtcblxuXHRcdFx0d2hpbGUgKCBvZmZzZXRQYXJlbnQgJiYgalF1ZXJ5LmNzcyggb2Zmc2V0UGFyZW50LCBcInBvc2l0aW9uXCIgKSA9PT0gXCJzdGF0aWNcIiApIHtcblx0XHRcdFx0b2Zmc2V0UGFyZW50ID0gb2Zmc2V0UGFyZW50Lm9mZnNldFBhcmVudDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG9mZnNldFBhcmVudCB8fCBkb2N1bWVudEVsZW1lbnQ7XG5cdFx0fSApO1xuXHR9XG59ICk7XG5cbi8vIENyZWF0ZSBzY3JvbGxMZWZ0IGFuZCBzY3JvbGxUb3AgbWV0aG9kc1xualF1ZXJ5LmVhY2goIHsgc2Nyb2xsTGVmdDogXCJwYWdlWE9mZnNldFwiLCBzY3JvbGxUb3A6IFwicGFnZVlPZmZzZXRcIiB9LCBmdW5jdGlvbiggbWV0aG9kLCBwcm9wICkge1xuXHR2YXIgdG9wID0gXCJwYWdlWU9mZnNldFwiID09PSBwcm9wO1xuXG5cdGpRdWVyeS5mblsgbWV0aG9kIF0gPSBmdW5jdGlvbiggdmFsICkge1xuXHRcdHJldHVybiBhY2Nlc3MoIHRoaXMsIGZ1bmN0aW9uKCBlbGVtLCBtZXRob2QsIHZhbCApIHtcblx0XHRcdHZhciB3aW4gPSBnZXRXaW5kb3coIGVsZW0gKTtcblxuXHRcdFx0aWYgKCB2YWwgPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0cmV0dXJuIHdpbiA/IHdpblsgcHJvcCBdIDogZWxlbVsgbWV0aG9kIF07XG5cdFx0XHR9XG5cblx0XHRcdGlmICggd2luICkge1xuXHRcdFx0XHR3aW4uc2Nyb2xsVG8oXG5cdFx0XHRcdFx0IXRvcCA/IHZhbCA6IHdpbi5wYWdlWE9mZnNldCxcblx0XHRcdFx0XHR0b3AgPyB2YWwgOiB3aW4ucGFnZVlPZmZzZXRcblx0XHRcdFx0KTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWxlbVsgbWV0aG9kIF0gPSB2YWw7XG5cdFx0XHR9XG5cdFx0fSwgbWV0aG9kLCB2YWwsIGFyZ3VtZW50cy5sZW5ndGggKTtcblx0fTtcbn0gKTtcblxuLy8gU3VwcG9ydDogU2FmYXJpPDctOCssIENocm9tZTwzNy00NCtcbi8vIEFkZCB0aGUgdG9wL2xlZnQgY3NzSG9va3MgdXNpbmcgalF1ZXJ5LmZuLnBvc2l0aW9uXG4vLyBXZWJraXQgYnVnOiBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MjkwODRcbi8vIEJsaW5rIGJ1ZzogaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTIyOTI4MFxuLy8gZ2V0Q29tcHV0ZWRTdHlsZSByZXR1cm5zIHBlcmNlbnQgd2hlbiBzcGVjaWZpZWQgZm9yIHRvcC9sZWZ0L2JvdHRvbS9yaWdodDtcbi8vIHJhdGhlciB0aGFuIG1ha2UgdGhlIGNzcyBtb2R1bGUgZGVwZW5kIG9uIHRoZSBvZmZzZXQgbW9kdWxlLCBqdXN0IGNoZWNrIGZvciBpdCBoZXJlXG5qUXVlcnkuZWFjaCggWyBcInRvcFwiLCBcImxlZnRcIiBdLCBmdW5jdGlvbiggaSwgcHJvcCApIHtcblx0alF1ZXJ5LmNzc0hvb2tzWyBwcm9wIF0gPSBhZGRHZXRIb29rSWYoIHN1cHBvcnQucGl4ZWxQb3NpdGlvbixcblx0XHRmdW5jdGlvbiggZWxlbSwgY29tcHV0ZWQgKSB7XG5cdFx0XHRpZiAoIGNvbXB1dGVkICkge1xuXHRcdFx0XHRjb21wdXRlZCA9IGN1ckNTUyggZWxlbSwgcHJvcCApO1xuXG5cdFx0XHRcdC8vIElmIGN1ckNTUyByZXR1cm5zIHBlcmNlbnRhZ2UsIGZhbGxiYWNrIHRvIG9mZnNldFxuXHRcdFx0XHRyZXR1cm4gcm51bW5vbnB4LnRlc3QoIGNvbXB1dGVkICkgP1xuXHRcdFx0XHRcdGpRdWVyeSggZWxlbSApLnBvc2l0aW9uKClbIHByb3AgXSArIFwicHhcIiA6XG5cdFx0XHRcdFx0Y29tcHV0ZWQ7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xufSApO1xuXG5yZXR1cm4galF1ZXJ5O1xufSApO1xuIl19