'use strict';

var baseIteratee = require('./_baseIteratee'),
    baseSortedIndexBy = require('./_baseSortedIndexBy');

/**
 * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
 * which is invoked for `value` and each element of `array` to compute their
 * sort ranking. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The iteratee invoked per element.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * var objects = [{ 'x': 4 }, { 'x': 5 }];
 *
 * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
 * // => 1
 *
 * // The `_.property` iteratee shorthand.
 * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
 * // => 1
 */
function sortedLastIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee), true);
}

module.exports = sortedLastIndexBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NvcnRlZExhc3RJbmRleEJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxlQUFlLFFBQVEsaUJBQVIsQ0FBZjtJQUNBLG9CQUFvQixRQUFRLHNCQUFSLENBQXBCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJKLFNBQVMsaUJBQVQsQ0FBMkIsS0FBM0IsRUFBa0MsS0FBbEMsRUFBeUMsUUFBekMsRUFBbUQ7QUFDakQsU0FBTyxrQkFBa0IsS0FBbEIsRUFBeUIsS0FBekIsRUFBZ0MsYUFBYSxRQUFiLENBQWhDLEVBQXdELElBQXhELENBQVAsQ0FEaUQ7Q0FBbkQ7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLGlCQUFqQiIsImZpbGUiOiJzb3J0ZWRMYXN0SW5kZXhCeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBiYXNlU29ydGVkSW5kZXhCeSA9IHJlcXVpcmUoJy4vX2Jhc2VTb3J0ZWRJbmRleEJ5Jyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5zb3J0ZWRMYXN0SW5kZXhgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYGl0ZXJhdGVlYFxuICogd2hpY2ggaXMgaW52b2tlZCBmb3IgYHZhbHVlYCBhbmQgZWFjaCBlbGVtZW50IG9mIGBhcnJheWAgdG8gY29tcHV0ZSB0aGVpclxuICogc29ydCByYW5raW5nLiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDogKHZhbHVlKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBzb3J0ZWQgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGV2YWx1YXRlLlxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV1cbiAqICBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IGF0IHdoaWNoIGB2YWx1ZWAgc2hvdWxkIGJlIGluc2VydGVkXG4gKiAgaW50byBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IFt7ICd4JzogNCB9LCB7ICd4JzogNSB9XTtcbiAqXG4gKiBfLnNvcnRlZExhc3RJbmRleEJ5KG9iamVjdHMsIHsgJ3gnOiA0IH0sIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG8ueDsgfSk7XG4gKiAvLyA9PiAxXG4gKlxuICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLnNvcnRlZExhc3RJbmRleEJ5KG9iamVjdHMsIHsgJ3gnOiA0IH0sICd4Jyk7XG4gKiAvLyA9PiAxXG4gKi9cbmZ1bmN0aW9uIHNvcnRlZExhc3RJbmRleEJ5KGFycmF5LCB2YWx1ZSwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIGJhc2VTb3J0ZWRJbmRleEJ5KGFycmF5LCB2YWx1ZSwgYmFzZUl0ZXJhdGVlKGl0ZXJhdGVlKSwgdHJ1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc29ydGVkTGFzdEluZGV4Qnk7XG4iXX0=