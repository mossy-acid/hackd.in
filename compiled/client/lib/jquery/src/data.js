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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9kYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFRLENBQ1AsUUFETyxFQUVQLGVBRk8sRUFHUCxxQkFITyxFQUlQLHFCQUpPLENBQVIsRUFLRyxVQUFVLE1BQVYsRUFBa0IsTUFBbEIsRUFBMEIsUUFBMUIsRUFBb0MsUUFBcEMsRUFBK0M7Ozs7Ozs7Ozs7OztBQVlsRCxLQUFJLFNBQVMsK0JBQWI7S0FDQyxhQUFhLFFBRGQ7O0FBR0EsVUFBUyxRQUFULENBQW1CLElBQW5CLEVBQXlCLEdBQXpCLEVBQThCLElBQTlCLEVBQXFDO0FBQ3BDLE1BQUksSUFBSjs7OztBQUlBLE1BQUssU0FBUyxTQUFULElBQXNCLEtBQUssUUFBTCxLQUFrQixDQUE3QyxFQUFpRDtBQUNoRCxVQUFPLFVBQVUsSUFBSSxPQUFKLENBQWEsVUFBYixFQUF5QixLQUF6QixFQUFpQyxXQUFqQyxFQUFqQjtBQUNBLFVBQU8sS0FBSyxZQUFMLENBQW1CLElBQW5CLENBQVA7O0FBRUEsT0FBSyxPQUFPLElBQVAsS0FBZ0IsUUFBckIsRUFBZ0M7QUFDL0IsUUFBSTtBQUNILFlBQU8sU0FBUyxNQUFULEdBQWtCLElBQWxCLEdBQ04sU0FBUyxPQUFULEdBQW1CLEtBQW5CLEdBQ0EsU0FBUyxNQUFULEdBQWtCLElBQWxCOzs7QUFHQSxNQUFDLElBQUQsR0FBUSxFQUFSLEtBQWUsSUFBZixHQUFzQixDQUFDLElBQXZCLEdBQ0EsT0FBTyxJQUFQLENBQWEsSUFBYixJQUFzQixPQUFPLFNBQVAsQ0FBa0IsSUFBbEIsQ0FBdEIsR0FDQSxJQVBEO0FBUUEsS0FURCxDQVNFLE9BQVEsQ0FBUixFQUFZLENBQUU7OztBQUdoQixhQUFTLEdBQVQsQ0FBYyxJQUFkLEVBQW9CLEdBQXBCLEVBQXlCLElBQXpCO0FBQ0EsSUFkRCxNQWNPO0FBQ04sV0FBTyxTQUFQO0FBQ0E7QUFDRDtBQUNELFNBQU8sSUFBUDtBQUNB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QUFDekIsYUFBTyxJQUFQO0FBQ0E7Ozs7QUFJRCxZQUFPLFNBQVUsSUFBVixFQUFnQixRQUFoQixFQUEwQixTQUExQixDQUFQO0FBQ0EsU0FBSyxTQUFTLFNBQWQsRUFBMEI7QUFDekIsYUFBTyxJQUFQO0FBQ0E7OztBQUdEO0FBQ0E7OztBQUdELGVBQVcsT0FBTyxTQUFQLENBQWtCLEdBQWxCLENBQVg7QUFDQSxTQUFLLElBQUwsQ0FBVyxZQUFXOzs7O0FBSXJCLFNBQUksT0FBTyxTQUFTLEdBQVQsQ0FBYyxJQUFkLEVBQW9CLFFBQXBCLENBQVg7Ozs7O0FBS0EsY0FBUyxHQUFULENBQWMsSUFBZCxFQUFvQixRQUFwQixFQUE4QixLQUE5Qjs7Ozs7QUFLQSxTQUFLLElBQUksT0FBSixDQUFhLEdBQWIsSUFBcUIsQ0FBQyxDQUF0QixJQUEyQixTQUFTLFNBQXpDLEVBQXFEO0FBQ3BELGVBQVMsR0FBVCxDQUFjLElBQWQsRUFBb0IsR0FBcEIsRUFBeUIsS0FBekI7QUFDQTtBQUNELEtBakJEO0FBa0JBLElBOURNLEVBOERKLElBOURJLEVBOERFLEtBOURGLEVBOERTLFVBQVUsTUFBVixHQUFtQixDQTlENUIsRUE4RCtCLElBOUQvQixFQThEcUMsSUE5RHJDLENBQVA7QUErREEsR0F0R2dCOztBQXdHakIsY0FBWSxvQkFBVSxHQUFWLEVBQWdCO0FBQzNCLFVBQU8sS0FBSyxJQUFMLENBQVcsWUFBVztBQUM1QixhQUFTLE1BQVQsQ0FBaUIsSUFBakIsRUFBdUIsR0FBdkI7QUFDQSxJQUZNLENBQVA7QUFHQTtBQTVHZ0IsRUFBbEI7O0FBK0dBLFFBQU8sTUFBUDtBQUNDLENBMUxEIiwiZmlsZSI6ImRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuL2NvcmVcIixcblx0XCIuL2NvcmUvYWNjZXNzXCIsXG5cdFwiLi9kYXRhL3Zhci9kYXRhUHJpdlwiLFxuXHRcIi4vZGF0YS92YXIvZGF0YVVzZXJcIlxuXSwgZnVuY3Rpb24oIGpRdWVyeSwgYWNjZXNzLCBkYXRhUHJpdiwgZGF0YVVzZXIgKSB7XG5cbi8vXHRJbXBsZW1lbnRhdGlvbiBTdW1tYXJ5XG4vL1xuLy9cdDEuIEVuZm9yY2UgQVBJIHN1cmZhY2UgYW5kIHNlbWFudGljIGNvbXBhdGliaWxpdHkgd2l0aCAxLjkueCBicmFuY2hcbi8vXHQyLiBJbXByb3ZlIHRoZSBtb2R1bGUncyBtYWludGFpbmFiaWxpdHkgYnkgcmVkdWNpbmcgdGhlIHN0b3JhZ2Vcbi8vXHRcdHBhdGhzIHRvIGEgc2luZ2xlIG1lY2hhbmlzbS5cbi8vXHQzLiBVc2UgdGhlIHNhbWUgc2luZ2xlIG1lY2hhbmlzbSB0byBzdXBwb3J0IFwicHJpdmF0ZVwiIGFuZCBcInVzZXJcIiBkYXRhLlxuLy9cdDQuIF9OZXZlcl8gZXhwb3NlIFwicHJpdmF0ZVwiIGRhdGEgdG8gdXNlciBjb2RlIChUT0RPOiBEcm9wIF9kYXRhLCBfcmVtb3ZlRGF0YSlcbi8vXHQ1LiBBdm9pZCBleHBvc2luZyBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIG9uIHVzZXIgb2JqZWN0cyAoZWcuIGV4cGFuZG8gcHJvcGVydGllcylcbi8vXHQ2LiBQcm92aWRlIGEgY2xlYXIgcGF0aCBmb3IgaW1wbGVtZW50YXRpb24gdXBncmFkZSB0byBXZWFrTWFwIGluIDIwMTRcblxudmFyIHJicmFjZSA9IC9eKD86XFx7W1xcd1xcV10qXFx9fFxcW1tcXHdcXFddKlxcXSkkLyxcblx0cm11bHRpRGFzaCA9IC9bQS1aXS9nO1xuXG5mdW5jdGlvbiBkYXRhQXR0ciggZWxlbSwga2V5LCBkYXRhICkge1xuXHR2YXIgbmFtZTtcblxuXHQvLyBJZiBub3RoaW5nIHdhcyBmb3VuZCBpbnRlcm5hbGx5LCB0cnkgdG8gZmV0Y2ggYW55XG5cdC8vIGRhdGEgZnJvbSB0aGUgSFRNTDUgZGF0YS0qIGF0dHJpYnV0ZVxuXHRpZiAoIGRhdGEgPT09IHVuZGVmaW5lZCAmJiBlbGVtLm5vZGVUeXBlID09PSAxICkge1xuXHRcdG5hbWUgPSBcImRhdGEtXCIgKyBrZXkucmVwbGFjZSggcm11bHRpRGFzaCwgXCItJCZcIiApLnRvTG93ZXJDYXNlKCk7XG5cdFx0ZGF0YSA9IGVsZW0uZ2V0QXR0cmlidXRlKCBuYW1lICk7XG5cblx0XHRpZiAoIHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0ZGF0YSA9IGRhdGEgPT09IFwidHJ1ZVwiID8gdHJ1ZSA6XG5cdFx0XHRcdFx0ZGF0YSA9PT0gXCJmYWxzZVwiID8gZmFsc2UgOlxuXHRcdFx0XHRcdGRhdGEgPT09IFwibnVsbFwiID8gbnVsbCA6XG5cblx0XHRcdFx0XHQvLyBPbmx5IGNvbnZlcnQgdG8gYSBudW1iZXIgaWYgaXQgZG9lc24ndCBjaGFuZ2UgdGhlIHN0cmluZ1xuXHRcdFx0XHRcdCtkYXRhICsgXCJcIiA9PT0gZGF0YSA/ICtkYXRhIDpcblx0XHRcdFx0XHRyYnJhY2UudGVzdCggZGF0YSApID8galF1ZXJ5LnBhcnNlSlNPTiggZGF0YSApIDpcblx0XHRcdFx0XHRkYXRhO1xuXHRcdFx0fSBjYXRjaCAoIGUgKSB7fVxuXG5cdFx0XHQvLyBNYWtlIHN1cmUgd2Ugc2V0IHRoZSBkYXRhIHNvIGl0IGlzbid0IGNoYW5nZWQgbGF0ZXJcblx0XHRcdGRhdGFVc2VyLnNldCggZWxlbSwga2V5LCBkYXRhICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRhdGEgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBkYXRhO1xufVxuXG5qUXVlcnkuZXh0ZW5kKCB7XG5cdGhhc0RhdGE6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHJldHVybiBkYXRhVXNlci5oYXNEYXRhKCBlbGVtICkgfHwgZGF0YVByaXYuaGFzRGF0YSggZWxlbSApO1xuXHR9LFxuXG5cdGRhdGE6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCBkYXRhICkge1xuXHRcdHJldHVybiBkYXRhVXNlci5hY2Nlc3MoIGVsZW0sIG5hbWUsIGRhdGEgKTtcblx0fSxcblxuXHRyZW1vdmVEYXRhOiBmdW5jdGlvbiggZWxlbSwgbmFtZSApIHtcblx0XHRkYXRhVXNlci5yZW1vdmUoIGVsZW0sIG5hbWUgKTtcblx0fSxcblxuXHQvLyBUT0RPOiBOb3cgdGhhdCBhbGwgY2FsbHMgdG8gX2RhdGEgYW5kIF9yZW1vdmVEYXRhIGhhdmUgYmVlbiByZXBsYWNlZFxuXHQvLyB3aXRoIGRpcmVjdCBjYWxscyB0byBkYXRhUHJpdiBtZXRob2RzLCB0aGVzZSBjYW4gYmUgZGVwcmVjYXRlZC5cblx0X2RhdGE6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCBkYXRhICkge1xuXHRcdHJldHVybiBkYXRhUHJpdi5hY2Nlc3MoIGVsZW0sIG5hbWUsIGRhdGEgKTtcblx0fSxcblxuXHRfcmVtb3ZlRGF0YTogZnVuY3Rpb24oIGVsZW0sIG5hbWUgKSB7XG5cdFx0ZGF0YVByaXYucmVtb3ZlKCBlbGVtLCBuYW1lICk7XG5cdH1cbn0gKTtcblxualF1ZXJ5LmZuLmV4dGVuZCgge1xuXHRkYXRhOiBmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcblx0XHR2YXIgaSwgbmFtZSwgZGF0YSxcblx0XHRcdGVsZW0gPSB0aGlzWyAwIF0sXG5cdFx0XHRhdHRycyA9IGVsZW0gJiYgZWxlbS5hdHRyaWJ1dGVzO1xuXG5cdFx0Ly8gR2V0cyBhbGwgdmFsdWVzXG5cdFx0aWYgKCBrZXkgPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdGlmICggdGhpcy5sZW5ndGggKSB7XG5cdFx0XHRcdGRhdGEgPSBkYXRhVXNlci5nZXQoIGVsZW0gKTtcblxuXHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgJiYgIWRhdGFQcml2LmdldCggZWxlbSwgXCJoYXNEYXRhQXR0cnNcIiApICkge1xuXHRcdFx0XHRcdGkgPSBhdHRycy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cblx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFMTErXG5cdFx0XHRcdFx0XHQvLyBUaGUgYXR0cnMgZWxlbWVudHMgY2FuIGJlIG51bGwgKCMxNDg5NClcblx0XHRcdFx0XHRcdGlmICggYXR0cnNbIGkgXSApIHtcblx0XHRcdFx0XHRcdFx0bmFtZSA9IGF0dHJzWyBpIF0ubmFtZTtcblx0XHRcdFx0XHRcdFx0aWYgKCBuYW1lLmluZGV4T2YoIFwiZGF0YS1cIiApID09PSAwICkge1xuXHRcdFx0XHRcdFx0XHRcdG5hbWUgPSBqUXVlcnkuY2FtZWxDYXNlKCBuYW1lLnNsaWNlKCA1ICkgKTtcblx0XHRcdFx0XHRcdFx0XHRkYXRhQXR0ciggZWxlbSwgbmFtZSwgZGF0YVsgbmFtZSBdICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZGF0YVByaXYuc2V0KCBlbGVtLCBcImhhc0RhdGFBdHRyc1wiLCB0cnVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0fVxuXG5cdFx0Ly8gU2V0cyBtdWx0aXBsZSB2YWx1ZXNcblx0XHRpZiAoIHR5cGVvZiBrZXkgPT09IFwib2JqZWN0XCIgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZGF0YVVzZXIuc2V0KCB0aGlzLCBrZXkgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYWNjZXNzKCB0aGlzLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0XHR2YXIgZGF0YSwgY2FtZWxLZXk7XG5cblx0XHRcdC8vIFRoZSBjYWxsaW5nIGpRdWVyeSBvYmplY3QgKGVsZW1lbnQgbWF0Y2hlcykgaXMgbm90IGVtcHR5XG5cdFx0XHQvLyAoYW5kIHRoZXJlZm9yZSBoYXMgYW4gZWxlbWVudCBhcHBlYXJzIGF0IHRoaXNbIDAgXSkgYW5kIHRoZVxuXHRcdFx0Ly8gYHZhbHVlYCBwYXJhbWV0ZXIgd2FzIG5vdCB1bmRlZmluZWQuIEFuIGVtcHR5IGpRdWVyeSBvYmplY3Rcblx0XHRcdC8vIHdpbGwgcmVzdWx0IGluIGB1bmRlZmluZWRgIGZvciBlbGVtID0gdGhpc1sgMCBdIHdoaWNoIHdpbGxcblx0XHRcdC8vIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhbiBhdHRlbXB0IHRvIHJlYWQgYSBkYXRhIGNhY2hlIGlzIG1hZGUuXG5cdFx0XHRpZiAoIGVsZW0gJiYgdmFsdWUgPT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHQvLyBBdHRlbXB0IHRvIGdldCBkYXRhIGZyb20gdGhlIGNhY2hlXG5cdFx0XHRcdC8vIHdpdGggdGhlIGtleSBhcy1pc1xuXHRcdFx0XHRkYXRhID0gZGF0YVVzZXIuZ2V0KCBlbGVtLCBrZXkgKSB8fFxuXG5cdFx0XHRcdFx0Ly8gVHJ5IHRvIGZpbmQgZGFzaGVkIGtleSBpZiBpdCBleGlzdHMgKGdoLTI3NzkpXG5cdFx0XHRcdFx0Ly8gVGhpcyBpcyBmb3IgMi4yLnggb25seVxuXHRcdFx0XHRcdGRhdGFVc2VyLmdldCggZWxlbSwga2V5LnJlcGxhY2UoIHJtdWx0aURhc2gsIFwiLSQmXCIgKS50b0xvd2VyQ2FzZSgpICk7XG5cblx0XHRcdFx0aWYgKCBkYXRhICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjYW1lbEtleSA9IGpRdWVyeS5jYW1lbENhc2UoIGtleSApO1xuXG5cdFx0XHRcdC8vIEF0dGVtcHQgdG8gZ2V0IGRhdGEgZnJvbSB0aGUgY2FjaGVcblx0XHRcdFx0Ly8gd2l0aCB0aGUga2V5IGNhbWVsaXplZFxuXHRcdFx0XHRkYXRhID0gZGF0YVVzZXIuZ2V0KCBlbGVtLCBjYW1lbEtleSApO1xuXHRcdFx0XHRpZiAoIGRhdGEgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEF0dGVtcHQgdG8gXCJkaXNjb3ZlclwiIHRoZSBkYXRhIGluXG5cdFx0XHRcdC8vIEhUTUw1IGN1c3RvbSBkYXRhLSogYXR0cnNcblx0XHRcdFx0ZGF0YSA9IGRhdGFBdHRyKCBlbGVtLCBjYW1lbEtleSwgdW5kZWZpbmVkICk7XG5cdFx0XHRcdGlmICggZGF0YSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gV2UgdHJpZWQgcmVhbGx5IGhhcmQsIGJ1dCB0aGUgZGF0YSBkb2Vzbid0IGV4aXN0LlxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNldCB0aGUgZGF0YS4uLlxuXHRcdFx0Y2FtZWxLZXkgPSBqUXVlcnkuY2FtZWxDYXNlKCBrZXkgKTtcblx0XHRcdHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0Ly8gRmlyc3QsIGF0dGVtcHQgdG8gc3RvcmUgYSBjb3B5IG9yIHJlZmVyZW5jZSBvZiBhbnlcblx0XHRcdFx0Ly8gZGF0YSB0aGF0IG1pZ2h0J3ZlIGJlZW4gc3RvcmUgd2l0aCBhIGNhbWVsQ2FzZWQga2V5LlxuXHRcdFx0XHR2YXIgZGF0YSA9IGRhdGFVc2VyLmdldCggdGhpcywgY2FtZWxLZXkgKTtcblxuXHRcdFx0XHQvLyBGb3IgSFRNTDUgZGF0YS0qIGF0dHJpYnV0ZSBpbnRlcm9wLCB3ZSBoYXZlIHRvXG5cdFx0XHRcdC8vIHN0b3JlIHByb3BlcnR5IG5hbWVzIHdpdGggZGFzaGVzIGluIGEgY2FtZWxDYXNlIGZvcm0uXG5cdFx0XHRcdC8vIFRoaXMgbWlnaHQgbm90IGFwcGx5IHRvIGFsbCBwcm9wZXJ0aWVzLi4uKlxuXHRcdFx0XHRkYXRhVXNlci5zZXQoIHRoaXMsIGNhbWVsS2V5LCB2YWx1ZSApO1xuXG5cdFx0XHRcdC8vICouLi4gSW4gdGhlIGNhc2Ugb2YgcHJvcGVydGllcyB0aGF0IG1pZ2h0IF9hY3R1YWxseV9cblx0XHRcdFx0Ly8gaGF2ZSBkYXNoZXMsIHdlIG5lZWQgdG8gYWxzbyBzdG9yZSBhIGNvcHkgb2YgdGhhdFxuXHRcdFx0XHQvLyB1bmNoYW5nZWQgcHJvcGVydHkuXG5cdFx0XHRcdGlmICgga2V5LmluZGV4T2YoIFwiLVwiICkgPiAtMSAmJiBkYXRhICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0ZGF0YVVzZXIuc2V0KCB0aGlzLCBrZXksIHZhbHVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LCBudWxsLCB2YWx1ZSwgYXJndW1lbnRzLmxlbmd0aCA+IDEsIG51bGwsIHRydWUgKTtcblx0fSxcblxuXHRyZW1vdmVEYXRhOiBmdW5jdGlvbigga2V5ICkge1xuXHRcdHJldHVybiB0aGlzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZGF0YVVzZXIucmVtb3ZlKCB0aGlzLCBrZXkgKTtcblx0XHR9ICk7XG5cdH1cbn0gKTtcblxucmV0dXJuIGpRdWVyeTtcbn0gKTtcbiJdfQ==