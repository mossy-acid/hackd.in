'use strict';

var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19IYXNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFoQjtJQUNJLGFBQWEsUUFBUSxlQUFSLENBRGpCO0lBRUksVUFBVSxRQUFRLFlBQVIsQ0FGZDtJQUdJLFVBQVUsUUFBUSxZQUFSLENBSGQ7SUFJSSxVQUFVLFFBQVEsWUFBUixDQUpkOzs7Ozs7Ozs7QUFhQSxTQUFTLElBQVQsQ0FBYyxPQUFkLEVBQXVCO0FBQ3JCLFFBQUksUUFBUSxDQUFDLENBQWI7UUFDSSxTQUFTLFVBQVUsUUFBUSxNQUFsQixHQUEyQixDQUR4Qzs7QUFHQSxTQUFLLEtBQUw7QUFDQSxXQUFPLEVBQUUsS0FBRixHQUFVLE1BQWpCLEVBQXlCO0FBQ3ZCLFlBQUksUUFBUSxRQUFRLEtBQVIsQ0FBWjtBQUNBLGFBQUssR0FBTCxDQUFTLE1BQU0sQ0FBTixDQUFULEVBQW1CLE1BQU0sQ0FBTixDQUFuQjtBQUNEO0FBQ0Y7OztBQUdELEtBQUssU0FBTCxDQUFlLEtBQWYsR0FBdUIsU0FBdkI7QUFDQSxLQUFLLFNBQUwsQ0FBZSxRQUFmLElBQTJCLFVBQTNCO0FBQ0EsS0FBSyxTQUFMLENBQWUsR0FBZixHQUFxQixPQUFyQjtBQUNBLEtBQUssU0FBTCxDQUFlLEdBQWYsR0FBcUIsT0FBckI7QUFDQSxLQUFLLFNBQUwsQ0FBZSxHQUFmLEdBQXFCLE9BQXJCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJfSGFzaC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBoYXNoQ2xlYXIgPSByZXF1aXJlKCcuL19oYXNoQ2xlYXInKSxcbiAgICBoYXNoRGVsZXRlID0gcmVxdWlyZSgnLi9faGFzaERlbGV0ZScpLFxuICAgIGhhc2hHZXQgPSByZXF1aXJlKCcuL19oYXNoR2V0JyksXG4gICAgaGFzaEhhcyA9IHJlcXVpcmUoJy4vX2hhc2hIYXMnKSxcbiAgICBoYXNoU2V0ID0gcmVxdWlyZSgnLi9faGFzaFNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA/IGVudHJpZXMubGVuZ3RoIDogMDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gSGFzaDtcbiJdfQ==