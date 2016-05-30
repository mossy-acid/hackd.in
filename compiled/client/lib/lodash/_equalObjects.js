'use strict';

var baseHas = require('./_baseHas'),
    keys = require('./keys');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : baseHas(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  return result;
}

module.exports = equalObjects;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19lcXVhbE9iamVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsUUFBUSxZQUFSLENBQWQ7SUFDSSxPQUFPLFFBQVEsUUFBUixDQURYOzs7QUFJQSxJQUFJLHVCQUF1QixDQUEzQjs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxTQUFTLFlBQVQsQ0FBc0IsTUFBdEIsRUFBOEIsS0FBOUIsRUFBcUMsU0FBckMsRUFBZ0QsVUFBaEQsRUFBNEQsT0FBNUQsRUFBcUUsS0FBckUsRUFBNEU7QUFDMUUsTUFBSSxZQUFZLFVBQVUsb0JBQTFCO01BQ0ksV0FBVyxLQUFLLE1BQUwsQ0FEZjtNQUVJLFlBQVksU0FBUyxNQUZ6QjtNQUdJLFdBQVcsS0FBSyxLQUFMLENBSGY7TUFJSSxZQUFZLFNBQVMsTUFKekI7O0FBTUEsTUFBSSxhQUFhLFNBQWIsSUFBMEIsQ0FBQyxTQUEvQixFQUEwQztBQUN4QyxXQUFPLEtBQVA7QUFDRDtBQUNELE1BQUksUUFBUSxTQUFaO0FBQ0EsU0FBTyxPQUFQLEVBQWdCO0FBQ2QsUUFBSSxNQUFNLFNBQVMsS0FBVCxDQUFWO0FBQ0EsUUFBSSxFQUFFLFlBQVksT0FBTyxLQUFuQixHQUEyQixRQUFRLEtBQVIsRUFBZSxHQUFmLENBQTdCLENBQUosRUFBdUQ7QUFDckQsYUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRCxNQUFJLFVBQVUsTUFBTSxHQUFOLENBQVUsTUFBVixDQUFkO0FBQ0EsTUFBSSxPQUFKLEVBQWE7QUFDWCxXQUFPLFdBQVcsS0FBbEI7QUFDRDtBQUNELE1BQUksU0FBUyxJQUFiO0FBQ0EsUUFBTSxHQUFOLENBQVUsTUFBVixFQUFrQixLQUFsQjs7QUFFQSxNQUFJLFdBQVcsU0FBZjtBQUNBLFNBQU8sRUFBRSxLQUFGLEdBQVUsU0FBakIsRUFBNEI7QUFDMUIsVUFBTSxTQUFTLEtBQVQsQ0FBTjtBQUNBLFFBQUksV0FBVyxPQUFPLEdBQVAsQ0FBZjtRQUNJLFdBQVcsTUFBTSxHQUFOLENBRGY7O0FBR0EsUUFBSSxVQUFKLEVBQWdCO0FBQ2QsVUFBSSxXQUFXLFlBQ1gsV0FBVyxRQUFYLEVBQXFCLFFBQXJCLEVBQStCLEdBQS9CLEVBQW9DLEtBQXBDLEVBQTJDLE1BQTNDLEVBQW1ELEtBQW5ELENBRFcsR0FFWCxXQUFXLFFBQVgsRUFBcUIsUUFBckIsRUFBK0IsR0FBL0IsRUFBb0MsTUFBcEMsRUFBNEMsS0FBNUMsRUFBbUQsS0FBbkQsQ0FGSjtBQUdEOztBQUVELFFBQUksRUFBRSxhQUFhLFNBQWIsR0FDRyxhQUFhLFFBQWIsSUFBeUIsVUFBVSxRQUFWLEVBQW9CLFFBQXBCLEVBQThCLFVBQTlCLEVBQTBDLE9BQTFDLEVBQW1ELEtBQW5ELENBRDVCLEdBRUUsUUFGSixDQUFKLEVBR087QUFDTCxlQUFTLEtBQVQ7QUFDQTtBQUNEO0FBQ0QsaUJBQWEsV0FBVyxPQUFPLGFBQS9CO0FBQ0Q7QUFDRCxNQUFJLFVBQVUsQ0FBQyxRQUFmLEVBQXlCO0FBQ3ZCLFFBQUksVUFBVSxPQUFPLFdBQXJCO1FBQ0ksVUFBVSxNQUFNLFdBRHBCOzs7QUFJQSxRQUFJLFdBQVcsT0FBWCxJQUNDLGlCQUFpQixNQUFqQixJQUEyQixpQkFBaUIsS0FEN0MsSUFFQSxFQUFFLE9BQU8sT0FBUCxJQUFrQixVQUFsQixJQUFnQyxtQkFBbUIsT0FBbkQsSUFDQSxPQUFPLE9BQVAsSUFBa0IsVUFEbEIsSUFDZ0MsbUJBQW1CLE9BRHJELENBRkosRUFHbUU7QUFDakUsZUFBUyxLQUFUO0FBQ0Q7QUFDRjtBQUNELFFBQU0sUUFBTixFQUFnQixNQUFoQjtBQUNBLFNBQU8sTUFBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJfZXF1YWxPYmplY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VIYXMgPSByZXF1aXJlKCcuL19iYXNlSGFzJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjb21wYXJpc29uIHN0eWxlcy4gKi9cbnZhciBQQVJUSUFMX0NPTVBBUkVfRkxBRyA9IDI7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBvYmplY3RzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2YgY29tcGFyaXNvbiBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGBcbiAqICBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIFBBUlRJQUxfQ09NUEFSRV9GTEFHLFxuICAgICAgb2JqUHJvcHMgPSBrZXlzKG9iamVjdCksXG4gICAgICBvYmpMZW5ndGggPSBvYmpQcm9wcy5sZW5ndGgsXG4gICAgICBvdGhQcm9wcyA9IGtleXMob3RoZXIpLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoUHJvcHMubGVuZ3RoO1xuXG4gIGlmIChvYmpMZW5ndGggIT0gb3RoTGVuZ3RoICYmICFpc1BhcnRpYWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGluZGV4ID0gb2JqTGVuZ3RoO1xuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIHZhciBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgaWYgKCEoaXNQYXJ0aWFsID8ga2V5IGluIG90aGVyIDogYmFzZUhhcyhvdGhlciwga2V5KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICBpZiAoc3RhY2tlZCkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciByZXN1bHQgPSB0cnVlO1xuICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG5cbiAgdmFyIHNraXBDdG9yID0gaXNQYXJ0aWFsO1xuICB3aGlsZSAoKytpbmRleCA8IG9iakxlbmd0aCkge1xuICAgIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltrZXldO1xuXG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHZhciBjb21wYXJlZCA9IGlzUGFydGlhbFxuICAgICAgICA/IGN1c3RvbWl6ZXIob3RoVmFsdWUsIG9ialZhbHVlLCBrZXksIG90aGVyLCBvYmplY3QsIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIob2JqVmFsdWUsIG90aFZhbHVlLCBrZXksIG9iamVjdCwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKCEoY29tcGFyZWQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gKG9ialZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMob2JqVmFsdWUsIG90aFZhbHVlLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykpXG4gICAgICAgICAgOiBjb21wYXJlZFxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBza2lwQ3RvciB8fCAoc2tpcEN0b3IgPSBrZXkgPT0gJ2NvbnN0cnVjdG9yJyk7XG4gIH1cbiAgaWYgKHJlc3VsdCAmJiAhc2tpcEN0b3IpIHtcbiAgICB2YXIgb2JqQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgICAgb3RoQ3RvciA9IG90aGVyLmNvbnN0cnVjdG9yO1xuXG4gICAgLy8gTm9uIGBPYmplY3RgIG9iamVjdCBpbnN0YW5jZXMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1YWwuXG4gICAgaWYgKG9iakN0b3IgIT0gb3RoQ3RvciAmJlxuICAgICAgICAoJ2NvbnN0cnVjdG9yJyBpbiBvYmplY3QgJiYgJ2NvbnN0cnVjdG9yJyBpbiBvdGhlcikgJiZcbiAgICAgICAgISh0eXBlb2Ygb2JqQ3RvciA9PSAnZnVuY3Rpb24nICYmIG9iakN0b3IgaW5zdGFuY2VvZiBvYmpDdG9yICYmXG4gICAgICAgICAgdHlwZW9mIG90aEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvdGhDdG9yIGluc3RhbmNlb2Ygb3RoQ3RvcikpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcXVhbE9iamVjdHM7XG4iXX0=