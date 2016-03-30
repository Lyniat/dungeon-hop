/*
 global THREE
 */

/*
creates a particle system with the given texture
 */

var DungeonHop = DungeonHop || {};
DungeonHop.Particles = function () {
    "use strict";
    /* eslint-env browser  */
    var that = {};

    function init(x, y, z, tex) {
        var particleCount = 5,
            particles = new THREE.Geometry(),
            p,
            xPos,
            yPos,
            zPos,
            particle,
            texture,
            particleMaterial;

        for(p = 0; p < particleCount; p++) {

            xPos = x + (Math.random() - 0.5);
            yPos = y;
            zPos = z + (Math.random() - 0.5);

            particle = new THREE.Vector3(xPos, yPos, zPos);
            particles.vertices.push(particle);
        }

        texture = THREE.ImageUtils.loadTexture("assets/textures/" + tex + ".png");

        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;

        particleMaterial = new THREE.PointsMaterial(
            {
                color: 0xffffff,
                size: 0.2,
                map: texture,
                blending: THREE.AdditiveBlending,
                transparent: true
            });

        return new THREE.Points(particles, particleMaterial);
    }

    that.init = init;
    return that;
};
