import { MouseEventHandler, useEffect, useRef, useState } from "react";
import Point from "./geometry/Point";
import { QuadTree, Rect } from "./geometry/quadtree";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let quadtree = useRef<QuadTree | null>(null);
  const [points, setPoints] = useState<Point[]>([]);

  const draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = "LightCoral";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    points.forEach((pt) => pt.draw(ctx));
    quadtree.current?.draw(ctx);
  };

  // draw loop
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

  // on window resize
  useEffect(() => {
    // Get the canvas element and its parent container
    const canvas = canvasRef.current;
    const container = canvas!.parentNode;

    // Set the initial size of the canvas to match its container

    // Function to update canvas size when the window is resized
    const handleResize = () => {
      // @ts-ignore
      const width = container.clientWidth;
      // @ts-ignore
      const height = container.clientHeight;

      canvas!.width = width;
      canvas!.height = height;

      const boundary = new Rect(width / 2, height / 2, width, height);
      quadtree.current = new QuadTree(boundary);
    };

    handleResize();

    // Attach the resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup: remove the resize event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const placePoints: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const point = new Point(mouseX, mouseY);
    setPoints((prev) => [...prev, point]);
    quadtree.current?.insert(point);
  };

  useEffect(() => console.log(points), [points]);

  return (
    <main className="w-screen h-screen bg-red-500">
      <canvas ref={canvasRef} onClick={placePoints} />;
    </main>
  );
}

export default App;
