//var host = '127.0.0.1:9080';
//var host = '192.168.1.12:9080';
var host = 'silent-robot-304412.rj.r.appspot.com';
var simulationDefaults = {
    stats: {
        mode: 0 // 0: fps, 1: ms, 2: mb (see http://github.com/mrdoob/stats.js)
        },
    robotsManagers: {
        main: {
            url: "http://" + host + "/update",
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
        backgroundColor: 0xfac94e,
        shadows: false, 
    },
    mainCamera: {
        fov: 60,
        aspect: window.innerWidth / window.innerHeight,
        near: 1,
        far: 1000,
        position: new THREE.Vector3 ( 0, 150, 100 ),
        lookAt: new THREE.Vector3( 0, 0, 0 )
    },
    light: {
        color: 0xFFFFFF,
        intensity: 2,
        position: new THREE.Vector3( 25, 250, 80 ),
        near: 11,
        far: 600
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
                sizeX: 256,
                sizeY: 2,
                sizeZ: 256,
                position: new THREE.Vector3( 0, -1, 0 )
            },
            leftBorder: {
                sizeX: 4,
                sizeY: 100,
                sizeZ: 256,
                position: new THREE.Vector3( -130, 2, 0 ),
                color: 0xE8AE8A
            },
            rightBorder: {
                sizeX: 4,
                sizeY: 4,
                sizeZ: 256,
                position: new THREE.Vector3( 130, 2, 0 ),
                color: 0xE8AE8A
            },
            topBorder: {
                sizeX: 264,
                sizeY: 4,
                sizeZ: 4,
                position: new THREE.Vector3( 0, 2, -130 ),
                color: 0xE8AE8A
            },
            bottomBorder: {
                sizeX: 264,
                sizeY: 4,
                sizeZ: 4,
                position: new THREE.Vector3( 0, 2, 130 ),
                color: 0xE8AE8A
            },/*
            wall_1: {  
                sizeX: 160,
                sizeY: 16,
                sizeZ: 4,
                position: new THREE.Vector3( 2, 8, -80 ),
                color: 0xADD8E6,
                // rotation: new THREE.Vector3( 0, Math.PI / 10, 0 )
            },
            wall_2: {
                sizeX: 4,
                sizeY: 16,
                sizeZ: 160,
                position: new THREE.Vector3( -80, 8, -2 ), 
                color: 0xFCB6FC,
                opacity: 0.4,
                mass: 100
            },
            wall_3: {
                sizeX: 4,
                sizeY: 16,
                sizeZ: 160,
                position: new THREE.Vector3( 80, 8, 2 ), 
                color: 0xD5FDD5,
                opacity: 0.4
            },
            wall_4: {
                sizeX: 160,
                sizeY: 16,
                sizeZ: 4,
                position: new THREE.Vector3( -2, 8, 80 ), 
                color: 0xFFD891,
                opacity: 0.4
            }*/
        }
    }
    
}

