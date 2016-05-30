"use strict";

define(["../data/var/dataPriv"], function (dataPriv) {

	function showHide(elements, show) {
		var display,
		    elem,
		    values = [],
		    index = 0,
		    length = elements.length;

		// Determine new display value for elements that need to change
		for (; index < length; index++) {
			elem = elements[index];
			if (!elem.style) {
				continue;
			}

			display = elem.style.display;
			if (show) {
				if (display === "none") {

					// Restore a pre-hide() value if we have one
					values[index] = dataPriv.get(elem, "display") || "";
				}
			} else {
				if (display !== "none") {
					values[index] = "none";

					// Remember the value we're replacing
					dataPriv.set(elem, "display", display);
				}
			}
		}

		// Set the display of the elements in a second loop
		// to avoid the constant reflow
		for (index = 0; index < length; index++) {
			if (values[index] != null) {
				elements[index].style.display = values[index];
			}
		}

		return elements;
	}

	return showHide;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9jc3Mvc2hvd0hpZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1Asc0JBRE8sQ0FBUixFQUVHLFVBQVUsUUFBVixFQUFxQjs7QUFFeEIsVUFBUyxRQUFULENBQW1CLFFBQW5CLEVBQTZCLElBQTdCLEVBQW9DO0FBQ25DLE1BQUksT0FBSjtNQUFhLElBQWI7TUFDQyxTQUFTLEVBRFY7TUFFQyxRQUFRLENBRlQ7TUFHQyxTQUFTLFNBQVMsTUFIbkI7OztBQU1BLFNBQVEsUUFBUSxNQUFoQixFQUF3QixPQUF4QixFQUFrQztBQUNqQyxVQUFPLFNBQVUsS0FBVixDQUFQO0FBQ0EsT0FBSyxDQUFDLEtBQUssS0FBWCxFQUFtQjtBQUNsQjtBQUNBOztBQUVELGFBQVUsS0FBSyxLQUFMLENBQVcsT0FBckI7QUFDQSxPQUFLLElBQUwsRUFBWTtBQUNYLFFBQUssWUFBWSxNQUFqQixFQUEwQjs7O0FBR3pCLFlBQVEsS0FBUixJQUFrQixTQUFTLEdBQVQsQ0FBYyxJQUFkLEVBQW9CLFNBQXBCLEtBQW1DLEVBQXJEO0FBQ0E7QUFDRCxJQU5ELE1BTU87QUFDTixRQUFLLFlBQVksTUFBakIsRUFBMEI7QUFDekIsWUFBUSxLQUFSLElBQWtCLE1BQWxCOzs7QUFHQSxjQUFTLEdBQVQsQ0FBYyxJQUFkLEVBQW9CLFNBQXBCLEVBQStCLE9BQS9CO0FBQ0E7QUFDRDtBQUNEOzs7O0FBSUQsT0FBTSxRQUFRLENBQWQsRUFBaUIsUUFBUSxNQUF6QixFQUFpQyxPQUFqQyxFQUEyQztBQUMxQyxPQUFLLE9BQVEsS0FBUixLQUFtQixJQUF4QixFQUErQjtBQUM5QixhQUFVLEtBQVYsRUFBa0IsS0FBbEIsQ0FBd0IsT0FBeEIsR0FBa0MsT0FBUSxLQUFSLENBQWxDO0FBQ0E7QUFDRDs7QUFFRCxTQUFPLFFBQVA7QUFDQTs7QUFFRCxRQUFPLFFBQVA7QUFFQyxDQS9DRCIsImZpbGUiOiJzaG93SGlkZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4uL2RhdGEvdmFyL2RhdGFQcml2XCJcbl0sIGZ1bmN0aW9uKCBkYXRhUHJpdiApIHtcblxuZnVuY3Rpb24gc2hvd0hpZGUoIGVsZW1lbnRzLCBzaG93ICkge1xuXHR2YXIgZGlzcGxheSwgZWxlbSxcblx0XHR2YWx1ZXMgPSBbXSxcblx0XHRpbmRleCA9IDAsXG5cdFx0bGVuZ3RoID0gZWxlbWVudHMubGVuZ3RoO1xuXG5cdC8vIERldGVybWluZSBuZXcgZGlzcGxheSB2YWx1ZSBmb3IgZWxlbWVudHMgdGhhdCBuZWVkIHRvIGNoYW5nZVxuXHRmb3IgKCA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrICkge1xuXHRcdGVsZW0gPSBlbGVtZW50c1sgaW5kZXggXTtcblx0XHRpZiAoICFlbGVtLnN0eWxlICkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0ZGlzcGxheSA9IGVsZW0uc3R5bGUuZGlzcGxheTtcblx0XHRpZiAoIHNob3cgKSB7XG5cdFx0XHRpZiAoIGRpc3BsYXkgPT09IFwibm9uZVwiICkge1xuXG5cdFx0XHRcdC8vIFJlc3RvcmUgYSBwcmUtaGlkZSgpIHZhbHVlIGlmIHdlIGhhdmUgb25lXG5cdFx0XHRcdHZhbHVlc1sgaW5kZXggXSA9IGRhdGFQcml2LmdldCggZWxlbSwgXCJkaXNwbGF5XCIgKSB8fCBcIlwiO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoIGRpc3BsYXkgIT09IFwibm9uZVwiICkge1xuXHRcdFx0XHR2YWx1ZXNbIGluZGV4IF0gPSBcIm5vbmVcIjtcblxuXHRcdFx0XHQvLyBSZW1lbWJlciB0aGUgdmFsdWUgd2UncmUgcmVwbGFjaW5nXG5cdFx0XHRcdGRhdGFQcml2LnNldCggZWxlbSwgXCJkaXNwbGF5XCIsIGRpc3BsYXkgKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBTZXQgdGhlIGRpc3BsYXkgb2YgdGhlIGVsZW1lbnRzIGluIGEgc2Vjb25kIGxvb3Bcblx0Ly8gdG8gYXZvaWQgdGhlIGNvbnN0YW50IHJlZmxvd1xuXHRmb3IgKCBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrICkge1xuXHRcdGlmICggdmFsdWVzWyBpbmRleCBdICE9IG51bGwgKSB7XG5cdFx0XHRlbGVtZW50c1sgaW5kZXggXS5zdHlsZS5kaXNwbGF5ID0gdmFsdWVzWyBpbmRleCBdO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBlbGVtZW50cztcbn1cblxucmV0dXJuIHNob3dIaWRlO1xuXG59ICk7XG4iXX0=