'use strict';

const util       = require('util')
	, EventEmitter = require('events')
	, callback     = require('./callback');

function FrontendConnection() {
	EventEmitter.call(this);
	this._callback = callback();
}

util.inherits(FrontendConnection, EventEmitter);

/**
 *ee
 * @param cb
 */
FrontendConnection.prototype.startup = function startup(cb) {
	var id      = this._callback.wrap(cb)
		, payload = JSON.stringify({ id: id, method: 'Debugger.enable' });

	this.emit('message', payload);
};

/**
 *
 * @param cb
 */
FrontendConnection.prototype.getResourceTree = function getResourceTree(cb) {
	var id      = this._callback.wrap(cb)
		, payload = JSON.stringify({ id: id, method: 'Page.getResourceTree' });

	this.emit('message', payload);
};

/// More methods to come .... also need to sort out what we do with events!!!

/**
 * Do not call this method .... it's badly named and is called
 * by the internals of node-inspectors FrontendClient implementation.
 */
FrontendConnection.prototype.send = function send(payload) {
	var message = JSON.parse(payload)
		, id      = message.id
		, args    = [ id ];

	if (id) {
		if (message.result) {
			args.push(message.result);
		}

		this._callback.processResponse.apply(null, args);
	}
};

module.exports = FrontendConnection;

