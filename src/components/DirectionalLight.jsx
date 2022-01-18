import { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import { createCamera } from "../common/camera";
import { createRenderer, renderCanvas } from "../common/renderer";
import { createPlaneMesh } from "../common/plane";
import { createCubeMesh } from "../common/cube";
import { createSphereMesh } from "../common/sphere";
import { removeOldDatGUI } from "../common/datUtil";

export default function DirectionalLight() {
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = createCamera(new THREE.Vector3(10, 0, 0));

    const renderer = createRenderer();

    const plane = createPlaneMesh(600, 200, 20, 20)(0xffffff);
    plane.position.set(15, -5, 0);

    scene.add(plane);

    const cube = createCubeMesh()(0xff3333);
    cube.castShadow = true;
    cube.position.set(-4, 3, 0);

    scene.add(cube);

    const sphere = createSphereMesh(4, 20, 20)(0x7777ff);

    sphere.position.set(20, 0, 2);
    sphere.castShadow = true;

    scene.add(sphere);

    camera.position.set(-35, 30, 25);

    const ambiColor = "#1c1c1c";
    const ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    const target = new THREE.Object3D();
    target.position.set(5, 0, 0);

    const pointColor = "#ff5800";
    const directionalLight = new THREE.DirectionalLight(pointColor);
    directionalLight.position.set(-40, 60, -10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 2;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;

    directionalLight.distance = 0;
    directionalLight.intensity = 0.5;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.mapSize.width = 1024;

    scene.add(directionalLight);

    const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    cameraHelper.visible = false;
    scene.add(cameraHelper);

    const sphereLight = new THREE.SphereGeometry(0.2);
    const sphereLightMaterial = new THREE.MeshBasicMaterial({
      color: 0xac6c25,
    });
    const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
    sphereLightMesh.castShadow = true;

    sphereLightMesh.position.set(3, 20, 3);
    scene.add(sphereLightMesh);

    renderCanvas(renderer, "directional-light");

    let step = 0;

    const controls = {
      rotationSpeed: 0.03,
      bouncingSpeed: 0.03,
      ambientColor: ambiColor,
      pointColor,
      intensity: -0.5,
      distance: 0,
      penumbra: 30,
      angle: -0.1,
      debug: false,
      castShadow: true,
      target: "Plane",
    };

    removeOldDatGUI();
    const gui = new dat.GUI();
    gui.addColor(controls, "ambientColor").onChange((e) => {
      ambientLight.color = new THREE.Color(e);
    });
    gui.addColor(controls, "pointColor").onChange((e) => {
      directionalLight.color = new THREE.Color(e);
    });
    gui.add(controls, "intensity", 0, 5).onChange((e) => {
      directionalLight.intensity = e;
    });
    gui.add(controls, "distance", 0, 200).onChange((e) => {
      directionalLight.distance = e;
    });
    gui.add(controls, "debug").onChange((e) => {
      cameraHelper.visible = true;
    });
    gui.add(controls, "castShadow").onChange((e) => {
      directionalLight.castShadow = e;
    });
    gui.add(controls, "target", ["Plane", "Sphere", "Cube"]).onChange((e) => {
      console.log(e);
      switch (e) {
        case "Plane":
          directionalLight.target = plane;
          break;
        case "Sphere":
          directionalLight.target = sphere;
          break;
        case "Cube":
          directionalLight.target = cube;
          break;
        default:
          break;
      }
    });

    const render = () => {
      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;

      step += controls.bouncingSpeed;
      sphere.position.x = 20 + 10 * Math.cos(step);
      sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

      sphereLightMesh.position.z = -8;
      sphereLightMesh.position.y = +(27 * Math.sin(step / 3));
      sphereLightMesh.position.x = 10 + 26 * Math.cos(step / 3);
      directionalLight.position.copy(sphereLightMesh.position);

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();
  });

  return <div id="directional-light" />;
}
