/*
 global THREE
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
        var loader = new THREE.JSONLoader(),
            name,
            object;

        // load a resource
        loader.load(
            // resource URL
            "assets/models/json/" + path + ".js",
            //when resource is loaded
            function (geometry, materials) {
                var material = new THREE.MultiMaterial(materials),
                    mesh = new THREE.Mesh(geometry, material);
                mesh.scale.set(1 / 16, 1 / 16, 1 / 16);

                name = path.split("/")[1];

                object = {object: mesh, type: type, name: name, id: id};

                models.push(object);
                objectsLoaded();
            }
        );
    }

    //http://stackoverflow.com/questions/14388452/how-do-i-load-a-json-object-from-a-file-with-ajax
    function fetchJSONFile(path, callback) {
        var httpRequest = new XMLHttpRequest(),
            data;
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    data = JSON.parse(httpRequest.responseText);
                    if (callback) {
                        callback(data);
                    }
                }
            }
        };
        httpRequest.open("GET", path);
        httpRequest.send();
    }

    function getModelAmount(data) {
        var modelNum = 0,
            key,
            object,
            value;
        for (key in data) {
            value = data[key];
            for (object in value) {
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
        var content = files[name],
            value,
            key,
            objectName,
            id,
            path;
        for (key in content) {
            value = content[key];
            objectName = value["name"];
            id = value["id"];
            path = name + "/" + objectName;
            console.log(path);
            loadJSON(name + "/" + objectName, name, id);
        }
    }


    function init(app) {
        mainApp = app;
        fetchJSONFile("assets/models/json/files.json", function (data) {
            loadModels(data);
        });
    }

    that.init = init;
    return that;
};
