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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL3ZhbGlkYXRlRE9NTmVzdGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVdBOztBQUVBLElBQUksU0FBUyxRQUFRLGlCQUFSLENBQWI7QUFDQSxJQUFJLGdCQUFnQixRQUFRLHdCQUFSLENBQXBCO0FBQ0EsSUFBSSxVQUFVLFFBQVEsa0JBQVIsQ0FBZDs7QUFFQSxJQUFJLHFCQUFxQixhQUF6Qjs7QUFFQSxJQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFBMkM7Ozs7Ozs7Ozs7Ozs7QUFhekMsTUFBSSxjQUFjLENBQUMsU0FBRCxFQUFZLFFBQVosRUFBc0IsTUFBdEIsRUFBOEIsU0FBOUIsRUFBeUMsT0FBekMsRUFBa0QsTUFBbEQsRUFBMEQsVUFBMUQsRUFBc0UsU0FBdEUsRUFBaUYsWUFBakYsRUFBK0YsTUFBL0YsRUFBdUcsSUFBdkcsRUFBNkcsUUFBN0csRUFBdUgsU0FBdkgsRUFBa0ksUUFBbEksRUFBNEksS0FBNUksRUFBbUosVUFBbkosRUFBK0osSUFBL0osRUFBcUssU0FBckssRUFBZ0wsS0FBaEwsRUFBdUwsS0FBdkwsRUFBOEwsSUFBOUwsRUFBb00sSUFBcE0sRUFBME0sT0FBMU0sRUFBbU4sVUFBbk4sRUFBK04sWUFBL04sRUFBNk8sUUFBN08sRUFBdVAsUUFBdlAsRUFBaVEsTUFBalEsRUFBeVEsT0FBelEsRUFBa1IsVUFBbFIsRUFBOFIsSUFBOVIsRUFBb1MsSUFBcFMsRUFBMFMsSUFBMVMsRUFBZ1QsSUFBaFQsRUFBc1QsSUFBdFQsRUFBNFQsSUFBNVQsRUFBa1UsTUFBbFUsRUFBMFUsUUFBMVUsRUFBb1YsUUFBcFYsRUFBOFYsSUFBOVYsRUFBb1csTUFBcFcsRUFBNFcsUUFBNVcsRUFBc1gsS0FBdFgsRUFBNlgsT0FBN1gsRUFBc1ksU0FBdFksRUFBaVosSUFBalosRUFBdVosTUFBdlosRUFBK1osU0FBL1osRUFBMGEs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LENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxRQUFRLEtBQVIsRUFBZSxxRUFBcUUsV0FBcEYsRUFBaUcsUUFBakcsRUFBMkcsV0FBM0csRUFBd0gsU0FBeEgsRUFBbUksSUFBbkksQ0FBeEMsR0FBbUwsU0FBbkw7QUFDRCxPQU5ELE1BTU87QUFDTCxnQkFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3QyxRQUFRLEtBQVIsRUFBZSxvRUFBb0UsZUFBbkYsRUFBb0csUUFBcEcsRUFBOEcsV0FBOUcsRUFBMkgsU0FBM0gsQ0FBeEMsR0FBZ0wsU0FBaEw7QUFDRDtBQUNGO0FBQ0YsR0E3REQ7O0FBK0RBLHFCQUFtQixzQkFBbkIsR0FBNEMsdUNBQXVDLEtBQUssTUFBTCxHQUFjLFFBQWQsQ0FBdUIsRUFBdkIsRUFBMkIsS0FBM0IsQ0FBaUMsQ0FBakMsQ0FBbkY7O0FBRUEscUJBQW1CLG1CQUFuQixHQUF5QyxtQkFBekM7OztBQUdBLHFCQUFtQixtQkFBbkIsR0FBeUMsVUFBVSxHQUFWLEVBQWUsWUFBZixFQUE2QjtBQUNwRSxtQkFBZSxnQkFBZ0IsaUJBQS9CO0FBQ0EsUUFBSSxhQUFhLGFBQWEsU0FBOUI7QUFDQSxRQUFJLFlBQVksY0FBYyxXQUFXLEdBQXpDO0FBQ0EsV0FBTyxxQkFBcUIsR0FBckIsRUFBMEIsU0FBMUIsS0FBd0MsQ0FBQywwQkFBMEIsR0FBMUIsRUFBK0IsWUFBL0IsQ0FBaEQ7QUFDRCxHQUxEO0FBTUQ7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLGtCQUFqQiIsImZpbGUiOiJ2YWxpZGF0ZURPTU5lc3RpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIHZhbGlkYXRlRE9NTmVzdGluZ1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4vT2JqZWN0LmFzc2lnbicpO1xudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcblxudmFyIHZhbGlkYXRlRE9NTmVzdGluZyA9IGVtcHR5RnVuY3Rpb247XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIC8vIFRoaXMgdmFsaWRhdGlvbiBjb2RlIHdhcyB3cml0dGVuIGJhc2VkIG9uIHRoZSBIVE1MNSBwYXJzaW5nIHNwZWM6XG4gIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI2hhcy1hbi1lbGVtZW50LWluLXNjb3BlXG4gIC8vXG4gIC8vIE5vdGU6IHRoaXMgZG9lcyBub3QgY2F0Y2ggYWxsIGludmFsaWQgbmVzdGluZywgbm9yIGRvZXMgaXQgdHJ5IHRvIChhcyBpdCdzXG4gIC8vIG5vdCBjbGVhciB3aGF0IHByYWN0aWNhbCBiZW5lZml0IGRvaW5nIHNvIHByb3ZpZGVzKTsgaW5zdGVhZCwgd2Ugd2FybiBvbmx5XG4gIC8vIGZvciBjYXNlcyB3aGVyZSB0aGUgcGFyc2VyIHdpbGwgZ2l2ZSBhIHBhcnNlIHRyZWUgZGlmZmVyaW5nIGZyb20gd2hhdCBSZWFjdFxuICAvLyBpbnRlbmRlZC4gRm9yIGV4YW1wbGUsIDxiPjxkaXY+PC9kaXY+PC9iPiBpcyBpbnZhbGlkIGJ1dCB3ZSBkb24ndCB3YXJuXG4gIC8vIGJlY2F1c2UgaXQgc3RpbGwgcGFyc2VzIGNvcnJlY3RseTsgd2UgZG8gd2FybiBmb3Igb3RoZXIgY2FzZXMgbGlrZSBuZXN0ZWRcbiAgLy8gPHA+IHRhZ3Mgd2hlcmUgdGhlIGJlZ2lubmluZyBvZiB0aGUgc2Vjb25kIGVsZW1lbnQgaW1wbGljaXRseSBjbG9zZXMgdGhlXG4gIC8vIGZpcnN0LCBjYXVzaW5nIGEgY29uZnVzaW5nIG1lc3MuXG5cbiAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjc3BlY2lhbFxuICB2YXIgc3BlY2lhbFRhZ3MgPSBbJ2FkZHJlc3MnLCAnYXBwbGV0JywgJ2FyZWEnLCAnYXJ0aWNsZScsICdhc2lkZScsICdiYXNlJywgJ2Jhc2Vmb250JywgJ2Jnc291bmQnLCAnYmxvY2txdW90ZScsICdib2R5JywgJ2JyJywgJ2J1dHRvbicsICdjYXB0aW9uJywgJ2NlbnRlcicsICdjb2wnLCAnY29sZ3JvdXAnLCAnZGQnLCAnZGV0YWlscycsICdkaXInLCAnZGl2JywgJ2RsJywgJ2R0JywgJ2VtYmVkJywgJ2ZpZWxkc2V0JywgJ2ZpZ2NhcHRpb24nLCAnZmlndXJlJywgJ2Zvb3RlcicsICdmb3JtJywgJ2ZyYW1lJywgJ2ZyYW1lc2V0JywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWQnLCAnaGVhZGVyJywgJ2hncm91cCcsICdocicsICdodG1sJywgJ2lmcmFtZScsICdpbWcnLCAnaW5wdXQnLCAnaXNpbmRleCcsICdsaScsICdsaW5rJywgJ2xpc3RpbmcnLCAnbWFpbicsICdtYXJxdWVlJywgJ21lbnUnLCAnbWVudWl0ZW0nLCAnbWV0YScsICduYXYnLCAnbm9lbWJlZCcsICdub2ZyYW1lcycsICdub3NjcmlwdCcsICdvYmplY3QnLCAnb2wnLCAncCcsICdwYXJhbScsICdwbGFpbnRleHQnLCAncHJlJywgJ3NjcmlwdCcsICdzZWN0aW9uJywgJ3NlbGVjdCcsICdzb3VyY2UnLCAnc3R5bGUnLCAnc3VtbWFyeScsICd0YWJsZScsICd0Ym9keScsICd0ZCcsICd0ZW1wbGF0ZScsICd0ZXh0YXJlYScsICd0Zm9vdCcsICd0aCcsICd0aGVhZCcsICd0aXRsZScsICd0cicsICd0cmFjaycsICd1bCcsICd3YnInLCAneG1wJ107XG5cbiAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjaGFzLWFuLWVsZW1lbnQtaW4tc2NvcGVcbiAgdmFyIGluU2NvcGVUYWdzID0gWydhcHBsZXQnLCAnY2FwdGlvbicsICdodG1sJywgJ3RhYmxlJywgJ3RkJywgJ3RoJywgJ21hcnF1ZWUnLCAnb2JqZWN0JywgJ3RlbXBsYXRlJyxcblxuICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNodG1sLWludGVncmF0aW9uLXBvaW50XG4gIC8vIFRPRE86IERpc3Rpbmd1aXNoIGJ5IG5hbWVzcGFjZSBoZXJlIC0tIGZvciA8dGl0bGU+LCBpbmNsdWRpbmcgaXQgaGVyZVxuICAvLyBlcnJzIG9uIHRoZSBzaWRlIG9mIGZld2VyIHdhcm5pbmdzXG4gICdmb3JlaWduT2JqZWN0JywgJ2Rlc2MnLCAndGl0bGUnXTtcblxuICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNoYXMtYW4tZWxlbWVudC1pbi1idXR0b24tc2NvcGVcbiAgdmFyIGJ1dHRvblNjb3BlVGFncyA9IGluU2NvcGVUYWdzLmNvbmNhdChbJ2J1dHRvbiddKTtcblxuICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNnZW5lcmF0ZS1pbXBsaWVkLWVuZC10YWdzXG4gIHZhciBpbXBsaWVkRW5kVGFncyA9IFsnZGQnLCAnZHQnLCAnbGknLCAnb3B0aW9uJywgJ29wdGdyb3VwJywgJ3AnLCAncnAnLCAncnQnXTtcblxuICB2YXIgZW1wdHlBbmNlc3RvckluZm8gPSB7XG4gICAgcGFyZW50VGFnOiBudWxsLFxuXG4gICAgZm9ybVRhZzogbnVsbCxcbiAgICBhVGFnSW5TY29wZTogbnVsbCxcbiAgICBidXR0b25UYWdJblNjb3BlOiBudWxsLFxuICAgIG5vYnJUYWdJblNjb3BlOiBudWxsLFxuICAgIHBUYWdJbkJ1dHRvblNjb3BlOiBudWxsLFxuXG4gICAgbGlzdEl0ZW1UYWdBdXRvY2xvc2luZzogbnVsbCxcbiAgICBkbEl0ZW1UYWdBdXRvY2xvc2luZzogbnVsbFxuICB9O1xuXG4gIHZhciB1cGRhdGVkQW5jZXN0b3JJbmZvID0gZnVuY3Rpb24gKG9sZEluZm8sIHRhZywgaW5zdGFuY2UpIHtcbiAgICB2YXIgYW5jZXN0b3JJbmZvID0gYXNzaWduKHt9LCBvbGRJbmZvIHx8IGVtcHR5QW5jZXN0b3JJbmZvKTtcbiAgICB2YXIgaW5mbyA9IHsgdGFnOiB0YWcsIGluc3RhbmNlOiBpbnN0YW5jZSB9O1xuXG4gICAgaWYgKGluU2NvcGVUYWdzLmluZGV4T2YodGFnKSAhPT0gLTEpIHtcbiAgICAgIGFuY2VzdG9ySW5mby5hVGFnSW5TY29wZSA9IG51bGw7XG4gICAgICBhbmNlc3RvckluZm8uYnV0dG9uVGFnSW5TY29wZSA9IG51bGw7XG4gICAgICBhbmNlc3RvckluZm8ubm9iclRhZ0luU2NvcGUgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoYnV0dG9uU2NvcGVUYWdzLmluZGV4T2YodGFnKSAhPT0gLTEpIHtcbiAgICAgIGFuY2VzdG9ySW5mby5wVGFnSW5CdXR0b25TY29wZSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU2VlIHJ1bGVzIGZvciAnbGknLCAnZGQnLCAnZHQnIHN0YXJ0IHRhZ3MgaW5cbiAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNwYXJzaW5nLW1haW4taW5ib2R5XG4gICAgaWYgKHNwZWNpYWxUYWdzLmluZGV4T2YodGFnKSAhPT0gLTEgJiYgdGFnICE9PSAnYWRkcmVzcycgJiYgdGFnICE9PSAnZGl2JyAmJiB0YWcgIT09ICdwJykge1xuICAgICAgYW5jZXN0b3JJbmZvLmxpc3RJdGVtVGFnQXV0b2Nsb3NpbmcgPSBudWxsO1xuICAgICAgYW5jZXN0b3JJbmZvLmRsSXRlbVRhZ0F1dG9jbG9zaW5nID0gbnVsbDtcbiAgICB9XG5cbiAgICBhbmNlc3RvckluZm8ucGFyZW50VGFnID0gaW5mbztcblxuICAgIGlmICh0YWcgPT09ICdmb3JtJykge1xuICAgICAgYW5jZXN0b3JJbmZvLmZvcm1UYWcgPSBpbmZvO1xuICAgIH1cbiAgICBpZiAodGFnID09PSAnYScpIHtcbiAgICAgIGFuY2VzdG9ySW5mby5hVGFnSW5TY29wZSA9IGluZm87XG4gICAgfVxuICAgIGlmICh0YWcgPT09ICdidXR0b24nKSB7XG4gICAgICBhbmNlc3RvckluZm8uYnV0dG9uVGFnSW5TY29wZSA9IGluZm87XG4gICAgfVxuICAgIGlmICh0YWcgPT09ICdub2JyJykge1xuICAgICAgYW5jZXN0b3JJbmZvLm5vYnJUYWdJblNjb3BlID0gaW5mbztcbiAgICB9XG4gICAgaWYgKHRhZyA9PT0gJ3AnKSB7XG4gICAgICBhbmNlc3RvckluZm8ucFRhZ0luQnV0dG9uU2NvcGUgPSBpbmZvO1xuICAgIH1cbiAgICBpZiAodGFnID09PSAnbGknKSB7XG4gICAgICBhbmNlc3RvckluZm8ubGlzdEl0ZW1UYWdBdXRvY2xvc2luZyA9IGluZm87XG4gICAgfVxuICAgIGlmICh0YWcgPT09ICdkZCcgfHwgdGFnID09PSAnZHQnKSB7XG4gICAgICBhbmNlc3RvckluZm8uZGxJdGVtVGFnQXV0b2Nsb3NpbmcgPSBpbmZvO1xuICAgIH1cblxuICAgIHJldHVybiBhbmNlc3RvckluZm87XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlclxuICAgKi9cbiAgdmFyIGlzVGFnVmFsaWRXaXRoUGFyZW50ID0gZnVuY3Rpb24gKHRhZywgcGFyZW50VGFnKSB7XG4gICAgLy8gRmlyc3QsIGxldCdzIGNoZWNrIGlmIHdlJ3JlIGluIGFuIHVudXN1YWwgcGFyc2luZyBtb2RlLi4uXG4gICAgc3dpdGNoIChwYXJlbnRUYWcpIHtcbiAgICAgIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI3BhcnNpbmctbWFpbi1pbnNlbGVjdFxuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgcmV0dXJuIHRhZyA9PT0gJ29wdGlvbicgfHwgdGFnID09PSAnb3B0Z3JvdXAnIHx8IHRhZyA9PT0gJyN0ZXh0JztcbiAgICAgIGNhc2UgJ29wdGdyb3VwJzpcbiAgICAgICAgcmV0dXJuIHRhZyA9PT0gJ29wdGlvbicgfHwgdGFnID09PSAnI3RleHQnO1xuICAgICAgLy8gU3RyaWN0bHkgc3BlYWtpbmcsIHNlZWluZyBhbiA8b3B0aW9uPiBkb2Vzbid0IG1lYW4gd2UncmUgaW4gYSA8c2VsZWN0PlxuICAgICAgLy8gYnV0XG4gICAgICBjYXNlICdvcHRpb24nOlxuICAgICAgICByZXR1cm4gdGFnID09PSAnI3RleHQnO1xuXG4gICAgICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNwYXJzaW5nLW1haW4taW50ZFxuICAgICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjcGFyc2luZy1tYWluLWluY2FwdGlvblxuICAgICAgLy8gTm8gc3BlY2lhbCBiZWhhdmlvciBzaW5jZSB0aGVzZSBydWxlcyBmYWxsIGJhY2sgdG8gXCJpbiBib2R5XCIgbW9kZSBmb3JcbiAgICAgIC8vIGFsbCBleGNlcHQgc3BlY2lhbCB0YWJsZSBub2RlcyB3aGljaCBjYXVzZSBiYWQgcGFyc2luZyBiZWhhdmlvciBhbnl3YXkuXG5cbiAgICAgIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI3BhcnNpbmctbWFpbi1pbnRyXG4gICAgICBjYXNlICd0cic6XG4gICAgICAgIHJldHVybiB0YWcgPT09ICd0aCcgfHwgdGFnID09PSAndGQnIHx8IHRhZyA9PT0gJ3N0eWxlJyB8fCB0YWcgPT09ICdzY3JpcHQnIHx8IHRhZyA9PT0gJ3RlbXBsYXRlJztcblxuICAgICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjcGFyc2luZy1tYWluLWludGJvZHlcbiAgICAgIGNhc2UgJ3Rib2R5JzpcbiAgICAgIGNhc2UgJ3RoZWFkJzpcbiAgICAgIGNhc2UgJ3Rmb290JzpcbiAgICAgICAgcmV0dXJuIHRhZyA9PT0gJ3RyJyB8fCB0YWcgPT09ICdzdHlsZScgfHwgdGFnID09PSAnc2NyaXB0JyB8fCB0YWcgPT09ICd0ZW1wbGF0ZSc7XG5cbiAgICAgIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI3BhcnNpbmctbWFpbi1pbmNvbGdyb3VwXG4gICAgICBjYXNlICdjb2xncm91cCc6XG4gICAgICAgIHJldHVybiB0YWcgPT09ICdjb2wnIHx8IHRhZyA9PT0gJ3RlbXBsYXRlJztcblxuICAgICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjcGFyc2luZy1tYWluLWludGFibGVcbiAgICAgIGNhc2UgJ3RhYmxlJzpcbiAgICAgICAgcmV0dXJuIHRhZyA9PT0gJ2NhcHRpb24nIHx8IHRhZyA9PT0gJ2NvbGdyb3VwJyB8fCB0YWcgPT09ICd0Ym9keScgfHwgdGFnID09PSAndGZvb3QnIHx8IHRhZyA9PT0gJ3RoZWFkJyB8fCB0YWcgPT09ICdzdHlsZScgfHwgdGFnID09PSAnc2NyaXB0JyB8fCB0YWcgPT09ICd0ZW1wbGF0ZSc7XG5cbiAgICAgIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI3BhcnNpbmctbWFpbi1pbmhlYWRcbiAgICAgIGNhc2UgJ2hlYWQnOlxuICAgICAgICByZXR1cm4gdGFnID09PSAnYmFzZScgfHwgdGFnID09PSAnYmFzZWZvbnQnIHx8IHRhZyA9PT0gJ2Jnc291bmQnIHx8IHRhZyA9PT0gJ2xpbmsnIHx8IHRhZyA9PT0gJ21ldGEnIHx8IHRhZyA9PT0gJ3RpdGxlJyB8fCB0YWcgPT09ICdub3NjcmlwdCcgfHwgdGFnID09PSAnbm9mcmFtZXMnIHx8IHRhZyA9PT0gJ3N0eWxlJyB8fCB0YWcgPT09ICdzY3JpcHQnIHx8IHRhZyA9PT0gJ3RlbXBsYXRlJztcblxuICAgICAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc2VtYW50aWNzLmh0bWwjdGhlLWh0bWwtZWxlbWVudFxuICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgIHJldHVybiB0YWcgPT09ICdoZWFkJyB8fCB0YWcgPT09ICdib2R5JztcbiAgICB9XG5cbiAgICAvLyBQcm9iYWJseSBpbiB0aGUgXCJpbiBib2R5XCIgcGFyc2luZyBtb2RlLCBzbyB3ZSBvdXRsYXcgb25seSB0YWcgY29tYm9zXG4gICAgLy8gd2hlcmUgdGhlIHBhcnNpbmcgcnVsZXMgY2F1c2UgaW1wbGljaXQgb3BlbnMgb3IgY2xvc2VzIHRvIGJlIGFkZGVkLlxuICAgIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI3BhcnNpbmctbWFpbi1pbmJvZHlcbiAgICBzd2l0Y2ggKHRhZykge1xuICAgICAgY2FzZSAnaDEnOlxuICAgICAgY2FzZSAnaDInOlxuICAgICAgY2FzZSAnaDMnOlxuICAgICAgY2FzZSAnaDQnOlxuICAgICAgY2FzZSAnaDUnOlxuICAgICAgY2FzZSAnaDYnOlxuICAgICAgICByZXR1cm4gcGFyZW50VGFnICE9PSAnaDEnICYmIHBhcmVudFRhZyAhPT0gJ2gyJyAmJiBwYXJlbnRUYWcgIT09ICdoMycgJiYgcGFyZW50VGFnICE9PSAnaDQnICYmIHBhcmVudFRhZyAhPT0gJ2g1JyAmJiBwYXJlbnRUYWcgIT09ICdoNic7XG5cbiAgICAgIGNhc2UgJ3JwJzpcbiAgICAgIGNhc2UgJ3J0JzpcbiAgICAgICAgcmV0dXJuIGltcGxpZWRFbmRUYWdzLmluZGV4T2YocGFyZW50VGFnKSA9PT0gLTE7XG5cbiAgICAgIGNhc2UgJ2NhcHRpb24nOlxuICAgICAgY2FzZSAnY29sJzpcbiAgICAgIGNhc2UgJ2NvbGdyb3VwJzpcbiAgICAgIGNhc2UgJ2ZyYW1lJzpcbiAgICAgIGNhc2UgJ2hlYWQnOlxuICAgICAgY2FzZSAndGJvZHknOlxuICAgICAgY2FzZSAndGQnOlxuICAgICAgY2FzZSAndGZvb3QnOlxuICAgICAgY2FzZSAndGgnOlxuICAgICAgY2FzZSAndGhlYWQnOlxuICAgICAgY2FzZSAndHInOlxuICAgICAgICAvLyBUaGVzZSB0YWdzIGFyZSBvbmx5IHZhbGlkIHdpdGggYSBmZXcgcGFyZW50cyB0aGF0IGhhdmUgc3BlY2lhbCBjaGlsZFxuICAgICAgICAvLyBwYXJzaW5nIHJ1bGVzIC0tIGlmIHdlJ3JlIGRvd24gaGVyZSwgdGhlbiBub25lIG9mIHRob3NlIG1hdGNoZWQgYW5kXG4gICAgICAgIC8vIHNvIHdlIGFsbG93IGl0IG9ubHkgaWYgd2UgZG9uJ3Qga25vdyB3aGF0IHRoZSBwYXJlbnQgaXMsIGFzIGFsbCBvdGhlclxuICAgICAgICAvLyBjYXNlcyBhcmUgaW52YWxpZC5cbiAgICAgICAgcmV0dXJuIHBhcmVudFRhZyA9PSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXJcbiAgICovXG4gIHZhciBmaW5kSW52YWxpZEFuY2VzdG9yRm9yVGFnID0gZnVuY3Rpb24gKHRhZywgYW5jZXN0b3JJbmZvKSB7XG4gICAgc3dpdGNoICh0YWcpIHtcbiAgICAgIGNhc2UgJ2FkZHJlc3MnOlxuICAgICAgY2FzZSAnYXJ0aWNsZSc6XG4gICAgICBjYXNlICdhc2lkZSc6XG4gICAgICBjYXNlICdibG9ja3F1b3RlJzpcbiAgICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICBjYXNlICdkZXRhaWxzJzpcbiAgICAgIGNhc2UgJ2RpYWxvZyc6XG4gICAgICBjYXNlICdkaXInOlxuICAgICAgY2FzZSAnZGl2JzpcbiAgICAgIGNhc2UgJ2RsJzpcbiAgICAgIGNhc2UgJ2ZpZWxkc2V0JzpcbiAgICAgIGNhc2UgJ2ZpZ2NhcHRpb24nOlxuICAgICAgY2FzZSAnZmlndXJlJzpcbiAgICAgIGNhc2UgJ2Zvb3Rlcic6XG4gICAgICBjYXNlICdoZWFkZXInOlxuICAgICAgY2FzZSAnaGdyb3VwJzpcbiAgICAgIGNhc2UgJ21haW4nOlxuICAgICAgY2FzZSAnbWVudSc6XG4gICAgICBjYXNlICduYXYnOlxuICAgICAgY2FzZSAnb2wnOlxuICAgICAgY2FzZSAncCc6XG4gICAgICBjYXNlICdzZWN0aW9uJzpcbiAgICAgIGNhc2UgJ3N1bW1hcnknOlxuICAgICAgY2FzZSAndWwnOlxuXG4gICAgICBjYXNlICdwcmUnOlxuICAgICAgY2FzZSAnbGlzdGluZyc6XG5cbiAgICAgIGNhc2UgJ3RhYmxlJzpcblxuICAgICAgY2FzZSAnaHInOlxuXG4gICAgICBjYXNlICd4bXAnOlxuXG4gICAgICBjYXNlICdoMSc6XG4gICAgICBjYXNlICdoMic6XG4gICAgICBjYXNlICdoMyc6XG4gICAgICBjYXNlICdoNCc6XG4gICAgICBjYXNlICdoNSc6XG4gICAgICBjYXNlICdoNic6XG4gICAgICAgIHJldHVybiBhbmNlc3RvckluZm8ucFRhZ0luQnV0dG9uU2NvcGU7XG5cbiAgICAgIGNhc2UgJ2Zvcm0nOlxuICAgICAgICByZXR1cm4gYW5jZXN0b3JJbmZvLmZvcm1UYWcgfHwgYW5jZXN0b3JJbmZvLnBUYWdJbkJ1dHRvblNjb3BlO1xuXG4gICAgICBjYXNlICdsaSc6XG4gICAgICAgIHJldHVybiBhbmNlc3RvckluZm8ubGlzdEl0ZW1UYWdBdXRvY2xvc2luZztcblxuICAgICAgY2FzZSAnZGQnOlxuICAgICAgY2FzZSAnZHQnOlxuICAgICAgICByZXR1cm4gYW5jZXN0b3JJbmZvLmRsSXRlbVRhZ0F1dG9jbG9zaW5nO1xuXG4gICAgICBjYXNlICdidXR0b24nOlxuICAgICAgICByZXR1cm4gYW5jZXN0b3JJbmZvLmJ1dHRvblRhZ0luU2NvcGU7XG5cbiAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAvLyBTcGVjIHNheXMgc29tZXRoaW5nIGFib3V0IHN0b3JpbmcgYSBsaXN0IG9mIG1hcmtlcnMsIGJ1dCBpdCBzb3VuZHNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byB0aGlzIGNoZWNrLlxuICAgICAgICByZXR1cm4gYW5jZXN0b3JJbmZvLmFUYWdJblNjb3BlO1xuXG4gICAgICBjYXNlICdub2JyJzpcbiAgICAgICAgcmV0dXJuIGFuY2VzdG9ySW5mby5ub2JyVGFnSW5TY29wZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICAvKipcbiAgICogR2l2ZW4gYSBSZWFjdENvbXBvc2l0ZUNvbXBvbmVudCBpbnN0YW5jZSwgcmV0dXJuIGEgbGlzdCBvZiBpdHMgcmVjdXJzaXZlXG4gICAqIG93bmVycywgc3RhcnRpbmcgYXQgdGhlIHJvb3QgYW5kIGVuZGluZyB3aXRoIHRoZSBpbnN0YW5jZSBpdHNlbGYuXG4gICAqL1xuICB2YXIgZmluZE93bmVyU3RhY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgdmFyIHN0YWNrID0gW107XG4gICAgLyplc2xpbnQtZGlzYWJsZSBzcGFjZS1hZnRlci1rZXl3b3JkcyAqL1xuICAgIGRvIHtcbiAgICAgIC8qZXNsaW50LWVuYWJsZSBzcGFjZS1hZnRlci1rZXl3b3JkcyAqL1xuICAgICAgc3RhY2sucHVzaChpbnN0YW5jZSk7XG4gICAgfSB3aGlsZSAoaW5zdGFuY2UgPSBpbnN0YW5jZS5fY3VycmVudEVsZW1lbnQuX293bmVyKTtcbiAgICBzdGFjay5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIHN0YWNrO1xuICB9O1xuXG4gIHZhciBkaWRXYXJuID0ge307XG5cbiAgdmFsaWRhdGVET01OZXN0aW5nID0gZnVuY3Rpb24gKGNoaWxkVGFnLCBjaGlsZEluc3RhbmNlLCBhbmNlc3RvckluZm8pIHtcbiAgICBhbmNlc3RvckluZm8gPSBhbmNlc3RvckluZm8gfHwgZW1wdHlBbmNlc3RvckluZm87XG4gICAgdmFyIHBhcmVudEluZm8gPSBhbmNlc3RvckluZm8ucGFyZW50VGFnO1xuICAgIHZhciBwYXJlbnRUYWcgPSBwYXJlbnRJbmZvICYmIHBhcmVudEluZm8udGFnO1xuXG4gICAgdmFyIGludmFsaWRQYXJlbnQgPSBpc1RhZ1ZhbGlkV2l0aFBhcmVudChjaGlsZFRhZywgcGFyZW50VGFnKSA/IG51bGwgOiBwYXJlbnRJbmZvO1xuICAgIHZhciBpbnZhbGlkQW5jZXN0b3IgPSBpbnZhbGlkUGFyZW50ID8gbnVsbCA6IGZpbmRJbnZhbGlkQW5jZXN0b3JGb3JUYWcoY2hpbGRUYWcsIGFuY2VzdG9ySW5mbyk7XG4gICAgdmFyIHByb2JsZW1hdGljID0gaW52YWxpZFBhcmVudCB8fCBpbnZhbGlkQW5jZXN0b3I7XG5cbiAgICBpZiAocHJvYmxlbWF0aWMpIHtcbiAgICAgIHZhciBhbmNlc3RvclRhZyA9IHByb2JsZW1hdGljLnRhZztcbiAgICAgIHZhciBhbmNlc3Rvckluc3RhbmNlID0gcHJvYmxlbWF0aWMuaW5zdGFuY2U7XG5cbiAgICAgIHZhciBjaGlsZE93bmVyID0gY2hpbGRJbnN0YW5jZSAmJiBjaGlsZEluc3RhbmNlLl9jdXJyZW50RWxlbWVudC5fb3duZXI7XG4gICAgICB2YXIgYW5jZXN0b3JPd25lciA9IGFuY2VzdG9ySW5zdGFuY2UgJiYgYW5jZXN0b3JJbnN0YW5jZS5fY3VycmVudEVsZW1lbnQuX293bmVyO1xuXG4gICAgICB2YXIgY2hpbGRPd25lcnMgPSBmaW5kT3duZXJTdGFjayhjaGlsZE93bmVyKTtcbiAgICAgIHZhciBhbmNlc3Rvck93bmVycyA9IGZpbmRPd25lclN0YWNrKGFuY2VzdG9yT3duZXIpO1xuXG4gICAgICB2YXIgbWluU3RhY2tMZW4gPSBNYXRoLm1pbihjaGlsZE93bmVycy5sZW5ndGgsIGFuY2VzdG9yT3duZXJzLmxlbmd0aCk7XG4gICAgICB2YXIgaTtcblxuICAgICAgdmFyIGRlZXBlc3RDb21tb24gPSAtMTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBtaW5TdGFja0xlbjsgaSsrKSB7XG4gICAgICAgIGlmIChjaGlsZE93bmVyc1tpXSA9PT0gYW5jZXN0b3JPd25lcnNbaV0pIHtcbiAgICAgICAgICBkZWVwZXN0Q29tbW9uID0gaTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgVU5LTk9XTiA9ICcodW5rbm93biknO1xuICAgICAgdmFyIGNoaWxkT3duZXJOYW1lcyA9IGNoaWxkT3duZXJzLnNsaWNlKGRlZXBlc3RDb21tb24gKyAxKS5tYXAoZnVuY3Rpb24gKGluc3QpIHtcbiAgICAgICAgcmV0dXJuIGluc3QuZ2V0TmFtZSgpIHx8IFVOS05PV047XG4gICAgICB9KTtcbiAgICAgIHZhciBhbmNlc3Rvck93bmVyTmFtZXMgPSBhbmNlc3Rvck93bmVycy5zbGljZShkZWVwZXN0Q29tbW9uICsgMSkubWFwKGZ1bmN0aW9uIChpbnN0KSB7XG4gICAgICAgIHJldHVybiBpbnN0LmdldE5hbWUoKSB8fCBVTktOT1dOO1xuICAgICAgfSk7XG4gICAgICB2YXIgb3duZXJJbmZvID0gW10uY29uY2F0KFxuICAgICAgLy8gSWYgdGhlIHBhcmVudCBhbmQgY2hpbGQgaW5zdGFuY2VzIGhhdmUgYSBjb21tb24gb3duZXIgYW5jZXN0b3IsIHN0YXJ0XG4gICAgICAvLyB3aXRoIHRoYXQgLS0gb3RoZXJ3aXNlIHdlIGp1c3Qgc3RhcnQgd2l0aCB0aGUgcGFyZW50J3Mgb3duZXJzLlxuICAgICAgZGVlcGVzdENvbW1vbiAhPT0gLTEgPyBjaGlsZE93bmVyc1tkZWVwZXN0Q29tbW9uXS5nZXROYW1lKCkgfHwgVU5LTk9XTiA6IFtdLCBhbmNlc3Rvck93bmVyTmFtZXMsIGFuY2VzdG9yVGFnLFxuICAgICAgLy8gSWYgd2UncmUgd2FybmluZyBhYm91dCBhbiBpbnZhbGlkIChub24tcGFyZW50KSBhbmNlc3RyeSwgYWRkICcuLi4nXG4gICAgICBpbnZhbGlkQW5jZXN0b3IgPyBbJy4uLiddIDogW10sIGNoaWxkT3duZXJOYW1lcywgY2hpbGRUYWcpLmpvaW4oJyA+ICcpO1xuXG4gICAgICB2YXIgd2FybktleSA9ICEhaW52YWxpZFBhcmVudCArICd8JyArIGNoaWxkVGFnICsgJ3wnICsgYW5jZXN0b3JUYWcgKyAnfCcgKyBvd25lckluZm87XG4gICAgICBpZiAoZGlkV2Fyblt3YXJuS2V5XSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBkaWRXYXJuW3dhcm5LZXldID0gdHJ1ZTtcblxuICAgICAgaWYgKGludmFsaWRQYXJlbnQpIHtcbiAgICAgICAgdmFyIGluZm8gPSAnJztcbiAgICAgICAgaWYgKGFuY2VzdG9yVGFnID09PSAndGFibGUnICYmIGNoaWxkVGFnID09PSAndHInKSB7XG4gICAgICAgICAgaW5mbyArPSAnIEFkZCBhIDx0Ym9keT4gdG8geW91ciBjb2RlIHRvIG1hdGNoIHRoZSBET00gdHJlZSBnZW5lcmF0ZWQgYnkgJyArICd0aGUgYnJvd3Nlci4nO1xuICAgICAgICB9XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAndmFsaWRhdGVET01OZXN0aW5nKC4uLik6IDwlcz4gY2Fubm90IGFwcGVhciBhcyBhIGNoaWxkIG9mIDwlcz4uICcgKyAnU2VlICVzLiVzJywgY2hpbGRUYWcsIGFuY2VzdG9yVGFnLCBvd25lckluZm8sIGluZm8pIDogdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICd2YWxpZGF0ZURPTU5lc3RpbmcoLi4uKTogPCVzPiBjYW5ub3QgYXBwZWFyIGFzIGEgZGVzY2VuZGFudCBvZiAnICsgJzwlcz4uIFNlZSAlcy4nLCBjaGlsZFRhZywgYW5jZXN0b3JUYWcsIG93bmVySW5mbykgOiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHZhbGlkYXRlRE9NTmVzdGluZy5hbmNlc3RvckluZm9Db250ZXh0S2V5ID0gJ19fdmFsaWRhdGVET01OZXN0aW5nX2FuY2VzdG9ySW5mbyQnICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMik7XG5cbiAgdmFsaWRhdGVET01OZXN0aW5nLnVwZGF0ZWRBbmNlc3RvckluZm8gPSB1cGRhdGVkQW5jZXN0b3JJbmZvO1xuXG4gIC8vIEZvciB0ZXN0aW5nXG4gIHZhbGlkYXRlRE9NTmVzdGluZy5pc1RhZ1ZhbGlkSW5Db250ZXh0ID0gZnVuY3Rpb24gKHRhZywgYW5jZXN0b3JJbmZvKSB7XG4gICAgYW5jZXN0b3JJbmZvID0gYW5jZXN0b3JJbmZvIHx8IGVtcHR5QW5jZXN0b3JJbmZvO1xuICAgIHZhciBwYXJlbnRJbmZvID0gYW5jZXN0b3JJbmZvLnBhcmVudFRhZztcbiAgICB2YXIgcGFyZW50VGFnID0gcGFyZW50SW5mbyAmJiBwYXJlbnRJbmZvLnRhZztcbiAgICByZXR1cm4gaXNUYWdWYWxpZFdpdGhQYXJlbnQodGFnLCBwYXJlbnRUYWcpICYmICFmaW5kSW52YWxpZEFuY2VzdG9yRm9yVGFnKHRhZywgYW5jZXN0b3JJbmZvKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2YWxpZGF0ZURPTU5lc3Rpbmc7Il19