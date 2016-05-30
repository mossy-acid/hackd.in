'use strict';

var createPadding = require('./_createPadding'),
    stringSize = require('./_stringSize'),
    toInteger = require('./toInteger'),
    toString = require('./toString');

/**
 * Pads `string` on the left side if it's shorter than `length`. Padding
 * characters are truncated if they exceed `length`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to pad.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padded string.
 * @example
 *
 * _.padStart('abc', 6);
 * // => '   abc'
 *
 * _.padStart('abc', 6, '_-');
 * // => '_-_abc'
 *
 * _.padStart('abc', 3);
 * // => 'abc'
 */
function padStart(string, length, chars) {
    string = toString(string);
    length = toInteger(length);

    var strLength = length ? stringSize(string) : 0;
    return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
}

module.exports = padStart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3BhZFN0YXJ0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxnQkFBZ0IsUUFBUSxrQkFBUixDQUFwQjtJQUNJLGFBQWEsUUFBUSxlQUFSLENBRGpCO0lBRUksWUFBWSxRQUFRLGFBQVIsQ0FGaEI7SUFHSSxXQUFXLFFBQVEsWUFBUixDQUhmOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBLFNBQVMsUUFBVCxDQUFrQixNQUFsQixFQUEwQixNQUExQixFQUFrQyxLQUFsQyxFQUF5QztBQUN2QyxhQUFTLFNBQVMsTUFBVCxDQUFUO0FBQ0EsYUFBUyxVQUFVLE1BQVYsQ0FBVDs7QUFFQSxRQUFJLFlBQVksU0FBUyxXQUFXLE1BQVgsQ0FBVCxHQUE4QixDQUE5QztBQUNBLFdBQVEsVUFBVSxZQUFZLE1BQXZCLEdBQ0YsY0FBYyxTQUFTLFNBQXZCLEVBQWtDLEtBQWxDLElBQTJDLE1BRHpDLEdBRUgsTUFGSjtBQUdEOztBQUVELE9BQU8sT0FBUCxHQUFpQixRQUFqQiIsImZpbGUiOiJwYWRTdGFydC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcmVhdGVQYWRkaW5nID0gcmVxdWlyZSgnLi9fY3JlYXRlUGFkZGluZycpLFxuICAgIHN0cmluZ1NpemUgPSByZXF1aXJlKCcuL19zdHJpbmdTaXplJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqXG4gKiBQYWRzIGBzdHJpbmdgIG9uIHRoZSBsZWZ0IHNpZGUgaWYgaXQncyBzaG9ydGVyIHRoYW4gYGxlbmd0aGAuIFBhZGRpbmdcbiAqIGNoYXJhY3RlcnMgYXJlIHRydW5jYXRlZCBpZiB0aGV5IGV4Y2VlZCBgbGVuZ3RoYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBwYWQuXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD0wXSBUaGUgcGFkZGluZyBsZW5ndGguXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NoYXJzPScgJ10gVGhlIHN0cmluZyB1c2VkIGFzIHBhZGRpbmcuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBwYWRkZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnBhZFN0YXJ0KCdhYmMnLCA2KTtcbiAqIC8vID0+ICcgICBhYmMnXG4gKlxuICogXy5wYWRTdGFydCgnYWJjJywgNiwgJ18tJyk7XG4gKiAvLyA9PiAnXy1fYWJjJ1xuICpcbiAqIF8ucGFkU3RhcnQoJ2FiYycsIDMpO1xuICogLy8gPT4gJ2FiYydcbiAqL1xuZnVuY3Rpb24gcGFkU3RhcnQoc3RyaW5nLCBsZW5ndGgsIGNoYXJzKSB7XG4gIHN0cmluZyA9IHRvU3RyaW5nKHN0cmluZyk7XG4gIGxlbmd0aCA9IHRvSW50ZWdlcihsZW5ndGgpO1xuXG4gIHZhciBzdHJMZW5ndGggPSBsZW5ndGggPyBzdHJpbmdTaXplKHN0cmluZykgOiAwO1xuICByZXR1cm4gKGxlbmd0aCAmJiBzdHJMZW5ndGggPCBsZW5ndGgpXG4gICAgPyAoY3JlYXRlUGFkZGluZyhsZW5ndGggLSBzdHJMZW5ndGgsIGNoYXJzKSArIHN0cmluZylcbiAgICA6IHN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYWRTdGFydDtcbiJdfQ==