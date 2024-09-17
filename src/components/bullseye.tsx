import React from "react";
import Point from "src/geometry/point";
import get2dCanvasContext from "@/lib/helpers/get-2d-canvas-context";
import { useInterval } from "usehooks-ts";

export type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  mousePoint: Point | undefined;
};

export default function Bullseye(props: Props) {
  const { canvasRef, mousePoint } = props;

  const ref = React.useRef<HTMLDivElement>(null);
  const [imgUrl, setImgUrl] = React.useState<string | null | undefined>("");
  const context = get2dCanvasContext(canvasRef);

  useInterval(() => setImgUrl(canvasRef.current?.toDataURL()), 10);

  if (!mousePoint || !context) {
    return (
      <div className="relative aspect-square overflow-hidden bg-gray-50"></div>
    );
  }

  const zoom = 3;
  const { x, y } = context
    .getTransform()
    .transformPoint(new DOMPoint(mousePoint.x, mousePoint.y));
  const w = ref.current ? ref.current.offsetWidth : 0;
  const h = ref.current ? ref.current.offsetHeight : 0;

  // console.table({ x, y, w, h });

  return (
    <div
      ref={ref}
      className="relative aspect-square overflow-hidden bg-gray-50"
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${context.canvas.width * zoom}px auto`,
        backgroundPosition: `${w / 2 - x * zoom}px ${h / 2 - y * zoom}px`,
      }}
    >
      <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-muted-foreground opacity-50" />
      <div className="absolute left-1/2 h-full w-px -translate-x-1/2 bg-muted-foreground opacity-50" />
      <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground" />
    </div>
  );
}
