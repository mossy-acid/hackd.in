'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var checkGlobal = require('./_checkGlobal');

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal((typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal((typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(_typeof(undefined) == 'object' && undefined);

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

module.exports = root;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvbG9kYXNoL19yb290LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFkOzs7QUFHSixJQUFJLGFBQWEsWUFBWSxRQUFPLHVEQUFQLElBQWlCLFFBQWpCLElBQTZCLE1BQTdCLENBQXpCOzs7QUFHSixJQUFJLFdBQVcsWUFBWSxRQUFPLG1EQUFQLElBQWUsUUFBZixJQUEyQixJQUEzQixDQUF2Qjs7O0FBR0osSUFBSSxhQUFhLFlBQVksc0JBQWUsUUFBZixhQUFaLENBQWI7OztBQUdKLElBQUksT0FBTyxjQUFjLFFBQWQsSUFBMEIsVUFBMUIsSUFBd0MsU0FBUyxhQUFULEdBQXhDOztBQUVYLE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJfcm9vdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjaGVja0dsb2JhbCA9IHJlcXVpcmUoJy4vX2NoZWNrR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IGNoZWNrR2xvYmFsKHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IGNoZWNrR2xvYmFsKHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYpO1xuXG4vKiogRGV0ZWN0IGB0aGlzYCBhcyB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciB0aGlzR2xvYmFsID0gY2hlY2tHbG9iYWwodHlwZW9mIHRoaXMgPT0gJ29iamVjdCcgJiYgdGhpcyk7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IHRoaXNHbG9iYWwgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIl19