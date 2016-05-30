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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9jb3JlL3JlYWR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxDQUNQLFNBRE8sRUFFUCxpQkFGTyxFQUdQLGNBSE8sRUFJUCxhQUpPLENBQVIsRUFLRyxVQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNkI7OztBQUdoQyxLQUFJLFNBQUosQ0FIZ0M7O0FBS2hDLFFBQU8sRUFBUCxDQUFVLEtBQVYsR0FBa0IsVUFBVSxFQUFWLEVBQWU7OztBQUdoQyxTQUFPLEtBQVAsQ0FBYSxPQUFiLEdBQXVCLElBQXZCLENBQTZCLEVBQTdCLEVBSGdDOztBQUtoQyxTQUFPLElBQVAsQ0FMZ0M7RUFBZixDQUxjOztBQWFoQyxRQUFPLE1BQVAsQ0FBZTs7O0FBR2QsV0FBUyxLQUFUOzs7O0FBSUEsYUFBVyxDQUFYOzs7QUFHQSxhQUFXLG1CQUFVLElBQVYsRUFBaUI7QUFDM0IsT0FBSyxJQUFMLEVBQVk7QUFDWCxXQUFPLFNBQVAsR0FEVztJQUFaLE1BRU87QUFDTixXQUFPLEtBQVAsQ0FBYyxJQUFkLEVBRE07SUFGUDtHQURVOzs7QUFTWCxTQUFPLGVBQVUsSUFBVixFQUFpQjs7O0FBR3ZCLE9BQUssU0FBUyxJQUFULEdBQWdCLEVBQUUsT0FBTyxTQUFQLEdBQW1CLE9BQU8sT0FBUCxFQUFpQjtBQUMxRCxXQUQwRDtJQUEzRDs7O0FBSHVCLFNBUXZCLENBQU8sT0FBUCxHQUFpQixJQUFqQjs7O0FBUnVCLE9BV2xCLFNBQVMsSUFBVCxJQUFpQixFQUFFLE9BQU8sU0FBUCxHQUFtQixDQUFyQixFQUF5QjtBQUM5QyxXQUQ4QztJQUEvQzs7O0FBWHVCLFlBZ0J2QixDQUFVLFdBQVYsQ0FBdUIsUUFBdkIsRUFBaUMsQ0FBRSxNQUFGLENBQWpDOzs7QUFoQnVCLE9BbUJsQixPQUFPLEVBQVAsQ0FBVSxjQUFWLEVBQTJCO0FBQy9CLFdBQVEsUUFBUixFQUFtQixjQUFuQixDQUFtQyxPQUFuQyxFQUQrQjtBQUUvQixXQUFRLFFBQVIsRUFBbUIsR0FBbkIsQ0FBd0IsT0FBeEIsRUFGK0I7SUFBaEM7R0FuQk07RUFuQlI7Ozs7O0FBYmdDLFVBNkR2QixTQUFULEdBQXFCO0FBQ3BCLFdBQVMsbUJBQVQsQ0FBOEIsa0JBQTlCLEVBQWtELFNBQWxELEVBRG9CO0FBRXBCLFNBQU8sbUJBQVAsQ0FBNEIsTUFBNUIsRUFBb0MsU0FBcEMsRUFGb0I7QUFHcEIsU0FBTyxLQUFQLEdBSG9CO0VBQXJCOztBQU1BLFFBQU8sS0FBUCxDQUFhLE9BQWIsR0FBdUIsVUFBVSxHQUFWLEVBQWdCO0FBQ3RDLE1BQUssQ0FBQyxTQUFELEVBQWE7O0FBRWpCLGVBQVksT0FBTyxRQUFQLEVBQVo7Ozs7OztBQUZpQixPQVFaLFNBQVMsVUFBVCxLQUF3QixVQUF4QixJQUNGLFNBQVMsVUFBVCxLQUF3QixTQUF4QixJQUFxQyxDQUFDLFNBQVMsZUFBVCxDQUF5QixRQUF6QixFQUFzQzs7O0FBRzlFLFdBQU8sVUFBUCxDQUFtQixPQUFPLEtBQVAsQ0FBbkIsQ0FIOEU7SUFEL0UsTUFNTzs7O0FBR04sYUFBUyxnQkFBVCxDQUEyQixrQkFBM0IsRUFBK0MsU0FBL0M7OztBQUhNLFVBTU4sQ0FBTyxnQkFBUCxDQUF5QixNQUF6QixFQUFpQyxTQUFqQyxFQU5NO0lBTlA7R0FSRDtBQXVCQSxTQUFPLFVBQVUsT0FBVixDQUFtQixHQUFuQixDQUFQLENBeEJzQztFQUFoQjs7O0FBbkVTLE9BK0ZoQyxDQUFPLEtBQVAsQ0FBYSxPQUFiLEdBL0ZnQztDQUE3QixDQUxIIiwiZmlsZSI6InJlYWR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBbXG5cdFwiLi4vY29yZVwiLFxuXHRcIi4uL3Zhci9kb2N1bWVudFwiLFxuXHRcIi4uL2NvcmUvaW5pdFwiLFxuXHRcIi4uL2RlZmVycmVkXCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIGRvY3VtZW50ICkge1xuXG4vLyBUaGUgZGVmZXJyZWQgdXNlZCBvbiBET00gcmVhZHlcbnZhciByZWFkeUxpc3Q7XG5cbmpRdWVyeS5mbi5yZWFkeSA9IGZ1bmN0aW9uKCBmbiApIHtcblxuXHQvLyBBZGQgdGhlIGNhbGxiYWNrXG5cdGpRdWVyeS5yZWFkeS5wcm9taXNlKCkuZG9uZSggZm4gKTtcblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbmpRdWVyeS5leHRlbmQoIHtcblxuXHQvLyBJcyB0aGUgRE9NIHJlYWR5IHRvIGJlIHVzZWQ/IFNldCB0byB0cnVlIG9uY2UgaXQgb2NjdXJzLlxuXHRpc1JlYWR5OiBmYWxzZSxcblxuXHQvLyBBIGNvdW50ZXIgdG8gdHJhY2sgaG93IG1hbnkgaXRlbXMgdG8gd2FpdCBmb3IgYmVmb3JlXG5cdC8vIHRoZSByZWFkeSBldmVudCBmaXJlcy4gU2VlICM2NzgxXG5cdHJlYWR5V2FpdDogMSxcblxuXHQvLyBIb2xkIChvciByZWxlYXNlKSB0aGUgcmVhZHkgZXZlbnRcblx0aG9sZFJlYWR5OiBmdW5jdGlvbiggaG9sZCApIHtcblx0XHRpZiAoIGhvbGQgKSB7XG5cdFx0XHRqUXVlcnkucmVhZHlXYWl0Kys7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGpRdWVyeS5yZWFkeSggdHJ1ZSApO1xuXHRcdH1cblx0fSxcblxuXHQvLyBIYW5kbGUgd2hlbiB0aGUgRE9NIGlzIHJlYWR5XG5cdHJlYWR5OiBmdW5jdGlvbiggd2FpdCApIHtcblxuXHRcdC8vIEFib3J0IGlmIHRoZXJlIGFyZSBwZW5kaW5nIGhvbGRzIG9yIHdlJ3JlIGFscmVhZHkgcmVhZHlcblx0XHRpZiAoIHdhaXQgPT09IHRydWUgPyAtLWpRdWVyeS5yZWFkeVdhaXQgOiBqUXVlcnkuaXNSZWFkeSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBSZW1lbWJlciB0aGF0IHRoZSBET00gaXMgcmVhZHlcblx0XHRqUXVlcnkuaXNSZWFkeSA9IHRydWU7XG5cblx0XHQvLyBJZiBhIG5vcm1hbCBET00gUmVhZHkgZXZlbnQgZmlyZWQsIGRlY3JlbWVudCwgYW5kIHdhaXQgaWYgbmVlZCBiZVxuXHRcdGlmICggd2FpdCAhPT0gdHJ1ZSAmJiAtLWpRdWVyeS5yZWFkeVdhaXQgPiAwICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIElmIHRoZXJlIGFyZSBmdW5jdGlvbnMgYm91bmQsIHRvIGV4ZWN1dGVcblx0XHRyZWFkeUxpc3QucmVzb2x2ZVdpdGgoIGRvY3VtZW50LCBbIGpRdWVyeSBdICk7XG5cblx0XHQvLyBUcmlnZ2VyIGFueSBib3VuZCByZWFkeSBldmVudHNcblx0XHRpZiAoIGpRdWVyeS5mbi50cmlnZ2VySGFuZGxlciApIHtcblx0XHRcdGpRdWVyeSggZG9jdW1lbnQgKS50cmlnZ2VySGFuZGxlciggXCJyZWFkeVwiICk7XG5cdFx0XHRqUXVlcnkoIGRvY3VtZW50ICkub2ZmKCBcInJlYWR5XCIgKTtcblx0XHR9XG5cdH1cbn0gKTtcblxuLyoqXG4gKiBUaGUgcmVhZHkgZXZlbnQgaGFuZGxlciBhbmQgc2VsZiBjbGVhbnVwIG1ldGhvZFxuICovXG5mdW5jdGlvbiBjb21wbGV0ZWQoKSB7XG5cdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoIFwiRE9NQ29udGVudExvYWRlZFwiLCBjb21wbGV0ZWQgKTtcblx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoIFwibG9hZFwiLCBjb21wbGV0ZWQgKTtcblx0alF1ZXJ5LnJlYWR5KCk7XG59XG5cbmpRdWVyeS5yZWFkeS5wcm9taXNlID0gZnVuY3Rpb24oIG9iaiApIHtcblx0aWYgKCAhcmVhZHlMaXN0ICkge1xuXG5cdFx0cmVhZHlMaXN0ID0galF1ZXJ5LkRlZmVycmVkKCk7XG5cblx0XHQvLyBDYXRjaCBjYXNlcyB3aGVyZSAkKGRvY3VtZW50KS5yZWFkeSgpIGlzIGNhbGxlZFxuXHRcdC8vIGFmdGVyIHRoZSBicm93c2VyIGV2ZW50IGhhcyBhbHJlYWR5IG9jY3VycmVkLlxuXHRcdC8vIFN1cHBvcnQ6IElFOS0xMCBvbmx5XG5cdFx0Ly8gT2xkZXIgSUUgc29tZXRpbWVzIHNpZ25hbHMgXCJpbnRlcmFjdGl2ZVwiIHRvbyBzb29uXG5cdFx0aWYgKCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIgfHxcblx0XHRcdCggZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIgJiYgIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbCApICkge1xuXG5cdFx0XHQvLyBIYW5kbGUgaXQgYXN5bmNocm9ub3VzbHkgdG8gYWxsb3cgc2NyaXB0cyB0aGUgb3Bwb3J0dW5pdHkgdG8gZGVsYXkgcmVhZHlcblx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KCBqUXVlcnkucmVhZHkgKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIFVzZSB0aGUgaGFuZHkgZXZlbnQgY2FsbGJhY2tcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiRE9NQ29udGVudExvYWRlZFwiLCBjb21wbGV0ZWQgKTtcblxuXHRcdFx0Ly8gQSBmYWxsYmFjayB0byB3aW5kb3cub25sb2FkLCB0aGF0IHdpbGwgYWx3YXlzIHdvcmtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCBcImxvYWRcIiwgY29tcGxldGVkICk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZWFkeUxpc3QucHJvbWlzZSggb2JqICk7XG59O1xuXG4vLyBLaWNrIG9mZiB0aGUgRE9NIHJlYWR5IGNoZWNrIGV2ZW4gaWYgdGhlIHVzZXIgZG9lcyBub3RcbmpRdWVyeS5yZWFkeS5wcm9taXNlKCk7XG5cbn0gKTtcbiJdfQ==