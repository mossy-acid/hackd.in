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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9jc3MvZGVmYXVsdERpc3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFRLENBQ1AsU0FETyxFQUVQLGlCQUZPLEVBR1AsaUI7QUFITyxDQUFSLEVBSUcsVUFBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTZCOztBQUVoQyxLQUFJLE1BQUo7S0FDQyxjQUFjOzs7O0FBSWIsUUFBTSxPQUpPO0FBS2IsUUFBTTtBQUxPLEVBRGY7Ozs7Ozs7OztBQWdCQSxVQUFTLGFBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsR0FBOUIsRUFBb0M7QUFDbkMsTUFBSSxPQUFPLE9BQVEsSUFBSSxhQUFKLENBQW1CLElBQW5CLENBQVIsRUFBb0MsUUFBcEMsQ0FBOEMsSUFBSSxJQUFsRCxDQUFYO01BRUMsVUFBVSxPQUFPLEdBQVAsQ0FBWSxLQUFNLENBQU4sQ0FBWixFQUF1QixTQUF2QixDQUZYOzs7O0FBTUEsT0FBSyxNQUFMOztBQUVBLFNBQU8sT0FBUDtBQUNBOzs7Ozs7QUFNRCxVQUFTLGNBQVQsQ0FBeUIsUUFBekIsRUFBb0M7QUFDbkMsTUFBSSxNQUFNLFFBQVY7TUFDQyxVQUFVLFlBQWEsUUFBYixDQURYOztBQUdBLE1BQUssQ0FBQyxPQUFOLEVBQWdCO0FBQ2YsYUFBVSxjQUFlLFFBQWYsRUFBeUIsR0FBekIsQ0FBVjs7O0FBR0EsT0FBSyxZQUFZLE1BQVosSUFBc0IsQ0FBQyxPQUE1QixFQUFzQzs7O0FBR3JDLGFBQVMsQ0FBRSxVQUFVLE9BQVEsZ0RBQVIsQ0FBWixFQUNQLFFBRE8sQ0FDRyxJQUFJLGVBRFAsQ0FBVDs7O0FBSUEsVUFBTSxPQUFRLENBQVIsRUFBWSxlQUFsQjs7O0FBR0EsUUFBSSxLQUFKO0FBQ0EsUUFBSSxLQUFKOztBQUVBLGNBQVUsY0FBZSxRQUFmLEVBQXlCLEdBQXpCLENBQVY7QUFDQSxXQUFPLE1BQVA7QUFDQTs7O0FBR0QsZUFBYSxRQUFiLElBQTBCLE9BQTFCO0FBQ0E7O0FBRUQsU0FBTyxPQUFQO0FBQ0E7O0FBRUQsUUFBTyxjQUFQO0FBQ0MsQ0F2RUQiLCJmaWxlIjoiZGVmYXVsdERpc3BsYXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuLi9jb3JlXCIsXG5cdFwiLi4vdmFyL2RvY3VtZW50XCIsXG5cdFwiLi4vbWFuaXB1bGF0aW9uXCIgLy8gYXBwZW5kVG9cbl0sIGZ1bmN0aW9uKCBqUXVlcnksIGRvY3VtZW50ICkge1xuXG52YXIgaWZyYW1lLFxuXHRlbGVtZGlzcGxheSA9IHtcblxuXHRcdC8vIFN1cHBvcnQ6IEZpcmVmb3hcblx0XHQvLyBXZSBoYXZlIHRvIHByZS1kZWZpbmUgdGhlc2UgdmFsdWVzIGZvciBGRiAoIzEwMjI3KVxuXHRcdEhUTUw6IFwiYmxvY2tcIixcblx0XHRCT0RZOiBcImJsb2NrXCJcblx0fTtcblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgYWN0dWFsIGRpc3BsYXkgb2YgYSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBub2RlTmFtZSBvZiB0aGUgZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IGRvYyBEb2N1bWVudCBvYmplY3RcbiAqL1xuXG4vLyBDYWxsZWQgb25seSBmcm9tIHdpdGhpbiBkZWZhdWx0RGlzcGxheVxuZnVuY3Rpb24gYWN0dWFsRGlzcGxheSggbmFtZSwgZG9jICkge1xuXHR2YXIgZWxlbSA9IGpRdWVyeSggZG9jLmNyZWF0ZUVsZW1lbnQoIG5hbWUgKSApLmFwcGVuZFRvKCBkb2MuYm9keSApLFxuXG5cdFx0ZGlzcGxheSA9IGpRdWVyeS5jc3MoIGVsZW1bIDAgXSwgXCJkaXNwbGF5XCIgKTtcblxuXHQvLyBXZSBkb24ndCBoYXZlIGFueSBkYXRhIHN0b3JlZCBvbiB0aGUgZWxlbWVudCxcblx0Ly8gc28gdXNlIFwiZGV0YWNoXCIgbWV0aG9kIGFzIGZhc3Qgd2F5IHRvIGdldCByaWQgb2YgdGhlIGVsZW1lbnRcblx0ZWxlbS5kZXRhY2goKTtcblxuXHRyZXR1cm4gZGlzcGxheTtcbn1cblxuLyoqXG4gKiBUcnkgdG8gZGV0ZXJtaW5lIHRoZSBkZWZhdWx0IGRpc3BsYXkgdmFsdWUgb2YgYW4gZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IG5vZGVOYW1lXG4gKi9cbmZ1bmN0aW9uIGRlZmF1bHREaXNwbGF5KCBub2RlTmFtZSApIHtcblx0dmFyIGRvYyA9IGRvY3VtZW50LFxuXHRcdGRpc3BsYXkgPSBlbGVtZGlzcGxheVsgbm9kZU5hbWUgXTtcblxuXHRpZiAoICFkaXNwbGF5ICkge1xuXHRcdGRpc3BsYXkgPSBhY3R1YWxEaXNwbGF5KCBub2RlTmFtZSwgZG9jICk7XG5cblx0XHQvLyBJZiB0aGUgc2ltcGxlIHdheSBmYWlscywgcmVhZCBmcm9tIGluc2lkZSBhbiBpZnJhbWVcblx0XHRpZiAoIGRpc3BsYXkgPT09IFwibm9uZVwiIHx8ICFkaXNwbGF5ICkge1xuXG5cdFx0XHQvLyBVc2UgdGhlIGFscmVhZHktY3JlYXRlZCBpZnJhbWUgaWYgcG9zc2libGVcblx0XHRcdGlmcmFtZSA9ICggaWZyYW1lIHx8IGpRdWVyeSggXCI8aWZyYW1lIGZyYW1lYm9yZGVyPScwJyB3aWR0aD0nMCcgaGVpZ2h0PScwJy8+XCIgKSApXG5cdFx0XHRcdC5hcHBlbmRUbyggZG9jLmRvY3VtZW50RWxlbWVudCApO1xuXG5cdFx0XHQvLyBBbHdheXMgd3JpdGUgYSBuZXcgSFRNTCBza2VsZXRvbiBzbyBXZWJraXQgYW5kIEZpcmVmb3ggZG9uJ3QgY2hva2Ugb24gcmV1c2Vcblx0XHRcdGRvYyA9IGlmcmFtZVsgMCBdLmNvbnRlbnREb2N1bWVudDtcblxuXHRcdFx0Ly8gU3VwcG9ydDogSUVcblx0XHRcdGRvYy53cml0ZSgpO1xuXHRcdFx0ZG9jLmNsb3NlKCk7XG5cblx0XHRcdGRpc3BsYXkgPSBhY3R1YWxEaXNwbGF5KCBub2RlTmFtZSwgZG9jICk7XG5cdFx0XHRpZnJhbWUuZGV0YWNoKCk7XG5cdFx0fVxuXG5cdFx0Ly8gU3RvcmUgdGhlIGNvcnJlY3QgZGVmYXVsdCBkaXNwbGF5XG5cdFx0ZWxlbWRpc3BsYXlbIG5vZGVOYW1lIF0gPSBkaXNwbGF5O1xuXHR9XG5cblx0cmV0dXJuIGRpc3BsYXk7XG59XG5cbnJldHVybiBkZWZhdWx0RGlzcGxheTtcbn0gKTtcbiJdfQ==