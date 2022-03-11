import { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import { createCamera } from "../common/camera";
import { renderCanvas } from "../common/renderer";

export default function MeshDepthMaterial() {
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.overrideMaterial = new THREE.MeshDepthMaterial();

    const camera = createCamera(new THREE.Vector3(-50, 40, 50));
    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    renderCanvas(renderer, "depth-material");

    const controls = {
      cameraNear: camera.near,
      cameraFar: camera.far,
      rotationSpeed: 0.02,
      numberOfObjects: scene.children.length,
      removeCube: () => {
        const allChildren = scene.children;
        const lastObject = allChildren[allChildren.length - 1];
        if (lastObject instanceof THREE.Mesh) {
          scene.remove(lastObject);
          this.numberOfObjects = scene.children.length;
        }
      },
      addCube: () => {
        const cubeSize = Math.ceil(3 + Math.random() * 3);
        const cubeGeometry = new THREE.BoxGeometry(
          cubeSize,
          cubeSize,
          cubeSize
        );
        // const cubeMaterial = new THREE.MeshLambertMaterial({
        //   color: Math.random() * 0xffffff,
        // });
        const cubeMaterial = new THREE.MeshDepthMaterial();
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        cube.position.x = -60 + Math.round(Math.random() * 100);
        cube.position.y = Math.round(Math.random() * 10);
        cube.position.z = -100 + Math.round(Math.random() * 150);

        scene.add(cube);
        controls.numberOfObjects = scene.children.length;
      },
    };

    const gui = new dat.GUI();
    gui.add(controls, "rotationSpeed", 0, 0.5);
    gui.add(controls, "addCube");
    gui.add(controls, "removeCube");
    gui.add(controls, "cameraNear", 0, 50).onChange((e) => {
      camera.near = e;
      camera.updateProjectionMatrix();
    });
    gui.add(controls, "cameraFar", 100, 300).onChange((e) => {
      camera.far = e;
      camera.updateProjectionMatrix();
    });

    [...Array(10)].forEach((_) => {
      controls.addCube();
    });

    const render = () => {
      scene.traverse((e) => {
        if (e instanceof THREE.Mesh) {
          e.rotation.x += controls.rotationSpeed;
          e.rotation.y += controls.rotationSpeed;
          e.rotation.z += controls.rotationSpeed;
        }
      });

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();
  });

  return <div id="depth-material" />;
}
