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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19zdHJpbmdUb1BhdGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsUUFBUSxXQUFSLENBQWQ7SUFDSSxXQUFXLFFBQVEsWUFBUixDQURmOzs7QUFJQSxJQUFJLGFBQWEsMkZBQWpCOzs7QUFHQSxJQUFJLGVBQWUsVUFBbkI7Ozs7Ozs7OztBQVNBLElBQUksZUFBZSxRQUFRLFVBQVMsTUFBVCxFQUFpQjtBQUMxQyxNQUFJLFNBQVMsRUFBYjtBQUNBLFdBQVMsTUFBVCxFQUFpQixPQUFqQixDQUF5QixVQUF6QixFQUFxQyxVQUFTLEtBQVQsRUFBZ0IsTUFBaEIsRUFBd0IsS0FBeEIsRUFBK0IsTUFBL0IsRUFBdUM7QUFDMUUsV0FBTyxJQUFQLENBQVksUUFBUSxPQUFPLE9BQVAsQ0FBZSxZQUFmLEVBQTZCLElBQTdCLENBQVIsR0FBOEMsVUFBVSxLQUFwRTtBQUNELEdBRkQ7QUFHQSxTQUFPLE1BQVA7QUFDRCxDQU5rQixDQUFuQjs7QUFRQSxPQUFPLE9BQVAsR0FBaUIsWUFBakIiLCJmaWxlIjoiX3N0cmluZ1RvUGF0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBtZW1vaXplID0gcmVxdWlyZSgnLi9tZW1vaXplJyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZVByb3BOYW1lID0gL1teLltcXF1dK3xcXFsoPzooLT9cXGQrKD86XFwuXFxkKyk/KXwoW1wiJ10pKCg/Oig/IVxcMilbXlxcXFxdfFxcXFwuKSo/KVxcMilcXF18KD89KFxcLnxcXFtcXF0pKD86XFw0fCQpKS9nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBiYWNrc2xhc2hlcyBpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUVzY2FwZUNoYXIgPSAvXFxcXChcXFxcKT8vZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgc3RyaW5nYCB0byBhIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG52YXIgc3RyaW5nVG9QYXRoID0gbWVtb2l6ZShmdW5jdGlvbihzdHJpbmcpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB0b1N0cmluZyhzdHJpbmcpLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdUb1BhdGg7XG4iXX0=