import { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import { createCamera } from "../common/camera";
import { renderCanvas } from "../common/renderer";

export default function BasicMaterial() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = createCamera(new THREE.Vector3(0, 0, 0));

    const webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0xeeeeee));
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMap.enabled = true;

    const groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
    const groundMesh = new THREE.Mesh(
      groundGeom,
      new THREE.MeshBasicMaterial({ color: 0x777777 })
    );

    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -20;
    scene.add(groundMesh);

    const sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
    const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
    const planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

    const meshMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff });
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1));
    meshMaterial.clippingPlanes = [clippingPlane];

    const sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
    const cube = new THREE.Mesh(cubeGeometry, meshMaterial);
    const plane = new THREE.Mesh(planeGeometry, meshMaterial);

    sphere.position.x = 0;
    sphere.position.y = 3;
    sphere.position.z = 2;

    scene.add(cube);

    camera.position.x = -20;
    camera.position.y = 50;
    camera.position.z = 40;
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    renderCanvas(webGLRenderer, "basic-material");

    let step = 0;

    const controls = {
      rotationSpeed: 0.02,
      bouncingSpeed: 0.03,
      opacity: meshMaterial.opacity,
      transparent: meshMaterial.transparent,
      overdraw: meshMaterial.overdraw,
      visible: meshMaterial.visible,
      side: "front",
      color: meshMaterial.color.getStyle(),
      wireframe: meshMaterial.wireframe,
      wireframeLinewidth: meshMaterial.wireframeLinewidth,
      wireframeLineJoin: meshMaterial.wireframeLineJoin,
      clippingEnabled: false,
      clippingPlaneZ: 0,
      selectedMesh: "cube",
    };

    const gui = new dat.GUI();

    const spGui = gui.addFolder("Mesh");
    spGui.add(controls, "opacity", 0, 1).onChange((e) => {
      meshMaterial.opacity = e;
    });
    spGui.add(controls, "transparent").onChange((e) => {
      meshMaterial.transparent = e;
    });
    spGui.add(controls, "wireframe").onChange((e) => {
      meshMaterial.wireframe = e;
    });
    spGui.add(controls, "wireframeLinewidth", 0, 20).onChange((e) => {
      meshMaterial.wireframeLinewidth = e;
    });
    spGui.add(controls, "visible").onChange((e) => {
      meshMaterial.visible = e;
    });
    spGui.add(controls, "side", ["front", "back", "double"]).onChange((e) => {
      switch (e) {
        case "front":
          meshMaterial.side = THREE.FrontSide;
          break;
        case "back":
          meshMaterial.side = THREE.BackSide;
          break;
        case "double":
          meshMaterial.side = THREE.DoubleSide;
          break;
        default:
          break;
      }
      meshMaterial.needsUpdate = true;
    });
    spGui.addColor(controls, "color").onChange((e) => {
      meshMaterial.color.setStyle(e);
    });
    spGui.add(controls, "clippingEnabled").onChange((e) => {
      webGLRenderer.localClippingEnabled = e;
    });
    spGui.add(controls, "clippingPlaneZ", -5.0, 5.0).onChange((e) => {
      meshMaterial.clippingPlanes[0].constant = e;
    });

    const render = () => {
      cube.rotation.y = step += 0.01;
      plane.rotation.y = step;
      sphere.rotation.y = step;

      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    };

    render();
  });

  return <div id="basic-material" />;
}
