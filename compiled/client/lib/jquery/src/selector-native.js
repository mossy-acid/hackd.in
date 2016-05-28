"use strict";

define(["./core", "./var/document", "./var/documentElement", "./var/hasOwn", "./var/indexOf"], function (jQuery, document, documentElement, hasOwn, indexOf) {

	/*
  * Optional (non-Sizzle) selector module for custom builds.
  *
  * Note that this DOES NOT SUPPORT many documented jQuery
  * features in exchange for its smaller size:
  *
  * Attribute not equal selector
  * Positional selectors (:first; :eq(n); :odd; etc.)
  * Type selectors (:input; :checkbox; :button; etc.)
  * State-based selectors (:animated; :visible; :hidden; etc.)
  * :has(selector)
  * :not(complex selector)
  * custom selectors via Sizzle extensions
  * Leading combinators (e.g., $collection.find("> *"))
  * Reliable functionality on XML fragments
  * Requiring all parts of a selector to match elements under context
  *   (e.g., $div.find("div > *") now matches children of $div)
  * Matching against non-elements
  * Reliable sorting of disconnected nodes
  * querySelectorAll bug fixes (e.g., unreliable :focus on WebKit)
  *
  * If any of these are unacceptable tradeoffs, either use Sizzle or
  * customize this stub for the project's specific needs.
  */

	var hasDuplicate,
	    sortInput,
	    sortStable = jQuery.expando.split("").sort(sortOrder).join("") === jQuery.expando,
	    matches = documentElement.matches || documentElement.webkitMatchesSelector || documentElement.mozMatchesSelector || documentElement.oMatchesSelector || documentElement.msMatchesSelector;

	function sortOrder(a, b) {

		// Flag for duplicate removal
		if (a === b) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if (compare) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) :

		// Otherwise we know they are disconnected
		1;

		// Disconnected nodes
		if (compare & 1) {

			// Choose the first element that is related to our preferred document
			if (a === document || a.ownerDocument === document && jQuery.contains(document, a)) {
				return -1;
			}
			if (b === document || b.ownerDocument === document && jQuery.contains(document, b)) {
				return 1;
			}

			// Maintain original order
			return sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
		}

		return compare & 4 ? -1 : 1;
	}

	function uniqueSort(results) {
		var elem,
		    duplicates = [],
		    j = 0,
		    i = 0;

		hasDuplicate = false;
		sortInput = !sortStable && results.slice(0);
		results.sort(sortOrder);

		if (hasDuplicate) {
			while (elem = results[i++]) {
				if (elem === results[i]) {
					j = duplicates.push(i);
				}
			}
			while (j--) {
				results.splice(duplicates[j], 1);
			}
		}

		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;

		return results;
	}

	jQuery.extend({
		find: function find(selector, context, results, seed) {
			var elem,
			    nodeType,
			    i = 0;

			results = results || [];
			context = context || document;

			// Same basic safeguard as Sizzle
			if (!selector || typeof selector !== "string") {
				return results;
			}

			// Early return if context is not an element or document
			if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
				return [];
			}

			if (seed) {
				while (elem = seed[i++]) {
					if (jQuery.find.matchesSelector(elem, selector)) {
						results.push(elem);
					}
				}
			} else {
				jQuery.merge(results, context.querySelectorAll(selector));
			}

			return results;
		},
		uniqueSort: uniqueSort,
		unique: uniqueSort,
		text: function text(elem) {
			var node,
			    ret = "",
			    i = 0,
			    nodeType = elem.nodeType;

			if (!nodeType) {

				// If no nodeType, this is expected to be an array
				while (node = elem[i++]) {

					// Do not traverse comment nodes
					ret += jQuery.text(node);
				}
			} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {

				// Use textContent for elements
				return elem.textContent;
			} else if (nodeType === 3 || nodeType === 4) {
				return elem.nodeValue;
			}

			// Do not include comment or processing instruction nodes

			return ret;
		},
		contains: function contains(a, b) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
			    bup = b && b.parentNode;
			return a === bup || !!(bup && bup.nodeType === 1 && adown.contains(bup));
		},
		isXMLDoc: function isXMLDoc(elem) {

			// documentElement is verified for cases where it doesn't yet exist
			// (such as loading iframes in IE - #4833)
			var documentElement = elem && (elem.ownerDocument || elem).documentElement;
			return documentElement ? documentElement.nodeName !== "HTML" : false;
		},
		expr: {
			attrHandle: {},
			match: {
				bool: new RegExp("^(?:checked|selected|async|autofocus|autoplay|controls|defer" + "|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$", "i"),
				needsContext: /^[\x20\t\r\n\f]*[>+~]/
			}
		}
	});

	jQuery.extend(jQuery.find, {
		matches: function matches(expr, elements) {
			return jQuery.find(expr, null, null, elements);
		},
		matchesSelector: function matchesSelector(elem, expr) {
			return matches.call(elem, expr);
		},
		attr: function attr(elem, name) {
			var fn = jQuery.expr.attrHandle[name.toLowerCase()],


			// Don't get fooled by Object.prototype properties (jQuery #13807)
			value = fn && hasOwn.call(jQuery.expr.attrHandle, name.toLowerCase()) ? fn(elem, name, jQuery.isXMLDoc(elem)) : undefined;
			return value !== undefined ? value : elem.getAttribute(name);
		}
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9zZWxlY3Rvci1uYXRpdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1AsUUFETyxFQUVQLGdCQUZPLEVBR1AsdUJBSE8sRUFJUCxjQUpPLEVBS1AsZUFMTyxDQUFSLEVBTUcsVUFBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLGVBQTVCLEVBQTZDLE1BQTdDLEVBQXFELE9BQXJELEVBQStEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQmxFLEtBQUksWUFBSjtLQUFrQixTQUFsQjtLQUNDLGFBQWEsT0FBTyxPQUFQLENBQWUsS0FBZixDQUFzQixFQUF0QixFQUEyQixJQUEzQixDQUFpQyxTQUFqQyxFQUE2QyxJQUE3QyxDQUFtRCxFQUFuRCxNQUE0RCxPQUFPLE9BQVA7S0FDekUsVUFBVSxnQkFBZ0IsT0FBaEIsSUFDVCxnQkFBZ0IscUJBQWhCLElBQ0EsZ0JBQWdCLGtCQUFoQixJQUNBLGdCQUFnQixnQkFBaEIsSUFDQSxnQkFBZ0IsaUJBQWhCLENBakNnRTs7QUFtQ2xFLFVBQVMsU0FBVCxDQUFvQixDQUFwQixFQUF1QixDQUF2QixFQUEyQjs7O0FBRzFCLE1BQUssTUFBTSxDQUFOLEVBQVU7QUFDZCxrQkFBZSxJQUFmLENBRGM7QUFFZCxVQUFPLENBQVAsQ0FGYztHQUFmOzs7QUFIMEIsTUFTdEIsVUFBVSxDQUFDLEVBQUUsdUJBQUYsR0FBNEIsQ0FBQyxFQUFFLHVCQUFGLENBVGxCO0FBVTFCLE1BQUssT0FBTCxFQUFlO0FBQ2QsVUFBTyxPQUFQLENBRGM7R0FBZjs7O0FBVjBCLFNBZTFCLEdBQVUsQ0FBRSxFQUFFLGFBQUYsSUFBbUIsQ0FBbkIsQ0FBRixNQUErQixFQUFFLGFBQUYsSUFBbUIsQ0FBbkIsQ0FBL0IsR0FDVCxFQUFFLHVCQUFGLENBQTJCLENBQTNCLENBRFM7OztBQUlULEdBSlM7OztBQWZnQixNQXNCckIsVUFBVSxDQUFWLEVBQWM7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QW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLFFBQS9CLENBQVAsQ0FEbUM7R0FBM0I7QUFHVCxtQkFBaUIseUJBQVUsSUFBVixFQUFnQixJQUFoQixFQUF1QjtBQUN2QyxVQUFPLFFBQVEsSUFBUixDQUFjLElBQWQsRUFBb0IsSUFBcEIsQ0FBUCxDQUR1QztHQUF2QjtBQUdqQixRQUFNLGNBQVUsSUFBVixFQUFnQixJQUFoQixFQUF1QjtBQUM1QixPQUFJLEtBQUssT0FBTyxJQUFQLENBQVksVUFBWixDQUF3QixLQUFLLFdBQUwsRUFBeEIsQ0FBTDs7OztBQUdILFdBQVEsTUFBTSxPQUFPLElBQVAsQ0FBYSxPQUFPLElBQVAsQ0FBWSxVQUFaLEVBQXdCLEtBQUssV0FBTCxFQUFyQyxDQUFOLEdBQ1AsR0FBSSxJQUFKLEVBQVUsSUFBVixFQUFnQixPQUFPLFFBQVAsQ0FBaUIsSUFBakIsQ0FBaEIsQ0FETyxHQUVQLFNBRk8sQ0FKbUI7QUFPNUIsVUFBTyxVQUFVLFNBQVYsR0FBc0IsS0FBdEIsR0FBOEIsS0FBSyxZQUFMLENBQW1CLElBQW5CLENBQTlCLENBUHFCO0dBQXZCO0VBUFAsRUExTGtFO0NBQS9ELENBTkgiLCJmaWxlIjoic2VsZWN0b3ItbmF0aXZlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBbXG5cdFwiLi9jb3JlXCIsXG5cdFwiLi92YXIvZG9jdW1lbnRcIixcblx0XCIuL3Zhci9kb2N1bWVudEVsZW1lbnRcIixcblx0XCIuL3Zhci9oYXNPd25cIixcblx0XCIuL3Zhci9pbmRleE9mXCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIGRvY3VtZW50LCBkb2N1bWVudEVsZW1lbnQsIGhhc093biwgaW5kZXhPZiApIHtcblxuLypcbiAqIE9wdGlvbmFsIChub24tU2l6emxlKSBzZWxlY3RvciBtb2R1bGUgZm9yIGN1c3RvbSBidWlsZHMuXG4gKlxuICogTm90ZSB0aGF0IHRoaXMgRE9FUyBOT1QgU1VQUE9SVCBtYW55IGRvY3VtZW50ZWQgalF1ZXJ5XG4gKiBmZWF0dXJlcyBpbiBleGNoYW5nZSBmb3IgaXRzIHNtYWxsZXIgc2l6ZTpcbiAqXG4gKiBBdHRyaWJ1dGUgbm90IGVxdWFsIHNlbGVjdG9yXG4gKiBQb3NpdGlvbmFsIHNlbGVjdG9ycyAoOmZpcnN0OyA6ZXEobik7IDpvZGQ7IGV0Yy4pXG4gKiBUeXBlIHNlbGVjdG9ycyAoOmlucHV0OyA6Y2hlY2tib3g7IDpidXR0b247IGV0Yy4pXG4gKiBTdGF0ZS1iYXNlZCBzZWxlY3RvcnMgKDphbmltYXRlZDsgOnZpc2libGU7IDpoaWRkZW47IGV0Yy4pXG4gKiA6aGFzKHNlbGVjdG9yKVxuICogOm5vdChjb21wbGV4IHNlbGVjdG9yKVxuICogY3VzdG9tIHNlbGVjdG9ycyB2aWEgU2l6emxlIGV4dGVuc2lvbnNcbiAqIExlYWRpbmcgY29tYmluYXRvcnMgKGUuZy4sICRjb2xsZWN0aW9uLmZpbmQoXCI+ICpcIikpXG4gKiBSZWxpYWJsZSBmdW5jdGlvbmFsaXR5IG9uIFhNTCBmcmFnbWVudHNcbiAqIFJlcXVpcmluZyBhbGwgcGFydHMgb2YgYSBzZWxlY3RvciB0byBtYXRjaCBlbGVtZW50cyB1bmRlciBjb250ZXh0XG4gKiAgIChlLmcuLCAkZGl2LmZpbmQoXCJkaXYgPiAqXCIpIG5vdyBtYXRjaGVzIGNoaWxkcmVuIG9mICRkaXYpXG4gKiBNYXRjaGluZyBhZ2FpbnN0IG5vbi1lbGVtZW50c1xuICogUmVsaWFibGUgc29ydGluZyBvZiBkaXNjb25uZWN0ZWQgbm9kZXNcbiAqIHF1ZXJ5U2VsZWN0b3JBbGwgYnVnIGZpeGVzIChlLmcuLCB1bnJlbGlhYmxlIDpmb2N1cyBvbiBXZWJLaXQpXG4gKlxuICogSWYgYW55IG9mIHRoZXNlIGFyZSB1bmFjY2VwdGFibGUgdHJhZGVvZmZzLCBlaXRoZXIgdXNlIFNpenpsZSBvclxuICogY3VzdG9taXplIHRoaXMgc3R1YiBmb3IgdGhlIHByb2plY3QncyBzcGVjaWZpYyBuZWVkcy5cbiAqL1xuXG52YXIgaGFzRHVwbGljYXRlLCBzb3J0SW5wdXQsXG5cdHNvcnRTdGFibGUgPSBqUXVlcnkuZXhwYW5kby5zcGxpdCggXCJcIiApLnNvcnQoIHNvcnRPcmRlciApLmpvaW4oIFwiXCIgKSA9PT0galF1ZXJ5LmV4cGFuZG8sXG5cdG1hdGNoZXMgPSBkb2N1bWVudEVsZW1lbnQubWF0Y2hlcyB8fFxuXHRcdGRvY3VtZW50RWxlbWVudC53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2N1bWVudEVsZW1lbnQubW96TWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jdW1lbnRFbGVtZW50Lm9NYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2N1bWVudEVsZW1lbnQubXNNYXRjaGVzU2VsZWN0b3I7XG5cbmZ1bmN0aW9uIHNvcnRPcmRlciggYSwgYiApIHtcblxuXHQvLyBGbGFnIGZvciBkdXBsaWNhdGUgcmVtb3ZhbFxuXHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdC8vIFNvcnQgb24gbWV0aG9kIGV4aXN0ZW5jZSBpZiBvbmx5IG9uZSBpbnB1dCBoYXMgY29tcGFyZURvY3VtZW50UG9zaXRpb25cblx0dmFyIGNvbXBhcmUgPSAhYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiAtICFiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uO1xuXHRpZiAoIGNvbXBhcmUgKSB7XG5cdFx0cmV0dXJuIGNvbXBhcmU7XG5cdH1cblxuXHQvLyBDYWxjdWxhdGUgcG9zaXRpb24gaWYgYm90aCBpbnB1dHMgYmVsb25nIHRvIHRoZSBzYW1lIGRvY3VtZW50XG5cdGNvbXBhcmUgPSAoIGEub3duZXJEb2N1bWVudCB8fCBhICkgPT09ICggYi5vd25lckRvY3VtZW50IHx8IGIgKSA/XG5cdFx0YS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggYiApIDpcblxuXHRcdC8vIE90aGVyd2lzZSB3ZSBrbm93IHRoZXkgYXJlIGRpc2Nvbm5lY3RlZFxuXHRcdDE7XG5cblx0Ly8gRGlzY29ubmVjdGVkIG5vZGVzXG5cdGlmICggY29tcGFyZSAmIDEgKSB7XG5cblx0XHQvLyBDaG9vc2UgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBpcyByZWxhdGVkIHRvIG91ciBwcmVmZXJyZWQgZG9jdW1lbnRcblx0XHRpZiAoIGEgPT09IGRvY3VtZW50IHx8IGEub3duZXJEb2N1bWVudCA9PT0gZG9jdW1lbnQgJiZcblx0XHRcdGpRdWVyeS5jb250YWlucyggZG9jdW1lbnQsIGEgKSApIHtcblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cdFx0aWYgKCBiID09PSBkb2N1bWVudCB8fCBiLm93bmVyRG9jdW1lbnQgPT09IGRvY3VtZW50ICYmXG5cdFx0XHRqUXVlcnkuY29udGFpbnMoIGRvY3VtZW50LCBiICkgKSB7XG5cdFx0XHRyZXR1cm4gMTtcblx0XHR9XG5cblx0XHQvLyBNYWludGFpbiBvcmlnaW5hbCBvcmRlclxuXHRcdHJldHVybiBzb3J0SW5wdXQgP1xuXHRcdFx0KCBpbmRleE9mLmNhbGwoIHNvcnRJbnB1dCwgYSApIC0gaW5kZXhPZi5jYWxsKCBzb3J0SW5wdXQsIGIgKSApIDpcblx0XHRcdDA7XG5cdH1cblxuXHRyZXR1cm4gY29tcGFyZSAmIDQgPyAtMSA6IDE7XG59XG5cbmZ1bmN0aW9uIHVuaXF1ZVNvcnQoIHJlc3VsdHMgKSB7XG5cdHZhciBlbGVtLFxuXHRcdGR1cGxpY2F0ZXMgPSBbXSxcblx0XHRqID0gMCxcblx0XHRpID0gMDtcblxuXHRoYXNEdXBsaWNhdGUgPSBmYWxzZTtcblx0c29ydElucHV0ID0gIXNvcnRTdGFibGUgJiYgcmVzdWx0cy5zbGljZSggMCApO1xuXHRyZXN1bHRzLnNvcnQoIHNvcnRPcmRlciApO1xuXG5cdGlmICggaGFzRHVwbGljYXRlICkge1xuXHRcdHdoaWxlICggKCBlbGVtID0gcmVzdWx0c1sgaSsrIF0gKSApIHtcblx0XHRcdGlmICggZWxlbSA9PT0gcmVzdWx0c1sgaSBdICkge1xuXHRcdFx0XHRqID0gZHVwbGljYXRlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHdoaWxlICggai0tICkge1xuXHRcdFx0cmVzdWx0cy5zcGxpY2UoIGR1cGxpY2F0ZXNbIGogXSwgMSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIENsZWFyIGlucHV0IGFmdGVyIHNvcnRpbmcgdG8gcmVsZWFzZSBvYmplY3RzXG5cdC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L3NpenpsZS9wdWxsLzIyNVxuXHRzb3J0SW5wdXQgPSBudWxsO1xuXG5cdHJldHVybiByZXN1bHRzO1xufVxuXG5qUXVlcnkuZXh0ZW5kKCB7XG5cdGZpbmQ6IGZ1bmN0aW9uKCBzZWxlY3RvciwgY29udGV4dCwgcmVzdWx0cywgc2VlZCApIHtcblx0XHR2YXIgZWxlbSwgbm9kZVR5cGUsXG5cdFx0XHRpID0gMDtcblxuXHRcdHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuXHRcdGNvbnRleHQgPSBjb250ZXh0IHx8IGRvY3VtZW50O1xuXG5cdFx0Ly8gU2FtZSBiYXNpYyBzYWZlZ3VhcmQgYXMgU2l6emxlXG5cdFx0aWYgKCAhc2VsZWN0b3IgfHwgdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiICkge1xuXHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0fVxuXG5cdFx0Ly8gRWFybHkgcmV0dXJuIGlmIGNvbnRleHQgaXMgbm90IGFuIGVsZW1lbnQgb3IgZG9jdW1lbnRcblx0XHRpZiAoICggbm9kZVR5cGUgPSBjb250ZXh0Lm5vZGVUeXBlICkgIT09IDEgJiYgbm9kZVR5cGUgIT09IDkgKSB7XG5cdFx0XHRyZXR1cm4gW107XG5cdFx0fVxuXG5cdFx0aWYgKCBzZWVkICkge1xuXHRcdFx0d2hpbGUgKCAoIGVsZW0gPSBzZWVkWyBpKysgXSApICkge1xuXHRcdFx0XHRpZiAoIGpRdWVyeS5maW5kLm1hdGNoZXNTZWxlY3RvciggZWxlbSwgc2VsZWN0b3IgKSApIHtcblx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRqUXVlcnkubWVyZ2UoIHJlc3VsdHMsIGNvbnRleHQucXVlcnlTZWxlY3RvckFsbCggc2VsZWN0b3IgKSApO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHRzO1xuXHR9LFxuXHR1bmlxdWVTb3J0OiB1bmlxdWVTb3J0LFxuXHR1bmlxdWU6IHVuaXF1ZVNvcnQsXG5cdHRleHQ6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHZhciBub2RlLFxuXHRcdFx0cmV0ID0gXCJcIixcblx0XHRcdGkgPSAwLFxuXHRcdFx0bm9kZVR5cGUgPSBlbGVtLm5vZGVUeXBlO1xuXG5cdFx0aWYgKCAhbm9kZVR5cGUgKSB7XG5cblx0XHRcdC8vIElmIG5vIG5vZGVUeXBlLCB0aGlzIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGFycmF5XG5cdFx0XHR3aGlsZSAoICggbm9kZSA9IGVsZW1bIGkrKyBdICkgKSB7XG5cblx0XHRcdFx0Ly8gRG8gbm90IHRyYXZlcnNlIGNvbW1lbnQgbm9kZXNcblx0XHRcdFx0cmV0ICs9IGpRdWVyeS50ZXh0KCBub2RlICk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICggbm9kZVR5cGUgPT09IDEgfHwgbm9kZVR5cGUgPT09IDkgfHwgbm9kZVR5cGUgPT09IDExICkge1xuXG5cdFx0XHQvLyBVc2UgdGV4dENvbnRlbnQgZm9yIGVsZW1lbnRzXG5cdFx0XHRyZXR1cm4gZWxlbS50ZXh0Q29udGVudDtcblx0XHR9IGVsc2UgaWYgKCBub2RlVHlwZSA9PT0gMyB8fCBub2RlVHlwZSA9PT0gNCApIHtcblx0XHRcdHJldHVybiBlbGVtLm5vZGVWYWx1ZTtcblx0XHR9XG5cblx0XHQvLyBEbyBub3QgaW5jbHVkZSBjb21tZW50IG9yIHByb2Nlc3NpbmcgaW5zdHJ1Y3Rpb24gbm9kZXNcblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cdGNvbnRhaW5zOiBmdW5jdGlvbiggYSwgYiApIHtcblx0XHR2YXIgYWRvd24gPSBhLm5vZGVUeXBlID09PSA5ID8gYS5kb2N1bWVudEVsZW1lbnQgOiBhLFxuXHRcdFx0YnVwID0gYiAmJiBiLnBhcmVudE5vZGU7XG5cdFx0cmV0dXJuIGEgPT09IGJ1cCB8fCAhISggYnVwICYmIGJ1cC5ub2RlVHlwZSA9PT0gMSAmJiBhZG93bi5jb250YWlucyggYnVwICkgKTtcblx0fSxcblx0aXNYTUxEb2M6IGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0Ly8gZG9jdW1lbnRFbGVtZW50IGlzIHZlcmlmaWVkIGZvciBjYXNlcyB3aGVyZSBpdCBkb2Vzbid0IHlldCBleGlzdFxuXHRcdC8vIChzdWNoIGFzIGxvYWRpbmcgaWZyYW1lcyBpbiBJRSAtICM0ODMzKVxuXHRcdHZhciBkb2N1bWVudEVsZW1lbnQgPSBlbGVtICYmICggZWxlbS5vd25lckRvY3VtZW50IHx8IGVsZW0gKS5kb2N1bWVudEVsZW1lbnQ7XG5cdFx0cmV0dXJuIGRvY3VtZW50RWxlbWVudCA/IGRvY3VtZW50RWxlbWVudC5ub2RlTmFtZSAhPT0gXCJIVE1MXCIgOiBmYWxzZTtcblx0fSxcblx0ZXhwcjoge1xuXHRcdGF0dHJIYW5kbGU6IHt9LFxuXHRcdG1hdGNoOiB7XG5cdFx0XHRib29sOiBuZXcgUmVnRXhwKCBcIl4oPzpjaGVja2VkfHNlbGVjdGVkfGFzeW5jfGF1dG9mb2N1c3xhdXRvcGxheXxjb250cm9sc3xkZWZlclwiICtcblx0XHRcdFx0XCJ8ZGlzYWJsZWR8aGlkZGVufGlzbWFwfGxvb3B8bXVsdGlwbGV8b3BlbnxyZWFkb25seXxyZXF1aXJlZHxzY29wZWQpJFwiLCBcImlcIiApLFxuXHRcdFx0bmVlZHNDb250ZXh0OiAvXltcXHgyMFxcdFxcclxcblxcZl0qWz4rfl0vXG5cdFx0fVxuXHR9XG59ICk7XG5cbmpRdWVyeS5leHRlbmQoIGpRdWVyeS5maW5kLCB7XG5cdG1hdGNoZXM6IGZ1bmN0aW9uKCBleHByLCBlbGVtZW50cyApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmZpbmQoIGV4cHIsIG51bGwsIG51bGwsIGVsZW1lbnRzICk7XG5cdH0sXG5cdG1hdGNoZXNTZWxlY3RvcjogZnVuY3Rpb24oIGVsZW0sIGV4cHIgKSB7XG5cdFx0cmV0dXJuIG1hdGNoZXMuY2FsbCggZWxlbSwgZXhwciApO1xuXHR9LFxuXHRhdHRyOiBmdW5jdGlvbiggZWxlbSwgbmFtZSApIHtcblx0XHR2YXIgZm4gPSBqUXVlcnkuZXhwci5hdHRySGFuZGxlWyBuYW1lLnRvTG93ZXJDYXNlKCkgXSxcblxuXHRcdFx0Ly8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBPYmplY3QucHJvdG90eXBlIHByb3BlcnRpZXMgKGpRdWVyeSAjMTM4MDcpXG5cdFx0XHR2YWx1ZSA9IGZuICYmIGhhc093bi5jYWxsKCBqUXVlcnkuZXhwci5hdHRySGFuZGxlLCBuYW1lLnRvTG93ZXJDYXNlKCkgKSA/XG5cdFx0XHRcdGZuKCBlbGVtLCBuYW1lLCBqUXVlcnkuaXNYTUxEb2MoIGVsZW0gKSApIDpcblx0XHRcdFx0dW5kZWZpbmVkO1xuXHRcdHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiBlbGVtLmdldEF0dHJpYnV0ZSggbmFtZSApO1xuXHR9XG59ICk7XG5cbn0gKTtcbiJdfQ==