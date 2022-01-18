import * as THREE from "three";

const createSpotLight = (color = 0xffffff) => {
  const spotLight = new THREE.SpotLight(color);
  spotLight.position.set(-20, 30, 10);
  spotLight.castShadow = true;

  return spotLight;
};

export { createSpotLight };
