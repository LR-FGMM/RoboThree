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
            mass: 600
        },
        l2: {
            color: 0xffffff,
            opacity: 1,
            mass: 600
        }
    }, this.initialValues);

    this.l1 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(10, 20, 10),
        this.getLambertPjsMaterial( { color: values.l1.color, opacity: values.l1.opacity } ),
        values.l1.mass
    );

    this.j1 = new THREE.Object3D();
    this.j1.translateY(20);
    this.j1Axis = new THREE.Vector3(0, 0, 1);


    this.l2 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(10, 20, 10),
        this.getLambertPjsMaterial( { color: values.l2.color, opacity: values.l2.opacity } ),
        values.l2.mass
    );

    this.l1.position.set(0, 0, 0);
    this.l1.name = 'l1';
    this.l1.castShadow = true;
    this.l1.receiveShadow = true;

    this.l2.position.set(0, 20, 0);
    this.l2.name = 'l2';
    this.l2.castShadow = true;
    this.l2.receiveShadow = true;
    
    this.l1.add(this.j1)
    this.j1.add(this.l2);



    return this
}

ArmRobotRepresentation.prototype.finalizeBody = function finalizeBody () {
    this.scene.add ( this.l1 );
    return this;
}


/**
 * Updates joint angles
 * @param {float} angle - angle of the joint (degree)
 * @return {ArmRobotRepresentation} - The Robot
 */
ArmRobotRepresentation.prototype.updateJointsAngles = function updateJointsAngles (angle){
    this.j1.setRotationFromAxisAngle(this.j1Axis, angle * Math.PI / 180);
    return this;
}

/**
 * Updates light intensity
 * @param {float} intensity - intensity of light (0 to 1)
 * @return {ArmRobotRepresentation} - The Robot
 */
ArmRobotRepresentation.prototype.updateLightIntensity = function updateLightIntensity (intensity){
    return this;
}

/**
 * Processes incoming data and prepares outgoing data.
 * @returns {ArmRobotRepresentation} - The robot
 */
ArmRobotRepresentation.prototype.process = function process ( ) {
    
    this.updateJointsAngles(this.data.joint_angle);
    this.updateLightIntensity(this.light_intensity);

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

 /**
 * Moves the robot to a specific place.
 * @override
 * @param {THREE.Vector3} vector - The vector with the coordinates to move the robot to
 * @param {boolean} relative - Whether the coordinates are to be considered relative or absolute
 * @return {ArmRobotRepresentation} - The robot
 */
ArmRobotRepresentation.prototype.move = function move ( vector, relative ) {
    // vector is a THREE.Vector3 object
    // relative is a boolean: if true, the vector is considered a change from current position, else a final destination
    console.log ('moving to: ');
    console.log ( vector );
    var offset;
    
    if ( typeof relative === 'undefined' ) {
        relative = false;
    }
    
    offset = relative ? vector : vector.sub ( this.l1.position );
    
    this.l1.position.add ( offset );
    this.l1.__dirtyPosition = true;
    this.l1.__dirtyRotation = true;
    
    $.each ( this.components, function ( index, component ) {
       component.position.add( offset );
       component.__dirtyPosition = true;
       component.__dirtyRotation = true;
    });
    
    return this;
}

/**
 * Rotates the robot on an axis.
 * @override
 * @param {THREE.Vector3} axis - The axis along which the robot should be rotated
 * @param {float} angle - The angle of rotation, in radians
 * @return {ArmRobotRepresentation} - The robot
 */
RobotRepresentation.prototype.rotateOnAxis = function rotateOnAxis ( axis, angle ) {
    this.l1.rotateOnAxis ( axis, angle );
    this.l1.__dirtyPosition = true;
    this.l1.__dirtyRotation = true;
    return this;
}
window["ArmRobotRepresentation"] = ArmRobotRepresentation;  // we need a reference to this function to be shared through a global object.
