import React from "react";
import { QuadTree, createQuadTree } from "src/geometry/quad-tree";
import get2dCanvasContext from "@/lib/helpers/get-2d-canvas-context";
import { useAtom, useAtomValue } from "jotai";
import {
  debugAtom,
  draggingEntityIdAtom,
  hoveringEntityIdAtom,
  mousePointAtom,
  pointsAtom,
} from "@/lib/store";
import usePoints from "./use-points";
import getPointFromEvent from "@/lib/helpers/get-point-from-event";

export default function useCanvasPoints(
  canvasRef: React.RefObject<HTMLCanvasElement>,
) {
  const debug = useAtomValue(debugAtom);
  const quadtree = React.useRef<QuadTree | null>(null);
  const ctx = get2dCanvasContext(canvasRef);

  const { removePoint, addPoint, movePoint } = usePoints(pointsAtom);
  const points = useAtomValue(pointsAtom);
  const mousePoint = useAtomValue(mousePointAtom);

  const [hoveringId, setHoveringId] = useAtom(hoveringEntityIdAtom);
  const [draggingId, setDraggingId] = useAtom(draggingEntityIdAtom);

  // Draw everything to canvas
  const drawPoints = (ctx: CanvasRenderingContext2D): void => {
    const DEFAULT_COLOUR = "#7c3aed";
    const SELECTED_COLOUR = "#a78bfa";

    if (debug) {
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
      if (pt.id === hoveringId) {
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
    setHoveringId(mousePoint.nearest(nearPoints)?.id || "");
  };

  const mouseDownPoints: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (!ctx) return;
    const mousePoint = getPointFromEvent(event, ctx);
    if (hoveringId) {
      if (event.button === 2) removePoint(hoveringId);
      else if (event.button === 0) setDraggingId(hoveringId);
    } else {
      if (!hoveringId && event.button === 0 && mousePoint) {
        addPoint(mousePoint);
      }
    }
  };

  const mouseUpPoints: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (event.button !== 0) return;

    if (!ctx) return;
    const mousePoint = getPointFromEvent(event, ctx);

    if (draggingId) {
      const id = draggingId;
      setDraggingId("");
      if (!mousePoint) return;
      movePoint(id, mousePoint);
    }
  };

  // rebuild quadtree whenever points update
  React.useEffect(() => {
    console.log("rebuilding quadtree");
    quadtree.current = createQuadTree(points);
  }, [points]);

  return {
    drawPoints,
    mouseDownPoints,
    mouseUpPoints,
    mouseMovePoints,
  };
}
