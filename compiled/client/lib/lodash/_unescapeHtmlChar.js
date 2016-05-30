'use strict';

/** Used to map HTML entities to characters. */
var htmlUnescapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#96;': '`'
};

/**
 * Used by `_.unescape` to convert HTML entities to characters.
 *
 * @private
 * @param {string} chr The matched character to unescape.
 * @returns {string} Returns the unescaped character.
 */
function unescapeHtmlChar(chr) {
  return htmlUnescapes[chr];
}

module.exports = unescapeHtmlChar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL191bmVzY2FwZUh0bWxDaGFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLElBQUksZ0JBQWdCO0FBQ2xCLFdBQVMsR0FEUztBQUVsQixVQUFRLEdBRlU7QUFHbEIsVUFBUSxHQUhVO0FBSWxCLFlBQVUsR0FKUTtBQUtsQixXQUFTLEdBTFM7QUFNbEIsV0FBUztBQU5TLENBQXBCOzs7Ozs7Ozs7QUFnQkEsU0FBUyxnQkFBVCxDQUEwQixHQUExQixFQUErQjtBQUM3QixTQUFPLGNBQWMsR0FBZCxDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLGdCQUFqQiIsImZpbGUiOiJfdW5lc2NhcGVIdG1sQ2hhci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBVc2VkIHRvIG1hcCBIVE1MIGVudGl0aWVzIHRvIGNoYXJhY3RlcnMuICovXG52YXIgaHRtbFVuZXNjYXBlcyA9IHtcbiAgJyZhbXA7JzogJyYnLFxuICAnJmx0Oyc6ICc8JyxcbiAgJyZndDsnOiAnPicsXG4gICcmcXVvdDsnOiAnXCInLFxuICAnJiMzOTsnOiBcIidcIixcbiAgJyYjOTY7JzogJ2AnXG59O1xuXG4vKipcbiAqIFVzZWQgYnkgYF8udW5lc2NhcGVgIHRvIGNvbnZlcnQgSFRNTCBlbnRpdGllcyB0byBjaGFyYWN0ZXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hyIFRoZSBtYXRjaGVkIGNoYXJhY3RlciB0byB1bmVzY2FwZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVuZXNjYXBlZCBjaGFyYWN0ZXIuXG4gKi9cbmZ1bmN0aW9uIHVuZXNjYXBlSHRtbENoYXIoY2hyKSB7XG4gIHJldHVybiBodG1sVW5lc2NhcGVzW2Nocl07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdW5lc2NhcGVIdG1sQ2hhcjtcbiJdfQ==