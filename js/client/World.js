/**
 * Created by laurin on 23.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.World = function () {
    var that = {};
    var count = 3;
    var timer;
    var time = document.querySelector('#timer');
    var seconds = 0;
    var startButton = document.querySelector('#start');
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
        startButton.addEventListener("click", onStartButtonClicked);
    }
    function onStartButtonClicked(){
        timer = setInterval(function() { handleCountdown(count); }, 1000);
        timer();
    }

    //handles a countdown and starts the timer
    function handleCountdown() {
        if(count === 0) {
            time.innerHTML = "START";
            clearInterval(timer);
            setInterval(startTimer, 1000);
        } else {
            time.innerHTML = count;
            count--;
        }
    }

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
