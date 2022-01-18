import { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import { createRenderer, renderCanvas } from "../common/renderer";
import { createCamera } from "../common/camera";
import { createSpotLight } from "../common/spotLight";
import { createPlaneMesh } from "../common/plane";
import { removeOldDatGUI } from "../common/datUtil";

export default function CustomMesh() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = createCamera(scene.position);
    const renderer = createRenderer();

    const plane = createPlaneMesh()();
    scene.add(plane);

    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    const spotLight = createSpotLight();
    scene.add(spotLight);

    renderCanvas(renderer, "custom-mesh");

    const material = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
    const geom = new THREE.BoxGeometry(5, 8, 3);
    const cube = new THREE.Mesh(geom, material);
    cube.position.y = 4;
    cube.castShadow = true;
    scene.add(cube);

    const controls = {
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      positionX: 0,
      positionY: 4,
      positionZ: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scale: 1,
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      visible: true,
      translate: () => {
        cube.translateX(controls.translateX);
        cube.translateY(controls.translateY);
        cube.translateZ(controls.translateZ);

        controls.positionX = cube.position.x;
        controls.positionY = cube.position.y;
        controls.positionZ = cube.position.z;
      },
    };

    removeOldDatGUI();
    const gui = new dat.GUI();

    const guiScale = gui.addFolder("scale");
    guiScale.add(controls, "scaleX", 0, 5);
    guiScale.add(controls, "scaleY", 0, 5);
    guiScale.add(controls, "scaleZ", 0, 5);

    const guiPosition = gui.addFolder("position");
    const contX = guiPosition.add(controls, "positionX", -10, 10);
    const contY = guiPosition.add(controls, "positionY", -4, 20);
    const contZ = guiPosition.add(controls, "positionZ", -10, 10);

    contX.listen();
    contX.onChange((value) => {
      cube.position.x = controls.positionX;
    });

    contY.listen();
    contY.onChange((value) => {
      cube.position.y = controls.positionY;
    });

    contZ.listen();
    contZ.onChange((value) => {
      cube.position.z = controls.positionZ;
    });

    const guiRotation = gui.addFolder("rotation");
    guiRotation.add(controls, "rotationX", -4, 4);
    guiRotation.add(controls, "rotationY", -4, 4);
    guiRotation.add(controls, "rotationZ", -4, 4);

    const guiTranslate = gui.addFolder("translate");
    guiTranslate.add(controls, "translateX", -10, 10);
    guiTranslate.add(controls, "translateY", -10, 10);
    guiTranslate.add(controls, "translateZ", -10, 10);
    guiTranslate.add(controls, "translate");

    gui.add(controls, "visible");

    const render = () => {
      cube.visible = controls.visible;

      cube.rotation.x = controls.rotationX;
      cube.rotation.y = controls.rotationY;
      cube.rotation.z = controls.rotationZ;

      cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();
  });

  return <div id="custom-mesh" />;
}
