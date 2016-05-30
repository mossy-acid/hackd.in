/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isTextInputElement
 */

'use strict';

/**
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
 */

var supportedInputTypes = {
  'color': true,
  'date': true,
  'datetime': true,
  'datetime-local': true,
  'email': true,
  'month': true,
  'number': true,
  'password': true,
  'range': true,
  'search': true,
  'tel': true,
  'text': true,
  'time': true,
  'url': true,
  'week': true
};

function isTextInputElement(elem) {
  var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
  return nodeName && (nodeName === 'input' && supportedInputTypes[elem.type] || nodeName === 'textarea');
}

module.exports = isTextInputElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2lzVGV4dElucHV0RWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7QUFLQSxJQUFJLHNCQUFzQjtBQUN4QixXQUFTLElBRGU7QUFFeEIsVUFBUSxJQUZnQjtBQUd4QixjQUFZLElBSFk7QUFJeEIsb0JBQWtCLElBSk07QUFLeEIsV0FBUyxJQUxlO0FBTXhCLFdBQVMsSUFOZTtBQU94QixZQUFVLElBUGM7QUFReEIsY0FBWSxJQVJZO0FBU3hCLFdBQVMsSUFUZTtBQVV4QixZQUFVLElBVmM7QUFXeEIsU0FBTyxJQVhpQjtBQVl4QixVQUFRLElBWmdCO0FBYXhCLFVBQVEsSUFiZ0I7QUFjeEIsU0FBTyxJQWRpQjtBQWV4QixVQUFRO0FBZmdCLENBQTFCOztBQWtCQSxTQUFTLGtCQUFULENBQTRCLElBQTVCLEVBQWtDO0FBQ2hDLE1BQUksV0FBVyxRQUFRLEtBQUssUUFBYixJQUF5QixLQUFLLFFBQUwsQ0FBYyxXQUFkLEVBQXhDO0FBQ0EsU0FBTyxhQUFhLGFBQWEsT0FBYixJQUF3QixvQkFBb0IsS0FBSyxJQUF6QixDQUF4QixJQUEwRCxhQUFhLFVBQXBGLENBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsa0JBQWpCIiwiZmlsZSI6ImlzVGV4dElucHV0RWxlbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBpc1RleHRJbnB1dEVsZW1lbnRcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHNlZSBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS90aGUtaW5wdXQtZWxlbWVudC5odG1sI2lucHV0LXR5cGUtYXR0ci1zdW1tYXJ5XG4gKi9cbnZhciBzdXBwb3J0ZWRJbnB1dFR5cGVzID0ge1xuICAnY29sb3InOiB0cnVlLFxuICAnZGF0ZSc6IHRydWUsXG4gICdkYXRldGltZSc6IHRydWUsXG4gICdkYXRldGltZS1sb2NhbCc6IHRydWUsXG4gICdlbWFpbCc6IHRydWUsXG4gICdtb250aCc6IHRydWUsXG4gICdudW1iZXInOiB0cnVlLFxuICAncGFzc3dvcmQnOiB0cnVlLFxuICAncmFuZ2UnOiB0cnVlLFxuICAnc2VhcmNoJzogdHJ1ZSxcbiAgJ3RlbCc6IHRydWUsXG4gICd0ZXh0JzogdHJ1ZSxcbiAgJ3RpbWUnOiB0cnVlLFxuICAndXJsJzogdHJ1ZSxcbiAgJ3dlZWsnOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBpc1RleHRJbnB1dEVsZW1lbnQoZWxlbSkge1xuICB2YXIgbm9kZU5hbWUgPSBlbGVtICYmIGVsZW0ubm9kZU5hbWUgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gbm9kZU5hbWUgJiYgKG5vZGVOYW1lID09PSAnaW5wdXQnICYmIHN1cHBvcnRlZElucHV0VHlwZXNbZWxlbS50eXBlXSB8fCBub2RlTmFtZSA9PT0gJ3RleHRhcmVhJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNUZXh0SW5wdXRFbGVtZW50OyJdfQ==