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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlVW5zZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsUUFBUSxZQUFSLENBQWQ7SUFDSSxXQUFXLFFBQVEsYUFBUixDQURmO0lBRUksUUFBUSxRQUFRLFVBQVIsQ0FGWjtJQUdJLE9BQU8sUUFBUSxRQUFSLENBSFg7SUFJSSxTQUFTLFFBQVEsV0FBUixDQUpiO0lBS0ksUUFBUSxRQUFRLFVBQVIsQ0FMWjs7Ozs7Ozs7OztBQWVBLFNBQVMsU0FBVCxDQUFtQixNQUFuQixFQUEyQixJQUEzQixFQUFpQztBQUMvQixTQUFPLE1BQU0sSUFBTixFQUFZLE1BQVosSUFBc0IsQ0FBQyxJQUFELENBQXRCLEdBQStCLFNBQVMsSUFBVCxDQUF0QztBQUNBLFdBQVMsT0FBTyxNQUFQLEVBQWUsSUFBZixDQUFUOztBQUVBLE1BQUksTUFBTSxNQUFNLEtBQUssSUFBTCxDQUFOLENBQVY7QUFDQSxTQUFPLEVBQUUsVUFBVSxJQUFWLElBQWtCLFFBQVEsTUFBUixFQUFnQixHQUFoQixDQUFwQixLQUE2QyxPQUFPLE9BQU8sR0FBUCxDQUEzRDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJfYmFzZVVuc2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VIYXMgPSByZXF1aXJlKCcuL19iYXNlSGFzJyksXG4gICAgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBsYXN0ID0gcmVxdWlyZSgnLi9sYXN0JyksXG4gICAgcGFyZW50ID0gcmVxdWlyZSgnLi9fcGFyZW50JyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuc2V0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byB1bnNldC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgcHJvcGVydHkgaXMgZGVsZXRlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlVW5zZXQob2JqZWN0LCBwYXRoKSB7XG4gIHBhdGggPSBpc0tleShwYXRoLCBvYmplY3QpID8gW3BhdGhdIDogY2FzdFBhdGgocGF0aCk7XG4gIG9iamVjdCA9IHBhcmVudChvYmplY3QsIHBhdGgpO1xuXG4gIHZhciBrZXkgPSB0b0tleShsYXN0KHBhdGgpKTtcbiAgcmV0dXJuICEob2JqZWN0ICE9IG51bGwgJiYgYmFzZUhhcyhvYmplY3QsIGtleSkpIHx8IGRlbGV0ZSBvYmplY3Rba2V5XTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVW5zZXQ7XG4iXX0=