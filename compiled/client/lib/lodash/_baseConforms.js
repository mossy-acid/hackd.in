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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlQ29uZm9ybXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE9BQU8sUUFBUSxRQUFSLENBQVA7Ozs7Ozs7OztBQVNKLFNBQVMsWUFBVCxDQUFzQixNQUF0QixFQUE4QjtBQUM1QixNQUFJLFFBQVEsS0FBSyxNQUFMLENBQVI7TUFDQSxTQUFTLE1BQU0sTUFBTixDQUZlOztBQUk1QixTQUFPLFVBQVMsTUFBVCxFQUFpQjtBQUN0QixRQUFJLFVBQVUsSUFBVixFQUFnQjtBQUNsQixhQUFPLENBQUMsTUFBRCxDQURXO0tBQXBCO0FBR0EsUUFBSSxRQUFRLE1BQVIsQ0FKa0I7QUFLdEIsV0FBTyxPQUFQLEVBQWdCO0FBQ2QsVUFBSSxNQUFNLE1BQU0sS0FBTixDQUFOO1VBQ0EsWUFBWSxPQUFPLEdBQVAsQ0FBWjtVQUNBLFFBQVEsT0FBTyxHQUFQLENBQVIsQ0FIVTs7QUFLZCxVQUFJLEtBQUMsS0FBVSxTQUFWLElBQ0QsRUFBRSxPQUFPLE9BQU8sTUFBUCxDQUFQLENBQUYsSUFBNkIsQ0FBQyxVQUFVLEtBQVYsQ0FBRCxFQUFtQjtBQUNsRCxlQUFPLEtBQVAsQ0FEa0Q7T0FEcEQ7S0FMRjtBQVVBLFdBQU8sSUFBUCxDQWZzQjtHQUFqQixDQUpxQjtDQUE5Qjs7QUF1QkEsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6Il9iYXNlQ29uZm9ybXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNvbmZvcm1zYCB3aGljaCBkb2Vzbid0IGNsb25lIGBzb3VyY2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgcHJlZGljYXRlcyB0byBjb25mb3JtIHRvLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUNvbmZvcm1zKHNvdXJjZSkge1xuICB2YXIgcHJvcHMgPSBrZXlzKHNvdXJjZSksXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuICFsZW5ndGg7XG4gICAgfVxuICAgIHZhciBpbmRleCA9IGxlbmd0aDtcbiAgICB3aGlsZSAoaW5kZXgtLSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2luZGV4XSxcbiAgICAgICAgICBwcmVkaWNhdGUgPSBzb3VyY2Vba2V5XSxcbiAgICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuXG4gICAgICBpZiAoKHZhbHVlID09PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAhKGtleSBpbiBPYmplY3Qob2JqZWN0KSkpIHx8ICFwcmVkaWNhdGUodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNvbmZvcm1zO1xuIl19