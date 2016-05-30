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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19jcmVhdGVBc3NpZ25lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksaUJBQWlCLFFBQVEsbUJBQVIsQ0FBckI7SUFDSSxPQUFPLFFBQVEsUUFBUixDQURYOzs7Ozs7Ozs7QUFVQSxTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0M7QUFDaEMsU0FBTyxLQUFLLFVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQjtBQUNwQyxRQUFJLFFBQVEsQ0FBQyxDQUFiO1FBQ0ksU0FBUyxRQUFRLE1BRHJCO1FBRUksYUFBYSxTQUFTLENBQVQsR0FBYSxRQUFRLFNBQVMsQ0FBakIsQ0FBYixHQUFtQyxTQUZwRDtRQUdJLFFBQVEsU0FBUyxDQUFULEdBQWEsUUFBUSxDQUFSLENBQWIsR0FBMEIsU0FIdEM7O0FBS0EsaUJBQWMsU0FBUyxNQUFULEdBQWtCLENBQWxCLElBQXVCLE9BQU8sVUFBUCxJQUFxQixVQUE3QyxJQUNSLFVBQVUsVUFERixJQUVULFNBRko7O0FBSUEsUUFBSSxTQUFTLGVBQWUsUUFBUSxDQUFSLENBQWYsRUFBMkIsUUFBUSxDQUFSLENBQTNCLEVBQXVDLEtBQXZDLENBQWIsRUFBNEQ7QUFDMUQsbUJBQWEsU0FBUyxDQUFULEdBQWEsU0FBYixHQUF5QixVQUF0QztBQUNBLGVBQVMsQ0FBVDtBQUNEO0FBQ0QsYUFBUyxPQUFPLE1BQVAsQ0FBVDtBQUNBLFdBQU8sRUFBRSxLQUFGLEdBQVUsTUFBakIsRUFBeUI7QUFDdkIsVUFBSSxTQUFTLFFBQVEsS0FBUixDQUFiO0FBQ0EsVUFBSSxNQUFKLEVBQVk7QUFDVixpQkFBUyxNQUFULEVBQWlCLE1BQWpCLEVBQXlCLEtBQXpCLEVBQWdDLFVBQWhDO0FBQ0Q7QUFDRjtBQUNELFdBQU8sTUFBUDtBQUNELEdBdEJNLENBQVA7QUF1QkQ7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLGNBQWpCIiwiZmlsZSI6Il9jcmVhdGVBc3NpZ25lci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vX2lzSXRlcmF0ZWVDYWxsJyksXG4gICAgcmVzdCA9IHJlcXVpcmUoJy4vcmVzdCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiBsaWtlIGBfLmFzc2lnbmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFzc2lnbmVyIFRoZSBmdW5jdGlvbiB0byBhc3NpZ24gdmFsdWVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYXNzaWduZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUFzc2lnbmVyKGFzc2lnbmVyKSB7XG4gIHJldHVybiByZXN0KGZ1bmN0aW9uKG9iamVjdCwgc291cmNlcykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBzb3VyY2VzLmxlbmd0aCxcbiAgICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA+IDEgPyBzb3VyY2VzW2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkLFxuICAgICAgICBndWFyZCA9IGxlbmd0aCA+IDIgPyBzb3VyY2VzWzJdIDogdW5kZWZpbmVkO1xuXG4gICAgY3VzdG9taXplciA9IChhc3NpZ25lci5sZW5ndGggPiAzICYmIHR5cGVvZiBjdXN0b21pemVyID09ICdmdW5jdGlvbicpXG4gICAgICA/IChsZW5ndGgtLSwgY3VzdG9taXplcilcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA8IDMgPyB1bmRlZmluZWQgOiBjdXN0b21pemVyO1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGluZGV4LCBjdXN0b21pemVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQXNzaWduZXI7XG4iXX0=