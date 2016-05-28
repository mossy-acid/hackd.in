'use strict';

var baseHas = require('./_baseHas'),
    castPath = require('./_castPath'),
    isKey = require('./_isKey'),
    last = require('./last'),
    parent = require('./_parent'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);
  object = parent(object, path);

  var key = toKey(last(path));
  return !(object != null && baseHas(object, key)) || delete object[key];
}

module.exports = baseUnset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlVW5zZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsUUFBUSxZQUFSLENBQVY7SUFDQSxXQUFXLFFBQVEsYUFBUixDQUFYO0lBQ0EsUUFBUSxRQUFRLFVBQVIsQ0FBUjtJQUNBLE9BQU8sUUFBUSxRQUFSLENBQVA7SUFDQSxTQUFTLFFBQVEsV0FBUixDQUFUO0lBQ0EsUUFBUSxRQUFRLFVBQVIsQ0FBUjs7Ozs7Ozs7OztBQVVKLFNBQVMsU0FBVCxDQUFtQixNQUFuQixFQUEyQixJQUEzQixFQUFpQztBQUMvQixTQUFPLE1BQU0sSUFBTixFQUFZLE1BQVosSUFBc0IsQ0FBQyxJQUFELENBQXRCLEdBQStCLFNBQVMsSUFBVCxDQUEvQixDQUR3QjtBQUUvQixXQUFTLE9BQU8sTUFBUCxFQUFlLElBQWYsQ0FBVCxDQUYrQjs7QUFJL0IsTUFBSSxNQUFNLE1BQU0sS0FBSyxJQUFMLENBQU4sQ0FBTixDQUoyQjtBQUsvQixTQUFPLEVBQUUsVUFBVSxJQUFWLElBQWtCLFFBQVEsTUFBUixFQUFnQixHQUFoQixDQUFsQixDQUFGLElBQTZDLE9BQU8sT0FBTyxHQUFQLENBQVAsQ0FMckI7Q0FBakM7O0FBUUEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6Il9iYXNlVW5zZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUhhcyA9IHJlcXVpcmUoJy4vX2Jhc2VIYXMnKSxcbiAgICBjYXN0UGF0aCA9IHJlcXVpcmUoJy4vX2Nhc3RQYXRoJyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIGxhc3QgPSByZXF1aXJlKCcuL2xhc3QnKSxcbiAgICBwYXJlbnQgPSByZXF1aXJlKCcuL19wYXJlbnQnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5zZXRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIHVuc2V0LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBwcm9wZXJ0eSBpcyBkZWxldGVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbnNldChvYmplY3QsIHBhdGgpIHtcbiAgcGF0aCA9IGlzS2V5KHBhdGgsIG9iamVjdCkgPyBbcGF0aF0gOiBjYXN0UGF0aChwYXRoKTtcbiAgb2JqZWN0ID0gcGFyZW50KG9iamVjdCwgcGF0aCk7XG5cbiAgdmFyIGtleSA9IHRvS2V5KGxhc3QocGF0aCkpO1xuICByZXR1cm4gIShvYmplY3QgIT0gbnVsbCAmJiBiYXNlSGFzKG9iamVjdCwga2V5KSkgfHwgZGVsZXRlIG9iamVjdFtrZXldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbnNldDtcbiJdfQ==