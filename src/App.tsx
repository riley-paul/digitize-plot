import { useState } from "react";
import Bullseye from "./components/Bullseye";
import DataTable from "./components/DataTable";
import Download from "./components/Download";
import MouseCoords from "./components/MouseCoords";
import Point from "./geometry/Point";
import useCanvas from "./hooks/useCanvas";
import Dropzone from "./components/Dropzone";

const coordsConverter = (coords: Point) => coords;

function App() {
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  const { points, mousePoint, ...canvasProps } = useCanvas();

  return (
    <div className="w-full h-screen flex">
      <aside className="w-60 bg-white shadow overflow-y-scroll p-4">
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
      <aside className="w-60 bg-white shadow">
        <Bullseye canvasRef={canvasProps.ref} mousePoint={mousePoint} />
        <MouseCoords {...{ coordsConverter, mousePoint }} />
      </aside>
    </div>
  );
}

export default App;
