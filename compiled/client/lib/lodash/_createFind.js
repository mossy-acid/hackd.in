'use strict';

var baseIteratee = require('./_baseIteratee'),
    isArrayLike = require('./isArrayLike'),
    keys = require('./keys');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function (collection, predicate, fromIndex) {
    var iterable = Object(collection);
    predicate = baseIteratee(predicate, 3);
    if (!isArrayLike(collection)) {
      var props = keys(collection);
    }
    var index = findIndexFunc(props || collection, function (value, key) {
      if (props) {
        key = value;
        value = iterable[key];
      }
      return predicate(value, key, iterable);
    }, fromIndex);
    return index > -1 ? collection[props ? props[index] : index] : undefined;
  };
}

module.exports = createFind;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVGaW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxlQUFlLFFBQVEsaUJBQVIsQ0FBZjtJQUNBLGNBQWMsUUFBUSxlQUFSLENBQWQ7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQOzs7Ozs7Ozs7QUFTSixTQUFTLFVBQVQsQ0FBb0IsYUFBcEIsRUFBbUM7QUFDakMsU0FBTyxVQUFTLFVBQVQsRUFBcUIsU0FBckIsRUFBZ0MsU0FBaEMsRUFBMkM7QUFDaEQsUUFBSSxXQUFXLE9BQU8sVUFBUCxDQUFYLENBRDRDO0FBRWhELGdCQUFZLGFBQWEsU0FBYixFQUF3QixDQUF4QixDQUFaLENBRmdEO0FBR2hELFFBQUksQ0FBQyxZQUFZLFVBQVosQ0FBRCxFQUEwQjtBQUM1QixVQUFJLFFBQVEsS0FBSyxVQUFMLENBQVIsQ0FEd0I7S0FBOUI7QUFHQSxRQUFJLFFBQVEsY0FBYyxTQUFTLFVBQVQsRUFBcUIsVUFBUyxLQUFULEVBQWdCLEdBQWhCLEVBQXFCO0FBQ2xFLFVBQUksS0FBSixFQUFXO0FBQ1QsY0FBTSxLQUFOLENBRFM7QUFFVCxnQkFBUSxTQUFTLEdBQVQsQ0FBUixDQUZTO09BQVg7QUFJQSxhQUFPLFVBQVUsS0FBVixFQUFpQixHQUFqQixFQUFzQixRQUF0QixDQUFQLENBTGtFO0tBQXJCLEVBTTVDLFNBTlMsQ0FBUixDQU40QztBQWFoRCxXQUFPLFFBQVEsQ0FBQyxDQUFELEdBQUssV0FBVyxRQUFRLE1BQU0sS0FBTixDQUFSLEdBQXVCLEtBQXZCLENBQXhCLEdBQXdELFNBQXhELENBYnlDO0dBQTNDLENBRDBCO0NBQW5DOztBQWtCQSxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoiX2NyZWF0ZUZpbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgXy5maW5kYCBvciBgXy5maW5kTGFzdGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZpbmRJbmRleEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGZpbmQgdGhlIGNvbGxlY3Rpb24gaW5kZXguXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmaW5kIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVGaW5kKGZpbmRJbmRleEZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSwgZnJvbUluZGV4KSB7XG4gICAgdmFyIGl0ZXJhYmxlID0gT2JqZWN0KGNvbGxlY3Rpb24pO1xuICAgIHByZWRpY2F0ZSA9IGJhc2VJdGVyYXRlZShwcmVkaWNhdGUsIDMpO1xuICAgIGlmICghaXNBcnJheUxpa2UoY29sbGVjdGlvbikpIHtcbiAgICAgIHZhciBwcm9wcyA9IGtleXMoY29sbGVjdGlvbik7XG4gICAgfVxuICAgIHZhciBpbmRleCA9IGZpbmRJbmRleEZ1bmMocHJvcHMgfHwgY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgaWYgKHByb3BzKSB7XG4gICAgICAgIGtleSA9IHZhbHVlO1xuICAgICAgICB2YWx1ZSA9IGl0ZXJhYmxlW2tleV07XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJlZGljYXRlKHZhbHVlLCBrZXksIGl0ZXJhYmxlKTtcbiAgICB9LCBmcm9tSW5kZXgpO1xuICAgIHJldHVybiBpbmRleCA+IC0xID8gY29sbGVjdGlvbltwcm9wcyA/IHByb3BzW2luZGV4XSA6IGluZGV4XSA6IHVuZGVmaW5lZDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVGaW5kO1xuIl19