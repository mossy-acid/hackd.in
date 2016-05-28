'use strict';

var baseFlatten = require('./_baseFlatten'),
    map = require('./map'),
    toInteger = require('./toInteger');

/**
 * This method is like `_.flatMap` except that it recursively flattens the
 * mapped results up to `depth` times.
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The function invoked per iteration.
 * @param {number} [depth=1] The maximum recursion depth.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * function duplicate(n) {
 *   return [[[n, n]]];
 * }
 *
 * _.flatMapDepth([1, 2], duplicate, 2);
 * // => [[1, 1], [2, 2]]
 */
function flatMapDepth(collection, iteratee, depth) {
  depth = depth === undefined ? 1 : toInteger(depth);
  return baseFlatten(map(collection, iteratee), depth);
}

module.exports = flatMapDepth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZsYXRNYXBEZXB0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxRQUFRLGdCQUFSLENBQWQ7SUFDQSxNQUFNLFFBQVEsT0FBUixDQUFOO0lBQ0EsWUFBWSxRQUFRLGFBQVIsQ0FBWjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JKLFNBQVMsWUFBVCxDQUFzQixVQUF0QixFQUFrQyxRQUFsQyxFQUE0QyxLQUE1QyxFQUFtRDtBQUNqRCxVQUFRLFVBQVUsU0FBVixHQUFzQixDQUF0QixHQUEwQixVQUFVLEtBQVYsQ0FBMUIsQ0FEeUM7QUFFakQsU0FBTyxZQUFZLElBQUksVUFBSixFQUFnQixRQUFoQixDQUFaLEVBQXVDLEtBQXZDLENBQVAsQ0FGaUQ7Q0FBbkQ7O0FBS0EsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6ImZsYXRNYXBEZXB0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgbWFwID0gcmVxdWlyZSgnLi9tYXAnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZmxhdE1hcGAgZXhjZXB0IHRoYXQgaXQgcmVjdXJzaXZlbHkgZmxhdHRlbnMgdGhlXG4gKiBtYXBwZWQgcmVzdWx0cyB1cCB0byBgZGVwdGhgIHRpbWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC43LjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtpdGVyYXRlZT1fLmlkZW50aXR5XVxuICogIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2RlcHRoPTFdIFRoZSBtYXhpbXVtIHJlY3Vyc2lvbiBkZXB0aC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gZHVwbGljYXRlKG4pIHtcbiAqICAgcmV0dXJuIFtbW24sIG5dXV07XG4gKiB9XG4gKlxuICogXy5mbGF0TWFwRGVwdGgoWzEsIDJdLCBkdXBsaWNhdGUsIDIpO1xuICogLy8gPT4gW1sxLCAxXSwgWzIsIDJdXVxuICovXG5mdW5jdGlvbiBmbGF0TWFwRGVwdGgoY29sbGVjdGlvbiwgaXRlcmF0ZWUsIGRlcHRoKSB7XG4gIGRlcHRoID0gZGVwdGggPT09IHVuZGVmaW5lZCA/IDEgOiB0b0ludGVnZXIoZGVwdGgpO1xuICByZXR1cm4gYmFzZUZsYXR0ZW4obWFwKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSwgZGVwdGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXRNYXBEZXB0aDtcbiJdfQ==