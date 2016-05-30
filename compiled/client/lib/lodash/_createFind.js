'use strict';

var baseIteratee = require('./_baseIteratee'),
    isArrayLike = require('./isArrayLike'),
    keys = require('./keys');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function (collection, predicate, fromIndex) {
    var iterable = Object(collection);
    predicate = baseIteratee(predicate, 3);
    if (!isArrayLike(collection)) {
      var props = keys(collection);
    }
    var index = findIndexFunc(props || collection, function (value, key) {
      if (props) {
        key = value;
        value = iterable[key];
      }
      return predicate(value, key, iterable);
    }, fromIndex);
    return index > -1 ? collection[props ? props[index] : index] : undefined;
  };
}

module.exports = createFind;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVGaW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxlQUFlLFFBQVEsaUJBQVIsQ0FBbkI7SUFDSSxjQUFjLFFBQVEsZUFBUixDQURsQjtJQUVJLE9BQU8sUUFBUSxRQUFSLENBRlg7Ozs7Ozs7OztBQVdBLFNBQVMsVUFBVCxDQUFvQixhQUFwQixFQUFtQztBQUNqQyxTQUFPLFVBQVMsVUFBVCxFQUFxQixTQUFyQixFQUFnQyxTQUFoQyxFQUEyQztBQUNoRCxRQUFJLFdBQVcsT0FBTyxVQUFQLENBQWY7QUFDQSxnQkFBWSxhQUFhLFNBQWIsRUFBd0IsQ0FBeEIsQ0FBWjtBQUNBLFFBQUksQ0FBQyxZQUFZLFVBQVosQ0FBTCxFQUE4QjtBQUM1QixVQUFJLFFBQVEsS0FBSyxVQUFMLENBQVo7QUFDRDtBQUNELFFBQUksUUFBUSxjQUFjLFNBQVMsVUFBdkIsRUFBbUMsVUFBUyxLQUFULEVBQWdCLEdBQWhCLEVBQXFCO0FBQ2xFLFVBQUksS0FBSixFQUFXO0FBQ1QsY0FBTSxLQUFOO0FBQ0EsZ0JBQVEsU0FBUyxHQUFULENBQVI7QUFDRDtBQUNELGFBQU8sVUFBVSxLQUFWLEVBQWlCLEdBQWpCLEVBQXNCLFFBQXRCLENBQVA7QUFDRCxLQU5XLEVBTVQsU0FOUyxDQUFaO0FBT0EsV0FBTyxRQUFRLENBQUMsQ0FBVCxHQUFhLFdBQVcsUUFBUSxNQUFNLEtBQU4sQ0FBUixHQUF1QixLQUFsQyxDQUFiLEdBQXdELFNBQS9EO0FBQ0QsR0FkRDtBQWVEOztBQUVELE9BQU8sT0FBUCxHQUFpQixVQUFqQiIsImZpbGUiOiJfY3JlYXRlRmluZC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBfLmZpbmRgIG9yIGBfLmZpbmRMYXN0YCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZmluZEluZGV4RnVuYyBUaGUgZnVuY3Rpb24gdG8gZmluZCB0aGUgY29sbGVjdGlvbiBpbmRleC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZpbmQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUZpbmQoZmluZEluZGV4RnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgcHJlZGljYXRlLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgaXRlcmFibGUgPSBPYmplY3QoY29sbGVjdGlvbik7XG4gICAgcHJlZGljYXRlID0gYmFzZUl0ZXJhdGVlKHByZWRpY2F0ZSwgMyk7XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgdmFyIHByb3BzID0ga2V5cyhjb2xsZWN0aW9uKTtcbiAgICB9XG4gICAgdmFyIGluZGV4ID0gZmluZEluZGV4RnVuYyhwcm9wcyB8fCBjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICBpZiAocHJvcHMpIHtcbiAgICAgICAga2V5ID0gdmFsdWU7XG4gICAgICAgIHZhbHVlID0gaXRlcmFibGVba2V5XTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcmVkaWNhdGUodmFsdWUsIGtleSwgaXRlcmFibGUpO1xuICAgIH0sIGZyb21JbmRleCk7XG4gICAgcmV0dXJuIGluZGV4ID4gLTEgPyBjb2xsZWN0aW9uW3Byb3BzID8gcHJvcHNbaW5kZXhdIDogaW5kZXhdIDogdW5kZWZpbmVkO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUZpbmQ7XG4iXX0=