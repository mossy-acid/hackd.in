'use strict';

var baseAssign = require('./_baseAssign'),
    baseCreate = require('./_baseCreate');

/**
 * Creates an object that inherits from the `prototype` object. If a
 * `properties` object is given, its own enumerable string keyed properties
 * are assigned to the created object.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Object
 * @param {Object} prototype The object to inherit from.
 * @param {Object} [properties] The properties to assign to the object.
 * @returns {Object} Returns the new object.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * function Circle() {
 *   Shape.call(this);
 * }
 *
 * Circle.prototype = _.create(Shape.prototype, {
 *   'constructor': Circle
 * });
 *
 * var circle = new Circle;
 * circle instanceof Circle;
 * // => true
 *
 * circle instanceof Shape;
 * // => true
 */
function create(prototype, properties) {
  var result = baseCreate(prototype);
  return properties ? baseAssign(result, properties) : result;
}

module.exports = create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2NyZWF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxRQUFRLGVBQVIsQ0FBYjtJQUNBLGFBQWEsUUFBUSxlQUFSLENBQWI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9DSixTQUFTLE1BQVQsQ0FBZ0IsU0FBaEIsRUFBMkIsVUFBM0IsRUFBdUM7QUFDckMsTUFBSSxTQUFTLFdBQVcsU0FBWCxDQUFULENBRGlDO0FBRXJDLFNBQU8sYUFBYSxXQUFXLE1BQVgsRUFBbUIsVUFBbkIsQ0FBYixHQUE4QyxNQUE5QyxDQUY4QjtDQUF2Qzs7QUFLQSxPQUFPLE9BQVAsR0FBaUIsTUFBakIiLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VBc3NpZ24gPSByZXF1aXJlKCcuL19iYXNlQXNzaWduJyksXG4gICAgYmFzZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX2Jhc2VDcmVhdGUnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhlIGBwcm90b3R5cGVgIG9iamVjdC4gSWYgYVxuICogYHByb3BlcnRpZXNgIG9iamVjdCBpcyBnaXZlbiwgaXRzIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0aWVzXG4gKiBhcmUgYXNzaWduZWQgdG8gdGhlIGNyZWF0ZWQgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi4zLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90b3R5cGUgVGhlIG9iamVjdCB0byBpbmhlcml0IGZyb20uXG4gKiBAcGFyYW0ge09iamVjdH0gW3Byb3BlcnRpZXNdIFRoZSBwcm9wZXJ0aWVzIHRvIGFzc2lnbiB0byB0aGUgb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gU2hhcGUoKSB7XG4gKiAgIHRoaXMueCA9IDA7XG4gKiAgIHRoaXMueSA9IDA7XG4gKiB9XG4gKlxuICogZnVuY3Rpb24gQ2lyY2xlKCkge1xuICogICBTaGFwZS5jYWxsKHRoaXMpO1xuICogfVxuICpcbiAqIENpcmNsZS5wcm90b3R5cGUgPSBfLmNyZWF0ZShTaGFwZS5wcm90b3R5cGUsIHtcbiAqICAgJ2NvbnN0cnVjdG9yJzogQ2lyY2xlXG4gKiB9KTtcbiAqXG4gKiB2YXIgY2lyY2xlID0gbmV3IENpcmNsZTtcbiAqIGNpcmNsZSBpbnN0YW5jZW9mIENpcmNsZTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBjaXJjbGUgaW5zdGFuY2VvZiBTaGFwZTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlKHByb3RvdHlwZSwgcHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0ID0gYmFzZUNyZWF0ZShwcm90b3R5cGUpO1xuICByZXR1cm4gcHJvcGVydGllcyA/IGJhc2VBc3NpZ24ocmVzdWx0LCBwcm9wZXJ0aWVzKSA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGU7XG4iXX0=