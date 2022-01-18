import BasicScene from "./components/BasicScene";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Scene from "./components/Scene";
import Geometry from "./components/Geometry";
import CustomGeometry from "./components/CustomGeometry";
import CustomMesh from "./components/CustomMesh";
import Cameras from "./components/Cameras";
import LookAt from "./components/LookAt";
import AmbientLight from "./components/AmbientLight";
import PointLight from "./components/PointLight";
import SpotLight from "./components/SpotLight";
import DirectionalLight from "./components/DirectionalLight";
import HemisphereLight from "./components/HemisphereLight";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<BasicScene />} />
        <Route path="/scene" element={<Scene />} />
        <Route path="/geometry" element={<Geometry />} />
        <Route path="/custom-geometry" element={<CustomGeometry />} />
        <Route path="/custom-mesh" element={<CustomMesh />} />
        <Route path="/cameras" element={<Cameras />} />
        <Route path="/lookat" element={<LookAt />} />
        <Route path="/ambient" element={<AmbientLight />} />
        <Route path="/point" element={<PointLight />} />
        <Route path="/spot" element={<SpotLight />} />
        <Route path="/directional" element={<DirectionalLight />} />
        <Route path="/hemisphere" element={<HemisphereLight />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
