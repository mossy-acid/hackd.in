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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19nZXRNYXRjaERhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLHFCQUFxQixRQUFRLHVCQUFSLENBQXJCO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDs7Ozs7Ozs7O0FBU0osU0FBUyxZQUFULENBQXNCLE1BQXRCLEVBQThCO0FBQzVCLFFBQUksU0FBUyxLQUFLLE1BQUwsQ0FBVDtRQUNBLFNBQVMsT0FBTyxNQUFQLENBRmU7O0FBSTVCLFdBQU8sUUFBUCxFQUFpQjtBQUNmLFlBQUksTUFBTSxPQUFPLE1BQVAsQ0FBTjtZQUNBLFFBQVEsT0FBTyxHQUFQLENBQVIsQ0FGVzs7QUFJZixlQUFPLE1BQVAsSUFBaUIsQ0FBQyxHQUFELEVBQU0sS0FBTixFQUFhLG1CQUFtQixLQUFuQixDQUFiLENBQWpCLENBSmU7S0FBakI7QUFNQSxXQUFPLE1BQVAsQ0FWNEI7Q0FBOUI7O0FBYUEsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6Il9nZXRNYXRjaERhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9faXNTdHJpY3RDb21wYXJhYmxlJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIEdldHMgdGhlIHByb3BlcnR5IG5hbWVzLCB2YWx1ZXMsIGFuZCBjb21wYXJlIGZsYWdzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG1hdGNoIGRhdGEgb2YgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGdldE1hdGNoRGF0YShvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IGtleXMob2JqZWN0KSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgdmFyIGtleSA9IHJlc3VsdFtsZW5ndGhdLFxuICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuXG4gICAgcmVzdWx0W2xlbmd0aF0gPSBba2V5LCB2YWx1ZSwgaXNTdHJpY3RDb21wYXJhYmxlKHZhbHVlKV07XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRNYXRjaERhdGE7XG4iXX0=