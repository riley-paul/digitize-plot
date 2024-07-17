import React from "react";
type ContextState = CanvasRenderingContext2D | undefined | null;

export default function use2dContext(
  canvasRef: React.RefObject<HTMLCanvasElement>,
) {
  const [context, setContext] = React.useState<ContextState>(undefined);
  React.useEffect(() => {
    setContext(canvasRef.current?.getContext("2d"));
  }, [canvasRef.current]);

  return context;
}
