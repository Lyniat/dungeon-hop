/**
 * Created by laurin on 23.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.Chunk = function () {
	"use strict";
    /* eslint-env browser  */
    var that = {},
		objects = [],
        matrix = [],
		chunkSize = 32,
		borderSize = 16,
		models,
        server;

    function addGround(zPosition) {
        var geometry = new THREE.BoxGeometry(chunkSize, 0.1, 1),
			material = new THREE.MeshLambertMaterial({ color: 0x999999}),
			mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = zPosition;
        mesh.position.y = -0.05;
        mesh.position.x = chunkSize / 2 - 0.5;
        objects.push(mesh);
    }

    //adds a wall on the side of the dungeon
    function addWall(zPosition,xPosition){
        var geometry = new THREE.BoxGeometry(borderSize, 1.5, 1),
            material = new THREE.MeshLambertMaterial({ color: 0x444444}),
            mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = zPosition;
        mesh.position.y = 0.75;
        mesh.position.x = -borderSize/2 -0.5 + xPosition;
        objects.push(mesh);
    }

    //requests the wanted chunk from the server
    //creates a new matrix for collision and adds the object the array
    function addObstacles(zPosition) {
        var obstacles = server.getChunkAt(zPosition);
        var i;
        var obstacle;
        for(i = 0; i < chunkSize; i++){
            matrix[i] = obstacles[i];
            if(obstacles[i] != -1) {
                console.log(obstacles[i]);
                obstacle = getObstacleById(obstacles[i]);
                console.log(obstacles);
                obstacle.position.z = zPosition;
                obstacle.position.x = i;
                objects.push(obstacle);
            }
        }
    }

    //gets the wanted model by the id, the server has returned
    function getObstacleById(_id){
        console.log(models);
        var i,
            obstacle,
            object;
        for(i = 0; i < models.length; i++){
            console.log("i: "+i);
            if(models[i].id == _id){
                console.log("found");
                obstacle =  models[i];
            }
        }
        object = obstacle.object.clone();
        return object;
    }

    //adds the models to the visual scene
    function addToScene(scene) {
        var i;
        for (i = 0; i < objects.length; i++) {
            scene.add(objects[i]);
        }
    }
	
	function init(scene, zPosition, mdls,srv) {
        server = srv;
        models = mdls;
        addGround(zPosition);
        addWall(zPosition,0);
        addWall(zPosition,chunkSize+borderSize);
        addObstacles(zPosition);
        addToScene(scene);
        return matrix;
    }

    that.init = init;
    return that;

};
