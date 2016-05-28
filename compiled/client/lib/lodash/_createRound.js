'use strict';

var toInteger = require('./toInteger'),
    toNumber = require('./toNumber'),
    toString = require('./toString');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Creates a function like `_.round`.
 *
 * @private
 * @param {string} methodName The name of the `Math` method to use when rounding.
 * @returns {Function} Returns the new round function.
 */
function createRound(methodName) {
  var func = Math[methodName];
  return function (number, precision) {
    number = toNumber(number);
    precision = nativeMin(toInteger(precision), 292);
    if (precision) {
      // Shift with exponential notation to avoid floating-point issues.
      // See [MDN](https://mdn.io/round#Examples) for more details.
      var pair = (toString(number) + 'e').split('e'),
          value = func(pair[0] + 'e' + (+pair[1] + precision));

      pair = (toString(value) + 'e').split('e');
      return +(pair[0] + 'e' + (+pair[1] - precision));
    }
    return func(number);
  };
}

module.exports = createRound;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVSb3VuZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxRQUFRLGFBQVIsQ0FBWjtJQUNBLFdBQVcsUUFBUSxZQUFSLENBQVg7SUFDQSxXQUFXLFFBQVEsWUFBUixDQUFYOzs7QUFHSixJQUFJLFlBQVksS0FBSyxHQUFMOzs7Ozs7Ozs7QUFTaEIsU0FBUyxXQUFULENBQXFCLFVBQXJCLEVBQWlDO0FBQy9CLE1BQUksT0FBTyxLQUFLLFVBQUwsQ0FBUCxDQUQyQjtBQUUvQixTQUFPLFVBQVMsTUFBVCxFQUFpQixTQUFqQixFQUE0QjtBQUNqQyxhQUFTLFNBQVMsTUFBVCxDQUFULENBRGlDO0FBRWpDLGdCQUFZLFVBQVUsVUFBVSxTQUFWLENBQVYsRUFBZ0MsR0FBaEMsQ0FBWixDQUZpQztBQUdqQyxRQUFJLFNBQUosRUFBZTs7O0FBR2IsVUFBSSxPQUFPLENBQUMsU0FBUyxNQUFULElBQW1CLEdBQW5CLENBQUQsQ0FBeUIsS0FBekIsQ0FBK0IsR0FBL0IsQ0FBUDtVQUNBLFFBQVEsS0FBSyxLQUFLLENBQUwsSUFBVSxHQUFWLElBQWlCLENBQUMsS0FBSyxDQUFMLENBQUQsR0FBVyxTQUFYLENBQWpCLENBQWIsQ0FKUzs7QUFNYixhQUFPLENBQUMsU0FBUyxLQUFULElBQWtCLEdBQWxCLENBQUQsQ0FBd0IsS0FBeEIsQ0FBOEIsR0FBOUIsQ0FBUCxDQU5hO0FBT2IsYUFBTyxFQUFFLEtBQUssQ0FBTCxJQUFVLEdBQVYsSUFBaUIsQ0FBQyxLQUFLLENBQUwsQ0FBRCxHQUFXLFNBQVgsQ0FBakIsQ0FBRixDQVBNO0tBQWY7QUFTQSxXQUFPLEtBQUssTUFBTCxDQUFQLENBWmlDO0dBQTVCLENBRndCO0NBQWpDOztBQWtCQSxPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoiX2NyZWF0ZVJvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyksXG4gICAgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gbGlrZSBgXy5yb3VuZGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lIFRoZSBuYW1lIG9mIHRoZSBgTWF0aGAgbWV0aG9kIHRvIHVzZSB3aGVuIHJvdW5kaW5nLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgcm91bmQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVJvdW5kKG1ldGhvZE5hbWUpIHtcbiAgdmFyIGZ1bmMgPSBNYXRoW21ldGhvZE5hbWVdO1xuICByZXR1cm4gZnVuY3Rpb24obnVtYmVyLCBwcmVjaXNpb24pIHtcbiAgICBudW1iZXIgPSB0b051bWJlcihudW1iZXIpO1xuICAgIHByZWNpc2lvbiA9IG5hdGl2ZU1pbih0b0ludGVnZXIocHJlY2lzaW9uKSwgMjkyKTtcbiAgICBpZiAocHJlY2lzaW9uKSB7XG4gICAgICAvLyBTaGlmdCB3aXRoIGV4cG9uZW50aWFsIG5vdGF0aW9uIHRvIGF2b2lkIGZsb2F0aW5nLXBvaW50IGlzc3Vlcy5cbiAgICAgIC8vIFNlZSBbTUROXShodHRwczovL21kbi5pby9yb3VuZCNFeGFtcGxlcykgZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgIHZhciBwYWlyID0gKHRvU3RyaW5nKG51bWJlcikgKyAnZScpLnNwbGl0KCdlJyksXG4gICAgICAgICAgdmFsdWUgPSBmdW5jKHBhaXJbMF0gKyAnZScgKyAoK3BhaXJbMV0gKyBwcmVjaXNpb24pKTtcblxuICAgICAgcGFpciA9ICh0b1N0cmluZyh2YWx1ZSkgKyAnZScpLnNwbGl0KCdlJyk7XG4gICAgICByZXR1cm4gKyhwYWlyWzBdICsgJ2UnICsgKCtwYWlyWzFdIC0gcHJlY2lzaW9uKSk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jKG51bWJlcik7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUm91bmQ7XG4iXX0=