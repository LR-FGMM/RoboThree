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
                var property = 'Agregar robot: '+robot.id;
                controls[property] = function () {
                    if ( robot.build(l1,l2,l3,l4) ) {
                        if ( robot.hasCamera() ) {
                            gui.userData.cameras[robot.id] = robot.camera.uuid;
                            
                            for (var i in gui.__controllers) {
                                // gui.__controllers[i].updateDisplay(); // does not update the list shown
                                
                                if ( gui.__controllers[i].property == 'selectedCamera' ) {
                                    
                                    var option, t, att;
                                    for ( var j in gui.userData.cameras ) {
                                        // if the camera is not in the list of options, add it
                                        if ( $("option[value='" + gui.userData.cameras[j] + "']").length === 0 ) {
                                            option = document.createElement ( 'option' );
                                            t = window.document.createTextNode ( j );
                                            option.appendChild ( t );
                                            att = document.createAttribute("value");
                                            att.value = gui.userData.cameras[j];
                                            option.setAttributeNode(att);
                                            gui.__controllers[i].__select.appendChild ( option );
                                        }
                                    }
                                }
                            }
                        }
                                    
                        if ( typeof robot.initialValues !== 'undefined' ) {
                            if ( typeof robot.initialValues.position !== 'undefined' ) {
                                robot.move ( robot.initialValues.position, false );
                            }
                        }
                    }
                }
                manager.add(controls, property);
                

                property = 'rotar +yaw'
                controls[property] = function () {
                    robot.updateJointsAngles(50,0);
                }
                manager.add(controls, property);

                property = 'rotar -yaw'
                controls[property] = function () {
                    robot.updateJointsAngles(-50,0);
                }
                manager.add(controls, property);

                property = 'rotar +pitch'
                controls[property] = function () {
                    robot.updateJointsAngles(0,25);
                }
                manager.add(controls, property);

                property = 'rotar -pitch'
                controls[property] = function () {
                    robot.updateJointsAngles(0,-25);
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
    
    
    var light = gui.addFolder("Luz principal");
    light.add(controls, 'X', -800, 800).onChange(controls.changeLight);
    light.add(controls, 'Y', 0, 800).onChange(controls.changeLight);
    light.add(controls, 'Z', -800, 800).onChange(controls.changeLight);
    light.add(controls, 'Intensidad', 0, 10).onChange(controls.changeLight);

    var meshes = gui.addFolder("Agregar figuras");
    
    meshes.addColor(controls, 'Color');
    meshes.add(controls, 'Caja');
    meshes.add(controls, 'Esfera');
    
    var managers = gui.addFolder("Agregar robot");

    gui.userData.managersSubfolders = [];

    $.each( simulator.robotsManagers, function ( index, robotsManager ) {
        var manager = managers.addFolder( index );
        manager.userData = { robotsManager: robotsManager };
        console.log( manager );
        gui.userData.managersSubfolders.push ( manager );
    });
    
    

    const loader = new THREE.STLLoader();

    var l1, l2, l3, l4;

    loader.load( './models/base.stl', function ( geometry ) {

        const material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
        l1 = new THREE.Mesh( geometry, material );
        next();

        
    } );
    
    loader.load( './models/brazos.stl', function ( geometry ) {

        const material2 = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
        l2 = new THREE.Mesh( geometry, material2 );
        next();

        
    } );

    loader.load( './models/cabeza.stl', function ( geometry ) {

        const material3 = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
        l3 = new THREE.Mesh( geometry, material3 );
        next();

        
    } );

    loader.load( './models/luz.stl', function ( geometry ) {

        const material4 = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
        l4 = new THREE.Mesh( geometry, material4 );
        next();

        
    } );

    



    function next() {
        if (l1 && l2 && l3 && l4) {
          console.log('done');
          console.log ( "adding actual robots..." );
          setTimeout ( addRobotsToGui, 5000, simulator, gui,l1 ,l2,l3,l4);
          console.log(gui.userData);
        }
      }

    return gui;
};
