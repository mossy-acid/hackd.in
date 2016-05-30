/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultPerfAnalysis
 */

'use strict';

var assign = require('./Object.assign');

// Don't try to save users less than 1.2ms (a number I made up)
var DONT_CARE_THRESHOLD = 1.2;
var DOM_OPERATION_TYPES = {
  '_mountImageIntoNode': 'set innerHTML',
  INSERT_MARKUP: 'set innerHTML',
  MOVE_EXISTING: 'move',
  REMOVE_NODE: 'remove',
  SET_MARKUP: 'set innerHTML',
  TEXT_CONTENT: 'set textContent',
  'setValueForProperty': 'update attribute',
  'setValueForAttribute': 'update attribute',
  'deleteValueForProperty': 'remove attribute',
  'setValueForStyles': 'update styles',
  'replaceNodeWithMarkup': 'replace',
  'updateTextContent': 'set textContent'
};

function getTotalTime(measurements) {
  // TODO: return number of DOM ops? could be misleading.
  // TODO: measure dropped frames after reconcile?
  // TODO: log total time of each reconcile and the top-level component
  // class that triggered it.
  var totalTime = 0;
  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    totalTime += measurement.totalTime;
  }
  return totalTime;
}

function getDOMSummary(measurements) {
  var items = [];
  measurements.forEach(function (measurement) {
    Object.keys(measurement.writes).forEach(function (id) {
      measurement.writes[id].forEach(function (write) {
        items.push({
          id: id,
          type: DOM_OPERATION_TYPES[write.type] || write.type,
          args: write.args
        });
      });
    });
  });
  return items;
}

function getExclusiveSummary(measurements) {
  var candidates = {};
  var displayName;

  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    var allIDs = assign({}, measurement.exclusive, measurement.inclusive);

    for (var id in allIDs) {
      displayName = measurement.displayNames[id].current;

      candidates[displayName] = candidates[displayName] || {
        componentName: displayName,
        inclusive: 0,
        exclusive: 0,
        render: 0,
        count: 0
      };
      if (measurement.render[id]) {
        candidates[displayName].render += measurement.render[id];
      }
      if (measurement.exclusive[id]) {
        candidates[displayName].exclusive += measurement.exclusive[id];
      }
      if (measurement.inclusive[id]) {
        candidates[displayName].inclusive += measurement.inclusive[id];
      }
      if (measurement.counts[id]) {
        candidates[displayName].count += measurement.counts[id];
      }
    }
  }

  // Now make a sorted array with the results.
  var arr = [];
  for (displayName in candidates) {
    if (candidates[displayName].exclusive >= DONT_CARE_THRESHOLD) {
      arr.push(candidates[displayName]);
    }
  }

  arr.sort(function (a, b) {
    return b.exclusive - a.exclusive;
  });

  return arr;
}

function getInclusiveSummary(measurements, onlyClean) {
  var candidates = {};
  var inclusiveKey;

  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    var allIDs = assign({}, measurement.exclusive, measurement.inclusive);
    var cleanComponents;

    if (onlyClean) {
      cleanComponents = getUnchangedComponents(measurement);
    }

    for (var id in allIDs) {
      if (onlyClean && !cleanComponents[id]) {
        continue;
      }

      var displayName = measurement.displayNames[id];

      // Inclusive time is not useful for many components without knowing where
      // they are instantiated. So we aggregate inclusive time with both the
      // owner and current displayName as the key.
      inclusiveKey = displayName.owner + ' > ' + displayName.current;

      candidates[inclusiveKey] = candidates[inclusiveKey] || {
        componentName: inclusiveKey,
        time: 0,
        count: 0
      };

      if (measurement.inclusive[id]) {
        candidates[inclusiveKey].time += measurement.inclusive[id];
      }
      if (measurement.counts[id]) {
        candidates[inclusiveKey].count += measurement.counts[id];
      }
    }
  }

  // Now make a sorted array with the results.
  var arr = [];
  for (inclusiveKey in candidates) {
    if (candidates[inclusiveKey].time >= DONT_CARE_THRESHOLD) {
      arr.push(candidates[inclusiveKey]);
    }
  }

  arr.sort(function (a, b) {
    return b.time - a.time;
  });

  return arr;
}

function getUnchangedComponents(measurement) {
  // For a given reconcile, look at which components did not actually
  // render anything to the DOM and return a mapping of their ID to
  // the amount of time it took to render the entire subtree.
  var cleanComponents = {};
  var dirtyLeafIDs = Object.keys(measurement.writes);
  var allIDs = assign({}, measurement.exclusive, measurement.inclusive);

  for (var id in allIDs) {
    var isDirty = false;
    // For each component that rendered, see if a component that triggered
    // a DOM op is in its subtree.
    for (var i = 0; i < dirtyLeafIDs.length; i++) {
      if (dirtyLeafIDs[i].indexOf(id) === 0) {
        isDirty = true;
        break;
      }
    }
    // check if component newly created
    if (measurement.created[id]) {
      isDirty = true;
    }
    if (!isDirty && measurement.counts[id] > 0) {
      cleanComponents[id] = true;
    }
  }
  return cleanComponents;
}

var ReactDefaultPerfAnalysis = {
  getExclusiveSummary: getExclusiveSummary,
  getInclusiveSummary: getInclusiveSummary,
  getDOMSummary: getDOMSummary,
  getTotalTime: getTotalTime
};

module.exports = ReactDefaultPerfAnalysis;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RGVmYXVsdFBlcmZBbmFseXNpcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVdBOztBQUVBLElBQUksU0FBUyxRQUFRLGlCQUFSLENBQVQ7OztBQUdKLElBQUksc0JBQXNCLEdBQXRCO0FBQ0osSUFBSSxzQkFBc0I7QUFDeEIseUJBQXVCLGVBQXZCO0FBQ0EsaUJBQWUsZUFBZjtBQUNBLGlCQUFlLE1BQWY7QUFDQSxlQUFhLFFBQWI7QUFDQSxjQUFZLGVBQVo7QUFDQSxnQkFBYyxpQkFBZDtBQUNBLHlCQUF1QixrQkFBdkI7QUFDQSwwQkFBd0Isa0JBQXhCO0FBQ0EsNEJBQTBCLGtCQUExQjtBQUNBLHVCQUFxQixlQUFyQjtBQUNBLDJCQUF5QixTQUF6QjtBQUNBLHVCQUFxQixpQkFBckI7Q0FaRTs7QUFlSixTQUFTLFlBQVQsQ0FBc0IsWUFBdEIsRUFBb0M7Ozs7O0FBS2xDLE1BQUksWUFBWSxDQUFaLENBTDhCO0FBTWxDLE9BQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLGFBQWEsTUFBYixFQUFxQixHQUF6QyxFQUE4QztBQUM1QyxRQUFJLGNBQWMsYUFBYSxDQUFiLENBQWQsQ0FEd0M7QUFFNUMsaUJBQWEsWUFBWSxTQUFaLENBRitCO0dBQTlDO0FBSUEsU0FBTyxTQUFQLENBVmtDO0NBQXBDOztBQWFBLFNBQVMsYUFBVCxDQUF1QixZQUF2QixFQUFxQztBQUNuQyxNQUFJLFFBQVEsRUFBUixDQUQrQjtBQUVuQyxlQUFhLE9BQWIsQ0FBcUIsVUFBVSxXQUFWLEVBQXVCO0FBQzFDLFdBQU8sSUFBUCxDQUFZLFlBQVksTUFBWixDQUFaLENBQWdDLE9BQWhDLENBQXdDLFVBQVUsRUFBVixFQUFjO0FBQ3BELGtCQUFZLE1BQVosQ0FBbUIsRUFBbkIsRUFBdUIsT0FBdkIsQ0FBK0IsVUFBVSxLQUFWLEVBQWlCO0FBQzlDLGNBQU0sSUFBTixDQUFXO0FBQ1Qs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OztBQUkzQyxNQUFJLGtCQUFrQixFQUFsQixDQUp1QztBQUszQyxNQUFJLGVBQWUsT0FBTyxJQUFQLENBQVksWUFBWSxNQUFaLENBQTNCLENBTHVDO0FBTTNDLE1BQUksU0FBUyxPQUFPLEVBQVAsRUFBVyxZQUFZLFNBQVosRUFBdUIsWUFBWSxTQUFaLENBQTNDLENBTnVDOztBQVEzQyxPQUFLLElBQUksRUFBSixJQUFVLE1BQWYsRUFBdUI7QUFDckIsUUFBSSxVQUFVLEtBQVY7OztBQURpQixTQUloQixJQUFJLElBQUksQ0FBSixFQUFPLElBQUksYUFBYSxNQUFiLEVBQXFCLEdBQXpDLEVBQThDO0FBQzVDLFVBQUksYUFBYSxDQUFiLEVBQWdCLE9BQWhCLENBQXdCLEVBQXhCLE1BQWdDLENBQWhDLEVBQW1DO0FBQ3JDLGtCQUFVLElBQVYsQ0FEcUM7QUFFckMsY0FGcUM7T0FBdkM7S0FERjs7QUFKcUIsUUFXakIsWUFBWSxPQUFaLENBQW9CLEVBQXBCLENBQUosRUFBNkI7QUFDM0IsZ0JBQVUsSUFBVixDQUQyQjtLQUE3QjtBQUdBLFFBQUksQ0FBQyxPQUFELElBQVksWUFBWSxNQUFaLENBQW1CLEVBQW5CLElBQXlCLENBQXpCLEVBQTRCO0FBQzFDLHNCQUFnQixFQUFoQixJQUFzQixJQUF0QixDQUQwQztLQUE1QztHQWRGO0FBa0JBLFNBQU8sZUFBUCxDQTFCMkM7Q0FBN0M7O0FBNkJBLElBQUksMkJBQTJCO0FBQzdCLHVCQUFxQixtQkFBckI7QUFDQSx1QkFBcUIsbUJBQXJCO0FBQ0EsaUJBQWUsYUFBZjtBQUNBLGdCQUFjLFlBQWQ7Q0FKRTs7QUFPSixPQUFPLE9BQVAsR0FBaUIsd0JBQWpCIiwiZmlsZSI6IlJlYWN0RGVmYXVsdFBlcmZBbmFseXNpcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdERlZmF1bHRQZXJmQW5hbHlzaXNcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCcuL09iamVjdC5hc3NpZ24nKTtcblxuLy8gRG9uJ3QgdHJ5IHRvIHNhdmUgdXNlcnMgbGVzcyB0aGFuIDEuMm1zIChhIG51bWJlciBJIG1hZGUgdXApXG52YXIgRE9OVF9DQVJFX1RIUkVTSE9MRCA9IDEuMjtcbnZhciBET01fT1BFUkFUSU9OX1RZUEVTID0ge1xuICAnX21vdW50SW1hZ2VJbnRvTm9kZSc6ICdzZXQgaW5uZXJIVE1MJyxcbiAgSU5TRVJUX01BUktVUDogJ3NldCBpbm5lckhUTUwnLFxuICBNT1ZFX0VYSVNUSU5HOiAnbW92ZScsXG4gIFJFTU9WRV9OT0RFOiAncmVtb3ZlJyxcbiAgU0VUX01BUktVUDogJ3NldCBpbm5lckhUTUwnLFxuICBURVhUX0NPTlRFTlQ6ICdzZXQgdGV4dENvbnRlbnQnLFxuICAnc2V0VmFsdWVGb3JQcm9wZXJ0eSc6ICd1cGRhdGUgYXR0cmlidXRlJyxcbiAgJ3NldFZhbHVlRm9yQXR0cmlidXRlJzogJ3VwZGF0ZSBhdHRyaWJ1dGUnLFxuICAnZGVsZXRlVmFsdWVGb3JQcm9wZXJ0eSc6ICdyZW1vdmUgYXR0cmlidXRlJyxcbiAgJ3NldFZhbHVlRm9yU3R5bGVzJzogJ3VwZGF0ZSBzdHlsZXMnLFxuICAncmVwbGFjZU5vZGVXaXRoTWFya3VwJzogJ3JlcGxhY2UnLFxuICAndXBkYXRlVGV4dENvbnRlbnQnOiAnc2V0IHRleHRDb250ZW50J1xufTtcblxuZnVuY3Rpb24gZ2V0VG90YWxUaW1lKG1lYXN1cmVtZW50cykge1xuICAvLyBUT0RPOiByZXR1cm4gbnVtYmVyIG9mIERPTSBvcHM/IGNvdWxkIGJlIG1pc2xlYWRpbmcuXG4gIC8vIFRPRE86IG1lYXN1cmUgZHJvcHBlZCBmcmFtZXMgYWZ0ZXIgcmVjb25jaWxlP1xuICAvLyBUT0RPOiBsb2cgdG90YWwgdGltZSBvZiBlYWNoIHJlY29uY2lsZSBhbmQgdGhlIHRvcC1sZXZlbCBjb21wb25lbnRcbiAgLy8gY2xhc3MgdGhhdCB0cmlnZ2VyZWQgaXQuXG4gIHZhciB0b3RhbFRpbWUgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG1lYXN1cmVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBtZWFzdXJlbWVudCA9IG1lYXN1cmVtZW50c1tpXTtcbiAgICB0b3RhbFRpbWUgKz0gbWVhc3VyZW1lbnQudG90YWxUaW1lO1xuICB9XG4gIHJldHVybiB0b3RhbFRpbWU7XG59XG5cbmZ1bmN0aW9uIGdldERPTVN1bW1hcnkobWVhc3VyZW1lbnRzKSB7XG4gIHZhciBpdGVtcyA9IFtdO1xuICBtZWFzdXJlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobWVhc3VyZW1lbnQpIHtcbiAgICBPYmplY3Qua2V5cyhtZWFzdXJlbWVudC53cml0ZXMpLmZvckVhY2goZnVuY3Rpb24gKGlkKSB7XG4gICAgICBtZWFzdXJlbWVudC53cml0ZXNbaWRdLmZvckVhY2goZnVuY3Rpb24gKHdyaXRlKSB7XG4gICAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICB0eXBlOiBET01fT1BFUkFUSU9OX1RZUEVTW3dyaXRlLnR5cGVdIHx8IHdyaXRlLnR5cGUsXG4gICAgICAgICAgYXJnczogd3JpdGUuYXJnc1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGl0ZW1zO1xufVxuXG5mdW5jdGlvbiBnZXRFeGNsdXNpdmVTdW1tYXJ5KG1lYXN1cmVtZW50cykge1xuICB2YXIgY2FuZGlkYXRlcyA9IHt9O1xuICB2YXIgZGlzcGxheU5hbWU7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZWFzdXJlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbWVhc3VyZW1lbnQgPSBtZWFzdXJlbWVudHNbaV07XG4gICAgdmFyIGFsbElEcyA9IGFzc2lnbih7fSwgbWVhc3VyZW1lbnQuZXhjbHVzaXZlLCBtZWFzdXJlbWVudC5pbmNsdXNpdmUpO1xuXG4gICAgZm9yICh2YXIgaWQgaW4gYWxsSURzKSB7XG4gICAgICBkaXNwbGF5TmFtZSA9IG1lYXN1cmVtZW50LmRpc3BsYXlOYW1lc1tpZF0uY3VycmVudDtcblxuICAgICAgY2FuZGlkYXRlc1tkaXNwbGF5TmFtZV0gPSBjYW5kaWRhdGVzW2Rpc3BsYXlOYW1lXSB8fCB7XG4gICAgICAgIGNvbXBvbmVudE5hbWU6IGRpc3BsYXlOYW1lLFxuICAgICAgICBpbmNsdXNpdmU6IDAsXG4gICAgICAgIGV4Y2x1c2l2ZTogMCxcbiAgICAgICAgcmVuZGVyOiAwLFxuICAgICAgICBjb3VudDogMFxuICAgICAgfTtcbiAgICAgIGlmIChtZWFzdXJlbWVudC5yZW5kZXJbaWRdKSB7XG4gICAgICAgIGNhbmRpZGF0ZXNbZGlzcGxheU5hbWVdLnJlbmRlciArPSBtZWFzdXJlbWVudC5yZW5kZXJbaWRdO1xuICAgICAgfVxuICAgICAgaWYgKG1lYXN1cmVtZW50LmV4Y2x1c2l2ZVtpZF0pIHtcbiAgICAgICAgY2FuZGlkYXRlc1tkaXNwbGF5TmFtZV0uZXhjbHVzaXZlICs9IG1lYXN1cmVtZW50LmV4Y2x1c2l2ZVtpZF07XG4gICAgICB9XG4gICAgICBpZiAobWVhc3VyZW1lbnQuaW5jbHVzaXZlW2lkXSkge1xuICAgICAgICBjYW5kaWRhdGVzW2Rpc3BsYXlOYW1lXS5pbmNsdXNpdmUgKz0gbWVhc3VyZW1lbnQuaW5jbHVzaXZlW2lkXTtcbiAgICAgIH1cbiAgICAgIGlmIChtZWFzdXJlbWVudC5jb3VudHNbaWRdKSB7XG4gICAgICAgIGNhbmRpZGF0ZXNbZGlzcGxheU5hbWVdLmNvdW50ICs9IG1lYXN1cmVtZW50LmNvdW50c1tpZF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gTm93IG1ha2UgYSBzb3J0ZWQgYXJyYXkgd2l0aCB0aGUgcmVzdWx0cy5cbiAgdmFyIGFyciA9IFtdO1xuICBmb3IgKGRpc3BsYXlOYW1lIGluIGNhbmRpZGF0ZXMpIHtcbiAgICBpZiAoY2FuZGlkYXRlc1tkaXNwbGF5TmFtZV0uZXhjbHVzaXZlID49IERPTlRfQ0FSRV9USFJFU0hPTEQpIHtcbiAgICAgIGFyci5wdXNoKGNhbmRpZGF0ZXNbZGlzcGxheU5hbWVdKTtcbiAgICB9XG4gIH1cblxuICBhcnIuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBiLmV4Y2x1c2l2ZSAtIGEuZXhjbHVzaXZlO1xuICB9KTtcblxuICByZXR1cm4gYXJyO1xufVxuXG5mdW5jdGlvbiBnZXRJbmNsdXNpdmVTdW1tYXJ5KG1lYXN1cmVtZW50cywgb25seUNsZWFuKSB7XG4gIHZhciBjYW5kaWRhdGVzID0ge307XG4gIHZhciBpbmNsdXNpdmVLZXk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZWFzdXJlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbWVhc3VyZW1lbnQgPSBtZWFzdXJlbWVudHNbaV07XG4gICAgdmFyIGFsbElEcyA9IGFzc2lnbih7fSwgbWVhc3VyZW1lbnQuZXhjbHVzaXZlLCBtZWFzdXJlbWVudC5pbmNsdXNpdmUpO1xuICAgIHZhciBjbGVhbkNvbXBvbmVudHM7XG5cbiAgICBpZiAob25seUNsZWFuKSB7XG4gICAgICBjbGVhbkNvbXBvbmVudHMgPSBnZXRVbmNoYW5nZWRDb21wb25lbnRzKG1lYXN1cmVtZW50KTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpZCBpbiBhbGxJRHMpIHtcbiAgICAgIGlmIChvbmx5Q2xlYW4gJiYgIWNsZWFuQ29tcG9uZW50c1tpZF0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBkaXNwbGF5TmFtZSA9IG1lYXN1cmVtZW50LmRpc3BsYXlOYW1lc1tpZF07XG5cbiAgICAgIC8vIEluY2x1c2l2ZSB0aW1lIGlzIG5vdCB1c2VmdWwgZm9yIG1hbnkgY29tcG9uZW50cyB3aXRob3V0IGtub3dpbmcgd2hlcmVcbiAgICAgIC8vIHRoZXkgYXJlIGluc3RhbnRpYXRlZC4gU28gd2UgYWdncmVnYXRlIGluY2x1c2l2ZSB0aW1lIHdpdGggYm90aCB0aGVcbiAgICAgIC8vIG93bmVyIGFuZCBjdXJyZW50IGRpc3BsYXlOYW1lIGFzIHRoZSBrZXkuXG4gICAgICBpbmNsdXNpdmVLZXkgPSBkaXNwbGF5TmFtZS5vd25lciArICcgPiAnICsgZGlzcGxheU5hbWUuY3VycmVudDtcblxuICAgICAgY2FuZGlkYXRlc1tpbmNsdXNpdmVLZXldID0gY2FuZGlkYXRlc1tpbmNsdXNpdmVLZXldIHx8IHtcbiAgICAgICAgY29tcG9uZW50TmFtZTogaW5jbHVzaXZlS2V5LFxuICAgICAgICB0aW1lOiAwLFxuICAgICAgICBjb3VudDogMFxuICAgICAgfTtcblxuICAgICAgaWYgKG1lYXN1cmVtZW50LmluY2x1c2l2ZVtpZF0pIHtcbiAgICAgICAgY2FuZGlkYXRlc1tpbmNsdXNpdmVLZXldLnRpbWUgKz0gbWVhc3VyZW1lbnQuaW5jbHVzaXZlW2lkXTtcbiAgICAgIH1cbiAgICAgIGlmIChtZWFzdXJlbWVudC5jb3VudHNbaWRdKSB7XG4gICAgICAgIGNhbmRpZGF0ZXNbaW5jbHVzaXZlS2V5XS5jb3VudCArPSBtZWFzdXJlbWVudC5jb3VudHNbaWRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIE5vdyBtYWtlIGEgc29ydGVkIGFycmF5IHdpdGggdGhlIHJlc3VsdHMuXG4gIHZhciBhcnIgPSBbXTtcbiAgZm9yIChpbmNsdXNpdmVLZXkgaW4gY2FuZGlkYXRlcykge1xuICAgIGlmIChjYW5kaWRhdGVzW2luY2x1c2l2ZUtleV0udGltZSA+PSBET05UX0NBUkVfVEhSRVNIT0xEKSB7XG4gICAgICBhcnIucHVzaChjYW5kaWRhdGVzW2luY2x1c2l2ZUtleV0pO1xuICAgIH1cbiAgfVxuXG4gIGFyci5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIGIudGltZSAtIGEudGltZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gZ2V0VW5jaGFuZ2VkQ29tcG9uZW50cyhtZWFzdXJlbWVudCkge1xuICAvLyBGb3IgYSBnaXZlbiByZWNvbmNpbGUsIGxvb2sgYXQgd2hpY2ggY29tcG9uZW50cyBkaWQgbm90IGFjdHVhbGx5XG4gIC8vIHJlbmRlciBhbnl0aGluZyB0byB0aGUgRE9NIGFuZCByZXR1cm4gYSBtYXBwaW5nIG9mIHRoZWlyIElEIHRvXG4gIC8vIHRoZSBhbW91bnQgb2YgdGltZSBpdCB0b29rIHRvIHJlbmRlciB0aGUgZW50aXJlIHN1YnRyZWUuXG4gIHZhciBjbGVhbkNvbXBvbmVudHMgPSB7fTtcbiAgdmFyIGRpcnR5TGVhZklEcyA9IE9iamVjdC5rZXlzKG1lYXN1cmVtZW50LndyaXRlcyk7XG4gIHZhciBhbGxJRHMgPSBhc3NpZ24oe30sIG1lYXN1cmVtZW50LmV4Y2x1c2l2ZSwgbWVhc3VyZW1lbnQuaW5jbHVzaXZlKTtcblxuICBmb3IgKHZhciBpZCBpbiBhbGxJRHMpIHtcbiAgICB2YXIgaXNEaXJ0eSA9IGZhbHNlO1xuICAgIC8vIEZvciBlYWNoIGNvbXBvbmVudCB0aGF0IHJlbmRlcmVkLCBzZWUgaWYgYSBjb21wb25lbnQgdGhhdCB0cmlnZ2VyZWRcbiAgICAvLyBhIERPTSBvcCBpcyBpbiBpdHMgc3VidHJlZS5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpcnR5TGVhZklEcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGRpcnR5TGVhZklEc1tpXS5pbmRleE9mKGlkKSA9PT0gMCkge1xuICAgICAgICBpc0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGNoZWNrIGlmIGNvbXBvbmVudCBuZXdseSBjcmVhdGVkXG4gICAgaWYgKG1lYXN1cmVtZW50LmNyZWF0ZWRbaWRdKSB7XG4gICAgICBpc0RpcnR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCFpc0RpcnR5ICYmIG1lYXN1cmVtZW50LmNvdW50c1tpZF0gPiAwKSB7XG4gICAgICBjbGVhbkNvbXBvbmVudHNbaWRdID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNsZWFuQ29tcG9uZW50cztcbn1cblxudmFyIFJlYWN0RGVmYXVsdFBlcmZBbmFseXNpcyA9IHtcbiAgZ2V0RXhjbHVzaXZlU3VtbWFyeTogZ2V0RXhjbHVzaXZlU3VtbWFyeSxcbiAgZ2V0SW5jbHVzaXZlU3VtbWFyeTogZ2V0SW5jbHVzaXZlU3VtbWFyeSxcbiAgZ2V0RE9NU3VtbWFyeTogZ2V0RE9NU3VtbWFyeSxcbiAgZ2V0VG90YWxUaW1lOiBnZXRUb3RhbFRpbWVcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3REZWZhdWx0UGVyZkFuYWx5c2lzOyJdfQ==