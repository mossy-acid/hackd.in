'use strict';

var arrayEachRight = require('./_arrayEachRight'),
    baseEachRight = require('./_baseEachRight'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * This method is like `_.forEach` except that it iterates over elements of
 * `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @alias eachRight
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEach
 * @example
 *
 * _.forEachRight([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `2` then `1`.
 */
function forEachRight(collection, iteratee) {
  var func = isArray(collection) ? arrayEachRight : baseEachRight;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = forEachRight;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZvckVhY2hSaWdodC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksaUJBQWlCLFFBQVEsbUJBQVIsQ0FBakI7SUFDQSxnQkFBZ0IsUUFBUSxrQkFBUixDQUFoQjtJQUNBLGVBQWUsUUFBUSxpQkFBUixDQUFmO0lBQ0EsVUFBVSxRQUFRLFdBQVIsQ0FBVjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCSixTQUFTLFlBQVQsQ0FBc0IsVUFBdEIsRUFBa0MsUUFBbEMsRUFBNEM7QUFDMUMsTUFBSSxPQUFPLFFBQVEsVUFBUixJQUFzQixjQUF0QixHQUF1QyxhQUF2QyxDQUQrQjtBQUUxQyxTQUFPLEtBQUssVUFBTCxFQUFpQixhQUFhLFFBQWIsRUFBdUIsQ0FBdkIsQ0FBakIsQ0FBUCxDQUYwQztDQUE1Qzs7QUFLQSxPQUFPLE9BQVAsR0FBaUIsWUFBakIiLCJmaWxlIjoiZm9yRWFjaFJpZ2h0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFycmF5RWFjaFJpZ2h0ID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoUmlnaHQnKSxcbiAgICBiYXNlRWFjaFJpZ2h0ID0gcmVxdWlyZSgnLi9fYmFzZUVhY2hSaWdodCcpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmZvckVhY2hgIGV4Y2VwdCB0aGF0IGl0IGl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2ZcbiAqIGBjb2xsZWN0aW9uYCBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjAuMFxuICogQGFsaWFzIGVhY2hSaWdodFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKiBAc2VlIF8uZm9yRWFjaFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZvckVhY2hSaWdodChbMSwgMl0sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyBgMmAgdGhlbiBgMWAuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2hSaWdodChjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICB2YXIgZnVuYyA9IGlzQXJyYXkoY29sbGVjdGlvbikgPyBhcnJheUVhY2hSaWdodCA6IGJhc2VFYWNoUmlnaHQ7XG4gIHJldHVybiBmdW5jKGNvbGxlY3Rpb24sIGJhc2VJdGVyYXRlZShpdGVyYXRlZSwgMykpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2hSaWdodDtcbiJdfQ==