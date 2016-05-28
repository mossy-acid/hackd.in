/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Danger
 * @typechecks static-only
 */

'use strict';

var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

var createNodesFromMarkup = require('fbjs/lib/createNodesFromMarkup');
var emptyFunction = require('fbjs/lib/emptyFunction');
var getMarkupWrap = require('fbjs/lib/getMarkupWrap');
var invariant = require('fbjs/lib/invariant');

var OPEN_TAG_NAME_EXP = /^(<[^ \/>]+)/;
var RESULT_INDEX_ATTR = 'data-danger-index';

/**
 * Extracts the `nodeName` from a string of markup.
 *
 * NOTE: Extracting the `nodeName` does not require a regular expression match
 * because we make assumptions about React-generated markup (i.e. there are no
 * spaces surrounding the opening tag and there is at least one attribute).
 *
 * @param {string} markup String of markup.
 * @return {string} Node name of the supplied markup.
 * @see http://jsperf.com/extract-nodename
 */
function getNodeName(markup) {
  return markup.substring(1, markup.indexOf(' '));
}

var Danger = {

  /**
   * Renders markup into an array of nodes. The markup is expected to render
   * into a list of root nodes. Also, the length of `resultList` and
   * `markupList` should be the same.
   *
   * @param {array<string>} markupList List of markup strings to render.
   * @return {array<DOMElement>} List of rendered nodes.
   * @internal
   */
  dangerouslyRenderMarkup: function dangerouslyRenderMarkup(markupList) {
    !ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? invariant(false, 'dangerouslyRenderMarkup(...): Cannot render markup in a worker ' + 'thread. Make sure `window` and `document` are available globally ' + 'before requiring React when unit testing or use ' + 'ReactDOMServer.renderToString for server rendering.') : invariant(false) : undefined;
    var nodeName;
    var markupByNodeName = {};
    // Group markup by `nodeName` if a wrap is necessary, else by '*'.
    for (var i = 0; i < markupList.length; i++) {
      !markupList[i] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'dangerouslyRenderMarkup(...): Missing markup.') : invariant(false) : undefined;
      nodeName = getNodeName(markupList[i]);
      nodeName = getMarkupWrap(nodeName) ? nodeName : '*';
      markupByNodeName[nodeName] = markupByNodeName[nodeName] || [];
      markupByNodeName[nodeName][i] = markupList[i];
    }
    var resultList = [];
    var resultListAssignmentCount = 0;
    for (nodeName in markupByNodeName) {
      if (!markupByNodeName.hasOwnProperty(nodeName)) {
        continue;
      }
      var markupListByNodeName = markupByNodeName[nodeName];

      // This for-in loop skips the holes of the sparse array. The order of
      // iteration should follow the order of assignment, which happens to match
      // numerical index order, but we don't rely on that.
      var resultIndex;
      for (resultIndex in markupListByNodeName) {
        if (markupListByNodeName.hasOwnProperty(resultIndex)) {
          var markup = markupListByNodeName[resultIndex];

          // Push the requested markup with an additional RESULT_INDEX_ATTR
          // attribute.  If the markup does not start with a < character, it
          // will be discarded below (with an appropriate console.error).
          markupListByNodeName[resultIndex] = markup.replace(OPEN_TAG_NAME_EXP,
          // This index will be parsed back out below.
          '$1 ' + RESULT_INDEX_ATTR + '="' + resultIndex + '" ');
        }
      }

      // Render each group of markup with similar wrapping `nodeName`.
      var renderNodes = createNodesFromMarkup(markupListByNodeName.join(''), emptyFunction // Do nothing special with <script> tags.
      );

      for (var j = 0; j < renderNodes.length; ++j) {
        var renderNode = renderNodes[j];
        if (renderNode.hasAttribute && renderNode.hasAttribute(RESULT_INDEX_ATTR)) {

          resultIndex = +renderNode.getAttribute(RESULT_INDEX_ATTR);
          renderNode.removeAttribute(RESULT_INDEX_ATTR);

          !!resultList.hasOwnProperty(resultIndex) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Danger: Assigning to an already-occupied result index.') : invariant(false) : undefined;

          resultList[resultIndex] = renderNode;

          // This should match resultList.length and markupList.length when
          // we're done.
          resultListAssignmentCount += 1;
        } else if (process.env.NODE_ENV !== 'production') {
          console.error('Danger: Discarding unexpected node:', renderNode);
        }
      }
    }

    // Although resultList was populated out of order, it should now be a dense
    // array.
    !(resultListAssignmentCount === resultList.length) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Danger: Did not assign to every index of resultList.') : invariant(false) : undefined;

    !(resultList.length === markupList.length) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Danger: Expected markup to render %s nodes, but rendered %s.', markupList.length, resultList.length) : invariant(false) : undefined;

    return resultList;
  },

  /**
   * Replaces a node with a string of markup at its current position within its
   * parent. The markup must render into a single root node.
   *
   * @param {DOMElement} oldChild Child node to replace.
   * @param {string} markup Markup to render in place of the child node.
   * @internal
   */
  dangerouslyReplaceNodeWithMarkup: function dangerouslyReplaceNodeWithMarkup(oldChild, markup) {
    !ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? invariant(false, 'dangerouslyReplaceNodeWithMarkup(...): Cannot render markup in a ' + 'worker thread. Make sure `window` and `document` are available ' + 'globally before requiring React when unit testing or use ' + 'ReactDOMServer.renderToString() for server rendering.') : invariant(false) : undefined;
    !markup ? process.env.NODE_ENV !== 'production' ? invariant(false, 'dangerouslyReplaceNodeWithMarkup(...): Missing markup.') : invariant(false) : undefined;
    !(oldChild.tagName.toLowerCase() !== 'html') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'dangerouslyReplaceNodeWithMarkup(...): Cannot replace markup of the ' + '<html> node. This is because browser quirks make this unreliable ' + 'and/or slow. If you want to render to the root you must use ' + 'server rendering. See ReactDOMServer.renderToString().') : invariant(false) : undefined;

    var newChild;
    if (typeof markup === 'string') {
      newChild = createNodesFromMarkup(markup, emptyFunction)[0];
    } else {
      newChild = markup;
    }
    oldChild.parentNode.replaceChild(newChild, oldChild);
  }

};

module.exports = Danger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL0Rhbmdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLHVCQUF1QixRQUFRLCtCQUFSLENBQXZCOztBQUVKLElBQUksd0JBQXdCLFFBQVEsZ0NBQVIsQ0FBeEI7QUFDSixJQUFJLGdCQUFnQixRQUFRLHdCQUFSLENBQWhCO0FBQ0osSUFBSSxnQkFBZ0IsUUFBUSx3QkFBUixDQUFoQjtBQUNKLElBQUksWUFBWSxRQUFRLG9CQUFSLENBQVo7O0FBRUosSUFBSSxvQkFBb0IsY0FBcEI7QUFDSixJQUFJLG9CQUFvQixtQkFBcEI7Ozs7Ozs7Ozs7Ozs7QUFhSixTQUFTLFdBQVQsQ0FBcUIsTUFBckIsRUFBNkI7QUFDM0IsU0FBTyxPQUFPLFNBQVAsQ0FBaUIsQ0FBakIsRUFBb0IsT0FBTyxPQUFQLENBQWUsR0FBZixDQUFwQixDQUFQLENBRDJCO0NBQTdCOztBQUlBLElBQUksU0FBUzs7Ozs7Ozs7Ozs7QUFXWCwyQkFBeUIsaUNBQVUsVUFBVixFQUFzQjtBQUM3QyxLQUFDLHFCQUFxQixTQUFyQixHQUFpQyxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLFVBQVUsS0FBVixFQUFpQixvRUFBb0UsbUVBQXBFLEdBQTBJLGtEQUExSSxHQUErTCxxREFBL0wsQ0FBekQsR0FBaVQsVUFBVSxLQUFWLENBQWpULEdBQW9VLFNBQXRXLENBRDZDO0FBRTdDLFFBQUksUUFBSixDQUY2QztBQUc3QyxRQUFJLG1CQUFtQixFQUFuQjs7QUFIeUMsU0FLeEMsSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLFdBQVcsTUFBWCxFQUFtQixHQUF2QyxFQUE0QztBQUMxQyxPQUFDLFdBQVcsQ0FBWCxDQUFELEdBQWlCLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLCtDQUFqQixDQUF4QyxHQUE0RyxVQUFV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QUFWLEVBQW9CLE1BQXBCLEVBQTRCO0FBQzVELEtBQUMscUJBQXFCLFNBQXJCLEdBQWlDLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLHNFQUFzRSxpRUFBdEUsR0FBMEksMkRBQTFJLEdBQXdNLHVEQUF4TSxDQUF6RCxHQUE0VCxVQUFVLEtBQVYsQ0FBNVQsR0FBK1UsU0FBalgsQ0FENEQ7QUFFNUQsS0FBQyxNQUFELEdBQVUsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxVQUFVLEtBQVYsRUFBaUIsd0RBQWpCLENBQXhDLEdBQXFILFVBQVUsS0FBVixDQUFySCxHQUF3SSxTQUFsSixDQUY0RDtBQUc1RCxNQUFFLFNBQVMsT0FBVCxDQUFpQixXQUFqQixPQUFtQyxNQUFuQyxDQUFGLEdBQStDLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsVUFBVSxLQUFWLEVBQWlCLHlFQUF5RSxtRUFBekUsR0FBK0ksOERBQS9JLEdBQWdOLHdEQUFoTixDQUF6RCxHQUFxVSxVQUFVLEtBQVYsQ0FBclUsR0FBd1YsU0FBdlksQ0FINEQ7O0FBSzVELFFBQUksUUFBSixDQUw0RDtBQU01RCxRQUFJLE9BQU8sTUFBUCxLQUFrQixRQUFsQixFQUE0QjtBQUM5QixpQkFBVyxzQkFBc0IsTUFBdEIsRUFBOEIsYUFBOUIsRUFBNkMsQ0FBN0MsQ0FBWCxDQUQ4QjtLQUFoQyxNQUVPO0FBQ0wsaUJBQVcsTUFBWCxDQURLO0tBRlA7QUFLQSxhQUFTLFVBQVQsQ0FBb0IsWUFBcEIsQ0FBaUMsUUFBakMsRUFBMkMsUUFBM0MsRUFYNEQ7R0FBNUI7O0NBekZoQzs7QUF5R0osT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6IkRhbmdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBEYW5nZXJcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRXhlY3V0aW9uRW52aXJvbm1lbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9FeGVjdXRpb25FbnZpcm9ubWVudCcpO1xuXG52YXIgY3JlYXRlTm9kZXNGcm9tTWFya3VwID0gcmVxdWlyZSgnZmJqcy9saWIvY3JlYXRlTm9kZXNGcm9tTWFya3VwJyk7XG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJ2ZianMvbGliL2VtcHR5RnVuY3Rpb24nKTtcbnZhciBnZXRNYXJrdXBXcmFwID0gcmVxdWlyZSgnZmJqcy9saWIvZ2V0TWFya3VwV3JhcCcpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuXG52YXIgT1BFTl9UQUdfTkFNRV9FWFAgPSAvXig8W14gXFwvPl0rKS87XG52YXIgUkVTVUxUX0lOREVYX0FUVFIgPSAnZGF0YS1kYW5nZXItaW5kZXgnO1xuXG4vKipcbiAqIEV4dHJhY3RzIHRoZSBgbm9kZU5hbWVgIGZyb20gYSBzdHJpbmcgb2YgbWFya3VwLlxuICpcbiAqIE5PVEU6IEV4dHJhY3RpbmcgdGhlIGBub2RlTmFtZWAgZG9lcyBub3QgcmVxdWlyZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBtYXRjaFxuICogYmVjYXVzZSB3ZSBtYWtlIGFzc3VtcHRpb25zIGFib3V0IFJlYWN0LWdlbmVyYXRlZCBtYXJrdXAgKGkuZS4gdGhlcmUgYXJlIG5vXG4gKiBzcGFjZXMgc3Vycm91bmRpbmcgdGhlIG9wZW5pbmcgdGFnIGFuZCB0aGVyZSBpcyBhdCBsZWFzdCBvbmUgYXR0cmlidXRlKS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWFya3VwIFN0cmluZyBvZiBtYXJrdXAuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IE5vZGUgbmFtZSBvZiB0aGUgc3VwcGxpZWQgbWFya3VwLlxuICogQHNlZSBodHRwOi8vanNwZXJmLmNvbS9leHRyYWN0LW5vZGVuYW1lXG4gKi9cbmZ1bmN0aW9uIGdldE5vZGVOYW1lKG1hcmt1cCkge1xuICByZXR1cm4gbWFya3VwLnN1YnN0cmluZygxLCBtYXJrdXAuaW5kZXhPZignICcpKTtcbn1cblxudmFyIERhbmdlciA9IHtcblxuICAvKipcbiAgICogUmVuZGVycyBtYXJrdXAgaW50byBhbiBhcnJheSBvZiBub2Rlcy4gVGhlIG1hcmt1cCBpcyBleHBlY3RlZCB0byByZW5kZXJcbiAgICogaW50byBhIGxpc3Qgb2Ygcm9vdCBub2Rlcy4gQWxzbywgdGhlIGxlbmd0aCBvZiBgcmVzdWx0TGlzdGAgYW5kXG4gICAqIGBtYXJrdXBMaXN0YCBzaG91bGQgYmUgdGhlIHNhbWUuXG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXk8c3RyaW5nPn0gbWFya3VwTGlzdCBMaXN0IG9mIG1hcmt1cCBzdHJpbmdzIHRvIHJlbmRlci5cbiAgICogQHJldHVybiB7YXJyYXk8RE9NRWxlbWVudD59IExpc3Qgb2YgcmVuZGVyZWQgbm9kZXMuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZGFuZ2Vyb3VzbHlSZW5kZXJNYXJrdXA6IGZ1bmN0aW9uIChtYXJrdXBMaXN0KSB7XG4gICAgIUV4ZWN1dGlvbkVudmlyb25tZW50LmNhblVzZURPTSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdkYW5nZXJvdXNseVJlbmRlck1hcmt1cCguLi4pOiBDYW5ub3QgcmVuZGVyIG1hcmt1cCBpbiBhIHdvcmtlciAnICsgJ3RocmVhZC4gTWFrZSBzdXJlIGB3aW5kb3dgIGFuZCBgZG9jdW1lbnRgIGFyZSBhdmFpbGFibGUgZ2xvYmFsbHkgJyArICdiZWZvcmUgcmVxdWlyaW5nIFJlYWN0IHdoZW4gdW5pdCB0ZXN0aW5nIG9yIHVzZSAnICsgJ1JlYWN0RE9NU2VydmVyLnJlbmRlclRvU3RyaW5nIGZvciBzZXJ2ZXIgcmVuZGVyaW5nLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbm9kZU5hbWU7XG4gICAgdmFyIG1hcmt1cEJ5Tm9kZU5hbWUgPSB7fTtcbiAgICAvLyBHcm91cCBtYXJrdXAgYnkgYG5vZGVOYW1lYCBpZiBhIHdyYXAgaXMgbmVjZXNzYXJ5LCBlbHNlIGJ5ICcqJy5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hcmt1cExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICFtYXJrdXBMaXN0W2ldID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ2Rhbmdlcm91c2x5UmVuZGVyTWFya3VwKC4uLik6IE1pc3NpbmcgbWFya3VwLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICAgIG5vZGVOYW1lID0gZ2V0Tm9kZU5hbWUobWFya3VwTGlzdFtpXSk7XG4gICAgICBub2RlTmFtZSA9IGdldE1hcmt1cFdyYXAobm9kZU5hbWUpID8gbm9kZU5hbWUgOiAnKic7XG4gICAgICBtYXJrdXBCeU5vZGVOYW1lW25vZGVOYW1lXSA9IG1hcmt1cEJ5Tm9kZU5hbWVbbm9kZU5hbWVdIHx8IFtdO1xuICAgICAgbWFya3VwQnlOb2RlTmFtZVtub2RlTmFtZV1baV0gPSBtYXJrdXBMaXN0W2ldO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0TGlzdCA9IFtdO1xuICAgIHZhciByZXN1bHRMaXN0QXNzaWdubWVudENvdW50ID0gMDtcbiAgICBmb3IgKG5vZGVOYW1lIGluIG1hcmt1cEJ5Tm9kZU5hbWUpIHtcbiAgICAgIGlmICghbWFya3VwQnlOb2RlTmFtZS5oYXNPd25Qcm9wZXJ0eShub2RlTmFtZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2YXIgbWFya3VwTGlzdEJ5Tm9kZU5hbWUgPSBtYXJrdXBCeU5vZGVOYW1lW25vZGVOYW1lXTtcblxuICAgICAgLy8gVGhpcyBmb3ItaW4gbG9vcCBza2lwcyB0aGUgaG9sZXMgb2YgdGhlIHNwYXJzZSBhcnJheS4gVGhlIG9yZGVyIG9mXG4gICAgICAvLyBpdGVyYXRpb24gc2hvdWxkIGZvbGxvdyB0aGUgb3JkZXIgb2YgYXNzaWdubWVudCwgd2hpY2ggaGFwcGVucyB0byBtYXRjaFxuICAgICAgLy8gbnVtZXJpY2FsIGluZGV4IG9yZGVyLCBidXQgd2UgZG9uJ3QgcmVseSBvbiB0aGF0LlxuICAgICAgdmFyIHJlc3VsdEluZGV4O1xuICAgICAgZm9yIChyZXN1bHRJbmRleCBpbiBtYXJrdXBMaXN0QnlOb2RlTmFtZSkge1xuICAgICAgICBpZiAobWFya3VwTGlzdEJ5Tm9kZU5hbWUuaGFzT3duUHJvcGVydHkocmVzdWx0SW5kZXgpKSB7XG4gICAgICAgICAgdmFyIG1hcmt1cCA9IG1hcmt1cExpc3RCeU5vZGVOYW1lW3Jlc3VsdEluZGV4XTtcblxuICAgICAgICAgIC8vIFB1c2ggdGhlIHJlcXVlc3RlZCBtYXJrdXAgd2l0aCBhbiBhZGRpdGlvbmFsIFJFU1VMVF9JTkRFWF9BVFRSXG4gICAgICAgICAgLy8gYXR0cmlidXRlLiAgSWYgdGhlIG1hcmt1cCBkb2VzIG5vdCBzdGFydCB3aXRoIGEgPCBjaGFyYWN0ZXIsIGl0XG4gICAgICAgICAgLy8gd2lsbCBiZSBkaXNjYXJkZWQgYmVsb3cgKHdpdGggYW4gYXBwcm9wcmlhdGUgY29uc29sZS5lcnJvcikuXG4gICAgICAgICAgbWFya3VwTGlzdEJ5Tm9kZU5hbWVbcmVzdWx0SW5kZXhdID0gbWFya3VwLnJlcGxhY2UoT1BFTl9UQUdfTkFNRV9FWFAsXG4gICAgICAgICAgLy8gVGhpcyBpbmRleCB3aWxsIGJlIHBhcnNlZCBiYWNrIG91dCBiZWxvdy5cbiAgICAgICAgICAnJDEgJyArIFJFU1VMVF9JTkRFWF9BVFRSICsgJz1cIicgKyByZXN1bHRJbmRleCArICdcIiAnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBSZW5kZXIgZWFjaCBncm91cCBvZiBtYXJrdXAgd2l0aCBzaW1pbGFyIHdyYXBwaW5nIGBub2RlTmFtZWAuXG4gICAgICB2YXIgcmVuZGVyTm9kZXMgPSBjcmVhdGVOb2Rlc0Zyb21NYXJrdXAobWFya3VwTGlzdEJ5Tm9kZU5hbWUuam9pbignJyksIGVtcHR5RnVuY3Rpb24gLy8gRG8gbm90aGluZyBzcGVjaWFsIHdpdGggPHNjcmlwdD4gdGFncy5cbiAgICAgICk7XG5cbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcmVuZGVyTm9kZXMubGVuZ3RoOyArK2opIHtcbiAgICAgICAgdmFyIHJlbmRlck5vZGUgPSByZW5kZXJOb2Rlc1tqXTtcbiAgICAgICAgaWYgKHJlbmRlck5vZGUuaGFzQXR0cmlidXRlICYmIHJlbmRlck5vZGUuaGFzQXR0cmlidXRlKFJFU1VMVF9JTkRFWF9BVFRSKSkge1xuXG4gICAgICAgICAgcmVzdWx0SW5kZXggPSArcmVuZGVyTm9kZS5nZXRBdHRyaWJ1dGUoUkVTVUxUX0lOREVYX0FUVFIpO1xuICAgICAgICAgIHJlbmRlck5vZGUucmVtb3ZlQXR0cmlidXRlKFJFU1VMVF9JTkRFWF9BVFRSKTtcblxuICAgICAgICAgICEhcmVzdWx0TGlzdC5oYXNPd25Qcm9wZXJ0eShyZXN1bHRJbmRleCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnRGFuZ2VyOiBBc3NpZ25pbmcgdG8gYW4gYWxyZWFkeS1vY2N1cGllZCByZXN1bHQgaW5kZXguJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgcmVzdWx0TGlzdFtyZXN1bHRJbmRleF0gPSByZW5kZXJOb2RlO1xuXG4gICAgICAgICAgLy8gVGhpcyBzaG91bGQgbWF0Y2ggcmVzdWx0TGlzdC5sZW5ndGggYW5kIG1hcmt1cExpc3QubGVuZ3RoIHdoZW5cbiAgICAgICAgICAvLyB3ZSdyZSBkb25lLlxuICAgICAgICAgIHJlc3VsdExpc3RBc3NpZ25tZW50Q291bnQgKz0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRGFuZ2VyOiBEaXNjYXJkaW5nIHVuZXhwZWN0ZWQgbm9kZTonLCByZW5kZXJOb2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFsdGhvdWdoIHJlc3VsdExpc3Qgd2FzIHBvcHVsYXRlZCBvdXQgb2Ygb3JkZXIsIGl0IHNob3VsZCBub3cgYmUgYSBkZW5zZVxuICAgIC8vIGFycmF5LlxuICAgICEocmVzdWx0TGlzdEFzc2lnbm1lbnRDb3VudCA9PT0gcmVzdWx0TGlzdC5sZW5ndGgpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ0RhbmdlcjogRGlkIG5vdCBhc3NpZ24gdG8gZXZlcnkgaW5kZXggb2YgcmVzdWx0TGlzdC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG5cbiAgICAhKHJlc3VsdExpc3QubGVuZ3RoID09PSBtYXJrdXBMaXN0Lmxlbmd0aCkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnRGFuZ2VyOiBFeHBlY3RlZCBtYXJrdXAgdG8gcmVuZGVyICVzIG5vZGVzLCBidXQgcmVuZGVyZWQgJXMuJywgbWFya3VwTGlzdC5sZW5ndGgsIHJlc3VsdExpc3QubGVuZ3RoKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gcmVzdWx0TGlzdDtcbiAgfSxcblxuICAvKipcbiAgICogUmVwbGFjZXMgYSBub2RlIHdpdGggYSBzdHJpbmcgb2YgbWFya3VwIGF0IGl0cyBjdXJyZW50IHBvc2l0aW9uIHdpdGhpbiBpdHNcbiAgICogcGFyZW50LiBUaGUgbWFya3VwIG11c3QgcmVuZGVyIGludG8gYSBzaW5nbGUgcm9vdCBub2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IG9sZENoaWxkIENoaWxkIG5vZGUgdG8gcmVwbGFjZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1hcmt1cCBNYXJrdXAgdG8gcmVuZGVyIGluIHBsYWNlIG9mIHRoZSBjaGlsZCBub2RlLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGRhbmdlcm91c2x5UmVwbGFjZU5vZGVXaXRoTWFya3VwOiBmdW5jdGlvbiAob2xkQ2hpbGQsIG1hcmt1cCkge1xuICAgICFFeGVjdXRpb25FbnZpcm9ubWVudC5jYW5Vc2VET00gPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnZGFuZ2Vyb3VzbHlSZXBsYWNlTm9kZVdpdGhNYXJrdXAoLi4uKTogQ2Fubm90IHJlbmRlciBtYXJrdXAgaW4gYSAnICsgJ3dvcmtlciB0aHJlYWQuIE1ha2Ugc3VyZSBgd2luZG93YCBhbmQgYGRvY3VtZW50YCBhcmUgYXZhaWxhYmxlICcgKyAnZ2xvYmFsbHkgYmVmb3JlIHJlcXVpcmluZyBSZWFjdCB3aGVuIHVuaXQgdGVzdGluZyBvciB1c2UgJyArICdSZWFjdERPTVNlcnZlci5yZW5kZXJUb1N0cmluZygpIGZvciBzZXJ2ZXIgcmVuZGVyaW5nLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICAhbWFya3VwID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ2Rhbmdlcm91c2x5UmVwbGFjZU5vZGVXaXRoTWFya3VwKC4uLik6IE1pc3NpbmcgbWFya3VwLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICAhKG9sZENoaWxkLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ2h0bWwnKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdkYW5nZXJvdXNseVJlcGxhY2VOb2RlV2l0aE1hcmt1cCguLi4pOiBDYW5ub3QgcmVwbGFjZSBtYXJrdXAgb2YgdGhlICcgKyAnPGh0bWw+IG5vZGUuIFRoaXMgaXMgYmVjYXVzZSBicm93c2VyIHF1aXJrcyBtYWtlIHRoaXMgdW5yZWxpYWJsZSAnICsgJ2FuZC9vciBzbG93LiBJZiB5b3Ugd2FudCB0byByZW5kZXIgdG8gdGhlIHJvb3QgeW91IG11c3QgdXNlICcgKyAnc2VydmVyIHJlbmRlcmluZy4gU2VlIFJlYWN0RE9NU2VydmVyLnJlbmRlclRvU3RyaW5nKCkuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuXG4gICAgdmFyIG5ld0NoaWxkO1xuICAgIGlmICh0eXBlb2YgbWFya3VwID09PSAnc3RyaW5nJykge1xuICAgICAgbmV3Q2hpbGQgPSBjcmVhdGVOb2Rlc0Zyb21NYXJrdXAobWFya3VwLCBlbXB0eUZ1bmN0aW9uKVswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3Q2hpbGQgPSBtYXJrdXA7XG4gICAgfVxuICAgIG9sZENoaWxkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NoaWxkLCBvbGRDaGlsZCk7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYW5nZXI7Il19