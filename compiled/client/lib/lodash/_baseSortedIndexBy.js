'use strict';

var isSymbol = require('./isSymbol');

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295,
    MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeFloor = Math.floor,
    nativeMin = Math.min;

/**
 * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
 * which invokes `iteratee` for `value` and each element of `array` to compute
 * their sort ranking. The iteratee is invoked with one argument; (value).
 *
 * @private
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Function} iteratee The iteratee invoked per element.
 * @param {boolean} [retHighest] Specify returning the highest qualified index.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 */
function baseSortedIndexBy(array, value, iteratee, retHighest) {
  value = iteratee(value);

  var low = 0,
      high = array ? array.length : 0,
      valIsNaN = value !== value,
      valIsNull = value === null,
      valIsSymbol = isSymbol(value),
      valIsUndefined = value === undefined;

  while (low < high) {
    var mid = nativeFloor((low + high) / 2),
        computed = iteratee(array[mid]),
        othIsDefined = computed !== undefined,
        othIsNull = computed === null,
        othIsReflexive = computed === computed,
        othIsSymbol = isSymbol(computed);

    if (valIsNaN) {
      var setLow = retHighest || othIsReflexive;
    } else if (valIsUndefined) {
      setLow = othIsReflexive && (retHighest || othIsDefined);
    } else if (valIsNull) {
      setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
    } else if (valIsSymbol) {
      setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
    } else if (othIsNull || othIsSymbol) {
      setLow = false;
    } else {
      setLow = retHighest ? computed <= value : computed < value;
    }
    if (setLow) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return nativeMin(high, MAX_ARRAY_INDEX);
}

module.exports = baseSortedIndexBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlU29ydGVkSW5kZXhCeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxRQUFRLFlBQVIsQ0FBWDs7O0FBR0osSUFBSSxtQkFBbUIsVUFBbkI7SUFDQSxrQkFBa0IsbUJBQW1CLENBQW5COzs7QUFHdEIsSUFBSSxjQUFjLEtBQUssS0FBTDtJQUNkLFlBQVksS0FBSyxHQUFMOzs7Ozs7Ozs7Ozs7Ozs7QUFlaEIsU0FBUyxpQkFBVCxDQUEyQixLQUEzQixFQUFrQyxLQUFsQyxFQUF5QyxRQUF6QyxFQUFtRCxVQUFuRCxFQUErRDtBQUM3RCxVQUFRLFNBQVMsS0FBVCxDQUFSLENBRDZEOztBQUc3RCxNQUFJLE1BQU0sQ0FBTjtNQUNBLE9BQU8sUUFBUSxNQUFNLE1BQU4sR0FBZSxDQUF2QjtNQUNQLFdBQVcsVUFBVSxLQUFWO01BQ1gsWUFBWSxVQUFVLElBQVY7TUFDWixjQUFjLFNBQVMsS0FBVCxDQUFkO01BQ0EsaUJBQWlCLFVBQVUsU0FBVixDQVJ3Qzs7QUFVN0QsU0FBTyxNQUFNLElBQU4sRUFBWTtBQUNqQixRQUFJLE1BQU0sWUFBWSxDQUFDLE1BQU0sSUFBTixDQUFELEdBQWUsQ0FBZixDQUFsQjtRQUNBLFdBQVcsU0FBUyxNQUFNLEdBQU4sQ0FBVCxDQUFYO1FBQ0EsZUFBZSxhQUFhLFNBQWI7UUFDZixZQUFZLGFBQWEsSUFBYjtRQUNaLGlCQUFpQixhQUFhLFFBQWI7UUFDakIsY0FBYyxTQUFTLFFBQVQsQ0FBZCxDQU5hOztBQVFqQixRQUFJLFFBQUosRUFBYztBQUNaLFVBQUksU0FBUyxjQUFjLGNBQWQsQ0FERDtLQUFkLE1BRU8sSUFBSSxjQUFKLEVBQW9CO0FBQ3pCLGVBQVMsbUJBQW1CLGNBQWMsWUFBZCxDQUFuQixDQURnQjtLQUFwQixNQUVBLElBQUksU0FBSixFQUFlO0FBQ3BCLGVBQVMsa0JBQWtCLFlBQWxCLEtBQW1DLGNBQWMsQ0FBQyxTQUFELENBQWpELENBRFc7S0FBZixNQUVBLElBQUksV0FBSixFQUFpQjtBQUN0QixlQUFTLGtCQUFrQixZQUFsQixJQUFrQyxDQUFDLFNBQUQsS0FBZSxjQUFjLENBQUMsV0FBRCxDQUEvRCxDQURhO0tBQWpCLE1BRUEsSUFBSSxhQUFhLFdBQWIsRUFBMEI7QUFDbkMsZUFBUyxLQUFULENBRG1DO0tBQTlCLE1BRUE7QUFDTCxlQUFTLGFBQWMsWUFBWSxLQUFaLEdBQXNCLFdBQVcsS0FBWCxDQUR4QztLQUZBO0FBS1AsUUFBSSxNQUFKLEVBQVk7QUFDVixZQUFNLE1BQU0sQ0FBTixDQURJO0tBQVosTUFFTztBQUNMLGFBQU8sR0FBUCxDQURLO0tBRlA7R0FyQkY7QUEyQkEsU0FBTyxVQUFVLElBQVYsRUFBZ0IsZUFBaEIsQ0FBUCxDQXJDNkQ7Q0FBL0Q7O0FBd0NBLE9BQU8sT0FBUCxHQUFpQixpQkFBakIiLCJmaWxlIjoiX2Jhc2VTb3J0ZWRJbmRleEJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB0aGUgbWF4aW11bSBsZW5ndGggYW5kIGluZGV4IG9mIGFuIGFycmF5LiAqL1xudmFyIE1BWF9BUlJBWV9MRU5HVEggPSA0Mjk0OTY3Mjk1LFxuICAgIE1BWF9BUlJBWV9JTkRFWCA9IE1BWF9BUlJBWV9MRU5HVEggLSAxO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlRmxvb3IgPSBNYXRoLmZsb29yLFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnNvcnRlZEluZGV4QnlgIGFuZCBgXy5zb3J0ZWRMYXN0SW5kZXhCeWBcbiAqIHdoaWNoIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgYHZhbHVlYCBhbmQgZWFjaCBlbGVtZW50IG9mIGBhcnJheWAgdG8gY29tcHV0ZVxuICogdGhlaXIgc29ydCByYW5raW5nLiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDsgKHZhbHVlKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIHNvcnRlZCBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gZXZhbHVhdGUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3JldEhpZ2hlc3RdIFNwZWNpZnkgcmV0dXJuaW5nIHRoZSBoaWdoZXN0IHF1YWxpZmllZCBpbmRleC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IGF0IHdoaWNoIGB2YWx1ZWAgc2hvdWxkIGJlIGluc2VydGVkXG4gKiAgaW50byBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBiYXNlU29ydGVkSW5kZXhCeShhcnJheSwgdmFsdWUsIGl0ZXJhdGVlLCByZXRIaWdoZXN0KSB7XG4gIHZhbHVlID0gaXRlcmF0ZWUodmFsdWUpO1xuXG4gIHZhciBsb3cgPSAwLFxuICAgICAgaGlnaCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMCxcbiAgICAgIHZhbElzTmFOID0gdmFsdWUgIT09IHZhbHVlLFxuICAgICAgdmFsSXNOdWxsID0gdmFsdWUgPT09IG51bGwsXG4gICAgICB2YWxJc1N5bWJvbCA9IGlzU3ltYm9sKHZhbHVlKSxcbiAgICAgIHZhbElzVW5kZWZpbmVkID0gdmFsdWUgPT09IHVuZGVmaW5lZDtcblxuICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgIHZhciBtaWQgPSBuYXRpdmVGbG9vcigobG93ICsgaGlnaCkgLyAyKSxcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZShhcnJheVttaWRdKSxcbiAgICAgICAgb3RoSXNEZWZpbmVkID0gY29tcHV0ZWQgIT09IHVuZGVmaW5lZCxcbiAgICAgICAgb3RoSXNOdWxsID0gY29tcHV0ZWQgPT09IG51bGwsXG4gICAgICAgIG90aElzUmVmbGV4aXZlID0gY29tcHV0ZWQgPT09IGNvbXB1dGVkLFxuICAgICAgICBvdGhJc1N5bWJvbCA9IGlzU3ltYm9sKGNvbXB1dGVkKTtcblxuICAgIGlmICh2YWxJc05hTikge1xuICAgICAgdmFyIHNldExvdyA9IHJldEhpZ2hlc3QgfHwgb3RoSXNSZWZsZXhpdmU7XG4gICAgfSBlbHNlIGlmICh2YWxJc1VuZGVmaW5lZCkge1xuICAgICAgc2V0TG93ID0gb3RoSXNSZWZsZXhpdmUgJiYgKHJldEhpZ2hlc3QgfHwgb3RoSXNEZWZpbmVkKTtcbiAgICB9IGVsc2UgaWYgKHZhbElzTnVsbCkge1xuICAgICAgc2V0TG93ID0gb3RoSXNSZWZsZXhpdmUgJiYgb3RoSXNEZWZpbmVkICYmIChyZXRIaWdoZXN0IHx8ICFvdGhJc051bGwpO1xuICAgIH0gZWxzZSBpZiAodmFsSXNTeW1ib2wpIHtcbiAgICAgIHNldExvdyA9IG90aElzUmVmbGV4aXZlICYmIG90aElzRGVmaW5lZCAmJiAhb3RoSXNOdWxsICYmIChyZXRIaWdoZXN0IHx8ICFvdGhJc1N5bWJvbCk7XG4gICAgfSBlbHNlIGlmIChvdGhJc051bGwgfHwgb3RoSXNTeW1ib2wpIHtcbiAgICAgIHNldExvdyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRMb3cgPSByZXRIaWdoZXN0ID8gKGNvbXB1dGVkIDw9IHZhbHVlKSA6IChjb21wdXRlZCA8IHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKHNldExvdykge1xuICAgICAgbG93ID0gbWlkICsgMTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGlnaCA9IG1pZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5hdGl2ZU1pbihoaWdoLCBNQVhfQVJSQVlfSU5ERVgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTb3J0ZWRJbmRleEJ5O1xuIl19