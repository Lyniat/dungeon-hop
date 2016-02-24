/**
 * Created by laurin on 23.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.World = function () {
    var that = {};
    var worldMatrix = [];
    var actualChunk_Z_Position = 0;
    var models;
    var scene;
    var player;
    var loadDistance = 14;

    function init(sc,mdls,pl){
        player = pl;
        models = mdls;
        scene = sc;
        for(var z = 0; z > -16; z--){
            createChunk();
        }
    }

    function createChunk(){
        var chunk = new DungeonHop.Chunk();
        chunk.init(scene,actualChunk_Z_Position,models);
        actualChunk_Z_Position--;
    }

    function update(){
        var playerZPosition = player.getPosition().z;
        if (playerZPosition < actualChunk_Z_Position+loadDistance){
            createChunk();
        }
    }

    that.update = update;
    that.init = init;
    return that;
};
