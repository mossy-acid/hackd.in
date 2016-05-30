"use strict";

define(["../core", "../var/document", "../manipulation" // appendTo
], function (jQuery, document) {

	var iframe,
	    elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

	/**
  * Retrieve the actual display of a element
  * @param {String} name nodeName of the element
  * @param {Object} doc Document object
  */

	// Called only from within defaultDisplay
	function actualDisplay(name, doc) {
		var elem = jQuery(doc.createElement(name)).appendTo(doc.body),
		    display = jQuery.css(elem[0], "display");

		// We don't have any data stored on the element,
		// so use "detach" method as fast way to get rid of the element
		elem.detach();

		return display;
	}

	/**
  * Try to determine the default display value of an element
  * @param {String} nodeName
  */
	function defaultDisplay(nodeName) {
		var doc = document,
		    display = elemdisplay[nodeName];

		if (!display) {
			display = actualDisplay(nodeName, doc);

			// If the simple way fails, read from inside an iframe
			if (display === "none" || !display) {

				// Use the already-created iframe if possible
				iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement);

				// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
				doc = iframe[0].contentDocument;

				// Support: IE
				doc.write();
				doc.close();

				display = actualDisplay(nodeName, doc);
				iframe.detach();
			}

			// Store the correct default display
			elemdisplay[nodeName] = display;
		}

		return display;
	}

	return defaultDisplay;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9jc3MvZGVmYXVsdERpc3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1AsU0FETyxFQUVQLGlCQUZPLEVBR1A7QUFITyxDQUFSLEVBSUcsVUFBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTZCOztBQUVoQyxLQUFJLE1BQUo7S0FDQyxjQUFjOzs7O0FBSWIsUUFBTSxPQUFOO0FBQ0EsUUFBTSxPQUFOO0VBTEQ7Ozs7Ozs7OztBQUgrQixVQWtCdkIsYUFBVCxDQUF3QixJQUF4QixFQUE4QixHQUE5QixFQUFvQztBQUNuQyxNQUFJLE9BQU8sT0FBUSxJQUFJLGFBQUosQ0FBbUIsSUFBbkIsQ0FBUixFQUFvQyxRQUFwQyxDQUE4QyxJQUFJLElBQUosQ0FBckQ7TUFFSCxVQUFVLE9BQU8sR0FBUCxDQUFZLEtBQU0sQ0FBTixDQUFaLEVBQXVCLFNBQXZCLENBQVY7Ozs7QUFIa0MsTUFPbkMsQ0FBSyxNQUFMLEdBUG1DOztBQVNuQyxTQUFPLE9BQVAsQ0FUbUM7RUFBcEM7Ozs7OztBQWxCZ0MsVUFrQ3ZCLGNBQVQsQ0FBeUIsUUFBekIsRUFBb0M7QUFDbkMsTUFBSSxNQUFNLFFBQU47TUFDSCxVQUFVLFlBQWEsUUFBYixDQUFWLENBRmtDOztBQUluQyxNQUFLLENBQUMsT0FBRCxFQUFXO0FBQ2YsYUFBVSxjQUFlLFFBQWYsRUFBeUIsR0FBekIsQ0FBVjs7O0FBRGUsT0FJVixZQUFZLE1BQVosSUFBc0IsQ0FBQyxPQUFELEVBQVc7OztBQUdyQyxhQUFTLENBQUUsVUFBVSxPQUFRLGdEQUFSLENBQVYsQ0FBRixDQUNQLFFBRE8sQ0FDRyxJQUFJLGVBQUosQ0FEWjs7O0FBSHFDLE9BT3JDLEdBQU0sT0FBUSxDQUFSLEVBQVksZUFBWjs7O0FBUCtCLE9BVXJDLENBQUksS0FBSixHQVZxQztBQVdyQyxRQUFJLEtBQUosR0FYcUM7O0FBYXJDLGNBQVUsY0FBZSxRQUFmLEVBQXlCLEdBQXpCLENBQVYsQ0FicUM7QUFjckMsV0FBTyxNQUFQLEdBZHFDO0lBQXRDOzs7QUFKZSxjQXNCZixDQUFhLFFBQWIsSUFBMEIsT0FBMUIsQ0F0QmU7R0FBaEI7O0FBeUJBLFNBQU8sT0FBUCxDQTdCbUM7RUFBcEM7O0FBZ0NBLFFBQU8sY0FBUCxDQWxFZ0M7Q0FBN0IsQ0FKSCIsImZpbGUiOiJkZWZhdWx0RGlzcGxheS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4uL2NvcmVcIixcblx0XCIuLi92YXIvZG9jdW1lbnRcIixcblx0XCIuLi9tYW5pcHVsYXRpb25cIiAvLyBhcHBlbmRUb1xuXSwgZnVuY3Rpb24oIGpRdWVyeSwgZG9jdW1lbnQgKSB7XG5cbnZhciBpZnJhbWUsXG5cdGVsZW1kaXNwbGF5ID0ge1xuXG5cdFx0Ly8gU3VwcG9ydDogRmlyZWZveFxuXHRcdC8vIFdlIGhhdmUgdG8gcHJlLWRlZmluZSB0aGVzZSB2YWx1ZXMgZm9yIEZGICgjMTAyMjcpXG5cdFx0SFRNTDogXCJibG9ja1wiLFxuXHRcdEJPRFk6IFwiYmxvY2tcIlxuXHR9O1xuXG4vKipcbiAqIFJldHJpZXZlIHRoZSBhY3R1YWwgZGlzcGxheSBvZiBhIGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5vZGVOYW1lIG9mIHRoZSBlbGVtZW50XG4gKiBAcGFyYW0ge09iamVjdH0gZG9jIERvY3VtZW50IG9iamVjdFxuICovXG5cbi8vIENhbGxlZCBvbmx5IGZyb20gd2l0aGluIGRlZmF1bHREaXNwbGF5XG5mdW5jdGlvbiBhY3R1YWxEaXNwbGF5KCBuYW1lLCBkb2MgKSB7XG5cdHZhciBlbGVtID0galF1ZXJ5KCBkb2MuY3JlYXRlRWxlbWVudCggbmFtZSApICkuYXBwZW5kVG8oIGRvYy5ib2R5ICksXG5cblx0XHRkaXNwbGF5ID0galF1ZXJ5LmNzcyggZWxlbVsgMCBdLCBcImRpc3BsYXlcIiApO1xuXG5cdC8vIFdlIGRvbid0IGhhdmUgYW55IGRhdGEgc3RvcmVkIG9uIHRoZSBlbGVtZW50LFxuXHQvLyBzbyB1c2UgXCJkZXRhY2hcIiBtZXRob2QgYXMgZmFzdCB3YXkgdG8gZ2V0IHJpZCBvZiB0aGUgZWxlbWVudFxuXHRlbGVtLmRldGFjaCgpO1xuXG5cdHJldHVybiBkaXNwbGF5O1xufVxuXG4vKipcbiAqIFRyeSB0byBkZXRlcm1pbmUgdGhlIGRlZmF1bHQgZGlzcGxheSB2YWx1ZSBvZiBhbiBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gbm9kZU5hbWVcbiAqL1xuZnVuY3Rpb24gZGVmYXVsdERpc3BsYXkoIG5vZGVOYW1lICkge1xuXHR2YXIgZG9jID0gZG9jdW1lbnQsXG5cdFx0ZGlzcGxheSA9IGVsZW1kaXNwbGF5WyBub2RlTmFtZSBdO1xuXG5cdGlmICggIWRpc3BsYXkgKSB7XG5cdFx0ZGlzcGxheSA9IGFjdHVhbERpc3BsYXkoIG5vZGVOYW1lLCBkb2MgKTtcblxuXHRcdC8vIElmIHRoZSBzaW1wbGUgd2F5IGZhaWxzLCByZWFkIGZyb20gaW5zaWRlIGFuIGlmcmFtZVxuXHRcdGlmICggZGlzcGxheSA9PT0gXCJub25lXCIgfHwgIWRpc3BsYXkgKSB7XG5cblx0XHRcdC8vIFVzZSB0aGUgYWxyZWFkeS1jcmVhdGVkIGlmcmFtZSBpZiBwb3NzaWJsZVxuXHRcdFx0aWZyYW1lID0gKCBpZnJhbWUgfHwgalF1ZXJ5KCBcIjxpZnJhbWUgZnJhbWVib3JkZXI9JzAnIHdpZHRoPScwJyBoZWlnaHQ9JzAnLz5cIiApIClcblx0XHRcdFx0LmFwcGVuZFRvKCBkb2MuZG9jdW1lbnRFbGVtZW50ICk7XG5cblx0XHRcdC8vIEFsd2F5cyB3cml0ZSBhIG5ldyBIVE1MIHNrZWxldG9uIHNvIFdlYmtpdCBhbmQgRmlyZWZveCBkb24ndCBjaG9rZSBvbiByZXVzZVxuXHRcdFx0ZG9jID0gaWZyYW1lWyAwIF0uY29udGVudERvY3VtZW50O1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRVxuXHRcdFx0ZG9jLndyaXRlKCk7XG5cdFx0XHRkb2MuY2xvc2UoKTtcblxuXHRcdFx0ZGlzcGxheSA9IGFjdHVhbERpc3BsYXkoIG5vZGVOYW1lLCBkb2MgKTtcblx0XHRcdGlmcmFtZS5kZXRhY2goKTtcblx0XHR9XG5cblx0XHQvLyBTdG9yZSB0aGUgY29ycmVjdCBkZWZhdWx0IGRpc3BsYXlcblx0XHRlbGVtZGlzcGxheVsgbm9kZU5hbWUgXSA9IGRpc3BsYXk7XG5cdH1cblxuXHRyZXR1cm4gZGlzcGxheTtcbn1cblxucmV0dXJuIGRlZmF1bHREaXNwbGF5O1xufSApO1xuIl19