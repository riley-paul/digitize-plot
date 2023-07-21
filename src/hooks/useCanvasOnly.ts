import {
  MouseEventHandler,
  WheelEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import usePoints from "./usePoints";
import use2dContext from "./use2dContext";

const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;
const SCROLL_SENSITIVITY = 0.0005;

type Coords = { x: number; y: number };

export default function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = use2dContext(canvasRef);


  const { drawPoints, mouseDownPoints, mouseUpPoints, mouseMovePoints } =
    usePoints(canvasRef);

  const [cameraOffset, setCameraOffset] = useState<Coords>({ x: 0, y: 0 });
  const [cameraZoom, setCameraZoom] = useState<number>(1);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<Coords>({ x: 0, y: 0 });


  useEffect(() => console.log(cameraOffset), [cameraOffset]);
  // useEffect(() => console.log(panStart), [panStart]);
  useEffect(() => console.log(cameraZoom), [cameraZoom]);

  // Draw everything to canvas
  const draw = (context: CanvasRenderingContext2D): void => {
    const { width, height } = context.canvas;

    context.translate(width / 2, height / 2);
    context.scale(cameraZoom, cameraZoom);
    context.translate(
      -width / 2 + cameraOffset.x,
      -height / 2 + cameraOffset.y
    );

    drawPoints(context);
  };

  const getEventLocation = (event: MouseEvent): Coords => {
    return {
      x: event.offsetX / cameraZoom,
      y: event.offsetY / cameraZoom,
    };
  };

  // Event handlers
  const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = (event) => {
    mouseMovePoints(event);

    if (isPanning) {
      setCameraOffset({
        x: getEventLocation(event.nativeEvent).x - panStart.x,
        y: getEventLocation(event.nativeEvent).y - panStart.y,
      });
    }
  };

  const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (event.button === 1) {
      setIsPanning(true);
      setPanStart({
        x: getEventLocation(event.nativeEvent).x - cameraOffset.x,
        y: getEventLocation(event.nativeEvent).y - cameraOffset.y,
      });
    }

    mouseDownPoints(event);
  };

  const handleMouseUp: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (event.button === 1) {
      setIsPanning(false);
    }

    mouseUpPoints(event);
  };

  const handleContextMenu: MouseEventHandler<HTMLCanvasElement> = (event) => {
    event.preventDefault();
  };

  const adjustZoom = (amount: number): void => {
    if (isPanning) return;
    setCameraZoom((prev) => {
      let zoom = prev + amount;
      zoom = Math.min(zoom, MAX_ZOOM);
      zoom = Math.max(zoom, MIN_ZOOM);
      return zoom;
    });
  };

  const handleScroll: WheelEventHandler<HTMLCanvasElement> = (event) => {
    console.log("scrolling");
    event.preventDefault();
    event.stopPropagation();
    adjustZoom(-event.deltaY * SCROLL_SENSITIVITY);
  };

  // draw loop
  useEffect(() => {
    if (!context) return;
    let animationFrameId: number;

    const render = () => {
      // context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      draw(context);
      // context.restore();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  // add and remove event listener for resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => console.log(points), [points]);
  return {
    ref: canvasRef,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseMove: handleMouseMove,
    onContextMenu: handleContextMenu,
    onWheel: handleScroll,
  };
}
