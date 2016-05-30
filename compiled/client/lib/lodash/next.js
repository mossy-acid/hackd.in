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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL25leHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsUUFBUSxXQUFSLENBQVY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCSixTQUFTLFdBQVQsR0FBdUI7QUFDckIsTUFBSSxLQUFLLFVBQUwsS0FBb0IsU0FBcEIsRUFBK0I7QUFDakMsU0FBSyxVQUFMLEdBQWtCLFFBQVEsS0FBSyxLQUFMLEVBQVIsQ0FBbEIsQ0FEaUM7R0FBbkM7QUFHQSxNQUFJLE9BQU8sS0FBSyxTQUFMLElBQWtCLEtBQUssVUFBTCxDQUFnQixNQUFoQjtNQUN6QixRQUFRLE9BQU8sU0FBUCxHQUFtQixLQUFLLFVBQUwsQ0FBZ0IsS0FBSyxTQUFMLEVBQWhCLENBQW5CLENBTFM7O0FBT3JCLFNBQU8sRUFBRSxRQUFRLElBQVIsRUFBYyxTQUFTLEtBQVQsRUFBdkIsQ0FQcUI7Q0FBdkI7O0FBVUEsT0FBTyxPQUFQLEdBQWlCLFdBQWpCIiwiZmlsZSI6Im5leHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdG9BcnJheSA9IHJlcXVpcmUoJy4vdG9BcnJheScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG5leHQgdmFsdWUgb24gYSB3cmFwcGVkIG9iamVjdCBmb2xsb3dpbmcgdGhlXG4gKiBbaXRlcmF0b3IgcHJvdG9jb2xdKGh0dHBzOi8vbWRuLmlvL2l0ZXJhdGlvbl9wcm90b2NvbHMjaXRlcmF0b3IpLlxuICpcbiAqIEBuYW1lIG5leHRcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBTZXFcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5leHQgaXRlcmF0b3IgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB3cmFwcGVkID0gXyhbMSwgMl0pO1xuICpcbiAqIHdyYXBwZWQubmV4dCgpO1xuICogLy8gPT4geyAnZG9uZSc6IGZhbHNlLCAndmFsdWUnOiAxIH1cbiAqXG4gKiB3cmFwcGVkLm5leHQoKTtcbiAqIC8vID0+IHsgJ2RvbmUnOiBmYWxzZSwgJ3ZhbHVlJzogMiB9XG4gKlxuICogd3JhcHBlZC5uZXh0KCk7XG4gKiAvLyA9PiB7ICdkb25lJzogdHJ1ZSwgJ3ZhbHVlJzogdW5kZWZpbmVkIH1cbiAqL1xuZnVuY3Rpb24gd3JhcHBlck5leHQoKSB7XG4gIGlmICh0aGlzLl9fdmFsdWVzX18gPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX192YWx1ZXNfXyA9IHRvQXJyYXkodGhpcy52YWx1ZSgpKTtcbiAgfVxuICB2YXIgZG9uZSA9IHRoaXMuX19pbmRleF9fID49IHRoaXMuX192YWx1ZXNfXy5sZW5ndGgsXG4gICAgICB2YWx1ZSA9IGRvbmUgPyB1bmRlZmluZWQgOiB0aGlzLl9fdmFsdWVzX19bdGhpcy5fX2luZGV4X18rK107XG5cbiAgcmV0dXJuIHsgJ2RvbmUnOiBkb25lLCAndmFsdWUnOiB2YWx1ZSB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXBwZXJOZXh0O1xuIl19