'use strict';

var arrayPush = require('./_arrayPush'),
    getPrototype = require('./_getPrototype'),
    getSymbols = require('./_getSymbols');

/** Built-in value references. */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbol properties
 * of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !getOwnPropertySymbols ? getSymbols : function (object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19nZXRTeW1ib2xzSW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksUUFBUSxjQUFSLENBQWhCO0lBQ0ksZUFBZSxRQUFRLGlCQUFSLENBRG5CO0lBRUksYUFBYSxRQUFRLGVBQVIsQ0FGakI7OztBQUtBLElBQUksd0JBQXdCLE9BQU8scUJBQW5DOzs7Ozs7Ozs7O0FBVUEsSUFBSSxlQUFlLENBQUMscUJBQUQsR0FBeUIsVUFBekIsR0FBc0MsVUFBUyxNQUFULEVBQWlCO0FBQ3hFLE1BQUksU0FBUyxFQUFiO0FBQ0EsU0FBTyxNQUFQLEVBQWU7QUFDYixjQUFVLE1BQVYsRUFBa0IsV0FBVyxNQUFYLENBQWxCO0FBQ0EsYUFBUyxhQUFhLE1BQWIsQ0FBVDtBQUNEO0FBQ0QsU0FBTyxNQUFQO0FBQ0QsQ0FQRDs7QUFTQSxPQUFPLE9BQVAsR0FBaUIsWUFBakIiLCJmaWxlIjoiX2dldFN5bWJvbHNJbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgc3ltYm9sIHByb3BlcnRpZXNcbiAqIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHN5bWJvbHMuXG4gKi9cbnZhciBnZXRTeW1ib2xzSW4gPSAhZ2V0T3duUHJvcGVydHlTeW1ib2xzID8gZ2V0U3ltYm9scyA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHdoaWxlIChvYmplY3QpIHtcbiAgICBhcnJheVB1c2gocmVzdWx0LCBnZXRTeW1ib2xzKG9iamVjdCkpO1xuICAgIG9iamVjdCA9IGdldFByb3RvdHlwZShvYmplY3QpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFN5bWJvbHNJbjtcbiJdfQ==