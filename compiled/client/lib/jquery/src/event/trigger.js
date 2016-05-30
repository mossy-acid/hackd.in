"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(["../core", "../var/document", "../data/var/dataPriv", "../data/var/acceptData", "../var/hasOwn", "../event"], function (jQuery, document, dataPriv, acceptData, hasOwn) {

	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

	jQuery.extend(jQuery.event, {

		trigger: function trigger(event, data, elem, onlyHandlers) {

			var i,
			    cur,
			    tmp,
			    bubbleType,
			    ontype,
			    handle,
			    special,
			    eventPath = [elem || document],
			    type = hasOwn.call(event, "type") ? event.type : event,
			    namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

			cur = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if (elem.nodeType === 3 || elem.nodeType === 8) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if (rfocusMorph.test(type + jQuery.event.triggered)) {
				return;
			}

			if (type.indexOf(".") > -1) {

				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf(":") < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[jQuery.expando] ? event : new jQuery.Event(type, (typeof event === "undefined" ? "undefined" : _typeof(event)) === "object" && event);

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join(".");
			event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if (!event.target) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ? [event] : jQuery.makeArray(data, [event]);

			// Allow special events to draw outside the lines
			special = jQuery.event.special[type] || {};
			if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

				bubbleType = special.delegateType || type;
				if (!rfocusMorph.test(bubbleType + type)) {
					cur = cur.parentNode;
				}
				for (; cur; cur = cur.parentNode) {
					eventPath.push(cur);
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if (tmp === (elem.ownerDocument || document)) {
					eventPath.push(tmp.defaultView || tmp.parentWindow || window);
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {

				event.type = i > 1 ? bubbleType : special.bindType || type;

				// jQuery handler
				handle = (dataPriv.get(cur, "events") || {})[event.type] && dataPriv.get(cur, "handle");
				if (handle) {
					handle.apply(cur, data);
				}

				// Native handler
				handle = ontype && cur[ontype];
				if (handle && handle.apply && acceptData(cur)) {
					event.result = handle.apply(cur, data);
					if (event.result === false) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if (!onlyHandlers && !event.isDefaultPrevented()) {

				if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {

					// Call a native DOM method on the target with the same name name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if (ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem)) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ontype];

						if (tmp) {
							elem[ontype] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[type]();
						jQuery.event.triggered = undefined;

						if (tmp) {
							elem[ontype] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		// Piggyback on a donor event to simulate a different one
		// Used only for `focus(in | out)` events
		simulate: function simulate(type, elem, event) {
			var e = jQuery.extend(new jQuery.Event(), event, {
				type: type,
				isSimulated: true
			});

			jQuery.event.trigger(e, null, elem);
		}

	});

	jQuery.fn.extend({

		trigger: function trigger(type, data) {
			return this.each(function () {
				jQuery.event.trigger(type, data, this);
			});
		},
		triggerHandler: function triggerHandler(type, data) {
			var elem = this[0];
			if (elem) {
				return jQuery.event.trigger(type, data, elem, true);
			}
		}
	});

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9ldmVudC90cmlnZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFRLENBQ1AsU0FETyxFQUVQLGlCQUZPLEVBR1Asc0JBSE8sRUFJUCx3QkFKTyxFQUtQLGVBTE8sRUFPUCxVQVBPLENBQVIsRUFRRyxVQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNEIsUUFBNUIsRUFBc0MsVUFBdEMsRUFBa0QsTUFBbEQsRUFBMkQ7O0FBRTlELEtBQUksY0FBYyxpQ0FBbEI7O0FBRUEsUUFBTyxNQUFQLENBQWUsT0FBTyxLQUF0QixFQUE2Qjs7QUFFNUIsV0FBUyxpQkFBVSxLQUFWLEVBQWlCLElBQWpCLEVBQXVCLElBQXZCLEVBQTZCLFlBQTdCLEVBQTRDOztBQUVwRCxPQUFJLENBQUo7T0FBTyxHQUFQO09BQVksR0FBWjtPQUFpQixVQUFqQjtPQUE2QixNQUE3QjtPQUFxQyxNQUFyQztPQUE2QyxPQUE3QztPQUNDLFlBQVksQ0FBRSxRQUFRLFFBQVYsQ0FEYjtPQUVDLE9BQU8sT0FBTyxJQUFQLENBQWEsS0FBYixFQUFvQixNQUFwQixJQUErQixNQUFNLElBQXJDLEdBQTRDLEtBRnBEO09BR0MsYUFBYSxPQUFPLElBQVAsQ0FBYSxLQUFiLEVBQW9CLFdBQXBCLElBQW9DLE1BQU0sU0FBTixDQUFnQixLQUFoQixDQUF1QixHQUF2QixDQUFwQyxHQUFtRSxFQUhqRjs7QUFLQSxTQUFNLE1BQU0sT0FBTyxRQUFRLFFBQTNCOzs7QUFHQSxPQUFLLEtBQUssUUFBTCxLQUFrQixDQUFsQixJQUF1QixLQUFLLFFBQUwsS0FBa0IsQ0FBOUMsRUFBa0Q7QUFDakQ7QUFDQTs7O0FBR0QsT0FBSyxZQUFZLElBQVosQ0FBa0IsT0FBTyxPQUFPLEtBQVAsQ0FBYSxTQUF0QyxDQUFMLEVBQXlEO0FBQ3hEO0FBQ0E7O0FBRUQsT0FBSyxLQUFLLE9BQUwsQ0FBYyxHQUFkLElBQXNCLENBQUMs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QWdCLElBQWhCLEVBQXVCO0FBQy9CLFVBQU8sS0FBSyxJQUFMLENBQVcsWUFBVztBQUM1QixXQUFPLEtBQVAsQ0FBYSxPQUFiLENBQXNCLElBQXRCLEVBQTRCLElBQTVCLEVBQWtDLElBQWxDO0FBQ0EsSUFGTSxDQUFQO0FBR0EsR0FOZ0I7QUFPakIsa0JBQWdCLHdCQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBdUI7QUFDdEMsT0FBSSxPQUFPLEtBQU0sQ0FBTixDQUFYO0FBQ0EsT0FBSyxJQUFMLEVBQVk7QUFDWCxXQUFPLE9BQU8sS0FBUCxDQUFhLE9BQWIsQ0FBc0IsSUFBdEIsRUFBNEIsSUFBNUIsRUFBa0MsSUFBbEMsRUFBd0MsSUFBeEMsQ0FBUDtBQUNBO0FBQ0Q7QUFaZ0IsRUFBbEI7O0FBZUEsUUFBTyxNQUFQO0FBQ0MsQ0F0TEQiLCJmaWxlIjoidHJpZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4uL2NvcmVcIixcblx0XCIuLi92YXIvZG9jdW1lbnRcIixcblx0XCIuLi9kYXRhL3Zhci9kYXRhUHJpdlwiLFxuXHRcIi4uL2RhdGEvdmFyL2FjY2VwdERhdGFcIixcblx0XCIuLi92YXIvaGFzT3duXCIsXG5cblx0XCIuLi9ldmVudFwiXG5dLCBmdW5jdGlvbiggalF1ZXJ5LCBkb2N1bWVudCwgZGF0YVByaXYsIGFjY2VwdERhdGEsIGhhc093biApIHtcblxudmFyIHJmb2N1c01vcnBoID0gL14oPzpmb2N1c2luZm9jdXN8Zm9jdXNvdXRibHVyKSQvO1xuXG5qUXVlcnkuZXh0ZW5kKCBqUXVlcnkuZXZlbnQsIHtcblxuXHR0cmlnZ2VyOiBmdW5jdGlvbiggZXZlbnQsIGRhdGEsIGVsZW0sIG9ubHlIYW5kbGVycyApIHtcblxuXHRcdHZhciBpLCBjdXIsIHRtcCwgYnViYmxlVHlwZSwgb250eXBlLCBoYW5kbGUsIHNwZWNpYWwsXG5cdFx0XHRldmVudFBhdGggPSBbIGVsZW0gfHwgZG9jdW1lbnQgXSxcblx0XHRcdHR5cGUgPSBoYXNPd24uY2FsbCggZXZlbnQsIFwidHlwZVwiICkgPyBldmVudC50eXBlIDogZXZlbnQsXG5cdFx0XHRuYW1lc3BhY2VzID0gaGFzT3duLmNhbGwoIGV2ZW50LCBcIm5hbWVzcGFjZVwiICkgPyBldmVudC5uYW1lc3BhY2Uuc3BsaXQoIFwiLlwiICkgOiBbXTtcblxuXHRcdGN1ciA9IHRtcCA9IGVsZW0gPSBlbGVtIHx8IGRvY3VtZW50O1xuXG5cdFx0Ly8gRG9uJ3QgZG8gZXZlbnRzIG9uIHRleHQgYW5kIGNvbW1lbnQgbm9kZXNcblx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDMgfHwgZWxlbS5ub2RlVHlwZSA9PT0gOCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBmb2N1cy9ibHVyIG1vcnBocyB0byBmb2N1c2luL291dDsgZW5zdXJlIHdlJ3JlIG5vdCBmaXJpbmcgdGhlbSByaWdodCBub3dcblx0XHRpZiAoIHJmb2N1c01vcnBoLnRlc3QoIHR5cGUgKyBqUXVlcnkuZXZlbnQudHJpZ2dlcmVkICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlLmluZGV4T2YoIFwiLlwiICkgPiAtMSApIHtcblxuXHRcdFx0Ly8gTmFtZXNwYWNlZCB0cmlnZ2VyOyBjcmVhdGUgYSByZWdleHAgdG8gbWF0Y2ggZXZlbnQgdHlwZSBpbiBoYW5kbGUoKVxuXHRcdFx0bmFtZXNwYWNlcyA9IHR5cGUuc3BsaXQoIFwiLlwiICk7XG5cdFx0XHR0eXBlID0gbmFtZXNwYWNlcy5zaGlmdCgpO1xuXHRcdFx0bmFtZXNwYWNlcy5zb3J0KCk7XG5cdFx0fVxuXHRcdG9udHlwZSA9IHR5cGUuaW5kZXhPZiggXCI6XCIgKSA8IDAgJiYgXCJvblwiICsgdHlwZTtcblxuXHRcdC8vIENhbGxlciBjYW4gcGFzcyBpbiBhIGpRdWVyeS5FdmVudCBvYmplY3QsIE9iamVjdCwgb3IganVzdCBhbiBldmVudCB0eXBlIHN0cmluZ1xuXHRcdGV2ZW50ID0gZXZlbnRbIGpRdWVyeS5leHBhbmRvIF0gP1xuXHRcdFx0ZXZlbnQgOlxuXHRcdFx0bmV3IGpRdWVyeS5FdmVudCggdHlwZSwgdHlwZW9mIGV2ZW50ID09PSBcIm9iamVjdFwiICYmIGV2ZW50ICk7XG5cblx0XHQvLyBUcmlnZ2VyIGJpdG1hc2s6ICYgMSBmb3IgbmF0aXZlIGhhbmRsZXJzOyAmIDIgZm9yIGpRdWVyeSAoYWx3YXlzIHRydWUpXG5cdFx0ZXZlbnQuaXNUcmlnZ2VyID0gb25seUhhbmRsZXJzID8gMiA6IDM7XG5cdFx0ZXZlbnQubmFtZXNwYWNlID0gbmFtZXNwYWNlcy5qb2luKCBcIi5cIiApO1xuXHRcdGV2ZW50LnJuYW1lc3BhY2UgPSBldmVudC5uYW1lc3BhY2UgP1xuXHRcdFx0bmV3IFJlZ0V4cCggXCIoXnxcXFxcLilcIiArIG5hbWVzcGFjZXMuam9pbiggXCJcXFxcLig/Oi4qXFxcXC58KVwiICkgKyBcIihcXFxcLnwkKVwiICkgOlxuXHRcdFx0bnVsbDtcblxuXHRcdC8vIENsZWFuIHVwIHRoZSBldmVudCBpbiBjYXNlIGl0IGlzIGJlaW5nIHJldXNlZFxuXHRcdGV2ZW50LnJlc3VsdCA9IHVuZGVmaW5lZDtcblx0XHRpZiAoICFldmVudC50YXJnZXQgKSB7XG5cdFx0XHRldmVudC50YXJnZXQgPSBlbGVtO1xuXHRcdH1cblxuXHRcdC8vIENsb25lIGFueSBpbmNvbWluZyBkYXRhIGFuZCBwcmVwZW5kIHRoZSBldmVudCwgY3JlYXRpbmcgdGhlIGhhbmRsZXIgYXJnIGxpc3Rcblx0XHRkYXRhID0gZGF0YSA9PSBudWxsID9cblx0XHRcdFsgZXZlbnQgXSA6XG5cdFx0XHRqUXVlcnkubWFrZUFycmF5KCBkYXRhLCBbIGV2ZW50IF0gKTtcblxuXHRcdC8vIEFsbG93IHNwZWNpYWwgZXZlbnRzIHRvIGRyYXcgb3V0c2lkZSB0aGUgbGluZXNcblx0XHRzcGVjaWFsID0galF1ZXJ5LmV2ZW50LnNwZWNpYWxbIHR5cGUgXSB8fCB7fTtcblx0XHRpZiAoICFvbmx5SGFuZGxlcnMgJiYgc3BlY2lhbC50cmlnZ2VyICYmIHNwZWNpYWwudHJpZ2dlci5hcHBseSggZWxlbSwgZGF0YSApID09PSBmYWxzZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBEZXRlcm1pbmUgZXZlbnQgcHJvcGFnYXRpb24gcGF0aCBpbiBhZHZhbmNlLCBwZXIgVzNDIGV2ZW50cyBzcGVjICgjOTk1MSlcblx0XHQvLyBCdWJibGUgdXAgdG8gZG9jdW1lbnQsIHRoZW4gdG8gd2luZG93OyB3YXRjaCBmb3IgYSBnbG9iYWwgb3duZXJEb2N1bWVudCB2YXIgKCM5NzI0KVxuXHRcdGlmICggIW9ubHlIYW5kbGVycyAmJiAhc3BlY2lhbC5ub0J1YmJsZSAmJiAhalF1ZXJ5LmlzV2luZG93KCBlbGVtICkgKSB7XG5cblx0XHRcdGJ1YmJsZVR5cGUgPSBzcGVjaWFsLmRlbGVnYXRlVHlwZSB8fCB0eXBlO1xuXHRcdFx0aWYgKCAhcmZvY3VzTW9ycGgudGVzdCggYnViYmxlVHlwZSArIHR5cGUgKSApIHtcblx0XHRcdFx0Y3VyID0gY3VyLnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKCA7IGN1cjsgY3VyID0gY3VyLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdGV2ZW50UGF0aC5wdXNoKCBjdXIgKTtcblx0XHRcdFx0dG1wID0gY3VyO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBPbmx5IGFkZCB3aW5kb3cgaWYgd2UgZ290IHRvIGRvY3VtZW50IChlLmcuLCBub3QgcGxhaW4gb2JqIG9yIGRldGFjaGVkIERPTSlcblx0XHRcdGlmICggdG1wID09PSAoIGVsZW0ub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCApICkge1xuXHRcdFx0XHRldmVudFBhdGgucHVzaCggdG1wLmRlZmF1bHRWaWV3IHx8IHRtcC5wYXJlbnRXaW5kb3cgfHwgd2luZG93ICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRmlyZSBoYW5kbGVycyBvbiB0aGUgZXZlbnQgcGF0aFxuXHRcdGkgPSAwO1xuXHRcdHdoaWxlICggKCBjdXIgPSBldmVudFBhdGhbIGkrKyBdICkgJiYgIWV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkKCkgKSB7XG5cblx0XHRcdGV2ZW50LnR5cGUgPSBpID4gMSA/XG5cdFx0XHRcdGJ1YmJsZVR5cGUgOlxuXHRcdFx0XHRzcGVjaWFsLmJpbmRUeXBlIHx8IHR5cGU7XG5cblx0XHRcdC8vIGpRdWVyeSBoYW5kbGVyXG5cdFx0XHRoYW5kbGUgPSAoIGRhdGFQcml2LmdldCggY3VyLCBcImV2ZW50c1wiICkgfHwge30gKVsgZXZlbnQudHlwZSBdICYmXG5cdFx0XHRcdGRhdGFQcml2LmdldCggY3VyLCBcImhhbmRsZVwiICk7XG5cdFx0XHRpZiAoIGhhbmRsZSApIHtcblx0XHRcdFx0aGFuZGxlLmFwcGx5KCBjdXIsIGRhdGEgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gTmF0aXZlIGhhbmRsZXJcblx0XHRcdGhhbmRsZSA9IG9udHlwZSAmJiBjdXJbIG9udHlwZSBdO1xuXHRcdFx0aWYgKCBoYW5kbGUgJiYgaGFuZGxlLmFwcGx5ICYmIGFjY2VwdERhdGEoIGN1ciApICkge1xuXHRcdFx0XHRldmVudC5yZXN1bHQgPSBoYW5kbGUuYXBwbHkoIGN1ciwgZGF0YSApO1xuXHRcdFx0XHRpZiAoIGV2ZW50LnJlc3VsdCA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRldmVudC50eXBlID0gdHlwZTtcblxuXHRcdC8vIElmIG5vYm9keSBwcmV2ZW50ZWQgdGhlIGRlZmF1bHQgYWN0aW9uLCBkbyBpdCBub3dcblx0XHRpZiAoICFvbmx5SGFuZGxlcnMgJiYgIWV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpICkge1xuXG5cdFx0XHRpZiAoICggIXNwZWNpYWwuX2RlZmF1bHQgfHxcblx0XHRcdFx0c3BlY2lhbC5fZGVmYXVsdC5hcHBseSggZXZlbnRQYXRoLnBvcCgpLCBkYXRhICkgPT09IGZhbHNlICkgJiZcblx0XHRcdFx0YWNjZXB0RGF0YSggZWxlbSApICkge1xuXG5cdFx0XHRcdC8vIENhbGwgYSBuYXRpdmUgRE9NIG1ldGhvZCBvbiB0aGUgdGFyZ2V0IHdpdGggdGhlIHNhbWUgbmFtZSBuYW1lIGFzIHRoZSBldmVudC5cblx0XHRcdFx0Ly8gRG9uJ3QgZG8gZGVmYXVsdCBhY3Rpb25zIG9uIHdpbmRvdywgdGhhdCdzIHdoZXJlIGdsb2JhbCB2YXJpYWJsZXMgYmUgKCM2MTcwKVxuXHRcdFx0XHRpZiAoIG9udHlwZSAmJiBqUXVlcnkuaXNGdW5jdGlvbiggZWxlbVsgdHlwZSBdICkgJiYgIWpRdWVyeS5pc1dpbmRvdyggZWxlbSApICkge1xuXG5cdFx0XHRcdFx0Ly8gRG9uJ3QgcmUtdHJpZ2dlciBhbiBvbkZPTyBldmVudCB3aGVuIHdlIGNhbGwgaXRzIEZPTygpIG1ldGhvZFxuXHRcdFx0XHRcdHRtcCA9IGVsZW1bIG9udHlwZSBdO1xuXG5cdFx0XHRcdFx0aWYgKCB0bXAgKSB7XG5cdFx0XHRcdFx0XHRlbGVtWyBvbnR5cGUgXSA9IG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gUHJldmVudCByZS10cmlnZ2VyaW5nIG9mIHRoZSBzYW1lIGV2ZW50LCBzaW5jZSB3ZSBhbHJlYWR5IGJ1YmJsZWQgaXQgYWJvdmVcblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlcmVkID0gdHlwZTtcblx0XHRcdFx0XHRlbGVtWyB0eXBlIF0oKTtcblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlcmVkID0gdW5kZWZpbmVkO1xuXG5cdFx0XHRcdFx0aWYgKCB0bXAgKSB7XG5cdFx0XHRcdFx0XHRlbGVtWyBvbnR5cGUgXSA9IHRtcDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZXZlbnQucmVzdWx0O1xuXHR9LFxuXG5cdC8vIFBpZ2d5YmFjayBvbiBhIGRvbm9yIGV2ZW50IHRvIHNpbXVsYXRlIGEgZGlmZmVyZW50IG9uZVxuXHQvLyBVc2VkIG9ubHkgZm9yIGBmb2N1cyhpbiB8IG91dClgIGV2ZW50c1xuXHRzaW11bGF0ZTogZnVuY3Rpb24oIHR5cGUsIGVsZW0sIGV2ZW50ICkge1xuXHRcdHZhciBlID0galF1ZXJ5LmV4dGVuZChcblx0XHRcdG5ldyBqUXVlcnkuRXZlbnQoKSxcblx0XHRcdGV2ZW50LFxuXHRcdFx0e1xuXHRcdFx0XHR0eXBlOiB0eXBlLFxuXHRcdFx0XHRpc1NpbXVsYXRlZDogdHJ1ZVxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlciggZSwgbnVsbCwgZWxlbSApO1xuXHR9XG5cbn0gKTtcblxualF1ZXJ5LmZuLmV4dGVuZCgge1xuXG5cdHRyaWdnZXI6IGZ1bmN0aW9uKCB0eXBlLCBkYXRhICkge1xuXHRcdHJldHVybiB0aGlzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXIoIHR5cGUsIGRhdGEsIHRoaXMgKTtcblx0XHR9ICk7XG5cdH0sXG5cdHRyaWdnZXJIYW5kbGVyOiBmdW5jdGlvbiggdHlwZSwgZGF0YSApIHtcblx0XHR2YXIgZWxlbSA9IHRoaXNbIDAgXTtcblx0XHRpZiAoIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4galF1ZXJ5LmV2ZW50LnRyaWdnZXIoIHR5cGUsIGRhdGEsIGVsZW0sIHRydWUgKTtcblx0XHR9XG5cdH1cbn0gKTtcblxucmV0dXJuIGpRdWVyeTtcbn0gKTtcbiJdfQ==