"use strict";

define(["../core", "../var/document", "../ajax"], function (jQuery, document) {

	// Install script dataType
	jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, " + "application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function textScript(text) {
				jQuery.globalEval(text);
				return text;
			}
		}
	});

	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter("script", function (s) {
		if (s.cache === undefined) {
			s.cache = false;
		}
		if (s.crossDomain) {
			s.type = "GET";
		}
	});

	// Bind script tag hack transport
	jQuery.ajaxTransport("script", function (s) {

		// This transport only deals with cross domain requests
		if (s.crossDomain) {
			var script, _callback;
			return {
				send: function send(_, complete) {
					script = jQuery("<script>").prop({
						charset: s.scriptCharset,
						src: s.url
					}).on("load error", _callback = function callback(evt) {
						script.remove();
						_callback = null;
						if (evt) {
							complete(evt.type === "error" ? 404 : 200, evt.type);
						}
					});

					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild(script[0]);
				},
				abort: function abort() {
					if (_callback) {
						_callback();
					}
				}
			};
		}
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9hamF4L3NjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQVEsQ0FDUCxTQURPLEVBRVAsaUJBRk8sRUFHUCxTQUhPLENBQVIsRUFJRyxVQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNkI7OztBQUdoQyxRQUFPLFNBQVAsQ0FBa0I7QUFDakIsV0FBUztBQUNSLFdBQVEsOENBQ1Asa0RBRE87R0FEVDtBQUlBLFlBQVU7QUFDVCxXQUFRLHlCQUFSO0dBREQ7QUFHQSxjQUFZO0FBQ1gsa0JBQWUsb0JBQVUsSUFBVixFQUFpQjtBQUMvQixXQUFPLFVBQVAsQ0FBbUIsSUFBbkIsRUFEK0I7QUFFL0IsV0FBTyxJQUFQLENBRitCO0lBQWpCO0dBRGhCO0VBUkQ7OztBQUhnQyxPQW9CaEMsQ0FBTyxhQUFQLENBQXNCLFFBQXRCLEVBQWdDLFVBQVUsQ0FBVixFQUFjO0FBQzdDLE1BQUssRUFBRSxLQUFGLEtBQVksU0FBWixFQUF3QjtBQUM1QixLQUFFLEtBQUYsR0FBVSxLQUFWLENBRDRCO0dBQTdCO0FBR0EsTUFBSyxFQUFFLFdBQUYsRUFBZ0I7QUFDcEIsS0FBRSxJQUFGLEdBQVMsS0FBVCxDQURvQjtHQUFyQjtFQUorQixDQUFoQzs7O0FBcEJnQyxPQThCaEMsQ0FBTyxhQUFQLENBQXNCLFFBQXRCLEVBQWdDLFVBQVUsQ0FBVixFQUFjOzs7QUFHN0MsTUFBSyxFQUFFLFdBQUYsRUFBZ0I7QUFDcEIsT0FBSSxNQUFKLEVBQVksU0FBWixDQURvQjtBQUVwQixVQUFPO0FBQ04sVUFBTSxjQUFVLENBQVYsRUFBYSxRQUFiLEVBQXdCO0FBQzdCLGNBQVMsT0FBUSxVQUFSLEVBQXFCLElBQXJCLENBQTJCO0FBQ25DLGVBQVMsRUFBRSxhQUFGO0FBQ1QsV0FBSyxFQUFFLEdBQUY7TUFGRyxFQUdMLEVBSEssQ0FJUixZQUpRLEVBS1IsWUFBVyxrQkFBVSxHQUFWLEVBQWdCO0FBQzFCLGFBQU8sTUFBUCxHQUQwQjtBQUUxQixrQkFBVyxJQUFYLENBRjBCO0FBRzFCLFVBQUssR0FBTCxFQUFXO0FBQ1YsZ0JBQVUsSUFBSSxJQUFKLEtBQWEsT0FBYixHQUF1QixHQUF2QixHQUE2QixHQUE3QixFQUFrQyxJQUFJLElBQUosQ0FBNUMsQ0FEVTtPQUFYO01BSFUsQ0FMWjs7O0FBRDZCLGFBZ0I3QixDQUFTLElBQVQsQ0FBYyxXQUFkLENBQTJCLE9BQVEsQ0FBUixDQUEzQixFQWhCNkI7S0FBeEI7QUFrQk4sV0FBTyxpQkFBVztBQUNqQixTQUFLLFNBQUwsRUFBZ0I7QUFDZixrQkFEZTtNQUFoQjtLQURNO0lBbkJSLENBRm9CO0dBQXJCO0VBSCtCLENBQWhDLENBOUJnQztDQUE3QixDQUpIIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4uL2NvcmVcIixcblx0XCIuLi92YXIvZG9jdW1lbnRcIixcblx0XCIuLi9hamF4XCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIGRvY3VtZW50ICkge1xuXG4vLyBJbnN0YWxsIHNjcmlwdCBkYXRhVHlwZVxualF1ZXJ5LmFqYXhTZXR1cCgge1xuXHRhY2NlcHRzOiB7XG5cdFx0c2NyaXB0OiBcInRleHQvamF2YXNjcmlwdCwgYXBwbGljYXRpb24vamF2YXNjcmlwdCwgXCIgK1xuXHRcdFx0XCJhcHBsaWNhdGlvbi9lY21hc2NyaXB0LCBhcHBsaWNhdGlvbi94LWVjbWFzY3JpcHRcIlxuXHR9LFxuXHRjb250ZW50czoge1xuXHRcdHNjcmlwdDogL1xcYig/OmphdmF8ZWNtYSlzY3JpcHRcXGIvXG5cdH0sXG5cdGNvbnZlcnRlcnM6IHtcblx0XHRcInRleHQgc2NyaXB0XCI6IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRcdFx0alF1ZXJ5Lmdsb2JhbEV2YWwoIHRleHQgKTtcblx0XHRcdHJldHVybiB0ZXh0O1xuXHRcdH1cblx0fVxufSApO1xuXG4vLyBIYW5kbGUgY2FjaGUncyBzcGVjaWFsIGNhc2UgYW5kIGNyb3NzRG9tYWluXG5qUXVlcnkuYWpheFByZWZpbHRlciggXCJzY3JpcHRcIiwgZnVuY3Rpb24oIHMgKSB7XG5cdGlmICggcy5jYWNoZSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdHMuY2FjaGUgPSBmYWxzZTtcblx0fVxuXHRpZiAoIHMuY3Jvc3NEb21haW4gKSB7XG5cdFx0cy50eXBlID0gXCJHRVRcIjtcblx0fVxufSApO1xuXG4vLyBCaW5kIHNjcmlwdCB0YWcgaGFjayB0cmFuc3BvcnRcbmpRdWVyeS5hamF4VHJhbnNwb3J0KCBcInNjcmlwdFwiLCBmdW5jdGlvbiggcyApIHtcblxuXHQvLyBUaGlzIHRyYW5zcG9ydCBvbmx5IGRlYWxzIHdpdGggY3Jvc3MgZG9tYWluIHJlcXVlc3RzXG5cdGlmICggcy5jcm9zc0RvbWFpbiApIHtcblx0XHR2YXIgc2NyaXB0LCBjYWxsYmFjaztcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VuZDogZnVuY3Rpb24oIF8sIGNvbXBsZXRlICkge1xuXHRcdFx0XHRzY3JpcHQgPSBqUXVlcnkoIFwiPHNjcmlwdD5cIiApLnByb3AoIHtcblx0XHRcdFx0XHRjaGFyc2V0OiBzLnNjcmlwdENoYXJzZXQsXG5cdFx0XHRcdFx0c3JjOiBzLnVybFxuXHRcdFx0XHR9ICkub24oXG5cdFx0XHRcdFx0XCJsb2FkIGVycm9yXCIsXG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSBmdW5jdGlvbiggZXZ0ICkge1xuXHRcdFx0XHRcdFx0c2NyaXB0LnJlbW92ZSgpO1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2sgPSBudWxsO1xuXHRcdFx0XHRcdFx0aWYgKCBldnQgKSB7XG5cdFx0XHRcdFx0XHRcdGNvbXBsZXRlKCBldnQudHlwZSA9PT0gXCJlcnJvclwiID8gNDA0IDogMjAwLCBldnQudHlwZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblxuXHRcdFx0XHQvLyBVc2UgbmF0aXZlIERPTSBtYW5pcHVsYXRpb24gdG8gYXZvaWQgb3VyIGRvbU1hbmlwIEFKQVggdHJpY2tlcnlcblx0XHRcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZCggc2NyaXB0WyAwIF0gKTtcblx0XHRcdH0sXG5cdFx0XHRhYm9ydDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggY2FsbGJhY2sgKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdH1cbn0gKTtcblxufSApO1xuIl19