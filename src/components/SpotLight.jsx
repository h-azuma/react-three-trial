import { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import { createCamera } from "../common/camera";
import { createRenderer, renderCanvas } from "../common/renderer";
import { createPlaneMesh } from "../common/plane";
import { createCubeMesh } from "../common/cube";
import { createSphereMesh } from "../common/sphere";
import { removeOldDatGUI } from "../common/datUtil";

export default function SpotLight() {
  useEffect(() => {
    let stopMovingLight = false;

    const scene = new THREE.Scene();

    const camera = createCamera(new THREE.Vector3(10, 0, 0));
    const renderer = createRenderer();
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const plane = createPlaneMesh(60, 20)();
    plane.position.set(15, 0, 0);

    scene.add(plane);

    const cube = createCubeMesh()(0xff3333);
    scene.add(cube);

    const sphere = createSphereMesh()();
    scene.add(sphere);

    camera.position.set(-35, 30, 25);

    const ambiColor = "#1c1c1c";
    const ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    const spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 30, -10);
    spotLight0.lookAt(plane);
    scene.add(spotLight0);

    const target = new THREE.Object3D();
    target.position.set(5, 0, 0);

    const pointColor = "#ffffff";
    const spotLight = new THREE.SpotLight(pointColor);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 2;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 30;
    spotLight.target = target;
    spotLight.decay = 1;
    spotLight.distance = 0;
    spotLight.angle = 0.4;

    scene.add(spotLight);

    const cameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    cameraHelper.visible = false;
    scene.add(cameraHelper);

    const sphereLight = new THREE.SphereGeometry(0.2);
    const sphereLightMaterial = new THREE.MeshLambertMaterial({
      color: 0xac6c25,
    });
    const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
    sphereLightMesh.castShadow = true;

    sphereLightMesh.position.set(3, 20, 3);
    scene.add(sphereLightMesh);

    renderCanvas(renderer, "spot-light");

    let step = 0;
    let invert = 1;
    let phase = 0;

    const controls = {
      rotationSpeed: 0.03,
      bouncingSpeed: 0.03,
      ambientColor: ambiColor,
      pointColor,
      intensity: 1,
      decay: 1,
      distance: 0,
      penumbra: 30,
      angle: 0.1,
      debug: false,
      castShadow: true,
      target: "Plane",
      stopMovingLight: false,
    };

    removeOldDatGUI();
    const gui = new dat.GUI();
    gui.addColor(controls, "ambientColor").onChange((e) => {
      ambientLight.color = new THREE.Color(e);
    });
    gui.addColor(controls, "pointColor").onChange((e) => {
      spotLight.color = new THREE.Color(e);
    });
    gui.add(controls, "angle", 0, Math.PI * 2).onChange((e) => {
      spotLight.angle = e;
    });
    gui.add(controls, "intensity", 0, 5).onChange((e) => {
      spotLight.intensity = e;
    });
    gui.add(controls, "decay", 1, 100).onChange((e) => {
      spotLight.decay = e;
    });
    gui.add(controls, "distance", 0, 200).onChange((e) => {
      spotLight.distance = e;
    });
    gui.add(controls, "penumbra", 0, 100).onChange((e) => {
      spotLight.penumbra = e;
    });
    gui.add(controls, "debug").onChange((e) => {
      cameraHelper.visible = e;
    });
    gui.add(controls, "castShadow").onChange((e) => {
      spotLight.castShadow = true;
    });
    gui.add(controls, "target", ["Plane", "Sphere", "Cube"]).onChange((e) => {
      console.log(e);
      switch (e) {
        case "Plane":
          spotLight.target = plane;
          break;
        case "Sphere":
          spotLight.target = sphere;
          break;
        case "Cube":
          spotLight.target = cube;
          break;
        default:
          break;
      }
    });
    gui.add(controls, "stopMovingLight").onChange((e) => {
      stopMovingLight = e;
    });

    const render = () => {
      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;

      step += controls.bouncingSpeed;
      sphere.position.x = 20 + 10 * Math.cos(step);
      sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

      if (!stopMovingLight) {
        if (phase > 2 * Math.PI) {
          invert *= -1;
          phase -= 2 * Math.PI;
        } else {
          phase += controls.rotationSpeed;
        }

        sphereLightMesh.position.z = +(7 * Math.sin(phase));
        sphereLightMesh.position.x = +(14 * Math.cos(phase));
        sphereLightMesh.position.y = 10;

        if (invert < 0) {
          const pivot = 14;
          sphereLightMesh.position.x =
            invert * (sphereLightMesh.position.x - pivot) + pivot;
        }

        spotLight.position.copy(sphereLightMesh.position);
      }

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();
  });

  return <div id="spot-light" />;
}
