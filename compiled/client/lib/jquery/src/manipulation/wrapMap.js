"use strict";

define(function () {

	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {

		// Support: IE9
		option: [1, "<select multiple='multiple'>", "</select>"],

		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [1, "<table>", "</table>"],
		col: [2, "<table><colgroup>", "</colgroup></table>"],
		tr: [2, "<table><tbody>", "</tbody></table>"],
		td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

		_default: [0, "", ""]
	};

	// Support: IE9
	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	return wrapMap;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9tYW5pcHVsYXRpb24vd3JhcE1hcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQVEsWUFBVzs7O0FBR25CLEtBQUksVUFBVTs7O0FBR2IsVUFBUSxDQUFFLENBQUYsRUFBSyw4QkFBTCxFQUFxQyxXQUFyQyxDQUFSOzs7OztBQUtBLFNBQU8sQ0FBRSxDQUFGLEVBQUssU0FBTCxFQUFnQixVQUFoQixDQUFQO0FBQ0EsT0FBSyxDQUFFLENBQUYsRUFBSyxtQkFBTCxFQUEwQixxQkFBMUIsQ0FBTDtBQUNBLE1BQUksQ0FBRSxDQUFGLEVBQUssZ0JBQUwsRUFBdUIsa0JBQXZCLENBQUo7QUFDQSxNQUFJLENBQUUsQ0FBRixFQUFLLG9CQUFMLEVBQTJCLHVCQUEzQixDQUFKOztBQUVBLFlBQVUsQ0FBRSxDQUFGLEVBQUssRUFBTCxFQUFTLEVBQVQsQ0FBVjtFQWJHOzs7QUFIZSxRQW9CbkIsQ0FBUSxRQUFSLEdBQW1CLFFBQVEsTUFBUixDQXBCQTs7QUFzQm5CLFNBQVEsS0FBUixHQUFnQixRQUFRLEtBQVIsR0FBZ0IsUUFBUSxRQUFSLEdBQW1CLFFBQVEsT0FBUixHQUFrQixRQUFRLEtBQVIsQ0F0QmxEO0FBdUJuQixTQUFRLEVBQVIsR0FBYSxRQUFRLEVBQVIsQ0F2Qk07O0FBeUJuQixRQUFPLE9BQVAsQ0F6Qm1CO0NBQVgsQ0FBUiIsImZpbGUiOiJ3cmFwTWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBmdW5jdGlvbigpIHtcblxuLy8gV2UgaGF2ZSB0byBjbG9zZSB0aGVzZSB0YWdzIHRvIHN1cHBvcnQgWEhUTUwgKCMxMzIwMClcbnZhciB3cmFwTWFwID0ge1xuXG5cdC8vIFN1cHBvcnQ6IElFOVxuXHRvcHRpb246IFsgMSwgXCI8c2VsZWN0IG11bHRpcGxlPSdtdWx0aXBsZSc+XCIsIFwiPC9zZWxlY3Q+XCIgXSxcblxuXHQvLyBYSFRNTCBwYXJzZXJzIGRvIG5vdCBtYWdpY2FsbHkgaW5zZXJ0IGVsZW1lbnRzIGluIHRoZVxuXHQvLyBzYW1lIHdheSB0aGF0IHRhZyBzb3VwIHBhcnNlcnMgZG8uIFNvIHdlIGNhbm5vdCBzaG9ydGVuXG5cdC8vIHRoaXMgYnkgb21pdHRpbmcgPHRib2R5PiBvciBvdGhlciByZXF1aXJlZCBlbGVtZW50cy5cblx0dGhlYWQ6IFsgMSwgXCI8dGFibGU+XCIsIFwiPC90YWJsZT5cIiBdLFxuXHRjb2w6IFsgMiwgXCI8dGFibGU+PGNvbGdyb3VwPlwiLCBcIjwvY29sZ3JvdXA+PC90YWJsZT5cIiBdLFxuXHR0cjogWyAyLCBcIjx0YWJsZT48dGJvZHk+XCIsIFwiPC90Ym9keT48L3RhYmxlPlwiIF0sXG5cdHRkOiBbIDMsIFwiPHRhYmxlPjx0Ym9keT48dHI+XCIsIFwiPC90cj48L3Rib2R5PjwvdGFibGU+XCIgXSxcblxuXHRfZGVmYXVsdDogWyAwLCBcIlwiLCBcIlwiIF1cbn07XG5cbi8vIFN1cHBvcnQ6IElFOVxud3JhcE1hcC5vcHRncm91cCA9IHdyYXBNYXAub3B0aW9uO1xuXG53cmFwTWFwLnRib2R5ID0gd3JhcE1hcC50Zm9vdCA9IHdyYXBNYXAuY29sZ3JvdXAgPSB3cmFwTWFwLmNhcHRpb24gPSB3cmFwTWFwLnRoZWFkO1xud3JhcE1hcC50aCA9IHdyYXBNYXAudGQ7XG5cbnJldHVybiB3cmFwTWFwO1xufSApO1xuIl19