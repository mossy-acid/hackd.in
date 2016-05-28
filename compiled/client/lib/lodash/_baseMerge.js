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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlTWVyZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFFBQVEsUUFBUSxVQUFSLENBQVI7SUFDQSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsbUJBQW1CLFFBQVEscUJBQVIsQ0FBbkI7SUFDQSxnQkFBZ0IsUUFBUSxrQkFBUixDQUFoQjtJQUNBLFVBQVUsUUFBUSxXQUFSLENBQVY7SUFDQSxXQUFXLFFBQVEsWUFBUixDQUFYO0lBQ0EsZUFBZSxRQUFRLGdCQUFSLENBQWY7SUFDQSxTQUFTLFFBQVEsVUFBUixDQUFUOzs7Ozs7Ozs7Ozs7O0FBYUosU0FBUyxTQUFULENBQW1CLE1BQW5CLEVBQTJCLE1BQTNCLEVBQW1DLFFBQW5DLEVBQTZDLFVBQTdDLEVBQXlELEtBQXpELEVBQWdFO0FBQzlELE1BQUksV0FBVyxNQUFYLEVBQW1CO0FBQ3JCLFdBRHFCO0dBQXZCO0FBR0EsTUFBSSxFQUFFLFFBQVEsTUFBUixLQUFtQixhQUFhLE1BQWIsQ0FBbkIsQ0FBRixFQUE0QztBQUM5QyxRQUFJLFFBQVEsT0FBTyxNQUFQLENBQVIsQ0FEMEM7R0FBaEQ7QUFHQSxZQUFVLFNBQVMsTUFBVCxFQUFpQixVQUFTLFFBQVQsRUFBbUIsR0FBbkIsRUFBd0I7QUFDakQsUUFBSSxLQUFKLEVBQVc7QUFDVCxZQUFNLFFBQU4sQ0FEUztBQUVULGlCQUFXLE9BQU8sR0FBUCxDQUFYLENBRlM7S0FBWDtBQUlBLFFBQUksU0FBUyxRQUFULENBQUosRUFBd0I7QUFDdEIsZ0JBQVUsUUFBUSxJQUFJLEtBQUosRUFBUixDQUFWLENBRHNCO0FBRXRCLG9CQUFjLE1BQWQsRUFBc0IsTUFBdEIsRUFBOEIsR0FBOUIsRUFBbUMsUUFBbkMsRUFBNkMsU0FBN0MsRUFBd0QsVUFBeEQsRUFBb0UsS0FBcEUsRUFGc0I7S0FBeEIsTUFJSztBQUNILFVBQUksV0FBVyxhQUNYLFdBQVcsT0FBTyxHQUFQLENBQVgsRUFBd0IsUUFBeEIsRUFBbUMsTUFBTSxFQUFOLEVBQVcsTUFBOUMsRUFBc0QsTUFBdEQsRUFBOEQsS0FBOUQsQ0FEVyxHQUVYLFNBRlcsQ0FEWjs7QUFLSCxVQUFJLGFBQWEsU0FBYixFQUF3QjtBQUMxQixtQkFBVyxRQUFYLENBRDBCO09BQTVCO0FBR0EsdUJBQWlCLE1BQWpCLEVBQXlCLEdBQXpCLEVBQThCLFFBQTlCLEVBUkc7S0FKTDtHQUx5QixDQUEzQixDQVA4RDtDQUFoRTs7QUE2QkEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6Il9iYXNlTWVyZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGFzc2lnbk1lcmdlVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25NZXJnZVZhbHVlJyksXG4gICAgYmFzZU1lcmdlRGVlcCA9IHJlcXVpcmUoJy4vX2Jhc2VNZXJnZURlZXAnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1lcmdlYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge251bWJlcn0gc3JjSW5kZXggVGhlIGluZGV4IG9mIGBzb3VyY2VgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgbWVyZ2VkIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIHZhbHVlcyBhbmQgdGhlaXIgbWVyZ2VkXG4gKiAgY291bnRlcnBhcnRzLlxuICovXG5mdW5jdGlvbiBiYXNlTWVyZ2Uob2JqZWN0LCBzb3VyY2UsIHNyY0luZGV4LCBjdXN0b21pemVyLCBzdGFjaykge1xuICBpZiAob2JqZWN0ID09PSBzb3VyY2UpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCEoaXNBcnJheShzb3VyY2UpIHx8IGlzVHlwZWRBcnJheShzb3VyY2UpKSkge1xuICAgIHZhciBwcm9wcyA9IGtleXNJbihzb3VyY2UpO1xuICB9XG4gIGFycmF5RWFjaChwcm9wcyB8fCBzb3VyY2UsIGZ1bmN0aW9uKHNyY1ZhbHVlLCBrZXkpIHtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIGtleSA9IHNyY1ZhbHVlO1xuICAgICAgc3JjVmFsdWUgPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gICAgaWYgKGlzT2JqZWN0KHNyY1ZhbHVlKSkge1xuICAgICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICAgIGJhc2VNZXJnZURlZXAob2JqZWN0LCBzb3VyY2UsIGtleSwgc3JjSW5kZXgsIGJhc2VNZXJnZSwgY3VzdG9taXplciwgc3RhY2spO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgICAgPyBjdXN0b21pemVyKG9iamVjdFtrZXldLCBzcmNWYWx1ZSwgKGtleSArICcnKSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKVxuICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBzcmNWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNZXJnZTtcbiJdfQ==