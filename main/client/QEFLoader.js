/*
 this code can load models in the qef format to a matrix but is not used at this time. maybe w need it later so we dont delete this code but it can be ignored
 /*

/*
var DungeonHop = DungeonHop || {};
DungeonHop.QEFLoader = function () {
    "use strict";
    var that = {},
        path = "assets/models/qef/";

    function getMatrix(fl) {
        var file = loadFile(fl),
            matrix = parseFile(file);
        console.log(matrix);
        return matrix;
    }

    //load file as string
    function loadFile(fl) {
        var file = path + fl;
        var rawFile = new XMLHttpRequest();
        var allText;
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState == 4) {
                if (rawFile.status == 200 || rawFile.status == 0) {
                    allText = rawFile.responseText;
                }
            }
        };
        rawFile.send(null);
        return allText;
    }

    //parse file and return 3-dimensional matrix with information about color and visibility for each voxel
    function parseFile(fl) {
        var i,
            x,
            y,
            z,
            matrixIndex = 3,
            colorSizeIndex = 4,
            colorListIndex = 5,
            matrixSize, sizeX, sizeY, sizeZ, colorSize,
            colorList = [],
            lines = fl.split("\n"),
            colors,
            colorTriplet,
            matrix,
            voxelIndex,
            colorIndex,
            values,
            visibilityMask,
            color;
        matrixSize = lines[matrixIndex].split(" ");
        sizeX = parseInt(matrixSize[0]);
        sizeY = parseInt(matrixSize[1]);
        sizeZ = parseInt(matrixSize[2]);

        //Read colors
        colorSize = parseInt(lines[colorSizeIndex]);
        for (i = 0; i < colorSize; i++) {
            colors = lines[colorListIndex + i].split(" ");
            colorTriplet = {r: colors[0], g: colors[1], b: colors[2]};
            colorList.push(colorTriplet);
        }

        //Read voxel matrix
        matrix = [];

        for (x = 0; x < sizeX; x++) {
            matrix[x] = [];
            for (y = 0; y < sizeY; y++) {
                matrix[x][y] = [sizeZ];
                for (z = 0; z < sizeY; z++) {
                    matrix[x][y][z] = null;

                }

            }
        }

        voxelIndex = colorSizeIndex + colorSize + 1;
        for (i = voxelIndex; i < lines.length - 1; i++) { //last line in file is always empty
            values = lines[i].split(" ");
            x = parseInt(values[0]);
            y = parseInt(values[1]);
            z = parseInt(values[2]);
            colorIndex = values[3];
            visibilityMask = values[4];
            color = colorList[colorIndex];
            matrix[x][y][z] = {color: color, mask: visibilityMask};
        }
        return matrix;
    }

    that.getMatrix = getMatrix;
    return that;
};
*/