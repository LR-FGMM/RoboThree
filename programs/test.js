var LRCommander = require('LRCommander');
require('extend')( global, new LRCommander( 'arm', '127.0.0.1:9080' ).functions );

for ( var i = 0; i<3; i++ ) {
    moveJoint(180);
}
