'use strict';

var toArray = require('./toArray');

/**
 * Gets the next value on a wrapped object following the
 * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
 *
 * @name next
 * @memberOf _
 * @since 4.0.0
 * @category Seq
 * @returns {Object} Returns the next iterator value.
 * @example
 *
 * var wrapped = _([1, 2]);
 *
 * wrapped.next();
 * // => { 'done': false, 'value': 1 }
 *
 * wrapped.next();
 * // => { 'done': false, 'value': 2 }
 *
 * wrapped.next();
 * // => { 'done': true, 'value': undefined }
 */
function wrapperNext() {
  if (this.__values__ === undefined) {
    this.__values__ = toArray(this.value());
  }
  var done = this.__index__ >= this.__values__.length,
      value = done ? undefined : this.__values__[this.__index__++];

  return { 'done': done, 'value': value };
}

module.exports = wrapperNext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL25leHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsUUFBUSxXQUFSLENBQWQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxTQUFTLFdBQVQsR0FBdUI7QUFDckIsTUFBSSxLQUFLLFVBQUwsS0FBb0IsU0FBeEIsRUFBbUM7QUFDakMsU0FBSyxVQUFMLEdBQWtCLFFBQVEsS0FBSyxLQUFMLEVBQVIsQ0FBbEI7QUFDRDtBQUNELE1BQUksT0FBTyxLQUFLLFNBQUwsSUFBa0IsS0FBSyxVQUFMLENBQWdCLE1BQTdDO01BQ0ksUUFBUSxPQUFPLFNBQVAsR0FBbUIsS0FBSyxVQUFMLENBQWdCLEtBQUssU0FBTCxFQUFoQixDQUQvQjs7QUFHQSxTQUFPLEVBQUUsUUFBUSxJQUFWLEVBQWdCLFNBQVMsS0FBekIsRUFBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixXQUFqQiIsImZpbGUiOiJuZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRvQXJyYXkgPSByZXF1aXJlKCcuL3RvQXJyYXknKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuZXh0IHZhbHVlIG9uIGEgd3JhcHBlZCBvYmplY3QgZm9sbG93aW5nIHRoZVxuICogW2l0ZXJhdG9yIHByb3RvY29sXShodHRwczovL21kbi5pby9pdGVyYXRpb25fcHJvdG9jb2xzI2l0ZXJhdG9yKS5cbiAqXG4gKiBAbmFtZSBuZXh0XG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgU2VxXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXh0IGl0ZXJhdG9yIHZhbHVlLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgd3JhcHBlZCA9IF8oWzEsIDJdKTtcbiAqXG4gKiB3cmFwcGVkLm5leHQoKTtcbiAqIC8vID0+IHsgJ2RvbmUnOiBmYWxzZSwgJ3ZhbHVlJzogMSB9XG4gKlxuICogd3JhcHBlZC5uZXh0KCk7XG4gKiAvLyA9PiB7ICdkb25lJzogZmFsc2UsICd2YWx1ZSc6IDIgfVxuICpcbiAqIHdyYXBwZWQubmV4dCgpO1xuICogLy8gPT4geyAnZG9uZSc6IHRydWUsICd2YWx1ZSc6IHVuZGVmaW5lZCB9XG4gKi9cbmZ1bmN0aW9uIHdyYXBwZXJOZXh0KCkge1xuICBpZiAodGhpcy5fX3ZhbHVlc19fID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9fdmFsdWVzX18gPSB0b0FycmF5KHRoaXMudmFsdWUoKSk7XG4gIH1cbiAgdmFyIGRvbmUgPSB0aGlzLl9faW5kZXhfXyA+PSB0aGlzLl9fdmFsdWVzX18ubGVuZ3RoLFxuICAgICAgdmFsdWUgPSBkb25lID8gdW5kZWZpbmVkIDogdGhpcy5fX3ZhbHVlc19fW3RoaXMuX19pbmRleF9fKytdO1xuXG4gIHJldHVybiB7ICdkb25lJzogZG9uZSwgJ3ZhbHVlJzogdmFsdWUgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3cmFwcGVyTmV4dDtcbiJdfQ==