'use strict';

var baseHas = require('./_baseHas'),
    baseKeys = require('./_baseKeys'),
    indexKeys = require('./_indexKeys'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isPrototype = require('./_isPrototype');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  var isProto = isPrototype(object);
  if (!(isProto || isArrayLike(object))) {
    return baseKeys(object);
  }
  var indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  for (var key in object) {
    if (baseHas(object, key) && !(skipIndexes && (key == 'length' || isIndex(key, length))) && !(isProto && key == 'constructor')) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2tleXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsUUFBUSxZQUFSLENBQWQ7SUFDSSxXQUFXLFFBQVEsYUFBUixDQURmO0lBRUksWUFBWSxRQUFRLGNBQVIsQ0FGaEI7SUFHSSxjQUFjLFFBQVEsZUFBUixDQUhsQjtJQUlJLFVBQVUsUUFBUSxZQUFSLENBSmQ7SUFLSSxjQUFjLFFBQVEsZ0JBQVIsQ0FMbEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1DQSxTQUFTLElBQVQsQ0FBYyxNQUFkLEVBQXNCO0FBQ3BCLE1BQUksVUFBVSxZQUFZLE1BQVosQ0FBZDtBQUNBLE1BQUksRUFBRSxXQUFXLFlBQVksTUFBWixDQUFiLENBQUosRUFBdUM7QUFDckMsV0FBTyxTQUFTLE1BQVQsQ0FBUDtBQUNEO0FBQ0QsTUFBSSxVQUFVLFVBQVUsTUFBVixDQUFkO01BQ0ksY0FBYyxDQUFDLENBQUMsT0FEcEI7TUFFSSxTQUFTLFdBQVcsRUFGeEI7TUFHSSxTQUFTLE9BQU8sTUFIcEI7O0FBS0EsT0FBSyxJQUFJLEdBQVQsSUFBZ0IsTUFBaEIsRUFBd0I7QUFDdEIsUUFBSSxRQUFRLE1BQVIsRUFBZ0IsR0FBaEIsS0FDQSxFQUFFLGdCQUFnQixPQUFPLFFBQVAsSUFBbUIsUUFBUSxHQUFSLEVBQWEsTUFBYixDQUFuQyxDQUFGLENBREEsSUFFQSxFQUFFLFdBQVcsT0FBTyxhQUFwQixDQUZKLEVBRXdDO0FBQ3RDLGFBQU8sSUFBUCxDQUFZLEdBQVo7QUFDRDtBQUNGO0FBQ0QsU0FBTyxNQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6ImtleXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUhhcyA9IHJlcXVpcmUoJy4vX2Jhc2VIYXMnKSxcbiAgICBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgaW5kZXhLZXlzID0gcmVxdWlyZSgnLi9faW5kZXhLZXlzJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgdmFyIGlzUHJvdG8gPSBpc1Byb3RvdHlwZShvYmplY3QpO1xuICBpZiAoIShpc1Byb3RvIHx8IGlzQXJyYXlMaWtlKG9iamVjdCkpKSB7XG4gICAgcmV0dXJuIGJhc2VLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIGluZGV4ZXMgPSBpbmRleEtleXMob2JqZWN0KSxcbiAgICAgIHNraXBJbmRleGVzID0gISFpbmRleGVzLFxuICAgICAgcmVzdWx0ID0gaW5kZXhlcyB8fCBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmIChiYXNlSGFzKG9iamVjdCwga2V5KSAmJlxuICAgICAgICAhKHNraXBJbmRleGVzICYmIChrZXkgPT0gJ2xlbmd0aCcgfHwgaXNJbmRleChrZXksIGxlbmd0aCkpKSAmJlxuICAgICAgICAhKGlzUHJvdG8gJiYga2V5ID09ICdjb25zdHJ1Y3RvcicpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iXX0=