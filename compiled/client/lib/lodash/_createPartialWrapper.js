'use strict';

var apply = require('./_apply'),
    createCtorWrapper = require('./_createCtorWrapper'),
    root = require('./_root');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1;

/**
 * Creates a function that wraps `func` to invoke it with the `this` binding
 * of `thisArg` and `partials` prepended to the arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
 *  for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to
 *  the new function.
 * @returns {Function} Returns the new wrapped function.
 */
function createPartialWrapper(func, bitmask, thisArg, partials) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtorWrapper(func);

  function wrapper() {
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(leftLength + argsLength),
        fn = this && this !== root && this instanceof wrapper ? Ctor : func;

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}

module.exports = createPartialWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVQYXJ0aWFsV3JhcHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksUUFBUSxRQUFRLFVBQVIsQ0FBWjtJQUNJLG9CQUFvQixRQUFRLHNCQUFSLENBRHhCO0lBRUksT0FBTyxRQUFRLFNBQVIsQ0FGWDs7O0FBS0EsSUFBSSxZQUFZLENBQWhCOzs7Ozs7Ozs7Ozs7Ozs7QUFlQSxTQUFTLG9CQUFULENBQThCLElBQTlCLEVBQW9DLE9BQXBDLEVBQTZDLE9BQTdDLEVBQXNELFFBQXRELEVBQWdFO0FBQzlELE1BQUksU0FBUyxVQUFVLFNBQXZCO01BQ0ksT0FBTyxrQkFBa0IsSUFBbEIsQ0FEWDs7QUFHQSxXQUFTLE9BQVQsR0FBbUI7QUFDakIsUUFBSSxZQUFZLENBQUMsQ0FBakI7UUFDSSxhQUFhLFVBQVUsTUFEM0I7UUFFSSxZQUFZLENBQUMsQ0FGakI7UUFHSSxhQUFhLFNBQVMsTUFIMUI7UUFJSSxPQUFPLE1BQU0sYUFBYSxVQUFuQixDQUpYO1FBS0ksS0FBTSxRQUFRLFNBQVMsSUFBakIsSUFBeUIsZ0JBQWdCLE9BQTFDLEdBQXFELElBQXJELEdBQTRELElBTHJFOztBQU9BLFdBQU8sRUFBRSxTQUFGLEdBQWMsVUFBckIsRUFBaUM7QUFDL0IsV0FBSyxTQUFMLElBQWtCLFNBQVMsU0FBVCxDQUFsQjtBQUNEO0FBQ0QsV0FBTyxZQUFQLEVBQXFCO0FBQ25CLFdBQUssV0FBTCxJQUFvQixVQUFVLEVBQUUsU0FBWixDQUFwQjtBQUNEO0FBQ0QsV0FBTyxNQUFNLEVBQU4sRUFBVSxTQUFTLE9BQVQsR0FBbUIsSUFBN0IsRUFBbUMsSUFBbkMsQ0FBUDtBQUNEO0FBQ0QsU0FBTyxPQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLG9CQUFqQiIsImZpbGUiOiJfY3JlYXRlUGFydGlhbFdyYXBwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpLFxuICAgIGNyZWF0ZUN0b3JXcmFwcGVyID0gcmVxdWlyZSgnLi9fY3JlYXRlQ3RvcldyYXBwZXInKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB3cmFwcGVyIG1ldGFkYXRhLiAqL1xudmFyIEJJTkRfRkxBRyA9IDE7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd3JhcHMgYGZ1bmNgIHRvIGludm9rZSBpdCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZ1xuICogb2YgYHRoaXNBcmdgIGFuZCBgcGFydGlhbHNgIHByZXBlbmRlZCB0byB0aGUgYXJndW1lbnRzIGl0IHJlY2VpdmVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2Ygd3JhcHBlciBmbGFncy4gU2VlIGBjcmVhdGVXcmFwcGVyYFxuICogIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhcnRpYWxzIFRoZSBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aG9zZSBwcm92aWRlZCB0b1xuICogIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB3cmFwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVQYXJ0aWFsV3JhcHBlcihmdW5jLCBiaXRtYXNrLCB0aGlzQXJnLCBwYXJ0aWFscykge1xuICB2YXIgaXNCaW5kID0gYml0bWFzayAmIEJJTkRfRkxBRyxcbiAgICAgIEN0b3IgPSBjcmVhdGVDdG9yV3JhcHBlcihmdW5jKTtcblxuICBmdW5jdGlvbiB3cmFwcGVyKCkge1xuICAgIHZhciBhcmdzSW5kZXggPSAtMSxcbiAgICAgICAgYXJnc0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIGxlZnRJbmRleCA9IC0xLFxuICAgICAgICBsZWZ0TGVuZ3RoID0gcGFydGlhbHMubGVuZ3RoLFxuICAgICAgICBhcmdzID0gQXJyYXkobGVmdExlbmd0aCArIGFyZ3NMZW5ndGgpLFxuICAgICAgICBmbiA9ICh0aGlzICYmIHRoaXMgIT09IHJvb3QgJiYgdGhpcyBpbnN0YW5jZW9mIHdyYXBwZXIpID8gQ3RvciA6IGZ1bmM7XG5cbiAgICB3aGlsZSAoKytsZWZ0SW5kZXggPCBsZWZ0TGVuZ3RoKSB7XG4gICAgICBhcmdzW2xlZnRJbmRleF0gPSBwYXJ0aWFsc1tsZWZ0SW5kZXhdO1xuICAgIH1cbiAgICB3aGlsZSAoYXJnc0xlbmd0aC0tKSB7XG4gICAgICBhcmdzW2xlZnRJbmRleCsrXSA9IGFyZ3VtZW50c1srK2FyZ3NJbmRleF07XG4gICAgfVxuICAgIHJldHVybiBhcHBseShmbiwgaXNCaW5kID8gdGhpc0FyZyA6IHRoaXMsIGFyZ3MpO1xuICB9XG4gIHJldHVybiB3cmFwcGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVBhcnRpYWxXcmFwcGVyO1xuIl19