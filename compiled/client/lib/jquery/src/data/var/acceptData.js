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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9kYXRhL3Zhci9hY2NlcHREYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxZQUFXOzs7OztBQUtuQixRQUFPLFVBQVUsS0FBVixFQUFrQjs7Ozs7Ozs7O0FBU3hCLFNBQU8sTUFBTSxRQUFOLEtBQW1CLENBQW5CLElBQXdCLE1BQU0sUUFBTixLQUFtQixDQUFuQixJQUF3QixFQUFHLENBQUMsTUFBTSxRQUFOLENBVG5DO0VBQWxCLENBTFk7Q0FBWCxDQUFSIiwiZmlsZSI6ImFjY2VwdERhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIGZ1bmN0aW9uKCkge1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhbiBvYmplY3QgY2FuIGhhdmUgZGF0YVxuICovXG5yZXR1cm4gZnVuY3Rpb24oIG93bmVyICkge1xuXG5cdC8vIEFjY2VwdHMgb25seTpcblx0Ly8gIC0gTm9kZVxuXHQvLyAgICAtIE5vZGUuRUxFTUVOVF9OT0RFXG5cdC8vICAgIC0gTm9kZS5ET0NVTUVOVF9OT0RFXG5cdC8vICAtIE9iamVjdFxuXHQvLyAgICAtIEFueVxuXHQvKiBqc2hpbnQgLVcwMTggKi9cblx0cmV0dXJuIG93bmVyLm5vZGVUeXBlID09PSAxIHx8IG93bmVyLm5vZGVUeXBlID09PSA5IHx8ICEoICtvd25lci5ub2RlVHlwZSApO1xufTtcblxufSApO1xuIl19