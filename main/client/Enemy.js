var DungeonHop = DungeonHop || {};
DungeonHop.Enemy = function () {
    var that = {},
        object,
        moveDirection = new THREE.Vector3(),
        world,
        rotationDirection = new THREE.Vector3(),
        rotation = new THREE.Vector3(),
        moving = false,
        nextPosition = new THREE.Vector3(),
        normalScale,
        time = 0,
        moving,
        falling,
        gameStatus,
        playerId,
        server;


    //load the player model (a cube for testing)
    function loadPlayer(geometry,x,z) {
        object = geometry;
        object.castShadow = true;
        object.receiveShadow = false;
        object.position.y = 0;
        object.position.x = x;
        object.position.z = z;
    }

    function updateServer(){
        var xPos = object.position.x;
        var zPos = object.position.z;
        server.emit("updatePosition",playerId,xPos,zPos);
    }

    function getPosition() {
        return object.position;
    }

    function getObject() {
        return object;
    }

    function init(geometry,x,z) {
        loadPlayer(geometry,x,z);
    }

    function updatePosition(x,z){
        object.position.x = x;
        object.position.z = z;
        console.log("updated enemy position");
    }

    that.init = init;
    that.getObject = getObject;
    that.updatePosition = updatePosition;
    return that;
};
