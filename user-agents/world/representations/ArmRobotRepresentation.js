'use strict';
var ArmRobotRepresentation = function () {
};

$.extend ( ArmRobotRepresentation.prototype, RobotRepresentation.prototype );

ArmRobotRepresentation.prototype.build = function build () {
    
    if ( !this.isBuilt ) {
        console.log( "Building robot: " + this.id );
        this
            .addBody()
            //.addLight()
            //.addMotor()
            //.addVirtualCamera()
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

ArmRobotRepresentation.prototype.addBody = function addBody () {
    
    var values = $.extend ( {
        l1: {
            color: 0xffffff,
            opacity: 1,
            mass: 600,
            castShadow: true,
            receiveShadow: true
        },
        l2: {
            color: 0xffffff,
            opacity: 1,
            mass: 600
        }
    }, this.initialValues);

    this.l1 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(1, 1, 2),
        this.getLambertPjsMaterial( { color: values.l1.color, opacity: values.l1.opacity } ),
        values.l1.mass
    );

    this.l2 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(1, 1, 2),
        this.getLambertPjsMaterial( { color: values.l1.color, opacity: values.l1.opacity } ),
        values.l1.mass
    );

    this.l1.position.set(0, 3.5, 0);
    this.l1.name = 'l1';
    this.l1.castShadow = values.chassis.castShadow;
    this.l1.receiveShadow = values.chassis.receiveShadow;

    this.l2.position.set(0, 3.5, 0);
    this.l2.name = 'l2';
    this.l2.castShadow = values.chassis.castShadow;
    this.l2.receiveShadow = values.chassis.receiveShadow;

    this.l1.add(this.l2);

    return this
}

ArmRobotRepresentation.prototype.finalizeBody = function finalizeBody () {
    this.scene.add ( this.l1 );
    return this;
}

/**
 * Processes incoming data and prepares outgoing data.
 * @returns {ArmRobotRepresentation} - The robot
 */
ArmRobotRepresentation.prototype.process = function process ( ) {
    
    for ( var i = 0; i< this.registeredProcessFunctions.length; i++ ) {
        this.registeredProcessFunctions[i]( );
    }
    
    return this;
}

/**
 * Updates the data to/from the robot's behavior.
 * @override
 * @param {Object} data - The data received/transmitted
 */
ArmRobotRepresentation.prototype.update = function update ( data ) {
    
    if ( !this.isBuilt ) {
        return;
    }
        
    this.receivedData = data;
    
    if ( typeof data !== 'undefined' ) {
        
        for ( var i=0; i<this.dataPropertiesIn.length; i++ ) {
            this.data[this.dataPropertiesIn[i]] = data[this.dataPropertiesIn[i]];
        }
        
        this.process( );
    }
    
    
    //console.log ( this.data );
    
    return this.data;
}

/**
 * Manages the fact that there has been a communication failure.
 * @override
 * @param {Object} data - The data received/transmitted
 */
ArmRobotRepresentation.prototype.manageCommunicationFailure = function manageCommunicationFailure () {
    if ( this.isBuilt ) {
        //pass
    }
    return this.data;
}

window["ArmRobotRepresentation"] = ArmRobotRepresentation;  // we need a reference to this function to be shared through a global object.
