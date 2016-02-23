var DungeonHop = DungeonHop || {};
DungeonHop.ModelCreator = function () {
    var that = {};

    function createFromMatrix(mtx) {
        var face;
        var model = new THREE.Geometry();
        var v = 0;
        var xLength = mtx.length;
        var yLength = mtx[0].length;
        var zLength = mtx[0][0].length;
        for (var x = 0; x < xLength; x++) {
            for (var y = 0; y < yLength; y++) {
                for (var z = 0; z < zLength; z++) {
                    if (mtx[x][y][z] == null) {
                        continue;
                    }

                    var color = new THREE.Color();

                    var matrixColor = mtx[x][y][z].color;

                    var size = 1;
                    color.setRGB(matrixColor.r,
                        matrixColor.g, matrixColor.b);

                    //if (mtx[x + 1][y + 1][z + 2] == "") {
                    model.vertices.push(new THREE.Vector3(x + size, y + size, z + size));
                    model.vertices.push(new THREE.Vector3(x, y + size, z + size));
                    model.vertices.push(new THREE.Vector3(x, y, z + size));
                    face = new THREE.Face3(v++, v++, v++);
                    face.color = color;
                    model.faces.push(face);

                    model.vertices.push(new THREE.Vector3(x + size, y + size, z + size));
                    model.vertices.push(new THREE.Vector3(x, y, z + size));
                    model.vertices.push(new THREE.Vector3(x + size, y, z + size));
                    face = new THREE.Face3(v++, v++, v++);
                    face.color = color;
                    model.faces.push(face);
                    //}
                    //if (mtx[x + 2][y + 1][z + 1] == "") {
                    model.vertices.push(new THREE.Vector3(x + size, y + size, z + size));
                    model.vertices.push(new THREE.Vector3(x + size, y, z + size));
                    model.vertices.push(new THREE.Vector3(x + size, y, z));
                    face = new THREE.Face3(v++, v++, v++);
                    face.color = color;
                    model.faces.push(face);

                    model.vertices.push(new THREE.Vector3(x + size, y + size, z + size));
                    model.vertices.push(new THREE.Vector3(x + size, y, z));
                    model.vertices.push(new THREE.Vector3(x + size, y + size, z));
                    face = new THREE.Face3(v++, v++, v++);
                    face.color = color;
                    model.faces.push(face);
                    //}
                    //if (mtx[x + 1][y + 2][z + 1] == "") {
                    model.vertices.push(new THREE.Vector3(x + size, y + size, z + size));
                    model.vertices.push(new THREE.Vector3(x + size, y + size, z));
                    model.vertices.push(new THREE.Vector3(x, y + size, z));
                    face = new THREE.Face3(v++, v++, v++);
                    face.color = color;
                    model.faces.push(face);

                    model.vertices.push(new THREE.Vector3(x + size, y + size, z + size));
                    model.vertices.push(new THREE.Vector3(x, y + size, z));
                    model.vertices.push(new THREE.Vector3(x, y + size, z + size));
                    face = new THREE.Face3(v++, v++, v++);
                    face.color = color;
                    model.faces.push(face);
                    //}
                    //if (mtx[x + 1][y + 1][z] == "") {
                    model.vertices.push(new THREE.Vector3(x, y, z));
                    model.vertices.push(new THREE.Vector3(x, y + size, z));
                    model.vertices.push(new THREE.Vector3(x + size, y + size, z));
                    face = new THREE.Face3(v++, v++, v++);
                    face.color = color;
                    model.faces.push(face);

                    model.vertices.push(new THREE.Vector3(x, y, z));
                    model.vertices.push(new THREE.Vector3(x + size, y + size, z));
                    model.vertices.push(new THREE.Vector3(x + size, y, z));
                    face = new THREE.Face3(v++, v++, v++);
                    face.color = color;
                    model.faces.push(face);
                    //}
                    //if (mtx[x][y + 1][z + 1] == "") {
                    model.vertices.push(new THREE.Vector3(x, y, z));
                    model.vertices.push(new THREE.Vector3(x, y, z + size));
                    model.vertices.push(new THREE.Vector3(x, y + size, z + size));
                    face = new THREE.Face3(v++, v++, v++);
                    face.color = color;
                    model.faces.push(face);

                    model.vertices.push(new THREE.Vector3(x, y, z));
                    model.vertices.push(new THREE.Vector3(x, y + size, z + size));
                    model.vertices.push(new THREE.Vector3(x, y + size, z));
                    face = new THREE.Face3(v++, v++, v++);
                    face.color = color;
                    model.faces.push(face);
                    //}
                    //if (mtx[x + 1][y][z + 1] == "") {
                    model.vertices.push(new THREE.Vector3(x, y, z));
                    model.vertices.push(new THREE.Vector3(x + size, y, z + size));
                    model.vertices.push(new THREE.Vector3(x, y, z + size));
                    face = new THREE.Face3(v++, v++, v++);
                    face.color = color;
                    model.faces.push(face);

                    model.vertices.push(new THREE.Vector3(x, y, z));
                    model.vertices.push(new THREE.Vector3(x + size, y, z));
                    model.vertices.push(new THREE.Vector3(x + size, y, z + size));
                    face = new THREE.Face3(v++, v++, v++);
                    face.color = color;
                    model.faces.push(face);
                    //}
                }
            }
        }

        var material = new THREE.MeshLambertMaterial({vertexColors: THREE.FaceColors, side: THREE.FrontSide});
        var object = new THREE.Mesh(model,material);

        var longestSide;

        if(xLength > zLength){
            longestSide = xLength;
        }
        else{
            longestSide = zLength;
        }

        var scale = (1/longestSide)*0.8;

        object.scale.set(scale,scale,scale);

        return object;
    }

    that.createFromMatrix = createFromMatrix;
    return that;
};