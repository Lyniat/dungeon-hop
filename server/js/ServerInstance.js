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


    /*
     called on initialization
     */
    function init(main) {
        mainServer = main;
        mainLogic = new mainLogicClass();
        mainLogic.init(that);
        setGameId();
        return gameId;
    }

    /*
     every game gets a random id, so that new players can connect tp this game as a private one
     (not completely implemented at this moment)
     */
    function setGameId() {
        var char,
            string = "",
            i,
            r;
        for (i = 0; i < 8; i++) {
            r = Math.random();
            if (r > 0.5) {
                char = Math.floor(Math.random() * 10);
            } else {
                char = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
            }
            string += char;
        }
        gameId = string;
    }

    /*
    adds a socket to the server instance and creates a new Client object for it
     */
    function addClient(clientSocket) {
        var client = new Client();
        client.init(clientSocket, clients.length, that);
        clients.push(client);
        if (clients.length >= maxPlayers) {
            status = 2;
        }
    }

    /*
    destroys the client and removes it from the clients list
    if every client is destroyed, the server will be destroyed
     */
    function destroyClient(id) {
        var client,
            i;
        for (i = 0; i < clients.length; i++) {
            client = clients[i];
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

    /*
    if a new player connected, the information about him an the other players will be updated for every one
     */
    function refreshAllClients() {
        var client,
            i,
            j,
            wantedClient,
            wantedPosition,
            wantedId,
            wantedName,
            wantedStatus;
        for (i = 0; i < clients.length; i++) {
            client = clients[i];
            for (j = 0; j < clients.length; j++) {
                wantedClient = clients[j];
                wantedPosition = wantedClient.getPosition();
                wantedId = wantedClient.getId();
                wantedName = wantedClient.getPlayerName();
                wantedStatus = wantedClient.getPlayerStatus();
                if (wantedStatus != 1) {
                    continue;
                }
                if (client.getId() != wantedId) {
                    client.getSocket().emit("newPlayer", wantedId, wantedName, wantedPosition.x, wantedPosition.z);
                }
            }
        }
    }

    function updatePlayerPosition(id, xPos, zPos) {
        var client,
            i;
        for (i = 0; i < clients.length; i++) {
            client = clients[i];
            if (client.getId() != id) {
                client.getSocket().emit("updatePlayer", id, xPos, zPos);
            }
        }
    }

    function removeChunk(pos) {
        var client,
            i;
        for (i = 0; i < clients.length; i++) {
            client = clients[i];
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

    /*
    if a player died, all players get this information
    the server will also check if only one player is alive. If so the games status will be set
    as finished and the server will restart
     */
    function setPlayerDead(id) {
        var i,
            client,
            playerStatus,
            name;
        if (status == 4) {
            return;
        }
        console.log("player " + id + " dead");
        for (i = 0; i < clients.length; i++) {
            client = clients[i];
            playerStatus = client.getPlayerStatus();
            name = client.getPlayerName();
            if (playerStatus == 0) {
                deadPlayers++;
            }
            if (client.getId() != id) {
                client.getSocket().emit("setPlayerDead", id, name);
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

    /*
    send to every client the information the a certain player has won the game
     */
    function setGameOverText() {
        var winnerName,
            client,
            playerStatus,
            i;
        for (i = 0; i < clients.length; i++) {
            client = clients[i];
            playerStatus = client.getPlayerStatus();
            if (playerStatus == 1) {
                winnerName = client.getPlayerName();
            }
        }
        setInfoTextForClients(winnerName + " won the game!");
        setGameFinished();
    }

    /*
    starts the game by counting down and sending a start message to all clients
     */
    function startGame() {
        var i,
            client;
        console.log("starting countdown");
        setInfoTextForClients("GAME STARTS IN 3");
        setTimeout(function () {
            setInfoTextForClients("2");
            setTimeout(function () {
                setInfoTextForClients("1");
                setTimeout(function () {
                    setInfoTextForClients("GO!");


                    console.log("game starts now");
                    for (i = 0; i < clients.length; i++) {
                        client = clients[i];
                        client.getSocket().emit("startGame");
                    }

                    setTimeout(function () {
                        setInfoTextForClients(" ");
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }

    /*
    set given text for all clients
     */
    function setInfoTextForClients(text) {
        var i,
            client;
        for (i = 0; i < clients.length; i++) {
            client = clients[i];
            console.log("info text for " + i);
            client.getSocket().emit("setInfoText", text);
        }
    }

    /*
     set game finished for all clients
     */
    function setGameFinished() {
        var i,
            client;
        for (i = 0; i < clients.length; i++) {
            client = clients[i];
            client.getSocket().emit("gameFinished");
        }
    }

    /*
     update an enemies position for all clients
     */
    function updateEnemyPosition(id, xPos) {
        var i,
            client;
        for (i = 0; i < clients.length; i++) {
            client = clients[i];
            client.getSocket().emit("updateEnemyPosition", id, xPos);
        }
    }

    function createNewEnemy(id, xPos, zPos) {
        var i,
            client;
        for (i = 0; i < clients.length; i++) {
            client = clients[i];
            client.getSocket().emit("createNewEnemy", id, xPos, zPos);
        }
    }

    /*
    update all enemies for a client
    this is called if a client (re)connects to the server
     */
    function updateEnemiesForClient(id) {
        var i,
            client,
            enemies,
            j,
            enemy,
            enemyId,
            xPos,
            zPos;
        for (i = 0; i < clients.length; i++) {
            client = clients[i];
            if (client.getId() == id) {
                enemies = mainLogic.getAllEnemies();
                for (j = 0; j < enemies.length; j++) {
                    enemy = enemies[j];
                    enemyId = enemy.getId();
                    xPos = enemy.getPosition().x;
                    zPos = enemy.getPosition().z;
                    client.getSocket().emit("createNewEnemy", enemyId, xPos, zPos);
                }
            }
        }
    }

    /*
    update camera position and check if chunks are out of distnace, so that they can get deleted
     */
    function updateCameraPosition(zPos) {
        var removingChunk = mainLogic.updateCameraPosition(zPos);
        if (removingChunk != null && removingChunk != undefined) {
            console.log("removing chunk " + removingChunk);
            removeChunk(removingChunk);
        }
    }

    function getStatus() {
        return status;
    }

    /*
    returns if a player can join or if the game is full or private
     */
    function canJoin(gId) {
        if (status == 0) {
            return true;
        }
        else if (status == 3 && gameId == gId) {
            return true;
        }
        return false;
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
        playerStatus = 2,// 0 dead, 1 playing, 2 loading
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
            playerStatus = 1;
            server.refreshAllClients(id);
            server.updateEnemiesForClient(id);
        });

        socket.on("disconnect", function () {
            console.log("player " + id + " disconnected");
            server.destroyClient(id);
        });

        socket.on("getChunkAt", function (zPosition) {
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
        //delete socket;
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
