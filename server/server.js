(function (port) {
    "use strict";
    /* eslint-env node */

    var that = {},
        GAME_VERSION = "", //this will be automaticly updated ba the python script
        express = require("express"),
        app = express(),
        server = require("http").Server(app),
        io = require("socket.io")(server),
        serverInst = require("./js/ServerInstance.js").ServerInstance,
        serverInstances = [];


    app.use(express.static(__dirname + "/../main"));
    /*
     if a new socket connects and the socket wants to create a private game, a new one will be created.
     otherwise the socket will be connected to an existing server
     */
    io.sockets.on("connection", function (socket) {
        socket.on("joinGame", function (id) {
            if (id == "private") {
                createNewServer(socket, true);
            }
            connectClientToServer(socket, id);
        });
    });

    /*
    a new server gets created and the new client gets connected to it
     */
    function createNewServer(socket, isPrivate) {
        var serverInstance = new serverInst();
        var serverId = serverInstance.init(that);
        serverInstance.addClient(socket);
        serverInstances.push(serverInstance);
        console.log("new server " + (serverInstances.length - 1) + " created with id: " + serverId);
        if (isPrivate) {
            socket.emit("privateId", serverId);
        }
    }

    /*
    the socket tries to get connected to a server. if not possible, a new one will be created
     */
    function connectClientToServer(socket, id) {
        var serverInstance;
        for (serverInstance of serverInstances) {
            if (serverInstance.canJoin(id)) {
                serverInstance.addClient(socket);
                return;
            }
        }
        createNewServer(socket, false);
    }

    /*
    if everybody disconnected or the game finished, all clients get disconnected and the server destroyed
     */
    function destroyServer(that) {
        var client,
            socket,
            i,
            serverInst,
            clients = that.getAllClients();
        for (client of clients) {
            socket = client.getSocket();
            client.destroy();
            socket.emit("newGame");
        }
        for (i = 0; i < serverInstances.length; i++) {
            serverInst = serverInstances[i];
            if (serverInst == that) {
                console.log("destroyed server " + i);
                break;
            }
        }
        serverInstances.splice(i, 1);
        that.destroy();
        that = null;
    }

    server.listen(port, function () {
        console.log("Running on port", port);
    });

    that.destroyServer = destroyServer;
})((process.env.PORT || 8080), process.env.DATABASE_URL);
