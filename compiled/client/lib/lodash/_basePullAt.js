'use strict';

var castPath = require('./_castPath'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
    last = require('./last'),
    parent = require('./_parent'),
    toKey = require('./_toKey');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * The base implementation of `_.pullAt` without support for individual
 * indexes or capturing the removed elements.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {number[]} indexes The indexes of elements to remove.
 * @returns {Array} Returns `array`.
 */
function basePullAt(array, indexes) {
  var length = array ? indexes.length : 0,
      lastIndex = length - 1;

  while (length--) {
    var index = indexes[length];
    if (length == lastIndex || index !== previous) {
      var previous = index;
      if (isIndex(index)) {
        splice.call(array, index, 1);
      } else if (!isKey(index, array)) {
        var path = castPath(index),
            object = parent(array, path);

        if (object != null) {
          delete object[toKey(last(path))];
        }
      } else {
        delete array[toKey(index)];
      }
    }
  }
  return array;
}

module.exports = basePullAt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlUHVsbEF0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLFFBQVEsYUFBUixDQUFYO0lBQ0EsVUFBVSxRQUFRLFlBQVIsQ0FBVjtJQUNBLFFBQVEsUUFBUSxVQUFSLENBQVI7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQO0lBQ0EsU0FBUyxRQUFRLFdBQVIsQ0FBVDtJQUNBLFFBQVEsUUFBUSxVQUFSLENBQVI7OztBQUdKLElBQUksYUFBYSxNQUFNLFNBQU47OztBQUdqQixJQUFJLFNBQVMsV0FBVyxNQUFYOzs7Ozs7Ozs7OztBQVdiLFNBQVMsVUFBVCxDQUFvQixLQUFwQixFQUEyQixPQUEzQixFQUFvQztBQUNsQyxNQUFJLFNBQVMsUUFBUSxRQUFRLE1BQVIsR0FBaUIsQ0FBekI7TUFDVCxZQUFZLFNBQVMsQ0FBVCxDQUZrQjs7QUFJbEMsU0FBTyxRQUFQLEVBQWlCO0FBQ2YsUUFBSSxRQUFRLFFBQVEsTUFBUixDQUFSLENBRFc7QUFFZixRQUFJLFVBQVUsU0FBVixJQUF1QixVQUFVLFFBQVYsRUFBb0I7QUFDN0MsVUFBSSxXQUFXLEtBQVgsQ0FEeUM7QUFFN0MsVUFBSSxRQUFRLEtBQVIsQ0FBSixFQUFvQjtBQUNsQixlQUFPLElBQVAsQ0FBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLENBQTFCLEVBRGtCO09BQXBCLE1BR0ssSUFBSSxDQUFDLE1BQU0sS0FBTixFQUFhLEtBQWIsQ0FBRCxFQUFzQjtBQUM3QixZQUFJLE9BQU8sU0FBUyxLQUFULENBQVA7WUFDQSxTQUFTLE9BQU8sS0FBUCxFQUFjLElBQWQsQ0FBVCxDQUZ5Qjs7QUFJN0IsWUFBSSxVQUFVLElBQVYsRUFBZ0I7QUFDbEIsaUJBQU8sT0FBTyxNQUFNLEtBQUssSUFBTCxDQUFOLENBQVAsQ0FBUCxDQURrQjtTQUFwQjtPQUpHLE1BUUE7QUFDSCxlQUFPLE1BQU0sTUFBTSxLQUFOLENBQU4sQ0FBUCxDQURHO09BUkE7S0FMUDtHQUZGO0FBb0JBLFNBQU8sS0FBUCxDQXhCa0M7Q0FBcEM7O0FBMkJBLE9BQU8sT0FBUCxHQUFpQixVQUFqQiIsImZpbGUiOiJfYmFzZVB1bGxBdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjYXN0UGF0aCA9IHJlcXVpcmUoJy4vX2Nhc3RQYXRoJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgbGFzdCA9IHJlcXVpcmUoJy4vbGFzdCcpLFxuICAgIHBhcmVudCA9IHJlcXVpcmUoJy4vX3BhcmVudCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnB1bGxBdGAgd2l0aG91dCBzdXBwb3J0IGZvciBpbmRpdmlkdWFsXG4gKiBpbmRleGVzIG9yIGNhcHR1cmluZyB0aGUgcmVtb3ZlZCBlbGVtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7bnVtYmVyW119IGluZGV4ZXMgVGhlIGluZGV4ZXMgb2YgZWxlbWVudHMgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VQdWxsQXQoYXJyYXksIGluZGV4ZXMpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gaW5kZXhlcy5sZW5ndGggOiAwLFxuICAgICAgbGFzdEluZGV4ID0gbGVuZ3RoIC0gMTtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICB2YXIgaW5kZXggPSBpbmRleGVzW2xlbmd0aF07XG4gICAgaWYgKGxlbmd0aCA9PSBsYXN0SW5kZXggfHwgaW5kZXggIT09IHByZXZpb3VzKSB7XG4gICAgICB2YXIgcHJldmlvdXMgPSBpbmRleDtcbiAgICAgIGlmIChpc0luZGV4KGluZGV4KSkge1xuICAgICAgICBzcGxpY2UuY2FsbChhcnJheSwgaW5kZXgsIDEpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIWlzS2V5KGluZGV4LCBhcnJheSkpIHtcbiAgICAgICAgdmFyIHBhdGggPSBjYXN0UGF0aChpbmRleCksXG4gICAgICAgICAgICBvYmplY3QgPSBwYXJlbnQoYXJyYXksIHBhdGgpO1xuXG4gICAgICAgIGlmIChvYmplY3QgIT0gbnVsbCkge1xuICAgICAgICAgIGRlbGV0ZSBvYmplY3RbdG9LZXkobGFzdChwYXRoKSldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZGVsZXRlIGFycmF5W3RvS2V5KGluZGV4KV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHVsbEF0O1xuIl19