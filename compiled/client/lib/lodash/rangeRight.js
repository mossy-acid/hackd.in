'use strict';

var createRange = require('./_createRange');

/**
 * This method is like `_.range` except that it populates values in
 * descending order.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the range of numbers.
 * @see _.inRange, _.range
 * @example
 *
 * _.rangeRight(4);
 * // => [3, 2, 1, 0]
 *
 * _.rangeRight(-4);
 * // => [-3, -2, -1, 0]
 *
 * _.rangeRight(1, 5);
 * // => [4, 3, 2, 1]
 *
 * _.rangeRight(0, 20, 5);
 * // => [15, 10, 5, 0]
 *
 * _.rangeRight(0, -4, -1);
 * // => [-3, -2, -1, 0]
 *
 * _.rangeRight(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.rangeRight(0);
 * // => []
 */
var rangeRight = createRange(true);

module.exports = rangeRight;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3JhbmdlUmlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFsQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQ0EsSUFBSSxhQUFhLFlBQVksSUFBWixDQUFqQjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoicmFuZ2VSaWdodC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVSYW5nZSA9IHJlcXVpcmUoJy4vX2NyZWF0ZVJhbmdlJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5yYW5nZWAgZXhjZXB0IHRoYXQgaXQgcG9wdWxhdGVzIHZhbHVlcyBpblxuICogZGVzY2VuZGluZyBvcmRlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgb2YgdGhlIHJhbmdlLlxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgZW5kIG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RlcD0xXSBUaGUgdmFsdWUgdG8gaW5jcmVtZW50IG9yIGRlY3JlbWVudCBieS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgcmFuZ2Ugb2YgbnVtYmVycy5cbiAqIEBzZWUgXy5pblJhbmdlLCBfLnJhbmdlXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ucmFuZ2VSaWdodCg0KTtcbiAqIC8vID0+IFszLCAyLCAxLCAwXVxuICpcbiAqIF8ucmFuZ2VSaWdodCgtNCk7XG4gKiAvLyA9PiBbLTMsIC0yLCAtMSwgMF1cbiAqXG4gKiBfLnJhbmdlUmlnaHQoMSwgNSk7XG4gKiAvLyA9PiBbNCwgMywgMiwgMV1cbiAqXG4gKiBfLnJhbmdlUmlnaHQoMCwgMjAsIDUpO1xuICogLy8gPT4gWzE1LCAxMCwgNSwgMF1cbiAqXG4gKiBfLnJhbmdlUmlnaHQoMCwgLTQsIC0xKTtcbiAqIC8vID0+IFstMywgLTIsIC0xLCAwXVxuICpcbiAqIF8ucmFuZ2VSaWdodCgxLCA0LCAwKTtcbiAqIC8vID0+IFsxLCAxLCAxXVxuICpcbiAqIF8ucmFuZ2VSaWdodCgwKTtcbiAqIC8vID0+IFtdXG4gKi9cbnZhciByYW5nZVJpZ2h0ID0gY3JlYXRlUmFuZ2UodHJ1ZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmFuZ2VSaWdodDtcbiJdfQ==