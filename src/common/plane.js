import * as THREE from "three";

const createPlaneMesh =
  (width = 60, height = 40, widthSegment = 1, heightSegment = 1) =>
  (color = 0xffffff, props) => {
    const planeGeometry = new THREE.PlaneGeometry(
      width,
      height,
      widthSegment,
      heightSegment
    );
    const materialArgs = color === null ? props : { color, ...props };
    const planeMaterial = new THREE.MeshLambertMaterial(materialArgs);
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);

    return plane;
  };

export { createPlaneMesh };
