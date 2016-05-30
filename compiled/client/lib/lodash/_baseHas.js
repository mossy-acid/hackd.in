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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlSGFzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJLGVBQWUsUUFBUSxpQkFBUixDQUFuQjs7O0FBR0EsSUFBSSxjQUFjLE9BQU8sU0FBekI7OztBQUdBLElBQUksaUJBQWlCLFlBQVksY0FBakM7Ozs7Ozs7Ozs7QUFVQSxTQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUIsR0FBekIsRUFBOEI7Ozs7QUFJNUIsU0FBTyxVQUFVLElBQVYsS0FDSixlQUFlLElBQWYsQ0FBb0IsTUFBcEIsRUFBNEIsR0FBNUIsS0FDRSxRQUFPLE1BQVAseUNBQU8sTUFBUCxNQUFpQixRQUFqQixJQUE2QixPQUFPLE1BQXBDLElBQThDLGFBQWEsTUFBYixNQUF5QixJQUZyRSxDQUFQO0FBR0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6Il9iYXNlSGFzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdldFByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2dldFByb3RvdHlwZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmhhc2Agd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUhhcyhvYmplY3QsIGtleSkge1xuICAvLyBBdm9pZCBhIGJ1ZyBpbiBJRSAxMC0xMSB3aGVyZSBvYmplY3RzIHdpdGggYSBbW1Byb3RvdHlwZV1dIG9mIGBudWxsYCxcbiAgLy8gdGhhdCBhcmUgY29tcG9zZWQgZW50aXJlbHkgb2YgaW5kZXggcHJvcGVydGllcywgcmV0dXJuIGBmYWxzZWAgZm9yXG4gIC8vIGBoYXNPd25Qcm9wZXJ0eWAgY2hlY2tzIG9mIHRoZW0uXG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJlxuICAgIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSB8fFxuICAgICAgKHR5cGVvZiBvYmplY3QgPT0gJ29iamVjdCcgJiYga2V5IGluIG9iamVjdCAmJiBnZXRQcm90b3R5cGUob2JqZWN0KSA9PT0gbnVsbCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VIYXM7XG4iXX0=