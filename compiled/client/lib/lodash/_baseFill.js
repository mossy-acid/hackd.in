'use strict';

var toInteger = require('./toInteger'),
    toLength = require('./toLength');

/**
 * The base implementation of `_.fill` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to fill.
 * @param {*} value The value to fill `array` with.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns `array`.
 */
function baseFill(array, value, start, end) {
  var length = array.length;

  start = toInteger(start);
  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end === undefined || end > length ? length : toInteger(end);
  if (end < 0) {
    end += length;
  }
  end = start > end ? 0 : toLength(end);
  while (start < end) {
    array[start++] = value;
  }
  return array;
}

module.exports = baseFill;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlRmlsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxRQUFRLGFBQVIsQ0FBWjtJQUNBLFdBQVcsUUFBUSxZQUFSLENBQVg7Ozs7Ozs7Ozs7OztBQVlKLFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUF5QixLQUF6QixFQUFnQyxLQUFoQyxFQUF1QyxHQUF2QyxFQUE0QztBQUMxQyxNQUFJLFNBQVMsTUFBTSxNQUFOLENBRDZCOztBQUcxQyxVQUFRLFVBQVUsS0FBVixDQUFSLENBSDBDO0FBSTFDLE1BQUksUUFBUSxDQUFSLEVBQVc7QUFDYixZQUFRLENBQUMsS0FBRCxHQUFTLE1BQVQsR0FBa0IsQ0FBbEIsR0FBdUIsU0FBUyxLQUFULENBRGxCO0dBQWY7QUFHQSxRQUFNLEdBQUMsS0FBUSxTQUFSLElBQXFCLE1BQU0sTUFBTixHQUFnQixNQUF0QyxHQUErQyxVQUFVLEdBQVYsQ0FBL0MsQ0FQb0M7QUFRMUMsTUFBSSxNQUFNLENBQU4sRUFBUztBQUNYLFdBQU8sTUFBUCxDQURXO0dBQWI7QUFHQSxRQUFNLFFBQVEsR0FBUixHQUFjLENBQWQsR0FBa0IsU0FBUyxHQUFULENBQWxCLENBWG9DO0FBWTFDLFNBQU8sUUFBUSxHQUFSLEVBQWE7QUFDbEIsVUFBTSxPQUFOLElBQWlCLEtBQWpCLENBRGtCO0dBQXBCO0FBR0EsU0FBTyxLQUFQLENBZjBDO0NBQTVDOztBQWtCQSxPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiX2Jhc2VGaWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyksXG4gICAgdG9MZW5ndGggPSByZXF1aXJlKCcuL3RvTGVuZ3RoJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmlsbGAgd2l0aG91dCBhbiBpdGVyYXRlZSBjYWxsIGd1YXJkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmlsbC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGZpbGwgYGFycmF5YCB3aXRoLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgcG9zaXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2VuZD1hcnJheS5sZW5ndGhdIFRoZSBlbmQgcG9zaXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZpbGwoYXJyYXksIHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgc3RhcnQgPSB0b0ludGVnZXIoc3RhcnQpO1xuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAtc3RhcnQgPiBsZW5ndGggPyAwIDogKGxlbmd0aCArIHN0YXJ0KTtcbiAgfVxuICBlbmQgPSAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gbGVuZ3RoKSA/IGxlbmd0aCA6IHRvSW50ZWdlcihlbmQpO1xuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5ndGg7XG4gIH1cbiAgZW5kID0gc3RhcnQgPiBlbmQgPyAwIDogdG9MZW5ndGgoZW5kKTtcbiAgd2hpbGUgKHN0YXJ0IDwgZW5kKSB7XG4gICAgYXJyYXlbc3RhcnQrK10gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZpbGw7XG4iXX0=