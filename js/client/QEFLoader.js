/**
 * Created by laurin on 22.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.QEFLoader = function () {
    var that = {};
    var path = "assets/models/qef/";

    function getModel(fl) {
        var file = loadFile(fl);
        var matrix = parseFile(file);
    }

    //load file as string
    function loadFile(fl) {
        var file = path + fl;
        var rawFile = new XMLHttpRequest();
        var allText;
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    allText = rawFile.responseText;
                }
            }
        };
        rawFile.send(null);
        return allText;
    }

    //parse file and return 3-dimensional matrix with information about color and visibility for each voxel
    function parseFile(fl) {
        var i, x, y, z;
        var matrixIndex = 3;
        var colorSizeIndex = 4;
        var colorListIndex = 5;
        var matrixSize, sizeX, sizeY, sizeZ, colorSize;
        var colorList = [];
        var lines = fl.split("\n");
        matrixSize = lines[matrixIndex].split(" ");
        sizeX = parseInt(matrixSize[0]);
        sizeY = parseInt(matrixSize[1]);
        sizeZ = parseInt(matrixSize[2]);

        //Read colors
        colorSize = parseInt(lines[colorSizeIndex]);
        for (i = 0; i < colorSize; i++) {
            var colors = lines[colorListIndex + i].split(" ");
            var colorTriplet = {r: colors[0], g: colors[1], b: colors[2]};
            colorList.push(colorTriplet);
        }

        //Read voxel matrix
        var matrix = [];

        for (x = 0; x < sizeX; x++) {
            matrix[x] = [];
            for (y = 0; y < sizeY; y++) {
                matrix[x][y] = [sizeZ];
            }
        }

        var voxelIndex = colorSizeIndex + colorSize + 1;
        for (i = voxelIndex; i < lines.length - 1; i++){ //last line in file is always empty
            var values = lines[i].split(" ");
            x = parseInt(values[0]);
            y = parseInt(values[1]);
            z = parseInt(values[2]);
            var colorIndex = values[3];
            var visibilityMask = values[4];
            var color = colorList[colorIndex];
            matrix[x][y][z] = {color:color,mask:visibilityMask};
        }
        return matrix;
    }

    that.getModel = getModel;
    return that;
};