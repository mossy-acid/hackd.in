'use strict';

var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    baseSortBy = require('./_baseSortBy'),
    baseUnary = require('./_baseUnary'),
    compareMultiple = require('./_compareMultiple'),
    identity = require('./identity');

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));

  var result = baseMap(collection, function (value, key, collection) {
    var criteria = arrayMap(iteratees, function (iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return baseSortBy(result, function (object, other) {
    return compareMultiple(object, other, orders);
  });
}

module.exports = baseOrderBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlT3JkZXJCeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxRQUFRLGFBQVIsQ0FBWDtJQUNBLGVBQWUsUUFBUSxpQkFBUixDQUFmO0lBQ0EsVUFBVSxRQUFRLFlBQVIsQ0FBVjtJQUNBLGFBQWEsUUFBUSxlQUFSLENBQWI7SUFDQSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0Esa0JBQWtCLFFBQVEsb0JBQVIsQ0FBbEI7SUFDQSxXQUFXLFFBQVEsWUFBUixDQUFYOzs7Ozs7Ozs7OztBQVdKLFNBQVMsV0FBVCxDQUFxQixVQUFyQixFQUFpQyxTQUFqQyxFQUE0QyxNQUE1QyxFQUFvRDtBQUNsRCxNQUFJLFFBQVEsQ0FBQyxDQUFELENBRHNDO0FBRWxELGNBQVksU0FBUyxVQUFVLE1BQVYsR0FBbUIsU0FBbkIsR0FBK0IsQ0FBQyxRQUFELENBQS9CLEVBQTJDLFVBQVUsWUFBVixDQUFwRCxDQUFaLENBRmtEOztBQUlsRCxNQUFJLFNBQVMsUUFBUSxVQUFSLEVBQW9CLFVBQVMsS0FBVCxFQUFnQixHQUFoQixFQUFxQixVQUFyQixFQUFpQztBQUNoRSxRQUFJLFdBQVcsU0FBUyxTQUFULEVBQW9CLFVBQVMsUUFBVCxFQUFtQjtBQUNwRCxhQUFPLFNBQVMsS0FBVCxDQUFQLENBRG9EO0tBQW5CLENBQS9CLENBRDREO0FBSWhFLFdBQU8sRUFBRSxZQUFZLFFBQVosRUFBc0IsU0FBUyxFQUFFLEtBQUYsRUFBUyxTQUFTLEtBQVQsRUFBakQsQ0FKZ0U7R0FBakMsQ0FBN0IsQ0FKOEM7O0FBV2xELFNBQU8sV0FBVyxNQUFYLEVBQW1CLFVBQVMsTUFBVCxFQUFpQixLQUFqQixFQUF3QjtBQUNoRCxXQUFPLGdCQUFnQixNQUFoQixFQUF3QixLQUF4QixFQUErQixNQUEvQixDQUFQLENBRGdEO0dBQXhCLENBQTFCLENBWGtEO0NBQXBEOztBQWdCQSxPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoiX2Jhc2VPcmRlckJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBiYXNlTWFwID0gcmVxdWlyZSgnLi9fYmFzZU1hcCcpLFxuICAgIGJhc2VTb3J0QnkgPSByZXF1aXJlKCcuL19iYXNlU29ydEJ5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgY29tcGFyZU11bHRpcGxlID0gcmVxdWlyZSgnLi9fY29tcGFyZU11bHRpcGxlJyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ub3JkZXJCeWAgd2l0aG91dCBwYXJhbSBndWFyZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb25bXXxPYmplY3RbXXxzdHJpbmdbXX0gaXRlcmF0ZWVzIFRoZSBpdGVyYXRlZXMgdG8gc29ydCBieS5cbiAqIEBwYXJhbSB7c3RyaW5nW119IG9yZGVycyBUaGUgc29ydCBvcmRlcnMgb2YgYGl0ZXJhdGVlc2AuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBzb3J0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGJhc2VPcmRlckJ5KGNvbGxlY3Rpb24sIGl0ZXJhdGVlcywgb3JkZXJzKSB7XG4gIHZhciBpbmRleCA9IC0xO1xuICBpdGVyYXRlZXMgPSBhcnJheU1hcChpdGVyYXRlZXMubGVuZ3RoID8gaXRlcmF0ZWVzIDogW2lkZW50aXR5XSwgYmFzZVVuYXJ5KGJhc2VJdGVyYXRlZSkpO1xuXG4gIHZhciByZXN1bHQgPSBiYXNlTWFwKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgY3JpdGVyaWEgPSBhcnJheU1hcChpdGVyYXRlZXMsIGZ1bmN0aW9uKGl0ZXJhdGVlKSB7XG4gICAgICByZXR1cm4gaXRlcmF0ZWUodmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiB7ICdjcml0ZXJpYSc6IGNyaXRlcmlhLCAnaW5kZXgnOiArK2luZGV4LCAndmFsdWUnOiB2YWx1ZSB9O1xuICB9KTtcblxuICByZXR1cm4gYmFzZVNvcnRCeShyZXN1bHQsIGZ1bmN0aW9uKG9iamVjdCwgb3RoZXIpIHtcbiAgICByZXR1cm4gY29tcGFyZU11bHRpcGxlKG9iamVjdCwgb3RoZXIsIG9yZGVycyk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VPcmRlckJ5O1xuIl19