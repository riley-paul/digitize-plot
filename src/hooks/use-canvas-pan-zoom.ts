import Point from "src/geometry/point";
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
    centerImage();
  }, [image, canvasRef.current]);

  const mouseDownPanZoom: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (!mousePoint) return;
    if (event.button === 2 || event.button === 1) {
      setIsPanning(true);
      setPanStart(new Point(event.clientX, event.clientY));
    }
  };

  const mouseUpPanZoom: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (event.button === 2 || event.button === 1) {
      setIsPanning(false);
    }
  };

  const mouseMovePanZoom: React.MouseEventHandler<HTMLCanvasElement> = (
    event,
  ) => {
    if (!isPanning) return;
    const deltaX = event.clientX - panStart.x;
    const deltaY = event.clientY - panStart.y;
    setMatrix((prev) => prev.translate(deltaX, deltaY));
    setPanStart(new Point(event.clientX, event.clientY));
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
    matrix,
    mouseDownPanZoom,
    mouseUpPanZoom,
    mouseMovePanZoom,
    wheelPanZoom,
    centerImage,
  };
}
