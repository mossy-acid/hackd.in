'use strict';

var apply = require('./_apply'),
    castPath = require('./_castPath'),
    isKey = require('./_isKey'),
    last = require('./last'),
    parent = require('./_parent'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.invoke` without support for individual
 * method arguments.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {Array} args The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 */
function baseInvoke(object, path, args) {
  if (!isKey(path, object)) {
    path = castPath(path);
    object = parent(object, path);
    path = last(path);
  }
  var func = object == null ? object : object[toKey(path)];
  return func == null ? undefined : apply(func, object, args);
}

module.exports = baseInvoke;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19iYXNlSW52b2tlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxRQUFRLFFBQVEsVUFBUixDQUFaO0lBQ0ksV0FBVyxRQUFRLGFBQVIsQ0FEZjtJQUVJLFFBQVEsUUFBUSxVQUFSLENBRlo7SUFHSSxPQUFPLFFBQVEsUUFBUixDQUhYO0lBSUksU0FBUyxRQUFRLFdBQVIsQ0FKYjtJQUtJLFFBQVEsUUFBUSxVQUFSLENBTFo7Ozs7Ozs7Ozs7OztBQWlCQSxTQUFTLFVBQVQsQ0FBb0IsTUFBcEIsRUFBNEIsSUFBNUIsRUFBa0MsSUFBbEMsRUFBd0M7QUFDdEMsTUFBSSxDQUFDLE1BQU0sSUFBTixFQUFZLE1BQVosQ0FBTCxFQUEwQjtBQUN4QixXQUFPLFNBQVMsSUFBVCxDQUFQO0FBQ0EsYUFBUyxPQUFPLE1BQVAsRUFBZSxJQUFmLENBQVQ7QUFDQSxXQUFPLEtBQUssSUFBTCxDQUFQO0FBQ0Q7QUFDRCxNQUFJLE9BQU8sVUFBVSxJQUFWLEdBQWlCLE1BQWpCLEdBQTBCLE9BQU8sTUFBTSxJQUFOLENBQVAsQ0FBckM7QUFDQSxTQUFPLFFBQVEsSUFBUixHQUFlLFNBQWYsR0FBMkIsTUFBTSxJQUFOLEVBQVksTUFBWixFQUFvQixJQUFwQixDQUFsQztBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixVQUFqQiIsImZpbGUiOiJfYmFzZUludm9rZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHBseSA9IHJlcXVpcmUoJy4vX2FwcGx5JyksXG4gICAgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBsYXN0ID0gcmVxdWlyZSgnLi9sYXN0JyksXG4gICAgcGFyZW50ID0gcmVxdWlyZSgnLi9fcGFyZW50JyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmludm9rZWAgd2l0aG91dCBzdXBwb3J0IGZvciBpbmRpdmlkdWFsXG4gKiBtZXRob2QgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgbWV0aG9kIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBpbnZva2UgdGhlIG1ldGhvZCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgaW52b2tlZCBtZXRob2QuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbnZva2Uob2JqZWN0LCBwYXRoLCBhcmdzKSB7XG4gIGlmICghaXNLZXkocGF0aCwgb2JqZWN0KSkge1xuICAgIHBhdGggPSBjYXN0UGF0aChwYXRoKTtcbiAgICBvYmplY3QgPSBwYXJlbnQob2JqZWN0LCBwYXRoKTtcbiAgICBwYXRoID0gbGFzdChwYXRoKTtcbiAgfVxuICB2YXIgZnVuYyA9IG9iamVjdCA9PSBudWxsID8gb2JqZWN0IDogb2JqZWN0W3RvS2V5KHBhdGgpXTtcbiAgcmV0dXJuIGZ1bmMgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IGFwcGx5KGZ1bmMsIG9iamVjdCwgYXJncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUludm9rZTtcbiJdfQ==