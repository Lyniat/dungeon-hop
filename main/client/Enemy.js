var DungeonHop = DungeonHop || {};
DungeonHop.Enemy = function () {
    var that = {},
        object,
        player,
        oldPosition,
        moveDirection = new THREE.Vector3(),
        animationNum = 0;


    //load the player model (a cube for testing)
    function loadPlayer(geometry,x,z) {
        object = geometry;
        object.castShadow = true;
        object.receiveShadow = false;
        object.position.y = 0;
        object.position.x = x;
        object.position.z = z;
    }

    function getPosition() {
        var x = Math.round(object.position.x);
        var z = Math.round(object.position.z);
        return {x:x,z:z};
    }

    function getObject() {
        return object;
    }

    function init(geometry,x,z,pl) {
        loadPlayer(geometry,x,z);
        player = pl;
        oldPosition = new THREE.Vector3(x,0,z);
    }

    function movePosition(t,x,z,anNum){
        setTimeout(function() {
            if(anNum != animationNum){
                return;
            }
            t--;
            object.position.x += x/10;
            object.position.z += z/10;
            object.position.y = 0.5-Math.abs(0.5-t/10);
            if(t > 0) {
                movePosition(t,x,z,anNum);
            }
            else{
                object.position.x = Math.round(object.position.x);
                object.position.z = Math.round(object.position.z);
            }

        }, 10);
    }

    function checkPlayerCollision(x,z){
        var nextX = x + Math.round(object.position.x);
        var nextZ = z + Math.round(object.position.z);
        if(player.getPosition().x == nextX && player.getPosition().z == nextZ){
            player.informEnemyCollision();
        }
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

    function updatePosition(x,z){
        object.position.y = 0;
        object.position.x = oldPosition.x;
        object.position.z = oldPosition.z;
        var newX = x- oldPosition.x;
        var newZ = z - oldPosition.z;
        checkPlayerCollision(newX,newZ);
        animationNum++;
        movePosition(10,newX,newZ,animationNum);
        moveDirection.x = x - oldPosition.x;
        moveDirection.z = z - oldPosition.z;
        rotate();
        oldPosition.x = x;
        oldPosition.z = z;
    }

    that.init = init;
    that.getObject = getObject;
    that.getPosition = getPosition;
    that.updatePosition = updatePosition;
    return that;
};
