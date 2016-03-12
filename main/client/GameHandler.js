GameHandler = (function () {
    var that = {},
        infoText = document.getElementById("info-text"),
        ip,
        playerName,
        modelManager,
        models,
        serverInterface,
        activeGame = null;


    function init(i, name) {
        var canvas = document.createElement("canvas");
        canvas.id = "canvas";
        document.body.appendChild(canvas);
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
        //remove old
        document.getElementById("canvas").remove();
        var canvas = document.createElement("canvas");
        canvas.id = "canvas";
        document.body.appendChild(canvas);

        var labels = document.getElementsByClassName("opponent-label");
        for(var i = 0; i < labels.length; i++){
            labels[i].remove();
        }

        //create new
        serverInterface = new DungeonHop.ServerInterface();
        activeGame = new DungeonHop.GameInstance();
        serverInterface.init(that, activeGame, ip, playerName);
        infoText.innerHTML = "CONNECTING TO SERVER";
        activeGame.init(ip, playerName, models, serverInterface);
    }

    that.loaded = loaded;
    that.init = init;
    that.createNewGame = createNewGame;
    return that;
})();
