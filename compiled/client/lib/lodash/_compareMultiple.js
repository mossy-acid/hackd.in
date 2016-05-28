'use strict';

var compareAscending = require('./_compareAscending');

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

module.exports = compareMultiple;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jb21wYXJlTXVsdGlwbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLG1CQUFtQixRQUFRLHFCQUFSLENBQW5COzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JKLFNBQVMsZUFBVCxDQUF5QixNQUF6QixFQUFpQyxLQUFqQyxFQUF3QyxNQUF4QyxFQUFnRDtBQUM5QyxNQUFJLFFBQVEsQ0FBQyxDQUFEO01BQ1IsY0FBYyxPQUFPLFFBQVA7TUFDZCxjQUFjLE1BQU0sUUFBTjtNQUNkLFNBQVMsWUFBWSxNQUFaO01BQ1QsZUFBZSxPQUFPLE1BQVAsQ0FMMkI7O0FBTzlDLFNBQU8sRUFBRSxLQUFGLEdBQVUsTUFBVixFQUFrQjtBQUN2QixRQUFJLFNBQVMsaUJBQWlCLFlBQVksS0FBWixDQUFqQixFQUFxQyxZQUFZLEtBQVosQ0FBckMsQ0FBVCxDQURtQjtBQUV2QixRQUFJLE1BQUosRUFBWTtBQUNWLFVBQUksU0FBUyxZQUFULEVBQXVCO0FBQ3pCLGVBQU8sTUFBUCxDQUR5QjtPQUEzQjtBQUdBLFVBQUksUUFBUSxPQUFPLEtBQVAsQ0FBUixDQUpNO0FBS1YsYUFBTyxVQUFVLFNBQVMsTUFBVCxHQUFrQixDQUFDLENBQUQsR0FBSyxDQUF2QixDQUFWLENBTEc7S0FBWjtHQUZGOzs7Ozs7OztBQVA4QyxTQXdCdkMsT0FBTyxLQUFQLEdBQWUsTUFBTSxLQUFOLENBeEJ3QjtDQUFoRDs7QUEyQkEsT0FBTyxPQUFQLEdBQWlCLGVBQWpCIiwiZmlsZSI6Il9jb21wYXJlTXVsdGlwbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY29tcGFyZUFzY2VuZGluZyA9IHJlcXVpcmUoJy4vX2NvbXBhcmVBc2NlbmRpbmcnKTtcblxuLyoqXG4gKiBVc2VkIGJ5IGBfLm9yZGVyQnlgIHRvIGNvbXBhcmUgbXVsdGlwbGUgcHJvcGVydGllcyBvZiBhIHZhbHVlIHRvIGFub3RoZXJcbiAqIGFuZCBzdGFibGUgc29ydCB0aGVtLlxuICpcbiAqIElmIGBvcmRlcnNgIGlzIHVuc3BlY2lmaWVkLCBhbGwgdmFsdWVzIGFyZSBzb3J0ZWQgaW4gYXNjZW5kaW5nIG9yZGVyLiBPdGhlcndpc2UsXG4gKiBzcGVjaWZ5IGFuIG9yZGVyIG9mIFwiZGVzY1wiIGZvciBkZXNjZW5kaW5nIG9yIFwiYXNjXCIgZm9yIGFzY2VuZGluZyBzb3J0IG9yZGVyXG4gKiBvZiBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtib29sZWFuW118c3RyaW5nW119IG9yZGVycyBUaGUgb3JkZXIgdG8gc29ydCBieSBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHNvcnQgb3JkZXIgaW5kaWNhdG9yIGZvciBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZU11bHRpcGxlKG9iamVjdCwgb3RoZXIsIG9yZGVycykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIG9iakNyaXRlcmlhID0gb2JqZWN0LmNyaXRlcmlhLFxuICAgICAgb3RoQ3JpdGVyaWEgPSBvdGhlci5jcml0ZXJpYSxcbiAgICAgIGxlbmd0aCA9IG9iakNyaXRlcmlhLmxlbmd0aCxcbiAgICAgIG9yZGVyc0xlbmd0aCA9IG9yZGVycy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgcmVzdWx0ID0gY29tcGFyZUFzY2VuZGluZyhvYmpDcml0ZXJpYVtpbmRleF0sIG90aENyaXRlcmlhW2luZGV4XSk7XG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgaWYgKGluZGV4ID49IG9yZGVyc0xlbmd0aCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICAgdmFyIG9yZGVyID0gb3JkZXJzW2luZGV4XTtcbiAgICAgIHJldHVybiByZXN1bHQgKiAob3JkZXIgPT0gJ2Rlc2MnID8gLTEgOiAxKTtcbiAgICB9XG4gIH1cbiAgLy8gRml4ZXMgYW4gYEFycmF5I3NvcnRgIGJ1ZyBpbiB0aGUgSlMgZW5naW5lIGVtYmVkZGVkIGluIEFkb2JlIGFwcGxpY2F0aW9uc1xuICAvLyB0aGF0IGNhdXNlcyBpdCwgdW5kZXIgY2VydGFpbiBjaXJjdW1zdGFuY2VzLCB0byBwcm92aWRlIHRoZSBzYW1lIHZhbHVlIGZvclxuICAvLyBgb2JqZWN0YCBhbmQgYG90aGVyYC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNoa2VuYXMvdW5kZXJzY29yZS9wdWxsLzEyNDdcbiAgLy8gZm9yIG1vcmUgZGV0YWlscy5cbiAgLy9cbiAgLy8gVGhpcyBhbHNvIGVuc3VyZXMgYSBzdGFibGUgc29ydCBpbiBWOCBhbmQgb3RoZXIgZW5naW5lcy5cbiAgLy8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTkwIGZvciBtb3JlIGRldGFpbHMuXG4gIHJldHVybiBvYmplY3QuaW5kZXggLSBvdGhlci5pbmRleDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb21wYXJlTXVsdGlwbGU7XG4iXX0=