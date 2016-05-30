"use strict";

// Initialize a jQuery object
define(["../core", "../var/document", "./var/rsingleTag", "../traversing/findFilter"], function (jQuery, document, rsingleTag) {

	// A central reference to the root jQuery(document)
	var rootjQuery,


	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
	    init = jQuery.fn.init = function (selector, context, root) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if (!selector) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if (typeof selector === "string") {
			if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [null, selector, null];
			} else {
				match = rquickExpr.exec(selector);
			}

			// Match html or make sure no context is specified for #id
			if (match && (match[1] || !context)) {

				// HANDLE: $(html) -> $(array)
				if (match[1]) {
					context = context instanceof jQuery ? context[0] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));

					// HANDLE: $(html, props)
					if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
						for (match in context) {

							// Properties of context are called as methods if possible
							if (jQuery.isFunction(this[match])) {
								this[match](context[match]);

								// ...and otherwise set as attributes
							} else {
									this.attr(match, context[match]);
								}
						}
					}

					return this;

					// HANDLE: $(#id)
				} else {
						elem = document.getElementById(match[2]);

						// Support: Blackberry 4.6
						// gEBID returns nodes no longer in the document (#6963)
						if (elem && elem.parentNode) {

							// Inject the element directly into the jQuery object
							this.length = 1;
							this[0] = elem;
						}

						this.context = document;
						this.selector = selector;
						return this;
					}

				// HANDLE: $(expr, $(...))
			} else if (!context || context.jquery) {
					return (context || root).find(selector);

					// HANDLE: $(expr, context)
					// (which is just equivalent to: $(context).find(expr)
				} else {
						return this.constructor(context).find(selector);
					}

			// HANDLE: $(DOMElement)
		} else if (selector.nodeType) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;

				// HANDLE: $(function)
				// Shortcut for document ready
			} else if (jQuery.isFunction(selector)) {
					return root.ready !== undefined ? root.ready(selector) :

					// Execute immediately if ready is not present
					selector(jQuery);
				}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray(selector, this);
	};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery(document);

	return init;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9jb3JlL2luaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsT0FBUSxDQUNQLFNBRE8sRUFFUCxpQkFGTyxFQUdQLGtCQUhPLEVBSVAsMEJBSk8sQ0FBUixFQUtHLFVBQVUsTUFBVixFQUFrQixRQUFsQixFQUE0QixVQUE1QixFQUF5Qzs7O0FBRzVDLEtBQUksVUFBSjs7Ozs7O0FBS0MsY0FBYSxxQ0FMZDtLQU9DLE9BQU8sT0FBTyxFQUFQLENBQVUsSUFBVixHQUFpQixVQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsRUFBb0M7QUFDM0QsTUFBSSxLQUFKLEVBQVcsSUFBWDs7O0FBR0EsTUFBSyxDQUFDLFFBQU4sRUFBaUI7QUFDaEIsVUFBTyxJQUFQO0FBQ0E7Ozs7QUFJRCxTQUFPLFFBQVEsVUFBZjs7O0FBR0EsTUFBSyxPQUFPLFFBQVAsS0FBb0IsUUFBekIsRUFBb0M7QUFDbkMsT0FBSyxTQUFVLENBQVYsTUFBa0IsR0FBbEIsSUFDSixTQUFVLFNBQVMsTUFBVCxHQUFrQixDQUE1QixNQUFvQyxHQURoQyxJQUVKLFNBQVMsTUFBVCxJQUFtQixDQUZwQixFQUV3Qjs7O0FBR3ZCLFlBQVEsQ0FBRSxJQUFGLEVBQVEsUUFBUixFQUFrQixJQUFsQixDQUFSO0FBRUEsSUFQRCxNQU9PO0FBQ04sWUFBUSxXQUFXLElBQVgsQ0FBaUIsUUFBakIsQ0FBUjtBQUNBOzs7QUFHRCxPQUFLLFVBQVcsTUFBTyxDQUFQLEtBQWMsQ0FBQyxPQUExQixDQUFMLEVBQTJDOzs7QUFHMUMsUUFBSyxNQUFPLENBQVAsQ0FBTCxFQUFrQjtBQUNqQixlQUFVLG1CQUFtQixNQUFuQixHQUE0QixRQUFTLENBQVQsQ0FBNUIsR0FBMkMsT0FBckQ7Ozs7QUFJQSxZQUFPLEtBQVAsQ0FBYyxJQUFkLEVBQW9CLE9BQU8sU0FBUCxDQUNuQixNQUFPLENBQVAsQ0FEbUIsRUFFbkIsV0FBVyxRQUFRLFFBQW5CLEdBQThCLFFBQVEsYUFBUixJQUF5QixPQUF2RCxHQUFpRSxRQUY5QyxFQUduQixJQUhtQixDQUFwQjs7O0FBT0EsU0FBSyxXQUFXLElBQVgsQ0FBaUIsTUFBTyxDQUFQLENBQWpCLEtBQWlDLE9BQU8sYUFBUCxDQUFzQixPQUF0QixDQUF0QyxFQUF3RTtBQUN2RSxXQUFNLEtBQU4sSUFBZSxPQUFmLEVBQXlCOzs7QUFHeEIsV0FBSyxPQUFPLFVBQVAsQ0FBbUIsS0FBTSxLQUFOLENBQW5CLENBQUwsRUFBMEM7QUFDekMsYUFBTSxLQUFOLEVBQWUsUUFBUyxLQUFULENBQWY7OztBQUdBLFFBSkQsTUFJTztBQUNOLGNBQUssSUFBTCxDQUFXLEtBQVgsRUFBa0IsUUFBUyxLQUFULENBQWxCO0FBQ0E7QUFDRDtBQUNEOztBQUVELFlBQU8sSUFBUDs7O0FBR0EsS0E3QkQsTUE2Qk87QUFDTixhQUFPLFNBQVMsY0FBVCxDQUF5QixNQUFPLENBQVAsQ0FBekIsQ0FBUDs7OztBQUlBLFVBQUssUUFBUSxLQUFLLFVBQWxCLEVBQStCOzs7QUFHOUIsWUFBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFlBQU0sQ0FBTixJQUFZLElBQVo7QUFDQTs7QUFFRCxXQUFLLE9BQUwsR0FBZSxRQUFmO0FBQ0EsV0FBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsYUFBTyxJQUFQO0FBQ0E7OztBQUdELElBbERELE1Ba0RPLElBQUssQ0FBQyxPQUFELElBQVksUUFBUSxNQUF6QixFQUFrQztBQUN4QyxZQUFPLENBQUUsV0FBVyxJQUFiLEVBQW9CLElBQXBCLENBQTBCLFFBQTFCLENBQVA7Ozs7QUFJQSxLQUxNLE1BS0E7QUFDTixhQUFPLEtBQUssV0FBTCxDQUFrQixPQUFsQixFQUE0QixJQUE1QixDQUFrQyxRQUFsQyxDQUFQO0FBQ0E7OztBQUdELEdBekVELE1BeUVPLElBQUssU0FBUyxRQUFkLEVBQXlCO0FBQy9CLFNBQUssT0FBTCxHQUFlLEtBQU0sQ0FBTixJQUFZLFFBQTNCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFdBQU8sSUFBUDs7OztBQUlBLElBUE0sTUFPQSxJQUFLLE9BQU8sVUFBUCxDQUFtQixRQUFuQixDQUFMLEVBQXFDO0FBQzNDLFlBQU8sS0FBSyxLQUFMLEtBQWUsU0FBZixHQUNOLEtBQUssS0FBTCxDQUFZLFFBQVosQ0FETTs7O0FBSU4sY0FBVSxNQUFWLENBSkQ7QUFLQTs7QUFFRCxNQUFLLFNBQVMsUUFBVCxLQUFzQixTQUEzQixFQUF1QztBQUN0QyxRQUFLLFFBQUwsR0FBZ0IsU0FBUyxRQUF6QjtBQUNBLFFBQUssT0FBTCxHQUFlLFNBQVMsT0FBeEI7QUFDQTs7QUFFRCxTQUFPLE9BQU8sU0FBUCxDQUFrQixRQUFsQixFQUE0QixJQUE1QixDQUFQO0FBQ0EsRUFsSEY7OztBQXFIQSxNQUFLLFNBQUwsR0FBaUIsT0FBTyxFQUF4Qjs7O0FBR0EsY0FBYSxPQUFRLFFBQVIsQ0FBYjs7QUFFQSxRQUFPLElBQVA7QUFFQyxDQXBJRCIsImZpbGUiOiJpbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW5pdGlhbGl6ZSBhIGpRdWVyeSBvYmplY3RcbmRlZmluZSggW1xuXHRcIi4uL2NvcmVcIixcblx0XCIuLi92YXIvZG9jdW1lbnRcIixcblx0XCIuL3Zhci9yc2luZ2xlVGFnXCIsXG5cdFwiLi4vdHJhdmVyc2luZy9maW5kRmlsdGVyXCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIGRvY3VtZW50LCByc2luZ2xlVGFnICkge1xuXG4vLyBBIGNlbnRyYWwgcmVmZXJlbmNlIHRvIHRoZSByb290IGpRdWVyeShkb2N1bWVudClcbnZhciByb290alF1ZXJ5LFxuXG5cdC8vIEEgc2ltcGxlIHdheSB0byBjaGVjayBmb3IgSFRNTCBzdHJpbmdzXG5cdC8vIFByaW9yaXRpemUgI2lkIG92ZXIgPHRhZz4gdG8gYXZvaWQgWFNTIHZpYSBsb2NhdGlvbi5oYXNoICgjOTUyMSlcblx0Ly8gU3RyaWN0IEhUTUwgcmVjb2duaXRpb24gKCMxMTI5MDogbXVzdCBzdGFydCB3aXRoIDwpXG5cdHJxdWlja0V4cHIgPSAvXig/OlxccyooPFtcXHdcXFddKz4pW14+XSp8IyhbXFx3LV0qKSkkLyxcblxuXHRpbml0ID0galF1ZXJ5LmZuLmluaXQgPSBmdW5jdGlvbiggc2VsZWN0b3IsIGNvbnRleHQsIHJvb3QgKSB7XG5cdFx0dmFyIG1hdGNoLCBlbGVtO1xuXG5cdFx0Ly8gSEFORExFOiAkKFwiXCIpLCAkKG51bGwpLCAkKHVuZGVmaW5lZCksICQoZmFsc2UpXG5cdFx0aWYgKCAhc2VsZWN0b3IgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHQvLyBNZXRob2QgaW5pdCgpIGFjY2VwdHMgYW4gYWx0ZXJuYXRlIHJvb3RqUXVlcnlcblx0XHQvLyBzbyBtaWdyYXRlIGNhbiBzdXBwb3J0IGpRdWVyeS5zdWIgKGdoLTIxMDEpXG5cdFx0cm9vdCA9IHJvb3QgfHwgcm9vdGpRdWVyeTtcblxuXHRcdC8vIEhhbmRsZSBIVE1MIHN0cmluZ3Ncblx0XHRpZiAoIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdGlmICggc2VsZWN0b3JbIDAgXSA9PT0gXCI8XCIgJiZcblx0XHRcdFx0c2VsZWN0b3JbIHNlbGVjdG9yLmxlbmd0aCAtIDEgXSA9PT0gXCI+XCIgJiZcblx0XHRcdFx0c2VsZWN0b3IubGVuZ3RoID49IDMgKSB7XG5cblx0XHRcdFx0Ly8gQXNzdW1lIHRoYXQgc3RyaW5ncyB0aGF0IHN0YXJ0IGFuZCBlbmQgd2l0aCA8PiBhcmUgSFRNTCBhbmQgc2tpcCB0aGUgcmVnZXggY2hlY2tcblx0XHRcdFx0bWF0Y2ggPSBbIG51bGwsIHNlbGVjdG9yLCBudWxsIF07XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1hdGNoID0gcnF1aWNrRXhwci5leGVjKCBzZWxlY3RvciApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBNYXRjaCBodG1sIG9yIG1ha2Ugc3VyZSBubyBjb250ZXh0IGlzIHNwZWNpZmllZCBmb3IgI2lkXG5cdFx0XHRpZiAoIG1hdGNoICYmICggbWF0Y2hbIDEgXSB8fCAhY29udGV4dCApICkge1xuXG5cdFx0XHRcdC8vIEhBTkRMRTogJChodG1sKSAtPiAkKGFycmF5KVxuXHRcdFx0XHRpZiAoIG1hdGNoWyAxIF0gKSB7XG5cdFx0XHRcdFx0Y29udGV4dCA9IGNvbnRleHQgaW5zdGFuY2VvZiBqUXVlcnkgPyBjb250ZXh0WyAwIF0gOiBjb250ZXh0O1xuXG5cdFx0XHRcdFx0Ly8gT3B0aW9uIHRvIHJ1biBzY3JpcHRzIGlzIHRydWUgZm9yIGJhY2stY29tcGF0XG5cdFx0XHRcdFx0Ly8gSW50ZW50aW9uYWxseSBsZXQgdGhlIGVycm9yIGJlIHRocm93biBpZiBwYXJzZUhUTUwgaXMgbm90IHByZXNlbnRcblx0XHRcdFx0XHRqUXVlcnkubWVyZ2UoIHRoaXMsIGpRdWVyeS5wYXJzZUhUTUwoXG5cdFx0XHRcdFx0XHRtYXRjaFsgMSBdLFxuXHRcdFx0XHRcdFx0Y29udGV4dCAmJiBjb250ZXh0Lm5vZGVUeXBlID8gY29udGV4dC5vd25lckRvY3VtZW50IHx8IGNvbnRleHQgOiBkb2N1bWVudCxcblx0XHRcdFx0XHRcdHRydWVcblx0XHRcdFx0XHQpICk7XG5cblx0XHRcdFx0XHQvLyBIQU5ETEU6ICQoaHRtbCwgcHJvcHMpXG5cdFx0XHRcdFx0aWYgKCByc2luZ2xlVGFnLnRlc3QoIG1hdGNoWyAxIF0gKSAmJiBqUXVlcnkuaXNQbGFpbk9iamVjdCggY29udGV4dCApICkge1xuXHRcdFx0XHRcdFx0Zm9yICggbWF0Y2ggaW4gY29udGV4dCApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBQcm9wZXJ0aWVzIG9mIGNvbnRleHQgYXJlIGNhbGxlZCBhcyBtZXRob2RzIGlmIHBvc3NpYmxlXG5cdFx0XHRcdFx0XHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHRoaXNbIG1hdGNoIF0gKSApIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzWyBtYXRjaCBdKCBjb250ZXh0WyBtYXRjaCBdICk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gLi4uYW5kIG90aGVyd2lzZSBzZXQgYXMgYXR0cmlidXRlc1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuYXR0ciggbWF0Y2gsIGNvbnRleHRbIG1hdGNoIF0gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXG5cdFx0XHRcdC8vIEhBTkRMRTogJCgjaWQpXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBtYXRjaFsgMiBdICk7XG5cblx0XHRcdFx0XHQvLyBTdXBwb3J0OiBCbGFja2JlcnJ5IDQuNlxuXHRcdFx0XHRcdC8vIGdFQklEIHJldHVybnMgbm9kZXMgbm8gbG9uZ2VyIGluIHRoZSBkb2N1bWVudCAoIzY5NjMpXG5cdFx0XHRcdFx0aWYgKCBlbGVtICYmIGVsZW0ucGFyZW50Tm9kZSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gSW5qZWN0IHRoZSBlbGVtZW50IGRpcmVjdGx5IGludG8gdGhlIGpRdWVyeSBvYmplY3Rcblx0XHRcdFx0XHRcdHRoaXMubGVuZ3RoID0gMTtcblx0XHRcdFx0XHRcdHRoaXNbIDAgXSA9IGVsZW07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0ID0gZG9jdW1lbnQ7XG5cdFx0XHRcdFx0dGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0XHR9XG5cblx0XHRcdC8vIEhBTkRMRTogJChleHByLCAkKC4uLikpXG5cdFx0XHR9IGVsc2UgaWYgKCAhY29udGV4dCB8fCBjb250ZXh0LmpxdWVyeSApIHtcblx0XHRcdFx0cmV0dXJuICggY29udGV4dCB8fCByb290ICkuZmluZCggc2VsZWN0b3IgKTtcblxuXHRcdFx0Ly8gSEFORExFOiAkKGV4cHIsIGNvbnRleHQpXG5cdFx0XHQvLyAod2hpY2ggaXMganVzdCBlcXVpdmFsZW50IHRvOiAkKGNvbnRleHQpLmZpbmQoZXhwcilcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNvbnN0cnVjdG9yKCBjb250ZXh0ICkuZmluZCggc2VsZWN0b3IgKTtcblx0XHRcdH1cblxuXHRcdC8vIEhBTkRMRTogJChET01FbGVtZW50KVxuXHRcdH0gZWxzZSBpZiAoIHNlbGVjdG9yLm5vZGVUeXBlICkge1xuXHRcdFx0dGhpcy5jb250ZXh0ID0gdGhpc1sgMCBdID0gc2VsZWN0b3I7XG5cdFx0XHR0aGlzLmxlbmd0aCA9IDE7XG5cdFx0XHRyZXR1cm4gdGhpcztcblxuXHRcdC8vIEhBTkRMRTogJChmdW5jdGlvbilcblx0XHQvLyBTaG9ydGN1dCBmb3IgZG9jdW1lbnQgcmVhZHlcblx0XHR9IGVsc2UgaWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggc2VsZWN0b3IgKSApIHtcblx0XHRcdHJldHVybiByb290LnJlYWR5ICE9PSB1bmRlZmluZWQgP1xuXHRcdFx0XHRyb290LnJlYWR5KCBzZWxlY3RvciApIDpcblxuXHRcdFx0XHQvLyBFeGVjdXRlIGltbWVkaWF0ZWx5IGlmIHJlYWR5IGlzIG5vdCBwcmVzZW50XG5cdFx0XHRcdHNlbGVjdG9yKCBqUXVlcnkgKTtcblx0XHR9XG5cblx0XHRpZiAoIHNlbGVjdG9yLnNlbGVjdG9yICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHR0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3Iuc2VsZWN0b3I7XG5cdFx0XHR0aGlzLmNvbnRleHQgPSBzZWxlY3Rvci5jb250ZXh0O1xuXHRcdH1cblxuXHRcdHJldHVybiBqUXVlcnkubWFrZUFycmF5KCBzZWxlY3RvciwgdGhpcyApO1xuXHR9O1xuXG4vLyBHaXZlIHRoZSBpbml0IGZ1bmN0aW9uIHRoZSBqUXVlcnkgcHJvdG90eXBlIGZvciBsYXRlciBpbnN0YW50aWF0aW9uXG5pbml0LnByb3RvdHlwZSA9IGpRdWVyeS5mbjtcblxuLy8gSW5pdGlhbGl6ZSBjZW50cmFsIHJlZmVyZW5jZVxucm9vdGpRdWVyeSA9IGpRdWVyeSggZG9jdW1lbnQgKTtcblxucmV0dXJuIGluaXQ7XG5cbn0gKTtcbiJdfQ==