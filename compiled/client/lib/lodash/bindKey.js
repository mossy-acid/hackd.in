'use strict';

var createWrapper = require('./_createWrapper'),
    getHolder = require('./_getHolder'),
    replaceHolders = require('./_replaceHolders'),
    rest = require('./rest');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    PARTIAL_FLAG = 32;

/**
 * Creates a function that invokes the method at `object[key]` with `partials`
 * prepended to the arguments it receives.
 *
 * This method differs from `_.bind` by allowing bound functions to reference
 * methods that may be redefined or don't yet exist. See
 * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
 * for more details.
 *
 * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
 * builds, may be used as a placeholder for partially applied arguments.
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Function
 * @param {Object} object The object to invoke the method on.
 * @param {string} key The key of the method.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var object = {
 *   'user': 'fred',
 *   'greet': function(greeting, punctuation) {
 *     return greeting + ' ' + this.user + punctuation;
 *   }
 * };
 *
 * var bound = _.bindKey(object, 'greet', 'hi');
 * bound('!');
 * // => 'hi fred!'
 *
 * object.greet = function(greeting, punctuation) {
 *   return greeting + 'ya ' + this.user + punctuation;
 * };
 *
 * bound('!');
 * // => 'hiya fred!'
 *
 * // Bound with placeholders.
 * var bound = _.bindKey(object, 'greet', _, '!');
 * bound('hi');
 * // => 'hiya fred!'
 */
var bindKey = rest(function (object, key, partials) {
    var bitmask = BIND_FLAG | BIND_KEY_FLAG;
    if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bindKey));
        bitmask |= PARTIAL_FLAG;
    }
    return createWrapper(key, bitmask, object, partials, holders);
});

// Assign default placeholders.
bindKey.placeholder = {};

module.exports = bindKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2JpbmRLZXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGdCQUFnQixRQUFRLGtCQUFSLENBQWhCO0lBQ0EsWUFBWSxRQUFRLGNBQVIsQ0FBWjtJQUNBLGlCQUFpQixRQUFRLG1CQUFSLENBQWpCO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDs7O0FBR0osSUFBSSxZQUFZLENBQVo7SUFDQSxnQkFBZ0IsQ0FBaEI7SUFDQSxlQUFlLEVBQWY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0NKLElBQUksVUFBVSxLQUFLLFVBQVMsTUFBVCxFQUFpQixHQUFqQixFQUFzQixRQUF0QixFQUFnQztBQUNqRCxRQUFJLFVBQVUsWUFBWSxhQUFaLENBRG1DO0FBRWpELFFBQUksU0FBUyxNQUFULEVBQWlCO0FBQ25CLFlBQUksVUFBVSxlQUFlLFFBQWYsRUFBeUIsVUFBVSxPQUFWLENBQXpCLENBQVYsQ0FEZTtBQUVuQixtQkFBVyxZQUFYLENBRm1CO0tBQXJCO0FBSUEsV0FBTyxjQUFjLEdBQWQsRUFBbUIsT0FBbkIsRUFBNEIsTUFBNUIsRUFBb0MsUUFBcEMsRUFBOEMsT0FBOUMsQ0FBUCxDQU5pRDtDQUFoQyxDQUFmOzs7QUFVSixRQUFRLFdBQVIsR0FBc0IsRUFBdEI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6ImJpbmRLZXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY3JlYXRlV3JhcHBlciA9IHJlcXVpcmUoJy4vX2NyZWF0ZVdyYXBwZXInKSxcbiAgICBnZXRIb2xkZXIgPSByZXF1aXJlKCcuL19nZXRIb2xkZXInKSxcbiAgICByZXBsYWNlSG9sZGVycyA9IHJlcXVpcmUoJy4vX3JlcGxhY2VIb2xkZXJzJyksXG4gICAgcmVzdCA9IHJlcXVpcmUoJy4vcmVzdCcpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB3cmFwcGVyIG1ldGFkYXRhLiAqL1xudmFyIEJJTkRfRkxBRyA9IDEsXG4gICAgQklORF9LRVlfRkxBRyA9IDIsXG4gICAgUEFSVElBTF9GTEFHID0gMzI7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyB0aGUgbWV0aG9kIGF0IGBvYmplY3Rba2V5XWAgd2l0aCBgcGFydGlhbHNgXG4gKiBwcmVwZW5kZWQgdG8gdGhlIGFyZ3VtZW50cyBpdCByZWNlaXZlcy5cbiAqXG4gKiBUaGlzIG1ldGhvZCBkaWZmZXJzIGZyb20gYF8uYmluZGAgYnkgYWxsb3dpbmcgYm91bmQgZnVuY3Rpb25zIHRvIHJlZmVyZW5jZVxuICogbWV0aG9kcyB0aGF0IG1heSBiZSByZWRlZmluZWQgb3IgZG9uJ3QgeWV0IGV4aXN0LiBTZWVcbiAqIFtQZXRlciBNaWNoYXV4J3MgYXJ0aWNsZV0oaHR0cDovL3BldGVyLm1pY2hhdXguY2EvYXJ0aWNsZXMvbGF6eS1mdW5jdGlvbi1kZWZpbml0aW9uLXBhdHRlcm4pXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFRoZSBgXy5iaW5kS2V5LnBsYWNlaG9sZGVyYCB2YWx1ZSwgd2hpY2ggZGVmYXVsdHMgdG8gYF9gIGluIG1vbm9saXRoaWNcbiAqIGJ1aWxkcywgbWF5IGJlIHVzZWQgYXMgYSBwbGFjZWhvbGRlciBmb3IgcGFydGlhbGx5IGFwcGxpZWQgYXJndW1lbnRzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xMC4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnZva2UgdGhlIG1ldGhvZCBvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kLlxuICogQHBhcmFtIHsuLi4qfSBbcGFydGlhbHNdIFRoZSBhcmd1bWVudHMgdG8gYmUgcGFydGlhbGx5IGFwcGxpZWQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBib3VuZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHtcbiAqICAgJ3VzZXInOiAnZnJlZCcsXG4gKiAgICdncmVldCc6IGZ1bmN0aW9uKGdyZWV0aW5nLCBwdW5jdHVhdGlvbikge1xuICogICAgIHJldHVybiBncmVldGluZyArICcgJyArIHRoaXMudXNlciArIHB1bmN0dWF0aW9uO1xuICogICB9XG4gKiB9O1xuICpcbiAqIHZhciBib3VuZCA9IF8uYmluZEtleShvYmplY3QsICdncmVldCcsICdoaScpO1xuICogYm91bmQoJyEnKTtcbiAqIC8vID0+ICdoaSBmcmVkISdcbiAqXG4gKiBvYmplY3QuZ3JlZXQgPSBmdW5jdGlvbihncmVldGluZywgcHVuY3R1YXRpb24pIHtcbiAqICAgcmV0dXJuIGdyZWV0aW5nICsgJ3lhICcgKyB0aGlzLnVzZXIgKyBwdW5jdHVhdGlvbjtcbiAqIH07XG4gKlxuICogYm91bmQoJyEnKTtcbiAqIC8vID0+ICdoaXlhIGZyZWQhJ1xuICpcbiAqIC8vIEJvdW5kIHdpdGggcGxhY2Vob2xkZXJzLlxuICogdmFyIGJvdW5kID0gXy5iaW5kS2V5KG9iamVjdCwgJ2dyZWV0JywgXywgJyEnKTtcbiAqIGJvdW5kKCdoaScpO1xuICogLy8gPT4gJ2hpeWEgZnJlZCEnXG4gKi9cbnZhciBiaW5kS2V5ID0gcmVzdChmdW5jdGlvbihvYmplY3QsIGtleSwgcGFydGlhbHMpIHtcbiAgdmFyIGJpdG1hc2sgPSBCSU5EX0ZMQUcgfCBCSU5EX0tFWV9GTEFHO1xuICBpZiAocGFydGlhbHMubGVuZ3RoKSB7XG4gICAgdmFyIGhvbGRlcnMgPSByZXBsYWNlSG9sZGVycyhwYXJ0aWFscywgZ2V0SG9sZGVyKGJpbmRLZXkpKTtcbiAgICBiaXRtYXNrIHw9IFBBUlRJQUxfRkxBRztcbiAgfVxuICByZXR1cm4gY3JlYXRlV3JhcHBlcihrZXksIGJpdG1hc2ssIG9iamVjdCwgcGFydGlhbHMsIGhvbGRlcnMpO1xufSk7XG5cbi8vIEFzc2lnbiBkZWZhdWx0IHBsYWNlaG9sZGVycy5cbmJpbmRLZXkucGxhY2Vob2xkZXIgPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBiaW5kS2V5O1xuIl19