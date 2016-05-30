'use strict';

var arrayEach = require('./_arrayEach'),
    arrayPush = require('./_arrayPush'),
    baseFunctions = require('./_baseFunctions'),
    copyArray = require('./_copyArray'),
    isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    keys = require('./keys');

/**
 * Adds all own enumerable string keyed function properties of a source
 * object to the destination object. If `object` is a function, then methods
 * are added to its prototype as well.
 *
 * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
 * avoid conflicts caused by modifying the original.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {Function|Object} [object=lodash] The destination object.
 * @param {Object} source The object of functions to add.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
 * @returns {Function|Object} Returns `object`.
 * @example
 *
 * function vowels(string) {
 *   return _.filter(string, function(v) {
 *     return /[aeiou]/i.test(v);
 *   });
 * }
 *
 * _.mixin({ 'vowels': vowels });
 * _.vowels('fred');
 * // => ['e']
 *
 * _('fred').vowels().value();
 * // => ['e']
 *
 * _.mixin({ 'vowels': vowels }, { 'chain': false });
 * _('fred').vowels();
 * // => ['e']
 */
function mixin(object, source, options) {
  var props = keys(source),
      methodNames = baseFunctions(source, props);

  var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
      isFunc = isFunction(object);

  arrayEach(methodNames, function (methodName) {
    var func = source[methodName];
    object[methodName] = func;
    if (isFunc) {
      object.prototype[methodName] = function () {
        var chainAll = this.__chain__;
        if (chain || chainAll) {
          var result = object(this.__wrapped__),
              actions = result.__actions__ = copyArray(this.__actions__);

          actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
          result.__chain__ = chainAll;
          return result;
        }
        return func.apply(object, arrayPush([this.value()], arguments));
      };
    }
  });

  return object;
}

module.exports = mixin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL21peGluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFaO0lBQ0EsWUFBWSxRQUFRLGNBQVIsQ0FBWjtJQUNBLGdCQUFnQixRQUFRLGtCQUFSLENBQWhCO0lBQ0EsWUFBWSxRQUFRLGNBQVIsQ0FBWjtJQUNBLGFBQWEsUUFBUSxjQUFSLENBQWI7SUFDQSxXQUFXLFFBQVEsWUFBUixDQUFYO0lBQ0EsT0FBTyxRQUFRLFFBQVIsQ0FBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQ0osU0FBUyxLQUFULENBQWUsTUFBZixFQUF1QixNQUF2QixFQUErQixPQUEvQixFQUF3QztBQUN0QyxNQUFJLFFBQVEsS0FBSyxNQUFMLENBQVI7TUFDQSxjQUFjLGNBQWMsTUFBZCxFQUFzQixLQUF0QixDQUFkLENBRmtDOztBQUl0QyxNQUFJLFFBQVEsRUFBRSxTQUFTLE9BQVQsS0FBcUIsV0FBVyxPQUFYLENBQXZCLElBQThDLENBQUMsQ0FBQyxRQUFRLEtBQVI7TUFDeEQsU0FBUyxXQUFXLE1BQVgsQ0FBVCxDQUxrQzs7QUFPdEMsWUFBVSxXQUFWLEVBQXVCLFVBQVMsVUFBVCxFQUFxQjtBQUMxQyxRQUFJLE9BQU8sT0FBTyxVQUFQLENBQVAsQ0FEc0M7QUFFMUMsV0FBTyxVQUFQLElBQXFCLElBQXJCLENBRjBDO0FBRzFDLFFBQUksTUFBSixFQUFZO0FBQ1YsYUFBTyxTQUFQLENBQWlCLFVBQWpCLElBQStCLFlBQVc7QUFDeEMsWUFBSSxXQUFXLEtBQUssU0FBTCxDQUR5QjtBQUV4QyxZQUFJLFNBQVMsUUFBVCxFQUFtQjtBQUNyQixjQUFJLFNBQVMsT0FBTyxLQUFLLFdBQUwsQ0FBaEI7Y0FDQSxVQUFVLE9BQU8sV0FBUCxHQUFxQixVQUFVLEtBQUssV0FBTCxDQUEvQixDQUZPOztBQUlyQixrQkFBUSxJQUFSLENBQWEsRUFBRSxRQUFRLElBQVIsRUFBYyxRQUFRLFNBQVIsRUFBbUIsV0FBVyxNQUFYLEVBQWhELEVBSnFCO0FBS3JCLGlCQUFPLFNBQVAsR0FBbUIsUUFBbkIsQ0FMcUI7QUFNckIsaUJBQU8sTUFBUCxDQU5xQjtTQUF2QjtBQVFBLGVBQU8sS0FBSyxLQUFMLENBQVcsTUFBWCxFQUFtQixVQUFVLENBQUMsS0FBSyxLQUFMLEVBQUQsQ0FBVixFQUEwQixTQUExQixDQUFuQixDQUFQLENBVndDO09BQVgsQ0FEckI7S0FBWjtHQUhxQixDQUF2QixDQVBzQzs7QUEwQnRDLFNBQU8sTUFBUCxDQTFCc0M7Q0FBeEM7O0FBNkJBLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJtaXhpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcnJheUVhY2ggPSByZXF1aXJlKCcuL19hcnJheUVhY2gnKSxcbiAgICBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBiYXNlRnVuY3Rpb25zID0gcmVxdWlyZSgnLi9fYmFzZUZ1bmN0aW9ucycpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpLFxuICAgIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQWRkcyBhbGwgb3duIGVudW1lcmFibGUgc3RyaW5nIGtleWVkIGZ1bmN0aW9uIHByb3BlcnRpZXMgb2YgYSBzb3VyY2VcbiAqIG9iamVjdCB0byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LiBJZiBgb2JqZWN0YCBpcyBhIGZ1bmN0aW9uLCB0aGVuIG1ldGhvZHNcbiAqIGFyZSBhZGRlZCB0byBpdHMgcHJvdG90eXBlIGFzIHdlbGwuXG4gKlxuICogKipOb3RlOioqIFVzZSBgXy5ydW5JbkNvbnRleHRgIHRvIGNyZWF0ZSBhIHByaXN0aW5lIGBsb2Rhc2hgIGZ1bmN0aW9uIHRvXG4gKiBhdm9pZCBjb25mbGljdHMgY2F1c2VkIGJ5IG1vZGlmeWluZyB0aGUgb3JpZ2luYWwuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fSBbb2JqZWN0PWxvZGFzaF0gVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBmdW5jdGlvbnMgdG8gYWRkLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmNoYWluPXRydWVdIFNwZWNpZnkgd2hldGhlciBtaXhpbnMgYXJlIGNoYWluYWJsZS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbnxPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIHZvd2VscyhzdHJpbmcpIHtcbiAqICAgcmV0dXJuIF8uZmlsdGVyKHN0cmluZywgZnVuY3Rpb24odikge1xuICogICAgIHJldHVybiAvW2FlaW91XS9pLnRlc3Qodik7XG4gKiAgIH0pO1xuICogfVxuICpcbiAqIF8ubWl4aW4oeyAndm93ZWxzJzogdm93ZWxzIH0pO1xuICogXy52b3dlbHMoJ2ZyZWQnKTtcbiAqIC8vID0+IFsnZSddXG4gKlxuICogXygnZnJlZCcpLnZvd2VscygpLnZhbHVlKCk7XG4gKiAvLyA9PiBbJ2UnXVxuICpcbiAqIF8ubWl4aW4oeyAndm93ZWxzJzogdm93ZWxzIH0sIHsgJ2NoYWluJzogZmFsc2UgfSk7XG4gKiBfKCdmcmVkJykudm93ZWxzKCk7XG4gKiAvLyA9PiBbJ2UnXVxuICovXG5mdW5jdGlvbiBtaXhpbihvYmplY3QsIHNvdXJjZSwgb3B0aW9ucykge1xuICB2YXIgcHJvcHMgPSBrZXlzKHNvdXJjZSksXG4gICAgICBtZXRob2ROYW1lcyA9IGJhc2VGdW5jdGlvbnMoc291cmNlLCBwcm9wcyk7XG5cbiAgdmFyIGNoYWluID0gIShpc09iamVjdChvcHRpb25zKSAmJiAnY2hhaW4nIGluIG9wdGlvbnMpIHx8ICEhb3B0aW9ucy5jaGFpbixcbiAgICAgIGlzRnVuYyA9IGlzRnVuY3Rpb24ob2JqZWN0KTtcblxuICBhcnJheUVhY2gobWV0aG9kTmFtZXMsIGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICB2YXIgZnVuYyA9IHNvdXJjZVttZXRob2ROYW1lXTtcbiAgICBvYmplY3RbbWV0aG9kTmFtZV0gPSBmdW5jO1xuICAgIGlmIChpc0Z1bmMpIHtcbiAgICAgIG9iamVjdC5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNoYWluQWxsID0gdGhpcy5fX2NoYWluX187XG4gICAgICAgIGlmIChjaGFpbiB8fCBjaGFpbkFsbCkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSBvYmplY3QodGhpcy5fX3dyYXBwZWRfXyksXG4gICAgICAgICAgICAgIGFjdGlvbnMgPSByZXN1bHQuX19hY3Rpb25zX18gPSBjb3B5QXJyYXkodGhpcy5fX2FjdGlvbnNfXyk7XG5cbiAgICAgICAgICBhY3Rpb25zLnB1c2goeyAnZnVuYyc6IGZ1bmMsICdhcmdzJzogYXJndW1lbnRzLCAndGhpc0FyZyc6IG9iamVjdCB9KTtcbiAgICAgICAgICByZXN1bHQuX19jaGFpbl9fID0gY2hhaW5BbGw7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuYy5hcHBseShvYmplY3QsIGFycmF5UHVzaChbdGhpcy52YWx1ZSgpXSwgYXJndW1lbnRzKSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtaXhpbjtcbiJdfQ==