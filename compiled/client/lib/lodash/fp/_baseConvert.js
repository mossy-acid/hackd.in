'use strict';

var mapping = require('./_mapping'),
    mutateMap = mapping.mutate,
    fallbackHolder = require('./placeholder');

/**
 * Creates a function, with an arity of `n`, that invokes `func` with the
 * arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} n The arity of the new function.
 * @returns {Function} Returns the new function.
 */
function baseArity(func, n) {
  return n == 2 ? function (a, b) {
    return func.apply(undefined, arguments);
  } : function (a) {
    return func.apply(undefined, arguments);
  };
}

/**
 * Creates a function that invokes `func`, with up to `n` arguments, ignoring
 * any additional arguments.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @param {number} n The arity cap.
 * @returns {Function} Returns the new function.
 */
function baseAry(func, n) {
  return n == 2 ? function (a, b) {
    return func(a, b);
  } : function (a) {
    return func(a);
  };
}

/**
 * Creates a clone of `array`.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the cloned array.
 */
function cloneArray(array) {
  var length = array ? array.length : 0,
      result = Array(length);

  while (length--) {
    result[length] = array[length];
  }
  return result;
}

/**
 * Creates a function that clones a given object using the assignment `func`.
 *
 * @private
 * @param {Function} func The assignment function.
 * @returns {Function} Returns the new cloner function.
 */
function createCloner(func) {
  return function (object) {
    return func({}, object);
  };
}

/**
 * Creates a function that wraps `func` and uses `cloner` to clone the first
 * argument it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} cloner The function to clone arguments.
 * @returns {Function} Returns the new immutable function.
 */
function immutWrap(func, cloner) {
  return function () {
    var length = arguments.length;
    if (!length) {
      return result;
    }
    var args = Array(length);
    while (length--) {
      args[length] = arguments[length];
    }
    var result = args[0] = cloner.apply(undefined, args);
    func.apply(undefined, args);
    return result;
  };
}

/**
 * The base implementation of `convert` which accepts a `util` object of methods
 * required to perform conversions.
 *
 * @param {Object} util The util object.
 * @param {string} name The name of the function to convert.
 * @param {Function} func The function to convert.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.cap=true] Specify capping iteratee arguments.
 * @param {boolean} [options.curry=true] Specify currying.
 * @param {boolean} [options.fixed=true] Specify fixed arity.
 * @param {boolean} [options.immutable=true] Specify immutable operations.
 * @param {boolean} [options.rearg=true] Specify rearranging arguments.
 * @returns {Function|Object} Returns the converted function or object.
 */
function baseConvert(util, name, func, options) {
  var setPlaceholder,
      isLib = typeof name == 'function',
      isObj = name === Object(name);

  if (isObj) {
    options = func;
    func = name;
    name = undefined;
  }
  if (func == null) {
    throw new TypeError();
  }
  options || (options = {});

  var config = {
    'cap': 'cap' in options ? options.cap : true,
    'curry': 'curry' in options ? options.curry : true,
    'fixed': 'fixed' in options ? options.fixed : true,
    'immutable': 'immutable' in options ? options.immutable : true,
    'rearg': 'rearg' in options ? options.rearg : true
  };

  var forceCurry = 'curry' in options && options.curry,
      forceFixed = 'fixed' in options && options.fixed,
      forceRearg = 'rearg' in options && options.rearg,
      placeholder = isLib ? func : fallbackHolder,
      pristine = isLib ? func.runInContext() : undefined;

  var helpers = isLib ? func : {
    'ary': util.ary,
    'assign': util.assign,
    'clone': util.clone,
    'curry': util.curry,
    'forEach': util.forEach,
    'isArray': util.isArray,
    'isFunction': util.isFunction,
    'iteratee': util.iteratee,
    'keys': util.keys,
    'rearg': util.rearg,
    'spread': util.spread,
    'toPath': util.toPath
  };

  var ary = helpers.ary,
      assign = helpers.assign,
      clone = helpers.clone,
      curry = helpers.curry,
      each = helpers.forEach,
      isArray = helpers.isArray,
      isFunction = helpers.isFunction,
      keys = helpers.keys,
      rearg = helpers.rearg,
      spread = helpers.spread,
      toPath = helpers.toPath;

  var aryMethodKeys = keys(mapping.aryMethod);

  var wrappers = {
    'castArray': function castArray(_castArray) {
      return function () {
        var value = arguments[0];
        return isArray(value) ? _castArray(cloneArray(value)) : _castArray.apply(undefined, arguments);
      };
    },
    'iteratee': function iteratee(_iteratee) {
      return function () {
        var func = arguments[0],
            arity = arguments[1],
            result = _iteratee(func, arity),
            length = result.length;

        if (config.cap && typeof arity == 'number') {
          arity = arity > 2 ? arity - 2 : 1;
          return length && length <= arity ? result : baseAry(result, arity);
        }
        return result;
      };
    },
    'mixin': function mixin(_mixin) {
      return function (source) {
        var func = this;
        if (!isFunction(func)) {
          return _mixin(func, Object(source));
        }
        var pairs = [];
        each(keys(source), function (key) {
          if (isFunction(source[key])) {
            pairs.push([key, func.prototype[key]]);
          }
        });

        _mixin(func, Object(source));

        each(pairs, function (pair) {
          var value = pair[1];
          if (isFunction(value)) {
            func.prototype[pair[0]] = value;
          } else {
            delete func.prototype[pair[0]];
          }
        });
        return func;
      };
    },
    'runInContext': function runInContext(_runInContext) {
      return function (context) {
        return baseConvert(util, _runInContext(context), options);
      };
    }
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a clone of `object` by `path`.
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {Array|string} path The path to clone by.
   * @returns {Object} Returns the cloned object.
   */
  function cloneByPath(object, path) {
    path = toPath(path);

    var index = -1,
        length = path.length,
        lastIndex = length - 1,
        result = clone(Object(object)),
        nested = result;

    while (nested != null && ++index < length) {
      var key = path[index],
          value = nested[key];

      if (value != null) {
        nested[path[index]] = clone(index == lastIndex ? value : Object(value));
      }
      nested = nested[key];
    }
    return result;
  }

  /**
   * Converts `lodash` to an immutable auto-curried iteratee-first data-last
   * version with conversion `options` applied.
   *
   * @param {Object} [options] The options object. See `baseConvert` for more details.
   * @returns {Function} Returns the converted `lodash`.
   */
  function convertLib(options) {
    return _.runInContext.convert(options)(undefined);
  }

  /**
   * Create a converter function for `func` of `name`.
   *
   * @param {string} name The name of the function to convert.
   * @param {Function} func The function to convert.
   * @returns {Function} Returns the new converter function.
   */
  function createConverter(name, func) {
    var oldOptions = options;
    return function (options) {
      var newUtil = isLib ? pristine : helpers,
          newFunc = isLib ? pristine[name] : func,
          newOptions = assign(assign({}, oldOptions), options);

      return baseConvert(newUtil, name, newFunc, newOptions);
    };
  }

  /**
   * Creates a function that wraps `func` to invoke its iteratee, with up to `n`
   * arguments, ignoring any additional arguments.
   *
   * @private
   * @param {Function} func The function to cap iteratee arguments for.
   * @param {number} n The arity cap.
   * @returns {Function} Returns the new function.
   */
  function iterateeAry(func, n) {
    return overArg(func, function (func) {
      return typeof func == 'function' ? baseAry(func, n) : func;
    });
  }

  /**
   * Creates a function that wraps `func` to invoke its iteratee with arguments
   * arranged according to the specified `indexes` where the argument value at
   * the first index is provided as the first argument, the argument value at
   * the second index is provided as the second argument, and so on.
   *
   * @private
   * @param {Function} func The function to rearrange iteratee arguments for.
   * @param {number[]} indexes The arranged argument indexes.
   * @returns {Function} Returns the new function.
   */
  function iterateeRearg(func, indexes) {
    return overArg(func, function (func) {
      var n = indexes.length;
      return baseArity(rearg(baseAry(func, n), indexes), n);
    });
  }

  /**
   * Creates a function that invokes `func` with its first argument passed
   * thru `transform`.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {...Function} transform The functions to transform the first argument.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function () {
      var length = arguments.length;
      if (!length) {
        return func();
      }
      var args = Array(length);
      while (length--) {
        args[length] = arguments[length];
      }
      var index = config.rearg ? 0 : length - 1;
      args[index] = transform(args[index]);
      return func.apply(undefined, args);
    };
  }

  /**
   * Creates a function that wraps `func` and applys the conversions
   * rules by `name`.
   *
   * @private
   * @param {string} name The name of the function to wrap.
   * @param {Function} func The function to wrap.
   * @returns {Function} Returns the converted function.
   */
  function wrap(name, func) {
    name = mapping.aliasToReal[name] || name;

    var result,
        wrapped = func,
        wrapper = wrappers[name];

    if (wrapper) {
      wrapped = wrapper(func);
    } else if (config.immutable) {
      if (mutateMap.array[name]) {
        wrapped = immutWrap(func, cloneArray);
      } else if (mutateMap.object[name]) {
        wrapped = immutWrap(func, createCloner(func));
      } else if (mutateMap.set[name]) {
        wrapped = immutWrap(func, cloneByPath);
      }
    }
    each(aryMethodKeys, function (aryKey) {
      each(mapping.aryMethod[aryKey], function (otherName) {
        if (name == otherName) {
          var aryN = !isLib && mapping.iterateeAry[name],
              reargIndexes = mapping.iterateeRearg[name],
              spreadStart = mapping.methodSpread[name];

          result = wrapped;
          if (config.fixed && (forceFixed || !mapping.skipFixed[name])) {
            result = spreadStart === undefined ? ary(result, aryKey) : spread(result, spreadStart);
          }
          if (config.rearg && aryKey > 1 && (forceRearg || !mapping.skipRearg[name])) {
            result = rearg(result, mapping.methodRearg[name] || mapping.aryRearg[aryKey]);
          }
          if (config.cap) {
            if (reargIndexes) {
              result = iterateeRearg(result, reargIndexes);
            } else if (aryN) {
              result = iterateeAry(result, aryN);
            }
          }
          if (forceCurry || config.curry && aryKey > 1) {
            forceCurry && console.log(forceCurry, name);
            result = curry(result, aryKey);
          }
          return false;
        }
      });
      return !result;
    });

    result || (result = wrapped);
    if (result == func) {
      result = forceCurry ? curry(result, 1) : function () {
        return func.apply(this, arguments);
      };
    }
    result.convert = createConverter(name, func);
    if (mapping.placeholder[name]) {
      setPlaceholder = true;
      result.placeholder = func.placeholder = placeholder;
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  if (!isObj) {
    return wrap(name, func);
  }
  var _ = func;

  // Convert methods by ary cap.
  var pairs = [];
  each(aryMethodKeys, function (aryKey) {
    each(mapping.aryMethod[aryKey], function (key) {
      var func = _[mapping.remap[key] || key];
      if (func) {
        pairs.push([key, wrap(key, func)]);
      }
    });
  });

  // Convert remaining methods.
  each(keys(_), function (key) {
    var func = _[key];
    if (typeof func == 'function') {
      var length = pairs.length;
      while (length--) {
        if (pairs[length][0] == key) {
          return;
        }
      }
      func.convert = createConverter(key, func);
      pairs.push([key, func]);
    }
  });

  // Assign to `_` leaving `_.prototype` unchanged to allow chaining.
  each(pairs, function (pair) {
    _[pair[0]] = pair[1];
  });

  _.convert = convertLib;
  if (setPlaceholder) {
    _.placeholder = placeholder;
  }
  // Assign aliases.
  each(keys(_), function (key) {
    each(mapping.realToAlias[key] || [], function (alias) {
      _[alias] = _[key];
    });
  });

  return _;
}

module.exports = baseConvert;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZwL19iYXNlQ29udmVydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksVUFBVSxRQUFRLFlBQVIsQ0FBVjtJQUNBLFlBQVksUUFBUSxNQUFSO0lBQ1osaUJBQWlCLFFBQVEsZUFBUixDQUFqQjs7Ozs7Ozs7Ozs7QUFXSixTQUFTLFNBQVQsQ0FBbUIsSUFBbkIsRUFBeUIsQ0FBekIsRUFBNEI7QUFDMUIsU0FBTyxLQUFLLENBQUwsR0FDSCxVQUFTLENBQVQsRUFBWSxDQUFaLEVBQWU7QUFBRSxXQUFPLEtBQUssS0FBTCxDQUFXLFNBQVgsRUFBc0IsU0FBdEIsQ0FBUCxDQUFGO0dBQWYsR0FDQSxVQUFTLENBQVQsRUFBWTtBQUFFLFdBQU8sS0FBSyxLQUFMLENBQVcsU0FBWCxFQUFzQixTQUF0QixDQUFQLENBQUY7R0FBWixDQUhzQjtDQUE1Qjs7Ozs7Ozs7Ozs7QUFlQSxTQUFTLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUIsQ0FBdkIsRUFBMEI7QUFDeEIsU0FBTyxLQUFLLENBQUwsR0FDSCxVQUFTLENBQVQsRUFBWSxDQUFaLEVBQWU7QUFBRSxXQUFPLEtBQUssQ0FBTCxFQUFRLENBQVIsQ0FBUCxDQUFGO0dBQWYsR0FDQSxVQUFTLENBQVQsRUFBWTtBQUFFLFdBQU8sS0FBSyxDQUFMLENBQVAsQ0FBRjtHQUFaLENBSG9CO0NBQTFCOzs7Ozs7Ozs7QUFhQSxTQUFTLFVBQVQsQ0FBb0IsS0FBcEIsRUFBMkI7QUFDekIsTUFBSSxTQUFTLFFBQVEsTUFBTSxNQUFOLEdBQWUsQ0FBdkI7TUFDVCxTQUFTLE1BQU0sTUFBTixDQUFULENBRnFCOztBQUl6QixTQUFPLFFBQVAsRUFBaUI7QUFDZixXQUFPLE1BQVAsSUFBaUIsTUFBTSxNQUFOLENBQWpCLENBRGU7R0FBakI7QUFHQSxTQUFPLE1BQVAsQ0FQeUI7Q0FBM0I7Ozs7Ozs7OztBQWlCQSxTQUFTLFlBQVQsQ0FBc0IsSUFBdEIsRUFB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QUFlO0FBQ3pCLE1BQUUsS0FBSyxDQUFMLENBQUYsSUFBYSxLQUFLLENBQUwsQ0FBYixDQUR5QjtHQUFmLENBQVosQ0F2VjhDOztBQTJWOUMsSUFBRSxPQUFGLEdBQVksVUFBWixDQTNWOEM7QUE0VjlDLE1BQUksY0FBSixFQUFvQjtBQUNsQixNQUFFLFdBQUYsR0FBZ0IsV0FBaEIsQ0FEa0I7R0FBcEI7O0FBNVY4QyxNQWdXOUMsQ0FBSyxLQUFLLENBQUwsQ0FBTCxFQUFjLFVBQVMsR0FBVCxFQUFjO0FBQzFCLFNBQUssUUFBUSxXQUFSLENBQW9CLEdBQXBCLEtBQTRCLEVBQTVCLEVBQWdDLFVBQVMsS0FBVCxFQUFnQjtBQUNuRCxRQUFFLEtBQUYsSUFBVyxFQUFFLEdBQUYsQ0FBWCxDQURtRDtLQUFoQixDQUFyQyxDQUQwQjtHQUFkLENBQWQsQ0FoVzhDOztBQXNXOUMsU0FBTyxDQUFQLENBdFc4QztDQUFoRDs7QUF5V0EsT0FBTyxPQUFQLEdBQWlCLFdBQWpCIiwiZmlsZSI6Il9iYXNlQ29udmVydC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBtYXBwaW5nID0gcmVxdWlyZSgnLi9fbWFwcGluZycpLFxuICAgIG11dGF0ZU1hcCA9IG1hcHBpbmcubXV0YXRlLFxuICAgIGZhbGxiYWNrSG9sZGVyID0gcmVxdWlyZSgnLi9wbGFjZWhvbGRlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiwgd2l0aCBhbiBhcml0eSBvZiBgbmAsIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCB0aGVcbiAqIGFyZ3VtZW50cyBpdCByZWNlaXZlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBhcml0eSBvZiB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VBcml0eShmdW5jLCBuKSB7XG4gIHJldHVybiBuID09IDJcbiAgICA/IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpOyB9XG4gICAgOiBmdW5jdGlvbihhKSB7IHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTsgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCwgd2l0aCB1cCB0byBgbmAgYXJndW1lbnRzLCBpZ25vcmluZ1xuICogYW55IGFkZGl0aW9uYWwgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBhcml0eSBjYXAuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFyeShmdW5jLCBuKSB7XG4gIHJldHVybiBuID09IDJcbiAgICA/IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGZ1bmMoYSwgYik7IH1cbiAgICA6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIGZ1bmMoYSk7IH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY2xvbmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBjbG9uZUFycmF5KGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDAsXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIHJlc3VsdFtsZW5ndGhdID0gYXJyYXlbbGVuZ3RoXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGNsb25lcyBhIGdpdmVuIG9iamVjdCB1c2luZyB0aGUgYXNzaWdubWVudCBgZnVuY2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGFzc2lnbm1lbnQgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjbG9uZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUNsb25lcihmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gZnVuYyh7fSwgb2JqZWN0KTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3cmFwcyBgZnVuY2AgYW5kIHVzZXMgYGNsb25lcmAgdG8gY2xvbmUgdGhlIGZpcnN0XG4gKiBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNsb25lciBUaGUgZnVuY3Rpb24gdG8gY2xvbmUgYXJndW1lbnRzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgaW1tdXRhYmxlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBpbW11dFdyYXAoZnVuYywgY2xvbmVyKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgdmFyIGFyZ3MgPSBBcnJheShsZW5ndGgpO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgYXJnc1tsZW5ndGhdID0gYXJndW1lbnRzW2xlbmd0aF07XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBhcmdzWzBdID0gY2xvbmVyLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGNvbnZlcnRgIHdoaWNoIGFjY2VwdHMgYSBgdXRpbGAgb2JqZWN0IG9mIG1ldGhvZHNcbiAqIHJlcXVpcmVkIHRvIHBlcmZvcm0gY29udmVyc2lvbnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHV0aWwgVGhlIHV0aWwgb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmNhcD10cnVlXSBTcGVjaWZ5IGNhcHBpbmcgaXRlcmF0ZWUgYXJndW1lbnRzLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5jdXJyeT10cnVlXSBTcGVjaWZ5IGN1cnJ5aW5nLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5maXhlZD10cnVlXSBTcGVjaWZ5IGZpeGVkIGFyaXR5LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5pbW11dGFibGU9dHJ1ZV0gU3BlY2lmeSBpbW11dGFibGUgb3BlcmF0aW9ucy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMucmVhcmc9dHJ1ZV0gU3BlY2lmeSByZWFycmFuZ2luZyBhcmd1bWVudHMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb258T2JqZWN0fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgZnVuY3Rpb24gb3Igb2JqZWN0LlxuICovXG5mdW5jdGlvbiBiYXNlQ29udmVydCh1dGlsLCBuYW1lLCBmdW5jLCBvcHRpb25zKSB7XG4gIHZhciBzZXRQbGFjZWhvbGRlcixcbiAgICAgIGlzTGliID0gdHlwZW9mIG5hbWUgPT0gJ2Z1bmN0aW9uJyxcbiAgICAgIGlzT2JqID0gbmFtZSA9PT0gT2JqZWN0KG5hbWUpO1xuXG4gIGlmIChpc09iaikge1xuICAgIG9wdGlvbnMgPSBmdW5jO1xuICAgIGZ1bmMgPSBuYW1lO1xuICAgIG5hbWUgPSB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKGZ1bmMgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gIH1cbiAgb3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcblxuICB2YXIgY29uZmlnID0ge1xuICAgICdjYXAnOiAnY2FwJyBpbiBvcHRpb25zID8gb3B0aW9ucy5jYXAgOiB0cnVlLFxuICAgICdjdXJyeSc6ICdjdXJyeScgaW4gb3B0aW9ucyA/IG9wdGlvbnMuY3VycnkgOiB0cnVlLFxuICAgICdmaXhlZCc6ICdmaXhlZCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuZml4ZWQgOiB0cnVlLFxuICAgICdpbW11dGFibGUnOiAnaW1tdXRhYmxlJyBpbiBvcHRpb25zID8gb3B0aW9ucy5pbW11dGFibGUgOiB0cnVlLFxuICAgICdyZWFyZyc6ICdyZWFyZycgaW4gb3B0aW9ucyA/IG9wdGlvbnMucmVhcmcgOiB0cnVlXG4gIH07XG5cbiAgdmFyIGZvcmNlQ3VycnkgPSAoJ2N1cnJ5JyBpbiBvcHRpb25zKSAmJiBvcHRpb25zLmN1cnJ5LFxuICAgICAgZm9yY2VGaXhlZCA9ICgnZml4ZWQnIGluIG9wdGlvbnMpICYmIG9wdGlvbnMuZml4ZWQsXG4gICAgICBmb3JjZVJlYXJnID0gKCdyZWFyZycgaW4gb3B0aW9ucykgJiYgb3B0aW9ucy5yZWFyZyxcbiAgICAgIHBsYWNlaG9sZGVyID0gaXNMaWIgPyBmdW5jIDogZmFsbGJhY2tIb2xkZXIsXG4gICAgICBwcmlzdGluZSA9IGlzTGliID8gZnVuYy5ydW5JbkNvbnRleHQoKSA6IHVuZGVmaW5lZDtcblxuICB2YXIgaGVscGVycyA9IGlzTGliID8gZnVuYyA6IHtcbiAgICAnYXJ5JzogdXRpbC5hcnksXG4gICAgJ2Fzc2lnbic6IHV0aWwuYXNzaWduLFxuICAgICdjbG9uZSc6IHV0aWwuY2xvbmUsXG4gICAgJ2N1cnJ5JzogdXRpbC5jdXJyeSxcbiAgICAnZm9yRWFjaCc6IHV0aWwuZm9yRWFjaCxcbiAgICAnaXNBcnJheSc6IHV0aWwuaXNBcnJheSxcbiAgICAnaXNGdW5jdGlvbic6IHV0aWwuaXNGdW5jdGlvbixcbiAgICAnaXRlcmF0ZWUnOiB1dGlsLml0ZXJhdGVlLFxuICAgICdrZXlzJzogdXRpbC5rZXlzLFxuICAgICdyZWFyZyc6IHV0aWwucmVhcmcsXG4gICAgJ3NwcmVhZCc6IHV0aWwuc3ByZWFkLFxuICAgICd0b1BhdGgnOiB1dGlsLnRvUGF0aFxuICB9O1xuXG4gIHZhciBhcnkgPSBoZWxwZXJzLmFyeSxcbiAgICAgIGFzc2lnbiA9IGhlbHBlcnMuYXNzaWduLFxuICAgICAgY2xvbmUgPSBoZWxwZXJzLmNsb25lLFxuICAgICAgY3VycnkgPSBoZWxwZXJzLmN1cnJ5LFxuICAgICAgZWFjaCA9IGhlbHBlcnMuZm9yRWFjaCxcbiAgICAgIGlzQXJyYXkgPSBoZWxwZXJzLmlzQXJyYXksXG4gICAgICBpc0Z1bmN0aW9uID0gaGVscGVycy5pc0Z1bmN0aW9uLFxuICAgICAga2V5cyA9IGhlbHBlcnMua2V5cyxcbiAgICAgIHJlYXJnID0gaGVscGVycy5yZWFyZyxcbiAgICAgIHNwcmVhZCA9IGhlbHBlcnMuc3ByZWFkLFxuICAgICAgdG9QYXRoID0gaGVscGVycy50b1BhdGg7XG5cbiAgdmFyIGFyeU1ldGhvZEtleXMgPSBrZXlzKG1hcHBpbmcuYXJ5TWV0aG9kKTtcblxuICB2YXIgd3JhcHBlcnMgPSB7XG4gICAgJ2Nhc3RBcnJheSc6IGZ1bmN0aW9uKGNhc3RBcnJheSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgIHJldHVybiBpc0FycmF5KHZhbHVlKVxuICAgICAgICAgID8gY2FzdEFycmF5KGNsb25lQXJyYXkodmFsdWUpKVxuICAgICAgICAgIDogY2FzdEFycmF5LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfSxcbiAgICAnaXRlcmF0ZWUnOiBmdW5jdGlvbihpdGVyYXRlZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZnVuYyA9IGFyZ3VtZW50c1swXSxcbiAgICAgICAgICAgIGFyaXR5ID0gYXJndW1lbnRzWzFdLFxuICAgICAgICAgICAgcmVzdWx0ID0gaXRlcmF0ZWUoZnVuYywgYXJpdHkpLFxuICAgICAgICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICAgICAgICBpZiAoY29uZmlnLmNhcCAmJiB0eXBlb2YgYXJpdHkgPT0gJ251bWJlcicpIHtcbiAgICAgICAgICBhcml0eSA9IGFyaXR5ID4gMiA/IChhcml0eSAtIDIpIDogMTtcbiAgICAgICAgICByZXR1cm4gKGxlbmd0aCAmJiBsZW5ndGggPD0gYXJpdHkpID8gcmVzdWx0IDogYmFzZUFyeShyZXN1bHQsIGFyaXR5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcbiAgICB9LFxuICAgICdtaXhpbic6IGZ1bmN0aW9uKG1peGluKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICAgIHZhciBmdW5jID0gdGhpcztcbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgICAgcmV0dXJuIG1peGluKGZ1bmMsIE9iamVjdChzb3VyY2UpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFpcnMgPSBbXTtcbiAgICAgICAgZWFjaChrZXlzKHNvdXJjZSksIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKHNvdXJjZVtrZXldKSkge1xuICAgICAgICAgICAgcGFpcnMucHVzaChba2V5LCBmdW5jLnByb3RvdHlwZVtrZXldXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBtaXhpbihmdW5jLCBPYmplY3Qoc291cmNlKSk7XG5cbiAgICAgICAgZWFjaChwYWlycywgZnVuY3Rpb24ocGFpcikge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IHBhaXJbMV07XG4gICAgICAgICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgICAgICBmdW5jLnByb3RvdHlwZVtwYWlyWzBdXSA9IHZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgZnVuYy5wcm90b3R5cGVbcGFpclswXV07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZ1bmM7XG4gICAgICB9O1xuICAgIH0sXG4gICAgJ3J1bkluQ29udGV4dCc6IGZ1bmN0aW9uKHJ1bkluQ29udGV4dCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIGJhc2VDb252ZXJ0KHV0aWwsIHJ1bkluQ29udGV4dChjb250ZXh0KSwgb3B0aW9ucyk7XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGNsb25lIG9mIGBvYmplY3RgIGJ5IGBwYXRoYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICAgKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjbG9uZSBieS5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIG9iamVjdC5cbiAgICovXG4gIGZ1bmN0aW9uIGNsb25lQnlQYXRoKG9iamVjdCwgcGF0aCkge1xuICAgIHBhdGggPSB0b1BhdGgocGF0aCk7XG5cbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICAgIGxhc3RJbmRleCA9IGxlbmd0aCAtIDEsXG4gICAgICAgIHJlc3VsdCA9IGNsb25lKE9iamVjdChvYmplY3QpKSxcbiAgICAgICAgbmVzdGVkID0gcmVzdWx0O1xuXG4gICAgd2hpbGUgKG5lc3RlZCAhPSBudWxsICYmICsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBrZXkgPSBwYXRoW2luZGV4XSxcbiAgICAgICAgICB2YWx1ZSA9IG5lc3RlZFtrZXldO1xuXG4gICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICBuZXN0ZWRbcGF0aFtpbmRleF1dID0gY2xvbmUoaW5kZXggPT0gbGFzdEluZGV4ID8gdmFsdWUgOiBPYmplY3QodmFsdWUpKTtcbiAgICAgIH1cbiAgICAgIG5lc3RlZCA9IG5lc3RlZFtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGBsb2Rhc2hgIHRvIGFuIGltbXV0YWJsZSBhdXRvLWN1cnJpZWQgaXRlcmF0ZWUtZmlyc3QgZGF0YS1sYXN0XG4gICAqIHZlcnNpb24gd2l0aCBjb252ZXJzaW9uIGBvcHRpb25zYCBhcHBsaWVkLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFRoZSBvcHRpb25zIG9iamVjdC4gU2VlIGBiYXNlQ29udmVydGAgZm9yIG1vcmUgZGV0YWlscy5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgYGxvZGFzaGAuXG4gICAqL1xuICBmdW5jdGlvbiBjb252ZXJ0TGliKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gXy5ydW5JbkNvbnRleHQuY29udmVydChvcHRpb25zKSh1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGNvbnZlcnRlciBmdW5jdGlvbiBmb3IgYGZ1bmNgIG9mIGBuYW1lYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbnZlcnRlciBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZUNvbnZlcnRlcihuYW1lLCBmdW5jKSB7XG4gICAgdmFyIG9sZE9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHJldHVybiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgbmV3VXRpbCA9IGlzTGliID8gcHJpc3RpbmUgOiBoZWxwZXJzLFxuICAgICAgICAgIG5ld0Z1bmMgPSBpc0xpYiA/IHByaXN0aW5lW25hbWVdIDogZnVuYyxcbiAgICAgICAgICBuZXdPcHRpb25zID0gYXNzaWduKGFzc2lnbih7fSwgb2xkT3B0aW9ucyksIG9wdGlvbnMpO1xuXG4gICAgICByZXR1cm4gYmFzZUNvbnZlcnQobmV3VXRpbCwgbmFtZSwgbmV3RnVuYywgbmV3T3B0aW9ucyk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3cmFwcyBgZnVuY2AgdG8gaW52b2tlIGl0cyBpdGVyYXRlZSwgd2l0aCB1cCB0byBgbmBcbiAgICogYXJndW1lbnRzLCBpZ25vcmluZyBhbnkgYWRkaXRpb25hbCBhcmd1bWVudHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBpdGVyYXRlZSBhcmd1bWVudHMgZm9yLlxuICAgKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgYXJpdHkgY2FwLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGl0ZXJhdGVlQXJ5KGZ1bmMsIG4pIHtcbiAgICByZXR1cm4gb3ZlckFyZyhmdW5jLCBmdW5jdGlvbihmdW5jKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJyA/IGJhc2VBcnkoZnVuYywgbikgOiBmdW5jO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCB0byBpbnZva2UgaXRzIGl0ZXJhdGVlIHdpdGggYXJndW1lbnRzXG4gICAqIGFycmFuZ2VkIGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWVkIGBpbmRleGVzYCB3aGVyZSB0aGUgYXJndW1lbnQgdmFsdWUgYXRcbiAgICogdGhlIGZpcnN0IGluZGV4IGlzIHByb3ZpZGVkIGFzIHRoZSBmaXJzdCBhcmd1bWVudCwgdGhlIGFyZ3VtZW50IHZhbHVlIGF0XG4gICAqIHRoZSBzZWNvbmQgaW5kZXggaXMgcHJvdmlkZWQgYXMgdGhlIHNlY29uZCBhcmd1bWVudCwgYW5kIHNvIG9uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZWFycmFuZ2UgaXRlcmF0ZWUgYXJndW1lbnRzIGZvci5cbiAgICogQHBhcmFtIHtudW1iZXJbXX0gaW5kZXhlcyBUaGUgYXJyYW5nZWQgYXJndW1lbnQgaW5kZXhlcy5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBpdGVyYXRlZVJlYXJnKGZ1bmMsIGluZGV4ZXMpIHtcbiAgICByZXR1cm4gb3ZlckFyZyhmdW5jLCBmdW5jdGlvbihmdW5jKSB7XG4gICAgICB2YXIgbiA9IGluZGV4ZXMubGVuZ3RoO1xuICAgICAgcmV0dXJuIGJhc2VBcml0eShyZWFyZyhiYXNlQXJ5KGZ1bmMsIG4pLCBpbmRleGVzKSwgbik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgZmlyc3QgYXJndW1lbnQgcGFzc2VkXG4gICAqIHRocnUgYHRyYW5zZm9ybWAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gICAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgZnVuY3Rpb25zIHRvIHRyYW5zZm9ybSB0aGUgZmlyc3QgYXJndW1lbnQuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmdW5jKCk7XG4gICAgICB9XG4gICAgICB2YXIgYXJncyA9IEFycmF5KGxlbmd0aCk7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgYXJnc1tsZW5ndGhdID0gYXJndW1lbnRzW2xlbmd0aF07XG4gICAgICB9XG4gICAgICB2YXIgaW5kZXggPSBjb25maWcucmVhcmcgPyAwIDogKGxlbmd0aCAtIDEpO1xuICAgICAgYXJnc1tpbmRleF0gPSB0cmFuc2Zvcm0oYXJnc1tpbmRleF0pO1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCBhbmQgYXBwbHlzIHRoZSBjb252ZXJzaW9uc1xuICAgKiBydWxlcyBieSBgbmFtZWAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGNvbnZlcnRlZCBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIHdyYXAobmFtZSwgZnVuYykge1xuICAgIG5hbWUgPSBtYXBwaW5nLmFsaWFzVG9SZWFsW25hbWVdIHx8IG5hbWU7XG5cbiAgICB2YXIgcmVzdWx0LFxuICAgICAgICB3cmFwcGVkID0gZnVuYyxcbiAgICAgICAgd3JhcHBlciA9IHdyYXBwZXJzW25hbWVdO1xuXG4gICAgaWYgKHdyYXBwZXIpIHtcbiAgICAgIHdyYXBwZWQgPSB3cmFwcGVyKGZ1bmMpO1xuICAgIH1cbiAgICBlbHNlIGlmIChjb25maWcuaW1tdXRhYmxlKSB7XG4gICAgICBpZiAobXV0YXRlTWFwLmFycmF5W25hbWVdKSB7XG4gICAgICAgIHdyYXBwZWQgPSBpbW11dFdyYXAoZnVuYywgY2xvbmVBcnJheSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChtdXRhdGVNYXAub2JqZWN0W25hbWVdKSB7XG4gICAgICAgIHdyYXBwZWQgPSBpbW11dFdyYXAoZnVuYywgY3JlYXRlQ2xvbmVyKGZ1bmMpKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKG11dGF0ZU1hcC5zZXRbbmFtZV0pIHtcbiAgICAgICAgd3JhcHBlZCA9IGltbXV0V3JhcChmdW5jLCBjbG9uZUJ5UGF0aCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVhY2goYXJ5TWV0aG9kS2V5cywgZnVuY3Rpb24oYXJ5S2V5KSB7XG4gICAgICBlYWNoKG1hcHBpbmcuYXJ5TWV0aG9kW2FyeUtleV0sIGZ1bmN0aW9uKG90aGVyTmFtZSkge1xuICAgICAgICBpZiAobmFtZSA9PSBvdGhlck5hbWUpIHtcbiAgICAgICAgICB2YXIgYXJ5TiA9ICFpc0xpYiAmJiBtYXBwaW5nLml0ZXJhdGVlQXJ5W25hbWVdLFxuICAgICAgICAgICAgICByZWFyZ0luZGV4ZXMgPSBtYXBwaW5nLml0ZXJhdGVlUmVhcmdbbmFtZV0sXG4gICAgICAgICAgICAgIHNwcmVhZFN0YXJ0ID0gbWFwcGluZy5tZXRob2RTcHJlYWRbbmFtZV07XG5cbiAgICAgICAgICByZXN1bHQgPSB3cmFwcGVkO1xuICAgICAgICAgIGlmIChjb25maWcuZml4ZWQgJiYgKGZvcmNlRml4ZWQgfHwgIW1hcHBpbmcuc2tpcEZpeGVkW25hbWVdKSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gc3ByZWFkU3RhcnQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICA/IGFyeShyZXN1bHQsIGFyeUtleSlcbiAgICAgICAgICAgICAgOiBzcHJlYWQocmVzdWx0LCBzcHJlYWRTdGFydCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjb25maWcucmVhcmcgJiYgYXJ5S2V5ID4gMSAmJiAoZm9yY2VSZWFyZyB8fCAhbWFwcGluZy5za2lwUmVhcmdbbmFtZV0pKSB7XG4gICAgICAgICAgICByZXN1bHQgPSByZWFyZyhyZXN1bHQsIG1hcHBpbmcubWV0aG9kUmVhcmdbbmFtZV0gfHwgbWFwcGluZy5hcnlSZWFyZ1thcnlLZXldKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNvbmZpZy5jYXApIHtcbiAgICAgICAgICAgIGlmIChyZWFyZ0luZGV4ZXMpIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gaXRlcmF0ZWVSZWFyZyhyZXN1bHQsIHJlYXJnSW5kZXhlcyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyeU4pIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gaXRlcmF0ZWVBcnkocmVzdWx0LCBhcnlOKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZvcmNlQ3VycnkgfHwgKGNvbmZpZy5jdXJyeSAmJiBhcnlLZXkgPiAxKSkge1xuICAgICAgICAgICAgZm9yY2VDdXJyeSAgJiYgY29uc29sZS5sb2coZm9yY2VDdXJyeSwgbmFtZSk7XG4gICAgICAgICAgICByZXN1bHQgPSBjdXJyeShyZXN1bHQsIGFyeUtleSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gIXJlc3VsdDtcbiAgICB9KTtcblxuICAgIHJlc3VsdCB8fCAocmVzdWx0ID0gd3JhcHBlZCk7XG4gICAgaWYgKHJlc3VsdCA9PSBmdW5jKSB7XG4gICAgICByZXN1bHQgPSBmb3JjZUN1cnJ5ID8gY3VycnkocmVzdWx0LCAxKSA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmVzdWx0LmNvbnZlcnQgPSBjcmVhdGVDb252ZXJ0ZXIobmFtZSwgZnVuYyk7XG4gICAgaWYgKG1hcHBpbmcucGxhY2Vob2xkZXJbbmFtZV0pIHtcbiAgICAgIHNldFBsYWNlaG9sZGVyID0gdHJ1ZTtcbiAgICAgIHJlc3VsdC5wbGFjZWhvbGRlciA9IGZ1bmMucGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlcjtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIGlmICghaXNPYmopIHtcbiAgICByZXR1cm4gd3JhcChuYW1lLCBmdW5jKTtcbiAgfVxuICB2YXIgXyA9IGZ1bmM7XG5cbiAgLy8gQ29udmVydCBtZXRob2RzIGJ5IGFyeSBjYXAuXG4gIHZhciBwYWlycyA9IFtdO1xuICBlYWNoKGFyeU1ldGhvZEtleXMsIGZ1bmN0aW9uKGFyeUtleSkge1xuICAgIGVhY2gobWFwcGluZy5hcnlNZXRob2RbYXJ5S2V5XSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbWFwcGluZy5yZW1hcFtrZXldIHx8IGtleV07XG4gICAgICBpZiAoZnVuYykge1xuICAgICAgICBwYWlycy5wdXNoKFtrZXksIHdyYXAoa2V5LCBmdW5jKV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICAvLyBDb252ZXJ0IHJlbWFpbmluZyBtZXRob2RzLlxuICBlYWNoKGtleXMoXyksIGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBmdW5jID0gX1trZXldO1xuICAgIGlmICh0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gcGFpcnMubGVuZ3RoO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmIChwYWlyc1tsZW5ndGhdWzBdID09IGtleSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZnVuYy5jb252ZXJ0ID0gY3JlYXRlQ29udmVydGVyKGtleSwgZnVuYyk7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIGZ1bmNdKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFzc2lnbiB0byBgX2AgbGVhdmluZyBgXy5wcm90b3R5cGVgIHVuY2hhbmdlZCB0byBhbGxvdyBjaGFpbmluZy5cbiAgZWFjaChwYWlycywgZnVuY3Rpb24ocGFpcikge1xuICAgIF9bcGFpclswXV0gPSBwYWlyWzFdO1xuICB9KTtcblxuICBfLmNvbnZlcnQgPSBjb252ZXJ0TGliO1xuICBpZiAoc2V0UGxhY2Vob2xkZXIpIHtcbiAgICBfLnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XG4gIH1cbiAgLy8gQXNzaWduIGFsaWFzZXMuXG4gIGVhY2goa2V5cyhfKSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgZWFjaChtYXBwaW5nLnJlYWxUb0FsaWFzW2tleV0gfHwgW10sIGZ1bmN0aW9uKGFsaWFzKSB7XG4gICAgICBfW2FsaWFzXSA9IF9ba2V5XTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIF87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNvbnZlcnQ7XG4iXX0=