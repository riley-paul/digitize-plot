import { useRef, useEffect } from "react";
import { drawFunction } from "../types/functions";


export default function useCanvas(draw: drawFunction) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas!.getContext("2d") as CanvasRenderingContext2D;
    let animationFrameId: number;

    const render = () => {
      context.save();
      // resizeCanvasToDisplaySize(canvas!, context);
      const { width, height } = context.canvas;
      context.clearRect(0, 0, width, height);

      draw(context);
      animationFrameId = window.requestAnimationFrame(render);

      context.restore();
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  useEffect(() => {
    // Get the canvas element and its parent container
    const canvas = canvasRef.current;
    const container = canvas!.parentNode;

    // Set the initial size of the canvas to match its container
    // @ts-ignore
    canvas.width = container.clientWidth;
    // @ts-ignore
    canvas.height = container.clientHeight;

    // Function to update canvas size when the window is resized
    const handleResize = () => {
      // @ts-ignore
      canvas.width = container.clientWidth;
      // @ts-ignore
      canvas.height = container.clientHeight;
    };

    // Attach the resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup: remove the resize event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return canvasRef;
}
