'use strict';

// This will eventually be removed it's merely here for righteous hackery!!!

const Session            = require('./lib/session')
		, FrontendConnection = require('./iface/frontend-connection');

var connection = new FrontendConnection()
	, session    = new Session({}, 5858, connection);

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
	});
});
