'use strict';

/**
 * Create a callback container
 * @return {Object} that wraps callbacks and returns a one-time id.
 */
module.exports = function() {
	var lastId = 1,
		callbacks = {};

	return {
		wrap: function(callback) {
			var callbackId = lastId++;
			callbacks[callbackId] = callback || function() {};
			return callbackId;
		},
		processResponse: function(callbackId) {
			var callback = callbacks[callbackId]
				, args     = Array.prototype.slice.call(arguments);

			args = args.slice(1);

			if (callback) {
				callback.apply(null, args);
			}

			delete callbacks[callbackId];
		}
	};
};
