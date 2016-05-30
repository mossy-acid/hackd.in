'use strict';

var baseIteratee = require('./_baseIteratee'),
    baseMean = require('./_baseMean');

/**
 * This method is like `_.mean` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the value to be averaged.
 * The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The iteratee invoked per element.
 * @returns {number} Returns the mean.
 * @example
 *
 * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
 *
 * _.meanBy(objects, function(o) { return o.n; });
 * // => 5
 *
 * // The `_.property` iteratee shorthand.
 * _.meanBy(objects, 'n');
 * // => 5
 */
function meanBy(array, iteratee) {
  return baseMean(array, baseIteratee(iteratee));
}

module.exports = meanBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL21lYW5CeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxXQUFXLFFBQVEsYUFBUixDQUFYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCSixTQUFTLE1BQVQsQ0FBZ0IsS0FBaEIsRUFBdUIsUUFBdkIsRUFBaUM7QUFDL0IsU0FBTyxTQUFTLEtBQVQsRUFBZ0IsYUFBYSxRQUFiLENBQWhCLENBQVAsQ0FEK0I7Q0FBakM7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6Im1lYW5CeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBiYXNlTWVhbiA9IHJlcXVpcmUoJy4vX2Jhc2VNZWFuJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5tZWFuYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGBpdGVyYXRlZWAgd2hpY2ggaXNcbiAqIGludm9rZWQgZm9yIGVhY2ggZWxlbWVudCBpbiBgYXJyYXlgIHRvIGdlbmVyYXRlIHRoZSB2YWx1ZSB0byBiZSBhdmVyYWdlZC5cbiAqIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OiAodmFsdWUpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC43LjBcbiAqIEBjYXRlZ29yeSBNYXRoXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV1cbiAqICBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG1lYW4uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW3sgJ24nOiA0IH0sIHsgJ24nOiAyIH0sIHsgJ24nOiA4IH0sIHsgJ24nOiA2IH1dO1xuICpcbiAqIF8ubWVhbkJ5KG9iamVjdHMsIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG8ubjsgfSk7XG4gKiAvLyA9PiA1XG4gKlxuICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLm1lYW5CeShvYmplY3RzLCAnbicpO1xuICogLy8gPT4gNVxuICovXG5mdW5jdGlvbiBtZWFuQnkoYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBiYXNlTWVhbihhcnJheSwgYmFzZUl0ZXJhdGVlKGl0ZXJhdGVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVhbkJ5O1xuIl19