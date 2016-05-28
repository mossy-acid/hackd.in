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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9kYXRhL0RhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1AsU0FETyxFQUVQLGtCQUZPLEVBR1Asa0JBSE8sQ0FBUixFQUlHLFVBQVUsTUFBVixFQUFrQixTQUFsQixFQUE2QixVQUE3QixFQUEwQzs7QUFFN0MsVUFBUyxJQUFULEdBQWdCO0FBQ2YsT0FBSyxPQUFMLEdBQWUsT0FBTyxPQUFQLEdBQWlCLEtBQUssR0FBTCxFQUFqQixDQURBO0VBQWhCOztBQUlBLE1BQUssR0FBTCxHQUFXLENBQVgsQ0FONkM7O0FBUTdDLE1BQUssU0FBTCxHQUFpQjs7QUFFaEIsWUFBVSxrQkFBVSxLQUFWLEVBQWlCLE9BQWpCLEVBQTJCO0FBQ3BDLE9BQUksUUFBUSxXQUFXLEVBQVg7Ozs7QUFEd0IsT0FLL0IsTUFBTSxRQUFOLEVBQWlCO0FBQ3JCLFVBQU8sS0FBSyxPQUFMLENBQVAsR0FBd0IsS0FBeEI7Ozs7O0FBRHFCLElBQXRCLE1BTU87QUFDTixZQUFPLGNBQVAsQ0FBdUIsS0FBdkIsRUFBOEIsS0FBSyxPQUFMLEVBQWM7QUFDM0MsYUFBTyxLQUFQO0FBQ0EsZ0JBQVUsSUFBVjtBQUNBLG9CQUFjLElBQWQ7TUFIRCxFQURNO0tBTlA7QUFhQSxVQUFPLE1BQU8sS0FBSyxPQUFMLENBQWQsQ0FsQm9DO0dBQTNCO0FBb0JWLFNBQU8sZUFBVSxLQUFWLEVBQWtCOzs7OztBQUt4QixPQUFLLENBQUMsV0FBWSxLQUFaLENBQUQsRUFBdUI7QUFDM0IsV0FBTyxFQUFQLENBRDJCO0lBQTVCOzs7QUFMd0IsT0FVcEIsUUFBUSxNQUFPLEtBQUssT0FBTCxDQUFmOzs7QUFWb0IsT0FhbkIsQ0FBQyxLQUFELEVBQVM7QUFDYixZQUFRLEVBQVI7Ozs7O0FBRGEsUUFNUixXQUFZLEtBQVosQ0FBTCxFQUEyQjs7OztBQUkxQixTQUFLLE1BQU0sUUFBTixFQUFpQjtBQUNyQixZQUFP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Q0Q7OztBQVI4QixPQStDekIsUUFBUSxTQUFSLElBQXFCLE9BQU8sYUFBUCxDQUFzQixLQUF0QixDQUFyQixFQUFxRDs7Ozs7O0FBTXpELFFBQUssTUFBTSxRQUFOLEVBQWlCO0FBQ3JCLFdBQU8sS0FBSyxPQUFMLENBQVAsR0FBd0IsU0FBeEIsQ0FEcUI7S0FBdEIsTUFFTztBQUNOLFlBQU8sTUFBTyxLQUFLLE9BQUwsQ0FBZCxDQURNO0tBRlA7SUFORDtHQS9DTztBQTREUixXQUFTLGlCQUFVLEtBQVYsRUFBa0I7QUFDMUIsT0FBSSxRQUFRLE1BQU8sS0FBSyxPQUFMLENBQWYsQ0FEc0I7QUFFMUIsVUFBTyxVQUFVLFNBQVYsSUFBdUIsQ0FBQyxPQUFPLGFBQVAsQ0FBc0IsS0FBdEIsQ0FBRCxDQUZKO0dBQWxCO0VBcExWLENBUjZDOztBQWtNN0MsUUFBTyxJQUFQLENBbE02QztDQUExQyxDQUpIIiwiZmlsZSI6IkRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuLi9jb3JlXCIsXG5cdFwiLi4vdmFyL3Jub3R3aGl0ZVwiLFxuXHRcIi4vdmFyL2FjY2VwdERhdGFcIlxuXSwgZnVuY3Rpb24oIGpRdWVyeSwgcm5vdHdoaXRlLCBhY2NlcHREYXRhICkge1xuXG5mdW5jdGlvbiBEYXRhKCkge1xuXHR0aGlzLmV4cGFuZG8gPSBqUXVlcnkuZXhwYW5kbyArIERhdGEudWlkKys7XG59XG5cbkRhdGEudWlkID0gMTtcblxuRGF0YS5wcm90b3R5cGUgPSB7XG5cblx0cmVnaXN0ZXI6IGZ1bmN0aW9uKCBvd25lciwgaW5pdGlhbCApIHtcblx0XHR2YXIgdmFsdWUgPSBpbml0aWFsIHx8IHt9O1xuXG5cdFx0Ly8gSWYgaXQgaXMgYSBub2RlIHVubGlrZWx5IHRvIGJlIHN0cmluZ2lmeS1lZCBvciBsb29wZWQgb3ZlclxuXHRcdC8vIHVzZSBwbGFpbiBhc3NpZ25tZW50XG5cdFx0aWYgKCBvd25lci5ub2RlVHlwZSApIHtcblx0XHRcdG93bmVyWyB0aGlzLmV4cGFuZG8gXSA9IHZhbHVlO1xuXG5cdFx0Ly8gT3RoZXJ3aXNlIHNlY3VyZSBpdCBpbiBhIG5vbi1lbnVtZXJhYmxlLCBub24td3JpdGFibGUgcHJvcGVydHlcblx0XHQvLyBjb25maWd1cmFiaWxpdHkgbXVzdCBiZSB0cnVlIHRvIGFsbG93IHRoZSBwcm9wZXJ0eSB0byBiZVxuXHRcdC8vIGRlbGV0ZWQgd2l0aCB0aGUgZGVsZXRlIG9wZXJhdG9yXG5cdFx0fSBlbHNlIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb3duZXIsIHRoaXMuZXhwYW5kbywge1xuXHRcdFx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHRcdH0gKTtcblx0XHR9XG5cdFx0cmV0dXJuIG93bmVyWyB0aGlzLmV4cGFuZG8gXTtcblx0fSxcblx0Y2FjaGU6IGZ1bmN0aW9uKCBvd25lciApIHtcblxuXHRcdC8vIFdlIGNhbiBhY2NlcHQgZGF0YSBmb3Igbm9uLWVsZW1lbnQgbm9kZXMgaW4gbW9kZXJuIGJyb3dzZXJzLFxuXHRcdC8vIGJ1dCB3ZSBzaG91bGQgbm90LCBzZWUgIzgzMzUuXG5cdFx0Ly8gQWx3YXlzIHJldHVybiBhbiBlbXB0eSBvYmplY3QuXG5cdFx0aWYgKCAhYWNjZXB0RGF0YSggb3duZXIgKSApIHtcblx0XHRcdHJldHVybiB7fTtcblx0XHR9XG5cblx0XHQvLyBDaGVjayBpZiB0aGUgb3duZXIgb2JqZWN0IGFscmVhZHkgaGFzIGEgY2FjaGVcblx0XHR2YXIgdmFsdWUgPSBvd25lclsgdGhpcy5leHBhbmRvIF07XG5cblx0XHQvLyBJZiBub3QsIGNyZWF0ZSBvbmVcblx0XHRpZiAoICF2YWx1ZSApIHtcblx0XHRcdHZhbHVlID0ge307XG5cblx0XHRcdC8vIFdlIGNhbiBhY2NlcHQgZGF0YSBmb3Igbm9uLWVsZW1lbnQgbm9kZXMgaW4gbW9kZXJuIGJyb3dzZXJzLFxuXHRcdFx0Ly8gYnV0IHdlIHNob3VsZCBub3QsIHNlZSAjODMzNS5cblx0XHRcdC8vIEFsd2F5cyByZXR1cm4gYW4gZW1wdHkgb2JqZWN0LlxuXHRcdFx0aWYgKCBhY2NlcHREYXRhKCBvd25lciApICkge1xuXG5cdFx0XHRcdC8vIElmIGl0IGlzIGEgbm9kZSB1bmxpa2VseSB0byBiZSBzdHJpbmdpZnktZWQgb3IgbG9vcGVkIG92ZXJcblx0XHRcdFx0Ly8gdXNlIHBsYWluIGFzc2lnbm1lbnRcblx0XHRcdFx0aWYgKCBvd25lci5ub2RlVHlwZSApIHtcblx0XHRcdFx0XHRvd25lclsgdGhpcy5leHBhbmRvIF0gPSB2YWx1ZTtcblxuXHRcdFx0XHQvLyBPdGhlcndpc2Ugc2VjdXJlIGl0IGluIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHlcblx0XHRcdFx0Ly8gY29uZmlndXJhYmxlIG11c3QgYmUgdHJ1ZSB0byBhbGxvdyB0aGUgcHJvcGVydHkgdG8gYmVcblx0XHRcdFx0Ly8gZGVsZXRlZCB3aGVuIGRhdGEgaXMgcmVtb3ZlZFxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb3duZXIsIHRoaXMuZXhwYW5kbywge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHZhbHVlLFxuXHRcdFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9LFxuXHRzZXQ6IGZ1bmN0aW9uKCBvd25lciwgZGF0YSwgdmFsdWUgKSB7XG5cdFx0dmFyIHByb3AsXG5cdFx0XHRjYWNoZSA9IHRoaXMuY2FjaGUoIG93bmVyICk7XG5cblx0XHQvLyBIYW5kbGU6IFsgb3duZXIsIGtleSwgdmFsdWUgXSBhcmdzXG5cdFx0aWYgKCB0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdGNhY2hlWyBkYXRhIF0gPSB2YWx1ZTtcblxuXHRcdC8vIEhhbmRsZTogWyBvd25lciwgeyBwcm9wZXJ0aWVzIH0gXSBhcmdzXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gQ29weSB0aGUgcHJvcGVydGllcyBvbmUtYnktb25lIHRvIHRoZSBjYWNoZSBvYmplY3Rcblx0XHRcdGZvciAoIHByb3AgaW4gZGF0YSApIHtcblx0XHRcdFx0Y2FjaGVbIHByb3AgXSA9IGRhdGFbIHByb3AgXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGNhY2hlO1xuXHR9LFxuXHRnZXQ6IGZ1bmN0aW9uKCBvd25lciwga2V5ICkge1xuXHRcdHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCA/XG5cdFx0XHR0aGlzLmNhY2hlKCBvd25lciApIDpcblx0XHRcdG93bmVyWyB0aGlzLmV4cGFuZG8gXSAmJiBvd25lclsgdGhpcy5leHBhbmRvIF1bIGtleSBdO1xuXHR9LFxuXHRhY2Nlc3M6IGZ1bmN0aW9uKCBvd25lciwga2V5LCB2YWx1ZSApIHtcblx0XHR2YXIgc3RvcmVkO1xuXG5cdFx0Ly8gSW4gY2FzZXMgd2hlcmUgZWl0aGVyOlxuXHRcdC8vXG5cdFx0Ly8gICAxLiBObyBrZXkgd2FzIHNwZWNpZmllZFxuXHRcdC8vICAgMi4gQSBzdHJpbmcga2V5IHdhcyBzcGVjaWZpZWQsIGJ1dCBubyB2YWx1ZSBwcm92aWRlZFxuXHRcdC8vXG5cdFx0Ly8gVGFrZSB0aGUgXCJyZWFkXCIgcGF0aCBhbmQgYWxsb3cgdGhlIGdldCBtZXRob2QgdG8gZGV0ZXJtaW5lXG5cdFx0Ly8gd2hpY2ggdmFsdWUgdG8gcmV0dXJuLCByZXNwZWN0aXZlbHkgZWl0aGVyOlxuXHRcdC8vXG5cdFx0Ly8gICAxLiBUaGUgZW50aXJlIGNhY2hlIG9iamVjdFxuXHRcdC8vICAgMi4gVGhlIGRhdGEgc3RvcmVkIGF0IHRoZSBrZXlcblx0XHQvL1xuXHRcdGlmICgga2V5ID09PSB1bmRlZmluZWQgfHxcblx0XHRcdFx0KCAoIGtleSAmJiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICkgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCApICkge1xuXG5cdFx0XHRzdG9yZWQgPSB0aGlzLmdldCggb3duZXIsIGtleSApO1xuXG5cdFx0XHRyZXR1cm4gc3RvcmVkICE9PSB1bmRlZmluZWQgP1xuXHRcdFx0XHRzdG9yZWQgOiB0aGlzLmdldCggb3duZXIsIGpRdWVyeS5jYW1lbENhc2UoIGtleSApICk7XG5cdFx0fVxuXG5cdFx0Ly8gV2hlbiB0aGUga2V5IGlzIG5vdCBhIHN0cmluZywgb3IgYm90aCBhIGtleSBhbmQgdmFsdWVcblx0XHQvLyBhcmUgc3BlY2lmaWVkLCBzZXQgb3IgZXh0ZW5kIChleGlzdGluZyBvYmplY3RzKSB3aXRoIGVpdGhlcjpcblx0XHQvL1xuXHRcdC8vICAgMS4gQW4gb2JqZWN0IG9mIHByb3BlcnRpZXNcblx0XHQvLyAgIDIuIEEga2V5IGFuZCB2YWx1ZVxuXHRcdC8vXG5cdFx0dGhpcy5zZXQoIG93bmVyLCBrZXksIHZhbHVlICk7XG5cblx0XHQvLyBTaW5jZSB0aGUgXCJzZXRcIiBwYXRoIGNhbiBoYXZlIHR3byBwb3NzaWJsZSBlbnRyeSBwb2ludHNcblx0XHQvLyByZXR1cm4gdGhlIGV4cGVjdGVkIGRhdGEgYmFzZWQgb24gd2hpY2ggcGF0aCB3YXMgdGFrZW5bKl1cblx0XHRyZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoga2V5O1xuXHR9LFxuXHRyZW1vdmU6IGZ1bmN0aW9uKCBvd25lciwga2V5ICkge1xuXHRcdHZhciBpLCBuYW1lLCBjYW1lbCxcblx0XHRcdGNhY2hlID0gb3duZXJbIHRoaXMuZXhwYW5kbyBdO1xuXG5cdFx0aWYgKCBjYWNoZSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICgga2V5ID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHR0aGlzLnJlZ2lzdGVyKCBvd25lciApO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gU3VwcG9ydCBhcnJheSBvciBzcGFjZSBzZXBhcmF0ZWQgc3RyaW5nIG9mIGtleXNcblx0XHRcdGlmICggalF1ZXJ5LmlzQXJyYXkoIGtleSApICkge1xuXG5cdFx0XHRcdC8vIElmIFwibmFtZVwiIGlzIGFuIGFycmF5IG9mIGtleXMuLi5cblx0XHRcdFx0Ly8gV2hlbiBkYXRhIGlzIGluaXRpYWxseSBjcmVhdGVkLCB2aWEgKFwia2V5XCIsIFwidmFsXCIpIHNpZ25hdHVyZSxcblx0XHRcdFx0Ly8ga2V5cyB3aWxsIGJlIGNvbnZlcnRlZCB0byBjYW1lbENhc2UuXG5cdFx0XHRcdC8vIFNpbmNlIHRoZXJlIGlzIG5vIHdheSB0byB0ZWxsIF9ob3dfIGEga2V5IHdhcyBhZGRlZCwgcmVtb3ZlXG5cdFx0XHRcdC8vIGJvdGggcGxhaW4ga2V5IGFuZCBjYW1lbENhc2Uga2V5LiAjMTI3ODZcblx0XHRcdFx0Ly8gVGhpcyB3aWxsIG9ubHkgcGVuYWxpemUgdGhlIGFycmF5IGFyZ3VtZW50IHBhdGguXG5cdFx0XHRcdG5hbWUgPSBrZXkuY29uY2F0KCBrZXkubWFwKCBqUXVlcnkuY2FtZWxDYXNlICkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNhbWVsID0galF1ZXJ5LmNhbWVsQ2FzZSgga2V5ICk7XG5cblx0XHRcdFx0Ly8gVHJ5IHRoZSBzdHJpbmcgYXMgYSBrZXkgYmVmb3JlIGFueSBtYW5pcHVsYXRpb25cblx0XHRcdFx0aWYgKCBrZXkgaW4gY2FjaGUgKSB7XG5cdFx0XHRcdFx0bmFtZSA9IFsga2V5LCBjYW1lbCBdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0Ly8gSWYgYSBrZXkgd2l0aCB0aGUgc3BhY2VzIGV4aXN0cywgdXNlIGl0LlxuXHRcdFx0XHRcdC8vIE90aGVyd2lzZSwgY3JlYXRlIGFuIGFycmF5IGJ5IG1hdGNoaW5nIG5vbi13aGl0ZXNwYWNlXG5cdFx0XHRcdFx0bmFtZSA9IGNhbWVsO1xuXHRcdFx0XHRcdG5hbWUgPSBuYW1lIGluIGNhY2hlID9cblx0XHRcdFx0XHRcdFsgbmFtZSBdIDogKCBuYW1lLm1hdGNoKCBybm90d2hpdGUgKSB8fCBbXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGkgPSBuYW1lLmxlbmd0aDtcblxuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGRlbGV0ZSBjYWNoZVsgbmFtZVsgaSBdIF07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBleHBhbmRvIGlmIHRoZXJlJ3Mgbm8gbW9yZSBkYXRhXG5cdFx0aWYgKCBrZXkgPT09IHVuZGVmaW5lZCB8fCBqUXVlcnkuaXNFbXB0eU9iamVjdCggY2FjaGUgKSApIHtcblxuXHRcdFx0Ly8gU3VwcG9ydDogQ2hyb21lIDw9IDM1LTQ1K1xuXHRcdFx0Ly8gV2Via2l0ICYgQmxpbmsgcGVyZm9ybWFuY2Ugc3VmZmVycyB3aGVuIGRlbGV0aW5nIHByb3BlcnRpZXNcblx0XHRcdC8vIGZyb20gRE9NIG5vZGVzLCBzbyBzZXQgdG8gdW5kZWZpbmVkIGluc3RlYWRcblx0XHRcdC8vIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0zNzg2MDdcblx0XHRcdGlmICggb3duZXIubm9kZVR5cGUgKSB7XG5cdFx0XHRcdG93bmVyWyB0aGlzLmV4cGFuZG8gXSA9IHVuZGVmaW5lZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRlbGV0ZSBvd25lclsgdGhpcy5leHBhbmRvIF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRoYXNEYXRhOiBmdW5jdGlvbiggb3duZXIgKSB7XG5cdFx0dmFyIGNhY2hlID0gb3duZXJbIHRoaXMuZXhwYW5kbyBdO1xuXHRcdHJldHVybiBjYWNoZSAhPT0gdW5kZWZpbmVkICYmICFqUXVlcnkuaXNFbXB0eU9iamVjdCggY2FjaGUgKTtcblx0fVxufTtcblxucmV0dXJuIERhdGE7XG59ICk7XG4iXX0=