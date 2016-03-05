(function (port, dbURL) {
    "use strict";
    /* eslint-env node */

    var express = require("express"),
        app = express(),
        server = require("http").Server(app),
        io = require("socket.io")(server),
        pg = require("pg"),
        main = require("./js/MainServer.js").MainServer,
        requiredPlayers = 2,
        actualPlayers = 0,
        readyPlayers = 0,
        players = [];

    var mainServer = new main();


    app.use(express.static(__dirname + "/../main"));


    io.sockets.on('connection', function (socket) {
        actualPlayers++;
        console.log("Actual players: " + actualPlayers + "\n" + (requiredPlayers - actualPlayers) + " more players are required to start\n");

        socket.emit("setPlayerId", actualPlayers);

        socket.on('getChunkAt', function (zPosition) {
            var chunk = mainServer.getChunkAt(zPosition);
            socket.emit("getChunkAtResp" + zPosition, chunk);
        });

        socket.on('disconnect', function () {
            console.log("player disconnected");
            actualPlayers--;
            readyPlayers--;
            console.log("Actual players: " + actualPlayers + "\n" + (requiredPlayers - actualPlayers) + " more players are required to start\n");
            if (actualPlayers == 0) {
                console.log("no players, resetting server");
                players = [];
                mainServer = new main();
            }
        });

        socket.on("loaded", function (id, xPos, zPos) {
            console.log("player " + id + " loaded at " + xPos + ", " + zPos);
            players[id] = {};
            players[id].x = xPos;
            players[id].z = zPos;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                if (player != undefined && player != null) {
                    io.sockets.emit("newPlayer", i, player.x, player.z);
                    console.log("informing clients about player " + i + " at " + player.x + ", " + player.z);
                }
            }
        });

        socket.on("playerReady", function () {
            readyPlayers++;
            if (players.length - 1 == requiredPlayers && readyPlayers == actualPlayers) {
                console.log("game starts now");
                io.sockets.emit("startGame");
            }
        });

        socket.on("updatePosition", function (id, xPos, zPos) {
            players[id].x = xPos;
            players[id].z = zPos;
            console.log("player " + id + " moved to " + xPos + ", " + zPos);
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                if (player != undefined && player != null) {
                    io.sockets.emit("updatePlayer", id, xPos, zPos);
                }
            }
            var removingChunk = mainServer.setPlayerToPosition(id, xPos, zPos);
            if (removingChunk != null) {
                console.log("removing main chunk: " + removingChunk);
                io.sockets.emit("removeChunk", removingChunk);

                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    if (player != undefined && player != null) {
                        if (player.z == removingChunk) {
                            io.sockets.emit("destroyPlayer", i);
                        }
                    }
                }
            }
        });
    });

    server.listen(port, function () {
        console.log("Running on port", port);
    });
})((process.env.PORT || 8080), process.env.DATABASE_URL);
