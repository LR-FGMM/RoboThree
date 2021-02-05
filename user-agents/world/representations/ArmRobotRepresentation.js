'use strict';
var ArmRobotRepresentation = function () {
};

$.extend ( ArmRobotRepresentation.prototype, RobotRepresentation.prototype );

ArmRobotRepresentation.prototype.build = function build (l1,l2,l3,l4) {
    
    if ( !this.isBuilt ) {
        console.log( "Building robot: " + this.id );
        this
            .addBody(l1,l2,l3,l4)
            //.addLight()
            //.addMotor()
            //.addVirtualCamera()
            .finalizeBody()
            .addArm()
            ;
        this.isBuilt = true;
        return true;
    }
    else {
        console.log( "Already built: " + this.id );
        return false;
    }
}

ArmRobotRepresentation.prototype.addBody = function addBody (l1,l2,l3,l4) {
    
    var values = $.extend ( {
        l1: {
            color: 0xffffff,
            opacity: 1,
            mass: 0
        }
        ,
        l2: {
            color:0xD9D900,
            opacity: 1,
            mass:600
        }
    }, this.initialValues);

    this.l1 = l1;
    this.l1.castShadow = true;
    this.l1.receiveShadow = true;
    this.l1.position.set(0, 10, 0);
    this.l1.scale.set(0.1,0.1,0.1);
    this.l1.name = 'l1';

    this.l1.rotation.set(Math.PI / 2,0,0);

    console.log(this.l1);

    //var material = new THREE.MeshBasicMaterial({color:'red'});

    //this.l2 = new THREE.Mesh( new THREE.BoxGeometry(10, 20, 10), material );
    this.l2 = l2;
    this.l2.castShadow = true;
    this.l2.receiveShadow = true;
    this.l2.position.set(0, 0,100);
    //this.l2.scale.set(0.1,0.1,0.1);
    this.l2.name = 'l2';
    this.l2.rotation.set(Math.PI,0,0);

    console.log(this.l2);

    this.j1 = new THREE.Object3D();
    this.j1.translateZ(-10);
    this.j1Axis = new THREE.Vector3(0, 0, 1);

    const l3_offset = 165;

    this.j2 = new THREE.Object3D();
    this.j2.translateZ(l3_offset);
    //this.j2Axis = new THREE.Vector3(1,0,0);
    //this.j2.add(this.j2Axis);

    this.l3 = l3;
    this.l3.castShadow = true;
    this.l3.receiveShadow = true;
    this.l3.translateZ(-l3_offset);
    //this.l3.translateZ(-20);
    //this.l3.position.set(0, 0, 0);
    //this.l3.scale.set(0.1,0.1,0.1);
    this.l3.name = 'l3';

    this.l4 = l4;
    this.l4.castShadow = true;
    this.l4.receiveShadow = true;
    this.l4.name = 'l4'

    this.spotLight = new THREE.SpotLight( 0xffffff,5 );
    this.spotLight.position.set( 0, 0, 150 );
    
    //this.spotLight.castShadow = true;
    

    //this.spotLight.castShadow = false;
    this.spotLight.angle = 0.3;
    this.spotLight.penumbra = 0.2;
    //this.spotLight.decay = 2;
    this.spotLight.distance = 0;

    this.spotLight.target.position.set(0,0,600);

    this.l1.add(this.j1);
    this.j1.add(this.l2);
    this.l2.add(this.j2);
    this.j2.add(this.l3);
    this.l3.add(this.l4);
    this.l4.add(this.spotLight);
    this.l4.add(this.spotLight.target);
    //this.l1.add(this.l2);
    // this.j1 = new Physijs.BoxMesh(
    //     new THREE.BoxGeometry(0,0,0),
    //     this.getLambertPjsMaterial({color:0xD9D900, opacity:1}),
    //     0
    // );
    //this.j1.translateY(20);
    //this.j1Axis = new THREE.Vector3(0, 0, 1);

    return this
}

ArmRobotRepresentation.prototype.addArm = function addArm (){
    // this.l2 = new Physijs.BoxMesh(
    //     new THREE.BoxGeometry(10, 20, 10),
    //     this.getLambertPjsMaterial( { color: 0xD9D900, opacity: 1} ),
    //     0
    // );
    // this.l2.position.set(0, 22, 0);
    // this.l2.name = 'l2';
    // this.l2.castShadow = true;
    // this.l2.receiveShadow = true;


    // //this.l1.add(this.l2)
    // //this.j1.add(this.l2);
    // this.scene.add(this.l2)
    // this.scene.add(this.j1)

    // this.jointConstraint = this.createDOFConstraint( this.l1, this.j1, new THREE.Vector3(0,22,0), new THREE.Vector3(0,0,1));
    // this.scene.addConstraint(this.jointConstraint);
    // this.jointConstraint.setLinearLowerLimit( new THREE.Vector3( 0, 0, 0 ) ); // sets the lower end of the linear movement along the x, y, and z axes.
    // this.jointConstraint.setLinearUpperLimit( new THREE.Vector3( 0, 0, 0 ) ); // sets the upper end of the linear movement along the x, y, and z axes.
    // this.jointConstraint.setAngularLowerLimit( new THREE.Vector3( 0, -0, 0 ) ); // sets the lower end of the angular movement, in radians, along the x, y, and z axes.
    // this.jointConstraint.setAngularUpperLimit( new THREE.Vector3( 0, 0, 0 ) ); // sets the upper end of the angular movement, in radians, along the x, y, and z axes.
    // this.jointConstraint.configureAngularMotor(2, 0.1, 0.2, 0, 1500);
    // this.jointConstraint.enableAngularMotor(2);
    // this.jointConstraint.disableAngularMotor(2);

    // var constraintPosition = this.l2.position.clone().add( new THREE.Vector3 ( 0, 10, 0 ) );
    
    // this.armConstraint = this.createDOFConstraint( this.j1, this.l2, constraintPosition, new THREE.Vector3 ( 0, 0, 1 ));
    
    // this.scene.addConstraint( this.armConstraint, true );
    
    // this.armConstraint.setLinearLowerLimit( new THREE.Vector3( 0, 0, 0 ) ); // sets the lower end of the linear movement along the x, y, and z axes.
    // this.armConstraint.setLinearUpperLimit( new THREE.Vector3( 0, 0, 0 ) ); // sets the upper end of the linear movement along the x, y, and z axes.
    // this.armConstraint.setAngularLowerLimit( new THREE.Vector3( 0, -0, 0 ) ); // sets the lower end of the angular movement, in radians, along the x, y, and z axes.
    // this.armConstraint.setAngularUpperLimit( new THREE.Vector3( 0, Math.PI, 0 ) ); // sets the upper end of the angular movement, in radians, along the x, y, and z axes.
    // this.armConstraint.configureAngularMotor(2, 0.1, 0.2, 0, 1500);
    // this.armConstraint.enableAngularMotor(2);
    // this.armConstraint.disableAngularMotor(2);
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
ArmRobotRepresentation.prototype.updateJointsAngles = function updateJointsAngles (angle1,angle2){
    //this.armConstraint.configureAngularMotor( 2, 0.1, 0, 50, 15000 );
    //this.j1.setRotationFromAxisAngle(this.j1Axis, angle * Math.PI / 180);
    this.j1.rotateOnAxis(new THREE.Vector3(0,0,1),angle1);
    this.j2.rotateOnAxis(new THREE.Vector3(1,0,0),angle2);
    //this.j1.__dirtyPosition = true;
    //this.j1.__dirtyRotation = true;
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
    
    //this.updateJointsAngles(this.data.joint_angle);
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
    //this.l1.__dirtyPosition = true;
    //this.l1.__dirtyRotation = true;
    return this;
}
window["ArmRobotRepresentation"] = ArmRobotRepresentation;  // we need a reference to this function to be shared through a global object.
