import { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare";
import { createCamera } from "../common/camera";
import { createRenderer, renderCanvas } from "../common/renderer";
import { createPlaneMesh } from "../common/plane";
import { createCubeMesh } from "../common/cube";
import { createSphereMesh } from "../common/sphere";
import { removeOldDatGUI } from "../common/datUtil";
import grassTexturePath from "../assets/textures/ground/grasslight-big.jpg";
import lensFlarePath0 from "../assets/textures/lensflare/lensflare0.png";
import lensFlarePath3 from "../assets/textures/lensflare/lensflare3.png";

export default function LensFlare() {
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xaaaaaa, 0.01, 200);

    const camera = createCamera(scene.position);

    const renderer = createRenderer();
    renderer.setClearColor(new THREE.Color(0xaaaaff));

    const textureLoader = new THREE.TextureLoader();
    const textureGrass = textureLoader.load(grassTexturePath);
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(4, 4);

    const plane = createPlaneMesh(
      1000,
      200,
      20,
      20
    )(null, { map: textureGrass });
    plane.position.set(15, 0, 0);

    scene.add(plane);

    const cube = createCubeMesh()();
    cube.position.set(-4, 3, 0);
    scene.add(cube);

    const sphere = createSphereMesh(4, 25, 25)();
    scene.add(sphere);

    camera.position.set(-20, 15, 45);
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    const ambiColor = "#1c1c1c";
    const ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    const spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 60, -10);
    spotLight0.lookAt(plane);
    scene.add(spotLight0);

    const target = new THREE.Object3D();
    target.position.set(5, 0, 0);

    const pointColor = "#ffffff";
    const spotLight = new THREE.DirectionalLight(pointColor);
    spotLight.position.set(30, 10, -50);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 0.1;
    spotLight.shadow.camera.far = 100;
    spotLight.shadow.camera.fov = 50;
    spotLight.target = plane;
    spotLight.distance = 0;
    spotLight.shadow.camera.near = 2;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.left = -100;
    spotLight.shadow.camera.right = 100;
    spotLight.shadow.camera.top = 100;
    spotLight.shadow.camera.bottom = -100;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;

    scene.add(spotLight);

    renderCanvas(renderer, "lens-flare");

    let step = 0;

    const controls = {
      rotationSpeed: 0.03,
      bouncingSpeed: 0.03,
      ambientColor: ambiColor,
      pointColor,
      intensity: 0.1,
      distance: 0,
      exponent: 30,
      angle: 0.1,
      debug: false,
      castShadow: true,
      onlyShadow: false,
      target: "Plane",
    };

    removeOldDatGUI();
    const gui = new dat.GUI();
    gui.addColor(controls, "ambientColor").onChange((e) => {
      ambientLight.color = new THREE.Color(e);
    });
    gui.addColor(controls, "pointColor").onChange((e) => {
      spotLight.color = new THREE.Color(e);
    });
    gui.add(controls, "intensity", 0, 5).onChange((e) => {
      spotLight.intensity = e;
    });

    const textureFlare0 = textureLoader.load(lensFlarePath0);
    const textureFlare3 = textureLoader.load(lensFlarePath3);

    const flareColor = new THREE.Color(0xffaacc);
    const lensFlare = new Lensflare(
      textureFlare0,
      350,
      0.0,
      THREE.AdditiveBlending,
      flareColor
    );

    lensFlare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    lensFlare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    lensFlare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    lensFlare.addElement(new LensflareElement(textureFlare3, 70, 1.0));

    lensFlare.position.copy(spotLight.position);
    spotLight.add(lensFlare);

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

  return <div id="lens-flare" />;
}
