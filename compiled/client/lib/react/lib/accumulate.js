/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule accumulate
 */

'use strict';

var invariant = require('fbjs/lib/invariant');

/**
 * Accumulates items that must not be null or undefined.
 *
 * This is used to conserve memory by avoiding array allocations.
 *
 * @return {*|array<*>} An accumulation of items.
 */
function accumulate(current, next) {
  !(next != null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'accumulate(...): Accumulated items must be not be null or undefined.') : invariant(false) : undefined;
  if (current == null) {
    return next;
  } else {
    // Both are not empty. Warning: Never call x.concat(y) when you are not
    // certain that x is an Array (x could be a string with concat method).
    var currentIsArray = Array.isArray(current);
    var nextIsArray = Array.isArray(next);
    if (currentIsArray) {
      return current.concat(next);
    } else {
      if (nextIsArray) {
        return [current].concat(next);
      } else {
        return [current, next];
      }
    }
  }
}

module.exports = accumulate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2FjY3VtdWxhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFaOzs7Ozs7Ozs7QUFTSixTQUFTLFVBQVQsQ0FBb0IsT0FBcEIsRUFBNkIsSUFBN0IsRUFBbUM7QUFDakMsSUFBRSxRQUFRLElBQVIsQ0FBRixHQUFrQixRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFVBQVUsS0FBVixFQUFpQixzRUFBakIsQ0FBeEMsR0FBbUksVUFBVSxLQUFWLENBQW5JLEdBQXNKLFNBQXhLLENBRGlDO0FBRWpDLE1BQUksV0FBVyxJQUFYLEVBQWlCO0FBQ25CLFdBQU8sSUFBUCxDQURtQjtHQUFyQixNQUVPOzs7QUFHTCxRQUFJLGlCQUFpQixNQUFNLE9BQU4sQ0FBYyxPQUFkLENBQWpCLENBSEM7QUFJTCxRQUFJLGNBQWMsTUFBTSxPQUFOLENBQWMsSUFBZCxDQUFkLENBSkM7QUFLTCxRQUFJLGNBQUosRUFBb0I7QUFDbEIsYUFBTyxRQUFRLE1BQVIsQ0FBZSxJQUFmLENBQVAsQ0FEa0I7S0FBcEIsTUFFTztBQUNMLFVBQUksV0FBSixFQUFpQjtBQUNmLGVBQU8sQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFpQixJQUFqQixDQUFQLENBRGU7T0FBakIsTUFFTztBQUNMLGVBQU8sQ0FBQyxPQUFELEVBQVUsSUFBVixDQUFQLENBREs7T0FGUDtLQUhGO0dBUEY7Q0FGRjs7QUFxQkEsT0FBTyxPQUFQLEdBQWlCLFVBQWpCIiwiZmlsZSI6ImFjY3VtdWxhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgYWNjdW11bGF0ZVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuXG4vKipcbiAqIEFjY3VtdWxhdGVzIGl0ZW1zIHRoYXQgbXVzdCBub3QgYmUgbnVsbCBvciB1bmRlZmluZWQuXG4gKlxuICogVGhpcyBpcyB1c2VkIHRvIGNvbnNlcnZlIG1lbW9yeSBieSBhdm9pZGluZyBhcnJheSBhbGxvY2F0aW9ucy5cbiAqXG4gKiBAcmV0dXJuIHsqfGFycmF5PCo+fSBBbiBhY2N1bXVsYXRpb24gb2YgaXRlbXMuXG4gKi9cbmZ1bmN0aW9uIGFjY3VtdWxhdGUoY3VycmVudCwgbmV4dCkge1xuICAhKG5leHQgIT0gbnVsbCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnYWNjdW11bGF0ZSguLi4pOiBBY2N1bXVsYXRlZCBpdGVtcyBtdXN0IGJlIG5vdCBiZSBudWxsIG9yIHVuZGVmaW5lZC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gIGlmIChjdXJyZW50ID09IG51bGwpIHtcbiAgICByZXR1cm4gbmV4dDtcbiAgfSBlbHNlIHtcbiAgICAvLyBCb3RoIGFyZSBub3QgZW1wdHkuIFdhcm5pbmc6IE5ldmVyIGNhbGwgeC5jb25jYXQoeSkgd2hlbiB5b3UgYXJlIG5vdFxuICAgIC8vIGNlcnRhaW4gdGhhdCB4IGlzIGFuIEFycmF5ICh4IGNvdWxkIGJlIGEgc3RyaW5nIHdpdGggY29uY2F0IG1ldGhvZCkuXG4gICAgdmFyIGN1cnJlbnRJc0FycmF5ID0gQXJyYXkuaXNBcnJheShjdXJyZW50KTtcbiAgICB2YXIgbmV4dElzQXJyYXkgPSBBcnJheS5pc0FycmF5KG5leHQpO1xuICAgIGlmIChjdXJyZW50SXNBcnJheSkge1xuICAgICAgcmV0dXJuIGN1cnJlbnQuY29uY2F0KG5leHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobmV4dElzQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIFtjdXJyZW50XS5jb25jYXQobmV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW2N1cnJlbnQsIG5leHRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFjY3VtdWxhdGU7Il19