import { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import { createCamera } from "../common/camera";
import { createRenderer, renderCanvas } from "../common/renderer";
import { createPlaneMesh } from "../common/plane";

export default function LookAt() {
  useEffect(() => {
    const scene = new THREE.Scene();
    let camera = createCamera(scene.position);
    camera.position.set(120, 60, 180);

    const renderer = createRenderer();

    const plane = createPlaneMesh(180, 180)();
    scene.add(plane);

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ee22 });
    [...Array(Math.floor(plane.geometry.parameters.height / 5))].forEach(
      (_, j) => {
        [...Array(Math.floor(plane.geometry.parameters.width / 5))].forEach(
          (_, i) => {
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

    const lookAtGeom = new THREE.SphereGeometry(2);
    const lookAtMesh = new THREE.Mesh(
      lookAtGeom,
      new THREE.MeshLambertMaterial({ color: 0xff0000 })
    );
    scene.add(lookAtMesh);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(-20, 40, 60);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x292929);
    scene.add(ambientLight);

    renderCanvas(renderer, "lookat");

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
          camera = createCamera(scene.position);
          camera.position.set(120, 60, 180);
          controls.perspective = "Perspective";
        }
      },
    };

    const gui = new dat.GUI();
    gui.add(controls, "switchCamera");
    gui.add(controls, "perspective").listen();

    let step = 0;
    const render = () => {
      step += 0.02;
      if (camera instanceof THREE.Camera) {
        const x = 10 + 100 * Math.sin(step);
        camera.lookAt(new THREE.Vector3(x, 10, 0));
        lookAtMesh.position.copy(new THREE.Vector3(x, 10, 0));
      }

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();
  });

  return <div id="lookat" />;
}
