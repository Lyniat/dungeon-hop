/**
 * Created by laurin on 23.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.Chunk = function () {
	"use strict";
    /* eslint-env browser  */
    var that = {},
		objects = [],
		chunkSize = 32,
		borderSize = 8,
		models;

    function addGround(zPosition) {
        var geometry = new THREE.BoxGeometry(chunkSize, 0.1, 1),
			material = new THREE.MeshBasicMaterial({ color: 0x999999}),
			mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = zPosition;
        mesh.position.y = -0.05;
        mesh.position.x = chunkSize / 2 - 0.5;
        objects.push(mesh);
    }

    function addObstacles(zPosition) {
        var i, r, obstacle;
        for (i = 0; i < chunkSize; i++) {
            //always keep the middle empty
            if (i === 16) {
                continue;
            }
            r = Math.random();
            if (r < 0.3) {
				obstacle = models[1].clone();
                obstacle.position.z = zPosition;
                obstacle.position.x = i;
                objects.push(obstacle);
            }
        }
    }

    function addToScene(scene) {
        var i;
        for (i = 0; i < objects.length; i++) {
            scene.add(objects[i]);
        }
    }

    function addToWorld(worldMatrix) {
        var i,
			matrixLength = worldMatrix.length,
			totalSize = chunkSize + borderSize * 2;
        worldMatrix[matrixLength] = [totalSize];
        for (i = 0; i < totalSize; i++) {
            if (i < borderSize || i >= borderSize + chunkSize) {
                worldMatrix[matrixLength][i] = 0;
            } else {
				worldMatrix[matrixLength][i] = 1;
			}
        }
    }
	
	function init(scene, zPosition, mdls) {
        models = mdls;
        addGround(zPosition);
        addObstacles(zPosition);
        addToScene(scene);
    }

    that.init = init;
    that.addToWorld = addToWorld;
    return that;

};
