import React from "react";

import Bullseye from "src/components/bullseye";
import DataTable from "src/components/data-table";
import Download from "src/components/download";
import MouseCoords from "src/components/mouse-coords";
import Dropzone from "src/components/dropzone";
import Calibrate from "src/components/calibrate";
import Toggle from "src/components/toggle";
import Help from "src/components/help";
import { Button, IconButton, Theme, Tooltip } from "@radix-ui/themes";

import Logo from "src/components/logo";
import useScrollShadow from "./hooks/use-scroll-shadow";
import { cn } from "./lib/utils";
import { Separator } from "./components/ui/separator";
import { useAtom, useAtomValue } from "jotai/react";
import {
  calibrationsAtom,
  debugAtom,
  imageAtom,
  pointsAtom,
  showHelpAtom,
} from "@/lib/store";
import type Point from "@/geometry/point";
import Canvas from "@/components/canvas";
import { linearCoordsConverterGenerator } from "./lib/interpolators/linear";
import usePoints from "./hooks/use-points";
import useCenterImage from "./hooks/use-center-image";
import useCursor from "./hooks/use-cursor";
import useCopyPoints from "./hooks/use-copy-points";

function App() {
  const [image, setImage] = useAtom(imageAtom);
  const [mousePoint, setMousePoint] = React.useState<Point | undefined>(
    undefined,
  );
  const [calibrations, setCalibrations] = useAtom(calibrationsAtom);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const coordsConverter = linearCoordsConverterGenerator(calibrations);

  const [debug, setDebug] = useAtom(debugAtom);
  const [showHelp, setShowHelp] = useAtom(showHelpAtom);

  const { listRef: leftSideRef, isScrolled: isLeftSideScrolled } =
    useScrollShadow();

  const { clearPoints, points } = usePoints(pointsAtom);

  const centerImage = useCenterImage(canvasRef);
  const cursor = useCursor();

  React.useEffect(() => {
    if (image) centerImage(image);
    if (points.length) clearPoints();
  }, [image, canvasRef.current]);

  const { copyPoints, isCopied } = useCopyPoints(coordsConverter);

  return (
    <Theme accentColor="gray" className="bg-gray-1">
      <div className="flex h-screen w-full">
        <aside
          ref={leftSideRef}
          className="bg-surface flex w-60 flex-col gap-2 overflow-y-auto border-r"
        >
          <header
            className={cn(
              "bg-surface backdrop-blur sticky top-0 z-50 p-4 pb-6",
              isLeftSideScrolled && "shadow",
            )}
          >
            <Logo />
          </header>
          <section className="flex-1 px-4">
            <DataTable coordsConverter={coordsConverter} />
          </section>
          <footer className="bg-card sticky bottom-0 z-50 grid gap-2 border-t p-4">
            <Button
              disabled={points.length === 0}
              className="w-full"
              variant="soft"
              onClick={clearPoints}
            >
              <i className="fa-solid fa-eraser mr-2" />
              Clear Points
            </Button>
            <Button
              disabled={points.length === 0}
              className="w-full"
              variant="soft"
              onClick={copyPoints}
            >
              {isCopied ? (
                <i className="fa-solid fa-check text-green-500 mr-2" />
              ) : (
                <i className="fa-solid fa-copy mr-2" />
              )}
              Copy Points
            </Button>
            <Download coordsConverter={coordsConverter} />
          </footer>
        </aside>
        <main className="relative flex-1" style={{ cursor }}>
          {image ? (
            <>
              <Canvas
                canvasRef={canvasRef}
                mousePoint={mousePoint}
                setMousePoint={setMousePoint}
              />
              <Tooltip side="left" content="Center Image">
                <IconButton
                  size="3"
                  radius="full"
                  className="absolute bottom-4 right-4"
                  onClick={() => centerImage(image)}
                >
                  <i className="fa-solid fa-expand" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Dropzone
              onImageLoad={(img) => {
                setImage(img);
                centerImage(img);
              }}
            />
          )}
          {image && showHelp && <Help />}
        </main>
        <aside className="bg-surface flex w-60 flex-col justify-between overflow-y-auto border-l">
          <div>
            <Bullseye canvasRef={canvasRef} mousePoint={mousePoint} />
            <Separator />
            <MouseCoords
              coordsConverter={coordsConverter}
              mousePoint={mousePoint}
            />
            <Calibrate
              calibrations={calibrations}
              setCalibrations={setCalibrations}
            />
          </div>
          <div className="flex w-full justify-between gap-4 p-6">
            <Toggle
              id="debug"
              name="Debug Mode"
              state={debug}
              setState={setDebug}
            />
            <IconButton
              radius="full"
              variant={showHelp ? "solid" : "soft"}
              onClick={() => setShowHelp(!showHelp)}
            >
              ?
            </IconButton>
          </div>
        </aside>
      </div>
    </Theme>
  );
}

export default App;
