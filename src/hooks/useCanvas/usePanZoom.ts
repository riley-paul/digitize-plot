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
    if (!isPanning || !mousePoint) return;
    console.log("panning");
    setMatrix((prev) =>
      prev.translate(mousePoint.x - panStart.x, mousePoint.y - panStart.y)
    );
  }, [mousePoint]);

  useEffect(() => {
    centerImage();
  }, [image, canvasRef.current]);

  const drawPanZoom = (context: CanvasRenderingContext2D): void => {
    const { a, b, c, d, e, f } = matrix;
    context.transform(a, b, c, d, e, f);
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
        .translateSelf(mousePoint.x, mousePoint.y)
        .scaleSelf(zoom, zoom)
        .translateSelf(-mousePoint.x, -mousePoint.y)
    );
  };

  return {
    drawPanZoom,
    mouseDownPanZoom,
    mouseUpPanZoom,
    wheelPanZoom,
    centerImage,
  };
}
