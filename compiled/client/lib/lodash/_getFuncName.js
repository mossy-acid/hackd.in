'use strict';

var realNames = require('./_realNames');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the name of `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {string} Returns the function name.
 */
function getFuncName(func) {
  var result = func.name + '',
      array = realNames[result],
      length = hasOwnProperty.call(realNames, result) ? array.length : 0;

  while (length--) {
    var data = array[length],
        otherFunc = data.func;
    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }
  return result;
}

module.exports = getFuncName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19nZXRGdW5jTmFtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxRQUFRLGNBQVIsQ0FBWjs7O0FBR0osSUFBSSxjQUFjLE9BQU8sU0FBUDs7O0FBR2xCLElBQUksaUJBQWlCLFlBQVksY0FBWjs7Ozs7Ozs7O0FBU3JCLFNBQVMsV0FBVCxDQUFxQixJQUFyQixFQUEyQjtBQUN6QixNQUFJLFNBQVUsS0FBSyxJQUFMLEdBQVksRUFBWjtNQUNWLFFBQVEsVUFBVSxNQUFWLENBQVI7TUFDQSxTQUFTLGVBQWUsSUFBZixDQUFvQixTQUFwQixFQUErQixNQUEvQixJQUF5QyxNQUFNLE1BQU4sR0FBZSxDQUF4RCxDQUhZOztBQUt6QixTQUFPLFFBQVAsRUFBaUI7QUFDZixRQUFJLE9BQU8sTUFBTSxNQUFOLENBQVA7UUFDQSxZQUFZLEtBQUssSUFBTCxDQUZEO0FBR2YsUUFBSSxhQUFhLElBQWIsSUFBcUIsYUFBYSxJQUFiLEVBQW1CO0FBQzFDLGFBQU8sS0FBSyxJQUFMLENBRG1DO0tBQTVDO0dBSEY7QUFPQSxTQUFPLE1BQVAsQ0FaeUI7Q0FBM0I7O0FBZUEsT0FBTyxPQUFQLEdBQWlCLFdBQWpCIiwiZmlsZSI6Il9nZXRGdW5jTmFtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciByZWFsTmFtZXMgPSByZXF1aXJlKCcuL19yZWFsTmFtZXMnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYW1lIG9mIGBmdW5jYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBuYW1lLlxuICovXG5mdW5jdGlvbiBnZXRGdW5jTmFtZShmdW5jKSB7XG4gIHZhciByZXN1bHQgPSAoZnVuYy5uYW1lICsgJycpLFxuICAgICAgYXJyYXkgPSByZWFsTmFtZXNbcmVzdWx0XSxcbiAgICAgIGxlbmd0aCA9IGhhc093blByb3BlcnR5LmNhbGwocmVhbE5hbWVzLCByZXN1bHQpID8gYXJyYXkubGVuZ3RoIDogMDtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICB2YXIgZGF0YSA9IGFycmF5W2xlbmd0aF0sXG4gICAgICAgIG90aGVyRnVuYyA9IGRhdGEuZnVuYztcbiAgICBpZiAob3RoZXJGdW5jID09IG51bGwgfHwgb3RoZXJGdW5jID09IGZ1bmMpIHtcbiAgICAgIHJldHVybiBkYXRhLm5hbWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RnVuY05hbWU7XG4iXX0=