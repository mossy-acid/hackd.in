'use strict';

var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

module.exports = listCacheDelete;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19saXN0Q2FjaGVEZWxldGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGVBQWUsUUFBUSxpQkFBUixDQUFuQjs7O0FBR0EsSUFBSSxhQUFhLE1BQU0sU0FBdkI7OztBQUdBLElBQUksU0FBUyxXQUFXLE1BQXhCOzs7Ozs7Ozs7OztBQVdBLFNBQVMsZUFBVCxDQUF5QixHQUF6QixFQUE4QjtBQUM1QixNQUFJLE9BQU8sS0FBSyxRQUFoQjtNQUNJLFFBQVEsYUFBYSxJQUFiLEVBQW1CLEdBQW5CLENBRFo7O0FBR0EsTUFBSSxRQUFRLENBQVosRUFBZTtBQUNiLFdBQU8sS0FBUDtBQUNEO0FBQ0QsTUFBSSxZQUFZLEtBQUssTUFBTCxHQUFjLENBQTlCO0FBQ0EsTUFBSSxTQUFTLFNBQWIsRUFBd0I7QUFDdEIsU0FBSyxHQUFMO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBTyxJQUFQLENBQVksSUFBWixFQUFrQixLQUFsQixFQUF5QixDQUF6QjtBQUNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLGVBQWpCIiwiZmlsZSI6Il9saXN0Q2FjaGVEZWxldGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZURlbGV0ZTtcbiJdfQ==