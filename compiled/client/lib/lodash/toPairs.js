'use strict';

var createToPairs = require('./_createToPairs'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable string keyed-value pairs for `object`
 * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
 * entries are returned.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias entries
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the key-value pairs.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.toPairs(new Foo);
 * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
 */
var toPairs = createToPairs(keys);

module.exports = toPairs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3RvUGFpcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGdCQUFnQixRQUFRLGtCQUFSLENBQWhCO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkosSUFBSSxVQUFVLGNBQWMsSUFBZCxDQUFWOztBQUVKLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJ0b1BhaXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNyZWF0ZVRvUGFpcnMgPSByZXF1aXJlKCcuL19jcmVhdGVUb1BhaXJzJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGVudW1lcmFibGUgc3RyaW5nIGtleWVkLXZhbHVlIHBhaXJzIGZvciBgb2JqZWN0YFxuICogd2hpY2ggY2FuIGJlIGNvbnN1bWVkIGJ5IGBfLmZyb21QYWlyc2AuIElmIGBvYmplY3RgIGlzIGEgbWFwIG9yIHNldCwgaXRzXG4gKiBlbnRyaWVzIGFyZSByZXR1cm5lZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAYWxpYXMgZW50cmllc1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBrZXktdmFsdWUgcGFpcnMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8udG9QYWlycyhuZXcgRm9vKTtcbiAqIC8vID0+IFtbJ2EnLCAxXSwgWydiJywgMl1dIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbnZhciB0b1BhaXJzID0gY3JlYXRlVG9QYWlycyhrZXlzKTtcblxubW9kdWxlLmV4cG9ydHMgPSB0b1BhaXJzO1xuIl19