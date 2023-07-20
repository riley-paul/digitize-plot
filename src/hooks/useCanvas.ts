import { useEffect, useRef, useState } from "react";
import Point from "../geometry/Point";
import { QuadTree, Rect } from "../geometry/QuadTree";

export default function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quadtree = useRef<QuadTree | null>(null);

  const [points, setPoints] = useState<Point[]>([]);
  const [mousePoint, setMousePoint] = useState<Point | undefined>(undefined);

  const [currentPointId, setCurrentPointId] = useState<string>("");
  const [draggingId, setDraggingId] = useState<string>("");

  const updateQuadtree = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas;
    const boundary = new Rect(width / 2, height / 2, width, height);

    quadtree.current = new QuadTree(boundary);
    for (let pt of points) quadtree.current.insert(pt);

    console.log("quadtree built");
  };

  const createPoint = (coords: Point) => {
    const point = new Point(coords.x, coords.y);
    setPoints((prev) => [...prev, point]);
    quadtree.current?.insert(point);

    console.log("point created");
  };

  const deletePoint = (id: string) => {
    setPoints((prev) => [...prev.filter((pt) => pt.id !== id)]);
    updateQuadtree();

    console.log("point removed");
  };

  const movePoint = (id: string, coords: Point) => {
    setPoints((prev) =>
      prev.map((pt) => (pt.id === id ? new Point(coords.x, coords.y, id) : pt))
    );
    updateQuadtree();

    console.log("point updated");
  };

  const draw = (ctx: CanvasRenderingContext2D): void => {
    for (let pt of points) {
      if (pt.id === draggingId) continue;
      if (pt.id === currentPointId) {
        pt.draw(ctx, { color: "green", radius: 5 });
        continue;
      }
      pt.draw(ctx);
    }

    quadtree.current?.draw(ctx);
    mousePoint?.draw(ctx, { color: "blue" });

    if (draggingId) mousePoint?.draw(ctx, { color: "green", radius: 5 });
  };

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

  useEffect(() => {
    const canvas = canvasRef.current;

    const handleResize = () => {
      if (!canvas) return;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.width = width;
      canvas.height = height;

      updateQuadtree();
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseMove = (event: MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    setMousePoint(new Point(mouseX, mouseY, "mouse"));
  };

  useEffect(() => {
    if (!mousePoint || !quadtree.current) return;
    const nearPoints = quadtree.current.queryRadius(mousePoint, 5);
    setCurrentPointId(mousePoint.nearest(nearPoints)?.id || "");
  }, [mousePoint]);

  const handleMouseDown = (event: MouseEvent) => {
    if (currentPointId) {
      if (event.button === 2) {
        deletePoint(currentPointId);
      } else if (event.button === 0) {
        setDraggingId(currentPointId);
      }
    }

    if (event.button === 0 && mousePoint) createPoint(mousePoint);
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (event.button === 2) return;

    if (draggingId) {
      const id = draggingId;
      setDraggingId("");
      if (!mousePoint) return;
      movePoint(id, mousePoint);
    }
  };

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  useEffect(() => {
    canvasRef.current?.addEventListener("mousedown", handleMouseDown);
    canvasRef.current?.addEventListener("mouseup", handleMouseUp);
    canvasRef.current?.addEventListener("mousemove", handleMouseMove);
    canvasRef.current?.addEventListener("contextmenu", handleContextMenu);
    // canvasRef.current?.addEventListener("click", handleClick);

    return () => {
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
