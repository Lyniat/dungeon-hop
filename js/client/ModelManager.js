/**
 * Created by laurin on 22.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.ModelManager = function () {
    var that = {};

    function getGeometry(mtx) {
        var face;
        var model = new THREE.Geometry();
        var v = 0;
        for (var x = 0; x < mtx.length; x++) {
            for (var y = 0; y < mtx[0].length; y++) {
                for (var z = 0; z < mtx[0][0].length; z++) {
                    if (mtx[x][y][z] == null){
                        continue;
                    }

                    var color = new THREE.Color();

                    var matrixColor = mtx[x][y][z].color;

                    color.setRGB(matrixColor.r,
                        matrixColor.g,matrixColor.b);

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
        return model;
    }

    return that;
};
