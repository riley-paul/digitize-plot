import Point from "@/geometry/Point";
import {
  MouseEventHandler,
  RefObject,
  WheelEventHandler,
  useEffect,
  useState,
} from "react";

export default function usePanZoom(
  canvasRef: RefObject<HTMLCanvasElement>,
  mousePoint: Point | undefined,
  image: HTMLImageElement | undefined,
  debug: boolean
) {
  const [matrix, setMatrix] = useState<DOMMatrix>(new DOMMatrix());
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<Point>(new Point(0, 0));

  useEffect(() => {
    if (debug) console.log("panStart", panStart);
  }, [panStart]);

  const centerImage = () => {
    if (!canvasRef.current || !image) return;
    setMatrix(() =>
      new DOMMatrix().translate(
        (canvasRef.current!.width - image.width) / 2,
        (canvasRef.current!.height - image.height) / 2
      )
    );
  };

  useEffect(() => {
    centerImage();
  }, [image, canvasRef.current]);

  const drawPanZoom = (context: CanvasRenderingContext2D): void => {
    const { a, b, c, d, e, f } = matrix;
    context.transform(a, b, c, d, e, f);
  };

  const mouseMovePanZoom: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (!isPanning || !mousePoint) return;
    console.log("panning");
    setMatrix((prev) =>
      prev.translate(mousePoint.x - panStart.x, mousePoint.y - panStart.y)
    );
  };

  const mouseDownPanZoom: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (!mousePoint) return;
    if (event.button === 2 || event.button === 1) {
      setIsPanning(true);
      setPanStart(mousePoint);
    }
  };

  const mouseUpPanZoom: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (event.button === 2 || event.button === 1) {
      setIsPanning(false);
    }
  };

  const wheelPanZoom: WheelEventHandler<HTMLCanvasElement> = (event) => {
    console.log("scrolling");
    event.preventDefault();
    event.stopPropagation();

    if (isPanning || !mousePoint) return;
    const zoom = event.deltaY < 0 ? 1.1 : 0.9;

    setMatrix((prev) =>
      prev
        .translate(mousePoint.x, mousePoint.y)
        .scale(zoom, zoom)
        .translate(-mousePoint.x, -mousePoint.y)
    );
  };

  return {
    drawPanZoom,
    mouseMovePanZoom,
    mouseDownPanZoom,
    mouseUpPanZoom,
    wheelPanZoom,
    centerImage,
  };
}
