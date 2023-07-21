import { RefObject, useEffect, useRef, useState } from "react";
import Point from "../geometry/Point";

export type Props = {
  canvasRef: RefObject<HTMLCanvasElement>;
  mousePoint: Point | undefined;
};

export default function Bullseye(props: Props) {
  const { canvasRef, mousePoint } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [imgUrl, setImgUrl] = useState<string | null | undefined>("");
  useEffect(() => {
    setImgUrl(canvasRef.current?.toDataURL());
  }, [mousePoint, canvasRef.current]);

  if (!mousePoint || !canvasRef.current) {
    return (
      <div
        ref={ref}
        className="aspect-square relative overflow-hidden bg-gray-50"
      >
        <div className="absolute top-1/2 -translate-y-1/2 h-px w-full bg-gray-500 opacity-50" />
        <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-gray-500 opacity-50" />
        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-gray-700 h-1 w-1 rounded-full" />
      </div>
    );
  }

  const zoom = 3;
  const x = mousePoint.x;
  const y = mousePoint.y;
  const w = ref.current ? ref.current.offsetWidth / 2 : 0;
  const h = ref.current ? ref.current.offsetHeight / 2 : 0;

  return (
    <div
      ref={ref}
      className="aspect-square relative overflow-hidden bg-gray-50"
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${zoom}px auto`,
        backgroundPosition: `${w - x * zoom}px ${h - y * zoom}px`,
      }}
    >
      <div className="absolute top-1/2 -translate-y-1/2 h-px w-full bg-gray-500 opacity-50" />
      <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-gray-500 opacity-50" />
      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-gray-700 h-1 w-1 rounded-full" />
    </div>
  );
}
