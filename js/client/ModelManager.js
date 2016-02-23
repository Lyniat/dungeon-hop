/**
 * Created by laurin on 22.02.16.
 */
var DungeonHop = DungeonHop || {};
DungeonHop.ModelManager = function () {
    var that = {};

    var gekko;

    function init(){
        var QEFLoader = new DungeonHop.QEFLoader();
        var modelCreator = new DungeonHop.ModelCreator();

        var matrix = QEFLoader.getMatrix("geccocube.qef");
        gekko = modelCreator.createFromMatrix(matrix);
    }

    function getGekko(){
        return gekko;
    }

    that.getGekko = getGekko;
    that.init = init;
    return that;
};
