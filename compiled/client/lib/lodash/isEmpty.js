'use strict';

var getTag = require('./_getTag'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLike = require('./isArrayLike'),
    isBuffer = require('./isBuffer'),
    isFunction = require('./isFunction'),
    isObjectLike = require('./isObjectLike'),
    isString = require('./isString'),
    keys = require('./keys');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (isArrayLike(value) && (isArray(value) || isString(value) || isFunction(value.splice) || isArguments(value) || isBuffer(value))) {
    return !value.length;
  }
  if (isObjectLike(value)) {
    var tag = getTag(value);
    if (tag == mapTag || tag == setTag) {
      return !value.size;
    }
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return !(nonEnumShadows && keys(value).length);
}

module.exports = isEmpty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2lzRW1wdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFNBQVMsUUFBUSxXQUFSLENBQWI7SUFDSSxjQUFjLFFBQVEsZUFBUixDQURsQjtJQUVJLFVBQVUsUUFBUSxXQUFSLENBRmQ7SUFHSSxjQUFjLFFBQVEsZUFBUixDQUhsQjtJQUlJLFdBQVcsUUFBUSxZQUFSLENBSmY7SUFLSSxhQUFhLFFBQVEsY0FBUixDQUxqQjtJQU1JLGVBQWUsUUFBUSxnQkFBUixDQU5uQjtJQU9JLFdBQVcsUUFBUSxZQUFSLENBUGY7SUFRSSxPQUFPLFFBQVEsUUFBUixDQVJYOzs7QUFXQSxJQUFJLFNBQVMsY0FBYjtJQUNJLFNBQVMsY0FEYjs7O0FBSUEsSUFBSSxjQUFjLE9BQU8sU0FBekI7OztBQUdBLElBQUksaUJBQWlCLFlBQVksY0FBakM7OztBQUdBLElBQUksdUJBQXVCLFlBQVksb0JBQXZDOzs7QUFHQSxJQUFJLGlCQUFpQixDQUFDLHFCQUFxQixJQUFyQixDQUEwQixFQUFFLFdBQVcsQ0FBYixFQUExQixFQUE0QyxTQUE1QyxDQUF0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQ0EsU0FBUyxPQUFULENBQWlCLEtBQWpCLEVBQXdCO0FBQ3RCLE1BQUksWUFBWSxLQUFaLE1BQ0MsUUFBUSxLQUFSLEtBQWtCLFNBQVMsS0FBVCxDQUFsQixJQUFxQyxXQUFXLE1BQU0sTUFBakIsQ0FBckMsSUFDQyxZQUFZLEtBQVosQ0FERCxJQUN1QixTQUFTLEtBQVQsQ0FGeEIsQ0FBSixFQUU4QztBQUM1QyxXQUFPLENBQUMsTUFBTSxNQUFkO0FBQ0Q7QUFDRCxNQUFJLGFBQWEsS0FBYixDQUFKLEVBQXlCO0FBQ3ZCLFFBQUksTUFBTSxPQUFPLEtBQVAsQ0FBVjtBQUNBLFFBQUksT0FBTyxNQUFQLElBQWlCLE9BQU8sTUFBNUIsRUFBb0M7QUFDbEMsYUFBTyxDQUFDLE1BQU0sSUFBZDtBQUNEO0FBQ0Y7QUFDRCxPQUFLLElBQUksR0FBVCxJQUFnQixLQUFoQixFQUF1QjtBQUNyQixRQUFJLGVBQWUsSUFBZixDQUFvQixLQUFwQixFQUEyQixHQUEzQixDQUFKLEVBQXFDO0FBQ25DLGFBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLEVBQUUsa0JBQWtCLEtBQUssS0FBTCxFQUFZLE1BQWhDLENBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoiaXNFbXB0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyksXG4gICAgaXNTdHJpbmcgPSByZXF1aXJlKCcuL2lzU3RyaW5nJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKiBEZXRlY3QgaWYgcHJvcGVydGllcyBzaGFkb3dpbmcgdGhvc2Ugb24gYE9iamVjdC5wcm90b3R5cGVgIGFyZSBub24tZW51bWVyYWJsZS4gKi9cbnZhciBub25FbnVtU2hhZG93cyA9ICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHsgJ3ZhbHVlT2YnOiAxIH0sICd2YWx1ZU9mJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gZW1wdHkgb2JqZWN0LCBjb2xsZWN0aW9uLCBtYXAsIG9yIHNldC5cbiAqXG4gKiBPYmplY3RzIGFyZSBjb25zaWRlcmVkIGVtcHR5IGlmIHRoZXkgaGF2ZSBubyBvd24gZW51bWVyYWJsZSBzdHJpbmcga2V5ZWRcbiAqIHByb3BlcnRpZXMuXG4gKlxuICogQXJyYXktbGlrZSB2YWx1ZXMgc3VjaCBhcyBgYXJndW1lbnRzYCBvYmplY3RzLCBhcnJheXMsIGJ1ZmZlcnMsIHN0cmluZ3MsIG9yXG4gKiBqUXVlcnktbGlrZSBjb2xsZWN0aW9ucyBhcmUgY29uc2lkZXJlZCBlbXB0eSBpZiB0aGV5IGhhdmUgYSBgbGVuZ3RoYCBvZiBgMGAuXG4gKiBTaW1pbGFybHksIG1hcHMgYW5kIHNldHMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgaWYgdGhleSBoYXZlIGEgYHNpemVgIG9mIGAwYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBlbXB0eSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRW1wdHkobnVsbCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KHRydWUpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eSgxKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0VtcHR5KHsgJ2EnOiAxIH0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmXG4gICAgICAoaXNBcnJheSh2YWx1ZSkgfHwgaXNTdHJpbmcodmFsdWUpIHx8IGlzRnVuY3Rpb24odmFsdWUuc3BsaWNlKSB8fFxuICAgICAgICBpc0FyZ3VtZW50cyh2YWx1ZSkgfHwgaXNCdWZmZXIodmFsdWUpKSkge1xuICAgIHJldHVybiAhdmFsdWUubGVuZ3RoO1xuICB9XG4gIGlmIChpc09iamVjdExpa2UodmFsdWUpKSB7XG4gICAgdmFyIHRhZyA9IGdldFRhZyh2YWx1ZSk7XG4gICAgaWYgKHRhZyA9PSBtYXBUYWcgfHwgdGFnID09IHNldFRhZykge1xuICAgICAgcmV0dXJuICF2YWx1ZS5zaXplO1xuICAgIH1cbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gIShub25FbnVtU2hhZG93cyAmJiBrZXlzKHZhbHVlKS5sZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRW1wdHk7XG4iXX0=