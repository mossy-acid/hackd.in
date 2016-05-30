'use strict';

var toInteger = require('./toInteger'),
    toNumber = require('./toNumber'),
    toString = require('./toString');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Creates a function like `_.round`.
 *
 * @private
 * @param {string} methodName The name of the `Math` method to use when rounding.
 * @returns {Function} Returns the new round function.
 */
function createRound(methodName) {
  var func = Math[methodName];
  return function (number, precision) {
    number = toNumber(number);
    precision = nativeMin(toInteger(precision), 292);
    if (precision) {
      // Shift with exponential notation to avoid floating-point issues.
      // See [MDN](https://mdn.io/round#Examples) for more details.
      var pair = (toString(number) + 'e').split('e'),
          value = func(pair[0] + 'e' + (+pair[1] + precision));

      pair = (toString(value) + 'e').split('e');
      return +(pair[0] + 'e' + (+pair[1] - precision));
    }
    return func(number);
  };
}

module.exports = createRound;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVSb3VuZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxRQUFRLGFBQVIsQ0FBaEI7SUFDSSxXQUFXLFFBQVEsWUFBUixDQURmO0lBRUksV0FBVyxRQUFRLFlBQVIsQ0FGZjs7O0FBS0EsSUFBSSxZQUFZLEtBQUssR0FBckI7Ozs7Ozs7OztBQVNBLFNBQVMsV0FBVCxDQUFxQixVQUFyQixFQUFpQztBQUMvQixNQUFJLE9BQU8sS0FBSyxVQUFMLENBQVg7QUFDQSxTQUFPLFVBQVMsTUFBVCxFQUFpQixTQUFqQixFQUE0QjtBQUNqQyxhQUFTLFNBQVMsTUFBVCxDQUFUO0FBQ0EsZ0JBQVksVUFBVSxVQUFVLFNBQVYsQ0FBVixFQUFnQyxHQUFoQyxDQUFaO0FBQ0EsUUFBSSxTQUFKLEVBQWU7OztBQUdiLFVBQUksT0FBTyxDQUFDLFNBQVMsTUFBVCxJQUFtQixHQUFwQixFQUF5QixLQUF6QixDQUErQixHQUEvQixDQUFYO1VBQ0ksUUFBUSxLQUFLLEtBQUssQ0FBTCxJQUFVLEdBQVYsSUFBaUIsQ0FBQyxLQUFLLENBQUwsQ0FBRCxHQUFXLFNBQTVCLENBQUwsQ0FEWjs7QUFHQSxhQUFPLENBQUMsU0FBUyxLQUFULElBQWtCLEdBQW5CLEVBQXdCLEtBQXhCLENBQThCLEdBQTlCLENBQVA7QUFDQSxhQUFPLEVBQUUsS0FBSyxDQUFMLElBQVUsR0FBVixJQUFpQixDQUFDLEtBQUssQ0FBTCxDQUFELEdBQVcsU0FBNUIsQ0FBRixDQUFQO0FBQ0Q7QUFDRCxXQUFPLEtBQUssTUFBTCxDQUFQO0FBQ0QsR0FiRDtBQWNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixXQUFqQiIsImZpbGUiOiJfY3JlYXRlUm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKSxcbiAgICB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiBsaWtlIGBfLnJvdW5kYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWUgVGhlIG5hbWUgb2YgdGhlIGBNYXRoYCBtZXRob2QgdG8gdXNlIHdoZW4gcm91bmRpbmcuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyByb3VuZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlUm91bmQobWV0aG9kTmFtZSkge1xuICB2YXIgZnVuYyA9IE1hdGhbbWV0aG9kTmFtZV07XG4gIHJldHVybiBmdW5jdGlvbihudW1iZXIsIHByZWNpc2lvbikge1xuICAgIG51bWJlciA9IHRvTnVtYmVyKG51bWJlcik7XG4gICAgcHJlY2lzaW9uID0gbmF0aXZlTWluKHRvSW50ZWdlcihwcmVjaXNpb24pLCAyOTIpO1xuICAgIGlmIChwcmVjaXNpb24pIHtcbiAgICAgIC8vIFNoaWZ0IHdpdGggZXhwb25lbnRpYWwgbm90YXRpb24gdG8gYXZvaWQgZmxvYXRpbmctcG9pbnQgaXNzdWVzLlxuICAgICAgLy8gU2VlIFtNRE5dKGh0dHBzOi8vbWRuLmlvL3JvdW5kI0V4YW1wbGVzKSBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgdmFyIHBhaXIgPSAodG9TdHJpbmcobnVtYmVyKSArICdlJykuc3BsaXQoJ2UnKSxcbiAgICAgICAgICB2YWx1ZSA9IGZ1bmMocGFpclswXSArICdlJyArICgrcGFpclsxXSArIHByZWNpc2lvbikpO1xuXG4gICAgICBwYWlyID0gKHRvU3RyaW5nKHZhbHVlKSArICdlJykuc3BsaXQoJ2UnKTtcbiAgICAgIHJldHVybiArKHBhaXJbMF0gKyAnZScgKyAoK3BhaXJbMV0gLSBwcmVjaXNpb24pKTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmMobnVtYmVyKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVSb3VuZDtcbiJdfQ==