'use strict';

var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
    var index = -1,
        length = values ? values.length : 0;

    this.__data__ = new MapCache();
    while (++index < length) {
        this.add(values[index]);
    }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19TZXRDYWNoZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksV0FBVyxRQUFRLGFBQVIsQ0FBZjtJQUNJLGNBQWMsUUFBUSxnQkFBUixDQURsQjtJQUVJLGNBQWMsUUFBUSxnQkFBUixDQUZsQjs7Ozs7Ozs7OztBQVlBLFNBQVMsUUFBVCxDQUFrQixNQUFsQixFQUEwQjtBQUN4QixRQUFJLFFBQVEsQ0FBQyxDQUFiO1FBQ0ksU0FBUyxTQUFTLE9BQU8sTUFBaEIsR0FBeUIsQ0FEdEM7O0FBR0EsU0FBSyxRQUFMLEdBQWdCLElBQUksUUFBSixFQUFoQjtBQUNBLFdBQU8sRUFBRSxLQUFGLEdBQVUsTUFBakIsRUFBeUI7QUFDdkIsYUFBSyxHQUFMLENBQVMsT0FBTyxLQUFQLENBQVQ7QUFDRDtBQUNGOzs7QUFHRCxTQUFTLFNBQVQsQ0FBbUIsR0FBbkIsR0FBeUIsU0FBUyxTQUFULENBQW1CLElBQW5CLEdBQTBCLFdBQW5EO0FBQ0EsU0FBUyxTQUFULENBQW1CLEdBQW5CLEdBQXlCLFdBQXpCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixRQUFqQiIsImZpbGUiOiJfU2V0Q2FjaGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpLFxuICAgIHNldENhY2hlQWRkID0gcmVxdWlyZSgnLi9fc2V0Q2FjaGVBZGQnKSxcbiAgICBzZXRDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX3NldENhY2hlSGFzJyk7XG5cbi8qKlxuICpcbiAqIENyZWF0ZXMgYW4gYXJyYXkgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIHVuaXF1ZSB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU2V0Q2FjaGUodmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzID8gdmFsdWVzLmxlbmd0aCA6IDA7XG5cbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB0aGlzLmFkZCh2YWx1ZXNbaW5kZXhdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU2V0Q2FjaGVgLlxuU2V0Q2FjaGUucHJvdG90eXBlLmFkZCA9IFNldENhY2hlLnByb3RvdHlwZS5wdXNoID0gc2V0Q2FjaGVBZGQ7XG5TZXRDYWNoZS5wcm90b3R5cGUuaGFzID0gc2V0Q2FjaGVIYXM7XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0Q2FjaGU7XG4iXX0=