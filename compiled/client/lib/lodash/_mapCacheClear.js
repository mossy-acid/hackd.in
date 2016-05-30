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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19tYXBDYWNoZUNsZWFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxPQUFPLFFBQVEsU0FBUixDQUFYO0lBQ0ksWUFBWSxRQUFRLGNBQVIsQ0FEaEI7SUFFSSxNQUFNLFFBQVEsUUFBUixDQUZWOzs7Ozs7Ozs7QUFXQSxTQUFTLGFBQVQsR0FBeUI7QUFDdkIsT0FBSyxRQUFMLEdBQWdCO0FBQ2QsWUFBUSxJQUFJLElBQUosRUFETTtBQUVkLFdBQU8sS0FBSyxPQUFPLFNBQVosR0FGTztBQUdkLGNBQVUsSUFBSSxJQUFKO0FBSEksR0FBaEI7QUFLRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsYUFBakIiLCJmaWxlIjoiX21hcENhY2hlQ2xlYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgSGFzaCA9IHJlcXVpcmUoJy4vX0hhc2gnKSxcbiAgICBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlQ2xlYXI7XG4iXX0=