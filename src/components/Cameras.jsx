import { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import { createPlaneMesh } from "../common/plane";
import { createRenderer, renderCanvas } from "../common/renderer";
import { removeOldDatGUI } from "../common/datUtil";

export default function Cameras() {
  useEffect(() => {
    const scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(120, 60, 180);

    const renderer = createRenderer();

    const plane = createPlaneMesh(180, 180)();
    scene.add(plane);

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);

    [...Array(Math.floor(plane.geometry.parameters.height / 5))].forEach(
      (_, j) => {
        [...Array(Math.floor(plane.geometry.parameters.width / 5))].forEach(
          (_, i) => {
            const random = Math.random() * 0.75 + 0.25;
            const cubeMaterial = new THREE.MeshLambertMaterial();
            cubeMaterial.color = new THREE.Color(random, 0, 0);
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

            cube.position.z =
              -(plane.geometry.parameters.height / 2) + 2 + j * 5;
            cube.position.x =
              -(plane.geometry.parameters.width / 2) + 2 + i * 5;
            cube.position.y = 2;

            scene.add(cube);
          }
        );
      }
    );

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(-20, 40, 60);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x292929);
    scene.add(ambientLight);

    renderCanvas(renderer, "cameras");

    const controls = {
      perspective: "Perspective",
      switchCamera: () => {
        if (camera instanceof THREE.PerspectiveCamera) {
          camera = new THREE.OrthographicCamera(
            window.innerWidth / -16,
            window.innerHeight / 16,
            window.innerWidth / 16,
            window.innerHeight / -16,
            -200,
            500
          );
          camera.position.set(120, 60, 180);
          camera.lookAt(scene.position);
          controls.perspective = "Orthographic";
        } else {
          camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
          );
          camera.position.set(120, 60, 180);
          camera.lookAt(scene.position);
          controls.perspective = "Perspective";
        }
      },
    };

    removeOldDatGUI();
    const gui = new dat.GUI();
    gui.add(controls, "switchCamera");
    gui.add(controls, "perspective").listen();

    camera.lookAt(scene.position);

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();
  });

  return <div id="cameras" />;
}
