'use strict';

var baseRandom = require('./_baseRandom'),
    isArrayLike = require('./isArrayLike'),
    values = require('./values');

/**
 * Gets a random element from `collection`.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to sample.
 * @returns {*} Returns the random element.
 * @example
 *
 * _.sample([1, 2, 3, 4]);
 * // => 2
 */
function sample(collection) {
    var array = isArrayLike(collection) ? collection : values(collection),
        length = array.length;

    return length > 0 ? array[baseRandom(0, length - 1)] : undefined;
}

module.exports = sample;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3NhbXBsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGVBQVIsQ0FBakI7SUFDSSxjQUFjLFFBQVEsZUFBUixDQURsQjtJQUVJLFNBQVMsUUFBUSxVQUFSLENBRmI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsU0FBUyxNQUFULENBQWdCLFVBQWhCLEVBQTRCO0FBQzFCLFFBQUksUUFBUSxZQUFZLFVBQVosSUFBMEIsVUFBMUIsR0FBdUMsT0FBTyxVQUFQLENBQW5EO1FBQ0ksU0FBUyxNQUFNLE1BRG5COztBQUdBLFdBQU8sU0FBUyxDQUFULEdBQWEsTUFBTSxXQUFXLENBQVgsRUFBYyxTQUFTLENBQXZCLENBQU4sQ0FBYixHQUFnRCxTQUF2RDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJzYW1wbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYmFzZVJhbmRvbSA9IHJlcXVpcmUoJy4vX2Jhc2VSYW5kb20nKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICB2YWx1ZXMgPSByZXF1aXJlKCcuL3ZhbHVlcycpO1xuXG4vKipcbiAqIEdldHMgYSByYW5kb20gZWxlbWVudCBmcm9tIGBjb2xsZWN0aW9uYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuMC4wXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gc2FtcGxlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJhbmRvbSBlbGVtZW50LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnNhbXBsZShbMSwgMiwgMywgNF0pO1xuICogLy8gPT4gMlxuICovXG5mdW5jdGlvbiBzYW1wbGUoY29sbGVjdGlvbikge1xuICB2YXIgYXJyYXkgPSBpc0FycmF5TGlrZShjb2xsZWN0aW9uKSA/IGNvbGxlY3Rpb24gOiB2YWx1ZXMoY29sbGVjdGlvbiksXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgcmV0dXJuIGxlbmd0aCA+IDAgPyBhcnJheVtiYXNlUmFuZG9tKDAsIGxlbmd0aCAtIDEpXSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzYW1wbGU7XG4iXX0=