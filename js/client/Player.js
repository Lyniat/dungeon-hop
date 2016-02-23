var DungeonHop = DungeonHop || {};
DungeonHop.Player = function () {
    var that = {};
    var object;
    var moveDirection = new THREE.Vector3();
    var rotationDirection = new THREE.Vector3();
    var rotation = new THREE.Vector3();
    var moving = false;
    var nextPosition = new THREE.Vector3();

    function init(geometry) {
        loadPlayer(geometry);
        addListeners();
    }

    //load the player model (a cube for testing)
    function loadPlayer(geometry) {
        //var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshLambertMaterial({vertexColors: THREE.FaceColors, side: THREE.FrontSide});
        object = new THREE.Mesh(geometry,material);

        object.scale.set(1/16,1/16,1/16);

        object.position.y = 0;
        object.position.x = 10;
        object.position.z = 10;
    }

    function addListeners() {
        //window.addEventListener("keydown", onKeyDown, false);
        window.addEventListener("keyup", onKeyUp, false);
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

    function update(deltaTime){
        move(deltaTime);
    }

    function move(deltaTime){
        if(moveDirection.z != 0 || moveDirection.x != 0){
            console.log("move");
            object.position.add(moveDirection);
            moveDirection = new THREE.Vector3(0,0,0);
            console.log("player position: x: "+object.position.x+" z: "+object.position.z);
        }

    }

    function getPosition() {
        return object.position;
    }

    function getObject() {
        return object;
    }

    that.init = init;
    that.getPosition = getPosition;
    that.getObject = getObject;
    that.update = update;
    return that;
};
