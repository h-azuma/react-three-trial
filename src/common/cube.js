import * as THREE from "three";

const createCubeMesh =
  (width = 4, height = 4, depth = 4) =>
  (color = 0xff0000) => {
    const cubeGeometry = new THREE.BoxGeometry(width, height, depth);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    cube.position.set(-4, 3, 0);

    return cube;
  };

export { createCubeMesh };
