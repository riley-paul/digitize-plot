import Bullseye from "./components/Bullseye";
import DataTable from "./components/DataTable";
import Download from "./components/Download";
import MouseCoords from "./components/MouseCoords";
import Point from "./geometry/Point";
import useCanvas from "./hooks/useCanvas";

const coordsConverter = (coords: Point) => coords;

function App() {
  const { points, mousePoint, ...canvasProps } = useCanvas();

  return (
    <div className="w-full h-screen flex">
      <aside className="w-60 bg-white shadow overflow-y-scroll p-4">
        <Download data={points} {...{ coordsConverter }} />
        <DataTable data={points} {...{ coordsConverter }} />
      </aside>
      <main className="flex-1">
        <canvas {...canvasProps} className="w-full h-full" />
      </main>
      <aside className="w-60 bg-white shadow">
        <Bullseye canvasRef={canvasProps.ref} mousePoint={mousePoint} />
        <MouseCoords {...{ coordsConverter, mousePoint }} />
      </aside>
    </div>
  );
}

export default App;
