var DungeonHop = DungeonHop || {};
DungeonHop.PlayerCamera = function () {
	"use strict";
    /* eslint-env browser  */
    var that = {},
		rotation = new THREE.Vector3(),
    //var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		zoom = 1 / 100,
		camera = new THREE.OrthographicCamera(-window.innerWidth * zoom, window.innerWidth * zoom, window.innerHeight * zoom, -window.innerHeight * zoom, -100, 1000),
		player,
		cameraSpeed = 0.3;


    

  

    function updatePosition(delta) {
        var playerObj = player.getObject();
        camera.position.z -= delta * cameraSpeed;
        camera.position.x = playerObj.position.x + 1;
        if (playerObj.position.z + 1.5 < camera.position.z) {
            camera.position.z = playerObj.position.z + 1.5;
        }
        checkIfPlayerIsInScreen();
    }

    function checkIfPlayerIsInScreen(){
    }

    function updateCamera() {
        //var playerPosition = player.getPosition();
        //camera.lookAt(playerPosition);
    }

    function getPosition() {
        return camera.position;
    }

    function getCamera() {
        return camera;
    }
	function init(pl) {
        player = pl;
        var playerObj = player.getObject(),
			playerPosition = player.getPosition();
        camera.position.x = playerObj.position.x + 1;
        camera.position.y = playerObj.position.y + 5;
        camera.position.z = playerObj.position.z + 3;
        camera.lookAt(playerPosition);
    }
	
	function update(delta) {
        updatePosition(delta);
        updateCamera();
    }

    that.init = init;
    that.update = update;
    that.getPosition = getPosition;
    that.getCamera = getCamera;
    that.camera = camera;
    return that;
};

