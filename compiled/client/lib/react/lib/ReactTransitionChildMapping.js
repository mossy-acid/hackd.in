/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks static-only
 * @providesModule ReactTransitionChildMapping
 */

'use strict';

var flattenChildren = require('./flattenChildren');

var ReactTransitionChildMapping = {
  /**
   * Given `this.props.children`, return an object mapping key to child. Just
   * simple syntactic sugar around flattenChildren().
   *
   * @param {*} children `this.props.children`
   * @return {object} Mapping of key to child
   */
  getChildMapping: function getChildMapping(children) {
    if (!children) {
      return children;
    }
    return flattenChildren(children);
  },

  /**
   * When you're adding or removing children some may be added or removed in the
   * same render pass. We want to show *both* since we want to simultaneously
   * animate elements in and out. This function takes a previous set of keys
   * and a new set of keys and merges them with its best guess of the correct
   * ordering. In the future we may expose some of the utilities in
   * ReactMultiChild to make this easy, but for now React itself does not
   * directly have this concept of the union of prevChildren and nextChildren
   * so we implement it here.
   *
   * @param {object} prev prev children as returned from
   * `ReactTransitionChildMapping.getChildMapping()`.
   * @param {object} next next children as returned from
   * `ReactTransitionChildMapping.getChildMapping()`.
   * @return {object} a key set that contains all keys in `prev` and all keys
   * in `next` in a reasonable order.
   */
  mergeChildMappings: function mergeChildMappings(prev, next) {
    prev = prev || {};
    next = next || {};

    function getValueForKey(key) {
      if (next.hasOwnProperty(key)) {
        return next[key];
      } else {
        return prev[key];
      }
    }

    // For each key of `next`, the list of keys to insert before that key in
    // the combined list
    var nextKeysPending = {};

    var pendingKeys = [];
    for (var prevKey in prev) {
      if (next.hasOwnProperty(prevKey)) {
        if (pendingKeys.length) {
          nextKeysPending[prevKey] = pendingKeys;
          pendingKeys = [];
        }
      } else {
        pendingKeys.push(prevKey);
      }
    }

    var i;
    var childMapping = {};
    for (var nextKey in next) {
      if (nextKeysPending.hasOwnProperty(nextKey)) {
        for (i = 0; i < nextKeysPending[nextKey].length; i++) {
          var pendingNextKey = nextKeysPending[nextKey][i];
          childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
        }
      }
      childMapping[nextKey] = getValueForKey(nextKey);
    }

    // Finally, add the keys which didn't appear before any key in `next`
    for (i = 0; i < pendingKeys.length; i++) {
      childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
    }

    return childMapping;
  }
};

module.exports = ReactTransitionChildMapping;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0VHJhbnNpdGlvbkNoaWxkTWFwcGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLGtCQUFrQixRQUFRLG1CQUFSLENBQWxCOztBQUVKLElBQUksOEJBQThCOzs7Ozs7OztBQVFoQyxtQkFBaUIseUJBQVUsUUFBVixFQUFvQjtBQUNuQyxRQUFJLENBQUMsUUFBRCxFQUFXO0FBQ2IsYUFBTyxRQUFQLENBRGE7S0FBZjtBQUdBLFdBQU8sZ0JBQWdCLFFBQWhCLENBQVAsQ0FKbUM7R0FBcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QmpCLHNCQUFvQiw0QkFBVSxJQUFWLEVBQWdCLElBQWhCLEVBQXNCO0FBQ3hDLFdBQU8sUUFBUSxFQUFSLENBRGlDO0FBRXhDLFdBQU8sUUFBUSxFQUFSLENBRmlDOztBQUl4QyxhQUFTLGNBQVQsQ0FBd0IsR0FBeEIsRUFBNkI7QUFDM0IsVUFBSSxLQUFLLGNBQUwsQ0FBb0IsR0FBcEIsQ0FBSixFQUE4QjtBQUM1QixlQUFPLEtBQUssR0FBTCxDQUFQLENBRDRCO09BQTlCLE1BRU87QUFDTCxlQUFPLEtBQUssR0FBTCxDQUFQLENBREs7T0FGUDtLQURGOzs7O0FBSndDLFFBY3BDLGtCQUFrQixFQUFsQixDQWRvQzs7QUFnQnhDLFFBQUksY0FBYyxFQUFkLENBaEJvQztBQWlCeEMsU0FBSyxJQUFJLE9BQUosSUFBZSxJQUFwQixFQUEwQjtBQUN4QixVQUFJLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUFKLEVBQWtDO0FBQ2hDLFlBQUksWUFBWSxNQUFaLEVBQW9CO0FBQ3RCLDBCQUFnQixPQUFoQixJQUEyQixXQUEzQixDQURzQjtBQUV0Qix3QkFBYyxFQUFkLENBRnNCO1NBQXhCO09BREYsTUFLTztBQUNMLG9CQUFZLElBQVosQ0FBaUIsT0FBakIsRUFESztPQUxQO0tBREY7O0FBV0EsUUFBSSxDQUFKLENBNUJ3QztBQTZCeEMsUUFBSSxlQUFlLEVBQWYsQ0E3Qm9DO0FBOEJ4QyxTQUFLLElBQUksT0FBSixJQUFlLElBQXBCLEVBQTBCO0FBQ3hCLFVBQUksZ0JBQWdCLGNBQWhCLENBQStCLE9BQS9CLENBQUosRUFBNkM7QUFDM0MsYUFBSyxJQUFJLENBQUosRUFBTyxJQUFJLGdCQUFnQixPQUFoQixFQUF5QixNQUF6QixFQUFpQyxHQUFqRCxFQUFzRDtBQUNwRCxjQUFJLGlCQUFpQixnQkFBZ0IsT0FBaEIsRUFBeUIsQ0FBekIsQ0FBakIsQ0FEZ0Q7QUFFcEQsdUJBQWEsZ0JBQWdCLE9BQWhCLEVBQXlCLENBQXpCLENBQWIsSUFBNEMsZUFBZSxjQUFmLENBQTVDLENBRm9EO1NBQXREO09BREY7QUFNQSxtQkFBYSxPQUFiLElBQXdCLGVBQWUsT0FBZixDQUF4QixDQVB3QjtLQUExQjs7O0FBOUJ3QyxTQXlDbkMsSUFBSSxDQUFKLEVBQU8sSUFBSSxZQUFZLE1BQVosRUFBb0IsR0FBcEMsRUFBeUM7QUFDdkMsbUJBQWEsWUFBWSxDQUFaLENBQWIsSUFBK0IsZUFBZSxZQUFZLENBQVosQ0FBZixDQUEvQixDQUR1QztLQUF6Qzs7QUFJQSxXQUFPLFlBQVAsQ0E3Q3dDO0dBQXRCO0NBaENsQjs7QUFpRkosT0FBTyxPQUFQLEdBQWlCLDJCQUFqQiIsImZpbGUiOiJSZWFjdFRyYW5zaXRpb25DaGlsZE1hcHBpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0VHJhbnNpdGlvbkNoaWxkTWFwcGluZ1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGZsYXR0ZW5DaGlsZHJlbiA9IHJlcXVpcmUoJy4vZmxhdHRlbkNoaWxkcmVuJyk7XG5cbnZhciBSZWFjdFRyYW5zaXRpb25DaGlsZE1hcHBpbmcgPSB7XG4gIC8qKlxuICAgKiBHaXZlbiBgdGhpcy5wcm9wcy5jaGlsZHJlbmAsIHJldHVybiBhbiBvYmplY3QgbWFwcGluZyBrZXkgdG8gY2hpbGQuIEp1c3RcbiAgICogc2ltcGxlIHN5bnRhY3RpYyBzdWdhciBhcm91bmQgZmxhdHRlbkNoaWxkcmVuKCkuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gY2hpbGRyZW4gYHRoaXMucHJvcHMuY2hpbGRyZW5gXG4gICAqIEByZXR1cm4ge29iamVjdH0gTWFwcGluZyBvZiBrZXkgdG8gY2hpbGRcbiAgICovXG4gIGdldENoaWxkTWFwcGluZzogZnVuY3Rpb24gKGNoaWxkcmVuKSB7XG4gICAgaWYgKCFjaGlsZHJlbikge1xuICAgICAgcmV0dXJuIGNoaWxkcmVuO1xuICAgIH1cbiAgICByZXR1cm4gZmxhdHRlbkNoaWxkcmVuKGNoaWxkcmVuKTtcbiAgfSxcblxuICAvKipcbiAgICogV2hlbiB5b3UncmUgYWRkaW5nIG9yIHJlbW92aW5nIGNoaWxkcmVuIHNvbWUgbWF5IGJlIGFkZGVkIG9yIHJlbW92ZWQgaW4gdGhlXG4gICAqIHNhbWUgcmVuZGVyIHBhc3MuIFdlIHdhbnQgdG8gc2hvdyAqYm90aCogc2luY2Ugd2Ugd2FudCB0byBzaW11bHRhbmVvdXNseVxuICAgKiBhbmltYXRlIGVsZW1lbnRzIGluIGFuZCBvdXQuIFRoaXMgZnVuY3Rpb24gdGFrZXMgYSBwcmV2aW91cyBzZXQgb2Yga2V5c1xuICAgKiBhbmQgYSBuZXcgc2V0IG9mIGtleXMgYW5kIG1lcmdlcyB0aGVtIHdpdGggaXRzIGJlc3QgZ3Vlc3Mgb2YgdGhlIGNvcnJlY3RcbiAgICogb3JkZXJpbmcuIEluIHRoZSBmdXR1cmUgd2UgbWF5IGV4cG9zZSBzb21lIG9mIHRoZSB1dGlsaXRpZXMgaW5cbiAgICogUmVhY3RNdWx0aUNoaWxkIHRvIG1ha2UgdGhpcyBlYXN5LCBidXQgZm9yIG5vdyBSZWFjdCBpdHNlbGYgZG9lcyBub3RcbiAgICogZGlyZWN0bHkgaGF2ZSB0aGlzIGNvbmNlcHQgb2YgdGhlIHVuaW9uIG9mIHByZXZDaGlsZHJlbiBhbmQgbmV4dENoaWxkcmVuXG4gICAqIHNvIHdlIGltcGxlbWVudCBpdCBoZXJlLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcHJldiBwcmV2IGNoaWxkcmVuIGFzIHJldHVybmVkIGZyb21cbiAgICogYFJlYWN0VHJhbnNpdGlvbkNoaWxkTWFwcGluZy5nZXRDaGlsZE1hcHBpbmcoKWAuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBuZXh0IG5leHQgY2hpbGRyZW4gYXMgcmV0dXJuZWQgZnJvbVxuICAgKiBgUmVhY3RUcmFuc2l0aW9uQ2hpbGRNYXBwaW5nLmdldENoaWxkTWFwcGluZygpYC5cbiAgICogQHJldHVybiB7b2JqZWN0fSBhIGtleSBzZXQgdGhhdCBjb250YWlucyBhbGwga2V5cyBpbiBgcHJldmAgYW5kIGFsbCBrZXlzXG4gICAqIGluIGBuZXh0YCBpbiBhIHJlYXNvbmFibGUgb3JkZXIuXG4gICAqL1xuICBtZXJnZUNoaWxkTWFwcGluZ3M6IGZ1bmN0aW9uIChwcmV2LCBuZXh0KSB7XG4gICAgcHJldiA9IHByZXYgfHwge307XG4gICAgbmV4dCA9IG5leHQgfHwge307XG5cbiAgICBmdW5jdGlvbiBnZXRWYWx1ZUZvcktleShrZXkpIHtcbiAgICAgIGlmIChuZXh0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgcmV0dXJuIG5leHRba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRm9yIGVhY2gga2V5IG9mIGBuZXh0YCwgdGhlIGxpc3Qgb2Yga2V5cyB0byBpbnNlcnQgYmVmb3JlIHRoYXQga2V5IGluXG4gICAgLy8gdGhlIGNvbWJpbmVkIGxpc3RcbiAgICB2YXIgbmV4dEtleXNQZW5kaW5nID0ge307XG5cbiAgICB2YXIgcGVuZGluZ0tleXMgPSBbXTtcbiAgICBmb3IgKHZhciBwcmV2S2V5IGluIHByZXYpIHtcbiAgICAgIGlmIChuZXh0Lmhhc093blByb3BlcnR5KHByZXZLZXkpKSB7XG4gICAgICAgIGlmIChwZW5kaW5nS2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICBuZXh0S2V5c1BlbmRpbmdbcHJldktleV0gPSBwZW5kaW5nS2V5cztcbiAgICAgICAgICBwZW5kaW5nS2V5cyA9IFtdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZW5kaW5nS2V5cy5wdXNoKHByZXZLZXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBpO1xuICAgIHZhciBjaGlsZE1hcHBpbmcgPSB7fTtcbiAgICBmb3IgKHZhciBuZXh0S2V5IGluIG5leHQpIHtcbiAgICAgIGlmIChuZXh0S2V5c1BlbmRpbmcuaGFzT3duUHJvcGVydHkobmV4dEtleSkpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG5leHRLZXlzUGVuZGluZ1tuZXh0S2V5XS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBwZW5kaW5nTmV4dEtleSA9IG5leHRLZXlzUGVuZGluZ1tuZXh0S2V5XVtpXTtcbiAgICAgICAgICBjaGlsZE1hcHBpbmdbbmV4dEtleXNQZW5kaW5nW25leHRLZXldW2ldXSA9IGdldFZhbHVlRm9yS2V5KHBlbmRpbmdOZXh0S2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY2hpbGRNYXBwaW5nW25leHRLZXldID0gZ2V0VmFsdWVGb3JLZXkobmV4dEtleSk7XG4gICAgfVxuXG4gICAgLy8gRmluYWxseSwgYWRkIHRoZSBrZXlzIHdoaWNoIGRpZG4ndCBhcHBlYXIgYmVmb3JlIGFueSBrZXkgaW4gYG5leHRgXG4gICAgZm9yIChpID0gMDsgaSA8IHBlbmRpbmdLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZE1hcHBpbmdbcGVuZGluZ0tleXNbaV1dID0gZ2V0VmFsdWVGb3JLZXkocGVuZGluZ0tleXNbaV0pO1xuICAgIH1cblxuICAgIHJldHVybiBjaGlsZE1hcHBpbmc7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RUcmFuc2l0aW9uQ2hpbGRNYXBwaW5nOyJdfQ==