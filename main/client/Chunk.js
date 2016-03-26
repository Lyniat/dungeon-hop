/*
 global THREE
 */
var DungeonHop = DungeonHop || {};
DungeonHop.Chunk = function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        objects = [],
        matrix = [],
        chunkSize = 24,
        borderSize = 16,
        obstacleModels,
        serverInterface,
        scene,
        zPosition,
        worldCallbackFunction;

    function addGround(zPosition) {
        var geometry = new THREE.BoxGeometry(chunkSize, 0.5, 1),
            material = new THREE.MeshLambertMaterial({color: 0x897869}),
            mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = zPosition;
        mesh.position.y = -0.25;
        mesh.position.x = chunkSize / 2 - 0.5;

        mesh.castShadow = false;
        mesh.receiveShadow = true;

        objects.push(mesh);
    }

    function addLava(zPosition) {
        var geometry = new THREE.BoxGeometry(chunkSize, 0.1, 1),
            material = new THREE.MeshLambertMaterial({color: 0x8E0315}),
            mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = zPosition;
        mesh.position.y = -0.25;
        mesh.position.x = chunkSize / 2 - 0.5;
        objects.push(mesh);
    }

    //adds a wall on the side of the dungeon
    function addWall(zPosition, xPosition) {
        var geometry = new THREE.BoxGeometry(borderSize, 3, 1),
            material = new THREE.MeshLambertMaterial({color: 0x43260D}),
            mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = zPosition;
        mesh.position.y = 0;
        mesh.position.x = -borderSize / 2 - 0.5 + xPosition;
        objects.push(mesh);
    }

    //requests the wanted chunk from the server
    //creates a new matrix for collision and adds the object the array
    function addObstacles(zPosition, chunk) {
        var obstacles = chunk,
            i,
            obstacle,
            obstacleId;
        for (i = 0; i < chunkSize; i++) {
            matrix[i] = obstacles[i];
            if (obstacles[i] >= 0) {
                obstacle = obstacleModels[obstacles[i]].clone();
                obstacle.position.z = zPosition;
                obstacle.position.x = i;

                obstacle.castShadow = true;
                obstacle.receiveShadow = false;

                objects.push(obstacle);
            }
            if (obstacles[i] <= -3) {
                obstacleId = (obstacles[i] + 3) * (-1);
                console.log("obstacle id: " + obstacleId);
                obstacle = obstacleModels[obstacleId].clone();
                obstacle.position.z = zPosition;
                obstacle.position.x = i;
                obstacle.rotation.x = Math.PI;

                obstacle.castShadow = true;
                obstacle.receiveShadow = false;

                objects.push(obstacle);
            }
        }
    }

    //adds the models to the visual scene
    function addToScene(scene) {
        var i;
        for (i = 0; i < objects.length; i++) {
            scene.add(objects[i]);
        }
    }

    function init(sc, zPos, obstacleMdls, srv, func) {
        serverInterface = srv;
        obstacleModels = obstacleMdls;
        scene = sc;
        zPosition = zPos;
        worldCallbackFunction = func;
        //var chunk = server.getChunkAt(zPosition);
        serverInterface.getChunkAt(zPosition, onCallback);
    }

    function onCallback(result) {
        initChunk(result);
        worldCallbackFunction(matrix, zPosition, that);
    }


    function initChunk(chunk) {
        var groundType = chunk[chunkSize];
        if (groundType == 0) {
            addGround(zPosition);
        } else {
            addLava(zPosition);
        }
        addWall(zPosition, 0);
        addWall(zPosition, chunkSize + borderSize);
        addObstacles(zPosition, chunk);
        addToScene(scene);
    }

    function destroyChunk(scene) {
        var i;
        console.log("destroying");
        for (i = 0; i < objects.length; i++) {
            scene.remove(objects[i]);
        }
    }


    that.init = init;
    that.destroyChunk = destroyChunk;
    return that;

};
