'use strict';

var get = require('./get');

/**
 * The base implementation of `_.at` without support for individual paths.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {string[]} paths The property paths of elements to pick.
 * @returns {Array} Returns the picked elements.
 */
function baseAt(object, paths) {
  var index = -1,
      isNil = object == null,
      length = paths.length,
      result = Array(length);

  while (++index < length) {
    result[index] = isNil ? undefined : get(object, paths[index]);
  }
  return result;
}

module.exports = baseAt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlQXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE1BQU0sUUFBUSxPQUFSLENBQU47Ozs7Ozs7Ozs7QUFVSixTQUFTLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0IsS0FBeEIsRUFBK0I7QUFDN0IsTUFBSSxRQUFRLENBQUMsQ0FBRDtNQUNSLFFBQVEsVUFBVSxJQUFWO01BQ1IsU0FBUyxNQUFNLE1BQU47TUFDVCxTQUFTLE1BQU0sTUFBTixDQUFULENBSnlCOztBQU03QixTQUFPLEVBQUUsS0FBRixHQUFVLE1BQVYsRUFBa0I7QUFDdkIsV0FBTyxLQUFQLElBQWdCLFFBQVEsU0FBUixHQUFvQixJQUFJLE1BQUosRUFBWSxNQUFNLEtBQU4sQ0FBWixDQUFwQixDQURPO0dBQXpCO0FBR0EsU0FBTyxNQUFQLENBVDZCO0NBQS9COztBQVlBLE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJfYmFzZUF0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdldCA9IHJlcXVpcmUoJy4vZ2V0Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXRgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaW5kaXZpZHVhbCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHBhdGhzIFRoZSBwcm9wZXJ0eSBwYXRocyBvZiBlbGVtZW50cyB0byBwaWNrLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBwaWNrZWQgZWxlbWVudHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBdChvYmplY3QsIHBhdGhzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgaXNOaWwgPSBvYmplY3QgPT0gbnVsbCxcbiAgICAgIGxlbmd0aCA9IHBhdGhzLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXNOaWwgPyB1bmRlZmluZWQgOiBnZXQob2JqZWN0LCBwYXRoc1tpbmRleF0pO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUF0O1xuIl19