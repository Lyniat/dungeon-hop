ServerInstance = function () {
    var that = {},
        mainServer,
        mainLogic,
        mainLogicClass = require("./MainLogic.js").MainLogic,
        clients = [],
        readyPlayers = 0;

    function init(main) {
        mainServer = main;
        mainLogic = new mainLogicClass();
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
                if (client.getId() != wantedId) {
                    client.getSocket().emit("newPlayer", wantedId, wantedPosition.x, wantedPosition.z);
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

    function getAllClients() {
        return clients;
    }

    function setPlayerReady() {
        readyPlayers++;
        if (readyPlayers == clients.length) {
            startGame();
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
                        setInfoTextForClients("");
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

    that.init = init;
    that.addClient = addClient;
    that.refreshAllClients = refreshAllClients;
    that.getAllClients = getAllClients;
    that.destroyClient = destroyClient;
    that.getChunkAt = getChunkAt;
    that.setPlayerReady = setPlayerReady;
    that.updatePlayerPosition = updatePlayerPosition;
    return that;
}
;
module.exports.ServerInstance = ServerInstance;

Client = function () {
    var that = {},
        id,
        xPos,
        zPos,
        socket,
        server,
        playerStatus;

    function init(s, i, srv) {
        server = srv;
        id = i;
        socket = s;

        console.log("socket created");

        socket.emit("setPlayerId", id);

        socket.on("loaded", function (i, x, z) {
            console.log("player " + id + " loaded");
            if (i == id) {
                xPos = x;
                zPos = z;
                server.refreshAllClients();
            }
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

    that.init = init;
    that.getSocket = getSocket;
    that.getId = getId;
    that.getPosition = getPosition;
    return that;
};
