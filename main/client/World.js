/**
 * Created by laurin on 23.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.World = function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        timer,
        worldMatrix = [],
        actualChunk_Z_Position = 0,
        models,
        obstacleModels = [],
        scene,
        player,
        serverInterface,
        loadDistance = 30,
        chunks = [];

    //creates the new chunk and adds the collision information the matrix
    function createChunk() {
        var chunk = new DungeonHop.Chunk();
        chunk.init(scene, actualChunk_Z_Position, obstacleModels, serverInterface, addToWorld);
        actualChunk_Z_Position--;
    }

    //tests if the player has moved forward, so that a new chunk must be loaded
    function update() {
        var playerZPosition = player.getPosition().z;
        if (playerZPosition < actualChunk_Z_Position + loadDistance) {
            createChunk();
        }
    }

    function addToWorld(obstacles, zPosition, chunk) {
        worldMatrix[zPosition] = obstacles;
        chunks[zPosition] = chunk;
    }

    //returns the status of the requested fiel in the matrix to check if the player can move
    function getEntryInMatrix(x, z) {
        console.log(worldMatrix[z][x]);
        return worldMatrix[z][x];
    }

    function init(sc, mdls, pl, srv) {
        var z;
        serverInterface = srv;
        player = pl;
        models = mdls;
        scene = sc;
        getObstacleModels();
        for (z = 0; z > -16; z--) {
            createChunk();
        }
    }

    function getObstacleModels() {
        var i,
            model,
            modelId,
            modelObject;
        for (i = 0; i < models.length; i++) {
            model = models[i];
            if (model["type"] == "obstacles") {
                modelId = model["id"];
                modelObject = model["object"];
                obstacleModels[modelId] = modelObject;
            }
        }
    }

    function removeChunk(pos) {
        console.log(chunks[pos]);
        chunks[pos].destroyChunk(scene);
    }

    that.update = update;
    that.getEntryInMatrix = getEntryInMatrix;
    that.init = init;
    that.removeChunk = removeChunk;
    return that;
};
