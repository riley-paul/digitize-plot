import { RefObject, useEffect, useRef, useState } from "react";
import Point from "@/geometry/Point";
import use2dContext from "@/hooks/useCanvas/use2dContext";

export type Props = {
  canvasRef: RefObject<HTMLCanvasElement>;
  mousePoint: Point | undefined;
};

export default function Bullseye(props: Props) {
  const { canvasRef, mousePoint } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [imgUrl, setImgUrl] = useState<string | null | undefined>("");
  const context = use2dContext(canvasRef);

  useEffect(() => {
    setImgUrl(canvasRef.current?.toDataURL());
  }, [mousePoint, canvasRef.current]);

  if (!mousePoint || !context) {
    return (
      <div className="aspect-square relative overflow-hidden bg-gray-50"></div>
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
      className="aspect-square relative overflow-hidden bg-gray-50"
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${context.canvas.width * zoom}px auto`,
        backgroundPosition: `${w / 2 - x * zoom}px ${h / 2 - y * zoom}px`,
      }}
    >
      <div className="absolute top-1/2 -translate-y-1/2 h-px w-full bg-muted-foreground opacity-50" />
      <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-muted-foreground opacity-50" />
      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-foreground h-1 w-1 rounded-full" />
    </div>
  );
}
