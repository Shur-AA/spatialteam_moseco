import React from "react";
import { Map } from "./modules/map";
import "mapbox-gl/dist/mapbox-gl.css";
import { Sidebar } from "./modules/sidebar";
import { TimeSlider } from "./modules/time-slider";
import { useSelector } from "react-redux";
import { getSelectedParameter, getMode } from "./root-slice/root-selectors";
import { BASE_MODE } from "./root-slice/root-slice";

function App() {
  const param = useSelector(getSelectedParameter);
  const mode = useSelector(getMode);
  const isBaseMode = mode === BASE_MODE;

  return (
    <div className="app-root">
      <Map />
      <Sidebar />
      {param && isBaseMode && <TimeSlider />}
    </div>
  );
}

export default App;
