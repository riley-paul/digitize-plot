import { MouseEventHandler, useEffect, useRef, useState } from "react";
import Point from "./geometry/Point";
import { QuadTree, Rect } from "./geometry/quadtree";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quadtree = useRef<QuadTree | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [currentPoint, setCurrentPoint] = useState<Point | undefined>(
    undefined
  );

  const getMousePoint = (event: MouseEvent): Point | undefined => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const point = new Point(mouseX, mouseY);
    return point;
  };

  const draw = (ctx: CanvasRenderingContext2D): void => {
    points.forEach((pt) => pt.draw(ctx));
    quadtree.current?.draw(ctx);

    currentPoint?.draw(ctx, { color: "green", radius: 5 });
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

  useEffect(() => {

  })


  const placePoints: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const point = getMousePoint(event.nativeEvent);
    if (!point) return;
    setPoints((prev) => [...prev, point]);
    quadtree.current?.insert(point);
  };

  const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const point = getMousePoint(event.nativeEvent);

    if (!point || !quadtree.current) return;
    const nearPoints = quadtree.current.queryRadius(point, 5);
    setCurrentPoint(point.nearest(nearPoints));
  };

  const deletePoint: MouseEventHandler<HTMLCanvasElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!currentPoint) return;
    setPoints((prev) => [
      ...prev.filter(
        (pt) => pt.x !== currentPoint.x && pt.y !== currentPoint.y
      ),
    ]);
  };

  const handleClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.nativeEvent.button === 0) placePoints(event);
    else if (event.nativeEvent.button === 2) deletePoint(event);
  };

  useEffect(() => console.log(points), [points]);

  return (
    <main className="w-full h-screen bg-red-500">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onContextMenu={handleClick}
        onMouseMove={handleMouseMove}
      />
    </main>
  );
}

export default App;
