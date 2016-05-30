'use strict';

var createAggregator = require('./_createAggregator');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The order of grouped values
 * is determined by the order they occur in `collection`. The corresponding
 * value of each key is an array of elements responsible for generating the
 * key. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.groupBy([6.1, 4.2, 6.3], Math.floor);
 * // => { '4': [4.2], '6': [6.1, 6.3] }
 *
 * // The `_.property` iteratee shorthand.
 * _.groupBy(['one', 'two', 'three'], 'length');
 * // => { '3': ['one', 'two'], '5': ['three'] }
 */
var groupBy = createAggregator(function (result, value, key) {
  if (hasOwnProperty.call(result, key)) {
    result[key].push(value);
  } else {
    result[key] = [value];
  }
});

module.exports = groupBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2dyb3VwQnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLG1CQUFtQixRQUFRLHFCQUFSLENBQW5COzs7QUFHSixJQUFJLGNBQWMsT0FBTyxTQUFQOzs7QUFHbEIsSUFBSSxpQkFBaUIsWUFBWSxjQUFaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCckIsSUFBSSxVQUFVLGlCQUFpQixVQUFTLE1BQVQsRUFBaUIsS0FBakIsRUFBd0IsR0FBeEIsRUFBNkI7QUFDMUQsTUFBSSxlQUFlLElBQWYsQ0FBb0IsTUFBcEIsRUFBNEIsR0FBNUIsQ0FBSixFQUFzQztBQUNwQyxXQUFPLEdBQVAsRUFBWSxJQUFaLENBQWlCLEtBQWpCLEVBRG9DO0dBQXRDLE1BRU87QUFDTCxXQUFPLEdBQVAsSUFBYyxDQUFDLEtBQUQsQ0FBZCxDQURLO0dBRlA7Q0FENkIsQ0FBM0I7O0FBUUosT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6Imdyb3VwQnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3JlYXRlQWdncmVnYXRvciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUFnZ3JlZ2F0b3InKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIG9iamVjdCBjb21wb3NlZCBvZiBrZXlzIGdlbmVyYXRlZCBmcm9tIHRoZSByZXN1bHRzIG9mIHJ1bm5pbmdcbiAqIGVhY2ggZWxlbWVudCBvZiBgY29sbGVjdGlvbmAgdGhydSBgaXRlcmF0ZWVgLiBUaGUgb3JkZXIgb2YgZ3JvdXBlZCB2YWx1ZXNcbiAqIGlzIGRldGVybWluZWQgYnkgdGhlIG9yZGVyIHRoZXkgb2NjdXIgaW4gYGNvbGxlY3Rpb25gLiBUaGUgY29ycmVzcG9uZGluZ1xuICogdmFsdWUgb2YgZWFjaCBrZXkgaXMgYW4gYXJyYXkgb2YgZWxlbWVudHMgcmVzcG9uc2libGUgZm9yIGdlbmVyYXRpbmcgdGhlXG4gKiBrZXkuIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OiAodmFsdWUpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtpdGVyYXRlZT1fLmlkZW50aXR5XVxuICogIFRoZSBpdGVyYXRlZSB0byB0cmFuc2Zvcm0ga2V5cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNvbXBvc2VkIGFnZ3JlZ2F0ZSBvYmplY3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZ3JvdXBCeShbNi4xLCA0LjIsIDYuM10sIE1hdGguZmxvb3IpO1xuICogLy8gPT4geyAnNCc6IFs0LjJdLCAnNic6IFs2LjEsIDYuM10gfVxuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5ncm91cEJ5KFsnb25lJywgJ3R3bycsICd0aHJlZSddLCAnbGVuZ3RoJyk7XG4gKiAvLyA9PiB7ICczJzogWydvbmUnLCAndHdvJ10sICc1JzogWyd0aHJlZSddIH1cbiAqL1xudmFyIGdyb3VwQnkgPSBjcmVhdGVBZ2dyZWdhdG9yKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQsIGtleSkpIHtcbiAgICByZXN1bHRba2V5XS5wdXNoKHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHRba2V5XSA9IFt2YWx1ZV07XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdyb3VwQnk7XG4iXX0=