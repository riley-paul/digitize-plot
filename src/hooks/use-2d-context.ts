import React from "react";

export default function use2dContext(
  canvasRef: React.RefObject<HTMLCanvasElement>,
): CanvasRenderingContext2D | null {
  return React.useMemo(
    () => canvasRef.current?.getContext("2d") ?? null,
    [canvasRef.current],
  );
}
