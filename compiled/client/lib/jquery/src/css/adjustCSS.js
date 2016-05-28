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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9jc3MvYWRqdXN0Q1NTLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxDQUNQLFNBRE8sRUFFUCxnQkFGTyxDQUFSLEVBR0csVUFBVSxNQUFWLEVBQWtCLE9BQWxCLEVBQTRCOztBQUUvQixVQUFTLFNBQVQsQ0FBb0IsSUFBcEIsRUFBMEIsSUFBMUIsRUFBZ0MsVUFBaEMsRUFBNEMsS0FBNUMsRUFBb0Q7QUFDbkQsTUFBSSxRQUFKO01BQ0MsUUFBUSxDQUFSO01BQ0EsZ0JBQWdCLEVBQWhCO01BQ0EsZUFBZSxRQUNkLFlBQVc7QUFBRSxVQUFPLE1BQU0sR0FBTixFQUFQLENBQUY7R0FBWCxHQUNBLFlBQVc7QUFBRSxVQUFPLE9BQU8sR0FBUCxDQUFZLElBQVosRUFBa0IsSUFBbEIsRUFBd0IsRUFBeEIsQ0FBUCxDQUFGO0dBQVg7TUFDRCxVQUFVLGNBQVY7TUFDQSxPQUFPLGNBQWMsV0FBWSxDQUFaLENBQWQsS0FBbUMsT0FBTyxTQUFQLENBQWtCLElBQWxCLElBQTJCLEVBQTNCLEdBQWdDLElBQWhDLENBQW5DOzs7O0FBR1Asa0JBQWdCLENBQUUsT0FBTyxTQUFQLENBQWtCLElBQWxCLEtBQTRCLFNBQVMsSUFBVCxJQUFpQixDQUFDLE9BQUQsQ0FBL0MsSUFDZixRQUFRLElBQVIsQ0FBYyxPQUFPLEdBQVAsQ0FBWSxJQUFaLEVBQWtCLElBQWxCLENBQWQsQ0FEZSxDQVhrQzs7QUFjbkQsTUFBSyxpQkFBaUIsY0FBZSxDQUFmLE1BQXVCLElBQXZCLEVBQThCOzs7QUFHbkQsVUFBTyxRQUFRLGNBQWUsQ0FBZixDQUFSOzs7QUFINEMsYUFNbkQsR0FBYSxjQUFjLEVBQWQ7OztBQU5zQyxnQkFTbkQsR0FBZ0IsQ0FBQyxPQUFELElBQVksQ0FBWixDQVRtQzs7QUFXbkQsTUFBRzs7OztBQUlGLFlBQVEsU0FBUyxJQUFUOzs7QUFKTixpQkFPRixHQUFnQixnQkFBZ0IsS0FBaEIsQ0FQZDtBQVFGLFdBQU8sS0FBUCxDQUFjLElBQWQsRUFBb0IsSUFBcEIsRUFBMEIsZ0JBQWdCLElBQWhCLENBQTFCOzs7O0FBUkUsSUFBSCxRQWFDLFdBQVksUUFBUSxpQkFBaUIsT0FBakIsQ0FBcEIsSUFBa0QsVUFBVSxDQUFWLElBQWUsRUFBRSxhQUFGLEVBeEJmO0dBQXBEOztBQTRCQSxNQUFLLFVBQUwsRUFBa0I7QUFDakIsbUJBQWdCLENBQUMsYUFBRCxJQUFrQixDQUFDLE9BQUQsSUFBWSxDQUE5Qjs7O0FBREMsV0FJakIsR0FBVyxXQUFZLENBQVosSUFDVixnQkFBZ0IsQ0FBRSxXQUFZLENBQVosSUFBa0IsQ0FBbEIsQ0FBRixHQUEwQixXQUFZLENBQVosQ0FBMUIsR0FDaEIsQ0FBQyxXQUFZLENBQVosQ0FBRCxDQU5nQjtBQU9qQixPQUFLLEtBQUwsRUFBYTtBQUNaLFVBQU0sSUFBTixHQUFhLElBQWIsQ0FEWTtBQUVaLFVBQU0sS0FBTixHQUFjLGFBQWQsQ0FGWTtBQUdaLFVBQU0sR0FBTixHQUFZLFFBQVosQ0FIWTtJQUFiO0dBUEQ7QUFhQSxTQUFPLFFBQVAsQ0F2RG1EO0VBQXBEOztBQTBEQSxRQUFPLFNBQVAsQ0E1RCtCO0NBQTVCLENBSEgiLCJmaWxlIjoiYWRqdXN0Q1NTLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBbXG5cdFwiLi4vY29yZVwiLFxuXHRcIi4uL3Zhci9yY3NzTnVtXCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIHJjc3NOdW0gKSB7XG5cbmZ1bmN0aW9uIGFkanVzdENTUyggZWxlbSwgcHJvcCwgdmFsdWVQYXJ0cywgdHdlZW4gKSB7XG5cdHZhciBhZGp1c3RlZCxcblx0XHRzY2FsZSA9IDEsXG5cdFx0bWF4SXRlcmF0aW9ucyA9IDIwLFxuXHRcdGN1cnJlbnRWYWx1ZSA9IHR3ZWVuID9cblx0XHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gdHdlZW4uY3VyKCk7IH0gOlxuXHRcdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBqUXVlcnkuY3NzKCBlbGVtLCBwcm9wLCBcIlwiICk7IH0sXG5cdFx0aW5pdGlhbCA9IGN1cnJlbnRWYWx1ZSgpLFxuXHRcdHVuaXQgPSB2YWx1ZVBhcnRzICYmIHZhbHVlUGFydHNbIDMgXSB8fCAoIGpRdWVyeS5jc3NOdW1iZXJbIHByb3AgXSA/IFwiXCIgOiBcInB4XCIgKSxcblxuXHRcdC8vIFN0YXJ0aW5nIHZhbHVlIGNvbXB1dGF0aW9uIGlzIHJlcXVpcmVkIGZvciBwb3RlbnRpYWwgdW5pdCBtaXNtYXRjaGVzXG5cdFx0aW5pdGlhbEluVW5pdCA9ICggalF1ZXJ5LmNzc051bWJlclsgcHJvcCBdIHx8IHVuaXQgIT09IFwicHhcIiAmJiAraW5pdGlhbCApICYmXG5cdFx0XHRyY3NzTnVtLmV4ZWMoIGpRdWVyeS5jc3MoIGVsZW0sIHByb3AgKSApO1xuXG5cdGlmICggaW5pdGlhbEluVW5pdCAmJiBpbml0aWFsSW5Vbml0WyAzIF0gIT09IHVuaXQgKSB7XG5cblx0XHQvLyBUcnVzdCB1bml0cyByZXBvcnRlZCBieSBqUXVlcnkuY3NzXG5cdFx0dW5pdCA9IHVuaXQgfHwgaW5pdGlhbEluVW5pdFsgMyBdO1xuXG5cdFx0Ly8gTWFrZSBzdXJlIHdlIHVwZGF0ZSB0aGUgdHdlZW4gcHJvcGVydGllcyBsYXRlciBvblxuXHRcdHZhbHVlUGFydHMgPSB2YWx1ZVBhcnRzIHx8IFtdO1xuXG5cdFx0Ly8gSXRlcmF0aXZlbHkgYXBwcm94aW1hdGUgZnJvbSBhIG5vbnplcm8gc3RhcnRpbmcgcG9pbnRcblx0XHRpbml0aWFsSW5Vbml0ID0gK2luaXRpYWwgfHwgMTtcblxuXHRcdGRvIHtcblxuXHRcdFx0Ly8gSWYgcHJldmlvdXMgaXRlcmF0aW9uIHplcm9lZCBvdXQsIGRvdWJsZSB1bnRpbCB3ZSBnZXQgKnNvbWV0aGluZyouXG5cdFx0XHQvLyBVc2Ugc3RyaW5nIGZvciBkb3VibGluZyBzbyB3ZSBkb24ndCBhY2NpZGVudGFsbHkgc2VlIHNjYWxlIGFzIHVuY2hhbmdlZCBiZWxvd1xuXHRcdFx0c2NhbGUgPSBzY2FsZSB8fCBcIi41XCI7XG5cblx0XHRcdC8vIEFkanVzdCBhbmQgYXBwbHlcblx0XHRcdGluaXRpYWxJblVuaXQgPSBpbml0aWFsSW5Vbml0IC8gc2NhbGU7XG5cdFx0XHRqUXVlcnkuc3R5bGUoIGVsZW0sIHByb3AsIGluaXRpYWxJblVuaXQgKyB1bml0ICk7XG5cblx0XHQvLyBVcGRhdGUgc2NhbGUsIHRvbGVyYXRpbmcgemVybyBvciBOYU4gZnJvbSB0d2Vlbi5jdXIoKVxuXHRcdC8vIEJyZWFrIHRoZSBsb29wIGlmIHNjYWxlIGlzIHVuY2hhbmdlZCBvciBwZXJmZWN0LCBvciBpZiB3ZSd2ZSBqdXN0IGhhZCBlbm91Z2guXG5cdFx0fSB3aGlsZSAoXG5cdFx0XHRzY2FsZSAhPT0gKCBzY2FsZSA9IGN1cnJlbnRWYWx1ZSgpIC8gaW5pdGlhbCApICYmIHNjYWxlICE9PSAxICYmIC0tbWF4SXRlcmF0aW9uc1xuXHRcdCk7XG5cdH1cblxuXHRpZiAoIHZhbHVlUGFydHMgKSB7XG5cdFx0aW5pdGlhbEluVW5pdCA9ICtpbml0aWFsSW5Vbml0IHx8ICtpbml0aWFsIHx8IDA7XG5cblx0XHQvLyBBcHBseSByZWxhdGl2ZSBvZmZzZXQgKCs9Ly09KSBpZiBzcGVjaWZpZWRcblx0XHRhZGp1c3RlZCA9IHZhbHVlUGFydHNbIDEgXSA/XG5cdFx0XHRpbml0aWFsSW5Vbml0ICsgKCB2YWx1ZVBhcnRzWyAxIF0gKyAxICkgKiB2YWx1ZVBhcnRzWyAyIF0gOlxuXHRcdFx0K3ZhbHVlUGFydHNbIDIgXTtcblx0XHRpZiAoIHR3ZWVuICkge1xuXHRcdFx0dHdlZW4udW5pdCA9IHVuaXQ7XG5cdFx0XHR0d2Vlbi5zdGFydCA9IGluaXRpYWxJblVuaXQ7XG5cdFx0XHR0d2Vlbi5lbmQgPSBhZGp1c3RlZDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGFkanVzdGVkO1xufVxuXG5yZXR1cm4gYWRqdXN0Q1NTO1xufSApO1xuIl19