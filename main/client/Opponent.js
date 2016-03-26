/*
 global THREE
 */
var DungeonHop = DungeonHop || {};
DungeonHop.Opponent = function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        object,
        oldPosition,
        moveDirection = new THREE.Vector3(),
        animationNum = 0,
        scene,
        name;


    //load the player model (a cube for testing)
    function loadPlayer(geometry, x, z) {
        object = geometry;
        object.castShadow = true;
        object.receiveShadow = false;
        object.position.y = 0;
        object.position.x = x;
        object.position.z = z;
    }

    function getPosition() {
        return object.position;
    }

    function getObject() {
        return object;
    }

    function init(geometry, scn, x, z, n) {
        scene = scn;
        loadPlayer(geometry, x, z);
        name = n;
        oldPosition = new THREE.Vector3(x, 0, z);
    }

    function movePosition(t, x, z, anNum) {
        setTimeout(function () {
            if (anNum != animationNum) {
                return;
            }
            t--;
            object.position.x += x / 10;
            object.position.z += z / 10;
            object.position.y = t / 10;
            if (t > 0) {
                movePosition(t, x, z, anNum);
            } else {
                object.position.x = Math.round(object.position.x);
                object.position.z = Math.round(object.position.z);
            }

        }, 10);
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

    function updatePosition(x, z) {
        var newX,
            newZ;
        object.position.y = 0;
        object.position.x = oldPosition.x;
        object.position.z = oldPosition.z;
        newX = x - oldPosition.x;
        newZ = z - oldPosition.z;
        animationNum++;
        movePosition(10, newX, newZ, animationNum);
        moveDirection.x = x - oldPosition.x;
        moveDirection.z = z - oldPosition.z;
        rotate();
        oldPosition.x = x;
        oldPosition.z = z;
        console.log("updated opponent position");
    }

    function die() {
        var particles,
            particleSystem;
        scene.remove(object);
        setTimeout(function () {
            particles = new DungeonHop.Particles();
                particleSystem = particles.init(getPosition().x, 1, getPosition().z, "skull");
            scene.add(particleSystem);
            setTimeout(function () {
                scene.remove(particleSystem);
            }, 4000);
        }, 200);
    }

    function getName() {
        return name;
    }

    that.init = init;
    that.getObject = getObject;
    that.getPosition = getPosition;
    that.updatePosition = updatePosition;
    that.die = die;
    that.getName = getName;
    return that;
};
