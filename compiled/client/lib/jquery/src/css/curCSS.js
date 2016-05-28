"use strict";

define(["../core", "./var/rnumnonpx", "./var/rmargin", "./var/getStyles", "./support", "../selector" // Get jQuery.contains
], function (jQuery, rnumnonpx, rmargin, getStyles, support) {

	function curCSS(elem, name, computed) {
		var width,
		    minWidth,
		    maxWidth,
		    ret,
		    style = elem.style;

		computed = computed || getStyles(elem);
		ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined;

		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ((ret === "" || ret === undefined) && !jQuery.contains(elem.ownerDocument, elem)) {
			ret = jQuery.style(elem, name);
		}

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') (#12537)
		if (computed) {

			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if (!support.pixelMarginRight() && rnumnonpx.test(ret) && rmargin.test(name)) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret !== undefined ?

		// Support: IE9-11+
		// IE returns zIndex value as an integer.
		ret + "" : ret;
	}

	return curCSS;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9jc3MvY3VyQ1NTLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxDQUNQLFNBRE8sRUFFUCxpQkFGTyxFQUdQLGVBSE8sRUFJUCxpQkFKTyxFQUtQLFdBTE8sRUFNUDtBQU5PLENBQVIsRUFPRyxVQUFVLE1BQVYsRUFBa0IsU0FBbEIsRUFBNkIsT0FBN0IsRUFBc0MsU0FBdEMsRUFBaUQsT0FBakQsRUFBMkQ7O0FBRTlELFVBQVMsTUFBVCxDQUFpQixJQUFqQixFQUF1QixJQUF2QixFQUE2QixRQUE3QixFQUF3QztBQUN2QyxNQUFJLEtBQUo7TUFBVyxRQUFYO01BQXFCLFFBQXJCO01BQStCLEdBQS9CO01BQ0MsUUFBUSxLQUFLLEtBQUwsQ0FGOEI7O0FBSXZDLGFBQVcsWUFBWSxVQUFXLElBQVgsQ0FBWixDQUo0QjtBQUt2QyxRQUFNLFdBQVcsU0FBUyxnQkFBVCxDQUEyQixJQUEzQixLQUFxQyxTQUFVLElBQVYsQ0FBckMsR0FBd0QsU0FBbkU7Ozs7O0FBTGlDLE1BVWxDLENBQUUsUUFBUSxFQUFSLElBQWMsUUFBUSxTQUFSLENBQWhCLElBQXVDLENBQUMsT0FBTyxRQUFQLENBQWlCLEtBQUssYUFBTCxFQUFvQixJQUFyQyxDQUFELEVBQStDO0FBQzFGLFNBQU0sT0FBTyxLQUFQLENBQWMsSUFBZCxFQUFvQixJQUFwQixDQUFOLENBRDBGO0dBQTNGOzs7O0FBVnVDLE1BZ0JsQyxRQUFMLEVBQWdCOzs7Ozs7O0FBT2YsT0FBSyxDQUFDLFFBQVEsZ0JBQVIsRUFBRCxJQUErQixVQUFVLElBQVYsQ0FBZ0IsR0FBaEIsQ0FBL0IsSUFBd0QsUUFBUSxJQUFSLENBQWMsSUFBZCxDQUF4RCxFQUErRTs7O0FBR25GLFlBQVEsTUFBTSxLQUFOLENBSDJFO0FBSW5GLGVBQVcsTUFBTSxRQUFOLENBSndFO0FBS25GLGVBQVcsTUFBTSxRQUFOOzs7QUFMd0UsU0FRbkYsQ0FBTSxRQUFOLEdBQWlCLE1BQU0sUUFBTixHQUFpQixNQUFNLEtBQU4sR0FBYyxHQUFkLENBUmlEO0FBU25GLFVBQU0sU0FBUyxLQUFUOzs7QUFUNkUsU0FZbkYsQ0FBTSxLQUFOLEdBQWMsS0FBZCxDQVptRjtBQWFuRixVQUFNLFFBQU4sR0FBaUIsUUFBakIsQ0FibUY7QUFjbkYsVUFBTSxRQUFOLEdBQWlCLFFBQWpCLENBZG1GO0lBQXBGO0dBUEQ7O0FBeUJBLFNBQU8sUUFBUSxTQUFSOzs7O0FBSU4sUUFBTSxFQUFOLEdBQ0EsR0FMTSxDQXpDZ0M7RUFBeEM7O0FBaURBLFFBQU8sTUFBUCxDQW5EOEQ7Q0FBM0QsQ0FQSCIsImZpbGUiOiJjdXJDU1MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuLi9jb3JlXCIsXG5cdFwiLi92YXIvcm51bW5vbnB4XCIsXG5cdFwiLi92YXIvcm1hcmdpblwiLFxuXHRcIi4vdmFyL2dldFN0eWxlc1wiLFxuXHRcIi4vc3VwcG9ydFwiLFxuXHRcIi4uL3NlbGVjdG9yXCIgLy8gR2V0IGpRdWVyeS5jb250YWluc1xuXSwgZnVuY3Rpb24oIGpRdWVyeSwgcm51bW5vbnB4LCBybWFyZ2luLCBnZXRTdHlsZXMsIHN1cHBvcnQgKSB7XG5cbmZ1bmN0aW9uIGN1ckNTUyggZWxlbSwgbmFtZSwgY29tcHV0ZWQgKSB7XG5cdHZhciB3aWR0aCwgbWluV2lkdGgsIG1heFdpZHRoLCByZXQsXG5cdFx0c3R5bGUgPSBlbGVtLnN0eWxlO1xuXG5cdGNvbXB1dGVkID0gY29tcHV0ZWQgfHwgZ2V0U3R5bGVzKCBlbGVtICk7XG5cdHJldCA9IGNvbXB1dGVkID8gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSggbmFtZSApIHx8IGNvbXB1dGVkWyBuYW1lIF0gOiB1bmRlZmluZWQ7XG5cblx0Ly8gU3VwcG9ydDogT3BlcmEgMTIuMXggb25seVxuXHQvLyBGYWxsIGJhY2sgdG8gc3R5bGUgZXZlbiB3aXRob3V0IGNvbXB1dGVkXG5cdC8vIGNvbXB1dGVkIGlzIHVuZGVmaW5lZCBmb3IgZWxlbXMgb24gZG9jdW1lbnQgZnJhZ21lbnRzXG5cdGlmICggKCByZXQgPT09IFwiXCIgfHwgcmV0ID09PSB1bmRlZmluZWQgKSAmJiAhalF1ZXJ5LmNvbnRhaW5zKCBlbGVtLm93bmVyRG9jdW1lbnQsIGVsZW0gKSApIHtcblx0XHRyZXQgPSBqUXVlcnkuc3R5bGUoIGVsZW0sIG5hbWUgKTtcblx0fVxuXG5cdC8vIFN1cHBvcnQ6IElFOVxuXHQvLyBnZXRQcm9wZXJ0eVZhbHVlIGlzIG9ubHkgbmVlZGVkIGZvciAuY3NzKCdmaWx0ZXInKSAoIzEyNTM3KVxuXHRpZiAoIGNvbXB1dGVkICkge1xuXG5cdFx0Ly8gQSB0cmlidXRlIHRvIHRoZSBcImF3ZXNvbWUgaGFjayBieSBEZWFuIEVkd2FyZHNcIlxuXHRcdC8vIEFuZHJvaWQgQnJvd3NlciByZXR1cm5zIHBlcmNlbnRhZ2UgZm9yIHNvbWUgdmFsdWVzLFxuXHRcdC8vIGJ1dCB3aWR0aCBzZWVtcyB0byBiZSByZWxpYWJseSBwaXhlbHMuXG5cdFx0Ly8gVGhpcyBpcyBhZ2FpbnN0IHRoZSBDU1NPTSBkcmFmdCBzcGVjOlxuXHRcdC8vIGh0dHA6Ly9kZXYudzMub3JnL2Nzc3dnL2Nzc29tLyNyZXNvbHZlZC12YWx1ZXNcblx0XHRpZiAoICFzdXBwb3J0LnBpeGVsTWFyZ2luUmlnaHQoKSAmJiBybnVtbm9ucHgudGVzdCggcmV0ICkgJiYgcm1hcmdpbi50ZXN0KCBuYW1lICkgKSB7XG5cblx0XHRcdC8vIFJlbWVtYmVyIHRoZSBvcmlnaW5hbCB2YWx1ZXNcblx0XHRcdHdpZHRoID0gc3R5bGUud2lkdGg7XG5cdFx0XHRtaW5XaWR0aCA9IHN0eWxlLm1pbldpZHRoO1xuXHRcdFx0bWF4V2lkdGggPSBzdHlsZS5tYXhXaWR0aDtcblxuXHRcdFx0Ly8gUHV0IGluIHRoZSBuZXcgdmFsdWVzIHRvIGdldCBhIGNvbXB1dGVkIHZhbHVlIG91dFxuXHRcdFx0c3R5bGUubWluV2lkdGggPSBzdHlsZS5tYXhXaWR0aCA9IHN0eWxlLndpZHRoID0gcmV0O1xuXHRcdFx0cmV0ID0gY29tcHV0ZWQud2lkdGg7XG5cblx0XHRcdC8vIFJldmVydCB0aGUgY2hhbmdlZCB2YWx1ZXNcblx0XHRcdHN0eWxlLndpZHRoID0gd2lkdGg7XG5cdFx0XHRzdHlsZS5taW5XaWR0aCA9IG1pbldpZHRoO1xuXHRcdFx0c3R5bGUubWF4V2lkdGggPSBtYXhXaWR0aDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmV0ICE9PSB1bmRlZmluZWQgP1xuXG5cdFx0Ly8gU3VwcG9ydDogSUU5LTExK1xuXHRcdC8vIElFIHJldHVybnMgekluZGV4IHZhbHVlIGFzIGFuIGludGVnZXIuXG5cdFx0cmV0ICsgXCJcIiA6XG5cdFx0cmV0O1xufVxuXG5yZXR1cm4gY3VyQ1NTO1xufSApO1xuIl19