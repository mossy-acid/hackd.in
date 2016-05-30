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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlUHVsbEF0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLFFBQVEsYUFBUixDQUFmO0lBQ0ksVUFBVSxRQUFRLFlBQVIsQ0FEZDtJQUVJLFFBQVEsUUFBUSxVQUFSLENBRlo7SUFHSSxPQUFPLFFBQVEsUUFBUixDQUhYO0lBSUksU0FBUyxRQUFRLFdBQVIsQ0FKYjtJQUtJLFFBQVEsUUFBUSxVQUFSLENBTFo7OztBQVFBLElBQUksYUFBYSxNQUFNLFNBQXZCOzs7QUFHQSxJQUFJLFNBQVMsV0FBVyxNQUF4Qjs7Ozs7Ozs7Ozs7QUFXQSxTQUFTLFVBQVQsQ0FBb0IsS0FBcEIsRUFBMkIsT0FBM0IsRUFBb0M7QUFDbEMsTUFBSSxTQUFTLFFBQVEsUUFBUSxNQUFoQixHQUF5QixDQUF0QztNQUNJLFlBQVksU0FBUyxDQUR6Qjs7QUFHQSxTQUFPLFFBQVAsRUFBaUI7QUFDZixRQUFJLFFBQVEsUUFBUSxNQUFSLENBQVo7QUFDQSxRQUFJLFVBQVUsU0FBVixJQUF1QixVQUFVLFFBQXJDLEVBQStDO0FBQzdDLFVBQUksV0FBVyxLQUFmO0FBQ0EsVUFBSSxRQUFRLEtBQVIsQ0FBSixFQUFvQjtBQUNsQixlQUFPLElBQVAsQ0FBWSxLQUFaLEVBQW1CLEtBQW5CLEVBQTBCLENBQTFCO0FBQ0QsT0FGRCxNQUdLLElBQUksQ0FBQyxNQUFNLEtBQU4sRUFBYSxLQUFiLENBQUwsRUFBMEI7QUFDN0IsWUFBSSxPQUFPLFNBQVMsS0FBVCxDQUFYO1lBQ0ksU0FBUyxPQUFPLEtBQVAsRUFBYyxJQUFkLENBRGI7O0FBR0EsWUFBSSxVQUFVLElBQWQsRUFBb0I7QUFDbEIsaUJBQU8sT0FBTyxNQUFNLEtBQUssSUFBTCxDQUFOLENBQVAsQ0FBUDtBQUNEO0FBQ0YsT0FQSSxNQVFBO0FBQ0gsZUFBTyxNQUFNLE1BQU0sS0FBTixDQUFOLENBQVA7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxTQUFPLEtBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoiX2Jhc2VQdWxsQXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIGxhc3QgPSByZXF1aXJlKCcuL2xhc3QnKSxcbiAgICBwYXJlbnQgPSByZXF1aXJlKCcuL19wYXJlbnQnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wdWxsQXRgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaW5kaXZpZHVhbFxuICogaW5kZXhlcyBvciBjYXB0dXJpbmcgdGhlIHJlbW92ZWQgZWxlbWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge251bWJlcltdfSBpbmRleGVzIFRoZSBpbmRleGVzIG9mIGVsZW1lbnRzIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBiYXNlUHVsbEF0KGFycmF5LCBpbmRleGVzKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGluZGV4ZXMubGVuZ3RoIDogMCxcbiAgICAgIGxhc3RJbmRleCA9IGxlbmd0aCAtIDE7XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgdmFyIGluZGV4ID0gaW5kZXhlc1tsZW5ndGhdO1xuICAgIGlmIChsZW5ndGggPT0gbGFzdEluZGV4IHx8IGluZGV4ICE9PSBwcmV2aW91cykge1xuICAgICAgdmFyIHByZXZpb3VzID0gaW5kZXg7XG4gICAgICBpZiAoaXNJbmRleChpbmRleCkpIHtcbiAgICAgICAgc3BsaWNlLmNhbGwoYXJyYXksIGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCFpc0tleShpbmRleCwgYXJyYXkpKSB7XG4gICAgICAgIHZhciBwYXRoID0gY2FzdFBhdGgoaW5kZXgpLFxuICAgICAgICAgICAgb2JqZWN0ID0gcGFyZW50KGFycmF5LCBwYXRoKTtcblxuICAgICAgICBpZiAob2JqZWN0ICE9IG51bGwpIHtcbiAgICAgICAgICBkZWxldGUgb2JqZWN0W3RvS2V5KGxhc3QocGF0aCkpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBhcnJheVt0b0tleShpbmRleCldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVB1bGxBdDtcbiJdfQ==