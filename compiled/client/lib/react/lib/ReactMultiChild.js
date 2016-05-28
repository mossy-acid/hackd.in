/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactMultiChild
 * @typechecks static-only
 */

'use strict';

var ReactComponentEnvironment = require('./ReactComponentEnvironment');
var ReactMultiChildUpdateTypes = require('./ReactMultiChildUpdateTypes');

var ReactCurrentOwner = require('./ReactCurrentOwner');
var ReactReconciler = require('./ReactReconciler');
var ReactChildReconciler = require('./ReactChildReconciler');

var flattenChildren = require('./flattenChildren');

/**
 * Updating children of a component may trigger recursive updates. The depth is
 * used to batch recursive updates to render markup more efficiently.
 *
 * @type {number}
 * @private
 */
var updateDepth = 0;

/**
 * Queue of update configuration objects.
 *
 * Each object has a `type` property that is in `ReactMultiChildUpdateTypes`.
 *
 * @type {array<object>}
 * @private
 */
var updateQueue = [];

/**
 * Queue of markup to be rendered.
 *
 * @type {array<string>}
 * @private
 */
var markupQueue = [];

/**
 * Enqueues markup to be rendered and inserted at a supplied index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {string} markup Markup that renders into an element.
 * @param {number} toIndex Destination index.
 * @private
 */
function enqueueInsertMarkup(parentID, markup, toIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.INSERT_MARKUP,
    markupIndex: markupQueue.push(markup) - 1,
    content: null,
    fromIndex: null,
    toIndex: toIndex
  });
}

/**
 * Enqueues moving an existing element to another index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {number} fromIndex Source index of the existing element.
 * @param {number} toIndex Destination index of the element.
 * @private
 */
function enqueueMove(parentID, fromIndex, toIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.MOVE_EXISTING,
    markupIndex: null,
    content: null,
    fromIndex: fromIndex,
    toIndex: toIndex
  });
}

/**
 * Enqueues removing an element at an index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {number} fromIndex Index of the element to remove.
 * @private
 */
function enqueueRemove(parentID, fromIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.REMOVE_NODE,
    markupIndex: null,
    content: null,
    fromIndex: fromIndex,
    toIndex: null
  });
}

/**
 * Enqueues setting the markup of a node.
 *
 * @param {string} parentID ID of the parent component.
 * @param {string} markup Markup that renders into an element.
 * @private
 */
function enqueueSetMarkup(parentID, markup) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.SET_MARKUP,
    markupIndex: null,
    content: markup,
    fromIndex: null,
    toIndex: null
  });
}

/**
 * Enqueues setting the text content.
 *
 * @param {string} parentID ID of the parent component.
 * @param {string} textContent Text content to set.
 * @private
 */
function enqueueTextContent(parentID, textContent) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.TEXT_CONTENT,
    markupIndex: null,
    content: textContent,
    fromIndex: null,
    toIndex: null
  });
}

/**
 * Processes any enqueued updates.
 *
 * @private
 */
function processQueue() {
  if (updateQueue.length) {
    ReactComponentEnvironment.processChildrenUpdates(updateQueue, markupQueue);
    clearQueue();
  }
}

/**
 * Clears any enqueued updates.
 *
 * @private
 */
function clearQueue() {
  updateQueue.length = 0;
  markupQueue.length = 0;
}

/**
 * ReactMultiChild are capable of reconciling multiple children.
 *
 * @class ReactMultiChild
 * @internal
 */
var ReactMultiChild = {

  /**
   * Provides common functionality for components that must reconcile multiple
   * children. This is used by `ReactDOMComponent` to mount, update, and
   * unmount child components.
   *
   * @lends {ReactMultiChild.prototype}
   */
  Mixin: {

    _reconcilerInstantiateChildren: function _reconcilerInstantiateChildren(nestedChildren, transaction, context) {
      if (process.env.NODE_ENV !== 'production') {
        if (this._currentElement) {
          try {
            ReactCurrentOwner.current = this._currentElement._owner;
            return ReactChildReconciler.instantiateChildren(nestedChildren, transaction, context);
          } finally {
            ReactCurrentOwner.current = null;
          }
        }
      }
      return ReactChildReconciler.instantiateChildren(nestedChildren, transaction, context);
    },

    _reconcilerUpdateChildren: function _reconcilerUpdateChildren(prevChildren, nextNestedChildrenElements, transaction, context) {
      var nextChildren;
      if (process.env.NODE_ENV !== 'production') {
        if (this._currentElement) {
          try {
            ReactCurrentOwner.current = this._currentElement._owner;
            nextChildren = flattenChildren(nextNestedChildrenElements);
          } finally {
            ReactCurrentOwner.current = null;
          }
          return ReactChildReconciler.updateChildren(prevChildren, nextChildren, transaction, context);
        }
      }
      nextChildren = flattenChildren(nextNestedChildrenElements);
      return ReactChildReconciler.updateChildren(prevChildren, nextChildren, transaction, context);
    },

    /**
     * Generates a "mount image" for each of the supplied children. In the case
     * of `ReactDOMComponent`, a mount image is a string of markup.
     *
     * @param {?object} nestedChildren Nested child maps.
     * @return {array} An array of mounted representations.
     * @internal
     */
    mountChildren: function mountChildren(nestedChildren, transaction, context) {
      var children = this._reconcilerInstantiateChildren(nestedChildren, transaction, context);
      this._renderedChildren = children;
      var mountImages = [];
      var index = 0;
      for (var name in children) {
        if (children.hasOwnProperty(name)) {
          var child = children[name];
          // Inlined for performance, see `ReactInstanceHandles.createReactID`.
          var rootID = this._rootNodeID + name;
          var mountImage = ReactReconciler.mountComponent(child, rootID, transaction, context);
          child._mountIndex = index++;
          mountImages.push(mountImage);
        }
      }
      return mountImages;
    },

    /**
     * Replaces any rendered children with a text content string.
     *
     * @param {string} nextContent String of content.
     * @internal
     */
    updateTextContent: function updateTextContent(nextContent) {
      updateDepth++;
      var errorThrown = true;
      try {
        var prevChildren = this._renderedChildren;
        // Remove any rendered children.
        ReactChildReconciler.unmountChildren(prevChildren);
        // TODO: The setTextContent operation should be enough
        for (var name in prevChildren) {
          if (prevChildren.hasOwnProperty(name)) {
            this._unmountChild(prevChildren[name]);
          }
        }
        // Set new text content.
        this.setTextContent(nextContent);
        errorThrown = false;
      } finally {
        updateDepth--;
        if (!updateDepth) {
          if (errorThrown) {
            clearQueue();
          } else {
            processQueue();
          }
        }
      }
    },

    /**
     * Replaces any rendered children with a markup string.
     *
     * @param {string} nextMarkup String of markup.
     * @internal
     */
    updateMarkup: function updateMarkup(nextMarkup) {
      updateDepth++;
      var errorThrown = true;
      try {
        var prevChildren = this._renderedChildren;
        // Remove any rendered children.
        ReactChildReconciler.unmountChildren(prevChildren);
        for (var name in prevChildren) {
          if (prevChildren.hasOwnProperty(name)) {
            this._unmountChildByName(prevChildren[name], name);
          }
        }
        this.setMarkup(nextMarkup);
        errorThrown = false;
      } finally {
        updateDepth--;
        if (!updateDepth) {
          if (errorThrown) {
            clearQueue();
          } else {
            processQueue();
          }
        }
      }
    },

    /**
     * Updates the rendered children with new children.
     *
     * @param {?object} nextNestedChildrenElements Nested child element maps.
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    updateChildren: function updateChildren(nextNestedChildrenElements, transaction, context) {
      updateDepth++;
      var errorThrown = true;
      try {
        this._updateChildren(nextNestedChildrenElements, transaction, context);
        errorThrown = false;
      } finally {
        updateDepth--;
        if (!updateDepth) {
          if (errorThrown) {
            clearQueue();
          } else {
            processQueue();
          }
        }
      }
    },

    /**
     * Improve performance by isolating this hot code path from the try/catch
     * block in `updateChildren`.
     *
     * @param {?object} nextNestedChildrenElements Nested child element maps.
     * @param {ReactReconcileTransaction} transaction
     * @final
     * @protected
     */
    _updateChildren: function _updateChildren(nextNestedChildrenElements, transaction, context) {
      var prevChildren = this._renderedChildren;
      var nextChildren = this._reconcilerUpdateChildren(prevChildren, nextNestedChildrenElements, transaction, context);
      this._renderedChildren = nextChildren;
      if (!nextChildren && !prevChildren) {
        return;
      }
      var name;
      // `nextIndex` will increment for each child in `nextChildren`, but
      // `lastIndex` will be the last index visited in `prevChildren`.
      var lastIndex = 0;
      var nextIndex = 0;
      for (name in nextChildren) {
        if (!nextChildren.hasOwnProperty(name)) {
          continue;
        }
        var prevChild = prevChildren && prevChildren[name];
        var nextChild = nextChildren[name];
        if (prevChild === nextChild) {
          this.moveChild(prevChild, nextIndex, lastIndex);
          lastIndex = Math.max(prevChild._mountIndex, lastIndex);
          prevChild._mountIndex = nextIndex;
        } else {
          if (prevChild) {
            // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
            lastIndex = Math.max(prevChild._mountIndex, lastIndex);
            this._unmountChild(prevChild);
          }
          // The child must be instantiated before it's mounted.
          this._mountChildByNameAtIndex(nextChild, name, nextIndex, transaction, context);
        }
        nextIndex++;
      }
      // Remove children that are no longer present.
      for (name in prevChildren) {
        if (prevChildren.hasOwnProperty(name) && !(nextChildren && nextChildren.hasOwnProperty(name))) {
          this._unmountChild(prevChildren[name]);
        }
      }
    },

    /**
     * Unmounts all rendered children. This should be used to clean up children
     * when this component is unmounted.
     *
     * @internal
     */
    unmountChildren: function unmountChildren() {
      var renderedChildren = this._renderedChildren;
      ReactChildReconciler.unmountChildren(renderedChildren);
      this._renderedChildren = null;
    },

    /**
     * Moves a child component to the supplied index.
     *
     * @param {ReactComponent} child Component to move.
     * @param {number} toIndex Destination index of the element.
     * @param {number} lastIndex Last index visited of the siblings of `child`.
     * @protected
     */
    moveChild: function moveChild(child, toIndex, lastIndex) {
      // If the index of `child` is less than `lastIndex`, then it needs to
      // be moved. Otherwise, we do not need to move it because a child will be
      // inserted or moved before `child`.
      if (child._mountIndex < lastIndex) {
        enqueueMove(this._rootNodeID, child._mountIndex, toIndex);
      }
    },

    /**
     * Creates a child component.
     *
     * @param {ReactComponent} child Component to create.
     * @param {string} mountImage Markup to insert.
     * @protected
     */
    createChild: function createChild(child, mountImage) {
      enqueueInsertMarkup(this._rootNodeID, mountImage, child._mountIndex);
    },

    /**
     * Removes a child component.
     *
     * @param {ReactComponent} child Child to remove.
     * @protected
     */
    removeChild: function removeChild(child) {
      enqueueRemove(this._rootNodeID, child._mountIndex);
    },

    /**
     * Sets this text content string.
     *
     * @param {string} textContent Text content to set.
     * @protected
     */
    setTextContent: function setTextContent(textContent) {
      enqueueTextContent(this._rootNodeID, textContent);
    },

    /**
     * Sets this markup string.
     *
     * @param {string} markup Markup to set.
     * @protected
     */
    setMarkup: function setMarkup(markup) {
      enqueueSetMarkup(this._rootNodeID, markup);
    },

    /**
     * Mounts a child with the supplied name.
     *
     * NOTE: This is part of `updateChildren` and is here for readability.
     *
     * @param {ReactComponent} child Component to mount.
     * @param {string} name Name of the child.
     * @param {number} index Index at which to insert the child.
     * @param {ReactReconcileTransaction} transaction
     * @private
     */
    _mountChildByNameAtIndex: function _mountChildByNameAtIndex(child, name, index, transaction, context) {
      // Inlined for performance, see `ReactInstanceHandles.createReactID`.
      var rootID = this._rootNodeID + name;
      var mountImage = ReactReconciler.mountComponent(child, rootID, transaction, context);
      child._mountIndex = index;
      this.createChild(child, mountImage);
    },

    /**
     * Unmounts a rendered child.
     *
     * NOTE: This is part of `updateChildren` and is here for readability.
     *
     * @param {ReactComponent} child Component to unmount.
     * @private
     */
    _unmountChild: function _unmountChild(child) {
      this.removeChild(child);
      child._mountIndex = null;
    }

  }

};

module.exports = ReactMultiChild;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0TXVsdGlDaGlsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLDRCQUE0QixRQUFRLDZCQUFSLENBQTVCO0FBQ0osSUFBSSw2QkFBNkIsUUFBUSw4QkFBUixDQUE3Qjs7QUFFSixJQUFJLG9CQUFvQixRQUFRLHFCQUFSLENBQXBCO0FBQ0osSUFBSSxrQkFBa0IsUUFBUSxtQkFBUixDQUFsQjtBQUNKLElBQUksdUJBQXVCLFFBQVEsd0JBQVIsQ0FBdkI7O0FBRUosSUFBSSxrQkFBa0IsUUFBUSxtQkFBUixDQUFsQjs7Ozs7Ozs7O0FBU0osSUFBSSxjQUFjLENBQWQ7Ozs7Ozs7Ozs7QUFVSixJQUFJLGNBQWMsRUFBZDs7Ozs7Ozs7QUFRSixJQUFJLGNBQWMsRUFBZDs7Ozs7Ozs7OztBQVVKLFNBQVMsbUJBQVQsQ0FBNkIsUUFBN0IsRUFBdUMsTUFBdkMsRUFBK0MsT0FBL0MsRUFBd0Q7O0FBRXRELGNBQVksSUFBWixDQUFpQjtBQUNmLGNBQVUsUUFBVjtBQUNBLGdCQUFZLElBQVo7QUFDQSxVQUFNLDJCQUEyQixhQUEzQjtBQUNOLGlCQUFhLFlBQVksSUFBWixDQUFpQixNQUFqQixJQUEyQixDQUEzQjtBQUNiLGFBQVMsSUFBVDtBQUNBLGVBQVcsSUFBWDtBQUNBLGFBQVMsT0FBVDtHQVBGLEVBRnNEO0NBQXhEOzs7Ozs7Ozs7O0FBcUJBLFNBQVMsV0FBVCxDQUFxQixRQUFyQixFQUErQixTQUEvQixFQUEwQyxPQUExQyxFQUFtRDs7QUFFakQsY0FBWSxJQUFaLENBQWlCO0FBQ2YsY0FBVSxRQUFWO0FBQ0EsZ0JBQVksSUFBWjtBQUNBLFVBQU0sMkJBQTJCLGFBQTNCO0FBQ04saUJBQWEsSUFBYjtBQUNBLGFBQVMsSUFBVDtBQUNBLGVBQVcsU0FBWDtBQUNBLGFBQVMsT0FBVDtHQVBGLEVBRmlEO0NBQW5EOzs7Ozs7Ozs7QUFvQkEsU0FB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Ozs7OztBQVVoQixlQUFXLG1CQUFVLE1BQVYsRUFBa0I7QUFDM0IsdUJBQWlCLEtBQUssV0FBTCxFQUFrQixNQUFuQyxFQUQyQjtLQUFsQjs7Ozs7Ozs7Ozs7OztBQWVYLDhCQUEwQixrQ0FBVSxLQUFWLEVBQWlCLElBQWpCLEVBQXVCLEtBQXZCLEVBQThCLFdBQTlCLEVBQTJDLE9BQTNDLEVBQW9EOztBQUU1RSxVQUFJLFNBQVMsS0FBSyxXQUFMLEdBQW1CLElBQW5CLENBRitEO0FBRzVFLFVBQUksYUFBYSxnQkFBZ0IsY0FBaEIsQ0FBK0IsS0FBL0IsRUFBc0MsTUFBdEMsRUFBOEMsV0FBOUMsRUFBMkQsT0FBM0QsQ0FBYixDQUh3RTtBQUk1RSxZQUFNLFdBQU4sR0FBb0IsS0FBcEIsQ0FKNEU7QUFLNUUsV0FBSyxXQUFMLENBQWlCLEtBQWpCLEVBQXdCLFVBQXhCLEVBTDRFO0tBQXBEOzs7Ozs7Ozs7O0FBZ0IxQixtQkFBZSx1QkFBVSxLQUFWLEVBQWlCO0FBQzlCLFdBQUssV0FBTCxDQUFpQixLQUFqQixFQUQ4QjtBQUU5QixZQUFNLFdBQU4sR0FBb0IsSUFBcEIsQ0FGOEI7S0FBakI7O0dBelNqQjs7Q0FURTs7QUEyVEosT0FBTyxPQUFQLEdBQWlCLGVBQWpCIiwiZmlsZSI6IlJlYWN0TXVsdGlDaGlsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdE11bHRpQ2hpbGRcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RDb21wb25lbnRFbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vUmVhY3RDb21wb25lbnRFbnZpcm9ubWVudCcpO1xudmFyIFJlYWN0TXVsdGlDaGlsZFVwZGF0ZVR5cGVzID0gcmVxdWlyZSgnLi9SZWFjdE11bHRpQ2hpbGRVcGRhdGVUeXBlcycpO1xuXG52YXIgUmVhY3RDdXJyZW50T3duZXIgPSByZXF1aXJlKCcuL1JlYWN0Q3VycmVudE93bmVyJyk7XG52YXIgUmVhY3RSZWNvbmNpbGVyID0gcmVxdWlyZSgnLi9SZWFjdFJlY29uY2lsZXInKTtcbnZhciBSZWFjdENoaWxkUmVjb25jaWxlciA9IHJlcXVpcmUoJy4vUmVhY3RDaGlsZFJlY29uY2lsZXInKTtcblxudmFyIGZsYXR0ZW5DaGlsZHJlbiA9IHJlcXVpcmUoJy4vZmxhdHRlbkNoaWxkcmVuJyk7XG5cbi8qKlxuICogVXBkYXRpbmcgY2hpbGRyZW4gb2YgYSBjb21wb25lbnQgbWF5IHRyaWdnZXIgcmVjdXJzaXZlIHVwZGF0ZXMuIFRoZSBkZXB0aCBpc1xuICogdXNlZCB0byBiYXRjaCByZWN1cnNpdmUgdXBkYXRlcyB0byByZW5kZXIgbWFya3VwIG1vcmUgZWZmaWNpZW50bHkuXG4gKlxuICogQHR5cGUge251bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciB1cGRhdGVEZXB0aCA9IDA7XG5cbi8qKlxuICogUXVldWUgb2YgdXBkYXRlIGNvbmZpZ3VyYXRpb24gb2JqZWN0cy5cbiAqXG4gKiBFYWNoIG9iamVjdCBoYXMgYSBgdHlwZWAgcHJvcGVydHkgdGhhdCBpcyBpbiBgUmVhY3RNdWx0aUNoaWxkVXBkYXRlVHlwZXNgLlxuICpcbiAqIEB0eXBlIHthcnJheTxvYmplY3Q+fVxuICogQHByaXZhdGVcbiAqL1xudmFyIHVwZGF0ZVF1ZXVlID0gW107XG5cbi8qKlxuICogUXVldWUgb2YgbWFya3VwIHRvIGJlIHJlbmRlcmVkLlxuICpcbiAqIEB0eXBlIHthcnJheTxzdHJpbmc+fVxuICogQHByaXZhdGVcbiAqL1xudmFyIG1hcmt1cFF1ZXVlID0gW107XG5cbi8qKlxuICogRW5xdWV1ZXMgbWFya3VwIHRvIGJlIHJlbmRlcmVkIGFuZCBpbnNlcnRlZCBhdCBhIHN1cHBsaWVkIGluZGV4LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXJlbnRJRCBJRCBvZiB0aGUgcGFyZW50IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBtYXJrdXAgTWFya3VwIHRoYXQgcmVuZGVycyBpbnRvIGFuIGVsZW1lbnQuXG4gKiBAcGFyYW0ge251bWJlcn0gdG9JbmRleCBEZXN0aW5hdGlvbiBpbmRleC5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGVucXVldWVJbnNlcnRNYXJrdXAocGFyZW50SUQsIG1hcmt1cCwgdG9JbmRleCkge1xuICAvLyBOT1RFOiBOdWxsIHZhbHVlcyByZWR1Y2UgaGlkZGVuIGNsYXNzZXMuXG4gIHVwZGF0ZVF1ZXVlLnB1c2goe1xuICAgIHBhcmVudElEOiBwYXJlbnRJRCxcbiAgICBwYXJlbnROb2RlOiBudWxsLFxuICAgIHR5cGU6IFJlYWN0TXVsdGlDaGlsZFVwZGF0ZVR5cGVzLklOU0VSVF9NQVJLVVAsXG4gICAgbWFya3VwSW5kZXg6IG1hcmt1cFF1ZXVlLnB1c2gobWFya3VwKSAtIDEsXG4gICAgY29udGVudDogbnVsbCxcbiAgICBmcm9tSW5kZXg6IG51bGwsXG4gICAgdG9JbmRleDogdG9JbmRleFxuICB9KTtcbn1cblxuLyoqXG4gKiBFbnF1ZXVlcyBtb3ZpbmcgYW4gZXhpc3RpbmcgZWxlbWVudCB0byBhbm90aGVyIGluZGV4LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXJlbnRJRCBJRCBvZiB0aGUgcGFyZW50IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggU291cmNlIGluZGV4IG9mIHRoZSBleGlzdGluZyBlbGVtZW50LlxuICogQHBhcmFtIHtudW1iZXJ9IHRvSW5kZXggRGVzdGluYXRpb24gaW5kZXggb2YgdGhlIGVsZW1lbnQuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBlbnF1ZXVlTW92ZShwYXJlbnRJRCwgZnJvbUluZGV4LCB0b0luZGV4KSB7XG4gIC8vIE5PVEU6IE51bGwgdmFsdWVzIHJlZHVjZSBoaWRkZW4gY2xhc3Nlcy5cbiAgdXBkYXRlUXVldWUucHVzaCh7XG4gICAgcGFyZW50SUQ6IHBhcmVudElELFxuICAgIHBhcmVudE5vZGU6IG51bGwsXG4gICAgdHlwZTogUmVhY3RNdWx0aUNoaWxkVXBkYXRlVHlwZXMuTU9WRV9FWElTVElORyxcbiAgICBtYXJrdXBJbmRleDogbnVsbCxcbiAgICBjb250ZW50OiBudWxsLFxuICAgIGZyb21JbmRleDogZnJvbUluZGV4LFxuICAgIHRvSW5kZXg6IHRvSW5kZXhcbiAgfSk7XG59XG5cbi8qKlxuICogRW5xdWV1ZXMgcmVtb3ZpbmcgYW4gZWxlbWVudCBhdCBhbiBpbmRleC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGFyZW50SUQgSUQgb2YgdGhlIHBhcmVudCBjb21wb25lbnQuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IEluZGV4IG9mIHRoZSBlbGVtZW50IHRvIHJlbW92ZS5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGVucXVldWVSZW1vdmUocGFyZW50SUQsIGZyb21JbmRleCkge1xuICAvLyBOT1RFOiBOdWxsIHZhbHVlcyByZWR1Y2UgaGlkZGVuIGNsYXNzZXMuXG4gIHVwZGF0ZVF1ZXVlLnB1c2goe1xuICAgIHBhcmVudElEOiBwYXJlbnRJRCxcbiAgICBwYXJlbnROb2RlOiBudWxsLFxuICAgIHR5cGU6IFJlYWN0TXVsdGlDaGlsZFVwZGF0ZVR5cGVzLlJFTU9WRV9OT0RFLFxuICAgIG1hcmt1cEluZGV4OiBudWxsLFxuICAgIGNvbnRlbnQ6IG51bGwsXG4gICAgZnJvbUluZGV4OiBmcm9tSW5kZXgsXG4gICAgdG9JbmRleDogbnVsbFxuICB9KTtcbn1cblxuLyoqXG4gKiBFbnF1ZXVlcyBzZXR0aW5nIHRoZSBtYXJrdXAgb2YgYSBub2RlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXJlbnRJRCBJRCBvZiB0aGUgcGFyZW50IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBtYXJrdXAgTWFya3VwIHRoYXQgcmVuZGVycyBpbnRvIGFuIGVsZW1lbnQuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBlbnF1ZXVlU2V0TWFya3VwKHBhcmVudElELCBtYXJrdXApIHtcbiAgLy8gTk9URTogTnVsbCB2YWx1ZXMgcmVkdWNlIGhpZGRlbiBjbGFzc2VzLlxuICB1cGRhdGVRdWV1ZS5wdXNoKHtcbiAgICBwYXJlbnRJRDogcGFyZW50SUQsXG4gICAgcGFyZW50Tm9kZTogbnVsbCxcbiAgICB0eXBlOiBSZWFjdE11bHRpQ2hpbGRVcGRhdGVUeXBlcy5TRVRfTUFSS1VQLFxuICAgIG1hcmt1cEluZGV4OiBudWxsLFxuICAgIGNvbnRlbnQ6IG1hcmt1cCxcbiAgICBmcm9tSW5kZXg6IG51bGwsXG4gICAgdG9JbmRleDogbnVsbFxuICB9KTtcbn1cblxuLyoqXG4gKiBFbnF1ZXVlcyBzZXR0aW5nIHRoZSB0ZXh0IGNvbnRlbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhcmVudElEIElEIG9mIHRoZSBwYXJlbnQgY29tcG9uZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHRDb250ZW50IFRleHQgY29udGVudCB0byBzZXQuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBlbnF1ZXVlVGV4dENvbnRlbnQocGFyZW50SUQsIHRleHRDb250ZW50KSB7XG4gIC8vIE5PVEU6IE51bGwgdmFsdWVzIHJlZHVjZSBoaWRkZW4gY2xhc3Nlcy5cbiAgdXBkYXRlUXVldWUucHVzaCh7XG4gICAgcGFyZW50SUQ6IHBhcmVudElELFxuICAgIHBhcmVudE5vZGU6IG51bGwsXG4gICAgdHlwZTogUmVhY3RNdWx0aUNoaWxkVXBkYXRlVHlwZXMuVEVYVF9DT05URU5ULFxuICAgIG1hcmt1cEluZGV4OiBudWxsLFxuICAgIGNvbnRlbnQ6IHRleHRDb250ZW50LFxuICAgIGZyb21JbmRleDogbnVsbCxcbiAgICB0b0luZGV4OiBudWxsXG4gIH0pO1xufVxuXG4vKipcbiAqIFByb2Nlc3NlcyBhbnkgZW5xdWV1ZWQgdXBkYXRlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBwcm9jZXNzUXVldWUoKSB7XG4gIGlmICh1cGRhdGVRdWV1ZS5sZW5ndGgpIHtcbiAgICBSZWFjdENvbXBvbmVudEVudmlyb25tZW50LnByb2Nlc3NDaGlsZHJlblVwZGF0ZXModXBkYXRlUXVldWUsIG1hcmt1cFF1ZXVlKTtcbiAgICBjbGVhclF1ZXVlKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGVhcnMgYW55IGVucXVldWVkIHVwZGF0ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2xlYXJRdWV1ZSgpIHtcbiAgdXBkYXRlUXVldWUubGVuZ3RoID0gMDtcbiAgbWFya3VwUXVldWUubGVuZ3RoID0gMDtcbn1cblxuLyoqXG4gKiBSZWFjdE11bHRpQ2hpbGQgYXJlIGNhcGFibGUgb2YgcmVjb25jaWxpbmcgbXVsdGlwbGUgY2hpbGRyZW4uXG4gKlxuICogQGNsYXNzIFJlYWN0TXVsdGlDaGlsZFxuICogQGludGVybmFsXG4gKi9cbnZhciBSZWFjdE11bHRpQ2hpbGQgPSB7XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGNvbW1vbiBmdW5jdGlvbmFsaXR5IGZvciBjb21wb25lbnRzIHRoYXQgbXVzdCByZWNvbmNpbGUgbXVsdGlwbGVcbiAgICogY2hpbGRyZW4uIFRoaXMgaXMgdXNlZCBieSBgUmVhY3RET01Db21wb25lbnRgIHRvIG1vdW50LCB1cGRhdGUsIGFuZFxuICAgKiB1bm1vdW50IGNoaWxkIGNvbXBvbmVudHMuXG4gICAqXG4gICAqIEBsZW5kcyB7UmVhY3RNdWx0aUNoaWxkLnByb3RvdHlwZX1cbiAgICovXG4gIE1peGluOiB7XG5cbiAgICBfcmVjb25jaWxlckluc3RhbnRpYXRlQ2hpbGRyZW46IGZ1bmN0aW9uIChuZXN0ZWRDaGlsZHJlbiwgdHJhbnNhY3Rpb24sIGNvbnRleHQpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50RWxlbWVudCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50ID0gdGhpcy5fY3VycmVudEVsZW1lbnQuX293bmVyO1xuICAgICAgICAgICAgcmV0dXJuIFJlYWN0Q2hpbGRSZWNvbmNpbGVyLmluc3RhbnRpYXRlQ2hpbGRyZW4obmVzdGVkQ2hpbGRyZW4sIHRyYW5zYWN0aW9uLCBjb250ZXh0KTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gUmVhY3RDaGlsZFJlY29uY2lsZXIuaW5zdGFudGlhdGVDaGlsZHJlbihuZXN0ZWRDaGlsZHJlbiwgdHJhbnNhY3Rpb24sIGNvbnRleHQpO1xuICAgIH0sXG5cbiAgICBfcmVjb25jaWxlclVwZGF0ZUNoaWxkcmVuOiBmdW5jdGlvbiAocHJldkNoaWxkcmVuLCBuZXh0TmVzdGVkQ2hpbGRyZW5FbGVtZW50cywgdHJhbnNhY3Rpb24sIGNvbnRleHQpIHtcbiAgICAgIHZhciBuZXh0Q2hpbGRyZW47XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudEVsZW1lbnQpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCA9IHRoaXMuX2N1cnJlbnRFbGVtZW50Ll9vd25lcjtcbiAgICAgICAgICAgIG5leHRDaGlsZHJlbiA9IGZsYXR0ZW5DaGlsZHJlbihuZXh0TmVzdGVkQ2hpbGRyZW5FbGVtZW50cyk7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gUmVhY3RDaGlsZFJlY29uY2lsZXIudXBkYXRlQ2hpbGRyZW4ocHJldkNoaWxkcmVuLCBuZXh0Q2hpbGRyZW4sIHRyYW5zYWN0aW9uLCBjb250ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbmV4dENoaWxkcmVuID0gZmxhdHRlbkNoaWxkcmVuKG5leHROZXN0ZWRDaGlsZHJlbkVsZW1lbnRzKTtcbiAgICAgIHJldHVybiBSZWFjdENoaWxkUmVjb25jaWxlci51cGRhdGVDaGlsZHJlbihwcmV2Q2hpbGRyZW4sIG5leHRDaGlsZHJlbiwgdHJhbnNhY3Rpb24sIGNvbnRleHQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgYSBcIm1vdW50IGltYWdlXCIgZm9yIGVhY2ggb2YgdGhlIHN1cHBsaWVkIGNoaWxkcmVuLiBJbiB0aGUgY2FzZVxuICAgICAqIG9mIGBSZWFjdERPTUNvbXBvbmVudGAsIGEgbW91bnQgaW1hZ2UgaXMgYSBzdHJpbmcgb2YgbWFya3VwLlxuICAgICAqXG4gICAgICogQHBhcmFtIHs/b2JqZWN0fSBuZXN0ZWRDaGlsZHJlbiBOZXN0ZWQgY2hpbGQgbWFwcy5cbiAgICAgKiBAcmV0dXJuIHthcnJheX0gQW4gYXJyYXkgb2YgbW91bnRlZCByZXByZXNlbnRhdGlvbnMuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgbW91bnRDaGlsZHJlbjogZnVuY3Rpb24gKG5lc3RlZENoaWxkcmVuLCB0cmFuc2FjdGlvbiwgY29udGV4dCkge1xuICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5fcmVjb25jaWxlckluc3RhbnRpYXRlQ2hpbGRyZW4obmVzdGVkQ2hpbGRyZW4sIHRyYW5zYWN0aW9uLCBjb250ZXh0KTtcbiAgICAgIHRoaXMuX3JlbmRlcmVkQ2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgIHZhciBtb3VudEltYWdlcyA9IFtdO1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIGZvciAodmFyIG5hbWUgaW4gY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKGNoaWxkcmVuLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5bbmFtZV07XG4gICAgICAgICAgLy8gSW5saW5lZCBmb3IgcGVyZm9ybWFuY2UsIHNlZSBgUmVhY3RJbnN0YW5jZUhhbmRsZXMuY3JlYXRlUmVhY3RJRGAuXG4gICAgICAgICAgdmFyIHJvb3RJRCA9IHRoaXMuX3Jvb3ROb2RlSUQgKyBuYW1lO1xuICAgICAgICAgIHZhciBtb3VudEltYWdlID0gUmVhY3RSZWNvbmNpbGVyLm1vdW50Q29tcG9uZW50KGNoaWxkLCByb290SUQsIHRyYW5zYWN0aW9uLCBjb250ZXh0KTtcbiAgICAgICAgICBjaGlsZC5fbW91bnRJbmRleCA9IGluZGV4Kys7XG4gICAgICAgICAgbW91bnRJbWFnZXMucHVzaChtb3VudEltYWdlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG1vdW50SW1hZ2VzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXBsYWNlcyBhbnkgcmVuZGVyZWQgY2hpbGRyZW4gd2l0aCBhIHRleHQgY29udGVudCBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmV4dENvbnRlbnQgU3RyaW5nIG9mIGNvbnRlbnQuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgdXBkYXRlVGV4dENvbnRlbnQ6IGZ1bmN0aW9uIChuZXh0Q29udGVudCkge1xuICAgICAgdXBkYXRlRGVwdGgrKztcbiAgICAgIHZhciBlcnJvclRocm93biA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgcHJldkNoaWxkcmVuID0gdGhpcy5fcmVuZGVyZWRDaGlsZHJlbjtcbiAgICAgICAgLy8gUmVtb3ZlIGFueSByZW5kZXJlZCBjaGlsZHJlbi5cbiAgICAgICAgUmVhY3RDaGlsZFJlY29uY2lsZXIudW5tb3VudENoaWxkcmVuKHByZXZDaGlsZHJlbik7XG4gICAgICAgIC8vIFRPRE86IFRoZSBzZXRUZXh0Q29udGVudCBvcGVyYXRpb24gc2hvdWxkIGJlIGVub3VnaFxuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHByZXZDaGlsZHJlbikge1xuICAgICAgICAgIGlmIChwcmV2Q2hpbGRyZW4uaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX3VubW91bnRDaGlsZChwcmV2Q2hpbGRyZW5bbmFtZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBTZXQgbmV3IHRleHQgY29udGVudC5cbiAgICAgICAgdGhpcy5zZXRUZXh0Q29udGVudChuZXh0Q29udGVudCk7XG4gICAgICAgIGVycm9yVGhyb3duID0gZmFsc2U7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB1cGRhdGVEZXB0aC0tO1xuICAgICAgICBpZiAoIXVwZGF0ZURlcHRoKSB7XG4gICAgICAgICAgaWYgKGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgICBjbGVhclF1ZXVlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb2Nlc3NRdWV1ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXBsYWNlcyBhbnkgcmVuZGVyZWQgY2hpbGRyZW4gd2l0aCBhIG1hcmt1cCBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmV4dE1hcmt1cCBTdHJpbmcgb2YgbWFya3VwLlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHVwZGF0ZU1hcmt1cDogZnVuY3Rpb24gKG5leHRNYXJrdXApIHtcbiAgICAgIHVwZGF0ZURlcHRoKys7XG4gICAgICB2YXIgZXJyb3JUaHJvd24gPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHByZXZDaGlsZHJlbiA9IHRoaXMuX3JlbmRlcmVkQ2hpbGRyZW47XG4gICAgICAgIC8vIFJlbW92ZSBhbnkgcmVuZGVyZWQgY2hpbGRyZW4uXG4gICAgICAgIFJlYWN0Q2hpbGRSZWNvbmNpbGVyLnVubW91bnRDaGlsZHJlbihwcmV2Q2hpbGRyZW4pO1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHByZXZDaGlsZHJlbikge1xuICAgICAgICAgIGlmIChwcmV2Q2hpbGRyZW4uaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX3VubW91bnRDaGlsZEJ5TmFtZShwcmV2Q2hpbGRyZW5bbmFtZV0sIG5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldE1hcmt1cChuZXh0TWFya3VwKTtcbiAgICAgICAgZXJyb3JUaHJvd24gPSBmYWxzZTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHVwZGF0ZURlcHRoLS07XG4gICAgICAgIGlmICghdXBkYXRlRGVwdGgpIHtcbiAgICAgICAgICBpZiAoZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICAgIGNsZWFyUXVldWUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvY2Vzc1F1ZXVlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIHJlbmRlcmVkIGNoaWxkcmVuIHdpdGggbmV3IGNoaWxkcmVuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHs/b2JqZWN0fSBuZXh0TmVzdGVkQ2hpbGRyZW5FbGVtZW50cyBOZXN0ZWQgY2hpbGQgZWxlbWVudCBtYXBzLlxuICAgICAqIEBwYXJhbSB7UmVhY3RSZWNvbmNpbGVUcmFuc2FjdGlvbn0gdHJhbnNhY3Rpb25cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICB1cGRhdGVDaGlsZHJlbjogZnVuY3Rpb24gKG5leHROZXN0ZWRDaGlsZHJlbkVsZW1lbnRzLCB0cmFuc2FjdGlvbiwgY29udGV4dCkge1xuICAgICAgdXBkYXRlRGVwdGgrKztcbiAgICAgIHZhciBlcnJvclRocm93biA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLl91cGRhdGVDaGlsZHJlbihuZXh0TmVzdGVkQ2hpbGRyZW5FbGVtZW50cywgdHJhbnNhY3Rpb24sIGNvbnRleHQpO1xuICAgICAgICBlcnJvclRocm93biA9IGZhbHNlO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdXBkYXRlRGVwdGgtLTtcbiAgICAgICAgaWYgKCF1cGRhdGVEZXB0aCkge1xuICAgICAgICAgIGlmIChlcnJvclRocm93bikge1xuICAgICAgICAgICAgY2xlYXJRdWV1ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9jZXNzUXVldWUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW1wcm92ZSBwZXJmb3JtYW5jZSBieSBpc29sYXRpbmcgdGhpcyBob3QgY29kZSBwYXRoIGZyb20gdGhlIHRyeS9jYXRjaFxuICAgICAqIGJsb2NrIGluIGB1cGRhdGVDaGlsZHJlbmAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gez9vYmplY3R9IG5leHROZXN0ZWRDaGlsZHJlbkVsZW1lbnRzIE5lc3RlZCBjaGlsZCBlbGVtZW50IG1hcHMuXG4gICAgICogQHBhcmFtIHtSZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9ufSB0cmFuc2FjdGlvblxuICAgICAqIEBmaW5hbFxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBfdXBkYXRlQ2hpbGRyZW46IGZ1bmN0aW9uIChuZXh0TmVzdGVkQ2hpbGRyZW5FbGVtZW50cywgdHJhbnNhY3Rpb24sIGNvbnRleHQpIHtcbiAgICAgIHZhciBwcmV2Q2hpbGRyZW4gPSB0aGlzLl9yZW5kZXJlZENoaWxkcmVuO1xuICAgICAgdmFyIG5leHRDaGlsZHJlbiA9IHRoaXMuX3JlY29uY2lsZXJVcGRhdGVDaGlsZHJlbihwcmV2Q2hpbGRyZW4sIG5leHROZXN0ZWRDaGlsZHJlbkVsZW1lbnRzLCB0cmFuc2FjdGlvbiwgY29udGV4dCk7XG4gICAgICB0aGlzLl9yZW5kZXJlZENoaWxkcmVuID0gbmV4dENoaWxkcmVuO1xuICAgICAgaWYgKCFuZXh0Q2hpbGRyZW4gJiYgIXByZXZDaGlsZHJlbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgbmFtZTtcbiAgICAgIC8vIGBuZXh0SW5kZXhgIHdpbGwgaW5jcmVtZW50IGZvciBlYWNoIGNoaWxkIGluIGBuZXh0Q2hpbGRyZW5gLCBidXRcbiAgICAgIC8vIGBsYXN0SW5kZXhgIHdpbGwgYmUgdGhlIGxhc3QgaW5kZXggdmlzaXRlZCBpbiBgcHJldkNoaWxkcmVuYC5cbiAgICAgIHZhciBsYXN0SW5kZXggPSAwO1xuICAgICAgdmFyIG5leHRJbmRleCA9IDA7XG4gICAgICBmb3IgKG5hbWUgaW4gbmV4dENoaWxkcmVuKSB7XG4gICAgICAgIGlmICghbmV4dENoaWxkcmVuLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByZXZDaGlsZCA9IHByZXZDaGlsZHJlbiAmJiBwcmV2Q2hpbGRyZW5bbmFtZV07XG4gICAgICAgIHZhciBuZXh0Q2hpbGQgPSBuZXh0Q2hpbGRyZW5bbmFtZV07XG4gICAgICAgIGlmIChwcmV2Q2hpbGQgPT09IG5leHRDaGlsZCkge1xuICAgICAgICAgIHRoaXMubW92ZUNoaWxkKHByZXZDaGlsZCwgbmV4dEluZGV4LCBsYXN0SW5kZXgpO1xuICAgICAgICAgIGxhc3RJbmRleCA9IE1hdGgubWF4KHByZXZDaGlsZC5fbW91bnRJbmRleCwgbGFzdEluZGV4KTtcbiAgICAgICAgICBwcmV2Q2hpbGQuX21vdW50SW5kZXggPSBuZXh0SW5kZXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHByZXZDaGlsZCkge1xuICAgICAgICAgICAgLy8gVXBkYXRlIGBsYXN0SW5kZXhgIGJlZm9yZSBgX21vdW50SW5kZXhgIGdldHMgdW5zZXQgYnkgdW5tb3VudGluZy5cbiAgICAgICAgICAgIGxhc3RJbmRleCA9IE1hdGgubWF4KHByZXZDaGlsZC5fbW91bnRJbmRleCwgbGFzdEluZGV4KTtcbiAgICAgICAgICAgIHRoaXMuX3VubW91bnRDaGlsZChwcmV2Q2hpbGQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBUaGUgY2hpbGQgbXVzdCBiZSBpbnN0YW50aWF0ZWQgYmVmb3JlIGl0J3MgbW91bnRlZC5cbiAgICAgICAgICB0aGlzLl9tb3VudENoaWxkQnlOYW1lQXRJbmRleChuZXh0Q2hpbGQsIG5hbWUsIG5leHRJbmRleCwgdHJhbnNhY3Rpb24sIGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIG5leHRJbmRleCsrO1xuICAgICAgfVxuICAgICAgLy8gUmVtb3ZlIGNoaWxkcmVuIHRoYXQgYXJlIG5vIGxvbmdlciBwcmVzZW50LlxuICAgICAgZm9yIChuYW1lIGluIHByZXZDaGlsZHJlbikge1xuICAgICAgICBpZiAocHJldkNoaWxkcmVuLmhhc093blByb3BlcnR5KG5hbWUpICYmICEobmV4dENoaWxkcmVuICYmIG5leHRDaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShuYW1lKSkpIHtcbiAgICAgICAgICB0aGlzLl91bm1vdW50Q2hpbGQocHJldkNoaWxkcmVuW25hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVbm1vdW50cyBhbGwgcmVuZGVyZWQgY2hpbGRyZW4uIFRoaXMgc2hvdWxkIGJlIHVzZWQgdG8gY2xlYW4gdXAgY2hpbGRyZW5cbiAgICAgKiB3aGVuIHRoaXMgY29tcG9uZW50IGlzIHVubW91bnRlZC5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHVubW91bnRDaGlsZHJlbjogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHJlbmRlcmVkQ2hpbGRyZW4gPSB0aGlzLl9yZW5kZXJlZENoaWxkcmVuO1xuICAgICAgUmVhY3RDaGlsZFJlY29uY2lsZXIudW5tb3VudENoaWxkcmVuKHJlbmRlcmVkQ2hpbGRyZW4pO1xuICAgICAgdGhpcy5fcmVuZGVyZWRDaGlsZHJlbiA9IG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1vdmVzIGEgY2hpbGQgY29tcG9uZW50IHRvIHRoZSBzdXBwbGllZCBpbmRleC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVhY3RDb21wb25lbnR9IGNoaWxkIENvbXBvbmVudCB0byBtb3ZlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b0luZGV4IERlc3RpbmF0aW9uIGluZGV4IG9mIHRoZSBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsYXN0SW5kZXggTGFzdCBpbmRleCB2aXNpdGVkIG9mIHRoZSBzaWJsaW5ncyBvZiBgY2hpbGRgLlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBtb3ZlQ2hpbGQ6IGZ1bmN0aW9uIChjaGlsZCwgdG9JbmRleCwgbGFzdEluZGV4KSB7XG4gICAgICAvLyBJZiB0aGUgaW5kZXggb2YgYGNoaWxkYCBpcyBsZXNzIHRoYW4gYGxhc3RJbmRleGAsIHRoZW4gaXQgbmVlZHMgdG9cbiAgICAgIC8vIGJlIG1vdmVkLiBPdGhlcndpc2UsIHdlIGRvIG5vdCBuZWVkIHRvIG1vdmUgaXQgYmVjYXVzZSBhIGNoaWxkIHdpbGwgYmVcbiAgICAgIC8vIGluc2VydGVkIG9yIG1vdmVkIGJlZm9yZSBgY2hpbGRgLlxuICAgICAgaWYgKGNoaWxkLl9tb3VudEluZGV4IDwgbGFzdEluZGV4KSB7XG4gICAgICAgIGVucXVldWVNb3ZlKHRoaXMuX3Jvb3ROb2RlSUQsIGNoaWxkLl9tb3VudEluZGV4LCB0b0luZGV4KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGNoaWxkIGNvbXBvbmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVhY3RDb21wb25lbnR9IGNoaWxkIENvbXBvbmVudCB0byBjcmVhdGUuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vdW50SW1hZ2UgTWFya3VwIHRvIGluc2VydC5cbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgY3JlYXRlQ2hpbGQ6IGZ1bmN0aW9uIChjaGlsZCwgbW91bnRJbWFnZSkge1xuICAgICAgZW5xdWV1ZUluc2VydE1hcmt1cCh0aGlzLl9yb290Tm9kZUlELCBtb3VudEltYWdlLCBjaGlsZC5fbW91bnRJbmRleCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBjaGlsZCBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlYWN0Q29tcG9uZW50fSBjaGlsZCBDaGlsZCB0byByZW1vdmUuXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIHJlbW92ZUNoaWxkOiBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgIGVucXVldWVSZW1vdmUodGhpcy5fcm9vdE5vZGVJRCwgY2hpbGQuX21vdW50SW5kZXgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoaXMgdGV4dCBjb250ZW50IHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0Q29udGVudCBUZXh0IGNvbnRlbnQgdG8gc2V0LlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBzZXRUZXh0Q29udGVudDogZnVuY3Rpb24gKHRleHRDb250ZW50KSB7XG4gICAgICBlbnF1ZXVlVGV4dENvbnRlbnQodGhpcy5fcm9vdE5vZGVJRCwgdGV4dENvbnRlbnQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoaXMgbWFya3VwIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtYXJrdXAgTWFya3VwIHRvIHNldC5cbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgc2V0TWFya3VwOiBmdW5jdGlvbiAobWFya3VwKSB7XG4gICAgICBlbnF1ZXVlU2V0TWFya3VwKHRoaXMuX3Jvb3ROb2RlSUQsIG1hcmt1cCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1vdW50cyBhIGNoaWxkIHdpdGggdGhlIHN1cHBsaWVkIG5hbWUuXG4gICAgICpcbiAgICAgKiBOT1RFOiBUaGlzIGlzIHBhcnQgb2YgYHVwZGF0ZUNoaWxkcmVuYCBhbmQgaXMgaGVyZSBmb3IgcmVhZGFiaWxpdHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlYWN0Q29tcG9uZW50fSBjaGlsZCBDb21wb25lbnQgdG8gbW91bnQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgY2hpbGQuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IEluZGV4IGF0IHdoaWNoIHRvIGluc2VydCB0aGUgY2hpbGQuXG4gICAgICogQHBhcmFtIHtSZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9ufSB0cmFuc2FjdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX21vdW50Q2hpbGRCeU5hbWVBdEluZGV4OiBmdW5jdGlvbiAoY2hpbGQsIG5hbWUsIGluZGV4LCB0cmFuc2FjdGlvbiwgY29udGV4dCkge1xuICAgICAgLy8gSW5saW5lZCBmb3IgcGVyZm9ybWFuY2UsIHNlZSBgUmVhY3RJbnN0YW5jZUhhbmRsZXMuY3JlYXRlUmVhY3RJRGAuXG4gICAgICB2YXIgcm9vdElEID0gdGhpcy5fcm9vdE5vZGVJRCArIG5hbWU7XG4gICAgICB2YXIgbW91bnRJbWFnZSA9IFJlYWN0UmVjb25jaWxlci5tb3VudENvbXBvbmVudChjaGlsZCwgcm9vdElELCB0cmFuc2FjdGlvbiwgY29udGV4dCk7XG4gICAgICBjaGlsZC5fbW91bnRJbmRleCA9IGluZGV4O1xuICAgICAgdGhpcy5jcmVhdGVDaGlsZChjaGlsZCwgbW91bnRJbWFnZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVubW91bnRzIGEgcmVuZGVyZWQgY2hpbGQuXG4gICAgICpcbiAgICAgKiBOT1RFOiBUaGlzIGlzIHBhcnQgb2YgYHVwZGF0ZUNoaWxkcmVuYCBhbmQgaXMgaGVyZSBmb3IgcmVhZGFiaWxpdHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlYWN0Q29tcG9uZW50fSBjaGlsZCBDb21wb25lbnQgdG8gdW5tb3VudC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF91bm1vdW50Q2hpbGQ6IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgdGhpcy5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICBjaGlsZC5fbW91bnRJbmRleCA9IG51bGw7XG4gICAgfVxuXG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdE11bHRpQ2hpbGQ7Il19