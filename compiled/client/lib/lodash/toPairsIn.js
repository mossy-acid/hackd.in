'use strict';

var createToPairs = require('./_createToPairs'),
    keysIn = require('./keysIn');

/**
 * Creates an array of own and inherited enumerable string keyed-value pairs
 * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
 * or set, its entries are returned.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias entriesIn
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the key-value pairs.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.toPairsIn(new Foo);
 * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
 */
var toPairsIn = createToPairs(keysIn);

module.exports = toPairsIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RvUGFpcnNJbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBaEI7SUFDQSxTQUFTLFFBQVEsVUFBUixDQUFUOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCSixJQUFJLFlBQVksY0FBYyxNQUFkLENBQVo7O0FBRUosT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6InRvUGFpcnNJbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVUb1BhaXJzID0gcmVxdWlyZSgnLi9fY3JlYXRlVG9QYWlycycpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN0cmluZyBrZXllZC12YWx1ZSBwYWlyc1xuICogZm9yIGBvYmplY3RgIHdoaWNoIGNhbiBiZSBjb25zdW1lZCBieSBgXy5mcm9tUGFpcnNgLiBJZiBgb2JqZWN0YCBpcyBhIG1hcFxuICogb3Igc2V0LCBpdHMgZW50cmllcyBhcmUgcmV0dXJuZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGFsaWFzIGVudHJpZXNJblxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBrZXktdmFsdWUgcGFpcnMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8udG9QYWlyc0luKG5ldyBGb28pO1xuICogLy8gPT4gW1snYScsIDFdLCBbJ2InLCAyXSwgWydjJywgM11dIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbnZhciB0b1BhaXJzSW4gPSBjcmVhdGVUb1BhaXJzKGtleXNJbik7XG5cbm1vZHVsZS5leHBvcnRzID0gdG9QYWlyc0luO1xuIl19