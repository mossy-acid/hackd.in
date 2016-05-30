"use strict";

define(function () {

	function addGetHookIf(conditionFn, hookFn) {

		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function get() {
				if (conditionFn()) {

					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return (this.get = hookFn).apply(this, arguments);
			}
		};
	}

	return addGetHookIf;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9jc3MvYWRkR2V0SG9va0lmLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxZQUFXOztBQUVuQixVQUFTLFlBQVQsQ0FBdUIsV0FBdkIsRUFBb0MsTUFBcEMsRUFBNkM7OztBQUc1QyxTQUFPO0FBQ04sUUFBSyxlQUFXO0FBQ2YsUUFBSyxhQUFMLEVBQXFCOzs7O0FBSXBCLFlBQU8sS0FBSyxHQUFaO0FBQ0E7QUFDQTs7O0FBR0QsV0FBTyxDQUFFLEtBQUssR0FBTCxHQUFXLE1BQWIsRUFBc0IsS0FBdEIsQ0FBNkIsSUFBN0IsRUFBbUMsU0FBbkMsQ0FBUDtBQUNBO0FBWkssR0FBUDtBQWNBOztBQUVELFFBQU8sWUFBUDtBQUVDLENBdkJEIiwiZmlsZSI6ImFkZEdldEhvb2tJZi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggZnVuY3Rpb24oKSB7XG5cbmZ1bmN0aW9uIGFkZEdldEhvb2tJZiggY29uZGl0aW9uRm4sIGhvb2tGbiApIHtcblxuXHQvLyBEZWZpbmUgdGhlIGhvb2ssIHdlJ2xsIGNoZWNrIG9uIHRoZSBmaXJzdCBydW4gaWYgaXQncyByZWFsbHkgbmVlZGVkLlxuXHRyZXR1cm4ge1xuXHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIGNvbmRpdGlvbkZuKCkgKSB7XG5cblx0XHRcdFx0Ly8gSG9vayBub3QgbmVlZGVkIChvciBpdCdzIG5vdCBwb3NzaWJsZSB0byB1c2UgaXQgZHVlXG5cdFx0XHRcdC8vIHRvIG1pc3NpbmcgZGVwZW5kZW5jeSksIHJlbW92ZSBpdC5cblx0XHRcdFx0ZGVsZXRlIHRoaXMuZ2V0O1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIEhvb2sgbmVlZGVkOyByZWRlZmluZSBpdCBzbyB0aGF0IHRoZSBzdXBwb3J0IHRlc3QgaXMgbm90IGV4ZWN1dGVkIGFnYWluLlxuXHRcdFx0cmV0dXJuICggdGhpcy5nZXQgPSBob29rRm4gKS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0fVxuXHR9O1xufVxuXG5yZXR1cm4gYWRkR2V0SG9va0lmO1xuXG59ICk7XG4iXX0=