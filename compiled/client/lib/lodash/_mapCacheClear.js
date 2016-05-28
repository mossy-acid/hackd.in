'use strict';

var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map || ListCache)(),
    'string': new Hash()
  };
}

module.exports = mapCacheClear;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19tYXBDYWNoZUNsZWFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxPQUFPLFFBQVEsU0FBUixDQUFQO0lBQ0EsWUFBWSxRQUFRLGNBQVIsQ0FBWjtJQUNBLE1BQU0sUUFBUSxRQUFSLENBQU47Ozs7Ozs7OztBQVNKLFNBQVMsYUFBVCxHQUF5QjtBQUN2QixPQUFLLFFBQUwsR0FBZ0I7QUFDZCxZQUFRLElBQUksSUFBSixFQUFSO0FBQ0EsV0FBTyxLQUFLLE9BQU8sU0FBUCxDQUFMLEVBQVA7QUFDQSxjQUFVLElBQUksSUFBSixFQUFWO0dBSEYsQ0FEdUI7Q0FBekI7O0FBUUEsT0FBTyxPQUFQLEdBQWlCLGFBQWpCIiwiZmlsZSI6Il9tYXBDYWNoZUNsZWFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEhhc2ggPSByZXF1aXJlKCcuL19IYXNoJyksXG4gICAgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUNsZWFyO1xuIl19