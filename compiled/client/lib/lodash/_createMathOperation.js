'use strict';

var baseToNumber = require('./_baseToNumber'),
    baseToString = require('./_baseToString');

/**
 * Creates a function that performs a mathematical operation on two values.
 *
 * @private
 * @param {Function} operator The function to perform the operation.
 * @returns {Function} Returns the new mathematical operation function.
 */
function createMathOperation(operator) {
  return function (value, other) {
    var result;
    if (value === undefined && other === undefined) {
      return 0;
    }
    if (value !== undefined) {
      result = value;
    }
    if (other !== undefined) {
      if (result === undefined) {
        return other;
      }
      if (typeof value == 'string' || typeof other == 'string') {
        value = baseToString(value);
        other = baseToString(other);
      } else {
        value = baseToNumber(value);
        other = baseToNumber(other);
      }
      result = operator(value, other);
    }
    return result;
  };
}

module.exports = createMathOperation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVNYXRoT3BlcmF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxlQUFlLFFBQVEsaUJBQVIsQ0FBbkI7SUFDSSxlQUFlLFFBQVEsaUJBQVIsQ0FEbkI7Ozs7Ozs7OztBQVVBLFNBQVMsbUJBQVQsQ0FBNkIsUUFBN0IsRUFBdUM7QUFDckMsU0FBTyxVQUFTLEtBQVQsRUFBZ0IsS0FBaEIsRUFBdUI7QUFDNUIsUUFBSSxNQUFKO0FBQ0EsUUFBSSxVQUFVLFNBQVYsSUFBdUIsVUFBVSxTQUFyQyxFQUFnRDtBQUM5QyxhQUFPLENBQVA7QUFDRDtBQUNELFFBQUksVUFBVSxTQUFkLEVBQXlCO0FBQ3ZCLGVBQVMsS0FBVDtBQUNEO0FBQ0QsUUFBSSxVQUFVLFNBQWQsRUFBeUI7QUFDdkIsVUFBSSxXQUFXLFNBQWYsRUFBMEI7QUFDeEIsZUFBTyxLQUFQO0FBQ0Q7QUFDRCxVQUFJLE9BQU8sS0FBUCxJQUFnQixRQUFoQixJQUE0QixPQUFPLEtBQVAsSUFBZ0IsUUFBaEQsRUFBMEQ7QUFDeEQsZ0JBQVEsYUFBYSxLQUFiLENBQVI7QUFDQSxnQkFBUSxhQUFhLEtBQWIsQ0FBUjtBQUNELE9BSEQsTUFHTztBQUNMLGdCQUFRLGFBQWEsS0FBYixDQUFSO0FBQ0EsZ0JBQVEsYUFBYSxLQUFiLENBQVI7QUFDRDtBQUNELGVBQVMsU0FBUyxLQUFULEVBQWdCLEtBQWhCLENBQVQ7QUFDRDtBQUNELFdBQU8sTUFBUDtBQUNELEdBdEJEO0FBdUJEOztBQUVELE9BQU8sT0FBUCxHQUFpQixtQkFBakIiLCJmaWxlIjoiX2NyZWF0ZU1hdGhPcGVyYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVRvTnVtYmVyID0gcmVxdWlyZSgnLi9fYmFzZVRvTnVtYmVyJyksXG4gICAgYmFzZVRvU3RyaW5nID0gcmVxdWlyZSgnLi9fYmFzZVRvU3RyaW5nJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcGVyZm9ybXMgYSBtYXRoZW1hdGljYWwgb3BlcmF0aW9uIG9uIHR3byB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wZXJhdG9yIFRoZSBmdW5jdGlvbiB0byBwZXJmb3JtIHRoZSBvcGVyYXRpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtYXRoZW1hdGljYWwgb3BlcmF0aW9uIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVNYXRoT3BlcmF0aW9uKG9wZXJhdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIG90aGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgfVxuICAgIGlmIChvdGhlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIG90aGVyO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCB0eXBlb2Ygb3RoZXIgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFsdWUgPSBiYXNlVG9TdHJpbmcodmFsdWUpO1xuICAgICAgICBvdGhlciA9IGJhc2VUb1N0cmluZyhvdGhlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGJhc2VUb051bWJlcih2YWx1ZSk7XG4gICAgICAgIG90aGVyID0gYmFzZVRvTnVtYmVyKG90aGVyKTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IG9wZXJhdG9yKHZhbHVlLCBvdGhlcik7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTWF0aE9wZXJhdGlvbjtcbiJdfQ==