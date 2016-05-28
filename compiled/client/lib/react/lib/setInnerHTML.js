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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL3NldElubmVySFRNTC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBYUE7O0FBRUEsSUFBSSx1QkFBdUIsUUFBUSwrQkFBUixDQUF2Qjs7QUFFSixJQUFJLGtCQUFrQixjQUFsQjtBQUNKLElBQUksa0JBQWtCLHNEQUFsQjs7Ozs7Ozs7OztBQVVKLElBQUksZUFBZSxzQkFBVSxJQUFWLEVBQWdCLElBQWhCLEVBQXNCO0FBQ3ZDLE9BQUssU0FBTCxHQUFpQixJQUFqQixDQUR1QztDQUF0Qjs7O0FBS25CLElBQUksT0FBTyxLQUFQLEtBQWlCLFdBQWpCLElBQWdDLE1BQU0sdUJBQU4sRUFBK0I7QUFDakUsaUJBQWUsc0JBQVUsSUFBVixFQUFnQixJQUFoQixFQUFzQjtBQUNuQyxVQUFNLHVCQUFOLENBQThCLFlBQVk7QUFDeEMsV0FBSyxTQUFMLEdBQWlCLElBQWpCLENBRHdDO0tBQVosQ0FBOUIsQ0FEbUM7R0FBdEIsQ0FEa0Q7Q0FBbkU7O0FBUUEsSUFBSSxxQkFBcUIsU0FBckIsRUFBZ0M7Ozs7Ozs7QUFPbEMsTUFBSSxjQUFjLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFkLENBUDhCO0FBUWxDLGNBQVksU0FBWixHQUF3QixHQUF4QixDQVJrQztBQVNsQyxNQUFJLFlBQVksU0FBWixLQUEwQixFQUExQixFQUE4QjtBQUNoQyxtQkFBZSxzQkFBVSxJQUFWLEVBQWdCLElBQWhCLEVBQXNCOzs7Ozs7QUFNbkMsVUFBSSxLQUFLLFVBQUwsRUFBaUI7QUFDbkIsYUFBSyxVQUFMLENBQWdCLFlBQWhCLENBQTZCLElBQTdCLEVBQW1DLElBQW5DLEVBRG1CO09BQXJCOzs7Ozs7QUFObUMsVUFjL0IsZ0JBQWdCLElBQWhCLENBQXFCLElBQXJCLEtBQThCLEtBQUssQ0FBTCxNQUFZLEdBQVosSUFBbUIsZ0JBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQW5CLEVBQStDOzs7Ozs7O0FBTy9FLGFBQUssU0FBTCxHQUFpQixPQUFPLFlBQVAsQ0FBb0IsTUFBcEIsSUFBOEIsSUFBOUI7Ozs7QUFQOEQsWUFXM0UsV0FBVyxLQUFLLFVBQUwsQ0FYZ0U7QUFZL0UsWUFBSSxTQUFTLElBQVQsQ0FBYyxNQUFkLEtBQXlCLENBQXpCLEVBQTRCO0FBQzlCLGVBQUssV0FBTCxDQUFpQixRQUFqQixFQUQ4QjtTQUFoQyxNQUVPO0FBQ0wsbUJBQVMsVUFBVCxDQUFvQixDQUFwQixFQUF1QixDQUF2QixFQURLO1NBRlA7T0FaRixNQWlCTztBQUNMLGFBQUssU0FBTCxHQUFpQixJQUFqQixDQURLO09BakJQO0tBZGEsQ0FEaUI7R0FBbEM7Q0FURjs7QUFnREEsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6InNldElubmVySFRNTC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBzZXRJbm5lckhUTUxcbiAqL1xuXG4vKiBnbG9iYWxzIE1TQXBwICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEV4ZWN1dGlvbkVudmlyb25tZW50ID0gcmVxdWlyZSgnZmJqcy9saWIvRXhlY3V0aW9uRW52aXJvbm1lbnQnKTtcblxudmFyIFdISVRFU1BBQ0VfVEVTVCA9IC9eWyBcXHJcXG5cXHRcXGZdLztcbnZhciBOT05WSVNJQkxFX1RFU1QgPSAvPCghLS18bGlua3xub3NjcmlwdHxtZXRhfHNjcmlwdHxzdHlsZSlbIFxcclxcblxcdFxcZlxcLz5dLztcblxuLyoqXG4gKiBTZXQgdGhlIGlubmVySFRNTCBwcm9wZXJ0eSBvZiBhIG5vZGUsIGVuc3VyaW5nIHRoYXQgd2hpdGVzcGFjZSBpcyBwcmVzZXJ2ZWRcbiAqIGV2ZW4gaW4gSUU4LlxuICpcbiAqIEBwYXJhbSB7RE9NRWxlbWVudH0gbm9kZVxuICogQHBhcmFtIHtzdHJpbmd9IGh0bWxcbiAqIEBpbnRlcm5hbFxuICovXG52YXIgc2V0SW5uZXJIVE1MID0gZnVuY3Rpb24gKG5vZGUsIGh0bWwpIHtcbiAgbm9kZS5pbm5lckhUTUwgPSBodG1sO1xufTtcblxuLy8gV2luOCBhcHBzOiBBbGxvdyBhbGwgaHRtbCB0byBiZSBpbnNlcnRlZFxuaWYgKHR5cGVvZiBNU0FwcCAhPT0gJ3VuZGVmaW5lZCcgJiYgTVNBcHAuZXhlY1Vuc2FmZUxvY2FsRnVuY3Rpb24pIHtcbiAgc2V0SW5uZXJIVE1MID0gZnVuY3Rpb24gKG5vZGUsIGh0bWwpIHtcbiAgICBNU0FwcC5leGVjVW5zYWZlTG9jYWxGdW5jdGlvbihmdW5jdGlvbiAoKSB7XG4gICAgICBub2RlLmlubmVySFRNTCA9IGh0bWw7XG4gICAgfSk7XG4gIH07XG59XG5cbmlmIChFeGVjdXRpb25FbnZpcm9ubWVudC5jYW5Vc2VET00pIHtcbiAgLy8gSUU4OiBXaGVuIHVwZGF0aW5nIGEganVzdCBjcmVhdGVkIG5vZGUgd2l0aCBpbm5lckhUTUwgb25seSBsZWFkaW5nXG4gIC8vIHdoaXRlc3BhY2UgaXMgcmVtb3ZlZC4gV2hlbiB1cGRhdGluZyBhbiBleGlzdGluZyBub2RlIHdpdGggaW5uZXJIVE1MXG4gIC8vIHdoaXRlc3BhY2UgaW4gcm9vdCBUZXh0Tm9kZXMgaXMgYWxzbyBjb2xsYXBzZWQuXG4gIC8vIEBzZWUgcXVpcmtzbW9kZS5vcmcvYnVncmVwb3J0cy9hcmNoaXZlcy8yMDA0LzExL2lubmVyaHRtbF9hbmRfdC5odG1sXG5cbiAgLy8gRmVhdHVyZSBkZXRlY3Rpb247IG9ubHkgSUU4IGlzIGtub3duIHRvIGJlaGF2ZSBpbXByb3Blcmx5IGxpa2UgdGhpcy5cbiAgdmFyIHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRlc3RFbGVtZW50LmlubmVySFRNTCA9ICcgJztcbiAgaWYgKHRlc3RFbGVtZW50LmlubmVySFRNTCA9PT0gJycpIHtcbiAgICBzZXRJbm5lckhUTUwgPSBmdW5jdGlvbiAobm9kZSwgaHRtbCkge1xuICAgICAgLy8gTWFnaWMgdGhlb3J5OiBJRTggc3VwcG9zZWRseSBkaWZmZXJlbnRpYXRlcyBiZXR3ZWVuIGFkZGVkIGFuZCB1cGRhdGVkXG4gICAgICAvLyBub2RlcyB3aGVuIHByb2Nlc3NpbmcgaW5uZXJIVE1MLCBpbm5lckhUTUwgb24gdXBkYXRlZCBub2RlcyBzdWZmZXJzXG4gICAgICAvLyBmcm9tIHdvcnNlIHdoaXRlc3BhY2UgYmVoYXZpb3IuIFJlLWFkZGluZyBhIG5vZGUgbGlrZSB0aGlzIHRyaWdnZXJzXG4gICAgICAvLyB0aGUgaW5pdGlhbCBhbmQgbW9yZSBmYXZvcmFibGUgd2hpdGVzcGFjZSBiZWhhdmlvci5cbiAgICAgIC8vIFRPRE86IFdoYXQgdG8gZG8gb24gYSBkZXRhY2hlZCBub2RlP1xuICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICBub2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5vZGUsIG5vZGUpO1xuICAgICAgfVxuXG4gICAgICAvLyBXZSBhbHNvIGltcGxlbWVudCBhIHdvcmthcm91bmQgZm9yIG5vbi12aXNpYmxlIHRhZ3MgZGlzYXBwZWFyaW5nIGludG9cbiAgICAgIC8vIHRoaW4gYWlyIG9uIElFOCwgdGhpcyBvbmx5IGhhcHBlbnMgaWYgdGhlcmUgaXMgbm8gdmlzaWJsZSB0ZXh0XG4gICAgICAvLyBpbi1mcm9udCBvZiB0aGUgbm9uLXZpc2libGUgdGFncy4gUGlnZ3liYWNrIG9uIHRoZSB3aGl0ZXNwYWNlIGZpeFxuICAgICAgLy8gYW5kIHNpbXBseSBjaGVjayBpZiBhbnkgbm9uLXZpc2libGUgdGFncyBhcHBlYXIgaW4gdGhlIHNvdXJjZS5cbiAgICAgIGlmIChXSElURVNQQUNFX1RFU1QudGVzdChodG1sKSB8fCBodG1sWzBdID09PSAnPCcgJiYgTk9OVklTSUJMRV9URVNULnRlc3QoaHRtbCkpIHtcbiAgICAgICAgLy8gUmVjb3ZlciBsZWFkaW5nIHdoaXRlc3BhY2UgYnkgdGVtcG9yYXJpbHkgcHJlcGVuZGluZyBhbnkgY2hhcmFjdGVyLlxuICAgICAgICAvLyBcXHVGRUZGIGhhcyB0aGUgcG90ZW50aWFsIGFkdmFudGFnZSBvZiBiZWluZyB6ZXJvLXdpZHRoL2ludmlzaWJsZS5cbiAgICAgICAgLy8gVWdsaWZ5SlMgZHJvcHMgVStGRUZGIGNoYXJzIHdoZW4gcGFyc2luZywgc28gdXNlIFN0cmluZy5mcm9tQ2hhckNvZGVcbiAgICAgICAgLy8gaW4gaG9wZXMgdGhhdCB0aGlzIGlzIHByZXNlcnZlZCBldmVuIGlmIFwiXFx1RkVGRlwiIGlzIHRyYW5zZm9ybWVkIHRvXG4gICAgICAgIC8vIHRoZSBhY3R1YWwgVW5pY29kZSBjaGFyYWN0ZXIgKGJ5IEJhYmVsLCBmb3IgZXhhbXBsZSkuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9taXNob28vVWdsaWZ5SlMyL2Jsb2IvdjIuNC4yMC9saWIvcGFyc2UuanMjTDIxNlxuICAgICAgICBub2RlLmlubmVySFRNTCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRUZGKSArIGh0bWw7XG5cbiAgICAgICAgLy8gZGVsZXRlRGF0YSBsZWF2ZXMgYW4gZW1wdHkgYFRleHROb2RlYCB3aGljaCBvZmZzZXRzIHRoZSBpbmRleCBvZiBhbGxcbiAgICAgICAgLy8gY2hpbGRyZW4uIERlZmluaXRlbHkgd2FudCB0byBhdm9pZCB0aGlzLlxuICAgICAgICB2YXIgdGV4dE5vZGUgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIGlmICh0ZXh0Tm9kZS5kYXRhLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQodGV4dE5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRleHROb2RlLmRlbGV0ZURhdGEoMCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0SW5uZXJIVE1MOyJdfQ==