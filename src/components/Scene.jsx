import { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";

export default function Scene() {
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.overrideMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0xeeeeee));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);

    scene.add(plane);

    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20, 30, -5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const divElement = document.getElementById("scene");
    if (divElement.hasChildNodes()) {
      divElement.replaceChild(renderer.domElement, divElement.childNodes[0]);
    } else {
      divElement.appendChild(renderer.domElement);
    }

    const controls = {
      rotationSpeed: 0.02,
      numberOfObjects: scene.children.length,
      removeCube: () => {
        const allChildren = scene.children;
        const lastObject = allChildren[allChildren.length - 1];
        if (lastObject instanceof THREE.Mesh) {
          scene.remove(lastObject);
          controls.numberOfObjects = scene.children.length;
        }
      },
      addCube: () => {
        const cubeSize = Math.ceil(Math.random() * 3);
        const cubeGeometry = new THREE.BoxGeometry(
          cubeSize,
          cubeSize,
          cubeSize
        );
        const cubeMaterial = new THREE.MeshLambertMaterial({
          color: Math.random() * 0xffffff,
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.name = `cube-${scene.children.length}`;

        cube.position.x =
          -30 + Math.round(Math.random() * planeGeometry.parameters.width);
        cube.position.y = Math.round(Math.random() * 5);
        cube.position.z =
          -20 + Math.round(Math.random() * planeGeometry.parameters.height);

        scene.add(cube);
        controls.numberOfObjects = scene.children.length;
      },
      outputObjects: () => {
        console.log(scene.children);
      },
    };

    if (document.getElementsByClassName("dg ac").length > 0) {
      document.getElementsByClassName("dg ac")[0].childNodes[0].remove();
    }
    const gui = new dat.GUI();
    gui.add(controls, "rotationSpeed", 0, 0.5);
    gui.add(controls, "addCube");
    gui.add(controls, "removeCube");
    gui.add(controls, "outputObjects");
    gui.add(controls, "numberOfObjects").listen();

    const render = () => {
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj !== plane) {
          obj.rotation.x += controls.rotationSpeed;
          obj.rotation.y += controls.rotationSpeed;
          obj.rotation.z += controls.rotationSpeed;
        }
      });

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();
  });

  return <div id="scene" />;
}
