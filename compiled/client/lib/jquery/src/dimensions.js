"use strict";

define(["./core", "./core/access", "./css"], function (jQuery, access) {

	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each({ Height: "height", Width: "width" }, function (name, type) {
		jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name }, function (defaultExtra, funcName) {

			// Margin is only for outerHeight, outerWidth
			jQuery.fn[funcName] = function (margin, value) {
				var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
				    extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

				return access(this, function (elem, type, value) {
					var doc;

					if (jQuery.isWindow(elem)) {

						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement["client" + name];
					}

					// Get document width or height
					if (elem.nodeType === 9) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
					}

					return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css(elem, type, extra) :

					// Set width or height on the element
					jQuery.style(elem, type, value, extra);
				}, type, chainable ? margin : undefined, chainable, null);
			};
		});
	});

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9kaW1lbnNpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxDQUNQLFFBRE8sRUFFUCxlQUZPLEVBR1AsT0FITyxDQUFSLEVBSUcsVUFBVSxNQUFWLEVBQWtCLE1BQWxCLEVBQTJCOzs7QUFHOUIsUUFBTyxJQUFQLENBQWEsRUFBRSxRQUFRLFFBQVIsRUFBa0IsT0FBTyxPQUFQLEVBQWpDLEVBQW1ELFVBQVUsSUFBVixFQUFnQixJQUFoQixFQUF1QjtBQUN6RSxTQUFPLElBQVAsQ0FBYSxFQUFFLFNBQVMsVUFBVSxJQUFWLEVBQWdCLFNBQVMsSUFBVCxFQUFlLElBQUksVUFBVSxJQUFWLEVBQTNELEVBQ0MsVUFBVSxZQUFWLEVBQXdCLFFBQXhCLEVBQW1DOzs7QUFHbkMsVUFBTyxFQUFQLENBQVcsUUFBWCxJQUF3QixVQUFVLE1BQVYsRUFBa0IsS0FBbEIsRUFBMEI7QUFDakQsUUFBSSxZQUFZLFVBQVUsTUFBVixLQUFzQixnQkFBZ0IsT0FBTyxNQUFQLEtBQWtCLFNBQWxCLENBQXRDO1FBQ2YsUUFBUSxpQkFBa0IsV0FBVyxJQUFYLElBQW1CLFVBQVUsSUFBVixHQUFpQixRQUFwQyxHQUErQyxRQUEvQyxDQUFsQixDQUZ3Qzs7QUFJakQsV0FBTyxPQUFRLElBQVIsRUFBYyxVQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0IsS0FBdEIsRUFBOEI7QUFDbEQsU0FBSSxHQUFKLENBRGtEOztBQUdsRCxTQUFLLE9BQU8sUUFBUCxDQUFpQixJQUFqQixDQUFMLEVBQStCOzs7OztBQUs5QixhQUFPLEtBQUssUUFBTCxDQUFjLGVBQWQsQ0FBK0IsV0FBVyxJQUFYLENBQXRDLENBTDhCO01BQS9COzs7QUFIa0QsU0FZN0MsS0FBSyxRQUFMLEtBQWtCLENBQWxCLEVBQXNCO0FBQzFCLFlBQU0sS0FBSyxlQUFMOzs7O0FBRG9CLGFBS25CLEtBQUssR0FBTCxDQUNOLEtBQUssSUFBTCxDQUFXLFdBQVcsSUFBWCxDQURMLEVBQ3dCLElBQUssV0FBVyxJQUFYLENBRDdCLEVBRU4sS0FBSyxJQUFMLENBQVcsV0FBVyxJQUFYLENBRkwsRUFFd0IsSUFBSyxXQUFXLElBQVgsQ0FGN0IsRUFHTixJQUFLLFdBQVcsSUFBWCxDQUhDLENBQVAsQ0FMMEI7TUFBM0I7O0FBWUEsWUFBTyxVQUFVLFNBQVY7OztBQUdOLFlBQU8sR0FBUCxDQUFZLElBQVosRUFBa0IsSUFBbEIsRUFBd0IsS0FBeEIsQ0FITTs7O0FBTU4sWUFBTyxLQUFQLENBQWMsSUFBZCxFQUFvQixJQUFwQixFQUEwQixLQUExQixFQUFpQyxLQUFqQyxDQU5NLENBeEIyQztLQUE5QixFQStCbEIsSUEvQkksRUErQkUsWUFBWSxNQUFaLEdBQXFCLFNBQXJCLEVBQWdDLFNBL0JsQyxFQStCNkMsSUEvQjdDLENBQVAsQ0FKaUQ7SUFBMUIsQ0FIVztHQUFuQyxDQURELENBRHlFO0VBQXZCLENBQW5ELENBSDhCOztBQWdEOUIsUUFBTyxNQUFQLENBaEQ4QjtDQUEzQixDQUpIIiwiZmlsZSI6ImRpbWVuc2lvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuL2NvcmVcIixcblx0XCIuL2NvcmUvYWNjZXNzXCIsXG5cdFwiLi9jc3NcIlxuXSwgZnVuY3Rpb24oIGpRdWVyeSwgYWNjZXNzICkge1xuXG4vLyBDcmVhdGUgaW5uZXJIZWlnaHQsIGlubmVyV2lkdGgsIGhlaWdodCwgd2lkdGgsIG91dGVySGVpZ2h0IGFuZCBvdXRlcldpZHRoIG1ldGhvZHNcbmpRdWVyeS5lYWNoKCB7IEhlaWdodDogXCJoZWlnaHRcIiwgV2lkdGg6IFwid2lkdGhcIiB9LCBmdW5jdGlvbiggbmFtZSwgdHlwZSApIHtcblx0alF1ZXJ5LmVhY2goIHsgcGFkZGluZzogXCJpbm5lclwiICsgbmFtZSwgY29udGVudDogdHlwZSwgXCJcIjogXCJvdXRlclwiICsgbmFtZSB9LFxuXHRcdGZ1bmN0aW9uKCBkZWZhdWx0RXh0cmEsIGZ1bmNOYW1lICkge1xuXG5cdFx0Ly8gTWFyZ2luIGlzIG9ubHkgZm9yIG91dGVySGVpZ2h0LCBvdXRlcldpZHRoXG5cdFx0alF1ZXJ5LmZuWyBmdW5jTmFtZSBdID0gZnVuY3Rpb24oIG1hcmdpbiwgdmFsdWUgKSB7XG5cdFx0XHR2YXIgY2hhaW5hYmxlID0gYXJndW1lbnRzLmxlbmd0aCAmJiAoIGRlZmF1bHRFeHRyYSB8fCB0eXBlb2YgbWFyZ2luICE9PSBcImJvb2xlYW5cIiApLFxuXHRcdFx0XHRleHRyYSA9IGRlZmF1bHRFeHRyYSB8fCAoIG1hcmdpbiA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gdHJ1ZSA/IFwibWFyZ2luXCIgOiBcImJvcmRlclwiICk7XG5cblx0XHRcdHJldHVybiBhY2Nlc3MoIHRoaXMsIGZ1bmN0aW9uKCBlbGVtLCB0eXBlLCB2YWx1ZSApIHtcblx0XHRcdFx0dmFyIGRvYztcblxuXHRcdFx0XHRpZiAoIGpRdWVyeS5pc1dpbmRvdyggZWxlbSApICkge1xuXG5cdFx0XHRcdFx0Ly8gQXMgb2YgNS84LzIwMTIgdGhpcyB3aWxsIHlpZWxkIGluY29ycmVjdCByZXN1bHRzIGZvciBNb2JpbGUgU2FmYXJpLCBidXQgdGhlcmVcblx0XHRcdFx0XHQvLyBpc24ndCBhIHdob2xlIGxvdCB3ZSBjYW4gZG8uIFNlZSBwdWxsIHJlcXVlc3QgYXQgdGhpcyBVUkwgZm9yIGRpc2N1c3Npb246XG5cdFx0XHRcdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvcHVsbC83NjRcblx0XHRcdFx0XHRyZXR1cm4gZWxlbS5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbIFwiY2xpZW50XCIgKyBuYW1lIF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBHZXQgZG9jdW1lbnQgd2lkdGggb3IgaGVpZ2h0XG5cdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gOSApIHtcblx0XHRcdFx0XHRkb2MgPSBlbGVtLmRvY3VtZW50RWxlbWVudDtcblxuXHRcdFx0XHRcdC8vIEVpdGhlciBzY3JvbGxbV2lkdGgvSGVpZ2h0XSBvciBvZmZzZXRbV2lkdGgvSGVpZ2h0XSBvciBjbGllbnRbV2lkdGgvSGVpZ2h0XSxcblx0XHRcdFx0XHQvLyB3aGljaGV2ZXIgaXMgZ3JlYXRlc3Rcblx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgoXG5cdFx0XHRcdFx0XHRlbGVtLmJvZHlbIFwic2Nyb2xsXCIgKyBuYW1lIF0sIGRvY1sgXCJzY3JvbGxcIiArIG5hbWUgXSxcblx0XHRcdFx0XHRcdGVsZW0uYm9keVsgXCJvZmZzZXRcIiArIG5hbWUgXSwgZG9jWyBcIm9mZnNldFwiICsgbmFtZSBdLFxuXHRcdFx0XHRcdFx0ZG9jWyBcImNsaWVudFwiICsgbmFtZSBdXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID9cblxuXHRcdFx0XHRcdC8vIEdldCB3aWR0aCBvciBoZWlnaHQgb24gdGhlIGVsZW1lbnQsIHJlcXVlc3RpbmcgYnV0IG5vdCBmb3JjaW5nIHBhcnNlRmxvYXRcblx0XHRcdFx0XHRqUXVlcnkuY3NzKCBlbGVtLCB0eXBlLCBleHRyYSApIDpcblxuXHRcdFx0XHRcdC8vIFNldCB3aWR0aCBvciBoZWlnaHQgb24gdGhlIGVsZW1lbnRcblx0XHRcdFx0XHRqUXVlcnkuc3R5bGUoIGVsZW0sIHR5cGUsIHZhbHVlLCBleHRyYSApO1xuXHRcdFx0fSwgdHlwZSwgY2hhaW5hYmxlID8gbWFyZ2luIDogdW5kZWZpbmVkLCBjaGFpbmFibGUsIG51bGwgKTtcblx0XHR9O1xuXHR9ICk7XG59ICk7XG5cbnJldHVybiBqUXVlcnk7XG59ICk7XG4iXX0=