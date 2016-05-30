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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlRmlsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxRQUFRLGFBQVIsQ0FBaEI7SUFDSSxXQUFXLFFBQVEsWUFBUixDQURmOzs7Ozs7Ozs7Ozs7QUFhQSxTQUFTLFFBQVQsQ0FBa0IsS0FBbEIsRUFBeUIsS0FBekIsRUFBZ0MsS0FBaEMsRUFBdUMsR0FBdkMsRUFBNEM7QUFDMUMsTUFBSSxTQUFTLE1BQU0sTUFBbkI7O0FBRUEsVUFBUSxVQUFVLEtBQVYsQ0FBUjtBQUNBLE1BQUksUUFBUSxDQUFaLEVBQWU7QUFDYixZQUFRLENBQUMsS0FBRCxHQUFTLE1BQVQsR0FBa0IsQ0FBbEIsR0FBdUIsU0FBUyxLQUF4QztBQUNEO0FBQ0QsUUFBTyxRQUFRLFNBQVIsSUFBcUIsTUFBTSxNQUE1QixHQUFzQyxNQUF0QyxHQUErQyxVQUFVLEdBQVYsQ0FBckQ7QUFDQSxNQUFJLE1BQU0sQ0FBVixFQUFhO0FBQ1gsV0FBTyxNQUFQO0FBQ0Q7QUFDRCxRQUFNLFFBQVEsR0FBUixHQUFjLENBQWQsR0FBa0IsU0FBUyxHQUFULENBQXhCO0FBQ0EsU0FBTyxRQUFRLEdBQWYsRUFBb0I7QUFDbEIsVUFBTSxPQUFOLElBQWlCLEtBQWpCO0FBQ0Q7QUFDRCxTQUFPLEtBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiX2Jhc2VGaWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyksXG4gICAgdG9MZW5ndGggPSByZXF1aXJlKCcuL3RvTGVuZ3RoJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmlsbGAgd2l0aG91dCBhbiBpdGVyYXRlZSBjYWxsIGd1YXJkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmlsbC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGZpbGwgYGFycmF5YCB3aXRoLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgcG9zaXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2VuZD1hcnJheS5sZW5ndGhdIFRoZSBlbmQgcG9zaXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZpbGwoYXJyYXksIHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgc3RhcnQgPSB0b0ludGVnZXIoc3RhcnQpO1xuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAtc3RhcnQgPiBsZW5ndGggPyAwIDogKGxlbmd0aCArIHN0YXJ0KTtcbiAgfVxuICBlbmQgPSAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gbGVuZ3RoKSA/IGxlbmd0aCA6IHRvSW50ZWdlcihlbmQpO1xuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5ndGg7XG4gIH1cbiAgZW5kID0gc3RhcnQgPiBlbmQgPyAwIDogdG9MZW5ndGgoZW5kKTtcbiAgd2hpbGUgKHN0YXJ0IDwgZW5kKSB7XG4gICAgYXJyYXlbc3RhcnQrK10gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZpbGw7XG4iXX0=