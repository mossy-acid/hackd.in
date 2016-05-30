'use strict';

var composeArgs = require('./_composeArgs'),
    composeArgsRight = require('./_composeArgsRight'),
    countHolders = require('./_countHolders'),
    createCtorWrapper = require('./_createCtorWrapper'),
    createRecurryWrapper = require('./_createRecurryWrapper'),
    getHolder = require('./_getHolder'),
    reorder = require('./_reorder'),
    replaceHolders = require('./_replaceHolders'),
    root = require('./_root');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    ARY_FLAG = 128,
    FLIP_FLAG = 512;

/**
 * Creates a function that wraps `func` to invoke it with optional `this`
 * binding of `thisArg`, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
 *  for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided
 *  to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & ARY_FLAG,
      isBind = bitmask & BIND_FLAG,
      isBindKey = bitmask & BIND_KEY_FLAG,
      isCurried = bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG),
      isFlip = bitmask & FLIP_FLAG,
      Ctor = isBindKey ? undefined : createCtorWrapper(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length;

    while (index--) {
      args[index] = arguments[index];
    }
    if (isCurried) {
      var placeholder = getHolder(wrapper),
          holdersCount = countHolders(args, placeholder);
    }
    if (partials) {
      args = composeArgs(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      var newHolders = replaceHolders(args, placeholder);
      return createRecurryWrapper(func, bitmask, createHybridWrapper, wrapper.placeholder, thisArg, args, newHolders, argPos, ary, arity - length);
    }
    var thisBinding = isBind ? thisArg : this,
        fn = isBindKey ? thisBinding[func] : func;

    length = args.length;
    if (argPos) {
      args = reorder(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== root && this instanceof wrapper) {
      fn = Ctor || createCtorWrapper(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

module.exports = createHybridWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVIeWJyaWRXcmFwcGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7SUFDSSxtQkFBbUIsUUFBUSxxQkFBUixDQUR2QjtJQUVJLGVBQWUsUUFBUSxpQkFBUixDQUZuQjtJQUdJLG9CQUFvQixRQUFRLHNCQUFSLENBSHhCO0lBSUksdUJBQXVCLFFBQVEseUJBQVIsQ0FKM0I7SUFLSSxZQUFZLFFBQVEsY0FBUixDQUxoQjtJQU1JLFVBQVUsUUFBUSxZQUFSLENBTmQ7SUFPSSxpQkFBaUIsUUFBUSxtQkFBUixDQVByQjtJQVFJLE9BQU8sUUFBUSxTQUFSLENBUlg7OztBQVdBLElBQUksWUFBWSxDQUFoQjtJQUNJLGdCQUFnQixDQURwQjtJQUVJLGFBQWEsQ0FGakI7SUFHSSxtQkFBbUIsRUFIdkI7SUFJSSxXQUFXLEdBSmY7SUFLSSxZQUFZLEdBTGhCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBLFNBQVMsbUJBQVQsQ0FBNkIsSUFBN0IsRUFBbUMsT0FBbkMsRUFBNEMsT0FBNUMsRUFBcUQsUUFBckQsRUFBK0QsT0FBL0QsRUFBd0UsYUFBeEUsRUFBdUYsWUFBdkYsRUFBcUcsTUFBckcsRUFBNkcsR0FBN0csRUFBa0gsS0FBbEgsRUFBeUg7QUFDdkgsTUFBSSxRQUFRLFVBQVUsUUFBdEI7TUFDSSxTQUFTLFVBQVUsU0FEdkI7TUFFSSxZQUFZLFVBQVUsYUFGMUI7TUFHSSxZQUFZLFdBQVcsYUFBYSxnQkFBeEIsQ0FIaEI7TUFJSSxTQUFTLFVBQVUsU0FKdkI7TUFLSSxPQUFPLFlBQVksU0FBWixHQUF3QixrQkFBa0IsSUFBbEIsQ0FMbkM7O0FBT0EsV0FBUyxPQUFULEdBQW1CO0FBQ2pCLFFBQUksU0FBUyxVQUFVLE1BQXZCO1FBQ0ksT0FBTyxNQUFNLE1BQU4sQ0FEWDtRQUVJLFFBQVEsTUFGWjs7QUFJQSxXQUFPLE9BQVAsRUFBZ0I7QUFDZCxXQUFLLEtBQUwsSUFBYyxVQUFVLEtBQVYsQ0FBZDtBQUNEO0FBQ0QsUUFBSSxTQUFKLEVBQWU7QUFDYixVQUFJLGNBQWMsVUFBVSxPQUFWLENBQWxCO1VBQ0ksZUFBZSxhQUFhLElBQWIsRUFBbUIsV0FBbkIsQ0FEbkI7QUFFRDtBQUNELFFBQUksUUFBSixFQUFjO0FBQ1osYUFBTyxZQUFZLElBQVosRUFBa0IsUUFBbEIsRUFBNEIsT0FBNUIsRUFBcUMsU0FBckMsQ0FBUDtBQUNEO0FBQ0QsUUFBSSxhQUFKLEVBQW1CO0FBQ2pCLGFBQU8saUJBQWlCLElBQWpCLEVBQXVCLGFBQXZCLEVBQXNDLFlBQXRDLEVBQW9ELFNBQXBELENBQVA7QUFDRDtBQUNELGNBQVUsWUFBVjtBQUNBLFFBQUksYUFBYSxTQUFTLEtBQTFCLEVBQWlDO0FBQy9CLFVBQUksYUFBYSxlQUFlLElBQWYsRUFBcUIsV0FBckIsQ0FBakI7QUFDQSxhQUFPLHFCQUNMLElBREssRUFDQyxPQURELEVBQ1UsbUJBRFYsRUFDK0IsUUFBUSxXQUR2QyxFQUNvRCxPQURwRCxFQUVMLElBRkssRUFFQyxVQUZELEVBRWEsTUFGYixFQUVxQixHQUZyQixFQUUwQixRQUFRLE1BRmxDLENBQVA7QUFJRDtBQUNELFFBQUksY0FBYyxTQUFTLE9BQVQsR0FBbUIsSUFBckM7UUFDSSxLQUFLLFlBQVksWUFBWSxJQUFaLENBQVosR0FBZ0MsSUFEekM7O0FBR0EsYUFBUyxLQUFLLE1BQWQ7QUFDQSxRQUFJLE1BQUosRUFBWTtBQUNWLGFBQU8sUUFBUSxJQUFSLEVBQWMsTUFBZCxDQUFQO0FBQ0QsS0FGRCxNQUVPLElBQUksVUFBVSxTQUFTLENBQXZCLEVBQTBCO0FBQy9CLFdBQUssT0FBTDtBQUNEO0FBQ0QsUUFBSSxTQUFTLE1BQU0sTUFBbkIsRUFBMkI7QUFDekIsV0FBSyxNQUFMLEdBQWMsR0FBZDtBQUNEO0FBQ0QsUUFBSSxRQUFRLFNBQVMsSUFBakIsSUFBeUIsZ0JBQWdCLE9BQTdDLEVBQXNEO0FBQ3BELFdBQUssUUFBUSxrQkFBa0IsRUFBbEIsQ0FBYjtBQUNEO0FBQ0QsV0FBTyxHQUFHLEtBQUgsQ0FBUyxXQUFULEVBQXNCLElBQXRCLENBQVA7QUFDRDtBQUNELFNBQU8sT0FBUDtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixtQkFBakIiLCJmaWxlIjoiX2NyZWF0ZUh5YnJpZFdyYXBwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY29tcG9zZUFyZ3MgPSByZXF1aXJlKCcuL19jb21wb3NlQXJncycpLFxuICAgIGNvbXBvc2VBcmdzUmlnaHQgPSByZXF1aXJlKCcuL19jb21wb3NlQXJnc1JpZ2h0JyksXG4gICAgY291bnRIb2xkZXJzID0gcmVxdWlyZSgnLi9fY291bnRIb2xkZXJzJyksXG4gICAgY3JlYXRlQ3RvcldyYXBwZXIgPSByZXF1aXJlKCcuL19jcmVhdGVDdG9yV3JhcHBlcicpLFxuICAgIGNyZWF0ZVJlY3VycnlXcmFwcGVyID0gcmVxdWlyZSgnLi9fY3JlYXRlUmVjdXJyeVdyYXBwZXInKSxcbiAgICBnZXRIb2xkZXIgPSByZXF1aXJlKCcuL19nZXRIb2xkZXInKSxcbiAgICByZW9yZGVyID0gcmVxdWlyZSgnLi9fcmVvcmRlcicpLFxuICAgIHJlcGxhY2VIb2xkZXJzID0gcmVxdWlyZSgnLi9fcmVwbGFjZUhvbGRlcnMnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB3cmFwcGVyIG1ldGFkYXRhLiAqL1xudmFyIEJJTkRfRkxBRyA9IDEsXG4gICAgQklORF9LRVlfRkxBRyA9IDIsXG4gICAgQ1VSUllfRkxBRyA9IDgsXG4gICAgQ1VSUllfUklHSFRfRkxBRyA9IDE2LFxuICAgIEFSWV9GTEFHID0gMTI4LFxuICAgIEZMSVBfRkxBRyA9IDUxMjtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3cmFwcyBgZnVuY2AgdG8gaW52b2tlIGl0IHdpdGggb3B0aW9uYWwgYHRoaXNgXG4gKiBiaW5kaW5nIG9mIGB0aGlzQXJnYCwgcGFydGlhbCBhcHBsaWNhdGlvbiwgYW5kIGN1cnJ5aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gZnVuYyBUaGUgZnVuY3Rpb24gb3IgbWV0aG9kIG5hbWUgdG8gd3JhcC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIG9mIHdyYXBwZXIgZmxhZ3MuIFNlZSBgY3JlYXRlV3JhcHBlcmBcbiAqICBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7QXJyYXl9IFtwYXJ0aWFsc10gVGhlIGFyZ3VtZW50cyB0byBwcmVwZW5kIHRvIHRob3NlIHByb3ZpZGVkIHRvXG4gKiAgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7QXJyYXl9IFtob2xkZXJzXSBUaGUgYHBhcnRpYWxzYCBwbGFjZWhvbGRlciBpbmRleGVzLlxuICogQHBhcmFtIHtBcnJheX0gW3BhcnRpYWxzUmlnaHRdIFRoZSBhcmd1bWVudHMgdG8gYXBwZW5kIHRvIHRob3NlIHByb3ZpZGVkXG4gKiAgdG8gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7QXJyYXl9IFtob2xkZXJzUmlnaHRdIFRoZSBgcGFydGlhbHNSaWdodGAgcGxhY2Vob2xkZXIgaW5kZXhlcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcmdQb3NdIFRoZSBhcmd1bWVudCBwb3NpdGlvbnMgb2YgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJ5XSBUaGUgYXJpdHkgY2FwIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJpdHldIFRoZSBhcml0eSBvZiBgZnVuY2AuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB3cmFwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVIeWJyaWRXcmFwcGVyKGZ1bmMsIGJpdG1hc2ssIHRoaXNBcmcsIHBhcnRpYWxzLCBob2xkZXJzLCBwYXJ0aWFsc1JpZ2h0LCBob2xkZXJzUmlnaHQsIGFyZ1BvcywgYXJ5LCBhcml0eSkge1xuICB2YXIgaXNBcnkgPSBiaXRtYXNrICYgQVJZX0ZMQUcsXG4gICAgICBpc0JpbmQgPSBiaXRtYXNrICYgQklORF9GTEFHLFxuICAgICAgaXNCaW5kS2V5ID0gYml0bWFzayAmIEJJTkRfS0VZX0ZMQUcsXG4gICAgICBpc0N1cnJpZWQgPSBiaXRtYXNrICYgKENVUlJZX0ZMQUcgfCBDVVJSWV9SSUdIVF9GTEFHKSxcbiAgICAgIGlzRmxpcCA9IGJpdG1hc2sgJiBGTElQX0ZMQUcsXG4gICAgICBDdG9yID0gaXNCaW5kS2V5ID8gdW5kZWZpbmVkIDogY3JlYXRlQ3RvcldyYXBwZXIoZnVuYyk7XG5cbiAgZnVuY3Rpb24gd3JhcHBlcigpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgYXJncyA9IEFycmF5KGxlbmd0aCksXG4gICAgICAgIGluZGV4ID0gbGVuZ3RoO1xuXG4gICAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICAgIGFyZ3NbaW5kZXhdID0gYXJndW1lbnRzW2luZGV4XTtcbiAgICB9XG4gICAgaWYgKGlzQ3VycmllZCkge1xuICAgICAgdmFyIHBsYWNlaG9sZGVyID0gZ2V0SG9sZGVyKHdyYXBwZXIpLFxuICAgICAgICAgIGhvbGRlcnNDb3VudCA9IGNvdW50SG9sZGVycyhhcmdzLCBwbGFjZWhvbGRlcik7XG4gICAgfVxuICAgIGlmIChwYXJ0aWFscykge1xuICAgICAgYXJncyA9IGNvbXBvc2VBcmdzKGFyZ3MsIHBhcnRpYWxzLCBob2xkZXJzLCBpc0N1cnJpZWQpO1xuICAgIH1cbiAgICBpZiAocGFydGlhbHNSaWdodCkge1xuICAgICAgYXJncyA9IGNvbXBvc2VBcmdzUmlnaHQoYXJncywgcGFydGlhbHNSaWdodCwgaG9sZGVyc1JpZ2h0LCBpc0N1cnJpZWQpO1xuICAgIH1cbiAgICBsZW5ndGggLT0gaG9sZGVyc0NvdW50O1xuICAgIGlmIChpc0N1cnJpZWQgJiYgbGVuZ3RoIDwgYXJpdHkpIHtcbiAgICAgIHZhciBuZXdIb2xkZXJzID0gcmVwbGFjZUhvbGRlcnMoYXJncywgcGxhY2Vob2xkZXIpO1xuICAgICAgcmV0dXJuIGNyZWF0ZVJlY3VycnlXcmFwcGVyKFxuICAgICAgICBmdW5jLCBiaXRtYXNrLCBjcmVhdGVIeWJyaWRXcmFwcGVyLCB3cmFwcGVyLnBsYWNlaG9sZGVyLCB0aGlzQXJnLFxuICAgICAgICBhcmdzLCBuZXdIb2xkZXJzLCBhcmdQb3MsIGFyeSwgYXJpdHkgLSBsZW5ndGhcbiAgICAgICk7XG4gICAgfVxuICAgIHZhciB0aGlzQmluZGluZyA9IGlzQmluZCA/IHRoaXNBcmcgOiB0aGlzLFxuICAgICAgICBmbiA9IGlzQmluZEtleSA/IHRoaXNCaW5kaW5nW2Z1bmNdIDogZnVuYztcblxuICAgIGxlbmd0aCA9IGFyZ3MubGVuZ3RoO1xuICAgIGlmIChhcmdQb3MpIHtcbiAgICAgIGFyZ3MgPSByZW9yZGVyKGFyZ3MsIGFyZ1Bvcyk7XG4gICAgfSBlbHNlIGlmIChpc0ZsaXAgJiYgbGVuZ3RoID4gMSkge1xuICAgICAgYXJncy5yZXZlcnNlKCk7XG4gICAgfVxuICAgIGlmIChpc0FyeSAmJiBhcnkgPCBsZW5ndGgpIHtcbiAgICAgIGFyZ3MubGVuZ3RoID0gYXJ5O1xuICAgIH1cbiAgICBpZiAodGhpcyAmJiB0aGlzICE9PSByb290ICYmIHRoaXMgaW5zdGFuY2VvZiB3cmFwcGVyKSB7XG4gICAgICBmbiA9IEN0b3IgfHwgY3JlYXRlQ3RvcldyYXBwZXIoZm4pO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc0JpbmRpbmcsIGFyZ3MpO1xuICB9XG4gIHJldHVybiB3cmFwcGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUh5YnJpZFdyYXBwZXI7XG4iXX0=