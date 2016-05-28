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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3BsYW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxhQUFhLFFBQVEsZUFBUixDQUFiO0lBQ0EsZUFBZSxRQUFRLGlCQUFSLENBQWY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJKLFNBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QjtBQUMzQixNQUFJLE1BQUo7TUFDSSxTQUFTLElBQVQsQ0FGdUI7O0FBSTNCLFNBQU8sa0JBQWtCLFVBQWxCLEVBQThCO0FBQ25DLFFBQUksUUFBUSxhQUFhLE1BQWIsQ0FBUixDQUQrQjtBQUVuQyxVQUFNLFNBQU4sR0FBa0IsQ0FBbEIsQ0FGbUM7QUFHbkMsVUFBTSxVQUFOLEdBQW1CLFNBQW5CLENBSG1DO0FBSW5DLFFBQUksTUFBSixFQUFZO0FBQ1YsZUFBUyxXQUFULEdBQXVCLEtBQXZCLENBRFU7S0FBWixNQUVPO0FBQ0wsZUFBUyxLQUFULENBREs7S0FGUDtBQUtBLFFBQUksV0FBVyxLQUFYLENBVCtCO0FBVW5DLGFBQVMsT0FBTyxXQUFQLENBVjBCO0dBQXJDO0FBWUEsV0FBUyxXQUFULEdBQXVCLEtBQXZCLENBaEIyQjtBQWlCM0IsU0FBTyxNQUFQLENBakIyQjtDQUE3Qjs7QUFvQkEsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6InBsYW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VMb2Rhc2ggPSByZXF1aXJlKCcuL19iYXNlTG9kYXNoJyksXG4gICAgd3JhcHBlckNsb25lID0gcmVxdWlyZSgnLi9fd3JhcHBlckNsb25lJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBjaGFpbiBzZXF1ZW5jZSBwbGFudGluZyBgdmFsdWVgIGFzIHRoZSB3cmFwcGVkIHZhbHVlLlxuICpcbiAqIEBuYW1lIHBsYW50XG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMi4wXG4gKiBAY2F0ZWdvcnkgU2VxXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwbGFudC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBgbG9kYXNoYCB3cmFwcGVyIGluc3RhbmNlLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBzcXVhcmUobikge1xuICogICByZXR1cm4gbiAqIG47XG4gKiB9XG4gKlxuICogdmFyIHdyYXBwZWQgPSBfKFsxLCAyXSkubWFwKHNxdWFyZSk7XG4gKiB2YXIgb3RoZXIgPSB3cmFwcGVkLnBsYW50KFszLCA0XSk7XG4gKlxuICogb3RoZXIudmFsdWUoKTtcbiAqIC8vID0+IFs5LCAxNl1cbiAqXG4gKiB3cmFwcGVkLnZhbHVlKCk7XG4gKiAvLyA9PiBbMSwgNF1cbiAqL1xuZnVuY3Rpb24gd3JhcHBlclBsYW50KHZhbHVlKSB7XG4gIHZhciByZXN1bHQsXG4gICAgICBwYXJlbnQgPSB0aGlzO1xuXG4gIHdoaWxlIChwYXJlbnQgaW5zdGFuY2VvZiBiYXNlTG9kYXNoKSB7XG4gICAgdmFyIGNsb25lID0gd3JhcHBlckNsb25lKHBhcmVudCk7XG4gICAgY2xvbmUuX19pbmRleF9fID0gMDtcbiAgICBjbG9uZS5fX3ZhbHVlc19fID0gdW5kZWZpbmVkO1xuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIHByZXZpb3VzLl9fd3JhcHBlZF9fID0gY2xvbmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IGNsb25lO1xuICAgIH1cbiAgICB2YXIgcHJldmlvdXMgPSBjbG9uZTtcbiAgICBwYXJlbnQgPSBwYXJlbnQuX193cmFwcGVkX187XG4gIH1cbiAgcHJldmlvdXMuX193cmFwcGVkX18gPSB2YWx1ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3cmFwcGVyUGxhbnQ7XG4iXX0=