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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RvUGFpcnNJbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBcEI7SUFDSSxTQUFTLFFBQVEsVUFBUixDQURiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxJQUFJLFlBQVksY0FBYyxNQUFkLENBQWhCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJ0b1BhaXJzSW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3JlYXRlVG9QYWlycyA9IHJlcXVpcmUoJy4vX2NyZWF0ZVRvUGFpcnMnKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQtdmFsdWUgcGFpcnNcbiAqIGZvciBgb2JqZWN0YCB3aGljaCBjYW4gYmUgY29uc3VtZWQgYnkgYF8uZnJvbVBhaXJzYC4gSWYgYG9iamVjdGAgaXMgYSBtYXBcbiAqIG9yIHNldCwgaXRzIGVudHJpZXMgYXJlIHJldHVybmVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBhbGlhcyBlbnRyaWVzSW5cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUga2V5LXZhbHVlIHBhaXJzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLnRvUGFpcnNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFtbJ2EnLCAxXSwgWydiJywgMl0sIFsnYycsIDNdXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG52YXIgdG9QYWlyc0luID0gY3JlYXRlVG9QYWlycyhrZXlzSW4pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvUGFpcnNJbjtcbiJdfQ==