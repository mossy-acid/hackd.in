'use strict';

var apply = require('./_apply'),
    arrayMap = require('./_arrayMap'),
    baseFlatten = require('./_baseFlatten'),
    baseIteratee = require('./_baseIteratee'),
    baseUnary = require('./_baseUnary'),
    isArray = require('./isArray'),
    isFlattenableIteratee = require('./_isFlattenableIteratee'),
    rest = require('./rest');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Creates a function that invokes `func` with arguments transformed by
 * corresponding `transforms`.
 *
 * @static
 * @since 4.0.0
 * @memberOf _
 * @category Function
 * @param {Function} func The function to wrap.
 * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
 *  [transforms[_.identity]] The functions to transform.
 * @returns {Function} Returns the new function.
 * @example
 *
 * function doubled(n) {
 *   return n * 2;
 * }
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var func = _.overArgs(function(x, y) {
 *   return [x, y];
 * }, [square, doubled]);
 *
 * func(9, 3);
 * // => [81, 6]
 *
 * func(10, 5);
 * // => [100, 10]
 */
var overArgs = rest(function (func, transforms) {
  transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(baseIteratee)) : arrayMap(baseFlatten(transforms, 1, isFlattenableIteratee), baseUnary(baseIteratee));

  var funcsLength = transforms.length;
  return rest(function (args) {
    var index = -1,
        length = nativeMin(args.length, funcsLength);

    while (++index < length) {
      args[index] = transforms[index].call(this, args[index]);
    }
    return apply(func, this, args);
  });
});

module.exports = overArgs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL292ZXJBcmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxRQUFRLFFBQVEsVUFBUixDQUFaO0lBQ0ksV0FBVyxRQUFRLGFBQVIsQ0FEZjtJQUVJLGNBQWMsUUFBUSxnQkFBUixDQUZsQjtJQUdJLGVBQWUsUUFBUSxpQkFBUixDQUhuQjtJQUlJLFlBQVksUUFBUSxjQUFSLENBSmhCO0lBS0ksVUFBVSxRQUFRLFdBQVIsQ0FMZDtJQU1JLHdCQUF3QixRQUFRLDBCQUFSLENBTjVCO0lBT0ksT0FBTyxRQUFRLFFBQVIsQ0FQWDs7O0FBVUEsSUFBSSxZQUFZLEtBQUssR0FBckI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQ0EsSUFBSSxXQUFXLEtBQUssVUFBUyxJQUFULEVBQWUsVUFBZixFQUEyQjtBQUM3QyxlQUFjLFdBQVcsTUFBWCxJQUFxQixDQUFyQixJQUEwQixRQUFRLFdBQVcsQ0FBWCxDQUFSLENBQTNCLEdBQ1QsU0FBUyxXQUFXLENBQVgsQ0FBVCxFQUF3QixVQUFVLFlBQVYsQ0FBeEIsQ0FEUyxHQUVULFNBQVMsWUFBWSxVQUFaLEVBQXdCLENBQXhCLEVBQTJCLHFCQUEzQixDQUFULEVBQTRELFVBQVUsWUFBVixDQUE1RCxDQUZKOztBQUlBLE1BQUksY0FBYyxXQUFXLE1BQTdCO0FBQ0EsU0FBTyxLQUFLLFVBQVMsSUFBVCxFQUFlO0FBQ3pCLFFBQUksUUFBUSxDQUFDLENBQWI7UUFDSSxTQUFTLFVBQVUsS0FBSyxNQUFmLEVBQXVCLFdBQXZCLENBRGI7O0FBR0EsV0FBTyxFQUFFLEtBQUYsR0FBVSxNQUFqQixFQUF5QjtBQUN2QixXQUFLLEtBQUwsSUFBYyxXQUFXLEtBQVgsRUFBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsRUFBNkIsS0FBSyxLQUFMLENBQTdCLENBQWQ7QUFDRDtBQUNELFdBQU8sTUFBTSxJQUFOLEVBQVksSUFBWixFQUFrQixJQUFsQixDQUFQO0FBQ0QsR0FSTSxDQUFQO0FBU0QsQ0FmYyxDQUFmOztBQWlCQSxPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoib3ZlckFyZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpLFxuICAgIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzRmxhdHRlbmFibGVJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2lzRmxhdHRlbmFibGVJdGVyYXRlZScpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggYXJndW1lbnRzIHRyYW5zZm9ybWVkIGJ5XG4gKiBjb3JyZXNwb25kaW5nIGB0cmFuc2Zvcm1zYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0gey4uLihBcnJheXxBcnJheVtdfEZ1bmN0aW9ufEZ1bmN0aW9uW118T2JqZWN0fE9iamVjdFtdfHN0cmluZ3xzdHJpbmdbXSl9XG4gKiAgW3RyYW5zZm9ybXNbXy5pZGVudGl0eV1dIFRoZSBmdW5jdGlvbnMgdG8gdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIGRvdWJsZWQobikge1xuICogICByZXR1cm4gbiAqIDI7XG4gKiB9XG4gKlxuICogZnVuY3Rpb24gc3F1YXJlKG4pIHtcbiAqICAgcmV0dXJuIG4gKiBuO1xuICogfVxuICpcbiAqIHZhciBmdW5jID0gXy5vdmVyQXJncyhmdW5jdGlvbih4LCB5KSB7XG4gKiAgIHJldHVybiBbeCwgeV07XG4gKiB9LCBbc3F1YXJlLCBkb3VibGVkXSk7XG4gKlxuICogZnVuYyg5LCAzKTtcbiAqIC8vID0+IFs4MSwgNl1cbiAqXG4gKiBmdW5jKDEwLCA1KTtcbiAqIC8vID0+IFsxMDAsIDEwXVxuICovXG52YXIgb3ZlckFyZ3MgPSByZXN0KGZ1bmN0aW9uKGZ1bmMsIHRyYW5zZm9ybXMpIHtcbiAgdHJhbnNmb3JtcyA9ICh0cmFuc2Zvcm1zLmxlbmd0aCA9PSAxICYmIGlzQXJyYXkodHJhbnNmb3Jtc1swXSkpXG4gICAgPyBhcnJheU1hcCh0cmFuc2Zvcm1zWzBdLCBiYXNlVW5hcnkoYmFzZUl0ZXJhdGVlKSlcbiAgICA6IGFycmF5TWFwKGJhc2VGbGF0dGVuKHRyYW5zZm9ybXMsIDEsIGlzRmxhdHRlbmFibGVJdGVyYXRlZSksIGJhc2VVbmFyeShiYXNlSXRlcmF0ZWUpKTtcblxuICB2YXIgZnVuY3NMZW5ndGggPSB0cmFuc2Zvcm1zLmxlbmd0aDtcbiAgcmV0dXJuIHJlc3QoZnVuY3Rpb24oYXJncykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNaW4oYXJncy5sZW5ndGgsIGZ1bmNzTGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBhcmdzW2luZGV4XSA9IHRyYW5zZm9ybXNbaW5kZXhdLmNhbGwodGhpcywgYXJnc1tpbmRleF0pO1xuICAgIH1cbiAgICByZXR1cm4gYXBwbHkoZnVuYywgdGhpcywgYXJncyk7XG4gIH0pO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlckFyZ3M7XG4iXX0=