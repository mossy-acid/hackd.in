'use strict';

var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    arrayMap = require('./_arrayMap'),
    baseUnary = require('./_baseUnary'),
    cacheHas = require('./_cacheHas');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith : arrayIncludes,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap(array, baseUnary(iteratee));
    }
    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined;
  }
  array = arrays[0];

  var index = -1,
      seen = caches[0];

  outer: while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = comparator || value !== 0 ? value : 0;
    if (!(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
      othIndex = othLength;
      while (--othIndex) {
        var cache = caches[othIndex];
        if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseIntersection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlSW50ZXJzZWN0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLFFBQVEsYUFBUixDQUFmO0lBQ0ksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FEcEI7SUFFSSxvQkFBb0IsUUFBUSxzQkFBUixDQUZ4QjtJQUdJLFdBQVcsUUFBUSxhQUFSLENBSGY7SUFJSSxZQUFZLFFBQVEsY0FBUixDQUpoQjtJQUtJLFdBQVcsUUFBUSxhQUFSLENBTGY7OztBQVFBLElBQUksWUFBWSxLQUFLLEdBQXJCOzs7Ozs7Ozs7Ozs7QUFZQSxTQUFTLGdCQUFULENBQTBCLE1BQTFCLEVBQWtDLFFBQWxDLEVBQTRDLFVBQTVDLEVBQXdEO0FBQ3RELE1BQUksV0FBVyxhQUFhLGlCQUFiLEdBQWlDLGFBQWhEO01BQ0ksU0FBUyxPQUFPLENBQVAsRUFBVSxNQUR2QjtNQUVJLFlBQVksT0FBTyxNQUZ2QjtNQUdJLFdBQVcsU0FIZjtNQUlJLFNBQVMsTUFBTSxTQUFOLENBSmI7TUFLSSxZQUFZLFFBTGhCO01BTUksU0FBUyxFQU5iOztBQVFBLFNBQU8sVUFBUCxFQUFtQjtBQUNqQixRQUFJLFFBQVEsT0FBTyxRQUFQLENBQVo7QUFDQSxRQUFJLFlBQVksUUFBaEIsRUFBMEI7QUFDeEIsY0FBUSxTQUFTLEtBQVQsRUFBZ0IsVUFBVSxRQUFWLENBQWhCLENBQVI7QUFDRDtBQUNELGdCQUFZLFVBQVUsTUFBTSxNQUFoQixFQUF3QixTQUF4QixDQUFaO0FBQ0EsV0FBTyxRQUFQLElBQW1CLENBQUMsVUFBRCxLQUFnQixZQUFhLFVBQVUsR0FBVixJQUFpQixNQUFNLE1BQU4sSUFBZ0IsR0FBOUQsSUFDZixJQUFJLFFBQUosQ0FBYSxZQUFZLEtBQXpCLENBRGUsR0FFZixTQUZKO0FBR0Q7QUFDRCxVQUFRLE9BQU8sQ0FBUCxDQUFSOztBQUVBLE1BQUksUUFBUSxDQUFDLENBQWI7TUFDSSxPQUFPLE9BQU8sQ0FBUCxDQURYOztBQUdBLFNBQ0EsT0FBTyxFQUFFLEtBQUYsR0FBVSxNQUFWLElBQW9CLE9BQU8sTUFBUCxHQUFnQixTQUEzQyxFQUFzRDtBQUNwRCxRQUFJLFFBQVEsTUFBTSxLQUFOLENBQVo7UUFDSSxXQUFXLFdBQVcsU0FBUyxLQUFULENBQVgsR0FBNkIsS0FENUM7O0FBR0EsWUFBUyxjQUFjLFVBQVUsQ0FBekIsR0FBOEIsS0FBOUIsR0FBc0MsQ0FBOUM7QUFDQSxRQUFJLEVBQUUsT0FDRSxTQUFTLElBQVQsRUFBZSxRQUFmLENBREYsR0FFRSxTQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsVUFBM0IsQ0FGSixDQUFKLEVBR087QUFDTCxpQkFBVyxTQUFYO0FBQ0EsYUFBTyxFQUFFLFFBQVQsRUFBbUI7QUFDakIsWUFBSSxRQUFRLE9BQU8sUUFBUCxDQUFaO0FBQ0EsWUFBSSxFQUFFLFFBQ0UsU0FBUyxLQUFULEVBQWdCLFFBQWhCLENBREYsR0FFRSxTQUFTLE9BQU8sUUFBUCxDQUFULEVBQTJCLFFBQTNCLEVBQXFDLFVBQXJDLENBRkosQ0FBSixFQUdNO0FBQ0osbUJBQVMsS0FBVDtBQUNEO0FBQ0Y7QUFDRCxVQUFJLElBQUosRUFBVTtBQUNSLGFBQUssSUFBTCxDQUFVLFFBQVY7QUFDRDtBQUNELGFBQU8sSUFBUCxDQUFZLEtBQVo7QUFDRDtBQUNGO0FBQ0QsU0FBTyxNQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLGdCQUFqQiIsImZpbGUiOiJfYmFzZUludGVyc2VjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBTZXRDYWNoZSA9IHJlcXVpcmUoJy4vX1NldENhY2hlJyksXG4gICAgYXJyYXlJbmNsdWRlcyA9IHJlcXVpcmUoJy4vX2FycmF5SW5jbHVkZXMnKSxcbiAgICBhcnJheUluY2x1ZGVzV2l0aCA9IHJlcXVpcmUoJy4vX2FycmF5SW5jbHVkZXNXaXRoJyksXG4gICAgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIGNhY2hlSGFzID0gcmVxdWlyZSgnLi9fY2FjaGVIYXMnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIG1ldGhvZHMgbGlrZSBgXy5pbnRlcnNlY3Rpb25gLCB3aXRob3V0IHN1cHBvcnRcbiAqIGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLCB0aGF0IGFjY2VwdHMgYW4gYXJyYXkgb2YgYXJyYXlzIHRvIGluc3BlY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5cyBUaGUgYXJyYXlzIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWVdIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmF0b3JdIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBzaGFyZWQgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBiYXNlSW50ZXJzZWN0aW9uKGFycmF5cywgaXRlcmF0ZWUsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGluY2x1ZGVzID0gY29tcGFyYXRvciA/IGFycmF5SW5jbHVkZXNXaXRoIDogYXJyYXlJbmNsdWRlcyxcbiAgICAgIGxlbmd0aCA9IGFycmF5c1swXS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBhcnJheXMubGVuZ3RoLFxuICAgICAgb3RoSW5kZXggPSBvdGhMZW5ndGgsXG4gICAgICBjYWNoZXMgPSBBcnJheShvdGhMZW5ndGgpLFxuICAgICAgbWF4TGVuZ3RoID0gSW5maW5pdHksXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAob3RoSW5kZXgtLSkge1xuICAgIHZhciBhcnJheSA9IGFycmF5c1tvdGhJbmRleF07XG4gICAgaWYgKG90aEluZGV4ICYmIGl0ZXJhdGVlKSB7XG4gICAgICBhcnJheSA9IGFycmF5TWFwKGFycmF5LCBiYXNlVW5hcnkoaXRlcmF0ZWUpKTtcbiAgICB9XG4gICAgbWF4TGVuZ3RoID0gbmF0aXZlTWluKGFycmF5Lmxlbmd0aCwgbWF4TGVuZ3RoKTtcbiAgICBjYWNoZXNbb3RoSW5kZXhdID0gIWNvbXBhcmF0b3IgJiYgKGl0ZXJhdGVlIHx8IChsZW5ndGggPj0gMTIwICYmIGFycmF5Lmxlbmd0aCA+PSAxMjApKVxuICAgICAgPyBuZXcgU2V0Q2FjaGUob3RoSW5kZXggJiYgYXJyYXkpXG4gICAgICA6IHVuZGVmaW5lZDtcbiAgfVxuICBhcnJheSA9IGFycmF5c1swXTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHNlZW4gPSBjYWNoZXNbMF07XG5cbiAgb3V0ZXI6XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoICYmIHJlc3VsdC5sZW5ndGggPCBtYXhMZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSkgOiB2YWx1ZTtcblxuICAgIHZhbHVlID0gKGNvbXBhcmF0b3IgfHwgdmFsdWUgIT09IDApID8gdmFsdWUgOiAwO1xuICAgIGlmICghKHNlZW5cbiAgICAgICAgICA/IGNhY2hlSGFzKHNlZW4sIGNvbXB1dGVkKVxuICAgICAgICAgIDogaW5jbHVkZXMocmVzdWx0LCBjb21wdXRlZCwgY29tcGFyYXRvcilcbiAgICAgICAgKSkge1xuICAgICAgb3RoSW5kZXggPSBvdGhMZW5ndGg7XG4gICAgICB3aGlsZSAoLS1vdGhJbmRleCkge1xuICAgICAgICB2YXIgY2FjaGUgPSBjYWNoZXNbb3RoSW5kZXhdO1xuICAgICAgICBpZiAoIShjYWNoZVxuICAgICAgICAgICAgICA/IGNhY2hlSGFzKGNhY2hlLCBjb21wdXRlZClcbiAgICAgICAgICAgICAgOiBpbmNsdWRlcyhhcnJheXNbb3RoSW5kZXhdLCBjb21wdXRlZCwgY29tcGFyYXRvcikpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHNlZW4pIHtcbiAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSW50ZXJzZWN0aW9uO1xuIl19