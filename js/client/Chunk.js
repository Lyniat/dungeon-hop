/**
 * Created by laurin on 23.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.Chunk = function () {
    var that = {};
    var objects = [];
    var chunkSize = 16;
    var borderSize = 8;

    function addToScene(scene){
        var i;
        for (i = 0; i < objects.length; i++){
            scene.add(objects[i]);
        }
    }

    function addToWorld(worldMatrix){
        var i;
        var matrixLength = worldMatrix.length;
        var totalSize = chunkSize+borderSize*2;
        worldMatrix[matrixLength] = [totalSize];
        for(i = 0; i < totalSize; i++){
            if(i < borderSize || i >= borderSize+chunkSize){
                worldMatrix[matrixLength][i] = 0;
            }
            else{
                worldMatrix[matrixLength][i] = 1;
            }
        }
    }

    that.addToScene = addToScene;
    that.addToWorld = addToWorld;
    return that;

};
