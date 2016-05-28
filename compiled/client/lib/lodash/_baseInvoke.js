'use strict';

var apply = require('./_apply'),
    castPath = require('./_castPath'),
    isKey = require('./_isKey'),
    last = require('./last'),
    parent = require('./_parent'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.invoke` without support for individual
 * method arguments.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {Array} args The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 */
function baseInvoke(object, path, args) {
  if (!isKey(path, object)) {
    path = castPath(path);
    object = parent(object, path);
    path = last(path);
  }
  var func = object == null ? object : object[toKey(path)];
  return func == null ? undefined : apply(func, object, args);
}

module.exports = baseInvoke;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlSW52b2tlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxRQUFRLFFBQVEsVUFBUixDQUFSO0lBQ0EsV0FBVyxRQUFRLGFBQVIsQ0FBWDtJQUNBLFFBQVEsUUFBUSxVQUFSLENBQVI7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQO0lBQ0EsU0FBUyxRQUFRLFdBQVIsQ0FBVDtJQUNBLFFBQVEsUUFBUSxVQUFSLENBQVI7Ozs7Ozs7Ozs7OztBQVlKLFNBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QixJQUE1QixFQUFrQyxJQUFsQyxFQUF3QztBQUN0QyxNQUFJLENBQUMsTUFBTSxJQUFOLEVBQVksTUFBWixDQUFELEVBQXNCO0FBQ3hCLFdBQU8sU0FBUyxJQUFULENBQVAsQ0FEd0I7QUFFeEIsYUFBUyxPQUFPLE1BQVAsRUFBZSxJQUFmLENBQVQsQ0FGd0I7QUFHeEIsV0FBTyxLQUFLLElBQUwsQ0FBUCxDQUh3QjtHQUExQjtBQUtBLE1BQUksT0FBTyxVQUFVLElBQVYsR0FBaUIsTUFBakIsR0FBMEIsT0FBTyxNQUFNLElBQU4sQ0FBUCxDQUExQixDQU4yQjtBQU90QyxTQUFPLFFBQVEsSUFBUixHQUFlLFNBQWYsR0FBMkIsTUFBTSxJQUFOLEVBQVksTUFBWixFQUFvQixJQUFwQixDQUEzQixDQVArQjtDQUF4Qzs7QUFVQSxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoiX2Jhc2VJbnZva2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpLFxuICAgIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgbGFzdCA9IHJlcXVpcmUoJy4vbGFzdCcpLFxuICAgIHBhcmVudCA9IHJlcXVpcmUoJy4vX3BhcmVudCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pbnZva2VgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaW5kaXZpZHVhbFxuICogbWV0aG9kIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIG1ldGhvZCB0byBpbnZva2UuXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIHRoZSBtZXRob2Qgd2l0aC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGludm9rZWQgbWV0aG9kLlxuICovXG5mdW5jdGlvbiBiYXNlSW52b2tlKG9iamVjdCwgcGF0aCwgYXJncykge1xuICBpZiAoIWlzS2V5KHBhdGgsIG9iamVjdCkpIHtcbiAgICBwYXRoID0gY2FzdFBhdGgocGF0aCk7XG4gICAgb2JqZWN0ID0gcGFyZW50KG9iamVjdCwgcGF0aCk7XG4gICAgcGF0aCA9IGxhc3QocGF0aCk7XG4gIH1cbiAgdmFyIGZ1bmMgPSBvYmplY3QgPT0gbnVsbCA/IG9iamVjdCA6IG9iamVjdFt0b0tleShwYXRoKV07XG4gIHJldHVybiBmdW5jID09IG51bGwgPyB1bmRlZmluZWQgOiBhcHBseShmdW5jLCBvYmplY3QsIGFyZ3MpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJbnZva2U7XG4iXX0=