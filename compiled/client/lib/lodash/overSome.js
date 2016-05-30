'use strict';

var arraySome = require('./_arraySome'),
    createOver = require('./_createOver');

/**
 * Creates a function that checks if **any** of the `predicates` return
 * truthy when invoked with the arguments it receives.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
 *  [predicates=[_.identity]] The predicates to check.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var func = _.overSome([Boolean, isFinite]);
 *
 * func('1');
 * // => true
 *
 * func(null);
 * // => true
 *
 * func(NaN);
 * // => false
 */
var overSome = createOver(arraySome);

module.exports = overSome;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL292ZXJTb21lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsYUFBYSxRQUFRLGVBQVIsQ0FBYjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkosSUFBSSxXQUFXLFdBQVcsU0FBWCxDQUFYOztBQUVKLE9BQU8sT0FBUCxHQUFpQixRQUFqQiIsImZpbGUiOiJvdmVyU29tZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcnJheVNvbWUgPSByZXF1aXJlKCcuL19hcnJheVNvbWUnKSxcbiAgICBjcmVhdGVPdmVyID0gcmVxdWlyZSgnLi9fY3JlYXRlT3ZlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGNoZWNrcyBpZiAqKmFueSoqIG9mIHRoZSBgcHJlZGljYXRlc2AgcmV0dXJuXG4gKiB0cnV0aHkgd2hlbiBpbnZva2VkIHdpdGggdGhlIGFyZ3VtZW50cyBpdCByZWNlaXZlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsuLi4oQXJyYXl8QXJyYXlbXXxGdW5jdGlvbnxGdW5jdGlvbltdfE9iamVjdHxPYmplY3RbXXxzdHJpbmd8c3RyaW5nW10pfVxuICogIFtwcmVkaWNhdGVzPVtfLmlkZW50aXR5XV0gVGhlIHByZWRpY2F0ZXMgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGZ1bmMgPSBfLm92ZXJTb21lKFtCb29sZWFuLCBpc0Zpbml0ZV0pO1xuICpcbiAqIGZ1bmMoJzEnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBmdW5jKG51bGwpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIGZ1bmMoTmFOKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBvdmVyU29tZSA9IGNyZWF0ZU92ZXIoYXJyYXlTb21lKTtcblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyU29tZTtcbiJdfQ==