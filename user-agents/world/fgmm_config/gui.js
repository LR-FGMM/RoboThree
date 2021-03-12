var guiFactory = function ( simulator ) {

    //var scale = chroma.scale(['white', 'blue', 'red', 'yellow']);

    function getMaterial(color) {
        var material = new THREE.MeshPhongMaterial( { color: color, specular: 0x111111, shininess: 200 } );


        return material;
    }

    function setPosAndShade(obj) {
        obj.position.set(
                Math.random() * 100 - 50,
                250 + Math.random()*100,
                Math.random() * 100 - 50
        );

        obj.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
        obj.castShadow = true;
        obj.receiveShadow = true;
    }
        
    var controls = new function () {
        

        
        /*
        this.camRotationX = simulator.mainCamera.rotation.x;
        this.camRotationY = simulator.mainCamera.rotation.y;
        this.camRotationZ = simulator.mainCamera.rotation.z;
        */
        
        
        this.X = simulator.light.position.x;
        this.Y = simulator.light.position.y;
        this.Z = simulator.light.position.z;
        this.Intensidad = simulator.light.intensity;

        this.changeLight = function changeLight() {
            simulator.light.position.set( controls.X, controls.Y, controls.Z );
            simulator.light.intensity = controls.Intensidad;
        };
 
        this.Color = "#0000dd";
        
        this.Caja = function () {
            var cube = new THREE.Mesh(
                new THREE.BoxGeometry(16, 10, 14),
                getMaterial( this.Color ),
            );
            setPosAndShade(cube);
            simulator.scene.add(cube, 2);
        };
        
        this.Esfera = function () {
            var sphere = new THREE.Mesh(
                new THREE.SphereGeometry(6, 32),
                getMaterial( this.Color )
            );
            setPosAndShade(sphere);
            simulator.scene.add(sphere);
        };

        this.selectedCamera = 'main';

        var ctrls = this; // a reference

        this.selectCamera = function() {
            console.log ( 'camara: ' );
            console.log ( ctrls.selectedCamera );
            simulator.usedCamera = simulator.availableCameras[ctrls.selectedCamera];
        }

        this.takeScreenshot = function() {
            var dataUrl = renderer.domElement.toDataURL("image/png");
            console.log (dataUrl);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        }
        
        this.simulate = false;
        
        this.enableAltCamera = true;
        
        this.showAxis = false;
        
        this.showDebugText = false;

    }
    
    var gui = new dat.GUI({ autoPlace: false } );
    
    //gui.remember ( controls );
    
    function addRobotsToGui( simulator, gui ,l1,l2,l3,l4) {
        console.log ( 'adding robots to gui list...' );
        
        $.each ( gui.userData.managersSubfolders, function ( index, manager ) {
            
            $.each ( manager.userData.robotsManager.robots, function ( index, robot ) {
                // var property = 'Agregar robot: '+robot.id;
                // controls[property] = function () {
                //     if ( robot.build(l1,l2,l3,l4) ) {
                //         if ( robot.hasCamera() ) {
                //             gui.userData.cameras[robot.id] = robot.camera.uuid;
                            
                //             for (var i in gui.__controllers) {
                //                 // gui.__controllers[i].updateDisplay(); // does not update the list shown
                                
                //                 if ( gui.__controllers[i].property == 'selectedCamera' ) {
                                    
                //                     var option, t, att;
                //                     for ( var j in gui.userData.cameras ) {
                //                         // if the camera is not in the list of options, add it
                //                         if ( $("option[value='" + gui.userData.cameras[j] + "']").length === 0 ) {
                //                             option = document.createElement ( 'option' );
                //                             t = window.document.createTextNode ( j );
                //                             option.appendChild ( t );
                //                             att = document.createAttribute("value");
                //                             att.value = gui.userData.cameras[j];
                //                             option.setAttributeNode(att);
                //                             gui.__controllers[i].__select.appendChild ( option );
                //                         }
                //                     }
                //                 }
                //             }
                //         }
                                    
                //         if ( typeof robot.initialValues !== 'undefined' ) {
                //             if ( typeof robot.initialValues.position !== 'undefined' ) {
                //                 robot.move ( robot.initialValues.position, false );
                //             }
                //         }
                //     }
                // }
                // manager.add(controls, property);
                

                property = 'rotar +yaw'
                controls[property] = function () {
                    robot.updateYawAngle(0.25);
                }
                manager.add(controls, property);

                property = 'rotar -yaw'
                controls[property] = function () {
                    robot.updateYawAngle(-0.25);
                }
                manager.add(controls, property);

                property = 'rotar +pitch'
                controls[property] = function () {
                    robot.updatePitchAngle(0.25);
                }
                manager.add(controls, property);

                property = 'rotar -pitch'
                controls[property] = function () {
                    robot.updatePitchAngle(-0.25);
                }
                manager.add(controls, property);
                
            });
        });
    }
    
    gui.userData = {
        controls: controls,
        cameras: {},
        windows: []
    };
    
    gui.userData.cameras['main'] = simulator.mainCamera.uuid;
    
    
    //var light = gui.addFolder("Luz principal");
    //light.add(controls, 'X', -800, 800).onChange(controls.changeLight);
    //light.add(controls, 'Y', 0, 800).onChange(controls.changeLight);
    //light.add(controls, 'Z', -800, 800).onChange(controls.changeLight);
    //light.add(controls, 'Intensidad', 0, 10).onChange(controls.changeLight);

    function addControls() {
        var dmx = window.simulator.getRobotById("arm");

        dmx_params = {"intensidad":dmx.spotLight.intensity,"color":"#0000dd","yaw":0.1,"pitch":0.1,"rapidez_pitch":0.1,"rapidez_yaw":0.1};


    var movimientos = gui.addFolder("Controles");
 
    var inten_cont = movimientos.add(dmx_params, 'intensidad', 0, 10).name("Intensidad").onChange(
        function (value){
            var dmx = window.simulator.getRobotById("arm");
            dmx_params.intensidad  = dmx.spotLight.intensity;
            dmx.spotLight.intensity = value;
            dmx.vol_mat.uniforms['attenuation'].value = 10000**value;
        }
    );
    //inten_cont.listen();

    movimientos.addColor(dmx_params,'color').name("Color").onChange(
        function (value){
             value=value.replace( '#','0x' );
             dmx.spotLight.color.setHex(value);
             dmx.vol_mat.uniforms.lightColor.value.setHex(value);
             //console.log(value);
        }
    );

    movimientos.add(dmx_params, 'yaw', -3., 3.,0.1).name("Yaw").onChange(
        function (value){
            var dmx = window.simulator.getRobotById("arm");
            dmx.setYawAngle(value);
        }
    )

    movimientos.add(dmx_params, 'pitch', -2., 2.,0.1).name("Pitch").onChange(
        function (value){
            var dmx = window.simulator.getRobotById("arm");
            dmx.setPitchAngle(value);
        }
    )
    dmx_params.yaw = 0;
    dmx_params.pitch = 0;

    movimientos.add(dmx_params, "rapidez_yaw",0.01,0.35,0.01).name("Rapidez Yaw").onChange(
        function (value){
            var dmx = window.simulator.getRobotById("arm");
            dmx.setVelYaw(value);
        }
    )

    movimientos.add(dmx_params, "rapidez_pitch",0.01,0.35,0.01).name("Rapidez Pitch").onChange(
        function (value){
            var dmx = window.simulator.getRobotById("arm");
            dmx.setVelPitch(value);
        }
    )


}

    //var meshes = gui.addFolder("Agregar figuras");
    
    //meshes.addColor(controls, 'Color');
    //meshes.add(controls, 'Caja');
    //meshes.add(controls, 'Esfera');
    
    //var managers = gui.addFolder("Robots");

    gui.userData.managersSubfolders = [];

    //$.each( simulator.robotsManagers, function ( index, robotsManager ) {
    //    var manager = managers.addFolder( index );
    //    manager.userData = { robotsManager: robotsManager };
    //    console.log( manager );
    //    gui.userData.managersSubfolders.push ( manager );
    //});

    window.addEventListener('robot_ready',addControls);
    
    


    
    
    return gui;
};
