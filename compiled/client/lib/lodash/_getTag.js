'use strict';

var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function getTag(value) {
  return objectToString.call(value);
}

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge, and promises in Node.js.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
  getTag = function getTag(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19nZXRUYWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxhQUFSLENBQWY7SUFDSSxNQUFNLFFBQVEsUUFBUixDQURWO0lBRUksVUFBVSxRQUFRLFlBQVIsQ0FGZDtJQUdJLE1BQU0sUUFBUSxRQUFSLENBSFY7SUFJSSxVQUFVLFFBQVEsWUFBUixDQUpkO0lBS0ksV0FBVyxRQUFRLGFBQVIsQ0FMZjs7O0FBUUEsSUFBSSxTQUFTLGNBQWI7SUFDSSxZQUFZLGlCQURoQjtJQUVJLGFBQWEsa0JBRmpCO0lBR0ksU0FBUyxjQUhiO0lBSUksYUFBYSxrQkFKakI7O0FBTUEsSUFBSSxjQUFjLG1CQUFsQjs7O0FBR0EsSUFBSSxjQUFjLE9BQU8sU0FBekI7Ozs7Ozs7QUFPQSxJQUFJLGlCQUFpQixZQUFZLFFBQWpDOzs7QUFHQSxJQUFJLHFCQUFxQixTQUFTLFFBQVQsQ0FBekI7SUFDSSxnQkFBZ0IsU0FBUyxHQUFULENBRHBCO0lBRUksb0JBQW9CLFNBQVMsT0FBVCxDQUZ4QjtJQUdJLGdCQUFnQixTQUFTLEdBQVQsQ0FIcEI7SUFJSSxvQkFBb0IsU0FBUyxPQUFULENBSnhCOzs7Ozs7Ozs7QUFhQSxTQUFTLE1BQVQsQ0FBZ0IsS0FBaEIsRUFBdUI7QUFDckIsU0FBTyxlQUFlLElBQWYsQ0FBb0IsS0FBcEIsQ0FBUDtBQUNEOzs7O0FBSUQsSUFBSyxZQUFZLE9BQU8sSUFBSSxRQUFKLENBQWEsSUFBSSxXQUFKLENBQWdCLENBQWhCLENBQWIsQ0FBUCxLQUE0QyxXQUF6RCxJQUNDLE9BQU8sT0FBTyxJQUFJLEdBQUosRUFBUCxLQUFtQixNQUQzQixJQUVDLFdBQVcsT0FBTyxRQUFRLE9BQVIsRUFBUCxLQUE2QixVQUZ6QyxJQUdDLE9BQU8sT0FBTyxJQUFJLEdBQUosRUFBUCxLQUFtQixNQUgzQixJQUlDLFdBQVcsT0FBTyxJQUFJLE9BQUosRUFBUCxLQUF1QixVQUp2QyxFQUlvRDtBQUNsRCxXQUFTLGdCQUFTLEtBQVQsRUFBZ0I7QUFDdkIsUUFBSSxTQUFTLGVBQWUsSUFBZixDQUFvQixLQUFwQixDQUFiO1FBQ0ksT0FBTyxVQUFVLFNBQVYsR0FBc0IsTUFBTSxXQUE1QixHQUEwQyxTQURyRDtRQUVJLGFBQWEsT0FBTyxTQUFTLElBQVQsQ0FBUCxHQUF3QixTQUZ6Qzs7QUFJQSxRQUFJLFVBQUosRUFBZ0I7QUFDZCxjQUFRLFVBQVI7QUFDRSxhQUFLLGtCQUFMO0FBQXlCLGlCQUFPLFdBQVA7QUFDekIsYUFBSyxhQUFMO0FBQW9CLGlCQUFPLE1BQVA7QUFDcEIsYUFBSyxpQkFBTDtBQUF3QixpQkFBTyxVQUFQO0FBQ3hCLGFBQUssYUFBTDtBQUFvQixpQkFBTyxNQUFQO0FBQ3BCLGFBQUssaUJBQUw7QUFBd0IsaUJBQU8sVUFBUDtBQUwxQjtBQU9EO0FBQ0QsV0FBTyxNQUFQO0FBQ0QsR0FmRDtBQWdCRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsTUFBakIiLCJmaWxlIjoiX2dldFRhZy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBEYXRhVmlldyA9IHJlcXVpcmUoJy4vX0RhdGFWaWV3JyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgUHJvbWlzZSA9IHJlcXVpcmUoJy4vX1Byb21pc2UnKSxcbiAgICBTZXQgPSByZXF1aXJlKCcuL19TZXQnKSxcbiAgICBXZWFrTWFwID0gcmVxdWlyZSgnLi9fV2Vha01hcCcpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb21pc2VUYWcgPSAnW29iamVjdCBQcm9taXNlXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0VGFnKHZhbHVlKSB7XG4gIHJldHVybiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxuLy8gRmFsbGJhY2sgZm9yIGRhdGEgdmlld3MsIG1hcHMsIHNldHMsIGFuZCB3ZWFrIG1hcHMgaW4gSUUgMTEsXG4vLyBmb3IgZGF0YSB2aWV3cyBpbiBFZGdlLCBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcy5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRhZztcbiJdfQ==