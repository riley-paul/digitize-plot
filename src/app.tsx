import React from "react";
import useCanvas from "@/hooks/use-canvas";

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
import useScrollShadow from "./hooks/use-scroll-shadow";
import { cn } from "./lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAtom } from "jotai/react";
import { debugAtom, imgAtom, showHelpAtom } from "@/lib/store";
import ClearPointsButton from "./components/clear-points-button";

function App() {
  const [image, setImage] = useAtom(imgAtom);
  const [debug, setDebug] = useAtom(debugAtom);
  const [showHelp, setShowHelp] = useAtom(showHelpAtom);

  const { centerImage, ...canvasProps } = useCanvas();

  const { listRef: leftSideRef, isScrolled: isLeftSideScrolled } =
    useScrollShadow();

  React.useEffect(() => {
    if (image) centerImage(image);
  }, [image, canvasProps.ref.current]);

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full">
        <aside
          ref={leftSideRef}
          className="flex w-60 flex-col gap-2 overflow-y-auto border-r bg-card"
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
            <DataTable />
          </section>
          <footer className="sticky bottom-0 z-50 grid gap-2 border-t bg-card p-4">
            <ClearPointsButton />
            <Download />
          </footer>
        </aside>
        <main className="relative flex-1">
          {image ? (
            <>
              <canvas {...canvasProps} className="h-full w-full" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="absolute bottom-4 right-4 rounded-full"
                    size="icon"
                    onClick={() => centerImage(image)}
                  >
                    <i className="fa-solid fa-expand" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Center Image</TooltipContent>
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
        <aside className="flex w-60 flex-col justify-between overflow-y-auto border-l bg-card">
          <div>
            <Bullseye canvasRef={canvasProps.ref} />
            <Separator />
            <MouseCoords />
            <Calibrate />
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
    </TooltipProvider>
  );
}

export default App;
