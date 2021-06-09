'use strict';
var ArmRobotRepresentation = function () {
};

$.extend ( ArmRobotRepresentation.prototype, RobotRepresentation.prototype );

ArmRobotRepresentation.prototype.build = function build (l1,l2,l3,l4) {
    
    this.tasks = [];
    this.active_task = {'class':'none','value':0}
    
    this.wait_tasks = [];
    this.wait_task = 0;
    
    this.yaw_max = 3;
    this.yaw_min = -3;
    this.yaw_state = 0;
    this.yaw_task = 0;
    this.yaw_vel = 0.01;
    this.yaw_tasks = [];
    this.max_vel_yaw = 0.25;

    this.pitch_max = 2;
    this.pitch_min = -2;
    this.pitch_state = 0 ;
    this.pitch_task = 0;
    this.pitch_vel = 0.01;
    this.pitch_tasks = [];
    this.max_vel_pitch = 0.25;

    this.light_intensity = 1;
    this.max_light_intensity = 5;
    this.light_color = "white";

    if ( !this.isBuilt ) {
        console.log( "Building robot: " + this.id );
        this
            .addBody(l1,l2,l3,l4)
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

    this.initial_x = this.initialValues.position.x;
    this.initial_z = this.initialValues.position.z;

    this.model_scale = 3;
    this.l1 = l1;
    this.l1.castShadow = true;
    this.l1.receiveShadow = true;
    this.l1.position.set(this.initial_x, this.model_scale*10+800, this.initial_z);

    this.dmx_scale = this.model_scale * 0.1;
    this.l1.scale.set(this.dmx_scale,this.dmx_scale,this.dmx_scale);
    this.l1.name = 'l1';

    this.l1.rotation.set((3/2)*Math.PI ,0,0);


    this.l2 = l2;
    this.l2.castShadow = true;
    this.l2.receiveShadow = true;
    this.l2.position.set(0, 0,100);

    this.l2.name = 'l2';
    this.l2.rotation.set(Math.PI,0,0);

    this.j1 = new THREE.Object3D();
    this.j1.translateZ(-10);
    this.j1Axis = new THREE.Vector3(0, 0, 1);

    const l3_offset = 165;

    this.j2 = new THREE.Object3D();
    this.j2.translateZ(l3_offset);


    this.l3 = l3;
    this.l3.castShadow = true;
    this.l3.receiveShadow = true;
    this.l3.translateZ(-l3_offset);

    this.l3.name = 'l3';

    this.l4 = l4;
    this.l4.castShadow = true;
    this.l4.receiveShadow = true;
    this.l4.name = 'l4'

    this.spotLight = new THREE.SpotLight( 'blue',this.light_intensity);
    this.spotLight.position.set( 0, 0, 300 );
    
    this.spotLight.castShadow = true;
    this.spotLight.shadowCameraNear = 11;
    this.spotLight.shadowCameraFar = 600;
    

    this.spotLight.angle = 0.3;
    this.spotLight.penumbra = 0.2;
    this.spotLight.decay = 2;
    this.spotLight.distance = 0;

    
    this.spotLight.target.position.set(0,0,301);

    this.lightHelper = new THREE.SpotLightHelper( this.spotLight ,5);
    //var geometry	= new THREE.CylinderGeometry( 0.1, 1.5, 5, 32*2, 20, true);
    var geo_cone = new THREE.CylinderGeometry( 0.1, 1.5, 7, 32*2, 20, true);
    var cone_scale = 500;
    geo_cone.scale(cone_scale,cone_scale,cone_scale);
	geo_cone.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -4*cone_scale, 0 ) );
	geo_cone.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) );

   
    this.vol_mat = new THREEx.VolumetricSpotLightMaterial();
    this.l_mesh = new THREE.Mesh(geo_cone, this.vol_mat);
    //this.l_mesh.position.set(1.5,2,0)
    this.vol_mat.uniforms.lightColor.value.set(this.spotLight.color);
    this.vol_mat.uniforms.spotPosition.value	= this.l_mesh.position;
    this.vol_mat.uniforms['anglePower'].value = 3;
    this.vol_mat.uniforms['attenuation'].value = 10000;
    



    this.l1.add(this.j1);
    this.j1.add(this.l2);
    this.l2.add(this.j2);
    this.j2.add(this.l3);
    this.l3.add(this.l4);
    this.l4.add(this.spotLight);

    this.l4.add(this.spotLight.target);

    this.l4.add(this.l_mesh);

    this.scene.traverse(object => {
        if(object.type === 'Mesh') object.material.needsUpdate = true;
    });
    return this
}

ArmRobotRepresentation.prototype.finalizeBody = function finalizeBody () {
    this.scene.add ( this.l1 );
    //this.scene.add(this.l_mesh)
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

ArmRobotRepresentation.prototype.setYawAngle = function setYawAngle (angle){
    this.j1.rotateOnAxis(new THREE.Vector3(0,0,1),angle-this.yaw_state);
    this.yaw_state = angle;
    return this;
}

ArmRobotRepresentation.prototype.setPitchAngle = function setPitchAngle (angle){
    this.j2.rotateOnAxis(new THREE.Vector3(1,0,0),angle-this.pitch_state);
    this.pitch_state = angle;
    return this;
}

ArmRobotRepresentation.prototype.updatePitchAngle = function updatePitchAngle (angle){
    if (this.pitch_state + angle > this.pitch_max){
        this.j2.rotateOnAxis(new THREE.Vector3(1,0,0),this.pitch_max-this.pitch_state);
        this.pitch_state = this.pitch_max;
        return this;
    }
    else if (this.pitch_state + angle < this.pitch_min){
        this.j2.rotateOnAxis(new THREE.Vector3(1,0,0),this.pitch_min-this.pitch_state);
        this.pitch_state = this.pitch_min;
        return this;
    }
    else{
        this.j2.rotateOnAxis(new THREE.Vector3(1,0,0),angle);
        this.pitch_state += angle;
        return this;
    }
}

ArmRobotRepresentation.prototype.updateYawAngle = function updateYawAngle (angle){
    if (this.yaw_state + angle > this.yaw_max){
        this.j1.rotateOnAxis(new THREE.Vector3(0,0,1),this.yaw_max-this.yaw_state);
        this.yaw_state = this.yaw_max;
        return this;
    }
    else if (this.yaw_state + angle < this.yaw_min){
        this.j1.rotateOnAxis(new THREE.Vector3(0,0,1),this.yaw_min-this.yaw_state);
        this.yaw_state = this.yaw_min;
        return this;
    }
    else{
        this.j1.rotateOnAxis(new THREE.Vector3(0,0,1),angle);
        this.yaw_state += angle;
        return this;
    }
}

ArmRobotRepresentation.prototype._addMultipleTasks = function _addMultipleTasks(tasks){
    this.tasks = tasks;
    return this;

}

ArmRobotRepresentation.prototype._addTask = function _addTask(a,value){
    console.log(typeof(value));
    if(value == null){
        return this;
    }
    var new_task = {'class':a,'value':value};
    this.tasks.push(new_task);
    return this;
}
ArmRobotRepresentation.prototype.moverYaw = function moverYaw(angulo){
    return this._addTask('yaw',angulo);
}

ArmRobotRepresentation.prototype.moverPitch = function moverPitch(angulo){
    return this._addTask('pitch',angulo);
}

ArmRobotRepresentation.prototype.esperar = function esperar(tiempo){
    return this._addTask('wait',tiempo);
}

ArmRobotRepresentation.prototype.cambiarRapidezYaw = function cambiarRapidezYaw(vel){
    return this._addTask('yaw_vel',vel.toFixed(2));
}

ArmRobotRepresentation.prototype.cambiarRapidezPitch = function cambiarRapidezPitch(vel){
    return this._addTask('pitch_vel',vel.toFixed(2));
}

ArmRobotRepresentation.prototype.setVelPitch = function setVelPitch(vel){
    this.pitch_vel = vel;
    return this;
}

ArmRobotRepresentation.prototype.setVelYaw = function setVelYaw(vel){
    this.yaw_vel = vel;
    return this;
}
/**
 * Updates light intensity
 * @param {float} intensity - intensity of light (0 to 1)
 * @return {ArmRobotRepresentation} - The Robot
 */
ArmRobotRepresentation.prototype.updateLightIntensity = function updateLightIntensity (intensity){
    this.spotLight.intensity = intensity;
    return this;
}

ArmRobotRepresentation.prototype.cambiarIntensidadLuz = function cambiarIntensidadLuz (intensity){
    var new_task = {'class':'light_intensity','value':intensity};
    this.tasks.push(new_task);
    return this;
}

ArmRobotRepresentation.prototype.cambiarColorLuz = function cambiarIntensidadLuz (color){
    var new_task = {'class':'light_color','value':color};
    this.tasks.push(new_task);
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

ArmRobotRepresentation.prototype.nearZero = function nearZero (num) {
    return Math.abs(num) < 0.009;
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

    if (this.active_task.class == 'none' && this.tasks.length > 0){
        this.active_task = this.tasks.shift();
        if (this.active_task.class == 'yaw'){
            this.active_task.value -= this.yaw_state ;
        }
        if (this.active_task.class == 'pitch'){
            this.active_task.value -= this.pitch_state ;
        }
    }

    if (this.active_task.class == 'wait' && this.active_task.value >= 1){
        this.active_task.value -= 1;
    }

    if (this.active_task.class == 'wait' && this.nearZero(this.active_task.value)){
        this.active_task.class = 'none';
    }
    
    if (this.active_task.class == 'yaw' && !this.nearZero(this.active_task.value)){
        const sig_yaw = Math.sign(this.active_task.value);
        if (sig_yaw*(this.active_task.value - this.yaw_vel*sig_yaw) < 0){
            this.updateYawAngle(this.active_task.value);
            this.active_task.value = 0;
        }
        else{
            this.updateYawAngle(this.yaw_vel*sig_yaw);
            this.active_task.value -= this.yaw_vel*sig_yaw;
        }
            //this.updateYawAngle(this.yaw_vel*this.active_task.value);
        //this.active_task.value -= this.yaw_vel*this.active_task.value;

    }
    
    if (this.active_task.class == 'pitch' && !this.nearZero(this.active_task.value)){
        const sig_pitch = Math.sign(this.active_task.value);
        if (sig_pitch*(this.active_task.value - this.pitch_vel*sig_pitch) < 0){
            this.updatePitchAngle(this.active_task.value);
            this.active_task.value = 0;
        }
        else{
            this.updatePitchAngle(this.pitch_vel*sig_pitch);
            this.active_task.value -= this.pitch_vel*sig_pitch;
        }
    }

    if (this.active_task.class == 'yaw' && this.nearZero(this.active_task.value)){
        this.active_task.class = 'none';
    }
    
    if (this.active_task.class == 'pitch' && this.nearZero(this.active_task.value)){
        this.active_task.class = 'none';
    }

    if (this.active_task.class == 'yaw_vel'){
        if (this.active_task.value > this.max_vel_yaw){
            this.yaw_vel = this.max_vel_yaw;
        }
        else if (this.active_task.value < 0){
            this.yaw_vel = 0;
        }
        else {
            this.yaw_vel = this.active_task.value;
        }
        this.active_task.class = 'none';
    }

    if (this.active_task.class == 'pitch_vel'){
        if (this.active_task.value > this.max_vel_pitch){
            this.pitch_vel = this.max_vel_pitch;
        }
        else if (this.active_task.value < 0){
            this.pitch_vel = 0;
        }
        else {
            this.pitch_vel = this.active_task.value;
        }
        this.active_task.class = 'none';
    }

    if (this.active_task.class == 'light_intensity'){
        if (this.active_task.value > this.max_light_intesity){
            this.light_intensity = this.max_light_intensity;
        }
        else if (this.active_task.value < 0){
            this.light_intensity = 0;
        }
        else {
            this.light_intensity = this.active_task.value;
        }
        this.spotLight.intensity = this.light_intensity;
        this.vol_mat.uniforms['attenuation'].value = 10000**this.light_intensity;
        this.active_task.class = 'none';
    }

    if (this.active_task.class == 'light_color'){
        this.light_color = this.active_task.value;
        this.spotLight.color.set(this.light_color);
        this.vol_mat.uniforms.lightColor.value.set(this.light_color);
        this.active_task.class = 'none';
    }
    
    
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
