'use strict';

var baseWrapperValue = require('./_baseWrapperValue'),
    getView = require('./_getView'),
    isArray = require('./isArray');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to indicate the type of lazy iteratees. */
var LAZY_FILTER_FLAG = 1,
    LAZY_MAP_FLAG = 2;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Extracts the unwrapped value from its lazy wrapper.
 *
 * @private
 * @name value
 * @memberOf LazyWrapper
 * @returns {*} Returns the unwrapped value.
 */
function lazyValue() {
  var array = this.__wrapped__.value(),
      dir = this.__dir__,
      isArr = isArray(array),
      isRight = dir < 0,
      arrLength = isArr ? array.length : 0,
      view = getView(0, arrLength, this.__views__),
      start = view.start,
      end = view.end,
      length = end - start,
      index = isRight ? end : start - 1,
      iteratees = this.__iteratees__,
      iterLength = iteratees.length,
      resIndex = 0,
      takeCount = nativeMin(length, this.__takeCount__);

  if (!isArr || arrLength < LARGE_ARRAY_SIZE || arrLength == length && takeCount == length) {
    return baseWrapperValue(array, this.__actions__);
  }
  var result = [];

  outer: while (length-- && resIndex < takeCount) {
    index += dir;

    var iterIndex = -1,
        value = array[index];

    while (++iterIndex < iterLength) {
      var data = iteratees[iterIndex],
          iteratee = data.iteratee,
          type = data.type,
          computed = iteratee(value);

      if (type == LAZY_MAP_FLAG) {
        value = computed;
      } else if (!computed) {
        if (type == LAZY_FILTER_FLAG) {
          continue outer;
        } else {
          break outer;
        }
      }
    }
    result[resIndex++] = value;
  }
  return result;
}

module.exports = lazyValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19sYXp5VmFsdWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLG1CQUFtQixRQUFRLHFCQUFSLENBQW5CO0lBQ0EsVUFBVSxRQUFRLFlBQVIsQ0FBVjtJQUNBLFVBQVUsUUFBUSxXQUFSLENBQVY7OztBQUdKLElBQUksbUJBQW1CLEdBQW5COzs7QUFHSixJQUFJLG1CQUFtQixDQUFuQjtJQUNBLGdCQUFnQixDQUFoQjs7O0FBR0osSUFBSSxZQUFZLEtBQUssR0FBTDs7Ozs7Ozs7OztBQVVoQixTQUFTLFNBQVQsR0FBcUI7QUFDbkIsTUFBSSxRQUFRLEtBQUssV0FBTCxDQUFpQixLQUFqQixFQUFSO01BQ0EsTUFBTSxLQUFLLE9BQUw7TUFDTixRQUFRLFFBQVEsS0FBUixDQUFSO01BQ0EsVUFBVSxNQUFNLENBQU47TUFDVixZQUFZLFFBQVEsTUFBTSxNQUFOLEdBQWUsQ0FBdkI7TUFDWixPQUFPLFFBQVEsQ0FBUixFQUFXLFNBQVgsRUFBc0IsS0FBSyxTQUFMLENBQTdCO01BQ0EsUUFBUSxLQUFLLEtBQUw7TUFDUixNQUFNLEtBQUssR0FBTDtNQUNOLFNBQVMsTUFBTSxLQUFOO01BQ1QsUUFBUSxVQUFVLEdBQVYsR0FBaUIsUUFBUSxDQUFSO01BQ3pCLFlBQVksS0FBSyxhQUFMO01BQ1osYUFBYSxVQUFVLE1BQVY7TUFDYixXQUFXLENBQVg7TUFDQSxZQUFZLFVBQVUsTUFBVixFQUFrQixLQUFLLGFBQUwsQ0FBOUIsQ0FkZTs7QUFnQm5CLE1BQUksQ0FBQyxLQUFELElBQVUsWUFBWSxnQkFBWixJQUNULGFBQWEsTUFBYixJQUF1QixhQUFhLE1BQWIsRUFBc0I7QUFDaEQsV0FBTyxpQkFBaUIsS0FBakIsRUFBd0IsS0FBSyxXQUFMLENBQS9CLENBRGdEO0dBRGxEO0FBSUEsTUFBSSxTQUFTLEVBQVQsQ0FwQmU7O0FBc0JuQixTQUNBLE9BQU8sWUFBWSxXQUFXLFNBQVgsRUFBc0I7QUFDdkMsYUFBUyxHQUFULENBRHVDOztBQUd2QyxRQUFJLFlBQVksQ0FBQyxDQUFEO1FBQ1osUUFBUSxNQUFNLEtBQU4sQ0FBUixDQUptQzs7QUFNdkMsV0FBTyxFQUFFLFNBQUYsR0FBYyxVQUFkLEVBQTBCO0FBQy9CLFVBQUksT0FBTyxVQUFVLFNBQVYsQ0FBUDtVQUNBLFdBQVcsS0FBSyxRQUFMO1VBQ1gsT0FBTyxLQUFLLElBQUw7VUFDUCxXQUFXLFNBQVMsS0FBVCxDQUFYLENBSjJCOztBQU0vQixVQUFJLFFBQVEsYUFBUixFQUF1QjtBQUN6QixnQkFBUSxRQUFSLENBRHlCO09BQTNCLE1BRU8sSUFBSSxDQUFDLFFBQUQsRUFBVztBQUNwQixZQUFJLFFBQVEsZ0JBQVIsRUFBMEI7QUFDNUIsbUJBQVMsS0FBVCxDQUQ0QjtTQUE5QixNQUVPO0FBQ0wsZ0JBQU0sS0FBTixDQURLO1NBRlA7T0FESztLQVJUO0FBZ0JBLFdBQU8sVUFBUCxJQUFxQixLQUFyQixDQXRCdUM7R0FBekM7QUF3QkEsU0FBTyxNQUFQLENBL0NtQjtDQUFyQjs7QUFrREEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6Il9sYXp5VmFsdWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVdyYXBwZXJWYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VXcmFwcGVyVmFsdWUnKSxcbiAgICBnZXRWaWV3ID0gcmVxdWlyZSgnLi9fZ2V0VmlldycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqIFVzZWQgdG8gaW5kaWNhdGUgdGhlIHR5cGUgb2YgbGF6eSBpdGVyYXRlZXMuICovXG52YXIgTEFaWV9GSUxURVJfRkxBRyA9IDEsXG4gICAgTEFaWV9NQVBfRkxBRyA9IDI7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBFeHRyYWN0cyB0aGUgdW53cmFwcGVkIHZhbHVlIGZyb20gaXRzIGxhenkgd3JhcHBlci5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgdmFsdWVcbiAqIEBtZW1iZXJPZiBMYXp5V3JhcHBlclxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHVud3JhcHBlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGF6eVZhbHVlKCkge1xuICB2YXIgYXJyYXkgPSB0aGlzLl9fd3JhcHBlZF9fLnZhbHVlKCksXG4gICAgICBkaXIgPSB0aGlzLl9fZGlyX18sXG4gICAgICBpc0FyciA9IGlzQXJyYXkoYXJyYXkpLFxuICAgICAgaXNSaWdodCA9IGRpciA8IDAsXG4gICAgICBhcnJMZW5ndGggPSBpc0FyciA/IGFycmF5Lmxlbmd0aCA6IDAsXG4gICAgICB2aWV3ID0gZ2V0VmlldygwLCBhcnJMZW5ndGgsIHRoaXMuX192aWV3c19fKSxcbiAgICAgIHN0YXJ0ID0gdmlldy5zdGFydCxcbiAgICAgIGVuZCA9IHZpZXcuZW5kLFxuICAgICAgbGVuZ3RoID0gZW5kIC0gc3RhcnQsXG4gICAgICBpbmRleCA9IGlzUmlnaHQgPyBlbmQgOiAoc3RhcnQgLSAxKSxcbiAgICAgIGl0ZXJhdGVlcyA9IHRoaXMuX19pdGVyYXRlZXNfXyxcbiAgICAgIGl0ZXJMZW5ndGggPSBpdGVyYXRlZXMubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgdGFrZUNvdW50ID0gbmF0aXZlTWluKGxlbmd0aCwgdGhpcy5fX3Rha2VDb3VudF9fKTtcblxuICBpZiAoIWlzQXJyIHx8IGFyckxlbmd0aCA8IExBUkdFX0FSUkFZX1NJWkUgfHxcbiAgICAgIChhcnJMZW5ndGggPT0gbGVuZ3RoICYmIHRha2VDb3VudCA9PSBsZW5ndGgpKSB7XG4gICAgcmV0dXJuIGJhc2VXcmFwcGVyVmFsdWUoYXJyYXksIHRoaXMuX19hY3Rpb25zX18pO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICBvdXRlcjpcbiAgd2hpbGUgKGxlbmd0aC0tICYmIHJlc0luZGV4IDwgdGFrZUNvdW50KSB7XG4gICAgaW5kZXggKz0gZGlyO1xuXG4gICAgdmFyIGl0ZXJJbmRleCA9IC0xLFxuICAgICAgICB2YWx1ZSA9IGFycmF5W2luZGV4XTtcblxuICAgIHdoaWxlICgrK2l0ZXJJbmRleCA8IGl0ZXJMZW5ndGgpIHtcbiAgICAgIHZhciBkYXRhID0gaXRlcmF0ZWVzW2l0ZXJJbmRleF0sXG4gICAgICAgICAgaXRlcmF0ZWUgPSBkYXRhLml0ZXJhdGVlLFxuICAgICAgICAgIHR5cGUgPSBkYXRhLnR5cGUsXG4gICAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSk7XG5cbiAgICAgIGlmICh0eXBlID09IExBWllfTUFQX0ZMQUcpIHtcbiAgICAgICAgdmFsdWUgPSBjb21wdXRlZDtcbiAgICAgIH0gZWxzZSBpZiAoIWNvbXB1dGVkKSB7XG4gICAgICAgIGlmICh0eXBlID09IExBWllfRklMVEVSX0ZMQUcpIHtcbiAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBicmVhayBvdXRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxhenlWYWx1ZTtcbiJdfQ==