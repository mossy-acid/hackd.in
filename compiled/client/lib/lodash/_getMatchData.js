'use strict';

var isStrictComparable = require('./_isStrictComparable'),
    keys = require('./keys');

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
    var result = keys(object),
        length = result.length;

    while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
}

module.exports = getMatchData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19nZXRNYXRjaERhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLHFCQUFxQixRQUFRLHVCQUFSLENBQXpCO0lBQ0ksT0FBTyxRQUFRLFFBQVIsQ0FEWDs7Ozs7Ozs7O0FBVUEsU0FBUyxZQUFULENBQXNCLE1BQXRCLEVBQThCO0FBQzVCLFFBQUksU0FBUyxLQUFLLE1BQUwsQ0FBYjtRQUNJLFNBQVMsT0FBTyxNQURwQjs7QUFHQSxXQUFPLFFBQVAsRUFBaUI7QUFDZixZQUFJLE1BQU0sT0FBTyxNQUFQLENBQVY7WUFDSSxRQUFRLE9BQU8sR0FBUCxDQURaOztBQUdBLGVBQU8sTUFBUCxJQUFpQixDQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWEsbUJBQW1CLEtBQW5CLENBQWIsQ0FBakI7QUFDRDtBQUNELFdBQU8sTUFBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJfZ2V0TWF0Y2hEYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGlzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX2lzU3RyaWN0Q29tcGFyYWJsZScpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBwcm9wZXJ0eSBuYW1lcywgdmFsdWVzLCBhbmQgY29tcGFyZSBmbGFncyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBtYXRjaCBkYXRhIG9mIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBnZXRNYXRjaERhdGEob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBrZXlzKG9iamVjdCksXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIHZhciBrZXkgPSByZXN1bHRbbGVuZ3RoXSxcbiAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XTtcblxuICAgIHJlc3VsdFtsZW5ndGhdID0gW2tleSwgdmFsdWUsIGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSldO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TWF0Y2hEYXRhO1xuIl19