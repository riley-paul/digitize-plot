import { useEffect, useRef, useState } from "react";
import Point from "../geometry/Point";
import { QuadTree, Rect } from "../geometry/QuadTree";

export default function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quadtree = useRef<QuadTree | null>(null);

  const [points, setPoints] = useState<Point[]>([]);
  // const pointsRef = useRef(points);
  // const setPoints = (data: Point[]) => {
  //   pointsRef.current = data;
  //   _setPoints(data);
  // };

  const [mousePoint, _setMousePoint] = useState<Point | undefined>(undefined);
  const mousePointRef = useRef(mousePoint);
  const setMousePoint = (data: Point) => {
    mousePointRef.current = data;
    _setMousePoint(data);
  };

  const [currentPointId, _setCurrentPointId] = useState<string>("");
  const currentPointIdRef = useRef(currentPointId);
  const setCurrentPointId = (data: string) => {
    currentPointIdRef.current = data;
    _setCurrentPointId(data);
  };

  const [draggingId, _setDraggingId] = useState<string>("");
  const draggingIdRef = useRef(draggingId);
  const setDraggingId = (data: string) => {
    draggingIdRef.current = data;
    _setDraggingId(data);
  };

  const updateQuadtree = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas;
    const boundary = new Rect(width / 2, height / 2, width, height);

    quadtree.current = new QuadTree(boundary);
    for (let pt of points) quadtree.current.insert(pt);

    console.log("quadtree built");
  };

  // Manage points
  const createPoint = (coords: Point) => {
    const point = new Point(coords.x, coords.y);
    setPoints((prev) => [...prev, point]);
    console.log("point created");
  };

  const deletePoint = (id: string) => {
    setPoints((prev) => [...prev.filter((pt) => pt.id !== id)]);
    console.log("point removed");
  };

  const movePoint = (id: string, coords: Point) => {
    setPoints((prev) =>
      prev.map((pt) => (pt.id === id ? new Point(coords.x, coords.y, id) : pt))
    );
    console.log("point updated");
  };

  // Draw everything to canvas
  const draw = (ctx: CanvasRenderingContext2D): void => {
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

  // Event handlers
  const handleMouseMove = (event: MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    setMousePoint(new Point(mouseX, mouseY, "mouse"));
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

    updateQuadtree();
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (currentPointIdRef.current && event.button === 2)
      deletePoint(currentPointIdRef.current);
    else if (currentPointIdRef.current && event.button === 0)
      setDraggingId(currentPointIdRef.current);
    else if (
      !currentPointIdRef.current &&
      event.button === 0 &&
      mousePointRef.current
    )
      createPoint(mousePointRef.current);
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (event.button !== 0) return;

    if (draggingIdRef.current) {
      const id = draggingIdRef.current;
      setDraggingId("");
      if (!mousePointRef.current) return;
      movePoint(id, mousePointRef.current);
    }
  };

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

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

  // add and remove event listeners
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    canvasRef.current?.addEventListener("mousedown", handleMouseDown);
    canvasRef.current?.addEventListener("mouseup", handleMouseUp);
    canvasRef.current?.addEventListener("mousemove", handleMouseMove);
    canvasRef.current?.addEventListener("contextmenu", handleContextMenu);
    // canvasRef.current?.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvasRef.current?.removeEventListener("mousedown", handleMouseDown);
      canvasRef.current?.removeEventListener("mouseup", handleMouseUp);
      canvasRef.current?.removeEventListener("mousemove", handleMouseMove);
      canvasRef.current?.removeEventListener("contextmenu", handleContextMenu);
      // canvasRef.current?.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => console.log(points), [points]);
  return canvasRef;
}
