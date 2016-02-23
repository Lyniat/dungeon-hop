(function() {
    var that = {},
        express = require("express"),
        app = express(),
        server;

    function run() {
        console.log("hello express");
        initRoutes();
        startServer(3000);
    }

    function initRoutes() {
        app.get("/", function(req, res) {
            res.send("Hello World");
        });
        app.get("/www", function(req, res) {
            res.send("a website");
        });
    }

    function startServer(port) {
        server = app.listen(port, function() {
            console.log("Server is listening on http://localhost:" + server.address().port);
        });
    }

    that.run = run;
    return that;
}().run())