(function (port, dbURL) {
    "use strict";
    /* eslint-env node */

    var express = require("express"),
        app = express(),
        server = require("http").Server(app),
        io = require("socket.io")(server),
        pg = require("pg");



    app.use(express.static(__dirname + "/../main"));

    io.on("connection", function(socket) {
        socket.emit("connection", socket.id);
        console.log("Connected to", socket.id);

    });


    server.listen(port, function() {
        console.log("Running on port", port);
    });
})((process.env.PORT || 8080), process.env.DATABASE_URL);
