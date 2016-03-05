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
        server,
        gameStatus = {},
        playerId = -1,
        models,
        enemyPlayers = [],
        ip;


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
        //waitForStart();
        var delta = getDeltaTime();
        player.update(delta);
        cameraObj.update(delta);
        world.update();
        requestAnimationFrame(render);
        renderer.render(scene, cameraObj.camera);
    };

    function createWorld() {
        var playerModel = getPlayerModel();
        player = new DungeonHop.Player();

        world = new DungeonHop.World();
        world.init(scene, models, player, server);

        player.init(playerModel, world, gameStatus, server, playerId);
        scene.add(player.getObject());

        cameraObj = new DungeonHop.PlayerCamera();
        cameraObj.init(player, gameStatus);

        setScene();
        server.emit("loaded", playerId, player.getPosition().x, player.getPosition().z);
        console.log("loading: " + playerId);
        render();
    }

    function getPlayerModel() {
        var i, players = [];
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
        var r = Math.random() * players.length;
        r = parseInt(Math.floor(r));
        var playerModel = players[r];
        return playerModel.clone();

    }

    function loaded(mdls) {
        models = mdls;
        connectToServer();
    }

    function init(i) {
        ip = i;
        gameStatus.active = false;
        modelManager = new DungeonHop.ModelManager();
        modelManager.init(this);
    }

    function connectToServer() {
        server = io(ip);
        getId();
        //waitForStart();
        getPlayers();
        waitForStart();
    }

    function waitForStart() {
        server.on("startGame", function () {
            console.log("starting");
            gameStatus.active = true;
            updatePlayers();
        });
    }

    function getPlayers() {
        server.on("newPlayer", function (id, xPos, zPos) {
            console.log("retrieving player");
            if (enemyPlayers[id] == undefined && id != playerId) {
                console.log("added new player");
                var enemy = new DungeonHop.Enemy();
                var model = getPlayerModel();
                enemy.init(model, xPos, zPos);
                scene.add(enemy.getObject());
                enemyPlayers[id] = enemy;
            }
            console.log("enemy players:");
            console.log(enemyPlayers);
        });
    }

    function updatePlayers(){
        server.on("updatePlayer", function (id, xPos, zPos) {
            console.log("updating player");
            if (enemyPlayers[id] != undefined && id != playerId) {
                enemyPlayers[id].updatePosition(xPos,zPos);
            }
        });
    }

    function getId() {
        server.on("setPlayerId", function (id) {
            playerId = id;
            console.log("player id: " + playerId);
            createWorld();
        });
    }

    that.loaded = loaded;
    that.init = init;
    return that;
})();
