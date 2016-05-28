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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9ldmVudC90cmlnZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFRLENBQ1AsU0FETyxFQUVQLGlCQUZPLEVBR1Asc0JBSE8sRUFJUCx3QkFKTyxFQUtQLGVBTE8sRUFPUCxVQVBPLENBQVIsRUFRRyxVQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNEIsUUFBNUIsRUFBc0MsVUFBdEMsRUFBa0QsTUFBbEQsRUFBMkQ7O0FBRTlELEtBQUksY0FBYyxpQ0FBZCxDQUYwRDs7QUFJOUQsUUFBTyxNQUFQLENBQWUsT0FBTyxLQUFQLEVBQWM7O0FBRTVCLFdBQVMsaUJBQVUsS0FBVixFQUFpQixJQUFqQixFQUF1QixJQUF2QixFQUE2QixZQUE3QixFQUE0Qzs7QUFFcEQsT0FBSSxDQUFKO09BQU8sR0FBUDtPQUFZLEdBQVo7T0FBaUIsVUFBakI7T0FBNkIsTUFBN0I7T0FBcUMsTUFBckM7T0FBNkMsT0FBN0M7T0FDQyxZQUFZLENBQUUsUUFBUSxRQUFSLENBQWQ7T0FDQSxPQUFPLE9BQU8sSUFBUCxDQUFhLEtBQWIsRUFBb0IsTUFBcEIsSUFBK0IsTUFBTSxJQUFOLEdBQWEsS0FBNUM7T0FDUCxhQUFhLE9BQU8sSUFBUCxDQUFhLEtBQWIsRUFBb0IsV0FBcEIsSUFBb0MsTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXVCLEdBQXZCLENBQXBDLEdBQW1FLEVBQW5FLENBTHNDOztBQU9wRCxTQUFNLE1BQU0sT0FBTyxRQUFRLFFBQVI7OztBQVBpQyxPQVUvQyxLQUFLLFFBQUwsS0FBa0IsQ0FBbEIsSUFBdUIsS0FBSyxRQUFMLEtBQWtCLENBQWxCLEVBQXNCO0FBQ2pELFdBRGlEO0lBQWxEOzs7QUFWb0QsT0FlL0MsWUFBWSxJQUFaLENBQWtCLE9BQU8sT0FBTyxLQUFQLENBQWEsU0FBYixDQUE5QixFQUF5RDtBQUN4RCxXQUR3RDtJQUF6RDs7QUFJQSxPQUFLLEtBQUssT0FB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Qzs7OztBQXlJVCxZQUFVLGtCQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0IsS0FBdEIsRUFBOEI7QUFDdkMsT0FBSSxJQUFJLE9BQU8sTUFBUCxDQUNQLElBQUksT0FBTyxLQUFQLEVBREcsRUFFUCxLQUZPLEVBR1A7QUFDQyxVQUFNLElBQU47QUFDQSxpQkFBYSxJQUFiO0lBTE0sQ0FBSixDQURtQzs7QUFVdkMsVUFBTyxLQUFQLENBQWEsT0FBYixDQUFzQixDQUF0QixFQUF5QixJQUF6QixFQUErQixJQUEvQixFQVZ1QztHQUE5Qjs7RUEzSVgsRUFKOEQ7O0FBOEo5RCxRQUFPLEVBQVAsQ0FBVSxNQUFWLENBQWtCOztBQUVqQixXQUFTLGlCQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBdUI7QUFDL0IsVUFBTyxLQUFLLElBQUwsQ0FBVyxZQUFXO0FBQzVCLFdBQU8sS0FBUCxDQUFhLE9BQWIsQ0FBc0IsSUFBdEIsRUFBNEIsSUFBNUIsRUFBa0MsSUFBbEMsRUFENEI7SUFBWCxDQUFsQixDQUQrQjtHQUF2QjtBQUtULGtCQUFnQix3QkFBVSxJQUFWLEVBQWdCLElBQWhCLEVBQXVCO0FBQ3RDLE9BQUksT0FBTyxLQUFNLENBQU4sQ0FBUCxDQURrQztBQUV0QyxPQUFLLElBQUwsRUFBWTtBQUNYLFdBQU8sT0FBTyxLQUFQLENBQWEsT0FBYixDQUFzQixJQUF0QixFQUE0QixJQUE1QixFQUFrQyxJQUFsQyxFQUF3QyxJQUF4QyxDQUFQLENBRFc7SUFBWjtHQUZlO0VBUGpCLEVBOUo4RDs7QUE2SzlELFFBQU8sTUFBUCxDQTdLOEQ7Q0FBM0QsQ0FSSCIsImZpbGUiOiJ0cmlnZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBbXG5cdFwiLi4vY29yZVwiLFxuXHRcIi4uL3Zhci9kb2N1bWVudFwiLFxuXHRcIi4uL2RhdGEvdmFyL2RhdGFQcml2XCIsXG5cdFwiLi4vZGF0YS92YXIvYWNjZXB0RGF0YVwiLFxuXHRcIi4uL3Zhci9oYXNPd25cIixcblxuXHRcIi4uL2V2ZW50XCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIGRvY3VtZW50LCBkYXRhUHJpdiwgYWNjZXB0RGF0YSwgaGFzT3duICkge1xuXG52YXIgcmZvY3VzTW9ycGggPSAvXig/OmZvY3VzaW5mb2N1c3xmb2N1c291dGJsdXIpJC87XG5cbmpRdWVyeS5leHRlbmQoIGpRdWVyeS5ldmVudCwge1xuXG5cdHRyaWdnZXI6IGZ1bmN0aW9uKCBldmVudCwgZGF0YSwgZWxlbSwgb25seUhhbmRsZXJzICkge1xuXG5cdFx0dmFyIGksIGN1ciwgdG1wLCBidWJibGVUeXBlLCBvbnR5cGUsIGhhbmRsZSwgc3BlY2lhbCxcblx0XHRcdGV2ZW50UGF0aCA9IFsgZWxlbSB8fCBkb2N1bWVudCBdLFxuXHRcdFx0dHlwZSA9IGhhc093bi5jYWxsKCBldmVudCwgXCJ0eXBlXCIgKSA/IGV2ZW50LnR5cGUgOiBldmVudCxcblx0XHRcdG5hbWVzcGFjZXMgPSBoYXNPd24uY2FsbCggZXZlbnQsIFwibmFtZXNwYWNlXCIgKSA/IGV2ZW50Lm5hbWVzcGFjZS5zcGxpdCggXCIuXCIgKSA6IFtdO1xuXG5cdFx0Y3VyID0gdG1wID0gZWxlbSA9IGVsZW0gfHwgZG9jdW1lbnQ7XG5cblx0XHQvLyBEb24ndCBkbyBldmVudHMgb24gdGV4dCBhbmQgY29tbWVudCBub2Rlc1xuXHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMyB8fCBlbGVtLm5vZGVUeXBlID09PSA4ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIGZvY3VzL2JsdXIgbW9ycGhzIHRvIGZvY3VzaW4vb3V0OyBlbnN1cmUgd2UncmUgbm90IGZpcmluZyB0aGVtIHJpZ2h0IG5vd1xuXHRcdGlmICggcmZvY3VzTW9ycGgudGVzdCggdHlwZSArIGpRdWVyeS5ldmVudC50cmlnZ2VyZWQgKSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGUuaW5kZXhPZiggXCIuXCIgKSA+IC0xICkge1xuXG5cdFx0XHQvLyBOYW1lc3BhY2VkIHRyaWdnZXI7IGNyZWF0ZSBhIHJlZ2V4cCB0byBtYXRjaCBldmVudCB0eXBlIGluIGhhbmRsZSgpXG5cdFx0XHRuYW1lc3BhY2VzID0gdHlwZS5zcGxpdCggXCIuXCIgKTtcblx0XHRcdHR5cGUgPSBuYW1lc3BhY2VzLnNoaWZ0KCk7XG5cdFx0XHRuYW1lc3BhY2VzLnNvcnQoKTtcblx0XHR9XG5cdFx0b250eXBlID0gdHlwZS5pbmRleE9mKCBcIjpcIiApIDwgMCAmJiBcIm9uXCIgKyB0eXBlO1xuXG5cdFx0Ly8gQ2FsbGVyIGNhbiBwYXNzIGluIGEgalF1ZXJ5LkV2ZW50IG9iamVjdCwgT2JqZWN0LCBvciBqdXN0IGFuIGV2ZW50IHR5cGUgc3RyaW5nXG5cdFx0ZXZlbnQgPSBldmVudFsgalF1ZXJ5LmV4cGFuZG8gXSA/XG5cdFx0XHRldmVudCA6XG5cdFx0XHRuZXcgalF1ZXJ5LkV2ZW50KCB0eXBlLCB0eXBlb2YgZXZlbnQgPT09IFwib2JqZWN0XCIgJiYgZXZlbnQgKTtcblxuXHRcdC8vIFRyaWdnZXIgYml0bWFzazogJiAxIGZvciBuYXRpdmUgaGFuZGxlcnM7ICYgMiBmb3IgalF1ZXJ5IChhbHdheXMgdHJ1ZSlcblx0XHRldmVudC5pc1RyaWdnZXIgPSBvbmx5SGFuZGxlcnMgPyAyIDogMztcblx0XHRldmVudC5uYW1lc3BhY2UgPSBuYW1lc3BhY2VzLmpvaW4oIFwiLlwiICk7XG5cdFx0ZXZlbnQucm5hbWVzcGFjZSA9IGV2ZW50Lm5hbWVzcGFjZSA/XG5cdFx0XHRuZXcgUmVnRXhwKCBcIihefFxcXFwuKVwiICsgbmFtZXNwYWNlcy5qb2luKCBcIlxcXFwuKD86LipcXFxcLnwpXCIgKSArIFwiKFxcXFwufCQpXCIgKSA6XG5cdFx0XHRudWxsO1xuXG5cdFx0Ly8gQ2xlYW4gdXAgdGhlIGV2ZW50IGluIGNhc2UgaXQgaXMgYmVpbmcgcmV1c2VkXG5cdFx0ZXZlbnQucmVzdWx0ID0gdW5kZWZpbmVkO1xuXHRcdGlmICggIWV2ZW50LnRhcmdldCApIHtcblx0XHRcdGV2ZW50LnRhcmdldCA9IGVsZW07XG5cdFx0fVxuXG5cdFx0Ly8gQ2xvbmUgYW55IGluY29taW5nIGRhdGEgYW5kIHByZXBlbmQgdGhlIGV2ZW50LCBjcmVhdGluZyB0aGUgaGFuZGxlciBhcmcgbGlzdFxuXHRcdGRhdGEgPSBkYXRhID09IG51bGwgP1xuXHRcdFx0WyBldmVudCBdIDpcblx0XHRcdGpRdWVyeS5tYWtlQXJyYXkoIGRhdGEsIFsgZXZlbnQgXSApO1xuXG5cdFx0Ly8gQWxsb3cgc3BlY2lhbCBldmVudHMgdG8gZHJhdyBvdXRzaWRlIHRoZSBsaW5lc1xuXHRcdHNwZWNpYWwgPSBqUXVlcnkuZXZlbnQuc3BlY2lhbFsgdHlwZSBdIHx8IHt9O1xuXHRcdGlmICggIW9ubHlIYW5kbGVycyAmJiBzcGVjaWFsLnRyaWdnZXIgJiYgc3BlY2lhbC50cmlnZ2VyLmFwcGx5KCBlbGVtLCBkYXRhICkgPT09IGZhbHNlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIERldGVybWluZSBldmVudCBwcm9wYWdhdGlvbiBwYXRoIGluIGFkdmFuY2UsIHBlciBXM0MgZXZlbnRzIHNwZWMgKCM5OTUxKVxuXHRcdC8vIEJ1YmJsZSB1cCB0byBkb2N1bWVudCwgdGhlbiB0byB3aW5kb3c7IHdhdGNoIGZvciBhIGdsb2JhbCBvd25lckRvY3VtZW50IHZhciAoIzk3MjQpXG5cdFx0aWYgKCAhb25seUhhbmRsZXJzICYmICFzcGVjaWFsLm5vQnViYmxlICYmICFqUXVlcnkuaXNXaW5kb3coIGVsZW0gKSApIHtcblxuXHRcdFx0YnViYmxlVHlwZSA9IHNwZWNpYWwuZGVsZWdhdGVUeXBlIHx8IHR5cGU7XG5cdFx0XHRpZiAoICFyZm9jdXNNb3JwaC50ZXN0KCBidWJibGVUeXBlICsgdHlwZSApICkge1xuXHRcdFx0XHRjdXIgPSBjdXIucGFyZW50Tm9kZTtcblx0XHRcdH1cblx0XHRcdGZvciAoIDsgY3VyOyBjdXIgPSBjdXIucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0ZXZlbnRQYXRoLnB1c2goIGN1ciApO1xuXHRcdFx0XHR0bXAgPSBjdXI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE9ubHkgYWRkIHdpbmRvdyBpZiB3ZSBnb3QgdG8gZG9jdW1lbnQgKGUuZy4sIG5vdCBwbGFpbiBvYmogb3IgZGV0YWNoZWQgRE9NKVxuXHRcdFx0aWYgKCB0bXAgPT09ICggZWxlbS5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50ICkgKSB7XG5cdFx0XHRcdGV2ZW50UGF0aC5wdXNoKCB0bXAuZGVmYXVsdFZpZXcgfHwgdG1wLnBhcmVudFdpbmRvdyB8fCB3aW5kb3cgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBGaXJlIGhhbmRsZXJzIG9uIHRoZSBldmVudCBwYXRoXG5cdFx0aSA9IDA7XG5cdFx0d2hpbGUgKCAoIGN1ciA9IGV2ZW50UGF0aFsgaSsrIF0gKSAmJiAhZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSApIHtcblxuXHRcdFx0ZXZlbnQudHlwZSA9IGkgPiAxID9cblx0XHRcdFx0YnViYmxlVHlwZSA6XG5cdFx0XHRcdHNwZWNpYWwuYmluZFR5cGUgfHwgdHlwZTtcblxuXHRcdFx0Ly8galF1ZXJ5IGhhbmRsZXJcblx0XHRcdGhhbmRsZSA9ICggZGF0YVByaXYuZ2V0KCBjdXIsIFwiZXZlbnRzXCIgKSB8fCB7fSApWyBldmVudC50eXBlIF0gJiZcblx0XHRcdFx0ZGF0YVByaXYuZ2V0KCBjdXIsIFwiaGFuZGxlXCIgKTtcblx0XHRcdGlmICggaGFuZGxlICkge1xuXHRcdFx0XHRoYW5kbGUuYXBwbHkoIGN1ciwgZGF0YSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBOYXRpdmUgaGFuZGxlclxuXHRcdFx0aGFuZGxlID0gb250eXBlICYmIGN1clsgb250eXBlIF07XG5cdFx0XHRpZiAoIGhhbmRsZSAmJiBoYW5kbGUuYXBwbHkgJiYgYWNjZXB0RGF0YSggY3VyICkgKSB7XG5cdFx0XHRcdGV2ZW50LnJlc3VsdCA9IGhhbmRsZS5hcHBseSggY3VyLCBkYXRhICk7XG5cdFx0XHRcdGlmICggZXZlbnQucmVzdWx0ID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGV2ZW50LnR5cGUgPSB0eXBlO1xuXG5cdFx0Ly8gSWYgbm9ib2R5IHByZXZlbnRlZCB0aGUgZGVmYXVsdCBhY3Rpb24sIGRvIGl0IG5vd1xuXHRcdGlmICggIW9ubHlIYW5kbGVycyAmJiAhZXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkgKSB7XG5cblx0XHRcdGlmICggKCAhc3BlY2lhbC5fZGVmYXVsdCB8fFxuXHRcdFx0XHRzcGVjaWFsLl9kZWZhdWx0LmFwcGx5KCBldmVudFBhdGgucG9wKCksIGRhdGEgKSA9PT0gZmFsc2UgKSAmJlxuXHRcdFx0XHRhY2NlcHREYXRhKCBlbGVtICkgKSB7XG5cblx0XHRcdFx0Ly8gQ2FsbCBhIG5hdGl2ZSBET00gbWV0aG9kIG9uIHRoZSB0YXJnZXQgd2l0aCB0aGUgc2FtZSBuYW1lIG5hbWUgYXMgdGhlIGV2ZW50LlxuXHRcdFx0XHQvLyBEb24ndCBkbyBkZWZhdWx0IGFjdGlvbnMgb24gd2luZG93LCB0aGF0J3Mgd2hlcmUgZ2xvYmFsIHZhcmlhYmxlcyBiZSAoIzYxNzApXG5cdFx0XHRcdGlmICggb250eXBlICYmIGpRdWVyeS5pc0Z1bmN0aW9uKCBlbGVtWyB0eXBlIF0gKSAmJiAhalF1ZXJ5LmlzV2luZG93KCBlbGVtICkgKSB7XG5cblx0XHRcdFx0XHQvLyBEb24ndCByZS10cmlnZ2VyIGFuIG9uRk9PIGV2ZW50IHdoZW4gd2UgY2FsbCBpdHMgRk9PKCkgbWV0aG9kXG5cdFx0XHRcdFx0dG1wID0gZWxlbVsgb250eXBlIF07XG5cblx0XHRcdFx0XHRpZiAoIHRtcCApIHtcblx0XHRcdFx0XHRcdGVsZW1bIG9udHlwZSBdID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBQcmV2ZW50IHJlLXRyaWdnZXJpbmcgb2YgdGhlIHNhbWUgZXZlbnQsIHNpbmNlIHdlIGFscmVhZHkgYnViYmxlZCBpdCBhYm92ZVxuXHRcdFx0XHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyZWQgPSB0eXBlO1xuXHRcdFx0XHRcdGVsZW1bIHR5cGUgXSgpO1xuXHRcdFx0XHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyZWQgPSB1bmRlZmluZWQ7XG5cblx0XHRcdFx0XHRpZiAoIHRtcCApIHtcblx0XHRcdFx0XHRcdGVsZW1bIG9udHlwZSBdID0gdG1wO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBldmVudC5yZXN1bHQ7XG5cdH0sXG5cblx0Ly8gUGlnZ3liYWNrIG9uIGEgZG9ub3IgZXZlbnQgdG8gc2ltdWxhdGUgYSBkaWZmZXJlbnQgb25lXG5cdC8vIFVzZWQgb25seSBmb3IgYGZvY3VzKGluIHwgb3V0KWAgZXZlbnRzXG5cdHNpbXVsYXRlOiBmdW5jdGlvbiggdHlwZSwgZWxlbSwgZXZlbnQgKSB7XG5cdFx0dmFyIGUgPSBqUXVlcnkuZXh0ZW5kKFxuXHRcdFx0bmV3IGpRdWVyeS5FdmVudCgpLFxuXHRcdFx0ZXZlbnQsXG5cdFx0XHR7XG5cdFx0XHRcdHR5cGU6IHR5cGUsXG5cdFx0XHRcdGlzU2ltdWxhdGVkOiB0cnVlXG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyKCBlLCBudWxsLCBlbGVtICk7XG5cdH1cblxufSApO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKCB7XG5cblx0dHJpZ2dlcjogZnVuY3Rpb24oIHR5cGUsIGRhdGEgKSB7XG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlciggdHlwZSwgZGF0YSwgdGhpcyApO1xuXHRcdH0gKTtcblx0fSxcblx0dHJpZ2dlckhhbmRsZXI6IGZ1bmN0aW9uKCB0eXBlLCBkYXRhICkge1xuXHRcdHZhciBlbGVtID0gdGhpc1sgMCBdO1xuXHRcdGlmICggZWxlbSApIHtcblx0XHRcdHJldHVybiBqUXVlcnkuZXZlbnQudHJpZ2dlciggdHlwZSwgZGF0YSwgZWxlbSwgdHJ1ZSApO1xuXHRcdH1cblx0fVxufSApO1xuXG5yZXR1cm4galF1ZXJ5O1xufSApO1xuIl19