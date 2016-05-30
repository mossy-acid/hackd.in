/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventModifierState
 * @typechecks static-only
 */

'use strict';

/**
 * Translation from modifier key to the associated property in the event.
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
 */

var modifierKeyToProp = {
  'Alt': 'altKey',
  'Control': 'ctrlKey',
  'Meta': 'metaKey',
  'Shift': 'shiftKey'
};

// IE8 does not implement getModifierState so we simply map it to the only
// modifier keys exposed by the event itself, does not support Lock-keys.
// Currently, all major browsers except Chrome seems to support Lock-keys.
function modifierStateGetter(keyArg) {
  var syntheticEvent = this;
  var nativeEvent = syntheticEvent.nativeEvent;
  if (nativeEvent.getModifierState) {
    return nativeEvent.getModifierState(keyArg);
  }
  var keyProp = modifierKeyToProp[keyArg];
  return keyProp ? !!nativeEvent[keyProp] : false;
}

function getEventModifierState(nativeEvent) {
  return modifierStateGetter;
}

module.exports = getEventModifierState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL2dldEV2ZW50TW9kaWZpZXJTdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFZQTs7Ozs7OztBQU9BLElBQUksb0JBQW9CO0FBQ3RCLFNBQU8sUUFEZTtBQUV0QixhQUFXLFNBRlc7QUFHdEIsVUFBUSxTQUhjO0FBSXRCLFdBQVM7QUFKYSxDQUF4Qjs7Ozs7QUFVQSxTQUFTLG1CQUFULENBQTZCLE1BQTdCLEVBQXFDO0FBQ25DLE1BQUksaUJBQWlCLElBQXJCO0FBQ0EsTUFBSSxjQUFjLGVBQWUsV0FBakM7QUFDQSxNQUFJLFlBQVksZ0JBQWhCLEVBQWtDO0FBQ2hDLFdBQU8sWUFBWSxnQkFBWixDQUE2QixNQUE3QixDQUFQO0FBQ0Q7QUFDRCxNQUFJLFVBQVUsa0JBQWtCLE1BQWxCLENBQWQ7QUFDQSxTQUFPLFVBQVUsQ0FBQyxDQUFDLFlBQVksT0FBWixDQUFaLEdBQW1DLEtBQTFDO0FBQ0Q7O0FBRUQsU0FBUyxxQkFBVCxDQUErQixXQUEvQixFQUE0QztBQUMxQyxTQUFPLG1CQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLHFCQUFqQiIsImZpbGUiOiJnZXRFdmVudE1vZGlmaWVyU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgZ2V0RXZlbnRNb2RpZmllclN0YXRlXG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBUcmFuc2xhdGlvbiBmcm9tIG1vZGlmaWVyIGtleSB0byB0aGUgYXNzb2NpYXRlZCBwcm9wZXJ0eSBpbiB0aGUgZXZlbnQuXG4gKiBAc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL0RPTS1MZXZlbC0zLUV2ZW50cy8ja2V5cy1Nb2RpZmllcnNcbiAqL1xuXG52YXIgbW9kaWZpZXJLZXlUb1Byb3AgPSB7XG4gICdBbHQnOiAnYWx0S2V5JyxcbiAgJ0NvbnRyb2wnOiAnY3RybEtleScsXG4gICdNZXRhJzogJ21ldGFLZXknLFxuICAnU2hpZnQnOiAnc2hpZnRLZXknXG59O1xuXG4vLyBJRTggZG9lcyBub3QgaW1wbGVtZW50IGdldE1vZGlmaWVyU3RhdGUgc28gd2Ugc2ltcGx5IG1hcCBpdCB0byB0aGUgb25seVxuLy8gbW9kaWZpZXIga2V5cyBleHBvc2VkIGJ5IHRoZSBldmVudCBpdHNlbGYsIGRvZXMgbm90IHN1cHBvcnQgTG9jay1rZXlzLlxuLy8gQ3VycmVudGx5LCBhbGwgbWFqb3IgYnJvd3NlcnMgZXhjZXB0IENocm9tZSBzZWVtcyB0byBzdXBwb3J0IExvY2sta2V5cy5cbmZ1bmN0aW9uIG1vZGlmaWVyU3RhdGVHZXR0ZXIoa2V5QXJnKSB7XG4gIHZhciBzeW50aGV0aWNFdmVudCA9IHRoaXM7XG4gIHZhciBuYXRpdmVFdmVudCA9IHN5bnRoZXRpY0V2ZW50Lm5hdGl2ZUV2ZW50O1xuICBpZiAobmF0aXZlRXZlbnQuZ2V0TW9kaWZpZXJTdGF0ZSkge1xuICAgIHJldHVybiBuYXRpdmVFdmVudC5nZXRNb2RpZmllclN0YXRlKGtleUFyZyk7XG4gIH1cbiAgdmFyIGtleVByb3AgPSBtb2RpZmllcktleVRvUHJvcFtrZXlBcmddO1xuICByZXR1cm4ga2V5UHJvcCA/ICEhbmF0aXZlRXZlbnRba2V5UHJvcF0gOiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0RXZlbnRNb2RpZmllclN0YXRlKG5hdGl2ZUV2ZW50KSB7XG4gIHJldHVybiBtb2RpZmllclN0YXRlR2V0dGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEV2ZW50TW9kaWZpZXJTdGF0ZTsiXX0=