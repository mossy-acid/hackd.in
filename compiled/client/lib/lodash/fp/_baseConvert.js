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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL2ZwL19iYXNlQ29udmVydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksVUFBVSxRQUFRLFlBQVIsQ0FBZDtJQUNJLFlBQVksUUFBUSxNQUR4QjtJQUVJLGlCQUFpQixRQUFRLGVBQVIsQ0FGckI7Ozs7Ozs7Ozs7O0FBYUEsU0FBUyxTQUFULENBQW1CLElBQW5CLEVBQXlCLENBQXpCLEVBQTRCO0FBQzFCLFNBQU8sS0FBSyxDQUFMLEdBQ0gsVUFBUyxDQUFULEVBQVksQ0FBWixFQUFlO0FBQUUsV0FBTyxLQUFLLEtBQUwsQ0FBVyxTQUFYLEVBQXNCLFNBQXRCLENBQVA7QUFBMEMsR0FEeEQsR0FFSCxVQUFTLENBQVQsRUFBWTtBQUFFLFdBQU8sS0FBSyxLQUFMLENBQVcsU0FBWCxFQUFzQixTQUF0QixDQUFQO0FBQTBDLEdBRjVEO0FBR0Q7Ozs7Ozs7Ozs7O0FBV0QsU0FBUyxPQUFULENBQWlCLElBQWpCLEVBQXVCLENBQXZCLEVBQTBCO0FBQ3hCLFNBQU8sS0FBSyxDQUFMLEdBQ0gsVUFBUyxDQUFULEVBQVksQ0FBWixFQUFlO0FBQUUsV0FBTyxLQUFLLENBQUwsRUFBUSxDQUFSLENBQVA7QUFBb0IsR0FEbEMsR0FFSCxVQUFTLENBQVQsRUFBWTtBQUFFLFdBQU8sS0FBSyxDQUFMLENBQVA7QUFBaUIsR0FGbkM7QUFHRDs7Ozs7Ozs7O0FBU0QsU0FBUyxVQUFULENBQW9CLEtBQXBCLEVBQTJCO0FBQ3pCLE1BQUksU0FBUyxRQUFRLE1BQU0sTUFBZCxHQUF1QixDQUFwQztNQUNJLFNBQVMsTUFBTSxNQUFOLENBRGI7O0FBR0EsU0FBTyxRQUFQLEVBQWlCO0FBQ2YsV0FBTyxNQUFQLElBQWlCLE1BQU0sTUFBTixDQUFqQjtBQUNEO0FBQ0QsU0FBTyxNQUFQO0FBQ0Q7Ozs7Ozs7OztBQVNELFNBQVMsWUFBVCxDQUFzQixJQUF0QixFQUE0QjtBQUMxQixTQUFPLFVBQVMsTUFB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N0IsVUFBSSxTQUFTLE1BQU0sTUFBbkI7QUFDQSxhQUFPLFFBQVAsRUFBaUI7QUFDZixZQUFJLE1BQU0sTUFBTixFQUFjLENBQWQsS0FBb0IsR0FBeEIsRUFBNkI7QUFDM0I7QUFDRDtBQUNGO0FBQ0QsV0FBSyxPQUFMLEdBQWUsZ0JBQWdCLEdBQWhCLEVBQXFCLElBQXJCLENBQWY7QUFDQSxZQUFNLElBQU4sQ0FBVyxDQUFDLEdBQUQsRUFBTSxJQUFOLENBQVg7QUFDRDtBQUNGLEdBWkQ7OztBQWVBLE9BQUssS0FBTCxFQUFZLFVBQVMsSUFBVCxFQUFlO0FBQ3pCLE1BQUUsS0FBSyxDQUFMLENBQUYsSUFBYSxLQUFLLENBQUwsQ0FBYjtBQUNELEdBRkQ7O0FBSUEsSUFBRSxPQUFGLEdBQVksVUFBWjtBQUNBLE1BQUksY0FBSixFQUFvQjtBQUNsQixNQUFFLFdBQUYsR0FBZ0IsV0FBaEI7QUFDRDs7QUFFRCxPQUFLLEtBQUssQ0FBTCxDQUFMLEVBQWMsVUFBUyxHQUFULEVBQWM7QUFDMUIsU0FBSyxRQUFRLFdBQVIsQ0FBb0IsR0FBcEIsS0FBNEIsRUFBakMsRUFBcUMsVUFBUyxLQUFULEVBQWdCO0FBQ25ELFFBQUUsS0FBRixJQUFXLEVBQUUsR0FBRixDQUFYO0FBQ0QsS0FGRDtBQUdELEdBSkQ7O0FBTUEsU0FBTyxDQUFQO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFdBQWpCIiwiZmlsZSI6Il9iYXNlQ29udmVydC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBtYXBwaW5nID0gcmVxdWlyZSgnLi9fbWFwcGluZycpLFxuICAgIG11dGF0ZU1hcCA9IG1hcHBpbmcubXV0YXRlLFxuICAgIGZhbGxiYWNrSG9sZGVyID0gcmVxdWlyZSgnLi9wbGFjZWhvbGRlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiwgd2l0aCBhbiBhcml0eSBvZiBgbmAsIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCB0aGVcbiAqIGFyZ3VtZW50cyBpdCByZWNlaXZlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBhcml0eSBvZiB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VBcml0eShmdW5jLCBuKSB7XG4gIHJldHVybiBuID09IDJcbiAgICA/IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpOyB9XG4gICAgOiBmdW5jdGlvbihhKSB7IHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTsgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCwgd2l0aCB1cCB0byBgbmAgYXJndW1lbnRzLCBpZ25vcmluZ1xuICogYW55IGFkZGl0aW9uYWwgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBhcml0eSBjYXAuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFyeShmdW5jLCBuKSB7XG4gIHJldHVybiBuID09IDJcbiAgICA/IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGZ1bmMoYSwgYik7IH1cbiAgICA6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIGZ1bmMoYSk7IH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY2xvbmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBjbG9uZUFycmF5KGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDAsXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIHJlc3VsdFtsZW5ndGhdID0gYXJyYXlbbGVuZ3RoXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGNsb25lcyBhIGdpdmVuIG9iamVjdCB1c2luZyB0aGUgYXNzaWdubWVudCBgZnVuY2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGFzc2lnbm1lbnQgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjbG9uZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUNsb25lcihmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gZnVuYyh7fSwgb2JqZWN0KTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3cmFwcyBgZnVuY2AgYW5kIHVzZXMgYGNsb25lcmAgdG8gY2xvbmUgdGhlIGZpcnN0XG4gKiBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNsb25lciBUaGUgZnVuY3Rpb24gdG8gY2xvbmUgYXJndW1lbnRzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgaW1tdXRhYmxlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBpbW11dFdyYXAoZnVuYywgY2xvbmVyKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgdmFyIGFyZ3MgPSBBcnJheShsZW5ndGgpO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgYXJnc1tsZW5ndGhdID0gYXJndW1lbnRzW2xlbmd0aF07XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBhcmdzWzBdID0gY2xvbmVyLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGNvbnZlcnRgIHdoaWNoIGFjY2VwdHMgYSBgdXRpbGAgb2JqZWN0IG9mIG1ldGhvZHNcbiAqIHJlcXVpcmVkIHRvIHBlcmZvcm0gY29udmVyc2lvbnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHV0aWwgVGhlIHV0aWwgb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmNhcD10cnVlXSBTcGVjaWZ5IGNhcHBpbmcgaXRlcmF0ZWUgYXJndW1lbnRzLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5jdXJyeT10cnVlXSBTcGVjaWZ5IGN1cnJ5aW5nLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5maXhlZD10cnVlXSBTcGVjaWZ5IGZpeGVkIGFyaXR5LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5pbW11dGFibGU9dHJ1ZV0gU3BlY2lmeSBpbW11dGFibGUgb3BlcmF0aW9ucy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMucmVhcmc9dHJ1ZV0gU3BlY2lmeSByZWFycmFuZ2luZyBhcmd1bWVudHMuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb258T2JqZWN0fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgZnVuY3Rpb24gb3Igb2JqZWN0LlxuICovXG5mdW5jdGlvbiBiYXNlQ29udmVydCh1dGlsLCBuYW1lLCBmdW5jLCBvcHRpb25zKSB7XG4gIHZhciBzZXRQbGFjZWhvbGRlcixcbiAgICAgIGlzTGliID0gdHlwZW9mIG5hbWUgPT0gJ2Z1bmN0aW9uJyxcbiAgICAgIGlzT2JqID0gbmFtZSA9PT0gT2JqZWN0KG5hbWUpO1xuXG4gIGlmIChpc09iaikge1xuICAgIG9wdGlvbnMgPSBmdW5jO1xuICAgIGZ1bmMgPSBuYW1lO1xuICAgIG5hbWUgPSB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKGZ1bmMgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gIH1cbiAgb3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcblxuICB2YXIgY29uZmlnID0ge1xuICAgICdjYXAnOiAnY2FwJyBpbiBvcHRpb25zID8gb3B0aW9ucy5jYXAgOiB0cnVlLFxuICAgICdjdXJyeSc6ICdjdXJyeScgaW4gb3B0aW9ucyA/IG9wdGlvbnMuY3VycnkgOiB0cnVlLFxuICAgICdmaXhlZCc6ICdmaXhlZCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuZml4ZWQgOiB0cnVlLFxuICAgICdpbW11dGFibGUnOiAnaW1tdXRhYmxlJyBpbiBvcHRpb25zID8gb3B0aW9ucy5pbW11dGFibGUgOiB0cnVlLFxuICAgICdyZWFyZyc6ICdyZWFyZycgaW4gb3B0aW9ucyA/IG9wdGlvbnMucmVhcmcgOiB0cnVlXG4gIH07XG5cbiAgdmFyIGZvcmNlQ3VycnkgPSAoJ2N1cnJ5JyBpbiBvcHRpb25zKSAmJiBvcHRpb25zLmN1cnJ5LFxuICAgICAgZm9yY2VGaXhlZCA9ICgnZml4ZWQnIGluIG9wdGlvbnMpICYmIG9wdGlvbnMuZml4ZWQsXG4gICAgICBmb3JjZVJlYXJnID0gKCdyZWFyZycgaW4gb3B0aW9ucykgJiYgb3B0aW9ucy5yZWFyZyxcbiAgICAgIHBsYWNlaG9sZGVyID0gaXNMaWIgPyBmdW5jIDogZmFsbGJhY2tIb2xkZXIsXG4gICAgICBwcmlzdGluZSA9IGlzTGliID8gZnVuYy5ydW5JbkNvbnRleHQoKSA6IHVuZGVmaW5lZDtcblxuICB2YXIgaGVscGVycyA9IGlzTGliID8gZnVuYyA6IHtcbiAgICAnYXJ5JzogdXRpbC5hcnksXG4gICAgJ2Fzc2lnbic6IHV0aWwuYXNzaWduLFxuICAgICdjbG9uZSc6IHV0aWwuY2xvbmUsXG4gICAgJ2N1cnJ5JzogdXRpbC5jdXJyeSxcbiAgICAnZm9yRWFjaCc6IHV0aWwuZm9yRWFjaCxcbiAgICAnaXNBcnJheSc6IHV0aWwuaXNBcnJheSxcbiAgICAnaXNGdW5jdGlvbic6IHV0aWwuaXNGdW5jdGlvbixcbiAgICAnaXRlcmF0ZWUnOiB1dGlsLml0ZXJhdGVlLFxuICAgICdrZXlzJzogdXRpbC5rZXlzLFxuICAgICdyZWFyZyc6IHV0aWwucmVhcmcsXG4gICAgJ3NwcmVhZCc6IHV0aWwuc3ByZWFkLFxuICAgICd0b1BhdGgnOiB1dGlsLnRvUGF0aFxuICB9O1xuXG4gIHZhciBhcnkgPSBoZWxwZXJzLmFyeSxcbiAgICAgIGFzc2lnbiA9IGhlbHBlcnMuYXNzaWduLFxuICAgICAgY2xvbmUgPSBoZWxwZXJzLmNsb25lLFxuICAgICAgY3VycnkgPSBoZWxwZXJzLmN1cnJ5LFxuICAgICAgZWFjaCA9IGhlbHBlcnMuZm9yRWFjaCxcbiAgICAgIGlzQXJyYXkgPSBoZWxwZXJzLmlzQXJyYXksXG4gICAgICBpc0Z1bmN0aW9uID0gaGVscGVycy5pc0Z1bmN0aW9uLFxuICAgICAga2V5cyA9IGhlbHBlcnMua2V5cyxcbiAgICAgIHJlYXJnID0gaGVscGVycy5yZWFyZyxcbiAgICAgIHNwcmVhZCA9IGhlbHBlcnMuc3ByZWFkLFxuICAgICAgdG9QYXRoID0gaGVscGVycy50b1BhdGg7XG5cbiAgdmFyIGFyeU1ldGhvZEtleXMgPSBrZXlzKG1hcHBpbmcuYXJ5TWV0aG9kKTtcblxuICB2YXIgd3JhcHBlcnMgPSB7XG4gICAgJ2Nhc3RBcnJheSc6IGZ1bmN0aW9uKGNhc3RBcnJheSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgIHJldHVybiBpc0FycmF5KHZhbHVlKVxuICAgICAgICAgID8gY2FzdEFycmF5KGNsb25lQXJyYXkodmFsdWUpKVxuICAgICAgICAgIDogY2FzdEFycmF5LmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfSxcbiAgICAnaXRlcmF0ZWUnOiBmdW5jdGlvbihpdGVyYXRlZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZnVuYyA9IGFyZ3VtZW50c1swXSxcbiAgICAgICAgICAgIGFyaXR5ID0gYXJndW1lbnRzWzFdLFxuICAgICAgICAgICAgcmVzdWx0ID0gaXRlcmF0ZWUoZnVuYywgYXJpdHkpLFxuICAgICAgICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICAgICAgICBpZiAoY29uZmlnLmNhcCAmJiB0eXBlb2YgYXJpdHkgPT0gJ251bWJlcicpIHtcbiAgICAgICAgICBhcml0eSA9IGFyaXR5ID4gMiA/IChhcml0eSAtIDIpIDogMTtcbiAgICAgICAgICByZXR1cm4gKGxlbmd0aCAmJiBsZW5ndGggPD0gYXJpdHkpID8gcmVzdWx0IDogYmFzZUFyeShyZXN1bHQsIGFyaXR5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcbiAgICB9LFxuICAgICdtaXhpbic6IGZ1bmN0aW9uKG1peGluKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICAgIHZhciBmdW5jID0gdGhpcztcbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgICAgcmV0dXJuIG1peGluKGZ1bmMsIE9iamVjdChzb3VyY2UpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFpcnMgPSBbXTtcbiAgICAgICAgZWFjaChrZXlzKHNvdXJjZSksIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKHNvdXJjZVtrZXldKSkge1xuICAgICAgICAgICAgcGFpcnMucHVzaChba2V5LCBmdW5jLnByb3RvdHlwZVtrZXldXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBtaXhpbihmdW5jLCBPYmplY3Qoc291cmNlKSk7XG5cbiAgICAgICAgZWFjaChwYWlycywgZnVuY3Rpb24ocGFpcikge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IHBhaXJbMV07XG4gICAgICAgICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgICAgICBmdW5jLnByb3RvdHlwZVtwYWlyWzBdXSA9IHZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgZnVuYy5wcm90b3R5cGVbcGFpclswXV07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZ1bmM7XG4gICAgICB9O1xuICAgIH0sXG4gICAgJ3J1bkluQ29udGV4dCc6IGZ1bmN0aW9uKHJ1bkluQ29udGV4dCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIGJhc2VDb252ZXJ0KHV0aWwsIHJ1bkluQ29udGV4dChjb250ZXh0KSwgb3B0aW9ucyk7XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGNsb25lIG9mIGBvYmplY3RgIGJ5IGBwYXRoYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICAgKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjbG9uZSBieS5cbiAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIG9iamVjdC5cbiAgICovXG4gIGZ1bmN0aW9uIGNsb25lQnlQYXRoKG9iamVjdCwgcGF0aCkge1xuICAgIHBhdGggPSB0b1BhdGgocGF0aCk7XG5cbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICAgIGxhc3RJbmRleCA9IGxlbmd0aCAtIDEsXG4gICAgICAgIHJlc3VsdCA9IGNsb25lKE9iamVjdChvYmplY3QpKSxcbiAgICAgICAgbmVzdGVkID0gcmVzdWx0O1xuXG4gICAgd2hpbGUgKG5lc3RlZCAhPSBudWxsICYmICsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBrZXkgPSBwYXRoW2luZGV4XSxcbiAgICAgICAgICB2YWx1ZSA9IG5lc3RlZFtrZXldO1xuXG4gICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICBuZXN0ZWRbcGF0aFtpbmRleF1dID0gY2xvbmUoaW5kZXggPT0gbGFzdEluZGV4ID8gdmFsdWUgOiBPYmplY3QodmFsdWUpKTtcbiAgICAgIH1cbiAgICAgIG5lc3RlZCA9IG5lc3RlZFtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGBsb2Rhc2hgIHRvIGFuIGltbXV0YWJsZSBhdXRvLWN1cnJpZWQgaXRlcmF0ZWUtZmlyc3QgZGF0YS1sYXN0XG4gICAqIHZlcnNpb24gd2l0aCBjb252ZXJzaW9uIGBvcHRpb25zYCBhcHBsaWVkLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFRoZSBvcHRpb25zIG9iamVjdC4gU2VlIGBiYXNlQ29udmVydGAgZm9yIG1vcmUgZGV0YWlscy5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgYGxvZGFzaGAuXG4gICAqL1xuICBmdW5jdGlvbiBjb252ZXJ0TGliKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gXy5ydW5JbkNvbnRleHQuY29udmVydChvcHRpb25zKSh1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGNvbnZlcnRlciBmdW5jdGlvbiBmb3IgYGZ1bmNgIG9mIGBuYW1lYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbnZlcnRlciBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZUNvbnZlcnRlcihuYW1lLCBmdW5jKSB7XG4gICAgdmFyIG9sZE9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHJldHVybiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICB2YXIgbmV3VXRpbCA9IGlzTGliID8gcHJpc3RpbmUgOiBoZWxwZXJzLFxuICAgICAgICAgIG5ld0Z1bmMgPSBpc0xpYiA/IHByaXN0aW5lW25hbWVdIDogZnVuYyxcbiAgICAgICAgICBuZXdPcHRpb25zID0gYXNzaWduKGFzc2lnbih7fSwgb2xkT3B0aW9ucyksIG9wdGlvbnMpO1xuXG4gICAgICByZXR1cm4gYmFzZUNvbnZlcnQobmV3VXRpbCwgbmFtZSwgbmV3RnVuYywgbmV3T3B0aW9ucyk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3cmFwcyBgZnVuY2AgdG8gaW52b2tlIGl0cyBpdGVyYXRlZSwgd2l0aCB1cCB0byBgbmBcbiAgICogYXJndW1lbnRzLCBpZ25vcmluZyBhbnkgYWRkaXRpb25hbCBhcmd1bWVudHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBpdGVyYXRlZSBhcmd1bWVudHMgZm9yLlxuICAgKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgYXJpdHkgY2FwLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGl0ZXJhdGVlQXJ5KGZ1bmMsIG4pIHtcbiAgICByZXR1cm4gb3ZlckFyZyhmdW5jLCBmdW5jdGlvbihmdW5jKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJyA/IGJhc2VBcnkoZnVuYywgbikgOiBmdW5jO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCB0byBpbnZva2UgaXRzIGl0ZXJhdGVlIHdpdGggYXJndW1lbnRzXG4gICAqIGFycmFuZ2VkIGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWVkIGBpbmRleGVzYCB3aGVyZSB0aGUgYXJndW1lbnQgdmFsdWUgYXRcbiAgICogdGhlIGZpcnN0IGluZGV4IGlzIHByb3ZpZGVkIGFzIHRoZSBmaXJzdCBhcmd1bWVudCwgdGhlIGFyZ3VtZW50IHZhbHVlIGF0XG4gICAqIHRoZSBzZWNvbmQgaW5kZXggaXMgcHJvdmlkZWQgYXMgdGhlIHNlY29uZCBhcmd1bWVudCwgYW5kIHNvIG9uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZWFycmFuZ2UgaXRlcmF0ZWUgYXJndW1lbnRzIGZvci5cbiAgICogQHBhcmFtIHtudW1iZXJbXX0gaW5kZXhlcyBUaGUgYXJyYW5nZWQgYXJndW1lbnQgaW5kZXhlcy5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBpdGVyYXRlZVJlYXJnKGZ1bmMsIGluZGV4ZXMpIHtcbiAgICByZXR1cm4gb3ZlckFyZyhmdW5jLCBmdW5jdGlvbihmdW5jKSB7XG4gICAgICB2YXIgbiA9IGluZGV4ZXMubGVuZ3RoO1xuICAgICAgcmV0dXJuIGJhc2VBcml0eShyZWFyZyhiYXNlQXJ5KGZ1bmMsIG4pLCBpbmRleGVzKSwgbik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgZmlyc3QgYXJndW1lbnQgcGFzc2VkXG4gICAqIHRocnUgYHRyYW5zZm9ybWAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gICAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgZnVuY3Rpb25zIHRvIHRyYW5zZm9ybSB0aGUgZmlyc3QgYXJndW1lbnQuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmdW5jKCk7XG4gICAgICB9XG4gICAgICB2YXIgYXJncyA9IEFycmF5KGxlbmd0aCk7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgYXJnc1tsZW5ndGhdID0gYXJndW1lbnRzW2xlbmd0aF07XG4gICAgICB9XG4gICAgICB2YXIgaW5kZXggPSBjb25maWcucmVhcmcgPyAwIDogKGxlbmd0aCAtIDEpO1xuICAgICAgYXJnc1tpbmRleF0gPSB0cmFuc2Zvcm0oYXJnc1tpbmRleF0pO1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdyYXBzIGBmdW5jYCBhbmQgYXBwbHlzIHRoZSBjb252ZXJzaW9uc1xuICAgKiBydWxlcyBieSBgbmFtZWAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGNvbnZlcnRlZCBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIHdyYXAobmFtZSwgZnVuYykge1xuICAgIG5hbWUgPSBtYXBwaW5nLmFsaWFzVG9SZWFsW25hbWVdIHx8IG5hbWU7XG5cbiAgICB2YXIgcmVzdWx0LFxuICAgICAgICB3cmFwcGVkID0gZnVuYyxcbiAgICAgICAgd3JhcHBlciA9IHdyYXBwZXJzW25hbWVdO1xuXG4gICAgaWYgKHdyYXBwZXIpIHtcbiAgICAgIHdyYXBwZWQgPSB3cmFwcGVyKGZ1bmMpO1xuICAgIH1cbiAgICBlbHNlIGlmIChjb25maWcuaW1tdXRhYmxlKSB7XG4gICAgICBpZiAobXV0YXRlTWFwLmFycmF5W25hbWVdKSB7XG4gICAgICAgIHdyYXBwZWQgPSBpbW11dFdyYXAoZnVuYywgY2xvbmVBcnJheSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChtdXRhdGVNYXAub2JqZWN0W25hbWVdKSB7XG4gICAgICAgIHdyYXBwZWQgPSBpbW11dFdyYXAoZnVuYywgY3JlYXRlQ2xvbmVyKGZ1bmMpKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKG11dGF0ZU1hcC5zZXRbbmFtZV0pIHtcbiAgICAgICAgd3JhcHBlZCA9IGltbXV0V3JhcChmdW5jLCBjbG9uZUJ5UGF0aCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVhY2goYXJ5TWV0aG9kS2V5cywgZnVuY3Rpb24oYXJ5S2V5KSB7XG4gICAgICBlYWNoKG1hcHBpbmcuYXJ5TWV0aG9kW2FyeUtleV0sIGZ1bmN0aW9uKG90aGVyTmFtZSkge1xuICAgICAgICBpZiAobmFtZSA9PSBvdGhlck5hbWUpIHtcbiAgICAgICAgICB2YXIgYXJ5TiA9ICFpc0xpYiAmJiBtYXBwaW5nLml0ZXJhdGVlQXJ5W25hbWVdLFxuICAgICAgICAgICAgICByZWFyZ0luZGV4ZXMgPSBtYXBwaW5nLml0ZXJhdGVlUmVhcmdbbmFtZV0sXG4gICAgICAgICAgICAgIHNwcmVhZFN0YXJ0ID0gbWFwcGluZy5tZXRob2RTcHJlYWRbbmFtZV07XG5cbiAgICAgICAgICByZXN1bHQgPSB3cmFwcGVkO1xuICAgICAgICAgIGlmIChjb25maWcuZml4ZWQgJiYgKGZvcmNlRml4ZWQgfHwgIW1hcHBpbmcuc2tpcEZpeGVkW25hbWVdKSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gc3ByZWFkU3RhcnQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICA/IGFyeShyZXN1bHQsIGFyeUtleSlcbiAgICAgICAgICAgICAgOiBzcHJlYWQocmVzdWx0LCBzcHJlYWRTdGFydCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjb25maWcucmVhcmcgJiYgYXJ5S2V5ID4gMSAmJiAoZm9yY2VSZWFyZyB8fCAhbWFwcGluZy5za2lwUmVhcmdbbmFtZV0pKSB7XG4gICAgICAgICAgICByZXN1bHQgPSByZWFyZyhyZXN1bHQsIG1hcHBpbmcubWV0aG9kUmVhcmdbbmFtZV0gfHwgbWFwcGluZy5hcnlSZWFyZ1thcnlLZXldKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNvbmZpZy5jYXApIHtcbiAgICAgICAgICAgIGlmIChyZWFyZ0luZGV4ZXMpIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gaXRlcmF0ZWVSZWFyZyhyZXN1bHQsIHJlYXJnSW5kZXhlcyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyeU4pIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gaXRlcmF0ZWVBcnkocmVzdWx0LCBhcnlOKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZvcmNlQ3VycnkgfHwgKGNvbmZpZy5jdXJyeSAmJiBhcnlLZXkgPiAxKSkge1xuICAgICAgICAgICAgZm9yY2VDdXJyeSAgJiYgY29uc29sZS5sb2coZm9yY2VDdXJyeSwgbmFtZSk7XG4gICAgICAgICAgICByZXN1bHQgPSBjdXJyeShyZXN1bHQsIGFyeUtleSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gIXJlc3VsdDtcbiAgICB9KTtcblxuICAgIHJlc3VsdCB8fCAocmVzdWx0ID0gd3JhcHBlZCk7XG4gICAgaWYgKHJlc3VsdCA9PSBmdW5jKSB7XG4gICAgICByZXN1bHQgPSBmb3JjZUN1cnJ5ID8gY3VycnkocmVzdWx0LCAxKSA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmVzdWx0LmNvbnZlcnQgPSBjcmVhdGVDb252ZXJ0ZXIobmFtZSwgZnVuYyk7XG4gICAgaWYgKG1hcHBpbmcucGxhY2Vob2xkZXJbbmFtZV0pIHtcbiAgICAgIHNldFBsYWNlaG9sZGVyID0gdHJ1ZTtcbiAgICAgIHJlc3VsdC5wbGFjZWhvbGRlciA9IGZ1bmMucGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlcjtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIGlmICghaXNPYmopIHtcbiAgICByZXR1cm4gd3JhcChuYW1lLCBmdW5jKTtcbiAgfVxuICB2YXIgXyA9IGZ1bmM7XG5cbiAgLy8gQ29udmVydCBtZXRob2RzIGJ5IGFyeSBjYXAuXG4gIHZhciBwYWlycyA9IFtdO1xuICBlYWNoKGFyeU1ldGhvZEtleXMsIGZ1bmN0aW9uKGFyeUtleSkge1xuICAgIGVhY2gobWFwcGluZy5hcnlNZXRob2RbYXJ5S2V5XSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbWFwcGluZy5yZW1hcFtrZXldIHx8IGtleV07XG4gICAgICBpZiAoZnVuYykge1xuICAgICAgICBwYWlycy5wdXNoKFtrZXksIHdyYXAoa2V5LCBmdW5jKV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICAvLyBDb252ZXJ0IHJlbWFpbmluZyBtZXRob2RzLlxuICBlYWNoKGtleXMoXyksIGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBmdW5jID0gX1trZXldO1xuICAgIGlmICh0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gcGFpcnMubGVuZ3RoO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmIChwYWlyc1tsZW5ndGhdWzBdID09IGtleSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZnVuYy5jb252ZXJ0ID0gY3JlYXRlQ29udmVydGVyKGtleSwgZnVuYyk7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIGZ1bmNdKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEFzc2lnbiB0byBgX2AgbGVhdmluZyBgXy5wcm90b3R5cGVgIHVuY2hhbmdlZCB0byBhbGxvdyBjaGFpbmluZy5cbiAgZWFjaChwYWlycywgZnVuY3Rpb24ocGFpcikge1xuICAgIF9bcGFpclswXV0gPSBwYWlyWzFdO1xuICB9KTtcblxuICBfLmNvbnZlcnQgPSBjb252ZXJ0TGliO1xuICBpZiAoc2V0UGxhY2Vob2xkZXIpIHtcbiAgICBfLnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XG4gIH1cbiAgLy8gQXNzaWduIGFsaWFzZXMuXG4gIGVhY2goa2V5cyhfKSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgZWFjaChtYXBwaW5nLnJlYWxUb0FsaWFzW2tleV0gfHwgW10sIGZ1bmN0aW9uKGFsaWFzKSB7XG4gICAgICBfW2FsaWFzXSA9IF9ba2V5XTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIF87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNvbnZlcnQ7XG4iXX0=