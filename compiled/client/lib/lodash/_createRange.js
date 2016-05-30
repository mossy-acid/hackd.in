'use strict';

var baseRange = require('./_baseRange'),
    isIterateeCall = require('./_isIterateeCall'),
    toNumber = require('./toNumber');

/**
 * Creates a `_.range` or `_.rangeRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new range function.
 */
function createRange(fromRight) {
  return function (start, end, step) {
    if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
      end = step = undefined;
    }
    // Ensure the sign of `-0` is preserved.
    start = toNumber(start);
    start = start === start ? start : 0;
    if (end === undefined) {
      end = start;
      start = 0;
    } else {
      end = toNumber(end) || 0;
    }
    step = step === undefined ? start < end ? 1 : -1 : toNumber(step) || 0;
    return baseRange(start, end, step, fromRight);
  };
}

module.exports = createRange;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVSYW5nZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxRQUFRLGNBQVIsQ0FBaEI7SUFDSSxpQkFBaUIsUUFBUSxtQkFBUixDQURyQjtJQUVJLFdBQVcsUUFBUSxZQUFSLENBRmY7Ozs7Ozs7OztBQVdBLFNBQVMsV0FBVCxDQUFxQixTQUFyQixFQUFnQztBQUM5QixTQUFPLFVBQVMsS0FBVCxFQUFnQixHQUFoQixFQUFxQixJQUFyQixFQUEyQjtBQUNoQyxRQUFJLFFBQVEsT0FBTyxJQUFQLElBQWUsUUFBdkIsSUFBbUMsZUFBZSxLQUFmLEVBQXNCLEdBQXRCLEVBQTJCLElBQTNCLENBQXZDLEVBQXlFO0FBQ3ZFLFlBQU0sT0FBTyxTQUFiO0FBQ0Q7O0FBRUQsWUFBUSxTQUFTLEtBQVQsQ0FBUjtBQUNBLFlBQVEsVUFBVSxLQUFWLEdBQWtCLEtBQWxCLEdBQTBCLENBQWxDO0FBQ0EsUUFBSSxRQUFRLFNBQVosRUFBdUI7QUFDckIsWUFBTSxLQUFOO0FBQ0EsY0FBUSxDQUFSO0FBQ0QsS0FIRCxNQUdPO0FBQ0wsWUFBTSxTQUFTLEdBQVQsS0FBaUIsQ0FBdkI7QUFDRDtBQUNELFdBQU8sU0FBUyxTQUFULEdBQXNCLFFBQVEsR0FBUixHQUFjLENBQWQsR0FBa0IsQ0FBQyxDQUF6QyxHQUErQyxTQUFTLElBQVQsS0FBa0IsQ0FBeEU7QUFDQSxXQUFPLFVBQVUsS0FBVixFQUFpQixHQUFqQixFQUFzQixJQUF0QixFQUE0QixTQUE1QixDQUFQO0FBQ0QsR0FmRDtBQWdCRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoiX2NyZWF0ZVJhbmdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VSYW5nZSA9IHJlcXVpcmUoJy4vX2Jhc2VSYW5nZScpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9faXNJdGVyYXRlZUNhbGwnKSxcbiAgICB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYF8ucmFuZ2VgIG9yIGBfLnJhbmdlUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHJhbmdlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVSYW5nZShmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIHN0ZXApIHtcbiAgICBpZiAoc3RlcCAmJiB0eXBlb2Ygc3RlcCAhPSAnbnVtYmVyJyAmJiBpc0l0ZXJhdGVlQ2FsbChzdGFydCwgZW5kLCBzdGVwKSkge1xuICAgICAgZW5kID0gc3RlcCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gRW5zdXJlIHRoZSBzaWduIG9mIGAtMGAgaXMgcHJlc2VydmVkLlxuICAgIHN0YXJ0ID0gdG9OdW1iZXIoc3RhcnQpO1xuICAgIHN0YXJ0ID0gc3RhcnQgPT09IHN0YXJ0ID8gc3RhcnQgOiAwO1xuICAgIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVuZCA9IHRvTnVtYmVyKGVuZCkgfHwgMDtcbiAgICB9XG4gICAgc3RlcCA9IHN0ZXAgPT09IHVuZGVmaW5lZCA/IChzdGFydCA8IGVuZCA/IDEgOiAtMSkgOiAodG9OdW1iZXIoc3RlcCkgfHwgMCk7XG4gICAgcmV0dXJuIGJhc2VSYW5nZShzdGFydCwgZW5kLCBzdGVwLCBmcm9tUmlnaHQpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVJhbmdlO1xuIl19