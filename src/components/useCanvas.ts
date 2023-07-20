import { useRef, useEffect } from "react";
import { drawFunction } from "../types/functions";

function resizeCanvasToDisplaySize(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
): boolean {
  const { width, height } = canvas.getBoundingClientRect();

  if (canvas.width !== width || canvas.height !== height) {
    const { devicePixelRatio: ratio = 1 } = window;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context?.scale(ratio, ratio);
    return true;
  }

  return false;
}

export default function useCanvas(draw: drawFunction) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas!.getContext("2d") as CanvasRenderingContext2D;
    let frameCount = 0;
    let animationFrameId: number;

    const render = () => {
      context.save();
      resizeCanvasToDisplaySize(canvas!, context);
      const { width, height } = context.canvas;
      context.clearRect(0, 0, width, height);

      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);

      frameCount++;
      context.restore();
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return canvasRef;
}
