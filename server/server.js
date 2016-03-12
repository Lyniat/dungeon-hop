(function (port) {
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
        serverInstances = [],
        clients = [];

    var mainLogic = new main();


    app.use(express.static(__dirname + "/../main"));

    io.sockets.on('connection', function (socket) {
        socket.on("joinGame", function(id){
            if(id == "private"){
                createNewServer(socket,true)
            }else{

            }
            connectClientToServer(socket,id);
        });
    });

    function createNewServer(socket,isPrivate){
        var serverInstance = new serverInst();
        var serverId = serverInstance.init(that);
        serverInstance.addClient(socket);
        serverInstances.push(serverInstance);
        console.log("new server " + (serverInstances.length -1)+ " created with id: "+serverId);
        if(isPrivate){
            socket.emit("privateId",serverId);
        }
    }

    function connectClientToServer(socket,id) {
        for (var serverInstance of serverInstances) {
            if (serverInstance.canJoin(id)) {
                serverInstance.addClient(socket);
                return;
            }
        }
        createNewServer(socket,false);
    }

    function destroyServer(that) {
        var clients = that.getAllClients();
        for (var client of clients) {
            var socket = client.getSocket();
            client.destroy();
            socket.emit("newGame");
        }
        var i;
        for (i = 0; i < serverInstances.length; i++) {
            var serverInst = serverInstances[i];
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
