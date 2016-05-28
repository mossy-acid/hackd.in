'use strict';

var isIterateeCall = require('./_isIterateeCall'),
    rest = require('./rest');

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return rest(function (object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVBc3NpZ25lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksaUJBQWlCLFFBQVEsbUJBQVIsQ0FBakI7SUFDQSxPQUFPLFFBQVEsUUFBUixDQUFQOzs7Ozs7Ozs7QUFTSixTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0M7QUFDaEMsU0FBTyxLQUFLLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQjtBQUNwQyxRQUFJLFFBQVEsQ0FBQyxDQUFEO1FBQ1IsU0FBUyxRQUFRLE1BQVI7UUFDVCxhQUFhLFNBQVMsQ0FBVCxHQUFhLFFBQVEsU0FBUyxDQUFULENBQXJCLEdBQW1DLFNBQW5DO1FBQ2IsUUFBUSxTQUFTLENBQVQsR0FBYSxRQUFRLENBQVIsQ0FBYixHQUEwQixTQUExQixDQUp3Qjs7QUFNcEMsaUJBQWEsUUFBQyxDQUFTLE1BQVQsR0FBa0IsQ0FBbEIsSUFBdUIsT0FBTyxVQUFQLElBQXFCLFVBQXJCLElBQ2hDLFVBQVUsVUFBVixDQURRLEdBRVQsU0FGUyxDQU51Qjs7QUFVcEMsUUFBSSxTQUFTLGVBQWUsUUFBUSxDQUFSLENBQWYsRUFBMkIsUUFBUSxDQUFSLENBQTNCLEVBQXVDLEtBQXZDLENBQVQsRUFBd0Q7QUFDMUQsbUJBQWEsU0FBUyxDQUFULEdBQWEsU0FBYixHQUF5QixVQUF6QixDQUQ2QztBQUUxRCxlQUFTLENBQVQsQ0FGMEQ7S0FBNUQ7QUFJQSxhQUFTLE9BQU8sTUFBUCxDQUFULENBZG9DO0FBZXBDLFdBQU8sRUFBRSxLQUFGLEdBQVUsTUFBVixFQUFrQjtBQUN2QixVQUFJLFNBQVMsUUFBUSxLQUFSLENBQVQsQ0FEbUI7QUFFdkIsVUFBSSxNQUFKLEVBQVk7QUFDVixpQkFBUyxNQUFULEVBQWlCLE1BQWpCLEVBQXlCLEtBQXpCLEVBQWdDLFVBQWhDLEVBRFU7T0FBWjtLQUZGO0FBTUEsV0FBTyxNQUFQLENBckJvQztHQUExQixDQUFaLENBRGdDO0NBQWxDOztBQTBCQSxPQUFPLE9BQVAsR0FBaUIsY0FBakIiLCJmaWxlIjoiX2NyZWF0ZUFzc2lnbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9faXNJdGVyYXRlZUNhbGwnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIGxpa2UgYF8uYXNzaWduYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXNzaWduZXIgVGhlIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhc3NpZ25lciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXNzaWduZXIoYXNzaWduZXIpIHtcbiAgcmV0dXJuIHJlc3QoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2VzKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IHNvdXJjZXMubGVuZ3RoLFxuICAgICAgICBjdXN0b21pemVyID0gbGVuZ3RoID4gMSA/IHNvdXJjZXNbbGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQsXG4gICAgICAgIGd1YXJkID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbMl0gOiB1bmRlZmluZWQ7XG5cbiAgICBjdXN0b21pemVyID0gKGFzc2lnbmVyLmxlbmd0aCA+IDMgJiYgdHlwZW9mIGN1c3RvbWl6ZXIgPT0gJ2Z1bmN0aW9uJylcbiAgICAgID8gKGxlbmd0aC0tLCBjdXN0b21pemVyKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoZ3VhcmQgJiYgaXNJdGVyYXRlZUNhbGwoc291cmNlc1swXSwgc291cmNlc1sxXSwgZ3VhcmQpKSB7XG4gICAgICBjdXN0b21pemVyID0gbGVuZ3RoIDwgMyA/IHVuZGVmaW5lZCA6IGN1c3RvbWl6ZXI7XG4gICAgICBsZW5ndGggPSAxO1xuICAgIH1cbiAgICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIHNvdXJjZSA9IHNvdXJjZXNbaW5kZXhdO1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBhc3NpZ25lcihvYmplY3QsIHNvdXJjZSwgaW5kZXgsIGN1c3RvbWl6ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVBc3NpZ25lcjtcbiJdfQ==