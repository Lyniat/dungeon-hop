/*
 global THREE
 */
var DungeonHop = DungeonHop || {};
DungeonHop.PlayerCamera = function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        zoom = 1 / 100,
        camera = new THREE.OrthographicCamera(-window.innerWidth * zoom, window.innerWidth * zoom, window.innerHeight * zoom, -window.innerHeight * zoom, -100, 1000),
        player,
        serverInterface,
        cameraSpeed = 0.3,
        gameStatus,
        oldPosition;

    /*
     updates the camera position by moving on its own or by the players position.
     after that the new position will be sent to the server
     */
    function updatePosition(delta) {
        var playerObj = player.getObject();
        camera.position.z -= delta * cameraSpeed;
        camera.position.x = playerObj.position.x + 1;
        if (playerObj.position.z + 1.5 < camera.position.z) {
            camera.position.z = playerObj.position.z + 1.5;
        }
        if (Math.ceil(camera.position.z) < oldPosition) {
            oldPosition = Math.ceil(camera.position.z);
            serverInterface.updateCamera(oldPosition);
        }
    }

    function getPosition() {
        return camera.position;
    }

    function getCamera() {
        return camera;
    }

    function init(pl, gameStat, srv) {
        var playerObj,
            playerPosition;
        player = pl;
        gameStatus = gameStat;
        serverInterface = srv;
        playerObj = player.getObject();
        playerPosition = player.getPosition();
        camera.position.x = playerObj.position.x + 1;
        camera.position.y = playerObj.position.y + 5;
        camera.position.z = playerObj.position.z + 3;
        camera.lookAt(playerPosition);
        oldPosition = camera.position.z;
    }

    function update(delta) {
        if (!gameStatus.active) {
            return;
        }
        updatePosition(delta);
    }

    that.init = init;
    that.update = update;
    that.getPosition = getPosition;
    that.getCamera = getCamera;
    that.camera = camera;
    return that;
};

