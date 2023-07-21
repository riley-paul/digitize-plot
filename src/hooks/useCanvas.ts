import {
  MouseEventHandler,
  TouchEventHandler,
  UIEventHandler,
  WheelEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import Point from "../geometry/Point";
import { QuadTree, Rect } from "../geometry/QuadTree";

const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;
const SCROLL_SENSITIVITY = 0.0005;

type Coords = { x: number; y: number };

export default function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quadtree = useRef<QuadTree | null>(null);

  const [points, setPoints] = useState<Point[]>([]);
  const [mousePoint, setMousePoint] = useState<Point | undefined>(undefined);
  const [currentPointId, setCurrentPointId] = useState<string>("");
  const [draggingId, setDraggingId] = useState<string>("");

  const [cameraOffset, setCameraOffset] = useState<Coords>({ x: 0, y: 0 });
  const [cameraZoom, setCameraZoom] = useState<number>(1);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<Coords>({ x: 0, y: 0 });

  useEffect(() => console.log(cameraOffset), [cameraOffset]);
  useEffect(() => console.log(cameraZoom), [cameraZoom]);

  const updateQuadtree = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas;
    const boundary = new Rect(width / 2, height / 2, width, height);

    quadtree.current = new QuadTree(boundary);
    for (let pt of points) quadtree.current.insert(pt);

    // console.log("quadtree built");
  };

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
  const draw = (ctx: CanvasRenderingContext2D): void => {
    const { width, height } = ctx.canvas;
    if (cameraOffset) {
      ctx.translate(width / 2, height / 2);
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(-width / 2 + cameraOffset.x, -height / 2 + cameraOffset.y);
    }

    for (let pt of points) {
      if (pt.id === draggingId) continue;
      if (pt.id === currentPointId) {
        pt.draw(ctx, { color: "green", radius: 5 });
        continue;
      }
      pt.draw(ctx);
    }

    ctx.font = "12px Courier";
    ctx.fillStyle = "red";
    ctx.fillText(`dragging ID: ${draggingId}`, 10, 20);
    ctx.fillText(`current ID: ${currentPointId}`, 10, 35);

    quadtree.current?.draw(ctx);
    mousePoint?.draw(ctx, { color: "blue" });

    if (draggingId) mousePoint?.draw(ctx, { color: "green", radius: 5 });
  };

  const getEventLocation = (event: MouseEvent): Coords => {
    return { x: event.clientX, y: event.clientY };
  };

  // Event handlers
  const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (!canvasRef.current) return;
    const mouseX = event.clientX - cameraOffset.x;
    const mouseY = event.clientY - cameraOffset.y;
    setMousePoint(new Point(mouseX, mouseY, "mouse"));

    if (isPanning) {
      setCameraOffset({
        x: getEventLocation(event.nativeEvent).x / cameraZoom - panStart.x,
        y: getEventLocation(event.nativeEvent).y / cameraZoom - panStart.y,
      });
    }
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = width;
    canvas.height = height;

    setCameraOffset((prev) => (prev ? prev : { x: width / 2, y: height / 2 }));
    setPoints((prev) => [...prev]); // bit of a hack
  };

  const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (event.button === 1) {
      setIsPanning(true);
      setPanStart({
        x: getEventLocation(event.nativeEvent).x / cameraZoom - cameraOffset.x,
        y: getEventLocation(event.nativeEvent).y / cameraZoom - cameraOffset.y,
      });
    }

    if (currentPointId && event.button === 2) {
      deletePoint(currentPointId);
    }

    if (currentPointId && event.button === 0) {
      setDraggingId(currentPointId);
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
    adjustZoom(event.deltaY * SCROLL_SENSITIVITY);
  };

  // rebuild quadtree whenever points update
  useEffect(() => {
    updateQuadtree();
  }, [points]);

  // determine current point
  useEffect(() => {
    if (!mousePoint || !quadtree.current) return;
    const nearPoints = quadtree.current.queryRadius(mousePoint, 5);
    setCurrentPointId(mousePoint.nearest(nearPoints)?.id || "");
  }, [mousePoint, points]);

  // draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas!.getContext("2d") as CanvasRenderingContext2D;
    let animationFrameId: number;

    const render = () => {
      context.save();
      const { width, height } = context.canvas;
      context.clearRect(0, 0, width, height);

      draw(context);
      animationFrameId = window.requestAnimationFrame(render);
      context.restore();
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  // add and remove event listener for resize
  useEffect(() => {
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
