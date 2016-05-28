'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _Symbol = require('./_Symbol'),
    copyArray = require('./_copyArray'),
    getTag = require('./_getTag'),
    isArrayLike = require('./isArrayLike'),
    isString = require('./isString'),
    iteratorToArray = require('./_iteratorToArray'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray'),
    stringToArray = require('./_stringToArray'),
    values = require('./values');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Built-in value references. */
var iteratorSymbol = _typeof(iteratorSymbol = _Symbol && _Symbol.iterator) == 'symbol' ? iteratorSymbol : undefined;

/**
 * Converts `value` to an array.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Array} Returns the converted array.
 * @example
 *
 * _.toArray({ 'a': 1, 'b': 2 });
 * // => [1, 2]
 *
 * _.toArray('abc');
 * // => ['a', 'b', 'c']
 *
 * _.toArray(1);
 * // => []
 *
 * _.toArray(null);
 * // => []
 */
function toArray(value) {
  if (!value) {
    return [];
  }
  if (isArrayLike(value)) {
    return isString(value) ? stringToArray(value) : copyArray(value);
  }
  if (iteratorSymbol && value[iteratorSymbol]) {
    return iteratorToArray(value[iteratorSymbol]());
  }
  var tag = getTag(value),
      func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;

  return func(value);
}

module.exports = toArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RvQXJyYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUksVUFBUyxRQUFRLFdBQVIsQ0FBVDtJQUNBLFlBQVksUUFBUSxjQUFSLENBQVo7SUFDQSxTQUFTLFFBQVEsV0FBUixDQUFUO0lBQ0EsY0FBYyxRQUFRLGVBQVIsQ0FBZDtJQUNBLFdBQVcsUUFBUSxZQUFSLENBQVg7SUFDQSxrQkFBa0IsUUFBUSxvQkFBUixDQUFsQjtJQUNBLGFBQWEsUUFBUSxlQUFSLENBQWI7SUFDQSxhQUFhLFFBQVEsZUFBUixDQUFiO0lBQ0EsZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBaEI7SUFDQSxTQUFTLFFBQVEsVUFBUixDQUFUOzs7QUFHSixJQUFJLFNBQVMsY0FBVDtJQUNBLFNBQVMsY0FBVDs7O0FBR0osSUFBSSxpQkFBaUIsUUFBUSxpQkFBaUIsV0FBVSxRQUFPLFFBQVAsQ0FBbkMsSUFBdUQsUUFBdkQsR0FBa0UsY0FBbEUsR0FBbUYsU0FBbkY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QnJCLFNBQVMsT0FBVCxDQUFpQixLQUFqQixFQUF3QjtBQUN0QixNQUFJLENBQUMsS0FBRCxFQUFRO0FBQ1YsV0FBTyxFQUFQLENBRFU7R0FBWjtBQUdBLE1BQUksWUFBWSxLQUFaLENBQUosRUFBd0I7QUFDdEIsV0FBTyxTQUFTLEtBQVQsSUFBa0IsY0FBYyxLQUFkLENBQWxCLEdBQXlDLFVBQVUsS0FBVixDQUF6QyxDQURlO0dBQXhCO0FBR0EsTUFBSSxrQkFBa0IsTUFBTSxjQUFOLENBQWxCLEVBQXlDO0FBQzNDLFdBQU8sZ0JBQWdCLE1BQU0sY0FBTixHQUFoQixDQUFQLENBRDJDO0dBQTdDO0FBR0EsTUFBSSxNQUFNLE9BQU8sS0FBUCxDQUFOO01BQ0EsT0FBTyxPQUFPLE1BQVAsR0FBZ0IsVUFBaEIsR0FBOEIsT0FBTyxNQUFQLEdBQWdCLFVBQWhCLEdBQTZCLE1BQTdCLENBWG5COztBQWF0QixTQUFPLEtBQUssS0FBTCxDQUFQLENBYnNCO0NBQXhCOztBQWdCQSxPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoidG9BcnJheS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKSxcbiAgICBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc1N0cmluZyA9IHJlcXVpcmUoJy4vaXNTdHJpbmcnKSxcbiAgICBpdGVyYXRvclRvQXJyYXkgPSByZXF1aXJlKCcuL19pdGVyYXRvclRvQXJyYXknKSxcbiAgICBtYXBUb0FycmF5ID0gcmVxdWlyZSgnLi9fbWFwVG9BcnJheScpLFxuICAgIHNldFRvQXJyYXkgPSByZXF1aXJlKCcuL19zZXRUb0FycmF5JyksXG4gICAgc3RyaW5nVG9BcnJheSA9IHJlcXVpcmUoJy4vX3N0cmluZ1RvQXJyYXknKSxcbiAgICB2YWx1ZXMgPSByZXF1aXJlKCcuL3ZhbHVlcycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIGl0ZXJhdG9yU3ltYm9sID0gdHlwZW9mIChpdGVyYXRvclN5bWJvbCA9IFN5bWJvbCAmJiBTeW1ib2wuaXRlcmF0b3IpID09ICdzeW1ib2wnID8gaXRlcmF0b3JTeW1ib2wgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY29udmVydGVkIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvQXJyYXkoeyAnYSc6IDEsICdiJzogMiB9KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIF8udG9BcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ11cbiAqXG4gKiBfLnRvQXJyYXkoMSk7XG4gKiAvLyA9PiBbXVxuICpcbiAqIF8udG9BcnJheShudWxsKTtcbiAqIC8vID0+IFtdXG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXkodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBpZiAoaXNBcnJheUxpa2UodmFsdWUpKSB7XG4gICAgcmV0dXJuIGlzU3RyaW5nKHZhbHVlKSA/IHN0cmluZ1RvQXJyYXkodmFsdWUpIDogY29weUFycmF5KHZhbHVlKTtcbiAgfVxuICBpZiAoaXRlcmF0b3JTeW1ib2wgJiYgdmFsdWVbaXRlcmF0b3JTeW1ib2xdKSB7XG4gICAgcmV0dXJuIGl0ZXJhdG9yVG9BcnJheSh2YWx1ZVtpdGVyYXRvclN5bWJvbF0oKSk7XG4gIH1cbiAgdmFyIHRhZyA9IGdldFRhZyh2YWx1ZSksXG4gICAgICBmdW5jID0gdGFnID09IG1hcFRhZyA/IG1hcFRvQXJyYXkgOiAodGFnID09IHNldFRhZyA/IHNldFRvQXJyYXkgOiB2YWx1ZXMpO1xuXG4gIHJldHVybiBmdW5jKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b0FycmF5O1xuIl19