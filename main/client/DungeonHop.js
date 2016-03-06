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
        gameStatus = {},
        playerId = -1,
        models,
        opponentPlayers = [],
        ip,
        startButton,
        serverInterface;


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

    function createWorld(id) {
        playerId = id;
        var playerModel = getPlayerModel();
        player = new DungeonHop.Player();

        world = new DungeonHop.World();
        world.init(scene, models, player, serverInterface);

        player.init(playerModel, world, gameStatus, serverInterface, playerId, opponentPlayers);
        scene.add(player.getObject());

        cameraObj = new DungeonHop.PlayerCamera();
        cameraObj.init(player, gameStatus);

        setScene();
        serverInterface.setLoaded(player.getPosition().x, player.getPosition().z);
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
        //connectToServer();
        serverInterface = new DungeonHop.ServerInterface();
        serverInterface.init(that, ip);
    }

    function init(i) {
        startButton = document.getElementById("start");
        startButton.addEventListener("click", startClicked);
        ip = i;
        gameStatus.active = false;
        modelManager = new DungeonHop.ModelManager();
        modelManager.init(this);
    }

    function startClicked() {
        serverInterface.setReady();
    }

    function startGame(){
        gameStatus.active = true;
    }

    function setPlayers(id, xPos, zPos) {
        if (opponentPlayers[id] == undefined && id != playerId) {
            console.log("added new player");
            var opponent = new DungeonHop.Opponent();
            var model = getPlayerModel();
            opponent.init(model, xPos, zPos);
            scene.add(opponent.getObject());
            opponentPlayers[id] = opponent;
        }
    }

    function removeChunk(pos){
        world.removeChunk(pos);
    }

    function destroyPlayer(id){
        if (id == playerId) {
            player.die();
        }
        else if (opponentPlayers[id] != undefined) {
            scene.remove(opponentPlayers[id]);
        }
    }

    function updatePlayers(id, xPos, zPos) {
        if (opponentPlayers[id] != undefined && id != playerId) {
            opponentPlayers[id].updatePosition(xPos, zPos);
        }
    }

    that.loaded = loaded;
    that.startGame = startGame;
    that.setPlayers = setPlayers;
    that.createWorld = createWorld;
    that.updatePlayers = updatePlayers;
    that.removeChunk = removeChunk;
    that.destroyPlayer = destroyPlayer;
    that.init = init;
    return that;
})();
