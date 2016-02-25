/**
 * Created by laurin on 22.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.ModelManager = function () {
	"use strict";
    /* eslint-env browser  */
    var that = {},
		mainApp,
		models = [],
		loadedModels = 0;
    var ids = {barell:0,firebowl:1,stonething:2};
	
	function objectsLoaded() {
        loadedModels++;
        if (loadedModels == 5) {
            mainApp.loaded(models);
        }
    }
	
    function loadJSON(file,type) {
        var loader = new THREE.JSONLoader();

        // load a resource
        loader.load(
            // resource URL
            "assets/models/json/" + file + ".js",
            //when resource is loaded
            function (geometry, materials) {
                var material = new THREE.MultiMaterial(materials),
					object = new THREE.Mesh(geometry, material);
                object.scale.set(1 / 16, 1 / 16, 1 / 16);

                var id;

                if(type=="obstacle"){
                    id = ids[file];
                }
                else{
                    id = -1;
                }

                models.push({object:object,id:id,type:type,name:file});
                objectsLoaded();
            }
        );
    }
	
	function init(app) {
        mainApp = app;
        loadJSON("geckocube","player");
        loadJSON("piggycube","player");
        loadJSON("firebowl","obstacle");
        loadJSON("barell","obstacle");
        loadJSON("stonething","obstacle");
    }
	
    that.init = init;
    return that;
};
