"use strict";

define(["./core", "./data/var/dataPriv", "./deferred", "./callbacks"], function (jQuery, dataPriv) {

	jQuery.extend({
		queue: function queue(elem, type, data) {
			var queue;

			if (elem) {
				type = (type || "fx") + "queue";
				queue = dataPriv.get(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || jQuery.isArray(data)) {
						queue = dataPriv.access(elem, type, jQuery.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function dequeue(elem, type) {
			type = type || "fx";

			var queue = jQuery.queue(elem, type),
			    startLength = queue.length,
			    fn = queue.shift(),
			    hooks = jQuery._queueHooks(elem, type),
			    next = function next() {
				jQuery.dequeue(elem, type);
			};

			// If the fx queue is dequeued, always remove the progress sentinel
			if (fn === "inprogress") {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if (type === "fx") {
					queue.unshift("inprogress");
				}

				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call(elem, next, hooks);
			}

			if (!startLength && hooks) {
				hooks.empty.fire();
			}
		},

		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function _queueHooks(elem, type) {
			var key = type + "queueHooks";
			return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
				empty: jQuery.Callbacks("once memory").add(function () {
					dataPriv.remove(elem, [type + "queue", key]);
				})
			});
		}
	});

	jQuery.fn.extend({
		queue: function queue(type, data) {
			var setter = 2;

			if (typeof type !== "string") {
				data = type;
				type = "fx";
				setter--;
			}

			if (arguments.length < setter) {
				return jQuery.queue(this[0], type);
			}

			return data === undefined ? this : this.each(function () {
				var queue = jQuery.queue(this, type, data);

				// Ensure a hooks for this queue
				jQuery._queueHooks(this, type);

				if (type === "fx" && queue[0] !== "inprogress") {
					jQuery.dequeue(this, type);
				}
			});
		},
		dequeue: function dequeue(type) {
			return this.each(function () {
				jQuery.dequeue(this, type);
			});
		},
		clearQueue: function clearQueue(type) {
			return this.queue(type || "fx", []);
		},

		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function promise(type, obj) {
			var tmp,
			    count = 1,
			    defer = jQuery.Deferred(),
			    elements = this,
			    i = this.length,
			    resolve = function resolve() {
				if (! --count) {
					defer.resolveWith(elements, [elements]);
				}
			};

			if (typeof type !== "string") {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while (i--) {
				tmp = dataPriv.get(elements[i], type + "queueHooks");
				if (tmp && tmp.empty) {
					count++;
					tmp.empty.add(resolve);
				}
			}
			resolve();
			return defer.promise(obj);
		}
	});

	return jQuery;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvanF1ZXJ5L3NyYy9xdWV1ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQVEsQ0FDUCxRQURPLEVBRVAscUJBRk8sRUFHUCxZQUhPLEVBSVAsYUFKTyxDQUFSLEVBS0csVUFBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTZCOztBQUVoQyxRQUFPLE1BQVAsQ0FBZTtBQUNkLFNBQU8sZUFBVSxJQUFWLEVBQWdCLElBQWhCLEVBQXNCLElBQXRCLEVBQTZCO0FBQ25DLE9BQUksS0FBSixDQURtQzs7QUFHbkMsT0FBSyxJQUFMLEVBQVk7QUFDWCxXQUFPLENBQUUsUUFBUSxJQUFSLENBQUYsR0FBbUIsT0FBbkIsQ0FESTtBQUVYLFlBQVEsU0FBUyxHQUFULENBQWMsSUFBZCxFQUFvQixJQUFwQixDQUFSOzs7QUFGVyxRQUtOLElBQUwsRUFBWTtBQUNYLFNBQUssQ0FBQyxLQUFELElBQVUsT0FBTyxPQUFQLENBQWdCLElBQWhCLENBQVYsRUFBbUM7QUFDdkMsY0FBUSxTQUFTLE1BQVQsQ0FBaUIsSUFBakIsRUFBdUIsSUFBdkIsRUFBNkIsT0FBTyxTQUFQLENBQWtCLElBQWxCLENBQTdCLENBQVIsQ0FEdUM7TUFBeEMsTUFFTztBQUNOLFlBQU0sSUFBTixDQUFZLElBQVosRUFETTtNQUZQO0tBREQ7QUFPQSxXQUFPLFNBQVMsRUFBVCxDQVpJO0lBQVo7R0FITTs7QUFtQlAsV0FBUyxpQkFBVSxJQUFWLEVBQWdCLElBQWhCLEVBQXVCO0FBQy9CLFVBQU8sUUFBUSxJQUFSLENBRHdCOztBQUcvQixPQUFJLFFBQVEsT0FBTyxLQUFQLENBQWMsSUFBZCxFQUFvQixJQUFwQixDQUFSO09BQ0gsY0FBYyxNQUFNLE1BQU47T0FDZCxLQUFLLE1BQU0sS0FBTixFQUFMO09BQ0EsUUFBUSxPQUFPLFdBQVAsQ0FBb0IsSUFBcEIsRUFBMEIsSUFBMUIsQ0FBUjtPQUNBLE9BQU8sU0FBUCxJQUFPLEdBQVc7QUFDakIsV0FB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O0lBRFMsQ0FObUI7O0FBWTlCLE9BQUssT0FBTyxJQUFQLEtBQWdCLFFBQWhCLEVBQTJCO0FBQy9CLFVBQU0sSUFBTixDQUQrQjtBQUUvQixXQUFPLFNBQVAsQ0FGK0I7SUFBaEM7QUFJQSxVQUFPLFFBQVEsSUFBUixDQWhCdUI7O0FBa0I5QixVQUFRLEdBQVIsRUFBYztBQUNiLFVBQU0sU0FBUyxHQUFULENBQWMsU0FBVSxDQUFWLENBQWQsRUFBNkIsT0FBTyxZQUFQLENBQW5DLENBRGE7QUFFYixRQUFLLE9BQU8sSUFBSSxLQUFKLEVBQVk7QUFDdkIsYUFEdUI7QUFFdkIsU0FBSSxLQUFKLENBQVUsR0FBVixDQUFlLE9BQWYsRUFGdUI7S0FBeEI7SUFGRDtBQU9BLGFBekI4QjtBQTBCOUIsVUFBTyxNQUFNLE9BQU4sQ0FBZSxHQUFmLENBQVAsQ0ExQjhCO0dBQXRCO0VBdENWLEVBcEVnQzs7QUF3SWhDLFFBQU8sTUFBUCxDQXhJZ0M7Q0FBN0IsQ0FMSCIsImZpbGUiOiJxdWV1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSggW1xuXHRcIi4vY29yZVwiLFxuXHRcIi4vZGF0YS92YXIvZGF0YVByaXZcIixcblx0XCIuL2RlZmVycmVkXCIsXG5cdFwiLi9jYWxsYmFja3NcIlxuXSwgZnVuY3Rpb24oIGpRdWVyeSwgZGF0YVByaXYgKSB7XG5cbmpRdWVyeS5leHRlbmQoIHtcblx0cXVldWU6IGZ1bmN0aW9uKCBlbGVtLCB0eXBlLCBkYXRhICkge1xuXHRcdHZhciBxdWV1ZTtcblxuXHRcdGlmICggZWxlbSApIHtcblx0XHRcdHR5cGUgPSAoIHR5cGUgfHwgXCJmeFwiICkgKyBcInF1ZXVlXCI7XG5cdFx0XHRxdWV1ZSA9IGRhdGFQcml2LmdldCggZWxlbSwgdHlwZSApO1xuXG5cdFx0XHQvLyBTcGVlZCB1cCBkZXF1ZXVlIGJ5IGdldHRpbmcgb3V0IHF1aWNrbHkgaWYgdGhpcyBpcyBqdXN0IGEgbG9va3VwXG5cdFx0XHRpZiAoIGRhdGEgKSB7XG5cdFx0XHRcdGlmICggIXF1ZXVlIHx8IGpRdWVyeS5pc0FycmF5KCBkYXRhICkgKSB7XG5cdFx0XHRcdFx0cXVldWUgPSBkYXRhUHJpdi5hY2Nlc3MoIGVsZW0sIHR5cGUsIGpRdWVyeS5tYWtlQXJyYXkoIGRhdGEgKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHF1ZXVlLnB1c2goIGRhdGEgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHF1ZXVlIHx8IFtdO1xuXHRcdH1cblx0fSxcblxuXHRkZXF1ZXVlOiBmdW5jdGlvbiggZWxlbSwgdHlwZSApIHtcblx0XHR0eXBlID0gdHlwZSB8fCBcImZ4XCI7XG5cblx0XHR2YXIgcXVldWUgPSBqUXVlcnkucXVldWUoIGVsZW0sIHR5cGUgKSxcblx0XHRcdHN0YXJ0TGVuZ3RoID0gcXVldWUubGVuZ3RoLFxuXHRcdFx0Zm4gPSBxdWV1ZS5zaGlmdCgpLFxuXHRcdFx0aG9va3MgPSBqUXVlcnkuX3F1ZXVlSG9va3MoIGVsZW0sIHR5cGUgKSxcblx0XHRcdG5leHQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0alF1ZXJ5LmRlcXVldWUoIGVsZW0sIHR5cGUgKTtcblx0XHRcdH07XG5cblx0XHQvLyBJZiB0aGUgZnggcXVldWUgaXMgZGVxdWV1ZWQsIGFsd2F5cyByZW1vdmUgdGhlIHByb2dyZXNzIHNlbnRpbmVsXG5cdFx0aWYgKCBmbiA9PT0gXCJpbnByb2dyZXNzXCIgKSB7XG5cdFx0XHRmbiA9IHF1ZXVlLnNoaWZ0KCk7XG5cdFx0XHRzdGFydExlbmd0aC0tO1xuXHRcdH1cblxuXHRcdGlmICggZm4gKSB7XG5cblx0XHRcdC8vIEFkZCBhIHByb2dyZXNzIHNlbnRpbmVsIHRvIHByZXZlbnQgdGhlIGZ4IHF1ZXVlIGZyb20gYmVpbmdcblx0XHRcdC8vIGF1dG9tYXRpY2FsbHkgZGVxdWV1ZWRcblx0XHRcdGlmICggdHlwZSA9PT0gXCJmeFwiICkge1xuXHRcdFx0XHRxdWV1ZS51bnNoaWZ0KCBcImlucHJvZ3Jlc3NcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDbGVhciB1cCB0aGUgbGFzdCBxdWV1ZSBzdG9wIGZ1bmN0aW9uXG5cdFx0XHRkZWxldGUgaG9va3Muc3RvcDtcblx0XHRcdGZuLmNhbGwoIGVsZW0sIG5leHQsIGhvb2tzICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAhc3RhcnRMZW5ndGggJiYgaG9va3MgKSB7XG5cdFx0XHRob29rcy5lbXB0eS5maXJlKCk7XG5cdFx0fVxuXHR9LFxuXG5cdC8vIE5vdCBwdWJsaWMgLSBnZW5lcmF0ZSBhIHF1ZXVlSG9va3Mgb2JqZWN0LCBvciByZXR1cm4gdGhlIGN1cnJlbnQgb25lXG5cdF9xdWV1ZUhvb2tzOiBmdW5jdGlvbiggZWxlbSwgdHlwZSApIHtcblx0XHR2YXIga2V5ID0gdHlwZSArIFwicXVldWVIb29rc1wiO1xuXHRcdHJldHVybiBkYXRhUHJpdi5nZXQoIGVsZW0sIGtleSApIHx8IGRhdGFQcml2LmFjY2VzcyggZWxlbSwga2V5LCB7XG5cdFx0XHRlbXB0eTogalF1ZXJ5LkNhbGxiYWNrcyggXCJvbmNlIG1lbW9yeVwiICkuYWRkKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZGF0YVByaXYucmVtb3ZlKCBlbGVtLCBbIHR5cGUgKyBcInF1ZXVlXCIsIGtleSBdICk7XG5cdFx0XHR9IClcblx0XHR9ICk7XG5cdH1cbn0gKTtcblxualF1ZXJ5LmZuLmV4dGVuZCgge1xuXHRxdWV1ZTogZnVuY3Rpb24oIHR5cGUsIGRhdGEgKSB7XG5cdFx0dmFyIHNldHRlciA9IDI7XG5cblx0XHRpZiAoIHR5cGVvZiB0eXBlICE9PSBcInN0cmluZ1wiICkge1xuXHRcdFx0ZGF0YSA9IHR5cGU7XG5cdFx0XHR0eXBlID0gXCJmeFwiO1xuXHRcdFx0c2V0dGVyLS07XG5cdFx0fVxuXG5cdFx0aWYgKCBhcmd1bWVudHMubGVuZ3RoIDwgc2V0dGVyICkge1xuXHRcdFx0cmV0dXJuIGpRdWVyeS5xdWV1ZSggdGhpc1sgMCBdLCB0eXBlICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGEgPT09IHVuZGVmaW5lZCA/XG5cdFx0XHR0aGlzIDpcblx0XHRcdHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBxdWV1ZSA9IGpRdWVyeS5xdWV1ZSggdGhpcywgdHlwZSwgZGF0YSApO1xuXG5cdFx0XHRcdC8vIEVuc3VyZSBhIGhvb2tzIGZvciB0aGlzIHF1ZXVlXG5cdFx0XHRcdGpRdWVyeS5fcXVldWVIb29rcyggdGhpcywgdHlwZSApO1xuXG5cdFx0XHRcdGlmICggdHlwZSA9PT0gXCJmeFwiICYmIHF1ZXVlWyAwIF0gIT09IFwiaW5wcm9ncmVzc1wiICkge1xuXHRcdFx0XHRcdGpRdWVyeS5kZXF1ZXVlKCB0aGlzLCB0eXBlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0fSxcblx0ZGVxdWV1ZTogZnVuY3Rpb24oIHR5cGUgKSB7XG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkuZGVxdWV1ZSggdGhpcywgdHlwZSApO1xuXHRcdH0gKTtcblx0fSxcblx0Y2xlYXJRdWV1ZTogZnVuY3Rpb24oIHR5cGUgKSB7XG5cdFx0cmV0dXJuIHRoaXMucXVldWUoIHR5cGUgfHwgXCJmeFwiLCBbXSApO1xuXHR9LFxuXG5cdC8vIEdldCBhIHByb21pc2UgcmVzb2x2ZWQgd2hlbiBxdWV1ZXMgb2YgYSBjZXJ0YWluIHR5cGVcblx0Ly8gYXJlIGVtcHRpZWQgKGZ4IGlzIHRoZSB0eXBlIGJ5IGRlZmF1bHQpXG5cdHByb21pc2U6IGZ1bmN0aW9uKCB0eXBlLCBvYmogKSB7XG5cdFx0dmFyIHRtcCxcblx0XHRcdGNvdW50ID0gMSxcblx0XHRcdGRlZmVyID0galF1ZXJ5LkRlZmVycmVkKCksXG5cdFx0XHRlbGVtZW50cyA9IHRoaXMsXG5cdFx0XHRpID0gdGhpcy5sZW5ndGgsXG5cdFx0XHRyZXNvbHZlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggISggLS1jb3VudCApICkge1xuXHRcdFx0XHRcdGRlZmVyLnJlc29sdmVXaXRoKCBlbGVtZW50cywgWyBlbGVtZW50cyBdICk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRpZiAoIHR5cGVvZiB0eXBlICE9PSBcInN0cmluZ1wiICkge1xuXHRcdFx0b2JqID0gdHlwZTtcblx0XHRcdHR5cGUgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdHR5cGUgPSB0eXBlIHx8IFwiZnhcIjtcblxuXHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0dG1wID0gZGF0YVByaXYuZ2V0KCBlbGVtZW50c1sgaSBdLCB0eXBlICsgXCJxdWV1ZUhvb2tzXCIgKTtcblx0XHRcdGlmICggdG1wICYmIHRtcC5lbXB0eSApIHtcblx0XHRcdFx0Y291bnQrKztcblx0XHRcdFx0dG1wLmVtcHR5LmFkZCggcmVzb2x2ZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXNvbHZlKCk7XG5cdFx0cmV0dXJuIGRlZmVyLnByb21pc2UoIG9iaiApO1xuXHR9XG59ICk7XG5cbnJldHVybiBqUXVlcnk7XG59ICk7XG4iXX0=