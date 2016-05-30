'use strict';

var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignMergeValue = require('./_assignMergeValue'),
    baseMergeDeep = require('./_baseMergeDeep'),
    isArray = require('./isArray'),
    isObject = require('./isObject'),
    isTypedArray = require('./isTypedArray'),
    keysIn = require('./keysIn');

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  if (!(isArray(source) || isTypedArray(source))) {
    var props = keysIn(source);
  }
  arrayEach(props || source, function (srcValue, key) {
    if (props) {
      key = srcValue;
      srcValue = source[key];
    }
    if (isObject(srcValue)) {
      stack || (stack = new Stack());
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    } else {
      var newValue = customizer ? customizer(object[key], srcValue, key + '', object, source, stack) : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  });
}

module.exports = baseMerge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlTWVyZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFFBQVEsUUFBUSxVQUFSLENBQVo7SUFDSSxZQUFZLFFBQVEsY0FBUixDQURoQjtJQUVJLG1CQUFtQixRQUFRLHFCQUFSLENBRnZCO0lBR0ksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FIcEI7SUFJSSxVQUFVLFFBQVEsV0FBUixDQUpkO0lBS0ksV0FBVyxRQUFRLFlBQVIsQ0FMZjtJQU1JLGVBQWUsUUFBUSxnQkFBUixDQU5uQjtJQU9JLFNBQVMsUUFBUSxVQUFSLENBUGI7Ozs7Ozs7Ozs7Ozs7QUFvQkEsU0FBUyxTQUFULENBQW1CLE1BQW5CLEVBQTJCLE1BQTNCLEVBQW1DLFFBQW5DLEVBQTZDLFVBQTdDLEVBQXlELEtBQXpELEVBQWdFO0FBQzlELE1BQUksV0FBVyxNQUFmLEVBQXVCO0FBQ3JCO0FBQ0Q7QUFDRCxNQUFJLEVBQUUsUUFBUSxNQUFSLEtBQW1CLGFBQWEsTUFBYixDQUFyQixDQUFKLEVBQWdEO0FBQzlDLFFBQUksUUFBUSxPQUFPLE1BQVAsQ0FBWjtBQUNEO0FBQ0QsWUFBVSxTQUFTLE1BQW5CLEVBQTJCLFVBQVMsUUFBVCxFQUFtQixHQUFuQixFQUF3QjtBQUNqRCxRQUFJLEtBQUosRUFBVztBQUNULFlBQU0sUUFBTjtBQUNBLGlCQUFXLE9BQU8sR0FBUCxDQUFYO0FBQ0Q7QUFDRCxRQUFJLFNBQVMsUUFBVCxDQUFKLEVBQXdCO0FBQ3RCLGdCQUFVLFFBQVEsSUFBSSxLQUFKLEVBQWxCO0FBQ0Esb0JBQWMsTUFBZCxFQUFzQixNQUF0QixFQUE4QixHQUE5QixFQUFtQyxRQUFuQyxFQUE2QyxTQUE3QyxFQUF3RCxVQUF4RCxFQUFvRSxLQUFwRTtBQUNELEtBSEQsTUFJSztBQUNILFVBQUksV0FBVyxhQUNYLFdBQVcsT0FBTyxHQUFQLENBQVgsRUFBd0IsUUFBeEIsRUFBbUMsTUFBTSxFQUF6QyxFQUE4QyxNQUE5QyxFQUFzRCxNQUF0RCxFQUE4RCxLQUE5RCxDQURXLEdBRVgsU0FGSjs7QUFJQSxVQUFJLGFBQWEsU0FBakIsRUFBNEI7QUFDMUIsbUJBQVcsUUFBWDtBQUNEO0FBQ0QsdUJBQWlCLE1BQWpCLEVBQXlCLEdBQXpCLEVBQThCLFFBQTlCO0FBQ0Q7QUFDRixHQW5CRDtBQW9CRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoiX2Jhc2VNZXJnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYXNzaWduTWVyZ2VWYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnbk1lcmdlVmFsdWUnKSxcbiAgICBiYXNlTWVyZ2VEZWVwID0gcmVxdWlyZSgnLi9fYmFzZU1lcmdlRGVlcCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWVyZ2VgIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzcmNJbmRleCBUaGUgaW5kZXggb2YgYHNvdXJjZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBtZXJnZWQgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2UgdmFsdWVzIGFuZCB0aGVpciBtZXJnZWRcbiAqICBjb3VudGVycGFydHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIGlmIChvYmplY3QgPT09IHNvdXJjZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIShpc0FycmF5KHNvdXJjZSkgfHwgaXNUeXBlZEFycmF5KHNvdXJjZSkpKSB7XG4gICAgdmFyIHByb3BzID0ga2V5c0luKHNvdXJjZSk7XG4gIH1cbiAgYXJyYXlFYWNoKHByb3BzIHx8IHNvdXJjZSwgZnVuY3Rpb24oc3JjVmFsdWUsIGtleSkge1xuICAgIGlmIChwcm9wcykge1xuICAgICAga2V5ID0gc3JjVmFsdWU7XG4gICAgICBzcmNWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICBpZiAoaXNPYmplY3Qoc3JjVmFsdWUpKSB7XG4gICAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgICAgYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBzcmNJbmRleCwgYmFzZU1lcmdlLCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgICA/IGN1c3RvbWl6ZXIob2JqZWN0W2tleV0sIHNyY1ZhbHVlLCAoa2V5ICsgJycpLCBvYmplY3QsIHNvdXJjZSwgc3RhY2spXG4gICAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBuZXdWYWx1ZSA9IHNyY1ZhbHVlO1xuICAgICAgfVxuICAgICAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1lcmdlO1xuIl19