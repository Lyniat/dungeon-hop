var DungeonHop = DungeonHop || {};
DungeonHop.PlayerCamera = function () {
    var that = {};
    var rotation = new THREE.Vector3();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var player;


    function init(pl) {
        player = pl;
        camera.rotation.x = 0;
        camera.rotation.y = 0;
        camera.rotation.z = 0;
    }

    function update(delta) {
        updatePosition();
        updateCamera();
    }

    function updatePosition() {
        var playerObj = player.getObject();
        camera.position.x = playerObj.position.x+3;
        camera.position.y = playerObj.position.y + 10;
        camera.position.z = playerObj.position.z+3;
    }

    function updateCamera() {
        var playerPosition = player.getPosition();
        camera.lookAt(playerPosition);
    }

    function getPosition() {
        return position;
    }

    function getCamera() {
        return camera;
    }

    that.init = init;
    that.update = update;
    that.getPosition = getPosition;
    that.getCamera = getCamera;
    that.camera = camera;
    return that;
};

