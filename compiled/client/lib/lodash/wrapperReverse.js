'use strict';

var LazyWrapper = require('./_LazyWrapper'),
    LodashWrapper = require('./_LodashWrapper'),
    reverse = require('./reverse'),
    thru = require('./thru');

/**
 * This method is the wrapper version of `_.reverse`.
 *
 * **Note:** This method mutates the wrapped array.
 *
 * @name reverse
 * @memberOf _
 * @since 0.1.0
 * @category Seq
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * _(array).reverse().value()
 * // => [3, 2, 1]
 *
 * console.log(array);
 * // => [3, 2, 1]
 */
function wrapperReverse() {
  var value = this.__wrapped__;
  if (value instanceof LazyWrapper) {
    var wrapped = value;
    if (this.__actions__.length) {
      wrapped = new LazyWrapper(this);
    }
    wrapped = wrapped.reverse();
    wrapped.__actions__.push({
      'func': thru,
      'args': [reverse],
      'thisArg': undefined
    });
    return new LodashWrapper(wrapped, this.__chain__);
  }
  return this.thru(reverse);
}

module.exports = wrapperReverse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3dyYXBwZXJSZXZlcnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLGdCQUFnQixRQUFRLGtCQUFSLENBQWhCO0lBQ0EsVUFBVSxRQUFRLFdBQVIsQ0FBVjtJQUNBLE9BQU8sUUFBUSxRQUFSLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkosU0FBUyxjQUFULEdBQTBCO0FBQ3hCLE1BQUksUUFBUSxLQUFLLFdBQUwsQ0FEWTtBQUV4QixNQUFJLGlCQUFpQixXQUFqQixFQUE4QjtBQUNoQyxRQUFJLFVBQVUsS0FBVixDQUQ0QjtBQUVoQyxRQUFJLEtBQUssV0FBTCxDQUFpQixNQUFqQixFQUF5QjtBQUMzQixnQkFBVSxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsQ0FBVixDQUQyQjtLQUE3QjtBQUdBLGNBQVUsUUFBUSxPQUFSLEVBQVYsQ0FMZ0M7QUFNaEMsWUFBUSxXQUFSLENBQW9CLElBQXBCLENBQXlCO0FBQ3ZCLGNBQVEsSUFBUjtBQUNBLGNBQVEsQ0FBQyxPQUFELENBQVI7QUFDQSxpQkFBVyxTQUFYO0tBSEYsRUFOZ0M7QUFXaEMsV0FBTyxJQUFJLGFBQUosQ0FBa0IsT0FBbEIsRUFBMkIsS0FBSyxTQUFMLENBQWxDLENBWGdDO0dBQWxDO0FBYUEsU0FBTyxLQUFLLElBQUwsQ0FBVSxPQUFWLENBQVAsQ0Fmd0I7Q0FBMUI7O0FBa0JBLE9BQU8sT0FBUCxHQUFpQixjQUFqQiIsImZpbGUiOiJ3cmFwcGVyUmV2ZXJzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBMYXp5V3JhcHBlciA9IHJlcXVpcmUoJy4vX0xhenlXcmFwcGVyJyksXG4gICAgTG9kYXNoV3JhcHBlciA9IHJlcXVpcmUoJy4vX0xvZGFzaFdyYXBwZXInKSxcbiAgICByZXZlcnNlID0gcmVxdWlyZSgnLi9yZXZlcnNlJyksXG4gICAgdGhydSA9IHJlcXVpcmUoJy4vdGhydScpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIHRoZSB3cmFwcGVyIHZlcnNpb24gb2YgYF8ucmV2ZXJzZWAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgdGhlIHdyYXBwZWQgYXJyYXkuXG4gKlxuICogQG5hbWUgcmV2ZXJzZVxuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IFNlcVxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IGBsb2Rhc2hgIHdyYXBwZXIgaW5zdGFuY2UuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheSA9IFsxLCAyLCAzXTtcbiAqXG4gKiBfKGFycmF5KS5yZXZlcnNlKCkudmFsdWUoKVxuICogLy8gPT4gWzMsIDIsIDFdXG4gKlxuICogY29uc29sZS5sb2coYXJyYXkpO1xuICogLy8gPT4gWzMsIDIsIDFdXG4gKi9cbmZ1bmN0aW9uIHdyYXBwZXJSZXZlcnNlKCkge1xuICB2YXIgdmFsdWUgPSB0aGlzLl9fd3JhcHBlZF9fO1xuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBMYXp5V3JhcHBlcikge1xuICAgIHZhciB3cmFwcGVkID0gdmFsdWU7XG4gICAgaWYgKHRoaXMuX19hY3Rpb25zX18ubGVuZ3RoKSB7XG4gICAgICB3cmFwcGVkID0gbmV3IExhenlXcmFwcGVyKHRoaXMpO1xuICAgIH1cbiAgICB3cmFwcGVkID0gd3JhcHBlZC5yZXZlcnNlKCk7XG4gICAgd3JhcHBlZC5fX2FjdGlvbnNfXy5wdXNoKHtcbiAgICAgICdmdW5jJzogdGhydSxcbiAgICAgICdhcmdzJzogW3JldmVyc2VdLFxuICAgICAgJ3RoaXNBcmcnOiB1bmRlZmluZWRcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3IExvZGFzaFdyYXBwZXIod3JhcHBlZCwgdGhpcy5fX2NoYWluX18pO1xuICB9XG4gIHJldHVybiB0aGlzLnRocnUocmV2ZXJzZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcHBlclJldmVyc2U7XG4iXX0=