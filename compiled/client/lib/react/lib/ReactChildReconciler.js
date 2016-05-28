/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactChildReconciler
 * @typechecks static-only
 */

'use strict';

var ReactReconciler = require('./ReactReconciler');

var instantiateReactComponent = require('./instantiateReactComponent');
var shouldUpdateReactComponent = require('./shouldUpdateReactComponent');
var traverseAllChildren = require('./traverseAllChildren');
var warning = require('fbjs/lib/warning');

function instantiateChild(childInstances, child, name) {
  // We found a component instance.
  var keyUnique = childInstances[name] === undefined;
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== 'production' ? warning(keyUnique, 'flattenChildren(...): Encountered two children with the same key, ' + '`%s`. Child keys must be unique; when two children share a key, only ' + 'the first child will be used.', name) : undefined;
  }
  if (child != null && keyUnique) {
    childInstances[name] = instantiateReactComponent(child, null);
  }
}

/**
 * ReactChildReconciler provides helpers for initializing or updating a set of
 * children. Its output is suitable for passing it onto ReactMultiChild which
 * does diffed reordering and insertion.
 */
var ReactChildReconciler = {
  /**
   * Generates a "mount image" for each of the supplied children. In the case
   * of `ReactDOMComponent`, a mount image is a string of markup.
   *
   * @param {?object} nestedChildNodes Nested child maps.
   * @return {?object} A set of child instances.
   * @internal
   */
  instantiateChildren: function instantiateChildren(nestedChildNodes, transaction, context) {
    if (nestedChildNodes == null) {
      return null;
    }
    var childInstances = {};
    traverseAllChildren(nestedChildNodes, instantiateChild, childInstances);
    return childInstances;
  },

  /**
   * Updates the rendered children and returns a new set of children.
   *
   * @param {?object} prevChildren Previously initialized set of children.
   * @param {?object} nextChildren Flat child element maps.
   * @param {ReactReconcileTransaction} transaction
   * @param {object} context
   * @return {?object} A new set of child instances.
   * @internal
   */
  updateChildren: function updateChildren(prevChildren, nextChildren, transaction, context) {
    // We currently don't have a way to track moves here but if we use iterators
    // instead of for..in we can zip the iterators and check if an item has
    // moved.
    // TODO: If nothing has changed, return the prevChildren object so that we
    // can quickly bailout if nothing has changed.
    if (!nextChildren && !prevChildren) {
      return null;
    }
    var name;
    for (name in nextChildren) {
      if (!nextChildren.hasOwnProperty(name)) {
        continue;
      }
      var prevChild = prevChildren && prevChildren[name];
      var prevElement = prevChild && prevChild._currentElement;
      var nextElement = nextChildren[name];
      if (prevChild != null && shouldUpdateReactComponent(prevElement, nextElement)) {
        ReactReconciler.receiveComponent(prevChild, nextElement, transaction, context);
        nextChildren[name] = prevChild;
      } else {
        if (prevChild) {
          ReactReconciler.unmountComponent(prevChild, name);
        }
        // The child must be instantiated before it's mounted.
        var nextChildInstance = instantiateReactComponent(nextElement, null);
        nextChildren[name] = nextChildInstance;
      }
    }
    // Unmount children that are no longer present.
    for (name in prevChildren) {
      if (prevChildren.hasOwnProperty(name) && !(nextChildren && nextChildren.hasOwnProperty(name))) {
        ReactReconciler.unmountComponent(prevChildren[name]);
      }
    }
    return nextChildren;
  },

  /**
   * Unmounts all rendered children. This should be used to clean up children
   * when this component is unmounted.
   *
   * @param {?object} renderedChildren Previously initialized set of children.
   * @internal
   */
  unmountChildren: function unmountChildren(renderedChildren) {
    for (var name in renderedChildren) {
      if (renderedChildren.hasOwnProperty(name)) {
        var renderedChild = renderedChildren[name];
        ReactReconciler.unmountComponent(renderedChild);
      }
    }
  }

};

module.exports = ReactChildReconciler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0Q2hpbGRSZWNvbmNpbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVlBOztBQUVBLElBQUksa0JBQWtCLFFBQVEsbUJBQVIsQ0FBbEI7O0FBRUosSUFBSSw0QkFBNEIsUUFBUSw2QkFBUixDQUE1QjtBQUNKLElBQUksNkJBQTZCLFFBQVEsOEJBQVIsQ0FBN0I7QUFDSixJQUFJLHNCQUFzQixRQUFRLHVCQUFSLENBQXRCO0FBQ0osSUFBSSxVQUFVLFFBQVEsa0JBQVIsQ0FBVjs7QUFFSixTQUFTLGdCQUFULENBQTBCLGNBQTFCLEVBQTBDLEtBQTFDLEVBQWlELElBQWpELEVBQXVEOztBQUVyRCxNQUFJLFlBQVksZUFBZSxJQUFmLE1BQXlCLFNBQXpCLENBRnFDO0FBR3JELE1BQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixFQUF1QztBQUN6QyxZQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFFBQVEsU0FBUixFQUFtQix1RUFBdUUsdUVBQXZFLEdBQWlKLCtCQUFqSixFQUFrTCxJQUFyTSxDQUF4QyxHQUFxUCxTQUFyUCxDQUR5QztHQUEzQztBQUdBLE1BQUksU0FBUyxJQUFULElBQWlCLFNBQWpCLEVBQTRCO0FBQzlCLG1CQUFlLElBQWYsSUFBdUIsMEJBQTBCLEtBQTFCLEVBQWlDLElBQWpDLENBQXZCLENBRDhCO0dBQWhDO0NBTkY7Ozs7Ozs7QUFnQkEsSUFBSSx1QkFBdUI7Ozs7Ozs7OztBQVN6Qix1QkFBcUIsNkJBQVUsZ0JBQVYsRUFBNEIsV0FBNUIsRUFBeUMsT0FBekMsRUFBa0Q7QUFDckUsUUFBSSxvQkFBb0IsSUFBcEIsRUFBMEI7QUFDNUIsYUFBTyxJQUFQLENBRDRCO0tBQTlCO0FBR0EsUUFBSSxpQkFBaUIsRUFBakIsQ0FKaUU7QUFLckUsd0JBQW9CLGdCQUFwQixFQUFzQyxnQkFBdEMsRUFBd0QsY0FBeEQsRUFMcUU7QUFNckUsV0FBTyxjQUFQLENBTnFFO0dBQWxEOzs7Ozs7Ozs7Ozs7QUFtQnJCLGtCQUFnQix3QkFBVSxZQUFWLEVBQXdCLFlBQXhCLEVBQXNDLFdBQXRDLEVBQW1ELE9BQW5ELEVBQTREOzs7Ozs7QUFNMUUsUUFBSSxDQUFDLFlBQUQsSUFBaUIsQ0FBQyxZQUFELEVBQWU7QUFDbEMsYUFBTyxJQUFQLENBRGtDO0tBQXBDO0FBR0EsUUFBSSxJQUFKLENBVDBFO0FBVTFFLFNBQUssSUFBTCxJQUFhLFlBQWIsRUFBMkI7QUFDekIsVUFBSSxDQUFDLGFBQWEsY0FBYixDQUE0QixJQUE1QixDQUFELEVBQW9DO0FBQ3RDLGlCQURzQztPQUF4QztBQUdBLFVBQUksWUFBWSxnQkFBZ0IsYUFBYSxJQUFiLENBQWhCLENBSlM7QUFLekIsVUFBSSxjQUFjLGFBQWEsVUFBVSxlQUFWLENBTE47QUFNekIsVUFBSSxjQUFjLGFBQWEsSUFBYixDQUFkLENBTnFCO0FBT3pCLFVBQUksYUFBYSxJQUFiLElBQXFCLDJCQUEyQixXQUEzQixFQUF3QyxXQUF4QyxDQUFyQixFQUEyRTtBQUM3RSx3QkFBZ0IsZ0JBQWhCLENBQWlDLFNBQWpDLEVBQTRDLFdBQTVDLEVBQXlELFdBQXpELEVBQXNFLE9BQXRFLEVBRDZFO0FBRTdFLHFCQUFhLElBQWIsSUFBcUIsU0FBckIsQ0FGNkU7T0FBL0UsTUFHTztBQUNMLFlBQUksU0FBSixFQUFlO0FBQ2IsMEJBQWdCLGdCQUFoQixDQUFpQyxTQUFqQyxFQUE0QyxJQUE1QyxFQURhO1NBQWY7O0FBREssWUFLRCxvQkFBb0IsMEJBQTBCLFdBQTFCLEVBQXVDLElBQXZDLENBQXBCLENBTEM7QUFNTCxxQkFBYSxJQUFiLElBQXFCLGlCQUFyQixDQU5LO09BSFA7S0FQRjs7QUFWMEUsU0E4QnJFLElBQUwsSUFBYSxZQUFiLEVBQTJCO0FBQ3pCLFVBQUksYUFBYSxjQUFiLENBQTRCLElBQTVCLEtBQXFDLEVBQUUsZ0JBQWdCLGFBQWEsY0FBYixDQUE0QixJQUE1QixDQUFoQixDQUFGLEVBQXNEO0FBQzdGLHdCQUFnQixnQkFBaEIsQ0FBaUMsYUFBYSxJQUFiLENBQWpDLEVBRDZGO09BQS9GO0tBREY7QUFLQSxXQUFPLFlBQVAsQ0FuQzBFO0dBQTVEOzs7Ozs7Ozs7QUE2Q2hCLG1CQUFpQix5QkFBVSxnQkFBVixFQUE0QjtBQUMzQyxTQUFLLElBQUksSUFBSixJQUFZLGdCQUFqQixFQUFtQztBQUNqQyxVQUFJLGlCQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFKLEVBQTJDO0FBQ3pDLFlBQUksZ0JBQWdCLGlCQUFpQixJQUFqQixDQUFoQixDQURxQztBQUV6Qyx3QkFBZ0IsZ0JBQWhCLENBQWlDLGFBQWpDLEVBRnlDO09BQTNDO0tBREY7R0FEZTs7Q0F6RWY7O0FBb0ZKLE9BQU8sT0FBUCxHQUFpQixvQkFBakIiLCJmaWxlIjoiUmVhY3RDaGlsZFJlY29uY2lsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RDaGlsZFJlY29uY2lsZXJcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RSZWNvbmNpbGVyID0gcmVxdWlyZSgnLi9SZWFjdFJlY29uY2lsZXInKTtcblxudmFyIGluc3RhbnRpYXRlUmVhY3RDb21wb25lbnQgPSByZXF1aXJlKCcuL2luc3RhbnRpYXRlUmVhY3RDb21wb25lbnQnKTtcbnZhciBzaG91bGRVcGRhdGVSZWFjdENvbXBvbmVudCA9IHJlcXVpcmUoJy4vc2hvdWxkVXBkYXRlUmVhY3RDb21wb25lbnQnKTtcbnZhciB0cmF2ZXJzZUFsbENoaWxkcmVuID0gcmVxdWlyZSgnLi90cmF2ZXJzZUFsbENoaWxkcmVuJyk7XG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcblxuZnVuY3Rpb24gaW5zdGFudGlhdGVDaGlsZChjaGlsZEluc3RhbmNlcywgY2hpbGQsIG5hbWUpIHtcbiAgLy8gV2UgZm91bmQgYSBjb21wb25lbnQgaW5zdGFuY2UuXG4gIHZhciBrZXlVbmlxdWUgPSBjaGlsZEluc3RhbmNlc1tuYW1lXSA9PT0gdW5kZWZpbmVkO1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGtleVVuaXF1ZSwgJ2ZsYXR0ZW5DaGlsZHJlbiguLi4pOiBFbmNvdW50ZXJlZCB0d28gY2hpbGRyZW4gd2l0aCB0aGUgc2FtZSBrZXksICcgKyAnYCVzYC4gQ2hpbGQga2V5cyBtdXN0IGJlIHVuaXF1ZTsgd2hlbiB0d28gY2hpbGRyZW4gc2hhcmUgYSBrZXksIG9ubHkgJyArICd0aGUgZmlyc3QgY2hpbGQgd2lsbCBiZSB1c2VkLicsIG5hbWUpIDogdW5kZWZpbmVkO1xuICB9XG4gIGlmIChjaGlsZCAhPSBudWxsICYmIGtleVVuaXF1ZSkge1xuICAgIGNoaWxkSW5zdGFuY2VzW25hbWVdID0gaW5zdGFudGlhdGVSZWFjdENvbXBvbmVudChjaGlsZCwgbnVsbCk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZWFjdENoaWxkUmVjb25jaWxlciBwcm92aWRlcyBoZWxwZXJzIGZvciBpbml0aWFsaXppbmcgb3IgdXBkYXRpbmcgYSBzZXQgb2ZcbiAqIGNoaWxkcmVuLiBJdHMgb3V0cHV0IGlzIHN1aXRhYmxlIGZvciBwYXNzaW5nIGl0IG9udG8gUmVhY3RNdWx0aUNoaWxkIHdoaWNoXG4gKiBkb2VzIGRpZmZlZCByZW9yZGVyaW5nIGFuZCBpbnNlcnRpb24uXG4gKi9cbnZhciBSZWFjdENoaWxkUmVjb25jaWxlciA9IHtcbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIFwibW91bnQgaW1hZ2VcIiBmb3IgZWFjaCBvZiB0aGUgc3VwcGxpZWQgY2hpbGRyZW4uIEluIHRoZSBjYXNlXG4gICAqIG9mIGBSZWFjdERPTUNvbXBvbmVudGAsIGEgbW91bnQgaW1hZ2UgaXMgYSBzdHJpbmcgb2YgbWFya3VwLlxuICAgKlxuICAgKiBAcGFyYW0gez9vYmplY3R9IG5lc3RlZENoaWxkTm9kZXMgTmVzdGVkIGNoaWxkIG1hcHMuXG4gICAqIEByZXR1cm4gez9vYmplY3R9IEEgc2V0IG9mIGNoaWxkIGluc3RhbmNlcy5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBpbnN0YW50aWF0ZUNoaWxkcmVuOiBmdW5jdGlvbiAobmVzdGVkQ2hpbGROb2RlcywgdHJhbnNhY3Rpb24sIGNvbnRleHQpIHtcbiAgICBpZiAobmVzdGVkQ2hpbGROb2RlcyA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIGNoaWxkSW5zdGFuY2VzID0ge307XG4gICAgdHJhdmVyc2VBbGxDaGlsZHJlbihuZXN0ZWRDaGlsZE5vZGVzLCBpbnN0YW50aWF0ZUNoaWxkLCBjaGlsZEluc3RhbmNlcyk7XG4gICAgcmV0dXJuIGNoaWxkSW5zdGFuY2VzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSByZW5kZXJlZCBjaGlsZHJlbiBhbmQgcmV0dXJucyBhIG5ldyBzZXQgb2YgY2hpbGRyZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7P29iamVjdH0gcHJldkNoaWxkcmVuIFByZXZpb3VzbHkgaW5pdGlhbGl6ZWQgc2V0IG9mIGNoaWxkcmVuLlxuICAgKiBAcGFyYW0gez9vYmplY3R9IG5leHRDaGlsZHJlbiBGbGF0IGNoaWxkIGVsZW1lbnQgbWFwcy5cbiAgICogQHBhcmFtIHtSZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9ufSB0cmFuc2FjdGlvblxuICAgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dFxuICAgKiBAcmV0dXJuIHs/b2JqZWN0fSBBIG5ldyBzZXQgb2YgY2hpbGQgaW5zdGFuY2VzLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHVwZGF0ZUNoaWxkcmVuOiBmdW5jdGlvbiAocHJldkNoaWxkcmVuLCBuZXh0Q2hpbGRyZW4sIHRyYW5zYWN0aW9uLCBjb250ZXh0KSB7XG4gICAgLy8gV2UgY3VycmVudGx5IGRvbid0IGhhdmUgYSB3YXkgdG8gdHJhY2sgbW92ZXMgaGVyZSBidXQgaWYgd2UgdXNlIGl0ZXJhdG9yc1xuICAgIC8vIGluc3RlYWQgb2YgZm9yLi5pbiB3ZSBjYW4gemlwIHRoZSBpdGVyYXRvcnMgYW5kIGNoZWNrIGlmIGFuIGl0ZW0gaGFzXG4gICAgLy8gbW92ZWQuXG4gICAgLy8gVE9ETzogSWYgbm90aGluZyBoYXMgY2hhbmdlZCwgcmV0dXJuIHRoZSBwcmV2Q2hpbGRyZW4gb2JqZWN0IHNvIHRoYXQgd2VcbiAgICAvLyBjYW4gcXVpY2tseSBiYWlsb3V0IGlmIG5vdGhpbmcgaGFzIGNoYW5nZWQuXG4gICAgaWYgKCFuZXh0Q2hpbGRyZW4gJiYgIXByZXZDaGlsZHJlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBuYW1lO1xuICAgIGZvciAobmFtZSBpbiBuZXh0Q2hpbGRyZW4pIHtcbiAgICAgIGlmICghbmV4dENoaWxkcmVuLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdmFyIHByZXZDaGlsZCA9IHByZXZDaGlsZHJlbiAmJiBwcmV2Q2hpbGRyZW5bbmFtZV07XG4gICAgICB2YXIgcHJldkVsZW1lbnQgPSBwcmV2Q2hpbGQgJiYgcHJldkNoaWxkLl9jdXJyZW50RWxlbWVudDtcbiAgICAgIHZhciBuZXh0RWxlbWVudCA9IG5leHRDaGlsZHJlbltuYW1lXTtcbiAgICAgIGlmIChwcmV2Q2hpbGQgIT0gbnVsbCAmJiBzaG91bGRVcGRhdGVSZWFjdENvbXBvbmVudChwcmV2RWxlbWVudCwgbmV4dEVsZW1lbnQpKSB7XG4gICAgICAgIFJlYWN0UmVjb25jaWxlci5yZWNlaXZlQ29tcG9uZW50KHByZXZDaGlsZCwgbmV4dEVsZW1lbnQsIHRyYW5zYWN0aW9uLCBjb250ZXh0KTtcbiAgICAgICAgbmV4dENoaWxkcmVuW25hbWVdID0gcHJldkNoaWxkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHByZXZDaGlsZCkge1xuICAgICAgICAgIFJlYWN0UmVjb25jaWxlci51bm1vdW50Q29tcG9uZW50KHByZXZDaGlsZCwgbmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhlIGNoaWxkIG11c3QgYmUgaW5zdGFudGlhdGVkIGJlZm9yZSBpdCdzIG1vdW50ZWQuXG4gICAgICAgIHZhciBuZXh0Q2hpbGRJbnN0YW5jZSA9IGluc3RhbnRpYXRlUmVhY3RDb21wb25lbnQobmV4dEVsZW1lbnQsIG51bGwpO1xuICAgICAgICBuZXh0Q2hpbGRyZW5bbmFtZV0gPSBuZXh0Q2hpbGRJbnN0YW5jZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gVW5tb3VudCBjaGlsZHJlbiB0aGF0IGFyZSBubyBsb25nZXIgcHJlc2VudC5cbiAgICBmb3IgKG5hbWUgaW4gcHJldkNoaWxkcmVuKSB7XG4gICAgICBpZiAocHJldkNoaWxkcmVuLmhhc093blByb3BlcnR5KG5hbWUpICYmICEobmV4dENoaWxkcmVuICYmIG5leHRDaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShuYW1lKSkpIHtcbiAgICAgICAgUmVhY3RSZWNvbmNpbGVyLnVubW91bnRDb21wb25lbnQocHJldkNoaWxkcmVuW25hbWVdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5leHRDaGlsZHJlbjtcbiAgfSxcblxuICAvKipcbiAgICogVW5tb3VudHMgYWxsIHJlbmRlcmVkIGNoaWxkcmVuLiBUaGlzIHNob3VsZCBiZSB1c2VkIHRvIGNsZWFuIHVwIGNoaWxkcmVuXG4gICAqIHdoZW4gdGhpcyBjb21wb25lbnQgaXMgdW5tb3VudGVkLlxuICAgKlxuICAgKiBAcGFyYW0gez9vYmplY3R9IHJlbmRlcmVkQ2hpbGRyZW4gUHJldmlvdXNseSBpbml0aWFsaXplZCBzZXQgb2YgY2hpbGRyZW4uXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgdW5tb3VudENoaWxkcmVuOiBmdW5jdGlvbiAocmVuZGVyZWRDaGlsZHJlbikge1xuICAgIGZvciAodmFyIG5hbWUgaW4gcmVuZGVyZWRDaGlsZHJlbikge1xuICAgICAgaWYgKHJlbmRlcmVkQ2hpbGRyZW4uaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgdmFyIHJlbmRlcmVkQ2hpbGQgPSByZW5kZXJlZENoaWxkcmVuW25hbWVdO1xuICAgICAgICBSZWFjdFJlY29uY2lsZXIudW5tb3VudENvbXBvbmVudChyZW5kZXJlZENoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdENoaWxkUmVjb25jaWxlcjsiXX0=