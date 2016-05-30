'use strict';

var LazyWrapper = require('./_LazyWrapper'),
    LodashWrapper = require('./_LodashWrapper'),
    baseAt = require('./_baseAt'),
    baseFlatten = require('./_baseFlatten'),
    isIndex = require('./_isIndex'),
    rest = require('./rest'),
    thru = require('./thru');

/**
 * This method is the wrapper version of `_.at`.
 *
 * @name at
 * @memberOf _
 * @since 1.0.0
 * @category Seq
 * @param {...(string|string[])} [paths] The property paths of elements to pick.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
 *
 * _(object).at(['a[0].b.c', 'a[1]']).value();
 * // => [3, 4]
 */
var wrapperAt = rest(function (paths) {
  paths = baseFlatten(paths, 1);
  var length = paths.length,
      start = length ? paths[0] : 0,
      value = this.__wrapped__,
      interceptor = function interceptor(object) {
    return baseAt(object, paths);
  };

  if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
    return this.thru(interceptor);
  }
  value = value.slice(start, +start + (length ? 1 : 0));
  value.__actions__.push({
    'func': thru,
    'args': [interceptor],
    'thisArg': undefined
  });
  return new LodashWrapper(value, this.__chain__).thru(function (array) {
    if (length && !array.length) {
      array.push(undefined);
    }
    return array;
  });
});

module.exports = wrapperAt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3dyYXBwZXJBdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxRQUFRLGdCQUFSLENBQWxCO0lBQ0ksZ0JBQWdCLFFBQVEsa0JBQVIsQ0FEcEI7SUFFSSxTQUFTLFFBQVEsV0FBUixDQUZiO0lBR0ksY0FBYyxRQUFRLGdCQUFSLENBSGxCO0lBSUksVUFBVSxRQUFRLFlBQVIsQ0FKZDtJQUtJLE9BQU8sUUFBUSxRQUFSLENBTFg7SUFNSSxPQUFPLFFBQVEsUUFBUixDQU5YOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QkEsSUFBSSxZQUFZLEtBQUssVUFBUyxLQUFULEVBQWdCO0FBQ25DLFVBQVEsWUFBWSxLQUFaLEVBQW1CLENBQW5CLENBQVI7QUFDQSxNQUFJLFNBQVMsTUFBTSxNQUFuQjtNQUNJLFFBQVEsU0FBUyxNQUFNLENBQU4sQ0FBVCxHQUFvQixDQURoQztNQUVJLFFBQVEsS0FBSyxXQUZqQjtNQUdJLGNBQWMsU0FBZCxXQUFjLENBQVMsTUFBVCxFQUFpQjtBQUFFLFdBQU8sT0FBTyxNQUFQLEVBQWUsS0FBZixDQUFQO0FBQStCLEdBSHBFOztBQUtBLE1BQUksU0FBUyxDQUFULElBQWMsS0FBSyxXQUFMLENBQWlCLE1BQS9CLElBQ0EsRUFBRSxpQkFBaUIsV0FBbkIsQ0FEQSxJQUNtQyxDQUFDLFFBQVEsS0FBUixDQUR4QyxFQUN3RDtBQUN0RCxXQUFPLEtBQUssSUFBTCxDQUFVLFdBQVYsQ0FBUDtBQUNEO0FBQ0QsVUFBUSxNQUFNLEtBQU4sQ0FBWSxLQUFaLEVBQW1CLENBQUMsS0FBRCxJQUFVLFNBQVMsQ0FBVCxHQUFhLENBQXZCLENBQW5CLENBQVI7QUFDQSxRQUFNLFdBQU4sQ0FBa0IsSUFBbEIsQ0FBdUI7QUFDckIsWUFBUSxJQURhO0FBRXJCLFlBQVEsQ0FBQyxXQUFELENBRmE7QUFHckIsZUFBVztBQUhVLEdBQXZCO0FBS0EsU0FBTyxJQUFJLGFBQUosQ0FBa0IsS0FBbEIsRUFBeUIsS0FBSyxTQUE5QixFQUF5QyxJQUF6QyxDQUE4QyxVQUFTLEtBQVQsRUFBZ0I7QUFDbkUsUUFBSSxVQUFVLENBQUMsTUFBTSxNQUFyQixFQUE2QjtBQUMzQixZQUFNLElBQU4sQ0FBVyxTQUFYO0FBQ0Q7QUFDRCxXQUFPLEtBQVA7QUFDRCxHQUxNLENBQVA7QUFNRCxDQXZCZSxDQUFoQjs7QUF5QkEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6IndyYXBwZXJBdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBMYXp5V3JhcHBlciA9IHJlcXVpcmUoJy4vX0xhenlXcmFwcGVyJyksXG4gICAgTG9kYXNoV3JhcHBlciA9IHJlcXVpcmUoJy4vX0xvZGFzaFdyYXBwZXInKSxcbiAgICBiYXNlQXQgPSByZXF1aXJlKCcuL19iYXNlQXQnKSxcbiAgICBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0JyksXG4gICAgdGhydSA9IHJlcXVpcmUoJy4vdGhydScpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIHRoZSB3cmFwcGVyIHZlcnNpb24gb2YgYF8uYXRgLlxuICpcbiAqIEBuYW1lIGF0XG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDEuMC4wXG4gKiBAY2F0ZWdvcnkgU2VxXG4gKiBAcGFyYW0gey4uLihzdHJpbmd8c3RyaW5nW10pfSBbcGF0aHNdIFRoZSBwcm9wZXJ0eSBwYXRocyBvZiBlbGVtZW50cyB0byBwaWNrLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IGBsb2Rhc2hgIHdyYXBwZXIgaW5zdGFuY2UuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogW3sgJ2InOiB7ICdjJzogMyB9IH0sIDRdIH07XG4gKlxuICogXyhvYmplY3QpLmF0KFsnYVswXS5iLmMnLCAnYVsxXSddKS52YWx1ZSgpO1xuICogLy8gPT4gWzMsIDRdXG4gKi9cbnZhciB3cmFwcGVyQXQgPSByZXN0KGZ1bmN0aW9uKHBhdGhzKSB7XG4gIHBhdGhzID0gYmFzZUZsYXR0ZW4ocGF0aHMsIDEpO1xuICB2YXIgbGVuZ3RoID0gcGF0aHMubGVuZ3RoLFxuICAgICAgc3RhcnQgPSBsZW5ndGggPyBwYXRoc1swXSA6IDAsXG4gICAgICB2YWx1ZSA9IHRoaXMuX193cmFwcGVkX18sXG4gICAgICBpbnRlcmNlcHRvciA9IGZ1bmN0aW9uKG9iamVjdCkgeyByZXR1cm4gYmFzZUF0KG9iamVjdCwgcGF0aHMpOyB9O1xuXG4gIGlmIChsZW5ndGggPiAxIHx8IHRoaXMuX19hY3Rpb25zX18ubGVuZ3RoIHx8XG4gICAgICAhKHZhbHVlIGluc3RhbmNlb2YgTGF6eVdyYXBwZXIpIHx8ICFpc0luZGV4KHN0YXJ0KSkge1xuICAgIHJldHVybiB0aGlzLnRocnUoaW50ZXJjZXB0b3IpO1xuICB9XG4gIHZhbHVlID0gdmFsdWUuc2xpY2Uoc3RhcnQsICtzdGFydCArIChsZW5ndGggPyAxIDogMCkpO1xuICB2YWx1ZS5fX2FjdGlvbnNfXy5wdXNoKHtcbiAgICAnZnVuYyc6IHRocnUsXG4gICAgJ2FyZ3MnOiBbaW50ZXJjZXB0b3JdLFxuICAgICd0aGlzQXJnJzogdW5kZWZpbmVkXG4gIH0pO1xuICByZXR1cm4gbmV3IExvZGFzaFdyYXBwZXIodmFsdWUsIHRoaXMuX19jaGFpbl9fKS50aHJ1KGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgaWYgKGxlbmd0aCAmJiAhYXJyYXkubGVuZ3RoKSB7XG4gICAgICBhcnJheS5wdXNoKHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIHJldHVybiBhcnJheTtcbiAgfSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB3cmFwcGVyQXQ7XG4iXX0=