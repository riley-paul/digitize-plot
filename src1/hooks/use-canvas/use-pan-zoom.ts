import Point from "src1/geometry/point";
import React from "react";

export default function usePanZoom(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  mousePoint: Point | undefined,
  image: HTMLImageElement | undefined,
  debug: boolean,
) {
  const [matrix, setMatrix] = React.useState<DOMMatrix>(new DOMMatrix());
  const [isPanning, setIsPanning] = React.useState<boolean>(false);
  const [panStart, setPanStart] = React.useState<Point>(new Point(0, 0));

  React.useEffect(() => {
    if (debug) console.log("panStart", panStart);
  }, [panStart]);

  const centerImage = () => {
    if (!canvasRef.current || !image) return;
    setMatrix(() =>
      new DOMMatrix().translate(
        (canvasRef.current!.width - image.width) / 2,
        (canvasRef.current!.height - image.height) / 2,
      ),
    );
  };

  React.useEffect(() => {
    if (!isPanning || !mousePoint) return;
    console.log("panning");
    setMatrix((prev) =>
      prev.translate(mousePoint.x - panStart.x, mousePoint.y - panStart.y),
    );
  }, [mousePoint]);

  React.useEffect(() => {
    centerImage();
  }, [image, canvasRef.current]);

  const drawPanZoom = (context: CanvasRenderingContext2D): void => {
    const { a, b, c, d, e, f } = matrix;
    context.transform(a, b, c, d, e, f);
  };

  const mouseDownPanZoom: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (!mousePoint) return;
    if (event.button === 2 || event.button === 1) {
      setIsPanning(true);
      setPanStart(mousePoint);
    }
  };

  const mouseUpPanZoom: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (event.button === 2 || event.button === 1) {
      setIsPanning(false);
    }
  };

  const wheelPanZoom: React.WheelEventHandler<HTMLCanvasElement> = (event) => {
    console.log("scrolling");
    event.preventDefault();
    event.stopPropagation();

    if (isPanning || !mousePoint) return;
    const zoom = event.deltaY < 0 ? 1.1 : 0.9;

    setMatrix((prev) =>
      prev
        .translateSelf(mousePoint.x, mousePoint.y)
        .scaleSelf(zoom, zoom)
        .translateSelf(-mousePoint.x, -mousePoint.y),
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
