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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19IYXNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsYUFBYSxRQUFRLGVBQVIsQ0FBYjtJQUNBLFVBQVUsUUFBUSxZQUFSLENBQVY7SUFDQSxVQUFVLFFBQVEsWUFBUixDQUFWO0lBQ0EsVUFBVSxRQUFRLFlBQVIsQ0FBVjs7Ozs7Ozs7O0FBU0osU0FBUyxJQUFULENBQWMsT0FBZCxFQUF1QjtBQUNyQixRQUFJLFFBQVEsQ0FBQyxDQUFEO1FBQ1IsU0FBUyxVQUFVLFFBQVEsTUFBUixHQUFpQixDQUEzQixDQUZROztBQUlyQixTQUFLLEtBQUwsR0FKcUI7QUFLckIsV0FBTyxFQUFFLEtBQUYsR0FBVSxNQUFWLEVBQWtCO0FBQ3ZCLFlBQUksUUFBUSxRQUFRLEtBQVIsQ0FBUixDQURtQjtBQUV2QixhQUFLLEdBQUwsQ0FBUyxNQUFNLENBQU4sQ0FBVCxFQUFtQixNQUFNLENBQU4sQ0FBbkIsRUFGdUI7S0FBekI7Q0FMRjs7O0FBWUEsS0FBSyxTQUFMLENBQWUsS0FBZixHQUF1QixTQUF2QjtBQUNBLEtBQUssU0FBTCxDQUFlLFFBQWYsSUFBMkIsVUFBM0I7QUFDQSxLQUFLLFNBQUwsQ0FBZSxHQUFmLEdBQXFCLE9BQXJCO0FBQ0EsS0FBSyxTQUFMLENBQWUsR0FBZixHQUFxQixPQUFyQjtBQUNBLEtBQUssU0FBTCxDQUFlLEdBQWYsR0FBcUIsT0FBckI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6Il9IYXNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGhhc2hDbGVhciA9IHJlcXVpcmUoJy4vX2hhc2hDbGVhcicpLFxuICAgIGhhc2hEZWxldGUgPSByZXF1aXJlKCcuL19oYXNoRGVsZXRlJyksXG4gICAgaGFzaEdldCA9IHJlcXVpcmUoJy4vX2hhc2hHZXQnKSxcbiAgICBoYXNoSGFzID0gcmVxdWlyZSgnLi9faGFzaEhhcycpLFxuICAgIGhhc2hTZXQgPSByZXF1aXJlKCcuL19oYXNoU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID8gZW50cmllcy5sZW5ndGggOiAwO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBIYXNoO1xuIl19