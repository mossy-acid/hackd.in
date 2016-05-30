"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(["./core", "./manipulation/var/rcheckableType", "./core/init", "./traversing", // filter
"./attributes/prop"], function (jQuery, rcheckableType) {

	var r20 = /%20/g,
	    rbracket = /\[\]$/,
	    rCRLF = /\r?\n/g,
	    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	    rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams(prefix, obj, traditional, add) {
		var name;

		if (jQuery.isArray(obj)) {

			// Serialize array item.
			jQuery.each(obj, function (i, v) {
				if (traditional || rbracket.test(prefix)) {

					// Treat each array item as a scalar.
					add(prefix, v);
				} else {

					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(prefix + "[" + ((typeof v === "undefined" ? "undefined" : _typeof(v)) === "object" && v != null ? i : "") + "]", v, traditional, add);
				}
			});
		} else if (!traditional && jQuery.type(obj) === "object") {

			// Serialize object item.
			for (name in obj) {
				buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
			}
		} else {

			// Serialize scalar item.
			add(prefix, obj);
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function (a, traditional) {
		var prefix,
		    s = [],
		    add = function add(key, value) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction(value) ? value() : value == null ? "" : value;
			s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
		};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if (traditional === undefined) {
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if (jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {

			// Serialize the form elements
			jQuery.each(a, function () {
				add(this.name, this.value);
			});
		} else {

			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for (prefix in a) {
				buildParams(prefix, a[prefix], traditional, add);
			}
		}

		// Return the resulting serialization
		return s.join("&").replace(r20, "+");
	};

	jQuery.fn.extend({
		serialize: function serialize() {
			return jQuery.param(this.serializeArray());
		},
		serializeArray: function serializeArray() {
			return this.map(function () {

				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop(this, "elements");
				return elements ? jQuery.makeArray(elements) : this;
			}).filter(function () {
				var type = this.type;

				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
			}).map(function (i, elem) {
				var val = jQuery(this).val();

				return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function (val) {
					return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
				}) : { name: elem.name, value: val.replace(rCRLF, "\r\n") };
			}).get();
		}
	});

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9zZXJpYWxpemUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQVEsQ0FDUCxRQURPLEVBRVAsbUNBRk8sRUFHUCxhQUhPLEVBSVAsY0FKTztBQUtQLG1CQUxPLENBQVIsRUFNRyxVQUFVLE1BQVYsRUFBa0IsY0FBbEIsRUFBbUM7O0FBRXRDLEtBQUksTUFBTSxNQUFOO0tBQ0gsV0FBVyxPQUFYO0tBQ0EsUUFBUSxRQUFSO0tBQ0Esa0JBQWtCLHVDQUFsQjtLQUNBLGVBQWUsb0NBQWYsQ0FOcUM7O0FBUXRDLFVBQVMsV0FBVCxDQUFzQixNQUF0QixFQUE4QixHQUE5QixFQUFtQyxXQUFuQyxFQUFnRCxHQUFoRCxFQUFzRDtBQUNyRCxNQUFJLElBQUosQ0FEcUQ7O0FBR3JELE1BQUssT0FBTyxPQUFQLENBQWdCLEdBQWhCLENBQUwsRUFBNkI7OztBQUc1QixVQUFPLElBQVAsQ0FBYSxHQUFiLEVBQWtCLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBaUI7QUFDbEMsUUFBSyxlQUFlLFNBQVMsSUFBVCxDQUFlLE1BQWYsQ0FBZixFQUF5Qzs7O0FBRzdDLFNBQUssTUFBTCxFQUFhLENBQWIsRUFINkM7S0FBOUMsTUFLTzs7O0FBR04saUJBQ0MsU0FBUyxHQUFULElBQWlCLFFBQU8sNkNBQVAsS0FBYSxRQUFiLElBQXlCLEtBQUssSUFBTCxHQUFZLENBQXJDLEdBQXlDLEVBQXpDLENBQWpCLEdBQWlFLEdBQWpFLEVBQ0EsQ0FGRCxFQUdDLFdBSEQsRUFJQyxHQUpELEVBSE07S0FMUDtJQURpQixDQUFsQixDQUg0QjtHQUE3QixNQXFCTyxJQUFLLENBQUMsV0FBRCxJQUFnQixPQUFPLElBQVAsQ0FBYSxHQUFiLE1BQXVCLFFBQXZCLEVBQWtDOzs7QUFHN0QsUUFBTSxJQUFOLElBQWMsR0FBZCxFQUFvQjtBQUNuQixnQkFBYSxTQUFTLEdBQVQsR0FBZSxJQUFmLEdBQXNCLEdBQXRCLEVBQTJCLElBQUssSUFBTCxDQUF4QyxFQUFxRCxXQUFyRCxFQUFrRSxHQUFsRSxFQURtQjtJQUFwQjtHQUhNLE1BT0E7OztBQUdOLE9BQUssTUFBTCxFQUFhLEdBQWIsRUFITTtHQVBBO0VBeEJSOzs7O0FBUnNDLE9BZ0R0QyxDQUFPLEtBQVAsR0FBZSxVQUFVLENBQVYsRUFBYSxXQUFiLEVBQTJCO0FBQ3pDLE1BQUksTUFBSjtNQUNDLElBQUksRUFBSjtNQUNBLE1BQU0sU0FBTixHQUFNLENBQVUsR0FBVixFQUFlLEtBQWYsRUFBdUI7OztBQUc1QixXQUFRLE9BQU8sVUFBUCxDQUFtQixLQUFuQixJQUE2QixPQUE3QixHQUF5QyxTQUFTLElBQVQsR0FBZ0IsRUFBaEIsR0FBcUIsS0FBckIsQ0FIckI7QUFJNUIsS0FBRyxFQUFFLE1BQUYsQ0FBSCxHQUFnQixtQkFBb0IsR0FBcEIsSUFBNEIsR0FBNUIsR0FBa0MsbUJBQW9CLEtBQXBCLENBQWxDLENBSlk7R0FBdkI7OztBQUhrQyxNQVdwQyxnQkFBZ0IsU0FBaEIsRUFBNEI7QUFDaEMsaUJBQWMsT0FBTyxZQUFQLElBQXVCLE9BQU8sWUFBUCxDQUFvQixXQUFwQixDQURMO0dBQWpDOzs7QUFYeUMsTUFnQnBDLE9BQU8sT0FBUCxDQUFnQixDQUFoQixLQUF5QixFQUFFLE1BQUYsSUFBWSxDQUFDLE9BQU8sYUFBUCxDQUFzQixDQUF0QixDQUFELEVBQStCOzs7QUFHeEUsVUFBTyxJQUFQLENBQWEsQ0FBYixFQUFnQixZQUFXO0FBQzFCLFFBQUssS0FBSyxJQUFMLEVBQVcsS0FBSyxLQUFMLENBQWhCLENBRDBCO0lBQVgsQ0FBaEIsQ0FId0U7R0FBekUsTUFPTzs7OztBQUlOLFFBQU0sTUFBTixJQUFnQixDQUFoQixFQUFvQjtBQUNuQixnQkFBYSxNQUFiLEVBQXFCLEVBQUcsTUFBSCxDQUFyQixFQUFrQyxXQUFsQyxFQUErQyxHQUEvQyxFQURtQjtJQUFwQjtHQVhEOzs7QUFoQnlDLFNBaUNsQyxFQUFFLElBQUYsQ0FBUSxHQUFSLEVBQWMsT0FBZCxDQUF1QixHQUF2QixFQUE0QixHQUE1QixDQUFQLENBakN5QztFQUEzQixDQWhEdUI7O0FBb0Z0QyxRQUFPLEVBQVAsQ0FBVSxNQUFWLENBQWtCO0FBQ2pCLGFBQVcscUJBQVc7QUFDckIsVUFBTyxPQUFPLEtBQVAsQ0FBYyxLQUFLLGNBQUwsRUFBZCxDQUFQLENBRHFCO0dBQVg7QUFHWCxrQkFBZ0IsMEJBQVc7QUFDMUIsVUFBTyxLQUFLLEdBQUwsQ0FBVSxZQUFXOzs7QUFHM0IsUUFBSSxXQUFXLE9BQU8sSUFBUCxDQUFhLElBQWIsRUFBbUIsVUFBbkIsQ0FBWCxDQUh1QjtBQUkzQixXQUFPLFdBQVcsT0FBTyxTQUFQLENBQWtCLFFBQWxCLENBQVgsR0FBMEMsSUFBMUMsQ0FKb0I7SUFBWCxDQUFWLENBTU4sTUFOTSxDQU1FLFlBQVc7QUFDbkIsUUFBSSxPQUFPLEtBQUssSUFBTDs7O0FBRFEsV0FJWixLQUFLLElBQUwsSUFBYSxDQUFDLE9BQVEsSUFBUixFQUFlLEVBQWYsQ0FBbUIsV0FBbkIsQ0FBRCxJQUNuQixhQUFhLElBQWIsQ0FBbUIsS0FBSyxRQUFMLENBRGIsSUFDZ0MsQ0FBQyxnQkFBZ0IsSUFBaEIsQ0FBc0IsSUFBdEIsQ0FBRCxLQUNwQyxLQUFLLE9BQUwsSUFBZ0IsQ0FBQyxlQUFlLElBQWYsQ0FBcUIsSUFBckIsQ0FBRCxDQUZaLENBSlk7SUFBWCxDQU5GLENBY04sR0FkTSxDQWNELFVBQVUsQ0FBVixFQUFhLElBQWIsRUFBb0I7QUFDekIsUUFBSSxNQUFNLE9BQVEsSUFBUixFQUFlLEdBQWYsRUFBTixDQURxQjs7QUFHekIsV0FBTyxPQUFPLElBQVAsR0FDTixJQURNLEdBRU4sT0FBTyxPQUFQLENBQWdCLEdBQWhCLElBQ0MsT0FBTyxHQUFQLENBQVksR0FBWixFQUFpQixVQUFVLEdBQVYsRUFBZ0I7QUFDaEMsWUFBTyxFQUFFLE1BQU0sS0FBSyxJQUFMLEVBQVcsT0FBTyxJQUFJLE9BQUosQ0FBYSxLQUFiLEVBQW9CLE1BQXBCLENBQVAsRUFBMUIsQ0FEZ0M7S0FBaEIsQ0FEbEIsR0FJQyxFQUFFLE1BQU0sS0FBSyxJQUFMLEVBQVcsT0FBTyxJQUFJLE9BQUosQ0FBYSxLQUFiLEVBQW9CLE1BQXBCLENBQVAsRUFKcEIsQ0FMd0I7SUFBcEIsQ0FkQyxDQXdCSCxHQXhCRyxFQUFQLENBRDBCO0dBQVg7RUFKakIsRUFwRnNDOztBQXFIdEMsUUFBTyxNQUFQLENBckhzQztDQUFuQyxDQU5IIiwiZmlsZSI6InNlcmlhbGl6ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4vY29yZVwiLFxuXHRcIi4vbWFuaXB1bGF0aW9uL3Zhci9yY2hlY2thYmxlVHlwZVwiLFxuXHRcIi4vY29yZS9pbml0XCIsXG5cdFwiLi90cmF2ZXJzaW5nXCIsIC8vIGZpbHRlclxuXHRcIi4vYXR0cmlidXRlcy9wcm9wXCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIHJjaGVja2FibGVUeXBlICkge1xuXG52YXIgcjIwID0gLyUyMC9nLFxuXHRyYnJhY2tldCA9IC9cXFtcXF0kLyxcblx0ckNSTEYgPSAvXFxyP1xcbi9nLFxuXHRyc3VibWl0dGVyVHlwZXMgPSAvXig/OnN1Ym1pdHxidXR0b258aW1hZ2V8cmVzZXR8ZmlsZSkkL2ksXG5cdHJzdWJtaXR0YWJsZSA9IC9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhfGtleWdlbikvaTtcblxuZnVuY3Rpb24gYnVpbGRQYXJhbXMoIHByZWZpeCwgb2JqLCB0cmFkaXRpb25hbCwgYWRkICkge1xuXHR2YXIgbmFtZTtcblxuXHRpZiAoIGpRdWVyeS5pc0FycmF5KCBvYmogKSApIHtcblxuXHRcdC8vIFNlcmlhbGl6ZSBhcnJheSBpdGVtLlxuXHRcdGpRdWVyeS5lYWNoKCBvYmosIGZ1bmN0aW9uKCBpLCB2ICkge1xuXHRcdFx0aWYgKCB0cmFkaXRpb25hbCB8fCByYnJhY2tldC50ZXN0KCBwcmVmaXggKSApIHtcblxuXHRcdFx0XHQvLyBUcmVhdCBlYWNoIGFycmF5IGl0ZW0gYXMgYSBzY2FsYXIuXG5cdFx0XHRcdGFkZCggcHJlZml4LCB2ICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gSXRlbSBpcyBub24tc2NhbGFyIChhcnJheSBvciBvYmplY3QpLCBlbmNvZGUgaXRzIG51bWVyaWMgaW5kZXguXG5cdFx0XHRcdGJ1aWxkUGFyYW1zKFxuXHRcdFx0XHRcdHByZWZpeCArIFwiW1wiICsgKCB0eXBlb2YgdiA9PT0gXCJvYmplY3RcIiAmJiB2ICE9IG51bGwgPyBpIDogXCJcIiApICsgXCJdXCIsXG5cdFx0XHRcdFx0dixcblx0XHRcdFx0XHR0cmFkaXRpb25hbCxcblx0XHRcdFx0XHRhZGRcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0fSBlbHNlIGlmICggIXRyYWRpdGlvbmFsICYmIGpRdWVyeS50eXBlKCBvYmogKSA9PT0gXCJvYmplY3RcIiApIHtcblxuXHRcdC8vIFNlcmlhbGl6ZSBvYmplY3QgaXRlbS5cblx0XHRmb3IgKCBuYW1lIGluIG9iaiApIHtcblx0XHRcdGJ1aWxkUGFyYW1zKCBwcmVmaXggKyBcIltcIiArIG5hbWUgKyBcIl1cIiwgb2JqWyBuYW1lIF0sIHRyYWRpdGlvbmFsLCBhZGQgKTtcblx0XHR9XG5cblx0fSBlbHNlIHtcblxuXHRcdC8vIFNlcmlhbGl6ZSBzY2FsYXIgaXRlbS5cblx0XHRhZGQoIHByZWZpeCwgb2JqICk7XG5cdH1cbn1cblxuLy8gU2VyaWFsaXplIGFuIGFycmF5IG9mIGZvcm0gZWxlbWVudHMgb3IgYSBzZXQgb2Zcbi8vIGtleS92YWx1ZXMgaW50byBhIHF1ZXJ5IHN0cmluZ1xualF1ZXJ5LnBhcmFtID0gZnVuY3Rpb24oIGEsIHRyYWRpdGlvbmFsICkge1xuXHR2YXIgcHJlZml4LFxuXHRcdHMgPSBbXSxcblx0XHRhZGQgPSBmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcblxuXHRcdFx0Ly8gSWYgdmFsdWUgaXMgYSBmdW5jdGlvbiwgaW52b2tlIGl0IGFuZCByZXR1cm4gaXRzIHZhbHVlXG5cdFx0XHR2YWx1ZSA9IGpRdWVyeS5pc0Z1bmN0aW9uKCB2YWx1ZSApID8gdmFsdWUoKSA6ICggdmFsdWUgPT0gbnVsbCA/IFwiXCIgOiB2YWx1ZSApO1xuXHRcdFx0c1sgcy5sZW5ndGggXSA9IGVuY29kZVVSSUNvbXBvbmVudCgga2V5ICkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCggdmFsdWUgKTtcblx0XHR9O1xuXG5cdC8vIFNldCB0cmFkaXRpb25hbCB0byB0cnVlIGZvciBqUXVlcnkgPD0gMS4zLjIgYmVoYXZpb3IuXG5cdGlmICggdHJhZGl0aW9uYWwgPT09IHVuZGVmaW5lZCApIHtcblx0XHR0cmFkaXRpb25hbCA9IGpRdWVyeS5hamF4U2V0dGluZ3MgJiYgalF1ZXJ5LmFqYXhTZXR0aW5ncy50cmFkaXRpb25hbDtcblx0fVxuXG5cdC8vIElmIGFuIGFycmF5IHdhcyBwYXNzZWQgaW4sIGFzc3VtZSB0aGF0IGl0IGlzIGFuIGFycmF5IG9mIGZvcm0gZWxlbWVudHMuXG5cdGlmICggalF1ZXJ5LmlzQXJyYXkoIGEgKSB8fCAoIGEuanF1ZXJ5ICYmICFqUXVlcnkuaXNQbGFpbk9iamVjdCggYSApICkgKSB7XG5cblx0XHQvLyBTZXJpYWxpemUgdGhlIGZvcm0gZWxlbWVudHNcblx0XHRqUXVlcnkuZWFjaCggYSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRhZGQoIHRoaXMubmFtZSwgdGhpcy52YWx1ZSApO1xuXHRcdH0gKTtcblxuXHR9IGVsc2Uge1xuXG5cdFx0Ly8gSWYgdHJhZGl0aW9uYWwsIGVuY29kZSB0aGUgXCJvbGRcIiB3YXkgKHRoZSB3YXkgMS4zLjIgb3Igb2xkZXJcblx0XHQvLyBkaWQgaXQpLCBvdGhlcndpc2UgZW5jb2RlIHBhcmFtcyByZWN1cnNpdmVseS5cblx0XHRmb3IgKCBwcmVmaXggaW4gYSApIHtcblx0XHRcdGJ1aWxkUGFyYW1zKCBwcmVmaXgsIGFbIHByZWZpeCBdLCB0cmFkaXRpb25hbCwgYWRkICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmV0dXJuIHRoZSByZXN1bHRpbmcgc2VyaWFsaXphdGlvblxuXHRyZXR1cm4gcy5qb2luKCBcIiZcIiApLnJlcGxhY2UoIHIyMCwgXCIrXCIgKTtcbn07XG5cbmpRdWVyeS5mbi5leHRlbmQoIHtcblx0c2VyaWFsaXplOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4galF1ZXJ5LnBhcmFtKCB0aGlzLnNlcmlhbGl6ZUFycmF5KCkgKTtcblx0fSxcblx0c2VyaWFsaXplQXJyYXk6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcCggZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIENhbiBhZGQgcHJvcEhvb2sgZm9yIFwiZWxlbWVudHNcIiB0byBmaWx0ZXIgb3IgYWRkIGZvcm0gZWxlbWVudHNcblx0XHRcdHZhciBlbGVtZW50cyA9IGpRdWVyeS5wcm9wKCB0aGlzLCBcImVsZW1lbnRzXCIgKTtcblx0XHRcdHJldHVybiBlbGVtZW50cyA/IGpRdWVyeS5tYWtlQXJyYXkoIGVsZW1lbnRzICkgOiB0aGlzO1xuXHRcdH0gKVxuXHRcdC5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHR5cGUgPSB0aGlzLnR5cGU7XG5cblx0XHRcdC8vIFVzZSAuaXMoIFwiOmRpc2FibGVkXCIgKSBzbyB0aGF0IGZpZWxkc2V0W2Rpc2FibGVkXSB3b3Jrc1xuXHRcdFx0cmV0dXJuIHRoaXMubmFtZSAmJiAhalF1ZXJ5KCB0aGlzICkuaXMoIFwiOmRpc2FibGVkXCIgKSAmJlxuXHRcdFx0XHRyc3VibWl0dGFibGUudGVzdCggdGhpcy5ub2RlTmFtZSApICYmICFyc3VibWl0dGVyVHlwZXMudGVzdCggdHlwZSApICYmXG5cdFx0XHRcdCggdGhpcy5jaGVja2VkIHx8ICFyY2hlY2thYmxlVHlwZS50ZXN0KCB0eXBlICkgKTtcblx0XHR9IClcblx0XHQubWFwKCBmdW5jdGlvbiggaSwgZWxlbSApIHtcblx0XHRcdHZhciB2YWwgPSBqUXVlcnkoIHRoaXMgKS52YWwoKTtcblxuXHRcdFx0cmV0dXJuIHZhbCA9PSBudWxsID9cblx0XHRcdFx0bnVsbCA6XG5cdFx0XHRcdGpRdWVyeS5pc0FycmF5KCB2YWwgKSA/XG5cdFx0XHRcdFx0alF1ZXJ5Lm1hcCggdmFsLCBmdW5jdGlvbiggdmFsICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHsgbmFtZTogZWxlbS5uYW1lLCB2YWx1ZTogdmFsLnJlcGxhY2UoIHJDUkxGLCBcIlxcclxcblwiICkgfTtcblx0XHRcdFx0XHR9ICkgOlxuXHRcdFx0XHRcdHsgbmFtZTogZWxlbS5uYW1lLCB2YWx1ZTogdmFsLnJlcGxhY2UoIHJDUkxGLCBcIlxcclxcblwiICkgfTtcblx0XHR9ICkuZ2V0KCk7XG5cdH1cbn0gKTtcblxucmV0dXJuIGpRdWVyeTtcbn0gKTtcbiJdfQ==