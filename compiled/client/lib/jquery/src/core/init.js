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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9jb3JlL2luaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsT0FBUSxDQUNQLFNBRE8sRUFFUCxpQkFGTyxFQUdQLGtCQUhPLEVBSVAsMEJBSk8sQ0FBUixFQUtHLFVBQVUsTUFBVixFQUFrQixRQUFsQixFQUE0QixVQUE1QixFQUF5Qzs7O0FBRzVDLEtBQUksVUFBSjs7Ozs7O0FBS0MsY0FBYSxxQ0FBYjtLQUVBLE9BQU8sT0FBTyxFQUFQLENBQVUsSUFBVixHQUFpQixVQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsRUFBb0M7QUFDM0QsTUFBSSxLQUFKLEVBQVcsSUFBWDs7O0FBRDJELE1BSXRELENBQUMsUUFBRCxFQUFZO0FBQ2hCLFVBQU8sSUFBUCxDQURnQjtHQUFqQjs7OztBQUoyRCxNQVUzRCxHQUFPLFFBQVEsVUFBUjs7O0FBVm9ELE1BYXRELE9BQU8sUUFBUCxLQUFvQixRQUFwQixFQUErQjtBQUNuQyxPQUFLLFNBQVUsQ0FBVixNQUFrQixHQUFsQixJQUNKLFNBQVUsU0FBUyxNQUFULEdBQWtCLENBQWxCLENBQVYsS0FBb0MsR0FBcEMsSUFDQSxTQUFTLE1BQVQsSUFBbUIsQ0FBbkIsRUFBdUI7OztBQUd2QixZQUFRLENBQUUsSUFBRixFQUFRLFFBQVIsRUFBa0IsSUFBbEIsQ0FBUixDQUh1QjtJQUZ4QixNQU9PO0FBQ04sWUFBUSxXQUFXLElBQVgsQ0FBaUIsUUFBakIsQ0FBUixDQURNO0lBUFA7OztBQURtQyxPQWE5QixVQUFXLE1BQU8sQ0FBUCxLQUFjLENBQUMsT0FBRCxDQUF6QixFQUFzQzs7O0FBRzFDLFFBQUssTUFBTyxDQUFQLENBQUwsRUFBa0I7QUFDakIsZUFBVSxtQkFBbUIsTUFBbkIsR0FBNEIsUUFBUyxDQUFULENBQTVCLEdBQTJDLE9BQTNDOzs7O0FBRE8sV0FLakIsQ0FBTyxLQUFQLENBQWMsSUFBZCxFQUFvQixPQUFPLFNBQVAsQ0FDbkIsTUFBTyxDQUFQLENBRG1CLEVBRW5CLFdBQVcsUUFBUSxRQUFSLEdBQW1CLFFBQVEsYUFBUixJQUF5QixPQUF6QixHQUFtQyxRQUFqRSxFQUNBLElBSG1CLENBQXBCOzs7QUFMaUIsU0FZWixXQUFXLElBQVgsQ0FBaUIsTUFBTyxDQUFQLENBQWpCLEtBQWlDLE9BQU8sYUFBUCxDQUFzQixPQUF0QixDQUFqQyxFQUFtRTtBQUN2RSxXQUFNLEtBQU4sSUFBZSxPQUFmLEVBQXlCOzs7QUFHeEIsV0FBSyxPQUFPLFVBQVAsQ0FBbUIsS0FBTSxLQUFOLENBQW5CLENBQUwsRUFBMEM7QUFDekMsYUFBTSxLQUFOLEVBQWUsUUFBUyxLQUFULENBQWY7OztBQUR5QyxRQUExQyxNQUlPO0FBQ04sY0FBSyxJQUFMLENBQVcsS0FBWCxFQUFrQixRQUFTLEtBQVQsQ0FBbEIsRUFETTtTQUpQO09BSEQ7TUFERDs7QUFjQSxZQUFPLElBQVA7OztBQTFCaUIsS0FBbEIsTUE2Qk87QUFDTixhQUFPLFNBQVMsY0FBVCxDQUF5QixNQUFPLENBQVAsQ0FBekIsQ0FBUDs7OztBQURNLFVBS0QsUUFBUSxLQUFLLFVBQUwsRUFBa0I7OztBQUc5QixZQUFLLE1BQUwsR0FBYyxDQUFkLENBSDhCO0FBSTlCLFlBQU0sQ0FBTixJQUFZLElBQVosQ0FKOEI7T0FBL0I7O0FBT0EsV0FBSyxPQUFMLEdBQWUsUUFBZixDQVpNO0FBYU4sV0FBSyxRQUFMLEdBQWdCLFFBQWhCLENBYk07QUFjTixhQUFPLElBQVAsQ0FkTTtNQTdCUDs7O0FBSDBDLElBQTNDLE1Ba0RPLElBQUssQ0FBQyxPQUFELElBQVksUUFBUSxNQUFSLEVBQWlCO0FBQ3hDLFlBQU8sQ0FBRSxXQUFXLElBQVgsQ0FBRixDQUFvQixJQUFwQixDQUEwQixRQUExQixDQUFQOzs7O0FBRHdDLEtBQWxDLE1BS0E7QUFDTixhQUFPLEtBQUssV0FBTCxDQUFrQixPQUFsQixFQUE0QixJQUE1QixDQUFrQyxRQUFsQyxDQUFQLENBRE07TUFMQTs7O0FBL0Q0QixHQUFwQyxNQXlFTyxJQUFLLFNBQVMsUUFBVCxFQUFvQjtBQUMvQixTQUFLLE9BQUwsR0FBZSxLQUFNLENBQU4sSUFBWSxRQUFaLENBRGdCO0FBRS9CLFNBQUssTUFBTCxHQUFjLENBQWQsQ0FGK0I7QUFHL0IsV0FBTyxJQUFQOzs7O0FBSCtCLElBQXpCLE1BT0EsSUFBSyxPQUFPLFVBQVAsQ0FBbUIsUUFBbkIsQ0FBTCxFQUFxQztBQUMzQyxZQUFPLEtBQUssS0FBTCxLQUFlLFNBQWYsR0FDTixLQUFLLEtBQUwsQ0FBWSxRQUFaLENBRE07OztBQUlOLGNBQVUsTUFBVixDQUpNLENBRG9DO0tBQXJDOztBQVFQLE1BQUssU0FBUyxRQUFULEtBQXNCLFNBQXRCLEVBQWtDO0FBQ3RDLFFBQUssUUFBTCxHQUFnQixTQUFTLFFBQVQsQ0FEc0I7QUFFdEMsUUFBSyxPQUFMLEdBQWUsU0FBUyxPQUFULENBRnVCO0dBQXZDOztBQUtBLFNBQU8sT0FBTyxTQUFQLENBQWtCLFFBQWxCLEVBQTRCLElBQTVCLENBQVAsQ0ExRzJEO0VBQXBDOzs7QUFWbUIsS0F3SDVDLENBQUssU0FBTCxHQUFpQixPQUFPLEVBQVA7OztBQXhIMkIsV0EySDVDLEdBQWEsT0FBUSxRQUFSLENBQWIsQ0EzSDRDOztBQTZINUMsUUFBTyxJQUFQLENBN0g0QztDQUF6QyxDQUxIIiwiZmlsZSI6ImluaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbml0aWFsaXplIGEgalF1ZXJ5IG9iamVjdFxuZGVmaW5lKCBbXG5cdFwiLi4vY29yZVwiLFxuXHRcIi4uL3Zhci9kb2N1bWVudFwiLFxuXHRcIi4vdmFyL3JzaW5nbGVUYWdcIixcblx0XCIuLi90cmF2ZXJzaW5nL2ZpbmRGaWx0ZXJcIlxuXSwgZnVuY3Rpb24oIGpRdWVyeSwgZG9jdW1lbnQsIHJzaW5nbGVUYWcgKSB7XG5cbi8vIEEgY2VudHJhbCByZWZlcmVuY2UgdG8gdGhlIHJvb3QgalF1ZXJ5KGRvY3VtZW50KVxudmFyIHJvb3RqUXVlcnksXG5cblx0Ly8gQSBzaW1wbGUgd2F5IHRvIGNoZWNrIGZvciBIVE1MIHN0cmluZ3Ncblx0Ly8gUHJpb3JpdGl6ZSAjaWQgb3ZlciA8dGFnPiB0byBhdm9pZCBYU1MgdmlhIGxvY2F0aW9uLmhhc2ggKCM5NTIxKVxuXHQvLyBTdHJpY3QgSFRNTCByZWNvZ25pdGlvbiAoIzExMjkwOiBtdXN0IHN0YXJ0IHdpdGggPClcblx0cnF1aWNrRXhwciA9IC9eKD86XFxzKig8W1xcd1xcV10rPilbXj5dKnwjKFtcXHctXSopKSQvLFxuXG5cdGluaXQgPSBqUXVlcnkuZm4uaW5pdCA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgY29udGV4dCwgcm9vdCApIHtcblx0XHR2YXIgbWF0Y2gsIGVsZW07XG5cblx0XHQvLyBIQU5ETEU6ICQoXCJcIiksICQobnVsbCksICQodW5kZWZpbmVkKSwgJChmYWxzZSlcblx0XHRpZiAoICFzZWxlY3RvciApIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdC8vIE1ldGhvZCBpbml0KCkgYWNjZXB0cyBhbiBhbHRlcm5hdGUgcm9vdGpRdWVyeVxuXHRcdC8vIHNvIG1pZ3JhdGUgY2FuIHN1cHBvcnQgalF1ZXJ5LnN1YiAoZ2gtMjEwMSlcblx0XHRyb290ID0gcm9vdCB8fCByb290alF1ZXJ5O1xuXG5cdFx0Ly8gSGFuZGxlIEhUTUwgc3RyaW5nc1xuXHRcdGlmICggdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0aWYgKCBzZWxlY3RvclsgMCBdID09PSBcIjxcIiAmJlxuXHRcdFx0XHRzZWxlY3Rvclsgc2VsZWN0b3IubGVuZ3RoIC0gMSBdID09PSBcIj5cIiAmJlxuXHRcdFx0XHRzZWxlY3Rvci5sZW5ndGggPj0gMyApIHtcblxuXHRcdFx0XHQvLyBBc3N1bWUgdGhhdCBzdHJpbmdzIHRoYXQgc3RhcnQgYW5kIGVuZCB3aXRoIDw+IGFyZSBIVE1MIGFuZCBza2lwIHRoZSByZWdleCBjaGVja1xuXHRcdFx0XHRtYXRjaCA9IFsgbnVsbCwgc2VsZWN0b3IsIG51bGwgXTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWF0Y2ggPSBycXVpY2tFeHByLmV4ZWMoIHNlbGVjdG9yICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE1hdGNoIGh0bWwgb3IgbWFrZSBzdXJlIG5vIGNvbnRleHQgaXMgc3BlY2lmaWVkIGZvciAjaWRcblx0XHRcdGlmICggbWF0Y2ggJiYgKCBtYXRjaFsgMSBdIHx8ICFjb250ZXh0ICkgKSB7XG5cblx0XHRcdFx0Ly8gSEFORExFOiAkKGh0bWwpIC0+ICQoYXJyYXkpXG5cdFx0XHRcdGlmICggbWF0Y2hbIDEgXSApIHtcblx0XHRcdFx0XHRjb250ZXh0ID0gY29udGV4dCBpbnN0YW5jZW9mIGpRdWVyeSA/IGNvbnRleHRbIDAgXSA6IGNvbnRleHQ7XG5cblx0XHRcdFx0XHQvLyBPcHRpb24gdG8gcnVuIHNjcmlwdHMgaXMgdHJ1ZSBmb3IgYmFjay1jb21wYXRcblx0XHRcdFx0XHQvLyBJbnRlbnRpb25hbGx5IGxldCB0aGUgZXJyb3IgYmUgdGhyb3duIGlmIHBhcnNlSFRNTCBpcyBub3QgcHJlc2VudFxuXHRcdFx0XHRcdGpRdWVyeS5tZXJnZSggdGhpcywgalF1ZXJ5LnBhcnNlSFRNTChcblx0XHRcdFx0XHRcdG1hdGNoWyAxIF0sXG5cdFx0XHRcdFx0XHRjb250ZXh0ICYmIGNvbnRleHQubm9kZVR5cGUgPyBjb250ZXh0Lm93bmVyRG9jdW1lbnQgfHwgY29udGV4dCA6IGRvY3VtZW50LFxuXHRcdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRcdCkgKTtcblxuXHRcdFx0XHRcdC8vIEhBTkRMRTogJChodG1sLCBwcm9wcylcblx0XHRcdFx0XHRpZiAoIHJzaW5nbGVUYWcudGVzdCggbWF0Y2hbIDEgXSApICYmIGpRdWVyeS5pc1BsYWluT2JqZWN0KCBjb250ZXh0ICkgKSB7XG5cdFx0XHRcdFx0XHRmb3IgKCBtYXRjaCBpbiBjb250ZXh0ICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFByb3BlcnRpZXMgb2YgY29udGV4dCBhcmUgY2FsbGVkIGFzIG1ldGhvZHMgaWYgcG9zc2libGVcblx0XHRcdFx0XHRcdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggdGhpc1sgbWF0Y2ggXSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXNbIG1hdGNoIF0oIGNvbnRleHRbIG1hdGNoIF0gKTtcblxuXHRcdFx0XHRcdFx0XHQvLyAuLi5hbmQgb3RoZXJ3aXNlIHNldCBhcyBhdHRyaWJ1dGVzXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5hdHRyKCBtYXRjaCwgY29udGV4dFsgbWF0Y2ggXSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cblx0XHRcdFx0Ly8gSEFORExFOiAkKCNpZClcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIG1hdGNoWyAyIF0gKTtcblxuXHRcdFx0XHRcdC8vIFN1cHBvcnQ6IEJsYWNrYmVycnkgNC42XG5cdFx0XHRcdFx0Ly8gZ0VCSUQgcmV0dXJucyBub2RlcyBubyBsb25nZXIgaW4gdGhlIGRvY3VtZW50ICgjNjk2Mylcblx0XHRcdFx0XHRpZiAoIGVsZW0gJiYgZWxlbS5wYXJlbnROb2RlICkge1xuXG5cdFx0XHRcdFx0XHQvLyBJbmplY3QgdGhlIGVsZW1lbnQgZGlyZWN0bHkgaW50byB0aGUgalF1ZXJ5IG9iamVjdFxuXHRcdFx0XHRcdFx0dGhpcy5sZW5ndGggPSAxO1xuXHRcdFx0XHRcdFx0dGhpc1sgMCBdID0gZWxlbTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR0aGlzLmNvbnRleHQgPSBkb2N1bWVudDtcblx0XHRcdFx0XHR0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH1cblxuXHRcdFx0Ly8gSEFORExFOiAkKGV4cHIsICQoLi4uKSlcblx0XHRcdH0gZWxzZSBpZiAoICFjb250ZXh0IHx8IGNvbnRleHQuanF1ZXJ5ICkge1xuXHRcdFx0XHRyZXR1cm4gKCBjb250ZXh0IHx8IHJvb3QgKS5maW5kKCBzZWxlY3RvciApO1xuXG5cdFx0XHQvLyBIQU5ETEU6ICQoZXhwciwgY29udGV4dClcblx0XHRcdC8vICh3aGljaCBpcyBqdXN0IGVxdWl2YWxlbnQgdG86ICQoY29udGV4dCkuZmluZChleHByKVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29uc3RydWN0b3IoIGNvbnRleHQgKS5maW5kKCBzZWxlY3RvciApO1xuXHRcdFx0fVxuXG5cdFx0Ly8gSEFORExFOiAkKERPTUVsZW1lbnQpXG5cdFx0fSBlbHNlIGlmICggc2VsZWN0b3Iubm9kZVR5cGUgKSB7XG5cdFx0XHR0aGlzLmNvbnRleHQgPSB0aGlzWyAwIF0gPSBzZWxlY3Rvcjtcblx0XHRcdHRoaXMubGVuZ3RoID0gMTtcblx0XHRcdHJldHVybiB0aGlzO1xuXG5cdFx0Ly8gSEFORExFOiAkKGZ1bmN0aW9uKVxuXHRcdC8vIFNob3J0Y3V0IGZvciBkb2N1bWVudCByZWFkeVxuXHRcdH0gZWxzZSBpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBzZWxlY3RvciApICkge1xuXHRcdFx0cmV0dXJuIHJvb3QucmVhZHkgIT09IHVuZGVmaW5lZCA/XG5cdFx0XHRcdHJvb3QucmVhZHkoIHNlbGVjdG9yICkgOlxuXG5cdFx0XHRcdC8vIEV4ZWN1dGUgaW1tZWRpYXRlbHkgaWYgcmVhZHkgaXMgbm90IHByZXNlbnRcblx0XHRcdFx0c2VsZWN0b3IoIGpRdWVyeSApO1xuXHRcdH1cblxuXHRcdGlmICggc2VsZWN0b3Iuc2VsZWN0b3IgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHRoaXMuc2VsZWN0b3IgPSBzZWxlY3Rvci5zZWxlY3Rvcjtcblx0XHRcdHRoaXMuY29udGV4dCA9IHNlbGVjdG9yLmNvbnRleHQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGpRdWVyeS5tYWtlQXJyYXkoIHNlbGVjdG9yLCB0aGlzICk7XG5cdH07XG5cbi8vIEdpdmUgdGhlIGluaXQgZnVuY3Rpb24gdGhlIGpRdWVyeSBwcm90b3R5cGUgZm9yIGxhdGVyIGluc3RhbnRpYXRpb25cbmluaXQucHJvdG90eXBlID0galF1ZXJ5LmZuO1xuXG4vLyBJbml0aWFsaXplIGNlbnRyYWwgcmVmZXJlbmNlXG5yb290alF1ZXJ5ID0galF1ZXJ5KCBkb2N1bWVudCApO1xuXG5yZXR1cm4gaW5pdDtcblxufSApO1xuIl19