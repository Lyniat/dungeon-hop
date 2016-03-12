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
		loadedModels = 0,
        modelAmount;
	
	function objectsLoaded() {
        loadedModels++;
        if (loadedModels == modelAmount) {
            mainApp.loaded(models);
        }
    }
	
    function loadJSON(path, type, id) {
        var loader = new THREE.JSONLoader();

        // load a resource
        loader.load(
            // resource URL
            "assets/models/json/" + path + ".js",
            //when resource is loaded
            function (geometry, materials) {
                var material = new THREE.MultiMaterial(materials),
					mesh = new THREE.Mesh(geometry, material);
                mesh.scale.set(1 / 16, 1 / 16, 1 / 16);

                var name = path.split("/")[1];

                var object = {object: mesh, type: type, name: name, id: id};

                models.push(object);
                objectsLoaded();
            }
        );
    }

    //http://stackoverflow.com/questions/14388452/how-do-i-load-a-json-object-from-a-file-with-ajax
    function fetchJSONFile(path, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (callback) {
						callback(data);
					}
				}
            }
        };
        httpRequest.open('GET', path);
        httpRequest.send();
    }
	
	function getModelAmount(data) {
        var modelNum = 0;
        for (var key in data) {
            var value = data[key];
            for(var object in value) {
                modelNum++;
            }
        }
        return modelNum;
    }

    function loadModels(data) {
        modelAmount = getModelAmount(data);
        loadObjects("players", data);
        loadObjects("obstacles", data);
        loadObjects("enemies", data);
    }

    function loadObjects(name, files) {
        var content = files[name];
        for (var key in content) {
            var value = content[key];
            var objectName = value["name"];
            var id = value["id"];
            var path = name+"/"+objectName;
            console.log(path);
            loadJSON(name+"/"+objectName,name,id);
        }
    }

    
	
	function init(app) {
        mainApp = app;
        fetchJSONFile('assets/models/json/files.json', function (data) {
            loadModels(data);
        });
    }
	
    that.init = init;
    return that;
};
