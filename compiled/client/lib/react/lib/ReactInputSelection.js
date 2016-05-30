/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInputSelection
 */

'use strict';

var ReactDOMSelection = require('./ReactDOMSelection');

var containsNode = require('fbjs/lib/containsNode');
var focusNode = require('fbjs/lib/focusNode');
var getActiveElement = require('fbjs/lib/getActiveElement');

function isInDocument(node) {
  return containsNode(document.documentElement, node);
}

/**
 * @ReactInputSelection: React input selection module. Based on Selection.js,
 * but modified to be suitable for react and has a couple of bug fixes (doesn't
 * assume buttons have range selections allowed).
 * Input selection module for React.
 */
var ReactInputSelection = {

  hasSelectionCapabilities: function hasSelectionCapabilities(elem) {
    var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
    return nodeName && (nodeName === 'input' && elem.type === 'text' || nodeName === 'textarea' || elem.contentEditable === 'true');
  },

  getSelectionInformation: function getSelectionInformation() {
    var focusedElem = getActiveElement();
    return {
      focusedElem: focusedElem,
      selectionRange: ReactInputSelection.hasSelectionCapabilities(focusedElem) ? ReactInputSelection.getSelection(focusedElem) : null
    };
  },

  /**
   * @restoreSelection: If any selection information was potentially lost,
   * restore it. This is useful when performing operations that could remove dom
   * nodes and place them back in, resulting in focus being lost.
   */
  restoreSelection: function restoreSelection(priorSelectionInformation) {
    var curFocusedElem = getActiveElement();
    var priorFocusedElem = priorSelectionInformation.focusedElem;
    var priorSelectionRange = priorSelectionInformation.selectionRange;
    if (curFocusedElem !== priorFocusedElem && isInDocument(priorFocusedElem)) {
      if (ReactInputSelection.hasSelectionCapabilities(priorFocusedElem)) {
        ReactInputSelection.setSelection(priorFocusedElem, priorSelectionRange);
      }
      focusNode(priorFocusedElem);
    }
  },

  /**
   * @getSelection: Gets the selection bounds of a focused textarea, input or
   * contentEditable node.
   * -@input: Look up selection bounds of this input
   * -@return {start: selectionStart, end: selectionEnd}
   */
  getSelection: function getSelection(input) {
    var selection;

    if ('selectionStart' in input) {
      // Modern browser with input or textarea.
      selection = {
        start: input.selectionStart,
        end: input.selectionEnd
      };
    } else if (document.selection && input.nodeName && input.nodeName.toLowerCase() === 'input') {
      // IE8 input.
      var range = document.selection.createRange();
      // There can only be one selection per document in IE, so it must
      // be in our element.
      if (range.parentElement() === input) {
        selection = {
          start: -range.moveStart('character', -input.value.length),
          end: -range.moveEnd('character', -input.value.length)
        };
      }
    } else {
      // Content editable or old IE textarea.
      selection = ReactDOMSelection.getOffsets(input);
    }

    return selection || { start: 0, end: 0 };
  },

  /**
   * @setSelection: Sets the selection bounds of a textarea or input and focuses
   * the input.
   * -@input     Set selection bounds of this input or textarea
   * -@offsets   Object of same form that is returned from get*
   */
  setSelection: function setSelection(input, offsets) {
    var start = offsets.start;
    var end = offsets.end;
    if (typeof end === 'undefined') {
      end = start;
    }

    if ('selectionStart' in input) {
      input.selectionStart = start;
      input.selectionEnd = Math.min(end, input.value.length);
    } else if (document.selection && input.nodeName && input.nodeName.toLowerCase() === 'input') {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveStart('character', start);
      range.moveEnd('character', end - start);
      range.select();
    } else {
      ReactDOMSelection.setOffsets(input, offsets);
    }
  }
};

module.exports = ReactInputSelection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0SW5wdXRTZWxlY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLG9CQUFvQixRQUFRLHFCQUFSLENBQXBCOztBQUVKLElBQUksZUFBZSxRQUFRLHVCQUFSLENBQWY7QUFDSixJQUFJLFlBQVksUUFBUSxvQkFBUixDQUFaO0FBQ0osSUFBSSxtQkFBbUIsUUFBUSwyQkFBUixDQUFuQjs7QUFFSixTQUFTLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEI7QUFDMUIsU0FBTyxhQUFhLFNBQVMsZUFBVCxFQUEwQixJQUF2QyxDQUFQLENBRDBCO0NBQTVCOzs7Ozs7OztBQVVBLElBQUksc0JBQXNCOztBQUV4Qiw0QkFBMEIsa0NBQVUsSUFBVixFQUFnQjtBQUN4QyxRQUFJLFdBQVcsUUFBUSxLQUFLLFFBQUwsSUFBaUIsS0FBSyxRQUFMLENBQWMsV0FBZCxFQUF6QixDQUR5QjtBQUV4QyxXQUFPLGFBQWEsYUFBYSxPQUFiLElBQXdCLEtBQUssSUFBTCxLQUFjLE1BQWQsSUFBd0IsYUFBYSxVQUFiLElBQTJCLEtBQUssZUFBTCxLQUF5QixNQUF6QixDQUF4RixDQUZpQztHQUFoQjs7QUFLMUIsMkJBQXlCLG1DQUFZO0FBQ25DLFFBQUksY0FBYyxrQkFBZCxDQUQrQjtBQUVuQyxXQUFPO0FBQ0wsbUJBQWEsV0FBYjtBQUNBLHNCQUFnQixvQkFBb0Isd0JBQXBCLENBQTZDLFdBQTdDLElBQTRELG9CQUFvQixZQUFwQixDQUFpQyxXQUFqQyxDQUE1RCxHQUE0RyxJQUE1RztLQUZsQixDQUZtQztHQUFaOzs7Ozs7O0FBYXpCLG9CQUFrQiwwQkFBVSx5QkFBVixFQUFxQztBQUNyRCxRQUFJLGlCQUFpQixrQkFBakIsQ0FEaUQ7QUFFckQsUUFBSSxtQkFBbUIsMEJBQTBCLFdBQTFCLENBRjhCO0FBR3JELFFBQUksc0JBQXNCLDBCQUEwQixjQUExQixDQUgyQjtBQUlyRCxRQUFJLG1CQUFtQixnQkFBbkIsSUFBdUMsYUFBYSxnQkFBYixDQUF2QyxFQUF1RTtBQUN6RSxVQUFJLG9CQUFvQix3QkFBcEIsQ0FBNkMsZ0JBQTdDLENBQUosRUFBb0U7QUFDbEUsNEJBQW9CLFlBQXBCLENBQWlDLGdCQUFqQyxFQUFtRCxtQkFBbkQsRUFEa0U7T0FBcEU7QUFHQSxnQkFBVSxnQkFBVixFQUp5RTtLQUEzRTtHQUpnQjs7Ozs7Ozs7QUFrQmxCLGdCQUFjLHNCQUFVLEtBQVYsRUFBaUI7QUFDN0IsUUFBSSxTQUFKLENBRDZCOztBQUc3QixRQUFJLG9CQUFvQixLQUFwQixFQUEyQjs7QUFFN0Isa0JBQVk7QUFDVixlQUFPLE1BQU0sY0FBTjtBQUNQLGFBQUssTUFBTSxZQUFOO09BRlAsQ0FGNkI7S0FBL0IsTUFNTyxJQUFJLFNBQVMsU0FBVCxJQUF1QixNQUFNLFFBQU4sSUFBa0IsTUFBTSxRQUFOLENBQWUsV0FBZixPQUFpQyxPQUFqQyxFQUEyQzs7QUFFN0YsVUFBSSxRQUFRLFNBQVMsU0FBVCxDQUFtQixXQUFuQixFQUFSOzs7QUFGeUYsVUFLekYsTUFBTSxhQUFOLE9BQTBCLEtBQTFCLEVBQWlDO0FBQ25DLG9CQUFZO0FBQ1YsaUJBQU8sQ0FBQyxNQUFNLFNBQU4sQ0FBZ0IsV0FBaEIsRUFBNkIsQ0FBQyxNQUFNLEtBQU4sQ0FBWSxNQUFaLENBQS9CO0FBQ1AsZUFBSyxDQUFDLE1BQU0sT0FBTixDQUFjLFdBQWQsRUFBMkIsQ0FBQyxNQUFNLEtBQU4sQ0FBWSxNQUFaLENBQTdCO1NBRlAsQ0FEbUM7T0FBckM7S0FMSyxNQVdBOztBQUVMLGtCQUFZLGtCQUFrQixVQUFsQixDQUE2QixLQUE3QixDQUFaLENBRks7S0FYQTs7QUFnQlAsV0FBTyxhQUFhLEVBQUUsT0FBTyxDQUFQLEVBQVUsS0FBSyxDQUFMLEVBQXpCLENBekJzQjtHQUFqQjs7Ozs7Ozs7QUFrQ2QsZ0JBQWMsc0JBQVUsS0FBVixFQUFpQixPQUFqQixFQUEwQjtBQUN0QyxRQUFJLFFBQVEsUUFBUSxLQUFSLENBRDBCO0FBRXRDLFFBQUksTUFBTSxRQUFRLEdBQVIsQ0FGNEI7QUFHdEMsUUFBSSxPQUFPLEdBQVAsS0FBZSxXQUFmLEVBQTRCO0FBQzlCLFlBQU0sS0FBTixDQUQ4QjtLQUFoQzs7QUFJQSxRQUFJLG9CQUFvQixLQUFwQixFQUEyQjtBQUM3QixZQUFNLGNBQU4sR0FBdUIsS0FBdkIsQ0FENkI7QUFFN0IsWUFBTSxZQUFOLEdBQXFCLEtBQUssR0FBTCxDQUFTLEdBQVQsRUFBYyxNQUFNLEtBQU4sQ0FBWSxNQUFaLENBQW5DLENBRjZCO0tBQS9CLE1BR08sSUFBSSxTQUFTLFNBQVQsSUFBdUIsTUFBTSxRQUFOLElBQWtCLE1BQU0sUUFBTixDQUFlLFdBQWYsT0FBaUMsT0FBakMsRUFBMkM7QUFDN0YsVUFBSSxRQUFRLE1BQU0sZUFBTixFQUFSLENBRHlGO0FBRTdGLFlBQU0sUUFBTixDQUFlLElBQWYsRUFGNkY7QUFHN0YsWUFBTSxTQUFOLENBQWdCLFdBQWhCLEVBQTZCLEtBQTdCLEVBSDZGO0FBSTdGLFlBQU0sT0FBTixDQUFjLFdBQWQsRUFBMkIsTUFBTSxLQUFOLENBQTNCLENBSjZGO0FBSzdGLFlBQU0sTUFBTixHQUw2RjtLQUF4RixNQU1BO0FBQ0wsd0JBQWtCLFVBQWxCLENBQTZCLEtBQTdCLEVBQW9DLE9BQXBDLEVBREs7S0FOQTtHQVZLO0NBeEVaOztBQThGSixPQUFPLE9BQVAsR0FBaUIsbUJBQWpCIiwiZmlsZSI6IlJlYWN0SW5wdXRTZWxlY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RJbnB1dFNlbGVjdGlvblxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0RE9NU2VsZWN0aW9uID0gcmVxdWlyZSgnLi9SZWFjdERPTVNlbGVjdGlvbicpO1xuXG52YXIgY29udGFpbnNOb2RlID0gcmVxdWlyZSgnZmJqcy9saWIvY29udGFpbnNOb2RlJyk7XG52YXIgZm9jdXNOb2RlID0gcmVxdWlyZSgnZmJqcy9saWIvZm9jdXNOb2RlJyk7XG52YXIgZ2V0QWN0aXZlRWxlbWVudCA9IHJlcXVpcmUoJ2ZianMvbGliL2dldEFjdGl2ZUVsZW1lbnQnKTtcblxuZnVuY3Rpb24gaXNJbkRvY3VtZW50KG5vZGUpIHtcbiAgcmV0dXJuIGNvbnRhaW5zTm9kZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIG5vZGUpO1xufVxuXG4vKipcbiAqIEBSZWFjdElucHV0U2VsZWN0aW9uOiBSZWFjdCBpbnB1dCBzZWxlY3Rpb24gbW9kdWxlLiBCYXNlZCBvbiBTZWxlY3Rpb24uanMsXG4gKiBidXQgbW9kaWZpZWQgdG8gYmUgc3VpdGFibGUgZm9yIHJlYWN0IGFuZCBoYXMgYSBjb3VwbGUgb2YgYnVnIGZpeGVzIChkb2Vzbid0XG4gKiBhc3N1bWUgYnV0dG9ucyBoYXZlIHJhbmdlIHNlbGVjdGlvbnMgYWxsb3dlZCkuXG4gKiBJbnB1dCBzZWxlY3Rpb24gbW9kdWxlIGZvciBSZWFjdC5cbiAqL1xudmFyIFJlYWN0SW5wdXRTZWxlY3Rpb24gPSB7XG5cbiAgaGFzU2VsZWN0aW9uQ2FwYWJpbGl0aWVzOiBmdW5jdGlvbiAoZWxlbSkge1xuICAgIHZhciBub2RlTmFtZSA9IGVsZW0gJiYgZWxlbS5ub2RlTmFtZSAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIG5vZGVOYW1lICYmIChub2RlTmFtZSA9PT0gJ2lucHV0JyAmJiBlbGVtLnR5cGUgPT09ICd0ZXh0JyB8fCBub2RlTmFtZSA9PT0gJ3RleHRhcmVhJyB8fCBlbGVtLmNvbnRlbnRFZGl0YWJsZSA9PT0gJ3RydWUnKTtcbiAgfSxcblxuICBnZXRTZWxlY3Rpb25JbmZvcm1hdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBmb2N1c2VkRWxlbSA9IGdldEFjdGl2ZUVsZW1lbnQoKTtcbiAgICByZXR1cm4ge1xuICAgICAgZm9jdXNlZEVsZW06IGZvY3VzZWRFbGVtLFxuICAgICAgc2VsZWN0aW9uUmFuZ2U6IFJlYWN0SW5wdXRTZWxlY3Rpb24uaGFzU2VsZWN0aW9uQ2FwYWJpbGl0aWVzKGZvY3VzZWRFbGVtKSA/IFJlYWN0SW5wdXRTZWxlY3Rpb24uZ2V0U2VsZWN0aW9uKGZvY3VzZWRFbGVtKSA6IG51bGxcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcmVzdG9yZVNlbGVjdGlvbjogSWYgYW55IHNlbGVjdGlvbiBpbmZvcm1hdGlvbiB3YXMgcG90ZW50aWFsbHkgbG9zdCxcbiAgICogcmVzdG9yZSBpdC4gVGhpcyBpcyB1c2VmdWwgd2hlbiBwZXJmb3JtaW5nIG9wZXJhdGlvbnMgdGhhdCBjb3VsZCByZW1vdmUgZG9tXG4gICAqIG5vZGVzIGFuZCBwbGFjZSB0aGVtIGJhY2sgaW4sIHJlc3VsdGluZyBpbiBmb2N1cyBiZWluZyBsb3N0LlxuICAgKi9cbiAgcmVzdG9yZVNlbGVjdGlvbjogZnVuY3Rpb24gKHByaW9yU2VsZWN0aW9uSW5mb3JtYXRpb24pIHtcbiAgICB2YXIgY3VyRm9jdXNlZEVsZW0gPSBnZXRBY3RpdmVFbGVtZW50KCk7XG4gICAgdmFyIHByaW9yRm9jdXNlZEVsZW0gPSBwcmlvclNlbGVjdGlvbkluZm9ybWF0aW9uLmZvY3VzZWRFbGVtO1xuICAgIHZhciBwcmlvclNlbGVjdGlvblJhbmdlID0gcHJpb3JTZWxlY3Rpb25JbmZvcm1hdGlvbi5zZWxlY3Rpb25SYW5nZTtcbiAgICBpZiAoY3VyRm9jdXNlZEVsZW0gIT09IHByaW9yRm9jdXNlZEVsZW0gJiYgaXNJbkRvY3VtZW50KHByaW9yRm9jdXNlZEVsZW0pKSB7XG4gICAgICBpZiAoUmVhY3RJbnB1dFNlbGVjdGlvbi5oYXNTZWxlY3Rpb25DYXBhYmlsaXRpZXMocHJpb3JGb2N1c2VkRWxlbSkpIHtcbiAgICAgICAgUmVhY3RJbnB1dFNlbGVjdGlvbi5zZXRTZWxlY3Rpb24ocHJpb3JGb2N1c2VkRWxlbSwgcHJpb3JTZWxlY3Rpb25SYW5nZSk7XG4gICAgICB9XG4gICAgICBmb2N1c05vZGUocHJpb3JGb2N1c2VkRWxlbSk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBAZ2V0U2VsZWN0aW9uOiBHZXRzIHRoZSBzZWxlY3Rpb24gYm91bmRzIG9mIGEgZm9jdXNlZCB0ZXh0YXJlYSwgaW5wdXQgb3JcbiAgICogY29udGVudEVkaXRhYmxlIG5vZGUuXG4gICAqIC1AaW5wdXQ6IExvb2sgdXAgc2VsZWN0aW9uIGJvdW5kcyBvZiB0aGlzIGlucHV0XG4gICAqIC1AcmV0dXJuIHtzdGFydDogc2VsZWN0aW9uU3RhcnQsIGVuZDogc2VsZWN0aW9uRW5kfVxuICAgKi9cbiAgZ2V0U2VsZWN0aW9uOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICB2YXIgc2VsZWN0aW9uO1xuXG4gICAgaWYgKCdzZWxlY3Rpb25TdGFydCcgaW4gaW5wdXQpIHtcbiAgICAgIC8vIE1vZGVybiBicm93c2VyIHdpdGggaW5wdXQgb3IgdGV4dGFyZWEuXG4gICAgICBzZWxlY3Rpb24gPSB7XG4gICAgICAgIHN0YXJ0OiBpbnB1dC5zZWxlY3Rpb25TdGFydCxcbiAgICAgICAgZW5kOiBpbnB1dC5zZWxlY3Rpb25FbmRcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChkb2N1bWVudC5zZWxlY3Rpb24gJiYgKGlucHV0Lm5vZGVOYW1lICYmIGlucHV0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpbnB1dCcpKSB7XG4gICAgICAvLyBJRTggaW5wdXQuXG4gICAgICB2YXIgcmFuZ2UgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcbiAgICAgIC8vIFRoZXJlIGNhbiBvbmx5IGJlIG9uZSBzZWxlY3Rpb24gcGVyIGRvY3VtZW50IGluIElFLCBzbyBpdCBtdXN0XG4gICAgICAvLyBiZSBpbiBvdXIgZWxlbWVudC5cbiAgICAgIGlmIChyYW5nZS5wYXJlbnRFbGVtZW50KCkgPT09IGlucHV0KSB7XG4gICAgICAgIHNlbGVjdGlvbiA9IHtcbiAgICAgICAgICBzdGFydDogLXJhbmdlLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgLWlucHV0LnZhbHVlLmxlbmd0aCksXG4gICAgICAgICAgZW5kOiAtcmFuZ2UubW92ZUVuZCgnY2hhcmFjdGVyJywgLWlucHV0LnZhbHVlLmxlbmd0aClcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ29udGVudCBlZGl0YWJsZSBvciBvbGQgSUUgdGV4dGFyZWEuXG4gICAgICBzZWxlY3Rpb24gPSBSZWFjdERPTVNlbGVjdGlvbi5nZXRPZmZzZXRzKGlucHV0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZWN0aW9uIHx8IHsgc3RhcnQ6IDAsIGVuZDogMCB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBAc2V0U2VsZWN0aW9uOiBTZXRzIHRoZSBzZWxlY3Rpb24gYm91bmRzIG9mIGEgdGV4dGFyZWEgb3IgaW5wdXQgYW5kIGZvY3VzZXNcbiAgICogdGhlIGlucHV0LlxuICAgKiAtQGlucHV0ICAgICBTZXQgc2VsZWN0aW9uIGJvdW5kcyBvZiB0aGlzIGlucHV0IG9yIHRleHRhcmVhXG4gICAqIC1Ab2Zmc2V0cyAgIE9iamVjdCBvZiBzYW1lIGZvcm0gdGhhdCBpcyByZXR1cm5lZCBmcm9tIGdldCpcbiAgICovXG4gIHNldFNlbGVjdGlvbjogZnVuY3Rpb24gKGlucHV0LCBvZmZzZXRzKSB7XG4gICAgdmFyIHN0YXJ0ID0gb2Zmc2V0cy5zdGFydDtcbiAgICB2YXIgZW5kID0gb2Zmc2V0cy5lbmQ7XG4gICAgaWYgKHR5cGVvZiBlbmQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBlbmQgPSBzdGFydDtcbiAgICB9XG5cbiAgICBpZiAoJ3NlbGVjdGlvblN0YXJ0JyBpbiBpbnB1dCkge1xuICAgICAgaW5wdXQuc2VsZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICAgIGlucHV0LnNlbGVjdGlvbkVuZCA9IE1hdGgubWluKGVuZCwgaW5wdXQudmFsdWUubGVuZ3RoKTtcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50LnNlbGVjdGlvbiAmJiAoaW5wdXQubm9kZU5hbWUgJiYgaW5wdXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2lucHV0JykpIHtcbiAgICAgIHZhciByYW5nZSA9IGlucHV0LmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgcmFuZ2UuY29sbGFwc2UodHJ1ZSk7XG4gICAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIHN0YXJ0KTtcbiAgICAgIHJhbmdlLm1vdmVFbmQoJ2NoYXJhY3RlcicsIGVuZCAtIHN0YXJ0KTtcbiAgICAgIHJhbmdlLnNlbGVjdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBSZWFjdERPTVNlbGVjdGlvbi5zZXRPZmZzZXRzKGlucHV0LCBvZmZzZXRzKTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RJbnB1dFNlbGVjdGlvbjsiXX0=