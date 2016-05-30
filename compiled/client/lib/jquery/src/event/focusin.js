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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9ldmVudC9mb2N1c2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxDQUNQLFNBRE8sRUFFUCxzQkFGTyxFQUdQLFdBSE8sRUFLUCxVQUxPLEVBTVAsV0FOTyxDQUFSLEVBT0csVUFBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLE9BQTVCLEVBQXNDOzs7Ozs7Ozs7O0FBVXpDLEtBQUssQ0FBQyxRQUFRLE9BQWQsRUFBd0I7QUFDdkIsU0FBTyxJQUFQLENBQWEsRUFBRSxPQUFPLFNBQVQsRUFBb0IsTUFBTSxVQUExQixFQUFiLEVBQXFELFVBQVUsSUFBVixFQUFnQixHQUFoQixFQUFzQjs7O0FBRzFFLE9BQUksVUFBVSxTQUFWLE9BQVUsQ0FBVSxLQUFWLEVBQWtCO0FBQy9CLFdBQU8sS0FBUCxDQUFhLFFBQWIsQ0FBdUIsR0FBdkIsRUFBNEIsTUFBTSxNQUFsQyxFQUEwQyxPQUFPLEtBQVAsQ0FBYSxHQUFiLENBQWtCLEtBQWxCLENBQTFDO0FBQ0EsSUFGRDs7QUFJQSxVQUFPLEtBQVAsQ0FBYSxPQUFiLENBQXNCLEdBQXRCLElBQThCO0FBQzdCLFdBQU8saUJBQVc7QUFDakIsU0FBSSxNQUFNLEtBQUssYUFBTCxJQUFzQixJQUFoQztTQUNDLFdBQVcsU0FBUyxNQUFULENBQWlCLEdBQWpCLEVBQXNCLEdBQXRCLENBRFo7O0FBR0EsU0FBSyxDQUFDLFFBQU4sRUFBaUI7QUFDaEIsVUFBSSxnQkFBSixDQUFzQixJQUF0QixFQUE0QixPQUE1QixFQUFxQyxJQUFyQztBQUNBO0FBQ0QsY0FBUyxNQUFULENBQWlCLEdBQWpCLEVBQXNCLEdBQXRCLEVBQTJCLENBQUUsWUFBWSxDQUFkLElBQW9CLENBQS9DO0FBQ0EsS0FUNEI7QUFVN0IsY0FBVSxvQkFBVztBQUNwQixTQUFJLE1BQU0sS0FBSyxhQUFMLElBQXNCLElBQWhDO1NBQ0MsV0FBVyxTQUFTLE1BQVQsQ0FBaUIsR0FBakIsRUFBc0IsR0FBdEIsSUFBOEIsQ0FEMUM7O0FBR0EsU0FBSyxDQUFDLFFBQU4sRUFBaUI7QUFDaEIsVUFBSSxtQkFBSixDQUF5QixJQUF6QixFQUErQixPQUEvQixFQUF3QyxJQUF4QztBQUNBLGVBQVMsTUFBVCxDQUFpQixHQUFqQixFQUFzQixHQUF0QjtBQUVBLE1BSkQsTUFJTztBQUNOLGVBQVMsTUFBVCxDQUFpQixHQUFqQixFQUFzQixHQUF0QixFQUEyQixRQUEzQjtBQUNBO0FBQ0Q7QUFyQjRCLElBQTlCO0FBdUJBLEdBOUJEO0FBK0JBOztBQUVELFFBQU8sTUFBUDtBQUNDLENBcEREIiwiZmlsZSI6ImZvY3VzaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuLi9jb3JlXCIsXG5cdFwiLi4vZGF0YS92YXIvZGF0YVByaXZcIixcblx0XCIuL3N1cHBvcnRcIixcblxuXHRcIi4uL2V2ZW50XCIsXG5cdFwiLi90cmlnZ2VyXCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIGRhdGFQcml2LCBzdXBwb3J0ICkge1xuXG4vLyBTdXBwb3J0OiBGaXJlZm94XG4vLyBGaXJlZm94IGRvZXNuJ3QgaGF2ZSBmb2N1cyhpbiB8IG91dCkgZXZlbnRzXG4vLyBSZWxhdGVkIHRpY2tldCAtIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY4Nzc4N1xuLy9cbi8vIFN1cHBvcnQ6IENocm9tZSwgU2FmYXJpXG4vLyBmb2N1cyhpbiB8IG91dCkgZXZlbnRzIGZpcmUgYWZ0ZXIgZm9jdXMgJiBibHVyIGV2ZW50cyxcbi8vIHdoaWNoIGlzIHNwZWMgdmlvbGF0aW9uIC0gaHR0cDovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTMtRXZlbnRzLyNldmVudHMtZm9jdXNldmVudC1ldmVudC1vcmRlclxuLy8gUmVsYXRlZCB0aWNrZXQgLSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDQ5ODU3XG5pZiAoICFzdXBwb3J0LmZvY3VzaW4gKSB7XG5cdGpRdWVyeS5lYWNoKCB7IGZvY3VzOiBcImZvY3VzaW5cIiwgYmx1cjogXCJmb2N1c291dFwiIH0sIGZ1bmN0aW9uKCBvcmlnLCBmaXggKSB7XG5cblx0XHQvLyBBdHRhY2ggYSBzaW5nbGUgY2FwdHVyaW5nIGhhbmRsZXIgb24gdGhlIGRvY3VtZW50IHdoaWxlIHNvbWVvbmUgd2FudHMgZm9jdXNpbi9mb2N1c291dFxuXHRcdHZhciBoYW5kbGVyID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0alF1ZXJ5LmV2ZW50LnNpbXVsYXRlKCBmaXgsIGV2ZW50LnRhcmdldCwgalF1ZXJ5LmV2ZW50LmZpeCggZXZlbnQgKSApO1xuXHRcdH07XG5cblx0XHRqUXVlcnkuZXZlbnQuc3BlY2lhbFsgZml4IF0gPSB7XG5cdFx0XHRzZXR1cDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBkb2MgPSB0aGlzLm93bmVyRG9jdW1lbnQgfHwgdGhpcyxcblx0XHRcdFx0XHRhdHRhY2hlcyA9IGRhdGFQcml2LmFjY2VzcyggZG9jLCBmaXggKTtcblxuXHRcdFx0XHRpZiAoICFhdHRhY2hlcyApIHtcblx0XHRcdFx0XHRkb2MuYWRkRXZlbnRMaXN0ZW5lciggb3JpZywgaGFuZGxlciwgdHJ1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRhdGFQcml2LmFjY2VzcyggZG9jLCBmaXgsICggYXR0YWNoZXMgfHwgMCApICsgMSApO1xuXHRcdFx0fSxcblx0XHRcdHRlYXJkb3duOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGRvYyA9IHRoaXMub3duZXJEb2N1bWVudCB8fCB0aGlzLFxuXHRcdFx0XHRcdGF0dGFjaGVzID0gZGF0YVByaXYuYWNjZXNzKCBkb2MsIGZpeCApIC0gMTtcblxuXHRcdFx0XHRpZiAoICFhdHRhY2hlcyApIHtcblx0XHRcdFx0XHRkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lciggb3JpZywgaGFuZGxlciwgdHJ1ZSApO1xuXHRcdFx0XHRcdGRhdGFQcml2LnJlbW92ZSggZG9jLCBmaXggKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRhdGFQcml2LmFjY2VzcyggZG9jLCBmaXgsIGF0dGFjaGVzICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHR9ICk7XG59XG5cbnJldHVybiBqUXVlcnk7XG59ICk7XG4iXX0=