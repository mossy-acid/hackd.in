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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9tYW5pcHVsYXRpb24vd3JhcE1hcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQVEsWUFBVzs7O0FBR25CLEtBQUksVUFBVTs7O0FBR2IsVUFBUSxDQUFFLENBQUYsRUFBSyw4QkFBTCxFQUFxQyxXQUFyQyxDQUhLOzs7OztBQVFiLFNBQU8sQ0FBRSxDQUFGLEVBQUssU0FBTCxFQUFnQixVQUFoQixDQVJNO0FBU2IsT0FBSyxDQUFFLENBQUYsRUFBSyxtQkFBTCxFQUEwQixxQkFBMUIsQ0FUUTtBQVViLE1BQUksQ0FBRSxDQUFGLEVBQUssZ0JBQUwsRUFBdUIsa0JBQXZCLENBVlM7QUFXYixNQUFJLENBQUUsQ0FBRixFQUFLLG9CQUFMLEVBQTJCLHVCQUEzQixDQVhTOztBQWFiLFlBQVUsQ0FBRSxDQUFGLEVBQUssRUFBTCxFQUFTLEVBQVQ7QUFiRyxFQUFkOzs7QUFpQkEsU0FBUSxRQUFSLEdBQW1CLFFBQVEsTUFBM0I7O0FBRUEsU0FBUSxLQUFSLEdBQWdCLFFBQVEsS0FBUixHQUFnQixRQUFRLFFBQVIsR0FBbUIsUUFBUSxPQUFSLEdBQWtCLFFBQVEsS0FBN0U7QUFDQSxTQUFRLEVBQVIsR0FBYSxRQUFRLEVBQXJCOztBQUVBLFFBQU8sT0FBUDtBQUNDLENBMUJEIiwiZmlsZSI6IndyYXBNYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIGZ1bmN0aW9uKCkge1xuXG4vLyBXZSBoYXZlIHRvIGNsb3NlIHRoZXNlIHRhZ3MgdG8gc3VwcG9ydCBYSFRNTCAoIzEzMjAwKVxudmFyIHdyYXBNYXAgPSB7XG5cblx0Ly8gU3VwcG9ydDogSUU5XG5cdG9wdGlvbjogWyAxLCBcIjxzZWxlY3QgbXVsdGlwbGU9J211bHRpcGxlJz5cIiwgXCI8L3NlbGVjdD5cIiBdLFxuXG5cdC8vIFhIVE1MIHBhcnNlcnMgZG8gbm90IG1hZ2ljYWxseSBpbnNlcnQgZWxlbWVudHMgaW4gdGhlXG5cdC8vIHNhbWUgd2F5IHRoYXQgdGFnIHNvdXAgcGFyc2VycyBkby4gU28gd2UgY2Fubm90IHNob3J0ZW5cblx0Ly8gdGhpcyBieSBvbWl0dGluZyA8dGJvZHk+IG9yIG90aGVyIHJlcXVpcmVkIGVsZW1lbnRzLlxuXHR0aGVhZDogWyAxLCBcIjx0YWJsZT5cIiwgXCI8L3RhYmxlPlwiIF0sXG5cdGNvbDogWyAyLCBcIjx0YWJsZT48Y29sZ3JvdXA+XCIsIFwiPC9jb2xncm91cD48L3RhYmxlPlwiIF0sXG5cdHRyOiBbIDIsIFwiPHRhYmxlPjx0Ym9keT5cIiwgXCI8L3Rib2R5PjwvdGFibGU+XCIgXSxcblx0dGQ6IFsgMywgXCI8dGFibGU+PHRib2R5Pjx0cj5cIiwgXCI8L3RyPjwvdGJvZHk+PC90YWJsZT5cIiBdLFxuXG5cdF9kZWZhdWx0OiBbIDAsIFwiXCIsIFwiXCIgXVxufTtcblxuLy8gU3VwcG9ydDogSUU5XG53cmFwTWFwLm9wdGdyb3VwID0gd3JhcE1hcC5vcHRpb247XG5cbndyYXBNYXAudGJvZHkgPSB3cmFwTWFwLnRmb290ID0gd3JhcE1hcC5jb2xncm91cCA9IHdyYXBNYXAuY2FwdGlvbiA9IHdyYXBNYXAudGhlYWQ7XG53cmFwTWFwLnRoID0gd3JhcE1hcC50ZDtcblxucmV0dXJuIHdyYXBNYXA7XG59ICk7XG4iXX0=