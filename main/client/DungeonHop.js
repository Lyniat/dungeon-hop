/*
 global THREE
 */

var DungeonHop = DungeonHop || {};
DungeonHop = (function () {
	"use strict";
    /* eslint-env browser  */
    var that = {},
		scene = new THREE.Scene(),
		canvas = document.getElementById("canvas"),
		renderer = new THREE.WebGLRenderer({canvas: canvas}),
		modelManager,
		cameraObj,
		lastTime = Date.now(),
		player,
        directionalLight,
		world,
        server;

   
	//creates a new scene with light and shadow
    function setScene() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xbb0000, 1); //lava red sky
        document.body.appendChild(renderer.domElement);

        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;

        //directional light
        directionalLight = new THREE.DirectionalLight(0xffaaaa, 1);
        directionalLight.position.set(-1, 1.75, 1.5);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = -5;
        directionalLight.shadow.camera.far = 5;

        directionalLight.shadow.camera.left = -5;
        directionalLight.shadow.camera.right = 5;
        directionalLight.shadow.camera.top = 5;
        directionalLight.shadow.camera.bottom = -5;

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
        world.update();
        requestAnimationFrame(render);
        renderer.render(scene, cameraObj.camera);
    };
	
	function createWorld(models) {
        getPlayerModel(models);
        player = new DungeonHop.Player();

        world = new DungeonHop.World();
        world.init(scene, models, player,server);

        player.init(models[0].object,world);
        scene.add(player.getObject());

        cameraObj = new DungeonHop.PlayerCamera();
        cameraObj.init(player);

        setScene();
        render();
    }

    function getPlayerModel(models){
        var i, players = []
        //get all player models
        for (i = 0; i < models.length; i++) {
            var model = models[i];
            if (model["type"] == "players") {
                var modelId = model["id"];
                var modelObject = model["object"];
                players[modelId] = modelObject;
            }
        }

        //get random player model
        var r = Math.random()*players.length;
        r = parseInt(Math.floor(r));
        var playerModel = players[r];
        return playerModel;

    }
	
    function loaded(models) {
        createWorld(models);
    }

	function init() {
        modelManager = new DungeonHop.ModelManager();
        modelManager.init(this);
        server = new DungeonHop.TestServer();
    }
	
    that.loaded = loaded;
    that.init = init;
    return that;
})();
