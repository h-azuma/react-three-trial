import { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import { createCamera } from "../common/camera";
import { createRenderer, renderCanvas } from "../common/renderer";
import { createPlaneMesh } from "../common/plane";
import { createSpotLight } from "../common/spotLight";
import { removeOldDatGUI } from "../common/datUtil";

export default function AmbientLight() {
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = createCamera(new THREE.Vector3(10, 0, 0));

    const renderer = createRenderer();
    const plane = createPlaneMesh(60, 20)();
    plane.position.set(15, 0, 0);

    scene.add(plane);

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    cube.position.set(-4, 3, 0);
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.set(20, 0, 2);
    sphere.castShadow = true;

    scene.add(sphere);

    camera.position.set(-25, 30, 25);

    const ambiColor = "#0c0c0c";
    const ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    const spotLight = createSpotLight();
    spotLight.position.set(-20, 30, -5);
    scene.add(spotLight);

    renderCanvas(renderer, "ambient-light");

    let step = 0;

    const controls = {
      rotationSpeed: 0.02,
      bouncingSpeed: 0.03,
      ambientColor: ambiColor,
      disableSpotLight: false,
    };

    removeOldDatGUI();
    const gui = new dat.GUI();
    gui.addColor(controls, "ambientColor").onChange((e) => {
      ambientLight.color = new THREE.Color(e);
    });
    gui.add(controls, "disableSpotLight").onChange((e) => {
      spotLight.visible = !e;
    });

    const render = () => {
      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;

      step += controls.bouncingSpeed;
      sphere.position.x = 20 + 10 * Math.cos(step);
      sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();
  });

  return <div id="ambient-light" />;
}
