import { MouseEventHandler, WheelEventHandler, useEffect, useRef } from "react";
import usePoints from "./usePoints";
import use2dContext from "./use2dContext";
import usePanZoom from "./usePanZoom";

export default function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = use2dContext(canvasRef);

  const {
    drawPoints,
    mouseDownPoints,
    mouseUpPoints,
    mouseMovePoints,
    points,
    mousePoint,
  } = usePoints(canvasRef);

  const {
    drawPanZoom,
    mouseMovePanZoom,
    mouseDownPanZoom,
    mouseUpPanZoom,
    wheelPanZoom,
  } = usePanZoom();

  // Draw everything to canvas
  const draw = (context: CanvasRenderingContext2D): void => {
    // context.fillStyle = "darkgray"
    // context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    drawPanZoom(context);
    drawPoints(context);
  };

  // Event handlers
  const onMouseMove: MouseEventHandler = (event) => {
    mouseMovePanZoom(event);
    mouseMovePoints(event);
  };

  const onMouseDown: MouseEventHandler = (event) => {
    mouseDownPanZoom(event);
    mouseDownPoints(event);
  };

  const onMouseUp: MouseEventHandler = (event) => {
    mouseUpPanZoom(event);
    mouseUpPoints(event);
  };

  const onContextMenu: MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onWheel: WheelEventHandler<HTMLCanvasElement> = (event) => {
    wheelPanZoom(event);
  };

  // draw loop
  useEffect(() => {
    if (!context) return;
    let animationFrameId: number;

    const render = () => {
      // context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      draw(context);
      // context.restore();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  // add and remove event listener for resize
  useEffect(() => {
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
  }, []);

  // useEffect(() => console.log(points), [points]);
  return {
    ref: canvasRef,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onContextMenu,
    onWheel,
    points,
    mousePoint,
  };
}
