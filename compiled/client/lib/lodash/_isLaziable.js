'use strict';

var LazyWrapper = require('./_LazyWrapper'),
    getData = require('./_getData'),
    getFuncName = require('./_getFuncName'),
    lodash = require('./wrapperLodash');

/**
 * Checks if `func` has a lazy counterpart.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
 *  else `false`.
 */
function isLaziable(func) {
  var funcName = getFuncName(func),
      other = lodash[funcName];

  if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
    return false;
  }
  if (func === other) {
    return true;
  }
  var data = getData(other);
  return !!data && func === data[0];
}

module.exports = isLaziable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19pc0xhemlhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFFBQVEsZ0JBQVIsQ0FBbEI7SUFDSSxVQUFVLFFBQVEsWUFBUixDQURkO0lBRUksY0FBYyxRQUFRLGdCQUFSLENBRmxCO0lBR0ksU0FBUyxRQUFRLGlCQUFSLENBSGI7Ozs7Ozs7Ozs7QUFhQSxTQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEI7QUFDeEIsTUFBSSxXQUFXLFlBQVksSUFBWixDQUFmO01BQ0ksUUFBUSxPQUFPLFFBQVAsQ0FEWjs7QUFHQSxNQUFJLE9BQU8sS0FBUCxJQUFnQixVQUFoQixJQUE4QixFQUFFLFlBQVksWUFBWSxTQUExQixDQUFsQyxFQUF3RTtBQUN0RSxXQUFPLEtBQVA7QUFDRDtBQUNELE1BQUksU0FBUyxLQUFiLEVBQW9CO0FBQ2xCLFdBQU8sSUFBUDtBQUNEO0FBQ0QsTUFBSSxPQUFPLFFBQVEsS0FBUixDQUFYO0FBQ0EsU0FBTyxDQUFDLENBQUMsSUFBRixJQUFVLFNBQVMsS0FBSyxDQUFMLENBQTFCO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFVBQWpCIiwiZmlsZSI6Il9pc0xhemlhYmxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIExhenlXcmFwcGVyID0gcmVxdWlyZSgnLi9fTGF6eVdyYXBwZXInKSxcbiAgICBnZXREYXRhID0gcmVxdWlyZSgnLi9fZ2V0RGF0YScpLFxuICAgIGdldEZ1bmNOYW1lID0gcmVxdWlyZSgnLi9fZ2V0RnVuY05hbWUnKSxcbiAgICBsb2Rhc2ggPSByZXF1aXJlKCcuL3dyYXBwZXJMb2Rhc2gnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBhIGxhenkgY291bnRlcnBhcnQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBoYXMgYSBsYXp5IGNvdW50ZXJwYXJ0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMYXppYWJsZShmdW5jKSB7XG4gIHZhciBmdW5jTmFtZSA9IGdldEZ1bmNOYW1lKGZ1bmMpLFxuICAgICAgb3RoZXIgPSBsb2Rhc2hbZnVuY05hbWVdO1xuXG4gIGlmICh0eXBlb2Ygb3RoZXIgIT0gJ2Z1bmN0aW9uJyB8fCAhKGZ1bmNOYW1lIGluIExhenlXcmFwcGVyLnByb3RvdHlwZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGZ1bmMgPT09IG90aGVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIGRhdGEgPSBnZXREYXRhKG90aGVyKTtcbiAgcmV0dXJuICEhZGF0YSAmJiBmdW5jID09PSBkYXRhWzBdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGF6aWFibGU7XG4iXX0=