'use strict';

const util         = require('util')
		, _            = require('lodash')
		, EventEmitter = require('eventemitter2').EventEmitter2
		, callback     = require('./callback');

function FrontendConnection() {
	EventEmitter.call(this, {
		wildcard: true
	});
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

/**
 *
 * @param url
 * @param cb
 */
FrontendConnection.prototype.getResourceContent = function getResourceContent(url, cb) {
	var id = this._callback.wrap(cb)
		, payload = JSON.stringify({
			id: id,
			method: 'Page.getResourceContent',
			params: {
				frameId: 'nodeinspector-toplevel-frame',
				url: url
			}
		});

	this.emit('message', payload);
};

/**
 *
 * @param scriptId
 * @param cb
 */
FrontendConnection.prototype.getScriptSource = function getScriptSource(scriptId, cb) {
	var id      = this._callback.wrap(cb)
		, payload = JSON.stringify({
			id: id,
			method: 'Debugger.getScriptSource',
			params: {
				scriptId: scriptId
			}
		});

	this.emit('message', payload);
};

/**
 *
 * @param cb
 */
FrontendConnection.prototype.getProperties = function getProperties(cb) {
	var id = this._callback.wrap(cb)
		, payload = JSON.stringify({
			id: id,
			method: 'Runtime.getProperties',
			params: {
				objectId: 'scope:0:0',
				ownProperties: false,
				accessorPropertiesOnly: false
			}
		});

	this.emit('message', payload);
};

/**
 *
 * @param cb
 */
FrontendConnection.prototype.stepInto = function stepInto(cb) {
	var done = _.after(2, complete)
		, id = this._callback.wrap(done)
		, payload = JSON.stringify({
				id: id,
				method: 'Debugger.stepInto'
			});

	function complete(response) {
		cb(response.params.callFrames);
	}

	this.once('debugger.paused', done);

	this.emit('message', payload);
};

/**
 *
 * @param cb
 */
FrontendConnection.prototype.stepOut = function stepInto(cb) {
	var done = _.after(2, complete)
		, id = this._callback.wrap(done)
		, payload = JSON.stringify({
			id: id,
			method: 'Debugger.stepOut'
		});

	function complete(response) {
		cb(response.params.callFrames);
	}

	this.once('debugger.paused', done);

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

	if (!id) {
		// this is an event
		var dotCase = require('dot-case')
			, method  = dotCase(message.method);

		//console.log('** %s **', method);

		this.emit(method, message);
	} else {
		if (message.result) {
			args.push(message.result);
		}

		this._callback.processResponse.apply(null, args);
	}
};

module.exports = FrontendConnection;

