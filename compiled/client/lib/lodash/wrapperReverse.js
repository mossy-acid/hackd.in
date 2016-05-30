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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3dyYXBwZXJSZXZlcnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7SUFDSSxnQkFBZ0IsUUFBUSxrQkFBUixDQURwQjtJQUVJLFVBQVUsUUFBUSxXQUFSLENBRmQ7SUFHSSxPQUFPLFFBQVEsUUFBUixDQUhYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLFNBQVMsY0FBVCxHQUEwQjtBQUN4QixNQUFJLFFBQVEsS0FBSyxXQUFqQjtBQUNBLE1BQUksaUJBQWlCLFdBQXJCLEVBQWtDO0FBQ2hDLFFBQUksVUFBVSxLQUFkO0FBQ0EsUUFBSSxLQUFLLFdBQUwsQ0FBaUIsTUFBckIsRUFBNkI7QUFDM0IsZ0JBQVUsSUFBSSxXQUFKLENBQWdCLElBQWhCLENBQVY7QUFDRDtBQUNELGNBQVUsUUFBUSxPQUFSLEVBQVY7QUFDQSxZQUFRLFdBQVIsQ0FBb0IsSUFBcEIsQ0FBeUI7QUFDdkIsY0FBUSxJQURlO0FBRXZCLGNBQVEsQ0FBQyxPQUFELENBRmU7QUFHdkIsaUJBQVc7QUFIWSxLQUF6QjtBQUtBLFdBQU8sSUFBSSxhQUFKLENBQWtCLE9BQWxCLEVBQTJCLEtBQUssU0FBaEMsQ0FBUDtBQUNEO0FBQ0QsU0FBTyxLQUFLLElBQUwsQ0FBVSxPQUFWLENBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsY0FBakIiLCJmaWxlIjoid3JhcHBlclJldmVyc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTGF6eVdyYXBwZXIgPSByZXF1aXJlKCcuL19MYXp5V3JhcHBlcicpLFxuICAgIExvZGFzaFdyYXBwZXIgPSByZXF1aXJlKCcuL19Mb2Rhc2hXcmFwcGVyJyksXG4gICAgcmV2ZXJzZSA9IHJlcXVpcmUoJy4vcmV2ZXJzZScpLFxuICAgIHRocnUgPSByZXF1aXJlKCcuL3RocnUnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyB0aGUgd3JhcHBlciB2ZXJzaW9uIG9mIGBfLnJldmVyc2VgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIHRoZSB3cmFwcGVkIGFycmF5LlxuICpcbiAqIEBuYW1lIHJldmVyc2VcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBTZXFcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBgbG9kYXNoYCB3cmFwcGVyIGluc3RhbmNlLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXkgPSBbMSwgMiwgM107XG4gKlxuICogXyhhcnJheSkucmV2ZXJzZSgpLnZhbHVlKClcbiAqIC8vID0+IFszLCAyLCAxXVxuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAqIC8vID0+IFszLCAyLCAxXVxuICovXG5mdW5jdGlvbiB3cmFwcGVyUmV2ZXJzZSgpIHtcbiAgdmFyIHZhbHVlID0gdGhpcy5fX3dyYXBwZWRfXztcbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgTGF6eVdyYXBwZXIpIHtcbiAgICB2YXIgd3JhcHBlZCA9IHZhbHVlO1xuICAgIGlmICh0aGlzLl9fYWN0aW9uc19fLmxlbmd0aCkge1xuICAgICAgd3JhcHBlZCA9IG5ldyBMYXp5V3JhcHBlcih0aGlzKTtcbiAgICB9XG4gICAgd3JhcHBlZCA9IHdyYXBwZWQucmV2ZXJzZSgpO1xuICAgIHdyYXBwZWQuX19hY3Rpb25zX18ucHVzaCh7XG4gICAgICAnZnVuYyc6IHRocnUsXG4gICAgICAnYXJncyc6IFtyZXZlcnNlXSxcbiAgICAgICd0aGlzQXJnJzogdW5kZWZpbmVkXG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBMb2Rhc2hXcmFwcGVyKHdyYXBwZWQsIHRoaXMuX19jaGFpbl9fKTtcbiAgfVxuICByZXR1cm4gdGhpcy50aHJ1KHJldmVyc2UpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXBwZXJSZXZlcnNlO1xuIl19