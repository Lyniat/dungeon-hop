/**
 * Created by laurin on 23.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.Chunk = function () {
    var that = {};
    var objects = [];
    var chunkSize = 32;
    var borderSize = 8;
    var models;

    function init(scene,zPosition,mdls){
        models = mdls;
        addGround(zPosition);
        addObstacles(zPosition);
        addToScene(scene);
    }

    function addGround(zPosition){
        var geometry = new THREE.BoxGeometry(chunkSize, 0.1, 1);
        var material = new THREE.MeshBasicMaterial( { color: 0x999999} );
        var mesh = new THREE.Mesh(geometry,material);
        mesh.position.z = zPosition;
        mesh.position.y = -0.05;
        mesh.position.x = chunkSize/2-0.5;
        objects.push(mesh);
    }

    function addObstacles(zPosition){
        var i;
        for (i = 0; i < chunkSize; i++){
            //always keep the middle empty
            if(i == 16){
                continue;
            }
            var r = Math.random();
            if(r < 0.3) {
                var obstacle = models[1].clone();
                obstacle.position.z = zPosition;
                obstacle.position.x = i;
                objects.push(obstacle);
            }
        }
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
