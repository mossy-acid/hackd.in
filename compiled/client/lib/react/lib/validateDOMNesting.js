/**
 * Copyright 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule validateDOMNesting
 */

'use strict';

var assign = require('./Object.assign');
var emptyFunction = require('fbjs/lib/emptyFunction');
var warning = require('fbjs/lib/warning');

var validateDOMNesting = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  // This validation code was written based on the HTML5 parsing spec:
  // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-scope
  //
  // Note: this does not catch all invalid nesting, nor does it try to (as it's
  // not clear what practical benefit doing so provides); instead, we warn only
  // for cases where the parser will give a parse tree differing from what React
  // intended. For example, <b><div></div></b> is invalid but we don't warn
  // because it still parses correctly; we do warn for other cases like nested
  // <p> tags where the beginning of the second element implicitly closes the
  // first, causing a confusing mess.

  // https://html.spec.whatwg.org/multipage/syntax.html#special
  var specialTags = ['address', 'applet', 'area', 'article', 'aside', 'base', 'basefont', 'bgsound', 'blockquote', 'body', 'br', 'button', 'caption', 'center', 'col', 'colgroup', 'dd', 'details', 'dir', 'div', 'dl', 'dt', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'iframe', 'img', 'input', 'isindex', 'li', 'link', 'listing', 'main', 'marquee', 'menu', 'menuitem', 'meta', 'nav', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'p', 'param', 'plaintext', 'pre', 'script', 'section', 'select', 'source', 'style', 'summary', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'track', 'ul', 'wbr', 'xmp'];

  // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-scope
  var inScopeTags = ['applet', 'caption', 'html', 'table', 'td', 'th', 'marquee', 'object', 'template',

  // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
  // TODO: Distinguish by namespace here -- for <title>, including it here
  // errs on the side of fewer warnings
  'foreignObject', 'desc', 'title'];

  // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-button-scope
  var buttonScopeTags = inScopeTags.concat(['button']);

  // https://html.spec.whatwg.org/multipage/syntax.html#generate-implied-end-tags
  var impliedEndTags = ['dd', 'dt', 'li', 'option', 'optgroup', 'p', 'rp', 'rt'];

  var emptyAncestorInfo = {
    parentTag: null,

    formTag: null,
    aTagInScope: null,
    buttonTagInScope: null,
    nobrTagInScope: null,
    pTagInButtonScope: null,

    listItemTagAutoclosing: null,
    dlItemTagAutoclosing: null
  };

  var updatedAncestorInfo = function updatedAncestorInfo(oldInfo, tag, instance) {
    var ancestorInfo = assign({}, oldInfo || emptyAncestorInfo);
    var info = { tag: tag, instance: instance };

    if (inScopeTags.indexOf(tag) !== -1) {
      ancestorInfo.aTagInScope = null;
      ancestorInfo.buttonTagInScope = null;
      ancestorInfo.nobrTagInScope = null;
    }
    if (buttonScopeTags.indexOf(tag) !== -1) {
      ancestorInfo.pTagInButtonScope = null;
    }

    // See rules for 'li', 'dd', 'dt' start tags in
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
    if (specialTags.indexOf(tag) !== -1 && tag !== 'address' && tag !== 'div' && tag !== 'p') {
      ancestorInfo.listItemTagAutoclosing = null;
      ancestorInfo.dlItemTagAutoclosing = null;
    }

    ancestorInfo.parentTag = info;

    if (tag === 'form') {
      ancestorInfo.formTag = info;
    }
    if (tag === 'a') {
      ancestorInfo.aTagInScope = info;
    }
    if (tag === 'button') {
      ancestorInfo.buttonTagInScope = info;
    }
    if (tag === 'nobr') {
      ancestorInfo.nobrTagInScope = info;
    }
    if (tag === 'p') {
      ancestorInfo.pTagInButtonScope = info;
    }
    if (tag === 'li') {
      ancestorInfo.listItemTagAutoclosing = info;
    }
    if (tag === 'dd' || tag === 'dt') {
      ancestorInfo.dlItemTagAutoclosing = info;
    }

    return ancestorInfo;
  };

  /**
   * Returns whether
   */
  var isTagValidWithParent = function isTagValidWithParent(tag, parentTag) {
    // First, let's check if we're in an unusual parsing mode...
    switch (parentTag) {
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inselect
      case 'select':
        return tag === 'option' || tag === 'optgroup' || tag === '#text';
      case 'optgroup':
        return tag === 'option' || tag === '#text';
      // Strictly speaking, seeing an <option> doesn't mean we're in a <select>
      // but
      case 'option':
        return tag === '#text';

      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intd
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incaption
      // No special behavior since these rules fall back to "in body" mode for
      // all except special table nodes which cause bad parsing behavior anyway.

      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intr
      case 'tr':
        return tag === 'th' || tag === 'td' || tag === 'style' || tag === 'script' || tag === 'template';

      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intbody
      case 'tbody':
      case 'thead':
      case 'tfoot':
        return tag === 'tr' || tag === 'style' || tag === 'script' || tag === 'template';

      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incolgroup
      case 'colgroup':
        return tag === 'col' || tag === 'template';

      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intable
      case 'table':
        return tag === 'caption' || tag === 'colgroup' || tag === 'tbody' || tag === 'tfoot' || tag === 'thead' || tag === 'style' || tag === 'script' || tag === 'template';

      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inhead
      case 'head':
        return tag === 'base' || tag === 'basefont' || tag === 'bgsound' || tag === 'link' || tag === 'meta' || tag === 'title' || tag === 'noscript' || tag === 'noframes' || tag === 'style' || tag === 'script' || tag === 'template';

      // https://html.spec.whatwg.org/multipage/semantics.html#the-html-element
      case 'html':
        return tag === 'head' || tag === 'body';
    }

    // Probably in the "in body" parsing mode, so we outlaw only tag combos
    // where the parsing rules cause implicit opens or closes to be added.
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
    switch (tag) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return parentTag !== 'h1' && parentTag !== 'h2' && parentTag !== 'h3' && parentTag !== 'h4' && parentTag !== 'h5' && parentTag !== 'h6';

      case 'rp':
      case 'rt':
        return impliedEndTags.indexOf(parentTag) === -1;

      case 'caption':
      case 'col':
      case 'colgroup':
      case 'frame':
      case 'head':
      case 'tbody':
      case 'td':
      case 'tfoot':
      case 'th':
      case 'thead':
      case 'tr':
        // These tags are only valid with a few parents that have special child
        // parsing rules -- if we're down here, then none of those matched and
        // so we allow it only if we don't know what the parent is, as all other
        // cases are invalid.
        return parentTag == null;
    }

    return true;
  };

  /**
   * Returns whether
   */
  var findInvalidAncestorForTag = function findInvalidAncestorForTag(tag, ancestorInfo) {
    switch (tag) {
      case 'address':
      case 'article':
      case 'aside':
      case 'blockquote':
      case 'center':
      case 'details':
      case 'dialog':
      case 'dir':
      case 'div':
      case 'dl':
      case 'fieldset':
      case 'figcaption':
      case 'figure':
      case 'footer':
      case 'header':
      case 'hgroup':
      case 'main':
      case 'menu':
      case 'nav':
      case 'ol':
      case 'p':
      case 'section':
      case 'summary':
      case 'ul':

      case 'pre':
      case 'listing':

      case 'table':

      case 'hr':

      case 'xmp':

      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return ancestorInfo.pTagInButtonScope;

      case 'form':
        return ancestorInfo.formTag || ancestorInfo.pTagInButtonScope;

      case 'li':
        return ancestorInfo.listItemTagAutoclosing;

      case 'dd':
      case 'dt':
        return ancestorInfo.dlItemTagAutoclosing;

      case 'button':
        return ancestorInfo.buttonTagInScope;

      case 'a':
        // Spec says something about storing a list of markers, but it sounds
        // equivalent to this check.
        return ancestorInfo.aTagInScope;

      case 'nobr':
        return ancestorInfo.nobrTagInScope;
    }

    return null;
  };

  /**
   * Given a ReactCompositeComponent instance, return a list of its recursive
   * owners, starting at the root and ending with the instance itself.
   */
  var findOwnerStack = function findOwnerStack(instance) {
    if (!instance) {
      return [];
    }

    var stack = [];
    /*eslint-disable space-after-keywords */
    do {
      /*eslint-enable space-after-keywords */
      stack.push(instance);
    } while (instance = instance._currentElement._owner);
    stack.reverse();
    return stack;
  };

  var didWarn = {};

  validateDOMNesting = function validateDOMNesting(childTag, childInstance, ancestorInfo) {
    ancestorInfo = ancestorInfo || emptyAncestorInfo;
    var parentInfo = ancestorInfo.parentTag;
    var parentTag = parentInfo && parentInfo.tag;

    var invalidParent = isTagValidWithParent(childTag, parentTag) ? null : parentInfo;
    var invalidAncestor = invalidParent ? null : findInvalidAncestorForTag(childTag, ancestorInfo);
    var problematic = invalidParent || invalidAncestor;

    if (problematic) {
      var ancestorTag = problematic.tag;
      var ancestorInstance = problematic.instance;

      var childOwner = childInstance && childInstance._currentElement._owner;
      var ancestorOwner = ancestorInstance && ancestorInstance._currentElement._owner;

      var childOwners = findOwnerStack(childOwner);
      var ancestorOwners = findOwnerStack(ancestorOwner);

      var minStackLen = Math.min(childOwners.length, ancestorOwners.length);
      var i;

      var deepestCommon = -1;
      for (i = 0; i < minStackLen; i++) {
        if (childOwners[i] === ancestorOwners[i]) {
          deepestCommon = i;
        } else {
          break;
        }
      }

      var UNKNOWN = '(unknown)';
      var childOwnerNames = childOwners.slice(deepestCommon + 1).map(function (inst) {
        return inst.getName() || UNKNOWN;
      });
      var ancestorOwnerNames = ancestorOwners.slice(deepestCommon + 1).map(function (inst) {
        return inst.getName() || UNKNOWN;
      });
      var ownerInfo = [].concat(
      // If the parent and child instances have a common owner ancestor, start
      // with that -- otherwise we just start with the parent's owners.
      deepestCommon !== -1 ? childOwners[deepestCommon].getName() || UNKNOWN : [], ancestorOwnerNames, ancestorTag,
      // If we're warning about an invalid (non-parent) ancestry, add '...'
      invalidAncestor ? ['...'] : [], childOwnerNames, childTag).join(' > ');

      var warnKey = !!invalidParent + '|' + childTag + '|' + ancestorTag + '|' + ownerInfo;
      if (didWarn[warnKey]) {
        return;
      }
      didWarn[warnKey] = true;

      if (invalidParent) {
        var info = '';
        if (ancestorTag === 'table' && childTag === 'tr') {
          info += ' Add a <tbody> to your code to match the DOM tree generated by ' + 'the browser.';
        }
        process.env.NODE_ENV !== 'production' ? warning(false, 'validateDOMNesting(...): <%s> cannot appear as a child of <%s>. ' + 'See %s.%s', childTag, ancestorTag, ownerInfo, info) : undefined;
      } else {
        process.env.NODE_ENV !== 'production' ? warning(false, 'validateDOMNesting(...): <%s> cannot appear as a descendant of ' + '<%s>. See %s.', childTag, ancestorTag, ownerInfo) : undefined;
      }
    }
  };

  validateDOMNesting.ancestorInfoContextKey = '__validateDOMNesting_ancestorInfo$' + Math.random().toString(36).slice(2);

  validateDOMNesting.updatedAncestorInfo = updatedAncestorInfo;

  // For testing
  validateDOMNesting.isTagValidInContext = function (tag, ancestorInfo) {
    ancestorInfo = ancestorInfo || emptyAncestorInfo;
    var parentInfo = ancestorInfo.parentTag;
    var parentTag = parentInfo && parentInfo.tag;
    return isTagValidWithParent(tag, parentTag) && !findInvalidAncestorForTag(tag, ancestorInfo);
  };
}

module.exports = validateDOMNesting;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL3ZhbGlkYXRlRE9NTmVzdGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVdBOztBQUVBLElBQUksU0FBUyxRQUFRLGlCQUFSLENBQVQ7QUFDSixJQUFJLGdCQUFnQixRQUFRLHdCQUFSLENBQWhCO0FBQ0osSUFBSSxVQUFVLFFBQVEsa0JBQVIsQ0FBVjs7QUFFSixJQUFJLHFCQUFxQixhQUFyQjs7QUFFSixJQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsRUFBdUM7Ozs7Ozs7Ozs7Ozs7QUFhekMsTUFBSSxjQUFjLENBQUMsU0FBRCxFQUFZLFFBQVosRUFBc0IsTUFBdEIsRUFBOEIsU0FBOUIsRUFBeUMsT0FBekMsRUFBa0QsTUFBbEQsRUFBMEQsVUFBMUQsRUFBc0UsU0FBdEUsRUFBaUYsWUFBakYsRUFBK0YsTUFBL0YsRUFBdUcsSUFBdkcsRUFBNkcsUUFBN0csRUFBdUgsU0FBdkgsRUFBa0ksUUFBbEksRUFBNEksS0FBNUksRUFBbUosVUFBbkosRUFBK0osSUFBL0osRUFBcUssU0FBckssRUFBZ0wsS0FBaEwsRUFBdUwsS0FBdkwsRUFBOEwsSUFBOUwsRUFBb00sSUFBcE0sRUFBME0sT0FBMU0sRUFBbU4sVUFBbk4sRUFBK04sWUFBL04sRUFBNk8sUUFBN08sRUFBdVAsUUFBdlAsRUFBaVEsTUFBalEsRUFBeVEsT0FBelEsRUFBa1IsVUFBbFIsRUFBOFIsSUFBOVIsRUFBb1MsSUFBcFMsRUFBMFMsSUFBMVMsRUFBZ1QsSUFBaFQsRUFBc1QsSUFBdFQsRUFBNFQsSUFBNVQsRUFBa1UsTUFBbFUsRUFBMFUsUUFBMVUsRUFBb1YsUUFBcFYsRUFBOFYsSUFBOVYsRUFBb1csTUFBcFcsRUFBNFcsUUFBNVcsRUFBc1gsS0FBdFgsRUFBNlgsT0FBN1gsRUFBc1ksU0FBdFksRUFBaVosSUFBalosRUFBdVosTUFBdlosRUFBK1osU0FBL1osRUFBMGEsTUFB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O0FBQ0wsZ0JBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsUUFBUSxLQUFSLEVBQWUsb0VBQW9FLGVBQXBFLEVBQXFGLFFBQXBHLEVBQThHLFdBQTlHLEVBQTJILFNBQTNILENBQXhDLEdBQWdMLFNBQWhMLENBREs7T0FOUDtLQTFDRjtHQVRtQixDQTNRb0I7O0FBMFV6QyxxQkFBbUIsc0JBQW5CLEdBQTRDLHVDQUF1QyxLQUFLLE1BQUwsR0FBYyxRQUFkLENBQXVCLEVBQXZCLEVBQTJCLEtBQTNCLENBQWlDLENBQWpDLENBQXZDLENBMVVIOztBQTRVekMscUJBQW1CLG1CQUFuQixHQUF5QyxtQkFBekM7OztBQTVVeUMsb0JBK1V6QyxDQUFtQixtQkFBbkIsR0FBeUMsVUFBVSxHQUFWLEVBQWUsWUFBZixFQUE2QjtBQUNwRSxtQkFBZSxnQkFBZ0IsaUJBQWhCLENBRHFEO0FBRXBFLFFBQUksYUFBYSxhQUFhLFNBQWIsQ0FGbUQ7QUFHcEUsUUFBSSxZQUFZLGNBQWMsV0FBVyxHQUFYLENBSHNDO0FBSXBFLFdBQU8scUJBQXFCLEdBQXJCLEVBQTBCLFNBQTFCLEtBQXdDLENBQUMsMEJBQTBCLEdBQTFCLEVBQStCLFlBQS9CLENBQUQsQ0FKcUI7R0FBN0IsQ0EvVUE7Q0FBM0M7O0FBdVZBLE9BQU8sT0FBUCxHQUFpQixrQkFBakIiLCJmaWxlIjoidmFsaWRhdGVET01OZXN0aW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSB2YWxpZGF0ZURPTU5lc3RpbmdcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL09iamVjdC5hc3NpZ24nKTtcbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbnZhciB2YWxpZGF0ZURPTU5lc3RpbmcgPSBlbXB0eUZ1bmN0aW9uO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAvLyBUaGlzIHZhbGlkYXRpb24gY29kZSB3YXMgd3JpdHRlbiBiYXNlZCBvbiB0aGUgSFRNTDUgcGFyc2luZyBzcGVjOlxuICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNoYXMtYW4tZWxlbWVudC1pbi1zY29wZVxuICAvL1xuICAvLyBOb3RlOiB0aGlzIGRvZXMgbm90IGNhdGNoIGFsbCBpbnZhbGlkIG5lc3RpbmcsIG5vciBkb2VzIGl0IHRyeSB0byAoYXMgaXQnc1xuICAvLyBub3QgY2xlYXIgd2hhdCBwcmFjdGljYWwgYmVuZWZpdCBkb2luZyBzbyBwcm92aWRlcyk7IGluc3RlYWQsIHdlIHdhcm4gb25seVxuICAvLyBmb3IgY2FzZXMgd2hlcmUgdGhlIHBhcnNlciB3aWxsIGdpdmUgYSBwYXJzZSB0cmVlIGRpZmZlcmluZyBmcm9tIHdoYXQgUmVhY3RcbiAgLy8gaW50ZW5kZWQuIEZvciBleGFtcGxlLCA8Yj48ZGl2PjwvZGl2PjwvYj4gaXMgaW52YWxpZCBidXQgd2UgZG9uJ3Qgd2FyblxuICAvLyBiZWNhdXNlIGl0IHN0aWxsIHBhcnNlcyBjb3JyZWN0bHk7IHdlIGRvIHdhcm4gZm9yIG90aGVyIGNhc2VzIGxpa2UgbmVzdGVkXG4gIC8vIDxwPiB0YWdzIHdoZXJlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHNlY29uZCBlbGVtZW50IGltcGxpY2l0bHkgY2xvc2VzIHRoZVxuICAvLyBmaXJzdCwgY2F1c2luZyBhIGNvbmZ1c2luZyBtZXNzLlxuXG4gIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI3NwZWNpYWxcbiAgdmFyIHNwZWNpYWxUYWdzID0gWydhZGRyZXNzJywgJ2FwcGxldCcsICdhcmVhJywgJ2FydGljbGUnLCAnYXNpZGUnLCAnYmFzZScsICdiYXNlZm9udCcsICdiZ3NvdW5kJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdicicsICdidXR0b24nLCAnY2FwdGlvbicsICdjZW50ZXInLCAnY29sJywgJ2NvbGdyb3VwJywgJ2RkJywgJ2RldGFpbHMnLCAnZGlyJywgJ2RpdicsICdkbCcsICdkdCcsICdlbWJlZCcsICdmaWVsZHNldCcsICdmaWdjYXB0aW9uJywgJ2ZpZ3VyZScsICdmb290ZXInLCAnZm9ybScsICdmcmFtZScsICdmcmFtZXNldCcsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNicsICdoZWFkJywgJ2hlYWRlcicsICdoZ3JvdXAnLCAnaHInLCAnaHRtbCcsICdpZnJhbWUnLCAnaW1nJywgJ2lucHV0JywgJ2lzaW5kZXgnLCAnbGknLCAnbGluaycsICdsaXN0aW5nJywgJ21haW4nLCAnbWFycXVlZScsICdtZW51JywgJ21lbnVpdGVtJywgJ21ldGEnLCAnbmF2JywgJ25vZW1iZWQnLCAnbm9mcmFtZXMnLCAnbm9zY3JpcHQnLCAnb2JqZWN0JywgJ29sJywgJ3AnLCAncGFyYW0nLCAncGxhaW50ZXh0JywgJ3ByZScsICdzY3JpcHQnLCAnc2VjdGlvbicsICdzZWxlY3QnLCAnc291cmNlJywgJ3N0eWxlJywgJ3N1bW1hcnknLCAndGFibGUnLCAndGJvZHknLCAndGQnLCAndGVtcGxhdGUnLCAndGV4dGFyZWEnLCAndGZvb3QnLCAndGgnLCAndGhlYWQnLCAndGl0bGUnLCAndHInLCAndHJhY2snLCAndWwnLCAnd2JyJywgJ3htcCddO1xuXG4gIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI2hhcy1hbi1lbGVtZW50LWluLXNjb3BlXG4gIHZhciBpblNjb3BlVGFncyA9IFsnYXBwbGV0JywgJ2NhcHRpb24nLCAnaHRtbCcsICd0YWJsZScsICd0ZCcsICd0aCcsICdtYXJxdWVlJywgJ29iamVjdCcsICd0ZW1wbGF0ZScsXG5cbiAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjaHRtbC1pbnRlZ3JhdGlvbi1wb2ludFxuICAvLyBUT0RPOiBEaXN0aW5ndWlzaCBieSBuYW1lc3BhY2UgaGVyZSAtLSBmb3IgPHRpdGxlPiwgaW5jbHVkaW5nIGl0IGhlcmVcbiAgLy8gZXJycyBvbiB0aGUgc2lkZSBvZiBmZXdlciB3YXJuaW5nc1xuICAnZm9yZWlnbk9iamVjdCcsICdkZXNjJywgJ3RpdGxlJ107XG5cbiAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjaGFzLWFuLWVsZW1lbnQtaW4tYnV0dG9uLXNjb3BlXG4gIHZhciBidXR0b25TY29wZVRhZ3MgPSBpblNjb3BlVGFncy5jb25jYXQoWydidXR0b24nXSk7XG5cbiAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjZ2VuZXJhdGUtaW1wbGllZC1lbmQtdGFnc1xuICB2YXIgaW1wbGllZEVuZFRhZ3MgPSBbJ2RkJywgJ2R0JywgJ2xpJywgJ29wdGlvbicsICdvcHRncm91cCcsICdwJywgJ3JwJywgJ3J0J107XG5cbiAgdmFyIGVtcHR5QW5jZXN0b3JJbmZvID0ge1xuICAgIHBhcmVudFRhZzogbnVsbCxcblxuICAgIGZvcm1UYWc6IG51bGwsXG4gICAgYVRhZ0luU2NvcGU6IG51bGwsXG4gICAgYnV0dG9uVGFnSW5TY29wZTogbnVsbCxcbiAgICBub2JyVGFnSW5TY29wZTogbnVsbCxcbiAgICBwVGFnSW5CdXR0b25TY29wZTogbnVsbCxcblxuICAgIGxpc3RJdGVtVGFnQXV0b2Nsb3Npbmc6IG51bGwsXG4gICAgZGxJdGVtVGFnQXV0b2Nsb3Npbmc6IG51bGxcbiAgfTtcblxuICB2YXIgdXBkYXRlZEFuY2VzdG9ySW5mbyA9IGZ1bmN0aW9uIChvbGRJbmZvLCB0YWcsIGluc3RhbmNlKSB7XG4gICAgdmFyIGFuY2VzdG9ySW5mbyA9IGFzc2lnbih7fSwgb2xkSW5mbyB8fCBlbXB0eUFuY2VzdG9ySW5mbyk7XG4gICAgdmFyIGluZm8gPSB7IHRhZzogdGFnLCBpbnN0YW5jZTogaW5zdGFuY2UgfTtcblxuICAgIGlmIChpblNjb3BlVGFncy5pbmRleE9mKHRhZykgIT09IC0xKSB7XG4gICAgICBhbmNlc3RvckluZm8uYVRhZ0luU2NvcGUgPSBudWxsO1xuICAgICAgYW5jZXN0b3JJbmZvLmJ1dHRvblRhZ0luU2NvcGUgPSBudWxsO1xuICAgICAgYW5jZXN0b3JJbmZvLm5vYnJUYWdJblNjb3BlID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKGJ1dHRvblNjb3BlVGFncy5pbmRleE9mKHRhZykgIT09IC0xKSB7XG4gICAgICBhbmNlc3RvckluZm8ucFRhZ0luQnV0dG9uU2NvcGUgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIFNlZSBydWxlcyBmb3IgJ2xpJywgJ2RkJywgJ2R0JyBzdGFydCB0YWdzIGluXG4gICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjcGFyc2luZy1tYWluLWluYm9keVxuICAgIGlmIChzcGVjaWFsVGFncy5pbmRleE9mKHRhZykgIT09IC0xICYmIHRhZyAhPT0gJ2FkZHJlc3MnICYmIHRhZyAhPT0gJ2RpdicgJiYgdGFnICE9PSAncCcpIHtcbiAgICAgIGFuY2VzdG9ySW5mby5saXN0SXRlbVRhZ0F1dG9jbG9zaW5nID0gbnVsbDtcbiAgICAgIGFuY2VzdG9ySW5mby5kbEl0ZW1UYWdBdXRvY2xvc2luZyA9IG51bGw7XG4gICAgfVxuXG4gICAgYW5jZXN0b3JJbmZvLnBhcmVudFRhZyA9IGluZm87XG5cbiAgICBpZiAodGFnID09PSAnZm9ybScpIHtcbiAgICAgIGFuY2VzdG9ySW5mby5mb3JtVGFnID0gaW5mbztcbiAgICB9XG4gICAgaWYgKHRhZyA9PT0gJ2EnKSB7XG4gICAgICBhbmNlc3RvckluZm8uYVRhZ0luU2NvcGUgPSBpbmZvO1xuICAgIH1cbiAgICBpZiAodGFnID09PSAnYnV0dG9uJykge1xuICAgICAgYW5jZXN0b3JJbmZvLmJ1dHRvblRhZ0luU2NvcGUgPSBpbmZvO1xuICAgIH1cbiAgICBpZiAodGFnID09PSAnbm9icicpIHtcbiAgICAgIGFuY2VzdG9ySW5mby5ub2JyVGFnSW5TY29wZSA9IGluZm87XG4gICAgfVxuICAgIGlmICh0YWcgPT09ICdwJykge1xuICAgICAgYW5jZXN0b3JJbmZvLnBUYWdJbkJ1dHRvblNjb3BlID0gaW5mbztcbiAgICB9XG4gICAgaWYgKHRhZyA9PT0gJ2xpJykge1xuICAgICAgYW5jZXN0b3JJbmZvLmxpc3RJdGVtVGFnQXV0b2Nsb3NpbmcgPSBpbmZvO1xuICAgIH1cbiAgICBpZiAodGFnID09PSAnZGQnIHx8IHRhZyA9PT0gJ2R0Jykge1xuICAgICAgYW5jZXN0b3JJbmZvLmRsSXRlbVRhZ0F1dG9jbG9zaW5nID0gaW5mbztcbiAgICB9XG5cbiAgICByZXR1cm4gYW5jZXN0b3JJbmZvO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXJcbiAgICovXG4gIHZhciBpc1RhZ1ZhbGlkV2l0aFBhcmVudCA9IGZ1bmN0aW9uICh0YWcsIHBhcmVudFRhZykge1xuICAgIC8vIEZpcnN0LCBsZXQncyBjaGVjayBpZiB3ZSdyZSBpbiBhbiB1bnVzdWFsIHBhcnNpbmcgbW9kZS4uLlxuICAgIHN3aXRjaCAocGFyZW50VGFnKSB7XG4gICAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNwYXJzaW5nLW1haW4taW5zZWxlY3RcbiAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgIHJldHVybiB0YWcgPT09ICdvcHRpb24nIHx8IHRhZyA9PT0gJ29wdGdyb3VwJyB8fCB0YWcgPT09ICcjdGV4dCc7XG4gICAgICBjYXNlICdvcHRncm91cCc6XG4gICAgICAgIHJldHVybiB0YWcgPT09ICdvcHRpb24nIHx8IHRhZyA9PT0gJyN0ZXh0JztcbiAgICAgIC8vIFN0cmljdGx5IHNwZWFraW5nLCBzZWVpbmcgYW4gPG9wdGlvbj4gZG9lc24ndCBtZWFuIHdlJ3JlIGluIGEgPHNlbGVjdD5cbiAgICAgIC8vIGJ1dFxuICAgICAgY2FzZSAnb3B0aW9uJzpcbiAgICAgICAgcmV0dXJuIHRhZyA9PT0gJyN0ZXh0JztcblxuICAgICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjcGFyc2luZy1tYWluLWludGRcbiAgICAgIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI3BhcnNpbmctbWFpbi1pbmNhcHRpb25cbiAgICAgIC8vIE5vIHNwZWNpYWwgYmVoYXZpb3Igc2luY2UgdGhlc2UgcnVsZXMgZmFsbCBiYWNrIHRvIFwiaW4gYm9keVwiIG1vZGUgZm9yXG4gICAgICAvLyBhbGwgZXhjZXB0IHNwZWNpYWwgdGFibGUgbm9kZXMgd2hpY2ggY2F1c2UgYmFkIHBhcnNpbmcgYmVoYXZpb3IgYW55d2F5LlxuXG4gICAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNwYXJzaW5nLW1haW4taW50clxuICAgICAgY2FzZSAndHInOlxuICAgICAgICByZXR1cm4gdGFnID09PSAndGgnIHx8IHRhZyA9PT0gJ3RkJyB8fCB0YWcgPT09ICdzdHlsZScgfHwgdGFnID09PSAnc2NyaXB0JyB8fCB0YWcgPT09ICd0ZW1wbGF0ZSc7XG5cbiAgICAgIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI3BhcnNpbmctbWFpbi1pbnRib2R5XG4gICAgICBjYXNlICd0Ym9keSc6XG4gICAgICBjYXNlICd0aGVhZCc6XG4gICAgICBjYXNlICd0Zm9vdCc6XG4gICAgICAgIHJldHVybiB0YWcgPT09ICd0cicgfHwgdGFnID09PSAnc3R5bGUnIHx8IHRhZyA9PT0gJ3NjcmlwdCcgfHwgdGFnID09PSAndGVtcGxhdGUnO1xuXG4gICAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNwYXJzaW5nLW1haW4taW5jb2xncm91cFxuICAgICAgY2FzZSAnY29sZ3JvdXAnOlxuICAgICAgICByZXR1cm4gdGFnID09PSAnY29sJyB8fCB0YWcgPT09ICd0ZW1wbGF0ZSc7XG5cbiAgICAgIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI3BhcnNpbmctbWFpbi1pbnRhYmxlXG4gICAgICBjYXNlICd0YWJsZSc6XG4gICAgICAgIHJldHVybiB0YWcgPT09ICdjYXB0aW9uJyB8fCB0YWcgPT09ICdjb2xncm91cCcgfHwgdGFnID09PSAndGJvZHknIHx8IHRhZyA9PT0gJ3Rmb290JyB8fCB0YWcgPT09ICd0aGVhZCcgfHwgdGFnID09PSAnc3R5bGUnIHx8IHRhZyA9PT0gJ3NjcmlwdCcgfHwgdGFnID09PSAndGVtcGxhdGUnO1xuXG4gICAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNwYXJzaW5nLW1haW4taW5oZWFkXG4gICAgICBjYXNlICdoZWFkJzpcbiAgICAgICAgcmV0dXJuIHRhZyA9PT0gJ2Jhc2UnIHx8IHRhZyA9PT0gJ2Jhc2Vmb250JyB8fCB0YWcgPT09ICdiZ3NvdW5kJyB8fCB0YWcgPT09ICdsaW5rJyB8fCB0YWcgPT09ICdtZXRhJyB8fCB0YWcgPT09ICd0aXRsZScgfHwgdGFnID09PSAnbm9zY3JpcHQnIHx8IHRhZyA9PT0gJ25vZnJhbWVzJyB8fCB0YWcgPT09ICdzdHlsZScgfHwgdGFnID09PSAnc2NyaXB0JyB8fCB0YWcgPT09ICd0ZW1wbGF0ZSc7XG5cbiAgICAgIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3NlbWFudGljcy5odG1sI3RoZS1odG1sLWVsZW1lbnRcbiAgICAgIGNhc2UgJ2h0bWwnOlxuICAgICAgICByZXR1cm4gdGFnID09PSAnaGVhZCcgfHwgdGFnID09PSAnYm9keSc7XG4gICAgfVxuXG4gICAgLy8gUHJvYmFibHkgaW4gdGhlIFwiaW4gYm9keVwiIHBhcnNpbmcgbW9kZSwgc28gd2Ugb3V0bGF3IG9ubHkgdGFnIGNvbWJvc1xuICAgIC8vIHdoZXJlIHRoZSBwYXJzaW5nIHJ1bGVzIGNhdXNlIGltcGxpY2l0IG9wZW5zIG9yIGNsb3NlcyB0byBiZSBhZGRlZC5cbiAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNwYXJzaW5nLW1haW4taW5ib2R5XG4gICAgc3dpdGNoICh0YWcpIHtcbiAgICAgIGNhc2UgJ2gxJzpcbiAgICAgIGNhc2UgJ2gyJzpcbiAgICAgIGNhc2UgJ2gzJzpcbiAgICAgIGNhc2UgJ2g0JzpcbiAgICAgIGNhc2UgJ2g1JzpcbiAgICAgIGNhc2UgJ2g2JzpcbiAgICAgICAgcmV0dXJuIHBhcmVudFRhZyAhPT0gJ2gxJyAmJiBwYXJlbnRUYWcgIT09ICdoMicgJiYgcGFyZW50VGFnICE9PSAnaDMnICYmIHBhcmVudFRhZyAhPT0gJ2g0JyAmJiBwYXJlbnRUYWcgIT09ICdoNScgJiYgcGFyZW50VGFnICE9PSAnaDYnO1xuXG4gICAgICBjYXNlICdycCc6XG4gICAgICBjYXNlICdydCc6XG4gICAgICAgIHJldHVybiBpbXBsaWVkRW5kVGFncy5pbmRleE9mKHBhcmVudFRhZykgPT09IC0xO1xuXG4gICAgICBjYXNlICdjYXB0aW9uJzpcbiAgICAgIGNhc2UgJ2NvbCc6XG4gICAgICBjYXNlICdjb2xncm91cCc6XG4gICAgICBjYXNlICdmcmFtZSc6XG4gICAgICBjYXNlICdoZWFkJzpcbiAgICAgIGNhc2UgJ3Rib2R5JzpcbiAgICAgIGNhc2UgJ3RkJzpcbiAgICAgIGNhc2UgJ3Rmb290JzpcbiAgICAgIGNhc2UgJ3RoJzpcbiAgICAgIGNhc2UgJ3RoZWFkJzpcbiAgICAgIGNhc2UgJ3RyJzpcbiAgICAgICAgLy8gVGhlc2UgdGFncyBhcmUgb25seSB2YWxpZCB3aXRoIGEgZmV3IHBhcmVudHMgdGhhdCBoYXZlIHNwZWNpYWwgY2hpbGRcbiAgICAgICAgLy8gcGFyc2luZyBydWxlcyAtLSBpZiB3ZSdyZSBkb3duIGhlcmUsIHRoZW4gbm9uZSBvZiB0aG9zZSBtYXRjaGVkIGFuZFxuICAgICAgICAvLyBzbyB3ZSBhbGxvdyBpdCBvbmx5IGlmIHdlIGRvbid0IGtub3cgd2hhdCB0aGUgcGFyZW50IGlzLCBhcyBhbGwgb3RoZXJcbiAgICAgICAgLy8gY2FzZXMgYXJlIGludmFsaWQuXG4gICAgICAgIHJldHVybiBwYXJlbnRUYWcgPT0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyXG4gICAqL1xuICB2YXIgZmluZEludmFsaWRBbmNlc3RvckZvclRhZyA9IGZ1bmN0aW9uICh0YWcsIGFuY2VzdG9ySW5mbykge1xuICAgIHN3aXRjaCAodGFnKSB7XG4gICAgICBjYXNlICdhZGRyZXNzJzpcbiAgICAgIGNhc2UgJ2FydGljbGUnOlxuICAgICAgY2FzZSAnYXNpZGUnOlxuICAgICAgY2FzZSAnYmxvY2txdW90ZSc6XG4gICAgICBjYXNlICdjZW50ZXInOlxuICAgICAgY2FzZSAnZGV0YWlscyc6XG4gICAgICBjYXNlICdkaWFsb2cnOlxuICAgICAgY2FzZSAnZGlyJzpcbiAgICAgIGNhc2UgJ2Rpdic6XG4gICAgICBjYXNlICdkbCc6XG4gICAgICBjYXNlICdmaWVsZHNldCc6XG4gICAgICBjYXNlICdmaWdjYXB0aW9uJzpcbiAgICAgIGNhc2UgJ2ZpZ3VyZSc6XG4gICAgICBjYXNlICdmb290ZXInOlxuICAgICAgY2FzZSAnaGVhZGVyJzpcbiAgICAgIGNhc2UgJ2hncm91cCc6XG4gICAgICBjYXNlICdtYWluJzpcbiAgICAgIGNhc2UgJ21lbnUnOlxuICAgICAgY2FzZSAnbmF2JzpcbiAgICAgIGNhc2UgJ29sJzpcbiAgICAgIGNhc2UgJ3AnOlxuICAgICAgY2FzZSAnc2VjdGlvbic6XG4gICAgICBjYXNlICdzdW1tYXJ5JzpcbiAgICAgIGNhc2UgJ3VsJzpcblxuICAgICAgY2FzZSAncHJlJzpcbiAgICAgIGNhc2UgJ2xpc3RpbmcnOlxuXG4gICAgICBjYXNlICd0YWJsZSc6XG5cbiAgICAgIGNhc2UgJ2hyJzpcblxuICAgICAgY2FzZSAneG1wJzpcblxuICAgICAgY2FzZSAnaDEnOlxuICAgICAgY2FzZSAnaDInOlxuICAgICAgY2FzZSAnaDMnOlxuICAgICAgY2FzZSAnaDQnOlxuICAgICAgY2FzZSAnaDUnOlxuICAgICAgY2FzZSAnaDYnOlxuICAgICAgICByZXR1cm4gYW5jZXN0b3JJbmZvLnBUYWdJbkJ1dHRvblNjb3BlO1xuXG4gICAgICBjYXNlICdmb3JtJzpcbiAgICAgICAgcmV0dXJuIGFuY2VzdG9ySW5mby5mb3JtVGFnIHx8IGFuY2VzdG9ySW5mby5wVGFnSW5CdXR0b25TY29wZTtcblxuICAgICAgY2FzZSAnbGknOlxuICAgICAgICByZXR1cm4gYW5jZXN0b3JJbmZvLmxpc3RJdGVtVGFnQXV0b2Nsb3Npbmc7XG5cbiAgICAgIGNhc2UgJ2RkJzpcbiAgICAgIGNhc2UgJ2R0JzpcbiAgICAgICAgcmV0dXJuIGFuY2VzdG9ySW5mby5kbEl0ZW1UYWdBdXRvY2xvc2luZztcblxuICAgICAgY2FzZSAnYnV0dG9uJzpcbiAgICAgICAgcmV0dXJuIGFuY2VzdG9ySW5mby5idXR0b25UYWdJblNjb3BlO1xuXG4gICAgICBjYXNlICdhJzpcbiAgICAgICAgLy8gU3BlYyBzYXlzIHNvbWV0aGluZyBhYm91dCBzdG9yaW5nIGEgbGlzdCBvZiBtYXJrZXJzLCBidXQgaXQgc291bmRzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gdGhpcyBjaGVjay5cbiAgICAgICAgcmV0dXJuIGFuY2VzdG9ySW5mby5hVGFnSW5TY29wZTtcblxuICAgICAgY2FzZSAnbm9icic6XG4gICAgICAgIHJldHVybiBhbmNlc3RvckluZm8ubm9iclRhZ0luU2NvcGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdpdmVuIGEgUmVhY3RDb21wb3NpdGVDb21wb25lbnQgaW5zdGFuY2UsIHJldHVybiBhIGxpc3Qgb2YgaXRzIHJlY3Vyc2l2ZVxuICAgKiBvd25lcnMsIHN0YXJ0aW5nIGF0IHRoZSByb290IGFuZCBlbmRpbmcgd2l0aCB0aGUgaW5zdGFuY2UgaXRzZWxmLlxuICAgKi9cbiAgdmFyIGZpbmRPd25lclN0YWNrID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHZhciBzdGFjayA9IFtdO1xuICAgIC8qZXNsaW50LWRpc2FibGUgc3BhY2UtYWZ0ZXIta2V5d29yZHMgKi9cbiAgICBkbyB7XG4gICAgICAvKmVzbGludC1lbmFibGUgc3BhY2UtYWZ0ZXIta2V5d29yZHMgKi9cbiAgICAgIHN0YWNrLnB1c2goaW5zdGFuY2UpO1xuICAgIH0gd2hpbGUgKGluc3RhbmNlID0gaW5zdGFuY2UuX2N1cnJlbnRFbGVtZW50Ll9vd25lcik7XG4gICAgc3RhY2sucmV2ZXJzZSgpO1xuICAgIHJldHVybiBzdGFjaztcbiAgfTtcblxuICB2YXIgZGlkV2FybiA9IHt9O1xuXG4gIHZhbGlkYXRlRE9NTmVzdGluZyA9IGZ1bmN0aW9uIChjaGlsZFRhZywgY2hpbGRJbnN0YW5jZSwgYW5jZXN0b3JJbmZvKSB7XG4gICAgYW5jZXN0b3JJbmZvID0gYW5jZXN0b3JJbmZvIHx8IGVtcHR5QW5jZXN0b3JJbmZvO1xuICAgIHZhciBwYXJlbnRJbmZvID0gYW5jZXN0b3JJbmZvLnBhcmVudFRhZztcbiAgICB2YXIgcGFyZW50VGFnID0gcGFyZW50SW5mbyAmJiBwYXJlbnRJbmZvLnRhZztcblxuICAgIHZhciBpbnZhbGlkUGFyZW50ID0gaXNUYWdWYWxpZFdpdGhQYXJlbnQoY2hpbGRUYWcsIHBhcmVudFRhZykgPyBudWxsIDogcGFyZW50SW5mbztcbiAgICB2YXIgaW52YWxpZEFuY2VzdG9yID0gaW52YWxpZFBhcmVudCA/IG51bGwgOiBmaW5kSW52YWxpZEFuY2VzdG9yRm9yVGFnKGNoaWxkVGFnLCBhbmNlc3RvckluZm8pO1xuICAgIHZhciBwcm9ibGVtYXRpYyA9IGludmFsaWRQYXJlbnQgfHwgaW52YWxpZEFuY2VzdG9yO1xuXG4gICAgaWYgKHByb2JsZW1hdGljKSB7XG4gICAgICB2YXIgYW5jZXN0b3JUYWcgPSBwcm9ibGVtYXRpYy50YWc7XG4gICAgICB2YXIgYW5jZXN0b3JJbnN0YW5jZSA9IHByb2JsZW1hdGljLmluc3RhbmNlO1xuXG4gICAgICB2YXIgY2hpbGRPd25lciA9IGNoaWxkSW5zdGFuY2UgJiYgY2hpbGRJbnN0YW5jZS5fY3VycmVudEVsZW1lbnQuX293bmVyO1xuICAgICAgdmFyIGFuY2VzdG9yT3duZXIgPSBhbmNlc3Rvckluc3RhbmNlICYmIGFuY2VzdG9ySW5zdGFuY2UuX2N1cnJlbnRFbGVtZW50Ll9vd25lcjtcblxuICAgICAgdmFyIGNoaWxkT3duZXJzID0gZmluZE93bmVyU3RhY2soY2hpbGRPd25lcik7XG4gICAgICB2YXIgYW5jZXN0b3JPd25lcnMgPSBmaW5kT3duZXJTdGFjayhhbmNlc3Rvck93bmVyKTtcblxuICAgICAgdmFyIG1pblN0YWNrTGVuID0gTWF0aC5taW4oY2hpbGRPd25lcnMubGVuZ3RoLCBhbmNlc3Rvck93bmVycy5sZW5ndGgpO1xuICAgICAgdmFyIGk7XG5cbiAgICAgIHZhciBkZWVwZXN0Q29tbW9uID0gLTE7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbWluU3RhY2tMZW47IGkrKykge1xuICAgICAgICBpZiAoY2hpbGRPd25lcnNbaV0gPT09IGFuY2VzdG9yT3duZXJzW2ldKSB7XG4gICAgICAgICAgZGVlcGVzdENvbW1vbiA9IGk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIFVOS05PV04gPSAnKHVua25vd24pJztcbiAgICAgIHZhciBjaGlsZE93bmVyTmFtZXMgPSBjaGlsZE93bmVycy5zbGljZShkZWVwZXN0Q29tbW9uICsgMSkubWFwKGZ1bmN0aW9uIChpbnN0KSB7XG4gICAgICAgIHJldHVybiBpbnN0LmdldE5hbWUoKSB8fCBVTktOT1dOO1xuICAgICAgfSk7XG4gICAgICB2YXIgYW5jZXN0b3JPd25lck5hbWVzID0gYW5jZXN0b3JPd25lcnMuc2xpY2UoZGVlcGVzdENvbW1vbiArIDEpLm1hcChmdW5jdGlvbiAoaW5zdCkge1xuICAgICAgICByZXR1cm4gaW5zdC5nZXROYW1lKCkgfHwgVU5LTk9XTjtcbiAgICAgIH0pO1xuICAgICAgdmFyIG93bmVySW5mbyA9IFtdLmNvbmNhdChcbiAgICAgIC8vIElmIHRoZSBwYXJlbnQgYW5kIGNoaWxkIGluc3RhbmNlcyBoYXZlIGEgY29tbW9uIG93bmVyIGFuY2VzdG9yLCBzdGFydFxuICAgICAgLy8gd2l0aCB0aGF0IC0tIG90aGVyd2lzZSB3ZSBqdXN0IHN0YXJ0IHdpdGggdGhlIHBhcmVudCdzIG93bmVycy5cbiAgICAgIGRlZXBlc3RDb21tb24gIT09IC0xID8gY2hpbGRPd25lcnNbZGVlcGVzdENvbW1vbl0uZ2V0TmFtZSgpIHx8IFVOS05PV04gOiBbXSwgYW5jZXN0b3JPd25lck5hbWVzLCBhbmNlc3RvclRhZyxcbiAgICAgIC8vIElmIHdlJ3JlIHdhcm5pbmcgYWJvdXQgYW4gaW52YWxpZCAobm9uLXBhcmVudCkgYW5jZXN0cnksIGFkZCAnLi4uJ1xuICAgICAgaW52YWxpZEFuY2VzdG9yID8gWycuLi4nXSA6IFtdLCBjaGlsZE93bmVyTmFtZXMsIGNoaWxkVGFnKS5qb2luKCcgPiAnKTtcblxuICAgICAgdmFyIHdhcm5LZXkgPSAhIWludmFsaWRQYXJlbnQgKyAnfCcgKyBjaGlsZFRhZyArICd8JyArIGFuY2VzdG9yVGFnICsgJ3wnICsgb3duZXJJbmZvO1xuICAgICAgaWYgKGRpZFdhcm5bd2FybktleV0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZGlkV2Fyblt3YXJuS2V5XSA9IHRydWU7XG5cbiAgICAgIGlmIChpbnZhbGlkUGFyZW50KSB7XG4gICAgICAgIHZhciBpbmZvID0gJyc7XG4gICAgICAgIGlmIChhbmNlc3RvclRhZyA9PT0gJ3RhYmxlJyAmJiBjaGlsZFRhZyA9PT0gJ3RyJykge1xuICAgICAgICAgIGluZm8gKz0gJyBBZGQgYSA8dGJvZHk+IHRvIHlvdXIgY29kZSB0byBtYXRjaCB0aGUgRE9NIHRyZWUgZ2VuZXJhdGVkIGJ5ICcgKyAndGhlIGJyb3dzZXIuJztcbiAgICAgICAgfVxuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ3ZhbGlkYXRlRE9NTmVzdGluZyguLi4pOiA8JXM+IGNhbm5vdCBhcHBlYXIgYXMgYSBjaGlsZCBvZiA8JXM+LiAnICsgJ1NlZSAlcy4lcycsIGNoaWxkVGFnLCBhbmNlc3RvclRhZywgb3duZXJJbmZvLCBpbmZvKSA6IHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAndmFsaWRhdGVET01OZXN0aW5nKC4uLik6IDwlcz4gY2Fubm90IGFwcGVhciBhcyBhIGRlc2NlbmRhbnQgb2YgJyArICc8JXM+LiBTZWUgJXMuJywgY2hpbGRUYWcsIGFuY2VzdG9yVGFnLCBvd25lckluZm8pIDogdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YWxpZGF0ZURPTU5lc3RpbmcuYW5jZXN0b3JJbmZvQ29udGV4dEtleSA9ICdfX3ZhbGlkYXRlRE9NTmVzdGluZ19hbmNlc3RvckluZm8kJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpO1xuXG4gIHZhbGlkYXRlRE9NTmVzdGluZy51cGRhdGVkQW5jZXN0b3JJbmZvID0gdXBkYXRlZEFuY2VzdG9ySW5mbztcblxuICAvLyBGb3IgdGVzdGluZ1xuICB2YWxpZGF0ZURPTU5lc3RpbmcuaXNUYWdWYWxpZEluQ29udGV4dCA9IGZ1bmN0aW9uICh0YWcsIGFuY2VzdG9ySW5mbykge1xuICAgIGFuY2VzdG9ySW5mbyA9IGFuY2VzdG9ySW5mbyB8fCBlbXB0eUFuY2VzdG9ySW5mbztcbiAgICB2YXIgcGFyZW50SW5mbyA9IGFuY2VzdG9ySW5mby5wYXJlbnRUYWc7XG4gICAgdmFyIHBhcmVudFRhZyA9IHBhcmVudEluZm8gJiYgcGFyZW50SW5mby50YWc7XG4gICAgcmV0dXJuIGlzVGFnVmFsaWRXaXRoUGFyZW50KHRhZywgcGFyZW50VGFnKSAmJiAhZmluZEludmFsaWRBbmNlc3RvckZvclRhZyh0YWcsIGFuY2VzdG9ySW5mbyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdmFsaWRhdGVET01OZXN0aW5nOyJdfQ==