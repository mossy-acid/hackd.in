'use strict';

var baseWrapperValue = require('./_baseWrapperValue');

/**
 * Executes the chain sequence to resolve the unwrapped value.
 *
 * @name value
 * @memberOf _
 * @since 0.1.0
 * @alias toJSON, valueOf
 * @category Seq
 * @returns {*} Returns the resolved unwrapped value.
 * @example
 *
 * _([1, 2, 3]).value();
 * // => [1, 2, 3]
 */
function wrapperValue() {
  return baseWrapperValue(this.__wrapped__, this.__actions__);
}

module.exports = wrapperValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3dyYXBwZXJWYWx1ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksbUJBQW1CLFFBQVEscUJBQVIsQ0FBbkI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkosU0FBUyxZQUFULEdBQXdCO0FBQ3RCLFNBQU8saUJBQWlCLEtBQUssV0FBTCxFQUFrQixLQUFLLFdBQUwsQ0FBMUMsQ0FEc0I7Q0FBeEI7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6IndyYXBwZXJWYWx1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlV3JhcHBlclZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZVdyYXBwZXJWYWx1ZScpO1xuXG4vKipcbiAqIEV4ZWN1dGVzIHRoZSBjaGFpbiBzZXF1ZW5jZSB0byByZXNvbHZlIHRoZSB1bndyYXBwZWQgdmFsdWUuXG4gKlxuICogQG5hbWUgdmFsdWVcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBhbGlhcyB0b0pTT04sIHZhbHVlT2ZcbiAqIEBjYXRlZ29yeSBTZXFcbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB1bndyYXBwZWQgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8oWzEsIDIsIDNdKS52YWx1ZSgpO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKi9cbmZ1bmN0aW9uIHdyYXBwZXJWYWx1ZSgpIHtcbiAgcmV0dXJuIGJhc2VXcmFwcGVyVmFsdWUodGhpcy5fX3dyYXBwZWRfXywgdGhpcy5fX2FjdGlvbnNfXyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcHBlclZhbHVlO1xuIl19