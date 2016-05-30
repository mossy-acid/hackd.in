"use strict";

define(["./core", "./var/slice", "./callbacks"], function (jQuery, slice) {

	jQuery.extend({

		Deferred: function Deferred(func) {
			var tuples = [

			// action, add listener, listener list, final state
			["resolve", "done", jQuery.Callbacks("once memory"), "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"], ["notify", "progress", jQuery.Callbacks("memory")]],
			    _state = "pending",
			    _promise = {
				state: function state() {
					return _state;
				},
				always: function always() {
					deferred.done(arguments).fail(arguments);
					return this;
				},
				then: function then() /* fnDone, fnFail, fnProgress */{
					var fns = arguments;
					return jQuery.Deferred(function (newDefer) {
						jQuery.each(tuples, function (i, tuple) {
							var fn = jQuery.isFunction(fns[i]) && fns[i];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[tuple[1]](function () {
								var returned = fn && fn.apply(this, arguments);
								if (returned && jQuery.isFunction(returned.promise)) {
									returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
								} else {
									newDefer[tuple[0] + "With"](this === _promise ? newDefer.promise() : this, fn ? [returned] : arguments);
								}
							});
						});
						fns = null;
					}).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function promise(obj) {
					return obj != null ? jQuery.extend(obj, _promise) : _promise;
				}
			},
			    deferred = {};

			// Keep pipe for back-compat
			_promise.pipe = _promise.then;

			// Add list-specific methods
			jQuery.each(tuples, function (i, tuple) {
				var list = tuple[2],
				    stateString = tuple[3];

				// promise[ done | fail | progress ] = list.add
				_promise[tuple[1]] = list.add;

				// Handle state
				if (stateString) {
					list.add(function () {

						// state = [ resolved | rejected ]
						_state = stateString;

						// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[i ^ 1][2].disable, tuples[2][2].lock);
				}

				// deferred[ resolve | reject | notify ]
				deferred[tuple[0]] = function () {
					deferred[tuple[0] + "With"](this === deferred ? _promise : this, arguments);
					return this;
				};
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			// Make the deferred a promise
			_promise.promise(deferred);

			// Call given func if any
			if (func) {
				func.call(deferred, deferred);
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function when(subordinate /* , ..., subordinateN */) {
			var i = 0,
			    resolveValues = slice.call(arguments),
			    length = resolveValues.length,


			// the count of uncompleted subordinates
			remaining = length !== 1 || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0,


			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),


			// Update function for both resolve and progress values
			updateFunc = function updateFunc(i, contexts, values) {
				return function (value) {
					contexts[i] = this;
					values[i] = arguments.length > 1 ? slice.call(arguments) : value;
					if (values === progressValues) {
						deferred.notifyWith(contexts, values);
					} else if (! --remaining) {
						deferred.resolveWith(contexts, values);
					}
				};
			},
			    progressValues,
			    progressContexts,
			    resolveContexts;

			// Add listeners to Deferred subordinates; treat others as resolved
			if (length > 1) {
				progressValues = new Array(length);
				progressContexts = new Array(length);
				resolveContexts = new Array(length);
				for (; i < length; i++) {
					if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
						resolveValues[i].promise().progress(updateFunc(i, progressContexts, progressValues)).done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject);
					} else {
						--remaining;
					}
				}
			}

			// If we're not waiting on anything, resolve the master
			if (!remaining) {
				deferred.resolveWith(resolveContexts, resolveValues);
			}

			return deferred.promise();
		}
	});

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9kZWZlcnJlZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQVEsQ0FDUCxRQURPLEVBRVAsYUFGTyxFQUdQLGFBSE8sQ0FBUixFQUlHLFVBQVUsTUFBVixFQUFrQixLQUFsQixFQUEwQjs7QUFFN0IsUUFBTyxNQUFQLENBQWU7O0FBRWQsWUFBVSxrQkFBVSxJQUFWLEVBQWlCO0FBQzFCLE9BQUksU0FBUzs7O0FBR1gsSUFBRSxTQUFGLEVBQWEsTUFBYixFQUFxQixPQUFPLFNBQVAsQ0FBa0IsYUFBbEIsQ0FBckIsRUFBd0QsVUFBeEQsQ0FIVyxFQUlYLENBQUUsUUFBRixFQUFZLE1BQVosRUFBb0IsT0FBTyxTQUFQLENBQWtCLGFBQWxCLENBQXBCLEVBQXVELFVBQXZELENBSlcsRUFLWCxDQUFFLFFBQUYsRUFBWSxVQUFaLEVBQXdCLE9BQU8sU0FBUCxDQUFrQixRQUFsQixDQUF4QixDQUxXLENBQWI7T0FPQyxTQUFRLFNBUFQ7T0FRQyxXQUFVO0FBQ1QsV0FBTyxpQkFBVztBQUNqQixZQUFPLE1BQVA7QUFDQSxLQUhRO0FBSVQsWUFBUSxrQkFBVztBQUNsQixjQUFTLElBQVQsQ0FBZSxTQUFmLEVBQTJCLElBQTNCLENBQWlDLFNBQWpDO0FBQ0EsWUFBTyxJQUFQO0FBQ0EsS0FQUTtBQVFULFVBQU0sZ0IsZ0NBQTZDO0FBQ2xELFNBQUksTUFBTSxTQUFWO0FBQ0EsWUFBTyxPQUFPLFFBQVAsQ0FBaUIsVUFBVSxRQUFWLEVBQXFCO0FBQzVDLGFBQU8sSUFBUCxDQUFhLE1BQWIsRUFBcUIsVUFBVSxDQUFWLEVBQWEsS0FBYixFQUFxQjtBQUN6QyxXQUFJLEtBQUssT0FBTyxVQUFQLENBQW1CLElBQUssQ0FBTCxDQUFuQixLQUFpQyxJQUFLLENBQUwsQ0FBMUM7OztBQUdBLGdCQUFVLE1BQU8sQ0FBUCxDQUFWLEVBQXdCLFlBQVc7QUFDbEMsWUFBSSxXQUFXLE1BQU0sR0FB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LGVBQVMsV0FBVCxDQUFzQixRQUF0QixFQUFnQyxNQUFoQztBQUNBO0FBQ0QsS0FSRDtBQVNBLElBdkJGO09BeUJDLGNBekJEO09BeUJpQixnQkF6QmpCO09BeUJtQyxlQXpCbkM7OztBQTRCQSxPQUFLLFNBQVMsQ0FBZCxFQUFrQjtBQUNqQixxQkFBaUIsSUFBSSxLQUFKLENBQVcsTUFBWCxDQUFqQjtBQUNBLHVCQUFtQixJQUFJLEtBQUosQ0FBVyxNQUFYLENBQW5CO0FBQ0Esc0JBQWtCLElBQUksS0FBSixDQUFXLE1BQVgsQ0FBbEI7QUFDQSxXQUFRLElBQUksTUFBWixFQUFvQixHQUFwQixFQUEwQjtBQUN6QixTQUFLLGNBQWUsQ0FBZixLQUFzQixPQUFPLFVBQVAsQ0FBbUIsY0FBZSxDQUFmLEVBQW1CLE9BQXRDLENBQTNCLEVBQTZFO0FBQzVFLG9CQUFlLENBQWYsRUFBbUIsT0FBbkIsR0FDRSxRQURGLENBQ1ksV0FBWSxDQUFaLEVBQWUsZ0JBQWYsRUFBaUMsY0FBakMsQ0FEWixFQUVFLElBRkYsQ0FFUSxXQUFZLENBQVosRUFBZSxlQUFmLEVBQWdDLGFBQWhDLENBRlIsRUFHRSxJQUhGLENBR1EsU0FBUyxNQUhqQjtBQUlBLE1BTEQsTUFLTztBQUNOLFFBQUUsU0FBRjtBQUNBO0FBQ0Q7QUFDRDs7O0FBR0QsT0FBSyxDQUFDLFNBQU4sRUFBa0I7QUFDakIsYUFBUyxXQUFULENBQXNCLGVBQXRCLEVBQXVDLGFBQXZDO0FBQ0E7O0FBRUQsVUFBTyxTQUFTLE9BQVQsRUFBUDtBQUNBO0FBbkphLEVBQWY7O0FBc0pBLFFBQU8sTUFBUDtBQUNDLENBN0pEIiwiZmlsZSI6ImRlZmVycmVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCBbXG5cdFwiLi9jb3JlXCIsXG5cdFwiLi92YXIvc2xpY2VcIixcblx0XCIuL2NhbGxiYWNrc1wiXG5dLCBmdW5jdGlvbiggalF1ZXJ5LCBzbGljZSApIHtcblxualF1ZXJ5LmV4dGVuZCgge1xuXG5cdERlZmVycmVkOiBmdW5jdGlvbiggZnVuYyApIHtcblx0XHR2YXIgdHVwbGVzID0gW1xuXG5cdFx0XHRcdC8vIGFjdGlvbiwgYWRkIGxpc3RlbmVyLCBsaXN0ZW5lciBsaXN0LCBmaW5hbCBzdGF0ZVxuXHRcdFx0XHRbIFwicmVzb2x2ZVwiLCBcImRvbmVcIiwgalF1ZXJ5LkNhbGxiYWNrcyggXCJvbmNlIG1lbW9yeVwiICksIFwicmVzb2x2ZWRcIiBdLFxuXHRcdFx0XHRbIFwicmVqZWN0XCIsIFwiZmFpbFwiLCBqUXVlcnkuQ2FsbGJhY2tzKCBcIm9uY2UgbWVtb3J5XCIgKSwgXCJyZWplY3RlZFwiIF0sXG5cdFx0XHRcdFsgXCJub3RpZnlcIiwgXCJwcm9ncmVzc1wiLCBqUXVlcnkuQ2FsbGJhY2tzKCBcIm1lbW9yeVwiICkgXVxuXHRcdFx0XSxcblx0XHRcdHN0YXRlID0gXCJwZW5kaW5nXCIsXG5cdFx0XHRwcm9taXNlID0ge1xuXHRcdFx0XHRzdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHN0YXRlO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRhbHdheXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGRlZmVycmVkLmRvbmUoIGFyZ3VtZW50cyApLmZhaWwoIGFyZ3VtZW50cyApO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aGVuOiBmdW5jdGlvbiggLyogZm5Eb25lLCBmbkZhaWwsIGZuUHJvZ3Jlc3MgKi8gKSB7XG5cdFx0XHRcdFx0dmFyIGZucyA9IGFyZ3VtZW50cztcblx0XHRcdFx0XHRyZXR1cm4galF1ZXJ5LkRlZmVycmVkKCBmdW5jdGlvbiggbmV3RGVmZXIgKSB7XG5cdFx0XHRcdFx0XHRqUXVlcnkuZWFjaCggdHVwbGVzLCBmdW5jdGlvbiggaSwgdHVwbGUgKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBmbiA9IGpRdWVyeS5pc0Z1bmN0aW9uKCBmbnNbIGkgXSApICYmIGZuc1sgaSBdO1xuXG5cdFx0XHRcdFx0XHRcdC8vIGRlZmVycmVkWyBkb25lIHwgZmFpbCB8IHByb2dyZXNzIF0gZm9yIGZvcndhcmRpbmcgYWN0aW9ucyB0byBuZXdEZWZlclxuXHRcdFx0XHRcdFx0XHRkZWZlcnJlZFsgdHVwbGVbIDEgXSBdKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgcmV0dXJuZWQgPSBmbiAmJiBmbi5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKCByZXR1cm5lZCAmJiBqUXVlcnkuaXNGdW5jdGlvbiggcmV0dXJuZWQucHJvbWlzZSApICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuZWQucHJvbWlzZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5wcm9ncmVzcyggbmV3RGVmZXIubm90aWZ5IClcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmRvbmUoIG5ld0RlZmVyLnJlc29sdmUgKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuZmFpbCggbmV3RGVmZXIucmVqZWN0ICk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdG5ld0RlZmVyWyB0dXBsZVsgMCBdICsgXCJXaXRoXCIgXShcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcyA9PT0gcHJvbWlzZSA/IG5ld0RlZmVyLnByb21pc2UoKSA6IHRoaXMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZuID8gWyByZXR1cm5lZCBdIDogYXJndW1lbnRzXG5cdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSApO1xuXHRcdFx0XHRcdFx0fSApO1xuXHRcdFx0XHRcdFx0Zm5zID0gbnVsbDtcblx0XHRcdFx0XHR9ICkucHJvbWlzZSgpO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8vIEdldCBhIHByb21pc2UgZm9yIHRoaXMgZGVmZXJyZWRcblx0XHRcdFx0Ly8gSWYgb2JqIGlzIHByb3ZpZGVkLCB0aGUgcHJvbWlzZSBhc3BlY3QgaXMgYWRkZWQgdG8gdGhlIG9iamVjdFxuXHRcdFx0XHRwcm9taXNlOiBmdW5jdGlvbiggb2JqICkge1xuXHRcdFx0XHRcdHJldHVybiBvYmogIT0gbnVsbCA/IGpRdWVyeS5leHRlbmQoIG9iaiwgcHJvbWlzZSApIDogcHJvbWlzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGRlZmVycmVkID0ge307XG5cblx0XHQvLyBLZWVwIHBpcGUgZm9yIGJhY2stY29tcGF0XG5cdFx0cHJvbWlzZS5waXBlID0gcHJvbWlzZS50aGVuO1xuXG5cdFx0Ly8gQWRkIGxpc3Qtc3BlY2lmaWMgbWV0aG9kc1xuXHRcdGpRdWVyeS5lYWNoKCB0dXBsZXMsIGZ1bmN0aW9uKCBpLCB0dXBsZSApIHtcblx0XHRcdHZhciBsaXN0ID0gdHVwbGVbIDIgXSxcblx0XHRcdFx0c3RhdGVTdHJpbmcgPSB0dXBsZVsgMyBdO1xuXG5cdFx0XHQvLyBwcm9taXNlWyBkb25lIHwgZmFpbCB8IHByb2dyZXNzIF0gPSBsaXN0LmFkZFxuXHRcdFx0cHJvbWlzZVsgdHVwbGVbIDEgXSBdID0gbGlzdC5hZGQ7XG5cblx0XHRcdC8vIEhhbmRsZSBzdGF0ZVxuXHRcdFx0aWYgKCBzdGF0ZVN0cmluZyApIHtcblx0XHRcdFx0bGlzdC5hZGQoIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdFx0Ly8gc3RhdGUgPSBbIHJlc29sdmVkIHwgcmVqZWN0ZWQgXVxuXHRcdFx0XHRcdHN0YXRlID0gc3RhdGVTdHJpbmc7XG5cblx0XHRcdFx0Ly8gWyByZWplY3RfbGlzdCB8IHJlc29sdmVfbGlzdCBdLmRpc2FibGU7IHByb2dyZXNzX2xpc3QubG9ja1xuXHRcdFx0XHR9LCB0dXBsZXNbIGkgXiAxIF1bIDIgXS5kaXNhYmxlLCB0dXBsZXNbIDIgXVsgMiBdLmxvY2sgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gZGVmZXJyZWRbIHJlc29sdmUgfCByZWplY3QgfCBub3RpZnkgXVxuXHRcdFx0ZGVmZXJyZWRbIHR1cGxlWyAwIF0gXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRkZWZlcnJlZFsgdHVwbGVbIDAgXSArIFwiV2l0aFwiIF0oIHRoaXMgPT09IGRlZmVycmVkID8gcHJvbWlzZSA6IHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH07XG5cdFx0XHRkZWZlcnJlZFsgdHVwbGVbIDAgXSArIFwiV2l0aFwiIF0gPSBsaXN0LmZpcmVXaXRoO1xuXHRcdH0gKTtcblxuXHRcdC8vIE1ha2UgdGhlIGRlZmVycmVkIGEgcHJvbWlzZVxuXHRcdHByb21pc2UucHJvbWlzZSggZGVmZXJyZWQgKTtcblxuXHRcdC8vIENhbGwgZ2l2ZW4gZnVuYyBpZiBhbnlcblx0XHRpZiAoIGZ1bmMgKSB7XG5cdFx0XHRmdW5jLmNhbGwoIGRlZmVycmVkLCBkZWZlcnJlZCApO1xuXHRcdH1cblxuXHRcdC8vIEFsbCBkb25lIVxuXHRcdHJldHVybiBkZWZlcnJlZDtcblx0fSxcblxuXHQvLyBEZWZlcnJlZCBoZWxwZXJcblx0d2hlbjogZnVuY3Rpb24oIHN1Ym9yZGluYXRlIC8qICwgLi4uLCBzdWJvcmRpbmF0ZU4gKi8gKSB7XG5cdFx0dmFyIGkgPSAwLFxuXHRcdFx0cmVzb2x2ZVZhbHVlcyA9IHNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuXHRcdFx0bGVuZ3RoID0gcmVzb2x2ZVZhbHVlcy5sZW5ndGgsXG5cblx0XHRcdC8vIHRoZSBjb3VudCBvZiB1bmNvbXBsZXRlZCBzdWJvcmRpbmF0ZXNcblx0XHRcdHJlbWFpbmluZyA9IGxlbmd0aCAhPT0gMSB8fFxuXHRcdFx0XHQoIHN1Ym9yZGluYXRlICYmIGpRdWVyeS5pc0Z1bmN0aW9uKCBzdWJvcmRpbmF0ZS5wcm9taXNlICkgKSA/IGxlbmd0aCA6IDAsXG5cblx0XHRcdC8vIHRoZSBtYXN0ZXIgRGVmZXJyZWQuXG5cdFx0XHQvLyBJZiByZXNvbHZlVmFsdWVzIGNvbnNpc3Qgb2Ygb25seSBhIHNpbmdsZSBEZWZlcnJlZCwganVzdCB1c2UgdGhhdC5cblx0XHRcdGRlZmVycmVkID0gcmVtYWluaW5nID09PSAxID8gc3Vib3JkaW5hdGUgOiBqUXVlcnkuRGVmZXJyZWQoKSxcblxuXHRcdFx0Ly8gVXBkYXRlIGZ1bmN0aW9uIGZvciBib3RoIHJlc29sdmUgYW5kIHByb2dyZXNzIHZhbHVlc1xuXHRcdFx0dXBkYXRlRnVuYyA9IGZ1bmN0aW9uKCBpLCBjb250ZXh0cywgdmFsdWVzICkge1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdFx0XHRcdGNvbnRleHRzWyBpIF0gPSB0aGlzO1xuXHRcdFx0XHRcdHZhbHVlc1sgaSBdID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBzbGljZS5jYWxsKCBhcmd1bWVudHMgKSA6IHZhbHVlO1xuXHRcdFx0XHRcdGlmICggdmFsdWVzID09PSBwcm9ncmVzc1ZhbHVlcyApIHtcblx0XHRcdFx0XHRcdGRlZmVycmVkLm5vdGlmeVdpdGgoIGNvbnRleHRzLCB2YWx1ZXMgKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAhKCAtLXJlbWFpbmluZyApICkge1xuXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZVdpdGgoIGNvbnRleHRzLCB2YWx1ZXMgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9LFxuXG5cdFx0XHRwcm9ncmVzc1ZhbHVlcywgcHJvZ3Jlc3NDb250ZXh0cywgcmVzb2x2ZUNvbnRleHRzO1xuXG5cdFx0Ly8gQWRkIGxpc3RlbmVycyB0byBEZWZlcnJlZCBzdWJvcmRpbmF0ZXM7IHRyZWF0IG90aGVycyBhcyByZXNvbHZlZFxuXHRcdGlmICggbGVuZ3RoID4gMSApIHtcblx0XHRcdHByb2dyZXNzVmFsdWVzID0gbmV3IEFycmF5KCBsZW5ndGggKTtcblx0XHRcdHByb2dyZXNzQ29udGV4dHMgPSBuZXcgQXJyYXkoIGxlbmd0aCApO1xuXHRcdFx0cmVzb2x2ZUNvbnRleHRzID0gbmV3IEFycmF5KCBsZW5ndGggKTtcblx0XHRcdGZvciAoIDsgaSA8IGxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRpZiAoIHJlc29sdmVWYWx1ZXNbIGkgXSAmJiBqUXVlcnkuaXNGdW5jdGlvbiggcmVzb2x2ZVZhbHVlc1sgaSBdLnByb21pc2UgKSApIHtcblx0XHRcdFx0XHRyZXNvbHZlVmFsdWVzWyBpIF0ucHJvbWlzZSgpXG5cdFx0XHRcdFx0XHQucHJvZ3Jlc3MoIHVwZGF0ZUZ1bmMoIGksIHByb2dyZXNzQ29udGV4dHMsIHByb2dyZXNzVmFsdWVzICkgKVxuXHRcdFx0XHRcdFx0LmRvbmUoIHVwZGF0ZUZ1bmMoIGksIHJlc29sdmVDb250ZXh0cywgcmVzb2x2ZVZhbHVlcyApIClcblx0XHRcdFx0XHRcdC5mYWlsKCBkZWZlcnJlZC5yZWplY3QgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQtLXJlbWFpbmluZztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIElmIHdlJ3JlIG5vdCB3YWl0aW5nIG9uIGFueXRoaW5nLCByZXNvbHZlIHRoZSBtYXN0ZXJcblx0XHRpZiAoICFyZW1haW5pbmcgKSB7XG5cdFx0XHRkZWZlcnJlZC5yZXNvbHZlV2l0aCggcmVzb2x2ZUNvbnRleHRzLCByZXNvbHZlVmFsdWVzICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcblx0fVxufSApO1xuXG5yZXR1cm4galF1ZXJ5O1xufSApO1xuIl19