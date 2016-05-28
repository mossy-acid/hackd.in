'use strict';

var baseClamp = require('./_baseClamp'),
    baseRandom = require('./_baseRandom'),
    isIterateeCall = require('./_isIterateeCall'),
    toArray = require('./toArray'),
    toInteger = require('./toInteger');

/**
 * Gets `n` random elements at unique keys from `collection` up to the
 * size of `collection`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to sample.
 * @param {number} [n=1] The number of elements to sample.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the random elements.
 * @example
 *
 * _.sampleSize([1, 2, 3], 2);
 * // => [3, 1]
 *
 * _.sampleSize([1, 2, 3], 4);
 * // => [2, 3, 1]
 */
function sampleSize(collection, n, guard) {
  var index = -1,
      result = toArray(collection),
      length = result.length,
      lastIndex = length - 1;

  if (guard ? isIterateeCall(collection, n, guard) : n === undefined) {
    n = 1;
  } else {
    n = baseClamp(toInteger(n), 0, length);
  }
  while (++index < n) {
    var rand = baseRandom(index, lastIndex),
        value = result[rand];

    result[rand] = result[index];
    result[index] = value;
  }
  result.length = n;
  return result;
}

module.exports = sampleSize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NhbXBsZVNpemUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxjQUFSLENBQVo7SUFDQSxhQUFhLFFBQVEsZUFBUixDQUFiO0lBQ0EsaUJBQWlCLFFBQVEsbUJBQVIsQ0FBakI7SUFDQSxVQUFVLFFBQVEsV0FBUixDQUFWO0lBQ0EsWUFBWSxRQUFRLGFBQVIsQ0FBWjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCSixTQUFTLFVBQVQsQ0FBb0IsVUFBcEIsRUFBZ0MsQ0FBaEMsRUFBbUMsS0FBbkMsRUFBMEM7QUFDeEMsTUFBSSxRQUFRLENBQUMsQ0FBRDtNQUNSLFNBQVMsUUFBUSxVQUFSLENBQVQ7TUFDQSxTQUFTLE9BQU8sTUFBUDtNQUNULFlBQVksU0FBUyxDQUFULENBSndCOztBQU14QyxNQUFLLFFBQVEsZUFBZSxVQUFmLEVBQTJCLENBQTNCLEVBQThCLEtBQTlCLENBQVIsR0FBK0MsTUFBTSxTQUFOLEVBQWtCO0FBQ3BFLFFBQUksQ0FBSixDQURvRTtHQUF0RSxNQUVPO0FBQ0wsUUFBSSxVQUFVLFVBQVUsQ0FBVixDQUFWLEVBQXdCLENBQXhCLEVBQTJCLE1BQTNCLENBQUosQ0FESztHQUZQO0FBS0EsU0FBTyxFQUFFLEtBQUYsR0FBVSxDQUFWLEVBQWE7QUFDbEIsUUFBSSxPQUFPLFdBQVcsS0FBWCxFQUFrQixTQUFsQixDQUFQO1FBQ0EsUUFBUSxPQUFPLElBQVAsQ0FBUixDQUZjOztBQUlsQixXQUFPLElBQVAsSUFBZSxPQUFPLEtBQVAsQ0FBZixDQUprQjtBQUtsQixXQUFPLEtBQVAsSUFBZ0IsS0FBaEIsQ0FMa0I7R0FBcEI7QUFPQSxTQUFPLE1BQVAsR0FBZ0IsQ0FBaEIsQ0FsQndDO0FBbUJ4QyxTQUFPLE1BQVAsQ0FuQndDO0NBQTFDOztBQXNCQSxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoic2FtcGxlU2l6ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlQ2xhbXAgPSByZXF1aXJlKCcuL19iYXNlQ2xhbXAnKSxcbiAgICBiYXNlUmFuZG9tID0gcmVxdWlyZSgnLi9fYmFzZVJhbmRvbScpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9faXNJdGVyYXRlZUNhbGwnKSxcbiAgICB0b0FycmF5ID0gcmVxdWlyZSgnLi90b0FycmF5JyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKTtcblxuLyoqXG4gKiBHZXRzIGBuYCByYW5kb20gZWxlbWVudHMgYXQgdW5pcXVlIGtleXMgZnJvbSBgY29sbGVjdGlvbmAgdXAgdG8gdGhlXG4gKiBzaXplIG9mIGBjb2xsZWN0aW9uYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gc2FtcGxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFtuPTFdIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gc2FtcGxlLlxuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgcmFuZG9tIGVsZW1lbnRzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnNhbXBsZVNpemUoWzEsIDIsIDNdLCAyKTtcbiAqIC8vID0+IFszLCAxXVxuICpcbiAqIF8uc2FtcGxlU2l6ZShbMSwgMiwgM10sIDQpO1xuICogLy8gPT4gWzIsIDMsIDFdXG4gKi9cbmZ1bmN0aW9uIHNhbXBsZVNpemUoY29sbGVjdGlvbiwgbiwgZ3VhcmQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSB0b0FycmF5KGNvbGxlY3Rpb24pLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aCxcbiAgICAgIGxhc3RJbmRleCA9IGxlbmd0aCAtIDE7XG5cbiAgaWYgKChndWFyZCA/IGlzSXRlcmF0ZWVDYWxsKGNvbGxlY3Rpb24sIG4sIGd1YXJkKSA6IG4gPT09IHVuZGVmaW5lZCkpIHtcbiAgICBuID0gMTtcbiAgfSBlbHNlIHtcbiAgICBuID0gYmFzZUNsYW1wKHRvSW50ZWdlcihuKSwgMCwgbGVuZ3RoKTtcbiAgfVxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICB2YXIgcmFuZCA9IGJhc2VSYW5kb20oaW5kZXgsIGxhc3RJbmRleCksXG4gICAgICAgIHZhbHVlID0gcmVzdWx0W3JhbmRdO1xuXG4gICAgcmVzdWx0W3JhbmRdID0gcmVzdWx0W2luZGV4XTtcbiAgICByZXN1bHRbaW5kZXhdID0gdmFsdWU7XG4gIH1cbiAgcmVzdWx0Lmxlbmd0aCA9IG47XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlU2l6ZTtcbiJdfQ==