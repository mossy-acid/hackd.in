/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule adler32
 */

'use strict';

var MOD = 65521;

// adler32 is not cryptographically strong, and is only used to sanity check that
// markup generated on the server matches the markup generated on the client.
// This implementation (a modified version of the SheetJS version) has been optimized
// for our use case, at the expense of conforming to the adler32 specification
// for non-ascii inputs.
function adler32(data) {
  var a = 1;
  var b = 0;
  var i = 0;
  var l = data.length;
  var m = l & ~0x3;
  while (i < m) {
    for (; i < Math.min(i + 4096, m); i += 4) {
      b += (a += data.charCodeAt(i)) + (a += data.charCodeAt(i + 1)) + (a += data.charCodeAt(i + 2)) + (a += data.charCodeAt(i + 3));
    }
    a %= MOD;
    b %= MOD;
  }
  for (; i < l; i++) {
    b += a += data.charCodeAt(i);
  }
  a %= MOD;
  b %= MOD;
  return a | b << 16;
}

module.exports = adler32;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2FkbGVyMzIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLE1BQU0sS0FBTjs7Ozs7OztBQU9KLFNBQVMsT0FBVCxDQUFpQixJQUFqQixFQUF1QjtBQUNyQixNQUFJLElBQUksQ0FBSixDQURpQjtBQUVyQixNQUFJLElBQUksQ0FBSixDQUZpQjtBQUdyQixNQUFJLElBQUksQ0FBSixDQUhpQjtBQUlyQixNQUFJLElBQUksS0FBSyxNQUFMLENBSmE7QUFLckIsTUFBSSxJQUFJLElBQUksQ0FBQyxHQUFELENBTFM7QUFNckIsU0FBTyxJQUFJLENBQUosRUFBTztBQUNaLFdBQU8sSUFBSSxLQUFLLEdBQUwsQ0FBUyxJQUFJLElBQUosRUFBVSxDQUFuQixDQUFKLEVBQTJCLEtBQUssQ0FBTCxFQUFRO0FBQ3hDLFdBQUssQ0FBQyxLQUFLLEtBQUssVUFBTCxDQUFnQixDQUFoQixDQUFMLENBQUQsSUFBNkIsS0FBSyxLQUFLLFVBQUwsQ0FBZ0IsSUFBSSxDQUFKLENBQXJCLENBQTdCLElBQTZELEtBQUssS0FBSyxVQUFMLENBQWdCLElBQUksQ0FBSixDQUFyQixDQUE3RCxJQUE2RixLQUFLLEtBQUssVUFBTCxDQUFnQixJQUFJLENBQUosQ0FBckIsQ0FBN0YsQ0FEbUM7S0FBMUM7QUFHQSxTQUFLLEdBQUwsQ0FKWTtBQUtaLFNBQUssR0FBTCxDQUxZO0dBQWQ7QUFPQSxTQUFPLElBQUksQ0FBSixFQUFPLEdBQWQsRUFBbUI7QUFDakIsU0FBSyxLQUFLLEtBQUssVUFBTCxDQUFnQixDQUFoQixDQUFMLENBRFk7R0FBbkI7QUFHQSxPQUFLLEdBQUwsQ0FoQnFCO0FBaUJyQixPQUFLLEdBQUwsQ0FqQnFCO0FBa0JyQixTQUFPLElBQUksS0FBSyxFQUFMLENBbEJVO0NBQXZCOztBQXFCQSxPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoiYWRsZXIzMi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBhZGxlcjMyXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgTU9EID0gNjU1MjE7XG5cbi8vIGFkbGVyMzIgaXMgbm90IGNyeXB0b2dyYXBoaWNhbGx5IHN0cm9uZywgYW5kIGlzIG9ubHkgdXNlZCB0byBzYW5pdHkgY2hlY2sgdGhhdFxuLy8gbWFya3VwIGdlbmVyYXRlZCBvbiB0aGUgc2VydmVyIG1hdGNoZXMgdGhlIG1hcmt1cCBnZW5lcmF0ZWQgb24gdGhlIGNsaWVudC5cbi8vIFRoaXMgaW1wbGVtZW50YXRpb24gKGEgbW9kaWZpZWQgdmVyc2lvbiBvZiB0aGUgU2hlZXRKUyB2ZXJzaW9uKSBoYXMgYmVlbiBvcHRpbWl6ZWRcbi8vIGZvciBvdXIgdXNlIGNhc2UsIGF0IHRoZSBleHBlbnNlIG9mIGNvbmZvcm1pbmcgdG8gdGhlIGFkbGVyMzIgc3BlY2lmaWNhdGlvblxuLy8gZm9yIG5vbi1hc2NpaSBpbnB1dHMuXG5mdW5jdGlvbiBhZGxlcjMyKGRhdGEpIHtcbiAgdmFyIGEgPSAxO1xuICB2YXIgYiA9IDA7XG4gIHZhciBpID0gMDtcbiAgdmFyIGwgPSBkYXRhLmxlbmd0aDtcbiAgdmFyIG0gPSBsICYgfjB4MztcbiAgd2hpbGUgKGkgPCBtKSB7XG4gICAgZm9yICg7IGkgPCBNYXRoLm1pbihpICsgNDA5NiwgbSk7IGkgKz0gNCkge1xuICAgICAgYiArPSAoYSArPSBkYXRhLmNoYXJDb2RlQXQoaSkpICsgKGEgKz0gZGF0YS5jaGFyQ29kZUF0KGkgKyAxKSkgKyAoYSArPSBkYXRhLmNoYXJDb2RlQXQoaSArIDIpKSArIChhICs9IGRhdGEuY2hhckNvZGVBdChpICsgMykpO1xuICAgIH1cbiAgICBhICU9IE1PRDtcbiAgICBiICU9IE1PRDtcbiAgfVxuICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgIGIgKz0gYSArPSBkYXRhLmNoYXJDb2RlQXQoaSk7XG4gIH1cbiAgYSAlPSBNT0Q7XG4gIGIgJT0gTU9EO1xuICByZXR1cm4gYSB8IGIgPDwgMTY7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWRsZXIzMjsiXX0=