'use strict';

var memoize = require('./memoize'),
    toString = require('./toString');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function (string) {
  var result = [];
  toString(string).replace(rePropName, function (match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
  });
  return result;
});

module.exports = stringToPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19zdHJpbmdUb1BhdGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsUUFBUSxXQUFSLENBQVY7SUFDQSxXQUFXLFFBQVEsWUFBUixDQUFYOzs7QUFHSixJQUFJLGFBQWEsMkZBQWI7OztBQUdKLElBQUksZUFBZSxVQUFmOzs7Ozs7Ozs7QUFTSixJQUFJLGVBQWUsUUFBUSxVQUFTLE1BQVQsRUFBaUI7QUFDMUMsTUFBSSxTQUFTLEVBQVQsQ0FEc0M7QUFFMUMsV0FBUyxNQUFULEVBQWlCLE9BQWpCLENBQXlCLFVBQXpCLEVBQXFDLFVBQVMsS0FBVCxFQUFnQixNQUFoQixFQUF3QixLQUF4QixFQUErQixNQUEvQixFQUF1QztBQUMxRSxXQUFPLElBQVAsQ0FBWSxRQUFRLE9BQU8sT0FBUCxDQUFlLFlBQWYsRUFBNkIsSUFBN0IsQ0FBUixHQUE4QyxVQUFVLEtBQVYsQ0FBMUQsQ0FEMEU7R0FBdkMsQ0FBckMsQ0FGMEM7QUFLMUMsU0FBTyxNQUFQLENBTDBDO0NBQWpCLENBQXZCOztBQVFKLE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJfc3RyaW5nVG9QYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG1lbW9pemUgPSByZXF1aXJlKCcuL21lbW9pemUnKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlUHJvcE5hbWUgPSAvW14uW1xcXV0rfFxcWyg/OigtP1xcZCsoPzpcXC5cXGQrKT8pfChbXCInXSkoKD86KD8hXFwyKVteXFxcXF18XFxcXC4pKj8pXFwyKVxcXXwoPz0oXFwufFxcW1xcXSkoPzpcXDR8JCkpL2c7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGJhY2tzbGFzaGVzIGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlRXNjYXBlQ2hhciA9IC9cXFxcKFxcXFwpPy9nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvIGEgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbnZhciBzdHJpbmdUb1BhdGggPSBtZW1vaXplKGZ1bmN0aW9uKHN0cmluZykge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHRvU3RyaW5nKHN0cmluZykucmVwbGFjZShyZVByb3BOYW1lLCBmdW5jdGlvbihtYXRjaCwgbnVtYmVyLCBxdW90ZSwgc3RyaW5nKSB7XG4gICAgcmVzdWx0LnB1c2gocXVvdGUgPyBzdHJpbmcucmVwbGFjZShyZUVzY2FwZUNoYXIsICckMScpIDogKG51bWJlciB8fCBtYXRjaCkpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZ1RvUGF0aDtcbiJdfQ==