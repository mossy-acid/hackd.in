'use strict';

var arrayMap = require('./_arrayMap'),
    baseIntersection = require('./_baseIntersection'),
    castArrayLikeObject = require('./_castArrayLikeObject'),
    last = require('./last'),
    rest = require('./rest');

/**
 * This method is like `_.intersection` except that it accepts `comparator`
 * which is invoked to compare elements of `arrays`. Result values are chosen
 * from the first array. The comparator is invoked with two arguments:
 * (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.intersectionWith(objects, others, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }]
 */
var intersectionWith = rest(function (arrays) {
  var comparator = last(arrays),
      mapped = arrayMap(arrays, castArrayLikeObject);

  if (comparator === last(mapped)) {
    comparator = undefined;
  } else {
    mapped.pop();
  }
  return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined, comparator) : [];
});

module.exports = intersectionWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ludGVyc2VjdGlvbldpdGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFdBQVcsUUFBUSxhQUFSLENBQVg7SUFDQSxtQkFBbUIsUUFBUSxxQkFBUixDQUFuQjtJQUNBLHNCQUFzQixRQUFRLHdCQUFSLENBQXRCO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDtJQUNBLE9BQU8sUUFBUSxRQUFSLENBQVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJKLElBQUksbUJBQW1CLEtBQUssVUFBUyxNQUFULEVBQWlCO0FBQzNDLE1BQUksYUFBYSxLQUFLLE1BQUwsQ0FBYjtNQUNBLFNBQVMsU0FBUyxNQUFULEVBQWlCLG1CQUFqQixDQUFULENBRnVDOztBQUkzQyxNQUFJLGVBQWUsS0FBSyxNQUFMLENBQWYsRUFBNkI7QUFDL0IsaUJBQWEsU0FBYixDQUQrQjtHQUFqQyxNQUVPO0FBQ0wsV0FBTyxHQUFQLEdBREs7R0FGUDtBQUtBLFNBQU8sTUFBQyxDQUFPLE1BQVAsSUFBaUIsT0FBTyxDQUFQLE1BQWMsT0FBTyxDQUFQLENBQWQsR0FDckIsaUJBQWlCLE1BQWpCLEVBQXlCLFNBQXpCLEVBQW9DLFVBQXBDLENBREcsR0FFSCxFQUZHLENBVG9DO0NBQWpCLENBQXhCOztBQWNKLE9BQU8sT0FBUCxHQUFpQixnQkFBakIiLCJmaWxlIjoiaW50ZXJzZWN0aW9uV2l0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgYmFzZUludGVyc2VjdGlvbiA9IHJlcXVpcmUoJy4vX2Jhc2VJbnRlcnNlY3Rpb24nKSxcbiAgICBjYXN0QXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi9fY2FzdEFycmF5TGlrZU9iamVjdCcpLFxuICAgIGxhc3QgPSByZXF1aXJlKCcuL2xhc3QnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pbnRlcnNlY3Rpb25gIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYGNvbXBhcmF0b3JgXG4gKiB3aGljaCBpcyBpbnZva2VkIHRvIGNvbXBhcmUgZWxlbWVudHMgb2YgYGFycmF5c2AuIFJlc3VsdCB2YWx1ZXMgYXJlIGNob3NlblxuICogZnJvbSB0aGUgZmlyc3QgYXJyYXkuIFRoZSBjb21wYXJhdG9yIGlzIGludm9rZWQgd2l0aCB0d28gYXJndW1lbnRzOlxuICogKGFyclZhbCwgb3RoVmFsKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7Li4uQXJyYXl9IFthcnJheXNdIFRoZSBhcnJheXMgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJhdG9yXSBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgaW50ZXJzZWN0aW5nIHZhbHVlcy5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBbeyAneCc6IDEsICd5JzogMiB9LCB7ICd4JzogMiwgJ3knOiAxIH1dO1xuICogdmFyIG90aGVycyA9IFt7ICd4JzogMSwgJ3knOiAxIH0sIHsgJ3gnOiAxLCAneSc6IDIgfV07XG4gKlxuICogXy5pbnRlcnNlY3Rpb25XaXRoKG9iamVjdHMsIG90aGVycywgXy5pc0VxdWFsKTtcbiAqIC8vID0+IFt7ICd4JzogMSwgJ3knOiAyIH1dXG4gKi9cbnZhciBpbnRlcnNlY3Rpb25XaXRoID0gcmVzdChmdW5jdGlvbihhcnJheXMpIHtcbiAgdmFyIGNvbXBhcmF0b3IgPSBsYXN0KGFycmF5cyksXG4gICAgICBtYXBwZWQgPSBhcnJheU1hcChhcnJheXMsIGNhc3RBcnJheUxpa2VPYmplY3QpO1xuXG4gIGlmIChjb21wYXJhdG9yID09PSBsYXN0KG1hcHBlZCkpIHtcbiAgICBjb21wYXJhdG9yID0gdW5kZWZpbmVkO1xuICB9IGVsc2Uge1xuICAgIG1hcHBlZC5wb3AoKTtcbiAgfVxuICByZXR1cm4gKG1hcHBlZC5sZW5ndGggJiYgbWFwcGVkWzBdID09PSBhcnJheXNbMF0pXG4gICAgPyBiYXNlSW50ZXJzZWN0aW9uKG1hcHBlZCwgdW5kZWZpbmVkLCBjb21wYXJhdG9yKVxuICAgIDogW107XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnRlcnNlY3Rpb25XaXRoO1xuIl19