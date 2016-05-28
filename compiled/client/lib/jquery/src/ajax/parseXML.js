"use strict";

define(["../core"], function (jQuery) {

	// Cross-browser xml parsing
	jQuery.parseXML = function (data) {
		var xml;
		if (!data || typeof data !== "string") {
			return null;
		}

		// Support: IE9
		try {
			xml = new window.DOMParser().parseFromString(data, "text/xml");
		} catch (e) {
			xml = undefined;
		}

		if (!xml || xml.getElementsByTagName("parsererror").length) {
			jQuery.error("Invalid XML: " + data);
		}
		return xml;
	};

	return jQuery.parseXML;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9hamF4L3BhcnNlWE1MLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBUSxDQUNQLFNBRE8sQ0FBUixFQUVHLFVBQVUsTUFBVixFQUFtQjs7O0FBR3RCLFFBQU8sUUFBUCxHQUFrQixVQUFVLElBQVYsRUFBaUI7QUFDbEMsTUFBSSxHQUFKLENBRGtDO0FBRWxDLE1BQUssQ0FBQyxJQUFELElBQVMsT0FBTyxJQUFQLEtBQWdCLFFBQWhCLEVBQTJCO0FBQ3hDLFVBQU8sSUFBUCxDQUR3QztHQUF6Qzs7O0FBRmtDLE1BTzlCO0FBQ0gsU0FBTSxJQUFNLE9BQU8sU0FBUCxFQUFOLENBQTJCLGVBQTNCLENBQTRDLElBQTVDLEVBQWtELFVBQWxELENBQU4sQ0FERztHQUFKLENBRUUsT0FBUSxDQUFSLEVBQVk7QUFDYixTQUFNLFNBQU4sQ0FEYTtHQUFaOztBQUlGLE1BQUssQ0FBQyxHQUFELElBQVEsSUFBSSxvQkFBSixDQUEwQixhQUExQixFQUEwQyxNQUExQyxFQUFtRDtBQUMvRCxVQUFPLEtBQVAsQ0FBYyxrQkFBa0IsSUFBbEIsQ0FBZCxDQUQrRDtHQUFoRTtBQUdBLFNBQU8sR0FBUCxDQWhCa0M7RUFBakIsQ0FISTs7QUFzQnRCLFFBQU8sT0FBTyxRQUFQLENBdEJlO0NBQW5CLENBRkgiLCJmaWxlIjoicGFyc2VYTUwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoIFtcblx0XCIuLi9jb3JlXCJcbl0sIGZ1bmN0aW9uKCBqUXVlcnkgKSB7XG5cbi8vIENyb3NzLWJyb3dzZXIgeG1sIHBhcnNpbmdcbmpRdWVyeS5wYXJzZVhNTCA9IGZ1bmN0aW9uKCBkYXRhICkge1xuXHR2YXIgeG1sO1xuXHRpZiAoICFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSBcInN0cmluZ1wiICkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Ly8gU3VwcG9ydDogSUU5XG5cdHRyeSB7XG5cdFx0eG1sID0gKCBuZXcgd2luZG93LkRPTVBhcnNlcigpICkucGFyc2VGcm9tU3RyaW5nKCBkYXRhLCBcInRleHQveG1sXCIgKTtcblx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0eG1sID0gdW5kZWZpbmVkO1xuXHR9XG5cblx0aWYgKCAheG1sIHx8IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSggXCJwYXJzZXJlcnJvclwiICkubGVuZ3RoICkge1xuXHRcdGpRdWVyeS5lcnJvciggXCJJbnZhbGlkIFhNTDogXCIgKyBkYXRhICk7XG5cdH1cblx0cmV0dXJuIHhtbDtcbn07XG5cbnJldHVybiBqUXVlcnkucGFyc2VYTUw7XG5cbn0gKTtcbiJdfQ==