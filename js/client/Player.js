var DungeonHop = DungeonHop || {};
DungeonHop.Player = function () {
	"use strict";
    /* eslint-env browser  */
    var that = {},
		object,
		moveDirection = new THREE.Vector3(),
        world,
		rotationDirection = new THREE.Vector3(),
		rotation = new THREE.Vector3(),
		moving = false,
		nextPosition = new THREE.Vector3();

   

    //load the player model (a cube for testing)
    function loadPlayer(geometry) {
        object = geometry;
        object.position.y = 0;
        object.position.x = 5;
        object.position.z = 0;
    }

	function onKeyUp(evt) {
        if (evt.keyCode == "87") {
            moveDirection.z = -1;
        }
        if (evt.keyCode == "83") {
            moveDirection.z = 1;
        }
        if (evt.keyCode == "65") {
            moveDirection.x = -1;
        }
        if (evt.keyCode == "68") {
            moveDirection.x = 1;
        }
    }
	
    function addListeners() {
        //window.addEventListener("keydown", onKeyDown, false);
        window.addEventListener("keyup", onKeyUp, false);
    }
	
    /*
    function onKeyUp(evt) {
        if (evt.keyCode == "87") {
            moveDirection.z = 0;
        }
        if (evt.keyCode == "83") {
            moveDirection.z = 0;
        }
        if (evt.keyCode == "65") {
            moveDirection.x = 0;
        }
        if (evt.keyCode == "68") {
            moveDirection.x = 0;
        }
    }
    */
	
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

	function move(deltaTime) {
        var field;
        if (moveDirection.z != 0 || moveDirection.x != 0) {
            console.log("move");

            rotate(moveDirection);

            field = world.getEntryInMatrix(object.position.x + moveDirection.x,object.position.z + moveDirection.z);
            if(field != -1){
                moveDirection = new THREE.Vector3(0, 0, 0);
                return;
            }

            object.position.add(moveDirection);
            moveDirection = new THREE.Vector3(0, 0, 0);
            console.log("player position: x: " + object.position.x + " z: " + object.position.z);
        }

    }
	
    function update(deltaTime) {
        move(deltaTime);
    }
	
    function getPosition() {
        return object.position;
    }

    function getObject() {
        return object;
    }

	function init(geometry,wrld) {
        world = wrld;
        loadPlayer(geometry);
        addListeners();
    }
	
    that.init = init;
    that.getPosition = getPosition;
    that.getObject = getObject;
    that.update = update;
    return that;
};
