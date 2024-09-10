import { useState } from "react";

import useCanvas from "src1/hooks/use-canvas";

import Bullseye from "src1/components/bullseye";
import DataTable from "src1/components/data-table";
import Download from "src1/components/download";
import MouseCoords from "src1/components/mouse-coords";
import Dropzone from "src1/components/dropzone";
import Calibrate from "src1/components/calibrate";
import Toggle from "src1/components/toggle";
import Help from "src1/components/help";

import { Button } from "src1/components/ui/button";
import Logo from "src1/components/logo";
import useHelpStore from "./components/help-store";

function App() {
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  const [debug, setDebug] = useState(false);

  const { showHelp, setShowHelp } = useHelpStore();

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
          <Button
            disabled={points.length === 0}
            className="w-full"
            variant="secondary"
            onClick={clearPoints}
          >
            <i className="fa-solid fa-broom mr-2" />
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
        {image && showHelp && <Help />}
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
            onClick={() => setShowHelp(!showHelp)}
          >
            ?
          </Button>
        </div>
      </aside>
    </div>
  );
}

export default App;
