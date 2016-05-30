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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9jc3Mvc2hvd0hpZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1Asc0JBRE8sQ0FBUixFQUVHLFVBQVUsUUFBVixFQUFxQjs7QUFFeEIsVUFBUyxRQUFULENBQW1CLFFBQW5CLEVBQTZCLElBQTdCLEVBQW9DO0FBQ25DLE1BQUksT0FBSjtNQUFhLElBQWI7TUFDQyxTQUFTLEVBQVQ7TUFDQSxRQUFRLENBQVI7TUFDQSxTQUFTLFNBQVMsTUFBVDs7O0FBSnlCLFNBTzNCLFFBQVEsTUFBUixFQUFnQixPQUF4QixFQUFrQztBQUNqQyxVQUFPLFNBQVUsS0FBVixDQUFQLENBRGlDO0FBRWpDLE9BQUssQ0FBQyxLQUFLLEtBQUwsRUFBYTtBQUNsQixhQURrQjtJQUFuQjs7QUFJQSxhQUFVLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FOdUI7QUFPakMsT0FBSyxJQUFMLEVBQVk7QUFDWCxRQUFLLFlBQVksTUFBWixFQUFxQjs7O0FBR3pCLFlBQVEsS0FBUixJQUFrQixTQUFTLEdBQVQsQ0FBYyxJQUFkLEVBQW9CLFNBQXBCLEtBQW1DLEVBQW5DLENBSE87S0FBMUI7SUFERCxNQU1PO0FBQ04sUUFBSyxZQUFZLE1BQVosRUFBcUI7QUFDekIsWUFBUSxLQUFSLElBQWtCLE1BQWxCOzs7QUFEeUIsYUFJekIsQ0FBUyxHQUFULENBQWMsSUFBZCxFQUFvQixTQUFwQixFQUErQixPQUEvQixFQUp5QjtLQUExQjtJQVBEO0dBUEQ7Ozs7QUFQbUMsT0FnQzdCLFFBQVEsQ0FBUixFQUFXLFFBQVEsTUFBUixFQUFnQixPQUFqQyxFQUEyQztBQUMxQyxPQUFLLE9BQVEsS0FBUixLQUFtQixJQUFuQixFQUEwQjtBQUM5QixhQUFVLEtBQVYsRUFBa0IsS0FBbEIsQ0FBd0IsT0FBeEIsR0FBa0MsT0FBUSxLQUFSLENBQWxDLENBRDhCO0lBQS9CO0dBREQ7O0FBTUEsU0FBTyxRQUFQLENBdENtQztFQUFwQzs7QUF5Q0EsUUFBTyxRQUFQLENBM0N3QjtDQUFyQixDQUZIIiwiZmlsZSI6InNob3dIaWRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBbXG5cdFwiLi4vZGF0YS92YXIvZGF0YVByaXZcIlxuXSwgZnVuY3Rpb24oIGRhdGFQcml2ICkge1xuXG5mdW5jdGlvbiBzaG93SGlkZSggZWxlbWVudHMsIHNob3cgKSB7XG5cdHZhciBkaXNwbGF5LCBlbGVtLFxuXHRcdHZhbHVlcyA9IFtdLFxuXHRcdGluZGV4ID0gMCxcblx0XHRsZW5ndGggPSBlbGVtZW50cy5sZW5ndGg7XG5cblx0Ly8gRGV0ZXJtaW5lIG5ldyBkaXNwbGF5IHZhbHVlIGZvciBlbGVtZW50cyB0aGF0IG5lZWQgdG8gY2hhbmdlXG5cdGZvciAoIDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KysgKSB7XG5cdFx0ZWxlbSA9IGVsZW1lbnRzWyBpbmRleCBdO1xuXHRcdGlmICggIWVsZW0uc3R5bGUgKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRkaXNwbGF5ID0gZWxlbS5zdHlsZS5kaXNwbGF5O1xuXHRcdGlmICggc2hvdyApIHtcblx0XHRcdGlmICggZGlzcGxheSA9PT0gXCJub25lXCIgKSB7XG5cblx0XHRcdFx0Ly8gUmVzdG9yZSBhIHByZS1oaWRlKCkgdmFsdWUgaWYgd2UgaGF2ZSBvbmVcblx0XHRcdFx0dmFsdWVzWyBpbmRleCBdID0gZGF0YVByaXYuZ2V0KCBlbGVtLCBcImRpc3BsYXlcIiApIHx8IFwiXCI7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICggZGlzcGxheSAhPT0gXCJub25lXCIgKSB7XG5cdFx0XHRcdHZhbHVlc1sgaW5kZXggXSA9IFwibm9uZVwiO1xuXG5cdFx0XHRcdC8vIFJlbWVtYmVyIHRoZSB2YWx1ZSB3ZSdyZSByZXBsYWNpbmdcblx0XHRcdFx0ZGF0YVByaXYuc2V0KCBlbGVtLCBcImRpc3BsYXlcIiwgZGlzcGxheSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFNldCB0aGUgZGlzcGxheSBvZiB0aGUgZWxlbWVudHMgaW4gYSBzZWNvbmQgbG9vcFxuXHQvLyB0byBhdm9pZCB0aGUgY29uc3RhbnQgcmVmbG93XG5cdGZvciAoIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KysgKSB7XG5cdFx0aWYgKCB2YWx1ZXNbIGluZGV4IF0gIT0gbnVsbCApIHtcblx0XHRcdGVsZW1lbnRzWyBpbmRleCBdLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZXNbIGluZGV4IF07XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGVsZW1lbnRzO1xufVxuXG5yZXR1cm4gc2hvd0hpZGU7XG5cbn0gKTtcbiJdfQ==