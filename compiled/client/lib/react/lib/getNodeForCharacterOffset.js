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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2dldE5vZGVGb3JDaGFyYWN0ZXJPZmZzZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7Ozs7Ozs7O0FBUUEsU0FBUyxXQUFULENBQXFCLElBQXJCLEVBQTJCO0FBQ3pCLFNBQU8sUUFBUSxLQUFLLFVBQXBCLEVBQWdDO0FBQzlCLFdBQU8sS0FBSyxVQUFaO0FBQ0Q7QUFDRCxTQUFPLElBQVA7QUFDRDs7Ozs7Ozs7O0FBU0QsU0FBUyxjQUFULENBQXdCLElBQXhCLEVBQThCO0FBQzVCLFNBQU8sSUFBUCxFQUFhO0FBQ1gsUUFBSSxLQUFLLFdBQVQsRUFBc0I7QUFDcEIsYUFBTyxLQUFLLFdBQVo7QUFDRDtBQUNELFdBQU8sS0FBSyxVQUFaO0FBQ0Q7QUFDRjs7Ozs7Ozs7O0FBU0QsU0FBUyx5QkFBVCxDQUFtQyxJQUFuQyxFQUF5QyxNQUF6QyxFQUFpRDtBQUMvQyxNQUFJLE9BQU8sWUFBWSxJQUFaLENBQVg7QUFDQSxNQUFJLFlBQVksQ0FBaEI7QUFDQSxNQUFJLFVBQVUsQ0FBZDs7QUFFQSxTQUFPLElBQVAsRUFBYTtBQUNYLFFBQUksS0FBSyxRQUFMLEtBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLGdCQUFVLFlBQVksS0FBSyxXQUFMLENBQWlCLE1BQXZDOztBQUVBLFVBQUksYUFBYSxNQUFiLElBQXVCLFdBQVcsTUFBdEMsRUFBOEM7QUFDNUMsZUFBTztBQUNMLGdCQUFNLElBREQ7QUFFTCxrQkFBUSxTQUFTO0FBRlosU0FBUDtBQUlEOztBQUVELGtCQUFZLE9BQVo7QUFDRDs7QUFFRCxXQUFPLFlBQVksZUFBZSxJQUFmLENBQVosQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLHlCQUFqQiIsImZpbGUiOiJnZXROb2RlRm9yQ2hhcmFjdGVyT2Zmc2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGdldE5vZGVGb3JDaGFyYWN0ZXJPZmZzZXRcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogR2l2ZW4gYW55IG5vZGUgcmV0dXJuIHRoZSBmaXJzdCBsZWFmIG5vZGUgd2l0aG91dCBjaGlsZHJlbi5cbiAqXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR8RE9NVGV4dE5vZGV9IG5vZGVcbiAqIEByZXR1cm4ge0RPTUVsZW1lbnR8RE9NVGV4dE5vZGV9XG4gKi9cbmZ1bmN0aW9uIGdldExlYWZOb2RlKG5vZGUpIHtcbiAgd2hpbGUgKG5vZGUgJiYgbm9kZS5maXJzdENoaWxkKSB7XG4gICAgbm9kZSA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgfVxuICByZXR1cm4gbm9kZTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIG5leHQgc2libGluZyB3aXRoaW4gYSBjb250YWluZXIuIFRoaXMgd2lsbCB3YWxrIHVwIHRoZVxuICogRE9NIGlmIGEgbm9kZSdzIHNpYmxpbmdzIGhhdmUgYmVlbiBleGhhdXN0ZWQuXG4gKlxuICogQHBhcmFtIHtET01FbGVtZW50fERPTVRleHROb2RlfSBub2RlXG4gKiBAcmV0dXJuIHs/RE9NRWxlbWVudHxET01UZXh0Tm9kZX1cbiAqL1xuZnVuY3Rpb24gZ2V0U2libGluZ05vZGUobm9kZSkge1xuICB3aGlsZSAobm9kZSkge1xuICAgIGlmIChub2RlLm5leHRTaWJsaW5nKSB7XG4gICAgICByZXR1cm4gbm9kZS5uZXh0U2libGluZztcbiAgICB9XG4gICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgfVxufVxuXG4vKipcbiAqIEdldCBvYmplY3QgZGVzY3JpYmluZyB0aGUgbm9kZXMgd2hpY2ggY29udGFpbiBjaGFyYWN0ZXJzIGF0IG9mZnNldC5cbiAqXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR8RE9NVGV4dE5vZGV9IHJvb3RcbiAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXRcbiAqIEByZXR1cm4gez9vYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGdldE5vZGVGb3JDaGFyYWN0ZXJPZmZzZXQocm9vdCwgb2Zmc2V0KSB7XG4gIHZhciBub2RlID0gZ2V0TGVhZk5vZGUocm9vdCk7XG4gIHZhciBub2RlU3RhcnQgPSAwO1xuICB2YXIgbm9kZUVuZCA9IDA7XG5cbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgbm9kZUVuZCA9IG5vZGVTdGFydCArIG5vZGUudGV4dENvbnRlbnQubGVuZ3RoO1xuXG4gICAgICBpZiAobm9kZVN0YXJ0IDw9IG9mZnNldCAmJiBub2RlRW5kID49IG9mZnNldCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5vZGU6IG5vZGUsXG4gICAgICAgICAgb2Zmc2V0OiBvZmZzZXQgLSBub2RlU3RhcnRcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgbm9kZVN0YXJ0ID0gbm9kZUVuZDtcbiAgICB9XG5cbiAgICBub2RlID0gZ2V0TGVhZk5vZGUoZ2V0U2libGluZ05vZGUobm9kZSkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0Tm9kZUZvckNoYXJhY3Rlck9mZnNldDsiXX0=