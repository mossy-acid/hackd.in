"use strict";

define(["../core", "../var/rcssNum"], function (jQuery, rcssNum) {

	function adjustCSS(elem, prop, valueParts, tween) {
		var adjusted,
		    scale = 1,
		    maxIterations = 20,
		    currentValue = tween ? function () {
			return tween.cur();
		} : function () {
			return jQuery.css(elem, prop, "");
		},
		    initial = currentValue(),
		    unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"),


		// Starting value computation is required for potential unit mismatches
		initialInUnit = (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));

		if (initialInUnit && initialInUnit[3] !== unit) {

			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[3];

			// Make sure we update the tween properties later on
			valueParts = valueParts || [];

			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;

			do {

				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";

				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style(elem, prop, initialInUnit + unit);

				// Update scale, tolerating zero or NaN from tween.cur()
				// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (scale !== (scale = currentValue() / initial) && scale !== 1 && --maxIterations);
		}

		if (valueParts) {
			initialInUnit = +initialInUnit || +initial || 0;

			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
			if (tween) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}

	return adjustCSS;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9jc3MvYWRqdXN0Q1NTLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxDQUNQLFNBRE8sRUFFUCxnQkFGTyxDQUFSLEVBR0csVUFBVSxNQUFWLEVBQWtCLE9BQWxCLEVBQTRCOztBQUUvQixVQUFTLFNBQVQsQ0FBb0IsSUFBcEIsRUFBMEIsSUFBMUIsRUFBZ0MsVUFBaEMsRUFBNEMsS0FBNUMsRUFBb0Q7QUFDbkQsTUFBSSxRQUFKO01BQ0MsUUFBUSxDQURUO01BRUMsZ0JBQWdCLEVBRmpCO01BR0MsZUFBZSxRQUNkLFlBQVc7QUFBRSxVQUFPLE1BQU0sR0FBTixFQUFQO0FBQXFCLEdBRHBCLEdBRWQsWUFBVztBQUFFLFVBQU8sT0FBTyxHQUFQLENBQVksSUFBWixFQUFrQixJQUFsQixFQUF3QixFQUF4QixDQUFQO0FBQXNDLEdBTHJEO01BTUMsVUFBVSxjQU5YO01BT0MsT0FBTyxjQUFjLFdBQVksQ0FBWixDQUFkLEtBQW1DLE9BQU8sU0FBUCxDQUFrQixJQUFsQixJQUEyQixFQUEzQixHQUFnQyxJQUFuRSxDQVBSOzs7O0FBVUMsa0JBQWdCLENBQUUsT0FBTyxTQUFQLENBQWtCLElBQWxCLEtBQTRCLFNBQVMsSUFBVCxJQUFpQixDQUFDLE9BQWhELEtBQ2YsUUFBUSxJQUFSLENBQWMsT0FBTyxHQUFQLENBQVksSUFBWixFQUFrQixJQUFsQixDQUFkLENBWEY7O0FBYUEsTUFBSyxpQkFBaUIsY0FBZSxDQUFmLE1BQXVCLElBQTdDLEVBQW9EOzs7QUFHbkQsVUFBTyxRQUFRLGNBQWUsQ0FBZixDQUFmOzs7QUFHQSxnQkFBYSxjQUFjLEVBQTNCOzs7QUFHQSxtQkFBZ0IsQ0FBQyxPQUFELElBQVksQ0FBNUI7O0FBRUEsTUFBRzs7OztBQUlGLFlBQVEsU0FBUyxJQUFqQjs7O0FBR0Esb0JBQWdCLGdCQUFnQixLQUFoQztBQUNBLFdBQU8sS0FBUCxDQUFjLElBQWQsRUFBb0IsSUFBcEIsRUFBMEIsZ0JBQWdCLElBQTFDOzs7O0FBSUEsSUFaRCxRQWFDLFdBQVksUUFBUSxpQkFBaUIsT0FBckMsS0FBa0QsVUFBVSxDQUE1RCxJQUFpRSxFQUFFLGFBYnBFO0FBZUE7O0FBRUQsTUFBSyxVQUFMLEVBQWtCO0FBQ2pCLG1CQUFnQixDQUFDLGFBQUQsSUFBa0IsQ0FBQyxPQUFuQixJQUE4QixDQUE5Qzs7O0FBR0EsY0FBVyxXQUFZLENBQVosSUFDVixnQkFBZ0IsQ0FBRSxXQUFZLENBQVosSUFBa0IsQ0FBcEIsSUFBMEIsV0FBWSxDQUFaLENBRGhDLEdBRVYsQ0FBQyxXQUFZLENBQVosQ0FGRjtBQUdBLE9BQUssS0FBTCxFQUFhO0FBQ1osVUFBTSxJQUFOLEdBQWEsSUFBYjtBQUNBLFVBQU0sS0FBTixHQUFjLGFBQWQ7QUFDQSxVQUFNLEdBQU4sR0FBWSxRQUFaO0FBQ0E7QUFDRDtBQUNELFNBQU8sUUFBUDtBQUNBOztBQUVELFFBQU8sU0FBUDtBQUNDLENBaEVEIiwiZmlsZSI6ImFkanVzdENTUy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4uL2NvcmVcIixcblx0XCIuLi92YXIvcmNzc051bVwiXG5dLCBmdW5jdGlvbiggalF1ZXJ5LCByY3NzTnVtICkge1xuXG5mdW5jdGlvbiBhZGp1c3RDU1MoIGVsZW0sIHByb3AsIHZhbHVlUGFydHMsIHR3ZWVuICkge1xuXHR2YXIgYWRqdXN0ZWQsXG5cdFx0c2NhbGUgPSAxLFxuXHRcdG1heEl0ZXJhdGlvbnMgPSAyMCxcblx0XHRjdXJyZW50VmFsdWUgPSB0d2VlbiA/XG5cdFx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIHR3ZWVuLmN1cigpOyB9IDpcblx0XHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4galF1ZXJ5LmNzcyggZWxlbSwgcHJvcCwgXCJcIiApOyB9LFxuXHRcdGluaXRpYWwgPSBjdXJyZW50VmFsdWUoKSxcblx0XHR1bml0ID0gdmFsdWVQYXJ0cyAmJiB2YWx1ZVBhcnRzWyAzIF0gfHwgKCBqUXVlcnkuY3NzTnVtYmVyWyBwcm9wIF0gPyBcIlwiIDogXCJweFwiICksXG5cblx0XHQvLyBTdGFydGluZyB2YWx1ZSBjb21wdXRhdGlvbiBpcyByZXF1aXJlZCBmb3IgcG90ZW50aWFsIHVuaXQgbWlzbWF0Y2hlc1xuXHRcdGluaXRpYWxJblVuaXQgPSAoIGpRdWVyeS5jc3NOdW1iZXJbIHByb3AgXSB8fCB1bml0ICE9PSBcInB4XCIgJiYgK2luaXRpYWwgKSAmJlxuXHRcdFx0cmNzc051bS5leGVjKCBqUXVlcnkuY3NzKCBlbGVtLCBwcm9wICkgKTtcblxuXHRpZiAoIGluaXRpYWxJblVuaXQgJiYgaW5pdGlhbEluVW5pdFsgMyBdICE9PSB1bml0ICkge1xuXG5cdFx0Ly8gVHJ1c3QgdW5pdHMgcmVwb3J0ZWQgYnkgalF1ZXJ5LmNzc1xuXHRcdHVuaXQgPSB1bml0IHx8IGluaXRpYWxJblVuaXRbIDMgXTtcblxuXHRcdC8vIE1ha2Ugc3VyZSB3ZSB1cGRhdGUgdGhlIHR3ZWVuIHByb3BlcnRpZXMgbGF0ZXIgb25cblx0XHR2YWx1ZVBhcnRzID0gdmFsdWVQYXJ0cyB8fCBbXTtcblxuXHRcdC8vIEl0ZXJhdGl2ZWx5IGFwcHJveGltYXRlIGZyb20gYSBub256ZXJvIHN0YXJ0aW5nIHBvaW50XG5cdFx0aW5pdGlhbEluVW5pdCA9ICtpbml0aWFsIHx8IDE7XG5cblx0XHRkbyB7XG5cblx0XHRcdC8vIElmIHByZXZpb3VzIGl0ZXJhdGlvbiB6ZXJvZWQgb3V0LCBkb3VibGUgdW50aWwgd2UgZ2V0ICpzb21ldGhpbmcqLlxuXHRcdFx0Ly8gVXNlIHN0cmluZyBmb3IgZG91Ymxpbmcgc28gd2UgZG9uJ3QgYWNjaWRlbnRhbGx5IHNlZSBzY2FsZSBhcyB1bmNoYW5nZWQgYmVsb3dcblx0XHRcdHNjYWxlID0gc2NhbGUgfHwgXCIuNVwiO1xuXG5cdFx0XHQvLyBBZGp1c3QgYW5kIGFwcGx5XG5cdFx0XHRpbml0aWFsSW5Vbml0ID0gaW5pdGlhbEluVW5pdCAvIHNjYWxlO1xuXHRcdFx0alF1ZXJ5LnN0eWxlKCBlbGVtLCBwcm9wLCBpbml0aWFsSW5Vbml0ICsgdW5pdCApO1xuXG5cdFx0Ly8gVXBkYXRlIHNjYWxlLCB0b2xlcmF0aW5nIHplcm8gb3IgTmFOIGZyb20gdHdlZW4uY3VyKClcblx0XHQvLyBCcmVhayB0aGUgbG9vcCBpZiBzY2FsZSBpcyB1bmNoYW5nZWQgb3IgcGVyZmVjdCwgb3IgaWYgd2UndmUganVzdCBoYWQgZW5vdWdoLlxuXHRcdH0gd2hpbGUgKFxuXHRcdFx0c2NhbGUgIT09ICggc2NhbGUgPSBjdXJyZW50VmFsdWUoKSAvIGluaXRpYWwgKSAmJiBzY2FsZSAhPT0gMSAmJiAtLW1heEl0ZXJhdGlvbnNcblx0XHQpO1xuXHR9XG5cblx0aWYgKCB2YWx1ZVBhcnRzICkge1xuXHRcdGluaXRpYWxJblVuaXQgPSAraW5pdGlhbEluVW5pdCB8fCAraW5pdGlhbCB8fCAwO1xuXG5cdFx0Ly8gQXBwbHkgcmVsYXRpdmUgb2Zmc2V0ICgrPS8tPSkgaWYgc3BlY2lmaWVkXG5cdFx0YWRqdXN0ZWQgPSB2YWx1ZVBhcnRzWyAxIF0gP1xuXHRcdFx0aW5pdGlhbEluVW5pdCArICggdmFsdWVQYXJ0c1sgMSBdICsgMSApICogdmFsdWVQYXJ0c1sgMiBdIDpcblx0XHRcdCt2YWx1ZVBhcnRzWyAyIF07XG5cdFx0aWYgKCB0d2VlbiApIHtcblx0XHRcdHR3ZWVuLnVuaXQgPSB1bml0O1xuXHRcdFx0dHdlZW4uc3RhcnQgPSBpbml0aWFsSW5Vbml0O1xuXHRcdFx0dHdlZW4uZW5kID0gYWRqdXN0ZWQ7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBhZGp1c3RlZDtcbn1cblxucmV0dXJuIGFkanVzdENTUztcbn0gKTtcbiJdfQ==