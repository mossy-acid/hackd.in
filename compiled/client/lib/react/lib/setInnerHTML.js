/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule setInnerHTML
 */

/* globals MSApp */

'use strict';

var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

var WHITESPACE_TEST = /^[ \r\n\t\f]/;
var NONVISIBLE_TEST = /<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/;

/**
 * Set the innerHTML property of a node, ensuring that whitespace is preserved
 * even in IE8.
 *
 * @param {DOMElement} node
 * @param {string} html
 * @internal
 */
var setInnerHTML = function setInnerHTML(node, html) {
  node.innerHTML = html;
};

// Win8 apps: Allow all html to be inserted
if (typeof MSApp !== 'undefined' && MSApp.execUnsafeLocalFunction) {
  setInnerHTML = function setInnerHTML(node, html) {
    MSApp.execUnsafeLocalFunction(function () {
      node.innerHTML = html;
    });
  };
}

if (ExecutionEnvironment.canUseDOM) {
  // IE8: When updating a just created node with innerHTML only leading
  // whitespace is removed. When updating an existing node with innerHTML
  // whitespace in root TextNodes is also collapsed.
  // @see quirksmode.org/bugreports/archives/2004/11/innerhtml_and_t.html

  // Feature detection; only IE8 is known to behave improperly like this.
  var testElement = document.createElement('div');
  testElement.innerHTML = ' ';
  if (testElement.innerHTML === '') {
    setInnerHTML = function setInnerHTML(node, html) {
      // Magic theory: IE8 supposedly differentiates between added and updated
      // nodes when processing innerHTML, innerHTML on updated nodes suffers
      // from worse whitespace behavior. Re-adding a node like this triggers
      // the initial and more favorable whitespace behavior.
      // TODO: What to do on a detached node?
      if (node.parentNode) {
        node.parentNode.replaceChild(node, node);
      }

      // We also implement a workaround for non-visible tags disappearing into
      // thin air on IE8, this only happens if there is no visible text
      // in-front of the non-visible tags. Piggyback on the whitespace fix
      // and simply check if any non-visible tags appear in the source.
      if (WHITESPACE_TEST.test(html) || html[0] === '<' && NONVISIBLE_TEST.test(html)) {
        // Recover leading whitespace by temporarily prepending any character.
        // \uFEFF has the potential advantage of being zero-width/invisible.
        // UglifyJS drops U+FEFF chars when parsing, so use String.fromCharCode
        // in hopes that this is preserved even if "\uFEFF" is transformed to
        // the actual Unicode character (by Babel, for example).
        // https://github.com/mishoo/UglifyJS2/blob/v2.4.20/lib/parse.js#L216
        node.innerHTML = String.fromCharCode(0xFEFF) + html;

        // deleteData leaves an empty `TextNode` which offsets the index of all
        // children. Definitely want to avoid this.
        var textNode = node.firstChild;
        if (textNode.data.length === 1) {
          node.removeChild(textNode);
        } else {
          textNode.deleteData(0, 1);
        }
      } else {
        node.innerHTML = html;
      }
    };
  }
}

module.exports = setInnerHTML;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL3NldElubmVySFRNTC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBYUE7O0FBRUEsSUFBSSx1QkFBdUIsUUFBUSwrQkFBUixDQUEzQjs7QUFFQSxJQUFJLGtCQUFrQixjQUF0QjtBQUNBLElBQUksa0JBQWtCLHNEQUF0Qjs7Ozs7Ozs7OztBQVVBLElBQUksZUFBZSxzQkFBVSxJQUFWLEVBQWdCLElBQWhCLEVBQXNCO0FBQ3ZDLE9BQUssU0FBTCxHQUFpQixJQUFqQjtBQUNELENBRkQ7OztBQUtBLElBQUksT0FBTyxLQUFQLEtBQWlCLFdBQWpCLElBQWdDLE1BQU0sdUJBQTFDLEVBQW1FO0FBQ2pFLGlCQUFlLHNCQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0I7QUFDbkMsVUFBTSx1QkFBTixDQUE4QixZQUFZO0FBQ3hDLFdBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNELEtBRkQ7QUFHRCxHQUpEO0FBS0Q7O0FBRUQsSUFBSSxxQkFBcUIsU0FBekIsRUFBb0M7Ozs7Ozs7QUFPbEMsTUFBSSxjQUFjLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFsQjtBQUNBLGNBQVksU0FBWixHQUF3QixHQUF4QjtBQUNBLE1BQUksWUFBWSxTQUFaLEtBQTBCLEVBQTlCLEVBQWtDO0FBQ2hDLG1CQUFlLHNCQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0I7Ozs7OztBQU1uQyxVQUFJLEtBQUssVUFBVCxFQUFxQjtBQUNuQixhQUFLLFVBQUwsQ0FBZ0IsWUFBaEIsQ0FBNkIsSUFBN0IsRUFBbUMsSUFBbkM7QUFDRDs7Ozs7O0FBTUQsVUFBSSxnQkFBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsS0FBOEIsS0FBSyxDQUFMLE1BQVksR0FBWixJQUFtQixnQkFBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBckQsRUFBaUY7Ozs7Ozs7QUFPL0UsYUFBSyxTQUFMLEdBQWlCLE9BQU8sWUFBUCxDQUFvQixNQUFwQixJQUE4QixJQUEvQzs7OztBQUlBLFlBQUksV0FBVyxLQUFLLFVBQXBCO0FBQ0EsWUFBSSxTQUFTLElBQVQsQ0FBYyxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzlCLGVBQUssV0FBTCxDQUFpQixRQUFqQjtBQUNELFNBRkQsTUFFTztBQUNMLG1CQUFTLFVBQVQsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkI7QUFDRDtBQUNGLE9BakJELE1BaUJPO0FBQ0wsYUFBSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0Q7QUFDRixLQWxDRDtBQW1DRDtBQUNGOztBQUVELE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJzZXRJbm5lckhUTUwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgc2V0SW5uZXJIVE1MXG4gKi9cblxuLyogZ2xvYmFscyBNU0FwcCAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBFeGVjdXRpb25FbnZpcm9ubWVudCA9IHJlcXVpcmUoJ2ZianMvbGliL0V4ZWN1dGlvbkVudmlyb25tZW50Jyk7XG5cbnZhciBXSElURVNQQUNFX1RFU1QgPSAvXlsgXFxyXFxuXFx0XFxmXS87XG52YXIgTk9OVklTSUJMRV9URVNUID0gLzwoIS0tfGxpbmt8bm9zY3JpcHR8bWV0YXxzY3JpcHR8c3R5bGUpWyBcXHJcXG5cXHRcXGZcXC8+XS87XG5cbi8qKlxuICogU2V0IHRoZSBpbm5lckhUTUwgcHJvcGVydHkgb2YgYSBub2RlLCBlbnN1cmluZyB0aGF0IHdoaXRlc3BhY2UgaXMgcHJlc2VydmVkXG4gKiBldmVuIGluIElFOC5cbiAqXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sXG4gKiBAaW50ZXJuYWxcbiAqL1xudmFyIHNldElubmVySFRNTCA9IGZ1bmN0aW9uIChub2RlLCBodG1sKSB7XG4gIG5vZGUuaW5uZXJIVE1MID0gaHRtbDtcbn07XG5cbi8vIFdpbjggYXBwczogQWxsb3cgYWxsIGh0bWwgdG8gYmUgaW5zZXJ0ZWRcbmlmICh0eXBlb2YgTVNBcHAgIT09ICd1bmRlZmluZWQnICYmIE1TQXBwLmV4ZWNVbnNhZmVMb2NhbEZ1bmN0aW9uKSB7XG4gIHNldElubmVySFRNTCA9IGZ1bmN0aW9uIChub2RlLCBodG1sKSB7XG4gICAgTVNBcHAuZXhlY1Vuc2FmZUxvY2FsRnVuY3Rpb24oZnVuY3Rpb24gKCkge1xuICAgICAgbm9kZS5pbm5lckhUTUwgPSBodG1sO1xuICAgIH0pO1xuICB9O1xufVxuXG5pZiAoRXhlY3V0aW9uRW52aXJvbm1lbnQuY2FuVXNlRE9NKSB7XG4gIC8vIElFODogV2hlbiB1cGRhdGluZyBhIGp1c3QgY3JlYXRlZCBub2RlIHdpdGggaW5uZXJIVE1MIG9ubHkgbGVhZGluZ1xuICAvLyB3aGl0ZXNwYWNlIGlzIHJlbW92ZWQuIFdoZW4gdXBkYXRpbmcgYW4gZXhpc3Rpbmcgbm9kZSB3aXRoIGlubmVySFRNTFxuICAvLyB3aGl0ZXNwYWNlIGluIHJvb3QgVGV4dE5vZGVzIGlzIGFsc28gY29sbGFwc2VkLlxuICAvLyBAc2VlIHF1aXJrc21vZGUub3JnL2J1Z3JlcG9ydHMvYXJjaGl2ZXMvMjAwNC8xMS9pbm5lcmh0bWxfYW5kX3QuaHRtbFxuXG4gIC8vIEZlYXR1cmUgZGV0ZWN0aW9uOyBvbmx5IElFOCBpcyBrbm93biB0byBiZWhhdmUgaW1wcm9wZXJseSBsaWtlIHRoaXMuXG4gIHZhciB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0ZXN0RWxlbWVudC5pbm5lckhUTUwgPSAnICc7XG4gIGlmICh0ZXN0RWxlbWVudC5pbm5lckhUTUwgPT09ICcnKSB7XG4gICAgc2V0SW5uZXJIVE1MID0gZnVuY3Rpb24gKG5vZGUsIGh0bWwpIHtcbiAgICAgIC8vIE1hZ2ljIHRoZW9yeTogSUU4IHN1cHBvc2VkbHkgZGlmZmVyZW50aWF0ZXMgYmV0d2VlbiBhZGRlZCBhbmQgdXBkYXRlZFxuICAgICAgLy8gbm9kZXMgd2hlbiBwcm9jZXNzaW5nIGlubmVySFRNTCwgaW5uZXJIVE1MIG9uIHVwZGF0ZWQgbm9kZXMgc3VmZmVyc1xuICAgICAgLy8gZnJvbSB3b3JzZSB3aGl0ZXNwYWNlIGJlaGF2aW9yLiBSZS1hZGRpbmcgYSBub2RlIGxpa2UgdGhpcyB0cmlnZ2Vyc1xuICAgICAgLy8gdGhlIGluaXRpYWwgYW5kIG1vcmUgZmF2b3JhYmxlIHdoaXRlc3BhY2UgYmVoYXZpb3IuXG4gICAgICAvLyBUT0RPOiBXaGF0IHRvIGRvIG9uIGEgZGV0YWNoZWQgbm9kZT9cbiAgICAgIGlmIChub2RlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChub2RlLCBub2RlKTtcbiAgICAgIH1cblxuICAgICAgLy8gV2UgYWxzbyBpbXBsZW1lbnQgYSB3b3JrYXJvdW5kIGZvciBub24tdmlzaWJsZSB0YWdzIGRpc2FwcGVhcmluZyBpbnRvXG4gICAgICAvLyB0aGluIGFpciBvbiBJRTgsIHRoaXMgb25seSBoYXBwZW5zIGlmIHRoZXJlIGlzIG5vIHZpc2libGUgdGV4dFxuICAgICAgLy8gaW4tZnJvbnQgb2YgdGhlIG5vbi12aXNpYmxlIHRhZ3MuIFBpZ2d5YmFjayBvbiB0aGUgd2hpdGVzcGFjZSBmaXhcbiAgICAgIC8vIGFuZCBzaW1wbHkgY2hlY2sgaWYgYW55IG5vbi12aXNpYmxlIHRhZ3MgYXBwZWFyIGluIHRoZSBzb3VyY2UuXG4gICAgICBpZiAoV0hJVEVTUEFDRV9URVNULnRlc3QoaHRtbCkgfHwgaHRtbFswXSA9PT0gJzwnICYmIE5PTlZJU0lCTEVfVEVTVC50ZXN0KGh0bWwpKSB7XG4gICAgICAgIC8vIFJlY292ZXIgbGVhZGluZyB3aGl0ZXNwYWNlIGJ5IHRlbXBvcmFyaWx5IHByZXBlbmRpbmcgYW55IGNoYXJhY3Rlci5cbiAgICAgICAgLy8gXFx1RkVGRiBoYXMgdGhlIHBvdGVudGlhbCBhZHZhbnRhZ2Ugb2YgYmVpbmcgemVyby13aWR0aC9pbnZpc2libGUuXG4gICAgICAgIC8vIFVnbGlmeUpTIGRyb3BzIFUrRkVGRiBjaGFycyB3aGVuIHBhcnNpbmcsIHNvIHVzZSBTdHJpbmcuZnJvbUNoYXJDb2RlXG4gICAgICAgIC8vIGluIGhvcGVzIHRoYXQgdGhpcyBpcyBwcmVzZXJ2ZWQgZXZlbiBpZiBcIlxcdUZFRkZcIiBpcyB0cmFuc2Zvcm1lZCB0b1xuICAgICAgICAvLyB0aGUgYWN0dWFsIFVuaWNvZGUgY2hhcmFjdGVyIChieSBCYWJlbCwgZm9yIGV4YW1wbGUpLlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWlzaG9vL1VnbGlmeUpTMi9ibG9iL3YyLjQuMjAvbGliL3BhcnNlLmpzI0wyMTZcbiAgICAgICAgbm9kZS5pbm5lckhUTUwgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkVGRikgKyBodG1sO1xuXG4gICAgICAgIC8vIGRlbGV0ZURhdGEgbGVhdmVzIGFuIGVtcHR5IGBUZXh0Tm9kZWAgd2hpY2ggb2Zmc2V0cyB0aGUgaW5kZXggb2YgYWxsXG4gICAgICAgIC8vIGNoaWxkcmVuLiBEZWZpbml0ZWx5IHdhbnQgdG8gYXZvaWQgdGhpcy5cbiAgICAgICAgdmFyIHRleHROb2RlID0gbm9kZS5maXJzdENoaWxkO1xuICAgICAgICBpZiAodGV4dE5vZGUuZGF0YS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBub2RlLnJlbW92ZUNoaWxkKHRleHROb2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXh0Tm9kZS5kZWxldGVEYXRhKDAsIDEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldElubmVySFRNTDsiXX0=