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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RvQXJyYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUksVUFBUyxRQUFRLFdBQVIsQ0FBYjtJQUNJLFlBQVksUUFBUSxjQUFSLENBRGhCO0lBRUksU0FBUyxRQUFRLFdBQVIsQ0FGYjtJQUdJLGNBQWMsUUFBUSxlQUFSLENBSGxCO0lBSUksV0FBVyxRQUFRLFlBQVIsQ0FKZjtJQUtJLGtCQUFrQixRQUFRLG9CQUFSLENBTHRCO0lBTUksYUFBYSxRQUFRLGVBQVIsQ0FOakI7SUFPSSxhQUFhLFFBQVEsZUFBUixDQVBqQjtJQVFJLGdCQUFnQixRQUFRLGtCQUFSLENBUnBCO0lBU0ksU0FBUyxRQUFRLFVBQVIsQ0FUYjs7O0FBWUEsSUFBSSxTQUFTLGNBQWI7SUFDSSxTQUFTLGNBRGI7OztBQUlBLElBQUksaUJBQWlCLFFBQVEsaUJBQWlCLFdBQVUsUUFBTyxRQUExQyxLQUF1RCxRQUF2RCxHQUFrRSxjQUFsRSxHQUFtRixTQUF4Rzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxTQUFTLE9BQVQsQ0FBaUIsS0FBakIsRUFBd0I7QUFDdEIsTUFBSSxDQUFDLEtBQUwsRUFBWTtBQUNWLFdBQU8sRUFBUDtBQUNEO0FBQ0QsTUFBSSxZQUFZLEtBQVosQ0FBSixFQUF3QjtBQUN0QixXQUFPLFNBQVMsS0FBVCxJQUFrQixjQUFjLEtBQWQsQ0FBbEIsR0FBeUMsVUFBVSxLQUFWLENBQWhEO0FBQ0Q7QUFDRCxNQUFJLGtCQUFrQixNQUFNLGNBQU4sQ0FBdEIsRUFBNkM7QUFDM0MsV0FBTyxnQkFBZ0IsTUFBTSxjQUFOLEdBQWhCLENBQVA7QUFDRDtBQUNELE1BQUksTUFBTSxPQUFPLEtBQVAsQ0FBVjtNQUNJLE9BQU8sT0FBTyxNQUFQLEdBQWdCLFVBQWhCLEdBQThCLE9BQU8sTUFBUCxHQUFnQixVQUFoQixHQUE2QixNQUR0RTs7QUFHQSxTQUFPLEtBQUssS0FBTCxDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6InRvQXJyYXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5JyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNTdHJpbmcgPSByZXF1aXJlKCcuL2lzU3RyaW5nJyksXG4gICAgaXRlcmF0b3JUb0FycmF5ID0gcmVxdWlyZSgnLi9faXRlcmF0b3JUb0FycmF5JyksXG4gICAgbWFwVG9BcnJheSA9IHJlcXVpcmUoJy4vX21hcFRvQXJyYXknKSxcbiAgICBzZXRUb0FycmF5ID0gcmVxdWlyZSgnLi9fc2V0VG9BcnJheScpLFxuICAgIHN0cmluZ1RvQXJyYXkgPSByZXF1aXJlKCcuL19zdHJpbmdUb0FycmF5JyksXG4gICAgdmFsdWVzID0gcmVxdWlyZSgnLi92YWx1ZXMnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBpdGVyYXRvclN5bWJvbCA9IHR5cGVvZiAoaXRlcmF0b3JTeW1ib2wgPSBTeW1ib2wgJiYgU3ltYm9sLml0ZXJhdG9yKSA9PSAnc3ltYm9sJyA/IGl0ZXJhdG9yU3ltYm9sIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b0FycmF5KHsgJ2EnOiAxLCAnYic6IDIgfSk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiBfLnRvQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gWydhJywgJ2InLCAnYyddXG4gKlxuICogXy50b0FycmF5KDEpO1xuICogLy8gPT4gW11cbiAqXG4gKiBfLnRvQXJyYXkobnVsbCk7XG4gKiAvLyA9PiBbXVxuICovXG5mdW5jdGlvbiB0b0FycmF5KHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgaWYgKGlzQXJyYXlMaWtlKHZhbHVlKSkge1xuICAgIHJldHVybiBpc1N0cmluZyh2YWx1ZSkgPyBzdHJpbmdUb0FycmF5KHZhbHVlKSA6IGNvcHlBcnJheSh2YWx1ZSk7XG4gIH1cbiAgaWYgKGl0ZXJhdG9yU3ltYm9sICYmIHZhbHVlW2l0ZXJhdG9yU3ltYm9sXSkge1xuICAgIHJldHVybiBpdGVyYXRvclRvQXJyYXkodmFsdWVbaXRlcmF0b3JTeW1ib2xdKCkpO1xuICB9XG4gIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpLFxuICAgICAgZnVuYyA9IHRhZyA9PSBtYXBUYWcgPyBtYXBUb0FycmF5IDogKHRhZyA9PSBzZXRUYWcgPyBzZXRUb0FycmF5IDogdmFsdWVzKTtcblxuICByZXR1cm4gZnVuYyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9BcnJheTtcbiJdfQ==