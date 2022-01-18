import { useEffect } from "react";
import * as THREE from "three";
import { createMultiMaterialObject } from "three/examples/jsm/utils/SceneUtils";
import * as dat from "dat.gui";

export default function CustomGeometry() {
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

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

    camera.position.set(-20, 25, 20);
    camera.lookAt(new THREE.Vector3(5, 0, 0));

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20, 30, 5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const divElement = document.getElementById("custom-geometry");
    if (divElement.hasChildNodes()) {
      divElement.replaceChild(renderer.domElement, divElement.childNodes[0]);
    } else {
      divElement.appendChild(renderer.domElement);
    }

    const vertices = [
      new THREE.Vector3(1, 3, 1),
      new THREE.Vector3(1, 3, -1),
      new THREE.Vector3(1, -1, 1),
      new THREE.Vector3(1, -1, -1),
      new THREE.Vector3(-1, 3, -1),
      new THREE.Vector3(-1, 3, 1),
      new THREE.Vector3(-1, -1, -1),
      new THREE.Vector3(-1, -1, 1),
    ];

    const points = [
      vertices[0],
      vertices[2],
      vertices[1],
      vertices[2],
      vertices[3],
      vertices[1],
      vertices[4],
      vertices[6],
      vertices[5],
      vertices[6],
      vertices[7],
      vertices[5],
      vertices[4],
      vertices[5],
      vertices[1],
      vertices[5],
      vertices[0],
      vertices[1],
      vertices[7],
      vertices[6],
      vertices[2],
      vertices[6],
      vertices[3],
      vertices[2],
      vertices[5],
      vertices[7],
      vertices[0],
      vertices[7],
      vertices[2],
      vertices[0],
      vertices[1],
      vertices[3],
      vertices[4],
      vertices[3],
      vertices[6],
      vertices[4],
    ];

    const geom = new THREE.BufferGeometry();
    geom.vertices = vertices;
    geom.setFromPoints(points);
    geom.computeVertexNormals();

    const materials = [
      new THREE.MeshLambertMaterial({
        opacity: 0.6,
        color: 0x44ff44,
        transparent: true,
      }),
      new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
    ];

    const mesh = createMultiMaterialObject(geom, materials);
    mesh.children.forEach((e) => {
      e.castShadow = true;
    });

    scene.add(mesh);

    const addControl = (x, y, z) => ({
      x,
      y,
      z,
    });

    const controlPoints = [];
    controlPoints.push(addControl(3, 5, 3));
    controlPoints.push(addControl(3, 5, 0));
    controlPoints.push(addControl(3, 0, 3));
    controlPoints.push(addControl(3, 0, 0));
    controlPoints.push(addControl(0, 5, 0));
    controlPoints.push(addControl(0, 5, 3));
    controlPoints.push(addControl(0, 0, 0));
    controlPoints.push(addControl(0, 0, 3));

    if (document.getElementsByClassName("dg ac").length > 0) {
      document.getElementsByClassName("dg ac")[0].childNodes[0].remove();
    }
    const gui = new dat.GUI();
    gui.add(
      {
        clone: () => {
          const clonedGeometry = mesh.children[0].geometry.clone();
          const materials = [
            new THREE.MeshLambertMaterial({
              opacity: 0.6,
              color: 0xff44ff,
              transparent: true,
            }),
            new THREE.MeshBasicMaterial({
              color: 0x000000,
              wireframe: true,
            }),
          ];

          const mesh2 = createMultiMaterialObject(clonedGeometry, materials);
          mesh2.children.forEach((e) => {
            e.castShadow = true;
          });

          mesh2.translateX(5);
          mesh2.translateZ(5);
          mesh2.name = "clone";
          scene.remove(scene.getObjectByName("clone"));
          scene.add(mesh2);
        },
      },
      "clone"
    );

    [...Array(8)].forEach((_, i) => {
      const f1 = gui.addFolder("Vertices " + (i + 1));
      f1.add(controlPoints[i], "x", -10, 10);
      f1.add(controlPoints[i], "y", -10, 10);
      f1.add(controlPoints[i], "z", -10, 10);
    });

    const render = () => {
      mesh.children.forEach(function (e) {
        for (var i = 0; i < 8; i++) {
          e.geometry.vertices[i].set(
            controlPoints[i].x,
            controlPoints[i].y,
            controlPoints[i].z
          );
        }
        e.geometry.verticesNeedUpdate = true;
        e.geometry.computeVertexNormals();
      });

      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();
  });

  return <div id="custom-geometry" />;
}
