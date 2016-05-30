'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var getPrototype = require('./_getPrototype');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
  // that are composed entirely of index properties, return `false` for
  // `hasOwnProperty` checks of them.
  return object != null && (hasOwnProperty.call(object, key) || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) == 'object' && key in object && getPrototype(object) === null);
}

module.exports = baseHas;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlSGFzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJLGVBQWUsUUFBUSxpQkFBUixDQUFmOzs7QUFHSixJQUFJLGNBQWMsT0FBTyxTQUFQOzs7QUFHbEIsSUFBSSxpQkFBaUIsWUFBWSxjQUFaOzs7Ozs7Ozs7O0FBVXJCLFNBQVMsT0FBVCxDQUFpQixNQUFqQixFQUF5QixHQUF6QixFQUE4Qjs7OztBQUk1QixTQUFPLFVBQVUsSUFBVixLQUNKLGVBQWUsSUFBZixDQUFvQixNQUFwQixFQUE0QixHQUE1QixLQUNFLFFBQU8sdURBQVAsSUFBaUIsUUFBakIsSUFBNkIsT0FBTyxNQUFQLElBQWlCLGFBQWEsTUFBYixNQUF5QixJQUF6QixDQUY1QyxDQUpxQjtDQUE5Qjs7QUFTQSxPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoiX2Jhc2VIYXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ2V0UHJvdG90eXBlID0gcmVxdWlyZSgnLi9fZ2V0UHJvdG90eXBlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaGFzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSGFzKG9iamVjdCwga2V5KSB7XG4gIC8vIEF2b2lkIGEgYnVnIGluIElFIDEwLTExIHdoZXJlIG9iamVjdHMgd2l0aCBhIFtbUHJvdG90eXBlXV0gb2YgYG51bGxgLFxuICAvLyB0aGF0IGFyZSBjb21wb3NlZCBlbnRpcmVseSBvZiBpbmRleCBwcm9wZXJ0aWVzLCByZXR1cm4gYGZhbHNlYCBmb3JcbiAgLy8gYGhhc093blByb3BlcnR5YCBjaGVja3Mgb2YgdGhlbS5cbiAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmXG4gICAgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpIHx8XG4gICAgICAodHlwZW9mIG9iamVjdCA9PSAnb2JqZWN0JyAmJiBrZXkgaW4gb2JqZWN0ICYmIGdldFByb3RvdHlwZShvYmplY3QpID09PSBudWxsKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUhhcztcbiJdfQ==