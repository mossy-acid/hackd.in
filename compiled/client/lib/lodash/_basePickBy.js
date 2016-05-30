'use strict';

var getAllKeysIn = require('./_getAllKeysIn');

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, predicate) {
  var index = -1,
      props = getAllKeysIn(object),
      length = props.length,
      result = {};

  while (++index < length) {
    var key = props[index],
        value = object[key];

    if (predicate(value, key)) {
      result[key] = value;
    }
  }
  return result;
}

module.exports = basePickBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlUGlja0J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxlQUFlLFFBQVEsaUJBQVIsQ0FBbkI7Ozs7Ozs7Ozs7QUFVQSxTQUFTLFVBQVQsQ0FBb0IsTUFBcEIsRUFBNEIsU0FBNUIsRUFBdUM7QUFDckMsTUFBSSxRQUFRLENBQUMsQ0FBYjtNQUNJLFFBQVEsYUFBYSxNQUFiLENBRFo7TUFFSSxTQUFTLE1BQU0sTUFGbkI7TUFHSSxTQUFTLEVBSGI7O0FBS0EsU0FBTyxFQUFFLEtBQUYsR0FBVSxNQUFqQixFQUF5QjtBQUN2QixRQUFJLE1BQU0sTUFBTSxLQUFOLENBQVY7UUFDSSxRQUFRLE9BQU8sR0FBUCxDQURaOztBQUdBLFFBQUksVUFBVSxLQUFWLEVBQWlCLEdBQWpCLENBQUosRUFBMkI7QUFDekIsYUFBTyxHQUFQLElBQWMsS0FBZDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLE1BQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoiX2Jhc2VQaWNrQnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ2V0QWxsS2V5c0luID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5c0luJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgIGBfLnBpY2tCeWAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBwcm9wZXJ0eS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGJhc2VQaWNrQnkob2JqZWN0LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBwcm9wcyA9IGdldEFsbEtleXNJbihvYmplY3QpLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0ge307XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdLFxuICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuXG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwga2V5KSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUGlja0J5O1xuIl19