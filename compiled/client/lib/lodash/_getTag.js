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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19nZXRUYWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxhQUFSLENBQVg7SUFDQSxNQUFNLFFBQVEsUUFBUixDQUFOO0lBQ0EsVUFBVSxRQUFRLFlBQVIsQ0FBVjtJQUNBLE1BQU0sUUFBUSxRQUFSLENBQU47SUFDQSxVQUFVLFFBQVEsWUFBUixDQUFWO0lBQ0EsV0FBVyxRQUFRLGFBQVIsQ0FBWDs7O0FBR0osSUFBSSxTQUFTLGNBQVQ7SUFDQSxZQUFZLGlCQUFaO0lBQ0EsYUFBYSxrQkFBYjtJQUNBLFNBQVMsY0FBVDtJQUNBLGFBQWEsa0JBQWI7O0FBRUosSUFBSSxjQUFjLG1CQUFkOzs7QUFHSixJQUFJLGNBQWMsT0FBTyxTQUFQOzs7Ozs7O0FBT2xCLElBQUksaUJBQWlCLFlBQVksUUFBWjs7O0FBR3JCLElBQUkscUJBQXFCLFNBQVMsUUFBVCxDQUFyQjtJQUNBLGdCQUFnQixTQUFTLEdBQVQsQ0FBaEI7SUFDQSxvQkFBb0IsU0FBUyxPQUFULENBQXBCO0lBQ0EsZ0JBQWdCLFNBQVMsR0FBVCxDQUFoQjtJQUNBLG9CQUFvQixTQUFTLE9BQVQsQ0FBcEI7Ozs7Ozs7OztBQVNKLFNBQVMsTUFBVCxDQUFnQixLQUFoQixFQUF1QjtBQUNyQixTQUFPLGVBQWUsSUFBZixDQUFvQixLQUFwQixDQUFQLENBRHFCO0NBQXZCOzs7O0FBTUEsSUFBSSxRQUFDLElBQVksT0FBTyxJQUFJLFFBQUosQ0FBYSxJQUFJLFdBQUosQ0FBZ0IsQ0FBaEIsQ0FBYixDQUFQLEtBQTRDLFdBQTVDLElBQ1osT0FBTyxPQUFPLElBQUksR0FBSixFQUFQLEtBQW1CLE1BQW5CLElBQ1AsV0FBVyxPQUFPLFFBQVEsT0FBUixFQUFQLEtBQTZCLFVBQTdCLElBQ1gsT0FBTyxPQUFPLElBQUksR0FBSixFQUFQLEtBQW1CLE1BQW5CLElBQ1AsV0FBVyxPQUFPLElBQUksT0FBSixFQUFQLEtBQXVCLFVBQXZCLEVBQW9DO0FBQ2xELFdBQVMsZ0JBQVMsS0FBVCxFQUFnQjtBQUN2QixRQUFJLFNBQVMsZUFBZSxJQUFmLENBQW9CLEtBQXBCLENBQVQ7UUFDQSxPQUFPLFVBQVUsU0FBVixHQUFzQixNQUFNLFdBQU4sR0FBb0IsU0FBMUM7UUFDUCxhQUFhLE9BQU8sU0FBUyxJQUFULENBQVAsR0FBd0IsU0FBeEIsQ0FITTs7QUFLdkIsUUFBSSxVQUFKLEVBQWdCO0FBQ2QsY0FBUSxVQUFSO0FBQ0UsYUFBSyxrQkFBTDtBQUF5QixpQkFBTyxXQUFQLENBQXpCO0FBREYsYUFFTyxhQUFMO0FBQW9CLGlCQUFPLE1BQVAsQ0FBcEI7QUFGRixhQUdPLGlCQUFMO0FBQXdCLGlCQUFPLFVBQVAsQ0FBeEI7QUFIRixhQUlPLGFBQUw7QUFBb0IsaUJBQU8sTUFBUCxDQUFwQjtBQUpGLGFBS08saUJBQUw7QUFBd0IsaUJBQU8sVUFBUCxDQUF4QjtBQUxGLE9BRGM7S0FBaEI7QUFTQSxXQUFPLE1BQVAsQ0FkdUI7R0FBaEIsQ0FEeUM7Q0FKcEQ7O0FBdUJBLE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJfZ2V0VGFnLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIERhdGFWaWV3ID0gcmVxdWlyZSgnLi9fRGF0YVZpZXcnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBQcm9taXNlID0gcmVxdWlyZSgnLi9fUHJvbWlzZScpLFxuICAgIFNldCA9IHJlcXVpcmUoJy4vX1NldCcpLFxuICAgIFdlYWtNYXAgPSByZXF1aXJlKCcuL19XZWFrTWFwJyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcHJvbWlzZVRhZyA9ICdbb2JqZWN0IFByb21pc2VdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1hcHMsIHNldHMsIGFuZCB3ZWFrbWFwcy4gKi9cbnZhciBkYXRhVmlld0N0b3JTdHJpbmcgPSB0b1NvdXJjZShEYXRhVmlldyksXG4gICAgbWFwQ3RvclN0cmluZyA9IHRvU291cmNlKE1hcCksXG4gICAgcHJvbWlzZUN0b3JTdHJpbmcgPSB0b1NvdXJjZShQcm9taXNlKSxcbiAgICBzZXRDdG9yU3RyaW5nID0gdG9Tb3VyY2UoU2V0KSxcbiAgICB3ZWFrTWFwQ3RvclN0cmluZyA9IHRvU291cmNlKFdlYWtNYXApO1xuXG4vKipcbiAqIEdldHMgdGhlIGB0b1N0cmluZ1RhZ2Agb2YgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRUYWcodmFsdWUpIHtcbiAgcmV0dXJuIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSxcbi8vIGZvciBkYXRhIHZpZXdzIGluIEVkZ2UsIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzLlxuaWYgKChEYXRhVmlldyAmJiBnZXRUYWcobmV3IERhdGFWaWV3KG5ldyBBcnJheUJ1ZmZlcigxKSkpICE9IGRhdGFWaWV3VGFnKSB8fFxuICAgIChNYXAgJiYgZ2V0VGFnKG5ldyBNYXApICE9IG1hcFRhZykgfHxcbiAgICAoUHJvbWlzZSAmJiBnZXRUYWcoUHJvbWlzZS5yZXNvbHZlKCkpICE9IHByb21pc2VUYWcpIHx8XG4gICAgKFNldCAmJiBnZXRUYWcobmV3IFNldCkgIT0gc2V0VGFnKSB8fFxuICAgIChXZWFrTWFwICYmIGdldFRhZyhuZXcgV2Vha01hcCkgIT0gd2Vha01hcFRhZykpIHtcbiAgZ2V0VGFnID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSksXG4gICAgICAgIEN0b3IgPSByZXN1bHQgPT0gb2JqZWN0VGFnID8gdmFsdWUuY29uc3RydWN0b3IgOiB1bmRlZmluZWQsXG4gICAgICAgIGN0b3JTdHJpbmcgPSBDdG9yID8gdG9Tb3VyY2UoQ3RvcikgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGFnO1xuIl19