'use strict';

var assignValue = require('./_assignValue'),
    castPath = require('./_castPath'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
    isObject = require('./isObject'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]);
    if (isObject(nested)) {
      var newValue = value;
      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : undefined;
        if (newValue === undefined) {
          newValue = objValue == null ? isIndex(path[index + 1]) ? [] : {} : objValue;
        }
      }
      assignValue(nested, key, newValue);
    }
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlU2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7SUFDSSxXQUFXLFFBQVEsYUFBUixDQURmO0lBRUksVUFBVSxRQUFRLFlBQVIsQ0FGZDtJQUdJLFFBQVEsUUFBUSxVQUFSLENBSFo7SUFJSSxXQUFXLFFBQVEsWUFBUixDQUpmO0lBS0ksUUFBUSxRQUFRLFVBQVIsQ0FMWjs7Ozs7Ozs7Ozs7O0FBaUJBLFNBQVMsT0FBVCxDQUFpQixNQUFqQixFQUF5QixJQUF6QixFQUErQixLQUEvQixFQUFzQyxVQUF0QyxFQUFrRDtBQUNoRCxTQUFPLE1BQU0sSUFBTixFQUFZLE1BQVosSUFBc0IsQ0FBQyxJQUFELENBQXRCLEdBQStCLFNBQVMsSUFBVCxDQUF0Qzs7QUFFQSxNQUFJLFFBQVEsQ0FBQyxDQUFiO01BQ0ksU0FBUyxLQUFLLE1BRGxCO01BRUksWUFBWSxTQUFTLENBRnpCO01BR0ksU0FBUyxNQUhiOztBQUtBLFNBQU8sVUFBVSxJQUFWLElBQWtCLEVBQUUsS0FBRixHQUFVLE1BQW5DLEVBQTJDO0FBQ3pDLFFBQUksTUFBTSxNQUFNLEtBQUssS0FBTCxDQUFOLENBQVY7QUFDQSxRQUFJLFNBQVMsTUFBVCxDQUFKLEVBQXNCO0FBQ3BCLFVBQUksV0FBVyxLQUFmO0FBQ0EsVUFBSSxTQUFTLFNBQWIsRUFBd0I7QUFDdEIsWUFBSSxXQUFXLE9BQU8sR0FBUCxDQUFmO0FBQ0EsbUJBQVcsYUFBYSxXQUFXLFFBQVgsRUFBcUIsR0FBckIsRUFBMEIsTUFBMUIsQ0FBYixHQUFpRCxTQUE1RDtBQUNBLFlBQUksYUFBYSxTQUFqQixFQUE0QjtBQUMxQixxQkFBVyxZQUFZLElBQVosR0FDTixRQUFRLEtBQUssUUFBUSxDQUFiLENBQVIsSUFBMkIsRUFBM0IsR0FBZ0MsRUFEMUIsR0FFUCxRQUZKO0FBR0Q7QUFDRjtBQUNELGtCQUFZLE1BQVosRUFBb0IsR0FBcEIsRUFBeUIsUUFBekI7QUFDRDtBQUNELGFBQVMsT0FBTyxHQUFQLENBQVQ7QUFDRDtBQUNELFNBQU8sTUFBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJfYmFzZVNldC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zZXRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgcGF0aCBjcmVhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VTZXQob2JqZWN0LCBwYXRoLCB2YWx1ZSwgY3VzdG9taXplcikge1xuICBwYXRoID0gaXNLZXkocGF0aCwgb2JqZWN0KSA/IFtwYXRoXSA6IGNhc3RQYXRoKHBhdGgpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICBsYXN0SW5kZXggPSBsZW5ndGggLSAxLFxuICAgICAgbmVzdGVkID0gb2JqZWN0O1xuXG4gIHdoaWxlIChuZXN0ZWQgIT0gbnVsbCAmJiArK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHRvS2V5KHBhdGhbaW5kZXhdKTtcbiAgICBpZiAoaXNPYmplY3QobmVzdGVkKSkge1xuICAgICAgdmFyIG5ld1ZhbHVlID0gdmFsdWU7XG4gICAgICBpZiAoaW5kZXggIT0gbGFzdEluZGV4KSB7XG4gICAgICAgIHZhciBvYmpWYWx1ZSA9IG5lc3RlZFtrZXldO1xuICAgICAgICBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXIgPyBjdXN0b21pemVyKG9ialZhbHVlLCBrZXksIG5lc3RlZCkgOiB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBvYmpWYWx1ZSA9PSBudWxsXG4gICAgICAgICAgICA/IChpc0luZGV4KHBhdGhbaW5kZXggKyAxXSkgPyBbXSA6IHt9KVxuICAgICAgICAgICAgOiBvYmpWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYXNzaWduVmFsdWUobmVzdGVkLCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9XG4gICAgbmVzdGVkID0gbmVzdGVkW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU2V0O1xuIl19