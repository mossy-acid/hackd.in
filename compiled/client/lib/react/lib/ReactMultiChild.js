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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0TXVsdGlDaGlsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLDRCQUE0QixRQUFRLDZCQUFSLENBQWhDO0FBQ0EsSUFBSSw2QkFBNkIsUUFBUSw4QkFBUixDQUFqQzs7QUFFQSxJQUFJLG9CQUFvQixRQUFRLHFCQUFSLENBQXhCO0FBQ0EsSUFBSSxrQkFBa0IsUUFBUSxtQkFBUixDQUF0QjtBQUNBLElBQUksdUJBQXVCLFFBQVEsd0JBQVIsQ0FBM0I7O0FBRUEsSUFBSSxrQkFBa0IsUUFBUSxtQkFBUixDQUF0Qjs7Ozs7Ozs7O0FBU0EsSUFBSSxjQUFjLENBQWxCOzs7Ozs7Ozs7O0FBVUEsSUFBSSxjQUFjLEVBQWxCOzs7Ozs7OztBQVFBLElBQUksY0FBYyxFQUFsQjs7Ozs7Ozs7OztBQVVBLFNBQVMsbUJBQVQsQ0FBNkIsUUFBN0IsRUFBdUMsTUFBdkMsRUFBK0MsT0FBL0MsRUFBd0Q7O0FBRXRELGNBQVksSUFBWixDQUFpQjtBQUNmLGNBQVUsUUFESztBQUVmLGdCQUFZLElBRkc7QUFHZixVQUFNLDJCQUEyQixhQUhsQjtBQUlmLGlCQUFhLFlBQVksSUFBWixDQUFpQixNQUFqQixJQUEyQixDQUp6QjtBQUtmLGFBQVMsSUFMTTtBQU1mLGVBQVcsSUFOSTtBQU9mLGFBQVM7QUFQTSxHQUFqQjtBQVNEOzs7Ozs7Ozs7O0FBVUQsU0FBUyxXQUFULENBQXFCLFFBQXJCLEVBQStCLFNBQS9CLEVBQTBDLE9BQTFDLEVBQW1EOztBQUVqRCxjQUFZLElBQVosQ0FBaUI7QUFDZixjQUFVLFFBREs7QUFFZixnQkFBWSxJQUZHO0FBR2YsVUFBTSwyQkFBMkIsYUFIbEI7QUFJZixpQkFBYSxJQUpFO0FBS2YsYUFBUyxJQUxNO0FBTWYsZUFBVyxTQU5JO0FBT2YsYUFBUztBQVBNLEdBQWpCO0FBU0Q7Ozs7Ozs7OztBQVNELFNBQVMsYUFBVCxD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QVYsRUFBaUI7QUFDOUIsV0FBSyxXQUFMLENBQWlCLEtBQWpCO0FBQ0EsWUFBTSxXQUFOLEdBQW9CLElBQXBCO0FBQ0Q7O0FBNVNJOztBQVRhLENBQXRCOztBQTJUQSxPQUFPLE9BQVAsR0FBaUIsZUFBakIiLCJmaWxlIjoiUmVhY3RNdWx0aUNoaWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0TXVsdGlDaGlsZFxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdENvbXBvbmVudEVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9SZWFjdENvbXBvbmVudEVudmlyb25tZW50Jyk7XG52YXIgUmVhY3RNdWx0aUNoaWxkVXBkYXRlVHlwZXMgPSByZXF1aXJlKCcuL1JlYWN0TXVsdGlDaGlsZFVwZGF0ZVR5cGVzJyk7XG5cbnZhciBSZWFjdEN1cnJlbnRPd25lciA9IHJlcXVpcmUoJy4vUmVhY3RDdXJyZW50T3duZXInKTtcbnZhciBSZWFjdFJlY29uY2lsZXIgPSByZXF1aXJlKCcuL1JlYWN0UmVjb25jaWxlcicpO1xudmFyIFJlYWN0Q2hpbGRSZWNvbmNpbGVyID0gcmVxdWlyZSgnLi9SZWFjdENoaWxkUmVjb25jaWxlcicpO1xuXG52YXIgZmxhdHRlbkNoaWxkcmVuID0gcmVxdWlyZSgnLi9mbGF0dGVuQ2hpbGRyZW4nKTtcblxuLyoqXG4gKiBVcGRhdGluZyBjaGlsZHJlbiBvZiBhIGNvbXBvbmVudCBtYXkgdHJpZ2dlciByZWN1cnNpdmUgdXBkYXRlcy4gVGhlIGRlcHRoIGlzXG4gKiB1c2VkIHRvIGJhdGNoIHJlY3Vyc2l2ZSB1cGRhdGVzIHRvIHJlbmRlciBtYXJrdXAgbW9yZSBlZmZpY2llbnRseS5cbiAqXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIHVwZGF0ZURlcHRoID0gMDtcblxuLyoqXG4gKiBRdWV1ZSBvZiB1cGRhdGUgY29uZmlndXJhdGlvbiBvYmplY3RzLlxuICpcbiAqIEVhY2ggb2JqZWN0IGhhcyBhIGB0eXBlYCBwcm9wZXJ0eSB0aGF0IGlzIGluIGBSZWFjdE11bHRpQ2hpbGRVcGRhdGVUeXBlc2AuXG4gKlxuICogQHR5cGUge2FycmF5PG9iamVjdD59XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgdXBkYXRlUXVldWUgPSBbXTtcblxuLyoqXG4gKiBRdWV1ZSBvZiBtYXJrdXAgdG8gYmUgcmVuZGVyZWQuXG4gKlxuICogQHR5cGUge2FycmF5PHN0cmluZz59XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgbWFya3VwUXVldWUgPSBbXTtcblxuLyoqXG4gKiBFbnF1ZXVlcyBtYXJrdXAgdG8gYmUgcmVuZGVyZWQgYW5kIGluc2VydGVkIGF0IGEgc3VwcGxpZWQgaW5kZXguXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhcmVudElEIElEIG9mIHRoZSBwYXJlbnQgY29tcG9uZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IG1hcmt1cCBNYXJrdXAgdGhhdCByZW5kZXJzIGludG8gYW4gZWxlbWVudC5cbiAqIEBwYXJhbSB7bnVtYmVyfSB0b0luZGV4IERlc3RpbmF0aW9uIGluZGV4LlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZW5xdWV1ZUluc2VydE1hcmt1cChwYXJlbnRJRCwgbWFya3VwLCB0b0luZGV4KSB7XG4gIC8vIE5PVEU6IE51bGwgdmFsdWVzIHJlZHVjZSBoaWRkZW4gY2xhc3Nlcy5cbiAgdXBkYXRlUXVldWUucHVzaCh7XG4gICAgcGFyZW50SUQ6IHBhcmVudElELFxuICAgIHBhcmVudE5vZGU6IG51bGwsXG4gICAgdHlwZTogUmVhY3RNdWx0aUNoaWxkVXBkYXRlVHlwZXMuSU5TRVJUX01BUktVUCxcbiAgICBtYXJrdXBJbmRleDogbWFya3VwUXVldWUucHVzaChtYXJrdXApIC0gMSxcbiAgICBjb250ZW50OiBudWxsLFxuICAgIGZyb21JbmRleDogbnVsbCxcbiAgICB0b0luZGV4OiB0b0luZGV4XG4gIH0pO1xufVxuXG4vKipcbiAqIEVucXVldWVzIG1vdmluZyBhbiBleGlzdGluZyBlbGVtZW50IHRvIGFub3RoZXIgaW5kZXguXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhcmVudElEIElEIG9mIHRoZSBwYXJlbnQgY29tcG9uZW50LlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBTb3VyY2UgaW5kZXggb2YgdGhlIGV4aXN0aW5nIGVsZW1lbnQuXG4gKiBAcGFyYW0ge251bWJlcn0gdG9JbmRleCBEZXN0aW5hdGlvbiBpbmRleCBvZiB0aGUgZWxlbWVudC5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGVucXVldWVNb3ZlKHBhcmVudElELCBmcm9tSW5kZXgsIHRvSW5kZXgpIHtcbiAgLy8gTk9URTogTnVsbCB2YWx1ZXMgcmVkdWNlIGhpZGRlbiBjbGFzc2VzLlxuICB1cGRhdGVRdWV1ZS5wdXNoKHtcbiAgICBwYXJlbnRJRDogcGFyZW50SUQsXG4gICAgcGFyZW50Tm9kZTogbnVsbCxcbiAgICB0eXBlOiBSZWFjdE11bHRpQ2hpbGRVcGRhdGVUeXBlcy5NT1ZFX0VYSVNUSU5HLFxuICAgIG1hcmt1cEluZGV4OiBudWxsLFxuICAgIGNvbnRlbnQ6IG51bGwsXG4gICAgZnJvbUluZGV4OiBmcm9tSW5kZXgsXG4gICAgdG9JbmRleDogdG9JbmRleFxuICB9KTtcbn1cblxuLyoqXG4gKiBFbnF1ZXVlcyByZW1vdmluZyBhbiBlbGVtZW50IGF0IGFuIGluZGV4LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXJlbnRJRCBJRCBvZiB0aGUgcGFyZW50IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggSW5kZXggb2YgdGhlIGVsZW1lbnQgdG8gcmVtb3ZlLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZW5xdWV1ZVJlbW92ZShwYXJlbnRJRCwgZnJvbUluZGV4KSB7XG4gIC8vIE5PVEU6IE51bGwgdmFsdWVzIHJlZHVjZSBoaWRkZW4gY2xhc3Nlcy5cbiAgdXBkYXRlUXVldWUucHVzaCh7XG4gICAgcGFyZW50SUQ6IHBhcmVudElELFxuICAgIHBhcmVudE5vZGU6IG51bGwsXG4gICAgdHlwZTogUmVhY3RNdWx0aUNoaWxkVXBkYXRlVHlwZXMuUkVNT1ZFX05PREUsXG4gICAgbWFya3VwSW5kZXg6IG51bGwsXG4gICAgY29udGVudDogbnVsbCxcbiAgICBmcm9tSW5kZXg6IGZyb21JbmRleCxcbiAgICB0b0luZGV4OiBudWxsXG4gIH0pO1xufVxuXG4vKipcbiAqIEVucXVldWVzIHNldHRpbmcgdGhlIG1hcmt1cCBvZiBhIG5vZGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhcmVudElEIElEIG9mIHRoZSBwYXJlbnQgY29tcG9uZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IG1hcmt1cCBNYXJrdXAgdGhhdCByZW5kZXJzIGludG8gYW4gZWxlbWVudC5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGVucXVldWVTZXRNYXJrdXAocGFyZW50SUQsIG1hcmt1cCkge1xuICAvLyBOT1RFOiBOdWxsIHZhbHVlcyByZWR1Y2UgaGlkZGVuIGNsYXNzZXMuXG4gIHVwZGF0ZVF1ZXVlLnB1c2goe1xuICAgIHBhcmVudElEOiBwYXJlbnRJRCxcbiAgICBwYXJlbnROb2RlOiBudWxsLFxuICAgIHR5cGU6IFJlYWN0TXVsdGlDaGlsZFVwZGF0ZVR5cGVzLlNFVF9NQVJLVVAsXG4gICAgbWFya3VwSW5kZXg6IG51bGwsXG4gICAgY29udGVudDogbWFya3VwLFxuICAgIGZyb21JbmRleDogbnVsbCxcbiAgICB0b0luZGV4OiBudWxsXG4gIH0pO1xufVxuXG4vKipcbiAqIEVucXVldWVzIHNldHRpbmcgdGhlIHRleHQgY29udGVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGFyZW50SUQgSUQgb2YgdGhlIHBhcmVudCBjb21wb25lbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dENvbnRlbnQgVGV4dCBjb250ZW50IHRvIHNldC5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGVucXVldWVUZXh0Q29udGVudChwYXJlbnRJRCwgdGV4dENvbnRlbnQpIHtcbiAgLy8gTk9URTogTnVsbCB2YWx1ZXMgcmVkdWNlIGhpZGRlbiBjbGFzc2VzLlxuICB1cGRhdGVRdWV1ZS5wdXNoKHtcbiAgICBwYXJlbnRJRDogcGFyZW50SUQsXG4gICAgcGFyZW50Tm9kZTogbnVsbCxcbiAgICB0eXBlOiBSZWFjdE11bHRpQ2hpbGRVcGRhdGVUeXBlcy5URVhUX0NPTlRFTlQsXG4gICAgbWFya3VwSW5kZXg6IG51bGwsXG4gICAgY29udGVudDogdGV4dENvbnRlbnQsXG4gICAgZnJvbUluZGV4OiBudWxsLFxuICAgIHRvSW5kZXg6IG51bGxcbiAgfSk7XG59XG5cbi8qKlxuICogUHJvY2Vzc2VzIGFueSBlbnF1ZXVlZCB1cGRhdGVzLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NRdWV1ZSgpIHtcbiAgaWYgKHVwZGF0ZVF1ZXVlLmxlbmd0aCkge1xuICAgIFJlYWN0Q29tcG9uZW50RW52aXJvbm1lbnQucHJvY2Vzc0NoaWxkcmVuVXBkYXRlcyh1cGRhdGVRdWV1ZSwgbWFya3VwUXVldWUpO1xuICAgIGNsZWFyUXVldWUoKTtcbiAgfVxufVxuXG4vKipcbiAqIENsZWFycyBhbnkgZW5xdWV1ZWQgdXBkYXRlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjbGVhclF1ZXVlKCkge1xuICB1cGRhdGVRdWV1ZS5sZW5ndGggPSAwO1xuICBtYXJrdXBRdWV1ZS5sZW5ndGggPSAwO1xufVxuXG4vKipcbiAqIFJlYWN0TXVsdGlDaGlsZCBhcmUgY2FwYWJsZSBvZiByZWNvbmNpbGluZyBtdWx0aXBsZSBjaGlsZHJlbi5cbiAqXG4gKiBAY2xhc3MgUmVhY3RNdWx0aUNoaWxkXG4gKiBAaW50ZXJuYWxcbiAqL1xudmFyIFJlYWN0TXVsdGlDaGlsZCA9IHtcblxuICAvKipcbiAgICogUHJvdmlkZXMgY29tbW9uIGZ1bmN0aW9uYWxpdHkgZm9yIGNvbXBvbmVudHMgdGhhdCBtdXN0IHJlY29uY2lsZSBtdWx0aXBsZVxuICAgKiBjaGlsZHJlbi4gVGhpcyBpcyB1c2VkIGJ5IGBSZWFjdERPTUNvbXBvbmVudGAgdG8gbW91bnQsIHVwZGF0ZSwgYW5kXG4gICAqIHVubW91bnQgY2hpbGQgY29tcG9uZW50cy5cbiAgICpcbiAgICogQGxlbmRzIHtSZWFjdE11bHRpQ2hpbGQucHJvdG90eXBlfVxuICAgKi9cbiAgTWl4aW46IHtcblxuICAgIF9yZWNvbmNpbGVySW5zdGFudGlhdGVDaGlsZHJlbjogZnVuY3Rpb24gKG5lc3RlZENoaWxkcmVuLCB0cmFuc2FjdGlvbiwgY29udGV4dCkge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQgPSB0aGlzLl9jdXJyZW50RWxlbWVudC5fb3duZXI7XG4gICAgICAgICAgICByZXR1cm4gUmVhY3RDaGlsZFJlY29uY2lsZXIuaW5zdGFudGlhdGVDaGlsZHJlbihuZXN0ZWRDaGlsZHJlbiwgdHJhbnNhY3Rpb24sIGNvbnRleHQpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50ID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBSZWFjdENoaWxkUmVjb25jaWxlci5pbnN0YW50aWF0ZUNoaWxkcmVuKG5lc3RlZENoaWxkcmVuLCB0cmFuc2FjdGlvbiwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIF9yZWNvbmNpbGVyVXBkYXRlQ2hpbGRyZW46IGZ1bmN0aW9uIChwcmV2Q2hpbGRyZW4sIG5leHROZXN0ZWRDaGlsZHJlbkVsZW1lbnRzLCB0cmFuc2FjdGlvbiwgY29udGV4dCkge1xuICAgICAgdmFyIG5leHRDaGlsZHJlbjtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50RWxlbWVudCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50ID0gdGhpcy5fY3VycmVudEVsZW1lbnQuX293bmVyO1xuICAgICAgICAgICAgbmV4dENoaWxkcmVuID0gZmxhdHRlbkNoaWxkcmVuKG5leHROZXN0ZWRDaGlsZHJlbkVsZW1lbnRzKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBSZWFjdENoaWxkUmVjb25jaWxlci51cGRhdGVDaGlsZHJlbihwcmV2Q2hpbGRyZW4sIG5leHRDaGlsZHJlbiwgdHJhbnNhY3Rpb24sIGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBuZXh0Q2hpbGRyZW4gPSBmbGF0dGVuQ2hpbGRyZW4obmV4dE5lc3RlZENoaWxkcmVuRWxlbWVudHMpO1xuICAgICAgcmV0dXJuIFJlYWN0Q2hpbGRSZWNvbmNpbGVyLnVwZGF0ZUNoaWxkcmVuKHByZXZDaGlsZHJlbiwgbmV4dENoaWxkcmVuLCB0cmFuc2FjdGlvbiwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyBhIFwibW91bnQgaW1hZ2VcIiBmb3IgZWFjaCBvZiB0aGUgc3VwcGxpZWQgY2hpbGRyZW4uIEluIHRoZSBjYXNlXG4gICAgICogb2YgYFJlYWN0RE9NQ29tcG9uZW50YCwgYSBtb3VudCBpbWFnZSBpcyBhIHN0cmluZyBvZiBtYXJrdXAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gez9vYmplY3R9IG5lc3RlZENoaWxkcmVuIE5lc3RlZCBjaGlsZCBtYXBzLlxuICAgICAqIEByZXR1cm4ge2FycmF5fSBBbiBhcnJheSBvZiBtb3VudGVkIHJlcHJlc2VudGF0aW9ucy5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBtb3VudENoaWxkcmVuOiBmdW5jdGlvbiAobmVzdGVkQ2hpbGRyZW4sIHRyYW5zYWN0aW9uLCBjb250ZXh0KSB7XG4gICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLl9yZWNvbmNpbGVySW5zdGFudGlhdGVDaGlsZHJlbihuZXN0ZWRDaGlsZHJlbiwgdHJhbnNhY3Rpb24sIGNvbnRleHQpO1xuICAgICAgdGhpcy5fcmVuZGVyZWRDaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgdmFyIG1vdW50SW1hZ2VzID0gW107XG4gICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgZm9yICh2YXIgbmFtZSBpbiBjaGlsZHJlbikge1xuICAgICAgICBpZiAoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltuYW1lXTtcbiAgICAgICAgICAvLyBJbmxpbmVkIGZvciBwZXJmb3JtYW5jZSwgc2VlIGBSZWFjdEluc3RhbmNlSGFuZGxlcy5jcmVhdGVSZWFjdElEYC5cbiAgICAgICAgICB2YXIgcm9vdElEID0gdGhpcy5fcm9vdE5vZGVJRCArIG5hbWU7XG4gICAgICAgICAgdmFyIG1vdW50SW1hZ2UgPSBSZWFjdFJlY29uY2lsZXIubW91bnRDb21wb25lbnQoY2hpbGQsIHJvb3RJRCwgdHJhbnNhY3Rpb24sIGNvbnRleHQpO1xuICAgICAgICAgIGNoaWxkLl9tb3VudEluZGV4ID0gaW5kZXgrKztcbiAgICAgICAgICBtb3VudEltYWdlcy5wdXNoKG1vdW50SW1hZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbW91bnRJbWFnZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlcGxhY2VzIGFueSByZW5kZXJlZCBjaGlsZHJlbiB3aXRoIGEgdGV4dCBjb250ZW50IHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuZXh0Q29udGVudCBTdHJpbmcgb2YgY29udGVudC5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICB1cGRhdGVUZXh0Q29udGVudDogZnVuY3Rpb24gKG5leHRDb250ZW50KSB7XG4gICAgICB1cGRhdGVEZXB0aCsrO1xuICAgICAgdmFyIGVycm9yVGhyb3duID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBwcmV2Q2hpbGRyZW4gPSB0aGlzLl9yZW5kZXJlZENoaWxkcmVuO1xuICAgICAgICAvLyBSZW1vdmUgYW55IHJlbmRlcmVkIGNoaWxkcmVuLlxuICAgICAgICBSZWFjdENoaWxkUmVjb25jaWxlci51bm1vdW50Q2hpbGRyZW4ocHJldkNoaWxkcmVuKTtcbiAgICAgICAgLy8gVE9ETzogVGhlIHNldFRleHRDb250ZW50IG9wZXJhdGlvbiBzaG91bGQgYmUgZW5vdWdoXG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gcHJldkNoaWxkcmVuKSB7XG4gICAgICAgICAgaWYgKHByZXZDaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5fdW5tb3VudENoaWxkKHByZXZDaGlsZHJlbltuYW1lXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFNldCBuZXcgdGV4dCBjb250ZW50LlxuICAgICAgICB0aGlzLnNldFRleHRDb250ZW50KG5leHRDb250ZW50KTtcbiAgICAgICAgZXJyb3JUaHJvd24gPSBmYWxzZTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHVwZGF0ZURlcHRoLS07XG4gICAgICAgIGlmICghdXBkYXRlRGVwdGgpIHtcbiAgICAgICAgICBpZiAoZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICAgIGNsZWFyUXVldWUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvY2Vzc1F1ZXVlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlcGxhY2VzIGFueSByZW5kZXJlZCBjaGlsZHJlbiB3aXRoIGEgbWFya3VwIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuZXh0TWFya3VwIFN0cmluZyBvZiBtYXJrdXAuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgdXBkYXRlTWFya3VwOiBmdW5jdGlvbiAobmV4dE1hcmt1cCkge1xuICAgICAgdXBkYXRlRGVwdGgrKztcbiAgICAgIHZhciBlcnJvclRocm93biA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgcHJldkNoaWxkcmVuID0gdGhpcy5fcmVuZGVyZWRDaGlsZHJlbjtcbiAgICAgICAgLy8gUmVtb3ZlIGFueSByZW5kZXJlZCBjaGlsZHJlbi5cbiAgICAgICAgUmVhY3RDaGlsZFJlY29uY2lsZXIudW5tb3VudENoaWxkcmVuKHByZXZDaGlsZHJlbik7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gcHJldkNoaWxkcmVuKSB7XG4gICAgICAgICAgaWYgKHByZXZDaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICAgICAgdGhpcy5fdW5tb3VudENoaWxkQnlOYW1lKHByZXZDaGlsZHJlbltuYW1lXSwgbmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0TWFya3VwKG5leHRNYXJrdXApO1xuICAgICAgICBlcnJvclRocm93biA9IGZhbHNlO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdXBkYXRlRGVwdGgtLTtcbiAgICAgICAgaWYgKCF1cGRhdGVEZXB0aCkge1xuICAgICAgICAgIGlmIChlcnJvclRocm93bikge1xuICAgICAgICAgICAgY2xlYXJRdWV1ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9jZXNzUXVldWUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgcmVuZGVyZWQgY2hpbGRyZW4gd2l0aCBuZXcgY2hpbGRyZW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gez9vYmplY3R9IG5leHROZXN0ZWRDaGlsZHJlbkVsZW1lbnRzIE5lc3RlZCBjaGlsZCBlbGVtZW50IG1hcHMuXG4gICAgICogQHBhcmFtIHtSZWFjdFJlY29uY2lsZVRyYW5zYWN0aW9ufSB0cmFuc2FjdGlvblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHVwZGF0ZUNoaWxkcmVuOiBmdW5jdGlvbiAobmV4dE5lc3RlZENoaWxkcmVuRWxlbWVudHMsIHRyYW5zYWN0aW9uLCBjb250ZXh0KSB7XG4gICAgICB1cGRhdGVEZXB0aCsrO1xuICAgICAgdmFyIGVycm9yVGhyb3duID0gdHJ1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNoaWxkcmVuKG5leHROZXN0ZWRDaGlsZHJlbkVsZW1lbnRzLCB0cmFuc2FjdGlvbiwgY29udGV4dCk7XG4gICAgICAgIGVycm9yVGhyb3duID0gZmFsc2U7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB1cGRhdGVEZXB0aC0tO1xuICAgICAgICBpZiAoIXVwZGF0ZURlcHRoKSB7XG4gICAgICAgICAgaWYgKGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgICBjbGVhclF1ZXVlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb2Nlc3NRdWV1ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbXByb3ZlIHBlcmZvcm1hbmNlIGJ5IGlzb2xhdGluZyB0aGlzIGhvdCBjb2RlIHBhdGggZnJvbSB0aGUgdHJ5L2NhdGNoXG4gICAgICogYmxvY2sgaW4gYHVwZGF0ZUNoaWxkcmVuYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7P29iamVjdH0gbmV4dE5lc3RlZENoaWxkcmVuRWxlbWVudHMgTmVzdGVkIGNoaWxkIGVsZW1lbnQgbWFwcy5cbiAgICAgKiBAcGFyYW0ge1JlYWN0UmVjb25jaWxlVHJhbnNhY3Rpb259IHRyYW5zYWN0aW9uXG4gICAgICogQGZpbmFsXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF91cGRhdGVDaGlsZHJlbjogZnVuY3Rpb24gKG5leHROZXN0ZWRDaGlsZHJlbkVsZW1lbnRzLCB0cmFuc2FjdGlvbiwgY29udGV4dCkge1xuICAgICAgdmFyIHByZXZDaGlsZHJlbiA9IHRoaXMuX3JlbmRlcmVkQ2hpbGRyZW47XG4gICAgICB2YXIgbmV4dENoaWxkcmVuID0gdGhpcy5fcmVjb25jaWxlclVwZGF0ZUNoaWxkcmVuKHByZXZDaGlsZHJlbiwgbmV4dE5lc3RlZENoaWxkcmVuRWxlbWVudHMsIHRyYW5zYWN0aW9uLCBjb250ZXh0KTtcbiAgICAgIHRoaXMuX3JlbmRlcmVkQ2hpbGRyZW4gPSBuZXh0Q2hpbGRyZW47XG4gICAgICBpZiAoIW5leHRDaGlsZHJlbiAmJiAhcHJldkNoaWxkcmVuKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBuYW1lO1xuICAgICAgLy8gYG5leHRJbmRleGAgd2lsbCBpbmNyZW1lbnQgZm9yIGVhY2ggY2hpbGQgaW4gYG5leHRDaGlsZHJlbmAsIGJ1dFxuICAgICAgLy8gYGxhc3RJbmRleGAgd2lsbCBiZSB0aGUgbGFzdCBpbmRleCB2aXNpdGVkIGluIGBwcmV2Q2hpbGRyZW5gLlxuICAgICAgdmFyIGxhc3RJbmRleCA9IDA7XG4gICAgICB2YXIgbmV4dEluZGV4ID0gMDtcbiAgICAgIGZvciAobmFtZSBpbiBuZXh0Q2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKCFuZXh0Q2hpbGRyZW4uaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJldkNoaWxkID0gcHJldkNoaWxkcmVuICYmIHByZXZDaGlsZHJlbltuYW1lXTtcbiAgICAgICAgdmFyIG5leHRDaGlsZCA9IG5leHRDaGlsZHJlbltuYW1lXTtcbiAgICAgICAgaWYgKHByZXZDaGlsZCA9PT0gbmV4dENoaWxkKSB7XG4gICAgICAgICAgdGhpcy5tb3ZlQ2hpbGQocHJldkNoaWxkLCBuZXh0SW5kZXgsIGxhc3RJbmRleCk7XG4gICAgICAgICAgbGFzdEluZGV4ID0gTWF0aC5tYXgocHJldkNoaWxkLl9tb3VudEluZGV4LCBsYXN0SW5kZXgpO1xuICAgICAgICAgIHByZXZDaGlsZC5fbW91bnRJbmRleCA9IG5leHRJbmRleDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocHJldkNoaWxkKSB7XG4gICAgICAgICAgICAvLyBVcGRhdGUgYGxhc3RJbmRleGAgYmVmb3JlIGBfbW91bnRJbmRleGAgZ2V0cyB1bnNldCBieSB1bm1vdW50aW5nLlxuICAgICAgICAgICAgbGFzdEluZGV4ID0gTWF0aC5tYXgocHJldkNoaWxkLl9tb3VudEluZGV4LCBsYXN0SW5kZXgpO1xuICAgICAgICAgICAgdGhpcy5fdW5tb3VudENoaWxkKHByZXZDaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFRoZSBjaGlsZCBtdXN0IGJlIGluc3RhbnRpYXRlZCBiZWZvcmUgaXQncyBtb3VudGVkLlxuICAgICAgICAgIHRoaXMuX21vdW50Q2hpbGRCeU5hbWVBdEluZGV4KG5leHRDaGlsZCwgbmFtZSwgbmV4dEluZGV4LCB0cmFuc2FjdGlvbiwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dEluZGV4Kys7XG4gICAgICB9XG4gICAgICAvLyBSZW1vdmUgY2hpbGRyZW4gdGhhdCBhcmUgbm8gbG9uZ2VyIHByZXNlbnQuXG4gICAgICBmb3IgKG5hbWUgaW4gcHJldkNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChwcmV2Q2hpbGRyZW4uaGFzT3duUHJvcGVydHkobmFtZSkgJiYgIShuZXh0Q2hpbGRyZW4gJiYgbmV4dENoaWxkcmVuLmhhc093blByb3BlcnR5KG5hbWUpKSkge1xuICAgICAgICAgIHRoaXMuX3VubW91bnRDaGlsZChwcmV2Q2hpbGRyZW5bbmFtZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVubW91bnRzIGFsbCByZW5kZXJlZCBjaGlsZHJlbi4gVGhpcyBzaG91bGQgYmUgdXNlZCB0byBjbGVhbiB1cCBjaGlsZHJlblxuICAgICAqIHdoZW4gdGhpcyBjb21wb25lbnQgaXMgdW5tb3VudGVkLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgdW5tb3VudENoaWxkcmVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmVuZGVyZWRDaGlsZHJlbiA9IHRoaXMuX3JlbmRlcmVkQ2hpbGRyZW47XG4gICAgICBSZWFjdENoaWxkUmVjb25jaWxlci51bm1vdW50Q2hpbGRyZW4ocmVuZGVyZWRDaGlsZHJlbik7XG4gICAgICB0aGlzLl9yZW5kZXJlZENoaWxkcmVuID0gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTW92ZXMgYSBjaGlsZCBjb21wb25lbnQgdG8gdGhlIHN1cHBsaWVkIGluZGV4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWFjdENvbXBvbmVudH0gY2hpbGQgQ29tcG9uZW50IHRvIG1vdmUuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvSW5kZXggRGVzdGluYXRpb24gaW5kZXggb2YgdGhlIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxhc3RJbmRleCBMYXN0IGluZGV4IHZpc2l0ZWQgb2YgdGhlIHNpYmxpbmdzIG9mIGBjaGlsZGAuXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIG1vdmVDaGlsZDogZnVuY3Rpb24gKGNoaWxkLCB0b0luZGV4LCBsYXN0SW5kZXgpIHtcbiAgICAgIC8vIElmIHRoZSBpbmRleCBvZiBgY2hpbGRgIGlzIGxlc3MgdGhhbiBgbGFzdEluZGV4YCwgdGhlbiBpdCBuZWVkcyB0b1xuICAgICAgLy8gYmUgbW92ZWQuIE90aGVyd2lzZSwgd2UgZG8gbm90IG5lZWQgdG8gbW92ZSBpdCBiZWNhdXNlIGEgY2hpbGQgd2lsbCBiZVxuICAgICAgLy8gaW5zZXJ0ZWQgb3IgbW92ZWQgYmVmb3JlIGBjaGlsZGAuXG4gICAgICBpZiAoY2hpbGQuX21vdW50SW5kZXggPCBsYXN0SW5kZXgpIHtcbiAgICAgICAgZW5xdWV1ZU1vdmUodGhpcy5fcm9vdE5vZGVJRCwgY2hpbGQuX21vdW50SW5kZXgsIHRvSW5kZXgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgY2hpbGQgY29tcG9uZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWFjdENvbXBvbmVudH0gY2hpbGQgQ29tcG9uZW50IHRvIGNyZWF0ZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW91bnRJbWFnZSBNYXJrdXAgdG8gaW5zZXJ0LlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBjcmVhdGVDaGlsZDogZnVuY3Rpb24gKGNoaWxkLCBtb3VudEltYWdlKSB7XG4gICAgICBlbnF1ZXVlSW5zZXJ0TWFya3VwKHRoaXMuX3Jvb3ROb2RlSUQsIG1vdW50SW1hZ2UsIGNoaWxkLl9tb3VudEluZGV4KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIGNoaWxkIGNvbXBvbmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVhY3RDb21wb25lbnR9IGNoaWxkIENoaWxkIHRvIHJlbW92ZS5cbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgcmVtb3ZlQ2hpbGQ6IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgZW5xdWV1ZVJlbW92ZSh0aGlzLl9yb290Tm9kZUlELCBjaGlsZC5fbW91bnRJbmRleCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhpcyB0ZXh0IGNvbnRlbnQgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRDb250ZW50IFRleHQgY29udGVudCB0byBzZXQuXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIHNldFRleHRDb250ZW50OiBmdW5jdGlvbiAodGV4dENvbnRlbnQpIHtcbiAgICAgIGVucXVldWVUZXh0Q29udGVudCh0aGlzLl9yb290Tm9kZUlELCB0ZXh0Q29udGVudCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhpcyBtYXJrdXAgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1hcmt1cCBNYXJrdXAgdG8gc2V0LlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBzZXRNYXJrdXA6IGZ1bmN0aW9uIChtYXJrdXApIHtcbiAgICAgIGVucXVldWVTZXRNYXJrdXAodGhpcy5fcm9vdE5vZGVJRCwgbWFya3VwKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTW91bnRzIGEgY2hpbGQgd2l0aCB0aGUgc3VwcGxpZWQgbmFtZS5cbiAgICAgKlxuICAgICAqIE5PVEU6IFRoaXMgaXMgcGFydCBvZiBgdXBkYXRlQ2hpbGRyZW5gIGFuZCBpcyBoZXJlIGZvciByZWFkYWJpbGl0eS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVhY3RDb21wb25lbnR9IGNoaWxkIENvbXBvbmVudCB0byBtb3VudC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBjaGlsZC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggSW5kZXggYXQgd2hpY2ggdG8gaW5zZXJ0IHRoZSBjaGlsZC5cbiAgICAgKiBAcGFyYW0ge1JlYWN0UmVjb25jaWxlVHJhbnNhY3Rpb259IHRyYW5zYWN0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfbW91bnRDaGlsZEJ5TmFtZUF0SW5kZXg6IGZ1bmN0aW9uIChjaGlsZCwgbmFtZSwgaW5kZXgsIHRyYW5zYWN0aW9uLCBjb250ZXh0KSB7XG4gICAgICAvLyBJbmxpbmVkIGZvciBwZXJmb3JtYW5jZSwgc2VlIGBSZWFjdEluc3RhbmNlSGFuZGxlcy5jcmVhdGVSZWFjdElEYC5cbiAgICAgIHZhciByb290SUQgPSB0aGlzLl9yb290Tm9kZUlEICsgbmFtZTtcbiAgICAgIHZhciBtb3VudEltYWdlID0gUmVhY3RSZWNvbmNpbGVyLm1vdW50Q29tcG9uZW50KGNoaWxkLCByb290SUQsIHRyYW5zYWN0aW9uLCBjb250ZXh0KTtcbiAgICAgIGNoaWxkLl9tb3VudEluZGV4ID0gaW5kZXg7XG4gICAgICB0aGlzLmNyZWF0ZUNoaWxkKGNoaWxkLCBtb3VudEltYWdlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVW5tb3VudHMgYSByZW5kZXJlZCBjaGlsZC5cbiAgICAgKlxuICAgICAqIE5PVEU6IFRoaXMgaXMgcGFydCBvZiBgdXBkYXRlQ2hpbGRyZW5gIGFuZCBpcyBoZXJlIGZvciByZWFkYWJpbGl0eS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVhY3RDb21wb25lbnR9IGNoaWxkIENvbXBvbmVudCB0byB1bm1vdW50LlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3VubW91bnRDaGlsZDogZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICB0aGlzLnJlbW92ZUNoaWxkKGNoaWxkKTtcbiAgICAgIGNoaWxkLl9tb3VudEluZGV4ID0gbnVsbDtcbiAgICB9XG5cbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0TXVsdGlDaGlsZDsiXX0=