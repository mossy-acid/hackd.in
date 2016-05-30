'use strict';

var get = require('./get');

/**
 * The base implementation of `_.at` without support for individual paths.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {string[]} paths The property paths of elements to pick.
 * @returns {Array} Returns the picked elements.
 */
function baseAt(object, paths) {
  var index = -1,
      isNil = object == null,
      length = paths.length,
      result = Array(length);

  while (++index < length) {
    result[index] = isNil ? undefined : get(object, paths[index]);
  }
  return result;
}

module.exports = baseAt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlQXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE1BQU0sUUFBUSxPQUFSLENBQVY7Ozs7Ozs7Ozs7QUFVQSxTQUFTLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0IsS0FBeEIsRUFBK0I7QUFDN0IsTUFBSSxRQUFRLENBQUMsQ0FBYjtNQUNJLFFBQVEsVUFBVSxJQUR0QjtNQUVJLFNBQVMsTUFBTSxNQUZuQjtNQUdJLFNBQVMsTUFBTSxNQUFOLENBSGI7O0FBS0EsU0FBTyxFQUFFLEtBQUYsR0FBVSxNQUFqQixFQUF5QjtBQUN2QixXQUFPLEtBQVAsSUFBZ0IsUUFBUSxTQUFSLEdBQW9CLElBQUksTUFBSixFQUFZLE1BQU0sS0FBTixDQUFaLENBQXBDO0FBQ0Q7QUFDRCxTQUFPLE1BQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsTUFBakIiLCJmaWxlIjoiX2Jhc2VBdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBnZXQgPSByZXF1aXJlKCcuL2dldCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmF0YCB3aXRob3V0IHN1cHBvcnQgZm9yIGluZGl2aWR1YWwgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXRocyBUaGUgcHJvcGVydHkgcGF0aHMgb2YgZWxlbWVudHMgdG8gcGljay5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgcGlja2VkIGVsZW1lbnRzLlxuICovXG5mdW5jdGlvbiBiYXNlQXQob2JqZWN0LCBwYXRocykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGlzTmlsID0gb2JqZWN0ID09IG51bGwsXG4gICAgICBsZW5ndGggPSBwYXRocy5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGlzTmlsID8gdW5kZWZpbmVkIDogZ2V0KG9iamVjdCwgcGF0aHNbaW5kZXhdKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBdDtcbiJdfQ==