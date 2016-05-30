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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NvbmNhdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxRQUFRLGNBQVIsQ0FBWjtJQUNBLGNBQWMsUUFBUSxnQkFBUixDQUFkO0lBQ0EsWUFBWSxRQUFRLGNBQVIsQ0FBWjtJQUNBLFVBQVUsUUFBUSxXQUFSLENBQVY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCSixTQUFTLE1BQVQsR0FBa0I7QUFDaEIsUUFBSSxTQUFTLFVBQVUsTUFBVjtRQUNULE9BQU8sTUFBTSxTQUFTLFNBQVMsQ0FBVCxHQUFhLENBQXRCLENBQWI7UUFDQSxRQUFRLFVBQVUsQ0FBVixDQUFSO1FBQ0EsUUFBUSxNQUFSLENBSlk7O0FBTWhCLFdBQU8sT0FBUCxFQUFnQjtBQUNkLGFBQUssUUFBUSxDQUFSLENBQUwsR0FBa0IsVUFBVSxLQUFWLENBQWxCLENBRGM7S0FBaEI7QUFHQSxXQUFPLFNBQ0gsVUFBVSxRQUFRLEtBQVIsSUFBaUIsVUFBVSxLQUFWLENBQWpCLEdBQW9DLENBQUMsS0FBRCxDQUFwQyxFQUE2QyxZQUFZLElBQVosRUFBa0IsQ0FBbEIsQ0FBdkQsQ0FERyxHQUVILEVBRkcsQ0FUUztDQUFsQjs7QUFjQSxPQUFPLE9BQVAsR0FBaUIsTUFBakIiLCJmaWxlIjoiY29uY2F0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGJhc2VGbGF0dGVuID0gcmVxdWlyZSgnLi9fYmFzZUZsYXR0ZW4nKSxcbiAgICBjb3B5QXJyYXkgPSByZXF1aXJlKCcuL19jb3B5QXJyYXknKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBhcnJheSBjb25jYXRlbmF0aW5nIGBhcnJheWAgd2l0aCBhbnkgYWRkaXRpb25hbCBhcnJheXNcbiAqIGFuZC9vciB2YWx1ZXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29uY2F0ZW5hdGUuXG4gKiBAcGFyYW0gey4uLip9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gY29uY2F0ZW5hdGUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBjb25jYXRlbmF0ZWQgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheSA9IFsxXTtcbiAqIHZhciBvdGhlciA9IF8uY29uY2F0KGFycmF5LCAyLCBbM10sIFtbNF1dKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhvdGhlcik7XG4gKiAvLyA9PiBbMSwgMiwgMywgWzRdXVxuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAqIC8vID0+IFsxXVxuICovXG5mdW5jdGlvbiBjb25jYXQoKSB7XG4gIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgYXJncyA9IEFycmF5KGxlbmd0aCA/IGxlbmd0aCAtIDEgOiAwKSxcbiAgICAgIGFycmF5ID0gYXJndW1lbnRzWzBdLFxuICAgICAgaW5kZXggPSBsZW5ndGg7XG5cbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICBhcmdzW2luZGV4IC0gMV0gPSBhcmd1bWVudHNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBsZW5ndGhcbiAgICA/IGFycmF5UHVzaChpc0FycmF5KGFycmF5KSA/IGNvcHlBcnJheShhcnJheSkgOiBbYXJyYXldLCBiYXNlRmxhdHRlbihhcmdzLCAxKSlcbiAgICA6IFtdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmNhdDtcbiJdfQ==