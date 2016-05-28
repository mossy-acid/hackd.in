'use strict';

var assignValue = require('./_assignValue'),
    castPath = require('./_castPath'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
    isObject = require('./isObject'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]);
    if (isObject(nested)) {
      var newValue = value;
      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : undefined;
        if (newValue === undefined) {
          newValue = objValue == null ? isIndex(path[index + 1]) ? [] : {} : objValue;
        }
      }
      assignValue(nested, key, newValue);
    }
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlU2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLFdBQVcsUUFBUSxhQUFSLENBQVg7SUFDQSxVQUFVLFFBQVEsWUFBUixDQUFWO0lBQ0EsUUFBUSxRQUFRLFVBQVIsQ0FBUjtJQUNBLFdBQVcsUUFBUSxZQUFSLENBQVg7SUFDQSxRQUFRLFFBQVEsVUFBUixDQUFSOzs7Ozs7Ozs7Ozs7QUFZSixTQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUIsSUFBekIsRUFBK0IsS0FBL0IsRUFBc0MsVUFBdEMsRUFBa0Q7QUFDaEQsU0FBTyxNQUFNLElBQU4sRUFBWSxNQUFaLElBQXNCLENBQUMsSUFBRCxDQUF0QixHQUErQixTQUFTLElBQVQsQ0FBL0IsQ0FEeUM7O0FBR2hELE1BQUksUUFBUSxDQUFDLENBQUQ7TUFDUixTQUFTLEtBQUssTUFBTDtNQUNULFlBQVksU0FBUyxDQUFUO01BQ1osU0FBUyxNQUFULENBTjRDOztBQVFoRCxTQUFPLFVBQVUsSUFBVixJQUFrQixFQUFFLEtBQUYsR0FBVSxNQUFWLEVBQWtCO0FBQ3pDLFFBQUksTUFBTSxNQUFNLEtBQUssS0FBTCxDQUFOLENBQU4sQ0FEcUM7QUFFekMsUUFBSSxTQUFTLE1BQVQsQ0FBSixFQUFzQjtBQUNwQixVQUFJLFdBQVcsS0FBWCxDQURnQjtBQUVwQixVQUFJLFNBQVMsU0FBVCxFQUFvQjtBQUN0QixZQUFJLFdBQVcsT0FBTyxHQUFQLENBQVgsQ0FEa0I7QUFFdEIsbUJBQVcsYUFBYSxXQUFXLFFBQVgsRUFBcUIsR0FBckIsRUFBMEIsTUFBMUIsQ0FBYixHQUFpRCxTQUFqRCxDQUZXO0FBR3RCLFlBQUksYUFBYSxTQUFiLEVBQXdCO0FBQzFCLHFCQUFXLFlBQVksSUFBWixHQUNOLFFBQVEsS0FBSyxRQUFRLENBQVIsQ0FBYixJQUEyQixFQUEzQixHQUFnQyxFQUFoQyxHQUNELFFBRk8sQ0FEZTtTQUE1QjtPQUhGO0FBU0Esa0JBQVksTUFBWixFQUFvQixHQUFwQixFQUF5QixRQUF6QixFQVhvQjtLQUF0QjtBQWFBLGFBQVMsT0FBTyxHQUFQLENBQVQsQ0FmeUM7R0FBM0M7QUFpQkEsU0FBTyxNQUFQLENBekJnRDtDQUFsRDs7QUE0QkEsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6Il9iYXNlU2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBjYXN0UGF0aCA9IHJlcXVpcmUoJy4vX2Nhc3RQYXRoJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnNldGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBwYXRoIGNyZWF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZVNldChvYmplY3QsIHBhdGgsIHZhbHVlLCBjdXN0b21pemVyKSB7XG4gIHBhdGggPSBpc0tleShwYXRoLCBvYmplY3QpID8gW3BhdGhdIDogY2FzdFBhdGgocGF0aCk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aCxcbiAgICAgIGxhc3RJbmRleCA9IGxlbmd0aCAtIDEsXG4gICAgICBuZXN0ZWQgPSBvYmplY3Q7XG5cbiAgd2hpbGUgKG5lc3RlZCAhPSBudWxsICYmICsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gdG9LZXkocGF0aFtpbmRleF0pO1xuICAgIGlmIChpc09iamVjdChuZXN0ZWQpKSB7XG4gICAgICB2YXIgbmV3VmFsdWUgPSB2YWx1ZTtcbiAgICAgIGlmIChpbmRleCAhPSBsYXN0SW5kZXgpIHtcbiAgICAgICAgdmFyIG9ialZhbHVlID0gbmVzdGVkW2tleV07XG4gICAgICAgIG5ld1ZhbHVlID0gY3VzdG9taXplciA/IGN1c3RvbWl6ZXIob2JqVmFsdWUsIGtleSwgbmVzdGVkKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IG9ialZhbHVlID09IG51bGxcbiAgICAgICAgICAgID8gKGlzSW5kZXgocGF0aFtpbmRleCArIDFdKSA/IFtdIDoge30pXG4gICAgICAgICAgICA6IG9ialZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhc3NpZ25WYWx1ZShuZXN0ZWQsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgICBuZXN0ZWQgPSBuZXN0ZWRba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXQ7XG4iXX0=