import Point from "src/geometry/point";
import React from "react";
import getPointFromEvent from "@/lib/helpers/get-point-from-event";
import get2dCanvasContext from "@/lib/helpers/get-2d-canvas-context";
import { useAtom } from "jotai";
import { matrixAtom } from "@/lib/store";

export default function usePanZoom(
  canvasRef: React.RefObject<HTMLCanvasElement>,
) {
  const [matrix, setMatrix] = useAtom(matrixAtom);
  const [isPanning, setIsPanning] = React.useState<boolean>(false);
  const [panStart, setPanStart] = React.useState<Point>(new Point(0, 0));

  const mouseDownPanZoom: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (event.button === 2 || event.button === 1) {
      setIsPanning(true);
      setPanStart(new Point(event.clientX, event.clientY));
    }
  };

  const mouseUpPanZoom: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (event.button === 2 || event.button === 1) {
      setIsPanning(false);
    }
  };

  const mouseMovePanZoom: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (!isPanning) return;
    const deltaX = (event.clientX - panStart.x) / matrix.a;
    const deltaY = (event.clientY - panStart.y) / matrix.d;
    setMatrix((prev) => prev.translate(deltaX, deltaY));
    setPanStart(new Point(event.clientX, event.clientY));
  };

  const wheelPanZoom: React.WheelEventHandler<HTMLCanvasElement> = (event) => {
    event.stopPropagation();

    if (isPanning) return;
    const zoom = event.deltaY < 0 ? 1.1 : 0.9;
    const ctx = get2dCanvasContext(canvasRef);
    if (!ctx) return;

    const mousePoint = getPointFromEvent(event, ctx);

    setMatrix((prev) =>
      prev
        .translateSelf(mousePoint.x, mousePoint.y)
        .scaleSelf(zoom, zoom)
        .translateSelf(-mousePoint.x, -mousePoint.y),
    );
  };

  return {
    mouseDownPanZoom,
    mouseUpPanZoom,
    mouseMovePanZoom,
    wheelPanZoom,
  };
}
