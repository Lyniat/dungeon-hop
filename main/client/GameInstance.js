/*
 global THREE
 */

var DungeonHop = DungeonHop || {};
DungeonHop.GameInstance = function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        GAME_VERSION = 1459098998.47, //this will be automatically updated by the python script
        scene = new THREE.Scene(),
        infoText = document.getElementById("info-text"),
        timer = document.getElementById("timer"),
        seconds = 0,
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
        startButton,
        serverInterface,
        render,
        playerName;

    /*
     this function should create a scene with light and shadow.
     but shadow is buggy atm, so we dont use it
     */
    function setScene() {
        var light;

        //directional light
        directionalLight = new THREE.DirectionalLight(0xEFDDDD, 1.3);
        directionalLight.position.set(-1, 2.75, 1.5);
        /*
         directionalLight.castShadow = true;
         directionalLight.receiveShadow = true;
         directionalLight.shadow.camera.near = -5;
         directionalLight.shadow.camera.far = 5;

         directionalLight.shadow.camera.left = -5;
         directionalLight.shadow.camera.right = 5;
         directionalLight.shadow.camera.top = 5;
         directionalLight.shadow.camera.bottom = -5;
         */

        scene.add(directionalLight);

        light = new THREE.AmbientLight(0x999999); // soft white light
        scene.add(light);

    }

    /*
     calculates the time between the frames
     */
    function getDeltaTime() {
        var actualTime = Date.now(),
            delta = actualTime - lastTime;
        lastTime = actualTime;
        delta /= 1000;
        return delta;
    }

    /*
     renders the scene every frame
     */
    render = function () {
        var delta = getDeltaTime();
        player.update(delta);
        cameraObj.update(delta);
        world.update();
        requestAnimationFrame(render);
        renderer.render(scene, cameraObj.camera);
        showOpponentLabels();
        showPlayerLabels();
    };

    /*
     creates the world by creating the player, the camera and the chunks
     */
    function createWorld(id) {
        var playerModel;
        playerId = id;
        playerModel = getPlayerModel(id);
        player = new DungeonHop.Player();

        world = new DungeonHop.World();
        world.init(scene, models, player, serverInterface);

        player.init(playerModel, world, scene, gameStatus, serverInterface, playerId, opponentPlayers, enemies);

        cameraObj = new DungeonHop.PlayerCamera();
        cameraObj.init(player, gameStatus, serverInterface);

        setScene();
        serverInterface.setLoaded(player.getPosition().x, player.getPosition().z);
        render();

        infoText.innerHTML = "PRESS START IF YOU ARE READY, " + playerName;
    }

    /*
     returns the player model with the given id
     */
    function getPlayerModel(id) {
        var model,
            modelId,
            modelObject,
            r,
            playerModel;
        var i, players = [];
        //get all player models
        for (i = 0; i < models.length; i++) {
            model = models[i];
            if (model["type"] == "players") {
                modelId = model["id"];
                modelObject = model["object"];
                players[modelId] = modelObject;
            }
        }

        if (id < 0) {
            //get random player model
            r = Math.random() * players.length;
            r = parseInt(Math.floor(r));
            playerModel = players[r];
            return playerModel.clone();
        } else {
            playerModel = players[id];
            return playerModel.clone();
        }
    }

    /*
     returns an enemy model
     */
    function getEnemyModel() {
        var i,
            model,
            enemyModel,
            r;
        //higher chance of enemy 0
        r = Math.floor(Math.random() * 1.2);
        for (i = 0; i < models.length; i++) {
            model = models[i];
            if (model["type"] == "enemies") {
                if (model["id"] == r) {
                    enemyModel = model["object"];
                    return enemyModel.clone();
                }
            }
        }
    }

    /*
     inits the game instance by passing the values from the game handler
     */
    function init(name, mdls, srv, rend) {
        renderer = rend;
        playerName = name;
        models = mdls;
        serverInterface = srv;
        gameStatus.active = false;
        startButton = document.getElementById("start");
        startButton.addEventListener("click", startClicked);

    }

    function startClicked() {
        serverInterface.setReady();
        infoText.innerHTML = "Waiting for other Players";
    }


    function setTimer() {
        var min, sec;
        if (gameStatus.active == false) {
            return;
        }
        seconds++;
        min = Math.floor(seconds / 60);
        sec = Math.floor(seconds % 60);

        if (min < 10) {
            min = "0" + min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }
        timer.innerHTML = min + ":" + sec;
    }

    function startGame() {
        gameStatus.active = true;
        setInterval(setTimer, 1000);
    }

    /*
     synchronizes the players and creates new ones if the doesnt exist
     */
    function setPlayers(id, name, xPos, zPos) {
        var opponent,
            model;
        if (opponentPlayers[id] == undefined && id != playerId) {
            opponent = new DungeonHop.Opponent();
            model = getPlayerModel(id);
            opponent.init(model, scene, xPos, zPos, name);
            scene.add(opponent.getObject());
            opponentPlayers[id] = opponent;
        }
    }

    /*
     shows an info test for a given time
     */
    function showInfoForTime(info, t) {
        infoText.innerHTML = info;
        setTimeout(function () {
            if (infoText.innerHTML == info) {
                infoText.innerHTML = " ";
            }
        }, t * 1000);
    }

    /*
     removes the chunk at the given position and checks if players die
     */
    function removeChunk(pos) {
        var i,
            enemy;
        //check if player is outside
        if (player.getPosition().z >= pos) {
            //not the right one but with this event, he also dies
            player.informEnemyCollision();
        }
        //check if enemies are outside
        for (i = 0; i < enemies.length; i++) {
            enemy = enemies[i];
            if (enemy.getPosition().z >= pos) {
                scene.remove(enemy.getObject());
            }
        }
        world.removeChunk(pos);
    }

    function setPlayerDead(id, name) {
        if (id == playerId) {
            player.die();
        } else if (opponentPlayers[id] != undefined) {
            //showInfoForTime("Player "+id+" died!",3);
            showInfoForTime(name + " died", 3);
            opponentPlayers[id].die();
        }

    }

    function updatePlayers(id, xPos, zPos) {
        if (opponentPlayers[id] != undefined && id != playerId) {
            opponentPlayers[id].updatePosition(xPos, zPos);
        }
    }

    function setInfoText(text) {
        infoText.innerHTML = text;

        if (document.getElementById("info-text").innerHTML != " ") {
            document.getElementById("info-text").style["background-color"] = ["rgba(69,40,14, 0.9)"];
            document.getElementById("info-text").style["border"] = ["4px solid #2D1D0E"];

        } else {
            document.getElementById("info-text").style["background-color"] = ["transparent"];
            document.getElementById("info-text").style["border"] = ["0px solid #45280E"];
        }
    }

    function createNewEnemy(id, xPos, zPos) {
        var enemy,
            model;
        if (enemies[id] != undefined) {
            return;
        }
        enemy = new DungeonHop.Enemy();
        model = getEnemyModel();
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
        var proj = toScreenPosition(player.getObject(), cameraObj.getCamera()),
            label = document.getElementById("player-label");
        label.style.left = proj.x + "px";
        label.style.top = proj.y + "px";
        label.style.visibility = "visible";
    }

    /*
     calculates the coordinates from the game to coordinates in the browser
     */
    function toScreenPosition(obj, camera) {
        var vector = new THREE.Vector3();

        var widthHalf = 0.5 * renderer.context.canvas.width;
        var heightHalf = 0.5 * renderer.context.canvas.height;

        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(camera);

        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = -( vector.y * heightHalf ) + heightHalf;

        return {
            x: vector.x,
            y: vector.y
        };

    }

    function showOpponentLabels() {
        var i,
            opponent,
            proj,
            label,
            t;
        for (i = 0; i < opponentPlayers.length; i++) {
            opponent = opponentPlayers[i];
            if (opponent == undefined) {
                continue;
            }
            proj = toScreenPosition(opponent.getObject(), cameraObj.getCamera());
            label = document.getElementById("opponent-" + i + "-label");
            if (label == null) {
                label = document.createElement("p");
                t = document.createTextNode(opponent.getName());
                label.appendChild(t);
                label.className = "opponent-label";
                label.id = "opponent-" + i + "-label";
                document.body.appendChild(label);
            } else {
                label.style.left = proj.x + "px";
                label.style.top = proj.y + "px";
                label.style.visibility = "visible";
            }
        }
    }

    /*
     destroys all objects in the scene
     */
    function destroy() {
        var i,
            obj;
        for (i = scene.children.length - 1; i >= 0; i--) {
            obj = scene.children[i];
            scene.remove(obj);
        }
    }

    function setGameFinished() {
        gameStatus.active = false;
        gameStatus.finished = true;

    }

    that.startGame = startGame;
    that.setPlayers = setPlayers;
    that.createWorld = createWorld;
    that.updatePlayers = updatePlayers;
    that.removeChunk = removeChunk;
    that.setPlayerDead = setPlayerDead;
    that.setGameFinished = setGameFinished;
    that.setInfoText = setInfoText;
    that.createNewEnemy = createNewEnemy;
    that.updateEnemyPosition = updateEnemyPosition;
    that.init = init;
    that.destroy = destroy;
    return that;
};
