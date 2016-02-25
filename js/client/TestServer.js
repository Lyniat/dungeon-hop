//TestServer has to be replaced with the real server later
//it returns the generated chunks to the player to get sure that every player has the same world

var DungeonHop = DungeonHop || {};
DungeonHop.TestServer = function () {
    "use strict";
    /* eslint-env browser  */
    var that = {};
    var world = [];
    var chunkSize = 32;

    //returns the chunk at the zPosition
    //if the wanted chunk has not been created it will generate a new one in createNewChunk
    function getChunkAt(zPosition){
        var chunk;
        if(world[zPosition] == undefined){
            chunk = createNewChunk();
            return chunk;
        }else{
            return world[zPosition];
        }
    }

    //geberates a new chunk with random obstacles
    function createNewChunk(){
        var i, r, obstacleId;
        var chunk = [];
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
        return chunk;
    }

    function getRandomObstacle(){
        var r;
        r = Math.random() * 2.9;
        r = Math.floor(r);
        r = parseInt(r);
        return r;
    }

    that.getChunkAt = getChunkAt;
    return that;
};
