"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(["./core", "./var/document", "./var/rnotwhite", "./var/slice", "./data/var/dataPriv", "./core/init", "./selector"], function (jQuery, document, rnotwhite, slice, dataPriv) {

	var rkeyEvent = /^key/,
	    rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	    rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	// Support: IE9
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (err) {}
	}

	function _on(elem, types, selector, data, fn, one) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ((typeof types === "undefined" ? "undefined" : _typeof(types)) === "object") {

			// ( types-Object, selector, data )
			if (typeof selector !== "string") {

				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for (type in types) {
				_on(elem, type, selector, data, types[type], one);
			}
			return elem;
		}

		if (data == null && fn == null) {

			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if (fn == null) {
			if (typeof selector === "string") {

				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {

				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if (fn === false) {
			fn = returnFalse;
		} else if (!fn) {
			return elem;
		}

		if (one === 1) {
			origFn = fn;
			fn = function fn(event) {

				// Can use an empty set, since event contains the info
				jQuery().off(event);
				return origFn.apply(this, arguments);
			};

			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
		}
		return elem.each(function () {
			jQuery.event.add(this, types, fn, data, selector);
		});
	}

	/*
  * Helper functions for managing events -- not part of the public interface.
  * Props to Dean Edwards' addEvent library for many of the ideas.
  */
	jQuery.event = {

		global: {},

		add: function add(elem, types, handler, data, selector) {

			var handleObjIn,
			    eventHandle,
			    tmp,
			    events,
			    t,
			    handleObj,
			    special,
			    handlers,
			    type,
			    namespaces,
			    origType,
			    elemData = dataPriv.get(elem);

			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if (!elemData) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if (handler.handler) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if (!handler.guid) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if (!(events = elemData.events)) {
				events = elemData.events = {};
			}
			if (!(eventHandle = elemData.handle)) {
				eventHandle = elemData.handle = function (e) {

					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : undefined;
				};
			}

			// Handle multiple events separated by a space
			types = (types || "").match(rnotwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				// There *must* be a type, no attaching namespace-only handlers
				if (!type) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[type] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = (selector ? special.delegateType : special.bindType) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[type] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend({
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test(selector),
					namespace: namespaces.join(".")
				}, handleObjIn);

				// Init the event handler queue if we're the first
				if (!(handlers = events[type])) {
					handlers = events[type] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {

						if (elem.addEventListener) {
							elem.addEventListener(type, eventHandle);
						}
					}
				}

				if (special.add) {
					special.add.call(elem, handleObj);

					if (!handleObj.handler.guid) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if (selector) {
					handlers.splice(handlers.delegateCount++, 0, handleObj);
				} else {
					handlers.push(handleObj);
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[type] = true;
			}
		},

		// Detach an event or set of events from an element
		remove: function remove(elem, types, handler, selector, mappedTypes) {

			var j,
			    origCount,
			    tmp,
			    events,
			    t,
			    handleObj,
			    special,
			    handlers,
			    type,
			    namespaces,
			    origType,
			    elemData = dataPriv.hasData(elem) && dataPriv.get(elem);

			if (!elemData || !(events = elemData.events)) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = (types || "").match(rnotwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				// Unbind all events (on this namespace, if provided) for the element
				if (!type) {
					for (type in events) {
						jQuery.event.remove(elem, type + types[t], handler, selector, true);
					}
					continue;
				}

				special = jQuery.event.special[type] || {};
				type = (selector ? special.delegateType : special.bindType) || type;
				handlers = events[type] || [];
				tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

				// Remove matching events
				origCount = j = handlers.length;
				while (j--) {
					handleObj = handlers[j];

					if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
						handlers.splice(j, 1);

						if (handleObj.selector) {
							handlers.delegateCount--;
						}
						if (special.remove) {
							special.remove.call(elem, handleObj);
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if (origCount && !handlers.length) {
					if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {

						jQuery.removeEvent(elem, type, elemData.handle);
					}

					delete events[type];
				}
			}

			// Remove data and the expando if it's no longer used
			if (jQuery.isEmptyObject(events)) {
				dataPriv.remove(elem, "handle events");
			}
		},

		dispatch: function dispatch(event) {

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix(event);

			var i,
			    j,
			    ret,
			    matched,
			    handleObj,
			    handlerQueue = [],
			    args = slice.call(arguments),
			    handlers = (dataPriv.get(this, "events") || {})[event.type] || [],
			    special = jQuery.event.special[event.type] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[0] = event;
			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if (special.preDispatch && special.preDispatch.call(this, event) === false) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call(this, event, handlers);

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
				event.currentTarget = matched.elem;

				j = 0;
				while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {

					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);

						if (ret !== undefined) {
							if ((event.result = ret) === false) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if (special.postDispatch) {
				special.postDispatch.call(this, event);
			}

			return event.result;
		},

		handlers: function handlers(event, _handlers) {
			var i,
			    matches,
			    sel,
			    handleObj,
			    handlerQueue = [],
			    delegateCount = _handlers.delegateCount,
			    cur = event.target;

			// Support (at least): Chrome, IE9
			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			//
			// Support: Firefox<=42+
			// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
			if (delegateCount && cur.nodeType && (event.type !== "click" || isNaN(event.button) || event.button < 1)) {

				for (; cur !== this; cur = cur.parentNode || this) {

					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if (cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click")) {
						matches = [];
						for (i = 0; i < delegateCount; i++) {
							handleObj = _handlers[i];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

							if (matches[sel] === undefined) {
								matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
							}
							if (matches[sel]) {
								matches.push(handleObj);
							}
						}
						if (matches.length) {
							handlerQueue.push({ elem: cur, handlers: matches });
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			if (delegateCount < _handlers.length) {
				handlerQueue.push({ elem: this, handlers: _handlers.slice(delegateCount) });
			}

			return handlerQueue;
		},

		// Includes some event props shared by KeyEvent and MouseEvent
		props: ("altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " + "metaKey relatedTarget shiftKey target timeStamp view which").split(" "),

		fixHooks: {},

		keyHooks: {
			props: "char charCode key keyCode".split(" "),
			filter: function filter(event, original) {

				// Add which for key events
				if (event.which == null) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}

				return event;
			}
		},

		mouseHooks: {
			props: ("button buttons clientX clientY offsetX offsetY pageX pageY " + "screenX screenY toElement").split(" "),
			filter: function filter(event, original) {
				var eventDoc,
				    doc,
				    body,
				    button = original.button;

				// Calculate pageX/Y if missing and clientX/Y available
				if (event.pageX == null && original.clientX != null) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
					event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
				}

				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if (!event.which && button !== undefined) {
					event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
				}

				return event;
			}
		},

		fix: function fix(event) {
			if (event[jQuery.expando]) {
				return event;
			}

			// Create a writable copy of the event object and normalize some properties
			var i,
			    prop,
			    copy,
			    type = event.type,
			    originalEvent = event,
			    fixHook = this.fixHooks[type];

			if (!fixHook) {
				this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {};
			}
			copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

			event = new jQuery.Event(originalEvent);

			i = copy.length;
			while (i--) {
				prop = copy[i];
				event[prop] = originalEvent[prop];
			}

			// Support: Cordova 2.5 (WebKit) (#13255)
			// All events should have a target; Cordova deviceready doesn't
			if (!event.target) {
				event.target = document;
			}

			// Support: Safari 6.0+, Chrome<28
			// Target should not be a text node (#504, #13143)
			if (event.target.nodeType === 3) {
				event.target = event.target.parentNode;
			}

			return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
		},

		special: {
			load: {

				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {

				// Fire native event if possible so blur/focus sequence is correct
				trigger: function trigger() {
					if (this !== safeActiveElement() && this.focus) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function trigger() {
					if (this === safeActiveElement() && this.blur) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {

				// For checkbox, fire native event so checked state will be right
				trigger: function trigger() {
					if (this.type === "checkbox" && this.click && jQuery.nodeName(this, "input")) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function _default(event) {
					return jQuery.nodeName(event.target, "a");
				}
			},

			beforeunload: {
				postDispatch: function postDispatch(event) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if (event.result !== undefined && event.originalEvent) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};

	jQuery.removeEvent = function (elem, type, handle) {

		// This "if" is needed for plain objects
		if (elem.removeEventListener) {
			elem.removeEventListener(type, handle);
		}
	};

	jQuery.Event = function (src, props) {

		// Allow instantiation without the 'new' keyword
		if (!(this instanceof jQuery.Event)) {
			return new jQuery.Event(src, props);
		}

		// Event object
		if (src && src.type) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined &&

			// Support: Android<4.0
			src.returnValue === false ? returnTrue : returnFalse;

			// Event type
		} else {
				this.type = src;
			}

		// Put explicitly provided properties onto the event object
		if (props) {
			jQuery.extend(this, props);
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[jQuery.expando] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,

		preventDefault: function preventDefault() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if (e && !this.isSimulated) {
				e.preventDefault();
			}
		},
		stopPropagation: function stopPropagation() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if (e && !this.isSimulated) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function stopImmediatePropagation() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if (e && !this.isSimulated) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://code.google.com/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function (orig, fix) {
		jQuery.event.special[orig] = {
			delegateType: fix,
			bindType: fix,

			handle: function handle(event) {
				var ret,
				    target = this,
				    related = event.relatedTarget,
				    handleObj = event.handleObj;

				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if (!related || related !== target && !jQuery.contains(target, related)) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply(this, arguments);
					event.type = fix;
				}
				return ret;
			}
		};
	});

	jQuery.fn.extend({
		on: function on(types, selector, data, fn) {
			return _on(this, types, selector, data, fn);
		},
		one: function one(types, selector, data, fn) {
			return _on(this, types, selector, data, fn, 1);
		},
		off: function off(types, selector, fn) {
			var handleObj, type;
			if (types && types.preventDefault && types.handleObj) {

				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
				return this;
			}
			if ((typeof types === "undefined" ? "undefined" : _typeof(types)) === "object") {

				// ( types-object [, selector] )
				for (type in types) {
					this.off(type, selector, types[type]);
				}
				return this;
			}
			if (selector === false || typeof selector === "function") {

				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if (fn === false) {
				fn = returnFalse;
			}
			return this.each(function () {
				jQuery.event.remove(this, types, fn, selector);
			});
		}
	});

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9ldmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBUSxDQUNQLFFBRE8sRUFFUCxnQkFGTyxFQUdQLGlCQUhPLEVBSVAsYUFKTyxFQUtQLHFCQUxPLEVBT1AsYUFQTyxFQVFQLFlBUk8sQ0FBUixFQVNHLFVBQVUsTUFBVixFQUFrQixRQUFsQixFQUE0QixTQUE1QixFQUF1QyxLQUF2QyxFQUE4QyxRQUE5QyxFQUF5RDs7QUFFNUQsS0FDQyxZQUFZLE1BRGI7S0FFQyxjQUFjLGdEQUZmO0tBR0MsaUJBQWlCLHFCQUhsQjs7QUFLQSxVQUFTLFVBQVQsR0FBc0I7QUFDckIsU0FBTyxJQUFQO0FBQ0E7O0FBRUQsVUFBUyxXQUFULEdBQXVCO0FBQ3RCLFNBQU8sS0FBUDtBQUNBOzs7O0FBSUQsVUFBUyxpQkFBVCxHQUE2QjtBQUM1QixNQUFJO0FBQ0gsVUFBTyxTQUFTLGFBQWhCO0FBQ0EsR0FGRCxDQUVFLE9BQVEsR0FBUixFQUFjLENBQUc7QUFDbkI7O0FBRUQsVUFBUyxHQUFULENBQWEsSUFBYixFQUFtQixLQUFuQixFQUEwQixRQUExQixFQUFvQyxJQUFwQyxFQUEwQyxFQUExQyxFQUE4QyxHQUE5QyxFQUFvRDtBQUNuRCxNQUFJLE1BQUosRUFBWSxJQUFaOzs7QUFHQSxNQUFLLFFBQU8sS0FBUCx5Q0FBTyxLQUFQLE9BQWlCLFFBQXRCLEVBQWlDOzs7QUFHaEMsT0FBSyxPQUFPLFFBQVAsS0FBb0IsUUFBekIsRUFBb0M7OztBQUduQyxXQUFPLFFBQVEsUUFBZjtBQUNBLGVBQVcsU0FBWDtBQUNBO0FBQ0QsUUFBTSxJQUFOLElBQWMsS0FBZCxFQUFzQjtBQUNyQixRQUFJLElBQUosRUFBVSxJQUFWLEVBQWdCLFFBQWhCLEVBQTBCLElBQTFCLEVBQWdDLE1BQU8sSUFBUCxDQUFoQyxFQUErQyxHQUEvQztBQUNBO0FBQ0QsVUFBTyxJQUFQO0FBQ0E7O0FBRUQsTUFBSyxRQUFRLElBQVIsSUFBZ0IsTUFBTSxJQUEzQixFQUFrQzs7O0FBR2pDLFFBQUssUUFBTDtBQUNBLFVBQU8sV0FBVyxTQUFsQjtBQUNBLEdBTEQsTUFLTyxJQUFLLE1BQU0sSUFBWCxFQUFrQjtBQUN4QixPQUFLLE9BQU8sUUFBUCxLQUFvQixRQUF6QixFQUFvQzs7O0FBR25DLFNBQUssSUFBTDtBQUNBLFdBQU8sU0FBUDtBQUNBLElBTEQsTUFLTzs7O0FBR04sU0FBSyxJQUFMO0FBQ0EsV0FBTyxRQUFQO0FBQ0EsZUFBVyxTQUFYO0FBQ0E7QUFDRDtBQUNELE1BQUssT0FBTyxLQUFaLEVBQW9CO0FBQ25CLFFBQUssV0FBTDtBQUNBLEdBRkQsTUFFTyxJQUFLLENBQUMsRUFBTixFQUFXO0FBQ2pCLFVBQU8sSUFBUDtBQUNBOztBQUVELE1BQUssUUFBUSxDQUFiLEVBQWlCO0FBQ2hCLFlBQVMsRUFBVDtBQUNBLFFBQUssWUFBVSxLQUFWLEVBQWtCOzs7QUFHdEIsYUFBUyxHQUFULENBQWMsS0FBZDtBQUNBLFdBQU8sT0FBTyxLQUFQLENBQWMsSUFBZCxFQUFvQixTQUFwQixDQUFQO0FBQ0EsSUFMRDs7O0FBUUEsTUFBRyxJQUFILEdBQVUsT0FBTyxJQUFQLEtBQWlCLE9BQU8sSUFBUCxHQUFjLE9BQU8sSUFBUCxFQUEvQixDQUFWO0FBQ0E7QUFDRCxTQUFPLEtBQUssSUFBTCxDQUFXLFlBQVc7QUFDNUIsVUFBTyxLQUFQLENBQWEsR0FBYixDQUFrQixJQUFsQixFQUF3QixLQUF4QixFQUErQixFQUEvQixFQUFtQyxJQUFuQyxFQUF5QyxRQUF6QztBQUNBLEdBRk0sQ0FBUDtBQUdBOzs7Ozs7QUFNRCxRQUFPLEtBQVAsR0FBZTs7QUFFZCxVQUFRLEVBRk07O0FBSWQsT0FBSyxhQUFVLElBQVYsRUFBZ0IsS0FBaEIsRUFBdUIsT0FBdkIsRUFBZ0MsSUFBaEMsRUFBc0MsUUFBdEMsRUFBaUQ7O0FBRXJELE9BQUksV0FBSjtPQUFpQixXQUFqQjtPQUE4QixHQUE5QjtPQUNDLE1BREQ7T0FDUyxDQURUO09BQ1ksU0FEWjtPQUVDLE9BRkQ7T0FFVSxRQUZWO09BRW9CLElBRnBCO09BRTBCLFVBRjFCO09BRXNDLFFBRnRDO09BR0MsV0FBVyxTQUFTLEdBQVQsQ0FBYyxJQUFkLENBSFo7OztBQU1BLE9BQUssQ0FBQyxRQUFOLEVBQWlCO0FBQ2hCO0FBQ0E7OztBQUdELE9BQUssUUFBUSxPQUFiLEVBQXVCO0FBQ3RCLGtCQUFjLE9BQWQ7QUFDQSxjQUFVLFlBQVksT0FBdEI7QUFDQSxlQUFXLFlBQVksUUFBdkI7QUFDQTs7O0FBR0QsT0FBSyxDQUFDLFFBQVEsSUFBZCxFQUFxQjtBQUNwQixZQUFRLElBQVIsR0FBZSxPQUFPLElBQVAsRUFBZjtBQUNBOzs7QUFHRCxPQUFLLEVBQUcsU0FBUyxTQUFTLE1BQXJCLENBQUwsRUFBcUM7QUFDcEMsYUFBUyxTQUFTLE1BQVQsR0FBa0IsRUFBM0I7QUFDQTtBQUNELE9BQUssRUFBRyxjQUFjLFNBQVMsTUFBMUIsQ0FBTCxFQUEwQztBQUN6QyxrQkFBYyxTQUFTLE1BQVQsR0FBa0IsVUFBVSxDQUFWLEVBQWM7Ozs7QUFJN0MsWUFBTyxPQUFPLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUMsT0FBTyxLQUFQLENBQWEsU0FBYixLQUEyQixFQUFFLElBQTlELEdBQ04sT0FBTyxLQUFQLENBQWEsUUFBYixDQUFzQixLQUF0QixDQUE2QixJQUE3QixFQUFtQyxTQUFuQyxDQURNLEdBQzJDLFNBRGxEO0FBRUEsS0FORDtBQU9BOzs7QUFHRCxXQUFRLENBQUUsU0FBUyxFQUFYLEVBQWdCLEtBQWhCLENBQXVCLFNBQXZCLEtBQXNDLENBQUUsRUFBRixDQUE5QztBQUNBLE9BQUksTUFBTSxNQUFWO0FBQ0EsVUFBUSxHQUFSLEVBQWM7QUFDYixVQUFNLGVBQWUsSUFBZixDQUFxQixNQUFPLENBQVAsQ0FBckIsS0FBcUMsRUFBM0M7QUFDQSxXQUFPLFdBQVcsSUFBSyxDQUFMLENBQWxCO0FBQ0EsaUJBQWEsQ0FBRSxJQUFLLENBQUwsS0FBWSxFQUFkLEVBQW1CLEtBQW5CLENBQTBCLEdBQTFCLEVBQWdDLElBQWhDLEVBQWI7OztBQUdBLFFBQUssQ0FBQyxJQUFOLEVBQWE7QUFDWjtBQUNBOzs7QUFHRCxjQUFVLE9BQU8sS0FBUCxDQUFhLE9BQWIsQ0FBc0IsSUFBdEIsS0FBZ0MsRUFBMUM7OztBQUdBLFdBQU8sQ0FBRSxXQUFXLFFBQVEsWUFBbkIsR0FBa0MsUUFBUSxRQUE1QyxLQUEwRCxJQUFqRTs7O0FBR0EsY0FBVSxPQUFPLEtBQVAsQ0FBYSxPQUFiLENBQXNCLElBQXRCLEtBQWdDLEVBQTFDOzs7QUFHQSxnQkFBWSxPQUFPLE1BQVAsQ0FBZTtBQUMxQixXQUFNLElBRG9CO0FBRTFCLGVBQVUsUUFGZ0I7QUFHMUIsV0FBTSxJQUhvQjtBQUkxQixjQUFTLE9BSmlCO0FBSzFCLFdBQU0sUUFBUSxJQUxZO0FBTTFCLGVBQVUsUUFOZ0I7QUFPMUIsbUJBQWMsWUFBWSxPQUFPLElBQVAsQ0FBWSxLQUFaLENBQWtCLFlBQWxCLENBQStCLElBQS9CLENBQXFDLFFBQXJDLENBUEE7QUFRMUIsZ0JBQVcsV0FBVyxJQUFYLENBQWlCLEdBQWpCO0FBUmUsS0FBZixFQVNULFdBVFMsQ0FBWjs7O0FBWUEsUUFBSyxFQUFHLFdBQVcsT0FBUSxJQUFSLENBQWQsQ0FBTCxFQUFzQztBQUNyQyxnQkFBVyxPQUFRLElBQVIsSUFBaUIsRUFBNUI7QUFDQSxjQUFTLGFBQVQsR0FBeUIsQ0FBekI7OztBQUdBLFNBQUssQ0FBQyxRQUFRLEtBQVQsSUFDSixRQUFRLEtBQVIsQ0FBYyxJQUFkLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQWdDLFVBQWhDLEVBQTRDLFdBQTVDLE1BQThELEtBRC9ELEVBQ3VFOztBQUV0RSxVQUFLLEtBQUssZ0JBQVYsRUFBNkI7QUFDNUIsWUFBSyxnQkFBTCxDQUF1QixJQUF2QixFQUE2QixXQUE3QjtBQUNBO0FBQ0Q7QUFDRDs7QUFFRCxRQUFLLFFBQVEsR0FBYixFQUFtQjtBQUNsQixhQUFRLEdBQVIsQ0FBWSxJQUFaLENBQWtCLElBQWxCLEVBQXdCLFNBQXhCOztBQUVBLFNBQUssQ0FBQyxVQUFVLE9BQVYsQ0FBa0IsSUFBeEIsRUFBK0I7QUFDOUIsZ0JBQVUsT0FBVixDQUFrQixJQUFsQixHQUF5QixRQUFRLElBQWpDO0FBQ0E7QUFDRDs7O0FBR0QsUUFBSyxRQUFMLEVBQWdCO0FBQ2YsY0FBUyxNQUFULENBQWlCLFNBQVMsYUFBVCxFQUFqQixFQUEyQyxDQUEzQyxFQUE4QyxTQUE5QztBQUNBLEtBRkQsTUFFTztBQUNOLGNBQVMsSUFBVCxDQUFlLFNBQWY7QUFDQTs7O0FBR0QsV0FBTyxLQUFQLENBQWEsTUFBYixDQUFxQixJQUFyQixJQUE4QixJQUE5QjtBQUNBO0FBRUQsR0E5R2E7OztBQWlIZCxVQUFRLGdCQUFVLElBQVYsRUFBZ0IsS0FBaEIsRUFBdUIsT0FBdkIsRUFBZ0MsUUFBaEMsRUFBMEMsV0FBMUMsRUFBd0Q7O0FBRS9ELE9BQUksQ0FBSjtPQUFPLFNBQVA7T0FBa0IsR0FBbEI7T0FDQyxNQUREO09BQ1MsQ0FEVDtPQUNZLFNBRFo7T0FFQyxPQUZEO09BRVUsUUFGVjtPQUVvQixJQUZwQjtPQUUwQixVQUYxQjtPQUVzQyxRQUZ0QztPQUdDLFdBQVcsU0FBUyxPQUFULENBQWtCLElBQWxCLEtBQTRCLFNBQVMsR0FBVCxDQUFjLElBQWQsQ0FIeEM7O0FBS0EsT0FBSyxDQUFDLFFBQUQsSUFBYSxFQUFHLFNBQVMsU0FBUyxNQUFyQixDQUFsQixFQUFrRDtBQUNqRDtBQUNBOzs7QUFHRCxXQUFRLENBQUUsU0FBUyxFQUFYLEVBQWdCLEtBQWhCLENBQXVCLFNBQXZCLEtBQXNDLENBQUUsRUFBRixDQUE5QztBQUNBLE9BQUksTUFBTSxNQUFWO0FBQ0EsVUFBUSxHQUFSLEVBQWM7QUFDYixVQUFNLGVBQWUsSUFBZixDQUFxQixNQUFPLENBQVAsQ0FBckIsS0FBcUMsRUFBM0M7QUFDQSxXQUFPLFdBQVcsSUFBSyxDQUFMLENBQWxCO0FBQ0EsaUJBQWEsQ0FBRSxJQUFLLENBQUwsS0FBWSxFQUFkLEVBQW1CLEtBQW5CLENBQTBCLEdBQTFCLEVBQWdDLElBQWhDLEVBQWI7OztBQUdBLFFBQUssQ0FBQyxJQUFOLEVBQWE7QUFDWixVQUFNLElBQU4sSUFBYyxNQUFkLEVBQXVCO0FBQ3RCLGFBQU8sS0FBUCxDQUFhLE1BQWIsQ0FBcUIsSUFBckIsRUFBMkIsT0FBTyxNQUFPLENBQVAsQ0FBbEMsRUFBOEMsT0FBOUMsRUFBdUQsUUFBdkQsRUFBaUUsSUFBakU7QUFDQTtBQUNEO0FBQ0E7O0FBRUQsY0FBVSxPQUFPLEtBQVAsQ0FBYSxPQUFiLENBQXNCLElBQXRCLEtBQWdDLEVBQTFDO0FBQ0EsV0FBTyxDQUFFLFdBQVcsUUFBUSxZQUFuQixHQUFrQyxRQUFRLFFBQTVDLEtBQTBELElBQWpFO0FBQ0EsZUFBVyxPQUFRLElBQVIsS0FBa0IsRUFBN0I7QUFDQSxVQUFNLElBQUssQ0FBTCxLQUNMLElBQUksTUFBSixDQUFZLFlBQVksV0FBVyxJQUFYLENBQWlCLGVBQWpCLENBQVosR0FBaUQsU0FBN0QsQ0FERDs7O0FBSUEsZ0JBQVksSUFBSSxTQUFTLE1BQXpCO0FBQ0EsV0FBUSxHQUFSLEVBQWM7QUFDYixpQkFBWSxTQUFVLENBQVYsQ0FBWjs7QUFFQSxTQUFLLENBQUUsZUFBZSxhQUFhLFVBQVUsUUFBeEMsTUFDRixDQUFDLE9BQUQsSUFBWSxRQUFRLElBQVIsS0FBaUIsVUFBVSxJQURyQyxNQUVGLENBQUMsR0FBRCxJQUFRLElBQUksSUFBSixDQUFVLFVBQVUsU0FBcEIsQ0FGTixNQUdGLENBQUMsUUFBRCxJQUFhLGFBQWEsVUFBVSxRQUFwQyxJQUNELGFBQWEsSUFBYixJQUFxQixVQUFVLFFBSjVCLENBQUwsRUFJOEM7QUFDN0MsZUFBUyxNQUFULENBQWlCLENBQWpCLEVBQW9CLENBQXBCOztBQUVBLFVBQUssVUFBVSxRQUFmLEVBQTBCO0FBQ3pCLGdCQUFTLGFBQVQ7QUFDQTtBQUNELFVBQUssUUFBUSxNQUFiLEVBQXNCO0FBQ3JCLGVBQVEsTUFBUixDQUFlLElBQWYsQ0FBcUIsSUFBckIsRUFBMkIsU0FBM0I7QUFDQTtBQUNEO0FBQ0Q7Ozs7QUFJRCxRQUFLLGFBQWEsQ0FBQyxTQUFTLE1BQTVCLEVBQXFDO0FBQ3BDLFNBQUssQ0FBQyxRQUFRLFFBQVQsSUFDSixRQUFRLFFBQVIsQ0FBaUIsSUFBakIsQ0FBdUIsSUFBdkIsRUFBNkIsVUFBN0IsRUFBeUMsU0FBUyxNQUFsRCxNQUErRCxLQURoRSxFQUN3RTs7QUFFdkUsYUFBTyxXQUFQLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQWdDLFNBQVMsTUFBekM7QUFDQTs7QUFFRCxZQUFPLE9BQVEsSUFBUixDQUFQO0FBQ0E7QUFDRDs7O0FBR0QsT0FBSyxPQUFPLGFBQVAsQ0FBc0IsTUFBdEIsQ0FBTCxFQUFzQztBQUNyQyxhQUFTLE1BQVQsQ0FBaUIsSUFBakIsRUFBdUIsZUFBdkI7QUFDQTtBQUNELEdBeExhOztBQTBMZCxZQUFVLGtCQUFVLEtBQVYsRUFBa0I7OztBQUczQixXQUFRLE9BQU8sS0FBUCxDQUFhLEdBQWIsQ0FBa0IsS0FBbEIsQ0FBUjs7QUFFQSxPQUFJLENBQUo7T0FBTyxDQUFQO09BQVUsR0FBVjtPQUFlLE9BQWY7T0FBd0IsU0FBeEI7T0FDQyxlQUFlLEVBRGhCO09BRUMsT0FBTyxNQUFNLElBQU4sQ0FBWSxTQUFaLENBRlI7T0FHQyxXQUFXLENBQUUsU0FBUyxHQUFULENBQWMsSUFBZCxFQUFvQixRQUFwQixLQUFrQyxFQUFwQyxFQUEwQyxNQUFNLElBQWhELEtBQTBELEVBSHRFO09BSUMsVUFBVSxPQUFPLEtBQVAsQ0FBYSxPQUFiLENBQXNCLE1BQU0sSUFBNUIsS0FBc0MsRUFKakQ7OztBQU9BLFFBQU0sQ0FBTixJQUFZLEtBQVo7QUFDQSxTQUFNLGNBQU4sR0FBdUIsSUFBdkI7OztBQUdBLE9BQUssUUFBUSxXQUFSLElBQXVCLFFBQVEsV0FBUixDQUFvQixJQUFwQixDQUEwQixJQUExQixFQUFnQyxLQUFoQyxNQUE0QyxLQUF4RSxFQUFnRjtBQUMvRTtBQUNBOzs7QUFHRCxrQkFBZSxPQUFPLEtBQVAsQ0FBYSxRQUFiLENBQXNCLElBQXRCLENBQTRCLElBQTVCLEVBQWtDLEtBQWxDLEVBQXlDLFFBQXpDLENBQWY7OztBQUdBLE9BQUksQ0FBSjtBQUNBLFVBQVEsQ0FBRSxVQUFVLGFBQWMsR0FBZCxDQUFaLEtBQXFDLENBQUMsTUFBTSxvQkFBTixFQUE5QyxFQUE2RTtBQUM1RSxVQUFNLGFBQU4sR0FBc0IsUUFBUSxJQUE5Qjs7QUFFQSxRQUFJLENBQUo7QUFDQSxXQUFRLENBQUUsWUFBWSxRQUFRLFFBQVIsQ0FBa0IsR0FBbEIsQ0FBZCxLQUNQLENBQUMsTUFBTSw2QkFBTixFQURGLEVBQzBDOzs7O0FBSXpDLFNBQUssQ0FBQyxNQUFNLFVBQVAsSUFBcUIsTUFBTSxVQUFOLENBQWlCLElBQWpCLENBQXVCLFVBQVUsU0FBakMsQ0FBMUIsRUFBeUU7O0FBRXhFLFlBQU0sU0FBTixHQUFrQixTQUFsQjtBQUNBLFlBQU0sSUFBTixHQUFhLFVBQVUsSUFBdkI7O0FBRUEsWUFBTSxDQUFFLENBQUUsT0FBTyxLQUFQLENBQWEsT0FBYixDQUFzQixVQUFVLFFBQWhDLEtBQThDLEVBQWhELEVBQXFELE1BQXJELElBQ1AsVUFBVSxPQURMLEVBQ2UsS0FEZixDQUNzQixRQUFRLElBRDlCLEVBQ29DLElBRHBDLENBQU47O0FBR0EsVUFBSyxRQUFRLFNBQWIsRUFBeUI7QUFDeEIsV0FBSyxDQUFFLE1BQU0sTUFBTixHQUFlLEdBQWpCLE1BQTJCLEtBQWhDLEVBQXdDO0FBQ3ZDLGNBQU0sY0FBTjtBQUNBLGNBQU0sZUFBTjtBQUNBO0FBQ0Q7QUFDRDtBQUNEO0FBQ0Q7OztBQUdELE9BQUssUUFBUSxZQUFiLEVBQTRCO0FBQzNCLFlBQVEsWUFBUixDQUFxQixJQUFyQixDQUEyQixJQUEzQixFQUFpQyxLQUFqQztBQUNBOztBQUVELFVBQU8sTUFBTSxNQUFiO0FBQ0EsR0FwUGE7O0FBc1BkLFlBQVUsa0JBQVUsS0FBVixFQUFpQixTQUFqQixFQUE0QjtBQUNyQyxPQUFJLENBQUo7T0FBTyxPQUFQO09BQWdCLEdBQWhCO09BQXFCLFNBQXJCO09BQ0MsZUFBZSxFQURoQjtPQUVDLGdCQUFnQixVQUFTLGFBRjFCO09BR0MsTUFBTSxNQUFNLE1BSGI7Ozs7Ozs7O0FBV0EsT0FBSyxpQkFBaUIsSUFBSSxRQUFyQixLQUNGLE1BQU0sSUFBTixLQUFlLE9BQWYsSUFBMEIsTUFBTyxNQUFNLE1BQWIsQ0FBMUIsSUFBbUQsTUFBTSxNQUFOLEdBQWUsQ0FEaEUsQ0FBTCxFQUMyRTs7QUFFMUUsV0FBUSxRQUFRLElBQWhCLEVBQXNCLE1BQU0sSUFBSSxVQUFKLElBQWtCLElBQTlDLEVBQXFEOzs7O0FBSXBELFNBQUssSUFBSSxRQUFKLEtBQWlCLENBQWpCLEtBQXdCLElBQUksUUFBSixLQUFpQixJQUFqQixJQUF5QixNQUFNLElBQU4sS0FBZSxPQUFoRSxDQUFMLEVBQWlGO0FBQ2hGLGdCQUFVLEVBQVY7QUFDQSxXQUFNLElBQUksQ0FBVixFQUFhLElBQUksYUFBakIsRUFBZ0MsR0FBaEMsRUFBc0M7QUFDckMsbUJBQVksVUFBVSxDQUFWLENBQVo7OztBQUdBLGFBQU0sVUFBVSxRQUFWLEdBQXFCLEdBQTNCOztBQUVBLFdBQUssUUFBUyxHQUFULE1BQW1CLFNBQXhCLEVBQW9DO0FBQ25DLGdCQUFTLEdBQVQsSUFBaUIsVUFBVSxZQUFWLEdBQ2hCLE9BQVEsR0FBUixFQUFhLElBQWIsRUFBb0IsS0FBcEIsQ0FBMkIsR0FBM0IsSUFBbUMsQ0FBQyxDQURwQixHQUVoQixPQUFPLElBQVAsQ0FBYSxHQUFiLEVBQWtCLElBQWxCLEVBQXdCLElBQXhCLEVBQThCLENBQUUsR0FBRixDQUE5QixFQUF3QyxNQUZ6QztBQUdBO0FBQ0QsV0FBSyxRQUFTLEdBQVQsQ0FBTCxFQUFzQjtBQUNyQixnQkFBUSxJQUFSLENBQWMsU0FBZDtBQUNBO0FBQ0Q7QUFDRCxVQUFLLFFBQVEsTUFBYixFQUFzQjtBQUNyQixvQkFBYSxJQUFiLENBQW1CLEVBQUUsTUFBTSxHQUFSLEVBQWEsVUFBVSxPQUF2QixFQUFuQjtBQUNBO0FBQ0Q7QUFDRDtBQUNEOzs7QUFHRCxPQUFLLGdCQUFnQixVQUFTLE1BQTlCLEVBQXVDO0FBQ3RDLGlCQUFhLElBQWIsQ0FBbUIsRUFBRSxNQUFNLElBQVIsRUFBYyxVQUFVLFVBQVMsS0FBVCxDQUFnQixhQUFoQixDQUF4QixFQUFuQjtBQUNBOztBQUVELFVBQU8sWUFBUDtBQUNBLEdBdlNhOzs7QUEwU2QsU0FBTyxDQUFFLHVFQUNSLDREQURNLEVBQ3lELEtBRHpELENBQ2dFLEdBRGhFLENBMVNPOztBQTZTZCxZQUFVLEVBN1NJOztBQStTZCxZQUFVO0FBQ1QsVUFBTyw0QkFBNEIsS0FBNUIsQ0FBbUMsR0FBbkMsQ0FERTtBQUVULFdBQVEsZ0JBQVUsS0FBVixFQUFpQixRQUFqQixFQUE0Qjs7O0FBR25DLFFBQUssTUFBTSxLQUFOLElBQWUsSUFBcEIsRUFBMkI7QUFDMUIsV0FBTSxLQUFOLEdBQWMsU0FBUyxRQUFULElBQXFCLElBQXJCLEdBQTRCLFNBQVMsUUFBckMsR0FBZ0QsU0FBUyxPQUF2RTtBQUNBOztBQUVELFdBQU8sS0FBUDtBQUNBO0FBVlEsR0EvU0k7O0FBNFRkLGNBQVk7QUFDWCxVQUFPLENBQUUsZ0VBQ1IsMkJBRE0sRUFDd0IsS0FEeEIsQ0FDK0IsR0FEL0IsQ0FESTtBQUdYLFdBQVEsZ0JBQVUsS0FBVixFQUFpQixRQUFqQixFQUE0QjtBQUNuQyxRQUFJLFFBQUo7UUFBYyxHQUFkO1FBQW1CLElBQW5CO1FBQ0MsU0FBUyxTQUFTLE1BRG5COzs7QUFJQSxRQUFLLE1BQU0sS0FBTixJQUFlLElBQWYsSUFBdUIsU0FBUyxPQUFULElBQW9CLElBQWhELEVBQXVEO0FBQ3RELGdCQUFXLE1BQU0sTUFBTixDQUFhLGFBQWIsSUFBOEIsUUFBekM7QUFDQSxXQUFNLFNBQVMsZUFBZjtBQUNBLFlBQU8sU0FBUyxJQUFoQjs7QUFFQSxXQUFNLEtBQU4sR0FBYyxTQUFTLE9BQVQsSUFDWCxPQUFPLElBQUksVUFBWCxJQUF5QixRQUFRLEtBQUssVUFBdEMsSUFBb0QsQ0FEekMsS0FFWCxPQUFPLElBQUksVUFBWCxJQUF5QixRQUFRLEtBQUssVUFBdEMsSUFBb0QsQ0FGekMsQ0FBZDtBQUdBLFdBQU0sS0FBTixHQUFjLFNBQVMsT0FBVCxJQUNYLE9BQU8sSUFBSSxTQUFYLElBQXlCLFFBQVEsS0FBSyxTQUF0QyxJQUFvRCxDQUR6QyxLQUVYLE9BQU8sSUFBSSxTQUFYLElBQXlCLFFBQVEsS0FBSyxTQUF0QyxJQUFvRCxDQUZ6QyxDQUFkO0FBR0E7Ozs7QUFJRCxRQUFLLENBQUMsTUFBTSxLQUFQLElBQWdCLFdBQVcsU0FBaEMsRUFBNEM7QUFDM0MsV0FBTSxLQUFOLEdBQWdCLFNBQVMsQ0FBVCxHQUFhLENBQWIsR0FBbUIsU0FBUyxDQUFULEdBQWEsQ0FBYixHQUFtQixTQUFTLENBQVQsR0FBYSxDQUFiLEdBQWlCLENBQXZFO0FBQ0E7O0FBRUQsV0FBTyxLQUFQO0FBQ0E7QUE1QlUsR0E1VEU7O0FBMlZkLE9BQUssYUFBVSxLQUFWLEVBQWtCO0FBQ3RCLE9BQUssTUFBTyxPQUFPLE9BQWQsQ0FBTCxFQUErQjtBQUM5QixXQUFPLEtBQVA7QUFDQTs7O0FBR0QsT0FBSSxDQUFKO09BQU8sSUFBUDtPQUFhLElBQWI7T0FDQyxPQUFPLE1BQU0sSUFEZDtPQUVDLGdCQUFnQixLQUZqQjtPQUdDLFVBQVUsS0FBSyxRQUFMLENBQWUsSUFBZixDQUhYOztBQUtBLE9BQUssQ0FBQyxPQUFOLEVBQWdCO0FBQ2YsU0FBSyxRQUFMLENBQWUsSUFBZixJQUF3QixVQUN2QixZQUFZLElBQVosQ0FBa0IsSUFBbEIsSUFBMkIsS0FBSyxVQUFoQyxHQUNBLFVBQVUsSUFBVixDQUFnQixJQUFoQixJQUF5QixLQUFLLFFBQTlCLEdBQ0EsRUFIRDtBQUlBO0FBQ0QsVUFBTyxRQUFRLEtBQVIsR0FBZ0IsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFtQixRQUFRLEtBQTNCLENBQWhCLEdBQXFELEtBQUssS0FBakU7O0FBRUEsV0FBUSxJQUFJLE9BQU8sS0FBWCxDQUFrQixhQUFsQixDQUFSOztBQUVBLE9BQUksS0FBSyxNQUFUO0FBQ0EsVUFBUSxHQUFSLEVBQWM7QUFDYixXQUFPLEtBQU0sQ0FBTixDQUFQO0FBQ0EsVUFBTyxJQUFQLElBQWdCLGNBQWUsSUFBZixDQUFoQjtBQUNBOzs7O0FBSUQsT0FBSyxDQUFDLE1BQU0sTUFBWixFQUFxQjtBQUNwQixVQUFNLE1BQU4sR0FBZSxRQUFmO0FBQ0E7Ozs7QUFJRCxPQUFLLE1BQU0sTUFBTixDQUFhLFFBQWIsS0FBMEIsQ0FBL0IsRUFBbUM7QUFDbEMsVUFBTSxNQUFOLEdBQWUsTUFBTSxNQUFOLENBQWEsVUFBNUI7QUFDQTs7QUFFRCxVQUFPLFFBQVEsTUFBUixHQUFpQixRQUFRLE1BQVIsQ0FBZ0IsS0FBaEIsRUFBdUIsYUFBdkIsQ0FBakIsR0FBMEQsS0FBakU7QUFDQSxHQW5ZYTs7QUFxWWQsV0FBUztBQUNSLFNBQU07OztBQUdMLGNBQVU7QUFITCxJQURFO0FBTVIsVUFBTzs7O0FBR04sYUFBUyxtQkFBVztBQUNuQixTQUFLLFNBQVMsbUJBQVQsSUFBZ0MsS0FBSyxLQUExQyxFQUFrRDtBQUNqRCxXQUFLLEtBQUw7QUFDQSxhQUFPLEtBQVA7QUFDQTtBQUNELEtBUks7QUFTTixrQkFBYztBQVRSLElBTkM7QUFpQlIsU0FBTTtBQUNMLGFBQVMsbUJBQVc7QUFDbkIsU0FBSyxTQUFTLG1CQUFULElBQWdDLEtBQUssSUFBMUMsRUFBaUQ7QUFDaEQsV0FBSyxJQUFMO0FBQ0EsYUFBTyxLQUFQO0FBQ0E7QUFDRCxLQU5JO0FBT0wsa0JBQWM7QUFQVCxJQWpCRTtBQTBCUixVQUFPOzs7QUFHTixhQUFTLG1CQUFXO0FBQ25CLFNBQUssS0FBSyxJQUFMLEtBQWMsVUFBZCxJQUE0QixLQUFLLEtBQWpDLElBQTBDLE9BQU8sUUFBUCxDQUFpQixJQUFqQixFQUF1QixPQUF2QixDQUEvQyxFQUFrRjtBQUNqRixXQUFLLEtBQUw7QUFDQSxhQUFPLEtBQVA7QUFDQTtBQUNELEtBUks7OztBQVdOLGNBQVUsa0JBQVUsS0FBVixFQUFrQjtBQUMzQixZQUFPLE9BQU8sUUFBUCxDQUFpQixNQUFNLE1BQXZCLEVBQStCLEdBQS9CLENBQVA7QUFDQTtBQWJLLElBMUJDOztBQTBDUixpQkFBYztBQUNiLGtCQUFjLHNCQUFVLEtBQVYsRUFBa0I7Ozs7QUFJL0IsU0FBSyxNQUFNLE1BQU4sS0FBaUIsU0FBakIsSUFBOEIsTUFBTSxhQUF6QyxFQUF5RDtBQUN4RCxZQUFNLGFBQU4sQ0FBb0IsV0FBcEIsR0FBa0MsTUFBTSxNQUF4QztBQUNBO0FBQ0Q7QUFSWTtBQTFDTjtBQXJZSyxFQUFmOztBQTRiQSxRQUFPLFdBQVAsR0FBcUIsVUFBVSxJQUFWLEVBQWdCLElBQWhCLEVBQXNCLE1BQXRCLEVBQStCOzs7QUFHbkQsTUFBSyxLQUFLLG1CQUFWLEVBQWdDO0FBQy9CLFFBQUssbUJBQUwsQ0FBMEIsSUFBMUIsRUFBZ0MsTUFBaEM7QUFDQTtBQUNELEVBTkQ7O0FBUUEsUUFBTyxLQUFQLEdBQWUsVUFBVSxHQUFWLEVBQWUsS0FBZixFQUF1Qjs7O0FBR3JDLE1BQUssRUFBRyxnQkFBZ0IsT0FBTyxLQUExQixDQUFMLEVBQXlDO0FBQ3hDLFVBQU8sSUFBSSxPQUFPLEtBQVgsQ0FBa0IsR0FBbEIsRUFBdUIsS0FBdkIsQ0FBUDtBQUNBOzs7QUFHRCxNQUFLLE9BQU8sSUFBSSxJQUFoQixFQUF1QjtBQUN0QixRQUFLLGFBQUwsR0FBcUIsR0FBckI7QUFDQSxRQUFLLElBQUwsR0FBWSxJQUFJLElBQWhCOzs7O0FBSUEsUUFBSyxrQkFBTCxHQUEwQixJQUFJLGdCQUFKLElBQ3hCLElBQUksZ0JBQUosS0FBeUIsU0FBekI7OztBQUdBLE9BQUksV0FBSixLQUFvQixLQUpJLEdBS3pCLFVBTHlCLEdBTXpCLFdBTkQ7OztBQVNBLEdBZkQsTUFlTztBQUNOLFNBQUssSUFBTCxHQUFZLEdBQVo7QUFDQTs7O0FBR0QsTUFBSyxLQUFMLEVBQWE7QUFDWixVQUFPLE1BQVAsQ0FBZSxJQUFmLEVBQXFCLEtBQXJCO0FBQ0E7OztBQUdELE9BQUssU0FBTCxHQUFpQixPQUFPLElBQUksU0FBWCxJQUF3QixPQUFPLEdBQVAsRUFBekM7OztBQUdBLE9BQU0sT0FBTyxPQUFiLElBQXlCLElBQXpCO0FBQ0EsRUFyQ0Q7Ozs7QUF5Q0EsUUFBTyxLQUFQLENBQWEsU0FBYixHQUF5QjtBQUN4QixlQUFhLE9BQU8sS0FESTtBQUV4QixzQkFBb0IsV0FGSTtBQUd4Qix3QkFBc0IsV0FIRTtBQUl4QixpQ0FBK0IsV0FKUDtBQUt4QixlQUFhLEtBTFc7O0FBT3hCLGtCQUFnQiwwQkFBVztBQUMxQixPQUFJLElBQUksS0FBSyxhQUFiOztBQUVBLFFBQUssa0JBQUwsR0FBMEIsVUFBMUI7O0FBRUEsT0FBSyxLQUFLLENBQUMsS0FBSyxXQUFoQixFQUE4QjtBQUM3QixNQUFFLGNBQUY7QUFDQTtBQUNELEdBZnVCO0FBZ0J4QixtQkFBaUIsMkJBQVc7QUFDM0IsT0FBSSxJQUFJLEtBQUssYUFBYjs7QUFFQSxRQUFLLG9CQUFMLEdBQTRCLFVBQTVCOztBQUVBLE9BQUssS0FBSyxDQUFDLEtBQUssV0FBaEIsRUFBOEI7QUFDN0IsTUFBRSxlQUFGO0FBQ0E7QUFDRCxHQXhCdUI7QUF5QnhCLDRCQUEwQixvQ0FBVztBQUNwQyxPQUFJLElBQUksS0FBSyxhQUFiOztBQUVBLFFBQUssNkJBQUwsR0FBcUMsVUFBckM7O0FBRUEsT0FBSyxLQUFLLENBQUMsS0FBSyxXQUFoQixFQUE4QjtBQUM3QixNQUFFLHdCQUFGO0FBQ0E7O0FBRUQsUUFBSyxlQUFMO0FBQ0E7QUFuQ3VCLEVBQXpCOzs7Ozs7Ozs7O0FBOENBLFFBQU8sSUFBUCxDQUFhO0FBQ1osY0FBWSxXQURBO0FBRVosY0FBWSxVQUZBO0FBR1osZ0JBQWMsYUFIRjtBQUlaLGdCQUFjO0FBSkYsRUFBYixFQUtHLFVBQVUsSUFBVixFQUFnQixHQUFoQixFQUFzQjtBQUN4QixTQUFPLEtBQVAsQ0FBYSxPQUFiLENBQXNCLElBQXRCLElBQStCO0FBQzlCLGlCQUFjLEdBRGdCO0FBRTlCLGFBQVUsR0FGb0I7O0FBSTlCLFdBQVEsZ0JBQVUsS0FBVixFQUFrQjtBQUN6QixRQUFJLEdBQUo7UUFDQyxTQUFTLElBRFY7UUFFQyxVQUFVLE1BQU0sYUFGakI7UUFHQyxZQUFZLE1BQU0sU0FIbkI7Ozs7QUFPQSxRQUFLLENBQUMsT0FBRCxJQUFjLFlBQVksTUFBWixJQUFzQixDQUFDLE9BQU8sUUFBUCxDQUFpQixNQUFqQixFQUF5QixPQUF6QixDQUExQyxFQUFpRjtBQUNoRixXQUFNLElBQU4sR0FBYSxVQUFVLFFBQXZCO0FBQ0EsV0FBTSxVQUFVLE9BQVYsQ0FBa0IsS0FBbEIsQ0FBeUIsSUFBekIsRUFBK0IsU0FBL0IsQ0FBTjtBQUNBLFdBQU0sSUFBTixHQUFhLEdBQWI7QUFDQTtBQUNELFdBQU8sR0FBUDtBQUNBO0FBbEI2QixHQUEvQjtBQW9CQSxFQTFCRDs7QUE0QkEsUUFBTyxFQUFQLENBQVUsTUFBVixDQUFrQjtBQUNqQixNQUFJLFlBQVUsS0FBVixFQUFpQixRQUFqQixFQUEyQixJQUEzQixFQUFpQyxFQUFqQyxFQUFzQztBQUN6QyxVQUFPLElBQUksSUFBSixFQUFVLEtBQVYsRUFBaUIsUUFBakIsRUFBMkIsSUFBM0IsRUFBaUMsRUFBakMsQ0FBUDtBQUNBLEdBSGdCO0FBSWpCLE9BQUssYUFBVSxLQUFWLEVBQWlCLFFBQWpCLEVBQTJCLElBQTNCLEVBQWlDLEVBQWpDLEVBQXNDO0FBQzFDLFVBQU8sSUFBSSxJQUFKLEVBQVUsS0FBVixFQUFpQixRQUFqQixFQUEyQixJQUEzQixFQUFpQyxFQUFqQyxFQUFxQyxDQUFyQyxDQUFQO0FBQ0EsR0FOZ0I7QUFPakIsT0FBSyxhQUFVLEtBQVYsRUFBaUIsUUFBakIsRUFBMkIsRUFBM0IsRUFBZ0M7QUFDcEMsT0FBSSxTQUFKLEVBQWUsSUFBZjtBQUNBLE9BQUssU0FBUyxNQUFNLGNBQWYsSUFBaUMsTUFBTSxTQUE1QyxFQUF3RDs7O0FBR3ZELGdCQUFZLE1BQU0sU0FBbEI7QUFDQSxXQUFRLE1BQU0sY0FBZCxFQUErQixHQUEvQixDQUNDLFVBQVUsU0FBVixHQUNDLFVBQVUsUUFBVixHQUFxQixHQUFyQixHQUEyQixVQUFVLFNBRHRDLEdBRUMsVUFBVSxRQUhaLEVBSUMsVUFBVSxRQUpYLEVBS0MsVUFBVSxPQUxYO0FBT0EsV0FBTyxJQUFQO0FBQ0E7QUFDRCxPQUFLLFFBQU8sS0FBUCx5Q0FBTyxLQUFQLE9BQWlCLFFBQXRCLEVBQWlDOzs7QUFHaEMsU0FBTSxJQUFOLElBQWMsS0FBZCxFQUFzQjtBQUNyQixVQUFLLEdBQUwsQ0FBVSxJQUFWLEVBQWdCLFFBQWhCLEVBQTBCLE1BQU8sSUFBUCxDQUExQjtBQUNBO0FBQ0QsV0FBTyxJQUFQO0FBQ0E7QUFDRCxPQUFLLGFBQWEsS0FBYixJQUFzQixPQUFPLFFBQVAsS0FBb0IsVUFBL0MsRUFBNEQ7OztBQUczRCxTQUFLLFFBQUw7QUFDQSxlQUFXLFNBQVg7QUFDQTtBQUNELE9BQUssT0FBTyxLQUFaLEVBQW9CO0FBQ25CLFNBQUssV0FBTDtBQUNBO0FBQ0QsVUFBTyxLQUFLLElBQUwsQ0FBVyxZQUFXO0FBQzVCLFdBQU8sS0FBUCxDQUFhLE1BQWIsQ0FBcUIsSUFBckIsRUFBMkIsS0FBM0IsRUFBa0MsRUFBbEMsRUFBc0MsUUFBdEM7QUFDQSxJQUZNLENBQVA7QUFHQTtBQTFDZ0IsRUFBbEI7O0FBNkNBLFFBQU8sTUFBUDtBQUNDLENBdHNCRCIsImZpbGUiOiJldmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4vY29yZVwiLFxuXHRcIi4vdmFyL2RvY3VtZW50XCIsXG5cdFwiLi92YXIvcm5vdHdoaXRlXCIsXG5cdFwiLi92YXIvc2xpY2VcIixcblx0XCIuL2RhdGEvdmFyL2RhdGFQcml2XCIsXG5cblx0XCIuL2NvcmUvaW5pdFwiLFxuXHRcIi4vc2VsZWN0b3JcIlxuXSwgZnVuY3Rpb24oIGpRdWVyeSwgZG9jdW1lbnQsIHJub3R3aGl0ZSwgc2xpY2UsIGRhdGFQcml2ICkge1xuXG52YXJcblx0cmtleUV2ZW50ID0gL15rZXkvLFxuXHRybW91c2VFdmVudCA9IC9eKD86bW91c2V8cG9pbnRlcnxjb250ZXh0bWVudXxkcmFnfGRyb3ApfGNsaWNrLyxcblx0cnR5cGVuYW1lc3BhY2UgPSAvXihbXi5dKikoPzpcXC4oLispfCkvO1xuXG5mdW5jdGlvbiByZXR1cm5UcnVlKCkge1xuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcmV0dXJuRmFsc2UoKSB7XG5cdHJldHVybiBmYWxzZTtcbn1cblxuLy8gU3VwcG9ydDogSUU5XG4vLyBTZWUgIzEzMzkzIGZvciBtb3JlIGluZm9cbmZ1bmN0aW9uIHNhZmVBY3RpdmVFbGVtZW50KCkge1xuXHR0cnkge1xuXHRcdHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXHR9IGNhdGNoICggZXJyICkgeyB9XG59XG5cbmZ1bmN0aW9uIG9uKCBlbGVtLCB0eXBlcywgc2VsZWN0b3IsIGRhdGEsIGZuLCBvbmUgKSB7XG5cdHZhciBvcmlnRm4sIHR5cGU7XG5cblx0Ly8gVHlwZXMgY2FuIGJlIGEgbWFwIG9mIHR5cGVzL2hhbmRsZXJzXG5cdGlmICggdHlwZW9mIHR5cGVzID09PSBcIm9iamVjdFwiICkge1xuXG5cdFx0Ly8gKCB0eXBlcy1PYmplY3QsIHNlbGVjdG9yLCBkYXRhIClcblx0XHRpZiAoIHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIiApIHtcblxuXHRcdFx0Ly8gKCB0eXBlcy1PYmplY3QsIGRhdGEgKVxuXHRcdFx0ZGF0YSA9IGRhdGEgfHwgc2VsZWN0b3I7XG5cdFx0XHRzZWxlY3RvciA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0Zm9yICggdHlwZSBpbiB0eXBlcyApIHtcblx0XHRcdG9uKCBlbGVtLCB0eXBlLCBzZWxlY3RvciwgZGF0YSwgdHlwZXNbIHR5cGUgXSwgb25lICk7XG5cdFx0fVxuXHRcdHJldHVybiBlbGVtO1xuXHR9XG5cblx0aWYgKCBkYXRhID09IG51bGwgJiYgZm4gPT0gbnVsbCApIHtcblxuXHRcdC8vICggdHlwZXMsIGZuIClcblx0XHRmbiA9IHNlbGVjdG9yO1xuXHRcdGRhdGEgPSBzZWxlY3RvciA9IHVuZGVmaW5lZDtcblx0fSBlbHNlIGlmICggZm4gPT0gbnVsbCApIHtcblx0XHRpZiAoIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIiApIHtcblxuXHRcdFx0Ly8gKCB0eXBlcywgc2VsZWN0b3IsIGZuIClcblx0XHRcdGZuID0gZGF0YTtcblx0XHRcdGRhdGEgPSB1bmRlZmluZWQ7XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gKCB0eXBlcywgZGF0YSwgZm4gKVxuXHRcdFx0Zm4gPSBkYXRhO1xuXHRcdFx0ZGF0YSA9IHNlbGVjdG9yO1xuXHRcdFx0c2VsZWN0b3IgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9XG5cdGlmICggZm4gPT09IGZhbHNlICkge1xuXHRcdGZuID0gcmV0dXJuRmFsc2U7XG5cdH0gZWxzZSBpZiAoICFmbiApIHtcblx0XHRyZXR1cm4gZWxlbTtcblx0fVxuXG5cdGlmICggb25lID09PSAxICkge1xuXHRcdG9yaWdGbiA9IGZuO1xuXHRcdGZuID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0XHQvLyBDYW4gdXNlIGFuIGVtcHR5IHNldCwgc2luY2UgZXZlbnQgY29udGFpbnMgdGhlIGluZm9cblx0XHRcdGpRdWVyeSgpLm9mZiggZXZlbnQgKTtcblx0XHRcdHJldHVybiBvcmlnRm4uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdH07XG5cblx0XHQvLyBVc2Ugc2FtZSBndWlkIHNvIGNhbGxlciBjYW4gcmVtb3ZlIHVzaW5nIG9yaWdGblxuXHRcdGZuLmd1aWQgPSBvcmlnRm4uZ3VpZCB8fCAoIG9yaWdGbi5ndWlkID0galF1ZXJ5Lmd1aWQrKyApO1xuXHR9XG5cdHJldHVybiBlbGVtLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGpRdWVyeS5ldmVudC5hZGQoIHRoaXMsIHR5cGVzLCBmbiwgZGF0YSwgc2VsZWN0b3IgKTtcblx0fSApO1xufVxuXG4vKlxuICogSGVscGVyIGZ1bmN0aW9ucyBmb3IgbWFuYWdpbmcgZXZlbnRzIC0tIG5vdCBwYXJ0IG9mIHRoZSBwdWJsaWMgaW50ZXJmYWNlLlxuICogUHJvcHMgdG8gRGVhbiBFZHdhcmRzJyBhZGRFdmVudCBsaWJyYXJ5IGZvciBtYW55IG9mIHRoZSBpZGVhcy5cbiAqL1xualF1ZXJ5LmV2ZW50ID0ge1xuXG5cdGdsb2JhbDoge30sXG5cblx0YWRkOiBmdW5jdGlvbiggZWxlbSwgdHlwZXMsIGhhbmRsZXIsIGRhdGEsIHNlbGVjdG9yICkge1xuXG5cdFx0dmFyIGhhbmRsZU9iakluLCBldmVudEhhbmRsZSwgdG1wLFxuXHRcdFx0ZXZlbnRzLCB0LCBoYW5kbGVPYmosXG5cdFx0XHRzcGVjaWFsLCBoYW5kbGVycywgdHlwZSwgbmFtZXNwYWNlcywgb3JpZ1R5cGUsXG5cdFx0XHRlbGVtRGF0YSA9IGRhdGFQcml2LmdldCggZWxlbSApO1xuXG5cdFx0Ly8gRG9uJ3QgYXR0YWNoIGV2ZW50cyB0byBub0RhdGEgb3IgdGV4dC9jb21tZW50IG5vZGVzIChidXQgYWxsb3cgcGxhaW4gb2JqZWN0cylcblx0XHRpZiAoICFlbGVtRGF0YSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDYWxsZXIgY2FuIHBhc3MgaW4gYW4gb2JqZWN0IG9mIGN1c3RvbSBkYXRhIGluIGxpZXUgb2YgdGhlIGhhbmRsZXJcblx0XHRpZiAoIGhhbmRsZXIuaGFuZGxlciApIHtcblx0XHRcdGhhbmRsZU9iakluID0gaGFuZGxlcjtcblx0XHRcdGhhbmRsZXIgPSBoYW5kbGVPYmpJbi5oYW5kbGVyO1xuXHRcdFx0c2VsZWN0b3IgPSBoYW5kbGVPYmpJbi5zZWxlY3Rvcjtcblx0XHR9XG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCB0aGUgaGFuZGxlciBoYXMgYSB1bmlxdWUgSUQsIHVzZWQgdG8gZmluZC9yZW1vdmUgaXQgbGF0ZXJcblx0XHRpZiAoICFoYW5kbGVyLmd1aWQgKSB7XG5cdFx0XHRoYW5kbGVyLmd1aWQgPSBqUXVlcnkuZ3VpZCsrO1xuXHRcdH1cblxuXHRcdC8vIEluaXQgdGhlIGVsZW1lbnQncyBldmVudCBzdHJ1Y3R1cmUgYW5kIG1haW4gaGFuZGxlciwgaWYgdGhpcyBpcyB0aGUgZmlyc3Rcblx0XHRpZiAoICEoIGV2ZW50cyA9IGVsZW1EYXRhLmV2ZW50cyApICkge1xuXHRcdFx0ZXZlbnRzID0gZWxlbURhdGEuZXZlbnRzID0ge307XG5cdFx0fVxuXHRcdGlmICggISggZXZlbnRIYW5kbGUgPSBlbGVtRGF0YS5oYW5kbGUgKSApIHtcblx0XHRcdGV2ZW50SGFuZGxlID0gZWxlbURhdGEuaGFuZGxlID0gZnVuY3Rpb24oIGUgKSB7XG5cblx0XHRcdFx0Ly8gRGlzY2FyZCB0aGUgc2Vjb25kIGV2ZW50IG9mIGEgalF1ZXJ5LmV2ZW50LnRyaWdnZXIoKSBhbmRcblx0XHRcdFx0Ly8gd2hlbiBhbiBldmVudCBpcyBjYWxsZWQgYWZ0ZXIgYSBwYWdlIGhhcyB1bmxvYWRlZFxuXHRcdFx0XHRyZXR1cm4gdHlwZW9mIGpRdWVyeSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBqUXVlcnkuZXZlbnQudHJpZ2dlcmVkICE9PSBlLnR5cGUgP1xuXHRcdFx0XHRcdGpRdWVyeS5ldmVudC5kaXNwYXRjaC5hcHBseSggZWxlbSwgYXJndW1lbnRzICkgOiB1bmRlZmluZWQ7XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIEhhbmRsZSBtdWx0aXBsZSBldmVudHMgc2VwYXJhdGVkIGJ5IGEgc3BhY2Vcblx0XHR0eXBlcyA9ICggdHlwZXMgfHwgXCJcIiApLm1hdGNoKCBybm90d2hpdGUgKSB8fCBbIFwiXCIgXTtcblx0XHR0ID0gdHlwZXMubGVuZ3RoO1xuXHRcdHdoaWxlICggdC0tICkge1xuXHRcdFx0dG1wID0gcnR5cGVuYW1lc3BhY2UuZXhlYyggdHlwZXNbIHQgXSApIHx8IFtdO1xuXHRcdFx0dHlwZSA9IG9yaWdUeXBlID0gdG1wWyAxIF07XG5cdFx0XHRuYW1lc3BhY2VzID0gKCB0bXBbIDIgXSB8fCBcIlwiICkuc3BsaXQoIFwiLlwiICkuc29ydCgpO1xuXG5cdFx0XHQvLyBUaGVyZSAqbXVzdCogYmUgYSB0eXBlLCBubyBhdHRhY2hpbmcgbmFtZXNwYWNlLW9ubHkgaGFuZGxlcnNcblx0XHRcdGlmICggIXR5cGUgKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiBldmVudCBjaGFuZ2VzIGl0cyB0eXBlLCB1c2UgdGhlIHNwZWNpYWwgZXZlbnQgaGFuZGxlcnMgZm9yIHRoZSBjaGFuZ2VkIHR5cGVcblx0XHRcdHNwZWNpYWwgPSBqUXVlcnkuZXZlbnQuc3BlY2lhbFsgdHlwZSBdIHx8IHt9O1xuXG5cdFx0XHQvLyBJZiBzZWxlY3RvciBkZWZpbmVkLCBkZXRlcm1pbmUgc3BlY2lhbCBldmVudCBhcGkgdHlwZSwgb3RoZXJ3aXNlIGdpdmVuIHR5cGVcblx0XHRcdHR5cGUgPSAoIHNlbGVjdG9yID8gc3BlY2lhbC5kZWxlZ2F0ZVR5cGUgOiBzcGVjaWFsLmJpbmRUeXBlICkgfHwgdHlwZTtcblxuXHRcdFx0Ly8gVXBkYXRlIHNwZWNpYWwgYmFzZWQgb24gbmV3bHkgcmVzZXQgdHlwZVxuXHRcdFx0c3BlY2lhbCA9IGpRdWVyeS5ldmVudC5zcGVjaWFsWyB0eXBlIF0gfHwge307XG5cblx0XHRcdC8vIGhhbmRsZU9iaiBpcyBwYXNzZWQgdG8gYWxsIGV2ZW50IGhhbmRsZXJzXG5cdFx0XHRoYW5kbGVPYmogPSBqUXVlcnkuZXh0ZW5kKCB7XG5cdFx0XHRcdHR5cGU6IHR5cGUsXG5cdFx0XHRcdG9yaWdUeXBlOiBvcmlnVHlwZSxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0aGFuZGxlcjogaGFuZGxlcixcblx0XHRcdFx0Z3VpZDogaGFuZGxlci5ndWlkLFxuXHRcdFx0XHRzZWxlY3Rvcjogc2VsZWN0b3IsXG5cdFx0XHRcdG5lZWRzQ29udGV4dDogc2VsZWN0b3IgJiYgalF1ZXJ5LmV4cHIubWF0Y2gubmVlZHNDb250ZXh0LnRlc3QoIHNlbGVjdG9yICksXG5cdFx0XHRcdG5hbWVzcGFjZTogbmFtZXNwYWNlcy5qb2luKCBcIi5cIiApXG5cdFx0XHR9LCBoYW5kbGVPYmpJbiApO1xuXG5cdFx0XHQvLyBJbml0IHRoZSBldmVudCBoYW5kbGVyIHF1ZXVlIGlmIHdlJ3JlIHRoZSBmaXJzdFxuXHRcdFx0aWYgKCAhKCBoYW5kbGVycyA9IGV2ZW50c1sgdHlwZSBdICkgKSB7XG5cdFx0XHRcdGhhbmRsZXJzID0gZXZlbnRzWyB0eXBlIF0gPSBbXTtcblx0XHRcdFx0aGFuZGxlcnMuZGVsZWdhdGVDb3VudCA9IDA7XG5cblx0XHRcdFx0Ly8gT25seSB1c2UgYWRkRXZlbnRMaXN0ZW5lciBpZiB0aGUgc3BlY2lhbCBldmVudHMgaGFuZGxlciByZXR1cm5zIGZhbHNlXG5cdFx0XHRcdGlmICggIXNwZWNpYWwuc2V0dXAgfHxcblx0XHRcdFx0XHRzcGVjaWFsLnNldHVwLmNhbGwoIGVsZW0sIGRhdGEsIG5hbWVzcGFjZXMsIGV2ZW50SGFuZGxlICkgPT09IGZhbHNlICkge1xuXG5cdFx0XHRcdFx0aWYgKCBlbGVtLmFkZEV2ZW50TGlzdGVuZXIgKSB7XG5cdFx0XHRcdFx0XHRlbGVtLmFkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGV2ZW50SGFuZGxlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICggc3BlY2lhbC5hZGQgKSB7XG5cdFx0XHRcdHNwZWNpYWwuYWRkLmNhbGwoIGVsZW0sIGhhbmRsZU9iaiApO1xuXG5cdFx0XHRcdGlmICggIWhhbmRsZU9iai5oYW5kbGVyLmd1aWQgKSB7XG5cdFx0XHRcdFx0aGFuZGxlT2JqLmhhbmRsZXIuZ3VpZCA9IGhhbmRsZXIuZ3VpZDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgdG8gdGhlIGVsZW1lbnQncyBoYW5kbGVyIGxpc3QsIGRlbGVnYXRlcyBpbiBmcm9udFxuXHRcdFx0aWYgKCBzZWxlY3RvciApIHtcblx0XHRcdFx0aGFuZGxlcnMuc3BsaWNlKCBoYW5kbGVycy5kZWxlZ2F0ZUNvdW50KyssIDAsIGhhbmRsZU9iaiApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aGFuZGxlcnMucHVzaCggaGFuZGxlT2JqICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEtlZXAgdHJhY2sgb2Ygd2hpY2ggZXZlbnRzIGhhdmUgZXZlciBiZWVuIHVzZWQsIGZvciBldmVudCBvcHRpbWl6YXRpb25cblx0XHRcdGpRdWVyeS5ldmVudC5nbG9iYWxbIHR5cGUgXSA9IHRydWU7XG5cdFx0fVxuXG5cdH0sXG5cblx0Ly8gRGV0YWNoIGFuIGV2ZW50IG9yIHNldCBvZiBldmVudHMgZnJvbSBhbiBlbGVtZW50XG5cdHJlbW92ZTogZnVuY3Rpb24oIGVsZW0sIHR5cGVzLCBoYW5kbGVyLCBzZWxlY3RvciwgbWFwcGVkVHlwZXMgKSB7XG5cblx0XHR2YXIgaiwgb3JpZ0NvdW50LCB0bXAsXG5cdFx0XHRldmVudHMsIHQsIGhhbmRsZU9iaixcblx0XHRcdHNwZWNpYWwsIGhhbmRsZXJzLCB0eXBlLCBuYW1lc3BhY2VzLCBvcmlnVHlwZSxcblx0XHRcdGVsZW1EYXRhID0gZGF0YVByaXYuaGFzRGF0YSggZWxlbSApICYmIGRhdGFQcml2LmdldCggZWxlbSApO1xuXG5cdFx0aWYgKCAhZWxlbURhdGEgfHwgISggZXZlbnRzID0gZWxlbURhdGEuZXZlbnRzICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gT25jZSBmb3IgZWFjaCB0eXBlLm5hbWVzcGFjZSBpbiB0eXBlczsgdHlwZSBtYXkgYmUgb21pdHRlZFxuXHRcdHR5cGVzID0gKCB0eXBlcyB8fCBcIlwiICkubWF0Y2goIHJub3R3aGl0ZSApIHx8IFsgXCJcIiBdO1xuXHRcdHQgPSB0eXBlcy5sZW5ndGg7XG5cdFx0d2hpbGUgKCB0LS0gKSB7XG5cdFx0XHR0bXAgPSBydHlwZW5hbWVzcGFjZS5leGVjKCB0eXBlc1sgdCBdICkgfHwgW107XG5cdFx0XHR0eXBlID0gb3JpZ1R5cGUgPSB0bXBbIDEgXTtcblx0XHRcdG5hbWVzcGFjZXMgPSAoIHRtcFsgMiBdIHx8IFwiXCIgKS5zcGxpdCggXCIuXCIgKS5zb3J0KCk7XG5cblx0XHRcdC8vIFVuYmluZCBhbGwgZXZlbnRzIChvbiB0aGlzIG5hbWVzcGFjZSwgaWYgcHJvdmlkZWQpIGZvciB0aGUgZWxlbWVudFxuXHRcdFx0aWYgKCAhdHlwZSApIHtcblx0XHRcdFx0Zm9yICggdHlwZSBpbiBldmVudHMgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnJlbW92ZSggZWxlbSwgdHlwZSArIHR5cGVzWyB0IF0sIGhhbmRsZXIsIHNlbGVjdG9yLCB0cnVlICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHNwZWNpYWwgPSBqUXVlcnkuZXZlbnQuc3BlY2lhbFsgdHlwZSBdIHx8IHt9O1xuXHRcdFx0dHlwZSA9ICggc2VsZWN0b3IgPyBzcGVjaWFsLmRlbGVnYXRlVHlwZSA6IHNwZWNpYWwuYmluZFR5cGUgKSB8fCB0eXBlO1xuXHRcdFx0aGFuZGxlcnMgPSBldmVudHNbIHR5cGUgXSB8fCBbXTtcblx0XHRcdHRtcCA9IHRtcFsgMiBdICYmXG5cdFx0XHRcdG5ldyBSZWdFeHAoIFwiKF58XFxcXC4pXCIgKyBuYW1lc3BhY2VzLmpvaW4oIFwiXFxcXC4oPzouKlxcXFwufClcIiApICsgXCIoXFxcXC58JClcIiApO1xuXG5cdFx0XHQvLyBSZW1vdmUgbWF0Y2hpbmcgZXZlbnRzXG5cdFx0XHRvcmlnQ291bnQgPSBqID0gaGFuZGxlcnMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKCBqLS0gKSB7XG5cdFx0XHRcdGhhbmRsZU9iaiA9IGhhbmRsZXJzWyBqIF07XG5cblx0XHRcdFx0aWYgKCAoIG1hcHBlZFR5cGVzIHx8IG9yaWdUeXBlID09PSBoYW5kbGVPYmoub3JpZ1R5cGUgKSAmJlxuXHRcdFx0XHRcdCggIWhhbmRsZXIgfHwgaGFuZGxlci5ndWlkID09PSBoYW5kbGVPYmouZ3VpZCApICYmXG5cdFx0XHRcdFx0KCAhdG1wIHx8IHRtcC50ZXN0KCBoYW5kbGVPYmoubmFtZXNwYWNlICkgKSAmJlxuXHRcdFx0XHRcdCggIXNlbGVjdG9yIHx8IHNlbGVjdG9yID09PSBoYW5kbGVPYmouc2VsZWN0b3IgfHxcblx0XHRcdFx0XHRcdHNlbGVjdG9yID09PSBcIioqXCIgJiYgaGFuZGxlT2JqLnNlbGVjdG9yICkgKSB7XG5cdFx0XHRcdFx0aGFuZGxlcnMuc3BsaWNlKCBqLCAxICk7XG5cblx0XHRcdFx0XHRpZiAoIGhhbmRsZU9iai5zZWxlY3RvciApIHtcblx0XHRcdFx0XHRcdGhhbmRsZXJzLmRlbGVnYXRlQ291bnQtLTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCBzcGVjaWFsLnJlbW92ZSApIHtcblx0XHRcdFx0XHRcdHNwZWNpYWwucmVtb3ZlLmNhbGwoIGVsZW0sIGhhbmRsZU9iaiApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZW1vdmUgZ2VuZXJpYyBldmVudCBoYW5kbGVyIGlmIHdlIHJlbW92ZWQgc29tZXRoaW5nIGFuZCBubyBtb3JlIGhhbmRsZXJzIGV4aXN0XG5cdFx0XHQvLyAoYXZvaWRzIHBvdGVudGlhbCBmb3IgZW5kbGVzcyByZWN1cnNpb24gZHVyaW5nIHJlbW92YWwgb2Ygc3BlY2lhbCBldmVudCBoYW5kbGVycylcblx0XHRcdGlmICggb3JpZ0NvdW50ICYmICFoYW5kbGVycy5sZW5ndGggKSB7XG5cdFx0XHRcdGlmICggIXNwZWNpYWwudGVhcmRvd24gfHxcblx0XHRcdFx0XHRzcGVjaWFsLnRlYXJkb3duLmNhbGwoIGVsZW0sIG5hbWVzcGFjZXMsIGVsZW1EYXRhLmhhbmRsZSApID09PSBmYWxzZSApIHtcblxuXHRcdFx0XHRcdGpRdWVyeS5yZW1vdmVFdmVudCggZWxlbSwgdHlwZSwgZWxlbURhdGEuaGFuZGxlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkZWxldGUgZXZlbnRzWyB0eXBlIF07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gUmVtb3ZlIGRhdGEgYW5kIHRoZSBleHBhbmRvIGlmIGl0J3Mgbm8gbG9uZ2VyIHVzZWRcblx0XHRpZiAoIGpRdWVyeS5pc0VtcHR5T2JqZWN0KCBldmVudHMgKSApIHtcblx0XHRcdGRhdGFQcml2LnJlbW92ZSggZWxlbSwgXCJoYW5kbGUgZXZlbnRzXCIgKTtcblx0XHR9XG5cdH0sXG5cblx0ZGlzcGF0Y2g6IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdC8vIE1ha2UgYSB3cml0YWJsZSBqUXVlcnkuRXZlbnQgZnJvbSB0aGUgbmF0aXZlIGV2ZW50IG9iamVjdFxuXHRcdGV2ZW50ID0galF1ZXJ5LmV2ZW50LmZpeCggZXZlbnQgKTtcblxuXHRcdHZhciBpLCBqLCByZXQsIG1hdGNoZWQsIGhhbmRsZU9iaixcblx0XHRcdGhhbmRsZXJRdWV1ZSA9IFtdLFxuXHRcdFx0YXJncyA9IHNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuXHRcdFx0aGFuZGxlcnMgPSAoIGRhdGFQcml2LmdldCggdGhpcywgXCJldmVudHNcIiApIHx8IHt9IClbIGV2ZW50LnR5cGUgXSB8fCBbXSxcblx0XHRcdHNwZWNpYWwgPSBqUXVlcnkuZXZlbnQuc3BlY2lhbFsgZXZlbnQudHlwZSBdIHx8IHt9O1xuXG5cdFx0Ly8gVXNlIHRoZSBmaXgtZWQgalF1ZXJ5LkV2ZW50IHJhdGhlciB0aGFuIHRoZSAocmVhZC1vbmx5KSBuYXRpdmUgZXZlbnRcblx0XHRhcmdzWyAwIF0gPSBldmVudDtcblx0XHRldmVudC5kZWxlZ2F0ZVRhcmdldCA9IHRoaXM7XG5cblx0XHQvLyBDYWxsIHRoZSBwcmVEaXNwYXRjaCBob29rIGZvciB0aGUgbWFwcGVkIHR5cGUsIGFuZCBsZXQgaXQgYmFpbCBpZiBkZXNpcmVkXG5cdFx0aWYgKCBzcGVjaWFsLnByZURpc3BhdGNoICYmIHNwZWNpYWwucHJlRGlzcGF0Y2guY2FsbCggdGhpcywgZXZlbnQgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZXJtaW5lIGhhbmRsZXJzXG5cdFx0aGFuZGxlclF1ZXVlID0galF1ZXJ5LmV2ZW50LmhhbmRsZXJzLmNhbGwoIHRoaXMsIGV2ZW50LCBoYW5kbGVycyApO1xuXG5cdFx0Ly8gUnVuIGRlbGVnYXRlcyBmaXJzdDsgdGhleSBtYXkgd2FudCB0byBzdG9wIHByb3BhZ2F0aW9uIGJlbmVhdGggdXNcblx0XHRpID0gMDtcblx0XHR3aGlsZSAoICggbWF0Y2hlZCA9IGhhbmRsZXJRdWV1ZVsgaSsrIF0gKSAmJiAhZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSApIHtcblx0XHRcdGV2ZW50LmN1cnJlbnRUYXJnZXQgPSBtYXRjaGVkLmVsZW07XG5cblx0XHRcdGogPSAwO1xuXHRcdFx0d2hpbGUgKCAoIGhhbmRsZU9iaiA9IG1hdGNoZWQuaGFuZGxlcnNbIGorKyBdICkgJiZcblx0XHRcdFx0IWV2ZW50LmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKCkgKSB7XG5cblx0XHRcdFx0Ly8gVHJpZ2dlcmVkIGV2ZW50IG11c3QgZWl0aGVyIDEpIGhhdmUgbm8gbmFtZXNwYWNlLCBvciAyKSBoYXZlIG5hbWVzcGFjZShzKVxuXHRcdFx0XHQvLyBhIHN1YnNldCBvciBlcXVhbCB0byB0aG9zZSBpbiB0aGUgYm91bmQgZXZlbnQgKGJvdGggY2FuIGhhdmUgbm8gbmFtZXNwYWNlKS5cblx0XHRcdFx0aWYgKCAhZXZlbnQucm5hbWVzcGFjZSB8fCBldmVudC5ybmFtZXNwYWNlLnRlc3QoIGhhbmRsZU9iai5uYW1lc3BhY2UgKSApIHtcblxuXHRcdFx0XHRcdGV2ZW50LmhhbmRsZU9iaiA9IGhhbmRsZU9iajtcblx0XHRcdFx0XHRldmVudC5kYXRhID0gaGFuZGxlT2JqLmRhdGE7XG5cblx0XHRcdFx0XHRyZXQgPSAoICggalF1ZXJ5LmV2ZW50LnNwZWNpYWxbIGhhbmRsZU9iai5vcmlnVHlwZSBdIHx8IHt9ICkuaGFuZGxlIHx8XG5cdFx0XHRcdFx0XHRoYW5kbGVPYmouaGFuZGxlciApLmFwcGx5KCBtYXRjaGVkLmVsZW0sIGFyZ3MgKTtcblxuXHRcdFx0XHRcdGlmICggcmV0ICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0XHRpZiAoICggZXZlbnQucmVzdWx0ID0gcmV0ICkgPT09IGZhbHNlICkge1xuXHRcdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDYWxsIHRoZSBwb3N0RGlzcGF0Y2ggaG9vayBmb3IgdGhlIG1hcHBlZCB0eXBlXG5cdFx0aWYgKCBzcGVjaWFsLnBvc3REaXNwYXRjaCApIHtcblx0XHRcdHNwZWNpYWwucG9zdERpc3BhdGNoLmNhbGwoIHRoaXMsIGV2ZW50ICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGV2ZW50LnJlc3VsdDtcblx0fSxcblxuXHRoYW5kbGVyczogZnVuY3Rpb24oIGV2ZW50LCBoYW5kbGVycyApIHtcblx0XHR2YXIgaSwgbWF0Y2hlcywgc2VsLCBoYW5kbGVPYmosXG5cdFx0XHRoYW5kbGVyUXVldWUgPSBbXSxcblx0XHRcdGRlbGVnYXRlQ291bnQgPSBoYW5kbGVycy5kZWxlZ2F0ZUNvdW50LFxuXHRcdFx0Y3VyID0gZXZlbnQudGFyZ2V0O1xuXG5cdFx0Ly8gU3VwcG9ydCAoYXQgbGVhc3QpOiBDaHJvbWUsIElFOVxuXHRcdC8vIEZpbmQgZGVsZWdhdGUgaGFuZGxlcnNcblx0XHQvLyBCbGFjay1ob2xlIFNWRyA8dXNlPiBpbnN0YW5jZSB0cmVlcyAoIzEzMTgwKVxuXHRcdC8vXG5cdFx0Ly8gU3VwcG9ydDogRmlyZWZveDw9NDIrXG5cdFx0Ly8gQXZvaWQgbm9uLWxlZnQtY2xpY2sgaW4gRkYgYnV0IGRvbid0IGJsb2NrIElFIHJhZGlvIGV2ZW50cyAoIzM4NjEsIGdoLTIzNDMpXG5cdFx0aWYgKCBkZWxlZ2F0ZUNvdW50ICYmIGN1ci5ub2RlVHlwZSAmJlxuXHRcdFx0KCBldmVudC50eXBlICE9PSBcImNsaWNrXCIgfHwgaXNOYU4oIGV2ZW50LmJ1dHRvbiApIHx8IGV2ZW50LmJ1dHRvbiA8IDEgKSApIHtcblxuXHRcdFx0Zm9yICggOyBjdXIgIT09IHRoaXM7IGN1ciA9IGN1ci5wYXJlbnROb2RlIHx8IHRoaXMgKSB7XG5cblx0XHRcdFx0Ly8gRG9uJ3QgY2hlY2sgbm9uLWVsZW1lbnRzICgjMTMyMDgpXG5cdFx0XHRcdC8vIERvbid0IHByb2Nlc3MgY2xpY2tzIG9uIGRpc2FibGVkIGVsZW1lbnRzICgjNjkxMSwgIzgxNjUsICMxMTM4MiwgIzExNzY0KVxuXHRcdFx0XHRpZiAoIGN1ci5ub2RlVHlwZSA9PT0gMSAmJiAoIGN1ci5kaXNhYmxlZCAhPT0gdHJ1ZSB8fCBldmVudC50eXBlICE9PSBcImNsaWNrXCIgKSApIHtcblx0XHRcdFx0XHRtYXRjaGVzID0gW107XG5cdFx0XHRcdFx0Zm9yICggaSA9IDA7IGkgPCBkZWxlZ2F0ZUNvdW50OyBpKysgKSB7XG5cdFx0XHRcdFx0XHRoYW5kbGVPYmogPSBoYW5kbGVyc1sgaSBdO1xuXG5cdFx0XHRcdFx0XHQvLyBEb24ndCBjb25mbGljdCB3aXRoIE9iamVjdC5wcm90b3R5cGUgcHJvcGVydGllcyAoIzEzMjAzKVxuXHRcdFx0XHRcdFx0c2VsID0gaGFuZGxlT2JqLnNlbGVjdG9yICsgXCIgXCI7XG5cblx0XHRcdFx0XHRcdGlmICggbWF0Y2hlc1sgc2VsIF0gPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHRcdFx0bWF0Y2hlc1sgc2VsIF0gPSBoYW5kbGVPYmoubmVlZHNDb250ZXh0ID9cblx0XHRcdFx0XHRcdFx0XHRqUXVlcnkoIHNlbCwgdGhpcyApLmluZGV4KCBjdXIgKSA+IC0xIDpcblx0XHRcdFx0XHRcdFx0XHRqUXVlcnkuZmluZCggc2VsLCB0aGlzLCBudWxsLCBbIGN1ciBdICkubGVuZ3RoO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCBtYXRjaGVzWyBzZWwgXSApIHtcblx0XHRcdFx0XHRcdFx0bWF0Y2hlcy5wdXNoKCBoYW5kbGVPYmogKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCBtYXRjaGVzLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdGhhbmRsZXJRdWV1ZS5wdXNoKCB7IGVsZW06IGN1ciwgaGFuZGxlcnM6IG1hdGNoZXMgfSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEFkZCB0aGUgcmVtYWluaW5nIChkaXJlY3RseS1ib3VuZCkgaGFuZGxlcnNcblx0XHRpZiAoIGRlbGVnYXRlQ291bnQgPCBoYW5kbGVycy5sZW5ndGggKSB7XG5cdFx0XHRoYW5kbGVyUXVldWUucHVzaCggeyBlbGVtOiB0aGlzLCBoYW5kbGVyczogaGFuZGxlcnMuc2xpY2UoIGRlbGVnYXRlQ291bnQgKSB9ICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhhbmRsZXJRdWV1ZTtcblx0fSxcblxuXHQvLyBJbmNsdWRlcyBzb21lIGV2ZW50IHByb3BzIHNoYXJlZCBieSBLZXlFdmVudCBhbmQgTW91c2VFdmVudFxuXHRwcm9wczogKCBcImFsdEtleSBidWJibGVzIGNhbmNlbGFibGUgY3RybEtleSBjdXJyZW50VGFyZ2V0IGRldGFpbCBldmVudFBoYXNlIFwiICtcblx0XHRcIm1ldGFLZXkgcmVsYXRlZFRhcmdldCBzaGlmdEtleSB0YXJnZXQgdGltZVN0YW1wIHZpZXcgd2hpY2hcIiApLnNwbGl0KCBcIiBcIiApLFxuXG5cdGZpeEhvb2tzOiB7fSxcblxuXHRrZXlIb29rczoge1xuXHRcdHByb3BzOiBcImNoYXIgY2hhckNvZGUga2V5IGtleUNvZGVcIi5zcGxpdCggXCIgXCIgKSxcblx0XHRmaWx0ZXI6IGZ1bmN0aW9uKCBldmVudCwgb3JpZ2luYWwgKSB7XG5cblx0XHRcdC8vIEFkZCB3aGljaCBmb3Iga2V5IGV2ZW50c1xuXHRcdFx0aWYgKCBldmVudC53aGljaCA9PSBudWxsICkge1xuXHRcdFx0XHRldmVudC53aGljaCA9IG9yaWdpbmFsLmNoYXJDb2RlICE9IG51bGwgPyBvcmlnaW5hbC5jaGFyQ29kZSA6IG9yaWdpbmFsLmtleUNvZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBldmVudDtcblx0XHR9XG5cdH0sXG5cblx0bW91c2VIb29rczoge1xuXHRcdHByb3BzOiAoIFwiYnV0dG9uIGJ1dHRvbnMgY2xpZW50WCBjbGllbnRZIG9mZnNldFggb2Zmc2V0WSBwYWdlWCBwYWdlWSBcIiArXG5cdFx0XHRcInNjcmVlblggc2NyZWVuWSB0b0VsZW1lbnRcIiApLnNwbGl0KCBcIiBcIiApLFxuXHRcdGZpbHRlcjogZnVuY3Rpb24oIGV2ZW50LCBvcmlnaW5hbCApIHtcblx0XHRcdHZhciBldmVudERvYywgZG9jLCBib2R5LFxuXHRcdFx0XHRidXR0b24gPSBvcmlnaW5hbC5idXR0b247XG5cblx0XHRcdC8vIENhbGN1bGF0ZSBwYWdlWC9ZIGlmIG1pc3NpbmcgYW5kIGNsaWVudFgvWSBhdmFpbGFibGVcblx0XHRcdGlmICggZXZlbnQucGFnZVggPT0gbnVsbCAmJiBvcmlnaW5hbC5jbGllbnRYICE9IG51bGwgKSB7XG5cdFx0XHRcdGV2ZW50RG9jID0gZXZlbnQudGFyZ2V0Lm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG5cdFx0XHRcdGRvYyA9IGV2ZW50RG9jLmRvY3VtZW50RWxlbWVudDtcblx0XHRcdFx0Ym9keSA9IGV2ZW50RG9jLmJvZHk7XG5cblx0XHRcdFx0ZXZlbnQucGFnZVggPSBvcmlnaW5hbC5jbGllbnRYICtcblx0XHRcdFx0XHQoIGRvYyAmJiBkb2Muc2Nyb2xsTGVmdCB8fCBib2R5ICYmIGJvZHkuc2Nyb2xsTGVmdCB8fCAwICkgLVxuXHRcdFx0XHRcdCggZG9jICYmIGRvYy5jbGllbnRMZWZ0IHx8IGJvZHkgJiYgYm9keS5jbGllbnRMZWZ0IHx8IDAgKTtcblx0XHRcdFx0ZXZlbnQucGFnZVkgPSBvcmlnaW5hbC5jbGllbnRZICtcblx0XHRcdFx0XHQoIGRvYyAmJiBkb2Muc2Nyb2xsVG9wICB8fCBib2R5ICYmIGJvZHkuc2Nyb2xsVG9wICB8fCAwICkgLVxuXHRcdFx0XHRcdCggZG9jICYmIGRvYy5jbGllbnRUb3AgIHx8IGJvZHkgJiYgYm9keS5jbGllbnRUb3AgIHx8IDAgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWRkIHdoaWNoIGZvciBjbGljazogMSA9PT0gbGVmdDsgMiA9PT0gbWlkZGxlOyAzID09PSByaWdodFxuXHRcdFx0Ly8gTm90ZTogYnV0dG9uIGlzIG5vdCBub3JtYWxpemVkLCBzbyBkb24ndCB1c2UgaXRcblx0XHRcdGlmICggIWV2ZW50LndoaWNoICYmIGJ1dHRvbiAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRldmVudC53aGljaCA9ICggYnV0dG9uICYgMSA/IDEgOiAoIGJ1dHRvbiAmIDIgPyAzIDogKCBidXR0b24gJiA0ID8gMiA6IDAgKSApICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBldmVudDtcblx0XHR9XG5cdH0sXG5cblx0Zml4OiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0aWYgKCBldmVudFsgalF1ZXJ5LmV4cGFuZG8gXSApIHtcblx0XHRcdHJldHVybiBldmVudDtcblx0XHR9XG5cblx0XHQvLyBDcmVhdGUgYSB3cml0YWJsZSBjb3B5IG9mIHRoZSBldmVudCBvYmplY3QgYW5kIG5vcm1hbGl6ZSBzb21lIHByb3BlcnRpZXNcblx0XHR2YXIgaSwgcHJvcCwgY29weSxcblx0XHRcdHR5cGUgPSBldmVudC50eXBlLFxuXHRcdFx0b3JpZ2luYWxFdmVudCA9IGV2ZW50LFxuXHRcdFx0Zml4SG9vayA9IHRoaXMuZml4SG9va3NbIHR5cGUgXTtcblxuXHRcdGlmICggIWZpeEhvb2sgKSB7XG5cdFx0XHR0aGlzLmZpeEhvb2tzWyB0eXBlIF0gPSBmaXhIb29rID1cblx0XHRcdFx0cm1vdXNlRXZlbnQudGVzdCggdHlwZSApID8gdGhpcy5tb3VzZUhvb2tzIDpcblx0XHRcdFx0cmtleUV2ZW50LnRlc3QoIHR5cGUgKSA/IHRoaXMua2V5SG9va3MgOlxuXHRcdFx0XHR7fTtcblx0XHR9XG5cdFx0Y29weSA9IGZpeEhvb2sucHJvcHMgPyB0aGlzLnByb3BzLmNvbmNhdCggZml4SG9vay5wcm9wcyApIDogdGhpcy5wcm9wcztcblxuXHRcdGV2ZW50ID0gbmV3IGpRdWVyeS5FdmVudCggb3JpZ2luYWxFdmVudCApO1xuXG5cdFx0aSA9IGNvcHkubGVuZ3RoO1xuXHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0cHJvcCA9IGNvcHlbIGkgXTtcblx0XHRcdGV2ZW50WyBwcm9wIF0gPSBvcmlnaW5hbEV2ZW50WyBwcm9wIF07XG5cdFx0fVxuXG5cdFx0Ly8gU3VwcG9ydDogQ29yZG92YSAyLjUgKFdlYktpdCkgKCMxMzI1NSlcblx0XHQvLyBBbGwgZXZlbnRzIHNob3VsZCBoYXZlIGEgdGFyZ2V0OyBDb3Jkb3ZhIGRldmljZXJlYWR5IGRvZXNuJ3Rcblx0XHRpZiAoICFldmVudC50YXJnZXQgKSB7XG5cdFx0XHRldmVudC50YXJnZXQgPSBkb2N1bWVudDtcblx0XHR9XG5cblx0XHQvLyBTdXBwb3J0OiBTYWZhcmkgNi4wKywgQ2hyb21lPDI4XG5cdFx0Ly8gVGFyZ2V0IHNob3VsZCBub3QgYmUgYSB0ZXh0IG5vZGUgKCM1MDQsICMxMzE0Mylcblx0XHRpZiAoIGV2ZW50LnRhcmdldC5ub2RlVHlwZSA9PT0gMyApIHtcblx0XHRcdGV2ZW50LnRhcmdldCA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlO1xuXHRcdH1cblxuXHRcdHJldHVybiBmaXhIb29rLmZpbHRlciA/IGZpeEhvb2suZmlsdGVyKCBldmVudCwgb3JpZ2luYWxFdmVudCApIDogZXZlbnQ7XG5cdH0sXG5cblx0c3BlY2lhbDoge1xuXHRcdGxvYWQ6IHtcblxuXHRcdFx0Ly8gUHJldmVudCB0cmlnZ2VyZWQgaW1hZ2UubG9hZCBldmVudHMgZnJvbSBidWJibGluZyB0byB3aW5kb3cubG9hZFxuXHRcdFx0bm9CdWJibGU6IHRydWVcblx0XHR9LFxuXHRcdGZvY3VzOiB7XG5cblx0XHRcdC8vIEZpcmUgbmF0aXZlIGV2ZW50IGlmIHBvc3NpYmxlIHNvIGJsdXIvZm9jdXMgc2VxdWVuY2UgaXMgY29ycmVjdFxuXHRcdFx0dHJpZ2dlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggdGhpcyAhPT0gc2FmZUFjdGl2ZUVsZW1lbnQoKSAmJiB0aGlzLmZvY3VzICkge1xuXHRcdFx0XHRcdHRoaXMuZm9jdXMoKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRkZWxlZ2F0ZVR5cGU6IFwiZm9jdXNpblwiXG5cdFx0fSxcblx0XHRibHVyOiB7XG5cdFx0XHR0cmlnZ2VyOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCB0aGlzID09PSBzYWZlQWN0aXZlRWxlbWVudCgpICYmIHRoaXMuYmx1ciApIHtcblx0XHRcdFx0XHR0aGlzLmJsdXIoKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRkZWxlZ2F0ZVR5cGU6IFwiZm9jdXNvdXRcIlxuXHRcdH0sXG5cdFx0Y2xpY2s6IHtcblxuXHRcdFx0Ly8gRm9yIGNoZWNrYm94LCBmaXJlIG5hdGl2ZSBldmVudCBzbyBjaGVja2VkIHN0YXRlIHdpbGwgYmUgcmlnaHRcblx0XHRcdHRyaWdnZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIHRoaXMudHlwZSA9PT0gXCJjaGVja2JveFwiICYmIHRoaXMuY2xpY2sgJiYgalF1ZXJ5Lm5vZGVOYW1lKCB0aGlzLCBcImlucHV0XCIgKSApIHtcblx0XHRcdFx0XHR0aGlzLmNsaWNrKCk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBGb3IgY3Jvc3MtYnJvd3NlciBjb25zaXN0ZW5jeSwgZG9uJ3QgZmlyZSBuYXRpdmUgLmNsaWNrKCkgb24gbGlua3Ncblx0XHRcdF9kZWZhdWx0OiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdHJldHVybiBqUXVlcnkubm9kZU5hbWUoIGV2ZW50LnRhcmdldCwgXCJhXCIgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0YmVmb3JldW5sb2FkOiB7XG5cdFx0XHRwb3N0RGlzcGF0Y2g6IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBGaXJlZm94IDIwK1xuXHRcdFx0XHQvLyBGaXJlZm94IGRvZXNuJ3QgYWxlcnQgaWYgdGhlIHJldHVyblZhbHVlIGZpZWxkIGlzIG5vdCBzZXQuXG5cdFx0XHRcdGlmICggZXZlbnQucmVzdWx0ICE9PSB1bmRlZmluZWQgJiYgZXZlbnQub3JpZ2luYWxFdmVudCApIHtcblx0XHRcdFx0XHRldmVudC5vcmlnaW5hbEV2ZW50LnJldHVyblZhbHVlID0gZXZlbnQucmVzdWx0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG5qUXVlcnkucmVtb3ZlRXZlbnQgPSBmdW5jdGlvbiggZWxlbSwgdHlwZSwgaGFuZGxlICkge1xuXG5cdC8vIFRoaXMgXCJpZlwiIGlzIG5lZWRlZCBmb3IgcGxhaW4gb2JqZWN0c1xuXHRpZiAoIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lciApIHtcblx0XHRlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGUsIGhhbmRsZSApO1xuXHR9XG59O1xuXG5qUXVlcnkuRXZlbnQgPSBmdW5jdGlvbiggc3JjLCBwcm9wcyApIHtcblxuXHQvLyBBbGxvdyBpbnN0YW50aWF0aW9uIHdpdGhvdXQgdGhlICduZXcnIGtleXdvcmRcblx0aWYgKCAhKCB0aGlzIGluc3RhbmNlb2YgalF1ZXJ5LkV2ZW50ICkgKSB7XG5cdFx0cmV0dXJuIG5ldyBqUXVlcnkuRXZlbnQoIHNyYywgcHJvcHMgKTtcblx0fVxuXG5cdC8vIEV2ZW50IG9iamVjdFxuXHRpZiAoIHNyYyAmJiBzcmMudHlwZSApIHtcblx0XHR0aGlzLm9yaWdpbmFsRXZlbnQgPSBzcmM7XG5cdFx0dGhpcy50eXBlID0gc3JjLnR5cGU7XG5cblx0XHQvLyBFdmVudHMgYnViYmxpbmcgdXAgdGhlIGRvY3VtZW50IG1heSBoYXZlIGJlZW4gbWFya2VkIGFzIHByZXZlbnRlZFxuXHRcdC8vIGJ5IGEgaGFuZGxlciBsb3dlciBkb3duIHRoZSB0cmVlOyByZWZsZWN0IHRoZSBjb3JyZWN0IHZhbHVlLlxuXHRcdHRoaXMuaXNEZWZhdWx0UHJldmVudGVkID0gc3JjLmRlZmF1bHRQcmV2ZW50ZWQgfHxcblx0XHRcdFx0c3JjLmRlZmF1bHRQcmV2ZW50ZWQgPT09IHVuZGVmaW5lZCAmJlxuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IEFuZHJvaWQ8NC4wXG5cdFx0XHRcdHNyYy5yZXR1cm5WYWx1ZSA9PT0gZmFsc2UgP1xuXHRcdFx0cmV0dXJuVHJ1ZSA6XG5cdFx0XHRyZXR1cm5GYWxzZTtcblxuXHQvLyBFdmVudCB0eXBlXG5cdH0gZWxzZSB7XG5cdFx0dGhpcy50eXBlID0gc3JjO1xuXHR9XG5cblx0Ly8gUHV0IGV4cGxpY2l0bHkgcHJvdmlkZWQgcHJvcGVydGllcyBvbnRvIHRoZSBldmVudCBvYmplY3Rcblx0aWYgKCBwcm9wcyApIHtcblx0XHRqUXVlcnkuZXh0ZW5kKCB0aGlzLCBwcm9wcyApO1xuXHR9XG5cblx0Ly8gQ3JlYXRlIGEgdGltZXN0YW1wIGlmIGluY29taW5nIGV2ZW50IGRvZXNuJ3QgaGF2ZSBvbmVcblx0dGhpcy50aW1lU3RhbXAgPSBzcmMgJiYgc3JjLnRpbWVTdGFtcCB8fCBqUXVlcnkubm93KCk7XG5cblx0Ly8gTWFyayBpdCBhcyBmaXhlZFxuXHR0aGlzWyBqUXVlcnkuZXhwYW5kbyBdID0gdHJ1ZTtcbn07XG5cbi8vIGpRdWVyeS5FdmVudCBpcyBiYXNlZCBvbiBET00zIEV2ZW50cyBhcyBzcGVjaWZpZWQgYnkgdGhlIEVDTUFTY3JpcHQgTGFuZ3VhZ2UgQmluZGluZ1xuLy8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMy9XRC1ET00tTGV2ZWwtMy1FdmVudHMtMjAwMzAzMzEvZWNtYS1zY3JpcHQtYmluZGluZy5odG1sXG5qUXVlcnkuRXZlbnQucHJvdG90eXBlID0ge1xuXHRjb25zdHJ1Y3RvcjogalF1ZXJ5LkV2ZW50LFxuXHRpc0RlZmF1bHRQcmV2ZW50ZWQ6IHJldHVybkZhbHNlLFxuXHRpc1Byb3BhZ2F0aW9uU3RvcHBlZDogcmV0dXJuRmFsc2UsXG5cdGlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkOiByZXR1cm5GYWxzZSxcblx0aXNTaW11bGF0ZWQ6IGZhbHNlLFxuXG5cdHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbigpIHtcblx0XHR2YXIgZSA9IHRoaXMub3JpZ2luYWxFdmVudDtcblxuXHRcdHRoaXMuaXNEZWZhdWx0UHJldmVudGVkID0gcmV0dXJuVHJ1ZTtcblxuXHRcdGlmICggZSAmJiAhdGhpcy5pc1NpbXVsYXRlZCApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cdH0sXG5cdHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGUgPSB0aGlzLm9yaWdpbmFsRXZlbnQ7XG5cblx0XHR0aGlzLmlzUHJvcGFnYXRpb25TdG9wcGVkID0gcmV0dXJuVHJ1ZTtcblxuXHRcdGlmICggZSAmJiAhdGhpcy5pc1NpbXVsYXRlZCApIHtcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXHR9LFxuXHRzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBlID0gdGhpcy5vcmlnaW5hbEV2ZW50O1xuXG5cdFx0dGhpcy5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCA9IHJldHVyblRydWU7XG5cblx0XHRpZiAoIGUgJiYgIXRoaXMuaXNTaW11bGF0ZWQgKSB7XG5cdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdH1cblxuXHRcdHRoaXMuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH1cbn07XG5cbi8vIENyZWF0ZSBtb3VzZWVudGVyL2xlYXZlIGV2ZW50cyB1c2luZyBtb3VzZW92ZXIvb3V0IGFuZCBldmVudC10aW1lIGNoZWNrc1xuLy8gc28gdGhhdCBldmVudCBkZWxlZ2F0aW9uIHdvcmtzIGluIGpRdWVyeS5cbi8vIERvIHRoZSBzYW1lIGZvciBwb2ludGVyZW50ZXIvcG9pbnRlcmxlYXZlIGFuZCBwb2ludGVyb3Zlci9wb2ludGVyb3V0XG4vL1xuLy8gU3VwcG9ydDogU2FmYXJpIDcgb25seVxuLy8gU2FmYXJpIHNlbmRzIG1vdXNlZW50ZXIgdG9vIG9mdGVuOyBzZWU6XG4vLyBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDcwMjU4XG4vLyBmb3IgdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBidWcgKGl0IGV4aXN0ZWQgaW4gb2xkZXIgQ2hyb21lIHZlcnNpb25zIGFzIHdlbGwpLlxualF1ZXJ5LmVhY2goIHtcblx0bW91c2VlbnRlcjogXCJtb3VzZW92ZXJcIixcblx0bW91c2VsZWF2ZTogXCJtb3VzZW91dFwiLFxuXHRwb2ludGVyZW50ZXI6IFwicG9pbnRlcm92ZXJcIixcblx0cG9pbnRlcmxlYXZlOiBcInBvaW50ZXJvdXRcIlxufSwgZnVuY3Rpb24oIG9yaWcsIGZpeCApIHtcblx0alF1ZXJ5LmV2ZW50LnNwZWNpYWxbIG9yaWcgXSA9IHtcblx0XHRkZWxlZ2F0ZVR5cGU6IGZpeCxcblx0XHRiaW5kVHlwZTogZml4LFxuXG5cdFx0aGFuZGxlOiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHR2YXIgcmV0LFxuXHRcdFx0XHR0YXJnZXQgPSB0aGlzLFxuXHRcdFx0XHRyZWxhdGVkID0gZXZlbnQucmVsYXRlZFRhcmdldCxcblx0XHRcdFx0aGFuZGxlT2JqID0gZXZlbnQuaGFuZGxlT2JqO1xuXG5cdFx0XHQvLyBGb3IgbW91c2VlbnRlci9sZWF2ZSBjYWxsIHRoZSBoYW5kbGVyIGlmIHJlbGF0ZWQgaXMgb3V0c2lkZSB0aGUgdGFyZ2V0LlxuXHRcdFx0Ly8gTkI6IE5vIHJlbGF0ZWRUYXJnZXQgaWYgdGhlIG1vdXNlIGxlZnQvZW50ZXJlZCB0aGUgYnJvd3NlciB3aW5kb3dcblx0XHRcdGlmICggIXJlbGF0ZWQgfHwgKCByZWxhdGVkICE9PSB0YXJnZXQgJiYgIWpRdWVyeS5jb250YWlucyggdGFyZ2V0LCByZWxhdGVkICkgKSApIHtcblx0XHRcdFx0ZXZlbnQudHlwZSA9IGhhbmRsZU9iai5vcmlnVHlwZTtcblx0XHRcdFx0cmV0ID0gaGFuZGxlT2JqLmhhbmRsZXIuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdFx0XHRldmVudC50eXBlID0gZml4O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9XG5cdH07XG59ICk7XG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblx0b246IGZ1bmN0aW9uKCB0eXBlcywgc2VsZWN0b3IsIGRhdGEsIGZuICkge1xuXHRcdHJldHVybiBvbiggdGhpcywgdHlwZXMsIHNlbGVjdG9yLCBkYXRhLCBmbiApO1xuXHR9LFxuXHRvbmU6IGZ1bmN0aW9uKCB0eXBlcywgc2VsZWN0b3IsIGRhdGEsIGZuICkge1xuXHRcdHJldHVybiBvbiggdGhpcywgdHlwZXMsIHNlbGVjdG9yLCBkYXRhLCBmbiwgMSApO1xuXHR9LFxuXHRvZmY6IGZ1bmN0aW9uKCB0eXBlcywgc2VsZWN0b3IsIGZuICkge1xuXHRcdHZhciBoYW5kbGVPYmosIHR5cGU7XG5cdFx0aWYgKCB0eXBlcyAmJiB0eXBlcy5wcmV2ZW50RGVmYXVsdCAmJiB0eXBlcy5oYW5kbGVPYmogKSB7XG5cblx0XHRcdC8vICggZXZlbnQgKSAgZGlzcGF0Y2hlZCBqUXVlcnkuRXZlbnRcblx0XHRcdGhhbmRsZU9iaiA9IHR5cGVzLmhhbmRsZU9iajtcblx0XHRcdGpRdWVyeSggdHlwZXMuZGVsZWdhdGVUYXJnZXQgKS5vZmYoXG5cdFx0XHRcdGhhbmRsZU9iai5uYW1lc3BhY2UgP1xuXHRcdFx0XHRcdGhhbmRsZU9iai5vcmlnVHlwZSArIFwiLlwiICsgaGFuZGxlT2JqLm5hbWVzcGFjZSA6XG5cdFx0XHRcdFx0aGFuZGxlT2JqLm9yaWdUeXBlLFxuXHRcdFx0XHRoYW5kbGVPYmouc2VsZWN0b3IsXG5cdFx0XHRcdGhhbmRsZU9iai5oYW5kbGVyXG5cdFx0XHQpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHRcdGlmICggdHlwZW9mIHR5cGVzID09PSBcIm9iamVjdFwiICkge1xuXG5cdFx0XHQvLyAoIHR5cGVzLW9iamVjdCBbLCBzZWxlY3Rvcl0gKVxuXHRcdFx0Zm9yICggdHlwZSBpbiB0eXBlcyApIHtcblx0XHRcdFx0dGhpcy5vZmYoIHR5cGUsIHNlbGVjdG9yLCB0eXBlc1sgdHlwZSBdICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0aWYgKCBzZWxlY3RvciA9PT0gZmFsc2UgfHwgdHlwZW9mIHNlbGVjdG9yID09PSBcImZ1bmN0aW9uXCIgKSB7XG5cblx0XHRcdC8vICggdHlwZXMgWywgZm5dIClcblx0XHRcdGZuID0gc2VsZWN0b3I7XG5cdFx0XHRzZWxlY3RvciA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0aWYgKCBmbiA9PT0gZmFsc2UgKSB7XG5cdFx0XHRmbiA9IHJldHVybkZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeS5ldmVudC5yZW1vdmUoIHRoaXMsIHR5cGVzLCBmbiwgc2VsZWN0b3IgKTtcblx0XHR9ICk7XG5cdH1cbn0gKTtcblxucmV0dXJuIGpRdWVyeTtcbn0gKTtcbiJdfQ==