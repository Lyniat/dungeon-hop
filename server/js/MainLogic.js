MainLogic = function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        enemyClass = require("./Enemy.js").Enemy,
        enemies = [],
        server;
    var world = [];
    var chunkSize = 24;
    var players = [];

    function init(srv){
        server = srv;
    }

//returns the chunk at the zPosition
//if the wanted chunk has not been created it will generate a new one in createNewChunk
    function getChunkAt(zPosition) {
        var chunk;
        //special case at beginning
        if (zPosition > -2) {
            chunk = createEmptyChunk();
            world[zPosition] = chunk;
            return chunk;
        }

        if (world[zPosition] == undefined) {
            chunk = createNewChunk(zPosition);
            world[zPosition] = chunk;
            return chunk;
        } else {
            return world[zPosition];
        }
    }

    function createEmptyChunk() {
        var chunk = [], i;
        for (i = 0; i < chunkSize; i++) {
            chunk[i] = -1;
        }
        chunk[chunkSize] = 0;
        return chunk;
    }

//generates a new chunk with random obstacles
    function createNewChunk(zPos) {
        var i, r, obstacleId;
        var chunk = [];

        //decide if lava or normal ground
        r = Math.random();
        //lava
        if (r < 0.2) {
            for (i = 0; i < chunkSize; i++) {
                chunk[i] = -2;
                //always keep the middle empty

                if (i == chunkSize/2) {
                    chunk[i] = -5;
                    continue;
                }

                r = Math.random();
                if (r < 0.25) {
                    chunk[i] = -5;
                }
            }
            chunk[chunkSize] = 1;
        }
        //normal ground
        else if (r > 0.2 && r < 0.8){
            for (i = 0; i < chunkSize; i++) {
                chunk[i] = -1;
                //always keep the middle empty
                if (i == chunkSize/2) {
                    continue;
                }
                r = Math.random();
                if (r < 0.25) {
                    obstacleId = getRandomObstacle();
                    chunk[i] = obstacleId;
                }
            }
            chunk[chunkSize] = 0;
        }
        //enemy ground
        else{
            for (i = 0; i < chunkSize; i++) {
                //keep empty
                chunk[i] = -1;
            }
            chunk[chunkSize] = 0;

            //create enemies
            for(var j = 0; j < 5; j++) {
                var enemy = new Enemy();
                var newId = enemies.length;
                var xPos = Math.round((chunkSize/6) * j);
                enemy.init(newId, chunkSize, server, that,xPos, zPos);
                enemies.push(enemy);
            }
            //chunk[chunkSize+1] = newId;
        }
        return chunk;
    }

    function getRandomObstacle() {
        var r;
        r = Math.random() * 2.9;
        r = Math.floor(r);
        r = parseInt(r);
        return r;
    }

    function setPlayerToPosition(id, x, z) {
        var player = {};
        player.x = x;
        player.z = z;
        players[id] = player;
        return checkRemovingChunks();
    }

    function checkRemovingChunks() {
        var smallestZ = 0;
        var maxChunks = 10;
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            if (player == undefined) {
                continue;
            }
            if (player.z < smallestZ) {
                smallestZ = player.z;
            }
        }
        var removingChunk = smallestZ + maxChunks;
        if (removingChunk > 0) {
            return null;
        }
        if (world[removingChunk] != null) {
            world[removingChunk] = null;
            console.log("removing chunk" + removingChunk);
            return removingChunk;
        }
        return null;
    }

    function getAllEnemies(){
        return enemies;
    }

    that.init = init;
    that.getChunkAt = getChunkAt;
    that.setPlayerToPosition = setPlayerToPosition;
    that.getAllEnemies = getAllEnemies;
    return that;

    //module.exports.getChunkAt = getChunkAt;
    //module.exports.test = test;
};
module.exports.MainLogic = MainLogic;
