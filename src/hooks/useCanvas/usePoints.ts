import {
  MouseEventHandler,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import Point from "../../geometry/Point";
import { QuadTree, createQuadTree } from "../../geometry/QuadTree";
import use2dContext from "./use2dContext";

export default function usePoints(canvasRef: RefObject<HTMLCanvasElement>) {
  const quadtree = useRef<QuadTree | null>(null);
  const context = use2dContext(canvasRef);

  const [points, setPoints] = useState<Point[]>([]);
  const [mousePoint, setMousePoint] = useState<Point | undefined>(undefined);
  const [currentPointId, setCurrentPointId] = useState<string>("");
  const [draggingId, setDraggingId] = useState<string>("");

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
  const drawPoints = (ctx: CanvasRenderingContext2D): void => {
    for (let pt of points) {
      pt.label = pt.id.substring(0, 4);
      if (pt.id === draggingId) continue;
      if (pt.id === currentPointId) {
        pt.draw(ctx, { color: "green", radius: 5 });
        continue;
      }
      pt.draw(ctx, { radius: 3 });
    }

    ctx.font = "12px Courier";
    ctx.fillStyle = "red";
    ctx.fillText(`dragging ID: ${draggingId}`, 10, 20);
    ctx.fillText(`current ID: ${currentPointId}`, 10, 35);

    quadtree.current?.draw(ctx);
    mousePoint?.draw(ctx, { color: "blue", radius: 3 });

    if (draggingId) mousePoint?.draw(ctx, { color: "green", radius: 5 });
  };

  // Event handlers
  const mouseMovePoints: MouseEventHandler<HTMLCanvasElement> = (event) => {
    setMousePoint(
      getTransformedPoint(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    );
  };

  const mouseDownPoints: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (currentPointId) {
      if (event.button === 2) deletePoint(currentPointId);
      else if (event.button === 0) setDraggingId(currentPointId);
    } else {
      if (!currentPointId && event.button === 0 && mousePoint) {
        createPoint(mousePoint);
      }
    }
  };

  const mouseUpPoints: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (event.button !== 0) return;

    if (draggingId) {
      const id = draggingId;
      setDraggingId("");
      if (!mousePoint) return;
      movePoint(id, mousePoint);
    }
  };

  // rebuild quadtree whenever points update
  useEffect(() => {
    quadtree.current = createQuadTree(points);
  }, [points]);

  // determine current point
  useEffect(() => {
    if (!mousePoint || !quadtree.current || !context) return;
    const nearPoints = quadtree.current.queryRadius(
      mousePoint,
      5 / context.getTransform().a
    );
    setCurrentPointId(mousePoint.nearest(nearPoints)?.id || "");
  }, [mousePoint, points]);

  return {
    drawPoints,
    mouseDownPoints,
    mouseUpPoints,
    mouseMovePoints,
  };
}
