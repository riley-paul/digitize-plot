import {
  MouseEventHandler,
  WheelEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import Point from "../geometry/Point";
import { QuadTree, createQuadTree } from "../geometry/QuadTree";

const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;
const SCROLL_SENSITIVITY = 0.0005;

type Coords = { x: number; y: number };

export default function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quadtree = useRef<QuadTree | null>(null);

  const [context, setContext] = useState<
    CanvasRenderingContext2D | undefined | null
  >(undefined);
  const [points, setPoints] = useState<Point[]>([]);
  const [mousePoint, setMousePoint] = useState<Point | undefined>(undefined);
  const [currentPointId, setCurrentPointId] = useState<string>("");
  const [draggingId, setDraggingId] = useState<string>("");

  const [cameraOffset, setCameraOffset] = useState<Coords>({ x: 0, y: 0 });
  const [cameraZoom, setCameraZoom] = useState<number>(1);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<Coords>({ x: 0, y: 0 });

  useEffect(
    () => setContext(canvasRef.current?.getContext("2d")),
    [canvasRef.current]
  );

  useEffect(() => console.log(cameraOffset), [cameraOffset]);
  // useEffect(() => console.log(panStart), [panStart]);
  useEffect(() => console.log(cameraZoom), [cameraZoom]);

  function getTransformedPoint(x: number, y: number): Point | undefined {
    if (!context) return;
    const originalPoint = new DOMPoint(x, y);
    const transformed = context
      .getTransform()
      .invertSelf()
      .transformPoint(originalPoint);
    return new Point(transformed.x, transformed.y);
  }

  // Manage points
  const createPoint = (coords: Point) => {
    const point = new Point(coords.x, coords.y);
    setPoints((prev) => [...prev, point]);
    // console.log("point created");
  };

  const deletePoint = (id: string) => {
    setPoints((prev) => [...prev.filter((pt) => pt.id !== id)]);
    // console.log("point removed");
  };

  const movePoint = (id: string, coords: Point) => {
    setPoints((prev) =>
      prev.map((pt) => (pt.id === id ? new Point(coords.x, coords.y, id) : pt))
    );
    console.log("point updated");
  };

  // Draw everything to canvas
  const draw = (context: CanvasRenderingContext2D): void => {
    const { width, height } = context.canvas;
    if (cameraOffset) {
      context.translate(width / 2, height / 2);
      context.scale(cameraZoom, cameraZoom);
      context.translate(-width / 2 + cameraOffset.x, -height / 2 + cameraOffset.y);
    }

    for (let pt of points) {
      if (pt.id === draggingId) continue;
      if (pt.id === currentPointId) {
        pt.draw(context, { color: "green", radius: 5 / cameraZoom });
        continue;
      }
      pt.draw(context, { radius: 3 / cameraZoom });
    }

    context.font = "12px Courier";
    context.fillStyle = "red";
    context.fillText(`dragging ID: ${draggingId}`, 10, 20);
    context.fillText(`current ID: ${currentPointId}`, 10, 35);

    quadtree.current?.draw(context);
    mousePoint?.draw(context, { color: "blue", radius: 3 / cameraZoom });

    if (draggingId)
      mousePoint?.draw(context, { color: "green", radius: 5 / cameraZoom });
  };

  const getEventLocation = (event: MouseEvent): Coords => {
    return {
      x: event.offsetX / cameraZoom,
      y: event.offsetY / cameraZoom,
    };
  };

  // Event handlers
  const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = (event) => {
    // if (!canvasRef.current) return;
    // const canvas = canvasRef.current;
    // const rect = canvas.getBoundingClientRect();

    // getTransformedPoint({
    //   x: event.nativeEvent.offsetX,
    //   y: event.nativeEvent.offsetY,
    // });
    // const mouseX = getEventLocation(event.nativeEvent).x - cameraOffset.x;
    // const mouseY = getEventLocation(event.nativeEvent).y - cameraOffset.y;

    // const mouseX = event.clientX;
    // const mouseY = event.clientY - cameraOffset.y;
    setMousePoint(
      getTransformedPoint(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    );

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

    if (currentPointId) {
      if (event.button === 2) deletePoint(currentPointId);
      else if (event.button === 0) setDraggingId(currentPointId);
    } else {
    }
    if (!currentPointId && event.button === 0 && mousePoint) {
      createPoint(mousePoint);
    }
  };

  const handleMouseUp: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (event.button === 1) {
      setIsPanning(false);
    }

    if (event.button !== 0) return;

    if (draggingId) {
      const id = draggingId;
      setDraggingId("");
      if (!mousePoint) return;
      movePoint(id, mousePoint);
    }
  };

  const handleContextMenu: MouseEventHandler<HTMLCanvasElement> = (event) => {
    event.preventDefault();
  };

  const adjustZoom = (amount: number): void => {
    if (isPanning || draggingId) return;
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

  const onWheel: WheelEventHandler<HTMLCanvasElement> = (event) => {
    if (!context || !mousePoint) return;
    const zoom = event.deltaY < 0 ? 1.1 : 0.9;

    context.translate(mousePoint.x, mousePoint.y);
    context.scale(zoom, zoom);
    context.translate(-mousePoint.x, -mousePoint.y);

    // drawImageToCanvas();
    event.preventDefault();
  };

  // rebuild quadtree whenever points update
  useEffect(() => {
    quadtree.current = createQuadTree(points);
  }, [points]);

  // determine current point
  useEffect(() => {
    if (!mousePoint || !quadtree.current) return;
    const nearPoints = quadtree.current.queryRadius(mousePoint, 5);
    setCurrentPointId(mousePoint.nearest(nearPoints)?.id || "");
  }, [mousePoint, points]);

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
