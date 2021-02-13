//var extend = require('extend');
/**
 * @classdesc Mixin providing methods for the virtualization of a robot's application controller.
 * @mixin
 * @author Gatito 
 * @release 0.71
 * @license MIT
 * @constructor
 */
var ArmRobotVirtualizer = function ( ) {
};

/**
 * Adds commands.
 * @return {ArmRobotVirtualizer} - The controller
 */
ArmRobotVirtualizer.prototype.addCommands = function addCommands () {
    var robot = this;
    this.commandManager = {
        currentWait: false,
        sendHTTPResponse: function (code, type, body ) {
            robot.commandManager.originalResponse.writeHead( code, { 'content-type': type } );
            robot.commandManager.originalResponse.write( type === 'text/json' ? JSON.stringify ( body ): body );
            robot.commandManager.originalResponse.end();
        },
        commands: {
            'stop': {
                exec: function ( ) {
                    robot.stop();
                },
                wait: function ( ) {
                    if ( robot.leftWheel.status == 0 && robot.rightWheel.status == 0 ) {
                            robot.commandManager.currentWait = false;
                            robot.commandManager.sendHTTPResponse( 200, 'text/json', { stopped: true } );
                    }
                }
            },
            'moveJoint': {
                exec: function ( ) {
                    robot.moveJoint(robot.commandManager.parameters.angle);
                }
            },
        }
    }
    return this;
}

/**
 * Execs a command.
 * @param {string} command - The command
 * @param {Object} parameters - The parameters of the command
 * @param {http.ServerResponse} originalResponse - The response to use for the reply
 */
ArmRobotVirtualizer.prototype.exec = function ( command, parameters, originalResponse ) {

    var robot = this;
    
    if ( ! this.hasOwnProperty ('commandManager') ) {
        throw "CommandManager has not been enabled for this robot";
    }

    this.commandManager.originalResponse = originalResponse;
    this.commandManager.parameters = parameters;
    
    if ( this.commandManager.currentWait !== false ) {
        robot.commandManager.sendHTTPResponse( 503, 'text/plain', 'Service Unavailable' );
        return;
    }
    
    if ( ! this.commandManager.commands.hasOwnProperty( command ) ) {
        robot.commandManager.sendHTTPResponse( 400, 'text/plain', 'Bad Request' );
        return;
    }
    
    var command = this.commandManager.commands[command];

    this.commandManager.initialState = {
        location: { x: robot.location.x, y: robot.location.y },
        heading: robot.heading
    };

    var result = command.exec();
    
    if ( command.hasOwnProperty ( 'wait' ) ) {
        this.commandManager.currentWait = command.wait;
    } else {
        robot.commandManager.sendHTTPResponse( 200, 'text/json', result );
    }
}

/**
 * Updates the robot with the information coming from the robot's manager.
 * @param {Object} values - The parameters of the command
 */
ArmRobotVirtualizer.prototype.update = function update ( values ) {    
    if ( typeof values !== 'undefined' ){
        this.location = values.location;
        this.heading = values.heading;
        if ( values.hasOwnProperty('joint_angles') ){
            this.joint_angles = values.joint_angles;
        }

        if ( values.hasOwnProperty('light_intensity')){
            this.light_intensity = values.light_intensity;
        }
    }  
    else {
        values = {};
    }
    
    if ( this.commandManager.currentWait !== false ) {
        this.commandManager.currentWait();
    }

    for (var f in this.registeredCallBacks) {
        this.registeredCallBacks[f]();
    }
    values.joint_angles = this.joint_angles
    values.light_intensity = this.light_intensity
    return values;
}

//module.exports = ArmRobotVirtualizer;