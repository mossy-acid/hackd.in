'use strict';

/** Used to escape characters for inclusion in compiled string literals. */
var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

/**
 * Used by `_.template` to escape characters for inclusion in compiled string literals.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeStringChar(chr) {
  return '\\' + stringEscapes[chr];
}

module.exports = escapeStringChar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19lc2NhcGVTdHJpbmdDaGFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLElBQUksZ0JBQWdCO0FBQ2xCLFFBQU0sSUFEWTtBQUVsQixPQUFLLEdBRmE7QUFHbEIsUUFBTSxHQUhZO0FBSWxCLFFBQU0sR0FKWTtBQUtsQixZQUFVLE9BTFE7QUFNbEIsWUFBVTtBQU5RLENBQXBCOzs7Ozs7Ozs7QUFnQkEsU0FBUyxnQkFBVCxDQUEwQixHQUExQixFQUErQjtBQUM3QixTQUFPLE9BQU8sY0FBYyxHQUFkLENBQWQ7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsZ0JBQWpCIiwiZmlsZSI6Il9lc2NhcGVTdHJpbmdDaGFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIFVzZWQgdG8gZXNjYXBlIGNoYXJhY3RlcnMgZm9yIGluY2x1c2lvbiBpbiBjb21waWxlZCBzdHJpbmcgbGl0ZXJhbHMuICovXG52YXIgc3RyaW5nRXNjYXBlcyA9IHtcbiAgJ1xcXFwnOiAnXFxcXCcsXG4gIFwiJ1wiOiBcIidcIixcbiAgJ1xcbic6ICduJyxcbiAgJ1xccic6ICdyJyxcbiAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAnXFx1MjAyOSc6ICd1MjAyOSdcbn07XG5cbi8qKlxuICogVXNlZCBieSBgXy50ZW1wbGF0ZWAgdG8gZXNjYXBlIGNoYXJhY3RlcnMgZm9yIGluY2x1c2lvbiBpbiBjb21waWxlZCBzdHJpbmcgbGl0ZXJhbHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBjaHIgVGhlIG1hdGNoZWQgY2hhcmFjdGVyIHRvIGVzY2FwZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGVzY2FwZWQgY2hhcmFjdGVyLlxuICovXG5mdW5jdGlvbiBlc2NhcGVTdHJpbmdDaGFyKGNocikge1xuICByZXR1cm4gJ1xcXFwnICsgc3RyaW5nRXNjYXBlc1tjaHJdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVzY2FwZVN0cmluZ0NoYXI7XG4iXX0=