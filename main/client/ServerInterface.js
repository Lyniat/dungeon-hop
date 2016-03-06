var DungeonHop = DungeonHop || {};
DungeonHop.ServerInterface = function () {
    var that = {},
        mainClass,
        server,
        playerId;

    function init(main, ip) {
        console.log("connecting to server");
        mainClass = main;
        server = io(ip);
        console.log("server connected");
        getId();
        getPlayers();
        waitForStart();
    }

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

    function updatePlayerPosition(playerId,xPos,zPos){
        server.emit("updatePosition",playerId,xPos,zPos);
    }

    function setLoaded(xPos,zPos){
        server.emit("loaded", playerId, xPos, zPos);
        console.log("loading: " + playerId);
    }

    function setReady(){
        server.emit("playerReady");
    }

    function waitForStart() {
        server.on("startGame", function () {
            console.log("starting");
            waitForUpdatingPlayers();
            waitForRemovingChunks();
            waitForDestroyingPlayers();
            mainClass.startGame();
        });
    }

    function waitForUpdatingPlayers(){
        server.on("updatePlayer", function (id, xPos, zPos) {
            console.log("updating player");
            mainClass.updatePlayers(id, xPos, zPos);
        });
    }

    function waitForRemovingChunks(){
        server.on("removeChunk", function (pos) {
            console.log("removing chunk " + pos);
            mainClass.removeChunk(pos);
        });
    }

    function waitForDestroyingPlayers(){
        server.on("destroyPlayer", function (id) {
            console.log("destroying player");
            mainClass.destroyPlayer(id);
        });
    }

    that.getChunkAt = getChunkAt;
    that.updatePlayerPosition = updatePlayerPosition;
    that.setLoaded = setLoaded;
    that.setReady = setReady;
    that.init = init;
    return that;
};