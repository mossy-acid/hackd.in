'use strict';

var keys = require('./keys');

/**
 * The base implementation of `_.conforms` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property predicates to conform to.
 * @returns {Function} Returns the new spec function.
 */
function baseConforms(source) {
  var props = keys(source),
      length = props.length;

  return function (object) {
    if (object == null) {
      return !length;
    }
    var index = length;
    while (index--) {
      var key = props[index],
          predicate = source[key],
          value = object[key];

      if (value === undefined && !(key in Object(object)) || !predicate(value)) {
        return false;
      }
    }
    return true;
  };
}

module.exports = baseConforms;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlQ29uZm9ybXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE9BQU8sUUFBUSxRQUFSLENBQVg7Ozs7Ozs7OztBQVNBLFNBQVMsWUFBVCxDQUFzQixNQUF0QixFQUE4QjtBQUM1QixNQUFJLFFBQVEsS0FBSyxNQUFMLENBQVo7TUFDSSxTQUFTLE1BQU0sTUFEbkI7O0FBR0EsU0FBTyxVQUFTLE1BQVQsRUFBaUI7QUFDdEIsUUFBSSxVQUFVLElBQWQsRUFBb0I7QUFDbEIsYUFBTyxDQUFDLE1BQVI7QUFDRDtBQUNELFFBQUksUUFBUSxNQUFaO0FBQ0EsV0FBTyxPQUFQLEVBQWdCO0FBQ2QsVUFBSSxNQUFNLE1BQU0sS0FBTixDQUFWO1VBQ0ksWUFBWSxPQUFPLEdBQVAsQ0FEaEI7VUFFSSxRQUFRLE9BQU8sR0FBUCxDQUZaOztBQUlBLFVBQUssVUFBVSxTQUFWLElBQ0QsRUFBRSxPQUFPLE9BQU8sTUFBUCxDQUFULENBREEsSUFDNkIsQ0FBQyxVQUFVLEtBQVYsQ0FEbEMsRUFDb0Q7QUFDbEQsZUFBTyxLQUFQO0FBQ0Q7QUFDRjtBQUNELFdBQU8sSUFBUDtBQUNELEdBaEJEO0FBaUJEOztBQUVELE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJfYmFzZUNvbmZvcm1zLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jb25mb3Jtc2Agd2hpY2ggZG9lc24ndCBjbG9uZSBgc291cmNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IG9mIHByb3BlcnR5IHByZWRpY2F0ZXMgdG8gY29uZm9ybSB0by5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VDb25mb3Jtcyhzb3VyY2UpIHtcbiAgdmFyIHByb3BzID0ga2V5cyhzb3VyY2UpLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiAhbGVuZ3RoO1xuICAgIH1cbiAgICB2YXIgaW5kZXggPSBsZW5ndGg7XG4gICAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF0sXG4gICAgICAgICAgcHJlZGljYXRlID0gc291cmNlW2tleV0sXG4gICAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XTtcblxuICAgICAgaWYgKCh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgIShrZXkgaW4gT2JqZWN0KG9iamVjdCkpKSB8fCAhcHJlZGljYXRlKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDb25mb3JtcztcbiJdfQ==