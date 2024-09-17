import React from "react";
import Point from "src/geometry/point";
import { QuadTree, createQuadTree } from "src/geometry/quad-tree";
import get2dCanvasContext from "@/lib/helpers/get-2d-canvas-context";
import { useAtomValue } from "jotai";
import { debugAtom } from "@/lib/store";
import usePoints from "./use-points";

export default function useCanvasPoints(
  canvasRef: React.RefObject<HTMLCanvasElement>,
) {
  const debug = useAtomValue(debugAtom);

  const quadtree = React.useRef<QuadTree | null>(null);
  const ctx = get2dCanvasContext(canvasRef);

  const [points, setPoints] = React.useState<Point[]>([]);

  const { createPoint, deletePoint, movePoint, clearPoints } = usePoints(
    points,
    setPoints,
  );

  const [mousePoint, setMousePoint] = React.useState<Point | undefined>(
    undefined,
  );
  const [currentPointId, setCurrentPointId] = React.useState<string>("");
  const [draggingId, setDraggingId] = React.useState<string>("");

  // Draw everything to canvas
  const drawPoints = (ctx: CanvasRenderingContext2D): void => {
    const DEFAULT_COLOUR = "#7c3aed";
    const SELECTED_COLOUR = "#a78bfa";

    if (debug) {
      // ctx.font = "12px Courier";
      // ctx.fillStyle = "red";
      // ctx.fillText(`dragging ID: ${draggingId}`, 10, 20);
      // ctx.fillText(`current ID: ${currentPointId}`, 10, 35);

      quadtree.current?.draw(ctx);
      mousePoint?.draw(ctx, {
        color: "#84cc16",
        radius: 3,
        showLabel: true,
        labelPos: "t",
      });
    }

    for (let pt of points) {
      if (debug) pt.label = pt.label || pt.id.substring(0, 4);
      if (pt.id === draggingId) continue;
      if (pt.id === currentPointId) {
        pt.draw(ctx, { color: SELECTED_COLOUR });
        continue;
      }
      pt.draw(ctx, { color: DEFAULT_COLOUR });
    }

    if (draggingId) mousePoint?.draw(ctx, { color: SELECTED_COLOUR });
  };

  // Event handlers
  const mouseMovePoints: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (!ctx) return;
    const pt = new DOMPoint(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY,
    );
    const transformed = ctx.getTransform().invertSelf().transformPoint(pt);
    setMousePoint(new Point(transformed.x, transformed.y, "MOUSE"));
  };

  const mouseDownPoints: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (currentPointId) {
      if (event.button === 2) deletePoint(currentPointId);
      else if (event.button === 0) setDraggingId(currentPointId);
    } else {
      if (!currentPointId && event.button === 0 && mousePoint) {
        createPoint(mousePoint);
      }
    }
  };

  const mouseUpPoints: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (event.button !== 0) return;

    if (draggingId) {
      const id = draggingId;
      setDraggingId("");
      if (!mousePoint) return;
      movePoint(id, mousePoint);
    }
  };

  const mouseLeavePoints: React.MouseEventHandler<HTMLCanvasElement> = (_) => {
    setMousePoint(undefined);
  };

  // rebuild quadtree whenever points update
  React.useEffect(() => {
    quadtree.current = createQuadTree(points);
  }, [points]);

  // determine current point
  React.useEffect(() => {
    if (!mousePoint || !quadtree.current || !ctx) return;
    const nearPoints = quadtree.current.queryRadius(
      mousePoint,
      7 / ctx.getTransform().a,
    );
    setCurrentPointId(mousePoint.nearest(nearPoints)?.id || "");
  }, [mousePoint, points]);

  return {
    drawPoints,
    mouseDownPoints,
    mouseUpPoints,
    mouseMovePoints,
    mouseLeavePoints,
    points,
    mousePoint,
    clearPoints,
  };
}
