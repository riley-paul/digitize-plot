import { useState } from "react";
import Bullseye from "./components/Bullseye";
import DataTable from "./components/DataTable";
import Download from "./components/Download";
import MouseCoords from "./components/MouseCoords";
import Point from "./geometry/Point";
import useCanvas from "./hooks/useCanvas";
import Dropzone from "./components/Dropzone";
import Calibrate from "./components/Calibrate";
import { Switch } from "./components/ui/switch";
import Toggle from "./components/Toggle";

const coordsConverter = (coords: Point) => coords;

function App() {
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  const [debug, setDebug] = useState(true);
  const { points, mousePoint, ...canvasProps } = useCanvas();

  return (
    <div className="w-full h-screen flex">
      <aside className="w-60 bg-card shadow border-r overflow-y-auto p-4">
        <Download {...{ coordsConverter, points }} />
        <DataTable {...{ coordsConverter, points }} />
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
          <Calibrate />
        </div>
        <Toggle
          id="debug"
          name="Debug Mode"
          state={debug}
          setState={setDebug}
        />
      </aside>
    </div>
  );
}

export default App;
