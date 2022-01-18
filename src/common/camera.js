import * as THREE from "three";

const createCamera = (lookAtPosition) => {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(-30, 40, 30);
  camera.lookAt(lookAtPosition);

  return camera;
};

export { createCamera };
