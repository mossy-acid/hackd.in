'use strict';

var baseForRight = require('./_baseForRight'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwnRight(object, iteratee) {
  return object && baseForRight(object, iteratee, keys);
}

module.exports = baseForOwnRight;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlRm9yT3duUmlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGVBQWUsUUFBUSxpQkFBUixDQUFuQjtJQUNJLE9BQU8sUUFBUSxRQUFSLENBRFg7Ozs7Ozs7Ozs7QUFXQSxTQUFTLGVBQVQsQ0FBeUIsTUFBekIsRUFBaUMsUUFBakMsRUFBMkM7QUFDekMsU0FBTyxVQUFVLGFBQWEsTUFBYixFQUFxQixRQUFyQixFQUErQixJQUEvQixDQUFqQjtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixlQUFqQiIsImZpbGUiOiJfYmFzZUZvck93blJpZ2h0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJhc2VGb3JSaWdodCA9IHJlcXVpcmUoJy4vX2Jhc2VGb3JSaWdodCcpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JPd25SaWdodGAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JPd25SaWdodChvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgYmFzZUZvclJpZ2h0KG9iamVjdCwgaXRlcmF0ZWUsIGtleXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3JPd25SaWdodDtcbiJdfQ==