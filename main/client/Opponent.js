var DungeonHop = DungeonHop || {};
DungeonHop.Opponent = function () {
    var that = {},
        object,
        oldPosition,
        moveDirection = new THREE.Vector3(),
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

    function rotate() {
        if (moveDirection.x == -1) {
            //left
            object.rotation.y = Math.PI / 2;
        }
        if (moveDirection.x == 1) {
            //left
            object.rotation.y = -Math.PI / 2;
        }
        if (moveDirection.z == -1) {
            //forward
            object.rotation.y = 0;
        }
        if (moveDirection.z == 1) {
            //backward
            object.rotation.y = Math.PI;
        }
    }

    function getPosition() {
        return object.position;
    }

    function getObject() {
        return object;
    }

    function init(geometry,x,z) {
        loadPlayer(geometry,x,z);
        oldPosition = new THREE.Vector3(x,0,z);
    }

    function updatePosition(x,z){
        object.position.x = x;
        object.position.z = z;
        moveDirection.x = x - oldPosition.x;
        moveDirection.z = z - oldPosition.z;
        rotate();
        oldPosition.x = x;
        oldPosition.z = z;
        console.log("updated enemy position");
    }

    that.init = init;
    that.getObject = getObject;
    that.getPosition = getPosition;
    that.updatePosition = updatePosition;
    return that;
};
