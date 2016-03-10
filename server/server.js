(function (port, dbURL) {
    "use strict";
    /* eslint-env node */

    var that = {},
        express = require("express"),
        app = express(),
        server = require("http").Server(app),
        io = require("socket.io")(server),
        pg = require("pg"),
        main = require("./js/MainLogic.js").MainLogic,
        serverInst = require("./js/ServerInstance.js").ServerInstance,
        requiredPlayers = 2,
        actualPlayers = 0,
        readyPlayers = 0,
        players = [],
        serverInstances = [],
        serverInstance = null,
        clients = [];

    var mainLogic = new main();


    app.use(express.static(__dirname + "/../main"));

    io.sockets.on('connection', function (socket) {
        clients.push(socket);
        if(serverInstance == null){
            serverInstance = new serverInst();
            serverInstance.init(that);
            console.log("new server created");
        }
        else{
            var serverStatus = serverInstance.getStatus();
            if(serverStatus != 0){ //game is already running
                socket.emit("setInfoText","Active Game. Can't connect.");
                socket.disconnect();
                return;
            }
        }
        serverInstance.addClient(socket);
    });

    function destroyServer(){
        if(clients != undefined && clients != null) {
            for(var client of clients){
                if(client != null && client != undefined) {
                    client.disconnect();
                }
            }
        }
        serverInstance = null;
        clients = [];
        console.log("server destroyed");
    }

    server.listen(port, function () {
        console.log("Running on port", port);
    });

    that.destroyServer = destroyServer;
})((process.env.PORT || 8080), process.env.DATABASE_URL);
