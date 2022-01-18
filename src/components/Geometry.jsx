import { useEffect } from "react";
import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";
import { ParametricGeometries } from "three/examples/jsm/geometries/ParametricGeometries.js";
import { createMultiMaterialObject } from "three/examples/jsm/utils/SceneUtils.js";

export default function Geometry() {
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

    camera.position.set(-50, 30, 20);
    camera.lookAt(new THREE.Vector3(-10, 0, 0));

    const ambientLight = new THREE.AmbientLight(0x090909);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-25, 25, 32);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const addGeometries = () => {
      const geoms = [];
      geoms.push(new THREE.CylinderGeometry(1, 4, 4));
      geoms.push(new THREE.BoxGeometry(2, 2, 2));
      geoms.push(new THREE.SphereGeometry(2));
      geoms.push(new THREE.IcosahedronGeometry(4));

      const points = [
        new THREE.Vector3(2, 2, 2),
        new THREE.Vector3(2, 2, -2),
        new THREE.Vector3(-2, 2, -2),
        new THREE.Vector3(-2, 2, 2),
        new THREE.Vector3(2, -2, 2),
        new THREE.Vector3(2, -2, -2),
        new THREE.Vector3(-2, -2, -2),
        new THREE.Vector3(-2, -2, 2),
      ];
      geoms.push(new ConvexGeometry(points));

      const radius = 3;
      const pts = [...Array(Math.floor(Math.PI * 10))].map((_, i) => {
        const angle = i / 10;
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0
        );
      });
      geoms.push(new THREE.LatheGeometry(pts, 12));

      geoms.push(new THREE.OctahedronGeometry(3));
      geoms.push(new ParametricGeometry(ParametricGeometries.mobius3d, 20, 10));
      geoms.push(new THREE.TetrahedronGeometry(3));
      geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));
      geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

      geoms.forEach((geom, i) => {
        const materials = [
          new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            flatShading: THREE.FlatShading,
          }),
          new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
        ];

        const mesh = createMultiMaterialObject(geom, materials);
        mesh.traverse((e) => {
          e.castShadow = true;
        });

        mesh.position.x = -24 + (i % 4) * 12;
        mesh.position.y = 4;
        mesh.position.z = -8 + Math.floor(i / 4) * 12;

        scene.add(mesh);
      });
    };
    addGeometries(scene);

    const divElement = document.getElementById("geometry");
    if (divElement.hasChildNodes()) {
      divElement.replaceChild(renderer.domElement, divElement.childNodes[0]);
    } else {
      divElement.appendChild(renderer.domElement);
    }

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();
  });

  return <div id="geometry"></div>;
}
