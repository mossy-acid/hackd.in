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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9tYW5pcHVsYXRpb24vYnVpbGRGcmFnbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQVEsQ0FDUCxTQURPLEVBRVAsZ0JBRk8sRUFHUCxtQkFITyxFQUlQLFdBSk8sRUFLUCxVQUxPLEVBTVAsaUJBTk8sQ0FBUixFQU9HLFVBQVUsTUFBVixFQUFrQixRQUFsQixFQUE0QixXQUE1QixFQUF5QyxPQUF6QyxFQUFrRCxNQUFsRCxFQUEwRCxhQUExRCxFQUEwRTs7QUFFN0UsS0FBSSxRQUFRLFdBQVIsQ0FGeUU7O0FBSTdFLFVBQVMsYUFBVCxDQUF3QixLQUF4QixFQUErQixPQUEvQixFQUF3QyxPQUF4QyxFQUFpRCxTQUFqRCxFQUE0RCxPQUE1RCxFQUFzRTtBQUNyRSxNQUFJLElBQUo7TUFBVSxHQUFWO01BQWUsR0FBZjtNQUFvQixJQUFwQjtNQUEwQixRQUExQjtNQUFvQyxDQUFwQztNQUNDLFdBQVcsUUFBUSxzQkFBUixFQUFYO01BQ0EsUUFBUSxFQUFSO01BQ0EsSUFBSSxDQUFKO01BQ0EsSUFBSSxNQUFNLE1BQU4sQ0FMZ0U7O0FBT3JFLFNBQVEsSUFBSSxDQUFKLEVBQU8sR0FBZixFQUFxQjtBQUNwQixVQUFPLE1BQU8sQ0FBUCxDQUFQLENBRG9COztBQUdwQixPQUFLLFFBQVEsU0FBUyxDQUFULEVBQWE7OztBQUd6QixRQUFLLE9BQU8sSUFBUCxDQUFhLElBQWIsTUFBd0IsUUFBeEIsRUFBbUM7Ozs7QUFJdkMsWUFBTyxLQUFQLENBQWMsS0FBZCxFQUFxQixLQUFLLFFBQUwsR0FBZ0IsQ0FBRSxJQUFGLENBQWhCLEdBQTJCLElBQTNCLENBQXJCOzs7QUFKdUMsS0FBeEMsTUFPTyxJQUFLLENBQUMsTUFBTSxJQUFOLENBQVksSUFBWixDQUFELEVBQXNCO0FBQ2pDLFlBQU0sSUFBTixDQUFZLFFBQVEsY0FBUixDQUF3QixJQUF4QixDQUFaOzs7QUFEaUMsTUFBM0IsTUFJQTtBQUNOLGFBQU0sT0FBTyxTQUFTLFdBQVQsQ0FBc0IsUUFBUSxhQUFSLENBQXVCLEtBQXZCLENBQXRCLENBQVA7OztBQURBLFVBSU4sR0FBTSxDQUFFLFNBQVMsSUFBVCxDQUFlLElBQWYsS0FBeUIsQ0FBRSxFQUFGLEVBQU0sRUFBTixDQUF6QixDQUFGLENBQXlDLENBQXpDLEVBQTZDLFdBQTdDLEVBQU4sQ0FKTTtBQUtOLGNBQU8sUUFBUyxHQUFULEtBQWtCLFFBQVEsUUFBUixDQUxuQjtBQU1OLFdBQUksU0FBSixHQUFnQixLQUFNLENBQU4sSUFBWSxPQUFPLGFBQVAsQ0FBc0IsSUFBdEIsQ0FBWixHQUEyQyxLQUFNLENBQU4sQ0FBM0M7OztBQU5WLFFBU04sR0FBSSxLQUFNLENBQU4sQ0FBSixDQVRNO0FBVU4sY0FBUSxHQUFSLEVBQWM7QUFDYixjQUFNLElBQUksU0FBSixDQURPO1FBQWQ7Ozs7QUFWTSxhQWdCTixDQUFPLEtBQVAsQ0FBYyxLQUFkLEVBQXFCLElBQUksVUFBSixDQUFyQjs7O0FBaEJNLFVBbUJOLEdBQU0sU0FBUyxVQUFUOzs7QUFuQkEsVUFzQk4sQ0FBSSxXQUFKLEdBQWtCLEVBQWxCLENBdEJNO09BSkE7SUFWUjtHQUhEOzs7QUFQcUUsVUFvRHJFLENBQVMsV0FBVCxHQUF1QixFQUF2QixDQXBEcUU7O0FBc0RyRSxNQUFJLENBQUosQ0F0RHFFO0FBdURyRSxTQUFVLE9BQU8sTUFBTyxHQUFQLENBQVAsRUFBd0I7OztBQUdqQyxPQUFLLGFBQWEsT0FBTyxPQUFQLENBQWdCLElBQWhCLEVBQXNCLFNBQXRCLElBQW9DLENBQUMsQ0FBRCxFQUFLO0FBQzFELFFBQUssT0FBTCxFQUFlO0FBQ2QsYUFBUSxJQUFSLENBQWMsSUFBZCxFQURjO0tBQWY7QUFHQSxhQUowRDtJQUEzRDs7QUFPQSxjQUFXLE9BQU8sUUFBUCxDQUFpQixLQUFLLGFBQUwsRUFBb0IsSUFBckMsQ0FBWDs7O0FBVmlDLE1BYWpDLEdBQU0sT0FBUSxTQUFTLFdBQVQsQ0FBc0IsSUFBdEIsQ0FBUixFQUFzQyxRQUF0QyxDQUFOOzs7QUFiaUMsT0FnQjVCLFFBQUwsRUFBZ0I7QUFDZixrQkFBZSxHQUFmLEVBRGU7SUFBaEI7OztBQWhCaUMsT0FxQjVCLE9BQUwsRUFBZTtBQUNkLFFBQUksQ0FBSixDQURjO0FBRWQsV0FBVSxPQUFPLElBQUssR0FBTCxDQUFQLEVBQXNCO0FBQy9CLFNBQUssWUFBWSxJQUFaLENBQWtCLEtBQUssSUFBTCxJQUFhLEVBQWIsQ0FBdkIsRUFBMkM7QUFDMUMsY0FBUSxJQUFSLENBQWMsSUFBZCxFQUQwQztNQUEzQztLQUREO0lBRkQ7R0FyQkQ7O0FBK0JBLFNBQU8sUUFBUCxDQXRGcUU7RUFBdEU7O0FBeUZBLFFBQU8sYUFBUCxDQTdGNkU7Q0FBMUUsQ0FQSCIsImZpbGUiOiJidWlsZEZyYWdtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBbXG5cdFwiLi4vY29yZVwiLFxuXHRcIi4vdmFyL3J0YWdOYW1lXCIsXG5cdFwiLi92YXIvcnNjcmlwdFR5cGVcIixcblx0XCIuL3dyYXBNYXBcIixcblx0XCIuL2dldEFsbFwiLFxuXHRcIi4vc2V0R2xvYmFsRXZhbFwiXG5dLCBmdW5jdGlvbiggalF1ZXJ5LCBydGFnTmFtZSwgcnNjcmlwdFR5cGUsIHdyYXBNYXAsIGdldEFsbCwgc2V0R2xvYmFsRXZhbCApIHtcblxudmFyIHJodG1sID0gLzx8JiM/XFx3KzsvO1xuXG5mdW5jdGlvbiBidWlsZEZyYWdtZW50KCBlbGVtcywgY29udGV4dCwgc2NyaXB0cywgc2VsZWN0aW9uLCBpZ25vcmVkICkge1xuXHR2YXIgZWxlbSwgdG1wLCB0YWcsIHdyYXAsIGNvbnRhaW5zLCBqLFxuXHRcdGZyYWdtZW50ID0gY29udGV4dC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG5cdFx0bm9kZXMgPSBbXSxcblx0XHRpID0gMCxcblx0XHRsID0gZWxlbXMubGVuZ3RoO1xuXG5cdGZvciAoIDsgaSA8IGw7IGkrKyApIHtcblx0XHRlbGVtID0gZWxlbXNbIGkgXTtcblxuXHRcdGlmICggZWxlbSB8fCBlbGVtID09PSAwICkge1xuXG5cdFx0XHQvLyBBZGQgbm9kZXMgZGlyZWN0bHlcblx0XHRcdGlmICggalF1ZXJ5LnR5cGUoIGVsZW0gKSA9PT0gXCJvYmplY3RcIiApIHtcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBBbmRyb2lkPDQuMSwgUGhhbnRvbUpTPDJcblx0XHRcdFx0Ly8gcHVzaC5hcHBseShfLCBhcnJheWxpa2UpIHRocm93cyBvbiBhbmNpZW50IFdlYktpdFxuXHRcdFx0XHRqUXVlcnkubWVyZ2UoIG5vZGVzLCBlbGVtLm5vZGVUeXBlID8gWyBlbGVtIF0gOiBlbGVtICk7XG5cblx0XHRcdC8vIENvbnZlcnQgbm9uLWh0bWwgaW50byBhIHRleHQgbm9kZVxuXHRcdFx0fSBlbHNlIGlmICggIXJodG1sLnRlc3QoIGVsZW0gKSApIHtcblx0XHRcdFx0bm9kZXMucHVzaCggY29udGV4dC5jcmVhdGVUZXh0Tm9kZSggZWxlbSApICk7XG5cblx0XHRcdC8vIENvbnZlcnQgaHRtbCBpbnRvIERPTSBub2Rlc1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dG1wID0gdG1wIHx8IGZyYWdtZW50LmFwcGVuZENoaWxkKCBjb250ZXh0LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKSApO1xuXG5cdFx0XHRcdC8vIERlc2VyaWFsaXplIGEgc3RhbmRhcmQgcmVwcmVzZW50YXRpb25cblx0XHRcdFx0dGFnID0gKCBydGFnTmFtZS5leGVjKCBlbGVtICkgfHwgWyBcIlwiLCBcIlwiIF0gKVsgMSBdLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdHdyYXAgPSB3cmFwTWFwWyB0YWcgXSB8fCB3cmFwTWFwLl9kZWZhdWx0O1xuXHRcdFx0XHR0bXAuaW5uZXJIVE1MID0gd3JhcFsgMSBdICsgalF1ZXJ5Lmh0bWxQcmVmaWx0ZXIoIGVsZW0gKSArIHdyYXBbIDIgXTtcblxuXHRcdFx0XHQvLyBEZXNjZW5kIHRocm91Z2ggd3JhcHBlcnMgdG8gdGhlIHJpZ2h0IGNvbnRlbnRcblx0XHRcdFx0aiA9IHdyYXBbIDAgXTtcblx0XHRcdFx0d2hpbGUgKCBqLS0gKSB7XG5cdFx0XHRcdFx0dG1wID0gdG1wLmxhc3RDaGlsZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IEFuZHJvaWQ8NC4xLCBQaGFudG9tSlM8MlxuXHRcdFx0XHQvLyBwdXNoLmFwcGx5KF8sIGFycmF5bGlrZSkgdGhyb3dzIG9uIGFuY2llbnQgV2ViS2l0XG5cdFx0XHRcdGpRdWVyeS5tZXJnZSggbm9kZXMsIHRtcC5jaGlsZE5vZGVzICk7XG5cblx0XHRcdFx0Ly8gUmVtZW1iZXIgdGhlIHRvcC1sZXZlbCBjb250YWluZXJcblx0XHRcdFx0dG1wID0gZnJhZ21lbnQuZmlyc3RDaGlsZDtcblxuXHRcdFx0XHQvLyBFbnN1cmUgdGhlIGNyZWF0ZWQgbm9kZXMgYXJlIG9ycGhhbmVkICgjMTIzOTIpXG5cdFx0XHRcdHRtcC50ZXh0Q29udGVudCA9IFwiXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIHdyYXBwZXIgZnJvbSBmcmFnbWVudFxuXHRmcmFnbWVudC50ZXh0Q29udGVudCA9IFwiXCI7XG5cblx0aSA9IDA7XG5cdHdoaWxlICggKCBlbGVtID0gbm9kZXNbIGkrKyBdICkgKSB7XG5cblx0XHQvLyBTa2lwIGVsZW1lbnRzIGFscmVhZHkgaW4gdGhlIGNvbnRleHQgY29sbGVjdGlvbiAodHJhYy00MDg3KVxuXHRcdGlmICggc2VsZWN0aW9uICYmIGpRdWVyeS5pbkFycmF5KCBlbGVtLCBzZWxlY3Rpb24gKSA+IC0xICkge1xuXHRcdFx0aWYgKCBpZ25vcmVkICkge1xuXHRcdFx0XHRpZ25vcmVkLnB1c2goIGVsZW0gKTtcblx0XHRcdH1cblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGNvbnRhaW5zID0galF1ZXJ5LmNvbnRhaW5zKCBlbGVtLm93bmVyRG9jdW1lbnQsIGVsZW0gKTtcblxuXHRcdC8vIEFwcGVuZCB0byBmcmFnbWVudFxuXHRcdHRtcCA9IGdldEFsbCggZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGVsZW0gKSwgXCJzY3JpcHRcIiApO1xuXG5cdFx0Ly8gUHJlc2VydmUgc2NyaXB0IGV2YWx1YXRpb24gaGlzdG9yeVxuXHRcdGlmICggY29udGFpbnMgKSB7XG5cdFx0XHRzZXRHbG9iYWxFdmFsKCB0bXAgKTtcblx0XHR9XG5cblx0XHQvLyBDYXB0dXJlIGV4ZWN1dGFibGVzXG5cdFx0aWYgKCBzY3JpcHRzICkge1xuXHRcdFx0aiA9IDA7XG5cdFx0XHR3aGlsZSAoICggZWxlbSA9IHRtcFsgaisrIF0gKSApIHtcblx0XHRcdFx0aWYgKCByc2NyaXB0VHlwZS50ZXN0KCBlbGVtLnR5cGUgfHwgXCJcIiApICkge1xuXHRcdFx0XHRcdHNjcmlwdHMucHVzaCggZWxlbSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGZyYWdtZW50O1xufVxuXG5yZXR1cm4gYnVpbGRGcmFnbWVudDtcbn0gKTtcbiJdfQ==