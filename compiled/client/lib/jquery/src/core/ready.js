"use strict";

define(["../core", "../var/document", "../core/init", "../deferred"], function (jQuery, document) {

	// The deferred used on DOM ready
	var readyList;

	jQuery.fn.ready = function (fn) {

		// Add the callback
		jQuery.ready.promise().done(fn);

		return this;
	};

	jQuery.extend({

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Hold (or release) the ready event
		holdReady: function holdReady(hold) {
			if (hold) {
				jQuery.readyWait++;
			} else {
				jQuery.ready(true);
			}
		},

		// Handle when the DOM is ready
		ready: function ready(wait) {

			// Abort if there are pending holds or we're already ready
			if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if (wait !== true && --jQuery.readyWait > 0) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith(document, [jQuery]);

			// Trigger any bound ready events
			if (jQuery.fn.triggerHandler) {
				jQuery(document).triggerHandler("ready");
				jQuery(document).off("ready");
			}
		}
	});

	/**
  * The ready event handler and self cleanup method
  */
	function completed() {
		document.removeEventListener("DOMContentLoaded", completed);
		window.removeEventListener("load", completed);
		jQuery.ready();
	}

	jQuery.ready.promise = function (obj) {
		if (!readyList) {

			readyList = jQuery.Deferred();

			// Catch cases where $(document).ready() is called
			// after the browser event has already occurred.
			// Support: IE9-10 only
			// Older IE sometimes signals "interactive" too soon
			if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {

				// Handle it asynchronously to allow scripts the opportunity to delay ready
				window.setTimeout(jQuery.ready);
			} else {

				// Use the handy event callback
				document.addEventListener("DOMContentLoaded", completed);

				// A fallback to window.onload, that will always work
				window.addEventListener("load", completed);
			}
		}
		return readyList.promise(obj);
	};

	// Kick off the DOM ready check even if the user does not
	jQuery.ready.promise();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9jb3JlL3JlYWR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxDQUNQLFNBRE8sRUFFUCxpQkFGTyxFQUdQLGNBSE8sRUFJUCxhQUpPLENBQVIsRUFLRyxVQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNkI7OztBQUdoQyxLQUFJLFNBQUo7O0FBRUEsUUFBTyxFQUFQLENBQVUsS0FBVixHQUFrQixVQUFVLEVBQVYsRUFBZTs7O0FBR2hDLFNBQU8sS0FBUCxDQUFhLE9BQWIsR0FBdUIsSUFBdkIsQ0FBNkIsRUFBN0I7O0FBRUEsU0FBTyxJQUFQO0FBQ0EsRUFORDs7QUFRQSxRQUFPLE1BQVAsQ0FBZTs7O0FBR2QsV0FBUyxLQUhLOzs7O0FBT2QsYUFBVyxDQVBHOzs7QUFVZCxhQUFXLG1CQUFVLElBQVYsRUFBaUI7QUFDM0IsT0FBSyxJQUFMLEVBQVk7QUFDWCxXQUFPLFNBQVA7QUFDQSxJQUZELE1BRU87QUFDTixXQUFPLEtBQVAsQ0FBYyxJQUFkO0FBQ0E7QUFDRCxHQWhCYTs7O0FBbUJkLFNBQU8sZUFBVSxJQUFWLEVBQWlCOzs7QUFHdkIsT0FBSyxTQUFTLElBQVQsR0FBZ0IsRUFBRSxPQUFPLFNBQXpCLEdBQXFDLE9BQU8sT0FBakQsRUFBMkQ7QUFDMUQ7QUFDQTs7O0FBR0QsVUFBTyxPQUFQLEdBQWlCLElBQWpCOzs7QUFHQSxPQUFLLFNBQVMsSUFBVCxJQUFpQixFQUFFLE9BQU8sU0FBVCxHQUFxQixDQUEzQyxFQUErQztBQUM5QztBQUNBOzs7QUFHRCxhQUFVLFdBQVYsQ0FBdUIsUUFBdkIsRUFBaUMsQ0FBRSxNQUFGLENBQWpDOzs7QUFHQSxPQUFLLE9BQU8sRUFBUCxDQUFVLGNBQWYsRUFBZ0M7QUFDL0IsV0FBUSxRQUFSLEVBQW1CLGNBQW5CLENBQW1DLE9BQW5DO0FBQ0EsV0FBUSxRQUFSLEVBQW1CLEdBQW5CLENBQXdCLE9BQXhCO0FBQ0E7QUFDRDtBQTFDYSxFQUFmOzs7OztBQWdEQSxVQUFTLFNBQVQsR0FBcUI7QUFDcEIsV0FBUyxtQkFBVCxDQUE4QixrQkFBOUIsRUFBa0QsU0FBbEQ7QUFDQSxTQUFPLG1CQUFQLENBQTRCLE1BQTVCLEVBQW9DLFNBQXBDO0FBQ0EsU0FBTyxLQUFQO0FBQ0E7O0FBRUQsUUFBTyxLQUFQLENBQWEsT0FBYixHQUF1QixVQUFVLEdBQVYsRUFBZ0I7QUFDdEMsTUFBSyxDQUFDLFNBQU4sRUFBa0I7O0FBRWpCLGVBQVksT0FBTyxRQUFQLEVBQVo7Ozs7OztBQU1BLE9BQUssU0FBUyxVQUFULEtBQXdCLFVBQXhCLElBQ0YsU0FBUyxVQUFULEtBQXdCLFNBQXhCLElBQXFDLENBQUMsU0FBUyxlQUFULENBQXlCLFFBRGxFLEVBQytFOzs7QUFHOUUsV0FBTyxVQUFQLENBQW1CLE9BQU8sS0FBMUI7QUFFQSxJQU5ELE1BTU87OztBQUdOLGFBQVMsZ0JBQVQsQ0FBMkIsa0JBQTNCLEVBQStDLFNBQS9DOzs7QUFHQSxXQUFPLGdCQUFQLENBQXlCLE1BQXpCLEVBQWlDLFNBQWpDO0FBQ0E7QUFDRDtBQUNELFNBQU8sVUFBVSxPQUFWLENBQW1CLEdBQW5CLENBQVA7QUFDQSxFQXpCRDs7O0FBNEJBLFFBQU8sS0FBUCxDQUFhLE9BQWI7QUFFQyxDQXRHRCIsImZpbGUiOiJyZWFkeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4uL2NvcmVcIixcblx0XCIuLi92YXIvZG9jdW1lbnRcIixcblx0XCIuLi9jb3JlL2luaXRcIixcblx0XCIuLi9kZWZlcnJlZFwiXG5dLCBmdW5jdGlvbiggalF1ZXJ5LCBkb2N1bWVudCApIHtcblxuLy8gVGhlIGRlZmVycmVkIHVzZWQgb24gRE9NIHJlYWR5XG52YXIgcmVhZHlMaXN0O1xuXG5qUXVlcnkuZm4ucmVhZHkgPSBmdW5jdGlvbiggZm4gKSB7XG5cblx0Ly8gQWRkIHRoZSBjYWxsYmFja1xuXHRqUXVlcnkucmVhZHkucHJvbWlzZSgpLmRvbmUoIGZuICk7XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5qUXVlcnkuZXh0ZW5kKCB7XG5cblx0Ly8gSXMgdGhlIERPTSByZWFkeSB0byBiZSB1c2VkPyBTZXQgdG8gdHJ1ZSBvbmNlIGl0IG9jY3Vycy5cblx0aXNSZWFkeTogZmFsc2UsXG5cblx0Ly8gQSBjb3VudGVyIHRvIHRyYWNrIGhvdyBtYW55IGl0ZW1zIHRvIHdhaXQgZm9yIGJlZm9yZVxuXHQvLyB0aGUgcmVhZHkgZXZlbnQgZmlyZXMuIFNlZSAjNjc4MVxuXHRyZWFkeVdhaXQ6IDEsXG5cblx0Ly8gSG9sZCAob3IgcmVsZWFzZSkgdGhlIHJlYWR5IGV2ZW50XG5cdGhvbGRSZWFkeTogZnVuY3Rpb24oIGhvbGQgKSB7XG5cdFx0aWYgKCBob2xkICkge1xuXHRcdFx0alF1ZXJ5LnJlYWR5V2FpdCsrO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRqUXVlcnkucmVhZHkoIHRydWUgKTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gSGFuZGxlIHdoZW4gdGhlIERPTSBpcyByZWFkeVxuXHRyZWFkeTogZnVuY3Rpb24oIHdhaXQgKSB7XG5cblx0XHQvLyBBYm9ydCBpZiB0aGVyZSBhcmUgcGVuZGluZyBob2xkcyBvciB3ZSdyZSBhbHJlYWR5IHJlYWR5XG5cdFx0aWYgKCB3YWl0ID09PSB0cnVlID8gLS1qUXVlcnkucmVhZHlXYWl0IDogalF1ZXJ5LmlzUmVhZHkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gUmVtZW1iZXIgdGhhdCB0aGUgRE9NIGlzIHJlYWR5XG5cdFx0alF1ZXJ5LmlzUmVhZHkgPSB0cnVlO1xuXG5cdFx0Ly8gSWYgYSBub3JtYWwgRE9NIFJlYWR5IGV2ZW50IGZpcmVkLCBkZWNyZW1lbnQsIGFuZCB3YWl0IGlmIG5lZWQgYmVcblx0XHRpZiAoIHdhaXQgIT09IHRydWUgJiYgLS1qUXVlcnkucmVhZHlXYWl0ID4gMCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBJZiB0aGVyZSBhcmUgZnVuY3Rpb25zIGJvdW5kLCB0byBleGVjdXRlXG5cdFx0cmVhZHlMaXN0LnJlc29sdmVXaXRoKCBkb2N1bWVudCwgWyBqUXVlcnkgXSApO1xuXG5cdFx0Ly8gVHJpZ2dlciBhbnkgYm91bmQgcmVhZHkgZXZlbnRzXG5cdFx0aWYgKCBqUXVlcnkuZm4udHJpZ2dlckhhbmRsZXIgKSB7XG5cdFx0XHRqUXVlcnkoIGRvY3VtZW50ICkudHJpZ2dlckhhbmRsZXIoIFwicmVhZHlcIiApO1xuXHRcdFx0alF1ZXJ5KCBkb2N1bWVudCApLm9mZiggXCJyZWFkeVwiICk7XG5cdFx0fVxuXHR9XG59ICk7XG5cbi8qKlxuICogVGhlIHJlYWR5IGV2ZW50IGhhbmRsZXIgYW5kIHNlbGYgY2xlYW51cCBtZXRob2RcbiAqL1xuZnVuY3Rpb24gY29tcGxldGVkKCkge1xuXHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY29tcGxldGVkICk7XG5cdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCBcImxvYWRcIiwgY29tcGxldGVkICk7XG5cdGpRdWVyeS5yZWFkeSgpO1xufVxuXG5qUXVlcnkucmVhZHkucHJvbWlzZSA9IGZ1bmN0aW9uKCBvYmogKSB7XG5cdGlmICggIXJlYWR5TGlzdCApIHtcblxuXHRcdHJlYWR5TGlzdCA9IGpRdWVyeS5EZWZlcnJlZCgpO1xuXG5cdFx0Ly8gQ2F0Y2ggY2FzZXMgd2hlcmUgJChkb2N1bWVudCkucmVhZHkoKSBpcyBjYWxsZWRcblx0XHQvLyBhZnRlciB0aGUgYnJvd3NlciBldmVudCBoYXMgYWxyZWFkeSBvY2N1cnJlZC5cblx0XHQvLyBTdXBwb3J0OiBJRTktMTAgb25seVxuXHRcdC8vIE9sZGVyIElFIHNvbWV0aW1lcyBzaWduYWxzIFwiaW50ZXJhY3RpdmVcIiB0b28gc29vblxuXHRcdGlmICggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiIHx8XG5cdFx0XHQoIGRvY3VtZW50LnJlYWR5U3RhdGUgIT09IFwibG9hZGluZ1wiICYmICFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGwgKSApIHtcblxuXHRcdFx0Ly8gSGFuZGxlIGl0IGFzeW5jaHJvbm91c2x5IHRvIGFsbG93IHNjcmlwdHMgdGhlIG9wcG9ydHVuaXR5IHRvIGRlbGF5IHJlYWR5XG5cdFx0XHR3aW5kb3cuc2V0VGltZW91dCggalF1ZXJ5LnJlYWR5ICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBVc2UgdGhlIGhhbmR5IGV2ZW50IGNhbGxiYWNrXG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY29tcGxldGVkICk7XG5cblx0XHRcdC8vIEEgZmFsbGJhY2sgdG8gd2luZG93Lm9ubG9hZCwgdGhhdCB3aWxsIGFsd2F5cyB3b3JrXG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggXCJsb2FkXCIsIGNvbXBsZXRlZCApO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVhZHlMaXN0LnByb21pc2UoIG9iaiApO1xufTtcblxuLy8gS2ljayBvZmYgdGhlIERPTSByZWFkeSBjaGVjayBldmVuIGlmIHRoZSB1c2VyIGRvZXMgbm90XG5qUXVlcnkucmVhZHkucHJvbWlzZSgpO1xuXG59ICk7XG4iXX0=