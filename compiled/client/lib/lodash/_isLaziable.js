'use strict';

var LazyWrapper = require('./_LazyWrapper'),
    getData = require('./_getData'),
    getFuncName = require('./_getFuncName'),
    lodash = require('./wrapperLodash');

/**
 * Checks if `func` has a lazy counterpart.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
 *  else `false`.
 */
function isLaziable(func) {
  var funcName = getFuncName(func),
      other = lodash[funcName];

  if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
    return false;
  }
  if (func === other) {
    return true;
  }
  var data = getData(other);
  return !!data && func === data[0];
}

module.exports = isLaziable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19pc0xhemlhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLFVBQVUsUUFBUSxZQUFSLENBQVY7SUFDQSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLFNBQVMsUUFBUSxpQkFBUixDQUFUOzs7Ozs7Ozs7O0FBVUosU0FBUyxVQUFULENBQW9CLElBQXBCLEVBQTBCO0FBQ3hCLE1BQUksV0FBVyxZQUFZLElBQVosQ0FBWDtNQUNBLFFBQVEsT0FBTyxRQUFQLENBQVIsQ0FGb0I7O0FBSXhCLE1BQUksT0FBTyxLQUFQLElBQWdCLFVBQWhCLElBQThCLEVBQUUsWUFBWSxZQUFZLFNBQVosQ0FBZCxFQUFzQztBQUN0RSxXQUFPLEtBQVAsQ0FEc0U7R0FBeEU7QUFHQSxNQUFJLFNBQVMsS0FBVCxFQUFnQjtBQUNsQixXQUFPLElBQVAsQ0FEa0I7R0FBcEI7QUFHQSxNQUFJLE9BQU8sUUFBUSxLQUFSLENBQVAsQ0FWb0I7QUFXeEIsU0FBTyxDQUFDLENBQUMsSUFBRCxJQUFTLFNBQVMsS0FBSyxDQUFMLENBQVQsQ0FYTztDQUExQjs7QUFjQSxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoiX2lzTGF6aWFibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTGF6eVdyYXBwZXIgPSByZXF1aXJlKCcuL19MYXp5V3JhcHBlcicpLFxuICAgIGdldERhdGEgPSByZXF1aXJlKCcuL19nZXREYXRhJyksXG4gICAgZ2V0RnVuY05hbWUgPSByZXF1aXJlKCcuL19nZXRGdW5jTmFtZScpLFxuICAgIGxvZGFzaCA9IHJlcXVpcmUoJy4vd3JhcHBlckxvZGFzaCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGEgbGF6eSBjb3VudGVycGFydC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGhhcyBhIGxhenkgY291bnRlcnBhcnQsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xhemlhYmxlKGZ1bmMpIHtcbiAgdmFyIGZ1bmNOYW1lID0gZ2V0RnVuY05hbWUoZnVuYyksXG4gICAgICBvdGhlciA9IGxvZGFzaFtmdW5jTmFtZV07XG5cbiAgaWYgKHR5cGVvZiBvdGhlciAhPSAnZnVuY3Rpb24nIHx8ICEoZnVuY05hbWUgaW4gTGF6eVdyYXBwZXIucHJvdG90eXBlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoZnVuYyA9PT0gb3RoZXIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB2YXIgZGF0YSA9IGdldERhdGEob3RoZXIpO1xuICByZXR1cm4gISFkYXRhICYmIGZ1bmMgPT09IGRhdGFbMF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMYXppYWJsZTtcbiJdfQ==