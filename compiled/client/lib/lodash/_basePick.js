'use strict';

var arrayReduce = require('./_arrayReduce');

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} props The property identifiers to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, props) {
  object = Object(object);
  return arrayReduce(props, function (result, key) {
    if (key in object) {
      result[key] = object[key];
    }
    return result;
  }, {});
}

module.exports = basePick;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlUGljay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxRQUFRLGdCQUFSLENBQWxCOzs7Ozs7Ozs7OztBQVdBLFNBQVMsUUFBVCxDQUFrQixNQUFsQixFQUEwQixLQUExQixFQUFpQztBQUMvQixXQUFTLE9BQU8sTUFBUCxDQUFUO0FBQ0EsU0FBTyxZQUFZLEtBQVosRUFBbUIsVUFBUyxNQUFULEVBQWlCLEdBQWpCLEVBQXNCO0FBQzlDLFFBQUksT0FBTyxNQUFYLEVBQW1CO0FBQ2pCLGFBQU8sR0FBUCxJQUFjLE9BQU8sR0FBUCxDQUFkO0FBQ0Q7QUFDRCxXQUFPLE1BQVA7QUFDRCxHQUxNLEVBS0osRUFMSSxDQUFQO0FBTUQ7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6Il9iYXNlUGljay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcnJheVJlZHVjZSA9IHJlcXVpcmUoJy4vX2FycmF5UmVkdWNlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucGlja2Agd2l0aG91dCBzdXBwb3J0IGZvciBpbmRpdmlkdWFsXG4gKiBwcm9wZXJ0eSBpZGVudGlmaWVycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBwaWNrLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gYmFzZVBpY2sob2JqZWN0LCBwcm9wcykge1xuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGFycmF5UmVkdWNlKHByb3BzLCBmdW5jdGlvbihyZXN1bHQsIGtleSkge1xuICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICByZXN1bHRba2V5XSA9IG9iamVjdFtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LCB7fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVBpY2s7XG4iXX0=