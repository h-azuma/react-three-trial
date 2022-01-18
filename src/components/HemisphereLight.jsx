import { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import { createCamera } from "../common/camera";
import { createRenderer, renderCanvas } from "../common/renderer";
import { createCubeMesh } from "../common/cube";
import { createSphereMesh } from "../common/sphere";
import { removeOldDatGUI } from "../common/datUtil";
import grassTexturePath from "../assets/textures/ground/grasslight-big.jpg";

export default function HemisphereLight() {
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xaaaaaa, 0.01, 200);

    const camera = createCamera(new THREE.Vector3(10, 0, 0));
    const renderer = createRenderer();

    renderer.setClearColor(new THREE.Color(0xaaaaff));

    const textureLoader = new THREE.TextureLoader();
    const textureGrass = textureLoader.load(grassTexturePath);
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(4, 4);

    const planeGeometry = new THREE.PlaneGeometry(1000, 200, 20, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({ map: textureGrass });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    scene.add(plane);

    const cube = createCubeMesh()();
    cube.position.set(-4, 3, 0);
    scene.add(cube);

    const sphere = createSphereMesh(4, 25, 25)(0x7777ff);
    sphere.position.set(10, 5, 10);
    sphere.castShadow = true;

    scene.add(sphere);

    camera.position.set(-20, 15, 45);
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    const spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 60, -10);
    spotLight0.lookAt(plane);
    scene.add(spotLight0);

    const target = new THREE.Object3D();
    target.position.set(5, 0, 0);

    const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);

    const pointColor = "#ffffff";
    const dirLight = new THREE.DirectionalLight(pointColor);
    dirLight.position.set(30, 10, -50);
    dirLight.castShadow = true;
    dirLight.target = plane;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.camera.width = 2048;
    dirLight.shadow.camera.height = 2048;

    scene.add(dirLight);

    renderCanvas(renderer, "hemisphere-light");

    let step = 0;

    const controls = {
      rotationSpeed: 0.03,
      bouncingSpeed: 0.03,
      hemisphere: true,
      color: 0x00ff00,
      skyColor: 0x0000ff,
      intensity: 0.6,
    };

    removeOldDatGUI();
    const gui = new dat.GUI();

    gui.add(controls, "hemisphere").onChange((e) => {
      if (!e) {
        hemiLight.intensity = 0;
      } else {
        hemiLight.intensity = controls.intensity;
      }
    });
    gui.addColor(controls, "color").onChange((e) => {
      hemiLight.groundColor = new THREE.Color(e);
    });
    gui.addColor(controls, "skyColor").onChange((e) => {
      hemiLight.color = new THREE.Color(e);
    });
    gui.add(controls, "intensity", 0, 5).onChange((e) => {
      hemiLight.intensity = e;
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

  return <div id="hemisphere-light" />;
}
