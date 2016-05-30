"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(["./var/arr", "./var/document", "./var/slice", "./var/concat", "./var/push", "./var/indexOf", "./var/class2type", "./var/toString", "./var/hasOwn", "./var/support"], function (arr, document, _slice, concat, push, indexOf, class2type, toString, hasOwn, support) {

	var version = "@VERSION",


	// Define a local copy of jQuery
	jQuery = function jQuery(selector, context) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init(selector, context);
	},


	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,


	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	    rdashAlpha = /-([\da-z])/gi,


	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function fcamelCase(all, letter) {
		return letter.toUpperCase();
	};

	jQuery.fn = jQuery.prototype = {

		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// Start with an empty selector
		selector: "",

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function toArray() {
			return _slice.call(this);
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function get(num) {
			return num != null ?

			// Return just the one element from the set
			num < 0 ? this[num + this.length] : this[num] :

			// Return all the elements in a clean array
			_slice.call(this);
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function pushStack(elems) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge(this.constructor(), elems);

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		each: function each(callback) {
			return jQuery.each(this, callback);
		},

		map: function map(callback) {
			return this.pushStack(jQuery.map(this, function (elem, i) {
				return callback.call(elem, i, elem);
			}));
		},

		slice: function slice() {
			return this.pushStack(_slice.apply(this, arguments));
		},

		first: function first() {
			return this.eq(0);
		},

		last: function last() {
			return this.eq(-1);
		},

		eq: function eq(i) {
			var len = this.length,
			    j = +i + (i < 0 ? len : 0);
			return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
		},

		end: function end() {
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function () {
		var options,
		    name,
		    src,
		    copy,
		    copyIsArray,
		    clone,
		    target = arguments[0] || {},
		    i = 1,
		    length = arguments.length,
		    deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;

			// Skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object" && !jQuery.isFunction(target)) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {

			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {

				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {

						if (copyIsArray) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];
						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = jQuery.extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
							target[name] = copy;
						}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend({

		// Unique for each copy of jQuery on the page
		expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function error(msg) {
			throw new Error(msg);
		},

		noop: function noop() {},

		isFunction: function isFunction(obj) {
			return jQuery.type(obj) === "function";
		},

		isArray: Array.isArray,

		isWindow: function isWindow(obj) {
			return obj != null && obj === obj.window;
		},

		isNumeric: function isNumeric(obj) {

			// parseFloat NaNs numeric-cast false positives (null|true|false|"")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			// adding 1 corrects loss of precision from parseFloat (#15100)
			var realStringObj = obj && obj.toString();
			return !jQuery.isArray(obj) && realStringObj - parseFloat(realStringObj) + 1 >= 0;
		},

		isPlainObject: function isPlainObject(obj) {
			var key;

			// Not plain objects:
			// - Any object or value whose internal [[Class]] property is not "[object Object]"
			// - DOM nodes
			// - window
			if (jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
				return false;
			}

			// Not own constructor property must be Object
			if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype || {}, "isPrototypeOf")) {
				return false;
			}

			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own
			for (key in obj) {}

			return key === undefined || hasOwn.call(obj, key);
		},

		isEmptyObject: function isEmptyObject(obj) {
			var name;
			for (name in obj) {
				return false;
			}
			return true;
		},

		type: function type(obj) {
			if (obj == null) {
				return obj + "";
			}

			// Support: Android<4.0, iOS<6 (functionish RegExp)
			return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
		},

		// Evaluates a script in a global context
		globalEval: function globalEval(code) {
			var script,
			    indirect = eval;

			code = jQuery.trim(code);

			if (code) {

				// If the code includes a valid, prologue position
				// strict mode pragma, execute code by injecting a
				// script tag into the document.
				if (code.indexOf("use strict") === 1) {
					script = document.createElement("script");
					script.text = code;
					document.head.appendChild(script).parentNode.removeChild(script);
				} else {

					// Otherwise, avoid the DOM node creation, insertion
					// and removal by using an indirect global eval

					indirect(code);
				}
			}
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE9-11+
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function camelCase(string) {
			return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
		},

		nodeName: function nodeName(elem, name) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},

		each: function each(obj, callback) {
			var length,
			    i = 0;

			if (isArrayLike(obj)) {
				length = obj.length;
				for (; i < length; i++) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			} else {
				for (i in obj) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			}

			return obj;
		},

		// Support: Android<4.1
		trim: function trim(text) {
			return text == null ? "" : (text + "").replace(rtrim, "");
		},

		// results is for internal usage only
		makeArray: function makeArray(arr, results) {
			var ret = results || [];

			if (arr != null) {
				if (isArrayLike(Object(arr))) {
					jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
				} else {
					push.call(ret, arr);
				}
			}

			return ret;
		},

		inArray: function inArray(elem, arr, i) {
			return arr == null ? -1 : indexOf.call(arr, elem, i);
		},

		merge: function merge(first, second) {
			var len = +second.length,
			    j = 0,
			    i = first.length;

			for (; j < len; j++) {
				first[i++] = second[j];
			}

			first.length = i;

			return first;
		},

		grep: function grep(elems, callback, invert) {
			var callbackInverse,
			    matches = [],
			    i = 0,
			    length = elems.length,
			    callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for (; i < length; i++) {
				callbackInverse = !callback(elems[i], i);
				if (callbackInverse !== callbackExpect) {
					matches.push(elems[i]);
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function map(elems, callback, arg) {
			var length,
			    value,
			    i = 0,
			    ret = [];

			// Go through the array, translating each of the items to their new values
			if (isArrayLike(elems)) {
				length = elems.length;
				for (; i < length; i++) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}

				// Go through every key on the object,
			} else {
					for (i in elems) {
						value = callback(elems[i], i, arg);

						if (value != null) {
							ret.push(value);
						}
					}
				}

			// Flatten any nested arrays
			return concat.apply([], ret);
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function proxy(fn, context) {
			var tmp, args, proxy;

			if (typeof context === "string") {
				tmp = fn[context];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if (!jQuery.isFunction(fn)) {
				return undefined;
			}

			// Simulated bind
			args = _slice.call(arguments, 2);
			proxy = function proxy() {
				return fn.apply(context || this, args.concat(_slice.call(arguments)));
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: Date.now,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	});

	// JSHint would error on this code due to the Symbol not being defined in ES5.
	// Defining this global in .jshintrc would create a danger of using the global
	// unguarded in another place, it seems safer to just disable JSHint for these
	// three lines.
	/* jshint ignore: start */
	if (typeof Symbol === "function") {
		jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
	}
	/* jshint ignore: end */

	// Populate the class2type map
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});

	function isArrayLike(obj) {

		// Support: iOS 8.2 (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
		    type = jQuery.type(obj);

		if (type === "function" || jQuery.isWindow(obj)) {
			return false;
		}

		return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
	}

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9jb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFRLENBQ1AsV0FETyxFQUVQLGdCQUZPLEVBR1AsYUFITyxFQUlQLGNBSk8sRUFLUCxZQUxPLEVBTVAsZUFOTyxFQU9QLGtCQVBPLEVBUVAsZ0JBUk8sRUFTUCxjQVRPLEVBVVAsZUFWTyxDQUFSLEVBV0csVUFBVSxHQUFWLEVBQWUsUUFBZixFQUF5QixNQUF6QixFQUFnQyxNQUFoQyxFQUF3QyxJQUF4QyxFQUE4QyxPQUE5QyxFQUF1RCxVQUF2RCxFQUFtRSxRQUFuRSxFQUE2RSxNQUE3RSxFQUFxRixPQUFyRixFQUErRjs7QUFFbEcsS0FDQyxVQUFVLFVBRFg7Ozs7QUFJQyxVQUFTLFNBQVQsTUFBUyxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBOEI7Ozs7QUFJdEMsU0FBTyxJQUFJLE9BQU8sRUFBUCxDQUFVLElBQWQsQ0FBb0IsUUFBcEIsRUFBOEIsT0FBOUIsQ0FBUDtBQUNBLEVBVEY7Ozs7O0FBYUMsU0FBUSxvQ0FiVDs7OztBQWdCQyxhQUFZLE9BaEJiO0tBaUJDLGFBQWEsY0FqQmQ7Ozs7QUFvQkMsY0FBYSxTQUFiLFVBQWEsQ0FBVSxHQUFWLEVBQWUsTUFBZixFQUF3QjtBQUNwQyxTQUFPLE9BQU8sV0FBUCxFQUFQO0FBQ0EsRUF0QkY7O0FBd0JBLFFBQU8sRUFBUCxHQUFZLE9BQU8sU0FBUCxHQUFtQjs7O0FBRzlCLFVBQVEsT0FIc0I7O0FBSzlCLGVBQWEsTUFMaUI7OztBQVE5QixZQUFVLEVBUm9COzs7QUFXOUIsVUFBUSxDQVhzQjs7QUFhOUIsV0FBUyxtQkFBVztBQUNuQixVQUFPLE9BQU0sSUFBTixDQUFZLElBQVosQ0FBUDtBQUNBLEdBZjZCOzs7O0FBbUI5QixPQUFLLGFBQVUsR0FBVixFQUFnQjtBQUNwQixVQUFPLE9BQU8sSUFBUDs7O0FBR0osU0FBTSxDQUFOLEdBQVUsS0FBTSxNQUFN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RUFBUCxDQUFXLE9BQU8sUUFBbEIsSUFBK0IsSUFBSyxPQUFPLFFBQVosQ0FBL0I7QUFDQTs7OztBQUlELFFBQU8sSUFBUCxDQUFhLHVFQUF1RSxLQUF2RSxDQUE4RSxHQUE5RSxDQUFiLEVBQ0EsVUFBVSxDQUFWLEVBQWEsSUFBYixFQUFvQjtBQUNuQixhQUFZLGFBQWEsSUFBYixHQUFvQixHQUFoQyxJQUF3QyxLQUFLLFdBQUwsRUFBeEM7QUFDQSxFQUhEOztBQUtBLFVBQVMsV0FBVCxDQUFzQixHQUF0QixFQUE0Qjs7Ozs7O0FBTTNCLE1BQUksU0FBUyxDQUFDLENBQUMsR0FBRixJQUFTLFlBQVksR0FBckIsSUFBNEIsSUFBSSxNQUE3QztNQUNDLE9BQU8sT0FBTyxJQUFQLENBQWEsR0FBYixDQURSOztBQUdBLE1BQUssU0FBUyxVQUFULElBQXVCLE9BQU8sUUFBUCxDQUFpQixHQUFqQixDQUE1QixFQUFxRDtBQUNwRCxVQUFPLEtBQVA7QUFDQTs7QUFFRCxTQUFPLFNBQVMsT0FBVCxJQUFvQixXQUFXLENBQS9CLElBQ04sT0FBTyxNQUFQLEtBQWtCLFFBQWxCLElBQThCLFNBQVMsQ0FBdkMsSUFBOEMsU0FBUyxDQUFYLElBQWtCLEdBRC9EO0FBRUE7O0FBRUQsUUFBTyxNQUFQO0FBQ0MsQ0E3ZUQiLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4vdmFyL2FyclwiLFxuXHRcIi4vdmFyL2RvY3VtZW50XCIsXG5cdFwiLi92YXIvc2xpY2VcIixcblx0XCIuL3Zhci9jb25jYXRcIixcblx0XCIuL3Zhci9wdXNoXCIsXG5cdFwiLi92YXIvaW5kZXhPZlwiLFxuXHRcIi4vdmFyL2NsYXNzMnR5cGVcIixcblx0XCIuL3Zhci90b1N0cmluZ1wiLFxuXHRcIi4vdmFyL2hhc093blwiLFxuXHRcIi4vdmFyL3N1cHBvcnRcIlxuXSwgZnVuY3Rpb24oIGFyciwgZG9jdW1lbnQsIHNsaWNlLCBjb25jYXQsIHB1c2gsIGluZGV4T2YsIGNsYXNzMnR5cGUsIHRvU3RyaW5nLCBoYXNPd24sIHN1cHBvcnQgKSB7XG5cbnZhclxuXHR2ZXJzaW9uID0gXCJAVkVSU0lPTlwiLFxuXG5cdC8vIERlZmluZSBhIGxvY2FsIGNvcHkgb2YgalF1ZXJ5XG5cdGpRdWVyeSA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgY29udGV4dCApIHtcblxuXHRcdC8vIFRoZSBqUXVlcnkgb2JqZWN0IGlzIGFjdHVhbGx5IGp1c3QgdGhlIGluaXQgY29uc3RydWN0b3IgJ2VuaGFuY2VkJ1xuXHRcdC8vIE5lZWQgaW5pdCBpZiBqUXVlcnkgaXMgY2FsbGVkIChqdXN0IGFsbG93IGVycm9yIHRvIGJlIHRocm93biBpZiBub3QgaW5jbHVkZWQpXG5cdFx0cmV0dXJuIG5ldyBqUXVlcnkuZm4uaW5pdCggc2VsZWN0b3IsIGNvbnRleHQgKTtcblx0fSxcblxuXHQvLyBTdXBwb3J0OiBBbmRyb2lkPDQuMVxuXHQvLyBNYWtlIHN1cmUgd2UgdHJpbSBCT00gYW5kIE5CU1Bcblx0cnRyaW0gPSAvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csXG5cblx0Ly8gTWF0Y2hlcyBkYXNoZWQgc3RyaW5nIGZvciBjYW1lbGl6aW5nXG5cdHJtc1ByZWZpeCA9IC9eLW1zLS8sXG5cdHJkYXNoQWxwaGEgPSAvLShbXFxkYS16XSkvZ2ksXG5cblx0Ly8gVXNlZCBieSBqUXVlcnkuY2FtZWxDYXNlIGFzIGNhbGxiYWNrIHRvIHJlcGxhY2UoKVxuXHRmY2FtZWxDYXNlID0gZnVuY3Rpb24oIGFsbCwgbGV0dGVyICkge1xuXHRcdHJldHVybiBsZXR0ZXIudG9VcHBlckNhc2UoKTtcblx0fTtcblxualF1ZXJ5LmZuID0galF1ZXJ5LnByb3RvdHlwZSA9IHtcblxuXHQvLyBUaGUgY3VycmVudCB2ZXJzaW9uIG9mIGpRdWVyeSBiZWluZyB1c2VkXG5cdGpxdWVyeTogdmVyc2lvbixcblxuXHRjb25zdHJ1Y3RvcjogalF1ZXJ5LFxuXG5cdC8vIFN0YXJ0IHdpdGggYW4gZW1wdHkgc2VsZWN0b3Jcblx0c2VsZWN0b3I6IFwiXCIsXG5cblx0Ly8gVGhlIGRlZmF1bHQgbGVuZ3RoIG9mIGEgalF1ZXJ5IG9iamVjdCBpcyAwXG5cdGxlbmd0aDogMCxcblxuXHR0b0FycmF5OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2xpY2UuY2FsbCggdGhpcyApO1xuXHR9LFxuXG5cdC8vIEdldCB0aGUgTnRoIGVsZW1lbnQgaW4gdGhlIG1hdGNoZWQgZWxlbWVudCBzZXQgT1Jcblx0Ly8gR2V0IHRoZSB3aG9sZSBtYXRjaGVkIGVsZW1lbnQgc2V0IGFzIGEgY2xlYW4gYXJyYXlcblx0Z2V0OiBmdW5jdGlvbiggbnVtICkge1xuXHRcdHJldHVybiBudW0gIT0gbnVsbCA/XG5cblx0XHRcdC8vIFJldHVybiBqdXN0IHRoZSBvbmUgZWxlbWVudCBmcm9tIHRoZSBzZXRcblx0XHRcdCggbnVtIDwgMCA/IHRoaXNbIG51bSArIHRoaXMubGVuZ3RoIF0gOiB0aGlzWyBudW0gXSApIDpcblxuXHRcdFx0Ly8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgaW4gYSBjbGVhbiBhcnJheVxuXHRcdFx0c2xpY2UuY2FsbCggdGhpcyApO1xuXHR9LFxuXG5cdC8vIFRha2UgYW4gYXJyYXkgb2YgZWxlbWVudHMgYW5kIHB1c2ggaXQgb250byB0aGUgc3RhY2tcblx0Ly8gKHJldHVybmluZyB0aGUgbmV3IG1hdGNoZWQgZWxlbWVudCBzZXQpXG5cdHB1c2hTdGFjazogZnVuY3Rpb24oIGVsZW1zICkge1xuXG5cdFx0Ly8gQnVpbGQgYSBuZXcgalF1ZXJ5IG1hdGNoZWQgZWxlbWVudCBzZXRcblx0XHR2YXIgcmV0ID0galF1ZXJ5Lm1lcmdlKCB0aGlzLmNvbnN0cnVjdG9yKCksIGVsZW1zICk7XG5cblx0XHQvLyBBZGQgdGhlIG9sZCBvYmplY3Qgb250byB0aGUgc3RhY2sgKGFzIGEgcmVmZXJlbmNlKVxuXHRcdHJldC5wcmV2T2JqZWN0ID0gdGhpcztcblx0XHRyZXQuY29udGV4dCA9IHRoaXMuY29udGV4dDtcblxuXHRcdC8vIFJldHVybiB0aGUgbmV3bHktZm9ybWVkIGVsZW1lbnQgc2V0XG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHQvLyBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGV2ZXJ5IGVsZW1lbnQgaW4gdGhlIG1hdGNoZWQgc2V0LlxuXHRlYWNoOiBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5lYWNoKCB0aGlzLCBjYWxsYmFjayApO1xuXHR9LFxuXG5cdG1hcDogZnVuY3Rpb24oIGNhbGxiYWNrICkge1xuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggalF1ZXJ5Lm1hcCggdGhpcywgZnVuY3Rpb24oIGVsZW0sIGkgKSB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbCggZWxlbSwgaSwgZWxlbSApO1xuXHRcdH0gKSApO1xuXHR9LFxuXG5cdHNsaWNlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIHNsaWNlLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKSApO1xuXHR9LFxuXG5cdGZpcnN0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5lcSggMCApO1xuXHR9LFxuXG5cdGxhc3Q6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmVxKCAtMSApO1xuXHR9LFxuXG5cdGVxOiBmdW5jdGlvbiggaSApIHtcblx0XHR2YXIgbGVuID0gdGhpcy5sZW5ndGgsXG5cdFx0XHRqID0gK2kgKyAoIGkgPCAwID8gbGVuIDogMCApO1xuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggaiA+PSAwICYmIGogPCBsZW4gPyBbIHRoaXNbIGogXSBdIDogW10gKTtcblx0fSxcblxuXHRlbmQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnByZXZPYmplY3QgfHwgdGhpcy5jb25zdHJ1Y3RvcigpO1xuXHR9LFxuXG5cdC8vIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cblx0Ly8gQmVoYXZlcyBsaWtlIGFuIEFycmF5J3MgbWV0aG9kLCBub3QgbGlrZSBhIGpRdWVyeSBtZXRob2QuXG5cdHB1c2g6IHB1c2gsXG5cdHNvcnQ6IGFyci5zb3J0LFxuXHRzcGxpY2U6IGFyci5zcGxpY2Vcbn07XG5cbmpRdWVyeS5leHRlbmQgPSBqUXVlcnkuZm4uZXh0ZW5kID0gZnVuY3Rpb24oKSB7XG5cdHZhciBvcHRpb25zLCBuYW1lLCBzcmMsIGNvcHksIGNvcHlJc0FycmF5LCBjbG9uZSxcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbIDAgXSB8fCB7fSxcblx0XHRpID0gMSxcblx0XHRsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuXHRcdGRlZXAgPSBmYWxzZTtcblxuXHQvLyBIYW5kbGUgYSBkZWVwIGNvcHkgc2l0dWF0aW9uXG5cdGlmICggdHlwZW9mIHRhcmdldCA9PT0gXCJib29sZWFuXCIgKSB7XG5cdFx0ZGVlcCA9IHRhcmdldDtcblxuXHRcdC8vIFNraXAgdGhlIGJvb2xlYW4gYW5kIHRoZSB0YXJnZXRcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbIGkgXSB8fCB7fTtcblx0XHRpKys7XG5cdH1cblxuXHQvLyBIYW5kbGUgY2FzZSB3aGVuIHRhcmdldCBpcyBhIHN0cmluZyBvciBzb21ldGhpbmcgKHBvc3NpYmxlIGluIGRlZXAgY29weSlcblx0aWYgKCB0eXBlb2YgdGFyZ2V0ICE9PSBcIm9iamVjdFwiICYmICFqUXVlcnkuaXNGdW5jdGlvbiggdGFyZ2V0ICkgKSB7XG5cdFx0dGFyZ2V0ID0ge307XG5cdH1cblxuXHQvLyBFeHRlbmQgalF1ZXJ5IGl0c2VsZiBpZiBvbmx5IG9uZSBhcmd1bWVudCBpcyBwYXNzZWRcblx0aWYgKCBpID09PSBsZW5ndGggKSB7XG5cdFx0dGFyZ2V0ID0gdGhpcztcblx0XHRpLS07XG5cdH1cblxuXHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkrKyApIHtcblxuXHRcdC8vIE9ubHkgZGVhbCB3aXRoIG5vbi1udWxsL3VuZGVmaW5lZCB2YWx1ZXNcblx0XHRpZiAoICggb3B0aW9ucyA9IGFyZ3VtZW50c1sgaSBdICkgIT0gbnVsbCApIHtcblxuXHRcdFx0Ly8gRXh0ZW5kIHRoZSBiYXNlIG9iamVjdFxuXHRcdFx0Zm9yICggbmFtZSBpbiBvcHRpb25zICkge1xuXHRcdFx0XHRzcmMgPSB0YXJnZXRbIG5hbWUgXTtcblx0XHRcdFx0Y29weSA9IG9wdGlvbnNbIG5hbWUgXTtcblxuXHRcdFx0XHQvLyBQcmV2ZW50IG5ldmVyLWVuZGluZyBsb29wXG5cdFx0XHRcdGlmICggdGFyZ2V0ID09PSBjb3B5ICkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVjdXJzZSBpZiB3ZSdyZSBtZXJnaW5nIHBsYWluIG9iamVjdHMgb3IgYXJyYXlzXG5cdFx0XHRcdGlmICggZGVlcCAmJiBjb3B5ICYmICggalF1ZXJ5LmlzUGxhaW5PYmplY3QoIGNvcHkgKSB8fFxuXHRcdFx0XHRcdCggY29weUlzQXJyYXkgPSBqUXVlcnkuaXNBcnJheSggY29weSApICkgKSApIHtcblxuXHRcdFx0XHRcdGlmICggY29weUlzQXJyYXkgKSB7XG5cdFx0XHRcdFx0XHRjb3B5SXNBcnJheSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgalF1ZXJ5LmlzQXJyYXkoIHNyYyApID8gc3JjIDogW107XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgalF1ZXJ5LmlzUGxhaW5PYmplY3QoIHNyYyApID8gc3JjIDoge307XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTmV2ZXIgbW92ZSBvcmlnaW5hbCBvYmplY3RzLCBjbG9uZSB0aGVtXG5cdFx0XHRcdFx0dGFyZ2V0WyBuYW1lIF0gPSBqUXVlcnkuZXh0ZW5kKCBkZWVwLCBjbG9uZSwgY29weSApO1xuXG5cdFx0XHRcdC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcblx0XHRcdFx0fSBlbHNlIGlmICggY29weSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdHRhcmdldFsgbmFtZSBdID0gY29weTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG5cdHJldHVybiB0YXJnZXQ7XG59O1xuXG5qUXVlcnkuZXh0ZW5kKCB7XG5cblx0Ly8gVW5pcXVlIGZvciBlYWNoIGNvcHkgb2YgalF1ZXJ5IG9uIHRoZSBwYWdlXG5cdGV4cGFuZG86IFwialF1ZXJ5XCIgKyAoIHZlcnNpb24gKyBNYXRoLnJhbmRvbSgpICkucmVwbGFjZSggL1xcRC9nLCBcIlwiICksXG5cblx0Ly8gQXNzdW1lIGpRdWVyeSBpcyByZWFkeSB3aXRob3V0IHRoZSByZWFkeSBtb2R1bGVcblx0aXNSZWFkeTogdHJ1ZSxcblxuXHRlcnJvcjogZnVuY3Rpb24oIG1zZyApIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoIG1zZyApO1xuXHR9LFxuXG5cdG5vb3A6IGZ1bmN0aW9uKCkge30sXG5cblx0aXNGdW5jdGlvbjogZnVuY3Rpb24oIG9iaiApIHtcblx0XHRyZXR1cm4galF1ZXJ5LnR5cGUoIG9iaiApID09PSBcImZ1bmN0aW9uXCI7XG5cdH0sXG5cblx0aXNBcnJheTogQXJyYXkuaXNBcnJheSxcblxuXHRpc1dpbmRvdzogZnVuY3Rpb24oIG9iaiApIHtcblx0XHRyZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqID09PSBvYmoud2luZG93O1xuXHR9LFxuXG5cdGlzTnVtZXJpYzogZnVuY3Rpb24oIG9iaiApIHtcblxuXHRcdC8vIHBhcnNlRmxvYXQgTmFOcyBudW1lcmljLWNhc3QgZmFsc2UgcG9zaXRpdmVzIChudWxsfHRydWV8ZmFsc2V8XCJcIilcblx0XHQvLyAuLi5idXQgbWlzaW50ZXJwcmV0cyBsZWFkaW5nLW51bWJlciBzdHJpbmdzLCBwYXJ0aWN1bGFybHkgaGV4IGxpdGVyYWxzIChcIjB4Li4uXCIpXG5cdFx0Ly8gc3VidHJhY3Rpb24gZm9yY2VzIGluZmluaXRpZXMgdG8gTmFOXG5cdFx0Ly8gYWRkaW5nIDEgY29ycmVjdHMgbG9zcyBvZiBwcmVjaXNpb24gZnJvbSBwYXJzZUZsb2F0ICgjMTUxMDApXG5cdFx0dmFyIHJlYWxTdHJpbmdPYmogPSBvYmogJiYgb2JqLnRvU3RyaW5nKCk7XG5cdFx0cmV0dXJuICFqUXVlcnkuaXNBcnJheSggb2JqICkgJiYgKCByZWFsU3RyaW5nT2JqIC0gcGFyc2VGbG9hdCggcmVhbFN0cmluZ09iaiApICsgMSApID49IDA7XG5cdH0sXG5cblx0aXNQbGFpbk9iamVjdDogZnVuY3Rpb24oIG9iaiApIHtcblx0XHR2YXIga2V5O1xuXG5cdFx0Ly8gTm90IHBsYWluIG9iamVjdHM6XG5cdFx0Ly8gLSBBbnkgb2JqZWN0IG9yIHZhbHVlIHdob3NlIGludGVybmFsIFtbQ2xhc3NdXSBwcm9wZXJ0eSBpcyBub3QgXCJbb2JqZWN0IE9iamVjdF1cIlxuXHRcdC8vIC0gRE9NIG5vZGVzXG5cdFx0Ly8gLSB3aW5kb3dcblx0XHRpZiAoIGpRdWVyeS50eXBlKCBvYmogKSAhPT0gXCJvYmplY3RcIiB8fCBvYmoubm9kZVR5cGUgfHwgalF1ZXJ5LmlzV2luZG93KCBvYmogKSApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG5cdFx0aWYgKCBvYmouY29uc3RydWN0b3IgJiZcblx0XHRcdFx0IWhhc093bi5jYWxsKCBvYmosIFwiY29uc3RydWN0b3JcIiApICYmXG5cdFx0XHRcdCFoYXNPd24uY2FsbCggb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSB8fCB7fSwgXCJpc1Byb3RvdHlwZU9mXCIgKSApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBPd24gcHJvcGVydGllcyBhcmUgZW51bWVyYXRlZCBmaXJzdGx5LCBzbyB0byBzcGVlZCB1cCxcblx0XHQvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93blxuXHRcdGZvciAoIGtleSBpbiBvYmogKSB7fVxuXG5cdFx0cmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkIHx8IGhhc093bi5jYWxsKCBvYmosIGtleSApO1xuXHR9LFxuXG5cdGlzRW1wdHlPYmplY3Q6IGZ1bmN0aW9uKCBvYmogKSB7XG5cdFx0dmFyIG5hbWU7XG5cdFx0Zm9yICggbmFtZSBpbiBvYmogKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdHR5cGU6IGZ1bmN0aW9uKCBvYmogKSB7XG5cdFx0aWYgKCBvYmogPT0gbnVsbCApIHtcblx0XHRcdHJldHVybiBvYmogKyBcIlwiO1xuXHRcdH1cblxuXHRcdC8vIFN1cHBvcnQ6IEFuZHJvaWQ8NC4wLCBpT1M8NiAoZnVuY3Rpb25pc2ggUmVnRXhwKVxuXHRcdHJldHVybiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT09IFwiZnVuY3Rpb25cIiA/XG5cdFx0XHRjbGFzczJ0eXBlWyB0b1N0cmluZy5jYWxsKCBvYmogKSBdIHx8IFwib2JqZWN0XCIgOlxuXHRcdFx0dHlwZW9mIG9iajtcblx0fSxcblxuXHQvLyBFdmFsdWF0ZXMgYSBzY3JpcHQgaW4gYSBnbG9iYWwgY29udGV4dFxuXHRnbG9iYWxFdmFsOiBmdW5jdGlvbiggY29kZSApIHtcblx0XHR2YXIgc2NyaXB0LFxuXHRcdFx0aW5kaXJlY3QgPSBldmFsO1xuXG5cdFx0Y29kZSA9IGpRdWVyeS50cmltKCBjb2RlICk7XG5cblx0XHRpZiAoIGNvZGUgKSB7XG5cblx0XHRcdC8vIElmIHRoZSBjb2RlIGluY2x1ZGVzIGEgdmFsaWQsIHByb2xvZ3VlIHBvc2l0aW9uXG5cdFx0XHQvLyBzdHJpY3QgbW9kZSBwcmFnbWEsIGV4ZWN1dGUgY29kZSBieSBpbmplY3RpbmcgYVxuXHRcdFx0Ly8gc2NyaXB0IHRhZyBpbnRvIHRoZSBkb2N1bWVudC5cblx0XHRcdGlmICggY29kZS5pbmRleE9mKCBcInVzZSBzdHJpY3RcIiApID09PSAxICkge1xuXHRcdFx0XHRzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcInNjcmlwdFwiICk7XG5cdFx0XHRcdHNjcmlwdC50ZXh0ID0gY29kZTtcblx0XHRcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZCggc2NyaXB0ICkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggc2NyaXB0ICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIE90aGVyd2lzZSwgYXZvaWQgdGhlIERPTSBub2RlIGNyZWF0aW9uLCBpbnNlcnRpb25cblx0XHRcdFx0Ly8gYW5kIHJlbW92YWwgYnkgdXNpbmcgYW4gaW5kaXJlY3QgZ2xvYmFsIGV2YWxcblxuXHRcdFx0XHRpbmRpcmVjdCggY29kZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvLyBDb252ZXJ0IGRhc2hlZCB0byBjYW1lbENhc2U7IHVzZWQgYnkgdGhlIGNzcyBhbmQgZGF0YSBtb2R1bGVzXG5cdC8vIFN1cHBvcnQ6IElFOS0xMStcblx0Ly8gTWljcm9zb2Z0IGZvcmdvdCB0byBodW1wIHRoZWlyIHZlbmRvciBwcmVmaXggKCM5NTcyKVxuXHRjYW1lbENhc2U6IGZ1bmN0aW9uKCBzdHJpbmcgKSB7XG5cdFx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKCBybXNQcmVmaXgsIFwibXMtXCIgKS5yZXBsYWNlKCByZGFzaEFscGhhLCBmY2FtZWxDYXNlICk7XG5cdH0sXG5cblx0bm9kZU5hbWU6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXHRcdHJldHVybiBlbGVtLm5vZGVOYW1lICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuXHR9LFxuXG5cdGVhY2g6IGZ1bmN0aW9uKCBvYmosIGNhbGxiYWNrICkge1xuXHRcdHZhciBsZW5ndGgsIGkgPSAwO1xuXG5cdFx0aWYgKCBpc0FycmF5TGlrZSggb2JqICkgKSB7XG5cdFx0XHRsZW5ndGggPSBvYmoubGVuZ3RoO1xuXHRcdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGlmICggY2FsbGJhY2suY2FsbCggb2JqWyBpIF0sIGksIG9ialsgaSBdICkgPT09IGZhbHNlICkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoIGkgaW4gb2JqICkge1xuXHRcdFx0XHRpZiAoIGNhbGxiYWNrLmNhbGwoIG9ialsgaSBdLCBpLCBvYmpbIGkgXSApID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBvYmo7XG5cdH0sXG5cblx0Ly8gU3VwcG9ydDogQW5kcm9pZDw0LjFcblx0dHJpbTogZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0cmV0dXJuIHRleHQgPT0gbnVsbCA/XG5cdFx0XHRcIlwiIDpcblx0XHRcdCggdGV4dCArIFwiXCIgKS5yZXBsYWNlKCBydHJpbSwgXCJcIiApO1xuXHR9LFxuXG5cdC8vIHJlc3VsdHMgaXMgZm9yIGludGVybmFsIHVzYWdlIG9ubHlcblx0bWFrZUFycmF5OiBmdW5jdGlvbiggYXJyLCByZXN1bHRzICkge1xuXHRcdHZhciByZXQgPSByZXN1bHRzIHx8IFtdO1xuXG5cdFx0aWYgKCBhcnIgIT0gbnVsbCApIHtcblx0XHRcdGlmICggaXNBcnJheUxpa2UoIE9iamVjdCggYXJyICkgKSApIHtcblx0XHRcdFx0alF1ZXJ5Lm1lcmdlKCByZXQsXG5cdFx0XHRcdFx0dHlwZW9mIGFyciA9PT0gXCJzdHJpbmdcIiA/XG5cdFx0XHRcdFx0WyBhcnIgXSA6IGFyclxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHVzaC5jYWxsKCByZXQsIGFyciApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0aW5BcnJheTogZnVuY3Rpb24oIGVsZW0sIGFyciwgaSApIHtcblx0XHRyZXR1cm4gYXJyID09IG51bGwgPyAtMSA6IGluZGV4T2YuY2FsbCggYXJyLCBlbGVtLCBpICk7XG5cdH0sXG5cblx0bWVyZ2U6IGZ1bmN0aW9uKCBmaXJzdCwgc2Vjb25kICkge1xuXHRcdHZhciBsZW4gPSArc2Vjb25kLmxlbmd0aCxcblx0XHRcdGogPSAwLFxuXHRcdFx0aSA9IGZpcnN0Lmxlbmd0aDtcblxuXHRcdGZvciAoIDsgaiA8IGxlbjsgaisrICkge1xuXHRcdFx0Zmlyc3RbIGkrKyBdID0gc2Vjb25kWyBqIF07XG5cdFx0fVxuXG5cdFx0Zmlyc3QubGVuZ3RoID0gaTtcblxuXHRcdHJldHVybiBmaXJzdDtcblx0fSxcblxuXHRncmVwOiBmdW5jdGlvbiggZWxlbXMsIGNhbGxiYWNrLCBpbnZlcnQgKSB7XG5cdFx0dmFyIGNhbGxiYWNrSW52ZXJzZSxcblx0XHRcdG1hdGNoZXMgPSBbXSxcblx0XHRcdGkgPSAwLFxuXHRcdFx0bGVuZ3RoID0gZWxlbXMubGVuZ3RoLFxuXHRcdFx0Y2FsbGJhY2tFeHBlY3QgPSAhaW52ZXJ0O1xuXG5cdFx0Ly8gR28gdGhyb3VnaCB0aGUgYXJyYXksIG9ubHkgc2F2aW5nIHRoZSBpdGVtc1xuXHRcdC8vIHRoYXQgcGFzcyB0aGUgdmFsaWRhdG9yIGZ1bmN0aW9uXG5cdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRjYWxsYmFja0ludmVyc2UgPSAhY2FsbGJhY2soIGVsZW1zWyBpIF0sIGkgKTtcblx0XHRcdGlmICggY2FsbGJhY2tJbnZlcnNlICE9PSBjYWxsYmFja0V4cGVjdCApIHtcblx0XHRcdFx0bWF0Y2hlcy5wdXNoKCBlbGVtc1sgaSBdICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1hdGNoZXM7XG5cdH0sXG5cblx0Ly8gYXJnIGlzIGZvciBpbnRlcm5hbCB1c2FnZSBvbmx5XG5cdG1hcDogZnVuY3Rpb24oIGVsZW1zLCBjYWxsYmFjaywgYXJnICkge1xuXHRcdHZhciBsZW5ndGgsIHZhbHVlLFxuXHRcdFx0aSA9IDAsXG5cdFx0XHRyZXQgPSBbXTtcblxuXHRcdC8vIEdvIHRocm91Z2ggdGhlIGFycmF5LCB0cmFuc2xhdGluZyBlYWNoIG9mIHRoZSBpdGVtcyB0byB0aGVpciBuZXcgdmFsdWVzXG5cdFx0aWYgKCBpc0FycmF5TGlrZSggZWxlbXMgKSApIHtcblx0XHRcdGxlbmd0aCA9IGVsZW1zLmxlbmd0aDtcblx0XHRcdGZvciAoIDsgaSA8IGxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHR2YWx1ZSA9IGNhbGxiYWNrKCBlbGVtc1sgaSBdLCBpLCBhcmcgKTtcblxuXHRcdFx0XHRpZiAoIHZhbHVlICE9IG51bGwgKSB7XG5cdFx0XHRcdFx0cmV0LnB1c2goIHZhbHVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdC8vIEdvIHRocm91Z2ggZXZlcnkga2V5IG9uIHRoZSBvYmplY3QsXG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoIGkgaW4gZWxlbXMgKSB7XG5cdFx0XHRcdHZhbHVlID0gY2FsbGJhY2soIGVsZW1zWyBpIF0sIGksIGFyZyApO1xuXG5cdFx0XHRcdGlmICggdmFsdWUgIT0gbnVsbCApIHtcblx0XHRcdFx0XHRyZXQucHVzaCggdmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEZsYXR0ZW4gYW55IG5lc3RlZCBhcnJheXNcblx0XHRyZXR1cm4gY29uY2F0LmFwcGx5KCBbXSwgcmV0ICk7XG5cdH0sXG5cblx0Ly8gQSBnbG9iYWwgR1VJRCBjb3VudGVyIGZvciBvYmplY3RzXG5cdGd1aWQ6IDEsXG5cblx0Ly8gQmluZCBhIGZ1bmN0aW9uIHRvIGEgY29udGV4dCwgb3B0aW9uYWxseSBwYXJ0aWFsbHkgYXBwbHlpbmcgYW55XG5cdC8vIGFyZ3VtZW50cy5cblx0cHJveHk6IGZ1bmN0aW9uKCBmbiwgY29udGV4dCApIHtcblx0XHR2YXIgdG1wLCBhcmdzLCBwcm94eTtcblxuXHRcdGlmICggdHlwZW9mIGNvbnRleHQgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHR0bXAgPSBmblsgY29udGV4dCBdO1xuXHRcdFx0Y29udGV4dCA9IGZuO1xuXHRcdFx0Zm4gPSB0bXA7XG5cdFx0fVxuXG5cdFx0Ly8gUXVpY2sgY2hlY2sgdG8gZGV0ZXJtaW5lIGlmIHRhcmdldCBpcyBjYWxsYWJsZSwgaW4gdGhlIHNwZWNcblx0XHQvLyB0aGlzIHRocm93cyBhIFR5cGVFcnJvciwgYnV0IHdlIHdpbGwganVzdCByZXR1cm4gdW5kZWZpbmVkLlxuXHRcdGlmICggIWpRdWVyeS5pc0Z1bmN0aW9uKCBmbiApICkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHQvLyBTaW11bGF0ZWQgYmluZFxuXHRcdGFyZ3MgPSBzbGljZS5jYWxsKCBhcmd1bWVudHMsIDIgKTtcblx0XHRwcm94eSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGZuLmFwcGx5KCBjb250ZXh0IHx8IHRoaXMsIGFyZ3MuY29uY2F0KCBzbGljZS5jYWxsKCBhcmd1bWVudHMgKSApICk7XG5cdFx0fTtcblxuXHRcdC8vIFNldCB0aGUgZ3VpZCBvZiB1bmlxdWUgaGFuZGxlciB0byB0aGUgc2FtZSBvZiBvcmlnaW5hbCBoYW5kbGVyLCBzbyBpdCBjYW4gYmUgcmVtb3ZlZFxuXHRcdHByb3h5Lmd1aWQgPSBmbi5ndWlkID0gZm4uZ3VpZCB8fCBqUXVlcnkuZ3VpZCsrO1xuXG5cdFx0cmV0dXJuIHByb3h5O1xuXHR9LFxuXG5cdG5vdzogRGF0ZS5ub3csXG5cblx0Ly8galF1ZXJ5LnN1cHBvcnQgaXMgbm90IHVzZWQgaW4gQ29yZSBidXQgb3RoZXIgcHJvamVjdHMgYXR0YWNoIHRoZWlyXG5cdC8vIHByb3BlcnRpZXMgdG8gaXQgc28gaXQgbmVlZHMgdG8gZXhpc3QuXG5cdHN1cHBvcnQ6IHN1cHBvcnRcbn0gKTtcblxuLy8gSlNIaW50IHdvdWxkIGVycm9yIG9uIHRoaXMgY29kZSBkdWUgdG8gdGhlIFN5bWJvbCBub3QgYmVpbmcgZGVmaW5lZCBpbiBFUzUuXG4vLyBEZWZpbmluZyB0aGlzIGdsb2JhbCBpbiAuanNoaW50cmMgd291bGQgY3JlYXRlIGEgZGFuZ2VyIG9mIHVzaW5nIHRoZSBnbG9iYWxcbi8vIHVuZ3VhcmRlZCBpbiBhbm90aGVyIHBsYWNlLCBpdCBzZWVtcyBzYWZlciB0byBqdXN0IGRpc2FibGUgSlNIaW50IGZvciB0aGVzZVxuLy8gdGhyZWUgbGluZXMuXG4vKiBqc2hpbnQgaWdub3JlOiBzdGFydCAqL1xuaWYgKCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgKSB7XG5cdGpRdWVyeS5mblsgU3ltYm9sLml0ZXJhdG9yIF0gPSBhcnJbIFN5bWJvbC5pdGVyYXRvciBdO1xufVxuLyoganNoaW50IGlnbm9yZTogZW5kICovXG5cbi8vIFBvcHVsYXRlIHRoZSBjbGFzczJ0eXBlIG1hcFxualF1ZXJ5LmVhY2goIFwiQm9vbGVhbiBOdW1iZXIgU3RyaW5nIEZ1bmN0aW9uIEFycmF5IERhdGUgUmVnRXhwIE9iamVjdCBFcnJvciBTeW1ib2xcIi5zcGxpdCggXCIgXCIgKSxcbmZ1bmN0aW9uKCBpLCBuYW1lICkge1xuXHRjbGFzczJ0eXBlWyBcIltvYmplY3QgXCIgKyBuYW1lICsgXCJdXCIgXSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbn0gKTtcblxuZnVuY3Rpb24gaXNBcnJheUxpa2UoIG9iaiApIHtcblxuXHQvLyBTdXBwb3J0OiBpT1MgOC4yIChub3QgcmVwcm9kdWNpYmxlIGluIHNpbXVsYXRvcilcblx0Ly8gYGluYCBjaGVjayB1c2VkIHRvIHByZXZlbnQgSklUIGVycm9yIChnaC0yMTQ1KVxuXHQvLyBoYXNPd24gaXNuJ3QgdXNlZCBoZXJlIGR1ZSB0byBmYWxzZSBuZWdhdGl2ZXNcblx0Ly8gcmVnYXJkaW5nIE5vZGVsaXN0IGxlbmd0aCBpbiBJRVxuXHR2YXIgbGVuZ3RoID0gISFvYmogJiYgXCJsZW5ndGhcIiBpbiBvYmogJiYgb2JqLmxlbmd0aCxcblx0XHR0eXBlID0galF1ZXJ5LnR5cGUoIG9iaiApO1xuXG5cdGlmICggdHlwZSA9PT0gXCJmdW5jdGlvblwiIHx8IGpRdWVyeS5pc1dpbmRvdyggb2JqICkgKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cmV0dXJuIHR5cGUgPT09IFwiYXJyYXlcIiB8fCBsZW5ndGggPT09IDAgfHxcblx0XHR0eXBlb2YgbGVuZ3RoID09PSBcIm51bWJlclwiICYmIGxlbmd0aCA+IDAgJiYgKCBsZW5ndGggLSAxICkgaW4gb2JqO1xufVxuXG5yZXR1cm4galF1ZXJ5O1xufSApO1xuIl19