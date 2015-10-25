'use strict';

// This will eventually be removed it's merely here for righteous hackery!!!

const Session            = require('./lib/session')
		, FrontendConnection = require('./iface/frontend-connection');

var connection = new FrontendConnection()
	, session    = new Session({}, 5858, connection);

function debuggerEvent(payload) {
	// console.log('%s fired', this.event);
}

// Debugger events
connection.on('debugger.*',   debuggerEvent);
connection.on('debugger.*.*', debuggerEvent);

connection.startup(function() {
	connection.getResourceTree(function(resourceTree) {
		var frameTree = resourceTree.frameTree
			, frame     = frameTree.frame
			, resources = frameTree.resources;

		console.log('%s: %s', frame.id, frame.url);

		console.log('First 10 of %s resource(s) ....', resources.length);
		resources.slice(0, 10).forEach(function(resource) {
			console.log('\t%s ~ %s', resource.type, resource.url);
		});

		//
		var sampleFilename = 'node-inspector/sample.js';
		var sampleUrl      = resources.filter(function(resource) {
			return resource.url.indexOf(sampleFilename, resource.url.length - sampleFilename.length) !== -1
		})[0].url;

		connection.getResourceContent(sampleUrl, function(source) {
			console.log('source for %s ~\n\n%s', sampleUrl, source.content);
		});
	});
});
