'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
		define(['jquery', 'sifter', 'microplugin'], factory);
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
				//(dest || document.body).focus();
				dest && dest.focus();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NlbGVjdGl6ZS5qcy9kaXN0L2pzL3NlbGVjdGl6ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQyxXQUFTLElBQVQsRUFBZSxPQUFmLEVBQXdCO0FBQ3hCLEtBQUksT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLE9BQU8sR0FBM0MsRUFBZ0Q7QUFDL0MsU0FBTyxDQUFDLFFBQUQsRUFBVSxRQUFWLEVBQW1CLGFBQW5CLENBQVAsRUFBMEMsT0FBMUM7QUFDQSxFQUZELE1BRU8sSUFBSSxRQUFPLE9BQVAseUNBQU8sT0FBUCxPQUFtQixRQUF2QixFQUFpQztBQUN2QyxTQUFPLE9BQVAsR0FBaUIsUUFBUSxRQUFRLFFBQVIsQ0FBUixFQUEyQixRQUFRLFFBQVIsQ0FBM0IsRUFBOEMsUUFBUSxhQUFSLENBQTlDLENBQWpCO0FBQ0EsRUFGTSxNQUVBO0FBQ04sT0FBSyxTQUFMLEdBQWlCLFFBQVEsS0FBSyxNQUFiLEVBQXFCLEtBQUssTUFBMUIsRUFBa0MsS0FBSyxXQUF2QyxDQUFqQjtBQUNBO0FBQ0QsQ0FSQSxhQVFPLFVBQVMsQ0FBVCxFQUFZLE1BQVosRUFBb0IsV0FBcEIsRUFBaUM7QUFDeEM7O0FBRUEsS0FBSSxZQUFZLG1CQUFTLFFBQVQsRUFBbUIsT0FBbkIsRUFBNEI7QUFDM0MsTUFBSSxPQUFPLE9BQVAsS0FBbUIsUUFBbkIsSUFBK0IsQ0FBQyxRQUFRLE1BQTVDLEVBQW9EO0FBQ3BELE1BQUksUUFBUyxPQUFPLE9BQVAsS0FBbUIsUUFBcEIsR0FBZ0MsSUFBSSxNQUFKLENBQVcsT0FBWCxFQUFvQixHQUFwQixDQUFoQyxHQUEyRCxPQUF2RTs7QUFFQSxNQUFJLFlBQVksU0FBWixTQUFZLENBQVMsSUFBVCxFQUFlO0FBQzlCLE9BQUksT0FBTyxDQUFYO0FBQ0EsT0FBSSxLQUFLLFFBQUwsS0FBa0IsQ0FBdEIsRUFBeUI7QUFDeEIsUUFBSSxNQUFNLEtBQUssSUFBTCxD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LFVBQU8sT0FBTyxLQUFLLFFBQUwsQ0FBYyxVQUFyQixDQUFQO0FBQ0EsR0FGRDs7QUFJQSxPQUFLLFNBQUwsR0FBa0IsWUFBVztBQUM1QixPQUFJLFdBQVcsS0FBSyxTQUFwQjtBQUNBLFVBQU8sVUFBUyxDQUFULEVBQVk7QUFDbEIsUUFBSSxLQUFKLEVBQVcsTUFBWDtBQUNBLFFBQUksRUFBRSxPQUFGLEtBQWMsYUFBZCxJQUErQixLQUFLLGNBQUwsQ0FBb0IsR0FBcEIsT0FBOEIsRUFBN0QsSUFBbUUsQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsTUFBMUYsRUFBa0c7QUFDakcsYUFBUSxLQUFLLFFBQUwsR0FBZ0IsQ0FBeEI7QUFDQSxTQUFJLFNBQVMsQ0FBVCxJQUFjLFFBQVEsS0FBSyxLQUFMLENBQVcsTUFBckMsRUFBNkM7QUFDNUMsZUFBUyxLQUFLLE9BQUwsQ0FBYSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWIsQ0FBVDtBQUNBLFVBQUksS0FBSyxlQUFMLENBQXFCLENBQXJCLENBQUosRUFBNkI7QUFDNUIsWUFBSyxlQUFMLENBQXFCLFFBQVEsSUFBUixDQUFhLEtBQWIsQ0FBbUIsSUFBbkIsRUFBeUIsQ0FBQyxNQUFELENBQXpCLENBQXJCO0FBQ0EsWUFBSyxjQUFMLENBQW9CLElBQXBCO0FBQ0E7QUFDRCxRQUFFLGNBQUY7QUFDQTtBQUNBO0FBQ0Q7QUFDRCxXQUFPLFNBQVMsS0FBVCxDQUFlLElBQWYsRUFBcUIsU0FBckIsQ0FBUDtBQUNBLElBZkQ7QUFnQkEsR0FsQmdCLEVBQWpCO0FBbUJBLEVBMUJEOztBQTZCQSxRQUFPLFNBQVA7QUFDQSxDQS85RkEsQ0FBRCIsImZpbGUiOiJzZWxlY3RpemUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIHNlbGVjdGl6ZS5qcyAodjAuMTIuMSlcbiAqIENvcHlyaWdodCAoYykgMjAxM+KAkzIwMTUgQnJpYW4gUmVhdmlzICYgY29udHJpYnV0b3JzXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXNcbiAqIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0OlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlclxuICogdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRlxuICogQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlXG4gKiBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBhdXRob3IgQnJpYW4gUmVhdmlzIDxicmlhbkB0aGlyZHJvdXRlLmNvbT5cbiAqL1xuXG4vKmpzaGludCBjdXJseTpmYWxzZSAqL1xuLypqc2hpbnQgYnJvd3Nlcjp0cnVlICovXG5cbihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoWydqcXVlcnknLCdzaWZ0ZXInLCdtaWNyb3BsdWdpbiddLCBmYWN0b3J5KTtcblx0fSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JyksIHJlcXVpcmUoJ3NpZnRlcicpLCByZXF1aXJlKCdtaWNyb3BsdWdpbicpKTtcblx0fSBlbHNlIHtcblx0XHRyb290LlNlbGVjdGl6ZSA9IGZhY3Rvcnkocm9vdC5qUXVlcnksIHJvb3QuU2lmdGVyLCByb290Lk1pY3JvUGx1Z2luKTtcblx0fVxufSh0aGlzLCBmdW5jdGlvbigkLCBTaWZ0ZXIsIE1pY3JvUGx1Z2luKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGlnaGxpZ2h0ID0gZnVuY3Rpb24oJGVsZW1lbnQsIHBhdHRlcm4pIHtcblx0XHRpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnICYmICFwYXR0ZXJuLmxlbmd0aCkgcmV0dXJuO1xuXHRcdHZhciByZWdleCA9ICh0eXBlb2YgcGF0dGVybiA9PT0gJ3N0cmluZycpID8gbmV3IFJlZ0V4cChwYXR0ZXJuLCAnaScpIDogcGF0dGVybjtcblx0XG5cdFx0dmFyIGhpZ2hsaWdodCA9IGZ1bmN0aW9uKG5vZGUpIHtcblx0XHRcdHZhciBza2lwID0gMDtcblx0XHRcdGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG5cdFx0XHRcdHZhciBwb3MgPSBub2RlLmRhdGEuc2VhcmNoKHJlZ2V4KTtcblx0XHRcdFx0aWYgKHBvcyA+PSAwICYmIG5vZGUuZGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0dmFyIG1hdGNoID0gbm9kZS5kYXRhLm1hdGNoKHJlZ2V4KTtcblx0XHRcdFx0XHR2YXIgc3Bhbm5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0XHRcdFx0c3Bhbm5vZGUuY2xhc3NOYW1lID0gJ2hpZ2hsaWdodCc7XG5cdFx0XHRcdFx0dmFyIG1pZGRsZWJpdCA9IG5vZGUuc3BsaXRUZXh0KHBvcyk7XG5cdFx0XHRcdFx0dmFyIGVuZGJpdCA9IG1pZGRsZWJpdC5zcGxpdFRleHQobWF0Y2hbMF0ubGVuZ3RoKTtcblx0XHRcdFx0XHR2YXIgbWlkZGxlY2xvbmUgPSBtaWRkbGViaXQuY2xvbmVOb2RlKHRydWUpO1xuXHRcdFx0XHRcdHNwYW5ub2RlLmFwcGVuZENoaWxkKG1pZGRsZWNsb25lKTtcblx0XHRcdFx0XHRtaWRkbGViaXQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc3Bhbm5vZGUsIG1pZGRsZWJpdCk7XG5cdFx0XHRcdFx0c2tpcCA9IDE7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSAmJiBub2RlLmNoaWxkTm9kZXMgJiYgIS8oc2NyaXB0fHN0eWxlKS9pLnRlc3Qobm9kZS50YWdOYW1lKSkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHRcdGkgKz0gaGlnaGxpZ2h0KG5vZGUuY2hpbGROb2Rlc1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBza2lwO1xuXHRcdH07XG5cdFxuXHRcdHJldHVybiAkZWxlbWVudC5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0aGlnaGxpZ2h0KHRoaXMpO1xuXHRcdH0pO1xuXHR9O1xuXHRcblx0dmFyIE1pY3JvRXZlbnQgPSBmdW5jdGlvbigpIHt9O1xuXHRNaWNyb0V2ZW50LnByb3RvdHlwZSA9IHtcblx0XHRvbjogZnVuY3Rpb24oZXZlbnQsIGZjdCl7XG5cdFx0XHR0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG5cdFx0XHR0aGlzLl9ldmVudHNbZXZlbnRdID0gdGhpcy5fZXZlbnRzW2V2ZW50XSB8fCBbXTtcblx0XHRcdHRoaXMuX2V2ZW50c1tldmVudF0ucHVzaChmY3QpO1xuXHRcdH0sXG5cdFx0b2ZmOiBmdW5jdGlvbihldmVudCwgZmN0KXtcblx0XHRcdHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcblx0XHRcdGlmIChuID09PSAwKSByZXR1cm4gZGVsZXRlIHRoaXMuX2V2ZW50cztcblx0XHRcdGlmIChuID09PSAxKSByZXR1cm4gZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudF07XG5cdFxuXHRcdFx0dGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuXHRcdFx0aWYgKGV2ZW50IGluIHRoaXMuX2V2ZW50cyA9PT0gZmFsc2UpIHJldHVybjtcblx0XHRcdHRoaXMuX2V2ZW50c1tldmVudF0uc3BsaWNlKHRoaXMuX2V2ZW50c1tldmVudF0uaW5kZXhPZihmY3QpLCAxKTtcblx0XHR9LFxuXHRcdHRyaWdnZXI6IGZ1bmN0aW9uKGV2ZW50IC8qICwgYXJncy4uLiAqLyl7XG5cdFx0XHR0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG5cdFx0XHRpZiAoZXZlbnQgaW4gdGhpcy5fZXZlbnRzID09PSBmYWxzZSkgcmV0dXJuO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9ldmVudHNbZXZlbnRdLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0dGhpcy5fZXZlbnRzW2V2ZW50XVtpXS5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdFxuXHQvKipcblx0ICogTWl4aW4gd2lsbCBkZWxlZ2F0ZSBhbGwgTWljcm9FdmVudC5qcyBmdW5jdGlvbiBpbiB0aGUgZGVzdGluYXRpb24gb2JqZWN0LlxuXHQgKlxuXHQgKiAtIE1pY3JvRXZlbnQubWl4aW4oRm9vYmFyKSB3aWxsIG1ha2UgRm9vYmFyIGFibGUgdG8gdXNlIE1pY3JvRXZlbnRcblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IHRoZSBvYmplY3Qgd2hpY2ggd2lsbCBzdXBwb3J0IE1pY3JvRXZlbnRcblx0ICovXG5cdE1pY3JvRXZlbnQubWl4aW4gPSBmdW5jdGlvbihkZXN0T2JqZWN0KXtcblx0XHR2YXIgcHJvcHMgPSBbJ29uJywgJ29mZicsICd0cmlnZ2VyJ107XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRkZXN0T2JqZWN0LnByb3RvdHlwZVtwcm9wc1tpXV0gPSBNaWNyb0V2ZW50LnByb3RvdHlwZVtwcm9wc1tpXV07XG5cdFx0fVxuXHR9O1xuXHRcblx0dmFyIElTX01BQyAgICAgICAgPSAvTWFjLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXHRcblx0dmFyIEtFWV9BICAgICAgICAgPSA2NTtcblx0dmFyIEtFWV9DT01NQSAgICAgPSAxODg7XG5cdHZhciBLRVlfUkVUVVJOICAgID0gMTM7XG5cdHZhciBLRVlfRVNDICAgICAgID0gMjc7XG5cdHZhciBLRVlfTEVGVCAgICAgID0gMzc7XG5cdHZhciBLRVlfVVAgICAgICAgID0gMzg7XG5cdHZhciBLRVlfUCAgICAgICAgID0gODA7XG5cdHZhciBLRVlfUklHSFQgICAgID0gMzk7XG5cdHZhciBLRVlfRE9XTiAgICAgID0gNDA7XG5cdHZhciBLRVlfTiAgICAgICAgID0gNzg7XG5cdHZhciBLRVlfQkFDS1NQQUNFID0gODtcblx0dmFyIEtFWV9ERUxFVEUgICAgPSA0Njtcblx0dmFyIEtFWV9TSElGVCAgICAgPSAxNjtcblx0dmFyIEtFWV9DTUQgICAgICAgPSBJU19NQUMgPyA5MSA6IDE3O1xuXHR2YXIgS0VZX0NUUkwgICAgICA9IElTX01BQyA/IDE4IDogMTc7XG5cdHZhciBLRVlfVEFCICAgICAgID0gOTtcblx0XG5cdHZhciBUQUdfU0VMRUNUICAgID0gMTtcblx0dmFyIFRBR19JTlBVVCAgICAgPSAyO1xuXHRcblx0Ly8gZm9yIG5vdywgYW5kcm9pZCBzdXBwb3J0IGluIGdlbmVyYWwgaXMgdG9vIHNwb3R0eSB0byBzdXBwb3J0IHZhbGlkaXR5XG5cdHZhciBTVVBQT1JUU19WQUxJRElUWV9BUEkgPSAhL2FuZHJvaWQvaS50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSAmJiAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKS52YWxpZGl0eTtcblx0XG5cdHZhciBpc3NldCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXHRcdHJldHVybiB0eXBlb2Ygb2JqZWN0ICE9PSAndW5kZWZpbmVkJztcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIHNjYWxhciB0byBpdHMgYmVzdCBzdHJpbmcgcmVwcmVzZW50YXRpb25cblx0ICogZm9yIGhhc2gga2V5cyBhbmQgSFRNTCBhdHRyaWJ1dGUgdmFsdWVzLlxuXHQgKlxuXHQgKiBUcmFuc2Zvcm1hdGlvbnM6XG5cdCAqICAgJ3N0cicgICAgIC0+ICdzdHInXG5cdCAqICAgbnVsbCAgICAgIC0+ICcnXG5cdCAqICAgdW5kZWZpbmVkIC0+ICcnXG5cdCAqICAgdHJ1ZSAgICAgIC0+ICcxJ1xuXHQgKiAgIGZhbHNlICAgICAtPiAnMCdcblx0ICogICAwICAgICAgICAgLT4gJzAnXG5cdCAqICAgMSAgICAgICAgIC0+ICcxJ1xuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcblx0ICogQHJldHVybnMge3N0cmluZ3xudWxsfVxuXHQgKi9cblx0dmFyIGhhc2hfa2V5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKSByZXR1cm4gdmFsdWUgPyAnMScgOiAnMCc7XG5cdFx0cmV0dXJuIHZhbHVlICsgJyc7XG5cdH07XG5cdFxuXHQvKipcblx0ICogRXNjYXBlcyBhIHN0cmluZyBmb3IgdXNlIHdpdGhpbiBIVE1MLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdCAqL1xuXHR2YXIgZXNjYXBlX2h0bWwgPSBmdW5jdGlvbihzdHIpIHtcblx0XHRyZXR1cm4gKHN0ciArICcnKVxuXHRcdFx0LnJlcGxhY2UoLyYvZywgJyZhbXA7Jylcblx0XHRcdC5yZXBsYWNlKC88L2csICcmbHQ7Jylcblx0XHRcdC5yZXBsYWNlKC8+L2csICcmZ3Q7Jylcblx0XHRcdC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG5cdH07XG5cdFxuXHQvKipcblx0ICogRXNjYXBlcyBcIiRcIiBjaGFyYWN0ZXJzIGluIHJlcGxhY2VtZW50IHN0cmluZ3MuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcblx0ICogQHJldHVybnMge3N0cmluZ31cblx0ICovXG5cdHZhciBlc2NhcGVfcmVwbGFjZSA9IGZ1bmN0aW9uKHN0cikge1xuXHRcdHJldHVybiAoc3RyICsgJycpLnJlcGxhY2UoL1xcJC9nLCAnJCQkJCcpO1xuXHR9O1xuXHRcblx0dmFyIGhvb2sgPSB7fTtcblx0XG5cdC8qKlxuXHQgKiBXcmFwcyBgbWV0aG9kYCBvbiBgc2VsZmAgc28gdGhhdCBgZm5gXG5cdCAqIGlzIGludm9rZWQgYmVmb3JlIHRoZSBvcmlnaW5hbCBtZXRob2QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBzZWxmXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2Rcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gZm5cblx0ICovXG5cdGhvb2suYmVmb3JlID0gZnVuY3Rpb24oc2VsZiwgbWV0aG9kLCBmbikge1xuXHRcdHZhciBvcmlnaW5hbCA9IHNlbGZbbWV0aG9kXTtcblx0XHRzZWxmW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcblx0XHRcdGZuLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG5cdFx0XHRyZXR1cm4gb3JpZ2luYWwuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcblx0XHR9O1xuXHR9O1xuXHRcblx0LyoqXG5cdCAqIFdyYXBzIGBtZXRob2RgIG9uIGBzZWxmYCBzbyB0aGF0IGBmbmBcblx0ICogaXMgaW52b2tlZCBhZnRlciB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gc2VsZlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuXG5cdCAqL1xuXHRob29rLmFmdGVyID0gZnVuY3Rpb24oc2VsZiwgbWV0aG9kLCBmbikge1xuXHRcdHZhciBvcmlnaW5hbCA9IHNlbGZbbWV0aG9kXTtcblx0XHRzZWxmW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciByZXN1bHQgPSBvcmlnaW5hbC5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXHRcdFx0Zm4uYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBXcmFwcyBgZm5gIHNvIHRoYXQgaXQgY2FuIG9ubHkgYmUgaW52b2tlZCBvbmNlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmblxuXHQgKiBAcmV0dXJucyB7ZnVuY3Rpb259XG5cdCAqL1xuXHR2YXIgb25jZSA9IGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIGNhbGxlZCA9IGZhbHNlO1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdGlmIChjYWxsZWQpIHJldHVybjtcblx0XHRcdGNhbGxlZCA9IHRydWU7XG5cdFx0XHRmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdH07XG5cdH07XG5cdFxuXHQvKipcblx0ICogV3JhcHMgYGZuYCBzbyB0aGF0IGl0IGNhbiBvbmx5IGJlIGNhbGxlZCBvbmNlXG5cdCAqIGV2ZXJ5IGBkZWxheWAgbWlsbGlzZWNvbmRzIChpbnZva2VkIG9uIHRoZSBmYWxsaW5nIGVkZ2UpLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmblxuXHQgKiBAcGFyYW0ge2ludH0gZGVsYXlcblx0ICogQHJldHVybnMge2Z1bmN0aW9ufVxuXHQgKi9cblx0dmFyIGRlYm91bmNlID0gZnVuY3Rpb24oZm4sIGRlbGF5KSB7XG5cdFx0dmFyIHRpbWVvdXQ7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHR3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdFx0dGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRmbi5hcHBseShzZWxmLCBhcmdzKTtcblx0XHRcdH0sIGRlbGF5KTtcblx0XHR9O1xuXHR9O1xuXHRcblx0LyoqXG5cdCAqIERlYm91bmNlIGFsbCBmaXJlZCBldmVudHMgdHlwZXMgbGlzdGVkIGluIGB0eXBlc2Bcblx0ICogd2hpbGUgZXhlY3V0aW5nIHRoZSBwcm92aWRlZCBgZm5gLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gc2VsZlxuXHQgKiBAcGFyYW0ge2FycmF5fSB0eXBlc1xuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmblxuXHQgKi9cblx0dmFyIGRlYm91bmNlX2V2ZW50cyA9IGZ1bmN0aW9uKHNlbGYsIHR5cGVzLCBmbikge1xuXHRcdHZhciB0eXBlO1xuXHRcdHZhciB0cmlnZ2VyID0gc2VsZi50cmlnZ2VyO1xuXHRcdHZhciBldmVudF9hcmdzID0ge307XG5cdFxuXHRcdC8vIG92ZXJyaWRlIHRyaWdnZXIgbWV0aG9kXG5cdFx0c2VsZi50cmlnZ2VyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdHlwZSA9IGFyZ3VtZW50c1swXTtcblx0XHRcdGlmICh0eXBlcy5pbmRleE9mKHR5cGUpICE9PSAtMSkge1xuXHRcdFx0XHRldmVudF9hcmdzW3R5cGVdID0gYXJndW1lbnRzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRyaWdnZXIuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcblx0XHQvLyBpbnZva2UgcHJvdmlkZWQgZnVuY3Rpb25cblx0XHRmbi5hcHBseShzZWxmLCBbXSk7XG5cdFx0c2VsZi50cmlnZ2VyID0gdHJpZ2dlcjtcblx0XG5cdFx0Ly8gdHJpZ2dlciBxdWV1ZWQgZXZlbnRzXG5cdFx0Zm9yICh0eXBlIGluIGV2ZW50X2FyZ3MpIHtcblx0XHRcdGlmIChldmVudF9hcmdzLmhhc093blByb3BlcnR5KHR5cGUpKSB7XG5cdFx0XHRcdHRyaWdnZXIuYXBwbHkoc2VsZiwgZXZlbnRfYXJnc1t0eXBlXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRcblx0LyoqXG5cdCAqIEEgd29ya2Fyb3VuZCBmb3IgaHR0cDovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvNjY5NlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gJHBhcmVudCAtIFBhcmVudCBlbGVtZW50IHRvIGxpc3RlbiBvbi5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IC0gRXZlbnQgbmFtZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gRGVzY2VuZGFudCBzZWxlY3RvciB0byBmaWx0ZXIgYnkuXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIC0gRXZlbnQgaGFuZGxlci5cblx0ICovXG5cdHZhciB3YXRjaENoaWxkRXZlbnQgPSBmdW5jdGlvbigkcGFyZW50LCBldmVudCwgc2VsZWN0b3IsIGZuKSB7XG5cdFx0JHBhcmVudC5vbihldmVudCwgc2VsZWN0b3IsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciBjaGlsZCA9IGUudGFyZ2V0O1xuXHRcdFx0d2hpbGUgKGNoaWxkICYmIGNoaWxkLnBhcmVudE5vZGUgIT09ICRwYXJlbnRbMF0pIHtcblx0XHRcdFx0Y2hpbGQgPSBjaGlsZC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXHRcdFx0ZS5jdXJyZW50VGFyZ2V0ID0gY2hpbGQ7XG5cdFx0XHRyZXR1cm4gZm4uYXBwbHkodGhpcywgW2VdKTtcblx0XHR9KTtcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBEZXRlcm1pbmVzIHRoZSBjdXJyZW50IHNlbGVjdGlvbiB3aXRoaW4gYSB0ZXh0IGlucHV0IGNvbnRyb2wuXG5cdCAqIFJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmc6XG5cdCAqICAgLSBzdGFydFxuXHQgKiAgIC0gbGVuZ3RoXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBpbnB1dFxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fVxuXHQgKi9cblx0dmFyIGdldFNlbGVjdGlvbiA9IGZ1bmN0aW9uKGlucHV0KSB7XG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdGlmICgnc2VsZWN0aW9uU3RhcnQnIGluIGlucHV0KSB7XG5cdFx0XHRyZXN1bHQuc3RhcnQgPSBpbnB1dC5zZWxlY3Rpb25TdGFydDtcblx0XHRcdHJlc3VsdC5sZW5ndGggPSBpbnB1dC5zZWxlY3Rpb25FbmQgLSByZXN1bHQuc3RhcnQ7XG5cdFx0fSBlbHNlIGlmIChkb2N1bWVudC5zZWxlY3Rpb24pIHtcblx0XHRcdGlucHV0LmZvY3VzKCk7XG5cdFx0XHR2YXIgc2VsID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCk7XG5cdFx0XHR2YXIgc2VsTGVuID0gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCkudGV4dC5sZW5ndGg7XG5cdFx0XHRzZWwubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCAtaW5wdXQudmFsdWUubGVuZ3RoKTtcblx0XHRcdHJlc3VsdC5zdGFydCA9IHNlbC50ZXh0Lmxlbmd0aCAtIHNlbExlbjtcblx0XHRcdHJlc3VsdC5sZW5ndGggPSBzZWxMZW47XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cdFxuXHQvKipcblx0ICogQ29waWVzIENTUyBwcm9wZXJ0aWVzIGZyb20gb25lIGVsZW1lbnQgdG8gYW5vdGhlci5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9ICRmcm9tXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkdG9cblx0ICogQHBhcmFtIHthcnJheX0gcHJvcGVydGllc1xuXHQgKi9cblx0dmFyIHRyYW5zZmVyU3R5bGVzID0gZnVuY3Rpb24oJGZyb20sICR0bywgcHJvcGVydGllcykge1xuXHRcdHZhciBpLCBuLCBzdHlsZXMgPSB7fTtcblx0XHRpZiAocHJvcGVydGllcykge1xuXHRcdFx0Zm9yIChpID0gMCwgbiA9IHByb3BlcnRpZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdHN0eWxlc1twcm9wZXJ0aWVzW2ldXSA9ICRmcm9tLmNzcyhwcm9wZXJ0aWVzW2ldKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGVzID0gJGZyb20uY3NzKCk7XG5cdFx0fVxuXHRcdCR0by5jc3Moc3R5bGVzKTtcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBNZWFzdXJlcyB0aGUgd2lkdGggb2YgYSBzdHJpbmcgd2l0aGluIGFcblx0ICogcGFyZW50IGVsZW1lbnQgKGluIHBpeGVscykuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcblx0ICogQHBhcmFtIHtvYmplY3R9ICRwYXJlbnRcblx0ICogQHJldHVybnMge2ludH1cblx0ICovXG5cdHZhciBtZWFzdXJlU3RyaW5nID0gZnVuY3Rpb24oc3RyLCAkcGFyZW50KSB7XG5cdFx0aWYgKCFzdHIpIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblx0XG5cdFx0dmFyICR0ZXN0ID0gJCgnPHRlc3Q+JykuY3NzKHtcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuXHRcdFx0dG9wOiAtOTk5OTksXG5cdFx0XHRsZWZ0OiAtOTk5OTksXG5cdFx0XHR3aWR0aDogJ2F1dG8nLFxuXHRcdFx0cGFkZGluZzogMCxcblx0XHRcdHdoaXRlU3BhY2U6ICdwcmUnXG5cdFx0fSkudGV4dChzdHIpLmFwcGVuZFRvKCdib2R5Jyk7XG5cdFxuXHRcdHRyYW5zZmVyU3R5bGVzKCRwYXJlbnQsICR0ZXN0LCBbXG5cdFx0XHQnbGV0dGVyU3BhY2luZycsXG5cdFx0XHQnZm9udFNpemUnLFxuXHRcdFx0J2ZvbnRGYW1pbHknLFxuXHRcdFx0J2ZvbnRXZWlnaHQnLFxuXHRcdFx0J3RleHRUcmFuc2Zvcm0nXG5cdFx0XSk7XG5cdFxuXHRcdHZhciB3aWR0aCA9ICR0ZXN0LndpZHRoKCk7XG5cdFx0JHRlc3QucmVtb3ZlKCk7XG5cdFxuXHRcdHJldHVybiB3aWR0aDtcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBTZXRzIHVwIGFuIGlucHV0IHRvIGdyb3cgaG9yaXpvbnRhbGx5IGFzIHRoZSB1c2VyXG5cdCAqIHR5cGVzLiBJZiB0aGUgdmFsdWUgaXMgY2hhbmdlZCBtYW51YWxseSwgeW91IGNhblxuXHQgKiB0cmlnZ2VyIHRoZSBcInVwZGF0ZVwiIGhhbmRsZXIgdG8gcmVzaXplOlxuXHQgKlxuXHQgKiAkaW5wdXQudHJpZ2dlcigndXBkYXRlJyk7XG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkaW5wdXRcblx0ICovXG5cdHZhciBhdXRvR3JvdyA9IGZ1bmN0aW9uKCRpbnB1dCkge1xuXHRcdHZhciBjdXJyZW50V2lkdGggPSBudWxsO1xuXHRcblx0XHR2YXIgdXBkYXRlID0gZnVuY3Rpb24oZSwgb3B0aW9ucykge1xuXHRcdFx0dmFyIHZhbHVlLCBrZXlDb2RlLCBwcmludGFibGUsIHBsYWNlaG9sZGVyLCB3aWR0aDtcblx0XHRcdHZhciBzaGlmdCwgY2hhcmFjdGVyLCBzZWxlY3Rpb247XG5cdFx0XHRlID0gZSB8fCB3aW5kb3cuZXZlbnQgfHwge307XG5cdFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0XG5cdFx0XHRpZiAoZS5tZXRhS2V5IHx8IGUuYWx0S2V5KSByZXR1cm47XG5cdFx0XHRpZiAoIW9wdGlvbnMuZm9yY2UgJiYgJGlucHV0LmRhdGEoJ2dyb3cnKSA9PT0gZmFsc2UpIHJldHVybjtcblx0XG5cdFx0XHR2YWx1ZSA9ICRpbnB1dC52YWwoKTtcblx0XHRcdGlmIChlLnR5cGUgJiYgZS50eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdrZXlkb3duJykge1xuXHRcdFx0XHRrZXlDb2RlID0gZS5rZXlDb2RlO1xuXHRcdFx0XHRwcmludGFibGUgPSAoXG5cdFx0XHRcdFx0KGtleUNvZGUgPj0gOTcgJiYga2V5Q29kZSA8PSAxMjIpIHx8IC8vIGEtelxuXHRcdFx0XHRcdChrZXlDb2RlID49IDY1ICYmIGtleUNvZGUgPD0gOTApICB8fCAvLyBBLVpcblx0XHRcdFx0XHQoa2V5Q29kZSA+PSA0OCAmJiBrZXlDb2RlIDw9IDU3KSAgfHwgLy8gMC05XG5cdFx0XHRcdFx0a2V5Q29kZSA9PT0gMzIgLy8gc3BhY2Vcblx0XHRcdFx0KTtcblx0XG5cdFx0XHRcdGlmIChrZXlDb2RlID09PSBLRVlfREVMRVRFIHx8IGtleUNvZGUgPT09IEtFWV9CQUNLU1BBQ0UpIHtcblx0XHRcdFx0XHRzZWxlY3Rpb24gPSBnZXRTZWxlY3Rpb24oJGlucHV0WzBdKTtcblx0XHRcdFx0XHRpZiAoc2VsZWN0aW9uLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgc2VsZWN0aW9uLnN0YXJ0KSArIHZhbHVlLnN1YnN0cmluZyhzZWxlY3Rpb24uc3RhcnQgKyBzZWxlY3Rpb24ubGVuZ3RoKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGtleUNvZGUgPT09IEtFWV9CQUNLU1BBQ0UgJiYgc2VsZWN0aW9uLnN0YXJ0KSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnN1YnN0cmluZygwLCBzZWxlY3Rpb24uc3RhcnQgLSAxKSArIHZhbHVlLnN1YnN0cmluZyhzZWxlY3Rpb24uc3RhcnQgKyAxKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGtleUNvZGUgPT09IEtFWV9ERUxFVEUgJiYgdHlwZW9mIHNlbGVjdGlvbi5zdGFydCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDAsIHNlbGVjdGlvbi5zdGFydCkgKyB2YWx1ZS5zdWJzdHJpbmcoc2VsZWN0aW9uLnN0YXJ0ICsgMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKHByaW50YWJsZSkge1xuXHRcdFx0XHRcdHNoaWZ0ID0gZS5zaGlmdEtleTtcblx0XHRcdFx0XHRjaGFyYWN0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUua2V5Q29kZSk7XG5cdFx0XHRcdFx0aWYgKHNoaWZ0KSBjaGFyYWN0ZXIgPSBjaGFyYWN0ZXIudG9VcHBlckNhc2UoKTtcblx0XHRcdFx0XHRlbHNlIGNoYXJhY3RlciA9IGNoYXJhY3Rlci50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdHZhbHVlICs9IGNoYXJhY3Rlcjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcblx0XHRcdHBsYWNlaG9sZGVyID0gJGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJyk7XG5cdFx0XHRpZiAoIXZhbHVlICYmIHBsYWNlaG9sZGVyKSB7XG5cdFx0XHRcdHZhbHVlID0gcGxhY2Vob2xkZXI7XG5cdFx0XHR9XG5cdFxuXHRcdFx0d2lkdGggPSBtZWFzdXJlU3RyaW5nKHZhbHVlLCAkaW5wdXQpICsgNDtcblx0XHRcdGlmICh3aWR0aCAhPT0gY3VycmVudFdpZHRoKSB7XG5cdFx0XHRcdGN1cnJlbnRXaWR0aCA9IHdpZHRoO1xuXHRcdFx0XHQkaW5wdXQud2lkdGgod2lkdGgpO1xuXHRcdFx0XHQkaW5wdXQudHJpZ2dlckhhbmRsZXIoJ3Jlc2l6ZScpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFxuXHRcdCRpbnB1dC5vbigna2V5ZG93biBrZXl1cCB1cGRhdGUgYmx1cicsIHVwZGF0ZSk7XG5cdFx0dXBkYXRlKCk7XG5cdH07XG5cdFxuXHR2YXIgU2VsZWN0aXplID0gZnVuY3Rpb24oJGlucHV0LCBzZXR0aW5ncykge1xuXHRcdHZhciBrZXksIGksIG4sIGRpciwgaW5wdXQsIHNlbGYgPSB0aGlzO1xuXHRcdGlucHV0ID0gJGlucHV0WzBdO1xuXHRcdGlucHV0LnNlbGVjdGl6ZSA9IHNlbGY7XG5cdFxuXHRcdC8vIGRldGVjdCBydGwgZW52aXJvbm1lbnRcblx0XHR2YXIgY29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlICYmIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGlucHV0LCBudWxsKTtcblx0XHRkaXIgPSBjb21wdXRlZFN0eWxlID8gY29tcHV0ZWRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdkaXJlY3Rpb24nKSA6IGlucHV0LmN1cnJlbnRTdHlsZSAmJiBpbnB1dC5jdXJyZW50U3R5bGUuZGlyZWN0aW9uO1xuXHRcdGRpciA9IGRpciB8fCAkaW5wdXQucGFyZW50cygnW2Rpcl06Zmlyc3QnKS5hdHRyKCdkaXInKSB8fCAnJztcblx0XG5cdFx0Ly8gc2V0dXAgZGVmYXVsdCBzdGF0ZVxuXHRcdCQuZXh0ZW5kKHNlbGYsIHtcblx0XHRcdG9yZGVyICAgICAgICAgICAgOiAwLFxuXHRcdFx0c2V0dGluZ3MgICAgICAgICA6IHNldHRpbmdzLFxuXHRcdFx0JGlucHV0ICAgICAgICAgICA6ICRpbnB1dCxcblx0XHRcdHRhYkluZGV4ICAgICAgICAgOiAkaW5wdXQuYXR0cigndGFiaW5kZXgnKSB8fCAnJyxcblx0XHRcdHRhZ1R5cGUgICAgICAgICAgOiBpbnB1dC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnID8gVEFHX1NFTEVDVCA6IFRBR19JTlBVVCxcblx0XHRcdHJ0bCAgICAgICAgICAgICAgOiAvcnRsL2kudGVzdChkaXIpLFxuXHRcblx0XHRcdGV2ZW50TlMgICAgICAgICAgOiAnLnNlbGVjdGl6ZScgKyAoKytTZWxlY3RpemUuY291bnQpLFxuXHRcdFx0aGlnaGxpZ2h0ZWRWYWx1ZSA6IG51bGwsXG5cdFx0XHRpc09wZW4gICAgICAgICAgIDogZmFsc2UsXG5cdFx0XHRpc0Rpc2FibGVkICAgICAgIDogZmFsc2UsXG5cdFx0XHRpc1JlcXVpcmVkICAgICAgIDogJGlucHV0LmlzKCdbcmVxdWlyZWRdJyksXG5cdFx0XHRpc0ludmFsaWQgICAgICAgIDogZmFsc2UsXG5cdFx0XHRpc0xvY2tlZCAgICAgICAgIDogZmFsc2UsXG5cdFx0XHRpc0ZvY3VzZWQgICAgICAgIDogZmFsc2UsXG5cdFx0XHRpc0lucHV0SGlkZGVuICAgIDogZmFsc2UsXG5cdFx0XHRpc1NldHVwICAgICAgICAgIDogZmFsc2UsXG5cdFx0XHRpc1NoaWZ0RG93biAgICAgIDogZmFsc2UsXG5cdFx0XHRpc0NtZERvd24gICAgICAgIDogZmFsc2UsXG5cdFx0XHRpc0N0cmxEb3duICAgICAgIDogZmFsc2UsXG5cdFx0XHRpZ25vcmVGb2N1cyAgICAgIDogZmFsc2UsXG5cdFx0XHRpZ25vcmVCbHVyICAgICAgIDogZmFsc2UsXG5cdFx0XHRpZ25vcmVIb3ZlciAgICAgIDogZmFsc2UsXG5cdFx0XHRoYXNPcHRpb25zICAgICAgIDogZmFsc2UsXG5cdFx0XHRjdXJyZW50UmVzdWx0cyAgIDogbnVsbCxcblx0XHRcdGxhc3RWYWx1ZSAgICAgICAgOiAnJyxcblx0XHRcdGNhcmV0UG9zICAgICAgICAgOiAwLFxuXHRcdFx0bG9hZGluZyAgICAgICAgICA6IDAsXG5cdFx0XHRsb2FkZWRTZWFyY2hlcyAgIDoge30sXG5cdFxuXHRcdFx0JGFjdGl2ZU9wdGlvbiAgICA6IG51bGwsXG5cdFx0XHQkYWN0aXZlSXRlbXMgICAgIDogW10sXG5cdFxuXHRcdFx0b3B0Z3JvdXBzICAgICAgICA6IHt9LFxuXHRcdFx0b3B0aW9ucyAgICAgICAgICA6IHt9LFxuXHRcdFx0dXNlck9wdGlvbnMgICAgICA6IHt9LFxuXHRcdFx0aXRlbXMgICAgICAgICAgICA6IFtdLFxuXHRcdFx0cmVuZGVyQ2FjaGUgICAgICA6IHt9LFxuXHRcdFx0b25TZWFyY2hDaGFuZ2UgICA6IHNldHRpbmdzLmxvYWRUaHJvdHRsZSA9PT0gbnVsbCA/IHNlbGYub25TZWFyY2hDaGFuZ2UgOiBkZWJvdW5jZShzZWxmLm9uU2VhcmNoQ2hhbmdlLCBzZXR0aW5ncy5sb2FkVGhyb3R0bGUpXG5cdFx0fSk7XG5cdFxuXHRcdC8vIHNlYXJjaCBzeXN0ZW1cblx0XHRzZWxmLnNpZnRlciA9IG5ldyBTaWZ0ZXIodGhpcy5vcHRpb25zLCB7ZGlhY3JpdGljczogc2V0dGluZ3MuZGlhY3JpdGljc30pO1xuXHRcblx0XHQvLyBidWlsZCBvcHRpb25zIHRhYmxlXG5cdFx0aWYgKHNlbGYuc2V0dGluZ3Mub3B0aW9ucykge1xuXHRcdFx0Zm9yIChpID0gMCwgbiA9IHNlbGYuc2V0dGluZ3Mub3B0aW9ucy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0c2VsZi5yZWdpc3Rlck9wdGlvbihzZWxmLnNldHRpbmdzLm9wdGlvbnNbaV0pO1xuXHRcdFx0fVxuXHRcdFx0ZGVsZXRlIHNlbGYuc2V0dGluZ3Mub3B0aW9ucztcblx0XHR9XG5cdFxuXHRcdC8vIGJ1aWxkIG9wdGdyb3VwIHRhYmxlXG5cdFx0aWYgKHNlbGYuc2V0dGluZ3Mub3B0Z3JvdXBzKSB7XG5cdFx0XHRmb3IgKGkgPSAwLCBuID0gc2VsZi5zZXR0aW5ncy5vcHRncm91cHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdHNlbGYucmVnaXN0ZXJPcHRpb25Hcm91cChzZWxmLnNldHRpbmdzLm9wdGdyb3Vwc1tpXSk7XG5cdFx0XHR9XG5cdFx0XHRkZWxldGUgc2VsZi5zZXR0aW5ncy5vcHRncm91cHM7XG5cdFx0fVxuXHRcblx0XHQvLyBvcHRpb24tZGVwZW5kZW50IGRlZmF1bHRzXG5cdFx0c2VsZi5zZXR0aW5ncy5tb2RlID0gc2VsZi5zZXR0aW5ncy5tb2RlIHx8IChzZWxmLnNldHRpbmdzLm1heEl0ZW1zID09PSAxID8gJ3NpbmdsZScgOiAnbXVsdGknKTtcblx0XHRpZiAodHlwZW9mIHNlbGYuc2V0dGluZ3MuaGlkZVNlbGVjdGVkICE9PSAnYm9vbGVhbicpIHtcblx0XHRcdHNlbGYuc2V0dGluZ3MuaGlkZVNlbGVjdGVkID0gc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnbXVsdGknO1xuXHRcdH1cblx0XG5cdFx0c2VsZi5pbml0aWFsaXplUGx1Z2lucyhzZWxmLnNldHRpbmdzLnBsdWdpbnMpO1xuXHRcdHNlbGYuc2V0dXBDYWxsYmFja3MoKTtcblx0XHRzZWxmLnNldHVwVGVtcGxhdGVzKCk7XG5cdFx0c2VsZi5zZXR1cCgpO1xuXHR9O1xuXHRcblx0Ly8gbWl4aW5zXG5cdC8vIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtXG5cdFxuXHRNaWNyb0V2ZW50Lm1peGluKFNlbGVjdGl6ZSk7XG5cdE1pY3JvUGx1Z2luLm1peGluKFNlbGVjdGl6ZSk7XG5cdFxuXHQvLyBtZXRob2RzXG5cdC8vIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtXG5cdFxuXHQkLmV4dGVuZChTZWxlY3RpemUucHJvdG90eXBlLCB7XG5cdFxuXHRcdC8qKlxuXHRcdCAqIENyZWF0ZXMgYWxsIGVsZW1lbnRzIGFuZCBzZXRzIHVwIGV2ZW50IGJpbmRpbmdzLlxuXHRcdCAqL1xuXHRcdHNldHVwOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxmICAgICAgPSB0aGlzO1xuXHRcdFx0dmFyIHNldHRpbmdzICA9IHNlbGYuc2V0dGluZ3M7XG5cdFx0XHR2YXIgZXZlbnROUyAgID0gc2VsZi5ldmVudE5TO1xuXHRcdFx0dmFyICR3aW5kb3cgICA9ICQod2luZG93KTtcblx0XHRcdHZhciAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcblx0XHRcdHZhciAkaW5wdXQgICAgPSBzZWxmLiRpbnB1dDtcblx0XG5cdFx0XHR2YXIgJHdyYXBwZXI7XG5cdFx0XHR2YXIgJGNvbnRyb2w7XG5cdFx0XHR2YXIgJGNvbnRyb2xfaW5wdXQ7XG5cdFx0XHR2YXIgJGRyb3Bkb3duO1xuXHRcdFx0dmFyICRkcm9wZG93bl9jb250ZW50O1xuXHRcdFx0dmFyICRkcm9wZG93bl9wYXJlbnQ7XG5cdFx0XHR2YXIgaW5wdXRNb2RlO1xuXHRcdFx0dmFyIHRpbWVvdXRfYmx1cjtcblx0XHRcdHZhciB0aW1lb3V0X2ZvY3VzO1xuXHRcdFx0dmFyIGNsYXNzZXM7XG5cdFx0XHR2YXIgY2xhc3Nlc19wbHVnaW5zO1xuXHRcblx0XHRcdGlucHV0TW9kZSAgICAgICAgID0gc2VsZi5zZXR0aW5ncy5tb2RlO1xuXHRcdFx0Y2xhc3NlcyAgICAgICAgICAgPSAkaW5wdXQuYXR0cignY2xhc3MnKSB8fCAnJztcblx0XG5cdFx0XHQkd3JhcHBlciAgICAgICAgICA9ICQoJzxkaXY+JykuYWRkQ2xhc3Moc2V0dGluZ3Mud3JhcHBlckNsYXNzKS5hZGRDbGFzcyhjbGFzc2VzKS5hZGRDbGFzcyhpbnB1dE1vZGUpO1xuXHRcdFx0JGNvbnRyb2wgICAgICAgICAgPSAkKCc8ZGl2PicpLmFkZENsYXNzKHNldHRpbmdzLmlucHV0Q2xhc3MpLmFkZENsYXNzKCdpdGVtcycpLmFwcGVuZFRvKCR3cmFwcGVyKTtcblx0XHRcdCRjb250cm9sX2lucHV0ICAgID0gJCgnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgLz4nKS5hcHBlbmRUbygkY29udHJvbCkuYXR0cigndGFiaW5kZXgnLCAkaW5wdXQuaXMoJzpkaXNhYmxlZCcpID8gJy0xJyA6IHNlbGYudGFiSW5kZXgpO1xuXHRcdFx0JGRyb3Bkb3duX3BhcmVudCAgPSAkKHNldHRpbmdzLmRyb3Bkb3duUGFyZW50IHx8ICR3cmFwcGVyKTtcblx0XHRcdCRkcm9wZG93biAgICAgICAgID0gJCgnPGRpdj4nKS5hZGRDbGFzcyhzZXR0aW5ncy5kcm9wZG93bkNsYXNzKS5hZGRDbGFzcyhpbnB1dE1vZGUpLmhpZGUoKS5hcHBlbmRUbygkZHJvcGRvd25fcGFyZW50KTtcblx0XHRcdCRkcm9wZG93bl9jb250ZW50ID0gJCgnPGRpdj4nKS5hZGRDbGFzcyhzZXR0aW5ncy5kcm9wZG93bkNvbnRlbnRDbGFzcykuYXBwZW5kVG8oJGRyb3Bkb3duKTtcblx0XG5cdFx0XHRpZihzZWxmLnNldHRpbmdzLmNvcHlDbGFzc2VzVG9Ecm9wZG93bikge1xuXHRcdFx0XHQkZHJvcGRvd24uYWRkQ2xhc3MoY2xhc3Nlcyk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0JHdyYXBwZXIuY3NzKHtcblx0XHRcdFx0d2lkdGg6ICRpbnB1dFswXS5zdHlsZS53aWR0aFxuXHRcdFx0fSk7XG5cdFxuXHRcdFx0aWYgKHNlbGYucGx1Z2lucy5uYW1lcy5sZW5ndGgpIHtcblx0XHRcdFx0Y2xhc3Nlc19wbHVnaW5zID0gJ3BsdWdpbi0nICsgc2VsZi5wbHVnaW5zLm5hbWVzLmpvaW4oJyBwbHVnaW4tJyk7XG5cdFx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKGNsYXNzZXNfcGx1Z2lucyk7XG5cdFx0XHRcdCRkcm9wZG93bi5hZGRDbGFzcyhjbGFzc2VzX3BsdWdpbnMpO1xuXHRcdFx0fVxuXHRcblx0XHRcdGlmICgoc2V0dGluZ3MubWF4SXRlbXMgPT09IG51bGwgfHwgc2V0dGluZ3MubWF4SXRlbXMgPiAxKSAmJiBzZWxmLnRhZ1R5cGUgPT09IFRBR19TRUxFQ1QpIHtcblx0XHRcdFx0JGlucHV0LmF0dHIoJ211bHRpcGxlJywgJ211bHRpcGxlJyk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0aWYgKHNlbGYuc2V0dGluZ3MucGxhY2Vob2xkZXIpIHtcblx0XHRcdFx0JGNvbnRyb2xfaW5wdXQuYXR0cigncGxhY2Vob2xkZXInLCBzZXR0aW5ncy5wbGFjZWhvbGRlcik7XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly8gaWYgc3BsaXRPbiB3YXMgbm90IHBhc3NlZCBpbiwgY29uc3RydWN0IGl0IGZyb20gdGhlIGRlbGltaXRlciB0byBhbGxvdyBwYXN0aW5nIHVuaXZlcnNhbGx5XG5cdFx0XHRpZiAoIXNlbGYuc2V0dGluZ3Muc3BsaXRPbiAmJiBzZWxmLnNldHRpbmdzLmRlbGltaXRlcikge1xuXHRcdFx0XHR2YXIgZGVsaW1pdGVyRXNjYXBlZCA9IHNlbGYuc2V0dGluZ3MuZGVsaW1pdGVyLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuXHRcdFx0XHRzZWxmLnNldHRpbmdzLnNwbGl0T24gPSBuZXcgUmVnRXhwKCdcXFxccyonICsgZGVsaW1pdGVyRXNjYXBlZCArICcrXFxcXHMqJyk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0aWYgKCRpbnB1dC5hdHRyKCdhdXRvY29ycmVjdCcpKSB7XG5cdFx0XHRcdCRjb250cm9sX2lucHV0LmF0dHIoJ2F1dG9jb3JyZWN0JywgJGlucHV0LmF0dHIoJ2F1dG9jb3JyZWN0JykpO1xuXHRcdFx0fVxuXHRcblx0XHRcdGlmICgkaW5wdXQuYXR0cignYXV0b2NhcGl0YWxpemUnKSkge1xuXHRcdFx0XHQkY29udHJvbF9pbnB1dC5hdHRyKCdhdXRvY2FwaXRhbGl6ZScsICRpbnB1dC5hdHRyKCdhdXRvY2FwaXRhbGl6ZScpKTtcblx0XHRcdH1cblx0XG5cdFx0XHRzZWxmLiR3cmFwcGVyICAgICAgICAgID0gJHdyYXBwZXI7XG5cdFx0XHRzZWxmLiRjb250cm9sICAgICAgICAgID0gJGNvbnRyb2w7XG5cdFx0XHRzZWxmLiRjb250cm9sX2lucHV0ICAgID0gJGNvbnRyb2xfaW5wdXQ7XG5cdFx0XHRzZWxmLiRkcm9wZG93biAgICAgICAgID0gJGRyb3Bkb3duO1xuXHRcdFx0c2VsZi4kZHJvcGRvd25fY29udGVudCA9ICRkcm9wZG93bl9jb250ZW50O1xuXHRcblx0XHRcdCRkcm9wZG93bi5vbignbW91c2VlbnRlcicsICdbZGF0YS1zZWxlY3RhYmxlXScsIGZ1bmN0aW9uKCkgeyByZXR1cm4gc2VsZi5vbk9wdGlvbkhvdmVyLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7IH0pO1xuXHRcdFx0JGRyb3Bkb3duLm9uKCdtb3VzZWRvd24gY2xpY2snLCAnW2RhdGEtc2VsZWN0YWJsZV0nLCBmdW5jdGlvbigpIHsgcmV0dXJuIHNlbGYub25PcHRpb25TZWxlY3QuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTsgfSk7XG5cdFx0XHR3YXRjaENoaWxkRXZlbnQoJGNvbnRyb2wsICdtb3VzZWRvd24nLCAnKjpub3QoaW5wdXQpJywgZnVuY3Rpb24oKSB7IHJldHVybiBzZWxmLm9uSXRlbVNlbGVjdC5hcHBseShzZWxmLCBhcmd1bWVudHMpOyB9KTtcblx0XHRcdGF1dG9Hcm93KCRjb250cm9sX2lucHV0KTtcblx0XG5cdFx0XHQkY29udHJvbC5vbih7XG5cdFx0XHRcdG1vdXNlZG93biA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gc2VsZi5vbk1vdXNlRG93bi5hcHBseShzZWxmLCBhcmd1bWVudHMpOyB9LFxuXHRcdFx0XHRjbGljayAgICAgOiBmdW5jdGlvbigpIHsgcmV0dXJuIHNlbGYub25DbGljay5hcHBseShzZWxmLCBhcmd1bWVudHMpOyB9XG5cdFx0XHR9KTtcblx0XG5cdFx0XHQkY29udHJvbF9pbnB1dC5vbih7XG5cdFx0XHRcdG1vdXNlZG93biA6IGZ1bmN0aW9uKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfSxcblx0XHRcdFx0a2V5ZG93biAgIDogZnVuY3Rpb24oKSB7IHJldHVybiBzZWxmLm9uS2V5RG93bi5hcHBseShzZWxmLCBhcmd1bWVudHMpOyB9LFxuXHRcdFx0XHRrZXl1cCAgICAgOiBmdW5jdGlvbigpIHsgcmV0dXJuIHNlbGYub25LZXlVcC5hcHBseShzZWxmLCBhcmd1bWVudHMpOyB9LFxuXHRcdFx0XHRrZXlwcmVzcyAgOiBmdW5jdGlvbigpIHsgcmV0dXJuIHNlbGYub25LZXlQcmVzcy5hcHBseShzZWxmLCBhcmd1bWVudHMpOyB9LFxuXHRcdFx0XHRyZXNpemUgICAgOiBmdW5jdGlvbigpIHsgc2VsZi5wb3NpdGlvbkRyb3Bkb3duLmFwcGx5KHNlbGYsIFtdKTsgfSxcblx0XHRcdFx0Ymx1ciAgICAgIDogZnVuY3Rpb24oKSB7IHJldHVybiBzZWxmLm9uQmx1ci5hcHBseShzZWxmLCBhcmd1bWVudHMpOyB9LFxuXHRcdFx0XHRmb2N1cyAgICAgOiBmdW5jdGlvbigpIHsgc2VsZi5pZ25vcmVCbHVyID0gZmFsc2U7IHJldHVybiBzZWxmLm9uRm9jdXMuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTsgfSxcblx0XHRcdFx0cGFzdGUgICAgIDogZnVuY3Rpb24oKSB7IHJldHVybiBzZWxmLm9uUGFzdGUuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTsgfVxuXHRcdFx0fSk7XG5cdFxuXHRcdFx0JGRvY3VtZW50Lm9uKCdrZXlkb3duJyArIGV2ZW50TlMsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0c2VsZi5pc0NtZERvd24gPSBlW0lTX01BQyA/ICdtZXRhS2V5JyA6ICdjdHJsS2V5J107XG5cdFx0XHRcdHNlbGYuaXNDdHJsRG93biA9IGVbSVNfTUFDID8gJ2FsdEtleScgOiAnY3RybEtleSddO1xuXHRcdFx0XHRzZWxmLmlzU2hpZnREb3duID0gZS5zaGlmdEtleTtcblx0XHRcdH0pO1xuXHRcblx0XHRcdCRkb2N1bWVudC5vbigna2V5dXAnICsgZXZlbnROUywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAoZS5rZXlDb2RlID09PSBLRVlfQ1RSTCkgc2VsZi5pc0N0cmxEb3duID0gZmFsc2U7XG5cdFx0XHRcdGlmIChlLmtleUNvZGUgPT09IEtFWV9TSElGVCkgc2VsZi5pc1NoaWZ0RG93biA9IGZhbHNlO1xuXHRcdFx0XHRpZiAoZS5rZXlDb2RlID09PSBLRVlfQ01EKSBzZWxmLmlzQ21kRG93biA9IGZhbHNlO1xuXHRcdFx0fSk7XG5cdFxuXHRcdFx0JGRvY3VtZW50Lm9uKCdtb3VzZWRvd24nICsgZXZlbnROUywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAoc2VsZi5pc0ZvY3VzZWQpIHtcblx0XHRcdFx0XHQvLyBwcmV2ZW50IGV2ZW50cyBvbiB0aGUgZHJvcGRvd24gc2Nyb2xsYmFyIGZyb20gY2F1c2luZyB0aGUgY29udHJvbCB0byBibHVyXG5cdFx0XHRcdFx0aWYgKGUudGFyZ2V0ID09PSBzZWxmLiRkcm9wZG93blswXSB8fCBlLnRhcmdldC5wYXJlbnROb2RlID09PSBzZWxmLiRkcm9wZG93blswXSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBibHVyIG9uIGNsaWNrIG91dHNpZGVcblx0XHRcdFx0XHRpZiAoIXNlbGYuJGNvbnRyb2wuaGFzKGUudGFyZ2V0KS5sZW5ndGggJiYgZS50YXJnZXQgIT09IHNlbGYuJGNvbnRyb2xbMF0pIHtcblx0XHRcdFx0XHRcdHNlbGYuYmx1cihlLnRhcmdldCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XG5cdFx0XHQkd2luZG93Lm9uKFsnc2Nyb2xsJyArIGV2ZW50TlMsICdyZXNpemUnICsgZXZlbnROU10uam9pbignICcpLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKHNlbGYuaXNPcGVuKSB7XG5cdFx0XHRcdFx0c2VsZi5wb3NpdGlvbkRyb3Bkb3duLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0JHdpbmRvdy5vbignbW91c2Vtb3ZlJyArIGV2ZW50TlMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWxmLmlnbm9yZUhvdmVyID0gZmFsc2U7XG5cdFx0XHR9KTtcblx0XG5cdFx0XHQvLyBzdG9yZSBvcmlnaW5hbCBjaGlsZHJlbiBhbmQgdGFiIGluZGV4IHNvIHRoYXQgdGhleSBjYW4gYmVcblx0XHRcdC8vIHJlc3RvcmVkIHdoZW4gdGhlIGRlc3Ryb3koKSBtZXRob2QgaXMgY2FsbGVkLlxuXHRcdFx0dGhpcy5yZXZlcnRTZXR0aW5ncyA9IHtcblx0XHRcdFx0JGNoaWxkcmVuIDogJGlucHV0LmNoaWxkcmVuKCkuZGV0YWNoKCksXG5cdFx0XHRcdHRhYmluZGV4ICA6ICRpbnB1dC5hdHRyKCd0YWJpbmRleCcpXG5cdFx0XHR9O1xuXHRcblx0XHRcdCRpbnB1dC5hdHRyKCd0YWJpbmRleCcsIC0xKS5oaWRlKCkuYWZ0ZXIoc2VsZi4kd3JhcHBlcik7XG5cdFxuXHRcdFx0aWYgKCQuaXNBcnJheShzZXR0aW5ncy5pdGVtcykpIHtcblx0XHRcdFx0c2VsZi5zZXRWYWx1ZShzZXR0aW5ncy5pdGVtcyk7XG5cdFx0XHRcdGRlbGV0ZSBzZXR0aW5ncy5pdGVtcztcblx0XHRcdH1cblx0XG5cdFx0XHQvLyBmZWF0dXJlIGRldGVjdCBmb3IgdGhlIHZhbGlkYXRpb24gQVBJXG5cdFx0XHRpZiAoU1VQUE9SVFNfVkFMSURJVFlfQVBJKSB7XG5cdFx0XHRcdCRpbnB1dC5vbignaW52YWxpZCcgKyBldmVudE5TLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHNlbGYuaXNJbnZhbGlkID0gdHJ1ZTtcblx0XHRcdFx0XHRzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XG5cdFx0XHRzZWxmLnVwZGF0ZU9yaWdpbmFsSW5wdXQoKTtcblx0XHRcdHNlbGYucmVmcmVzaEl0ZW1zKCk7XG5cdFx0XHRzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHRcdFx0c2VsZi51cGRhdGVQbGFjZWhvbGRlcigpO1xuXHRcdFx0c2VsZi5pc1NldHVwID0gdHJ1ZTtcblx0XG5cdFx0XHRpZiAoJGlucHV0LmlzKCc6ZGlzYWJsZWQnKSkge1xuXHRcdFx0XHRzZWxmLmRpc2FibGUoKTtcblx0XHRcdH1cblx0XG5cdFx0XHRzZWxmLm9uKCdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlKTtcblx0XG5cdFx0XHQkaW5wdXQuZGF0YSgnc2VsZWN0aXplJywgc2VsZik7XG5cdFx0XHQkaW5wdXQuYWRkQ2xhc3MoJ3NlbGVjdGl6ZWQnKTtcblx0XHRcdHNlbGYudHJpZ2dlcignaW5pdGlhbGl6ZScpO1xuXHRcblx0XHRcdC8vIHByZWxvYWQgb3B0aW9uc1xuXHRcdFx0aWYgKHNldHRpbmdzLnByZWxvYWQgPT09IHRydWUpIHtcblx0XHRcdFx0c2VsZi5vblNlYXJjaENoYW5nZSgnJyk7XG5cdFx0XHR9XG5cdFxuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFNldHMgdXAgZGVmYXVsdCByZW5kZXJpbmcgZnVuY3Rpb25zLlxuXHRcdCAqL1xuXHRcdHNldHVwVGVtcGxhdGVzOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHZhciBmaWVsZF9sYWJlbCA9IHNlbGYuc2V0dGluZ3MubGFiZWxGaWVsZDtcblx0XHRcdHZhciBmaWVsZF9vcHRncm91cCA9IHNlbGYuc2V0dGluZ3Mub3B0Z3JvdXBMYWJlbEZpZWxkO1xuXHRcblx0XHRcdHZhciB0ZW1wbGF0ZXMgPSB7XG5cdFx0XHRcdCdvcHRncm91cCc6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRyZXR1cm4gJzxkaXYgY2xhc3M9XCJvcHRncm91cFwiPicgKyBkYXRhLmh0bWwgKyAnPC9kaXY+Jztcblx0XHRcdFx0fSxcblx0XHRcdFx0J29wdGdyb3VwX2hlYWRlcic6IGZ1bmN0aW9uKGRhdGEsIGVzY2FwZSkge1xuXHRcdFx0XHRcdHJldHVybiAnPGRpdiBjbGFzcz1cIm9wdGdyb3VwLWhlYWRlclwiPicgKyBlc2NhcGUoZGF0YVtmaWVsZF9vcHRncm91cF0pICsgJzwvZGl2Pic7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdCdvcHRpb24nOiBmdW5jdGlvbihkYXRhLCBlc2NhcGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gJzxkaXYgY2xhc3M9XCJvcHRpb25cIj4nICsgZXNjYXBlKGRhdGFbZmllbGRfbGFiZWxdKSArICc8L2Rpdj4nO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQnaXRlbSc6IGZ1bmN0aW9uKGRhdGEsIGVzY2FwZSkge1xuXHRcdFx0XHRcdHJldHVybiAnPGRpdiBjbGFzcz1cIml0ZW1cIj4nICsgZXNjYXBlKGRhdGFbZmllbGRfbGFiZWxdKSArICc8L2Rpdj4nO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQnb3B0aW9uX2NyZWF0ZSc6IGZ1bmN0aW9uKGRhdGEsIGVzY2FwZSkge1xuXHRcdFx0XHRcdHJldHVybiAnPGRpdiBjbGFzcz1cImNyZWF0ZVwiPkFkZCA8c3Ryb25nPicgKyBlc2NhcGUoZGF0YS5pbnB1dCkgKyAnPC9zdHJvbmc+JmhlbGxpcDs8L2Rpdj4nO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcblx0XHRcdHNlbGYuc2V0dGluZ3MucmVuZGVyID0gJC5leHRlbmQoe30sIHRlbXBsYXRlcywgc2VsZi5zZXR0aW5ncy5yZW5kZXIpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIE1hcHMgZmlyZWQgZXZlbnRzIHRvIGNhbGxiYWNrcyBwcm92aWRlZFxuXHRcdCAqIGluIHRoZSBzZXR0aW5ncyB1c2VkIHdoZW4gY3JlYXRpbmcgdGhlIGNvbnRyb2wuXG5cdFx0ICovXG5cdFx0c2V0dXBDYWxsYmFja3M6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGtleSwgZm4sIGNhbGxiYWNrcyA9IHtcblx0XHRcdFx0J2luaXRpYWxpemUnICAgICAgOiAnb25Jbml0aWFsaXplJyxcblx0XHRcdFx0J2NoYW5nZScgICAgICAgICAgOiAnb25DaGFuZ2UnLFxuXHRcdFx0XHQnaXRlbV9hZGQnICAgICAgICA6ICdvbkl0ZW1BZGQnLFxuXHRcdFx0XHQnaXRlbV9yZW1vdmUnICAgICA6ICdvbkl0ZW1SZW1vdmUnLFxuXHRcdFx0XHQnY2xlYXInICAgICAgICAgICA6ICdvbkNsZWFyJyxcblx0XHRcdFx0J29wdGlvbl9hZGQnICAgICAgOiAnb25PcHRpb25BZGQnLFxuXHRcdFx0XHQnb3B0aW9uX3JlbW92ZScgICA6ICdvbk9wdGlvblJlbW92ZScsXG5cdFx0XHRcdCdvcHRpb25fY2xlYXInICAgIDogJ29uT3B0aW9uQ2xlYXInLFxuXHRcdFx0XHQnb3B0Z3JvdXBfYWRkJyAgICA6ICdvbk9wdGlvbkdyb3VwQWRkJyxcblx0XHRcdFx0J29wdGdyb3VwX3JlbW92ZScgOiAnb25PcHRpb25Hcm91cFJlbW92ZScsXG5cdFx0XHRcdCdvcHRncm91cF9jbGVhcicgIDogJ29uT3B0aW9uR3JvdXBDbGVhcicsXG5cdFx0XHRcdCdkcm9wZG93bl9vcGVuJyAgIDogJ29uRHJvcGRvd25PcGVuJyxcblx0XHRcdFx0J2Ryb3Bkb3duX2Nsb3NlJyAgOiAnb25Ecm9wZG93bkNsb3NlJyxcblx0XHRcdFx0J3R5cGUnICAgICAgICAgICAgOiAnb25UeXBlJyxcblx0XHRcdFx0J2xvYWQnICAgICAgICAgICAgOiAnb25Mb2FkJyxcblx0XHRcdFx0J2ZvY3VzJyAgICAgICAgICAgOiAnb25Gb2N1cycsXG5cdFx0XHRcdCdibHVyJyAgICAgICAgICAgIDogJ29uQmx1cidcblx0XHRcdH07XG5cdFxuXHRcdFx0Zm9yIChrZXkgaW4gY2FsbGJhY2tzKSB7XG5cdFx0XHRcdGlmIChjYWxsYmFja3MuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0XHRcdGZuID0gdGhpcy5zZXR0aW5nc1tjYWxsYmFja3Nba2V5XV07XG5cdFx0XHRcdFx0aWYgKGZuKSB0aGlzLm9uKGtleSwgZm4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogVHJpZ2dlcmVkIHdoZW4gdGhlIG1haW4gY29udHJvbCBlbGVtZW50XG5cdFx0ICogaGFzIGEgY2xpY2sgZXZlbnQuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gZVxuXHRcdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0b25DbGljazogZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0XHRcdC8vIG5lY2Vzc2FyeSBmb3IgbW9iaWxlIHdlYmtpdCBkZXZpY2VzIChtYW51YWwgZm9jdXMgdHJpZ2dlcmluZ1xuXHRcdFx0Ly8gaXMgaWdub3JlZCB1bmxlc3MgaW52b2tlZCB3aXRoaW4gYSBjbGljayBldmVudClcblx0XHRcdGlmICghc2VsZi5pc0ZvY3VzZWQpIHtcblx0XHRcdFx0c2VsZi5mb2N1cygpO1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogVHJpZ2dlcmVkIHdoZW4gdGhlIG1haW4gY29udHJvbCBlbGVtZW50XG5cdFx0ICogaGFzIGEgbW91c2UgZG93biBldmVudC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBlXG5cdFx0ICogQHJldHVybiB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRvbk1vdXNlRG93bjogZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyIGRlZmF1bHRQcmV2ZW50ZWQgPSBlLmlzRGVmYXVsdFByZXZlbnRlZCgpO1xuXHRcdFx0dmFyICR0YXJnZXQgPSAkKGUudGFyZ2V0KTtcblx0XG5cdFx0XHRpZiAoc2VsZi5pc0ZvY3VzZWQpIHtcblx0XHRcdFx0Ly8gcmV0YWluIGZvY3VzIGJ5IHByZXZlbnRpbmcgbmF0aXZlIGhhbmRsaW5nLiBpZiB0aGVcblx0XHRcdFx0Ly8gZXZlbnQgdGFyZ2V0IGlzIHRoZSBpbnB1dCBpdCBzaG91bGQgbm90IGJlIG1vZGlmaWVkLlxuXHRcdFx0XHQvLyBvdGhlcndpc2UsIHRleHQgc2VsZWN0aW9uIHdpdGhpbiB0aGUgaW5wdXQgd29uJ3Qgd29yay5cblx0XHRcdFx0aWYgKGUudGFyZ2V0ICE9PSBzZWxmLiRjb250cm9sX2lucHV0WzBdKSB7XG5cdFx0XHRcdFx0aWYgKHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScpIHtcblx0XHRcdFx0XHRcdC8vIHRvZ2dsZSBkcm9wZG93blxuXHRcdFx0XHRcdFx0c2VsZi5pc09wZW4gPyBzZWxmLmNsb3NlKCkgOiBzZWxmLm9wZW4oKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCFkZWZhdWx0UHJldmVudGVkKSB7XG5cdFx0XHRcdFx0XHRzZWxmLnNldEFjdGl2ZUl0ZW0obnVsbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gZ2l2ZSBjb250cm9sIGZvY3VzXG5cdFx0XHRcdGlmICghZGVmYXVsdFByZXZlbnRlZCkge1xuXHRcdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0c2VsZi5mb2N1cygpO1xuXHRcdFx0XHRcdH0sIDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogVHJpZ2dlcmVkIHdoZW4gdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sIGhhcyBiZWVuIGNoYW5nZWQuXG5cdFx0ICogVGhpcyBzaG91bGQgcHJvcGFnYXRlIHRoZSBldmVudCB0byB0aGUgb3JpZ2luYWwgRE9NXG5cdFx0ICogaW5wdXQgLyBzZWxlY3QgZWxlbWVudC5cblx0XHQgKi9cblx0XHRvbkNoYW5nZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLiRpbnB1dC50cmlnZ2VyKCdjaGFuZ2UnKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBUcmlnZ2VyZWQgb24gPGlucHV0PiBwYXN0ZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBlXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0b25QYXN0ZTogZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0aWYgKHNlbGYuaXNGdWxsKCkgfHwgc2VsZi5pc0lucHV0SGlkZGVuIHx8IHNlbGYuaXNMb2NrZWQpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gSWYgYSByZWdleCBvciBzdHJpbmcgaXMgaW5jbHVkZWQsIHRoaXMgd2lsbCBzcGxpdCB0aGUgcGFzdGVkXG5cdFx0XHRcdC8vIGlucHV0IGFuZCBjcmVhdGUgSXRlbXMgZm9yIGVhY2ggc2VwYXJhdGUgdmFsdWVcblx0XHRcdFx0aWYgKHNlbGYuc2V0dGluZ3Muc3BsaXRPbikge1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIgc3BsaXRJbnB1dCA9ICQudHJpbShzZWxmLiRjb250cm9sX2lucHV0LnZhbCgpIHx8ICcnKS5zcGxpdChzZWxmLnNldHRpbmdzLnNwbGl0T24pO1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIG4gPSBzcGxpdElucHV0Lmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRcdFx0XHRzZWxmLmNyZWF0ZUl0ZW0oc3BsaXRJbnB1dFtpXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBUcmlnZ2VyZWQgb24gPGlucHV0PiBrZXlwcmVzcy5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBlXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0b25LZXlQcmVzczogZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYgKHRoaXMuaXNMb2NrZWQpIHJldHVybiBlICYmIGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHZhciBjaGFyYWN0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUua2V5Q29kZSB8fCBlLndoaWNoKTtcblx0XHRcdGlmICh0aGlzLnNldHRpbmdzLmNyZWF0ZSAmJiB0aGlzLnNldHRpbmdzLm1vZGUgPT09ICdtdWx0aScgJiYgY2hhcmFjdGVyID09PSB0aGlzLnNldHRpbmdzLmRlbGltaXRlcikge1xuXHRcdFx0XHR0aGlzLmNyZWF0ZUl0ZW0oKTtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogVHJpZ2dlcmVkIG9uIDxpbnB1dD4ga2V5ZG93bi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBlXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0b25LZXlEb3duOiBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgaXNJbnB1dCA9IGUudGFyZ2V0ID09PSB0aGlzLiRjb250cm9sX2lucHV0WzBdO1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0XHRcdGlmIChzZWxmLmlzTG9ja2VkKSB7XG5cdFx0XHRcdGlmIChlLmtleUNvZGUgIT09IEtFWV9UQUIpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcblx0XHRcdHN3aXRjaCAoZS5rZXlDb2RlKSB7XG5cdFx0XHRcdGNhc2UgS0VZX0E6XG5cdFx0XHRcdFx0aWYgKHNlbGYuaXNDbWREb3duKSB7XG5cdFx0XHRcdFx0XHRzZWxmLnNlbGVjdEFsbCgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBLRVlfRVNDOlxuXHRcdFx0XHRcdGlmIChzZWxmLmlzT3Blbikge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdHNlbGYuY2xvc2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRjYXNlIEtFWV9OOlxuXHRcdFx0XHRcdGlmICghZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSBicmVhaztcblx0XHRcdFx0Y2FzZSBLRVlfRE9XTjpcblx0XHRcdFx0XHRpZiAoIXNlbGYuaXNPcGVuICYmIHNlbGYuaGFzT3B0aW9ucykge1xuXHRcdFx0XHRcdFx0c2VsZi5vcGVuKCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChzZWxmLiRhY3RpdmVPcHRpb24pIHtcblx0XHRcdFx0XHRcdHNlbGYuaWdub3JlSG92ZXIgPSB0cnVlO1xuXHRcdFx0XHRcdFx0dmFyICRuZXh0ID0gc2VsZi5nZXRBZGphY2VudE9wdGlvbihzZWxmLiRhY3RpdmVPcHRpb24sIDEpO1xuXHRcdFx0XHRcdFx0aWYgKCRuZXh0Lmxlbmd0aCkgc2VsZi5zZXRBY3RpdmVPcHRpb24oJG5leHQsIHRydWUsIHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRjYXNlIEtFWV9QOlxuXHRcdFx0XHRcdGlmICghZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSBicmVhaztcblx0XHRcdFx0Y2FzZSBLRVlfVVA6XG5cdFx0XHRcdFx0aWYgKHNlbGYuJGFjdGl2ZU9wdGlvbikge1xuXHRcdFx0XHRcdFx0c2VsZi5pZ25vcmVIb3ZlciA9IHRydWU7XG5cdFx0XHRcdFx0XHR2YXIgJHByZXYgPSBzZWxmLmdldEFkamFjZW50T3B0aW9uKHNlbGYuJGFjdGl2ZU9wdGlvbiwgLTEpO1xuXHRcdFx0XHRcdFx0aWYgKCRwcmV2Lmxlbmd0aCkgc2VsZi5zZXRBY3RpdmVPcHRpb24oJHByZXYsIHRydWUsIHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRjYXNlIEtFWV9SRVRVUk46XG5cdFx0XHRcdFx0aWYgKHNlbGYuaXNPcGVuICYmIHNlbGYuJGFjdGl2ZU9wdGlvbikge1xuXHRcdFx0XHRcdFx0c2VsZi5vbk9wdGlvblNlbGVjdCh7Y3VycmVudFRhcmdldDogc2VsZi4kYWN0aXZlT3B0aW9ufSk7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0Y2FzZSBLRVlfTEVGVDpcblx0XHRcdFx0XHRzZWxmLmFkdmFuY2VTZWxlY3Rpb24oLTEsIGUpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0Y2FzZSBLRVlfUklHSFQ6XG5cdFx0XHRcdFx0c2VsZi5hZHZhbmNlU2VsZWN0aW9uKDEsIGUpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0Y2FzZSBLRVlfVEFCOlxuXHRcdFx0XHRcdGlmIChzZWxmLnNldHRpbmdzLnNlbGVjdE9uVGFiICYmIHNlbGYuaXNPcGVuICYmIHNlbGYuJGFjdGl2ZU9wdGlvbikge1xuXHRcdFx0XHRcdFx0c2VsZi5vbk9wdGlvblNlbGVjdCh7Y3VycmVudFRhcmdldDogc2VsZi4kYWN0aXZlT3B0aW9ufSk7XG5cdFxuXHRcdFx0XHRcdFx0Ly8gRGVmYXVsdCBiZWhhdmlvdXIgaXMgdG8ganVtcCB0byB0aGUgbmV4dCBmaWVsZCwgd2Ugb25seSB3YW50IHRoaXNcblx0XHRcdFx0XHRcdC8vIGlmIHRoZSBjdXJyZW50IGZpZWxkIGRvZXNuJ3QgYWNjZXB0IGFueSBtb3JlIGVudHJpZXNcblx0XHRcdFx0XHRcdGlmICghc2VsZi5pc0Z1bGwoKSkge1xuXHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChzZWxmLnNldHRpbmdzLmNyZWF0ZSAmJiBzZWxmLmNyZWF0ZUl0ZW0oKSkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdGNhc2UgS0VZX0JBQ0tTUEFDRTpcblx0XHRcdFx0Y2FzZSBLRVlfREVMRVRFOlxuXHRcdFx0XHRcdHNlbGYuZGVsZXRlU2VsZWN0aW9uKGUpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XG5cdFx0XHRpZiAoKHNlbGYuaXNGdWxsKCkgfHwgc2VsZi5pc0lucHV0SGlkZGVuKSAmJiAhKElTX01BQyA/IGUubWV0YUtleSA6IGUuY3RybEtleSkpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogVHJpZ2dlcmVkIG9uIDxpbnB1dD4ga2V5dXAuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gZVxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdG9uS2V5VXA6IGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XG5cdFx0XHRpZiAoc2VsZi5pc0xvY2tlZCkgcmV0dXJuIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyIHZhbHVlID0gc2VsZi4kY29udHJvbF9pbnB1dC52YWwoKSB8fCAnJztcblx0XHRcdGlmIChzZWxmLmxhc3RWYWx1ZSAhPT0gdmFsdWUpIHtcblx0XHRcdFx0c2VsZi5sYXN0VmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0c2VsZi5vblNlYXJjaENoYW5nZSh2YWx1ZSk7XG5cdFx0XHRcdHNlbGYucmVmcmVzaE9wdGlvbnMoKTtcblx0XHRcdFx0c2VsZi50cmlnZ2VyKCd0eXBlJywgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIEludm9rZXMgdGhlIHVzZXItcHJvdmlkZSBvcHRpb24gcHJvdmlkZXIgLyBsb2FkZXIuXG5cdFx0ICpcblx0XHQgKiBOb3RlOiB0aGlzIGZ1bmN0aW9uIGlzIGRlYm91bmNlZCBpbiB0aGUgU2VsZWN0aXplXG5cdFx0ICogY29uc3RydWN0b3IgKGJ5IGBzZXR0aW5ncy5sb2FkRGVsYXlgIG1pbGxpc2Vjb25kcylcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuXHRcdCAqL1xuXHRcdG9uU2VhcmNoQ2hhbmdlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyIGZuID0gc2VsZi5zZXR0aW5ncy5sb2FkO1xuXHRcdFx0aWYgKCFmbikgcmV0dXJuO1xuXHRcdFx0aWYgKHNlbGYubG9hZGVkU2VhcmNoZXMuaGFzT3duUHJvcGVydHkodmFsdWUpKSByZXR1cm47XG5cdFx0XHRzZWxmLmxvYWRlZFNlYXJjaGVzW3ZhbHVlXSA9IHRydWU7XG5cdFx0XHRzZWxmLmxvYWQoZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHRcdFx0Zm4uYXBwbHkoc2VsZiwgW3ZhbHVlLCBjYWxsYmFja10pO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogVHJpZ2dlcmVkIG9uIDxpbnB1dD4gZm9jdXMuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gZSAob3B0aW9uYWwpXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0b25Gb2N1czogZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyIHdhc0ZvY3VzZWQgPSBzZWxmLmlzRm9jdXNlZDtcblx0XG5cdFx0XHRpZiAoc2VsZi5pc0Rpc2FibGVkKSB7XG5cdFx0XHRcdHNlbGYuYmx1cigpO1xuXHRcdFx0XHRlICYmIGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcblx0XHRcdGlmIChzZWxmLmlnbm9yZUZvY3VzKSByZXR1cm47XG5cdFx0XHRzZWxmLmlzRm9jdXNlZCA9IHRydWU7XG5cdFx0XHRpZiAoc2VsZi5zZXR0aW5ncy5wcmVsb2FkID09PSAnZm9jdXMnKSBzZWxmLm9uU2VhcmNoQ2hhbmdlKCcnKTtcblx0XG5cdFx0XHRpZiAoIXdhc0ZvY3VzZWQpIHNlbGYudHJpZ2dlcignZm9jdXMnKTtcblx0XG5cdFx0XHRpZiAoIXNlbGYuJGFjdGl2ZUl0ZW1zLmxlbmd0aCkge1xuXHRcdFx0XHRzZWxmLnNob3dJbnB1dCgpO1xuXHRcdFx0XHRzZWxmLnNldEFjdGl2ZUl0ZW0obnVsbCk7XG5cdFx0XHRcdHNlbGYucmVmcmVzaE9wdGlvbnMoISFzZWxmLnNldHRpbmdzLm9wZW5PbkZvY3VzKTtcblx0XHRcdH1cblx0XG5cdFx0XHRzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFRyaWdnZXJlZCBvbiA8aW5wdXQ+IGJsdXIuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gZVxuXHRcdCAqIEBwYXJhbSB7RWxlbWVudH0gZGVzdFxuXHRcdCAqL1xuXHRcdG9uQmx1cjogZnVuY3Rpb24oZSwgZGVzdCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0aWYgKCFzZWxmLmlzRm9jdXNlZCkgcmV0dXJuO1xuXHRcdFx0c2VsZi5pc0ZvY3VzZWQgPSBmYWxzZTtcblx0XG5cdFx0XHRpZiAoc2VsZi5pZ25vcmVGb2N1cykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2UgaWYgKCFzZWxmLmlnbm9yZUJsdXIgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gc2VsZi4kZHJvcGRvd25fY29udGVudFswXSkge1xuXHRcdFx0XHQvLyBuZWNlc3NhcnkgdG8gcHJldmVudCBJRSBjbG9zaW5nIHRoZSBkcm9wZG93biB3aGVuIHRoZSBzY3JvbGxiYXIgaXMgY2xpY2tlZFxuXHRcdFx0XHRzZWxmLmlnbm9yZUJsdXIgPSB0cnVlO1xuXHRcdFx0XHRzZWxmLm9uRm9jdXMoZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XG5cdFx0XHR2YXIgZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWxmLmNsb3NlKCk7XG5cdFx0XHRcdHNlbGYuc2V0VGV4dGJveFZhbHVlKCcnKTtcblx0XHRcdFx0c2VsZi5zZXRBY3RpdmVJdGVtKG51bGwpO1xuXHRcdFx0XHRzZWxmLnNldEFjdGl2ZU9wdGlvbihudWxsKTtcblx0XHRcdFx0c2VsZi5zZXRDYXJldChzZWxmLml0ZW1zLmxlbmd0aCk7XG5cdFx0XHRcdHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdFxuXHRcdFx0XHQvLyBJRTExIGJ1ZzogZWxlbWVudCBzdGlsbCBtYXJrZWQgYXMgYWN0aXZlXG5cdFx0XHRcdC8vKGRlc3QgfHwgZG9jdW1lbnQuYm9keSkuZm9jdXMoKTtcblx0XHRcdFx0ZGVzdCAmJiBkZXN0LmZvY3VzKCk7XG5cdFxuXHRcdFx0XHRzZWxmLmlnbm9yZUZvY3VzID0gZmFsc2U7XG5cdFx0XHRcdHNlbGYudHJpZ2dlcignYmx1cicpO1xuXHRcdFx0fTtcblx0XG5cdFx0XHRzZWxmLmlnbm9yZUZvY3VzID0gdHJ1ZTtcblx0XHRcdGlmIChzZWxmLnNldHRpbmdzLmNyZWF0ZSAmJiBzZWxmLnNldHRpbmdzLmNyZWF0ZU9uQmx1cikge1xuXHRcdFx0XHRzZWxmLmNyZWF0ZUl0ZW0obnVsbCwgZmFsc2UsIGRlYWN0aXZhdGUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVhY3RpdmF0ZSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFRyaWdnZXJlZCB3aGVuIHRoZSB1c2VyIHJvbGxzIG92ZXJcblx0XHQgKiBhbiBvcHRpb24gaW4gdGhlIGF1dG9jb21wbGV0ZSBkcm9wZG93biBtZW51LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IGVcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRvbk9wdGlvbkhvdmVyOiBmdW5jdGlvbihlKSB7XG5cdFx0XHRpZiAodGhpcy5pZ25vcmVIb3ZlcikgcmV0dXJuO1xuXHRcdFx0dGhpcy5zZXRBY3RpdmVPcHRpb24oZS5jdXJyZW50VGFyZ2V0LCBmYWxzZSk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogVHJpZ2dlcmVkIHdoZW4gdGhlIHVzZXIgY2xpY2tzIG9uIGFuIG9wdGlvblxuXHRcdCAqIGluIHRoZSBhdXRvY29tcGxldGUgZHJvcGRvd24gbWVudS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBlXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0b25PcHRpb25TZWxlY3Q6IGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciB2YWx1ZSwgJHRhcmdldCwgJG9wdGlvbiwgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdFx0aWYgKGUucHJldmVudERlZmF1bHQpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0fVxuXHRcblx0XHRcdCR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG5cdFx0XHRpZiAoJHRhcmdldC5oYXNDbGFzcygnY3JlYXRlJykpIHtcblx0XHRcdFx0c2VsZi5jcmVhdGVJdGVtKG51bGwsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmIChzZWxmLnNldHRpbmdzLmNsb3NlQWZ0ZXJTZWxlY3QpIHtcblx0XHRcdFx0XHRcdHNlbGYuY2xvc2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFsdWUgPSAkdGFyZ2V0LmF0dHIoJ2RhdGEtdmFsdWUnKTtcblx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRzZWxmLmxhc3RRdWVyeSA9IG51bGw7XG5cdFx0XHRcdFx0c2VsZi5zZXRUZXh0Ym94VmFsdWUoJycpO1xuXHRcdFx0XHRcdHNlbGYuYWRkSXRlbSh2YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKHNlbGYuc2V0dGluZ3MuY2xvc2VBZnRlclNlbGVjdCkge1xuXHRcdFx0XHRcdFx0c2VsZi5jbG9zZSgpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIXNlbGYuc2V0dGluZ3MuaGlkZVNlbGVjdGVkICYmIGUudHlwZSAmJiAvbW91c2UvLnRlc3QoZS50eXBlKSkge1xuXHRcdFx0XHRcdFx0c2VsZi5zZXRBY3RpdmVPcHRpb24oc2VsZi5nZXRPcHRpb24odmFsdWUpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBUcmlnZ2VyZWQgd2hlbiB0aGUgdXNlciBjbGlja3Mgb24gYW4gaXRlbVxuXHRcdCAqIHRoYXQgaGFzIGJlZW4gc2VsZWN0ZWQuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gZVxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdG9uSXRlbVNlbGVjdDogZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0XHRcdGlmIChzZWxmLmlzTG9ja2VkKSByZXR1cm47XG5cdFx0XHRpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnbXVsdGknKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0c2VsZi5zZXRBY3RpdmVJdGVtKGUuY3VycmVudFRhcmdldCwgZSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogSW52b2tlcyB0aGUgcHJvdmlkZWQgbWV0aG9kIHRoYXQgcHJvdmlkZXNcblx0XHQgKiByZXN1bHRzIHRvIGEgY2FsbGJhY2stLS13aGljaCBhcmUgdGhlbiBhZGRlZFxuXHRcdCAqIGFzIG9wdGlvbnMgdG8gdGhlIGNvbnRyb2wuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmblxuXHRcdCAqL1xuXHRcdGxvYWQ6IGZ1bmN0aW9uKGZuKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHR2YXIgJHdyYXBwZXIgPSBzZWxmLiR3cmFwcGVyLmFkZENsYXNzKHNlbGYuc2V0dGluZ3MubG9hZGluZ0NsYXNzKTtcblx0XG5cdFx0XHRzZWxmLmxvYWRpbmcrKztcblx0XHRcdGZuLmFwcGx5KHNlbGYsIFtmdW5jdGlvbihyZXN1bHRzKSB7XG5cdFx0XHRcdHNlbGYubG9hZGluZyA9IE1hdGgubWF4KHNlbGYubG9hZGluZyAtIDEsIDApO1xuXHRcdFx0XHRpZiAocmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHNlbGYuYWRkT3B0aW9uKHJlc3VsdHMpO1xuXHRcdFx0XHRcdHNlbGYucmVmcmVzaE9wdGlvbnMoc2VsZi5pc0ZvY3VzZWQgJiYgIXNlbGYuaXNJbnB1dEhpZGRlbik7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFzZWxmLmxvYWRpbmcpIHtcblx0XHRcdFx0XHQkd3JhcHBlci5yZW1vdmVDbGFzcyhzZWxmLnNldHRpbmdzLmxvYWRpbmdDbGFzcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2VsZi50cmlnZ2VyKCdsb2FkJywgcmVzdWx0cyk7XG5cdFx0XHR9XSk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogU2V0cyB0aGUgaW5wdXQgZmllbGQgb2YgdGhlIGNvbnRyb2wgdG8gdGhlIHNwZWNpZmllZCB2YWx1ZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuXHRcdCAqL1xuXHRcdHNldFRleHRib3hWYWx1ZTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHZhciAkaW5wdXQgPSB0aGlzLiRjb250cm9sX2lucHV0O1xuXHRcdFx0dmFyIGNoYW5nZWQgPSAkaW5wdXQudmFsKCkgIT09IHZhbHVlO1xuXHRcdFx0aWYgKGNoYW5nZWQpIHtcblx0XHRcdFx0JGlucHV0LnZhbCh2YWx1ZSkudHJpZ2dlckhhbmRsZXIoJ3VwZGF0ZScpO1xuXHRcdFx0XHR0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sLiBJZiBtdWx0aXBsZSBpdGVtc1xuXHRcdCAqIGNhbiBiZSBzZWxlY3RlZCAoZS5nLiA8c2VsZWN0IG11bHRpcGxlPiksIHRoaXMgcmV0dXJuc1xuXHRcdCAqIGFuIGFycmF5LiBJZiBvbmx5IG9uZSBpdGVtIGNhbiBiZSBzZWxlY3RlZCwgdGhpc1xuXHRcdCAqIHJldHVybnMgYSBzdHJpbmcuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7bWl4ZWR9XG5cdFx0ICovXG5cdFx0Z2V0VmFsdWU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHRoaXMudGFnVHlwZSA9PT0gVEFHX1NFTEVDVCAmJiB0aGlzLiRpbnB1dC5hdHRyKCdtdWx0aXBsZScpKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLml0ZW1zO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaXRlbXMuam9pbih0aGlzLnNldHRpbmdzLmRlbGltaXRlcik7XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogUmVzZXRzIHRoZSBzZWxlY3RlZCBpdGVtcyB0byB0aGUgZ2l2ZW4gdmFsdWUuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge21peGVkfSB2YWx1ZVxuXHRcdCAqL1xuXHRcdHNldFZhbHVlOiBmdW5jdGlvbih2YWx1ZSwgc2lsZW50KSB7XG5cdFx0XHR2YXIgZXZlbnRzID0gc2lsZW50ID8gW10gOiBbJ2NoYW5nZSddO1xuXHRcblx0XHRcdGRlYm91bmNlX2V2ZW50cyh0aGlzLCBldmVudHMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLmNsZWFyKHNpbGVudCk7XG5cdFx0XHRcdHRoaXMuYWRkSXRlbXModmFsdWUsIHNpbGVudCk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBTZXRzIHRoZSBzZWxlY3RlZCBpdGVtLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9ICRpdGVtXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IGUgKG9wdGlvbmFsKVxuXHRcdCAqL1xuXHRcdHNldEFjdGl2ZUl0ZW06IGZ1bmN0aW9uKCRpdGVtLCBlKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHR2YXIgZXZlbnROYW1lO1xuXHRcdFx0dmFyIGksIGlkeCwgYmVnaW4sIGVuZCwgaXRlbSwgc3dhcDtcblx0XHRcdHZhciAkbGFzdDtcblx0XG5cdFx0XHRpZiAoc2VsZi5zZXR0aW5ncy5tb2RlID09PSAnc2luZ2xlJykgcmV0dXJuO1xuXHRcdFx0JGl0ZW0gPSAkKCRpdGVtKTtcblx0XG5cdFx0XHQvLyBjbGVhciB0aGUgYWN0aXZlIHNlbGVjdGlvblxuXHRcdFx0aWYgKCEkaXRlbS5sZW5ndGgpIHtcblx0XHRcdFx0JChzZWxmLiRhY3RpdmVJdGVtcykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHRzZWxmLiRhY3RpdmVJdGVtcyA9IFtdO1xuXHRcdFx0XHRpZiAoc2VsZi5pc0ZvY3VzZWQpIHtcblx0XHRcdFx0XHRzZWxmLnNob3dJbnB1dCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XG5cdFx0XHQvLyBtb2RpZnkgc2VsZWN0aW9uXG5cdFx0XHRldmVudE5hbWUgPSBlICYmIGUudHlwZS50b0xvd2VyQ2FzZSgpO1xuXHRcblx0XHRcdGlmIChldmVudE5hbWUgPT09ICdtb3VzZWRvd24nICYmIHNlbGYuaXNTaGlmdERvd24gJiYgc2VsZi4kYWN0aXZlSXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdCRsYXN0ID0gc2VsZi4kY29udHJvbC5jaGlsZHJlbignLmFjdGl2ZTpsYXN0Jyk7XG5cdFx0XHRcdGJlZ2luID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuYXBwbHkoc2VsZi4kY29udHJvbFswXS5jaGlsZE5vZGVzLCBbJGxhc3RbMF1dKTtcblx0XHRcdFx0ZW5kICAgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5hcHBseShzZWxmLiRjb250cm9sWzBdLmNoaWxkTm9kZXMsIFskaXRlbVswXV0pO1xuXHRcdFx0XHRpZiAoYmVnaW4gPiBlbmQpIHtcblx0XHRcdFx0XHRzd2FwICA9IGJlZ2luO1xuXHRcdFx0XHRcdGJlZ2luID0gZW5kO1xuXHRcdFx0XHRcdGVuZCAgID0gc3dhcDtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKGkgPSBiZWdpbjsgaSA8PSBlbmQ7IGkrKykge1xuXHRcdFx0XHRcdGl0ZW0gPSBzZWxmLiRjb250cm9sWzBdLmNoaWxkTm9kZXNbaV07XG5cdFx0XHRcdFx0aWYgKHNlbGYuJGFjdGl2ZUl0ZW1zLmluZGV4T2YoaXRlbSkgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHQkKGl0ZW0pLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdFx0XHRcdHNlbGYuJGFjdGl2ZUl0ZW1zLnB1c2goaXRlbSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gZWxzZSBpZiAoKGV2ZW50TmFtZSA9PT0gJ21vdXNlZG93bicgJiYgc2VsZi5pc0N0cmxEb3duKSB8fCAoZXZlbnROYW1lID09PSAna2V5ZG93bicgJiYgdGhpcy5pc1NoaWZ0RG93bikpIHtcblx0XHRcdFx0aWYgKCRpdGVtLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuXHRcdFx0XHRcdGlkeCA9IHNlbGYuJGFjdGl2ZUl0ZW1zLmluZGV4T2YoJGl0ZW1bMF0pO1xuXHRcdFx0XHRcdHNlbGYuJGFjdGl2ZUl0ZW1zLnNwbGljZShpZHgsIDEpO1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWxmLiRhY3RpdmVJdGVtcy5wdXNoKCRpdGVtLmFkZENsYXNzKCdhY3RpdmUnKVswXSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoc2VsZi4kYWN0aXZlSXRlbXMpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdFx0c2VsZi4kYWN0aXZlSXRlbXMgPSBbJGl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpWzBdXTtcblx0XHRcdH1cblx0XG5cdFx0XHQvLyBlbnN1cmUgY29udHJvbCBoYXMgZm9jdXNcblx0XHRcdHNlbGYuaGlkZUlucHV0KCk7XG5cdFx0XHRpZiAoIXRoaXMuaXNGb2N1c2VkKSB7XG5cdFx0XHRcdHNlbGYuZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBTZXRzIHRoZSBzZWxlY3RlZCBpdGVtIGluIHRoZSBkcm9wZG93biBtZW51XG5cdFx0ICogb2YgYXZhaWxhYmxlIG9wdGlvbnMuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gJG9iamVjdFxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gc2Nyb2xsXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSBhbmltYXRlXG5cdFx0ICovXG5cdFx0c2V0QWN0aXZlT3B0aW9uOiBmdW5jdGlvbigkb3B0aW9uLCBzY3JvbGwsIGFuaW1hdGUpIHtcblx0XHRcdHZhciBoZWlnaHRfbWVudSwgaGVpZ2h0X2l0ZW0sIHk7XG5cdFx0XHR2YXIgc2Nyb2xsX3RvcCwgc2Nyb2xsX2JvdHRvbTtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XG5cdFx0XHRpZiAoc2VsZi4kYWN0aXZlT3B0aW9uKSBzZWxmLiRhY3RpdmVPcHRpb24ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0c2VsZi4kYWN0aXZlT3B0aW9uID0gbnVsbDtcblx0XG5cdFx0XHQkb3B0aW9uID0gJCgkb3B0aW9uKTtcblx0XHRcdGlmICghJG9wdGlvbi5sZW5ndGgpIHJldHVybjtcblx0XG5cdFx0XHRzZWxmLiRhY3RpdmVPcHRpb24gPSAkb3B0aW9uLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XG5cdFx0XHRpZiAoc2Nyb2xsIHx8ICFpc3NldChzY3JvbGwpKSB7XG5cdFxuXHRcdFx0XHRoZWlnaHRfbWVudSAgID0gc2VsZi4kZHJvcGRvd25fY29udGVudC5oZWlnaHQoKTtcblx0XHRcdFx0aGVpZ2h0X2l0ZW0gICA9IHNlbGYuJGFjdGl2ZU9wdGlvbi5vdXRlckhlaWdodCh0cnVlKTtcblx0XHRcdFx0c2Nyb2xsICAgICAgICA9IHNlbGYuJGRyb3Bkb3duX2NvbnRlbnQuc2Nyb2xsVG9wKCkgfHwgMDtcblx0XHRcdFx0eSAgICAgICAgICAgICA9IHNlbGYuJGFjdGl2ZU9wdGlvbi5vZmZzZXQoKS50b3AgLSBzZWxmLiRkcm9wZG93bl9jb250ZW50Lm9mZnNldCgpLnRvcCArIHNjcm9sbDtcblx0XHRcdFx0c2Nyb2xsX3RvcCAgICA9IHk7XG5cdFx0XHRcdHNjcm9sbF9ib3R0b20gPSB5IC0gaGVpZ2h0X21lbnUgKyBoZWlnaHRfaXRlbTtcblx0XG5cdFx0XHRcdGlmICh5ICsgaGVpZ2h0X2l0ZW0gPiBoZWlnaHRfbWVudSArIHNjcm9sbCkge1xuXHRcdFx0XHRcdHNlbGYuJGRyb3Bkb3duX2NvbnRlbnQuc3RvcCgpLmFuaW1hdGUoe3Njcm9sbFRvcDogc2Nyb2xsX2JvdHRvbX0sIGFuaW1hdGUgPyBzZWxmLnNldHRpbmdzLnNjcm9sbER1cmF0aW9uIDogMCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoeSA8IHNjcm9sbCkge1xuXHRcdFx0XHRcdHNlbGYuJGRyb3Bkb3duX2NvbnRlbnQuc3RvcCgpLmFuaW1hdGUoe3Njcm9sbFRvcDogc2Nyb2xsX3RvcH0sIGFuaW1hdGUgPyBzZWxmLnNldHRpbmdzLnNjcm9sbER1cmF0aW9uIDogMCk7XG5cdFx0XHRcdH1cblx0XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogU2VsZWN0cyBhbGwgaXRlbXMgKENUUkwgKyBBKS5cblx0XHQgKi9cblx0XHRzZWxlY3RBbGw6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0aWYgKHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScpIHJldHVybjtcblx0XG5cdFx0XHRzZWxmLiRhY3RpdmVJdGVtcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShzZWxmLiRjb250cm9sLmNoaWxkcmVuKCc6bm90KGlucHV0KScpLmFkZENsYXNzKCdhY3RpdmUnKSk7XG5cdFx0XHRpZiAoc2VsZi4kYWN0aXZlSXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdHNlbGYuaGlkZUlucHV0KCk7XG5cdFx0XHRcdHNlbGYuY2xvc2UoKTtcblx0XHRcdH1cblx0XHRcdHNlbGYuZm9jdXMoKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBIaWRlcyB0aGUgaW5wdXQgZWxlbWVudCBvdXQgb2Ygdmlldywgd2hpbGVcblx0XHQgKiByZXRhaW5pbmcgaXRzIGZvY3VzLlxuXHRcdCAqL1xuXHRcdGhpZGVJbnB1dDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdFx0c2VsZi5zZXRUZXh0Ym94VmFsdWUoJycpO1xuXHRcdFx0c2VsZi4kY29udHJvbF9pbnB1dC5jc3Moe29wYWNpdHk6IDAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBzZWxmLnJ0bCA/IDEwMDAwIDogLTEwMDAwfSk7XG5cdFx0XHRzZWxmLmlzSW5wdXRIaWRkZW4gPSB0cnVlO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJlc3RvcmVzIGlucHV0IHZpc2liaWxpdHkuXG5cdFx0ICovXG5cdFx0c2hvd0lucHV0OiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuJGNvbnRyb2xfaW5wdXQuY3NzKHtvcGFjaXR5OiAxLCBwb3NpdGlvbjogJ3JlbGF0aXZlJywgbGVmdDogMH0pO1xuXHRcdFx0dGhpcy5pc0lucHV0SGlkZGVuID0gZmFsc2U7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogR2l2ZXMgdGhlIGNvbnRyb2wgZm9jdXMuXG5cdFx0ICovXG5cdFx0Zm9jdXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0aWYgKHNlbGYuaXNEaXNhYmxlZCkgcmV0dXJuO1xuXHRcblx0XHRcdHNlbGYuaWdub3JlRm9jdXMgPSB0cnVlO1xuXHRcdFx0c2VsZi4kY29udHJvbF9pbnB1dFswXS5mb2N1cygpO1xuXHRcdFx0d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGYuaWdub3JlRm9jdXMgPSBmYWxzZTtcblx0XHRcdFx0c2VsZi5vbkZvY3VzKCk7XG5cdFx0XHR9LCAwKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBGb3JjZXMgdGhlIGNvbnRyb2wgb3V0IG9mIGZvY3VzLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtFbGVtZW50fSBkZXN0XG5cdFx0ICovXG5cdFx0Ymx1cjogZnVuY3Rpb24oZGVzdCkge1xuXHRcdFx0dGhpcy4kY29udHJvbF9pbnB1dFswXS5ibHVyKCk7XG5cdFx0XHR0aGlzLm9uQmx1cihudWxsLCBkZXN0KTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBzY29yZXMgYW4gb2JqZWN0XG5cdFx0ICogdG8gc2hvdyBob3cgZ29vZCBvZiBhIG1hdGNoIGl0IGlzIHRvIHRoZVxuXHRcdCAqIHByb3ZpZGVkIHF1ZXJ5LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5XG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcblx0XHQgKiBAcmV0dXJuIHtmdW5jdGlvbn1cblx0XHQgKi9cblx0XHRnZXRTY29yZUZ1bmN0aW9uOiBmdW5jdGlvbihxdWVyeSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuc2lmdGVyLmdldFNjb3JlRnVuY3Rpb24ocXVlcnksIHRoaXMuZ2V0U2VhcmNoT3B0aW9ucygpKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBSZXR1cm5zIHNlYXJjaCBvcHRpb25zIGZvciBzaWZ0ZXIgKHRoZSBzeXN0ZW1cblx0XHQgKiBmb3Igc2NvcmluZyBhbmQgc29ydGluZyByZXN1bHRzKS5cblx0XHQgKlxuXHRcdCAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2JyaWFucmVhdmlzL3NpZnRlci5qc1xuXHRcdCAqIEByZXR1cm4ge29iamVjdH1cblx0XHQgKi9cblx0XHRnZXRTZWFyY2hPcHRpb25zOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3M7XG5cdFx0XHR2YXIgc29ydCA9IHNldHRpbmdzLnNvcnRGaWVsZDtcblx0XHRcdGlmICh0eXBlb2Ygc29ydCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0c29ydCA9IFt7ZmllbGQ6IHNvcnR9XTtcblx0XHRcdH1cblx0XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRmaWVsZHMgICAgICA6IHNldHRpbmdzLnNlYXJjaEZpZWxkLFxuXHRcdFx0XHRjb25qdW5jdGlvbiA6IHNldHRpbmdzLnNlYXJjaENvbmp1bmN0aW9uLFxuXHRcdFx0XHRzb3J0ICAgICAgICA6IHNvcnRcblx0XHRcdH07XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogU2VhcmNoZXMgdGhyb3VnaCBhdmFpbGFibGUgb3B0aW9ucyBhbmQgcmV0dXJuc1xuXHRcdCAqIGEgc29ydGVkIGFycmF5IG9mIG1hdGNoZXMuXG5cdFx0ICpcblx0XHQgKiBSZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nOlxuXHRcdCAqXG5cdFx0ICogICAtIHF1ZXJ5IHtzdHJpbmd9XG5cdFx0ICogICAtIHRva2VucyB7YXJyYXl9XG5cdFx0ICogICAtIHRvdGFsIHtpbnR9XG5cdFx0ICogICAtIGl0ZW1zIHthcnJheX1cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBxdWVyeVxuXHRcdCAqIEByZXR1cm5zIHtvYmplY3R9XG5cdFx0ICovXG5cdFx0c2VhcmNoOiBmdW5jdGlvbihxdWVyeSkge1xuXHRcdFx0dmFyIGksIHZhbHVlLCBzY29yZSwgcmVzdWx0LCBjYWxjdWxhdGVTY29yZTtcblx0XHRcdHZhciBzZWxmICAgICA9IHRoaXM7XG5cdFx0XHR2YXIgc2V0dGluZ3MgPSBzZWxmLnNldHRpbmdzO1xuXHRcdFx0dmFyIG9wdGlvbnMgID0gdGhpcy5nZXRTZWFyY2hPcHRpb25zKCk7XG5cdFxuXHRcdFx0Ly8gdmFsaWRhdGUgdXNlci1wcm92aWRlZCByZXN1bHQgc2NvcmluZyBmdW5jdGlvblxuXHRcdFx0aWYgKHNldHRpbmdzLnNjb3JlKSB7XG5cdFx0XHRcdGNhbGN1bGF0ZVNjb3JlID0gc2VsZi5zZXR0aW5ncy5zY29yZS5hcHBseSh0aGlzLCBbcXVlcnldKTtcblx0XHRcdFx0aWYgKHR5cGVvZiBjYWxjdWxhdGVTY29yZSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignU2VsZWN0aXplIFwic2NvcmVcIiBzZXR0aW5nIG11c3QgYmUgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBmdW5jdGlvbicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly8gcGVyZm9ybSBzZWFyY2hcblx0XHRcdGlmIChxdWVyeSAhPT0gc2VsZi5sYXN0UXVlcnkpIHtcblx0XHRcdFx0c2VsZi5sYXN0UXVlcnkgPSBxdWVyeTtcblx0XHRcdFx0cmVzdWx0ID0gc2VsZi5zaWZ0ZXIuc2VhcmNoKHF1ZXJ5LCAkLmV4dGVuZChvcHRpb25zLCB7c2NvcmU6IGNhbGN1bGF0ZVNjb3JlfSkpO1xuXHRcdFx0XHRzZWxmLmN1cnJlbnRSZXN1bHRzID0gcmVzdWx0O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0ID0gJC5leHRlbmQodHJ1ZSwge30sIHNlbGYuY3VycmVudFJlc3VsdHMpO1xuXHRcdFx0fVxuXHRcblx0XHRcdC8vIGZpbHRlciBvdXQgc2VsZWN0ZWQgaXRlbXNcblx0XHRcdGlmIChzZXR0aW5ncy5oaWRlU2VsZWN0ZWQpIHtcblx0XHRcdFx0Zm9yIChpID0gcmVzdWx0Lml0ZW1zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdFx0aWYgKHNlbGYuaXRlbXMuaW5kZXhPZihoYXNoX2tleShyZXN1bHQuaXRlbXNbaV0uaWQpKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdHJlc3VsdC5pdGVtcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBSZWZyZXNoZXMgdGhlIGxpc3Qgb2YgYXZhaWxhYmxlIG9wdGlvbnMgc2hvd25cblx0XHQgKiBpbiB0aGUgYXV0b2NvbXBsZXRlIGRyb3Bkb3duIG1lbnUuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IHRyaWdnZXJEcm9wZG93blxuXHRcdCAqL1xuXHRcdHJlZnJlc2hPcHRpb25zOiBmdW5jdGlvbih0cmlnZ2VyRHJvcGRvd24pIHtcblx0XHRcdHZhciBpLCBqLCBrLCBuLCBncm91cHMsIGdyb3Vwc19vcmRlciwgb3B0aW9uLCBvcHRpb25faHRtbCwgb3B0Z3JvdXAsIG9wdGdyb3VwcywgaHRtbCwgaHRtbF9jaGlsZHJlbiwgaGFzX2NyZWF0ZV9vcHRpb247XG5cdFx0XHR2YXIgJGFjdGl2ZSwgJGFjdGl2ZV9iZWZvcmUsICRjcmVhdGU7XG5cdFxuXHRcdFx0aWYgKHR5cGVvZiB0cmlnZ2VyRHJvcGRvd24gPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHRyaWdnZXJEcm9wZG93biA9IHRydWU7XG5cdFx0XHR9XG5cdFxuXHRcdFx0dmFyIHNlbGYgICAgICAgICAgICAgID0gdGhpcztcblx0XHRcdHZhciBxdWVyeSAgICAgICAgICAgICA9ICQudHJpbShzZWxmLiRjb250cm9sX2lucHV0LnZhbCgpKTtcblx0XHRcdHZhciByZXN1bHRzICAgICAgICAgICA9IHNlbGYuc2VhcmNoKHF1ZXJ5KTtcblx0XHRcdHZhciAkZHJvcGRvd25fY29udGVudCA9IHNlbGYuJGRyb3Bkb3duX2NvbnRlbnQ7XG5cdFx0XHR2YXIgYWN0aXZlX2JlZm9yZSAgICAgPSBzZWxmLiRhY3RpdmVPcHRpb24gJiYgaGFzaF9rZXkoc2VsZi4kYWN0aXZlT3B0aW9uLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XG5cdFxuXHRcdFx0Ly8gYnVpbGQgbWFya3VwXG5cdFx0XHRuID0gcmVzdWx0cy5pdGVtcy5sZW5ndGg7XG5cdFx0XHRpZiAodHlwZW9mIHNlbGYuc2V0dGluZ3MubWF4T3B0aW9ucyA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0biA9IE1hdGgubWluKG4sIHNlbGYuc2V0dGluZ3MubWF4T3B0aW9ucyk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly8gcmVuZGVyIGFuZCBncm91cCBhdmFpbGFibGUgb3B0aW9ucyBpbmRpdmlkdWFsbHlcblx0XHRcdGdyb3VwcyA9IHt9O1xuXHRcdFx0Z3JvdXBzX29yZGVyID0gW107XG5cdFxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRvcHRpb24gICAgICA9IHNlbGYub3B0aW9uc1tyZXN1bHRzLml0ZW1zW2ldLmlkXTtcblx0XHRcdFx0b3B0aW9uX2h0bWwgPSBzZWxmLnJlbmRlcignb3B0aW9uJywgb3B0aW9uKTtcblx0XHRcdFx0b3B0Z3JvdXAgICAgPSBvcHRpb25bc2VsZi5zZXR0aW5ncy5vcHRncm91cEZpZWxkXSB8fCAnJztcblx0XHRcdFx0b3B0Z3JvdXBzICAgPSAkLmlzQXJyYXkob3B0Z3JvdXApID8gb3B0Z3JvdXAgOiBbb3B0Z3JvdXBdO1xuXHRcblx0XHRcdFx0Zm9yIChqID0gMCwgayA9IG9wdGdyb3VwcyAmJiBvcHRncm91cHMubGVuZ3RoOyBqIDwgazsgaisrKSB7XG5cdFx0XHRcdFx0b3B0Z3JvdXAgPSBvcHRncm91cHNbal07XG5cdFx0XHRcdFx0aWYgKCFzZWxmLm9wdGdyb3Vwcy5oYXNPd25Qcm9wZXJ0eShvcHRncm91cCkpIHtcblx0XHRcdFx0XHRcdG9wdGdyb3VwID0gJyc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghZ3JvdXBzLmhhc093blByb3BlcnR5KG9wdGdyb3VwKSkge1xuXHRcdFx0XHRcdFx0Z3JvdXBzW29wdGdyb3VwXSA9IFtdO1xuXHRcdFx0XHRcdFx0Z3JvdXBzX29yZGVyLnB1c2gob3B0Z3JvdXApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRncm91cHNbb3B0Z3JvdXBdLnB1c2gob3B0aW9uX2h0bWwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly8gc29ydCBvcHRncm91cHNcblx0XHRcdGlmICh0aGlzLnNldHRpbmdzLmxvY2tPcHRncm91cE9yZGVyKSB7XG5cdFx0XHRcdGdyb3Vwc19vcmRlci5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdFx0XHR2YXIgYV9vcmRlciA9IHNlbGYub3B0Z3JvdXBzW2FdLiRvcmRlciB8fCAwO1xuXHRcdFx0XHRcdHZhciBiX29yZGVyID0gc2VsZi5vcHRncm91cHNbYl0uJG9yZGVyIHx8IDA7XG5cdFx0XHRcdFx0cmV0dXJuIGFfb3JkZXIgLSBiX29yZGVyO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XG5cdFx0XHQvLyByZW5kZXIgb3B0Z3JvdXAgaGVhZGVycyAmIGpvaW4gZ3JvdXBzXG5cdFx0XHRodG1sID0gW107XG5cdFx0XHRmb3IgKGkgPSAwLCBuID0gZ3JvdXBzX29yZGVyLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRvcHRncm91cCA9IGdyb3Vwc19vcmRlcltpXTtcblx0XHRcdFx0aWYgKHNlbGYub3B0Z3JvdXBzLmhhc093blByb3BlcnR5KG9wdGdyb3VwKSAmJiBncm91cHNbb3B0Z3JvdXBdLmxlbmd0aCkge1xuXHRcdFx0XHRcdC8vIHJlbmRlciB0aGUgb3B0Z3JvdXAgaGVhZGVyIGFuZCBvcHRpb25zIHdpdGhpbiBpdCxcblx0XHRcdFx0XHQvLyB0aGVuIHBhc3MgaXQgdG8gdGhlIHdyYXBwZXIgdGVtcGxhdGVcblx0XHRcdFx0XHRodG1sX2NoaWxkcmVuID0gc2VsZi5yZW5kZXIoJ29wdGdyb3VwX2hlYWRlcicsIHNlbGYub3B0Z3JvdXBzW29wdGdyb3VwXSkgfHwgJyc7XG5cdFx0XHRcdFx0aHRtbF9jaGlsZHJlbiArPSBncm91cHNbb3B0Z3JvdXBdLmpvaW4oJycpO1xuXHRcdFx0XHRcdGh0bWwucHVzaChzZWxmLnJlbmRlcignb3B0Z3JvdXAnLCAkLmV4dGVuZCh7fSwgc2VsZi5vcHRncm91cHNbb3B0Z3JvdXBdLCB7XG5cdFx0XHRcdFx0XHRodG1sOiBodG1sX2NoaWxkcmVuXG5cdFx0XHRcdFx0fSkpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRodG1sLnB1c2goZ3JvdXBzW29wdGdyb3VwXS5qb2luKCcnKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XG5cdFx0XHQkZHJvcGRvd25fY29udGVudC5odG1sKGh0bWwuam9pbignJykpO1xuXHRcblx0XHRcdC8vIGhpZ2hsaWdodCBtYXRjaGluZyB0ZXJtcyBpbmxpbmVcblx0XHRcdGlmIChzZWxmLnNldHRpbmdzLmhpZ2hsaWdodCAmJiByZXN1bHRzLnF1ZXJ5Lmxlbmd0aCAmJiByZXN1bHRzLnRva2Vucy5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yIChpID0gMCwgbiA9IHJlc3VsdHMudG9rZW5zLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRcdGhpZ2hsaWdodCgkZHJvcGRvd25fY29udGVudCwgcmVzdWx0cy50b2tlbnNbaV0ucmVnZXgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly8gYWRkIFwic2VsZWN0ZWRcIiBjbGFzcyB0byBzZWxlY3RlZCBvcHRpb25zXG5cdFx0XHRpZiAoIXNlbGYuc2V0dGluZ3MuaGlkZVNlbGVjdGVkKSB7XG5cdFx0XHRcdGZvciAoaSA9IDAsIG4gPSBzZWxmLml0ZW1zLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRcdHNlbGYuZ2V0T3B0aW9uKHNlbGYuaXRlbXNbaV0pLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly8gYWRkIGNyZWF0ZSBvcHRpb25cblx0XHRcdGhhc19jcmVhdGVfb3B0aW9uID0gc2VsZi5jYW5DcmVhdGUocXVlcnkpO1xuXHRcdFx0aWYgKGhhc19jcmVhdGVfb3B0aW9uKSB7XG5cdFx0XHRcdCRkcm9wZG93bl9jb250ZW50LnByZXBlbmQoc2VsZi5yZW5kZXIoJ29wdGlvbl9jcmVhdGUnLCB7aW5wdXQ6IHF1ZXJ5fSkpO1xuXHRcdFx0XHQkY3JlYXRlID0gJCgkZHJvcGRvd25fY29udGVudFswXS5jaGlsZE5vZGVzWzBdKTtcblx0XHRcdH1cblx0XG5cdFx0XHQvLyBhY3RpdmF0ZVxuXHRcdFx0c2VsZi5oYXNPcHRpb25zID0gcmVzdWx0cy5pdGVtcy5sZW5ndGggPiAwIHx8IGhhc19jcmVhdGVfb3B0aW9uO1xuXHRcdFx0aWYgKHNlbGYuaGFzT3B0aW9ucykge1xuXHRcdFx0XHRpZiAocmVzdWx0cy5pdGVtcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0JGFjdGl2ZV9iZWZvcmUgPSBhY3RpdmVfYmVmb3JlICYmIHNlbGYuZ2V0T3B0aW9uKGFjdGl2ZV9iZWZvcmUpO1xuXHRcdFx0XHRcdGlmICgkYWN0aXZlX2JlZm9yZSAmJiAkYWN0aXZlX2JlZm9yZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdCRhY3RpdmUgPSAkYWN0aXZlX2JlZm9yZTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScgJiYgc2VsZi5pdGVtcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdCRhY3RpdmUgPSBzZWxmLmdldE9wdGlvbihzZWxmLml0ZW1zWzBdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCEkYWN0aXZlIHx8ICEkYWN0aXZlLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0aWYgKCRjcmVhdGUgJiYgIXNlbGYuc2V0dGluZ3MuYWRkUHJlY2VkZW5jZSkge1xuXHRcdFx0XHRcdFx0XHQkYWN0aXZlID0gc2VsZi5nZXRBZGphY2VudE9wdGlvbigkY3JlYXRlLCAxKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdCRhY3RpdmUgPSAkZHJvcGRvd25fY29udGVudC5maW5kKCdbZGF0YS1zZWxlY3RhYmxlXTpmaXJzdCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkYWN0aXZlID0gJGNyZWF0ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzZWxmLnNldEFjdGl2ZU9wdGlvbigkYWN0aXZlKTtcblx0XHRcdFx0aWYgKHRyaWdnZXJEcm9wZG93biAmJiAhc2VsZi5pc09wZW4pIHsgc2VsZi5vcGVuKCk7IH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlbGYuc2V0QWN0aXZlT3B0aW9uKG51bGwpO1xuXHRcdFx0XHRpZiAodHJpZ2dlckRyb3Bkb3duICYmIHNlbGYuaXNPcGVuKSB7IHNlbGYuY2xvc2UoKTsgfVxuXHRcdFx0fVxuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIEFkZHMgYW4gYXZhaWxhYmxlIG9wdGlvbi4gSWYgaXQgYWxyZWFkeSBleGlzdHMsXG5cdFx0ICogbm90aGluZyB3aWxsIGhhcHBlbi4gTm90ZTogdGhpcyBkb2VzIG5vdCByZWZyZXNoXG5cdFx0ICogdGhlIG9wdGlvbnMgbGlzdCBkcm9wZG93biAodXNlIGByZWZyZXNoT3B0aW9uc2Bcblx0XHQgKiBmb3IgdGhhdCkuXG5cdFx0ICpcblx0XHQgKiBVc2FnZTpcblx0XHQgKlxuXHRcdCAqICAgdGhpcy5hZGRPcHRpb24oZGF0YSlcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fGFycmF5fSBkYXRhXG5cdFx0ICovXG5cdFx0YWRkT3B0aW9uOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHR2YXIgaSwgbiwgdmFsdWUsIHNlbGYgPSB0aGlzO1xuXHRcblx0XHRcdGlmICgkLmlzQXJyYXkoZGF0YSkpIHtcblx0XHRcdFx0Zm9yIChpID0gMCwgbiA9IGRhdGEubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdFx0c2VsZi5hZGRPcHRpb24oZGF0YVtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcblx0XHRcdGlmICh2YWx1ZSA9IHNlbGYucmVnaXN0ZXJPcHRpb24oZGF0YSkpIHtcblx0XHRcdFx0c2VsZi51c2VyT3B0aW9uc1t2YWx1ZV0gPSB0cnVlO1xuXHRcdFx0XHRzZWxmLmxhc3RRdWVyeSA9IG51bGw7XG5cdFx0XHRcdHNlbGYudHJpZ2dlcignb3B0aW9uX2FkZCcsIHZhbHVlLCBkYXRhKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBSZWdpc3RlcnMgYW4gb3B0aW9uIHRvIHRoZSBwb29sIG9mIG9wdGlvbnMuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuXHRcdCAqIEByZXR1cm4ge2Jvb2xlYW58c3RyaW5nfVxuXHRcdCAqL1xuXHRcdHJlZ2lzdGVyT3B0aW9uOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHR2YXIga2V5ID0gaGFzaF9rZXkoZGF0YVt0aGlzLnNldHRpbmdzLnZhbHVlRmllbGRdKTtcblx0XHRcdGlmICgha2V5IHx8IHRoaXMub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRkYXRhLiRvcmRlciA9IGRhdGEuJG9yZGVyIHx8ICsrdGhpcy5vcmRlcjtcblx0XHRcdHRoaXMub3B0aW9uc1trZXldID0gZGF0YTtcblx0XHRcdHJldHVybiBrZXk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogUmVnaXN0ZXJzIGFuIG9wdGlvbiBncm91cCB0byB0aGUgcG9vbCBvZiBvcHRpb24gZ3JvdXBzLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IGRhdGFcblx0XHQgKiBAcmV0dXJuIHtib29sZWFufHN0cmluZ31cblx0XHQgKi9cblx0XHRyZWdpc3Rlck9wdGlvbkdyb3VwOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHR2YXIga2V5ID0gaGFzaF9rZXkoZGF0YVt0aGlzLnNldHRpbmdzLm9wdGdyb3VwVmFsdWVGaWVsZF0pO1xuXHRcdFx0aWYgKCFrZXkpIHJldHVybiBmYWxzZTtcblx0XG5cdFx0XHRkYXRhLiRvcmRlciA9IGRhdGEuJG9yZGVyIHx8ICsrdGhpcy5vcmRlcjtcblx0XHRcdHRoaXMub3B0Z3JvdXBzW2tleV0gPSBkYXRhO1xuXHRcdFx0cmV0dXJuIGtleTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBSZWdpc3RlcnMgYSBuZXcgb3B0Z3JvdXAgZm9yIG9wdGlvbnNcblx0XHQgKiB0byBiZSBidWNrZXRlZCBpbnRvLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGlkXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IGRhdGFcblx0XHQgKi9cblx0XHRhZGRPcHRpb25Hcm91cDogZnVuY3Rpb24oaWQsIGRhdGEpIHtcblx0XHRcdGRhdGFbdGhpcy5zZXR0aW5ncy5vcHRncm91cFZhbHVlRmllbGRdID0gaWQ7XG5cdFx0XHRpZiAoaWQgPSB0aGlzLnJlZ2lzdGVyT3B0aW9uR3JvdXAoZGF0YSkpIHtcblx0XHRcdFx0dGhpcy50cmlnZ2VyKCdvcHRncm91cF9hZGQnLCBpZCwgZGF0YSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogUmVtb3ZlcyBhbiBleGlzdGluZyBvcHRpb24gZ3JvdXAuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gaWRcblx0XHQgKi9cblx0XHRyZW1vdmVPcHRpb25Hcm91cDogZnVuY3Rpb24oaWQpIHtcblx0XHRcdGlmICh0aGlzLm9wdGdyb3Vwcy5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcblx0XHRcdFx0ZGVsZXRlIHRoaXMub3B0Z3JvdXBzW2lkXTtcblx0XHRcdFx0dGhpcy5yZW5kZXJDYWNoZSA9IHt9O1xuXHRcdFx0XHR0aGlzLnRyaWdnZXIoJ29wdGdyb3VwX3JlbW92ZScsIGlkKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBDbGVhcnMgYWxsIGV4aXN0aW5nIG9wdGlvbiBncm91cHMuXG5cdFx0ICovXG5cdFx0Y2xlYXJPcHRpb25Hcm91cHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5vcHRncm91cHMgPSB7fTtcblx0XHRcdHRoaXMucmVuZGVyQ2FjaGUgPSB7fTtcblx0XHRcdHRoaXMudHJpZ2dlcignb3B0Z3JvdXBfY2xlYXInKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBVcGRhdGVzIGFuIG9wdGlvbiBhdmFpbGFibGUgZm9yIHNlbGVjdGlvbi4gSWZcblx0XHQgKiBpdCBpcyB2aXNpYmxlIGluIHRoZSBzZWxlY3RlZCBpdGVtcyBvciBvcHRpb25zXG5cdFx0ICogZHJvcGRvd24sIGl0IHdpbGwgYmUgcmUtcmVuZGVyZWQgYXV0b21hdGljYWxseS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG5cdFx0ICovXG5cdFx0dXBkYXRlT3B0aW9uOiBmdW5jdGlvbih2YWx1ZSwgZGF0YSkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyICRpdGVtLCAkaXRlbV9uZXc7XG5cdFx0XHR2YXIgdmFsdWVfbmV3LCBpbmRleF9pdGVtLCBjYWNoZV9pdGVtcywgY2FjaGVfb3B0aW9ucywgb3JkZXJfb2xkO1xuXHRcblx0XHRcdHZhbHVlICAgICA9IGhhc2hfa2V5KHZhbHVlKTtcblx0XHRcdHZhbHVlX25ldyA9IGhhc2hfa2V5KGRhdGFbc2VsZi5zZXR0aW5ncy52YWx1ZUZpZWxkXSk7XG5cdFxuXHRcdFx0Ly8gc2FuaXR5IGNoZWNrc1xuXHRcdFx0aWYgKHZhbHVlID09PSBudWxsKSByZXR1cm47XG5cdFx0XHRpZiAoIXNlbGYub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHJldHVybjtcblx0XHRcdGlmICh0eXBlb2YgdmFsdWVfbmV3ICE9PSAnc3RyaW5nJykgdGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBtdXN0IGJlIHNldCBpbiBvcHRpb24gZGF0YScpO1xuXHRcblx0XHRcdG9yZGVyX29sZCA9IHNlbGYub3B0aW9uc1t2YWx1ZV0uJG9yZGVyO1xuXHRcblx0XHRcdC8vIHVwZGF0ZSByZWZlcmVuY2VzXG5cdFx0XHRpZiAodmFsdWVfbmV3ICE9PSB2YWx1ZSkge1xuXHRcdFx0XHRkZWxldGUgc2VsZi5vcHRpb25zW3ZhbHVlXTtcblx0XHRcdFx0aW5kZXhfaXRlbSA9IHNlbGYuaXRlbXMuaW5kZXhPZih2YWx1ZSk7XG5cdFx0XHRcdGlmIChpbmRleF9pdGVtICE9PSAtMSkge1xuXHRcdFx0XHRcdHNlbGYuaXRlbXMuc3BsaWNlKGluZGV4X2l0ZW0sIDEsIHZhbHVlX25ldyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGRhdGEuJG9yZGVyID0gZGF0YS4kb3JkZXIgfHwgb3JkZXJfb2xkO1xuXHRcdFx0c2VsZi5vcHRpb25zW3ZhbHVlX25ld10gPSBkYXRhO1xuXHRcblx0XHRcdC8vIGludmFsaWRhdGUgcmVuZGVyIGNhY2hlXG5cdFx0XHRjYWNoZV9pdGVtcyA9IHNlbGYucmVuZGVyQ2FjaGVbJ2l0ZW0nXTtcblx0XHRcdGNhY2hlX29wdGlvbnMgPSBzZWxmLnJlbmRlckNhY2hlWydvcHRpb24nXTtcblx0XG5cdFx0XHRpZiAoY2FjaGVfaXRlbXMpIHtcblx0XHRcdFx0ZGVsZXRlIGNhY2hlX2l0ZW1zW3ZhbHVlXTtcblx0XHRcdFx0ZGVsZXRlIGNhY2hlX2l0ZW1zW3ZhbHVlX25ld107XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2FjaGVfb3B0aW9ucykge1xuXHRcdFx0XHRkZWxldGUgY2FjaGVfb3B0aW9uc1t2YWx1ZV07XG5cdFx0XHRcdGRlbGV0ZSBjYWNoZV9vcHRpb25zW3ZhbHVlX25ld107XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly8gdXBkYXRlIHRoZSBpdGVtIGlmIGl0J3Mgc2VsZWN0ZWRcblx0XHRcdGlmIChzZWxmLml0ZW1zLmluZGV4T2YodmFsdWVfbmV3KSAhPT0gLTEpIHtcblx0XHRcdFx0JGl0ZW0gPSBzZWxmLmdldEl0ZW0odmFsdWUpO1xuXHRcdFx0XHQkaXRlbV9uZXcgPSAkKHNlbGYucmVuZGVyKCdpdGVtJywgZGF0YSkpO1xuXHRcdFx0XHRpZiAoJGl0ZW0uaGFzQ2xhc3MoJ2FjdGl2ZScpKSAkaXRlbV9uZXcuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHQkaXRlbS5yZXBsYWNlV2l0aCgkaXRlbV9uZXcpO1xuXHRcdFx0fVxuXHRcblx0XHRcdC8vIGludmFsaWRhdGUgbGFzdCBxdWVyeSBiZWNhdXNlIHdlIG1pZ2h0IGhhdmUgdXBkYXRlZCB0aGUgc29ydEZpZWxkXG5cdFx0XHRzZWxmLmxhc3RRdWVyeSA9IG51bGw7XG5cdFxuXHRcdFx0Ly8gdXBkYXRlIGRyb3Bkb3duIGNvbnRlbnRzXG5cdFx0XHRpZiAoc2VsZi5pc09wZW4pIHtcblx0XHRcdFx0c2VsZi5yZWZyZXNoT3B0aW9ucyhmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogUmVtb3ZlcyBhIHNpbmdsZSBvcHRpb24uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IHNpbGVudFxuXHRcdCAqL1xuXHRcdHJlbW92ZU9wdGlvbjogZnVuY3Rpb24odmFsdWUsIHNpbGVudCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFsdWUgPSBoYXNoX2tleSh2YWx1ZSk7XG5cdFxuXHRcdFx0dmFyIGNhY2hlX2l0ZW1zID0gc2VsZi5yZW5kZXJDYWNoZVsnaXRlbSddO1xuXHRcdFx0dmFyIGNhY2hlX29wdGlvbnMgPSBzZWxmLnJlbmRlckNhY2hlWydvcHRpb24nXTtcblx0XHRcdGlmIChjYWNoZV9pdGVtcykgZGVsZXRlIGNhY2hlX2l0ZW1zW3ZhbHVlXTtcblx0XHRcdGlmIChjYWNoZV9vcHRpb25zKSBkZWxldGUgY2FjaGVfb3B0aW9uc1t2YWx1ZV07XG5cdFxuXHRcdFx0ZGVsZXRlIHNlbGYudXNlck9wdGlvbnNbdmFsdWVdO1xuXHRcdFx0ZGVsZXRlIHNlbGYub3B0aW9uc1t2YWx1ZV07XG5cdFx0XHRzZWxmLmxhc3RRdWVyeSA9IG51bGw7XG5cdFx0XHRzZWxmLnRyaWdnZXIoJ29wdGlvbl9yZW1vdmUnLCB2YWx1ZSk7XG5cdFx0XHRzZWxmLnJlbW92ZUl0ZW0odmFsdWUsIHNpbGVudCk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogQ2xlYXJzIGFsbCBvcHRpb25zLlxuXHRcdCAqL1xuXHRcdGNsZWFyT3B0aW9uczogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdFx0c2VsZi5sb2FkZWRTZWFyY2hlcyA9IHt9O1xuXHRcdFx0c2VsZi51c2VyT3B0aW9ucyA9IHt9O1xuXHRcdFx0c2VsZi5yZW5kZXJDYWNoZSA9IHt9O1xuXHRcdFx0c2VsZi5vcHRpb25zID0gc2VsZi5zaWZ0ZXIuaXRlbXMgPSB7fTtcblx0XHRcdHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblx0XHRcdHNlbGYudHJpZ2dlcignb3B0aW9uX2NsZWFyJyk7XG5cdFx0XHRzZWxmLmNsZWFyKCk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogUmV0dXJucyB0aGUgalF1ZXJ5IGVsZW1lbnQgb2YgdGhlIG9wdGlvblxuXHRcdCAqIG1hdGNoaW5nIHRoZSBnaXZlbiB2YWx1ZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuXHRcdCAqIEByZXR1cm5zIHtvYmplY3R9XG5cdFx0ICovXG5cdFx0Z2V0T3B0aW9uOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0RWxlbWVudFdpdGhWYWx1ZSh2YWx1ZSwgdGhpcy4kZHJvcGRvd25fY29udGVudC5maW5kKCdbZGF0YS1zZWxlY3RhYmxlXScpKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBSZXR1cm5zIHRoZSBqUXVlcnkgZWxlbWVudCBvZiB0aGUgbmV4dCBvclxuXHRcdCAqIHByZXZpb3VzIHNlbGVjdGFibGUgb3B0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9ICRvcHRpb25cblx0XHQgKiBAcGFyYW0ge2ludH0gZGlyZWN0aW9uICBjYW4gYmUgMSBmb3IgbmV4dCBvciAtMSBmb3IgcHJldmlvdXNcblx0XHQgKiBAcmV0dXJuIHtvYmplY3R9XG5cdFx0ICovXG5cdFx0Z2V0QWRqYWNlbnRPcHRpb246IGZ1bmN0aW9uKCRvcHRpb24sIGRpcmVjdGlvbikge1xuXHRcdFx0dmFyICRvcHRpb25zID0gdGhpcy4kZHJvcGRvd24uZmluZCgnW2RhdGEtc2VsZWN0YWJsZV0nKTtcblx0XHRcdHZhciBpbmRleCAgICA9ICRvcHRpb25zLmluZGV4KCRvcHRpb24pICsgZGlyZWN0aW9uO1xuXHRcblx0XHRcdHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgJG9wdGlvbnMubGVuZ3RoID8gJG9wdGlvbnMuZXEoaW5kZXgpIDogJCgpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIEZpbmRzIHRoZSBmaXJzdCBlbGVtZW50IHdpdGggYSBcImRhdGEtdmFsdWVcIiBhdHRyaWJ1dGVcblx0XHQgKiB0aGF0IG1hdGNoZXMgdGhlIGdpdmVuIHZhbHVlLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHttaXhlZH0gdmFsdWVcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gJGVsc1xuXHRcdCAqIEByZXR1cm4ge29iamVjdH1cblx0XHQgKi9cblx0XHRnZXRFbGVtZW50V2l0aFZhbHVlOiBmdW5jdGlvbih2YWx1ZSwgJGVscykge1xuXHRcdFx0dmFsdWUgPSBoYXNoX2tleSh2YWx1ZSk7XG5cdFxuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgIT09IG51bGwpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIG4gPSAkZWxzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRcdGlmICgkZWxzW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpID09PSB2YWx1ZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICQoJGVsc1tpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFxuXHRcdFx0cmV0dXJuICQoKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBSZXR1cm5zIHRoZSBqUXVlcnkgZWxlbWVudCBvZiB0aGUgaXRlbVxuXHRcdCAqIG1hdGNoaW5nIHRoZSBnaXZlbiB2YWx1ZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuXHRcdCAqIEByZXR1cm5zIHtvYmplY3R9XG5cdFx0ICovXG5cdFx0Z2V0SXRlbTogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHJldHVybiB0aGlzLmdldEVsZW1lbnRXaXRoVmFsdWUodmFsdWUsIHRoaXMuJGNvbnRyb2wuY2hpbGRyZW4oKSk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogXCJTZWxlY3RzXCIgbXVsdGlwbGUgaXRlbXMgYXQgb25jZS4gQWRkcyB0aGVtIHRvIHRoZSBsaXN0XG5cdFx0ICogYXQgdGhlIGN1cnJlbnQgY2FyZXQgcG9zaXRpb24uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IHNpbGVudFxuXHRcdCAqL1xuXHRcdGFkZEl0ZW1zOiBmdW5jdGlvbih2YWx1ZXMsIHNpbGVudCkge1xuXHRcdFx0dmFyIGl0ZW1zID0gJC5pc0FycmF5KHZhbHVlcykgPyB2YWx1ZXMgOiBbdmFsdWVzXTtcblx0XHRcdGZvciAodmFyIGkgPSAwLCBuID0gaXRlbXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuaXNQZW5kaW5nID0gKGkgPCBuIC0gMSk7XG5cdFx0XHRcdHRoaXMuYWRkSXRlbShpdGVtc1tpXSwgc2lsZW50KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBcIlNlbGVjdHNcIiBhbiBpdGVtLiBBZGRzIGl0IHRvIHRoZSBsaXN0XG5cdFx0ICogYXQgdGhlIGN1cnJlbnQgY2FyZXQgcG9zaXRpb24uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW59IHNpbGVudFxuXHRcdCAqL1xuXHRcdGFkZEl0ZW06IGZ1bmN0aW9uKHZhbHVlLCBzaWxlbnQpIHtcblx0XHRcdHZhciBldmVudHMgPSBzaWxlbnQgPyBbXSA6IFsnY2hhbmdlJ107XG5cdFxuXHRcdFx0ZGVib3VuY2VfZXZlbnRzKHRoaXMsIGV2ZW50cywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciAkaXRlbSwgJG9wdGlvbiwgJG9wdGlvbnM7XG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFx0dmFyIGlucHV0TW9kZSA9IHNlbGYuc2V0dGluZ3MubW9kZTtcblx0XHRcdFx0dmFyIGksIGFjdGl2ZSwgdmFsdWVfbmV4dCwgd2FzRnVsbDtcblx0XHRcdFx0dmFsdWUgPSBoYXNoX2tleSh2YWx1ZSk7XG5cdFxuXHRcdFx0XHRpZiAoc2VsZi5pdGVtcy5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRpZiAoaW5wdXRNb2RlID09PSAnc2luZ2xlJykgc2VsZi5jbG9zZSgpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcblx0XHRcdFx0aWYgKCFzZWxmLm9wdGlvbnMuaGFzT3duUHJvcGVydHkodmFsdWUpKSByZXR1cm47XG5cdFx0XHRcdGlmIChpbnB1dE1vZGUgPT09ICdzaW5nbGUnKSBzZWxmLmNsZWFyKHNpbGVudCk7XG5cdFx0XHRcdGlmIChpbnB1dE1vZGUgPT09ICdtdWx0aScgJiYgc2VsZi5pc0Z1bGwoKSkgcmV0dXJuO1xuXHRcblx0XHRcdFx0JGl0ZW0gPSAkKHNlbGYucmVuZGVyKCdpdGVtJywgc2VsZi5vcHRpb25zW3ZhbHVlXSkpO1xuXHRcdFx0XHR3YXNGdWxsID0gc2VsZi5pc0Z1bGwoKTtcblx0XHRcdFx0c2VsZi5pdGVtcy5zcGxpY2Uoc2VsZi5jYXJldFBvcywgMCwgdmFsdWUpO1xuXHRcdFx0XHRzZWxmLmluc2VydEF0Q2FyZXQoJGl0ZW0pO1xuXHRcdFx0XHRpZiAoIXNlbGYuaXNQZW5kaW5nIHx8ICghd2FzRnVsbCAmJiBzZWxmLmlzRnVsbCgpKSkge1xuXHRcdFx0XHRcdHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdFx0XHRcdH1cblx0XG5cdFx0XHRcdGlmIChzZWxmLmlzU2V0dXApIHtcblx0XHRcdFx0XHQkb3B0aW9ucyA9IHNlbGYuJGRyb3Bkb3duX2NvbnRlbnQuZmluZCgnW2RhdGEtc2VsZWN0YWJsZV0nKTtcblx0XG5cdFx0XHRcdFx0Ly8gdXBkYXRlIG1lbnUgLyByZW1vdmUgdGhlIG9wdGlvbiAoaWYgdGhpcyBpcyBub3Qgb25lIGl0ZW0gYmVpbmcgYWRkZWQgYXMgcGFydCBvZiBzZXJpZXMpXG5cdFx0XHRcdFx0aWYgKCFzZWxmLmlzUGVuZGluZykge1xuXHRcdFx0XHRcdFx0JG9wdGlvbiA9IHNlbGYuZ2V0T3B0aW9uKHZhbHVlKTtcblx0XHRcdFx0XHRcdHZhbHVlX25leHQgPSBzZWxmLmdldEFkamFjZW50T3B0aW9uKCRvcHRpb24sIDEpLmF0dHIoJ2RhdGEtdmFsdWUnKTtcblx0XHRcdFx0XHRcdHNlbGYucmVmcmVzaE9wdGlvbnMoc2VsZi5pc0ZvY3VzZWQgJiYgaW5wdXRNb2RlICE9PSAnc2luZ2xlJyk7XG5cdFx0XHRcdFx0XHRpZiAodmFsdWVfbmV4dCkge1xuXHRcdFx0XHRcdFx0XHRzZWxmLnNldEFjdGl2ZU9wdGlvbihzZWxmLmdldE9wdGlvbih2YWx1ZV9uZXh0KSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcblx0XHRcdFx0XHQvLyBoaWRlIHRoZSBtZW51IGlmIHRoZSBtYXhpbXVtIG51bWJlciBvZiBpdGVtcyBoYXZlIGJlZW4gc2VsZWN0ZWQgb3Igbm8gb3B0aW9ucyBhcmUgbGVmdFxuXHRcdFx0XHRcdGlmICghJG9wdGlvbnMubGVuZ3RoIHx8IHNlbGYuaXNGdWxsKCkpIHtcblx0XHRcdFx0XHRcdHNlbGYuY2xvc2UoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VsZi5wb3NpdGlvbkRyb3Bkb3duKCk7XG5cdFx0XHRcdFx0fVxuXHRcblx0XHRcdFx0XHRzZWxmLnVwZGF0ZVBsYWNlaG9sZGVyKCk7XG5cdFx0XHRcdFx0c2VsZi50cmlnZ2VyKCdpdGVtX2FkZCcsIHZhbHVlLCAkaXRlbSk7XG5cdFx0XHRcdFx0c2VsZi51cGRhdGVPcmlnaW5hbElucHV0KHtzaWxlbnQ6IHNpbGVudH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBSZW1vdmVzIHRoZSBzZWxlY3RlZCBpdGVtIG1hdGNoaW5nXG5cdFx0ICogdGhlIHByb3ZpZGVkIHZhbHVlLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG5cdFx0ICovXG5cdFx0cmVtb3ZlSXRlbTogZnVuY3Rpb24odmFsdWUsIHNpbGVudCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyICRpdGVtLCBpLCBpZHg7XG5cdFxuXHRcdFx0JGl0ZW0gPSAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykgPyB2YWx1ZSA6IHNlbGYuZ2V0SXRlbSh2YWx1ZSk7XG5cdFx0XHR2YWx1ZSA9IGhhc2hfa2V5KCRpdGVtLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XG5cdFx0XHRpID0gc2VsZi5pdGVtcy5pbmRleE9mKHZhbHVlKTtcblx0XG5cdFx0XHRpZiAoaSAhPT0gLTEpIHtcblx0XHRcdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICgkaXRlbS5oYXNDbGFzcygnYWN0aXZlJykpIHtcblx0XHRcdFx0XHRpZHggPSBzZWxmLiRhY3RpdmVJdGVtcy5pbmRleE9mKCRpdGVtWzBdKTtcblx0XHRcdFx0XHRzZWxmLiRhY3RpdmVJdGVtcy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdFx0fVxuXHRcblx0XHRcdFx0c2VsZi5pdGVtcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblx0XHRcdFx0aWYgKCFzZWxmLnNldHRpbmdzLnBlcnNpc3QgJiYgc2VsZi51c2VyT3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHtcblx0XHRcdFx0XHRzZWxmLnJlbW92ZU9wdGlvbih2YWx1ZSwgc2lsZW50KTtcblx0XHRcdFx0fVxuXHRcblx0XHRcdFx0aWYgKGkgPCBzZWxmLmNhcmV0UG9zKSB7XG5cdFx0XHRcdFx0c2VsZi5zZXRDYXJldChzZWxmLmNhcmV0UG9zIC0gMSk7XG5cdFx0XHRcdH1cblx0XG5cdFx0XHRcdHNlbGYucmVmcmVzaFN0YXRlKCk7XG5cdFx0XHRcdHNlbGYudXBkYXRlUGxhY2Vob2xkZXIoKTtcblx0XHRcdFx0c2VsZi51cGRhdGVPcmlnaW5hbElucHV0KHtzaWxlbnQ6IHNpbGVudH0pO1xuXHRcdFx0XHRzZWxmLnBvc2l0aW9uRHJvcGRvd24oKTtcblx0XHRcdFx0c2VsZi50cmlnZ2VyKCdpdGVtX3JlbW92ZScsIHZhbHVlLCAkaXRlbSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogSW52b2tlcyB0aGUgYGNyZWF0ZWAgbWV0aG9kIHByb3ZpZGVkIGluIHRoZVxuXHRcdCAqIHNlbGVjdGl6ZSBvcHRpb25zIHRoYXQgc2hvdWxkIHByb3ZpZGUgdGhlIGRhdGFcblx0XHQgKiBmb3IgdGhlIG5ldyBpdGVtLCBnaXZlbiB0aGUgdXNlciBpbnB1dC5cblx0XHQgKlxuXHRcdCAqIE9uY2UgdGhpcyBjb21wbGV0ZXMsIGl0IHdpbGwgYmUgYWRkZWRcblx0XHQgKiB0byB0aGUgaXRlbSBsaXN0LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSBbdHJpZ2dlckRyb3Bkb3duXVxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjYWxsYmFja11cblx0XHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdGNyZWF0ZUl0ZW06IGZ1bmN0aW9uKGlucHV0LCB0cmlnZ2VyRHJvcGRvd24pIHtcblx0XHRcdHZhciBzZWxmICA9IHRoaXM7XG5cdFx0XHR2YXIgY2FyZXQgPSBzZWxmLmNhcmV0UG9zO1xuXHRcdFx0aW5wdXQgPSBpbnB1dCB8fCAkLnRyaW0oc2VsZi4kY29udHJvbF9pbnB1dC52YWwoKSB8fCAnJyk7XG5cdFxuXHRcdFx0dmFyIGNhbGxiYWNrID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcblx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7fTtcblx0XG5cdFx0XHRpZiAodHlwZW9mIHRyaWdnZXJEcm9wZG93biAhPT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHRcdHRyaWdnZXJEcm9wZG93biA9IHRydWU7XG5cdFx0XHR9XG5cdFxuXHRcdFx0aWYgKCFzZWxmLmNhbkNyZWF0ZShpbnB1dCkpIHtcblx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcblx0XHRcdHNlbGYubG9jaygpO1xuXHRcblx0XHRcdHZhciBzZXR1cCA9ICh0eXBlb2Ygc2VsZi5zZXR0aW5ncy5jcmVhdGUgPT09ICdmdW5jdGlvbicpID8gdGhpcy5zZXR0aW5ncy5jcmVhdGUgOiBmdW5jdGlvbihpbnB1dCkge1xuXHRcdFx0XHR2YXIgZGF0YSA9IHt9O1xuXHRcdFx0XHRkYXRhW3NlbGYuc2V0dGluZ3MubGFiZWxGaWVsZF0gPSBpbnB1dDtcblx0XHRcdFx0ZGF0YVtzZWxmLnNldHRpbmdzLnZhbHVlRmllbGRdID0gaW5wdXQ7XG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fTtcblx0XG5cdFx0XHR2YXIgY3JlYXRlID0gb25jZShmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdHNlbGYudW5sb2NrKCk7XG5cdFxuXHRcdFx0XHRpZiAoIWRhdGEgfHwgdHlwZW9mIGRhdGEgIT09ICdvYmplY3QnKSByZXR1cm4gY2FsbGJhY2soKTtcblx0XHRcdFx0dmFyIHZhbHVlID0gaGFzaF9rZXkoZGF0YVtzZWxmLnNldHRpbmdzLnZhbHVlRmllbGRdKTtcblx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHJldHVybiBjYWxsYmFjaygpO1xuXHRcblx0XHRcdFx0c2VsZi5zZXRUZXh0Ym94VmFsdWUoJycpO1xuXHRcdFx0XHRzZWxmLmFkZE9wdGlvbihkYXRhKTtcblx0XHRcdFx0c2VsZi5zZXRDYXJldChjYXJldCk7XG5cdFx0XHRcdHNlbGYuYWRkSXRlbSh2YWx1ZSk7XG5cdFx0XHRcdHNlbGYucmVmcmVzaE9wdGlvbnModHJpZ2dlckRyb3Bkb3duICYmIHNlbGYuc2V0dGluZ3MubW9kZSAhPT0gJ3NpbmdsZScpO1xuXHRcdFx0XHRjYWxsYmFjayhkYXRhKTtcblx0XHRcdH0pO1xuXHRcblx0XHRcdHZhciBvdXRwdXQgPSBzZXR1cC5hcHBseSh0aGlzLCBbaW5wdXQsIGNyZWF0ZV0pO1xuXHRcdFx0aWYgKHR5cGVvZiBvdXRwdXQgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdGNyZWF0ZShvdXRwdXQpO1xuXHRcdFx0fVxuXHRcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJlLXJlbmRlcnMgdGhlIHNlbGVjdGVkIGl0ZW0gbGlzdHMuXG5cdFx0ICovXG5cdFx0cmVmcmVzaEl0ZW1zOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMubGFzdFF1ZXJ5ID0gbnVsbDtcblx0XG5cdFx0XHRpZiAodGhpcy5pc1NldHVwKSB7XG5cdFx0XHRcdHRoaXMuYWRkSXRlbSh0aGlzLml0ZW1zKTtcblx0XHRcdH1cblx0XG5cdFx0XHR0aGlzLnJlZnJlc2hTdGF0ZSgpO1xuXHRcdFx0dGhpcy51cGRhdGVPcmlnaW5hbElucHV0KCk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogVXBkYXRlcyBhbGwgc3RhdGUtZGVwZW5kZW50IGF0dHJpYnV0ZXNcblx0XHQgKiBhbmQgQ1NTIGNsYXNzZXMuXG5cdFx0ICovXG5cdFx0cmVmcmVzaFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpbnZhbGlkLCBzZWxmID0gdGhpcztcblx0XHRcdGlmIChzZWxmLmlzUmVxdWlyZWQpIHtcblx0XHRcdFx0aWYgKHNlbGYuaXRlbXMubGVuZ3RoKSBzZWxmLmlzSW52YWxpZCA9IGZhbHNlO1xuXHRcdFx0XHRzZWxmLiRjb250cm9sX2lucHV0LnByb3AoJ3JlcXVpcmVkJywgaW52YWxpZCk7XG5cdFx0XHR9XG5cdFx0XHRzZWxmLnJlZnJlc2hDbGFzc2VzKCk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogVXBkYXRlcyBhbGwgc3RhdGUtZGVwZW5kZW50IENTUyBjbGFzc2VzLlxuXHRcdCAqL1xuXHRcdHJlZnJlc2hDbGFzc2VzOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxmICAgICA9IHRoaXM7XG5cdFx0XHR2YXIgaXNGdWxsICAgPSBzZWxmLmlzRnVsbCgpO1xuXHRcdFx0dmFyIGlzTG9ja2VkID0gc2VsZi5pc0xvY2tlZDtcblx0XG5cdFx0XHRzZWxmLiR3cmFwcGVyXG5cdFx0XHRcdC50b2dnbGVDbGFzcygncnRsJywgc2VsZi5ydGwpO1xuXHRcblx0XHRcdHNlbGYuJGNvbnRyb2xcblx0XHRcdFx0LnRvZ2dsZUNsYXNzKCdmb2N1cycsIHNlbGYuaXNGb2N1c2VkKVxuXHRcdFx0XHQudG9nZ2xlQ2xhc3MoJ2Rpc2FibGVkJywgc2VsZi5pc0Rpc2FibGVkKVxuXHRcdFx0XHQudG9nZ2xlQ2xhc3MoJ3JlcXVpcmVkJywgc2VsZi5pc1JlcXVpcmVkKVxuXHRcdFx0XHQudG9nZ2xlQ2xhc3MoJ2ludmFsaWQnLCBzZWxmLmlzSW52YWxpZClcblx0XHRcdFx0LnRvZ2dsZUNsYXNzKCdsb2NrZWQnLCBpc0xvY2tlZClcblx0XHRcdFx0LnRvZ2dsZUNsYXNzKCdmdWxsJywgaXNGdWxsKS50b2dnbGVDbGFzcygnbm90LWZ1bGwnLCAhaXNGdWxsKVxuXHRcdFx0XHQudG9nZ2xlQ2xhc3MoJ2lucHV0LWFjdGl2ZScsIHNlbGYuaXNGb2N1c2VkICYmICFzZWxmLmlzSW5wdXRIaWRkZW4pXG5cdFx0XHRcdC50b2dnbGVDbGFzcygnZHJvcGRvd24tYWN0aXZlJywgc2VsZi5pc09wZW4pXG5cdFx0XHRcdC50b2dnbGVDbGFzcygnaGFzLW9wdGlvbnMnLCAhJC5pc0VtcHR5T2JqZWN0KHNlbGYub3B0aW9ucykpXG5cdFx0XHRcdC50b2dnbGVDbGFzcygnaGFzLWl0ZW1zJywgc2VsZi5pdGVtcy5sZW5ndGggPiAwKTtcblx0XG5cdFx0XHRzZWxmLiRjb250cm9sX2lucHV0LmRhdGEoJ2dyb3cnLCAhaXNGdWxsICYmICFpc0xvY2tlZCk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCBtb3JlIGl0ZW1zIGNhbiBiZSBhZGRlZFxuXHRcdCAqIHRvIHRoZSBjb250cm9sIHdpdGhvdXQgZXhjZWVkaW5nIHRoZSB1c2VyLWRlZmluZWQgbWF4aW11bS5cblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdGlzRnVsbDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5zZXR0aW5ncy5tYXhJdGVtcyAhPT0gbnVsbCAmJiB0aGlzLml0ZW1zLmxlbmd0aCA+PSB0aGlzLnNldHRpbmdzLm1heEl0ZW1zO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJlZnJlc2hlcyB0aGUgb3JpZ2luYWwgPHNlbGVjdD4gb3IgPGlucHV0PlxuXHRcdCAqIGVsZW1lbnQgdG8gcmVmbGVjdCB0aGUgY3VycmVudCBzdGF0ZS5cblx0XHQgKi9cblx0XHR1cGRhdGVPcmlnaW5hbElucHV0OiBmdW5jdGlvbihvcHRzKSB7XG5cdFx0XHR2YXIgaSwgbiwgb3B0aW9ucywgbGFiZWwsIHNlbGYgPSB0aGlzO1xuXHRcdFx0b3B0cyA9IG9wdHMgfHwge307XG5cdFxuXHRcdFx0aWYgKHNlbGYudGFnVHlwZSA9PT0gVEFHX1NFTEVDVCkge1xuXHRcdFx0XHRvcHRpb25zID0gW107XG5cdFx0XHRcdGZvciAoaSA9IDAsIG4gPSBzZWxmLml0ZW1zLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRcdGxhYmVsID0gc2VsZi5vcHRpb25zW3NlbGYuaXRlbXNbaV1dW3NlbGYuc2V0dGluZ3MubGFiZWxGaWVsZF0gfHwgJyc7XG5cdFx0XHRcdFx0b3B0aW9ucy5wdXNoKCc8b3B0aW9uIHZhbHVlPVwiJyArIGVzY2FwZV9odG1sKHNlbGYuaXRlbXNbaV0pICsgJ1wiIHNlbGVjdGVkPVwic2VsZWN0ZWRcIj4nICsgZXNjYXBlX2h0bWwobGFiZWwpICsgJzwvb3B0aW9uPicpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghb3B0aW9ucy5sZW5ndGggJiYgIXRoaXMuJGlucHV0LmF0dHIoJ211bHRpcGxlJykpIHtcblx0XHRcdFx0XHRvcHRpb25zLnB1c2goJzxvcHRpb24gdmFsdWU9XCJcIiBzZWxlY3RlZD1cInNlbGVjdGVkXCI+PC9vcHRpb24+Jyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2VsZi4kaW5wdXQuaHRtbChvcHRpb25zLmpvaW4oJycpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlbGYuJGlucHV0LnZhbChzZWxmLmdldFZhbHVlKCkpO1xuXHRcdFx0XHRzZWxmLiRpbnB1dC5hdHRyKCd2YWx1ZScsc2VsZi4kaW5wdXQudmFsKCkpO1xuXHRcdFx0fVxuXHRcblx0XHRcdGlmIChzZWxmLmlzU2V0dXApIHtcblx0XHRcdFx0aWYgKCFvcHRzLnNpbGVudCkge1xuXHRcdFx0XHRcdHNlbGYudHJpZ2dlcignY2hhbmdlJywgc2VsZi4kaW5wdXQudmFsKCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogU2hvd3MvaGlkZSB0aGUgaW5wdXQgcGxhY2Vob2xkZXIgZGVwZW5kaW5nXG5cdFx0ICogb24gaWYgdGhlcmUgaXRlbXMgaW4gdGhlIGxpc3QgYWxyZWFkeS5cblx0XHQgKi9cblx0XHR1cGRhdGVQbGFjZWhvbGRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIXRoaXMuc2V0dGluZ3MucGxhY2Vob2xkZXIpIHJldHVybjtcblx0XHRcdHZhciAkaW5wdXQgPSB0aGlzLiRjb250cm9sX2lucHV0O1xuXHRcblx0XHRcdGlmICh0aGlzLml0ZW1zLmxlbmd0aCkge1xuXHRcdFx0XHQkaW5wdXQucmVtb3ZlQXR0cigncGxhY2Vob2xkZXInKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicsIHRoaXMuc2V0dGluZ3MucGxhY2Vob2xkZXIpO1xuXHRcdFx0fVxuXHRcdFx0JGlucHV0LnRyaWdnZXJIYW5kbGVyKCd1cGRhdGUnLCB7Zm9yY2U6IHRydWV9KTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBTaG93cyB0aGUgYXV0b2NvbXBsZXRlIGRyb3Bkb3duIGNvbnRhaW5pbmdcblx0XHQgKiB0aGUgYXZhaWxhYmxlIG9wdGlvbnMuXG5cdFx0ICovXG5cdFx0b3BlbjogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdFx0aWYgKHNlbGYuaXNMb2NrZWQgfHwgc2VsZi5pc09wZW4gfHwgKHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ211bHRpJyAmJiBzZWxmLmlzRnVsbCgpKSkgcmV0dXJuO1xuXHRcdFx0c2VsZi5mb2N1cygpO1xuXHRcdFx0c2VsZi5pc09wZW4gPSB0cnVlO1xuXHRcdFx0c2VsZi5yZWZyZXNoU3RhdGUoKTtcblx0XHRcdHNlbGYuJGRyb3Bkb3duLmNzcyh7dmlzaWJpbGl0eTogJ2hpZGRlbicsIGRpc3BsYXk6ICdibG9jayd9KTtcblx0XHRcdHNlbGYucG9zaXRpb25Ecm9wZG93bigpO1xuXHRcdFx0c2VsZi4kZHJvcGRvd24uY3NzKHt2aXNpYmlsaXR5OiAndmlzaWJsZSd9KTtcblx0XHRcdHNlbGYudHJpZ2dlcignZHJvcGRvd25fb3BlbicsIHNlbGYuJGRyb3Bkb3duKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBDbG9zZXMgdGhlIGF1dG9jb21wbGV0ZSBkcm9wZG93biBtZW51LlxuXHRcdCAqL1xuXHRcdGNsb3NlOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHZhciB0cmlnZ2VyID0gc2VsZi5pc09wZW47XG5cdFxuXHRcdFx0aWYgKHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScgJiYgc2VsZi5pdGVtcy5sZW5ndGgpIHtcblx0XHRcdFx0c2VsZi5oaWRlSW5wdXQoKTtcblx0XHRcdH1cblx0XG5cdFx0XHRzZWxmLmlzT3BlbiA9IGZhbHNlO1xuXHRcdFx0c2VsZi4kZHJvcGRvd24uaGlkZSgpO1xuXHRcdFx0c2VsZi5zZXRBY3RpdmVPcHRpb24obnVsbCk7XG5cdFx0XHRzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHRcblx0XHRcdGlmICh0cmlnZ2VyKSBzZWxmLnRyaWdnZXIoJ2Ryb3Bkb3duX2Nsb3NlJywgc2VsZi4kZHJvcGRvd24pO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIENhbGN1bGF0ZXMgYW5kIGFwcGxpZXMgdGhlIGFwcHJvcHJpYXRlXG5cdFx0ICogcG9zaXRpb24gb2YgdGhlIGRyb3Bkb3duLlxuXHRcdCAqL1xuXHRcdHBvc2l0aW9uRHJvcGRvd246IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICRjb250cm9sID0gdGhpcy4kY29udHJvbDtcblx0XHRcdHZhciBvZmZzZXQgPSB0aGlzLnNldHRpbmdzLmRyb3Bkb3duUGFyZW50ID09PSAnYm9keScgPyAkY29udHJvbC5vZmZzZXQoKSA6ICRjb250cm9sLnBvc2l0aW9uKCk7XG5cdFx0XHRvZmZzZXQudG9wICs9ICRjb250cm9sLm91dGVySGVpZ2h0KHRydWUpO1xuXHRcblx0XHRcdHRoaXMuJGRyb3Bkb3duLmNzcyh7XG5cdFx0XHRcdHdpZHRoIDogJGNvbnRyb2wub3V0ZXJXaWR0aCgpLFxuXHRcdFx0XHR0b3AgICA6IG9mZnNldC50b3AsXG5cdFx0XHRcdGxlZnQgIDogb2Zmc2V0LmxlZnRcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJlc2V0cyAvIGNsZWFycyBhbGwgc2VsZWN0ZWQgaXRlbXNcblx0XHQgKiBmcm9tIHRoZSBjb250cm9sLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSBzaWxlbnRcblx0XHQgKi9cblx0XHRjbGVhcjogZnVuY3Rpb24oc2lsZW50KSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdFx0aWYgKCFzZWxmLml0ZW1zLmxlbmd0aCkgcmV0dXJuO1xuXHRcdFx0c2VsZi4kY29udHJvbC5jaGlsZHJlbignOm5vdChpbnB1dCknKS5yZW1vdmUoKTtcblx0XHRcdHNlbGYuaXRlbXMgPSBbXTtcblx0XHRcdHNlbGYubGFzdFF1ZXJ5ID0gbnVsbDtcblx0XHRcdHNlbGYuc2V0Q2FyZXQoMCk7XG5cdFx0XHRzZWxmLnNldEFjdGl2ZUl0ZW0obnVsbCk7XG5cdFx0XHRzZWxmLnVwZGF0ZVBsYWNlaG9sZGVyKCk7XG5cdFx0XHRzZWxmLnVwZGF0ZU9yaWdpbmFsSW5wdXQoe3NpbGVudDogc2lsZW50fSk7XG5cdFx0XHRzZWxmLnJlZnJlc2hTdGF0ZSgpO1xuXHRcdFx0c2VsZi5zaG93SW5wdXQoKTtcblx0XHRcdHNlbGYudHJpZ2dlcignY2xlYXInKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBBIGhlbHBlciBtZXRob2QgZm9yIGluc2VydGluZyBhbiBlbGVtZW50XG5cdFx0ICogYXQgdGhlIGN1cnJlbnQgY2FyZXQgcG9zaXRpb24uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gJGVsXG5cdFx0ICovXG5cdFx0aW5zZXJ0QXRDYXJldDogZnVuY3Rpb24oJGVsKSB7XG5cdFx0XHR2YXIgY2FyZXQgPSBNYXRoLm1pbih0aGlzLmNhcmV0UG9zLCB0aGlzLml0ZW1zLmxlbmd0aCk7XG5cdFx0XHRpZiAoY2FyZXQgPT09IDApIHtcblx0XHRcdFx0dGhpcy4kY29udHJvbC5wcmVwZW5kKCRlbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKHRoaXMuJGNvbnRyb2xbMF0uY2hpbGROb2Rlc1tjYXJldF0pLmJlZm9yZSgkZWwpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5zZXRDYXJldChjYXJldCArIDEpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJlbW92ZXMgdGhlIGN1cnJlbnQgc2VsZWN0ZWQgaXRlbShzKS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSBlIChvcHRpb25hbClcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRkZWxldGVTZWxlY3Rpb246IGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciBpLCBuLCBkaXJlY3Rpb24sIHNlbGVjdGlvbiwgdmFsdWVzLCBjYXJldCwgb3B0aW9uX3NlbGVjdCwgJG9wdGlvbl9zZWxlY3QsICR0YWlsO1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0XHRcdGRpcmVjdGlvbiA9IChlICYmIGUua2V5Q29kZSA9PT0gS0VZX0JBQ0tTUEFDRSkgPyAtMSA6IDE7XG5cdFx0XHRzZWxlY3Rpb24gPSBnZXRTZWxlY3Rpb24oc2VsZi4kY29udHJvbF9pbnB1dFswXSk7XG5cdFxuXHRcdFx0aWYgKHNlbGYuJGFjdGl2ZU9wdGlvbiAmJiAhc2VsZi5zZXR0aW5ncy5oaWRlU2VsZWN0ZWQpIHtcblx0XHRcdFx0b3B0aW9uX3NlbGVjdCA9IHNlbGYuZ2V0QWRqYWNlbnRPcHRpb24oc2VsZi4kYWN0aXZlT3B0aW9uLCAtMSkuYXR0cignZGF0YS12YWx1ZScpO1xuXHRcdFx0fVxuXHRcblx0XHRcdC8vIGRldGVybWluZSBpdGVtcyB0aGF0IHdpbGwgYmUgcmVtb3ZlZFxuXHRcdFx0dmFsdWVzID0gW107XG5cdFxuXHRcdFx0aWYgKHNlbGYuJGFjdGl2ZUl0ZW1zLmxlbmd0aCkge1xuXHRcdFx0XHQkdGFpbCA9IHNlbGYuJGNvbnRyb2wuY2hpbGRyZW4oJy5hY3RpdmU6JyArIChkaXJlY3Rpb24gPiAwID8gJ2xhc3QnIDogJ2ZpcnN0JykpO1xuXHRcdFx0XHRjYXJldCA9IHNlbGYuJGNvbnRyb2wuY2hpbGRyZW4oJzpub3QoaW5wdXQpJykuaW5kZXgoJHRhaWwpO1xuXHRcdFx0XHRpZiAoZGlyZWN0aW9uID4gMCkgeyBjYXJldCsrOyB9XG5cdFxuXHRcdFx0XHRmb3IgKGkgPSAwLCBuID0gc2VsZi4kYWN0aXZlSXRlbXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdFx0dmFsdWVzLnB1c2goJChzZWxmLiRhY3RpdmVJdGVtc1tpXSkuYXR0cignZGF0YS12YWx1ZScpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZSkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKChzZWxmLmlzRm9jdXNlZCB8fCBzZWxmLnNldHRpbmdzLm1vZGUgPT09ICdzaW5nbGUnKSAmJiBzZWxmLml0ZW1zLmxlbmd0aCkge1xuXHRcdFx0XHRpZiAoZGlyZWN0aW9uIDwgMCAmJiBzZWxlY3Rpb24uc3RhcnQgPT09IDAgJiYgc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdHZhbHVlcy5wdXNoKHNlbGYuaXRlbXNbc2VsZi5jYXJldFBvcyAtIDFdKTtcblx0XHRcdFx0fSBlbHNlIGlmIChkaXJlY3Rpb24gPiAwICYmIHNlbGVjdGlvbi5zdGFydCA9PT0gc2VsZi4kY29udHJvbF9pbnB1dC52YWwoKS5sZW5ndGgpIHtcblx0XHRcdFx0XHR2YWx1ZXMucHVzaChzZWxmLml0ZW1zW3NlbGYuY2FyZXRQb3NdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcblx0XHRcdC8vIGFsbG93IHRoZSBjYWxsYmFjayB0byBhYm9ydFxuXHRcdFx0aWYgKCF2YWx1ZXMubGVuZ3RoIHx8ICh0eXBlb2Ygc2VsZi5zZXR0aW5ncy5vbkRlbGV0ZSA9PT0gJ2Z1bmN0aW9uJyAmJiBzZWxmLnNldHRpbmdzLm9uRGVsZXRlLmFwcGx5KHNlbGYsIFt2YWx1ZXNdKSA9PT0gZmFsc2UpKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XG5cdFx0XHQvLyBwZXJmb3JtIHJlbW92YWxcblx0XHRcdGlmICh0eXBlb2YgY2FyZXQgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHNlbGYuc2V0Q2FyZXQoY2FyZXQpO1xuXHRcdFx0fVxuXHRcdFx0d2hpbGUgKHZhbHVlcy5sZW5ndGgpIHtcblx0XHRcdFx0c2VsZi5yZW1vdmVJdGVtKHZhbHVlcy5wb3AoKSk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0c2VsZi5zaG93SW5wdXQoKTtcblx0XHRcdHNlbGYucG9zaXRpb25Ecm9wZG93bigpO1xuXHRcdFx0c2VsZi5yZWZyZXNoT3B0aW9ucyh0cnVlKTtcblx0XG5cdFx0XHQvLyBzZWxlY3QgcHJldmlvdXMgb3B0aW9uXG5cdFx0XHRpZiAob3B0aW9uX3NlbGVjdCkge1xuXHRcdFx0XHQkb3B0aW9uX3NlbGVjdCA9IHNlbGYuZ2V0T3B0aW9uKG9wdGlvbl9zZWxlY3QpO1xuXHRcdFx0XHRpZiAoJG9wdGlvbl9zZWxlY3QubGVuZ3RoKSB7XG5cdFx0XHRcdFx0c2VsZi5zZXRBY3RpdmVPcHRpb24oJG9wdGlvbl9zZWxlY3QpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogU2VsZWN0cyB0aGUgcHJldmlvdXMgLyBuZXh0IGl0ZW0gKGRlcGVuZGluZ1xuXHRcdCAqIG9uIHRoZSBgZGlyZWN0aW9uYCBhcmd1bWVudCkuXG5cdFx0ICpcblx0XHQgKiA+IDAgLSByaWdodFxuXHRcdCAqIDwgMCAtIGxlZnRcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7aW50fSBkaXJlY3Rpb25cblx0XHQgKiBAcGFyYW0ge29iamVjdH0gZSAob3B0aW9uYWwpXG5cdFx0ICovXG5cdFx0YWR2YW5jZVNlbGVjdGlvbjogZnVuY3Rpb24oZGlyZWN0aW9uLCBlKSB7XG5cdFx0XHR2YXIgdGFpbCwgc2VsZWN0aW9uLCBpZHgsIHZhbHVlTGVuZ3RoLCBjdXJzb3JBdEVkZ2UsICR0YWlsO1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09IDApIHJldHVybjtcblx0XHRcdGlmIChzZWxmLnJ0bCkgZGlyZWN0aW9uICo9IC0xO1xuXHRcblx0XHRcdHRhaWwgPSBkaXJlY3Rpb24gPiAwID8gJ2xhc3QnIDogJ2ZpcnN0Jztcblx0XHRcdHNlbGVjdGlvbiA9IGdldFNlbGVjdGlvbihzZWxmLiRjb250cm9sX2lucHV0WzBdKTtcblx0XG5cdFx0XHRpZiAoc2VsZi5pc0ZvY3VzZWQgJiYgIXNlbGYuaXNJbnB1dEhpZGRlbikge1xuXHRcdFx0XHR2YWx1ZUxlbmd0aCA9IHNlbGYuJGNvbnRyb2xfaW5wdXQudmFsKCkubGVuZ3RoO1xuXHRcdFx0XHRjdXJzb3JBdEVkZ2UgPSBkaXJlY3Rpb24gPCAwXG5cdFx0XHRcdFx0PyBzZWxlY3Rpb24uc3RhcnQgPT09IDAgJiYgc2VsZWN0aW9uLmxlbmd0aCA9PT0gMFxuXHRcdFx0XHRcdDogc2VsZWN0aW9uLnN0YXJ0ID09PSB2YWx1ZUxlbmd0aDtcblx0XG5cdFx0XHRcdGlmIChjdXJzb3JBdEVkZ2UgJiYgIXZhbHVlTGVuZ3RoKSB7XG5cdFx0XHRcdFx0c2VsZi5hZHZhbmNlQ2FyZXQoZGlyZWN0aW9uLCBlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHRhaWwgPSBzZWxmLiRjb250cm9sLmNoaWxkcmVuKCcuYWN0aXZlOicgKyB0YWlsKTtcblx0XHRcdFx0aWYgKCR0YWlsLmxlbmd0aCkge1xuXHRcdFx0XHRcdGlkeCA9IHNlbGYuJGNvbnRyb2wuY2hpbGRyZW4oJzpub3QoaW5wdXQpJykuaW5kZXgoJHRhaWwpO1xuXHRcdFx0XHRcdHNlbGYuc2V0QWN0aXZlSXRlbShudWxsKTtcblx0XHRcdFx0XHRzZWxmLnNldENhcmV0KGRpcmVjdGlvbiA+IDAgPyBpZHggKyAxIDogaWR4KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIE1vdmVzIHRoZSBjYXJldCBsZWZ0IC8gcmlnaHQuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge2ludH0gZGlyZWN0aW9uXG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IGUgKG9wdGlvbmFsKVxuXHRcdCAqL1xuXHRcdGFkdmFuY2VDYXJldDogZnVuY3Rpb24oZGlyZWN0aW9uLCBlKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXMsIGZuLCAkYWRqO1xuXHRcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09IDApIHJldHVybjtcblx0XG5cdFx0XHRmbiA9IGRpcmVjdGlvbiA+IDAgPyAnbmV4dCcgOiAncHJldic7XG5cdFx0XHRpZiAoc2VsZi5pc1NoaWZ0RG93bikge1xuXHRcdFx0XHQkYWRqID0gc2VsZi4kY29udHJvbF9pbnB1dFtmbl0oKTtcblx0XHRcdFx0aWYgKCRhZGoubGVuZ3RoKSB7XG5cdFx0XHRcdFx0c2VsZi5oaWRlSW5wdXQoKTtcblx0XHRcdFx0XHRzZWxmLnNldEFjdGl2ZUl0ZW0oJGFkaik7XG5cdFx0XHRcdFx0ZSAmJiBlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlbGYuc2V0Q2FyZXQoc2VsZi5jYXJldFBvcyArIGRpcmVjdGlvbik7XG5cdFx0XHR9XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogTW92ZXMgdGhlIGNhcmV0IHRvIHRoZSBzcGVjaWZpZWQgaW5kZXguXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge2ludH0gaVxuXHRcdCAqL1xuXHRcdHNldENhcmV0OiBmdW5jdGlvbihpKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdFx0aWYgKHNlbGYuc2V0dGluZ3MubW9kZSA9PT0gJ3NpbmdsZScpIHtcblx0XHRcdFx0aSA9IHNlbGYuaXRlbXMubGVuZ3RoO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aSA9IE1hdGgubWF4KDAsIE1hdGgubWluKHNlbGYuaXRlbXMubGVuZ3RoLCBpKSk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0aWYoIXNlbGYuaXNQZW5kaW5nKSB7XG5cdFx0XHRcdC8vIHRoZSBpbnB1dCBtdXN0IGJlIG1vdmVkIGJ5IGxlYXZpbmcgaXQgaW4gcGxhY2UgYW5kIG1vdmluZyB0aGVcblx0XHRcdFx0Ly8gc2libGluZ3MsIGR1ZSB0byB0aGUgZmFjdCB0aGF0IGZvY3VzIGNhbm5vdCBiZSByZXN0b3JlZCBvbmNlIGxvc3Rcblx0XHRcdFx0Ly8gb24gbW9iaWxlIHdlYmtpdCBkZXZpY2VzXG5cdFx0XHRcdHZhciBqLCBuLCBmbiwgJGNoaWxkcmVuLCAkY2hpbGQ7XG5cdFx0XHRcdCRjaGlsZHJlbiA9IHNlbGYuJGNvbnRyb2wuY2hpbGRyZW4oJzpub3QoaW5wdXQpJyk7XG5cdFx0XHRcdGZvciAoaiA9IDAsIG4gPSAkY2hpbGRyZW4ubGVuZ3RoOyBqIDwgbjsgaisrKSB7XG5cdFx0XHRcdFx0JGNoaWxkID0gJCgkY2hpbGRyZW5bal0pLmRldGFjaCgpO1xuXHRcdFx0XHRcdGlmIChqIDwgIGkpIHtcblx0XHRcdFx0XHRcdHNlbGYuJGNvbnRyb2xfaW5wdXQuYmVmb3JlKCRjaGlsZCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNlbGYuJGNvbnRyb2wuYXBwZW5kKCRjaGlsZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFxuXHRcdFx0c2VsZi5jYXJldFBvcyA9IGk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogRGlzYWJsZXMgdXNlciBpbnB1dCBvbiB0aGUgY29udHJvbC4gVXNlZCB3aGlsZVxuXHRcdCAqIGl0ZW1zIGFyZSBiZWluZyBhc3luY2hyb25vdXNseSBjcmVhdGVkLlxuXHRcdCAqL1xuXHRcdGxvY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdFx0dGhpcy5pc0xvY2tlZCA9IHRydWU7XG5cdFx0XHR0aGlzLnJlZnJlc2hTdGF0ZSgpO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIFJlLWVuYWJsZXMgdXNlciBpbnB1dCBvbiB0aGUgY29udHJvbC5cblx0XHQgKi9cblx0XHR1bmxvY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5pc0xvY2tlZCA9IGZhbHNlO1xuXHRcdFx0dGhpcy5yZWZyZXNoU3RhdGUoKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBEaXNhYmxlcyB1c2VyIGlucHV0IG9uIHRoZSBjb250cm9sIGNvbXBsZXRlbHkuXG5cdFx0ICogV2hpbGUgZGlzYWJsZWQsIGl0IGNhbm5vdCByZWNlaXZlIGZvY3VzLlxuXHRcdCAqL1xuXHRcdGRpc2FibGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0c2VsZi4kaW5wdXQucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRcdHNlbGYuJGNvbnRyb2xfaW5wdXQucHJvcCgnZGlzYWJsZWQnLCB0cnVlKS5wcm9wKCd0YWJpbmRleCcsIC0xKTtcblx0XHRcdHNlbGYuaXNEaXNhYmxlZCA9IHRydWU7XG5cdFx0XHRzZWxmLmxvY2soKTtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBFbmFibGVzIHRoZSBjb250cm9sIHNvIHRoYXQgaXQgY2FuIHJlc3BvbmRcblx0XHQgKiB0byBmb2N1cyBhbmQgdXNlciBpbnB1dC5cblx0XHQgKi9cblx0XHRlbmFibGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0c2VsZi4kaW5wdXQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0XHRzZWxmLiRjb250cm9sX2lucHV0LnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpLnByb3AoJ3RhYmluZGV4Jywgc2VsZi50YWJJbmRleCk7XG5cdFx0XHRzZWxmLmlzRGlzYWJsZWQgPSBmYWxzZTtcblx0XHRcdHNlbGYudW5sb2NrKCk7XG5cdFx0fSxcblx0XG5cdFx0LyoqXG5cdFx0ICogQ29tcGxldGVseSBkZXN0cm95cyB0aGUgY29udHJvbCBhbmRcblx0XHQgKiB1bmJpbmRzIGFsbCBldmVudCBsaXN0ZW5lcnMgc28gdGhhdCBpdCBjYW5cblx0XHQgKiBiZSBnYXJiYWdlIGNvbGxlY3RlZC5cblx0XHQgKi9cblx0XHRkZXN0cm95OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHZhciBldmVudE5TID0gc2VsZi5ldmVudE5TO1xuXHRcdFx0dmFyIHJldmVydFNldHRpbmdzID0gc2VsZi5yZXZlcnRTZXR0aW5ncztcblx0XG5cdFx0XHRzZWxmLnRyaWdnZXIoJ2Rlc3Ryb3knKTtcblx0XHRcdHNlbGYub2ZmKCk7XG5cdFx0XHRzZWxmLiR3cmFwcGVyLnJlbW92ZSgpO1xuXHRcdFx0c2VsZi4kZHJvcGRvd24ucmVtb3ZlKCk7XG5cdFxuXHRcdFx0c2VsZi4kaW5wdXRcblx0XHRcdFx0Lmh0bWwoJycpXG5cdFx0XHRcdC5hcHBlbmQocmV2ZXJ0U2V0dGluZ3MuJGNoaWxkcmVuKVxuXHRcdFx0XHQucmVtb3ZlQXR0cigndGFiaW5kZXgnKVxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ3NlbGVjdGl6ZWQnKVxuXHRcdFx0XHQuYXR0cih7dGFiaW5kZXg6IHJldmVydFNldHRpbmdzLnRhYmluZGV4fSlcblx0XHRcdFx0LnNob3coKTtcblx0XG5cdFx0XHRzZWxmLiRjb250cm9sX2lucHV0LnJlbW92ZURhdGEoJ2dyb3cnKTtcblx0XHRcdHNlbGYuJGlucHV0LnJlbW92ZURhdGEoJ3NlbGVjdGl6ZScpO1xuXHRcblx0XHRcdCQod2luZG93KS5vZmYoZXZlbnROUyk7XG5cdFx0XHQkKGRvY3VtZW50KS5vZmYoZXZlbnROUyk7XG5cdFx0XHQkKGRvY3VtZW50LmJvZHkpLm9mZihldmVudE5TKTtcblx0XG5cdFx0XHRkZWxldGUgc2VsZi4kaW5wdXRbMF0uc2VsZWN0aXplO1xuXHRcdH0sXG5cdFxuXHRcdC8qKlxuXHRcdCAqIEEgaGVscGVyIG1ldGhvZCBmb3IgcmVuZGVyaW5nIFwiaXRlbVwiIGFuZFxuXHRcdCAqIFwib3B0aW9uXCIgdGVtcGxhdGVzLCBnaXZlbiB0aGUgZGF0YS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZU5hbWVcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0cmVuZGVyOiBmdW5jdGlvbih0ZW1wbGF0ZU5hbWUsIGRhdGEpIHtcblx0XHRcdHZhciB2YWx1ZSwgaWQsIGxhYmVsO1xuXHRcdFx0dmFyIGh0bWwgPSAnJztcblx0XHRcdHZhciBjYWNoZSA9IGZhbHNlO1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0dmFyIHJlZ2V4X3RhZyA9IC9eW1xcdCBcXHJcXG5dKjwoW2Etel1bYS16MC05XFwtX10qKD86XFw6W2Etel1bYS16MC05XFwtX10qKT8pL2k7XG5cdFxuXHRcdFx0aWYgKHRlbXBsYXRlTmFtZSA9PT0gJ29wdGlvbicgfHwgdGVtcGxhdGVOYW1lID09PSAnaXRlbScpIHtcblx0XHRcdFx0dmFsdWUgPSBoYXNoX2tleShkYXRhW3NlbGYuc2V0dGluZ3MudmFsdWVGaWVsZF0pO1xuXHRcdFx0XHRjYWNoZSA9ICEhdmFsdWU7XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly8gcHVsbCBtYXJrdXAgZnJvbSBjYWNoZSBpZiBpdCBleGlzdHNcblx0XHRcdGlmIChjYWNoZSkge1xuXHRcdFx0XHRpZiAoIWlzc2V0KHNlbGYucmVuZGVyQ2FjaGVbdGVtcGxhdGVOYW1lXSkpIHtcblx0XHRcdFx0XHRzZWxmLnJlbmRlckNhY2hlW3RlbXBsYXRlTmFtZV0gPSB7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc2VsZi5yZW5kZXJDYWNoZVt0ZW1wbGF0ZU5hbWVdLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuXHRcdFx0XHRcdHJldHVybiBzZWxmLnJlbmRlckNhY2hlW3RlbXBsYXRlTmFtZV1bdmFsdWVdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly8gcmVuZGVyIG1hcmt1cFxuXHRcdFx0aHRtbCA9IHNlbGYuc2V0dGluZ3MucmVuZGVyW3RlbXBsYXRlTmFtZV0uYXBwbHkodGhpcywgW2RhdGEsIGVzY2FwZV9odG1sXSk7XG5cdFxuXHRcdFx0Ly8gYWRkIG1hbmRhdG9yeSBhdHRyaWJ1dGVzXG5cdFx0XHRpZiAodGVtcGxhdGVOYW1lID09PSAnb3B0aW9uJyB8fCB0ZW1wbGF0ZU5hbWUgPT09ICdvcHRpb25fY3JlYXRlJykge1xuXHRcdFx0XHRodG1sID0gaHRtbC5yZXBsYWNlKHJlZ2V4X3RhZywgJzwkMSBkYXRhLXNlbGVjdGFibGUnKTtcblx0XHRcdH1cblx0XHRcdGlmICh0ZW1wbGF0ZU5hbWUgPT09ICdvcHRncm91cCcpIHtcblx0XHRcdFx0aWQgPSBkYXRhW3NlbGYuc2V0dGluZ3Mub3B0Z3JvdXBWYWx1ZUZpZWxkXSB8fCAnJztcblx0XHRcdFx0aHRtbCA9IGh0bWwucmVwbGFjZShyZWdleF90YWcsICc8JDEgZGF0YS1ncm91cD1cIicgKyBlc2NhcGVfcmVwbGFjZShlc2NhcGVfaHRtbChpZCkpICsgJ1wiJyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGVtcGxhdGVOYW1lID09PSAnb3B0aW9uJyB8fCB0ZW1wbGF0ZU5hbWUgPT09ICdpdGVtJykge1xuXHRcdFx0XHRodG1sID0gaHRtbC5yZXBsYWNlKHJlZ2V4X3RhZywgJzwkMSBkYXRhLXZhbHVlPVwiJyArIGVzY2FwZV9yZXBsYWNlKGVzY2FwZV9odG1sKHZhbHVlIHx8ICcnKSkgKyAnXCInKTtcblx0XHRcdH1cblx0XG5cdFx0XHQvLyB1cGRhdGUgY2FjaGVcblx0XHRcdGlmIChjYWNoZSkge1xuXHRcdFx0XHRzZWxmLnJlbmRlckNhY2hlW3RlbXBsYXRlTmFtZV1bdmFsdWVdID0gaHRtbDtcblx0XHRcdH1cblx0XG5cdFx0XHRyZXR1cm4gaHRtbDtcblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBDbGVhcnMgdGhlIHJlbmRlciBjYWNoZSBmb3IgYSB0ZW1wbGF0ZS4gSWZcblx0XHQgKiBubyB0ZW1wbGF0ZSBpcyBnaXZlbiwgY2xlYXJzIGFsbCByZW5kZXJcblx0XHQgKiBjYWNoZXMuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGVOYW1lXG5cdFx0ICovXG5cdFx0Y2xlYXJDYWNoZTogZnVuY3Rpb24odGVtcGxhdGVOYW1lKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRpZiAodHlwZW9mIHRlbXBsYXRlTmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0c2VsZi5yZW5kZXJDYWNoZSA9IHt9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVsZXRlIHNlbGYucmVuZGVyQ2FjaGVbdGVtcGxhdGVOYW1lXTtcblx0XHRcdH1cblx0XHR9LFxuXHRcblx0XHQvKipcblx0XHQgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRvIGRpc3BsYXkgdGhlXG5cdFx0ICogY3JlYXRlIGl0ZW0gcHJvbXB0LCBnaXZlbiBhIHVzZXIgaW5wdXQuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gaW5wdXRcblx0XHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdGNhbkNyZWF0ZTogZnVuY3Rpb24oaW5wdXQpIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdGlmICghc2VsZi5zZXR0aW5ncy5jcmVhdGUpIHJldHVybiBmYWxzZTtcblx0XHRcdHZhciBmaWx0ZXIgPSBzZWxmLnNldHRpbmdzLmNyZWF0ZUZpbHRlcjtcblx0XHRcdHJldHVybiBpbnB1dC5sZW5ndGhcblx0XHRcdFx0JiYgKHR5cGVvZiBmaWx0ZXIgIT09ICdmdW5jdGlvbicgfHwgZmlsdGVyLmFwcGx5KHNlbGYsIFtpbnB1dF0pKVxuXHRcdFx0XHQmJiAodHlwZW9mIGZpbHRlciAhPT0gJ3N0cmluZycgfHwgbmV3IFJlZ0V4cChmaWx0ZXIpLnRlc3QoaW5wdXQpKVxuXHRcdFx0XHQmJiAoIShmaWx0ZXIgaW5zdGFuY2VvZiBSZWdFeHApIHx8IGZpbHRlci50ZXN0KGlucHV0KSk7XG5cdFx0fVxuXHRcblx0fSk7XG5cdFxuXHRcblx0U2VsZWN0aXplLmNvdW50ID0gMDtcblx0U2VsZWN0aXplLmRlZmF1bHRzID0ge1xuXHRcdG9wdGlvbnM6IFtdLFxuXHRcdG9wdGdyb3VwczogW10sXG5cdFxuXHRcdHBsdWdpbnM6IFtdLFxuXHRcdGRlbGltaXRlcjogJywnLFxuXHRcdHNwbGl0T246IG51bGwsIC8vIHJlZ2V4cCBvciBzdHJpbmcgZm9yIHNwbGl0dGluZyB1cCB2YWx1ZXMgZnJvbSBhIHBhc3RlIGNvbW1hbmRcblx0XHRwZXJzaXN0OiB0cnVlLFxuXHRcdGRpYWNyaXRpY3M6IHRydWUsXG5cdFx0Y3JlYXRlOiBmYWxzZSxcblx0XHRjcmVhdGVPbkJsdXI6IGZhbHNlLFxuXHRcdGNyZWF0ZUZpbHRlcjogbnVsbCxcblx0XHRoaWdobGlnaHQ6IHRydWUsXG5cdFx0b3Blbk9uRm9jdXM6IHRydWUsXG5cdFx0bWF4T3B0aW9uczogMTAwMCxcblx0XHRtYXhJdGVtczogbnVsbCxcblx0XHRoaWRlU2VsZWN0ZWQ6IG51bGwsXG5cdFx0YWRkUHJlY2VkZW5jZTogZmFsc2UsXG5cdFx0c2VsZWN0T25UYWI6IGZhbHNlLFxuXHRcdHByZWxvYWQ6IGZhbHNlLFxuXHRcdGFsbG93RW1wdHlPcHRpb246IGZhbHNlLFxuXHRcdGNsb3NlQWZ0ZXJTZWxlY3Q6IGZhbHNlLFxuXHRcblx0XHRzY3JvbGxEdXJhdGlvbjogNjAsXG5cdFx0bG9hZFRocm90dGxlOiAzMDAsXG5cdFx0bG9hZGluZ0NsYXNzOiAnbG9hZGluZycsXG5cdFxuXHRcdGRhdGFBdHRyOiAnZGF0YS1kYXRhJyxcblx0XHRvcHRncm91cEZpZWxkOiAnb3B0Z3JvdXAnLFxuXHRcdHZhbHVlRmllbGQ6ICd2YWx1ZScsXG5cdFx0bGFiZWxGaWVsZDogJ3RleHQnLFxuXHRcdG9wdGdyb3VwTGFiZWxGaWVsZDogJ2xhYmVsJyxcblx0XHRvcHRncm91cFZhbHVlRmllbGQ6ICd2YWx1ZScsXG5cdFx0bG9ja09wdGdyb3VwT3JkZXI6IGZhbHNlLFxuXHRcblx0XHRzb3J0RmllbGQ6ICckb3JkZXInLFxuXHRcdHNlYXJjaEZpZWxkOiBbJ3RleHQnXSxcblx0XHRzZWFyY2hDb25qdW5jdGlvbjogJ2FuZCcsXG5cdFxuXHRcdG1vZGU6IG51bGwsXG5cdFx0d3JhcHBlckNsYXNzOiAnc2VsZWN0aXplLWNvbnRyb2wnLFxuXHRcdGlucHV0Q2xhc3M6ICdzZWxlY3RpemUtaW5wdXQnLFxuXHRcdGRyb3Bkb3duQ2xhc3M6ICdzZWxlY3RpemUtZHJvcGRvd24nLFxuXHRcdGRyb3Bkb3duQ29udGVudENsYXNzOiAnc2VsZWN0aXplLWRyb3Bkb3duLWNvbnRlbnQnLFxuXHRcblx0XHRkcm9wZG93blBhcmVudDogbnVsbCxcblx0XG5cdFx0Y29weUNsYXNzZXNUb0Ryb3Bkb3duOiB0cnVlLFxuXHRcblx0XHQvKlxuXHRcdGxvYWQgICAgICAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24ocXVlcnksIGNhbGxiYWNrKSB7IC4uLiB9XG5cdFx0c2NvcmUgICAgICAgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbihzZWFyY2gpIHsgLi4uIH1cblx0XHRvbkluaXRpYWxpemUgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKCkgeyAuLi4gfVxuXHRcdG9uQ2hhbmdlICAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWUpIHsgLi4uIH1cblx0XHRvbkl0ZW1BZGQgICAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHZhbHVlLCAkaXRlbSkgeyAuLi4gfVxuXHRcdG9uSXRlbVJlbW92ZSAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWUpIHsgLi4uIH1cblx0XHRvbkNsZWFyICAgICAgICAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKCkgeyAuLi4gfVxuXHRcdG9uT3B0aW9uQWRkICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24odmFsdWUsIGRhdGEpIHsgLi4uIH1cblx0XHRvbk9wdGlvblJlbW92ZSAgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKHZhbHVlKSB7IC4uLiB9XG5cdFx0b25PcHRpb25DbGVhciAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbigpIHsgLi4uIH1cblx0XHRvbk9wdGlvbkdyb3VwQWRkICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKGlkLCBkYXRhKSB7IC4uLiB9XG5cdFx0b25PcHRpb25Hcm91cFJlbW92ZSAgOiBudWxsLCAvLyBmdW5jdGlvbihpZCkgeyAuLi4gfVxuXHRcdG9uT3B0aW9uR3JvdXBDbGVhciAgIDogbnVsbCwgLy8gZnVuY3Rpb24oKSB7IC4uLiB9XG5cdFx0b25Ecm9wZG93bk9wZW4gICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbigkZHJvcGRvd24pIHsgLi4uIH1cblx0XHRvbkRyb3Bkb3duQ2xvc2UgICAgICA6IG51bGwsIC8vIGZ1bmN0aW9uKCRkcm9wZG93bikgeyAuLi4gfVxuXHRcdG9uVHlwZSAgICAgICAgICAgICAgIDogbnVsbCwgLy8gZnVuY3Rpb24oc3RyKSB7IC4uLiB9XG5cdFx0b25EZWxldGUgICAgICAgICAgICAgOiBudWxsLCAvLyBmdW5jdGlvbih2YWx1ZXMpIHsgLi4uIH1cblx0XHQqL1xuXHRcblx0XHRyZW5kZXI6IHtcblx0XHRcdC8qXG5cdFx0XHRpdGVtOiBudWxsLFxuXHRcdFx0b3B0Z3JvdXA6IG51bGwsXG5cdFx0XHRvcHRncm91cF9oZWFkZXI6IG51bGwsXG5cdFx0XHRvcHRpb246IG51bGwsXG5cdFx0XHRvcHRpb25fY3JlYXRlOiBudWxsXG5cdFx0XHQqL1xuXHRcdH1cblx0fTtcblx0XG5cdFxuXHQkLmZuLnNlbGVjdGl6ZSA9IGZ1bmN0aW9uKHNldHRpbmdzX3VzZXIpIHtcblx0XHR2YXIgZGVmYXVsdHMgICAgICAgICAgICAgPSAkLmZuLnNlbGVjdGl6ZS5kZWZhdWx0cztcblx0XHR2YXIgc2V0dGluZ3MgICAgICAgICAgICAgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIHNldHRpbmdzX3VzZXIpO1xuXHRcdHZhciBhdHRyX2RhdGEgICAgICAgICAgICA9IHNldHRpbmdzLmRhdGFBdHRyO1xuXHRcdHZhciBmaWVsZF9sYWJlbCAgICAgICAgICA9IHNldHRpbmdzLmxhYmVsRmllbGQ7XG5cdFx0dmFyIGZpZWxkX3ZhbHVlICAgICAgICAgID0gc2V0dGluZ3MudmFsdWVGaWVsZDtcblx0XHR2YXIgZmllbGRfb3B0Z3JvdXAgICAgICAgPSBzZXR0aW5ncy5vcHRncm91cEZpZWxkO1xuXHRcdHZhciBmaWVsZF9vcHRncm91cF9sYWJlbCA9IHNldHRpbmdzLm9wdGdyb3VwTGFiZWxGaWVsZDtcblx0XHR2YXIgZmllbGRfb3B0Z3JvdXBfdmFsdWUgPSBzZXR0aW5ncy5vcHRncm91cFZhbHVlRmllbGQ7XG5cdFxuXHRcdC8qKlxuXHRcdCAqIEluaXRpYWxpemVzIHNlbGVjdGl6ZSBmcm9tIGEgPGlucHV0IHR5cGU9XCJ0ZXh0XCI+IGVsZW1lbnQuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gJGlucHV0XG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzX2VsZW1lbnRcblx0XHQgKi9cblx0XHR2YXIgaW5pdF90ZXh0Ym94ID0gZnVuY3Rpb24oJGlucHV0LCBzZXR0aW5nc19lbGVtZW50KSB7XG5cdFx0XHR2YXIgaSwgbiwgdmFsdWVzLCBvcHRpb247XG5cdFxuXHRcdFx0dmFyIGRhdGFfcmF3ID0gJGlucHV0LmF0dHIoYXR0cl9kYXRhKTtcblx0XG5cdFx0XHRpZiAoIWRhdGFfcmF3KSB7XG5cdFx0XHRcdHZhciB2YWx1ZSA9ICQudHJpbSgkaW5wdXQudmFsKCkgfHwgJycpO1xuXHRcdFx0XHRpZiAoIXNldHRpbmdzLmFsbG93RW1wdHlPcHRpb24gJiYgIXZhbHVlLmxlbmd0aCkgcmV0dXJuO1xuXHRcdFx0XHR2YWx1ZXMgPSB2YWx1ZS5zcGxpdChzZXR0aW5ncy5kZWxpbWl0ZXIpO1xuXHRcdFx0XHRmb3IgKGkgPSAwLCBuID0gdmFsdWVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRcdG9wdGlvbiA9IHt9O1xuXHRcdFx0XHRcdG9wdGlvbltmaWVsZF9sYWJlbF0gPSB2YWx1ZXNbaV07XG5cdFx0XHRcdFx0b3B0aW9uW2ZpZWxkX3ZhbHVlXSA9IHZhbHVlc1tpXTtcblx0XHRcdFx0XHRzZXR0aW5nc19lbGVtZW50Lm9wdGlvbnMucHVzaChvcHRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNldHRpbmdzX2VsZW1lbnQuaXRlbXMgPSB2YWx1ZXM7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZXR0aW5nc19lbGVtZW50Lm9wdGlvbnMgPSBKU09OLnBhcnNlKGRhdGFfcmF3KTtcblx0XHRcdFx0Zm9yIChpID0gMCwgbiA9IHNldHRpbmdzX2VsZW1lbnQub3B0aW9ucy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0XHRzZXR0aW5nc19lbGVtZW50Lml0ZW1zLnB1c2goc2V0dGluZ3NfZWxlbWVudC5vcHRpb25zW2ldW2ZpZWxkX3ZhbHVlXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcblx0XHQvKipcblx0XHQgKiBJbml0aWFsaXplcyBzZWxlY3RpemUgZnJvbSBhIDxzZWxlY3Q+IGVsZW1lbnQuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge29iamVjdH0gJGlucHV0XG5cdFx0ICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzX2VsZW1lbnRcblx0XHQgKi9cblx0XHR2YXIgaW5pdF9zZWxlY3QgPSBmdW5jdGlvbigkaW5wdXQsIHNldHRpbmdzX2VsZW1lbnQpIHtcblx0XHRcdHZhciBpLCBuLCB0YWdOYW1lLCAkY2hpbGRyZW4sIG9yZGVyID0gMDtcblx0XHRcdHZhciBvcHRpb25zID0gc2V0dGluZ3NfZWxlbWVudC5vcHRpb25zO1xuXHRcdFx0dmFyIG9wdGlvbnNNYXAgPSB7fTtcblx0XG5cdFx0XHR2YXIgcmVhZERhdGEgPSBmdW5jdGlvbigkZWwpIHtcblx0XHRcdFx0dmFyIGRhdGEgPSBhdHRyX2RhdGEgJiYgJGVsLmF0dHIoYXR0cl9kYXRhKTtcblx0XHRcdFx0aWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyAmJiBkYXRhLmxlbmd0aCkge1xuXHRcdFx0XHRcdHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fTtcblx0XG5cdFx0XHR2YXIgYWRkT3B0aW9uID0gZnVuY3Rpb24oJG9wdGlvbiwgZ3JvdXApIHtcblx0XHRcdFx0JG9wdGlvbiA9ICQoJG9wdGlvbik7XG5cdFxuXHRcdFx0XHR2YXIgdmFsdWUgPSBoYXNoX2tleSgkb3B0aW9uLmF0dHIoJ3ZhbHVlJykpO1xuXHRcdFx0XHRpZiAoIXZhbHVlICYmICFzZXR0aW5ncy5hbGxvd0VtcHR5T3B0aW9uKSByZXR1cm47XG5cdFxuXHRcdFx0XHQvLyBpZiB0aGUgb3B0aW9uIGFscmVhZHkgZXhpc3RzLCBpdCdzIHByb2JhYmx5IGJlZW5cblx0XHRcdFx0Ly8gZHVwbGljYXRlZCBpbiBhbm90aGVyIG9wdGdyb3VwLiBpbiB0aGlzIGNhc2UsIHB1c2hcblx0XHRcdFx0Ly8gdGhlIGN1cnJlbnQgZ3JvdXAgdG8gdGhlIFwib3B0Z3JvdXBcIiBwcm9wZXJ0eSBvbiB0aGVcblx0XHRcdFx0Ly8gZXhpc3Rpbmcgb3B0aW9uIHNvIHRoYXQgaXQncyByZW5kZXJlZCBpbiBib3RoIHBsYWNlcy5cblx0XHRcdFx0aWYgKG9wdGlvbnNNYXAuaGFzT3duUHJvcGVydHkodmFsdWUpKSB7XG5cdFx0XHRcdFx0aWYgKGdyb3VwKSB7XG5cdFx0XHRcdFx0XHR2YXIgYXJyID0gb3B0aW9uc01hcFt2YWx1ZV1bZmllbGRfb3B0Z3JvdXBdO1xuXHRcdFx0XHRcdFx0aWYgKCFhcnIpIHtcblx0XHRcdFx0XHRcdFx0b3B0aW9uc01hcFt2YWx1ZV1bZmllbGRfb3B0Z3JvdXBdID0gZ3JvdXA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCEkLmlzQXJyYXkoYXJyKSkge1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zTWFwW3ZhbHVlXVtmaWVsZF9vcHRncm91cF0gPSBbYXJyLCBncm91cF07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRhcnIucHVzaChncm91cCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcblx0XHRcdFx0dmFyIG9wdGlvbiAgICAgICAgICAgICA9IHJlYWREYXRhKCRvcHRpb24pIHx8IHt9O1xuXHRcdFx0XHRvcHRpb25bZmllbGRfbGFiZWxdICAgID0gb3B0aW9uW2ZpZWxkX2xhYmVsXSB8fCAkb3B0aW9uLnRleHQoKTtcblx0XHRcdFx0b3B0aW9uW2ZpZWxkX3ZhbHVlXSAgICA9IG9wdGlvbltmaWVsZF92YWx1ZV0gfHwgdmFsdWU7XG5cdFx0XHRcdG9wdGlvbltmaWVsZF9vcHRncm91cF0gPSBvcHRpb25bZmllbGRfb3B0Z3JvdXBdIHx8IGdyb3VwO1xuXHRcblx0XHRcdFx0b3B0aW9uc01hcFt2YWx1ZV0gPSBvcHRpb247XG5cdFx0XHRcdG9wdGlvbnMucHVzaChvcHRpb24pO1xuXHRcblx0XHRcdFx0aWYgKCRvcHRpb24uaXMoJzpzZWxlY3RlZCcpKSB7XG5cdFx0XHRcdFx0c2V0dGluZ3NfZWxlbWVudC5pdGVtcy5wdXNoKHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XG5cdFx0XHR2YXIgYWRkR3JvdXAgPSBmdW5jdGlvbigkb3B0Z3JvdXApIHtcblx0XHRcdFx0dmFyIGksIG4sIGlkLCBvcHRncm91cCwgJG9wdGlvbnM7XG5cdFxuXHRcdFx0XHQkb3B0Z3JvdXAgPSAkKCRvcHRncm91cCk7XG5cdFx0XHRcdGlkID0gJG9wdGdyb3VwLmF0dHIoJ2xhYmVsJyk7XG5cdFxuXHRcdFx0XHRpZiAoaWQpIHtcblx0XHRcdFx0XHRvcHRncm91cCA9IHJlYWREYXRhKCRvcHRncm91cCkgfHwge307XG5cdFx0XHRcdFx0b3B0Z3JvdXBbZmllbGRfb3B0Z3JvdXBfbGFiZWxdID0gaWQ7XG5cdFx0XHRcdFx0b3B0Z3JvdXBbZmllbGRfb3B0Z3JvdXBfdmFsdWVdID0gaWQ7XG5cdFx0XHRcdFx0c2V0dGluZ3NfZWxlbWVudC5vcHRncm91cHMucHVzaChvcHRncm91cCk7XG5cdFx0XHRcdH1cblx0XG5cdFx0XHRcdCRvcHRpb25zID0gJCgnb3B0aW9uJywgJG9wdGdyb3VwKTtcblx0XHRcdFx0Zm9yIChpID0gMCwgbiA9ICRvcHRpb25zLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRcdGFkZE9wdGlvbigkb3B0aW9uc1tpXSwgaWQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcblx0XHRcdHNldHRpbmdzX2VsZW1lbnQubWF4SXRlbXMgPSAkaW5wdXQuYXR0cignbXVsdGlwbGUnKSA/IG51bGwgOiAxO1xuXHRcblx0XHRcdCRjaGlsZHJlbiA9ICRpbnB1dC5jaGlsZHJlbigpO1xuXHRcdFx0Zm9yIChpID0gMCwgbiA9ICRjaGlsZHJlbi5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0dGFnTmFtZSA9ICRjaGlsZHJlbltpXS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdGlmICh0YWdOYW1lID09PSAnb3B0Z3JvdXAnKSB7XG5cdFx0XHRcdFx0YWRkR3JvdXAoJGNoaWxkcmVuW2ldKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0YWdOYW1lID09PSAnb3B0aW9uJykge1xuXHRcdFx0XHRcdGFkZE9wdGlvbigkY2hpbGRyZW5baV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdGlmICh0aGlzLnNlbGVjdGl6ZSkgcmV0dXJuO1xuXHRcblx0XHRcdHZhciBpbnN0YW5jZTtcblx0XHRcdHZhciAkaW5wdXQgPSAkKHRoaXMpO1xuXHRcdFx0dmFyIHRhZ19uYW1lID0gdGhpcy50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHR2YXIgcGxhY2Vob2xkZXIgPSAkaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSB8fCAkaW5wdXQuYXR0cignZGF0YS1wbGFjZWhvbGRlcicpO1xuXHRcdFx0aWYgKCFwbGFjZWhvbGRlciAmJiAhc2V0dGluZ3MuYWxsb3dFbXB0eU9wdGlvbikge1xuXHRcdFx0XHRwbGFjZWhvbGRlciA9ICRpbnB1dC5jaGlsZHJlbignb3B0aW9uW3ZhbHVlPVwiXCJdJykudGV4dCgpO1xuXHRcdFx0fVxuXHRcblx0XHRcdHZhciBzZXR0aW5nc19lbGVtZW50ID0ge1xuXHRcdFx0XHQncGxhY2Vob2xkZXInIDogcGxhY2Vob2xkZXIsXG5cdFx0XHRcdCdvcHRpb25zJyAgICAgOiBbXSxcblx0XHRcdFx0J29wdGdyb3VwcycgICA6IFtdLFxuXHRcdFx0XHQnaXRlbXMnICAgICAgIDogW11cblx0XHRcdH07XG5cdFxuXHRcdFx0aWYgKHRhZ19uYW1lID09PSAnc2VsZWN0Jykge1xuXHRcdFx0XHRpbml0X3NlbGVjdCgkaW5wdXQsIHNldHRpbmdzX2VsZW1lbnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aW5pdF90ZXh0Ym94KCRpbnB1dCwgc2V0dGluZ3NfZWxlbWVudCk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0aW5zdGFuY2UgPSBuZXcgU2VsZWN0aXplKCRpbnB1dCwgJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBzZXR0aW5nc19lbGVtZW50LCBzZXR0aW5nc191c2VyKSk7XG5cdFx0fSk7XG5cdH07XG5cdFxuXHQkLmZuLnNlbGVjdGl6ZS5kZWZhdWx0cyA9IFNlbGVjdGl6ZS5kZWZhdWx0cztcblx0JC5mbi5zZWxlY3RpemUuc3VwcG9ydCA9IHtcblx0XHR2YWxpZGl0eTogU1VQUE9SVFNfVkFMSURJVFlfQVBJXG5cdH07XG5cdFxuXHRcblx0U2VsZWN0aXplLmRlZmluZSgnZHJhZ19kcm9wJywgZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdGlmICghJC5mbi5zb3J0YWJsZSkgdGhyb3cgbmV3IEVycm9yKCdUaGUgXCJkcmFnX2Ryb3BcIiBwbHVnaW4gcmVxdWlyZXMgalF1ZXJ5IFVJIFwic29ydGFibGVcIi4nKTtcblx0XHRpZiAodGhpcy5zZXR0aW5ncy5tb2RlICE9PSAnbXVsdGknKSByZXR1cm47XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0XHRzZWxmLmxvY2sgPSAoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgb3JpZ2luYWwgPSBzZWxmLmxvY2s7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBzb3J0YWJsZSA9IHNlbGYuJGNvbnRyb2wuZGF0YSgnc29ydGFibGUnKTtcblx0XHRcdFx0aWYgKHNvcnRhYmxlKSBzb3J0YWJsZS5kaXNhYmxlKCk7XG5cdFx0XHRcdHJldHVybiBvcmlnaW5hbC5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXHRcdFx0fTtcblx0XHR9KSgpO1xuXHRcblx0XHRzZWxmLnVubG9jayA9IChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBvcmlnaW5hbCA9IHNlbGYudW5sb2NrO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgc29ydGFibGUgPSBzZWxmLiRjb250cm9sLmRhdGEoJ3NvcnRhYmxlJyk7XG5cdFx0XHRcdGlmIChzb3J0YWJsZSkgc29ydGFibGUuZW5hYmxlKCk7XG5cdFx0XHRcdHJldHVybiBvcmlnaW5hbC5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXHRcdFx0fTtcblx0XHR9KSgpO1xuXHRcblx0XHRzZWxmLnNldHVwID0gKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gc2VsZi5zZXR1cDtcblx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdFx0b3JpZ2luYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XG5cdFx0XHRcdHZhciAkY29udHJvbCA9IHNlbGYuJGNvbnRyb2wuc29ydGFibGUoe1xuXHRcdFx0XHRcdGl0ZW1zOiAnW2RhdGEtdmFsdWVdJyxcblx0XHRcdFx0XHRmb3JjZVBsYWNlaG9sZGVyU2l6ZTogdHJ1ZSxcblx0XHRcdFx0XHRkaXNhYmxlZDogc2VsZi5pc0xvY2tlZCxcblx0XHRcdFx0XHRzdGFydDogZnVuY3Rpb24oZSwgdWkpIHtcblx0XHRcdFx0XHRcdHVpLnBsYWNlaG9sZGVyLmNzcygnd2lkdGgnLCB1aS5oZWxwZXIuY3NzKCd3aWR0aCcpKTtcblx0XHRcdFx0XHRcdCRjb250cm9sLmNzcyh7b3ZlcmZsb3c6ICd2aXNpYmxlJ30pO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c3RvcDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkY29udHJvbC5jc3Moe292ZXJmbG93OiAnaGlkZGVuJ30pO1xuXHRcdFx0XHRcdFx0dmFyIGFjdGl2ZSA9IHNlbGYuJGFjdGl2ZUl0ZW1zID8gc2VsZi4kYWN0aXZlSXRlbXMuc2xpY2UoKSA6IG51bGw7XG5cdFx0XHRcdFx0XHR2YXIgdmFsdWVzID0gW107XG5cdFx0XHRcdFx0XHQkY29udHJvbC5jaGlsZHJlbignW2RhdGEtdmFsdWVdJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0dmFsdWVzLnB1c2goJCh0aGlzKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRzZWxmLnNldFZhbHVlKHZhbHVlcyk7XG5cdFx0XHRcdFx0XHRzZWxmLnNldEFjdGl2ZUl0ZW0oYWN0aXZlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblx0XHR9KSgpO1xuXHRcblx0fSk7XG5cdFxuXHRTZWxlY3RpemUuZGVmaW5lKCdkcm9wZG93bl9oZWFkZXInLCBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0XHRvcHRpb25zID0gJC5leHRlbmQoe1xuXHRcdFx0dGl0bGUgICAgICAgICA6ICdVbnRpdGxlZCcsXG5cdFx0XHRoZWFkZXJDbGFzcyAgIDogJ3NlbGVjdGl6ZS1kcm9wZG93bi1oZWFkZXInLFxuXHRcdFx0dGl0bGVSb3dDbGFzcyA6ICdzZWxlY3RpemUtZHJvcGRvd24taGVhZGVyLXRpdGxlJyxcblx0XHRcdGxhYmVsQ2xhc3MgICAgOiAnc2VsZWN0aXplLWRyb3Bkb3duLWhlYWRlci1sYWJlbCcsXG5cdFx0XHRjbG9zZUNsYXNzICAgIDogJ3NlbGVjdGl6ZS1kcm9wZG93bi1oZWFkZXItY2xvc2UnLFxuXHRcblx0XHRcdGh0bWw6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cIicgKyBkYXRhLmhlYWRlckNsYXNzICsgJ1wiPicgK1xuXHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCInICsgZGF0YS50aXRsZVJvd0NsYXNzICsgJ1wiPicgK1xuXHRcdFx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCInICsgZGF0YS5sYWJlbENsYXNzICsgJ1wiPicgKyBkYXRhLnRpdGxlICsgJzwvc3Bhbj4nICtcblx0XHRcdFx0XHRcdFx0JzxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBjbGFzcz1cIicgKyBkYXRhLmNsb3NlQ2xhc3MgKyAnXCI+JnRpbWVzOzwvYT4nICtcblx0XHRcdFx0XHRcdCc8L2Rpdj4nICtcblx0XHRcdFx0XHQnPC9kaXY+J1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0sIG9wdGlvbnMpO1xuXHRcblx0XHRzZWxmLnNldHVwID0gKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gc2VsZi5zZXR1cDtcblx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdFx0b3JpZ2luYWwuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcblx0XHRcdFx0c2VsZi4kZHJvcGRvd25faGVhZGVyID0gJChvcHRpb25zLmh0bWwob3B0aW9ucykpO1xuXHRcdFx0XHRzZWxmLiRkcm9wZG93bi5wcmVwZW5kKHNlbGYuJGRyb3Bkb3duX2hlYWRlcik7XG5cdFx0XHR9O1xuXHRcdH0pKCk7XG5cdFxuXHR9KTtcblx0XG5cdFNlbGVjdGl6ZS5kZWZpbmUoJ29wdGdyb3VwX2NvbHVtbnMnLCBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcblx0XHRvcHRpb25zID0gJC5leHRlbmQoe1xuXHRcdFx0ZXF1YWxpemVXaWR0aCAgOiB0cnVlLFxuXHRcdFx0ZXF1YWxpemVIZWlnaHQgOiB0cnVlXG5cdFx0fSwgb3B0aW9ucyk7XG5cdFxuXHRcdHRoaXMuZ2V0QWRqYWNlbnRPcHRpb24gPSBmdW5jdGlvbigkb3B0aW9uLCBkaXJlY3Rpb24pIHtcblx0XHRcdHZhciAkb3B0aW9ucyA9ICRvcHRpb24uY2xvc2VzdCgnW2RhdGEtZ3JvdXBdJykuZmluZCgnW2RhdGEtc2VsZWN0YWJsZV0nKTtcblx0XHRcdHZhciBpbmRleCAgICA9ICRvcHRpb25zLmluZGV4KCRvcHRpb24pICsgZGlyZWN0aW9uO1xuXHRcblx0XHRcdHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgJG9wdGlvbnMubGVuZ3RoID8gJG9wdGlvbnMuZXEoaW5kZXgpIDogJCgpO1xuXHRcdH07XG5cdFxuXHRcdHRoaXMub25LZXlEb3duID0gKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gc2VsZi5vbktleURvd247XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oZSkge1xuXHRcdFx0XHR2YXIgaW5kZXgsICRvcHRpb24sICRvcHRpb25zLCAkb3B0Z3JvdXA7XG5cdFxuXHRcdFx0XHRpZiAodGhpcy5pc09wZW4gJiYgKGUua2V5Q29kZSA9PT0gS0VZX0xFRlQgfHwgZS5rZXlDb2RlID09PSBLRVlfUklHSFQpKSB7XG5cdFx0XHRcdFx0c2VsZi5pZ25vcmVIb3ZlciA9IHRydWU7XG5cdFx0XHRcdFx0JG9wdGdyb3VwID0gdGhpcy4kYWN0aXZlT3B0aW9uLmNsb3Nlc3QoJ1tkYXRhLWdyb3VwXScpO1xuXHRcdFx0XHRcdGluZGV4ID0gJG9wdGdyb3VwLmZpbmQoJ1tkYXRhLXNlbGVjdGFibGVdJykuaW5kZXgodGhpcy4kYWN0aXZlT3B0aW9uKTtcblx0XG5cdFx0XHRcdFx0aWYoZS5rZXlDb2RlID09PSBLRVlfTEVGVCkge1xuXHRcdFx0XHRcdFx0JG9wdGdyb3VwID0gJG9wdGdyb3VwLnByZXYoJ1tkYXRhLWdyb3VwXScpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkb3B0Z3JvdXAgPSAkb3B0Z3JvdXAubmV4dCgnW2RhdGEtZ3JvdXBdJyk7XG5cdFx0XHRcdFx0fVxuXHRcblx0XHRcdFx0XHQkb3B0aW9ucyA9ICRvcHRncm91cC5maW5kKCdbZGF0YS1zZWxlY3RhYmxlXScpO1xuXHRcdFx0XHRcdCRvcHRpb24gID0gJG9wdGlvbnMuZXEoTWF0aC5taW4oJG9wdGlvbnMubGVuZ3RoIC0gMSwgaW5kZXgpKTtcblx0XHRcdFx0XHRpZiAoJG9wdGlvbi5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2V0QWN0aXZlT3B0aW9uKCRvcHRpb24pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XG5cdFx0XHRcdHJldHVybiBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0fTtcblx0XHR9KSgpO1xuXHRcblx0XHR2YXIgZ2V0U2Nyb2xsYmFyV2lkdGggPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBkaXY7XG5cdFx0XHR2YXIgd2lkdGggPSBnZXRTY3JvbGxiYXJXaWR0aC53aWR0aDtcblx0XHRcdHZhciBkb2MgPSBkb2N1bWVudDtcblx0XG5cdFx0XHRpZiAodHlwZW9mIHdpZHRoID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRkaXYgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGRpdi5pbm5lckhUTUwgPSAnPGRpdiBzdHlsZT1cIndpZHRoOjUwcHg7aGVpZ2h0OjUwcHg7cG9zaXRpb246YWJzb2x1dGU7bGVmdDotNTBweDt0b3A6LTUwcHg7b3ZlcmZsb3c6YXV0bztcIj48ZGl2IHN0eWxlPVwid2lkdGg6MXB4O2hlaWdodDoxMDBweDtcIj48L2Rpdj48L2Rpdj4nO1xuXHRcdFx0XHRkaXYgPSBkaXYuZmlyc3RDaGlsZDtcblx0XHRcdFx0ZG9jLmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcblx0XHRcdFx0d2lkdGggPSBnZXRTY3JvbGxiYXJXaWR0aC53aWR0aCA9IGRpdi5vZmZzZXRXaWR0aCAtIGRpdi5jbGllbnRXaWR0aDtcblx0XHRcdFx0ZG9jLmJvZHkucmVtb3ZlQ2hpbGQoZGl2KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB3aWR0aDtcblx0XHR9O1xuXHRcblx0XHR2YXIgZXF1YWxpemVTaXplcyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGksIG4sIGhlaWdodF9tYXgsIHdpZHRoLCB3aWR0aF9sYXN0LCB3aWR0aF9wYXJlbnQsICRvcHRncm91cHM7XG5cdFxuXHRcdFx0JG9wdGdyb3VwcyA9ICQoJ1tkYXRhLWdyb3VwXScsIHNlbGYuJGRyb3Bkb3duX2NvbnRlbnQpO1xuXHRcdFx0biA9ICRvcHRncm91cHMubGVuZ3RoO1xuXHRcdFx0aWYgKCFuIHx8ICFzZWxmLiRkcm9wZG93bl9jb250ZW50LndpZHRoKCkpIHJldHVybjtcblx0XG5cdFx0XHRpZiAob3B0aW9ucy5lcXVhbGl6ZUhlaWdodCkge1xuXHRcdFx0XHRoZWlnaHRfbWF4ID0gMDtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRcdGhlaWdodF9tYXggPSBNYXRoLm1heChoZWlnaHRfbWF4LCAkb3B0Z3JvdXBzLmVxKGkpLmhlaWdodCgpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkb3B0Z3JvdXBzLmNzcyh7aGVpZ2h0OiBoZWlnaHRfbWF4fSk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0aWYgKG9wdGlvbnMuZXF1YWxpemVXaWR0aCkge1xuXHRcdFx0XHR3aWR0aF9wYXJlbnQgPSBzZWxmLiRkcm9wZG93bl9jb250ZW50LmlubmVyV2lkdGgoKSAtIGdldFNjcm9sbGJhcldpZHRoKCk7XG5cdFx0XHRcdHdpZHRoID0gTWF0aC5yb3VuZCh3aWR0aF9wYXJlbnQgLyBuKTtcblx0XHRcdFx0JG9wdGdyb3Vwcy5jc3Moe3dpZHRoOiB3aWR0aH0pO1xuXHRcdFx0XHRpZiAobiA+IDEpIHtcblx0XHRcdFx0XHR3aWR0aF9sYXN0ID0gd2lkdGhfcGFyZW50IC0gd2lkdGggKiAobiAtIDEpO1xuXHRcdFx0XHRcdCRvcHRncm91cHMuZXEobiAtIDEpLmNzcyh7d2lkdGg6IHdpZHRoX2xhc3R9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFxuXHRcdGlmIChvcHRpb25zLmVxdWFsaXplSGVpZ2h0IHx8IG9wdGlvbnMuZXF1YWxpemVXaWR0aCkge1xuXHRcdFx0aG9vay5hZnRlcih0aGlzLCAncG9zaXRpb25Ecm9wZG93bicsIGVxdWFsaXplU2l6ZXMpO1xuXHRcdFx0aG9vay5hZnRlcih0aGlzLCAncmVmcmVzaE9wdGlvbnMnLCBlcXVhbGl6ZVNpemVzKTtcblx0XHR9XG5cdFxuXHRcblx0fSk7XG5cdFxuXHRTZWxlY3RpemUuZGVmaW5lKCdyZW1vdmVfYnV0dG9uJywgZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdGlmICh0aGlzLnNldHRpbmdzLm1vZGUgPT09ICdzaW5nbGUnKSByZXR1cm47XG5cdFxuXHRcdG9wdGlvbnMgPSAkLmV4dGVuZCh7XG5cdFx0XHRsYWJlbCAgICAgOiAnJnRpbWVzOycsXG5cdFx0XHR0aXRsZSAgICAgOiAnUmVtb3ZlJyxcblx0XHRcdGNsYXNzTmFtZSA6ICdyZW1vdmUnLFxuXHRcdFx0YXBwZW5kICAgIDogdHJ1ZVxuXHRcdH0sIG9wdGlvbnMpO1xuXHRcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0dmFyIGh0bWwgPSAnPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiIGNsYXNzPVwiJyArIG9wdGlvbnMuY2xhc3NOYW1lICsgJ1wiIHRhYmluZGV4PVwiLTFcIiB0aXRsZT1cIicgKyBlc2NhcGVfaHRtbChvcHRpb25zLnRpdGxlKSArICdcIj4nICsgb3B0aW9ucy5sYWJlbCArICc8L2E+Jztcblx0XG5cdFx0LyoqXG5cdFx0ICogQXBwZW5kcyBhbiBlbGVtZW50IGFzIGEgY2hpbGQgKHdpdGggcmF3IEhUTUwpLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGh0bWxfY29udGFpbmVyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IGh0bWxfZWxlbWVudFxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ31cblx0XHQgKi9cblx0XHR2YXIgYXBwZW5kID0gZnVuY3Rpb24oaHRtbF9jb250YWluZXIsIGh0bWxfZWxlbWVudCkge1xuXHRcdFx0dmFyIHBvcyA9IGh0bWxfY29udGFpbmVyLnNlYXJjaCgvKDxcXC9bXj5dKz5cXHMqKSQvKTtcblx0XHRcdHJldHVybiBodG1sX2NvbnRhaW5lci5zdWJzdHJpbmcoMCwgcG9zKSArIGh0bWxfZWxlbWVudCArIGh0bWxfY29udGFpbmVyLnN1YnN0cmluZyhwb3MpO1xuXHRcdH07XG5cdFxuXHRcdHRoaXMuc2V0dXAgPSAoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgb3JpZ2luYWwgPSBzZWxmLnNldHVwO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBvdmVycmlkZSB0aGUgaXRlbSByZW5kZXJpbmcgbWV0aG9kIHRvIGFkZCB0aGUgYnV0dG9uIHRvIGVhY2hcblx0XHRcdFx0aWYgKG9wdGlvbnMuYXBwZW5kKSB7XG5cdFx0XHRcdFx0dmFyIHJlbmRlcl9pdGVtID0gc2VsZi5zZXR0aW5ncy5yZW5kZXIuaXRlbTtcblx0XHRcdFx0XHRzZWxmLnNldHRpbmdzLnJlbmRlci5pdGVtID0gZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGFwcGVuZChyZW5kZXJfaXRlbS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBodG1sKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFxuXHRcdFx0XHRvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcblx0XHRcdFx0Ly8gYWRkIGV2ZW50IGxpc3RlbmVyXG5cdFx0XHRcdHRoaXMuJGNvbnRyb2wub24oJ2NsaWNrJywgJy4nICsgb3B0aW9ucy5jbGFzc05hbWUsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0aWYgKHNlbGYuaXNMb2NrZWQpIHJldHVybjtcblx0XG5cdFx0XHRcdFx0dmFyICRpdGVtID0gJChlLmN1cnJlbnRUYXJnZXQpLnBhcmVudCgpO1xuXHRcdFx0XHRcdHNlbGYuc2V0QWN0aXZlSXRlbSgkaXRlbSk7XG5cdFx0XHRcdFx0aWYgKHNlbGYuZGVsZXRlU2VsZWN0aW9uKCkpIHtcblx0XHRcdFx0XHRcdHNlbGYuc2V0Q2FyZXQoc2VsZi5pdGVtcy5sZW5ndGgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFxuXHRcdFx0fTtcblx0XHR9KSgpO1xuXHRcblx0fSk7XG5cdFxuXHRTZWxlY3RpemUuZGVmaW5lKCdyZXN0b3JlX29uX2JhY2tzcGFjZScsIGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFxuXHRcdG9wdGlvbnMudGV4dCA9IG9wdGlvbnMudGV4dCB8fCBmdW5jdGlvbihvcHRpb24pIHtcblx0XHRcdHJldHVybiBvcHRpb25bdGhpcy5zZXR0aW5ncy5sYWJlbEZpZWxkXTtcblx0XHR9O1xuXHRcblx0XHR0aGlzLm9uS2V5RG93biA9IChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBvcmlnaW5hbCA9IHNlbGYub25LZXlEb3duO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0dmFyIGluZGV4LCBvcHRpb247XG5cdFx0XHRcdGlmIChlLmtleUNvZGUgPT09IEtFWV9CQUNLU1BBQ0UgJiYgdGhpcy4kY29udHJvbF9pbnB1dC52YWwoKSA9PT0gJycgJiYgIXRoaXMuJGFjdGl2ZUl0ZW1zLmxlbmd0aCkge1xuXHRcdFx0XHRcdGluZGV4ID0gdGhpcy5jYXJldFBvcyAtIDE7XG5cdFx0XHRcdFx0aWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0b3B0aW9uID0gdGhpcy5vcHRpb25zW3RoaXMuaXRlbXNbaW5kZXhdXTtcblx0XHRcdFx0XHRcdGlmICh0aGlzLmRlbGV0ZVNlbGVjdGlvbihlKSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnNldFRleHRib3hWYWx1ZShvcHRpb25zLnRleHQuYXBwbHkodGhpcywgW29wdGlvbl0pKTtcblx0XHRcdFx0XHRcdFx0dGhpcy5yZWZyZXNoT3B0aW9ucyh0cnVlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHR9O1xuXHRcdH0pKCk7XG5cdH0pO1xuXHRcblxuXHRyZXR1cm4gU2VsZWN0aXplO1xufSkpO1xuIl19