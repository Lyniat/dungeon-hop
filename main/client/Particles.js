var DungeonHop = DungeonHop || {};
DungeonHop.Particles = function () {
	"use strict";
    /* eslint-env browser  */
    var that = {},
        particleSystem;

    function init(x, y, z, tex) {
// The number of particles in a particle system is not easily changed.
        var particleCount = 5,

        // Particles are just individual vertices in a geometry
        // Create the geometry that will hold all of the vertices
			particles = new THREE.Geometry();

        // Create the vertices and add them to the particles geometry
        for (var p = 0; p < particleCount; p++) {

            // This will create all the vertices in a range of -200 to 200 in all directions
            var xPos = x + (Math.random()-0.5);
            var yPos = y;
            var zPos = z + (Math.random()-0.5);

            // Create the vertex
            var particle = new THREE.Vector3(xPos, yPos, zPos);

            // Add the vertex to the geometry
            particles.vertices.push(particle);
        }

        var tex = THREE.ImageUtils.loadTexture("assets/textures/"+tex+".png");

        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.LinearMipMapLinearFilter;

        // Create the material that will be used to render each vertex of the geometry
        var particleMaterial = new THREE.PointsMaterial(
            {
                color: 0xffffff,
                size: 0.2,
                map: tex,
                blending: THREE.AdditiveBlending,
                transparent: true
            });

        // Create the particle system
        return particleSystem = new THREE.Points(particles, particleMaterial);
    }

    that.init = init;
    return that;
};
