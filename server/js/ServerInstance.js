ServerInstance = function () {
    var that = {},
        mainServer,
        mainLogic,
        mainLogicClass = require("./MainLogic.js").MainLogic,
        clients = [],
        readyPlayers = 0,
        deadPlayers = 0,
        status = 0, // 0 waiting for players, 1 active --> new players cant connect, 2 full, waiting for start, 3 private game, 4 finished game
        maxPlayers = 3,
        gameId;

    function init(main) {
        mainServer = main;
        mainLogic = new mainLogicClass();
        mainLogic.init(that);
        setGameId();
        return gameId;
    }

    function setGameId() {
        var char;
        var string = "";
        for (var i = 0; i < 8; i++) {
            var r = Math.random();
            if (r > 0.5) {
                char = Math.floor(Math.random() * 10);
            } else {
                char = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
            }
            string += char;
        }
        gameId = string;
    }

    function addClient(clientSocket) {
        var client = new Client();
        client.init(clientSocket, clients.length, that);
        clients.push(client);
        if (clients.length >= maxPlayers) {
            status = 2;
        }
    }

    function destroyClient(id) {
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            if (client.getId() == id) {
                clients.splice(i, 1);
            }
        }
        if (clients.length == 0) {
            mainServer.destroyServer(that);
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
                    client.getSocket().emit("newPlayer", wantedId, wantedName, wantedPosition.x, wantedPosition.z);
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

    function removeChunk(pos) {
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
        if (status == 4) {
            return;
        }
        console.log("player " + id + " dead");
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            var playerStatus = client.getPlayerStatus();
            var name = client.getPlayerName();
            if (playerStatus == 0) {
                deadPlayers++;
            }
            if (client.getId() != id) {
                client.getSocket().emit("setPlayerDead", id,name);
            }
        }
        console.log(deadPlayers + " players are dead");
        if (deadPlayers >= clients.length - 1) {
            status = 4; //game finished
            setGameOverText();
            setTimeout(function () {
                mainServer.destroyServer(that);
            }, 5000);
        }
        deadPlayers = 0;
    }

    function setGameOverText() {
        var winnerName;
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            var playerStatus = client.getPlayerStatus();
            if (playerStatus == 1) {
                winnerName = client.getPlayerName();
            }
        }
        setInfoTextForClients(winnerName + "won the game!");
        setGameFinished();
    }

    function startGame() {
        console.log("starting countdown");
        setInfoTextForClients("GAME STARTS IN 3");
        setTimeout(function () {
            setInfoTextForClients("2");
            setTimeout(function () {
                setInfoTextForClients("1");
                setTimeout(function () {
                    setInfoTextForClients("GO!");


                    console.log("game starts now");
                    for (var i = 0; i < clients.length; i++) {
                        var client = clients[i];
                        client.getSocket().emit("startGame");
                    }

                    setTimeout(function () {
                        setInfoTextForClients(" ");
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }

    function setInfoTextForClients(text) {
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            console.log("info text for " + i);
            client.getSocket().emit("setInfoText", text);
        }
    }

    function setGameFinished() {
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            client.getSocket().emit("gameFinished");
        }
    }

    function updateEnemyPosition(id, xPos) {
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            client.getSocket().emit("updateEnemyPosition", id, xPos);
        }
    }

    function createNewEnemy(id, xPos, zPos) {
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            client.getSocket().emit("createNewEnemy", id, xPos, zPos);
        }
    }

    function updateEnemiesForClient(id) {
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            if (client.getId() == id) {
                var enemies = mainLogic.getAllEnemies();
                for (var j = 0; j < enemies.length; j++) {
                    var enemy = enemies[j];
                    var enemyId = enemy.getId();
                    var xPos = enemy.getPosition().x;
                    var zPos = enemy.getPosition().z;
                    client.getSocket().emit("createNewEnemy", enemyId, xPos, zPos);
                }
            }
        }
    }

    function updateCameraPosition(id, zPos) {
        //id not neede for this
        var removingChunk = mainLogic.updateCameraPosition(zPos);
        if (removingChunk != null && removingChunk != undefined) {
            console.log("removing chunk " + removingChunk);
            removeChunk(removingChunk);
        }
    }

    function getStatus() {
        return status;
    }

    function canJoin(gId) {
        if (status == 0) {
            return true;
        }
        else if (status == 3 && gameId == gId) {
            return true;
        }
        return false;
    }

    function moveAllClientsToLobby() {
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
        }
    }

    function destroy() {
        clients = [];
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
    that.canJoin = canJoin;
    that.destroy = destroy;
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
        playerStatus = 1,
        playerName;

    function init(s, i, srv) {
        server = srv;
        id = i;
        socket = s;

        console.log("socket created");

        socket.emit("setPlayerId", id);

        socket.on("loaded", function (i, name, x, z) {
            console.log("player " + id + " loaded");
            playerName = name;
            xPos = x;
            zPos = z;
            server.refreshAllClients();
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
            console.log("update position from player " + id + " to " + x + ", " + z);
            xPos = x;
            zPos = z;
            server.updatePlayerPosition(id, xPos, zPos);
        });

        socket.on("updateCamera", function (zPos) {
            cameraPos = zPos;
            server.updateCameraPosition(id, cameraPos);
        });

        socket.on("playerDead", function () {
            playerStatus = 0;
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

    function getPlayerName() {
        return playerName;
    }

    function getPlayerStatus() {
        return playerStatus;
    }

    function destroy() {
        socket = null;
        delete socket;
    }

    that.init = init;
    that.getSocket = getSocket;
    that.getId = getId;
    that.getPosition = getPosition;
    that.getPlayerName = getPlayerName;
    that.getPlayerStatus = getPlayerStatus;
    that.destroy = destroy;
    return that;
};
