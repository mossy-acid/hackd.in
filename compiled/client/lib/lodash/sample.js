'use strict';

var baseRandom = require('./_baseRandom'),
    isArrayLike = require('./isArrayLike'),
    values = require('./values');

/**
 * Gets a random element from `collection`.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to sample.
 * @returns {*} Returns the random element.
 * @example
 *
 * _.sample([1, 2, 3, 4]);
 * // => 2
 */
function sample(collection) {
    var array = isArrayLike(collection) ? collection : values(collection),
        length = array.length;

    return length > 0 ? array[baseRandom(0, length - 1)] : undefined;
}

module.exports = sample;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NhbXBsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGVBQVIsQ0FBYjtJQUNBLGNBQWMsUUFBUSxlQUFSLENBQWQ7SUFDQSxTQUFTLFFBQVEsVUFBUixDQUFUOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JKLFNBQVMsTUFBVCxDQUFnQixVQUFoQixFQUE0QjtBQUMxQixRQUFJLFFBQVEsWUFBWSxVQUFaLElBQTBCLFVBQTFCLEdBQXVDLE9BQU8sVUFBUCxDQUF2QztRQUNSLFNBQVMsTUFBTSxNQUFOLENBRmE7O0FBSTFCLFdBQU8sU0FBUyxDQUFULEdBQWEsTUFBTSxXQUFXLENBQVgsRUFBYyxTQUFTLENBQVQsQ0FBcEIsQ0FBYixHQUFnRCxTQUFoRCxDQUptQjtDQUE1Qjs7QUFPQSxPQUFPLE9BQVAsR0FBaUIsTUFBakIiLCJmaWxlIjoic2FtcGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VSYW5kb20gPSByZXF1aXJlKCcuL19iYXNlUmFuZG9tJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgdmFsdWVzID0gcmVxdWlyZSgnLi92YWx1ZXMnKTtcblxuLyoqXG4gKiBHZXRzIGEgcmFuZG9tIGVsZW1lbnQgZnJvbSBgY29sbGVjdGlvbmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjAuMFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHNhbXBsZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByYW5kb20gZWxlbWVudC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5zYW1wbGUoWzEsIDIsIDMsIDRdKTtcbiAqIC8vID0+IDJcbiAqL1xuZnVuY3Rpb24gc2FtcGxlKGNvbGxlY3Rpb24pIHtcbiAgdmFyIGFycmF5ID0gaXNBcnJheUxpa2UoY29sbGVjdGlvbikgPyBjb2xsZWN0aW9uIDogdmFsdWVzKGNvbGxlY3Rpb24pLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHJldHVybiBsZW5ndGggPiAwID8gYXJyYXlbYmFzZVJhbmRvbSgwLCBsZW5ndGggLSAxKV0gOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2FtcGxlO1xuIl19