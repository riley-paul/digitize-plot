import { useState } from "react";

import useCanvas from "./hooks/useCanvas";

import Bullseye from "./components/Bullseye";
import DataTable from "./components/DataTable";
import Download from "./components/Download";
import MouseCoords from "./components/MouseCoords";
import Dropzone from "./components/Dropzone";
import Calibrate from "./components/Calibrate";
import Toggle from "./components/Toggle";

import { Button } from "./components/ui/button";

function App() {
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  const [debug, setDebug] = useState(false);

  const {
    points,
    mousePoint,
    clearPoints,
    calibrations,
    setCalibrations,
    coordsConverter,
    ...canvasProps
  } = useCanvas(image, debug);

  return (
    <div className="w-full h-screen flex">
      <aside className="w-60 bg-card shadow border-r overflow-y-auto p-4 flex flex-col gap-2 justify-between">
        <DataTable {...{ coordsConverter, points }} />
        <div className="grid gap-2">
          <Button className="w-full" variant="secondary" onClick={clearPoints}>
            Clear Points
          </Button>
          <Download {...{ coordsConverter, points }} />
        </div>
      </aside>
      <main className="flex-1">
        {image ? (
          <canvas {...canvasProps} className="w-full h-full" />
        ) : (
          <Dropzone {...{ setImage }} />
        )}
      </main>
      <aside className="w-60 bg-card shadow border-l overflow-y-auto flex flex-col justify-between">
        <div>
          <Bullseye canvasRef={canvasProps.ref} mousePoint={mousePoint} />
          <MouseCoords {...{ coordsConverter, mousePoint }} />
          <Calibrate {...{ calibrations, setCalibrations }} />
        </div>
        <div className="grid p-6 w-full gap-4">
          <Toggle
            id="debug"
            name="Debug Mode"
            state={debug}
            setState={setDebug}
          />
        </div>
      </aside>
    </div>
  );
}

export default App;
