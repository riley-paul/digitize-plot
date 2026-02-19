import React from "react";

import Bullseye from "src/components/bullseye";
import DataTable from "src/components/data-table";
import Download from "src/components/download";
import MouseCoords from "src/components/mouse-coords";
import Dropzone from "src/components/dropzone";
import Calibrate from "src/components/calibrate";
import Toggle from "src/components/toggle";
import Help from "src/components/help";

import Logo from "src/components/logo";
import useScrollShadow from "./hooks/use-scroll-shadow";
import { cn } from "./lib/utils";
import { useAtom } from "jotai/react";
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
import { Provider } from "./components/ui/provider";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Separator,
  Spacer,
  Switch,
  VStack,
} from "@chakra-ui/react";
import { Tooltip } from "./components/ui/tooltip";

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
    <Provider>
      <HStack height="100vh" width="100vw">
        <aside
          ref={leftSideRef}
          className="flex w-60 flex-col gap-2 overflow-y-auto border-r bg-surface"
        >
          <header
            className={cn(
              "sticky top-0 z-50 bg-surface p-4 pb-6 backdrop-blur",
              isLeftSideScrolled && "shadow",
            )}
          >
            <Logo />
          </header>
          <section className="flex-1 px-4">
            <DataTable coordsConverter={coordsConverter} />
          </section>
          <footer className="sticky bottom-0 z-50 grid gap-2 border-t bg-surface p-4 backdrop-blur">
            <Button
              disabled={points.length === 0}
              className="w-full"
              variant="subtle"
              onClick={clearPoints}
            >
              <i className="fa-solid fa-eraser" />
              Clear Points
            </Button>
            <Button
              disabled={points.length === 0}
              className="w-full"
              variant="subtle"
              onClick={copyPoints}
            >
              {isCopied ? (
                <i className="fa-solid fa-check text-green-500" />
              ) : (
                <i className="fa-solid fa-copy" />
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
              <div className="absolute bottom-4 right-4 grid gap-3">
                <Tooltip content="Clear Image">
                  <IconButton
                    size="sm"
                    rounded="full"
                    onClick={() => {
                      setImage(undefined);
                      clearPoints();
                    }}
                  >
                    <i className="fa-solid fa-xmark" />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Center Image">
                  <IconButton
                    size="sm"
                    rounded="full"
                    onClick={() => centerImage(image)}
                  >
                    <i className="fa-solid fa-expand" />
                  </IconButton>
                </Tooltip>
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
        <VStack bg="bg.panel" w="60" p="4" flexShrink="0" height="vh">
          <Box flexGrow="1">
            <Bullseye canvasRef={canvasRef} mousePoint={mousePoint} />
            <MouseCoords
              coordsConverter={coordsConverter}
              mousePoint={mousePoint}
            />
            <Calibrate
              calibrations={calibrations}
              setCalibrations={setCalibrations}
            />
          </Box>
          <Separator />
          <Flex w="full" py="2">
            <Switch.Root
              checked={debug}
              onCheckedChange={({ checked }) => setDebug(checked)}
            >
              <Switch.HiddenInput id="debug" name="Debug Mode" />
              <Switch.Control />
              <Switch.Label>Debug Mode</Switch.Label>
            </Switch.Root>
            <Spacer />
            <IconButton
              rounded="full"
              size="xs"
              variant={showHelp ? "solid" : "subtle"}
              onClick={() => setShowHelp(!showHelp)}
            >
              ?
            </IconButton>
          </Flex>
        </VStack>
      </HStack>
    </Provider>
  );
}

export default App;
