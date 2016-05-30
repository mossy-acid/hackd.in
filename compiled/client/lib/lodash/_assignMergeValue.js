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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19hc3NpZ25NZXJnZVZhbHVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxLQUFLLFFBQVEsTUFBUixDQUFUOzs7Ozs7Ozs7OztBQVdBLFNBQVMsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUMsS0FBdkMsRUFBOEM7QUFDNUMsTUFBSyxVQUFVLFNBQVYsSUFBdUIsQ0FBQyxHQUFHLE9BQU8sR0FBUCxDQUFILEVBQWdCLEtBQWhCLENBQXpCLElBQ0MsT0FBTyxHQUFQLElBQWMsUUFBZCxJQUEwQixVQUFVLFNBQXBDLElBQWlELEVBQUUsT0FBTyxNQUFULENBRHRELEVBQ3lFO0FBQ3ZFLFdBQU8sR0FBUCxJQUFjLEtBQWQ7QUFDRDtBQUNGOztBQUVELE9BQU8sT0FBUCxHQUFpQixnQkFBakIiLCJmaWxlIjoiX2Fzc2lnbk1lcmdlVmFsdWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBhc3NpZ25WYWx1ZWAgZXhjZXB0IHRoYXQgaXQgZG9lc24ndCBhc3NpZ25cbiAqIGB1bmRlZmluZWRgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgIWVxKG9iamVjdFtrZXldLCB2YWx1ZSkpIHx8XG4gICAgICAodHlwZW9mIGtleSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbk1lcmdlVmFsdWU7XG4iXX0=