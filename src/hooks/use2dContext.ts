import { RefObject, useEffect, useState } from "react";

type ContextState = CanvasRenderingContext2D | undefined | null;

export default function use2dContext(canvasRef: RefObject<HTMLCanvasElement>) {
  const [context, setContext] = useState<ContextState>(undefined);
  useEffect(() => {
    setContext(canvasRef.current?.getContext("2d"));
  }, [canvasRef.current]);

  return context;
}
