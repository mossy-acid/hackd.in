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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9tYW5pcHVsYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1AsUUFETyxFQUVQLGNBRk8sRUFHUCxZQUhPLEVBSVAsZUFKTyxFQUtQLG1DQUxPLEVBTVAsNkJBTk8sRUFPUCxnQ0FQTyxFQVFQLHdCQVJPLEVBU1AsdUJBVE8sRUFVUCw4QkFWTyxFQVdQLDhCQVhPLEVBWVAsd0JBWk8sRUFjUCxxQkFkTyxFQWVQLHFCQWZPLEVBZ0JQLHVCQWhCTyxFQWtCUCxhQWxCTyxFQW1CUCxjQW5CTyxFQW9CUCxZQXBCTyxFQXFCUCxTQXJCTyxDQUFSLEVBc0JHLFVBQVUsTUFBVixFQUFrQixNQUFsQixFQUEwQixJQUExQixFQUFnQyxNQUFoQyxFQUNGLGNBREUsRUFDYyxRQURkLEVBQ3dCLFdBRHhCLEVBRUYsT0FGRSxFQUVPLE1BRlAsRUFFZSxhQUZmLEVBRThCLGFBRjlCLEVBRTZDLE9BRjdDLEVBR0YsUUFIRSxFQUdRLFFBSFIsRUFHa0IsVUFIbEIsRUFHK0I7O0FBRWxDLEtBQ0MsWUFBWSwwRUFEYjs7Ozs7O0FBTUMsZ0JBQWUsdUJBTmhCOzs7O0FBU0MsWUFBVyxtQ0FUWjtLQVVDLG9CQUFvQixhQVZyQjtLQVdDLGVBQWUsMENBWGhCOzs7QUFjQSxVQUFTLGtCQUFULENBQTZCLElBQTdCLEVBQW1DLE9BQW5DLEVBQTZDO0FBQzVDLFNBQU8sT0FBTyxRQUFQLENBQWlCLElBQWpCLEVBQXVCLE9BQXZCLEtBQ04sT0FBTyxRQUFQLENBQWlCLFFBQVEsUUFBUixLQUFxQixFQUFyQixHQUEwQixPQUExQixHQUFvQyxRQUFRLFVBQTdELEVBQXlFLElBQXpFLENBRE0sR0FHTixLQUFLLG9CQUFMLENBQTJCLE9BQTNCLEVBQXNDLENBQXRDLEtBQ0MsS0FBSyxXQUFMLENBQWtCLEtBQUssYUFBTCxDQUFtQixhQUFuQixDQUFrQyxPQUFsQyxDQUFsQixDQUpLLEdBS04s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QUFxQjtBQUN4QyxPQUFJLEtBQUo7T0FDQyxNQUFNLEVBRFA7T0FFQyxTQUFTLE9BQVEsUUFBUixDQUZWO09BR0MsT0FBTyxPQUFPLE1BQVAsR0FBZ0IsQ0FIeEI7T0FJQyxJQUFJLENBSkw7O0FBTUEsVUFBUSxLQUFLLElBQWIsRUFBbUIsR0FBbkIsRUFBeUI7QUFDeEIsWUFBUSxNQUFNLElBQU4sR0FBYSxJQUFiLEdBQW9CLEtBQUssS0FBTCxDQUFZLElBQVosQ0FBNUI7QUFDQSxXQUFRLE9BQVEsQ0FBUixDQUFSLEVBQXVCLFFBQXZCLEVBQW1DLEtBQW5DOzs7O0FBSUEsU0FBSyxLQUFMLENBQVksR0FBWixFQUFpQixNQUFNLEdBQU4sRUFBakI7QUFDQTs7QUFFRCxVQUFPLEtBQUssU0FBTCxDQUFnQixHQUFoQixDQUFQO0FBQ0EsR0FqQkQ7QUFrQkEsRUF6QkQ7O0FBMkJBLFFBQU8sTUFBUDtBQUNDLENBaGVEIiwiZmlsZSI6Im1hbmlwdWxhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4vY29yZVwiLFxuXHRcIi4vdmFyL2NvbmNhdFwiLFxuXHRcIi4vdmFyL3B1c2hcIixcblx0XCIuL2NvcmUvYWNjZXNzXCIsXG5cdFwiLi9tYW5pcHVsYXRpb24vdmFyL3JjaGVja2FibGVUeXBlXCIsXG5cdFwiLi9tYW5pcHVsYXRpb24vdmFyL3J0YWdOYW1lXCIsXG5cdFwiLi9tYW5pcHVsYXRpb24vdmFyL3JzY3JpcHRUeXBlXCIsXG5cdFwiLi9tYW5pcHVsYXRpb24vd3JhcE1hcFwiLFxuXHRcIi4vbWFuaXB1bGF0aW9uL2dldEFsbFwiLFxuXHRcIi4vbWFuaXB1bGF0aW9uL3NldEdsb2JhbEV2YWxcIixcblx0XCIuL21hbmlwdWxhdGlvbi9idWlsZEZyYWdtZW50XCIsXG5cdFwiLi9tYW5pcHVsYXRpb24vc3VwcG9ydFwiLFxuXG5cdFwiLi9kYXRhL3Zhci9kYXRhUHJpdlwiLFxuXHRcIi4vZGF0YS92YXIvZGF0YVVzZXJcIixcblx0XCIuL2RhdGEvdmFyL2FjY2VwdERhdGFcIixcblxuXHRcIi4vY29yZS9pbml0XCIsXG5cdFwiLi90cmF2ZXJzaW5nXCIsXG5cdFwiLi9zZWxlY3RvclwiLFxuXHRcIi4vZXZlbnRcIlxuXSwgZnVuY3Rpb24oIGpRdWVyeSwgY29uY2F0LCBwdXNoLCBhY2Nlc3MsXG5cdHJjaGVja2FibGVUeXBlLCBydGFnTmFtZSwgcnNjcmlwdFR5cGUsXG5cdHdyYXBNYXAsIGdldEFsbCwgc2V0R2xvYmFsRXZhbCwgYnVpbGRGcmFnbWVudCwgc3VwcG9ydCxcblx0ZGF0YVByaXYsIGRhdGFVc2VyLCBhY2NlcHREYXRhICkge1xuXG52YXJcblx0cnhodG1sVGFnID0gLzwoPyFhcmVhfGJyfGNvbHxlbWJlZHxocnxpbWd8aW5wdXR8bGlua3xtZXRhfHBhcmFtKSgoW1xcdzotXSspW14+XSopXFwvPi9naSxcblxuXHQvLyBTdXBwb3J0OiBJRSAxMC0xMSwgRWRnZSAxMDI0MCtcblx0Ly8gSW4gSUUvRWRnZSB1c2luZyByZWdleCBncm91cHMgaGVyZSBjYXVzZXMgc2V2ZXJlIHNsb3dkb3ducy5cblx0Ly8gU2VlIGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvMTczNjUxMi9cblx0cm5vSW5uZXJodG1sID0gLzxzY3JpcHR8PHN0eWxlfDxsaW5rL2ksXG5cblx0Ly8gY2hlY2tlZD1cImNoZWNrZWRcIiBvciBjaGVja2VkXG5cdHJjaGVja2VkID0gL2NoZWNrZWRcXHMqKD86W149XXw9XFxzKi5jaGVja2VkLikvaSxcblx0cnNjcmlwdFR5cGVNYXNrZWQgPSAvXnRydWVcXC8oLiopLyxcblx0cmNsZWFuU2NyaXB0ID0gL15cXHMqPCEoPzpcXFtDREFUQVxcW3wtLSl8KD86XFxdXFxdfC0tKT5cXHMqJC9nO1xuXG4vLyBNYW5pcHVsYXRpbmcgdGFibGVzIHJlcXVpcmVzIGEgdGJvZHlcbmZ1bmN0aW9uIG1hbmlwdWxhdGlvblRhcmdldCggZWxlbSwgY29udGVudCApIHtcblx0cmV0dXJuIGpRdWVyeS5ub2RlTmFtZSggZWxlbSwgXCJ0YWJsZVwiICkgJiZcblx0XHRqUXVlcnkubm9kZU5hbWUoIGNvbnRlbnQubm9kZVR5cGUgIT09IDExID8gY29udGVudCA6IGNvbnRlbnQuZmlyc3RDaGlsZCwgXCJ0clwiICkgP1xuXG5cdFx0ZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZSggXCJ0Ym9keVwiIClbIDAgXSB8fFxuXHRcdFx0ZWxlbS5hcHBlbmRDaGlsZCggZWxlbS5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwidGJvZHlcIiApICkgOlxuXHRcdGVsZW07XG59XG5cbi8vIFJlcGxhY2UvcmVzdG9yZSB0aGUgdHlwZSBhdHRyaWJ1dGUgb2Ygc2NyaXB0IGVsZW1lbnRzIGZvciBzYWZlIERPTSBtYW5pcHVsYXRpb25cbmZ1bmN0aW9uIGRpc2FibGVTY3JpcHQoIGVsZW0gKSB7XG5cdGVsZW0udHlwZSA9ICggZWxlbS5nZXRBdHRyaWJ1dGUoIFwidHlwZVwiICkgIT09IG51bGwgKSArIFwiL1wiICsgZWxlbS50eXBlO1xuXHRyZXR1cm4gZWxlbTtcbn1cbmZ1bmN0aW9uIHJlc3RvcmVTY3JpcHQoIGVsZW0gKSB7XG5cdHZhciBtYXRjaCA9IHJzY3JpcHRUeXBlTWFza2VkLmV4ZWMoIGVsZW0udHlwZSApO1xuXG5cdGlmICggbWF0Y2ggKSB7XG5cdFx0ZWxlbS50eXBlID0gbWF0Y2hbIDEgXTtcblx0fSBlbHNlIHtcblx0XHRlbGVtLnJlbW92ZUF0dHJpYnV0ZSggXCJ0eXBlXCIgKTtcblx0fVxuXG5cdHJldHVybiBlbGVtO1xufVxuXG5mdW5jdGlvbiBjbG9uZUNvcHlFdmVudCggc3JjLCBkZXN0ICkge1xuXHR2YXIgaSwgbCwgdHlwZSwgcGRhdGFPbGQsIHBkYXRhQ3VyLCB1ZGF0YU9sZCwgdWRhdGFDdXIsIGV2ZW50cztcblxuXHRpZiAoIGRlc3Qubm9kZVR5cGUgIT09IDEgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gMS4gQ29weSBwcml2YXRlIGRhdGE6IGV2ZW50cywgaGFuZGxlcnMsIGV0Yy5cblx0aWYgKCBkYXRhUHJpdi5oYXNEYXRhKCBzcmMgKSApIHtcblx0XHRwZGF0YU9sZCA9IGRhdGFQcml2LmFjY2Vzcyggc3JjICk7XG5cdFx0cGRhdGFDdXIgPSBkYXRhUHJpdi5zZXQoIGRlc3QsIHBkYXRhT2xkICk7XG5cdFx0ZXZlbnRzID0gcGRhdGFPbGQuZXZlbnRzO1xuXG5cdFx0aWYgKCBldmVudHMgKSB7XG5cdFx0XHRkZWxldGUgcGRhdGFDdXIuaGFuZGxlO1xuXHRcdFx0cGRhdGFDdXIuZXZlbnRzID0ge307XG5cblx0XHRcdGZvciAoIHR5cGUgaW4gZXZlbnRzICkge1xuXHRcdFx0XHRmb3IgKCBpID0gMCwgbCA9IGV2ZW50c1sgdHlwZSBdLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQuYWRkKCBkZXN0LCB0eXBlLCBldmVudHNbIHR5cGUgXVsgaSBdICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyAyLiBDb3B5IHVzZXIgZGF0YVxuXHRpZiAoIGRhdGFVc2VyLmhhc0RhdGEoIHNyYyApICkge1xuXHRcdHVkYXRhT2xkID0gZGF0YVVzZXIuYWNjZXNzKCBzcmMgKTtcblx0XHR1ZGF0YUN1ciA9IGpRdWVyeS5leHRlbmQoIHt9LCB1ZGF0YU9sZCApO1xuXG5cdFx0ZGF0YVVzZXIuc2V0KCBkZXN0LCB1ZGF0YUN1ciApO1xuXHR9XG59XG5cbi8vIEZpeCBJRSBidWdzLCBzZWUgc3VwcG9ydCB0ZXN0c1xuZnVuY3Rpb24gZml4SW5wdXQoIHNyYywgZGVzdCApIHtcblx0dmFyIG5vZGVOYW1lID0gZGVzdC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG5cdC8vIEZhaWxzIHRvIHBlcnNpc3QgdGhlIGNoZWNrZWQgc3RhdGUgb2YgYSBjbG9uZWQgY2hlY2tib3ggb3IgcmFkaW8gYnV0dG9uLlxuXHRpZiAoIG5vZGVOYW1lID09PSBcImlucHV0XCIgJiYgcmNoZWNrYWJsZVR5cGUudGVzdCggc3JjLnR5cGUgKSApIHtcblx0XHRkZXN0LmNoZWNrZWQgPSBzcmMuY2hlY2tlZDtcblxuXHQvLyBGYWlscyB0byByZXR1cm4gdGhlIHNlbGVjdGVkIG9wdGlvbiB0byB0aGUgZGVmYXVsdCBzZWxlY3RlZCBzdGF0ZSB3aGVuIGNsb25pbmcgb3B0aW9uc1xuXHR9IGVsc2UgaWYgKCBub2RlTmFtZSA9PT0gXCJpbnB1dFwiIHx8IG5vZGVOYW1lID09PSBcInRleHRhcmVhXCIgKSB7XG5cdFx0ZGVzdC5kZWZhdWx0VmFsdWUgPSBzcmMuZGVmYXVsdFZhbHVlO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGRvbU1hbmlwKCBjb2xsZWN0aW9uLCBhcmdzLCBjYWxsYmFjaywgaWdub3JlZCApIHtcblxuXHQvLyBGbGF0dGVuIGFueSBuZXN0ZWQgYXJyYXlzXG5cdGFyZ3MgPSBjb25jYXQuYXBwbHkoIFtdLCBhcmdzICk7XG5cblx0dmFyIGZyYWdtZW50LCBmaXJzdCwgc2NyaXB0cywgaGFzU2NyaXB0cywgbm9kZSwgZG9jLFxuXHRcdGkgPSAwLFxuXHRcdGwgPSBjb2xsZWN0aW9uLmxlbmd0aCxcblx0XHRpTm9DbG9uZSA9IGwgLSAxLFxuXHRcdHZhbHVlID0gYXJnc1sgMCBdLFxuXHRcdGlzRnVuY3Rpb24gPSBqUXVlcnkuaXNGdW5jdGlvbiggdmFsdWUgKTtcblxuXHQvLyBXZSBjYW4ndCBjbG9uZU5vZGUgZnJhZ21lbnRzIHRoYXQgY29udGFpbiBjaGVja2VkLCBpbiBXZWJLaXRcblx0aWYgKCBpc0Z1bmN0aW9uIHx8XG5cdFx0XHQoIGwgPiAxICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJlxuXHRcdFx0XHQhc3VwcG9ydC5jaGVja0Nsb25lICYmIHJjaGVja2VkLnRlc3QoIHZhbHVlICkgKSApIHtcblx0XHRyZXR1cm4gY29sbGVjdGlvbi5lYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG5cdFx0XHR2YXIgc2VsZiA9IGNvbGxlY3Rpb24uZXEoIGluZGV4ICk7XG5cdFx0XHRpZiAoIGlzRnVuY3Rpb24gKSB7XG5cdFx0XHRcdGFyZ3NbIDAgXSA9IHZhbHVlLmNhbGwoIHRoaXMsIGluZGV4LCBzZWxmLmh0bWwoKSApO1xuXHRcdFx0fVxuXHRcdFx0ZG9tTWFuaXAoIHNlbGYsIGFyZ3MsIGNhbGxiYWNrLCBpZ25vcmVkICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aWYgKCBsICkge1xuXHRcdGZyYWdtZW50ID0gYnVpbGRGcmFnbWVudCggYXJncywgY29sbGVjdGlvblsgMCBdLm93bmVyRG9jdW1lbnQsIGZhbHNlLCBjb2xsZWN0aW9uLCBpZ25vcmVkICk7XG5cdFx0Zmlyc3QgPSBmcmFnbWVudC5maXJzdENoaWxkO1xuXG5cdFx0aWYgKCBmcmFnbWVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSApIHtcblx0XHRcdGZyYWdtZW50ID0gZmlyc3Q7XG5cdFx0fVxuXG5cdFx0Ly8gUmVxdWlyZSBlaXRoZXIgbmV3IGNvbnRlbnQgb3IgYW4gaW50ZXJlc3QgaW4gaWdub3JlZCBlbGVtZW50cyB0byBpbnZva2UgdGhlIGNhbGxiYWNrXG5cdFx0aWYgKCBmaXJzdCB8fCBpZ25vcmVkICkge1xuXHRcdFx0c2NyaXB0cyA9IGpRdWVyeS5tYXAoIGdldEFsbCggZnJhZ21lbnQsIFwic2NyaXB0XCIgKSwgZGlzYWJsZVNjcmlwdCApO1xuXHRcdFx0aGFzU2NyaXB0cyA9IHNjcmlwdHMubGVuZ3RoO1xuXG5cdFx0XHQvLyBVc2UgdGhlIG9yaWdpbmFsIGZyYWdtZW50IGZvciB0aGUgbGFzdCBpdGVtXG5cdFx0XHQvLyBpbnN0ZWFkIG9mIHRoZSBmaXJzdCBiZWNhdXNlIGl0IGNhbiBlbmQgdXBcblx0XHRcdC8vIGJlaW5nIGVtcHRpZWQgaW5jb3JyZWN0bHkgaW4gY2VydGFpbiBzaXR1YXRpb25zICgjODA3MCkuXG5cdFx0XHRmb3IgKCA7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdG5vZGUgPSBmcmFnbWVudDtcblxuXHRcdFx0XHRpZiAoIGkgIT09IGlOb0Nsb25lICkge1xuXHRcdFx0XHRcdG5vZGUgPSBqUXVlcnkuY2xvbmUoIG5vZGUsIHRydWUsIHRydWUgKTtcblxuXHRcdFx0XHRcdC8vIEtlZXAgcmVmZXJlbmNlcyB0byBjbG9uZWQgc2NyaXB0cyBmb3IgbGF0ZXIgcmVzdG9yYXRpb25cblx0XHRcdFx0XHRpZiAoIGhhc1NjcmlwdHMgKSB7XG5cblx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IEFuZHJvaWQ8NC4xLCBQaGFudG9tSlM8MlxuXHRcdFx0XHRcdFx0Ly8gcHVzaC5hcHBseShfLCBhcnJheWxpa2UpIHRocm93cyBvbiBhbmNpZW50IFdlYktpdFxuXHRcdFx0XHRcdFx0alF1ZXJ5Lm1lcmdlKCBzY3JpcHRzLCBnZXRBbGwoIG5vZGUsIFwic2NyaXB0XCIgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNhbGxiYWNrLmNhbGwoIGNvbGxlY3Rpb25bIGkgXSwgbm9kZSwgaSApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGhhc1NjcmlwdHMgKSB7XG5cdFx0XHRcdGRvYyA9IHNjcmlwdHNbIHNjcmlwdHMubGVuZ3RoIC0gMSBdLm93bmVyRG9jdW1lbnQ7XG5cblx0XHRcdFx0Ly8gUmVlbmFibGUgc2NyaXB0c1xuXHRcdFx0XHRqUXVlcnkubWFwKCBzY3JpcHRzLCByZXN0b3JlU2NyaXB0ICk7XG5cblx0XHRcdFx0Ly8gRXZhbHVhdGUgZXhlY3V0YWJsZSBzY3JpcHRzIG9uIGZpcnN0IGRvY3VtZW50IGluc2VydGlvblxuXHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IGhhc1NjcmlwdHM7IGkrKyApIHtcblx0XHRcdFx0XHRub2RlID0gc2NyaXB0c1sgaSBdO1xuXHRcdFx0XHRcdGlmICggcnNjcmlwdFR5cGUudGVzdCggbm9kZS50eXBlIHx8IFwiXCIgKSAmJlxuXHRcdFx0XHRcdFx0IWRhdGFQcml2LmFjY2Vzcyggbm9kZSwgXCJnbG9iYWxFdmFsXCIgKSAmJlxuXHRcdFx0XHRcdFx0alF1ZXJ5LmNvbnRhaW5zKCBkb2MsIG5vZGUgKSApIHtcblxuXHRcdFx0XHRcdFx0aWYgKCBub2RlLnNyYyApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBPcHRpb25hbCBBSkFYIGRlcGVuZGVuY3ksIGJ1dCB3b24ndCBydW4gc2NyaXB0cyBpZiBub3QgcHJlc2VudFxuXHRcdFx0XHRcdFx0XHRpZiAoIGpRdWVyeS5fZXZhbFVybCApIHtcblx0XHRcdFx0XHRcdFx0XHRqUXVlcnkuX2V2YWxVcmwoIG5vZGUuc3JjICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGpRdWVyeS5nbG9iYWxFdmFsKCBub2RlLnRleHRDb250ZW50LnJlcGxhY2UoIHJjbGVhblNjcmlwdCwgXCJcIiApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGNvbGxlY3Rpb247XG59XG5cbmZ1bmN0aW9uIHJlbW92ZSggZWxlbSwgc2VsZWN0b3IsIGtlZXBEYXRhICkge1xuXHR2YXIgbm9kZSxcblx0XHRub2RlcyA9IHNlbGVjdG9yID8galF1ZXJ5LmZpbHRlciggc2VsZWN0b3IsIGVsZW0gKSA6IGVsZW0sXG5cdFx0aSA9IDA7XG5cblx0Zm9yICggOyAoIG5vZGUgPSBub2Rlc1sgaSBdICkgIT0gbnVsbDsgaSsrICkge1xuXHRcdGlmICggIWtlZXBEYXRhICYmIG5vZGUubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRqUXVlcnkuY2xlYW5EYXRhKCBnZXRBbGwoIG5vZGUgKSApO1xuXHRcdH1cblxuXHRcdGlmICggbm9kZS5wYXJlbnROb2RlICkge1xuXHRcdFx0aWYgKCBrZWVwRGF0YSAmJiBqUXVlcnkuY29udGFpbnMoIG5vZGUub3duZXJEb2N1bWVudCwgbm9kZSApICkge1xuXHRcdFx0XHRzZXRHbG9iYWxFdmFsKCBnZXRBbGwoIG5vZGUsIFwic2NyaXB0XCIgKSApO1xuXHRcdFx0fVxuXHRcdFx0bm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBub2RlICk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGVsZW07XG59XG5cbmpRdWVyeS5leHRlbmQoIHtcblx0aHRtbFByZWZpbHRlcjogZnVuY3Rpb24oIGh0bWwgKSB7XG5cdFx0cmV0dXJuIGh0bWwucmVwbGFjZSggcnhodG1sVGFnLCBcIjwkMT48LyQyPlwiICk7XG5cdH0sXG5cblx0Y2xvbmU6IGZ1bmN0aW9uKCBlbGVtLCBkYXRhQW5kRXZlbnRzLCBkZWVwRGF0YUFuZEV2ZW50cyApIHtcblx0XHR2YXIgaSwgbCwgc3JjRWxlbWVudHMsIGRlc3RFbGVtZW50cyxcblx0XHRcdGNsb25lID0gZWxlbS5jbG9uZU5vZGUoIHRydWUgKSxcblx0XHRcdGluUGFnZSA9IGpRdWVyeS5jb250YWlucyggZWxlbS5vd25lckRvY3VtZW50LCBlbGVtICk7XG5cblx0XHQvLyBGaXggSUUgY2xvbmluZyBpc3N1ZXNcblx0XHRpZiAoICFzdXBwb3J0Lm5vQ2xvbmVDaGVja2VkICYmICggZWxlbS5ub2RlVHlwZSA9PT0gMSB8fCBlbGVtLm5vZGVUeXBlID09PSAxMSApICYmXG5cdFx0XHRcdCFqUXVlcnkuaXNYTUxEb2MoIGVsZW0gKSApIHtcblxuXHRcdFx0Ly8gV2UgZXNjaGV3IFNpenpsZSBoZXJlIGZvciBwZXJmb3JtYW5jZSByZWFzb25zOiBodHRwOi8vanNwZXJmLmNvbS9nZXRhbGwtdnMtc2l6emxlLzJcblx0XHRcdGRlc3RFbGVtZW50cyA9IGdldEFsbCggY2xvbmUgKTtcblx0XHRcdHNyY0VsZW1lbnRzID0gZ2V0QWxsKCBlbGVtICk7XG5cblx0XHRcdGZvciAoIGkgPSAwLCBsID0gc3JjRWxlbWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHRmaXhJbnB1dCggc3JjRWxlbWVudHNbIGkgXSwgZGVzdEVsZW1lbnRzWyBpIF0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDb3B5IHRoZSBldmVudHMgZnJvbSB0aGUgb3JpZ2luYWwgdG8gdGhlIGNsb25lXG5cdFx0aWYgKCBkYXRhQW5kRXZlbnRzICkge1xuXHRcdFx0aWYgKCBkZWVwRGF0YUFuZEV2ZW50cyApIHtcblx0XHRcdFx0c3JjRWxlbWVudHMgPSBzcmNFbGVtZW50cyB8fCBnZXRBbGwoIGVsZW0gKTtcblx0XHRcdFx0ZGVzdEVsZW1lbnRzID0gZGVzdEVsZW1lbnRzIHx8IGdldEFsbCggY2xvbmUgKTtcblxuXHRcdFx0XHRmb3IgKCBpID0gMCwgbCA9IHNyY0VsZW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0XHRjbG9uZUNvcHlFdmVudCggc3JjRWxlbWVudHNbIGkgXSwgZGVzdEVsZW1lbnRzWyBpIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2xvbmVDb3B5RXZlbnQoIGVsZW0sIGNsb25lICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gUHJlc2VydmUgc2NyaXB0IGV2YWx1YXRpb24gaGlzdG9yeVxuXHRcdGRlc3RFbGVtZW50cyA9IGdldEFsbCggY2xvbmUsIFwic2NyaXB0XCIgKTtcblx0XHRpZiAoIGRlc3RFbGVtZW50cy5sZW5ndGggPiAwICkge1xuXHRcdFx0c2V0R2xvYmFsRXZhbCggZGVzdEVsZW1lbnRzLCAhaW5QYWdlICYmIGdldEFsbCggZWxlbSwgXCJzY3JpcHRcIiApICk7XG5cdFx0fVxuXG5cdFx0Ly8gUmV0dXJuIHRoZSBjbG9uZWQgc2V0XG5cdFx0cmV0dXJuIGNsb25lO1xuXHR9LFxuXG5cdGNsZWFuRGF0YTogZnVuY3Rpb24oIGVsZW1zICkge1xuXHRcdHZhciBkYXRhLCBlbGVtLCB0eXBlLFxuXHRcdFx0c3BlY2lhbCA9IGpRdWVyeS5ldmVudC5zcGVjaWFsLFxuXHRcdFx0aSA9IDA7XG5cblx0XHRmb3IgKCA7ICggZWxlbSA9IGVsZW1zWyBpIF0gKSAhPT0gdW5kZWZpbmVkOyBpKysgKSB7XG5cdFx0XHRpZiAoIGFjY2VwdERhdGEoIGVsZW0gKSApIHtcblx0XHRcdFx0aWYgKCAoIGRhdGEgPSBlbGVtWyBkYXRhUHJpdi5leHBhbmRvIF0gKSApIHtcblx0XHRcdFx0XHRpZiAoIGRhdGEuZXZlbnRzICkge1xuXHRcdFx0XHRcdFx0Zm9yICggdHlwZSBpbiBkYXRhLmV2ZW50cyApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBzcGVjaWFsWyB0eXBlIF0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnJlbW92ZSggZWxlbSwgdHlwZSApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFRoaXMgaXMgYSBzaG9ydGN1dCB0byBhdm9pZCBqUXVlcnkuZXZlbnQucmVtb3ZlJ3Mgb3ZlcmhlYWRcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRqUXVlcnkucmVtb3ZlRXZlbnQoIGVsZW0sIHR5cGUsIGRhdGEuaGFuZGxlICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBTdXBwb3J0OiBDaHJvbWUgPD0gMzUtNDUrXG5cdFx0XHRcdFx0Ly8gQXNzaWduIHVuZGVmaW5lZCBpbnN0ZWFkIG9mIHVzaW5nIGRlbGV0ZSwgc2VlIERhdGEjcmVtb3ZlXG5cdFx0XHRcdFx0ZWxlbVsgZGF0YVByaXYuZXhwYW5kbyBdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICggZWxlbVsgZGF0YVVzZXIuZXhwYW5kbyBdICkge1xuXG5cdFx0XHRcdFx0Ly8gU3VwcG9ydDogQ2hyb21lIDw9IDM1LTQ1K1xuXHRcdFx0XHRcdC8vIEFzc2lnbiB1bmRlZmluZWQgaW5zdGVhZCBvZiB1c2luZyBkZWxldGUsIHNlZSBEYXRhI3JlbW92ZVxuXHRcdFx0XHRcdGVsZW1bIGRhdGFVc2VyLmV4cGFuZG8gXSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufSApO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKCB7XG5cblx0Ly8gS2VlcCBkb21NYW5pcCBleHBvc2VkIHVudGlsIDMuMCAoZ2gtMjIyNSlcblx0ZG9tTWFuaXA6IGRvbU1hbmlwLFxuXG5cdGRldGFjaDogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHJldHVybiByZW1vdmUoIHRoaXMsIHNlbGVjdG9yLCB0cnVlICk7XG5cdH0sXG5cblx0cmVtb3ZlOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0cmV0dXJuIHJlbW92ZSggdGhpcywgc2VsZWN0b3IgKTtcblx0fSxcblxuXHR0ZXh0OiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0cmV0dXJuIGFjY2VzcyggdGhpcywgZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdFx0cmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgP1xuXHRcdFx0XHRqUXVlcnkudGV4dCggdGhpcyApIDpcblx0XHRcdFx0dGhpcy5lbXB0eSgpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICggdGhpcy5ub2RlVHlwZSA9PT0gMSB8fCB0aGlzLm5vZGVUeXBlID09PSAxMSB8fCB0aGlzLm5vZGVUeXBlID09PSA5ICkge1xuXHRcdFx0XHRcdFx0dGhpcy50ZXh0Q29udGVudCA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sIG51bGwsIHZhbHVlLCBhcmd1bWVudHMubGVuZ3RoICk7XG5cdH0sXG5cblx0YXBwZW5kOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZG9tTWFuaXAoIHRoaXMsIGFyZ3VtZW50cywgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRpZiAoIHRoaXMubm9kZVR5cGUgPT09IDEgfHwgdGhpcy5ub2RlVHlwZSA9PT0gMTEgfHwgdGhpcy5ub2RlVHlwZSA9PT0gOSApIHtcblx0XHRcdFx0dmFyIHRhcmdldCA9IG1hbmlwdWxhdGlvblRhcmdldCggdGhpcywgZWxlbSApO1xuXHRcdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoIGVsZW0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH0sXG5cblx0cHJlcGVuZDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGRvbU1hbmlwKCB0aGlzLCBhcmd1bWVudHMsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0aWYgKCB0aGlzLm5vZGVUeXBlID09PSAxIHx8IHRoaXMubm9kZVR5cGUgPT09IDExIHx8IHRoaXMubm9kZVR5cGUgPT09IDkgKSB7XG5cdFx0XHRcdHZhciB0YXJnZXQgPSBtYW5pcHVsYXRpb25UYXJnZXQoIHRoaXMsIGVsZW0gKTtcblx0XHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZSggZWxlbSwgdGFyZ2V0LmZpcnN0Q2hpbGQgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH0sXG5cblx0YmVmb3JlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZG9tTWFuaXAoIHRoaXMsIGFyZ3VtZW50cywgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRpZiAoIHRoaXMucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggZWxlbSwgdGhpcyApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSxcblxuXHRhZnRlcjogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGRvbU1hbmlwKCB0aGlzLCBhcmd1bWVudHMsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0aWYgKCB0aGlzLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoIGVsZW0sIHRoaXMubmV4dFNpYmxpbmcgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH0sXG5cblx0ZW1wdHk6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBlbGVtLFxuXHRcdFx0aSA9IDA7XG5cblx0XHRmb3IgKCA7ICggZWxlbSA9IHRoaXNbIGkgXSApICE9IG51bGw7IGkrKyApIHtcblx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblxuXHRcdFx0XHQvLyBQcmV2ZW50IG1lbW9yeSBsZWFrc1xuXHRcdFx0XHRqUXVlcnkuY2xlYW5EYXRhKCBnZXRBbGwoIGVsZW0sIGZhbHNlICkgKTtcblxuXHRcdFx0XHQvLyBSZW1vdmUgYW55IHJlbWFpbmluZyBub2Rlc1xuXHRcdFx0XHRlbGVtLnRleHRDb250ZW50ID0gXCJcIjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRjbG9uZTogZnVuY3Rpb24oIGRhdGFBbmRFdmVudHMsIGRlZXBEYXRhQW5kRXZlbnRzICkge1xuXHRcdGRhdGFBbmRFdmVudHMgPSBkYXRhQW5kRXZlbnRzID09IG51bGwgPyBmYWxzZSA6IGRhdGFBbmRFdmVudHM7XG5cdFx0ZGVlcERhdGFBbmRFdmVudHMgPSBkZWVwRGF0YUFuZEV2ZW50cyA9PSBudWxsID8gZGF0YUFuZEV2ZW50cyA6IGRlZXBEYXRhQW5kRXZlbnRzO1xuXG5cdFx0cmV0dXJuIHRoaXMubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBqUXVlcnkuY2xvbmUoIHRoaXMsIGRhdGFBbmRFdmVudHMsIGRlZXBEYXRhQW5kRXZlbnRzICk7XG5cdFx0fSApO1xuXHR9LFxuXG5cdGh0bWw6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHRyZXR1cm4gYWNjZXNzKCB0aGlzLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0XHR2YXIgZWxlbSA9IHRoaXNbIDAgXSB8fCB7fSxcblx0XHRcdFx0aSA9IDAsXG5cdFx0XHRcdGwgPSB0aGlzLmxlbmd0aDtcblxuXHRcdFx0aWYgKCB2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtLmlubmVySFRNTDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU2VlIGlmIHdlIGNhbiB0YWtlIGEgc2hvcnRjdXQgYW5kIGp1c3QgdXNlIGlubmVySFRNTFxuXHRcdFx0aWYgKCB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgIXJub0lubmVyaHRtbC50ZXN0KCB2YWx1ZSApICYmXG5cdFx0XHRcdCF3cmFwTWFwWyAoIHJ0YWdOYW1lLmV4ZWMoIHZhbHVlICkgfHwgWyBcIlwiLCBcIlwiIF0gKVsgMSBdLnRvTG93ZXJDYXNlKCkgXSApIHtcblxuXHRcdFx0XHR2YWx1ZSA9IGpRdWVyeS5odG1sUHJlZmlsdGVyKCB2YWx1ZSApO1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Zm9yICggOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHRcdFx0ZWxlbSA9IHRoaXNbIGkgXSB8fCB7fTtcblxuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIGVsZW1lbnQgbm9kZXMgYW5kIHByZXZlbnQgbWVtb3J5IGxlYWtzXG5cdFx0XHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdFx0XHRcdGpRdWVyeS5jbGVhbkRhdGEoIGdldEFsbCggZWxlbSwgZmFsc2UgKSApO1xuXHRcdFx0XHRcdFx0XHRlbGVtLmlubmVySFRNTCA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGVsZW0gPSAwO1xuXG5cdFx0XHRcdC8vIElmIHVzaW5nIGlubmVySFRNTCB0aHJvd3MgYW4gZXhjZXB0aW9uLCB1c2UgdGhlIGZhbGxiYWNrIG1ldGhvZFxuXHRcdFx0XHR9IGNhdGNoICggZSApIHt9XG5cdFx0XHR9XG5cblx0XHRcdGlmICggZWxlbSApIHtcblx0XHRcdFx0dGhpcy5lbXB0eSgpLmFwcGVuZCggdmFsdWUgKTtcblx0XHRcdH1cblx0XHR9LCBudWxsLCB2YWx1ZSwgYXJndW1lbnRzLmxlbmd0aCApO1xuXHR9LFxuXG5cdHJlcGxhY2VXaXRoOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgaWdub3JlZCA9IFtdO1xuXG5cdFx0Ly8gTWFrZSB0aGUgY2hhbmdlcywgcmVwbGFjaW5nIGVhY2ggbm9uLWlnbm9yZWQgY29udGV4dCBlbGVtZW50IHdpdGggdGhlIG5ldyBjb250ZW50XG5cdFx0cmV0dXJuIGRvbU1hbmlwKCB0aGlzLCBhcmd1bWVudHMsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcblxuXHRcdFx0aWYgKCBqUXVlcnkuaW5BcnJheSggdGhpcywgaWdub3JlZCApIDwgMCApIHtcblx0XHRcdFx0alF1ZXJ5LmNsZWFuRGF0YSggZ2V0QWxsKCB0aGlzICkgKTtcblx0XHRcdFx0aWYgKCBwYXJlbnQgKSB7XG5cdFx0XHRcdFx0cGFyZW50LnJlcGxhY2VDaGlsZCggZWxlbSwgdGhpcyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvLyBGb3JjZSBjYWxsYmFjayBpbnZvY2F0aW9uXG5cdFx0fSwgaWdub3JlZCApO1xuXHR9XG59ICk7XG5cbmpRdWVyeS5lYWNoKCB7XG5cdGFwcGVuZFRvOiBcImFwcGVuZFwiLFxuXHRwcmVwZW5kVG86IFwicHJlcGVuZFwiLFxuXHRpbnNlcnRCZWZvcmU6IFwiYmVmb3JlXCIsXG5cdGluc2VydEFmdGVyOiBcImFmdGVyXCIsXG5cdHJlcGxhY2VBbGw6IFwicmVwbGFjZVdpdGhcIlxufSwgZnVuY3Rpb24oIG5hbWUsIG9yaWdpbmFsICkge1xuXHRqUXVlcnkuZm5bIG5hbWUgXSA9IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHR2YXIgZWxlbXMsXG5cdFx0XHRyZXQgPSBbXSxcblx0XHRcdGluc2VydCA9IGpRdWVyeSggc2VsZWN0b3IgKSxcblx0XHRcdGxhc3QgPSBpbnNlcnQubGVuZ3RoIC0gMSxcblx0XHRcdGkgPSAwO1xuXG5cdFx0Zm9yICggOyBpIDw9IGxhc3Q7IGkrKyApIHtcblx0XHRcdGVsZW1zID0gaSA9PT0gbGFzdCA/IHRoaXMgOiB0aGlzLmNsb25lKCB0cnVlICk7XG5cdFx0XHRqUXVlcnkoIGluc2VydFsgaSBdIClbIG9yaWdpbmFsIF0oIGVsZW1zICk7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IFF0V2ViS2l0XG5cdFx0XHQvLyAuZ2V0KCkgYmVjYXVzZSBwdXNoLmFwcGx5KF8sIGFycmF5bGlrZSkgdGhyb3dzXG5cdFx0XHRwdXNoLmFwcGx5KCByZXQsIGVsZW1zLmdldCgpICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMucHVzaFN0YWNrKCByZXQgKTtcblx0fTtcbn0gKTtcblxucmV0dXJuIGpRdWVyeTtcbn0gKTtcbiJdfQ==