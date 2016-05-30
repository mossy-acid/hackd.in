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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9zZXJpYWxpemUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQVEsQ0FDUCxRQURPLEVBRVAsbUNBRk8sRUFHUCxhQUhPLEVBSVAsY0FKTyxFO0FBS1AsbUJBTE8sQ0FBUixFQU1HLFVBQVUsTUFBVixFQUFrQixjQUFsQixFQUFtQzs7QUFFdEMsS0FBSSxNQUFNLE1BQVY7S0FDQyxXQUFXLE9BRFo7S0FFQyxRQUFRLFFBRlQ7S0FHQyxrQkFBa0IsdUNBSG5CO0tBSUMsZUFBZSxvQ0FKaEI7O0FBTUEsVUFBUyxXQUFULENBQXNCLE1BQXRCLEVBQThCLEdBQTlCLEVBQW1DLFdBQW5DLEVBQWdELEdBQWhELEVBQXNEO0FBQ3JELE1BQUksSUFBSjs7QUFFQSxNQUFLLE9BQU8sT0FBUCxDQUFnQixHQUFoQixDQUFMLEVBQTZCOzs7QUFHNUIsVUFBTyxJQUFQLENBQWEsR0FBYixFQUFrQixVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWlCO0FBQ2xDLFFBQUssZUFBZSxTQUFTLElBQVQsQ0FBZSxNQUFmLENBQXBCLEVBQThDOzs7QUFHN0MsU0FBSyxNQUFMLEVBQWEsQ0FBYjtBQUVBLEtBTEQsTUFLTzs7O0FBR04saUJBQ0MsU0FBUyxHQUFULElBQWlCLFFBQU8sQ0FBUCx5Q0FBTyxDQUFQLE9BQWEsUUFBYixJQUF5QixLQUFLLElBQTlCLEdBQXFDLENBQXJDLEdBQXlDLEVBQTFELElBQWlFLEdBRGxFLEVBRUMsQ0FGRCxFQUdDLFdBSEQsRUFJQyxHQUpEO0FBTUE7QUFDRCxJQWhCRDtBQWtCQSxHQXJCRCxNQXFCTyxJQUFLLENBQUMsV0FBRCxJQUFnQixPQUFPLElBQVAsQ0FBYSxHQUFiLE1BQXVCLFFBQTVDLEVBQXVEOzs7QUFHN0QsUUFBTSxJQUFOLElBQWMsR0FBZCxFQUFvQjtBQUNuQixnQkFBYSxTQUFTLEdBQVQsR0FBZSxJQUFmLEdBQXNCLEdBQW5DLEVBQXdDLElBQUss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QkE7QUE5QmdCLEVBQWxCOztBQWlDQSxRQUFPLE1BQVA7QUFDQyxDQTVIRCIsImZpbGUiOiJzZXJpYWxpemUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuL2NvcmVcIixcblx0XCIuL21hbmlwdWxhdGlvbi92YXIvcmNoZWNrYWJsZVR5cGVcIixcblx0XCIuL2NvcmUvaW5pdFwiLFxuXHRcIi4vdHJhdmVyc2luZ1wiLCAvLyBmaWx0ZXJcblx0XCIuL2F0dHJpYnV0ZXMvcHJvcFwiXG5dLCBmdW5jdGlvbiggalF1ZXJ5LCByY2hlY2thYmxlVHlwZSApIHtcblxudmFyIHIyMCA9IC8lMjAvZyxcblx0cmJyYWNrZXQgPSAvXFxbXFxdJC8sXG5cdHJDUkxGID0gL1xccj9cXG4vZyxcblx0cnN1Ym1pdHRlclR5cGVzID0gL14oPzpzdWJtaXR8YnV0dG9ufGltYWdlfHJlc2V0fGZpbGUpJC9pLFxuXHRyc3VibWl0dGFibGUgPSAvXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxrZXlnZW4pL2k7XG5cbmZ1bmN0aW9uIGJ1aWxkUGFyYW1zKCBwcmVmaXgsIG9iaiwgdHJhZGl0aW9uYWwsIGFkZCApIHtcblx0dmFyIG5hbWU7XG5cblx0aWYgKCBqUXVlcnkuaXNBcnJheSggb2JqICkgKSB7XG5cblx0XHQvLyBTZXJpYWxpemUgYXJyYXkgaXRlbS5cblx0XHRqUXVlcnkuZWFjaCggb2JqLCBmdW5jdGlvbiggaSwgdiApIHtcblx0XHRcdGlmICggdHJhZGl0aW9uYWwgfHwgcmJyYWNrZXQudGVzdCggcHJlZml4ICkgKSB7XG5cblx0XHRcdFx0Ly8gVHJlYXQgZWFjaCBhcnJheSBpdGVtIGFzIGEgc2NhbGFyLlxuXHRcdFx0XHRhZGQoIHByZWZpeCwgdiApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIEl0ZW0gaXMgbm9uLXNjYWxhciAoYXJyYXkgb3Igb2JqZWN0KSwgZW5jb2RlIGl0cyBudW1lcmljIGluZGV4LlxuXHRcdFx0XHRidWlsZFBhcmFtcyhcblx0XHRcdFx0XHRwcmVmaXggKyBcIltcIiArICggdHlwZW9mIHYgPT09IFwib2JqZWN0XCIgJiYgdiAhPSBudWxsID8gaSA6IFwiXCIgKSArIFwiXVwiLFxuXHRcdFx0XHRcdHYsXG5cdFx0XHRcdFx0dHJhZGl0aW9uYWwsXG5cdFx0XHRcdFx0YWRkXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdH0gZWxzZSBpZiAoICF0cmFkaXRpb25hbCAmJiBqUXVlcnkudHlwZSggb2JqICkgPT09IFwib2JqZWN0XCIgKSB7XG5cblx0XHQvLyBTZXJpYWxpemUgb2JqZWN0IGl0ZW0uXG5cdFx0Zm9yICggbmFtZSBpbiBvYmogKSB7XG5cdFx0XHRidWlsZFBhcmFtcyggcHJlZml4ICsgXCJbXCIgKyBuYW1lICsgXCJdXCIsIG9ialsgbmFtZSBdLCB0cmFkaXRpb25hbCwgYWRkICk7XG5cdFx0fVxuXG5cdH0gZWxzZSB7XG5cblx0XHQvLyBTZXJpYWxpemUgc2NhbGFyIGl0ZW0uXG5cdFx0YWRkKCBwcmVmaXgsIG9iaiApO1xuXHR9XG59XG5cbi8vIFNlcmlhbGl6ZSBhbiBhcnJheSBvZiBmb3JtIGVsZW1lbnRzIG9yIGEgc2V0IG9mXG4vLyBrZXkvdmFsdWVzIGludG8gYSBxdWVyeSBzdHJpbmdcbmpRdWVyeS5wYXJhbSA9IGZ1bmN0aW9uKCBhLCB0cmFkaXRpb25hbCApIHtcblx0dmFyIHByZWZpeCxcblx0XHRzID0gW10sXG5cdFx0YWRkID0gZnVuY3Rpb24oIGtleSwgdmFsdWUgKSB7XG5cblx0XHRcdC8vIElmIHZhbHVlIGlzIGEgZnVuY3Rpb24sIGludm9rZSBpdCBhbmQgcmV0dXJuIGl0cyB2YWx1ZVxuXHRcdFx0dmFsdWUgPSBqUXVlcnkuaXNGdW5jdGlvbiggdmFsdWUgKSA/IHZhbHVlKCkgOiAoIHZhbHVlID09IG51bGwgPyBcIlwiIDogdmFsdWUgKTtcblx0XHRcdHNbIHMubGVuZ3RoIF0gPSBlbmNvZGVVUklDb21wb25lbnQoIGtleSApICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoIHZhbHVlICk7XG5cdFx0fTtcblxuXHQvLyBTZXQgdHJhZGl0aW9uYWwgdG8gdHJ1ZSBmb3IgalF1ZXJ5IDw9IDEuMy4yIGJlaGF2aW9yLlxuXHRpZiAoIHRyYWRpdGlvbmFsID09PSB1bmRlZmluZWQgKSB7XG5cdFx0dHJhZGl0aW9uYWwgPSBqUXVlcnkuYWpheFNldHRpbmdzICYmIGpRdWVyeS5hamF4U2V0dGluZ3MudHJhZGl0aW9uYWw7XG5cdH1cblxuXHQvLyBJZiBhbiBhcnJheSB3YXMgcGFzc2VkIGluLCBhc3N1bWUgdGhhdCBpdCBpcyBhbiBhcnJheSBvZiBmb3JtIGVsZW1lbnRzLlxuXHRpZiAoIGpRdWVyeS5pc0FycmF5KCBhICkgfHwgKCBhLmpxdWVyeSAmJiAhalF1ZXJ5LmlzUGxhaW5PYmplY3QoIGEgKSApICkge1xuXG5cdFx0Ly8gU2VyaWFsaXplIHRoZSBmb3JtIGVsZW1lbnRzXG5cdFx0alF1ZXJ5LmVhY2goIGEsIGZ1bmN0aW9uKCkge1xuXHRcdFx0YWRkKCB0aGlzLm5hbWUsIHRoaXMudmFsdWUgKTtcblx0XHR9ICk7XG5cblx0fSBlbHNlIHtcblxuXHRcdC8vIElmIHRyYWRpdGlvbmFsLCBlbmNvZGUgdGhlIFwib2xkXCIgd2F5ICh0aGUgd2F5IDEuMy4yIG9yIG9sZGVyXG5cdFx0Ly8gZGlkIGl0KSwgb3RoZXJ3aXNlIGVuY29kZSBwYXJhbXMgcmVjdXJzaXZlbHkuXG5cdFx0Zm9yICggcHJlZml4IGluIGEgKSB7XG5cdFx0XHRidWlsZFBhcmFtcyggcHJlZml4LCBhWyBwcmVmaXggXSwgdHJhZGl0aW9uYWwsIGFkZCApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgcmVzdWx0aW5nIHNlcmlhbGl6YXRpb25cblx0cmV0dXJuIHMuam9pbiggXCImXCIgKS5yZXBsYWNlKCByMjAsIFwiK1wiICk7XG59O1xuXG5qUXVlcnkuZm4uZXh0ZW5kKCB7XG5cdHNlcmlhbGl6ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5wYXJhbSggdGhpcy5zZXJpYWxpemVBcnJheSgpICk7XG5cdH0sXG5cdHNlcmlhbGl6ZUFycmF5OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBDYW4gYWRkIHByb3BIb29rIGZvciBcImVsZW1lbnRzXCIgdG8gZmlsdGVyIG9yIGFkZCBmb3JtIGVsZW1lbnRzXG5cdFx0XHR2YXIgZWxlbWVudHMgPSBqUXVlcnkucHJvcCggdGhpcywgXCJlbGVtZW50c1wiICk7XG5cdFx0XHRyZXR1cm4gZWxlbWVudHMgPyBqUXVlcnkubWFrZUFycmF5KCBlbGVtZW50cyApIDogdGhpcztcblx0XHR9IClcblx0XHQuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0eXBlID0gdGhpcy50eXBlO1xuXG5cdFx0XHQvLyBVc2UgLmlzKCBcIjpkaXNhYmxlZFwiICkgc28gdGhhdCBmaWVsZHNldFtkaXNhYmxlZF0gd29ya3Ncblx0XHRcdHJldHVybiB0aGlzLm5hbWUgJiYgIWpRdWVyeSggdGhpcyApLmlzKCBcIjpkaXNhYmxlZFwiICkgJiZcblx0XHRcdFx0cnN1Ym1pdHRhYmxlLnRlc3QoIHRoaXMubm9kZU5hbWUgKSAmJiAhcnN1Ym1pdHRlclR5cGVzLnRlc3QoIHR5cGUgKSAmJlxuXHRcdFx0XHQoIHRoaXMuY2hlY2tlZCB8fCAhcmNoZWNrYWJsZVR5cGUudGVzdCggdHlwZSApICk7XG5cdFx0fSApXG5cdFx0Lm1hcCggZnVuY3Rpb24oIGksIGVsZW0gKSB7XG5cdFx0XHR2YXIgdmFsID0galF1ZXJ5KCB0aGlzICkudmFsKCk7XG5cblx0XHRcdHJldHVybiB2YWwgPT0gbnVsbCA/XG5cdFx0XHRcdG51bGwgOlxuXHRcdFx0XHRqUXVlcnkuaXNBcnJheSggdmFsICkgP1xuXHRcdFx0XHRcdGpRdWVyeS5tYXAoIHZhbCwgZnVuY3Rpb24oIHZhbCApIHtcblx0XHRcdFx0XHRcdHJldHVybiB7IG5hbWU6IGVsZW0ubmFtZSwgdmFsdWU6IHZhbC5yZXBsYWNlKCByQ1JMRiwgXCJcXHJcXG5cIiApIH07XG5cdFx0XHRcdFx0fSApIDpcblx0XHRcdFx0XHR7IG5hbWU6IGVsZW0ubmFtZSwgdmFsdWU6IHZhbC5yZXBsYWNlKCByQ1JMRiwgXCJcXHJcXG5cIiApIH07XG5cdFx0fSApLmdldCgpO1xuXHR9XG59ICk7XG5cbnJldHVybiBqUXVlcnk7XG59ICk7XG4iXX0=