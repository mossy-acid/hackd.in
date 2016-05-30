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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2lzVGV4dElucHV0RWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7QUFLQSxJQUFJLHNCQUFzQjtBQUN4QixXQUFTLElBQVQ7QUFDQSxVQUFRLElBQVI7QUFDQSxjQUFZLElBQVo7QUFDQSxvQkFBa0IsSUFBbEI7QUFDQSxXQUFTLElBQVQ7QUFDQSxXQUFTLElBQVQ7QUFDQSxZQUFVLElBQVY7QUFDQSxjQUFZLElBQVo7QUFDQSxXQUFTLElBQVQ7QUFDQSxZQUFVLElBQVY7QUFDQSxTQUFPLElBQVA7QUFDQSxVQUFRLElBQVI7QUFDQSxVQUFRLElBQVI7QUFDQSxTQUFPLElBQVA7QUFDQSxVQUFRLElBQVI7Q0FmRTs7QUFrQkosU0FBUyxrQkFBVCxDQUE0QixJQUE1QixFQUFrQztBQUNoQyxNQUFJLFdBQVcsUUFBUSxLQUFLLFFBQUwsSUFBaUIsS0FBSyxRQUFMLENBQWMsV0FBZCxFQUF6QixDQURpQjtBQUVoQyxTQUFPLGFBQWEsYUFBYSxPQUFiLElBQXdCLG9CQUFvQixLQUFLLElBQUwsQ0FBNUMsSUFBMEQsYUFBYSxVQUFiLENBQXZFLENBRnlCO0NBQWxDOztBQUtBLE9BQU8sT0FBUCxHQUFpQixrQkFBakIiLCJmaWxlIjoiaXNUZXh0SW5wdXRFbGVtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGlzVGV4dElucHV0RWxlbWVudFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAc2VlIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL3RoZS1pbnB1dC1lbGVtZW50Lmh0bWwjaW5wdXQtdHlwZS1hdHRyLXN1bW1hcnlcbiAqL1xudmFyIHN1cHBvcnRlZElucHV0VHlwZXMgPSB7XG4gICdjb2xvcic6IHRydWUsXG4gICdkYXRlJzogdHJ1ZSxcbiAgJ2RhdGV0aW1lJzogdHJ1ZSxcbiAgJ2RhdGV0aW1lLWxvY2FsJzogdHJ1ZSxcbiAgJ2VtYWlsJzogdHJ1ZSxcbiAgJ21vbnRoJzogdHJ1ZSxcbiAgJ251bWJlcic6IHRydWUsXG4gICdwYXNzd29yZCc6IHRydWUsXG4gICdyYW5nZSc6IHRydWUsXG4gICdzZWFyY2gnOiB0cnVlLFxuICAndGVsJzogdHJ1ZSxcbiAgJ3RleHQnOiB0cnVlLFxuICAndGltZSc6IHRydWUsXG4gICd1cmwnOiB0cnVlLFxuICAnd2Vlayc6IHRydWVcbn07XG5cbmZ1bmN0aW9uIGlzVGV4dElucHV0RWxlbWVudChlbGVtKSB7XG4gIHZhciBub2RlTmFtZSA9IGVsZW0gJiYgZWxlbS5ub2RlTmFtZSAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBub2RlTmFtZSAmJiAobm9kZU5hbWUgPT09ICdpbnB1dCcgJiYgc3VwcG9ydGVkSW5wdXRUeXBlc1tlbGVtLnR5cGVdIHx8IG5vZGVOYW1lID09PSAndGV4dGFyZWEnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1RleHRJbnB1dEVsZW1lbnQ7Il19