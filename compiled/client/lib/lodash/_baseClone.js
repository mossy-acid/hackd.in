'use strict';

var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    getAllKeys = require('./_getAllKeys'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isHostObject = require('./_isHostObject'),
    isObject = require('./isObject'),
    keys = require('./keys');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || isFunc && !object) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  // Recursively populate clone (susceptible to call stack limits).
  arrayEach(props || value, function (subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlQ2xvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFFBQVEsUUFBUSxVQUFSLENBQVo7SUFDSSxZQUFZLFFBQVEsY0FBUixDQURoQjtJQUVJLGNBQWMsUUFBUSxnQkFBUixDQUZsQjtJQUdJLGFBQWEsUUFBUSxlQUFSLENBSGpCO0lBSUksY0FBYyxRQUFRLGdCQUFSLENBSmxCO0lBS0ksWUFBWSxRQUFRLGNBQVIsQ0FMaEI7SUFNSSxjQUFjLFFBQVEsZ0JBQVIsQ0FObEI7SUFPSSxhQUFhLFFBQVEsZUFBUixDQVBqQjtJQVFJLFNBQVMsUUFBUSxXQUFSLENBUmI7SUFTSSxpQkFBaUIsUUFBUSxtQkFBUixDQVRyQjtJQVVJLGlCQUFpQixRQUFRLG1CQUFSLENBVnJCO0lBV0ksa0JBQWtCLFFBQVEsb0JBQVIsQ0FYdEI7SUFZSSxVQUFVLFFBQVEsV0FBUixDQVpkO0lBYUksV0FBVyxRQUFRLFlBQVIsQ0FiZjtJQWNJLGVBQWUsUUFBUSxpQkFBUixDQWRuQjtJQWVJLFdBQVcsUUFBUSxZQUFSLENBZmY7SUFnQkksT0FBTyxRQUFRLFFBQVIsQ0FoQlg7OztBQW1CQSxJQUFJLFVBQVUsb0JBQWQ7SUFDSSxXQUFXLGdCQURmO0lBRUksVUFBVSxrQkFGZDtJQUdJLFVBQVUsZUFIZDtJQUlJLFdBQVcsZ0JBSmY7SUFLSSxVQUFVLG1CQUxkO0lBTUksU0FBUyw0QkFOYjtJQU9JLFNBQVMsY0FQYjtJQVFJLFlBQVksaUJBUmhCO0lBU0ksWUFBWSxpQkFUaEI7SUFVSSxZQUFZLGlCQVZoQjtJQVdJLFNBQVMsY0FYYjtJQVlJLFlBQVksaUJBWmhCO0lBYUksWUFBWSxpQkFiaEI7SUFjSSxhQUFhLGtCQWRqQjs7QUFnQkEsSUFBSSxpQkFBaUIsc0JBQXJCO0lBQ0ksY0FBYyxtQkFEbEI7SUFFSSxhQUFhLHVCQUZqQjtJQUdJLGFBQWEsdUJBSGpCO0lBSUksVUFBVSxvQkFKZDtJQUtJ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QUFDVixRQUFJLFFBQVEsU0FBUyxXQUFXLEtBQVgsQ0FBVCxHQUE2QixLQUFLLEtBQUwsQ0FBekM7QUFDRDs7QUFFRCxZQUFVLFNBQVMsS0FBbkIsRUFBMEIsVUFBUyxRQUFULEVBQW1CLEdBQW5CLEVBQXdCO0FBQ2hELFFBQUksS0FBSixFQUFXO0FBQ1QsWUFBTSxRQUFOO0FBQ0EsaUJBQVcsTUFBTSxHQUFOLENBQVg7QUFDRDtBQUNELGdCQUFZLE1BQVosRUFBb0IsR0FBcEIsRUFBeUIsVUFBVSxRQUFWLEVBQW9CLE1BQXBCLEVBQTRCLE1BQTVCLEVBQW9DLFVBQXBDLEVBQWdELEdBQWhELEVBQXFELEtBQXJELEVBQTRELEtBQTVELENBQXpCO0FBQ0QsR0FORDtBQU9BLFNBQU8sTUFBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJfYmFzZUNsb25lLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFN0YWNrID0gcmVxdWlyZSgnLi9fU3RhY2snKSxcbiAgICBhcnJheUVhY2ggPSByZXF1aXJlKCcuL19hcnJheUVhY2gnKSxcbiAgICBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgYmFzZUFzc2lnbiA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ24nKSxcbiAgICBjbG9uZUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQnVmZmVyJyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5JyksXG4gICAgY29weVN5bWJvbHMgPSByZXF1aXJlKCcuL19jb3B5U3ltYm9scycpLFxuICAgIGdldEFsbEtleXMgPSByZXF1aXJlKCcuL19nZXRBbGxLZXlzJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaW5pdENsb25lQXJyYXkgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVBcnJheScpLFxuICAgIGluaXRDbG9uZUJ5VGFnID0gcmVxdWlyZSgnLi9faW5pdENsb25lQnlUYWcnKSxcbiAgICBpbml0Q2xvbmVPYmplY3QgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVPYmplY3QnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNIb3N0T2JqZWN0ID0gcmVxdWlyZSgnLi9faXNIb3N0T2JqZWN0JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIHN1cHBvcnRlZCBieSBgXy5jbG9uZWAuICovXG52YXIgY2xvbmVhYmxlVGFncyA9IHt9O1xuY2xvbmVhYmxlVGFnc1thcmdzVGFnXSA9IGNsb25lYWJsZVRhZ3NbYXJyYXlUYWddID1cbmNsb25lYWJsZVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRhVmlld1RhZ10gPVxuY2xvbmVhYmxlVGFnc1tib29sVGFnXSA9IGNsb25lYWJsZVRhZ3NbZGF0ZVRhZ10gPVxuY2xvbmVhYmxlVGFnc1tmbG9hdDMyVGFnXSA9IGNsb25lYWJsZVRhZ3NbZmxvYXQ2NFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQ4VGFnXSA9IGNsb25lYWJsZVRhZ3NbaW50MTZUYWddID1cbmNsb25lYWJsZVRhZ3NbaW50MzJUYWddID0gY2xvbmVhYmxlVGFnc1ttYXBUYWddID1cbmNsb25lYWJsZVRhZ3NbbnVtYmVyVGFnXSA9IGNsb25lYWJsZVRhZ3Nbb2JqZWN0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3JlZ2V4cFRhZ10gPSBjbG9uZWFibGVUYWdzW3NldFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tzdHJpbmdUYWddID0gY2xvbmVhYmxlVGFnc1tzeW1ib2xUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDhUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50OENsYW1wZWRUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDE2VGFnXSA9IGNsb25lYWJsZVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG5jbG9uZWFibGVUYWdzW2Vycm9yVGFnXSA9IGNsb25lYWJsZVRhZ3NbZnVuY1RhZ10gPVxuY2xvbmVhYmxlVGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNsb25lYCBhbmQgYF8uY2xvbmVEZWVwYCB3aGljaCB0cmFja3NcbiAqIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0Z1bGxdIFNwZWNpZnkgYSBjbG9uZSBpbmNsdWRpbmcgc3ltYm9scy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNsb25pbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2tleV0gVGhlIGtleSBvZiBgdmFsdWVgLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBwYXJlbnQgb2JqZWN0IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIG9iamVjdHMgYW5kIHRoZWlyIGNsb25lIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjbG9uZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDbG9uZSh2YWx1ZSwgaXNEZWVwLCBpc0Z1bGwsIGN1c3RvbWl6ZXIsIGtleSwgb2JqZWN0LCBzdGFjaykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoY3VzdG9taXplcikge1xuICAgIHJlc3VsdCA9IG9iamVjdCA/IGN1c3RvbWl6ZXIodmFsdWUsIGtleSwgb2JqZWN0LCBzdGFjaykgOiBjdXN0b21pemVyKHZhbHVlKTtcbiAgfVxuICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpO1xuICBpZiAoaXNBcnIpIHtcbiAgICByZXN1bHQgPSBpbml0Q2xvbmVBcnJheSh2YWx1ZSk7XG4gICAgaWYgKCFpc0RlZXApIHtcbiAgICAgIHJldHVybiBjb3B5QXJyYXkodmFsdWUsIHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpLFxuICAgICAgICBpc0Z1bmMgPSB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xuXG4gICAgaWYgKGlzQnVmZmVyKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNsb25lQnVmZmVyKHZhbHVlLCBpc0RlZXApO1xuICAgIH1cbiAgICBpZiAodGFnID09IG9iamVjdFRhZyB8fCB0YWcgPT0gYXJnc1RhZyB8fCAoaXNGdW5jICYmICFvYmplY3QpKSB7XG4gICAgICBpZiAoaXNIb3N0T2JqZWN0KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb2JqZWN0ID8gdmFsdWUgOiB7fTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGluaXRDbG9uZU9iamVjdChpc0Z1bmMgPyB7fSA6IHZhbHVlKTtcbiAgICAgIGlmICghaXNEZWVwKSB7XG4gICAgICAgIHJldHVybiBjb3B5U3ltYm9scyh2YWx1ZSwgYmFzZUFzc2lnbihyZXN1bHQsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2xvbmVhYmxlVGFnc1t0YWddKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QgPyB2YWx1ZSA6IHt9O1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gaW5pdENsb25lQnlUYWcodmFsdWUsIHRhZywgYmFzZUNsb25lLCBpc0RlZXApO1xuICAgIH1cbiAgfVxuICAvLyBDaGVjayBmb3IgY2lyY3VsYXIgcmVmZXJlbmNlcyBhbmQgcmV0dXJuIGl0cyBjb3JyZXNwb25kaW5nIGNsb25lLlxuICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldCh2YWx1ZSk7XG4gIGlmIChzdGFja2VkKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQ7XG4gIH1cbiAgc3RhY2suc2V0KHZhbHVlLCByZXN1bHQpO1xuXG4gIGlmICghaXNBcnIpIHtcbiAgICB2YXIgcHJvcHMgPSBpc0Z1bGwgPyBnZXRBbGxLZXlzKHZhbHVlKSA6IGtleXModmFsdWUpO1xuICB9XG4gIC8vIFJlY3Vyc2l2ZWx5IHBvcHVsYXRlIGNsb25lIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gIGFycmF5RWFjaChwcm9wcyB8fCB2YWx1ZSwgZnVuY3Rpb24oc3ViVmFsdWUsIGtleSkge1xuICAgIGlmIChwcm9wcykge1xuICAgICAga2V5ID0gc3ViVmFsdWU7XG4gICAgICBzdWJWYWx1ZSA9IHZhbHVlW2tleV07XG4gICAgfVxuICAgIGFzc2lnblZhbHVlKHJlc3VsdCwga2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGlzRGVlcCwgaXNGdWxsLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFjaykpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ2xvbmU7XG4iXX0=