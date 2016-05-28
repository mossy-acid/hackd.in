"use strict";

define(["../core", "../data/var/dataPriv", "./support", "../event", "./trigger"], function (jQuery, dataPriv, support) {

	// Support: Firefox
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome, Safari
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
	if (!support.focusin) {
		jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function handler(event) {
				jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
			};

			jQuery.event.special[fix] = {
				setup: function setup() {
					var doc = this.ownerDocument || this,
					    attaches = dataPriv.access(doc, fix);

					if (!attaches) {
						doc.addEventListener(orig, handler, true);
					}
					dataPriv.access(doc, fix, (attaches || 0) + 1);
				},
				teardown: function teardown() {
					var doc = this.ownerDocument || this,
					    attaches = dataPriv.access(doc, fix) - 1;

					if (!attaches) {
						doc.removeEventListener(orig, handler, true);
						dataPriv.remove(doc, fix);
					} else {
						dataPriv.access(doc, fix, attaches);
					}
				}
			};
		});
	}

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9ldmVudC9mb2N1c2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxDQUNQLFNBRE8sRUFFUCxzQkFGTyxFQUdQLFdBSE8sRUFLUCxVQUxPLEVBTVAsV0FOTyxDQUFSLEVBT0csVUFBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLE9BQTVCLEVBQXNDOzs7Ozs7Ozs7O0FBVXpDLEtBQUssQ0FBQyxRQUFRLE9BQVIsRUFBa0I7QUFDdkIsU0FBTyxJQUFQLENBQWEsRUFBRSxPQUFPLFNBQVAsRUFBa0IsTUFBTSxVQUFOLEVBQWpDLEVBQXFELFVBQVUsSUFBVixFQUFnQixHQUFoQixFQUFzQjs7O0FBRzFFLE9BQUksVUFBVSxTQUFWLE9BQVUsQ0FBVSxLQUFWLEVBQWtCO0FBQy9CLFdBQU8sS0FBUCxDQUFhLFFBQWIsQ0FBdUIsR0FBdkIsRUFBNEIsTUFBTSxNQUFOLEVBQWMsT0FBTyxLQUFQLENBQWEsR0FBYixDQUFrQixLQUFsQixDQUExQyxFQUQrQjtJQUFsQixDQUg0RDs7QUFPMUUsVUFBTyxLQUFQLENBQWEsT0FBYixDQUFzQixHQUF0QixJQUE4QjtBQUM3QixXQUFPLGlCQUFXO0FBQ2pCLFNBQUksTUFBTSxLQUFLLGFBQUwsSUFBc0IsSUFBdEI7U0FDVCxXQUFXLFNBQVMsTUFBVCxDQUFpQixHQUFqQixFQUFzQixHQUF0QixDQUFYLENBRmdCOztBQUlqQixTQUFLLENBQUMsUUFBRCxFQUFZO0FBQ2hCLFVBQUksZ0JBQUosQ0FBc0IsSUFBdEIsRUFBNEIsT0FBNUIsRUFBcUMsSUFBckMsRUFEZ0I7TUFBakI7QUFHQSxjQUFTLE1BQVQsQ0FBaUIsR0FBakIsRUFBc0IsR0FBdEIsRUFBMkIsQ0FBRSxZQUFZLENBQVosQ0FBRixHQUFvQixDQUFwQixDQUEzQixDQVBpQjtLQUFYO0FBU1AsY0FBVSxvQkFBVztBQUNwQixTQUFJLE1BQU0sS0FBSyxhQUFMLElBQXNCLElBQXRCO1NBQ1QsV0FBVyxTQUFTLE1BQVQsQ0FBaUIsR0FBakIsRUFBc0IsR0FBdEIsSUFBOEIsQ0FBOUIsQ0FGUTs7QUFJcEIsU0FBSyxDQUFDLFFBQUQsRUFBWTtBQUNoQixVQUFJLG1CQUFKLENBQXlCLElBQXpCLEVBQStCLE9BQS9CLEVBQXdDLElBQXhDLEVBRGdCO0FBRWhCLGVBQVMsTUFBVCxDQUFpQixHQUFqQixFQUFzQixHQUF0QixFQUZnQjtNQUFqQixNQUlPO0FBQ04sZUFBUyxNQUFULENBQWlCLEdBQWpCLEVBQXNCLEdBQXRCLEVBQTJCLFFBQTNCLEVBRE07TUFKUDtLQUpTO0lBVlgsQ0FQMEU7R0FBdEIsQ0FBckQsQ0FEdUI7RUFBeEI7O0FBa0NBLFFBQU8sTUFBUCxDQTVDeUM7Q0FBdEMsQ0FQSCIsImZpbGUiOiJmb2N1c2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBbXG5cdFwiLi4vY29yZVwiLFxuXHRcIi4uL2RhdGEvdmFyL2RhdGFQcml2XCIsXG5cdFwiLi9zdXBwb3J0XCIsXG5cblx0XCIuLi9ldmVudFwiLFxuXHRcIi4vdHJpZ2dlclwiXG5dLCBmdW5jdGlvbiggalF1ZXJ5LCBkYXRhUHJpdiwgc3VwcG9ydCApIHtcblxuLy8gU3VwcG9ydDogRmlyZWZveFxuLy8gRmlyZWZveCBkb2Vzbid0IGhhdmUgZm9jdXMoaW4gfCBvdXQpIGV2ZW50c1xuLy8gUmVsYXRlZCB0aWNrZXQgLSBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02ODc3ODdcbi8vXG4vLyBTdXBwb3J0OiBDaHJvbWUsIFNhZmFyaVxuLy8gZm9jdXMoaW4gfCBvdXQpIGV2ZW50cyBmaXJlIGFmdGVyIGZvY3VzICYgYmx1ciBldmVudHMsXG4vLyB3aGljaCBpcyBzcGVjIHZpb2xhdGlvbiAtIGh0dHA6Ly93d3cudzMub3JnL1RSL0RPTS1MZXZlbC0zLUV2ZW50cy8jZXZlbnRzLWZvY3VzZXZlbnQtZXZlbnQtb3JkZXJcbi8vIFJlbGF0ZWQgdGlja2V0IC0gaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ0OTg1N1xuaWYgKCAhc3VwcG9ydC5mb2N1c2luICkge1xuXHRqUXVlcnkuZWFjaCggeyBmb2N1czogXCJmb2N1c2luXCIsIGJsdXI6IFwiZm9jdXNvdXRcIiB9LCBmdW5jdGlvbiggb3JpZywgZml4ICkge1xuXG5cdFx0Ly8gQXR0YWNoIGEgc2luZ2xlIGNhcHR1cmluZyBoYW5kbGVyIG9uIHRoZSBkb2N1bWVudCB3aGlsZSBzb21lb25lIHdhbnRzIGZvY3VzaW4vZm9jdXNvdXRcblx0XHR2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGpRdWVyeS5ldmVudC5zaW11bGF0ZSggZml4LCBldmVudC50YXJnZXQsIGpRdWVyeS5ldmVudC5maXgoIGV2ZW50ICkgKTtcblx0XHR9O1xuXG5cdFx0alF1ZXJ5LmV2ZW50LnNwZWNpYWxbIGZpeCBdID0ge1xuXHRcdFx0c2V0dXA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgZG9jID0gdGhpcy5vd25lckRvY3VtZW50IHx8IHRoaXMsXG5cdFx0XHRcdFx0YXR0YWNoZXMgPSBkYXRhUHJpdi5hY2Nlc3MoIGRvYywgZml4ICk7XG5cblx0XHRcdFx0aWYgKCAhYXR0YWNoZXMgKSB7XG5cdFx0XHRcdFx0ZG9jLmFkZEV2ZW50TGlzdGVuZXIoIG9yaWcsIGhhbmRsZXIsIHRydWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkYXRhUHJpdi5hY2Nlc3MoIGRvYywgZml4LCAoIGF0dGFjaGVzIHx8IDAgKSArIDEgKTtcblx0XHRcdH0sXG5cdFx0XHR0ZWFyZG93bjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBkb2MgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgdGhpcyxcblx0XHRcdFx0XHRhdHRhY2hlcyA9IGRhdGFQcml2LmFjY2VzcyggZG9jLCBmaXggKSAtIDE7XG5cblx0XHRcdFx0aWYgKCAhYXR0YWNoZXMgKSB7XG5cdFx0XHRcdFx0ZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoIG9yaWcsIGhhbmRsZXIsIHRydWUgKTtcblx0XHRcdFx0XHRkYXRhUHJpdi5yZW1vdmUoIGRvYywgZml4ICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRkYXRhUHJpdi5hY2Nlc3MoIGRvYywgZml4LCBhdHRhY2hlcyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0fSApO1xufVxuXG5yZXR1cm4galF1ZXJ5O1xufSApO1xuIl19