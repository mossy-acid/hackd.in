'use strict';

var eq = require('./eq');

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if (value !== undefined && !eq(object[key], value) || typeof key == 'number' && value === undefined && !(key in object)) {
    object[key] = value;
  }
}

module.exports = assignMergeValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19hc3NpZ25NZXJnZVZhbHVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxLQUFLLFFBQVEsTUFBUixDQUFMOzs7Ozs7Ozs7OztBQVdKLFNBQVMsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUMsS0FBdkMsRUFBOEM7QUFDNUMsTUFBSSxLQUFDLEtBQVUsU0FBVixJQUF1QixDQUFDLEdBQUcsT0FBTyxHQUFQLENBQUgsRUFBZ0IsS0FBaEIsQ0FBRCxJQUN2QixPQUFPLEdBQVAsSUFBYyxRQUFkLElBQTBCLFVBQVUsU0FBVixJQUF1QixFQUFFLE9BQU8sTUFBUCxDQUFGLEVBQW1CO0FBQ3ZFLFdBQU8sR0FBUCxJQUFjLEtBQWQsQ0FEdUU7R0FEekU7Q0FERjs7QUFPQSxPQUFPLE9BQVAsR0FBaUIsZ0JBQWpCIiwiZmlsZSI6Il9hc3NpZ25NZXJnZVZhbHVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYXNzaWduVmFsdWVgIGV4Y2VwdCB0aGF0IGl0IGRvZXNuJ3QgYXNzaWduXG4gKiBgdW5kZWZpbmVkYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgaWYgKCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmICFlcShvYmplY3Rba2V5XSwgdmFsdWUpKSB8fFxuICAgICAgKHR5cGVvZiBrZXkgPT0gJ251bWJlcicgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25NZXJnZVZhbHVlO1xuIl19