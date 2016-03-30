var DungeonHop = DungeonHop || {};
DungeonHop.ServerInterface = function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        handler,
        mainClass,
        timer = document.getElementById("timer"),
        server,
        playerId,
        playerName;


    function getId() {
        server.on("setPlayerId", function (id) {
            playerId = id;
            mainClass.createWorld(playerId);
        });
    }

    function getPlayers() {
        server.on("newPlayer", function (id, name, xPos, zPos) {
            mainClass.setPlayers(id, name, xPos, zPos);
        });
    }

    function getChunkAt(zPosition, callback) {
        server.emit("getChunkAt", zPosition);
        server.on("getChunkAtResp" + zPosition, function (result) {
            callback(result);
        });
    }

    function updatePlayerPosition(xPos, zPos) {
        server.emit("updatePosition", xPos, zPos);
    }

    function updateCamera(zPos) {
        server.emit("updateCamera", zPos);
    }

    function setLoaded(xPos, zPos) {
        server.emit("loaded", playerId, playerName, xPos, zPos);
    }

    function setReady() {
        server.emit("playerReady");
    }

    function setPlayerDead() {
        mainClass.setInfoText("You died after " + timer.textContent + " seconds");
        server.emit("playerDead");
    }

    function waitForDeadPlayer() {
        server.on("setPlayerDead", function (id, name) {
            mainClass.setPlayerDead(id, name);
        });
    }

    function waitForRemovingChunks() {
        server.on("removeChunk", function (pos) {
            mainClass.removeChunk(pos);
        });
    }

    function waitForUpdatingPlayers() {
        server.on("updatePlayer", function (id, xPos, zPos) {
            mainClass.updatePlayers(id, xPos, zPos);
        });
    }


    function waitForStart() {
        server.on("startGame", function () {
            waitForUpdatingPlayers();
            waitForRemovingChunks();
            waitForDeadPlayer();
            mainClass.startGame();
        });
    }

    function waitForInfoText() {
        server.on("setInfoText", function (text) {
            mainClass.setInfoText(text);
        });
    }


    function waitForEnemy() {
        server.on("createNewEnemy", function (id, xPos, zPos) {
            mainClass.createNewEnemy(id, xPos, zPos);
        });
        server.on("updateEnemyPosition", function (id, xPos) {
            mainClass.updateEnemyPosition(id, xPos);
        });
    }

    function waitForDisconnect() {
        server.on("disconnect", function () {
            mainClass.setInfoText("You got disconnected from server!\nRestart in 5 seconds!");
            setTimeout(function () {
                location.reload();
            }, 5000);
        });
    }

    function waitForGameFinished() {
        server.on("gameFinished", function () {
            mainClass.setGameFinished();
        });
    }


    function init(hndlr, main, ip, name, gameId) {
        handler = hndlr;
        mainClass = main;
        server = io(ip);
        playerName = name;
        server.emit("joinGame", gameId);
        waitForPrivateId();
        getId();
        getPlayers();
        waitForStart();
        waitForInfoText();
        waitForEnemy();
        waitForDisconnect();
        waitForNewGame();
        waitForGameFinished();
    }

    /*
        gets privateId for connecting to a private game. But not yet implemented
     */
    function waitForPrivateId() {
        server.on("privateId", function (id) {
        });
    }

    function setMain(main) {
        mainClass = main;
    }

    function waitForNewGame() {
        server.on("newGame", function () {
            handler.createNewGame();
        });
    }

    that.getChunkAt = getChunkAt;
    that.updatePlayerPosition = updatePlayerPosition;
    that.updateCamera = updateCamera;
    that.setPlayerDead = setPlayerDead;
    that.setLoaded = setLoaded;
    that.setReady = setReady;
    that.init = init;
    that.setMain = setMain;
    return that;
};