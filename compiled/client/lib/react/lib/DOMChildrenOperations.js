/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DOMChildrenOperations
 * @typechecks static-only
 */

'use strict';

var Danger = require('./Danger');
var ReactMultiChildUpdateTypes = require('./ReactMultiChildUpdateTypes');
var ReactPerf = require('./ReactPerf');

var setInnerHTML = require('./setInnerHTML');
var setTextContent = require('./setTextContent');
var invariant = require('fbjs/lib/invariant');

/**
 * Inserts `childNode` as a child of `parentNode` at the `index`.
 *
 * @param {DOMElement} parentNode Parent node in which to insert.
 * @param {DOMElement} childNode Child node to insert.
 * @param {number} index Index at which to insert the child.
 * @internal
 */
function insertChildAt(parentNode, childNode, index) {
  // By exploiting arrays returning `undefined` for an undefined index, we can
  // rely exclusively on `insertBefore(node, null)` instead of also using
  // `appendChild(node)`. However, using `undefined` is not allowed by all
  // browsers so we must replace it with `null`.

  // fix render order error in safari
  // IE8 will throw error when index out of list size.
  var beforeChild = index >= parentNode.childNodes.length ? null : parentNode.childNodes.item(index);

  parentNode.insertBefore(childNode, beforeChild);
}

/**
 * Operations for updating with DOM children.
 */
var DOMChildrenOperations = {

  dangerouslyReplaceNodeWithMarkup: Danger.dangerouslyReplaceNodeWithMarkup,

  updateTextContent: setTextContent,

  /**
   * Updates a component's children by processing a series of updates. The
   * update configurations are each expected to have a `parentNode` property.
   *
   * @param {array<object>} updates List of update configurations.
   * @param {array<string>} markupList List of markup strings.
   * @internal
   */
  processUpdates: function processUpdates(updates, markupList) {
    var update;
    // Mapping from parent IDs to initial child orderings.
    var initialChildren = null;
    // List of children that will be moved or removed.
    var updatedChildren = null;

    for (var i = 0; i < updates.length; i++) {
      update = updates[i];
      if (update.type === ReactMultiChildUpdateTypes.MOVE_EXISTING || update.type === ReactMultiChildUpdateTypes.REMOVE_NODE) {
        var updatedIndex = update.fromIndex;
        var updatedChild = update.parentNode.childNodes[updatedIndex];
        var parentID = update.parentID;

        !updatedChild ? process.env.NODE_ENV !== 'production' ? invariant(false, 'processUpdates(): Unable to find child %s of element. This ' + 'probably means the DOM was unexpectedly mutated (e.g., by the ' + 'browser), usually due to forgetting a <tbody> when using tables, ' + 'nesting tags like <form>, <p>, or <a>, or using non-SVG elements ' + 'in an <svg> parent. Try inspecting the child nodes of the element ' + 'with React ID `%s`.', updatedIndex, parentID) : invariant(false) : undefined;

        initialChildren = initialChildren || {};
        initialChildren[parentID] = initialChildren[parentID] || [];
        initialChildren[parentID][updatedIndex] = updatedChild;

        updatedChildren = updatedChildren || [];
        updatedChildren.push(updatedChild);
      }
    }

    var renderedMarkup;
    // markupList is either a list of markup or just a list of elements
    if (markupList.length && typeof markupList[0] === 'string') {
      renderedMarkup = Danger.dangerouslyRenderMarkup(markupList);
    } else {
      renderedMarkup = markupList;
    }

    // Remove updated children first so that `toIndex` is consistent.
    if (updatedChildren) {
      for (var j = 0; j < updatedChildren.length; j++) {
        updatedChildren[j].parentNode.removeChild(updatedChildren[j]);
      }
    }

    for (var k = 0; k < updates.length; k++) {
      update = updates[k];
      switch (update.type) {
        case ReactMultiChildUpdateTypes.INSERT_MARKUP:
          insertChildAt(update.parentNode, renderedMarkup[update.markupIndex], update.toIndex);
          break;
        case ReactMultiChildUpdateTypes.MOVE_EXISTING:
          insertChildAt(update.parentNode, initialChildren[update.parentID][update.fromIndex], update.toIndex);
          break;
        case ReactMultiChildUpdateTypes.SET_MARKUP:
          setInnerHTML(update.parentNode, update.content);
          break;
        case ReactMultiChildUpdateTypes.TEXT_CONTENT:
          setTextContent(update.parentNode, update.content);
          break;
        case ReactMultiChildUpdateTypes.REMOVE_NODE:
          // Already removed by the for-loop above.
          break;
      }
    }
  }

};

ReactPerf.measureMethods(DOMChildrenOperations, 'DOMChildrenOperations', {
  updateTextContent: 'updateTextContent'
});

module.exports = DOMChildrenOperations;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0RPTUNoaWxkcmVuT3BlcmF0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLFNBQVMsUUFBUSxVQUFSLENBQWI7QUFDQSxJQUFJLDZCQUE2QixRQUFRLDhCQUFSLENBQWpDO0FBQ0EsSUFBSSxZQUFZLFFBQVEsYUFBUixDQUFoQjs7QUFFQSxJQUFJLGVBQWUsUUFBUSxnQkFBUixDQUFuQjtBQUNBLElBQUksaUJBQWlCLFFBQVEsa0JBQVIsQ0FBckI7QUFDQSxJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFoQjs7Ozs7Ozs7OztBQVVBLFNBQVMsYUFBVCxDQUF1QixVQUF2QixFQUFtQyxTQUFuQyxFQUE4QyxLQUE5QyxFQUFxRDs7Ozs7Ozs7QUFRbkQsTUFBSSxjQUFjLFNBQVMsV0FBVyxVQUFYLENBQXNCLE1BQS9CLEdBQXdDLElBQXhDLEdBQStDLFdBQVcsVUFBWCxDQUFzQixJQUF0QixDQUEyQixLQUEzQixDQUFqRTs7QUFFQSxhQUFXLFlBQVgsQ0FBd0IsU0FBeEIsRUFBbUMsV0FBbkM7QUFDRDs7Ozs7QUFLRCxJQUFJLHdCQUF3Qjs7QUFFMUIsb0NBQWtDLE9BQU8sZ0NBRmY7O0FBSTFCLHFCQUFtQixjQUpPOzs7Ozs7Ozs7O0FBYzFCLGtCQUFnQix3QkFBVSxPQUFWLEVBQW1CLFVBQW5CLEVBQStCO0FBQzdDLFFBQUksTUFBSjs7QUFFQSxRQUFJLGtCQUFrQixJQUF0Qjs7QUFFQSxRQUFJLGtCQUFrQixJQUF0Qjs7QUFFQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksUUFBUSxNQUE1QixFQUFvQyxHQUFwQyxFQUF5QztBQUN2QyxlQUFTLFFBQVEsQ0FBUixDQUFUO0FBQ0EsVUFBSSxPQUFPLElBQVAsS0FBZ0IsMkJBQTJCLGFBQTNDLElBQTRELE9BQU8sSUFBUCxLQUFnQiwyQkFBMkIsV0FBM0csRUFBd0g7QUFDdEgsWUFBSSxlQUFlLE9BQU8sU0FBMUI7QUFDQSxZQUFJLGVBQWUsT0FBTyxVQUFQLENBQWtCLFVBQWxCLENBQTZCLFlBQTdCLENBQW5CO0FBQ0EsWUFBSSxXQUFXLE9BQU8sUUFBdEI7O0FBRUEsU0FBQyxZQUFELEdBQWdCLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLGdFQUFnRSxnRUFBaEUsR0FBbUksbUVBQW5JLEdBQXlNLG1FQUF6TSxHQUErUSxvRUFBL1EsR0FBc1YscUJBQXZXLEVBQThYLFlBQTlYLEVBQTRZLFFBQTVZLENBQXhDLEdBQWdjLFVBQVUsS0FBVixDQUFoZCxHQUFtZSxTQUFuZTs7QUFFQSwwQkFBa0IsbUJBQW1CLEVBQXJDO0FBQ0Esd0JBQWdCLFFBQWhCLElBQTRCLGdCQUFnQixRQUFoQixLQUE2QixFQUF6RDtBQUNBLHdCQUFnQixRQUFoQixFQUEwQixZQUExQixJQUEwQyxZQUExQzs7QUFFQSwwQkFBa0IsbUJBQW1CLEVBQXJDO0FBQ0Esd0JBQWdCLElBQWhCLENBQXFCLFlBQXJCO0FBQ0Q7QUFDRjs7QUFFRCxRQUFJLGNBQUo7O0FBRUEsUUFBSSxXQUFXLE1BQVgsSUFBcUIsT0FBTyxXQUFXLENBQVgsQ0FBUCxLQUF5QixRQUFsRCxFQUE0RDtBQUMxRCx1QkFBaUIsT0FBTyx1QkFBUCxDQUErQixVQUEvQixDQUFqQjtBQUNELEtBRkQsTUFFTztBQUNMLHVCQUFpQixVQUFqQjtBQUNEOzs7QUFHRCxRQUFJLGVBQUosRUFBcUI7QUFDbkIsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLGdCQUFnQixNQUFwQyxFQUE0QyxHQUE1QyxFQUFpRDtBQUMvQyx3QkFBZ0IsQ0FBaEIsRUFBbUIsVUFBbkIsQ0FBOEIsV0FBOUIsQ0FBMEMsZ0JBQWdCLENBQWhCLENBQTFDO0FBQ0Q7QUFDRjs7QUFFRCxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksUUFBUSxNQUE1QixFQUFvQyxHQUFwQyxFQUF5QztBQUN2QyxlQUFTLFFBQVEsQ0FBUixDQUFUO0FBQ0EsY0FBUSxPQUFPLElBQWY7QUFDRSxhQUFLLDJCQUEyQixhQUFoQztBQUNFLHdCQUFjLE9BQU8sVUFBckIsRUFBaUMsZUFBZSxPQUFPLFdBQXRCLENBQWpDLEVBQXFFLE9BQU8sT0FBNUU7QUFDQTtBQUNGLGFBQUssMkJBQTJCLGFBQWhDO0FBQ0Usd0JBQWMsT0FBTyxVQUFyQixFQUFpQyxnQkFBZ0IsT0FBTyxRQUF2QixFQUFpQyxPQUFPLFNBQXhDLENBQWpDLEVBQXFGLE9BQU8sT0FBNUY7QUFDQTtBQUNGLGFBQUssMkJBQTJCLFVBQWhDO0FBQ0UsdUJBQWEsT0FBTyxVQUFwQixFQUFnQyxPQUFPLE9BQXZDO0FBQ0E7QUFDRixhQUFLLDJCQUEyQixZQUFoQztBQUNFLHlCQUFlLE9BQU8sVUFBdEIsRUFBa0MsT0FBTyxPQUF6QztBQUNBO0FBQ0YsYUFBSywyQkFBMkIsV0FBaEM7O0FBRUU7QUFmSjtBQWlCRDtBQUNGOztBQTFFeUIsQ0FBNUI7O0FBOEVBLFVBQVUsY0FBVixDQUF5QixxQkFBekIsRUFBZ0QsdUJBQWhELEVBQXlFO0FBQ3ZFLHFCQUFtQjtBQURvRCxDQUF6RTs7QUFJQSxPQUFPLE9BQVAsR0FBaUIscUJBQWpCIiwiZmlsZSI6IkRPTUNoaWxkcmVuT3BlcmF0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBET01DaGlsZHJlbk9wZXJhdGlvbnNcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRGFuZ2VyID0gcmVxdWlyZSgnLi9EYW5nZXInKTtcbnZhciBSZWFjdE11bHRpQ2hpbGRVcGRhdGVUeXBlcyA9IHJlcXVpcmUoJy4vUmVhY3RNdWx0aUNoaWxkVXBkYXRlVHlwZXMnKTtcbnZhciBSZWFjdFBlcmYgPSByZXF1aXJlKCcuL1JlYWN0UGVyZicpO1xuXG52YXIgc2V0SW5uZXJIVE1MID0gcmVxdWlyZSgnLi9zZXRJbm5lckhUTUwnKTtcbnZhciBzZXRUZXh0Q29udGVudCA9IHJlcXVpcmUoJy4vc2V0VGV4dENvbnRlbnQnKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcblxuLyoqXG4gKiBJbnNlcnRzIGBjaGlsZE5vZGVgIGFzIGEgY2hpbGQgb2YgYHBhcmVudE5vZGVgIGF0IHRoZSBgaW5kZXhgLlxuICpcbiAqIEBwYXJhbSB7RE9NRWxlbWVudH0gcGFyZW50Tm9kZSBQYXJlbnQgbm9kZSBpbiB3aGljaCB0byBpbnNlcnQuXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGNoaWxkTm9kZSBDaGlsZCBub2RlIHRvIGluc2VydC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBJbmRleCBhdCB3aGljaCB0byBpbnNlcnQgdGhlIGNoaWxkLlxuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIGluc2VydENoaWxkQXQocGFyZW50Tm9kZSwgY2hpbGROb2RlLCBpbmRleCkge1xuICAvLyBCeSBleHBsb2l0aW5nIGFycmF5cyByZXR1cm5pbmcgYHVuZGVmaW5lZGAgZm9yIGFuIHVuZGVmaW5lZCBpbmRleCwgd2UgY2FuXG4gIC8vIHJlbHkgZXhjbHVzaXZlbHkgb24gYGluc2VydEJlZm9yZShub2RlLCBudWxsKWAgaW5zdGVhZCBvZiBhbHNvIHVzaW5nXG4gIC8vIGBhcHBlbmRDaGlsZChub2RlKWAuIEhvd2V2ZXIsIHVzaW5nIGB1bmRlZmluZWRgIGlzIG5vdCBhbGxvd2VkIGJ5IGFsbFxuICAvLyBicm93c2VycyBzbyB3ZSBtdXN0IHJlcGxhY2UgaXQgd2l0aCBgbnVsbGAuXG5cbiAgLy8gZml4IHJlbmRlciBvcmRlciBlcnJvciBpbiBzYWZhcmlcbiAgLy8gSUU4IHdpbGwgdGhyb3cgZXJyb3Igd2hlbiBpbmRleCBvdXQgb2YgbGlzdCBzaXplLlxuICB2YXIgYmVmb3JlQ2hpbGQgPSBpbmRleCA+PSBwYXJlbnROb2RlLmNoaWxkTm9kZXMubGVuZ3RoID8gbnVsbCA6IHBhcmVudE5vZGUuY2hpbGROb2Rlcy5pdGVtKGluZGV4KTtcblxuICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShjaGlsZE5vZGUsIGJlZm9yZUNoaWxkKTtcbn1cblxuLyoqXG4gKiBPcGVyYXRpb25zIGZvciB1cGRhdGluZyB3aXRoIERPTSBjaGlsZHJlbi5cbiAqL1xudmFyIERPTUNoaWxkcmVuT3BlcmF0aW9ucyA9IHtcblxuICBkYW5nZXJvdXNseVJlcGxhY2VOb2RlV2l0aE1hcmt1cDogRGFuZ2VyLmRhbmdlcm91c2x5UmVwbGFjZU5vZGVXaXRoTWFya3VwLFxuXG4gIHVwZGF0ZVRleHRDb250ZW50OiBzZXRUZXh0Q29udGVudCxcblxuICAvKipcbiAgICogVXBkYXRlcyBhIGNvbXBvbmVudCdzIGNoaWxkcmVuIGJ5IHByb2Nlc3NpbmcgYSBzZXJpZXMgb2YgdXBkYXRlcy4gVGhlXG4gICAqIHVwZGF0ZSBjb25maWd1cmF0aW9ucyBhcmUgZWFjaCBleHBlY3RlZCB0byBoYXZlIGEgYHBhcmVudE5vZGVgIHByb3BlcnR5LlxuICAgKlxuICAgKiBAcGFyYW0ge2FycmF5PG9iamVjdD59IHVwZGF0ZXMgTGlzdCBvZiB1cGRhdGUgY29uZmlndXJhdGlvbnMuXG4gICAqIEBwYXJhbSB7YXJyYXk8c3RyaW5nPn0gbWFya3VwTGlzdCBMaXN0IG9mIG1hcmt1cCBzdHJpbmdzLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb2Nlc3NVcGRhdGVzOiBmdW5jdGlvbiAodXBkYXRlcywgbWFya3VwTGlzdCkge1xuICAgIHZhciB1cGRhdGU7XG4gICAgLy8gTWFwcGluZyBmcm9tIHBhcmVudCBJRHMgdG8gaW5pdGlhbCBjaGlsZCBvcmRlcmluZ3MuXG4gICAgdmFyIGluaXRpYWxDaGlsZHJlbiA9IG51bGw7XG4gICAgLy8gTGlzdCBvZiBjaGlsZHJlbiB0aGF0IHdpbGwgYmUgbW92ZWQgb3IgcmVtb3ZlZC5cbiAgICB2YXIgdXBkYXRlZENoaWxkcmVuID0gbnVsbDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdXBkYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdXBkYXRlID0gdXBkYXRlc1tpXTtcbiAgICAgIGlmICh1cGRhdGUudHlwZSA9PT0gUmVhY3RNdWx0aUNoaWxkVXBkYXRlVHlwZXMuTU9WRV9FWElTVElORyB8fCB1cGRhdGUudHlwZSA9PT0gUmVhY3RNdWx0aUNoaWxkVXBkYXRlVHlwZXMuUkVNT1ZFX05PREUpIHtcbiAgICAgICAgdmFyIHVwZGF0ZWRJbmRleCA9IHVwZGF0ZS5mcm9tSW5kZXg7XG4gICAgICAgIHZhciB1cGRhdGVkQ2hpbGQgPSB1cGRhdGUucGFyZW50Tm9kZS5jaGlsZE5vZGVzW3VwZGF0ZWRJbmRleF07XG4gICAgICAgIHZhciBwYXJlbnRJRCA9IHVwZGF0ZS5wYXJlbnRJRDtcblxuICAgICAgICAhdXBkYXRlZENoaWxkID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ3Byb2Nlc3NVcGRhdGVzKCk6IFVuYWJsZSB0byBmaW5kIGNoaWxkICVzIG9mIGVsZW1lbnQuIFRoaXMgJyArICdwcm9iYWJseSBtZWFucyB0aGUgRE9NIHdhcyB1bmV4cGVjdGVkbHkgbXV0YXRlZCAoZS5nLiwgYnkgdGhlICcgKyAnYnJvd3NlciksIHVzdWFsbHkgZHVlIHRvIGZvcmdldHRpbmcgYSA8dGJvZHk+IHdoZW4gdXNpbmcgdGFibGVzLCAnICsgJ25lc3RpbmcgdGFncyBsaWtlIDxmb3JtPiwgPHA+LCBvciA8YT4sIG9yIHVzaW5nIG5vbi1TVkcgZWxlbWVudHMgJyArICdpbiBhbiA8c3ZnPiBwYXJlbnQuIFRyeSBpbnNwZWN0aW5nIHRoZSBjaGlsZCBub2RlcyBvZiB0aGUgZWxlbWVudCAnICsgJ3dpdGggUmVhY3QgSUQgYCVzYC4nLCB1cGRhdGVkSW5kZXgsIHBhcmVudElEKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgaW5pdGlhbENoaWxkcmVuID0gaW5pdGlhbENoaWxkcmVuIHx8IHt9O1xuICAgICAgICBpbml0aWFsQ2hpbGRyZW5bcGFyZW50SURdID0gaW5pdGlhbENoaWxkcmVuW3BhcmVudElEXSB8fCBbXTtcbiAgICAgICAgaW5pdGlhbENoaWxkcmVuW3BhcmVudElEXVt1cGRhdGVkSW5kZXhdID0gdXBkYXRlZENoaWxkO1xuXG4gICAgICAgIHVwZGF0ZWRDaGlsZHJlbiA9IHVwZGF0ZWRDaGlsZHJlbiB8fCBbXTtcbiAgICAgICAgdXBkYXRlZENoaWxkcmVuLnB1c2godXBkYXRlZENoaWxkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcmVuZGVyZWRNYXJrdXA7XG4gICAgLy8gbWFya3VwTGlzdCBpcyBlaXRoZXIgYSBsaXN0IG9mIG1hcmt1cCBvciBqdXN0IGEgbGlzdCBvZiBlbGVtZW50c1xuICAgIGlmIChtYXJrdXBMaXN0Lmxlbmd0aCAmJiB0eXBlb2YgbWFya3VwTGlzdFswXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJlbmRlcmVkTWFya3VwID0gRGFuZ2VyLmRhbmdlcm91c2x5UmVuZGVyTWFya3VwKG1hcmt1cExpc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZW5kZXJlZE1hcmt1cCA9IG1hcmt1cExpc3Q7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIHVwZGF0ZWQgY2hpbGRyZW4gZmlyc3Qgc28gdGhhdCBgdG9JbmRleGAgaXMgY29uc2lzdGVudC5cbiAgICBpZiAodXBkYXRlZENoaWxkcmVuKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHVwZGF0ZWRDaGlsZHJlbi5sZW5ndGg7IGorKykge1xuICAgICAgICB1cGRhdGVkQ2hpbGRyZW5bal0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh1cGRhdGVkQ2hpbGRyZW5bal0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdXBkYXRlcy5sZW5ndGg7IGsrKykge1xuICAgICAgdXBkYXRlID0gdXBkYXRlc1trXTtcbiAgICAgIHN3aXRjaCAodXBkYXRlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBSZWFjdE11bHRpQ2hpbGRVcGRhdGVUeXBlcy5JTlNFUlRfTUFSS1VQOlxuICAgICAgICAgIGluc2VydENoaWxkQXQodXBkYXRlLnBhcmVudE5vZGUsIHJlbmRlcmVkTWFya3VwW3VwZGF0ZS5tYXJrdXBJbmRleF0sIHVwZGF0ZS50b0luZGV4KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBSZWFjdE11bHRpQ2hpbGRVcGRhdGVUeXBlcy5NT1ZFX0VYSVNUSU5HOlxuICAgICAgICAgIGluc2VydENoaWxkQXQodXBkYXRlLnBhcmVudE5vZGUsIGluaXRpYWxDaGlsZHJlblt1cGRhdGUucGFyZW50SURdW3VwZGF0ZS5mcm9tSW5kZXhdLCB1cGRhdGUudG9JbmRleCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUmVhY3RNdWx0aUNoaWxkVXBkYXRlVHlwZXMuU0VUX01BUktVUDpcbiAgICAgICAgICBzZXRJbm5lckhUTUwodXBkYXRlLnBhcmVudE5vZGUsIHVwZGF0ZS5jb250ZW50KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBSZWFjdE11bHRpQ2hpbGRVcGRhdGVUeXBlcy5URVhUX0NPTlRFTlQ6XG4gICAgICAgICAgc2V0VGV4dENvbnRlbnQodXBkYXRlLnBhcmVudE5vZGUsIHVwZGF0ZS5jb250ZW50KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBSZWFjdE11bHRpQ2hpbGRVcGRhdGVUeXBlcy5SRU1PVkVfTk9ERTpcbiAgICAgICAgICAvLyBBbHJlYWR5IHJlbW92ZWQgYnkgdGhlIGZvci1sb29wIGFib3ZlLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuXG5SZWFjdFBlcmYubWVhc3VyZU1ldGhvZHMoRE9NQ2hpbGRyZW5PcGVyYXRpb25zLCAnRE9NQ2hpbGRyZW5PcGVyYXRpb25zJywge1xuICB1cGRhdGVUZXh0Q29udGVudDogJ3VwZGF0ZVRleHRDb250ZW50J1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRE9NQ2hpbGRyZW5PcGVyYXRpb25zOyJdfQ==