'use strict';

var baseSlice = require('./_baseSlice'),
    isIterateeCall = require('./_isIterateeCall'),
    toInteger = require('./toInteger');

/**
 * Creates a slice of `array` from `start` up to, but not including, `end`.
 *
 * **Note:** This method is used instead of
 * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
 * returned.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function slice(array, start, end) {
  var length = array ? array.length : 0;
  if (!length) {
    return [];
  }
  if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
    start = 0;
    end = length;
  } else {
    start = start == null ? 0 : toInteger(start);
    end = end === undefined ? length : toInteger(end);
  }
  return baseSlice(array, start, end);
}

module.exports = slice;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NsaWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsaUJBQWlCLFFBQVEsbUJBQVIsQ0FBakI7SUFDQSxZQUFZLFFBQVEsYUFBUixDQUFaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkosU0FBUyxLQUFULENBQWUsS0FBZixFQUFzQixLQUF0QixFQUE2QixHQUE3QixFQUFrQztBQUNoQyxNQUFJLFNBQVMsUUFBUSxNQUFNLE1BQU4sR0FBZSxDQUF2QixDQURtQjtBQUVoQyxNQUFJLENBQUMsTUFBRCxFQUFTO0FBQ1gsV0FBTyxFQUFQLENBRFc7R0FBYjtBQUdBLE1BQUksT0FBTyxPQUFPLEdBQVAsSUFBYyxRQUFkLElBQTBCLGVBQWUsS0FBZixFQUFzQixLQUF0QixFQUE2QixHQUE3QixDQUFqQyxFQUFvRTtBQUN0RSxZQUFRLENBQVIsQ0FEc0U7QUFFdEUsVUFBTSxNQUFOLENBRnNFO0dBQXhFLE1BSUs7QUFDSCxZQUFRLFNBQVMsSUFBVCxHQUFnQixDQUFoQixHQUFvQixVQUFVLEtBQVYsQ0FBcEIsQ0FETDtBQUVILFVBQU0sUUFBUSxTQUFSLEdBQW9CLE1BQXBCLEdBQTZCLFVBQVUsR0FBVixDQUE3QixDQUZIO0dBSkw7QUFRQSxTQUFPLFVBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QixHQUF4QixDQUFQLENBYmdDO0NBQWxDOztBQWdCQSxPQUFPLE9BQVAsR0FBaUIsS0FBakIiLCJmaWxlIjoic2xpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVNsaWNlID0gcmVxdWlyZSgnLi9fYmFzZVNsaWNlJyksXG4gICAgaXNJdGVyYXRlZUNhbGwgPSByZXF1aXJlKCcuL19pc0l0ZXJhdGVlQ2FsbCcpLFxuICAgIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHNsaWNlIG9mIGBhcnJheWAgZnJvbSBgc3RhcnRgIHVwIHRvLCBidXQgbm90IGluY2x1ZGluZywgYGVuZGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIHVzZWQgaW5zdGVhZCBvZlxuICogW2BBcnJheSNzbGljZWBdKGh0dHBzOi8vbWRuLmlvL0FycmF5L3NsaWNlKSB0byBlbnN1cmUgZGVuc2UgYXJyYXlzIGFyZVxuICogcmV0dXJuZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2xpY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZW5kPWFycmF5Lmxlbmd0aF0gVGhlIGVuZCBwb3NpdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gc2xpY2UoYXJyYXksIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgaWYgKGVuZCAmJiB0eXBlb2YgZW5kICE9ICdudW1iZXInICYmIGlzSXRlcmF0ZWVDYWxsKGFycmF5LCBzdGFydCwgZW5kKSkge1xuICAgIHN0YXJ0ID0gMDtcbiAgICBlbmQgPSBsZW5ndGg7XG4gIH1cbiAgZWxzZSB7XG4gICAgc3RhcnQgPSBzdGFydCA9PSBudWxsID8gMCA6IHRvSW50ZWdlcihzdGFydCk7XG4gICAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0ludGVnZXIoZW5kKTtcbiAgfVxuICByZXR1cm4gYmFzZVNsaWNlKGFycmF5LCBzdGFydCwgZW5kKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzbGljZTtcbiJdfQ==