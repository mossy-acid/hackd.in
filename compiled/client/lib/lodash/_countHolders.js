"use strict";

/**
 * Gets the number of `placeholder` occurrences in `array`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} placeholder The placeholder to search for.
 * @returns {number} Returns the placeholder count.
 */
function countHolders(array, placeholder) {
  var length = array.length,
      result = 0;

  while (length--) {
    if (array[length] === placeholder) {
      result++;
    }
  }
  return result;
}

module.exports = countHolders;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jb3VudEhvbGRlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVFBLFNBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QixXQUE3QixFQUEwQztBQUN4QyxNQUFJLFNBQVMsTUFBTSxNQUFuQjtNQUNJLFNBQVMsQ0FEYjs7QUFHQSxTQUFPLFFBQVAsRUFBaUI7QUFDZixRQUFJLE1BQU0sTUFBTixNQUFrQixXQUF0QixFQUFtQztBQUNqQztBQUNEO0FBQ0Y7QUFDRCxTQUFPLE1BQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsWUFBakIiLCJmaWxlIjoiX2NvdW50SG9sZGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogR2V0cyB0aGUgbnVtYmVyIG9mIGBwbGFjZWhvbGRlcmAgb2NjdXJyZW5jZXMgaW4gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHBsYWNlaG9sZGVyIFRoZSBwbGFjZWhvbGRlciB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgcGxhY2Vob2xkZXIgY291bnQuXG4gKi9cbmZ1bmN0aW9uIGNvdW50SG9sZGVycyhhcnJheSwgcGxhY2Vob2xkZXIpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IDA7XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGFycmF5W2xlbmd0aF0gPT09IHBsYWNlaG9sZGVyKSB7XG4gICAgICByZXN1bHQrKztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3VudEhvbGRlcnM7XG4iXX0=