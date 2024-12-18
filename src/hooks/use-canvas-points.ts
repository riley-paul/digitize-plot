import React from "react";
import Point from "src/geometry/point";
import { QuadTree, createQuadTree } from "src/geometry/quad-tree";
import get2dCanvasContext from "@/lib/helpers/get-2d-canvas-context";
import { useAtom, useAtomValue } from "jotai";
import {
  debugAtom,
  draggingPointIdAtom,
  hoveringPointIdAtom,
  pointsAtom,
} from "@/lib/store";
import usePoints from "./use-points";

type Props = {
  mousePoint: Point | undefined;
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

export default function useCanvasPoints({ canvasRef, mousePoint }: Props) {
  const debug = useAtomValue(debugAtom);

  const quadtree = React.useRef<QuadTree | null>(null);
  const ctx = get2dCanvasContext(canvasRef);

  const { createPoint, deletePoint, movePoint, clearPoints, points } =
    usePoints(pointsAtom);

  const [hoveringPointId, setHoveringPointId] = useAtom(hoveringPointIdAtom);
  const [draggingPointId, setDraggingPointId] = useAtom(draggingPointIdAtom);

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
      if (pt.id === draggingPointId) continue;
      if (pt.id === hoveringPointId) {
        pt.draw(ctx, { color: SELECTED_COLOUR });
        continue;
      }
      pt.draw(ctx, { color: DEFAULT_COLOUR });
    }

    if (draggingPointId) mousePoint?.draw(ctx, { color: SELECTED_COLOUR });
  };

  // Event handlers

  const mouseDownPoints: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (hoveringPointId) {
      if (event.button === 2) deletePoint(hoveringPointId);
      else if (event.button === 0) setDraggingPointId(hoveringPointId);
    } else {
      if (!hoveringPointId && event.button === 0 && mousePoint) {
        createPoint(mousePoint);
      }
    }
  };

  const mouseUpPoints: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (event.button !== 0) return;

    if (draggingPointId) {
      const id = draggingPointId;
      setDraggingPointId("");
      if (!mousePoint) return;
      movePoint(id, mousePoint);
    }
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
    setHoveringPointId(mousePoint.nearest(nearPoints)?.id || "");
  }, [mousePoint, points]);

  return {
    drawPoints,
    mouseDownPoints,
    mouseUpPoints,
    points,
    mousePoint,
    clearPoints,
  };
}
