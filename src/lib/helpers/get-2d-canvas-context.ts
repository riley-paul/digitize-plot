import type { CanvasRef } from "@/types";

export default function get2dCanvasContext(
  canvasRef: CanvasRef,
): CanvasRenderingContext2D | null {
  return canvasRef.current?.getContext("2d") || null;
}
