'use strict';

var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19TdGFjay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxRQUFRLGNBQVIsQ0FBWjtJQUNBLGFBQWEsUUFBUSxlQUFSLENBQWI7SUFDQSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLFdBQVcsUUFBUSxhQUFSLENBQVg7SUFDQSxXQUFXLFFBQVEsYUFBUixDQUFYO0lBQ0EsV0FBVyxRQUFRLGFBQVIsQ0FBWDs7Ozs7Ozs7O0FBU0osU0FBUyxLQUFULENBQWUsT0FBZixFQUF3QjtBQUN0QixPQUFLLFFBQUwsR0FBZ0IsSUFBSSxTQUFKLENBQWMsT0FBZCxDQUFoQixDQURzQjtDQUF4Qjs7O0FBS0EsTUFBTSxTQUFOLENBQWdCLEtBQWhCLEdBQXdCLFVBQXhCO0FBQ0EsTUFBTSxTQUFOLENBQWdCLFFBQWhCLElBQTRCLFdBQTVCO0FBQ0EsTUFBTSxTQUFOLENBQWdCLEdBQWhCLEdBQXNCLFFBQXRCO0FBQ0EsTUFBTSxTQUFOLENBQWdCLEdBQWhCLEdBQXNCLFFBQXRCO0FBQ0EsTUFBTSxTQUFOLENBQWdCLEdBQWhCLEdBQXNCLFFBQXRCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJfU3RhY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgc3RhY2tDbGVhciA9IHJlcXVpcmUoJy4vX3N0YWNrQ2xlYXInKSxcbiAgICBzdGFja0RlbGV0ZSA9IHJlcXVpcmUoJy4vX3N0YWNrRGVsZXRlJyksXG4gICAgc3RhY2tHZXQgPSByZXF1aXJlKCcuL19zdGFja0dldCcpLFxuICAgIHN0YWNrSGFzID0gcmVxdWlyZSgnLi9fc3RhY2tIYXMnKSxcbiAgICBzdGFja1NldCA9IHJlcXVpcmUoJy4vX3N0YWNrU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGUoZW50cmllcyk7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrO1xuIl19