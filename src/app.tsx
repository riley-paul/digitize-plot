import React from "react";
import useCanvas from "src/hooks/use-canvas";

import Bullseye from "src/components/bullseye";
import DataTable from "src/components/data-table";
import Download from "src/components/download";
import MouseCoords from "src/components/mouse-coords";
import Dropzone from "src/components/dropzone";
import Calibrate from "src/components/calibrate";
import Toggle from "src/components/toggle";
import Help from "src/components/help";

import { Button } from "src/components/ui/button";
import Logo from "src/components/logo";
import useHelpStore from "./lib/stores/help-store";
import useScrollShadow from "./hooks/use-scroll-shadow";
import { cn } from "./lib/utils";
import { Separator } from "./components/ui/separator";

function App() {
  const [image, setImage] = React.useState<HTMLImageElement | undefined>();
  const [debug, setDebug] = React.useState(false);

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

  const { listRef: leftSideRef, isScrolled: isLeftSideScrolled } =
    useScrollShadow();

  return (
    <div className="flex h-screen w-full">
      <aside
        ref={leftSideRef}
        className="flex w-60 flex-col overflow-y-auto border-r bg-card"
      >
        <header
          className={cn(
            "sticky top-0 z-50 bg-card p-4 pb-6",
            isLeftSideScrolled && "shadow",
          )}
        >
          <Logo />
        </header>
        <section className="flex-1 px-4">
          <DataTable {...{ coordsConverter, points }} />
        </section>
        <Separator />
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
