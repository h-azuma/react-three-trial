import { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import { createCamera } from "../common/camera";
import { createRenderer, renderCanvas } from "../common/renderer";
import { createPlaneMesh } from "../common/plane";
import { removeOldDatGUI } from "../common/datUtil";

export default function PointLight() {
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = createCamera(new THREE.Vector3(10, 0, 0));
    const renderer = createRenderer();

    const plane = createPlaneMesh(60, 20, 20, 20)();
    plane.position.set(15, 0, 0);

    scene.add(plane);

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff7777 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    cube.position.set(-4, 3, 0);
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphererMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphererMaterial);

    sphere.position.set(20, 0, 2);
    sphere.castShadow = true;

    scene.add(sphere);

    camera.position.set(-25, 30, 25);

    const ambiColor = "#0c0c0c";
    const ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 40, -10);
    spotLight.castShadow = true;

    const pointColor = "#ccffcc";
    const pointLight = new THREE.PointLight(pointColor);
    pointLight.distance = 100;
    scene.add(pointLight);

    const sphereLight = new THREE.SphereGeometry(0.2);
    const sphereLightMaterial = new THREE.MeshBasicMaterial({
      color: 0xac6c25,
    });
    const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
    sphereLightMesh.castShadow = true;

    sphereLightMesh.position.set(3, 0, 3);
    scene.add(sphereLightMesh);

    renderCanvas(renderer, "point-light");

    let step = 0;

    let invert = 1;
    let phase = 0;

    const controls = {
      rotationSpeed: 0.03,
      bouncingSpeed: 0.03,
      ambientColor: ambiColor,
      pointColor,
      intensity: 1,
      distance: 100,
      decay: 1,
    };

    removeOldDatGUI();
    const gui = new dat.GUI();
    gui.addColor(controls, "ambientColor").onChange((e) => {
      ambientLight.color = new THREE.Color(e);
    });
    gui.addColor(controls, "pointColor").onChange((e) => {
      pointLight.color = new THREE.Color(e);
    });
    gui.add(controls, "intensity", 0, 3).onChange((e) => {
      pointLight.intensity = e;
    });
    gui.add(controls, "distance", 0, 100).onChange((e) => {
      pointLight.distance = e;
    });
    gui.add(controls, "decay", 1, 100).onChange((e) => {
      pointLight.decay = e;
    });

    const render = () => {
      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;

      step += controls.bouncingSpeed;
      sphere.position.x = 20 + 10 * Math.cos(step);
      sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

      if (phase > 2 * Math.PI) {
        invert = invert * -1;
        phase -= 2 * Math.PI;
      } else {
        phase += controls.rotationSpeed;
      }
      sphereLightMesh.position.z = +(7 * Math.sin(phase));
      sphereLightMesh.position.x = +(14 * Math.cos(phase));
      sphereLightMesh.position.y = 5;

      if (invert < 0) {
        const pivot = 14;
        sphereLightMesh.position.x =
          invert * (sphereLightMesh.position.x - pivot) + pivot;
      }

      pointLight.position.copy(sphereLightMesh.position);

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();
  });

  return <div id="point-light" />;
}
