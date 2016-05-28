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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlSW50ZXJzZWN0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLFFBQVEsYUFBUixDQUFYO0lBQ0EsZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBaEI7SUFDQSxvQkFBb0IsUUFBUSxzQkFBUixDQUFwQjtJQUNBLFdBQVcsUUFBUSxhQUFSLENBQVg7SUFDQSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsV0FBVyxRQUFRLGFBQVIsQ0FBWDs7O0FBR0osSUFBSSxZQUFZLEtBQUssR0FBTDs7Ozs7Ozs7Ozs7O0FBWWhCLFNBQVMsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0MsUUFBbEMsRUFBNEMsVUFBNUMsRUFBd0Q7QUFDdEQsTUFBSSxXQUFXLGFBQWEsaUJBQWIsR0FBaUMsYUFBakM7TUFDWCxTQUFTLE9BQU8sQ0FBUCxFQUFVLE1BQVY7TUFDVCxZQUFZLE9BQU8sTUFBUDtNQUNaLFdBQVcsU0FBWDtNQUNBLFNBQVMsTUFBTSxTQUFOLENBQVQ7TUFDQSxZQUFZLFFBQVo7TUFDQSxTQUFTLEVBQVQsQ0FQa0Q7O0FBU3RELFNBQU8sVUFBUCxFQUFtQjtBQUNqQixRQUFJLFFBQVEsT0FBTyxRQUFQLENBQVIsQ0FEYTtBQUVqQixRQUFJLFlBQVksUUFBWixFQUFzQjtBQUN4QixjQUFRLFNBQVMsS0FBVCxFQUFnQixVQUFVLFFBQVYsQ0FBaEIsQ0FBUixDQUR3QjtLQUExQjtBQUdBLGdCQUFZLFVBQVUsTUFBTSxNQUFOLEVBQWMsU0FBeEIsQ0FBWixDQUxpQjtBQU1qQixXQUFPLFFBQVAsSUFBbUIsQ0FBQyxVQUFELEtBQWdCLFlBQWEsVUFBVSxHQUFWLElBQWlCLE1BQU0sTUFBTixJQUFnQixHQUFoQixDQUE5QyxHQUNmLElBQUksUUFBSixDQUFhLFlBQVksS0FBWixDQURFLEdBRWYsU0FGZSxDQU5GO0dBQW5CO0FBVUEsVUFBUSxPQUFPLENBQVAsQ0FBUixDQW5Cc0Q7O0FBcUJ0RCxNQUFJLFFBQVEsQ0FBQyxDQUFEO01BQ1IsT0FBTyxPQUFPLENBQVAsQ0FBUCxDQXRCa0Q7O0FBd0J0RCxTQUNBLE9BQU8sRUFBRSxLQUFGLEdBQVUsTUFBVixJQUFvQixPQUFPLE1BQVAsR0FBZ0IsU0FBaEIsRUFBMkI7QUFDcEQsUUFBSSxRQUFRLE1BQU0sS0FBTixDQUFSO1FBQ0EsV0FBVyxXQUFXLFNBQVMsS0FBVCxDQUFYLEdBQTZCLEtBQTdCLENBRnFDOztBQUlwRCxZQUFRLFVBQUMsSUFBYyxVQUFVLENBQVYsR0FBZSxLQUE5QixHQUFzQyxDQUF0QyxDQUo0QztBQUtwRCxRQUFJLEVBQUUsT0FDRSxTQUFTLElBQVQsRUFBZSxRQUFmLENBREYsR0FFRSxTQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsVUFBM0IsQ0FGRixDQUFGLEVBR0c7QUFDTCxpQkFBVyxTQUFYLENBREs7QUFFTCxhQUFPLEVBQUUsUUFBRixFQUFZO0FBQ2pCLFlBQUksUUFBUSxPQUFPLFFBQVAsQ0FBUixDQURhO0FBRWpCLFlBQUksRUFBRSxRQUNFLFNBQVMsS0FBVCxFQUFnQixRQUFoQixDQURGLEdBRUUsU0FBUyxPQUFPLFFBQVAsQ0FBVCxFQUEyQixRQUEzQixFQUFxQyxVQUFyQyxDQUZGLENBQUYsRUFHRTtBQUNKLG1CQUFTLEtBQVQsQ0FESTtTQUhOO09BRkY7QUFTQSxVQUFJLElBQUosRUFBVTtBQUNSLGFBQUssSUFBTCxDQUFVLFFBQVYsRUFEUTtPQUFWO0FBR0EsYUFBTyxJQUFQLENBQVksS0FBWixFQWRLO0tBSFA7R0FMRjtBQXlCQSxTQUFPLE1BQVAsQ0FsRHNEO0NBQXhEOztBQXFEQSxPQUFPLE9BQVAsR0FBaUIsZ0JBQWpCIiwiZmlsZSI6Il9iYXNlSW50ZXJzZWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFNldENhY2hlID0gcmVxdWlyZSgnLi9fU2V0Q2FjaGUnKSxcbiAgICBhcnJheUluY2x1ZGVzID0gcmVxdWlyZSgnLi9fYXJyYXlJbmNsdWRlcycpLFxuICAgIGFycmF5SW5jbHVkZXNXaXRoID0gcmVxdWlyZSgnLi9fYXJyYXlJbmNsdWRlc1dpdGgnKSxcbiAgICBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgY2FjaGVIYXMgPSByZXF1aXJlKCcuL19jYWNoZUhhcycpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgbWV0aG9kcyBsaWtlIGBfLmludGVyc2VjdGlvbmAsIHdpdGhvdXQgc3VwcG9ydFxuICogZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMsIHRoYXQgYWNjZXB0cyBhbiBhcnJheSBvZiBhcnJheXMgdG8gaW5zcGVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXlzIFRoZSBhcnJheXMgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZV0gVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyYXRvcl0gVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIHNoYXJlZCB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbnRlcnNlY3Rpb24oYXJyYXlzLCBpdGVyYXRlZSwgY29tcGFyYXRvcikge1xuICB2YXIgaW5jbHVkZXMgPSBjb21wYXJhdG9yID8gYXJyYXlJbmNsdWRlc1dpdGggOiBhcnJheUluY2x1ZGVzLFxuICAgICAgbGVuZ3RoID0gYXJyYXlzWzBdLmxlbmd0aCxcbiAgICAgIG90aExlbmd0aCA9IGFycmF5cy5sZW5ndGgsXG4gICAgICBvdGhJbmRleCA9IG90aExlbmd0aCxcbiAgICAgIGNhY2hlcyA9IEFycmF5KG90aExlbmd0aCksXG4gICAgICBtYXhMZW5ndGggPSBJbmZpbml0eSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlIChvdGhJbmRleC0tKSB7XG4gICAgdmFyIGFycmF5ID0gYXJyYXlzW290aEluZGV4XTtcbiAgICBpZiAob3RoSW5kZXggJiYgaXRlcmF0ZWUpIHtcbiAgICAgIGFycmF5ID0gYXJyYXlNYXAoYXJyYXksIGJhc2VVbmFyeShpdGVyYXRlZSkpO1xuICAgIH1cbiAgICBtYXhMZW5ndGggPSBuYXRpdmVNaW4oYXJyYXkubGVuZ3RoLCBtYXhMZW5ndGgpO1xuICAgIGNhY2hlc1tvdGhJbmRleF0gPSAhY29tcGFyYXRvciAmJiAoaXRlcmF0ZWUgfHwgKGxlbmd0aCA+PSAxMjAgJiYgYXJyYXkubGVuZ3RoID49IDEyMCkpXG4gICAgICA/IG5ldyBTZXRDYWNoZShvdGhJbmRleCAmJiBhcnJheSlcbiAgICAgIDogdW5kZWZpbmVkO1xuICB9XG4gIGFycmF5ID0gYXJyYXlzWzBdO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgc2VlbiA9IGNhY2hlc1swXTtcblxuICBvdXRlcjpcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGggJiYgcmVzdWx0Lmxlbmd0aCA8IG1heExlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlKSA6IHZhbHVlO1xuXG4gICAgdmFsdWUgPSAoY29tcGFyYXRvciB8fCB2YWx1ZSAhPT0gMCkgPyB2YWx1ZSA6IDA7XG4gICAgaWYgKCEoc2VlblxuICAgICAgICAgID8gY2FjaGVIYXMoc2VlbiwgY29tcHV0ZWQpXG4gICAgICAgICAgOiBpbmNsdWRlcyhyZXN1bHQsIGNvbXB1dGVkLCBjb21wYXJhdG9yKVxuICAgICAgICApKSB7XG4gICAgICBvdGhJbmRleCA9IG90aExlbmd0aDtcbiAgICAgIHdoaWxlICgtLW90aEluZGV4KSB7XG4gICAgICAgIHZhciBjYWNoZSA9IGNhY2hlc1tvdGhJbmRleF07XG4gICAgICAgIGlmICghKGNhY2hlXG4gICAgICAgICAgICAgID8gY2FjaGVIYXMoY2FjaGUsIGNvbXB1dGVkKVxuICAgICAgICAgICAgICA6IGluY2x1ZGVzKGFycmF5c1tvdGhJbmRleF0sIGNvbXB1dGVkLCBjb21wYXJhdG9yKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc2Vlbikge1xuICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgfVxuICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJbnRlcnNlY3Rpb247XG4iXX0=