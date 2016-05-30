"use strict";

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  var length = args.length;
  switch (length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19hcHBseS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFVQSxTQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCLE9BQXJCLEVBQThCLElBQTlCLEVBQW9DO0FBQ2xDLE1BQUksU0FBUyxLQUFLLE1BQUwsQ0FEcUI7QUFFbEMsVUFBUSxNQUFSO0FBQ0UsU0FBSyxDQUFMO0FBQVEsYUFBTyxLQUFLLElBQUwsQ0FBVSxPQUFWLENBQVAsQ0FBUjtBQURGLFNBRU8sQ0FBTDtBQUFRLGFBQU8sS0FBSyxJQUFMLENBQVUsT0FBVixFQUFtQixLQUFLLENBQUwsQ0FBbkIsQ0FBUCxDQUFSO0FBRkYsU0FHTyxDQUFMO0FBQVEsYUFBTyxLQUFLLElBQUwsQ0FBVSxPQUFWLEVBQW1CLEtBQUssQ0FBTCxDQUFuQixFQUE0QixLQUFLLENBQUwsQ0FBNUIsQ0FBUCxDQUFSO0FBSEYsU0FJTyxDQUFMO0FBQVEsYUFBTyxLQUFLLElBQUwsQ0FBVSxPQUFWLEVBQW1CLEtBQUssQ0FBTCxDQUFuQixFQUE0QixLQUFLLENBQUwsQ0FBNUIsRUFBcUMsS0FBSyxDQUFMLENBQXJDLENBQVAsQ0FBUjtBQUpGLEdBRmtDO0FBUWxDLFNBQU8sS0FBSyxLQUFMLENBQVcsT0FBWCxFQUFvQixJQUFwQixDQUFQLENBUmtDO0NBQXBDOztBQVdBLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJfYXBwbHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuICovXG5mdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gIHZhciBsZW5ndGggPSBhcmdzLmxlbmd0aDtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHk7XG4iXX0=