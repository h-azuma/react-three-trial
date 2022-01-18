import * as THREE from "three";

const createRenderer = () => {
  const renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0xeeeeee));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  return renderer;
};

const renderCanvas = (renderer, divName) => {
  const divElement = document.getElementById(divName);
  if (divElement.hasChildNodes()) {
    divElement.replaceChild(renderer.domElement, divElement.childNodes[0]);
  } else {
    divElement.appendChild(renderer.domElement);
  }
};

export { createRenderer, renderCanvas };
