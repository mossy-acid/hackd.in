'use strict';

var isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/**
 * The base implementation of `_.toNumber` which doesn't ensure correct
 * conversions of binary, hexadecimal, or octal string values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 */
function baseToNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  return +value;
}

module.exports = baseToNumber;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlVG9OdW1iZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQVg7OztBQUdKLElBQUksTUFBTSxJQUFJLENBQUo7Ozs7Ozs7Ozs7QUFVVixTQUFTLFlBQVQsQ0FBc0IsS0FBdEIsRUFBNkI7QUFDM0IsTUFBSSxPQUFPLEtBQVAsSUFBZ0IsUUFBaEIsRUFBMEI7QUFDNUIsV0FBTyxLQUFQLENBRDRCO0dBQTlCO0FBR0EsTUFBSSxTQUFTLEtBQVQsQ0FBSixFQUFxQjtBQUNuQixXQUFPLEdBQVAsQ0FEbUI7R0FBckI7QUFHQSxTQUFPLENBQUMsS0FBRCxDQVBvQjtDQUE3Qjs7QUFVQSxPQUFPLE9BQVAsR0FBaUIsWUFBakIiLCJmaWxlIjoiX2Jhc2VUb051bWJlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9OdW1iZXJgIHdoaWNoIGRvZXNuJ3QgZW5zdXJlIGNvcnJlY3RcbiAqIGNvbnZlcnNpb25zIG9mIGJpbmFyeSwgaGV4YWRlY2ltYWwsIG9yIG9jdGFsIHN0cmluZyB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUb051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIHJldHVybiArdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRvTnVtYmVyO1xuIl19