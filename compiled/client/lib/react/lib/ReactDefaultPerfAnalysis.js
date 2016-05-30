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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvcmVhY3QvbGliL1JlYWN0RGVmYXVsdFBlcmZBbmFseXNpcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVdBOztBQUVBLElBQUksU0FBUyxRQUFRLGlCQUFSLENBQWI7OztBQUdBLElBQUksc0JBQXNCLEdBQTFCO0FBQ0EsSUFBSSxzQkFBc0I7QUFDeEIseUJBQXVCLGVBREM7QUFFeEIsaUJBQWUsZUFGUztBQUd4QixpQkFBZSxNQUhTO0FBSXhCLGVBQWEsUUFKVztBQUt4QixjQUFZLGVBTFk7QUFNeEIsZ0JBQWMsaUJBTlU7QUFPeEIseUJBQXVCLGtCQVBDO0FBUXhCLDBCQUF3QixrQkFSQTtBQVN4Qiw0QkFBMEIsa0JBVEY7QUFVeEIsdUJBQXFCLGVBVkc7QUFXeEIsMkJBQXlCLFNBWEQ7QUFZeEIsdUJBQXFCO0FBWkcsQ0FBMUI7O0FBZUEsU0FBUyxZQUFULENBQXNCLFlBQXRCLEVBQW9DOzs7OztBQUtsQyxNQUFJLFlBQVksQ0FBaEI7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksYUFBYSxNQUFqQyxFQUF5QyxHQUF6QyxFQUE4QztBQUM1QyxRQUFJLGNBQWMsYUFBYSxDQUFiLENBQWxCO0FBQ0EsaUJBQWEsWUFBWSxTQUF6QjtBQUNEO0FBQ0QsU0FBTyxTQUFQO0FBQ0Q7O0FBRUQsU0FBUyxhQUFULENBQXVCLFlBQXZCLEVBQXFDO0FBQ25DLE1BQUksUUFBUSxFQUFaO0FBQ0EsZUFBYSxPQUFiLENBQXFCLFVBQVUsV0FBVixFQUF1QjtBQUMxQyxXQUFPLElBQVAsQ0FBWSxZQUFZLE1BQXhCLEVBQWdDLE9BQWhDLENBQXdDLFVBQVUsRUFBVixFQUFjO0FBQ3BELGtCQUFZLE1BQVosQ0FBbUIsRUFBbkIsRUFBdUIsT0FBdkIsQ0FBK0IsVUFBVSxLQUFWLEVBQWlCO0FBQzlDLGNBQU0sSUFBTixDQUFXO0FBQ1QsY0FBSSxFQURLO0FBRVQsZ0JBQU0sb0JBQW9C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YixFQUFnQixPQUFoQixDQUF3QixFQUF4QixNQUFnQyxDQUFwQyxFQUF1QztBQUNyQyxrQkFBVSxJQUFWO0FBQ0E7QUFDRDtBQUNGOztBQUVELFFBQUksWUFBWSxPQUFaLENBQW9CLEVBQXBCLENBQUosRUFBNkI7QUFDM0IsZ0JBQVUsSUFBVjtBQUNEO0FBQ0QsUUFBSSxDQUFDLE9BQUQsSUFBWSxZQUFZLE1BQVosQ0FBbUIsRUFBbkIsSUFBeUIsQ0FBekMsRUFBNEM7QUFDMUMsc0JBQWdCLEVBQWhCLElBQXNCLElBQXRCO0FBQ0Q7QUFDRjtBQUNELFNBQU8sZUFBUDtBQUNEOztBQUVELElBQUksMkJBQTJCO0FBQzdCLHVCQUFxQixtQkFEUTtBQUU3Qix1QkFBcUIsbUJBRlE7QUFHN0IsaUJBQWUsYUFIYztBQUk3QixnQkFBYztBQUplLENBQS9COztBQU9BLE9BQU8sT0FBUCxHQUFpQix3QkFBakIiLCJmaWxlIjoiUmVhY3REZWZhdWx0UGVyZkFuYWx5c2lzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0RGVmYXVsdFBlcmZBbmFseXNpc1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJy4vT2JqZWN0LmFzc2lnbicpO1xuXG4vLyBEb24ndCB0cnkgdG8gc2F2ZSB1c2VycyBsZXNzIHRoYW4gMS4ybXMgKGEgbnVtYmVyIEkgbWFkZSB1cClcbnZhciBET05UX0NBUkVfVEhSRVNIT0xEID0gMS4yO1xudmFyIERPTV9PUEVSQVRJT05fVFlQRVMgPSB7XG4gICdfbW91bnRJbWFnZUludG9Ob2RlJzogJ3NldCBpbm5lckhUTUwnLFxuICBJTlNFUlRfTUFSS1VQOiAnc2V0IGlubmVySFRNTCcsXG4gIE1PVkVfRVhJU1RJTkc6ICdtb3ZlJyxcbiAgUkVNT1ZFX05PREU6ICdyZW1vdmUnLFxuICBTRVRfTUFSS1VQOiAnc2V0IGlubmVySFRNTCcsXG4gIFRFWFRfQ09OVEVOVDogJ3NldCB0ZXh0Q29udGVudCcsXG4gICdzZXRWYWx1ZUZvclByb3BlcnR5JzogJ3VwZGF0ZSBhdHRyaWJ1dGUnLFxuICAnc2V0VmFsdWVGb3JBdHRyaWJ1dGUnOiAndXBkYXRlIGF0dHJpYnV0ZScsXG4gICdkZWxldGVWYWx1ZUZvclByb3BlcnR5JzogJ3JlbW92ZSBhdHRyaWJ1dGUnLFxuICAnc2V0VmFsdWVGb3JTdHlsZXMnOiAndXBkYXRlIHN0eWxlcycsXG4gICdyZXBsYWNlTm9kZVdpdGhNYXJrdXAnOiAncmVwbGFjZScsXG4gICd1cGRhdGVUZXh0Q29udGVudCc6ICdzZXQgdGV4dENvbnRlbnQnXG59O1xuXG5mdW5jdGlvbiBnZXRUb3RhbFRpbWUobWVhc3VyZW1lbnRzKSB7XG4gIC8vIFRPRE86IHJldHVybiBudW1iZXIgb2YgRE9NIG9wcz8gY291bGQgYmUgbWlzbGVhZGluZy5cbiAgLy8gVE9ETzogbWVhc3VyZSBkcm9wcGVkIGZyYW1lcyBhZnRlciByZWNvbmNpbGU/XG4gIC8vIFRPRE86IGxvZyB0b3RhbCB0aW1lIG9mIGVhY2ggcmVjb25jaWxlIGFuZCB0aGUgdG9wLWxldmVsIGNvbXBvbmVudFxuICAvLyBjbGFzcyB0aGF0IHRyaWdnZXJlZCBpdC5cbiAgdmFyIHRvdGFsVGltZSA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbWVhc3VyZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG1lYXN1cmVtZW50ID0gbWVhc3VyZW1lbnRzW2ldO1xuICAgIHRvdGFsVGltZSArPSBtZWFzdXJlbWVudC50b3RhbFRpbWU7XG4gIH1cbiAgcmV0dXJuIHRvdGFsVGltZTtcbn1cblxuZnVuY3Rpb24gZ2V0RE9NU3VtbWFyeShtZWFzdXJlbWVudHMpIHtcbiAgdmFyIGl0ZW1zID0gW107XG4gIG1lYXN1cmVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtZWFzdXJlbWVudCkge1xuICAgIE9iamVjdC5rZXlzKG1lYXN1cmVtZW50LndyaXRlcykuZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcbiAgICAgIG1lYXN1cmVtZW50LndyaXRlc1tpZF0uZm9yRWFjaChmdW5jdGlvbiAod3JpdGUpIHtcbiAgICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgIHR5cGU6IERPTV9PUEVSQVRJT05fVFlQRVNbd3JpdGUudHlwZV0gfHwgd3JpdGUudHlwZSxcbiAgICAgICAgICBhcmdzOiB3cml0ZS5hcmdzXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gaXRlbXM7XG59XG5cbmZ1bmN0aW9uIGdldEV4Y2x1c2l2ZVN1bW1hcnkobWVhc3VyZW1lbnRzKSB7XG4gIHZhciBjYW5kaWRhdGVzID0ge307XG4gIHZhciBkaXNwbGF5TmFtZTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG1lYXN1cmVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBtZWFzdXJlbWVudCA9IG1lYXN1cmVtZW50c1tpXTtcbiAgICB2YXIgYWxsSURzID0gYXNzaWduKHt9LCBtZWFzdXJlbWVudC5leGNsdXNpdmUsIG1lYXN1cmVtZW50LmluY2x1c2l2ZSk7XG5cbiAgICBmb3IgKHZhciBpZCBpbiBhbGxJRHMpIHtcbiAgICAgIGRpc3BsYXlOYW1lID0gbWVhc3VyZW1lbnQuZGlzcGxheU5hbWVzW2lkXS5jdXJyZW50O1xuXG4gICAgICBjYW5kaWRhdGVzW2Rpc3BsYXlOYW1lXSA9IGNhbmRpZGF0ZXNbZGlzcGxheU5hbWVdIHx8IHtcbiAgICAgICAgY29tcG9uZW50TmFtZTogZGlzcGxheU5hbWUsXG4gICAgICAgIGluY2x1c2l2ZTogMCxcbiAgICAgICAgZXhjbHVzaXZlOiAwLFxuICAgICAgICByZW5kZXI6IDAsXG4gICAgICAgIGNvdW50OiAwXG4gICAgICB9O1xuICAgICAgaWYgKG1lYXN1cmVtZW50LnJlbmRlcltpZF0pIHtcbiAgICAgICAgY2FuZGlkYXRlc1tkaXNwbGF5TmFtZV0ucmVuZGVyICs9IG1lYXN1cmVtZW50LnJlbmRlcltpZF07XG4gICAgICB9XG4gICAgICBpZiAobWVhc3VyZW1lbnQuZXhjbHVzaXZlW2lkXSkge1xuICAgICAgICBjYW5kaWRhdGVzW2Rpc3BsYXlOYW1lXS5leGNsdXNpdmUgKz0gbWVhc3VyZW1lbnQuZXhjbHVzaXZlW2lkXTtcbiAgICAgIH1cbiAgICAgIGlmIChtZWFzdXJlbWVudC5pbmNsdXNpdmVbaWRdKSB7XG4gICAgICAgIGNhbmRpZGF0ZXNbZGlzcGxheU5hbWVdLmluY2x1c2l2ZSArPSBtZWFzdXJlbWVudC5pbmNsdXNpdmVbaWRdO1xuICAgICAgfVxuICAgICAgaWYgKG1lYXN1cmVtZW50LmNvdW50c1tpZF0pIHtcbiAgICAgICAgY2FuZGlkYXRlc1tkaXNwbGF5TmFtZV0uY291bnQgKz0gbWVhc3VyZW1lbnQuY291bnRzW2lkXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBOb3cgbWFrZSBhIHNvcnRlZCBhcnJheSB3aXRoIHRoZSByZXN1bHRzLlxuICB2YXIgYXJyID0gW107XG4gIGZvciAoZGlzcGxheU5hbWUgaW4gY2FuZGlkYXRlcykge1xuICAgIGlmIChjYW5kaWRhdGVzW2Rpc3BsYXlOYW1lXS5leGNsdXNpdmUgPj0gRE9OVF9DQVJFX1RIUkVTSE9MRCkge1xuICAgICAgYXJyLnB1c2goY2FuZGlkYXRlc1tkaXNwbGF5TmFtZV0pO1xuICAgIH1cbiAgfVxuXG4gIGFyci5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIGIuZXhjbHVzaXZlIC0gYS5leGNsdXNpdmU7XG4gIH0pO1xuXG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIGdldEluY2x1c2l2ZVN1bW1hcnkobWVhc3VyZW1lbnRzLCBvbmx5Q2xlYW4pIHtcbiAgdmFyIGNhbmRpZGF0ZXMgPSB7fTtcbiAgdmFyIGluY2x1c2l2ZUtleTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG1lYXN1cmVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBtZWFzdXJlbWVudCA9IG1lYXN1cmVtZW50c1tpXTtcbiAgICB2YXIgYWxsSURzID0gYXNzaWduKHt9LCBtZWFzdXJlbWVudC5leGNsdXNpdmUsIG1lYXN1cmVtZW50LmluY2x1c2l2ZSk7XG4gICAgdmFyIGNsZWFuQ29tcG9uZW50cztcblxuICAgIGlmIChvbmx5Q2xlYW4pIHtcbiAgICAgIGNsZWFuQ29tcG9uZW50cyA9IGdldFVuY2hhbmdlZENvbXBvbmVudHMobWVhc3VyZW1lbnQpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGlkIGluIGFsbElEcykge1xuICAgICAgaWYgKG9ubHlDbGVhbiAmJiAhY2xlYW5Db21wb25lbnRzW2lkXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRpc3BsYXlOYW1lID0gbWVhc3VyZW1lbnQuZGlzcGxheU5hbWVzW2lkXTtcblxuICAgICAgLy8gSW5jbHVzaXZlIHRpbWUgaXMgbm90IHVzZWZ1bCBmb3IgbWFueSBjb21wb25lbnRzIHdpdGhvdXQga25vd2luZyB3aGVyZVxuICAgICAgLy8gdGhleSBhcmUgaW5zdGFudGlhdGVkLiBTbyB3ZSBhZ2dyZWdhdGUgaW5jbHVzaXZlIHRpbWUgd2l0aCBib3RoIHRoZVxuICAgICAgLy8gb3duZXIgYW5kIGN1cnJlbnQgZGlzcGxheU5hbWUgYXMgdGhlIGtleS5cbiAgICAgIGluY2x1c2l2ZUtleSA9IGRpc3BsYXlOYW1lLm93bmVyICsgJyA+ICcgKyBkaXNwbGF5TmFtZS5jdXJyZW50O1xuXG4gICAgICBjYW5kaWRhdGVzW2luY2x1c2l2ZUtleV0gPSBjYW5kaWRhdGVzW2luY2x1c2l2ZUtleV0gfHwge1xuICAgICAgICBjb21wb25lbnROYW1lOiBpbmNsdXNpdmVLZXksXG4gICAgICAgIHRpbWU6IDAsXG4gICAgICAgIGNvdW50OiAwXG4gICAgICB9O1xuXG4gICAgICBpZiAobWVhc3VyZW1lbnQuaW5jbHVzaXZlW2lkXSkge1xuICAgICAgICBjYW5kaWRhdGVzW2luY2x1c2l2ZUtleV0udGltZSArPSBtZWFzdXJlbWVudC5pbmNsdXNpdmVbaWRdO1xuICAgICAgfVxuICAgICAgaWYgKG1lYXN1cmVtZW50LmNvdW50c1tpZF0pIHtcbiAgICAgICAgY2FuZGlkYXRlc1tpbmNsdXNpdmVLZXldLmNvdW50ICs9IG1lYXN1cmVtZW50LmNvdW50c1tpZF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gTm93IG1ha2UgYSBzb3J0ZWQgYXJyYXkgd2l0aCB0aGUgcmVzdWx0cy5cbiAgdmFyIGFyciA9IFtdO1xuICBmb3IgKGluY2x1c2l2ZUtleSBpbiBjYW5kaWRhdGVzKSB7XG4gICAgaWYgKGNhbmRpZGF0ZXNbaW5jbHVzaXZlS2V5XS50aW1lID49IERPTlRfQ0FSRV9USFJFU0hPTEQpIHtcbiAgICAgIGFyci5wdXNoKGNhbmRpZGF0ZXNbaW5jbHVzaXZlS2V5XSk7XG4gICAgfVxuICB9XG5cbiAgYXJyLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gYi50aW1lIC0gYS50aW1lO1xuICB9KTtcblxuICByZXR1cm4gYXJyO1xufVxuXG5mdW5jdGlvbiBnZXRVbmNoYW5nZWRDb21wb25lbnRzKG1lYXN1cmVtZW50KSB7XG4gIC8vIEZvciBhIGdpdmVuIHJlY29uY2lsZSwgbG9vayBhdCB3aGljaCBjb21wb25lbnRzIGRpZCBub3QgYWN0dWFsbHlcbiAgLy8gcmVuZGVyIGFueXRoaW5nIHRvIHRoZSBET00gYW5kIHJldHVybiBhIG1hcHBpbmcgb2YgdGhlaXIgSUQgdG9cbiAgLy8gdGhlIGFtb3VudCBvZiB0aW1lIGl0IHRvb2sgdG8gcmVuZGVyIHRoZSBlbnRpcmUgc3VidHJlZS5cbiAgdmFyIGNsZWFuQ29tcG9uZW50cyA9IHt9O1xuICB2YXIgZGlydHlMZWFmSURzID0gT2JqZWN0LmtleXMobWVhc3VyZW1lbnQud3JpdGVzKTtcbiAgdmFyIGFsbElEcyA9IGFzc2lnbih7fSwgbWVhc3VyZW1lbnQuZXhjbHVzaXZlLCBtZWFzdXJlbWVudC5pbmNsdXNpdmUpO1xuXG4gIGZvciAodmFyIGlkIGluIGFsbElEcykge1xuICAgIHZhciBpc0RpcnR5ID0gZmFsc2U7XG4gICAgLy8gRm9yIGVhY2ggY29tcG9uZW50IHRoYXQgcmVuZGVyZWQsIHNlZSBpZiBhIGNvbXBvbmVudCB0aGF0IHRyaWdnZXJlZFxuICAgIC8vIGEgRE9NIG9wIGlzIGluIGl0cyBzdWJ0cmVlLlxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlydHlMZWFmSURzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZGlydHlMZWFmSURzW2ldLmluZGV4T2YoaWQpID09PSAwKSB7XG4gICAgICAgIGlzRGlydHkgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gY2hlY2sgaWYgY29tcG9uZW50IG5ld2x5IGNyZWF0ZWRcbiAgICBpZiAobWVhc3VyZW1lbnQuY3JlYXRlZFtpZF0pIHtcbiAgICAgIGlzRGlydHkgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIWlzRGlydHkgJiYgbWVhc3VyZW1lbnQuY291bnRzW2lkXSA+IDApIHtcbiAgICAgIGNsZWFuQ29tcG9uZW50c1tpZF0gPSB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY2xlYW5Db21wb25lbnRzO1xufVxuXG52YXIgUmVhY3REZWZhdWx0UGVyZkFuYWx5c2lzID0ge1xuICBnZXRFeGNsdXNpdmVTdW1tYXJ5OiBnZXRFeGNsdXNpdmVTdW1tYXJ5LFxuICBnZXRJbmNsdXNpdmVTdW1tYXJ5OiBnZXRJbmNsdXNpdmVTdW1tYXJ5LFxuICBnZXRET01TdW1tYXJ5OiBnZXRET01TdW1tYXJ5LFxuICBnZXRUb3RhbFRpbWU6IGdldFRvdGFsVGltZVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdERlZmF1bHRQZXJmQW5hbHlzaXM7Il19