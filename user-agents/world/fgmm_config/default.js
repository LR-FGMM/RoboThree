var host = '';
//var host = '192.168.1.12:9080';
//var host = 'silent-robot-304412.rj.r.appspot.com';
var wall_size = 1500;
var wall_height = 700;
var wall_width = 1024;
var wall_thick = 4;
var simulationDefaults = {
    stats: {
        mode: 0 // 0: fps, 1: ms, 2: mb (see http://github.com/mrdoob/stats.js)
        },
    robotsManagers: {
        controlador: {
            url:"/update",
            failureColor: 0xffaaaa,
            robots: [
                {
                    id: 'arm',
                    name: "Arm",
                    owner: 'Player One',
                    class: 'ArmRobotRepresentation',
                    initialValues: {
                        debugging: false
                    }
                }
            ]
        }
    },
    scene: {
        gravity: new THREE.Vector3(0, -40, 0),
    },
    renderer: {
        antialias: true,
        shadows: true, 
        backgroundColor: "gray"

    },
    mainCamera: {
        fov: 60,
        aspect: window.innerWidth/(2*window.innerHeight),
        near: 1,
        far: 5000,
        position: new THREE.Vector3 ( 0, 150, 100 ),
        lookAt: new THREE.Vector3( 0, 0, 0 )
    },
    light: {
        color: 0xFFFFFF,
        intensity: 0.3,
        position: new THREE.Vector3( -28, 281, 218 ),
        near: 11,
        far: 700
    },
    axisHelper: {
        visible: true,
        length: 10
    },
    ground: {
        texture: 'assets/textures/general/floor-wood-256.png',
        friction: 1.0,
        restitution: 0.1,
        pieces: {
            bottom: {
                sizeX: 1024,
                sizeY: 2,
                sizeZ: 1024,
                position: new THREE.Vector3( 0, -1, 0 )
            },
            /* top: {
                sizeX: 1024,
                sizeY: 2,
                sizeZ: 1024,
                position: new THREE.Vector3(0,250,0)
            }, */
            leftBorder: {
                sizeX: wall_thick*2,
                sizeY: wall_height,
                sizeZ: wall_width,
                position: new THREE.Vector3( -wall_width/2-wall_thick, wall_height/2, 0 ),
                color: 0xE8AE8A
            },
            rightBorder: {
                sizeX: wall_thick*2,
                sizeY: wall_height,
                sizeZ: wall_width,
                position: new THREE.Vector3( wall_width/2+wall_thick, wall_height/2, 0 ),
                color: 0xE8AE8A
            },
            topBorder: {
                sizeX: wall_width,
                sizeY: wall_height,
                sizeZ: wall_thick*2,
                position: new THREE.Vector3( 0, wall_height/2, -wall_width/2-wall_thick ),
                color: 0xE8AE8A
            },
            /*bottomBorder: {
                sizeX: 600,
                sizeY: 200,
                sizeZ: 4,
                position: new THREE.Vector3( 0, 100, 300 ),
                color: 0xE8AE8A
            },/* 
            wall_1: {  
                sizeX: 800,
                sizeY: 160,
                sizeZ: 4,
                position: new THREE.Vector3( 2, 8, -800 ),
                color: 0xADD8E6,
                // rotation: new THREE.Vector3( 0, Math.PI / 10, 0 )
            },
            wall_2: {
                sizeX: 4,
                sizeY: 160,
                sizeZ: 800,
                position: new THREE.Vector3( -800, 8, -2 ), 
                color: 0xFCB6FC,
                opacity: 1,
                mass: 100
            },
            wall_3: {
                sizeX: 4,
                sizeY: 160,
                sizeZ: 800,
                position: new THREE.Vector3( 800, 8, 2 ), 
                color: 0xD5FDD5,
                opacity: 1
            },
            wall_4: {
                sizeX: 800,
                sizeY: 160,
                sizeZ: 4,
                position: new THREE.Vector3( -2, 8, 800 ), 
                color: 0xFFD891,
                opacity: 1
     } */
    }
   }
    
}

