/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getTestDocument
 */

'use strict';

function getTestDocument(markup) {
  document.open();
  document.write(markup || '<!doctype html><html><meta charset=utf-8><title>test doc</title>');
  document.close();
  return document;
}

module.exports = getTestDocument;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2dldFRlc3REb2N1bWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVdBOztBQUVBLFNBQVMsZUFBVCxDQUF5QixNQUF6QixFQUFpQztBQUMvQixXQUFTLElBQVQsR0FEK0I7QUFFL0IsV0FBUyxLQUFULENBQWUsVUFBVSxrRUFBVixDQUFmLENBRitCO0FBRy9CLFdBQVMsS0FBVCxHQUgrQjtBQUkvQixTQUFPLFFBQVAsQ0FKK0I7Q0FBakM7O0FBT0EsT0FBTyxPQUFQLEdBQWlCLGVBQWpCIiwiZmlsZSI6ImdldFRlc3REb2N1bWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBnZXRUZXN0RG9jdW1lbnRcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGdldFRlc3REb2N1bWVudChtYXJrdXApIHtcbiAgZG9jdW1lbnQub3BlbigpO1xuICBkb2N1bWVudC53cml0ZShtYXJrdXAgfHwgJzwhZG9jdHlwZSBodG1sPjxodG1sPjxtZXRhIGNoYXJzZXQ9dXRmLTg+PHRpdGxlPnRlc3QgZG9jPC90aXRsZT4nKTtcbiAgZG9jdW1lbnQuY2xvc2UoKTtcbiAgcmV0dXJuIGRvY3VtZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRlc3REb2N1bWVudDsiXX0=