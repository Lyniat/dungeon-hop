/**
 * Created by laurin on 23.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.World = function () {
	"use strict";
    /* eslint-env browser  */
    var that = {},
		count = 3,
		timer,
		time = document.querySelector('#timer'),
		seconds = 0,
		startButton = document.querySelector('#start'),
		worldMatrix = [],
		actualChunk_Z_Position = 0,
		models,
		scene,
		player,
        server,
		loadDistance = 20;

    function startTimer() {
        var min, sec;
        seconds++;
        min = Math.floor(seconds / 60);
        sec = Math.floor(seconds % 60);
        if (min < 10) {
            min = "0" + min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }
        time.innerHTML = min + ":" + sec;
    }
	 function onStartButtonClicked() {
        timer = setInterval(function () { handleCountdown(count); }, 1000);
        timer();
    }
  
	 //handles a countdown and starts the timer
    function handleCountdown() {
        if (count == 0) {
            time.innerHTML = "START";
            clearInterval(timer);
            setInterval(startTimer, 1000);
        } else {
            time.innerHTML = count;
            count--;
        }
    }
   

    //creates the new chunk and adds the collision information the matrix
    function createChunk() {
        var chunk = new DungeonHop.Chunk();
        var obstacles = chunk.init(scene, actualChunk_Z_Position, models,server);
        addToMatrix(obstacles);
        actualChunk_Z_Position--;
    }

    //tests if the player has moved forward, so that a new chunk must be loaded
    function update() {
        var playerZPosition = player.getPosition().z;
        if (playerZPosition < actualChunk_Z_Position + loadDistance) {
            createChunk();
        }
    }

    function addToMatrix(obstacles){
        worldMatrix[actualChunk_Z_Position] = obstacles;
    }

    //returns the status of the requested fiel in the matrix to check if the player can move
    function getEntryInMatrix(x,z){
        console.log(worldMatrix[z][x]);
        return worldMatrix[z][x];
    }
	
	function init(sc, mdls, pl,srv) {
        server = srv;
		var z;
        player = pl;
        models = mdls;
        scene = sc;
        for (z = 0; z > -16; z--) {
            createChunk();
        }
        startButton.addEventListener("click", onStartButtonClicked);
    }

    that.update = update;
    that.getEntryInMatrix = getEntryInMatrix;
    that.init = init;
    return that;
};
