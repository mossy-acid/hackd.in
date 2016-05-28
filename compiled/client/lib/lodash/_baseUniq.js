'use strict';

var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    cacheHas = require('./_cacheHas'),
    createSet = require('./_createSet'),
    setToArray = require('./_setToArray');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  } else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache();
  } else {
    seen = iteratee ? [] : result;
  }
  outer: while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = comparator || value !== 0 ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    } else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlVW5pcS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxRQUFRLGFBQVIsQ0FBWDtJQUNBLGdCQUFnQixRQUFRLGtCQUFSLENBQWhCO0lBQ0Esb0JBQW9CLFFBQVEsc0JBQVIsQ0FBcEI7SUFDQSxXQUFXLFFBQVEsYUFBUixDQUFYO0lBQ0EsWUFBWSxRQUFRLGNBQVIsQ0FBWjtJQUNBLGFBQWEsUUFBUSxlQUFSLENBQWI7OztBQUdKLElBQUksbUJBQW1CLEdBQW5COzs7Ozs7Ozs7OztBQVdKLFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUF5QixRQUF6QixFQUFtQyxVQUFuQyxFQUErQztBQUM3QyxNQUFJLFFBQVEsQ0FBQyxDQUFEO01BQ1IsV0FBVyxhQUFYO01BQ0EsU0FBUyxNQUFNLE1BQU47TUFDVCxXQUFXLElBQVg7TUFDQSxTQUFTLEVBQVQ7TUFDQSxPQUFPLE1BQVAsQ0FOeUM7O0FBUTdDLE1BQUksVUFBSixFQUFnQjtBQUNkLGVBQVcsS0FBWCxDQURjO0FBRWQsZUFBVyxpQkFBWCxDQUZjO0dBQWhCLE1BSUssSUFBSSxVQUFVLGdCQUFWLEVBQTRCO0FBQ25DLFFBQUksTUFBTSxXQUFXLElBQVgsR0FBa0IsVUFBVSxLQUFWLENBQWxCLENBRHlCO0FBRW5DLFFBQUksR0FBSixFQUFTO0FBQ1AsYUFBTyxXQUFXLEdBQVgsQ0FBUCxDQURPO0tBQVQ7QUFHQSxlQUFXLEtBQVgsQ0FMbUM7QUFNbkMsZUFBVyxRQUFYLENBTm1DO0FBT25DLFdBQU8sSUFBSSxRQUFKLEVBQVAsQ0FQbUM7R0FBaEMsTUFTQTtBQUNILFdBQU8sV0FBVyxFQUFYLEdBQWdCLE1BQWhCLENBREo7R0FUQTtBQVlMLFNBQ0EsT0FBTyxFQUFFLEtBQUYsR0FBVSxNQUFWLEVBQWtCO0FBQ3ZCLFFBQUksUUFBUSxNQUFNLEtBQU4sQ0FBUjtRQUNBLFdBQVcsV0FBVyxTQUFTLEtBQVQsQ0FBWCxHQUE2QixLQUE3QixDQUZROztBQUl2QixZQUFRLFVBQUMsSUFBYyxVQUFVLENBQVYsR0FBZSxLQUE5QixHQUFzQyxDQUF0QyxDQUplO0FBS3ZCLFFBQUksWUFBWSxhQUFhLFFBQWIsRUFBdUI7QUFDckMsVUFBSSxZQUFZLEtBQUssTUFBTCxDQURxQjtBQUVyQyxhQUFPLFdBQVAsRUFBb0I7QUFDbEIsWUFBSSxLQUFLLFNBQUwsTUFBb0IsUUFBcEIsRUFBOEI7QUFDaEMsbUJBQVMsS0FBVCxDQURnQztTQUFsQztPQURGO0FBS0EsVUFBSSxRQUFKLEVBQWM7QUFDWixhQUFLLElBQUwsQ0FBVSxRQUFWLEVBRFk7T0FBZDtBQUdBLGFBQU8sSUFBUCxDQUFZLEtBQVosRUFWcUM7S0FBdkMsTUFZSyxJQUFJLENBQUMsU0FBUyxJQUFULEVBQWUsUUFBZixFQUF5QixVQUF6QixDQUFELEVBQXVDO0FBQzlDLFVBQUksU0FBUyxNQUFULEVBQWlCO0FBQ25CLGFBQUssSUFBTCxDQUFVLFFBQVYsRUFEbUI7T0FBckI7QUFHQSxhQUFPLElBQVAsQ0FBWSxLQUFaLEVBSjhDO0tBQTNDO0dBakJQO0FBd0JBLFNBQU8sTUFBUCxDQWpENkM7Q0FBL0M7O0FBb0RBLE9BQU8sT0FBUCxHQUFpQixRQUFqQiIsImZpbGUiOiJfYmFzZVVuaXEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU2V0Q2FjaGUgPSByZXF1aXJlKCcuL19TZXRDYWNoZScpLFxuICAgIGFycmF5SW5jbHVkZXMgPSByZXF1aXJlKCcuL19hcnJheUluY2x1ZGVzJyksXG4gICAgYXJyYXlJbmNsdWRlc1dpdGggPSByZXF1aXJlKCcuL19hcnJheUluY2x1ZGVzV2l0aCcpLFxuICAgIGNhY2hlSGFzID0gcmVxdWlyZSgnLi9fY2FjaGVIYXMnKSxcbiAgICBjcmVhdGVTZXQgPSByZXF1aXJlKCcuL19jcmVhdGVTZXQnKSxcbiAgICBzZXRUb0FycmF5ID0gcmVxdWlyZSgnLi9fc2V0VG9BcnJheScpO1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuaXFCeWAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZV0gVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyYXRvcl0gVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGR1cGxpY2F0ZSBmcmVlIGFycmF5LlxuICovXG5mdW5jdGlvbiBiYXNlVW5pcShhcnJheSwgaXRlcmF0ZWUsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBpbmNsdWRlcyA9IGFycmF5SW5jbHVkZXMsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBpc0NvbW1vbiA9IHRydWUsXG4gICAgICByZXN1bHQgPSBbXSxcbiAgICAgIHNlZW4gPSByZXN1bHQ7XG5cbiAgaWYgKGNvbXBhcmF0b3IpIHtcbiAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgIGluY2x1ZGVzID0gYXJyYXlJbmNsdWRlc1dpdGg7XG4gIH1cbiAgZWxzZSBpZiAobGVuZ3RoID49IExBUkdFX0FSUkFZX1NJWkUpIHtcbiAgICB2YXIgc2V0ID0gaXRlcmF0ZWUgPyBudWxsIDogY3JlYXRlU2V0KGFycmF5KTtcbiAgICBpZiAoc2V0KSB7XG4gICAgICByZXR1cm4gc2V0VG9BcnJheShzZXQpO1xuICAgIH1cbiAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgIGluY2x1ZGVzID0gY2FjaGVIYXM7XG4gICAgc2VlbiA9IG5ldyBTZXRDYWNoZTtcbiAgfVxuICBlbHNlIHtcbiAgICBzZWVuID0gaXRlcmF0ZWUgPyBbXSA6IHJlc3VsdDtcbiAgfVxuICBvdXRlcjpcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSkgOiB2YWx1ZTtcblxuICAgIHZhbHVlID0gKGNvbXBhcmF0b3IgfHwgdmFsdWUgIT09IDApID8gdmFsdWUgOiAwO1xuICAgIGlmIChpc0NvbW1vbiAmJiBjb21wdXRlZCA9PT0gY29tcHV0ZWQpIHtcbiAgICAgIHZhciBzZWVuSW5kZXggPSBzZWVuLmxlbmd0aDtcbiAgICAgIHdoaWxlIChzZWVuSW5kZXgtLSkge1xuICAgICAgICBpZiAoc2VlbltzZWVuSW5kZXhdID09PSBjb21wdXRlZCkge1xuICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXRlcmF0ZWUpIHtcbiAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIWluY2x1ZGVzKHNlZW4sIGNvbXB1dGVkLCBjb21wYXJhdG9yKSkge1xuICAgICAgaWYgKHNlZW4gIT09IHJlc3VsdCkge1xuICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgfVxuICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmlxO1xuIl19