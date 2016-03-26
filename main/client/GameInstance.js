/*
 global THREE
 */

var DungeonHop = DungeonHop || {};
DungeonHop.GameInstance = function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        scene = new THREE.Scene(),
        canvas = document.getElementById("canvas"),
        infoText = document.getElementById("info-text"),
        renderer,
        cameraObj,
        lastTime = Date.now(),
        player,
        directionalLight,
        world,
        gameStatus = {},
        playerId = -1,
        models,
        opponentPlayers = [],
        enemies = [],
        ip,
        startButton,
        serverInterface,
        playerName = " ";


    //creates a new scene with light and shadow
    function setScene() {

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
        showOpponentLabels();
        showPlayerLabels();
    };

    function createWorld(id) {
        playerId = id;
        var playerModel = getPlayerModel(id);
        player = new DungeonHop.Player();

        world = new DungeonHop.World();
        world.init(scene, models, player, serverInterface);

        player.init(playerModel, world,scene, gameStatus, serverInterface, playerId, opponentPlayers, enemies);

        cameraObj = new DungeonHop.PlayerCamera();
        cameraObj.init(player, gameStatus,serverInterface);

        setScene();
        serverInterface.setLoaded(player.getPosition().x, player.getPosition().z);
        render();

        infoText.innerHTML = "PRESS START IF YOU ARE READY";
    }

    function getPlayerModel(id) {
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

        if(id < 0) {
            //get random player model
            var r = Math.random() * players.length;
            r = parseInt(Math.floor(r));
            var playerModel = players[r];
            return playerModel.clone();
        }
        else {
            var playerModel = players[id];
            return playerModel.clone();
        }
    }

    function getEnemyModel() {
        var i, players = [];
        //get all player models
        for (i = 0; i < models.length; i++) {
            var model = models[i];
            if (model["type"] == "enemies") {
                if(model["name"] == "bad_gecko"){
                    var enemyModel = model["object"];
                    return enemyModel.clone();
                }
            }
        }

        //get random player model
        var r = Math.random() * players.length;
        r = parseInt(Math.floor(r));
        var playerModel = players[r];
        return playerModel.clone();

    }

    /*
    function loaded(mdls) {
        models = mdls;
        //connectToServer();
        serverInterface = new DungeonHop.ServerInterface();
        serverInterface.init(that, ip,playerName);
        infoText.innerHTML = "CONNECTING TO SERVER";
    }
    */

    function init(i,name,mdls,srv,rend){
        renderer = rend;
        ip = i;
        playerName = name;
        models = mdls;
        serverInterface = srv;
        gameStatus.active = false;
        startButton = document.getElementById("start");
        startButton.addEventListener("click", startClicked);
    }

    /*
    function init(i,name) {
        infoText.innerHTML = "LOADING...";
        startButton = document.getElementById("start");
        startButton.addEventListener("click", startClicked);
        ip = i;
        playerName = name;
        gameStatus.active = false;
        modelManager = new DungeonHop.ModelManager();
        modelManager.init(this);
    }
    */

    function startClicked() {
        serverInterface.setReady();
        infoText.innerHTML = "Waiting for other Players";
    }

    function startGame() {
        gameStatus.active = true;
    }

    function setPlayers(id,name, xPos, zPos) {
        if (opponentPlayers[id] == undefined && id != playerId) {
            console.log("added new player");
            var opponent = new DungeonHop.Opponent();
            var model = getPlayerModel(id);
            opponent.init(model,scene, xPos, zPos,name);
            scene.add(opponent.getObject());
            opponentPlayers[id] = opponent;
        }
    }

    function showInfoForTime(info,t){
        infoText.innerHTML = info;
        setTimeout(function() {
            if(infoText.innerHTML == info){
                infoText.innerHTML = " ";
            }
        }, t*1000);
    }

    function removeChunk(pos) {
        //check if player is outside
        if(player.getPosition().z >= pos){
            //not the right one but with this event, he also dies
            player.informEnemyCollision();
        }
        //check if enemies are outside
        for(var i = 0; i < enemies.length; i++){
            var enemy = enemies[i];
            if (enemy.getPosition().z >= pos){
                scene.remove(enemy.getObject());
            }
        }
        world.removeChunk(pos);
    }

    function setPlayerDead(id) {
        console.log("player dead");
        if (id == playerId) {
            player.die();
        }
        else if (opponentPlayers[id] != undefined) {
            showInfoForTime("Player "+id+" died!",3);
            opponentPlayers[id].die();
        }
    }

    function updatePlayers(id, xPos, zPos) {
        if (opponentPlayers[id] != undefined && id != playerId) {
            opponentPlayers[id].updatePosition(xPos, zPos);
        }
    }

    function setInfoText(text) {
        console.log("info text: " + text);
        infoText.innerHTML = text;
    }

    function createNewEnemy(id, xPos, zPos) {
        if (enemies[id] != undefined) {
            return;
        }
        var enemy = new DungeonHop.Enemy();
        var model = getEnemyModel();
        enemy.init(model, xPos, zPos, player);
        enemies[id] = enemy;
        scene.add(enemy.getObject());
    }

    function updateEnemyPosition(id, xPos) {
        var enemy = enemies[id];
        if (enemy != undefined && enemy != null) {
            enemy.updatePosition(xPos, enemy.getPosition().z);
        }
    }

    //http://stackoverflow.com/questions/27409074/three-js-converting-3d-position-to-2d-screen-position-r69
    function showPlayerLabels() {
        var proj = toScreenPosition(player.getObject(), cameraObj.getCamera());
        var label = document.getElementById("player-label");
        label.style.left = proj.x + 'px';
        label.style.top = proj.y + 'px';
        label.style.visibility = "visible";
    }

    function toScreenPosition(obj, camera)
    {
        var vector = new THREE.Vector3();

        var widthHalf = 0.5*renderer.context.canvas.width;
        var heightHalf = 0.5*renderer.context.canvas.height;

        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(camera);

        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = - ( vector.y * heightHalf ) + heightHalf;

        return {
            x: vector.x,
            y: vector.y
        };

    }

    function showOpponentLabels(){
        for(var i = 0; i < opponentPlayers.length; i++) {
            var opponent = opponentPlayers[i];
            if(opponent == undefined){
                continue;
            }
            var proj = toScreenPosition(opponent.getObject() ,cameraObj.getCamera());
            var label = document.getElementById("opponent-"+i+"-label");
            if(label == null){
                label = document.createElement("p");
                var t = document.createTextNode(opponent.getName());
                label.appendChild(t);
                label.className = "opponent-label";
                label.id = "opponent-"+i+"-label";
                document.body.appendChild(label);
            }else {
                label.style.left = proj.x + 'px';
                label.style.top = proj.y + 'px';
                label.style.visibility = "visible";
            }
        }
    }

    function destroy(){
        for( var i = scene.children.length - 1; i >= 0; i--) {
            var obj = scene.children[i];
            //renderer.deallocateObject(obj);
            scene.remove(obj);
        }
    }

    that.startGame = startGame;
    that.setPlayers = setPlayers;
    that.createWorld = createWorld;
    that.updatePlayers = updatePlayers;
    that.removeChunk = removeChunk;
    that.setPlayerDead = setPlayerDead;
    that.setInfoText = setInfoText;
    that.createNewEnemy = createNewEnemy;
    that.updateEnemyPosition = updateEnemyPosition;
    that.init = init;
    that.destroy = destroy;
    return that;
};
