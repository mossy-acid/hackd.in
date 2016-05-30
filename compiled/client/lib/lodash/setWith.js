'use strict';

var baseSet = require('./_baseSet');

/**
 * This method is like `_.set` except that it accepts `customizer` which is
 * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
 * path creation is handled by the method instead. The `customizer` is invoked
 * with three arguments: (nsValue, key, nsObject).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {};
 *
 * _.setWith(object, '[0][1]', 'a', Object);
 * // => { '0': { '1': 'a' } }
 */
function setWith(object, path, value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return object == null ? object : baseSet(object, path, value, customizer);
}

module.exports = setWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NldFdpdGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsUUFBUSxZQUFSLENBQWQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLFNBQVMsT0FBVCxDQUFpQixNQUFqQixFQUF5QixJQUF6QixFQUErQixLQUEvQixFQUFzQyxVQUF0QyxFQUFrRDtBQUNoRCxlQUFhLE9BQU8sVUFBUCxJQUFxQixVQUFyQixHQUFrQyxVQUFsQyxHQUErQyxTQUE1RDtBQUNBLFNBQU8sVUFBVSxJQUFWLEdBQWlCLE1BQWpCLEdBQTBCLFFBQVEsTUFBUixFQUFnQixJQUFoQixFQUFzQixLQUF0QixFQUE2QixVQUE3QixDQUFqQztBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJzZXRXaXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VTZXQgPSByZXF1aXJlKCcuL19iYXNlU2V0Jyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5zZXRgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYGN1c3RvbWl6ZXJgIHdoaWNoIGlzXG4gKiBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIG9iamVjdHMgb2YgYHBhdGhgLiAgSWYgYGN1c3RvbWl6ZXJgIHJldHVybnMgYHVuZGVmaW5lZGBcbiAqIHBhdGggY3JlYXRpb24gaXMgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBgY3VzdG9taXplcmAgaXMgaW52b2tlZFxuICogd2l0aCB0aHJlZSBhcmd1bWVudHM6IChuc1ZhbHVlLCBrZXksIG5zT2JqZWN0KS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7fTtcbiAqXG4gKiBfLnNldFdpdGgob2JqZWN0LCAnWzBdWzFdJywgJ2EnLCBPYmplY3QpO1xuICogLy8gPT4geyAnMCc6IHsgJzEnOiAnYScgfSB9XG4gKi9cbmZ1bmN0aW9uIHNldFdpdGgob2JqZWN0LCBwYXRoLCB2YWx1ZSwgY3VzdG9taXplcikge1xuICBjdXN0b21pemVyID0gdHlwZW9mIGN1c3RvbWl6ZXIgPT0gJ2Z1bmN0aW9uJyA/IGN1c3RvbWl6ZXIgOiB1bmRlZmluZWQ7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IG9iamVjdCA6IGJhc2VTZXQob2JqZWN0LCBwYXRoLCB2YWx1ZSwgY3VzdG9taXplcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0V2l0aDtcbiJdfQ==