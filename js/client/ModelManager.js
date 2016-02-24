/**
 * Created by laurin on 22.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.ModelManager = function () {
    var that = {};
    var mainApp;

    var models = [];

    var loadedModels = 0;

    function init(app){
        mainApp = app;
        loadJSON("geckocube");
        loadJSON("firebowl");
    }

    function loadJSON(file){

        var loader = new THREE.JSONLoader();

        // load a resource
        loader.load(
            // resource URL
            "assets/models/json/"+file+".js",
            // Function when resource is loaded
            function ( geometry, materials ) {
                var material = new THREE.MultiMaterial( materials );
                var object = new THREE.Mesh( geometry, material );
                object.scale.set(1/16,1/16,1/16);
                models.push(object);
                objectsLoaded();
            }
        );
    }

    function objectsLoaded(){
        loadedModels++;
        if(loadedModels == 2) {
            mainApp.loaded(models);
        }
    }

    that.init = init;
    return that;
};
