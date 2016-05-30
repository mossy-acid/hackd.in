'use strict';

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

module.exports = isHostObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19pc0hvc3RPYmplY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBT0EsU0FBUyxZQUFULENBQXNCLEtBQXRCLEVBQTZCOzs7QUFHM0IsTUFBSSxTQUFTLEtBQWI7QUFDQSxNQUFJLFNBQVMsSUFBVCxJQUFpQixPQUFPLE1BQU0sUUFBYixJQUF5QixVQUE5QyxFQUEwRDtBQUN4RCxRQUFJO0FBQ0YsZUFBUyxDQUFDLEVBQUUsUUFBUSxFQUFWLENBQVY7QUFDRCxLQUZELENBRUUsT0FBTyxDQUFQLEVBQVUsQ0FBRTtBQUNmO0FBQ0QsU0FBTyxNQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6Il9pc0hvc3RPYmplY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgaG9zdCBvYmplY3QgaW4gSUUgPCA5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgaG9zdCBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNIb3N0T2JqZWN0KHZhbHVlKSB7XG4gIC8vIE1hbnkgaG9zdCBvYmplY3RzIGFyZSBgT2JqZWN0YCBvYmplY3RzIHRoYXQgY2FuIGNvZXJjZSB0byBzdHJpbmdzXG4gIC8vIGRlc3BpdGUgaGF2aW5nIGltcHJvcGVybHkgZGVmaW5lZCBgdG9TdHJpbmdgIG1ldGhvZHMuXG4gIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgaWYgKHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nICE9ICdmdW5jdGlvbicpIHtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gISEodmFsdWUgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSG9zdE9iamVjdDtcbiJdfQ==