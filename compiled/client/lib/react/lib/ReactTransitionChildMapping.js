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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0VHJhbnNpdGlvbkNoaWxkTWFwcGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLGtCQUFrQixRQUFRLG1CQUFSLENBQXRCOztBQUVBLElBQUksOEJBQThCOzs7Ozs7OztBQVFoQyxtQkFBaUIseUJBQVUsUUFBVixFQUFvQjtBQUNuQyxRQUFJLENBQUMsUUFBTCxFQUFlO0FBQ2IsYUFBTyxRQUFQO0FBQ0Q7QUFDRCxXQUFPLGdCQUFnQixRQUFoQixDQUFQO0FBQ0QsR0FiK0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQ2hDLHNCQUFvQiw0QkFBVSxJQUFWLEVBQWdCLElBQWhCLEVBQXNCO0FBQ3hDLFdBQU8sUUFBUSxFQUFmO0FBQ0EsV0FBTyxRQUFRLEVBQWY7O0FBRUEsYUFBUyxjQUFULENBQXdCLEdBQXhCLEVBQTZCO0FBQzNCLFVBQUksS0FBSyxjQUFMLENBQW9CLEdBQXBCLENBQUosRUFBOEI7QUFDNUIsZUFBTyxLQUFLLEdBQUwsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sS0FBSyxHQUFMLENBQVA7QUFDRDtBQUNGOzs7O0FBSUQsUUFBSSxrQkFBa0IsRUFBdEI7O0FBRUEsUUFBSSxjQUFjLEVBQWxCO0FBQ0EsU0FBSyxJQUFJLE9BQVQsSUFBb0IsSUFBcEIsRUFBMEI7QUFDeEIsVUFBSSxLQUFLLGNBQUwsQ0FBb0IsT0FBcEIsQ0FBSixFQUFrQztBQUNoQyxZQUFJLFlBQVksTUFBaEIsRUFBd0I7QUFDdEIsMEJBQWdCLE9BQWhCLElBQTJCLFdBQTNCO0FBQ0Esd0JBQWMsRUFBZDtBQUNEO0FBQ0YsT0FMRCxNQUtPO0FBQ0wsb0JBQVksSUFBWixDQUFpQixPQUFqQjtBQUNEO0FBQ0Y7O0FBRUQsUUFBSSxDQUFKO0FBQ0EsUUFBSSxlQUFlLEVBQW5CO0FBQ0EsU0FBSyxJQUFJLE9BQVQsSUFBb0IsSUFBcEIsRUFBMEI7QUFDeEIsVUFBSSxnQkFBZ0IsY0FBaEIsQ0FBK0IsT0FBL0IsQ0FBSixFQUE2QztBQUMzQyxhQUFLLElBQUksQ0FBVCxFQUFZLElBQUksZ0JBQWdCLE9BQWhCLEVBQXlCLE1BQXpDLEVBQWlELEdBQWpELEVBQXNEO0FBQ3BELGNBQUksaUJBQWlCLGdCQUFnQixPQUFoQixFQUF5QixDQUF6QixDQUFyQjtBQUNBLHVCQUFhLGdCQUFnQixPQUFoQixFQUF5QixDQUF6QixDQUFiLElBQTRDLGVBQWUsY0FBZixDQUE1QztBQUNEO0FBQ0Y7QUFDRCxtQkFBYSxPQUFiLElBQXdCLGVBQWUsT0FBZixDQUF4QjtBQUNEOzs7QUFHRCxTQUFLLElBQUksQ0FBVCxFQUFZLElBQUksWUFBWSxNQUE1QixFQUFvQyxHQUFwQyxFQUF5QztBQUN2QyxtQkFBYSxZQUFZLENBQVosQ0FBYixJQUErQixlQUFlLFlBQVksQ0FBWixDQUFmLENBQS9CO0FBQ0Q7O0FBRUQsV0FBTyxZQUFQO0FBQ0Q7QUE5RStCLENBQWxDOztBQWlGQSxPQUFPLE9BQVAsR0FBaUIsMkJBQWpCIiwiZmlsZSI6IlJlYWN0VHJhbnNpdGlvbkNoaWxkTWFwcGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RUcmFuc2l0aW9uQ2hpbGRNYXBwaW5nXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZmxhdHRlbkNoaWxkcmVuID0gcmVxdWlyZSgnLi9mbGF0dGVuQ2hpbGRyZW4nKTtcblxudmFyIFJlYWN0VHJhbnNpdGlvbkNoaWxkTWFwcGluZyA9IHtcbiAgLyoqXG4gICAqIEdpdmVuIGB0aGlzLnByb3BzLmNoaWxkcmVuYCwgcmV0dXJuIGFuIG9iamVjdCBtYXBwaW5nIGtleSB0byBjaGlsZC4gSnVzdFxuICAgKiBzaW1wbGUgc3ludGFjdGljIHN1Z2FyIGFyb3VuZCBmbGF0dGVuQ2hpbGRyZW4oKS5cbiAgICpcbiAgICogQHBhcmFtIHsqfSBjaGlsZHJlbiBgdGhpcy5wcm9wcy5jaGlsZHJlbmBcbiAgICogQHJldHVybiB7b2JqZWN0fSBNYXBwaW5nIG9mIGtleSB0byBjaGlsZFxuICAgKi9cbiAgZ2V0Q2hpbGRNYXBwaW5nOiBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICBpZiAoIWNoaWxkcmVuKSB7XG4gICAgICByZXR1cm4gY2hpbGRyZW47XG4gICAgfVxuICAgIHJldHVybiBmbGF0dGVuQ2hpbGRyZW4oY2hpbGRyZW4pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBXaGVuIHlvdSdyZSBhZGRpbmcgb3IgcmVtb3ZpbmcgY2hpbGRyZW4gc29tZSBtYXkgYmUgYWRkZWQgb3IgcmVtb3ZlZCBpbiB0aGVcbiAgICogc2FtZSByZW5kZXIgcGFzcy4gV2Ugd2FudCB0byBzaG93ICpib3RoKiBzaW5jZSB3ZSB3YW50IHRvIHNpbXVsdGFuZW91c2x5XG4gICAqIGFuaW1hdGUgZWxlbWVudHMgaW4gYW5kIG91dC4gVGhpcyBmdW5jdGlvbiB0YWtlcyBhIHByZXZpb3VzIHNldCBvZiBrZXlzXG4gICAqIGFuZCBhIG5ldyBzZXQgb2Yga2V5cyBhbmQgbWVyZ2VzIHRoZW0gd2l0aCBpdHMgYmVzdCBndWVzcyBvZiB0aGUgY29ycmVjdFxuICAgKiBvcmRlcmluZy4gSW4gdGhlIGZ1dHVyZSB3ZSBtYXkgZXhwb3NlIHNvbWUgb2YgdGhlIHV0aWxpdGllcyBpblxuICAgKiBSZWFjdE11bHRpQ2hpbGQgdG8gbWFrZSB0aGlzIGVhc3ksIGJ1dCBmb3Igbm93IFJlYWN0IGl0c2VsZiBkb2VzIG5vdFxuICAgKiBkaXJlY3RseSBoYXZlIHRoaXMgY29uY2VwdCBvZiB0aGUgdW5pb24gb2YgcHJldkNoaWxkcmVuIGFuZCBuZXh0Q2hpbGRyZW5cbiAgICogc28gd2UgaW1wbGVtZW50IGl0IGhlcmUuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwcmV2IHByZXYgY2hpbGRyZW4gYXMgcmV0dXJuZWQgZnJvbVxuICAgKiBgUmVhY3RUcmFuc2l0aW9uQ2hpbGRNYXBwaW5nLmdldENoaWxkTWFwcGluZygpYC5cbiAgICogQHBhcmFtIHtvYmplY3R9IG5leHQgbmV4dCBjaGlsZHJlbiBhcyByZXR1cm5lZCBmcm9tXG4gICAqIGBSZWFjdFRyYW5zaXRpb25DaGlsZE1hcHBpbmcuZ2V0Q2hpbGRNYXBwaW5nKClgLlxuICAgKiBAcmV0dXJuIHtvYmplY3R9IGEga2V5IHNldCB0aGF0IGNvbnRhaW5zIGFsbCBrZXlzIGluIGBwcmV2YCBhbmQgYWxsIGtleXNcbiAgICogaW4gYG5leHRgIGluIGEgcmVhc29uYWJsZSBvcmRlci5cbiAgICovXG4gIG1lcmdlQ2hpbGRNYXBwaW5nczogZnVuY3Rpb24gKHByZXYsIG5leHQpIHtcbiAgICBwcmV2ID0gcHJldiB8fCB7fTtcbiAgICBuZXh0ID0gbmV4dCB8fCB7fTtcblxuICAgIGZ1bmN0aW9uIGdldFZhbHVlRm9yS2V5KGtleSkge1xuICAgICAgaWYgKG5leHQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICByZXR1cm4gbmV4dFtrZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHByZXZba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBGb3IgZWFjaCBrZXkgb2YgYG5leHRgLCB0aGUgbGlzdCBvZiBrZXlzIHRvIGluc2VydCBiZWZvcmUgdGhhdCBrZXkgaW5cbiAgICAvLyB0aGUgY29tYmluZWQgbGlzdFxuICAgIHZhciBuZXh0S2V5c1BlbmRpbmcgPSB7fTtcblxuICAgIHZhciBwZW5kaW5nS2V5cyA9IFtdO1xuICAgIGZvciAodmFyIHByZXZLZXkgaW4gcHJldikge1xuICAgICAgaWYgKG5leHQuaGFzT3duUHJvcGVydHkocHJldktleSkpIHtcbiAgICAgICAgaWYgKHBlbmRpbmdLZXlzLmxlbmd0aCkge1xuICAgICAgICAgIG5leHRLZXlzUGVuZGluZ1twcmV2S2V5XSA9IHBlbmRpbmdLZXlzO1xuICAgICAgICAgIHBlbmRpbmdLZXlzID0gW107XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlbmRpbmdLZXlzLnB1c2gocHJldktleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGk7XG4gICAgdmFyIGNoaWxkTWFwcGluZyA9IHt9O1xuICAgIGZvciAodmFyIG5leHRLZXkgaW4gbmV4dCkge1xuICAgICAgaWYgKG5leHRLZXlzUGVuZGluZy5oYXNPd25Qcm9wZXJ0eShuZXh0S2V5KSkge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbmV4dEtleXNQZW5kaW5nW25leHRLZXldLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHBlbmRpbmdOZXh0S2V5ID0gbmV4dEtleXNQZW5kaW5nW25leHRLZXldW2ldO1xuICAgICAgICAgIGNoaWxkTWFwcGluZ1tuZXh0S2V5c1BlbmRpbmdbbmV4dEtleV1baV1dID0gZ2V0VmFsdWVGb3JLZXkocGVuZGluZ05leHRLZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjaGlsZE1hcHBpbmdbbmV4dEtleV0gPSBnZXRWYWx1ZUZvcktleShuZXh0S2V5KTtcbiAgICB9XG5cbiAgICAvLyBGaW5hbGx5LCBhZGQgdGhlIGtleXMgd2hpY2ggZGlkbid0IGFwcGVhciBiZWZvcmUgYW55IGtleSBpbiBgbmV4dGBcbiAgICBmb3IgKGkgPSAwOyBpIDwgcGVuZGluZ0tleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkTWFwcGluZ1twZW5kaW5nS2V5c1tpXV0gPSBnZXRWYWx1ZUZvcktleShwZW5kaW5nS2V5c1tpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoaWxkTWFwcGluZztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFRyYW5zaXRpb25DaGlsZE1hcHBpbmc7Il19