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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9zZWxlY3Rvci1uYXRpdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1AsUUFETyxFQUVQLGdCQUZPLEVBR1AsdUJBSE8sRUFJUCxjQUpPLEVBS1AsZUFMTyxDQUFSLEVBTUcsVUFBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLGVBQTVCLEVBQTZDLE1BQTdDLEVBQXFELE9BQXJELEVBQStEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQmxFLEtBQUksWUFBSjtLQUFrQixTQUFsQjtLQUNDLGFBQWEsT0FBTyxPQUFQLENBQWUsS0FBZixDQUFzQixFQUF0QixFQUEyQixJQUEzQixDQUFpQyxTQUFqQyxFQUE2QyxJQUE3QyxDQUFtRCxFQUFuRCxNQUE0RCxPQUFPLE9BRGpGO0tBRUMsVUFBVSxnQkFBZ0IsT0FBaEIsSUFDVCxnQkFBZ0IscUJBRFAsSUFFVCxnQkFBZ0Isa0JBRlAsSUFHVCxnQkFBZ0IsZ0JBSFAsSUFJVCxnQkFBZ0IsaUJBTmxCOztBQVFBLFVBQVMsU0FBVCxDQUFvQixDQUFwQixFQUF1QixDQUF2QixFQUEyQjs7O0FBRzFCLE1BQUssTUFBTSxDQUFYLEVBQWU7QUFDZCxrQkFBZSxJQUFmO0FBQ0EsVUFBTyxDQUFQO0FBQ0E7OztBQUdELE1BQUksVUFBVSxDQUFDLEVBQUUsdUJBQUgsR0FBNkIsQ0FBQyxFQUFFLHVCQUE5QztBQUNBLE1BQUssT0FBTCxFQUFlO0FBQ2QsVUFBTyxPQUFQO0FBQ0E7OztBQUdELFlBQVUsQ0FBRSxFQUFFLGFBQUYsSUFBbUIsQ0FBckIsT0FBK0IsRUFBRSxhQUFGLElBQW1CLENBQWxELElBQ1QsRUFBRSx1QkFBRixDQUEyQixDQUEzQixDQURTOzs7QUFJVCxHQUpEOzs7QUFPQSxNQUFLLFVBQVUsQ0FBZixFQUFtQjs7O0FBR2xCLE9BQUssTUFBTSxRQUFOLElBQWtCLEVBQUUsYUFBRixLQUFvQixRQUFwQixJ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LFVBQVosQ0FBd0IsS0FBSyxXQUFMLEVBQXhCLENBQVQ7Ozs7QUFHQyxXQUFRLE1BQU0sT0FBTyxJQUFQLENBQWEsT0FBTyxJQUFQLENBQVksVUFBekIsRUFBcUMsS0FBSyxXQUFMLEVBQXJDLENBQU4sR0FDUCxHQUFJLElBQUosRUFBVSxJQUFWLEVBQWdCLE9BQU8sUUFBUCxDQUFpQixJQUFqQixDQUFoQixDQURPLEdBRVAsU0FMRjtBQU1BLFVBQU8sVUFBVSxTQUFWLEdBQXNCLEtBQXRCLEdBQThCLEtBQUssWUFBTCxDQUFtQixJQUFuQixDQUFyQztBQUNBO0FBZjBCLEVBQTVCO0FBa0JDLENBbE5EIiwiZmlsZSI6InNlbGVjdG9yLW5hdGl2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4vY29yZVwiLFxuXHRcIi4vdmFyL2RvY3VtZW50XCIsXG5cdFwiLi92YXIvZG9jdW1lbnRFbGVtZW50XCIsXG5cdFwiLi92YXIvaGFzT3duXCIsXG5cdFwiLi92YXIvaW5kZXhPZlwiXG5dLCBmdW5jdGlvbiggalF1ZXJ5LCBkb2N1bWVudCwgZG9jdW1lbnRFbGVtZW50LCBoYXNPd24sIGluZGV4T2YgKSB7XG5cbi8qXG4gKiBPcHRpb25hbCAobm9uLVNpenpsZSkgc2VsZWN0b3IgbW9kdWxlIGZvciBjdXN0b20gYnVpbGRzLlxuICpcbiAqIE5vdGUgdGhhdCB0aGlzIERPRVMgTk9UIFNVUFBPUlQgbWFueSBkb2N1bWVudGVkIGpRdWVyeVxuICogZmVhdHVyZXMgaW4gZXhjaGFuZ2UgZm9yIGl0cyBzbWFsbGVyIHNpemU6XG4gKlxuICogQXR0cmlidXRlIG5vdCBlcXVhbCBzZWxlY3RvclxuICogUG9zaXRpb25hbCBzZWxlY3RvcnMgKDpmaXJzdDsgOmVxKG4pOyA6b2RkOyBldGMuKVxuICogVHlwZSBzZWxlY3RvcnMgKDppbnB1dDsgOmNoZWNrYm94OyA6YnV0dG9uOyBldGMuKVxuICogU3RhdGUtYmFzZWQgc2VsZWN0b3JzICg6YW5pbWF0ZWQ7IDp2aXNpYmxlOyA6aGlkZGVuOyBldGMuKVxuICogOmhhcyhzZWxlY3RvcilcbiAqIDpub3QoY29tcGxleCBzZWxlY3RvcilcbiAqIGN1c3RvbSBzZWxlY3RvcnMgdmlhIFNpenpsZSBleHRlbnNpb25zXG4gKiBMZWFkaW5nIGNvbWJpbmF0b3JzIChlLmcuLCAkY29sbGVjdGlvbi5maW5kKFwiPiAqXCIpKVxuICogUmVsaWFibGUgZnVuY3Rpb25hbGl0eSBvbiBYTUwgZnJhZ21lbnRzXG4gKiBSZXF1aXJpbmcgYWxsIHBhcnRzIG9mIGEgc2VsZWN0b3IgdG8gbWF0Y2ggZWxlbWVudHMgdW5kZXIgY29udGV4dFxuICogICAoZS5nLiwgJGRpdi5maW5kKFwiZGl2ID4gKlwiKSBub3cgbWF0Y2hlcyBjaGlsZHJlbiBvZiAkZGl2KVxuICogTWF0Y2hpbmcgYWdhaW5zdCBub24tZWxlbWVudHNcbiAqIFJlbGlhYmxlIHNvcnRpbmcgb2YgZGlzY29ubmVjdGVkIG5vZGVzXG4gKiBxdWVyeVNlbGVjdG9yQWxsIGJ1ZyBmaXhlcyAoZS5nLiwgdW5yZWxpYWJsZSA6Zm9jdXMgb24gV2ViS2l0KVxuICpcbiAqIElmIGFueSBvZiB0aGVzZSBhcmUgdW5hY2NlcHRhYmxlIHRyYWRlb2ZmcywgZWl0aGVyIHVzZSBTaXp6bGUgb3JcbiAqIGN1c3RvbWl6ZSB0aGlzIHN0dWIgZm9yIHRoZSBwcm9qZWN0J3Mgc3BlY2lmaWMgbmVlZHMuXG4gKi9cblxudmFyIGhhc0R1cGxpY2F0ZSwgc29ydElucHV0LFxuXHRzb3J0U3RhYmxlID0galF1ZXJ5LmV4cGFuZG8uc3BsaXQoIFwiXCIgKS5zb3J0KCBzb3J0T3JkZXIgKS5qb2luKCBcIlwiICkgPT09IGpRdWVyeS5leHBhbmRvLFxuXHRtYXRjaGVzID0gZG9jdW1lbnRFbGVtZW50Lm1hdGNoZXMgfHxcblx0XHRkb2N1bWVudEVsZW1lbnQud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jdW1lbnRFbGVtZW50Lm1vek1hdGNoZXNTZWxlY3RvciB8fFxuXHRcdGRvY3VtZW50RWxlbWVudC5vTWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jdW1lbnRFbGVtZW50Lm1zTWF0Y2hlc1NlbGVjdG9yO1xuXG5mdW5jdGlvbiBzb3J0T3JkZXIoIGEsIGIgKSB7XG5cblx0Ly8gRmxhZyBmb3IgZHVwbGljYXRlIHJlbW92YWxcblx0aWYgKCBhID09PSBiICkge1xuXHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblxuXHQvLyBTb3J0IG9uIG1ldGhvZCBleGlzdGVuY2UgaWYgb25seSBvbmUgaW5wdXQgaGFzIGNvbXBhcmVEb2N1bWVudFBvc2l0aW9uXG5cdHZhciBjb21wYXJlID0gIWEuY29tcGFyZURvY3VtZW50UG9zaXRpb24gLSAhYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbjtcblx0aWYgKCBjb21wYXJlICkge1xuXHRcdHJldHVybiBjb21wYXJlO1xuXHR9XG5cblx0Ly8gQ2FsY3VsYXRlIHBvc2l0aW9uIGlmIGJvdGggaW5wdXRzIGJlbG9uZyB0byB0aGUgc2FtZSBkb2N1bWVudFxuXHRjb21wYXJlID0gKCBhLm93bmVyRG9jdW1lbnQgfHwgYSApID09PSAoIGIub3duZXJEb2N1bWVudCB8fCBiICkgP1xuXHRcdGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGIgKSA6XG5cblx0XHQvLyBPdGhlcndpc2Ugd2Uga25vdyB0aGV5IGFyZSBkaXNjb25uZWN0ZWRcblx0XHQxO1xuXG5cdC8vIERpc2Nvbm5lY3RlZCBub2Rlc1xuXHRpZiAoIGNvbXBhcmUgJiAxICkge1xuXG5cdFx0Ly8gQ2hvb3NlIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgaXMgcmVsYXRlZCB0byBvdXIgcHJlZmVycmVkIGRvY3VtZW50XG5cdFx0aWYgKCBhID09PSBkb2N1bWVudCB8fCBhLm93bmVyRG9jdW1lbnQgPT09IGRvY3VtZW50ICYmXG5cdFx0XHRqUXVlcnkuY29udGFpbnMoIGRvY3VtZW50LCBhICkgKSB7XG5cdFx0XHRyZXR1cm4gLTE7XG5cdFx0fVxuXHRcdGlmICggYiA9PT0gZG9jdW1lbnQgfHwgYi5vd25lckRvY3VtZW50ID09PSBkb2N1bWVudCAmJlxuXHRcdFx0alF1ZXJ5LmNvbnRhaW5zKCBkb2N1bWVudCwgYiApICkge1xuXHRcdFx0cmV0dXJuIDE7XG5cdFx0fVxuXG5cdFx0Ly8gTWFpbnRhaW4gb3JpZ2luYWwgb3JkZXJcblx0XHRyZXR1cm4gc29ydElucHV0ID9cblx0XHRcdCggaW5kZXhPZi5jYWxsKCBzb3J0SW5wdXQsIGEgKSAtIGluZGV4T2YuY2FsbCggc29ydElucHV0LCBiICkgKSA6XG5cdFx0XHQwO1xuXHR9XG5cblx0cmV0dXJuIGNvbXBhcmUgJiA0ID8gLTEgOiAxO1xufVxuXG5mdW5jdGlvbiB1bmlxdWVTb3J0KCByZXN1bHRzICkge1xuXHR2YXIgZWxlbSxcblx0XHRkdXBsaWNhdGVzID0gW10sXG5cdFx0aiA9IDAsXG5cdFx0aSA9IDA7XG5cblx0aGFzRHVwbGljYXRlID0gZmFsc2U7XG5cdHNvcnRJbnB1dCA9ICFzb3J0U3RhYmxlICYmIHJlc3VsdHMuc2xpY2UoIDAgKTtcblx0cmVzdWx0cy5zb3J0KCBzb3J0T3JkZXIgKTtcblxuXHRpZiAoIGhhc0R1cGxpY2F0ZSApIHtcblx0XHR3aGlsZSAoICggZWxlbSA9IHJlc3VsdHNbIGkrKyBdICkgKSB7XG5cdFx0XHRpZiAoIGVsZW0gPT09IHJlc3VsdHNbIGkgXSApIHtcblx0XHRcdFx0aiA9IGR1cGxpY2F0ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR3aGlsZSAoIGotLSApIHtcblx0XHRcdHJlc3VsdHMuc3BsaWNlKCBkdXBsaWNhdGVzWyBqIF0sIDEgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBDbGVhciBpbnB1dCBhZnRlciBzb3J0aW5nIHRvIHJlbGVhc2Ugb2JqZWN0c1xuXHQvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9zaXp6bGUvcHVsbC8yMjVcblx0c29ydElucHV0ID0gbnVsbDtcblxuXHRyZXR1cm4gcmVzdWx0cztcbn1cblxualF1ZXJ5LmV4dGVuZCgge1xuXHRmaW5kOiBmdW5jdGlvbiggc2VsZWN0b3IsIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKSB7XG5cdFx0dmFyIGVsZW0sIG5vZGVUeXBlLFxuXHRcdFx0aSA9IDA7XG5cblx0XHRyZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcblx0XHRjb250ZXh0ID0gY29udGV4dCB8fCBkb2N1bWVudDtcblxuXHRcdC8vIFNhbWUgYmFzaWMgc2FmZWd1YXJkIGFzIFNpenpsZVxuXHRcdGlmICggIXNlbGVjdG9yIHx8IHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdH1cblxuXHRcdC8vIEVhcmx5IHJldHVybiBpZiBjb250ZXh0IGlzIG5vdCBhbiBlbGVtZW50IG9yIGRvY3VtZW50XG5cdFx0aWYgKCAoIG5vZGVUeXBlID0gY29udGV4dC5ub2RlVHlwZSApICE9PSAxICYmIG5vZGVUeXBlICE9PSA5ICkge1xuXHRcdFx0cmV0dXJuIFtdO1xuXHRcdH1cblxuXHRcdGlmICggc2VlZCApIHtcblx0XHRcdHdoaWxlICggKCBlbGVtID0gc2VlZFsgaSsrIF0gKSApIHtcblx0XHRcdFx0aWYgKCBqUXVlcnkuZmluZC5tYXRjaGVzU2VsZWN0b3IoIGVsZW0sIHNlbGVjdG9yICkgKSB7XG5cdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0alF1ZXJ5Lm1lcmdlKCByZXN1bHRzLCBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIHNlbGVjdG9yICkgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fSxcblx0dW5pcXVlU29ydDogdW5pcXVlU29ydCxcblx0dW5pcXVlOiB1bmlxdWVTb3J0LFxuXHR0ZXh0OiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHR2YXIgbm9kZSxcblx0XHRcdHJldCA9IFwiXCIsXG5cdFx0XHRpID0gMCxcblx0XHRcdG5vZGVUeXBlID0gZWxlbS5ub2RlVHlwZTtcblxuXHRcdGlmICggIW5vZGVUeXBlICkge1xuXG5cdFx0XHQvLyBJZiBubyBub2RlVHlwZSwgdGhpcyBpcyBleHBlY3RlZCB0byBiZSBhbiBhcnJheVxuXHRcdFx0d2hpbGUgKCAoIG5vZGUgPSBlbGVtWyBpKysgXSApICkge1xuXG5cdFx0XHRcdC8vIERvIG5vdCB0cmF2ZXJzZSBjb21tZW50IG5vZGVzXG5cdFx0XHRcdHJldCArPSBqUXVlcnkudGV4dCggbm9kZSApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoIG5vZGVUeXBlID09PSAxIHx8IG5vZGVUeXBlID09PSA5IHx8IG5vZGVUeXBlID09PSAxMSApIHtcblxuXHRcdFx0Ly8gVXNlIHRleHRDb250ZW50IGZvciBlbGVtZW50c1xuXHRcdFx0cmV0dXJuIGVsZW0udGV4dENvbnRlbnQ7XG5cdFx0fSBlbHNlIGlmICggbm9kZVR5cGUgPT09IDMgfHwgbm9kZVR5cGUgPT09IDQgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5ub2RlVmFsdWU7XG5cdFx0fVxuXG5cdFx0Ly8gRG8gbm90IGluY2x1ZGUgY29tbWVudCBvciBwcm9jZXNzaW5nIGluc3RydWN0aW9uIG5vZGVzXG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXHRjb250YWluczogZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0dmFyIGFkb3duID0gYS5ub2RlVHlwZSA9PT0gOSA/IGEuZG9jdW1lbnRFbGVtZW50IDogYSxcblx0XHRcdGJ1cCA9IGIgJiYgYi5wYXJlbnROb2RlO1xuXHRcdHJldHVybiBhID09PSBidXAgfHwgISEoIGJ1cCAmJiBidXAubm9kZVR5cGUgPT09IDEgJiYgYWRvd24uY29udGFpbnMoIGJ1cCApICk7XG5cdH0sXG5cdGlzWE1MRG9jOiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdC8vIGRvY3VtZW50RWxlbWVudCBpcyB2ZXJpZmllZCBmb3IgY2FzZXMgd2hlcmUgaXQgZG9lc24ndCB5ZXQgZXhpc3Rcblx0XHQvLyAoc3VjaCBhcyBsb2FkaW5nIGlmcmFtZXMgaW4gSUUgLSAjNDgzMylcblx0XHR2YXIgZG9jdW1lbnRFbGVtZW50ID0gZWxlbSAmJiAoIGVsZW0ub3duZXJEb2N1bWVudCB8fCBlbGVtICkuZG9jdW1lbnRFbGVtZW50O1xuXHRcdHJldHVybiBkb2N1bWVudEVsZW1lbnQgPyBkb2N1bWVudEVsZW1lbnQubm9kZU5hbWUgIT09IFwiSFRNTFwiIDogZmFsc2U7XG5cdH0sXG5cdGV4cHI6IHtcblx0XHRhdHRySGFuZGxlOiB7fSxcblx0XHRtYXRjaDoge1xuXHRcdFx0Ym9vbDogbmV3IFJlZ0V4cCggXCJeKD86Y2hlY2tlZHxzZWxlY3RlZHxhc3luY3xhdXRvZm9jdXN8YXV0b3BsYXl8Y29udHJvbHN8ZGVmZXJcIiArXG5cdFx0XHRcdFwifGRpc2FibGVkfGhpZGRlbnxpc21hcHxsb29wfG11bHRpcGxlfG9wZW58cmVhZG9ubHl8cmVxdWlyZWR8c2NvcGVkKSRcIiwgXCJpXCIgKSxcblx0XHRcdG5lZWRzQ29udGV4dDogL15bXFx4MjBcXHRcXHJcXG5cXGZdKls+K35dL1xuXHRcdH1cblx0fVxufSApO1xuXG5qUXVlcnkuZXh0ZW5kKCBqUXVlcnkuZmluZCwge1xuXHRtYXRjaGVzOiBmdW5jdGlvbiggZXhwciwgZWxlbWVudHMgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5maW5kKCBleHByLCBudWxsLCBudWxsLCBlbGVtZW50cyApO1xuXHR9LFxuXHRtYXRjaGVzU2VsZWN0b3I6IGZ1bmN0aW9uKCBlbGVtLCBleHByICkge1xuXHRcdHJldHVybiBtYXRjaGVzLmNhbGwoIGVsZW0sIGV4cHIgKTtcblx0fSxcblx0YXR0cjogZnVuY3Rpb24oIGVsZW0sIG5hbWUgKSB7XG5cdFx0dmFyIGZuID0galF1ZXJ5LmV4cHIuYXR0ckhhbmRsZVsgbmFtZS50b0xvd2VyQ2FzZSgpIF0sXG5cblx0XHRcdC8vIERvbid0IGdldCBmb29sZWQgYnkgT2JqZWN0LnByb3RvdHlwZSBwcm9wZXJ0aWVzIChqUXVlcnkgIzEzODA3KVxuXHRcdFx0dmFsdWUgPSBmbiAmJiBoYXNPd24uY2FsbCggalF1ZXJ5LmV4cHIuYXR0ckhhbmRsZSwgbmFtZS50b0xvd2VyQ2FzZSgpICkgP1xuXHRcdFx0XHRmbiggZWxlbSwgbmFtZSwgalF1ZXJ5LmlzWE1MRG9jKCBlbGVtICkgKSA6XG5cdFx0XHRcdHVuZGVmaW5lZDtcblx0XHRyZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDogZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUgKTtcblx0fVxufSApO1xuXG59ICk7XG4iXX0=