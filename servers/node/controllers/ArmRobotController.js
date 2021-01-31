/**
 * @classdesc Class representing a robot's application controller.
 * @author Gatito Tof (http://loris.tissino.it)
 * @release 0.71
 * @license MIT
 * @param {string} id - The id of the robot
 * @constructor
 */
var ArmRobotController = function ( id ) {
    this.id = id;
    this.data = {};
    this.config = {};
    this.playing = false;
};

/**
 * Configures the robot.
 * @param {Object} options - The configuration settings (currently unused)
 * @return {ArmRobotController} - The controller
 */
ArmRobotController.prototype.setup = function ( options ) {
    return this;
};

module.exports = ThreeWheelDistanceSensingRobotController;
