'use strict';

var assignMergeValue = require('./_assignMergeValue'),
    baseClone = require('./_baseClone'),
    copyArray = require('./_copyArray'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isPlainObject = require('./isPlainObject'),
    isTypedArray = require('./isTypedArray'),
    toPlainObject = require('./toPlainObject');

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = object[key],
      srcValue = source[key],
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, key + '', object, source, stack) : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    newValue = srcValue;
    if (isArray(srcValue) || isTypedArray(srcValue)) {
      if (isArray(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      } else {
        isCommon = false;
        newValue = baseClone(srcValue, true);
      }
    } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      } else if (!isObject(objValue) || srcIndex && isFunction(objValue)) {
        isCommon = false;
        newValue = baseClone(srcValue, true);
      } else {
        newValue = objValue;
      }
    } else {
      isCommon = false;
    }
  }
  stack.set(srcValue, newValue);

  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
  }
  stack['delete'](srcValue);
  assignMergeValue(object, key, newValue);
}

module.exports = baseMergeDeep;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlTWVyZ2VEZWVwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxtQkFBbUIsUUFBUSxxQkFBUixDQUFuQjtJQUNBLFlBQVksUUFBUSxjQUFSLENBQVo7SUFDQSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsY0FBYyxRQUFRLGVBQVIsQ0FBZDtJQUNBLFVBQVUsUUFBUSxXQUFSLENBQVY7SUFDQSxvQkFBb0IsUUFBUSxxQkFBUixDQUFwQjtJQUNBLGFBQWEsUUFBUSxjQUFSLENBQWI7SUFDQSxXQUFXLFFBQVEsWUFBUixDQUFYO0lBQ0EsZ0JBQWdCLFFBQVEsaUJBQVIsQ0FBaEI7SUFDQSxlQUFlLFFBQVEsZ0JBQVIsQ0FBZjtJQUNBLGdCQUFnQixRQUFRLGlCQUFSLENBQWhCOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCSixTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsRUFBK0IsTUFBL0IsRUFBdUMsR0FBdkMsRUFBNEMsUUFBNUMsRUFBc0QsU0FBdEQsRUFBaUUsVUFBakUsRUFBNkUsS0FBN0UsRUFBb0Y7QUFDbEYsTUFBSSxXQUFXLE9BQU8sR0FBUCxDQUFYO01BQ0EsV0FBVyxPQUFPLEdBQVAsQ0FBWDtNQUNBLFVBQVUsTUFBTSxHQUFOLENBQVUsUUFBVixDQUFWLENBSDhFOztBQUtsRixNQUFJLE9BQUosRUFBYTtBQUNYLHFCQUFpQixNQUFqQixFQUF5QixHQUF6QixFQUE4QixPQUE5QixFQURXO0FBRVgsV0FGVztHQUFiO0FBSUEsTUFBSSxXQUFXLGFBQ1gsV0FBVyxRQUFYLEVBQXFCLFFBQXJCLEVBQWdDLE1BQU0sRUFBTixFQUFXLE1BQTNDLEVBQW1ELE1BQW5ELEVBQTJELEtBQTNELENBRFcsR0FFWCxTQUZXLENBVG1FOztBQWFsRixNQUFJLFdBQVcsYUFBYSxTQUFiLENBYm1FOztBQWVsRixNQUFJLFFBQUosRUFBYztBQUNaLGVBQVcsUUFBWCxDQURZO0FBRVosUUFBSSxRQUFRLFFBQVIsS0FBcUIsYUFBYSxRQUFiLENBQXJCLEVBQTZDO0FBQy9DLFVBQUksUUFBUSxRQUFSLENBQUosRUFBdUI7QUFDckIsbUJBQVcsUUFBWCxDQURxQjtPQUF2QixNQUdLLElBQUksa0JBQWtCLFFBQWxCLENBQUosRUFBaUM7QUFDcEMsbUJBQVcsVUFBVSxRQUFWLENBQVgsQ0FEb0M7T0FBakMsTUFHQTtBQUNILG1CQUFXLEtBQVgsQ0FERztBQUVILG1CQUFXLFVBQVUsUUFBVixFQUFvQixJQUFwQixDQUFYLENBRkc7T0FIQTtLQUpQLE1BWUssSUFBSSxjQUFjLFFBQWQsS0FBMkIsWUFBWSxRQUFaLENBQTNCLEVBQWtEO0FBQ3pELFVBQUksWUFBWSxRQUFaLENBQUosRUFBMkI7QUFDekIsbUJBQVcsY0FBYyxRQUFkLENBQVgsQ0FEeUI7T0FBM0IsTUFHSyxJQUFJLENBQUMsU0FBUyxRQUFULENBQUQsSUFBd0IsWUFBWSxXQUFXLFFBQVgsQ0FBWixFQUFtQztBQUNsRSxtQkFBVyxLQUFYLENBRGtFO0FBRWxFLG1CQUFXLFVBQVUsUUFBVixFQUFvQixJQUFwQixDQUFYLENBRmtFO09BQS9ELE1BSUE7QUFDSCxtQkFBVyxRQUFYLENBREc7T0FKQTtLQUpGLE1BWUE7QUFDSCxpQkFBVyxLQUFYLENBREc7S0FaQTtHQWRQO0FBOEJBLFFBQU0sR0FBTixDQUFVLFFBQVYsRUFBb0IsUUFBcEIsRUE3Q2tGOztBQStDbEYsTUFBSSxRQUFKLEVBQWM7O0FBRVosY0FBVSxRQUFWLEVBQW9CLFFBQXBCLEVBQThCLFFBQTlCLEVBQXdDLFVBQXhDLEVBQW9ELEtBQXBELEVBRlk7R0FBZDtBQUlBLFFBQU0sUUFBTixFQUFnQixRQUFoQixFQW5Ea0Y7QUFvRGxGLG1CQUFpQixNQUFqQixFQUF5QixHQUF6QixFQUE4QixRQUE5QixFQXBEa0Y7Q0FBcEY7O0FBdURBLE9BQU8sT0FBUCxHQUFpQixhQUFqQiIsImZpbGUiOiJfYmFzZU1lcmdlRGVlcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhc3NpZ25NZXJnZVZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduTWVyZ2VWYWx1ZScpLFxuICAgIGJhc2VDbG9uZSA9IHJlcXVpcmUoJy4vX2Jhc2VDbG9uZScpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2VPYmplY3QnKSxcbiAgICBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoJy4vaXNQbGFpbk9iamVjdCcpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5JyksXG4gICAgdG9QbGFpbk9iamVjdCA9IHJlcXVpcmUoJy4vdG9QbGFpbk9iamVjdCcpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZU1lcmdlYCBmb3IgYXJyYXlzIGFuZCBvYmplY3RzIHdoaWNoIHBlcmZvcm1zXG4gKiBkZWVwIG1lcmdlcyBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGVuYWJsaW5nIG9iamVjdHMgd2l0aCBjaXJjdWxhclxuICogcmVmZXJlbmNlcyB0byBiZSBtZXJnZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIG1lcmdlLlxuICogQHBhcmFtIHtudW1iZXJ9IHNyY0luZGV4IFRoZSBpbmRleCBvZiBgc291cmNlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG1lcmdlRnVuYyBUaGUgZnVuY3Rpb24gdG8gbWVyZ2UgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2UgdmFsdWVzIGFuZCB0aGVpciBtZXJnZWRcbiAqICBjb3VudGVycGFydHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNZXJnZURlZXAob2JqZWN0LCBzb3VyY2UsIGtleSwgc3JjSW5kZXgsIG1lcmdlRnVuYywgY3VzdG9taXplciwgc3RhY2spIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICBzcmNWYWx1ZSA9IHNvdXJjZVtrZXldLFxuICAgICAgc3RhY2tlZCA9IHN0YWNrLmdldChzcmNWYWx1ZSk7XG5cbiAgaWYgKHN0YWNrZWQpIHtcbiAgICBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCBzdGFja2VkKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgID8gY3VzdG9taXplcihvYmpWYWx1ZSwgc3JjVmFsdWUsIChrZXkgKyAnJyksIG9iamVjdCwgc291cmNlLCBzdGFjaylcbiAgICA6IHVuZGVmaW5lZDtcblxuICB2YXIgaXNDb21tb24gPSBuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkO1xuXG4gIGlmIChpc0NvbW1vbikge1xuICAgIG5ld1ZhbHVlID0gc3JjVmFsdWU7XG4gICAgaWYgKGlzQXJyYXkoc3JjVmFsdWUpIHx8IGlzVHlwZWRBcnJheShzcmNWYWx1ZSkpIHtcbiAgICAgIGlmIChpc0FycmF5KG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IG9ialZhbHVlO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoaXNBcnJheUxpa2VPYmplY3Qob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gY29weUFycmF5KG9ialZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgICAgICBuZXdWYWx1ZSA9IGJhc2VDbG9uZShzcmNWYWx1ZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzUGxhaW5PYmplY3Qoc3JjVmFsdWUpIHx8IGlzQXJndW1lbnRzKHNyY1ZhbHVlKSkge1xuICAgICAgaWYgKGlzQXJndW1lbnRzKG9ialZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IHRvUGxhaW5PYmplY3Qob2JqVmFsdWUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIWlzT2JqZWN0KG9ialZhbHVlKSB8fCAoc3JjSW5kZXggJiYgaXNGdW5jdGlvbihvYmpWYWx1ZSkpKSB7XG4gICAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgICAgIG5ld1ZhbHVlID0gYmFzZUNsb25lKHNyY1ZhbHVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBuZXdWYWx1ZSA9IG9ialZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHN0YWNrLnNldChzcmNWYWx1ZSwgbmV3VmFsdWUpO1xuXG4gIGlmIChpc0NvbW1vbikge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IG1lcmdlIG9iamVjdHMgYW5kIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIG1lcmdlRnVuYyhuZXdWYWx1ZSwgc3JjVmFsdWUsIHNyY0luZGV4LCBjdXN0b21pemVyLCBzdGFjayk7XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKHNyY1ZhbHVlKTtcbiAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNZXJnZURlZXA7XG4iXX0=