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
	
	function objectsLoaded() {
        loadedModels++;
        if (loadedModels === 2) {
            mainApp.loaded(models);
        }
    }
	
    function loadJSON(file) {
        var loader = new THREE.JSONLoader();

        // load a resource
        loader.load(
            // resource URL
            "assets/models/json/" + file + ".js",
            // Function when resource is loaded
            function (geometry, materials) {
                var material = new THREE.MultiMaterial(materials),
					object = new THREE.Mesh(geometry, material);
                object.scale.set(1 / 16, 1 / 16, 1 / 16);
                models.push(object);
                objectsLoaded();
            }
        );
    }
	
	function init(app) {
        mainApp = app;
        loadJSON("geckocube");
        loadJSON("firebowl");
    }
	
    that.init = init;
    return that;
};
