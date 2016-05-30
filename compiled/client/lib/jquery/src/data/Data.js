"use strict";

define(["../core", "../var/rnotwhite", "./var/acceptData"], function (jQuery, rnotwhite, acceptData) {

	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;

	Data.prototype = {

		register: function register(owner, initial) {
			var value = initial || {};

			// If it is a node unlikely to be stringify-ed or looped over
			// use plain assignment
			if (owner.nodeType) {
				owner[this.expando] = value;

				// Otherwise secure it in a non-enumerable, non-writable property
				// configurability must be true to allow the property to be
				// deleted with the delete operator
			} else {
					Object.defineProperty(owner, this.expando, {
						value: value,
						writable: true,
						configurable: true
					});
				}
			return owner[this.expando];
		},
		cache: function cache(owner) {

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if (!acceptData(owner)) {
				return {};
			}

			// Check if the owner object already has a cache
			var value = owner[this.expando];

			// If not, create one
			if (!value) {
				value = {};

				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if (acceptData(owner)) {

					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if (owner.nodeType) {
						owner[this.expando] = value;

						// Otherwise secure it in a non-enumerable property
						// configurable must be true to allow the property to be
						// deleted when data is removed
					} else {
							Object.defineProperty(owner, this.expando, {
								value: value,
								configurable: true
							});
						}
				}
			}

			return value;
		},
		set: function set(owner, data, value) {
			var prop,
			    cache = this.cache(owner);

			// Handle: [ owner, key, value ] args
			if (typeof data === "string") {
				cache[data] = value;

				// Handle: [ owner, { properties } ] args
			} else {

					// Copy the properties one-by-one to the cache object
					for (prop in data) {
						cache[prop] = data[prop];
					}
				}
			return cache;
		},
		get: function get(owner, key) {
			return key === undefined ? this.cache(owner) : owner[this.expando] && owner[this.expando][key];
		},
		access: function access(owner, key, value) {
			var stored;

			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if (key === undefined || key && typeof key === "string" && value === undefined) {

				stored = this.get(owner, key);

				return stored !== undefined ? stored : this.get(owner, jQuery.camelCase(key));
			}

			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set(owner, key, value);

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function remove(owner, key) {
			var i,
			    name,
			    camel,
			    cache = owner[this.expando];

			if (cache === undefined) {
				return;
			}

			if (key === undefined) {
				this.register(owner);
			} else {

				// Support array or space separated string of keys
				if (jQuery.isArray(key)) {

					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat(key.map(jQuery.camelCase));
				} else {
					camel = jQuery.camelCase(key);

					// Try the string as a key before any manipulation
					if (key in cache) {
						name = [key, camel];
					} else {

						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						name = camel;
						name = name in cache ? [name] : name.match(rnotwhite) || [];
					}
				}

				i = name.length;

				while (i--) {
					delete cache[name[i]];
				}
			}

			// Remove the expando if there's no more data
			if (key === undefined || jQuery.isEmptyObject(cache)) {

				// Support: Chrome <= 35-45+
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://code.google.com/p/chromium/issues/detail?id=378607
				if (owner.nodeType) {
					owner[this.expando] = undefined;
				} else {
					delete owner[this.expando];
				}
			}
		},
		hasData: function hasData(owner) {
			var cache = owner[this.expando];
			return cache !== undefined && !jQuery.isEmptyObject(cache);
		}
	};

	return Data;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9kYXRhL0RhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1AsU0FETyxFQUVQLGtCQUZPLEVBR1Asa0JBSE8sQ0FBUixFQUlHLFVBQVUsTUFBVixFQUFrQixTQUFsQixFQUE2QixVQUE3QixFQUEwQzs7QUFFN0MsVUFBUyxJQUFULEdBQWdCO0FBQ2YsT0FBSyxPQUFMLEdBQWUsT0FBTyxPQUFQLEdBQWlCLEtBQUssR0FBTCxFQUFoQztBQUNBOztBQUVELE1BQUssR0FBTCxHQUFXLENBQVg7O0FBRUEsTUFBSyxTQUFMLEdBQWlCOztBQUVoQixZQUFVLGtCQUFVLEtBQVYsRUFBaUIsT0FBakIsRUFBMkI7QUFDcEMsT0FBSSxRQUFRLFdBQVcsRUFBdkI7Ozs7QUFJQSxPQUFLLE1BQU0sUUFBWCxFQUFzQjtBQUNyQixVQUFPLEtBQUssT0FBWixJQUF3QixLQUF4Qjs7Ozs7QUFLQSxJQU5ELE1BTU87QUFDTixZQUFPLGNBQVAsQ0FBdUIsS0FBdkIsRUFBOEIsS0FBSyxPQUFuQyxFQUE0QztBQUMzQyxhQUFPLEtBRG9DO0FBRTNDLGdCQUFVLElBRmlDO0FBRzNDLG9CQUFjO0FBSDZCLE1BQTVDO0FBS0E7QUFDRCxVQUFPLE1BQU8sS0FBSyxPQUFaLENBQVA7QUFDQSxHQXJCZTtBQXNCaEIsU0FBTyxlQUFVLEtBQVYsRUFBa0I7Ozs7O0FBS3hCLE9BQUssQ0FBQyxXQUFZLEtBQVosQ0FBTixFQUE0QjtBQUMzQixXQUFPLEVBQVA7QUFDQTs7O0FBR0QsT0FBSSxRQUFRLE1BQU8sS0FBSyxPQUFaLENBQVo7OztBQUdBLE9BQUssQ0FBQyxLQUFOLEVBQWM7QUFDYixZQUFRLEVBQVI7Ozs7O0FBS0EsUUFBSyxXQUFZLEtBQVosQ0FBTCxFQUEyQjs7OztBQUkxQixTQUFLLE1BQU0sUUFBWCxFQUFzQjtBQUNyQixZQUFPLEtBQUssT0FBWixJQUF3QixLQUF4Qjs7Ozs7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QUNBLEtBRkQsTUFFTztBQUNOLFlBQU8sTUFBTyxLQUFLLE9BQVosQ0FBUDtBQUNBO0FBQ0Q7QUFDRCxHQW5MZTtBQW9MaEIsV0FBUyxpQkFBVSxLQUFWLEVBQWtCO0FBQzFCLE9BQUksUUFBUSxNQUFPLEtBQUssT0FBWixDQUFaO0FBQ0EsVUFBTyxVQUFVLFNBQVYsSUFBdUIsQ0FBQyxPQUFPLGFBQVAsQ0FBc0IsS0FBdEIsQ0FBL0I7QUFDQTtBQXZMZSxFQUFqQjs7QUEwTEEsUUFBTyxJQUFQO0FBQ0MsQ0F2TUQiLCJmaWxlIjoiRGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4uL2NvcmVcIixcblx0XCIuLi92YXIvcm5vdHdoaXRlXCIsXG5cdFwiLi92YXIvYWNjZXB0RGF0YVwiXG5dLCBmdW5jdGlvbiggalF1ZXJ5LCBybm90d2hpdGUsIGFjY2VwdERhdGEgKSB7XG5cbmZ1bmN0aW9uIERhdGEoKSB7XG5cdHRoaXMuZXhwYW5kbyA9IGpRdWVyeS5leHBhbmRvICsgRGF0YS51aWQrKztcbn1cblxuRGF0YS51aWQgPSAxO1xuXG5EYXRhLnByb3RvdHlwZSA9IHtcblxuXHRyZWdpc3RlcjogZnVuY3Rpb24oIG93bmVyLCBpbml0aWFsICkge1xuXHRcdHZhciB2YWx1ZSA9IGluaXRpYWwgfHwge307XG5cblx0XHQvLyBJZiBpdCBpcyBhIG5vZGUgdW5saWtlbHkgdG8gYmUgc3RyaW5naWZ5LWVkIG9yIGxvb3BlZCBvdmVyXG5cdFx0Ly8gdXNlIHBsYWluIGFzc2lnbm1lbnRcblx0XHRpZiAoIG93bmVyLm5vZGVUeXBlICkge1xuXHRcdFx0b3duZXJbIHRoaXMuZXhwYW5kbyBdID0gdmFsdWU7XG5cblx0XHQvLyBPdGhlcndpc2Ugc2VjdXJlIGl0IGluIGEgbm9uLWVudW1lcmFibGUsIG5vbi13cml0YWJsZSBwcm9wZXJ0eVxuXHRcdC8vIGNvbmZpZ3VyYWJpbGl0eSBtdXN0IGJlIHRydWUgdG8gYWxsb3cgdGhlIHByb3BlcnR5IHRvIGJlXG5cdFx0Ly8gZGVsZXRlZCB3aXRoIHRoZSBkZWxldGUgb3BlcmF0b3Jcblx0XHR9IGVsc2Uge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBvd25lciwgdGhpcy5leHBhbmRvLCB7XG5cdFx0XHRcdHZhbHVlOiB2YWx1ZSxcblx0XHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdFx0fSApO1xuXHRcdH1cblx0XHRyZXR1cm4gb3duZXJbIHRoaXMuZXhwYW5kbyBdO1xuXHR9LFxuXHRjYWNoZTogZnVuY3Rpb24oIG93bmVyICkge1xuXG5cdFx0Ly8gV2UgY2FuIGFjY2VwdCBkYXRhIGZvciBub24tZWxlbWVudCBub2RlcyBpbiBtb2Rlcm4gYnJvd3NlcnMsXG5cdFx0Ly8gYnV0IHdlIHNob3VsZCBub3QsIHNlZSAjODMzNS5cblx0XHQvLyBBbHdheXMgcmV0dXJuIGFuIGVtcHR5IG9iamVjdC5cblx0XHRpZiAoICFhY2NlcHREYXRhKCBvd25lciApICkge1xuXHRcdFx0cmV0dXJuIHt9O1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIGlmIHRoZSBvd25lciBvYmplY3QgYWxyZWFkeSBoYXMgYSBjYWNoZVxuXHRcdHZhciB2YWx1ZSA9IG93bmVyWyB0aGlzLmV4cGFuZG8gXTtcblxuXHRcdC8vIElmIG5vdCwgY3JlYXRlIG9uZVxuXHRcdGlmICggIXZhbHVlICkge1xuXHRcdFx0dmFsdWUgPSB7fTtcblxuXHRcdFx0Ly8gV2UgY2FuIGFjY2VwdCBkYXRhIGZvciBub24tZWxlbWVudCBub2RlcyBpbiBtb2Rlcm4gYnJvd3NlcnMsXG5cdFx0XHQvLyBidXQgd2Ugc2hvdWxkIG5vdCwgc2VlICM4MzM1LlxuXHRcdFx0Ly8gQWx3YXlzIHJldHVybiBhbiBlbXB0eSBvYmplY3QuXG5cdFx0XHRpZiAoIGFjY2VwdERhdGEoIG93bmVyICkgKSB7XG5cblx0XHRcdFx0Ly8gSWYgaXQgaXMgYSBub2RlIHVubGlrZWx5IHRvIGJlIHN0cmluZ2lmeS1lZCBvciBsb29wZWQgb3ZlclxuXHRcdFx0XHQvLyB1c2UgcGxhaW4gYXNzaWdubWVudFxuXHRcdFx0XHRpZiAoIG93bmVyLm5vZGVUeXBlICkge1xuXHRcdFx0XHRcdG93bmVyWyB0aGlzLmV4cGFuZG8gXSA9IHZhbHVlO1xuXG5cdFx0XHRcdC8vIE90aGVyd2lzZSBzZWN1cmUgaXQgaW4gYSBub24tZW51bWVyYWJsZSBwcm9wZXJ0eVxuXHRcdFx0XHQvLyBjb25maWd1cmFibGUgbXVzdCBiZSB0cnVlIHRvIGFsbG93IHRoZSBwcm9wZXJ0eSB0byBiZVxuXHRcdFx0XHQvLyBkZWxldGVkIHdoZW4gZGF0YSBpcyByZW1vdmVkXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBvd25lciwgdGhpcy5leHBhbmRvLCB7XG5cdFx0XHRcdFx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0XHRcdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH0sXG5cdHNldDogZnVuY3Rpb24oIG93bmVyLCBkYXRhLCB2YWx1ZSApIHtcblx0XHR2YXIgcHJvcCxcblx0XHRcdGNhY2hlID0gdGhpcy5jYWNoZSggb3duZXIgKTtcblxuXHRcdC8vIEhhbmRsZTogWyBvd25lciwga2V5LCB2YWx1ZSBdIGFyZ3Ncblx0XHRpZiAoIHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0Y2FjaGVbIGRhdGEgXSA9IHZhbHVlO1xuXG5cdFx0Ly8gSGFuZGxlOiBbIG93bmVyLCB7IHByb3BlcnRpZXMgfSBdIGFyZ3Ncblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBDb3B5IHRoZSBwcm9wZXJ0aWVzIG9uZS1ieS1vbmUgdG8gdGhlIGNhY2hlIG9iamVjdFxuXHRcdFx0Zm9yICggcHJvcCBpbiBkYXRhICkge1xuXHRcdFx0XHRjYWNoZVsgcHJvcCBdID0gZGF0YVsgcHJvcCBdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gY2FjaGU7XG5cdH0sXG5cdGdldDogZnVuY3Rpb24oIG93bmVyLCBrZXkgKSB7XG5cdFx0cmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkID9cblx0XHRcdHRoaXMuY2FjaGUoIG93bmVyICkgOlxuXHRcdFx0b3duZXJbIHRoaXMuZXhwYW5kbyBdICYmIG93bmVyWyB0aGlzLmV4cGFuZG8gXVsga2V5IF07XG5cdH0sXG5cdGFjY2VzczogZnVuY3Rpb24oIG93bmVyLCBrZXksIHZhbHVlICkge1xuXHRcdHZhciBzdG9yZWQ7XG5cblx0XHQvLyBJbiBjYXNlcyB3aGVyZSBlaXRoZXI6XG5cdFx0Ly9cblx0XHQvLyAgIDEuIE5vIGtleSB3YXMgc3BlY2lmaWVkXG5cdFx0Ly8gICAyLiBBIHN0cmluZyBrZXkgd2FzIHNwZWNpZmllZCwgYnV0IG5vIHZhbHVlIHByb3ZpZGVkXG5cdFx0Ly9cblx0XHQvLyBUYWtlIHRoZSBcInJlYWRcIiBwYXRoIGFuZCBhbGxvdyB0aGUgZ2V0IG1ldGhvZCB0byBkZXRlcm1pbmVcblx0XHQvLyB3aGljaCB2YWx1ZSB0byByZXR1cm4sIHJlc3BlY3RpdmVseSBlaXRoZXI6XG5cdFx0Ly9cblx0XHQvLyAgIDEuIFRoZSBlbnRpcmUgY2FjaGUgb2JqZWN0XG5cdFx0Ly8gICAyLiBUaGUgZGF0YSBzdG9yZWQgYXQgdGhlIGtleVxuXHRcdC8vXG5cdFx0aWYgKCBrZXkgPT09IHVuZGVmaW5lZCB8fFxuXHRcdFx0XHQoICgga2V5ICYmIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgKSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkICkgKSB7XG5cblx0XHRcdHN0b3JlZCA9IHRoaXMuZ2V0KCBvd25lciwga2V5ICk7XG5cblx0XHRcdHJldHVybiBzdG9yZWQgIT09IHVuZGVmaW5lZCA/XG5cdFx0XHRcdHN0b3JlZCA6IHRoaXMuZ2V0KCBvd25lciwgalF1ZXJ5LmNhbWVsQ2FzZSgga2V5ICkgKTtcblx0XHR9XG5cblx0XHQvLyBXaGVuIHRoZSBrZXkgaXMgbm90IGEgc3RyaW5nLCBvciBib3RoIGEga2V5IGFuZCB2YWx1ZVxuXHRcdC8vIGFyZSBzcGVjaWZpZWQsIHNldCBvciBleHRlbmQgKGV4aXN0aW5nIG9iamVjdHMpIHdpdGggZWl0aGVyOlxuXHRcdC8vXG5cdFx0Ly8gICAxLiBBbiBvYmplY3Qgb2YgcHJvcGVydGllc1xuXHRcdC8vICAgMi4gQSBrZXkgYW5kIHZhbHVlXG5cdFx0Ly9cblx0XHR0aGlzLnNldCggb3duZXIsIGtleSwgdmFsdWUgKTtcblxuXHRcdC8vIFNpbmNlIHRoZSBcInNldFwiIHBhdGggY2FuIGhhdmUgdHdvIHBvc3NpYmxlIGVudHJ5IHBvaW50c1xuXHRcdC8vIHJldHVybiB0aGUgZXhwZWN0ZWQgZGF0YSBiYXNlZCBvbiB3aGljaCBwYXRoIHdhcyB0YWtlblsqXVxuXHRcdHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiBrZXk7XG5cdH0sXG5cdHJlbW92ZTogZnVuY3Rpb24oIG93bmVyLCBrZXkgKSB7XG5cdFx0dmFyIGksIG5hbWUsIGNhbWVsLFxuXHRcdFx0Y2FjaGUgPSBvd25lclsgdGhpcy5leHBhbmRvIF07XG5cblx0XHRpZiAoIGNhY2hlID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCBrZXkgPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHRoaXMucmVnaXN0ZXIoIG93bmVyICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBTdXBwb3J0IGFycmF5IG9yIHNwYWNlIHNlcGFyYXRlZCBzdHJpbmcgb2Yga2V5c1xuXHRcdFx0aWYgKCBqUXVlcnkuaXNBcnJheSgga2V5ICkgKSB7XG5cblx0XHRcdFx0Ly8gSWYgXCJuYW1lXCIgaXMgYW4gYXJyYXkgb2Yga2V5cy4uLlxuXHRcdFx0XHQvLyBXaGVuIGRhdGEgaXMgaW5pdGlhbGx5IGNyZWF0ZWQsIHZpYSAoXCJrZXlcIiwgXCJ2YWxcIikgc2lnbmF0dXJlLFxuXHRcdFx0XHQvLyBrZXlzIHdpbGwgYmUgY29udmVydGVkIHRvIGNhbWVsQ2FzZS5cblx0XHRcdFx0Ly8gU2luY2UgdGhlcmUgaXMgbm8gd2F5IHRvIHRlbGwgX2hvd18gYSBrZXkgd2FzIGFkZGVkLCByZW1vdmVcblx0XHRcdFx0Ly8gYm90aCBwbGFpbiBrZXkgYW5kIGNhbWVsQ2FzZSBrZXkuICMxMjc4NlxuXHRcdFx0XHQvLyBUaGlzIHdpbGwgb25seSBwZW5hbGl6ZSB0aGUgYXJyYXkgYXJndW1lbnQgcGF0aC5cblx0XHRcdFx0bmFtZSA9IGtleS5jb25jYXQoIGtleS5tYXAoIGpRdWVyeS5jYW1lbENhc2UgKSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2FtZWwgPSBqUXVlcnkuY2FtZWxDYXNlKCBrZXkgKTtcblxuXHRcdFx0XHQvLyBUcnkgdGhlIHN0cmluZyBhcyBhIGtleSBiZWZvcmUgYW55IG1hbmlwdWxhdGlvblxuXHRcdFx0XHRpZiAoIGtleSBpbiBjYWNoZSApIHtcblx0XHRcdFx0XHRuYW1lID0gWyBrZXksIGNhbWVsIF07XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBJZiBhIGtleSB3aXRoIHRoZSBzcGFjZXMgZXhpc3RzLCB1c2UgaXQuXG5cdFx0XHRcdFx0Ly8gT3RoZXJ3aXNlLCBjcmVhdGUgYW4gYXJyYXkgYnkgbWF0Y2hpbmcgbm9uLXdoaXRlc3BhY2Vcblx0XHRcdFx0XHRuYW1lID0gY2FtZWw7XG5cdFx0XHRcdFx0bmFtZSA9IG5hbWUgaW4gY2FjaGUgP1xuXHRcdFx0XHRcdFx0WyBuYW1lIF0gOiAoIG5hbWUubWF0Y2goIHJub3R3aGl0ZSApIHx8IFtdICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aSA9IG5hbWUubGVuZ3RoO1xuXG5cdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0ZGVsZXRlIGNhY2hlWyBuYW1lWyBpIF0gXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBSZW1vdmUgdGhlIGV4cGFuZG8gaWYgdGhlcmUncyBubyBtb3JlIGRhdGFcblx0XHRpZiAoIGtleSA9PT0gdW5kZWZpbmVkIHx8IGpRdWVyeS5pc0VtcHR5T2JqZWN0KCBjYWNoZSApICkge1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBDaHJvbWUgPD0gMzUtNDUrXG5cdFx0XHQvLyBXZWJraXQgJiBCbGluayBwZXJmb3JtYW5jZSBzdWZmZXJzIHdoZW4gZGVsZXRpbmcgcHJvcGVydGllc1xuXHRcdFx0Ly8gZnJvbSBET00gbm9kZXMsIHNvIHNldCB0byB1bmRlZmluZWQgaW5zdGVhZFxuXHRcdFx0Ly8gaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTM3ODYwN1xuXHRcdFx0aWYgKCBvd25lci5ub2RlVHlwZSApIHtcblx0XHRcdFx0b3duZXJbIHRoaXMuZXhwYW5kbyBdID0gdW5kZWZpbmVkO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVsZXRlIG93bmVyWyB0aGlzLmV4cGFuZG8gXTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGhhc0RhdGE6IGZ1bmN0aW9uKCBvd25lciApIHtcblx0XHR2YXIgY2FjaGUgPSBvd25lclsgdGhpcy5leHBhbmRvIF07XG5cdFx0cmV0dXJuIGNhY2hlICE9PSB1bmRlZmluZWQgJiYgIWpRdWVyeS5pc0VtcHR5T2JqZWN0KCBjYWNoZSApO1xuXHR9XG59O1xuXG5yZXR1cm4gRGF0YTtcbn0gKTtcbiJdfQ==