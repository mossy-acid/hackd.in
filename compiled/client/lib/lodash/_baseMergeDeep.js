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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlTWVyZ2VEZWVwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxtQkFBbUIsUUFBUSxxQkFBUixDQUF2QjtJQUNJLFlBQVksUUFBUSxjQUFSLENBRGhCO0lBRUksWUFBWSxRQUFRLGNBQVIsQ0FGaEI7SUFHSSxjQUFjLFFBQVEsZUFBUixDQUhsQjtJQUlJLFVBQVUsUUFBUSxXQUFSLENBSmQ7SUFLSSxvQkFBb0IsUUFBUSxxQkFBUixDQUx4QjtJQU1JLGFBQWEsUUFBUSxjQUFSLENBTmpCO0lBT0ksV0FBVyxRQUFRLFlBQVIsQ0FQZjtJQVFJLGdCQUFnQixRQUFRLGlCQUFSLENBUnBCO0lBU0ksZUFBZSxRQUFRLGdCQUFSLENBVG5CO0lBVUksZ0JBQWdCLFFBQVEsaUJBQVIsQ0FWcEI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBLFNBQVMsYUFBVCxDQUF1QixNQUF2QixFQUErQixNQUEvQixFQUF1QyxHQUF2QyxFQUE0QyxRQUE1QyxFQUFzRCxTQUF0RCxFQUFpRSxVQUFqRSxFQUE2RSxLQUE3RSxFQUFvRjtBQUNsRixNQUFJLFdBQVcsT0FBTyxHQUFQLENBQWY7TUFDSSxXQUFXLE9BQU8sR0FBUCxDQURmO01BRUksVUFBVSxNQUFNLEdBQU4sQ0FBVSxRQUFWLENBRmQ7O0FBSUEsTUFBSSxPQUFKLEVBQWE7QUFDWCxxQkFBaUIsTUFBakIsRUFBeUIsR0FBekIsRUFBOEIsT0FBOUI7QUFDQTtBQUNEO0FBQ0QsTUFBSSxXQUFXLGFBQ1gsV0FBVyxRQUFYLEVBQXFCLFFBQXJCLEVBQWdDLE1BQU0sRUFBdEMsRUFBMkMsTUFBM0MsRUFBbUQsTUFBbkQsRUFBMkQsS0FBM0QsQ0FEVyxHQUVYLFNBRko7O0FBSUEsTUFBSSxXQUFXLGFBQWEsU0FBNUI7O0FBRUEsTUFBSSxRQUFKLEVBQWM7QUFDWixlQUFXLFFBQVg7QUFDQSxRQUFJLFFBQVEsUUFBUixLQUFxQixhQUFhLFFBQWIsQ0FBekIsRUFBaUQ7QUFDL0MsVUFBSSxRQUFRLFFBQVIsQ0FBSixFQUF1QjtBQUNyQixtQkFBVyxRQUFYO0FBQ0QsT0FGRCxNQUdLLElBQUksa0JBQWtCLFFBQWxCLENBQUosRUFBaUM7QUFDcEMsbUJBQVcsVUFBVSxRQUFWLENBQVg7QUFDRCxPQUZJLE1BR0E7QUFDSCxtQkFBVyxLQUFYO0FBQ0EsbUJBQVcsVUFBVSxRQUFWLEVBQW9CLElBQXBCLENBQVg7QUFDRDtBQUNGLEtBWEQsTUFZSyxJQUFJLGNBQWMsUUFBZCxLQUEyQixZQUFZLFFBQVosQ0FBL0IsRUFBc0Q7QUFDekQsVUFBSSxZQUFZLFFBQVosQ0FBSixFQUEyQjtBQUN6QixtQkFBVyxjQUFjLFFBQWQsQ0FBWDtBQUNELE9BRkQsTUFHSyxJQUFJLENBQUMsU0FBUyxRQUFULENBQUQsSUFBd0IsWUFBWSxXQUFXLFFBQVgsQ0FBeEMsRUFBK0Q7QUFDbEUsbUJBQVcsS0FBWDtBQUNBLG1CQUFXLFVBQVUsUUFBVixFQUFvQixJQUFwQixDQUFYO0FBQ0QsT0FISSxNQUlBO0FBQ0gsbUJBQVcsUUFBWDtBQUNEO0FBQ0YsS0FYSSxNQVlBO0FBQ0gsaUJBQVcsS0FBWDtBQUNEO0FBQ0Y7QUFDRCxRQUFNLEdBQU4sQ0FBVSxRQUFWLEVBQW9CLFFBQXBCOztBQUVBLE1BQUksUUFBSixFQUFjOztBQUVaLGNBQVUsUUFBVixFQUFvQixRQUFwQixFQUE4QixRQUE5QixFQUF3QyxVQUF4QyxFQUFvRCxLQUFwRDtBQUNEO0FBQ0QsUUFBTSxRQUFOLEVBQWdCLFFBQWhCO0FBQ0EsbUJBQWlCLE1BQWpCLEVBQXlCLEdBQXpCLEVBQThCLFFBQTlCO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLGFBQWpCIiwiZmlsZSI6Il9iYXNlTWVyZ2VEZWVwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFzc2lnbk1lcmdlVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25NZXJnZVZhbHVlJyksXG4gICAgYmFzZUNsb25lID0gcmVxdWlyZSgnLi9fYmFzZUNsb25lJyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5JyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZU9iamVjdCcpLFxuICAgIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnLi9pc1BsYWluT2JqZWN0JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKSxcbiAgICB0b1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnLi90b1BsYWluT2JqZWN0Jyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlTWVyZ2VgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgbWVyZ2VzIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIG1lcmdlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gbWVyZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gc3JjSW5kZXggVGhlIGluZGV4IG9mIGBzb3VyY2VgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gbWVyZ2VGdW5jIFRoZSBmdW5jdGlvbiB0byBtZXJnZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBzcmNJbmRleCwgbWVyZ2VGdW5jLCBjdXN0b21pemVyLCBzdGFjaykge1xuICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgIHNyY1ZhbHVlID0gc291cmNlW2tleV0sXG4gICAgICBzdGFja2VkID0gc3RhY2suZ2V0KHNyY1ZhbHVlKTtcblxuICBpZiAoc3RhY2tlZCkge1xuICAgIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIHN0YWNrZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgPyBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwgKGtleSArICcnKSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKVxuICAgIDogdW5kZWZpbmVkO1xuXG4gIHZhciBpc0NvbW1vbiA9IG5ld1ZhbHVlID09PSB1bmRlZmluZWQ7XG5cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgbmV3VmFsdWUgPSBzcmNWYWx1ZTtcbiAgICBpZiAoaXNBcnJheShzcmNWYWx1ZSkgfHwgaXNUeXBlZEFycmF5KHNyY1ZhbHVlKSkge1xuICAgICAgaWYgKGlzQXJyYXkob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gb2JqVmFsdWU7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc0FycmF5TGlrZU9iamVjdChvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBjb3B5QXJyYXkob2JqVmFsdWUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgICAgIG5ld1ZhbHVlID0gYmFzZUNsb25lKHNyY1ZhbHVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChzcmNWYWx1ZSkgfHwgaXNBcmd1bWVudHMoc3JjVmFsdWUpKSB7XG4gICAgICBpZiAoaXNBcmd1bWVudHMob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gdG9QbGFpbk9iamVjdChvYmpWYWx1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICghaXNPYmplY3Qob2JqVmFsdWUpIHx8IChzcmNJbmRleCAmJiBpc0Z1bmN0aW9uKG9ialZhbHVlKSkpIHtcbiAgICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICAgICAgbmV3VmFsdWUgPSBiYXNlQ2xvbmUoc3JjVmFsdWUsIHRydWUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG5ld1ZhbHVlID0gb2JqVmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgc3RhY2suc2V0KHNyY1ZhbHVlLCBuZXdWYWx1ZSk7XG5cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgbWVyZ2Ugb2JqZWN0cyBhbmQgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgbWVyZ2VGdW5jKG5ld1ZhbHVlLCBzcmNWYWx1ZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgfVxuICBzdGFja1snZGVsZXRlJ10oc3JjVmFsdWUpO1xuICBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1lcmdlRGVlcDtcbiJdfQ==