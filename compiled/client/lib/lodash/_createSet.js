'use strict';

var Set = require('./_Set'),
    noop = require('./noop'),
    setToArray = require('./_setToArray');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY) ? noop : function (values) {
  return new Set(values);
};

module.exports = createSet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVTZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLE1BQU0sUUFBUSxRQUFSLENBQU47SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQO0lBQ0EsYUFBYSxRQUFRLGVBQVIsQ0FBYjs7O0FBR0osSUFBSSxXQUFXLElBQUksQ0FBSjs7Ozs7Ozs7O0FBU2YsSUFBSSxZQUFZLEVBQUUsT0FBTyxDQUFDLEdBQUksV0FBVyxJQUFJLEdBQUosQ0FBUSxHQUFFLENBQUMsQ0FBRCxDQUFWLENBQVgsRUFBMkIsQ0FBM0IsQ0FBSixJQUFzQyxRQUF2QyxDQUFULEdBQTRELElBQTVELEdBQW1FLFVBQVMsTUFBVCxFQUFpQjtBQUNsRyxTQUFPLElBQUksR0FBSixDQUFRLE1BQVIsQ0FBUCxDQURrRztDQUFqQjs7QUFJbkYsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6Il9jcmVhdGVTZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU2V0ID0gcmVxdWlyZSgnLi9fU2V0JyksXG4gICAgbm9vcCA9IHJlcXVpcmUoJy4vbm9vcCcpLFxuICAgIHNldFRvQXJyYXkgPSByZXF1aXJlKCcuL19zZXRUb0FycmF5Jyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHNldCBvZiBgdmFsdWVzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gYWRkIHRvIHRoZSBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgc2V0LlxuICovXG52YXIgY3JlYXRlU2V0ID0gIShTZXQgJiYgKDEgLyBzZXRUb0FycmF5KG5ldyBTZXQoWywtMF0pKVsxXSkgPT0gSU5GSU5JVFkpID8gbm9vcCA6IGZ1bmN0aW9uKHZhbHVlcykge1xuICByZXR1cm4gbmV3IFNldCh2YWx1ZXMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVTZXQ7XG4iXX0=