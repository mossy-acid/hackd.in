'use strict';

var isSymbol = require('./isSymbol');

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
      return 1;
    }
    if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

module.exports = compareAscending;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jb21wYXJlQXNjZW5kaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLFFBQVEsWUFBUixDQUFYOzs7Ozs7Ozs7O0FBVUosU0FBUyxnQkFBVCxDQUEwQixLQUExQixFQUFpQyxLQUFqQyxFQUF3QztBQUN0QyxNQUFJLFVBQVUsS0FBVixFQUFpQjtBQUNuQixRQUFJLGVBQWUsVUFBVSxTQUFWO1FBQ2YsWUFBWSxVQUFVLElBQVY7UUFDWixpQkFBaUIsVUFBVSxLQUFWO1FBQ2pCLGNBQWMsU0FBUyxLQUFULENBQWQsQ0FKZTs7QUFNbkIsUUFBSSxlQUFlLFVBQVUsU0FBVjtRQUNmLFlBQVksVUFBVSxJQUFWO1FBQ1osaUJBQWlCLFVBQVUsS0FBVjtRQUNqQixjQUFjLFNBQVMsS0FBVCxDQUFkLENBVGU7O0FBV25CLFFBQUksQ0FBRSxTQUFELElBQWMsQ0FBQyxXQUFELElBQWdCLENBQUMsV0FBRCxJQUFnQixRQUFRLEtBQVIsSUFDOUMsZUFBZSxZQUFmLElBQStCLGNBQS9CLElBQWlELENBQUMsU0FBRCxJQUFjLENBQUMsV0FBRCxJQUMvRCxhQUFhLFlBQWIsSUFBNkIsY0FBN0IsSUFDQSxDQUFDLFlBQUQsSUFBaUIsY0FBakIsSUFDRCxDQUFDLGNBQUQsRUFBaUI7QUFDbkIsYUFBTyxDQUFQLENBRG1CO0tBSnJCO0FBT0EsUUFBSSxDQUFFLFNBQUQsSUFBYyxDQUFDLFdBQUQsSUFBZ0IsQ0FBQyxXQUFELElBQWdCLFFBQVEsS0FBUixJQUM5QyxlQUFlLFlBQWYsSUFBK0IsY0FBL0IsSUFBaUQsQ0FBQyxTQUFELElBQWMsQ0FBQyxXQUFELElBQy9ELGFBQWEsWUFBYixJQUE2QixjQUE3QixJQUNBLENBQUMsWUFBRCxJQUFpQixjQUFqQixJQUNELENBQUMsY0FBRCxFQUFpQjtBQUNuQixhQUFPLENBQUMsQ0FBRCxDQURZO0tBSnJCO0dBbEJGO0FBMEJBLFNBQU8sQ0FBUCxDQTNCc0M7Q0FBeEM7O0FBOEJBLE9BQU8sT0FBUCxHQUFpQixnQkFBakIiLCJmaWxlIjoiX2NvbXBhcmVBc2NlbmRpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKlxuICogQ29tcGFyZXMgdmFsdWVzIHRvIHNvcnQgdGhlbSBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgc29ydCBvcmRlciBpbmRpY2F0b3IgZm9yIGB2YWx1ZWAuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVBc2NlbmRpbmcodmFsdWUsIG90aGVyKSB7XG4gIGlmICh2YWx1ZSAhPT0gb3RoZXIpIHtcbiAgICB2YXIgdmFsSXNEZWZpbmVkID0gdmFsdWUgIT09IHVuZGVmaW5lZCxcbiAgICAgICAgdmFsSXNOdWxsID0gdmFsdWUgPT09IG51bGwsXG4gICAgICAgIHZhbElzUmVmbGV4aXZlID0gdmFsdWUgPT09IHZhbHVlLFxuICAgICAgICB2YWxJc1N5bWJvbCA9IGlzU3ltYm9sKHZhbHVlKTtcblxuICAgIHZhciBvdGhJc0RlZmluZWQgPSBvdGhlciAhPT0gdW5kZWZpbmVkLFxuICAgICAgICBvdGhJc051bGwgPSBvdGhlciA9PT0gbnVsbCxcbiAgICAgICAgb3RoSXNSZWZsZXhpdmUgPSBvdGhlciA9PT0gb3RoZXIsXG4gICAgICAgIG90aElzU3ltYm9sID0gaXNTeW1ib2wob3RoZXIpO1xuXG4gICAgaWYgKCghb3RoSXNOdWxsICYmICFvdGhJc1N5bWJvbCAmJiAhdmFsSXNTeW1ib2wgJiYgdmFsdWUgPiBvdGhlcikgfHxcbiAgICAgICAgKHZhbElzU3ltYm9sICYmIG90aElzRGVmaW5lZCAmJiBvdGhJc1JlZmxleGl2ZSAmJiAhb3RoSXNOdWxsICYmICFvdGhJc1N5bWJvbCkgfHxcbiAgICAgICAgKHZhbElzTnVsbCAmJiBvdGhJc0RlZmluZWQgJiYgb3RoSXNSZWZsZXhpdmUpIHx8XG4gICAgICAgICghdmFsSXNEZWZpbmVkICYmIG90aElzUmVmbGV4aXZlKSB8fFxuICAgICAgICAhdmFsSXNSZWZsZXhpdmUpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICBpZiAoKCF2YWxJc051bGwgJiYgIXZhbElzU3ltYm9sICYmICFvdGhJc1N5bWJvbCAmJiB2YWx1ZSA8IG90aGVyKSB8fFxuICAgICAgICAob3RoSXNTeW1ib2wgJiYgdmFsSXNEZWZpbmVkICYmIHZhbElzUmVmbGV4aXZlICYmICF2YWxJc051bGwgJiYgIXZhbElzU3ltYm9sKSB8fFxuICAgICAgICAob3RoSXNOdWxsICYmIHZhbElzRGVmaW5lZCAmJiB2YWxJc1JlZmxleGl2ZSkgfHxcbiAgICAgICAgKCFvdGhJc0RlZmluZWQgJiYgdmFsSXNSZWZsZXhpdmUpIHx8XG4gICAgICAgICFvdGhJc1JlZmxleGl2ZSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgfVxuICByZXR1cm4gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb21wYXJlQXNjZW5kaW5nO1xuIl19