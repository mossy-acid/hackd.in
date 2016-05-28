/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInstanceHandles
 * @typechecks static-only
 */

'use strict';

var ReactRootIndex = require('./ReactRootIndex');

var invariant = require('fbjs/lib/invariant');

var SEPARATOR = '.';
var SEPARATOR_LENGTH = SEPARATOR.length;

/**
 * Maximum depth of traversals before we consider the possibility of a bad ID.
 */
var MAX_TREE_DEPTH = 10000;

/**
 * Creates a DOM ID prefix to use when mounting React components.
 *
 * @param {number} index A unique integer
 * @return {string} React root ID.
 * @internal
 */
function getReactRootIDString(index) {
  return SEPARATOR + index.toString(36);
}

/**
 * Checks if a character in the supplied ID is a separator or the end.
 *
 * @param {string} id A React DOM ID.
 * @param {number} index Index of the character to check.
 * @return {boolean} True if the character is a separator or end of the ID.
 * @private
 */
function isBoundary(id, index) {
  return id.charAt(index) === SEPARATOR || index === id.length;
}

/**
 * Checks if the supplied string is a valid React DOM ID.
 *
 * @param {string} id A React DOM ID, maybe.
 * @return {boolean} True if the string is a valid React DOM ID.
 * @private
 */
function isValidID(id) {
  return id === '' || id.charAt(0) === SEPARATOR && id.charAt(id.length - 1) !== SEPARATOR;
}

/**
 * Checks if the first ID is an ancestor of or equal to the second ID.
 *
 * @param {string} ancestorID
 * @param {string} descendantID
 * @return {boolean} True if `ancestorID` is an ancestor of `descendantID`.
 * @internal
 */
function isAncestorIDOf(ancestorID, descendantID) {
  return descendantID.indexOf(ancestorID) === 0 && isBoundary(descendantID, ancestorID.length);
}

/**
 * Gets the parent ID of the supplied React DOM ID, `id`.
 *
 * @param {string} id ID of a component.
 * @return {string} ID of the parent, or an empty string.
 * @private
 */
function getParentID(id) {
  return id ? id.substr(0, id.lastIndexOf(SEPARATOR)) : '';
}

/**
 * Gets the next DOM ID on the tree path from the supplied `ancestorID` to the
 * supplied `destinationID`. If they are equal, the ID is returned.
 *
 * @param {string} ancestorID ID of an ancestor node of `destinationID`.
 * @param {string} destinationID ID of the destination node.
 * @return {string} Next ID on the path from `ancestorID` to `destinationID`.
 * @private
 */
function getNextDescendantID(ancestorID, destinationID) {
  !(isValidID(ancestorID) && isValidID(destinationID)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'getNextDescendantID(%s, %s): Received an invalid React DOM ID.', ancestorID, destinationID) : invariant(false) : undefined;
  !isAncestorIDOf(ancestorID, destinationID) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'getNextDescendantID(...): React has made an invalid assumption about ' + 'the DOM hierarchy. Expected `%s` to be an ancestor of `%s`.', ancestorID, destinationID) : invariant(false) : undefined;
  if (ancestorID === destinationID) {
    return ancestorID;
  }
  // Skip over the ancestor and the immediate separator. Traverse until we hit
  // another separator or we reach the end of `destinationID`.
  var start = ancestorID.length + SEPARATOR_LENGTH;
  var i;
  for (i = start; i < destinationID.length; i++) {
    if (isBoundary(destinationID, i)) {
      break;
    }
  }
  return destinationID.substr(0, i);
}

/**
 * Gets the nearest common ancestor ID of two IDs.
 *
 * Using this ID scheme, the nearest common ancestor ID is the longest common
 * prefix of the two IDs that immediately preceded a "marker" in both strings.
 *
 * @param {string} oneID
 * @param {string} twoID
 * @return {string} Nearest common ancestor ID, or the empty string if none.
 * @private
 */
function getFirstCommonAncestorID(oneID, twoID) {
  var minLength = Math.min(oneID.length, twoID.length);
  if (minLength === 0) {
    return '';
  }
  var lastCommonMarkerIndex = 0;
  // Use `<=` to traverse until the "EOL" of the shorter string.
  for (var i = 0; i <= minLength; i++) {
    if (isBoundary(oneID, i) && isBoundary(twoID, i)) {
      lastCommonMarkerIndex = i;
    } else if (oneID.charAt(i) !== twoID.charAt(i)) {
      break;
    }
  }
  var longestCommonID = oneID.substr(0, lastCommonMarkerIndex);
  !isValidID(longestCommonID) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'getFirstCommonAncestorID(%s, %s): Expected a valid React DOM ID: %s', oneID, twoID, longestCommonID) : invariant(false) : undefined;
  return longestCommonID;
}

/**
 * Traverses the parent path between two IDs (either up or down). The IDs must
 * not be the same, and there must exist a parent path between them. If the
 * callback returns `false`, traversal is stopped.
 *
 * @param {?string} start ID at which to start traversal.
 * @param {?string} stop ID at which to end traversal.
 * @param {function} cb Callback to invoke each ID with.
 * @param {*} arg Argument to invoke the callback with.
 * @param {?boolean} skipFirst Whether or not to skip the first node.
 * @param {?boolean} skipLast Whether or not to skip the last node.
 * @private
 */
function traverseParentPath(start, stop, cb, arg, skipFirst, skipLast) {
  start = start || '';
  stop = stop || '';
  !(start !== stop) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'traverseParentPath(...): Cannot traverse from and to the same ID, `%s`.', start) : invariant(false) : undefined;
  var traverseUp = isAncestorIDOf(stop, start);
  !(traverseUp || isAncestorIDOf(start, stop)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'traverseParentPath(%s, %s, ...): Cannot traverse from two IDs that do ' + 'not have a parent path.', start, stop) : invariant(false) : undefined;
  // Traverse from `start` to `stop` one depth at a time.
  var depth = 0;
  var traverse = traverseUp ? getParentID : getNextDescendantID;
  for (var id = start;; /* until break */id = traverse(id, stop)) {
    var ret;
    if ((!skipFirst || id !== start) && (!skipLast || id !== stop)) {
      ret = cb(id, traverseUp, arg);
    }
    if (ret === false || id === stop) {
      // Only break //after// visiting `stop`.
      break;
    }
    !(depth++ < MAX_TREE_DEPTH) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'traverseParentPath(%s, %s, ...): Detected an infinite loop while ' + 'traversing the React DOM ID tree. This may be due to malformed IDs: %s', start, stop, id) : invariant(false) : undefined;
  }
}

/**
 * Manages the IDs assigned to DOM representations of React components. This
 * uses a specific scheme in order to traverse the DOM efficiently (e.g. in
 * order to simulate events).
 *
 * @internal
 */
var ReactInstanceHandles = {

  /**
   * Constructs a React root ID
   * @return {string} A React root ID.
   */
  createReactRootID: function createReactRootID() {
    return getReactRootIDString(ReactRootIndex.createReactRootIndex());
  },

  /**
   * Constructs a React ID by joining a root ID with a name.
   *
   * @param {string} rootID Root ID of a parent component.
   * @param {string} name A component's name (as flattened children).
   * @return {string} A React ID.
   * @internal
   */
  createReactID: function createReactID(rootID, name) {
    return rootID + name;
  },

  /**
   * Gets the DOM ID of the React component that is the root of the tree that
   * contains the React component with the supplied DOM ID.
   *
   * @param {string} id DOM ID of a React component.
   * @return {?string} DOM ID of the React component that is the root.
   * @internal
   */
  getReactRootIDFromNodeID: function getReactRootIDFromNodeID(id) {
    if (id && id.charAt(0) === SEPARATOR && id.length > 1) {
      var index = id.indexOf(SEPARATOR, 1);
      return index > -1 ? id.substr(0, index) : id;
    }
    return null;
  },

  /**
   * Traverses the ID hierarchy and invokes the supplied `cb` on any IDs that
   * should would receive a `mouseEnter` or `mouseLeave` event.
   *
   * NOTE: Does not invoke the callback on the nearest common ancestor because
   * nothing "entered" or "left" that element.
   *
   * @param {string} leaveID ID being left.
   * @param {string} enterID ID being entered.
   * @param {function} cb Callback to invoke on each entered/left ID.
   * @param {*} upArg Argument to invoke the callback with on left IDs.
   * @param {*} downArg Argument to invoke the callback with on entered IDs.
   * @internal
   */
  traverseEnterLeave: function traverseEnterLeave(leaveID, enterID, cb, upArg, downArg) {
    var ancestorID = getFirstCommonAncestorID(leaveID, enterID);
    if (ancestorID !== leaveID) {
      traverseParentPath(leaveID, ancestorID, cb, upArg, false, true);
    }
    if (ancestorID !== enterID) {
      traverseParentPath(ancestorID, enterID, cb, downArg, true, false);
    }
  },

  /**
   * Simulates the traversal of a two-phase, capture/bubble event dispatch.
   *
   * NOTE: This traversal happens on IDs without touching the DOM.
   *
   * @param {string} targetID ID of the target node.
   * @param {function} cb Callback to invoke.
   * @param {*} arg Argument to invoke the callback with.
   * @internal
   */
  traverseTwoPhase: function traverseTwoPhase(targetID, cb, arg) {
    if (targetID) {
      traverseParentPath('', targetID, cb, arg, true, false);
      traverseParentPath(targetID, '', cb, arg, false, true);
    }
  },

  /**
   * Same as `traverseTwoPhase` but skips the `targetID`.
   */
  traverseTwoPhaseSkipTarget: function traverseTwoPhaseSkipTarget(targetID, cb, arg) {
    if (targetID) {
      traverseParentPath('', targetID, cb, arg, true, true);
      traverseParentPath(targetID, '', cb, arg, true, true);
    }
  },

  /**
   * Traverse a node ID, calling the supplied `cb` for each ancestor ID. For
   * example, passing `.0.$row-0.1` would result in `cb` getting called
   * with `.0`, `.0.$row-0`, and `.0.$row-0.1`.
   *
   * NOTE: This traversal happens on IDs without touching the DOM.
   *
   * @param {string} targetID ID of the target node.
   * @param {function} cb Callback to invoke.
   * @param {*} arg Argument to invoke the callback with.
   * @internal
   */
  traverseAncestors: function traverseAncestors(targetID, cb, arg) {
    traverseParentPath('', targetID, cb, arg, true, false);
  },

  getFirstCommonAncestorID: getFirstCommonAncestorID,

  /**
   * Exposed for unit testing.
   * @private
   */
  _getNextDescendantID: getNextDescendantID,

  isAncestorIDOf: isAncestorIDOf,

  SEPARATOR: SEPARATOR

};

module.exports = ReactInstanceHandles;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0SW5zdGFuY2VIYW5kbGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVlBOztBQUVBLElBQUksaUJBQWlCLFFBQVEsa0JBQVIsQ0FBakI7O0FBRUosSUFBSSxZQUFZLFFBQVEsb0JBQVIsQ0FBWjs7QUFFSixJQUFJLFlBQVksR0FBWjtBQUNKLElBQUksbUJBQW1CLFVBQVUsTUFBVjs7Ozs7QUFLdkIsSUFBSSxpQkFBaUIsS0FBakI7Ozs7Ozs7OztBQVNKLFNBQVMsb0JBQVQsQ0FBOEIsS0FBOUIsRUFBcUM7QUFDbkMsU0FBTyxZQUFZLE1BQU0sUUFBTixDQUFlLEVBQWYsQ0FBWixDQUQ0QjtDQUFyQzs7Ozs7Ozs7OztBQVlBLFNBQVMsVUFBVCxDQUFvQixFQUFwQixFQUF3QixLQUF4QixFQUErQjtBQUM3QixTQUFPLEdBQUcsTUFBSCxDQUFVLEtBQVYsTUFBcUIsU0FBckIsSUFBa0MsVUFBVSxHQUFHLE1BQUgsQ0FEdEI7Q0FBL0I7Ozs7Ozs7OztBQVdBLFNBQVMsU0FBVCxDQUFtQixFQUFuQixFQUF1QjtBQUNyQixTQUFPLE9BQU8sRUFBUCxJQUFhLEdBQUcsTUFBSCxDQUFVLENBQVYsTUFBaUIsU0FBakIsSUFBOEIsR0FBRyxNQUFILENBQVUsR0FBRyxNQUFILEdBQVksQ0FBWixDQUFWLEtBQTZCLFNBQTdCLENBRDdCO0NBQXZCOzs7Ozs7Ozs7O0FBWUEsU0FBUyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLFlBQXBDLEVBQWtEO0FBQ2hELFNBQU8sYUFBYSxPQUFiLENBQXFCLFVBQXJCLE1BQXFDLENBQXJDLElBQTBDLFdBQVcsWUFBWCxFQUF5QixXQUFXLE1BQVgsQ0FBbkUsQ0FEeUM7Q0FBbEQ7Ozs7Ozs7OztBQVdBLFNBQVMsV0FBVCxDQUFxQixFQUFyQixFQUF5QjtBQUN2QixTQUFPLEtBQUssR0FBRyxNQUFILENBQVUsQ0FBVixFQUFhLEdBQUcsV0FBSCxDQUFlLFNBQWYsQ0FBYixDQUFMLEdBQStDLEVBQS9DLENBRGdCO0NBQXpCOzs7Ozs7Ozs7OztBQWFBLFNBQVMsbUJBQVQsQ0FBNkIsVUFBN0IsRUFBeUMsYUFBekMsRUFBd0Q7QUFDdEQsSUFBRSxVQUFVLFVBQVYsS0FBeUIsVUFBVSxhQUFWLENBQXpCLENBQUYsR0FBdUQsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIsZ0VBQWpCLEVBQW1GLFVBQW5GLEVBQStGLGFBQS9GLENBQXhDLEdBQXdKLFVBQVUsS0FBVixDQUF4SixHQUEySyxTQUFsTyxDQURzRDtBQUV0RCxHQUFDLGVBQWUsVUFBZixFQUEyQixhQUEzQixDQUFELEdBQTZDLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLDBFQUEwRSw2REFBMUUsRUFBeUksVUFBMUosRUFBc0ssYUFBdEssQ0FBeEMsR0FBK04sVUFBVSxLQUFWLENBQS9OLEdBQWtQLFNBQS9SLENBRnNEO0FBR3RELE1BQUksZUFBZSxhQUFmLEVBQThCO0FBQ2hDLFdBQU8sVUFBUCxDQURnQztHQUFsQzs7O0FBSHNELE1BUWxELFFBQVEsV0FBVyxNQUFYLEdBQW9CLGdCQUFwQixDQVIwQztBQVN0RCxNQUFJLENBQUosQ0FUc0Q7QUFVdEQsT0FBSyxJQUFJLEtBQUosRUFBVyxJQUFJLGNBQWMsTUFBZCxFQUFzQixHQUExQyxFQUErQztBQUM3QyxRQUFJLFdBQVcsYUFBWCxFQUEwQixDQUExQixDQUFKLEVBQWtDO0FBQ2hDLFlBRGdDO0tBQWxDO0dBREY7QUFLQSxTQUFPLGNBQWMsTUFBZCxDQUFxQixDQUFyQixFQUF3QixDQUF4QixDQUFQLENBZnNEO0NBQXhEOzs7Ozs7Ozs7Ozs7O0FBNkJBLFNBQVMsd0JBQVQsQ0FBa0MsS0FBbEMsRUFBeUMsS0FBekMsRUFBZ0Q7QUFDOUMsTUFBSSxZQUFZLEtBQUssR0FBTCxDQUFTLE1BQU0sTUFBTixFQUFjLE1BQU0sTUFBTixDQUFuQyxDQUQwQztBQUU5QyxNQUFJLGNBQWMsQ0FBZCxFQUFpQjtBQUNuQixXQUFPLEVBQVAsQ0FEbUI7R0FBckI7QUFHQSxNQUFJLHdCQUF3QixDQUF4Qjs7QUFMMEMsT0FPekMsSUFBSSxJQUFJLENBQUosRUFBTyxLQUFLLFNBQUwsRUFBZ0IsR0FBaEMsRUFBcUM7QUFDbkMsUUFBSSxXQUFXLEtBQVgsRUFBa0IsQ0FBbEIsS0FBd0IsV0FBVyxLQUFYLEVBQWtCLENBQWxCLENBQXhCLEVBQThDO0FBQ2hELDhCQUF3QixDQUF4QixDQURnRDtLQUFsRCxNQUVPLElBQUksTUFBTSxNQUFOLENBQWEsQ0FBYixNQUFvQixNQUFNLE1BQU4sQ0FBYSxDQUFiLENBQXBCLEVBQXFDO0FBQzlDLFlBRDhDO0tBQXpDO0dBSFQ7QUFPQSxNQUFJLGtCQUFrQixNQUFNLE1BQU4sQ0FBYSxDQUFiLEVBQWdCLHFCQUFoQixDQUFsQixDQWQwQztBQWU5QyxHQUFDLFVBQVUsZUFBVixDQUFELEdBQThCLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLHFFQUFqQixFQUF3RixLQUF4RixFQUErRixLQUEvRixFQUFzRyxlQUF0RyxDQUF4QyxHQUFpSyxVQUFVLEtBQVYsQ0FBakssR0FBb0wsU0FBbE4sQ0FmOEM7QUFnQjlDLFNBQU8sZUFBUCxDQWhCOEM7Q0FBaEQ7Ozs7Ozs7Ozs7Ozs7OztBQWdDQSxTQUFTLGtCQUFULENBQTRCLEtBQTVCLEVBQW1DLElBQW5DLEVBQXlDLEVBQXpDLEVBQTZDLEdBQTdDLEVBQWtELFNBQWxELEVBQTZELFFBQTdELEVBQXVFO0FBQ3JFLFVBQVEsU0FBUyxFQUFULENBRDZEO0FBRXJFLFNBQU8sUUFBUSxFQUFSLENBRjhEO0FBR3JFLElBQUUsVUFBVSxJQUFWLENBQUYsR0FBb0IsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIseUVBQWpCLEVBQTRGLEtBQTVGLENBQXhDLEdBQTZJLFVBQVUsS0FBVixDQUE3SSxHQUFnSyxTQUFwTCxDQUhxRTtBQUlyRSxNQUFJLGFBQWEsZUFBZSxJQUFmLEVBQXFCLEtBQXJCLENBQWIsQ0FKaUU7QUFLckUsSUFBRSxjQUFjLGVBQWUsS0FBZixFQUFzQixJQUF0QixDQUFkLENBQUYsR0FBK0MsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIsMkVBQTJFLHlCQUEzRSxFQUFzRyxLQUF2SCxFQUE4SCxJQUE5SCxDQUF4QyxHQUE4SyxVQUFVLEtBQVYsQ0FBOUssR0FBaU0sU0FBaFA7O0FBTHFFLE1BT2pFLFFBQVEsQ0FBUixDQVBpRTtBQVFyRSxNQUFJLFdBQVcsYUFBYSxXQUFiLEdBQTJCLG1CQUEzQixDQVJzRDtBQVNyRSxPQUFLLElBQUksS0FBSyxLQUFMLG9CQUE4QixLQUFLLFNBQVMsRUFBVCxFQUFhLElBQWIsQ0FBTCxFQUF5QjtBQUM5RCxRQUFJLEdBQUosQ0FEOEQ7QUFFOUQsUUFBSSxDQUFDLENBQUMsU0FBRCxJQUFjLE9BQU8sS0FBUCxDQUFmLEtBQWlDLENBQUMsUUFBRCxJQUFhLE9BQU8sSUFBUCxDQUE5QyxFQUE0RDtBQUM5RCxZQUFNLEdBQUcsRUFBSCxFQUFPLFVBQVAsRUFBbUIsR0FBbkIsQ0FBTixDQUQ4RDtLQUFoRTtBQUdBLFFBQUksUUFBUSxLQUFSLElBQWlCLE9BQU8sSUFBUCxFQUFhOztBQUVoQyxZQUZnQztLQUFsQztBQUlBLE1BQUUsVUFBVSxjQUFWLENBQUYsR0FBOEIsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIsc0VBQXNFLHdFQUF0RSxFQUFnSixLQUFqSyxFQUF3SyxJQUF4SyxFQUE4SyxFQUE5SyxDQUF4QyxHQUE0TixVQUFVLEtBQVYsQ0FBNU4sR0FBK08sU0FBN1EsQ0FUOEQ7R0FBaEU7Q0FURjs7Ozs7Ozs7O0FBNkJBLElBQUksdUJBQXVCOzs7Ozs7QUFNekIscUJBQW1CLDZCQUFZO0FBQzdCLFdBQU8scUJBQXFCLGVBQWUsb0JBQWYsRUFBckIsQ0FBUCxDQUQ2QjtHQUFaOzs7Ozs7Ozs7O0FBWW5CLGlCQUFlLHVCQUFVLE1BQVYsRUFBa0IsSUFBbEIsRUFBd0I7QUFDckMsV0FBTyxTQUFTLElBQVQsQ0FEOEI7R0FBeEI7Ozs7Ozs7Ozs7QUFZZiw0QkFBMEIsa0NBQVUsRUFBVixFQUFjO0FBQ3RDLFFBQUksTUFBTSxHQUFHLE1BQUgsQ0FBVSxDQUFWLE1BQWlCLFNBQWpCLElBQThCLEdBQUcsTUFBSCxHQUFZLENBQVosRUFBZTtBQUNyRCxVQUFJLFFBQVEsR0FBRyxPQUFILENBQVcsU0FBWCxFQUFzQixDQUF0QixDQUFSLENBRGlEO0FBRXJELGFBQU8sUUFBUSxDQUFDLENBQUQsR0FBSyxHQUFHLE1BQUgsQ0FBVSxDQUFWLEVBQWEsS0FBYixDQUFiLEdBQW1DLEVBQW5DLENBRjhDO0tBQXZEO0FBSUEsV0FBTyxJQUFQLENBTHNDO0dBQWQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQjFCLHNCQUFvQiw0QkFBVSxPQUFWLEVBQW1CLE9BQW5CLEVBQTRCLEVBQTVCLEVBQWdDLEtBQWhDLEVBQXVDLE9BQXZDLEVBQWdEO0FBQ2xFLFFBQUksYUFBYSx5QkFBeUIsT0FBekIsRUFBa0MsT0FBbEMsQ0FBYixDQUQ4RDtBQUVsRSxRQUFJLGVBQWUsT0FBZixFQUF3QjtBQUMxQix5QkFBbUIsT0FBbkIsRUFBNEIsVUFBNUIsRUFBd0MsRUFBeEMsRUFBNEMsS0FBNUMsRUFBbUQsS0FBbkQsRUFBMEQsSUFBMUQsRUFEMEI7S0FBNUI7QUFHQSxRQUFJLGVBQWUsT0FBZixFQUF3QjtBQUMxQix5QkFBbUIsVUFBbkIsRUFBK0IsT0FBL0IsRUFBd0MsRUFBeEMsRUFBNEMsT0FBNUMsRUFBcUQsSUFBckQsRUFBMkQsS0FBM0QsRUFEMEI7S0FBNUI7R0FMa0I7Ozs7Ozs7Ozs7OztBQW9CcEIsb0JBQWtCLDBCQUFVLFFBQVYsRUFBb0IsRUFBcEIsRUFBd0IsR0FBeEIsRUFBNkI7QUFDN0MsUUFBSSxRQUFKLEVBQWM7QUFDWix5QkFBbUIsRUFBbkIsRUFBdUIsUUFBdkIsRUFBaUMsRUFBakMsRUFBcUMsR0FBckMsRUFBMEMsSUFBMUMsRUFBZ0QsS0FBaEQsRUFEWTtBQUVaLHlCQUFtQixRQUFuQixFQUE2QixFQUE3QixFQUFpQyxFQUFqQyxFQUFxQyxHQUFyQyxFQUEwQyxLQUExQyxFQUFpRCxJQUFqRCxFQUZZO0tBQWQ7R0FEZ0I7Ozs7O0FBVWxCLDhCQUE0QixvQ0FBVSxRQUFWLEVBQW9CLEVBQXBCLEVBQXdCLEdBQXhCLEVBQTZCO0FBQ3ZELFFBQUksUUFBSixFQUFjO0FBQ1oseUJBQW1CLEVBQW5CLEVBQXVCLFFBQXZCLEVBQWlDLEVBQWpDLEVBQXFDLEdBQXJDLEVBQTBDLElBQTFDLEVBQWdELElBQWhELEVBRFk7QUFFWix5QkFBbUIsUUFBbkIsRUFBNkIsRUFBN0IsRUFBaUMsRUFBakMsRUFBcUMsR0FBckMsRUFBMEMsSUFBMUMsRUFBZ0QsSUFBaEQsRUFGWTtLQUFkO0dBRDBCOzs7Ozs7Ozs7Ozs7OztBQW1CNUIscUJBQW1CLDJCQUFVLFFBQVYsRUFBb0IsRUFBcEIsRUFBd0IsR0FBeEIsRUFBNkI7QUFDOUMsdUJBQW1CLEVBQW5CLEVBQXVCLFFBQXZCLEVBQWlDLEVBQWpDLEVBQXFDLEdBQXJDLEVBQTBDLElBQTFDLEVBQWdELEtBQWhELEVBRDhDO0dBQTdCOztBQUluQiw0QkFBMEIsd0JBQTFCOzs7Ozs7QUFNQSx3QkFBc0IsbUJBQXRCOztBQUVBLGtCQUFnQixjQUFoQjs7QUFFQSxhQUFXLFNBQVg7O0NBbkhFOztBQXVISixPQUFPLE9BQVAsR0FBaUIsb0JBQWpCIiwiZmlsZSI6IlJlYWN0SW5zdGFuY2VIYW5kbGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0SW5zdGFuY2VIYW5kbGVzXG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0Um9vdEluZGV4ID0gcmVxdWlyZSgnLi9SZWFjdFJvb3RJbmRleCcpO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnZmJqcy9saWIvaW52YXJpYW50Jyk7XG5cbnZhciBTRVBBUkFUT1IgPSAnLic7XG52YXIgU0VQQVJBVE9SX0xFTkdUSCA9IFNFUEFSQVRPUi5sZW5ndGg7XG5cbi8qKlxuICogTWF4aW11bSBkZXB0aCBvZiB0cmF2ZXJzYWxzIGJlZm9yZSB3ZSBjb25zaWRlciB0aGUgcG9zc2liaWxpdHkgb2YgYSBiYWQgSUQuXG4gKi9cbnZhciBNQVhfVFJFRV9ERVBUSCA9IDEwMDAwO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBET00gSUQgcHJlZml4IHRvIHVzZSB3aGVuIG1vdW50aW5nIFJlYWN0IGNvbXBvbmVudHMuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IEEgdW5pcXVlIGludGVnZXJcbiAqIEByZXR1cm4ge3N0cmluZ30gUmVhY3Qgcm9vdCBJRC5cbiAqIEBpbnRlcm5hbFxuICovXG5mdW5jdGlvbiBnZXRSZWFjdFJvb3RJRFN0cmluZyhpbmRleCkge1xuICByZXR1cm4gU0VQQVJBVE9SICsgaW5kZXgudG9TdHJpbmcoMzYpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGNoYXJhY3RlciBpbiB0aGUgc3VwcGxpZWQgSUQgaXMgYSBzZXBhcmF0b3Igb3IgdGhlIGVuZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgQSBSZWFjdCBET00gSUQuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggSW5kZXggb2YgdGhlIGNoYXJhY3RlciB0byBjaGVjay5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIGNoYXJhY3RlciBpcyBhIHNlcGFyYXRvciBvciBlbmQgb2YgdGhlIElELlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gaXNCb3VuZGFyeShpZCwgaW5kZXgpIHtcbiAgcmV0dXJuIGlkLmNoYXJBdChpbmRleCkgPT09IFNFUEFSQVRPUiB8fCBpbmRleCA9PT0gaWQubGVuZ3RoO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgc3VwcGxpZWQgc3RyaW5nIGlzIGEgdmFsaWQgUmVhY3QgRE9NIElELlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZCBBIFJlYWN0IERPTSBJRCwgbWF5YmUuXG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBzdHJpbmcgaXMgYSB2YWxpZCBSZWFjdCBET00gSUQuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBpc1ZhbGlkSUQoaWQpIHtcbiAgcmV0dXJuIGlkID09PSAnJyB8fCBpZC5jaGFyQXQoMCkgPT09IFNFUEFSQVRPUiAmJiBpZC5jaGFyQXQoaWQubGVuZ3RoIC0gMSkgIT09IFNFUEFSQVRPUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGZpcnN0IElEIGlzIGFuIGFuY2VzdG9yIG9mIG9yIGVxdWFsIHRvIHRoZSBzZWNvbmQgSUQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGFuY2VzdG9ySURcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjZW5kYW50SURcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgYGFuY2VzdG9ySURgIGlzIGFuIGFuY2VzdG9yIG9mIGBkZXNjZW5kYW50SURgLlxuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIGlzQW5jZXN0b3JJRE9mKGFuY2VzdG9ySUQsIGRlc2NlbmRhbnRJRCkge1xuICByZXR1cm4gZGVzY2VuZGFudElELmluZGV4T2YoYW5jZXN0b3JJRCkgPT09IDAgJiYgaXNCb3VuZGFyeShkZXNjZW5kYW50SUQsIGFuY2VzdG9ySUQubGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBwYXJlbnQgSUQgb2YgdGhlIHN1cHBsaWVkIFJlYWN0IERPTSBJRCwgYGlkYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgSUQgb2YgYSBjb21wb25lbnQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IElEIG9mIHRoZSBwYXJlbnQsIG9yIGFuIGVtcHR5IHN0cmluZy5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGdldFBhcmVudElEKGlkKSB7XG4gIHJldHVybiBpZCA/IGlkLnN1YnN0cigwLCBpZC5sYXN0SW5kZXhPZihTRVBBUkFUT1IpKSA6ICcnO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG5leHQgRE9NIElEIG9uIHRoZSB0cmVlIHBhdGggZnJvbSB0aGUgc3VwcGxpZWQgYGFuY2VzdG9ySURgIHRvIHRoZVxuICogc3VwcGxpZWQgYGRlc3RpbmF0aW9uSURgLiBJZiB0aGV5IGFyZSBlcXVhbCwgdGhlIElEIGlzIHJldHVybmVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBhbmNlc3RvcklEIElEIG9mIGFuIGFuY2VzdG9yIG5vZGUgb2YgYGRlc3RpbmF0aW9uSURgLlxuICogQHBhcmFtIHtzdHJpbmd9IGRlc3RpbmF0aW9uSUQgSUQgb2YgdGhlIGRlc3RpbmF0aW9uIG5vZGUuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IE5leHQgSUQgb24gdGhlIHBhdGggZnJvbSBgYW5jZXN0b3JJRGAgdG8gYGRlc3RpbmF0aW9uSURgLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZ2V0TmV4dERlc2NlbmRhbnRJRChhbmNlc3RvcklELCBkZXN0aW5hdGlvbklEKSB7XG4gICEoaXNWYWxpZElEKGFuY2VzdG9ySUQpICYmIGlzVmFsaWRJRChkZXN0aW5hdGlvbklEKSkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnZ2V0TmV4dERlc2NlbmRhbnRJRCglcywgJXMpOiBSZWNlaXZlZCBhbiBpbnZhbGlkIFJlYWN0IERPTSBJRC4nLCBhbmNlc3RvcklELCBkZXN0aW5hdGlvbklEKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICFpc0FuY2VzdG9ySURPZihhbmNlc3RvcklELCBkZXN0aW5hdGlvbklEKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdnZXROZXh0RGVzY2VuZGFudElEKC4uLik6IFJlYWN0IGhhcyBtYWRlIGFuIGludmFsaWQgYXNzdW1wdGlvbiBhYm91dCAnICsgJ3RoZSBET00gaGllcmFyY2h5LiBFeHBlY3RlZCBgJXNgIHRvIGJlIGFuIGFuY2VzdG9yIG9mIGAlc2AuJywgYW5jZXN0b3JJRCwgZGVzdGluYXRpb25JRCkgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICBpZiAoYW5jZXN0b3JJRCA9PT0gZGVzdGluYXRpb25JRCkge1xuICAgIHJldHVybiBhbmNlc3RvcklEO1xuICB9XG4gIC8vIFNraXAgb3ZlciB0aGUgYW5jZXN0b3IgYW5kIHRoZSBpbW1lZGlhdGUgc2VwYXJhdG9yLiBUcmF2ZXJzZSB1bnRpbCB3ZSBoaXRcbiAgLy8gYW5vdGhlciBzZXBhcmF0b3Igb3Igd2UgcmVhY2ggdGhlIGVuZCBvZiBgZGVzdGluYXRpb25JRGAuXG4gIHZhciBzdGFydCA9IGFuY2VzdG9ySUQubGVuZ3RoICsgU0VQQVJBVE9SX0xFTkdUSDtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IHN0YXJ0OyBpIDwgZGVzdGluYXRpb25JRC5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpc0JvdW5kYXJ5KGRlc3RpbmF0aW9uSUQsIGkpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlc3RpbmF0aW9uSUQuc3Vic3RyKDAsIGkpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG5lYXJlc3QgY29tbW9uIGFuY2VzdG9yIElEIG9mIHR3byBJRHMuXG4gKlxuICogVXNpbmcgdGhpcyBJRCBzY2hlbWUsIHRoZSBuZWFyZXN0IGNvbW1vbiBhbmNlc3RvciBJRCBpcyB0aGUgbG9uZ2VzdCBjb21tb25cbiAqIHByZWZpeCBvZiB0aGUgdHdvIElEcyB0aGF0IGltbWVkaWF0ZWx5IHByZWNlZGVkIGEgXCJtYXJrZXJcIiBpbiBib3RoIHN0cmluZ3MuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG9uZUlEXG4gKiBAcGFyYW0ge3N0cmluZ30gdHdvSURcbiAqIEByZXR1cm4ge3N0cmluZ30gTmVhcmVzdCBjb21tb24gYW5jZXN0b3IgSUQsIG9yIHRoZSBlbXB0eSBzdHJpbmcgaWYgbm9uZS5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGdldEZpcnN0Q29tbW9uQW5jZXN0b3JJRChvbmVJRCwgdHdvSUQpIHtcbiAgdmFyIG1pbkxlbmd0aCA9IE1hdGgubWluKG9uZUlELmxlbmd0aCwgdHdvSUQubGVuZ3RoKTtcbiAgaWYgKG1pbkxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICB2YXIgbGFzdENvbW1vbk1hcmtlckluZGV4ID0gMDtcbiAgLy8gVXNlIGA8PWAgdG8gdHJhdmVyc2UgdW50aWwgdGhlIFwiRU9MXCIgb2YgdGhlIHNob3J0ZXIgc3RyaW5nLlxuICBmb3IgKHZhciBpID0gMDsgaSA8PSBtaW5MZW5ndGg7IGkrKykge1xuICAgIGlmIChpc0JvdW5kYXJ5KG9uZUlELCBpKSAmJiBpc0JvdW5kYXJ5KHR3b0lELCBpKSkge1xuICAgICAgbGFzdENvbW1vbk1hcmtlckluZGV4ID0gaTtcbiAgICB9IGVsc2UgaWYgKG9uZUlELmNoYXJBdChpKSAhPT0gdHdvSUQuY2hhckF0KGkpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgdmFyIGxvbmdlc3RDb21tb25JRCA9IG9uZUlELnN1YnN0cigwLCBsYXN0Q29tbW9uTWFya2VySW5kZXgpO1xuICAhaXNWYWxpZElEKGxvbmdlc3RDb21tb25JRCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnZ2V0Rmlyc3RDb21tb25BbmNlc3RvcklEKCVzLCAlcyk6IEV4cGVjdGVkIGEgdmFsaWQgUmVhY3QgRE9NIElEOiAlcycsIG9uZUlELCB0d29JRCwgbG9uZ2VzdENvbW1vbklEKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gIHJldHVybiBsb25nZXN0Q29tbW9uSUQ7XG59XG5cbi8qKlxuICogVHJhdmVyc2VzIHRoZSBwYXJlbnQgcGF0aCBiZXR3ZWVuIHR3byBJRHMgKGVpdGhlciB1cCBvciBkb3duKS4gVGhlIElEcyBtdXN0XG4gKiBub3QgYmUgdGhlIHNhbWUsIGFuZCB0aGVyZSBtdXN0IGV4aXN0IGEgcGFyZW50IHBhdGggYmV0d2VlbiB0aGVtLiBJZiB0aGVcbiAqIGNhbGxiYWNrIHJldHVybnMgYGZhbHNlYCwgdHJhdmVyc2FsIGlzIHN0b3BwZWQuXG4gKlxuICogQHBhcmFtIHs/c3RyaW5nfSBzdGFydCBJRCBhdCB3aGljaCB0byBzdGFydCB0cmF2ZXJzYWwuXG4gKiBAcGFyYW0gez9zdHJpbmd9IHN0b3AgSUQgYXQgd2hpY2ggdG8gZW5kIHRyYXZlcnNhbC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNiIENhbGxiYWNrIHRvIGludm9rZSBlYWNoIElEIHdpdGguXG4gKiBAcGFyYW0geyp9IGFyZyBBcmd1bWVudCB0byBpbnZva2UgdGhlIGNhbGxiYWNrIHdpdGguXG4gKiBAcGFyYW0gez9ib29sZWFufSBza2lwRmlyc3QgV2hldGhlciBvciBub3QgdG8gc2tpcCB0aGUgZmlyc3Qgbm9kZS5cbiAqIEBwYXJhbSB7P2Jvb2xlYW59IHNraXBMYXN0IFdoZXRoZXIgb3Igbm90IHRvIHNraXAgdGhlIGxhc3Qgbm9kZS5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHRyYXZlcnNlUGFyZW50UGF0aChzdGFydCwgc3RvcCwgY2IsIGFyZywgc2tpcEZpcnN0LCBza2lwTGFzdCkge1xuICBzdGFydCA9IHN0YXJ0IHx8ICcnO1xuICBzdG9wID0gc3RvcCB8fCAnJztcbiAgIShzdGFydCAhPT0gc3RvcCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAndHJhdmVyc2VQYXJlbnRQYXRoKC4uLik6IENhbm5vdCB0cmF2ZXJzZSBmcm9tIGFuZCB0byB0aGUgc2FtZSBJRCwgYCVzYC4nLCBzdGFydCkgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICB2YXIgdHJhdmVyc2VVcCA9IGlzQW5jZXN0b3JJRE9mKHN0b3AsIHN0YXJ0KTtcbiAgISh0cmF2ZXJzZVVwIHx8IGlzQW5jZXN0b3JJRE9mKHN0YXJ0LCBzdG9wKSkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAndHJhdmVyc2VQYXJlbnRQYXRoKCVzLCAlcywgLi4uKTogQ2Fubm90IHRyYXZlcnNlIGZyb20gdHdvIElEcyB0aGF0IGRvICcgKyAnbm90IGhhdmUgYSBwYXJlbnQgcGF0aC4nLCBzdGFydCwgc3RvcCkgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAvLyBUcmF2ZXJzZSBmcm9tIGBzdGFydGAgdG8gYHN0b3BgIG9uZSBkZXB0aCBhdCBhIHRpbWUuXG4gIHZhciBkZXB0aCA9IDA7XG4gIHZhciB0cmF2ZXJzZSA9IHRyYXZlcnNlVXAgPyBnZXRQYXJlbnRJRCA6IGdldE5leHREZXNjZW5kYW50SUQ7XG4gIGZvciAodmFyIGlkID0gc3RhcnQ7OyAvKiB1bnRpbCBicmVhayAqL2lkID0gdHJhdmVyc2UoaWQsIHN0b3ApKSB7XG4gICAgdmFyIHJldDtcbiAgICBpZiAoKCFza2lwRmlyc3QgfHwgaWQgIT09IHN0YXJ0KSAmJiAoIXNraXBMYXN0IHx8IGlkICE9PSBzdG9wKSkge1xuICAgICAgcmV0ID0gY2IoaWQsIHRyYXZlcnNlVXAsIGFyZyk7XG4gICAgfVxuICAgIGlmIChyZXQgPT09IGZhbHNlIHx8IGlkID09PSBzdG9wKSB7XG4gICAgICAvLyBPbmx5IGJyZWFrIC8vYWZ0ZXIvLyB2aXNpdGluZyBgc3RvcGAuXG4gICAgICBicmVhaztcbiAgICB9XG4gICAgIShkZXB0aCsrIDwgTUFYX1RSRUVfREVQVEgpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ3RyYXZlcnNlUGFyZW50UGF0aCglcywgJXMsIC4uLik6IERldGVjdGVkIGFuIGluZmluaXRlIGxvb3Agd2hpbGUgJyArICd0cmF2ZXJzaW5nIHRoZSBSZWFjdCBET00gSUQgdHJlZS4gVGhpcyBtYXkgYmUgZHVlIHRvIG1hbGZvcm1lZCBJRHM6ICVzJywgc3RhcnQsIHN0b3AsIGlkKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBNYW5hZ2VzIHRoZSBJRHMgYXNzaWduZWQgdG8gRE9NIHJlcHJlc2VudGF0aW9ucyBvZiBSZWFjdCBjb21wb25lbnRzLiBUaGlzXG4gKiB1c2VzIGEgc3BlY2lmaWMgc2NoZW1lIGluIG9yZGVyIHRvIHRyYXZlcnNlIHRoZSBET00gZWZmaWNpZW50bHkgKGUuZy4gaW5cbiAqIG9yZGVyIHRvIHNpbXVsYXRlIGV2ZW50cykuXG4gKlxuICogQGludGVybmFsXG4gKi9cbnZhciBSZWFjdEluc3RhbmNlSGFuZGxlcyA9IHtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIFJlYWN0IHJvb3QgSURcbiAgICogQHJldHVybiB7c3RyaW5nfSBBIFJlYWN0IHJvb3QgSUQuXG4gICAqL1xuICBjcmVhdGVSZWFjdFJvb3RJRDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnZXRSZWFjdFJvb3RJRFN0cmluZyhSZWFjdFJvb3RJbmRleC5jcmVhdGVSZWFjdFJvb3RJbmRleCgpKTtcbiAgfSxcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIFJlYWN0IElEIGJ5IGpvaW5pbmcgYSByb290IElEIHdpdGggYSBuYW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcm9vdElEIFJvb3QgSUQgb2YgYSBwYXJlbnQgY29tcG9uZW50LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBBIGNvbXBvbmVudCdzIG5hbWUgKGFzIGZsYXR0ZW5lZCBjaGlsZHJlbikuXG4gICAqIEByZXR1cm4ge3N0cmluZ30gQSBSZWFjdCBJRC5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBjcmVhdGVSZWFjdElEOiBmdW5jdGlvbiAocm9vdElELCBuYW1lKSB7XG4gICAgcmV0dXJuIHJvb3RJRCArIG5hbWU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIERPTSBJRCBvZiB0aGUgUmVhY3QgY29tcG9uZW50IHRoYXQgaXMgdGhlIHJvb3Qgb2YgdGhlIHRyZWUgdGhhdFxuICAgKiBjb250YWlucyB0aGUgUmVhY3QgY29tcG9uZW50IHdpdGggdGhlIHN1cHBsaWVkIERPTSBJRC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIERPTSBJRCBvZiBhIFJlYWN0IGNvbXBvbmVudC5cbiAgICogQHJldHVybiB7P3N0cmluZ30gRE9NIElEIG9mIHRoZSBSZWFjdCBjb21wb25lbnQgdGhhdCBpcyB0aGUgcm9vdC5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBnZXRSZWFjdFJvb3RJREZyb21Ob2RlSUQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIGlmIChpZCAmJiBpZC5jaGFyQXQoMCkgPT09IFNFUEFSQVRPUiAmJiBpZC5sZW5ndGggPiAxKSB7XG4gICAgICB2YXIgaW5kZXggPSBpZC5pbmRleE9mKFNFUEFSQVRPUiwgMSk7XG4gICAgICByZXR1cm4gaW5kZXggPiAtMSA/IGlkLnN1YnN0cigwLCBpbmRleCkgOiBpZDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRyYXZlcnNlcyB0aGUgSUQgaGllcmFyY2h5IGFuZCBpbnZva2VzIHRoZSBzdXBwbGllZCBgY2JgIG9uIGFueSBJRHMgdGhhdFxuICAgKiBzaG91bGQgd291bGQgcmVjZWl2ZSBhIGBtb3VzZUVudGVyYCBvciBgbW91c2VMZWF2ZWAgZXZlbnQuXG4gICAqXG4gICAqIE5PVEU6IERvZXMgbm90IGludm9rZSB0aGUgY2FsbGJhY2sgb24gdGhlIG5lYXJlc3QgY29tbW9uIGFuY2VzdG9yIGJlY2F1c2VcbiAgICogbm90aGluZyBcImVudGVyZWRcIiBvciBcImxlZnRcIiB0aGF0IGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZWF2ZUlEIElEIGJlaW5nIGxlZnQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbnRlcklEIElEIGJlaW5nIGVudGVyZWQuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNiIENhbGxiYWNrIHRvIGludm9rZSBvbiBlYWNoIGVudGVyZWQvbGVmdCBJRC5cbiAgICogQHBhcmFtIHsqfSB1cEFyZyBBcmd1bWVudCB0byBpbnZva2UgdGhlIGNhbGxiYWNrIHdpdGggb24gbGVmdCBJRHMuXG4gICAqIEBwYXJhbSB7Kn0gZG93bkFyZyBBcmd1bWVudCB0byBpbnZva2UgdGhlIGNhbGxiYWNrIHdpdGggb24gZW50ZXJlZCBJRHMuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgdHJhdmVyc2VFbnRlckxlYXZlOiBmdW5jdGlvbiAobGVhdmVJRCwgZW50ZXJJRCwgY2IsIHVwQXJnLCBkb3duQXJnKSB7XG4gICAgdmFyIGFuY2VzdG9ySUQgPSBnZXRGaXJzdENvbW1vbkFuY2VzdG9ySUQobGVhdmVJRCwgZW50ZXJJRCk7XG4gICAgaWYgKGFuY2VzdG9ySUQgIT09IGxlYXZlSUQpIHtcbiAgICAgIHRyYXZlcnNlUGFyZW50UGF0aChsZWF2ZUlELCBhbmNlc3RvcklELCBjYiwgdXBBcmcsIGZhbHNlLCB0cnVlKTtcbiAgICB9XG4gICAgaWYgKGFuY2VzdG9ySUQgIT09IGVudGVySUQpIHtcbiAgICAgIHRyYXZlcnNlUGFyZW50UGF0aChhbmNlc3RvcklELCBlbnRlcklELCBjYiwgZG93bkFyZywgdHJ1ZSwgZmFsc2UpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogU2ltdWxhdGVzIHRoZSB0cmF2ZXJzYWwgb2YgYSB0d28tcGhhc2UsIGNhcHR1cmUvYnViYmxlIGV2ZW50IGRpc3BhdGNoLlxuICAgKlxuICAgKiBOT1RFOiBUaGlzIHRyYXZlcnNhbCBoYXBwZW5zIG9uIElEcyB3aXRob3V0IHRvdWNoaW5nIHRoZSBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXRJRCBJRCBvZiB0aGUgdGFyZ2V0IG5vZGUuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNiIENhbGxiYWNrIHRvIGludm9rZS5cbiAgICogQHBhcmFtIHsqfSBhcmcgQXJndW1lbnQgdG8gaW52b2tlIHRoZSBjYWxsYmFjayB3aXRoLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHRyYXZlcnNlVHdvUGhhc2U6IGZ1bmN0aW9uICh0YXJnZXRJRCwgY2IsIGFyZykge1xuICAgIGlmICh0YXJnZXRJRCkge1xuICAgICAgdHJhdmVyc2VQYXJlbnRQYXRoKCcnLCB0YXJnZXRJRCwgY2IsIGFyZywgdHJ1ZSwgZmFsc2UpO1xuICAgICAgdHJhdmVyc2VQYXJlbnRQYXRoKHRhcmdldElELCAnJywgY2IsIGFyZywgZmFsc2UsIHRydWUpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogU2FtZSBhcyBgdHJhdmVyc2VUd29QaGFzZWAgYnV0IHNraXBzIHRoZSBgdGFyZ2V0SURgLlxuICAgKi9cbiAgdHJhdmVyc2VUd29QaGFzZVNraXBUYXJnZXQ6IGZ1bmN0aW9uICh0YXJnZXRJRCwgY2IsIGFyZykge1xuICAgIGlmICh0YXJnZXRJRCkge1xuICAgICAgdHJhdmVyc2VQYXJlbnRQYXRoKCcnLCB0YXJnZXRJRCwgY2IsIGFyZywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICB0cmF2ZXJzZVBhcmVudFBhdGgodGFyZ2V0SUQsICcnLCBjYiwgYXJnLCB0cnVlLCB0cnVlKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRyYXZlcnNlIGEgbm9kZSBJRCwgY2FsbGluZyB0aGUgc3VwcGxpZWQgYGNiYCBmb3IgZWFjaCBhbmNlc3RvciBJRC4gRm9yXG4gICAqIGV4YW1wbGUsIHBhc3NpbmcgYC4wLiRyb3ctMC4xYCB3b3VsZCByZXN1bHQgaW4gYGNiYCBnZXR0aW5nIGNhbGxlZFxuICAgKiB3aXRoIGAuMGAsIGAuMC4kcm93LTBgLCBhbmQgYC4wLiRyb3ctMC4xYC5cbiAgICpcbiAgICogTk9URTogVGhpcyB0cmF2ZXJzYWwgaGFwcGVucyBvbiBJRHMgd2l0aG91dCB0b3VjaGluZyB0aGUgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0SUQgSUQgb2YgdGhlIHRhcmdldCBub2RlLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYiBDYWxsYmFjayB0byBpbnZva2UuXG4gICAqIEBwYXJhbSB7Kn0gYXJnIEFyZ3VtZW50IHRvIGludm9rZSB0aGUgY2FsbGJhY2sgd2l0aC5cbiAgICogQGludGVybmFsXG4gICAqL1xuICB0cmF2ZXJzZUFuY2VzdG9yczogZnVuY3Rpb24gKHRhcmdldElELCBjYiwgYXJnKSB7XG4gICAgdHJhdmVyc2VQYXJlbnRQYXRoKCcnLCB0YXJnZXRJRCwgY2IsIGFyZywgdHJ1ZSwgZmFsc2UpO1xuICB9LFxuXG4gIGdldEZpcnN0Q29tbW9uQW5jZXN0b3JJRDogZ2V0Rmlyc3RDb21tb25BbmNlc3RvcklELFxuXG4gIC8qKlxuICAgKiBFeHBvc2VkIGZvciB1bml0IHRlc3RpbmcuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZ2V0TmV4dERlc2NlbmRhbnRJRDogZ2V0TmV4dERlc2NlbmRhbnRJRCxcblxuICBpc0FuY2VzdG9ySURPZjogaXNBbmNlc3RvcklET2YsXG5cbiAgU0VQQVJBVE9SOiBTRVBBUkFUT1JcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdEluc3RhbmNlSGFuZGxlczsiXX0=