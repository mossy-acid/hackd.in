'use strict';

var baseSetData = require('./_baseSetData'),
    createBaseWrapper = require('./_createBaseWrapper'),
    createCurryWrapper = require('./_createCurryWrapper'),
    createHybridWrapper = require('./_createHybridWrapper'),
    createPartialWrapper = require('./_createPartialWrapper'),
    getData = require('./_getData'),
    mergeData = require('./_mergeData'),
    setData = require('./_setData'),
    toInteger = require('./toInteger');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask of wrapper flags.
 *  The bitmask may be composed of the following flags:
 *     1 - `_.bind`
 *     2 - `_.bindKey`
 *     4 - `_.curry` or `_.curryRight` of a bound function
 *     8 - `_.curry`
 *    16 - `_.curryRight`
 *    32 - `_.partial`
 *    64 - `_.partialRight`
 *   128 - `_.rearg`
 *   256 - `_.ary`
 *   512 - `_.flip`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & BIND_KEY_FLAG;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
    partials = holders = undefined;
  }
  ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
  arity = arity === undefined ? arity : toInteger(arity);
  length -= holders ? holders.length : 0;

  if (bitmask & PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = undefined;
  }
  var data = isBindKey ? undefined : getData(func);

  var newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

  if (data) {
    mergeData(newData, data);
  }
  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] == null ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);

  if (!arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG)) {
    bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG);
  }
  if (!bitmask || bitmask == BIND_FLAG) {
    var result = createBaseWrapper(func, bitmask, thisArg);
  } else if (bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG) {
    result = createCurryWrapper(func, bitmask, arity);
  } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !holders.length) {
    result = createPartialWrapper(func, bitmask, thisArg, partials);
  } else {
    result = createHybridWrapper.apply(undefined, newData);
  }
  var setter = data ? baseSetData : setData;
  return setter(result, newData);
}

module.exports = createWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVXcmFwcGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7SUFDSSxvQkFBb0IsUUFBUSxzQkFBUixDQUR4QjtJQUVJLHFCQUFxQixRQUFRLHVCQUFSLENBRnpCO0lBR0ksc0JBQXNCLFFBQVEsd0JBQVIsQ0FIMUI7SUFJSSx1QkFBdUIsUUFBUSx5QkFBUixDQUozQjtJQUtJLFVBQVUsUUFBUSxZQUFSLENBTGQ7SUFNSSxZQUFZLFFBQVEsY0FBUixDQU5oQjtJQU9JLFVBQVUsUUFBUSxZQUFSLENBUGQ7SUFRSSxZQUFZLFFBQVEsYUFBUixDQVJoQjs7O0FBV0EsSUFBSSxrQkFBa0IscUJBQXRCOzs7QUFHQSxJQUFJLFlBQVksQ0FBaEI7SUFDSSxnQkFBZ0IsQ0FEcEI7SUFFSSxhQUFhLENBRmpCO0lBR0ksbUJBQW1CLEVBSHZCO0lBSUksZUFBZSxFQUpuQjtJQUtJLHFCQUFxQixFQUx6Qjs7O0FBUUEsSUFBSSxZQUFZLEtBQUssR0FBckI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkEsU0FBUyxhQUFULENBQXVCLElBQXZCLEVBQTZCLE9BQTdCLEVBQXNDLE9BQXRDLEVBQStDLFFBQS9DLEVBQXlELE9BQXpELEVBQWtFLE1BQWxFLEVBQTBFLEdBQTFFLEVBQStFLEtBQS9FLEVBQXNGO0FBQ3BGLE1BQUksWUFBWSxVQUFVLGFBQTFCO0FBQ0EsTUFBSSxDQUFDLFNBQUQsSUFBYyxPQUFPLElBQVAsSUFBZSxVQUFqQyxFQUE2QztBQUMzQyxVQUFNLElBQUksU0FBSixDQUFjLGVBQWQsQ0FBTjtBQUNEO0FBQ0QsTUFBSSxTQUFTLFdBQVcsU0FBUyxNQUFwQixHQUE2QixDQUExQztBQUNBLE1BQUksQ0FBQyxNQUFMLEVBQWE7QUFDWCxlQUFXLEVBQUUsZUFBZSxrQkFBakIsQ0FBWDtBQUNBLGVBQVcsVUFBVSxTQUFyQjtBQUNEO0FBQ0QsUUFBTSxRQUFRLFNBQVIsR0FBb0IsR0FBcEIsR0FBMEIsVUFBVSxVQUFVLEdBQVYsQ0FBVixFQUEwQixDQUExQixDQUFoQztBQUNBLFVBQVEsVUFBVSxTQUFWLEdBQXNCLEtBQXRCLEdBQThCLFVBQVUsS0FBVixDQUF0QztBQUNBLFlBQVUsVUFBVSxRQUFRLE1BQWxCLEdBQTJCLENBQXJDOztBQUVBLE1BQUksVUFBVSxrQkFBZCxFQUFrQztBQUNoQyxRQUFJLGdCQUFnQixRQUFwQjtRQUNJLGVBQWUsT0FEbkI7O0FBR0EsZUFBVyxVQUFVLFNBQXJCO0FBQ0Q7QUFDRCxNQUFJLE9BQU8sWUFBWSxTQUFaLEdBQXdCLFFBQVEsSUFBUixDQUFuQzs7QUFFQSxNQUFJLFVBQVUsQ0FDWixJQURZLEVBQ04sT0FETSxFQUNHLE9BREgsRUFDWSxRQURaLEVBQ3NCLE9BRHRCLEVBQytCLGFBRC9CLEVBQzhDLFlBRDlDLEVBRVosTUFGWSxFQUVKLEdBRkksRUFFQyxLQUZELENBQWQ7O0FBS0EsTUFBSSxJQUFKLEVBQVU7QUFDUixjQUFVLE9BQVYsRUFBbUIsSUFBbkI7QUFDRDtBQUNELFNBQU8sUUFBUSxDQUFSLENBQVA7QUFDQSxZQUFVLFFBQVEsQ0FBUixDQUFWO0FBQ0EsWUFBVSxRQUFRLENBQVIsQ0FBVjtBQUNBLGFBQVcsUUFBUSxDQUFSLENBQVg7QUFDQSxZQUFVLFFBQVEsQ0FBUixDQUFWO0FBQ0EsVUFBUSxRQUFRLENBQVIsSUFBYSxRQUFRLENBQVIsS0FBYyxJQUFkLEdBQ2hCLFlBQVksQ0FBWixHQUFnQixLQUFLLE1BREwsR0FFakIsVUFBVSxRQUFRLENBQVIsSUFBYSxNQUF2QixFQUErQixDQUEvQixDQUZKOztBQUlBLE1BQUksQ0FBQyxLQUFELElBQVUsV0FBVyxhQUFhLGdCQUF4QixDQUFkLEVBQXlEO0FBQ3ZELGVBQVcsRUFBRSxhQUFhLGdCQUFmLENBQVg7QUFDRDtBQUNELE1BQUksQ0FBQyxPQUFELElBQVksV0FBVyxTQUEzQixFQUFzQztBQUNwQyxRQUFJLFNBQVMsa0JBQWtCLElBQWxCLEVBQXdCLE9BQXhCLEVBQWlDLE9BQWpDLENBQWI7QUFDRCxHQUZELE1BRU8sSUFBSSxXQUFXLFVBQVgsSUFBeUIsV0FBVyxnQkFBeEMsRUFBMEQ7QUFDL0QsYUFBUyxtQkFBbUIsSUFBbkIsRUFBeUIsT0FBekIsRUFBa0MsS0FBbEMsQ0FBVDtBQUNELEdBRk0sTUFFQSxJQUFJLENBQUMsV0FBVyxZQUFYLElBQTJCLFlBQVksWUFBWSxZQUF4QixDQUE1QixLQUFzRSxDQUFDLFFBQVEsTUFBbkYsRUFBMkY7QUFDaEcsYUFBUyxxQkFBcUIsSUFBckIsRUFBMkIsT0FBM0IsRUFBb0MsT0FBcEMsRUFBNkMsUUFBN0MsQ0FBVDtBQUNELEdBRk0sTUFFQTtBQUNMLGFBQVMsb0JBQW9CLEtBQXBCLENBQTBCLFNBQTFCLEVBQXFDLE9BQXJDLENBQVQ7QUFDRDtBQUNELE1BQUksU0FBUyxPQUFPLFdBQVAsR0FBcUIsT0FBbEM7QUFDQSxTQUFPLE9BQU8sTUFBUCxFQUFlLE9BQWYsQ0FBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixhQUFqQiIsImZpbGUiOiJfY3JlYXRlV3JhcHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBiYXNlU2V0RGF0YSA9IHJlcXVpcmUoJy4vX2Jhc2VTZXREYXRhJyksXG4gICAgY3JlYXRlQmFzZVdyYXBwZXIgPSByZXF1aXJlKCcuL19jcmVhdGVCYXNlV3JhcHBlcicpLFxuICAgIGNyZWF0ZUN1cnJ5V3JhcHBlciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUN1cnJ5V3JhcHBlcicpLFxuICAgIGNyZWF0ZUh5YnJpZFdyYXBwZXIgPSByZXF1aXJlKCcuL19jcmVhdGVIeWJyaWRXcmFwcGVyJyksXG4gICAgY3JlYXRlUGFydGlhbFdyYXBwZXIgPSByZXF1aXJlKCcuL19jcmVhdGVQYXJ0aWFsV3JhcHBlcicpLFxuICAgIGdldERhdGEgPSByZXF1aXJlKCcuL19nZXREYXRhJyksXG4gICAgbWVyZ2VEYXRhID0gcmVxdWlyZSgnLi9fbWVyZ2VEYXRhJyksXG4gICAgc2V0RGF0YSA9IHJlcXVpcmUoJy4vX3NldERhdGEnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3Igd3JhcHBlciBtZXRhZGF0YS4gKi9cbnZhciBCSU5EX0ZMQUcgPSAxLFxuICAgIEJJTkRfS0VZX0ZMQUcgPSAyLFxuICAgIENVUlJZX0ZMQUcgPSA4LFxuICAgIENVUlJZX1JJR0hUX0ZMQUcgPSAxNixcbiAgICBQQVJUSUFMX0ZMQUcgPSAzMixcbiAgICBQQVJUSUFMX1JJR0hUX0ZMQUcgPSA2NDtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGVpdGhlciBjdXJyaWVzIG9yIGludm9rZXMgYGZ1bmNgIHdpdGggb3B0aW9uYWxcbiAqIGB0aGlzYCBiaW5kaW5nIGFuZCBwYXJ0aWFsbHkgYXBwbGllZCBhcmd1bWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSBmdW5jIFRoZSBmdW5jdGlvbiBvciBtZXRob2QgbmFtZSB0byB3cmFwLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2Ygd3JhcHBlciBmbGFncy5cbiAqICBUaGUgYml0bWFzayBtYXkgYmUgY29tcG9zZWQgb2YgdGhlIGZvbGxvd2luZyBmbGFnczpcbiAqICAgICAxIC0gYF8uYmluZGBcbiAqICAgICAyIC0gYF8uYmluZEtleWBcbiAqICAgICA0IC0gYF8uY3VycnlgIG9yIGBfLmN1cnJ5UmlnaHRgIG9mIGEgYm91bmQgZnVuY3Rpb25cbiAqICAgICA4IC0gYF8uY3VycnlgXG4gKiAgICAxNiAtIGBfLmN1cnJ5UmlnaHRgXG4gKiAgICAzMiAtIGBfLnBhcnRpYWxgXG4gKiAgICA2NCAtIGBfLnBhcnRpYWxSaWdodGBcbiAqICAgMTI4IC0gYF8ucmVhcmdgXG4gKiAgIDI1NiAtIGBfLmFyeWBcbiAqICAgNTEyIC0gYF8uZmxpcGBcbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBbcGFydGlhbHNdIFRoZSBhcmd1bWVudHMgdG8gYmUgcGFydGlhbGx5IGFwcGxpZWQuXG4gKiBAcGFyYW0ge0FycmF5fSBbaG9sZGVyc10gVGhlIGBwYXJ0aWFsc2AgcGxhY2Vob2xkZXIgaW5kZXhlcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcmdQb3NdIFRoZSBhcmd1bWVudCBwb3NpdGlvbnMgb2YgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJ5XSBUaGUgYXJpdHkgY2FwIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJpdHldIFRoZSBhcml0eSBvZiBgZnVuY2AuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB3cmFwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVXcmFwcGVyKGZ1bmMsIGJpdG1hc2ssIHRoaXNBcmcsIHBhcnRpYWxzLCBob2xkZXJzLCBhcmdQb3MsIGFyeSwgYXJpdHkpIHtcbiAgdmFyIGlzQmluZEtleSA9IGJpdG1hc2sgJiBCSU5EX0tFWV9GTEFHO1xuICBpZiAoIWlzQmluZEtleSAmJiB0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHZhciBsZW5ndGggPSBwYXJ0aWFscyA/IHBhcnRpYWxzLmxlbmd0aCA6IDA7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgYml0bWFzayAmPSB+KFBBUlRJQUxfRkxBRyB8IFBBUlRJQUxfUklHSFRfRkxBRyk7XG4gICAgcGFydGlhbHMgPSBob2xkZXJzID0gdW5kZWZpbmVkO1xuICB9XG4gIGFyeSA9IGFyeSA9PT0gdW5kZWZpbmVkID8gYXJ5IDogbmF0aXZlTWF4KHRvSW50ZWdlcihhcnkpLCAwKTtcbiAgYXJpdHkgPSBhcml0eSA9PT0gdW5kZWZpbmVkID8gYXJpdHkgOiB0b0ludGVnZXIoYXJpdHkpO1xuICBsZW5ndGggLT0gaG9sZGVycyA/IGhvbGRlcnMubGVuZ3RoIDogMDtcblxuICBpZiAoYml0bWFzayAmIFBBUlRJQUxfUklHSFRfRkxBRykge1xuICAgIHZhciBwYXJ0aWFsc1JpZ2h0ID0gcGFydGlhbHMsXG4gICAgICAgIGhvbGRlcnNSaWdodCA9IGhvbGRlcnM7XG5cbiAgICBwYXJ0aWFscyA9IGhvbGRlcnMgPSB1bmRlZmluZWQ7XG4gIH1cbiAgdmFyIGRhdGEgPSBpc0JpbmRLZXkgPyB1bmRlZmluZWQgOiBnZXREYXRhKGZ1bmMpO1xuXG4gIHZhciBuZXdEYXRhID0gW1xuICAgIGZ1bmMsIGJpdG1hc2ssIHRoaXNBcmcsIHBhcnRpYWxzLCBob2xkZXJzLCBwYXJ0aWFsc1JpZ2h0LCBob2xkZXJzUmlnaHQsXG4gICAgYXJnUG9zLCBhcnksIGFyaXR5XG4gIF07XG5cbiAgaWYgKGRhdGEpIHtcbiAgICBtZXJnZURhdGEobmV3RGF0YSwgZGF0YSk7XG4gIH1cbiAgZnVuYyA9IG5ld0RhdGFbMF07XG4gIGJpdG1hc2sgPSBuZXdEYXRhWzFdO1xuICB0aGlzQXJnID0gbmV3RGF0YVsyXTtcbiAgcGFydGlhbHMgPSBuZXdEYXRhWzNdO1xuICBob2xkZXJzID0gbmV3RGF0YVs0XTtcbiAgYXJpdHkgPSBuZXdEYXRhWzldID0gbmV3RGF0YVs5XSA9PSBudWxsXG4gICAgPyAoaXNCaW5kS2V5ID8gMCA6IGZ1bmMubGVuZ3RoKVxuICAgIDogbmF0aXZlTWF4KG5ld0RhdGFbOV0gLSBsZW5ndGgsIDApO1xuXG4gIGlmICghYXJpdHkgJiYgYml0bWFzayAmIChDVVJSWV9GTEFHIHwgQ1VSUllfUklHSFRfRkxBRykpIHtcbiAgICBiaXRtYXNrICY9IH4oQ1VSUllfRkxBRyB8IENVUlJZX1JJR0hUX0ZMQUcpO1xuICB9XG4gIGlmICghYml0bWFzayB8fCBiaXRtYXNrID09IEJJTkRfRkxBRykge1xuICAgIHZhciByZXN1bHQgPSBjcmVhdGVCYXNlV3JhcHBlcihmdW5jLCBiaXRtYXNrLCB0aGlzQXJnKTtcbiAgfSBlbHNlIGlmIChiaXRtYXNrID09IENVUlJZX0ZMQUcgfHwgYml0bWFzayA9PSBDVVJSWV9SSUdIVF9GTEFHKSB7XG4gICAgcmVzdWx0ID0gY3JlYXRlQ3VycnlXcmFwcGVyKGZ1bmMsIGJpdG1hc2ssIGFyaXR5KTtcbiAgfSBlbHNlIGlmICgoYml0bWFzayA9PSBQQVJUSUFMX0ZMQUcgfHwgYml0bWFzayA9PSAoQklORF9GTEFHIHwgUEFSVElBTF9GTEFHKSkgJiYgIWhvbGRlcnMubGVuZ3RoKSB7XG4gICAgcmVzdWx0ID0gY3JlYXRlUGFydGlhbFdyYXBwZXIoZnVuYywgYml0bWFzaywgdGhpc0FyZywgcGFydGlhbHMpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IGNyZWF0ZUh5YnJpZFdyYXBwZXIuYXBwbHkodW5kZWZpbmVkLCBuZXdEYXRhKTtcbiAgfVxuICB2YXIgc2V0dGVyID0gZGF0YSA/IGJhc2VTZXREYXRhIDogc2V0RGF0YTtcbiAgcmV0dXJuIHNldHRlcihyZXN1bHQsIG5ld0RhdGEpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVdyYXBwZXI7XG4iXX0=