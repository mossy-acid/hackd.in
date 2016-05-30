'use strict';

var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack();
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlSXNNYXRjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxRQUFRLFVBQVIsQ0FBWjtJQUNJLGNBQWMsUUFBUSxnQkFBUixDQURsQjs7O0FBSUEsSUFBSSx5QkFBeUIsQ0FBN0I7SUFDSSx1QkFBdUIsQ0FEM0I7Ozs7Ozs7Ozs7OztBQWFBLFNBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixNQUE3QixFQUFxQyxTQUFyQyxFQUFnRCxVQUFoRCxFQUE0RDtBQUMxRCxNQUFJLFFBQVEsVUFBVSxNQUF0QjtNQUNJLFNBQVMsS0FEYjtNQUVJLGVBQWUsQ0FBQyxVQUZwQjs7QUFJQSxNQUFJLFVBQVUsSUFBZCxFQUFvQjtBQUNsQixXQUFPLENBQUMsTUFBUjtBQUNEO0FBQ0QsV0FBUyxPQUFPLE1BQVAsQ0FBVDtBQUNBLFNBQU8sT0FBUCxFQUFnQjtBQUNkLFFBQUksT0FBTyxVQUFVLEtBQVYsQ0FBWDtBQUNBLFFBQUssZ0JBQWdCLEtBQUssQ0FBTCxDQUFqQixHQUNJLEtBQUssQ0FBTCxNQUFZLE9BQU8sS0FBSyxDQUFMLENBQVAsQ0FEaEIsR0FFSSxFQUFFLEtBQUssQ0FBTCxLQUFXLE1BQWIsQ0FGUixFQUdNO0FBQ0osYUFBTyxLQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU8sRUFBRSxLQUFGLEdBQVUsTUFBakIsRUFBeUI7QUFDdkIsV0FBTyxVQUFVLEtBQVYsQ0FBUDtBQUNBLFFBQUksTUFBTSxLQUFLLENBQUwsQ0FBVjtRQUNJLFdBQVcsT0FBTyxHQUFQLENBRGY7UUFFSSxXQUFXLEtBQUssQ0FBTCxDQUZmOztBQUlBLFFBQUksZ0JBQWdCLEtBQUssQ0FBTCxDQUFwQixFQUE2QjtBQUMzQixVQUFJLGFBQWEsU0FBYixJQUEwQixFQUFFLE9BQU8sTUFBVCxDQUE5QixFQUFnRDtBQUM5QyxlQUFPLEtBQVA7QUFDRDtBQUNGLEtBSkQsTUFJTztBQUNMLFVBQUksUUFBUSxJQUFJLEtBQUosRUFBWjtBQUNBLFVBQUksVUFBSixFQUFnQjtBQUNkLFlBQUksU0FBUyxXQUFXLFFBQVgsRUFBcUIsUUFBckIsRUFBK0IsR0FBL0IsRUFBb0MsTUFBcEMsRUFBNEMsTUFBNUMsRUFBb0QsS0FBcEQsQ0FBYjtBQUNEO0FBQ0QsVUFBSSxFQUFFLFdBQVcsU0FBWCxHQUNFLFlBQVksUUFBWixFQUFzQixRQUF0QixFQUFnQyxVQUFoQyxFQUE0Qyx5QkFBeUIsb0JBQXJFLEVBQTJGLEtBQTNGLENBREYsR0FFRSxNQUZKLENBQUosRUFHTztBQUNMLGVBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRjtBQUNELFNBQU8sSUFBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixXQUFqQiIsImZpbGUiOiJfYmFzZUlzTWF0Y2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGJhc2VJc0VxdWFsID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWwnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY29tcGFyaXNvbiBzdHlsZXMuICovXG52YXIgVU5PUkRFUkVEX0NPTVBBUkVfRkxBRyA9IDEsXG4gICAgUEFSVElBTF9DT01QQVJFX0ZMQUcgPSAyO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTWF0Y2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtBcnJheX0gbWF0Y2hEYXRhIFRoZSBwcm9wZXJ0eSBuYW1lcywgdmFsdWVzLCBhbmQgY29tcGFyZSBmbGFncyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBvYmplY3RgIGlzIGEgbWF0Y2gsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSwgY3VzdG9taXplcikge1xuICB2YXIgaW5kZXggPSBtYXRjaERhdGEubGVuZ3RoLFxuICAgICAgbGVuZ3RoID0gaW5kZXgsXG4gICAgICBub0N1c3RvbWl6ZXIgPSAhY3VzdG9taXplcjtcblxuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gIWxlbmd0aDtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgaWYgKChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSlcbiAgICAgICAgICA/IGRhdGFbMV0gIT09IG9iamVjdFtkYXRhWzBdXVxuICAgICAgICAgIDogIShkYXRhWzBdIGluIG9iamVjdClcbiAgICAgICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgdmFyIGtleSA9IGRhdGFbMF0sXG4gICAgICAgIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHNyY1ZhbHVlID0gZGF0YVsxXTtcblxuICAgIGlmIChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSkge1xuICAgICAgaWYgKG9ialZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFjayA9IG5ldyBTdGFjaztcbiAgICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSwgc3RhY2spO1xuICAgICAgfVxuICAgICAgaWYgKCEocmVzdWx0ID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gYmFzZUlzRXF1YWwoc3JjVmFsdWUsIG9ialZhbHVlLCBjdXN0b21pemVyLCBVTk9SREVSRURfQ09NUEFSRV9GTEFHIHwgUEFSVElBTF9DT01QQVJFX0ZMQUcsIHN0YWNrKVxuICAgICAgICAgICAgOiByZXN1bHRcbiAgICAgICAgICApKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTWF0Y2g7XG4iXX0=