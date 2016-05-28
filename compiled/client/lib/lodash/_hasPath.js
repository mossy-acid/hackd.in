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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19oYXNQYXRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLFFBQVEsYUFBUixDQUFYO0lBQ0EsY0FBYyxRQUFRLGVBQVIsQ0FBZDtJQUNBLFVBQVUsUUFBUSxXQUFSLENBQVY7SUFDQSxVQUFVLFFBQVEsWUFBUixDQUFWO0lBQ0EsUUFBUSxRQUFRLFVBQVIsQ0FBUjtJQUNBLFdBQVcsUUFBUSxZQUFSLENBQVg7SUFDQSxXQUFXLFFBQVEsWUFBUixDQUFYO0lBQ0EsUUFBUSxRQUFRLFVBQVIsQ0FBUjs7Ozs7Ozs7Ozs7QUFXSixTQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUIsSUFBekIsRUFBK0IsT0FBL0IsRUFBd0M7QUFDdEMsU0FBTyxNQUFNLElBQU4sRUFBWSxNQUFaLElBQXNCLENBQUMsSUFBRCxDQUF0QixHQUErQixTQUFTLElBQVQsQ0FBL0IsQ0FEK0I7O0FBR3RDLE1BQUksTUFBSjtNQUNJLFFBQVEsQ0FBQyxDQUFEO01BQ1IsU0FBUyxLQUFLLE1BQUwsQ0FMeUI7O0FBT3RDLFNBQU8sRUFBRSxLQUFGLEdBQVUsTUFBVixFQUFrQjtBQUN2QixRQUFJLE1BQU0sTUFBTSxLQUFLLEtBQUwsQ0FBTixDQUFOLENBRG1CO0FBRXZCLFFBQUksRUFBRSxTQUFTLFVBQVUsSUFBVixJQUFrQixRQUFRLE1BQVIsRUFBZ0IsR0FBaEIsQ0FBbEIsQ0FBWCxFQUFvRDtBQUN0RCxZQURzRDtLQUF4RDtBQUdBLGFBQVMsT0FBTyxHQUFQLENBQVQsQ0FMdUI7R0FBekI7QUFPQSxNQUFJLE1BQUosRUFBWTtBQUNWLFdBQU8sTUFBUCxDQURVO0dBQVo7QUFHQSxNQUFJLFNBQVMsU0FBUyxPQUFPLE1BQVAsR0FBZ0IsQ0FBekIsQ0FqQnlCO0FBa0J0QyxTQUFPLENBQUMsQ0FBQyxNQUFELElBQVcsU0FBUyxNQUFULENBQVosSUFBZ0MsUUFBUSxHQUFSLEVBQWEsTUFBYixDQUFoQyxLQUNKLFFBQVEsTUFBUixLQUFtQixTQUFTLE1BQVQsQ0FBbkIsSUFBdUMsWUFBWSxNQUFaLENBQXZDLENBREksQ0FsQitCO0NBQXhDOztBQXNCQSxPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoiX2hhc1BhdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBpc1N0cmluZyA9IHJlcXVpcmUoJy4vaXNTdHJpbmcnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBleGlzdHMgb24gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFzRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2sgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBoYXNGdW5jKSB7XG4gIHBhdGggPSBpc0tleShwYXRoLCBvYmplY3QpID8gW3BhdGhdIDogY2FzdFBhdGgocGF0aCk7XG5cbiAgdmFyIHJlc3VsdCxcbiAgICAgIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSB0b0tleShwYXRoW2luZGV4XSk7XG4gICAgaWYgKCEocmVzdWx0ID0gb2JqZWN0ICE9IG51bGwgJiYgaGFzRnVuYyhvYmplY3QsIGtleSkpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgb2JqZWN0ID0gb2JqZWN0W2tleV07XG4gIH1cbiAgaWYgKHJlc3VsdCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IG9iamVjdCA/IG9iamVjdC5sZW5ndGggOiAwO1xuICByZXR1cm4gISFsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgaXNTdHJpbmcob2JqZWN0KSB8fCBpc0FyZ3VtZW50cyhvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNQYXRoO1xuIl19