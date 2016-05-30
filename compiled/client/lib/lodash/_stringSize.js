'use strict';

var reHasComplexSymbol = require('./_reHasComplexSymbol');

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reComplexSymbol = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Gets the number of symbols in `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the string size.
 */
function stringSize(string) {
    if (!(string && reHasComplexSymbol.test(string))) {
        return string.length;
    }
    var result = reComplexSymbol.lastIndex = 0;
    while (reComplexSymbol.test(string)) {
        result++;
    }
    return result;
}

module.exports = stringSize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19zdHJpbmdTaXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxxQkFBcUIsUUFBUSx1QkFBUixDQUF6Qjs7O0FBR0EsSUFBSSxnQkFBZ0IsaUJBQXBCO0lBQ0ksb0JBQW9CLGdDQUR4QjtJQUVJLHNCQUFzQixpQkFGMUI7SUFHSSxhQUFhLGdCQUhqQjs7O0FBTUEsSUFBSSxXQUFXLE1BQU0sYUFBTixHQUFzQixHQUFyQztJQUNJLFVBQVUsTUFBTSxpQkFBTixHQUEwQixtQkFBMUIsR0FBZ0QsR0FEOUQ7SUFFSSxTQUFTLDBCQUZiO0lBR0ksYUFBYSxRQUFRLE9BQVIsR0FBa0IsR0FBbEIsR0FBd0IsTUFBeEIsR0FBaUMsR0FIbEQ7SUFJSSxjQUFjLE9BQU8sYUFBUCxHQUF1QixHQUp6QztJQUtJLGFBQWEsaUNBTGpCO0lBTUksYUFBYSxvQ0FOakI7SUFPSSxRQUFRLFNBUFo7OztBQVVBLElBQUksV0FBVyxhQUFhLEdBQTVCO0lBQ0ksV0FBVyxNQUFNLFVBQU4sR0FBbUIsSUFEbEM7SUFFSSxZQUFZLFFBQVEsS0FBUixHQUFnQixLQUFoQixHQUF3QixDQUFDLFdBQUQsRUFBYyxVQUFkLEVBQTBCLFVBQTFCLEVBQXNDLElBQXRDLENBQTJDLEdBQTNDLENBQXhCLEdBQTBFLEdBQTFFLEdBQWdGLFFBQWhGLEdBQTJGLFFBQTNGLEdBQXNHLElBRnRIO0lBR0ksUUFBUSxXQUFXLFFBQVgsR0FBc0IsU0FIbEM7SUFJSSxXQUFXLFFBQVEsQ0FBQyxjQUFjLE9BQWQsR0FBd0IsR0FBekIsRUFBOEIsT0FBOUIsRUFBdUMsVUFBdkMsRUFBbUQsVUFBbkQsRUFBK0QsUUFBL0QsRUFBeUUsSUFBekUsQ0FBOEUsR0FBOUUsQ0FBUixHQUE2RixHQUo1Rzs7O0FBT0EsSUFBSSxrQkFBa0IsT0FBTyxTQUFTLEtBQVQsR0FBaUIsTUFBakIsR0FBMEIsSUFBMUIsR0FBaUMsUUFBakMsR0FBNEMsS0FBbkQsRUFBMEQsR0FBMUQsQ0FBdEI7Ozs7Ozs7OztBQVNBLFNBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QjtBQUMxQixRQUFJLEVBQUUsVUFBVSxtQkFBbUIsSUFBbkIsQ0FBd0IsTUFBeEIsQ0FBWixDQUFKLEVBQWtEO0FBQ2hELGVBQU8sT0FBTyxNQUFkO0FBQ0Q7QUFDRCxRQUFJLFNBQVMsZ0JBQWdCLFNBQWhCLEdBQTRCLENBQXpDO0FBQ0EsV0FBTyxnQkFBZ0IsSUFBaEIsQ0FBcUIsTUFBckIsQ0FBUCxFQUFxQztBQUNuQztBQUNEO0FBQ0QsV0FBTyxNQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFVBQWpCIiwiZmlsZSI6Il9zdHJpbmdTaXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHJlSGFzQ29tcGxleFN5bWJvbCA9IHJlcXVpcmUoJy4vX3JlSGFzQ29tcGxleFN5bWJvbCcpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIHVuaWNvZGUgY2hhcmFjdGVyIGNsYXNzZXMuICovXG52YXIgcnNBc3RyYWxSYW5nZSA9ICdcXFxcdWQ4MDAtXFxcXHVkZmZmJyxcbiAgICByc0NvbWJvTWFya3NSYW5nZSA9ICdcXFxcdTAzMDAtXFxcXHUwMzZmXFxcXHVmZTIwLVxcXFx1ZmUyMycsXG4gICAgcnNDb21ib1N5bWJvbHNSYW5nZSA9ICdcXFxcdTIwZDAtXFxcXHUyMGYwJyxcbiAgICByc1ZhclJhbmdlID0gJ1xcXFx1ZmUwZVxcXFx1ZmUwZic7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgdW5pY29kZSBjYXB0dXJlIGdyb3Vwcy4gKi9cbnZhciByc0FzdHJhbCA9ICdbJyArIHJzQXN0cmFsUmFuZ2UgKyAnXScsXG4gICAgcnNDb21ibyA9ICdbJyArIHJzQ29tYm9NYXJrc1JhbmdlICsgcnNDb21ib1N5bWJvbHNSYW5nZSArICddJyxcbiAgICByc0ZpdHogPSAnXFxcXHVkODNjW1xcXFx1ZGZmYi1cXFxcdWRmZmZdJyxcbiAgICByc01vZGlmaWVyID0gJyg/OicgKyByc0NvbWJvICsgJ3wnICsgcnNGaXR6ICsgJyknLFxuICAgIHJzTm9uQXN0cmFsID0gJ1teJyArIHJzQXN0cmFsUmFuZ2UgKyAnXScsXG4gICAgcnNSZWdpb25hbCA9ICcoPzpcXFxcdWQ4M2NbXFxcXHVkZGU2LVxcXFx1ZGRmZl0pezJ9JyxcbiAgICByc1N1cnJQYWlyID0gJ1tcXFxcdWQ4MDAtXFxcXHVkYmZmXVtcXFxcdWRjMDAtXFxcXHVkZmZmXScsXG4gICAgcnNaV0ogPSAnXFxcXHUyMDBkJztcblxuLyoqIFVzZWQgdG8gY29tcG9zZSB1bmljb2RlIHJlZ2V4ZXMuICovXG52YXIgcmVPcHRNb2QgPSByc01vZGlmaWVyICsgJz8nLFxuICAgIHJzT3B0VmFyID0gJ1snICsgcnNWYXJSYW5nZSArICddPycsXG4gICAgcnNPcHRKb2luID0gJyg/OicgKyByc1pXSiArICcoPzonICsgW3JzTm9uQXN0cmFsLCByc1JlZ2lvbmFsLCByc1N1cnJQYWlyXS5qb2luKCd8JykgKyAnKScgKyByc09wdFZhciArIHJlT3B0TW9kICsgJykqJyxcbiAgICByc1NlcSA9IHJzT3B0VmFyICsgcmVPcHRNb2QgKyByc09wdEpvaW4sXG4gICAgcnNTeW1ib2wgPSAnKD86JyArIFtyc05vbkFzdHJhbCArIHJzQ29tYm8gKyAnPycsIHJzQ29tYm8sIHJzUmVnaW9uYWwsIHJzU3VyclBhaXIsIHJzQXN0cmFsXS5qb2luKCd8JykgKyAnKSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIFtzdHJpbmcgc3ltYm9sc10oaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtdW5pY29kZSkuICovXG52YXIgcmVDb21wbGV4U3ltYm9sID0gUmVnRXhwKHJzRml0eiArICcoPz0nICsgcnNGaXR6ICsgJyl8JyArIHJzU3ltYm9sICsgcnNTZXEsICdnJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbnVtYmVyIG9mIHN5bWJvbHMgaW4gYHN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBpbnNwZWN0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgc3RyaW5nIHNpemUuXG4gKi9cbmZ1bmN0aW9uIHN0cmluZ1NpemUoc3RyaW5nKSB7XG4gIGlmICghKHN0cmluZyAmJiByZUhhc0NvbXBsZXhTeW1ib2wudGVzdChzdHJpbmcpKSkge1xuICAgIHJldHVybiBzdHJpbmcubGVuZ3RoO1xuICB9XG4gIHZhciByZXN1bHQgPSByZUNvbXBsZXhTeW1ib2wubGFzdEluZGV4ID0gMDtcbiAgd2hpbGUgKHJlQ29tcGxleFN5bWJvbC50ZXN0KHN0cmluZykpIHtcbiAgICByZXN1bHQrKztcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZ1NpemU7XG4iXX0=