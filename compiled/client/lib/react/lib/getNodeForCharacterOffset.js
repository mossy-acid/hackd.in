/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getNodeForCharacterOffset
 */

'use strict';

/**
 * Given any node return the first leaf node without children.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {DOMElement|DOMTextNode}
 */

function getLeafNode(node) {
  while (node && node.firstChild) {
    node = node.firstChild;
  }
  return node;
}

/**
 * Get the next sibling within a container. This will walk up the
 * DOM if a node's siblings have been exhausted.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {?DOMElement|DOMTextNode}
 */
function getSiblingNode(node) {
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
}

/**
 * Get object describing the nodes which contain characters at offset.
 *
 * @param {DOMElement|DOMTextNode} root
 * @param {number} offset
 * @return {?object}
 */
function getNodeForCharacterOffset(root, offset) {
  var node = getLeafNode(root);
  var nodeStart = 0;
  var nodeEnd = 0;

  while (node) {
    if (node.nodeType === 3) {
      nodeEnd = nodeStart + node.textContent.length;

      if (nodeStart <= offset && nodeEnd >= offset) {
        return {
          node: node,
          offset: offset - nodeStart
        };
      }

      nodeStart = nodeEnd;
    }

    node = getLeafNode(getSiblingNode(node));
  }
}

module.exports = getNodeForCharacterOffset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2dldE5vZGVGb3JDaGFyYWN0ZXJPZmZzZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7Ozs7Ozs7O0FBUUEsU0FBUyxXQUFULENBQXFCLElBQXJCLEVBQTJCO0FBQ3pCLFNBQU8sUUFBUSxLQUFLLFVBQUwsRUFBaUI7QUFDOUIsV0FBTyxLQUFLLFVBQUwsQ0FEdUI7R0FBaEM7QUFHQSxTQUFPLElBQVAsQ0FKeUI7Q0FBM0I7Ozs7Ozs7OztBQWNBLFNBQVMsY0FBVCxDQUF3QixJQUF4QixFQUE4QjtBQUM1QixTQUFPLElBQVAsRUFBYTtBQUNYLFFBQUksS0FBSyxXQUFMLEVBQWtCO0FBQ3BCLGFBQU8sS0FBSyxXQUFMLENBRGE7S0FBdEI7QUFHQSxXQUFPLEtBQUssVUFBTCxDQUpJO0dBQWI7Q0FERjs7Ozs7Ozs7O0FBZ0JBLFNBQVMseUJBQVQsQ0FBbUMsSUFBbkMsRUFBeUMsTUFBekMsRUFBaUQ7QUFDL0MsTUFBSSxPQUFPLFlBQVksSUFBWixDQUFQLENBRDJDO0FBRS9DLE1BQUksWUFBWSxDQUFaLENBRjJDO0FBRy9DLE1BQUksVUFBVSxDQUFWLENBSDJDOztBQUsvQyxTQUFPLElBQVAsRUFBYTtBQUNYLFFBQUksS0FBSyxRQUFMLEtBQWtCLENBQWxCLEVBQXFCO0FBQ3ZCLGdCQUFVLFlBQVksS0FBSyxXQUFMLENBQWlCLE1BQWpCLENBREM7O0FBR3ZCLFVBQUksYUFBYSxNQUFiLElBQXVCLFdBQVcsTUFBWCxFQUFtQjtBQUM1QyxlQUFPO0FBQ0wsZ0JBQU0sSUFBTjtBQUNBLGtCQUFRLFNBQVMsU0FBVDtTQUZWLENBRDRDO09BQTlDOztBQU9BLGtCQUFZLE9BQVosQ0FWdUI7S0FBekI7O0FBYUEsV0FBTyxZQUFZLGVBQWUsSUFBZixDQUFaLENBQVAsQ0FkVztHQUFiO0NBTEY7O0FBdUJBLE9BQU8sT0FBUCxHQUFpQix5QkFBakIiLCJmaWxlIjoiZ2V0Tm9kZUZvckNoYXJhY3Rlck9mZnNldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBnZXROb2RlRm9yQ2hhcmFjdGVyT2Zmc2V0XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEdpdmVuIGFueSBub2RlIHJldHVybiB0aGUgZmlyc3QgbGVhZiBub2RlIHdpdGhvdXQgY2hpbGRyZW4uXG4gKlxuICogQHBhcmFtIHtET01FbGVtZW50fERPTVRleHROb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtET01FbGVtZW50fERPTVRleHROb2RlfVxuICovXG5mdW5jdGlvbiBnZXRMZWFmTm9kZShub2RlKSB7XG4gIHdoaWxlIChub2RlICYmIG5vZGUuZmlyc3RDaGlsZCkge1xuICAgIG5vZGUgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gIH1cbiAgcmV0dXJuIG5vZGU7XG59XG5cbi8qKlxuICogR2V0IHRoZSBuZXh0IHNpYmxpbmcgd2l0aGluIGEgY29udGFpbmVyLiBUaGlzIHdpbGwgd2FsayB1cCB0aGVcbiAqIERPTSBpZiBhIG5vZGUncyBzaWJsaW5ncyBoYXZlIGJlZW4gZXhoYXVzdGVkLlxuICpcbiAqIEBwYXJhbSB7RE9NRWxlbWVudHxET01UZXh0Tm9kZX0gbm9kZVxuICogQHJldHVybiB7P0RPTUVsZW1lbnR8RE9NVGV4dE5vZGV9XG4gKi9cbmZ1bmN0aW9uIGdldFNpYmxpbmdOb2RlKG5vZGUpIHtcbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBpZiAobm9kZS5uZXh0U2libGluZykge1xuICAgICAgcmV0dXJuIG5vZGUubmV4dFNpYmxpbmc7XG4gICAgfVxuICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgb2JqZWN0IGRlc2NyaWJpbmcgdGhlIG5vZGVzIHdoaWNoIGNvbnRhaW4gY2hhcmFjdGVycyBhdCBvZmZzZXQuXG4gKlxuICogQHBhcmFtIHtET01FbGVtZW50fERPTVRleHROb2RlfSByb290XG4gKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0XG4gKiBAcmV0dXJuIHs/b2JqZWN0fVxuICovXG5mdW5jdGlvbiBnZXROb2RlRm9yQ2hhcmFjdGVyT2Zmc2V0KHJvb3QsIG9mZnNldCkge1xuICB2YXIgbm9kZSA9IGdldExlYWZOb2RlKHJvb3QpO1xuICB2YXIgbm9kZVN0YXJ0ID0gMDtcbiAgdmFyIG5vZGVFbmQgPSAwO1xuXG4gIHdoaWxlIChub2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgIG5vZGVFbmQgPSBub2RlU3RhcnQgKyBub2RlLnRleHRDb250ZW50Lmxlbmd0aDtcblxuICAgICAgaWYgKG5vZGVTdGFydCA8PSBvZmZzZXQgJiYgbm9kZUVuZCA+PSBvZmZzZXQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICAgIG9mZnNldDogb2Zmc2V0IC0gbm9kZVN0YXJ0XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG5vZGVTdGFydCA9IG5vZGVFbmQ7XG4gICAgfVxuXG4gICAgbm9kZSA9IGdldExlYWZOb2RlKGdldFNpYmxpbmdOb2RlKG5vZGUpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5vZGVGb3JDaGFyYWN0ZXJPZmZzZXQ7Il19