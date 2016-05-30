'use strict';

var basePullAll = require('./_basePullAll');

/**
 * This method is like `_.pull` except that it accepts an array of values to remove.
 *
 * **Note:** Unlike `_.difference`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 *
 * _.pullAll(array, ['a', 'c']);
 * console.log(array);
 * // => ['b', 'b']
 */
function pullAll(array, values) {
  return array && array.length && values && values.length ? basePullAll(array, values) : array;
}

module.exports = pullAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3B1bGxBbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFsQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQSxTQUFTLE9BQVQsQ0FBaUIsS0FBakIsRUFBd0IsTUFBeEIsRUFBZ0M7QUFDOUIsU0FBUSxTQUFTLE1BQU0sTUFBZixJQUF5QixNQUF6QixJQUFtQyxPQUFPLE1BQTNDLEdBQ0gsWUFBWSxLQUFaLEVBQW1CLE1BQW5CLENBREcsR0FFSCxLQUZKO0FBR0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6InB1bGxBbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVB1bGxBbGwgPSByZXF1aXJlKCcuL19iYXNlUHVsbEFsbCcpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ucHVsbGAgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhbiBhcnJheSBvZiB2YWx1ZXMgdG8gcmVtb3ZlLlxuICpcbiAqICoqTm90ZToqKiBVbmxpa2UgYF8uZGlmZmVyZW5jZWAsIHRoaXMgbWV0aG9kIG11dGF0ZXMgYGFycmF5YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5ID0gWydhJywgJ2InLCAnYycsICdhJywgJ2InLCAnYyddO1xuICpcbiAqIF8ucHVsbEFsbChhcnJheSwgWydhJywgJ2MnXSk7XG4gKiBjb25zb2xlLmxvZyhhcnJheSk7XG4gKiAvLyA9PiBbJ2InLCAnYiddXG4gKi9cbmZ1bmN0aW9uIHB1bGxBbGwoYXJyYXksIHZhbHVlcykge1xuICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aCAmJiB2YWx1ZXMgJiYgdmFsdWVzLmxlbmd0aClcbiAgICA/IGJhc2VQdWxsQWxsKGFycmF5LCB2YWx1ZXMpXG4gICAgOiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwdWxsQWxsO1xuIl19