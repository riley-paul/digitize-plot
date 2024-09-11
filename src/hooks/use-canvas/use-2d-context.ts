import React from "react";
type ContextState = CanvasRenderingContext2D | undefined | null;

export default function use2dContext(
  canvasRef: React.RefObject<HTMLCanvasElement>,
): ContextState {
  return React.useMemo(
    () => canvasRef.current?.getContext("2d"),
    [canvasRef.current],
  );
}
