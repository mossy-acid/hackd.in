'use strict';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the view, applying any `transforms` to the `start` and `end` positions.
 *
 * @private
 * @param {number} start The start of the view.
 * @param {number} end The end of the view.
 * @param {Array} transforms The transformations to apply to the view.
 * @returns {Object} Returns an object containing the `start` and `end`
 *  positions of the view.
 */
function getView(start, end, transforms) {
  var index = -1,
      length = transforms.length;

  while (++index < length) {
    var data = transforms[index],
        size = data.size;

    switch (data.type) {
      case 'drop':
        start += size;break;
      case 'dropRight':
        end -= size;break;
      case 'take':
        end = nativeMin(end, start + size);break;
      case 'takeRight':
        start = nativeMax(start, end - size);break;
    }
  }
  return { 'start': start, 'end': end };
}

module.exports = getView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19nZXRWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLElBQUksWUFBWSxLQUFLLEdBQXJCO0lBQ0ksWUFBWSxLQUFLLEdBRHJCOzs7Ozs7Ozs7Ozs7QUFhQSxTQUFTLE9BQVQsQ0FBaUIsS0FBakIsRUFBd0IsR0FBeEIsRUFBNkIsVUFBN0IsRUFBeUM7QUFDdkMsTUFBSSxRQUFRLENBQUMsQ0FBYjtNQUNJLFNBQVMsV0FBVyxNQUR4Qjs7QUFHQSxTQUFPLEVBQUUsS0FBRixHQUFVLE1BQWpCLEVBQXlCO0FBQ3ZCLFFBQUksT0FBTyxXQUFXLEtBQVgsQ0FBWDtRQUNJLE9BQU8sS0FBSyxJQURoQjs7QUFHQSxZQUFRLEtBQUssSUFBYjtBQUNFLFdBQUssTUFBTDtBQUFrQixpQkFBUyxJQUFULENBQWU7QUFDakMsV0FBSyxXQUFMO0FBQWtCLGVBQU8sSUFBUCxDQUFhO0FBQy9CLFdBQUssTUFBTDtBQUFrQixjQUFNLFVBQVUsR0FBVixFQUFlLFFBQVEsSUFBdkIsQ0FBTixDQUFvQztBQUN0RCxXQUFLLFdBQUw7QUFBa0IsZ0JBQVEsVUFBVSxLQUFWLEVBQWlCLE1BQU0sSUFBdkIsQ0FBUixDQUFzQztBQUoxRDtBQU1EO0FBQ0QsU0FBTyxFQUFFLFNBQVMsS0FBWCxFQUFrQixPQUFPLEdBQXpCLEVBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoiX2dldFZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogR2V0cyB0aGUgdmlldywgYXBwbHlpbmcgYW55IGB0cmFuc2Zvcm1zYCB0byB0aGUgYHN0YXJ0YCBhbmQgYGVuZGAgcG9zaXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgVGhlIHN0YXJ0IG9mIHRoZSB2aWV3LlxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgZW5kIG9mIHRoZSB2aWV3LlxuICogQHBhcmFtIHtBcnJheX0gdHJhbnNmb3JtcyBUaGUgdHJhbnNmb3JtYXRpb25zIHRvIGFwcGx5IHRvIHRoZSB2aWV3LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgYHN0YXJ0YCBhbmQgYGVuZGBcbiAqICBwb3NpdGlvbnMgb2YgdGhlIHZpZXcuXG4gKi9cbmZ1bmN0aW9uIGdldFZpZXcoc3RhcnQsIGVuZCwgdHJhbnNmb3Jtcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHRyYW5zZm9ybXMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGRhdGEgPSB0cmFuc2Zvcm1zW2luZGV4XSxcbiAgICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICAgIHN3aXRjaCAoZGF0YS50eXBlKSB7XG4gICAgICBjYXNlICdkcm9wJzogICAgICBzdGFydCArPSBzaXplOyBicmVhaztcbiAgICAgIGNhc2UgJ2Ryb3BSaWdodCc6IGVuZCAtPSBzaXplOyBicmVhaztcbiAgICAgIGNhc2UgJ3Rha2UnOiAgICAgIGVuZCA9IG5hdGl2ZU1pbihlbmQsIHN0YXJ0ICsgc2l6ZSk7IGJyZWFrO1xuICAgICAgY2FzZSAndGFrZVJpZ2h0Jzogc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQsIGVuZCAtIHNpemUpOyBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgJ3N0YXJ0Jzogc3RhcnQsICdlbmQnOiBlbmQgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRWaWV3O1xuIl19