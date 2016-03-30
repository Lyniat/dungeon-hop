Enemy = function () {
    var that = {},
        id,
        xPos,
        zPos,
        chunkSize,
        direction = 1,
        server,
        logic,
        waitTime;

    function init(i, size, srv, log, x, z) {
        id = i;
        chunkSize = size;
        server = srv;
        logic = log;
        xPos = x;
        zPos = z;
        waitTime = Math.random() + 0.3;
        server.createNewEnemy(id, xPos, zPos);
        move();
    }

    /*
     checks if the next field is empty. If so, it will move there and wait for the waitTime before
     moving again
     */
    function move() {
        if (!nextFieldEmpty(direction)) {
            direction *= -1;
        }
        else {
            if (xPos + direction == -1 || xPos + direction == chunkSize) {
                direction *= -1;
            }
            xPos += direction;
            updatePosition();
        }
        setTimeout(function () {
            move();
        }, waitTime * 1000);
    }

    function nextFieldEmpty(direction) {
        var nextX = xPos + direction,
            enemies = logic.getAllEnemies(),
            i,
            enemy;
        for (i = 0; i < enemies.length; i++) {
            enemy = enemies[i];
            if (enemy.getPosition().z != zPos) {
                continue;
            }
            if (enemy.getPosition().x == nextX) {
                return false;
            }
        }
        return true;
    }

    function updatePosition() {
        server.updateEnemyPosition(id, xPos);
    }

    function getId() {
        return id;
    }

    function getPosition() {
        return {x: xPos, z: zPos};
    }

    that.init = init;
    that.getId = getId;
    that.getPosition = getPosition;
    return that;
};
module.exports.Enemy = Enemy;
