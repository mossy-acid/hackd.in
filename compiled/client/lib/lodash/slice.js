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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NsaWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFoQjtJQUNJLGlCQUFpQixRQUFRLG1CQUFSLENBRHJCO0lBRUksWUFBWSxRQUFRLGFBQVIsQ0FGaEI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxTQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCLEtBQXRCLEVBQTZCLEdBQTdCLEVBQWtDO0FBQ2hDLE1BQUksU0FBUyxRQUFRLE1BQU0sTUFBZCxHQUF1QixDQUFwQztBQUNBLE1BQUksQ0FBQyxNQUFMLEVBQWE7QUFDWCxXQUFPLEVBQVA7QUFDRDtBQUNELE1BQUksT0FBTyxPQUFPLEdBQVAsSUFBYyxRQUFyQixJQUFpQyxlQUFlLEtBQWYsRUFBc0IsS0FBdEIsRUFBNkIsR0FBN0IsQ0FBckMsRUFBd0U7QUFDdEUsWUFBUSxDQUFSO0FBQ0EsVUFBTSxNQUFOO0FBQ0QsR0FIRCxNQUlLO0FBQ0gsWUFBUSxTQUFTLElBQVQsR0FBZ0IsQ0FBaEIsR0FBb0IsVUFBVSxLQUFWLENBQTVCO0FBQ0EsVUFBTSxRQUFRLFNBQVIsR0FBb0IsTUFBcEIsR0FBNkIsVUFBVSxHQUFWLENBQW5DO0FBQ0Q7QUFDRCxTQUFPLFVBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QixHQUF4QixDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLEtBQWpCIiwiZmlsZSI6InNsaWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VTbGljZSA9IHJlcXVpcmUoJy4vX2Jhc2VTbGljZScpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9faXNJdGVyYXRlZUNhbGwnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzbGljZSBvZiBgYXJyYXlgIGZyb20gYHN0YXJ0YCB1cCB0bywgYnV0IG5vdCBpbmNsdWRpbmcsIGBlbmRgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyB1c2VkIGluc3RlYWQgb2ZcbiAqIFtgQXJyYXkjc2xpY2VgXShodHRwczovL21kbi5pby9BcnJheS9zbGljZSkgdG8gZW5zdXJlIGRlbnNlIGFycmF5cyBhcmVcbiAqIHJldHVybmVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNsaWNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgcG9zaXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2VuZD1hcnJheS5sZW5ndGhdIFRoZSBlbmQgcG9zaXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHNsaWNlIG9mIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIHNsaWNlKGFycmF5LCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmIChlbmQgJiYgdHlwZW9mIGVuZCAhPSAnbnVtYmVyJyAmJiBpc0l0ZXJhdGVlQ2FsbChhcnJheSwgc3RhcnQsIGVuZCkpIHtcbiAgICBzdGFydCA9IDA7XG4gICAgZW5kID0gbGVuZ3RoO1xuICB9XG4gIGVsc2Uge1xuICAgIHN0YXJ0ID0gc3RhcnQgPT0gbnVsbCA/IDAgOiB0b0ludGVnZXIoc3RhcnQpO1xuICAgIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9JbnRlZ2VyKGVuZCk7XG4gIH1cbiAgcmV0dXJuIGJhc2VTbGljZShhcnJheSwgc3RhcnQsIGVuZCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2xpY2U7XG4iXX0=