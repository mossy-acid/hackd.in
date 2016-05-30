"use strict";

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `Map#set` because it doesn't return the map instance in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

module.exports = addMapEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19hZGRNYXBFbnRyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBUUEsU0FBUyxXQUFULENBQXFCLEdBQXJCLEVBQTBCLElBQTFCLEVBQWdDOztBQUU5QixNQUFJLEdBQUosQ0FBUSxLQUFLLENBQUwsQ0FBUixFQUFpQixLQUFLLENBQUwsQ0FBakI7QUFDQSxTQUFPLEdBQVA7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsV0FBakIiLCJmaWxlIjoiX2FkZE1hcEVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBZGRzIHRoZSBrZXktdmFsdWUgYHBhaXJgIHRvIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gcGFpciBUaGUga2V5LXZhbHVlIHBhaXIgdG8gYWRkLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgbWFwYC5cbiAqL1xuZnVuY3Rpb24gYWRkTWFwRW50cnkobWFwLCBwYWlyKSB7XG4gIC8vIERvbid0IHJldHVybiBgTWFwI3NldGAgYmVjYXVzZSBpdCBkb2Vzbid0IHJldHVybiB0aGUgbWFwIGluc3RhbmNlIGluIElFIDExLlxuICBtYXAuc2V0KHBhaXJbMF0sIHBhaXJbMV0pO1xuICByZXR1cm4gbWFwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZE1hcEVudHJ5O1xuIl19