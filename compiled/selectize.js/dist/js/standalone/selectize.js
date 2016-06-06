'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * sifter.js
 * Copyright (c) 2013 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('sifter', factory);
	} else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
		module.exports = factory();
	} else {
		root.Sifter = factory();
	}
})(undefined, function () {

	/**
  * Textually searches arrays and hashes of objects
  * by property (or multiple properties). Designed
  * specifically for autocomplete.
  *
  * @constructor
  * @param {array|object} items
  * @param {object} items
  */
	var Sifter = function Sifter(items, settings) {
		this.items = items;
		this.settings = settings || { diacritics: true };
	};

	/**
  * Splits a search string into an array of individual
  * regexps to be used to match results.
  *
  * @param {string} query
  * @returns {array}
  */
	Sifter.prototype.tokenize = function (query) {
		query = trim(String(query || '').toLowerCase());
		if (!query || !query.length) return [];

		var i, n, regex, letter;
		var tokens = [];
		var words = query.split(/ +/);

		for (i = 0, n = words.length; i < n; i++) {
			regex = escape_regex(words[i]);
			if (this.settings.diacritics) {
				for (letter in DIACRITICS) {
					if (DIACRITICS.hasOwnProperty(letter)) {
						regex = regex.replace(new RegExp(letter, 'g'), DIACRITICS[letter]);
					}
				}
			}
			tokens.push({
				string: words[i],
				regex: new RegExp(regex, 'i')
			});
		}

		return tokens;
	};

	/**
  * Iterates over arrays and hashes.
  *
  * ```
  * this.iterator(this.items, function(item, id) {
  *    // invoked for each item
  * });
  * ```
  *
  * @param {array|object} object
  */
	Sifter.prototype.iterator = function (object, callback) {
		var iterator;
		if (is_array(object)) {
			iterator = Array.prototype.forEach || function (callback) {
				for (var i = 0, n = this.length; i < n; i++) {
					callback(this[i], i, this);
				}
			};
		} else {
			iterator = function iterator(callback) {
				for (var key in this) {
					if (this.hasOwnProperty(key)) {
						callback(this[key], key, this);
					}
				}
			};
		}

		iterator.apply(object, [callback]);
	};

	/**
  * Returns a function to be used to score individual results.
  *
  * Good matches will have a higher score than poor matches.
  * If an item is not a match, 0 will be returned by the function.
  *
  * @param {object|string} search
  * @param {object} options (optional)
  * @returns {function}
  */
	Sifter.prototype.getScoreFunction = function (search, options) {
		var self, fields, tokens, token_count;

		self = this;
		search = self.prepareSearch(search, options);
		tokens = search.tokens;
		fields = search.options.fields;
		token_count = tokens.length;

		/**
   * Calculates how close of a match the
   * given value is against a search token.
   *
   * @param {mixed} value
   * @param {object} token
   * @return {number}
   */
		var scoreValue = function scoreValue(value, token) {
			var score, pos;

			if (!value) return 0;
			value = String(value || '');
			pos = value.search(token.regex);
			if (pos === -1) return 0;
			score = token.string.length / value.length;
			if (pos === 0) score += 0.5;
			return score;
		};

		/**
   * Calculates the score of an object
   * against the search query.
   *
   * @param {object} token
   * @param {object} data
   * @return {number}
   */
		var scoreObject = function () {
			var field_count = fields.length;
			if (!field_count) {
				return function () {
					return 0;
				};
			}
			if (field_count === 1) {
				return function (token, data) {
					return scoreValue(data[fields[0]], token);
				};
			}
			return function (token, data) {
				for (var i = 0, sum = 0; i < field_count; i++) {
					sum += scoreValue(data[fields[i]], token);
				}
				return sum / field_count;
			};
		}();

		if (!token_count) {
			return function () {
				return 0;
			};
		}
		if (token_count === 1) {
			return function (data) {
				return scoreObject(tokens[0], data);
			};
		}

		if (search.options.conjunction === 'and') {
			return function (data) {
				var score;
				for (var i = 0, sum = 0; i < token_count; i++) {
					score = scoreObject(tokens[i], data);
					if (score <= 0) return 0;
					sum += score;
				}
				return sum / token_count;
			};
		} else {
			return function (data) {
				for (var i = 0, sum = 0; i < token_count; i++) {
					sum += scoreObject(tokens[i], data);
				}
				return sum / token_count;
			};
		}
	};

	/**
  * Returns a function that can be used to compare two
  * results, for sorting purposes. If no sorting should
  * be performed, `null` will be returned.
  *
  * @param {string|object} search
  * @param {object} options
  * @return function(a,b)
  */
	Sifter.prototype.getSortFunction = function (search, options) {
		var i, n, self, field, fields, fields_count, multiplier, multipliers, get_field, implicit_score, sort;

		self = this;
		search = self.prepareSearch(search, options);
		sort = !search.query && options.sort_empty || options.sort;

		/**
   * Fetches the specified sort field value
   * from a search result item.
   *
   * @param  {string} name
   * @param  {object} result
   * @return {mixed}
   */
		get_field = function get_field(name, result) {
			if (name === '$score') return result.score;
			return self.items[result.id][name];
		};

		// parse options
		fields = [];
		if (sort) {
			for (i = 0, n = sort.length; i < n; i++) {
				if (search.query || sort[i].field !== '$score') {
					fields.push(sort[i]);
				}
			}
		}

		// the "$score" field is implied to be the primary
		// sort field, unless it's manually specified
		if (search.query) {
			implicit_score = true;
			for (i = 0, n = fields.length; i < n; i++) {
				if (fields[i].field === '$score') {
					implicit_score = false;
					break;
				}
			}
			if (implicit_score) {
				fields.unshift({ field: '$score', direction: 'desc' });
			}
		} else {
			for (i = 0, n = fields.length; i < n; i++) {
				if (fields[i].field === '$score') {
					fields.splice(i, 1);
					break;
				}
			}
		}

		multipliers = [];
		for (i = 0, n = fields.length; i < n; i++) {
			multipliers.push(fields[i].direction === 'desc' ? -1 : 1);
		}

		// build function
		fields_count = fields.length;
		if (!fields_count) {
			return null;
		} else if (fields_count === 1) {
			field = fields[0].field;
			multiplier = multipliers[0];
			return function (a, b) {
				return multiplier * cmp(get_field(field, a), get_field(field, b));
			};
		} else {
			return function (a, b) {
				var i, result, a_value, b_value, field;
				for (i = 0; i < fields_count; i++) {
					field = fields[i].field;
					result = multipliers[i] * cmp(get_field(field, a), get_field(field, b));
					if (result) return result;
				}
				return 0;
			};
		}
	};

	/**
  * Parses a search query and returns an object
  * with tokens and fields ready to be populated
  * with results.
  *
  * @param {string} query
  * @param {object} options
  * @returns {object}
  */
	Sifter.prototype.prepareSearch = function (query, options) {
		if ((typeof query === 'undefined' ? 'undefined' : _typeof(query)) === 'object') return query;

		options = extend({}, options);

		var option_fields = options.fields;
		var option_sort = options.sort;
		var option_sort_empty = options.sort_empty;

		if (option_fields && !is_array(option_fields)) options.fields = [option_fields];
		if (option_sort && !is_array(option_sort)) options.sort = [option_sort];
		if (option_sort_empty && !is_array(option_sort_empty)) options.sort_empty = [option_sort_empty];

		return {
			options: options,
			query: String(query || '').toLowerCase(),
			tokens: this.tokenize(query),
			total: 0,
			items: []
		};
	};

	/**
  * Searches through all items and returns a sorted array of matches.
  *
  * The `options` parameter can contain:
  *
  *   - fields {string|array}
  *   - sort {array}
  *   - score {function}
  *   - filter {bool}
  *   - limit {integer}
  *
  * Returns an object containing:
  *
  *   - options {object}
  *   - query {string}
  *   - tokens {array}
  *   - total {int}
  *   - items {array}
  *
  * @param {string} query
  * @param {object} options
  * @returns {object}
  */
	Sifter.prototype.search = function (query, options) {
		var self = this,
		    value,
		    score,
		    search,
		    calculateScore;
		var fn_sort;
		var fn_score;

		search = this.prepareSearch(query, options);
		options = search.options;
		query = search.query;

		// generate result scoring function
		fn_score = options.score || self.getScoreFunction(search);

		// perform search and sort
		if (query.length) {
			self.iterator(self.items, function (item, id) {
				score = fn_score(item);
				if (options.filter === false || score > 0) {
					search.items.push({ 'score': score, 'id': id });
				}
			});
		} else {
			self.iterator(self.items, function (item, id) {
				search.items.push({ 'score': 1, 'id': id });
			});
		}

		fn_sort = self.getSortFunction(search, options);
		if (fn_sort) search.items.sort(fn_sort);

		// apply limits
		search.total = search.items.length;
		if (typeof options.limit === 'number') {
			search.items = search.items.slice(0, options.limit);
		}

		return search;
	};

	// utilities
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var cmp = function cmp(a, b) {
		if (typeof a === 'number' && typeof b === 'number') {
			return a > b ? 1 : a < b ? -1 : 0;
		}
		a = asciifold(String(a || ''));
		b = asciifold(String(b || ''));
		if (a > b) return 1;
		if (b > a) return -1;
		return 0;
	};

	var extend = function extend(a, b) {
		var i, n, k, object;
		for (i = 1, n = arguments.length; i < n; i++) {
			object = arguments[i];
			if (!object) continue;
			for (k in object) {
				if (object.hasOwnProperty(k)) {
					a[k] = object[k];
				}
			}
		}
		return a;
	};

	var trim = function trim(str) {
		return (str + '').replace(/^\s+|\s+$|/g, '');
	};

	var escape_regex = function escape_regex(str) {
		return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
	};

	var is_array = Array.isArray || $ && $.isArray || function (object) {
		return Object.prototype.toString.call(object) === '[object Array]';
	};

	var DIACRITICS = {
		'a': '[aÀÁÂÃÄÅàáâãäåĀāąĄ]',
		'c': '[cÇçćĆčČ]',
		'd': '[dđĐďĎ]',
		'e': '[eÈÉÊËèéêëěĚĒēęĘ]',
		'i': '[iÌÍÎÏìíîïĪī]',
		'l': '[lłŁ]',
		'n': '[nÑñňŇńŃ]',
		'o': '[oÒÓÔÕÕÖØòóôõöøŌō]',
		'r': '[rřŘ]',
		's': '[sŠšśŚ]',
		't': '[tťŤ]',
		'u': '[uÙÚÛÜùúûüůŮŪū]',
		'y': '[yŸÿýÝ]',
		'z': '[zŽžżŻźŹ]'
	};

	var asciifold = function () {
		var i, n, k, chunk;
		var foreignletters = '';
		var lookup = {};
		for (k in DIACRITICS) {
			if (DIACRITICS.hasOwnProperty(k)) {
				chunk = DIACRITICS[k].substring(2, DIACRITICS[k].length - 1);
				foreignletters += chunk;
				for (i = 0, n = chunk.length; i < n; i++) {
					lookup[chunk.charAt(i)] = k;
				}
			}
		}
		var regexp = new RegExp('[' + foreignletters + ']', 'g');
		return function (str) {
			return str.replace(regexp, function (foreignletter) {
				return lookup[foreignletter];
			}).toLowerCase();
		};
	}();

	// export
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	return Sifter;
});

/**
 * microplugin.js
 * Copyright (c) 2013 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('microplugin', factory);
	} else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
		module.exports = factory();
	} else {
		root.MicroPlugin = factory();
	}
})(undefined, function () {
	var MicroPlugin = {};

	MicroPlugin.mixin = function (Interface) {
		Interface.plugins = {};

		/**
   * Initializes the listed plugins (with options).
   * Acceptable formats:
   *
   * List (without options):
   *   ['a', 'b', 'c']
   *
   * List (with options):
   *   [{'name': 'a', options: {}}, {'name': 'b', options: {}}]
   *
   * Hash (with options):
   *   {'a': { ... }, 'b': { ... }, 'c': { ... }}
   *
   * @param {mixed} plugins
   */
		Interface.prototype.initializePlugins = function (plugins) {
			var i, n, key;
			var self = this;
			var queue = [];

			self.plugins = {
				names: [],
				settings: {},
				requested: {},
				loaded: {}
			};

			if (utils.isArray(plugins)) {
				for (i = 0, n = plugins.length; i < n; i++) {
					if (typeof plugins[i] === 'string') {
						queue.push(plugins[i]);
					} else {
						self.plugins.settings[plugins[i].name] = plugins[i].options;
						queue.push(plugins[i].name);
					}
				}
			} else if (plugins) {
				for (key in plugins) {
					if (plugins.hasOwnProperty(key)) {
						self.plugins.settings[key] = plugins[key];
						queue.push(key);
					}
				}
			}

			while (queue.length) {
				self.require(queue.shift());
			}
		};

		Interface.prototype.loadPlugin = function (name) {
			var self = this;
			var plugins = self.plugins;
			var plugin = Interface.plugins[name];

			if (!Interface.plugins.hasOwnProperty(name)) {
				throw new Error('Unable to find "' + name + '" plugin');
			}

			plugins.requested[name] = true;
			plugins.loaded[name] = plugin.fn.apply(self, [self.plugins.settings[name] || {}]);
			plugins.names.push(name);
		};

		/**
   * Initializes a plugin.
   *
   * @param {string} name
   */
		Interface.prototype.require = function (name) {
			var self = this;
			var plugins = self.plugins;

			if (!self.plugins.loaded.hasOwnProperty(name)) {
				if (plugins.requested[name]) {
					throw new Error('Plugin has circular dependency ("' + name + '")');
				}
				self.loadPlugin(name);
			}

			return plugins.loaded[name];
		};

		/**
   * Registers a plugin.
   *
   * @param {string} name
   * @param {function} fn
   */
		Interface.define = function (name, fn) {
			Interface.plugins[name] = {
				'name': name,
				'fn': fn
			};
		};
	};

	var utils = {
		isArray: Array.isArray || function (vArg) {
			return Object.prototype.toString.call(vArg) === '[object Array]';
		}
	};

	return MicroPlugin;
});

/**
 * selectize.js (v0.12.1)
 * Copyright (c) 2013–2015 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

/*jshint curly:false */
/*jshint browser:true */

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('selectize', ['jquery', 'sifter', 'microplugin'], factory);
	} else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
		module.exports = factory(require('jquery'), require('sifter'), require('microplugin'));
	} else {
		root.Selectize = factory(root.jQuery, root.Sifter, root.MicroPlugin);
	}
})(undefined, function ($, Sifter, MicroPlugin) {
	'use strict';

	var highlight = function highlight($element, pattern) {
		if (typeof pattern === 'string' && !pattern.length) return;
		var regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;

		var highlight = function highlight(node) {
			var skip = 0;
			if (node.nodeType === 3) {
				var pos = node.data.search(regex);
				if (pos >= 0 && node.data.length > 0) {
					var match = node.data.match(regex);
					var spannode = document.createElement('span');
					spannode.className = 'highlight';
					var middlebit = node.splitText(pos);
					var endbit = middlebit.splitText(match[0].length);
					var middleclone = middlebit.cloneNode(true);
					spannode.appendChild(middleclone);
					middlebit.parentNode.replaceChild(spannode, middlebit);
					skip = 1;
				}
			} else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
				for (var i = 0; i < node.childNodes.length; ++i) {
					i += highlight(node.childNodes[i]);
				}
			}
			return skip;
		};

		return $element.each(function () {
			highlight(this);
		});
	};

	var MicroEvent = function MicroEvent() {};
	MicroEvent.prototype = {
		on: function on(event, fct) {
			this._events = this._events || {};
			this._events[event] = this._events[event] || [];
			this._events[event].push(fct);
		},
		off: function off(event, fct) {
			var n = arguments.length;
			if (n === 0) return delete this._events;
			if (n === 1) return delete this._events[event];

			this._events = this._events || {};
			if (event in this._events === false) return;
			this._events[event].splice(this._events[event].indexOf(fct), 1);
		},
		trigger: function trigger(event /* , args... */) {
			this._events = this._events || {};
			if (event in this._events === false) return;
			for (var i = 0; i < this._events[event].length; i++) {
				this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		}
	};

	/**
  * Mixin will delegate all MicroEvent.js function in the destination object.
  *
  * - MicroEvent.mixin(Foobar) will make Foobar able to use MicroEvent
  *
  * @param {object} the object which will support MicroEvent
  */
	MicroEvent.mixin = function (destObject) {
		var props = ['on', 'off', 'trigger'];
		for (var i = 0; i < props.length; i++) {
			destObject.prototype[props[i]] = MicroEvent.prototype[props[i]];
		}
	};

	var IS_MAC = /Mac/.test(navigator.userAgent);

	var KEY_A = 65;
	var KEY_COMMA = 188;
	var KEY_RETURN = 13;
	var KEY_ESC = 27;
	var KEY_LEFT = 37;
	var KEY_UP = 38;
	var KEY_P = 80;
	var KEY_RIGHT = 39;
	var KEY_DOWN = 40;
	var KEY_N = 78;
	var KEY_BACKSPACE = 8;
	var KEY_DELETE = 46;
	var KEY_SHIFT = 16;
	var KEY_CMD = IS_MAC ? 91 : 17;
	var KEY_CTRL = IS_MAC ? 18 : 17;
	var KEY_TAB = 9;

	var TAG_SELECT = 1;
	var TAG_INPUT = 2;

	// for now, android support in general is too spotty to support validity
	var SUPPORTS_VALIDITY_API = !/android/i.test(window.navigator.userAgent) && !!document.createElement('form').validity;

	var isset = function isset(object) {
		return typeof object !== 'undefined';
	};

	/**
  * Converts a scalar to its best string representation
  * for hash keys and HTML attribute values.
  *
  * Transformations:
  *   'str'     -> 'str'
  *   null      -> ''
  *   undefined -> ''
  *   true      -> '1'
  *   false     -> '0'
  *   0         -> '0'
  *   1         -> '1'
  *
  * @param {string} value
  * @returns {string|null}
  */
	var hash_key = function hash_key(value) {
		if (typeof value === 'undefined' || value === null) return null;
		if (typeof value === 'boolean') return value ? '1' : '0';
		return value + '';
	};

	/**
  * Escapes a string for use within HTML.
  *
  * @param {string} str
  * @returns {string}
  */
	var escape_html = function escape_html(str) {
		return (str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	};

	/**
  * Escapes "$" characters in replacement strings.
  *
  * @param {string} str
  * @returns {string}
  */
	var escape_replace = function escape_replace(str) {
		return (str + '').replace(/\$/g, '$$$$');
	};

	var hook = {};

	/**
  * Wraps `method` on `self` so that `fn`
  * is invoked before the original method.
  *
  * @param {object} self
  * @param {string} method
  * @param {function} fn
  */
	hook.before = function (self, method, fn) {
		var original = self[method];
		self[method] = function () {
			fn.apply(self, arguments);
			return original.apply(self, arguments);
		};
	};

	/**
  * Wraps `method` on `self` so that `fn`
  * is invoked after the original method.
  *
  * @param {object} self
  * @param {string} method
  * @param {function} fn
  */
	hook.after = function (self, method, fn) {
		var original = self[method];
		self[method] = function () {
			var result = original.apply(self, arguments);
			fn.apply(self, arguments);
			return result;
		};
	};

	/**
  * Wraps `fn` so that it can only be invoked once.
  *
  * @param {function} fn
  * @returns {function}
  */
	var once = function once(fn) {
		var called = false;
		return function () {
			if (called) return;
			called = true;
			fn.apply(this, arguments);
		};
	};

	/**
  * Wraps `fn` so that it can only be called once
  * every `delay` milliseconds (invoked on the falling edge).
  *
  * @param {function} fn
  * @param {int} delay
  * @returns {function}
  */
	var debounce = function debounce(fn, delay) {
		var timeout;
		return function () {
			var self = this;
			var args = arguments;
			window.clearTimeout(timeout);
			timeout = window.setTimeout(function () {
				fn.apply(self, args);
			}, delay);
		};
	};

	/**
  * Debounce all fired events types listed in `types`
  * while executing the provided `fn`.
  *
  * @param {object} self
  * @param {array} types
  * @param {function} fn
  */
	var debounce_events = function debounce_events(self, types, fn) {
		var type;
		var trigger = self.trigger;
		var event_args = {};

		// override trigger method
		self.trigger = function () {
			var type = arguments[0];
			if (types.indexOf(type) !== -1) {
				event_args[type] = arguments;
			} else {
				return trigger.apply(self, arguments);
			}
		};

		// invoke provided function
		fn.apply(self, []);
		self.trigger = trigger;

		// trigger queued events
		for (type in event_args) {
			if (event_args.hasOwnProperty(type)) {
				trigger.apply(self, event_args[type]);
			}
		}
	};

	/**
  * A workaround for http://bugs.jquery.com/ticket/6696
  *
  * @param {object} $parent - Parent element to listen on.
  * @param {string} event - Event name.
  * @param {string} selector - Descendant selector to filter by.
  * @param {function} fn - Event handler.
  */
	var watchChildEvent = function watchChildEvent($parent, event, selector, fn) {
		$parent.on(event, selector, function (e) {
			var child = e.target;
			while (child && child.parentNode !== $parent[0]) {
				child = child.parentNode;
			}
			e.currentTarget = child;
			return fn.apply(this, [e]);
		});
	};

	/**
  * Determines the current selection within a text input control.
  * Returns an object containing:
  *   - start
  *   - length
  *
  * @param {object} input
  * @returns {object}
  */
	var getSelection = function getSelection(input) {
		var result = {};
		if ('selectionStart' in input) {
			result.start = input.selectionStart;
			result.length = input.selectionEnd - result.start;
		} else if (document.selection) {
			input.focus();
			var sel = document.selection.createRange();
			var selLen = document.selection.createRange().text.length;
			sel.moveStart('character', -input.value.length);
			result.start = sel.text.length - selLen;
			result.length = selLen;
		}
		return result;
	};

	/**
  * Copies CSS properties from one element to another.
  *
  * @param {object} $from
  * @param {object} $to
  * @param {array} properties
  */
	var transferStyles = function transferStyles($from, $to, properties) {
		var i,
		    n,
		    styles = {};
		if (properties) {
			for (i = 0, n = properties.length; i < n; i++) {
				styles[properties[i]] = $from.css(properties[i]);
			}
		} else {
			styles = $from.css();
		}
		$to.css(styles);
	};

	/**
  * Measures the width of a string within a
  * parent element (in pixels).
  *
  * @param {string} str
  * @param {object} $parent
  * @returns {int}
  */
	var measureString = function measureString(str, $parent) {
		if (!str) {
			return 0;
		}

		var $test = $('<test>').css({
			position: 'absolute',
			top: -99999,
			left: -99999,
			width: 'auto',
			padding: 0,
			whiteSpace: 'pre'
		}).text(str).appendTo('body');

		transferStyles($parent, $test, ['letterSpacing', 'fontSize', 'fontFamily', 'fontWeight', 'textTransform']);

		var width = $test.width();
		$test.remove();

		return width;
	};

	/**
  * Sets up an input to grow horizontally as the user
  * types. If the value is changed manually, you can
  * trigger the "update" handler to resize:
  *
  * $input.trigger('update');
  *
  * @param {object} $input
  */
	var autoGrow = function autoGrow($input) {
		var currentWidth = null;

		var update = function update(e, options) {
			var value, keyCode, printable, placeholder, width;
			var shift, character, selection;
			e = e || window.event || {};
			options = options || {};

			if (e.metaKey || e.altKey) return;
			if (!options.force && $input.data('grow') === false) return;

			value = $input.val();
			if (e.type && e.type.toLowerCase() === 'keydown') {
				keyCode = e.keyCode;
				printable = keyCode >= 97 && keyCode <= 122 || // a-z
				keyCode >= 65 && keyCode <= 90 || // A-Z
				keyCode >= 48 && keyCode <= 57 || // 0-9
				keyCode === 32 // space
				;

				if (keyCode === KEY_DELETE || keyCode === KEY_BACKSPACE) {
					selection = getSelection($input[0]);
					if (selection.length) {
						value = value.substring(0, selection.start) + value.substring(selection.start + selection.length);
					} else if (keyCode === KEY_BACKSPACE && selection.start) {
						value = value.substring(0, selection.start - 1) + value.substring(selection.start + 1);
					} else if (keyCode === KEY_DELETE && typeof selection.start !== 'undefined') {
						value = value.substring(0, selection.start) + value.substring(selection.start + 1);
					}
				} else if (printable) {
					shift = e.shiftKey;
					character = String.fromCharCode(e.keyCode);
					if (shift) character = character.toUpperCase();else character = character.toLowerCase();
					value += character;
				}
			}

			placeholder = $input.attr('placeholder');
			if (!value && placeholder) {
				value = placeholder;
			}

			width = measureString(value, $input) + 4;
			if (width !== currentWidth) {
				currentWidth = width;
				$input.width(width);
				$input.triggerHandler('resize');
			}
		};

		$input.on('keydown keyup update blur', update);
		update();
	};

	var Selectize = function Selectize($input, settings) {
		var key,
		    i,
		    n,
		    dir,
		    input,
		    self = this;
		input = $input[0];
		input.selectize = self;

		// detect rtl environment
		var computedStyle = window.getComputedStyle && window.getComputedStyle(input, null);
		dir = computedStyle ? computedStyle.getPropertyValue('direction') : input.currentStyle && input.currentStyle.direction;
		dir = dir || $input.parents('[dir]:first').attr('dir') || '';

		// setup default state
		$.extend(self, {
			order: 0,
			settings: settings,
			$input: $input,
			tabIndex: $input.attr('tabindex') || '',
			tagType: input.tagName.toLowerCase() === 'select' ? TAG_SELECT : TAG_INPUT,
			rtl: /rtl/i.test(dir),

			eventNS: '.selectize' + ++Selectize.count,
			highlightedValue: null,
			isOpen: false,
			isDisabled: false,
			isRequired: $input.is('[required]'),
			isInvalid: false,
			isLocked: false,
			isFocused: false,
			isInputHidden: false,
			isSetup: false,
			isShiftDown: false,
			isCmdDown: false,
			isCtrlDown: false,
			ignoreFocus: false,
			ignoreBlur: false,
			ignoreHover: false,
			hasOptions: false,
			currentResults: null,
			lastValue: '',
			caretPos: 0,
			loading: 0,
			loadedSearches: {},

			$activeOption: null,
			$activeItems: [],

			optgroups: {},
			options: {},
			userOptions: {},
			items: [],
			renderCache: {},
			onSearchChange: settings.loadThrottle === null ? self.onSearchChange : debounce(self.onSearchChange, settings.loadThrottle)
		});

		// search system
		self.sifter = new Sifter(this.options, { diacritics: settings.diacritics });

		// build options table
		if (self.settings.options) {
			for (i = 0, n = self.settings.options.length; i < n; i++) {
				self.registerOption(self.settings.options[i]);
			}
			delete self.settings.options;
		}

		// build optgroup table
		if (self.settings.optgroups) {
			for (i = 0, n = self.settings.optgroups.length; i < n; i++) {
				self.registerOptionGroup(self.settings.optgroups[i]);
			}
			delete self.settings.optgroups;
		}

		// option-dependent defaults
		self.settings.mode = self.settings.mode || (self.settings.maxItems === 1 ? 'single' : 'multi');
		if (typeof self.settings.hideSelected !== 'boolean') {
			self.settings.hideSelected = self.settings.mode === 'multi';
		}

		self.initializePlugins(self.settings.plugins);
		self.setupCallbacks();
		self.setupTemplates();
		self.setup();
	};

	// mixins
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	MicroEvent.mixin(Selectize);
	MicroPlugin.mixin(Selectize);

	// methods
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	$.extend(Selectize.prototype, {

		/**
   * Creates all elements and sets up event bindings.
   */
		setup: function setup() {
			var self = this;
			var settings = self.settings;
			var eventNS = self.eventNS;
			var $window = $(window);
			var $document = $(document);
			var $input = self.$input;

			var $wrapper;
			var $control;
			var $control_input;
			var $dropdown;
			var $dropdown_content;
			var $dropdown_parent;
			var inputMode;
			var timeout_blur;
			var timeout_focus;
			var classes;
			var classes_plugins;

			inputMode = self.settings.mode;
			classes = $input.attr('class') || '';

			$wrapper = $('<div>').addClass(settings.wrapperClass).addClass(classes).addClass(inputMode);
			$control = $('<div>').addClass(settings.inputClass).addClass('items').appendTo($wrapper);
			$control_input = $('<input type="text" autocomplete="off" />').appendTo($control).attr('tabindex', $input.is(':disabled') ? '-1' : self.tabIndex);
			$dropdown_parent = $(settings.dropdownParent || $wrapper);
			$dropdown = $('<div>').addClass(settings.dropdownClass).addClass(inputMode).hide().appendTo($dropdown_parent);
			$dropdown_content = $('<div>').addClass(settings.dropdownContentClass).appendTo($dropdown);

			if (self.settings.copyClassesToDropdown) {
				$dropdown.addClass(classes);
			}

			$wrapper.css({
				width: $input[0].style.width
			});

			if (self.plugins.names.length) {
				classes_plugins = 'plugin-' + self.plugins.names.join(' plugin-');
				$wrapper.addClass(classes_plugins);
				$dropdown.addClass(classes_plugins);
			}

			if ((settings.maxItems === null || settings.maxItems > 1) && self.tagType === TAG_SELECT) {
				$input.attr('multiple', 'multiple');
			}

			if (self.settings.placeholder) {
				$control_input.attr('placeholder', settings.placeholder);
			}

			// if splitOn was not passed in, construct it from the delimiter to allow pasting universally
			if (!self.settings.splitOn && self.settings.delimiter) {
				var delimiterEscaped = self.settings.delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
				self.settings.splitOn = new RegExp('\\s*' + delimiterEscaped + '+\\s*');
			}

			if ($input.attr('autocorrect')) {
				$control_input.attr('autocorrect', $input.attr('autocorrect'));
			}

			if ($input.attr('autocapitalize')) {
				$control_input.attr('autocapitalize', $input.attr('autocapitalize'));
			}

			self.$wrapper = $wrapper;
			self.$control = $control;
			self.$control_input = $control_input;
			self.$dropdown = $dropdown;
			self.$dropdown_content = $dropdown_content;

			$dropdown.on('mouseenter', '[data-selectable]', function () {
				return self.onOptionHover.apply(self, arguments);
			});
			$dropdown.on('mousedown click', '[data-selectable]', function () {
				return self.onOptionSelect.apply(self, arguments);
			});
			watchChildEvent($control, 'mousedown', '*:not(input)', function () {
				return self.onItemSelect.apply(self, arguments);
			});
			autoGrow($control_input);

			$control.on({
				mousedown: function mousedown() {
					return self.onMouseDown.apply(self, arguments);
				},
				click: function click() {
					return self.onClick.apply(self, arguments);
				}
			});

			$control_input.on({
				mousedown: function mousedown(e) {
					e.stopPropagation();
				},
				keydown: function keydown() {
					return self.onKeyDown.apply(self, arguments);
				},
				keyup: function keyup() {
					return self.onKeyUp.apply(self, arguments);
				},
				keypress: function keypress() {
					return self.onKeyPress.apply(self, arguments);
				},
				resize: function resize() {
					self.positionDropdown.apply(self, []);
				},
				blur: function blur() {
					return self.onBlur.apply(self, arguments);
				},
				focus: function focus() {
					self.ignoreBlur = false;return self.onFocus.apply(self, arguments);
				},
				paste: function paste() {
					return self.onPaste.apply(self, arguments);
				}
			});

			$document.on('keydown' + eventNS, function (e) {
				self.isCmdDown = e[IS_MAC ? 'metaKey' : 'ctrlKey'];
				self.isCtrlDown = e[IS_MAC ? 'altKey' : 'ctrlKey'];
				self.isShiftDown = e.shiftKey;
			});

			$document.on('keyup' + eventNS, function (e) {
				if (e.keyCode === KEY_CTRL) self.isCtrlDown = false;
				if (e.keyCode === KEY_SHIFT) self.isShiftDown = false;
				if (e.keyCode === KEY_CMD) self.isCmdDown = false;
			});

			$document.on('mousedown' + eventNS, function (e) {
				if (self.isFocused) {
					// prevent events on the dropdown scrollbar from causing the control to blur
					if (e.target === self.$dropdown[0] || e.target.parentNode === self.$dropdown[0]) {
						return false;
					}
					// blur on click outside
					if (!self.$control.has(e.target).length && e.target !== self.$control[0]) {
						self.blur(e.target);
					}
				}
			});

			$window.on(['scroll' + eventNS, 'resize' + eventNS].join(' '), function () {
				if (self.isOpen) {
					self.positionDropdown.apply(self, arguments);
				}
			});
			$window.on('mousemove' + eventNS, function () {
				self.ignoreHover = false;
			});

			// store original children and tab index so that they can be
			// restored when the destroy() method is called.
			this.revertSettings = {
				$children: $input.children().detach(),
				tabindex: $input.attr('tabindex')
			};

			$input.attr('tabindex', -1).hide().after(self.$wrapper);

			if ($.isArray(settings.items)) {
				self.setValue(settings.items);
				delete settings.items;
			}

			// feature detect for the validation API
			if (SUPPORTS_VALIDITY_API) {
				$input.on('invalid' + eventNS, function (e) {
					e.preventDefault();
					self.isInvalid = true;
					self.refreshState();
				});
			}

			self.updateOriginalInput();
			self.refreshItems();
			self.refreshState();
			self.updatePlaceholder();
			self.isSetup = true;

			if ($input.is(':disabled')) {
				self.disable();
			}

			self.on('change', this.onChange);

			$input.data('selectize', self);
			$input.addClass('selectized');
			self.trigger('initialize');

			// preload options
			if (settings.preload === true) {
				self.onSearchChange('');
			}
		},

		/**
   * Sets up default rendering functions.
   */
		setupTemplates: function setupTemplates() {
			var self = this;
			var field_label = self.settings.labelField;
			var field_optgroup = self.settings.optgroupLabelField;

			var templates = {
				'optgroup': function optgroup(data) {
					return '<div class="optgroup">' + data.html + '</div>';
				},
				'optgroup_header': function optgroup_header(data, escape) {
					return '<div class="optgroup-header">' + escape(data[field_optgroup]) + '</div>';
				},
				'option': function option(data, escape) {
					return '<div class="option">' + escape(data[field_label]) + '</div>';
				},
				'item': function item(data, escape) {
					return '<div class="item">' + escape(data[field_label]) + '</div>';
				},
				'option_create': function option_create(data, escape) {
					return '<div class="create">Add <strong>' + escape(data.input) + '</strong>&hellip;</div>';
				}
			};

			self.settings.render = $.extend({}, templates, self.settings.render);
		},

		/**
   * Maps fired events to callbacks provided
   * in the settings used when creating the control.
   */
		setupCallbacks: function setupCallbacks() {
			var key,
			    fn,
			    callbacks = {
				'initialize': 'onInitialize',
				'change': 'onChange',
				'item_add': 'onItemAdd',
				'item_remove': 'onItemRemove',
				'clear': 'onClear',
				'option_add': 'onOptionAdd',
				'option_remove': 'onOptionRemove',
				'option_clear': 'onOptionClear',
				'optgroup_add': 'onOptionGroupAdd',
				'optgroup_remove': 'onOptionGroupRemove',
				'optgroup_clear': 'onOptionGroupClear',
				'dropdown_open': 'onDropdownOpen',
				'dropdown_close': 'onDropdownClose',
				'type': 'onType',
				'load': 'onLoad',
				'focus': 'onFocus',
				'blur': 'onBlur'
			};

			for (key in callbacks) {
				if (callbacks.hasOwnProperty(key)) {
					fn = this.settings[callbacks[key]];
					if (fn) this.on(key, fn);
				}
			}
		},

		/**
   * Triggered when the main control element
   * has a click event.
   *
   * @param {object} e
   * @return {boolean}
   */
		onClick: function onClick(e) {
			var self = this;

			// necessary for mobile webkit devices (manual focus triggering
			// is ignored unless invoked within a click event)
			if (!self.isFocused) {
				self.focus();
				e.preventDefault();
			}
		},

		/**
   * Triggered when the main control element
   * has a mouse down event.
   *
   * @param {object} e
   * @return {boolean}
   */
		onMouseDown: function onMouseDown(e) {
			var self = this;
			var defaultPrevented = e.isDefaultPrevented();
			var $target = $(e.target);

			if (self.isFocused) {
				// retain focus by preventing native handling. if the
				// event target is the input it should not be modified.
				// otherwise, text selection within the input won't work.
				if (e.target !== self.$control_input[0]) {
					if (self.settings.mode === 'single') {
						// toggle dropdown
						self.isOpen ? self.close() : self.open();
					} else if (!defaultPrevented) {
						self.setActiveItem(null);
					}
					return false;
				}
			} else {
				// give control focus
				if (!defaultPrevented) {
					window.setTimeout(function () {
						self.focus();
					}, 0);
				}
			}
		},

		/**
   * Triggered when the value of the control has been changed.
   * This should propagate the event to the original DOM
   * input / select element.
   */
		onChange: function onChange() {
			this.$input.trigger('change');
		},

		/**
   * Triggered on <input> paste.
   *
   * @param {object} e
   * @returns {boolean}
   */
		onPaste: function onPaste(e) {
			var self = this;
			if (self.isFull() || self.isInputHidden || self.isLocked) {
				e.preventDefault();
			} else {
				// If a regex or string is included, this will split the pasted
				// input and create Items for each separate value
				if (self.settings.splitOn) {
					setTimeout(function () {
						var splitInput = $.trim(self.$control_input.val() || '').split(self.settings.splitOn);
						for (var i = 0, n = splitInput.length; i < n; i++) {
							self.createItem(splitInput[i]);
						}
					}, 0);
				}
			}
		},

		/**
   * Triggered on <input> keypress.
   *
   * @param {object} e
   * @returns {boolean}
   */
		onKeyPress: function onKeyPress(e) {
			if (this.isLocked) return e && e.preventDefault();
			var character = String.fromCharCode(e.keyCode || e.which);
			if (this.settings.create && this.settings.mode === 'multi' && character === this.settings.delimiter) {
				this.createItem();
				e.preventDefault();
				return false;
			}
		},

		/**
   * Triggered on <input> keydown.
   *
   * @param {object} e
   * @returns {boolean}
   */
		onKeyDown: function onKeyDown(e) {
			var isInput = e.target === this.$control_input[0];
			var self = this;

			if (self.isLocked) {
				if (e.keyCode !== KEY_TAB) {
					e.preventDefault();
				}
				return;
			}

			switch (e.keyCode) {
				case KEY_A:
					if (self.isCmdDown) {
						self.selectAll();
						return;
					}
					break;
				case KEY_ESC:
					if (self.isOpen) {
						e.preventDefault();
						e.stopPropagation();
						self.close();
					}
					return;
				case KEY_N:
					if (!e.ctrlKey || e.altKey) break;
				case KEY_DOWN:
					if (!self.isOpen && self.hasOptions) {
						self.open();
					} else if (self.$activeOption) {
						self.ignoreHover = true;
						var $next = self.getAdjacentOption(self.$activeOption, 1);
						if ($next.length) self.setActiveOption($next, true, true);
					}
					e.preventDefault();
					return;
				case KEY_P:
					if (!e.ctrlKey || e.altKey) break;
				case KEY_UP:
					if (self.$activeOption) {
						self.ignoreHover = true;
						var $prev = self.getAdjacentOption(self.$activeOption, -1);
						if ($prev.length) self.setActiveOption($prev, true, true);
					}
					e.preventDefault();
					return;
				case KEY_RETURN:
					if (self.isOpen && self.$activeOption) {
						self.onOptionSelect({ currentTarget: self.$activeOption });
						e.preventDefault();
					}
					return;
				case KEY_LEFT:
					self.advanceSelection(-1, e);
					return;
				case KEY_RIGHT:
					self.advanceSelection(1, e);
					return;
				case KEY_TAB:
					if (self.settings.selectOnTab && self.isOpen && self.$activeOption) {
						self.onOptionSelect({ currentTarget: self.$activeOption });

						// Default behaviour is to jump to the next field, we only want this
						// if the current field doesn't accept any more entries
						if (!self.isFull()) {
							e.preventDefault();
						}
					}
					if (self.settings.create && self.createItem()) {
						e.preventDefault();
					}
					return;
				case KEY_BACKSPACE:
				case KEY_DELETE:
					self.deleteSelection(e);
					return;
			}

			if ((self.isFull() || self.isInputHidden) && !(IS_MAC ? e.metaKey : e.ctrlKey)) {
				e.preventDefault();
				return;
			}
		},

		/**
   * Triggered on <input> keyup.
   *
   * @param {object} e
   * @returns {boolean}
   */
		onKeyUp: function onKeyUp(e) {
			var self = this;

			if (self.isLocked) return e && e.preventDefault();
			var value = self.$control_input.val() || '';
			if (self.lastValue !== value) {
				self.lastValue = value;
				self.onSearchChange(value);
				self.refreshOptions();
				self.trigger('type', value);
			}
		},

		/**
   * Invokes the user-provide option provider / loader.
   *
   * Note: this function is debounced in the Selectize
   * constructor (by `settings.loadDelay` milliseconds)
   *
   * @param {string} value
   */
		onSearchChange: function onSearchChange(value) {
			var self = this;
			var fn = self.settings.load;
			if (!fn) return;
			if (self.loadedSearches.hasOwnProperty(value)) return;
			self.loadedSearches[value] = true;
			self.load(function (callback) {
				fn.apply(self, [value, callback]);
			});
		},

		/**
   * Triggered on <input> focus.
   *
   * @param {object} e (optional)
   * @returns {boolean}
   */
		onFocus: function onFocus(e) {
			var self = this;
			var wasFocused = self.isFocused;

			if (self.isDisabled) {
				self.blur();
				e && e.preventDefault();
				return false;
			}

			if (self.ignoreFocus) return;
			self.isFocused = true;
			if (self.settings.preload === 'focus') self.onSearchChange('');

			if (!wasFocused) self.trigger('focus');

			if (!self.$activeItems.length) {
				self.showInput();
				self.setActiveItem(null);
				self.refreshOptions(!!self.settings.openOnFocus);
			}

			self.refreshState();
		},

		/**
   * Triggered on <input> blur.
   *
   * @param {object} e
   * @param {Element} dest
   */
		onBlur: function onBlur(e, dest) {
			var self = this;
			if (!self.isFocused) return;
			self.isFocused = false;

			if (self.ignoreFocus) {
				return;
			} else if (!self.ignoreBlur && document.activeElement === self.$dropdown_content[0]) {
				// necessary to prevent IE closing the dropdown when the scrollbar is clicked
				self.ignoreBlur = true;
				self.onFocus(e);
				return;
			}

			var deactivate = function deactivate() {
				self.close();
				self.setTextboxValue('');
				self.setActiveItem(null);
				self.setActiveOption(null);
				self.setCaret(self.items.length);
				self.refreshState();

				// IE11 bug: element still marked as active
				(dest || document.body).focus();

				self.ignoreFocus = false;
				self.trigger('blur');
			};

			self.ignoreFocus = true;
			if (self.settings.create && self.settings.createOnBlur) {
				self.createItem(null, false, deactivate);
			} else {
				deactivate();
			}
		},

		/**
   * Triggered when the user rolls over
   * an option in the autocomplete dropdown menu.
   *
   * @param {object} e
   * @returns {boolean}
   */
		onOptionHover: function onOptionHover(e) {
			if (this.ignoreHover) return;
			this.setActiveOption(e.currentTarget, false);
		},

		/**
   * Triggered when the user clicks on an option
   * in the autocomplete dropdown menu.
   *
   * @param {object} e
   * @returns {boolean}
   */
		onOptionSelect: function onOptionSelect(e) {
			var value,
			    $target,
			    $option,
			    self = this;

			if (e.preventDefault) {
				e.preventDefault();
				e.stopPropagation();
			}

			$target = $(e.currentTarget);
			if ($target.hasClass('create')) {
				self.createItem(null, function () {
					if (self.settings.closeAfterSelect) {
						self.close();
					}
				});
			} else {
				value = $target.attr('data-value');
				if (typeof value !== 'undefined') {
					self.lastQuery = null;
					self.setTextboxValue('');
					self.addItem(value);
					if (self.settings.closeAfterSelect) {
						self.close();
					} else if (!self.settings.hideSelected && e.type && /mouse/.test(e.type)) {
						self.setActiveOption(self.getOption(value));
					}
				}
			}
		},

		/**
   * Triggered when the user clicks on an item
   * that has been selected.
   *
   * @param {object} e
   * @returns {boolean}
   */
		onItemSelect: function onItemSelect(e) {
			var self = this;

			if (self.isLocked) return;
			if (self.settings.mode === 'multi') {
				e.preventDefault();
				self.setActiveItem(e.currentTarget, e);
			}
		},

		/**
   * Invokes the provided method that provides
   * results to a callback---which are then added
   * as options to the control.
   *
   * @param {function} fn
   */
		load: function load(fn) {
			var self = this;
			var $wrapper = self.$wrapper.addClass(self.settings.loadingClass);

			self.loading++;
			fn.apply(self, [function (results) {
				self.loading = Math.max(self.loading - 1, 0);
				if (results && results.length) {
					self.addOption(results);
					self.refreshOptions(self.isFocused && !self.isInputHidden);
				}
				if (!self.loading) {
					$wrapper.removeClass(self.settings.loadingClass);
				}
				self.trigger('load', results);
			}]);
		},

		/**
   * Sets the input field of the control to the specified value.
   *
   * @param {string} value
   */
		setTextboxValue: function setTextboxValue(value) {
			var $input = this.$control_input;
			var changed = $input.val() !== value;
			if (changed) {
				$input.val(value).triggerHandler('update');
				this.lastValue = value;
			}
		},

		/**
   * Returns the value of the control. If multiple items
   * can be selected (e.g. <select multiple>), this returns
   * an array. If only one item can be selected, this
   * returns a string.
   *
   * @returns {mixed}
   */
		getValue: function getValue() {
			if (this.tagType === TAG_SELECT && this.$input.attr('multiple')) {
				return this.items;
			} else {
				return this.items.join(this.settings.delimiter);
			}
		},

		/**
   * Resets the selected items to the given value.
   *
   * @param {mixed} value
   */
		setValue: function setValue(value, silent) {
			var events = silent ? [] : ['change'];

			debounce_events(this, events, function () {
				this.clear(silent);
				this.addItems(value, silent);
			});
		},

		/**
   * Sets the selected item.
   *
   * @param {object} $item
   * @param {object} e (optional)
   */
		setActiveItem: function setActiveItem($item, e) {
			var self = this;
			var eventName;
			var i, idx, begin, end, item, swap;
			var $last;

			if (self.settings.mode === 'single') return;
			$item = $($item);

			// clear the active selection
			if (!$item.length) {
				$(self.$activeItems).removeClass('active');
				self.$activeItems = [];
				if (self.isFocused) {
					self.showInput();
				}
				return;
			}

			// modify selection
			eventName = e && e.type.toLowerCase();

			if (eventName === 'mousedown' && self.isShiftDown && self.$activeItems.length) {
				$last = self.$control.children('.active:last');
				begin = Array.prototype.indexOf.apply(self.$control[0].childNodes, [$last[0]]);
				end = Array.prototype.indexOf.apply(self.$control[0].childNodes, [$item[0]]);
				if (begin > end) {
					swap = begin;
					begin = end;
					end = swap;
				}
				for (i = begin; i <= end; i++) {
					item = self.$control[0].childNodes[i];
					if (self.$activeItems.indexOf(item) === -1) {
						$(item).addClass('active');
						self.$activeItems.push(item);
					}
				}
				e.preventDefault();
			} else if (eventName === 'mousedown' && self.isCtrlDown || eventName === 'keydown' && this.isShiftDown) {
				if ($item.hasClass('active')) {
					idx = self.$activeItems.indexOf($item[0]);
					self.$activeItems.splice(idx, 1);
					$item.removeClass('active');
				} else {
					self.$activeItems.push($item.addClass('active')[0]);
				}
			} else {
				$(self.$activeItems).removeClass('active');
				self.$activeItems = [$item.addClass('active')[0]];
			}

			// ensure control has focus
			self.hideInput();
			if (!this.isFocused) {
				self.focus();
			}
		},

		/**
   * Sets the selected item in the dropdown menu
   * of available options.
   *
   * @param {object} $object
   * @param {boolean} scroll
   * @param {boolean} animate
   */
		setActiveOption: function setActiveOption($option, scroll, animate) {
			var height_menu, height_item, y;
			var scroll_top, scroll_bottom;
			var self = this;

			if (self.$activeOption) self.$activeOption.removeClass('active');
			self.$activeOption = null;

			$option = $($option);
			if (!$option.length) return;

			self.$activeOption = $option.addClass('active');

			if (scroll || !isset(scroll)) {

				height_menu = self.$dropdown_content.height();
				height_item = self.$activeOption.outerHeight(true);
				scroll = self.$dropdown_content.scrollTop() || 0;
				y = self.$activeOption.offset().top - self.$dropdown_content.offset().top + scroll;
				scroll_top = y;
				scroll_bottom = y - height_menu + height_item;

				if (y + height_item > height_menu + scroll) {
					self.$dropdown_content.stop().animate({ scrollTop: scroll_bottom }, animate ? self.settings.scrollDuration : 0);
				} else if (y < scroll) {
					self.$dropdown_content.stop().animate({ scrollTop: scroll_top }, animate ? self.settings.scrollDuration : 0);
				}
			}
		},

		/**
   * Selects all items (CTRL + A).
   */
		selectAll: function selectAll() {
			var self = this;
			if (self.settings.mode === 'single') return;

			self.$activeItems = Array.prototype.slice.apply(self.$control.children(':not(input)').addClass('active'));
			if (self.$activeItems.length) {
				self.hideInput();
				self.close();
			}
			self.focus();
		},

		/**
   * Hides the input element out of view, while
   * retaining its focus.
   */
		hideInput: function hideInput() {
			var self = this;

			self.setTextboxValue('');
			self.$control_input.css({ opacity: 0, position: 'absolute', left: self.rtl ? 10000 : -10000 });
			self.isInputHidden = true;
		},

		/**
   * Restores input visibility.
   */
		showInput: function showInput() {
			this.$control_input.css({ opacity: 1, position: 'relative', left: 0 });
			this.isInputHidden = false;
		},

		/**
   * Gives the control focus.
   */
		focus: function focus() {
			var self = this;
			if (self.isDisabled) return;

			self.ignoreFocus = true;
			self.$control_input[0].focus();
			window.setTimeout(function () {
				self.ignoreFocus = false;
				self.onFocus();
			}, 0);
		},

		/**
   * Forces the control out of focus.
   *
   * @param {Element} dest
   */
		blur: function blur(dest) {
			this.$control_input[0].blur();
			this.onBlur(null, dest);
		},

		/**
   * Returns a function that scores an object
   * to show how good of a match it is to the
   * provided query.
   *
   * @param {string} query
   * @param {object} options
   * @return {function}
   */
		getScoreFunction: function getScoreFunction(query) {
			return this.sifter.getScoreFunction(query, this.getSearchOptions());
		},

		/**
   * Returns search options for sifter (the system
   * for scoring and sorting results).
   *
   * @see https://github.com/brianreavis/sifter.js
   * @return {object}
   */
		getSearchOptions: function getSearchOptions() {
			var settings = this.settings;
			var sort = settings.sortField;
			if (typeof sort === 'string') {
				sort = [{ field: sort }];
			}

			return {
				fields: settings.searchField,
				conjunction: settings.searchConjunction,
				sort: sort
			};
		},

		/**
   * Searches through available options and returns
   * a sorted array of matches.
   *
   * Returns an object containing:
   *
   *   - query {string}
   *   - tokens {array}
   *   - total {int}
   *   - items {array}
   *
   * @param {string} query
   * @returns {object}
   */
		search: function search(query) {
			var i, value, score, result, calculateScore;
			var self = this;
			var settings = self.settings;
			var options = this.getSearchOptions();

			// validate user-provided result scoring function
			if (settings.score) {
				calculateScore = self.settings.score.apply(this, [query]);
				if (typeof calculateScore !== 'function') {
					throw new Error('Selectize "score" setting must be a function that returns a function');
				}
			}

			// perform search
			if (query !== self.lastQuery) {
				self.lastQuery = query;
				result = self.sifter.search(query, $.extend(options, { score: calculateScore }));
				self.currentResults = result;
			} else {
				result = $.extend(true, {}, self.currentResults);
			}

			// filter out selected items
			if (settings.hideSelected) {
				for (i = result.items.length - 1; i >= 0; i--) {
					if (self.items.indexOf(hash_key(result.items[i].id)) !== -1) {
						result.items.splice(i, 1);
					}
				}
			}

			return result;
		},

		/**
   * Refreshes the list of available options shown
   * in the autocomplete dropdown menu.
   *
   * @param {boolean} triggerDropdown
   */
		refreshOptions: function refreshOptions(triggerDropdown) {
			var i, j, k, n, groups, groups_order, option, option_html, optgroup, optgroups, html, html_children, has_create_option;
			var $active, $active_before, $create;

			if (typeof triggerDropdown === 'undefined') {
				triggerDropdown = true;
			}

			var self = this;
			var query = $.trim(self.$control_input.val());
			var results = self.search(query);
			var $dropdown_content = self.$dropdown_content;
			var active_before = self.$activeOption && hash_key(self.$activeOption.attr('data-value'));

			// build markup
			n = results.items.length;
			if (typeof self.settings.maxOptions === 'number') {
				n = Math.min(n, self.settings.maxOptions);
			}

			// render and group available options individually
			groups = {};
			groups_order = [];

			for (i = 0; i < n; i++) {
				option = self.options[results.items[i].id];
				option_html = self.render('option', option);
				optgroup = option[self.settings.optgroupField] || '';
				optgroups = $.isArray(optgroup) ? optgroup : [optgroup];

				for (j = 0, k = optgroups && optgroups.length; j < k; j++) {
					optgroup = optgroups[j];
					if (!self.optgroups.hasOwnProperty(optgroup)) {
						optgroup = '';
					}
					if (!groups.hasOwnProperty(optgroup)) {
						groups[optgroup] = [];
						groups_order.push(optgroup);
					}
					groups[optgroup].push(option_html);
				}
			}

			// sort optgroups
			if (this.settings.lockOptgroupOrder) {
				groups_order.sort(function (a, b) {
					var a_order = self.optgroups[a].$order || 0;
					var b_order = self.optgroups[b].$order || 0;
					return a_order - b_order;
				});
			}

			// render optgroup headers & join groups
			html = [];
			for (i = 0, n = groups_order.length; i < n; i++) {
				optgroup = groups_order[i];
				if (self.optgroups.hasOwnProperty(optgroup) && groups[optgroup].length) {
					// render the optgroup header and options within it,
					// then pass it to the wrapper template
					html_children = self.render('optgroup_header', self.optgroups[optgroup]) || '';
					html_children += groups[optgroup].join('');
					html.push(self.render('optgroup', $.extend({}, self.optgroups[optgroup], {
						html: html_children
					})));
				} else {
					html.push(groups[optgroup].join(''));
				}
			}

			$dropdown_content.html(html.join(''));

			// highlight matching terms inline
			if (self.settings.highlight && results.query.length && results.tokens.length) {
				for (i = 0, n = results.tokens.length; i < n; i++) {
					highlight($dropdown_content, results.tokens[i].regex);
				}
			}

			// add "selected" class to selected options
			if (!self.settings.hideSelected) {
				for (i = 0, n = self.items.length; i < n; i++) {
					self.getOption(self.items[i]).addClass('selected');
				}
			}

			// add create option
			has_create_option = self.canCreate(query);
			if (has_create_option) {
				$dropdown_content.prepend(self.render('option_create', { input: query }));
				$create = $($dropdown_content[0].childNodes[0]);
			}

			// activate
			self.hasOptions = results.items.length > 0 || has_create_option;
			if (self.hasOptions) {
				if (results.items.length > 0) {
					$active_before = active_before && self.getOption(active_before);
					if ($active_before && $active_before.length) {
						$active = $active_before;
					} else if (self.settings.mode === 'single' && self.items.length) {
						$active = self.getOption(self.items[0]);
					}
					if (!$active || !$active.length) {
						if ($create && !self.settings.addPrecedence) {
							$active = self.getAdjacentOption($create, 1);
						} else {
							$active = $dropdown_content.find('[data-selectable]:first');
						}
					}
				} else {
					$active = $create;
				}
				self.setActiveOption($active);
				if (triggerDropdown && !self.isOpen) {
					self.open();
				}
			} else {
				self.setActiveOption(null);
				if (triggerDropdown && self.isOpen) {
					self.close();
				}
			}
		},

		/**
   * Adds an available option. If it already exists,
   * nothing will happen. Note: this does not refresh
   * the options list dropdown (use `refreshOptions`
   * for that).
   *
   * Usage:
   *
   *   this.addOption(data)
   *
   * @param {object|array} data
   */
		addOption: function addOption(data) {
			var i,
			    n,
			    value,
			    self = this;

			if ($.isArray(data)) {
				for (i = 0, n = data.length; i < n; i++) {
					self.addOption(data[i]);
				}
				return;
			}

			if (value = self.registerOption(data)) {
				self.userOptions[value] = true;
				self.lastQuery = null;
				self.trigger('option_add', value, data);
			}
		},

		/**
   * Registers an option to the pool of options.
   *
   * @param {object} data
   * @return {boolean|string}
   */
		registerOption: function registerOption(data) {
			var key = hash_key(data[this.settings.valueField]);
			if (!key || this.options.hasOwnProperty(key)) return false;
			data.$order = data.$order || ++this.order;
			this.options[key] = data;
			return key;
		},

		/**
   * Registers an option group to the pool of option groups.
   *
   * @param {object} data
   * @return {boolean|string}
   */
		registerOptionGroup: function registerOptionGroup(data) {
			var key = hash_key(data[this.settings.optgroupValueField]);
			if (!key) return false;

			data.$order = data.$order || ++this.order;
			this.optgroups[key] = data;
			return key;
		},

		/**
   * Registers a new optgroup for options
   * to be bucketed into.
   *
   * @param {string} id
   * @param {object} data
   */
		addOptionGroup: function addOptionGroup(id, data) {
			data[this.settings.optgroupValueField] = id;
			if (id = this.registerOptionGroup(data)) {
				this.trigger('optgroup_add', id, data);
			}
		},

		/**
   * Removes an existing option group.
   *
   * @param {string} id
   */
		removeOptionGroup: function removeOptionGroup(id) {
			if (this.optgroups.hasOwnProperty(id)) {
				delete this.optgroups[id];
				this.renderCache = {};
				this.trigger('optgroup_remove', id);
			}
		},

		/**
   * Clears all existing option groups.
   */
		clearOptionGroups: function clearOptionGroups() {
			this.optgroups = {};
			this.renderCache = {};
			this.trigger('optgroup_clear');
		},

		/**
   * Updates an option available for selection. If
   * it is visible in the selected items or options
   * dropdown, it will be re-rendered automatically.
   *
   * @param {string} value
   * @param {object} data
   */
		updateOption: function updateOption(value, data) {
			var self = this;
			var $item, $item_new;
			var value_new, index_item, cache_items, cache_options, order_old;

			value = hash_key(value);
			value_new = hash_key(data[self.settings.valueField]);

			// sanity checks
			if (value === null) return;
			if (!self.options.hasOwnProperty(value)) return;
			if (typeof value_new !== 'string') throw new Error('Value must be set in option data');

			order_old = self.options[value].$order;

			// update references
			if (value_new !== value) {
				delete self.options[value];
				index_item = self.items.indexOf(value);
				if (index_item !== -1) {
					self.items.splice(index_item, 1, value_new);
				}
			}
			data.$order = data.$order || order_old;
			self.options[value_new] = data;

			// invalidate render cache
			cache_items = self.renderCache['item'];
			cache_options = self.renderCache['option'];

			if (cache_items) {
				delete cache_items[value];
				delete cache_items[value_new];
			}
			if (cache_options) {
				delete cache_options[value];
				delete cache_options[value_new];
			}

			// update the item if it's selected
			if (self.items.indexOf(value_new) !== -1) {
				$item = self.getItem(value);
				$item_new = $(self.render('item', data));
				if ($item.hasClass('active')) $item_new.addClass('active');
				$item.replaceWith($item_new);
			}

			// invalidate last query because we might have updated the sortField
			self.lastQuery = null;

			// update dropdown contents
			if (self.isOpen) {
				self.refreshOptions(false);
			}
		},

		/**
   * Removes a single option.
   *
   * @param {string} value
   * @param {boolean} silent
   */
		removeOption: function removeOption(value, silent) {
			var self = this;
			value = hash_key(value);

			var cache_items = self.renderCache['item'];
			var cache_options = self.renderCache['option'];
			if (cache_items) delete cache_items[value];
			if (cache_options) delete cache_options[value];

			delete self.userOptions[value];
			delete self.options[value];
			self.lastQuery = null;
			self.trigger('option_remove', value);
			self.removeItem(value, silent);
		},

		/**
   * Clears all options.
   */
		clearOptions: function clearOptions() {
			var self = this;

			self.loadedSearches = {};
			self.userOptions = {};
			self.renderCache = {};
			self.options = self.sifter.items = {};
			self.lastQuery = null;
			self.trigger('option_clear');
			self.clear();
		},

		/**
   * Returns the jQuery element of the option
   * matching the given value.
   *
   * @param {string} value
   * @returns {object}
   */
		getOption: function getOption(value) {
			return this.getElementWithValue(value, this.$dropdown_content.find('[data-selectable]'));
		},

		/**
   * Returns the jQuery element of the next or
   * previous selectable option.
   *
   * @param {object} $option
   * @param {int} direction  can be 1 for next or -1 for previous
   * @return {object}
   */
		getAdjacentOption: function getAdjacentOption($option, direction) {
			var $options = this.$dropdown.find('[data-selectable]');
			var index = $options.index($option) + direction;

			return index >= 0 && index < $options.length ? $options.eq(index) : $();
		},

		/**
   * Finds the first element with a "data-value" attribute
   * that matches the given value.
   *
   * @param {mixed} value
   * @param {object} $els
   * @return {object}
   */
		getElementWithValue: function getElementWithValue(value, $els) {
			value = hash_key(value);

			if (typeof value !== 'undefined' && value !== null) {
				for (var i = 0, n = $els.length; i < n; i++) {
					if ($els[i].getAttribute('data-value') === value) {
						return $($els[i]);
					}
				}
			}

			return $();
		},

		/**
   * Returns the jQuery element of the item
   * matching the given value.
   *
   * @param {string} value
   * @returns {object}
   */
		getItem: function getItem(value) {
			return this.getElementWithValue(value, this.$control.children());
		},

		/**
   * "Selects" multiple items at once. Adds them to the list
   * at the current caret position.
   *
   * @param {string} value
   * @param {boolean} silent
   */
		addItems: function addItems(values, silent) {
			var items = $.isArray(values) ? values : [values];
			for (var i = 0, n = items.length; i < n; i++) {
				this.isPending = i < n - 1;
				this.addItem(items[i], silent);
			}
		},

		/**
   * "Selects" an item. Adds it to the list
   * at the current caret position.
   *
   * @param {string} value
   * @param {boolean} silent
   */
		addItem: function addItem(value, silent) {
			var events = silent ? [] : ['change'];

			debounce_events(this, events, function () {
				var $item, $option, $options;
				var self = this;
				var inputMode = self.settings.mode;
				var i, active, value_next, wasFull;
				value = hash_key(value);

				if (self.items.indexOf(value) !== -1) {
					if (inputMode === 'single') self.close();
					return;
				}

				if (!self.options.hasOwnProperty(value)) return;
				if (inputMode === 'single') self.clear(silent);
				if (inputMode === 'multi' && self.isFull()) return;

				$item = $(self.render('item', self.options[value]));
				wasFull = self.isFull();
				self.items.splice(self.caretPos, 0, value);
				self.insertAtCaret($item);
				if (!self.isPending || !wasFull && self.isFull()) {
					self.refreshState();
				}

				if (self.isSetup) {
					$options = self.$dropdown_content.find('[data-selectable]');

					// update menu / remove the option (if this is not one item being added as part of series)
					if (!self.isPending) {
						$option = self.getOption(value);
						value_next = self.getAdjacentOption($option, 1).attr('data-value');
						self.refreshOptions(self.isFocused && inputMode !== 'single');
						if (value_next) {
							self.setActiveOption(self.getOption(value_next));
						}
					}

					// hide the menu if the maximum number of items have been selected or no options are left
					if (!$options.length || self.isFull()) {
						self.close();
					} else {
						self.positionDropdown();
					}

					self.updatePlaceholder();
					self.trigger('item_add', value, $item);
					self.updateOriginalInput({ silent: silent });
				}
			});
		},

		/**
   * Removes the selected item matching
   * the provided value.
   *
   * @param {string} value
   */
		removeItem: function removeItem(value, silent) {
			var self = this;
			var $item, i, idx;

			$item = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? value : self.getItem(value);
			value = hash_key($item.attr('data-value'));
			i = self.items.indexOf(value);

			if (i !== -1) {
				$item.remove();
				if ($item.hasClass('active')) {
					idx = self.$activeItems.indexOf($item[0]);
					self.$activeItems.splice(idx, 1);
				}

				self.items.splice(i, 1);
				self.lastQuery = null;
				if (!self.settings.persist && self.userOptions.hasOwnProperty(value)) {
					self.removeOption(value, silent);
				}

				if (i < self.caretPos) {
					self.setCaret(self.caretPos - 1);
				}

				self.refreshState();
				self.updatePlaceholder();
				self.updateOriginalInput({ silent: silent });
				self.positionDropdown();
				self.trigger('item_remove', value, $item);
			}
		},

		/**
   * Invokes the `create` method provided in the
   * selectize options that should provide the data
   * for the new item, given the user input.
   *
   * Once this completes, it will be added
   * to the item list.
   *
   * @param {string} value
   * @param {boolean} [triggerDropdown]
   * @param {function} [callback]
   * @return {boolean}
   */
		createItem: function createItem(input, triggerDropdown) {
			var self = this;
			var caret = self.caretPos;
			input = input || $.trim(self.$control_input.val() || '');

			var callback = arguments[arguments.length - 1];
			if (typeof callback !== 'function') callback = function callback() {};

			if (typeof triggerDropdown !== 'boolean') {
				triggerDropdown = true;
			}

			if (!self.canCreate(input)) {
				callback();
				return false;
			}

			self.lock();

			var setup = typeof self.settings.create === 'function' ? this.settings.create : function (input) {
				var data = {};
				data[self.settings.labelField] = input;
				data[self.settings.valueField] = input;
				return data;
			};

			var create = once(function (data) {
				self.unlock();

				if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') return callback();
				var value = hash_key(data[self.settings.valueField]);
				if (typeof value !== 'string') return callback();

				self.setTextboxValue('');
				self.addOption(data);
				self.setCaret(caret);
				self.addItem(value);
				self.refreshOptions(triggerDropdown && self.settings.mode !== 'single');
				callback(data);
			});

			var output = setup.apply(this, [input, create]);
			if (typeof output !== 'undefined') {
				create(output);
			}

			return true;
		},

		/**
   * Re-renders the selected item lists.
   */
		refreshItems: function refreshItems() {
			this.lastQuery = null;

			if (this.isSetup) {
				this.addItem(this.items);
			}

			this.refreshState();
			this.updateOriginalInput();
		},

		/**
   * Updates all state-dependent attributes
   * and CSS classes.
   */
		refreshState: function refreshState() {
			var invalid,
			    self = this;
			if (self.isRequired) {
				if (self.items.length) self.isInvalid = false;
				self.$control_input.prop('required', invalid);
			}
			self.refreshClasses();
		},

		/**
   * Updates all state-dependent CSS classes.
   */
		refreshClasses: function refreshClasses() {
			var self = this;
			var isFull = self.isFull();
			var isLocked = self.isLocked;

			self.$wrapper.toggleClass('rtl', self.rtl);

			self.$control.toggleClass('focus', self.isFocused).toggleClass('disabled', self.isDisabled).toggleClass('required', self.isRequired).toggleClass('invalid', self.isInvalid).toggleClass('locked', isLocked).toggleClass('full', isFull).toggleClass('not-full', !isFull).toggleClass('input-active', self.isFocused && !self.isInputHidden).toggleClass('dropdown-active', self.isOpen).toggleClass('has-options', !$.isEmptyObject(self.options)).toggleClass('has-items', self.items.length > 0);

			self.$control_input.data('grow', !isFull && !isLocked);
		},

		/**
   * Determines whether or not more items can be added
   * to the control without exceeding the user-defined maximum.
   *
   * @returns {boolean}
   */
		isFull: function isFull() {
			return this.settings.maxItems !== null && this.items.length >= this.settings.maxItems;
		},

		/**
   * Refreshes the original <select> or <input>
   * element to reflect the current state.
   */
		updateOriginalInput: function updateOriginalInput(opts) {
			var i,
			    n,
			    options,
			    label,
			    self = this;
			opts = opts || {};

			if (self.tagType === TAG_SELECT) {
				options = [];
				for (i = 0, n = self.items.length; i < n; i++) {
					label = self.options[self.items[i]][self.settings.labelField] || '';
					options.push('<option value="' + escape_html(self.items[i]) + '" selected="selected">' + escape_html(label) + '</option>');
				}
				if (!options.length && !this.$input.attr('multiple')) {
					options.push('<option value="" selected="selected"></option>');
				}
				self.$input.html(options.join(''));
			} else {
				self.$input.val(self.getValue());
				self.$input.attr('value', self.$input.val());
			}

			if (self.isSetup) {
				if (!opts.silent) {
					self.trigger('change', self.$input.val());
				}
			}
		},

		/**
   * Shows/hide the input placeholder depending
   * on if there items in the list already.
   */
		updatePlaceholder: function updatePlaceholder() {
			if (!this.settings.placeholder) return;
			var $input = this.$control_input;

			if (this.items.length) {
				$input.removeAttr('placeholder');
			} else {
				$input.attr('placeholder', this.settings.placeholder);
			}
			$input.triggerHandler('update', { force: true });
		},

		/**
   * Shows the autocomplete dropdown containing
   * the available options.
   */
		open: function open() {
			var self = this;

			if (self.isLocked || self.isOpen || self.settings.mode === 'multi' && self.isFull()) return;
			self.focus();
			self.isOpen = true;
			self.refreshState();
			self.$dropdown.css({ visibility: 'hidden', display: 'block' });
			self.positionDropdown();
			self.$dropdown.css({ visibility: 'visible' });
			self.trigger('dropdown_open', self.$dropdown);
		},

		/**
   * Closes the autocomplete dropdown menu.
   */
		close: function close() {
			var self = this;
			var trigger = self.isOpen;

			if (self.settings.mode === 'single' && self.items.length) {
				self.hideInput();
			}

			self.isOpen = false;
			self.$dropdown.hide();
			self.setActiveOption(null);
			self.refreshState();

			if (trigger) self.trigger('dropdown_close', self.$dropdown);
		},

		/**
   * Calculates and applies the appropriate
   * position of the dropdown.
   */
		positionDropdown: function positionDropdown() {
			var $control = this.$control;
			var offset = this.settings.dropdownParent === 'body' ? $control.offset() : $control.position();
			offset.top += $control.outerHeight(true);

			this.$dropdown.css({
				width: $control.outerWidth(),
				top: offset.top,
				left: offset.left
			});
		},

		/**
   * Resets / clears all selected items
   * from the control.
   *
   * @param {boolean} silent
   */
		clear: function clear(silent) {
			var self = this;

			if (!self.items.length) return;
			self.$control.children(':not(input)').remove();
			self.items = [];
			self.lastQuery = null;
			self.setCaret(0);
			self.setActiveItem(null);
			self.updatePlaceholder();
			self.updateOriginalInput({ silent: silent });
			self.refreshState();
			self.showInput();
			self.trigger('clear');
		},

		/**
   * A helper method for inserting an element
   * at the current caret position.
   *
   * @param {object} $el
   */
		insertAtCaret: function insertAtCaret($el) {
			var caret = Math.min(this.caretPos, this.items.length);
			if (caret === 0) {
				this.$control.prepend($el);
			} else {
				$(this.$control[0].childNodes[caret]).before($el);
			}
			this.setCaret(caret + 1);
		},

		/**
   * Removes the current selected item(s).
   *
   * @param {object} e (optional)
   * @returns {boolean}
   */
		deleteSelection: function deleteSelection(e) {
			var i, n, direction, selection, values, caret, option_select, $option_select, $tail;
			var self = this;

			direction = e && e.keyCode === KEY_BACKSPACE ? -1 : 1;
			selection = getSelection(self.$control_input[0]);

			if (self.$activeOption && !self.settings.hideSelected) {
				option_select = self.getAdjacentOption(self.$activeOption, -1).attr('data-value');
			}

			// determine items that will be removed
			values = [];

			if (self.$activeItems.length) {
				$tail = self.$control.children('.active:' + (direction > 0 ? 'last' : 'first'));
				caret = self.$control.children(':not(input)').index($tail);
				if (direction > 0) {
					caret++;
				}

				for (i = 0, n = self.$activeItems.length; i < n; i++) {
					values.push($(self.$activeItems[i]).attr('data-value'));
				}
				if (e) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if ((self.isFocused || self.settings.mode === 'single') && self.items.length) {
				if (direction < 0 && selection.start === 0 && selection.length === 0) {
					values.push(self.items[self.caretPos - 1]);
				} else if (direction > 0 && selection.start === self.$control_input.val().length) {
					values.push(self.items[self.caretPos]);
				}
			}

			// allow the callback to abort
			if (!values.length || typeof self.settings.onDelete === 'function' && self.settings.onDelete.apply(self, [values]) === false) {
				return false;
			}

			// perform removal
			if (typeof caret !== 'undefined') {
				self.setCaret(caret);
			}
			while (values.length) {
				self.removeItem(values.pop());
			}

			self.showInput();
			self.positionDropdown();
			self.refreshOptions(true);

			// select previous option
			if (option_select) {
				$option_select = self.getOption(option_select);
				if ($option_select.length) {
					self.setActiveOption($option_select);
				}
			}

			return true;
		},

		/**
   * Selects the previous / next item (depending
   * on the `direction` argument).
   *
   * > 0 - right
   * < 0 - left
   *
   * @param {int} direction
   * @param {object} e (optional)
   */
		advanceSelection: function advanceSelection(direction, e) {
			var tail, selection, idx, valueLength, cursorAtEdge, $tail;
			var self = this;

			if (direction === 0) return;
			if (self.rtl) direction *= -1;

			tail = direction > 0 ? 'last' : 'first';
			selection = getSelection(self.$control_input[0]);

			if (self.isFocused && !self.isInputHidden) {
				valueLength = self.$control_input.val().length;
				cursorAtEdge = direction < 0 ? selection.start === 0 && selection.length === 0 : selection.start === valueLength;

				if (cursorAtEdge && !valueLength) {
					self.advanceCaret(direction, e);
				}
			} else {
				$tail = self.$control.children('.active:' + tail);
				if ($tail.length) {
					idx = self.$control.children(':not(input)').index($tail);
					self.setActiveItem(null);
					self.setCaret(direction > 0 ? idx + 1 : idx);
				}
			}
		},

		/**
   * Moves the caret left / right.
   *
   * @param {int} direction
   * @param {object} e (optional)
   */
		advanceCaret: function advanceCaret(direction, e) {
			var self = this,
			    fn,
			    $adj;

			if (direction === 0) return;

			fn = direction > 0 ? 'next' : 'prev';
			if (self.isShiftDown) {
				$adj = self.$control_input[fn]();
				if ($adj.length) {
					self.hideInput();
					self.setActiveItem($adj);
					e && e.preventDefault();
				}
			} else {
				self.setCaret(self.caretPos + direction);
			}
		},

		/**
   * Moves the caret to the specified index.
   *
   * @param {int} i
   */
		setCaret: function setCaret(i) {
			var self = this;

			if (self.settings.mode === 'single') {
				i = self.items.length;
			} else {
				i = Math.max(0, Math.min(self.items.length, i));
			}

			if (!self.isPending) {
				// the input must be moved by leaving it in place and moving the
				// siblings, due to the fact that focus cannot be restored once lost
				// on mobile webkit devices
				var j, n, fn, $children, $child;
				$children = self.$control.children(':not(input)');
				for (j = 0, n = $children.length; j < n; j++) {
					$child = $($children[j]).detach();
					if (j < i) {
						self.$control_input.before($child);
					} else {
						self.$control.append($child);
					}
				}
			}

			self.caretPos = i;
		},

		/**
   * Disables user input on the control. Used while
   * items are being asynchronously created.
   */
		lock: function lock() {
			this.close();
			this.isLocked = true;
			this.refreshState();
		},

		/**
   * Re-enables user input on the control.
   */
		unlock: function unlock() {
			this.isLocked = false;
			this.refreshState();
		},

		/**
   * Disables user input on the control completely.
   * While disabled, it cannot receive focus.
   */
		disable: function disable() {
			var self = this;
			self.$input.prop('disabled', true);
			self.$control_input.prop('disabled', true).prop('tabindex', -1);
			self.isDisabled = true;
			self.lock();
		},

		/**
   * Enables the control so that it can respond
   * to focus and user input.
   */
		enable: function enable() {
			var self = this;
			self.$input.prop('disabled', false);
			self.$control_input.prop('disabled', false).prop('tabindex', self.tabIndex);
			self.isDisabled = false;
			self.unlock();
		},

		/**
   * Completely destroys the control and
   * unbinds all event listeners so that it can
   * be garbage collected.
   */
		destroy: function destroy() {
			var self = this;
			var eventNS = self.eventNS;
			var revertSettings = self.revertSettings;

			self.trigger('destroy');
			self.off();
			self.$wrapper.remove();
			self.$dropdown.remove();

			self.$input.html('').append(revertSettings.$children).removeAttr('tabindex').removeClass('selectized').attr({ tabindex: revertSettings.tabindex }).show();

			self.$control_input.removeData('grow');
			self.$input.removeData('selectize');

			$(window).off(eventNS);
			$(document).off(eventNS);
			$(document.body).off(eventNS);

			delete self.$input[0].selectize;
		},

		/**
   * A helper method for rendering "item" and
   * "option" templates, given the data.
   *
   * @param {string} templateName
   * @param {object} data
   * @returns {string}
   */
		render: function render(templateName, data) {
			var value, id, label;
			var html = '';
			var cache = false;
			var self = this;
			var regex_tag = /^[\t \r\n]*<([a-z][a-z0-9\-_]*(?:\:[a-z][a-z0-9\-_]*)?)/i;

			if (templateName === 'option' || templateName === 'item') {
				value = hash_key(data[self.settings.valueField]);
				cache = !!value;
			}

			// pull markup from cache if it exists
			if (cache) {
				if (!isset(self.renderCache[templateName])) {
					self.renderCache[templateName] = {};
				}
				if (self.renderCache[templateName].hasOwnProperty(value)) {
					return self.renderCache[templateName][value];
				}
			}

			// render markup
			html = self.settings.render[templateName].apply(this, [data, escape_html]);

			// add mandatory attributes
			if (templateName === 'option' || templateName === 'option_create') {
				html = html.replace(regex_tag, '<$1 data-selectable');
			}
			if (templateName === 'optgroup') {
				id = data[self.settings.optgroupValueField] || '';
				html = html.replace(regex_tag, '<$1 data-group="' + escape_replace(escape_html(id)) + '"');
			}
			if (templateName === 'option' || templateName === 'item') {
				html = html.replace(regex_tag, '<$1 data-value="' + escape_replace(escape_html(value || '')) + '"');
			}

			// update cache
			if (cache) {
				self.renderCache[templateName][value] = html;
			}

			return html;
		},

		/**
   * Clears the render cache for a template. If
   * no template is given, clears all render
   * caches.
   *
   * @param {string} templateName
   */
		clearCache: function clearCache(templateName) {
			var self = this;
			if (typeof templateName === 'undefined') {
				self.renderCache = {};
			} else {
				delete self.renderCache[templateName];
			}
		},

		/**
   * Determines whether or not to display the
   * create item prompt, given a user input.
   *
   * @param {string} input
   * @return {boolean}
   */
		canCreate: function canCreate(input) {
			var self = this;
			if (!self.settings.create) return false;
			var filter = self.settings.createFilter;
			return input.length && (typeof filter !== 'function' || filter.apply(self, [input])) && (typeof filter !== 'string' || new RegExp(filter).test(input)) && (!(filter instanceof RegExp) || filter.test(input));
		}

	});

	Selectize.count = 0;
	Selectize.defaults = {
		options: [],
		optgroups: [],

		plugins: [],
		delimiter: ',',
		splitOn: null, // regexp or string for splitting up values from a paste command
		persist: true,
		diacritics: true,
		create: false,
		createOnBlur: false,
		createFilter: null,
		highlight: true,
		openOnFocus: true,
		maxOptions: 1000,
		maxItems: null,
		hideSelected: null,
		addPrecedence: false,
		selectOnTab: false,
		preload: false,
		allowEmptyOption: false,
		closeAfterSelect: false,

		scrollDuration: 60,
		loadThrottle: 300,
		loadingClass: 'loading',

		dataAttr: 'data-data',
		optgroupField: 'optgroup',
		valueField: 'value',
		labelField: 'text',
		optgroupLabelField: 'label',
		optgroupValueField: 'value',
		lockOptgroupOrder: false,

		sortField: '$order',
		searchField: ['text'],
		searchConjunction: 'and',

		mode: null,
		wrapperClass: 'selectize-control',
		inputClass: 'selectize-input',
		dropdownClass: 'selectize-dropdown',
		dropdownContentClass: 'selectize-dropdown-content',

		dropdownParent: null,

		copyClassesToDropdown: true,

		/*
  load                 : null, // function(query, callback) { ... }
  score                : null, // function(search) { ... }
  onInitialize         : null, // function() { ... }
  onChange             : null, // function(value) { ... }
  onItemAdd            : null, // function(value, $item) { ... }
  onItemRemove         : null, // function(value) { ... }
  onClear              : null, // function() { ... }
  onOptionAdd          : null, // function(value, data) { ... }
  onOptionRemove       : null, // function(value) { ... }
  onOptionClear        : null, // function() { ... }
  onOptionGroupAdd     : null, // function(id, data) { ... }
  onOptionGroupRemove  : null, // function(id) { ... }
  onOptionGroupClear   : null, // function() { ... }
  onDropdownOpen       : null, // function($dropdown) { ... }
  onDropdownClose      : null, // function($dropdown) { ... }
  onType               : null, // function(str) { ... }
  onDelete             : null, // function(values) { ... }
  */

		render: {
			/*
   item: null,
   optgroup: null,
   optgroup_header: null,
   option: null,
   option_create: null
   */
		}
	};

	$.fn.selectize = function (settings_user) {
		var defaults = $.fn.selectize.defaults;
		var settings = $.extend({}, defaults, settings_user);
		var attr_data = settings.dataAttr;
		var field_label = settings.labelField;
		var field_value = settings.valueField;
		var field_optgroup = settings.optgroupField;
		var field_optgroup_label = settings.optgroupLabelField;
		var field_optgroup_value = settings.optgroupValueField;

		/**
   * Initializes selectize from a <input type="text"> element.
   *
   * @param {object} $input
   * @param {object} settings_element
   */
		var init_textbox = function init_textbox($input, settings_element) {
			var i, n, values, option;

			var data_raw = $input.attr(attr_data);

			if (!data_raw) {
				var value = $.trim($input.val() || '');
				if (!settings.allowEmptyOption && !value.length) return;
				values = value.split(settings.delimiter);
				for (i = 0, n = values.length; i < n; i++) {
					option = {};
					option[field_label] = values[i];
					option[field_value] = values[i];
					settings_element.options.push(option);
				}
				settings_element.items = values;
			} else {
				settings_element.options = JSON.parse(data_raw);
				for (i = 0, n = settings_element.options.length; i < n; i++) {
					settings_element.items.push(settings_element.options[i][field_value]);
				}
			}
		};

		/**
   * Initializes selectize from a <select> element.
   *
   * @param {object} $input
   * @param {object} settings_element
   */
		var init_select = function init_select($input, settings_element) {
			var i,
			    n,
			    tagName,
			    $children,
			    order = 0;
			var options = settings_element.options;
			var optionsMap = {};

			var readData = function readData($el) {
				var data = attr_data && $el.attr(attr_data);
				if (typeof data === 'string' && data.length) {
					return JSON.parse(data);
				}
				return null;
			};

			var addOption = function addOption($option, group) {
				$option = $($option);

				var value = hash_key($option.attr('value'));
				if (!value && !settings.allowEmptyOption) return;

				// if the option already exists, it's probably been
				// duplicated in another optgroup. in this case, push
				// the current group to the "optgroup" property on the
				// existing option so that it's rendered in both places.
				if (optionsMap.hasOwnProperty(value)) {
					if (group) {
						var arr = optionsMap[value][field_optgroup];
						if (!arr) {
							optionsMap[value][field_optgroup] = group;
						} else if (!$.isArray(arr)) {
							optionsMap[value][field_optgroup] = [arr, group];
						} else {
							arr.push(group);
						}
					}
					return;
				}

				var option = readData($option) || {};
				option[field_label] = option[field_label] || $option.text();
				option[field_value] = option[field_value] || value;
				option[field_optgroup] = option[field_optgroup] || group;

				optionsMap[value] = option;
				options.push(option);

				if ($option.is(':selected')) {
					settings_element.items.push(value);
				}
			};

			var addGroup = function addGroup($optgroup) {
				var i, n, id, optgroup, $options;

				$optgroup = $($optgroup);
				id = $optgroup.attr('label');

				if (id) {
					optgroup = readData($optgroup) || {};
					optgroup[field_optgroup_label] = id;
					optgroup[field_optgroup_value] = id;
					settings_element.optgroups.push(optgroup);
				}

				$options = $('option', $optgroup);
				for (i = 0, n = $options.length; i < n; i++) {
					addOption($options[i], id);
				}
			};

			settings_element.maxItems = $input.attr('multiple') ? null : 1;

			$children = $input.children();
			for (i = 0, n = $children.length; i < n; i++) {
				tagName = $children[i].tagName.toLowerCase();
				if (tagName === 'optgroup') {
					addGroup($children[i]);
				} else if (tagName === 'option') {
					addOption($children[i]);
				}
			}
		};

		return this.each(function () {
			if (this.selectize) return;

			var instance;
			var $input = $(this);
			var tag_name = this.tagName.toLowerCase();
			var placeholder = $input.attr('placeholder') || $input.attr('data-placeholder');
			if (!placeholder && !settings.allowEmptyOption) {
				placeholder = $input.children('option[value=""]').text();
			}

			var settings_element = {
				'placeholder': placeholder,
				'options': [],
				'optgroups': [],
				'items': []
			};

			if (tag_name === 'select') {
				init_select($input, settings_element);
			} else {
				init_textbox($input, settings_element);
			}

			instance = new Selectize($input, $.extend(true, {}, defaults, settings_element, settings_user));
		});
	};

	$.fn.selectize.defaults = Selectize.defaults;
	$.fn.selectize.support = {
		validity: SUPPORTS_VALIDITY_API
	};

	Selectize.define('drag_drop', function (options) {
		if (!$.fn.sortable) throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');
		if (this.settings.mode !== 'multi') return;
		var self = this;

		self.lock = function () {
			var original = self.lock;
			return function () {
				var sortable = self.$control.data('sortable');
				if (sortable) sortable.disable();
				return original.apply(self, arguments);
			};
		}();

		self.unlock = function () {
			var original = self.unlock;
			return function () {
				var sortable = self.$control.data('sortable');
				if (sortable) sortable.enable();
				return original.apply(self, arguments);
			};
		}();

		self.setup = function () {
			var original = self.setup;
			return function () {
				original.apply(this, arguments);

				var $control = self.$control.sortable({
					items: '[data-value]',
					forcePlaceholderSize: true,
					disabled: self.isLocked,
					start: function start(e, ui) {
						ui.placeholder.css('width', ui.helper.css('width'));
						$control.css({ overflow: 'visible' });
					},
					stop: function stop() {
						$control.css({ overflow: 'hidden' });
						var active = self.$activeItems ? self.$activeItems.slice() : null;
						var values = [];
						$control.children('[data-value]').each(function () {
							values.push($(this).attr('data-value'));
						});
						self.setValue(values);
						self.setActiveItem(active);
					}
				});
			};
		}();
	});

	Selectize.define('dropdown_header', function (options) {
		var self = this;

		options = $.extend({
			title: 'Untitled',
			headerClass: 'selectize-dropdown-header',
			titleRowClass: 'selectize-dropdown-header-title',
			labelClass: 'selectize-dropdown-header-label',
			closeClass: 'selectize-dropdown-header-close',

			html: function html(data) {
				return '<div class="' + data.headerClass + '">' + '<div class="' + data.titleRowClass + '">' + '<span class="' + data.labelClass + '">' + data.title + '</span>' + '<a href="javascript:void(0)" class="' + data.closeClass + '">&times;</a>' + '</div>' + '</div>';
			}
		}, options);

		self.setup = function () {
			var original = self.setup;
			return function () {
				original.apply(self, arguments);
				self.$dropdown_header = $(options.html(options));
				self.$dropdown.prepend(self.$dropdown_header);
			};
		}();
	});

	Selectize.define('optgroup_columns', function (options) {
		var self = this;

		options = $.extend({
			equalizeWidth: true,
			equalizeHeight: true
		}, options);

		this.getAdjacentOption = function ($option, direction) {
			var $options = $option.closest('[data-group]').find('[data-selectable]');
			var index = $options.index($option) + direction;

			return index >= 0 && index < $options.length ? $options.eq(index) : $();
		};

		this.onKeyDown = function () {
			var original = self.onKeyDown;
			return function (e) {
				var index, $option, $options, $optgroup;

				if (this.isOpen && (e.keyCode === KEY_LEFT || e.keyCode === KEY_RIGHT)) {
					self.ignoreHover = true;
					$optgroup = this.$activeOption.closest('[data-group]');
					index = $optgroup.find('[data-selectable]').index(this.$activeOption);

					if (e.keyCode === KEY_LEFT) {
						$optgroup = $optgroup.prev('[data-group]');
					} else {
						$optgroup = $optgroup.next('[data-group]');
					}

					$options = $optgroup.find('[data-selectable]');
					$option = $options.eq(Math.min($options.length - 1, index));
					if ($option.length) {
						this.setActiveOption($option);
					}
					return;
				}

				return original.apply(this, arguments);
			};
		}();

		var getScrollbarWidth = function getScrollbarWidth() {
			var div;
			var width = getScrollbarWidth.width;
			var doc = document;

			if (typeof width === 'undefined') {
				div = doc.createElement('div');
				div.innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>';
				div = div.firstChild;
				doc.body.appendChild(div);
				width = getScrollbarWidth.width = div.offsetWidth - div.clientWidth;
				doc.body.removeChild(div);
			}
			return width;
		};

		var equalizeSizes = function equalizeSizes() {
			var i, n, height_max, width, width_last, width_parent, $optgroups;

			$optgroups = $('[data-group]', self.$dropdown_content);
			n = $optgroups.length;
			if (!n || !self.$dropdown_content.width()) return;

			if (options.equalizeHeight) {
				height_max = 0;
				for (i = 0; i < n; i++) {
					height_max = Math.max(height_max, $optgroups.eq(i).height());
				}
				$optgroups.css({ height: height_max });
			}

			if (options.equalizeWidth) {
				width_parent = self.$dropdown_content.innerWidth() - getScrollbarWidth();
				width = Math.round(width_parent / n);
				$optgroups.css({ width: width });
				if (n > 1) {
					width_last = width_parent - width * (n - 1);
					$optgroups.eq(n - 1).css({ width: width_last });
				}
			}
		};

		if (options.equalizeHeight || options.equalizeWidth) {
			hook.after(this, 'positionDropdown', equalizeSizes);
			hook.after(this, 'refreshOptions', equalizeSizes);
		}
	});

	Selectize.define('remove_button', function (options) {
		if (this.settings.mode === 'single') return;

		options = $.extend({
			label: '&times;',
			title: 'Remove',
			className: 'remove',
			append: true
		}, options);

		var self = this;
		var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';

		/**
   * Appends an element as a child (with raw HTML).
   *
   * @param {string} html_container
   * @param {string} html_element
   * @return {string}
   */
		var append = function append(html_container, html_element) {
			var pos = html_container.search(/(<\/[^>]+>\s*)$/);
			return html_container.substring(0, pos) + html_element + html_container.substring(pos);
		};

		this.setup = function () {
			var original = self.setup;
			return function () {
				// override the item rendering method to add the button to each
				if (options.append) {
					var render_item = self.settings.render.item;
					self.settings.render.item = function (data) {
						return append(render_item.apply(this, arguments), html);
					};
				}

				original.apply(this, arguments);

				// add event listener
				this.$control.on('click', '.' + options.className, function (e) {
					e.preventDefault();
					if (self.isLocked) return;

					var $item = $(e.currentTarget).parent();
					self.setActiveItem($item);
					if (self.deleteSelection()) {
						self.setCaret(self.items.length);
					}
				});
			};
		}();
	});

	Selectize.define('restore_on_backspace', function (options) {
		var self = this;

		options.text = options.text || function (option) {
			return option[this.settings.labelField];
		};

		this.onKeyDown = function () {
			var original = self.onKeyDown;
			return function (e) {
				var index, option;
				if (e.keyCode === KEY_BACKSPACE && this.$control_input.val() === '' && !this.$activeItems.length) {
					index = this.caretPos - 1;
					if (index >= 0 && index < this.items.length) {
						option = this.options[this.items[index]];
						if (this.deleteSelection(e)) {
							this.setTextboxValue(options.text.apply(this, [option]));
							this.refreshOptions(true);
						}
						e.preventDefault();
						return;
					}
				}
				return original.apply(this, arguments);
			};
		}();
	});

	return Selectize;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NlbGVjdGl6ZS5qcy9kaXN0L2pzL3N0YW5kYWxvbmUvc2VsZWN0aXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JDLFdBQVMsSUFBVCxFQUFlLE9BQWYsRUFBd0I7QUFDeEIsS0FBSSxPQUFPLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsT0FBTyxHQUEzQyxFQUFnRDtBQUMvQyxTQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDQSxFQUZELE1BRU8sSUFBSSxRQUFPLE9BQVAseUNBQU8sT0FBUCxPQUFtQixRQUF2QixFQUFpQztBQUN2QyxTQUFPLE9BQVAsR0FBaUIsU0FBakI7QUFDQSxFQUZNLE1BRUE7QUFDTixPQUFLLE1BQUwsR0FBYyxTQUFkO0FBQ0E7QUFDRCxDQVJBLGFBUU8sWUFBVzs7Ozs7Ozs7Ozs7QUFXbEIsS0FBSSxTQUFTLFNBQVQsTUFBUyxDQUFTLEtBQVQsRUFBZ0IsUUFBaEIsRUFBMEI7QUFDdEMsT0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLE9BQUssUUFBTCxHQUFnQixZQUFZLEVBQUMsWUFBWSxJQUFiLEVBQTVCO0FBQ0EsRUFIRDs7Ozs7Ozs7O0FBWUEsUUFBTyxTQUFQLENBQWlCLFFBQWpCLEdBQTRCLFVBQVMsS0FBVCxFQUFnQjtBQUMzQyxVQUFRLEtBQUssT0FBTyxTQUFTLEVBQWhCLEVBQW9CLFdBQXBCLEVBQUwsQ0FBUjtBQUNBLE1BQUksQ0FBQyxLQUFELElBQVUsQ0FBQyxNQUFNLE1BQXJCLEVBQTZCLE9BQU8sRUFBUDs7QUFFN0IsTUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLEtBQVYsRUFBaUIsTUFBakI7QUFDQSxNQUFJLFNBQVMsRUFBYjtBQUNBLE1BQUksUUFBUSxNQUFNLEtBQU4sQ0FBWSxJQUFaLENBQVo7O0FBRUEsT0FBSyxJQUFJLENBQUosRUFBTyxJQUFJLE1BQU0sTUFBdEIsRUFBOEIsSUFBSSxDQUFsQyxFQUFxQyxHQUFyQyxFQUEwQztB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QUFqQixFQUF5QyxVQUFTLE9BQVQsRUFBa0I7QUFDMUQsTUFBSSxPQUFPLElBQVg7O0FBRUEsVUFBUSxJQUFSLEdBQWUsUUFBUSxJQUFSLElBQWdCLFVBQVMsTUFBVCxFQUFpQjtBQUMvQyxVQUFPLE9BQU8sS0FBSyxRQUFMLENBQWMsVUFBckIsQ0FBUDtBQUNBLEdBRkQ7O0FBSUEsT0FBSyxTQUFMLEdBQWtCLFlBQVc7QUFDNUIsT0FBSSxXQUFXLEtBQUssU0FBcEI7QUFDQSxVQUFPLFVBQVMsQ0FBVCxFQUFZO0FBQ2xCLFFBQUksS0FBSixFQUFXLE1BQVg7QUFDQSxRQUFJLEVBQUUsT0FBRixLQUFjLGFBQWQsSUFBK0IsS0FBSyxjQUFMLENBQW9CLEdBQXBCLE9BQThCLEVBQTdELElBQW1FLENBQUMsS0FBSyxZQUFMLENBQWtCLE1BQTFGLEVBQWtHO0FBQ2pHLGFBQVEsS0FBSyxRQUFMLEdBQWdCLENBQXhCO0FBQ0EsU0FBSSxTQUFTLENBQVQsSUFBYyxRQUFRLEtBQUssS0FBTCxDQUFXLE1BQXJDLEVBQTZDO0FBQzVDLGVBQVMsS0FBSyxPQUFMLENBQWEsS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFiLENBQVQ7QUFDQSxVQUFJLEtBQUssZUFBTCxDQUFxQixDQUFyQixDQUFKLEVBQTZCO0FBQzVCLFlBQUssZUFBTCxDQUFxQixRQUFRLElBQVIsQ0FBYSxLQUFiLENBQW1CLElBQW5CLEVBQXlCLENBQUMsTUFBRCxDQUF6QixDQUFyQjtBQUNBLFlBQUssY0FBTCxDQUFvQixJQUFwQjtBQUNBO0FBQ0QsUUFBRSxjQUFGO0FBQ0E7QUFDQTtBQUNEO0FBQ0QsV0FBTyxTQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCLFNBQXJCLENBQVA7QUFDQSxJQWZEO0FBZ0JBLEdBbEJnQixFQUFqQjtBQW1CQSxFQTFCRDs7QUE2QkEsUUFBTyxTQUFQO0FBQ0EsQ0E5OUZBLENBQUQiLCJmaWxlIjoic2VsZWN0aXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBzaWZ0ZXIuanNcbiAqIENvcHlyaWdodCAoYykgMjAxMyBCcmlhbiBSZWF2aXMgJiBjb250cmlidXRvcnNcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpc1xuICogZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQ6XG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyXG4gKiB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GXG4gKiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2VcbiAqIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGF1dGhvciBCcmlhbiBSZWF2aXMgPGJyaWFuQHRoaXJkcm91dGUuY29tPlxuICovXG5cbihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoJ3NpZnRlcicsIGZhY3RvcnkpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHR9IGVsc2Uge1xuXHRcdHJvb3QuU2lmdGVyID0gZmFjdG9yeSgpO1xuXHR9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuXG5cdC8qKlxuXHQgKiBUZXh0dWFsbHkgc2VhcmNoZXMgYXJyYXlzIGFuZCBoYXNoZXMgb2Ygb2JqZWN0c1xuXHQgKiBieSBwcm9wZXJ0eSAob3IgbXVsdGlwbGUgcHJvcGVydGllcykuIERlc2lnbmVkXG5cdCAqIHNwZWNpZmljYWxseSBmb3IgYXV0b2NvbXBsZXRlLlxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICogQHBhcmFtIHthcnJheXxvYmplY3R9IGl0ZW1zXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtc1xuXHQgKi9cblx0dmFyIFNpZnRlciA9IGZ1bmN0aW9uKGl0ZW1zLCBzZXR0aW5ncykge1xuXHRcdHRoaXMuaXRlbXMgPSBpdGVtcztcblx0XHR0aGlzLnNldHRpbmdzID0gc2V0dGluZ3MgfHwge2RpYWNyaXRpY3M6IHRydWV9O1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBTcGxpdHMgYSBzZWFyY2ggc3RyaW5nIGludG8gYW4gYXJyYXkgb2YgaW5kaXZpZHVhbFxuXHQgKiByZWdleHBzIHRvIGJlIHVzZWQgdG8gbWF0Y2ggcmVzdWx0cy5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5XG5cdCAqIEByZXR1cm5zIHthcnJheX1cblx0ICovXG5cdFNpZnRlci5wcm90b3R5cGUudG9rZW5pemUgPSBmdW5jdGlvbihxdWVyeSkge1xuXHRcdHF1ZXJ5ID0gdHJpbShTdHJpbmcocXVlcnkgfHwgJycpLnRvTG93ZXJDYXNlKCkpO1xuXHRcdGlmICghcXVlcnkgfHwgIXF1ZXJ5Lmxlbmd0aCkgcmV0dXJuIFtdO1xuXG5cdFx0dmFyIGksIG4sIHJlZ2V4LCBsZXR0ZXI7XG5cdFx0dmFyIHRva2VucyA9IFtdO1xuXHRcdHZhciB3b3JkcyA9IHF1ZXJ5LnNwbGl0KC8gKy8pO1xuXG5cdFx0Zm9yIChpID0gMCwgbiA9IHdvcmRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0cmVnZXggPSBlc2NhcGVfcmVnZXgod29yZHNbaV0pO1xuXHRcdFx0aWYgKHRoaXMuc2V0dGluZ3MuZGlhY3JpdGljcykge1xuXHRcdFx0XHRmb3IgKGxldHRlciBpbiBESUFDUklUSUNTKSB7XG5cdFx0XHRcdFx0aWYgKERJQUNSSVRJQ1MuaGFzT3duUHJvcGVydHkobGV0dGVyKSkge1xuXHRcdFx0XHRcdFx0cmVnZXggPSByZWdleC5yZXBsYWNlKG5ldyBSZWdFeHAobGV0dGVyLCAnZycpLCBESUFDUklUSUNTW2xldHRlcl0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dG9rZW5zLnB1c2goe1xuXHRcdFx0XHRzdHJpbmcgOiB3b3Jkc1tpXSxcblx0XHRcdFx0cmVnZXggIDogbmV3IFJlZ0V4cChyZWdleCwgJ2knKVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRva2Vucztcblx0fTtcblxuXHQvKipcblx0ICogSXRlcmF0ZXMgb3ZlciBhcnJheXMgYW5kIGhhc2hlcy5cblx0ICpcblx0ICogYGBgXG5cdCAqIHRoaXMuaXRlcmF0b3IodGhpcy5pdGVtcywgZnVuY3Rpb24oaXRlbSwgaWQpIHtcblx0ICogICAgLy8gaW52b2tlZCBmb3IgZWFjaCBpdGVtXG5cdCAqIH0pO1xuXHQgKiBgYGBcblx0ICpcblx0ICogQHBhcmFtIHthcnJheXxvYmplY3R9IG9iamVjdFxuXHQgKi9cblx0U2lmdGVyLnByb3RvdHlwZS5pdGVyYXRvciA9IGZ1bmN0aW9uKG9iamVjdCwgY2FsbGJhY2spIHtcblx0XHR2YXIgaXRlcmF0b3I7XG5cdFx0aWYgKGlzX2FycmF5KG9iamVjdCkpIHtcblx0XHRcdGl0ZXJhdG9yID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2ggfHwgZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIG4gPSB0aGlzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRcdGNhbGxiYWNrKHRoaXNbaV0sIGksIHRoaXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpdGVyYXRvciA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0XHRcdGZvciAodmFyIGtleSBpbiB0aGlzKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2sodGhpc1trZXldLCBrZXksIHRoaXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpdGVyYXRvci5hcHBseShvYmplY3QsIFtjYWxsYmFja10pO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gYmUgdXNlZCB0byBzY29yZSBpbmRpdmlkdWFsIHJlc3VsdHMuXG5cdCAqXG5cdCAqIEdvb2QgbWF0Y2hlcyB3aWxsIGhhdmUgYSBoaWdoZXIgc2NvcmUgdGhhbiBwb29yIG1hdGNoZXMuXG5cdCAqIElmIGFuIGl0ZW0gaXMgbm90IGEgbWF0Y2gsIDAgd2lsbCBiZSByZXR1cm5lZCBieSB0aGUgZnVuY3Rpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ30gc2VhcmNoXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIChvcHRpb25hbClcblx0ICogQHJldHVybnMge2Z1bmN0aW9ufVxuXHQgKi9cblx0U2lmdGVyLnByb3RvdHlwZS5nZXRTY29yZUZ1bmN0aW9uID0gZnVuY3Rpb24oc2VhcmNoLCBvcHRpb25zKSB7XG5cdFx0dmFyIHNlbGYsIGZpZWxkcywgdG9rZW5zLCB0b2tlbl9jb3VudDtcblxuXHRcdHNlbGYgICAgICAgID0gdGhpcztcblx0XHRzZWFyY2ggICAgICA9IHNlbGYucHJlcGFyZVNlYXJjaChzZWFyY2gsIG9wdGlvbnMpO1xuXHRcdHRva2VucyAgICAgID0gc2VhcmNoLnRva2Vucztcblx0XHRmaWVsZHMgICAgICA9IHNlYXJjaC5vcHRpb25zLmZpZWxkcztcblx0XHR0b2tlbl9jb3VudCA9IHRva2Vucy5sZW5ndGg7XG5cblx0XHQvKipcblx0XHQgKiBDYWxjdWxhdGVzIGhvdyBjbG9zZSBvZiBhIG1hdGNoIHRoZVxuXHRcdCAqIGdpdmVuIHZhbHVlIGlzIGFnYWluc3QgYSBzZWFyY2ggdG9rZW4uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge21peGVkfSB2YWx1ZVxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSB0b2tlblxuXHRcdCAqIEByZXR1cm4ge251bWJlcn1cblx0XHQgKi9cblx0XHR2YXIgc2NvcmVWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlLCB0b2tlbikge1xuXHRcdFx0dmFyIHNjb3JlLCBwb3M7XG5cblx0XHRcdGlmICghdmFsdWUpIHJldHVybiAwO1xuXHRcdFx0dmFsdWUgPSBTdHJpbmcodmFsdWUgfHwgJycpO1xuXHRcdFx0cG9zID0gdmFsdWUuc2VhcmNoKHRva2VuLnJlZ2V4KTtcblx0XHRcdGlmIChwb3MgPT09IC0xKSByZXR1cm4gMDtcblx0XHRcdHNjb3JlID0gdG9rZW4uc3RyaW5nLmxlbmd0aCAvIHZhbHVlLmxlbmd0aDtcblx0XHRcdGlmIChwb3MgPT09IDApIHNjb3JlICs9IDAuNTtcblx0XHRcdHJldHVybiBzY29yZTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogQ2FsY3VsYXRlcyB0aGUgc2NvcmUgb2YgYW4gb2JqZWN0XG5cdFx0ICogYWdhaW5zdCB0aGUgc2VhcmNoIHF1ZXJ5LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IHRva2VuXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IGRhdGFcblx0XHQgKiBAcmV0dXJuIHtudW1iZXJ9XG5cdFx0ICovXG5cdFx0dmFyIHNjb3JlT2JqZWN0ID0gKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGZpZWxkX2NvdW50ID0gZmllbGRzLmxlbmd0aDtcblx0XHRcdGlmICghZmllbGRfY291bnQpIHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblx0XHRcdH1cblx0XHRcdGlmIChmaWVsZF9jb3VudCA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24odG9rZW4sIGRhdGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gc2NvcmVWYWx1ZShkYXRhW2ZpZWxkc1swXV0sIHRva2VuKTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmdW5jdGlvbih0b2tlbiwgZGF0YSkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgc3VtID0gMDsgaSA8IGZpZWxkX2NvdW50OyBpKyspIHtcblx0XHRcdFx0XHRzdW0gKz0gc2NvcmVWYWx1ZShkYXRhW2ZpZWxkc1tpXV0sIHRva2VuKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gc3VtIC8gZmllbGRfY291bnQ7XG5cdFx0XHR9O1xuXHRcdH0pKCk7XG5cblx0XHRpZiAoIXRva2VuX2NvdW50KSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXHRcdH1cblx0XHRpZiAodG9rZW5fY291bnQgPT09IDEpIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdHJldHVybiBzY29yZU9iamVjdCh0b2tlbnNbMF0sIGRhdGEpO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoc2VhcmNoLm9wdGlvbnMuY29uanVuY3Rpb24gPT09ICdhbmQnKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHR2YXIgc2NvcmU7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBzdW0gPSAwOyBpIDwgdG9rZW5fY291bnQ7IGkrKykge1xuXHRcdFx0XHRcdHNjb3JlID0gc2NvcmVPYmplY3QodG9rZW5zW2ldLCBkYXRhKTtcblx0XHRcdFx0XHRpZiAoc2NvcmUgPD0gMCkgcmV0dXJuIDA7XG5cdFx0XHRcdFx0c3VtICs9IHNjb3JlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBzdW0gLyB0b2tlbl9jb3VudDtcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBzdW0gPSAwOyBpIDwgdG9rZW5fY291bnQ7IGkrKykge1xuXHRcdFx0XHRcdHN1bSArPSBzY29yZU9iamVjdCh0b2tlbnNbaV0sIGRhdGEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBzdW0gLyB0b2tlbl9jb3VudDtcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBjb21wYXJlIHR3b1xuXHQgKiByZXN1bHRzLCBmb3Igc29ydGluZyBwdXJwb3Nlcy4gSWYgbm8gc29ydGluZyBzaG91bGRcblx0ICogYmUgcGVyZm9ybWVkLCBgbnVsbGAgd2lsbCBiZSByZXR1cm5lZC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBzZWFyY2hcblx0ICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcblx0ICogQHJldHVybiBmdW5jdGlvbihhLGIpXG5cdCAqL1xuXHRTaWZ0ZXIucHJvdG90eXBlLmdldFNvcnRGdW5jdGlvbiA9IGZ1bmN0aW9uKHNlYXJjaCwgb3B0aW9ucykge1xuXHRcdHZhciBpLCBuLCBzZWxmLCBmaWVsZCwgZmllbGRzLCBmaWVsZHNfY291bnQsIG11bHRpcGxpZXIsIG11bHRpcGxpZXJzLCBnZXRfZmllbGQsIGltcGxpY2l0X3Njb3JlLCBzb3J0O1xuXG5cdFx0c2VsZiAgID0gdGhpcztcblx0XHRzZWFyY2ggPSBzZWxmLnByZXBhcmVTZWFyY2goc2VhcmNoLCBvcHRpb25zKTtcblx0XHRzb3J0ICAgPSAoIXNlYXJjaC5xdWVyeSAmJiBvcHRpb25zLnNvcnRfZW1wdHkpIHx8IG9wdGlvbnMuc29ydDtcblxuXHRcdC8qKlxuXHRcdCAqIEZldGNoZXMgdGhlIHNwZWNpZmllZCBzb3J0IGZpZWxkIHZhbHVlXG5cdFx0ICogZnJvbSBhIHNlYXJjaCByZXN1bHQgaXRlbS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAge3N0cmluZ30gbmFtZVxuXHRcdCAqIEBwYXJhbSAge29iamVjdH0gcmVzdWx0XG5cdFx0ICogQHJldHVybiB7bWl4ZWR9XG5cdFx0ICovXG5cdFx0Z2V0X2ZpZWxkID0gZnVuY3Rpb24obmFtZSwgcmVzdWx0KSB7XG5cdFx0XHRpZiAobmFtZSA9PT0gJyRzY29yZScpIHJldHVybiByZXN1bHQuc2NvcmU7XG5cdFx0XHRyZXR1cm4gc2VsZi5pdGVtc1tyZXN1bHQuaWRdW25hbWVdO1xuXHRcdH07XG5cblx0XHQvLyBwYXJzZSBvcHRpb25zXG5cdFx0ZmllbGRzID0gW107XG5cdFx0aWYgKHNvcnQpIHtcblx0XHRcdGZvciAoaSA9IDAsIG4gPSBzb3J0Lmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRpZiAoc2VhcmNoLnF1ZXJ5IHx8IHNvcnRbaV0uZmllbGQgIT09ICckc2NvcmUnKSB7XG5cdFx0XHRcdFx0ZmllbGRzLnB1c2goc29ydFtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyB0aGUgXCIkc2NvcmVcIiBmaWVsZCBpcyBpbXBsaWVkIHRvIGJlIHRoZSBwcmltYXJ5XG5cdFx0Ly8gc29ydCBmaWVsZCwgdW5sZXNzIGl0J3MgbWFudWFsbHkgc3BlY2lmaWVkXG5cdFx0aWYgKHNlYXJjaC5xdWVyeSkge1xuXHRcdFx0aW1wbGljaXRfc2NvcmUgPSB0cnVlO1xuXHRcdFx0Zm9yIChpID0gMCwgbiA9IGZpZWxkcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0aWYgKGZpZWxkc1tpXS5maWVsZCA9PT0gJyRzY29yZScpIHtcblx0XHRcdFx0XHRpbXBsaWNpdF9zY29yZSA9IGZhbHNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoaW1wbGljaXRfc2NvcmUpIHtcblx0XHRcdFx0ZmllbGRzLnVuc2hpZnQoe2ZpZWxkOiAnJHNjb3JlJywgZGlyZWN0aW9uOiAnZGVzYyd9KTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Zm9yIChpID0gMCwgbiA9IGZpZWxkcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0aWYgKGZpZWxkc1tpXS5maWVsZCA9PT0gJyRzY29yZScpIHtcblx0XHRcdFx0XHRmaWVsZHMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bXVsdGlwbGllcnMgPSBbXTtcblx0XHRmb3IgKGkgPSAwLCBuID0gZmllbGRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0bXVsdGlwbGllcnMucHVzaChmaWVsZHNbaV0uZGlyZWN0aW9uID09PSAnZGVzYycgPyAtMSA6IDEpO1xuXHRcdH1cblxuXHRcdC8vIGJ1aWxkIGZ1bmN0aW9uXG5cdFx0ZmllbGRzX2NvdW50ID0gZmllbGRzLmxlbmd0aDtcblx0XHRpZiAoIWZpZWxkc19jb3VudCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSBlbHNlIGlmIChmaWVsZHNfY291bnQgPT09IDEpIHtcblx0XHRcdGZpZWxkID0gZmllbGRzWzBdLmZpZWxkO1xuXHRcdFx0bXVsdGlwbGllciA9IG11bHRpcGxpZXJzWzBdO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdFx0cmV0dXJuIG11bHRpcGxpZXIgKiBjbXAoXG5cdFx0XHRcdFx0Z2V0X2ZpZWxkKGZpZWxkLCBhKSxcblx0XHRcdFx0XHRnZXRfZmllbGQoZmllbGQsIGIpXG5cdFx0XHRcdCk7XG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0XHR2YXIgaSwgcmVzdWx0LCBhX3ZhbHVlLCBiX3ZhbHVlLCBmaWVsZDtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGZpZWxkc19jb3VudDsgaSsrKSB7XG5cdFx0XHRcdFx0ZmllbGQgPSBmaWVsZHNbaV0uZmllbGQ7XG5cdFx0XHRcdFx0cmVzdWx0ID0gbXVsdGlwbGllcnNbaV0gKiBjbXAoXG5cdFx0XHRcdFx0XHRnZXRfZmllbGQoZmllbGQsIGEpLFxuXHRcdFx0XHRcdFx0Z2V0X2ZpZWxkKGZpZWxkLCBiKVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0aWYgKHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBQYXJzZXMgYSBzZWFyY2ggcXVlcnkgYW5kIHJldHVybnMgYW4gb2JqZWN0XG5cdCAqIHdpdGggdG9rZW5zIGFuZCBmaWVsZHMgcmVhZHkgdG8gYmUgcG9wdWxhdGVkXG5cdCAqIHdpdGggcmVzdWx0cy5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5XG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG5cdCAqIEByZXR1cm5zIHtvYmplY3R9XG5cdCAqL1xuXHRTaWZ0ZXIucHJvdG90eXBlLnByZXBhcmVTZWFyY2ggPSBmdW5jdGlvbihxdWVyeSwgb3B0aW9ucykge1xuXHRcdGlmICh0eXBlb2YgcXVlcnkgPT09ICdvYmplY3QnKSByZXR1cm4gcXVlcnk7XG5cblx0XHRvcHRpb25zID0gZXh0ZW5kKHt9LCBvcHRpb25zKTtcblxuXHRcdHZhciBvcHRpb25fZmllbGRzICAgICA9IG9wdGlvbnMuZmllbGRzO1xuXHRcdHZhciBvcHRpb25fc29ydCAgICAgICA9IG9wdGlvbnMuc29ydDtcblx0XHR2YXIgb3B0aW9uX3NvcnRfZW1wdHkgPSBvcHRpb25zLnNvcnRfZW1wdHk7XG5cblx0XHRpZiAob3B0aW9uX2ZpZWxkcyAmJiAhaXNfYXJyYXkob3B0aW9uX2ZpZWxkcykpIG9wdGlvbnMuZmllbGRzID0gW29wdGlvbl9maWVsZHNdO1xuXHRcdGlmIChvcHRpb25fc29ydCAmJiAhaXNfYXJyYXkob3B0aW9uX3NvcnQpKSBvcHRpb25zLnNvcnQgPSBbb3B0aW9uX3NvcnRdO1xuXHRcdGlmIChvcHRpb25fc29ydF9lbXB0eSAmJiAhaXNfYXJyYXkob3B0aW9uX3NvcnRfZW1wdHkpKSBvcHRpb25zLnNvcnRfZW1wdHkgPSBbb3B0aW9uX3NvcnRfZW1wdHldO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdG9wdGlvbnMgOiBvcHRpb25zLFxuXHRcdFx0cXVlcnkgICA6IFN0cmluZyhxdWVyeSB8fCAnJykudG9Mb3dlckNhc2UoKSxcblx0XHRcdHRva2VucyAgOiB0aGlzLnRva2VuaXplKHF1ZXJ5KSxcblx0XHRcdHRvdGFsICAgOiAwLFxuXHRcdFx0aXRlbXMgICA6IFtdXG5cdFx0fTtcblx0fTtcblxuXHQvKipcblx0ICogU2VhcmNoZXMgdGhyb3VnaCBhbGwgaXRlbXMgYW5kIHJldHVybnMgYSBzb3J0ZWQgYXJyYXkgb2YgbWF0Y2hlcy5cblx0ICpcblx0ICogVGhlIGBvcHRpb25zYCBwYXJhbWV0ZXIgY2FuIGNvbnRhaW46XG5cdCAqXG5cdCAqICAgLSBmaWVsZHMge3N0cmluZ3xhcnJheX1cblx0ICogICAtIHNvcnQge2FycmF5fVxuXHQgKiAgIC0gc2NvcmUge2Z1bmN0aW9ufVxuXHQgKiAgIC0gZmlsdGVyIHtib29sfVxuXHQgKiAgIC0gbGltaXQge2ludGVnZXJ9XG5cdCAqXG5cdCAqIFJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmc6XG5cdCAqXG5cdCAqICAgLSBvcHRpb25zIHtvYmplY3R9XG5cdCAqICAgLSBxdWVyeSB7c3RyaW5nfVxuXHQgKiAgIC0gdG9rZW5zIHthcnJheX1cblx0ICogICAtIHRvdGFsIHtpbnR9XG5cdCAqICAgLSBpdGVtcyB7YXJyYXl9XG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBxdWVyeVxuXHQgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuXHQgKiBAcmV0dXJucyB7b2JqZWN0fVxuXHQgKi9cblx0U2lmdGVyLnByb3RvdHlwZS5zZWFyY2ggPSBmdW5jdGlvbihxdWVyeSwgb3B0aW9ucykge1xuXHRcdHZhciBzZWxmID0gdGhpcywgdmFsdWUsIHNjb3JlLCBzZWFyY2gsIGNhbGN1bGF0ZVNjb3JlO1xuXHRcdHZhciBmbl9zb3J0O1xuXHRcdHZhciBmbl9zY29yZTtcblxuXHRcdHNlYXJjaCAgPSB0aGlzLnByZXBhcmVTZWFyY2gocXVlcnksIG9wdGlvbnMpO1xuXHRcdG9wdGlvbnMgPSBzZWFyY2gub3B0aW9ucztcblx0XHRxdWVyeSAgID0gc2VhcmNoLnF1ZXJ5O1xuXG5cdFx0Ly8gZ2VuZXJhdGUgcmVzdWx0IHNjb3JpbmcgZnVuY3Rpb25cblx0XHRmbl9zY29yZSA9IG9wdGlvbnMuc2NvcmUgfHwgc2VsZi5nZXRTY29yZUZ1bmN0aW9uKHNlYXJjaCk7XG5cblx0XHQvLyBwZXJmb3JtIHNlYXJjaCBhbmQgc29ydFxuXHRcdGlmIChxdWVyeS5sZW5ndGgpIHtcblx0XHRcdHNlbGYuaXRlcmF0b3Ioc2VsZi5pdGVtcywgZnVuY3Rpb24oaXRlbSwgaWQpIHtcblx0XHRcdFx0c2NvcmUgPSBmbl9zY29yZShpdGVtKTtcblx0XHRcdFx0aWYgKG9wdGlvbnMuZmlsdGVyID09PSBmYWxzZSB8fCBzY29yZSA+IDApIHtcblx0XHRcdFx0XHRzZWFyY2guaXRlbXMucHVzaCh7J3Njb3JlJzogc2NvcmUsICdpZCc6IGlkfSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZWxmLml0ZXJhdG9yKHNlbGYuaXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGlkKSB7XG5cdFx0XHRcdHNlYXJjaC5pdGVtcy5wdXNoKHsnc2NvcmUnOiAxLCAnaWQnOiBpZH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Zm5fc29ydCA9IHNlbGYuZ2V0U29ydEZ1bmN0aW9uKHNlYXJjaCwgb3B0aW9ucyk7XG5cdFx0aWYgKGZuX3NvcnQpIHNlYXJjaC5pdGVtcy5zb3J0KGZuX3NvcnQpO1xuXG5cdFx0Ly8gYXBwbHkgbGltaXRzXG5cdFx0c2VhcmNoLnRvdGFsID0gc2VhcmNoLml0ZW1zLmxlbmd0aDtcblx0XHRpZiAodHlwZW9mIG9wdGlvbnMubGltaXQgPT09ICdudW1iZXInKSB7XG5cdFx0XHRzZWFyY2guaXRlbXMgPSBzZWFyY2guaXRlbXMuc2xpY2UoMCwgb3B0aW9ucy5saW1pdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHNlYXJjaDtcblx0fTtcblxuXHQvLyB1dGlsaXRpZXNcblx0Ly8gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLVxuXG5cdHZhciBjbXAgPSBmdW5jdGlvbihhLCBiKSB7XG5cdFx0aWYgKHR5cGVvZiBhID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgYiA9PT0gJ251bWJlcicpIHtcblx0XHRcdHJldHVybiBhID4gYiA/IDEgOiAoYSA8IGIgPyAtMSA6IDApO1xuXHRcdH1cblx0XHRhID0gYXNjaWlmb2xkKFN0cmluZyhhIHx8ICcnKSk7XG5cdFx0YiA9IGFzY2lpZm9sZChTdHJpbmcoYiB8fCAnJykpO1xuXHRcdGlmIChhID4gYikgcmV0dXJuIDE7XG5cdFx0aWYgKGIgPiBhKSByZXR1cm4gLTE7XG5cdFx0cmV0dXJuIDA7XG5cdH07XG5cblx0dmFyIGV4dGVuZCA9IGZ1bmN0aW9uKGEsIGIpIHtcblx0XHR2YXIgaSwgbiwgaywgb2JqZWN0O1xuXHRcdGZvciAoaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRvYmplY3QgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIW9iamVjdCkgY29udGludWU7XG5cdFx0XHRmb3IgKGsgaW4gb2JqZWN0KSB7XG5cdFx0XHRcdGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoaykpIHtcblx0XHRcdFx0XHRhW2tdID0gb2JqZWN0W2tdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBhO1xuXHR9O1xuXG5cdHZhciB0cmltID0gZnVuY3Rpb24oc3RyKSB7XG5cdFx0cmV0dXJuIChzdHIgKyAnJykucmVwbGFjZSgvXlxccyt8XFxzKyR8L2csICcnKTtcblx0fTtcblxuXHR2YXIgZXNjYXBlX3JlZ2V4ID0gZnVuY3Rpb24oc3RyKSB7XG5cdFx0cmV0dXJuIChzdHIgKyAnJykucmVwbGFjZSgvKFsuPyorXiRbXFxdXFxcXCgpe318LV0pL2csICdcXFxcJDEnKTtcblx0fTtcblxuXHR2YXIgaXNfYXJyYXkgPSBBcnJheS5pc0FycmF5IHx8ICgkICYmICQuaXNBcnJheSkgfHwgZnVuY3Rpb24ob2JqZWN0KSB7XG5cdFx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09PSAnW29iamVjdCBBcnJheV0nO1xuXHR9O1xuXG5cdHZhciBESUFDUklUSUNTID0ge1xuXHRcdCdhJzogJ1thw4DDgcOCw4PDhMOFw6DDocOiw6PDpMOlxIDEgcSFxIRdJyxcblx0XHQnYyc6ICdbY8OHw6fEh8SGxI3EjF0nLFxuXHRcdCdkJzogJ1tkxJHEkMSPxI5dJyxcblx0XHQnZSc6ICdbZcOIw4nDisOLw6jDqcOqw6vEm8SaxJLEk8SZxJhdJyxcblx0XHQnaSc6ICdbacOMw43DjsOPw6zDrcOuw6/EqsSrXScsXG5cdFx0J2wnOiAnW2zFgsWBXScsXG5cdFx0J24nOiAnW27DkcOxxYjFh8WExYNdJyxcblx0XHQnbyc6ICdbb8OSw5PDlMOVw5XDlsOYw7LDs8O0w7XDtsO4xYzFjV0nLFxuXHRcdCdyJzogJ1tyxZnFmF0nLFxuXHRcdCdzJzogJ1tzxaDFocWbxZpdJyxcblx0XHQndCc6ICdbdMWlxaRdJyxcblx0XHQndSc6ICdbdcOZw5rDm8Ocw7nDusO7w7zFr8WuxarFq10nLFxuXHRcdCd5JzogJ1t5xbjDv8O9w51dJyxcblx0XHQneic6ICdbesW9xb7FvMW7xbrFuV0nXG5cdH07XG5cblx0dmFyIGFzY2lpZm9sZCA9IChmdW5jdGlvbigpIHtcblx0XHR2YXIgaSwgbiwgaywgY2h1bms7XG5cdFx0dmFyIGZvcmVpZ25sZXR0ZXJzID0gJyc7XG5cdFx0dmFyIGxvb2t1cCA9IHt9O1xuXHRcdGZvciAoayBpbiBESUFDUklUSUNTKSB7XG5cdFx0XHRpZiAoRElBQ1JJVElDUy5oYXNPd25Qcm9wZXJ0eShrKSkge1xuXHRcdFx0XHRjaHVuayA9IERJQUNSSVRJQ1Nba10uc3Vic3RyaW5nKDIsIERJQUNSSVRJQ1Nba10ubGVuZ3RoIC0gMSk7XG5cdFx0XHRcdGZvcmVpZ25sZXR0ZXJzICs9IGNodW5rO1xuXHRcdFx0XHRmb3IgKGkgPSAwLCBuID0gY2h1bmsubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdFx0bG9va3VwW2NodW5rLmNoYXJBdChpKV0gPSBrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciByZWdleHAgPSBuZXcgUmVnRXhwKCdbJyArICBmb3JlaWdubGV0dGVycyArICddJywgJ2cnKTtcblx0XHRyZXR1cm4gZnVuY3Rpb24oc3RyKSB7XG5cdFx0XHRyZXR1cm4gc3RyLnJlcGxhY2UocmVnZXhwLCBmdW5jdGlvbihmb3JlaWdubGV0dGVyKSB7XG5cdFx0XHRcdHJldHVybiBsb29rdXBbZm9yZWlnbmxldHRlcl07XG5cdFx0XHR9KS50b0xvd2VyQ2FzZSgpO1xuXHRcdH07XG5cdH0pKCk7XG5cblxuXHQvLyBleHBvcnRcblx0Ly8gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLVxuXG5cdHJldHVybiBTaWZ0ZXI7XG59KSk7XG5cblxuXG4vKipcbiAqIG1pY3JvcGx1Z2luLmpzXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgQnJpYW4gUmVhdmlzICYgY29udHJpYnV0b3JzXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcbiAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG4gKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBhdXRob3IgQnJpYW4gUmVhdmlzIDxicmlhbkB0aGlyZHJvdXRlLmNvbT5cbiAqL1xuXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKCdtaWNyb3BsdWdpbicsIGZhY3RvcnkpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHR9IGVsc2Uge1xuXHRcdHJvb3QuTWljcm9QbHVnaW4gPSBmYWN0b3J5KCk7XG5cdH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG5cdHZhciBNaWNyb1BsdWdpbiA9IHt9O1xuXG5cdE1pY3JvUGx1Z2luLm1peGluID0gZnVuY3Rpb24oSW50ZXJmYWNlKSB7XG5cdFx0SW50ZXJmYWNlLnBsdWdpbnMgPSB7fTtcblxuXHRcdC8qKlxuXHRcdCAqIEluaXRpYWxpemVzIHRoZSBsaXN0ZWQgcGx1Z2lucyAod2l0aCBvcHRpb25zKS5cblx0XHQgKiBBY2NlcHRhYmxlIGZvcm1hdHM6XG5cdFx0ICpcblx0XHQgKiBMaXN0ICh3aXRob3V0IG9wdGlvbnMpOlxuXHRcdCAqICAgWydhJywgJ2InLCAnYyddXG5cdFx0ICpcblx0XHQgKiBMaXN0ICh3aXRoIG9wdGlvbnMpOlxuXHRcdCAqICAgW3snbmFtZSc6ICdhJywgb3B0aW9uczoge319LCB7J25hbWUnOiAnYicsIG9wdGlvbnM6IHt9fV1cblx0XHQgKlxuXHRcdCAqIEhhc2ggKHdpdGggb3B0aW9ucyk6XG5cdFx0ICogICB7J2EnOiB7IC4uLiB9LCAnYic6IHsgLi4uIH0sICdjJzogeyAuLi4gfX1cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IHBsdWdpbnNcblx0XHQgKi9cblx0XHRJbnRlcmZhY2UucHJvdG90eXBlLmluaXRpYWxpemVQbHVnaW5zID0gZnVuY3Rpb24ocGx1Z2lucykge1xuXHRcdFx0dmFyIGksIG4sIGtleTtcblx0XHRcdHZhciBzZWxmICA9IHRoaXM7XG5cdFx0XHR2YXIgcXVldWUgPSBbXTtcblxuXHRcdFx0c2VsZi5wbHVnaW5zID0ge1xuXHRcdFx0XHRuYW1lcyAgICAgOiBbXSxcblx0XHRcdFx0c2V0dGluZ3MgIDoge30sXG5cdFx0XHRcdHJlcXVlc3RlZCA6IHt9LFxuXHRcdFx0XHRsb2FkZWQgICAgOiB7fVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKHV0aWxzLmlzQXJyYXkocGx1Z2lucykpIHtcblx0XHRcdFx0Zm9yIChpID0gMCwgbiA9IHBsdWdpbnMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBwbHVnaW5zW2ldID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0cXVldWUucHVzaChwbHVnaW5zW2ldKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VsZi5wbHVnaW5zLnNldHRpbmdzW3BsdWdpbnNbaV0ubmFtZV0gPSBwbHVnaW5zW2ldLm9wdGlvbnM7XG5cdFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHBsdWdpbnNbaV0ubmFtZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHBsdWdpbnMpIHtcblx0XHRcdFx0Zm9yIChrZXkgaW4gcGx1Z2lucykge1xuXHRcdFx0XHRcdGlmIChwbHVnaW5zLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0XHRcdHNlbGYucGx1Z2lucy5zZXR0aW5nc1trZXldID0gcGx1Z2luc1trZXldO1xuXHRcdFx0XHRcdFx0cXVldWUucHVzaChrZXkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR3aGlsZSAocXVldWUubGVuZ3RoKSB7XG5cdFx0XHRcdHNlbGYucmVxdWlyZShxdWV1ZS5zaGlmdCgpKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0SW50ZXJmYWNlLnByb3RvdHlwZS5sb2FkUGx1Z2luID0gZnVuY3Rpb24obmFtZSkge1xuXHRcdFx0dmFyIHNlbGYgICAgPSB0aGlzO1xuXHRcdFx0dmFyIHBsdWdpbnMgPSBzZWxmLnBsdWdpbnM7XG5cdFx0XHR2YXIgcGx1Z2luICA9IEludGVyZmFjZS5wbHVnaW5zW25hbWVdO1xuXG5cdFx0XHRpZiAoIUludGVyZmFjZS5wbHVnaW5zLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgXCInICsgIG5hbWUgKyAnXCIgcGx1Z2luJyk7XG5cdFx0XHR9XG5cblx0XHRcdHBsdWdpbnMucmVxdWVzdGVkW25hbWVdID0gdHJ1ZTtcblx0XHRcdHBsdWdpbnMubG9hZGVkW25hbWVdID0gcGx1Z2luLmZuLmFwcGx5KHNlbGYsIFtzZWxmLnBsdWdpbnMuc2V0dGluZ3NbbmFtZV0gfHwge31dKTtcblx0XHRcdHBsdWdpbnMubmFtZXMucHVzaChuYW1lKTtcblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogSW5pdGlhbGl6ZXMgYSBwbHVnaW4uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuXHRcdCAqL1xuXHRcdEludGVyZmFjZS5wcm90b3R5cGUucmVxdWlyZSA9IGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHZhciBwbHVnaW5zID0gc2VsZi5wbHVnaW5zO1xuXG5cdFx0XHRpZiAoIXNlbGYucGx1Z2lucy5sb2FkZWQuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcblx0XHRcdFx0aWYgKHBsdWdpbnMucmVxdWVzdGVkW25hbWVdKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQbHVnaW4gaGFzIGNpcmN1bGFyIGRlcGVuZGVuY3kgKFwiJyArIG5hbWUgKyAnXCIpJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2VsZi5sb2FkUGx1Z2luKG5hbWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcGx1Z2lucy5sb2FkZWRbbmFtZV07XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIFJlZ2lzdGVycyBhIHBsdWdpbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG5cdFx0ICogQHBhcmFtIHtmdW5jdGlvbn0gZm5cblx0XHQgKi9cblx0XHRJbnRlcmZhY2UuZGVmaW5lID0gZnVuY3Rpb24obmFtZSwgZm4pIHtcblx0XHRcdEludGVyZmFjZS5wbHVnaW5zW25hbWVdID0ge1xuXHRcdFx0XHQnbmFtZScgOiBuYW1lLFxuXHRcdFx0XHQnZm4nICAgOiBmblxuXHRcdFx0fTtcblx0XHR9O1xuXHR9O1xuXG5cdHZhciB1dGlscyA9IHtcblx0XHRpc0FycmF5OiBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKHZBcmcpIHtcblx0XHRcdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodkFyZykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBNaWNyb1BsdWdpbjtcbn0pKTtcblxuLyoqXG4gKiBzZWxlY3RpemUuanMgKHYwLjEyLjEpXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTPigJMyMDE1IEJyaWFuIFJlYXZpcyAmIGNvbnRyaWJ1dG9yc1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzXG4gKiBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdDpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXJcbiAqIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0ZcbiAqIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZVxuICogZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAYXV0aG9yIEJyaWFuIFJlYXZpcyA8YnJpYW5AdGhpcmRyb3V0ZS5jb20+XG4gKi9cblxuLypqc2hpbnQgY3VybHk6ZmFsc2UgKi9cbi8qanNoaW50IGJyb3dzZXI6dHJ1ZSAqL1xuXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKCdzZWxlY3RpemUnLCBbJ2pxdWVyeScsJ3NpZnRlcicsJ21pY3JvcGx1Z2luJ10sIGZhY3RvcnkpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSwgcmVxdWlyZSgnc2lmdGVyJyksIHJlcXVpcmUoJ21pY3JvcGx1Z2luJykpO1xuXHR9IGVsc2Uge1xuXHRcdHJvb3QuU2VsZWN0aXplID0gZmFjdG9yeShyb290LmpRdWVyeSwgcm9vdC5TaWZ0ZXIsIHJvb3QuTWljcm9QbHVnaW4pO1xuXHR9XG59KHRoaXMsIGZ1bmN0aW9uKCQsIFNpZnRlciwgTWljcm9QbHVnaW4pIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBoaWdobGlnaHQgPSBmdW5jdGlvbigkZWxlbWVudCwgcGF0dGVybikge1xuXHRcdGlmICh0eXBlb2YgcGF0dGVybiA9PT0gJ3N0cmluZycgJiYgIXBhdHRlcm4ubGVuZ3RoKSByZXR1cm47XG5cdFx0dmFyIHJlZ2V4ID0gKHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJykgPyBuZXcgUmVnRXhwKHBhdHRlcm4sICdpJykgOiBwYXR0ZXJuO1xuXHRcblx0XHR2YXIgaGlnaGxpZ2h0ID0gZnVuY3Rpb24obm9kZSkge1xuXHRcdFx0dmFyIHNraXAgPSAwO1xuXHRcdFx0aWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcblx0XHRcdFx0dmFyIHBvcyA9IG5vZGUuZGF0YS5zZWFyY2gocmVnZXgpO1xuXHRcdFx0XHRpZiAocG9zID49IDAgJiYgbm9kZS5kYXRhLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHR2YXIgbWF0Y2ggPSBub2RlLmRhdGEubWF0Y2gocmVnZXgpO1xuXHRcdFx0XHRcdHZhciBzcGFubm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHRcdFx0XHRzcGFubm9kZS5jbGFzc05hbWUgPSAnaGlnaGxpZ2h0Jztcblx0XHRcdFx0XHR2YXIgbWlkZGxlYml0ID0gbm9kZS5zcGxpdFRleHQocG9zKTtcblx0XHRcdFx0XHR2YXIgZW5kYml0ID0gbWlkZGxlYml0LnNwbGl0VGV4dChtYXRjaFswXS5sZW5ndGgpO1xuXHRcdFx0XHRcdHZhciBtaWRkbGVjbG9uZSA9IG1pZGRsZWJpdC5jbG9uZU5vZGUodHJ1ZSk7XG5cdFx0XHRcdFx0c3Bhbm5vZGUuYXBwZW5kQ2hpbGQobWlkZGxlY2xvbmUpO1xuXHRcdFx0XHRcdG1pZGRsZWJpdC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChzcGFubm9kZSwgbWlkZGxlYml0KTtcblx0XHRcdFx0XHRza2lwID0gMTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAxICYmIG5vZGUuY2hpbGROb2RlcyAmJiAhLyhzY3JpcHR8c3R5bGUpL2kudGVzdChub2RlLnRhZ05hbWUpKSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdFx0aSArPSBoaWdobGlnaHQobm9kZS5jaGlsZE5vZGVzW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHNraXA7XG5cdFx0fTtcblx0XG5cdFx0cmV0dXJuICRlbGVtZW50LmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRoaWdobGlnaHQodGhpcyk7XG5cdFx0fSk7XG5cdH07XG5cdFxuXHR2YXIgTWljcm9FdmVudCA9IGZ1bmN0aW9uKCkge307XG5cdE1pY3JvRXZlbnQucHJvdG90eXBlID0ge1xuXHRcdG9uOiBmdW5jdGlvbihldmVudCwgZmN0KXtcblx0XHRcdHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcblx0XHRcdHRoaXMuX2V2ZW50c1tldmVudF0gPSB0aGlzLl9ldmVudHNbZXZlbnRdIHx8IFtdO1xuXHRcdFx0dGhpcy5fZXZlbnRzW2V2ZW50XS5wdXNoKGZjdCk7XG5cdFx0fSxcblx0XHRvZmY6IGZ1bmN0aW9uKGV2ZW50LCBmY3Qpe1xuXHRcdFx0dmFyIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXHRcdFx0aWYgKG4gPT09IDApIHJldHVybiBkZWxldGUgdGhpcy5fZXZlbnRzO1xuXHRcdFx0aWYgKG4gPT09IDEpIHJldHVybiBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50XTtcblx0XG5cdFx0XHR0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG5cdFx0XHRpZiAoZXZlbnQgaW4gdGhpcy5fZXZlbnRzID09PSBmYWxzZSkgcmV0dXJuO1xuXHRcdFx0dGhpcy5fZXZlbnRzW2V2ZW50XS5zcGxpY2UodGhpcy5fZXZlbnRzW2V2ZW50XS5pbmRleE9mKGZjdCksIDEpO1xuXHRcdH0sXG5cdFx0dHJpZ2dlcjogZnVuY3Rpb24oZXZlbnQgLyogLCBhcmdzLi4uICovKXtcblx0XHRcdHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcblx0XHRcdGlmIChldmVudCBpbiB0aGlzLl9ldmVudHMgPT09IGZhbHNlKSByZXR1cm47XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2V2ZW50c1tldmVudF0ubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHR0aGlzLl9ldmVudHNbZXZlbnRdW2ldLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0XG5cdC8qKlxuXHQgKiBNaXhpbiB3aWxsIGRlbGVnYXRlIGFsbCBNaWNyb0V2ZW50LmpzIGZ1bmN0aW9uIGluIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG5cdCAqXG5cdCAqIC0gTWljcm9FdmVudC5taXhpbihGb29iYXIpIHdpbGwgbWFrZSBGb29iYXIgYWJsZSB0byB1c2UgTWljcm9FdmVudFxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gdGhlIG9iamVjdCB3aGljaCB3aWxsIHN1cHBvcnQgTWljcm9FdmVudFxuXHQgKi9cblx0TWljcm9FdmVudC5taXhpbiA9IGZ1bmN0aW9uKGRlc3RPYmplY3Qpe1xuXHRcdHZhciBwcm9wcyA9IFsnb24nLCAnb2ZmJywgJ3RyaWdnZXInXTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKXtcblx0XHRcdGRlc3RPYmplY3QucHJvdG90eXBlW3Byb3BzW2ldXSA9IE1pY3JvRXZlbnQucHJvdG90eXBlW3Byb3BzW2ldXTtcblx0XHR9XG5cdH07XG5cdFxuXHR2YXIgSVNfTUFDICAgICAgICA9IC9NYWMvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cdFxuXHR2YXIgS0VZX0EgICAgICAgICA9IDY1O1xuXHR2YXIgS0VZX0NPTU1BICAgICA9IDE4ODtcblx0dmFyIEtFWV9SRVRVUk4gICAgPSAxMztcblx0dmFyIEtFWV9FU0MgICAgICAgPSAyNztcblx0dmFyIEtFWV9MRUZUICAgICAgPSAzNztcblx0dmFyIEtFWV9VUCAgICAgICAgPSAzODtcblx0dmFyIEtFWV9QICAgICAgICAgPSA4MDtcblx0dmFyIEtFWV9SSUdIVCAgICAgPSAzOTtcblx0dmFyIEtFWV9ET1dOICAgICAgPSA0MDtcblx0dmFyIEtFWV9OICAgICAgICAgPSA3ODtcblx0dmFyIEtFWV9CQUNLU1BBQ0UgPSA4O1xuXHR2YXIgS0VZX0RFTEVURSAgICA9IDQ2O1xuXHR2YXIgS0VZX1NISUZUICAgICA9IDE2O1xuXHR2YXIgS0VZX0NNRCAgICAgICA9IElTX01BQyA/IDkxIDogMTc7XG5cdHZhciBLRVlfQ1RSTCAgICAgID0gSVNfTUFDID8gMTggOiAxNztcblx0dmFyIEtFWV9UQUIgICAgICAgPSA5O1xuXHRcblx0dmFyIFRBR19TRUxFQ1QgICAgPSAxO1xuXHR2YXIgVEFHX0lOUFVUICAgICA9IDI7XG5cdFxuXHQvLyBmb3Igbm93LCBhbmRyb2lkIHN1cHBvcnQgaW4gZ2VuZXJhbCBpcyB0b28gc3BvdHR5IHRvIHN1cHBvcnQgdmFsaWRpdHlcblx0dmFyIFNVUFBPUlRTX1ZBTElESVRZX0FQSSA9ICEvYW5kcm9pZC9pLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpICYmICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpLnZhbGlkaXR5O1xuXHRcblx0dmFyIGlzc2V0ID0gZnVuY3Rpb24ob2JqZWN0KSB7XG5cdFx0cmV0dXJuIHR5cGVvZiBvYmplY3QgIT09ICd1bmRlZmluZWQnO1xuXHR9O1xuXHRcblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgc2NhbGFyIHRvIGl0cyBiZXN0IHN0cmluZyByZXByZXNlbnRhdGlvblxuXHQgKiBmb3IgaGFzaCBrZXlzIGFuZCBIVE1MIGF0dHJpYnV0ZSB2YWx1ZXMuXG5cdCAqXG5cdCAqIFRyYW5zZm9ybWF0aW9uczpcblx0ICogICAnc3RyJyAgICAgLT4gJ3N0cidcblx0ICogICBudWxsICAgICAgLT4gJydcblx0ICogICB1bmRlZmluZWQgLT4gJydcblx0ICogICB0cnVlICAgICAgLT4gJzEnXG5cdCAqICAgZmFsc2UgICAgIC0+ICcwJ1xuXHQgKiAgIDAgICAgICAgICAtPiAnMCdcblx0ICogICAxICAgICAgICAgLT4gJzEnXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfG51bGx9XG5cdCAqL1xuXHR2YXIgaGFzaF9rZXkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHZhbHVlID09PSBudWxsKSByZXR1cm4gbnVsbDtcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHJldHVybiB2YWx1ZSA/ICcxJyA6ICcwJztcblx0XHRyZXR1cm4gdmFsdWUgKyAnJztcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBFc2NhcGVzIGEgc3RyaW5nIGZvciB1c2Ugd2l0aGluIEhUTUwuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcblx0ICogQHJldHVybnMge3N0cmluZ31cblx0ICovXG5cdHZhciBlc2NhcGVfaHRtbCA9IGZ1bmN0aW9uKHN0cikge1xuXHRcdHJldHVybiAoc3RyICsgJycpXG5cdFx0XHQucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuXHRcdFx0LnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuXHRcdFx0LnJlcGxhY2UoLz4vZywgJyZndDsnKVxuXHRcdFx0LnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBFc2NhcGVzIFwiJFwiIGNoYXJhY3RlcnMgaW4gcmVwbGFjZW1lbnQgc3RyaW5ncy5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0clxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHQgKi9cblx0dmFyIGVzY2FwZV9yZXBsYWNlID0gZnVuY3Rpb24oc3RyKSB7XG5cdFx0cmV0dXJuIChzdHIgKyAnJykucmVwbGFjZSgvXFwkL2csICckJCQkJyk7XG5cdH07XG5cdFxuXHR2YXIgaG9vayA9IHt9O1xuXHRcblx0LyoqXG5cdCAqIFdyYXBzIGBtZXRob2RgIG9uIGBzZWxmYCBzbyB0aGF0IGBmbmBcblx0ICogaXMgaW52b2tlZCBiZWZvcmUgdGhlIG9yaWdpbmFsIG1ldGhvZC5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IHNlbGZcblx0ICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZFxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmblxuXHQgKi9cblx0aG9vay5iZWZvcmUgPSBmdW5jdGlvbihzZWxmLCBtZXRob2QsIGZuKSB7XG5cdFx0dmFyIG9yaWdpbmFsID0gc2VsZlttZXRob2RdO1xuXHRcdHNlbGZbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Zm4uYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcblx0XHRcdHJldHVybiBvcmlnaW5hbC5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXHRcdH07XG5cdH07XG5cdFxuXHQvKipcblx0ICogV3JhcHMgYG1ldGhvZGAgb24gYHNlbGZgIHNvIHRoYXQgYGZuYFxuXHQgKiBpcyBpbnZva2VkIGFmdGVyIHRoZSBvcmlnaW5hbCBtZXRob2QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBzZWxmXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2Rcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gZm5cblx0ICovXG5cdGhvb2suYWZ0ZXIgPSBmdW5jdGlvbihzZWxmLCBtZXRob2QsIGZuKSB7XG5cdFx0dmFyIG9yaWdpbmFsID0gc2VsZlttZXRob2RdO1xuXHRcdHNlbGZbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHJlc3VsdCA9IG9yaWdpbmFsLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG5cdFx0XHRmbi5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHR9O1xuXHRcblx0LyoqXG5cdCAqIFdyYXBzIGBmbmAgc28gdGhhdCBpdCBjYW4gb25seSBiZSBpbnZva2VkIG9uY2UuXG5cdCAqXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuXG5cdCAqIEByZXR1cm5zIHtmdW5jdGlvbn1cblx0ICovXG5cdHZhciBvbmNlID0gZnVuY3Rpb24oZm4pIHtcblx0XHR2YXIgY2FsbGVkID0gZmFsc2U7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKGNhbGxlZCkgcmV0dXJuO1xuXHRcdFx0Y2FsbGVkID0gdHJ1ZTtcblx0XHRcdGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fTtcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBXcmFwcyBgZm5gIHNvIHRoYXQgaXQgY2FuIG9ubHkgYmUgY2FsbGVkIG9uY2Vcblx0ICogZXZlcnkgYGRlbGF5YCBtaWxsaXNlY29uZHMgKGludm9rZWQgb24gdGhlIGZhbGxpbmcgZWRnZSkuXG5cdCAqXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuXG5cdCAqIEBwYXJhbSB7aW50fSBkZWxheVxuXHQgKiBAcmV0dXJucyB7ZnVuY3Rpb259XG5cdCAqL1xuXHR2YXIgZGVib3VuY2UgPSBmdW5jdGlvbihmbiwgZGVsYXkpIHtcblx0XHR2YXIgdGltZW91dDtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cztcblx0XHRcdHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0XHR0aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuXHRcdFx0fSwgZGVsYXkpO1xuXHRcdH07XG5cdH07XG5cdFxuXHQvKipcblx0ICogRGVib3VuY2UgYWxsIGZpcmVkIGV2ZW50cyB0eXBlcyBsaXN0ZWQgaW4gYHR5cGVzYFxuXHQgKiB3aGlsZSBleGVjdXRpbmcgdGhlIHByb3ZpZGVkIGBmbmAuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBzZWxmXG5cdCAqIEBwYXJhbSB7YXJyYXl9IHR5cGVzXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuXG5cdCAqL1xuXHR2YXIgZGVib3VuY2VfZXZlbnRzID0gZnVuY3Rpb24oc2VsZiwgdHlwZXMsIGZuKSB7XG5cdFx0dmFyIHR5cGU7XG5cdFx0dmFyIHRyaWdnZXIgPSBzZWxmLnRyaWdnZXI7XG5cdFx0dmFyIGV2ZW50X2FyZ3MgPSB7fTtcblx0XG5cdFx0Ly8gb3ZlcnJpZGUgdHJpZ2dlciBtZXRob2Rcblx0XHRzZWxmLnRyaWdnZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0eXBlID0gYXJndW1lbnRzWzBdO1xuXHRcdFx0aWYgKHR5cGVzLmluZGV4T2YodHlwZSkgIT09IC0xKSB7XG5cdFx0XHRcdGV2ZW50X2FyZ3NbdHlwZV0gPSBhcmd1bWVudHM7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdHJpZ2dlci5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFxuXHRcdC8vIGludm9rZSBwcm92aWRlZCBmdW5jdGlvblxuXHRcdGZuLmFwcGx5KHNlbGYsIFtdKTtcblx0XHRzZWxmLnRyaWdnZXIgPSB0cmlnZ2VyO1xuXHRcblx0XHQvLyB0cmlnZ2VyIHF1ZXVlZCBldmVudHNcblx0XHRmb3IgKHR5cGUgaW4gZXZlbnRfYXJncykge1xuXHRcdFx0aWYgKGV2ZW50X2FyZ3MuaGFzT3duUHJvcGVydHkodHlwZSkpIHtcblx0XHRcdFx0dHJpZ2dlci5hcHBseShzZWxmLCBldmVudF9hcmdzW3R5cGVdKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdFxuXHQvKipcblx0ICogQSB3b3JrYXJvdW5kIGZvciBodHRwOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC82Njk2XG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkcGFyZW50IC0gUGFyZW50IGVsZW1lbnQgdG8gbGlzdGVuIG9uLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgLSBFdmVudCBuYW1lLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBEZXNjZW5kYW50IHNlbGVjdG9yIHRvIGZpbHRlciBieS5cblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSBFdmVudCBoYW5kbGVyLlxuXHQgKi9cblx0dmFyIHdhdGNoQ2hpbGRFdmVudCA9IGZ1bmN0aW9uKCRwYXJlbnQsIGV2ZW50LCBzZWxlY3RvciwgZm4pIHtcblx0XHQkcGFyZW50Lm9uKGV2ZW50LCBzZWxlY3RvciwgZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIGNoaWxkID0gZS50YXJnZXQ7XG5cdFx0XHR3aGlsZSAoY2hpbGQgJiYgY2hpbGQucGFyZW50Tm9kZSAhPT0gJHBhcmVudFswXSkge1xuXHRcdFx0XHRjaGlsZCA9IGNoaWxkLnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cdFx0XHRlLmN1cnJlbnRUYXJnZXQgPSBjaGlsZDtcblx0XHRcdHJldHVybiBmbi5hcHBseSh0aGlzLCBbZV0pO1xuXHRcdH0pO1xuXHR9O1xuXHRcblx0LyoqXG5cdCAqIERldGVybWluZXMgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIHdpdGhpbiBhIHRleHQgaW5wdXQgY29udHJvbC5cblx0ICogUmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZzpcblx0ICogICAtIHN0YXJ0XG5cdCAqICAgLSBsZW5ndGhcblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IGlucHV0XG5cdCAqIEByZXR1cm5zIHtvYmplY3R9XG5cdCAqL1xuXHR2YXIgZ2V0U2VsZWN0aW9uID0gZnVuY3Rpb24oaW5wdXQpIHtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0aWYgKCdzZWxlY3Rpb25TdGFydCcgaW4gaW5wdXQpIHtcblx0XHRcdHJlc3VsdC5zdGFydCA9IGlucHV0LnNlbGVjdGlvblN0YXJ0O1xuXHRcdFx0cmVzdWx0Lmxlbmd0aCA9IGlucHV0LnNlbGVjdGlvbkVuZCAtIHJlc3VsdC5zdGFydDtcblx0XHR9IGVsc2UgaWYgKGRvY3VtZW50LnNlbGVjdGlvbikge1xuXHRcdFx0aW5wdXQuZm9jdXMoKTtcblx0XHRcdHZhciBzZWwgPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcblx0XHRcdHZhciBzZWxMZW4gPSBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKS50ZXh0Lmxlbmd0aDtcblx0XHRcdHNlbC5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIC1pbnB1dC52YWx1ZS5sZW5ndGgpO1xuXHRcdFx0cmVzdWx0LnN0YXJ0ID0gc2VsLnRleHQubGVuZ3RoIC0gc2VsTGVuO1xuXHRcdFx0cmVzdWx0Lmxlbmd0aCA9IHNlbExlbjtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBDb3BpZXMgQ1NTIHByb3BlcnRpZXMgZnJvbSBvbmUgZWxlbWVudCB0byBhbm90aGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gJGZyb21cblx0ICogQHBhcmFtIHtvYmplY3R9ICR0b1xuXHQgKiBAcGFyYW0ge2FycmF5fSBwcm9wZXJ0aWVzXG5cdCAqL1xuXHR2YXIgdHJhbnNmZXJTdHlsZXMgPSBmdW5jdGlvbigkZnJvbSwgJHRvLCBwcm9wZXJ0aWVzKSB7XG5cdFx0dmFyIGksIG4sIHN0eWxlcyA9IHt9O1xuXHRcdGlmIChwcm9wZXJ0aWVzKSB7XG5cdFx0XHRmb3IgKGkgPSAwLCBuID0gcHJvcGVydGllcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0c3R5bGVzW3Byb3BlcnRpZXNbaV1dID0gJGZyb20uY3NzKHByb3BlcnRpZXNbaV0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZXMgPSAkZnJvbS5jc3MoKTtcblx0XHR9XG5cdFx0JHRvLmNzcyhzdHlsZXMpO1xuXHR9O1xuXHRcblx0LyoqXG5cdCAqIE1lYXN1cmVzIHRoZSB3aWR0aCBvZiBhIHN0cmluZyB3aXRoaW4gYVxuXHQgKiBwYXJlbnQgZWxlbWVudCAoaW4gcGl4ZWxzKS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHN0clxuXHQgKiBAcGFyYW0ge29iamVjdH0gJHBhcmVudFxuXHQgKiBAcmV0dXJucyB7aW50fVxuXHQgKi9cblx0dmFyIG1lYXN1cmVTdHJpbmcgPSBmdW5jdGlvbihzdHIsICRwYXJlbnQpIHtcblx0XHRpZiAoIXN0cikge1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXHRcblx0XHR2YXIgJHRlc3QgPSAkKCc8dGVzdD4nKS5jc3Moe1xuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0XHR0b3A6IC05OTk5OSxcblx0XHRcdGxlZnQ6IC05OTk5OSxcblx0XHRcdHdpZHRoOiAnYXV0bycsXG5cdFx0XHRwYWRkaW5nOiAwLFxuXHRcdFx0d2hpdGVTcGFjZTogJ3ByZSdcblx0XHR9KS50ZXh0KHN0cikuYXBwZW5kVG8oJ2JvZHknKTtcblx0XG5cdFx0dHJhbnNmZXJTdHlsZXMoJHBhcmVudCwgJHRlc3QsIFtcblx0XHRcdCdsZXR0ZXJTcGFjaW5nJyxcblx0XHRcdCdmb250U2l6ZScsXG5cdFx0XHQnZm9udEZhbWlseScsXG5cdFx0XHQnZm9udFdlaWdodCcsXG5cdFx0XHQndGV4dFRyYW5zZm9ybSdcblx0XHRdKTtcblx0XG5cdFx0dmFyIHdpZHRoID0gJHRlc3Qud2lkdGgoKTtcblx0XHQkdGVzdC5yZW1vdmUoKTtcblx0XG5cdFx0cmV0dXJuIHdpZHRoO1xuXHR9O1xuXHRcblx0LyoqXG5cdCAqIFNldHMgdXAgYW4gaW5wdXQgdG8gZ3JvdyBob3Jpem9udGFsbHkgYXMgdGhlIHVzZXJcblx0ICogdHlwZXMuIElmIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkIG1hbnVhbGx5LCB5b3UgY2FuXG5cdCAqIHRyaWdnZXIgdGhlIFwidXBkYXRlXCIgaGFuZGxlciB0byByZXNpemU6XG5cdCAqXG5cdCAqICRpbnB1dC50cmlnZ2VyKCd1cGRhdGUnKTtcblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9ICRpbnB1dFxuXHQgKi9cblx0dmFyIGF1dG9Hcm93ID0gZnVuY3Rpb24oJGlucHV0KSB7XG5cdFx0dmFyIGN1cnJlbnRXaWR0aCA9IG51bGw7XG5cdFxuXHRcdHZhciB1cGRhdGUgPSBmdW5jdGlvbihlLCBvcHRpb25zKSB7XG5cdFx0XHR2YXIgdmFsdWUsIGtleUNvZGUsIHByaW50YWJsZSwgcGxhY2Vob2xkZXIsIHdpZHRoO1xuXHRcdFx0dmFyIHNoaWZ0LCBjaGFyYWN0ZXIsIHNlbGVjdGlvbjtcblx0XHRcdGUgPSBlIHx8IHdpbmRvdy5ldmVudCB8fCB7fTtcblx0XHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcblx0XHRcdGlmIChlLm1ldGFLZXkgfHwgZS5hbHRLZXkpIHJldHVybjtcblx0XHRcdGlmICghb3B0aW9ucy5mb3JjZSAmJiAkaW5wdXQuZGF0YSgnZ3JvdycpID09PSBmYWxzZSkgcmV0dXJuO1xuXHRcblx0XHRcdHZhbHVlID0gJGlucHV0LnZhbCgpO1xuXHRcdFx0aWYgKGUudHlwZSAmJiBlLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ2tleWRvd24nKSB7XG5cdFx0XHRcdGtleUNvZGUgPSBlLmtleUNvZGU7XG5cdFx0XHRcdHByaW50YWJsZSA9IChcblx0XHRcdFx0XHQoa2V5Q29kZSA+PSA5NyAmJiBrZXlDb2RlIDw9IDEyMikgfHwgLy8gYS16XG5cdFx0XHRcdFx0KGtleUNvZGUgPj0gNjUgJiYga2V5Q29kZSA8PSA5MCkgIHx8IC8vIEEtWlxuXHRcdFx0XHRcdChrZXlDb2RlID49IDQ4ICYmIGtleUNvZGUgPD0gNTcpICB8fCAvLyAwLTlcblx0XHRcdFx0XHRrZXlDb2RlID09PSAzMiAvLyBzcGFjZVxuXHRcdFx0XHQpO1xuXHRcblx0XHRcdFx0aWYgKGtleUNvZGUgPT09IEtFWV9ERUxFVEUgfHwga2V5Q29kZSA9PT0gS0VZX0JBQ0tTUEFDRSkge1xuXHRcdFx0XHRcdHNlbGVjdGlvbiA9IGdldFNlbGVjdGlvbigkaW5wdXRbMF0pO1xuXHRcdFx0XHRcdGlmIChzZWxlY3Rpb24ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnN1YnN0cmluZygwLCBzZWxlY3Rpb24uc3RhcnQpICsgdmFsdWUuc3Vic3RyaW5nKHNlbGVjdGlvbi5zdGFydCArIHNlbGVjdGlvbi5sZW5ndGgpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gS0VZX0JBQ0tTUEFDRSAmJiBzZWxlY3Rpb24uc3RhcnQpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDAsIHNlbGVjdGlvbi5zdGFydCAtIDEpICsgdmFsdWUuc3Vic3RyaW5nKHNlbGVjdGlvbi5zdGFydCArIDEpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gS0VZX0RFTEVURSAmJiB0eXBlb2Ygc2VsZWN0aW9uLnN0YXJ0ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgc2VsZWN0aW9uLnN0YXJ0KSArIHZhbHVlLnN1YnN0cmluZyhzZWxlY3Rpb24uc3RhcnQgKyAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAocHJpbnRhYmxlKSB7XG5cdFx0XHRcdFx0c2hpZnQgPSBlLnNoaWZ0S2V5O1xuXHRcdFx0XHRcdGNoYXJhY3RlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKTtcblx0XHRcdFx0XHRpZiAoc2hpZnQpIGNoYXJhY3RlciA9IGNoYXJhY3Rlci50b1VwcGVyQ2FzZSgpO1xuXHRcdFx0XHRcdGVsc2UgY2hhcmFjdGVyID0gY2hhcmFjdGVyLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0dmFsdWUgKz0gY2hhcmFjdGVyO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFxuXHRcdFx0cGxhY2Vob2xkZXIgPSAkaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKTtcblx0XHRcdGlmICghdmFsdWUgJiYgcGxhY2Vob2xkZXIpIHtcblx0XHRcdFx0dmFsdWUgPSBwbGFjZWhvbGRlcjtcblx0XHRcdH1cblx0XG5cdFx0XHR3aWR0aCA9IG1lYXN1cmVTdHJpbmcodmFsdWUsICRpbnB1dCkgKyA0O1xuXHRcdFx0aWYgKHdpZHRoICE9PSBjdXJyZW50V2lkdGgpIHtcblx0XHRcdFx0Y3VycmVudFdpZHRoID0gd2lkdGg7XG5cdFx0XHRcdCRpbnB1dC53aWR0aCh3aWR0aCk7XG5cdFx0XHRcdCRpbnB1dC50cmlnZ2VySGFuZGxlcigncmVzaXplJyk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XG5cdFx0JGlucHV0Lm9uKCdrZXlkb3duIGtleXVwIHVwZGF0ZSBibHVyJywgdXBkYXRlKTtcblx0XHR1cGRhdGUoKTtcblx0fTtcblx0XG5cdHZhciBTZWxlY3RpemUgPSBmdW5jdGlvbigkaW5wdXQsIHNldHRpbmdzKSB7XG5cdFx0dmFyIGtleSwgaSwgbiwgZGlyLCBpbnB1dCwgc2VsZiA9IHRoaXM7XG5cdFx0aW5wdXQgPSAkaW5wdXRbMF07XG5cdFx0aW5wdXQuc2VsZWN0aXplID0gc2VsZjtcblx0XG5cdFx0Ly8gZGV0ZWN0IHJ0bCBlbnZpcm9ubWVudFxuXHRcdHZhciBjb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgJiYgd2luZG93LmdldENvbXB1dGVkU3R5bGUoaW5wdXQsIG51bGwpO1xuXHRcdGRpciA9IGNvbXB1dGVkU3R5bGUgPyBjb21wdXRlZFN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2RpcmVjdGlvbicpIDogaW5wdXQuY3VycmVudFN0eWxlICYmIGlucHV0LmN1cnJlbnRTdHlsZS5kaXJlY3Rpb247XG5cdFx0ZGlyID0gZGlyIHx8ICRpbnB1dC5wYXJlbnRzKCdbZGlyXTpmaXJzdCcpLmF0dHIoJ2RpcicpIHx8ICcnO1xuXHRcblx0XHQvLyBzZXR1cCBkZWZhdWx0IHN0YXRlXG5cdFx0JC5leHRlbmQoc2VsZiwge1xuXHRcdFx0b3JkZXIgICAgICAgICAgICA6IDAsXG5cdFx0XHRzZXR0aW5ncyAgICAgICAgIDogc2V0dGluZ3MsXG5cdFx0XHQkaW5wdXQgICAgICAgICAgIDogJGlucHV0LFxuXHRcdFx0dGFiSW5kZXggICAgICAgICA6ICRpbnB1dC5hdHRyKCd0YWJpbmRleCcpIHx8ICcnLFxuXHRcdFx0dGFnVHlwZSAgICAgICAgICA6IGlucHV0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCcgPyBUQUdfU0VMRUNUIDogVEFHX0lOUFVULFxuXHRcdFx0cnRsICAgICAgICAgICAgICA6IC9ydGwvaS50ZXN0KGRpciksXG5cdFxuXHRcdFx0ZXZlbnROUyAgICAgICAgICA6ICcuc2VsZWN0aXplJyArICgrK1NlbGVjdGl6ZS5jb3VudCksXG5cdFx0XHRoaWdobGlnaHRlZFZhbHVlIDogbnVsbCxcblx0XHRcdGlzT3BlbiAgICAgICAgICAgOiBmYWxzZSxcblx0XHRcdGlzRGlzYWJsZWQgICAgICAgOiBmYWxzZSxcblx0XHRcdGlzUmVxdWlyZWQgICAgICAgOiAkaW5wdXQuaXMoJ1tyZXF1aXJlZF0nKSxcblx0XHRcdGlzSW52YWxpZCAgICAgICAgOiBmYWxzZSxcblx0XHRcdGlzTG9ja2VkICAgICAgICAgOiBmYWxzZSxcblx0XHRcdGlzRm9jdXNlZCAgICAgICAgOiBmYWxzZSxcblx0XHRcdGlzSW5wdXRIaWRkZW4gICAgOiBmYWxzZSxcblx0XHRcdGlzU2V0dXAgICAgICAgICAgOiBmYWxzZSxcblx0XHRcdGlzU2hpZnREb3duICAgICAgOiBmYWxzZSxcblx0XHRcdGlzQ21kRG93biAgICAgICAgOiBmYWxzZSxcblx0XHRcdGlzQ3RybERvd24gICAgICAgOiBmYWxzZSxcblx0XHRcdGlnbm9yZUZvY3VzICAgICAgOiBmYWxzZSxcblx0XHRcdGlnbm9yZUJsdXIgICAgICAgOiBmYWxzZSxcblx0XHRcdGlnbm9yZUhvdmVyICAgICAgOiBmYWxzZSxcblx0XHRcdGhhc09wdGlvbnMgICAgICAgOiBmYWxzZSxcblx0XHRcdGN1cnJlbnRSZXN1bHRzICAgOiBudWxsLFxuXHRcdFx0bGFzdFZhbHVlICAgICAgICA6ICcnLFxuXHRcdFx0Y2FyZXRQb3MgICAgICAgICA6IDAsXG5cdFx0XHRsb2FkaW5nICAgICAgICAgIDogMCxcblx0XHRcdGxvYWRlZFNlYXJjaGVzICAgOiB7fSxcblx0XG5cdFx0XHQkYWN0aXZlT3B0aW9uICAgIDogbnVsbCxcblx0XHRcdCRhY3RpdmVJdGVtcyAgICAgOiBbXSxcblx0XG5cdFx0XHRvcHRncm91cHMgICAgICAgIDoge30sXG5cdFx0XHRvcHRpb25zICAgICAgICAgIDoge30sXG5cdFx0XHR1c2VyT3B0aW9ucyAgICAgIDoge30sXG5cdFx0XHRpdGVtcyAgICAgICAgICAgIDogW10sXG5cdFx0XHRyZW5kZXJDYWNoZSAgICAgIDoge30sXG5cdFx0XHRvblNlYXJjaENoYW5nZSAgIDogc2V0dGluZ3MubG9hZFRocm90dGxlID09PSBudWxsID8gc2VsZi5vblNlYXJjaENoYW5nZSA6IGRlYm91bmNlKHNlbGYub25TZWFyY2hDaGFuZ2UsIHNldHRpbmdzLmxvYWRUaHJvdHRsZSlcblx0XHR9KTtcblx0XG5cdFx0Ly8gc2VhcmNoIHN5c3RlbVxuXHRcdHNlbGYuc2lmdGVyID0gbmV3IFNpZnRlcih0aGlzLm9wdGlvbnMsIHtkaWFjcml0aWNzOiBzZXR0aW5ncy5kaWFjcml0aWNzfSk7XG5cdFxuXHRcdC8vIGJ1aWxkIG9wdGlvbnMgdGFibGVcblx0XHRpZiAoc2VsZi5zZXR0aW5ncy5vcHRpb25zKSB7XG5cdFx0XHRmb3IgKGkgPSAwLCBuID0gc2VsZi5zZXR0aW5ncy5vcHRpb25zLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRzZWxmLnJlZ2lzdGVyT3B0aW9uKHNlbGYuc2V0dGluZ3Mub3B0aW9uc1tpXSk7XG5cdFx0XHR9XG5cdFx0XHRkZWxldGUgc2VsZi5zZXR0aW5ncy5vcHRpb25zO1xuXHRcdH1cblx0XG5cdFx0Ly8gYnVpbGQgb3B0Z3JvdXAgdGFibGVcblx0XHRpZiAoc2VsZi5zZXR0aW5ncy5vcHRncm91cHMpIHtcblx0XHRcdGZvciAoaSA9IDAsIG4gPSBzZWxmLnNldHRpbmdzLm9wdGdyb3Vwcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0c2VsZi5yZWdpc3Rlck9wdGlvbkdyb3VwKHNlbGYuc2V0dGluZ3Mub3B0Z3JvdXBzW2ldKTtcblx0XHRcdH1cblx0XHRcdGRlbGV0ZSBzZWxmLnNldHRpbmdzLm9wdGdyb3Vwcztcblx0XHR9XG5cdFxuXHRcdC8vIG9wdGlvbi1kZXBlbmRlbnQgZGVmYXVsdHNcblx0XHRzZWxmLnNldHRpbmdzLm1vZGUgPSBzZWxmLnNldHRpbmdzLm1vZGUgfHwgKHNlbGYuc2V0dGluZ3MubWF4SXRlbXMgPT09IDEgPyAnc2luZ2xlJyA6ICdtdWx0aScpO1xuXHRcdGlmICh0eXBlb2Ygc2VsZi5zZXR0aW5ncy5oaWRlU2VsZWN0ZWQgIT09ICdib29sZWFuJykge1xuXHRcdFx0c2VsZi5zZXR0aW5ncy5oaWRlU2VsZWN0ZWQgPSBzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdtdWx0aSc7XG5cdFx0fVxuXHRcblx0XHRzZWxmLmluaXRpYWxpemVQbHVnaW5zKHNlbGYuc2V0dGluZ3MucGx1Z2lucyk7XG5cdFx0c2VsZi5zZXR1cENhbGxiYWNrcygpO1xuXHRcdHNlbGYuc2V0dXBUZW1wbGF0ZXMoKTtcblx0XHRzZWxmLnNldHVwKCk7XG5cdH07XG5cdFxuXHQvLyBtaXhpbnNcblx0Ly8gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC1cblx0XG5cdE1pY3JvRXZlbnQubWl4aW4oU2VsZWN0aXplKTtcblx0TWljcm9QbHVnaW4ubWl4aW4oU2VsZWN0aXplKTtcblx0XG5cdC8vIG1ldGhvZHNcblx0Ly8gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC1cblx0XG5cdCQuZXh0ZW5kKFNlbGVjdGl6ZS5wcm90b3R5cGUsIHtcblx0XG5cdFx0LyoqXG5cdFx0ICogQ3JlYXRlcyBhbGwgZWxlbWVudHMgYW5kIHNldHMgdXAgZXZlbnQgYmluZGluZ3MuXG5cdFx0ICovXG5cdFx0c2V0dXA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgICAgICA9IHRoaXM7XG5cdFx0XHR2YXIgc2V0dGluZ3MgID0gc2VsZi5zZXR0aW5ncztcblx0XHRcdHZhciBldmVudE5TICAgPSBzZWxmLmV2ZW50TlM7XG5cdFx0XHR2YXIgJHdpbmRvdyAgID0gJCh3aW5kb3cpO1xuXHRcdFx0dmFyICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpO1xuXHRcdFx0dmFyICRpbnB1dCAgICA9IHNlbGYuJGlucHV0O1xuXHRcblx0XHRcdHZhciAkd3JhcHBlcjtcblx0XHRcdHZhciAkY29udHJvbDtcblx0XHRcdHZhciAkY29udHJvbF9pbnB1dDtcblx0XHRcdHZhciAkZHJvcGRvd247XG5cdFx0XHR2YXIgJGRyb3Bkb3duX2NvbnRlbnQ7XG5cdFx0XHR2YXIgJGRyb3Bkb3duX3BhcmVudDtcblx0XHRcdHZhciBpbnB1dE1vZGU7XG5cdFx0XHR2YXIgdGltZW91dF9ibHVyO1xuXHRcdFx0dmFyIHRpbWVvdXRfZm9jdXM7XG5cdFx0XHR2YXIgY2xhc3Nlcztcblx0XHRcdHZhciBjbGFzc2VzX3BsdWdpbnM7XG5cdFxuXHRcdFx0aW5wdXRNb2RlICAgICAgICAgPSBzZWxmLnNldHRpbmdzLm1vZGU7XG5cdFx0XHRjbGFzc2VzICAgICAgICAgICA9ICRpbnB1dC5hdHRyKCdjbGFzcycpIHx8ICcnO1xuXHRcblx0XHRcdCR3cmFwcGVyICAgICAgICAgID0gJCgnPGRpdj4nKS5hZGRDbGFzcyhzZXR0aW5ncy53cmFwcGVyQ2xhc3MpLmFkZENsYXNzKGNsYXNzZXMpLmFkZENsYXNzKGlucHV0TW9kZSk7XG5cdFx0XHQkY29udHJvbCAgICAgICAgICA9ICQoJzxkaXY+JykuYWRkQ2xhc3Moc2V0dGluZ3MuaW5wdXRDbGFzcykuYWRkQ2xhc3MoJ2l0ZW1zJykuYXBwZW5kVG8oJHdyYXBwZXIpO1xuXHRcdFx0JGNvbnRyb2xfaW5wdXQgICAgPSAkKCc8aW5wdXQgdHlwZT1cInRleHRcIiBhdXRvY29tcGxldGU9XCJvZmZcIiAvPicpLmFwcGVuZFRvKCRjb250cm9sKS5hdHRyKCd0YWJpbmRleCcsICRpbnB1dC5pcygnOmRpc2FibGVkJykgPyAnLTEnIDogc2VsZi50YWJJbmRleCk7XG5cdFx0XHQkZHJvcGRvd25fcGFyZW50ICA9ICQoc2V0dGluZ3MuZHJvcGRvd25QYXJlbnQgfHwgJHdyYXBwZXIpO1xuXHRcdFx0JGRyb3Bkb3duICAgICAgICAgPSAkKCc8ZGl2PicpLmFkZENsYXNzKHNldHRpbmdzLmRyb3Bkb3duQ2xhc3MpLmFkZENsYXNzKGlucHV0TW9kZSkuaGlkZSgpLmFwcGVuZFRvKCRkcm9wZG93bl9wYXJlbnQpO1xuXHRcdFx0JGRyb3Bkb3duX2NvbnRlbnQgPSAkKCc8ZGl2PicpLmFkZENsYXNzKHNldHRpbmdzLmRyb3Bkb3duQ29udGVudENsYXNzKS5hcHBlbmRUbygkZHJvcGRvd24pO1xuXHRcblx0XHRcdGlmKHNlbGYuc2V0dGluZ3MuY29weUNsYXNzZXNUb0Ryb3Bkb3duKSB7XG5cdFx0XHRcdCRkcm9wZG93bi5hZGRDbGFzcyhjbGFzc2VzKTtcblx0XHRcdH1cblx0XG5cdFx0XHQkd3JhcHBlci5jc3Moe1xuXHRcdFx0XHR3aWR0aDogJGlucHV0WzBdLnN0eWxlLndpZHRoXG5cdFx0XHR9KTtcblx0XG5cdFx0XHRpZiAoc2VsZi5wbHVnaW5zLm5hbWVzLmxlbmd0aCkge1xuXHRcdFx0XHRjbGFzc2VzX3BsdWdpbnMgPSAncGx1Z2luLScgKyBzZWxmLnBsdWdpbnMubmFtZXMuam9pbignIHBsdWdpbi0nKTtcblx0XHRcdFx0JHdyYXBwZXIuYWRkQ2xhc3MoY2xhc3Nlc19wbHVnaW5zKTtcblx0XHRcdFx0JGRyb3Bkb3duLmFkZENsYXNzKGNsYXNzZXNfcGx1Z2lucyk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0aWYgKChzZXR0aW5ncy5tYXhJdGVtcyA9PT0gbnVsbCB8fCBzZXR0aW5ncy5tYXhJdGVtcyA+IDEpICYmIHNlbGYudGFnVHlwZSA9PT0gVEFHX1NFTEVDVCkge1xuXHRcdFx0XHQkaW5wdXQuYXR0cignbXVsdGlwbGUnLCAnbXVsdGlwbGUnKTtcblx0XHRcdH1cblx0XG5cdFx0XHRpZiAoc2VsZi5zZXR0aW5ncy5wbGFjZWhvbGRlcikge1xuXHRcdFx0XHQkY29udHJvbF9pbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicsIHNldHRpbmdzLnBsYWNlaG9sZGVyKTtcblx0XHRcdH1cblx0XG5cdFx0XHQvLyBpZiBzcGxpdE9uIHdhcyBub3QgcGFzc2VkIGluLCBjb25zdHJ1Y3QgaXQgZnJvbSB0aGUgZGVsaW1pdGVyIHRvIGFsbG93IHBhc3RpbmcgdW5pdmVyc2FsbHlcblx0XHRcdGlmICghc2VsZi5zZXR0aW5ncy5zcGxpdE9uICYmIHNlbGYuc2V0dGluZ3MuZGVsaW1pdGVyKSB7XG5cdFx0XHRcdHZhciBkZWxpbWl0ZXJFc2NhcGVkID0gc2VsZi5zZXR0aW5ncy5kZWxpbWl0ZXIucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJyk7XG5cdFx0XHRcdHNlbGYuc2V0dGluZ3Muc3BsaXRPbiA9IG5ldyBSZWdFeHAoJ1xcXFxzKicgKyBkZWxpbWl0ZXJFc2NhcGVkICsgJytcXFxccyonKTtcblx0XHRcdH1cblx0XG5cdFx0XHRpZiAoJGlucHV0LmF0dHIoJ2F1dG9jb3JyZWN0JykpIHtcblx0XHRcdFx0JGNvbnRyb2xfaW5wdXQuYXR0cignYXV0b2NvcnJlY3QnLCAkaW5wdXQuYXR0cignYXV0b2NvcnJlY3QnKSk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0aWYgKCRpbnB1dC5hdHRyKCdhdXRvY2FwaXRhbGl6ZScpKSB7XG5cdFx0XHRcdCRjb250cm9sX2lucHV0LmF0dHIoJ2F1dG9jYXBpdGFsaXplJywgJGlucHV0LmF0dHIoJ2F1dG9jYXBpdGFsaXplJykpO1xuXHRcdFx0fVxuXHRcblx0XHRcdHNlbGYuJHdyYXBwZXIgICAgICAgICAgPSAkd3JhcHBlcjtcblx0XHRcdHNlbGYuJGNvbnRyb2wgICAgICAgICAgPSAkY29udHJvbDtcblx0XHRcdHNlbGYuJGNvbnRyb2xfaW5wdXQgICAgPSAkY29udHJvbF9pbnB1dDtcblx0XHRcdHNlbGYuJGRyb3Bkb3duICAgICAgICAgPSAkZHJvcGRvd247XG5cdFx0XHRzZWxmLiRkcm9wZG93bl9jb250ZW50ID0gJGRyb3Bkb3duX2NvbnRlbnQ7XG5cdFxuXHRcdFx0JGRyb3Bkb3duLm9uKCdtb3VzZWVudGVyJywgJ1tkYXRhLXNlbGVjdGFibGVdJywgZnVuY3Rpb24oKSB7IHJldHVybiBzZWxmLm9uT3B0aW9uSG92ZXIuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTsgfSk7XG5cdFx0XHQkZHJvcGRvd24ub24oJ21vdXNlZG93biBjbGljaycsICdbZGF0YS1zZWxlY3RhYmxlXScsIGZ1bmN0aW9uKCkgeyByZXR1cm4gc2VsZi5vbk9wdGlvblNlbGVjdC5hcHBseShzZWxmLCBhcmd1bWVudHMpOyB9KTtcblx0XHRcdHdhdGNoQ2hpbGRFdmVudCgkY29udHJvbCwgJ21vdXNlZG93bicsICcqOm5vdChpbnB1dCknLCBmdW5jdGlvbigpIHsgcmV0dXJuIHNlbGYub25JdGVtU2VsZWN0LmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7IH0pO1xuXHRcdFx0YXV0b0dyb3coJGNvbnRyb2xfaW5wdXQpO1xuXHRcblx0XHRcdCRjb250cm9sLm9uKHtcblx0XHRcdFx0bW91c2Vkb3duIDogZnVuY3Rpb24oKSB7IHJldHVybiBzZWxmLm9uTW91c2VEb3duLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7IH0sXG5cdFx0XHRcdGNsaWNrICAgICA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gc2VsZi5vbkNsaWNrLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7IH1cblx0XHRcdH0pO1xuXHRcblx0XHRcdCRjb250cm9sX2lucHV0Lm9uKHtcblx0XHRcdFx0bW91c2Vkb3duIDogZnVuY3Rpb24oZSkgeyBlLnN0b3BQcm9wYWdhdGlvbigpOyB9LFxuXHRcdFx0XHRrZXlkb3duICAgOiBmdW5jdGlvbigpIHsgcmV0dXJuIHNlbGYub25LZXlEb3duLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7IH0sXG5cdFx0XHRcdGtleXVwICAgICA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gc2VsZi5vbktleVVwLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7IH0sXG5cdFx0XHRcdGtleXByZXNzICA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gc2VsZi5vbktleVByZXNzLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7IH0sXG5cdFx0XHRcdHJlc2l6ZSAgICA6IGZ1bmN0aW9uKCkgeyBzZWxmLnBvc2l0aW9uRHJvcGRvd24uYXBwbHkoc2VsZiwgW10pOyB9LFxuXHRcdFx0XHRibHVyICAgICAgOiBmdW5jdGlvbigpIHsgcmV0dXJuIHNlbGYub25CbHVyLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7IH0sXG5cdFx0XHRcdGZvY3VzICAgICA6IGZ1bmN0aW9uKCkgeyBzZWxmLmlnbm9yZUJsdXIgPSBmYWxzZTsgcmV0dXJuIHNlbGYub25Gb2N1cy5hcHBseShzZWxmLCBhcmd1bWVudHMpOyB9LFxuXHRcdFx0XHRwYXN0ZSAgICAgOiBmdW5jdGlvbigpIHsgcmV0dXJuIHNlbGYub25QYXN0ZS5hcHBseShzZWxmLCBhcmd1bWVudHMpOyB9XG5cdFx0XHR9KTtcblx0XG5cdFx0XHQkZG9jdW1lbnQub24oJ2tleWRvd24nICsgZXZlbnROUywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRzZWxmLmlzQ21kRG93biA9IGVbSVNfTUFDID8gJ21ldGFLZXknIDogJ2N0cmxLZXknXTtcblx0XHRcdFx0c2VsZi5pc0N0cmxEb3duID0gZVtJU19NQUMgPyAnYWx0S2V5JyA6ICdjdHJsS2V5J107XG5cdFx0XHRcdHNlbGYuaXNTaGlmdERvd24gPSBlLnNoaWZ0S2V5O1xuXHRcdFx0fSk7XG5cdFxuXHRcdFx0JGRvY3VtZW50Lm9uKCdrZXl1cCcgKyBldmVudE5TLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGlmIChlLmtleUNvZGUgPT09IEtFWV9DVFJMKSBzZWxmLmlzQ3RybERvd24gPSBmYWxzZTtcblx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PT0gS0VZX1NISUZUKSBzZWxmLmlzU2hpZnREb3duID0gZmFsc2U7XG5cdFx0XHRcdGlmIChlLmtleUNvZGUgPT09IEtFWV9DTUQpIHNlbGYuaXNDbWREb3duID0gZmFsc2U7XG5cdFx0XHR9KTtcblx0XG5cdFx0XHQkZG9jdW1lbnQub24oJ21vdXNlZG93bicgKyBldmVudE5TLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGlmIChzZWxmLmlzRm9jdXNlZCkge1xuXHRcdFx0XHRcdC8vIHByZXZlbnQgZXZlbnRzIG9uIHRoZSBkcm9wZG93biBzY3JvbGxiYXIgZnJvbSBjYXVzaW5nIHRoZSBjb250cm9sIHRvIGJsdXJcblx0XHRcdFx0XHRpZiAoZS50YXJnZXQgPT09IHNlbGYuJGRyb3Bkb3duWzBdIHx8IGUudGFyZ2V0LnBhcmVudE5vZGUgPT09IHNlbGYuJGRyb3Bkb3duWzBdKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIGJsdXIgb24gY2xpY2sgb3V0c2lkZVxuXHRcdFx0XHRcdGlmICghc2VsZi4kY29udHJvbC5oYXMoZS50YXJnZXQpLmxlbmd0aCAmJiBlLnRhcmdldCAhPT0gc2VsZi4kY29udHJvbFswXSkge1xuXHRcdFx0XHRcdFx0c2VsZi5ibHVyKGUudGFyZ2V0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcblx0XHRcdCR3aW5kb3cub24oWydzY3JvbGwnICsgZXZlbnROUywgJ3Jlc2l6ZScgKyBldmVudE5TXS5qb2luKCcgJyksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoc2VsZi5pc09wZW4pIHtcblx0XHRcdFx0XHRzZWxmLnBvc2l0aW9uRHJvcGRvd24uYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQkd2luZG93Lm9uKCdtb3VzZW1vdmUnICsgZXZlbnROUywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGYuaWdub3JlSG92ZXIgPSBmYWxzZTtcblx0XHRcdH0pO1xuXHRcblx0XHRcdC8vIHN0b3JlIG9yaWdpbmFsIGNoaWxkcmVuIGFuZCB0YWIgaW5kZXggc28gdGhhdCB0aGV5IGNhbiBiZVxuXHRcdFx0Ly8gcmVzdG9yZWQgd2hlbiB0aGUgZGVzdHJveSgpIG1ldGhvZCBpcyBjYWxsZWQuXG5cdFx0XHR0aGlzLnJldmVydFNldHRpbmdzID0ge1xuXHRcdFx0XHQkY2hpbGRyZW4gOiAkaW5wdXQuY2hpbGRyZW4oKS5kZXRhY2goKSxcblx0XHRcdFx0dGFiaW5kZXggIDogJGlucHV0LmF0dHIoJ3RhYmluZGV4Jylcblx0XHRcdH07XG5cdFxuXHRcdFx0JGlucHV0LmF0dHIoJ3RhYmluZGV4JywgLTEpLmhpZGUoKS5hZnRlcihzZWxmLiR3cmFwcGVyKTtcblx0XG5cdFx0XHRpZiAoJC5pc0FycmF5KHNldHRpbmdzLml0ZW1zKSkge1xuXHRcdFx0XHRzZWxmLnNldFZhbHVlKHNldHRpbmdzLml0ZW1zKTtcblx0XHRcdFx0ZGVsZXRlIHNldHRpbmdzLml0ZW1zO1xuXHRcdFx0fVxuXHRcblx0XHRcdC8vIGZlYXR1cmUgZGV0ZWN0IGZvciB0aGUgdmFsaWRhdGlvbiBBUElcblx0XHRcdGlmIChTVVBQT1JUU19WQUxJRElUWV9BUEkpIHtcblx0XHRcdFx0JGlucHV0Lm9uKCdpbnZhbGlkJyArIGV2ZW50TlMsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0c2VsZi5pc0ludmFsaWQgPSB0cnVlO1xuXHRcdFx0XHRcdHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcblx0XHRcdHNlbGYudXBkYXRlT3JpZ2luYWxJbnB1dCgpO1xuXHRcdFx0c2VsZi5yZWZyZXNoSXRlbXMoKTtcblx0XHRcdHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdFx0XHRzZWxmLnVwZGF0ZVBsYWNlaG9sZGVyKCk7XG5cdFx0XHRzZWxmLmlzU2V0dXAgPSB0cnVlO1xuXHRcblx0XHRcdGlmICgkaW5wdXQuaXMoJzpkaXNhYmxlZCcpKSB7XG5cdFx0XHRcdHNlbGYuZGlzYWJsZSgpO1xuXHRcdFx0fVxuXHRcblx0XHRcdHNlbGYub24oJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UpO1xuXHRcblx0XHRcdCRpbnB1dC5kYXRhKCdzZWxlY3RpemUnLCBzZWxmKTtcblx0XHRcdCRpbnB1dC5hZGRDbGFzcygnc2VsZWN0aXplZCcpO1xuXHRcdFx0c2VsZi50cmlnZ2VyKCdpbml0aWFsaXplJyk7XG5cdFxuXHRcdFx0Ly8gcHJlbG9hZCBvcHRpb25zXG5cdFx0XHRpZiAoc2V0dGluZ3MucHJlbG9hZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRzZWxmLm9uU2VhcmNoQ2hhbmdlKCcnKTtcblx0XHRcdH1cblx0XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogU2V0cyB1cCBkZWZhdWx0IHJlbmRlcmluZyBmdW5jdGlvbnMuXG5cdFx0ICovXG5cdFx0c2V0dXBUZW1wbGF0ZXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyIGZpZWxkX2xhYmVsID0gc2VsZi5zZXR0aW5ncy5sYWJlbEZpZWxkO1xuXHRcdFx0dmFyIGZpZWxkX29wdGdyb3VwID0gc2VsZi5zZXR0aW5ncy5vcHRncm91cExhYmVsRmllbGQ7XG5cdFxuXHRcdFx0dmFyIHRlbXBsYXRlcyA9IHtcblx0XHRcdFx0J29wdGdyb3VwJzogZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdHJldHVybiAnPGRpdiBjbGFzcz1cIm9wdGdyb3VwXCI+JyArIGRhdGEuaHRtbCArICc8L2Rpdj4nO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQnb3B0Z3JvdXBfaGVhZGVyJzogZnVuY3Rpb24oZGF0YSwgZXNjYXBlKSB7XG5cdFx0XHRcdFx0cmV0dXJuICc8ZGl2IGNsYXNzPVwib3B0Z3JvdXAtaGVhZGVyXCI+JyArIGVzY2FwZShkYXRhW2ZpZWxkX29wdGdyb3VwXSkgKyAnPC9kaXY+Jztcblx0XHRcdFx0fSxcblx0XHRcdFx0J29wdGlvbic6IGZ1bmN0aW9uKGRhdGEsIGVzY2FwZSkge1xuXHRcdFx0XHRcdHJldHVybiAnPGRpdiBjbGFzcz1cIm9wdGlvblwiPicgKyBlc2NhcGUoZGF0YVtmaWVsZF9sYWJlbF0pICsgJzwvZGl2Pic7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdCdpdGVtJzogZnVuY3Rpb24oZGF0YSwgZXNjYXBlKSB7XG5cdFx0XHRcdFx0cmV0dXJuICc8ZGl2IGNsYXNzPVwiaXRlbVwiPicgKyBlc2NhcGUoZGF0YVtmaWVsZF9sYWJlbF0pICsgJzwvZGl2Pic7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdCdvcHRpb25fY3JlYXRlJzogZnVuY3Rpb24oZGF0YSwgZXNjYXBlKSB7XG5cdFx0XHRcdFx0cmV0dXJuICc8ZGl2IGNsYXNzPVwiY3JlYXRlXCI+QWRkIDxzdHJvbmc+JyArIGVzY2FwZShkYXRhLmlucHV0KSArICc8L3N0cm9uZz4maGVsbGlwOzwvZGl2Pic7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFxuXHRcdFx0c2VsZi5zZXR0aW5ncy5yZW5kZXIgPSAkLmV4dGVuZCh7fSwgdGVtcGxhdGVzLCBzZWxmLnNldHRpbmdzLnJlbmRlcik7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogTWFwcyBmaXJlZCBldmVudHMgdG8gY2FsbGJhY2tzIHByb3ZpZGVkXG5cdFx0ICogaW4gdGhlIHNldHRpbmdzIHVzZWQgd2hlbiBjcmVhdGluZyB0aGUgY29udHJvbC5cblx0XHQgKi9cblx0XHRzZXR1cENhbGxiYWNrczogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIga2V5LCBmbiwgY2FsbGJhY2tzID0ge1xuXHRcdFx0XHQnaW5pdGlhbGl6ZScgICAgICA6ICdvbkluaXRpYWxpemUnLFxuXHRcdFx0XHQnY2hhbmdlJyAgICAgICAgICA6ICdvbkNoYW5nZScsXG5cdFx0XHRcdCdpdGVtX2FkZCcgICAgICAgIDogJ29uSXRlbUFkZCcsXG5cdFx0XHRcdCdpdGVtX3JlbW92ZScgICAgIDogJ29uSXRlbVJlbW92ZScsXG5cdFx0XHRcdCdjbGVhcicgICAgICAgICAgIDogJ29uQ2xlYXInLFxuXHRcdFx0XHQnb3B0aW9uX2FkZCcgICAgICA6ICdvbk9wdGlvbkFkZCcsXG5cdFx0XHRcdCdvcHRpb25fcmVtb3ZlJyAgIDogJ29uT3B0aW9uUmVtb3ZlJyxcblx0XHRcdFx0J29wdGlvbl9jbGVhcicgICAgOiAnb25PcHRpb25DbGVhcicsXG5cdFx0XHRcdCdvcHRncm91cF9hZGQnICAgIDogJ29uT3B0aW9uR3JvdXBBZGQnLFxuXHRcdFx0XHQnb3B0Z3JvdXBfcmVtb3ZlJyA6ICdvbk9wdGlvbkdyb3VwUmVtb3ZlJyxcblx0XHRcdFx0J29wdGdyb3VwX2NsZWFyJyAgOiAnb25PcHRpb25Hcm91cENsZWFyJyxcblx0XHRcdFx0J2Ryb3Bkb3duX29wZW4nICAgOiAnb25Ecm9wZG93bk9wZW4nLFxuXHRcdFx0XHQnZHJvcGRvd25fY2xvc2UnICA6ICdvbkRyb3Bkb3duQ2xvc2UnLFxuXHRcdFx0XHQndHlwZScgICAgICAgICAgICA6ICdvblR5cGUnLFxuXHRcdFx0XHQnbG9hZCcgICAgICAgICAgICA6ICdvbkxvYWQnLFxuXHRcdFx0XHQnZm9jdXMnICAgICAgICAgICA6ICdvbkZvY3VzJyxcblx0XHRcdFx0J2JsdXInICAgICAgICAgICAgOiAnb25CbHVyJ1xuXHRcdFx0fTtcblx0XG5cdFx0XHRmb3IgKGtleSBpbiBjYWxsYmFja3MpIHtcblx0XHRcdFx0aWYgKGNhbGxiYWNrcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRcdFx0Zm4gPSB0aGlzLnNldHRpbmdzW2NhbGxiYWNrc1trZXldXTtcblx0XHRcdFx0XHRpZiAoZm4pIHRoaXMub24oa2V5LCBmbik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBUcmlnZ2VyZWQgd2hlbiB0aGUgbWFpbiBjb250cm9sIGVsZW1lbnRcblx0XHQgKiBoYXMgYSBjbGljayBldmVudC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBlXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRvbkNsaWNrOiBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdFx0Ly8gbmVjZXNzYXJ5IGZvciBtb2JpbGUgd2Via2l0IGRldmljZXMgKG1hbnVhbCBmb2N1cyB0cmlnZ2VyaW5nXG5cdFx0XHQvLyBpcyBpZ25vcmVkIHVubGVzcyBpbnZva2VkIHdpdGhpbiBhIGNsaWNrIGV2ZW50KVxuXHRcdFx0aWYgKCFzZWxmLmlzRm9jdXNlZCkge1xuXHRcdFx0XHRzZWxmLmZvY3VzKCk7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBUcmlnZ2VyZWQgd2hlbiB0aGUgbWFpbiBjb250cm9sIGVsZW1lbnRcblx0XHQgKiBoYXMgYSBtb3VzZSBkb3duIGV2ZW50LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IGVcblx0XHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdG9uTW91c2VEb3duOiBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHR2YXIgZGVmYXVsdFByZXZlbnRlZCA9IGUuaXNEZWZhdWx0UHJldmVudGVkKCk7XG5cdFx0XHR2YXIgJHRhcmdldCA9ICQoZS50YXJnZXQpO1xuXHRcblx0XHRcdGlmIChzZWxmLmlzRm9jdXNlZCkge1xuXHRcdFx0XHQvLyByZXRhaW4gZm9jdXMgYnkgcHJldmVudGluZyBuYXRpdmUgaGFuZGxpbmcuIGlmIHRoZVxuXHRcdFx0XHQvLyBldmVudCB0YXJnZXQgaXMgdGhlIGlucHV0IGl0IHNob3VsZCBub3QgYmUgbW9kaWZpZWQuXG5cdFx0XHRcdC8vIG90aGVyd2lzZSwgdGV4dCBzZWxlY3Rpb24gd2l0aGluIHRoZSBpbnB1dCB3b24ndCB3b3JrLlxuXHRcdFx0XHRpZiAoZS50YXJnZXQgIT09IHNlbGYuJGNvbnRyb2xfaW5wdXRbMF0pIHtcblx0XHRcdFx0XHRpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJykge1xuXHRcdFx0XHRcdFx0Ly8gdG9nZ2xlIGRyb3Bkb3duXG5cdFx0XHRcdFx0XHRzZWxmLmlzT3BlbiA/IHNlbGYuY2xvc2UoKSA6IHNlbGYub3BlbigpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIWRlZmF1bHRQcmV2ZW50ZWQpIHtcblx0XHRcdFx0XHRcdHNlbGYuc2V0QWN0aXZlSXRlbShudWxsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBnaXZlIGNvbnRyb2wgZm9jdXNcblx0XHRcdFx0aWYgKCFkZWZhdWx0UHJldmVudGVkKSB7XG5cdFx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRzZWxmLmZvY3VzKCk7XG5cdFx0XHRcdFx0fSwgMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBUcmlnZ2VyZWQgd2hlbiB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wgaGFzIGJlZW4gY2hhbmdlZC5cblx0XHQgKiBUaGlzIHNob3VsZCBwcm9wYWdhdGUgdGhlIGV2ZW50IHRvIHRoZSBvcmlnaW5hbCBET01cblx0XHQgKiBpbnB1dCAvIHNlbGVjdCBlbGVtZW50LlxuXHRcdCAqL1xuXHRcdG9uQ2hhbmdlOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuJGlucHV0LnRyaWdnZXIoJ2NoYW5nZScpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFRyaWdnZXJlZCBvbiA8aW5wdXQ+IHBhc3RlLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IGVcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRvblBhc3RlOiBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRpZiAoc2VsZi5pc0Z1bGwoKSB8fCBzZWxmLmlzSW5wdXRIaWRkZW4gfHwgc2VsZi5pc0xvY2tlZCkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBJZiBhIHJlZ2V4IG9yIHN0cmluZyBpcyBpbmNsdWRlZCwgdGhpcyB3aWxsIHNwbGl0IHRoZSBwYXN0ZWRcblx0XHRcdFx0Ly8gaW5wdXQgYW5kIGNyZWF0ZSBJdGVtcyBmb3IgZWFjaCBzZXBhcmF0ZSB2YWx1ZVxuXHRcdFx0XHRpZiAoc2VsZi5zZXR0aW5ncy5zcGxpdE9uKSB7XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHZhciBzcGxpdElucHV0ID0gJC50cmltKHNlbGYuJGNvbnRyb2xfaW5wdXQudmFsKCkgfHwgJycpLnNwbGl0KHNlbGYuc2V0dGluZ3Muc3BsaXRPbik7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbiA9IHNwbGl0SW5wdXQubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdHNlbGYuY3JlYXRlSXRlbShzcGxpdElucHV0W2ldKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LCAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFRyaWdnZXJlZCBvbiA8aW5wdXQ+IGtleXByZXNzLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IGVcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRvbktleVByZXNzOiBmdW5jdGlvbihlKSB7XG5cdFx0XHRpZiAodGhpcy5pc0xvY2tlZCkgcmV0dXJuIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyIGNoYXJhY3RlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlIHx8IGUud2hpY2gpO1xuXHRcdFx0aWYgKHRoaXMuc2V0dGluZ3MuY3JlYXRlICYmIHRoaXMuc2V0dGluZ3MubW9kZSA9PT0gJ211bHRpJyAmJiBjaGFyYWN0ZXIgPT09IHRoaXMuc2V0dGluZ3MuZGVsaW1pdGVyKSB7XG5cdFx0XHRcdHRoaXMuY3JlYXRlSXRlbSgpO1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBUcmlnZ2VyZWQgb24gPGlucHV0PiBrZXlkb3duLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IGVcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRvbktleURvd246IGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciBpc0lucHV0ID0gZS50YXJnZXQgPT09IHRoaXMuJGNvbnRyb2xfaW5wdXRbMF07XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdFx0aWYgKHNlbGYuaXNMb2NrZWQpIHtcblx0XHRcdFx0aWYgKGUua2V5Q29kZSAhPT0gS0VZX1RBQikge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFxuXHRcdFx0c3dpdGNoIChlLmtleUNvZGUpIHtcblx0XHRcdFx0Y2FzZSBLRVlfQTpcblx0XHRcdFx0XHRpZiAoc2VsZi5pc0NtZERvd24pIHtcblx0XHRcdFx0XHRcdHNlbGYuc2VsZWN0QWxsKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIEtFWV9FU0M6XG5cdFx0XHRcdFx0aWYgKHNlbGYuaXNPcGVuKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0c2VsZi5jbG9zZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdGNhc2UgS0VZX046XG5cdFx0XHRcdFx0aWYgKCFlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIGJyZWFrO1xuXHRcdFx0XHRjYXNlIEtFWV9ET1dOOlxuXHRcdFx0XHRcdGlmICghc2VsZi5pc09wZW4gJiYgc2VsZi5oYXNPcHRpb25zKSB7XG5cdFx0XHRcdFx0XHRzZWxmLm9wZW4oKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHNlbGYuJGFjdGl2ZU9wdGlvbikge1xuXHRcdFx0XHRcdFx0c2VsZi5pZ25vcmVIb3ZlciA9IHRydWU7XG5cdFx0XHRcdFx0XHR2YXIgJG5leHQgPSBzZWxmLmdldEFkamFjZW50T3B0aW9uKHNlbGYuJGFjdGl2ZU9wdGlvbiwgMSk7XG5cdFx0XHRcdFx0XHRpZiAoJG5leHQubGVuZ3RoKSBzZWxmLnNldEFjdGl2ZU9wdGlvbigkbmV4dCwgdHJ1ZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdGNhc2UgS0VZX1A6XG5cdFx0XHRcdFx0aWYgKCFlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIGJyZWFrO1xuXHRcdFx0XHRjYXNlIEtFWV9VUDpcblx0XHRcdFx0XHRpZiAoc2VsZi4kYWN0aXZlT3B0aW9uKSB7XG5cdFx0XHRcdFx0XHRzZWxmLmlnbm9yZUhvdmVyID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHZhciAkcHJldiA9IHNlbGYuZ2V0QWRqYWNlbnRPcHRpb24oc2VsZi4kYWN0aXZlT3B0aW9uLCAtMSk7XG5cdFx0XHRcdFx0XHRpZiAoJHByZXYubGVuZ3RoKSBzZWxmLnNldEFjdGl2ZU9wdGlvbigkcHJldiwgdHJ1ZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdGNhc2UgS0VZX1JFVFVSTjpcblx0XHRcdFx0XHRpZiAoc2VsZi5pc09wZW4gJiYgc2VsZi4kYWN0aXZlT3B0aW9uKSB7XG5cdFx0XHRcdFx0XHRzZWxmLm9uT3B0aW9uU2VsZWN0KHtjdXJyZW50VGFyZ2V0OiBzZWxmLiRhY3RpdmVPcHRpb259KTtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRjYXNlIEtFWV9MRUZUOlxuXHRcdFx0XHRcdHNlbGYuYWR2YW5jZVNlbGVjdGlvbigtMSwgZSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRjYXNlIEtFWV9SSUdIVDpcblx0XHRcdFx0XHRzZWxmLmFkdmFuY2VTZWxlY3Rpb24oMSwgZSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRjYXNlIEtFWV9UQUI6XG5cdFx0XHRcdFx0aWYgKHNlbGYuc2V0dGluZ3Muc2VsZWN0T25UYWIgJiYgc2VsZi5pc09wZW4gJiYgc2VsZi4kYWN0aXZlT3B0aW9uKSB7XG5cdFx0XHRcdFx0XHRzZWxmLm9uT3B0aW9uU2VsZWN0KHtjdXJyZW50VGFyZ2V0OiBzZWxmLiRhY3RpdmVPcHRpb259KTtcblx0XG5cdFx0XHRcdFx0XHQvLyBEZWZhdWx0IGJlaGF2aW91ciBpcyB0byBqdW1wIHRvIHRoZSBuZXh0IGZpZWxkLCB3ZSBvbmx5IHdhbnQgdGhpc1xuXHRcdFx0XHRcdFx0Ly8gaWYgdGhlIGN1cnJlbnQgZmllbGQgZG9lc24ndCBhY2NlcHQgYW55IG1vcmUgZW50cmllc1xuXHRcdFx0XHRcdFx0aWYgKCFzZWxmLmlzRnVsbCgpKSB7XG5cdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHNlbGYuc2V0dGluZ3MuY3JlYXRlICYmIHNlbGYuY3JlYXRlSXRlbSgpKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0Y2FzZSBLRVlfQkFDS1NQQUNFOlxuXHRcdFx0XHRjYXNlIEtFWV9ERUxFVEU6XG5cdFx0XHRcdFx0c2VsZi5kZWxldGVTZWxlY3Rpb24oZSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcblx0XHRcdGlmICgoc2VsZi5pc0Z1bGwoKSB8fCBzZWxmLmlzSW5wdXRIaWRkZW4pICYmICEoSVNfTUFDID8gZS5tZXRhS2V5IDogZS5jdHJsS2V5KSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBUcmlnZ2VyZWQgb24gPGlucHV0PiBrZXl1cC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBlXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0b25LZXlVcDogZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0XHRcdGlmIChzZWxmLmlzTG9ja2VkKSByZXR1cm4gZSAmJiBlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgdmFsdWUgPSBzZWxmLiRjb250cm9sX2lucHV0LnZhbCgpIHx8ICcnO1xuXHRcdFx0aWYgKHNlbGYubGFzdFZhbHVlICE9PSB2YWx1ZSkge1xuXHRcdFx0XHRzZWxmLmxhc3RWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRzZWxmLm9uU2VhcmNoQ2hhbmdlKHZhbHVlKTtcblx0XHRcdFx0c2VsZi5yZWZyZXNoT3B0aW9ucygpO1xuXHRcdFx0XHRzZWxmLnRyaWdnZXIoJ3R5cGUnLCB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogSW52b2tlcyB0aGUgdXNlci1wcm92aWRlIG9wdGlvbiBwcm92aWRlciAvIGxvYWRlci5cblx0XHQgKlxuXHRcdCAqIE5vdGU6IHRoaXMgZnVuY3Rpb24gaXMgZGVib3VuY2VkIGluIHRoZSBTZWxlY3RpemVcblx0XHQgKiBjb25zdHJ1Y3RvciAoYnkgYHNldHRpbmdzLmxvYWREZWxheWAgbWlsbGlzZWNvbmRzKVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG5cdFx0ICovXG5cdFx0b25TZWFyY2hDaGFuZ2U6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHR2YXIgZm4gPSBzZWxmLnNldHRpbmdzLmxvYWQ7XG5cdFx0XHRpZiAoIWZuKSByZXR1cm47XG5cdFx0XHRpZiAoc2VsZi5sb2FkZWRTZWFyY2hlcy5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHJldHVybjtcblx0XHRcdHNlbGYubG9hZGVkU2VhcmNoZXNbdmFsdWVdID0gdHJ1ZTtcblx0XHRcdHNlbGYubG9hZChmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdFx0XHRmbi5hcHBseShzZWxmLCBbdmFsdWUsIGNhbGxiYWNrXSk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBUcmlnZ2VyZWQgb24gPGlucHV0PiBmb2N1cy5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBlIChvcHRpb25hbClcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRvbkZvY3VzOiBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHR2YXIgd2FzRm9jdXNlZCA9IHNlbGYuaXNGb2N1c2VkO1xuXHRcblx0XHRcdGlmIChzZWxmLmlzRGlzYWJsZWQpIHtcblx0XHRcdFx0c2VsZi5ibHVyKCk7XG5cdFx0XHRcdGUgJiYgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFxuXHRcdFx0aWYgKHNlbGYuaWdub3JlRm9jdXMpIHJldHVybjtcblx0XHRcdHNlbGYuaXNGb2N1c2VkID0gdHJ1ZTtcblx0XHRcdGlmIChzZWxmLnNldHRpbmdzLnByZWxvYWQgPT09ICdmb2N1cycpIHNlbGYub25TZWFyY2hDaGFuZ2UoJycpO1xuXHRcblx0XHRcdGlmICghd2FzRm9jdXNlZCkgc2VsZi50cmlnZ2VyKCdmb2N1cycpO1xuXHRcblx0XHRcdGlmICghc2VsZi4kYWN0aXZlSXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdHNlbGYuc2hvd0lucHV0KCk7XG5cdFx0XHRcdHNlbGYuc2V0QWN0aXZlSXRlbShudWxsKTtcblx0XHRcdFx0c2VsZi5yZWZyZXNoT3B0aW9ucyghIXNlbGYuc2V0dGluZ3Mub3Blbk9uRm9jdXMpO1xuXHRcdFx0fVxuXHRcblx0XHRcdHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogVHJpZ2dlcmVkIG9uIDxpbnB1dD4gYmx1ci5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBlXG5cdFx0ICogQHBhcmFtIHtFbGVtZW50fSBkZXN0XG5cdFx0ICovXG5cdFx0b25CbHVyOiBmdW5jdGlvbihlLCBkZXN0KSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRpZiAoIXNlbGYuaXNGb2N1c2VkKSByZXR1cm47XG5cdFx0XHRzZWxmLmlzRm9jdXNlZCA9IGZhbHNlO1xuXHRcblx0XHRcdGlmIChzZWxmLmlnbm9yZUZvY3VzKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH0gZWxzZSBpZiAoIXNlbGYuaWdub3JlQmx1ciAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBzZWxmLiRkcm9wZG93bl9jb250ZW50WzBdKSB7XG5cdFx0XHRcdC8vIG5lY2Vzc2FyeSB0byBwcmV2ZW50IElFIGNsb3NpbmcgdGhlIGRyb3Bkb3duIHdoZW4gdGhlIHNjcm9sbGJhciBpcyBjbGlja2VkXG5cdFx0XHRcdHNlbGYuaWdub3JlQmx1ciA9IHRydWU7XG5cdFx0XHRcdHNlbGYub25Gb2N1cyhlKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcblx0XHRcdHZhciBkZWFjdGl2YXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGYuY2xvc2UoKTtcblx0XHRcdFx0c2VsZi5zZXRUZXh0Ym94VmFsdWUoJycpO1xuXHRcdFx0XHRzZWxmLnNldEFjdGl2ZUl0ZW0obnVsbCk7XG5cdFx0XHRcdHNlbGYuc2V0QWN0aXZlT3B0aW9uKG51bGwpO1xuXHRcdFx0XHRzZWxmLnNldENhcmV0KHNlbGYuaXRlbXMubGVuZ3RoKTtcblx0XHRcdFx0c2VsZi5yZWZyZXNoU3RhdGUoKTtcblx0XG5cdFx0XHRcdC8vIElFMTEgYnVnOiBlbGVtZW50IHN0aWxsIG1hcmtlZCBhcyBhY3RpdmVcblx0XHRcdFx0KGRlc3QgfHwgZG9jdW1lbnQuYm9keSkuZm9jdXMoKTtcblx0XG5cdFx0XHRcdHNlbGYuaWdub3JlRm9jdXMgPSBmYWxzZTtcblx0XHRcdFx0c2VsZi50cmlnZ2VyKCdibHVyJyk7XG5cdFx0XHR9O1xuXHRcblx0XHRcdHNlbGYuaWdub3JlRm9jdXMgPSB0cnVlO1xuXHRcdFx0aWYgKHNlbGYuc2V0dGluZ3MuY3JlYXRlICYmIHNlbGYuc2V0dGluZ3MuY3JlYXRlT25CbHVyKSB7XG5cdFx0XHRcdHNlbGYuY3JlYXRlSXRlbShudWxsLCBmYWxzZSwgZGVhY3RpdmF0ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkZWFjdGl2YXRlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogVHJpZ2dlcmVkIHdoZW4gdGhlIHVzZXIgcm9sbHMgb3ZlclxuXHRcdCAqIGFuIG9wdGlvbiBpbiB0aGUgYXV0b2NvbXBsZXRlIGRyb3Bkb3duIG1lbnUuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gZVxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdG9uT3B0aW9uSG92ZXI6IGZ1bmN0aW9uKGUpIHtcblx0XHRcdGlmICh0aGlzLmlnbm9yZUhvdmVyKSByZXR1cm47XG5cdFx0XHR0aGlzLnNldEFjdGl2ZU9wdGlvbihlLmN1cnJlbnRUYXJnZXQsIGZhbHNlKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBUcmlnZ2VyZWQgd2hlbiB0aGUgdXNlciBjbGlja3Mgb24gYW4gb3B0aW9uXG5cdFx0ICogaW4gdGhlIGF1dG9jb21wbGV0ZSBkcm9wZG93biBtZW51LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IGVcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRvbk9wdGlvblNlbGVjdDogZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIHZhbHVlLCAkdGFyZ2V0LCAkb3B0aW9uLCBzZWxmID0gdGhpcztcblx0XG5cdFx0XHRpZiAoZS5wcmV2ZW50RGVmYXVsdCkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0JHRhcmdldCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdGlmICgkdGFyZ2V0Lmhhc0NsYXNzKCdjcmVhdGUnKSkge1xuXHRcdFx0XHRzZWxmLmNyZWF0ZUl0ZW0obnVsbCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aWYgKHNlbGYuc2V0dGluZ3MuY2xvc2VBZnRlclNlbGVjdCkge1xuXHRcdFx0XHRcdFx0c2VsZi5jbG9zZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YWx1ZSA9ICR0YXJnZXQuYXR0cignZGF0YS12YWx1ZScpO1xuXHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblx0XHRcdFx0XHRzZWxmLnNldFRleHRib3hWYWx1ZSgnJyk7XG5cdFx0XHRcdFx0c2VsZi5hZGRJdGVtKHZhbHVlKTtcblx0XHRcdFx0XHRpZiAoc2VsZi5zZXR0aW5ncy5jbG9zZUFmdGVyU2VsZWN0KSB7XG5cdFx0XHRcdFx0XHRzZWxmLmNsb3NlKCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICghc2VsZi5zZXR0aW5ncy5oaWRlU2VsZWN0ZWQgJiYgZS50eXBlICYmIC9tb3VzZS8udGVzdChlLnR5cGUpKSB7XG5cdFx0XHRcdFx0XHRzZWxmLnNldEFjdGl2ZU9wdGlvbihzZWxmLmdldE9wdGlvbih2YWx1ZSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFRyaWdnZXJlZCB3aGVuIHRoZSB1c2VyIGNsaWNrcyBvbiBhbiBpdGVtXG5cdFx0ICogdGhhdCBoYXMgYmVlbiBzZWxlY3RlZC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBlXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0b25JdGVtU2VsZWN0OiBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdFx0aWYgKHNlbGYuaXNMb2NrZWQpIHJldHVybjtcblx0XHRcdGlmIChzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdtdWx0aScpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRzZWxmLnNldEFjdGl2ZUl0ZW0oZS5jdXJyZW50VGFyZ2V0LCBlKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBJbnZva2VzIHRoZSBwcm92aWRlZCBtZXRob2QgdGhhdCBwcm92aWRlc1xuXHRcdCAqIHJlc3VsdHMgdG8gYSBjYWxsYmFjay0tLXdoaWNoIGFyZSB0aGVuIGFkZGVkXG5cdFx0ICogYXMgb3B0aW9ucyB0byB0aGUgY29udHJvbC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuXG5cdFx0ICovXG5cdFx0bG9hZDogZnVuY3Rpb24oZm4pIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHZhciAkd3JhcHBlciA9IHNlbGYuJHdyYXBwZXIuYWRkQ2xhc3Moc2VsZi5zZXR0aW5ncy5sb2FkaW5nQ2xhc3MpO1xuXHRcblx0XHRcdHNlbGYubG9hZGluZysrO1xuXHRcdFx0Zm4uYXBwbHkoc2VsZiwgW2Z1bmN0aW9uKHJlc3VsdHMpIHtcblx0XHRcdFx0c2VsZi5sb2FkaW5nID0gTWF0aC5tYXgoc2VsZi5sb2FkaW5nIC0gMSwgMCk7XG5cdFx0XHRcdGlmIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0c2VsZi5hZGRPcHRpb24ocmVzdWx0cyk7XG5cdFx0XHRcdFx0c2VsZi5yZWZyZXNoT3B0aW9ucyhzZWxmLmlzRm9jdXNlZCAmJiAhc2VsZi5pc0lucHV0SGlkZGVuKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXNlbGYubG9hZGluZykge1xuXHRcdFx0XHRcdCR3cmFwcGVyLnJlbW92ZUNsYXNzKHNlbGYuc2V0dGluZ3MubG9hZGluZ0NsYXNzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzZWxmLnRyaWdnZXIoJ2xvYWQnLCByZXN1bHRzKTtcblx0XHRcdH1dKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBTZXRzIHRoZSBpbnB1dCBmaWVsZCBvZiB0aGUgY29udHJvbCB0byB0aGUgc3BlY2lmaWVkIHZhbHVlLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG5cdFx0ICovXG5cdFx0c2V0VGV4dGJveFZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dmFyICRpbnB1dCA9IHRoaXMuJGNvbnRyb2xfaW5wdXQ7XG5cdFx0XHR2YXIgY2hhbmdlZCA9ICRpbnB1dC52YWwoKSAhPT0gdmFsdWU7XG5cdFx0XHRpZiAoY2hhbmdlZCkge1xuXHRcdFx0XHQkaW5wdXQudmFsKHZhbHVlKS50cmlnZ2VySGFuZGxlcigndXBkYXRlJyk7XG5cdFx0XHRcdHRoaXMubGFzdFZhbHVlID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogUmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wuIElmIG11bHRpcGxlIGl0ZW1zXG5cdFx0ICogY2FuIGJlIHNlbGVjdGVkIChlLmcuIDxzZWxlY3QgbXVsdGlwbGU+KSwgdGhpcyByZXR1cm5zXG5cdFx0ICogYW4gYXJyYXkuIElmIG9ubHkgb25lIGl0ZW0gY2FuIGJlIHNlbGVjdGVkLCB0aGlzXG5cdFx0ICogcmV0dXJucyBhIHN0cmluZy5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHttaXhlZH1cblx0XHQgKi9cblx0XHRnZXRWYWx1ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAodGhpcy50YWdUeXBlID09PSBUQUdfU0VMRUNUICYmIHRoaXMuJGlucHV0LmF0dHIoJ211bHRpcGxlJykpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaXRlbXM7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pdGVtcy5qb2luKHRoaXMuc2V0dGluZ3MuZGVsaW1pdGVyKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBSZXNldHMgdGhlIHNlbGVjdGVkIGl0ZW1zIHRvIHRoZSBnaXZlbiB2YWx1ZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7bWl4ZWR9IHZhbHVlXG5cdFx0ICovXG5cdFx0c2V0VmFsdWU6IGZ1bmN0aW9uKHZhbHVlLCBzaWxlbnQpIHtcblx0XHRcdHZhciBldmVudHMgPSBzaWxlbnQgPyBbXSA6IFsnY2hhbmdlJ107XG5cdFxuXHRcdFx0ZGVib3VuY2VfZXZlbnRzKHRoaXMsIGV2ZW50cywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuY2xlYXIoc2lsZW50KTtcblx0XHRcdFx0dGhpcy5hZGRJdGVtcyh2YWx1ZSwgc2lsZW50KTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFNldHMgdGhlIHNlbGVjdGVkIGl0ZW0uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gJGl0ZW1cblx0XHQgKiBAcGFyYW0ge29iamVjdH0gZSAob3B0aW9uYWwpXG5cdFx0ICovXG5cdFx0c2V0QWN0aXZlSXRlbTogZnVuY3Rpb24oJGl0ZW0sIGUpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHZhciBldmVudE5hbWU7XG5cdFx0XHR2YXIgaSwgaWR4LCBiZWdpbiwgZW5kLCBpdGVtLCBzd2FwO1xuXHRcdFx0dmFyICRsYXN0O1xuXHRcblx0XHRcdGlmIChzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdzaW5nbGUnKSByZXR1cm47XG5cdFx0XHQkaXRlbSA9ICQoJGl0ZW0pO1xuXHRcblx0XHRcdC8vIGNsZWFyIHRoZSBhY3RpdmUgc2VsZWN0aW9uXG5cdFx0XHRpZiAoISRpdGVtLmxlbmd0aCkge1xuXHRcdFx0XHQkKHNlbGYuJGFjdGl2ZUl0ZW1zKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdHNlbGYuJGFjdGl2ZUl0ZW1zID0gW107XG5cdFx0XHRcdGlmIChzZWxmLmlzRm9jdXNlZCkge1xuXHRcdFx0XHRcdHNlbGYuc2hvd0lucHV0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcblx0XHRcdC8vIG1vZGlmeSBzZWxlY3Rpb25cblx0XHRcdGV2ZW50TmFtZSA9IGUgJiYgZS50eXBlLnRvTG93ZXJDYXNlKCk7XG5cdFxuXHRcdFx0aWYgKGV2ZW50TmFtZSA9PT0gJ21vdXNlZG93bicgJiYgc2VsZi5pc1NoaWZ0RG93biAmJiBzZWxmLiRhY3RpdmVJdGVtcy5sZW5ndGgpIHtcblx0XHRcdFx0JGxhc3QgPSBzZWxmLiRjb250cm9sLmNoaWxkcmVuKCcuYWN0aXZlOmxhc3QnKTtcblx0XHRcdFx0YmVnaW4gPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5hcHBseShzZWxmLiRjb250cm9sWzBdLmNoaWxkTm9kZXMsIFskbGFzdFswXV0pO1xuXHRcdFx0XHRlbmQgICA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmFwcGx5KHNlbGYuJGNvbnRyb2xbMF0uY2hpbGROb2RlcywgWyRpdGVtWzBdXSk7XG5cdFx0XHRcdGlmIChiZWdpbiA+IGVuZCkge1xuXHRcdFx0XHRcdHN3YXAgID0gYmVnaW47XG5cdFx0XHRcdFx0YmVnaW4gPSBlbmQ7XG5cdFx0XHRcdFx0ZW5kICAgPSBzd2FwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZvciAoaSA9IGJlZ2luOyBpIDw9IGVuZDsgaSsrKSB7XG5cdFx0XHRcdFx0aXRlbSA9IHNlbGYuJGNvbnRyb2xbMF0uY2hpbGROb2Rlc1tpXTtcblx0XHRcdFx0XHRpZiAoc2VsZi4kYWN0aXZlSXRlbXMuaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdCQoaXRlbSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdFx0c2VsZi4kYWN0aXZlSXRlbXMucHVzaChpdGVtKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSBlbHNlIGlmICgoZXZlbnROYW1lID09PSAnbW91c2Vkb3duJyAmJiBzZWxmLmlzQ3RybERvd24pIHx8IChldmVudE5hbWUgPT09ICdrZXlkb3duJyAmJiB0aGlzLmlzU2hpZnREb3duKSkge1xuXHRcdFx0XHRpZiAoJGl0ZW0uaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG5cdFx0XHRcdFx0aWR4ID0gc2VsZi4kYWN0aXZlSXRlbXMuaW5kZXhPZigkaXRlbVswXSk7XG5cdFx0XHRcdFx0c2VsZi4kYWN0aXZlSXRlbXMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlbGYuJGFjdGl2ZUl0ZW1zLnB1c2goJGl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpWzBdKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JChzZWxmLiRhY3RpdmVJdGVtcykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHRzZWxmLiRhY3RpdmVJdGVtcyA9IFskaXRlbS5hZGRDbGFzcygnYWN0aXZlJylbMF1dO1xuXHRcdFx0fVxuXHRcblx0XHRcdC8vIGVuc3VyZSBjb250cm9sIGhhcyBmb2N1c1xuXHRcdFx0c2VsZi5oaWRlSW5wdXQoKTtcblx0XHRcdGlmICghdGhpcy5pc0ZvY3VzZWQpIHtcblx0XHRcdFx0c2VsZi5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFNldHMgdGhlIHNlbGVjdGVkIGl0ZW0gaW4gdGhlIGRyb3Bkb3duIG1lbnVcblx0XHQgKiBvZiBhdmFpbGFibGUgb3B0aW9ucy5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSAkb2JqZWN0XG5cdFx0ICogQHBhcmFtIHtib29sZWFufSBzY3JvbGxcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IGFuaW1hdGVcblx0XHQgKi9cblx0XHRzZXRBY3RpdmVPcHRpb246IGZ1bmN0aW9uKCRvcHRpb24sIHNjcm9sbCwgYW5pbWF0ZSkge1xuXHRcdFx0dmFyIGhlaWdodF9tZW51LCBoZWlnaHRfaXRlbSwgeTtcblx0XHRcdHZhciBzY3JvbGxfdG9wLCBzY3JvbGxfYm90dG9tO1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0XHRcdGlmIChzZWxmLiRhY3RpdmVPcHRpb24pIHNlbGYuJGFjdGl2ZU9wdGlvbi5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRzZWxmLiRhY3RpdmVPcHRpb24gPSBudWxsO1xuXHRcblx0XHRcdCRvcHRpb24gPSAkKCRvcHRpb24pO1xuXHRcdFx0aWYgKCEkb3B0aW9uLmxlbmd0aCkgcmV0dXJuO1xuXHRcblx0XHRcdHNlbGYuJGFjdGl2ZU9wdGlvbiA9ICRvcHRpb24uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcblx0XHRcdGlmIChzY3JvbGwgfHwgIWlzc2V0KHNjcm9sbCkpIHtcblx0XG5cdFx0XHRcdGhlaWdodF9tZW51ICAgPSBzZWxmLiRkcm9wZG93bl9jb250ZW50LmhlaWdodCgpO1xuXHRcdFx0XHRoZWlnaHRfaXRlbSAgID0gc2VsZi4kYWN0aXZlT3B0aW9uLm91dGVySGVpZ2h0KHRydWUpO1xuXHRcdFx0XHRzY3JvbGwgICAgICAgID0gc2VsZi4kZHJvcGRvd25fY29udGVudC5zY3JvbGxUb3AoKSB8fCAwO1xuXHRcdFx0XHR5ICAgICAgICAgICAgID0gc2VsZi4kYWN0aXZlT3B0aW9uLm9mZnNldCgpLnRvcCAtIHNlbGYuJGRyb3Bkb3duX2NvbnRlbnQub2Zmc2V0KCkudG9wICsgc2Nyb2xsO1xuXHRcdFx0XHRzY3JvbGxfdG9wICAgID0geTtcblx0XHRcdFx0c2Nyb2xsX2JvdHRvbSA9IHkgLSBoZWlnaHRfbWVudSArIGhlaWdodF9pdGVtO1xuXHRcblx0XHRcdFx0aWYgKHkgKyBoZWlnaHRfaXRlbSA+IGhlaWdodF9tZW51ICsgc2Nyb2xsKSB7XG5cdFx0XHRcdFx0c2VsZi4kZHJvcGRvd25fY29udGVudC5zdG9wKCkuYW5pbWF0ZSh7c2Nyb2xsVG9wOiBzY3JvbGxfYm90dG9tfSwgYW5pbWF0ZSA/IHNlbGYuc2V0dGluZ3Muc2Nyb2xsRHVyYXRpb24gOiAwKTtcblx0XHRcdFx0fSBlbHNlIGlmICh5IDwgc2Nyb2xsKSB7XG5cdFx0XHRcdFx0c2VsZi4kZHJvcGRvd25fY29udGVudC5zdG9wKCkuYW5pbWF0ZSh7c2Nyb2xsVG9wOiBzY3JvbGxfdG9wfSwgYW5pbWF0ZSA/IHNlbGYuc2V0dGluZ3Muc2Nyb2xsRHVyYXRpb24gOiAwKTtcblx0XHRcdFx0fVxuXHRcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBTZWxlY3RzIGFsbCBpdGVtcyAoQ1RSTCArIEEpLlxuXHRcdCAqL1xuXHRcdHNlbGVjdEFsbDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJykgcmV0dXJuO1xuXHRcblx0XHRcdHNlbGYuJGFjdGl2ZUl0ZW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KHNlbGYuJGNvbnRyb2wuY2hpbGRyZW4oJzpub3QoaW5wdXQpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpKTtcblx0XHRcdGlmIChzZWxmLiRhY3RpdmVJdGVtcy5sZW5ndGgpIHtcblx0XHRcdFx0c2VsZi5oaWRlSW5wdXQoKTtcblx0XHRcdFx0c2VsZi5jbG9zZSgpO1xuXHRcdFx0fVxuXHRcdFx0c2VsZi5mb2N1cygpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIEhpZGVzIHRoZSBpbnB1dCBlbGVtZW50IG91dCBvZiB2aWV3LCB3aGlsZVxuXHRcdCAqIHJldGFpbmluZyBpdHMgZm9jdXMuXG5cdFx0ICovXG5cdFx0aGlkZUlucHV0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XG5cdFx0XHRzZWxmLnNldFRleHRib3hWYWx1ZSgnJyk7XG5cdFx0XHRzZWxmLiRjb250cm9sX2lucHV0LmNzcyh7b3BhY2l0eTogMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHNlbGYucnRsID8gMTAwMDAgOiAtMTAwMDB9KTtcblx0XHRcdHNlbGYuaXNJbnB1dEhpZGRlbiA9IHRydWU7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogUmVzdG9yZXMgaW5wdXQgdmlzaWJpbGl0eS5cblx0XHQgKi9cblx0XHRzaG93SW5wdXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy4kY29udHJvbF9pbnB1dC5jc3Moe29wYWNpdHk6IDEsIHBvc2l0aW9uOiAncmVsYXRpdmUnLCBsZWZ0OiAwfSk7XG5cdFx0XHR0aGlzLmlzSW5wdXRIaWRkZW4gPSBmYWxzZTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBHaXZlcyB0aGUgY29udHJvbCBmb2N1cy5cblx0XHQgKi9cblx0XHRmb2N1czogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRpZiAoc2VsZi5pc0Rpc2FibGVkKSByZXR1cm47XG5cdFxuXHRcdFx0c2VsZi5pZ25vcmVGb2N1cyA9IHRydWU7XG5cdFx0XHRzZWxmLiRjb250cm9sX2lucHV0WzBdLmZvY3VzKCk7XG5cdFx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0c2VsZi5pZ25vcmVGb2N1cyA9IGZhbHNlO1xuXHRcdFx0XHRzZWxmLm9uRm9jdXMoKTtcblx0XHRcdH0sIDApO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIEZvcmNlcyB0aGUgY29udHJvbCBvdXQgb2YgZm9jdXMuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0VsZW1lbnR9IGRlc3Rcblx0XHQgKi9cblx0XHRibHVyOiBmdW5jdGlvbihkZXN0KSB7XG5cdFx0XHR0aGlzLiRjb250cm9sX2lucHV0WzBdLmJsdXIoKTtcblx0XHRcdHRoaXMub25CbHVyKG51bGwsIGRlc3QpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHNjb3JlcyBhbiBvYmplY3Rcblx0XHQgKiB0byBzaG93IGhvdyBnb29kIG9mIGEgbWF0Y2ggaXQgaXMgdG8gdGhlXG5cdFx0ICogcHJvdmlkZWQgcXVlcnkuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gcXVlcnlcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuXHRcdCAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuXHRcdCAqL1xuXHRcdGdldFNjb3JlRnVuY3Rpb246IGZ1bmN0aW9uKHF1ZXJ5KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5zaWZ0ZXIuZ2V0U2NvcmVGdW5jdGlvbihxdWVyeSwgdGhpcy5nZXRTZWFyY2hPcHRpb25zKCkpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJldHVybnMgc2VhcmNoIG9wdGlvbnMgZm9yIHNpZnRlciAodGhlIHN5c3RlbVxuXHRcdCAqIGZvciBzY29yaW5nIGFuZCBzb3J0aW5nIHJlc3VsdHMpLlxuXHRcdCAqXG5cdFx0ICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYnJpYW5yZWF2aXMvc2lmdGVyLmpzXG5cdFx0ICogQHJldHVybiB7b2JqZWN0fVxuXHRcdCAqL1xuXHRcdGdldFNlYXJjaE9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNldHRpbmdzID0gdGhpcy5zZXR0aW5ncztcblx0XHRcdHZhciBzb3J0ID0gc2V0dGluZ3Muc29ydEZpZWxkO1xuXHRcdFx0aWYgKHR5cGVvZiBzb3J0ID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRzb3J0ID0gW3tmaWVsZDogc29ydH1dO1xuXHRcdFx0fVxuXHRcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGZpZWxkcyAgICAgIDogc2V0dGluZ3Muc2VhcmNoRmllbGQsXG5cdFx0XHRcdGNvbmp1bmN0aW9uIDogc2V0dGluZ3Muc2VhcmNoQ29uanVuY3Rpb24sXG5cdFx0XHRcdHNvcnQgICAgICAgIDogc29ydFxuXHRcdFx0fTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBTZWFyY2hlcyB0aHJvdWdoIGF2YWlsYWJsZSBvcHRpb25zIGFuZCByZXR1cm5zXG5cdFx0ICogYSBzb3J0ZWQgYXJyYXkgb2YgbWF0Y2hlcy5cblx0XHQgKlxuXHRcdCAqIFJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmc6XG5cdFx0ICpcblx0XHQgKiAgIC0gcXVlcnkge3N0cmluZ31cblx0XHQgKiAgIC0gdG9rZW5zIHthcnJheX1cblx0XHQgKiAgIC0gdG90YWwge2ludH1cblx0XHQgKiAgIC0gaXRlbXMge2FycmF5fVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5XG5cdFx0ICogQHJldHVybnMge29iamVjdH1cblx0XHQgKi9cblx0XHRzZWFyY2g6IGZ1bmN0aW9uKHF1ZXJ5KSB7XG5cdFx0XHR2YXIgaSwgdmFsdWUsIHNjb3JlLCByZXN1bHQsIGNhbGN1bGF0ZVNjb3JlO1xuXHRcdFx0dmFyIHNlbGYgICAgID0gdGhpcztcblx0XHRcdHZhciBzZXR0aW5ncyA9IHNlbGYuc2V0dGluZ3M7XG5cdFx0XHR2YXIgb3B0aW9ucyAgPSB0aGlzLmdldFNlYXJjaE9wdGlvbnMoKTtcblx0XG5cdFx0XHQvLyB2YWxpZGF0ZSB1c2VyLXByb3ZpZGVkIHJlc3VsdCBzY29yaW5nIGZ1bmN0aW9uXG5cdFx0XHRpZiAoc2V0dGluZ3Muc2NvcmUpIHtcblx0XHRcdFx0Y2FsY3VsYXRlU2NvcmUgPSBzZWxmLnNldHRpbmdzLnNjb3JlLmFwcGx5KHRoaXMsIFtxdWVyeV0pO1xuXHRcdFx0XHRpZiAodHlwZW9mIGNhbGN1bGF0ZVNjb3JlICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdTZWxlY3RpemUgXCJzY29yZVwiIHNldHRpbmcgbXVzdCBiZSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGZ1bmN0aW9uJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XG5cdFx0XHQvLyBwZXJmb3JtIHNlYXJjaFxuXHRcdFx0aWYgKHF1ZXJ5ICE9PSBzZWxmLmxhc3RRdWVyeSkge1xuXHRcdFx0XHRzZWxmLmxhc3RRdWVyeSA9IHF1ZXJ5O1xuXHRcdFx0XHRyZXN1bHQgPSBzZWxmLnNpZnRlci5zZWFyY2gocXVlcnksICQuZXh0ZW5kKG9wdGlvbnMsIHtzY29yZTogY2FsY3VsYXRlU2NvcmV9KSk7XG5cdFx0XHRcdHNlbGYuY3VycmVudFJlc3VsdHMgPSByZXN1bHQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSAkLmV4dGVuZCh0cnVlLCB7fSwgc2VsZi5jdXJyZW50UmVzdWx0cyk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly8gZmlsdGVyIG91dCBzZWxlY3RlZCBpdGVtc1xuXHRcdFx0aWYgKHNldHRpbmdzLmhpZGVTZWxlY3RlZCkge1xuXHRcdFx0XHRmb3IgKGkgPSByZXN1bHQuaXRlbXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHRpZiAoc2VsZi5pdGVtcy5pbmRleE9mKGhhc2hfa2V5KHJlc3VsdC5pdGVtc1tpXS5pZCkpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0Lml0ZW1zLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJlZnJlc2hlcyB0aGUgbGlzdCBvZiBhdmFpbGFibGUgb3B0aW9ucyBzaG93blxuXHRcdCAqIGluIHRoZSBhdXRvY29tcGxldGUgZHJvcGRvd24gbWVudS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gdHJpZ2dlckRyb3Bkb3duXG5cdFx0ICovXG5cdFx0cmVmcmVzaE9wdGlvbnM6IGZ1bmN0aW9uKHRyaWdnZXJEcm9wZG93bikge1xuXHRcdFx0dmFyIGksIGosIGssIG4sIGdyb3VwcywgZ3JvdXBzX29yZGVyLCBvcHRpb24sIG9wdGlvbl9odG1sLCBvcHRncm91cCwgb3B0Z3JvdXBzLCBodG1sLCBodG1sX2NoaWxkcmVuLCBoYXNfY3JlYXRlX29wdGlvbjtcblx0XHRcdHZhciAkYWN0aXZlLCAkYWN0aXZlX2JlZm9yZSwgJGNyZWF0ZTtcblx0XG5cdFx0XHRpZiAodHlwZW9mIHRyaWdnZXJEcm9wZG93biA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0dHJpZ2dlckRyb3Bkb3duID0gdHJ1ZTtcblx0XHRcdH1cblx0XG5cdFx0XHR2YXIgc2VsZiAgICAgICAgICAgICAgPSB0aGlzO1xuXHRcdFx0dmFyIHF1ZXJ5ICAgICAgICAgICAgID0gJC50cmltKHNlbGYuJGNvbnRyb2xfaW5wdXQudmFsKCkpO1xuXHRcdFx0dmFyIHJlc3VsdHMgICAgICAgICAgID0gc2VsZi5zZWFyY2gocXVlcnkpO1xuXHRcdFx0dmFyICRkcm9wZG93bl9jb250ZW50ID0gc2VsZi4kZHJvcGRvd25fY29udGVudDtcblx0XHRcdHZhciBhY3RpdmVfYmVmb3JlICAgICA9IHNlbGYuJGFjdGl2ZU9wdGlvbiAmJiBoYXNoX2tleShzZWxmLiRhY3RpdmVPcHRpb24uYXR0cignZGF0YS12YWx1ZScpKTtcblx0XG5cdFx0XHQvLyBidWlsZCBtYXJrdXBcblx0XHRcdG4gPSByZXN1bHRzLml0ZW1zLmxlbmd0aDtcblx0XHRcdGlmICh0eXBlb2Ygc2VsZi5zZXR0aW5ncy5tYXhPcHRpb25zID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRuID0gTWF0aC5taW4obiwgc2VsZi5zZXR0aW5ncy5tYXhPcHRpb25zKTtcblx0XHRcdH1cblx0XG5cdFx0XHQvLyByZW5kZXIgYW5kIGdyb3VwIGF2YWlsYWJsZSBvcHRpb25zIGluZGl2aWR1YWxseVxuXHRcdFx0Z3JvdXBzID0ge307XG5cdFx0XHRncm91cHNfb3JkZXIgPSBbXTtcblx0XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdG9wdGlvbiAgICAgID0gc2VsZi5vcHRpb25zW3Jlc3VsdHMuaXRlbXNbaV0uaWRdO1xuXHRcdFx0XHRvcHRpb25faHRtbCA9IHNlbGYucmVuZGVyKCdvcHRpb24nLCBvcHRpb24pO1xuXHRcdFx0XHRvcHRncm91cCAgICA9IG9wdGlvbltzZWxmLnNldHRpbmdzLm9wdGdyb3VwRmllbGRdIHx8ICcnO1xuXHRcdFx0XHRvcHRncm91cHMgICA9ICQuaXNBcnJheShvcHRncm91cCkgPyBvcHRncm91cCA6IFtvcHRncm91cF07XG5cdFxuXHRcdFx0XHRmb3IgKGogPSAwLCBrID0gb3B0Z3JvdXBzICYmIG9wdGdyb3Vwcy5sZW5ndGg7IGogPCBrOyBqKyspIHtcblx0XHRcdFx0XHRvcHRncm91cCA9IG9wdGdyb3Vwc1tqXTtcblx0XHRcdFx0XHRpZiAoIXNlbGYub3B0Z3JvdXBzLmhhc093blByb3BlcnR5KG9wdGdyb3VwKSkge1xuXHRcdFx0XHRcdFx0b3B0Z3JvdXAgPSAnJztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCFncm91cHMuaGFzT3duUHJvcGVydHkob3B0Z3JvdXApKSB7XG5cdFx0XHRcdFx0XHRncm91cHNbb3B0Z3JvdXBdID0gW107XG5cdFx0XHRcdFx0XHRncm91cHNfb3JkZXIucHVzaChvcHRncm91cCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGdyb3Vwc1tvcHRncm91cF0ucHVzaChvcHRpb25faHRtbCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XG5cdFx0XHQvLyBzb3J0IG9wdGdyb3Vwc1xuXHRcdFx0aWYgKHRoaXMuc2V0dGluZ3MubG9ja09wdGdyb3VwT3JkZXIpIHtcblx0XHRcdFx0Z3JvdXBzX29yZGVyLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0XHRcdHZhciBhX29yZGVyID0gc2VsZi5vcHRncm91cHNbYV0uJG9yZGVyIHx8IDA7XG5cdFx0XHRcdFx0dmFyIGJfb3JkZXIgPSBzZWxmLm9wdGdyb3Vwc1tiXS4kb3JkZXIgfHwgMDtcblx0XHRcdFx0XHRyZXR1cm4gYV9vcmRlciAtIGJfb3JkZXI7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcblx0XHRcdC8vIHJlbmRlciBvcHRncm91cCBoZWFkZXJzICYgam9pbiBncm91cHNcblx0XHRcdGh0bWwgPSBbXTtcblx0XHRcdGZvciAoaSA9IDAsIG4gPSBncm91cHNfb3JkZXIubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdG9wdGdyb3VwID0gZ3JvdXBzX29yZGVyW2ldO1xuXHRcdFx0XHRpZiAoc2VsZi5vcHRncm91cHMuaGFzT3duUHJvcGVydHkob3B0Z3JvdXApICYmIGdyb3Vwc1tvcHRncm91cF0ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Ly8gcmVuZGVyIHRoZSBvcHRncm91cCBoZWFkZXIgYW5kIG9wdGlvbnMgd2l0aGluIGl0LFxuXHRcdFx0XHRcdC8vIHRoZW4gcGFzcyBpdCB0byB0aGUgd3JhcHBlciB0ZW1wbGF0ZVxuXHRcdFx0XHRcdGh0bWxfY2hpbGRyZW4gPSBzZWxmLnJlbmRlcignb3B0Z3JvdXBfaGVhZGVyJywgc2VsZi5vcHRncm91cHNbb3B0Z3JvdXBdKSB8fCAnJztcblx0XHRcdFx0XHRodG1sX2NoaWxkcmVuICs9IGdyb3Vwc1tvcHRncm91cF0uam9pbignJyk7XG5cdFx0XHRcdFx0aHRtbC5wdXNoKHNlbGYucmVuZGVyKCdvcHRncm91cCcsICQuZXh0ZW5kKHt9LCBzZWxmLm9wdGdyb3Vwc1tvcHRncm91cF0sIHtcblx0XHRcdFx0XHRcdGh0bWw6IGh0bWxfY2hpbGRyZW5cblx0XHRcdFx0XHR9KSkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGh0bWwucHVzaChncm91cHNbb3B0Z3JvdXBdLmpvaW4oJycpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcblx0XHRcdCRkcm9wZG93bl9jb250ZW50Lmh0bWwoaHRtbC5qb2luKCcnKSk7XG5cdFxuXHRcdFx0Ly8gaGlnaGxpZ2h0IG1hdGNoaW5nIHRlcm1zIGlubGluZVxuXHRcdFx0aWYgKHNlbGYuc2V0dGluZ3MuaGlnaGxpZ2h0ICYmIHJlc3VsdHMucXVlcnkubGVuZ3RoICYmIHJlc3VsdHMudG9rZW5zLmxlbmd0aCkge1xuXHRcdFx0XHRmb3IgKGkgPSAwLCBuID0gcmVzdWx0cy50b2tlbnMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdFx0aGlnaGxpZ2h0KCRkcm9wZG93bl9jb250ZW50LCByZXN1bHRzLnRva2Vuc1tpXS5yZWdleCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XG5cdFx0XHQvLyBhZGQgXCJzZWxlY3RlZFwiIGNsYXNzIHRvIHNlbGVjdGVkIG9wdGlvbnNcblx0XHRcdGlmICghc2VsZi5zZXR0aW5ncy5oaWRlU2VsZWN0ZWQpIHtcblx0XHRcdFx0Zm9yIChpID0gMCwgbiA9IHNlbGYuaXRlbXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdFx0c2VsZi5nZXRPcHRpb24oc2VsZi5pdGVtc1tpXSkuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XG5cdFx0XHQvLyBhZGQgY3JlYXRlIG9wdGlvblxuXHRcdFx0aGFzX2NyZWF0ZV9vcHRpb24gPSBzZWxmLmNhbkNyZWF0ZShxdWVyeSk7XG5cdFx0XHRpZiAoaGFzX2NyZWF0ZV9vcHRpb24pIHtcblx0XHRcdFx0JGRyb3Bkb3duX2NvbnRlbnQucHJlcGVuZChzZWxmLnJlbmRlcignb3B0aW9uX2NyZWF0ZScsIHtpbnB1dDogcXVlcnl9KSk7XG5cdFx0XHRcdCRjcmVhdGUgPSAkKCRkcm9wZG93bl9jb250ZW50WzBdLmNoaWxkTm9kZXNbMF0pO1xuXHRcdFx0fVxuXHRcblx0XHRcdC8vIGFjdGl2YXRlXG5cdFx0XHRzZWxmLmhhc09wdGlvbnMgPSByZXN1bHRzLml0ZW1zLmxlbmd0aCA+IDAgfHwgaGFzX2NyZWF0ZV9vcHRpb247XG5cdFx0XHRpZiAoc2VsZi5oYXNPcHRpb25zKSB7XG5cdFx0XHRcdGlmIChyZXN1bHRzLml0ZW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHQkYWN0aXZlX2JlZm9yZSA9IGFjdGl2ZV9iZWZvcmUgJiYgc2VsZi5nZXRPcHRpb24oYWN0aXZlX2JlZm9yZSk7XG5cdFx0XHRcdFx0aWYgKCRhY3RpdmVfYmVmb3JlICYmICRhY3RpdmVfYmVmb3JlLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0JGFjdGl2ZSA9ICRhY3RpdmVfYmVmb3JlO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJyAmJiBzZWxmLml0ZW1zLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0JGFjdGl2ZSA9IHNlbGYuZ2V0T3B0aW9uKHNlbGYuaXRlbXNbMF0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoISRhY3RpdmUgfHwgISRhY3RpdmUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRpZiAoJGNyZWF0ZSAmJiAhc2VsZi5zZXR0aW5ncy5hZGRQcmVjZWRlbmNlKSB7XG5cdFx0XHRcdFx0XHRcdCRhY3RpdmUgPSBzZWxmLmdldEFkamFjZW50T3B0aW9uKCRjcmVhdGUsIDEpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0JGFjdGl2ZSA9ICRkcm9wZG93bl9jb250ZW50LmZpbmQoJ1tkYXRhLXNlbGVjdGFibGVdOmZpcnN0Jyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRhY3RpdmUgPSAkY3JlYXRlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNlbGYuc2V0QWN0aXZlT3B0aW9uKCRhY3RpdmUpO1xuXHRcdFx0XHRpZiAodHJpZ2dlckRyb3Bkb3duICYmICFzZWxmLmlzT3BlbikgeyBzZWxmLm9wZW4oKTsgfVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VsZi5zZXRBY3RpdmVPcHRpb24obnVsbCk7XG5cdFx0XHRcdGlmICh0cmlnZ2VyRHJvcGRvd24gJiYgc2VsZi5pc09wZW4pIHsgc2VsZi5jbG9zZSgpOyB9XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogQWRkcyBhbiBhdmFpbGFibGUgb3B0aW9uLiBJZiBpdCBhbHJlYWR5IGV4aXN0cyxcblx0XHQgKiBub3RoaW5nIHdpbGwgaGFwcGVuLiBOb3RlOiB0aGlzIGRvZXMgbm90IHJlZnJlc2hcblx0XHQgKiB0aGUgb3B0aW9ucyBsaXN0IGRyb3Bkb3duICh1c2UgYHJlZnJlc2hPcHRpb25zYFxuXHRcdCAqIGZvciB0aGF0KS5cblx0XHQgKlxuXHRcdCAqIFVzYWdlOlxuXHRcdCAqXG5cdFx0ICogICB0aGlzLmFkZE9wdGlvbihkYXRhKVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtvYmplY3R8YXJyYXl9IGRhdGFcblx0XHQgKi9cblx0XHRhZGRPcHRpb246IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdHZhciBpLCBuLCB2YWx1ZSwgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdFx0aWYgKCQuaXNBcnJheShkYXRhKSkge1xuXHRcdFx0XHRmb3IgKGkgPSAwLCBuID0gZGF0YS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0XHRzZWxmLmFkZE9wdGlvbihkYXRhW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFxuXHRcdFx0aWYgKHZhbHVlID0gc2VsZi5yZWdpc3Rlck9wdGlvbihkYXRhKSkge1xuXHRcdFx0XHRzZWxmLnVzZXJPcHRpb25zW3ZhbHVlXSA9IHRydWU7XG5cdFx0XHRcdHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblx0XHRcdFx0c2VsZi50cmlnZ2VyKCdvcHRpb25fYWRkJywgdmFsdWUsIGRhdGEpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJlZ2lzdGVycyBhbiBvcHRpb24gdG8gdGhlIHBvb2wgb2Ygb3B0aW9ucy5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbnxzdHJpbmd9XG5cdFx0ICovXG5cdFx0cmVnaXN0ZXJPcHRpb246IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdHZhciBrZXkgPSBoYXNoX2tleShkYXRhW3RoaXMuc2V0dGluZ3MudmFsdWVGaWVsZF0pO1xuXHRcdFx0aWYgKCFrZXkgfHwgdGhpcy5vcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIHJldHVybiBmYWxzZTtcblx0XHRcdGRhdGEuJG9yZGVyID0gZGF0YS4kb3JkZXIgfHwgKyt0aGlzLm9yZGVyO1xuXHRcdFx0dGhpcy5vcHRpb25zW2tleV0gPSBkYXRhO1xuXHRcdFx0cmV0dXJuIGtleTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBSZWdpc3RlcnMgYW4gb3B0aW9uIGdyb3VwIHRvIHRoZSBwb29sIG9mIG9wdGlvbiBncm91cHMuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuXHRcdCAqIEByZXR1cm4ge2Jvb2xlYW58c3RyaW5nfVxuXHRcdCAqL1xuXHRcdHJlZ2lzdGVyT3B0aW9uR3JvdXA6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdHZhciBrZXkgPSBoYXNoX2tleShkYXRhW3RoaXMuc2V0dGluZ3Mub3B0Z3JvdXBWYWx1ZUZpZWxkXSk7XG5cdFx0XHRpZiAoIWtleSkgcmV0dXJuIGZhbHNlO1xuXHRcblx0XHRcdGRhdGEuJG9yZGVyID0gZGF0YS4kb3JkZXIgfHwgKyt0aGlzLm9yZGVyO1xuXHRcdFx0dGhpcy5vcHRncm91cHNba2V5XSA9IGRhdGE7XG5cdFx0XHRyZXR1cm4ga2V5O1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJlZ2lzdGVycyBhIG5ldyBvcHRncm91cCBmb3Igb3B0aW9uc1xuXHRcdCAqIHRvIGJlIGJ1Y2tldGVkIGludG8uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gaWRcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuXHRcdCAqL1xuXHRcdGFkZE9wdGlvbkdyb3VwOiBmdW5jdGlvbihpZCwgZGF0YSkge1xuXHRcdFx0ZGF0YVt0aGlzLnNldHRpbmdzLm9wdGdyb3VwVmFsdWVGaWVsZF0gPSBpZDtcblx0XHRcdGlmIChpZCA9IHRoaXMucmVnaXN0ZXJPcHRpb25Hcm91cChkYXRhKSkge1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ29wdGdyb3VwX2FkZCcsIGlkLCBkYXRhKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBSZW1vdmVzIGFuIGV4aXN0aW5nIG9wdGlvbiBncm91cC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuXHRcdCAqL1xuXHRcdHJlbW92ZU9wdGlvbkdyb3VwOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0aWYgKHRoaXMub3B0Z3JvdXBzLmhhc093blByb3BlcnR5KGlkKSkge1xuXHRcdFx0XHRkZWxldGUgdGhpcy5vcHRncm91cHNbaWRdO1xuXHRcdFx0XHR0aGlzLnJlbmRlckNhY2hlID0ge307XG5cdFx0XHRcdHRoaXMudHJpZ2dlcignb3B0Z3JvdXBfcmVtb3ZlJywgaWQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIENsZWFycyBhbGwgZXhpc3Rpbmcgb3B0aW9uIGdyb3Vwcy5cblx0XHQgKi9cblx0XHRjbGVhck9wdGlvbkdyb3VwczogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLm9wdGdyb3VwcyA9IHt9O1xuXHRcdFx0dGhpcy5yZW5kZXJDYWNoZSA9IHt9O1xuXHRcdFx0dGhpcy50cmlnZ2VyKCdvcHRncm91cF9jbGVhcicpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFVwZGF0ZXMgYW4gb3B0aW9uIGF2YWlsYWJsZSBmb3Igc2VsZWN0aW9uLiBJZlxuXHRcdCAqIGl0IGlzIHZpc2libGUgaW4gdGhlIHNlbGVjdGVkIGl0ZW1zIG9yIG9wdGlvbnNcblx0XHQgKiBkcm9wZG93biwgaXQgd2lsbCBiZSByZS1yZW5kZXJlZCBhdXRvbWF0aWNhbGx5LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IGRhdGFcblx0XHQgKi9cblx0XHR1cGRhdGVPcHRpb246IGZ1bmN0aW9uKHZhbHVlLCBkYXRhKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHR2YXIgJGl0ZW0sICRpdGVtX25ldztcblx0XHRcdHZhciB2YWx1ZV9uZXcsIGluZGV4X2l0ZW0sIGNhY2hlX2l0ZW1zLCBjYWNoZV9vcHRpb25zLCBvcmRlcl9vbGQ7XG5cdFxuXHRcdFx0dmFsdWUgICAgID0gaGFzaF9rZXkodmFsdWUpO1xuXHRcdFx0dmFsdWVfbmV3ID0gaGFzaF9rZXkoZGF0YVtzZWxmLnNldHRpbmdzLnZhbHVlRmllbGRdKTtcblx0XG5cdFx0XHQvLyBzYW5pdHkgY2hlY2tzXG5cdFx0XHRpZiAodmFsdWUgPT09IG51bGwpIHJldHVybjtcblx0XHRcdGlmICghc2VsZi5vcHRpb25zLmhhc093blByb3BlcnR5KHZhbHVlKSkgcmV0dXJuO1xuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZV9uZXcgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIG11c3QgYmUgc2V0IGluIG9wdGlvbiBkYXRhJyk7XG5cdFxuXHRcdFx0b3JkZXJfb2xkID0gc2VsZi5vcHRpb25zW3ZhbHVlXS4kb3JkZXI7XG5cdFxuXHRcdFx0Ly8gdXBkYXRlIHJlZmVyZW5jZXNcblx0XHRcdGlmICh2YWx1ZV9uZXcgIT09IHZhbHVlKSB7XG5cdFx0XHRcdGRlbGV0ZSBzZWxmLm9wdGlvbnNbdmFsdWVdO1xuXHRcdFx0XHRpbmRleF9pdGVtID0gc2VsZi5pdGVtcy5pbmRleE9mKHZhbHVlKTtcblx0XHRcdFx0aWYgKGluZGV4X2l0ZW0gIT09IC0xKSB7XG5cdFx0XHRcdFx0c2VsZi5pdGVtcy5zcGxpY2UoaW5kZXhfaXRlbSwgMSwgdmFsdWVfbmV3KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZGF0YS4kb3JkZXIgPSBkYXRhLiRvcmRlciB8fCBvcmRlcl9vbGQ7XG5cdFx0XHRzZWxmLm9wdGlvbnNbdmFsdWVfbmV3XSA9IGRhdGE7XG5cdFxuXHRcdFx0Ly8gaW52YWxpZGF0ZSByZW5kZXIgY2FjaGVcblx0XHRcdGNhY2hlX2l0ZW1zID0gc2VsZi5yZW5kZXJDYWNoZVsnaXRlbSddO1xuXHRcdFx0Y2FjaGVfb3B0aW9ucyA9IHNlbGYucmVuZGVyQ2FjaGVbJ29wdGlvbiddO1xuXHRcblx0XHRcdGlmIChjYWNoZV9pdGVtcykge1xuXHRcdFx0XHRkZWxldGUgY2FjaGVfaXRlbXNbdmFsdWVdO1xuXHRcdFx0XHRkZWxldGUgY2FjaGVfaXRlbXNbdmFsdWVfbmV3XTtcblx0XHRcdH1cblx0XHRcdGlmIChjYWNoZV9vcHRpb25zKSB7XG5cdFx0XHRcdGRlbGV0ZSBjYWNoZV9vcHRpb25zW3ZhbHVlXTtcblx0XHRcdFx0ZGVsZXRlIGNhY2hlX29wdGlvbnNbdmFsdWVfbmV3XTtcblx0XHRcdH1cblx0XG5cdFx0XHQvLyB1cGRhdGUgdGhlIGl0ZW0gaWYgaXQncyBzZWxlY3RlZFxuXHRcdFx0aWYgKHNlbGYuaXRlbXMuaW5kZXhPZih2YWx1ZV9uZXcpICE9PSAtMSkge1xuXHRcdFx0XHQkaXRlbSA9IHNlbGYuZ2V0SXRlbSh2YWx1ZSk7XG5cdFx0XHRcdCRpdGVtX25ldyA9ICQoc2VsZi5yZW5kZXIoJ2l0ZW0nLCBkYXRhKSk7XG5cdFx0XHRcdGlmICgkaXRlbS5oYXNDbGFzcygnYWN0aXZlJykpICRpdGVtX25ldy5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdCRpdGVtLnJlcGxhY2VXaXRoKCRpdGVtX25ldyk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly8gaW52YWxpZGF0ZSBsYXN0IHF1ZXJ5IGJlY2F1c2Ugd2UgbWlnaHQgaGF2ZSB1cGRhdGVkIHRoZSBzb3J0RmllbGRcblx0XHRcdHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblx0XG5cdFx0XHQvLyB1cGRhdGUgZHJvcGRvd24gY29udGVudHNcblx0XHRcdGlmIChzZWxmLmlzT3Blbikge1xuXHRcdFx0XHRzZWxmLnJlZnJlc2hPcHRpb25zKGZhbHNlKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBSZW1vdmVzIGEgc2luZ2xlIG9wdGlvbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gc2lsZW50XG5cdFx0ICovXG5cdFx0cmVtb3ZlT3B0aW9uOiBmdW5jdGlvbih2YWx1ZSwgc2lsZW50KSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHR2YWx1ZSA9IGhhc2hfa2V5KHZhbHVlKTtcblx0XG5cdFx0XHR2YXIgY2FjaGVfaXRlbXMgPSBzZWxmLnJlbmRlckNhY2hlWydpdGVtJ107XG5cdFx0XHR2YXIgY2FjaGVfb3B0aW9ucyA9IHNlbGYucmVuZGVyQ2FjaGVbJ29wdGlvbiddO1xuXHRcdFx0aWYgKGNhY2hlX2l0ZW1zKSBkZWxldGUgY2FjaGVfaXRlbXNbdmFsdWVdO1xuXHRcdFx0aWYgKGNhY2hlX29wdGlvbnMpIGRlbGV0ZSBjYWNoZV9vcHRpb25zW3ZhbHVlXTtcblx0XG5cdFx0XHRkZWxldGUgc2VsZi51c2VyT3B0aW9uc1t2YWx1ZV07XG5cdFx0XHRkZWxldGUgc2VsZi5vcHRpb25zW3ZhbHVlXTtcblx0XHRcdHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblx0XHRcdHNlbGYudHJpZ2dlcignb3B0aW9uX3JlbW92ZScsIHZhbHVlKTtcblx0XHRcdHNlbGYucmVtb3ZlSXRlbSh2YWx1ZSwgc2lsZW50KTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBDbGVhcnMgYWxsIG9wdGlvbnMuXG5cdFx0ICovXG5cdFx0Y2xlYXJPcHRpb25zOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XG5cdFx0XHRzZWxmLmxvYWRlZFNlYXJjaGVzID0ge307XG5cdFx0XHRzZWxmLnVzZXJPcHRpb25zID0ge307XG5cdFx0XHRzZWxmLnJlbmRlckNhY2hlID0ge307XG5cdFx0XHRzZWxmLm9wdGlvbnMgPSBzZWxmLnNpZnRlci5pdGVtcyA9IHt9O1xuXHRcdFx0c2VsZi5sYXN0UXVlcnkgPSBudWxsO1xuXHRcdFx0c2VsZi50cmlnZ2VyKCdvcHRpb25fY2xlYXInKTtcblx0XHRcdHNlbGYuY2xlYXIoKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBSZXR1cm5zIHRoZSBqUXVlcnkgZWxlbWVudCBvZiB0aGUgb3B0aW9uXG5cdFx0ICogbWF0Y2hpbmcgdGhlIGdpdmVuIHZhbHVlLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG5cdFx0ICogQHJldHVybnMge29iamVjdH1cblx0XHQgKi9cblx0XHRnZXRPcHRpb246IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5nZXRFbGVtZW50V2l0aFZhbHVlKHZhbHVlLCB0aGlzLiRkcm9wZG93bl9jb250ZW50LmZpbmQoJ1tkYXRhLXNlbGVjdGFibGVdJykpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJldHVybnMgdGhlIGpRdWVyeSBlbGVtZW50IG9mIHRoZSBuZXh0IG9yXG5cdFx0ICogcHJldmlvdXMgc2VsZWN0YWJsZSBvcHRpb24uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gJG9wdGlvblxuXHRcdCAqIEBwYXJhbSB7aW50fSBkaXJlY3Rpb24gIGNhbiBiZSAxIGZvciBuZXh0IG9yIC0xIGZvciBwcmV2aW91c1xuXHRcdCAqIEByZXR1cm4ge29iamVjdH1cblx0XHQgKi9cblx0XHRnZXRBZGphY2VudE9wdGlvbjogZnVuY3Rpb24oJG9wdGlvbiwgZGlyZWN0aW9uKSB7XG5cdFx0XHR2YXIgJG9wdGlvbnMgPSB0aGlzLiRkcm9wZG93bi5maW5kKCdbZGF0YS1zZWxlY3RhYmxlXScpO1xuXHRcdFx0dmFyIGluZGV4ICAgID0gJG9wdGlvbnMuaW5kZXgoJG9wdGlvbikgKyBkaXJlY3Rpb247XG5cdFxuXHRcdFx0cmV0dXJuIGluZGV4ID49IDAgJiYgaW5kZXggPCAkb3B0aW9ucy5sZW5ndGggPyAkb3B0aW9ucy5lcShpbmRleCkgOiAkKCk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogRmluZHMgdGhlIGZpcnN0IGVsZW1lbnQgd2l0aCBhIFwiZGF0YS12YWx1ZVwiIGF0dHJpYnV0ZVxuXHRcdCAqIHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW4gdmFsdWUuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge21peGVkfSB2YWx1ZVxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSAkZWxzXG5cdFx0ICogQHJldHVybiB7b2JqZWN0fVxuXHRcdCAqL1xuXHRcdGdldEVsZW1lbnRXaXRoVmFsdWU6IGZ1bmN0aW9uKHZhbHVlLCAkZWxzKSB7XG5cdFx0XHR2YWx1ZSA9IGhhc2hfa2V5KHZhbHVlKTtcblx0XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbiA9ICRlbHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKCRlbHNbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJykgPT09IHZhbHVlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJCgkZWxzW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XG5cdFx0XHRyZXR1cm4gJCgpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJldHVybnMgdGhlIGpRdWVyeSBlbGVtZW50IG9mIHRoZSBpdGVtXG5cdFx0ICogbWF0Y2hpbmcgdGhlIGdpdmVuIHZhbHVlLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG5cdFx0ICogQHJldHVybnMge29iamVjdH1cblx0XHQgKi9cblx0XHRnZXRJdGVtOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0RWxlbWVudFdpdGhWYWx1ZSh2YWx1ZSwgdGhpcy4kY29udHJvbC5jaGlsZHJlbigpKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBcIlNlbGVjdHNcIiBtdWx0aXBsZSBpdGVtcyBhdCBvbmNlLiBBZGRzIHRoZW0gdG8gdGhlIGxpc3Rcblx0XHQgKiBhdCB0aGUgY3VycmVudCBjYXJldCBwb3NpdGlvbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gc2lsZW50XG5cdFx0ICovXG5cdFx0YWRkSXRlbXM6IGZ1bmN0aW9uKHZhbHVlcywgc2lsZW50KSB7XG5cdFx0XHR2YXIgaXRlbXMgPSAkLmlzQXJyYXkodmFsdWVzKSA/IHZhbHVlcyA6IFt2YWx1ZXNdO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIG4gPSBpdGVtcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0dGhpcy5pc1BlbmRpbmcgPSAoaSA8IG4gLSAxKTtcblx0XHRcdFx0dGhpcy5hZGRJdGVtKGl0ZW1zW2ldLCBzaWxlbnQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFwiU2VsZWN0c1wiIGFuIGl0ZW0uIEFkZHMgaXQgdG8gdGhlIGxpc3Rcblx0XHQgKiBhdCB0aGUgY3VycmVudCBjYXJldCBwb3NpdGlvbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gc2lsZW50XG5cdFx0ICovXG5cdFx0YWRkSXRlbTogZnVuY3Rpb24odmFsdWUsIHNpbGVudCkge1xuXHRcdFx0dmFyIGV2ZW50cyA9IHNpbGVudCA/IFtdIDogWydjaGFuZ2UnXTtcblx0XG5cdFx0XHRkZWJvdW5jZV9ldmVudHModGhpcywgZXZlbnRzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyICRpdGVtLCAkb3B0aW9uLCAkb3B0aW9ucztcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XHR2YXIgaW5wdXRNb2RlID0gc2VsZi5zZXR0aW5ncy5tb2RlO1xuXHRcdFx0XHR2YXIgaSwgYWN0aXZlLCB2YWx1ZV9uZXh0LCB3YXNGdWxsO1xuXHRcdFx0XHR2YWx1ZSA9IGhhc2hfa2V5KHZhbHVlKTtcblx0XG5cdFx0XHRcdGlmIChzZWxmLml0ZW1zLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuXHRcdFx0XHRcdGlmIChpbnB1dE1vZGUgPT09ICdzaW5nbGUnKSBzZWxmLmNsb3NlKCk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFxuXHRcdFx0XHRpZiAoIXNlbGYub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHJldHVybjtcblx0XHRcdFx0aWYgKGlucHV0TW9kZSA9PT0gJ3NpbmdsZScpIHNlbGYuY2xlYXIoc2lsZW50KTtcblx0XHRcdFx0aWYgKGlucHV0TW9kZSA9PT0gJ211bHRpJyAmJiBzZWxmLmlzRnVsbCgpKSByZXR1cm47XG5cdFxuXHRcdFx0XHQkaXRlbSA9ICQoc2VsZi5yZW5kZXIoJ2l0ZW0nLCBzZWxmLm9wdGlvbnNbdmFsdWVdKSk7XG5cdFx0XHRcdHdhc0Z1bGwgPSBzZWxmLmlzRnVsbCgpO1xuXHRcdFx0XHRzZWxmLml0ZW1zLnNwbGljZShzZWxmLmNhcmV0UG9zLCAwLCB2YWx1ZSk7XG5cdFx0XHRcdHNlbGYuaW5zZXJ0QXRDYXJldCgkaXRlbSk7XG5cdFx0XHRcdGlmICghc2VsZi5pc1BlbmRpbmcgfHwgKCF3YXNGdWxsICYmIHNlbGYuaXNGdWxsKCkpKSB7XG5cdFx0XHRcdFx0c2VsZi5yZWZyZXNoU3RhdGUoKTtcblx0XHRcdFx0fVxuXHRcblx0XHRcdFx0aWYgKHNlbGYuaXNTZXR1cCkge1xuXHRcdFx0XHRcdCRvcHRpb25zID0gc2VsZi4kZHJvcGRvd25fY29udGVudC5maW5kKCdbZGF0YS1zZWxlY3RhYmxlXScpO1xuXHRcblx0XHRcdFx0XHQvLyB1cGRhdGUgbWVudSAvIHJlbW92ZSB0aGUgb3B0aW9uIChpZiB0aGlzIGlzIG5vdCBvbmUgaXRlbSBiZWluZyBhZGRlZCBhcyBwYXJ0IG9mIHNlcmllcylcblx0XHRcdFx0XHRpZiAoIXNlbGYuaXNQZW5kaW5nKSB7XG5cdFx0XHRcdFx0XHQkb3B0aW9uID0gc2VsZi5nZXRPcHRpb24odmFsdWUpO1xuXHRcdFx0XHRcdFx0dmFsdWVfbmV4dCA9IHNlbGYuZ2V0QWRqYWNlbnRPcHRpb24oJG9wdGlvbiwgMSkuYXR0cignZGF0YS12YWx1ZScpO1xuXHRcdFx0XHRcdFx0c2VsZi5yZWZyZXNoT3B0aW9ucyhzZWxmLmlzRm9jdXNlZCAmJiBpbnB1dE1vZGUgIT09ICdzaW5nbGUnKTtcblx0XHRcdFx0XHRcdGlmICh2YWx1ZV9uZXh0KSB7XG5cdFx0XHRcdFx0XHRcdHNlbGYuc2V0QWN0aXZlT3B0aW9uKHNlbGYuZ2V0T3B0aW9uKHZhbHVlX25leHQpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFxuXHRcdFx0XHRcdC8vIGhpZGUgdGhlIG1lbnUgaWYgdGhlIG1heGltdW0gbnVtYmVyIG9mIGl0ZW1zIGhhdmUgYmVlbiBzZWxlY3RlZCBvciBubyBvcHRpb25zIGFyZSBsZWZ0XG5cdFx0XHRcdFx0aWYgKCEkb3B0aW9ucy5sZW5ndGggfHwgc2VsZi5pc0Z1bGwoKSkge1xuXHRcdFx0XHRcdFx0c2VsZi5jbG9zZSgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzZWxmLnBvc2l0aW9uRHJvcGRvd24oKTtcblx0XHRcdFx0XHR9XG5cdFxuXHRcdFx0XHRcdHNlbGYudXBkYXRlUGxhY2Vob2xkZXIoKTtcblx0XHRcdFx0XHRzZWxmLnRyaWdnZXIoJ2l0ZW1fYWRkJywgdmFsdWUsICRpdGVtKTtcblx0XHRcdFx0XHRzZWxmLnVwZGF0ZU9yaWdpbmFsSW5wdXQoe3NpbGVudDogc2lsZW50fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJlbW92ZXMgdGhlIHNlbGVjdGVkIGl0ZW0gbWF0Y2hpbmdcblx0XHQgKiB0aGUgcHJvdmlkZWQgdmFsdWUuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcblx0XHQgKi9cblx0XHRyZW1vdmVJdGVtOiBmdW5jdGlvbih2YWx1ZSwgc2lsZW50KSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHR2YXIgJGl0ZW0sIGksIGlkeDtcblx0XG5cdFx0XHQkaXRlbSA9ICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSA/IHZhbHVlIDogc2VsZi5nZXRJdGVtKHZhbHVlKTtcblx0XHRcdHZhbHVlID0gaGFzaF9rZXkoJGl0ZW0uYXR0cignZGF0YS12YWx1ZScpKTtcblx0XHRcdGkgPSBzZWxmLml0ZW1zLmluZGV4T2YodmFsdWUpO1xuXHRcblx0XHRcdGlmIChpICE9PSAtMSkge1xuXHRcdFx0XHQkaXRlbS5yZW1vdmUoKTtcblx0XHRcdFx0aWYgKCRpdGVtLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRcdGlkeCA9IHNlbGYuJGFjdGl2ZUl0ZW1zLmluZGV4T2YoJGl0ZW1bMF0pO1xuXHRcdFx0XHRcdHNlbGYuJGFjdGl2ZUl0ZW1zLnNwbGljZShpZHgsIDEpO1xuXHRcdFx0XHR9XG5cdFxuXHRcdFx0XHRzZWxmLml0ZW1zLnNwbGljZShpLCAxKTtcblx0XHRcdFx0c2VsZi5sYXN0UXVlcnkgPSBudWxsO1xuXHRcdFx0XHRpZiAoIXNlbGYuc2V0dGluZ3MucGVyc2lzdCAmJiBzZWxmLnVzZXJPcHRpb25zLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuXHRcdFx0XHRcdHNlbGYucmVtb3ZlT3B0aW9uKHZhbHVlLCBzaWxlbnQpO1xuXHRcdFx0XHR9XG5cdFxuXHRcdFx0XHRpZiAoaSA8IHNlbGYuY2FyZXRQb3MpIHtcblx0XHRcdFx0XHRzZWxmLnNldENhcmV0KHNlbGYuY2FyZXRQb3MgLSAxKTtcblx0XHRcdFx0fVxuXHRcblx0XHRcdFx0c2VsZi5yZWZyZXNoU3RhdGUoKTtcblx0XHRcdFx0c2VsZi51cGRhdGVQbGFjZWhvbGRlcigpO1xuXHRcdFx0XHRzZWxmLnVwZGF0ZU9yaWdpbmFsSW5wdXQoe3NpbGVudDogc2lsZW50fSk7XG5cdFx0XHRcdHNlbGYucG9zaXRpb25Ecm9wZG93bigpO1xuXHRcdFx0XHRzZWxmLnRyaWdnZXIoJ2l0ZW1fcmVtb3ZlJywgdmFsdWUsICRpdGVtKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBJbnZva2VzIHRoZSBgY3JlYXRlYCBtZXRob2QgcHJvdmlkZWQgaW4gdGhlXG5cdFx0ICogc2VsZWN0aXplIG9wdGlvbnMgdGhhdCBzaG91bGQgcHJvdmlkZSB0aGUgZGF0YVxuXHRcdCAqIGZvciB0aGUgbmV3IGl0ZW0sIGdpdmVuIHRoZSB1c2VyIGlucHV0LlxuXHRcdCAqXG5cdFx0ICogT25jZSB0aGlzIGNvbXBsZXRlcywgaXQgd2lsbCBiZSBhZGRlZFxuXHRcdCAqIHRvIHRoZSBpdGVtIGxpc3QuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IFt0cmlnZ2VyRHJvcGRvd25dXG5cdFx0ICogQHBhcmFtIHtmdW5jdGlvbn0gW2NhbGxiYWNrXVxuXHRcdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0Y3JlYXRlSXRlbTogZnVuY3Rpb24oaW5wdXQsIHRyaWdnZXJEcm9wZG93bikge1xuXHRcdFx0dmFyIHNlbGYgID0gdGhpcztcblx0XHRcdHZhciBjYXJldCA9IHNlbGYuY2FyZXRQb3M7XG5cdFx0XHRpbnB1dCA9IGlucHV0IHx8ICQudHJpbShzZWxmLiRjb250cm9sX2lucHV0LnZhbCgpIHx8ICcnKTtcblx0XG5cdFx0XHR2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdO1xuXHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHt9O1xuXHRcblx0XHRcdGlmICh0eXBlb2YgdHJpZ2dlckRyb3Bkb3duICE9PSAnYm9vbGVhbicpIHtcblx0XHRcdFx0dHJpZ2dlckRyb3Bkb3duID0gdHJ1ZTtcblx0XHRcdH1cblx0XG5cdFx0XHRpZiAoIXNlbGYuY2FuQ3JlYXRlKGlucHV0KSkge1xuXHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFxuXHRcdFx0c2VsZi5sb2NrKCk7XG5cdFxuXHRcdFx0dmFyIHNldHVwID0gKHR5cGVvZiBzZWxmLnNldHRpbmdzLmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykgPyB0aGlzLnNldHRpbmdzLmNyZWF0ZSA6IGZ1bmN0aW9uKGlucHV0KSB7XG5cdFx0XHRcdHZhciBkYXRhID0ge307XG5cdFx0XHRcdGRhdGFbc2VsZi5zZXR0aW5ncy5sYWJlbEZpZWxkXSA9IGlucHV0O1xuXHRcdFx0XHRkYXRhW3NlbGYuc2V0dGluZ3MudmFsdWVGaWVsZF0gPSBpbnB1dDtcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9O1xuXHRcblx0XHRcdHZhciBjcmVhdGUgPSBvbmNlKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0c2VsZi51bmxvY2soKTtcblx0XG5cdFx0XHRcdGlmICghZGF0YSB8fCB0eXBlb2YgZGF0YSAhPT0gJ29iamVjdCcpIHJldHVybiBjYWxsYmFjaygpO1xuXHRcdFx0XHR2YXIgdmFsdWUgPSBoYXNoX2tleShkYXRhW3NlbGYuc2V0dGluZ3MudmFsdWVGaWVsZF0pO1xuXHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykgcmV0dXJuIGNhbGxiYWNrKCk7XG5cdFxuXHRcdFx0XHRzZWxmLnNldFRleHRib3hWYWx1ZSgnJyk7XG5cdFx0XHRcdHNlbGYuYWRkT3B0aW9uKGRhdGEpO1xuXHRcdFx0XHRzZWxmLnNldENhcmV0KGNhcmV0KTtcblx0XHRcdFx0c2VsZi5hZGRJdGVtKHZhbHVlKTtcblx0XHRcdFx0c2VsZi5yZWZyZXNoT3B0aW9ucyh0cmlnZ2VyRHJvcGRvd24gJiYgc2VsZi5zZXR0aW5ncy5tb2RlICE9PSAnc2luZ2xlJyk7XG5cdFx0XHRcdGNhbGxiYWNrKGRhdGEpO1xuXHRcdFx0fSk7XG5cdFxuXHRcdFx0dmFyIG91dHB1dCA9IHNldHVwLmFwcGx5KHRoaXMsIFtpbnB1dCwgY3JlYXRlXSk7XG5cdFx0XHRpZiAodHlwZW9mIG91dHB1dCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0Y3JlYXRlKG91dHB1dCk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogUmUtcmVuZGVycyB0aGUgc2VsZWN0ZWQgaXRlbSBsaXN0cy5cblx0XHQgKi9cblx0XHRyZWZyZXNoSXRlbXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5sYXN0UXVlcnkgPSBudWxsO1xuXHRcblx0XHRcdGlmICh0aGlzLmlzU2V0dXApIHtcblx0XHRcdFx0dGhpcy5hZGRJdGVtKHRoaXMuaXRlbXMpO1xuXHRcdFx0fVxuXHRcblx0XHRcdHRoaXMucmVmcmVzaFN0YXRlKCk7XG5cdFx0XHR0aGlzLnVwZGF0ZU9yaWdpbmFsSW5wdXQoKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBVcGRhdGVzIGFsbCBzdGF0ZS1kZXBlbmRlbnQgYXR0cmlidXRlc1xuXHRcdCAqIGFuZCBDU1MgY2xhc3Nlcy5cblx0XHQgKi9cblx0XHRyZWZyZXNoU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGludmFsaWQsIHNlbGYgPSB0aGlzO1xuXHRcdFx0aWYgKHNlbGYuaXNSZXF1aXJlZCkge1xuXHRcdFx0XHRpZiAoc2VsZi5pdGVtcy5sZW5ndGgpIHNlbGYuaXNJbnZhbGlkID0gZmFsc2U7XG5cdFx0XHRcdHNlbGYuJGNvbnRyb2xfaW5wdXQucHJvcCgncmVxdWlyZWQnLCBpbnZhbGlkKTtcblx0XHRcdH1cblx0XHRcdHNlbGYucmVmcmVzaENsYXNzZXMoKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBVcGRhdGVzIGFsbCBzdGF0ZS1kZXBlbmRlbnQgQ1NTIGNsYXNzZXMuXG5cdFx0ICovXG5cdFx0cmVmcmVzaENsYXNzZXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgICAgID0gdGhpcztcblx0XHRcdHZhciBpc0Z1bGwgICA9IHNlbGYuaXNGdWxsKCk7XG5cdFx0XHR2YXIgaXNMb2NrZWQgPSBzZWxmLmlzTG9ja2VkO1xuXHRcblx0XHRcdHNlbGYuJHdyYXBwZXJcblx0XHRcdFx0LnRvZ2dsZUNsYXNzKCdydGwnLCBzZWxmLnJ0bCk7XG5cdFxuXHRcdFx0c2VsZi4kY29udHJvbFxuXHRcdFx0XHQudG9nZ2xlQ2xhc3MoJ2ZvY3VzJywgc2VsZi5pc0ZvY3VzZWQpXG5cdFx0XHRcdC50b2dnbGVDbGFzcygnZGlzYWJsZWQnLCBzZWxmLmlzRGlzYWJsZWQpXG5cdFx0XHRcdC50b2dnbGVDbGFzcygncmVxdWlyZWQnLCBzZWxmLmlzUmVxdWlyZWQpXG5cdFx0XHRcdC50b2dnbGVDbGFzcygnaW52YWxpZCcsIHNlbGYuaXNJbnZhbGlkKVxuXHRcdFx0XHQudG9nZ2xlQ2xhc3MoJ2xvY2tlZCcsIGlzTG9ja2VkKVxuXHRcdFx0XHQudG9nZ2xlQ2xhc3MoJ2Z1bGwnLCBpc0Z1bGwpLnRvZ2dsZUNsYXNzKCdub3QtZnVsbCcsICFpc0Z1bGwpXG5cdFx0XHRcdC50b2dnbGVDbGFzcygnaW5wdXQtYWN0aXZlJywgc2VsZi5pc0ZvY3VzZWQgJiYgIXNlbGYuaXNJbnB1dEhpZGRlbilcblx0XHRcdFx0LnRvZ2dsZUNsYXNzKCdkcm9wZG93bi1hY3RpdmUnLCBzZWxmLmlzT3Blbilcblx0XHRcdFx0LnRvZ2dsZUNsYXNzKCdoYXMtb3B0aW9ucycsICEkLmlzRW1wdHlPYmplY3Qoc2VsZi5vcHRpb25zKSlcblx0XHRcdFx0LnRvZ2dsZUNsYXNzKCdoYXMtaXRlbXMnLCBzZWxmLml0ZW1zLmxlbmd0aCA+IDApO1xuXHRcblx0XHRcdHNlbGYuJGNvbnRyb2xfaW5wdXQuZGF0YSgnZ3JvdycsICFpc0Z1bGwgJiYgIWlzTG9ja2VkKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IG1vcmUgaXRlbXMgY2FuIGJlIGFkZGVkXG5cdFx0ICogdG8gdGhlIGNvbnRyb2wgd2l0aG91dCBleGNlZWRpbmcgdGhlIHVzZXItZGVmaW5lZCBtYXhpbXVtLlxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0aXNGdWxsOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLnNldHRpbmdzLm1heEl0ZW1zICE9PSBudWxsICYmIHRoaXMuaXRlbXMubGVuZ3RoID49IHRoaXMuc2V0dGluZ3MubWF4SXRlbXM7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogUmVmcmVzaGVzIHRoZSBvcmlnaW5hbCA8c2VsZWN0PiBvciA8aW5wdXQ+XG5cdFx0ICogZWxlbWVudCB0byByZWZsZWN0IHRoZSBjdXJyZW50IHN0YXRlLlxuXHRcdCAqL1xuXHRcdHVwZGF0ZU9yaWdpbmFsSW5wdXQ6IGZ1bmN0aW9uKG9wdHMpIHtcblx0XHRcdHZhciBpLCBuLCBvcHRpb25zLCBsYWJlbCwgc2VsZiA9IHRoaXM7XG5cdFx0XHRvcHRzID0gb3B0cyB8fCB7fTtcblx0XG5cdFx0XHRpZiAoc2VsZi50YWdUeXBlID09PSBUQUdfU0VMRUNUKSB7XG5cdFx0XHRcdG9wdGlvbnMgPSBbXTtcblx0XHRcdFx0Zm9yIChpID0gMCwgbiA9IHNlbGYuaXRlbXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdFx0bGFiZWwgPSBzZWxmLm9wdGlvbnNbc2VsZi5pdGVtc1tpXV1bc2VsZi5zZXR0aW5ncy5sYWJlbEZpZWxkXSB8fCAnJztcblx0XHRcdFx0XHRvcHRpb25zLnB1c2goJzxvcHRpb24gdmFsdWU9XCInICsgZXNjYXBlX2h0bWwoc2VsZi5pdGVtc1tpXSkgKyAnXCIgc2VsZWN0ZWQ9XCJzZWxlY3RlZFwiPicgKyBlc2NhcGVfaHRtbChsYWJlbCkgKyAnPC9vcHRpb24+Jyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFvcHRpb25zLmxlbmd0aCAmJiAhdGhpcy4kaW5wdXQuYXR0cignbXVsdGlwbGUnKSkge1xuXHRcdFx0XHRcdG9wdGlvbnMucHVzaCgnPG9wdGlvbiB2YWx1ZT1cIlwiIHNlbGVjdGVkPVwic2VsZWN0ZWRcIj48L29wdGlvbj4nKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzZWxmLiRpbnB1dC5odG1sKG9wdGlvbnMuam9pbignJykpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VsZi4kaW5wdXQudmFsKHNlbGYuZ2V0VmFsdWUoKSk7XG5cdFx0XHRcdHNlbGYuJGlucHV0LmF0dHIoJ3ZhbHVlJyxzZWxmLiRpbnB1dC52YWwoKSk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0aWYgKHNlbGYuaXNTZXR1cCkge1xuXHRcdFx0XHRpZiAoIW9wdHMuc2lsZW50KSB7XG5cdFx0XHRcdFx0c2VsZi50cmlnZ2VyKCdjaGFuZ2UnLCBzZWxmLiRpbnB1dC52YWwoKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBTaG93cy9oaWRlIHRoZSBpbnB1dCBwbGFjZWhvbGRlciBkZXBlbmRpbmdcblx0XHQgKiBvbiBpZiB0aGVyZSBpdGVtcyBpbiB0aGUgbGlzdCBhbHJlYWR5LlxuXHRcdCAqL1xuXHRcdHVwZGF0ZVBsYWNlaG9sZGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICghdGhpcy5zZXR0aW5ncy5wbGFjZWhvbGRlcikgcmV0dXJuO1xuXHRcdFx0dmFyICRpbnB1dCA9IHRoaXMuJGNvbnRyb2xfaW5wdXQ7XG5cdFxuXHRcdFx0aWYgKHRoaXMuaXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdCRpbnB1dC5yZW1vdmVBdHRyKCdwbGFjZWhvbGRlcicpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJywgdGhpcy5zZXR0aW5ncy5wbGFjZWhvbGRlcik7XG5cdFx0XHR9XG5cdFx0XHQkaW5wdXQudHJpZ2dlckhhbmRsZXIoJ3VwZGF0ZScsIHtmb3JjZTogdHJ1ZX0pO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFNob3dzIHRoZSBhdXRvY29tcGxldGUgZHJvcGRvd24gY29udGFpbmluZ1xuXHRcdCAqIHRoZSBhdmFpbGFibGUgb3B0aW9ucy5cblx0XHQgKi9cblx0XHRvcGVuOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XG5cdFx0XHRpZiAoc2VsZi5pc0xvY2tlZCB8fCBzZWxmLmlzT3BlbiB8fCAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnbXVsdGknICYmIHNlbGYuaXNGdWxsKCkpKSByZXR1cm47XG5cdFx0XHRzZWxmLmZvY3VzKCk7XG5cdFx0XHRzZWxmLmlzT3BlbiA9IHRydWU7XG5cdFx0XHRzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHRcdFx0c2VsZi4kZHJvcGRvd24uY3NzKHt2aXNpYmlsaXR5OiAnaGlkZGVuJywgZGlzcGxheTogJ2Jsb2NrJ30pO1xuXHRcdFx0c2VsZi5wb3NpdGlvbkRyb3Bkb3duKCk7XG5cdFx0XHRzZWxmLiRkcm9wZG93bi5jc3Moe3Zpc2liaWxpdHk6ICd2aXNpYmxlJ30pO1xuXHRcdFx0c2VsZi50cmlnZ2VyKCdkcm9wZG93bl9vcGVuJywgc2VsZi4kZHJvcGRvd24pO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIENsb3NlcyB0aGUgYXV0b2NvbXBsZXRlIGRyb3Bkb3duIG1lbnUuXG5cdFx0ICovXG5cdFx0Y2xvc2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyIHRyaWdnZXIgPSBzZWxmLmlzT3Blbjtcblx0XG5cdFx0XHRpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJyAmJiBzZWxmLml0ZW1zLmxlbmd0aCkge1xuXHRcdFx0XHRzZWxmLmhpZGVJbnB1dCgpO1xuXHRcdFx0fVxuXHRcblx0XHRcdHNlbGYuaXNPcGVuID0gZmFsc2U7XG5cdFx0XHRzZWxmLiRkcm9wZG93bi5oaWRlKCk7XG5cdFx0XHRzZWxmLnNldEFjdGl2ZU9wdGlvbihudWxsKTtcblx0XHRcdHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdFxuXHRcdFx0aWYgKHRyaWdnZXIpIHNlbGYudHJpZ2dlcignZHJvcGRvd25fY2xvc2UnLCBzZWxmLiRkcm9wZG93bik7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogQ2FsY3VsYXRlcyBhbmQgYXBwbGllcyB0aGUgYXBwcm9wcmlhdGVcblx0XHQgKiBwb3NpdGlvbiBvZiB0aGUgZHJvcGRvd24uXG5cdFx0ICovXG5cdFx0cG9zaXRpb25Ecm9wZG93bjogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJGNvbnRyb2wgPSB0aGlzLiRjb250cm9sO1xuXHRcdFx0dmFyIG9mZnNldCA9IHRoaXMuc2V0dGluZ3MuZHJvcGRvd25QYXJlbnQgPT09ICdib2R5JyA/ICRjb250cm9sLm9mZnNldCgpIDogJGNvbnRyb2wucG9zaXRpb24oKTtcblx0XHRcdG9mZnNldC50b3AgKz0gJGNvbnRyb2wub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cdFxuXHRcdFx0dGhpcy4kZHJvcGRvd24uY3NzKHtcblx0XHRcdFx0d2lkdGggOiAkY29udHJvbC5vdXRlcldpZHRoKCksXG5cdFx0XHRcdHRvcCAgIDogb2Zmc2V0LnRvcCxcblx0XHRcdFx0bGVmdCAgOiBvZmZzZXQubGVmdFxuXHRcdFx0fSk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogUmVzZXRzIC8gY2xlYXJzIGFsbCBzZWxlY3RlZCBpdGVtc1xuXHRcdCAqIGZyb20gdGhlIGNvbnRyb2wuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IHNpbGVudFxuXHRcdCAqL1xuXHRcdGNsZWFyOiBmdW5jdGlvbihzaWxlbnQpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XG5cdFx0XHRpZiAoIXNlbGYuaXRlbXMubGVuZ3RoKSByZXR1cm47XG5cdFx0XHRzZWxmLiRjb250cm9sLmNoaWxkcmVuKCc6bm90KGlucHV0KScpLnJlbW92ZSgpO1xuXHRcdFx0c2VsZi5pdGVtcyA9IFtdO1xuXHRcdFx0c2VsZi5sYXN0UXVlcnkgPSBudWxsO1xuXHRcdFx0c2VsZi5zZXRDYXJldCgwKTtcblx0XHRcdHNlbGYuc2V0QWN0aXZlSXRlbShudWxsKTtcblx0XHRcdHNlbGYudXBkYXRlUGxhY2Vob2xkZXIoKTtcblx0XHRcdHNlbGYudXBkYXRlT3JpZ2luYWxJbnB1dCh7c2lsZW50OiBzaWxlbnR9KTtcblx0XHRcdHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdFx0XHRzZWxmLnNob3dJbnB1dCgpO1xuXHRcdFx0c2VsZi50cmlnZ2VyKCdjbGVhcicpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIEEgaGVscGVyIG1ldGhvZCBmb3IgaW5zZXJ0aW5nIGFuIGVsZW1lbnRcblx0XHQgKiBhdCB0aGUgY3VycmVudCBjYXJldCBwb3NpdGlvbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSAkZWxcblx0XHQgKi9cblx0XHRpbnNlcnRBdENhcmV0OiBmdW5jdGlvbigkZWwpIHtcblx0XHRcdHZhciBjYXJldCA9IE1hdGgubWluKHRoaXMuY2FyZXRQb3MsIHRoaXMuaXRlbXMubGVuZ3RoKTtcblx0XHRcdGlmIChjYXJldCA9PT0gMCkge1xuXHRcdFx0XHR0aGlzLiRjb250cm9sLnByZXBlbmQoJGVsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQodGhpcy4kY29udHJvbFswXS5jaGlsZE5vZGVzW2NhcmV0XSkuYmVmb3JlKCRlbCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnNldENhcmV0KGNhcmV0ICsgMSk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogUmVtb3ZlcyB0aGUgY3VycmVudCBzZWxlY3RlZCBpdGVtKHMpLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IGUgKG9wdGlvbmFsKVxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdGRlbGV0ZVNlbGVjdGlvbjogZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIGksIG4sIGRpcmVjdGlvbiwgc2VsZWN0aW9uLCB2YWx1ZXMsIGNhcmV0LCBvcHRpb25fc2VsZWN0LCAkb3B0aW9uX3NlbGVjdCwgJHRhaWw7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdFx0ZGlyZWN0aW9uID0gKGUgJiYgZS5rZXlDb2RlID09PSBLRVlfQkFDS1NQQUNFKSA/IC0xIDogMTtcblx0XHRcdHNlbGVjdGlvbiA9IGdldFNlbGVjdGlvbihzZWxmLiRjb250cm9sX2lucHV0WzBdKTtcblx0XG5cdFx0XHRpZiAoc2VsZi4kYWN0aXZlT3B0aW9uICYmICFzZWxmLnNldHRpbmdzLmhpZGVTZWxlY3RlZCkge1xuXHRcdFx0XHRvcHRpb25fc2VsZWN0ID0gc2VsZi5nZXRBZGphY2VudE9wdGlvbihzZWxmLiRhY3RpdmVPcHRpb24sIC0xKS5hdHRyKCdkYXRhLXZhbHVlJyk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly8gZGV0ZXJtaW5lIGl0ZW1zIHRoYXQgd2lsbCBiZSByZW1vdmVkXG5cdFx0XHR2YWx1ZXMgPSBbXTtcblx0XG5cdFx0XHRpZiAoc2VsZi4kYWN0aXZlSXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdCR0YWlsID0gc2VsZi4kY29udHJvbC5jaGlsZHJlbignLmFjdGl2ZTonICsgKGRpcmVjdGlvbiA+IDAgPyAnbGFzdCcgOiAnZmlyc3QnKSk7XG5cdFx0XHRcdGNhcmV0ID0gc2VsZi4kY29udHJvbC5jaGlsZHJlbignOm5vdChpbnB1dCknKS5pbmRleCgkdGFpbCk7XG5cdFx0XHRcdGlmIChkaXJlY3Rpb24gPiAwKSB7IGNhcmV0Kys7IH1cblx0XG5cdFx0XHRcdGZvciAoaSA9IDAsIG4gPSBzZWxmLiRhY3RpdmVJdGVtcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0XHR2YWx1ZXMucHVzaCgkKHNlbGYuJGFjdGl2ZUl0ZW1zW2ldKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChlKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoKHNlbGYuaXNGb2N1c2VkIHx8IHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScpICYmIHNlbGYuaXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdGlmIChkaXJlY3Rpb24gPCAwICYmIHNlbGVjdGlvbi5zdGFydCA9PT0gMCAmJiBzZWxlY3Rpb24ubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0dmFsdWVzLnB1c2goc2VsZi5pdGVtc1tzZWxmLmNhcmV0UG9zIC0gMV0pO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGRpcmVjdGlvbiA+IDAgJiYgc2VsZWN0aW9uLnN0YXJ0ID09PSBzZWxmLiRjb250cm9sX2lucHV0LnZhbCgpLmxlbmd0aCkge1xuXHRcdFx0XHRcdHZhbHVlcy5wdXNoKHNlbGYuaXRlbXNbc2VsZi5jYXJldFBvc10pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly8gYWxsb3cgdGhlIGNhbGxiYWNrIHRvIGFib3J0XG5cdFx0XHRpZiAoIXZhbHVlcy5sZW5ndGggfHwgKHR5cGVvZiBzZWxmLnNldHRpbmdzLm9uRGVsZXRlID09PSAnZnVuY3Rpb24nICYmIHNlbGYuc2V0dGluZ3Mub25EZWxldGUuYXBwbHkoc2VsZiwgW3ZhbHVlc10pID09PSBmYWxzZSkpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcblx0XHRcdC8vIHBlcmZvcm0gcmVtb3ZhbFxuXHRcdFx0aWYgKHR5cGVvZiBjYXJldCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0c2VsZi5zZXRDYXJldChjYXJldCk7XG5cdFx0XHR9XG5cdFx0XHR3aGlsZSAodmFsdWVzLmxlbmd0aCkge1xuXHRcdFx0XHRzZWxmLnJlbW92ZUl0ZW0odmFsdWVzLnBvcCgpKTtcblx0XHRcdH1cblx0XG5cdFx0XHRzZWxmLnNob3dJbnB1dCgpO1xuXHRcdFx0c2VsZi5wb3NpdGlvbkRyb3Bkb3duKCk7XG5cdFx0XHRzZWxmLnJlZnJlc2hPcHRpb25zKHRydWUpO1xuXHRcblx0XHRcdC8vIHNlbGVjdCBwcmV2aW91cyBvcHRpb25cblx0XHRcdGlmIChvcHRpb25fc2VsZWN0KSB7XG5cdFx0XHRcdCRvcHRpb25fc2VsZWN0ID0gc2VsZi5nZXRPcHRpb24ob3B0aW9uX3NlbGVjdCk7XG5cdFx0XHRcdGlmICgkb3B0aW9uX3NlbGVjdC5sZW5ndGgpIHtcblx0XHRcdFx0XHRzZWxmLnNldEFjdGl2ZU9wdGlvbigkb3B0aW9uX3NlbGVjdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBTZWxlY3RzIHRoZSBwcmV2aW91cyAvIG5leHQgaXRlbSAoZGVwZW5kaW5nXG5cdFx0ICogb24gdGhlIGBkaXJlY3Rpb25gIGFyZ3VtZW50KS5cblx0XHQgKlxuXHRcdCAqID4gMCAtIHJpZ2h0XG5cdFx0ICogPCAwIC0gbGVmdFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtpbnR9IGRpcmVjdGlvblxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBlIChvcHRpb25hbClcblx0XHQgKi9cblx0XHRhZHZhbmNlU2VsZWN0aW9uOiBmdW5jdGlvbihkaXJlY3Rpb24sIGUpIHtcblx0XHRcdHZhciB0YWlsLCBzZWxlY3Rpb24sIGlkeCwgdmFsdWVMZW5ndGgsIGN1cnNvckF0RWRnZSwgJHRhaWw7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gMCkgcmV0dXJuO1xuXHRcdFx0aWYgKHNlbGYucnRsKSBkaXJlY3Rpb24gKj0gLTE7XG5cdFxuXHRcdFx0dGFpbCA9IGRpcmVjdGlvbiA+IDAgPyAnbGFzdCcgOiAnZmlyc3QnO1xuXHRcdFx0c2VsZWN0aW9uID0gZ2V0U2VsZWN0aW9uKHNlbGYuJGNvbnRyb2xfaW5wdXRbMF0pO1xuXHRcblx0XHRcdGlmIChzZWxmLmlzRm9jdXNlZCAmJiAhc2VsZi5pc0lucHV0SGlkZGVuKSB7XG5cdFx0XHRcdHZhbHVlTGVuZ3RoID0gc2VsZi4kY29udHJvbF9pbnB1dC52YWwoKS5sZW5ndGg7XG5cdFx0XHRcdGN1cnNvckF0RWRnZSA9IGRpcmVjdGlvbiA8IDBcblx0XHRcdFx0XHQ/IHNlbGVjdGlvbi5zdGFydCA9PT0gMCAmJiBzZWxlY3Rpb24ubGVuZ3RoID09PSAwXG5cdFx0XHRcdFx0OiBzZWxlY3Rpb24uc3RhcnQgPT09IHZhbHVlTGVuZ3RoO1xuXHRcblx0XHRcdFx0aWYgKGN1cnNvckF0RWRnZSAmJiAhdmFsdWVMZW5ndGgpIHtcblx0XHRcdFx0XHRzZWxmLmFkdmFuY2VDYXJldChkaXJlY3Rpb24sIGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkdGFpbCA9IHNlbGYuJGNvbnRyb2wuY2hpbGRyZW4oJy5hY3RpdmU6JyArIHRhaWwpO1xuXHRcdFx0XHRpZiAoJHRhaWwubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aWR4ID0gc2VsZi4kY29udHJvbC5jaGlsZHJlbignOm5vdChpbnB1dCknKS5pbmRleCgkdGFpbCk7XG5cdFx0XHRcdFx0c2VsZi5zZXRBY3RpdmVJdGVtKG51bGwpO1xuXHRcdFx0XHRcdHNlbGYuc2V0Q2FyZXQoZGlyZWN0aW9uID4gMCA/IGlkeCArIDEgOiBpZHgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogTW92ZXMgdGhlIGNhcmV0IGxlZnQgLyByaWdodC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7aW50fSBkaXJlY3Rpb25cblx0XHQgKiBAcGFyYW0ge29iamVjdH0gZSAob3B0aW9uYWwpXG5cdFx0ICovXG5cdFx0YWR2YW5jZUNhcmV0OiBmdW5jdGlvbihkaXJlY3Rpb24sIGUpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcywgZm4sICRhZGo7XG5cdFxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gMCkgcmV0dXJuO1xuXHRcblx0XHRcdGZuID0gZGlyZWN0aW9uID4gMCA/ICduZXh0JyA6ICdwcmV2Jztcblx0XHRcdGlmIChzZWxmLmlzU2hpZnREb3duKSB7XG5cdFx0XHRcdCRhZGogPSBzZWxmLiRjb250cm9sX2lucHV0W2ZuXSgpO1xuXHRcdFx0XHRpZiAoJGFkai5sZW5ndGgpIHtcblx0XHRcdFx0XHRzZWxmLmhpZGVJbnB1dCgpO1xuXHRcdFx0XHRcdHNlbGYuc2V0QWN0aXZlSXRlbSgkYWRqKTtcblx0XHRcdFx0XHRlICYmIGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VsZi5zZXRDYXJldChzZWxmLmNhcmV0UG9zICsgZGlyZWN0aW9uKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBNb3ZlcyB0aGUgY2FyZXQgdG8gdGhlIHNwZWNpZmllZCBpbmRleC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7aW50fSBpXG5cdFx0ICovXG5cdFx0c2V0Q2FyZXQ6IGZ1bmN0aW9uKGkpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XG5cdFx0XHRpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJykge1xuXHRcdFx0XHRpID0gc2VsZi5pdGVtcy5sZW5ndGg7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oc2VsZi5pdGVtcy5sZW5ndGgsIGkpKTtcblx0XHRcdH1cblx0XG5cdFx0XHRpZighc2VsZi5pc1BlbmRpbmcpIHtcblx0XHRcdFx0Ly8gdGhlIGlucHV0IG11c3QgYmUgbW92ZWQgYnkgbGVhdmluZyBpdCBpbiBwbGFjZSBhbmQgbW92aW5nIHRoZVxuXHRcdFx0XHQvLyBzaWJsaW5ncywgZHVlIHRvIHRoZSBmYWN0IHRoYXQgZm9jdXMgY2Fubm90IGJlIHJlc3RvcmVkIG9uY2UgbG9zdFxuXHRcdFx0XHQvLyBvbiBtb2JpbGUgd2Via2l0IGRldmljZXNcblx0XHRcdFx0dmFyIGosIG4sIGZuLCAkY2hpbGRyZW4sICRjaGlsZDtcblx0XHRcdFx0JGNoaWxkcmVuID0gc2VsZi4kY29udHJvbC5jaGlsZHJlbignOm5vdChpbnB1dCknKTtcblx0XHRcdFx0Zm9yIChqID0gMCwgbiA9ICRjaGlsZHJlbi5sZW5ndGg7IGogPCBuOyBqKyspIHtcblx0XHRcdFx0XHQkY2hpbGQgPSAkKCRjaGlsZHJlbltqXSkuZGV0YWNoKCk7XG5cdFx0XHRcdFx0aWYgKGogPCAgaSkge1xuXHRcdFx0XHRcdFx0c2VsZi4kY29udHJvbF9pbnB1dC5iZWZvcmUoJGNoaWxkKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VsZi4kY29udHJvbC5hcHBlbmQoJGNoaWxkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XG5cdFx0XHRzZWxmLmNhcmV0UG9zID0gaTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBEaXNhYmxlcyB1c2VyIGlucHV0IG9uIHRoZSBjb250cm9sLiBVc2VkIHdoaWxlXG5cdFx0ICogaXRlbXMgYXJlIGJlaW5nIGFzeW5jaHJvbm91c2x5IGNyZWF0ZWQuXG5cdFx0ICovXG5cdFx0bG9jazogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0XHR0aGlzLmlzTG9ja2VkID0gdHJ1ZTtcblx0XHRcdHRoaXMucmVmcmVzaFN0YXRlKCk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogUmUtZW5hYmxlcyB1c2VyIGlucHV0IG9uIHRoZSBjb250cm9sLlxuXHRcdCAqL1xuXHRcdHVubG9jazogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLmlzTG9ja2VkID0gZmFsc2U7XG5cdFx0XHR0aGlzLnJlZnJlc2hTdGF0ZSgpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIERpc2FibGVzIHVzZXIgaW5wdXQgb24gdGhlIGNvbnRyb2wgY29tcGxldGVseS5cblx0XHQgKiBXaGlsZSBkaXNhYmxlZCwgaXQgY2Fubm90IHJlY2VpdmUgZm9jdXMuXG5cdFx0ICovXG5cdFx0ZGlzYWJsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRzZWxmLiRpbnB1dC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdFx0c2VsZi4kY29udHJvbF9pbnB1dC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpLnByb3AoJ3RhYmluZGV4JywgLTEpO1xuXHRcdFx0c2VsZi5pc0Rpc2FibGVkID0gdHJ1ZTtcblx0XHRcdHNlbGYubG9jaygpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIEVuYWJsZXMgdGhlIGNvbnRyb2wgc28gdGhhdCBpdCBjYW4gcmVzcG9uZFxuXHRcdCAqIHRvIGZvY3VzIGFuZCB1c2VyIGlucHV0LlxuXHRcdCAqL1xuXHRcdGVuYWJsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRzZWxmLiRpbnB1dC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRcdHNlbGYuJGNvbnRyb2xfaW5wdXQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSkucHJvcCgndGFiaW5kZXgnLCBzZWxmLnRhYkluZGV4KTtcblx0XHRcdHNlbGYuaXNEaXNhYmxlZCA9IGZhbHNlO1xuXHRcdFx0c2VsZi51bmxvY2soKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBDb21wbGV0ZWx5IGRlc3Ryb3lzIHRoZSBjb250cm9sIGFuZFxuXHRcdCAqIHVuYmluZHMgYWxsIGV2ZW50IGxpc3RlbmVycyBzbyB0aGF0IGl0IGNhblxuXHRcdCAqIGJlIGdhcmJhZ2UgY29sbGVjdGVkLlxuXHRcdCAqL1xuXHRcdGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyIGV2ZW50TlMgPSBzZWxmLmV2ZW50TlM7XG5cdFx0XHR2YXIgcmV2ZXJ0U2V0dGluZ3MgPSBzZWxmLnJldmVydFNldHRpbmdzO1xuXHRcblx0XHRcdHNlbGYudHJpZ2dlcignZGVzdHJveScpO1xuXHRcdFx0c2VsZi5vZmYoKTtcblx0XHRcdHNlbGYuJHdyYXBwZXIucmVtb3ZlKCk7XG5cdFx0XHRzZWxmLiRkcm9wZG93bi5yZW1vdmUoKTtcblx0XG5cdFx0XHRzZWxmLiRpbnB1dFxuXHRcdFx0XHQuaHRtbCgnJylcblx0XHRcdFx0LmFwcGVuZChyZXZlcnRTZXR0aW5ncy4kY2hpbGRyZW4pXG5cdFx0XHRcdC5yZW1vdmVBdHRyKCd0YWJpbmRleCcpXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnc2VsZWN0aXplZCcpXG5cdFx0XHRcdC5hdHRyKHt0YWJpbmRleDogcmV2ZXJ0U2V0dGluZ3MudGFiaW5kZXh9KVxuXHRcdFx0XHQuc2hvdygpO1xuXHRcblx0XHRcdHNlbGYuJGNvbnRyb2xfaW5wdXQucmVtb3ZlRGF0YSgnZ3JvdycpO1xuXHRcdFx0c2VsZi4kaW5wdXQucmVtb3ZlRGF0YSgnc2VsZWN0aXplJyk7XG5cdFxuXHRcdFx0JCh3aW5kb3cpLm9mZihldmVudE5TKTtcblx0XHRcdCQoZG9jdW1lbnQpLm9mZihldmVudE5TKTtcblx0XHRcdCQoZG9jdW1lbnQuYm9keSkub2ZmKGV2ZW50TlMpO1xuXHRcblx0XHRcdGRlbGV0ZSBzZWxmLiRpbnB1dFswXS5zZWxlY3RpemU7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogQSBoZWxwZXIgbWV0aG9kIGZvciByZW5kZXJpbmcgXCJpdGVtXCIgYW5kXG5cdFx0ICogXCJvcHRpb25cIiB0ZW1wbGF0ZXMsIGdpdmVuIHRoZSBkYXRhLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHRlbXBsYXRlTmFtZVxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG5cdFx0ICogQHJldHVybnMge3N0cmluZ31cblx0XHQgKi9cblx0XHRyZW5kZXI6IGZ1bmN0aW9uKHRlbXBsYXRlTmFtZSwgZGF0YSkge1xuXHRcdFx0dmFyIHZhbHVlLCBpZCwgbGFiZWw7XG5cdFx0XHR2YXIgaHRtbCA9ICcnO1xuXHRcdFx0dmFyIGNhY2hlID0gZmFsc2U7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHR2YXIgcmVnZXhfdGFnID0gL15bXFx0IFxcclxcbl0qPChbYS16XVthLXowLTlcXC1fXSooPzpcXDpbYS16XVthLXowLTlcXC1fXSopPykvaTtcblx0XG5cdFx0XHRpZiAodGVtcGxhdGVOYW1lID09PSAnb3B0aW9uJyB8fCB0ZW1wbGF0ZU5hbWUgPT09ICdpdGVtJykge1xuXHRcdFx0XHR2YWx1ZSA9IGhhc2hfa2V5KGRhdGFbc2VsZi5zZXR0aW5ncy52YWx1ZUZpZWxkXSk7XG5cdFx0XHRcdGNhY2hlID0gISF2YWx1ZTtcblx0XHRcdH1cblx0XG5cdFx0XHQvLyBwdWxsIG1hcmt1cCBmcm9tIGNhY2hlIGlmIGl0IGV4aXN0c1xuXHRcdFx0aWYgKGNhY2hlKSB7XG5cdFx0XHRcdGlmICghaXNzZXQoc2VsZi5yZW5kZXJDYWNoZVt0ZW1wbGF0ZU5hbWVdKSkge1xuXHRcdFx0XHRcdHNlbGYucmVuZGVyQ2FjaGVbdGVtcGxhdGVOYW1lXSA9IHt9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzZWxmLnJlbmRlckNhY2hlW3RlbXBsYXRlTmFtZV0uaGFzT3duUHJvcGVydHkodmFsdWUpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHNlbGYucmVuZGVyQ2FjaGVbdGVtcGxhdGVOYW1lXVt2YWx1ZV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XG5cdFx0XHQvLyByZW5kZXIgbWFya3VwXG5cdFx0XHRodG1sID0gc2VsZi5zZXR0aW5ncy5yZW5kZXJbdGVtcGxhdGVOYW1lXS5hcHBseSh0aGlzLCBbZGF0YSwgZXNjYXBlX2h0bWxdKTtcblx0XG5cdFx0XHQvLyBhZGQgbWFuZGF0b3J5IGF0dHJpYnV0ZXNcblx0XHRcdGlmICh0ZW1wbGF0ZU5hbWUgPT09ICdvcHRpb24nIHx8IHRlbXBsYXRlTmFtZSA9PT0gJ29wdGlvbl9jcmVhdGUnKSB7XG5cdFx0XHRcdGh0bWwgPSBodG1sLnJlcGxhY2UocmVnZXhfdGFnLCAnPCQxIGRhdGEtc2VsZWN0YWJsZScpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRlbXBsYXRlTmFtZSA9PT0gJ29wdGdyb3VwJykge1xuXHRcdFx0XHRpZCA9IGRhdGFbc2VsZi5zZXR0aW5ncy5vcHRncm91cFZhbHVlRmllbGRdIHx8ICcnO1xuXHRcdFx0XHRodG1sID0gaHRtbC5yZXBsYWNlKHJlZ2V4X3RhZywgJzwkMSBkYXRhLWdyb3VwPVwiJyArIGVzY2FwZV9yZXBsYWNlKGVzY2FwZV9odG1sKGlkKSkgKyAnXCInKTtcblx0XHRcdH1cblx0XHRcdGlmICh0ZW1wbGF0ZU5hbWUgPT09ICdvcHRpb24nIHx8IHRlbXBsYXRlTmFtZSA9PT0gJ2l0ZW0nKSB7XG5cdFx0XHRcdGh0bWwgPSBodG1sLnJlcGxhY2UocmVnZXhfdGFnLCAnPCQxIGRhdGEtdmFsdWU9XCInICsgZXNjYXBlX3JlcGxhY2UoZXNjYXBlX2h0bWwodmFsdWUgfHwgJycpKSArICdcIicpO1xuXHRcdFx0fVxuXHRcblx0XHRcdC8vIHVwZGF0ZSBjYWNoZVxuXHRcdFx0aWYgKGNhY2hlKSB7XG5cdFx0XHRcdHNlbGYucmVuZGVyQ2FjaGVbdGVtcGxhdGVOYW1lXVt2YWx1ZV0gPSBodG1sO1xuXHRcdFx0fVxuXHRcblx0XHRcdHJldHVybiBodG1sO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIENsZWFycyB0aGUgcmVuZGVyIGNhY2hlIGZvciBhIHRlbXBsYXRlLiBJZlxuXHRcdCAqIG5vIHRlbXBsYXRlIGlzIGdpdmVuLCBjbGVhcnMgYWxsIHJlbmRlclxuXHRcdCAqIGNhY2hlcy5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZU5hbWVcblx0XHQgKi9cblx0XHRjbGVhckNhY2hlOiBmdW5jdGlvbih0ZW1wbGF0ZU5hbWUpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdGlmICh0eXBlb2YgdGVtcGxhdGVOYW1lID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRzZWxmLnJlbmRlckNhY2hlID0ge307XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkZWxldGUgc2VsZi5yZW5kZXJDYWNoZVt0ZW1wbGF0ZU5hbWVdO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIERldGVybWluZXMgd2hldGhlciBvciBub3QgdG8gZGlzcGxheSB0aGVcblx0XHQgKiBjcmVhdGUgaXRlbSBwcm9tcHQsIGdpdmVuIGEgdXNlciBpbnB1dC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dFxuXHRcdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0Y2FuQ3JlYXRlOiBmdW5jdGlvbihpbnB1dCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0aWYgKCFzZWxmLnNldHRpbmdzLmNyZWF0ZSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0dmFyIGZpbHRlciA9IHNlbGYuc2V0dGluZ3MuY3JlYXRlRmlsdGVyO1xuXHRcdFx0cmV0dXJuIGlucHV0Lmxlbmd0aFxuXHRcdFx0XHQmJiAodHlwZW9mIGZpbHRlciAhPT0gJ2Z1bmN0aW9uJyB8fCBmaWx0ZXIuYXBwbHkoc2VsZiwgW2lucHV0XSkpXG5cdFx0XHRcdCYmICh0eXBlb2YgZmlsdGVyICE9PSAnc3RyaW5nJyB8fCBuZXcgUmVnRXhwKGZpbHRlcikudGVzdChpbnB1dCkpXG5cdFx0XHRcdCYmICghKGZpbHRlciBpbnN0YW5jZW9mIFJlZ0V4cCkgfHwgZmlsdGVyLnRlc3QoaW5wdXQpKTtcblx0XHR9XG5cdFxuXHR9KTtcblx0XG5cdFxuXHRTZWxlY3RpemUuY291bnQgPSAwO1xuXHRTZWxlY3RpemUuZGVmYXVsdHMgPSB7XG5cdFx0b3B0aW9uczogW10sXG5cdFx0b3B0Z3JvdXBzOiBbXSxcblx0XG5cdFx0cGx1Z2luczogW10sXG5cdFx0ZGVsaW1pdGVyOiAnLCcsXG5cdFx0c3BsaXRPbjogbnVsbCwgLy8gcmVnZXhwIG9yIHN0cmluZyBmb3Igc3BsaXR0aW5nIHVwIHZhbHVlcyBmcm9tIGEgcGFzdGUgY29tbWFuZFxuXHRcdHBlcnNpc3Q6IHRydWUsXG5cdFx0ZGlhY3JpdGljczogdHJ1ZSxcblx0XHRjcmVhdGU6IGZhbHNlLFxuXHRcdGNyZWF0ZU9uQmx1cjogZmFsc2UsXG5cdFx0Y3JlYXRlRmlsdGVyOiBudWxsLFxuXHRcdGhpZ2hsaWdodDogdHJ1ZSxcblx0XHRvcGVuT25Gb2N1czogdHJ1ZSxcblx0XHRtYXhPcHRpb25zOiAxMDAwLFxuXHRcdG1heEl0ZW1zOiBudWxsLFxuXHRcdGhpZGVTZWxlY3RlZDogbnVsbCxcblx0XHRhZGRQcmVjZWRlbmNlOiBmYWxzZSxcblx0XHRzZWxlY3RPblRhYjogZmFsc2UsXG5cdFx0cHJlbG9hZDogZmFsc2UsXG5cdFx0YWxsb3dFbXB0eU9wdGlvbjogZmFsc2UsXG5cdFx0Y2xvc2VBZnRlclNlbGVjdDogZmFsc2UsXG5cdFxuXHRcdHNjcm9sbER1cmF0aW9uOiA2MCxcblx0XHRsb2FkVGhyb3R0bGU6IDMwMCxcblx0XHRsb2FkaW5nQ2xhc3M6ICdsb2FkaW5nJyxcblx0XG5cdFx0ZGF0YUF0dHI6ICdkYXRhLWRhdGEnLFxuXHRcdG9wdGdyb3VwRmllbGQ6ICdvcHRncm91cCcsXG5cdFx0dmFsdWVGaWVsZDogJ3ZhbHVlJyxcblx0XHRsYWJlbEZpZWxkOiAndGV4dCcsXG5cdFx0b3B0Z3JvdXBMYWJlbEZpZWxkOiAnbGFiZWwnLFxuXHRcdG9wdGdyb3VwVmFsdWVGaWVsZDogJ3ZhbHVlJyxcblx0XHRsb2NrT3B0Z3JvdXBPcmRlcjogZmFsc2UsXG5cdFxuXHRcdHNvcnRGaWVsZDogJyRvcmRlcicsXG5cdFx0c2VhcmNoRmllbGQ6IFsndGV4dCddLFxuXHRcdHNlYXJjaENvbmp1bmN0aW9uOiAnYW5kJyxcblx0XG5cdFx0bW9kZTogbnVsbCxcblx0XHR3cmFwcGVyQ2xhc3M6ICdzZWxlY3RpemUtY29udHJvbCcsXG5cdFx0aW5wdXRDbGFzczogJ3NlbGVjdGl6ZS1pbnB1dCcsXG5cdFx0ZHJvcGRvd25DbGFzczogJ3NlbGVjdGl6ZS1kcm9wZG93bicsXG5cdFx0ZHJvcGRvd25Db250ZW50Q2xhc3M6ICdzZWxlY3RpemUtZHJvcGRvd24tY29udGVudCcsXG5cdFxuXHRcdGRyb3Bkb3duUGFyZW50OiBudWxsLFxuXHRcblx0XHRjb3B5Q2xhc3Nlc1RvRHJvcGRvd246IHRydWUsXG5cdFxuXHRcdC8qXG5cdFx0bG9hZCAgICAgICAgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbihxdWVyeSwgY2FsbGJhY2spIHsgLi4uIH1cblx0XHRzY29yZSAgICAgICAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHNlYXJjaCkgeyAuLi4gfVxuXHRcdG9uSW5pdGlhbGl6ZSAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24oKSB7IC4uLiB9XG5cdFx0b25DaGFuZ2UgICAgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbih2YWx1ZSkgeyAuLi4gfVxuXHRcdG9uSXRlbUFkZCAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWUsICRpdGVtKSB7IC4uLiB9XG5cdFx0b25JdGVtUmVtb3ZlICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbih2YWx1ZSkgeyAuLi4gfVxuXHRcdG9uQ2xlYXIgICAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24oKSB7IC4uLiB9XG5cdFx0b25PcHRpb25BZGQgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbih2YWx1ZSwgZGF0YSkgeyAuLi4gfVxuXHRcdG9uT3B0aW9uUmVtb3ZlICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWUpIHsgLi4uIH1cblx0XHRvbk9wdGlvbkNsZWFyICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKCkgeyAuLi4gfVxuXHRcdG9uT3B0aW9uR3JvdXBBZGQgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24oaWQsIGRhdGEpIHsgLi4uIH1cblx0XHRvbk9wdGlvbkdyb3VwUmVtb3ZlICA6IG51bGwsIC8vIGZ1bmN0aW9uKGlkKSB7IC4uLiB9XG5cdFx0b25PcHRpb25Hcm91cENsZWFyICAgOiBudWxsLCAvLyBmdW5jdGlvbigpIHsgLi4uIH1cblx0XHRvbkRyb3Bkb3duT3BlbiAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKCRkcm9wZG93bikgeyAuLi4gfVxuXHRcdG9uRHJvcGRvd25DbG9zZSAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24oJGRyb3Bkb3duKSB7IC4uLiB9XG5cdFx0b25UeXBlICAgICAgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbihzdHIpIHsgLi4uIH1cblx0XHRvbkRlbGV0ZSAgICAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHZhbHVlcykgeyAuLi4gfVxuXHRcdCovXG5cdFxuXHRcdHJlbmRlcjoge1xuXHRcdFx0Lypcblx0XHRcdGl0ZW06IG51bGwsXG5cdFx0XHRvcHRncm91cDogbnVsbCxcblx0XHRcdG9wdGdyb3VwX2hlYWRlcjogbnVsbCxcblx0XHRcdG9wdGlvbjogbnVsbCxcblx0XHRcdG9wdGlvbl9jcmVhdGU6IG51bGxcblx0XHRcdCovXG5cdFx0fVxuXHR9O1xuXHRcblx0XG5cdCQuZm4uc2VsZWN0aXplID0gZnVuY3Rpb24oc2V0dGluZ3NfdXNlcikge1xuXHRcdHZhciBkZWZhdWx0cyAgICAgICAgICAgICA9ICQuZm4uc2VsZWN0aXplLmRlZmF1bHRzO1xuXHRcdHZhciBzZXR0aW5ncyAgICAgICAgICAgICA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgc2V0dGluZ3NfdXNlcik7XG5cdFx0dmFyIGF0dHJfZGF0YSAgICAgICAgICAgID0gc2V0dGluZ3MuZGF0YUF0dHI7XG5cdFx0dmFyIGZpZWxkX2xhYmVsICAgICAgICAgID0gc2V0dGluZ3MubGFiZWxGaWVsZDtcblx0XHR2YXIgZmllbGRfdmFsdWUgICAgICAgICAgPSBzZXR0aW5ncy52YWx1ZUZpZWxkO1xuXHRcdHZhciBmaWVsZF9vcHRncm91cCAgICAgICA9IHNldHRpbmdzLm9wdGdyb3VwRmllbGQ7XG5cdFx0dmFyIGZpZWxkX29wdGdyb3VwX2xhYmVsID0gc2V0dGluZ3Mub3B0Z3JvdXBMYWJlbEZpZWxkO1xuXHRcdHZhciBmaWVsZF9vcHRncm91cF92YWx1ZSA9IHNldHRpbmdzLm9wdGdyb3VwVmFsdWVGaWVsZDtcblx0XG5cdFx0LyoqXG5cdFx0ICogSW5pdGlhbGl6ZXMgc2VsZWN0aXplIGZyb20gYSA8aW5wdXQgdHlwZT1cInRleHRcIj4gZWxlbWVudC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSAkaW5wdXRcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NfZWxlbWVudFxuXHRcdCAqL1xuXHRcdHZhciBpbml0X3RleHRib3ggPSBmdW5jdGlvbigkaW5wdXQsIHNldHRpbmdzX2VsZW1lbnQpIHtcblx0XHRcdHZhciBpLCBuLCB2YWx1ZXMsIG9wdGlvbjtcblx0XG5cdFx0XHR2YXIgZGF0YV9yYXcgPSAkaW5wdXQuYXR0cihhdHRyX2RhdGEpO1xuXHRcblx0XHRcdGlmICghZGF0YV9yYXcpIHtcblx0XHRcdFx0dmFyIHZhbHVlID0gJC50cmltKCRpbnB1dC52YWwoKSB8fCAnJyk7XG5cdFx0XHRcdGlmICghc2V0dGluZ3MuYWxsb3dFbXB0eU9wdGlvbiAmJiAhdmFsdWUubGVuZ3RoKSByZXR1cm47XG5cdFx0XHRcdHZhbHVlcyA9IHZhbHVlLnNwbGl0KHNldHRpbmdzLmRlbGltaXRlcik7XG5cdFx0XHRcdGZvciAoaSA9IDAsIG4gPSB2YWx1ZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdFx0b3B0aW9uID0ge307XG5cdFx0XHRcdFx0b3B0aW9uW2ZpZWxkX2xhYmVsXSA9IHZhbHVlc1tpXTtcblx0XHRcdFx0XHRvcHRpb25bZmllbGRfdmFsdWVdID0gdmFsdWVzW2ldO1xuXHRcdFx0XHRcdHNldHRpbmdzX2VsZW1lbnQub3B0aW9ucy5wdXNoKG9wdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2V0dGluZ3NfZWxlbWVudC5pdGVtcyA9IHZhbHVlcztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNldHRpbmdzX2VsZW1lbnQub3B0aW9ucyA9IEpTT04ucGFyc2UoZGF0YV9yYXcpO1xuXHRcdFx0XHRmb3IgKGkgPSAwLCBuID0gc2V0dGluZ3NfZWxlbWVudC5vcHRpb25zLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRcdHNldHRpbmdzX2VsZW1lbnQuaXRlbXMucHVzaChzZXR0aW5nc19lbGVtZW50Lm9wdGlvbnNbaV1bZmllbGRfdmFsdWVdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFxuXHRcdC8qKlxuXHRcdCAqIEluaXRpYWxpemVzIHNlbGVjdGl6ZSBmcm9tIGEgPHNlbGVjdD4gZWxlbWVudC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSAkaW5wdXRcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NfZWxlbWVudFxuXHRcdCAqL1xuXHRcdHZhciBpbml0X3NlbGVjdCA9IGZ1bmN0aW9uKCRpbnB1dCwgc2V0dGluZ3NfZWxlbWVudCkge1xuXHRcdFx0dmFyIGksIG4sIHRhZ05hbWUsICRjaGlsZHJlbiwgb3JkZXIgPSAwO1xuXHRcdFx0dmFyIG9wdGlvbnMgPSBzZXR0aW5nc19lbGVtZW50Lm9wdGlvbnM7XG5cdFx0XHR2YXIgb3B0aW9uc01hcCA9IHt9O1xuXHRcblx0XHRcdHZhciByZWFkRGF0YSA9IGZ1bmN0aW9uKCRlbCkge1xuXHRcdFx0XHR2YXIgZGF0YSA9IGF0dHJfZGF0YSAmJiAkZWwuYXR0cihhdHRyX2RhdGEpO1xuXHRcdFx0XHRpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnICYmIGRhdGEubGVuZ3RoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9O1xuXHRcblx0XHRcdHZhciBhZGRPcHRpb24gPSBmdW5jdGlvbigkb3B0aW9uLCBncm91cCkge1xuXHRcdFx0XHQkb3B0aW9uID0gJCgkb3B0aW9uKTtcblx0XG5cdFx0XHRcdHZhciB2YWx1ZSA9IGhhc2hfa2V5KCRvcHRpb24uYXR0cigndmFsdWUnKSk7XG5cdFx0XHRcdGlmICghdmFsdWUgJiYgIXNldHRpbmdzLmFsbG93RW1wdHlPcHRpb24pIHJldHVybjtcblx0XG5cdFx0XHRcdC8vIGlmIHRoZSBvcHRpb24gYWxyZWFkeSBleGlzdHMsIGl0J3MgcHJvYmFibHkgYmVlblxuXHRcdFx0XHQvLyBkdXBsaWNhdGVkIGluIGFub3RoZXIgb3B0Z3JvdXAuIGluIHRoaXMgY2FzZSwgcHVzaFxuXHRcdFx0XHQvLyB0aGUgY3VycmVudCBncm91cCB0byB0aGUgXCJvcHRncm91cFwiIHByb3BlcnR5IG9uIHRoZVxuXHRcdFx0XHQvLyBleGlzdGluZyBvcHRpb24gc28gdGhhdCBpdCdzIHJlbmRlcmVkIGluIGJvdGggcGxhY2VzLlxuXHRcdFx0XHRpZiAob3B0aW9uc01hcC5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHtcblx0XHRcdFx0XHRpZiAoZ3JvdXApIHtcblx0XHRcdFx0XHRcdHZhciBhcnIgPSBvcHRpb25zTWFwW3ZhbHVlXVtmaWVsZF9vcHRncm91cF07XG5cdFx0XHRcdFx0XHRpZiAoIWFycikge1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zTWFwW3ZhbHVlXVtmaWVsZF9vcHRncm91cF0gPSBncm91cDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoISQuaXNBcnJheShhcnIpKSB7XG5cdFx0XHRcdFx0XHRcdG9wdGlvbnNNYXBbdmFsdWVdW2ZpZWxkX29wdGdyb3VwXSA9IFthcnIsIGdyb3VwXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGFyci5wdXNoKGdyb3VwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFxuXHRcdFx0XHR2YXIgb3B0aW9uICAgICAgICAgICAgID0gcmVhZERhdGEoJG9wdGlvbikgfHwge307XG5cdFx0XHRcdG9wdGlvbltmaWVsZF9sYWJlbF0gICAgPSBvcHRpb25bZmllbGRfbGFiZWxdIHx8ICRvcHRpb24udGV4dCgpO1xuXHRcdFx0XHRvcHRpb25bZmllbGRfdmFsdWVdICAgID0gb3B0aW9uW2ZpZWxkX3ZhbHVlXSB8fCB2YWx1ZTtcblx0XHRcdFx0b3B0aW9uW2ZpZWxkX29wdGdyb3VwXSA9IG9wdGlvbltmaWVsZF9vcHRncm91cF0gfHwgZ3JvdXA7XG5cdFxuXHRcdFx0XHRvcHRpb25zTWFwW3ZhbHVlXSA9IG9wdGlvbjtcblx0XHRcdFx0b3B0aW9ucy5wdXNoKG9wdGlvbik7XG5cdFxuXHRcdFx0XHRpZiAoJG9wdGlvbi5pcygnOnNlbGVjdGVkJykpIHtcblx0XHRcdFx0XHRzZXR0aW5nc19lbGVtZW50Lml0ZW1zLnB1c2godmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcblx0XHRcdHZhciBhZGRHcm91cCA9IGZ1bmN0aW9uKCRvcHRncm91cCkge1xuXHRcdFx0XHR2YXIgaSwgbiwgaWQsIG9wdGdyb3VwLCAkb3B0aW9ucztcblx0XG5cdFx0XHRcdCRvcHRncm91cCA9ICQoJG9wdGdyb3VwKTtcblx0XHRcdFx0aWQgPSAkb3B0Z3JvdXAuYXR0cignbGFiZWwnKTtcblx0XG5cdFx0XHRcdGlmIChpZCkge1xuXHRcdFx0XHRcdG9wdGdyb3VwID0gcmVhZERhdGEoJG9wdGdyb3VwKSB8fCB7fTtcblx0XHRcdFx0XHRvcHRncm91cFtmaWVsZF9vcHRncm91cF9sYWJlbF0gPSBpZDtcblx0XHRcdFx0XHRvcHRncm91cFtmaWVsZF9vcHRncm91cF92YWx1ZV0gPSBpZDtcblx0XHRcdFx0XHRzZXR0aW5nc19lbGVtZW50Lm9wdGdyb3Vwcy5wdXNoKG9wdGdyb3VwKTtcblx0XHRcdFx0fVxuXHRcblx0XHRcdFx0JG9wdGlvbnMgPSAkKCdvcHRpb24nLCAkb3B0Z3JvdXApO1xuXHRcdFx0XHRmb3IgKGkgPSAwLCBuID0gJG9wdGlvbnMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdFx0YWRkT3B0aW9uKCRvcHRpb25zW2ldLCBpZCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFxuXHRcdFx0c2V0dGluZ3NfZWxlbWVudC5tYXhJdGVtcyA9ICRpbnB1dC5hdHRyKCdtdWx0aXBsZScpID8gbnVsbCA6IDE7XG5cdFxuXHRcdFx0JGNoaWxkcmVuID0gJGlucHV0LmNoaWxkcmVuKCk7XG5cdFx0XHRmb3IgKGkgPSAwLCBuID0gJGNoaWxkcmVuLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHR0YWdOYW1lID0gJGNoaWxkcmVuW2ldLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0aWYgKHRhZ05hbWUgPT09ICdvcHRncm91cCcpIHtcblx0XHRcdFx0XHRhZGRHcm91cCgkY2hpbGRyZW5baV0pO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRhZ05hbWUgPT09ICdvcHRpb24nKSB7XG5cdFx0XHRcdFx0YWRkT3B0aW9uKCRjaGlsZHJlbltpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHRoaXMuc2VsZWN0aXplKSByZXR1cm47XG5cdFxuXHRcdFx0dmFyIGluc3RhbmNlO1xuXHRcdFx0dmFyICRpbnB1dCA9ICQodGhpcyk7XG5cdFx0XHR2YXIgdGFnX25hbWUgPSB0aGlzLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdHZhciBwbGFjZWhvbGRlciA9ICRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpIHx8ICRpbnB1dC5hdHRyKCdkYXRhLXBsYWNlaG9sZGVyJyk7XG5cdFx0XHRpZiAoIXBsYWNlaG9sZGVyICYmICFzZXR0aW5ncy5hbGxvd0VtcHR5T3B0aW9uKSB7XG5cdFx0XHRcdHBsYWNlaG9sZGVyID0gJGlucHV0LmNoaWxkcmVuKCdvcHRpb25bdmFsdWU9XCJcIl0nKS50ZXh0KCk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0dmFyIHNldHRpbmdzX2VsZW1lbnQgPSB7XG5cdFx0XHRcdCdwbGFjZWhvbGRlcicgOiBwbGFjZWhvbGRlcixcblx0XHRcdFx0J29wdGlvbnMnICAgICA6IFtdLFxuXHRcdFx0XHQnb3B0Z3JvdXBzJyAgIDogW10sXG5cdFx0XHRcdCdpdGVtcycgICAgICAgOiBbXVxuXHRcdFx0fTtcblx0XG5cdFx0XHRpZiAodGFnX25hbWUgPT09ICdzZWxlY3QnKSB7XG5cdFx0XHRcdGluaXRfc2VsZWN0KCRpbnB1dCwgc2V0dGluZ3NfZWxlbWVudCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpbml0X3RleHRib3goJGlucHV0LCBzZXR0aW5nc19lbGVtZW50KTtcblx0XHRcdH1cblx0XG5cdFx0XHRpbnN0YW5jZSA9IG5ldyBTZWxlY3RpemUoJGlucHV0LCAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIHNldHRpbmdzX2VsZW1lbnQsIHNldHRpbmdzX3VzZXIpKTtcblx0XHR9KTtcblx0fTtcblx0XG5cdCQuZm4uc2VsZWN0aXplLmRlZmF1bHRzID0gU2VsZWN0aXplLmRlZmF1bHRzO1xuXHQkLmZuLnNlbGVjdGl6ZS5zdXBwb3J0ID0ge1xuXHRcdHZhbGlkaXR5OiBTVVBQT1JUU19WQUxJRElUWV9BUElcblx0fTtcblx0XG5cdFxuXHRTZWxlY3RpemUuZGVmaW5lKCdkcmFnX2Ryb3AnLCBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0aWYgKCEkLmZuLnNvcnRhYmxlKSB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBcImRyYWdfZHJvcFwiIHBsdWdpbiByZXF1aXJlcyBqUXVlcnkgVUkgXCJzb3J0YWJsZVwiLicpO1xuXHRcdGlmICh0aGlzLnNldHRpbmdzLm1vZGUgIT09ICdtdWx0aScpIHJldHVybjtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdHNlbGYubG9jayA9IChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBvcmlnaW5hbCA9IHNlbGYubG9jaztcblx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHNvcnRhYmxlID0gc2VsZi4kY29udHJvbC5kYXRhKCdzb3J0YWJsZScpO1xuXHRcdFx0XHRpZiAoc29ydGFibGUpIHNvcnRhYmxlLmRpc2FibGUoKTtcblx0XHRcdFx0cmV0dXJuIG9yaWdpbmFsLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG5cdFx0XHR9O1xuXHRcdH0pKCk7XG5cdFxuXHRcdHNlbGYudW5sb2NrID0gKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gc2VsZi51bmxvY2s7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBzb3J0YWJsZSA9IHNlbGYuJGNvbnRyb2wuZGF0YSgnc29ydGFibGUnKTtcblx0XHRcdFx0aWYgKHNvcnRhYmxlKSBzb3J0YWJsZS5lbmFibGUoKTtcblx0XHRcdFx0cmV0dXJuIG9yaWdpbmFsLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG5cdFx0XHR9O1xuXHRcdH0pKCk7XG5cdFxuXHRcdHNlbGYuc2V0dXAgPSAoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgb3JpZ2luYWwgPSBzZWxmLnNldHVwO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcblx0XHRcdFx0dmFyICRjb250cm9sID0gc2VsZi4kY29udHJvbC5zb3J0YWJsZSh7XG5cdFx0XHRcdFx0aXRlbXM6ICdbZGF0YS12YWx1ZV0nLFxuXHRcdFx0XHRcdGZvcmNlUGxhY2Vob2xkZXJTaXplOiB0cnVlLFxuXHRcdFx0XHRcdGRpc2FibGVkOiBzZWxmLmlzTG9ja2VkLFxuXHRcdFx0XHRcdHN0YXJ0OiBmdW5jdGlvbihlLCB1aSkge1xuXHRcdFx0XHRcdFx0dWkucGxhY2Vob2xkZXIuY3NzKCd3aWR0aCcsIHVpLmhlbHBlci5jc3MoJ3dpZHRoJykpO1xuXHRcdFx0XHRcdFx0JGNvbnRyb2wuY3NzKHtvdmVyZmxvdzogJ3Zpc2libGUnfSk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzdG9wOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRjb250cm9sLmNzcyh7b3ZlcmZsb3c6ICdoaWRkZW4nfSk7XG5cdFx0XHRcdFx0XHR2YXIgYWN0aXZlID0gc2VsZi4kYWN0aXZlSXRlbXMgPyBzZWxmLiRhY3RpdmVJdGVtcy5zbGljZSgpIDogbnVsbDtcblx0XHRcdFx0XHRcdHZhciB2YWx1ZXMgPSBbXTtcblx0XHRcdFx0XHRcdCRjb250cm9sLmNoaWxkcmVuKCdbZGF0YS12YWx1ZV0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZXMucHVzaCgkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHNlbGYuc2V0VmFsdWUodmFsdWVzKTtcblx0XHRcdFx0XHRcdHNlbGYuc2V0QWN0aXZlSXRlbShhY3RpdmUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXHRcdH0pKCk7XG5cdFxuXHR9KTtcblx0XG5cdFNlbGVjdGl6ZS5kZWZpbmUoJ2Ryb3Bkb3duX2hlYWRlcicsIGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdG9wdGlvbnMgPSAkLmV4dGVuZCh7XG5cdFx0XHR0aXRsZSAgICAgICAgIDogJ1VudGl0bGVkJyxcblx0XHRcdGhlYWRlckNsYXNzICAgOiAnc2VsZWN0aXplLWRyb3Bkb3duLWhlYWRlcicsXG5cdFx0XHR0aXRsZVJvd0NsYXNzIDogJ3NlbGVjdGl6ZS1kcm9wZG93bi1oZWFkZXItdGl0bGUnLFxuXHRcdFx0bGFiZWxDbGFzcyAgICA6ICdzZWxlY3RpemUtZHJvcGRvd24taGVhZGVyLWxhYmVsJyxcblx0XHRcdGNsb3NlQ2xhc3MgICAgOiAnc2VsZWN0aXplLWRyb3Bkb3duLWhlYWRlci1jbG9zZScsXG5cdFxuXHRcdFx0aHRtbDogZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwiJyArIGRhdGEuaGVhZGVyQ2xhc3MgKyAnXCI+JyArXG5cdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cIicgKyBkYXRhLnRpdGxlUm93Q2xhc3MgKyAnXCI+JyArXG5cdFx0XHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIicgKyBkYXRhLmxhYmVsQ2xhc3MgKyAnXCI+JyArIGRhdGEudGl0bGUgKyAnPC9zcGFuPicgK1xuXHRcdFx0XHRcdFx0XHQnPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiIGNsYXNzPVwiJyArIGRhdGEuY2xvc2VDbGFzcyArICdcIj4mdGltZXM7PC9hPicgK1xuXHRcdFx0XHRcdFx0JzwvZGl2PicgK1xuXHRcdFx0XHRcdCc8L2Rpdj4nXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSwgb3B0aW9ucyk7XG5cdFxuXHRcdHNlbGYuc2V0dXAgPSAoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgb3JpZ2luYWwgPSBzZWxmLnNldHVwO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRvcmlnaW5hbC5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXHRcdFx0XHRzZWxmLiRkcm9wZG93bl9oZWFkZXIgPSAkKG9wdGlvbnMuaHRtbChvcHRpb25zKSk7XG5cdFx0XHRcdHNlbGYuJGRyb3Bkb3duLnByZXBlbmQoc2VsZi4kZHJvcGRvd25faGVhZGVyKTtcblx0XHRcdH07XG5cdFx0fSkoKTtcblx0XG5cdH0pO1xuXHRcblx0U2VsZWN0aXplLmRlZmluZSgnb3B0Z3JvdXBfY29sdW1ucycsIGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdG9wdGlvbnMgPSAkLmV4dGVuZCh7XG5cdFx0XHRlcXVhbGl6ZVdpZHRoICA6IHRydWUsXG5cdFx0XHRlcXVhbGl6ZUhlaWdodCA6IHRydWVcblx0XHR9LCBvcHRpb25zKTtcblx0XG5cdFx0dGhpcy5nZXRBZGphY2VudE9wdGlvbiA9IGZ1bmN0aW9uKCRvcHRpb24sIGRpcmVjdGlvbikge1xuXHRcdFx0dmFyICRvcHRpb25zID0gJG9wdGlvbi5jbG9zZXN0KCdbZGF0YS1ncm91cF0nKS5maW5kKCdbZGF0YS1zZWxlY3RhYmxlXScpO1xuXHRcdFx0dmFyIGluZGV4ICAgID0gJG9wdGlvbnMuaW5kZXgoJG9wdGlvbikgKyBkaXJlY3Rpb247XG5cdFxuXHRcdFx0cmV0dXJuIGluZGV4ID49IDAgJiYgaW5kZXggPCAkb3B0aW9ucy5sZW5ndGggPyAkb3B0aW9ucy5lcShpbmRleCkgOiAkKCk7XG5cdFx0fTtcblx0XG5cdFx0dGhpcy5vbktleURvd24gPSAoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgb3JpZ2luYWwgPSBzZWxmLm9uS2V5RG93bjtcblx0XHRcdHJldHVybiBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdHZhciBpbmRleCwgJG9wdGlvbiwgJG9wdGlvbnMsICRvcHRncm91cDtcblx0XG5cdFx0XHRcdGlmICh0aGlzLmlzT3BlbiAmJiAoZS5rZXlDb2RlID09PSBLRVlfTEVGVCB8fCBlLmtleUNvZGUgPT09IEtFWV9SSUdIVCkpIHtcblx0XHRcdFx0XHRzZWxmLmlnbm9yZUhvdmVyID0gdHJ1ZTtcblx0XHRcdFx0XHQkb3B0Z3JvdXAgPSB0aGlzLiRhY3RpdmVPcHRpb24uY2xvc2VzdCgnW2RhdGEtZ3JvdXBdJyk7XG5cdFx0XHRcdFx0aW5kZXggPSAkb3B0Z3JvdXAuZmluZCgnW2RhdGEtc2VsZWN0YWJsZV0nKS5pbmRleCh0aGlzLiRhY3RpdmVPcHRpb24pO1xuXHRcblx0XHRcdFx0XHRpZihlLmtleUNvZGUgPT09IEtFWV9MRUZUKSB7XG5cdFx0XHRcdFx0XHQkb3B0Z3JvdXAgPSAkb3B0Z3JvdXAucHJldignW2RhdGEtZ3JvdXBdJyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRvcHRncm91cCA9ICRvcHRncm91cC5uZXh0KCdbZGF0YS1ncm91cF0nKTtcblx0XHRcdFx0XHR9XG5cdFxuXHRcdFx0XHRcdCRvcHRpb25zID0gJG9wdGdyb3VwLmZpbmQoJ1tkYXRhLXNlbGVjdGFibGVdJyk7XG5cdFx0XHRcdFx0JG9wdGlvbiAgPSAkb3B0aW9ucy5lcShNYXRoLm1pbigkb3B0aW9ucy5sZW5ndGggLSAxLCBpbmRleCkpO1xuXHRcdFx0XHRcdGlmICgkb3B0aW9uLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0dGhpcy5zZXRBY3RpdmVPcHRpb24oJG9wdGlvbik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcblx0XHRcdFx0cmV0dXJuIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHR9O1xuXHRcdH0pKCk7XG5cdFxuXHRcdHZhciBnZXRTY3JvbGxiYXJXaWR0aCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGRpdjtcblx0XHRcdHZhciB3aWR0aCA9IGdldFNjcm9sbGJhcldpZHRoLndpZHRoO1xuXHRcdFx0dmFyIGRvYyA9IGRvY3VtZW50O1xuXHRcblx0XHRcdGlmICh0eXBlb2Ygd2lkdGggPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdGRpdiA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0ZGl2LmlubmVySFRNTCA9ICc8ZGl2IHN0eWxlPVwid2lkdGg6NTBweDtoZWlnaHQ6NTBweDtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0Oi01MHB4O3RvcDotNTBweDtvdmVyZmxvdzphdXRvO1wiPjxkaXYgc3R5bGU9XCJ3aWR0aDoxcHg7aGVpZ2h0OjEwMHB4O1wiPjwvZGl2PjwvZGl2Pic7XG5cdFx0XHRcdGRpdiA9IGRpdi5maXJzdENoaWxkO1xuXHRcdFx0XHRkb2MuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuXHRcdFx0XHR3aWR0aCA9IGdldFNjcm9sbGJhcldpZHRoLndpZHRoID0gZGl2Lm9mZnNldFdpZHRoIC0gZGl2LmNsaWVudFdpZHRoO1xuXHRcdFx0XHRkb2MuYm9keS5yZW1vdmVDaGlsZChkaXYpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHdpZHRoO1xuXHRcdH07XG5cdFxuXHRcdHZhciBlcXVhbGl6ZVNpemVzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgaSwgbiwgaGVpZ2h0X21heCwgd2lkdGgsIHdpZHRoX2xhc3QsIHdpZHRoX3BhcmVudCwgJG9wdGdyb3Vwcztcblx0XG5cdFx0XHQkb3B0Z3JvdXBzID0gJCgnW2RhdGEtZ3JvdXBdJywgc2VsZi4kZHJvcGRvd25fY29udGVudCk7XG5cdFx0XHRuID0gJG9wdGdyb3Vwcy5sZW5ndGg7XG5cdFx0XHRpZiAoIW4gfHwgIXNlbGYuJGRyb3Bkb3duX2NvbnRlbnQud2lkdGgoKSkgcmV0dXJuO1xuXHRcblx0XHRcdGlmIChvcHRpb25zLmVxdWFsaXplSGVpZ2h0KSB7XG5cdFx0XHRcdGhlaWdodF9tYXggPSAwO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdFx0aGVpZ2h0X21heCA9IE1hdGgubWF4KGhlaWdodF9tYXgsICRvcHRncm91cHMuZXEoaSkuaGVpZ2h0KCkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRvcHRncm91cHMuY3NzKHtoZWlnaHQ6IGhlaWdodF9tYXh9KTtcblx0XHRcdH1cblx0XG5cdFx0XHRpZiAob3B0aW9ucy5lcXVhbGl6ZVdpZHRoKSB7XG5cdFx0XHRcdHdpZHRoX3BhcmVudCA9IHNlbGYuJGRyb3Bkb3duX2NvbnRlbnQuaW5uZXJXaWR0aCgpIC0gZ2V0U2Nyb2xsYmFyV2lkdGgoKTtcblx0XHRcdFx0d2lkdGggPSBNYXRoLnJvdW5kKHdpZHRoX3BhcmVudCAvIG4pO1xuXHRcdFx0XHQkb3B0Z3JvdXBzLmNzcyh7d2lkdGg6IHdpZHRofSk7XG5cdFx0XHRcdGlmIChuID4gMSkge1xuXHRcdFx0XHRcdHdpZHRoX2xhc3QgPSB3aWR0aF9wYXJlbnQgLSB3aWR0aCAqIChuIC0gMSk7XG5cdFx0XHRcdFx0JG9wdGdyb3Vwcy5lcShuIC0gMSkuY3NzKHt3aWR0aDogd2lkdGhfbGFzdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XG5cdFx0aWYgKG9wdGlvbnMuZXF1YWxpemVIZWlnaHQgfHwgb3B0aW9ucy5lcXVhbGl6ZVdpZHRoKSB7XG5cdFx0XHRob29rLmFmdGVyKHRoaXMsICdwb3NpdGlvbkRyb3Bkb3duJywgZXF1YWxpemVTaXplcyk7XG5cdFx0XHRob29rLmFmdGVyKHRoaXMsICdyZWZyZXNoT3B0aW9ucycsIGVxdWFsaXplU2l6ZXMpO1xuXHRcdH1cblx0XG5cdFxuXHR9KTtcblx0XG5cdFNlbGVjdGl6ZS5kZWZpbmUoJ3JlbW92ZV9idXR0b24nLCBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScpIHJldHVybjtcblx0XG5cdFx0b3B0aW9ucyA9ICQuZXh0ZW5kKHtcblx0XHRcdGxhYmVsICAgICA6ICcmdGltZXM7Jyxcblx0XHRcdHRpdGxlICAgICA6ICdSZW1vdmUnLFxuXHRcdFx0Y2xhc3NOYW1lIDogJ3JlbW92ZScsXG5cdFx0XHRhcHBlbmQgICAgOiB0cnVlXG5cdFx0fSwgb3B0aW9ucyk7XG5cdFxuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XHR2YXIgaHRtbCA9ICc8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgY2xhc3M9XCInICsgb3B0aW9ucy5jbGFzc05hbWUgKyAnXCIgdGFiaW5kZXg9XCItMVwiIHRpdGxlPVwiJyArIGVzY2FwZV9odG1sKG9wdGlvbnMudGl0bGUpICsgJ1wiPicgKyBvcHRpb25zLmxhYmVsICsgJzwvYT4nO1xuXHRcblx0XHQvKipcblx0XHQgKiBBcHBlbmRzIGFuIGVsZW1lbnQgYXMgYSBjaGlsZCAod2l0aCByYXcgSFRNTCkuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gaHRtbF9jb250YWluZXJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gaHRtbF9lbGVtZW50XG5cdFx0ICogQHJldHVybiB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdHZhciBhcHBlbmQgPSBmdW5jdGlvbihodG1sX2NvbnRhaW5lciwgaHRtbF9lbGVtZW50KSB7XG5cdFx0XHR2YXIgcG9zID0gaHRtbF9jb250YWluZXIuc2VhcmNoKC8oPFxcL1tePl0rPlxccyopJC8pO1xuXHRcdFx0cmV0dXJuIGh0bWxfY29udGFpbmVyLnN1YnN0cmluZygwLCBwb3MpICsgaHRtbF9lbGVtZW50ICsgaHRtbF9jb250YWluZXIuc3Vic3RyaW5nKHBvcyk7XG5cdFx0fTtcblx0XG5cdFx0dGhpcy5zZXR1cCA9IChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBvcmlnaW5hbCA9IHNlbGYuc2V0dXA7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIG92ZXJyaWRlIHRoZSBpdGVtIHJlbmRlcmluZyBtZXRob2QgdG8gYWRkIHRoZSBidXR0b24gdG8gZWFjaFxuXHRcdFx0XHRpZiAob3B0aW9ucy5hcHBlbmQpIHtcblx0XHRcdFx0XHR2YXIgcmVuZGVyX2l0ZW0gPSBzZWxmLnNldHRpbmdzLnJlbmRlci5pdGVtO1xuXHRcdFx0XHRcdHNlbGYuc2V0dGluZ3MucmVuZGVyLml0ZW0gPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYXBwZW5kKHJlbmRlcl9pdGVtLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIGh0bWwpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XG5cdFx0XHRcdG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFxuXHRcdFx0XHQvLyBhZGQgZXZlbnQgbGlzdGVuZXJcblx0XHRcdFx0dGhpcy4kY29udHJvbC5vbignY2xpY2snLCAnLicgKyBvcHRpb25zLmNsYXNzTmFtZSwgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRpZiAoc2VsZi5pc0xvY2tlZCkgcmV0dXJuO1xuXHRcblx0XHRcdFx0XHR2YXIgJGl0ZW0gPSAkKGUuY3VycmVudFRhcmdldCkucGFyZW50KCk7XG5cdFx0XHRcdFx0c2VsZi5zZXRBY3RpdmVJdGVtKCRpdGVtKTtcblx0XHRcdFx0XHRpZiAoc2VsZi5kZWxldGVTZWxlY3Rpb24oKSkge1xuXHRcdFx0XHRcdFx0c2VsZi5zZXRDYXJldChzZWxmLml0ZW1zLmxlbmd0aCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XG5cdFx0XHR9O1xuXHRcdH0pKCk7XG5cdFxuXHR9KTtcblx0XG5cdFNlbGVjdGl6ZS5kZWZpbmUoJ3Jlc3RvcmVfb25fYmFja3NwYWNlJywgZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblx0XG5cdFx0b3B0aW9ucy50ZXh0ID0gb3B0aW9ucy50ZXh0IHx8IGZ1bmN0aW9uKG9wdGlvbikge1xuXHRcdFx0cmV0dXJuIG9wdGlvblt0aGlzLnNldHRpbmdzLmxhYmVsRmllbGRdO1xuXHRcdH07XG5cdFxuXHRcdHRoaXMub25LZXlEb3duID0gKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gc2VsZi5vbktleURvd247XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oZSkge1xuXHRcdFx0XHR2YXIgaW5kZXgsIG9wdGlvbjtcblx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PT0gS0VZX0JBQ0tTUEFDRSAmJiB0aGlzLiRjb250cm9sX2lucHV0LnZhbCgpID09PSAnJyAmJiAhdGhpcy4kYWN0aXZlSXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aW5kZXggPSB0aGlzLmNhcmV0UG9zIC0gMTtcblx0XHRcdFx0XHRpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuaXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRvcHRpb24gPSB0aGlzLm9wdGlvbnNbdGhpcy5pdGVtc1tpbmRleF1dO1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuZGVsZXRlU2VsZWN0aW9uKGUpKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2V0VGV4dGJveFZhbHVlKG9wdGlvbnMudGV4dC5hcHBseSh0aGlzLCBbb3B0aW9uXSkpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnJlZnJlc2hPcHRpb25zKHRydWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gb3JpZ2luYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdH07XG5cdFx0fSkoKTtcblx0fSk7XG5cdFxuXG5cdHJldHVybiBTZWxlY3RpemU7XG59KSk7Il19