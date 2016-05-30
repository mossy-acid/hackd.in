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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9kaW1lbnNpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxDQUNQLFFBRE8sRUFFUCxlQUZPLEVBR1AsT0FITyxDQUFSLEVBSUcsVUFBVSxNQUFWLEVBQWtCLE1BQWxCLEVBQTJCOzs7QUFHOUIsUUFBTyxJQUFQLENBQWEsRUFBRSxRQUFRLFFBQVYsRUFBb0IsT0FBTyxPQUEzQixFQUFiLEVBQW1ELFVBQVUsSUFBVixFQUFnQixJQUFoQixFQUF1QjtBQUN6RSxTQUFPLElBQVAsQ0FBYSxFQUFFLFNBQVMsVUFBVSxJQUFyQixFQUEyQixTQUFTLElBQXBDLEVBQTBDLElBQUksVUFBVSxJQUF4RCxFQUFiLEVBQ0MsVUFBVSxZQUFWLEVBQXdCLFFBQXhCLEVBQW1DOzs7QUFHbkMsVUFBTyxFQUFQLENBQVcsUUFBWCxJQUF3QixVQUFVLE1BQVYsRUFBa0IsS0FBbEIsRUFBMEI7QUFDakQsUUFBSSxZQUFZLFVBQVUsTUFBVixLQUFzQixnQkFBZ0IsT0FBTyxNQUFQLEtBQWtCLFNBQXhELENBQWhCO1FBQ0MsUUFBUSxpQkFBa0IsV0FBVyxJQUFYLElBQW1CLFVBQVUsSUFBN0IsR0FBb0MsUUFBcEMsR0FBK0MsUUFBakUsQ0FEVDs7QUFHQSxXQUFPLE9BQVEsSUFBUixFQUFjLFVBQVUsSUFBVixFQUFnQixJQUFoQixFQUFzQixLQUF0QixFQUE4QjtBQUNsRCxTQUFJLEdBQUo7O0FBRUEsU0FBSyxPQUFPLFFBQVAsQ0FBaUIsSUFBakIsQ0FBTCxFQUErQjs7Ozs7QUFLOUIsYUFBTyxLQUFLLFFBQUwsQ0FBYyxlQUFkLENBQStCLFdBQVcsSUFBMUMsQ0FBUDtBQUNBOzs7QUFHRCxTQUFLLEtBQUssUUFBTCxLQUFrQixDQUF2QixFQUEyQjtBQUMxQixZQUFNLEtBQUssZUFBWDs7OztBQUlBLGFBQU8sS0FBSyxHQUFMLENBQ04sS0FBSyxJQUFMLENBQVcsV0FBVyxJQUF0QixDQURNLEVBQ3dCLElBQUssV0FBVyxJQUFoQixDQUR4QixFQUVOLEtBQUssSUFBTCxDQUFXLFdBQVcsSUFBdEIsQ0FGTSxFQUV3QixJQUFLLFdBQVcsSUFBaEIsQ0FGeEIsRUFHTixJQUFLLFdBQVcsSUFBaEIsQ0FITSxDQUFQO0FBS0E7O0FBRUQsWUFBTyxVQUFVLFNBQVY7OztBQUdOLFlBQU8sR0FBUCxDQUFZLElBQVosRUFBa0IsSUFBbEIsRUFBd0IsS0FBeEIsQ0FITTs7O0FBTU4sWUFBTyxLQUFQLENBQWMsSUFBZCxFQUFvQixJQUFwQixFQUEwQixLQUExQixFQUFpQyxLQUFqQyxDQU5EO0FBT0EsS0EvQk0sRUErQkosSUEvQkksRUErQkUsWUFBWSxNQUFaLEdBQXFCLFNBL0J2QixFQStCa0MsU0EvQmxDLEVBK0I2QyxJQS9CN0MsQ0FBUDtBQWdDQSxJQXBDRDtBQXFDQSxHQXpDRDtBQTBDQSxFQTNDRDs7QUE2Q0EsUUFBTyxNQUFQO0FBQ0MsQ0FyREQiLCJmaWxlIjoiZGltZW5zaW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4vY29yZVwiLFxuXHRcIi4vY29yZS9hY2Nlc3NcIixcblx0XCIuL2Nzc1wiXG5dLCBmdW5jdGlvbiggalF1ZXJ5LCBhY2Nlc3MgKSB7XG5cbi8vIENyZWF0ZSBpbm5lckhlaWdodCwgaW5uZXJXaWR0aCwgaGVpZ2h0LCB3aWR0aCwgb3V0ZXJIZWlnaHQgYW5kIG91dGVyV2lkdGggbWV0aG9kc1xualF1ZXJ5LmVhY2goIHsgSGVpZ2h0OiBcImhlaWdodFwiLCBXaWR0aDogXCJ3aWR0aFwiIH0sIGZ1bmN0aW9uKCBuYW1lLCB0eXBlICkge1xuXHRqUXVlcnkuZWFjaCggeyBwYWRkaW5nOiBcImlubmVyXCIgKyBuYW1lLCBjb250ZW50OiB0eXBlLCBcIlwiOiBcIm91dGVyXCIgKyBuYW1lIH0sXG5cdFx0ZnVuY3Rpb24oIGRlZmF1bHRFeHRyYSwgZnVuY05hbWUgKSB7XG5cblx0XHQvLyBNYXJnaW4gaXMgb25seSBmb3Igb3V0ZXJIZWlnaHQsIG91dGVyV2lkdGhcblx0XHRqUXVlcnkuZm5bIGZ1bmNOYW1lIF0gPSBmdW5jdGlvbiggbWFyZ2luLCB2YWx1ZSApIHtcblx0XHRcdHZhciBjaGFpbmFibGUgPSBhcmd1bWVudHMubGVuZ3RoICYmICggZGVmYXVsdEV4dHJhIHx8IHR5cGVvZiBtYXJnaW4gIT09IFwiYm9vbGVhblwiICksXG5cdFx0XHRcdGV4dHJhID0gZGVmYXVsdEV4dHJhIHx8ICggbWFyZ2luID09PSB0cnVlIHx8IHZhbHVlID09PSB0cnVlID8gXCJtYXJnaW5cIiA6IFwiYm9yZGVyXCIgKTtcblxuXHRcdFx0cmV0dXJuIGFjY2VzcyggdGhpcywgZnVuY3Rpb24oIGVsZW0sIHR5cGUsIHZhbHVlICkge1xuXHRcdFx0XHR2YXIgZG9jO1xuXG5cdFx0XHRcdGlmICggalF1ZXJ5LmlzV2luZG93KCBlbGVtICkgKSB7XG5cblx0XHRcdFx0XHQvLyBBcyBvZiA1LzgvMjAxMiB0aGlzIHdpbGwgeWllbGQgaW5jb3JyZWN0IHJlc3VsdHMgZm9yIE1vYmlsZSBTYWZhcmksIGJ1dCB0aGVyZVxuXHRcdFx0XHRcdC8vIGlzbid0IGEgd2hvbGUgbG90IHdlIGNhbiBkby4gU2VlIHB1bGwgcmVxdWVzdCBhdCB0aGlzIFVSTCBmb3IgZGlzY3Vzc2lvbjpcblx0XHRcdFx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeS9wdWxsLzc2NFxuXHRcdFx0XHRcdHJldHVybiBlbGVtLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudFsgXCJjbGllbnRcIiArIG5hbWUgXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEdldCBkb2N1bWVudCB3aWR0aCBvciBoZWlnaHRcblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSA5ICkge1xuXHRcdFx0XHRcdGRvYyA9IGVsZW0uZG9jdW1lbnRFbGVtZW50O1xuXG5cdFx0XHRcdFx0Ly8gRWl0aGVyIHNjcm9sbFtXaWR0aC9IZWlnaHRdIG9yIG9mZnNldFtXaWR0aC9IZWlnaHRdIG9yIGNsaWVudFtXaWR0aC9IZWlnaHRdLFxuXHRcdFx0XHRcdC8vIHdoaWNoZXZlciBpcyBncmVhdGVzdFxuXHRcdFx0XHRcdHJldHVybiBNYXRoLm1heChcblx0XHRcdFx0XHRcdGVsZW0uYm9keVsgXCJzY3JvbGxcIiArIG5hbWUgXSwgZG9jWyBcInNjcm9sbFwiICsgbmFtZSBdLFxuXHRcdFx0XHRcdFx0ZWxlbS5ib2R5WyBcIm9mZnNldFwiICsgbmFtZSBdLCBkb2NbIFwib2Zmc2V0XCIgKyBuYW1lIF0sXG5cdFx0XHRcdFx0XHRkb2NbIFwiY2xpZW50XCIgKyBuYW1lIF1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgP1xuXG5cdFx0XHRcdFx0Ly8gR2V0IHdpZHRoIG9yIGhlaWdodCBvbiB0aGUgZWxlbWVudCwgcmVxdWVzdGluZyBidXQgbm90IGZvcmNpbmcgcGFyc2VGbG9hdFxuXHRcdFx0XHRcdGpRdWVyeS5jc3MoIGVsZW0sIHR5cGUsIGV4dHJhICkgOlxuXG5cdFx0XHRcdFx0Ly8gU2V0IHdpZHRoIG9yIGhlaWdodCBvbiB0aGUgZWxlbWVudFxuXHRcdFx0XHRcdGpRdWVyeS5zdHlsZSggZWxlbSwgdHlwZSwgdmFsdWUsIGV4dHJhICk7XG5cdFx0XHR9LCB0eXBlLCBjaGFpbmFibGUgPyBtYXJnaW4gOiB1bmRlZmluZWQsIGNoYWluYWJsZSwgbnVsbCApO1xuXHRcdH07XG5cdH0gKTtcbn0gKTtcblxucmV0dXJuIGpRdWVyeTtcbn0gKTtcbiJdfQ==