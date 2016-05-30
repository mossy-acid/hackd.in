"use strict";

define(function () {

	/**
  * Determines whether an object can have data
  */
	return function (owner) {

		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		/* jshint -W018 */
		return owner.nodeType === 1 || owner.nodeType === 9 || ! +owner.nodeType;
	};
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9kYXRhL3Zhci9hY2NlcHREYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxZQUFXOzs7OztBQUtuQixRQUFPLFVBQVUsS0FBVixFQUFrQjs7Ozs7Ozs7O0FBU3hCLFNBQU8sTUFBTSxRQUFOLEtBQW1CLENBQW5CLElBQXdCLE1BQU0sUUFBTixLQUFtQixDQUEzQyxJQUFnRCxFQUFHLENBQUMsTUFBTSxRQUFqRTtBQUNBLEVBVkQ7QUFZQyxDQWpCRCIsImZpbGUiOiJhY2NlcHREYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBmdW5jdGlvbigpIHtcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGNhbiBoYXZlIGRhdGFcbiAqL1xucmV0dXJuIGZ1bmN0aW9uKCBvd25lciApIHtcblxuXHQvLyBBY2NlcHRzIG9ubHk6XG5cdC8vICAtIE5vZGVcblx0Ly8gICAgLSBOb2RlLkVMRU1FTlRfTk9ERVxuXHQvLyAgICAtIE5vZGUuRE9DVU1FTlRfTk9ERVxuXHQvLyAgLSBPYmplY3Rcblx0Ly8gICAgLSBBbnlcblx0LyoganNoaW50IC1XMDE4ICovXG5cdHJldHVybiBvd25lci5ub2RlVHlwZSA9PT0gMSB8fCBvd25lci5ub2RlVHlwZSA9PT0gOSB8fCAhKCArb3duZXIubm9kZVR5cGUgKTtcbn07XG5cbn0gKTtcbiJdfQ==