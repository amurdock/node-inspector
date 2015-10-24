# Not sure what to call this ...

First

    node --debug-brk sample.js
    
then

    node index.js
    
should produce (or something similar) ...

    nodeinspector-toplevel-frame: file:///Users/amurdock/Work/node-inspector/sample.js
    First 10 of 2814 resource(s) ....
            Script ~ file:///Users/amurdock/Work/node-inspector/iface/callback.js
            Script ~ file:///Users/amurdock/Work/node-inspector/iface/frontend-connection.js
            Script ~ file:///Users/amurdock/Work/node-inspector/index.js
            Script ~ file:///Users/amurdock/Work/node-inspector/lib/BreakEventHandler.js
            Script ~ file:///Users/amurdock/Work/node-inspector/lib/callback.js
            Script ~ file:///Users/amurdock/Work/node-inspector/lib/CallFramesProvider.js
            Script ~ file:///Users/amurdock/Work/node-inspector/lib/config.js
            Script ~ file:///Users/amurdock/Work/node-inspector/lib/ConsoleAgent.js
            Script ~ file:///Users/amurdock/Work/node-inspector/lib/ConsoleClient.js
            Script ~ file:///Users/amurdock/Work/node-inspector/lib/convert.js

    
For more information see index.js and ./iface/*.js for implementation.    
    
