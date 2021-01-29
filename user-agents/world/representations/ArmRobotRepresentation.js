'use strict';
var ArmRobotRepresentation = function () {
};

$.extend ( ArmRobotRepresentation.prototype, RobotRepresentation.prototype );

ArmRobotRepresentation.prototype.build = function build () {
    
    if ( !this.isBuilt ) {
        console.log( "Building robot: " + this.id );
        this
            .addBody()
            .addLight()
            .addMotor()
            .addVirtualCamera()
            .finalizeBody()
            ;
        this.isBuilt = true;
        return true;
    }
    else {
        console.log( "Already built: " + this.id );
        return false;
    }
}