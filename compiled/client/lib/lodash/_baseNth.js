'use strict';

var isIndex = require('./_isIndex');

/**
 * The base implementation of `_.nth` which doesn't coerce `n` to an integer.
 *
 * @private
 * @param {Array} array The array to query.
 * @param {number} n The index of the element to return.
 * @returns {*} Returns the nth element of `array`.
 */
function baseNth(array, n) {
  var length = array.length;
  if (!length) {
    return;
  }
  n += n < 0 ? length : 0;
  return isIndex(n, length) ? array[n] : undefined;
}

module.exports = baseNth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlTnRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxVQUFVLFFBQVEsWUFBUixDQUFkOzs7Ozs7Ozs7O0FBVUEsU0FBUyxPQUFULENBQWlCLEtBQWpCLEVBQXdCLENBQXhCLEVBQTJCO0FBQ3pCLE1BQUksU0FBUyxNQUFNLE1BQW5CO0FBQ0EsTUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNYO0FBQ0Q7QUFDRCxPQUFLLElBQUksQ0FBSixHQUFRLE1BQVIsR0FBaUIsQ0FBdEI7QUFDQSxTQUFPLFFBQVEsQ0FBUixFQUFXLE1BQVgsSUFBcUIsTUFBTSxDQUFOLENBQXJCLEdBQWdDLFNBQXZDO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6Il9iYXNlTnRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubnRoYCB3aGljaCBkb2Vzbid0IGNvZXJjZSBgbmAgdG8gYW4gaW50ZWdlci5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIGluZGV4IG9mIHRoZSBlbGVtZW50IHRvIHJldHVybi5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBudGggZWxlbWVudCBvZiBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBiYXNlTnRoKGFycmF5LCBuKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG4gKz0gbiA8IDAgPyBsZW5ndGggOiAwO1xuICByZXR1cm4gaXNJbmRleChuLCBsZW5ndGgpID8gYXJyYXlbbl0gOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU50aDtcbiJdfQ==