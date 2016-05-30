"use strict";

define(["../core"], function (jQuery) {

	function getAll(context, tag) {

		// Support: IE9-11+
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret = typeof context.getElementsByTagName !== "undefined" ? context.getElementsByTagName(tag || "*") : typeof context.querySelectorAll !== "undefined" ? context.querySelectorAll(tag || "*") : [];

		return tag === undefined || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], ret) : ret;
	}

	return getAll;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9tYW5pcHVsYXRpb24vZ2V0QWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxDQUNQLFNBRE8sQ0FBUixFQUVHLFVBQVUsTUFBVixFQUFtQjs7QUFFdEIsVUFBUyxNQUFULENBQWlCLE9BQWpCLEVBQTBCLEdBQTFCLEVBQWdDOzs7O0FBSS9CLE1BQUksTUFBTSxPQUFPLFFBQVEsb0JBQWYsS0FBd0MsV0FBeEMsR0FDUixRQUFRLG9CQUFSLENBQThCLE9BQU8sR0FBckMsQ0FEUSxHQUVSLE9BQU8sUUFBUSxnQkFBZixLQUFvQyxXQUFwQyxHQUNDLFFBQVEsZ0JBQVIsQ0FBMEIsT0FBTyxHQUFqQyxDQURELEdBRUEsRUFKRjs7QUFNQSxTQUFPLFFBQVEsU0FBUixJQUFxQixPQUFPLE9BQU8sUUFBUCxDQUFpQixPQUFqQixFQUEwQixHQUExQixDQUE1QixHQUNOLE9BQU8sS0FBUCxDQUFjLENBQUUsT0FBRixDQUFkLEVBQTJCLEdBQTNCLENBRE0sR0FFTixHQUZEO0FBR0E7O0FBRUQsUUFBTyxNQUFQO0FBQ0MsQ0FwQkQiLCJmaWxlIjoiZ2V0QWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBbXG5cdFwiLi4vY29yZVwiXG5dLCBmdW5jdGlvbiggalF1ZXJ5ICkge1xuXG5mdW5jdGlvbiBnZXRBbGwoIGNvbnRleHQsIHRhZyApIHtcblxuXHQvLyBTdXBwb3J0OiBJRTktMTErXG5cdC8vIFVzZSB0eXBlb2YgdG8gYXZvaWQgemVyby1hcmd1bWVudCBtZXRob2QgaW52b2NhdGlvbiBvbiBob3N0IG9iamVjdHMgKCMxNTE1MSlcblx0dmFyIHJldCA9IHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lICE9PSBcInVuZGVmaW5lZFwiID9cblx0XHRcdGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIHRhZyB8fCBcIipcIiApIDpcblx0XHRcdHR5cGVvZiBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwgIT09IFwidW5kZWZpbmVkXCIgP1xuXHRcdFx0XHRjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIHRhZyB8fCBcIipcIiApIDpcblx0XHRcdFtdO1xuXG5cdHJldHVybiB0YWcgPT09IHVuZGVmaW5lZCB8fCB0YWcgJiYgalF1ZXJ5Lm5vZGVOYW1lKCBjb250ZXh0LCB0YWcgKSA/XG5cdFx0alF1ZXJ5Lm1lcmdlKCBbIGNvbnRleHQgXSwgcmV0ICkgOlxuXHRcdHJldDtcbn1cblxucmV0dXJuIGdldEFsbDtcbn0gKTtcbiJdfQ==