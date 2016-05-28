"use strict";

define(["../core", "./var/nonce", "./var/rquery", "../ajax"], function (jQuery, nonce, rquery) {

	var oldCallbacks = [],
	    rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function jsonpCallback() {
			var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
			this[callback] = true;
			return callback;
		}
	});

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

		var callbackName,
		    overwritten,
		    responseContainer,
		    jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if (jsonProp || s.dataTypes[0] === "jsonp") {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;

			// Insert callback into url or form data
			if (jsonProp) {
				s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
			} else if (s.jsonp !== false) {
				s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters["script json"] = function () {
				if (!responseContainer) {
					jQuery.error(callbackName + " was not called");
				}
				return responseContainer[0];
			};

			// Force json dataType
			s.dataTypes[0] = "json";

			// Install callback
			overwritten = window[callbackName];
			window[callbackName] = function () {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always(function () {

				// If previous value didn't exist - remove it
				if (overwritten === undefined) {
					jQuery(window).removeProp(callbackName);

					// Otherwise restore preexisting value
				} else {
						window[callbackName] = overwritten;
					}

				// Save back as free
				if (s[callbackName]) {

					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// Save the callback name for future use
					oldCallbacks.push(callbackName);
				}

				// Call if it was a function and we have a response
				if (responseContainer && jQuery.isFunction(overwritten)) {
					overwritten(responseContainer[0]);
				}

				responseContainer = overwritten = undefined;
			});

			// Delegate to script
			return "script";
		}
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9hamF4L2pzb25wLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxDQUNQLFNBRE8sRUFFUCxhQUZPLEVBR1AsY0FITyxFQUlQLFNBSk8sQ0FBUixFQUtHLFVBQVUsTUFBVixFQUFrQixLQUFsQixFQUF5QixNQUF6QixFQUFrQzs7QUFFckMsS0FBSSxlQUFlLEVBQWY7S0FDSCxTQUFTLG1CQUFUOzs7QUFIb0MsT0FNckMsQ0FBTyxTQUFQLENBQWtCO0FBQ2pCLFNBQU8sVUFBUDtBQUNBLGlCQUFlLHlCQUFXO0FBQ3pCLE9BQUksV0FBVyxhQUFhLEdBQWIsTUFBd0IsT0FBTyxPQUFQLEdBQWlCLEdBQWpCLEdBQXlCLE9BQXpCLENBRGQ7QUFFekIsUUFBTSxRQUFOLElBQW1CLElBQW5CLENBRnlCO0FBR3pCLFVBQU8sUUFBUCxDQUh5QjtHQUFYO0VBRmhCOzs7QUFOcUMsT0FnQnJDLENBQU8sYUFBUCxDQUFzQixZQUF0QixFQUFvQyxVQUFVLENBQVYsRUFBYSxnQkFBYixFQUErQixLQUEvQixFQUF1Qzs7QUFFMUUsTUFBSSxZQUFKO01BQWtCLFdBQWxCO01BQStCLGlCQUEvQjtNQUNDLFdBQVcsRUFBRSxLQUFGLEtBQVksS0FBWixLQUF1QixPQUFPLElBQVAsQ0FBYSxFQUFFLEdBQUYsQ0FBYixHQUNqQyxLQURpQyxHQUVqQyxPQUFPLEVBQUUsSUFBRixLQUFXLFFBQWxCLElBQ0MsQ0FBRSxFQUFFLFdBQUYsSUFBaUIsRUFBakIsQ0FBRixDQUNFLE9BREYsQ0FDVyxtQ0FEWCxNQUNxRCxDQURyRCxJQUVBLE9BQU8sSUFBUCxDQUFhLEVBQUUsSUFBRixDQUhkLElBRzBCLE1BSDFCLENBRlU7OztBQUg4RCxNQVlyRSxZQUFZLEVBQUUsU0FBRixDQUFhLENBQWIsTUFBcUIsT0FBckIsRUFBK0I7OztBQUcvQyxrQkFBZSxFQUFFLGFBQUYsR0FBa0IsT0FBTyxVQUFQLENBQW1CLEVBQUUsYUFBRixDQUFuQixHQUNoQyxFQUFFLGFBQUYsRUFEZ0MsR0FFaEMsRUFBRSxhQUFGOzs7QUFMOEMsT0FRMUMsUUFBTCxFQUFnQjtBQUNmLE1BQUcsUUFBSCxJQUFnQixFQUFHLFFBQUgsRUFBYyxPQUFkLENBQXVCLE1BQXZCLEVBQStCLE9BQU8sWUFBUCxDQUEvQyxDQURlO0lBQWhCLE1BRU8sSUFBSyxFQUFFLEtBQUYsS0FBWSxLQUFaLEVBQW9CO0FBQy9CLE1BQUUsR0FBRixJQUFTLENBQUUsT0FBTyxJQUFQLENBQWEsRUFBRSxHQUFGLENBQWIsR0FBdUIsR0FBdkIsR0FBNkIsR0FBN0IsQ0FBRixHQUF1QyxFQUFFLEtBQUYsR0FBVSxHQUFqRCxHQUF1RCxZQUF2RCxDQURzQjtJQUF6Qjs7O0FBVndDLElBZS9DLENBQUUsVUFBRixDQUFjLGFBQWQsSUFBZ0MsWUFBVztBQUMxQyxRQUFLLENBQUMsaUJBQUQsRUFBcUI7QUFDekIsWUFBTyxLQUFQLENBQWMsZUFBZSxpQkFBZixDQUFkLENBRHlCO0tBQTFCO0FBR0EsV0FBTyxrQkFBbUIsQ0FBbkIsQ0FBUCxDQUowQztJQUFYOzs7QUFmZSxJQXVCL0MsQ0FBRSxTQUFGLENBQWEsQ0FBYixJQUFtQixNQUFuQjs7O0FBdkIrQyxjQTBCL0MsR0FBYyxPQUFRLFlBQVIsQ0FBZCxDQTFCK0M7QUEyQi9DLFVBQVEsWUFBUixJQUF5QixZQUFXO0FBQ25DLHdCQUFvQixTQUFwQixDQURtQztJQUFYOzs7QUEzQnNCLFFBZ0MvQyxDQUFNLE1BQU4sQ0FBYyxZQUFXOzs7QUFHeEIsUUFBSyxnQkFBZ0IsU0FBaEIsRUFBNEI7QUFDaEMsWUFBUSxNQUFSLEVBQWlCLFVBQWpCLENBQTZCLFlBQTdCOzs7QUFEZ0MsS0FBakMsTUFJTztBQUNOLGFBQVEsWUFBUixJQUF5QixXQUF6QixDQURNO01BSlA7OztBQUh3QixRQVluQixFQUFHLFlBQUgsQ0FBTCxFQUF5Qjs7O0FBR3hCLE9BQUUsYUFBRixHQUFrQixpQkFBaUIsYUFBakI7OztBQUhNLGlCQU14QixDQUFhLElBQWIsQ0FBbUIsWUFBbkIsRUFOd0I7S0FBekI7OztBQVp3QixRQXNCbkIscUJBQXFCLE9BQU8sVUFBUCxDQUFtQixXQUFuQixDQUFyQixFQUF3RDtBQUM1RCxpQkFBYSxrQkFBbUIsQ0FBbkIsQ0FBYixFQUQ0RDtLQUE3RDs7QUFJQSx3QkFBb0IsY0FBYyxTQUFkLENBMUJJO0lBQVgsQ0FBZDs7O0FBaEMrQyxVQThEeEMsUUFBUCxDQTlEK0M7R0FBaEQ7RUFabUMsQ0FBcEMsQ0FoQnFDO0NBQWxDLENBTEgiLCJmaWxlIjoianNvbnAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuLi9jb3JlXCIsXG5cdFwiLi92YXIvbm9uY2VcIixcblx0XCIuL3Zhci9ycXVlcnlcIixcblx0XCIuLi9hamF4XCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIG5vbmNlLCBycXVlcnkgKSB7XG5cbnZhciBvbGRDYWxsYmFja3MgPSBbXSxcblx0cmpzb25wID0gLyg9KVxcPyg/PSZ8JCl8XFw/XFw/LztcblxuLy8gRGVmYXVsdCBqc29ucCBzZXR0aW5nc1xualF1ZXJ5LmFqYXhTZXR1cCgge1xuXHRqc29ucDogXCJjYWxsYmFja1wiLFxuXHRqc29ucENhbGxiYWNrOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgY2FsbGJhY2sgPSBvbGRDYWxsYmFja3MucG9wKCkgfHwgKCBqUXVlcnkuZXhwYW5kbyArIFwiX1wiICsgKCBub25jZSsrICkgKTtcblx0XHR0aGlzWyBjYWxsYmFjayBdID0gdHJ1ZTtcblx0XHRyZXR1cm4gY2FsbGJhY2s7XG5cdH1cbn0gKTtcblxuLy8gRGV0ZWN0LCBub3JtYWxpemUgb3B0aW9ucyBhbmQgaW5zdGFsbCBjYWxsYmFja3MgZm9yIGpzb25wIHJlcXVlc3RzXG5qUXVlcnkuYWpheFByZWZpbHRlciggXCJqc29uIGpzb25wXCIsIGZ1bmN0aW9uKCBzLCBvcmlnaW5hbFNldHRpbmdzLCBqcVhIUiApIHtcblxuXHR2YXIgY2FsbGJhY2tOYW1lLCBvdmVyd3JpdHRlbiwgcmVzcG9uc2VDb250YWluZXIsXG5cdFx0anNvblByb3AgPSBzLmpzb25wICE9PSBmYWxzZSAmJiAoIHJqc29ucC50ZXN0KCBzLnVybCApID9cblx0XHRcdFwidXJsXCIgOlxuXHRcdFx0dHlwZW9mIHMuZGF0YSA9PT0gXCJzdHJpbmdcIiAmJlxuXHRcdFx0XHQoIHMuY29udGVudFR5cGUgfHwgXCJcIiApXG5cdFx0XHRcdFx0LmluZGV4T2YoIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIgKSA9PT0gMCAmJlxuXHRcdFx0XHRyanNvbnAudGVzdCggcy5kYXRhICkgJiYgXCJkYXRhXCJcblx0XHQpO1xuXG5cdC8vIEhhbmRsZSBpZmYgdGhlIGV4cGVjdGVkIGRhdGEgdHlwZSBpcyBcImpzb25wXCIgb3Igd2UgaGF2ZSBhIHBhcmFtZXRlciB0byBzZXRcblx0aWYgKCBqc29uUHJvcCB8fCBzLmRhdGFUeXBlc1sgMCBdID09PSBcImpzb25wXCIgKSB7XG5cblx0XHQvLyBHZXQgY2FsbGJhY2sgbmFtZSwgcmVtZW1iZXJpbmcgcHJlZXhpc3RpbmcgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIGl0XG5cdFx0Y2FsbGJhY2tOYW1lID0gcy5qc29ucENhbGxiYWNrID0galF1ZXJ5LmlzRnVuY3Rpb24oIHMuanNvbnBDYWxsYmFjayApID9cblx0XHRcdHMuanNvbnBDYWxsYmFjaygpIDpcblx0XHRcdHMuanNvbnBDYWxsYmFjaztcblxuXHRcdC8vIEluc2VydCBjYWxsYmFjayBpbnRvIHVybCBvciBmb3JtIGRhdGFcblx0XHRpZiAoIGpzb25Qcm9wICkge1xuXHRcdFx0c1sganNvblByb3AgXSA9IHNbIGpzb25Qcm9wIF0ucmVwbGFjZSggcmpzb25wLCBcIiQxXCIgKyBjYWxsYmFja05hbWUgKTtcblx0XHR9IGVsc2UgaWYgKCBzLmpzb25wICE9PSBmYWxzZSApIHtcblx0XHRcdHMudXJsICs9ICggcnF1ZXJ5LnRlc3QoIHMudXJsICkgPyBcIiZcIiA6IFwiP1wiICkgKyBzLmpzb25wICsgXCI9XCIgKyBjYWxsYmFja05hbWU7XG5cdFx0fVxuXG5cdFx0Ly8gVXNlIGRhdGEgY29udmVydGVyIHRvIHJldHJpZXZlIGpzb24gYWZ0ZXIgc2NyaXB0IGV4ZWN1dGlvblxuXHRcdHMuY29udmVydGVyc1sgXCJzY3JpcHQganNvblwiIF0gPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggIXJlc3BvbnNlQ29udGFpbmVyICkge1xuXHRcdFx0XHRqUXVlcnkuZXJyb3IoIGNhbGxiYWNrTmFtZSArIFwiIHdhcyBub3QgY2FsbGVkXCIgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXNwb25zZUNvbnRhaW5lclsgMCBdO1xuXHRcdH07XG5cblx0XHQvLyBGb3JjZSBqc29uIGRhdGFUeXBlXG5cdFx0cy5kYXRhVHlwZXNbIDAgXSA9IFwianNvblwiO1xuXG5cdFx0Ly8gSW5zdGFsbCBjYWxsYmFja1xuXHRcdG92ZXJ3cml0dGVuID0gd2luZG93WyBjYWxsYmFja05hbWUgXTtcblx0XHR3aW5kb3dbIGNhbGxiYWNrTmFtZSBdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXNwb25zZUNvbnRhaW5lciA9IGFyZ3VtZW50cztcblx0XHR9O1xuXG5cdFx0Ly8gQ2xlYW4tdXAgZnVuY3Rpb24gKGZpcmVzIGFmdGVyIGNvbnZlcnRlcnMpXG5cdFx0anFYSFIuYWx3YXlzKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gSWYgcHJldmlvdXMgdmFsdWUgZGlkbid0IGV4aXN0IC0gcmVtb3ZlIGl0XG5cdFx0XHRpZiAoIG92ZXJ3cml0dGVuID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdGpRdWVyeSggd2luZG93ICkucmVtb3ZlUHJvcCggY2FsbGJhY2tOYW1lICk7XG5cblx0XHRcdC8vIE90aGVyd2lzZSByZXN0b3JlIHByZWV4aXN0aW5nIHZhbHVlXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3aW5kb3dbIGNhbGxiYWNrTmFtZSBdID0gb3ZlcndyaXR0ZW47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNhdmUgYmFjayBhcyBmcmVlXG5cdFx0XHRpZiAoIHNbIGNhbGxiYWNrTmFtZSBdICkge1xuXG5cdFx0XHRcdC8vIE1ha2Ugc3VyZSB0aGF0IHJlLXVzaW5nIHRoZSBvcHRpb25zIGRvZXNuJ3Qgc2NyZXcgdGhpbmdzIGFyb3VuZFxuXHRcdFx0XHRzLmpzb25wQ2FsbGJhY2sgPSBvcmlnaW5hbFNldHRpbmdzLmpzb25wQ2FsbGJhY2s7XG5cblx0XHRcdFx0Ly8gU2F2ZSB0aGUgY2FsbGJhY2sgbmFtZSBmb3IgZnV0dXJlIHVzZVxuXHRcdFx0XHRvbGRDYWxsYmFja3MucHVzaCggY2FsbGJhY2tOYW1lICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENhbGwgaWYgaXQgd2FzIGEgZnVuY3Rpb24gYW5kIHdlIGhhdmUgYSByZXNwb25zZVxuXHRcdFx0aWYgKCByZXNwb25zZUNvbnRhaW5lciAmJiBqUXVlcnkuaXNGdW5jdGlvbiggb3ZlcndyaXR0ZW4gKSApIHtcblx0XHRcdFx0b3ZlcndyaXR0ZW4oIHJlc3BvbnNlQ29udGFpbmVyWyAwIF0gKTtcblx0XHRcdH1cblxuXHRcdFx0cmVzcG9uc2VDb250YWluZXIgPSBvdmVyd3JpdHRlbiA9IHVuZGVmaW5lZDtcblx0XHR9ICk7XG5cblx0XHQvLyBEZWxlZ2F0ZSB0byBzY3JpcHRcblx0XHRyZXR1cm4gXCJzY3JpcHRcIjtcblx0fVxufSApO1xuXG59ICk7XG4iXX0=