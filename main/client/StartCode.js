/*
 global bootbox
 */

function startWebsite() {
    var cookie = document.cookie;
    var entries = cookie.split(";");
    var lastIp = entries[0].split("=")[1];
    var lastName = "Random Player";
    var ip = null;
    var name = "";
    if (entries[1] != undefined) {
        lastName = entries[1].split("=")[1];
    }
    if (lastIp == "" || lastIp == null) {
        lastIp = "52.28.150.118:8080";
    }

    openFPSCounter();
    openBootbox();

    /*
    open Bootbox to enter ip and username
     */
    function openBootbox() {
        bootbox.prompt({
            title: "Please enter the server address. If you want to play on the official server, use 'os' as server address.",
            value: lastIp,
            callback: function (result) {
                if (result === null) {
                    ip = lastIp;
                } else {
                    ip = result;
                    bootbox.prompt({
                        title: "Please enter your player name",
                        value: lastName,
                        callback: function (result) {
                            if (result === null) {
                                name = lastName;
                            } else {
                                name = result;
                                startGame();
                            }
                        }
                    });
                }

            }
        });
    }

    /*
    load FPS counter at the top of the screen
     */
    function openFPSCounter(){
        var script = document.createElement("script");
        script.onload = function () {
            var stats = new Stats();
            stats.domElement.style.cssText = "position:fixed;left:0;top:0;z-index:10000";
            document.body.appendChild(stats.domElement);
            requestAnimationFrame(function loop() {
                stats.update();
                requestAnimationFrame(loop);
            });
        };
        script.src = "//rawgit.com/mrdoob/stats.js/master/build/stats.min.js";
        document.head.appendChild(script);
    }

    function startGame() {
        if (ip != null) {
            ip = ip.split("!")[0];
            if (ip == "os") {
                ip = "52.28.150.118:8080";
            }
            document.cookie = "lastIp=" + ip;
            document.cookie = "lastName=" + name;
            GameHandler.init(ip, name);
            //DungeonHop.init(ip,name);
        }
    }
}
