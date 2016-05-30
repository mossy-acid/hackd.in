'use strict';

var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneMap = require('./_cloneMap'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSet = require('./_cloneSet'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag:case float64Tag:
    case int8Tag:case int16Tag:case int32Tag:
    case uint8Tag:case uint8ClampedTag:case uint16Tag:case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19pbml0Q2xvbmVCeVRhZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksbUJBQW1CLFFBQVEscUJBQVIsQ0FBdkI7SUFDSSxnQkFBZ0IsUUFBUSxrQkFBUixDQURwQjtJQUVJLFdBQVcsUUFBUSxhQUFSLENBRmY7SUFHSSxjQUFjLFFBQVEsZ0JBQVIsQ0FIbEI7SUFJSSxXQUFXLFFBQVEsYUFBUixDQUpmO0lBS0ksY0FBYyxRQUFRLGdCQUFSLENBTGxCO0lBTUksa0JBQWtCLFFBQVEsb0JBQVIsQ0FOdEI7OztBQVNBLElBQUksVUFBVSxrQkFBZDtJQUNJLFVBQVUsZUFEZDtJQUVJLFNBQVMsY0FGYjtJQUdJLFlBQVksaUJBSGhCO0lBSUksWUFBWSxpQkFKaEI7SUFLSSxTQUFTLGNBTGI7SUFNSSxZQUFZLGlCQU5oQjtJQU9JLFlBQVksaUJBUGhCOztBQVNBLElBQUksaUJBQWlCLHNCQUFyQjtJQUNJLGNBQWMsbUJBRGxCO0lBRUksYUFBYSx1QkFGakI7SUFHSSxhQUFhLHVCQUhqQjtJQUlJLFVBQVUsb0JBSmQ7SUFLSSxXQUFXLHFCQUxmO0lBTUksV0FBVyxxQkFOZjtJQU9JLFdBQVcscUJBUGY7SUFRSSxrQkFBa0IsNEJBUnRCO0lBU0ksWUFBWSxzQkFUaEI7SUFVSSxZQUFZLHNCQVZoQjs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLFNBQVMsY0FBVCxDQUF3QixNQUF4QixFQUFnQyxHQUFoQyxFQUFxQyxTQUFyQyxFQUFnRCxNQUFoRCxFQUF3RDtBQUN0RCxNQUFJLE9BQU8sT0FBTyxXQUFsQjtBQUNBLFVBQVEsR0FBUjtBQUNFLFNBQUssY0FBTDtBQUNFLGFBQU8saUJBQWlCLE1BQWpCLENBQVA7O0FBRUYsU0FBSyxPQUFMO0FBQ0EsU0FBSyxPQUFMO0FBQ0UsYUFBTyxJQUFJLElBQUosQ0FBUyxDQUFDLE1BQVYsQ0FBUDs7QUFFRixTQUFLLFdBQUw7QUFDRSxhQUFPLGNBQWMsTUFBZCxFQUFzQixNQUF0QixDQUFQOztBQUVGLFNBQUssVUFBTCxDQUFpQixLQUFLLFVBQUw7QUFDakIsU0FBSyxPQUFMLENBQWMsS0FBSyxRQUFMLENBQWUsS0FBSyxRQUFMO0FBQzdCLFNBQUssUUFBTCxDQUFlLEtBQUssZUFBTCxDQUFzQixLQUFLLFNBQUwsQ0FBZ0IsS0FBSyxTQUFMO0FBQ25ELGFBQU8sZ0JBQWdCLE1BQWhCLEVBQXdCLE1BQXhCLENBQVA7O0FBRUYsU0FBSyxNQUFMO0FBQ0UsYUFBTyxTQUFTLE1BQVQsRUFBaUIsTUFBakIsRUFBeUIsU0FBekIsQ0FBUDs7QUFFRixTQUFLLFNBQUw7QUFDQSxTQUFLLFNBQUw7QUFDRSxhQUFPLElBQUksSUFBSixDQUFTLE1BQVQsQ0FBUDs7QUFFRixTQUFLLFNBQUw7QUFDRSxhQUFPLFlBQVksTUFBWixDQUFQOztBQUVGLFNBQUssTUFBTDtBQUNFLGFBQU8sU0FBUyxNQUFULEVBQWlCLE1BQWpCLEVBQXlCLFNBQXpCLENBQVA7O0FBRUYsU0FBSyxTQUFMO0FBQ0UsYUFBTyxZQUFZLE1BQVosQ0FBUDtBQTlCSjtBQWdDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsY0FBakIiLCJmaWxlIjoiX2luaXRDbG9uZUJ5VGFnLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyksXG4gICAgY2xvbmVEYXRhVmlldyA9IHJlcXVpcmUoJy4vX2Nsb25lRGF0YVZpZXcnKSxcbiAgICBjbG9uZU1hcCA9IHJlcXVpcmUoJy4vX2Nsb25lTWFwJyksXG4gICAgY2xvbmVSZWdFeHAgPSByZXF1aXJlKCcuL19jbG9uZVJlZ0V4cCcpLFxuICAgIGNsb25lU2V0ID0gcmVxdWlyZSgnLi9fY2xvbmVTZXQnKSxcbiAgICBjbG9uZVN5bWJvbCA9IHJlcXVpcmUoJy4vX2Nsb25lU3ltYm9sJyksXG4gICAgY2xvbmVUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9fY2xvbmVUeXBlZEFycmF5Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZSBiYXNlZCBvbiBpdHMgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNsb25pbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNsb25lRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2xvbmUgdmFsdWVzLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVCeVRhZyhvYmplY3QsIHRhZywgY2xvbmVGdW5jLCBpc0RlZXApIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIHJldHVybiBjbG9uZUFycmF5QnVmZmVyKG9iamVjdCk7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKCtvYmplY3QpO1xuXG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIHJldHVybiBjbG9uZURhdGFWaWV3KG9iamVjdCwgaXNEZWVwKTtcblxuICAgIGNhc2UgZmxvYXQzMlRhZzogY2FzZSBmbG9hdDY0VGFnOlxuICAgIGNhc2UgaW50OFRhZzogY2FzZSBpbnQxNlRhZzogY2FzZSBpbnQzMlRhZzpcbiAgICBjYXNlIHVpbnQ4VGFnOiBjYXNlIHVpbnQ4Q2xhbXBlZFRhZzogY2FzZSB1aW50MTZUYWc6IGNhc2UgdWludDMyVGFnOlxuICAgICAgcmV0dXJuIGNsb25lVHlwZWRBcnJheShvYmplY3QsIGlzRGVlcCk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHJldHVybiBjbG9uZU1hcChvYmplY3QsIGlzRGVlcCwgY2xvbmVGdW5jKTtcblxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKG9iamVjdCk7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVJlZ0V4cChvYmplY3QpO1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICByZXR1cm4gY2xvbmVTZXQob2JqZWN0LCBpc0RlZXAsIGNsb25lRnVuYyk7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVN5bWJvbChvYmplY3QpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQnlUYWc7XG4iXX0=