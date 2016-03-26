MainLogic = function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        enemyClass = require("./Enemy.js").Enemy,
        enemies = [],
        cameraPosition = 0,
        server;
    var world = [];
    var chunkSize = 24;
    //var players = [];
    var lastPathPos = chunkSize / 2;

    function init(srv) {
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
        var i,
            r,
            obstacleId,
            j,
            enemy = new enemyClass(),
            newId = enemies.length,
            xPos = Math.round((chunkSize / 6) * j),
            chunk = [];

        //decide if lava or normal ground
        r = Math.random();
        //lava
        if (r < 0.2) {
            for (i = 0; i < chunkSize; i++) {
                chunk[i] = -2;
                r = Math.random();
                if (r < 0.25) {
                    chunk[i] = -5;
                }
            }
            //create path
            chunk = createPath(chunk, -5);
            chunk[chunkSize] = 1;
        }
        //normal ground
        else if (r > 0.2 && r < 0.8) {
            for (i = 0; i < chunkSize; i++) {
                chunk[i] = -1;
                r = Math.random();
                if (r < 0.25) {
                    obstacleId = getRandomObstacle();
                    chunk[i] = obstacleId;
                }
            }
            //create path
            chunk = createPath(chunk, -1);
            chunk[chunkSize] = 0;
        }
        //enemy ground
        else {
            for (i = 0; i < chunkSize; i++) {
                //keep empty
                chunk[i] = -1;
            }
            chunk[chunkSize] = 0;

            //create enemies
            for (j = 0; j < 5; j++) {
                enemy = new enemyClass();
                newId = enemies.length;
                xPos = Math.round((chunkSize / 6) * j);
                enemy.init(newId, chunkSize, server, that, xPos, zPos);
                enemies.push(enemy);
            }
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

    function createPath(chunk, wantedId) {
        var i,
            newPosition = lastPathPos,
            pathLength = Math.round(Math.random() * 5),
            direction = Math.random() - 0.5;
        for (i = 0; i <= pathLength; i++) {
            if (direction < 0) {
                direction = -1;
            }
            else {
                direction = 1;
            }
            newPosition = lastPathPos + i * direction;
            if (newPosition < 0) {
                newPosition = 0;
            }
            if (newPosition >= chunkSize) {
                newPosition = chunkSize - 1;
            }
            chunk[newPosition] = wantedId;

        }
        lastPathPos = newPosition;
        return chunk;
    }

    function checkRemovingChunks() {
        var removingChunk;
        removingChunk = cameraPosition + 10;
        if (removingChunk <= 0) {
            removeEnemiesOnChunk(removingChunk);
            console.log("removing chunk" + removingChunk);
            return removingChunk;
        }
        return null;
    }

    function removeEnemiesOnChunk(zPos) {
        var enemy;
        for (enemy of enemies) {
            if (enemy.getPosition().z == zPos) {
                enemy = null;
            }
        }
    }

    function updateCameraPosition(zPos) {
        if (zPos < cameraPosition) {
            cameraPosition = zPos;
        }
        return checkRemovingChunks();
    }

    function getAllEnemies() {
        return enemies;
    }

    that.init = init;
    that.getChunkAt = getChunkAt;
    that.getAllEnemies = getAllEnemies;
    that.updateCameraPosition = updateCameraPosition;
    return that;

    //module.exports.getChunkAt = getChunkAt;
    //module.exports.test = test;
};
module.exports.MainLogic = MainLogic;
