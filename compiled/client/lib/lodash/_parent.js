'use strict';

var baseGet = require('./_baseGet'),
    baseSlice = require('./_baseSlice');

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
}

module.exports = parent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19wYXJlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsUUFBUSxZQUFSLENBQVY7SUFDQSxZQUFZLFFBQVEsY0FBUixDQUFaOzs7Ozs7Ozs7O0FBVUosU0FBUyxNQUFULENBQWdCLE1BQWhCLEVBQXdCLElBQXhCLEVBQThCO0FBQzVCLFNBQU8sS0FBSyxNQUFMLElBQWUsQ0FBZixHQUFtQixNQUFuQixHQUE0QixRQUFRLE1BQVIsRUFBZ0IsVUFBVSxJQUFWLEVBQWdCLENBQWhCLEVBQW1CLENBQUMsQ0FBRCxDQUFuQyxDQUE1QixDQURxQjtDQUE5Qjs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsTUFBakIiLCJmaWxlIjoiX3BhcmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlR2V0ID0gcmVxdWlyZSgnLi9fYmFzZUdldCcpLFxuICAgIGJhc2VTbGljZSA9IHJlcXVpcmUoJy4vX2Jhc2VTbGljZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIHBhcmVudCB2YWx1ZSBhdCBgcGF0aGAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhdGggVGhlIHBhdGggdG8gZ2V0IHRoZSBwYXJlbnQgdmFsdWUgb2YuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcGFyZW50IHZhbHVlLlxuICovXG5mdW5jdGlvbiBwYXJlbnQob2JqZWN0LCBwYXRoKSB7XG4gIHJldHVybiBwYXRoLmxlbmd0aCA9PSAxID8gb2JqZWN0IDogYmFzZUdldChvYmplY3QsIGJhc2VTbGljZShwYXRoLCAwLCAtMSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcmVudDtcbiJdfQ==