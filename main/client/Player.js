/*
 global THREE
 */
var DungeonHop = DungeonHop || {};
DungeonHop.Player = function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        object,
        moveDirection = new THREE.Vector3(),
        world,
        normalScale,
        time = 0,
        falling,
        gameStatus,
        playerId,
        serverInterface,
        opponents,
        enemies,
        //playerSound = "assets/sounds/jump.mp3",
        losingSound = "assets/sounds/splash.mp3",
        moving = false,
        scene,
        dead = false;

    function loadPlayer(geometry) {
        object = geometry;
        object.castShadow = true;
        object.receiveShadow = false;
        object.position.y = 0;
        object.position.x = (playerId + 1) * 4;
        object.position.z = 0;
    }

    function onKeyUp(evt) {
        evt.preventDefault();
        if (!gameStatus.active && !gameStatus.finished) {
            return;
        }
        if (evt.keyCode == "87") {
            moveDirection.z = -1;

        }
        if (evt.keyCode == "83") {
            moveDirection.z = 1;

        }
        if (evt.keyCode == "65") {
            moveDirection.x = -1;


        }
        if (evt.keyCode == "68") {
            moveDirection.x = 1;

        }
    }

    function setDucking(ducking) {
        if (ducking) {
            console.log(normalScale);
            object.scale.y = normalScale / 1.15;
        } else {
            object.scale.y = normalScale * 1.15;
        }
    }

    function onKeyDown(evt) {
        evt.preventDefault();
        if (!gameStatus.active) {
            return;
        }
        if (evt.keyCode == "87") {
            setDucking(true);
        }
        if (evt.keyCode == "83") {
            setDucking(true);
        }
        if (evt.keyCode == "65") {
            setDucking(true);
        }
        if (evt.keyCode == "68") {
            setDucking(true);
        }
    }

    function addListeners() {
        window.addEventListener("keydown", onKeyDown, false);
        window.addEventListener("keyup", onKeyUp, false);
    }

    /*
    rotates the player to the direction hes moving
     */
    function rotate() {
        if (moveDirection.x == -1) {
            //left
            object.rotation.y = Math.PI / 2;
        }
        if (moveDirection.x == 1) {
            //left
            object.rotation.y = -Math.PI / 2;
        }
        if (moveDirection.z == -1) {
            //forward
            object.rotation.y = 0;
        }
        if (moveDirection.z == 1) {
            //backward
            object.rotation.y = Math.PI;
        }
    }

    /*
    fall through ground if dead
     */
    function fallDown(deltaTime) {
        object.position.y -= deltaTime * 3;
    }

    /*
    move to the nex position if
        moving is allowed
        the game is active
        the doesnt want to move to positive z position
        hes blocked by obstacles
        hes blocked by other players

     after that the game checks if the player fell into lava or had contact with an enmy.
     in this cases he will die
     */
    function move(deltaTime) {
        var field,
            i,
            opponent,
            enemy;
        if (moving == true) {
            moveDirection = new THREE.Vector3(0, 0, 0);
            return;
        }
        if (!gameStatus.active) {
            return;
        }
        time += deltaTime;
        //object.position.y = Math.abs(Math.sin(time));
        if (falling) {
            fallDown(deltaTime);
            return;
        }
        //prevent from going out of map
        if (moveDirection.z + object.position.z > 0) {
            moveDirection = new THREE.Vector3(0, 0, 0);
            return;
        }
        if (moveDirection.z != 0 || moveDirection.x != 0) {
            setDucking(false);

            rotate(moveDirection);

            //check if no obstacle is blocking
            field = world.getEntryInMatrix(object.position.x + moveDirection.x, object.position.z + moveDirection.z);
            if (field >= 0 || field == undefined) {
                moveDirection = new THREE.Vector3(0, 0, 0);
                return;
            }

            //check if no other player is blocking
            for (i = 0; i < opponents.length; i++) {
                opponent = opponents[i];
                if (opponent != undefined && opponent != null) {
                    if (opponent.getPosition().x == object.position.x + moveDirection.x && opponent.getPosition().z == object.position.z + moveDirection.z) {
                        moveDirection = new THREE.Vector3(0, 0, 0);
                        return;
                    }
                }
            }

            //check if enemy is colliding
            for (i = 0; i < enemies.length; i++) {
                enemy = enemies[i];
                if (enemy != undefined && enemy != null) {
                    if (enemy.getPosition().x == object.position.x + moveDirection.x && enemy.getPosition().z == object.position.z + moveDirection.z) {
                        console.log("enemy collision!");
                        informEnemyCollision();
                    }
                }
            }

            //object.position.add(moveDirection);
            moving = true;
            //var audio = new Audio(playerSound);
            //audio.play();
            updateServer();
            movePosition(2.5, moveDirection.x, moveDirection.z);
            moveDirection = new THREE.Vector3(0, 0, 0);
            if (field == -2) {
                informEnemyCollision();
            }
        }

    }

    /*
    move to position over a given time to animate
     */
    function movePosition(t, x, z) {
        setTimeout(function () {
            t--;
            object.position.x += x / 2.5;
            object.position.z += z / 2.5;
            object.position.y = t / 2.5;
            if (t > 0) {
                movePosition(t, x, z);
            }
            else {
                object.position.x = Math.round(object.position.x);
                object.position.z = Math.round(object.position.z);
                moving = false;
            }

        }, 10);
    }

    function updateServer() {
        var x = object.position.x + moveDirection.x;
        var z = object.position.z + moveDirection.z;
        serverInterface.updatePlayerPosition(x, z);
    }


    function informEnemyCollision() {
        if (!dead && !gameStatus.finished) {
            dead = true;
            serverInterface.setPlayerDead();
            die();
        }
    }

    /*
    fall through ground and play a sound if dead
     */
    function die() {
        falling = true;
        var audio = new Audio(losingSound);
        audio.play();
        setTimeout(function () {
            var particles = new DungeonHop.Particles();
            var particleSystem = particles.init(getPosition().x, 1, getPosition().z, "skull");
            scene.add(particleSystem);
            setTimeout(function () {
                scene.remove(particleSystem);
            }, 4000);
        }, 200);
    }

    function update(deltaTime) {
        move(deltaTime);
    }

    function getPosition() {
        return object.position;
    }

    function getObject() {
        return object;
    }


    function init(geometry, wrld, scn, gameStat, srv, id, opps, enms) {
        world = wrld;
        scene = scn;
        normalScale = geometry.scale.y;
        gameStatus = gameStat;
        serverInterface = srv;
        playerId = id;
        opponents = opps;
        enemies = enms;
        loadPlayer(geometry);
        addListeners();
        scene.add(object);
    }

    that.init = init;
    that.getPosition = getPosition;
    that.getObject = getObject;
    that.update = update;
    that.die = die;
    that.informEnemyCollision = informEnemyCollision;
    return that;
};
