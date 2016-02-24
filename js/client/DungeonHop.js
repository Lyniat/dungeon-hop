/**
 * Created by laurin on 22.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop = (function () {
    var that = {};
    var time = document.querySelector('#timer');
    var seconds = 0;
    var scene = new THREE.Scene();

    var canvas = document.getElementById("canvas");
    var renderer = new THREE.WebGLRenderer({ canvas: canvas });

    var cameraObj;

    var lastTime = Date.now();

    var player;

    function init(){
        var modelManager = DungeonHop.ModelManager();
        modelManager.init();

        var world = new DungeonHop.World();
        world.init(scene);

        player = new DungeonHop.Player();
        player.init(modelManager.getGekko());
        scene.add(player.getObject());

        cameraObj = new DungeonHop.PlayerCamera();
        cameraObj.init(player);
        setInterval(setTime, 1000);
        setScene();
        render();
    }

    //sets the time starting with 00:00
    function setTime() {
        console.log('hallo');
        var min, sec;
        seconds++;
        min = Math.floor(seconds / 60);
        sec = Math.floor(seconds % 60);
        if (min < 10) {
            min = "0" + min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }
        time.innerHTML = min + ":" + sec;
    }

    //creates a new scene with light and shadow
    function setScene() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x33ccff, 1); //lovely baby blue sky
        document.body.appendChild(renderer.domElement);

        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;

        //directional light
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(-1, 1.75, -1.5).normalize();
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0;
        directionalLight.shadow.camera.far = 15;

        directionalLight.shadow.camera.left= -5;
        directionalLight.shadow.camera.right = 5;
        directionalLight.shadow.camera.top = 5;
        directionalLight.shadow.camera.bottom = -5;

        scene.add(directionalLight);
        scene.add(directionalLight);

        var light = new THREE.AmbientLight(0x999999); // soft white light
        scene.add(light);
    }

    //calculates the time between the frames
    function getDeltaTime() {
        var actualTime = Date.now();
        var delta = actualTime - lastTime;
        lastTime = actualTime;
        delta /= 1000;
        return delta;
    }

    //renders the scene every frame
    var render = function () {
        var delta = getDeltaTime();
        player.update(delta);
        cameraObj.update(delta);
        requestAnimationFrame(render);
        renderer.render(scene, cameraObj.camera);
    };

    that.init = init;
    return that;
})();
