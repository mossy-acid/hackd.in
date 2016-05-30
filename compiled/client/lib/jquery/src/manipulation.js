"use strict";

define(["./core", "./var/concat", "./var/push", "./core/access", "./manipulation/var/rcheckableType", "./manipulation/var/rtagName", "./manipulation/var/rscriptType", "./manipulation/wrapMap", "./manipulation/getAll", "./manipulation/setGlobalEval", "./manipulation/buildFragment", "./manipulation/support", "./data/var/dataPriv", "./data/var/dataUser", "./data/var/acceptData", "./core/init", "./traversing", "./selector", "./event"], function (jQuery, concat, push, access, rcheckableType, rtagName, rscriptType, wrapMap, getAll, setGlobalEval, buildFragment, support, dataPriv, dataUser, acceptData) {

	var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,


	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,


	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	    rscriptTypeMasked = /^true\/(.*)/,
	    rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

	// Manipulating tables requires a tbody
	function manipulationTarget(elem, content) {
		return jQuery.nodeName(elem, "table") && jQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript(elem) {
		elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
		return elem;
	}
	function restoreScript(elem) {
		var match = rscriptTypeMasked.exec(elem.type);

		if (match) {
			elem.type = match[1];
		} else {
			elem.removeAttribute("type");
		}

		return elem;
	}

	function cloneCopyEvent(src, dest) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

		if (dest.nodeType !== 1) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if (dataPriv.hasData(src)) {
			pdataOld = dataPriv.access(src);
			pdataCur = dataPriv.set(dest, pdataOld);
			events = pdataOld.events;

			if (events) {
				delete pdataCur.handle;
				pdataCur.events = {};

				for (type in events) {
					for (i = 0, l = events[type].length; i < l; i++) {
						jQuery.event.add(dest, type, events[type][i]);
					}
				}
			}
		}

		// 2. Copy user data
		if (dataUser.hasData(src)) {
			udataOld = dataUser.access(src);
			udataCur = jQuery.extend({}, udataOld);

			dataUser.set(dest, udataCur);
		}
	}

	// Fix IE bugs, see support tests
	function fixInput(src, dest) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if (nodeName === "input" && rcheckableType.test(src.type)) {
			dest.checked = src.checked;

			// Fails to return the selected option to the default selected state when cloning options
		} else if (nodeName === "input" || nodeName === "textarea") {
				dest.defaultValue = src.defaultValue;
			}
	}

	function domManip(collection, args, callback, ignored) {

		// Flatten any nested arrays
		args = concat.apply([], args);

		var fragment,
		    first,
		    scripts,
		    hasScripts,
		    node,
		    doc,
		    i = 0,
		    l = collection.length,
		    iNoClone = l - 1,
		    value = args[0],
		    isFunction = jQuery.isFunction(value);

		// We can't cloneNode fragments that contain checked, in WebKit
		if (isFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
			return collection.each(function (index) {
				var self = collection.eq(index);
				if (isFunction) {
					args[0] = value.call(this, index, self.html());
				}
				domManip(self, args, callback, ignored);
			});
		}

		if (l) {
			fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
			first = fragment.firstChild;

			if (fragment.childNodes.length === 1) {
				fragment = first;
			}

			// Require either new content or an interest in ignored elements to invoke the callback
			if (first || ignored) {
				scripts = jQuery.map(getAll(fragment, "script"), disableScript);
				hasScripts = scripts.length;

				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for (; i < l; i++) {
					node = fragment;

					if (i !== iNoClone) {
						node = jQuery.clone(node, true, true);

						// Keep references to cloned scripts for later restoration
						if (hasScripts) {

							// Support: Android<4.1, PhantomJS<2
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge(scripts, getAll(node, "script"));
						}
					}

					callback.call(collection[i], node, i);
				}

				if (hasScripts) {
					doc = scripts[scripts.length - 1].ownerDocument;

					// Reenable scripts
					jQuery.map(scripts, restoreScript);

					// Evaluate executable scripts on first document insertion
					for (i = 0; i < hasScripts; i++) {
						node = scripts[i];
						if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {

							if (node.src) {

								// Optional AJAX dependency, but won't run scripts if not present
								if (jQuery._evalUrl) {
									jQuery._evalUrl(node.src);
								}
							} else {
								jQuery.globalEval(node.textContent.replace(rcleanScript, ""));
							}
						}
					}
				}
			}
		}

		return collection;
	}

	function _remove(elem, selector, keepData) {
		var node,
		    nodes = selector ? jQuery.filter(selector, elem) : elem,
		    i = 0;

		for (; (node = nodes[i]) != null; i++) {
			if (!keepData && node.nodeType === 1) {
				jQuery.cleanData(getAll(node));
			}

			if (node.parentNode) {
				if (keepData && jQuery.contains(node.ownerDocument, node)) {
					setGlobalEval(getAll(node, "script"));
				}
				node.parentNode.removeChild(node);
			}
		}

		return elem;
	}

	jQuery.extend({
		htmlPrefilter: function htmlPrefilter(html) {
			return html.replace(rxhtmlTag, "<$1></$2>");
		},

		clone: function clone(elem, dataAndEvents, deepDataAndEvents) {
			var i,
			    l,
			    srcElements,
			    destElements,
			    clone = elem.cloneNode(true),
			    inPage = jQuery.contains(elem.ownerDocument, elem);

			// Fix IE cloning issues
			if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {

				// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
				destElements = getAll(clone);
				srcElements = getAll(elem);

				for (i = 0, l = srcElements.length; i < l; i++) {
					fixInput(srcElements[i], destElements[i]);
				}
			}

			// Copy the events from the original to the clone
			if (dataAndEvents) {
				if (deepDataAndEvents) {
					srcElements = srcElements || getAll(elem);
					destElements = destElements || getAll(clone);

					for (i = 0, l = srcElements.length; i < l; i++) {
						cloneCopyEvent(srcElements[i], destElements[i]);
					}
				} else {
					cloneCopyEvent(elem, clone);
				}
			}

			// Preserve script evaluation history
			destElements = getAll(clone, "script");
			if (destElements.length > 0) {
				setGlobalEval(destElements, !inPage && getAll(elem, "script"));
			}

			// Return the cloned set
			return clone;
		},

		cleanData: function cleanData(elems) {
			var data,
			    elem,
			    type,
			    special = jQuery.event.special,
			    i = 0;

			for (; (elem = elems[i]) !== undefined; i++) {
				if (acceptData(elem)) {
					if (data = elem[dataPriv.expando]) {
						if (data.events) {
							for (type in data.events) {
								if (special[type]) {
									jQuery.event.remove(elem, type);

									// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
										jQuery.removeEvent(elem, type, data.handle);
									}
							}
						}

						// Support: Chrome <= 35-45+
						// Assign undefined instead of using delete, see Data#remove
						elem[dataPriv.expando] = undefined;
					}
					if (elem[dataUser.expando]) {

						// Support: Chrome <= 35-45+
						// Assign undefined instead of using delete, see Data#remove
						elem[dataUser.expando] = undefined;
					}
				}
			}
		}
	});

	jQuery.fn.extend({

		// Keep domManip exposed until 3.0 (gh-2225)
		domManip: domManip,

		detach: function detach(selector) {
			return _remove(this, selector, true);
		},

		remove: function remove(selector) {
			return _remove(this, selector);
		},

		text: function text(value) {
			return access(this, function (value) {
				return value === undefined ? jQuery.text(this) : this.empty().each(function () {
					if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
						this.textContent = value;
					}
				});
			}, null, value, arguments.length);
		},

		append: function append() {
			return domManip(this, arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.appendChild(elem);
				}
			});
		},

		prepend: function prepend() {
			return domManip(this, arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.insertBefore(elem, target.firstChild);
				}
			});
		},

		before: function before() {
			return domManip(this, arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this);
				}
			});
		},

		after: function after() {
			return domManip(this, arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this.nextSibling);
				}
			});
		},

		empty: function empty() {
			var elem,
			    i = 0;

			for (; (elem = this[i]) != null; i++) {
				if (elem.nodeType === 1) {

					// Prevent memory leaks
					jQuery.cleanData(getAll(elem, false));

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function clone(dataAndEvents, deepDataAndEvents) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map(function () {
				return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
			});
		},

		html: function html(value) {
			return access(this, function (value) {
				var elem = this[0] || {},
				    i = 0,
				    l = this.length;

				if (value === undefined && elem.nodeType === 1) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if (typeof value === "string" && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

					value = jQuery.htmlPrefilter(value);

					try {
						for (; i < l; i++) {
							elem = this[i] || {};

							// Remove element nodes and prevent memory leaks
							if (elem.nodeType === 1) {
								jQuery.cleanData(getAll(elem, false));
								elem.innerHTML = value;
							}
						}

						elem = 0;

						// If using innerHTML throws an exception, use the fallback method
					} catch (e) {}
				}

				if (elem) {
					this.empty().append(value);
				}
			}, null, value, arguments.length);
		},

		replaceWith: function replaceWith() {
			var ignored = [];

			// Make the changes, replacing each non-ignored context element with the new content
			return domManip(this, arguments, function (elem) {
				var parent = this.parentNode;

				if (jQuery.inArray(this, ignored) < 0) {
					jQuery.cleanData(getAll(this));
					if (parent) {
						parent.replaceChild(elem, this);
					}
				}

				// Force callback invocation
			}, ignored);
		}
	});

	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function (name, original) {
		jQuery.fn[name] = function (selector) {
			var elems,
			    ret = [],
			    insert = jQuery(selector),
			    last = insert.length - 1,
			    i = 0;

			for (; i <= last; i++) {
				elems = i === last ? this : this.clone(true);
				jQuery(insert[i])[original](elems);

				// Support: QtWebKit
				// .get() because push.apply(_, arraylike) throws
				push.apply(ret, elems.get());
			}

			return this.pushStack(ret);
		};
	});

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9tYW5pcHVsYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1AsUUFETyxFQUVQLGNBRk8sRUFHUCxZQUhPLEVBSVAsZUFKTyxFQUtQLG1DQUxPLEVBTVAsNkJBTk8sRUFPUCxnQ0FQTyxFQVFQLHdCQVJPLEVBU1AsdUJBVE8sRUFVUCw4QkFWTyxFQVdQLDhCQVhPLEVBWVAsd0JBWk8sRUFjUCxxQkFkTyxFQWVQLHFCQWZPLEVBZ0JQLHVCQWhCTyxFQWtCUCxhQWxCTyxFQW1CUCxjQW5CTyxFQW9CUCxZQXBCTyxFQXFCUCxTQXJCTyxDQUFSLEVBc0JHLFVBQVUsTUFBVixFQUFrQixNQUFsQixFQUEwQixJQUExQixFQUFnQyxNQUFoQyxFQUNGLGNBREUsRUFDYyxRQURkLEVBQ3dCLFdBRHhCLEVBRUYsT0FGRSxFQUVPLE1BRlAsRUFFZSxhQUZmLEVBRThCLGFBRjlCLEVBRTZDLE9BRjdDLEVBR0YsUUFIRSxFQUdRLFFBSFIsRUFHa0IsVUFIbEIsRUFHK0I7O0FBRWxDLEtBQ0MsWUFBWSwwRUFBWjs7Ozs7O0FBS0EsZ0JBQWUsdUJBQWY7Ozs7QUFHQSxZQUFXLG1DQUFYO0tBQ0Esb0JBQW9CLGFBQXBCO0tBQ0EsZUFBZSwwQ0FBZjs7O0FBYmlDLFVBZ0J6QixrQkFBVCxDQUE2QixJQUE3QixFQUFtQyxPQUFuQyxFQUE2QztBQUM1QyxTQUFPLE9BQU8sUUFBUCxDQUFpQixJQUFqQixFQUF1QixPQUF2QixLQUNOLE9BQU8sUUFBUCxDQUFpQixRQUFRLFFBQVIsS0FBcUIsRUFBckIsR0FBMEIsT0FBMUIsR0FBb0MsUUFBUSxVQUFSLEVBQW9CLElBQXpFLENBRE0sR0FHTixLQUFLLG9CQUFMLENBQTJCLE9BQTNCLEVBQXNDLENBQXRDLEtBQ0MsS0FBSyxXQUFMLENBQWtCLEtBQUssYUFBTCxDQUFtQixhQUFuQixDQUFrQyxPQUFsQyxDQUFsQixDQURELEdBRUEsSUFM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d0I7SUFBekI7O0FBU0EsVUFBTyxLQUFLLFNBQUwsQ0FBZ0IsR0FBaEIsQ0FBUCxDQWhCd0M7R0FBckIsQ0FEUztFQUEzQixDQU5ILENBM2FrQzs7QUFzY2xDLFFBQU8sTUFBUCxDQXRja0M7Q0FIL0IsQ0F0QkgiLCJmaWxlIjoibWFuaXB1bGF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBbXG5cdFwiLi9jb3JlXCIsXG5cdFwiLi92YXIvY29uY2F0XCIsXG5cdFwiLi92YXIvcHVzaFwiLFxuXHRcIi4vY29yZS9hY2Nlc3NcIixcblx0XCIuL21hbmlwdWxhdGlvbi92YXIvcmNoZWNrYWJsZVR5cGVcIixcblx0XCIuL21hbmlwdWxhdGlvbi92YXIvcnRhZ05hbWVcIixcblx0XCIuL21hbmlwdWxhdGlvbi92YXIvcnNjcmlwdFR5cGVcIixcblx0XCIuL21hbmlwdWxhdGlvbi93cmFwTWFwXCIsXG5cdFwiLi9tYW5pcHVsYXRpb24vZ2V0QWxsXCIsXG5cdFwiLi9tYW5pcHVsYXRpb24vc2V0R2xvYmFsRXZhbFwiLFxuXHRcIi4vbWFuaXB1bGF0aW9uL2J1aWxkRnJhZ21lbnRcIixcblx0XCIuL21hbmlwdWxhdGlvbi9zdXBwb3J0XCIsXG5cblx0XCIuL2RhdGEvdmFyL2RhdGFQcml2XCIsXG5cdFwiLi9kYXRhL3Zhci9kYXRhVXNlclwiLFxuXHRcIi4vZGF0YS92YXIvYWNjZXB0RGF0YVwiLFxuXG5cdFwiLi9jb3JlL2luaXRcIixcblx0XCIuL3RyYXZlcnNpbmdcIixcblx0XCIuL3NlbGVjdG9yXCIsXG5cdFwiLi9ldmVudFwiXG5dLCBmdW5jdGlvbiggalF1ZXJ5LCBjb25jYXQsIHB1c2gsIGFjY2Vzcyxcblx0cmNoZWNrYWJsZVR5cGUsIHJ0YWdOYW1lLCByc2NyaXB0VHlwZSxcblx0d3JhcE1hcCwgZ2V0QWxsLCBzZXRHbG9iYWxFdmFsLCBidWlsZEZyYWdtZW50LCBzdXBwb3J0LFxuXHRkYXRhUHJpdiwgZGF0YVVzZXIsIGFjY2VwdERhdGEgKSB7XG5cbnZhclxuXHRyeGh0bWxUYWcgPSAvPCg/IWFyZWF8YnJ8Y29sfGVtYmVkfGhyfGltZ3xpbnB1dHxsaW5rfG1ldGF8cGFyYW0pKChbXFx3Oi1dKylbXj5dKilcXC8+L2dpLFxuXG5cdC8vIFN1cHBvcnQ6IElFIDEwLTExLCBFZGdlIDEwMjQwK1xuXHQvLyBJbiBJRS9FZGdlIHVzaW5nIHJlZ2V4IGdyb3VwcyBoZXJlIGNhdXNlcyBzZXZlcmUgc2xvd2Rvd25zLlxuXHQvLyBTZWUgaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy8xNzM2NTEyL1xuXHRybm9Jbm5lcmh0bWwgPSAvPHNjcmlwdHw8c3R5bGV8PGxpbmsvaSxcblxuXHQvLyBjaGVja2VkPVwiY2hlY2tlZFwiIG9yIGNoZWNrZWRcblx0cmNoZWNrZWQgPSAvY2hlY2tlZFxccyooPzpbXj1dfD1cXHMqLmNoZWNrZWQuKS9pLFxuXHRyc2NyaXB0VHlwZU1hc2tlZCA9IC9edHJ1ZVxcLyguKikvLFxuXHRyY2xlYW5TY3JpcHQgPSAvXlxccyo8ISg/OlxcW0NEQVRBXFxbfC0tKXwoPzpcXF1cXF18LS0pPlxccyokL2c7XG5cbi8vIE1hbmlwdWxhdGluZyB0YWJsZXMgcmVxdWlyZXMgYSB0Ym9keVxuZnVuY3Rpb24gbWFuaXB1bGF0aW9uVGFyZ2V0KCBlbGVtLCBjb250ZW50ICkge1xuXHRyZXR1cm4galF1ZXJ5Lm5vZGVOYW1lKCBlbGVtLCBcInRhYmxlXCIgKSAmJlxuXHRcdGpRdWVyeS5ub2RlTmFtZSggY29udGVudC5ub2RlVHlwZSAhPT0gMTEgPyBjb250ZW50IDogY29udGVudC5maXJzdENoaWxkLCBcInRyXCIgKSA/XG5cblx0XHRlbGVtLmdldEVsZW1lbnRzQnlUYWdOYW1lKCBcInRib2R5XCIgKVsgMCBdIHx8XG5cdFx0XHRlbGVtLmFwcGVuZENoaWxkKCBlbGVtLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJ0Ym9keVwiICkgKSA6XG5cdFx0ZWxlbTtcbn1cblxuLy8gUmVwbGFjZS9yZXN0b3JlIHRoZSB0eXBlIGF0dHJpYnV0ZSBvZiBzY3JpcHQgZWxlbWVudHMgZm9yIHNhZmUgRE9NIG1hbmlwdWxhdGlvblxuZnVuY3Rpb24gZGlzYWJsZVNjcmlwdCggZWxlbSApIHtcblx0ZWxlbS50eXBlID0gKCBlbGVtLmdldEF0dHJpYnV0ZSggXCJ0eXBlXCIgKSAhPT0gbnVsbCApICsgXCIvXCIgKyBlbGVtLnR5cGU7XG5cdHJldHVybiBlbGVtO1xufVxuZnVuY3Rpb24gcmVzdG9yZVNjcmlwdCggZWxlbSApIHtcblx0dmFyIG1hdGNoID0gcnNjcmlwdFR5cGVNYXNrZWQuZXhlYyggZWxlbS50eXBlICk7XG5cblx0aWYgKCBtYXRjaCApIHtcblx0XHRlbGVtLnR5cGUgPSBtYXRjaFsgMSBdO1xuXHR9IGVsc2Uge1xuXHRcdGVsZW0ucmVtb3ZlQXR0cmlidXRlKCBcInR5cGVcIiApO1xuXHR9XG5cblx0cmV0dXJuIGVsZW07XG59XG5cbmZ1bmN0aW9uIGNsb25lQ29weUV2ZW50KCBzcmMsIGRlc3QgKSB7XG5cdHZhciBpLCBsLCB0eXBlLCBwZGF0YU9sZCwgcGRhdGFDdXIsIHVkYXRhT2xkLCB1ZGF0YUN1ciwgZXZlbnRzO1xuXG5cdGlmICggZGVzdC5ub2RlVHlwZSAhPT0gMSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyAxLiBDb3B5IHByaXZhdGUgZGF0YTogZXZlbnRzLCBoYW5kbGVycywgZXRjLlxuXHRpZiAoIGRhdGFQcml2Lmhhc0RhdGEoIHNyYyApICkge1xuXHRcdHBkYXRhT2xkID0gZGF0YVByaXYuYWNjZXNzKCBzcmMgKTtcblx0XHRwZGF0YUN1ciA9IGRhdGFQcml2LnNldCggZGVzdCwgcGRhdGFPbGQgKTtcblx0XHRldmVudHMgPSBwZGF0YU9sZC5ldmVudHM7XG5cblx0XHRpZiAoIGV2ZW50cyApIHtcblx0XHRcdGRlbGV0ZSBwZGF0YUN1ci5oYW5kbGU7XG5cdFx0XHRwZGF0YUN1ci5ldmVudHMgPSB7fTtcblxuXHRcdFx0Zm9yICggdHlwZSBpbiBldmVudHMgKSB7XG5cdFx0XHRcdGZvciAoIGkgPSAwLCBsID0gZXZlbnRzWyB0eXBlIF0ubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHRcdGpRdWVyeS5ldmVudC5hZGQoIGRlc3QsIHR5cGUsIGV2ZW50c1sgdHlwZSBdWyBpIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIDIuIENvcHkgdXNlciBkYXRhXG5cdGlmICggZGF0YVVzZXIuaGFzRGF0YSggc3JjICkgKSB7XG5cdFx0dWRhdGFPbGQgPSBkYXRhVXNlci5hY2Nlc3MoIHNyYyApO1xuXHRcdHVkYXRhQ3VyID0galF1ZXJ5LmV4dGVuZCgge30sIHVkYXRhT2xkICk7XG5cblx0XHRkYXRhVXNlci5zZXQoIGRlc3QsIHVkYXRhQ3VyICk7XG5cdH1cbn1cblxuLy8gRml4IElFIGJ1Z3MsIHNlZSBzdXBwb3J0IHRlc3RzXG5mdW5jdGlvbiBmaXhJbnB1dCggc3JjLCBkZXN0ICkge1xuXHR2YXIgbm9kZU5hbWUgPSBkZXN0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cblx0Ly8gRmFpbHMgdG8gcGVyc2lzdCB0aGUgY2hlY2tlZCBzdGF0ZSBvZiBhIGNsb25lZCBjaGVja2JveCBvciByYWRpbyBidXR0b24uXG5cdGlmICggbm9kZU5hbWUgPT09IFwiaW5wdXRcIiAmJiByY2hlY2thYmxlVHlwZS50ZXN0KCBzcmMudHlwZSApICkge1xuXHRcdGRlc3QuY2hlY2tlZCA9IHNyYy5jaGVja2VkO1xuXG5cdC8vIEZhaWxzIHRvIHJldHVybiB0aGUgc2VsZWN0ZWQgb3B0aW9uIHRvIHRoZSBkZWZhdWx0IHNlbGVjdGVkIHN0YXRlIHdoZW4gY2xvbmluZyBvcHRpb25zXG5cdH0gZWxzZSBpZiAoIG5vZGVOYW1lID09PSBcImlucHV0XCIgfHwgbm9kZU5hbWUgPT09IFwidGV4dGFyZWFcIiApIHtcblx0XHRkZXN0LmRlZmF1bHRWYWx1ZSA9IHNyYy5kZWZhdWx0VmFsdWU7XG5cdH1cbn1cblxuZnVuY3Rpb24gZG9tTWFuaXAoIGNvbGxlY3Rpb24sIGFyZ3MsIGNhbGxiYWNrLCBpZ25vcmVkICkge1xuXG5cdC8vIEZsYXR0ZW4gYW55IG5lc3RlZCBhcnJheXNcblx0YXJncyA9IGNvbmNhdC5hcHBseSggW10sIGFyZ3MgKTtcblxuXHR2YXIgZnJhZ21lbnQsIGZpcnN0LCBzY3JpcHRzLCBoYXNTY3JpcHRzLCBub2RlLCBkb2MsXG5cdFx0aSA9IDAsXG5cdFx0bCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuXHRcdGlOb0Nsb25lID0gbCAtIDEsXG5cdFx0dmFsdWUgPSBhcmdzWyAwIF0sXG5cdFx0aXNGdW5jdGlvbiA9IGpRdWVyeS5pc0Z1bmN0aW9uKCB2YWx1ZSApO1xuXG5cdC8vIFdlIGNhbid0IGNsb25lTm9kZSBmcmFnbWVudHMgdGhhdCBjb250YWluIGNoZWNrZWQsIGluIFdlYktpdFxuXHRpZiAoIGlzRnVuY3Rpb24gfHxcblx0XHRcdCggbCA+IDEgJiYgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmXG5cdFx0XHRcdCFzdXBwb3J0LmNoZWNrQ2xvbmUgJiYgcmNoZWNrZWQudGVzdCggdmFsdWUgKSApICkge1xuXHRcdHJldHVybiBjb2xsZWN0aW9uLmVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcblx0XHRcdHZhciBzZWxmID0gY29sbGVjdGlvbi5lcSggaW5kZXggKTtcblx0XHRcdGlmICggaXNGdW5jdGlvbiApIHtcblx0XHRcdFx0YXJnc1sgMCBdID0gdmFsdWUuY2FsbCggdGhpcywgaW5kZXgsIHNlbGYuaHRtbCgpICk7XG5cdFx0XHR9XG5cdFx0XHRkb21NYW5pcCggc2VsZiwgYXJncywgY2FsbGJhY2ssIGlnbm9yZWQgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpZiAoIGwgKSB7XG5cdFx0ZnJhZ21lbnQgPSBidWlsZEZyYWdtZW50KCBhcmdzLCBjb2xsZWN0aW9uWyAwIF0ub3duZXJEb2N1bWVudCwgZmFsc2UsIGNvbGxlY3Rpb24sIGlnbm9yZWQgKTtcblx0XHRmaXJzdCA9IGZyYWdtZW50LmZpcnN0Q2hpbGQ7XG5cblx0XHRpZiAoIGZyYWdtZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICkge1xuXHRcdFx0ZnJhZ21lbnQgPSBmaXJzdDtcblx0XHR9XG5cblx0XHQvLyBSZXF1aXJlIGVpdGhlciBuZXcgY29udGVudCBvciBhbiBpbnRlcmVzdCBpbiBpZ25vcmVkIGVsZW1lbnRzIHRvIGludm9rZSB0aGUgY2FsbGJhY2tcblx0XHRpZiAoIGZpcnN0IHx8IGlnbm9yZWQgKSB7XG5cdFx0XHRzY3JpcHRzID0galF1ZXJ5Lm1hcCggZ2V0QWxsKCBmcmFnbWVudCwgXCJzY3JpcHRcIiApLCBkaXNhYmxlU2NyaXB0ICk7XG5cdFx0XHRoYXNTY3JpcHRzID0gc2NyaXB0cy5sZW5ndGg7XG5cblx0XHRcdC8vIFVzZSB0aGUgb3JpZ2luYWwgZnJhZ21lbnQgZm9yIHRoZSBsYXN0IGl0ZW1cblx0XHRcdC8vIGluc3RlYWQgb2YgdGhlIGZpcnN0IGJlY2F1c2UgaXQgY2FuIGVuZCB1cFxuXHRcdFx0Ly8gYmVpbmcgZW1wdGllZCBpbmNvcnJlY3RseSBpbiBjZXJ0YWluIHNpdHVhdGlvbnMgKCM4MDcwKS5cblx0XHRcdGZvciAoIDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0bm9kZSA9IGZyYWdtZW50O1xuXG5cdFx0XHRcdGlmICggaSAhPT0gaU5vQ2xvbmUgKSB7XG5cdFx0XHRcdFx0bm9kZSA9IGpRdWVyeS5jbG9uZSggbm9kZSwgdHJ1ZSwgdHJ1ZSApO1xuXG5cdFx0XHRcdFx0Ly8gS2VlcCByZWZlcmVuY2VzIHRvIGNsb25lZCBzY3JpcHRzIGZvciBsYXRlciByZXN0b3JhdGlvblxuXHRcdFx0XHRcdGlmICggaGFzU2NyaXB0cyApIHtcblxuXHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogQW5kcm9pZDw0LjEsIFBoYW50b21KUzwyXG5cdFx0XHRcdFx0XHQvLyBwdXNoLmFwcGx5KF8sIGFycmF5bGlrZSkgdGhyb3dzIG9uIGFuY2llbnQgV2ViS2l0XG5cdFx0XHRcdFx0XHRqUXVlcnkubWVyZ2UoIHNjcmlwdHMsIGdldEFsbCggbm9kZSwgXCJzY3JpcHRcIiApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y2FsbGJhY2suY2FsbCggY29sbGVjdGlvblsgaSBdLCBub2RlLCBpICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggaGFzU2NyaXB0cyApIHtcblx0XHRcdFx0ZG9jID0gc2NyaXB0c1sgc2NyaXB0cy5sZW5ndGggLSAxIF0ub3duZXJEb2N1bWVudDtcblxuXHRcdFx0XHQvLyBSZWVuYWJsZSBzY3JpcHRzXG5cdFx0XHRcdGpRdWVyeS5tYXAoIHNjcmlwdHMsIHJlc3RvcmVTY3JpcHQgKTtcblxuXHRcdFx0XHQvLyBFdmFsdWF0ZSBleGVjdXRhYmxlIHNjcmlwdHMgb24gZmlyc3QgZG9jdW1lbnQgaW5zZXJ0aW9uXG5cdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgaGFzU2NyaXB0czsgaSsrICkge1xuXHRcdFx0XHRcdG5vZGUgPSBzY3JpcHRzWyBpIF07XG5cdFx0XHRcdFx0aWYgKCByc2NyaXB0VHlwZS50ZXN0KCBub2RlLnR5cGUgfHwgXCJcIiApICYmXG5cdFx0XHRcdFx0XHQhZGF0YVByaXYuYWNjZXNzKCBub2RlLCBcImdsb2JhbEV2YWxcIiApICYmXG5cdFx0XHRcdFx0XHRqUXVlcnkuY29udGFpbnMoIGRvYywgbm9kZSApICkge1xuXG5cdFx0XHRcdFx0XHRpZiAoIG5vZGUuc3JjICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIE9wdGlvbmFsIEFKQVggZGVwZW5kZW5jeSwgYnV0IHdvbid0IHJ1biBzY3JpcHRzIGlmIG5vdCBwcmVzZW50XG5cdFx0XHRcdFx0XHRcdGlmICggalF1ZXJ5Ll9ldmFsVXJsICkge1xuXHRcdFx0XHRcdFx0XHRcdGpRdWVyeS5fZXZhbFVybCggbm9kZS5zcmMgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0alF1ZXJ5Lmdsb2JhbEV2YWwoIG5vZGUudGV4dENvbnRlbnQucmVwbGFjZSggcmNsZWFuU2NyaXB0LCBcIlwiICkgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gY29sbGVjdGlvbjtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlKCBlbGVtLCBzZWxlY3Rvciwga2VlcERhdGEgKSB7XG5cdHZhciBub2RlLFxuXHRcdG5vZGVzID0gc2VsZWN0b3IgPyBqUXVlcnkuZmlsdGVyKCBzZWxlY3RvciwgZWxlbSApIDogZWxlbSxcblx0XHRpID0gMDtcblxuXHRmb3IgKCA7ICggbm9kZSA9IG5vZGVzWyBpIF0gKSAhPSBudWxsOyBpKysgKSB7XG5cdFx0aWYgKCAha2VlcERhdGEgJiYgbm9kZS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdGpRdWVyeS5jbGVhbkRhdGEoIGdldEFsbCggbm9kZSApICk7XG5cdFx0fVxuXG5cdFx0aWYgKCBub2RlLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRpZiAoIGtlZXBEYXRhICYmIGpRdWVyeS5jb250YWlucyggbm9kZS5vd25lckRvY3VtZW50LCBub2RlICkgKSB7XG5cdFx0XHRcdHNldEdsb2JhbEV2YWwoIGdldEFsbCggbm9kZSwgXCJzY3JpcHRcIiApICk7XG5cdFx0XHR9XG5cdFx0XHRub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIG5vZGUgKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZWxlbTtcbn1cblxualF1ZXJ5LmV4dGVuZCgge1xuXHRodG1sUHJlZmlsdGVyOiBmdW5jdGlvbiggaHRtbCApIHtcblx0XHRyZXR1cm4gaHRtbC5yZXBsYWNlKCByeGh0bWxUYWcsIFwiPCQxPjwvJDI+XCIgKTtcblx0fSxcblxuXHRjbG9uZTogZnVuY3Rpb24oIGVsZW0sIGRhdGFBbmRFdmVudHMsIGRlZXBEYXRhQW5kRXZlbnRzICkge1xuXHRcdHZhciBpLCBsLCBzcmNFbGVtZW50cywgZGVzdEVsZW1lbnRzLFxuXHRcdFx0Y2xvbmUgPSBlbGVtLmNsb25lTm9kZSggdHJ1ZSApLFxuXHRcdFx0aW5QYWdlID0galF1ZXJ5LmNvbnRhaW5zKCBlbGVtLm93bmVyRG9jdW1lbnQsIGVsZW0gKTtcblxuXHRcdC8vIEZpeCBJRSBjbG9uaW5nIGlzc3Vlc1xuXHRcdGlmICggIXN1cHBvcnQubm9DbG9uZUNoZWNrZWQgJiYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGVsZW0ubm9kZVR5cGUgPT09IDExICkgJiZcblx0XHRcdFx0IWpRdWVyeS5pc1hNTERvYyggZWxlbSApICkge1xuXG5cdFx0XHQvLyBXZSBlc2NoZXcgU2l6emxlIGhlcmUgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnM6IGh0dHA6Ly9qc3BlcmYuY29tL2dldGFsbC12cy1zaXp6bGUvMlxuXHRcdFx0ZGVzdEVsZW1lbnRzID0gZ2V0QWxsKCBjbG9uZSApO1xuXHRcdFx0c3JjRWxlbWVudHMgPSBnZXRBbGwoIGVsZW0gKTtcblxuXHRcdFx0Zm9yICggaSA9IDAsIGwgPSBzcmNFbGVtZW50cy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdGZpeElucHV0KCBzcmNFbGVtZW50c1sgaSBdLCBkZXN0RWxlbWVudHNbIGkgXSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENvcHkgdGhlIGV2ZW50cyBmcm9tIHRoZSBvcmlnaW5hbCB0byB0aGUgY2xvbmVcblx0XHRpZiAoIGRhdGFBbmRFdmVudHMgKSB7XG5cdFx0XHRpZiAoIGRlZXBEYXRhQW5kRXZlbnRzICkge1xuXHRcdFx0XHRzcmNFbGVtZW50cyA9IHNyY0VsZW1lbnRzIHx8IGdldEFsbCggZWxlbSApO1xuXHRcdFx0XHRkZXN0RWxlbWVudHMgPSBkZXN0RWxlbWVudHMgfHwgZ2V0QWxsKCBjbG9uZSApO1xuXG5cdFx0XHRcdGZvciAoIGkgPSAwLCBsID0gc3JjRWxlbWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHRcdGNsb25lQ29weUV2ZW50KCBzcmNFbGVtZW50c1sgaSBdLCBkZXN0RWxlbWVudHNbIGkgXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbG9uZUNvcHlFdmVudCggZWxlbSwgY2xvbmUgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBQcmVzZXJ2ZSBzY3JpcHQgZXZhbHVhdGlvbiBoaXN0b3J5XG5cdFx0ZGVzdEVsZW1lbnRzID0gZ2V0QWxsKCBjbG9uZSwgXCJzY3JpcHRcIiApO1xuXHRcdGlmICggZGVzdEVsZW1lbnRzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRzZXRHbG9iYWxFdmFsKCBkZXN0RWxlbWVudHMsICFpblBhZ2UgJiYgZ2V0QWxsKCBlbGVtLCBcInNjcmlwdFwiICkgKTtcblx0XHR9XG5cblx0XHQvLyBSZXR1cm4gdGhlIGNsb25lZCBzZXRcblx0XHRyZXR1cm4gY2xvbmU7XG5cdH0sXG5cblx0Y2xlYW5EYXRhOiBmdW5jdGlvbiggZWxlbXMgKSB7XG5cdFx0dmFyIGRhdGEsIGVsZW0sIHR5cGUsXG5cdFx0XHRzcGVjaWFsID0galF1ZXJ5LmV2ZW50LnNwZWNpYWwsXG5cdFx0XHRpID0gMDtcblxuXHRcdGZvciAoIDsgKCBlbGVtID0gZWxlbXNbIGkgXSApICE9PSB1bmRlZmluZWQ7IGkrKyApIHtcblx0XHRcdGlmICggYWNjZXB0RGF0YSggZWxlbSApICkge1xuXHRcdFx0XHRpZiAoICggZGF0YSA9IGVsZW1bIGRhdGFQcml2LmV4cGFuZG8gXSApICkge1xuXHRcdFx0XHRcdGlmICggZGF0YS5ldmVudHMgKSB7XG5cdFx0XHRcdFx0XHRmb3IgKCB0eXBlIGluIGRhdGEuZXZlbnRzICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIHNwZWNpYWxbIHR5cGUgXSApIHtcblx0XHRcdFx0XHRcdFx0XHRqUXVlcnkuZXZlbnQucmVtb3ZlKCBlbGVtLCB0eXBlICk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gVGhpcyBpcyBhIHNob3J0Y3V0IHRvIGF2b2lkIGpRdWVyeS5ldmVudC5yZW1vdmUncyBvdmVyaGVhZFxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGpRdWVyeS5yZW1vdmVFdmVudCggZWxlbSwgdHlwZSwgZGF0YS5oYW5kbGUgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFN1cHBvcnQ6IENocm9tZSA8PSAzNS00NStcblx0XHRcdFx0XHQvLyBBc3NpZ24gdW5kZWZpbmVkIGluc3RlYWQgb2YgdXNpbmcgZGVsZXRlLCBzZWUgRGF0YSNyZW1vdmVcblx0XHRcdFx0XHRlbGVtWyBkYXRhUHJpdi5leHBhbmRvIF0gPSB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCBlbGVtWyBkYXRhVXNlci5leHBhbmRvIF0gKSB7XG5cblx0XHRcdFx0XHQvLyBTdXBwb3J0OiBDaHJvbWUgPD0gMzUtNDUrXG5cdFx0XHRcdFx0Ly8gQXNzaWduIHVuZGVmaW5lZCBpbnN0ZWFkIG9mIHVzaW5nIGRlbGV0ZSwgc2VlIERhdGEjcmVtb3ZlXG5cdFx0XHRcdFx0ZWxlbVsgZGF0YVVzZXIuZXhwYW5kbyBdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59ICk7XG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblxuXHQvLyBLZWVwIGRvbU1hbmlwIGV4cG9zZWQgdW50aWwgMy4wIChnaC0yMjI1KVxuXHRkb21NYW5pcDogZG9tTWFuaXAsXG5cblx0ZGV0YWNoOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0cmV0dXJuIHJlbW92ZSggdGhpcywgc2VsZWN0b3IsIHRydWUgKTtcblx0fSxcblxuXHRyZW1vdmU6IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHRyZXR1cm4gcmVtb3ZlKCB0aGlzLCBzZWxlY3RvciApO1xuXHR9LFxuXG5cdHRleHQ6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHRyZXR1cm4gYWNjZXNzKCB0aGlzLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/XG5cdFx0XHRcdGpRdWVyeS50ZXh0KCB0aGlzICkgOlxuXHRcdFx0XHR0aGlzLmVtcHR5KCkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKCB0aGlzLm5vZGVUeXBlID09PSAxIHx8IHRoaXMubm9kZVR5cGUgPT09IDExIHx8IHRoaXMubm9kZVR5cGUgPT09IDkgKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnRleHRDb250ZW50ID0gdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSwgbnVsbCwgdmFsdWUsIGFyZ3VtZW50cy5sZW5ndGggKTtcblx0fSxcblxuXHRhcHBlbmQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBkb21NYW5pcCggdGhpcywgYXJndW1lbnRzLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdGlmICggdGhpcy5ub2RlVHlwZSA9PT0gMSB8fCB0aGlzLm5vZGVUeXBlID09PSAxMSB8fCB0aGlzLm5vZGVUeXBlID09PSA5ICkge1xuXHRcdFx0XHR2YXIgdGFyZ2V0ID0gbWFuaXB1bGF0aW9uVGFyZ2V0KCB0aGlzLCBlbGVtICk7XG5cdFx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZCggZWxlbSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSxcblxuXHRwcmVwZW5kOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZG9tTWFuaXAoIHRoaXMsIGFyZ3VtZW50cywgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRpZiAoIHRoaXMubm9kZVR5cGUgPT09IDEgfHwgdGhpcy5ub2RlVHlwZSA9PT0gMTEgfHwgdGhpcy5ub2RlVHlwZSA9PT0gOSApIHtcblx0XHRcdFx0dmFyIHRhcmdldCA9IG1hbmlwdWxhdGlvblRhcmdldCggdGhpcywgZWxlbSApO1xuXHRcdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKCBlbGVtLCB0YXJnZXQuZmlyc3RDaGlsZCApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSxcblxuXHRiZWZvcmU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBkb21NYW5pcCggdGhpcywgYXJndW1lbnRzLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdGlmICggdGhpcy5wYXJlbnROb2RlICkge1xuXHRcdFx0XHR0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKCBlbGVtLCB0aGlzICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9LFxuXG5cdGFmdGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZG9tTWFuaXAoIHRoaXMsIGFyZ3VtZW50cywgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRpZiAoIHRoaXMucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggZWxlbSwgdGhpcy5uZXh0U2libGluZyApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSxcblxuXHRlbXB0eTogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGVsZW0sXG5cdFx0XHRpID0gMDtcblxuXHRcdGZvciAoIDsgKCBlbGVtID0gdGhpc1sgaSBdICkgIT0gbnVsbDsgaSsrICkge1xuXHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxICkge1xuXG5cdFx0XHRcdC8vIFByZXZlbnQgbWVtb3J5IGxlYWtzXG5cdFx0XHRcdGpRdWVyeS5jbGVhbkRhdGEoIGdldEFsbCggZWxlbSwgZmFsc2UgKSApO1xuXG5cdFx0XHRcdC8vIFJlbW92ZSBhbnkgcmVtYWluaW5nIG5vZGVzXG5cdFx0XHRcdGVsZW0udGV4dENvbnRlbnQgPSBcIlwiO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdGNsb25lOiBmdW5jdGlvbiggZGF0YUFuZEV2ZW50cywgZGVlcERhdGFBbmRFdmVudHMgKSB7XG5cdFx0ZGF0YUFuZEV2ZW50cyA9IGRhdGFBbmRFdmVudHMgPT0gbnVsbCA/IGZhbHNlIDogZGF0YUFuZEV2ZW50cztcblx0XHRkZWVwRGF0YUFuZEV2ZW50cyA9IGRlZXBEYXRhQW5kRXZlbnRzID09IG51bGwgPyBkYXRhQW5kRXZlbnRzIDogZGVlcERhdGFBbmRFdmVudHM7XG5cblx0XHRyZXR1cm4gdGhpcy5tYXAoIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGpRdWVyeS5jbG9uZSggdGhpcywgZGF0YUFuZEV2ZW50cywgZGVlcERhdGFBbmRFdmVudHMgKTtcblx0XHR9ICk7XG5cdH0sXG5cblx0aHRtbDogZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdHJldHVybiBhY2Nlc3MoIHRoaXMsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHRcdHZhciBlbGVtID0gdGhpc1sgMCBdIHx8IHt9LFxuXHRcdFx0XHRpID0gMCxcblx0XHRcdFx0bCA9IHRoaXMubGVuZ3RoO1xuXG5cdFx0XHRpZiAoIHZhbHVlID09PSB1bmRlZmluZWQgJiYgZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0cmV0dXJuIGVsZW0uaW5uZXJIVE1MO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTZWUgaWYgd2UgY2FuIHRha2UgYSBzaG9ydGN1dCBhbmQganVzdCB1c2UgaW5uZXJIVE1MXG5cdFx0XHRpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiAhcm5vSW5uZXJodG1sLnRlc3QoIHZhbHVlICkgJiZcblx0XHRcdFx0IXdyYXBNYXBbICggcnRhZ05hbWUuZXhlYyggdmFsdWUgKSB8fCBbIFwiXCIsIFwiXCIgXSApWyAxIF0udG9Mb3dlckNhc2UoKSBdICkge1xuXG5cdFx0XHRcdHZhbHVlID0galF1ZXJ5Lmh0bWxQcmVmaWx0ZXIoIHZhbHVlICk7XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRmb3IgKCA7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdFx0XHRlbGVtID0gdGhpc1sgaSBdIHx8IHt9O1xuXG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgZWxlbWVudCBub2RlcyBhbmQgcHJldmVudCBtZW1vcnkgbGVha3Ncblx0XHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0XHRcdFx0alF1ZXJ5LmNsZWFuRGF0YSggZ2V0QWxsKCBlbGVtLCBmYWxzZSApICk7XG5cdFx0XHRcdFx0XHRcdGVsZW0uaW5uZXJIVE1MID0gdmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZWxlbSA9IDA7XG5cblx0XHRcdFx0Ly8gSWYgdXNpbmcgaW5uZXJIVE1MIHRocm93cyBhbiBleGNlcHRpb24sIHVzZSB0aGUgZmFsbGJhY2sgbWV0aG9kXG5cdFx0XHRcdH0gY2F0Y2ggKCBlICkge31cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBlbGVtICkge1xuXHRcdFx0XHR0aGlzLmVtcHR5KCkuYXBwZW5kKCB2YWx1ZSApO1xuXHRcdFx0fVxuXHRcdH0sIG51bGwsIHZhbHVlLCBhcmd1bWVudHMubGVuZ3RoICk7XG5cdH0sXG5cblx0cmVwbGFjZVdpdGg6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpZ25vcmVkID0gW107XG5cblx0XHQvLyBNYWtlIHRoZSBjaGFuZ2VzLCByZXBsYWNpbmcgZWFjaCBub24taWdub3JlZCBjb250ZXh0IGVsZW1lbnQgd2l0aCB0aGUgbmV3IGNvbnRlbnRcblx0XHRyZXR1cm4gZG9tTWFuaXAoIHRoaXMsIGFyZ3VtZW50cywgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuXG5cdFx0XHRpZiAoIGpRdWVyeS5pbkFycmF5KCB0aGlzLCBpZ25vcmVkICkgPCAwICkge1xuXHRcdFx0XHRqUXVlcnkuY2xlYW5EYXRhKCBnZXRBbGwoIHRoaXMgKSApO1xuXHRcdFx0XHRpZiAoIHBhcmVudCApIHtcblx0XHRcdFx0XHRwYXJlbnQucmVwbGFjZUNoaWxkKCBlbGVtLCB0aGlzICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdC8vIEZvcmNlIGNhbGxiYWNrIGludm9jYXRpb25cblx0XHR9LCBpZ25vcmVkICk7XG5cdH1cbn0gKTtcblxualF1ZXJ5LmVhY2goIHtcblx0YXBwZW5kVG86IFwiYXBwZW5kXCIsXG5cdHByZXBlbmRUbzogXCJwcmVwZW5kXCIsXG5cdGluc2VydEJlZm9yZTogXCJiZWZvcmVcIixcblx0aW5zZXJ0QWZ0ZXI6IFwiYWZ0ZXJcIixcblx0cmVwbGFjZUFsbDogXCJyZXBsYWNlV2l0aFwiXG59LCBmdW5jdGlvbiggbmFtZSwgb3JpZ2luYWwgKSB7XG5cdGpRdWVyeS5mblsgbmFtZSBdID0gZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHZhciBlbGVtcyxcblx0XHRcdHJldCA9IFtdLFxuXHRcdFx0aW5zZXJ0ID0galF1ZXJ5KCBzZWxlY3RvciApLFxuXHRcdFx0bGFzdCA9IGluc2VydC5sZW5ndGggLSAxLFxuXHRcdFx0aSA9IDA7XG5cblx0XHRmb3IgKCA7IGkgPD0gbGFzdDsgaSsrICkge1xuXHRcdFx0ZWxlbXMgPSBpID09PSBsYXN0ID8gdGhpcyA6IHRoaXMuY2xvbmUoIHRydWUgKTtcblx0XHRcdGpRdWVyeSggaW5zZXJ0WyBpIF0gKVsgb3JpZ2luYWwgXSggZWxlbXMgKTtcblxuXHRcdFx0Ly8gU3VwcG9ydDogUXRXZWJLaXRcblx0XHRcdC8vIC5nZXQoKSBiZWNhdXNlIHB1c2guYXBwbHkoXywgYXJyYXlsaWtlKSB0aHJvd3Ncblx0XHRcdHB1c2guYXBwbHkoIHJldCwgZWxlbXMuZ2V0KCkgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIHJldCApO1xuXHR9O1xufSApO1xuXG5yZXR1cm4galF1ZXJ5O1xufSApO1xuIl19