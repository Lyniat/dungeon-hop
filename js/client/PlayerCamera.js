var DungeonHop = DungeonHop || {};
DungeonHop.PlayerCamera = function () {
    var that = {};
    var rotation = new THREE.Vector3();
    //var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var zoom = 1/100;
    var camera = new THREE.OrthographicCamera( -window.innerWidth*zoom, window.innerWidth*zoom,window.innerHeight*zoom ,-window.innerHeight*zoom, -100, 1000 );
    var player;
    var cameraSpeed = 0.1;


    function init(pl) {
        player = pl;
        var playerObj = player.getObject();
        camera.position.x = playerObj.position.x+1;
        camera.position.y = playerObj.position.y +5;
        camera.position.z = playerObj.position.z+3;
        var playerPosition = player.getPosition();
        camera.lookAt(playerPosition);
    }

    function update(delta) {
        updatePosition(delta);
        updateCamera();
    }

    function updatePosition(delta) {
        var playerObj = player.getObject();
        camera.position.z -= delta * cameraSpeed;
        camera.position.x = playerObj.position.x+1;
        if(playerObj.position.z+1.5 < camera.position.z){
            camera.position.z = playerObj.position.z+1.5;
        }
    }

    function updateCamera() {
        //var playerPosition = player.getPosition();
        //camera.lookAt(playerPosition);
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

