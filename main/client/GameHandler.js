/*
 global THREE
 */
var GameHandler = GameHandler || {};
var DungeonHop = DungeonHop || {};
GameHandler = (function () {
	"use strict";
    /* eslint-env browser  */
    var that = {},
        infoText = document.getElementById("info-text"),
        ip,
        playerName,
        modelManager,
        models,
        serverInterface,
        activeGame = null,
        renderer;
	
	/*
	creates a new game by destroying the old one and creating a new serverInterface and a new game instance
     */
    function createNewGame() {
        var labels,
            i;
        if (activeGame != undefined) {
            activeGame.destroy();
        }

        labels = document.getElementsByClassName("opponent-label");
        for (i = 0; i < labels.length; i++) {
            labels[i].remove();
        }

        //create new
        serverInterface = new DungeonHop.ServerInterface();
        activeGame = new DungeonHop.GameInstance();
        serverInterface.init(that, activeGame, ip, playerName);
        infoText.innerHTML = "CONNECTING TO SERVER";
        activeGame.init(ip, playerName, models, serverInterface, renderer);
    }
  

    /*
    this will be called after the modelmanager loaded all models
     */
    function loaded(mdls) {
        models = mdls;
        createNewGame();
    }

     /*
    inits the game by setting the important values
     */
    function init(i, name) {
        var canvas = document.createElement("canvas");
        canvas.id = "canvas";
        document.body.appendChild(canvas);
        renderer = new THREE.WebGLRenderer({canvas: canvas});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x4A4A4A, 1); //lava red sky
        document.body.appendChild(renderer.domElement);

        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;

        infoText.innerHTML = "LOADING...";
        ip = i;
        playerName = name;
        modelManager = new DungeonHop.ModelManager();
        modelManager.init(this);
    }

    that.loaded = loaded;
    that.init = init;
    that.createNewGame = createNewGame;
    return that;
})();
