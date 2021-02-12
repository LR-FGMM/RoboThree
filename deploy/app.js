/**
 * @release 0.71
 * @license The MIT License (MIT)
*/

var express = require('express');
var extend = require('extend');

var ArmRobotController = require('./controllers/ArmRobotController');
var ArmRobotVirtualizer = require('./virtualizers/ArmRobotVirtualizer');

extend ( ArmRobotController.prototype, ArmRobotVirtualizer.prototype );

'use strict';

const app = express();
const port = process.env.PORT  || 9080;

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

app.use(express.static('world'));

app.get('/', (req,res) => {
    res.sendFile('./world/fgmm_world.html')
});

app.post('/',(req,res) => {
});

app.post('/update',(req,res) => {
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

})
app.post('/exec',(req,res) => {
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


app.listen(port, () => {
    console.log ( "Listening on port " + port );
})
