import React from "react";

import Bullseye from "src/components/bullseye";
import DataTable from "src/components/data-table";
import DownloadLink from "src/components/download";
import MouseCoords from "src/components/mouse-coords";
import Dropzone from "src/components/dropzone";
import Calibrate from "src/components/calibrate";
import Help from "src/components/help";

import Logo from "src/components/logo";
import useScrollShadow from "./hooks/use-scroll-shadow";
import { cn } from "./lib/utils";
import { useAtom } from "jotai/react";
import {
  calibrationsAtom,
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
import { TooltipProvider } from "./components/ui/tooltip";
import { Button } from "./components/ui/button";
import DebugToggle from "./components/controls/debug-toggle";
import HelpToggle from "./components/controls/help-toggle";
import CanvasControls from "./components/controls/canvas-controls";
import { IconDownload } from "@tabler/icons-react";

function App() {
  const [image, setImage] = useAtom(imageAtom);
  const [mousePoint, setMousePoint] = React.useState<Point | undefined>(
    undefined,
  );
  const [calibrations, setCalibrations] = useAtom(calibrationsAtom);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const coordsConverter = linearCoordsConverterGenerator(calibrations);

  const [showHelp] = useAtom(showHelpAtom);

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
    <TooltipProvider>
      <div className="flex h-screen w-full">
        <aside
          ref={leftSideRef}
          className="bg-surface flex w-60 flex-col gap-2 overflow-y-auto border-r"
        >
          <header
            className={cn(
              "bg-surface sticky top-0 z-50 p-4 pb-6 backdrop-blur",
              isLeftSideScrolled && "shadow",
            )}
          >
            <Logo />
          </header>
          <section className="flex-1 px-4">
            <DataTable coordsConverter={coordsConverter} />
          </section>
          <footer className="sticky bottom-0 z-50 grid gap-2 border-t p-4 backdrop-blur">
            <Button disabled={points.length === 0} onClick={clearPoints}>
              <i className="fa-solid fa-eraser" />
              Clear Points
            </Button>
            <Button disabled={points.length === 0} onClick={copyPoints}>
              {isCopied ? (
                <i className="fa-solid fa-check text-green-500" />
              ) : (
                <i className="fa-solid fa-copy" />
              )}
              Copy Points
            </Button>
            <DownloadLink coordsConverter={coordsConverter}>
              <Button disabled={points.length === 0} className="w-full">
                <IconDownload />
                Download CSV
              </Button>
            </DownloadLink>
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
              <div className="absolute right-4 bottom-4">
                <CanvasControls canvasRef={canvasRef} />
              </div>
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
        <aside className="bg-sidebar flex w-60 flex-col justify-between divide-y overflow-y-auto border-l">
          <div className="divide-y">
            <Bullseye canvasRef={canvasRef} mousePoint={mousePoint} />
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
            <DebugToggle />
            <HelpToggle />
          </div>
        </aside>
      </div>
    </TooltipProvider>
  );
}

export default App;
