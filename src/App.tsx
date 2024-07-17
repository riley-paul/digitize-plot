import { useState } from "react";

import useCanvas from "./hooks/useCanvas";
import useHelp from "./hooks/useHelp";

import Bullseye from "./components/Bullseye";
import DataTable from "./components/DataTable";
import Download from "./components/Download";
import MouseCoords from "./components/MouseCoords";
import Dropzone from "./components/Dropzone";
import Calibrate from "./components/Calibrate";
import Toggle from "./components/Toggle";
import Help from "./components/Help";

import { Button } from "./components/ui/button";
import Logo from "./components/Logo";

function App() {
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  const [debug, setDebug] = useState(false);

  const { showHelp, handleSetShowHelp } = useHelp();

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
    <div className="flex h-screen w-full">
      <aside className="flex w-60 flex-col gap-2 overflow-y-auto border-r bg-card">
        <header className="sticky top-0 bg-card p-4 pb-6">
          <Logo />
        </header>
        <section className="flex-1 px-4">
          <DataTable {...{ coordsConverter, points }} />
        </section>
        <footer className="sticky bottom-0 grid gap-2 bg-card p-4">
          <Button className="w-full" variant="secondary" onClick={clearPoints}>
            Clear Points
          </Button>
          <Download {...{ coordsConverter, points }} />
        </footer>
      </aside>
      <main className="relative flex-1">
        {image ? (
          <canvas {...canvasProps} className="h-full w-full" />
        ) : (
          <Dropzone {...{ setImage }} />
        )}
        {image && showHelp && <Help setShowHelp={handleSetShowHelp} />}
      </main>
      <aside className="flex w-60 flex-col justify-between overflow-y-auto border-l bg-card">
        <div>
          <Bullseye canvasRef={canvasProps.ref} mousePoint={mousePoint} />
          <MouseCoords {...{ coordsConverter, mousePoint }} />
          <Calibrate {...{ calibrations, setCalibrations }} />
        </div>
        <div className="flex w-full justify-between gap-4 p-6">
          <Toggle
            id="debug"
            name="Debug Mode"
            state={debug}
            setState={setDebug}
          />
          <Button
            className="rounded-full"
            size="icon"
            variant={showHelp ? "default" : "secondary"}
            onClick={() => handleSetShowHelp(!showHelp)}
          >
            ?
          </Button>
        </div>
      </aside>
    </div>
  );
}

export default App;
