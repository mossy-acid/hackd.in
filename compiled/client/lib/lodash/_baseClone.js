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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlQ2xvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFFBQVEsUUFBUSxVQUFSLENBQVI7SUFDQSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsY0FBYyxRQUFRLGdCQUFSLENBQWQ7SUFDQSxhQUFhLFFBQVEsZUFBUixDQUFiO0lBQ0EsY0FBYyxRQUFRLGdCQUFSLENBQWQ7SUFDQSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsY0FBYyxRQUFRLGdCQUFSLENBQWQ7SUFDQSxhQUFhLFFBQVEsZUFBUixDQUFiO0lBQ0EsU0FBUyxRQUFRLFdBQVIsQ0FBVDtJQUNBLGlCQUFpQixRQUFRLG1CQUFSLENBQWpCO0lBQ0EsaUJBQWlCLFFBQVEsbUJBQVIsQ0FBakI7SUFDQSxrQkFBa0IsUUFBUSxvQkFBUixDQUFsQjtJQUNBLFVBQVUsUUFBUSxXQUFSLENBQVY7SUFDQSxXQUFXLFFBQVEsWUFBUixDQUFYO0lBQ0EsZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxXQUFXLFFBQVEsWUFBUixDQUFYO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDs7O0FBR0osSUFBSSxVQUFVLG9CQUFWO0lBQ0EsV0FBVyxnQkFBWDtJQUNBLFVBQVUsa0JBQVY7SUFDQSxVQUFVLGVBQVY7SUFDQSxXQUFXLGdCQUFYO0lBQ0EsVUFBVSxtQkFBVjtJQUNBLFNBQVMsNEJBQVQ7SUFDQSxTQUFTLGNBQVQ7SUFDQSxZQUFZLGlCQUFaO0lBQ0EsWUFBWSxpQkFBWjtJQUNBLFlBQVksaUJBQVo7SUFDQSxTQUFTLGNBQVQ7SUFDQSxZQUFZLGlCQUFaO0lBQ0EsWUFBWSxpQkFBWjtJQUNBLGFBQWEsa0JBQWI7O0FBRUosSUFBSSxpQkFBaUIsc0JBQWpCO0lBQ0EsY0FBYyxtQkFBZDtJQUNBLGFBQWEsdUJBQWI7SUFDQSxhQUFhLHVCQUFiO0lBQ0EsVUFBVSxvQkFBVjtJQUNBLFdBQVcscUJBQVg7SUFDQSxXQUFXLHFC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LFdBQU8sT0FBUCxDQURXO0dBQWI7QUFHQSxRQUFNLEdBQU4sQ0FBVSxLQUFWLEVBQWlCLE1BQWpCLEVBN0N3RTs7QUErQ3hFLE1BQUksQ0FBQyxLQUFELEVBQVE7QUFDVixRQUFJLFFBQVEsU0FBUyxXQUFXLEtBQVgsQ0FBVCxHQUE2QixLQUFLLEtBQUwsQ0FBN0IsQ0FERjtHQUFaOztBQS9Dd0UsV0FtRHhFLENBQVUsU0FBUyxLQUFULEVBQWdCLFVBQVMsUUFBVCxFQUFtQixHQUFuQixFQUF3QjtBQUNoRCxRQUFJLEtBQUosRUFBVztBQUNULFlBQU0sUUFBTixDQURTO0FBRVQsaUJBQVcsTUFBTSxHQUFOLENBQVgsQ0FGUztLQUFYO0FBSUEsZ0JBQVksTUFBWixFQUFvQixHQUFwQixFQUF5QixVQUFVLFFBQVYsRUFBb0IsTUFBcEIsRUFBNEIsTUFBNUIsRUFBb0MsVUFBcEMsRUFBZ0QsR0FBaEQsRUFBcUQsS0FBckQsRUFBNEQsS0FBNUQsQ0FBekIsRUFMZ0Q7R0FBeEIsQ0FBMUIsQ0FuRHdFO0FBMER4RSxTQUFPLE1BQVAsQ0ExRHdFO0NBQTFFOztBQTZEQSxPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoiX2Jhc2VDbG9uZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25WYWx1ZScpLFxuICAgIGJhc2VBc3NpZ24gPSByZXF1aXJlKCcuL19iYXNlQXNzaWduJyksXG4gICAgY2xvbmVCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUJ1ZmZlcicpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpLFxuICAgIGNvcHlTeW1ib2xzID0gcmVxdWlyZSgnLi9fY29weVN5bWJvbHMnKSxcbiAgICBnZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5cycpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGluaXRDbG9uZUFycmF5ID0gcmVxdWlyZSgnLi9faW5pdENsb25lQXJyYXknKSxcbiAgICBpbml0Q2xvbmVCeVRhZyA9IHJlcXVpcmUoJy4vX2luaXRDbG9uZUJ5VGFnJyksXG4gICAgaW5pdENsb25lT2JqZWN0ID0gcmVxdWlyZSgnLi9faW5pdENsb25lT2JqZWN0JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzSG9zdE9iamVjdCA9IHJlcXVpcmUoJy4vX2lzSG9zdE9iamVjdCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBzdXBwb3J0ZWQgYnkgYF8uY2xvbmVgLiAqL1xudmFyIGNsb25lYWJsZVRhZ3MgPSB7fTtcbmNsb25lYWJsZVRhZ3NbYXJnc1RhZ10gPSBjbG9uZWFibGVUYWdzW2FycmF5VGFnXSA9XG5jbG9uZWFibGVUYWdzW2FycmF5QnVmZmVyVGFnXSA9IGNsb25lYWJsZVRhZ3NbZGF0YVZpZXdUYWddID1cbmNsb25lYWJsZVRhZ3NbYm9vbFRhZ10gPSBjbG9uZWFibGVUYWdzW2RhdGVUYWddID1cbmNsb25lYWJsZVRhZ3NbZmxvYXQzMlRhZ10gPSBjbG9uZWFibGVUYWdzW2Zsb2F0NjRUYWddID1cbmNsb25lYWJsZVRhZ3NbaW50OFRhZ10gPSBjbG9uZWFibGVUYWdzW2ludDE2VGFnXSA9XG5jbG9uZWFibGVUYWdzW2ludDMyVGFnXSA9IGNsb25lYWJsZVRhZ3NbbWFwVGFnXSA9XG5jbG9uZWFibGVUYWdzW251bWJlclRhZ10gPSBjbG9uZWFibGVUYWdzW29iamVjdFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tyZWdleHBUYWddID0gY2xvbmVhYmxlVGFnc1tzZXRUYWddID1cbmNsb25lYWJsZVRhZ3Nbc3RyaW5nVGFnXSA9IGNsb25lYWJsZVRhZ3Nbc3ltYm9sVGFnXSA9XG5jbG9uZWFibGVUYWdzW3VpbnQ4VGFnXSA9IGNsb25lYWJsZVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9XG5jbG9uZWFibGVUYWdzW3VpbnQxNlRhZ10gPSBjbG9uZWFibGVUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xuY2xvbmVhYmxlVGFnc1tlcnJvclRhZ10gPSBjbG9uZWFibGVUYWdzW2Z1bmNUYWddID1cbmNsb25lYWJsZVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jbG9uZWAgYW5kIGBfLmNsb25lRGVlcGAgd2hpY2ggdHJhY2tzXG4gKiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNGdWxsXSBTcGVjaWZ5IGEgY2xvbmUgaW5jbHVkaW5nIHN5bWJvbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nLlxuICogQHBhcmFtIHtzdHJpbmd9IFtrZXldIFRoZSBrZXkgb2YgYHZhbHVlYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgcGFyZW50IG9iamVjdCBvZiBgdmFsdWVgLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGFuZCB0aGVpciBjbG9uZSBjb3VudGVycGFydHMuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBiYXNlQ2xvbmUodmFsdWUsIGlzRGVlcCwgaXNGdWxsLCBjdXN0b21pemVyLCBrZXksIG9iamVjdCwgc3RhY2spIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICByZXN1bHQgPSBvYmplY3QgPyBjdXN0b21pemVyKHZhbHVlLCBrZXksIG9iamVjdCwgc3RhY2spIDogY3VzdG9taXplcih2YWx1ZSk7XG4gIH1cbiAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKTtcbiAgaWYgKGlzQXJyKSB7XG4gICAgcmVzdWx0ID0gaW5pdENsb25lQXJyYXkodmFsdWUpO1xuICAgIGlmICghaXNEZWVwKSB7XG4gICAgICByZXR1cm4gY29weUFycmF5KHZhbHVlLCByZXN1bHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgdGFnID0gZ2V0VGFnKHZhbHVlKSxcbiAgICAgICAgaXNGdW5jID0gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZztcblxuICAgIGlmIChpc0J1ZmZlcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjbG9uZUJ1ZmZlcih2YWx1ZSwgaXNEZWVwKTtcbiAgICB9XG4gICAgaWYgKHRhZyA9PSBvYmplY3RUYWcgfHwgdGFnID09IGFyZ3NUYWcgfHwgKGlzRnVuYyAmJiAhb2JqZWN0KSkge1xuICAgICAgaWYgKGlzSG9zdE9iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdCA/IHZhbHVlIDoge307XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBpbml0Q2xvbmVPYmplY3QoaXNGdW5jID8ge30gOiB2YWx1ZSk7XG4gICAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgICByZXR1cm4gY29weVN5bWJvbHModmFsdWUsIGJhc2VBc3NpZ24ocmVzdWx0LCB2YWx1ZSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNsb25lYWJsZVRhZ3NbdGFnXSkge1xuICAgICAgICByZXR1cm4gb2JqZWN0ID8gdmFsdWUgOiB7fTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGluaXRDbG9uZUJ5VGFnKHZhbHVlLCB0YWcsIGJhc2VDbG9uZSwgaXNEZWVwKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBpdHMgY29ycmVzcG9uZGluZyBjbG9uZS5cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQodmFsdWUpO1xuICBpZiAoc3RhY2tlZCkge1xuICAgIHJldHVybiBzdGFja2VkO1xuICB9XG4gIHN0YWNrLnNldCh2YWx1ZSwgcmVzdWx0KTtcblxuICBpZiAoIWlzQXJyKSB7XG4gICAgdmFyIHByb3BzID0gaXNGdWxsID8gZ2V0QWxsS2V5cyh2YWx1ZSkgOiBrZXlzKHZhbHVlKTtcbiAgfVxuICAvLyBSZWN1cnNpdmVseSBwb3B1bGF0ZSBjbG9uZSAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICBhcnJheUVhY2gocHJvcHMgfHwgdmFsdWUsIGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIGtleSA9IHN1YlZhbHVlO1xuICAgICAgc3ViVmFsdWUgPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgICBhc3NpZ25WYWx1ZShyZXN1bHQsIGtleSwgYmFzZUNsb25lKHN1YlZhbHVlLCBpc0RlZXAsIGlzRnVsbCwgY3VzdG9taXplciwga2V5LCB2YWx1ZSwgc3RhY2spKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNsb25lO1xuIl19