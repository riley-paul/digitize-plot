import React from "react";
import usePoints from "@/hooks/use-canvas-points";
import usePanZoom from "@/hooks/use-canvas-pan-zoom";
import useCalibrators from "@/hooks/use-canvas-calibrators";
import get2dCanvasContext from "@/lib/helpers/get-2d-canvas-context";
import { useAtomValue } from "jotai";
import { debugAtom } from "@/lib/store";

type Props = {
  image: HTMLImageElement | undefined;
};

const Canvas: React.FC<Props> = ({ image }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const ctx = get2dCanvasContext(canvasRef);

  const debug = useAtomValue(debugAtom);

  const {
    drawPoints,
    mouseDownPoints,
    mouseUpPoints,
    mouseMovePoints,
    mouseLeavePoints,
    points,
    mousePoint,
    clearPoints,
  } = usePoints(canvasRef);

  const {
    matrix,
    mouseDownPanZoom,
    mouseUpPanZoom,
    mouseMovePanZoom,
    wheelPanZoom,
    centerImage,
  } = usePanZoom(canvasRef);

  const {
    drawCalibrators,
    mouseDownCalibrators,
    MouseUpCalibrators,
    markerDragging,
    calibrations,
    setCalibrations,
    coordsConverter,
  } = useCalibrators(canvasRef, mousePoint, image);

  // Draw everything to canvas
  const draw = (context: CanvasRenderingContext2D): void => {
    if (image) context.drawImage(image, 0, 0, image.width, image.height);
    drawCalibrators(context);
    drawPoints(context);
  };

  // draw loop
  React.useEffect(() => {
    if (!ctx) return;
    let animationFrameId: number;

    const render = () => {
      // context.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // context.imageSmoothingEnabled = false;

      ctx.setTransform(matrix);
      draw(ctx);
      // context.restore();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
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

  React.useEffect(() => {
    if (debug) console.log(points);
  }, [points]);

  return (
    <canvas
      className="h-full w-full"
      ref={canvasRef}
      onMouseMove={(event) => {
        mouseMovePoints(event);
        mouseMovePanZoom(event);
      }}
      onMouseDown={(event) => {
        mouseDownPanZoom(event);
        mouseDownCalibrators(event);
        if (markerDragging) return;
        mouseDownPoints(event);
      }}
      onMouseUp={(event) => {
        mouseUpPanZoom(event);
        MouseUpCalibrators(event);
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
        mouseLeavePoints(event);
      }}
    />
  );

  const result = {
    points,
    mousePoint,
    clearPoints,
    calibrations,
    setCalibrations,
    coordsConverter,
    centerImage,
  };
};

export default Canvas;
