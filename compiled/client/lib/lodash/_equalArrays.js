'use strict';

var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = bitmask & UNORDERED_COMPARE_FLAG ? new SetCache() : undefined;

  stack.set(array, other);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function (othValue, othIndex) {
        if (!seen.has(othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
          return seen.add(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  return result;
}

module.exports = equalArrays;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19lcXVhbEFycmF5cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxRQUFRLGFBQVIsQ0FBZjtJQUNJLFlBQVksUUFBUSxjQUFSLENBRGhCOzs7QUFJQSxJQUFJLHlCQUF5QixDQUE3QjtJQUNJLHVCQUF1QixDQUQzQjs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxTQUFTLFdBQVQsQ0FBcUIsS0FBckIsRUFBNEIsS0FBNUIsRUFBbUMsU0FBbkMsRUFBOEMsVUFBOUMsRUFBMEQsT0FBMUQsRUFBbUUsS0FBbkUsRUFBMEU7QUFDeEUsTUFBSSxZQUFZLFVBQVUsb0JBQTFCO01BQ0ksWUFBWSxNQUFNLE1BRHRCO01BRUksWUFBWSxNQUFNLE1BRnRCOztBQUlBLE1BQUksYUFBYSxTQUFiLElBQTBCLEVBQUUsYUFBYSxZQUFZLFNBQTNCLENBQTlCLEVBQXFFO0FBQ25FLFdBQU8sS0FBUDtBQUNEOztBQUVELE1BQUksVUFBVSxNQUFNLEdBQU4sQ0FBVSxLQUFWLENBQWQ7QUFDQSxNQUFJLE9BQUosRUFBYTtBQUNYLFdBQU8sV0FBVyxLQUFsQjtBQUNEO0FBQ0QsTUFBSSxRQUFRLENBQUMsQ0FBYjtNQUNJLFNBQVMsSUFEYjtNQUVJLE9BQVEsVUFBVSxzQkFBWCxHQUFxQyxJQUFJLFFBQUosRUFBckMsR0FBb0QsU0FGL0Q7O0FBSUEsUUFBTSxHQUFOLENBQVUsS0FBVixFQUFpQixLQUFqQjs7O0FBR0EsU0FBTyxFQUFFLEtBQUYsR0FBVSxTQUFqQixFQUE0QjtBQUMxQixRQUFJLFdBQVcsTUFBTSxLQUFOLENBQWY7UUFDSSxXQUFXLE1BQU0sS0FBTixDQURmOztBQUdBLFFBQUksVUFBSixFQUFnQjtBQUNkLFVBQUksV0FBVyxZQUNYLFdBQVcsUUFBWCxFQUFxQixRQUFyQixFQUErQixLQUEvQixFQUFzQyxLQUF0QyxFQUE2QyxLQUE3QyxFQUFvRCxLQUFwRCxDQURXLEdBRVgsV0FBVyxRQUFYLEVBQXFCLFFBQXJCLEVBQStCLEtBQS9CLEVBQXNDLEtBQXRDLEVBQTZDLEtBQTdDLEVBQW9ELEtBQXBELENBRko7QUFHRDtBQUNELFFBQUksYUFBYSxTQUFqQixFQUE0QjtBQUMxQixVQUFJLFFBQUosRUFBYztBQUNaO0FBQ0Q7QUFDRCxlQUFTLEtBQVQ7QUFDQTtBQUNEOztBQUVELFFBQUksSUFBSixFQUFVO0FBQ1IsVUFBSSxDQUFDLFVBQVUsS0FBVixFQUFpQixVQUFTLFFBQVQsRUFBbUIsUUFBbkIsRUFBNkI7QUFDN0MsWUFBSSxDQUFDLEtBQUssR0FBTCxDQUFTLFFBQVQsQ0FBRCxLQUNDLGFBQWEsUUFBYixJQUF5QixVQUFVLFFBQVYsRUFBb0IsUUFBcEIsRUFBOEIsVUFBOUIsRUFBMEMsT0FBMUMsRUFBbUQsS0FBbkQsQ0FEMUIsQ0FBSixFQUMwRjtBQUN4RixpQkFBTyxLQUFLLEdBQUwsQ0FBUyxRQUFULENBQVA7QUFDRDtBQUNGLE9BTEEsQ0FBTCxFQUtRO0FBQ04saUJBQVMsS0FBVDtBQUNBO0FBQ0Q7QUFDRixLQVZELE1BVU8sSUFBSSxFQUNMLGFBQWEsUUFBYixJQUNFLFVBQVUsUUFBVixFQUFvQixRQUFwQixFQUE4QixVQUE5QixFQUEwQyxPQUExQyxFQUFtRCxLQUFuRCxDQUZHLENBQUosRUFHQTtBQUNMLGVBQVMsS0FBVDtBQUNBO0FBQ0Q7QUFDRjtBQUNELFFBQU0sUUFBTixFQUFnQixLQUFoQjtBQUNBLFNBQU8sTUFBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixXQUFqQiIsImZpbGUiOiJfZXF1YWxBcnJheXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU2V0Q2FjaGUgPSByZXF1aXJlKCcuL19TZXRDYWNoZScpLFxuICAgIGFycmF5U29tZSA9IHJlcXVpcmUoJy4vX2FycmF5U29tZScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjb21wYXJpc29uIHN0eWxlcy4gKi9cbnZhciBVTk9SREVSRURfQ09NUEFSRV9GTEFHID0gMSxcbiAgICBQQVJUSUFMX0NPTVBBUkVfRkxBRyA9IDI7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBhcnJheXMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7QXJyYXl9IG90aGVyIFRoZSBvdGhlciBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2YgY29tcGFyaXNvbiBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGBcbiAqICBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYGFycmF5YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcnJheXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxBcnJheXMoYXJyYXksIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgUEFSVElBTF9DT01QQVJFX0ZMQUcsXG4gICAgICBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBvdGhlci5sZW5ndGg7XG5cbiAgaWYgKGFyckxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIShpc1BhcnRpYWwgJiYgb3RoTGVuZ3RoID4gYXJyTGVuZ3RoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KGFycmF5KTtcbiAgaWYgKHN0YWNrZWQpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IHRydWUsXG4gICAgICBzZWVuID0gKGJpdG1hc2sgJiBVTk9SREVSRURfQ09NUEFSRV9GTEFHKSA/IG5ldyBTZXRDYWNoZSA6IHVuZGVmaW5lZDtcblxuICBzdGFjay5zZXQoYXJyYXksIG90aGVyKTtcblxuICAvLyBJZ25vcmUgbm9uLWluZGV4IHByb3BlcnRpZXMuXG4gIHdoaWxlICgrK2luZGV4IDwgYXJyTGVuZ3RoKSB7XG4gICAgdmFyIGFyclZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2luZGV4XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBhcnJWYWx1ZSwgaW5kZXgsIG90aGVyLCBhcnJheSwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihhcnJWYWx1ZSwgb3RoVmFsdWUsIGluZGV4LCBhcnJheSwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgaWYgKGNvbXBhcmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChjb21wYXJlZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKHNlZW4pIHtcbiAgICAgIGlmICghYXJyYXlTb21lKG90aGVyLCBmdW5jdGlvbihvdGhWYWx1ZSwgb3RoSW5kZXgpIHtcbiAgICAgICAgICAgIGlmICghc2Vlbi5oYXMob3RoSW5kZXgpICYmXG4gICAgICAgICAgICAgICAgKGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWVuLmFkZChvdGhJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIShcbiAgICAgICAgICBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHxcbiAgICAgICAgICAgIGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKVxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10oYXJyYXkpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxdWFsQXJyYXlzO1xuIl19