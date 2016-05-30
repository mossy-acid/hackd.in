"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(["../core", "../core/parseHTML", "../ajax", "../traversing", "../manipulation", "../selector",

// Optional event/alias dependency
"../event/alias"], function (jQuery) {

	// Keep a copy of the old load method
	var _load = jQuery.fn.load;

	/**
  * Load a url into a page
  */
	jQuery.fn.load = function (url, params, callback) {
		if (typeof url !== "string" && _load) {
			return _load.apply(this, arguments);
		}

		var selector,
		    type,
		    response,
		    self = this,
		    off = url.indexOf(" ");

		if (off > -1) {
			selector = jQuery.trim(url.slice(off));
			url = url.slice(0, off);
		}

		// If it's a function
		if (jQuery.isFunction(params)) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

			// Otherwise, build a param string
		} else if (params && (typeof params === "undefined" ? "undefined" : _typeof(params)) === "object") {
				type = "POST";
			}

		// If we have elements to modify, make the request
		if (self.length > 0) {
			jQuery.ajax({
				url: url,

				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			}).done(function (responseText) {

				// Save response for use in complete callback
				response = arguments;

				self.html(selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) :

				// Otherwise use the full result
				responseText);

				// If the request succeeds, this function gets "data", "status", "jqXHR"
				// but they are ignored because response was set above.
				// If it fails, this function gets "jqXHR", "status", "error"
			}).always(callback && function (jqXHR, status) {
				self.each(function () {
					callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
				});
			});
		}

		return this;
	};
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9hamF4L2xvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQVEsQ0FDUCxTQURPLEVBRVAsbUJBRk8sRUFHUCxTQUhPLEVBSVAsZUFKTyxFQUtQLGlCQUxPLEVBTVAsYUFOTzs7O0FBU1AsZ0JBVE8sQ0FBUixFQVVHLFVBQVUsTUFBVixFQUFtQjs7O0FBR3RCLEtBQUksUUFBUSxPQUFPLEVBQVAsQ0FBVSxJQUFWOzs7OztBQUhVLE9BUXRCLENBQU8sRUFBUCxDQUFVLElBQVYsR0FBaUIsVUFBVSxHQUFWLEVBQWUsTUFBZixFQUF1QixRQUF2QixFQUFrQztBQUNsRCxNQUFLLE9BQU8sR0FBUCxLQUFlLFFBQWYsSUFBMkIsS0FBM0IsRUFBbUM7QUFDdkMsVUFBTyxNQUFNLEtBQU4sQ0FBYSxJQUFiLEVBQW1CLFNBQW5CLENBQVAsQ0FEdUM7R0FBeEM7O0FBSUEsTUFBSSxRQUFKO01BQWMsSUFBZDtNQUFvQixRQUFwQjtNQUNDLE9BQU8sSUFBUDtNQUNBLE1BQU0sSUFBSSxPQUFKLENBQWEsR0FBYixDQUFOLENBUGlEOztBQVNsRCxNQUFLLE1BQU0sQ0FBQyxDQUFELEVBQUs7QUFDZixjQUFXLE9BQU8sSUFBUCxDQUFhLElBQUksS0FBSixDQUFXLEdBQVgsQ0FBYixDQUFYLENBRGU7QUFFZixTQUFNLElBQUksS0FBSixDQUFXLENBQVgsRUFBYyxHQUFkLENBQU4sQ0FGZTtHQUFoQjs7O0FBVGtELE1BZTdDLE9BQU8sVUFBUCxDQUFtQixNQUFuQixDQUFMLEVBQW1DOzs7QUFHbEMsY0FBVyxNQUFYLENBSGtDO0FBSWxDLFlBQVMsU0FBVDs7O0FBSmtDLEdBQW5DLE1BT08sSUFBSyxVQUFVLFFBQU8sdURBQVAsS0FBa0IsUUFBbEIsRUFBNkI7QUFDbEQsV0FBTyxNQUFQLENBRGtEO0lBQTVDOzs7QUF0QjJDLE1BMkI3QyxLQUFLLE1BQUwsR0FBYyxDQUFkLEVBQWtCO0FBQ3RCLFVBQU8sSUFBUCxDQUFhO0FBQ1osU0FBSyxHQUFMOzs7OztBQUtBLFVBQU0sUUFBUSxLQUFSO0FBQ04sY0FBVSxNQUFWO0FBQ0EsVUFBTSxNQUFOO0lBUkQsRUFTSSxJQVRKLENBU1UsVUFBVSxZQUFWLEVBQXlCOzs7QUFHbEMsZUFBVyxTQUFYLENBSGtDOztBQUtsQyxTQUFLLElBQUwsQ0FBVzs7OztBQUlWLFdBQVEsT0FBUixFQUFrQixNQUFsQixDQUEwQixPQUFPLFNBQVAsQ0FBa0IsWUFBbEIsQ0FBMUIsRUFBNkQsSUFBN0QsQ0FBbUUsUUFBbkUsQ0FKVTs7O0FBT1YsZ0JBUFUsQ0FBWDs7Ozs7QUFMa0MsSUFBekIsQ0FUVixDQTBCSSxNQTFCSixDQTBCWSxZQUFZLFVBQVUsS0FBVixFQUFpQixNQUFqQixFQUEwQjtBQUNqRCxTQUFLLElBQUwsQ0FBVyxZQUFXO0FBQ3JCLGNBQVMsS0FBVCxDQUFnQixJQUFoQixFQUFzQixZQUFZLENBQUUsTUFBTSxZQUFOLEVBQW9CLE1BQXRCLEVBQThCLEtBQTlCLENBQVosQ0FBdEIsQ0FEcUI7S0FBWCxDQUFYLENBRGlEO0lBQTFCLENBMUJ4QixDQURzQjtHQUF2Qjs7QUFrQ0EsU0FBTyxJQUFQLENBN0RrRDtFQUFsQyxDQVJLO0NBQW5CLENBVkgiLCJmaWxlIjoibG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4uL2NvcmVcIixcblx0XCIuLi9jb3JlL3BhcnNlSFRNTFwiLFxuXHRcIi4uL2FqYXhcIixcblx0XCIuLi90cmF2ZXJzaW5nXCIsXG5cdFwiLi4vbWFuaXB1bGF0aW9uXCIsXG5cdFwiLi4vc2VsZWN0b3JcIixcblxuXHQvLyBPcHRpb25hbCBldmVudC9hbGlhcyBkZXBlbmRlbmN5XG5cdFwiLi4vZXZlbnQvYWxpYXNcIlxuXSwgZnVuY3Rpb24oIGpRdWVyeSApIHtcblxuLy8gS2VlcCBhIGNvcHkgb2YgdGhlIG9sZCBsb2FkIG1ldGhvZFxudmFyIF9sb2FkID0galF1ZXJ5LmZuLmxvYWQ7XG5cbi8qKlxuICogTG9hZCBhIHVybCBpbnRvIGEgcGFnZVxuICovXG5qUXVlcnkuZm4ubG9hZCA9IGZ1bmN0aW9uKCB1cmwsIHBhcmFtcywgY2FsbGJhY2sgKSB7XG5cdGlmICggdHlwZW9mIHVybCAhPT0gXCJzdHJpbmdcIiAmJiBfbG9hZCApIHtcblx0XHRyZXR1cm4gX2xvYWQuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHR9XG5cblx0dmFyIHNlbGVjdG9yLCB0eXBlLCByZXNwb25zZSxcblx0XHRzZWxmID0gdGhpcyxcblx0XHRvZmYgPSB1cmwuaW5kZXhPZiggXCIgXCIgKTtcblxuXHRpZiAoIG9mZiA+IC0xICkge1xuXHRcdHNlbGVjdG9yID0galF1ZXJ5LnRyaW0oIHVybC5zbGljZSggb2ZmICkgKTtcblx0XHR1cmwgPSB1cmwuc2xpY2UoIDAsIG9mZiApO1xuXHR9XG5cblx0Ly8gSWYgaXQncyBhIGZ1bmN0aW9uXG5cdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHBhcmFtcyApICkge1xuXG5cdFx0Ly8gV2UgYXNzdW1lIHRoYXQgaXQncyB0aGUgY2FsbGJhY2tcblx0XHRjYWxsYmFjayA9IHBhcmFtcztcblx0XHRwYXJhbXMgPSB1bmRlZmluZWQ7XG5cblx0Ly8gT3RoZXJ3aXNlLCBidWlsZCBhIHBhcmFtIHN0cmluZ1xuXHR9IGVsc2UgaWYgKCBwYXJhbXMgJiYgdHlwZW9mIHBhcmFtcyA9PT0gXCJvYmplY3RcIiApIHtcblx0XHR0eXBlID0gXCJQT1NUXCI7XG5cdH1cblxuXHQvLyBJZiB3ZSBoYXZlIGVsZW1lbnRzIHRvIG1vZGlmeSwgbWFrZSB0aGUgcmVxdWVzdFxuXHRpZiAoIHNlbGYubGVuZ3RoID4gMCApIHtcblx0XHRqUXVlcnkuYWpheCgge1xuXHRcdFx0dXJsOiB1cmwsXG5cblx0XHRcdC8vIElmIFwidHlwZVwiIHZhcmlhYmxlIGlzIHVuZGVmaW5lZCwgdGhlbiBcIkdFVFwiIG1ldGhvZCB3aWxsIGJlIHVzZWQuXG5cdFx0XHQvLyBNYWtlIHZhbHVlIG9mIHRoaXMgZmllbGQgZXhwbGljaXQgc2luY2Vcblx0XHRcdC8vIHVzZXIgY2FuIG92ZXJyaWRlIGl0IHRocm91Z2ggYWpheFNldHVwIG1ldGhvZFxuXHRcdFx0dHlwZTogdHlwZSB8fCBcIkdFVFwiLFxuXHRcdFx0ZGF0YVR5cGU6IFwiaHRtbFwiLFxuXHRcdFx0ZGF0YTogcGFyYW1zXG5cdFx0fSApLmRvbmUoIGZ1bmN0aW9uKCByZXNwb25zZVRleHQgKSB7XG5cblx0XHRcdC8vIFNhdmUgcmVzcG9uc2UgZm9yIHVzZSBpbiBjb21wbGV0ZSBjYWxsYmFja1xuXHRcdFx0cmVzcG9uc2UgPSBhcmd1bWVudHM7XG5cblx0XHRcdHNlbGYuaHRtbCggc2VsZWN0b3IgP1xuXG5cdFx0XHRcdC8vIElmIGEgc2VsZWN0b3Igd2FzIHNwZWNpZmllZCwgbG9jYXRlIHRoZSByaWdodCBlbGVtZW50cyBpbiBhIGR1bW15IGRpdlxuXHRcdFx0XHQvLyBFeGNsdWRlIHNjcmlwdHMgdG8gYXZvaWQgSUUgJ1Blcm1pc3Npb24gRGVuaWVkJyBlcnJvcnNcblx0XHRcdFx0alF1ZXJ5KCBcIjxkaXY+XCIgKS5hcHBlbmQoIGpRdWVyeS5wYXJzZUhUTUwoIHJlc3BvbnNlVGV4dCApICkuZmluZCggc2VsZWN0b3IgKSA6XG5cblx0XHRcdFx0Ly8gT3RoZXJ3aXNlIHVzZSB0aGUgZnVsbCByZXN1bHRcblx0XHRcdFx0cmVzcG9uc2VUZXh0ICk7XG5cblx0XHQvLyBJZiB0aGUgcmVxdWVzdCBzdWNjZWVkcywgdGhpcyBmdW5jdGlvbiBnZXRzIFwiZGF0YVwiLCBcInN0YXR1c1wiLCBcImpxWEhSXCJcblx0XHQvLyBidXQgdGhleSBhcmUgaWdub3JlZCBiZWNhdXNlIHJlc3BvbnNlIHdhcyBzZXQgYWJvdmUuXG5cdFx0Ly8gSWYgaXQgZmFpbHMsIHRoaXMgZnVuY3Rpb24gZ2V0cyBcImpxWEhSXCIsIFwic3RhdHVzXCIsIFwiZXJyb3JcIlxuXHRcdH0gKS5hbHdheXMoIGNhbGxiYWNrICYmIGZ1bmN0aW9uKCBqcVhIUiwgc3RhdHVzICkge1xuXHRcdFx0c2VsZi5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y2FsbGJhY2suYXBwbHkoIHRoaXMsIHJlc3BvbnNlIHx8IFsganFYSFIucmVzcG9uc2VUZXh0LCBzdGF0dXMsIGpxWEhSIF0gKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbn0gKTtcbiJdfQ==