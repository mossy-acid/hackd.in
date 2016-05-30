'use strict';

var baseLodash = require('./_baseLodash'),
    wrapperClone = require('./_wrapperClone');

/**
 * Creates a clone of the chain sequence planting `value` as the wrapped value.
 *
 * @name plant
 * @memberOf _
 * @since 3.2.0
 * @category Seq
 * @param {*} value The value to plant.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var wrapped = _([1, 2]).map(square);
 * var other = wrapped.plant([3, 4]);
 *
 * other.value();
 * // => [9, 16]
 *
 * wrapped.value();
 * // => [1, 4]
 */
function wrapperPlant(value) {
  var result,
      parent = this;

  while (parent instanceof baseLodash) {
    var clone = wrapperClone(parent);
    clone.__index__ = 0;
    clone.__values__ = undefined;
    if (result) {
      previous.__wrapped__ = clone;
    } else {
      result = clone;
    }
    var previous = clone;
    parent = parent.__wrapped__;
  }
  previous.__wrapped__ = value;
  return result;
}

module.exports = wrapperPlant;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3BsYW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxhQUFhLFFBQVEsZUFBUixDQUFqQjtJQUNJLGVBQWUsUUFBUSxpQkFBUixDQURuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkEsU0FBUyxZQUFULENBQXNCLEtBQXRCLEVBQTZCO0FBQzNCLE1BQUksTUFBSjtNQUNJLFNBQVMsSUFEYjs7QUFHQSxTQUFPLGtCQUFrQixVQUF6QixFQUFxQztBQUNuQyxRQUFJLFFBQVEsYUFBYSxNQUFiLENBQVo7QUFDQSxVQUFNLFNBQU4sR0FBa0IsQ0FBbEI7QUFDQSxVQUFNLFVBQU4sR0FBbUIsU0FBbkI7QUFDQSxRQUFJLE1BQUosRUFBWTtBQUNWLGVBQVMsV0FBVCxHQUF1QixLQUF2QjtBQUNELEtBRkQsTUFFTztBQUNMLGVBQVMsS0FBVDtBQUNEO0FBQ0QsUUFBSSxXQUFXLEtBQWY7QUFDQSxhQUFTLE9BQU8sV0FBaEI7QUFDRDtBQUNELFdBQVMsV0FBVCxHQUF1QixLQUF2QjtBQUNBLFNBQU8sTUFBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJwbGFudC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlTG9kYXNoID0gcmVxdWlyZSgnLi9fYmFzZUxvZGFzaCcpLFxuICAgIHdyYXBwZXJDbG9uZSA9IHJlcXVpcmUoJy4vX3dyYXBwZXJDbG9uZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgY2hhaW4gc2VxdWVuY2UgcGxhbnRpbmcgYHZhbHVlYCBhcyB0aGUgd3JhcHBlZCB2YWx1ZS5cbiAqXG4gKiBAbmFtZSBwbGFudFxuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjIuMFxuICogQGNhdGVnb3J5IFNlcVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcGxhbnQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgYGxvZGFzaGAgd3JhcHBlciBpbnN0YW5jZS5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gc3F1YXJlKG4pIHtcbiAqICAgcmV0dXJuIG4gKiBuO1xuICogfVxuICpcbiAqIHZhciB3cmFwcGVkID0gXyhbMSwgMl0pLm1hcChzcXVhcmUpO1xuICogdmFyIG90aGVyID0gd3JhcHBlZC5wbGFudChbMywgNF0pO1xuICpcbiAqIG90aGVyLnZhbHVlKCk7XG4gKiAvLyA9PiBbOSwgMTZdXG4gKlxuICogd3JhcHBlZC52YWx1ZSgpO1xuICogLy8gPT4gWzEsIDRdXG4gKi9cbmZ1bmN0aW9uIHdyYXBwZXJQbGFudCh2YWx1ZSkge1xuICB2YXIgcmVzdWx0LFxuICAgICAgcGFyZW50ID0gdGhpcztcblxuICB3aGlsZSAocGFyZW50IGluc3RhbmNlb2YgYmFzZUxvZGFzaCkge1xuICAgIHZhciBjbG9uZSA9IHdyYXBwZXJDbG9uZShwYXJlbnQpO1xuICAgIGNsb25lLl9faW5kZXhfXyA9IDA7XG4gICAgY2xvbmUuX192YWx1ZXNfXyA9IHVuZGVmaW5lZDtcbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICBwcmV2aW91cy5fX3dyYXBwZWRfXyA9IGNsb25lO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBjbG9uZTtcbiAgICB9XG4gICAgdmFyIHByZXZpb3VzID0gY2xvbmU7XG4gICAgcGFyZW50ID0gcGFyZW50Ll9fd3JhcHBlZF9fO1xuICB9XG4gIHByZXZpb3VzLl9fd3JhcHBlZF9fID0gdmFsdWU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcHBlclBsYW50O1xuIl19