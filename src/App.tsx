import { MouseEventHandler, useEffect, useRef, useState } from "react";
import Point from "./geometry/Point";
import { QuadTree, Rect } from "./geometry/quadtree";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quadtree = useRef<QuadTree | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [mousePoint, setMousePoint] = useState<Point | undefined>(undefined);

  const getMousePoint = (event: MouseEvent): Point | undefined => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const point = new Point(mouseX, mouseY);
    return point;
  };

  const draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = "LightCoral";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    points.forEach((pt) => pt.draw(ctx));
    quadtree.current?.draw(ctx);

    mousePoint?.draw(ctx, { color: "blue" });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas!.getContext("2d") as CanvasRenderingContext2D;
    let animationFrameId: number;

    const handleResize = () => {
      if (!canvas) return;
      const width = canvas.offsetWidth || 200;
      const height = canvas.offsetHeight || 200;

      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.width = width;
      canvas.height = height;

      const boundary = new Rect(width / 2, height / 2, width, height);
      quadtree.current = new QuadTree(boundary);
      console.log("adding points"); // only works with this
      for (let pt of points) quadtree.current.insert(pt);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const render = () => {
      context.save();
      const { width, height } = context.canvas;
      context.clearRect(0, 0, width, height);

      draw(context);
      animationFrameId = window.requestAnimationFrame(render);
      context.restore();
    };
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  const placePoints: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const point = getMousePoint(event.nativeEvent);
    if (!point) return;
    setPoints((prev) => [...prev, point]);
    quadtree.current?.insert(point);
  };

  const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const point = getMousePoint(event.nativeEvent);
    setMousePoint(point);
  };

  useEffect(() => console.log(points), [points]);

  return (
    <main className="w-full h-screen bg-red-500">
      <canvas
        ref={canvasRef}
        onClick={placePoints}
        onMouseMove={handleMouseMove}
      />
    </main>
  );
}

export default App;
