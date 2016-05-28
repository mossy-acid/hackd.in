"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(["./core", "./core/access", "./data/var/dataPriv", "./data/var/dataUser"], function (jQuery, access, dataPriv, dataUser) {

	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	    rmultiDash = /[A-Z]/g;

	function dataAttr(elem, key, data) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if (data === undefined && elem.nodeType === 1) {
			name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
			data = elem.getAttribute(name);

			if (typeof data === "string") {
				try {
					data = data === "true" ? true : data === "false" ? false : data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
				} catch (e) {}

				// Make sure we set the data so it isn't changed later
				dataUser.set(elem, key, data);
			} else {
				data = undefined;
			}
		}
		return data;
	}

	jQuery.extend({
		hasData: function hasData(elem) {
			return dataUser.hasData(elem) || dataPriv.hasData(elem);
		},

		data: function data(elem, name, _data) {
			return dataUser.access(elem, name, _data);
		},

		removeData: function removeData(elem, name) {
			dataUser.remove(elem, name);
		},

		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function _data(elem, name, data) {
			return dataPriv.access(elem, name, data);
		},

		_removeData: function _removeData(elem, name) {
			dataPriv.remove(elem, name);
		}
	});

	jQuery.fn.extend({
		data: function data(key, value) {
			var i,
			    name,
			    data,
			    elem = this[0],
			    attrs = elem && elem.attributes;

			// Gets all values
			if (key === undefined) {
				if (this.length) {
					data = dataUser.get(elem);

					if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
						i = attrs.length;
						while (i--) {

							// Support: IE11+
							// The attrs elements can be null (#14894)
							if (attrs[i]) {
								name = attrs[i].name;
								if (name.indexOf("data-") === 0) {
									name = jQuery.camelCase(name.slice(5));
									dataAttr(elem, name, data[name]);
								}
							}
						}
						dataPriv.set(elem, "hasDataAttrs", true);
					}
				}

				return data;
			}

			// Sets multiple values
			if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === "object") {
				return this.each(function () {
					dataUser.set(this, key);
				});
			}

			return access(this, function (value) {
				var data, camelKey;

				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if (elem && value === undefined) {

					// Attempt to get data from the cache
					// with the key as-is
					data = dataUser.get(elem, key) ||

					// Try to find dashed key if it exists (gh-2779)
					// This is for 2.2.x only
					dataUser.get(elem, key.replace(rmultiDash, "-$&").toLowerCase());

					if (data !== undefined) {
						return data;
					}

					camelKey = jQuery.camelCase(key);

					// Attempt to get data from the cache
					// with the key camelized
					data = dataUser.get(elem, camelKey);
					if (data !== undefined) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr(elem, camelKey, undefined);
					if (data !== undefined) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				camelKey = jQuery.camelCase(key);
				this.each(function () {

					// First, attempt to store a copy or reference of any
					// data that might've been store with a camelCased key.
					var data = dataUser.get(this, camelKey);

					// For HTML5 data-* attribute interop, we have to
					// store property names with dashes in a camelCase form.
					// This might not apply to all properties...*
					dataUser.set(this, camelKey, value);

					// *... In the case of properties that might _actually_
					// have dashes, we need to also store a copy of that
					// unchanged property.
					if (key.indexOf("-") > -1 && data !== undefined) {
						dataUser.set(this, key, value);
					}
				});
			}, null, value, arguments.length > 1, null, true);
		},

		removeData: function removeData(key) {
			return this.each(function () {
				dataUser.remove(this, key);
			});
		}
	});

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9kYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFRLENBQ1AsUUFETyxFQUVQLGVBRk8sRUFHUCxxQkFITyxFQUlQLHFCQUpPLENBQVIsRUFLRyxVQUFVLE1BQVYsRUFBa0IsTUFBbEIsRUFBMEIsUUFBMUIsRUFBb0MsUUFBcEMsRUFBK0M7Ozs7Ozs7Ozs7OztBQVlsRCxLQUFJLFNBQVMsK0JBQVQ7S0FDSCxhQUFhLFFBQWIsQ0FiaUQ7O0FBZWxELFVBQVMsUUFBVCxDQUFtQixJQUFuQixFQUF5QixHQUF6QixFQUE4QixJQUE5QixFQUFxQztBQUNwQyxNQUFJLElBQUo7Ozs7QUFEb0MsTUFLL0IsU0FBUyxTQUFULElBQXNCLEtBQUssUUFBTCxLQUFrQixDQUFsQixFQUFzQjtBQUNoRCxVQUFPLFVBQVUsSUFBSSxPQUFKLENBQWEsVUFBYixFQUF5QixLQUF6QixFQUFpQyxXQUFqQyxFQUFWLENBRHlDO0FBRWhELFVBQU8sS0FBSyxZQUFMLENBQW1CLElBQW5CLENBQVAsQ0FGZ0Q7O0FBSWhELE9BQUssT0FBTyxJQUFQLEtBQWdCLFFBQWhCLEVBQTJCO0FBQy9CLFFBQUk7QUFDSCxZQUFPLFNBQVMsTUFBVCxHQUFrQixJQUFsQixHQUNOLFNBQVMsT0FBVCxHQUFtQixLQUFuQixHQUNBLFNBQVMsTUFBVCxHQUFrQixJQUFsQjs7O0FBR0EsTUFBQyxJQUFELEdBQVEsRUFBUixLQUFlLElBQWYsR0FBc0IsQ0FBQyxJQUFELEdBQ3RCLE9BQU8sSUFBUCxDQUFhLElBQWIsSUFBc0IsT0FBTyxTQUFQLENBQWtCLElBQWxCLENBQXRCLEdBQ0EsSUFEQSxDQVBFO0tBQUosQ0FTRSxPQUFRLENBQVIsRUFBWSxFQUFaOzs7QUFWNkIsWUFhL0IsQ0FBUyxHQUFULENBQWMsSUFBZCxFQUFvQixHQUFwQixFQUF5QixJQUF6QixFQWIrQjtJQUFoQyxNQWNPO0FBQ04sV0FBTyxTQUFQLENB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O0FBb0xsRCxRQUFPLE1BQVAsQ0FwTGtEO0NBQS9DLENBTEgiLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4vY29yZVwiLFxuXHRcIi4vY29yZS9hY2Nlc3NcIixcblx0XCIuL2RhdGEvdmFyL2RhdGFQcml2XCIsXG5cdFwiLi9kYXRhL3Zhci9kYXRhVXNlclwiXG5dLCBmdW5jdGlvbiggalF1ZXJ5LCBhY2Nlc3MsIGRhdGFQcml2LCBkYXRhVXNlciApIHtcblxuLy9cdEltcGxlbWVudGF0aW9uIFN1bW1hcnlcbi8vXG4vL1x0MS4gRW5mb3JjZSBBUEkgc3VyZmFjZSBhbmQgc2VtYW50aWMgY29tcGF0aWJpbGl0eSB3aXRoIDEuOS54IGJyYW5jaFxuLy9cdDIuIEltcHJvdmUgdGhlIG1vZHVsZSdzIG1haW50YWluYWJpbGl0eSBieSByZWR1Y2luZyB0aGUgc3RvcmFnZVxuLy9cdFx0cGF0aHMgdG8gYSBzaW5nbGUgbWVjaGFuaXNtLlxuLy9cdDMuIFVzZSB0aGUgc2FtZSBzaW5nbGUgbWVjaGFuaXNtIHRvIHN1cHBvcnQgXCJwcml2YXRlXCIgYW5kIFwidXNlclwiIGRhdGEuXG4vL1x0NC4gX05ldmVyXyBleHBvc2UgXCJwcml2YXRlXCIgZGF0YSB0byB1c2VyIGNvZGUgKFRPRE86IERyb3AgX2RhdGEsIF9yZW1vdmVEYXRhKVxuLy9cdDUuIEF2b2lkIGV4cG9zaW5nIGltcGxlbWVudGF0aW9uIGRldGFpbHMgb24gdXNlciBvYmplY3RzIChlZy4gZXhwYW5kbyBwcm9wZXJ0aWVzKVxuLy9cdDYuIFByb3ZpZGUgYSBjbGVhciBwYXRoIGZvciBpbXBsZW1lbnRhdGlvbiB1cGdyYWRlIHRvIFdlYWtNYXAgaW4gMjAxNFxuXG52YXIgcmJyYWNlID0gL14oPzpcXHtbXFx3XFxXXSpcXH18XFxbW1xcd1xcV10qXFxdKSQvLFxuXHRybXVsdGlEYXNoID0gL1tBLVpdL2c7XG5cbmZ1bmN0aW9uIGRhdGFBdHRyKCBlbGVtLCBrZXksIGRhdGEgKSB7XG5cdHZhciBuYW1lO1xuXG5cdC8vIElmIG5vdGhpbmcgd2FzIGZvdW5kIGludGVybmFsbHksIHRyeSB0byBmZXRjaCBhbnlcblx0Ly8gZGF0YSBmcm9tIHRoZSBIVE1MNSBkYXRhLSogYXR0cmlidXRlXG5cdGlmICggZGF0YSA9PT0gdW5kZWZpbmVkICYmIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0bmFtZSA9IFwiZGF0YS1cIiArIGtleS5yZXBsYWNlKCBybXVsdGlEYXNoLCBcIi0kJlwiICkudG9Mb3dlckNhc2UoKTtcblx0XHRkYXRhID0gZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUgKTtcblxuXHRcdGlmICggdHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRkYXRhID0gZGF0YSA9PT0gXCJ0cnVlXCIgPyB0cnVlIDpcblx0XHRcdFx0XHRkYXRhID09PSBcImZhbHNlXCIgPyBmYWxzZSA6XG5cdFx0XHRcdFx0ZGF0YSA9PT0gXCJudWxsXCIgPyBudWxsIDpcblxuXHRcdFx0XHRcdC8vIE9ubHkgY29udmVydCB0byBhIG51bWJlciBpZiBpdCBkb2Vzbid0IGNoYW5nZSB0aGUgc3RyaW5nXG5cdFx0XHRcdFx0K2RhdGEgKyBcIlwiID09PSBkYXRhID8gK2RhdGEgOlxuXHRcdFx0XHRcdHJicmFjZS50ZXN0KCBkYXRhICkgPyBqUXVlcnkucGFyc2VKU09OKCBkYXRhICkgOlxuXHRcdFx0XHRcdGRhdGE7XG5cdFx0XHR9IGNhdGNoICggZSApIHt9XG5cblx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSBzZXQgdGhlIGRhdGEgc28gaXQgaXNuJ3QgY2hhbmdlZCBsYXRlclxuXHRcdFx0ZGF0YVVzZXIuc2V0KCBlbGVtLCBrZXksIGRhdGEgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGF0YSA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGRhdGE7XG59XG5cbmpRdWVyeS5leHRlbmQoIHtcblx0aGFzRGF0YTogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIGRhdGFVc2VyLmhhc0RhdGEoIGVsZW0gKSB8fCBkYXRhUHJpdi5oYXNEYXRhKCBlbGVtICk7XG5cdH0sXG5cblx0ZGF0YTogZnVuY3Rpb24oIGVsZW0sIG5hbWUsIGRhdGEgKSB7XG5cdFx0cmV0dXJuIGRhdGFVc2VyLmFjY2VzcyggZWxlbSwgbmFtZSwgZGF0YSApO1xuXHR9LFxuXG5cdHJlbW92ZURhdGE6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXHRcdGRhdGFVc2VyLnJlbW92ZSggZWxlbSwgbmFtZSApO1xuXHR9LFxuXG5cdC8vIFRPRE86IE5vdyB0aGF0IGFsbCBjYWxscyB0byBfZGF0YSBhbmQgX3JlbW92ZURhdGEgaGF2ZSBiZWVuIHJlcGxhY2VkXG5cdC8vIHdpdGggZGlyZWN0IGNhbGxzIHRvIGRhdGFQcml2IG1ldGhvZHMsIHRoZXNlIGNhbiBiZSBkZXByZWNhdGVkLlxuXHRfZGF0YTogZnVuY3Rpb24oIGVsZW0sIG5hbWUsIGRhdGEgKSB7XG5cdFx0cmV0dXJuIGRhdGFQcml2LmFjY2VzcyggZWxlbSwgbmFtZSwgZGF0YSApO1xuXHR9LFxuXG5cdF9yZW1vdmVEYXRhOiBmdW5jdGlvbiggZWxlbSwgbmFtZSApIHtcblx0XHRkYXRhUHJpdi5yZW1vdmUoIGVsZW0sIG5hbWUgKTtcblx0fVxufSApO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKCB7XG5cdGRhdGE6IGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xuXHRcdHZhciBpLCBuYW1lLCBkYXRhLFxuXHRcdFx0ZWxlbSA9IHRoaXNbIDAgXSxcblx0XHRcdGF0dHJzID0gZWxlbSAmJiBlbGVtLmF0dHJpYnV0ZXM7XG5cblx0XHQvLyBHZXRzIGFsbCB2YWx1ZXNcblx0XHRpZiAoIGtleSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0aWYgKCB0aGlzLmxlbmd0aCApIHtcblx0XHRcdFx0ZGF0YSA9IGRhdGFVc2VyLmdldCggZWxlbSApO1xuXG5cdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSAmJiAhZGF0YVByaXYuZ2V0KCBlbGVtLCBcImhhc0RhdGFBdHRyc1wiICkgKSB7XG5cdFx0XHRcdFx0aSA9IGF0dHJzLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUxMStcblx0XHRcdFx0XHRcdC8vIFRoZSBhdHRycyBlbGVtZW50cyBjYW4gYmUgbnVsbCAoIzE0ODk0KVxuXHRcdFx0XHRcdFx0aWYgKCBhdHRyc1sgaSBdICkge1xuXHRcdFx0XHRcdFx0XHRuYW1lID0gYXR0cnNbIGkgXS5uYW1lO1xuXHRcdFx0XHRcdFx0XHRpZiAoIG5hbWUuaW5kZXhPZiggXCJkYXRhLVwiICkgPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRcdFx0bmFtZSA9IGpRdWVyeS5jYW1lbENhc2UoIG5hbWUuc2xpY2UoIDUgKSApO1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFBdHRyKCBlbGVtLCBuYW1lLCBkYXRhWyBuYW1lIF0gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRkYXRhUHJpdi5zZXQoIGVsZW0sIFwiaGFzRGF0YUF0dHJzXCIsIHRydWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZGF0YTtcblx0XHR9XG5cblx0XHQvLyBTZXRzIG11bHRpcGxlIHZhbHVlc1xuXHRcdGlmICggdHlwZW9mIGtleSA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRkYXRhVXNlci5zZXQoIHRoaXMsIGtleSApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdHJldHVybiBhY2Nlc3MoIHRoaXMsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHRcdHZhciBkYXRhLCBjYW1lbEtleTtcblxuXHRcdFx0Ly8gVGhlIGNhbGxpbmcgalF1ZXJ5IG9iamVjdCAoZWxlbWVudCBtYXRjaGVzKSBpcyBub3QgZW1wdHlcblx0XHRcdC8vIChhbmQgdGhlcmVmb3JlIGhhcyBhbiBlbGVtZW50IGFwcGVhcnMgYXQgdGhpc1sgMCBdKSBhbmQgdGhlXG5cdFx0XHQvLyBgdmFsdWVgIHBhcmFtZXRlciB3YXMgbm90IHVuZGVmaW5lZC4gQW4gZW1wdHkgalF1ZXJ5IG9iamVjdFxuXHRcdFx0Ly8gd2lsbCByZXN1bHQgaW4gYHVuZGVmaW5lZGAgZm9yIGVsZW0gPSB0aGlzWyAwIF0gd2hpY2ggd2lsbFxuXHRcdFx0Ly8gdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFuIGF0dGVtcHQgdG8gcmVhZCBhIGRhdGEgY2FjaGUgaXMgbWFkZS5cblx0XHRcdGlmICggZWxlbSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRcdC8vIEF0dGVtcHQgdG8gZ2V0IGRhdGEgZnJvbSB0aGUgY2FjaGVcblx0XHRcdFx0Ly8gd2l0aCB0aGUga2V5IGFzLWlzXG5cdFx0XHRcdGRhdGEgPSBkYXRhVXNlci5nZXQoIGVsZW0sIGtleSApIHx8XG5cblx0XHRcdFx0XHQvLyBUcnkgdG8gZmluZCBkYXNoZWQga2V5IGlmIGl0IGV4aXN0cyAoZ2gtMjc3OSlcblx0XHRcdFx0XHQvLyBUaGlzIGlzIGZvciAyLjIueCBvbmx5XG5cdFx0XHRcdFx0ZGF0YVVzZXIuZ2V0KCBlbGVtLCBrZXkucmVwbGFjZSggcm11bHRpRGFzaCwgXCItJCZcIiApLnRvTG93ZXJDYXNlKCkgKTtcblxuXHRcdFx0XHRpZiAoIGRhdGEgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNhbWVsS2V5ID0galF1ZXJ5LmNhbWVsQ2FzZSgga2V5ICk7XG5cblx0XHRcdFx0Ly8gQXR0ZW1wdCB0byBnZXQgZGF0YSBmcm9tIHRoZSBjYWNoZVxuXHRcdFx0XHQvLyB3aXRoIHRoZSBrZXkgY2FtZWxpemVkXG5cdFx0XHRcdGRhdGEgPSBkYXRhVXNlci5nZXQoIGVsZW0sIGNhbWVsS2V5ICk7XG5cdFx0XHRcdGlmICggZGF0YSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQXR0ZW1wdCB0byBcImRpc2NvdmVyXCIgdGhlIGRhdGEgaW5cblx0XHRcdFx0Ly8gSFRNTDUgY3VzdG9tIGRhdGEtKiBhdHRyc1xuXHRcdFx0XHRkYXRhID0gZGF0YUF0dHIoIGVsZW0sIGNhbWVsS2V5LCB1bmRlZmluZWQgKTtcblx0XHRcdFx0aWYgKCBkYXRhICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBXZSB0cmllZCByZWFsbHkgaGFyZCwgYnV0IHRoZSBkYXRhIGRvZXNuJ3QgZXhpc3QuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU2V0IHRoZSBkYXRhLi4uXG5cdFx0XHRjYW1lbEtleSA9IGpRdWVyeS5jYW1lbENhc2UoIGtleSApO1xuXHRcdFx0dGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHQvLyBGaXJzdCwgYXR0ZW1wdCB0byBzdG9yZSBhIGNvcHkgb3IgcmVmZXJlbmNlIG9mIGFueVxuXHRcdFx0XHQvLyBkYXRhIHRoYXQgbWlnaHQndmUgYmVlbiBzdG9yZSB3aXRoIGEgY2FtZWxDYXNlZCBrZXkuXG5cdFx0XHRcdHZhciBkYXRhID0gZGF0YVVzZXIuZ2V0KCB0aGlzLCBjYW1lbEtleSApO1xuXG5cdFx0XHRcdC8vIEZvciBIVE1MNSBkYXRhLSogYXR0cmlidXRlIGludGVyb3AsIHdlIGhhdmUgdG9cblx0XHRcdFx0Ly8gc3RvcmUgcHJvcGVydHkgbmFtZXMgd2l0aCBkYXNoZXMgaW4gYSBjYW1lbENhc2UgZm9ybS5cblx0XHRcdFx0Ly8gVGhpcyBtaWdodCBub3QgYXBwbHkgdG8gYWxsIHByb3BlcnRpZXMuLi4qXG5cdFx0XHRcdGRhdGFVc2VyLnNldCggdGhpcywgY2FtZWxLZXksIHZhbHVlICk7XG5cblx0XHRcdFx0Ly8gKi4uLiBJbiB0aGUgY2FzZSBvZiBwcm9wZXJ0aWVzIHRoYXQgbWlnaHQgX2FjdHVhbGx5X1xuXHRcdFx0XHQvLyBoYXZlIGRhc2hlcywgd2UgbmVlZCB0byBhbHNvIHN0b3JlIGEgY29weSBvZiB0aGF0XG5cdFx0XHRcdC8vIHVuY2hhbmdlZCBwcm9wZXJ0eS5cblx0XHRcdFx0aWYgKCBrZXkuaW5kZXhPZiggXCItXCIgKSA+IC0xICYmIGRhdGEgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHRkYXRhVXNlci5zZXQoIHRoaXMsIGtleSwgdmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sIG51bGwsIHZhbHVlLCBhcmd1bWVudHMubGVuZ3RoID4gMSwgbnVsbCwgdHJ1ZSApO1xuXHR9LFxuXG5cdHJlbW92ZURhdGE6IGZ1bmN0aW9uKCBrZXkgKSB7XG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRkYXRhVXNlci5yZW1vdmUoIHRoaXMsIGtleSApO1xuXHRcdH0gKTtcblx0fVxufSApO1xuXG5yZXR1cm4galF1ZXJ5O1xufSApO1xuIl19