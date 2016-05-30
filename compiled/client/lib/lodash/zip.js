'use strict';

var rest = require('./rest'),
    unzip = require('./unzip');

/**
 * Creates an array of grouped elements, the first of which contains the
 * first elements of the given arrays, the second of which contains the
 * second elements of the given arrays, and so on.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to process.
 * @returns {Array} Returns the new array of grouped elements.
 * @example
 *
 * _.zip(['fred', 'barney'], [30, 40], [true, false]);
 * // => [['fred', 30, true], ['barney', 40, false]]
 */
var zip = rest(unzip);

module.exports = zip;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL3ppcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksT0FBTyxRQUFRLFFBQVIsQ0FBUDtJQUNBLFFBQVEsUUFBUSxTQUFSLENBQVI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCSixJQUFJLE1BQU0sS0FBSyxLQUFMLENBQU47O0FBRUosT0FBTyxPQUFQLEdBQWlCLEdBQWpCIiwiZmlsZSI6InppcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciByZXN0ID0gcmVxdWlyZSgnLi9yZXN0JyksXG4gICAgdW56aXAgPSByZXF1aXJlKCcuL3VuemlwJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBncm91cGVkIGVsZW1lbnRzLCB0aGUgZmlyc3Qgb2Ygd2hpY2ggY29udGFpbnMgdGhlXG4gKiBmaXJzdCBlbGVtZW50cyBvZiB0aGUgZ2l2ZW4gYXJyYXlzLCB0aGUgc2Vjb25kIG9mIHdoaWNoIGNvbnRhaW5zIHRoZVxuICogc2Vjb25kIGVsZW1lbnRzIG9mIHRoZSBnaXZlbiBhcnJheXMsIGFuZCBzbyBvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7Li4uQXJyYXl9IFthcnJheXNdIFRoZSBhcnJheXMgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGdyb3VwZWQgZWxlbWVudHMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uemlwKFsnZnJlZCcsICdiYXJuZXknXSwgWzMwLCA0MF0sIFt0cnVlLCBmYWxzZV0pO1xuICogLy8gPT4gW1snZnJlZCcsIDMwLCB0cnVlXSwgWydiYXJuZXknLCA0MCwgZmFsc2VdXVxuICovXG52YXIgemlwID0gcmVzdCh1bnppcCk7XG5cbm1vZHVsZS5leHBvcnRzID0gemlwO1xuIl19