'use strict';

var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
    isLength = require('./isLength'),
    isString = require('./isString'),
    toKey = require('./_toKey');

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isString(object) || isArguments(object));
}

module.exports = hasPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19oYXNQYXRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLFFBQVEsYUFBUixDQUFmO0lBQ0ksY0FBYyxRQUFRLGVBQVIsQ0FEbEI7SUFFSSxVQUFVLFFBQVEsV0FBUixDQUZkO0lBR0ksVUFBVSxRQUFRLFlBQVIsQ0FIZDtJQUlJLFFBQVEsUUFBUSxVQUFSLENBSlo7SUFLSSxXQUFXLFFBQVEsWUFBUixDQUxmO0lBTUksV0FBVyxRQUFRLFlBQVIsQ0FOZjtJQU9JLFFBQVEsUUFBUSxVQUFSLENBUFo7Ozs7Ozs7Ozs7O0FBa0JBLFNBQVMsT0FBVCxDQUFpQixNQUFqQixFQUF5QixJQUF6QixFQUErQixPQUEvQixFQUF3QztBQUN0QyxTQUFPLE1BQU0sSUFBTixFQUFZLE1BQVosSUFBc0IsQ0FBQyxJQUFELENBQXRCLEdBQStCLFNBQVMsSUFBVCxDQUF0Qzs7QUFFQSxNQUFJLE1BQUo7TUFDSSxRQUFRLENBQUMsQ0FEYjtNQUVJLFNBQVMsS0FBSyxNQUZsQjs7QUFJQSxTQUFPLEVBQUUsS0FBRixHQUFVLE1BQWpCLEVBQXlCO0FBQ3ZCLFFBQUksTUFBTSxNQUFNLEtBQUssS0FBTCxDQUFOLENBQVY7QUFDQSxRQUFJLEVBQUUsU0FBUyxVQUFVLElBQVYsSUFBa0IsUUFBUSxNQUFSLEVBQWdCLEdBQWhCLENBQTdCLENBQUosRUFBd0Q7QUFDdEQ7QUFDRDtBQUNELGFBQVMsT0FBTyxHQUFQLENBQVQ7QUFDRDtBQUNELE1BQUksTUFBSixFQUFZO0FBQ1YsV0FBTyxNQUFQO0FBQ0Q7QUFDRCxNQUFJLFNBQVMsU0FBUyxPQUFPLE1BQWhCLEdBQXlCLENBQXRDO0FBQ0EsU0FBTyxDQUFDLENBQUMsTUFBRixJQUFZLFNBQVMsTUFBVCxDQUFaLElBQWdDLFFBQVEsR0FBUixFQUFhLE1BQWIsQ0FBaEMsS0FDSixRQUFRLE1BQVIsS0FBbUIsU0FBUyxNQUFULENBQW5CLElBQXVDLFlBQVksTUFBWixDQURuQyxDQUFQO0FBRUQ7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6Il9oYXNQYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNTdHJpbmcgPSByZXF1aXJlKCcuL2lzU3RyaW5nJyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgcGF0aGAgZXhpc3RzIG9uIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjaGVjay5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhc0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrIHByb3BlcnRpZXMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHBhdGhgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNQYXRoKG9iamVjdCwgcGF0aCwgaGFzRnVuYykge1xuICBwYXRoID0gaXNLZXkocGF0aCwgb2JqZWN0KSA/IFtwYXRoXSA6IGNhc3RQYXRoKHBhdGgpO1xuXG4gIHZhciByZXN1bHQsXG4gICAgICBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gdG9LZXkocGF0aFtpbmRleF0pO1xuICAgIGlmICghKHJlc3VsdCA9IG9iamVjdCAhPSBudWxsICYmIGhhc0Z1bmMob2JqZWN0LCBrZXkpKSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIG9iamVjdCA9IG9iamVjdFtrZXldO1xuICB9XG4gIGlmIChyZXN1bHQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHZhciBsZW5ndGggPSBvYmplY3QgPyBvYmplY3QubGVuZ3RoIDogMDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiYgaXNJbmRleChrZXksIGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzU3RyaW5nKG9iamVjdCkgfHwgaXNBcmd1bWVudHMob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzUGF0aDtcbiJdfQ==