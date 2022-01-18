import * as THREE from "three";

const createSphereMesh =
  (radius = 4, widthSegment = 20, heightSegment = 20) =>
  (color = 0x7777ff) => {
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegment,
      heightSegment
    );
    const sphereMaterial = new THREE.MeshLambertMaterial({ color });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.set(20, 0, 2);
    sphere.castShadow = true;

    return sphere;
  };

export { createSphereMesh };
