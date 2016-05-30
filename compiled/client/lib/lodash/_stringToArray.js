'use strict';

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
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
    return string.match(reComplexSymbol);
}

module.exports = stringToArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19zdHJpbmdUb0FycmF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLElBQUksZ0JBQWdCLGlCQUFwQjtJQUNJLG9CQUFvQixnQ0FEeEI7SUFFSSxzQkFBc0IsaUJBRjFCO0lBR0ksYUFBYSxnQkFIakI7OztBQU1BLElBQUksV0FBVyxNQUFNLGFBQU4sR0FBc0IsR0FBckM7SUFDSSxVQUFVLE1BQU0saUJBQU4sR0FBMEIsbUJBQTFCLEdBQWdELEdBRDlEO0lBRUksU0FBUywwQkFGYjtJQUdJLGFBQWEsUUFBUSxPQUFSLEdBQWtCLEdBQWxCLEdBQXdCLE1BQXhCLEdBQWlDLEdBSGxEO0lBSUksY0FBYyxPQUFPLGFBQVAsR0FBdUIsR0FKekM7SUFLSSxhQUFhLGlDQUxqQjtJQU1JLGFBQWEsb0NBTmpCO0lBT0ksUUFBUSxTQVBaOzs7QUFVQSxJQUFJLFdBQVcsYUFBYSxHQUE1QjtJQUNJLFdBQVcsTUFBTSxVQUFOLEdBQW1CLElBRGxDO0lBRUksWUFBWSxRQUFRLEtBQVIsR0FBZ0IsS0FBaEIsR0FBd0IsQ0FBQyxXQUFELEVBQWMsVUFBZCxFQUEwQixVQUExQixFQUFzQyxJQUF0QyxDQUEyQyxHQUEzQyxDQUF4QixHQUEwRSxHQUExRSxHQUFnRixRQUFoRixHQUEyRixRQUEzRixHQUFzRyxJQUZ0SDtJQUdJLFFBQVEsV0FBVyxRQUFYLEdBQXNCLFNBSGxDO0lBSUksV0FBVyxRQUFRLENBQUMsY0FBYyxPQUFkLEdBQXdCLEdBQXpCLEVBQThCLE9BQTlCLEVBQXVDLFVBQXZDLEVBQW1ELFVBQW5ELEVBQStELFFBQS9ELEVBQXlFLElBQXpFLENBQThFLEdBQTlFLENBQVIsR0FBNkYsR0FKNUc7OztBQU9BLElBQUksa0JBQWtCLE9BQU8sU0FBUyxLQUFULEdBQWlCLE1BQWpCLEdBQTBCLElBQTFCLEdBQWlDLFFBQWpDLEdBQTRDLEtBQW5ELEVBQTBELEdBQTFELENBQXRCOzs7Ozs7Ozs7QUFTQSxTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsRUFBK0I7QUFDN0IsV0FBTyxPQUFPLEtBQVAsQ0FBYSxlQUFiLENBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsYUFBakIiLCJmaWxlIjoiX3N0cmluZ1RvQXJyYXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogVXNlZCB0byBjb21wb3NlIHVuaWNvZGUgY2hhcmFjdGVyIGNsYXNzZXMuICovXG52YXIgcnNBc3RyYWxSYW5nZSA9ICdcXFxcdWQ4MDAtXFxcXHVkZmZmJyxcbiAgICByc0NvbWJvTWFya3NSYW5nZSA9ICdcXFxcdTAzMDAtXFxcXHUwMzZmXFxcXHVmZTIwLVxcXFx1ZmUyMycsXG4gICAgcnNDb21ib1N5bWJvbHNSYW5nZSA9ICdcXFxcdTIwZDAtXFxcXHUyMGYwJyxcbiAgICByc1ZhclJhbmdlID0gJ1xcXFx1ZmUwZVxcXFx1ZmUwZic7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgdW5pY29kZSBjYXB0dXJlIGdyb3Vwcy4gKi9cbnZhciByc0FzdHJhbCA9ICdbJyArIHJzQXN0cmFsUmFuZ2UgKyAnXScsXG4gICAgcnNDb21ibyA9ICdbJyArIHJzQ29tYm9NYXJrc1JhbmdlICsgcnNDb21ib1N5bWJvbHNSYW5nZSArICddJyxcbiAgICByc0ZpdHogPSAnXFxcXHVkODNjW1xcXFx1ZGZmYi1cXFxcdWRmZmZdJyxcbiAgICByc01vZGlmaWVyID0gJyg/OicgKyByc0NvbWJvICsgJ3wnICsgcnNGaXR6ICsgJyknLFxuICAgIHJzTm9uQXN0cmFsID0gJ1teJyArIHJzQXN0cmFsUmFuZ2UgKyAnXScsXG4gICAgcnNSZWdpb25hbCA9ICcoPzpcXFxcdWQ4M2NbXFxcXHVkZGU2LVxcXFx1ZGRmZl0pezJ9JyxcbiAgICByc1N1cnJQYWlyID0gJ1tcXFxcdWQ4MDAtXFxcXHVkYmZmXVtcXFxcdWRjMDAtXFxcXHVkZmZmXScsXG4gICAgcnNaV0ogPSAnXFxcXHUyMDBkJztcblxuLyoqIFVzZWQgdG8gY29tcG9zZSB1bmljb2RlIHJlZ2V4ZXMuICovXG52YXIgcmVPcHRNb2QgPSByc01vZGlmaWVyICsgJz8nLFxuICAgIHJzT3B0VmFyID0gJ1snICsgcnNWYXJSYW5nZSArICddPycsXG4gICAgcnNPcHRKb2luID0gJyg/OicgKyByc1pXSiArICcoPzonICsgW3JzTm9uQXN0cmFsLCByc1JlZ2lvbmFsLCByc1N1cnJQYWlyXS5qb2luKCd8JykgKyAnKScgKyByc09wdFZhciArIHJlT3B0TW9kICsgJykqJyxcbiAgICByc1NlcSA9IHJzT3B0VmFyICsgcmVPcHRNb2QgKyByc09wdEpvaW4sXG4gICAgcnNTeW1ib2wgPSAnKD86JyArIFtyc05vbkFzdHJhbCArIHJzQ29tYm8gKyAnPycsIHJzQ29tYm8sIHJzUmVnaW9uYWwsIHJzU3VyclBhaXIsIHJzQXN0cmFsXS5qb2luKCd8JykgKyAnKSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIFtzdHJpbmcgc3ltYm9sc10oaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtdW5pY29kZSkuICovXG52YXIgcmVDb21wbGV4U3ltYm9sID0gUmVnRXhwKHJzRml0eiArICcoPz0nICsgcnNGaXR6ICsgJyl8JyArIHJzU3ltYm9sICsgcnNTZXEsICdnJyk7XG5cbi8qKlxuICogQ29udmVydHMgYHN0cmluZ2AgdG8gYW4gYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIHN0cmluZ1RvQXJyYXkoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcubWF0Y2gocmVDb21wbGV4U3ltYm9sKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdUb0FycmF5O1xuIl19