"use strict";

define(["../core", "./var/rtagName", "./var/rscriptType", "./wrapMap", "./getAll", "./setGlobalEval"], function (jQuery, rtagName, rscriptType, wrapMap, getAll, setGlobalEval) {

	var rhtml = /<|&#?\w+;/;

	function buildFragment(elems, context, scripts, selection, ignored) {
		var elem,
		    tmp,
		    tag,
		    wrap,
		    contains,
		    j,
		    fragment = context.createDocumentFragment(),
		    nodes = [],
		    i = 0,
		    l = elems.length;

		for (; i < l; i++) {
			elem = elems[i];

			if (elem || elem === 0) {

				// Add nodes directly
				if (jQuery.type(elem) === "object") {

					// Support: Android<4.1, PhantomJS<2
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

					// Convert non-html into a text node
				} else if (!rhtml.test(elem)) {
						nodes.push(context.createTextNode(elem));

						// Convert html into DOM nodes
					} else {
							tmp = tmp || fragment.appendChild(context.createElement("div"));

							// Deserialize a standard representation
							tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
							wrap = wrapMap[tag] || wrapMap._default;
							tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];

							// Descend through wrappers to the right content
							j = wrap[0];
							while (j--) {
								tmp = tmp.lastChild;
							}

							// Support: Android<4.1, PhantomJS<2
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge(nodes, tmp.childNodes);

							// Remember the top-level container
							tmp = fragment.firstChild;

							// Ensure the created nodes are orphaned (#12392)
							tmp.textContent = "";
						}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while (elem = nodes[i++]) {

			// Skip elements already in the context collection (trac-4087)
			if (selection && jQuery.inArray(elem, selection) > -1) {
				if (ignored) {
					ignored.push(elem);
				}
				continue;
			}

			contains = jQuery.contains(elem.ownerDocument, elem);

			// Append to fragment
			tmp = getAll(fragment.appendChild(elem), "script");

			// Preserve script evaluation history
			if (contains) {
				setGlobalEval(tmp);
			}

			// Capture executables
			if (scripts) {
				j = 0;
				while (elem = tmp[j++]) {
					if (rscriptType.test(elem.type || "")) {
						scripts.push(elem);
					}
				}
			}
		}

		return fragment;
	}

	return buildFragment;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9tYW5pcHVsYXRpb24vYnVpbGRGcmFnbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQVEsQ0FDUCxTQURPLEVBRVAsZ0JBRk8sRUFHUCxtQkFITyxFQUlQLFdBSk8sRUFLUCxVQUxPLEVBTVAsaUJBTk8sQ0FBUixFQU9HLFVBQVUsTUFBVixFQUFrQixRQUFsQixFQUE0QixXQUE1QixFQUF5QyxPQUF6QyxFQUFrRCxNQUFsRCxFQUEwRCxhQUExRCxFQUEwRTs7QUFFN0UsS0FBSSxRQUFRLFdBQVo7O0FBRUEsVUFBUyxhQUFULENBQXdCLEtBQXhCLEVBQStCLE9BQS9CLEVBQXdDLE9BQXhDLEVBQWlELFNBQWpELEVBQTRELE9BQTVELEVBQXNFO0FBQ3JFLE1BQUksSUFBSjtNQUFVLEdBQVY7TUFBZSxHQUFmO01BQW9CLElBQXBCO01BQTBCLFFBQTFCO01BQW9DLENBQXBDO01BQ0MsV0FBVyxRQUFRLHNCQUFSLEVBRFo7TUFFQyxRQUFRLEVBRlQ7TUFHQyxJQUFJLENBSEw7TUFJQyxJQUFJLE1BQU0sTUFKWDs7QUFNQSxTQUFRLElBQUksQ0FBWixFQUFlLEdBQWYsRUFBcUI7QUFDcEIsVUFBTyxNQUFPLENBQVAsQ0FBUDs7QUFFQSxPQUFLLFFBQVEsU0FBUyxDQUF0QixFQUEwQjs7O0FBR3pCLFFBQUssT0FBTyxJQUFQLENBQWEsSUFBYixNQUF3QixRQUE3QixFQUF3Qzs7OztBQUl2QyxZQUFPLEtBQVAsQ0FBYyxLQUFkLEVBQXFCLEtBQUssUUFBTCxHQUFnQixDQUFFLElBQUYsQ0FBaEIsR0FBMkIsSUFBaEQ7OztBQUdBLEtBUEQsTUFPTyxJQUFLLENBQUMsTUFBTSxJQUFOLENBQVksSUFBWixDQUFOLEVBQTJCO0FBQ2pDLFlBQU0sSUFBTixDQUFZLFFBQVEsY0FBUixDQUF3QixJQUF4QixDQUFaOzs7QUFHQSxNQUpNLE1BSUE7QUFDTixhQUFNLE9BQU8sU0FBUyxXQUFULENBQXNCLFFBQVEsYUFBUixDQUF1QixLQUF2QixDQUF0QixDQUFiOzs7QUFHQSxhQUFNLENBQUUsU0FBUyxJQUFULENBQWUsSUFBZixLQUF5QixDQUFFLEVBQUYsRUFBTSxFQUFOLENBQTNCLEVBQXlDLENBQXpDLEVBQTZDLFdBQTdDLEVBQU47QUFDQSxjQUFPLFFBQVMsR0FBVCxLQUFrQixRQUFRLFFBQWpDO0FBQ0EsV0FBSSxTQUFKLEdBQWdCLEtBQU0sQ0FBTixJQUFZLE9BQU8sYUFBUCxDQUFzQixJQUF0QixDQUFaLEdBQTJDLEtBQU0sQ0FBTixDQUEzRDs7O0FBR0EsV0FBSSxLQUFNLENBQU4sQ0FBSjtBQUNBLGNBQVEsR0FBUixFQUFjO0FBQ2IsY0FBTSxJQUFJLFNBQVY7QUFDQTs7OztBQUlELGNBQU8sS0FBUCxDQUFjLEtBQWQsRUFBcUIsSUFBSSxVQUF6Qjs7O0FBR0EsYUFBTSxTQUFTLFVBQWY7OztBQUdBLFdBQUksV0FBSixHQUFrQixFQUFsQjtBQUNBO0FBQ0Q7QUFDRDs7O0FBR0QsV0FBUyxXQUFULEdBQXVCLEVBQXZCOztBQUVBLE1BQUksQ0FBSjtBQUNBLFNBQVUsT0FBTyxNQUFPLEdBQVAsQ0FBakIsRUFBa0M7OztBQUdqQyxPQUFLLGFBQWEsT0FBTyxPQUFQLENBQWdCLElBQWhCLEVBQXNCLFNBQXRCLElBQW9DLENBQUMsQ0FBdkQsRUFBMkQ7QUFDMUQsUUFBSyxPQUFMLEVBQWU7QUFDZCxhQUFRLElBQVIsQ0FBYyxJQUFkO0FBQ0E7QUFDRDtBQUNBOztBQUVELGNBQVcsT0FBTyxRQUFQLENBQWlCLEtBQUssYUFBdEIsRUFBcUMsSUFBckMsQ0FBWDs7O0FBR0EsU0FBTSxPQUFRLFNBQVMsV0FBVCxDQUFzQixJQUF0QixDQUFSLEVBQXNDLFFBQXRDLENBQU47OztBQUdBLE9BQUssUUFBTCxFQUFnQjtBQUNmLGtCQUFlLEdBQWY7QUFDQTs7O0FBR0QsT0FBSyxPQUFMLEVBQWU7QUFDZCxRQUFJLENBQUo7QUFDQSxXQUFVLE9BQU8sSUFBSyxHQUFMLENBQWpCLEVBQWdDO0FBQy9CLFNBQUssWUFBWSxJQUFaLENBQWtCLEtBQUssSUFBTCxJQUFhLEVBQS9CLENBQUwsRUFBMkM7QUFDMUMsY0FBUSxJQUFSLENBQWMsSUFBZDtBQUNBO0FBQ0Q7QUFDRDtBQUNEOztBQUVELFNBQU8sUUFBUDtBQUNBOztBQUVELFFBQU8sYUFBUDtBQUNDLENBckdEIiwiZmlsZSI6ImJ1aWxkRnJhZ21lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuLi9jb3JlXCIsXG5cdFwiLi92YXIvcnRhZ05hbWVcIixcblx0XCIuL3Zhci9yc2NyaXB0VHlwZVwiLFxuXHRcIi4vd3JhcE1hcFwiLFxuXHRcIi4vZ2V0QWxsXCIsXG5cdFwiLi9zZXRHbG9iYWxFdmFsXCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnksIHJ0YWdOYW1lLCByc2NyaXB0VHlwZSwgd3JhcE1hcCwgZ2V0QWxsLCBzZXRHbG9iYWxFdmFsICkge1xuXG52YXIgcmh0bWwgPSAvPHwmIz9cXHcrOy87XG5cbmZ1bmN0aW9uIGJ1aWxkRnJhZ21lbnQoIGVsZW1zLCBjb250ZXh0LCBzY3JpcHRzLCBzZWxlY3Rpb24sIGlnbm9yZWQgKSB7XG5cdHZhciBlbGVtLCB0bXAsIHRhZywgd3JhcCwgY29udGFpbnMsIGosXG5cdFx0ZnJhZ21lbnQgPSBjb250ZXh0LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcblx0XHRub2RlcyA9IFtdLFxuXHRcdGkgPSAwLFxuXHRcdGwgPSBlbGVtcy5sZW5ndGg7XG5cblx0Zm9yICggOyBpIDwgbDsgaSsrICkge1xuXHRcdGVsZW0gPSBlbGVtc1sgaSBdO1xuXG5cdFx0aWYgKCBlbGVtIHx8IGVsZW0gPT09IDAgKSB7XG5cblx0XHRcdC8vIEFkZCBub2RlcyBkaXJlY3RseVxuXHRcdFx0aWYgKCBqUXVlcnkudHlwZSggZWxlbSApID09PSBcIm9iamVjdFwiICkge1xuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IEFuZHJvaWQ8NC4xLCBQaGFudG9tSlM8MlxuXHRcdFx0XHQvLyBwdXNoLmFwcGx5KF8sIGFycmF5bGlrZSkgdGhyb3dzIG9uIGFuY2llbnQgV2ViS2l0XG5cdFx0XHRcdGpRdWVyeS5tZXJnZSggbm9kZXMsIGVsZW0ubm9kZVR5cGUgPyBbIGVsZW0gXSA6IGVsZW0gKTtcblxuXHRcdFx0Ly8gQ29udmVydCBub24taHRtbCBpbnRvIGEgdGV4dCBub2RlXG5cdFx0XHR9IGVsc2UgaWYgKCAhcmh0bWwudGVzdCggZWxlbSApICkge1xuXHRcdFx0XHRub2Rlcy5wdXNoKCBjb250ZXh0LmNyZWF0ZVRleHROb2RlKCBlbGVtICkgKTtcblxuXHRcdFx0Ly8gQ29udmVydCBodG1sIGludG8gRE9NIG5vZGVzXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0bXAgPSB0bXAgfHwgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGNvbnRleHQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApICk7XG5cblx0XHRcdFx0Ly8gRGVzZXJpYWxpemUgYSBzdGFuZGFyZCByZXByZXNlbnRhdGlvblxuXHRcdFx0XHR0YWcgPSAoIHJ0YWdOYW1lLmV4ZWMoIGVsZW0gKSB8fCBbIFwiXCIsIFwiXCIgXSApWyAxIF0udG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0d3JhcCA9IHdyYXBNYXBbIHRhZyBdIHx8IHdyYXBNYXAuX2RlZmF1bHQ7XG5cdFx0XHRcdHRtcC5pbm5lckhUTUwgPSB3cmFwWyAxIF0gKyBqUXVlcnkuaHRtbFByZWZpbHRlciggZWxlbSApICsgd3JhcFsgMiBdO1xuXG5cdFx0XHRcdC8vIERlc2NlbmQgdGhyb3VnaCB3cmFwcGVycyB0byB0aGUgcmlnaHQgY29udGVudFxuXHRcdFx0XHRqID0gd3JhcFsgMCBdO1xuXHRcdFx0XHR3aGlsZSAoIGotLSApIHtcblx0XHRcdFx0XHR0bXAgPSB0bXAubGFzdENoaWxkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogQW5kcm9pZDw0LjEsIFBoYW50b21KUzwyXG5cdFx0XHRcdC8vIHB1c2guYXBwbHkoXywgYXJyYXlsaWtlKSB0aHJvd3Mgb24gYW5jaWVudCBXZWJLaXRcblx0XHRcdFx0alF1ZXJ5Lm1lcmdlKCBub2RlcywgdG1wLmNoaWxkTm9kZXMgKTtcblxuXHRcdFx0XHQvLyBSZW1lbWJlciB0aGUgdG9wLWxldmVsIGNvbnRhaW5lclxuXHRcdFx0XHR0bXAgPSBmcmFnbWVudC5maXJzdENoaWxkO1xuXG5cdFx0XHRcdC8vIEVuc3VyZSB0aGUgY3JlYXRlZCBub2RlcyBhcmUgb3JwaGFuZWQgKCMxMjM5Milcblx0XHRcdFx0dG1wLnRleHRDb250ZW50ID0gXCJcIjtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBSZW1vdmUgd3JhcHBlciBmcm9tIGZyYWdtZW50XG5cdGZyYWdtZW50LnRleHRDb250ZW50ID0gXCJcIjtcblxuXHRpID0gMDtcblx0d2hpbGUgKCAoIGVsZW0gPSBub2Rlc1sgaSsrIF0gKSApIHtcblxuXHRcdC8vIFNraXAgZWxlbWVudHMgYWxyZWFkeSBpbiB0aGUgY29udGV4dCBjb2xsZWN0aW9uICh0cmFjLTQwODcpXG5cdFx0aWYgKCBzZWxlY3Rpb24gJiYgalF1ZXJ5LmluQXJyYXkoIGVsZW0sIHNlbGVjdGlvbiApID4gLTEgKSB7XG5cdFx0XHRpZiAoIGlnbm9yZWQgKSB7XG5cdFx0XHRcdGlnbm9yZWQucHVzaCggZWxlbSApO1xuXHRcdFx0fVxuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Y29udGFpbnMgPSBqUXVlcnkuY29udGFpbnMoIGVsZW0ub3duZXJEb2N1bWVudCwgZWxlbSApO1xuXG5cdFx0Ly8gQXBwZW5kIHRvIGZyYWdtZW50XG5cdFx0dG1wID0gZ2V0QWxsKCBmcmFnbWVudC5hcHBlbmRDaGlsZCggZWxlbSApLCBcInNjcmlwdFwiICk7XG5cblx0XHQvLyBQcmVzZXJ2ZSBzY3JpcHQgZXZhbHVhdGlvbiBoaXN0b3J5XG5cdFx0aWYgKCBjb250YWlucyApIHtcblx0XHRcdHNldEdsb2JhbEV2YWwoIHRtcCApO1xuXHRcdH1cblxuXHRcdC8vIENhcHR1cmUgZXhlY3V0YWJsZXNcblx0XHRpZiAoIHNjcmlwdHMgKSB7XG5cdFx0XHRqID0gMDtcblx0XHRcdHdoaWxlICggKCBlbGVtID0gdG1wWyBqKysgXSApICkge1xuXHRcdFx0XHRpZiAoIHJzY3JpcHRUeXBlLnRlc3QoIGVsZW0udHlwZSB8fCBcIlwiICkgKSB7XG5cdFx0XHRcdFx0c2NyaXB0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZnJhZ21lbnQ7XG59XG5cbnJldHVybiBidWlsZEZyYWdtZW50O1xufSApO1xuIl19