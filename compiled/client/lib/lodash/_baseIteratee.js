'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
    return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlSXRlcmF0ZWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUksY0FBYyxRQUFRLGdCQUFSLENBQWxCO0lBQ0ksc0JBQXNCLFFBQVEsd0JBQVIsQ0FEMUI7SUFFSSxXQUFXLFFBQVEsWUFBUixDQUZmO0lBR0ksVUFBVSxRQUFRLFdBQVIsQ0FIZDtJQUlJLFdBQVcsUUFBUSxZQUFSLENBSmY7Ozs7Ozs7OztBQWFBLFNBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2Qjs7O0FBRzNCLE1BQUksT0FBTyxLQUFQLElBQWdCLFVBQXBCLEVBQWdDO0FBQzlCLFdBQU8sS0FBUDtBQUNEO0FBQ0QsTUFBSSxTQUFTLElBQWIsRUFBbUI7QUFDakIsV0FBTyxRQUFQO0FBQ0Q7QUFDRCxNQUFJLFFBQU8sS0FBUCx5Q0FBTyxLQUFQLE1BQWdCLFFBQXBCLEVBQThCO0FBQzVCLFdBQU8sUUFBUSxLQUFSLElBQ0gsb0JBQW9CLE1BQU0sQ0FBTixDQUFwQixFQUE4QixNQUFNLENBQU4sQ0FBOUIsQ0FERyxHQUVILFlBQVksS0FBWixDQUZKO0FBR0Q7QUFDRCxTQUFPLFNBQVMsS0FBVCxDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6Il9iYXNlSXRlcmF0ZWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZU1hdGNoZXMgPSByZXF1aXJlKCcuL19iYXNlTWF0Y2hlcycpLFxuICAgIGJhc2VNYXRjaGVzUHJvcGVydHkgPSByZXF1aXJlKCcuL19iYXNlTWF0Y2hlc1Byb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIHByb3BlcnR5ID0gcmVxdWlyZSgnLi9wcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLml0ZXJhdGVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSBbdmFsdWU9Xy5pZGVudGl0eV0gVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYW4gaXRlcmF0ZWUuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGl0ZXJhdGVlLlxuICovXG5mdW5jdGlvbiBiYXNlSXRlcmF0ZWUodmFsdWUpIHtcbiAgLy8gRG9uJ3Qgc3RvcmUgdGhlIGB0eXBlb2ZgIHJlc3VsdCBpbiBhIHZhcmlhYmxlIHRvIGF2b2lkIGEgSklUIGJ1ZyBpbiBTYWZhcmkgOS5cbiAgLy8gU2VlIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNTYwMzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGlkZW50aXR5O1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gaXNBcnJheSh2YWx1ZSlcbiAgICAgID8gYmFzZU1hdGNoZXNQcm9wZXJ0eSh2YWx1ZVswXSwgdmFsdWVbMV0pXG4gICAgICA6IGJhc2VNYXRjaGVzKHZhbHVlKTtcbiAgfVxuICByZXR1cm4gcHJvcGVydHkodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJdGVyYXRlZTtcbiJdfQ==