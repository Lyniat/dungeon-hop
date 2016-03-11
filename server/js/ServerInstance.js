ServerInstance = function () {
    var that = {},
        mainServer,
        mainLogic,
        mainLogicClass = require("./MainLogic.js").MainLogic,
        clients = [],
        readyPlayers = 0,
        deadPlayers = 0,
        status = 0; // 0 waiting for players, 1 active --> new players cant connect

    function init(main) {
        mainServer = main;
        mainLogic = new mainLogicClass();
        mainLogic.init(that);
    }

    function addClient(clientSocket) {
        var client = new Client();
        client.init(clientSocket, clients.length, that);
        clients.push(client);
    }

    function destroyClient(id) {
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            if (client.getId() == id) {
                clients.splice(i, 1);
            }
        }
        if(clients.length == 0){
            mainServer.destroyServer();
        }
    }

    function getChunkAt(zPosition) {
        return mainLogic.getChunkAt(zPosition);
    }

    function refreshAllClients() {
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            for (var j = 0; j < clients.length; j++) {
                var wantedClient = clients[j];
                var wantedPosition = wantedClient.getPosition();
                var wantedId = wantedClient.getId();
                var wantedName = wantedClient.getPlayerName();
                if (client.getId() != wantedId) {
                    client.getSocket().emit("newPlayer", wantedId,wantedName, wantedPosition.x, wantedPosition.z);
                }
            }
        }
    }

    function updatePlayerPosition(id, xPos, zPos) {
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            if (client.getId() != id) {
                client.getSocket().emit("updatePlayer", id, xPos, zPos);
            }
        }
    }

    function removeChunk(pos){
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            client.getSocket().emit("removeChunk", pos);
        }
    }

    function getAllClients() {
        return clients;
    }

    function setPlayerReady() {
        readyPlayers++;
        if (readyPlayers == clients.length) {
            status = 1;
            startGame();
        }
    }

    function setPlayerDead(id) {
        console.log("player "+id+" dead");
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            if (client.getId() != id) {
                client.getSocket().emit("setPlayerDead", id);
            }
            deadPlayers++;
            if(deadPlayers >= clients.length){
                setTimeout(function() {
                    mainServer.destroyServer();
                }, 3000);
            }
        }
    }

    function startGame() {
        console.log("starting countdown");
        setInfoTextForClients("GAME STARTS IN 3");
        setTimeout(function() {
            setInfoTextForClients("2");
            setTimeout(function() {
                setInfoTextForClients("1");
                setTimeout(function() {
                    setInfoTextForClients("GO!");


                    console.log("game starts now");
                    for (var i = 0; i < clients.length; i++) {
                        var client = clients[i];
                        client.getSocket().emit("startGame");
                    }

                    setTimeout(function() {
                        setInfoTextForClients(" ");
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }

    function setInfoTextForClients(text){
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            console.log("info text for "+i);
            client.getSocket().emit("setInfoText",text);
        }
    }

    function updateEnemyPosition(id,xPos){
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            client.getSocket().emit("updateEnemyPosition",id,xPos);
        }
    }

    function createNewEnemy(id,xPos,zPos){
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            client.getSocket().emit("createNewEnemy",id,xPos,zPos);
        }
    }

    function updateEnemiesForClient(id){
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            if (client.getId() == id) {
                var enemies = mainLogic.getAllEnemies();
                for (var j = 0; j < enemies.length; j++) {
                    var enemy = enemies[j];
                    var enemyId = enemy.getId();
                    var xPos = enemy.getPosition().x;
                    var zPos = enemy.getPosition().z;
                    client.getSocket().emit("createNewEnemy",enemyId,xPos,zPos);
                }
            }
        }
    }

    function updateCameraPosition(id,zPos){
        //id not neede for this
        var removingChunk = mainLogic.updateCameraPosition(zPos);
        if(removingChunk != null && removingChunk != undefined){
            console.log("removing chunk "+removingChunk);
            removeChunk(removingChunk);
        }
    }

    function getStatus(){
        return status;
    }

    that.init = init;
    that.addClient = addClient;
    that.refreshAllClients = refreshAllClients;
    that.getAllClients = getAllClients;
    that.destroyClient = destroyClient;
    that.getChunkAt = getChunkAt;
    that.setPlayerReady = setPlayerReady;
    that.setPlayerDead = setPlayerDead;
    that.updatePlayerPosition = updatePlayerPosition;
    that.updateEnemyPosition = updateEnemyPosition;
    that.createNewEnemy = createNewEnemy;
    that.updateEnemiesForClient = updateEnemiesForClient;
    that.updateCameraPosition = updateCameraPosition;
    that.getStatus = getStatus;
    return that;
}
;
module.exports.ServerInstance = ServerInstance;

Client = function () {
    var that = {},
        id,
        xPos,
        zPos,
        cameraPos,
        socket,
        server,
        playerStatus,
        playerName;

    function init(s, i, srv) {
        server = srv;
        id = i;
        socket = s;

        console.log("socket created");

        socket.emit("setPlayerId", id);

        socket.on("loaded", function (i,name, x, z) {
            console.log("player " + id + " loaded");
            playerName = name;
            if (i == id) {
                xPos = x;
                zPos = z;
                server.refreshAllClients();
            }
            server.updateEnemiesForClient(id);
        });

        socket.on('disconnect', function () {
            console.log("player " + id + " disconnected");
            server.destroyClient(id);
        });

        socket.on('getChunkAt', function (zPosition) {
            var chunk = server.getChunkAt(zPosition);
            socket.emit("getChunkAtResp" + zPosition, chunk);
        });

        socket.on("playerReady", function () {
            console.log("player " + id + " ready");
            server.setPlayerReady();
        });

        socket.on("updatePosition", function (x, z) {
            console.log("update position from player "+id+" to "+x+", "+z);
            xPos = x;
            zPos = z;
            server.updatePlayerPosition(id, xPos, zPos);
        });

        socket.on("updateCamera", function (zPos) {
            cameraPos = zPos;
            server.updateCameraPosition(id,cameraPos);
        });

        socket.on("playerDead",function(){
            server.setPlayerDead(id);
        });

    }

    function getId() {
        return id;
    }

    function getPosition() {
        return {x: xPos, z: zPos};
    }

    function getSocket() {
        return socket;
    }

    function getPlayerName(){
        return playerName;
    }

    that.init = init;
    that.getSocket = getSocket;
    that.getId = getId;
    that.getPosition = getPosition;
    that.getPlayerName = getPlayerName;
    return that;
};
