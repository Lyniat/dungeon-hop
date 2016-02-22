var DungeonHop = DungeonHop || {};
DungeonHop.Player = function () {
    var that = {};
    var object;
    var moveDirection = new THREE.Vector3();
    var rotationDirection = new THREE.Vector3();
    var rotation = new THREE.Vector3();

    function init() {
        loadPlayer();
        addListeners();
    }

    //load the player model (a cube for testing)
    function loadPlayer() {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({color: 0xff0000});
        object = new THREE.Mesh(geometry, material);

        object.position.y = 0;
        object.position.x = 10;
        object.position.z = 10;
    }

    function addListeners() {
        window.addEventListener("keydown", onKeyDown, false);
        window.addEventListener("keyup", onKeyUp, false);
    }

    function onKeyDown(evt) {
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

    function getPosition() {
        return object.position;
    }

    function getObject() {
        return object;
    }

    that.init = init;
    that.getPosition = getPosition;
    that.getObject = getObject;
    return that;
};
