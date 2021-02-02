/**
 * @release 0.71
 * @license The MIT License (MIT)
*/

var http = require('http');
var extend = require('extend');

var ArmRobotController = require('../controllers/ArmRobotController');
var ArmRobotVirtualizer = require('../virtualizers/ArmRobotVirtualizer');

extend ( ArmRobotController.prototype, ArmRobotVirtualizer.prototype );

'use strict';

var port = process.argv[2] || 9080;

var roboThreeRelease = '0.70';
var managerName = "FGGM manager";

var robots = {
    arm: new ArmRobotController('arm')
};

for (var id in robots) {
    robots[id]
        .setup()
        .addCommands()
        //.play()
        ;
    console.log ( "Activated robot: «" + id + "»" );
}

var mainServer = http.createServer(function (request, response) {
    if (request.method !== 'POST') {
        response.writeHead(405, { 'Content-Type': 'text/plain' });
        response.write('Method Not Allowed');
        response.end();
        return;
    }

    if (request.url == '/update') {
        var content = '';
        request.on('data', function (data) {
            content += data;
        });
        request.on('end', function () {
            var values = JSON.parse( content );
            var updatedValues = {};
            
            for (var id in robots) {
                updatedValues[id] = robots[id].update( values[id] );
            }
            var text = JSON.stringify( updatedValues );
            response.writeHead(200, {
                'Content-Type': 'text/json',
                'Access-Control-Allow-Origin': '*',
                'Server': managerName,
                'X-Powered-By': 'RoboThree ' + roboThreeRelease,
                'Content-Length': text.length
                });
            response.write(text);
            response.end();
        })
    }
    else if (request.url == '/exec') {
        var content = '';
        request.on('data', function (data) {
            content += data;
        });
        request.on('end', function () {
            var values = JSON.parse( content );
            console.log ('[manager] values: ');
            console.log ( values );
            if ( typeof values.robotId !== 'undefined' ) {
                console.log('[manager] Execution of ' + values.command + ' called... ');
                console.log('[manager] Parameters: ');
                console.log(values.parameters);
                robots[values.robotId].exec( values.command, values.parameters, response ); // we delegate the response to the robot
            }
            else {
                response.writeHead(404, { 'Content-Type': 'text/plain', 'Server': 'RoboThree Robot\'s Manager' });
                response.write('Robot Not Found');
                response.end();
            }
        })
    }
});

mainServer.listen( port );

console.log ( "Listening on port " + port );


