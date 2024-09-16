import React from "react";
import Point from "src/geometry/point";
import { QuadTree, createQuadTree } from "src/geometry/quad-tree";
import get2dCanvasContext from "@/lib/helpers/get-2d-canvas-context";
import { useAtom, useAtomValue } from "jotai";
import { mousePointAtom, pointsAtom } from "@/lib/store";
import usePoints from "./use-points";
import getPointFromEvent from "@/lib/helpers/get-point-from-event";

export default function useCanvasPoints(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  debug: boolean,
) {
  const quadtree = React.useRef<QuadTree | null>(null);
  const ctx = get2dCanvasContext(canvasRef);

  const { removePoint, addPoint, movePoint } = usePoints(pointsAtom);
  const points = useAtomValue(pointsAtom);
  const mousePoint = useAtomValue(mousePointAtom);

  const [currentPointId, setCurrentPointId] = React.useState<string>("");
  const [draggingId, setDraggingId] = React.useState<string>("");

  // Draw everything to canvas
  const drawPoints = (ctx: CanvasRenderingContext2D): void => {
    const DEFAULT_COLOUR = "#7c3aed";
    const SELECTED_COLOUR = "#a78bfa";

    if (debug) {
      ctx.font = "12px Courier";
      ctx.fillStyle = "red";
      ctx.fillText(`dragging ID: ${draggingId}`, 10, 20);
      ctx.fillText(`current ID: ${currentPointId}`, 10, 35);

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
    if (!quadtree.current || !ctx) return;
    const mousePoint = getPointFromEvent(event, ctx);
    const radius = 7 / ctx.getTransform().a;
    const nearPoints = quadtree.current.queryRadius(mousePoint, radius);
    setCurrentPointId(mousePoint.nearest(nearPoints)?.id || "");
  };

  const mouseDownPoints: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (currentPointId) {
      if (event.button === 2) removePoint(currentPointId);
      else if (event.button === 0) setDraggingId(currentPointId);
    } else {
      if (!currentPointId && event.button === 0 && mousePoint) {
        addPoint(mousePoint);
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

  // rebuild quadtree whenever points update
  React.useEffect(() => {
    quadtree.current = createQuadTree(points);
  }, [points]);

  return {
    drawPoints,
    mouseDownPoints,
    mouseUpPoints,
    mouseMovePoints,
  };
}
