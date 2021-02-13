$.extend( ArmRobotController.prototype, ArmRobotVirtualizer.prototype );

'use strict';

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

const worker = setupWorker(
    rest.post('/update',(req,res) => {
        var content = '';
        req.on('data', function (data) {
            content += data;
        });
        req.on('end', function () {
            var values = JSON.parse( content );
            var updatedValues = {};
            
            for (var id in robots) {
                updatedValues[id] = robots[id].update( values[id] );
            }
            var text = JSON.stringify( updatedValues );
            res.writeHead(200, {
                'Content-Type': 'text/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                'Access-Control-Max-Age': 2592000,
                'Server': managerName,
                'X-Powered-By': 'RoboThree ' + roboThreeRelease,
                'Content-Length': text.length
                });
            res.write(text);
            res.end();
        })
    
    }),
    rest.post('/exec',(req,res) => {
        var content = '';
        req.on('data', function (data) {
            content += data;
        });
        req.on('end', function () {
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
                res.writeHead(404, { 'Content-Type': 'text/plain', 'Server': 'RoboThree Robot\'s Manager' });
                res.write('Robot Not Found');
                res.end();
            }
        })
    })
)

worker.start();
