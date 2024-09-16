import React from "react";
import useCanvasPoints from "@/hooks/use-canvas-points";
import usePanZoom from "@/hooks/use-canvas-pan-zoom";
import useCalibrators from "@/hooks/use-canvas-calibrators";
import get2dCanvasContext from "@/lib/helpers/get-2d-canvas-context";
import { useAtomValue, useSetAtom } from "jotai";
import {
  debugAtom,
  draggingEntityIdAtom,
  hoveringEntityIdAtom,
  imgAtom,
  matrixAtom,
  mousePointAtom,
} from "@/lib/store";
import getPointFromEvent from "@/lib/helpers/get-point-from-event";
import Point from "@/geometry/point";

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const Canvas: React.FC<Props> = ({ canvasRef }) => {
  const requestRef = React.useRef<number>(0);

  const ctx = get2dCanvasContext(canvasRef);

  const image = useAtomValue(imgAtom);
  const setMousePoint = useSetAtom(mousePointAtom);
  const matrix = useAtomValue(matrixAtom);
  const debug = useAtomValue(debugAtom);

  const draggingId = useAtomValue(draggingEntityIdAtom);
  const hoveringId = useAtomValue(hoveringEntityIdAtom);

  const { drawPoints, mouseDownPoints, mouseUpPoints, mouseMovePoints } =
    useCanvasPoints(canvasRef);

  const { mouseDownPanZoom, mouseUpPanZoom, mouseMovePanZoom, wheelPanZoom } =
    usePanZoom(canvasRef);

  const {
    drawCalibrators,
    mouseDownCalibrators,
    mouseUpCalibrators,
    // mouseMoveCalibrators,
  } = useCalibrators(canvasRef);

  // Draw everything to canvas
  const draw = (ctx: CanvasRenderingContext2D): void => {
    if (image) ctx.drawImage(image, 0, 0, image.width, image.height);
    drawCalibrators(ctx);
    drawPoints(ctx);

    if (debug) {
      const origin = ctx
        .getTransform()
        .invertSelf()
        .transformPoint(new DOMPoint(0, 0));

      const scale = ctx.getTransform().a;
      ctx.font = `${12 / scale}px Courier`;
      ctx.fillStyle = "red";
      ctx.fillText(
        `Dragging ID: ${draggingId}`,
        origin.x + 10 / scale,
        origin.y + 20 / scale,
      );
      ctx.fillText(
        `Hovering ID: ${hoveringId}`,
        origin.x + 10 / scale,
        origin.y + 35 / scale,
      );
    }
  };

  // draw loop
  React.useEffect(() => {
    if (!ctx) return;

    const render = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.setTransform(matrix);
      draw(ctx);
      requestRef.current = window.requestAnimationFrame(render);
    };
    requestRef.current = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(requestRef.current);
  }, [draw, matrix]);

  // add and remove event listener for resize
  React.useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [image]);

  return (
    <canvas
      className="h-full w-full"
      ref={canvasRef}
      onMouseMove={(event) => {
        // setMousePoint((prev) => {
        //   if (!ctx) return undefined;
        //   const pt = getPointFromEvent(event, ctx);
        //   if (pt.x === prev?.x && pt.y === prev?.y) return prev;
        //   return new Point(pt.x, pt.y, "MOUSE");
        // });
        // mouseMoveCalibrators(event);
        mouseMovePoints(event);
        mouseMovePanZoom(event);
      }}
      onMouseDown={(event) => {
        mouseDownPanZoom(event);
        mouseDownCalibrators(event);
        mouseDownPoints(event);
      }}
      onMouseUp={(event) => {
        mouseUpPanZoom(event);
        mouseUpCalibrators(event);
        mouseUpPoints(event);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onWheel={(event) => {
        wheelPanZoom(event);
      }}
      onMouseLeave={(event) => {
        setMousePoint(undefined);
      }}
    />
  );
};

export default Canvas;
