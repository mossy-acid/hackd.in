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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9ldmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBUSxDQUNQLFFBRE8sRUFFUCxnQkFGTyxFQUdQLGlCQUhPLEVBSVAsYUFKTyxFQUtQLHFCQUxPLEVBT1AsYUFQTyxFQVFQLFlBUk8sQ0FBUixFQVNHLFVBQVUsTUFBVixFQUFrQixRQUFsQixFQUE0QixTQUE1QixFQUF1QyxLQUF2QyxFQUE4QyxRQUE5QyxFQUF5RDs7QUFFNUQsS0FDQyxZQUFZLE1BQVo7S0FDQSxjQUFjLGdEQUFkO0tBQ0EsaUJBQWlCLHFCQUFqQixDQUwyRDs7QUFPNUQsVUFBUyxVQUFULEdBQXNCO0FBQ3JCLFNBQU8sSUFBUCxDQURxQjtFQUF0Qjs7QUFJQSxVQUFTLFdBQVQsR0FBdUI7QUFDdEIsU0FBTyxLQUFQLENBRHNCO0VBQXZCOzs7O0FBWDRELFVBaUJuRCxpQkFBVCxHQUE2QjtBQUM1QixNQUFJO0FBQ0gsVUFBTyxTQUFTLGFBQVQsQ0FESjtHQUFKLENBRUUsT0FBUSxHQUFSLEVBQWMsRUFBZDtFQUhIOztBQU1BLFVBQVMsR0FBVCxDQUFhLElBQWIsRUFBbUIsS0FBbkIsRUFBMEIsUUFBMUIsRUFBb0MsSUFBcEMsRUFBMEMsRUFBMUMsRUFBOEMsR0FBOUMsRUFBb0Q7QUFDbkQsTUFBSSxNQUFKLEVBQVksSUFBWjs7O0FBRG1ELE1BSTlDLFFBQU8scURBQVAsS0FBaUIsUUFBakIsRUFBNEI7OztBQUdoQyxPQUFLLE9BQU8sUUFBUCxLQUFvQixRQUFwQixFQUErQjs7O0FBR25DLFdBQU8sUUFBUSxRQUFSLENBSDRCO0FBSW5DLGVBQVcsU0FBWCxDQUptQztJQUFwQztBQU1BLFFBQU0sSUFBTixJQUFjLEtBQWQsRUFBc0I7QUFDckIsUUFBSSxJQUFKLEVBQVUsSUFBVixFQUFnQixRQUFoQixFQUEwQixJQUExQixFQUFnQyxNQUFPLElBQVAsQ0FBaEMsRUFBK0MsR0FBL0MsRUFEcUI7SUFB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QUMzQixVQUFVLFFBQVYsRUFDRCxVQUFVLFFBQVYsRUFDQSxVQUFVLE9BQVYsQ0FMRCxDQUp1RDtBQVd2RCxXQUFPLElBQVAsQ0FYdUQ7SUFBeEQ7QUFhQSxPQUFLLFFBQU8scURBQVAsS0FBaUIsUUFBakIsRUFBNEI7OztBQUdoQyxTQUFNLElBQU4sSUFBYyxLQUFkLEVBQXNCO0FBQ3JCLFVBQUssR0FBTCxDQUFVLElBQVYsRUFBZ0IsUUFBaEIsRUFBMEIsTUFBTyxJQUFQLENBQTFCLEVBRHFCO0tBQXRCO0FBR0EsV0FBTyxJQUFQLENBTmdDO0lBQWpDO0FBUUEsT0FBSyxhQUFhLEtBQWIsSUFBc0IsT0FBTyxRQUFQLEtBQW9CLFVBQXBCLEVBQWlDOzs7QUFHM0QsU0FBSyxRQUFMLENBSDJEO0FBSTNELGVBQVcsU0FBWCxDQUoyRDtJQUE1RDtBQU1BLE9BQUssT0FBTyxLQUFQLEVBQWU7QUFDbkIsU0FBSyxXQUFMLENBRG1CO0lBQXBCO0FBR0EsVUFBTyxLQUFLLElBQUwsQ0FBVyxZQUFXO0FBQzVCLFdBQU8sS0FBUCxDQUFhLE1BQWIsQ0FBcUIsSUFBckIsRUFBMkIsS0FBM0IsRUFBa0MsRUFBbEMsRUFBc0MsUUFBdEMsRUFENEI7SUFBWCxDQUFsQixDQWhDb0M7R0FBaEM7RUFQTixFQS9vQjREOztBQTRyQjVELFFBQU8sTUFBUCxDQTVyQjREO0NBQXpELENBVEgiLCJmaWxlIjoiZXZlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuL2NvcmVcIixcblx0XCIuL3Zhci9kb2N1bWVudFwiLFxuXHRcIi4vdmFyL3Jub3R3aGl0ZVwiLFxuXHRcIi4vdmFyL3NsaWNlXCIsXG5cdFwiLi9kYXRhL3Zhci9kYXRhUHJpdlwiLFxuXG5cdFwiLi9jb3JlL2luaXRcIixcblx0XCIuL3NlbGVjdG9yXCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIGRvY3VtZW50LCBybm90d2hpdGUsIHNsaWNlLCBkYXRhUHJpdiApIHtcblxudmFyXG5cdHJrZXlFdmVudCA9IC9ea2V5Lyxcblx0cm1vdXNlRXZlbnQgPSAvXig/Om1vdXNlfHBvaW50ZXJ8Y29udGV4dG1lbnV8ZHJhZ3xkcm9wKXxjbGljay8sXG5cdHJ0eXBlbmFtZXNwYWNlID0gL14oW14uXSopKD86XFwuKC4rKXwpLztcblxuZnVuY3Rpb24gcmV0dXJuVHJ1ZSgpIHtcblx0cmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHJldHVybkZhbHNlKCkge1xuXHRyZXR1cm4gZmFsc2U7XG59XG5cbi8vIFN1cHBvcnQ6IElFOVxuLy8gU2VlICMxMzM5MyBmb3IgbW9yZSBpbmZvXG5mdW5jdGlvbiBzYWZlQWN0aXZlRWxlbWVudCgpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblx0fSBjYXRjaCAoIGVyciApIHsgfVxufVxuXG5mdW5jdGlvbiBvbiggZWxlbSwgdHlwZXMsIHNlbGVjdG9yLCBkYXRhLCBmbiwgb25lICkge1xuXHR2YXIgb3JpZ0ZuLCB0eXBlO1xuXG5cdC8vIFR5cGVzIGNhbiBiZSBhIG1hcCBvZiB0eXBlcy9oYW5kbGVyc1xuXHRpZiAoIHR5cGVvZiB0eXBlcyA9PT0gXCJvYmplY3RcIiApIHtcblxuXHRcdC8vICggdHlwZXMtT2JqZWN0LCBzZWxlY3RvciwgZGF0YSApXG5cdFx0aWYgKCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIgKSB7XG5cblx0XHRcdC8vICggdHlwZXMtT2JqZWN0LCBkYXRhIClcblx0XHRcdGRhdGEgPSBkYXRhIHx8IHNlbGVjdG9yO1xuXHRcdFx0c2VsZWN0b3IgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdGZvciAoIHR5cGUgaW4gdHlwZXMgKSB7XG5cdFx0XHRvbiggZWxlbSwgdHlwZSwgc2VsZWN0b3IsIGRhdGEsIHR5cGVzWyB0eXBlIF0sIG9uZSApO1xuXHRcdH1cblx0XHRyZXR1cm4gZWxlbTtcblx0fVxuXG5cdGlmICggZGF0YSA9PSBudWxsICYmIGZuID09IG51bGwgKSB7XG5cblx0XHQvLyAoIHR5cGVzLCBmbiApXG5cdFx0Zm4gPSBzZWxlY3Rvcjtcblx0XHRkYXRhID0gc2VsZWN0b3IgPSB1bmRlZmluZWQ7XG5cdH0gZWxzZSBpZiAoIGZuID09IG51bGwgKSB7XG5cdFx0aWYgKCB0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIgKSB7XG5cblx0XHRcdC8vICggdHlwZXMsIHNlbGVjdG9yLCBmbiApXG5cdFx0XHRmbiA9IGRhdGE7XG5cdFx0XHRkYXRhID0gdW5kZWZpbmVkO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vICggdHlwZXMsIGRhdGEsIGZuIClcblx0XHRcdGZuID0gZGF0YTtcblx0XHRcdGRhdGEgPSBzZWxlY3Rvcjtcblx0XHRcdHNlbGVjdG9yID0gdW5kZWZpbmVkO1xuXHRcdH1cblx0fVxuXHRpZiAoIGZuID09PSBmYWxzZSApIHtcblx0XHRmbiA9IHJldHVybkZhbHNlO1xuXHR9IGVsc2UgaWYgKCAhZm4gKSB7XG5cdFx0cmV0dXJuIGVsZW07XG5cdH1cblxuXHRpZiAoIG9uZSA9PT0gMSApIHtcblx0XHRvcmlnRm4gPSBmbjtcblx0XHRmbiA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdFx0Ly8gQ2FuIHVzZSBhbiBlbXB0eSBzZXQsIHNpbmNlIGV2ZW50IGNvbnRhaW5zIHRoZSBpbmZvXG5cdFx0XHRqUXVlcnkoKS5vZmYoIGV2ZW50ICk7XG5cdFx0XHRyZXR1cm4gb3JpZ0ZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblx0XHR9O1xuXG5cdFx0Ly8gVXNlIHNhbWUgZ3VpZCBzbyBjYWxsZXIgY2FuIHJlbW92ZSB1c2luZyBvcmlnRm5cblx0XHRmbi5ndWlkID0gb3JpZ0ZuLmd1aWQgfHwgKCBvcmlnRm4uZ3VpZCA9IGpRdWVyeS5ndWlkKysgKTtcblx0fVxuXHRyZXR1cm4gZWxlbS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRqUXVlcnkuZXZlbnQuYWRkKCB0aGlzLCB0eXBlcywgZm4sIGRhdGEsIHNlbGVjdG9yICk7XG5cdH0gKTtcbn1cblxuLypcbiAqIEhlbHBlciBmdW5jdGlvbnMgZm9yIG1hbmFnaW5nIGV2ZW50cyAtLSBub3QgcGFydCBvZiB0aGUgcHVibGljIGludGVyZmFjZS5cbiAqIFByb3BzIHRvIERlYW4gRWR3YXJkcycgYWRkRXZlbnQgbGlicmFyeSBmb3IgbWFueSBvZiB0aGUgaWRlYXMuXG4gKi9cbmpRdWVyeS5ldmVudCA9IHtcblxuXHRnbG9iYWw6IHt9LFxuXG5cdGFkZDogZnVuY3Rpb24oIGVsZW0sIHR5cGVzLCBoYW5kbGVyLCBkYXRhLCBzZWxlY3RvciApIHtcblxuXHRcdHZhciBoYW5kbGVPYmpJbiwgZXZlbnRIYW5kbGUsIHRtcCxcblx0XHRcdGV2ZW50cywgdCwgaGFuZGxlT2JqLFxuXHRcdFx0c3BlY2lhbCwgaGFuZGxlcnMsIHR5cGUsIG5hbWVzcGFjZXMsIG9yaWdUeXBlLFxuXHRcdFx0ZWxlbURhdGEgPSBkYXRhUHJpdi5nZXQoIGVsZW0gKTtcblxuXHRcdC8vIERvbid0IGF0dGFjaCBldmVudHMgdG8gbm9EYXRhIG9yIHRleHQvY29tbWVudCBub2RlcyAoYnV0IGFsbG93IHBsYWluIG9iamVjdHMpXG5cdFx0aWYgKCAhZWxlbURhdGEgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gQ2FsbGVyIGNhbiBwYXNzIGluIGFuIG9iamVjdCBvZiBjdXN0b20gZGF0YSBpbiBsaWV1IG9mIHRoZSBoYW5kbGVyXG5cdFx0aWYgKCBoYW5kbGVyLmhhbmRsZXIgKSB7XG5cdFx0XHRoYW5kbGVPYmpJbiA9IGhhbmRsZXI7XG5cdFx0XHRoYW5kbGVyID0gaGFuZGxlT2JqSW4uaGFuZGxlcjtcblx0XHRcdHNlbGVjdG9yID0gaGFuZGxlT2JqSW4uc2VsZWN0b3I7XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgdGhlIGhhbmRsZXIgaGFzIGEgdW5pcXVlIElELCB1c2VkIHRvIGZpbmQvcmVtb3ZlIGl0IGxhdGVyXG5cdFx0aWYgKCAhaGFuZGxlci5ndWlkICkge1xuXHRcdFx0aGFuZGxlci5ndWlkID0galF1ZXJ5Lmd1aWQrKztcblx0XHR9XG5cblx0XHQvLyBJbml0IHRoZSBlbGVtZW50J3MgZXZlbnQgc3RydWN0dXJlIGFuZCBtYWluIGhhbmRsZXIsIGlmIHRoaXMgaXMgdGhlIGZpcnN0XG5cdFx0aWYgKCAhKCBldmVudHMgPSBlbGVtRGF0YS5ldmVudHMgKSApIHtcblx0XHRcdGV2ZW50cyA9IGVsZW1EYXRhLmV2ZW50cyA9IHt9O1xuXHRcdH1cblx0XHRpZiAoICEoIGV2ZW50SGFuZGxlID0gZWxlbURhdGEuaGFuZGxlICkgKSB7XG5cdFx0XHRldmVudEhhbmRsZSA9IGVsZW1EYXRhLmhhbmRsZSA9IGZ1bmN0aW9uKCBlICkge1xuXG5cdFx0XHRcdC8vIERpc2NhcmQgdGhlIHNlY29uZCBldmVudCBvZiBhIGpRdWVyeS5ldmVudC50cmlnZ2VyKCkgYW5kXG5cdFx0XHRcdC8vIHdoZW4gYW4gZXZlbnQgaXMgY2FsbGVkIGFmdGVyIGEgcGFnZSBoYXMgdW5sb2FkZWRcblx0XHRcdFx0cmV0dXJuIHR5cGVvZiBqUXVlcnkgIT09IFwidW5kZWZpbmVkXCIgJiYgalF1ZXJ5LmV2ZW50LnRyaWdnZXJlZCAhPT0gZS50eXBlID9cblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQuZGlzcGF0Y2guYXBwbHkoIGVsZW0sIGFyZ3VtZW50cyApIDogdW5kZWZpbmVkO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHQvLyBIYW5kbGUgbXVsdGlwbGUgZXZlbnRzIHNlcGFyYXRlZCBieSBhIHNwYWNlXG5cdFx0dHlwZXMgPSAoIHR5cGVzIHx8IFwiXCIgKS5tYXRjaCggcm5vdHdoaXRlICkgfHwgWyBcIlwiIF07XG5cdFx0dCA9IHR5cGVzLmxlbmd0aDtcblx0XHR3aGlsZSAoIHQtLSApIHtcblx0XHRcdHRtcCA9IHJ0eXBlbmFtZXNwYWNlLmV4ZWMoIHR5cGVzWyB0IF0gKSB8fCBbXTtcblx0XHRcdHR5cGUgPSBvcmlnVHlwZSA9IHRtcFsgMSBdO1xuXHRcdFx0bmFtZXNwYWNlcyA9ICggdG1wWyAyIF0gfHwgXCJcIiApLnNwbGl0KCBcIi5cIiApLnNvcnQoKTtcblxuXHRcdFx0Ly8gVGhlcmUgKm11c3QqIGJlIGEgdHlwZSwgbm8gYXR0YWNoaW5nIG5hbWVzcGFjZS1vbmx5IGhhbmRsZXJzXG5cdFx0XHRpZiAoICF0eXBlICkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgZXZlbnQgY2hhbmdlcyBpdHMgdHlwZSwgdXNlIHRoZSBzcGVjaWFsIGV2ZW50IGhhbmRsZXJzIGZvciB0aGUgY2hhbmdlZCB0eXBlXG5cdFx0XHRzcGVjaWFsID0galF1ZXJ5LmV2ZW50LnNwZWNpYWxbIHR5cGUgXSB8fCB7fTtcblxuXHRcdFx0Ly8gSWYgc2VsZWN0b3IgZGVmaW5lZCwgZGV0ZXJtaW5lIHNwZWNpYWwgZXZlbnQgYXBpIHR5cGUsIG90aGVyd2lzZSBnaXZlbiB0eXBlXG5cdFx0XHR0eXBlID0gKCBzZWxlY3RvciA/IHNwZWNpYWwuZGVsZWdhdGVUeXBlIDogc3BlY2lhbC5iaW5kVHlwZSApIHx8IHR5cGU7XG5cblx0XHRcdC8vIFVwZGF0ZSBzcGVjaWFsIGJhc2VkIG9uIG5ld2x5IHJlc2V0IHR5cGVcblx0XHRcdHNwZWNpYWwgPSBqUXVlcnkuZXZlbnQuc3BlY2lhbFsgdHlwZSBdIHx8IHt9O1xuXG5cdFx0XHQvLyBoYW5kbGVPYmogaXMgcGFzc2VkIHRvIGFsbCBldmVudCBoYW5kbGVyc1xuXHRcdFx0aGFuZGxlT2JqID0galF1ZXJ5LmV4dGVuZCgge1xuXHRcdFx0XHR0eXBlOiB0eXBlLFxuXHRcdFx0XHRvcmlnVHlwZTogb3JpZ1R5cGUsXG5cdFx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRcdGhhbmRsZXI6IGhhbmRsZXIsXG5cdFx0XHRcdGd1aWQ6IGhhbmRsZXIuZ3VpZCxcblx0XHRcdFx0c2VsZWN0b3I6IHNlbGVjdG9yLFxuXHRcdFx0XHRuZWVkc0NvbnRleHQ6IHNlbGVjdG9yICYmIGpRdWVyeS5leHByLm1hdGNoLm5lZWRzQ29udGV4dC50ZXN0KCBzZWxlY3RvciApLFxuXHRcdFx0XHRuYW1lc3BhY2U6IG5hbWVzcGFjZXMuam9pbiggXCIuXCIgKVxuXHRcdFx0fSwgaGFuZGxlT2JqSW4gKTtcblxuXHRcdFx0Ly8gSW5pdCB0aGUgZXZlbnQgaGFuZGxlciBxdWV1ZSBpZiB3ZSdyZSB0aGUgZmlyc3Rcblx0XHRcdGlmICggISggaGFuZGxlcnMgPSBldmVudHNbIHR5cGUgXSApICkge1xuXHRcdFx0XHRoYW5kbGVycyA9IGV2ZW50c1sgdHlwZSBdID0gW107XG5cdFx0XHRcdGhhbmRsZXJzLmRlbGVnYXRlQ291bnQgPSAwO1xuXG5cdFx0XHRcdC8vIE9ubHkgdXNlIGFkZEV2ZW50TGlzdGVuZXIgaWYgdGhlIHNwZWNpYWwgZXZlbnRzIGhhbmRsZXIgcmV0dXJucyBmYWxzZVxuXHRcdFx0XHRpZiAoICFzcGVjaWFsLnNldHVwIHx8XG5cdFx0XHRcdFx0c3BlY2lhbC5zZXR1cC5jYWxsKCBlbGVtLCBkYXRhLCBuYW1lc3BhY2VzLCBldmVudEhhbmRsZSApID09PSBmYWxzZSApIHtcblxuXHRcdFx0XHRcdGlmICggZWxlbS5hZGRFdmVudExpc3RlbmVyICkge1xuXHRcdFx0XHRcdFx0ZWxlbS5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBldmVudEhhbmRsZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHNwZWNpYWwuYWRkICkge1xuXHRcdFx0XHRzcGVjaWFsLmFkZC5jYWxsKCBlbGVtLCBoYW5kbGVPYmogKTtcblxuXHRcdFx0XHRpZiAoICFoYW5kbGVPYmouaGFuZGxlci5ndWlkICkge1xuXHRcdFx0XHRcdGhhbmRsZU9iai5oYW5kbGVyLmd1aWQgPSBoYW5kbGVyLmd1aWQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gQWRkIHRvIHRoZSBlbGVtZW50J3MgaGFuZGxlciBsaXN0LCBkZWxlZ2F0ZXMgaW4gZnJvbnRcblx0XHRcdGlmICggc2VsZWN0b3IgKSB7XG5cdFx0XHRcdGhhbmRsZXJzLnNwbGljZSggaGFuZGxlcnMuZGVsZWdhdGVDb3VudCsrLCAwLCBoYW5kbGVPYmogKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGhhbmRsZXJzLnB1c2goIGhhbmRsZU9iaiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBLZWVwIHRyYWNrIG9mIHdoaWNoIGV2ZW50cyBoYXZlIGV2ZXIgYmVlbiB1c2VkLCBmb3IgZXZlbnQgb3B0aW1pemF0aW9uXG5cdFx0XHRqUXVlcnkuZXZlbnQuZ2xvYmFsWyB0eXBlIF0gPSB0cnVlO1xuXHRcdH1cblxuXHR9LFxuXG5cdC8vIERldGFjaCBhbiBldmVudCBvciBzZXQgb2YgZXZlbnRzIGZyb20gYW4gZWxlbWVudFxuXHRyZW1vdmU6IGZ1bmN0aW9uKCBlbGVtLCB0eXBlcywgaGFuZGxlciwgc2VsZWN0b3IsIG1hcHBlZFR5cGVzICkge1xuXG5cdFx0dmFyIGosIG9yaWdDb3VudCwgdG1wLFxuXHRcdFx0ZXZlbnRzLCB0LCBoYW5kbGVPYmosXG5cdFx0XHRzcGVjaWFsLCBoYW5kbGVycywgdHlwZSwgbmFtZXNwYWNlcywgb3JpZ1R5cGUsXG5cdFx0XHRlbGVtRGF0YSA9IGRhdGFQcml2Lmhhc0RhdGEoIGVsZW0gKSAmJiBkYXRhUHJpdi5nZXQoIGVsZW0gKTtcblxuXHRcdGlmICggIWVsZW1EYXRhIHx8ICEoIGV2ZW50cyA9IGVsZW1EYXRhLmV2ZW50cyApICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIE9uY2UgZm9yIGVhY2ggdHlwZS5uYW1lc3BhY2UgaW4gdHlwZXM7IHR5cGUgbWF5IGJlIG9taXR0ZWRcblx0XHR0eXBlcyA9ICggdHlwZXMgfHwgXCJcIiApLm1hdGNoKCBybm90d2hpdGUgKSB8fCBbIFwiXCIgXTtcblx0XHR0ID0gdHlwZXMubGVuZ3RoO1xuXHRcdHdoaWxlICggdC0tICkge1xuXHRcdFx0dG1wID0gcnR5cGVuYW1lc3BhY2UuZXhlYyggdHlwZXNbIHQgXSApIHx8IFtdO1xuXHRcdFx0dHlwZSA9IG9yaWdUeXBlID0gdG1wWyAxIF07XG5cdFx0XHRuYW1lc3BhY2VzID0gKCB0bXBbIDIgXSB8fCBcIlwiICkuc3BsaXQoIFwiLlwiICkuc29ydCgpO1xuXG5cdFx0XHQvLyBVbmJpbmQgYWxsIGV2ZW50cyAob24gdGhpcyBuYW1lc3BhY2UsIGlmIHByb3ZpZGVkKSBmb3IgdGhlIGVsZW1lbnRcblx0XHRcdGlmICggIXR5cGUgKSB7XG5cdFx0XHRcdGZvciAoIHR5cGUgaW4gZXZlbnRzICkge1xuXHRcdFx0XHRcdGpRdWVyeS5ldmVudC5yZW1vdmUoIGVsZW0sIHR5cGUgKyB0eXBlc1sgdCBdLCBoYW5kbGVyLCBzZWxlY3RvciwgdHJ1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRzcGVjaWFsID0galF1ZXJ5LmV2ZW50LnNwZWNpYWxbIHR5cGUgXSB8fCB7fTtcblx0XHRcdHR5cGUgPSAoIHNlbGVjdG9yID8gc3BlY2lhbC5kZWxlZ2F0ZVR5cGUgOiBzcGVjaWFsLmJpbmRUeXBlICkgfHwgdHlwZTtcblx0XHRcdGhhbmRsZXJzID0gZXZlbnRzWyB0eXBlIF0gfHwgW107XG5cdFx0XHR0bXAgPSB0bXBbIDIgXSAmJlxuXHRcdFx0XHRuZXcgUmVnRXhwKCBcIihefFxcXFwuKVwiICsgbmFtZXNwYWNlcy5qb2luKCBcIlxcXFwuKD86LipcXFxcLnwpXCIgKSArIFwiKFxcXFwufCQpXCIgKTtcblxuXHRcdFx0Ly8gUmVtb3ZlIG1hdGNoaW5nIGV2ZW50c1xuXHRcdFx0b3JpZ0NvdW50ID0gaiA9IGhhbmRsZXJzLmxlbmd0aDtcblx0XHRcdHdoaWxlICggai0tICkge1xuXHRcdFx0XHRoYW5kbGVPYmogPSBoYW5kbGVyc1sgaiBdO1xuXG5cdFx0XHRcdGlmICggKCBtYXBwZWRUeXBlcyB8fCBvcmlnVHlwZSA9PT0gaGFuZGxlT2JqLm9yaWdUeXBlICkgJiZcblx0XHRcdFx0XHQoICFoYW5kbGVyIHx8IGhhbmRsZXIuZ3VpZCA9PT0gaGFuZGxlT2JqLmd1aWQgKSAmJlxuXHRcdFx0XHRcdCggIXRtcCB8fCB0bXAudGVzdCggaGFuZGxlT2JqLm5hbWVzcGFjZSApICkgJiZcblx0XHRcdFx0XHQoICFzZWxlY3RvciB8fCBzZWxlY3RvciA9PT0gaGFuZGxlT2JqLnNlbGVjdG9yIHx8XG5cdFx0XHRcdFx0XHRzZWxlY3RvciA9PT0gXCIqKlwiICYmIGhhbmRsZU9iai5zZWxlY3RvciApICkge1xuXHRcdFx0XHRcdGhhbmRsZXJzLnNwbGljZSggaiwgMSApO1xuXG5cdFx0XHRcdFx0aWYgKCBoYW5kbGVPYmouc2VsZWN0b3IgKSB7XG5cdFx0XHRcdFx0XHRoYW5kbGVycy5kZWxlZ2F0ZUNvdW50LS07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggc3BlY2lhbC5yZW1vdmUgKSB7XG5cdFx0XHRcdFx0XHRzcGVjaWFsLnJlbW92ZS5jYWxsKCBlbGVtLCBoYW5kbGVPYmogKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVtb3ZlIGdlbmVyaWMgZXZlbnQgaGFuZGxlciBpZiB3ZSByZW1vdmVkIHNvbWV0aGluZyBhbmQgbm8gbW9yZSBoYW5kbGVycyBleGlzdFxuXHRcdFx0Ly8gKGF2b2lkcyBwb3RlbnRpYWwgZm9yIGVuZGxlc3MgcmVjdXJzaW9uIGR1cmluZyByZW1vdmFsIG9mIHNwZWNpYWwgZXZlbnQgaGFuZGxlcnMpXG5cdFx0XHRpZiAoIG9yaWdDb3VudCAmJiAhaGFuZGxlcnMubGVuZ3RoICkge1xuXHRcdFx0XHRpZiAoICFzcGVjaWFsLnRlYXJkb3duIHx8XG5cdFx0XHRcdFx0c3BlY2lhbC50ZWFyZG93bi5jYWxsKCBlbGVtLCBuYW1lc3BhY2VzLCBlbGVtRGF0YS5oYW5kbGUgKSA9PT0gZmFsc2UgKSB7XG5cblx0XHRcdFx0XHRqUXVlcnkucmVtb3ZlRXZlbnQoIGVsZW0sIHR5cGUsIGVsZW1EYXRhLmhhbmRsZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGVsZXRlIGV2ZW50c1sgdHlwZSBdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFJlbW92ZSBkYXRhIGFuZCB0aGUgZXhwYW5kbyBpZiBpdCdzIG5vIGxvbmdlciB1c2VkXG5cdFx0aWYgKCBqUXVlcnkuaXNFbXB0eU9iamVjdCggZXZlbnRzICkgKSB7XG5cdFx0XHRkYXRhUHJpdi5yZW1vdmUoIGVsZW0sIFwiaGFuZGxlIGV2ZW50c1wiICk7XG5cdFx0fVxuXHR9LFxuXG5cdGRpc3BhdGNoOiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHQvLyBNYWtlIGEgd3JpdGFibGUgalF1ZXJ5LkV2ZW50IGZyb20gdGhlIG5hdGl2ZSBldmVudCBvYmplY3Rcblx0XHRldmVudCA9IGpRdWVyeS5ldmVudC5maXgoIGV2ZW50ICk7XG5cblx0XHR2YXIgaSwgaiwgcmV0LCBtYXRjaGVkLCBoYW5kbGVPYmosXG5cdFx0XHRoYW5kbGVyUXVldWUgPSBbXSxcblx0XHRcdGFyZ3MgPSBzbGljZS5jYWxsKCBhcmd1bWVudHMgKSxcblx0XHRcdGhhbmRsZXJzID0gKCBkYXRhUHJpdi5nZXQoIHRoaXMsIFwiZXZlbnRzXCIgKSB8fCB7fSApWyBldmVudC50eXBlIF0gfHwgW10sXG5cdFx0XHRzcGVjaWFsID0galF1ZXJ5LmV2ZW50LnNwZWNpYWxbIGV2ZW50LnR5cGUgXSB8fCB7fTtcblxuXHRcdC8vIFVzZSB0aGUgZml4LWVkIGpRdWVyeS5FdmVudCByYXRoZXIgdGhhbiB0aGUgKHJlYWQtb25seSkgbmF0aXZlIGV2ZW50XG5cdFx0YXJnc1sgMCBdID0gZXZlbnQ7XG5cdFx0ZXZlbnQuZGVsZWdhdGVUYXJnZXQgPSB0aGlzO1xuXG5cdFx0Ly8gQ2FsbCB0aGUgcHJlRGlzcGF0Y2ggaG9vayBmb3IgdGhlIG1hcHBlZCB0eXBlLCBhbmQgbGV0IGl0IGJhaWwgaWYgZGVzaXJlZFxuXHRcdGlmICggc3BlY2lhbC5wcmVEaXNwYXRjaCAmJiBzcGVjaWFsLnByZURpc3BhdGNoLmNhbGwoIHRoaXMsIGV2ZW50ICkgPT09IGZhbHNlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIERldGVybWluZSBoYW5kbGVyc1xuXHRcdGhhbmRsZXJRdWV1ZSA9IGpRdWVyeS5ldmVudC5oYW5kbGVycy5jYWxsKCB0aGlzLCBldmVudCwgaGFuZGxlcnMgKTtcblxuXHRcdC8vIFJ1biBkZWxlZ2F0ZXMgZmlyc3Q7IHRoZXkgbWF5IHdhbnQgdG8gc3RvcCBwcm9wYWdhdGlvbiBiZW5lYXRoIHVzXG5cdFx0aSA9IDA7XG5cdFx0d2hpbGUgKCAoIG1hdGNoZWQgPSBoYW5kbGVyUXVldWVbIGkrKyBdICkgJiYgIWV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkKCkgKSB7XG5cdFx0XHRldmVudC5jdXJyZW50VGFyZ2V0ID0gbWF0Y2hlZC5lbGVtO1xuXG5cdFx0XHRqID0gMDtcblx0XHRcdHdoaWxlICggKCBoYW5kbGVPYmogPSBtYXRjaGVkLmhhbmRsZXJzWyBqKysgXSApICYmXG5cdFx0XHRcdCFldmVudC5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCgpICkge1xuXG5cdFx0XHRcdC8vIFRyaWdnZXJlZCBldmVudCBtdXN0IGVpdGhlciAxKSBoYXZlIG5vIG5hbWVzcGFjZSwgb3IgMikgaGF2ZSBuYW1lc3BhY2Uocylcblx0XHRcdFx0Ly8gYSBzdWJzZXQgb3IgZXF1YWwgdG8gdGhvc2UgaW4gdGhlIGJvdW5kIGV2ZW50IChib3RoIGNhbiBoYXZlIG5vIG5hbWVzcGFjZSkuXG5cdFx0XHRcdGlmICggIWV2ZW50LnJuYW1lc3BhY2UgfHwgZXZlbnQucm5hbWVzcGFjZS50ZXN0KCBoYW5kbGVPYmoubmFtZXNwYWNlICkgKSB7XG5cblx0XHRcdFx0XHRldmVudC5oYW5kbGVPYmogPSBoYW5kbGVPYmo7XG5cdFx0XHRcdFx0ZXZlbnQuZGF0YSA9IGhhbmRsZU9iai5kYXRhO1xuXG5cdFx0XHRcdFx0cmV0ID0gKCAoIGpRdWVyeS5ldmVudC5zcGVjaWFsWyBoYW5kbGVPYmoub3JpZ1R5cGUgXSB8fCB7fSApLmhhbmRsZSB8fFxuXHRcdFx0XHRcdFx0aGFuZGxlT2JqLmhhbmRsZXIgKS5hcHBseSggbWF0Y2hlZC5lbGVtLCBhcmdzICk7XG5cblx0XHRcdFx0XHRpZiAoIHJldCAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoIGV2ZW50LnJlc3VsdCA9IHJldCApID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQ2FsbCB0aGUgcG9zdERpc3BhdGNoIGhvb2sgZm9yIHRoZSBtYXBwZWQgdHlwZVxuXHRcdGlmICggc3BlY2lhbC5wb3N0RGlzcGF0Y2ggKSB7XG5cdFx0XHRzcGVjaWFsLnBvc3REaXNwYXRjaC5jYWxsKCB0aGlzLCBldmVudCApO1xuXHRcdH1cblxuXHRcdHJldHVybiBldmVudC5yZXN1bHQ7XG5cdH0sXG5cblx0aGFuZGxlcnM6IGZ1bmN0aW9uKCBldmVudCwgaGFuZGxlcnMgKSB7XG5cdFx0dmFyIGksIG1hdGNoZXMsIHNlbCwgaGFuZGxlT2JqLFxuXHRcdFx0aGFuZGxlclF1ZXVlID0gW10sXG5cdFx0XHRkZWxlZ2F0ZUNvdW50ID0gaGFuZGxlcnMuZGVsZWdhdGVDb3VudCxcblx0XHRcdGN1ciA9IGV2ZW50LnRhcmdldDtcblxuXHRcdC8vIFN1cHBvcnQgKGF0IGxlYXN0KTogQ2hyb21lLCBJRTlcblx0XHQvLyBGaW5kIGRlbGVnYXRlIGhhbmRsZXJzXG5cdFx0Ly8gQmxhY2staG9sZSBTVkcgPHVzZT4gaW5zdGFuY2UgdHJlZXMgKCMxMzE4MClcblx0XHQvL1xuXHRcdC8vIFN1cHBvcnQ6IEZpcmVmb3g8PTQyK1xuXHRcdC8vIEF2b2lkIG5vbi1sZWZ0LWNsaWNrIGluIEZGIGJ1dCBkb24ndCBibG9jayBJRSByYWRpbyBldmVudHMgKCMzODYxLCBnaC0yMzQzKVxuXHRcdGlmICggZGVsZWdhdGVDb3VudCAmJiBjdXIubm9kZVR5cGUgJiZcblx0XHRcdCggZXZlbnQudHlwZSAhPT0gXCJjbGlja1wiIHx8IGlzTmFOKCBldmVudC5idXR0b24gKSB8fCBldmVudC5idXR0b24gPCAxICkgKSB7XG5cblx0XHRcdGZvciAoIDsgY3VyICE9PSB0aGlzOyBjdXIgPSBjdXIucGFyZW50Tm9kZSB8fCB0aGlzICkge1xuXG5cdFx0XHRcdC8vIERvbid0IGNoZWNrIG5vbi1lbGVtZW50cyAoIzEzMjA4KVxuXHRcdFx0XHQvLyBEb24ndCBwcm9jZXNzIGNsaWNrcyBvbiBkaXNhYmxlZCBlbGVtZW50cyAoIzY5MTEsICM4MTY1LCAjMTEzODIsICMxMTc2NClcblx0XHRcdFx0aWYgKCBjdXIubm9kZVR5cGUgPT09IDEgJiYgKCBjdXIuZGlzYWJsZWQgIT09IHRydWUgfHwgZXZlbnQudHlwZSAhPT0gXCJjbGlja1wiICkgKSB7XG5cdFx0XHRcdFx0bWF0Y2hlcyA9IFtdO1xuXHRcdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgZGVsZWdhdGVDb3VudDsgaSsrICkge1xuXHRcdFx0XHRcdFx0aGFuZGxlT2JqID0gaGFuZGxlcnNbIGkgXTtcblxuXHRcdFx0XHRcdFx0Ly8gRG9uJ3QgY29uZmxpY3Qgd2l0aCBPYmplY3QucHJvdG90eXBlIHByb3BlcnRpZXMgKCMxMzIwMylcblx0XHRcdFx0XHRcdHNlbCA9IGhhbmRsZU9iai5zZWxlY3RvciArIFwiIFwiO1xuXG5cdFx0XHRcdFx0XHRpZiAoIG1hdGNoZXNbIHNlbCBdID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0XHRcdG1hdGNoZXNbIHNlbCBdID0gaGFuZGxlT2JqLm5lZWRzQ29udGV4dCA/XG5cdFx0XHRcdFx0XHRcdFx0alF1ZXJ5KCBzZWwsIHRoaXMgKS5pbmRleCggY3VyICkgPiAtMSA6XG5cdFx0XHRcdFx0XHRcdFx0alF1ZXJ5LmZpbmQoIHNlbCwgdGhpcywgbnVsbCwgWyBjdXIgXSApLmxlbmd0aDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggbWF0Y2hlc1sgc2VsIF0gKSB7XG5cdFx0XHRcdFx0XHRcdG1hdGNoZXMucHVzaCggaGFuZGxlT2JqICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggbWF0Y2hlcy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRoYW5kbGVyUXVldWUucHVzaCggeyBlbGVtOiBjdXIsIGhhbmRsZXJzOiBtYXRjaGVzIH0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBBZGQgdGhlIHJlbWFpbmluZyAoZGlyZWN0bHktYm91bmQpIGhhbmRsZXJzXG5cdFx0aWYgKCBkZWxlZ2F0ZUNvdW50IDwgaGFuZGxlcnMubGVuZ3RoICkge1xuXHRcdFx0aGFuZGxlclF1ZXVlLnB1c2goIHsgZWxlbTogdGhpcywgaGFuZGxlcnM6IGhhbmRsZXJzLnNsaWNlKCBkZWxlZ2F0ZUNvdW50ICkgfSApO1xuXHRcdH1cblxuXHRcdHJldHVybiBoYW5kbGVyUXVldWU7XG5cdH0sXG5cblx0Ly8gSW5jbHVkZXMgc29tZSBldmVudCBwcm9wcyBzaGFyZWQgYnkgS2V5RXZlbnQgYW5kIE1vdXNlRXZlbnRcblx0cHJvcHM6ICggXCJhbHRLZXkgYnViYmxlcyBjYW5jZWxhYmxlIGN0cmxLZXkgY3VycmVudFRhcmdldCBkZXRhaWwgZXZlbnRQaGFzZSBcIiArXG5cdFx0XCJtZXRhS2V5IHJlbGF0ZWRUYXJnZXQgc2hpZnRLZXkgdGFyZ2V0IHRpbWVTdGFtcCB2aWV3IHdoaWNoXCIgKS5zcGxpdCggXCIgXCIgKSxcblxuXHRmaXhIb29rczoge30sXG5cblx0a2V5SG9va3M6IHtcblx0XHRwcm9wczogXCJjaGFyIGNoYXJDb2RlIGtleSBrZXlDb2RlXCIuc3BsaXQoIFwiIFwiICksXG5cdFx0ZmlsdGVyOiBmdW5jdGlvbiggZXZlbnQsIG9yaWdpbmFsICkge1xuXG5cdFx0XHQvLyBBZGQgd2hpY2ggZm9yIGtleSBldmVudHNcblx0XHRcdGlmICggZXZlbnQud2hpY2ggPT0gbnVsbCApIHtcblx0XHRcdFx0ZXZlbnQud2hpY2ggPSBvcmlnaW5hbC5jaGFyQ29kZSAhPSBudWxsID8gb3JpZ2luYWwuY2hhckNvZGUgOiBvcmlnaW5hbC5rZXlDb2RlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZXZlbnQ7XG5cdFx0fVxuXHR9LFxuXG5cdG1vdXNlSG9va3M6IHtcblx0XHRwcm9wczogKCBcImJ1dHRvbiBidXR0b25zIGNsaWVudFggY2xpZW50WSBvZmZzZXRYIG9mZnNldFkgcGFnZVggcGFnZVkgXCIgK1xuXHRcdFx0XCJzY3JlZW5YIHNjcmVlblkgdG9FbGVtZW50XCIgKS5zcGxpdCggXCIgXCIgKSxcblx0XHRmaWx0ZXI6IGZ1bmN0aW9uKCBldmVudCwgb3JpZ2luYWwgKSB7XG5cdFx0XHR2YXIgZXZlbnREb2MsIGRvYywgYm9keSxcblx0XHRcdFx0YnV0dG9uID0gb3JpZ2luYWwuYnV0dG9uO1xuXG5cdFx0XHQvLyBDYWxjdWxhdGUgcGFnZVgvWSBpZiBtaXNzaW5nIGFuZCBjbGllbnRYL1kgYXZhaWxhYmxlXG5cdFx0XHRpZiAoIGV2ZW50LnBhZ2VYID09IG51bGwgJiYgb3JpZ2luYWwuY2xpZW50WCAhPSBudWxsICkge1xuXHRcdFx0XHRldmVudERvYyA9IGV2ZW50LnRhcmdldC5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuXHRcdFx0XHRkb2MgPSBldmVudERvYy5kb2N1bWVudEVsZW1lbnQ7XG5cdFx0XHRcdGJvZHkgPSBldmVudERvYy5ib2R5O1xuXG5cdFx0XHRcdGV2ZW50LnBhZ2VYID0gb3JpZ2luYWwuY2xpZW50WCArXG5cdFx0XHRcdFx0KCBkb2MgJiYgZG9jLnNjcm9sbExlZnQgfHwgYm9keSAmJiBib2R5LnNjcm9sbExlZnQgfHwgMCApIC1cblx0XHRcdFx0XHQoIGRvYyAmJiBkb2MuY2xpZW50TGVmdCB8fCBib2R5ICYmIGJvZHkuY2xpZW50TGVmdCB8fCAwICk7XG5cdFx0XHRcdGV2ZW50LnBhZ2VZID0gb3JpZ2luYWwuY2xpZW50WSArXG5cdFx0XHRcdFx0KCBkb2MgJiYgZG9jLnNjcm9sbFRvcCAgfHwgYm9keSAmJiBib2R5LnNjcm9sbFRvcCAgfHwgMCApIC1cblx0XHRcdFx0XHQoIGRvYyAmJiBkb2MuY2xpZW50VG9wICB8fCBib2R5ICYmIGJvZHkuY2xpZW50VG9wICB8fCAwICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFkZCB3aGljaCBmb3IgY2xpY2s6IDEgPT09IGxlZnQ7IDIgPT09IG1pZGRsZTsgMyA9PT0gcmlnaHRcblx0XHRcdC8vIE5vdGU6IGJ1dHRvbiBpcyBub3Qgbm9ybWFsaXplZCwgc28gZG9uJ3QgdXNlIGl0XG5cdFx0XHRpZiAoICFldmVudC53aGljaCAmJiBidXR0b24gIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0ZXZlbnQud2hpY2ggPSAoIGJ1dHRvbiAmIDEgPyAxIDogKCBidXR0b24gJiAyID8gMyA6ICggYnV0dG9uICYgNCA/IDIgOiAwICkgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZXZlbnQ7XG5cdFx0fVxuXHR9LFxuXG5cdGZpeDogZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGlmICggZXZlbnRbIGpRdWVyeS5leHBhbmRvIF0gKSB7XG5cdFx0XHRyZXR1cm4gZXZlbnQ7XG5cdFx0fVxuXG5cdFx0Ly8gQ3JlYXRlIGEgd3JpdGFibGUgY29weSBvZiB0aGUgZXZlbnQgb2JqZWN0IGFuZCBub3JtYWxpemUgc29tZSBwcm9wZXJ0aWVzXG5cdFx0dmFyIGksIHByb3AsIGNvcHksXG5cdFx0XHR0eXBlID0gZXZlbnQudHlwZSxcblx0XHRcdG9yaWdpbmFsRXZlbnQgPSBldmVudCxcblx0XHRcdGZpeEhvb2sgPSB0aGlzLmZpeEhvb2tzWyB0eXBlIF07XG5cblx0XHRpZiAoICFmaXhIb29rICkge1xuXHRcdFx0dGhpcy5maXhIb29rc1sgdHlwZSBdID0gZml4SG9vayA9XG5cdFx0XHRcdHJtb3VzZUV2ZW50LnRlc3QoIHR5cGUgKSA/IHRoaXMubW91c2VIb29rcyA6XG5cdFx0XHRcdHJrZXlFdmVudC50ZXN0KCB0eXBlICkgPyB0aGlzLmtleUhvb2tzIDpcblx0XHRcdFx0e307XG5cdFx0fVxuXHRcdGNvcHkgPSBmaXhIb29rLnByb3BzID8gdGhpcy5wcm9wcy5jb25jYXQoIGZpeEhvb2sucHJvcHMgKSA6IHRoaXMucHJvcHM7XG5cblx0XHRldmVudCA9IG5ldyBqUXVlcnkuRXZlbnQoIG9yaWdpbmFsRXZlbnQgKTtcblxuXHRcdGkgPSBjb3B5Lmxlbmd0aDtcblx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdHByb3AgPSBjb3B5WyBpIF07XG5cdFx0XHRldmVudFsgcHJvcCBdID0gb3JpZ2luYWxFdmVudFsgcHJvcCBdO1xuXHRcdH1cblxuXHRcdC8vIFN1cHBvcnQ6IENvcmRvdmEgMi41IChXZWJLaXQpICgjMTMyNTUpXG5cdFx0Ly8gQWxsIGV2ZW50cyBzaG91bGQgaGF2ZSBhIHRhcmdldDsgQ29yZG92YSBkZXZpY2VyZWFkeSBkb2Vzbid0XG5cdFx0aWYgKCAhZXZlbnQudGFyZ2V0ICkge1xuXHRcdFx0ZXZlbnQudGFyZ2V0ID0gZG9jdW1lbnQ7XG5cdFx0fVxuXG5cdFx0Ly8gU3VwcG9ydDogU2FmYXJpIDYuMCssIENocm9tZTwyOFxuXHRcdC8vIFRhcmdldCBzaG91bGQgbm90IGJlIGEgdGV4dCBub2RlICgjNTA0LCAjMTMxNDMpXG5cdFx0aWYgKCBldmVudC50YXJnZXQubm9kZVR5cGUgPT09IDMgKSB7XG5cdFx0XHRldmVudC50YXJnZXQgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZml4SG9vay5maWx0ZXIgPyBmaXhIb29rLmZpbHRlciggZXZlbnQsIG9yaWdpbmFsRXZlbnQgKSA6IGV2ZW50O1xuXHR9LFxuXG5cdHNwZWNpYWw6IHtcblx0XHRsb2FkOiB7XG5cblx0XHRcdC8vIFByZXZlbnQgdHJpZ2dlcmVkIGltYWdlLmxvYWQgZXZlbnRzIGZyb20gYnViYmxpbmcgdG8gd2luZG93LmxvYWRcblx0XHRcdG5vQnViYmxlOiB0cnVlXG5cdFx0fSxcblx0XHRmb2N1czoge1xuXG5cdFx0XHQvLyBGaXJlIG5hdGl2ZSBldmVudCBpZiBwb3NzaWJsZSBzbyBibHVyL2ZvY3VzIHNlcXVlbmNlIGlzIGNvcnJlY3Rcblx0XHRcdHRyaWdnZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIHRoaXMgIT09IHNhZmVBY3RpdmVFbGVtZW50KCkgJiYgdGhpcy5mb2N1cyApIHtcblx0XHRcdFx0XHR0aGlzLmZvY3VzKCk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZGVsZWdhdGVUeXBlOiBcImZvY3VzaW5cIlxuXHRcdH0sXG5cdFx0Ymx1cjoge1xuXHRcdFx0dHJpZ2dlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggdGhpcyA9PT0gc2FmZUFjdGl2ZUVsZW1lbnQoKSAmJiB0aGlzLmJsdXIgKSB7XG5cdFx0XHRcdFx0dGhpcy5ibHVyKCk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZGVsZWdhdGVUeXBlOiBcImZvY3Vzb3V0XCJcblx0XHR9LFxuXHRcdGNsaWNrOiB7XG5cblx0XHRcdC8vIEZvciBjaGVja2JveCwgZmlyZSBuYXRpdmUgZXZlbnQgc28gY2hlY2tlZCBzdGF0ZSB3aWxsIGJlIHJpZ2h0XG5cdFx0XHR0cmlnZ2VyOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCB0aGlzLnR5cGUgPT09IFwiY2hlY2tib3hcIiAmJiB0aGlzLmNsaWNrICYmIGpRdWVyeS5ub2RlTmFtZSggdGhpcywgXCJpbnB1dFwiICkgKSB7XG5cdFx0XHRcdFx0dGhpcy5jbGljaygpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0Ly8gRm9yIGNyb3NzLWJyb3dzZXIgY29uc2lzdGVuY3ksIGRvbid0IGZpcmUgbmF0aXZlIC5jbGljaygpIG9uIGxpbmtzXG5cdFx0XHRfZGVmYXVsdDogZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRyZXR1cm4galF1ZXJ5Lm5vZGVOYW1lKCBldmVudC50YXJnZXQsIFwiYVwiICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdGJlZm9yZXVubG9hZDoge1xuXHRcdFx0cG9zdERpc3BhdGNoOiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogRmlyZWZveCAyMCtcblx0XHRcdFx0Ly8gRmlyZWZveCBkb2Vzbid0IGFsZXJ0IGlmIHRoZSByZXR1cm5WYWx1ZSBmaWVsZCBpcyBub3Qgc2V0LlxuXHRcdFx0XHRpZiAoIGV2ZW50LnJlc3VsdCAhPT0gdW5kZWZpbmVkICYmIGV2ZW50Lm9yaWdpbmFsRXZlbnQgKSB7XG5cdFx0XHRcdFx0ZXZlbnQub3JpZ2luYWxFdmVudC5yZXR1cm5WYWx1ZSA9IGV2ZW50LnJlc3VsdDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxualF1ZXJ5LnJlbW92ZUV2ZW50ID0gZnVuY3Rpb24oIGVsZW0sIHR5cGUsIGhhbmRsZSApIHtcblxuXHQvLyBUaGlzIFwiaWZcIiBpcyBuZWVkZWQgZm9yIHBsYWluIG9iamVjdHNcblx0aWYgKCBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIgKSB7XG5cdFx0ZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBoYW5kbGUgKTtcblx0fVxufTtcblxualF1ZXJ5LkV2ZW50ID0gZnVuY3Rpb24oIHNyYywgcHJvcHMgKSB7XG5cblx0Ly8gQWxsb3cgaW5zdGFudGlhdGlvbiB3aXRob3V0IHRoZSAnbmV3JyBrZXl3b3JkXG5cdGlmICggISggdGhpcyBpbnN0YW5jZW9mIGpRdWVyeS5FdmVudCApICkge1xuXHRcdHJldHVybiBuZXcgalF1ZXJ5LkV2ZW50KCBzcmMsIHByb3BzICk7XG5cdH1cblxuXHQvLyBFdmVudCBvYmplY3Rcblx0aWYgKCBzcmMgJiYgc3JjLnR5cGUgKSB7XG5cdFx0dGhpcy5vcmlnaW5hbEV2ZW50ID0gc3JjO1xuXHRcdHRoaXMudHlwZSA9IHNyYy50eXBlO1xuXG5cdFx0Ly8gRXZlbnRzIGJ1YmJsaW5nIHVwIHRoZSBkb2N1bWVudCBtYXkgaGF2ZSBiZWVuIG1hcmtlZCBhcyBwcmV2ZW50ZWRcblx0XHQvLyBieSBhIGhhbmRsZXIgbG93ZXIgZG93biB0aGUgdHJlZTsgcmVmbGVjdCB0aGUgY29ycmVjdCB2YWx1ZS5cblx0XHR0aGlzLmlzRGVmYXVsdFByZXZlbnRlZCA9IHNyYy5kZWZhdWx0UHJldmVudGVkIHx8XG5cdFx0XHRcdHNyYy5kZWZhdWx0UHJldmVudGVkID09PSB1bmRlZmluZWQgJiZcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBBbmRyb2lkPDQuMFxuXHRcdFx0XHRzcmMucmV0dXJuVmFsdWUgPT09IGZhbHNlID9cblx0XHRcdHJldHVyblRydWUgOlxuXHRcdFx0cmV0dXJuRmFsc2U7XG5cblx0Ly8gRXZlbnQgdHlwZVxuXHR9IGVsc2Uge1xuXHRcdHRoaXMudHlwZSA9IHNyYztcblx0fVxuXG5cdC8vIFB1dCBleHBsaWNpdGx5IHByb3ZpZGVkIHByb3BlcnRpZXMgb250byB0aGUgZXZlbnQgb2JqZWN0XG5cdGlmICggcHJvcHMgKSB7XG5cdFx0alF1ZXJ5LmV4dGVuZCggdGhpcywgcHJvcHMgKTtcblx0fVxuXG5cdC8vIENyZWF0ZSBhIHRpbWVzdGFtcCBpZiBpbmNvbWluZyBldmVudCBkb2Vzbid0IGhhdmUgb25lXG5cdHRoaXMudGltZVN0YW1wID0gc3JjICYmIHNyYy50aW1lU3RhbXAgfHwgalF1ZXJ5Lm5vdygpO1xuXG5cdC8vIE1hcmsgaXQgYXMgZml4ZWRcblx0dGhpc1sgalF1ZXJ5LmV4cGFuZG8gXSA9IHRydWU7XG59O1xuXG4vLyBqUXVlcnkuRXZlbnQgaXMgYmFzZWQgb24gRE9NMyBFdmVudHMgYXMgc3BlY2lmaWVkIGJ5IHRoZSBFQ01BU2NyaXB0IExhbmd1YWdlIEJpbmRpbmdcbi8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMDMvV0QtRE9NLUxldmVsLTMtRXZlbnRzLTIwMDMwMzMxL2VjbWEtc2NyaXB0LWJpbmRpbmcuaHRtbFxualF1ZXJ5LkV2ZW50LnByb3RvdHlwZSA9IHtcblx0Y29uc3RydWN0b3I6IGpRdWVyeS5FdmVudCxcblx0aXNEZWZhdWx0UHJldmVudGVkOiByZXR1cm5GYWxzZSxcblx0aXNQcm9wYWdhdGlvblN0b3BwZWQ6IHJldHVybkZhbHNlLFxuXHRpc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZDogcmV0dXJuRmFsc2UsXG5cdGlzU2ltdWxhdGVkOiBmYWxzZSxcblxuXHRwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGUgPSB0aGlzLm9yaWdpbmFsRXZlbnQ7XG5cblx0XHR0aGlzLmlzRGVmYXVsdFByZXZlbnRlZCA9IHJldHVyblRydWU7XG5cblx0XHRpZiAoIGUgJiYgIXRoaXMuaXNTaW11bGF0ZWQgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXHR9LFxuXHRzdG9wUHJvcGFnYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBlID0gdGhpcy5vcmlnaW5hbEV2ZW50O1xuXG5cdFx0dGhpcy5pc1Byb3BhZ2F0aW9uU3RvcHBlZCA9IHJldHVyblRydWU7XG5cblx0XHRpZiAoIGUgJiYgIXRoaXMuaXNTaW11bGF0ZWQgKSB7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH1cblx0fSxcblx0c3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgZSA9IHRoaXMub3JpZ2luYWxFdmVudDtcblxuXHRcdHRoaXMuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQgPSByZXR1cm5UcnVlO1xuXG5cdFx0aWYgKCBlICYmICF0aGlzLmlzU2ltdWxhdGVkICkge1xuXHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cblx0XHR0aGlzLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9XG59O1xuXG4vLyBDcmVhdGUgbW91c2VlbnRlci9sZWF2ZSBldmVudHMgdXNpbmcgbW91c2VvdmVyL291dCBhbmQgZXZlbnQtdGltZSBjaGVja3Ncbi8vIHNvIHRoYXQgZXZlbnQgZGVsZWdhdGlvbiB3b3JrcyBpbiBqUXVlcnkuXG4vLyBEbyB0aGUgc2FtZSBmb3IgcG9pbnRlcmVudGVyL3BvaW50ZXJsZWF2ZSBhbmQgcG9pbnRlcm92ZXIvcG9pbnRlcm91dFxuLy9cbi8vIFN1cHBvcnQ6IFNhZmFyaSA3IG9ubHlcbi8vIFNhZmFyaSBzZW5kcyBtb3VzZWVudGVyIHRvbyBvZnRlbjsgc2VlOlxuLy8gaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ3MDI1OFxuLy8gZm9yIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgYnVnIChpdCBleGlzdGVkIGluIG9sZGVyIENocm9tZSB2ZXJzaW9ucyBhcyB3ZWxsKS5cbmpRdWVyeS5lYWNoKCB7XG5cdG1vdXNlZW50ZXI6IFwibW91c2VvdmVyXCIsXG5cdG1vdXNlbGVhdmU6IFwibW91c2VvdXRcIixcblx0cG9pbnRlcmVudGVyOiBcInBvaW50ZXJvdmVyXCIsXG5cdHBvaW50ZXJsZWF2ZTogXCJwb2ludGVyb3V0XCJcbn0sIGZ1bmN0aW9uKCBvcmlnLCBmaXggKSB7XG5cdGpRdWVyeS5ldmVudC5zcGVjaWFsWyBvcmlnIF0gPSB7XG5cdFx0ZGVsZWdhdGVUeXBlOiBmaXgsXG5cdFx0YmluZFR5cGU6IGZpeCxcblxuXHRcdGhhbmRsZTogZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0dmFyIHJldCxcblx0XHRcdFx0dGFyZ2V0ID0gdGhpcyxcblx0XHRcdFx0cmVsYXRlZCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQsXG5cdFx0XHRcdGhhbmRsZU9iaiA9IGV2ZW50LmhhbmRsZU9iajtcblxuXHRcdFx0Ly8gRm9yIG1vdXNlZW50ZXIvbGVhdmUgY2FsbCB0aGUgaGFuZGxlciBpZiByZWxhdGVkIGlzIG91dHNpZGUgdGhlIHRhcmdldC5cblx0XHRcdC8vIE5COiBObyByZWxhdGVkVGFyZ2V0IGlmIHRoZSBtb3VzZSBsZWZ0L2VudGVyZWQgdGhlIGJyb3dzZXIgd2luZG93XG5cdFx0XHRpZiAoICFyZWxhdGVkIHx8ICggcmVsYXRlZCAhPT0gdGFyZ2V0ICYmICFqUXVlcnkuY29udGFpbnMoIHRhcmdldCwgcmVsYXRlZCApICkgKSB7XG5cdFx0XHRcdGV2ZW50LnR5cGUgPSBoYW5kbGVPYmoub3JpZ1R5cGU7XG5cdFx0XHRcdHJldCA9IGhhbmRsZU9iai5oYW5kbGVyLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblx0XHRcdFx0ZXZlbnQudHlwZSA9IGZpeDtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fVxuXHR9O1xufSApO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKCB7XG5cdG9uOiBmdW5jdGlvbiggdHlwZXMsIHNlbGVjdG9yLCBkYXRhLCBmbiApIHtcblx0XHRyZXR1cm4gb24oIHRoaXMsIHR5cGVzLCBzZWxlY3RvciwgZGF0YSwgZm4gKTtcblx0fSxcblx0b25lOiBmdW5jdGlvbiggdHlwZXMsIHNlbGVjdG9yLCBkYXRhLCBmbiApIHtcblx0XHRyZXR1cm4gb24oIHRoaXMsIHR5cGVzLCBzZWxlY3RvciwgZGF0YSwgZm4sIDEgKTtcblx0fSxcblx0b2ZmOiBmdW5jdGlvbiggdHlwZXMsIHNlbGVjdG9yLCBmbiApIHtcblx0XHR2YXIgaGFuZGxlT2JqLCB0eXBlO1xuXHRcdGlmICggdHlwZXMgJiYgdHlwZXMucHJldmVudERlZmF1bHQgJiYgdHlwZXMuaGFuZGxlT2JqICkge1xuXG5cdFx0XHQvLyAoIGV2ZW50ICkgIGRpc3BhdGNoZWQgalF1ZXJ5LkV2ZW50XG5cdFx0XHRoYW5kbGVPYmogPSB0eXBlcy5oYW5kbGVPYmo7XG5cdFx0XHRqUXVlcnkoIHR5cGVzLmRlbGVnYXRlVGFyZ2V0ICkub2ZmKFxuXHRcdFx0XHRoYW5kbGVPYmoubmFtZXNwYWNlID9cblx0XHRcdFx0XHRoYW5kbGVPYmoub3JpZ1R5cGUgKyBcIi5cIiArIGhhbmRsZU9iai5uYW1lc3BhY2UgOlxuXHRcdFx0XHRcdGhhbmRsZU9iai5vcmlnVHlwZSxcblx0XHRcdFx0aGFuZGxlT2JqLnNlbGVjdG9yLFxuXHRcdFx0XHRoYW5kbGVPYmouaGFuZGxlclxuXHRcdFx0KTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0XHRpZiAoIHR5cGVvZiB0eXBlcyA9PT0gXCJvYmplY3RcIiApIHtcblxuXHRcdFx0Ly8gKCB0eXBlcy1vYmplY3QgWywgc2VsZWN0b3JdIClcblx0XHRcdGZvciAoIHR5cGUgaW4gdHlwZXMgKSB7XG5cdFx0XHRcdHRoaXMub2ZmKCB0eXBlLCBzZWxlY3RvciwgdHlwZXNbIHR5cGUgXSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHRcdGlmICggc2VsZWN0b3IgPT09IGZhbHNlIHx8IHR5cGVvZiBzZWxlY3RvciA9PT0gXCJmdW5jdGlvblwiICkge1xuXG5cdFx0XHQvLyAoIHR5cGVzIFssIGZuXSApXG5cdFx0XHRmbiA9IHNlbGVjdG9yO1xuXHRcdFx0c2VsZWN0b3IgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdGlmICggZm4gPT09IGZhbHNlICkge1xuXHRcdFx0Zm4gPSByZXR1cm5GYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkuZXZlbnQucmVtb3ZlKCB0aGlzLCB0eXBlcywgZm4sIHNlbGVjdG9yICk7XG5cdFx0fSApO1xuXHR9XG59ICk7XG5cbnJldHVybiBqUXVlcnk7XG59ICk7XG4iXX0=