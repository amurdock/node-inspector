'use strict';

// This will eventually be removed it's merely here for righteous hackery!!!

const Session            = require('./lib/session')
		, FrontendConnection = require('./iface/frontend-connection');

var connection = new FrontendConnection()
	, session    = new Session({}, 5858, connection);

function debuggerEvent(payload) {
	var filename = 'sample.js'
		, url;

	if (this.event === 'debugger.script.parsed') {
		url = payload.params.url;

		if (url.indexOf(filename, url.length - filename.length) !== -1) {
			connection.getScriptSource(payload.params.scriptId, function(result) {
				//console.log('script source ~\n%s', result.scriptSource);
			});
		}
	} else if (this.event === 'debugger.paused') {
		//console.log('*******************');
		//console.log(payload.params.callFrames);
	}
}

// Debugger events
connection.on('debugger.*',   debuggerEvent);
connection.on('debugger.*.*', debuggerEvent);

function traceLocation(callFrames) {
	var location = callFrames[0].location;

	console.log('current location: script[%s], line[%s] column[%s]', location.scriptId, location.lineNumber, location.columnNumber);
}

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
			//console.log('source for %s ~\n\n%s', sampleUrl, source.content);
		});

		// Hateful, hateful, very very hateful!!!
		connection.getProperties(function(response) {
			console.log('Properties before ....');
			response.result.forEach(function (property) {
				console.log(property.name);
			});

			connection.stepInto(function (callFrames) {
				traceLocation(callFrames);

				connection.stepInto(function(callFrames) {
					traceLocation(callFrames);

					connection.stepOut(function (callFrames) {
						traceLocation(callFrames);

						connection.stepInto(function(callFrames) {
							traceLocation(callFrames);

							connection.getProperties(function(response) {
								console.log('Properties before ....');
								response.result.forEach(function (property) {
									console.log(property.name);
								});

								// ... how low can you go?!?!
							});
						});
					});
				});
			});
		});
	});
});
