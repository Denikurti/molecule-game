import { useState } from "react";
import BuildPanel from "./components/BuildPanel";
import Scene3D from "./components/Scene3D";
import "./app.css";

export default function App() {
  const [selected, setSelected] = useState("O"); // start with Oxygen

  return (
    <div className="layout">
      <Scene3D selectedElement={selected} />
      <div className="panelWrap">
        <BuildPanel
          selectedElement={selected}
          onSelectElement={setSelected}
          onClear={() => alert("cleared")}
        />
      </div>
    </div>
  );
}
