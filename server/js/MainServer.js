MainServer = function () {
    "use strict";
    /* eslint-env browser  */
    var that = {};
    var world = [];
    var chunkSize = 32;

//returns the chunk at the zPosition
//if the wanted chunk has not been created it will generate a new one in createNewChunk
    function getChunkAt(zPosition) {

        //special case at beginning
        if (zPosition > -2) {
            return createEmptyChunk();
        }

        var chunk;
        if (world[zPosition] == undefined) {
            chunk = createNewChunk();
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
    function createNewChunk() {
        var i, r, obstacleId;
        var chunk = [];

        //decide if lava or normal ground
        r = Math.random();
        //lava
        if (r < 0.2) {
            for (i = 0; i < chunkSize; i++) {
                chunk[i] = -2;
                //always keep the middle empty
                if (i == 16) {
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
        else {
            for (i = 0; i < chunkSize; i++) {
                chunk[i] = -1;
                //always keep the middle empty
                if (i == 16) {
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
        return chunk;
    }

    function getRandomObstacle() {
        var r;
        r = Math.random() * 2.9;
        r = Math.floor(r);
        r = parseInt(r);
        return r;
    }

    that.getChunkAt = getChunkAt;
    return that;

    //module.exports.getChunkAt = getChunkAt;
    //module.exports.test = test;
};
module.exports.MainServer = MainServer;
