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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVIeWJyaWRXcmFwcGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBZDtJQUNBLG1CQUFtQixRQUFRLHFCQUFSLENBQW5CO0lBQ0EsZUFBZSxRQUFRLGlCQUFSLENBQWY7SUFDQSxvQkFBb0IsUUFBUSxzQkFBUixDQUFwQjtJQUNBLHVCQUF1QixRQUFRLHlCQUFSLENBQXZCO0lBQ0EsWUFBWSxRQUFRLGNBQVIsQ0FBWjtJQUNBLFVBQVUsUUFBUSxZQUFSLENBQVY7SUFDQSxpQkFBaUIsUUFBUSxtQkFBUixDQUFqQjtJQUNBLE9BQU8sUUFBUSxTQUFSLENBQVA7OztBQUdKLElBQUksWUFBWSxDQUFaO0lBQ0EsZ0JBQWdCLENBQWhCO0lBQ0EsYUFBYSxDQUFiO0lBQ0EsbUJBQW1CLEVBQW5CO0lBQ0EsV0FBVyxHQUFYO0lBQ0EsWUFBWSxHQUFaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JKLFNBQVMsbUJBQVQsQ0FBNkIsSUFBN0IsRUFBbUMsT0FBbkMsRUFBNEMsT0FBNUMsRUFBcUQsUUFBckQsRUFBK0QsT0FBL0QsRUFBd0UsYUFBeEUsRUFBdUYsWUFBdkYsRUFBcUcsTUFBckcsRUFBNkcsR0FBN0csRUFBa0gsS0FBbEgsRUFBeUg7QUFDdkgsTUFBSSxRQUFRLFVBQVUsUUFBVjtNQUNSLFNBQVMsVUFBVSxTQUFWO01BQ1QsWUFBWSxVQUFVLGFBQVY7TUFDWixZQUFZLFdBQVcsYUFBYSxnQkFBYixDQUFYO01BQ1osU0FBUyxVQUFVLFNBQVY7TUFDVCxPQUFPLFlBQVksU0FBWixHQUF3QixrQkFBa0IsSUFBbEIsQ0FBeEIsQ0FONEc7O0FBUXZILFdBQVMsT0FBVCxHQUFtQjtBQUNqQixRQUFJLFNBQVMsVUFBVSxNQUFWO1FBQ1QsT0FBTyxNQUFNLE1BQU4sQ0FBUDtRQUNBLFFBQVEsTUFBUixDQUhhOztBQUtqQixXQUFPLE9BQVAsRUFBZ0I7QUFDZCxXQUFLLEtBQUwsSUFBYyxVQUFVLEtBQVYsQ0FBZCxDQURjO0tBQWhCO0FBR0EsUUFBSSxTQUFKLEVBQWU7QUFDYixVQUFJLGNBQWMsVUFBVSxPQUFWLENBQWQ7VUFDQSxlQUFlLGFBQWEsSUFBYixFQUFtQixXQUFuQixDQUFmLENBRlM7S0FBZjtBQUlBLFFBQUksUUFBSixFQUFjO0FBQ1osYUFBTyxZQUFZLElBQVosRUFBa0IsUUFBbEIsRUFBNEIsT0FBNUIsRUFBcUMsU0FBckMsQ0FBUCxDQURZO0tBQWQ7QUFHQSxRQUFJLGFBQUosRUFBbUI7QUFDakIsYUFBTyxpQkFBaUIsSUFBakIsRUFBdUIsYUFBdkIsRUFBc0MsWUFBdEMsRUFBb0QsU0FBcEQsQ0FBUCxDQURpQjtLQUFuQjtBQUdBLGNBQVUsWUFBVixDQWxCaUI7QUFtQmpCLFFBQUksYUFBYSxTQUFTLEtBQVQsRUFBZ0I7QUFDL0IsVUFBSSxhQUFhLGVBQWUsSUFBZixFQUFxQixXQUFyQixDQUFiLENBRDJCO0FBRS9CLGFBQU8scUJBQ0wsSUFESyxFQUNDLE9BREQsRUFDVSxtQkFEVixFQUMrQixRQUFRLFdBQVIsRUFBcUIsT0FEcEQsRUFFTCxJQUZLLEVBRUMsVUFGRCxFQUVhLE1BRmIsRUFFcUIsR0FGckIsRUFFMEIsUUFBUSxNQUFSLENBRmpDLENBRitCO0tBQWpDO0FBT0EsUUFBSSxjQUFjLFNBQVMsT0FBVCxHQUFtQixJQUFuQjtRQUNkLEtBQUssWUFBWSxZQUFZLElBQVosQ0FBWixHQUFnQyxJQUFoQyxDQTNCUTs7QUE2QmpCLGFBQVMsS0FBSyxNQUFMLENBN0JRO0FBOEJqQixRQUFJLE1BQUosRUFBWTtBQUNWLGFBQU8sUUFBUSxJQUFSLEVBQWMsTUFBZCxDQUFQLENBRFU7S0FBWixNQUVPLElBQUksVUFBVSxTQUFTLENBQVQsRUFBWTtBQUMvQixXQUFLLE9BQUwsR0FEK0I7S0FBMUI7QUFHUCxRQUFJLFNBQVMsTUFBTSxNQUFOLEVBQWM7QUFDekIsV0FBSyxNQUFMLEdBQWMsR0FBZCxDQUR5QjtLQUEzQjtBQUdBLFFBQUksUUFBUSxTQUFTLElBQVQsSUFBaUIsZ0JBQWdCLE9BQWhCLEVBQXlCO0FBQ3BELFdBQUssUUFBUSxrQkFBa0IsRUFBbEIsQ0FBUixDQUQrQztLQUF0RDtBQUdBLFdBQU8sR0FBRyxLQUFILENBQVMsV0FBVCxFQUFzQixJQUF0QixDQUFQLENBekNpQjtHQUFuQjtBQTJDQSxTQUFPLE9BQVAsQ0FuRHVIO0NBQXpIOztBQXNEQSxPQUFPLE9BQVAsR0FBaUIsbUJBQWpCIiwiZmlsZSI6Il9jcmVhdGVIeWJyaWRXcmFwcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNvbXBvc2VBcmdzID0gcmVxdWlyZSgnLi9fY29tcG9zZUFyZ3MnKSxcbiAgICBjb21wb3NlQXJnc1JpZ2h0ID0gcmVxdWlyZSgnLi9fY29tcG9zZUFyZ3NSaWdodCcpLFxuICAgIGNvdW50SG9sZGVycyA9IHJlcXVpcmUoJy4vX2NvdW50SG9sZGVycycpLFxuICAgIGNyZWF0ZUN0b3JXcmFwcGVyID0gcmVxdWlyZSgnLi9fY3JlYXRlQ3RvcldyYXBwZXInKSxcbiAgICBjcmVhdGVSZWN1cnJ5V3JhcHBlciA9IHJlcXVpcmUoJy4vX2NyZWF0ZVJlY3VycnlXcmFwcGVyJyksXG4gICAgZ2V0SG9sZGVyID0gcmVxdWlyZSgnLi9fZ2V0SG9sZGVyJyksXG4gICAgcmVvcmRlciA9IHJlcXVpcmUoJy4vX3Jlb3JkZXInKSxcbiAgICByZXBsYWNlSG9sZGVycyA9IHJlcXVpcmUoJy4vX3JlcGxhY2VIb2xkZXJzJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3Igd3JhcHBlciBtZXRhZGF0YS4gKi9cbnZhciBCSU5EX0ZMQUcgPSAxLFxuICAgIEJJTkRfS0VZX0ZMQUcgPSAyLFxuICAgIENVUlJZX0ZMQUcgPSA4LFxuICAgIENVUlJZX1JJR0hUX0ZMQUcgPSAxNixcbiAgICBBUllfRkxBRyA9IDEyOCxcbiAgICBGTElQX0ZMQUcgPSA1MTI7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd3JhcHMgYGZ1bmNgIHRvIGludm9rZSBpdCB3aXRoIG9wdGlvbmFsIGB0aGlzYFxuICogYmluZGluZyBvZiBgdGhpc0FyZ2AsIHBhcnRpYWwgYXBwbGljYXRpb24sIGFuZCBjdXJyeWluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IGZ1bmMgVGhlIGZ1bmN0aW9uIG9yIG1ldGhvZCBuYW1lIHRvIHdyYXAuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBvZiB3cmFwcGVyIGZsYWdzLiBTZWUgYGNyZWF0ZVdyYXBwZXJgXG4gKiAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBbcGFydGlhbHNdIFRoZSBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aG9zZSBwcm92aWRlZCB0b1xuICogIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge0FycmF5fSBbaG9sZGVyc10gVGhlIGBwYXJ0aWFsc2AgcGxhY2Vob2xkZXIgaW5kZXhlcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtwYXJ0aWFsc1JpZ2h0XSBUaGUgYXJndW1lbnRzIHRvIGFwcGVuZCB0byB0aG9zZSBwcm92aWRlZFxuICogIHRvIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge0FycmF5fSBbaG9sZGVyc1JpZ2h0XSBUaGUgYHBhcnRpYWxzUmlnaHRgIHBsYWNlaG9sZGVyIGluZGV4ZXMuXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJnUG9zXSBUaGUgYXJndW1lbnQgcG9zaXRpb25zIG9mIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyeV0gVGhlIGFyaXR5IGNhcCBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyaXR5XSBUaGUgYXJpdHkgb2YgYGZ1bmNgLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgd3JhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlSHlicmlkV3JhcHBlcihmdW5jLCBiaXRtYXNrLCB0aGlzQXJnLCBwYXJ0aWFscywgaG9sZGVycywgcGFydGlhbHNSaWdodCwgaG9sZGVyc1JpZ2h0LCBhcmdQb3MsIGFyeSwgYXJpdHkpIHtcbiAgdmFyIGlzQXJ5ID0gYml0bWFzayAmIEFSWV9GTEFHLFxuICAgICAgaXNCaW5kID0gYml0bWFzayAmIEJJTkRfRkxBRyxcbiAgICAgIGlzQmluZEtleSA9IGJpdG1hc2sgJiBCSU5EX0tFWV9GTEFHLFxuICAgICAgaXNDdXJyaWVkID0gYml0bWFzayAmIChDVVJSWV9GTEFHIHwgQ1VSUllfUklHSFRfRkxBRyksXG4gICAgICBpc0ZsaXAgPSBiaXRtYXNrICYgRkxJUF9GTEFHLFxuICAgICAgQ3RvciA9IGlzQmluZEtleSA/IHVuZGVmaW5lZCA6IGNyZWF0ZUN0b3JXcmFwcGVyKGZ1bmMpO1xuXG4gIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgIGFyZ3MgPSBBcnJheShsZW5ndGgpLFxuICAgICAgICBpbmRleCA9IGxlbmd0aDtcblxuICAgIHdoaWxlIChpbmRleC0tKSB7XG4gICAgICBhcmdzW2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgfVxuICAgIGlmIChpc0N1cnJpZWQpIHtcbiAgICAgIHZhciBwbGFjZWhvbGRlciA9IGdldEhvbGRlcih3cmFwcGVyKSxcbiAgICAgICAgICBob2xkZXJzQ291bnQgPSBjb3VudEhvbGRlcnMoYXJncywgcGxhY2Vob2xkZXIpO1xuICAgIH1cbiAgICBpZiAocGFydGlhbHMpIHtcbiAgICAgIGFyZ3MgPSBjb21wb3NlQXJncyhhcmdzLCBwYXJ0aWFscywgaG9sZGVycywgaXNDdXJyaWVkKTtcbiAgICB9XG4gICAgaWYgKHBhcnRpYWxzUmlnaHQpIHtcbiAgICAgIGFyZ3MgPSBjb21wb3NlQXJnc1JpZ2h0KGFyZ3MsIHBhcnRpYWxzUmlnaHQsIGhvbGRlcnNSaWdodCwgaXNDdXJyaWVkKTtcbiAgICB9XG4gICAgbGVuZ3RoIC09IGhvbGRlcnNDb3VudDtcbiAgICBpZiAoaXNDdXJyaWVkICYmIGxlbmd0aCA8IGFyaXR5KSB7XG4gICAgICB2YXIgbmV3SG9sZGVycyA9IHJlcGxhY2VIb2xkZXJzKGFyZ3MsIHBsYWNlaG9sZGVyKTtcbiAgICAgIHJldHVybiBjcmVhdGVSZWN1cnJ5V3JhcHBlcihcbiAgICAgICAgZnVuYywgYml0bWFzaywgY3JlYXRlSHlicmlkV3JhcHBlciwgd3JhcHBlci5wbGFjZWhvbGRlciwgdGhpc0FyZyxcbiAgICAgICAgYXJncywgbmV3SG9sZGVycywgYXJnUG9zLCBhcnksIGFyaXR5IC0gbGVuZ3RoXG4gICAgICApO1xuICAgIH1cbiAgICB2YXIgdGhpc0JpbmRpbmcgPSBpc0JpbmQgPyB0aGlzQXJnIDogdGhpcyxcbiAgICAgICAgZm4gPSBpc0JpbmRLZXkgPyB0aGlzQmluZGluZ1tmdW5jXSA6IGZ1bmM7XG5cbiAgICBsZW5ndGggPSBhcmdzLmxlbmd0aDtcbiAgICBpZiAoYXJnUG9zKSB7XG4gICAgICBhcmdzID0gcmVvcmRlcihhcmdzLCBhcmdQb3MpO1xuICAgIH0gZWxzZSBpZiAoaXNGbGlwICYmIGxlbmd0aCA+IDEpIHtcbiAgICAgIGFyZ3MucmV2ZXJzZSgpO1xuICAgIH1cbiAgICBpZiAoaXNBcnkgJiYgYXJ5IDwgbGVuZ3RoKSB7XG4gICAgICBhcmdzLmxlbmd0aCA9IGFyeTtcbiAgICB9XG4gICAgaWYgKHRoaXMgJiYgdGhpcyAhPT0gcm9vdCAmJiB0aGlzIGluc3RhbmNlb2Ygd3JhcHBlcikge1xuICAgICAgZm4gPSBDdG9yIHx8IGNyZWF0ZUN0b3JXcmFwcGVyKGZuKTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNCaW5kaW5nLCBhcmdzKTtcbiAgfVxuICByZXR1cm4gd3JhcHBlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVIeWJyaWRXcmFwcGVyO1xuIl19