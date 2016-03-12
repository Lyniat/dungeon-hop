GameHandler = (function () {
    var that = {},
        infoText = document.getElementById("info-text"),
        ip,
        playerName,
        modelManager,
        models,
        serverInterface,
        activeGame = null,
        renderer;


    function init(i, name) {
        var canvas = document.createElement("canvas");
        canvas.id = "canvas";
        document.body.appendChild(canvas);
        renderer = new THREE.WebGLRenderer({canvas: canvas});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xbb0000, 1); //lava red sky
        document.body.appendChild(renderer.domElement);

        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;

        infoText.innerHTML = "LOADING...";
        ip = i;
        playerName = name;
        modelManager = new DungeonHop.ModelManager();
        modelManager.init(this);
    }

    function loaded(mdls) {
        models = mdls;
        createNewGame();
    }

    function createNewGame() {
        if(activeGame != undefined) {
            activeGame.destroy();
        }

        var labels = document.getElementsByClassName("opponent-label");
        for(var i = 0; i < labels.length; i++){
            labels[i].remove();
        }

        //create new
        serverInterface = new DungeonHop.ServerInterface();
        activeGame = new DungeonHop.GameInstance();
        serverInterface.init(that, activeGame, ip, playerName);
        infoText.innerHTML = "CONNECTING TO SERVER";
        activeGame.init(ip, playerName, models, serverInterface, renderer);
    }

    that.loaded = loaded;
    that.init = init;
    that.createNewGame = createNewGame;
    return that;
})();
