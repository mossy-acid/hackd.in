"use strict";

define(["../core", "../var/indexOf", "./var/rneedsContext", "../selector"], function (jQuery, indexOf, rneedsContext) {

	var risSimple = /^.[^:#\[\.,]*$/;

	// Implement the identical functionality for filter and not
	function winnow(elements, qualifier, not) {
		if (jQuery.isFunction(qualifier)) {
			return jQuery.grep(elements, function (elem, i) {
				/* jshint -W018 */
				return !!qualifier.call(elem, i, elem) !== not;
			});
		}

		if (qualifier.nodeType) {
			return jQuery.grep(elements, function (elem) {
				return elem === qualifier !== not;
			});
		}

		if (typeof qualifier === "string") {
			if (risSimple.test(qualifier)) {
				return jQuery.filter(qualifier, elements, not);
			}

			qualifier = jQuery.filter(qualifier, elements);
		}

		return jQuery.grep(elements, function (elem) {
			return indexOf.call(qualifier, elem) > -1 !== not;
		});
	}

	jQuery.filter = function (expr, elems, not) {
		var elem = elems[0];

		if (not) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ? jQuery.find.matchesSelector(elem, expr) ? [elem] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
			return elem.nodeType === 1;
		}));
	};

	jQuery.fn.extend({
		find: function find(selector) {
			var i,
			    len = this.length,
			    ret = [],
			    self = this;

			if (typeof selector !== "string") {
				return this.pushStack(jQuery(selector).filter(function () {
					for (i = 0; i < len; i++) {
						if (jQuery.contains(self[i], this)) {
							return true;
						}
					}
				}));
			}

			for (i = 0; i < len; i++) {
				jQuery.find(selector, self[i], ret);
			}

			// Needed because $( selector, context ) becomes $( context ).find( selector )
			ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
			ret.selector = this.selector ? this.selector + " " + selector : selector;
			return ret;
		},
		filter: function filter(selector) {
			return this.pushStack(winnow(this, selector || [], false));
		},
		not: function not(selector) {
			return this.pushStack(winnow(this, selector || [], true));
		},
		is: function is(selector) {
			return !!winnow(this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
		}
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy90cmF2ZXJzaW5nL2ZpbmRGaWx0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1AsU0FETyxFQUVQLGdCQUZPLEVBR1AscUJBSE8sRUFJUCxhQUpPLENBQVIsRUFLRyxVQUFVLE1BQVYsRUFBa0IsT0FBbEIsRUFBMkIsYUFBM0IsRUFBMkM7O0FBRTlDLEtBQUksWUFBWSxnQkFBaEI7OztBQUdBLFVBQVMsTUFBVCxDQUFpQixRQUFqQixFQUEyQixTQUEzQixFQUFzQyxHQUF0QyxFQUE0QztBQUMzQyxNQUFLLE9BQU8sVUFBUCxDQUFtQixTQUFuQixDQUFMLEVBQXNDO0FBQ3JDLFVBQU8sT0FBTyxJQUFQLENBQWEsUUFBYixFQUF1QixVQUFVLElBQVYsRUFBZ0IsQ0FBaEIsRUFBb0I7O0FBRWpELFdBQU8sQ0FBQyxDQUFDLFVBQVUsSUFBVixDQUFnQixJQUFoQixFQUFzQixDQUF0QixFQUF5QixJQUF6QixDQUFGLEtBQXNDLEdBQTdDO0FBQ0EsSUFITSxDQUFQO0FBS0E7O0FBRUQsTUFBSyxVQUFVLFFBQWYsRUFBMEI7QUFDekIsVUFBTyxPQUFPLElBQVAsQ0FBYSxRQUFiLEVBQXVCLFVBQVUsSUFBVixFQUFpQjtBQUM5QyxXQUFTLFNBQVMsU0FBWCxLQUEyQixHQUFsQztBQUNBLElBRk0sQ0FBUDtBQUlBOztBQUVELE1BQUssT0FBTyxTQUFQLEtBQXFCLFFBQTFCLEVBQXFDO0FBQ3BDLE9BQUssVUFBVSxJQUFWLENBQWdCLFNBQWhCLENBQUwsRUFBbUM7QUFDbEMsV0FBTyxPQUFPLE1BQVAsQ0FBZSxTQUFmLEVBQTBCLFFBQTFCLEVBQW9DLEdBQXBDLENBQVA7QUFDQTs7QUFFRCxlQUFZLE9BQU8sTUFBUCxDQUFlLFNBQWYsRUFBMEIsUUFBMUIsQ0FBWjtBQUNBOztBQUVELFNBQU8sT0FBTyxJQUFQLENBQWEsUUFBYixFQUF1QixVQUFVLElBQVYsRUFBaUI7QUFDOUMsVUFBUyxRQUFRLElBQVIsQ0FBYyxTQUFkLEVBQXlCLElBQXpCLElBQWtDLENBQUMsQ0FBckMsS0FBNkMsR0FBcEQ7QUFDQSxHQUZNLENBQVA7QUFHQTs7QUFFRCxRQUFPLE1BQVAsR0FBZ0IsVUFBVSxJQUFWLEVBQWdCLEtBQWhCLEVBQXVCLEdBQXZCLEVBQTZCO0FBQzVDLE1BQUksT0FBTyxNQUFPLENBQVAsQ0FBWDs7QUFFQSxNQUFLLEdBQUwsRUFBVztBQUNWLFVBQU8sVUFBVSxJQUFWLEdBQWlCLEdBQXhCO0FBQ0E7O0FBRUQsU0FBTyxNQUFNLE1BQU4sS0FBaUIsQ0FBakIsSUFBc0IsS0FBSyxRQUFMLEtBQWtCLENBQXhDLEdBQ04sT0FBTyxJQUFQLENBQVksZUFBWixDQUE2QixJQUE3QixFQUFtQyxJQUFuQyxJQUE0QyxDQUFFLElBQUYsQ0FBNUMsR0FBdUQsRUFEakQsR0FFTixPQUFPLElBQVAsQ0FBWSxPQUFaLENBQXFCLElBQXJCLEVBQTJCLE9BQU8sSUFBUCxDQUFhLEtBQWIsRUFBb0IsVUFBVSxJQUFWLEVBQWlCO0FBQy9ELFVBQU8sS0FBSyxRQUFMLEtBQWtCLENBQXpCO0FBQ0EsR0FGMEIsQ0FBM0IsQ0FGRDtBQUtBLEVBWkQ7O0FBY0EsUUFBTyxFQUFQLENBQVUsTUFBVixDQUFrQjtBQUNqQixRQUFNLGNBQVUsUUFBVixFQUFxQjtBQUMxQixPQUFJLENBQUo7T0FDQyxNQUFNLEtBQUssTUFEWjtPQUVDLE1BQU0sRUFGUDtPQUdDLE9BQU8sSUFIUjs7QUFLQSxPQUFLLE9BQU8sUUFBUCxLQUFvQixRQUF6QixFQUFvQztBQUNuQyxXQUFPLEtBQUssU0FBTCxDQUFnQixPQUFRLFFBQVIsRUFBbUIsTUFBbkIsQ0FBMkIsWUFBVztBQUM1RCxVQUFNLElBQUksQ0FBVixFQUFhLElBQUksR0FBakIsRUFBc0IsR0FBdEIsRUFBNEI7QUFDM0IsVUFBSyxPQUFPLFFBQVAsQ0FBaUIsS0FBTSxDQUFOLENBQWpCLEVBQTRCLElBQTVCLENBQUwsRUFBMEM7QUFDekMsY0FBTyxJQUFQO0FBQ0E7QUFDRDtBQUNELEtBTnNCLENBQWhCLENBQVA7QUFPQTs7QUFFRCxRQUFNLElBQUksQ0FBVixFQUFhLElBQUksR0FBakIsRUFBc0IsR0FBdEIsRUFBNEI7QUFDM0IsV0FBTyxJQUFQLENBQWEsUUFBYixFQUF1QixLQUFNLENBQU4sQ0FBdkIsRUFBa0MsR0FBbEM7QUFDQTs7O0FBR0QsU0FBTSxLQUFLLFNBQUwsQ0FBZ0IsTUFBTSxDQUFOLEdBQVUsT0FBTyxNQUFQLENBQWUsR0FBZixDQUFWLEdBQWlDLEdBQWpELENBQU47QUFDQSxPQUFJLFFBQUosR0FBZSxLQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLEdBQWdCLEdBQWhCLEdBQXNCLFFBQXRDLEdBQWlELFFBQWhFO0FBQ0EsVUFBTyxHQUFQO0FBQ0EsR0F6QmdCO0FBMEJqQixVQUFRLGdCQUFVLFFBQVYsRUFBcUI7QUFDNUIsVUFBTyxLQUFLLFNBQUwsQ0FBZ0IsT0FBUSxJQUFSLEVBQWMsWUFBWSxFQUExQixFQUE4QixLQUE5QixDQUFoQixDQUFQO0FBQ0EsR0E1QmdCO0FBNkJqQixPQUFLLGFBQVUsUUFBVixFQUFxQjtBQUN6QixVQUFPLEtBQUssU0FBTCxDQUFnQixPQUFRLElBQVIsRUFBYyxZQUFZLEVBQTFCLEVBQThCLElBQTlCLENBQWhCLENBQVA7QUFDQSxHQS9CZ0I7QUFnQ2pCLE1BQUksWUFBVSxRQUFWLEVBQXFCO0FBQ3hCLFVBQU8sQ0FBQyxDQUFDLE9BQ1IsSUFEUTs7OztBQUtSLFVBQU8sUUFBUCxLQUFvQixRQUFwQixJQUFnQyxjQUFjLElBQWQsQ0FBb0IsUUFBcEIsQ0FBaEMsR0FDQyxPQUFRLFFBQVIsQ0FERCxHQUVDLFlBQVksRUFQTCxFQVFSLEtBUlEsRUFTUCxNQVRGO0FBVUE7QUEzQ2dCLEVBQWxCO0FBOENDLENBbkdEIiwiZmlsZSI6ImZpbmRGaWx0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuLi9jb3JlXCIsXG5cdFwiLi4vdmFyL2luZGV4T2ZcIixcblx0XCIuL3Zhci9ybmVlZHNDb250ZXh0XCIsXG5cdFwiLi4vc2VsZWN0b3JcIlxuXSwgZnVuY3Rpb24oIGpRdWVyeSwgaW5kZXhPZiwgcm5lZWRzQ29udGV4dCApIHtcblxudmFyIHJpc1NpbXBsZSA9IC9eLlteOiNcXFtcXC4sXSokLztcblxuLy8gSW1wbGVtZW50IHRoZSBpZGVudGljYWwgZnVuY3Rpb25hbGl0eSBmb3IgZmlsdGVyIGFuZCBub3RcbmZ1bmN0aW9uIHdpbm5vdyggZWxlbWVudHMsIHF1YWxpZmllciwgbm90ICkge1xuXHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBxdWFsaWZpZXIgKSApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmdyZXAoIGVsZW1lbnRzLCBmdW5jdGlvbiggZWxlbSwgaSApIHtcblx0XHRcdC8qIGpzaGludCAtVzAxOCAqL1xuXHRcdFx0cmV0dXJuICEhcXVhbGlmaWVyLmNhbGwoIGVsZW0sIGksIGVsZW0gKSAhPT0gbm90O1xuXHRcdH0gKTtcblxuXHR9XG5cblx0aWYgKCBxdWFsaWZpZXIubm9kZVR5cGUgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5ncmVwKCBlbGVtZW50cywgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gKCBlbGVtID09PSBxdWFsaWZpZXIgKSAhPT0gbm90O1xuXHRcdH0gKTtcblxuXHR9XG5cblx0aWYgKCB0eXBlb2YgcXVhbGlmaWVyID09PSBcInN0cmluZ1wiICkge1xuXHRcdGlmICggcmlzU2ltcGxlLnRlc3QoIHF1YWxpZmllciApICkge1xuXHRcdFx0cmV0dXJuIGpRdWVyeS5maWx0ZXIoIHF1YWxpZmllciwgZWxlbWVudHMsIG5vdCApO1xuXHRcdH1cblxuXHRcdHF1YWxpZmllciA9IGpRdWVyeS5maWx0ZXIoIHF1YWxpZmllciwgZWxlbWVudHMgKTtcblx0fVxuXG5cdHJldHVybiBqUXVlcnkuZ3JlcCggZWxlbWVudHMsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHJldHVybiAoIGluZGV4T2YuY2FsbCggcXVhbGlmaWVyLCBlbGVtICkgPiAtMSApICE9PSBub3Q7XG5cdH0gKTtcbn1cblxualF1ZXJ5LmZpbHRlciA9IGZ1bmN0aW9uKCBleHByLCBlbGVtcywgbm90ICkge1xuXHR2YXIgZWxlbSA9IGVsZW1zWyAwIF07XG5cblx0aWYgKCBub3QgKSB7XG5cdFx0ZXhwciA9IFwiOm5vdChcIiArIGV4cHIgKyBcIilcIjtcblx0fVxuXG5cdHJldHVybiBlbGVtcy5sZW5ndGggPT09IDEgJiYgZWxlbS5ub2RlVHlwZSA9PT0gMSA/XG5cdFx0alF1ZXJ5LmZpbmQubWF0Y2hlc1NlbGVjdG9yKCBlbGVtLCBleHByICkgPyBbIGVsZW0gXSA6IFtdIDpcblx0XHRqUXVlcnkuZmluZC5tYXRjaGVzKCBleHByLCBqUXVlcnkuZ3JlcCggZWxlbXMsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0ubm9kZVR5cGUgPT09IDE7XG5cdFx0fSApICk7XG59O1xuXG5qUXVlcnkuZm4uZXh0ZW5kKCB7XG5cdGZpbmQ6IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHR2YXIgaSxcblx0XHRcdGxlbiA9IHRoaXMubGVuZ3RoLFxuXHRcdFx0cmV0ID0gW10sXG5cdFx0XHRzZWxmID0gdGhpcztcblxuXHRcdGlmICggdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiICkge1xuXHRcdFx0cmV0dXJuIHRoaXMucHVzaFN0YWNrKCBqUXVlcnkoIHNlbGVjdG9yICkuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Zm9yICggaSA9IDA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdFx0XHRpZiAoIGpRdWVyeS5jb250YWlucyggc2VsZlsgaSBdLCB0aGlzICkgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gKSApO1xuXHRcdH1cblxuXHRcdGZvciAoIGkgPSAwOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRqUXVlcnkuZmluZCggc2VsZWN0b3IsIHNlbGZbIGkgXSwgcmV0ICk7XG5cdFx0fVxuXG5cdFx0Ly8gTmVlZGVkIGJlY2F1c2UgJCggc2VsZWN0b3IsIGNvbnRleHQgKSBiZWNvbWVzICQoIGNvbnRleHQgKS5maW5kKCBzZWxlY3RvciApXG5cdFx0cmV0ID0gdGhpcy5wdXNoU3RhY2soIGxlbiA+IDEgPyBqUXVlcnkudW5pcXVlKCByZXQgKSA6IHJldCApO1xuXHRcdHJldC5zZWxlY3RvciA9IHRoaXMuc2VsZWN0b3IgPyB0aGlzLnNlbGVjdG9yICsgXCIgXCIgKyBzZWxlY3RvciA6IHNlbGVjdG9yO1xuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cdGZpbHRlcjogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggd2lubm93KCB0aGlzLCBzZWxlY3RvciB8fCBbXSwgZmFsc2UgKSApO1xuXHR9LFxuXHRub3Q6IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIHdpbm5vdyggdGhpcywgc2VsZWN0b3IgfHwgW10sIHRydWUgKSApO1xuXHR9LFxuXHRpczogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHJldHVybiAhIXdpbm5vdyhcblx0XHRcdHRoaXMsXG5cblx0XHRcdC8vIElmIHRoaXMgaXMgYSBwb3NpdGlvbmFsL3JlbGF0aXZlIHNlbGVjdG9yLCBjaGVjayBtZW1iZXJzaGlwIGluIHRoZSByZXR1cm5lZCBzZXRcblx0XHRcdC8vIHNvICQoXCJwOmZpcnN0XCIpLmlzKFwicDpsYXN0XCIpIHdvbid0IHJldHVybiB0cnVlIGZvciBhIGRvYyB3aXRoIHR3byBcInBcIi5cblx0XHRcdHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIiAmJiBybmVlZHNDb250ZXh0LnRlc3QoIHNlbGVjdG9yICkgP1xuXHRcdFx0XHRqUXVlcnkoIHNlbGVjdG9yICkgOlxuXHRcdFx0XHRzZWxlY3RvciB8fCBbXSxcblx0XHRcdGZhbHNlXG5cdFx0KS5sZW5ndGg7XG5cdH1cbn0gKTtcblxufSApO1xuIl19