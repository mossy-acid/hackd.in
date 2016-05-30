'use strict';

var arrayPush = require('./_arrayPush'),
    baseFlatten = require('./_baseFlatten'),
    copyArray = require('./_copyArray'),
    isArray = require('./isArray');

/**
 * Creates a new array concatenating `array` with any additional arrays
 * and/or values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to concatenate.
 * @param {...*} [values] The values to concatenate.
 * @returns {Array} Returns the new concatenated array.
 * @example
 *
 * var array = [1];
 * var other = _.concat(array, 2, [3], [[4]]);
 *
 * console.log(other);
 * // => [1, 2, 3, [4]]
 *
 * console.log(array);
 * // => [1]
 */
function concat() {
    var length = arguments.length,
        args = Array(length ? length - 1 : 0),
        array = arguments[0],
        index = length;

    while (index--) {
        args[index - 1] = arguments[index];
    }
    return length ? arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1)) : [];
}

module.exports = concat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NvbmNhdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxRQUFRLGNBQVIsQ0FBaEI7SUFDSSxjQUFjLFFBQVEsZ0JBQVIsQ0FEbEI7SUFFSSxZQUFZLFFBQVEsY0FBUixDQUZoQjtJQUdJLFVBQVUsUUFBUSxXQUFSLENBSGQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxTQUFTLE1BQVQsR0FBa0I7QUFDaEIsUUFBSSxTQUFTLFVBQVUsTUFBdkI7UUFDSSxPQUFPLE1BQU0sU0FBUyxTQUFTLENBQWxCLEdBQXNCLENBQTVCLENBRFg7UUFFSSxRQUFRLFVBQVUsQ0FBVixDQUZaO1FBR0ksUUFBUSxNQUhaOztBQUtBLFdBQU8sT0FBUCxFQUFnQjtBQUNkLGFBQUssUUFBUSxDQUFiLElBQWtCLFVBQVUsS0FBVixDQUFsQjtBQUNEO0FBQ0QsV0FBTyxTQUNILFVBQVUsUUFBUSxLQUFSLElBQWlCLFVBQVUsS0FBVixDQUFqQixHQUFvQyxDQUFDLEtBQUQsQ0FBOUMsRUFBdUQsWUFBWSxJQUFaLEVBQWtCLENBQWxCLENBQXZELENBREcsR0FFSCxFQUZKO0FBR0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6ImNvbmNhdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYXJyYXkgY29uY2F0ZW5hdGluZyBgYXJyYXlgIHdpdGggYW55IGFkZGl0aW9uYWwgYXJyYXlzXG4gKiBhbmQvb3IgdmFsdWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNvbmNhdGVuYXRlLlxuICogQHBhcmFtIHsuLi4qfSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNvbmNhdGVuYXRlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgY29uY2F0ZW5hdGVkIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXkgPSBbMV07XG4gKiB2YXIgb3RoZXIgPSBfLmNvbmNhdChhcnJheSwgMiwgWzNdLCBbWzRdXSk7XG4gKlxuICogY29uc29sZS5sb2cob3RoZXIpO1xuICogLy8gPT4gWzEsIDIsIDMsIFs0XV1cbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheSk7XG4gKiAvLyA9PiBbMV1cbiAqL1xuZnVuY3Rpb24gY29uY2F0KCkge1xuICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgIGFyZ3MgPSBBcnJheShsZW5ndGggPyBsZW5ndGggLSAxIDogMCksXG4gICAgICBhcnJheSA9IGFyZ3VtZW50c1swXSxcbiAgICAgIGluZGV4ID0gbGVuZ3RoO1xuXG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgYXJnc1tpbmRleCAtIDFdID0gYXJndW1lbnRzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gbGVuZ3RoXG4gICAgPyBhcnJheVB1c2goaXNBcnJheShhcnJheSkgPyBjb3B5QXJyYXkoYXJyYXkpIDogW2FycmF5XSwgYmFzZUZsYXR0ZW4oYXJncywgMSkpXG4gICAgOiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25jYXQ7XG4iXX0=