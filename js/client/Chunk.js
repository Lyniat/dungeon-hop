/**
 * Created by laurin on 23.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.Chunk = function () {
    var that = {};
    var objects = [];
    var chunkSize = 16;
    var borderSize = 8;

    function init(scene,zPosition){
        addGround(zPosition);
        addToScene(scene);
    }

    function addGround(zPosition){
        var geometry = new THREE.BoxGeometry(chunkSize, 0.1, 1);
        var material = new THREE.MeshBasicMaterial( { color: 0x00aa00} );
        var mesh = new THREE.Mesh(geometry,material);
        mesh.position.z = zPosition;
        objects.push(mesh);
    }

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

    that.init = init;
    that.addToWorld = addToWorld;
    return that;

};
