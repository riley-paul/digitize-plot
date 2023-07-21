import {
  MouseEventHandler,
  WheelEventHandler,
  useEffect,
  useState,
} from "react";

const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;
const SCROLL_SENSITIVITY = 0.0005;

type Coords = { x: number; y: number };

export default function usePanZoom() {
  const [cameraOffset, setCameraOffset] = useState<Coords>({ x: 0, y: 0 });
  const [cameraZoom, setCameraZoom] = useState<number>(1);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<Coords>({ x: 0, y: 0 });

  useEffect(() => console.log(cameraOffset), [cameraOffset]);
  // useEffect(() => console.log(panStart), [panStart]);
  useEffect(() => console.log(cameraZoom), [cameraZoom]);

  // Draw everything to canvas
  const drawPanZoom = (context: CanvasRenderingContext2D): void => {
    const { width, height } = context.canvas;
    context.translate(width / 2, height / 2);
    context.scale(cameraZoom, cameraZoom);
    context.translate(
      -width / 2 + cameraOffset.x,
      -height / 2 + cameraOffset.y
    );
  };

  const getEventLocation = (event: MouseEvent): Coords => {
    return {
      x: event.offsetX / cameraZoom,
      y: event.offsetY / cameraZoom,
    };
  };

  // Event handlers
  const mouseMovePanZoom: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (isPanning) {
      setCameraOffset({
        x: getEventLocation(event.nativeEvent).x - panStart.x,
        y: getEventLocation(event.nativeEvent).y - panStart.y,
      });
    }
  };

  const mouseDownPanZoom: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (event.button === 2) {
      setIsPanning(true);
      setPanStart({
        x: getEventLocation(event.nativeEvent).x - cameraOffset.x,
        y: getEventLocation(event.nativeEvent).y - cameraOffset.y,
      });
    }
  };

  const mouseUpPanZoom: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (event.button === 1) {
      setIsPanning(false);
    }
  };

  const wheelPanZoom: WheelEventHandler<HTMLCanvasElement> = (event) => {
    console.log("scrolling");
    event.preventDefault();
    event.stopPropagation();

    if (isPanning) return;
    const amount = -event.deltaY * SCROLL_SENSITIVITY;
    setCameraZoom((prev) => {
      let zoom = prev + amount;
      zoom = Math.min(zoom, MAX_ZOOM);
      zoom = Math.max(zoom, MIN_ZOOM);
      return zoom;
    });
  };

  return {
    drawPanZoom,
    mouseMovePanZoom,
    mouseDownPanZoom,
    mouseUpPanZoom,
    wheelPanZoom,
  };
}
