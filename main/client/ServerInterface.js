var DungeonHop = DungeonHop || {};
DungeonHop.ServerInterface = function () {
	"use strict";
    /* eslint-env browser  */
    var that = {},
        mainClass,
        server,
        playerId;

    

    function getId() {
        server.on("setPlayerId", function (id) {
            playerId = id;
            console.log("player id: " + playerId);
            mainClass.createWorld(playerId);
        });
    }

    function getPlayers() {
        server.on("newPlayer", function (id, xPos, zPos) {
            console.log("retrieving player");
            mainClass.setPlayers(id, xPos, zPos);
        });
    }

    function getChunkAt(zPosition, callback) {
        server.emit('getChunkAt', zPosition);
        server.on("getChunkAtResp" + zPosition, function (result) {
            callback(result);
        });
    }

    function updatePlayerPosition(xPos, zPos) {
        server.emit("updatePosition", xPos, zPos);
    }

    function updateCamera(zPos) {
        console.log("updating camera");
        server.emit("updateCamera", zPos);
    }

    function setLoaded(xPos, zPos) {
        server.emit("loaded", playerId, xPos, zPos);
        console.log("loading: " + playerId);
    }

    function setReady() {
        server.emit("playerReady");
    }

    function setPlayerDead() {
        console.log("player dead");
        mainClass.setInfoText("You died!");
        server.emit("playerDead");
    }
	
	function waitForDeadPlayer() {
        server.on("setPlayerDead", function (id) {
            console.log("player " + id + " dead");
            mainClass.setPlayerDead(id);
        });
    }
	
	function waitForRemovingChunks() {
        server.on("removeChunk", function (pos) {
            console.log("removing chunk " + pos);
            mainClass.removeChunk(pos);
        });
    }
	
	function waitForUpdatingPlayers() {
        server.on("updatePlayer", function (id, xPos, zPos) {
            console.log("updating player");
            mainClass.updatePlayers(id, xPos, zPos);
        });
    }



    function waitForStart() {
        server.on("startGame", function () {
            console.log("starting");
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
            console.log("creat new enemy at " + xPos);
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
	function init(main, ip) {
        console.log("connecting to server");
        mainClass = main;
        server = io(ip);
        console.log("server connected");
        getId();
        getPlayers();
        waitForStart();
        waitForInfoText();
        waitForEnemy();
        waitForDisconnect();
    }
    that.getChunkAt = getChunkAt;
    that.updatePlayerPosition = updatePlayerPosition;
    that.updateCamera = updateCamera;
    that.setPlayerDead = setPlayerDead;
    that.setLoaded = setLoaded;
    that.setReady = setReady;
    that.init = init;
    return that;
};