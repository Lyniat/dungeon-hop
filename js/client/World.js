/**
 * Created by laurin on 23.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.World = function () {
    var that = {};
    var worldMatrix = [];

    function init(scene){
        var zPosition;
        for(zPosition = 0; zPosition > -16; zPosition--){
            var chunk = new DungeonHop.Chunk();
            chunk.init(scene,zPosition);
        }
    }

    that.init = init;
    return that;
};
