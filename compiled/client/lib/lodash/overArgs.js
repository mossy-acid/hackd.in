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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL292ZXJBcmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxRQUFRLFFBQVEsVUFBUixDQUFSO0lBQ0EsV0FBVyxRQUFRLGFBQVIsQ0FBWDtJQUNBLGNBQWMsUUFBUSxnQkFBUixDQUFkO0lBQ0EsZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsVUFBVSxRQUFRLFdBQVIsQ0FBVjtJQUNBLHdCQUF3QixRQUFRLDBCQUFSLENBQXhCO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDs7O0FBR0osSUFBSSxZQUFZLEtBQUssR0FBTDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtDaEIsSUFBSSxXQUFXLEtBQUssVUFBUyxJQUFULEVBQWUsVUFBZixFQUEyQjtBQUM3QyxlQUFhLFVBQUMsQ0FBVyxNQUFYLElBQXFCLENBQXJCLElBQTBCLFFBQVEsV0FBVyxDQUFYLENBQVIsQ0FBMUIsR0FDVixTQUFTLFdBQVcsQ0FBWCxDQUFULEVBQXdCLFVBQVUsWUFBVixDQUF4QixDQURTLEdBRVQsU0FBUyxZQUFZLFVBQVosRUFBd0IsQ0FBeEIsRUFBMkIscUJBQTNCLENBQVQsRUFBNEQsVUFBVSxZQUFWLENBQTVELENBRlMsQ0FEZ0M7O0FBSzdDLE1BQUksY0FBYyxXQUFXLE1BQVgsQ0FMMkI7QUFNN0MsU0FBTyxLQUFLLFVBQVMsSUFBVCxFQUFlO0FBQ3pCLFFBQUksUUFBUSxDQUFDLENBQUQ7UUFDUixTQUFTLFVBQVUsS0FBSyxNQUFMLEVBQWEsV0FBdkIsQ0FBVCxDQUZxQjs7QUFJekIsV0FBTyxFQUFFLEtBQUYsR0FBVSxNQUFWLEVBQWtCO0FBQ3ZCLFdBQUssS0FBTCxJQUFjLFdBQVcsS0FBWCxFQUFrQixJQUFsQixDQUF1QixJQUF2QixFQUE2QixLQUFLLEtBQUwsQ0FBN0IsQ0FBZCxDQUR1QjtLQUF6QjtBQUdBLFdBQU8sTUFBTSxJQUFOLEVBQVksSUFBWixFQUFrQixJQUFsQixDQUFQLENBUHlCO0dBQWYsQ0FBWixDQU42QztDQUEzQixDQUFoQjs7QUFpQkosT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6Im92ZXJBcmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcGx5ID0gcmVxdWlyZSgnLi9fYXBwbHknKSxcbiAgICBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgYmFzZUZsYXR0ZW4gPSByZXF1aXJlKCcuL19iYXNlRmxhdHRlbicpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0ZsYXR0ZW5hYmxlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19pc0ZsYXR0ZW5hYmxlSXRlcmF0ZWUnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGFyZ3VtZW50cyB0cmFuc2Zvcm1lZCBieVxuICogY29ycmVzcG9uZGluZyBgdHJhbnNmb3Jtc2AuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDQuMC4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHsuLi4oQXJyYXl8QXJyYXlbXXxGdW5jdGlvbnxGdW5jdGlvbltdfE9iamVjdHxPYmplY3RbXXxzdHJpbmd8c3RyaW5nW10pfVxuICogIFt0cmFuc2Zvcm1zW18uaWRlbnRpdHldXSBUaGUgZnVuY3Rpb25zIHRvIHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBkb3VibGVkKG4pIHtcbiAqICAgcmV0dXJuIG4gKiAyO1xuICogfVxuICpcbiAqIGZ1bmN0aW9uIHNxdWFyZShuKSB7XG4gKiAgIHJldHVybiBuICogbjtcbiAqIH1cbiAqXG4gKiB2YXIgZnVuYyA9IF8ub3ZlckFyZ3MoZnVuY3Rpb24oeCwgeSkge1xuICogICByZXR1cm4gW3gsIHldO1xuICogfSwgW3NxdWFyZSwgZG91YmxlZF0pO1xuICpcbiAqIGZ1bmMoOSwgMyk7XG4gKiAvLyA9PiBbODEsIDZdXG4gKlxuICogZnVuYygxMCwgNSk7XG4gKiAvLyA9PiBbMTAwLCAxMF1cbiAqL1xudmFyIG92ZXJBcmdzID0gcmVzdChmdW5jdGlvbihmdW5jLCB0cmFuc2Zvcm1zKSB7XG4gIHRyYW5zZm9ybXMgPSAodHJhbnNmb3Jtcy5sZW5ndGggPT0gMSAmJiBpc0FycmF5KHRyYW5zZm9ybXNbMF0pKVxuICAgID8gYXJyYXlNYXAodHJhbnNmb3Jtc1swXSwgYmFzZVVuYXJ5KGJhc2VJdGVyYXRlZSkpXG4gICAgOiBhcnJheU1hcChiYXNlRmxhdHRlbih0cmFuc2Zvcm1zLCAxLCBpc0ZsYXR0ZW5hYmxlSXRlcmF0ZWUpLCBiYXNlVW5hcnkoYmFzZUl0ZXJhdGVlKSk7XG5cbiAgdmFyIGZ1bmNzTGVuZ3RoID0gdHJhbnNmb3Jtcy5sZW5ndGg7XG4gIHJldHVybiByZXN0KGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWluKGFyZ3MubGVuZ3RoLCBmdW5jc0xlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJnc1tpbmRleF0gPSB0cmFuc2Zvcm1zW2luZGV4XS5jYWxsKHRoaXMsIGFyZ3NbaW5kZXhdKTtcbiAgICB9XG4gICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIGFyZ3MpO1xuICB9KTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJBcmdzO1xuIl19