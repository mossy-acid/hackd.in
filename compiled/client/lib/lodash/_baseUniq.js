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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlVW5pcS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxRQUFRLGFBQVIsQ0FBZjtJQUNJLGdCQUFnQixRQUFRLGtCQUFSLENBRHBCO0lBRUksb0JBQW9CLFFBQVEsc0JBQVIsQ0FGeEI7SUFHSSxXQUFXLFFBQVEsYUFBUixDQUhmO0lBSUksWUFBWSxRQUFRLGNBQVIsQ0FKaEI7SUFLSSxhQUFhLFFBQVEsZUFBUixDQUxqQjs7O0FBUUEsSUFBSSxtQkFBbUIsR0FBdkI7Ozs7Ozs7Ozs7O0FBV0EsU0FBUyxRQUFULENBQWtCLEtBQWxCLEVBQXlCLFFBQXpCLEVBQW1DLFVBQW5DLEVBQStDO0FBQzdDLE1BQUksUUFBUSxDQUFDLENBQWI7TUFDSSxXQUFXLGFBRGY7TUFFSSxTQUFTLE1BQU0sTUFGbkI7TUFHSSxXQUFXLElBSGY7TUFJSSxTQUFTLEVBSmI7TUFLSSxPQUFPLE1BTFg7O0FBT0EsTUFBSSxVQUFKLEVBQWdCO0FBQ2QsZUFBVyxLQUFYO0FBQ0EsZUFBVyxpQkFBWDtBQUNELEdBSEQsTUFJSyxJQUFJLFVBQVUsZ0JBQWQsRUFBZ0M7QUFDbkMsUUFBSSxNQUFNLFdBQVcsSUFBWCxHQUFrQixVQUFVLEtBQVYsQ0FBNUI7QUFDQSxRQUFJLEdBQUosRUFBUztBQUNQLGFBQU8sV0FBVyxHQUFYLENBQVA7QUFDRDtBQUNELGVBQVcsS0FBWDtBQUNBLGVBQVcsUUFBWDtBQUNBLFdBQU8sSUFBSSxRQUFKLEVBQVA7QUFDRCxHQVJJLE1BU0E7QUFDSCxXQUFPLFdBQVcsRUFBWCxHQUFnQixNQUF2QjtBQUNEO0FBQ0QsU0FDQSxPQUFPLEVBQUUsS0FBRixHQUFVLE1BQWpCLEVBQXlCO0FBQ3ZCLFFBQUksUUFBUSxNQUFNLEtBQU4sQ0FBWjtRQUNJLFdBQVcsV0FBVyxTQUFTLEtBQVQsQ0FBWCxHQUE2QixLQUQ1Qzs7QUFHQSxZQUFTLGNBQWMsVUFBVSxDQUF6QixHQUE4QixLQUE5QixHQUFzQyxDQUE5QztBQUNBLFFBQUksWUFBWSxhQUFhLFFBQTdCLEVBQXVDO0FBQ3JDLFVBQUksWUFBWSxLQUFLLE1BQXJCO0FBQ0EsYUFBTyxXQUFQLEVBQW9CO0FBQ2xCLFlBQUksS0FBSyxTQUFMLE1BQW9CLFFBQXhCLEVBQWtDO0FBQ2hDLG1CQUFTLEtBQVQ7QUFDRDtBQUNGO0FBQ0QsVUFBSSxRQUFKLEVBQWM7QUFDWixhQUFLLElBQUwsQ0FBVSxRQUFWO0FBQ0Q7QUFDRCxhQUFPLElBQVAsQ0FBWSxLQUFaO0FBQ0QsS0FYRCxNQVlLLElBQUksQ0FBQyxTQUFTLElBQVQsRUFBZSxRQUFmLEVBQXlCLFVBQXpCLENBQUwsRUFBMkM7QUFDOUMsVUFBSSxTQUFTLE1BQWIsRUFBcUI7QUFDbkIsYUFBSyxJQUFMLENBQVUsUUFBVjtBQUNEO0FBQ0QsYUFBTyxJQUFQLENBQVksS0FBWjtBQUNEO0FBQ0Y7QUFDRCxTQUFPLE1BQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiX2Jhc2VVbmlxLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFNldENhY2hlID0gcmVxdWlyZSgnLi9fU2V0Q2FjaGUnKSxcbiAgICBhcnJheUluY2x1ZGVzID0gcmVxdWlyZSgnLi9fYXJyYXlJbmNsdWRlcycpLFxuICAgIGFycmF5SW5jbHVkZXNXaXRoID0gcmVxdWlyZSgnLi9fYXJyYXlJbmNsdWRlc1dpdGgnKSxcbiAgICBjYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2NhY2hlSGFzJyksXG4gICAgY3JlYXRlU2V0ID0gcmVxdWlyZSgnLi9fY3JlYXRlU2V0JyksXG4gICAgc2V0VG9BcnJheSA9IHJlcXVpcmUoJy4vX3NldFRvQXJyYXknKTtcblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmlxQnlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWVdIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmF0b3JdIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBkdXBsaWNhdGUgZnJlZSBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuaXEoYXJyYXksIGl0ZXJhdGVlLCBjb21wYXJhdG9yKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgaW5jbHVkZXMgPSBhcnJheUluY2x1ZGVzLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgaXNDb21tb24gPSB0cnVlLFxuICAgICAgcmVzdWx0ID0gW10sXG4gICAgICBzZWVuID0gcmVzdWx0O1xuXG4gIGlmIChjb21wYXJhdG9yKSB7XG4gICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICBpbmNsdWRlcyA9IGFycmF5SW5jbHVkZXNXaXRoO1xuICB9XG4gIGVsc2UgaWYgKGxlbmd0aCA+PSBMQVJHRV9BUlJBWV9TSVpFKSB7XG4gICAgdmFyIHNldCA9IGl0ZXJhdGVlID8gbnVsbCA6IGNyZWF0ZVNldChhcnJheSk7XG4gICAgaWYgKHNldCkge1xuICAgICAgcmV0dXJuIHNldFRvQXJyYXkoc2V0KTtcbiAgICB9XG4gICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICBpbmNsdWRlcyA9IGNhY2hlSGFzO1xuICAgIHNlZW4gPSBuZXcgU2V0Q2FjaGU7XG4gIH1cbiAgZWxzZSB7XG4gICAgc2VlbiA9IGl0ZXJhdGVlID8gW10gOiByZXN1bHQ7XG4gIH1cbiAgb3V0ZXI6XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUpIDogdmFsdWU7XG5cbiAgICB2YWx1ZSA9IChjb21wYXJhdG9yIHx8IHZhbHVlICE9PSAwKSA/IHZhbHVlIDogMDtcbiAgICBpZiAoaXNDb21tb24gJiYgY29tcHV0ZWQgPT09IGNvbXB1dGVkKSB7XG4gICAgICB2YXIgc2VlbkluZGV4ID0gc2Vlbi5sZW5ndGg7XG4gICAgICB3aGlsZSAoc2VlbkluZGV4LS0pIHtcbiAgICAgICAgaWYgKHNlZW5bc2VlbkluZGV4XSA9PT0gY29tcHV0ZWQpIHtcbiAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZXJhdGVlKSB7XG4gICAgICAgIHNlZW4ucHVzaChjb21wdXRlZCk7XG4gICAgICB9XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCFpbmNsdWRlcyhzZWVuLCBjb21wdXRlZCwgY29tcGFyYXRvcikpIHtcbiAgICAgIGlmIChzZWVuICE9PSByZXN1bHQpIHtcbiAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVW5pcTtcbiJdfQ==